import { useState, useEffect, useCallback } from 'react';
import { Compass, Navigation, LocateFixed, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useCity } from '../context/CityContext';

export default function QiblaCompass() {
    const { city } = useCity();
    const [qiblaDirection, setQiblaDirection] = useState(0); // Bearing from North to Kaaba
    const [heading, setHeading] = useState(0); // Device's current heading from North
    const [isSupported, setIsSupported] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState(null);
    const [coords, setCoords] = useState({ lat: city.lat, lng: city.lng });
    const [usingGPS, setUsingGPS] = useState(false);

    // Calculate Qibla Bearing (Static degree from True North)
    const calculateQibla = useCallback((lat, lng) => {
        const kaabaLat = 21.4225 * (Math.PI / 180);
        const kaabaLng = 39.8262 * (Math.PI / 180);
        const uLat = lat * (Math.PI / 180);
        const uLng = lng * (Math.PI / 180);

        const deltaLng = kaabaLng - uLng;
        const y = Math.sin(deltaLng);
        const x = Math.cos(uLat) * Math.tan(kaabaLat) - Math.sin(uLat) * Math.cos(deltaLng);
        let qibla = Math.atan2(y, x) * (180 / Math.PI);
        return (qibla + 360) % 360;
    }, []);

    // Initial calculation based on city context
    useEffect(() => {
        if (!usingGPS) {
            setQiblaDirection(calculateQibla(city.lat, city.lng));
            setCoords({ lat: city.lat, lng: city.lng });
        }
    }, [city, calculateQibla, usingGPS]);

    // Handle Orientation Data
    const handleOrientation = (event) => {
        // webkitCompassHeading is for iOS, alpha is for Android (if absolute is true)
        let compass = event.webkitCompassHeading || (360 - event.alpha);
        if (compass !== undefined) {
            setHeading(compass);
        }
    };

    // Request Permissions and Start Sensors
    const startCompass = async () => {
        setError(null);

        // 1. Get GPS Location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setCoords({ lat: latitude, lng: longitude });
                    setQiblaDirection(calculateQibla(latitude, longitude));
                    setUsingGPS(true);
                },
                (err) => {
                    console.warn("GPS access denied, using city fallback");
                    setError("Location access denied. Using city fallback.");
                }
            );
        }

        // 2. Start Orientation Sensor
        try {
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                // iOS 13+ requirement
                const response = await DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                    setIsActive(true);
                } else {
                    setError("Orientation permission denied.");
                }
            } else if ('ondeviceorientationabsolute' in window) {
                window.addEventListener('deviceorientationabsolute', handleOrientation, true);
                setIsActive(true);
            } else if ('ondeviceorientation' in window) {
                window.addEventListener('deviceorientation', handleOrientation, true);
                setIsActive(true);
            } else {
                setIsSupported(false);
                setError("Compass not supported on this browser.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to start compass sensors.");
        }
    };

    // The angle the needle should rotate relative to the device's North
    // rotate(0) means needle points up (Device North).
    // result = QiblaBearing - DeviceHeading
    const rotation = (qiblaDirection - heading + 360) % 360;
    const isAligned = Math.abs(rotation) < 5 || Math.abs(rotation - 360) < 5;

    return (
        <div className="bg-[#111820] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden group min-h-[450px]">
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full pointer-events-none transition-colors duration-1000 ${isAligned && isActive ? 'bg-emerald-400/20' : 'bg-emerald-500/5'}`}></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`}></span>
                            Qibla Compass
                        </h3>
                        <p className="text-[10px] text-gray-500 font-medium tracking-tight mt-0.5">
                            {usingGPS ? 'USING LIVE GPS' : `LOCKED TO ${city.name.toUpperCase()}`}
                        </p>
                    </div>
                    <Compass className={`w-6 h-6 transition-colors duration-500 ${isAligned && isActive ? 'text-emerald-400' : 'text-emerald-400/40'}`} />
                </div>

                {!isActive ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                            <Navigation className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h4 className="text-white font-bold mb-2 text-lg">Activate Sensors</h4>
                        <p className="text-gray-400 text-sm mb-8 max-w-[200px]">
                            We need GPS and motion sensors to show real-time Qibla direction.
                        </p>
                        <button
                            onClick={startCompass}
                            className="bg-emerald-500 hover:bg-emerald-400 text-[#0A161E] px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            <LocateFixed className="w-4 h-4" />
                            START COMPASS
                        </button>
                        {error && (
                            <div className="mt-4 flex items-center gap-2 text-rose-400 text-xs font-medium">
                                <ShieldAlert className="w-3 h-3" />
                                {error}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-4">
                        <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
                            {/* Compass Outer Ring */}
                            <div className="absolute inset-0 border-2 border-white/10 rounded-full shadow-inner"></div>

                            {/* Degrees Dial */}
                            <div
                                className="absolute inset-2 border border-white/5 rounded-full transition-transform duration-200"
                                style={{ transform: `rotate(${-heading}deg)` }}
                            >
                                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-white/40">N</span>
                                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-gray-600">S</span>
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-600">W</span>
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-600">E</span>
                            </div>

                            {/* Qibla Indicator (The actual target) */}
                            <div
                                className="relative w-full h-full transition-transform duration-300 ease-out"
                                style={{ transform: `rotate(${rotation}deg)` }}
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                    <div className={`transition-all duration-500 ${isAligned ? 'scale-125' : 'scale-100'}`}>
                                        <Navigation className={`w-10 h-10 fill-current drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] ${isAligned ? 'text-emerald-400' : 'text-emerald-500/60'}`} />
                                    </div>
                                    <div className={`w-0.5 h-16 transition-all duration-500 ${isAligned ? 'bg-emerald-400 bg-opacity-100' : 'bg-emerald-500/20'}`}></div>
                                </div>
                            </div>

                            {/* Center Hub */}
                            <div className={`absolute w-4 h-4 rounded-full z-20 shadow-xl transition-colors duration-500 ${isAligned ? 'bg-emerald-400' : 'bg-white'}`}></div>
                        </div>

                        <div className="mt-8 text-center bg-[#0b131c] px-6 py-3 rounded-3xl border border-white/5">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <p className="text-3xl font-mono font-black text-white leading-none">
                                    {Math.round(qiblaDirection)}°
                                </p>
                                {isAligned && <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />}
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                                {isAligned ? 'ALIGNED WITH KAABA' : 'BEARING TO QIBLA'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="text-center mt-4 relative z-10">
                <p className="text-[10px] text-gray-600 font-medium">
                    {usingGPS
                        ? `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E`
                        : `Default: ${city.name}`}
                </p>
            </div>
        </div>
    );
}
