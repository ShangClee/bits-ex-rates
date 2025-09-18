/**
 * Tab Management Module
 * Handles tab switching, animations, state management, and keyboard navigation
 */

class TabManager {
    constructor() {
        this.currentMainTab = 'btc';
        this.currentPages = {
            btc: 'fiat-per-btc',
            bts: 'fiat-per-bits',
            sts: 'fiat-per-satoshi'
        };
        this.animationDuration = 300;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.restoreTabState();
        this.initializeDefaultTab();
    }

    setupEventListeners() {
        // Main tab buttons
        document.querySelectorAll('.main-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = btn.getAttribute('data-tab') || btn.textContent.toLowerCase();
                this.switchMainTab(tabId);
            });
        });

        // Sub-navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = btn.getAttribute('data-page');
                if (pageId) {
                    this.switchPage(pageId);
                }
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle keyboard navigation when not in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.switchMainTab('btc');
                    break;
                case '2':
                    e.preventDefault();
                    this.switchMainTab('bts');
                    break;
                case '3':
                    e.preventDefault();
                    this.switchMainTab('sts');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.switchToPreviousTab();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.switchToNextTab();
                    break;
                case 'Tab':
                    // Allow default tab behavior but announce current tab
                    this.announceCurrentTab();
                    break;
            }
        });
    }

    switchMainTab(tabId) {
        if (this.isAnimating || this.currentMainTab === tabId) {
            return;
        }

        this.isAnimating = true;
        const previousTab = this.currentMainTab;
        this.currentMainTab = tabId;

        // Update button states
        this.updateMainTabButtons(tabId);
        
        // Animate tab transition
        this.animateTabTransition(previousTab, tabId).then(() => {
            // Update sub-navigation
            this.updateSubNavigation(tabId);
            
            // Save state
            this.saveTabState();
            
            // Trigger content update
            this.triggerContentUpdate();
            
            // Announce tab change for accessibility
            this.announceTabChange(tabId);
            
            this.isAnimating = false;
        });
    }

    switchPage(pageId) {
        if (this.isAnimating) {
            return;
        }

        const currentPage = this.currentPages[this.currentMainTab];
        if (currentPage === pageId) {
            return;
        }

        this.currentPages[this.currentMainTab] = pageId;

        // Update page buttons
        this.updatePageButtons(pageId);
        
        // Animate page transition
        this.animatePageTransition(currentPage, pageId);
        
        // Save state
        this.saveTabState();
        
        // Trigger content update
        this.triggerContentUpdate();
    }

    updateMainTabButtons(activeTabId) {
        document.querySelectorAll('.main-tab-btn').forEach(btn => {
            const tabId = btn.getAttribute('data-tab') || btn.textContent.toLowerCase();
            
            if (tabId === activeTabId) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                btn.setAttribute('tabindex', '0');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1');
            }
        });
    }

    updatePageButtons(activePageId) {
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
        });

        // Add active class to the selected page button
        const activeBtn = document.querySelector(`[data-page="${activePageId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-selected', 'true');
            activeBtn.setAttribute('tabindex', '0');
        }
    }

    async animateTabTransition(fromTab, toTab) {
        const fromElement = document.getElementById(`${fromTab}-tab`);
        const toElement = document.getElementById(`${toTab}-tab`);

        if (!fromElement || !toElement) {
            // Fallback to immediate switch if elements not found
            this.switchTabsImmediate(fromTab, toTab);
            return;
        }

        // Add transition classes
        fromElement.style.transition = `opacity ${this.animationDuration}ms ease-in-out, transform ${this.animationDuration}ms ease-in-out`;
        toElement.style.transition = `opacity ${this.animationDuration}ms ease-in-out, transform ${this.animationDuration}ms ease-in-out`;

        // Start fade out animation
        fromElement.style.opacity = '0';
        fromElement.style.transform = 'translateX(-20px)';

        // Wait for half the animation duration
        await this.wait(this.animationDuration / 2);

        // Switch visibility
        fromElement.classList.remove('active');
        toElement.classList.add('active');

        // Prepare incoming tab
        toElement.style.opacity = '0';
        toElement.style.transform = 'translateX(20px)';

        // Force reflow
        toElement.offsetHeight;

        // Start fade in animation
        toElement.style.opacity = '1';
        toElement.style.transform = 'translateX(0)';

        // Wait for animation to complete
        await this.wait(this.animationDuration / 2);

        // Clean up styles
        fromElement.style.cssText = '';
        toElement.style.cssText = '';
    }

    async animatePageTransition(fromPage, toPage) {
        const fromElement = document.getElementById(fromPage);
        const toElement = document.getElementById(toPage);

        if (!fromElement || !toElement) {
            // Fallback to immediate switch
            this.switchPagesImmediate(fromPage, toPage);
            return;
        }

        const duration = this.animationDuration / 2; // Faster for page transitions

        // Add transition
        fromElement.style.transition = `opacity ${duration}ms ease-in-out`;
        toElement.style.transition = `opacity ${duration}ms ease-in-out`;

        // Fade out current page
        fromElement.style.opacity = '0';

        await this.wait(duration);

        // Switch pages
        fromElement.classList.remove('active');
        toElement.classList.add('active');

        // Fade in new page
        toElement.style.opacity = '0';
        toElement.offsetHeight; // Force reflow
        toElement.style.opacity = '1';

        await this.wait(duration);

        // Clean up
        fromElement.style.cssText = '';
        toElement.style.cssText = '';
    }

    switchTabsImmediate(fromTab, toTab) {
        document.getElementById(`${fromTab}-tab`)?.classList.remove('active');
        document.getElementById(`${toTab}-tab`)?.classList.add('active');
    }

    switchPagesImmediate(fromPage, toPage) {
        document.getElementById(fromPage)?.classList.remove('active');
        document.getElementById(toPage)?.classList.add('active');
    }

    updateSubNavigation(tabId) {
        // Hide all sub-navigations
        const subNavs = ['btc-sub-navigation', 'bts-sub-navigation', 'sts-sub-navigation'];
        subNavs.forEach(navId => {
            const nav = document.getElementById(navId);
            if (nav) {
                nav.style.display = 'none';
            }
        });

        // Show the appropriate sub-navigation
        const activeSubNav = document.getElementById(`${tabId}-sub-navigation`);
        if (activeSubNav) {
            activeSubNav.style.display = 'flex';
        }

        // Update page buttons for the current tab
        const currentPage = this.currentPages[tabId];
        this.updatePageButtons(currentPage);
    }

    switchToPreviousTab() {
        const tabs = ['btc', 'bts', 'sts'];
        const currentIndex = tabs.indexOf(this.currentMainTab);
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        this.switchMainTab(tabs[previousIndex]);
    }

    switchToNextTab() {
        const tabs = ['btc', 'bts', 'sts'];
        const currentIndex = tabs.indexOf(this.currentMainTab);
        const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        this.switchMainTab(tabs[nextIndex]);
    }

    saveTabState() {
        const state = {
            mainTab: this.currentMainTab,
            pages: { ...this.currentPages },
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('bitcoinApp_tabState', JSON.stringify(state));
        } catch (e) {
            console.warn('Could not save tab state to localStorage:', e);
        }
    }

    restoreTabState() {
        try {
            const saved = localStorage.getItem('bitcoinApp_tabState');
            if (saved) {
                const state = JSON.parse(saved);
                
                // Only restore if saved within last 24 hours
                if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
                    this.currentMainTab = state.mainTab || 'btc';
                    this.currentPages = { ...this.currentPages, ...state.pages };
                }
            }
        } catch (e) {
            console.warn('Could not restore tab state from localStorage:', e);
        }
    }

    initializeDefaultTab() {
        // Set up initial tab state without animation
        this.updateMainTabButtons(this.currentMainTab);
        this.updateSubNavigation(this.currentMainTab);
        
        // Show the correct tab
        document.querySelectorAll('.main-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${this.currentMainTab}-tab`)?.classList.add('active');
        
        // Show the correct page
        const currentPage = this.currentPages[this.currentMainTab];
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(currentPage)?.classList.add('active');
    }

    triggerContentUpdate() {
        // Dispatch custom event for other modules to listen to
        const event = new CustomEvent('tabChanged', {
            detail: {
                mainTab: this.currentMainTab,
                page: this.currentPages[this.currentMainTab]
            }
        });
        document.dispatchEvent(event);
    }

    announceTabChange(tabId) {
        const tabNames = {
            btc: 'Bitcoin',
            bts: 'BITS',
            sts: 'Satoshi'
        };
        
        const announcement = `Switched to ${tabNames[tabId]} tab`;
        this.announceToScreenReader(announcement);
    }

    announceCurrentTab() {
        const tabNames = {
            btc: 'Bitcoin',
            bts: 'BITS', 
            sts: 'Satoshi'
        };
        
        const currentPage = this.currentPages[this.currentMainTab];
        const pageNames = {
            'fiat-per-btc': 'Fiat per Bitcoin',
            'btc-per-fiat': 'Bitcoin per Fiat',
            'fiat-per-bits': 'Fiat per BITS',
            'bits-per-fiat': 'BITS per Fiat',
            'fiat-per-satoshi': 'Fiat per Satoshi',
            'satoshi-per-fiat': 'Satoshi per Fiat'
        };
        
        const announcement = `Currently on ${tabNames[this.currentMainTab]} tab, ${pageNames[currentPage]} page`;
        this.announceToScreenReader(announcement);
    }

    announceToScreenReader(message) {
        // Create or update live region for screen reader announcements
        let liveRegion = document.getElementById('tab-announcements');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'tab-announcements';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = message;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API methods
    getCurrentTab() {
        return this.currentMainTab;
    }

    getCurrentPage() {
        return this.currentPages[this.currentMainTab];
    }

    getTabState() {
        return {
            mainTab: this.currentMainTab,
            pages: { ...this.currentPages }
        };
    }

    // Method to programmatically switch tabs (for external use)
    switchTo(tabId, pageId = null) {
        if (pageId) {
            this.currentPages[tabId] = pageId;
        }
        this.switchMainTab(tabId);
    }
}

// Export for use in other modules
export default TabManager;