/**
 * Bitcoin API Service Module
 * Handles all API interactions for fetching Bitcoin exchange rates
 * Includes error handling, response validation, request debouncing,
 * exponential backoff, and network status detection
 */

import { cacheManager } from './cache-manager.js';

class BitcoinAPIService {
    constructor() {
        this.lastRequestTime = 0;
        this.debounceDelay = 1000; // 1 second debounce
        this.pendingRequest = null;
        
        // Exponential backoff configuration
        this.retryAttempts = new Map(); // Track retry attempts per endpoint
        this.maxRetries = 3;
        this.baseDelay = 1000; // 1 second base delay
        this.maxDelay = 30000; // 30 seconds max delay
        
        // Network status tracking
        this.isOnline = navigator.onLine;
        this.networkListeners = [];
        this._setupNetworkListeners();
        
        // Fallback data management
        this.fallbackData = null;
        this.lastSuccessfulFetch = null;
        
        // Sample rates for fallback when all APIs fail
        this.SAMPLE_RATES = {
            'usd': 43000, 'eur': 39000, 'gbp': 34000, 'jpy': 6400000,
            'aud': 65000, 'cad': 58000, 'chf': 38000, 'cny': 310000,
            'sek': 460000, 'nzd': 71000, 'mxn': 740000, 'sgd': 58000,
            'hkd': 340000, 'nok': 470000, 'try': 1480000, 'zar': 780000,
            'brl': 220000, 'inr': 3600000, 'krw': 57000000, 'twd': 1390000
        };
    }

    /**
     * Fetch Bitcoin rates for specified currencies with debouncing and caching
     * @param {Array<string>} currencies - Array of currency codes
     * @param {boolean} forceRefresh - Force refresh bypassing cache
     * @returns {Promise<{rates: Object, source: string}>}
     */
    async fetchRates(currencies = [], forceRefresh = false) {
        const cacheKey = 'bitcoin_rates';
        
        // Check cache first (unless force refresh is requested)
        if (!forceRefresh) {
            const cachedData = cacheManager.get(cacheKey);
            if (cachedData) {
                console.log('Using cached Bitcoin rates');
                return { rates: cachedData, source: 'cache' };
            }
        }

        // Implement debouncing to prevent multiple simultaneous calls
        const now = Date.now();
        if (now - this.lastRequestTime < this.debounceDelay) {
            if (this.pendingRequest) {
                return this.pendingRequest;
            }
        }

        this.lastRequestTime = now;
        
        // Create the request promise and store it for debouncing
        this.pendingRequest = this._performFetch(currencies);
        
        try {
            const result = await this.pendingRequest;
            
            // Cache successful results (but not sample data)
            if (result.source !== 'sample') {
                cacheManager.set(cacheKey, result.rates, 5 * 60 * 1000); // 5 minute cache
            }
            
            return result;
        } finally {
            // Clear pending request after completion
            this.pendingRequest = null;
        }
    }

    /**
     * Internal method to perform the actual API fetch with fallback logic
     * @param {Array<string>} currencies - Array of currency codes
     * @returns {Promise<{rates: Object, source: string}>}
     * @private
     */
    async _performFetch(currencies) {
        // Check network status first
        if (!this.isOnline) {
            console.warn('Device is offline, using fallback data');
            return this._getFallbackData();
        }

        try {
            // Try primary CoinGecko API with exponential backoff
            const result = await this._fetchWithRetry('coingecko', () => this._fetchFromCoinGecko(currencies));
            
            // Store successful result as fallback data
            this._updateFallbackData(result, 'coingecko');
            this._resetRetryCount('coingecko');
            
            return { rates: result, source: 'coingecko' };
        } catch (error) {
            console.warn('CoinGecko API Error:', error);
            
            try {
                // Fallback to CoinDesk API with exponential backoff
                console.log('Trying fallback CoinDesk API...');
                const result = await this._fetchWithRetry('coindesk', () => this._fetchFromCoinDesk(currencies));
                
                // Store successful result as fallback data
                this._updateFallbackData(result, 'coindesk');
                this._resetRetryCount('coindesk');
                
                return { rates: result, source: 'coindesk' };
            } catch (fallbackError) {
                console.warn('All APIs failed:', fallbackError);
                
                // Try to get cached/fallback data before using sample data
                return this._getFallbackData();
            }
        }
    }

    /**
     * Fetch rates from CoinGecko API
     * @param {Array<string>} currencies - Array of currency codes
     * @returns {Promise<Object>}
     * @private
     */
    async _fetchFromCoinGecko(currencies) {
        const currencyList = currencies.length > 0 ? currencies.join(',') : this._getDefaultCurrencies();
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currencyList}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            // Add timeout handling
            signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Validate response structure
        if (!this._validateCoinGeckoResponse(data)) {
            throw new Error('Invalid data format received from CoinGecko API');
        }

        return data.bitcoin;
    }

    /**
     * Fetch rates from CoinDesk API (USD only) and approximate others
     * @param {Array<string>} currencies - Array of currency codes
     * @returns {Promise<Object>}
     * @private
     */
    async _fetchFromCoinDesk(currencies) {
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
            throw new Error(`CoinDesk API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Validate response structure
        if (!this._validateCoinDeskResponse(data)) {
            throw new Error('Invalid data format received from CoinDesk API');
        }

        const btcUsdRate = data.bpi.USD.rate_float;
        
        // Generate approximate rates for other currencies based on USD
        return this._generateApproximateRates(btcUsdRate);
    }

    /**
     * Generate approximate exchange rates based on USD rate
     * @param {number} btcUsdRate - Bitcoin price in USD
     * @returns {Object}
     * @private
     */
    _generateApproximateRates(btcUsdRate) {
        // Approximate exchange rate multipliers (these are rough estimates)
        const exchangeRateMultipliers = {
            'usd': 1,
            'eur': 0.85,
            'gbp': 0.73,
            'jpy': 110,
            'aud': 1.35,
            'cad': 1.25,
            'chf': 0.88,
            'cny': 6.4,
            'sek': 9.5,
            'nzd': 1.45,
            'mxn': 18,
            'sgd': 1.35,
            'hkd': 7.8,
            'nok': 9.2,
            'try': 27,
            'zar': 15,
            'brl': 5.2,
            'inr': 83,
            'krw': 1300,
            'twd': 31
        };

        const approximateRates = {};
        Object.entries(exchangeRateMultipliers).forEach(([currency, multiplier]) => {
            approximateRates[currency] = btcUsdRate * multiplier;
        });

        return approximateRates;
    }

    /**
     * Validate CoinGecko API response structure
     * @param {Object} data - Response data from CoinGecko
     * @returns {boolean}
     * @private
     */
    _validateCoinGeckoResponse(data) {
        return data && 
               typeof data === 'object' && 
               data.bitcoin && 
               typeof data.bitcoin === 'object' &&
               Object.keys(data.bitcoin).length > 0;
    }

    /**
     * Validate CoinDesk API response structure
     * @param {Object} data - Response data from CoinDesk
     * @returns {boolean}
     * @private
     */
    _validateCoinDeskResponse(data) {
        return data && 
               data.bpi && 
               data.bpi.USD && 
               typeof data.bpi.USD.rate_float === 'number' &&
               data.bpi.USD.rate_float > 0;
    }

    /**
     * Get default currency list as comma-separated string
     * @returns {string}
     * @private
     */
    _getDefaultCurrencies() {
        return 'usd,eur,gbp,jpy,aud,cad,chf,cny,sek,nzd,mxn,sgd,hkd,nok,try,zar,brl,inr,krw,twd';
    }

    /**
     * Get sample rates for testing/fallback purposes
     * @returns {Object}
     */
    getSampleRates() {
        return { ...this.SAMPLE_RATES };
    }

    /**
     * Fetch with exponential backoff retry logic
     * @param {string} endpoint - Endpoint identifier for retry tracking
     * @param {Function} fetchFunction - Function to execute
     * @returns {Promise<any>}
     * @private
     */
    async _fetchWithRetry(endpoint, fetchFunction) {
        const retryCount = this.retryAttempts.get(endpoint) || 0;
        
        try {
            return await fetchFunction();
        } catch (error) {
            if (retryCount >= this.maxRetries) {
                throw new Error(`Max retries (${this.maxRetries}) exceeded for ${endpoint}: ${error.message}`);
            }

            // Calculate exponential backoff delay
            const delay = Math.min(
                this.baseDelay * Math.pow(2, retryCount),
                this.maxDelay
            );

            console.log(`Retrying ${endpoint} in ${delay}ms (attempt ${retryCount + 1}/${this.maxRetries})`);
            
            // Update retry count
            this.retryAttempts.set(endpoint, retryCount + 1);
            
            // Wait for the calculated delay
            await this._delay(delay);
            
            // Retry the request
            return this._fetchWithRetry(endpoint, fetchFunction);
        }
    }

    /**
     * Reset retry count for an endpoint after successful request
     * @param {string} endpoint - Endpoint identifier
     * @private
     */
    _resetRetryCount(endpoint) {
        this.retryAttempts.delete(endpoint);
    }

    /**
     * Delay utility for exponential backoff
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     * @private
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Setup network status listeners
     * @private
     */
    _setupNetworkListeners() {
        const handleOnline = () => {
            this.isOnline = true;
            console.log('Network connection restored');
            this._notifyNetworkListeners('online');
        };

        const handleOffline = () => {
            this.isOnline = false;
            console.log('Network connection lost');
            this._notifyNetworkListeners('offline');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Store references for cleanup if needed
        this._onlineHandler = handleOnline;
        this._offlineHandler = handleOffline;
    }

    /**
     * Add network status change listener
     * @param {Function} callback - Callback function (receives 'online' or 'offline')
     */
    addNetworkListener(callback) {
        this.networkListeners.push(callback);
    }

    /**
     * Remove network status change listener
     * @param {Function} callback - Callback function to remove
     */
    removeNetworkListener(callback) {
        const index = this.networkListeners.indexOf(callback);
        if (index > -1) {
            this.networkListeners.splice(index, 1);
        }
    }

    /**
     * Notify all network listeners of status change
     * @param {string} status - 'online' or 'offline'
     * @private
     */
    _notifyNetworkListeners(status) {
        this.networkListeners.forEach(callback => {
            try {
                callback(status);
            } catch (error) {
                console.warn('Error in network listener callback:', error);
            }
        });
    }

    /**
     * Update fallback data with successful API response
     * @param {Object} data - Successful API response data
     * @param {string} source - Source of the data
     * @private
     */
    _updateFallbackData(data, source) {
        this.fallbackData = {
            rates: { ...data },
            source,
            timestamp: Date.now()
        };
        this.lastSuccessfulFetch = Date.now();
    }

    /**
     * Get fallback data when APIs fail
     * @returns {Promise<{rates: Object, source: string}>}
     * @private
     */
    _getFallbackData() {
        // First try to use stored fallback data if it's recent (within 1 hour)
        if (this.fallbackData && (Date.now() - this.fallbackData.timestamp) < 3600000) {
            console.log('Using recent fallback data from', this.fallbackData.source);
            return Promise.resolve({
                rates: this.fallbackData.rates,
                source: `cached_${this.fallbackData.source}`
            });
        }

        // If no recent fallback data, try to get from cache manager
        const cachedData = cacheManager.getOfflineData();
        if (cachedData) {
            console.log('Using cached offline data');
            return Promise.resolve({
                rates: cachedData,
                source: 'cache'
            });
        }

        // Final fallback to sample data
        console.log('Using sample data as final fallback');
        return Promise.resolve({
            rates: this.SAMPLE_RATES,
            source: 'sample'
        });
    }

    /**
     * Get network status
     * @returns {boolean}
     */
    isNetworkOnline() {
        return this.isOnline;
    }

    /**
     * Get last successful fetch timestamp
     * @returns {number|null}
     */
    getLastSuccessfulFetch() {
        return this.lastSuccessfulFetch;
    }

    /**
     * Get current retry status for all endpoints
     * @returns {Object}
     */
    getRetryStatus() {
        const status = {};
        this.retryAttempts.forEach((count, endpoint) => {
            status[endpoint] = {
                attempts: count,
                maxRetries: this.maxRetries
            };
        });
        return status;
    }

    /**
     * Cleanup method to remove event listeners
     */
    cleanup() {
        if (this._onlineHandler) {
            window.removeEventListener('online', this._onlineHandler);
        }
        if (this._offlineHandler) {
            window.removeEventListener('offline', this._offlineHandler);
        }
        this.networkListeners = [];
    }
}

// Export singleton instance
export const bitcoinAPI = new BitcoinAPIService();
export default bitcoinAPI;