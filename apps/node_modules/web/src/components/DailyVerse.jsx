import { useState, useEffect } from 'react';
import { Quote, Share2, BookOpen, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Collection of verses to rotate through (one for each hour of the day)
// surahNumber: global surah number used to navigate directly into QuranPage
const verses = [
    { text: "O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.", reference: "Surah Al-Baqarah (2:183)", surahNumber: 2 },
    { text: "The month of Ramadhan [is that] in which was revealed the Qur'an, a guidance for the people and clear proofs of guidance and criterion.", reference: "Surah Al-Baqarah (2:185)", surahNumber: 2 },
    { text: "And when My servants ask you, [O Muhammad], concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.", reference: "Surah Al-Baqarah (2:186)", surahNumber: 2 },
    { text: "Indeed, We sent the Qur'an down during the Night of Decree.", reference: "Surah Al-Qadr (97:1)", surahNumber: 97 },
    { text: "The Night of Decree is better than a thousand months.", reference: "Surah Al-Qadr (97:3)", surahNumber: 97 },
    { text: "Indeed, Allah is with the patient.", reference: "Surah Al-Baqarah (2:153)", surahNumber: 2 },
    { text: "And He found you lost and guided [you].", reference: "Surah Ad-Duhaa (93:7)", surahNumber: 93 },
    { text: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.", reference: "Surah Al-Baqarah (2:152)", surahNumber: 2 },
    { text: "Indeed, with hardship [will be] ease.", reference: "Surah Ash-Sharh (94:6)", surahNumber: 94 },
    { text: "Allah does not charge a soul except [with that within] its capacity.", reference: "Surah Al-Baqarah (2:286)", surahNumber: 2 },
    { text: "And whoever relies upon Allah - then He is sufficient for him.", reference: "Surah At-Talaq (65:3)", surahNumber: 65 },
    { text: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.", reference: "Surah Al-Baqarah (2:153)", surahNumber: 2 },
    { text: "My mercy encompasses all things.", reference: "Surah Al-A'raf (7:156)", surahNumber: 7 },
    { text: "And He is with you wherever you are.", reference: "Surah Al-Hadid (57:4)", surahNumber: 57 },
    { text: "Say, 'O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah.'", reference: "Surah Az-Zumar (39:53)", surahNumber: 39 },
    { text: "Indeed, my Lord is Near and Responsive.", reference: "Surah Hud (11:61)", surahNumber: 11 },
    { text: "Call upon Me; I will respond to you.", reference: "Surah Ghafir (40:60)", surahNumber: 40 },
    { text: "And whoever fears Allah - He will make for him a way out And will provide for him from where he does not expect.", reference: "Surah At-Talaq (65:2-3)", surahNumber: 65 },
    { text: "Unquestionably, by the remembrance of Allah hearts are assured.", reference: "Surah Ar-Ra'd (13:28)", surahNumber: 13 },
    { text: "Allah wants to lighten your burdens, for human beings were created weak.", reference: "Surah An-Nisa (4:28)", surahNumber: 4 },
    { text: "Our Lord, do not impose blame upon us if we have forgotten or erred.", reference: "Surah Al-Baqarah (2:286)", surahNumber: 2 },
    { text: "And We have certainly made the Qur'an easy for remembrance, so is there any who will remember?", reference: "Surah Al-Qamar (54:17)", surahNumber: 54 },
    { text: "Indeed, those who believe and do righteous deeds - for them are the Gardens of Pleasure.", reference: "Surah Luqman (31:8)", surahNumber: 31 },
    { text: "Peace it is until the emergence of dawn.", reference: "Surah Al-Qadr (97:5)", surahNumber: 97 },
];

export default function DailyVerse() {
    const [currentVerse, setCurrentVerse] = useState(verses[0]);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const updateVerse = () => {
            const currentHour = new Date().getHours();
            setCurrentVerse(verses[currentHour]);
        };
        updateVerse();
        const intervalId = setInterval(updateVerse, 60000);
        return () => clearInterval(intervalId);
    }, []);

    // ── Navigate to Quran page and open the surah directly ──────────────────
    const handleReadSurah = () => {
        navigate(`/quran?surah=${currentVerse.surahNumber}`);
    };

    // ── Share via Web Share API (native) or fallback copy-to-clipboard ───────
    const handleShare = async () => {
        const shareText = `"${currentVerse.text}"\n— ${currentVerse.reference}\n\n📖 Baca lebih lanjut di Ramadan Companion`;
        const shareData = {
            title: 'Ayat Al-Quran — Ramadan Companion',
            text: shareText,
            url: window.location.origin,
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch {
                // User cancelled or share failed — fall through to clipboard
            }
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(`${shareText}\n${window.location.origin}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Last resort: prompt
            prompt('Salin teks berikut untuk dibagikan:', shareText);
        }
    };

    return (
        <div className="bg-[#111820] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-700" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Hourly Verse
                    </h3>
                    <Quote className="text-indigo-400/50 w-6 h-6" fill="currentColor" />
                </div>

                <div className="min-h-[140px] flex flex-col justify-center">
                    <p className="text-xl md:text-2xl text-gray-300 italic mb-4 leading-relaxed font-serif transition-opacity duration-500">
                        "{currentVerse.text}"
                    </p>
                </div>

                <p className="text-indigo-300/80 text-sm mb-8 font-medium tracking-wide">
                    — {currentVerse.reference}
                </p>
            </div>

            <div className="flex gap-3 mt-auto relative z-10">
                {/* Read Surah button — navigates to QuranPage with the surah pre-opened */}
                <button
                    onClick={handleReadSurah}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1A2235] hover:bg-[#202940] hover:text-indigo-200 transition-all text-indigo-300 py-3 rounded-2xl text-sm font-medium border border-indigo-500/10 hover:border-indigo-500/30"
                >
                    <BookOpen className="w-4 h-4" />
                    Read Surah
                </button>

                {/* Share button */}
                <button
                    onClick={handleShare}
                    title={copied ? 'Tersalin!' : 'Bagikan ayat ini'}
                    className={`w-12 h-12 flex items-center justify-center transition-all rounded-2xl border ${copied
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-[#1A2235] hover:bg-[#202940] text-gray-400 hover:text-white border-white/5 hover:border-white/10'
                        }`}
                >
                    {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                </button>
            </div>

            {/* Clipboard feedback toast */}
            {copied && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-bounce z-20 whitespace-nowrap">
                    ✓ Teks tersalin ke clipboard!
                </div>
            )}
        </div>
    );
}
