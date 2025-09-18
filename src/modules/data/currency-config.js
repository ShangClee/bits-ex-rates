/**
 * Currency Configuration Module
 * Contains all supported currencies with their display properties and metadata
 */

export const currencies = {
    'usd': { 
        name: 'US Dollar', 
        symbol: '$', 
        flag: '🇺🇸', 
        amount: 1,
        precision: 2,
        group: 'americas',
        popular: true
    },
    'eur': { 
        name: 'Euro', 
        symbol: '€', 
        flag: '🇪🇺', 
        amount: 1,
        precision: 2,
        group: 'europe',
        popular: true
    },
    'gbp': { 
        name: 'British Pound', 
        symbol: '£', 
        flag: '🇬🇧', 
        amount: 1,
        precision: 2,
        group: 'europe',
        popular: true
    },
    'jpy': { 
        name: 'Japanese Yen', 
        symbol: '¥', 
        flag: '🇯🇵', 
        amount: 100,
        precision: 0,
        group: 'asia',
        popular: true
    },
    'aud': { 
        name: 'Australian Dollar', 
        symbol: 'A$', 
        flag: '🇦🇺', 
        amount: 1,
        precision: 2,
        group: 'oceania',
        popular: true
    },
    'cad': { 
        name: 'Canadian Dollar', 
        symbol: 'C$', 
        flag: '🇨🇦', 
        amount: 1,
        precision: 2,
        group: 'americas',
        popular: true
    },
    'chf': { 
        name: 'Swiss Franc', 
        symbol: 'CHF', 
        flag: '🇨🇭', 
        amount: 1,
        precision: 2,
        group: 'europe',
        popular: false
    },
    'cny': { 
        name: 'Chinese Yuan', 
        symbol: '¥', 
        flag: '🇨🇳', 
        amount: 1,
        precision: 2,
        group: 'asia',
        popular: true
    },
    'sek': { 
        name: 'Swedish Krona', 
        symbol: 'kr', 
        flag: '🇸🇪', 
        amount: 10,
        precision: 2,
        group: 'europe',
        popular: false
    },
    'nzd': { 
        name: 'New Zealand Dollar', 
        symbol: 'NZ$', 
        flag: '🇳🇿', 
        amount: 1,
        precision: 2,
        group: 'oceania',
        popular: false
    },
    'mxn': { 
        name: 'Mexican Peso', 
        symbol: '$', 
        flag: '🇲🇽', 
        amount: 10,
        precision: 2,
        group: 'americas',
        popular: false
    },
    'sgd': { 
        name: 'Singapore Dollar', 
        symbol: 'S$', 
        flag: '🇸🇬', 
        amount: 1,
        precision: 2,
        group: 'asia',
        popular: false
    },
    'hkd': { 
        name: 'Hong Kong Dollar', 
        symbol: 'HK$', 
        flag: '🇭🇰', 
        amount: 10,
        precision: 2,
        group: 'asia',
        popular: false
    },
    'nok': { 
        name: 'Norwegian Krone', 
        symbol: 'kr', 
        flag: '🇳🇴', 
        amount: 10,
        precision: 2,
        group: 'europe',
        popular: false
    },
    'try': { 
        name: 'Turkish Lira', 
        symbol: '₺', 
        flag: '🇹🇷', 
        amount: 10,
        precision: 2,
        group: 'europe',
        popular: false
    },
    'zar': { 
        name: 'South African Rand', 
        symbol: 'R', 
        flag: '🇿🇦', 
        amount: 10,
        precision: 2,
        group: 'africa',
        popular: false
    },
    'brl': { 
        name: 'Brazilian Real', 
        symbol: 'R$', 
        flag: '🇧🇷', 
        amount: 1,
        precision: 2,
        group: 'americas',
        popular: false
    },
    'inr': { 
        name: 'Indian Rupee', 
        symbol: '₹', 
        flag: '🇮🇳', 
        amount: 10,
        precision: 2,
        group: 'asia',
        popular: true
    },
    'krw': { 
        name: 'South Korean Won', 
        symbol: '₩', 
        flag: '🇰🇷', 
        amount: 1000,
        precision: 0,
        group: 'asia',
        popular: false
    },
    'twd': { 
        name: 'Taiwan Dollar', 
        symbol: 'NT$', 
        flag: '🇹🇼', 
        amount: 10,
        precision: 2,
        group: 'asia',
        popular: false
    }
};

/**
 * Get currencies by group
 * @param {string} group - The group name (americas, europe, asia, etc.)
 * @returns {Object} Filtered currencies object
 */
export function getCurrenciesByGroup(group) {
    return Object.fromEntries(
        Object.entries(currencies).filter(([code, config]) => config.group === group)
    );
}

/**
 * Get popular currencies
 * @returns {Object} Filtered currencies object with only popular currencies
 */
export function getPopularCurrencies() {
    return Object.fromEntries(
        Object.entries(currencies).filter(([code, config]) => config.popular)
    );
}

/**
 * Get all currency codes as an array
 * @returns {string[]} Array of currency codes
 */
export function getCurrencyCodes() {
    return Object.keys(currencies);
}

/**
 * Get currency configuration by code
 * @param {string} code - Currency code (e.g., 'usd')
 * @returns {Object|null} Currency configuration or null if not found
 */
export function getCurrency(code) {
    return currencies[code] || null;
}