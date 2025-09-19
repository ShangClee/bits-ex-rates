# API Documentation

## Overview

The Bitcoin Exchange Rates application features a comprehensive modular API built with ES6 modules. This document provides detailed information about all public APIs, classes, and methods available in the application.

## Table of Contents

- [Core Application](#core-application)
- [Data Layer](#data-layer)
- [API Services](#api-services)
- [UI Components](#ui-components)
- [Feature Modules](#feature-modules)
- [Utility Modules](#utility-modules)
- [Event System](#event-system)

## Core Application

### BitcoinExchangeApp

The main application class that coordinates all modules and manages the application lifecycle.

**Location**: `main.js`

#### Constructor

```javascript
const app = new BitcoinExchangeApp();
```

#### Methods

##### `async init()`
Initializes the application and all modules.

**Returns**: `Promise<void>`

**Example**:
```javascript
const app = new BitcoinExchangeApp();
await app.init();
```

##### `getCurrentRates()`
Gets the current exchange rates for all currencies.

**Returns**: `Object` - Current rates object

##### `refreshRates()`
Manually triggers a rate refresh from the API.

**Returns**: `Promise<Object>` - Updated rates

##### `switchTab(tabId)`
Programmatically switches to a specific tab.

**Parameters**:
- `tabId` (string): Tab identifier ('btc', 'bts', 'sts')

**Example**:
```javascript
app.switchTab('btc');
```

## Data Layer

### CurrencyConfig

Provides currency configuration and metadata.

**Location**: `src/modules/data/currency-config.js`

#### Properties

##### `currencies`
Object containing all supported currencies with metadata.

**Type**: `Object`

**Structure**:
```javascript
{
  usd: {
    code: 'usd',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    amount: 1,
    precision: 2,
    group: 'americas',
    popular: true
  }
  // ... other currencies
}
```

#### Methods

##### `getCurrenciesByGroup(group)`
Filters currencies by geographic group.

**Parameters**:
- `group` (string): Geographic group ('americas', 'europe', 'asia', 'oceania', 'africa')

**Returns**: `Array<Object>` - Array of currency objects

##### `getPopularCurrencies()`
Gets currencies marked as popular.

**Returns**: `Array<Object>` - Array of popular currency objects

##### `getCurrencyByCode(code)`
Gets a specific currency by its code.

**Parameters**:
- `code` (string): Currency code (e.g., 'usd', 'eur')

**Returns**: `Object|null` - Currency object or null if not found

### RateCalculator

Handles Bitcoin unit conversions and rate calculations.

**Location**: `src/modules/data/rate-calculator.js`

#### Constants

```javascript
const SATOSHI_PER_BTC = 100000000;  // 100 million
const BITS_PER_BTC = 1000000;       // 1 million
const SATOSHI_PER_BITS = 100;       // 100 satoshi per BITS
```

#### Methods

##### `convertToBits(btcAmount)`
Converts BTC amount to BITS.

**Parameters**:
- `btcAmount` (number): Amount in BTC

**Returns**: `number` - Amount in BITS

##### `convertToSatoshi(btcAmount)`
Converts BTC amount to Satoshi.

**Parameters**:
- `btcAmount` (number): Amount in BTC

**Returns**: `number` - Amount in Satoshi

##### `calculateFiatPerUnit(rate, unit, amount = 1)`
Calculates fiat amount per Bitcoin unit.

**Parameters**:
- `rate` (number): BTC rate in fiat currency
- `unit` (string): Bitcoin unit ('BTC', 'BITS', 'Satoshi')
- `amount` (number): Amount of units (default: 1)

**Returns**: `number` - Fiat amount

##### `calculateUnitsPerFiat(rate, unit, fiatAmount)`
Calculates Bitcoin units per fiat amount.

**Parameters**:
- `rate` (number): BTC rate in fiat currency
- `unit` (string): Bitcoin unit ('BTC', 'BITS', 'Satoshi')
- `fiatAmount` (number): Fiat amount

**Returns**: `number` - Bitcoin units

##### `calculatePercentageChange(currentRate, previousRate)`
Calculates percentage change between rates.

**Parameters**:
- `currentRate` (number): Current rate
- `previousRate` (number): Previous rate

**Returns**: `number` - Percentage change

### Formatter

Provides comprehensive formatting utilities for numbers, currencies, and Bitcoin amounts.

**Location**: `src/modules/data/formatter.js`

#### Methods

##### `formatNumber(number, options = {})`
Formats numbers with various options.

**Parameters**:
- `number` (number): Number to format
- `options` (Object): Formatting options
  - `decimals` (number): Number of decimal places
  - `useGrouping` (boolean): Use thousand separators
  - `locale` (string): Locale for formatting

**Returns**: `string` - Formatted number

##### `formatCurrency(amount, currencyCode, options = {})`
Formats currency amounts with proper symbols and positioning.

**Parameters**:
- `amount` (number): Amount to format
- `currencyCode` (string): Currency code
- `options` (Object): Formatting options

**Returns**: `string` - Formatted currency

##### `formatBitcoinAmount(amount, unit, options = {})`
Formats Bitcoin amounts with unit-specific formatting.

**Parameters**:
- `amount` (number): Bitcoin amount
- `unit` (string): Bitcoin unit ('BTC', 'BITS', 'Satoshi')
- `options` (Object): Formatting options

**Returns**: `string` - Formatted Bitcoin amount

##### `formatWithSuffix(number, options = {})`
Formats large numbers with K/M/B suffixes.

**Parameters**:
- `number` (number): Number to format
- `options` (Object): Formatting options

**Returns**: `string` - Formatted number with suffix

##### `formatPercentage(percentage, options = {})`
Formats percentage values with proper signs and precision.

**Parameters**:
- `percentage` (number): Percentage value
- `options` (Object): Formatting options

**Returns**: `string` - Formatted percentage

## API Services

### BitcoinAPIService

Advanced API service with multi-tier fallback system.

**Location**: `src/modules/api/bitcoin-api.js`

#### Methods

##### `async fetchRates(currencies = [])`
Fetches current Bitcoin rates for specified currencies.

**Parameters**:
- `currencies` (Array): Array of currency codes (optional)

**Returns**: `Promise<Object>` - Rates object

##### `async fetchWithFallback()`
Fetches rates using the fallback system.

**Returns**: `Promise<Object>` - Rates object with source information

##### `validateResponse(data)`
Validates API response structure.

**Parameters**:
- `data` (Object): API response data

**Returns**: `boolean` - Validation result

### CacheManager

TTL-based caching system with offline support.

**Location**: `src/modules/api/cache-manager.js`

#### Methods

##### `set(key, data, ttl = 300000)`
Stores data in cache with TTL.

**Parameters**:
- `key` (string): Cache key
- `data` (any): Data to cache
- `ttl` (number): Time to live in milliseconds (default: 5 minutes)

##### `get(key)`
Retrieves data from cache.

**Parameters**:
- `key` (string): Cache key

**Returns**: `any|null` - Cached data or null if expired/not found

##### `isExpired(key)`
Checks if cache entry is expired.

**Parameters**:
- `key` (string): Cache key

**Returns**: `boolean` - True if expired

##### `clear()`
Clears all cache entries.

##### `getOfflineData()`
Gets fallback data for offline use.

**Returns**: `Object` - Sample rate data

## UI Components

### TabManager

Advanced tab management with animations and keyboard navigation.

**Location**: `src/modules/ui/tab-manager.js`

#### Methods

##### `switchMainTab(tabId)`
Switches to a main tab with animation.

**Parameters**:
- `tabId` (string): Tab identifier ('btc', 'bts', 'sts')

**Returns**: `Promise<void>`

##### `switchPage(pageId)`
Switches to a page within the current tab.

**Parameters**:
- `pageId` (string): Page identifier

##### `saveTabState()`
Saves current tab state to localStorage.

##### `restoreTabState()`
Restores tab state from localStorage.

##### `setupKeyboardNavigation()`
Initializes keyboard navigation support.

### RateRenderer

Factory pattern for creating rate cards with enhanced UX.

**Location**: `src/modules/ui/rate-renderer.js`

#### Methods

##### `renderRateCard(currencyCode, rate, cardType, container)`
Creates and renders a rate card.

**Parameters**:
- `currencyCode` (string): Currency code
- `rate` (number): Exchange rate
- `cardType` (string): Type of card to create
- `container` (HTMLElement): Container element

**Returns**: `HTMLElement` - Created card element

##### `updateRateCard(cardElement, newRate)`
Updates an existing rate card with new data.

**Parameters**:
- `cardElement` (HTMLElement): Card element to update
- `newRate` (number): New rate value

##### `sortCardsByRate(container, ascending = false)`
Sorts rate cards by rate value.

**Parameters**:
- `container` (HTMLElement): Container with cards
- `ascending` (boolean): Sort direction

### LoadingManager

Manages loading states and skeleton screens.

**Location**: `src/modules/ui/loading-manager.js`

#### Methods

##### `showSkeleton(container, count = 6)`
Shows skeleton loading screen.

**Parameters**:
- `container` (HTMLElement): Container element
- `count` (number): Number of skeleton cards

##### `hideSkeleton(container)`
Hides skeleton loading screen.

**Parameters**:
- `container` (HTMLElement): Container element

##### `showSpinner(container, message = 'Loading...')`
Shows loading spinner.

**Parameters**:
- `container` (HTMLElement): Container element
- `message` (string): Loading message

##### `hideSpinner(container)`
Hides loading spinner.

**Parameters**:
- `container` (HTMLElement): Container element

### ErrorHandler

User-friendly error handling and retry mechanisms.

**Location**: `src/modules/ui/error-handler.js`

#### Methods

##### `showError(container, message, type = 'error', options = {})`
Displays an error message.

**Parameters**:
- `container` (HTMLElement): Container element
- `message` (string): Error message
- `type` (string): Error type ('error', 'warning', 'info')
- `options` (Object): Additional options

##### `showRetryError(container, message, retryCallback)`
Shows error with retry button.

**Parameters**:
- `container` (HTMLElement): Container element
- `message` (string): Error message
- `retryCallback` (Function): Retry function

##### `clearErrors(container)`
Clears all error messages from container.

**Parameters**:
- `container` (HTMLElement): Container element

## Feature Modules

### PreferencesManager

Comprehensive user preferences and theme management.

**Location**: `src/modules/features/preferences.js`

#### Methods

##### `getPreference(key, defaultValue = null)`
Gets a user preference value.

**Parameters**:
- `key` (string): Preference key
- `defaultValue` (any): Default value if not found

**Returns**: `any` - Preference value

##### `setPreference(key, value)`
Sets a user preference value.

**Parameters**:
- `key` (string): Preference key
- `value` (any): Preference value

##### `applyTheme(theme)`
Applies a theme to the application.

**Parameters**:
- `theme` (string): Theme name ('light', 'dark', 'auto')

##### `exportPreferences()`
Exports all preferences as JSON.

**Returns**: `string` - JSON string of preferences

##### `importPreferences(jsonString)`
Imports preferences from JSON.

**Parameters**:
- `jsonString` (string): JSON preferences string

**Returns**: `boolean` - Success status

### FavoritesManager

Favorites management with drag-and-drop reordering.

**Location**: `src/modules/features/favorites.js`

#### Methods

##### `addFavorite(currencyCode)`
Adds a currency to favorites.

**Parameters**:
- `currencyCode` (string): Currency code to add

**Returns**: `boolean` - Success status

##### `removeFavorite(currencyCode)`
Removes a currency from favorites.

**Parameters**:
- `currencyCode` (string): Currency code to remove

**Returns**: `boolean` - Success status

##### `getFavorites()`
Gets the list of favorite currencies.

**Returns**: `Array<string>` - Array of currency codes

##### `isFavorite(currencyCode)`
Checks if a currency is favorited.

**Parameters**:
- `currencyCode` (string): Currency code to check

**Returns**: `boolean` - True if favorited

##### `reorderFavorites(newOrder)`
Reorders the favorites list.

**Parameters**:
- `newOrder` (Array): New order of currency codes

### SearchManager

Real-time search and filtering functionality.

**Location**: `src/modules/features/search.js`

#### Methods

##### `setSearchQuery(query)`
Sets the current search query.

**Parameters**:
- `query` (string): Search query

##### `filterCurrencies(currencyCodes, favorites = [])`
Filters currencies based on current search and filters.

**Parameters**:
- `currencyCodes` (Array): Array of currency codes to filter
- `favorites` (Array): Array of favorite currency codes

**Returns**: `Array<string>` - Filtered currency codes

##### `highlightMatches(text, query)`
Highlights search matches in text.

**Parameters**:
- `text` (string): Text to highlight
- `query` (string): Search query

**Returns**: `string` - HTML with highlighted matches

##### `clearSearch()`
Clears the current search query and filters.

### SharingManager

Multi-modal sharing functionality.

**Location**: `src/modules/features/sharing.js`

#### Methods

##### `shareRate(rateData, method = 'modal')`
Shares a rate using specified method.

**Parameters**:
- `rateData` (Object): Rate data to share
- `method` (string): Sharing method ('modal', 'clipboard', 'native')

**Returns**: `Promise<boolean>` - Success status

##### `generateShareUrl(rateData)`
Generates a shareable URL for a rate.

**Parameters**:
- `rateData` (Object): Rate data

**Returns**: `string` - Shareable URL

##### `copyToClipboard(text)`
Copies text to clipboard.

**Parameters**:
- `text` (string): Text to copy

**Returns**: `Promise<boolean>` - Success status

### DataVisualizationManager

Data visualization and comparison tools.

**Location**: `src/modules/features/data-visualization.js`

#### Methods

##### `addPercentageChange(card, currencyCode, currentRate)`
Adds percentage change indicator to a rate card.

**Parameters**:
- `card` (HTMLElement): Rate card element
- `currencyCode` (string): Currency code
- `currentRate` (number): Current rate

##### `createMiniChart(currencyCode, container)`
Creates a mini trend chart.

**Parameters**:
- `currencyCode` (string): Currency code
- `container` (HTMLElement): Container element

**Returns**: `HTMLElement` - Chart element

##### `toggleComparisonMode()`
Toggles currency comparison mode.

##### `addToComparison(currencyCode)`
Adds a currency to comparison.

**Parameters**:
- `currencyCode` (string): Currency code to add

**Returns**: `boolean` - Success status

## Utility Modules

### AccessibilityManager

Comprehensive accessibility features and WCAG compliance.

**Location**: `src/modules/utils/accessibility.js`

#### Methods

##### `setupFocusManagement()`
Initializes focus management system.

##### `announceToScreenReader(message, priority = 'polite')`
Announces message to screen readers.

**Parameters**:
- `message` (string): Message to announce
- `priority` (string): Announcement priority ('polite', 'assertive')

##### `setupKeyboardNavigation()`
Initializes keyboard navigation support.

##### `detectSystemPreferences()`
Detects and applies system accessibility preferences.

### PerformanceOptimizer

Performance monitoring and optimization system.

**Location**: `src/modules/utils/performance-optimizer.js`

#### Methods

##### `setupLazyLoading()`
Initializes lazy loading system.

##### `setupVirtualScrolling(container, items, itemHeight = 80)`
Sets up virtual scrolling for large lists.

**Parameters**:
- `container` (HTMLElement): Container element
- `items` (Array): Array of items to render
- `itemHeight` (number): Height of each item in pixels

##### `monitorPerformance()`
Starts performance monitoring.

##### `getPerformanceMetrics()`
Gets current performance metrics.

**Returns**: `Object` - Performance metrics

### PWAManager

Progressive Web App features and management.

**Location**: `src/modules/utils/pwa-manager.js`

#### Methods

##### `registerServiceWorker()`
Registers the service worker.

**Returns**: `Promise<ServiceWorkerRegistration>`

##### `promptInstall()`
Prompts user to install the PWA.

**Returns**: `Promise<boolean>` - Installation result

##### `checkForUpdates()`
Checks for app updates.

**Returns**: `Promise<boolean>` - Update available status

##### `setupBackgroundSync()`
Sets up background synchronization.

## Event System

The application uses a comprehensive event system for module communication.

### Custom Events

#### `tabChanged`
Fired when the active tab changes.

**Detail**:
```javascript
{
  previousTab: 'btc',
  currentTab: 'bts',
  timestamp: Date.now()
}
```

#### `ratesUpdated`
Fired when exchange rates are updated.

**Detail**:
```javascript
{
  rates: { /* rate data */ },
  source: 'coingecko',
  timestamp: Date.now()
}
```

#### `preferenceChanged`
Fired when a user preference changes.

**Detail**:
```javascript
{
  key: 'theme',
  oldValue: 'light',
  newValue: 'dark',
  timestamp: Date.now()
}
```

#### `favoriteChanged`
Fired when favorites are modified.

**Detail**:
```javascript
{
  action: 'add', // 'add', 'remove', 'reorder'
  currencyCode: 'usd',
  favorites: ['usd', 'eur', 'gbp'],
  timestamp: Date.now()
}
```

### Event Listeners

To listen for custom events:

```javascript
document.addEventListener('tabChanged', (event) => {
  console.log('Tab changed:', event.detail);
});

document.addEventListener('ratesUpdated', (event) => {
  console.log('Rates updated:', event.detail);
});
```

## Error Handling

All API methods use consistent error handling patterns:

```javascript
try {
  const result = await apiMethod();
  // Handle success
} catch (error) {
  if (error.name === 'NetworkError') {
    // Handle network errors
  } else if (error.name === 'ValidationError') {
    // Handle validation errors
  } else {
    // Handle other errors
  }
}
```

## Type Definitions

While the application uses vanilla JavaScript, here are the implicit type definitions for better understanding:

### Rate Data
```javascript
{
  currency: string,      // Currency code
  rate: number,         // BTC rate in this currency
  timestamp: Date,      // When this rate was fetched
  source: string        // 'coingecko', 'coindesk', 'cache'
}
```

### Currency Object
```javascript
{
  code: string,         // Currency code (e.g., 'usd')
  name: string,         // Full name (e.g., 'US Dollar')
  symbol: string,       // Currency symbol (e.g., '$')
  flag: string,         // Flag emoji (e.g., '🇺🇸')
  amount: number,       // Standard amount for calculations
  precision: number,    // Decimal places for display
  group: string,        // Geographic group
  popular: boolean      // Popular currency flag
}
```

### Preferences Object
```javascript
{
  theme: string,                    // 'light', 'dark', 'auto'
  activeTab: string,               // Current active tab
  activePages: Object,             // Active pages per tab
  favorites: Array<string>,        // Favorite currency codes
  searchHistory: Array<string>,    // Recent searches
  displaySettings: Object,         // Display preferences
  accessibility: Object           // Accessibility settings
}
```

## Browser Support

The API requires modern browser features:

- **ES6 Modules**: Native import/export support
- **Fetch API**: For HTTP requests
- **LocalStorage**: For data persistence
- **CSS Custom Properties**: For theming
- **Intersection Observer**: For lazy loading
- **Web Share API**: For native sharing (optional)

## Performance Considerations

- All API methods are optimized for performance
- Caching is used extensively to reduce API calls
- Lazy loading prevents unnecessary resource usage
- Virtual scrolling handles large datasets efficiently
- Memory management prevents leaks

## Security

- All user inputs are validated and sanitized
- No external dependencies reduce attack surface
- Content Security Policy compatible
- No sensitive data is stored or transmitted
- HTTPS required for PWA features

This API documentation provides comprehensive coverage of all public interfaces in the Bitcoin Exchange Rates application. For implementation examples and usage patterns, refer to the source code and test files.