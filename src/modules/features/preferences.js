/**
 * User Preferences Management Module
 * Handles user settings, theme switching, and persistent preferences
 */

class PreferencesManager {
    constructor() {
        this.storageKey = 'bitcoin-app-preferences';
        this.defaultPreferences = {
            theme: 'auto', // 'light', 'dark', 'auto'
            activeTab: 'btc',
            activePages: {
                btc: 'fiat-per-btc',
                bts: 'fiat-per-bits',
                sts: 'fiat-per-satoshi'
            },
            favorites: [],
            searchHistory: [],
            displaySettings: {
                showAnimations: true,
                compactMode: false,
                showFlags: true,
                groupByRegion: false
            },
            accessibility: {
                reduceMotion: false,
                highContrast: false,
                largeText: false
            }
        };
        
        this.preferences = this.loadPreferences();
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupThemeListener();
        this.setupAccessibilitySettings();
        this.dispatchPreferencesLoaded();
    }

    /**
     * Load preferences from localStorage
     * @returns {Object} User preferences with defaults applied
     */
    loadPreferences() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults to ensure all properties exist
                return this.mergeWithDefaults(parsed);
            }
        } catch (error) {
            console.warn('Failed to load preferences:', error);
        }
        return { ...this.defaultPreferences };
    }

    /**
     * Merge stored preferences with defaults
     * @param {Object} stored - Stored preferences
     * @returns {Object} Merged preferences
     */
    mergeWithDefaults(stored) {
        const merged = { ...this.defaultPreferences };
        
        // Deep merge for nested objects
        Object.keys(stored).forEach(key => {
            if (typeof stored[key] === 'object' && stored[key] !== null && !Array.isArray(stored[key])) {
                merged[key] = { ...merged[key], ...stored[key] };
            } else {
                merged[key] = stored[key];
            }
        });
        
        return merged;
    }

    /**
     * Save preferences to localStorage
     */
    savePreferences() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.preferences));
            this.dispatchPreferencesChanged();
        } catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }

    /**
     * Get a preference value
     * @param {string} key - Preference key (supports dot notation)
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Preference value
     */
    getPreference(key, defaultValue = null) {
        const keys = key.split('.');
        let value = this.preferences;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return defaultValue;
            }
        }
        
        return value;
    }

    /**
     * Set a preference value
     * @param {string} key - Preference key (supports dot notation)
     * @param {*} value - Value to set
     */
    setPreference(key, value) {
        const keys = key.split('.');
        let target = this.preferences;
        
        // Navigate to the parent object
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!(k in target) || typeof target[k] !== 'object') {
                target[k] = {};
            }
            target = target[k];
        }
        
        // Set the final value
        target[keys[keys.length - 1]] = value;
        this.savePreferences();
    }

    /**
     * Get current theme
     * @returns {string} Current theme ('light', 'dark', 'auto')
     */
    getTheme() {
        return this.preferences.theme;
    }

    /**
     * Set theme and apply it
     * @param {string} theme - Theme to set ('light', 'dark', 'auto')
     */
    setTheme(theme) {
        if (['light', 'dark', 'auto'].includes(theme)) {
            this.preferences.theme = theme;
            this.applyTheme();
            this.savePreferences();
        }
    }

    /**
     * Apply the current theme to the document
     */
    applyTheme() {
        const theme = this.preferences.theme;
        const root = document.documentElement;
        
        // Remove existing theme classes
        root.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        
        if (theme === 'auto') {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add('theme-auto');
            root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            root.classList.add(`theme-${theme}`);
            root.setAttribute('data-theme', theme);
        }
        
        // Apply accessibility preferences
        this.applyAccessibilitySettings();
    }

    /**
     * Setup system theme change listener
     */
    setupThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this.preferences.theme === 'auto') {
                    this.applyTheme();
                }
            });
        }
    }

    /**
     * Apply accessibility settings
     */
    applyAccessibilitySettings() {
        const root = document.documentElement;
        const { accessibility } = this.preferences;
        
        // Reduced motion
        if (accessibility.reduceMotion) {
            root.style.setProperty('--animation-duration', '0ms');
            root.style.setProperty('--transition-duration', '0ms');
        } else {
            root.style.removeProperty('--animation-duration');
            root.style.removeProperty('--transition-duration');
        }
        
        // High contrast
        root.classList.toggle('high-contrast', accessibility.highContrast);
        
        // Large text
        root.classList.toggle('large-text', accessibility.largeText);
    }

    /**
     * Setup accessibility settings based on system preferences
     */
    setupAccessibilitySettings() {
        // Check for prefers-reduced-motion
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.preferences.accessibility.reduceMotion = true;
        }
        
        // Check for prefers-contrast
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            this.preferences.accessibility.highContrast = true;
        }
        
        this.applyAccessibilitySettings();
    }

    /**
     * Save tab state
     * @param {string} activeTab - Currently active main tab
     * @param {Object} activePages - Active pages for each tab
     */
    saveTabState(activeTab, activePages) {
        this.preferences.activeTab = activeTab;
        this.preferences.activePages = { ...activePages };
        this.savePreferences();
    }

    /**
     * Get saved tab state
     * @returns {Object} Tab state with activeTab and activePages
     */
    getTabState() {
        return {
            activeTab: this.preferences.activeTab,
            activePages: { ...this.preferences.activePages }
        };
    }

    /**
     * Reset preferences to defaults
     */
    resetPreferences() {
        this.preferences = { ...this.defaultPreferences };
        this.savePreferences();
        this.applyTheme();
    }

    /**
     * Export preferences as JSON
     * @returns {string} JSON string of preferences
     */
    exportPreferences() {
        return JSON.stringify(this.preferences, null, 2);
    }

    /**
     * Import preferences from JSON
     * @param {string} jsonString - JSON string of preferences
     * @returns {boolean} Success status
     */
    importPreferences(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.preferences = this.mergeWithDefaults(imported);
            this.savePreferences();
            this.applyTheme();
            return true;
        } catch (error) {
            console.error('Failed to import preferences:', error);
            return false;
        }
    }

    /**
     * Dispatch preferences loaded event
     */
    dispatchPreferencesLoaded() {
        const event = new CustomEvent('preferencesLoaded', {
            detail: { preferences: this.preferences }
        });
        document.dispatchEvent(event);
    }

    /**
     * Dispatch preferences changed event
     */
    dispatchPreferencesChanged() {
        const event = new CustomEvent('preferencesChanged', {
            detail: { preferences: this.preferences }
        });
        document.dispatchEvent(event);
    }

    /**
     * Create theme toggle UI
     * @param {HTMLElement} container - Container to append theme toggle
     */
    createThemeToggle(container) {
        const themeToggle = document.createElement('div');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = `
            <label for="theme-select" class="theme-label">Theme:</label>
            <select id="theme-select" class="theme-select" aria-label="Select theme">
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        `;
        
        const select = themeToggle.querySelector('#theme-select');
        select.value = this.preferences.theme;
        
        select.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });
        
        container.appendChild(themeToggle);
        return themeToggle;
    }

    /**
     * Create accessibility controls UI
     * @param {HTMLElement} container - Container to append controls
     */
    createAccessibilityControls(container) {
        const controls = document.createElement('div');
        controls.className = 'accessibility-controls';
        controls.innerHTML = `
            <fieldset class="accessibility-fieldset">
                <legend>Accessibility Settings</legend>
                <label class="accessibility-option">
                    <input type="checkbox" id="reduce-motion" ${this.preferences.accessibility.reduceMotion ? 'checked' : ''}>
                    <span>Reduce motion</span>
                </label>
                <label class="accessibility-option">
                    <input type="checkbox" id="high-contrast" ${this.preferences.accessibility.highContrast ? 'checked' : ''}>
                    <span>High contrast</span>
                </label>
                <label class="accessibility-option">
                    <input type="checkbox" id="large-text" ${this.preferences.accessibility.largeText ? 'checked' : ''}>
                    <span>Large text</span>
                </label>
            </fieldset>
        `;
        
        // Add event listeners
        controls.querySelector('#reduce-motion').addEventListener('change', (e) => {
            this.setPreference('accessibility.reduceMotion', e.target.checked);
            this.applyAccessibilitySettings();
        });
        
        controls.querySelector('#high-contrast').addEventListener('change', (e) => {
            this.setPreference('accessibility.highContrast', e.target.checked);
            this.applyAccessibilitySettings();
        });
        
        controls.querySelector('#large-text').addEventListener('change', (e) => {
            this.setPreference('accessibility.largeText', e.target.checked);
            this.applyAccessibilitySettings();
        });
        
        container.appendChild(controls);
        return controls;
    }
}

// Create and export singleton instance
const preferencesManager = new PreferencesManager();
export default preferencesManager;

// Also export the class for testing
export { PreferencesManager };