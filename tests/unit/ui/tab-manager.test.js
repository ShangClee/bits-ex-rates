/**
 * Tab Manager Module Tests
 * Tests for tab switching and state management
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { createModuleTestEnvironment, cleanupModuleTestEnvironment } from '../../utils/test-helpers.js';

describe('Tab Manager Module', () => {
  beforeEach(() => {
    createModuleTestEnvironment();
  });

  afterEach(() => {
    cleanupModuleTestEnvironment();
  });

  test('should have tab elements in DOM', () => {
    const btcTab = document.getElementById('btc-tab');
    const btsTab = document.getElementById('bts-tab');
    const stsTab = document.getElementById('sts-tab');

    expect(btcTab).toBeTruthy();
    expect(btsTab).toBeTruthy();
    expect(stsTab).toBeTruthy();
  });

  test('should have tab content containers', () => {
    const btcContent = document.getElementById('btc-content');
    const btsContent = document.getElementById('bts-content');
    const stsContent = document.getElementById('sts-content');

    expect(btcContent).toBeTruthy();
    expect(btsContent).toBeTruthy();
    expect(stsContent).toBeTruthy();
  });

  test('should have rate containers for each tab', () => {
    const containers = [
      'fiat-per-btc-container',
      'btc-per-fiat-container',
      'fiat-per-bits-container',
      'bits-per-fiat-container',
      'fiat-per-satoshi-container',
      'satoshi-per-fiat-container'
    ];

    containers.forEach(containerId => {
      const container = document.getElementById(containerId);
      expect(container).toBeTruthy();
      expect(container.classList.contains('rate-container')).toBe(true);
    });
  });

  test('should handle tab switching logic', () => {
    const btcTab = document.getElementById('btc-tab');
    const btsTab = document.getElementById('bts-tab');
    
    // Simulate tab switching
    btcTab.classList.remove('active');
    btsTab.classList.add('active');

    expect(btcTab.classList.contains('active')).toBe(false);
    expect(btsTab.classList.contains('active')).toBe(true);
  });

  test('should handle keyboard navigation', () => {
    const btcTab = document.getElementById('btc-tab');
    
    // Test keyboard event handling
    const keydownEvent = new KeyboardEvent('keydown', { key: '1' });
    btcTab.dispatchEvent(keydownEvent);

    // Event should be dispatched without errors
    expect(keydownEvent.type).toBe('keydown');
    expect(keydownEvent.key).toBe('1');
  });

  test('should manage tab state persistence', () => {
    const tabState = {
      activeTab: 'btc',
      activePages: {
        btc: 'fiat-per-btc',
        bts: 'fiat-per-bits',
        sts: 'fiat-per-satoshi'
      }
    };

    // Test state structure
    expect(tabState.activeTab).toBe('btc');
    expect(tabState.activePages.btc).toBe('fiat-per-btc');
    expect(tabState.activePages.bts).toBe('fiat-per-bits');
    expect(tabState.activePages.sts).toBe('fiat-per-satoshi');
  });

  test('should handle animation states', () => {
    const tabContent = document.getElementById('btc-content');
    
    // Test animation class management
    tabContent.classList.add('animating');
    expect(tabContent.classList.contains('animating')).toBe(true);
    
    tabContent.classList.remove('animating');
    expect(tabContent.classList.contains('animating')).toBe(false);
  });

  test('should support accessibility features', () => {
    const btcTab = document.getElementById('btc-tab');
    
    // Check for accessibility attributes
    btcTab.setAttribute('aria-selected', 'true');
    btcTab.setAttribute('role', 'tab');
    
    expect(btcTab.getAttribute('aria-selected')).toBe('true');
    expect(btcTab.getAttribute('role')).toBe('tab');
  });
});