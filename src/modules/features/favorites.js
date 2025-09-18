/**
 * Favorites Management Module
 * Handles user favorite currencies with persistence and UI controls
 */

import { currencies, getCurrency } from '../data/currency-config.js';
import preferencesManager from './preferences.js';

class FavoritesManager {
    constructor() {
        this.storageKey = 'bitcoin-app-favorites';
        this.favorites = this.loadFavorites();
        this.maxFavorites = 10; // Reasonable limit
        this.draggedElement = null;
        this.draggedIndex = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.dispatchFavoritesLoaded();
    }

    /**
     * Load favorites from preferences
     * @returns {string[]} Array of favorite currency codes
     */
    loadFavorites() {
        const stored = preferencesManager.getPreference('favorites', []);
        // Validate that all favorites are valid currency codes
        return stored.filter(code => currencies[code]);
    }

    /**
     * Save favorites to preferences
     */
    saveFavorites() {
        preferencesManager.setPreference('favorites', this.favorites);
        this.dispatchFavoritesChanged();
    }

    /**
     * Add currency to favorites
     * @param {string} currencyCode - Currency code to add
     * @returns {boolean} Success status
     */
    addFavorite(currencyCode) {
        if (!currencies[currencyCode]) {
            console.warn(`Invalid currency code: ${currencyCode}`);
            return false;
        }

        if (this.favorites.includes(currencyCode)) {
            console.warn(`Currency ${currencyCode} is already in favorites`);
            return false;
        }

        if (this.favorites.length >= this.maxFavorites) {
            console.warn(`Maximum favorites limit (${this.maxFavorites}) reached`);
            return false;
        }

        this.favorites.push(currencyCode);
        this.saveFavorites();
        return true;
    }

    /**
     * Remove currency from favorites
     * @param {string} currencyCode - Currency code to remove
     * @returns {boolean} Success status
     */
    removeFavorite(currencyCode) {
        const index = this.favorites.indexOf(currencyCode);
        if (index === -1) {
            console.warn(`Currency ${currencyCode} is not in favorites`);
            return false;
        }

        this.favorites.splice(index, 1);
        this.saveFavorites();
        return true;
    }

    /**
     * Toggle favorite status of a currency
     * @param {string} currencyCode - Currency code to toggle
     * @returns {boolean} New favorite status
     */
    toggleFavorite(currencyCode) {
        if (this.isFavorite(currencyCode)) {
            this.removeFavorite(currencyCode);
            return false;
        } else {
            this.addFavorite(currencyCode);
            return true;
        }
    }

    /**
     * Check if currency is in favorites
     * @param {string} currencyCode - Currency code to check
     * @returns {boolean} Favorite status
     */
    isFavorite(currencyCode) {
        return this.favorites.includes(currencyCode);
    }

    /**
     * Get all favorites
     * @returns {string[]} Array of favorite currency codes
     */
    getFavorites() {
        return [...this.favorites];
    }

    /**
     * Get favorite currencies with their config data
     * @returns {Object[]} Array of favorite currency objects
     */
    getFavoriteCurrencies() {
        return this.favorites.map(code => ({
            code,
            ...currencies[code]
        }));
    }

    /**
     * Reorder favorites
     * @param {number} fromIndex - Source index
     * @param {number} toIndex - Target index
     */
    reorderFavorites(fromIndex, toIndex) {
        if (fromIndex < 0 || fromIndex >= this.favorites.length ||
            toIndex < 0 || toIndex >= this.favorites.length) {
            return;
        }

        const [movedItem] = this.favorites.splice(fromIndex, 1);
        this.favorites.splice(toIndex, 0, movedItem);
        this.saveFavorites();
    }

    /**
     * Clear all favorites
     */
    clearFavorites() {
        this.favorites = [];
        this.saveFavorites();
    }

    /**
     * Create star icon for favorite toggle
     * @param {string} currencyCode - Currency code
     * @param {boolean} isFilled - Whether star should be filled
     * @returns {HTMLElement} Star icon element
     */
    createStarIcon(currencyCode, isFilled = null) {
        const isCurrentlyFavorite = isFilled !== null ? isFilled : this.isFavorite(currencyCode);
        
        const star = document.createElement('button');
        star.className = `favorite-star ${isCurrentlyFavorite ? 'favorite-star--filled' : 'favorite-star--empty'}`;
        star.setAttribute('aria-label', 
            isCurrentlyFavorite ? `Remove ${currencyCode.toUpperCase()} from favorites` : `Add ${currencyCode.toUpperCase()} to favorites`
        );
        star.setAttribute('data-currency', currencyCode);
        star.innerHTML = isCurrentlyFavorite ? '★' : '☆';
        
        star.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleStarClick(star, currencyCode);
        });

        return star;
    }

    /**
     * Handle star icon click
     * @param {HTMLElement} starElement - Star element
     * @param {string} currencyCode - Currency code
     */
    handleStarClick(starElement, currencyCode) {
        const wasAdded = this.toggleFavorite(currencyCode);
        this.updateStarIcon(starElement, currencyCode, wasAdded);
        
        // Add visual feedback
        starElement.classList.add('favorite-star--animating');
        setTimeout(() => {
            starElement.classList.remove('favorite-star--animating');
        }, 300);
    }

    /**
     * Update star icon appearance
     * @param {HTMLElement} starElement - Star element
     * @param {string} currencyCode - Currency code
     * @param {boolean} isFavorite - Current favorite status
     */
    updateStarIcon(starElement, currencyCode, isFavorite) {
        starElement.className = `favorite-star ${isFavorite ? 'favorite-star--filled' : 'favorite-star--empty'}`;
        starElement.innerHTML = isFavorite ? '★' : '☆';
        starElement.setAttribute('aria-label', 
            isFavorite ? `Remove ${currencyCode.toUpperCase()} from favorites` : `Add ${currencyCode.toUpperCase()} to favorites`
        );
    }

    /**
     * Create favorites section UI
     * @param {HTMLElement} container - Container to append favorites section
     * @returns {HTMLElement} Favorites section element
     */
    createFavoritesSection(container) {
        const section = document.createElement('div');
        section.className = 'favorites-section';
        section.innerHTML = `
            <div class="favorites-header">
                <h3 class="favorites-title">Favorite Currencies</h3>
                <button class="favorites-clear" aria-label="Clear all favorites">Clear All</button>
            </div>
            <div class="favorites-list" id="favorites-list">
                ${this.renderFavoritesList()}
            </div>
            <div class="favorites-empty" style="display: ${this.favorites.length === 0 ? 'block' : 'none'}">
                <p>No favorite currencies yet. Click the ★ icon next to any currency to add it to your favorites.</p>
            </div>
        `;

        // Add event listeners
        const clearButton = section.querySelector('.favorites-clear');
        clearButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all favorites?')) {
                this.clearFavorites();
                this.updateFavoritesDisplay(section);
            }
        });

        // Setup drag and drop
        this.setupDragAndDrop(section.querySelector('.favorites-list'));

        container.appendChild(section);
        return section;
    }

    /**
     * Render favorites list HTML
     * @returns {string} HTML string for favorites list
     */
    renderFavoritesList() {
        if (this.favorites.length === 0) {
            return '';
        }

        return this.favorites.map((code, index) => {
            const currency = currencies[code];
            return `
                <div class="favorite-item" data-currency="${code}" data-index="${index}" draggable="true">
                    <div class="favorite-drag-handle" aria-label="Drag to reorder">⋮⋮</div>
                    <div class="favorite-flag">${currency.flag}</div>
                    <div class="favorite-info">
                        <div class="favorite-name">${currency.name}</div>
                        <div class="favorite-code">${code.toUpperCase()}</div>
                    </div>
                    <button class="favorite-remove" data-currency="${code}" aria-label="Remove ${currency.name} from favorites">×</button>
                </div>
            `;
        }).join('');
    }

    /**
     * Setup drag and drop for reordering
     * @param {HTMLElement} listElement - Favorites list element
     */
    setupDragAndDrop(listElement) {
        listElement.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('favorite-item')) {
                this.draggedElement = e.target;
                this.draggedIndex = parseInt(e.target.dataset.index);
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        listElement.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('favorite-item')) {
                e.target.classList.remove('dragging');
                this.draggedElement = null;
                this.draggedIndex = null;
            }
        });

        listElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const afterElement = this.getDragAfterElement(listElement, e.clientY);
            if (afterElement == null) {
                listElement.appendChild(this.draggedElement);
            } else {
                listElement.insertBefore(this.draggedElement, afterElement);
            }
        });

        listElement.addEventListener('drop', (e) => {
            e.preventDefault();
            const newIndex = Array.from(listElement.children).indexOf(this.draggedElement);
            if (newIndex !== this.draggedIndex) {
                this.reorderFavorites(this.draggedIndex, newIndex);
                this.updateFavoritesDisplay(listElement.closest('.favorites-section'));
            }
        });

        // Add remove button listeners
        listElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-remove')) {
                const currencyCode = e.target.dataset.currency;
                this.removeFavorite(currencyCode);
                this.updateFavoritesDisplay(listElement.closest('.favorites-section'));
            }
        });
    }

    /**
     * Get element after which to insert dragged element
     * @param {HTMLElement} container - Container element
     * @param {number} y - Y coordinate
     * @returns {HTMLElement|null} Element after which to insert
     */
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.favorite-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    /**
     * Update favorites display
     * @param {HTMLElement} section - Favorites section element
     */
    updateFavoritesDisplay(section) {
        const listElement = section.querySelector('.favorites-list');
        const emptyElement = section.querySelector('.favorites-empty');
        
        listElement.innerHTML = this.renderFavoritesList();
        emptyElement.style.display = this.favorites.length === 0 ? 'block' : 'none';
        
        // Re-setup drag and drop
        this.setupDragAndDrop(listElement);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for preferences changes to sync favorites
        document.addEventListener('preferencesChanged', (e) => {
            const newFavorites = e.detail.preferences.favorites || [];
            if (JSON.stringify(newFavorites) !== JSON.stringify(this.favorites)) {
                this.favorites = newFavorites;
                this.dispatchFavoritesChanged();
            }
        });
    }

    /**
     * Add star icons to existing rate cards
     * @param {HTMLElement} container - Container with rate cards
     */
    addStarIconsToCards(container) {
        const cards = container.querySelectorAll('.rate-card');
        cards.forEach(card => {
            const currencyCode = card.dataset.currency;
            if (currencyCode && !card.querySelector('.favorite-star')) {
                const star = this.createStarIcon(currencyCode);
                const cardHeader = card.querySelector('.rate-card-header') || card.querySelector('.currency-info');
                if (cardHeader) {
                    cardHeader.appendChild(star);
                }
            }
        });
    }

    /**
     * Update all star icons in the document
     */
    updateAllStarIcons() {
        const stars = document.querySelectorAll('.favorite-star');
        stars.forEach(star => {
            const currencyCode = star.dataset.currency;
            if (currencyCode) {
                const isFavorite = this.isFavorite(currencyCode);
                this.updateStarIcon(star, currencyCode, isFavorite);
            }
        });
    }

    /**
     * Get favorites sorted by preference order
     * @param {string[]} currencyCodes - Array of currency codes to sort
     * @returns {string[]} Sorted currency codes with favorites first
     */
    sortWithFavoritesFirst(currencyCodes) {
        const favoriteSet = new Set(this.favorites);
        const favorites = currencyCodes.filter(code => favoriteSet.has(code));
        const nonFavorites = currencyCodes.filter(code => !favoriteSet.has(code));
        
        // Sort favorites by their order in the favorites array
        favorites.sort((a, b) => this.favorites.indexOf(a) - this.favorites.indexOf(b));
        
        return [...favorites, ...nonFavorites];
    }

    /**
     * Dispatch favorites loaded event
     */
    dispatchFavoritesLoaded() {
        const event = new CustomEvent('favoritesLoaded', {
            detail: { favorites: this.favorites }
        });
        document.dispatchEvent(event);
    }

    /**
     * Dispatch favorites changed event
     */
    dispatchFavoritesChanged() {
        const event = new CustomEvent('favoritesChanged', {
            detail: { favorites: this.favorites }
        });
        document.dispatchEvent(event);
    }

    /**
     * Export favorites as JSON
     * @returns {string} JSON string of favorites
     */
    exportFavorites() {
        return JSON.stringify(this.favorites, null, 2);
    }

    /**
     * Import favorites from JSON
     * @param {string} jsonString - JSON string of favorites
     * @returns {boolean} Success status
     */
    importFavorites(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            if (Array.isArray(imported)) {
                // Validate all currency codes
                const validFavorites = imported.filter(code => currencies[code]);
                this.favorites = validFavorites.slice(0, this.maxFavorites);
                this.saveFavorites();
                return true;
            }
        } catch (error) {
            console.error('Failed to import favorites:', error);
        }
        return false;
    }
}

// Create and export singleton instance
const favoritesManager = new FavoritesManager();
export default favoritesManager;

// Also export the class for testing
export { FavoritesManager };