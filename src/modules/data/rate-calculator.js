/**
 * Rate Calculator Module
 * Handles all Bitcoin rate conversions and calculations
 */

// Bitcoin unit conversion constants
export const BITCOIN_UNITS = {
    SATOSHI_PER_BTC: 100000000,  // 100 million satoshis per BTC
    BITS_PER_BTC: 1000000,       // 1 million bits per BTC
    SATOSHI_PER_BITS: 100        // 100 satoshis per bit
};

/**
 * Convert BTC rate to BITS rate
 * @param {number} btcRate - Price of 1 BTC in fiat currency
 * @returns {number} Price of 1 BITS in fiat currency
 */
export function convertToBits(btcRate) {
    if (typeof btcRate !== 'number' || btcRate <= 0) {
        throw new Error('Invalid BTC rate provided');
    }
    return btcRate / BITCOIN_UNITS.BITS_PER_BTC;
}

/**
 * Convert BTC rate to Satoshi rate
 * @param {number} btcRate - Price of 1 BTC in fiat currency
 * @returns {number} Price of 1 Satoshi in fiat currency
 */
export function convertToSatoshi(btcRate) {
    if (typeof btcRate !== 'number' || btcRate <= 0) {
        throw new Error('Invalid BTC rate provided');
    }
    return btcRate / BITCOIN_UNITS.SATOSHI_PER_BTC;
}

/**
 * Calculate how much fiat currency per Bitcoin unit
 * @param {number} btcRate - Price of 1 BTC in fiat currency
 * @param {'btc'|'bits'|'satoshi'} unit - Bitcoin unit type
 * @returns {number} Price per unit in fiat currency
 */
export function calculateFiatPerUnit(btcRate, unit) {
    if (typeof btcRate !== 'number' || btcRate <= 0) {
        throw new Error('Invalid BTC rate provided');
    }

    switch (unit.toLowerCase()) {
        case 'btc':
            return btcRate;
        case 'bits':
            return convertToBits(btcRate);
        case 'satoshi':
        case 'sats':
            return convertToSatoshi(btcRate);
        default:
            throw new Error(`Unsupported unit: ${unit}`);
    }
}

/**
 * Calculate how many Bitcoin units you can buy with fiat amount
 * @param {number} btcRate - Price of 1 BTC in fiat currency
 * @param {number} fiatAmount - Amount of fiat currency
 * @param {'btc'|'bits'|'satoshi'} unit - Bitcoin unit type
 * @returns {number} Amount of Bitcoin units you can buy
 */
export function calculateUnitsPerFiat(btcRate, fiatAmount, unit) {
    if (typeof btcRate !== 'number' || btcRate <= 0) {
        throw new Error('Invalid BTC rate provided');
    }
    if (typeof fiatAmount !== 'number' || fiatAmount <= 0) {
        throw new Error('Invalid fiat amount provided');
    }

    const unitRate = calculateFiatPerUnit(btcRate, unit);
    return fiatAmount / unitRate;
}

/**
 * Apply precision rounding based on the value and unit type
 * @param {number} value - The value to round
 * @param {'btc'|'bits'|'satoshi'} unit - Bitcoin unit type
 * @param {number} customPrecision - Optional custom precision override
 * @returns {number} Rounded value
 */
export function applyPrecision(value, unit, customPrecision = null) {
    if (typeof value !== 'number') {
        throw new Error('Invalid value provided for precision rounding');
    }

    if (customPrecision !== null) {
        return Number(value.toFixed(customPrecision));
    }

    switch (unit.toLowerCase()) {
        case 'btc':
            // BTC: Use 8 decimal places for very small amounts, 4 for larger amounts
            return value >= 1 ? Number(value.toFixed(4)) : Number(value.toFixed(8));
        
        case 'bits':
            // BITS: Use 2 decimal places for most cases, more for very small amounts
            return value >= 1 ? Number(value.toFixed(2)) : Number(value.toFixed(6));
        
        case 'satoshi':
        case 'sats':
            // Satoshi: Always whole numbers (no decimals)
            return Math.round(value);
        
        default:
            return Number(value.toFixed(2));
    }
}

/**
 * Calculate percentage change between two rates
 * @param {number} oldRate - Previous rate
 * @param {number} newRate - Current rate
 * @returns {number} Percentage change (positive for increase, negative for decrease)
 */
export function calculatePercentageChange(oldRate, newRate) {
    if (typeof oldRate !== 'number' || typeof newRate !== 'number') {
        throw new Error('Invalid rates provided for percentage calculation');
    }
    if (oldRate === 0) {
        throw new Error('Cannot calculate percentage change from zero');
    }
    
    return ((newRate - oldRate) / oldRate) * 100;
}

/**
 * Validate if a rate value is reasonable for Bitcoin
 * @param {number} btcRate - BTC rate to validate
 * @returns {boolean} True if rate seems reasonable
 */
export function validateBitcoinRate(btcRate) {
    if (typeof btcRate !== 'number' || isNaN(btcRate)) {
        return false;
    }
    
    // Bitcoin rate should be positive and within reasonable bounds
    // Assuming Bitcoin won't go below $100 or above $10 million
    return btcRate > 100 && btcRate < 10000000;
}

/**
 * Convert between different Bitcoin units
 * @param {number} amount - Amount to convert
 * @param {'btc'|'bits'|'satoshi'} fromUnit - Source unit
 * @param {'btc'|'bits'|'satoshi'} toUnit - Target unit
 * @returns {number} Converted amount
 */
export function convertBitcoinUnits(amount, fromUnit, toUnit) {
    if (typeof amount !== 'number' || amount < 0) {
        throw new Error('Invalid amount provided for unit conversion');
    }

    const fromUnitLower = fromUnit.toLowerCase();
    const toUnitLower = toUnit.toLowerCase();

    if (fromUnitLower === toUnitLower) {
        return amount;
    }

    // Convert to BTC first, then to target unit
    let btcAmount;
    
    switch (fromUnitLower) {
        case 'btc':
            btcAmount = amount;
            break;
        case 'bits':
            btcAmount = amount / BITCOIN_UNITS.BITS_PER_BTC;
            break;
        case 'satoshi':
        case 'sats':
            btcAmount = amount / BITCOIN_UNITS.SATOSHI_PER_BTC;
            break;
        default:
            throw new Error(`Unsupported source unit: ${fromUnit}`);
    }

    // Convert from BTC to target unit
    switch (toUnitLower) {
        case 'btc':
            return btcAmount;
        case 'bits':
            return btcAmount * BITCOIN_UNITS.BITS_PER_BTC;
        case 'satoshi':
        case 'sats':
            return btcAmount * BITCOIN_UNITS.SATOSHI_PER_BTC;
        default:
            throw new Error(`Unsupported target unit: ${toUnit}`);
    }
}