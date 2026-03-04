import Countdown from '../components/Countdown';
import PrayerTimes from '../components/PrayerTimes';
import DailyVerse from '../components/DailyVerse';
import Tasbih from '../components/Tasbih';
import QiblaCompass from '../components/QiblaCompass';
import HadithCollection from '../components/HadithCollection';

export default function Dashboard() {
    return (
        <div className="py-2 space-y-8">
            <Countdown />
            <PrayerTimes />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                <DailyVerse />
                <HadithCollection />
                <Tasbih />
                <QiblaCompass />
            </div>
        </div>
    );
}
