/**
 * Features Integration Module
 * Integrates preferences, favorites, and search with the main application
 */

import preferencesManager from './preferences.js';
import favoritesManager from './favorites.js';
import searchManager from './search.js';

class FeaturesIntegration {
    constructor() {
        this.initialized = false;
        this.settingsPanel = null;
        this.searchContainer = null;
        this.favoritesSection = null;
    }

    /**
     * Initialize all features integration
     */
    init() {
        if (this.initialized) return;
        
        this.setupEventListeners();
        this.createSettingsUI();
        this.createSearchUI();
        this.createFavoritesUI();
        this.integrateWithExistingUI();
        
        this.initialized = true;
        console.log('Features integration initialized');
    }

    /**
     * Setup event listeners for feature coordination
     */
    setupEventListeners() {
        // Preferences changes
        document.addEventListener('preferencesChanged', (e) => {
            this.handlePreferencesChanged(e.detail.preferences);
        });

        // Favorites changes
        document.addEventListener('favoritesChanged', (e) => {
            this.handleFavoritesChanged(e.detail.favorites);
            this.updateFavoritesUI();
        });

        // Search changes
        document.addEventListener('searchChanged', (e) => {
            this.handleSearchChanged(e.detail.query, e.detail.filters);
        });

        // Tab changes (integrate with existing tab manager)
        document.addEventListener('tabChanged', (e) => {
            preferencesManager.saveTabState(e.detail.activeTab, e.detail.activePages);
        });
    }

    /**
     * Create settings panel UI
     */
    createSettingsUI() {
        // Create settings toggle button
        const settingsToggle = document.createElement('button');
        settingsToggle.className = 'settings-toggle';
        settingsToggle.innerHTML = '⚙️';
        settingsToggle.setAttribute('aria-label', 'Open settings');
        settingsToggle.addEventListener('click', () => this.toggleSettingsPanel());
        
        // Create settings panel
        this.settingsPanel = document.createElement('div');
        this.settingsPanel.className = 'settings-panel';
        this.settingsPanel.innerHTML = `
            <div class="settings-panel-header">
                <h2 class="settings-panel-title">Settings</h2>
                <button class="settings-panel-close" aria-label="Close settings">×</button>
            </div>
            <div class="settings-panel-content">
                <div class="settings-section">
                    <h3 class="settings-section-title">Appearance</h3>
                    <div id="theme-controls"></div>
                    <div id="accessibility-controls"></div>
                </div>
                
                <div class="settings-section">
                    <h3 class="settings-section-title">Data Management</h3>
                    <div class="settings-actions">
                        <button id="export-preferences" class="settings-action-btn">Export Settings</button>
                        <button id="import-preferences" class="settings-action-btn">Import Settings</button>
                        <button id="reset-preferences" class="settings-action-btn reset-btn">Reset All</button>
                    </div>
                </div>
            </div>
        `;

        // Add to document
        document.body.appendChild(settingsToggle);
        document.body.appendChild(this.settingsPanel);

        // Setup panel controls
        this.setupSettingsPanel();
    }

    /**
     * Setup settings panel functionality
     */
    setupSettingsPanel() {
        const closeBtn = this.settingsPanel.querySelector('.settings-panel-close');
        const themeContainer = this.settingsPanel.querySelector('#theme-controls');
        const accessibilityContainer = this.settingsPanel.querySelector('#accessibility-controls');
        
        // Close button
        closeBtn.addEventListener('click', () => this.closeSettingsPanel());
        
        // Create theme and accessibility controls
        preferencesManager.createThemeToggle(themeContainer);
        preferencesManager.createAccessibilityControls(accessibilityContainer);
        
        // Data management buttons
        this.setupDataManagementButtons();
        
        // Close on outside click
        this.settingsPanel.addEventListener('click', (e) => {
            if (e.target === this.settingsPanel) {
                this.closeSettingsPanel();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsPanel.classList.contains('open')) {
                this.closeSettingsPanel();
            }
        });
    }

    /**
     * Setup data management buttons
     */
    setupDataManagementButtons() {
        const exportBtn = this.settingsPanel.querySelector('#export-preferences');
        const importBtn = this.settingsPanel.querySelector('#import-preferences');
        const resetBtn = this.settingsPanel.querySelector('#reset-preferences');
        
        exportBtn.addEventListener('click', () => this.exportData());
        importBtn.addEventListener('click', () => this.importData());
        resetBtn.addEventListener('click', () => this.resetAllData());
    }

    /**
     * Create search UI
     */
    createSearchUI() {
        // Find a good place to insert search (before the main content)
        const mainContent = document.querySelector('.main-content') || document.querySelector('main') || document.body;
        
        this.searchContainer = document.createElement('div');
        this.searchContainer.className = 'search-section';
        this.searchContainer.innerHTML = `
            <div class="search-header">
                <h3>Search & Filter Currencies</h3>
            </div>
            <div id="search-input-container"></div>
            <div id="search-filters-container"></div>
        `;
        
        // Insert at the beginning of main content
        mainContent.insertBefore(this.searchContainer, mainContent.firstChild);
        
        // Create search components
        const inputContainer = this.searchContainer.querySelector('#search-input-container');
        const filtersContainer = this.searchContainer.querySelector('#search-filters-container');
        
        searchManager.createSearchInput(inputContainer);
        searchManager.createFilterControls(filtersContainer);
    }

    /**
     * Create favorites UI
     */
    createFavoritesUI() {
        // Find where to insert favorites (after search, before rate cards)
        const insertAfter = this.searchContainer || document.querySelector('.main-content');
        
        this.favoritesSection = document.createElement('div');
        this.favoritesSection.className = 'favorites-wrapper';
        
        favoritesManager.createFavoritesSection(this.favoritesSection);
        
        // Insert after search section
        if (insertAfter.nextSibling) {
            insertAfter.parentNode.insertBefore(this.favoritesSection, insertAfter.nextSibling);
        } else {
            insertAfter.parentNode.appendChild(this.favoritesSection);
        }
    }

    /**
     * Integrate with existing UI elements
     */
    integrateWithExistingUI() {
        // Add star icons to existing rate cards
        this.addStarIconsToRateCards();
        
        // Apply saved preferences
        this.applySavedPreferences();
        
        // Setup mutation observer to handle dynamically added cards
        this.setupMutationObserver();
    }

    /**
     * Add star icons to existing rate cards
     */
    addStarIconsToRateCards() {
        const containers = document.querySelectorAll('[id*="Container"]');
        containers.forEach(container => {
            favoritesManager.addStarIconsToCards(container);
        });
    }

    /**
     * Apply saved preferences on initialization
     */
    applySavedPreferences() {
        // Theme is already applied by preferences manager
        
        // Restore tab state if available
        const tabState = preferencesManager.getTabState();
        if (tabState.activeTab && window.tabManager) {
            window.tabManager.switchMainTab(tabState.activeTab);
        }
    }

    /**
     * Setup mutation observer for dynamic content
     */
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if new rate cards were added
                        if (node.classList && node.classList.contains('rate-card')) {
                            this.handleNewRateCard(node);
                        } else {
                            // Check for rate cards within the added node
                            const rateCards = node.querySelectorAll && node.querySelectorAll('.rate-card');
                            if (rateCards) {
                                rateCards.forEach(card => this.handleNewRateCard(card));
                            }
                        }
                    }
                });
            });
        });

        // Observe the document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Handle new rate card added to DOM
     * @param {HTMLElement} card - Rate card element
     */
    handleNewRateCard(card) {
        const currencyCode = card.dataset.currency;
        if (currencyCode && !card.querySelector('.favorite-star')) {
            const star = favoritesManager.createStarIcon(currencyCode);
            const cardHeader = card.querySelector('.rate-card-header') || card.querySelector('.currency-info') || card;
            cardHeader.appendChild(star);
        }
        
        // Apply search highlighting if active
        if (searchManager.searchQuery) {
            this.applySearchHighlighting(card);
        }
    }

    /**
     * Apply search highlighting to a card
     * @param {HTMLElement} card - Rate card element
     */
    applySearchHighlighting(card) {
        const currencyCode = card.dataset.currency;
        if (!currencyCode) return;
        
        const textElements = card.querySelectorAll('.currency-name, .currency-code');
        textElements.forEach(element => {
            const originalText = element.textContent;
            const highlightedText = searchManager.highlightMatches(originalText);
            if (highlightedText !== originalText) {
                element.innerHTML = highlightedText;
            }
        });
    }

    /**
     * Handle preferences changes
     * @param {Object} preferences - Updated preferences
     */
    handlePreferencesChanged(preferences) {
        // Update UI based on preferences
        if (preferences.displaySettings) {
            this.applyDisplaySettings(preferences.displaySettings);
        }
    }

    /**
     * Handle favorites changes
     * @param {string[]} favorites - Updated favorites list
     */
    handleFavoritesChanged(favorites) {
        // Update all star icons
        favoritesManager.updateAllStarIcons();
        
        // Re-sort rate cards if needed
        this.sortRateCardsByFavorites();
    }

    /**
     * Handle search changes
     * @param {string} query - Search query
     * @param {Object} filters - Active filters
     */
    handleSearchChanged(query, filters) {
        this.filterAndHighlightCards(query, filters);
    }

    /**
     * Filter and highlight rate cards based on search
     * @param {string} query - Search query
     * @param {Object} filters - Active filters
     */
    filterAndHighlightCards(query, filters) {
        const allCards = document.querySelectorAll('.rate-card');
        const favorites = favoritesManager.getFavorites();
        
        allCards.forEach(card => {
            const currencyCode = card.dataset.currency;
            if (!currencyCode) return;
            
            // Check if card matches search criteria
            const matchesSearch = !query || this.cardMatchesSearch(card, currencyCode, query);
            const matchesFilters = this.cardMatchesFilters(currencyCode, filters, favorites);
            
            if (matchesSearch && matchesFilters) {
                card.classList.remove('hidden');
                if (query) {
                    this.applySearchHighlighting(card);
                    card.classList.add('highlighted');
                } else {
                    card.classList.remove('highlighted');
                    this.removeSearchHighlighting(card);
                }
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Update results count
        this.updateSearchResultsCount();
    }

    /**
     * Check if card matches search query
     * @param {HTMLElement} card - Rate card element
     * @param {string} currencyCode - Currency code
     * @param {string} query - Search query
     * @returns {boolean} Whether card matches search
     */
    cardMatchesSearch(card, currencyCode, query) {
        const currency = window.currencies && window.currencies[currencyCode];
        if (!currency) return false;
        
        const searchLower = query.toLowerCase();
        return (
            currencyCode.toLowerCase().includes(searchLower) ||
            currency.name.toLowerCase().includes(searchLower) ||
            currency.symbol.toLowerCase().includes(searchLower) ||
            (currency.group && currency.group.toLowerCase().includes(searchLower))
        );
    }

    /**
     * Check if card matches active filters
     * @param {string} currencyCode - Currency code
     * @param {Object} filters - Active filters
     * @param {string[]} favorites - Favorites list
     * @returns {boolean} Whether card matches filters
     */
    cardMatchesFilters(currencyCode, filters, favorites) {
        const currency = window.currencies && window.currencies[currencyCode];
        if (!currency) return false;
        
        // Group filter
        if (filters.group !== 'all' && currency.group !== filters.group) {
            return false;
        }
        
        // Popular filter
        if (filters.popular !== 'all') {
            const isPopular = currency.popular === true;
            if (filters.popular === 'popular' && !isPopular) return false;
            if (filters.popular === 'other' && isPopular) return false;
        }
        
        // Favorites filter
        if (filters.favorites !== 'all') {
            const isFavorite = favorites.includes(currencyCode);
            if (filters.favorites === 'favorites' && !isFavorite) return false;
            if (filters.favorites === 'non-favorites' && isFavorite) return false;
        }
        
        return true;
    }

    /**
     * Remove search highlighting from card
     * @param {HTMLElement} card - Rate card element
     */
    removeSearchHighlighting(card) {
        const highlightedElements = card.querySelectorAll('.search-highlight');
        highlightedElements.forEach(element => {
            element.outerHTML = element.textContent;
        });
    }

    /**
     * Update search results count display
     */
    updateSearchResultsCount() {
        const visibleCards = document.querySelectorAll('.rate-card:not(.hidden)');
        const totalCards = document.querySelectorAll('.rate-card');
        
        let countElement = document.querySelector('.search-results-count');
        if (!countElement) {
            countElement = document.createElement('div');
            countElement.className = 'search-results-count';
            this.searchContainer.appendChild(countElement);
        }
        
        countElement.textContent = `Showing ${visibleCards.length} of ${totalCards.length} currencies`;
    }

    /**
     * Sort rate cards by favorites
     */
    sortRateCardsByFavorites() {
        const containers = document.querySelectorAll('[id*="Container"]');
        containers.forEach(container => {
            const cards = Array.from(container.querySelectorAll('.rate-card'));
            const favorites = favoritesManager.getFavorites();
            
            cards.sort((a, b) => {
                const aCode = a.dataset.currency;
                const bCode = b.dataset.currency;
                const aIsFavorite = favorites.includes(aCode);
                const bIsFavorite = favorites.includes(bCode);
                
                if (aIsFavorite && !bIsFavorite) return -1;
                if (!aIsFavorite && bIsFavorite) return 1;
                
                // If both are favorites, sort by favorites order
                if (aIsFavorite && bIsFavorite) {
                    return favorites.indexOf(aCode) - favorites.indexOf(bCode);
                }
                
                return 0; // Keep original order for non-favorites
            });
            
            // Re-append cards in new order
            cards.forEach(card => container.appendChild(card));
        });
    }

    /**
     * Apply display settings
     * @param {Object} displaySettings - Display settings
     */
    applyDisplaySettings(displaySettings) {
        const root = document.documentElement;
        
        // Compact mode
        root.classList.toggle('compact-mode', displaySettings.compactMode);
        
        // Show flags
        root.classList.toggle('hide-flags', !displaySettings.showFlags);
        
        // Group by region
        if (displaySettings.groupByRegion) {
            this.groupCardsByRegion();
        }
    }

    /**
     * Group rate cards by region
     */
    groupCardsByRegion() {
        // This would require more complex restructuring of the DOM
        // For now, just add a class to indicate grouping preference
        document.body.classList.add('group-by-region');
    }

    /**
     * Toggle settings panel
     */
    toggleSettingsPanel() {
        if (this.settingsPanel.classList.contains('open')) {
            this.closeSettingsPanel();
        } else {
            this.openSettingsPanel();
        }
    }

    /**
     * Open settings panel
     */
    openSettingsPanel() {
        this.settingsPanel.classList.add('open');
        document.body.classList.add('settings-open');
        
        // Focus first focusable element
        const firstFocusable = this.settingsPanel.querySelector('button, input, select');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    /**
     * Close settings panel
     */
    closeSettingsPanel() {
        this.settingsPanel.classList.remove('open');
        document.body.classList.remove('settings-open');
    }

    /**
     * Export all data
     */
    exportData() {
        const data = {
            preferences: JSON.parse(preferencesManager.exportPreferences()),
            favorites: JSON.parse(favoritesManager.exportFavorites()),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bitcoin-app-settings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Import data
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.preferences) {
                        preferencesManager.importPreferences(JSON.stringify(data.preferences));
                    }
                    
                    if (data.favorites) {
                        favoritesManager.importFavorites(JSON.stringify(data.favorites));
                    }
                    
                    alert('Settings imported successfully!');
                    this.closeSettingsPanel();
                } catch (error) {
                    alert('Failed to import settings. Please check the file format.');
                    console.error('Import error:', error);
                }
            };
            reader.readAsText(file);
        });
        
        input.click();
    }

    /**
     * Reset all data
     */
    resetAllData() {
        if (confirm('Are you sure you want to reset all settings and favorites? This cannot be undone.')) {
            preferencesManager.resetPreferences();
            favoritesManager.clearFavorites();
            searchManager.clearAll();
            alert('All settings have been reset.');
            this.closeSettingsPanel();
        }
    }

    /**
     * Update favorites UI
     */
    updateFavoritesUI() {
        if (this.favoritesSection) {
            const favoritesContainer = this.favoritesSection.querySelector('.favorites-section');
            if (favoritesContainer) {
                favoritesManager.updateFavoritesDisplay(favoritesContainer);
            }
        }
    }
}

// Create and export singleton instance
const featuresIntegration = new FeaturesIntegration();
export default featuresIntegration;

// Also export the class for testing
export { FeaturesIntegration };