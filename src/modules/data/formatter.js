/**
 * Formatting Utilities Module
 * Handles number formatting, currency display, and locale-aware formatting
 */

/**
 * Format a number with locale-aware formatting
 * @param {number} value - The number to format
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale string (default: 'en-US')
 * @param {number} options.minimumFractionDigits - Minimum decimal places
 * @param {number} options.maximumFractionDigits - Maximum decimal places
 * @param {boolean} options.useGrouping - Whether to use thousand separators
 * @returns {string} Formatted number string
 */
export function formatNumber(value, options = {}) {
    const {
        locale = 'en-US',
        minimumFractionDigits = 0,
        maximumFractionDigits = 2,
        useGrouping = true
    } = options;

    if (typeof value !== 'number' || isNaN(value)) {
        return '0';
    }

    try {
        return value.toLocaleString(locale, {
            minimumFractionDigits,
            maximumFractionDigits,
            useGrouping
        });
    } catch (error) {
        // Fallback to basic formatting if locale is not supported
        return value.toFixed(maximumFractionDigits);
    }
}

/**
 * Format currency value with symbol and proper precision
 * @param {number} value - The currency value
 * @param {string} symbol - Currency symbol (e.g., '$', '€')
 * @param {Object} options - Formatting options
 * @param {number} options.precision - Decimal places (default: 2)
 * @param {string} options.locale - Locale for number formatting
 * @param {boolean} options.symbolFirst - Whether symbol comes before value (default: true)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, symbol, options = {}) {
    const {
        precision = 2,
        locale = 'en-US',
        symbolFirst = true
    } = options;

    if (typeof value !== 'number' || isNaN(value)) {
        return symbolFirst ? `${symbol}0` : `0${symbol}`;
    }

    const formattedValue = formatNumber(value, {
        locale,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
        useGrouping: true
    });

    return symbolFirst ? `${symbol}${formattedValue}` : `${formattedValue}${symbol}`;
}

/**
 * Format Bitcoin amounts with appropriate precision and unit labels
 * @param {number} value - The Bitcoin amount
 * @param {'btc'|'bits'|'satoshi'} unit - Bitcoin unit type
 * @param {Object} options - Formatting options
 * @param {boolean} options.showUnit - Whether to show unit label (default: true)
 * @param {string} options.locale - Locale for number formatting
 * @returns {string} Formatted Bitcoin amount string
 */
export function formatBitcoinAmount(value, unit, options = {}) {
    const {
        showUnit = true,
        locale = 'en-US'
    } = options;

    if (typeof value !== 'number' || isNaN(value)) {
        const unitLabel = showUnit ? ` ${getUnitLabel(unit)}` : '';
        return `0${unitLabel}`;
    }

    let formattedValue;
    let unitLabel = '';

    switch (unit.toLowerCase()) {
        case 'btc':
            if (value >= 1) {
                formattedValue = formatNumber(value, { locale, maximumFractionDigits: 4 });
            } else if (value >= 0.001) {
                formattedValue = formatNumber(value, { locale, maximumFractionDigits: 6 });
            } else {
                formattedValue = value.toExponential(2);
            }
            unitLabel = showUnit ? ' BTC' : '';
            break;

        case 'bits':
            formattedValue = formatNumber(value, { locale, maximumFractionDigits: 2 });
            unitLabel = showUnit ? ' BITS' : '';
            break;

        case 'satoshi':
        case 'sats':
            formattedValue = formatWithSuffix(Math.round(value));
            unitLabel = showUnit ? ' sats' : '';
            break;

        default:
            formattedValue = formatNumber(value, { locale });
            unitLabel = showUnit ? ` ${unit}` : '';
    }

    return `${formattedValue}${unitLabel}`;
}

/**
 * Format large numbers with K/M/B suffixes
 * @param {number} value - The number to format
 * @param {Object} options - Formatting options
 * @param {number} options.precision - Decimal places for suffixed numbers (default: 2)
 * @param {string} options.locale - Locale for number formatting
 * @returns {string} Formatted number with suffix
 */
export function formatWithSuffix(value, options = {}) {
    const {
        precision = 2,
        locale = 'en-US'
    } = options;

    if (typeof value !== 'number' || isNaN(value)) {
        return '0';
    }

    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= 1000000000) {
        const billions = absValue / 1000000000;
        return `${sign}${formatNumber(billions, { locale, maximumFractionDigits: precision })}B`;
    } else if (absValue >= 1000000) {
        const millions = absValue / 1000000;
        return `${sign}${formatNumber(millions, { locale, maximumFractionDigits: precision })}M`;
    } else if (absValue >= 1000) {
        const thousands = absValue / 1000;
        return `${sign}${formatNumber(thousands, { locale, maximumFractionDigits: precision })}K`;
    } else {
        return `${sign}${formatNumber(absValue, { locale, maximumFractionDigits: 0 })}`;
    }
}

/**
 * Format very small numbers (like Satoshi rates) with appropriate precision
 * @param {number} value - The small number to format
 * @param {Object} options - Formatting options
 * @param {number} options.maxDecimals - Maximum decimal places (default: 8)
 * @param {boolean} options.useExponential - Use scientific notation for very small numbers (default: true)
 * @param {number} options.exponentialThreshold - Threshold for switching to exponential (default: 0.000001)
 * @returns {string} Formatted small number string
 */
export function formatSmallNumber(value, options = {}) {
    const {
        maxDecimals = 8,
        useExponential = true,
        exponentialThreshold = 0.000001
    } = options;

    if (typeof value !== 'number' || isNaN(value)) {
        return '0';
    }

    if (value === 0) {
        return '0';
    }

    const absValue = Math.abs(value);
    
    if (useExponential && absValue < exponentialThreshold) {
        return value.toExponential(2);
    }

    // For BITS formatting, add space after 3 decimal places
    if (absValue < 1 && absValue >= 0.001) {
        const fixedValue = value.toFixed(6);
        return fixedValue.replace(/(\.\d{3})(\d{3})$/, '$1 $2');
    }

    return value.toFixed(Math.min(maxDecimals, getOptimalDecimalPlaces(absValue)));
}

/**
 * Format percentage values
 * @param {number} value - The percentage value (as decimal, e.g., 0.05 for 5%)
 * @param {Object} options - Formatting options
 * @param {number} options.precision - Decimal places (default: 2)
 * @param {boolean} options.showSign - Show + for positive values (default: true)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, options = {}) {
    const {
        precision = 2,
        showSign = true
    } = options;

    if (typeof value !== 'number' || isNaN(value)) {
        return '0%';
    }

    const percentage = value * 100;
    const sign = showSign && percentage > 0 ? '+' : '';
    const formattedValue = formatNumber(percentage, { maximumFractionDigits: precision });
    
    return `${sign}${formattedValue}%`;
}

/**
 * Get appropriate unit label for Bitcoin units
 * @param {'btc'|'bits'|'satoshi'} unit - Bitcoin unit type
 * @returns {string} Unit label
 */
function getUnitLabel(unit) {
    switch (unit.toLowerCase()) {
        case 'btc':
            return 'BTC';
        case 'bits':
            return 'BITS';
        case 'satoshi':
        case 'sats':
            return 'sats';
        default:
            return unit.toUpperCase();
    }
}

/**
 * Determine optimal number of decimal places based on value magnitude
 * @param {number} value - The value to analyze
 * @returns {number} Optimal number of decimal places
 */
function getOptimalDecimalPlaces(value) {
    if (value >= 1000) return 0;
    if (value >= 100) return 1;
    if (value >= 10) return 2;
    if (value >= 1) return 3;
    if (value >= 0.1) return 4;
    if (value >= 0.01) return 5;
    if (value >= 0.001) return 6;
    return 8;
}

/**
 * Format time duration in human-readable format
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Human-readable duration string
 */
export function formatDuration(milliseconds) {
    if (typeof milliseconds !== 'number' || milliseconds < 0) {
        return '0ms';
    }

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else if (seconds > 0) {
        return `${seconds}s`;
    } else {
        return `${milliseconds}ms`;
    }
}

/**
 * Format timestamp to human-readable date/time string
 * @param {Date|number} timestamp - Date object or timestamp in milliseconds
 * @param {Object} options - Formatting options
 * @param {string} options.locale - Locale string (default: 'en-US')
 * @param {boolean} options.includeTime - Include time in output (default: true)
 * @param {boolean} options.includeSeconds - Include seconds in time (default: false)
 * @returns {string} Formatted date/time string
 */
export function formatTimestamp(timestamp, options = {}) {
    const {
        locale = 'en-US',
        includeTime = true,
        includeSeconds = false
    } = options;

    let date;
    if (timestamp instanceof Date) {
        date = timestamp;
    } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
    } else {
        return 'Invalid date';
    }

    if (isNaN(date.getTime())) {
        return 'Invalid date';
    }

    try {
        const dateOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };

        if (includeTime) {
            dateOptions.hour = '2-digit';
            dateOptions.minute = '2-digit';
            if (includeSeconds) {
                dateOptions.second = '2-digit';
            }
        }

        return date.toLocaleString(locale, dateOptions);
    } catch (error) {
        // Fallback formatting
        return includeTime ? date.toString() : date.toDateString();
    }
}