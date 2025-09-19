# User Guide

## Welcome to Bitcoin Exchange Rates

This comprehensive guide will help you make the most of the Bitcoin Exchange Rates application, a modern Progressive Web App that displays Bitcoin prices across all three major denominations with advanced features and customization options.

## Table of Contents

- [Getting Started](#getting-started)
- [Understanding Bitcoin Denominations](#understanding-bitcoin-denominations)
- [Navigation and Interface](#navigation-and-interface)
- [Personalization Features](#personalization-features)
- [Advanced Features](#advanced-features)
- [Progressive Web App Features](#progressive-web-app-features)
- [Accessibility Features](#accessibility-features)
- [Tips and Best Practices](#tips-and-best-practices)

## Getting Started

### First Visit

When you first visit the Bitcoin Exchange Rates application, you'll see:

1. **Three main tabs**: BTC, BITS (BTS), and Satoshi (STS)
2. **Rate cards**: Displaying current Bitcoin prices in 20 major world currencies
3. **Clean interface**: Modern design with smooth animations and hover effects
4. **Settings button**: Floating button (⚙️) in the bottom-right corner for customization

### Quick Start

1. **Choose your denomination**: Click on BTC, BITS, or STS tabs to see rates in different Bitcoin units
2. **Switch views**: Each tab has two pages - use the sub-navigation to switch between "Fiat per Bitcoin" and "Bitcoin per Fiat" views
3. **Explore currencies**: Scroll through the 20 supported currencies organized by region
4. **Customize your experience**: Click the settings button to personalize themes, favorites, and accessibility options

## Understanding Bitcoin Denominations

### Bitcoin (BTC) - The Standard Unit
- **1 Bitcoin = 1 BTC**
- Used for: Large transactions, investment tracking, price reporting
- Example: `1 BTC = $43,000.00 USD`

### BITS - The Micro Unit
- **1 Bitcoin = 1,000,000 BITS**
- Used for: Smaller transactions, everyday purchases, micro-payments
- Example: `1 BITS = $0.043 USD` or `$1 USD = 23.26 BITS`

### Satoshi (STS) - The Smallest Unit
- **1 Bitcoin = 100,000,000 Satoshi**
- Used for: Lightning Network, "stacking sats", very small transactions
- Example: `1 Satoshi = $0.00043 USD` or `$1 USD = 2.33K sats`

### When to Use Each Denomination

- **BTC**: When dealing with large amounts or traditional Bitcoin trading
- **BITS**: For everyday transactions and when Bitcoin prices seem more approachable
- **Satoshi**: For Lightning Network payments and when accumulating small amounts

## Navigation and Interface

### Main Navigation

#### Tabs
- **BTC Tab**: Full Bitcoin denomination rates
- **BTS Tab**: BITS denomination rates (micro-Bitcoin)
- **STS Tab**: Satoshi denomination rates (smallest unit)

#### Sub-Navigation (within each tab)
Each tab has two viewing modes:

1. **Fiat per Bitcoin**: Shows how much fiat currency equals one Bitcoin unit
   - Example: `1 BTC = $43,000 USD`
   - Useful for: Checking current Bitcoin prices

2. **Bitcoin per Fiat**: Shows how much Bitcoin you get for standard fiat amounts
   - Example: `$1 USD = 0.000023 BTC`
   - Useful for: Planning purchases and investments

### Keyboard Navigation

The application supports full keyboard navigation:

- **Number keys (1, 2, 3)**: Switch directly to BTC, BITS, or Satoshi tabs
- **Arrow keys (← →)**: Navigate between tabs sequentially
- **Tab key**: Standard tab navigation through all interactive elements
- **Enter/Space**: Activate buttons and controls
- **Escape**: Close modals and panels

### Currency Organization

Currencies are organized by geographic regions:

- **🌎 Americas**: USD, CAD, MXN, BRL
- **🌍 Europe**: EUR, GBP, CHF, SEK, NOK, TRY
- **🌏 Asia**: JPY, CNY, SGD, HKD, TWD, KRW, INR
- **🌏 Oceania**: AUD, NZD
- **🌍 Africa**: ZAR

## Personalization Features

### Accessing Settings

Click the settings button (⚙️) in the bottom-right corner to open the settings panel.

### Theme Options

Choose from three theme options:

1. **Light Theme**: Clean, bright interface (default)
2. **Dark Theme**: Dark interface that reduces eye strain
3. **Auto Theme**: Automatically switches based on your system preference

**How to change themes**:
1. Open settings panel
2. Click the theme toggle button
3. Select your preferred theme
4. The change applies instantly

### Favorites System

Mark your most-used currencies as favorites for quick access.

#### Adding Favorites
1. **Hover over any rate card** to reveal the star icon (☆)
2. **Click the star** to add the currency to your favorites
3. **Filled star (★)** indicates the currency is favorited
4. **Maximum of 10 favorites** can be saved

#### Managing Favorites
1. **Reorder favorites**: Drag and drop favorite currencies to reorder them
2. **Remove favorites**: Click the filled star (★) to remove from favorites
3. **Favorites section**: Favorited currencies appear at the top of the list
4. **Persistent storage**: Your favorites are saved and restored across sessions

### Search and Filtering

Find specific currencies quickly using the search and filter system.

#### Search Functionality
1. **Search box**: Located at the top of the currency list
2. **Real-time results**: Results update as you type
3. **Search criteria**: Searches currency codes, names, symbols, and regions
4. **Autocomplete**: Suggestions appear based on your input and search history

#### Advanced Filtering
1. **Region filter**: Filter currencies by geographic region
2. **Popularity filter**: Show only popular currencies or all currencies
3. **Favorites filter**: Show only favorites or non-favorites
4. **Clear filters**: One-click button to reset all filters

#### Search Tips
- Type currency codes: "USD", "EUR", "JPY"
- Type currency names: "Dollar", "Euro", "Yen"
- Type regions: "Europe", "Asia", "Americas"
- Use partial matches: "Dol" will find "Dollar"

### Display Preferences

Customize how information is displayed:

#### Animation Settings
- **Show Animations**: Toggle smooth transitions and hover effects
- **Reduced Motion**: Automatically respects system accessibility preferences

#### Layout Options
- **Compact Mode**: Denser layout showing more currencies per screen
- **Show Flags**: Toggle currency flag emojis in rate cards
- **Group by Region**: Organize currencies by geographic regions

#### Accessibility Options
- **High Contrast**: Enhanced contrast for better visibility
- **Large Text**: Increased text size for improved readability
- **Reduced Motion**: Disable animations for users sensitive to motion

### Data Management

#### Export Preferences
1. Open settings panel
2. Click "Export Preferences"
3. Save the JSON file to backup your settings

#### Import Preferences
1. Open settings panel
2. Click "Import Preferences"
3. Select your previously exported JSON file
4. Your settings will be restored

## Advanced Features

### Sharing Functionality

Share specific Bitcoin rates with others using multiple methods.

#### How to Share
1. **Hover over any rate card** to reveal the share button (📤)
2. **Click the share button** to open the sharing modal
3. **Choose your sharing method**:
   - **Copy Rate**: Copies formatted rate text to clipboard
   - **Copy Link**: Copies a shareable URL to clipboard
   - **Share**: Uses your device's native sharing (mobile/supported browsers)

#### Share Formats
- **Rate text**: "1 BTC = $43,000.00 USD (as of [timestamp])"
- **Shareable URL**: Direct link that highlights the specific rate when opened

#### Shared Rate Links
When someone opens a shared rate link:
- The application automatically switches to the correct tab and currency
- The shared rate card is highlighted for easy identification
- All functionality remains available to the recipient

### Data Visualization

Enhanced rate cards with visual indicators and trend information.

#### Percentage Change Indicators
- **Green arrows (↗)**: Positive price changes (gains)
- **Red arrows (↘)**: Negative price changes (losses)
- **Gray indicators (→)**: Minimal or no change
- **Percentage values**: Exact 24-hour change percentages

#### Mini Trend Charts
- **Sparkline charts**: Small line charts showing recent price movement
- **Color coding**: Charts match denomination colors (BTC: orange, BITS: green, Satoshi: purple)
- **Responsive design**: Charts adapt to card size and screen resolution

#### Comparison Mode
1. **Activate comparison**: Click on rate cards to select them for comparison
2. **Visual feedback**: Selected cards show a highlighted border
3. **Comparison panel**: Slides up from bottom showing detailed side-by-side comparison
4. **Multiple currencies**: Compare up to 4 currencies simultaneously
5. **Statistical analysis**: View volatility, trends, and change metrics

### Search History and Suggestions

The application remembers your search patterns to improve your experience.

#### Search History
- **Recent searches**: Previously searched terms appear in autocomplete
- **Intelligent ranking**: Frequently searched terms appear higher in suggestions
- **Privacy-focused**: Search history is stored locally on your device only

#### Smart Suggestions
- **Currency codes**: Suggests matching currency codes as you type
- **Currency names**: Suggests full currency names
- **Regional suggestions**: Suggests geographic regions
- **Historical suggestions**: Shows your previous searches with a clock icon (🕒)

## Progressive Web App Features

### Installing the App

Transform the web application into a native-like app experience.

#### Installation Methods

**On Mobile (Android/iOS)**:
1. Open the application in your mobile browser
2. Look for the "Add to Home Screen" or "Install" prompt
3. Tap "Install" or "Add"
4. The app icon will appear on your home screen

**On Desktop (Chrome/Edge)**:
1. Look for the install icon in the address bar
2. Click the install button
3. Confirm installation in the dialog
4. The app will open in its own window

#### Benefits of Installation
- **Offline access**: Use the app without an internet connection
- **Native feel**: App opens in its own window without browser UI
- **Home screen access**: Quick access from your device's home screen
- **Background updates**: Rates update automatically in the background
- **Push notifications**: (Future feature) Get notified of significant rate changes

### Offline Functionality

The app works completely offline with cached data.

#### What Works Offline
- **View cached rates**: See the last fetched exchange rates
- **All navigation**: Switch between tabs and pages
- **Personalization**: Change themes, manage favorites, adjust settings
- **Search and filter**: Find currencies in cached data
- **Sharing**: Generate shareable links (sharing requires internet)

#### Offline Indicators
- **Network status**: Visual indicator shows when you're offline
- **Data freshness**: Timestamps show when rates were last updated
- **Automatic sync**: Rates update automatically when connection is restored

### Background Sync

When installed as a PWA, the app can update rates in the background.

#### How It Works
- **Periodic updates**: Rates refresh every 15 minutes when possible
- **Network recovery**: Automatic sync when internet connection is restored
- **Multiple tabs**: Updates sync across all open tabs and windows
- **Battery efficient**: Background sync respects device battery and data settings

## Accessibility Features

The application is designed to be accessible to all users, including those using assistive technologies.

### Screen Reader Support

#### ARIA Labels and Descriptions
- **Descriptive labels**: All interactive elements have clear, descriptive labels
- **Live regions**: Rate updates are announced to screen readers
- **Semantic structure**: Proper heading hierarchy and landmark navigation
- **State information**: Current tab, page, and selection states are announced

#### Navigation Announcements
- **Tab changes**: "Switched to Bitcoin tab" announcements
- **Rate updates**: "Exchange rates updated" with timestamp
- **Action feedback**: "Added USD to favorites" confirmations

### Keyboard Navigation

#### Full Keyboard Access
- **Tab navigation**: All interactive elements accessible via Tab key
- **Shortcut keys**: Number keys (1/2/3) for quick tab switching
- **Arrow navigation**: Left/right arrows for tab navigation
- **Enter/Space activation**: Standard activation keys for all controls

#### Focus Management
- **Visible focus**: Clear focus indicators on all interactive elements
- **Logical order**: Tab order follows visual layout and importance
- **Focus trapping**: Modal dialogs trap focus appropriately
- **Skip links**: Skip to main content functionality

### Visual Accessibility

#### High Contrast Mode
- **Enhanced contrast**: Maximum contrast ratios for better visibility
- **Color independence**: Information conveyed through multiple visual cues
- **Clear boundaries**: Strong borders and separations between elements

#### Large Text Support
- **Scalable text**: Text size increases while maintaining layout proportions
- **Readable fonts**: Clear, legible typography throughout
- **Proper spacing**: Adequate spacing between interactive elements

#### Reduced Motion
- **Motion sensitivity**: Respects `prefers-reduced-motion` system setting
- **Animation control**: User can disable animations in settings
- **Essential motion**: Only essential animations remain when reduced motion is enabled

### Color and Contrast

#### WCAG Compliance
- **AA Standard**: Meets WCAG 2.1 AA contrast requirements
- **Color combinations**: All text/background combinations tested for accessibility
- **Multiple indicators**: Information conveyed through color, text, and icons

#### Theme Accessibility
- **Light theme**: High contrast with dark text on light backgrounds
- **Dark theme**: Optimized contrast for dark mode users
- **High contrast theme**: Maximum contrast for users with visual impairments

## Tips and Best Practices

### Getting the Most from the Application

#### Efficient Navigation
1. **Use keyboard shortcuts**: Number keys (1/2/3) for quick tab switching
2. **Bookmark favorites**: Add frequently checked currencies to favorites
3. **Use search**: Type currency codes or names for quick access
4. **Install as PWA**: Get native app experience with offline access

#### Understanding Rate Movements
1. **Check percentage changes**: Look for green/red indicators showing 24-hour changes
2. **Use comparison mode**: Compare multiple currencies to understand relative movements
3. **Consider denomination context**: Small Satoshi changes represent significant percentage moves

#### Customization Strategies
1. **Set up favorites**: Add your local currency and frequently traded currencies
2. **Choose appropriate theme**: Dark theme for low-light use, light for daylight
3. **Enable accessibility features**: Use high contrast or large text if needed
4. **Organize by region**: Group currencies by geographic regions for easier browsing

### Performance Tips

#### Optimal Usage
1. **Install as PWA**: Better performance and offline access
2. **Use favorites**: Reduces scrolling and improves focus on relevant currencies
3. **Enable caching**: Allow the app to cache data for faster loading
4. **Update regularly**: Refresh rates periodically for current information

#### Battery and Data Saving
1. **Use offline mode**: View cached rates when on limited data
2. **Reduce animations**: Disable animations to save battery on mobile devices
3. **Background sync**: Let the PWA update rates automatically rather than manual refreshing

### Troubleshooting Common Issues

#### Rate Display Issues
- **Outdated rates**: Check your internet connection and refresh the page
- **Missing currencies**: Ensure you haven't filtered out the currency you're looking for
- **Formatting issues**: Try switching themes or refreshing the page

#### Navigation Problems
- **Tabs not switching**: Try using keyboard shortcuts (1/2/3) or refresh the page
- **Slow animations**: Enable reduced motion in accessibility settings
- **Missing buttons**: Check if you're in compact mode or try zooming out

#### Personalization Issues
- **Lost favorites**: Check if you're using the same browser and haven't cleared data
- **Theme not applying**: Try manually selecting the theme in settings
- **Settings not saving**: Ensure your browser allows localStorage

### Privacy and Data

#### What Data is Stored
- **Preferences**: Theme choice, favorites, accessibility settings (stored locally)
- **Search history**: Recent searches for autocomplete (stored locally)
- **Cache data**: Recent exchange rates for offline use (stored locally)
- **No personal data**: No personal information is collected or transmitted

#### Data Control
- **Local storage only**: All data stays on your device
- **Clear data**: Use browser settings to clear application data
- **Export/import**: Backup and restore your preferences as needed
- **No tracking**: No analytics or tracking cookies used

### Getting Help

#### Built-in Help
- **Tooltips**: Hover over elements for helpful information
- **Error messages**: Clear, actionable error messages with solutions
- **Status indicators**: Visual feedback for all actions and states

#### Additional Resources
- **API Documentation**: Technical details for developers
- **Troubleshooting Guide**: Solutions for common issues
- **Accessibility Guide**: Detailed accessibility feature documentation

### Future Features

The application is continuously being improved. Upcoming features may include:

- **Historical charts**: Detailed price history and trend analysis
- **Price alerts**: Notifications for significant rate changes
- **More currencies**: Additional fiat currencies and cryptocurrency pairs
- **Advanced analytics**: Technical analysis tools and indicators
- **Social features**: Share and discuss rates with other users

---

## Quick Reference

### Keyboard Shortcuts
- **1, 2, 3**: Switch to BTC, BITS, Satoshi tabs
- **← →**: Navigate between tabs
- **Tab**: Navigate through interactive elements
- **Enter/Space**: Activate buttons and controls
- **Escape**: Close modals and panels

### Currency Codes
- **USD** 🇺🇸 - US Dollar
- **EUR** 🇪🇺 - Euro
- **GBP** 🇬🇧 - British Pound
- **JPY** 🇯🇵 - Japanese Yen
- **CAD** 🇨🇦 - Canadian Dollar
- **AUD** 🇦🇺 - Australian Dollar
- **CHF** 🇨🇭 - Swiss Franc
- **CNY** 🇨🇳 - Chinese Yuan
- **SEK** 🇸🇪 - Swedish Krona
- **NZD** 🇳🇿 - New Zealand Dollar
- **MXN** 🇲🇽 - Mexican Peso
- **SGD** 🇸🇬 - Singapore Dollar
- **HKD** 🇭🇰 - Hong Kong Dollar
- **NOK** 🇳🇴 - Norwegian Krone
- **TRY** 🇹🇷 - Turkish Lira
- **ZAR** 🇿🇦 - South African Rand
- **BRL** 🇧🇷 - Brazilian Real
- **INR** 🇮🇳 - Indian Rupee
- **KRW** 🇰🇷 - South Korean Won
- **TWD** 🇹🇼 - Taiwan Dollar

### Bitcoin Units
- **1 BTC** = 1,000,000 BITS = 100,000,000 Satoshi
- **1 BITS** = 0.000001 BTC = 100 Satoshi
- **1 Satoshi** = 0.00000001 BTC = 0.01 BITS

This user guide provides comprehensive information to help you make the most of the Bitcoin Exchange Rates application. Whether you're a casual user checking prices or a serious Bitcoin enthusiast tracking multiple currencies, these features and tips will enhance your experience.