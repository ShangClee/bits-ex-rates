/**
 * Jest Test Setup
 * Global test configuration and utilities
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn(key => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
    length: 0,
    key: jest.fn()
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock fetch API
global.fetch = jest.fn();

// Mock DOM methods
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => ''
  })
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock console methods for cleaner test output
const originalConsole = { ...console };
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn()
};

// Restore console after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

// Global test utilities
global.testUtils = {
  createMockElement: (tagName = 'div', attributes = {}) => {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  },
  
  createMockEvent: (type, properties = {}) => {
    const event = new Event(type);
    Object.assign(event, properties);
    return event;
  },
  
  waitFor: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  
  mockFetch: (response, options = {}) => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      ...options
    };
    fetch.mockResolvedValueOnce(mockResponse);
    return mockResponse;
  },
  
  mockFetchError: (error = new Error('Network error')) => {
    fetch.mockRejectedValueOnce(error);
  }
};