import type { Country } from '../data/countries';
import { levenshteinDistance } from './levenshtein';

/**
 * Normalizes a string for comparison by converting to lowercase and trimming whitespace
 */
const normalize = (str: string): string => {
  return str.toLowerCase().trim();
};

/**
 * Interface for a close match result
 */
export interface CloseMatch {
  country: Country;
  distance: number;
}

/**
 * Find the closest matching country name based on Levenshtein distance
 * Returns the country if a close match is found (distance <= 2), otherwise null
 * 
 * @param input - The user's input string
 * @param availableCountries - List of countries to search through
 * @returns The closest matching country or null if no close match exists
 * 
 * @example
 * findClosestCountry('Gana', countries) // returns Ghana
 * findClosestCountry('Fance', countries) // returns France
 * findClosestCountry('XYZ', countries) // returns null
 */
export function findClosestCountry(
  input: string,
  availableCountries: Country[]
): Country | null {
  const normalizedInput = normalize(input);
  
  if (!normalizedInput) {
    return null;
  }

  const THRESHOLD = 2; // Maximum edit distance to consider a match
  let bestMatch: CloseMatch | null = null;

  for (const country of availableCountries) {
    // Check distance against country name
    const nameDistance = levenshteinDistance(
      normalizedInput,
      normalize(country.name)
    );

    if (nameDistance <= THRESHOLD) {
      if (!bestMatch || nameDistance < bestMatch.distance) {
        bestMatch = { country, distance: nameDistance };
      } else if (nameDistance === bestMatch.distance) {
        // If tied, prefer alphabetically first country
        if (country.name < bestMatch.country.name) {
          bestMatch = { country, distance: nameDistance };
        }
      }
    }

    // Also check aliases
    for (const alias of country.aliases) {
      const aliasDistance = levenshteinDistance(
        normalizedInput,
        normalize(alias)
      );

      if (aliasDistance <= THRESHOLD) {
        if (!bestMatch || aliasDistance < bestMatch.distance) {
          bestMatch = { country, distance: aliasDistance };
        } else if (aliasDistance === bestMatch.distance) {
          // If tied, prefer alphabetically first country
          if (country.name < bestMatch.country.name) {
            bestMatch = { country, distance: aliasDistance };
          }
        }
      }
    }
  }

  return bestMatch?.country || null;
}
