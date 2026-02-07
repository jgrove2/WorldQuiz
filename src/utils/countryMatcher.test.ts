import { describe, it, expect } from 'vitest';
import { findCountryByName, isCountryGuessed } from './countryMatcher';

describe('countryMatcher', () => {
  describe('findCountryByName', () => {
    it('should find a country by exact name', () => {
      const result = findCountryByName('United States');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('United States');
      expect(result?.code).toBe('USA');
    });

    it('should find a country by alias', () => {
      const result = findCountryByName('USA');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('United States');
      expect(result?.code).toBe('USA');
    });

    it('should be case insensitive', () => {
      const result1 = findCountryByName('UNITED STATES');
      const result2 = findCountryByName('united states');
      const result3 = findCountryByName('United States');
      
      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();
      expect(result3).not.toBeNull();
      expect(result1?.code).toBe('USA');
      expect(result2?.code).toBe('USA');
      expect(result3?.code).toBe('USA');
    });

    it('should handle whitespace in input', () => {
      const result = findCountryByName('  United States  ');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('United States');
    });

    it('should return null for non-existent country', () => {
      const result = findCountryByName('Atlantis');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = findCountryByName('');
      expect(result).toBeNull();
    });

    it('should find countries with alternative names', () => {
      const uk = findCountryByName('UK');
      expect(uk).not.toBeNull();
      expect(uk?.name).toBe('United Kingdom');
      
      const myanmar = findCountryByName('Burma');
      expect(myanmar).not.toBeNull();
      expect(myanmar?.name).toBe('Myanmar');

      const czechia = findCountryByName('Czech Republic');
      expect(czechia).not.toBeNull();
      expect(czechia?.name).toBe('Czechia');
    });

    it('should handle countries with multi-word names', () => {
      const result = findCountryByName('Costa Rica');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Costa Rica');
      expect(result?.code).toBe('CRI');
    });

    it('should handle countries with "and" in their names', () => {
      const result = findCountryByName('Bosnia and Herzegovina');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Bosnia and Herzegovina');
      expect(result?.code).toBe('BIH');
    });

    it('should find country by short alias', () => {
      const result = findCountryByName('US');
      expect(result).not.toBeNull();
      expect(result?.name).toBe('United States');
    });
  });

  describe('isCountryGuessed', () => {
    it('should return true if country code is in guessed set', () => {
      const guessedCodes = new Set(['USA', 'CAN', 'MEX']);
      const result = isCountryGuessed('USA', guessedCodes);
      expect(result).toBe(true);
    });

    it('should return false if country code is not in guessed set', () => {
      const guessedCodes = new Set(['USA', 'CAN', 'MEX']);
      const result = isCountryGuessed('GBR', guessedCodes);
      expect(result).toBe(false);
    });

    it('should return false for empty guessed set', () => {
      const guessedCodes = new Set<string>();
      const result = isCountryGuessed('USA', guessedCodes);
      expect(result).toBe(false);
    });

    it('should handle case sensitivity correctly', () => {
      const guessedCodes = new Set(['USA', 'CAN']);
      expect(isCountryGuessed('USA', guessedCodes)).toBe(true);
      expect(isCountryGuessed('usa', guessedCodes)).toBe(false); // Codes are case-sensitive
    });
  });
});
