import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CityProvider } from './context/CityContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import PrayerTimesPage from './pages/PrayerTimesPage';
import QuranPage from './pages/QuranPage';

function App() {
    return (
        <CityProvider>
            <Router>
                <div className="min-h-screen bg-[#0A1014] font-sans selection:bg-emerald-500/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/prayer-times" element={<PrayerTimesPage />} />
                                <Route path="/quran" element={<QuranPage />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </div>
            </Router>
        </CityProvider>
    );
}

export default App;
