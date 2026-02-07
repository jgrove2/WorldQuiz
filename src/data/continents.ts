import { countries, type Continent } from './countries';

export const CONTINENTS = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
] as const;

// Camera positions for each continent (optimized for best view)
export const CONTINENT_CAMERA_VIEWS: Record<Continent, { lat: number; lng: number; altitude: number }> = {
  'Africa': { lat: 0, lng: 20, altitude: 1.8 },
  'Asia': { lat: 30, lng: 100, altitude: 1.9 },
  'Europe': { lat: 50, lng: 15, altitude: 1.5 },
  'North America': { lat: 40, lng: -100, altitude: 1.7 },
  'South America': { lat: -15, lng: -60, altitude: 1.6 },
  'Oceania': { lat: -25, lng: 140, altitude: 1.7 },
};

// Get all countries for a specific continent
export function getCountriesByContinent(continent: Continent) {
  return countries.filter(country => country.continent === continent);
}

// Get country count by continent
export function getCountryCount(continent: Continent): number {
  return getCountriesByContinent(continent).length;
}

// Get all country counts
export const CONTINENT_COUNTS: Record<Continent, number> = {
  'Africa': 54,
  'Asia': 48,
  'Europe': 44,
  'North America': 23,
  'South America': 12,
  'Oceania': 14,
};
