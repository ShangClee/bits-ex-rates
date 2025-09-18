# Bitcoin Exchange Rates

A comprehensive web application that displays Bitcoin exchange rates across all three major denominations: Bitcoin (BTC), BITS, and Satoshi (STS).

## Overview

This application provides a unified interface for viewing Bitcoin exchange rates in different formats:
- **1 Bitcoin = 1,000,000 BITS = 100,000,000 satoshis**

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
Supports 20 major world currencies:
- **Americas**: USD, CAD, MXN, BRL
- **Europe**: EUR, GBP, CHF, SEK, NOK
- **Asia-Pacific**: JPY, AUD, NZD, CNY, SGD, HKD, TWD, KRW, INR
- **Others**: TRY, ZAR

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

### 🎯 **Smart Formatting**
- **BTC amounts**: Decimal precision or scientific notation
- **BITS amounts**: K/M suffixes for large numbers
- **Satoshi amounts**: K/M/B suffixes with "sats" abbreviation
- **Fiat amounts**: Proper currency symbols and formatting

## Technical Implementation

### Navigation System
- **Main Tabs**: Switch between BTC, BTS, STS
- **Sub Navigation**: Each tab has 2 pages with specific functionality
- **Dynamic Content**: Shows/hides navigation based on active tab

### Data Processing
- Converts Bitcoin prices to BITS (÷ 1,000,000) and Satoshi (÷ 100,000,000)
- Handles both "per unit" and "units per fiat" calculations
- Implements proper rounding and formatting for each denomination

### Error Handling
- API failure fallback with sample data
- Loading states and error messages
- Graceful degradation for offline use

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
├── index.html          # Main HTML with 3-tab structure
├── script.js           # Complete JavaScript functionality
├── styles.css          # CSS styling for all tabs
├── package.json        # NPM configuration
├── README.md           # This documentation
└── .gitignore         # Git ignore rules
```

## API Integration

- **Primary**: CoinGecko API (`https://api.coingecko.com/api/v3/simple/price`) for real-time Bitcoin prices in all 20 currencies
- **Secondary**: CoinDesk API fallback with approximate exchange rates
- **Final Fallback**: Sample data for offline/development use
- **CORS Handling**: Works both locally and on web servers
- **Rate Limiting**: Respectful API usage with error handling
- **Multi-tier Reliability**: Three levels of fallback ensure the app always works

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **API**: Fetch API with async/await
- **Build**: No build process required - pure static files
- **Deployment**: Any static web server or CDN

## Development

The application is built with vanilla web technologies for maximum compatibility and minimal dependencies. No build process or framework required - just open and edit the files directly.

### Key Files:
- **`index.html`**: Complete 3-tab structure with all 6 pages
- **`script.js`**: All functionality including API calls, data processing, and UI updates
- **`styles.css`**: Responsive styling for tabs, navigation, and cards

## License

MIT License - Feel free to use, modify, and distribute.