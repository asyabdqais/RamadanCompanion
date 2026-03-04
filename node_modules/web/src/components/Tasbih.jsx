import { useState, useEffect } from 'react';
import { RotateCcw, Hand } from 'lucide-react';

export default function Tasbih() {
    const [count, setCount] = useState(0);
    const [sessions, setSessions] = useState(0);
    const target = 100;

    // Load initial state from local storage on mount
    useEffect(() => {
        const savedSessions = localStorage.getItem('tasbih_sessions');
        if (savedSessions) {
            setSessions(parseInt(savedSessions, 10));
        }
    }, []);

    const handleCount = () => {
        const newCount = count + 1;
        setCount(newCount);

        // Auto-reset and increment session when target reached
        if (newCount >= target) {
            setTimeout(() => {
                setCount(0);
                const newSessions = sessions + 1;
                setSessions(newSessions);
                localStorage.setItem('tasbih_sessions', newSessions.toString());
            }, 500); // Small delay to show the target reached briefly
        }
    };

    const handleReset = () => {
        setCount(0);
    };

    return (
        <div className="bg-[#111820] border border-white/5 rounded-3xl p-8 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="flex justify-between items-start mb-8 relative z-10">
                <h3 className="text-lg font-bold text-white">Tasbih Digital</h3>
                <span className="text-gray-400 text-xs font-bold tracking-widest">SUBHANALLAH</span>
            </div>

            <div className="flex flex-col items-center justify-center mb-10 relative z-10">
                <span className="text-7xl md:text-8xl font-bold text-white mb-2">{count}</span>
                <span className="text-emerald-400 text-xs font-bold tracking-widest">TARGET: {target}</span>
            </div>

            <div className="flex gap-4 mb-8 mt-auto relative z-10">
                <button
                    onClick={handleCount}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 transition-colors text-[#0f1715] py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 duration-150"
                >
                    <Hand className="w-5 h-5" />
                    Count
                </button>
                <button
                    onClick={handleReset}
                    className="w-16 h-16 flex items-center justify-center bg-[#1E2730] hover:bg-[#25303A] transition-colors text-gray-400 rounded-2xl active:scale-95 duration-150"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>
            </div>

            <div className="bg-[#0b1116] rounded-2xl p-4 flex divide-x divide-white/5 relative z-10">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-gray-500 font-bold tracking-widest mb-1">TOTAL SESSIONS</span>
                    <span className="text-white font-bold text-base">{sessions}</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-gray-500 font-bold tracking-widest mb-1">DAY STREAK</span>
                    <span className="text-emerald-400 font-bold text-base">Current</span>
                </div>
            </div>
        </div>
    );
}
