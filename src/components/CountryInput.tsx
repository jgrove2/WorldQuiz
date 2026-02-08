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
  const [suggestion, setSuggestion] = useState<string | null>(null);
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

    if (result.type === 'correct') {
      setShowCheckmark(true);
      setInput('');
      setSuggestion(null);
      setTimeout(() => setShowCheckmark(false), 1500);
    } else if (result.type === 'duplicate') {
      setFeedback('Already guessed!');
      setInput('');
      setSuggestion(null);
      setTimeout(() => setFeedback(''), 1500);
    } else if (result.type === 'wrong-continent') {
      const msg = result.suggestion 
        ? `✗ Not in ${selectedContinent} - Did you mean`
        : `✗ Not in ${selectedContinent}`;
      setFeedback(msg);
      setSuggestion(result.suggestion || null);
      setTimeout(() => {
        setFeedback('');
        setSuggestion(null);
      }, 3000); // Longer timeout for reading and clicking
    } else if (result.type === 'incorrect') {
      const msg = result.suggestion 
        ? `✗ Not found - Did you mean`
        : '✗ Not found';
      setFeedback(msg);
      setSuggestion(result.suggestion || null);
      setTimeout(() => {
        setFeedback('');
        setSuggestion(null);
      }, 3000); // Longer timeout for reading and clicking
    }
  };

  const handleSuggestionClick = () => {
    if (suggestion) {
      setInput(suggestion);
      setFeedback('');
      setSuggestion(null);
      inputRef.current?.focus();
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
      
      {/* Feedback message with clickable suggestion */}
      {feedback && (
        <div style={{
          marginTop: '10px',
          fontSize: '16px',
          color: feedback.includes('Already') ? '#fbbf24' : '#f87171',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span>{feedback}</span>
          {suggestion && (
            <span
              onClick={handleSuggestionClick}
              style={{
                color: '#3b82f6',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#3b82f6';
              }}
            >
              {suggestion}
            </span>
          )}
          {suggestion && <span>?</span>}
        </div>
      )}
    </div>
  );
};
