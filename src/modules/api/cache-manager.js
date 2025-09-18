/**
 * Cache Manager Module
 * Handles TTL-based caching with LocalStorage integration
 * Provides persistent caching and offline data management
 */

class CacheManager {
    constructor() {
        this.memoryCache = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
        this.storagePrefix = 'btc_app_cache_';
        this.metadataKey = 'btc_app_cache_metadata';
        
        // Initialize and clean up expired entries on startup
        this._cleanupExpiredEntries();
    }

    /**
     * Store data in cache with TTL
     * @param {string} key - Cache key
     * @param {any} data - Data to cache
     * @param {number} ttl - Time to live in milliseconds (optional)
     * @returns {boolean} - Success status
     */
    set(key, data, ttl = this.defaultTTL) {
        const expiresAt = Date.now() + ttl;
        const cacheEntry = {
            data,
            expiresAt,
            createdAt: Date.now()
        };

        try {
            // Store in memory cache
            this.memoryCache.set(key, cacheEntry);
            
            // Store in localStorage for persistence
            this._setInLocalStorage(key, cacheEntry);
            
            // Update metadata
            this._updateMetadata(key, expiresAt);
            
            return true;
        } catch (error) {
            console.warn('Cache set error:', error);
            // If localStorage fails, at least keep in memory
            this.memoryCache.set(key, cacheEntry);
            return false;
        }
    }

    /**
     * Retrieve data from cache
     * @param {string} key - Cache key
     * @returns {any|null} - Cached data or null if not found/expired
     */
    get(key) {
        // First check memory cache
        let cacheEntry = this.memoryCache.get(key);
        
        // If not in memory, try localStorage
        if (!cacheEntry) {
            cacheEntry = this._getFromLocalStorage(key);
            if (cacheEntry) {
                // Restore to memory cache
                this.memoryCache.set(key, cacheEntry);
            }
        }

        if (!cacheEntry) {
            return null;
        }

        // Check if expired
        if (this.isExpired(key, cacheEntry)) {
            this.delete(key);
            return null;
        }

        return cacheEntry.data;
    }

    /**
     * Check if a cache entry is expired
     * @param {string} key - Cache key
     * @param {Object} cacheEntry - Cache entry object (optional, will fetch if not provided)
     * @returns {boolean}
     */
    isExpired(key, cacheEntry = null) {
        if (!cacheEntry) {
            cacheEntry = this.memoryCache.get(key) || this._getFromLocalStorage(key);
        }
        
        if (!cacheEntry) {
            return true;
        }

        return Date.now() > cacheEntry.expiresAt;
    }

    /**
     * Delete a cache entry
     * @param {string} key - Cache key
     * @returns {boolean} - Success status
     */
    delete(key) {
        try {
            // Remove from memory cache
            this.memoryCache.delete(key);
            
            // Remove from localStorage
            this._removeFromLocalStorage(key);
            
            // Update metadata
            this._removeFromMetadata(key);
            
            return true;
        } catch (error) {
            console.warn('Cache delete error:', error);
            return false;
        }
    }

    /**
     * Clear all cache entries
     * @returns {boolean} - Success status
     */
    clear() {
        try {
            // Clear memory cache
            this.memoryCache.clear();
            
            // Clear localStorage entries
            this._clearLocalStorage();
            
            return true;
        } catch (error) {
            console.warn('Cache clear error:', error);
            return false;
        }
    }

    /**
     * Get cache statistics
     * @returns {Object} - Cache statistics
     */
    getStats() {
        const memoryEntries = this.memoryCache.size;
        const metadata = this._getMetadata();
        const localStorageEntries = Object.keys(metadata).length;
        
        let totalSize = 0;
        try {
            // Estimate localStorage usage
            Object.keys(metadata).forEach(key => {
                const item = localStorage.getItem(this.storagePrefix + key);
                if (item) {
                    totalSize += item.length;
                }
            });
        } catch (error) {
            console.warn('Error calculating cache size:', error);
        }

        return {
            memoryEntries,
            localStorageEntries,
            estimatedSize: totalSize,
            lastCleanup: this._getLastCleanupTime()
        };
    }

    /**
     * Get offline data for emergency fallback
     * @returns {Object|null} - Most recent cached rates data
     */
    getOfflineData() {
        // Look for the most recent rates data
        const ratesKey = 'bitcoin_rates';
        const cachedRates = this.get(ratesKey);
        
        if (cachedRates) {
            return cachedRates;
        }

        // If no cached rates, try to find any rates data in localStorage
        try {
            const metadata = this._getMetadata();
            const rateKeys = Object.keys(metadata).filter(key => key.includes('rates'));
            
            if (rateKeys.length > 0) {
                // Get the most recently created entry
                let mostRecent = null;
                let mostRecentTime = 0;
                
                rateKeys.forEach(key => {
                    const entry = this._getFromLocalStorage(key);
                    if (entry && entry.createdAt > mostRecentTime) {
                        mostRecent = entry.data;
                        mostRecentTime = entry.createdAt;
                    }
                });
                
                return mostRecent;
            }
        } catch (error) {
            console.warn('Error retrieving offline data:', error);
        }

        return null;
    }

    /**
     * Force cleanup of expired entries
     * @returns {number} - Number of entries cleaned up
     */
    cleanup() {
        return this._cleanupExpiredEntries();
    }

    // Private methods

    /**
     * Store entry in localStorage
     * @param {string} key - Cache key
     * @param {Object} cacheEntry - Cache entry
     * @private
     */
    _setInLocalStorage(key, cacheEntry) {
        const storageKey = this.storagePrefix + key;
        localStorage.setItem(storageKey, JSON.stringify(cacheEntry));
    }

    /**
     * Retrieve entry from localStorage
     * @param {string} key - Cache key
     * @returns {Object|null}
     * @private
     */
    _getFromLocalStorage(key) {
        try {
            const storageKey = this.storagePrefix + key;
            const item = localStorage.getItem(storageKey);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.warn('Error reading from localStorage:', error);
            return null;
        }
    }

    /**
     * Remove entry from localStorage
     * @param {string} key - Cache key
     * @private
     */
    _removeFromLocalStorage(key) {
        const storageKey = this.storagePrefix + key;
        localStorage.removeItem(storageKey);
    }

    /**
     * Clear all cache entries from localStorage
     * @private
     */
    _clearLocalStorage() {
        const keysToRemove = [];
        
        // Find all cache keys
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.storagePrefix)) {
                keysToRemove.push(key);
            }
        }
        
        // Remove cache keys
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Remove metadata
        localStorage.removeItem(this.metadataKey);
    }

    /**
     * Update cache metadata
     * @param {string} key - Cache key
     * @param {number} expiresAt - Expiration timestamp
     * @private
     */
    _updateMetadata(key, expiresAt) {
        try {
            const metadata = this._getMetadata();
            metadata[key] = { expiresAt, updatedAt: Date.now() };
            localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
        } catch (error) {
            console.warn('Error updating cache metadata:', error);
        }
    }

    /**
     * Remove key from metadata
     * @param {string} key - Cache key
     * @private
     */
    _removeFromMetadata(key) {
        try {
            const metadata = this._getMetadata();
            delete metadata[key];
            localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
        } catch (error) {
            console.warn('Error removing from cache metadata:', error);
        }
    }

    /**
     * Get cache metadata
     * @returns {Object}
     * @private
     */
    _getMetadata() {
        try {
            const metadata = localStorage.getItem(this.metadataKey);
            return metadata ? JSON.parse(metadata) : {};
        } catch (error) {
            console.warn('Error reading cache metadata:', error);
            return {};
        }
    }

    /**
     * Clean up expired entries
     * @returns {number} - Number of entries cleaned up
     * @private
     */
    _cleanupExpiredEntries() {
        let cleanedCount = 0;
        const now = Date.now();
        
        try {
            const metadata = this._getMetadata();
            const expiredKeys = [];
            
            // Find expired keys
            Object.entries(metadata).forEach(([key, meta]) => {
                if (now > meta.expiresAt) {
                    expiredKeys.push(key);
                }
            });
            
            // Remove expired entries
            expiredKeys.forEach(key => {
                this.delete(key);
                cleanedCount++;
            });
            
            // Update last cleanup time
            this._setLastCleanupTime(now);
            
        } catch (error) {
            console.warn('Error during cache cleanup:', error);
        }
        
        return cleanedCount;
    }

    /**
     * Set last cleanup time
     * @param {number} timestamp - Cleanup timestamp
     * @private
     */
    _setLastCleanupTime(timestamp) {
        try {
            localStorage.setItem(this.storagePrefix + 'last_cleanup', timestamp.toString());
        } catch (error) {
            console.warn('Error setting last cleanup time:', error);
        }
    }

    /**
     * Get last cleanup time
     * @returns {number} - Last cleanup timestamp
     * @private
     */
    _getLastCleanupTime() {
        try {
            const timestamp = localStorage.getItem(this.storagePrefix + 'last_cleanup');
            return timestamp ? parseInt(timestamp, 10) : 0;
        } catch (error) {
            console.warn('Error getting last cleanup time:', error);
            return 0;
        }
    }
}

// Export singleton instance
export const cacheManager = new CacheManager();
export default cacheManager;