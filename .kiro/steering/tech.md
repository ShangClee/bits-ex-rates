# Technology Stack

## Frontend Technologies

- **HTML5**: Semantic markup with proper accessibility
- **CSS3**: Modern styling with Grid, Flexbox, and CSS Variables
- **Vanilla JavaScript (ES6+)**: No frameworks, pure web standards
- **Fetch API**: Async/await for API calls

## Build System

**No build process required** - pure static files for maximum compatibility and minimal dependencies.

## Development Commands

```bash
# Start local development server
npm run start
# or
python3 -m http.server 8000

# Alternative serving method
npm run serve
```

## API Integration

- **Primary**: CoinGecko API (`https://api.coingecko.com/api/v3/simple/price`)
- **Fallback**: CoinDesk API with approximate exchange rates
- **Final Fallback**: Sample data for offline/development use

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers

## Deployment

- Any static web server or CDN
- No server-side processing required
- CORS-friendly for local development

## Key Libraries

None - intentionally dependency-free for maximum portability and minimal maintenance.