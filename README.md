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

### 🔄 **Live Data Integration**
- **Primary**: CoinGecko API for real-time rates across all 20 currencies
- **Fallback**: CoinDesk API with approximate exchange rates
- **Final Fallback**: Sample data if all APIs fail
- Smart error handling and user feedback
- Last update timestamp display

### 🎯 **Advanced Formatting System**
- **BTC amounts**: Adaptive precision (4-8 decimals) or scientific notation for very small values
- **BITS amounts**: K/M suffixes with spaced decimal formatting (e.g., "0.043 000")
- **Satoshi amounts**: K/M/B suffixes with "sats" abbreviation for readability
- **Fiat amounts**: Locale-aware formatting with proper currency symbols and positioning
- **Percentage changes**: Color-coded indicators with proper sign handling
- **Timestamps**: Human-readable date/time formatting with duration support

## Technical Implementation

### Modular Architecture
The application now uses ES6 modules with clear separation of concerns:

#### **Data Layer**
- **Currency Configuration**: Centralized currency metadata with grouping and precision settings
- **Rate Calculator**: Mathematical operations for Bitcoin unit conversions with validation
- **Formatter**: Comprehensive number, currency, and Bitcoin amount formatting utilities

#### **Navigation System**
- **Main Tabs**: Switch between BTC, BTS, STS with smooth transitions
- **Sub Navigation**: Each tab has 2 pages with specific functionality
- **Dynamic Content**: Shows/hides navigation based on active tab with state management

#### **Data Processing**
- Precise Bitcoin unit conversions using constants (1 BTC = 1M BITS = 100M sats)
- Handles both "per unit" and "units per fiat" calculations with proper precision
- Implements adaptive rounding and formatting for each denomination
- Validates rate data for reasonableness and consistency

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
    └── modules/
        └── data/
            ├── currency-config.js      # Currency metadata and configuration
            ├── rate-calculator.js      # Bitcoin rate conversion logic
            └── formatter.js            # Number and currency formatting utilities
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

## API Integration

- **Primary**: CoinGecko API (`https://api.coingecko.com/api/v3/simple/price`) for real-time Bitcoin prices in all 20 currencies
- **Secondary**: CoinDesk API fallback with approximate exchange rates
- **Final Fallback**: Sample data for offline/development use
- **CORS Handling**: Works both locally and on web servers
- **Rate Limiting**: Respectful API usage with error handling
- **Multi-tier Reliability**: Three levels of fallback ensure the app always works

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

### Development Workflow:
1. **Currency Management**: Edit `currency-config.js` to add/modify supported currencies
2. **Rate Calculations**: Extend `rate-calculator.js` for new conversion logic
3. **Display Formatting**: Modify `formatter.js` for custom number/currency formatting
4. **UI Updates**: Update `script.js` and `styles.css` for interface changes

### Module System:
The application uses native ES6 modules for better code organization:
- Import/export syntax for clean module boundaries
- Separation of concerns with dedicated modules for different functionality
- Easy testing and maintenance of individual components
- No build step required - modules work directly in modern browsers

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
- **Improved Data Processing**: Mathematical precision and error handling

### 🚧 In Progress:
- API service layer with caching and offline support
- Enhanced UI components with loading states and animations
- User preferences and favorites system
- Search and filtering capabilities
- Accessibility improvements and internationalization

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