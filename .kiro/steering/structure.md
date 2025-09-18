# Project Structure

## File Organization

```
bitcoin-exchange-rates/
├── index.html          # Main HTML with 3-tab structure
├── script.js           # Complete JavaScript functionality
├── styles.css          # CSS styling for all tabs
├── package.json        # NPM configuration
├── README.md           # Project documentation
├── .gitignore         # Git ignore rules
├── .kiro/             # Kiro configuration
│   └── steering/      # AI assistant guidance
└── .git/              # Git repository
```

## Code Architecture

### HTML Structure
- **Main tabs**: BTC, BTS (BITS), STS (Satoshi)
- **Sub-navigation**: Each tab has 2 pages (fiat-per-crypto, crypto-per-fiat)
- **Dynamic containers**: Show/hide based on active tab and page
- **Semantic markup**: Proper accessibility and structure

### JavaScript Organization
- **Currency configurations**: Object with symbols, flags, and amounts
- **API handling**: Multi-tier fallback system (CoinGecko → CoinDesk → Sample)
- **Display functions**: Separate functions for each tab/page combination
- **Card creation**: Modular functions for different rate card types
- **Navigation**: Tab and page switching with state management

### CSS Structure
- **Mobile-first**: Responsive grid layout
- **Component-based**: Reusable classes for cards, buttons, tabs
- **CSS Grid**: For responsive rate card layout
- **Hover effects**: Smooth transitions and visual feedback
- **CSS Variables**: For consistent theming

## Naming Conventions

- **Files**: kebab-case (e.g., `index.html`)
- **CSS classes**: kebab-case (e.g., `.rate-card`, `.main-tab-btn`)
- **JavaScript**: camelCase for variables and functions
- **IDs**: camelCase for DOM elements (e.g., `fiatPerBitsContainer`)

## Key Patterns

- **No build process**: Direct file editing and serving
- **Vanilla JavaScript**: No frameworks or dependencies
- **Progressive enhancement**: Works without JavaScript for basic content
- **Graceful degradation**: Fallback data when APIs fail