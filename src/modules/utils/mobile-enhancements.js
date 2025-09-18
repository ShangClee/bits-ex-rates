/**
 * Mobile Enhancements Module
 * Provides touch-friendly interactions, swipe gestures, and mobile-optimized UX
 */

class MobileEnhancementsManager {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.swipeThreshold = 50;
        this.isTouch = false;
        this.orientation = window.orientation || 0;
        this.init();
    }

    /**
     * Initialize mobile enhancements
     */
    init() {
        this.detectTouchDevice();
        this.setupSwipeGestures();
        this.setupTouchInteractions();
        this.setupOrientationHandling();
        this.setupViewportHandling();
        this.setupCollapsibleSections();
        this.optimizeForMobile();
    }

    /**
     * Detect if device supports touch
     */
    detectTouchDevice() {
        this.isTouch = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 || 
                      navigator.msMaxTouchPoints > 0;

        if (this.isTouch) {
            document.body.classList.add('touch-device');
        }
    }

    /**
     * Setup swipe gestures for tab navigation
     */
    setupSwipeGestures() {
        const mainContent = document.getElementById('main-content') || document.body;

        // Touch start
        mainContent.addEventListener('touchstart', (event) => {
            this.touchStartX = event.changedTouches[0].screenX;
            this.touchStartY = event.changedTouches[0].screenY;
        }, { passive: true });

        // Touch end
        mainContent.addEventListener('touchend', (event) => {
            this.touchEndX = event.changedTouches[0].screenX;
            this.touchEndY = event.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });

        // Prevent default touch behaviors on specific elements
        this.setupTouchPrevention();
    }

    /**
     * Handle swipe gestures
     */
    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Only process horizontal swipes that are longer than vertical
        if (absDeltaX < this.swipeThreshold || absDeltaX < absDeltaY) {
            return;
        }

        // Determine swipe direction and handle tab switching
        if (deltaX > 0) {
            // Swipe right - previous tab
            this.switchToPreviousTab();
        } else {
            // Swipe left - next tab
            this.switchToNextTab();
        }
    }

    /**
     * Switch to previous tab
     */
    switchToPreviousTab() {
        const currentTab = this.getCurrentActiveTab();
        const tabs = ['btc', 'bts', 'sts'];
        const currentIndex = tabs.indexOf(currentTab);
        
        if (currentIndex > 0) {
            const previousTab = tabs[currentIndex - 1];
            if (typeof window.showMainTab === 'function') {
                window.showMainTab(previousTab);
                this.announceTabSwitch(previousTab, 'previous');
            }
        }
    }

    /**
     * Switch to next tab
     */
    switchToNextTab() {
        const currentTab = this.getCurrentActiveTab();
        const tabs = ['btc', 'bts', 'sts'];
        const currentIndex = tabs.indexOf(currentTab);
        
        if (currentIndex < tabs.length - 1) {
            const nextTab = tabs[currentIndex + 1];
            if (typeof window.showMainTab === 'function') {
                window.showMainTab(nextTab);
                this.announceTabSwitch(nextTab, 'next');
            }
        }
    }

    /**
     * Get currently active tab
     * @returns {string} - Active tab ID
     */
    getCurrentActiveTab() {
        const activeTabButton = document.querySelector('.main-tab-btn.active');
        if (activeTabButton) {
            const onclick = activeTabButton.getAttribute('onclick');
            const match = onclick.match(/showMainTab\('(\w+)'\)/);
            return match ? match[1] : 'bts';
        }
        return 'bts'; // Default
    }

    /**
     * Announce tab switch for accessibility
     * @param {string} tabId - New tab ID
     * @param {string} direction - Swipe direction
     */
    announceTabSwitch(tabId, direction) {
        if (window.accessibilityManager) {
            const tabNames = { btc: 'Bitcoin', bts: 'BITS', sts: 'Satoshi' };
            const tabName = tabNames[tabId] || tabId.toUpperCase();
            window.accessibilityManager.announce(`Swiped to ${tabName} tab`);
        }

        // Visual feedback
        this.showSwipeIndicator(direction);
    }

    /**
     * Show visual feedback for swipe gesture
     * @param {string} direction - Swipe direction
     */
    showSwipeIndicator(direction) {
        const indicator = document.createElement('div');
        indicator.className = 'swipe-indicator';
        indicator.textContent = direction === 'next' ? '→' : '←';
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            ${direction === 'next' ? 'right' : 'left'}: 20px;
            transform: translateY(-50%);
            background: var(--color-primary);
            color: white;
            padding: 10px 15px;
            border-radius: 50%;
            font-size: 20px;
            z-index: 1000;
            animation: swipeIndicator 0.5s ease-out;
            pointer-events: none;
        `;

        document.body.appendChild(indicator);

        // Remove after animation
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 500);
    }

    /**
     * Setup touch interactions for better mobile UX
     */
    setupTouchInteractions() {
        // Add touch feedback to interactive elements
        this.addTouchFeedback('.rate-card');
        this.addTouchFeedback('.btn');
        this.addTouchFeedback('.main-tab-btn');
        this.addTouchFeedback('.nav-btn');

        // Improve touch targets
        this.improveTouchTargets();
    }

    /**
     * Add touch feedback to elements
     * @param {string} selector - CSS selector
     */
    addTouchFeedback(selector) {
        document.addEventListener('touchstart', (event) => {
            if (event.target.matches(selector) || event.target.closest(selector)) {
                const element = event.target.matches(selector) ? event.target : event.target.closest(selector);
                element.classList.add('touch-active');
            }
        }, { passive: true });

        document.addEventListener('touchend', (event) => {
            if (event.target.matches(selector) || event.target.closest(selector)) {
                const element = event.target.matches(selector) ? event.target : event.target.closest(selector);
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            }
        }, { passive: true });

        document.addEventListener('touchcancel', (event) => {
            if (event.target.matches(selector) || event.target.closest(selector)) {
                const element = event.target.matches(selector) ? event.target : event.target.closest(selector);
                element.classList.remove('touch-active');
            }
        }, { passive: true });
    }

    /**
     * Improve touch targets for better accessibility
     */
    improveTouchTargets() {
        const minTouchSize = 44; // 44px minimum touch target

        const elements = document.querySelectorAll('button, .btn, .rate-card, [role="button"]');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.width < minTouchSize || rect.height < minTouchSize) {
                element.style.minWidth = `${minTouchSize}px`;
                element.style.minHeight = `${minTouchSize}px`;
                element.classList.add('enhanced-touch-target');
            }
        });
    }

    /**
     * Setup orientation change handling
     */
    setupOrientationHandling() {
        const handleOrientationChange = () => {
            const newOrientation = window.orientation || 0;
            
            // Add orientation class
            document.body.classList.remove('portrait', 'landscape');
            if (Math.abs(newOrientation) === 90) {
                document.body.classList.add('landscape');
            } else {
                document.body.classList.add('portrait');
            }

            // Adjust layout for landscape on mobile
            this.adjustForLandscape();
            
            // Update viewport handling
            setTimeout(() => {
                this.handleViewportResize();
            }, 100);
        };

        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);
        
        // Initial setup
        handleOrientationChange();
    }

    /**
     * Adjust layout for landscape orientation
     */
    adjustForLandscape() {
        const isLandscape = Math.abs(window.orientation || 0) === 90;
        const isSmallScreen = window.innerHeight < 500;

        if (isLandscape && isSmallScreen) {
            document.body.classList.add('landscape-compact');
            
            // Reduce header padding
            const header = document.querySelector('.app-header');
            if (header) {
                header.style.padding = 'var(--space-md) 0';
            }

            // Make tabs more compact
            const tabs = document.querySelectorAll('.main-tab-btn');
            tabs.forEach(tab => {
                tab.style.padding = 'var(--space-sm) var(--space-md)';
                tab.style.fontSize = 'var(--font-size-sm)';
            });

            // Reduce spacing in navigation
            const navigation = document.querySelectorAll('.navigation');
            navigation.forEach(nav => {
                nav.style.marginBottom = 'var(--space-md)';
            });
        } else {
            document.body.classList.remove('landscape-compact');
            
            // Reset styles
            const header = document.querySelector('.app-header');
            if (header) {
                header.style.padding = '';
            }

            const tabs = document.querySelectorAll('.main-tab-btn');
            tabs.forEach(tab => {
                tab.style.padding = '';
                tab.style.fontSize = '';
            });

            const navigation = document.querySelectorAll('.navigation');
            navigation.forEach(nav => {
                nav.style.marginBottom = '';
            });
        }
    }

    /**
     * Setup viewport handling for mobile browsers
     */
    setupViewportHandling() {
        // Handle viewport height changes (mobile browser address bar)
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        window.addEventListener('resize', setViewportHeight);
        setViewportHeight();

        // Handle safe area insets for notched devices
        this.handleSafeAreaInsets();
    }

    /**
     * Handle safe area insets for devices with notches
     */
    handleSafeAreaInsets() {
        // Add CSS custom properties for safe area insets
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --safe-area-inset-top: env(safe-area-inset-top, 0px);
                --safe-area-inset-right: env(safe-area-inset-right, 0px);
                --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
                --safe-area-inset-left: env(safe-area-inset-left, 0px);
            }
            
            .app-header {
                padding-top: calc(var(--space-xl) + var(--safe-area-inset-top));
                padding-left: calc(var(--space-lg) + var(--safe-area-inset-left));
                padding-right: calc(var(--space-lg) + var(--safe-area-inset-right));
            }
            
            .app-footer {
                padding-bottom: calc(var(--space-xl) + var(--safe-area-inset-bottom));
                padding-left: calc(var(--space-lg) + var(--safe-area-inset-left));
                padding-right: calc(var(--space-lg) + var(--safe-area-inset-right));
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Handle viewport resize
     */
    handleViewportResize() {
        // Recalculate grid layouts
        this.optimizeGridLayout();
        
        // Adjust font sizes for very small screens
        this.adjustFontSizes();
        
        // Update touch targets
        setTimeout(() => {
            this.improveTouchTargets();
        }, 100);
    }

    /**
     * Optimize grid layout for different screen sizes
     */
    optimizeGridLayout() {
        const ratesGrids = document.querySelectorAll('.rates-grid');
        const screenWidth = window.innerWidth;

        ratesGrids.forEach(grid => {
            if (screenWidth < 480) {
                // Very small screens - single column
                grid.style.gridTemplateColumns = '1fr';
            } else if (screenWidth < 768) {
                // Small screens - two columns max
                grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
            } else {
                // Larger screens - use default responsive grid
                grid.style.gridTemplateColumns = '';
            }
        });
    }

    /**
     * Adjust font sizes for very small screens
     */
    adjustFontSizes() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isVerySmall = screenWidth < 360 || screenHeight < 600;

        if (isVerySmall) {
            document.body.classList.add('very-small-screen');
        } else {
            document.body.classList.remove('very-small-screen');
        }
    }

    /**
     * Setup collapsible sections for better mobile UX
     */
    setupCollapsibleSections() {
        this.createCollapsibleInfo();
        this.createCollapsibleNavigation();
    }

    /**
     * Create collapsible info section
     */
    createCollapsibleInfo() {
        const infoBox = document.querySelector('.info-box');
        if (!infoBox) return;

        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'info-toggle';
        toggleButton.innerHTML = '<span>ℹ️</span> Bitcoin Info';
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-controls', 'bitcoin-info');

        // Wrap info content
        const infoContent = document.createElement('div');
        infoContent.id = 'bitcoin-info';
        infoContent.className = 'info-content collapsed';
        infoContent.innerHTML = infoBox.innerHTML;

        // Replace original info box
        infoBox.innerHTML = '';
        infoBox.appendChild(toggleButton);
        infoBox.appendChild(infoContent);

        // Add toggle functionality
        toggleButton.addEventListener('click', () => {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            toggleButton.setAttribute('aria-expanded', !isExpanded);
            infoContent.classList.toggle('collapsed');
            
            if (window.accessibilityManager) {
                window.accessibilityManager.announce(
                    isExpanded ? 'Bitcoin info collapsed' : 'Bitcoin info expanded'
                );
            }
        });
    }

    /**
     * Create collapsible navigation for very small screens
     */
    createCollapsibleNavigation() {
        if (window.innerWidth > 480) return;

        const navigations = document.querySelectorAll('.navigation');
        navigations.forEach(nav => {
            if (nav.children.length > 2) {
                nav.classList.add('collapsible-nav');
                
                // Create "More" button for additional options
                const moreButton = document.createElement('button');
                moreButton.className = 'nav-more-btn';
                moreButton.textContent = 'More';
                moreButton.setAttribute('aria-expanded', 'false');
                
                // Hide extra buttons
                const buttons = Array.from(nav.children);
                buttons.slice(2).forEach(button => {
                    button.classList.add('nav-extra');
                });
                
                nav.appendChild(moreButton);
                
                moreButton.addEventListener('click', () => {
                    const isExpanded = moreButton.getAttribute('aria-expanded') === 'true';
                    moreButton.setAttribute('aria-expanded', !isExpanded);
                    nav.classList.toggle('expanded');
                });
            }
        });
    }

    /**
     * Setup touch prevention for specific elements
     */
    setupTouchPrevention() {
        // Prevent pull-to-refresh on main content
        document.addEventListener('touchstart', (event) => {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });

        // Prevent zoom on double tap for specific elements
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                const target = event.target;
                if (target.matches('.rate-card, .btn, .main-tab-btn, .nav-btn')) {
                    event.preventDefault();
                }
            }
            lastTouchEnd = now;
        }, false);
    }

    /**
     * Optimize for mobile performance
     */
    optimizeForMobile() {
        // Add mobile-specific classes
        document.body.classList.add('mobile-optimized');

        // Optimize animations for mobile
        if (this.isTouch) {
            document.body.classList.add('touch-optimized');
        }

        // Add mobile-specific meta tags if not present
        this.addMobileMetaTags();

        // Setup performance monitoring
        this.setupPerformanceMonitoring();
    }

    /**
     * Add mobile-specific meta tags
     */
    addMobileMetaTags() {
        const metaTags = [
            { name: 'mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
            { name: 'format-detection', content: 'telephone=no' }
        ];

        metaTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    /**
     * Setup performance monitoring for mobile
     */
    setupPerformanceMonitoring() {
        // Monitor scroll performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            document.body.classList.add('scrolling');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 150);
        }, { passive: true });

        // Monitor touch performance
        let touchTimeout;
        document.addEventListener('touchmove', () => {
            document.body.classList.add('touching');
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                document.body.classList.remove('touching');
            }, 150);
        }, { passive: true });
    }

    /**
     * Get device information
     * @returns {Object} - Device information
     */
    getDeviceInfo() {
        return {
            isTouch: this.isTouch,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            orientation: window.orientation || 0,
            pixelRatio: window.devicePixelRatio || 1,
            isLandscape: Math.abs(window.orientation || 0) === 90,
            isSmallScreen: window.innerWidth < 768,
            isVerySmallScreen: window.innerWidth < 360
        };
    }

    /**
     * Cleanup event listeners
     */
    destroy() {
        // Remove event listeners
        // Note: In a real implementation, you'd want to store references to the handlers
        // for proper cleanup
        document.body.classList.remove(
            'touch-device', 
            'mobile-optimized', 
            'touch-optimized',
            'landscape-compact',
            'very-small-screen'
        );
    }
}

// Export for use in other modules
export default MobileEnhancementsManager;

// Global instance for immediate use
window.MobileEnhancementsManager = MobileEnhancementsManager;