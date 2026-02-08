import React, { useEffect, useRef } from 'react';
import type { Continent } from '../data/countries';

interface CounterProps {
  guessedCount: number;
  totalCount: number;
  selectedContinent?: Continent | null;
}

export const Counter: React.FC<CounterProps> = ({ guessedCount, totalCount, selectedContinent }) => {
  const prevCountRef = useRef(guessedCount);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger animation when guessed count changes
    if (prevCountRef.current !== guessedCount && counterRef.current) {
      counterRef.current.classList.remove('counter-pulse');
      // Force reflow to restart animation
      void counterRef.current.offsetWidth;
      counterRef.current.classList.add('counter-pulse');
    }
    prevCountRef.current = guessedCount;
  }, [guessedCount]);

  const displayText = selectedContinent 
    ? `${guessedCount}/${totalCount} countries (${selectedContinent})`
    : `${guessedCount}/${totalCount} countries`;

  return (
    <>
      <div 
        ref={counterRef}
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          marginBottom: '20px',
          textAlign: 'center',
          transition: 'transform 0.2s ease',
        }}
      >
        {displayText}
      </div>
      
      <style>{`
        @keyframes counterPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
            color: #4CAF50;
          }
          100% {
            transform: scale(1);
          }
        }
        
        .counter-pulse {
          animation: counterPulse 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
