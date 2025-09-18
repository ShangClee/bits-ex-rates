# Bitcoin Exchange Rates

A modern, modular web application that displays Bitcoin exchange rates across all three major denominations: Bitcoin (BTC), BITS, and Satoshi (STS). Built with ES6 modules and modern JavaScript practices for enhanced maintainability and extensibility.

## Overview

This application provides a unified interface for viewing Bitcoin exchange rates in different formats:
- **1 Bitcoin = 1,000,000 BITS = 100,000,000 satoshis**

The application has been modernized with a modular architecture, featuring separate modules for data processing, formatting, and rate calculations, making it easier to maintain and extend.

## 3-Tab Complete Structure

### 🪙 **BTC Tab (Bitcoin)**
Full Bitcoin exchange rates with two viewing modes:

#### Page 1: Fiat per BTC
- Shows how much fiat currency equals 1 Bitcoin
- Format: `1 BTC = $43,000.00 USD`
- Perfect for checking current Bitcoin prices

#### Page 2: BTC per Fiat
- Shows how much Bitcoin you can buy with standard fiat amounts
- Format: `$1 USD = 0.000023 BTC`
- Useful for investment planning

### ⚡ **BTS Tab (BITS)**
BITS denomination exchange rates (1 Bitcoin = 1,000,000 BITS):

#### Page 1: Fiat per BITS
- Shows how much fiat currency equals 1 BITS
- Format: `1 BITS = $0.043 000 USD`
- Ideal for micro-transactions

#### Page 2: BITS per Fiat
- Shows how many BITS you can buy with standard fiat amounts
- Format: `$1 USD = 23.26 BITS`
- Great for small purchases

### ⚡ **STS Tab (Satoshi)**
Satoshi denomination exchange rates (1 Bitcoin = 100,000,000 satoshis):

#### Page 1: Fiat per Satoshi
- Shows how much fiat currency equals 1 Satoshi
- Format: `1 Satoshi = $0.00043000 USD`
- Perfect for Lightning Network transactions

#### Page 2: Satoshi per Fiat
- Shows how many Satoshi you can buy with standard fiat amounts
- Format: `$1 USD = 2.33K sats`
- Essential for stacking sats

## Features

### 🌍 **Multi-Currency Support**
Supports 20 major world currencies with enhanced metadata and grouping:
- **Americas**: USD 🇺🇸, CAD 🇨🇦, MXN 🇲🇽, BRL 🇧🇷
- **Europe**: EUR 🇪🇺, GBP 🇬🇧, CHF 🇨🇭, SEK 🇸🇪, NOK 🇳🇴, TRY 🇹🇷
- **Asia**: JPY 🇯🇵, CNY 🇨🇳, SGD 🇸🇬, HKD 🇭🇰, TWD 🇹🇼, KRW 🇰🇷, INR 🇮🇳
- **Oceania**: AUD 🇦🇺, NZD 🇳🇿
- **Africa**: ZAR 🇿🇦

Each currency includes:
- Native symbols and flag emojis
- Precision settings for optimal display
- Regional grouping for better organization
- Popular currency prioritization

### 📱 **Responsive Design**
- Mobile-friendly grid layout
- Hover effects and smooth transitions
- Clean, modern interface with flag icons
- Optimized for all screen sizes

### 🔄 **Advanced API Integration**
- **Primary**: CoinGecko API for real-time rates across all 20 currencies
- **Fallback**: CoinDesk API with approximate exchange rates based on USD
- **Final Fallback**: Sample data for offline/development use
- **Request Debouncing**: Prevents multiple simultaneous API calls (1-second debounce)
- **Exponential Backoff**: Intelligent retry logic with increasing delays (up to 30 seconds)
- **Network Detection**: Automatic online/offline status monitoring
- **Response Validation**: Schema validation for all API responses
- **Timeout Handling**: 10-second request timeouts with graceful fallback
- **Cache Integration**: TTL-based caching with offline data management

### 🎯 **Advanced Formatting System**
- **BTC amounts**: Adaptive precision (4-8 decimals) or scientific notation for very small values
- **BITS amounts**: K/M suffixes with spaced decimal formatting (e.g., "0.043 000")
- **Satoshi amounts**: K/M/B suffixes with "sats" abbreviation for readability
- **Fiat amounts**: Locale-aware formatting with proper currency symbols and positioning
- **Percentage changes**: Color-coded indicators with proper sign handling
- **Timestamps**: Human-readable date/time formatting with duration support

### ⚙️ **User Preferences & Customization**
- **Theme Management**: Light, dark, and auto themes with system preference detection
- **Accessibility Options**: Reduced motion, high contrast, and large text settings
- **State Persistence**: Automatic saving of tab preferences, theme choices, and accessibility settings
- **Display Settings**: Customizable animations, compact mode, flag visibility, and regional grouping
- **Import/Export**: Backup and restore user preferences as JSON
- **System Integration**: Automatic detection of system accessibility preferences

## Technical Implementation

### Modular Architecture
The application now uses ES6 modules with clear separation of concerns:

#### **Data Layer**
- **Currency Configuration**: Centralized currency metadata with grouping and precision settings
- **Rate Calculator**: Mathematical operations for Bitcoin unit conversions with validation
- **Formatter**: Comprehensive number, currency, and Bitcoin amount formatting utilities

#### **API Service Layer**
- **Bitcoin API Service**: Advanced API client with multi-tier fallback system
- **Cache Manager**: TTL-based caching with LocalStorage integration and offline support
- **Request Management**: Debouncing, exponential backoff, and network status detection
- **Error Handling**: Comprehensive error recovery with graceful degradation

#### **UI Component Layer**
- **Tab Manager**: Advanced tab switching with smooth animations, keyboard navigation, and state persistence
- **Rate Renderer**: Factory pattern for creating different types of rate cards with semantic HTML
- **Loading Manager**: Skeleton screens and loading states for better perceived performance
- **Error Handler**: User-friendly error messages with retry mechanisms and offline indicators

#### **Navigation System**
- **Main Tabs**: Switch between BTC, BTS, STS with smooth fade transitions (300ms duration)
- **Sub Navigation**: Each tab has 2 pages with animated page transitions
- **Keyboard Support**: Full keyboard navigation (1/2/3 keys, arrow keys, Tab key)
- **State Persistence**: Remembers tab and page state across browser sessions (24-hour TTL)
- **Accessibility**: Screen reader announcements and proper ARIA attributes

#### **Data Processing**
- Precise Bitcoin unit conversions using constants (1 BTC = 1M BITS = 100M sats)
- Handles both "per unit" and "units per fiat" calculations with proper precision
- Implements adaptive rounding and formatting for each denomination
- Validates rate data for reasonableness and consistency

#### **UI Component System**
- **Tab Manager**: Advanced tab switching with smooth animations and keyboard navigation
- **Rate Renderer**: Factory pattern for creating different types of rate cards
- **Loading Manager**: Skeleton screens and loading states for better perceived performance
- **Error Handler**: User-friendly error messages with retry mechanisms and offline indicators

#### **Feature Layer**
- **Preferences Manager**: Comprehensive user settings with theme switching, accessibility options, and persistent storage
- **Tab State Management**: Automatic saving and restoration of user's tab and page preferences
- **Theme System**: Light, dark, and auto themes with system preference detection
- **Accessibility Controls**: Reduced motion, high contrast, and large text options

#### **Enhanced Error Handling**
- Multi-tier API fallback system with intelligent retry logic
- Comprehensive input validation and sanitization
- Loading states with skeleton screens for better UX
- Graceful degradation for offline use with cached data

## Running the Application

### Option 1: NPM Script (Recommended)
```bash
npm run start
# or
npm run serve
```
Both commands start a Python HTTP server on port 8080. Then visit: http://localhost:8080

### Option 2: Python HTTP Server
```bash
python3 -m http.server 8080
```
Then visit: http://localhost:8080

### Option 3: Any Web Server
Simply serve the files from any web server since it's a static HTML/CSS/JS application.

### Option 4: Direct File Access
Open `index.html` directly in your browser (with limited API functionality due to CORS restrictions).

## Project Structure

```
bitcoin-exchange-rates/
├── index.html                          # Main HTML with 3-tab structure
├── script.js                           # Main application entry point
├── styles.css                          # CSS styling for all tabs
├── package.json                        # NPM configuration
├── README.md                           # This documentation
├── .gitignore                         # Git ignore rules
├── .kiro/                             # Kiro AI assistant configuration
│   ├── specs/                         # Project specifications and requirements
│   └── steering/                      # AI guidance and best practices
└── src/                               # Modular source code
    ├── modules/
    │   ├── api/
    │   │   ├── bitcoin-api.js          # Advanced API service with fallback system
    │   │   └── cache-manager.js        # TTL-based caching and offline support
    │   ├── data/
    │   │   ├── currency-config.js      # Currency metadata and configuration
    │   │   ├── rate-calculator.js      # Bitcoin rate conversion logic
    │   │   └── formatter.js            # Number and currency formatting utilities
    │   ├── ui/
    │   │   ├── tab-manager.js          # Tab switching with animations and keyboard navigation
    │   │   ├── rate-renderer.js        # Rate card rendering with factory patterns
    │   │   ├── loading-manager.js      # Loading states and skeleton screens
    │   │   └── error-handler.js        # Error display and user feedback
    │   ├── features/
    │   │   ├── preferences.js          # User preferences and theme management
    │   │   ├── favorites.js            # Favorites management with drag & drop
    │   │   ├── search.js              # Search and filtering functionality
    │   │   ├── integration.js         # Features integration and coordination
    │   │   └── demo.js                # Demo utilities and testing tools
    │   └── utils/
    │       ├── accessibility.js        # Accessibility utilities and enhancements
    │       ├── keyboard-navigation.js  # Keyboard navigation management
    │       ├── mobile-enhancements.js  # Mobile-specific optimizations
    │       └── app-initializer.js      # Application initialization and setup
    └── styles/
        ├── variables.css              # CSS custom properties and design tokens
        ├── base.css                   # Base styles and resets
        ├── components.css             # Component-specific styles
        ├── layout.css                 # Layout and grid systems
        ├── themes.css                 # Theme variations and dark mode
        ├── accessibility.css          # Accessibility-focused styles
        ├── mobile.css                 # Mobile-responsive styles
        ├── main.css                   # Main stylesheet orchestration
        ├── preferences.css            # User preferences and settings UI
        ├── favorites.css              # Favorites management styles
        ├── search.css                 # Search and filtering UI
        └── features.css               # Feature integration styles
```

### Module Overview

#### **Currency Configuration (`src/modules/data/currency-config.js`)**
- Centralized currency definitions with symbols, flags, and metadata
- Regional grouping (Americas, Europe, Asia, Oceania, Africa)
- Popular currency prioritization for enhanced UX
- Utility functions for filtering and accessing currency data

#### **Rate Calculator (`src/modules/data/rate-calculator.js`)**
- Bitcoin unit conversion constants and functions
- Precise mathematical operations for BTC ↔ BITS ↔ Satoshi conversions
- Fiat calculation utilities for both directions (crypto per fiat, fiat per crypto)
- Input validation and rate reasonableness checks

#### **Formatter (`src/modules/data/formatter.js`)**
- Locale-aware number formatting with international support
- Currency formatting with proper symbol positioning
- Bitcoin amount formatting with adaptive precision
- Large number formatting with K/M/B suffixes
- Percentage, timestamp, and duration formatting utilities

#### **Bitcoin API Service (`src/modules/api/bitcoin-api.js`)**
- Multi-tier API fallback system (CoinGecko → CoinDesk → Sample Data)
- Request debouncing to prevent API spam (1-second debounce window)
- Exponential backoff retry logic with configurable delays
- Network status monitoring with online/offline detection
- Response validation and error handling for all API endpoints
- Timeout management with 10-second request limits
- Singleton pattern for consistent API access across the application

#### **Cache Manager (`src/modules/api/cache-manager.js`)**
- TTL-based caching system with configurable expiration times
- LocalStorage integration for persistent data across sessions
- Offline data management for graceful degradation
- Cache invalidation and cleanup utilities
- Memory-efficient storage with automatic cleanup

#### **Tab Manager (`src/modules/ui/tab-manager.js`)**
- Advanced tab switching with smooth fade animations (300ms duration)
- Keyboard navigation support (1/2/3 keys, arrow keys, Tab key)
- State persistence across browser sessions with 24-hour TTL
- Accessibility features with screen reader announcements
- Custom event system for inter-module communication
- Animation prevention during rapid tab switching

#### **Rate Renderer (`src/modules/ui/rate-renderer.js`)**
- Factory pattern for creating different types of rate cards
- Semantic HTML structure with proper accessibility attributes
- Hover effects and micro-interactions for enhanced UX
- Reusable card templates for consistent styling
- Dynamic content updates with smooth transitions

#### **Loading Manager (`src/modules/ui/loading-manager.js`)**
- Skeleton screens for better perceived performance during API calls
- Loading spinners and progress indicators
- Graceful loading state management across different UI components
- Smooth transitions between loading and loaded states

#### **Error Handler (`src/modules/ui/error-handler.js`)**
- User-friendly error messages with actionable information
- Retry mechanisms for failed API requests
- Offline indicators and network status feedback
- Error categorization and appropriate user guidance

#### **Preferences Manager (`src/modules/features/preferences.js`)**
- Comprehensive user settings management with persistent storage
- Theme switching (light, dark, auto) with system preference detection
- Accessibility controls (reduced motion, high contrast, large text)
- Tab state persistence across browser sessions
- Display settings (animations, compact mode, flags, regional grouping)
- Import/export functionality for user preferences backup
- Event-driven architecture with custom events for preference changes

## API Integration

### **Multi-Tier Fallback System**
1. **Primary**: CoinGecko API (`https://api.coingecko.com/api/v3/simple/price`)
   - Real-time Bitcoin prices in all 20 currencies
   - High accuracy and comprehensive currency support
   - Rate limiting respect with exponential backoff

2. **Secondary**: CoinDesk API (`https://api.coindesk.com/v1/bpi/currentprice.json`)
   - USD-based rates with approximate conversions for other currencies
   - Reliable fallback when CoinGecko is unavailable
   - Uses current exchange rate multipliers for estimation

3. **Final Fallback**: Sample Data
   - Realistic Bitcoin rates for offline/development use
   - Ensures application always functions regardless of network status
   - Clearly marked as sample data in the UI

### **Advanced Features**
- **Request Debouncing**: Prevents API spam with 1-second debounce window
- **Exponential Backoff**: Intelligent retry with delays from 1s to 30s maximum
- **Network Detection**: Automatic online/offline status monitoring
- **Response Validation**: Schema validation for all API responses
- **Timeout Handling**: 10-second request timeouts with graceful fallback
- **Cache Integration**: 5-minute TTL caching with offline data persistence
- **Error Recovery**: Comprehensive error handling with user-friendly messages

## User Preferences & Customization

### CSS Architecture & Design System
The application features a modern CSS architecture built on design tokens and systematic theming:

#### Design Tokens (`src/styles/variables.css`)
- **CSS Custom Properties**: Centralized design system with semantic color tokens
- **Multi-Theme Support**: Light, dark, and high-contrast themes with automatic system detection
- **Typography Scale**: Harmonious font sizes (xs to 5xl) and consistent line heights
- **Spacing System**: Systematic spacing scale from 4px to 64px for consistent layouts
- **Color Palette**: Comprehensive color system with primary, secondary, success, warning, error, and info variants
- **Component Tokens**: Reusable shadows, border radius, transitions, and z-index scales
- **Responsive Breakpoints**: Mobile-first breakpoint system (sm: 640px to 2xl: 1536px)
- **Accessibility Integration**: Automatic reduced motion support and high contrast mode

#### Theme System
The application includes a comprehensive theme system with three options:
- **Light Theme**: Clean, bright interface optimized for daylight use
- **Dark Theme**: Dark interface that reduces eye strain in low-light conditions  
- **Auto Theme**: Automatically switches between light and dark based on system preferences
- **High Contrast**: Enhanced accessibility mode with maximum contrast ratios

### Accessibility Controls
Built-in accessibility features that can be customized by users:
- **Reduced Motion**: Disables animations for users who prefer minimal motion
- **High Contrast**: Increases contrast ratios for better visibility
- **Large Text**: Increases text size for improved readability

### Display Settings
Customizable display options for enhanced user experience:
- **Show Animations**: Toggle smooth transitions and micro-interactions
- **Compact Mode**: Denser layout for users who prefer more information per screen
- **Show Flags**: Toggle currency flag emojis in rate cards
- **Group by Region**: Organize currencies by geographic regions

### Persistent Storage
All user preferences are automatically saved and restored:
- **Tab State**: Remembers your last active tab and page across sessions
- **Theme Choice**: Maintains your selected theme preference
- **Accessibility Settings**: Preserves your accessibility configurations
- **Display Preferences**: Saves your customized display options

### Import/Export
Backup and restore your preferences:
```javascript
// Export preferences as JSON
const preferences = preferencesManager.exportPreferences();

// Import preferences from JSON
const success = preferencesManager.importPreferences(jsonString);
```

### System Integration
The preferences system automatically detects and respects system settings:
- **System Theme**: Auto-detects dark/light mode preference
- **Reduced Motion**: Respects `prefers-reduced-motion` system setting
- **High Contrast**: Detects `prefers-contrast: high` system preference

## Keyboard Navigation & Accessibility

### Keyboard Shortcuts:
- **`1`, `2`, `3`**: Switch directly to BTC, BITS, or Satoshi tabs
- **`←` / `→`**: Navigate between tabs (left/right arrow keys)
- **`Tab`**: Standard tab navigation with screen reader announcements
- **`Enter` / `Space`**: Activate buttons and navigation elements

### Accessibility Features:
- **Screen Reader Support**: Live region announcements for tab changes
- **ARIA Attributes**: Proper `aria-selected`, `aria-live`, and `tabindex` management
- **Semantic HTML**: Proper heading hierarchy and landmark navigation
- **Focus Management**: Visible focus indicators and logical tab order
- **State Persistence**: Remembers user's tab preferences across sessions
- **Animation Control**: Smooth transitions that respect user motion preferences
- **Accessibility Settings**: User-configurable reduced motion, high contrast, and large text options
- **System Integration**: Automatic detection and application of system accessibility preferences

### Tab Management Features:
- **Smooth Animations**: 300ms fade transitions between tabs and pages
- **State Persistence**: Remembers active tab and page for 24 hours
- **Animation Prevention**: Prevents overlapping animations during rapid navigation
- **Custom Events**: Dispatches `tabChanged` events for other modules to listen to
- **Fallback Support**: Graceful degradation when DOM elements are missing

## Browser Compatibility

### Modern Browser Requirements:
- **ES6 Modules**: Native import/export support required
- **Chrome 61+**, **Firefox 60+**, **Safari 10.1+**, **Edge 16+**
- **Mobile**: iOS Safari 10.3+, Chrome Mobile 61+
- **Features**: Fetch API, async/await, CSS Grid, CSS Variables

### Progressive Enhancement:
- Core functionality works without JavaScript (static content)
- Enhanced features require ES6+ support
- Graceful fallback for unsupported browsers
- No polyfills required for target browser range

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+ with modules)
- **Architecture**: ES6 modules with separation of concerns
- **Styling**: CSS Grid, Flexbox, CSS Variables for theming
- **API**: Fetch API with async/await and intelligent fallback
- **Data Processing**: Pure JavaScript with mathematical precision handling
- **Formatting**: Internationalization-ready number and currency formatting
- **Build**: No build process required - pure static files with module imports
- **Deployment**: Any static web server or CDN with ES6 module support

## Development

The application is built with modern vanilla web technologies and ES6 modules for maximum maintainability while avoiding build complexity. The modular architecture makes it easy to extend and modify individual components.

### Key Files:
- **`index.html`**: Complete 3-tab structure with all 6 pages
- **`script.js`**: Main application entry point and module orchestration
- **`styles.css`**: Responsive styling for tabs, navigation, and cards
- **`src/modules/data/`**: Modular data processing and formatting utilities
- **`src/modules/api/`**: Advanced API service with caching and fallback systems
- **`src/modules/ui/`**: UI components for tab management, rendering, and user feedback

### Development Workflow:
1. **Currency Management**: Edit `currency-config.js` to add/modify supported currencies
2. **Rate Calculations**: Extend `rate-calculator.js` for new conversion logic
3. **Display Formatting**: Modify `formatter.js` for custom number/currency formatting
4. **API Integration**: Extend `bitcoin-api.js` for new data sources or endpoints
5. **Caching Strategy**: Modify `cache-manager.js` for different caching behaviors
6. **Tab Behavior**: Customize `tab-manager.js` for navigation and animation changes
7. **UI Components**: Extend `rate-renderer.js`, `loading-manager.js`, or `error-handler.js` for UI enhancements
8. **User Preferences**: Modify `preferences.js` to add new settings or customize behavior
9. **Theming & Design**: Update CSS variables in `variables.css` for consistent theming
10. **Main Integration**: Update `script.js` and `styles.css` for overall interface changes

### Module System:
The application uses native ES6 modules for better code organization:
- Import/export syntax for clean module boundaries
- Separation of concerns with dedicated modules for different functionality
- Easy testing and maintenance of individual components
- No build step required - modules work directly in modern browsers

### API Service Features:
The Bitcoin API service provides enterprise-grade reliability:
- **Singleton Pattern**: Consistent API access across the application
- **Request Debouncing**: Prevents multiple simultaneous calls within 1-second window
- **Exponential Backoff**: Retry failed requests with increasing delays (1s → 2s → 4s → 8s)
- **Network Monitoring**: Automatic detection of online/offline status changes
- **Response Validation**: Schema validation ensures data integrity
- **Fallback Chain**: CoinGecko → CoinDesk → Sample Data for 100% uptime
- **Cache Integration**: Works seamlessly with cache manager for optimal performance
- **Error Tracking**: Comprehensive error logging and user-friendly error messages

## License

MIT License - Feel free to use, modify, and distribute.
## 
Modernization Progress

This application is currently undergoing modernization as part of a comprehensive enhancement project. The following improvements have been implemented:

### ✅ Completed Features:
- **Modular ES6 Architecture**: Separated concerns into dedicated modules
- **Enhanced Currency Configuration**: 20 currencies with metadata, grouping, and flags
- **Advanced Rate Calculator**: Precise Bitcoin unit conversions with validation
- **Comprehensive Formatting System**: Locale-aware number and currency formatting
- **Advanced API Service**: Multi-tier fallback with debouncing and exponential backoff
- **Intelligent Caching**: TTL-based caching with offline support and LocalStorage
- **Network Resilience**: Online/offline detection with graceful degradation
- **Error Recovery**: Comprehensive error handling with user-friendly fallbacks
- **Advanced Tab Management**: Smooth animations, keyboard navigation, and state persistence
- **UI Component System**: Rate rendering, loading states, and error handling components
- **User Preferences System**: Theme switching, accessibility controls, and persistent settings

### 🚧 In Progress:
- Favorites system for currency management
- Search and filtering capabilities
- Enhanced visual design and accessibility improvements

### 📋 Planned Features:
- Progressive Web App capabilities
- Advanced data visualization and charts
- Sharing functionality and export options
- Comprehensive testing infrastructure
- Performance optimizations and monitoring

For detailed implementation progress, see the project specifications in `.kiro/specs/bitcoin-app-modernization/`.

## Contributing

This project follows modern JavaScript best practices and maintains backward compatibility. When contributing:

1. **Follow ES6+ Standards**: Use modern JavaScript features appropriately
2. **Maintain Module Boundaries**: Keep concerns separated in dedicated modules
3. **Preserve No-Build Philosophy**: Avoid introducing build dependencies
4. **Test Across Browsers**: Ensure compatibility with target browser range
5. **Document Changes**: Update README and inline documentation as needed

## Roadmap

The application is evolving toward a comprehensive Bitcoin rate platform with:
- Enhanced user experience and accessibility
- Advanced features like favorites and search
- Offline-first architecture with intelligent caching
- Progressive Web App capabilities
- Comprehensive testing and monitoring

Stay tuned for updates as we continue modernizing this Bitcoin exchange rate application!