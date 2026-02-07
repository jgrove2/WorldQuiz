import React from 'react';
import type { Continent } from '../data/countries';

interface CounterProps {
  guessedCount: number;
  totalCount: number;
  selectedContinent?: Continent | null;
}

export const Counter: React.FC<CounterProps> = ({ guessedCount, totalCount, selectedContinent }) => {
  const displayText = selectedContinent 
    ? `${guessedCount}/${totalCount} countries (${selectedContinent})`
    : `${guessedCount}/${totalCount} countries`;

  return (
    <div style={{
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: '20px',
      textAlign: 'center',
    }}>
      {displayText}
    </div>
  );
};
