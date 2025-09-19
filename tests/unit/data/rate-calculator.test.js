/**
 * Rate Calculator Module Tests
 * Tests for Bitcoin rate conversion and calculation functions
 */

import { describe, test, expect } from '@jest/globals';
import {
  BITCOIN_UNITS,
  convertToBits,
  convertToSatoshi,
  calculateFiatPerUnit,
  calculateUnitsPerFiat,
  applyPrecision,
  calculatePercentageChange,
  validateBitcoinRate,
  convertBitcoinUnits
} from '../../../src/modules/data/rate-calculator.js';

describe('Rate Calculator Module', () => {
  describe('Constants', () => {
    test('should have correct Bitcoin unit constants', () => {
      expect(BITCOIN_UNITS.SATOSHI_PER_BTC).toBe(100000000);
      expect(BITCOIN_UNITS.BITS_PER_BTC).toBe(1000000);
      expect(BITCOIN_UNITS.SATOSHI_PER_BITS).toBe(100);
    });
  });

  describe('convertToBits', () => {
    test('should convert BTC rate to BITS rate correctly', () => {
      expect(convertToBits(50000)).toBe(0.05);
      expect(convertToBits(100000)).toBe(0.1);
      expect(convertToBits(1000000)).toBe(1);
    });

    test('should handle decimal BTC rates', () => {
      expect(convertToBits(45000.5)).toBe(0.0450005);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => convertToBits(0)).toThrow('Invalid BTC rate provided');
      expect(() => convertToBits(-1000)).toThrow('Invalid BTC rate provided');
      expect(() => convertToBits('invalid')).toThrow('Invalid BTC rate provided');
      expect(() => convertToBits(null)).toThrow('Invalid BTC rate provided');
    });
  });

  describe('convertToSatoshi', () => {
    test('should convert BTC rate to Satoshi rate correctly', () => {
      expect(convertToSatoshi(50000)).toBe(0.0005);
      expect(convertToSatoshi(100000)).toBe(0.001);
      expect(convertToSatoshi(100000000)).toBe(1);
    });

    test('should handle very small Satoshi rates', () => {
      expect(convertToSatoshi(1000)).toBe(0.00001);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => convertToSatoshi(0)).toThrow('Invalid BTC rate provided');
      expect(() => convertToSatoshi(-5000)).toThrow('Invalid BTC rate provided');
      expect(() => convertToSatoshi(undefined)).toThrow('Invalid BTC rate provided');
    });
  });

  describe('calculateFiatPerUnit', () => {
    const btcRate = 50000;

    test('should calculate fiat per BTC correctly', () => {
      expect(calculateFiatPerUnit(btcRate, 'btc')).toBe(50000);
      expect(calculateFiatPerUnit(btcRate, 'BTC')).toBe(50000);
    });

    test('should calculate fiat per BITS correctly', () => {
      expect(calculateFiatPerUnit(btcRate, 'bits')).toBe(0.05);
      expect(calculateFiatPerUnit(btcRate, 'BITS')).toBe(0.05);
    });

    test('should calculate fiat per Satoshi correctly', () => {
      expect(calculateFiatPerUnit(btcRate, 'satoshi')).toBe(0.0005);
      expect(calculateFiatPerUnit(btcRate, 'sats')).toBe(0.0005);
      expect(calculateFiatPerUnit(btcRate, 'SATOSHI')).toBe(0.0005);
    });

    test('should throw error for unsupported units', () => {
      expect(() => calculateFiatPerUnit(btcRate, 'invalid')).toThrow('Unsupported unit: invalid');
      expect(() => calculateFiatPerUnit(btcRate, 'eth')).toThrow('Unsupported unit: eth');
    });

    test('should throw error for invalid BTC rate', () => {
      expect(() => calculateFiatPerUnit(0, 'btc')).toThrow('Invalid BTC rate provided');
      expect(() => calculateFiatPerUnit(-1000, 'bits')).toThrow('Invalid BTC rate provided');
    });
  });

  describe('calculateUnitsPerFiat', () => {
    const btcRate = 50000;
    const fiatAmount = 1000;

    test('should calculate BTC units per fiat correctly', () => {
      expect(calculateUnitsPerFiat(btcRate, fiatAmount, 'btc')).toBe(0.02);
    });

    test('should calculate BITS units per fiat correctly', () => {
      expect(calculateUnitsPerFiat(btcRate, fiatAmount, 'bits')).toBe(20000);
    });

    test('should calculate Satoshi units per fiat correctly', () => {
      expect(calculateUnitsPerFiat(btcRate, fiatAmount, 'satoshi')).toBe(2000000);
    });

    test('should handle different fiat amounts', () => {
      expect(calculateUnitsPerFiat(btcRate, 500, 'btc')).toBe(0.01);
      expect(calculateUnitsPerFiat(btcRate, 2500, 'bits')).toBe(50000);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => calculateUnitsPerFiat(0, fiatAmount, 'btc')).toThrow('Invalid BTC rate provided');
      expect(() => calculateUnitsPerFiat(btcRate, 0, 'btc')).toThrow('Invalid fiat amount provided');
      expect(() => calculateUnitsPerFiat(btcRate, -100, 'btc')).toThrow('Invalid fiat amount provided');
      expect(() => calculateUnitsPerFiat('invalid', fiatAmount, 'btc')).toThrow('Invalid BTC rate provided');
    });
  });

  describe('applyPrecision', () => {
    test('should apply BTC precision correctly', () => {
      expect(applyPrecision(1.23456789, 'btc')).toBe(1.2346);
      expect(applyPrecision(0.00123456, 'btc')).toBe(0.00123456);
      expect(applyPrecision(0.123456789, 'btc')).toBe(0.12345679);
    });

    test('should apply BITS precision correctly', () => {
      expect(applyPrecision(1.23456, 'bits')).toBe(1.23);
      expect(applyPrecision(0.00123456, 'bits')).toBe(0.001235);
      expect(applyPrecision(123.456789, 'bits')).toBe(123.46);
    });

    test('should apply Satoshi precision correctly', () => {
      expect(applyPrecision(123.456, 'satoshi')).toBe(123);
      expect(applyPrecision(123.789, 'sats')).toBe(124);
      expect(applyPrecision(123.1, 'satoshi')).toBe(123);
    });

    test('should use custom precision when provided', () => {
      expect(applyPrecision(1.23456789, 'btc', 3)).toBe(1.235);
      expect(applyPrecision(1.23456789, 'bits', 5)).toBe(1.23457);
      expect(applyPrecision(123.456, 'satoshi', 1)).toBe(123.5);
    });

    test('should handle default case for unknown units', () => {
      expect(applyPrecision(1.23456789, 'unknown')).toBe(1.23);
    });

    test('should throw error for invalid value', () => {
      expect(() => applyPrecision('invalid', 'btc')).toThrow('Invalid value provided for precision rounding');
      expect(() => applyPrecision(null, 'btc')).toThrow('Invalid value provided for precision rounding');
    });
  });

  describe('calculatePercentageChange', () => {
    test('should calculate positive percentage change', () => {
      expect(calculatePercentageChange(100, 110)).toBe(10);
      expect(calculatePercentageChange(50000, 55000)).toBe(10);
    });

    test('should calculate negative percentage change', () => {
      expect(calculatePercentageChange(110, 100)).toBe(-9.090909090909092);
      expect(calculatePercentageChange(55000, 50000)).toBe(-9.090909090909092);
    });

    test('should calculate zero percentage change', () => {
      expect(calculatePercentageChange(100, 100)).toBe(0);
    });

    test('should handle decimal values', () => {
      expect(calculatePercentageChange(45000.5, 47250.525)).toBeCloseTo(5, 2);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => calculatePercentageChange('invalid', 100)).toThrow('Invalid rates provided for percentage calculation');
      expect(() => calculatePercentageChange(100, 'invalid')).toThrow('Invalid rates provided for percentage calculation');
      expect(() => calculatePercentageChange(0, 100)).toThrow('Cannot calculate percentage change from zero');
    });
  });

  describe('validateBitcoinRate', () => {
    test('should validate reasonable Bitcoin rates', () => {
      expect(validateBitcoinRate(1000)).toBe(true);
      expect(validateBitcoinRate(50000)).toBe(true);
      expect(validateBitcoinRate(100000)).toBe(true);
      expect(validateBitcoinRate(500000)).toBe(true);
    });

    test('should reject unreasonable Bitcoin rates', () => {
      expect(validateBitcoinRate(50)).toBe(false);
      expect(validateBitcoinRate(99)).toBe(false);
      expect(validateBitcoinRate(10000001)).toBe(false);
      expect(validateBitcoinRate(50000000)).toBe(false);
    });

    test('should reject invalid inputs', () => {
      expect(validateBitcoinRate('invalid')).toBe(false);
      expect(validateBitcoinRate(null)).toBe(false);
      expect(validateBitcoinRate(undefined)).toBe(false);
      expect(validateBitcoinRate(NaN)).toBe(false);
      expect(validateBitcoinRate(-1000)).toBe(false);
    });
  });

  describe('convertBitcoinUnits', () => {
    test('should convert BTC to BITS', () => {
      expect(convertBitcoinUnits(1, 'btc', 'bits')).toBe(1000000);
      expect(convertBitcoinUnits(0.5, 'btc', 'bits')).toBe(500000);
    });

    test('should convert BTC to Satoshi', () => {
      expect(convertBitcoinUnits(1, 'btc', 'satoshi')).toBe(100000000);
      expect(convertBitcoinUnits(0.001, 'btc', 'sats')).toBe(100000);
    });

    test('should convert BITS to BTC', () => {
      expect(convertBitcoinUnits(1000000, 'bits', 'btc')).toBe(1);
      expect(convertBitcoinUnits(500000, 'bits', 'btc')).toBe(0.5);
    });

    test('should convert BITS to Satoshi', () => {
      expect(convertBitcoinUnits(1000, 'bits', 'satoshi')).toBe(100000);
      expect(convertBitcoinUnits(500, 'bits', 'sats')).toBe(50000);
    });

    test('should convert Satoshi to BTC', () => {
      expect(convertBitcoinUnits(100000000, 'satoshi', 'btc')).toBe(1);
      expect(convertBitcoinUnits(50000000, 'sats', 'btc')).toBe(0.5);
    });

    test('should convert Satoshi to BITS', () => {
      expect(convertBitcoinUnits(100000, 'satoshi', 'bits')).toBe(1000);
      expect(convertBitcoinUnits(50000, 'sats', 'bits')).toBe(500);
    });

    test('should return same amount for same units', () => {
      expect(convertBitcoinUnits(123, 'btc', 'btc')).toBe(123);
      expect(convertBitcoinUnits(456, 'bits', 'bits')).toBe(456);
      expect(convertBitcoinUnits(789, 'satoshi', 'satoshi')).toBe(789);
    });

    test('should handle case insensitive units', () => {
      expect(convertBitcoinUnits(1, 'BTC', 'BITS')).toBe(1000000);
      expect(convertBitcoinUnits(1000000, 'BITS', 'BTC')).toBe(1);
      expect(convertBitcoinUnits(100000000, 'SATOSHI', 'BTC')).toBe(1);
    });

    test('should throw error for invalid inputs', () => {
      expect(() => convertBitcoinUnits(-1, 'btc', 'bits')).toThrow('Invalid amount provided for unit conversion');
      expect(() => convertBitcoinUnits('invalid', 'btc', 'bits')).toThrow('Invalid amount provided for unit conversion');
      expect(() => convertBitcoinUnits(1, 'invalid', 'bits')).toThrow('Unsupported source unit: invalid');
      expect(() => convertBitcoinUnits(1, 'btc', 'invalid')).toThrow('Unsupported target unit: invalid');
    });
  });
});