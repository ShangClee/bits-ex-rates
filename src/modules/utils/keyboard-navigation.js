/**
 * Keyboard Navigation Utilities
 * Provides comprehensive keyboard navigation support for the Bitcoin Exchange Rates app
 */

class KeyboardNavigationManager {
    constructor() {
        this.shortcuts = new Map();
        this.navigationGroups = new Map();
        this.init();
    }

    /**
     * Initialize keyboard navigation
     */
    init() {
        this.setupGlobalShortcuts();
        this.setupNavigationGroups();
        this.setupFocusManagement();
        this.setupArrowKeyNavigation();
    }

    /**
     * Setup global keyboard shortcuts
     */
    setupGlobalShortcuts() {
        // Register default shortcuts
        this.registerShortcut('1', () => this.switchTab('btc'), 'Switch to BTC tab');
        this.registerShortcut('2', () => this.switchTab('bts'), 'Switch to BITS tab');
        this.registerShortcut('3', () => this.switchTab('sts'), 'Switch to Satoshi tab');
        this.registerShortcut('r', () => this.refreshRates(), 'Refresh exchange rates');
        this.registerShortcut('t', () => this.toggleTheme(), 'Toggle theme');
        this.registerShortcut('h', () => this.showHelp(), 'Show keyboard shortcuts help');
        this.registerShortcut('/', () => this.focusSearch(), 'Focus search input');

        // Setup global keydown listener
        document.addEventListener('keydown', (event) => {
            this.handleGlobalKeydown(event);
        });
    }

    /**
     * Register a keyboard shortcut
     * @param {string} key - Key combination
     * @param {Function} handler - Handler function
     * @param {string} description - Description for help
     */
    registerShortcut(key, handler, description) {
        this.shortcuts.set(key.toLowerCase(), {
            handler,
            description,
            key: key.toUpperCase()
        });
    }

    /**
     * Handle global keydown events
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleGlobalKeydown(event) {
        // Skip if user is typing in an input field
        if (this.isTypingInInput(event.target)) {
            return;
        }

        // Skip if modifier keys are pressed (except for specific combinations)
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }

        const key = event.key.toLowerCase();
        const shortcut = this.shortcuts.get(key);

        if (shortcut) {
            event.preventDefault();
            shortcut.handler();
            
            // Announce shortcut activation
            if (window.accessibilityManager) {
                window.accessibilityManager.announce(`Activated: ${shortcut.description}`);
            }
        }
    }

    /**
     * Check if user is typing in an input field
     * @param {Element} element - Target element
     * @returns {boolean} - True if typing in input
     */
    isTypingInInput(element) {
        const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT'];
        return inputTypes.includes(element.tagName) || 
               element.contentEditable === 'true' ||
               element.closest('[contenteditable="true"]');
    }

    /**
     * Setup navigation groups for arrow key navigation
     */
    setupNavigationGroups() {
        // Main tabs navigation group
        this.registerNavigationGroup('main-tabs', {
            selector: '.main-tab-btn',
            orientation: 'horizontal',
            wrap: true,
            activateOnFocus: true
        });

        // Sub navigation groups
        this.registerNavigationGroup('btc-nav', {
            selector: '#btc-sub-navigation .nav-btn',
            orientation: 'horizontal',
            wrap: true,
            activateOnFocus: true
        });

        this.registerNavigationGroup('bts-nav', {
            selector: '#bts-sub-navigation .nav-btn',
            orientation: 'horizontal',
            wrap: true,
            activateOnFocus: true
        });

        this.registerNavigationGroup('sts-nav', {
            selector: '#sts-sub-navigation .nav-btn',
            orientation: 'horizontal',
            wrap: true,
            activateOnFocus: true
        });

        // Rate cards navigation group
        this.registerNavigationGroup('rate-cards', {
            selector: '.rate-card',
            orientation: 'grid',
            wrap: true,
            activateOnFocus: false
        });
    }

    /**
     * Register a navigation group
     * @param {string} name - Group name
     * @param {Object} config - Group configuration
     */
    registerNavigationGroup(name, config) {
        this.navigationGroups.set(name, {
            ...config,
            currentIndex: 0
        });
    }

    /**
     * Setup arrow key navigation
     */
    setupArrowKeyNavigation() {
        document.addEventListener('keydown', (event) => {
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                return;
            }

            const activeElement = document.activeElement;
            const group = this.findNavigationGroup(activeElement);

            if (group) {
                event.preventDefault();
                this.handleArrowNavigation(event.key, group, activeElement);
            }
        });
    }

    /**
     * Find navigation group for an element
     * @param {Element} element - Element to check
     * @returns {Object|null} - Navigation group or null
     */
    findNavigationGroup(element) {
        for (const [name, group] of this.navigationGroups) {
            const elements = document.querySelectorAll(group.selector);
            if (Array.from(elements).includes(element)) {
                return { name, ...group, elements: Array.from(elements) };
            }
        }
        return null;
    }

    /**
     * Handle arrow key navigation within a group
     * @param {string} key - Arrow key pressed
     * @param {Object} group - Navigation group
     * @param {Element} currentElement - Currently focused element
     */
    handleArrowNavigation(key, group, currentElement) {
        const { elements, orientation, wrap, activateOnFocus } = group;
        const currentIndex = elements.indexOf(currentElement);
        let newIndex = currentIndex;

        if (orientation === 'horizontal') {
            if (key === 'ArrowLeft') {
                newIndex = wrap ? (currentIndex - 1 + elements.length) % elements.length : Math.max(0, currentIndex - 1);
            } else if (key === 'ArrowRight') {
                newIndex = wrap ? (currentIndex + 1) % elements.length : Math.min(elements.length - 1, currentIndex + 1);
            }
        } else if (orientation === 'vertical') {
            if (key === 'ArrowUp') {
                newIndex = wrap ? (currentIndex - 1 + elements.length) % elements.length : Math.max(0, currentIndex - 1);
            } else if (key === 'ArrowDown') {
                newIndex = wrap ? (currentIndex + 1) % elements.length : Math.min(elements.length - 1, currentIndex + 1);
            }
        } else if (orientation === 'grid') {
            // Calculate grid dimensions
            const container = elements[0]?.parentElement;
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
            const elementRect = elements[0].getBoundingClientRect();
            const cols = Math.floor(containerRect.width / elementRect.width);

            if (key === 'ArrowLeft') {
                newIndex = wrap ? (currentIndex - 1 + elements.length) % elements.length : Math.max(0, currentIndex - 1);
            } else if (key === 'ArrowRight') {
                newIndex = wrap ? (currentIndex + 1) % elements.length : Math.min(elements.length - 1, currentIndex + 1);
            } else if (key === 'ArrowUp') {
                newIndex = Math.max(0, currentIndex - cols);
            } else if (key === 'ArrowDown') {
                newIndex = Math.min(elements.length - 1, currentIndex + cols);
            }
        }

        // Handle Home and End keys
        if (key === 'Home') {
            newIndex = 0;
        } else if (key === 'End') {
            newIndex = elements.length - 1;
        }

        // Focus new element
        if (newIndex !== currentIndex && elements[newIndex]) {
            elements[newIndex].focus();
            
            // Activate if configured to do so
            if (activateOnFocus) {
                elements[newIndex].click();
            }

            // Update group's current index
            group.currentIndex = newIndex;

            // Announce navigation
            if (window.accessibilityManager) {
                const elementText = this.getElementDescription(elements[newIndex]);
                window.accessibilityManager.announce(`Navigated to ${elementText}`);
            }
        }
    }

    /**
     * Get description of an element for announcements
     * @param {Element} element - Element to describe
     * @returns {string} - Element description
     */
    getElementDescription(element) {
        // Try aria-label first
        if (element.getAttribute('aria-label')) {
            return element.getAttribute('aria-label');
        }

        // Try text content
        if (element.textContent.trim()) {
            return element.textContent.trim();
        }

        // Try title attribute
        if (element.title) {
            return element.title;
        }

        // Fallback to tag name
        return element.tagName.toLowerCase();
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Add focus indicators for keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-focus');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-focus');
        });

        // Manage focus for dynamic content
        this.setupDynamicFocusManagement();
    }

    /**
     * Setup focus management for dynamic content
     */
    setupDynamicFocusManagement() {
        // Observer for dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.enhanceNewElements(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Enhance newly added elements with keyboard navigation
     * @param {Element} element - New element
     */
    enhanceNewElements(element) {
        // Add tabindex to rate cards
        if (element.classList?.contains('rate-card')) {
            element.setAttribute('tabindex', '0');
            
            // Add keyboard event listener
            element.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    element.click();
                }
            });
        }

        // Enhance buttons
        if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
            element.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    element.click();
                }
            });
        }
    }

    /**
     * Switch to a specific tab
     * @param {string} tabId - Tab ID (btc, bts, sts)
     */
    switchTab(tabId) {
        if (typeof window.showMainTab === 'function') {
            window.showMainTab(tabId);
        }
    }

    /**
     * Refresh exchange rates
     */
    refreshRates() {
        if (typeof window.fetchRates === 'function') {
            window.fetchRates();
        }
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        if (typeof window.toggleTheme === 'function') {
            window.toggleTheme();
        }
    }

    /**
     * Focus search input
     */
    focusSearch() {
        const searchInput = document.querySelector('#search-input, .search-input, input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }

    /**
     * Show keyboard shortcuts help
     */
    showHelp() {
        const shortcuts = Array.from(this.shortcuts.entries())
            .map(([key, shortcut]) => `${shortcut.key}: ${shortcut.description}`)
            .join('\n');

        const helpText = `Keyboard Shortcuts:\n\n${shortcuts}\n\nArrow Keys: Navigate within groups\nTab: Move between interactive elements\nEnter/Space: Activate buttons\nEscape: Close dialogs or return focus`;

        // Create or update help dialog
        this.showHelpDialog(helpText);
    }

    /**
     * Show help dialog
     * @param {string} helpText - Help text to display
     */
    showHelpDialog(helpText) {
        // Remove existing help dialog
        const existingDialog = document.getElementById('keyboard-help-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create help dialog
        const dialog = document.createElement('div');
        dialog.id = 'keyboard-help-dialog';
        dialog.className = 'modal active';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-labelledby', 'help-title');
        dialog.setAttribute('aria-modal', 'true');

        dialog.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="help-title">Keyboard Shortcuts</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()" aria-label="Close help dialog">×</button>
                </div>
                <div class="modal-body">
                    <pre style="white-space: pre-wrap; font-family: inherit;">${helpText}</pre>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Focus the close button
        const closeButton = dialog.querySelector('.modal-close');
        if (closeButton) {
            closeButton.focus();
        }

        // Setup escape key to close
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                dialog.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Announce dialog opening
        if (window.accessibilityManager) {
            window.accessibilityManager.announce('Keyboard shortcuts help dialog opened');
        }
    }

    /**
     * Get all registered shortcuts for display
     * @returns {Array} - Array of shortcut objects
     */
    getShortcuts() {
        return Array.from(this.shortcuts.entries()).map(([key, shortcut]) => ({
            key: shortcut.key,
            description: shortcut.description
        }));
    }

    /**
     * Enable or disable keyboard navigation
     * @param {boolean} enabled - Whether to enable navigation
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        document.body.classList.toggle('keyboard-navigation-disabled', !enabled);
    }

    /**
     * Cleanup event listeners
     */
    destroy() {
        // Remove global event listeners
        // Note: In a real implementation, you'd want to store references to the handlers
        // for proper cleanup
        this.shortcuts.clear();
        this.navigationGroups.clear();
    }
}

// Export for use in other modules
export default KeyboardNavigationManager;

// Global instance for immediate use
window.KeyboardNavigationManager = KeyboardNavigationManager;