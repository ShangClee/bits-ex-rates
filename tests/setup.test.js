/**
 * Setup Verification Test
 * Ensures the testing infrastructure is working correctly
 */

import { describe, test, expect } from '@jest/globals';

describe('Testing Infrastructure', () => {
  test('Jest is working correctly', () => {
    expect(true).toBe(true);
  });

  test('Global test utilities are available', () => {
    expect(global.testUtils).toBeDefined();
    expect(typeof global.testUtils.createMockElement).toBe('function');
    expect(typeof global.testUtils.mockFetch).toBe('function');
  });

  test('DOM environment is available', () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();
    expect(localStorage).toBeDefined();
  });

  test('Mock functions work correctly', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  test('Async testing works', async () => {
    const promise = Promise.resolve('success');
    const result = await promise;
    expect(result).toBe('success');
  });

  test('DOM manipulation works', () => {
    const element = document.createElement('div');
    element.textContent = 'Test Element';
    document.body.appendChild(element);
    
    expect(document.querySelector('div')).toBeTruthy();
    expect(document.querySelector('div').textContent).toBe('Test Element');
    
    // Cleanup
    element.remove();
  });

  test('LocalStorage mocking works', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    
    localStorage.clear();
    expect(localStorage.getItem('test')).toBeNull();
  });

  test('Fetch mocking works', () => {
    const mockResponse = { data: 'test' };
    global.testUtils.mockFetch(mockResponse);
    
    expect(fetch).toBeDefined();
    // Note: Actual fetch testing will be in individual module tests
  });
});