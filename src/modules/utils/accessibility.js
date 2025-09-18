/**
 * Accessibility Utilities Module
 * Provides comprehensive accessibility support including ARIA management,
 * keyboard navigation, screen reader announcements, and focus management.
 */

class AccessibilityManager {
    constructor() {
        this.announceElement = null;
        this.focusHistory = [];
        this.keyboardListeners = new Map();
        this.init();
    }

    /**
     * Initialize accessibility features
     */
    init() {
        this.createAnnounceElement();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupReducedMotion();
        this.setupHighContrast();
        this.addSkipLinks();
    }

    /**
     * Create live region for screen reader announcements
     */
    createAnnounceElement() {
        this.announceElement = document.getElementById('sr-announcements');
        if (!this.announceElement) {
            this.announceElement = document.createElement('div');
            this.announceElement.id = 'sr-announcements';
            this.announceElement.className = 'sr-live';
            this.announceElement.setAttribute('aria-live', 'polite');
            this.announceElement.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.announceElement);
        }
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announce(message, priority = 'polite') {
        if (!this.announceElement) return;

        // Clear previous message
        this.announceElement.textContent = '';
        this.announceElement.setAttribute('aria-live', priority);

        // Set new message after a brief delay to ensure it's announced
        setTimeout(() => {
            this.announceElement.textContent = message;
        }, 100);

        // Clear message after announcement
        setTimeout(() => {
            this.announceElement.textContent = '';
        }, 3000);
    }

    /**
     * Setup comprehensive keyboard navigation
     */
    setupKeyboardNavigation() {
        // Tab navigation for main tabs (1, 2, 3 keys)
        this.addKeyboardListener(document, 'keydown', (event) => {
            // Number keys for tab switching
            if (event.key >= '1' && event.key <= '3' && !event.ctrlKey && !event.altKey) {
                const tabMap = { '1': 'btc', '2': 'bts', '3': 'sts' };
                const tabId = tabMap[event.key];
                if (tabId && typeof window.showMainTab === 'function') {
                    event.preventDefault();
                    window.showMainTab(tabId);
                    this.announce(`Switched to ${tabId.toUpperCase()} tab`);
                }
            }

            // Arrow key navigation within tab groups
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.classList.contains('main-tab-btn')) {
                    event.preventDefault();
                    this.navigateTabGroup(activeElement, event.key === 'ArrowRight');
                }
            }

            // Escape key to close modals or return focus
            if (event.key === 'Escape') {
                this.handleEscapeKey();
            }

            // Enter and Space for button activation
            if ((event.key === 'Enter' || event.key === ' ') && 
                activeElement && 
                (activeElement.tagName === 'BUTTON' || activeElement.getAttribute('role') === 'button')) {
                event.preventDefault();
                activeElement.click();
            }
        });

        // Focus management for dynamic content
        this.setupFocusTrap();
    }

    /**
     * Navigate between tabs using arrow keys
     * @param {Element} currentTab - Currently focused tab
     * @param {boolean} forward - Direction of navigation
     */
    navigateTabGroup(currentTab, forward) {
        const tabGroup = currentTab.closest('[role="tablist"]');
        if (!tabGroup) return;

        const tabs = Array.from(tabGroup.querySelectorAll('[role="tab"]'));
        const currentIndex = tabs.indexOf(currentTab);
        
        let nextIndex;
        if (forward) {
            nextIndex = (currentIndex + 1) % tabs.length;
        } else {
            nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        }

        const nextTab = tabs[nextIndex];
        if (nextTab) {
            nextTab.focus();
            nextTab.click();
        }
    }

    /**
     * Setup focus management and focus trapping
     */
    setupFocusManagement() {
        // Track focus history for restoration
        document.addEventListener('focusin', (event) => {
            this.focusHistory.push(event.target);
            if (this.focusHistory.length > 10) {
                this.focusHistory.shift();
            }
        });

        // Enhanced focus indicators
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    /**
     * Setup focus trap for modal dialogs
     */
    setupFocusTrap() {
        const focusableSelectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex="-1"])',
            '[role="button"]:not([disabled])',
            '[role="tab"]:not([disabled])'
        ].join(', ');

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab') return;

            const modal = document.querySelector('.modal.active, .dialog.active');
            if (!modal) return;

            const focusableElements = Array.from(modal.querySelectorAll(focusableSelectors));
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    /**
     * Handle escape key press
     */
    handleEscapeKey() {
        // Close any open modals or dialogs
        const modal = document.querySelector('.modal.active, .dialog.active');
        if (modal) {
            const closeButton = modal.querySelector('.close, [data-dismiss]');
            if (closeButton) {
                closeButton.click();
            }
            return;
        }

        // Return focus to previous element
        if (this.focusHistory.length > 1) {
            const previousElement = this.focusHistory[this.focusHistory.length - 2];
            if (previousElement && document.contains(previousElement)) {
                previousElement.focus();
            }
        }
    }

    /**
     * Setup reduced motion support
     */
    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (mediaQuery) => {
            if (mediaQuery.matches) {
                document.documentElement.style.setProperty('--transition-fast', '0ms');
                document.documentElement.style.setProperty('--transition-normal', '0ms');
                document.documentElement.style.setProperty('--transition-slow', '0ms');
                document.body.classList.add('reduced-motion');
                this.announce('Animations disabled for accessibility');
            } else {
                document.documentElement.style.removeProperty('--transition-fast');
                document.documentElement.style.removeProperty('--transition-normal');
                document.documentElement.style.removeProperty('--transition-slow');
                document.body.classList.remove('reduced-motion');
            }
        };

        handleReducedMotion(prefersReducedMotion);
        prefersReducedMotion.addEventListener('change', handleReducedMotion);
    }

    /**
     * Setup high contrast mode support
     */
    setupHighContrast() {
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        
        const handleHighContrast = (mediaQuery) => {
            if (mediaQuery.matches) {
                document.body.classList.add('high-contrast');
                this.announce('High contrast mode enabled');
            } else {
                document.body.classList.remove('high-contrast');
            }
        };

        handleHighContrast(prefersHighContrast);
        prefersHighContrast.addEventListener('change', handleHighContrast);
    }

    /**
     * Add skip links for keyboard navigation
     */
    addSkipLinks() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (event) => {
                event.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    this.announce('Skipped to main content');
                }
            });
        }
    }

    /**
     * Update ARIA attributes for dynamic content
     * @param {Element} element - Element to update
     * @param {Object} attributes - ARIA attributes to set
     */
    updateARIA(element, attributes) {
        if (!element) return;

        Object.entries(attributes).forEach(([key, value]) => {
            if (key.startsWith('aria-') || key === 'role') {
                element.setAttribute(key, value);
            }
        });
    }

    /**
     * Manage tab panel visibility and ARIA states
     * @param {string} activeTabId - ID of the active tab
     * @param {string} activePanelId - ID of the active panel
     */
    updateTabStates(activeTabId, activePanelId) {
        // Update tab buttons
        const tabs = document.querySelectorAll('[role="tab"]');
        tabs.forEach(tab => {
            const isActive = tab.id === activeTabId;
            tab.setAttribute('aria-selected', isActive);
            tab.classList.toggle('active', isActive);
            
            if (isActive) {
                tab.setAttribute('tabindex', '0');
            } else {
                tab.setAttribute('tabindex', '-1');
            }
        });

        // Update tab panels
        const panels = document.querySelectorAll('[role="tabpanel"]');
        panels.forEach(panel => {
            const isActive = panel.id === activePanelId;
            panel.setAttribute('aria-hidden', !isActive);
            panel.classList.toggle('active', isActive);
            
            if (isActive) {
                panel.setAttribute('tabindex', '0');
            } else {
                panel.setAttribute('tabindex', '-1');
            }
        });
    }

    /**
     * Update navigation button states
     * @param {string} activeButtonId - ID of the active navigation button
     */
    updateNavStates(activeButtonId) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            const isActive = button.textContent.trim().toLowerCase().includes(activeButtonId);
            button.setAttribute('aria-pressed', isActive);
            button.classList.toggle('active', isActive);
        });
    }

    /**
     * Add keyboard listener with cleanup tracking
     * @param {Element} element - Element to add listener to
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     */
    addKeyboardListener(element, event, handler) {
        element.addEventListener(event, handler);
        
        if (!this.keyboardListeners.has(element)) {
            this.keyboardListeners.set(element, []);
        }
        this.keyboardListeners.get(element).push({ event, handler });
    }

    /**
     * Enhance rate cards with accessibility features
     * @param {Element} card - Rate card element
     * @param {Object} data - Card data
     */
    enhanceRateCardAccessibility(card, data) {
        if (!card || !data) return;

        // Add ARIA label
        const ariaLabel = `${data.currency.name} (${data.currency.code}): ${data.rateText}`;
        card.setAttribute('aria-label', ariaLabel);
        card.setAttribute('role', 'article');

        // Add keyboard interaction
        card.setAttribute('tabindex', '0');
        
        // Add keyboard event listeners
        this.addKeyboardListener(card, 'keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                // Trigger any click handlers
                card.click();
                this.announce(`Selected ${data.currency.name} rate: ${data.rateText}`);
            }
        });

        // Enhance currency flag accessibility
        const flag = card.querySelector('.currency-flag');
        if (flag) {
            flag.setAttribute('alt', `${data.currency.name} flag`);
            flag.setAttribute('role', 'img');
        }

        // Add semantic structure
        const currencyInfo = card.querySelector('.currency-info');
        if (currencyInfo) {
            currencyInfo.setAttribute('aria-label', `Currency: ${data.currency.name}`);
        }

        const rateValue = card.querySelector('.rate-value');
        if (rateValue) {
            rateValue.setAttribute('aria-label', `Rate: ${data.rateText}`);
        }
    }

    /**
     * Announce loading states
     * @param {string} state - Loading state ('start', 'progress', 'complete', 'error')
     * @param {string} message - Optional custom message
     */
    announceLoadingState(state, message = '') {
        const messages = {
            start: 'Loading exchange rates...',
            progress: 'Loading in progress...',
            complete: 'Exchange rates loaded successfully',
            error: 'Error loading exchange rates'
        };

        const announcement = message || messages[state] || state;
        this.announce(announcement, state === 'error' ? 'assertive' : 'polite');
    }

    /**
     * Announce rate updates
     * @param {number} count - Number of rates updated
     * @param {string} denomination - BTC, BITS, or Satoshi
     */
    announceRateUpdate(count, denomination) {
        const message = `Updated ${count} ${denomination} exchange rates`;
        this.announce(message);
    }

    /**
     * Setup theme change announcements
     * @param {string} theme - New theme name
     */
    announceThemeChange(theme) {
        const themeNames = {
            light: 'Light theme',
            dark: 'Dark theme',
            'high-contrast': 'High contrast theme',
            auto: 'Automatic theme'
        };

        const themeName = themeNames[theme] || theme;
        this.announce(`Switched to ${themeName}`);
    }

    /**
     * Cleanup event listeners
     */
    destroy() {
        this.keyboardListeners.forEach((listeners, element) => {
            listeners.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler);
            });
        });
        this.keyboardListeners.clear();
        this.focusHistory = [];
    }
}

// Export for use in other modules
export default AccessibilityManager;

// Global instance for immediate use
window.AccessibilityManager = AccessibilityManager;