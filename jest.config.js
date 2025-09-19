/**
 * Jest Configuration
 * Testing framework configuration for Bitcoin Exchange Rates app
 */

export default {
  // Test environment
  testEnvironment: 'jsdom',
  
  // Transform configuration for ES modules
  transform: {
    '^.+\\.js$': ['babel-jest', { presets: [['@babel/preset-env', { targets: { node: 'current' } }]] }]
  },
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/src/**/*.test.js'
  ],
  
  // Coverage collection
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/modules/utils/app-initializer.js', // Exclude initialization file
    '!src/modules/features/demo.js' // Exclude demo utilities
  ],
  
  // Coverage output
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.js'
  ],
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Error handling
  errorOnDeprecated: true,
  
  // Module directories
  moduleDirectories: [
    'node_modules',
    'src',
    'tests'
  ],
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ],
  
  // Watch plugins for better development experience
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ].filter(Boolean)
};