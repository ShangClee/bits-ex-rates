/**
 * Loading Manager Module
 * Handles loading states, skeleton screens, and progress indicators
 */

class LoadingManager {
    constructor() {
        this.activeLoaders = new Set();
        this.skeletonTemplate = null;
        this.setupStyles();
        this.createSkeletonTemplate();
    }

    setupStyles() {
        if (!document.getElementById('loading-manager-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-manager-styles';
            style.textContent = `
                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                    backdrop-filter: blur(2px);
                    transition: opacity 0.3s ease;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e5e7eb;
                    border-top: 3px solid #2563eb;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .loading-dots {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }

                .loading-dot {
                    width: 8px;
                    height: 8px;
                    background: #2563eb;
                    border-radius: 50%;
                    animation: pulse 1.4s ease-in-out infinite both;
                }

                .loading-dot:nth-child(1) { animation-delay: -0.32s; }
                .loading-dot:nth-child(2) { animation-delay: -0.16s; }
                .loading-dot:nth-child(3) { animation-delay: 0s; }

                .skeleton-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }

                .skeleton-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 20px;
                    position: relative;
                    overflow: hidden;
                }

                .skeleton-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255, 255, 255, 0.6),
                        transparent
                    );
                    animation: shimmer 2s infinite;
                }

                .skeleton-line {
                    background: #e2e8f0;
                    border-radius: 4px;
                    margin-bottom: 8px;
                }

                .skeleton-line.flag {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: inline-block;
                    margin-right: 12px;
                }

                .skeleton-line.currency-name {
                    width: 80px;
                    height: 16px;
                    display: inline-block;
                    vertical-align: top;
                    margin-top: 4px;
                }

                .skeleton-line.currency-code {
                    width: 40px;
                    height: 12px;
                    margin-top: 4px;
                }

                .skeleton-line.rate-value {
                    width: 120px;
                    height: 20px;
                    margin-top: 8px;
                    margin-left: auto;
                }

                .progress-bar {
                    width: 100%;
                    height: 4px;
                    background: #e5e7eb;
                    border-radius: 2px;
                    overflow: hidden;
                    margin: 10px 0;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #2563eb, #3b82f6);
                    border-radius: 2px;
                    transition: width 0.3s ease;
                    width: 0%;
                }

                .loading-text {
                    color: #64748b;
                    font-size: 14px;
                    margin-top: 8px;
                    text-align: center;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes pulse {
                    0%, 80%, 100% {
                        transform: scale(0);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .loading-spinner,
                    .loading-dot,
                    .skeleton-card::before {
                        animation: none;
                    }
                    
                    .progress-fill {
                        transition: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createSkeletonTemplate() {
        this.skeletonTemplate = document.createElement('div');
        this.skeletonTemplate.className = 'skeleton-card';
        this.skeletonTemplate.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <div class="skeleton-line flag"></div>
                <div>
                    <div class="skeleton-line currency-name"></div>
                    <div class="skeleton-line currency-code"></div>
                </div>
            </div>
            <div class="skeleton-line rate-value"></div>
        `;
    }

    /**
     * Show loading spinner overlay on a container
     */
    showSpinner(container, options = {}) {
        if (!container) return null;

        const {
            type = 'spinner', // 'spinner' or 'dots'
            text = '',
            backdrop = true
        } = options;

        // Remove existing loader if present
        this.hideLoader(container);

        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.setAttribute('role', 'status');
        overlay.setAttribute('aria-live', 'polite');
        overlay.setAttribute('aria-label', text || 'Loading');

        if (!backdrop) {
            overlay.style.background = 'transparent';
            overlay.style.backdropFilter = 'none';
        }

        const loaderContent = document.createElement('div');
        loaderContent.style.textAlign = 'center';

        if (type === 'dots') {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'loading-dots';
            for (let i = 0; i < 3; i++) {
                const dot = document.createElement('div');
                dot.className = 'loading-dot';
                dotsContainer.appendChild(dot);
            }
            loaderContent.appendChild(dotsContainer);
        } else {
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            loaderContent.appendChild(spinner);
        }

        if (text) {
            const textElement = document.createElement('div');
            textElement.className = 'loading-text';
            textElement.textContent = text;
            loaderContent.appendChild(textElement);
        }

        overlay.appendChild(loaderContent);
        
        // Make container relative if not already positioned
        const computedStyle = window.getComputedStyle(container);
        if (computedStyle.position === 'static') {
            container.style.position = 'relative';
        }

        container.appendChild(overlay);
        this.activeLoaders.add(container);

        return overlay;
    }

    /**
     * Show skeleton screen for better perceived performance
     */
    showSkeleton(container, options = {}) {
        if (!container) return null;

        const {
            count = 6,
            columns = 'auto-fit',
            minWidth = '280px'
        } = options;

        // Remove existing content
        container.innerHTML = '';

        const skeletonContainer = document.createElement('div');
        skeletonContainer.className = 'skeleton-container';
        skeletonContainer.style.gridTemplateColumns = `repeat(${columns}, minmax(${minWidth}, 1fr))`;
        skeletonContainer.setAttribute('aria-label', 'Loading content');

        for (let i = 0; i < count; i++) {
            const skeleton = this.skeletonTemplate.cloneNode(true);
            skeleton.setAttribute('aria-hidden', 'true');
            skeletonContainer.appendChild(skeleton);
        }

        container.appendChild(skeletonContainer);
        container.style.display = 'block';
        this.activeLoaders.add(container);

        return skeletonContainer;
    }

    /**
     * Show progress bar with percentage
     */
    showProgress(container, options = {}) {
        if (!container) return null;

        const {
            progress = 0,
            text = '',
            showPercentage = true
        } = options;

        // Remove existing loader
        this.hideLoader(container);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.style.padding = '20px';
        progressContainer.style.textAlign = 'center';

        if (text) {
            const textElement = document.createElement('div');
            textElement.className = 'loading-text';
            textElement.textContent = text;
            progressContainer.appendChild(textElement);
        }

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
        
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);

        if (showPercentage) {
            const percentageText = document.createElement('div');
            percentageText.className = 'loading-text';
            percentageText.textContent = `${Math.round(progress)}%`;
            progressContainer.appendChild(percentageText);
        }

        container.innerHTML = '';
        container.appendChild(progressContainer);
        container.style.display = 'block';
        this.activeLoaders.add(container);

        return { progressContainer, progressFill };
    }

    /**
     * Update progress bar percentage
     */
    updateProgress(container, progress, text = null) {
        const progressFill = container.querySelector('.progress-fill');
        const percentageText = container.querySelector('.loading-text:last-child');
        
        if (progressFill) {
            progressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
        }
        
        if (percentageText && percentageText.textContent.includes('%')) {
            percentageText.textContent = `${Math.round(progress)}%`;
        }
        
        if (text) {
            const textElement = container.querySelector('.loading-text:first-child');
            if (textElement) {
                textElement.textContent = text;
            }
        }
    }

    /**
     * Hide any loader from container
     */
    hideLoader(container) {
        if (!container) return;

        const overlay = container.querySelector('.loading-overlay');
        const skeleton = container.querySelector('.skeleton-container');
        const progress = container.querySelector('.progress-container');

        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }

        if (skeleton) {
            container.removeChild(skeleton);
        }

        if (progress) {
            container.removeChild(progress);
        }

        this.activeLoaders.delete(container);
    }

    /**
     * Hide skeleton and show content with fade-in animation
     */
    hideSkeleton(container, callback = null) {
        const skeleton = container.querySelector('.skeleton-container');
        
        if (skeleton) {
            skeleton.style.opacity = '0';
            skeleton.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                if (skeleton.parentNode) {
                    skeleton.parentNode.removeChild(skeleton);
                }
                
                if (callback) {
                    callback();
                }
                
                // Fade in new content
                container.style.opacity = '0';
                container.offsetHeight; // Force reflow
                container.style.transition = 'opacity 0.3s ease';
                container.style.opacity = '1';
                
                setTimeout(() => {
                    container.style.transition = '';
                }, 300);
                
            }, 300);
        } else if (callback) {
            callback();
        }

        this.activeLoaders.delete(container);
    }

    /**
     * Show loading state for specific operation
     */
    showOperationLoading(operation, container, options = {}) {
        const loadingTexts = {
            'fetching-rates': 'Fetching latest rates...',
            'updating-data': 'Updating data...',
            'processing': 'Processing...',
            'saving': 'Saving...',
            'loading': 'Loading...'
        };

        const text = options.text || loadingTexts[operation] || 'Loading...';
        
        return this.showSpinner(container, {
            ...options,
            text
        });
    }

    /**
     * Simulate progressive loading with multiple steps
     */
    async showProgressiveLoading(container, steps, onStep = null) {
        const stepCount = steps.length;
        let currentStep = 0;

        const { progressFill } = this.showProgress(container, {
            progress: 0,
            text: steps[0],
            showPercentage: true
        });

        for (const step of steps) {
            const progress = (currentStep / stepCount) * 100;
            
            this.updateProgress(container, progress, step);
            
            if (onStep) {
                await onStep(step, currentStep, stepCount);
            }
            
            // Simulate step duration
            await this.wait(500);
            currentStep++;
        }

        // Complete progress
        this.updateProgress(container, 100, 'Complete!');
        await this.wait(500);
    }

    /**
     * Check if container is currently loading
     */
    isLoading(container) {
        return this.activeLoaders.has(container);
    }

    /**
     * Hide all active loaders
     */
    hideAllLoaders() {
        this.activeLoaders.forEach(container => {
            this.hideLoader(container);
        });
        this.activeLoaders.clear();
    }

    /**
     * Get count of active loaders
     */
    getActiveLoaderCount() {
        return this.activeLoaders.size;
    }

    /**
     * Utility method to wait for specified time
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Create a loading state manager for a specific container
     */
    createContainerManager(container) {
        return {
            showSpinner: (options) => this.showSpinner(container, options),
            showSkeleton: (options) => this.showSkeleton(container, options),
            showProgress: (options) => this.showProgress(container, options),
            updateProgress: (progress, text) => this.updateProgress(container, progress, text),
            hideLoader: () => this.hideLoader(container),
            hideSkeleton: (callback) => this.hideSkeleton(container, callback),
            isLoading: () => this.isLoading(container),
            showOperation: (operation, options) => this.showOperationLoading(operation, container, options)
        };
    }
}

export default LoadingManager;