import { useState, useEffect } from 'react';
import { useCity } from '../context/CityContext';

export default function PrayerTimes() {
    const { city } = useCity();
    const [times, setTimes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const fetchPrayerTimes = async () => {
            try {
                const res = await fetch(
                    `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city.name)}&country=${city.country}&method=2`
                );
                const data = await res.json();

                if (data?.data?.timings) {
                    const t = data.data.timings;
                    const now = new Date();
                    const currentVal = now.getHours() * 60 + now.getMinutes();

                    const formatTime = (str) => {
                        const [h, m] = str.split(':');
                        const hNum = parseInt(h, 10);
                        const ampm = hNum >= 12 ? 'PM' : 'AM';
                        const h12 = hNum % 12 || 12;
                        return { time: `${String(h12).padStart(2, '0')}:${m}`, ampm, value: hNum * 60 + parseInt(m, 10) };
                    };

                    const raw = [
                        { name: 'FAJR', ...formatTime(t.Fajr) },
                        { name: 'SUNRISE', ...formatTime(t.Sunrise) },
                        { name: 'DHUHR', ...formatTime(t.Dhuhr) },
                        { name: 'ASR', ...formatTime(t.Asr) },
                        { name: 'MAGHRIB', ...formatTime(t.Maghrib) },
                        { name: 'ISHA', ...formatTime(t.Isha) },
                    ];

                    let nextIdx = raw.findIndex(p => p.value > currentVal);
                    if (nextIdx === -1) nextIdx = 0;

                    setTimes(raw.map((p, i) => ({ ...p, isCurrent: i === nextIdx })));
                    setLoading(false);
                }
            } catch (err) {
                console.error('Failed to fetch prayer times:', err);
                setLoading(false);
            }
        };

        fetchPrayerTimes();
        const interval = setInterval(fetchPrayerTimes, 60000);
        return () => clearInterval(interval);
    }, [city]);

    if (loading) return <div className="h-32 bg-[#111820] animate-pulse rounded-3xl mb-8"></div>;

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Prayer Times
                </h3>
                <span className="text-gray-400 text-sm">{city.name}, Indonesia</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {times.map(prayer => (
                    <div key={prayer.name} className={`relative flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-300 ${prayer.isCurrent ? 'bg-[#1a2530] border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-105 z-10' : 'bg-[#111820] border-white/5 hover:border-white/10'}`}>
                        {prayer.isCurrent && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-400 text-[#0f1715] text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow-md">
                                NEXT
                            </span>
                        )}
                        <span className={`text-xs font-bold tracking-widest mb-3 transition-colors ${prayer.isCurrent ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {prayer.name}
                        </span>
                        <span className={`text-3xl font-bold mb-1 transition-colors ${prayer.isCurrent ? 'text-white' : 'text-gray-300'}`}>{prayer.time}</span>
                        <span className={`text-xs font-medium transition-colors ${prayer.isCurrent ? 'text-emerald-300' : 'text-gray-500'}`}>{prayer.ampm}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
