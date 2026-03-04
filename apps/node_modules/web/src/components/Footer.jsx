import { Moon, Github, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-12 py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                    <span>© 2026 Ramadan Companion by Qais. Built for spiritual growth.</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <a
                    href="https://github.com/asyabdqais"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-gray-500 hover:text-emerald-400 transition-colors"
                >
                    <Github className="w-4 h-4" />
                    <span className="hidden sm:inline">GITHUB</span>
                </a>
                <a
                    href="https://instagram.com/asyabdqais"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-gray-500 hover:text-pink-500 transition-colors"
                >
                    <Instagram className="w-4 h-4" />
                    <span className="hidden sm:inline">INSTAGRAM</span>
                </a>
                <a
                    href="https://linkedin.com/in/Asyajj abdul qois"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-gray-500 hover:text-blue-500 transition-colors"
                >
                    <Linkedin className="w-4 h-4" />
                    <span className="hidden sm:inline">LINKEDIN</span>
                </a>
            </div>
        </footer>
    );
}
