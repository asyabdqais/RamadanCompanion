import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Search, ChevronLeft, ChevronRight, Loader2,
    Bookmark, BookmarkCheck, Play, Pause, Volume2
} from 'lucide-react';

// ── Bookmark helpers (localStorage) ──────────────────────────────────────────
const BK_KEY = 'quran_bookmarks';

function loadBookmarks() {
    try {
        return JSON.parse(localStorage.getItem(BK_KEY)) || [];
    } catch {
        return [];
    }
}

function saveBookmarks(bks) {
    localStorage.setItem(BK_KEY, JSON.stringify(bks));
}

// ── Audio URL builder (alafasy reciter via alquran.cloud CDN) ────────────────
// Format: https://cdn.islamic.network/quran/audio/128/ar.alafasy/{globalVerseNumber}.mp3
function buildAudioUrl(globalNumber) {
    return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNumber}.mp3`;
}

// ── AyahAudio: play/pause button for a single verse ─────────────────────────
function AyahAudio({ globalNumber, playingId, setPlayingId }) {
    const audioRef = useRef(null);
    const isPlaying = playingId === globalNumber;

    useEffect(() => {
        // When another verse starts playing, pause this one
        if (!isPlaying && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [isPlaying]);

    const toggle = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setPlayingId(null);
        } else {
            setPlayingId(globalNumber);
            audioRef.current.play().catch(() => { });
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={buildAudioUrl(globalNumber)}
                preload="none"
                onEnded={() => setPlayingId(null)}
            />
            <button
                onClick={toggle}
                title={isPlaying ? 'Pause' : 'Play Murotal'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${isPlaying
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-[#0d1b24] text-gray-400 border-white/5 hover:text-emerald-400 hover:border-emerald-500/30'
                    }`}
            >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isPlaying ? 'Playing' : 'Murotal'}
                <Volume2 className="w-3 h-3 opacity-60" />
            </button>
        </>
    );
}

// ── SurahList ────────────────────────────────────────────────────────────────
function SurahList({ surahs, onSelect, searchQuery, setSearchQuery, bookmarks, onOpenBookmarks }) {
    const filtered = surahs.filter(s =>
        s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.number.toString().includes(searchQuery)
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Al-Qur'an</h1>
                    <p className="text-gray-400 text-sm">Read the Holy Qur'an — 114 Surahs</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Bookmarks button */}
                    <button
                        onClick={onOpenBookmarks}
                        className="relative flex items-center gap-2 bg-[#111820] hover:bg-[#1a2530] border border-white/10 hover:border-emerald-500/30 px-4 py-2.5 rounded-xl text-sm text-gray-300 hover:text-emerald-400 transition-all flex-shrink-0"
                    >
                        <Bookmark className="w-4 h-4" />
                        Bookmarks
                        {bookmarks.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                                {bookmarks.length}
                            </span>
                        )}
                    </button>
                    {/* Search */}
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search Surah..."
                            className="w-full bg-[#111820] border border-white/10 text-white placeholder-gray-500 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/60 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(surah => (
                    <button
                        key={surah.number}
                        onClick={() => onSelect(surah)}
                        className="group flex items-center gap-4 bg-[#111820] hover:bg-[#1a2530] border border-white/5 hover:border-emerald-500/30 rounded-2xl p-4 text-left transition-all duration-200 w-full"
                    >
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-emerald-500/10 group-hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-colors">
                            <span className="text-emerald-400 font-bold text-sm">{surah.number}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                                <p className="font-bold text-white text-sm truncate group-hover:text-emerald-400 transition-colors">{surah.englishName}</p>
                                <p className="text-lg font-arabic text-emerald-300 flex-shrink-0">{surah.name}</p>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 flex-shrink-0 transition-colors" />
                    </button>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-gray-500">
                    <Search className="w-12 h-12 mb-4 opacity-30" />
                    <p>No Surah found for "<span className="text-gray-400">{searchQuery}</span>"</p>
                </div>
            )}
        </div>
    );
}

// ── BookmarksPanel ────────────────────────────────────────────────────────────
function BookmarksPanel({ bookmarks, onClose, onRemove, onGoToSurah, surahs }) {
    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-gray-400 hover:text-white bg-[#111820] hover:bg-[#1a2530] border border-white/5 hover:border-white/10 px-4 py-2 rounded-xl text-sm transition-all"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Bookmarks</h1>
                    <p className="text-gray-400 text-sm">{bookmarks.length} saved verse{bookmarks.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {bookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3">
                    <Bookmark className="w-12 h-12 opacity-30" />
                    <p>No bookmarks yet. Tap the bookmark icon on any verse!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {bookmarks.map(bk => {
                        const surah = surahs.find(s => s.number === bk.surahNumber);
                        return (
                            <div
                                key={`${bk.surahNumber}-${bk.numberInSurah}`}
                                className="bg-[#111820] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 transition-all group"
                            >
                                {/* Meta */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                            <span className="text-emerald-400 text-xs font-bold">{bk.numberInSurah}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {surah ? `${surah.englishName} (${bk.surahNumber})` : `Surah ${bk.surahNumber}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {surah && (
                                            <button
                                                onClick={() => onGoToSurah(surah)}
                                                className="text-xs text-emerald-400 hover:text-emerald-300 underline transition-colors"
                                            >
                                                Open Surah
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onRemove(bk.surahNumber, bk.numberInSurah)}
                                            className="text-gray-500 hover:text-red-400 transition-colors"
                                            title="Remove bookmark"
                                        >
                                            <BookmarkCheck className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-right text-2xl md:text-3xl font-arabic text-white leading-[2.5] py-6 mb-4" dir="rtl">
                                    {bk.arabic}
                                </p>
                                {bk.english && (
                                    <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3 italic">
                                        {bk.english}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ── SurahReader ───────────────────────────────────────────────────────────────
function SurahReader({ surah, onBack, bookmarks, setBookmarks }) {
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTranslation, setShowTranslation] = useState(true);
    const [playingId, setPlayingId] = useState(null); // global ayah number

    useEffect(() => {
        const fetchVerses = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,en.sahih`
                );
                const data = await res.json();
                if (data.data && data.data.length === 2) {
                    const arabic = data.data[0].ayahs;
                    const english = data.data[1].ayahs;
                    const combined = arabic.map((ayah, i) => {
                        let text = ayah.text;
                        // Strip Bismillah prefix if not Al-Fatihah (1) or At-Tawbah (9)
                        if (surah.number !== 1 && surah.number !== 9 && i === 0) {
                            const bismillah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ";
                            if (text.startsWith(bismillah)) {
                                text = text.replace(bismillah, "");
                            }
                        }
                        return {
                            number: ayah.number,           // global verse number (for audio)
                            numberInSurah: ayah.numberInSurah,
                            arabic: text,
                            english: english[i]?.text || '',
                        };
                    });
                    setVerses(combined);
                }
            } catch (err) {
                console.error('Failed to fetch verses:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchVerses();
        setPlayingId(null);
    }, [surah.number]);

    const isBookmarked = (numberInSurah) =>
        bookmarks.some(b => b.surahNumber === surah.number && b.numberInSurah === numberInSurah);

    const toggleBookmark = (verse) => {
        const exists = isBookmarked(verse.numberInSurah);
        let updated;
        if (exists) {
            updated = bookmarks.filter(
                b => !(b.surahNumber === surah.number && b.numberInSurah === verse.numberInSurah)
            );
        } else {
            updated = [
                ...bookmarks,
                {
                    surahNumber: surah.number,
                    numberInSurah: verse.numberInSurah,
                    arabic: verse.arabic,
                    english: verse.english,
                },
            ];
        }
        setBookmarks(updated);
        saveBookmarks(updated);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white bg-[#111820] hover:bg-[#1a2530] border border-white/5 hover:border-white/10 px-4 py-2 rounded-xl text-sm transition-all"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{surah.englishName}</h1>
                    <p className="text-gray-400 text-sm">{surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs</p>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={() => setShowTranslation(t => !t)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors border ${showTranslation ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-[#111820] text-gray-400 border-white/5'}`}
                    >
                        Translation
                    </button>
                    <span className="text-2xl font-arabic text-emerald-300">{surah.name}</span>
                </div>
            </div>

            {/* Bismillah */}
            {surah.number !== 9 && (
                <div className="bg-gradient-to-r from-[#122A2F] to-[#0A161E] border border-emerald-900/30 rounded-2xl p-6 text-center mb-6">
                    <p className="text-2xl md:text-3xl font-arabic text-emerald-300 tracking-wider leading-loose">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                    <p className="text-gray-400 text-sm mt-2">In the name of Allah, the Most Gracious, the Most Merciful</p>
                </div>
            )}

            {/* Verses */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-emerald-400 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="text-gray-400 text-sm">Loading verses...</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {verses.map(verse => (
                        <div
                            key={verse.numberInSurah}
                            className="bg-[#111820] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 transition-all group"
                        >
                            {/* Verse header row */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-emerald-400 text-xs font-bold">{verse.numberInSurah}</span>
                                </div>
                                <div className="h-px flex-1 bg-white/5 group-hover:bg-emerald-500/10 transition-colors" />

                                {/* Murotal button */}
                                <AyahAudio
                                    globalNumber={verse.number}
                                    playingId={playingId}
                                    setPlayingId={setPlayingId}
                                />

                                {/* Bookmark button */}
                                <button
                                    onClick={() => toggleBookmark(verse)}
                                    title={isBookmarked(verse.numberInSurah) ? 'Remove bookmark' : 'Bookmark this verse'}
                                    className={`p-1.5 rounded-lg transition-all border ${isBookmarked(verse.numberInSurah)
                                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                                        : 'text-gray-500 border-transparent hover:text-emerald-400 hover:border-emerald-500/20'
                                        }`}
                                >
                                    {isBookmarked(verse.numberInSurah)
                                        ? <BookmarkCheck className="w-4 h-4" />
                                        : <Bookmark className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Arabic */}
                            <p className="text-right text-3xl md:text-4xl font-arabic text-white leading-[2.5] py-8 mb-6" dir="rtl">
                                {verse.arabic}
                            </p>

                            {/* Translation */}
                            {showTranslation && (
                                <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4 italic">
                                    {verse.english}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Main QuranPage ────────────────────────────────────────────────────────────
// view: 'list' | 'reader' | 'bookmarks'
export default function QuranPage() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [view, setView] = useState('list'); // 'list' | 'reader' | 'bookmarks'
    const [bookmarks, setBookmarks] = useState(loadBookmarks);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const res = await fetch('https://api.alquran.cloud/v1/surah');
                const data = await res.json();
                if (data.data) {
                    setSurahs(data.data);
                    // Auto-open surah if ?surah=N is in the URL
                    const surahParam = parseInt(searchParams.get('surah'), 10);
                    if (surahParam) {
                        const found = data.data.find(s => s.number === surahParam);
                        if (found) {
                            setSelectedSurah(found);
                            setView('reader');
                            // Clean the query param from the URL without a re-render loop
                            setSearchParams({}, { replace: true });
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch Surahs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSurahs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelect = (surah) => {
        setSelectedSurah(surah);
        setView('reader');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setSelectedSurah(null);
        setView('list');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleOpenBookmarks = () => {
        setView('bookmarks');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRemoveBookmark = (surahNumber, numberInSurah) => {
        const updated = bookmarks.filter(
            b => !(b.surahNumber === surahNumber && b.numberInSurah === numberInSurah)
        );
        setBookmarks(updated);
        saveBookmarks(updated);
    };

    const handleGoToSurah = (surah) => {
        setSelectedSurah(surah);
        setView('reader');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="py-6">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-emerald-400">
                    <Loader2 className="w-12 h-12 animate-spin" />
                    <p className="text-gray-400 text-sm">Loading Al-Qur'an...</p>
                </div>
            ) : view === 'reader' && selectedSurah ? (
                <SurahReader
                    surah={selectedSurah}
                    onBack={handleBack}
                    bookmarks={bookmarks}
                    setBookmarks={setBookmarks}
                />
            ) : view === 'bookmarks' ? (
                <BookmarksPanel
                    bookmarks={bookmarks}
                    onClose={() => setView('list')}
                    onRemove={handleRemoveBookmark}
                    onGoToSurah={handleGoToSurah}
                    surahs={surahs}
                />
            ) : (
                <SurahList
                    surahs={surahs}
                    onSelect={handleSelect}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    bookmarks={bookmarks}
                    onOpenBookmarks={handleOpenBookmarks}
                />
            )}
        </div>
    );
}
