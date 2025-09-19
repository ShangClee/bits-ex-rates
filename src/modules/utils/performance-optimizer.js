/**
 * Performance Optimizer Module
 * Implements lazy loading, virtual scrolling, image optimization, and performance monitoring
 */

class PerformanceOptimizer {
    constructor() {
        this.lazyLoadObserver = null;
        this.virtualScrollContainer = null;
        this.performanceMetrics = {
            loadTime: 0,
            renderTime: 0,
            memoryUsage: 0,
            apiResponseTime: 0,
            frameRate: 0
        };
        this.frameCount = 0;
        this.lastFrameTime = performance.now();
        this.isMonitoring = false;
        
        this.init();
    }

    /**
     * Initialize performance optimizations
     */
    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupPerformanceMonitoring();
        this.optimizeCSS();
        this.setupMemoryManagement();
        
        console.log('Performance Optimizer initialized');
    }

    /**
     * Setup lazy loading for non-critical features
     */
    setupLazyLoading() {
        // Create intersection observer for lazy loading
        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadLazyElement(entry.target);
                    this.lazyLoadObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Mark elements for lazy loading
        this.markLazyElements();
        
        // Lazy load feature modules
        this.setupLazyModuleLoading();
    }

    /**
     * Mark elements for lazy loading
     */
    markLazyElements() {
        // Mark non-critical UI elements
        const nonCriticalElements = [
            '.settings-panel',
            '.favorites-section',
            '.search-section',
            '.comparison-panel',
            '.statistics-panel'
        ];

        nonCriticalElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('lazy-load');
                element.style.visibility = 'hidden';
                this.lazyLoadObserver.observe(element);
            });
        });
    }

    /**
     * Load lazy element when it becomes visible
     */
    loadLazyElement(element) {
        // Add loading animation
        element.style.opacity = '0';
        element.style.visibility = 'visible';
        element.style.transition = 'opacity 0.3s ease-in-out';
        
        // Trigger reflow and show element
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });

        // Remove lazy load class
        element.classList.remove('lazy-load');
    }

    /**
     * Setup lazy module loading
     */
    setupLazyModuleLoading() {
        // Delay non-critical module initialization
        const lazyModules = [
            'sharing',
            'data-visualization',
            'demo'
        ];

        // Load modules after initial render
        requestIdleCallback(() => {
            lazyModules.forEach(moduleName => {
                this.loadModuleLazily(moduleName);
            });
        }, { timeout: 2000 });
    }

    /**
     * Load module lazily
     */
    async loadModuleLazily(moduleName) {
        try {
            const startTime = performance.now();
            
            switch (moduleName) {
                case 'sharing':
                    const { default: SharingManager } = await import('../features/sharing.js');
                    window.sharingManager = new SharingManager();
                    break;
                case 'data-visualization':
                    const { default: DataVisualizationManager } = await import('../features/data-visualization.js');
                    window.dataVisualizationManager = new DataVisualizationManager();
                    break;
                case 'demo':
                    const { default: DemoManager } = await import('../features/demo.js');
                    window.demoManager = new DemoManager();
                    break;
            }
            
            const loadTime = performance.now() - startTime;
            console.log(`Lazy loaded ${moduleName} in ${loadTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.warn(`Failed to lazy load ${moduleName}:`, error);
        }
    }

    /**
     * Setup image optimization for flag icons
     */
    setupImageOptimization() {
        // Create optimized flag icon system
        this.createOptimizedFlagSystem();
        
        // Setup responsive image loading
        this.setupResponsiveImages();
        
        // Preload critical images
        this.preloadCriticalImages();
    }

    /**
     * Create optimized flag icon system
     */
    createOptimizedFlagSystem() {
        // Create CSS-based flag system to replace emoji flags
        const flagStyles = document.createElement('style');
        flagStyles.textContent = `
            .flag-icon {
                display: inline-block;
                width: 20px;
                height: 15px;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                border-radius: 2px;
                flex-shrink: 0;
            }
            
            .flag-icon--usd { background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAyMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjQjIyMjM0Ii8+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxLjE1IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'); }
            .flag-icon--eur { background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAyMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjMDAzNDk5Ii8+Cjwvc3ZnPgo='); }
            .flag-icon--gbp { background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAyMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjMDEyMTY5Ii8+Cjwvc3ZnPgo='); }
            
            /* Fallback to emoji for unsupported flags */
            .flag-emoji {
                font-size: 16px;
                line-height: 1;
                display: inline-block;
                width: 20px;
                text-align: center;
            }
        `;
        document.head.appendChild(flagStyles);
    }

    /**
     * Setup responsive image loading
     */
    setupResponsiveImages() {
        // Use CSS to handle different screen densities
        const responsiveStyles = document.createElement('style');
        responsiveStyles.textContent = `
            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                .flag-icon {
                    background-size: 20px 15px;
                }
            }
            
            @media (max-width: 640px) {
                .flag-icon {
                    width: 18px;
                    height: 13px;
                }
            }
        `;
        document.head.appendChild(responsiveStyles);
    }

    /**
     * Preload critical images
     */
    preloadCriticalImages() {
        const criticalFlags = ['usd', 'eur', 'gbp', 'jpy', 'btc'];
        
        criticalFlags.forEach(flag => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = this.getFlagImageUrl(flag);
            document.head.appendChild(link);
        });
    }

    /**
     * Get optimized flag image URL
     */
    getFlagImageUrl(currencyCode) {
        // Return optimized SVG data URLs for common currencies
        const flagMap = {
            'usd': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAyMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjQjIyMjM0Ii8+PC9zdmc+',
            'eur': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAyMCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjMDAzNDk5Ii8+PC9zdmc+'
        };
        
        return flagMap[currencyCode] || '';
    }

    /**
     * Implement virtual scrolling for large currency lists
     */
    setupVirtualScrolling(container, items, itemHeight = 80) {
        if (!container || !items.length) return;

        const containerHeight = container.clientHeight;
        const visibleItems = Math.ceil(containerHeight / itemHeight) + 2; // Buffer items
        const totalHeight = items.length * itemHeight;

        // Create virtual scroll container
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'virtual-scroll-container';
        scrollContainer.style.cssText = `
            height: ${totalHeight}px;
            position: relative;
            overflow: hidden;
        `;

        const viewport = document.createElement('div');
        viewport.className = 'virtual-scroll-viewport';
        viewport.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            will-change: transform;
        `;

        let startIndex = 0;
        let endIndex = Math.min(visibleItems, items.length);

        const renderItems = () => {
            const fragment = document.createDocumentFragment();
            
            for (let i = startIndex; i < endIndex; i++) {
                const item = items[i];
                const element = this.createVirtualItem(item, i, itemHeight);
                fragment.appendChild(element);
            }
            
            viewport.innerHTML = '';
            viewport.appendChild(fragment);
            viewport.style.transform = `translateY(${startIndex * itemHeight}px)`;
        };

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const newStartIndex = Math.floor(scrollTop / itemHeight);
            const newEndIndex = Math.min(newStartIndex + visibleItems, items.length);

            if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
                startIndex = newStartIndex;
                endIndex = newEndIndex;
                
                requestAnimationFrame(renderItems);
            }
        };

        // Setup scroll listener with throttling
        let scrollTimeout;
        container.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = requestAnimationFrame(() => {
                handleScroll();
                scrollTimeout = null;
            });
        });

        scrollContainer.appendChild(viewport);
        container.appendChild(scrollContainer);
        
        // Initial render
        renderItems();
        
        this.virtualScrollContainer = {
            container: scrollContainer,
            viewport,
            items,
            itemHeight,
            renderItems,
            handleScroll
        };

        return this.virtualScrollContainer;
    }

    /**
     * Create virtual scroll item
     */
    createVirtualItem(item, index, height) {
        const element = document.createElement('div');
        element.className = 'virtual-item rate-card';
        element.style.cssText = `
            height: ${height}px;
            position: absolute;
            top: ${index * height}px;
            left: 0;
            right: 0;
            box-sizing: border-box;
        `;
        
        // Render item content based on type
        if (item.currency && item.rate) {
            element.innerHTML = this.createRateCardHTML(item);
        }
        
        return element;
    }

    /**
     * Create rate card HTML for virtual scrolling
     */
    createRateCardHTML(item) {
        const { currency, rate, type } = item;
        
        return `
            <div class="currency-info">
                <span class="flag-emoji">${currency.flag}</span>
                <div>
                    <div class="currency-name">${currency.name}</div>
                    <div class="currency-code">${currency.code.toUpperCase()}</div>
                </div>
            </div>
            <div class="rate-value">
                ${currency.symbol}${rate.toLocaleString()}
            </div>
        `;
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        this.monitorPageLoad();
        this.monitorRenderPerformance();
        this.monitorMemoryUsage();
        this.monitorFrameRate();
        this.monitorAPIPerformance();
        
        // Start monitoring
        this.startMonitoring();
    }

    /**
     * Monitor page load performance
     */
    monitorPageLoad() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.performanceMetrics.loadTime = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.fetchStart,
                firstPaint: this.getFirstPaint(),
                firstContentfulPaint: this.getFirstContentfulPaint()
            };
            
            this.reportPerformanceMetrics('page-load', this.performanceMetrics.loadTime);
        });
    }

    /**
     * Get First Paint timing
     */
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : 0;
    }

    /**
     * Get First Contentful Paint timing
     */
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : 0;
    }

    /**
     * Monitor render performance
     */
    monitorRenderPerformance() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.entryType === 'measure') {
                    this.performanceMetrics.renderTime = entry.duration;
                    this.reportPerformanceMetrics('render', entry);
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }

    /**
     * Monitor memory usage
     */
    monitorMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.performanceMetrics.memoryUsage = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit,
                    percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
                };
                
                // Warn if memory usage is high
                if (this.performanceMetrics.memoryUsage.percentage > 80) {
                    console.warn('High memory usage detected:', this.performanceMetrics.memoryUsage);
                    this.triggerMemoryCleanup();
                }
            }, 10000); // Check every 10 seconds
        }
    }

    /**
     * Monitor frame rate
     */
    monitorFrameRate() {
        const measureFrameRate = (timestamp) => {
            this.frameCount++;
            
            if (timestamp - this.lastFrameTime >= 1000) {
                this.performanceMetrics.frameRate = this.frameCount;
                this.frameCount = 0;
                this.lastFrameTime = timestamp;
                
                // Warn if frame rate is low
                if (this.performanceMetrics.frameRate < 30) {
                    console.warn('Low frame rate detected:', this.performanceMetrics.frameRate);
                }
            }
            
            if (this.isMonitoring) {
                requestAnimationFrame(measureFrameRate);
            }
        };
        
        requestAnimationFrame(measureFrameRate);
    }

    /**
     * Monitor API performance
     */
    monitorAPIPerformance() {
        // Intercept fetch requests to monitor API performance
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const startTime = performance.now();
            
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                this.performanceMetrics.apiResponseTime = duration;
                this.reportPerformanceMetrics('api', {
                    url: args[0],
                    duration,
                    status: response.status,
                    ok: response.ok
                });
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                this.reportPerformanceMetrics('api-error', {
                    url: args[0],
                    duration,
                    error: error.message
                });
                
                throw error;
            }
        };
    }

    /**
     * Optimize CSS performance
     */
    optimizeCSS() {
        // Add CSS optimizations
        const optimizationStyles = document.createElement('style');
        optimizationStyles.textContent = `
            /* Performance optimizations */
            .rate-card {
                contain: layout style paint;
                will-change: transform;
            }
            
            .rate-card:hover {
                transform: translateZ(0) translateY(-2px);
            }
            
            /* Reduce paint complexity */
            .currency-flag,
            .flag-icon,
            .flag-emoji {
                contain: strict;
            }
            
            /* Optimize animations */
            @media (prefers-reduced-motion: no-preference) {
                .rate-card {
                    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
            }
            
            /* Virtual scrolling optimizations */
            .virtual-scroll-container {
                contain: strict;
                overflow: hidden;
            }
            
            .virtual-scroll-viewport {
                contain: layout style paint;
                will-change: transform;
            }
            
            .virtual-item {
                contain: layout style paint;
            }
        `;
        document.head.appendChild(optimizationStyles);
    }

    /**
     * Setup memory management
     */
    setupMemoryManagement() {
        // Clean up unused resources periodically
        setInterval(() => {
            this.cleanupUnusedResources();
        }, 30000); // Every 30 seconds
        
        // Clean up on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanupUnusedResources();
            }
        });
    }

    /**
     * Clean up unused resources
     */
    cleanupUnusedResources() {
        // Remove unused DOM elements
        const unusedElements = document.querySelectorAll('.rate-card[data-unused="true"]');
        unusedElements.forEach(element => element.remove());
        
        // Clear old performance entries
        if (performance.clearResourceTimings) {
            performance.clearResourceTimings();
        }
        
        // Trigger garbage collection if available
        if (window.gc && typeof window.gc === 'function') {
            window.gc();
        }
    }

    /**
     * Trigger memory cleanup
     */
    triggerMemoryCleanup() {
        // Force cleanup of large objects
        this.cleanupUnusedResources();
        
        // Clear caches if available
        if (window.caches) {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (name.includes('old-') || name.includes('temp-')) {
                        caches.delete(name);
                    }
                });
            });
        }
        
        // Notify other modules to clean up
        document.dispatchEvent(new CustomEvent('memoryCleanup'));
    }

    /**
     * Start performance monitoring
     */
    startMonitoring() {
        this.isMonitoring = true;
        console.log('Performance monitoring started');
    }

    /**
     * Stop performance monitoring
     */
    stopMonitoring() {
        this.isMonitoring = false;
        console.log('Performance monitoring stopped');
    }

    /**
     * Report performance metrics
     */
    reportPerformanceMetrics(type, data) {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`Performance [${type}]:`, data);
        }
        
        // Dispatch event for external monitoring
        document.dispatchEvent(new CustomEvent('performanceMetric', {
            detail: { type, data, timestamp: Date.now() }
        }));
    }

    /**
     * Get current performance metrics
     */
    getMetrics() {
        return {
            ...this.performanceMetrics,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : null
        };
    }

    /**
     * Optimize for specific device types
     */
    optimizeForDevice() {
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                        (navigator.connection && navigator.connection.effectiveType === 'slow-2g');
        
        if (isMobile || isLowEnd) {
            // Reduce animations
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
            
            // Reduce visual effects
            document.body.classList.add('reduced-effects');
            
            // Increase lazy loading threshold
            if (this.lazyLoadObserver) {
                this.lazyLoadObserver.disconnect();
                this.lazyLoadObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadLazyElement(entry.target);
                            this.lazyLoadObserver.unobserve(entry.target);
                        }
                    });
                }, {
                    rootMargin: '20px 0px', // Smaller margin for low-end devices
                    threshold: 0.1
                });
            }
        }
    }

    /**
     * Destroy performance optimizer
     */
    destroy() {
        this.stopMonitoring();
        
        if (this.lazyLoadObserver) {
            this.lazyLoadObserver.disconnect();
        }
        
        // Restore original fetch
        if (window.fetch.original) {
            window.fetch = window.fetch.original;
        }
        
        console.log('Performance Optimizer destroyed');
    }
}

export default PerformanceOptimizer;