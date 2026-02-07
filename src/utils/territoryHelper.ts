import { TERRITORY_MAPPINGS, TERRITORY_TO_PARENT, TERRITORY_NAMES } from '../data/territories';
import { countries } from '../data/countries';

/**
 * Get all territory codes for a given country
 */
export const getTerritoriesForCountry = (countryCode: string): string[] => {
  return TERRITORY_MAPPINGS[countryCode] || [];
};

/**
 * Get all codes (main + territories) for a country
 */
export const getAllCodesForCountry = (countryCode: string): string[] => {
  return [countryCode, ...getTerritoriesForCountry(countryCode)];
};

/**
 * Check if a code is a territory and get its parent country code
 */
export const getParentCountry = (territoryCode: string): string | null => {
  return TERRITORY_TO_PARENT[territoryCode] || null;
};

/**
 * Check if a polygon should be highlighted based on guessed countries
 * Includes both direct matches and territories
 */
export const isPolygonGuessed = (polygonCode: string, guessedCountryCodes: Set<string>): boolean => {
  // Direct match
  if (guessedCountryCodes.has(polygonCode)) {
    return true;
  }
  
  // Check if this is a territory of any guessed country
  const parentCode = getParentCountry(polygonCode);
  if (parentCode && guessedCountryCodes.has(parentCode)) {
    return true;
  }
  
  return false;
};

/**
 * Get display name for a territory with parent country info
 */
export const getTerritoryDisplayName = (territoryCode: string, isGuessed: boolean): string => {
  const parentCode = getParentCountry(territoryCode);
  
  if (!isGuessed) {
    return '?';
  }
  
  const territoryName = TERRITORY_NAMES[territoryCode] || '?';
  
  if (parentCode) {
    const parentCountry = countries.find(c => c.code === parentCode);
    const parentName = parentCountry?.name || parentCode;
    return `${territoryName} (${parentName})`;
  }
  
  return territoryName;
};
