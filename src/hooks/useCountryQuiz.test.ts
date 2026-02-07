import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountryQuiz } from './useCountryQuiz';

describe('useCountryQuiz', () => {
  it('should initialize with empty guessed countries', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    expect(result.current.guessedCount).toBe(0);
    expect(result.current.guessedCountryCodes.size).toBe(0);
    expect(result.current.totalCountries).toBe(196);
  });

  it('should return correct when guessing a valid country', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    let guessResult;
    act(() => {
      guessResult = result.current.handleGuess('United States');
    });
    
    expect(guessResult).toBe('correct');
    expect(result.current.guessedCount).toBe(1);
    expect(result.current.guessedCountryCodes.has('USA')).toBe(true);
  });

  it('should return incorrect when guessing an invalid country', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    let guessResult;
    act(() => {
      guessResult = result.current.handleGuess('Atlantis');
    });
    
    expect(guessResult).toBe('incorrect');
    expect(result.current.guessedCount).toBe(0);
  });

  it('should return duplicate when guessing the same country twice', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    let firstGuess, secondGuess;
    act(() => {
      firstGuess = result.current.handleGuess('Canada');
    });
    
    act(() => {
      secondGuess = result.current.handleGuess('Canada');
    });
    
    expect(firstGuess).toBe('correct');
    expect(secondGuess).toBe('duplicate');
    expect(result.current.guessedCount).toBe(1);
  });

  it('should handle multiple correct guesses', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    act(() => {
      result.current.handleGuess('United States');
      result.current.handleGuess('Canada');
      result.current.handleGuess('Mexico');
    });
    
    expect(result.current.guessedCount).toBe(3);
    expect(result.current.guessedCountryCodes.has('USA')).toBe(true);
    expect(result.current.guessedCountryCodes.has('CAN')).toBe(true);
    expect(result.current.guessedCountryCodes.has('MEX')).toBe(true);
  });

  it('should handle country aliases correctly', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    let firstGuess, secondGuess;
    act(() => {
      firstGuess = result.current.handleGuess('USA');
    });
    
    act(() => {
      secondGuess = result.current.handleGuess('United States');
    });
    
    expect(firstGuess).toBe('correct');
    expect(secondGuess).toBe('duplicate');
    expect(result.current.guessedCount).toBe(1);
  });

  it('should reset quiz to initial state', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    act(() => {
      result.current.handleGuess('United States');
      result.current.handleGuess('Canada');
      result.current.handleGuess('Mexico');
    });
    
    expect(result.current.guessedCount).toBe(3);
    
    act(() => {
      result.current.resetQuiz();
    });
    
    expect(result.current.guessedCount).toBe(0);
    expect(result.current.guessedCountryCodes.size).toBe(0);
  });

  it('should handle empty string input', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    let guessResult;
    act(() => {
      guessResult = result.current.handleGuess('');
    });
    
    expect(guessResult).toBe('incorrect');
    expect(result.current.guessedCount).toBe(0);
  });

  it('should handle whitespace-only input', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    let guessResult;
    act(() => {
      guessResult = result.current.handleGuess('   ');
    });
    
    expect(guessResult).toBe('incorrect');
    expect(result.current.guessedCount).toBe(0);
  });

  it('should be case insensitive', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    let guessResult;
    act(() => {
      guessResult = result.current.handleGuess('UNITED STATES');
    });
    
    expect(guessResult).toBe('correct');
    expect(result.current.guessedCount).toBe(1);
    expect(result.current.guessedCountryCodes.has('USA')).toBe(true);
  });

  it('should maintain immutability of guessedCountryCodes set', () => {
    const { result } = renderHook(() => useCountryQuiz());
    
    const initialSet = result.current.guessedCountryCodes;
    
    act(() => {
      result.current.handleGuess('United States');
    });
    
    // The set reference should be different after an update
    expect(result.current.guessedCountryCodes).not.toBe(initialSet);
  });
});
