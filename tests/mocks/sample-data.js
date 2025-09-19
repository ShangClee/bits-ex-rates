/**
 * Mock Data for Testing
 * Sample API responses and test data
 */

export const mockCurrencies = {
  usd: {
    code: 'usd',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    amount: 1,
    precision: 2,
    group: 'americas',
    popular: true
  },
  eur: {
    code: 'eur',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    amount: 1,
    precision: 2,
    group: 'europe',
    popular: true
  },
  gbp: {
    code: 'gbp',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    amount: 1,
    precision: 2,
    group: 'europe',
    popular: true
  },
  jpy: {
    code: 'jpy',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    amount: 100,
    precision: 0,
    group: 'asia',
    popular: true
  }
};

export const mockApiResponse = {
  bitcoin: {
    usd: 45000,
    eur: 38000,
    gbp: 33000,
    jpy: 4950000
  }
};

export const mockCoinDeskResponse = {
  bpi: {
    USD: {
      rate_float: 45000,
      rate: "45,000.00"
    }
  }
};

export const mockRateData = {
  currency: 'usd',
  btcRate: 45000,
  bitsRate: 45,
  satoshiRate: 0.00045,
  timestamp: new Date('2023-01-01T12:00:00Z'),
  source: 'coingecko',
  change24h: 2.5
};

export const mockPreferences = {
  theme: 'light',
  activeTab: 'btc',
  activePages: {
    btc: 'fiat-per-btc',
    bts: 'fiat-per-bits',
    sts: 'fiat-per-satoshi'
  },
  favorites: ['usd', 'eur'],
  searchHistory: ['usd', 'bitcoin'],
  displaySettings: {
    showAnimations: true,
    compactMode: false,
    showFlags: true
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    largeText: false
  }
};

export const mockCacheData = {
  'rates_usd,eur,gbp,jpy': {
    data: mockApiResponse,
    timestamp: Date.now() - 300000, // 5 minutes ago
    ttl: 600000 // 10 minutes
  }
};

export const mockHistoricalData = {
  usd: [
    { timestamp: Date.now() - 86400000, rate: 44000 }, // 1 day ago
    { timestamp: Date.now() - 43200000, rate: 44500 }, // 12 hours ago
    { timestamp: Date.now() - 21600000, rate: 44800 }, // 6 hours ago
    { timestamp: Date.now() - 10800000, rate: 45200 }, // 3 hours ago
    { timestamp: Date.now() - 3600000, rate: 45000 }   // 1 hour ago
  ]
};

export const mockNetworkError = new Error('Network request failed');
export const mockApiError = new Error('API rate limit exceeded');
export const mockValidationError = new Error('Invalid currency code');

// Helper functions for creating test data
export const createMockRateCard = (currency = 'usd', rate = 45000) => {
  const card = document.createElement('div');
  card.className = 'rate-card';
  card.dataset.currency = currency;
  card.dataset.rate = rate.toString();
  card.innerHTML = `
    <div class="currency-flag">${mockCurrencies[currency]?.flag || '🏳️'}</div>
    <div class="currency-info">
      <div class="currency-name">${mockCurrencies[currency]?.name || 'Unknown'}</div>
      <div class="currency-code">${currency.toUpperCase()}</div>
    </div>
    <div class="rate-value">${mockCurrencies[currency]?.symbol || '$'}${rate.toLocaleString()}</div>
  `;
  return card;
};

export const createMockContainer = (id = 'test-container') => {
  const container = document.createElement('div');
  container.id = id;
  container.className = 'rate-container';
  document.body.appendChild(container);
  return container;
};

export const cleanupMockElements = () => {
  document.querySelectorAll('[id*="test"], [class*="mock"]').forEach(el => {
    el.remove();
  });
};