/**
 * Sharing Module
 * Provides rate sharing capabilities including copy-to-clipboard and URL generation
 */

import { formatNumber, formatCurrency } from '../data/formatter.js';

class SharingManager {
    constructor() {
        this.baseUrl = window.location.origin + window.location.pathname;
        this.setupStyles();
        this.setupEventListeners();
        
        // Track sharing analytics
        this.shareCount = 0;
        this.shareHistory = [];
    }

    setupStyles() {
        if (!document.getElementById('sharing-styles')) {
            const style = document.createElement('style');
            style.id = 'sharing-styles';
            style.textContent = `
                .share-button {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(255, 255, 255, 0.9);
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    padding: 6px;
                    cursor: pointer;
                    opacity: 0;
                    transform: scale(0.8);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 5;
                    backdrop-filter: blur(4px);
                }

                .share-button:hover {
                    background: rgba(255, 255, 255, 1);
                    border-color: #cbd5e1;
                    transform: scale(1);
                }

                .share-button:focus {
                    outline: 2px solid #2563eb;
                    outline-offset: 2px;
                }

                .rate-card {
                    position: relative;
                }

                .rate-card:hover .share-button,
                .rate-card:focus-within .share-button {
                    opacity: 1;
                    transform: scale(1);
                }

                .share-icon {
                    width: 16px;
                    height: 16px;
                    color: #64748b;
                    transition: color 0.2s ease;
                }

                .share-button:hover .share-icon {
                    color: #2563eb;
                }

                .share-tooltip {
                    position: absolute;
                    bottom: 100%;
                    right: 0;
                    background: #1a1a1a;
                    color: white;
                    padding: 6px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    white-space: nowrap;
                    opacity: 0;
                    transform: translateY(4px);
                    transition: all 0.2s ease;
                    pointer-events: none;
                    z-index: 10;
                }

                .share-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    right: 8px;
                    border: 4px solid transparent;
                    border-top-color: #1a1a1a;
                }

                .share-tooltip.show {
                    opacity: 1;
                    transform: translateY(0);
                }

                .share-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .share-modal.show {
                    opacity: 1;
                    visibility: visible;
                }

                .share-modal-content {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }

                .share-modal.show .share-modal-content {
                    transform: scale(1);
                }

                .share-modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 16px;
                }

                .share-modal-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin: 0;
                }

                .share-modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #64748b;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .share-options {
                    display: grid;
                    gap: 12px;
                }

                .share-option {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: white;
                }

                .share-option:hover {
                    border-color: #2563eb;
                    background: #f8fafc;
                }

                .share-option-icon {
                    width: 20px;
                    height: 20px;
                    color: #64748b;
                }

                .share-option-text {
                    flex: 1;
                    font-weight: 500;
                    color: #1a1a1a;
                }

                .share-url-input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 12px;
                    background: #f8fafc;
                    margin-top: 8px;
                }

                @media (max-width: 640px) {
                    .share-modal-content {
                        margin: 16px;
                        width: calc(100% - 32px);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .share-button,
                    .share-tooltip,
                    .share-modal,
                    .share-modal-content {
                        transition: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupEventListeners() {
        // Listen for new rate cards being added
        document.addEventListener('DOMContentLoaded', () => {
            this.enhanceExistingCards();
        });

        // Use MutationObserver to detect new cards
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList?.contains('rate-card')) {
                            this.addShareButton(node);
                        } else {
                            // Check for rate cards within added nodes
                            const rateCards = node.querySelectorAll?.('.rate-card');
                            rateCards?.forEach(card => this.addShareButton(card));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeShareModal();
            }
        });
    }

    enhanceExistingCards() {
        const existingCards = document.querySelectorAll('.rate-card');
        existingCards.forEach(card => this.addShareButton(card));
    }

    addShareButton(card) {
        // Don't add if already has share button
        if (card.querySelector('.share-button')) {
            return;
        }

        const shareButton = document.createElement('button');
        shareButton.className = 'share-button';
        shareButton.setAttribute('aria-label', 'Share this rate');
        shareButton.innerHTML = `
            <svg class="share-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
        `;

        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'share-tooltip';
        tooltip.textContent = 'Share rate';
        shareButton.appendChild(tooltip);

        shareButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleShareClick(card);
        });

        shareButton.addEventListener('mouseenter', () => {
            tooltip.classList.add('show');
        });

        shareButton.addEventListener('mouseleave', () => {
            tooltip.classList.remove('show');
        });

        card.appendChild(shareButton);
    }

    handleShareClick(card) {
        const rateData = this.extractRateData(card);
        this.showShareModal(rateData);
    }

    extractRateData(card) {
        const currencyCode = card.dataset.currency;
        const cardType = card.dataset.type;
        const unit = card.dataset.unit;
        const rate = parseFloat(card.dataset.rate);

        const currencyName = card.querySelector('.currency-name')?.textContent;
        const rateValue = card.querySelector('.rate-value')?.textContent;
        const flag = card.querySelector('.currency-flag')?.textContent;

        return {
            currencyCode: currencyCode?.toUpperCase(),
            currencyName,
            cardType,
            unit,
            rate,
            rateValue,
            flag,
            timestamp: new Date().toISOString()
        };
    }

    showShareModal(rateData) {
        // Remove existing modal if present
        this.closeShareModal();

        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h3 class="share-modal-title">Share ${rateData.currencyName || rateData.currencyCode} Rate</h3>
                    <button class="share-modal-close" aria-label="Close share modal">&times;</button>
                </div>
                <div class="share-options">
                    <button class="share-option" data-action="copy-text">
                        <svg class="share-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span class="share-option-text">Copy Rate Text</span>
                    </button>
                    <button class="share-option" data-action="copy-url">
                        <svg class="share-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.1a3 3 0 105.656-5.656l-1.1-1.102z" />
                        </svg>
                        <span class="share-option-text">Copy Share Link</span>
                    </button>
                    <button class="share-option" data-action="native-share">
                        <svg class="share-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span class="share-option-text">Share via System</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        // Add event listeners
        modal.querySelector('.share-modal-close').addEventListener('click', () => {
            this.closeShareModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeShareModal();
            }
        });

        modal.querySelectorAll('.share-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleShareAction(action, rateData);
            });
        });

        // Hide native share option if not supported
        if (!navigator.share) {
            modal.querySelector('[data-action="native-share"]').style.display = 'none';
        }

        this.currentModal = modal;
    }

    closeShareModal() {
        if (this.currentModal) {
            this.currentModal.classList.remove('show');
            setTimeout(() => {
                if (this.currentModal && this.currentModal.parentNode) {
                    this.currentModal.parentNode.removeChild(this.currentModal);
                }
                this.currentModal = null;
            }, 300);
        }
    }

    async handleShareAction(action, rateData) {
        try {
            switch (action) {
                case 'copy-text':
                    await this.copyRateText(rateData);
                    break;
                case 'copy-url':
                    await this.copyShareUrl(rateData);
                    break;
                case 'native-share':
                    await this.nativeShare(rateData);
                    break;
            }
            
            this.trackShare(action, rateData);
            this.showShareSuccess(action);
        } catch (error) {
            console.error('Share action failed:', error);
            this.showShareError(error.message);
        }
    }

    async copyRateText(rateData) {
        const text = this.generateShareText(rateData);
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    async copyShareUrl(rateData) {
        const url = this.generateShareUrl(rateData);
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(url);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    async nativeShare(rateData) {
        if (!navigator.share) {
            throw new Error('Native sharing not supported');
        }

        const shareData = {
            title: `Bitcoin Rate - ${rateData.currencyCode}`,
            text: this.generateShareText(rateData),
            url: this.generateShareUrl(rateData)
        };

        await navigator.share(shareData);
    }

    generateShareText(rateData) {
        const { flag, currencyCode, rateValue, unit, timestamp } = rateData;
        const date = new Date(timestamp).toLocaleDateString();
        
        return `${flag} Bitcoin Rate (${currencyCode})
${rateValue}
Unit: ${unit}
Date: ${date}

Check live Bitcoin rates at ${this.baseUrl}`;
    }

    generateShareUrl(rateData) {
        const params = new URLSearchParams({
            currency: rateData.currencyCode,
            tab: this.getTabFromUnit(rateData.unit),
            type: rateData.cardType,
            shared: '1'
        });

        return `${this.baseUrl}?${params.toString()}`;
    }

    getTabFromUnit(unit) {
        switch (unit) {
            case 'BTC': return 'btc';
            case 'BITS': return 'bts';
            case 'sats': return 'sts';
            default: return 'btc';
        }
    }

    showShareSuccess(action) {
        const messages = {
            'copy-text': 'Rate copied to clipboard!',
            'copy-url': 'Share link copied to clipboard!',
            'native-share': 'Rate shared successfully!'
        };

        this.showNotification(messages[action] || 'Shared successfully!', 'success');
        this.closeShareModal();
    }

    showShareError(message) {
        this.showNotification(`Share failed: ${message}`, 'error');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.share-notification');
        existing.forEach(el => el.remove());

        const notification = document.createElement('div');
        notification.className = `share-notification share-notification--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    trackShare(action, rateData) {
        this.shareCount++;
        this.shareHistory.push({
            action,
            currency: rateData.currencyCode,
            unit: rateData.unit,
            timestamp: new Date().toISOString()
        });

        // Keep only last 50 shares
        if (this.shareHistory.length > 50) {
            this.shareHistory = this.shareHistory.slice(-50);
        }

        // Dispatch custom event for analytics
        document.dispatchEvent(new CustomEvent('rateShared', {
            detail: { action, rateData, shareCount: this.shareCount }
        }));
    }

    // Public API methods
    getShareStats() {
        return {
            totalShares: this.shareCount,
            recentShares: this.shareHistory.slice(-10),
            popularCurrencies: this.getPopularSharedCurrencies()
        };
    }

    getPopularSharedCurrencies() {
        const currencyCount = {};
        this.shareHistory.forEach(share => {
            currencyCount[share.currency] = (currencyCount[share.currency] || 0) + 1;
        });

        return Object.entries(currencyCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([currency, count]) => ({ currency, count }));
    }

    // URL parameter handling for shared links
    handleSharedUrl() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.get('shared') === '1') {
            const currency = params.get('currency');
            const tab = params.get('tab');
            const type = params.get('type');

            // Highlight the shared rate if possible
            setTimeout(() => {
                this.highlightSharedRate(currency, tab, type);
            }, 1000);

            // Clean up URL
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }

    highlightSharedRate(currency, tab, type) {
        if (!currency) return;

        // Try to find and highlight the specific rate card
        const card = document.querySelector(`[data-currency="${currency.toLowerCase()}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add highlight effect
            card.style.outline = '3px solid #2563eb';
            card.style.outlineOffset = '4px';
            
            setTimeout(() => {
                card.style.outline = '';
                card.style.outlineOffset = '';
            }, 3000);

            this.showNotification(`Showing shared ${currency} rate`, 'info');
        }
    }

    // Cleanup method
    destroy() {
        this.closeShareModal();
        
        // Remove share buttons
        const shareButtons = document.querySelectorAll('.share-button');
        shareButtons.forEach(button => button.remove());

        // Remove styles
        const styles = document.getElementById('sharing-styles');
        if (styles) {
            styles.remove();
        }
    }
}

// Auto-initialize and handle shared URLs
let sharingManager;

document.addEventListener('DOMContentLoaded', () => {
    sharingManager = new SharingManager();
    sharingManager.handleSharedUrl();
});

// Export for use in other modules
export default SharingManager;
export { sharingManager };