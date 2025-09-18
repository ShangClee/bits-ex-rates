/**
 * Data Visualization Module
 * Provides basic data visualization features including percentage changes,
 * comparison views, and statistical information
 */

import { formatNumber, formatCurrency } from '../data/formatter.js';

class DataVisualizationManager {
    constructor() {
        this.historicalData = new Map();
        this.comparisonMode = false;
        this.selectedCurrencies = new Set();
        this.priceHistory = [];
        this.setupStyles();
        this.setupEventListeners();
        
        // Mock historical data for demonstration
        this.initializeMockData();
    }

    setupStyles() {
        if (!document.getElementById('data-visualization-styles')) {
            const style = document.createElement('style');
            style.id = 'data-visualization-styles';
            style.textContent = `
                /* Percentage Change Indicators */
                .rate-change {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    margin-top: 4px;
                }

                .rate-change--positive {
                    color: #10b981;
                }

                .rate-change--negative {
                    color: #ef4444;
                }

                .rate-change--neutral {
                    color: #64748b;
                }

                .rate-change-icon {
                    width: 12px;
                    height: 12px;
                    display: inline-block;
                }

                .rate-change-value {
                    font-weight: 600;
                }

                /* Comparison Mode */
                .comparison-mode-toggle {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 8px 12px;
                    font-size: 14px;
                    cursor: pointer;
                    z-index: 100;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.2s ease;
                }

                .comparison-mode-toggle:hover {
                    background: var(--bg-secondary);
                    transform: translateY(-1px);
                }

                .comparison-mode-toggle.active {
                    background: var(--color-primary);
                    color: white;
                    border-color: var(--color-primary);
                }

                .rate-card.comparison-selected {
                    outline: 2px solid var(--color-primary);
                    outline-offset: 2px;
                    background: var(--bg-secondary);
                }

                .rate-card.comparison-mode {
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .rate-card.comparison-mode:hover {
                    outline: 1px solid var(--color-primary);
                    outline-offset: 2px;
                }

                /* Comparison Panel */
                .comparison-panel {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: var(--bg-primary);
                    border-top: 1px solid var(--border-color);
                    padding: 20px;
                    transform: translateY(100%);
                    transition: transform 0.3s ease;
                    z-index: 200;
                    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
                    max-height: 50vh;
                    overflow-y: auto;
                }

                .comparison-panel.show {
                    transform: translateY(0);
                }

                .comparison-panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 16px;
                }

                .comparison-panel-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                }

                .comparison-panel-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: var(--text-secondary);
                    padding: 4px;
                }

                .comparison-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                }

                .comparison-item {
                    background: var(--bg-secondary);
                    border-radius: 8px;
                    padding: 16px;
                    border: 1px solid var(--border-color);
                }

                .comparison-item-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .comparison-item-flag {
                    font-size: 20px;
                }

                .comparison-item-name {
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .comparison-item-stats {
                    display: grid;
                    gap: 8px;
                }

                .comparison-stat {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 14px;
                }

                .comparison-stat-label {
                    color: var(--text-secondary);
                }

                .comparison-stat-value {
                    font-weight: 500;
                    color: var(--text-primary);
                }

                /* Statistics Panel */
                .stats-panel {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                }

                .stats-panel-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 16px;
                }

                .stat-item {
                    text-align: center;
                    padding: 12px;
                    background: var(--bg-primary);
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                }

                .stat-value {
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--color-primary);
                    margin-bottom: 4px;
                }

                .stat-label {
                    font-size: 12px;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* Trend Indicators */
                .trend-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .trend-indicator--up {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }

                .trend-indicator--down {
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .trend-indicator--stable {
                    background: rgba(100, 116, 139, 0.1);
                    color: #64748b;
                }

                .trend-arrow {
                    width: 8px;
                    height: 8px;
                }

                /* Mini Chart */
                .mini-chart {
                    width: 60px;
                    height: 20px;
                    margin-top: 4px;
                }

                .mini-chart-line {
                    fill: none;
                    stroke: var(--color-primary);
                    stroke-width: 1.5;
                    opacity: 0.7;
                }

                .mini-chart-area {
                    fill: var(--color-primary);
                    opacity: 0.1;
                }

                /* Mobile Responsive */
                @media (max-width: 640px) {
                    .comparison-mode-toggle {
                        top: 60px;
                        right: 16px;
                        padding: 6px 10px;
                        font-size: 12px;
                    }

                    .comparison-panel {
                        padding: 16px;
                    }

                    .comparison-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }

                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                    }

                    .stat-item {
                        padding: 8px;
                    }

                    .stat-value {
                        font-size: 16px;
                    }
                }

                /* Dark Theme Support */
                [data-theme="dark"] .comparison-mode-toggle {
                    background: var(--bg-primary);
                    border-color: var(--border-color);
                    color: var(--text-primary);
                }

                [data-theme="dark"] .comparison-panel {
                    background: var(--bg-primary);
                    border-top-color: var(--border-color);
                }

                [data-theme="dark"] .comparison-item {
                    background: var(--bg-secondary);
                    border-color: var(--border-color);
                }

                [data-theme="dark"] .stats-panel {
                    background: var(--bg-secondary);
                    border-color: var(--border-color);
                }

                [data-theme="dark"] .stat-item {
                    background: var(--bg-primary);
                    border-color: var(--border-color);
                }

                /* Reduced Motion */
                @media (prefers-reduced-motion: reduce) {
                    .comparison-panel,
                    .comparison-mode-toggle,
                    .rate-card.comparison-mode {
                        transition: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupEventListeners() {
        // Listen for rate updates to calculate changes
        document.addEventListener('ratesUpdated', (event) => {
            this.handleRateUpdate(event.detail);
        });

        // Listen for new rate cards
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList?.contains('rate-card')) {
                            this.enhanceRateCard(node);
                        } else {
                            const rateCards = node.querySelectorAll?.('.rate-card');
                            rateCards?.forEach(card => this.enhanceRateCard(card));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Setup comparison mode toggle
        this.setupComparisonMode();
        
        // Setup statistics panel
        this.setupStatisticsPanel();
    }

    initializeMockData() {
        // Initialize with some mock historical data for demonstration
        const currencies = ['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad'];
        const now = Date.now();
        
        currencies.forEach(currency => {
            const baseRate = this.getRandomRate(currency);
            const history = [];
            
            // Generate 24 hours of mock data (hourly)
            for (let i = 24; i >= 0; i--) {
                const timestamp = now - (i * 60 * 60 * 1000);
                const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
                const rate = baseRate * (1 + variation);
                
                history.push({
                    timestamp,
                    rate,
                    volume: Math.random() * 1000000
                });
            }
            
            this.historicalData.set(currency, history);
        });
    }

    getRandomRate(currency) {
        const baseRates = {
            'usd': 43000,
            'eur': 39000,
            'gbp': 34000,
            'jpy': 6400000,
            'aud': 65000,
            'cad': 58000
        };
        return baseRates[currency] || 43000;
    }

    enhanceRateCard(card) {
        if (card.querySelector('.rate-change')) {
            return; // Already enhanced
        }

        const currencyCode = card.dataset.currency;
        const currentRate = parseFloat(card.dataset.rate);
        
        if (!currencyCode || !currentRate) return;

        // Add percentage change indicator
        this.addPercentageChange(card, currencyCode, currentRate);
        
        // Add mini trend chart
        this.addMiniChart(card, currencyCode);
        
        // Add comparison mode functionality
        this.addComparisonMode(card);
    }

    addPercentageChange(card, currencyCode, currentRate) {
        const history = this.historicalData.get(currencyCode);
        if (!history || history.length < 2) return;

        const previousRate = history[history.length - 2].rate;
        const change = currentRate - previousRate;
        const changePercent = (change / previousRate) * 100;

        const changeElement = document.createElement('div');
        changeElement.className = `rate-change ${
            changePercent > 0 ? 'rate-change--positive' : 
            changePercent < 0 ? 'rate-change--negative' : 
            'rate-change--neutral'
        }`;

        const icon = changePercent > 0 ? '↗' : changePercent < 0 ? '↘' : '→';
        const sign = changePercent > 0 ? '+' : '';
        
        changeElement.innerHTML = `
            <span class="rate-change-icon">${icon}</span>
            <span class="rate-change-value">${sign}${Math.abs(changePercent).toFixed(2)}%</span>
        `;

        // Insert after rate value
        const rateValue = card.querySelector('.rate-value');
        if (rateValue) {
            rateValue.appendChild(changeElement);
        }
    }

    addMiniChart(card, currencyCode) {
        const history = this.historicalData.get(currencyCode);
        if (!history || history.length < 5) return;

        const chartContainer = document.createElement('div');
        chartContainer.className = 'mini-chart-container';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'mini-chart');
        svg.setAttribute('viewBox', '0 0 60 20');
        svg.setAttribute('preserveAspectRatio', 'none');

        // Get last 10 data points
        const recentHistory = history.slice(-10);
        const rates = recentHistory.map(h => h.rate);
        const minRate = Math.min(...rates);
        const maxRate = Math.max(...rates);
        const range = maxRate - minRate || 1;

        // Create path for line chart
        const pathData = recentHistory.map((point, index) => {
            const x = (index / (recentHistory.length - 1)) * 60;
            const y = 20 - ((point.rate - minRate) / range) * 20;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'mini-chart-line');
        path.setAttribute('d', pathData);

        svg.appendChild(path);
        chartContainer.appendChild(svg);

        // Add to card
        const currencyInfo = card.querySelector('.currency-info');
        if (currencyInfo) {
            currencyInfo.appendChild(chartContainer);
        }
    }

    addComparisonMode(card) {
        if (this.comparisonMode) {
            card.classList.add('comparison-mode');
            
            card.addEventListener('click', (e) => {
                if (this.comparisonMode) {
                    e.preventDefault();
                    this.toggleCurrencySelection(card);
                }
            });
        }
    }

    setupComparisonMode() {
        // Create comparison mode toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'comparison-mode-toggle';
        toggleButton.innerHTML = '📊 Compare';
        toggleButton.setAttribute('aria-label', 'Toggle comparison mode');
        
        toggleButton.addEventListener('click', () => {
            this.toggleComparisonMode();
        });

        document.body.appendChild(toggleButton);
        this.comparisonToggle = toggleButton;

        // Create comparison panel
        this.createComparisonPanel();
    }

    toggleComparisonMode() {
        this.comparisonMode = !this.comparisonMode;
        
        if (this.comparisonMode) {
            this.comparisonToggle.classList.add('active');
            this.comparisonToggle.innerHTML = '✕ Exit Compare';
            this.enableComparisonMode();
        } else {
            this.comparisonToggle.classList.remove('active');
            this.comparisonToggle.innerHTML = '📊 Compare';
            this.disableComparisonMode();
        }
    }

    enableComparisonMode() {
        // Add comparison mode to all rate cards
        const rateCards = document.querySelectorAll('.rate-card');
        rateCards.forEach(card => {
            card.classList.add('comparison-mode');
            card.addEventListener('click', this.handleCardClick.bind(this));
        });

        // Show instructions
        this.showComparisonInstructions();
    }

    disableComparisonMode() {
        // Remove comparison mode from all rate cards
        const rateCards = document.querySelectorAll('.rate-card');
        rateCards.forEach(card => {
            card.classList.remove('comparison-mode', 'comparison-selected');
            card.removeEventListener('click', this.handleCardClick.bind(this));
        });

        // Clear selections and hide panel
        this.selectedCurrencies.clear();
        this.hideComparisonPanel();
    }

    handleCardClick(event) {
        if (!this.comparisonMode) return;
        
        event.preventDefault();
        event.stopPropagation();
        
        this.toggleCurrencySelection(event.currentTarget);
    }

    toggleCurrencySelection(card) {
        const currencyCode = card.dataset.currency;
        
        if (this.selectedCurrencies.has(currencyCode)) {
            this.selectedCurrencies.delete(currencyCode);
            card.classList.remove('comparison-selected');
        } else {
            if (this.selectedCurrencies.size < 4) { // Limit to 4 currencies
                this.selectedCurrencies.add(currencyCode);
                card.classList.add('comparison-selected');
            }
        }

        this.updateComparisonPanel();
    }

    createComparisonPanel() {
        const panel = document.createElement('div');
        panel.className = 'comparison-panel';
        panel.innerHTML = `
            <div class="comparison-panel-header">
                <h3 class="comparison-panel-title">Currency Comparison</h3>
                <button class="comparison-panel-close" aria-label="Close comparison panel">&times;</button>
            </div>
            <div class="comparison-grid"></div>
        `;

        panel.querySelector('.comparison-panel-close').addEventListener('click', () => {
            this.hideComparisonPanel();
        });

        document.body.appendChild(panel);
        this.comparisonPanel = panel;
    }

    updateComparisonPanel() {
        if (this.selectedCurrencies.size === 0) {
            this.hideComparisonPanel();
            return;
        }

        const grid = this.comparisonPanel.querySelector('.comparison-grid');
        grid.innerHTML = '';

        this.selectedCurrencies.forEach(currencyCode => {
            const comparisonItem = this.createComparisonItem(currencyCode);
            grid.appendChild(comparisonItem);
        });

        this.showComparisonPanel();
    }

    createComparisonItem(currencyCode) {
        const card = document.querySelector(`[data-currency="${currencyCode}"]`);
        if (!card) return document.createElement('div');

        const currencyInfo = this.getCurrencyInfo(currencyCode);
        const stats = this.calculateCurrencyStats(currencyCode);

        const item = document.createElement('div');
        item.className = 'comparison-item';
        item.innerHTML = `
            <div class="comparison-item-header">
                <span class="comparison-item-flag">${currencyInfo.flag}</span>
                <span class="comparison-item-name">${currencyInfo.name}</span>
            </div>
            <div class="comparison-item-stats">
                <div class="comparison-stat">
                    <span class="comparison-stat-label">Current Rate</span>
                    <span class="comparison-stat-value">${card.querySelector('.rate-value').textContent}</span>
                </div>
                <div class="comparison-stat">
                    <span class="comparison-stat-label">24h Change</span>
                    <span class="comparison-stat-value ${stats.change24h >= 0 ? 'rate-change--positive' : 'rate-change--negative'}">
                        ${stats.change24h >= 0 ? '+' : ''}${stats.change24h.toFixed(2)}%
                    </span>
                </div>
                <div class="comparison-stat">
                    <span class="comparison-stat-label">Volatility</span>
                    <span class="comparison-stat-value">${stats.volatility.toFixed(2)}%</span>
                </div>
                <div class="comparison-stat">
                    <span class="comparison-stat-label">Trend</span>
                    <span class="comparison-stat-value">
                        <span class="trend-indicator trend-indicator--${stats.trend}">
                            ${stats.trend === 'up' ? '↗' : stats.trend === 'down' ? '↘' : '→'} ${stats.trend}
                        </span>
                    </span>
                </div>
            </div>
        `;

        return item;
    }

    getCurrencyInfo(currencyCode) {
        // This would normally come from the currency config
        const currencies = {
            'usd': { name: 'US Dollar', flag: '🇺🇸' },
            'eur': { name: 'Euro', flag: '🇪🇺' },
            'gbp': { name: 'British Pound', flag: '🇬🇧' },
            'jpy': { name: 'Japanese Yen', flag: '🇯🇵' },
            'aud': { name: 'Australian Dollar', flag: '🇦🇺' },
            'cad': { name: 'Canadian Dollar', flag: '🇨🇦' }
        };
        
        return currencies[currencyCode] || { name: currencyCode.toUpperCase(), flag: '🏳️' };
    }

    calculateCurrencyStats(currencyCode) {
        const history = this.historicalData.get(currencyCode);
        if (!history || history.length < 2) {
            return { change24h: 0, volatility: 0, trend: 'stable' };
        }

        const current = history[history.length - 1].rate;
        const previous24h = history[0].rate;
        const change24h = ((current - previous24h) / previous24h) * 100;

        // Calculate volatility (standard deviation of returns)
        const returns = [];
        for (let i = 1; i < history.length; i++) {
            const returnRate = (history[i].rate - history[i-1].rate) / history[i-1].rate;
            returns.push(returnRate);
        }
        
        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
        const volatility = Math.sqrt(variance) * 100;

        // Determine trend
        const recentRates = history.slice(-5).map(h => h.rate);
        const trend = this.calculateTrend(recentRates);

        return { change24h, volatility, trend };
    }

    calculateTrend(rates) {
        if (rates.length < 3) return 'stable';
        
        let upCount = 0;
        let downCount = 0;
        
        for (let i = 1; i < rates.length; i++) {
            if (rates[i] > rates[i-1]) upCount++;
            else if (rates[i] < rates[i-1]) downCount++;
        }
        
        if (upCount > downCount * 1.5) return 'up';
        if (downCount > upCount * 1.5) return 'down';
        return 'stable';
    }

    showComparisonPanel() {
        this.comparisonPanel.classList.add('show');
    }

    hideComparisonPanel() {
        this.comparisonPanel.classList.remove('show');
    }

    showComparisonInstructions() {
        // Show a temporary instruction tooltip
        const instruction = document.createElement('div');
        instruction.className = 'comparison-instruction';
        instruction.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 16px 20px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            text-align: center;
            max-width: 300px;
        `;
        instruction.innerHTML = `
            <p style="margin: 0; color: var(--text-primary); font-weight: 500;">
                Click on rate cards to compare currencies
            </p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: var(--text-secondary);">
                Select up to 4 currencies
            </p>
        `;

        document.body.appendChild(instruction);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (instruction.parentNode) {
                instruction.parentNode.removeChild(instruction);
            }
        }, 3000);
    }

    setupStatisticsPanel() {
        // Create statistics panel that shows overall market stats
        const statsPanel = document.createElement('div');
        statsPanel.className = 'stats-panel';
        statsPanel.innerHTML = `
            <div class="stats-panel-title">
                📈 Market Statistics
            </div>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value" id="avg-change">--</div>
                    <div class="stat-label">Avg Change</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="highest-rate">--</div>
                    <div class="stat-label">Highest Rate</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="lowest-rate">--</div>
                    <div class="stat-label">Lowest Rate</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="volatility-index">--</div>
                    <div class="stat-label">Volatility</div>
                </div>
            </div>
        `;

        // Insert after the main navigation
        const navigation = document.querySelector('.navigation');
        if (navigation) {
            navigation.parentNode.insertBefore(statsPanel, navigation.nextSibling);
        }

        this.statsPanel = statsPanel;
        this.updateStatistics();
    }

    updateStatistics() {
        if (!this.statsPanel) return;

        const allCards = document.querySelectorAll('.rate-card');
        if (allCards.length === 0) return;

        const rates = [];
        const changes = [];

        allCards.forEach(card => {
            const rate = parseFloat(card.dataset.rate);
            if (rate) {
                rates.push(rate);
                
                const changeElement = card.querySelector('.rate-change-value');
                if (changeElement) {
                    const changeText = changeElement.textContent.replace('%', '').replace('+', '');
                    const change = parseFloat(changeText);
                    if (!isNaN(change)) {
                        changes.push(change);
                    }
                }
            }
        });

        if (rates.length === 0) return;

        // Calculate statistics
        const avgChange = changes.length > 0 ? 
            changes.reduce((sum, c) => sum + c, 0) / changes.length : 0;
        const highestRate = Math.max(...rates);
        const lowestRate = Math.min(...rates);
        const volatility = changes.length > 0 ? 
            Math.sqrt(changes.reduce((sum, c) => sum + Math.pow(c - avgChange, 2), 0) / changes.length) : 0;

        // Update display
        const avgChangeEl = this.statsPanel.querySelector('#avg-change');
        const highestRateEl = this.statsPanel.querySelector('#highest-rate');
        const lowestRateEl = this.statsPanel.querySelector('#lowest-rate');
        const volatilityEl = this.statsPanel.querySelector('#volatility-index');

        if (avgChangeEl) {
            avgChangeEl.textContent = `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`;
            avgChangeEl.className = `stat-value ${avgChange >= 0 ? 'rate-change--positive' : 'rate-change--negative'}`;
        }

        if (highestRateEl) {
            highestRateEl.textContent = formatNumber(highestRate);
        }

        if (lowestRateEl) {
            lowestRateEl.textContent = formatNumber(lowestRate);
        }

        if (volatilityEl) {
            volatilityEl.textContent = `${volatility.toFixed(1)}%`;
            volatilityEl.className = `stat-value ${
                volatility > 5 ? 'rate-change--negative' : 
                volatility > 2 ? 'rate-change--neutral' : 
                'rate-change--positive'
            }`;
        }
    }

    handleRateUpdate(rateData) {
        // Update historical data with new rates
        Object.entries(rateData).forEach(([currency, rate]) => {
            const history = this.historicalData.get(currency) || [];
            history.push({
                timestamp: Date.now(),
                rate: rate,
                volume: Math.random() * 1000000
            });

            // Keep only last 24 hours of data
            const cutoff = Date.now() - (24 * 60 * 60 * 1000);
            const filteredHistory = history.filter(h => h.timestamp > cutoff);
            
            this.historicalData.set(currency, filteredHistory);
        });

        // Update statistics
        setTimeout(() => {
            this.updateStatistics();
        }, 100);
    }

    // Public API methods
    getHistoricalData(currency) {
        return this.historicalData.get(currency) || [];
    }

    getMarketStatistics() {
        const allCards = document.querySelectorAll('.rate-card');
        const stats = {
            totalCurrencies: allCards.length,
            averageChange: 0,
            volatilityIndex: 0,
            trendingUp: 0,
            trendingDown: 0
        };

        const changes = [];
        allCards.forEach(card => {
            const changeElement = card.querySelector('.rate-change-value');
            if (changeElement) {
                const changeText = changeElement.textContent.replace('%', '').replace('+', '');
                const change = parseFloat(changeText);
                if (!isNaN(change)) {
                    changes.push(change);
                    if (change > 0) stats.trendingUp++;
                    else if (change < 0) stats.trendingDown++;
                }
            }
        });

        if (changes.length > 0) {
            stats.averageChange = changes.reduce((sum, c) => sum + c, 0) / changes.length;
            const avgChange = stats.averageChange;
            stats.volatilityIndex = Math.sqrt(
                changes.reduce((sum, c) => sum + Math.pow(c - avgChange, 2), 0) / changes.length
            );
        }

        return stats;
    }

    // Cleanup method
    destroy() {
        if (this.comparisonToggle) {
            this.comparisonToggle.remove();
        }
        
        if (this.comparisonPanel) {
            this.comparisonPanel.remove();
        }
        
        if (this.statsPanel) {
            this.statsPanel.remove();
        }

        // Remove styles
        const styles = document.getElementById('data-visualization-styles');
        if (styles) {
            styles.remove();
        }

        // Clear data
        this.historicalData.clear();
        this.selectedCurrencies.clear();
    }
}

// Export for use in other modules
export default DataVisualizationManager;