import { useState, useCallback, useMemo } from 'react';
import { findCountryByName, isCountryGuessed } from '../utils/countryMatcher';
import { TOTAL_COUNTRIES, type Continent } from '../data/countries';
import { getCountriesByContinent } from '../data/continents';
import type { GameMode } from './useNavigation';

export type GuessResult = 'correct' | 'duplicate' | 'incorrect' | 'wrong-continent';

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
      return 'incorrect';
    }

    // Check if country belongs to the selected continent in continent mode
    if (validCountryCodes && !validCountryCodes.has(country.code)) {
      return 'wrong-continent';
    }

    if (isCountryGuessed(country.code, guessedCountryCodes)) {
      return 'duplicate';
    }

    // Add the country to guessed set
    setGuessedCountryCodes(prev => new Set(prev).add(country.code));
    return 'correct';
  }, [guessedCountryCodes, validCountryCodes]);

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
