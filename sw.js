/**
 * Service Worker for Bitcoin Exchange Rates PWA
 * Provides offline functionality, caching, and background sync
 */

const CACHE_NAME = 'bitcoin-rates-v1.0.0';
const STATIC_CACHE = 'bitcoin-rates-static-v1.0.0';
const DYNAMIC_CACHE = 'bitcoin-rates-dynamic-v1.0.0';
const API_CACHE = 'bitcoin-rates-api-v1.0.0';

// Static assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/script.js',
    '/styles.css',
    '/src/styles/main.css',
    '/src/styles/variables.css',
    '/src/styles/base.css',
    '/src/styles/components.css',
    '/src/styles/layout.css',
    '/src/styles/themes.css',
    '/src/styles/accessibility.css',
    '/src/styles/mobile.css',
    '/src/styles/performance.css',
    '/src/modules/utils/app-initializer.js',
    '/src/modules/utils/performance-optimizer.js',
    '/src/modules/data/currency-config.js',
    '/src/modules/features/preferences.js',
    '/src/modules/features/favorites.js',
    '/src/modules/features/search.js'
];

// API endpoints to cache
const API_ENDPOINTS = [
    'https://api.coingecko.com/api/v3/simple/price',
    'https://api.coindesk.com/v1/bpi/currentprice.json'
];

// Cache strategies
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
    NETWORK_ONLY: 'network-only',
    CACHE_ONLY: 'cache-only'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            self.skipWaiting()
        ])
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== API_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim()
        ])
    );
});

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isStaticAsset(request)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isAPIRequest(request)) {
        event.respondWith(handleAPIRequest(request));
    } else if (isNavigationRequest(request)) {
        event.respondWith(handleNavigationRequest(request));
    } else {
        event.respondWith(handleDynamicRequest(request));
    }
});

// Background sync for rate updates
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'background-rate-sync') {
        event.waitUntil(syncRatesInBackground());
    }
});

// Push notifications (for future enhancement)
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Bitcoin rates updated',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Rates',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Bitcoin Exchange Rates', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

/**
 * Check if request is for a static asset
 */
function isStaticAsset(request) {
    const url = new URL(request.url);
    return STATIC_ASSETS.some(asset => url.pathname.endsWith(asset)) ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.html');
}

/**
 * Check if request is for an API endpoint
 */
function isAPIRequest(request) {
    const url = new URL(request.url);
    return API_ENDPOINTS.some(endpoint => request.url.includes(endpoint)) ||
           url.hostname.includes('coingecko.com') ||
           url.hostname.includes('coindesk.com');
}

/**
 * Check if request is a navigation request
 */
function isNavigationRequest(request) {
    return request.mode === 'navigate';
}

/**
 * Handle static asset requests (Cache First strategy)
 */
async function handleStaticAsset(request) {
    try {
        const cache = await caches.open(STATIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Service Worker: Error handling static asset:', error);
        return new Response('Offline - Asset not available', { status: 503 });
    }
}

/**
 * Handle API requests (Stale While Revalidate strategy)
 */
async function handleAPIRequest(request) {
    try {
        const cache = await caches.open(API_CACHE);
        const cachedResponse = await cache.match(request);
        
        // Return cached response immediately if available
        const responsePromise = cachedResponse || fetch(request).then(response => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
            return response;
        });
        
        // Update cache in background
        if (cachedResponse) {
            fetch(request).then(response => {
                if (response.ok) {
                    cache.put(request, response.clone());
                }
            }).catch(error => {
                console.log('Service Worker: Background update failed:', error);
            });
        }
        
        return responsePromise;
    } catch (error) {
        console.error('Service Worker: Error handling API request:', error);
        
        // Return fallback data if available
        return createFallbackResponse();
    }
}

/**
 * Handle navigation requests (Network First strategy)
 */
async function handleNavigationRequest(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache');
        
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page
        return caches.match('/index.html');
    }
}

/**
 * Handle dynamic requests (Network First strategy)
 */
async function handleDynamicRequest(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('Offline - Content not available', { status: 503 });
    }
}

/**
 * Create fallback response for API failures
 */
function createFallbackResponse() {
    const fallbackData = {
        bitcoin: {
            usd: 43000,
            eur: 39000,
            gbp: 34000,
            jpy: 6400000,
            aud: 65000,
            cad: 58000,
            chf: 38000,
            cny: 310000,
            sek: 460000,
            nzd: 71000,
            mxn: 740000,
            sgd: 58000,
            hkd: 340000,
            nok: 470000,
            try: 1480000,
            zar: 780000,
            brl: 220000,
            inr: 3600000,
            krw: 57000000,
            twd: 1390000
        }
    };
    
    return new Response(JSON.stringify(fallbackData), {
        status: 200,
        statusText: 'OK (Cached)',
        headers: {
            'Content-Type': 'application/json',
            'X-Cache-Status': 'FALLBACK'
        }
    });
}

/**
 * Sync rates in background
 */
async function syncRatesInBackground() {
    console.log('Service Worker: Syncing rates in background');
    
    try {
        const currencies = 'usd,eur,gbp,jpy,aud,cad,chf,cny,sek,nzd,mxn,sgd,hkd,nok,try,zar,brl,inr,krw,twd';
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currencies}`);
        
        if (response.ok) {
            const data = await response.json();
            
            // Cache the updated data
            const cache = await caches.open(API_CACHE);
            cache.put(
                `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currencies}`,
                new Response(JSON.stringify(data))
            );
            
            // Notify all clients about the update
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'RATES_UPDATED',
                    data: data.bitcoin,
                    timestamp: Date.now()
                });
            });
            
            console.log('Service Worker: Background sync completed successfully');
        }
    } catch (error) {
        console.error('Service Worker: Background sync failed:', error);
    }
}

/**
 * Clean up old cache entries
 */
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        name.startsWith('bitcoin-rates-') && 
        name !== STATIC_CACHE && 
        name !== DYNAMIC_CACHE && 
        name !== API_CACHE
    );
    
    return Promise.all(oldCaches.map(name => caches.delete(name)));
}

/**
 * Preload critical resources
 */
async function preloadCriticalResources() {
    const cache = await caches.open(STATIC_CACHE);
    
    const criticalResources = [
        '/src/modules/data/currency-config.js',
        '/src/modules/utils/app-initializer.js'
    ];
    
    return Promise.all(
        criticalResources.map(resource => 
            fetch(resource).then(response => {
                if (response.ok) {
                    cache.put(resource, response);
                }
            }).catch(error => {
                console.warn('Failed to preload:', resource, error);
            })
        )
    );
}

// Periodic cleanup
setInterval(cleanupOldCaches, 24 * 60 * 60 * 1000); // Daily cleanup