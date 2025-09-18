/**
 * Search and Filtering Module
 * Handles currency search, filtering, and result highlighting
 */

import { currencies, getCurrenciesByGroup } from '../data/currency-config.js';
import preferencesManager from './preferences.js';

class SearchManager {
    constructor() {
        this.searchQuery = '';
        this.activeFilters = {
            group: 'all', // 'all', 'americas', 'europe', 'asia', 'oceania', 'africa'
            popular: 'all', // 'all', 'popular', 'other'
            favorites: 'all' // 'all', 'favorites', 'non-favorites'
        };
        this.debounceTimeout = null;
        this.debounceDelay = 300; // ms
        this.searchHistory = [];
        this.maxHistoryItems = 10;
        
        this.init();
    }

    init() {
        this.loadSearchHistory();
        this.setupEventListeners();
    }

    /**
     * Load search history from preferences
     */
    loadSearchHistory() {
        this.searchHistory = preferencesManager.getPreference('searchHistory', []);
    }

    /**
     * Save search history to preferences
     */
    saveSearchHistory() {
        preferencesManager.setPreference('searchHistory', this.searchHistory);
    }

    /**
     * Add search term to history
     * @param {string} query - Search query to add
     */
    addToHistory(query) {
        if (!query || query.length < 2) return;
        
        // Remove if already exists
        const index = this.searchHistory.indexOf(query);
        if (index > -1) {
            this.searchHistory.splice(index, 1);
        }
        
        // Add to beginning
        this.searchHistory.unshift(query);
        
        // Limit history size
        if (this.searchHistory.length > this.maxHistoryItems) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
        }
        
        this.saveSearchHistory();
    }

    /**
     * Set search query with debouncing
     * @param {string} query - Search query
     * @param {Function} callback - Callback to execute after debounce
     */
    setSearchQuery(query, callback) {
        this.searchQuery = query.toLowerCase().trim();
        
        // Clear existing timeout
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        
        // Set new timeout
        this.debounceTimeout = setTimeout(() => {
            if (this.searchQuery && this.searchQuery.length >= 2) {
                this.addToHistory(this.searchQuery);
            }
            
            if (callback) {
                callback(this.searchQuery);
            }
            
            this.dispatchSearchChanged();
        }, this.debounceDelay);
    }

    /**
     * Set filter value
     * @param {string} filterType - Type of filter ('group', 'popular', 'favorites')
     * @param {string} value - Filter value
     */
    setFilter(filterType, value) {
        if (this.activeFilters.hasOwnProperty(filterType)) {
            this.activeFilters[filterType] = value;
            this.dispatchSearchChanged();
        }
    }

    /**
     * Clear search query
     */
    clearSearch() {
        this.searchQuery = '';
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        this.dispatchSearchChanged();
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.activeFilters = {
            group: 'all',
            popular: 'all',
            favorites: 'all'
        };
        this.dispatchSearchChanged();
    }

    /**
     * Clear search and filters
     */
    clearAll() {
        this.clearSearch();
        this.clearFilters();
    }

    /**
     * Filter currencies based on search query and filters
     * @param {string[]} currencyCodes - Array of currency codes to filter
     * @param {string[]} favorites - Array of favorite currency codes
     * @returns {string[]} Filtered currency codes
     */
    filterCurrencies(currencyCodes = null, favorites = []) {
        let codes = currencyCodes || Object.keys(currencies);
        
        // Apply search query filter
        if (this.searchQuery) {
            codes = codes.filter(code => {
                const currency = currencies[code];
                const searchLower = this.searchQuery.toLowerCase();
                
                return (
                    code.toLowerCase().includes(searchLower) ||
                    currency.name.toLowerCase().includes(searchLower) ||
                    currency.symbol.toLowerCase().includes(searchLower) ||
                    (currency.group && currency.group.toLowerCase().includes(searchLower))
                );
            });
        }
        
        // Apply group filter
        if (this.activeFilters.group !== 'all') {
            codes = codes.filter(code => currencies[code].group === this.activeFilters.group);
        }
        
        // Apply popular filter
        if (this.activeFilters.popular !== 'all') {
            const showPopular = this.activeFilters.popular === 'popular';
            codes = codes.filter(code => currencies[code].popular === showPopular);
        }
        
        // Apply favorites filter
        if (this.activeFilters.favorites !== 'all') {
            const favoriteSet = new Set(favorites);
            const showFavorites = this.activeFilters.favorites === 'favorites';
            codes = codes.filter(code => favoriteSet.has(code) === showFavorites);
        }
        
        return codes;
    }

    /**
     * Highlight search matches in text
     * @param {string} text - Text to highlight
     * @param {string} query - Search query (optional, uses current query if not provided)
     * @returns {string} HTML with highlighted matches
     */
    highlightMatches(text, query = null) {
        const searchTerm = query || this.searchQuery;
        if (!searchTerm || !text) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    /**
     * Escape special regex characters
     * @param {string} string - String to escape
     * @returns {string} Escaped string
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Get search suggestions based on current query
     * @param {number} limit - Maximum number of suggestions
     * @returns {Object[]} Array of suggestion objects
     */
    getSearchSuggestions(limit = 5) {
        if (!this.searchQuery || this.searchQuery.length < 1) {
            return this.searchHistory.slice(0, limit).map(query => ({
                type: 'history',
                text: query,
                display: query
            }));
        }
        
        const suggestions = [];
        const searchLower = this.searchQuery.toLowerCase();
        
        // Currency code matches
        Object.keys(currencies).forEach(code => {
            if (code.toLowerCase().startsWith(searchLower)) {
                suggestions.push({
                    type: 'currency',
                    text: code,
                    display: `${code.toUpperCase()} - ${currencies[code].name}`,
                    currency: currencies[code]
                });
            }
        });
        
        // Currency name matches
        Object.entries(currencies).forEach(([code, currency]) => {
            if (currency.name.toLowerCase().includes(searchLower) && 
                !suggestions.some(s => s.text === code)) {
                suggestions.push({
                    type: 'currency',
                    text: code,
                    display: `${currency.name} (${code.toUpperCase()})`,
                    currency: currency
                });
            }
        });
        
        // Group matches
        const groups = ['americas', 'europe', 'asia', 'oceania', 'africa'];
        groups.forEach(group => {
            if (group.toLowerCase().includes(searchLower)) {
                suggestions.push({
                    type: 'group',
                    text: group,
                    display: `${group.charAt(0).toUpperCase() + group.slice(1)} currencies`,
                    group: group
                });
            }
        });
        
        return suggestions.slice(0, limit);
    }

    /**
     * Create search input UI
     * @param {HTMLElement} container - Container to append search input
     * @returns {HTMLElement} Search input element
     */
    createSearchInput(container) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <input 
                    type="text" 
                    id="currency-search" 
                    class="search-input" 
                    placeholder="Search currencies by name, code, or region..."
                    autocomplete="off"
                    aria-label="Search currencies"
                >
                <button class="search-clear" aria-label="Clear search" style="display: none;">×</button>
            </div>
            <div class="search-suggestions" id="search-suggestions" style="display: none;"></div>
        `;
        
        const input = searchContainer.querySelector('#currency-search');
        const clearButton = searchContainer.querySelector('.search-clear');
        const suggestionsContainer = searchContainer.querySelector('#search-suggestions');
        
        // Input event listener
        input.addEventListener('input', (e) => {
            const query = e.target.value;
            this.setSearchQuery(query, () => {
                this.updateSearchSuggestions(suggestionsContainer);
            });
            
            // Show/hide clear button
            clearButton.style.display = query ? 'block' : 'none';
        });
        
        // Clear button event listener
        clearButton.addEventListener('click', () => {
            input.value = '';
            this.clearSearch();
            clearButton.style.display = 'none';
            suggestionsContainer.style.display = 'none';
            input.focus();
        });
        
        // Focus and blur events for suggestions
        input.addEventListener('focus', () => {
            this.updateSearchSuggestions(suggestionsContainer);
        });
        
        input.addEventListener('blur', (e) => {
            // Delay hiding suggestions to allow clicking on them
            setTimeout(() => {
                if (!searchContainer.contains(document.activeElement)) {
                    suggestionsContainer.style.display = 'none';
                }
            }, 150);
        });
        
        // Keyboard navigation
        input.addEventListener('keydown', (e) => {
            this.handleSearchKeydown(e, suggestionsContainer);
        });
        
        container.appendChild(searchContainer);
        return searchContainer;
    }

    /**
     * Create filter controls UI
     * @param {HTMLElement} container - Container to append filter controls
     * @returns {HTMLElement} Filter controls element
     */
    createFilterControls(container) {
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'search-filters';
        filtersContainer.innerHTML = `
            <div class="filter-group">
                <label for="group-filter" class="filter-label">Region:</label>
                <select id="group-filter" class="filter-select">
                    <option value="all">All Regions</option>
                    <option value="americas">Americas</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                    <option value="oceania">Oceania</option>
                    <option value="africa">Africa</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="popular-filter" class="filter-label">Type:</label>
                <select id="popular-filter" class="filter-select">
                    <option value="all">All Currencies</option>
                    <option value="popular">Popular Only</option>
                    <option value="other">Others Only</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="favorites-filter" class="filter-label">Favorites:</label>
                <select id="favorites-filter" class="filter-select">
                    <option value="all">All</option>
                    <option value="favorites">Favorites Only</option>
                    <option value="non-favorites">Non-Favorites</option>
                </select>
            </div>
            
            <button class="filters-clear" aria-label="Clear all filters">Clear Filters</button>
        `;
        
        // Add event listeners
        const groupFilter = filtersContainer.querySelector('#group-filter');
        const popularFilter = filtersContainer.querySelector('#popular-filter');
        const favoritesFilter = filtersContainer.querySelector('#favorites-filter');
        const clearButton = filtersContainer.querySelector('.filters-clear');
        
        groupFilter.addEventListener('change', (e) => {
            this.setFilter('group', e.target.value);
        });
        
        popularFilter.addEventListener('change', (e) => {
            this.setFilter('popular', e.target.value);
        });
        
        favoritesFilter.addEventListener('change', (e) => {
            this.setFilter('favorites', e.target.value);
        });
        
        clearButton.addEventListener('click', () => {
            this.clearFilters();
            groupFilter.value = 'all';
            popularFilter.value = 'all';
            favoritesFilter.value = 'all';
        });
        
        container.appendChild(filtersContainer);
        return filtersContainer;
    }

    /**
     * Update search suggestions display
     * @param {HTMLElement} container - Suggestions container
     */
    updateSearchSuggestions(container) {
        const suggestions = this.getSearchSuggestions();
        
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.innerHTML = suggestions.map((suggestion, index) => `
            <div class="search-suggestion" data-index="${index}" data-type="${suggestion.type}" data-text="${suggestion.text}">
                <div class="suggestion-icon">
                    ${suggestion.type === 'history' ? '🕒' : 
                      suggestion.type === 'currency' ? suggestion.currency.flag : '🌍'}
                </div>
                <div class="suggestion-text">${this.highlightMatches(suggestion.display)}</div>
            </div>
        `).join('');
        
        container.style.display = 'block';
        
        // Add click listeners
        container.querySelectorAll('.search-suggestion').forEach(item => {
            item.addEventListener('click', () => {
                this.selectSuggestion(item);
            });
        });
    }

    /**
     * Handle keyboard navigation in search
     * @param {KeyboardEvent} e - Keyboard event
     * @param {HTMLElement} suggestionsContainer - Suggestions container
     */
    handleSearchKeydown(e, suggestionsContainer) {
        const suggestions = suggestionsContainer.querySelectorAll('.search-suggestion');
        const activeSuggestion = suggestionsContainer.querySelector('.search-suggestion.active');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (suggestions.length > 0) {
                    if (activeSuggestion) {
                        activeSuggestion.classList.remove('active');
                        const next = activeSuggestion.nextElementSibling || suggestions[0];
                        next.classList.add('active');
                    } else {
                        suggestions[0].classList.add('active');
                    }
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (suggestions.length > 0) {
                    if (activeSuggestion) {
                        activeSuggestion.classList.remove('active');
                        const prev = activeSuggestion.previousElementSibling || suggestions[suggestions.length - 1];
                        prev.classList.add('active');
                    } else {
                        suggestions[suggestions.length - 1].classList.add('active');
                    }
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                if (activeSuggestion) {
                    this.selectSuggestion(activeSuggestion);
                }
                break;
                
            case 'Escape':
                suggestionsContainer.style.display = 'none';
                e.target.blur();
                break;
        }
    }

    /**
     * Select a search suggestion
     * @param {HTMLElement} suggestionElement - Suggestion element
     */
    selectSuggestion(suggestionElement) {
        const type = suggestionElement.dataset.type;
        const text = suggestionElement.dataset.text;
        
        if (type === 'currency' || type === 'history') {
            const input = document.querySelector('#currency-search');
            if (input) {
                input.value = text;
                this.setSearchQuery(text);
            }
        } else if (type === 'group') {
            this.setFilter('group', text);
            const groupFilter = document.querySelector('#group-filter');
            if (groupFilter) {
                groupFilter.value = text;
            }
        }
        
        // Hide suggestions
        const container = suggestionElement.closest('.search-suggestions');
        if (container) {
            container.style.display = 'none';
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for preferences changes
        document.addEventListener('preferencesChanged', () => {
            this.loadSearchHistory();
        });
    }

    /**
     * Dispatch search changed event
     */
    dispatchSearchChanged() {
        const event = new CustomEvent('searchChanged', {
            detail: {
                query: this.searchQuery,
                filters: { ...this.activeFilters }
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Get current search state
     * @returns {Object} Current search state
     */
    getSearchState() {
        return {
            query: this.searchQuery,
            filters: { ...this.activeFilters }
        };
    }

    /**
     * Set search state
     * @param {Object} state - Search state to set
     */
    setSearchState(state) {
        if (state.query !== undefined) {
            this.searchQuery = state.query;
        }
        if (state.filters) {
            this.activeFilters = { ...this.activeFilters, ...state.filters };
        }
        this.dispatchSearchChanged();
    }

    /**
     * Clear search history
     */
    clearSearchHistory() {
        this.searchHistory = [];
        this.saveSearchHistory();
    }
}

// Create and export singleton instance
const searchManager = new SearchManager();
export default searchManager;

// Also export the class for testing
export { SearchManager };