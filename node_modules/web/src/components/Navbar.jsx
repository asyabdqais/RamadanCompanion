import { useState } from 'react';
import { Moon, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { to: '/', label: 'Dashboard' },
        { to: '/prayer-times', label: 'Prayer Times' },
        { to: '/quran', label: "Qur'an" },
    ];

    return (
        <nav className="text-white border-b border-white/5 mb-8">
            {/* Top bar */}
            <div className="flex items-center justify-between py-5">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                    <Moon className="text-emerald-400 w-6 h-6 fill-current" />
                    <span className="font-bold text-lg">Ramadan Companion</span>
                </Link>

                {/* Desktop links — centered */}
                <div className="hidden md:flex flex-1 justify-center items-center gap-8 text-sm text-gray-400">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`font-medium pb-2 transition-colors border-b-2 ${isActive(to)
                                    ? 'text-emerald-400 border-emerald-400'
                                    : 'hover:text-white border-transparent hover:border-white/50'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Spacer on desktop to balance logo */}
                <div className="hidden md:block w-[160px]" />

                {/* Hamburger button — mobile only */}
                <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile slide-down drawer */}
            {menuOpen && (
                <div className="md:hidden flex flex-col pb-4 gap-1">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={() => setMenuOpen(false)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(to)
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
