import { countries } from '../data/countries';
import type { Country } from '../data/countries';

// Re-export the closest match finder
export { findClosestCountry } from './closestMatch';

/**
 * Normalizes a string for comparison by converting to lowercase and trimming whitespace
 */
const normalize = (str: string): string => {
  return str.toLowerCase().trim();
};

/**
 * Finds a country by matching the input against country names and aliases
 * Returns the matched country or null if no match is found
 */
export const findCountryByName = (input: string): Country | null => {
  const normalizedInput = normalize(input);
  
  if (!normalizedInput) {
    return null;
  }

  // Try to find exact match with country name or aliases
  for (const country of countries) {
    // Check main name
    if (normalize(country.name) === normalizedInput) {
      return country;
    }
    
    // Check aliases
    if (country.aliases.some(alias => normalize(alias) === normalizedInput)) {
      return country;
    }
  }

  return null;
};

/**
 * Checks if a country has already been guessed by its code
 */
export const isCountryGuessed = (countryCode: string, guessedCodes: Set<string>): boolean => {
  return guessedCodes.has(countryCode);
};
