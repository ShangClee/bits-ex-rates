/**
 * Currency Configuration Module Tests
 * Tests for currency data and utility functions
 */

import { describe, test, expect } from '@jest/globals';
import {
  currencies,
  getCurrenciesByGroup,
  getPopularCurrencies,
  getCurrencyCodes,
  getCurrency
} from '../../../src/modules/data/currency-config.js';

describe('Currency Configuration Module', () => {
  describe('currencies object', () => {
    test('should contain expected currency codes', () => {
      const expectedCodes = ['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'cny', 'sek', 'nzd', 'mxn', 'sgd', 'hkd', 'nok', 'try', 'zar', 'brl', 'inr', 'krw', 'twd'];
      expectedCodes.forEach(code => {
        expect(currencies).toHaveProperty(code);
      });
    });

    test('should have proper structure for each currency', () => {
      Object.entries(currencies).forEach(([code, config]) => {
        expect(config).toHaveProperty('name');
        expect(config).toHaveProperty('symbol');
        expect(config).toHaveProperty('flag');
        expect(config).toHaveProperty('amount');
        expect(config).toHaveProperty('precision');
        expect(config).toHaveProperty('group');
        expect(config).toHaveProperty('popular');

        expect(typeof config.name).toBe('string');
        expect(typeof config.symbol).toBe('string');
        expect(typeof config.flag).toBe('string');
        expect(typeof config.amount).toBe('number');
        expect(typeof config.precision).toBe('number');
        expect(typeof config.group).toBe('string');
        expect(typeof config.popular).toBe('boolean');

        expect(config.name.length).toBeGreaterThan(0);
        expect(config.symbol.length).toBeGreaterThan(0);
        expect(config.flag.length).toBeGreaterThan(0);
        expect(config.amount).toBeGreaterThan(0);
        expect(config.precision).toBeGreaterThanOrEqual(0);
      });
    });

    test('should have valid groups', () => {
      const validGroups = ['americas', 'europe', 'asia', 'oceania', 'africa'];
      Object.values(currencies).forEach(config => {
        expect(validGroups).toContain(config.group);
      });
    });

    test('should have reasonable precision values', () => {
      Object.values(currencies).forEach(config => {
        expect(config.precision).toBeGreaterThanOrEqual(0);
        expect(config.precision).toBeLessThanOrEqual(4);
      });
    });

    test('should have reasonable amount values', () => {
      Object.values(currencies).forEach(config => {
        expect(config.amount).toBeGreaterThan(0);
        expect(config.amount).toBeLessThanOrEqual(1000);
      });
    });
  });

  describe('specific currency configurations', () => {
    test('should have correct USD configuration', () => {
      expect(currencies.usd).toEqual({
        name: 'US Dollar',
        symbol: '$',
        flag: '🇺🇸',
        amount: 1,
        precision: 2,
        group: 'americas',
        popular: true
      });
    });

    test('should have correct EUR configuration', () => {
      expect(currencies.eur).toEqual({
        name: 'Euro',
        symbol: '€',
        flag: '🇪🇺',
        amount: 1,
        precision: 2,
        group: 'europe',
        popular: true
      });
    });

    test('should have correct JPY configuration', () => {
      expect(currencies.jpy).toEqual({
        name: 'Japanese Yen',
        symbol: '¥',
        flag: '🇯🇵',
        amount: 100,
        precision: 0,
        group: 'asia',
        popular: true
      });
    });

    test('should have correct KRW configuration', () => {
      expect(currencies.krw).toEqual({
        name: 'South Korean Won',
        symbol: '₩',
        flag: '🇰🇷',
        amount: 1000,
        precision: 0,
        group: 'asia',
        popular: false
      });
    });
  });

  describe('getCurrenciesByGroup', () => {
    test('should return currencies from Americas group', () => {
      const americasCurrencies = getCurrenciesByGroup('americas');
      const expectedCodes = ['usd', 'cad', 'mxn', 'brl'];
      
      expect(Object.keys(americasCurrencies)).toEqual(expect.arrayContaining(expectedCodes));
      Object.values(americasCurrencies).forEach(config => {
        expect(config.group).toBe('americas');
      });
    });

    test('should return currencies from Europe group', () => {
      const europeCurrencies = getCurrenciesByGroup('europe');
      const expectedCodes = ['eur', 'gbp', 'chf', 'sek', 'nok', 'try'];
      
      expect(Object.keys(europeCurrencies)).toEqual(expect.arrayContaining(expectedCodes));
      Object.values(europeCurrencies).forEach(config => {
        expect(config.group).toBe('europe');
      });
    });

    test('should return currencies from Asia group', () => {
      const asiaCurrencies = getCurrenciesByGroup('asia');
      const expectedCodes = ['jpy', 'cny', 'sgd', 'hkd', 'inr', 'krw', 'twd'];
      
      expect(Object.keys(asiaCurrencies)).toEqual(expect.arrayContaining(expectedCodes));
      Object.values(asiaCurrencies).forEach(config => {
        expect(config.group).toBe('asia');
      });
    });

    test('should return currencies from Oceania group', () => {
      const oceaniaCurrencies = getCurrenciesByGroup('oceania');
      const expectedCodes = ['aud', 'nzd'];
      
      expect(Object.keys(oceaniaCurrencies)).toEqual(expect.arrayContaining(expectedCodes));
      Object.values(oceaniaCurrencies).forEach(config => {
        expect(config.group).toBe('oceania');
      });
    });

    test('should return currencies from Africa group', () => {
      const africaCurrencies = getCurrenciesByGroup('africa');
      const expectedCodes = ['zar'];
      
      expect(Object.keys(africaCurrencies)).toEqual(expect.arrayContaining(expectedCodes));
      Object.values(africaCurrencies).forEach(config => {
        expect(config.group).toBe('africa');
      });
    });

    test('should return empty object for non-existent group', () => {
      const result = getCurrenciesByGroup('nonexistent');
      expect(result).toEqual({});
    });

    test('should return empty object for empty string group', () => {
      const result = getCurrenciesByGroup('');
      expect(result).toEqual({});
    });
  });

  describe('getPopularCurrencies', () => {
    test('should return only popular currencies', () => {
      const popularCurrencies = getPopularCurrencies();
      const expectedPopularCodes = ['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'cny', 'inr'];
      
      expect(Object.keys(popularCurrencies)).toEqual(expect.arrayContaining(expectedPopularCodes));
      Object.values(popularCurrencies).forEach(config => {
        expect(config.popular).toBe(true);
      });
    });

    test('should not include non-popular currencies', () => {
      const popularCurrencies = getPopularCurrencies();
      const nonPopularCodes = ['chf', 'sek', 'nzd', 'mxn', 'sgd', 'hkd', 'nok', 'try', 'zar', 'brl', 'krw', 'twd'];
      
      nonPopularCodes.forEach(code => {
        expect(popularCurrencies).not.toHaveProperty(code);
      });
    });

    test('should return at least some currencies', () => {
      const popularCurrencies = getPopularCurrencies();
      expect(Object.keys(popularCurrencies).length).toBeGreaterThan(0);
    });
  });

  describe('getCurrencyCodes', () => {
    test('should return array of all currency codes', () => {
      const codes = getCurrencyCodes();
      expect(Array.isArray(codes)).toBe(true);
      expect(codes.length).toBe(20);
      
      const expectedCodes = ['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'cny', 'sek', 'nzd', 'mxn', 'sgd', 'hkd', 'nok', 'try', 'zar', 'brl', 'inr', 'krw', 'twd'];
      expect(codes).toEqual(expect.arrayContaining(expectedCodes));
    });

    test('should return codes in consistent order', () => {
      const codes1 = getCurrencyCodes();
      const codes2 = getCurrencyCodes();
      expect(codes1).toEqual(codes2);
    });

    test('should return lowercase codes', () => {
      const codes = getCurrencyCodes();
      codes.forEach(code => {
        expect(code).toBe(code.toLowerCase());
        expect(code.length).toBe(3);
      });
    });
  });

  describe('getCurrency', () => {
    test('should return currency configuration for valid codes', () => {
      const usdConfig = getCurrency('usd');
      expect(usdConfig).toEqual(currencies.usd);
      
      const eurConfig = getCurrency('eur');
      expect(eurConfig).toEqual(currencies.eur);
      
      const jpyConfig = getCurrency('jpy');
      expect(jpyConfig).toEqual(currencies.jpy);
    });

    test('should return null for invalid codes', () => {
      expect(getCurrency('invalid')).toBeNull();
      expect(getCurrency('xyz')).toBeNull();
      expect(getCurrency('btc')).toBeNull();
    });

    test('should return null for empty or null inputs', () => {
      expect(getCurrency('')).toBeNull();
      expect(getCurrency(null)).toBeNull();
      expect(getCurrency(undefined)).toBeNull();
    });

    test('should be case sensitive', () => {
      expect(getCurrency('USD')).toBeNull();
      expect(getCurrency('Usd')).toBeNull();
      expect(getCurrency('usd')).not.toBeNull();
    });

    test('should return immutable reference to currency config', () => {
      const config1 = getCurrency('usd');
      const config2 = getCurrency('usd');
      expect(config1).toBe(config2); // Same reference
      expect(config1).toEqual(currencies.usd);
    });
  });

  describe('data integrity', () => {
    test('should have unique currency symbols where possible', () => {
      const symbols = Object.values(currencies).map(config => config.symbol);
      const duplicateSymbols = symbols.filter((symbol, index) => symbols.indexOf(symbol) !== index);
      
      // Some symbols like '¥' are legitimately used by multiple currencies (JPY, CNY)
      // and 'kr' is used by SEK and NOK, so we allow some duplicates
      expect(duplicateSymbols.length).toBeLessThan(symbols.length / 2);
    });

    test('should have unique currency names', () => {
      const names = Object.values(currencies).map(config => config.name);
      const uniqueNames = [...new Set(names)];
      expect(names.length).toBe(uniqueNames.length);
    });

    test('should have unique flags', () => {
      const flags = Object.values(currencies).map(config => config.flag);
      const uniqueFlags = [...new Set(flags)];
      expect(flags.length).toBe(uniqueFlags.length);
    });

    test('should have consistent code format', () => {
      Object.keys(currencies).forEach(code => {
        expect(code).toMatch(/^[a-z]{3}$/);
      });
    });

    test('should have reasonable distribution across groups', () => {
      const groups = Object.values(currencies).map(config => config.group);
      const groupCounts = groups.reduce((acc, group) => {
        acc[group] = (acc[group] || 0) + 1;
        return acc;
      }, {});

      // Each group should have at least one currency
      Object.values(groupCounts).forEach(count => {
        expect(count).toBeGreaterThan(0);
      });

      // No group should dominate (have more than 50% of currencies)
      Object.values(groupCounts).forEach(count => {
        expect(count).toBeLessThan(Object.keys(currencies).length / 2);
      });
    });

    test('should have reasonable distribution of popular currencies', () => {
      const popularCount = Object.values(currencies).filter(config => config.popular).length;
      const totalCount = Object.keys(currencies).length;
      
      // Should have some popular currencies but not all
      expect(popularCount).toBeGreaterThan(0);
      expect(popularCount).toBeLessThan(totalCount);
      
      // Popular currencies should be between 25% and 75% of total
      expect(popularCount / totalCount).toBeGreaterThan(0.25);
      expect(popularCount / totalCount).toBeLessThan(0.75);
    });
  });
});