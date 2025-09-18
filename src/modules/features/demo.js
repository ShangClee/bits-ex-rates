/**
 * Features Demo Module
 * Demonstrates how to integrate the new features with the existing Bitcoin app
 */

import featuresIntegration from './integration.js';
import preferencesManager from './preferences.js';
import favoritesManager from './favorites.js';
import searchManager from './search.js';

/**
 * Initialize features demo
 * This function shows how to integrate the features with the existing app
 */
export function initializeFeaturesDemo() {
    console.log('Initializing Bitcoin App Features Demo...');
    
    // Initialize the features integration
    featuresIntegration.init();
    
    // Add some demo event listeners to show integration
    setupDemoEventListeners();
    
    // Add demo data for testing
    addDemoData();
    
    console.log('Features demo initialized successfully!');
}

/**
 * Setup demo event listeners
 */
function setupDemoEventListeners() {
    // Listen for preferences changes
    document.addEventListener('preferencesChanged', (e) => {
        console.log('Preferences changed:', e.detail.preferences);
        showStatusMessage('Preferences updated', 'success');
    });
    
    // Listen for favorites changes
    document.addEventListener('favoritesChanged', (e) => {
        console.log('Favorites changed:', e.detail.favorites);
        showStatusMessage(`${e.detail.favorites.length} favorites`, 'success');
    });
    
    // Listen for search changes
    document.addEventListener('searchChanged', (e) => {
        console.log('Search changed:', e.detail);
        const { query, filters } = e.detail;
        let message = 'Search updated';
        if (query) message += `: "${query}"`;
        showStatusMessage(message, 'success');
    });
    
    // Listen for tab changes (if tab manager is available)
    document.addEventListener('tabChanged', (e) => {
        console.log('Tab changed:', e.detail);
        showStatusMessage(`Switched to ${e.detail.activeTab.toUpperCase()} tab`, 'success');
    });
}

/**
 * Add some demo data for testing
 */
function addDemoData() {
    // Add some popular currencies to favorites for demo
    const demoFavorites = ['usd', 'eur', 'gbp', 'jpy'];
    demoFavorites.forEach(code => {
        if (Math.random() > 0.5) { // Randomly add some favorites
            favoritesManager.addFavorite(code);
        }
    });
    
    // Set a demo theme preference
    if (!preferencesManager.getPreference('theme')) {
        preferencesManager.setTheme('auto');
    }
    
    // Add some search history for demo
    const demoSearches = ['USD', 'Euro', 'Bitcoin', 'Asia'];
    demoSearches.forEach(search => {
        if (Math.random() > 0.7) { // Randomly add some search history
            searchManager.addToHistory(search);
        }
    });
}

/**
 * Show status message to user
 * @param {string} message - Message to show
 * @param {string} type - Message type ('success', 'error', 'info')
 */
function showStatusMessage(message, type = 'info') {
    // Create or get status element
    let statusElement = document.querySelector('.features-status');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.className = 'features-status';
        document.body.appendChild(statusElement);
    }
    
    // Update message and type
    statusElement.textContent = message;
    statusElement.className = `features-status ${type} show`;
    
    // Hide after 3 seconds
    setTimeout(() => {
        statusElement.classList.remove('show');
    }, 3000);
}

/**
 * Demo function to show how to programmatically interact with features
 */
export function demonstrateFeatures() {
    console.log('Demonstrating features...');
    
    // Show current preferences
    console.log('Current theme:', preferencesManager.getTheme());
    console.log('Current favorites:', favoritesManager.getFavorites());
    console.log('Current search state:', searchManager.getSearchState());
    
    // Demonstrate theme switching
    setTimeout(() => {
        preferencesManager.setTheme('dark');
        showStatusMessage('Switched to dark theme', 'success');
    }, 2000);
    
    // Demonstrate adding a favorite
    setTimeout(() => {
        favoritesManager.addFavorite('cad');
        showStatusMessage('Added CAD to favorites', 'success');
    }, 4000);
    
    // Demonstrate search
    setTimeout(() => {
        searchManager.setSearchQuery('eur', () => {
            showStatusMessage('Searched for EUR', 'success');
        });
    }, 6000);
    
    // Reset after demo
    setTimeout(() => {
        searchManager.clearAll();
        showStatusMessage('Demo completed - search cleared', 'info');
    }, 8000);
}

/**
 * Export data for debugging
 */
export function exportDebugData() {
    return {
        preferences: JSON.parse(preferencesManager.exportPreferences()),
        favorites: JSON.parse(favoritesManager.exportFavorites()),
        searchState: searchManager.getSearchState(),
        timestamp: new Date().toISOString()
    };
}

/**
 * Reset all features to defaults
 */
export function resetAllFeatures() {
    if (confirm('Reset all features to defaults? This will clear all preferences, favorites, and search history.')) {
        preferencesManager.resetPreferences();
        favoritesManager.clearFavorites();
        searchManager.clearAll();
        showStatusMessage('All features reset to defaults', 'success');
        return true;
    }
    return false;
}

/**
 * Test feature integration
 */
export function testFeatureIntegration() {
    console.log('Testing feature integration...');
    
    const tests = [
        {
            name: 'Preferences Manager',
            test: () => {
                preferencesManager.setPreference('test', 'value');
                return preferencesManager.getPreference('test') === 'value';
            }
        },
        {
            name: 'Favorites Manager',
            test: () => {
                const initialCount = favoritesManager.getFavorites().length;
                favoritesManager.addFavorite('test');
                const newCount = favoritesManager.getFavorites().length;
                favoritesManager.removeFavorite('test');
                return newCount === initialCount + 1;
            }
        },
        {
            name: 'Search Manager',
            test: () => {
                searchManager.setSearchQuery('test');
                const state = searchManager.getSearchState();
                searchManager.clearSearch();
                return state.query === 'test';
            }
        },
        {
            name: 'Features Integration',
            test: () => {
                return featuresIntegration.initialized === true;
            }
        }
    ];
    
    const results = tests.map(test => {
        try {
            const passed = test.test();
            console.log(`✅ ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
            return { name: test.name, passed };
        } catch (error) {
            console.log(`❌ ${test.name}: ERROR - ${error.message}`);
            return { name: test.name, passed: false, error: error.message };
        }
    });
    
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    
    console.log(`\nTest Results: ${passedCount}/${totalCount} tests passed`);
    showStatusMessage(`Tests: ${passedCount}/${totalCount} passed`, passedCount === totalCount ? 'success' : 'error');
    
    return results;
}

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
    window.bitcoinAppFeatures = {
        initializeFeaturesDemo,
        demonstrateFeatures,
        exportDebugData,
        resetAllFeatures,
        testFeatureIntegration,
        preferencesManager,
        favoritesManager,
        searchManager,
        featuresIntegration
    };
}