import React, { useState, useRef, useEffect } from 'react';
import type { GuessResult } from '../hooks/useCountryQuiz';
import type { Continent } from '../data/countries';

interface CountryInputProps {
  onGuess: (input: string) => GuessResult;
  selectedContinent?: Continent | null;
}

export const CountryInput: React.FC<CountryInputProps> = ({ onGuess, selectedContinent }) => {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [showCheckmark, setShowCheckmark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic placeholder based on selected continent
  const placeholder = selectedContinent 
    ? `Guess ${selectedContinent === 'Africa' ? 'an African' : 
         selectedContinent === 'Asia' ? 'an Asian' :
         selectedContinent === 'Europe' ? 'a European' :
         selectedContinent === 'Oceania' ? 'an Oceanian' :
         `a ${selectedContinent}`} country...`
    : 'Guess a country...';

  useEffect(() => {
    // Auto-focus the input on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      return;
    }

    const result = onGuess(input);

    if (result === 'correct') {
      setShowCheckmark(true);
      setInput('');
      setTimeout(() => setShowCheckmark(false), 1500);
    } else if (result === 'duplicate') {
      setFeedback('Already guessed!');
      setInput('');
      setTimeout(() => setFeedback(''), 1500);
    } else if (result === 'wrong-continent') {
      setFeedback(`✗ Not in ${selectedContinent}`);
      setTimeout(() => setFeedback(''), 1500);
    } else {
      setFeedback('✗ Not found');
      setTimeout(() => setFeedback(''), 1500);
    }
  };

  return (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          style={{
            padding: '12px 20px',
            fontSize: '18px',
            width: '400px',
            maxWidth: '90vw',
            backgroundColor: '#ffffff',
            color: '#333333',
            border: '2px solid #cccccc',
            borderRadius: '8px',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#999999';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#cccccc';
          }}
        />
        
        {/* Green checkmark next to input */}
        {showCheckmark && (
          <div style={{
            fontSize: '32px',
            color: '#2ecc71',
            fontWeight: 'bold',
            animation: 'fadeIn 0.2s ease-in',
          }}>
            ✓
          </div>
        )}
      </form>
      
      {/* Error messages below */}
      {feedback && (
        <div style={{
          marginTop: '10px',
          fontSize: '16px',
          color: feedback.includes('Already') ? '#fbbf24' : '#f87171',
          fontWeight: '500',
        }}>
          {feedback}
        </div>
      )}
    </div>
  );
};
