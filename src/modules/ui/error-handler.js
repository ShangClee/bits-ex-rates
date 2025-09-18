/**
 * Error Handler Module
 * Manages user-friendly error messages, retry mechanisms, and offline indicators
 */

class ErrorHandler {
    constructor() {
        this.errorContainer = null;
        this.retryCallbacks = new Map();
        this.errorHistory = [];
        this.maxErrorHistory = 10;
        this.setupStyles();
        this.setupGlobalErrorHandling();
        this.setupNetworkMonitoring();
    }

    setupStyles() {
        if (!document.getElementById('error-handler-styles')) {
            const style = document.createElement('style');
            style.id = 'error-handler-styles';
            style.textContent = `
                .error-container {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 16px 0;
                    color: #991b1b;
                    position: relative;
                    animation: slideIn 0.3s ease-out;
                }

                .error-container.warning {
                    background: #fffbeb;
                    border-color: #fed7aa;
                    color: #92400e;
                }

                .error-container.info {
                    background: #eff6ff;
                    border-color: #bfdbfe;
                    color: #1e40af;
                }

                .error-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }

                .error-title {
                    font-weight: 600;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .error-icon {
                    font-size: 16px;
                }

                .error-message {
                    font-size: 14px;
                    line-height: 1.5;
                    margin-bottom: 12px;
                }

                .error-actions {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .error-button {
                    background: transparent;
                    border: 1px solid currentColor;
                    border-radius: 4px;
                    padding: 6px 12px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: inherit;
                }

                .error-button:hover {
                    background: currentColor;
                    color: white;
                }

                .error-button.primary {
                    background: currentColor;
                    color: white;
                }

                .error-button.primary:hover {
                    opacity: 0.9;
                }

                .close-button {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: inherit;
                    opacity: 0.7;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-button:hover {
                    opacity: 1;
                }

                .offline-indicator {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #374151;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    animation: slideInFromRight 0.3s ease-out;
                }

                .offline-indicator.online {
                    background: #059669;
                }

                .network-status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #ef4444;
                    animation: pulse 2s infinite;
                }

                .network-status-dot.online {
                    background: #10b981;
                    animation: none;
                }

                .error-details {
                    margin-top: 8px;
                    padding: 8px;
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 4px;
                    font-size: 12px;
                    font-family: monospace;
                    display: none;
                }

                .error-details.visible {
                    display: block;
                }

                .retry-countdown {
                    font-size: 12px;
                    opacity: 0.8;
                    margin-left: 8px;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInFromRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                @media (max-width: 640px) {
                    .offline-indicator {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        text-align: center;
                    }
                    
                    .error-actions {
                        flex-direction: column;
                    }
                    
                    .error-button {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupGlobalErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logError(event.reason, 'unhandled-promise');
        });

        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            console.error('JavaScript error:', event.error);
            this.logError(event.error, 'javascript-error');
        });
    }

    setupNetworkMonitoring() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.showNetworkStatus(true);
            this.handleNetworkReconnection();
        });

        window.addEventListener('offline', () => {
            this.showNetworkStatus(false);
        });

        // Show initial network status if offline
        if (!navigator.onLine) {
            this.showNetworkStatus(false);
        }
    }

    /**
     * Show error message with optional retry functionality
     */
    showError(message, options = {}) {
        const {
            type = 'error', // 'error', 'warning', 'info'
            title = null,
            container = null,
            retryCallback = null,
            retryText = 'Retry',
            dismissible = true,
            autoHide = false,
            autoHideDelay = 5000,
            showDetails = false,
            details = null
        } = options;

        const targetContainer = container || this.getOrCreateErrorContainer();
        
        // Clear existing errors in container
        if (container) {
            this.clearErrors(container);
        }

        const errorElement = this.createErrorElement({
            type,
            title,
            message,
            retryCallback,
            retryText,
            dismissible,
            showDetails,
            details
        });

        targetContainer.appendChild(errorElement);

        // Auto-hide if requested
        if (autoHide) {
            setTimeout(() => {
                this.hideError(errorElement);
            }, autoHideDelay);
        }

        // Log error
        this.logError(message, type, details);

        return errorElement;
    }

    /**
     * Show API error with appropriate messaging
     */
    showApiError(error, options = {}) {
        let message = 'An unexpected error occurred';
        let title = 'API Error';
        let type = 'error';

        if (error.name === 'NetworkError' || !navigator.onLine) {
            message = 'Unable to connect to the server. Please check your internet connection.';
            title = 'Connection Error';
        } else if (error.status === 429) {
            message = 'Too many requests. Please wait a moment before trying again.';
            title = 'Rate Limited';
            type = 'warning';
        } else if (error.status >= 500) {
            message = 'Server error. Our team has been notified and is working on a fix.';
            title = 'Server Error';
        } else if (error.status === 404) {
            message = 'The requested data could not be found.';
            title = 'Not Found';
        } else if (error.message) {
            message = error.message;
        }

        return this.showError(message, {
            type,
            title,
            details: this.formatErrorDetails(error),
            showDetails: true,
            ...options
        });
    }

    /**
     * Show network status indicator
     */
    showNetworkStatus(isOnline) {
        // Remove existing indicator
        const existing = document.getElementById('network-status-indicator');
        if (existing) {
            existing.remove();
        }

        const indicator = document.createElement('div');
        indicator.id = 'network-status-indicator';
        indicator.className = `offline-indicator ${isOnline ? 'online' : ''}`;

        const dot = document.createElement('div');
        dot.className = `network-status-dot ${isOnline ? 'online' : ''}`;

        const text = document.createElement('span');
        text.textContent = isOnline ? 'Back online' : 'You\'re offline';

        indicator.appendChild(dot);
        indicator.appendChild(text);
        document.body.appendChild(indicator);

        // Auto-hide online indicator
        if (isOnline) {
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.style.opacity = '0';
                    setTimeout(() => indicator.remove(), 300);
                }
            }, 3000);
        }
    }

    /**
     * Show fallback data warning
     */
    showFallbackWarning(source, container = null) {
        const messages = {
            'coindesk': 'Using CoinDesk API with approximate exchange rates.',
            'cache': 'Showing cached data. Some information may be outdated.',
            'sample': 'Using sample data. Please check your internet connection.'
        };

        const message = messages[source] || 'Using fallback data source.';

        return this.showError(message, {
            type: 'warning',
            title: 'Fallback Data',
            container,
            dismissible: true,
            autoHide: true,
            autoHideDelay: 8000
        });
    }

    /**
     * Show retry mechanism with countdown
     */
    showRetryCountdown(callback, delay = 5000, container = null) {
        let remainingTime = Math.ceil(delay / 1000);
        
        const errorElement = this.showError(
            `Retrying automatically in ${remainingTime} seconds...`,
            {
                type: 'info',
                title: 'Auto Retry',
                container,
                retryCallback: callback,
                retryText: 'Retry Now',
                dismissible: true
            }
        );

        const messageElement = errorElement.querySelector('.error-message');
        
        const countdownInterval = setInterval(() => {
            remainingTime--;
            if (remainingTime > 0) {
                messageElement.textContent = `Retrying automatically in ${remainingTime} seconds...`;
            } else {
                clearInterval(countdownInterval);
                this.hideError(errorElement);
                callback();
            }
        }, 1000);

        // Store interval for cleanup
        errorElement.dataset.countdownInterval = countdownInterval;

        return errorElement;
    }

    /**
     * Create error element
     */
    createErrorElement(options) {
        const {
            type,
            title,
            message,
            retryCallback,
            retryText,
            dismissible,
            showDetails,
            details
        } = options;

        const errorElement = document.createElement('div');
        errorElement.className = `error-container ${type}`;
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');

        const icons = {
            error: '⚠️',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const headerHtml = title ? `
            <div class="error-header">
                <div class="error-title">
                    <span class="error-icon">${icons[type] || '⚠️'}</span>
                    ${title}
                </div>
                ${dismissible ? '<button class="close-button" aria-label="Close error">×</button>' : ''}
            </div>
        ` : (dismissible ? `
            <div class="error-header">
                <div></div>
                <button class="close-button" aria-label="Close error">×</button>
            </div>
        ` : '');

        const actionsHtml = retryCallback ? `
            <div class="error-actions">
                <button class="error-button primary retry-button">${retryText}</button>
                ${showDetails ? '<button class="error-button details-button">Show Details</button>' : ''}
            </div>
        ` : (showDetails ? `
            <div class="error-actions">
                <button class="error-button details-button">Show Details</button>
            </div>
        ` : '');

        const detailsHtml = details ? `
            <div class="error-details">
                <pre>${details}</pre>
            </div>
        ` : '';

        errorElement.innerHTML = `
            ${headerHtml}
            <div class="error-message">${message}</div>
            ${actionsHtml}
            ${detailsHtml}
        `;

        // Add event listeners
        this.setupErrorElementEvents(errorElement, retryCallback);

        return errorElement;
    }

    setupErrorElementEvents(errorElement, retryCallback) {
        // Close button
        const closeButton = errorElement.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideError(errorElement);
            });
        }

        // Retry button
        const retryButton = errorElement.querySelector('.retry-button');
        if (retryButton && retryCallback) {
            retryButton.addEventListener('click', () => {
                this.hideError(errorElement);
                retryCallback();
            });
        }

        // Details button
        const detailsButton = errorElement.querySelector('.details-button');
        const detailsElement = errorElement.querySelector('.error-details');
        if (detailsButton && detailsElement) {
            detailsButton.addEventListener('click', () => {
                const isVisible = detailsElement.classList.contains('visible');
                detailsElement.classList.toggle('visible');
                detailsButton.textContent = isVisible ? 'Show Details' : 'Hide Details';
            });
        }
    }

    /**
     * Hide error with animation
     */
    hideError(errorElement) {
        if (!errorElement || !errorElement.parentNode) return;

        // Clear any countdown interval
        const intervalId = errorElement.dataset.countdownInterval;
        if (intervalId) {
            clearInterval(parseInt(intervalId));
        }

        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 300);
    }

    /**
     * Clear all errors from container
     */
    clearErrors(container = null) {
        const targetContainer = container || this.errorContainer;
        if (!targetContainer) return;

        const errors = targetContainer.querySelectorAll('.error-container');
        errors.forEach(error => this.hideError(error));
    }

    /**
     * Get or create global error container
     */
    getOrCreateErrorContainer() {
        if (!this.errorContainer) {
            this.errorContainer = document.getElementById('error-container');
            
            if (!this.errorContainer) {
                this.errorContainer = document.createElement('div');
                this.errorContainer.id = 'error-container';
                this.errorContainer.style.position = 'relative';
                this.errorContainer.style.zIndex = '50';
                
                // Insert after header or at top of body
                const header = document.querySelector('header');
                if (header && header.nextSibling) {
                    header.parentNode.insertBefore(this.errorContainer, header.nextSibling);
                } else {
                    document.body.insertBefore(this.errorContainer, document.body.firstChild);
                }
            }
        }
        
        return this.errorContainer;
    }

    /**
     * Handle network reconnection
     */
    handleNetworkReconnection() {
        // Trigger retry for any pending retry callbacks
        this.retryCallbacks.forEach((callback, key) => {
            callback();
            this.retryCallbacks.delete(key);
        });
    }

    /**
     * Log error for debugging
     */
    logError(error, context = 'unknown', details = null) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            error: error.toString(),
            context,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.errorHistory.unshift(errorLog);
        
        // Keep only recent errors
        if (this.errorHistory.length > this.maxErrorHistory) {
            this.errorHistory = this.errorHistory.slice(0, this.maxErrorHistory);
        }

        console.error('Error logged:', errorLog);
    }

    /**
     * Format error details for display
     */
    formatErrorDetails(error) {
        const details = {
            message: error.message || 'Unknown error',
            status: error.status || 'N/A',
            timestamp: new Date().toISOString()
        };

        if (error.stack) {
            details.stack = error.stack;
        }

        return JSON.stringify(details, null, 2);
    }

    /**
     * Get error history for debugging
     */
    getErrorHistory() {
        return [...this.errorHistory];
    }

    /**
     * Create container-specific error handler
     */
    createContainerHandler(container) {
        return {
            showError: (message, options) => this.showError(message, { ...options, container }),
            showApiError: (error, options) => this.showApiError(error, { ...options, container }),
            showFallback: (source) => this.showFallbackWarning(source, container),
            showRetry: (callback, delay) => this.showRetryCountdown(callback, delay, container),
            clearErrors: () => this.clearErrors(container)
        };
    }
}

export default ErrorHandler;