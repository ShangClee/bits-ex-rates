/**
 * Bitcoin Exchange Rates - Main Application Entry Point
 * Integrates modular architecture with legacy functionality
 */

// Import modular components
import { CurrencyConfig } from './src/modules/data/currency-config.js';
import { RateCalculator } from './src/modules/data/rate-calculator.js';
import { Formatter } from './src/modules/data/formatter.js';
import { BitcoinAPIService } from './src/modules/api/bitcoin-api.js';
import { CacheManager } from './src/modules/api/cache-manager.js';
import { TabManager } from './src/modules/ui/tab-manager.js';
import { RateRenderer } from './src/modules/ui/rate-renderer.js';
import { LoadingManager } from './src/modules/ui/loading-manager.js';
import { ErrorHandler } from './src/modules/ui/error-handler.js';

/**
 * Main Application Class
 * Coordinates all modules and maintains backward compatibility
 */
class BitcoinExchangeApp {
    constructor() {
        // Initialize core modules
        this.currencyConfig = new CurrencyConfig();
        this.rateCalculator = new RateCalculator();
        this.formatter = new Formatter();
        this.apiService = new BitcoinAPIService();
        this.cacheManager = new CacheManager();
        this.tabManager = new TabManager();
        this.rateRenderer = new RateRenderer();
        this.loadingManager = new LoadingManager();
        this.errorHandler = new ErrorHandler();
        
        // Application state
        this.currentRates = {};
        this.initialized = false;
        
        // Bind methods for backward compatibility
        this.bindLegacyMethods();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) return;

        try {
            console.log('Initializing Bitcoin Exchange Rates application...');
            
            // Initialize modules
            await this.initializeModules();
            
            // Setup UI
            this.setupUI();
            
            // Load initial data
            await this.loadInitialData();
            
            // Mark as initialized
            this.initialized = true;
            
            console.log('Bitcoin Exchange Rates application initialized successfully');
            
            // Dispatch initialization event
            document.dispatchEvent(new CustomEvent('appInitialized', {
                detail: { app: this }
            }));
            
        } catch (error) {
            console.error('Error initializing application:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        // Initialize cache manager
        await this.cacheManager.init();
        
        // Initialize API service with cache
        this.apiService.setCacheManager(this.cacheManager);
        
        // Initialize UI modules
        this.tabManager.init();
        this.loadingManager.init();
        this.errorHandler.init();
        
        // Initialize rate renderer with dependencies
        this.rateRenderer.init({
            formatter: this.formatter,
            rateCalculator: this.rateCalculator
        });
    }

    /**
     * Setup UI components
     */
    setupUI() {
        // Setup refresh button
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.fetchRates());
        }
        
        // Setup tab navigation
        this.setupTabNavigation();
        
        // Setup page navigation
        this.setupPageNavigation();
        
        // Restore saved state
        this.tabManager.restoreTabState();
    }

    /**
     * Setup tab navigation
     */
    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.main-tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const tabId = event.target.getAttribute('aria-controls').replace('-tab', '');
                this.showMainTab(tabId);
            });
        });
    }

    /**
     * Setup page navigation
     */
    setupPageNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const pageId = button.getAttribute('onclick')?.match(/showPage\('([^']+)'\)/)?.[1];
                if (pageId) {
                    this.showPage(pageId);
                }
            });
        });
    }

    /**
     * Load initial data
     */
    async loadInitialData() {
        // Start with cached data if available
        const cachedRates = this.cacheManager.get('bitcoin-rates');
        if (cachedRates) {
            this.currentRates = cachedRates;
            this.updateLastUpdateTime('cache');
            this.displayCurrentActiveTab();
        } else {
            // Use sample data as fallback
            this.currentRates = this.getSampleRates();
            this.updateLastUpdateTime('sample');
            this.displayCurrentActiveTab();
        }
        
        // Fetch fresh data
        await this.fetchRates();
    }

    /**
     * Fetch exchange rates from API
     */
    async fetchRates() {
        try {
            // Show loading state
            this.loadingManager.showLoading(document.getElementById('loading'));
            this.errorHandler.hideError();
            this.hideAllContainers();

            // Fetch rates from API
            const rates = await this.apiService.fetchRates(this.currencyConfig.getAllCurrencyCodes());
            
            if (rates && Object.keys(rates).length > 0) {
                this.currentRates = rates;
                this.updateLastUpdateTime('coingecko');
                this.displayCurrentActiveTab();
                
                // Cache the rates
                this.cacheManager.set('bitcoin-rates', rates, 5 * 60 * 1000); // 5 minutes
                
                // Dispatch rates updated event
                this.dispatchRatesUpdatedEvent();
                
            } else {
                throw new Error('No rate data received');
            }

        } catch (error) {
            console.warn('Primary API failed:', error);
            await this.handleAPIFailure(error);
        } finally {
            this.loadingManager.hideLoading();
        }
    }

    /**
     * Handle API failure with fallback strategies
     */
    async handleAPIFailure(primaryError) {
        try {
            // Try fallback API
            const fallbackRates = await this.apiService.fetchFallbackRates();
            
            if (fallbackRates && Object.keys(fallbackRates).length > 0) {
                this.currentRates = fallbackRates;
                this.updateLastUpdateTime('coindesk');
                this.displayCurrentActiveTab();
                this.dispatchRatesUpdatedEvent();
                
                this.errorHandler.showError(
                    'Using fallback API with approximate exchange rates.',
                    'warning'
                );
            } else {
                throw new Error('Fallback API also failed');
            }

        } catch (fallbackError) {
            console.warn('All APIs failed:', fallbackError);
            
            // Use cached data if available
            const cachedRates = this.cacheManager.get('bitcoin-rates');
            if (cachedRates) {
                this.currentRates = cachedRates;
                this.updateLastUpdateTime('cache');
                this.displayCurrentActiveTab();
                this.dispatchRatesUpdatedEvent();
                
                this.errorHandler.showError(
                    'Using cached data. Please check your internet connection.',
                    'warning'
                );
            } else {
                // Final fallback to sample data
                this.currentRates = this.getSampleRates();
                this.updateLastUpdateTime('sample');
                this.displayCurrentActiveTab();
                this.dispatchRatesUpdatedEvent();
                
                this.errorHandler.showError(
                    'API Error - Using sample rates. Please check your internet connection.',
                    'error'
                );
            }
        }
    }

    /**
     * Show main tab (BTC, BTS, STS)
     */
    showMainTab(tabId) {
        this.tabManager.switchMainTab(tabId);
        
        // Update display if we have rates
        if (Object.keys(this.currentRates).length > 0) {
            this.displayCurrentActiveTab();
        }
    }

    /**
     * Show page within a tab
     */
    showPage(pageId) {
        this.tabManager.switchPage(pageId);
        
        // Update display if we have rates
        if (Object.keys(this.currentRates).length > 0) {
            this.displayCurrentActiveTab();
        }
    }

    /**
     * Display content for currently active tab
     */
    displayCurrentActiveTab() {
        const activeTab = this.tabManager.getCurrentMainTab();
        const activePage = this.tabManager.getCurrentPage();
        
        if (!this.currentRates || Object.keys(this.currentRates).length === 0) {
            this.errorHandler.showError('No exchange rate data available');
            return;
        }

        // Hide all containers first
        this.hideAllContainers();

        // Display appropriate content based on active tab and page
        switch (activeTab) {
            case 'btc':
                this.displayBtcContent(activePage);
                break;
            case 'bts':
                this.displayBtsContent(activePage);
                break;
            case 'sts':
                this.displayStsContent(activePage);
                break;
        }
    }

    /**
     * Display BTC tab content
     */
    displayBtcContent(page) {
        switch (page) {
            case 'fiat-per-btc':
                this.displayFiatPerBtc();
                break;
            case 'btc-per-fiat':
                this.displayBtcPerFiat();
                break;
            default:
                this.displayFiatPerBtc();
        }
    }

    /**
     * Display BTS tab content
     */
    displayBtsContent(page) {
        switch (page) {
            case 'fiat-per-bits':
                this.displayFiatPerBits();
                break;
            case 'bits-per-fiat':
                this.displayBitsPerFiat();
                break;
            default:
                this.displayFiatPerBits();
        }
    }

    /**
     * Display STS tab content
     */
    displayStsContent(page) {
        switch (page) {
            case 'fiat-per-satoshi':
                this.displayFiatPerSatoshi();
                break;
            case 'satoshi-per-fiat':
                this.displaySatoshiPerFiat();
                break;
            default:
                this.displayFiatPerSatoshi();
        }
    }

    /**
     * Display fiat per BTC rates
     */
    displayFiatPerBtc() {
        const container = document.getElementById('fiatPerBtcContainer');
        const currencies = this.currencyConfig.getAllCurrencies();
        
        const rateCards = this.rateRenderer.renderRateCards(
            currencies,
            this.currentRates,
            'fiat-per-btc'
        );
        
        this.showContainer(container, rateCards);
    }

    /**
     * Display BTC per fiat rates
     */
    displayBtcPerFiat() {
        const container = document.getElementById('btcPerFiatContainer');
        const currencies = this.currencyConfig.getAllCurrencies();
        
        const rateCards = this.rateRenderer.renderRateCards(
            currencies,
            this.currentRates,
            'btc-per-fiat'
        );
        
        this.showContainer(container, rateCards);
    }

    /**
     * Display fiat per BITS rates
     */
    displayFiatPerBits() {
        const container = document.getElementById('fiatPerBitsContainer');
        const currencies = this.currencyConfig.getAllCurrencies();
        
        const rateCards = this.rateRenderer.renderRateCards(
            currencies,
            this.currentRates,
            'fiat-per-bits'
        );
        
        this.showContainer(container, rateCards);
    }

    /**
     * Display BITS per fiat rates
     */
    displayBitsPerFiat() {
        const container = document.getElementById('bitsPerFiatContainer');
        const currencies = this.currencyConfig.getAllCurrencies();
        
        const rateCards = this.rateRenderer.renderRateCards(
            currencies,
            this.currentRates,
            'bits-per-fiat'
        );
        
        this.showContainer(container, rateCards);
    }

    /**
     * Display fiat per Satoshi rates
     */
    displayFiatPerSatoshi() {
        const container = document.getElementById('fiatPerSatoshiContainer');
        const currencies = this.currencyConfig.getAllCurrencies();
        
        const rateCards = this.rateRenderer.renderRateCards(
            currencies,
            this.currentRates,
            'fiat-per-satoshi'
        );
        
        this.showContainer(container, rateCards);
    }

    /**
     * Display Satoshi per fiat rates
     */
    displaySatoshiPerFiat() {
        const container = document.getElementById('satoshiPerFiatContainer');
        const currencies = this.currencyConfig.getAllCurrencies();
        
        const rateCards = this.rateRenderer.renderRateCards(
            currencies,
            this.currentRates,
            'satoshi-per-fiat'
        );
        
        this.showContainer(container, rateCards);
    }

    /**
     * Show container with rate cards
     */
    showContainer(container, rateCards) {
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Add rate cards
        if (rateCards && rateCards.length > 0) {
            const fragment = document.createDocumentFragment();
            rateCards.forEach(card => fragment.appendChild(card));
            container.appendChild(fragment);
        }
        
        // Show container
        container.style.display = 'grid';
        
        // Hide loading and error states
        this.loadingManager.hideLoading();
        this.errorHandler.hideError();
    }

    /**
     * Hide all rate containers
     */
    hideAllContainers() {
        const containers = [
            'fiatPerBtcContainer',
            'btcPerFiatContainer',
            'fiatPerBitsContainer',
            'bitsPerFiatContainer',
            'fiatPerSatoshiContainer',
            'satoshiPerFiatContainer'
        ];

        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.style.display = 'none';
            }
        });
    }

    /**
     * Update last update time display
     */
    updateLastUpdateTime(source = 'live') {
        const now = new Date();
        const timeString = now.toLocaleString();

        const sourceMap = {
            'coingecko': 'CoinGecko API',
            'coindesk': 'CoinDesk API (approx. rates)',
            'cache': 'Cached Data',
            'sample': 'Sample Data',
            'live': 'Live Data'
        };

        const sourceText = sourceMap[source] || 'Live Data';
        const lastUpdateEl = document.getElementById('lastUpdate');
        
        if (lastUpdateEl) {
            lastUpdateEl.textContent = `Last updated: ${timeString} • Source: ${sourceText}`;
        }
    }

    /**
     * Get sample rates for fallback
     */
    getSampleRates() {
        return {
            'usd': 43000, 'eur': 39000, 'gbp': 34000, 'jpy': 6400000,
            'aud': 65000, 'cad': 58000, 'chf': 38000, 'cny': 310000,
            'sek': 460000, 'nzd': 71000, 'mxn': 740000, 'sgd': 58000,
            'hkd': 340000, 'nok': 470000, 'try': 1480000, 'zar': 780000,
            'brl': 220000, 'inr': 3600000, 'krw': 57000000, 'twd': 1390000
        };
    }

    /**
     * Dispatch rates updated event for other modules
     */
    dispatchRatesUpdatedEvent() {
        document.dispatchEvent(new CustomEvent('ratesUpdated', {
            detail: this.currentRates
        }));
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for tab changes
        document.addEventListener('tabChanged', (event) => {
            if (Object.keys(this.currentRates).length > 0) {
                this.displayCurrentActiveTab();
            }
        });

        // Listen for page changes
        document.addEventListener('pageChanged', (event) => {
            if (Object.keys(this.currentRates).length > 0) {
                this.displayCurrentActiveTab();
            }
        });
    }

    /**
     * Bind legacy methods for backward compatibility
     */
    bindLegacyMethods() {
        // Make methods available globally for backward compatibility
        window.showMainTab = (tabId) => this.showMainTab(tabId);
        window.showPage = (pageId) => this.showPage(pageId);
        window.fetchRates = () => this.fetchRates();
        
        // Expose current rates globally
        Object.defineProperty(window, 'currentRates', {
            get: () => this.currentRates,
            set: (value) => { this.currentRates = value; }
        });
        
        // Expose currencies configuration
        window.currencies = this.currencyConfig.getAllCurrencies();
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        console.error('Application initialization failed:', error);
        
        // Show error message
        this.errorHandler.showError(
            'Application failed to initialize properly. Some features may not work.',
            'error'
        );
        
        // Hide loading indicator
        this.loadingManager.hideLoading();
        
        // Try to show sample data
        try {
            this.currentRates = this.getSampleRates();
            this.updateLastUpdateTime('sample');
            this.displayCurrentActiveTab();
        } catch (fallbackError) {
            console.error('Even fallback initialization failed:', fallbackError);
        }
    }

    /**
     * Get application status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            hasRates: Object.keys(this.currentRates).length > 0,
            currentTab: this.tabManager.getCurrentMainTab(),
            currentPage: this.tabManager.getCurrentPage(),
            rateCount: Object.keys(this.currentRates).length
        };
    }

    /**
     * Cleanup application
     */
    destroy() {
        // Cleanup modules
        if (this.tabManager && typeof this.tabManager.destroy === 'function') {
            this.tabManager.destroy();
        }
        if (this.loadingManager && typeof this.loadingManager.destroy === 'function') {
            this.loadingManager.destroy();
        }
        if (this.errorHandler && typeof this.errorHandler.destroy === 'function') {
            this.errorHandler.destroy();
        }
        
        // Clear global references
        delete window.showMainTab;
        delete window.showPage;
        delete window.fetchRates;
        delete window.currentRates;
        delete window.currencies;
        
        // Clear state
        this.currentRates = {};
        this.initialized = false;
    }
}

// Initialize application when DOM is ready
let app;

function initializeApp() {
    try {
        app = new BitcoinExchangeApp();
        app.init();
        
        // Make app available globally for debugging
        window.bitcoinApp = app;
        
    } catch (error) {
        console.error('Failed to create application:', error);
        
        // Fallback to legacy script if modular approach fails
        const script = document.createElement('script');
        script.src = 'script.js';
        script.onerror = () => {
            console.error('Legacy script also failed to load');
        };
        document.head.appendChild(script);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for module use
export default BitcoinExchangeApp;