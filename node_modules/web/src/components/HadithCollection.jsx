import { useState, useEffect } from 'react';
import { Book, RefreshCw, Loader2 } from 'lucide-react';

const FALLBACK_HADITHS = [
    { text: "Barangsiapa yang berpuasa Ramadhan karena iman dan mengharap pahala, maka diampuni dosa-dosanya yang telah lalu.", narrator: "HR. Bukhari & Muslim" },
    { text: "Berdoalah kepada Allah dalam keadaan yakin akan dikabulkan, dan ketahuilah bahwa Allah tidak mengabulkan doa dari hati yang lalai dan lengah.", narrator: "HR. Tirmidzi" },
    { text: "Senyummu di hadapan saudaramu adalah sedekah.", narrator: "HR. Tirmidzi" },
    { text: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.", narrator: "HR. Ahmad" },
    { text: "Agama itu adalah nasihat.", narrator: "HR. Muslim" }
];

export default function HadithCollection() {
    const [hadith, setHadith] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchHadith = async () => {
        setLoading(true);
        // Using a slight delay to make the transition smoother if it's too fast
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * FALLBACK_HADITHS.length);
            setHadith(FALLBACK_HADITHS[randomIndex]);
            setLoading(false);
        }, 500);
    };

    useEffect(() => {
        fetchHadith();
    }, []);

    return (
        <div className="bg-[#111820] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-700"></div>

            <div className="relative z-10 w-full">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        Hadith of the Day
                    </h3>
                    <button
                        onClick={fetchHadith}
                        disabled={loading}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-amber-400 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="min-h-[160px] flex flex-col justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                            <p className="text-xs text-gray-500">Mencari hikmah...</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-lg md:text-xl text-gray-200 font-medium mb-6 leading-relaxed italic">
                                "{hadith?.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                                    <Book className="w-4 h-4 text-amber-400" />
                                </div>
                                <span className="text-amber-300/80 text-sm font-semibold tracking-wide">
                                    {hadith?.narrator}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
