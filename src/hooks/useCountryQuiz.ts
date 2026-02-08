import { useState, useCallback, useMemo } from 'react';
import { findCountryByName, isCountryGuessed, findClosestCountry } from '../utils/countryMatcher';
import { TOTAL_COUNTRIES, countries, type Continent } from '../data/countries';
import { getCountriesByContinent } from '../data/continents';
import type { GameMode } from './useNavigation';

export type GuessResult = 
  | { type: 'correct' }
  | { type: 'duplicate' }
  | { type: 'incorrect'; suggestion?: string }
  | { type: 'wrong-continent'; suggestion?: string };

export interface UseCountryQuizOptions {
  gameMode?: GameMode;
  selectedContinent?: Continent | null;
}

export interface UseCountryQuizReturn {
  guessedCountryCodes: Set<string>;
  guessedCount: number;
  totalCountries: number;
  handleGuess: (input: string) => GuessResult;
  resetQuiz: () => void;
}

export const useCountryQuiz = ({ 
  gameMode = 'world', 
  selectedContinent = null 
}: UseCountryQuizOptions = {}): UseCountryQuizReturn => {
  const [guessedCountryCodes, setGuessedCountryCodes] = useState<Set<string>>(new Set());

  // Filter countries based on game mode and selected continent
  const availableCountries = useMemo(() => {
    if (gameMode === 'world' || !selectedContinent) {
      return TOTAL_COUNTRIES;
    }
    return getCountriesByContinent(selectedContinent).length;
  }, [gameMode, selectedContinent]);

  // Get the set of valid country codes for the current mode
  const validCountryCodes = useMemo(() => {
    if (gameMode === 'world' || !selectedContinent) {
      return null; // null means all countries are valid
    }
    return new Set(getCountriesByContinent(selectedContinent).map(c => c.code));
  }, [gameMode, selectedContinent]);

  const handleGuess = useCallback((input: string): GuessResult => {
    const country = findCountryByName(input);

    if (!country) {
      // Find closest match in available countries for suggestion
      const availableCountryList = validCountryCodes 
        ? getCountriesByContinent(selectedContinent!) 
        : countries;
      
      const closestMatch = findClosestCountry(input, availableCountryList);
      
      return { 
        type: 'incorrect', 
        suggestion: closestMatch?.name 
      };
    }

    // Check if country belongs to the selected continent in continent mode
    if (validCountryCodes && !validCountryCodes.has(country.code)) {
      // Find closest match in current continent for suggestion
      const continentCountries = getCountriesByContinent(selectedContinent!);
      const closestMatch = findClosestCountry(input, continentCountries);
      
      return { 
        type: 'wrong-continent', 
        suggestion: closestMatch?.name 
      };
    }

    if (isCountryGuessed(country.code, guessedCountryCodes)) {
      return { type: 'duplicate' };
    }

    // Add the country to guessed set
    setGuessedCountryCodes(prev => new Set(prev).add(country.code));
    return { type: 'correct' };
  }, [guessedCountryCodes, validCountryCodes, selectedContinent]);

  const resetQuiz = useCallback(() => {
    setGuessedCountryCodes(new Set());
  }, []);

  return {
    guessedCountryCodes,
    guessedCount: guessedCountryCodes.size,
    totalCountries: availableCountries,
    handleGuess,
    resetQuiz,
  };
};
