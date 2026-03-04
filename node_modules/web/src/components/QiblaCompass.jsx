import { useState, useEffect } from 'react';
import { Compass, Navigation } from 'lucide-react';
import { useCity } from '../context/CityContext';

export default function QiblaCompass() {
    const { city } = useCity();
    const [qiblaDirection, setQiblaDirection] = useState(0);

    useEffect(() => {
        // Calculate Qibla Direction
        // Formula: q = atan2(sin(Δλ), cos(φ)tan(φ_k) - sin(φ)cos(Δλ))
        // Kaaba Coordinates: 21.4225° N, 39.8262° E

        const kaabaLat = 21.4225 * (Math.PI / 180);
        const kaabaLng = 39.8262 * (Math.PI / 180);

        const userLat = city.lat * (Math.PI / 180);
        const userLng = city.lng * (Math.PI / 180);

        const deltaLng = kaabaLng - userLng;

        const y = Math.sin(deltaLng);
        const x = Math.cos(userLat) * Math.tan(kaabaLat) - Math.sin(userLat) * Math.cos(deltaLng);

        let qibla = Math.atan2(y, x) * (180 / Math.PI);
        qibla = (qibla + 360) % 360;

        setQiblaDirection(qibla);
    }, [city]);

    return (
        <div className="bg-[#111820] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Qibla Direction
                    </h3>
                    <Compass className="text-emerald-400/50 w-6 h-6" />
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                    <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
                        {/* Compass Ring */}
                        <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
                        <div className="absolute inset-4 border border-white/5 rounded-full border-dashed"></div>

                        {/* Cardinal Points */}
                        <span className="absolute top-1 text-[10px] font-bold text-gray-500">N</span>
                        <span className="absolute bottom-1 text-[10px] font-bold text-gray-500">S</span>
                        <span className="absolute left-1 text-[10px] font-bold text-gray-500">W</span>
                        <span className="absolute right-1 text-[10px] font-bold text-gray-500">E</span>

                        {/* Qibla Needle */}
                        <div
                            className="relative w-full h-full transition-transform duration-1000 ease-out"
                            style={{ transform: `rotate(${qiblaDirection}deg)` }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
                                <Navigation className="text-emerald-400 w-8 h-8 fill-emerald-400" />
                                <div className="w-1 h-12 bg-gradient-to-t from-transparent to-emerald-400/50 rounded-full"></div>
                            </div>
                        </div>

                        {/* Center Point */}
                        <div className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] z-20"></div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-2xl font-mono font-bold text-white mb-1">
                            {Math.round(qiblaDirection)}°
                        </p>
                        <p className="text-sm text-gray-400 font-medium">
                            Direction from North
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-gray-500 italic mt-4 relative z-10">
                Location set to {city.name}
            </p>
        </div>
    );
}
