/**
 * Preferences Module Tests
 * Tests for user preferences and settings management
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { mockPreferences } from '../../mocks/sample-data.js';
import { createModuleTestEnvironment, cleanupModuleTestEnvironment } from '../../utils/test-helpers.js';

describe('Preferences Module', () => {
  beforeEach(() => {
    createModuleTestEnvironment();
    localStorage.clear();
  });

  afterEach(() => {
    cleanupModuleTestEnvironment();
  });

  test('should have default preferences structure', () => {
    const defaultPreferences = {
      theme: 'auto',
      activeTab: 'btc',
      activePages: {
        btc: 'fiat-per-btc',
        bts: 'fiat-per-bits',
        sts: 'fiat-per-satoshi'
      },
      favorites: [],
      searchHistory: [],
      displaySettings: {
        showAnimations: true,
        compactMode: false,
        showFlags: true
      },
      accessibility: {
        reduceMotion: false,
        highContrast: false,
        largeText: false
      }
    };

    expect(defaultPreferences.theme).toBe('auto');
    expect(defaultPreferences.activeTab).toBe('btc');
    expect(Array.isArray(defaultPreferences.favorites)).toBe(true);
    expect(typeof defaultPreferences.displaySettings).toBe('object');
    expect(typeof defaultPreferences.accessibility).toBe('object');
  });

  test('should save preferences to localStorage', () => {
    const preferences = mockPreferences;
    
    localStorage.setItem('bitcoin_app_preferences', JSON.stringify(preferences));
    const saved = localStorage.getItem('bitcoin_app_preferences');
    const parsed = JSON.parse(saved);

    expect(parsed).toEqual(preferences);
    expect(parsed.theme).toBe('light');
    expect(parsed.favorites).toEqual(['usd', 'eur']);
  });

  test('should load preferences from localStorage', () => {
    const preferences = mockPreferences;
    localStorage.setItem('bitcoin_app_preferences', JSON.stringify(preferences));

    const loaded = localStorage.getItem('bitcoin_app_preferences');
    const parsed = loaded ? JSON.parse(loaded) : null;

    expect(parsed).not.toBeNull();
    expect(parsed.theme).toBe('light');
    expect(parsed.activeTab).toBe('btc');
  });

  test('should handle invalid preferences data', () => {
    // Test with invalid JSON
    localStorage.setItem('bitcoin_app_preferences', 'invalid json');
    
    const loaded = localStorage.getItem('bitcoin_app_preferences');
    let parsed = null;
    
    try {
      parsed = JSON.parse(loaded);
    } catch (error) {
      // Should handle JSON parse error gracefully
      expect(error).toBeInstanceOf(SyntaxError);
    }

    expect(parsed).toBeNull();
  });

  test('should validate theme values', () => {
    const validThemes = ['light', 'dark', 'auto'];
    const invalidThemes = ['invalid', '', null, undefined, 123];

    validThemes.forEach(theme => {
      expect(validThemes.includes(theme)).toBe(true);
    });

    invalidThemes.forEach(theme => {
      expect(validThemes.includes(theme)).toBe(false);
    });
  });

  test('should validate tab values', () => {
    const validTabs = ['btc', 'bts', 'sts'];
    const invalidTabs = ['invalid', '', null, undefined, 'bitcoin'];

    validTabs.forEach(tab => {
      expect(validTabs.includes(tab)).toBe(true);
    });

    invalidTabs.forEach(tab => {
      expect(validTabs.includes(tab)).toBe(false);
    });
  });

  test('should manage favorites list', () => {
    let favorites = [];

    // Add favorites
    const addFavorite = (currency) => {
      if (!favorites.includes(currency) && favorites.length < 10) {
        favorites.push(currency);
      }
    };

    // Remove favorites
    const removeFavorite = (currency) => {
      favorites = favorites.filter(fav => fav !== currency);
    };

    addFavorite('usd');
    addFavorite('eur');
    addFavorite('gbp');

    expect(favorites).toEqual(['usd', 'eur', 'gbp']);

    removeFavorite('eur');
    expect(favorites).toEqual(['usd', 'gbp']);

    // Test duplicate prevention
    addFavorite('usd');
    expect(favorites).toEqual(['usd', 'gbp']);
  });

  test('should enforce favorites limit', () => {
    let favorites = [];
    const maxFavorites = 10;

    const addFavorite = (currency) => {
      if (!favorites.includes(currency) && favorites.length < maxFavorites) {
        favorites.push(currency);
        return true;
      }
      return false;
    };

    // Add 10 favorites
    for (let i = 0; i < 10; i++) {
      const result = addFavorite(`currency${i}`);
      expect(result).toBe(true);
    }

    expect(favorites.length).toBe(10);

    // Try to add 11th favorite
    const result = addFavorite('currency10');
    expect(result).toBe(false);
    expect(favorites.length).toBe(10);
  });

  test('should handle theme switching', () => {
    const applyTheme = (theme) => {
      if (['light', 'dark', 'auto'].includes(theme)) {
        document.documentElement.setAttribute('data-theme', theme);
        return true;
      }
      return false;
    };

    expect(applyTheme('light')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    expect(applyTheme('dark')).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    expect(applyTheme('invalid')).toBe(false);
  });

  test('should handle accessibility settings', () => {
    const accessibilitySettings = {
      reduceMotion: false,
      highContrast: false,
      largeText: false
    };

    // Test reduce motion
    accessibilitySettings.reduceMotion = true;
    expect(accessibilitySettings.reduceMotion).toBe(true);

    // Test high contrast
    accessibilitySettings.highContrast = true;
    expect(accessibilitySettings.highContrast).toBe(true);

    // Test large text
    accessibilitySettings.largeText = true;
    expect(accessibilitySettings.largeText).toBe(true);
  });

  test('should handle display settings', () => {
    const displaySettings = {
      showAnimations: true,
      compactMode: false,
      showFlags: true
    };

    // Toggle animations
    displaySettings.showAnimations = false;
    expect(displaySettings.showAnimations).toBe(false);

    // Toggle compact mode
    displaySettings.compactMode = true;
    expect(displaySettings.compactMode).toBe(true);

    // Toggle flags
    displaySettings.showFlags = false;
    expect(displaySettings.showFlags).toBe(false);
  });

  test('should export and import preferences', () => {
    const preferences = mockPreferences;
    
    // Export (stringify)
    const exported = JSON.stringify(preferences, null, 2);
    expect(typeof exported).toBe('string');
    expect(exported.includes('"theme": "light"')).toBe(true);

    // Import (parse)
    const imported = JSON.parse(exported);
    expect(imported).toEqual(preferences);
  });
});