import { useState, useCallback } from 'react';
import type { Continent } from '../data/countries';

export type GameMode = 'world' | 'continent';
export type NavigationMode = 'world' | 'africa' | 'asia' | 'europe' | 'northamerica' | 'southamerica' | 'oceania';

const modeToContinent = (mode: NavigationMode): Continent | null => {
  switch (mode) {
    case 'africa':
      return 'Africa';
    case 'asia':
      return 'Asia';
    case 'europe':
      return 'Europe';
    case 'northamerica':
      return 'North America';
    case 'southamerica':
      return 'South America';
    case 'oceania':
      return 'Oceania';
    case 'world':
      return null;
    default:
      return null;
  }
};

export function useNavigation() {
  const [activeMode, setActiveMode] = useState<NavigationMode>('world');

  const setMode = useCallback((mode: NavigationMode) => {
    setActiveMode(mode);
  }, []);

  const getContinent = useCallback((): Continent | null => {
    return modeToContinent(activeMode);
  }, [activeMode]);

  const isWorldMode = activeMode === 'world';
  const gameMode: GameMode = isWorldMode ? 'world' : 'continent';

  return {
    activeMode,
    setMode,
    getContinent,
    isWorldMode,
    gameMode,
  };
}
