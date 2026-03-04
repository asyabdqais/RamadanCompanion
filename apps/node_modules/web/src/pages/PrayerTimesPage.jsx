import { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Compass, ChevronDown, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { useCity, INDONESIAN_CITIES } from '../context/CityContext';

// ─── Checklist config ────────────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
    { id: 'fajr', label: 'Shalat Subuh', icon: '🌅' },
    { id: 'dhuhr', label: 'Shalat Dzuhur', icon: '☀️' },
    { id: 'asr', label: 'Shalat Ashar', icon: '🌤️' },
    { id: 'maghrib', label: 'Shalat Maghrib', icon: '🌇' },
    { id: 'isha', label: 'Shalat Isya', icon: '🌙' },
    { id: 'tarawih', label: 'Shalat Tarawih', icon: '🕌' },
    { id: 'tilawah', label: 'Tilawah 1 Juz', icon: '📖' },
    { id: 'sahur', label: 'Sahur', icon: '🍽️' },
    { id: 'sedekah', label: 'Sedekah Hari Ini', icon: '🤲' },
    { id: 'dzikir', label: 'Dzikir Pagi & Petang', icon: '📿' },
];

const CL_KEY = 'ramadan_checklist';
const DATE_KEY = 'ramadan_checklist_date';

function getTodayStr() {
    // Returns YYYY-MM-DD in local time
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadChecklist() {
    const today = getTodayStr();
    const savedDate = localStorage.getItem(DATE_KEY);
    if (savedDate !== today) {
        // New day — reset
        localStorage.setItem(DATE_KEY, today);
        localStorage.removeItem(CL_KEY);
        return {};
    }
    try {
        return JSON.parse(localStorage.getItem(CL_KEY)) || {};
    } catch {
        return {};
    }
}

// ─── DailyChecklist component ────────────────────────────────────────────────
function DailyChecklist() {
    const [checked, setChecked] = useState(() => loadChecklist());

    const toggle = useCallback((id) => {
        setChecked(prev => {
            const next = { ...prev, [id]: !prev[id] };
            localStorage.setItem(CL_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const doneCount = CHECKLIST_ITEMS.filter(it => checked[it.id]).length;
    const total = CHECKLIST_ITEMS.length;
    const percentage = Math.round((doneCount / total) * 100);

    // progress bar color
    const barColor =
        percentage === 100 ? 'bg-emerald-400' :
            percentage >= 60 ? 'bg-emerald-500' :
                percentage >= 30 ? 'bg-amber-500' : 'bg-rose-500';

    return (
        <div className="mt-8 bg-gradient-to-br from-[#0e1f2c] to-[#0A161E] border border-white/5 rounded-3xl p-6 md:p-8">
            {/* Section title */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg font-bold text-white">Amalan Harian Ramadan</h2>
                </div>
                <span className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400 font-medium">{doneCount} dari {total} selesai</span>
                    <span className={`text-sm font-bold ${percentage === 100 ? 'text-emerald-400' : 'text-gray-300'}`}>
                        {percentage}%
                        {percentage === 100 && ' 🎉'}
                    </span>
                </div>
                <div className="h-2.5 w-full bg-[#111820] rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                {percentage === 100 && (
                    <p className="text-center text-emerald-400 text-xs font-semibold mt-2 animate-pulse">
                        MasyaAllah! Semua amalan hari ini telah selesai ✨
                    </p>
                )}
            </div>

            {/* Checklist grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CHECKLIST_ITEMS.map(item => {
                    const isDone = !!checked[item.id];
                    return (
                        <button
                            key={item.id}
                            onClick={() => toggle(item.id)}
                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-left w-full group
                                ${isDone
                                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15'
                                    : 'bg-[#111820] border-white/5 hover:border-white/10 hover:bg-[#161f2b]'
                                }`}
                        >
                            {/* Icon */}
                            <span className="text-xl flex-shrink-0">{item.icon}</span>

                            {/* Label */}
                            <span className={`flex-1 text-sm font-medium transition-colors ${isDone ? 'text-emerald-300 line-through decoration-emerald-500/50' : 'text-gray-200'}`}>
                                {item.label}
                            </span>

                            {/* Check icon */}
                            {isDone
                                ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                : <Circle className="w-5 h-5 text-gray-600 group-hover:text-gray-400 flex-shrink-0 transition-colors" />
                            }
                        </button>
                    );
                })}
            </div>

            <p className="text-center text-xs text-gray-600 mt-5">
                Checklist akan otomatis direset setiap hari 🔄
            </p>
        </div>
    );
}

// ─── Main PrayerTimesPage ─────────────────────────────────────────────────────
export default function PrayerTimesPage() {
    const { city, setCity } = useCity();
    const [times, setTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState('');
    const [showCityPicker, setShowCityPicker] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchPrayerTimes = async () => {
            try {
                const res = await fetch(
                    `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city.name)}&country=${city.country}&method=2`
                );
                const data = await res.json();

                if (data?.data) {
                    const t = data.data.timings;
                    setCurrentDate(
                        `${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year} AH • ${data.data.date.readable}`
                    );

                    const now = new Date();
                    const currentVal = now.getHours() * 60 + now.getMinutes();

                    const formatTime = (str) => {
                        const [h, m] = str.split(':');
                        const hNum = parseInt(h, 10);
                        return {
                            time: `${String(hNum % 12 || 12).padStart(2, '0')}:${m}`,
                            ampm: hNum >= 12 ? 'PM' : 'AM',
                            value: hNum * 60 + parseInt(m, 10),
                        };
                    };

                    const raw = [
                        { name: 'Fajr', icon: '🌅', desc: 'Pre-dawn prayer', ...formatTime(t.Fajr) },
                        { name: 'Sunrise', icon: '⛅', desc: 'Sun rises', ...formatTime(t.Sunrise) },
                        { name: 'Dhuhr', icon: '☀️', desc: 'Noon prayer', ...formatTime(t.Dhuhr) },
                        { name: 'Asr', icon: '🌤️', desc: 'Afternoon prayer', ...formatTime(t.Asr) },
                        { name: 'Maghrib', icon: '🌇', desc: 'Sunset prayer (Iftar)', ...formatTime(t.Maghrib) },
                        { name: 'Isha', icon: '🌙', desc: 'Night prayer', ...formatTime(t.Isha) },
                    ];

                    let nextIdx = raw.findIndex(p => p.value > currentVal);
                    if (nextIdx === -1) nextIdx = 0;

                    setTimes(raw.map((p, i) => ({
                        ...p,
                        isCurrent: i === nextIdx,
                        hasPassed: p.value <= currentVal && i !== nextIdx && currentVal - p.value < 720,
                    })));
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

    return (
        <div className="py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Daily Prayer Times</h1>
                    <p className="text-gray-400 flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        {currentDate || 'Loading date...'}
                    </p>
                </div>

                {/* City Picker */}
                <div className="relative">
                    <button
                        onClick={() => setShowCityPicker(p => !p)}
                        className="bg-[#111820] py-2.5 px-4 rounded-xl border border-white/10 hover:border-emerald-500/30 flex items-center gap-3 transition-colors"
                    >
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-gray-300">{city.name}, Indonesia</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCityPicker ? 'rotate-180' : ''}`} />
                    </button>

                    {showCityPicker && (
                        <div className="absolute top-full right-0 mt-2 bg-[#111820] border border-white/10 rounded-2xl shadow-2xl z-50 w-52 max-h-72 overflow-y-auto">
                            {INDONESIAN_CITIES.map(c => (
                                <button
                                    key={c.name}
                                    onClick={() => { setCity(c); setShowCityPicker(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 ${city.name === c.name ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-gray-300'}`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Prayer Schedule */}
            <div className="bg-gradient-to-br from-[#122A2F] to-[#0A161E] border border-emerald-900/30 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex items-center gap-2 mb-8 relative z-10">
                    <Compass className="text-emerald-400 w-5 h-5" />
                    <h2 className="text-lg font-bold text-white">Today's Schedule</h2>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-24 bg-[#111820]/50 animate-pulse rounded-2xl w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 relative z-10">
                        {times.map(prayer => (
                            <div
                                key={prayer.name}
                                className={`flex items-center justify-between p-5 md:p-6 rounded-2xl transition-all duration-300 border ${prayer.isCurrent
                                    ? 'bg-[#1a2530] border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)] scale-[1.01]'
                                    : prayer.hasPassed
                                        ? 'bg-[#0f151b] border-white/5 opacity-50'
                                        : 'bg-[#111820] border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl md:text-3xl ${prayer.isCurrent ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                                        {prayer.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className={`text-xl font-bold ${prayer.isCurrent ? 'text-emerald-400' : 'text-white'}`}>{prayer.name}</h3>
                                            {prayer.isCurrent && (
                                                <span className="bg-emerald-500 text-[#0f1715] text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                                                    UPCOMING
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">{prayer.desc}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-2xl md:text-3xl font-bold font-mono tracking-tight ${prayer.isCurrent ? 'text-white' : 'text-gray-300'}`}>{prayer.time}</div>
                                    <div className={`text-xs md:text-sm font-medium ${prayer.isCurrent ? 'text-emerald-400' : 'text-gray-500'}`}>{prayer.ampm}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Daily Checklist ── */}
            <DailyChecklist />
        </div>
    );
}
