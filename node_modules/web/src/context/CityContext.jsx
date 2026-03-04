import { createContext, useContext, useState } from 'react';

export const INDONESIAN_CITIES = [
    { name: 'Jakarta', country: 'ID', lat: -6.2088, lng: 106.8456 },
    { name: 'Surabaya', country: 'ID', lat: -7.2575, lng: 112.7521 },
    { name: 'Bandung', country: 'ID', lat: -6.9175, lng: 107.6191 },
    { name: 'Medan', country: 'ID', lat: 3.5952, lng: 98.6722 },
    { name: 'Semarang', country: 'ID', lat: -6.9667, lng: 110.4167 },
    { name: 'Makassar', country: 'ID', lat: -5.1476, lng: 119.4327 },
    { name: 'Palembang', country: 'ID', lat: -2.9761, lng: 104.7754 },
    { name: 'Tangerang', country: 'ID', lat: -6.1783, lng: 106.6319 },
    { name: 'Depok', country: 'ID', lat: -6.4025, lng: 106.7942 },
    { name: 'Bekasi', country: 'ID', lat: -6.2383, lng: 106.9756 },
    { name: 'Yogyakarta', country: 'ID', lat: -7.7956, lng: 110.3695 },
    { name: 'Malang', country: 'ID', lat: -7.9666, lng: 112.6326 },
    { name: 'Bogor', country: 'ID', lat: -6.5944, lng: 106.7892 },
    { name: 'Batam', country: 'ID', lat: 1.1301, lng: 104.0529 },
    { name: 'Denpasar', country: 'ID', lat: -8.65, lng: 115.2167 },
    { name: 'Banjarmasin', country: 'ID', lat: -3.3167, lng: 114.5917 },
    { name: 'Pekanbaru', country: 'ID', lat: 0.5071, lng: 101.4478 },
    { name: 'Padang', country: 'ID', lat: -0.9471, lng: 100.4172 },
    { name: 'Pontianak', country: 'ID', lat: -0.0263, lng: 109.3425 },
    { name: 'Samarinda', country: 'ID', lat: -0.5022, lng: 117.1536 },
    { name: 'Manado', country: 'ID', lat: 1.4748, lng: 124.8421 },
    { name: 'Balikpapan', country: 'ID', lat: -1.2651, lng: 116.8312 },
    { name: 'Aceh', country: 'ID', lat: 5.5483, lng: 95.3238 },
    { name: 'Kupang', country: 'ID', lat: -10.1772, lng: 123.607 },
];

const CityContext = createContext(null);

export function CityProvider({ children }) {
    const [city, setCity] = useState(INDONESIAN_CITIES[16]); // Default: Jakarta
    return (
        <CityContext.Provider value={{ city, setCity }}>
            {children}
        </CityContext.Provider>
    );
}

export function useCity() {
    return useContext(CityContext);
}
