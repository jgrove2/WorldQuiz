import React, { useMemo } from 'react';
import type { Country, Continent } from '../data/countries';

interface CountryListProps {
  countries: Country[];
  guessedCountryCodes: Set<string>;
  gameMode?: 'world' | 'continent';
  selectedContinent?: Continent | null;
}

export const CountryList: React.FC<CountryListProps> = ({ 
  countries, 
  guessedCountryCodes,
  gameMode = 'world',
  selectedContinent 
}) => {
  // Sort countries alphabetically by name
  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name));
  }, [countries]);

  // Determine if a country has been guessed
  const isGuessed = (countryCode: string) => {
    return guessedCountryCodes.has(countryCode);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header */}
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333333',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '12px',
      }}>
        {gameMode === 'continent' && selectedContinent
          ? `Countries in ${selectedContinent} (${sortedCountries.length})`
          : `All Countries (${sortedCountries.length})`
        }
      </div>

      {/* Country Grid */}
      <div
        className="country-list-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '8px 16px',
          padding: '8px 4px 8px 0',
        }}
      >
        {sortedCountries.map((country, index) => {
          const guessed = isGuessed(country.code);
          const displayText = guessed ? country.name : '???';
          
          return (
            <div
              key={country.code}
              className={`country-list-item ${guessed ? 'guessed' : 'unguessed'}`}
              style={{
                fontSize: '14px',
                lineHeight: '1.8',
                color: guessed ? '#333333' : '#999999',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                transition: 'all 0.3s ease',
                opacity: guessed ? 1 : 0.7,
                cursor: guessed ? 'default' : 'default',
                padding: '4px 8px',
                borderRadius: '4px',
              }}
              aria-label={guessed ? `${index + 1}. ${country.name}` : `${index + 1}. Not yet guessed`}
            >
              <span style={{ fontWeight: '500', color: '#666666' }}>
                {index + 1}.
              </span>{' '}
              <span 
                className={guessed ? 'country-name-revealed' : 'country-name-hidden'}
                style={{
                  display: 'inline-block',
                }}
              >
                {displayText}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scrollbar styling */}
      <style>{`
        /* Country list item animations */
        .country-list-item.guessed:hover {
          background-color: #f0f8ff;
          transform: translateX(2px);
        }
        
        /* Smooth reveal animation for country names */
        .country-name-revealed {
          animation: revealCountry 0.4s ease-out forwards;
        }
        
        @keyframes revealCountry {
          0% {
            opacity: 0;
            transform: translateY(-4px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        
        /* Custom scrollbar for country list */
        .country-list-grid::-webkit-scrollbar {
          width: 10px;
        }
        .country-list-grid::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 4px;
        }
        .country-list-grid::-webkit-scrollbar-thumb {
          background: #cccccc;
          border-radius: 4px;
        }
        .country-list-grid::-webkit-scrollbar-thumb:hover {
          background: #999999;
        }
        
        /* Firefox scrollbar */
        .country-list-grid {
          scrollbar-width: thin;
          scrollbar-color: #cccccc #f5f5f5;
        }
      `}</style>
    </div>
  );
};
