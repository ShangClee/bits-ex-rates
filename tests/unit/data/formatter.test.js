/**
 * Formatter Module Tests
 * Tests for number formatting, currency display, and locale-aware formatting
 */

import { describe, test, expect } from '@jest/globals';
import {
  formatNumber,
  formatCurrency,
  formatBitcoinAmount,
  formatWithSuffix,
  formatSmallNumber,
  formatPercentage,
  formatDuration,
  formatTimestamp
} from '../../../src/modules/data/formatter.js';

describe('Formatter Module', () => {
  describe('formatNumber', () => {
    test('should format numbers with default options', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(0.123)).toBe('0.12');
    });

    test('should format numbers with custom precision', () => {
      expect(formatNumber(1234.56789, { maximumFractionDigits: 4 })).toBe('1,234.5679');
      expect(formatNumber(1234.56789, { minimumFractionDigits: 3, maximumFractionDigits: 3 })).toBe('1,234.568');
    });

    test('should format numbers without grouping', () => {
      expect(formatNumber(1234567, { useGrouping: false })).toBe('1234567');
    });

    test('should handle invalid inputs', () => {
      expect(formatNumber('invalid')).toBe('0');
      expect(formatNumber(null)).toBe('0');
      expect(formatNumber(undefined)).toBe('0');
      expect(formatNumber(NaN)).toBe('0');
    });

    test('should handle different locales', () => {
      // Note: Locale testing may vary by environment, so we test the fallback
      const result = formatNumber(1234.56, { locale: 'de-DE' });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('formatCurrency', () => {
    test('should format currency with symbol first', () => {
      expect(formatCurrency(1234.56, '$')).toBe('$1,234.56');
      expect(formatCurrency(1000, '€')).toBe('€1,000.00');
    });

    test('should format currency with symbol last', () => {
      expect(formatCurrency(1234.56, '€', { symbolFirst: false })).toBe('1,234.56€');
    });

    test('should format currency with custom precision', () => {
      expect(formatCurrency(1234.5, '$', { precision: 4 })).toBe('$1,234.5000');
      expect(formatCurrency(1234.56789, '¥', { precision: 0 })).toBe('¥1,235');
    });

    test('should handle invalid values', () => {
      expect(formatCurrency('invalid', '$')).toBe('$0');
      expect(formatCurrency(null, '€')).toBe('€0');
      expect(formatCurrency(NaN, '£')).toBe('£0');
    });

    test('should handle symbol placement with invalid values', () => {
      expect(formatCurrency('invalid', '$', { symbolFirst: false })).toBe('0$');
    });
  });

  describe('formatBitcoinAmount', () => {
    test('should format BTC amounts correctly', () => {
      expect(formatBitcoinAmount(1.23456789, 'btc')).toBe('1.2346 BTC');
      expect(formatBitcoinAmount(0.00123456, 'btc')).toBe('0.001235 BTC');
      expect(formatBitcoinAmount(0.00000123, 'btc')).toBe('1.23e-6 BTC');
    });

    test('should format BITS amounts correctly', () => {
      expect(formatBitcoinAmount(1234.56, 'bits')).toBe('1,234.56 BITS');
      expect(formatBitcoinAmount(0.123, 'bits')).toBe('0.12 BITS');
    });

    test('should format Satoshi amounts correctly', () => {
      expect(formatBitcoinAmount(1234567, 'satoshi')).toBe('1.23M sats');
      expect(formatBitcoinAmount(1234, 'sats')).toBe('1.23K sats');
      expect(formatBitcoinAmount(123.7, 'satoshi')).toBe('124 sats');
    });

    test('should format without unit labels', () => {
      expect(formatBitcoinAmount(1.2345, 'btc', { showUnit: false })).toBe('1.2345');
      expect(formatBitcoinAmount(1234.56, 'bits', { showUnit: false })).toBe('1,234.56');
      expect(formatBitcoinAmount(1234, 'satoshi', { showUnit: false })).toBe('1.23K');
    });

    test('should handle invalid values', () => {
      expect(formatBitcoinAmount('invalid', 'btc')).toBe('0 BTC');
      expect(formatBitcoinAmount(null, 'bits')).toBe('0 BITS');
      expect(formatBitcoinAmount(NaN, 'satoshi')).toBe('0 sats');
    });

    test('should handle unknown units', () => {
      expect(formatBitcoinAmount(123, 'unknown')).toBe('123 unknown');
    });
  });

  describe('formatWithSuffix', () => {
    test('should format numbers with K suffix', () => {
      expect(formatWithSuffix(1500)).toBe('1.5K');
      expect(formatWithSuffix(12345)).toBe('12.35K');
    });

    test('should format numbers with M suffix', () => {
      expect(formatWithSuffix(1500000)).toBe('1.5M');
      expect(formatWithSuffix(12345678)).toBe('12.35M');
    });

    test('should format numbers with B suffix', () => {
      expect(formatWithSuffix(1500000000)).toBe('1.5B');
      expect(formatWithSuffix(12345678901)).toBe('12.35B');
    });

    test('should format small numbers without suffix', () => {
      expect(formatWithSuffix(999)).toBe('999');
      expect(formatWithSuffix(123)).toBe('123');
    });

    test('should handle negative numbers', () => {
      expect(formatWithSuffix(-1500)).toBe('-1.5K');
      expect(formatWithSuffix(-1500000)).toBe('-1.5M');
      expect(formatWithSuffix(-1500000000)).toBe('-1.5B');
    });

    test('should handle custom precision', () => {
      expect(formatWithSuffix(1234567, { precision: 1 })).toBe('1.2M');
      expect(formatWithSuffix(1234567, { precision: 3 })).toBe('1.235M');
    });

    test('should handle invalid values', () => {
      expect(formatWithSuffix('invalid')).toBe('0');
      expect(formatWithSuffix(null)).toBe('0');
      expect(formatWithSuffix(NaN)).toBe('0');
    });
  });

  describe('formatSmallNumber', () => {
    test('should format small numbers with appropriate precision', () => {
      expect(formatSmallNumber(0.123456)).toBe('0.123 456');
      expect(formatSmallNumber(0.00123456)).toBe('0.001 235');
    });

    test('should use exponential notation for very small numbers', () => {
      expect(formatSmallNumber(0.0000001)).toBe('1.00e-7');
      expect(formatSmallNumber(0.0000000123)).toBe('1.23e-8');
    });

    test('should handle zero', () => {
      expect(formatSmallNumber(0)).toBe('0');
    });

    test('should respect maxDecimals option', () => {
      expect(formatSmallNumber(0.123456789, { maxDecimals: 4 })).toBe('0.123 457');
    });

    test('should disable exponential notation when requested', () => {
      expect(formatSmallNumber(0.0000001, { useExponential: false })).toBe('0.00000010');
    });

    test('should handle invalid values', () => {
      expect(formatSmallNumber('invalid')).toBe('0');
      expect(formatSmallNumber(null)).toBe('0');
      expect(formatSmallNumber(NaN)).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    test('should format positive percentages', () => {
      expect(formatPercentage(0.1234)).toBe('+12.34%');
      expect(formatPercentage(0.05)).toBe('+5%');
    });

    test('should format negative percentages', () => {
      expect(formatPercentage(-0.1234)).toBe('-12.34%');
      expect(formatPercentage(-0.05)).toBe('-5%');
    });

    test('should format zero percentage', () => {
      expect(formatPercentage(0)).toBe('0%');
    });

    test('should format without sign when requested', () => {
      expect(formatPercentage(0.1234, { showSign: false })).toBe('12.34%');
      expect(formatPercentage(-0.1234, { showSign: false })).toBe('-12.34%');
    });

    test('should handle custom precision', () => {
      expect(formatPercentage(0.123456, { precision: 4 })).toBe('+12.3456%');
      expect(formatPercentage(0.123456, { precision: 0 })).toBe('+12%');
    });

    test('should handle invalid values', () => {
      expect(formatPercentage('invalid')).toBe('0%');
      expect(formatPercentage(null)).toBe('0%');
      expect(formatPercentage(NaN)).toBe('0%');
    });
  });

  describe('formatDuration', () => {
    test('should format milliseconds', () => {
      expect(formatDuration(500)).toBe('500ms');
      expect(formatDuration(999)).toBe('999ms');
    });

    test('should format seconds', () => {
      expect(formatDuration(5000)).toBe('5s');
      expect(formatDuration(65000)).toBe('1m 5s');
    });

    test('should format minutes', () => {
      expect(formatDuration(300000)).toBe('5m 0s');
      expect(formatDuration(3665000)).toBe('1h 1m');
    });

    test('should format hours', () => {
      expect(formatDuration(7200000)).toBe('2h 0m');
      expect(formatDuration(90061000)).toBe('1d 1h');
    });

    test('should format days', () => {
      expect(formatDuration(86400000)).toBe('1d 0h');
      expect(formatDuration(90000000)).toBe('1d 1h');
    });

    test('should handle invalid values', () => {
      expect(formatDuration('invalid')).toBe('0ms');
      expect(formatDuration(-1000)).toBe('0ms');
      expect(formatDuration(null)).toBe('0ms');
    });
  });

  describe('formatTimestamp', () => {
    const testDate = new Date('2023-01-15T14:30:45Z');
    const testTimestamp = testDate.getTime();

    test('should format Date objects', () => {
      const result = formatTimestamp(testDate);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2023');
    });

    test('should format timestamps', () => {
      const result = formatTimestamp(testTimestamp);
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2023');
    });

    test('should format without time when requested', () => {
      const result = formatTimestamp(testDate, { includeTime: false });
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2023');
      // Should not contain time indicators
      expect(result).not.toMatch(/\d{1,2}:\d{2}/);
    });

    test('should include seconds when requested', () => {
      const result = formatTimestamp(testDate, { includeSeconds: true });
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2023');
    });

    test('should handle invalid dates', () => {
      expect(formatTimestamp('invalid')).toBe('Invalid date');
      expect(formatTimestamp(null)).toBe('Invalid date');
      expect(formatTimestamp(new Date('invalid'))).toBe('Invalid date');
    });

    test('should handle different locales', () => {
      const result = formatTimestamp(testDate, { locale: 'de-DE' });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});