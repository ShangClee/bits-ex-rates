# Developer Documentation

## Overview

This document provides comprehensive technical information for developers working with or extending the Bitcoin Exchange Rates application. The application is built with modern vanilla JavaScript using ES6 modules, maintaining a no-build approach while providing enterprise-grade functionality.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Development Setup](#development-setup)
- [Code Organization](#code-organization)
- [Module System](#module-system)
- [Testing Framework](#testing-framework)
- [Performance Optimization](#performance-optimization)
- [Accessibility Implementation](#accessibility-implementation)
- [PWA Implementation](#pwa-implementation)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Event System](#event-system)
- [Styling Architecture](#styling-architecture)
- [Build and Deployment](#build-and-deployment)
- [Contributing Guidelines](#contributing-guidelines)

## Architecture Overview

### Design Principles

The application follows these core principles:

1. **No Build Process**: Pure ES6 modules without transpilation or bundling
2. **Modular Architecture**: Clear separation of concerns with ES6 modules
3. **Progressive Enhancement**: Core functionality works without JavaScript
4. **Accessibility First**: WCAG 2.1 AA compliance built-in
5. **Performance Optimized**: Lazy loading, caching, and efficient rendering
6. **Mobile First**: Responsive design with touch optimization

### Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript ES6+
- **Modules**: Native ES6 import/export
- **Styling**: CSS Custom Properties, Grid, Flexbox
- **PWA**: Service Worker, Web App Manifest
- **Testing**: Jest with ES6 module support
- **APIs**: Fetch API with multi-tier fallback
- **Storage**: LocalStorage with TTL management
- **Performance**: Intersection Observer, Virtual Scrolling

### Application Structure

```
BitcoinExchangeApp (main.js)
├── Data Layer
│   ├── CurrencyConfig (currency metadata)
│   ├── RateCalculator (Bitcoin conversions)
│   └── Formatter (number/currency formatting)
├── API Layer
│   ├── BitcoinAPIService (multi-tier API client)
│   └── CacheManager (TTL-based caching)
├── UI Layer
│   ├── TabManager (navigation and state)
│   ├── RateRenderer (card creation)
│   ├── LoadingManager (loading states)
│   └── ErrorHandler (error display)
├── Feature Layer
│   ├── PreferencesManager (user settings)
│   ├── FavoritesManager (favorites system)
│   ├── SearchManager (search/filtering)
│   ├── SharingManager (sharing functionality)
│   └── DataVisualizationManager (charts/trends)
└── Utility Layer
    ├── AccessibilityManager (a11y features)
    ├── PerformanceOptimizer (performance monitoring)
    ├── PWAManager (PWA features)
    └── AppInitializer (startup coordination)
```

## Development Setup

### Prerequisites

- **Node.js 16+** (for testing only)
- **Python 3** (for local server)
- **Modern Browser** (Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bitcoin-exchange-rates

# Install development dependencies (for testing)
npm install

# Start development server
npm run start
# or
python3 -m http.server 8080

# Access application
open http://localhost:8080
```

### Development Commands

```bash
# Development server
npm run start          # Python HTTP server on port 8080
npm run serve          # Alternative command

# Testing
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage reports
npm run test:ci       # CI/CD mode

# No build commands needed - pure static files
```

### Development Workflow

1. **Edit source files** directly in `src/` directory
2. **Refresh browser** to see changes (no build step)
3. **Run tests** to verify functionality
4. **Check console** for errors or warnings
5. **Test across browsers** for compatibility

## Code Organization

### File Structure

```
src/
├── modules/
│   ├── api/                    # API services
│   │   ├── bitcoin-api.js      # Multi-tier API client
│   │   └── cache-manager.js    # Caching system
│   ├── data/                   # Data processing
│   │   ├── currency-config.js  # Currency metadata
│   │   ├── rate-calculator.js  # Bitcoin conversions
│   │   └── formatter.js        # Formatting utilities
│   ├── ui/                     # UI components
│   │   ├── tab-manager.js      # Navigation management
│   │   ├── rate-renderer.js    # Card rendering
│   │   ├── loading-manager.js  # Loading states
│   │   └── error-handler.js    # Error handling
│   ├── features/               # Feature modules
│   │   ├── preferences.js      # User preferences
│   │   ├── favorites.js        # Favorites system
│   │   ├── search.js          # Search functionality
│   │   ├── sharing.js         # Sharing features
│   │   ├── data-visualization.js # Charts and trends
│   │   ├── integration.js     # Feature coordination
│   │   └── demo.js            # Demo utilities
│   └── utils/                  # Utility modules
│       ├── accessibility.js    # Accessibility features
│       ├── keyboard-navigation.js # Keyboard handling
│       ├── mobile-enhancements.js # Mobile optimization
│       ├── performance-optimizer.js # Performance monitoring
│       ├── pwa-manager.js     # PWA functionality
│       └── app-initializer.js # Application startup
└── styles/
    ├── variables.css          # Design tokens
    ├── base.css              # Base styles
    ├── components.css        # Component styles
    ├── layout.css            # Layout systems
    ├── themes.css            # Theme variations
    ├── accessibility.css     # Accessibility styles
    ├── mobile.css           # Mobile optimizations
    ├── performance.css      # Performance styles
    ├── pwa.css             # PWA-specific styles
    └── main.css            # Style orchestration
```

### Naming Conventions

#### Files and Directories
- **kebab-case**: `rate-calculator.js`, `data-visualization.css`
- **Descriptive names**: Clear purpose indication
- **Module grouping**: Related functionality in same directory

#### JavaScript
- **Classes**: PascalCase (`BitcoinAPIService`, `TabManager`)
- **Functions**: camelCase (`calculateFiatPerUnit`, `formatCurrency`)
- **Variables**: camelCase (`currentRates`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`SATOSHI_PER_BTC`, `API_TIMEOUT`)

#### CSS
- **Classes**: kebab-case (`.rate-card`, `.main-tab-btn`)
- **IDs**: camelCase (`#mainContainer`, `#fiatPerBtcContainer`)
- **Custom Properties**: kebab-case (`--color-primary`, `--space-lg`)

#### HTML
- **IDs**: camelCase (`id="mainTabBtc"`)
- **Classes**: kebab-case (`class="rate-card rate-card--highlighted"`)
- **Data attributes**: kebab-case (`data-currency-code="usd"`)

## Module System

### ES6 Module Pattern

All modules follow consistent patterns:

```javascript
// Module structure template
class ModuleName {
    constructor(options = {}) {
        this.config = { ...this.defaultConfig, ...options };
        this.state = {};
        this.init();
    }

    get defaultConfig() {
        return {
            // Default configuration
        };
    }

    async init() {
        // Initialization logic
        this.setupEventListeners();
        this.setupUI();
    }

    setupEventListeners() {
        // Event listener setup
    }

    setupUI() {
        // UI initialization
    }

    // Public methods
    publicMethod() {
        // Public API
    }

    // Private methods (convention: underscore prefix)
    _privateMethod() {
        // Internal logic
    }

    destroy() {
        // Cleanup logic
    }
}

export default ModuleName;
```

### Module Communication

#### Event-Driven Architecture

```javascript
// Dispatching custom events
document.dispatchEvent(new CustomEvent('ratesUpdated', {
    detail: {
        rates: newRates,
        source: 'coingecko',
        timestamp: Date.now()
    }
}));

// Listening for events
document.addEventListener('ratesUpdated', (event) => {
    this.handleRatesUpdate(event.detail);
});
```

#### Direct Module References

```javascript
// In main application
this.modules = new Map();
this.modules.set('tabManager', new TabManager());
this.modules.set('rateRenderer', new RateRenderer());

// Cross-module communication
const tabManager = this.modules.get('tabManager');
tabManager.switchTab('btc');
```

### Module Lifecycle

1. **Construction**: Initialize configuration and state
2. **Initialization**: Setup UI and event listeners
3. **Operation**: Handle events and user interactions
4. **Cleanup**: Remove listeners and clear resources

## Testing Framework

### Jest Configuration

The application uses Jest with ES6 module support:

```javascript
// jest.config.js
export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': ['babel-jest', {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
    }]
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75
    }
  }
};
```

### Test Structure

```
tests/
├── setup.js              # Global test configuration
├── mocks/
│   └── sample-data.js     # Mock data and responses
├── utils/
│   └── test-helpers.js    # Testing utilities
└── unit/
    ├── api/               # API service tests
    ├── data/              # Data module tests
    ├── features/          # Feature module tests
    └── ui/                # UI component tests
```

### Writing Tests

#### Unit Test Example

```javascript
import { describe, test, expect, beforeEach } from '@jest/globals';
import RateCalculator from '../../src/modules/data/rate-calculator.js';

describe('RateCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new RateCalculator();
    });

    test('should convert BTC to BITS correctly', () => {
        const btcAmount = 1;
        const bitsAmount = calculator.convertToBits(btcAmount);
        expect(bitsAmount).toBe(1000000);
    });

    test('should handle edge cases', () => {
        expect(calculator.convertToBits(0)).toBe(0);
        expect(calculator.convertToBits(-1)).toBe(-1000000);
    });
});
```

#### Mock Usage

```javascript
import { mockApiResponse, mockCurrencies } from '../mocks/sample-data.js';

// Mock fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponse)
    })
);
```

### Test Coverage

Run coverage reports to ensure comprehensive testing:

```bash
npm run test:coverage
```

Coverage reports are generated in multiple formats:
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **JSON**: `coverage/coverage-final.json`

## Performance Optimization

### Lazy Loading Implementation

```javascript
class PerformanceOptimizer {
    setupLazyLoading() {
        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadLazyElement(entry.target);
                    this.lazyLoadObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
    }

    async loadLazyElement(element) {
        const moduleType = element.dataset.lazyModule;
        try {
            const module = await import(`../features/${moduleType}.js`);
            const instance = new module.default();
            element.classList.add('lazy-loaded');
        } catch (error) {
            console.warn(`Failed to load lazy module: ${moduleType}`, error);
        }
    }
}
```

### Virtual Scrolling

```javascript
setupVirtualScrolling(container, items, itemHeight = 80) {
    const containerHeight = container.clientHeight;
    const visibleItems = Math.ceil(containerHeight / itemHeight) + 2;
    
    const updateVisibleItems = () => {
        const scrollTop = container.scrollTop;
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + visibleItems, items.length);
        
        this.renderVisibleItems(container, items, startIndex, endIndex, itemHeight);
    };
    
    container.addEventListener('scroll', this.debounce(updateVisibleItems, 16));
    updateVisibleItems(); // Initial render
}
```

### Memory Management

```javascript
class MemoryManager {
    constructor() {
        this.cleanupInterval = setInterval(() => {
            this.performCleanup();
        }, 30000); // Clean up every 30 seconds
    }

    performCleanup() {
        // Remove unused DOM elements
        this.cleanupUnusedElements();
        
        // Clear expired cache entries
        this.clearExpiredCache();
        
        // Trigger garbage collection hint
        if (window.gc) window.gc();
    }

    destroy() {
        clearInterval(this.cleanupInterval);
    }
}
```

## Accessibility Implementation

### WCAG 2.1 AA Compliance

The application implements comprehensive accessibility features:

#### Semantic HTML

```html
<main role="main" aria-label="Bitcoin Exchange Rates">
    <nav role="tablist" aria-label="Bitcoin denominations">
        <button role="tab" aria-selected="true" aria-controls="btc-panel">
            Bitcoin (BTC)
        </button>
    </nav>
    
    <section role="tabpanel" id="btc-panel" aria-labelledby="btc-tab">
        <h2>Bitcoin Exchange Rates</h2>
        <!-- Rate cards -->
    </section>
</main>
```

#### ARIA Live Regions

```javascript
class AccessibilityManager {
    announceToScreenReader(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}
```

#### Keyboard Navigation

```javascript
setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case '1':
                this.switchTab('btc');
                break;
            case '2':
                this.switchTab('bts');
                break;
            case '3':
                this.switchTab('sts');
                break;
            case 'ArrowLeft':
                this.navigateTabs(-1);
                break;
            case 'ArrowRight':
                this.navigateTabs(1);
                break;
        }
    });
}
```

#### Focus Management

```css
/* Visible focus indicators */
.rate-card:focus,
.main-tab-btn:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .rate-card {
        border: 2px solid var(--text-primary);
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

## PWA Implementation

### Service Worker

```javascript
// sw.js
const CACHE_NAME = 'bitcoin-rates-v1';
const API_CACHE = 'bitcoin-rates-api-v1';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/main.js',
    '/styles.css',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        event.respondWith(handleAPIRequest(event.request));
    } else {
        event.respondWith(handleStaticRequest(event.request));
    }
});

async function handleAPIRequest(request) {
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Stale-while-revalidate strategy
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    });
    
    return cachedResponse || fetchPromise;
}
```

### Web App Manifest

```json
{
  "name": "Bitcoin Exchange Rates",
  "short_name": "BTC Rates",
  "description": "Bitcoin exchange rates in BTC, BITS, and Satoshi",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#f7931a",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "BTC Rates",
      "url": "/?tab=btc",
      "icons": [{"src": "icons/shortcut-btc.png", "sizes": "96x96"}]
    },
    {
      "name": "BITS Rates",
      "url": "/?tab=bts",
      "icons": [{"src": "icons/shortcut-bits.png", "sizes": "96x96"}]
    },
    {
      "name": "Satoshi Rates",
      "url": "/?tab=sts",
      "icons": [{"src": "icons/shortcut-sats.png", "sizes": "96x96"}]
    }
  ]
}
```

## API Integration

### Multi-Tier Fallback System

```javascript
class BitcoinAPIService {
    constructor() {
        this.apis = [
            {
                name: 'coingecko',
                url: 'https://api.coingecko.com/api/v3/simple/price',
                handler: this.handleCoinGeckoResponse.bind(this)
            },
            {
                name: 'coindesk',
                url: 'https://api.coindesk.com/v1/bpi/currentprice.json',
                handler: this.handleCoinDeskResponse.bind(this)
            }
        ];
        this.currentApiIndex = 0;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async fetchRates(currencies = []) {
        for (let i = 0; i < this.apis.length; i++) {
            try {
                const api = this.apis[this.currentApiIndex];
                const response = await this.fetchFromAPI(api, currencies);
                this.retryCount = 0; // Reset on success
                return response;
            } catch (error) {
                console.warn(`API ${this.apis[this.currentApiIndex].name} failed:`, error);
                this.currentApiIndex = (this.currentApiIndex + 1) % this.apis.length;
                
                if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    await this.delay(Math.pow(2, this.retryCount) * 1000); // Exponential backoff
                } else {
                    break;
                }
            }
        }
        
        // All APIs failed, return sample data
        return this.getSampleData();
    }

    async fetchFromAPI(api, currencies) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        try {
            const response = await fetch(api.url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return api.handler(data, currencies);
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }
}
```

### Caching Strategy

```javascript
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes
        this.storageKey = 'bitcoin-rates-cache';
        this.loadFromStorage();
    }

    set(key, data, ttl = this.defaultTTL) {
        const entry = {
            data,
            timestamp: Date.now(),
            ttl
        };
        
        this.cache.set(key, entry);
        this.saveToStorage();
    }

    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) return null;
        
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            this.saveToStorage();
            return null;
        }
        
        return entry.data;
    }

    isExpired(entry) {
        return Date.now() - entry.timestamp > entry.ttl;
    }

    saveToStorage() {
        try {
            const serialized = JSON.stringify(Array.from(this.cache.entries()));
            localStorage.setItem(this.storageKey, serialized);
        } catch (error) {
            console.warn('Failed to save cache to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const entries = JSON.parse(stored);
                this.cache = new Map(entries);
                this.cleanup(); // Remove expired entries
            }
        } catch (error) {
            console.warn('Failed to load cache from localStorage:', error);
            this.cache = new Map();
        }
    }
}
```

## State Management

### Application State

```javascript
class BitcoinExchangeApp {
    constructor() {
        this.state = {
            currentRates: {},
            activeTab: 'btc',
            activePages: {
                btc: 'fiat-per-btc',
                bts: 'fiat-per-bits',
                sts: 'fiat-per-satoshi'
            },
            isLoading: false,
            lastUpdate: null,
            error: null
        };
        
        this.stateListeners = new Set();
    }

    setState(updates) {
        const previousState = { ...this.state };
        this.state = { ...this.state, ...updates };
        
        // Notify listeners
        this.stateListeners.forEach(listener => {
            listener(this.state, previousState);
        });
        
        // Dispatch state change event
        document.dispatchEvent(new CustomEvent('stateChanged', {
            detail: { current: this.state, previous: previousState }
        }));
    }

    subscribe(listener) {
        this.stateListeners.add(listener);
        return () => this.stateListeners.delete(listener);
    }

    getState() {
        return { ...this.state }; // Return copy to prevent mutations
    }
}
```

### Persistent State

```javascript
class StateManager {
    constructor(key, defaultState = {}) {
        this.storageKey = key;
        this.defaultState = defaultState;
        this.state = this.loadState();
    }

    loadState() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...this.defaultState, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load state:', error);
        }
        return { ...this.defaultState };
    }

    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (error) {
            console.warn('Failed to save state:', error);
        }
    }

    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.saveState();
    }

    getState() {
        return { ...this.state };
    }
}
```

## Event System

### Custom Events

The application uses a comprehensive event system for module communication:

```javascript
// Event definitions
const EVENTS = {
    TAB_CHANGED: 'tabChanged',
    RATES_UPDATED: 'ratesUpdated',
    PREFERENCE_CHANGED: 'preferenceChanged',
    FAVORITE_CHANGED: 'favoriteChanged',
    SEARCH_QUERY_CHANGED: 'searchQueryChanged',
    THEME_CHANGED: 'themeChanged'
};

// Event dispatcher utility
class EventDispatcher {
    static dispatch(eventType, detail = {}) {
        const event = new CustomEvent(eventType, {
            detail: {
                ...detail,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    static listen(eventType, handler) {
        document.addEventListener(eventType, handler);
        return () => document.removeEventListener(eventType, handler);
    }
}

// Usage example
EventDispatcher.dispatch(EVENTS.TAB_CHANGED, {
    previousTab: 'btc',
    currentTab: 'bts'
});

const unsubscribe = EventDispatcher.listen(EVENTS.RATES_UPDATED, (event) => {
    console.log('Rates updated:', event.detail);
});
```

### Event-Driven Module Communication

```javascript
class TabManager {
    switchTab(tabId) {
        const previousTab = this.currentTab;
        this.currentTab = tabId;
        
        // Update UI
        this.updateTabDisplay();
        
        // Notify other modules
        EventDispatcher.dispatch(EVENTS.TAB_CHANGED, {
            previousTab,
            currentTab: tabId
        });
    }
}

class RateRenderer {
    constructor() {
        // Listen for tab changes
        EventDispatcher.listen(EVENTS.TAB_CHANGED, (event) => {
            this.handleTabChange(event.detail);
        });
        
        // Listen for rate updates
        EventDispatcher.listen(EVENTS.RATES_UPDATED, (event) => {
            this.updateRateCards(event.detail.rates);
        });
    }
}
```

## Styling Architecture

### CSS Custom Properties (Design Tokens)

```css
:root {
  /* Color System */
  --color-primary: #f7931a;
  --color-secondary: #2563eb;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #dc2626;
  --color-info: #0ea5e9;
  
  /* Neutral Colors */
  --color-white: #ffffff;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  
  /* Semantic Colors */
  --bg-primary: var(--color-white);
  --bg-secondary: var(--color-gray-50);
  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-600);
  --border-color: var(--color-gray-200);
  
  /* Typography */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
  
  /* Spacing */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 0.75rem;   /* 12px */
  --space-lg: 1rem;      /* 16px */
  --space-xl: 1.25rem;   /* 20px */
  --space-2xl: 1.5rem;   /* 24px */
  --space-3xl: 2rem;     /* 32px */
  --space-4xl: 2.5rem;   /* 40px */
  --space-5xl: 3rem;     /* 48px */
  --space-6xl: 4rem;     /* 64px */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Border Radius */
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}
```

### Theme System

```css
/* Dark theme */
[data-theme="dark"] {
  --bg-primary: var(--color-gray-900);
  --bg-secondary: var(--color-gray-800);
  --text-primary: var(--color-gray-100);
  --text-secondary: var(--color-gray-300);
  --border-color: var(--color-gray-700);
}

/* High contrast theme */
[data-theme="high-contrast"] {
  --bg-primary: #000000;
  --bg-secondary: #000000;
  --text-primary: #ffffff;
  --text-secondary: #ffffff;
  --border-color: #ffffff;
  --color-primary: #ffff00;
  --color-error: #ff0000;
  --color-success: #00ff00;
}

/* Auto theme (system preference) */
@media (prefers-color-scheme: dark) {
  [data-theme="auto"] {
    --bg-primary: var(--color-gray-900);
    --bg-secondary: var(--color-gray-800);
    --text-primary: var(--color-gray-100);
    --text-secondary: var(--color-gray-300);
    --border-color: var(--color-gray-700);
  }
}
```

### Component Architecture

```css
/* Base component */
.rate-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
  
  /* Performance optimization */
  will-change: transform, box-shadow;
  transform: translateZ(0); /* Force hardware acceleration */
}

/* Interactive states */
.rate-card:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: var(--shadow-md);
}

.rate-card:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Variants */
.rate-card--highlighted {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
}

.rate-card--loading {
  opacity: 0.6;
  pointer-events: none;
}

/* Responsive design */
@media (max-width: 640px) {
  .rate-card {
    padding: var(--space-md);
  }
}
```

## Build and Deployment

### No Build Process

The application intentionally avoids build tools:

**Benefits**:
- Immediate development feedback
- No build tool dependencies
- Easier debugging and inspection
- Reduced complexity
- Better browser caching

**Requirements**:
- Modern browser with ES6 module support
- HTTP server (not file:// protocol)
- HTTPS for PWA features

### Deployment Options

#### Static Hosting

```bash
# Any static web server
python3 -m http.server 8080
# or
npx serve .
# or
php -S localhost:8080
```

#### CDN Deployment

```bash
# Build for CDN (optional optimization)
# Copy all files to CDN
# Ensure proper MIME types:
# .js files: application/javascript
# .css files: text/css
# .json files: application/json
```

#### Docker Deployment

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Performance Optimization for Production

#### HTTP Headers

```nginx
# Nginx configuration
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}

# Security headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
```

#### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    connect-src 'self' https://api.coingecko.com https://api.coindesk.com;
    img-src 'self' data:;
    font-src 'self';
">
```

## Contributing Guidelines

### Code Style

#### JavaScript

```javascript
// Use modern ES6+ features
const fetchRates = async (currencies) => {
    const { data } = await apiService.getRates(currencies);
    return data;
};

// Prefer const/let over var
const API_TIMEOUT = 10000;
let currentRates = {};

// Use destructuring
const { bitcoin: { usd, eur } } = apiResponse;

// Use template literals
const message = `Rate updated: ${rate} ${currency}`;

// Use arrow functions for callbacks
currencies.map(code => ({ code, rate: rates[code] }));
```

#### CSS

```css
/* Use logical properties when possible */
.element {
    margin-inline: var(--space-lg);
    padding-block: var(--space-md);
}

/* Prefer custom properties over hardcoded values */
.component {
    color: var(--text-primary);
    background: var(--bg-secondary);
}

/* Use consistent naming */
.rate-card__header { }
.rate-card__body { }
.rate-card--highlighted { }
```

### Testing Requirements

- **Unit tests** for all new modules
- **Integration tests** for module interactions
- **Accessibility tests** for UI components
- **Performance tests** for optimization features

### Documentation Standards

- **JSDoc comments** for all public methods
- **README updates** for new features
- **API documentation** for new interfaces
- **User guide updates** for user-facing features

### Pull Request Process

1. **Create feature branch** from main
2. **Implement changes** with tests
3. **Update documentation**
4. **Run test suite** (`npm test`)
5. **Check accessibility** compliance
6. **Test across browsers**
7. **Submit pull request** with description

### Performance Guidelines

- **Lazy load** non-critical features
- **Use efficient selectors** in CSS
- **Minimize DOM manipulation**
- **Implement proper cleanup**
- **Monitor memory usage**
- **Test on low-end devices**

This developer documentation provides comprehensive technical information for working with the Bitcoin Exchange Rates application. The modular architecture, modern JavaScript patterns, and comprehensive testing framework make it easy to maintain and extend the application while preserving its performance and accessibility characteristics.