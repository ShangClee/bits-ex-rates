/**
 * Application Initializer
 * Coordinates the initialization of all modules and features
 */

class AppInitializer {
    constructor() {
        this.modules = new Map();
        this.initialized = false;
    }

    /**
     * Initialize the application with all enhancements
     */
    async init() {
        if (this.initialized) return;

        try {
            // Initialize core utilities first
            await this.initializeAccessibility();
            await this.initializeKeyboardNavigation();
            await this.initializeMobileEnhancements();
            
            // Initialize feature modules
            await this.initializeFeatures();
            
            // Setup theme system
            await this.initializeThemeSystem();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Mark as initialized
            this.initialized = true;
            
            console.log('Bitcoin Exchange Rates app initialized successfully');
            
        } catch (error) {
            console.error('Error initializing app:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize accessibility features
     */
    async initializeAccessibility() {
        try {
            const { default: AccessibilityManager } = await import('./accessibility.js');
            const accessibilityManager = new AccessibilityManager();
            this.modules.set('accessibility', accessibilityManager);
            window.accessibilityManager = accessibilityManager;
            
            // Announce app ready
            setTimeout(() => {
                accessibilityManager.announce('Bitcoin Exchange Rates application loaded and ready');
            }, 1000);
            
        } catch (error) {
            console.warn('Accessibility features not available:', error);
        }
    }

    /**
     * Initialize keyboard navigation
     */
    async initializeKeyboardNavigation() {
        try {
            const { default: KeyboardNavigationManager } = await import('./keyboard-navigation.js');
            const keyboardManager = new KeyboardNavigationManager();
            this.modules.set('keyboard', keyboardManager);
            window.keyboardNavigationManager = keyboardManager;
            
        } catch (error) {
            console.warn('Keyboard navigation features not available:', error);
        }
    }

    /**
     * Initialize mobile enhancements
     */
    async initializeMobileEnhancements() {
        try {
            const { default: MobileEnhancementsManager } = await import('./mobile-enhancements.js');
            const mobileManager = new MobileEnhancementsManager();
            this.modules.set('mobile', mobileManager);
            window.mobileEnhancementsManager = mobileManager;
            
        } catch (error) {
            console.warn('Mobile enhancements not available:', error);
        }
    }

    /**
     * Initialize feature modules
     */
    async initializeFeatures() {
        try {
            // Initialize preferences first (other features depend on it)
            await this.initializePreferences();
            
            // Initialize other features
            await this.initializeFavorites();
            await this.initializeSearch();
            await this.initializeSharing();
            await this.initializeDataVisualization();
            await this.initializeIntegration();
            
        } catch (error) {
            console.warn('Some features not available:', error);
        }
    }

    /**
     * Initialize preferences system
     */
    async initializePreferences() {
        try {
            const { default: PreferencesManager } = await import('../features/preferences.js');
            const preferencesManager = new PreferencesManager();
            this.modules.set('preferences', preferencesManager);
            window.preferencesManager = preferencesManager;
            
        } catch (error) {
            console.warn('Preferences system not available:', error);
        }
    }

    /**
     * Initialize favorites system
     */
    async initializeFavorites() {
        try {
            const { default: FavoritesManager } = await import('../features/favorites.js');
            const favoritesManager = new FavoritesManager();
            this.modules.set('favorites', favoritesManager);
            window.favoritesManager = favoritesManager;
            
        } catch (error) {
            console.warn('Favorites system not available:', error);
        }
    }

    /**
     * Initialize search system
     */
    async initializeSearch() {
        try {
            const { default: SearchManager } = await import('../features/search.js');
            const searchManager = new SearchManager();
            this.modules.set('search', searchManager);
            window.searchManager = searchManager;
            
        } catch (error) {
            console.warn('Search system not available:', error);
        }
    }

    /**
     * Initialize sharing system
     */
    async initializeSharing() {
        try {
            const { default: SharingManager } = await import('../features/sharing.js');
            const sharingManager = new SharingManager();
            this.modules.set('sharing', sharingManager);
            window.sharingManager = sharingManager;
            
        } catch (error) {
            console.warn('Sharing system not available:', error);
        }
    }

    /**
     * Initialize data visualization system
     */
    async initializeDataVisualization() {
        try {
            const { default: DataVisualizationManager } = await import('../features/data-visualization.js');
            const dataVisualizationManager = new DataVisualizationManager();
            this.modules.set('dataVisualization', dataVisualizationManager);
            window.dataVisualizationManager = dataVisualizationManager;
            
        } catch (error) {
            console.warn('Data visualization system not available:', error);
        }
    }

    /**
     * Initialize features integration
     */
    async initializeIntegration() {
        try {
            const { default: IntegrationManager } = await import('../features/integration.js');
            const integrationManager = new IntegrationManager();
            this.modules.set('integration', integrationManager);
            window.integrationManager = integrationManager;
            
        } catch (error) {
            console.warn('Features integration not available:', error);
        }
    }

    /**
     * Initialize theme system
     */
    async initializeThemeSystem() {
        // Setup theme toggle functionality
        this.setupThemeToggle();
        
        // Apply saved theme
        this.applySavedTheme();
        
        // Listen for system theme changes
        this.setupSystemThemeListener();
    }

    /**
     * Setup theme toggle functionality
     */
    setupThemeToggle() {
        window.toggleTheme = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'auto';
            const themes = ['light', 'dark', 'high-contrast', 'auto'];
            const currentIndex = themes.indexOf(currentTheme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            
            this.setTheme(nextTheme);
            
            // Announce theme change
            if (window.accessibilityManager) {
                window.accessibilityManager.announceThemeChange(nextTheme);
            }
        };
    }

    /**
     * Set application theme
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
        // Add transition class to prevent flashing
        document.body.classList.add('theme-transitioning');
        
        // Set theme
        document.documentElement.setAttribute('data-theme', theme);
        
        // Save preference
        if (window.preferencesManager) {
            window.preferencesManager.savePreference('theme', theme);
        } else {
            localStorage.setItem('bitcoin-app-theme', theme);
        }
        
        // Remove transition class after change
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 150);
    }

    /**
     * Apply saved theme
     */
    applySavedTheme() {
        let savedTheme = 'auto';
        
        if (window.preferencesManager) {
            savedTheme = window.preferencesManager.getPreference('theme', 'auto');
        } else {
            savedTheme = localStorage.getItem('bitcoin-app-theme') || 'auto';
        }
        
        this.setTheme(savedTheme);
    }

    /**
     * Setup system theme change listener
     */
    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'auto') {
                // Force re-evaluation of auto theme
                document.documentElement.setAttribute('data-theme', 'auto');
            }
        };
        
        mediaQuery.addEventListener('change', handleSystemThemeChange);
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor JavaScript errors
        this.setupErrorMonitoring();
        
        // Monitor resource loading
        this.monitorResourceLoading();
    }

    /**
     * Monitor Core Web Vitals
     */
    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    /**
     * Setup error monitoring
     */
    setupErrorMonitoring() {
        window.addEventListener('error', (event) => {
            console.error('JavaScript Error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
        });
    }

    /**
     * Monitor resource loading
     */
    monitorResourceLoading() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', navigation.loadEventEnd - navigation.fetchStart);
            
            const resources = performance.getEntriesByType('resource');
            resources.forEach((resource) => {
                if (resource.duration > 1000) {
                    console.warn('Slow Resource:', resource.name, resource.duration);
                }
            });
        });
    }

    /**
     * Handle initialization errors
     * @param {Error} error - Initialization error
     */
    handleInitializationError(error) {
        // Show user-friendly error message
        const errorContainer = document.getElementById('error');
        if (errorContainer) {
            errorContainer.style.display = 'block';
            errorContainer.innerHTML = `
                <div class="error-boundary">
                    <h3 class="error-boundary-title">Application Error</h3>
                    <p class="error-boundary-message">
                        Some features may not be available. The basic functionality should still work.
                    </p>
                    <div class="error-boundary-actions">
                        <button class="btn btn-primary" onclick="location.reload()">
                            Reload Page
                        </button>
                    </div>
                </div>
            `;
        }
        
        // Hide loading indicator
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    /**
     * Get initialization status
     * @returns {Object} - Status information
     */
    getStatus() {
        return {
            initialized: this.initialized,
            modules: Array.from(this.modules.keys()),
            moduleCount: this.modules.size
        };
    }

    /**
     * Cleanup all modules
     */
    destroy() {
        this.modules.forEach((module, name) => {
            if (typeof module.destroy === 'function') {
                try {
                    module.destroy();
                } catch (error) {
                    console.warn(`Error destroying ${name} module:`, error);
                }
            }
        });
        
        this.modules.clear();
        this.initialized = false;
    }
}

// Export for use in other modules
export default AppInitializer;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const appInitializer = new AppInitializer();
        appInitializer.init();
        window.appInitializer = appInitializer;
    });
} else {
    // DOM is already ready
    const appInitializer = new AppInitializer();
    appInitializer.init();
    window.appInitializer = appInitializer;
}