# BITS Exchange Rates

A web application that displays Bitcoin exchange rates in BITS format (1 Bitcoin = 1,000,000 BITS).

## Features

- **Two viewing modes:**
  - "Fiat per BITS" - Shows how much fiat currency equals 1 BITS
  - "BITS per Fiat" - Shows how many BITS you can buy with standard fiat amounts
- **Multi-currency support** - 20 currencies including USD, EUR, GBP, JPY, etc.
- **Live data** - Fetches rates from exchangerate-api.com with fallback to sample data
- **Responsive design** - Grid layout with hover effects and mobile-friendly cards

## Running the Application

### Option 1: Using Python (Recommended)
```bash
python3 -m http.server 8000
```
Then visit: http://localhost:8000

### Option 2: Using npm
```bash
npm run start
```

### Option 3: Using any other web server
Simply serve the files from any web server since it's a static HTML/CSS/JS application.

## Files

- `index.html` - Basic version with BITS exchange rates
- `index-v3.html` - Enhanced version with BTC/BITS/Satoshi tabs
- `script.js` - Main application logic
- `styles.css` - Styling and responsive design

## Tech Stack

- Vanilla HTML/CSS/JavaScript
- External API integration (exchangerate-api.com)
- Modern CSS Grid layout
- Error handling and offline fallbacks