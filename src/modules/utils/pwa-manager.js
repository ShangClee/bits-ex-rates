/**
 * PWA Manager Module
 * Handles Progressive Web App features including service worker registration,
 * background sync, push notifications, and app installation
 */

class PWAManager {
    constructor() {
        this.serviceWorker = null;
        this.registration = null;
        this.isOnline = navigator.onLine;
        this.installPrompt = null;
        this.updateAvailable = false;
        this.backgroundSyncSupported = false;
        this.pushSupported = false;
        
        this.init();
    }

    /**
     * Initialize PWA features
     */
    async init() {
        console.log('PWA Manager: Initializing...');
        
        // Check for service worker support
        if ('serviceWorker' in navigator) {
            await this.registerServiceWorker();
            this.setupServiceWorkerListeners();
        } else {
            console.warn('PWA Manager: Service Worker not supported');
        }
        
        // Setup network status monitoring
        this.setupNetworkMonitoring();
        
        // Setup app installation
        this.setupAppInstallation();
        
        // Setup background sync
        this.setupBackgroundSync();
        
        // Setup push notifications
        this.setupPushNotifications();
        
        // Setup update checking
        this.setupUpdateChecking();
        
        console.log('PWA Manager: Initialized successfully');
    }

    /**
     * Register service worker
     */
    async registerServiceWorker() {
        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('PWA Manager: Service Worker registered successfully');
            
            // Check for updates
            this.registration.addEventListener('updatefound', () => {
                this.handleServiceWorkerUpdate();
            });
            
            // Get active service worker
            this.serviceWorker = this.registration.active || 
                               this.registration.waiting || 
                               this.registration.installing;
            
            return this.registration;
        } catch (error) {
            console.error('PWA Manager: Service Worker registration failed:', error);
            throw error;
        }
    }

    /**
     * Setup service worker message listeners
     */
    setupServiceWorkerListeners() {
        navigator.serviceWorker.addEventListener('message', (event) => {
            const { type, data } = event.data;
            
            switch (type) {
                case 'RATES_UPDATED':
                    this.handleBackgroundRateUpdate(data);
                    break;
                case 'CACHE_UPDATED':
                    this.handleCacheUpdate(data);
                    break;
                case 'OFFLINE_READY':
                    this.handleOfflineReady();
                    break;
                default:
                    console.log('PWA Manager: Unknown message from SW:', event.data);
            }
        });
    }

    /**
     * Setup network status monitoring
     */
    setupNetworkMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.handleNetworkChange(true);
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.handleNetworkChange(false);
        });
        
        // Initial network status
        this.handleNetworkChange(this.isOnline);
    }

    /**
     * Handle network status changes
     */
    handleNetworkChange(isOnline) {
        console.log('PWA Manager: Network status changed:', isOnline ? 'online' : 'offline');
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('networkStatusChange', {
            detail: { isOnline }
        }));
        
        // Update UI
        this.updateNetworkStatusUI(isOnline);
        
        // Trigger background sync when coming back online
        if (isOnline && this.backgroundSyncSupported) {
            this.requestBackgroundSync('background-rate-sync');
        }
    }

    /**
     * Update network status UI
     */
    updateNetworkStatusUI(isOnline) {
        const statusIndicator = document.getElementById('network-status');
        
        if (!statusIndicator) {
            // Create network status indicator
            const indicator = document.createElement('div');
            indicator.id = 'network-status';
            indicator.className = 'network-status';
            document.body.appendChild(indicator);
        }
        
        const indicator = document.getElementById('network-status');
        indicator.className = `network-status ${isOnline ? 'online' : 'offline'}`;
        indicator.textContent = isOnline ? 'Online' : 'Offline';
        
        // Auto-hide after 3 seconds when online
        if (isOnline) {
            setTimeout(() => {
                indicator.style.opacity = '0';
            }, 3000);
        } else {
            indicator.style.opacity = '1';
        }
    }

    /**
     * Setup app installation
     */
    setupAppInstallation() {
        window.addEventListener('beforeinstallprompt', (event) => {
            console.log('PWA Manager: Install prompt available');
            
            // Prevent the mini-infobar from appearing
            event.preventDefault();
            
            // Store the event for later use
            this.installPrompt = event;
            
            // Show custom install button
            this.showInstallButton();
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('PWA Manager: App installed successfully');
            this.hideInstallButton();
            this.installPrompt = null;
            
            // Track installation
            this.trackEvent('app_installed');
        });
    }

    /**
     * Show install button
     */
    showInstallButton() {
        let installButton = document.getElementById('install-app-btn');
        
        if (!installButton) {
            installButton = document.createElement('button');
            installButton.id = 'install-app-btn';
            installButton.className = 'install-button';
            installButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Install App
            `;
            installButton.addEventListener('click', () => this.promptInstall());
            
            // Add to header or create floating button
            const header = document.querySelector('.app-header');
            if (header) {
                header.appendChild(installButton);
            } else {
                installButton.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 1000;
                `;
                document.body.appendChild(installButton);
            }
        }
        
        installButton.style.display = 'flex';
    }

    /**
     * Hide install button
     */
    hideInstallButton() {
        const installButton = document.getElementById('install-app-btn');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }

    /**
     * Prompt app installation
     */
    async promptInstall() {
        if (!this.installPrompt) {
            console.warn('PWA Manager: Install prompt not available');
            return;
        }
        
        try {
            // Show the install prompt
            this.installPrompt.prompt();
            
            // Wait for user response
            const result = await this.installPrompt.userChoice;
            
            console.log('PWA Manager: Install prompt result:', result.outcome);
            
            if (result.outcome === 'accepted') {
                this.trackEvent('install_accepted');
            } else {
                this.trackEvent('install_dismissed');
            }
            
            // Clear the prompt
            this.installPrompt = null;
            this.hideInstallButton();
            
        } catch (error) {
            console.error('PWA Manager: Install prompt failed:', error);
        }
    }

    /**
     * Setup background sync
     */
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            this.backgroundSyncSupported = true;
            console.log('PWA Manager: Background Sync supported');
            
            // Register for background sync when rates need updating
            this.setupPeriodicSync();
        } else {
            console.warn('PWA Manager: Background Sync not supported');
        }
    }

    /**
     * Setup periodic sync for rate updates
     */
    setupPeriodicSync() {
        // Request background sync every 15 minutes when app is not active
        setInterval(() => {
            if (document.hidden && this.isOnline) {
                this.requestBackgroundSync('background-rate-sync');
            }
        }, 15 * 60 * 1000); // 15 minutes
        
        // Also sync when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isOnline) {
                this.requestBackgroundSync('background-rate-sync');
            }
        });
    }

    /**
     * Request background sync
     */
    async requestBackgroundSync(tag) {
        if (!this.registration || !this.backgroundSyncSupported) {
            return;
        }
        
        try {
            await this.registration.sync.register(tag);
            console.log('PWA Manager: Background sync registered:', tag);
        } catch (error) {
            console.error('PWA Manager: Background sync registration failed:', error);
        }
    }

    /**
     * Handle background rate update
     */
    handleBackgroundRateUpdate(data) {
        console.log('PWA Manager: Background rate update received');
        
        // Dispatch event to update UI
        document.dispatchEvent(new CustomEvent('backgroundRateUpdate', {
            detail: { rates: data, timestamp: Date.now() }
        }));
        
        // Show notification if app is not visible
        if (document.hidden) {
            this.showRateUpdateNotification();
        }
    }

    /**
     * Setup push notifications
     */
    setupPushNotifications() {
        if ('PushManager' in window && 'Notification' in window) {
            this.pushSupported = true;
            console.log('PWA Manager: Push notifications supported');
        } else {
            console.warn('PWA Manager: Push notifications not supported');
        }
    }

    /**
     * Request notification permission
     */
    async requestNotificationPermission() {
        if (!this.pushSupported) {
            return false;
        }
        
        try {
            const permission = await Notification.requestPermission();
            console.log('PWA Manager: Notification permission:', permission);
            
            if (permission === 'granted') {
                this.trackEvent('notifications_enabled');
                return true;
            } else {
                this.trackEvent('notifications_denied');
                return false;
            }
        } catch (error) {
            console.error('PWA Manager: Notification permission request failed:', error);
            return false;
        }
    }

    /**
     * Show rate update notification
     */
    showRateUpdateNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Bitcoin Rates Updated', {
                body: 'Latest exchange rates are now available',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                tag: 'rate-update',
                renotify: false,
                silent: true
            });
        }
    }

    /**
     * Setup update checking
     */
    setupUpdateChecking() {
        // Check for updates every hour
        setInterval(() => {
            this.checkForUpdates();
        }, 60 * 60 * 1000); // 1 hour
        
        // Check for updates when app becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkForUpdates();
            }
        });
    }

    /**
     * Check for app updates
     */
    async checkForUpdates() {
        if (!this.registration) {
            return;
        }
        
        try {
            await this.registration.update();
            console.log('PWA Manager: Update check completed');
        } catch (error) {
            console.error('PWA Manager: Update check failed:', error);
        }
    }

    /**
     * Handle service worker update
     */
    handleServiceWorkerUpdate() {
        const newWorker = this.registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('PWA Manager: New version available');
                this.updateAvailable = true;
                this.showUpdateNotification();
            }
        });
    }

    /**
     * Show update notification
     */
    showUpdateNotification() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'update-banner';
        updateBanner.innerHTML = `
            <div class="update-content">
                <span>A new version is available!</span>
                <button class="update-btn" onclick="window.pwaManager.applyUpdate()">
                    Update Now
                </button>
                <button class="dismiss-btn" onclick="this.parentElement.parentElement.remove()">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(updateBanner);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (updateBanner.parentElement) {
                updateBanner.remove();
            }
        }, 10000);
    }

    /**
     * Apply available update
     */
    async applyUpdate() {
        if (!this.registration || !this.updateAvailable) {
            return;
        }
        
        try {
            // Skip waiting and activate new service worker
            if (this.registration.waiting) {
                this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            
            // Reload the page to use new version
            window.location.reload();
            
        } catch (error) {
            console.error('PWA Manager: Update application failed:', error);
        }
    }

    /**
     * Handle cache update
     */
    handleCacheUpdate(data) {
        console.log('PWA Manager: Cache updated:', data);
        
        // Dispatch event for other modules
        document.dispatchEvent(new CustomEvent('cacheUpdate', {
            detail: data
        }));
    }

    /**
     * Handle offline ready
     */
    handleOfflineReady() {
        console.log('PWA Manager: App ready for offline use');
        
        // Show offline ready notification
        this.showOfflineReadyNotification();
    }

    /**
     * Show offline ready notification
     */
    showOfflineReadyNotification() {
        const notification = document.createElement('div');
        notification.className = 'offline-ready-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                App ready for offline use
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    /**
     * Track events for analytics
     */
    trackEvent(eventName, data = {}) {
        console.log('PWA Manager: Event tracked:', eventName, data);
        
        // Dispatch custom event for analytics
        document.dispatchEvent(new CustomEvent('pwaEvent', {
            detail: { event: eventName, data, timestamp: Date.now() }
        }));
    }

    /**
     * Get PWA status
     */
    getStatus() {
        return {
            serviceWorkerSupported: 'serviceWorker' in navigator,
            serviceWorkerRegistered: !!this.registration,
            backgroundSyncSupported: this.backgroundSyncSupported,
            pushSupported: this.pushSupported,
            isOnline: this.isOnline,
            updateAvailable: this.updateAvailable,
            installPromptAvailable: !!this.installPrompt,
            notificationPermission: Notification.permission
        };
    }

    /**
     * Unregister service worker (for development)
     */
    async unregister() {
        if (this.registration) {
            const result = await this.registration.unregister();
            console.log('PWA Manager: Service worker unregistered:', result);
            return result;
        }
        return false;
    }

    /**
     * Clear all caches (for development)
     */
    async clearCaches() {
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames.map(name => caches.delete(name));
        await Promise.all(deletePromises);
        console.log('PWA Manager: All caches cleared');
    }

    /**
     * Destroy PWA manager
     */
    destroy() {
        // Remove event listeners
        window.removeEventListener('online', this.handleNetworkChange);
        window.removeEventListener('offline', this.handleNetworkChange);
        
        console.log('PWA Manager: Destroyed');
    }
}

export default PWAManager;