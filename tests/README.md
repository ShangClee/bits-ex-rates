# Testing Documentation

## Overview

This directory contains the comprehensive testing infrastructure for the Bitcoin Exchange Rates application. The testing setup maintains the no-build approach while providing modern testing capabilities with Jest.

## Test Structure

```
tests/
├── README.md              # This documentation
├── setup.js              # Global test configuration
├── test-runner.js         # Custom test runner utilities
├── mocks/
│   └── sample-data.js     # Mock data and API responses
├── utils/
│   └── test-helpers.js    # Testing utilities and helpers
├── unit/                  # Unit tests (created in task 8.2)
├── integration/           # Integration tests (future)
└── e2e/                   # End-to-end tests (future)
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests once (CI mode)
npm run test:run
```

### Jest Configuration

The testing setup uses Jest with the following key configurations:

- **No Build Process**: Tests run directly on ES modules
- **JSDOM Environment**: Browser-like environment for DOM testing
- **ES Module Support**: Native ES6 module support
- **Coverage Reporting**: HTML, LCOV, and text reports
- **Mock Support**: Comprehensive mocking utilities

## Test Categories

### Unit Tests
- **Data Modules**: Currency config, rate calculator, formatter
- **API Services**: Bitcoin API, cache manager
- **UI Components**: Tab manager, rate renderer, loading/error handlers
- **Features**: Preferences, favorites, search functionality

### Integration Tests
- **Module Interactions**: How modules work together
- **API Integration**: Real API testing with mocks
- **UI Workflows**: Complete user interaction flows

### Coverage Goals

- **Branches**: 70% minimum
- **Functions**: 75% minimum
- **Lines**: 75% minimum
- **Statements**: 75% minimum

## Testing Utilities

### Mock Data (`mocks/sample-data.js`)
- Sample currency configurations
- Mock API responses (CoinGecko, CoinDesk)
- Test rate data and historical data
- Error scenarios and edge cases

### Test Helpers (`utils/test-helpers.js`)
- DOM manipulation utilities
- Event simulation functions
- Assertion helpers
- Module testing environment setup

### Global Setup (`setup.js`)
- Browser API mocks (localStorage, fetch, etc.)
- Observer mocks (ResizeObserver, MutationObserver)
- Animation frame mocks
- Console mocking for cleaner output

## Writing Tests

### Basic Test Structure

```javascript
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { createModuleTestEnvironment, cleanupModuleTestEnvironment } from '../utils/test-helpers.js';
import { mockCurrencies, mockApiResponse } from '../mocks/sample-data.js';

describe('Module Name', () => {
  beforeEach(() => {
    createModuleTestEnvironment();
  });

  afterEach(() => {
    cleanupModuleTestEnvironment();
  });

  test('should do something', () => {
    // Test implementation
    expect(true).toBe(true);
  });
});
```

### Testing Async Operations

```javascript
test('should handle async operations', async () => {
  const mockResponse = testUtils.mockFetch(mockApiResponse);
  
  const result = await someAsyncFunction();
  
  expect(fetch).toHaveBeenCalledWith(expectedUrl);
  expect(result).toEqual(expectedResult);
});
```

### Testing DOM Interactions

```javascript
test('should handle user interactions', () => {
  const button = document.createElement('button');
  const clickHandler = jest.fn();
  button.addEventListener('click', clickHandler);
  
  simulateClick(button);
  
  expect(clickHandler).toHaveBeenCalled();
});
```

### Testing Modules

```javascript
test('should initialize module correctly', async () => {
  const { default: ModuleClass } = await import('../../src/modules/example/module.js');
  
  const instance = new ModuleClass();
  
  expect(instance).toBeDefined();
  expect(typeof instance.publicMethod).toBe('function');
});
```

## Best Practices

### Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names that explain the expected behavior
- Keep tests focused on a single behavior or outcome
- Use `beforeEach`/`afterEach` for setup and cleanup

### Mocking Strategy
- Mock external dependencies (APIs, localStorage, etc.)
- Use real implementations for internal modules when possible
- Provide meaningful mock data that represents real scenarios
- Reset mocks between tests to avoid interference

### Assertions
- Use specific assertions that clearly express expectations
- Test both positive and negative cases
- Include edge cases and error conditions
- Verify side effects (DOM changes, event emissions, etc.)

### Performance
- Keep tests fast by avoiding unnecessary async operations
- Use `jest.fn()` for simple mocks instead of complex implementations
- Clean up resources in `afterEach` to prevent memory leaks
- Use `test.skip()` or `describe.skip()` for temporarily disabled tests

## Debugging Tests

### Common Issues
- **Module Import Errors**: Ensure correct file paths and extensions
- **DOM Not Available**: Use `createModuleTestEnvironment()` in `beforeEach`
- **Async Timing**: Use `await` or `waitFor` utilities for async operations
- **Mock Conflicts**: Clear mocks between tests with `jest.clearAllMocks()`

### Debug Commands
```bash
# Run specific test file
npm test -- tests/unit/data/rate-calculator.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should calculate"

# Run with verbose output
npm test -- --verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Report**: `coverage/lcov.info`
- **JSON Report**: `coverage/coverage-final.json`

### Viewing Coverage
```bash
# Generate and view HTML coverage report
npm run test:coverage
open coverage/lcov-report/index.html
```

## Continuous Integration

The testing setup is designed to work in CI environments:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm run test:run

- name: Upload coverage
  uses: codecov/codecov-action@v1
  with:
    file: ./coverage/lcov.info
```

## Future Enhancements

### Planned Additions
- **Visual Regression Testing**: Screenshot comparison tests
- **Performance Testing**: Bundle size and runtime performance tests
- **Accessibility Testing**: Automated a11y testing with jest-axe
- **Cross-Browser Testing**: Playwright integration for browser testing

### Advanced Features
- **Test Data Generation**: Property-based testing with fast-check
- **Mutation Testing**: Code quality assessment with Stryker
- **Contract Testing**: API contract validation
- **Load Testing**: Performance testing under load

## Troubleshooting

### Common Solutions

**Tests not running:**
- Check Node.js version (requires 16+)
- Verify Jest installation: `npm list jest`
- Check file extensions and import paths

**Coverage not working:**
- Ensure files are in `src/` directory
- Check `collectCoverageFrom` patterns in Jest config
- Verify files are not excluded in `.gitignore`

**Mocks not working:**
- Import mocks before the module under test
- Use `jest.clearAllMocks()` in `afterEach`
- Check mock implementation matches expected interface

**DOM tests failing:**
- Use `createModuleTestEnvironment()` for DOM setup
- Ensure JSDOM environment is configured
- Check for missing DOM APIs in setup.js

For additional help, check the Jest documentation or create an issue in the project repository.