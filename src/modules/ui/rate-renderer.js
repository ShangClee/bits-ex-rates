/**
 * Rate Rendering Module
 * Factory pattern for creating different types of rate cards with enhanced UI
 */

import { formatNumber, formatCurrency, formatLargeNumber } from '../data/formatter.js';

class RateRenderer {
    constructor() {
        this.cardTypes = {
            'fiat-per-btc': this.createFiatPerBtcCard.bind(this),
            'btc-per-fiat': this.createBtcPerFiatCard.bind(this),
            'fiat-per-bits': this.createFiatPerBitsCard.bind(this),
            'bits-per-fiat': this.createBitsPerFiatCard.bind(this),
            'fiat-per-satoshi': this.createFiatPerSatoshiCard.bind(this),
            'satoshi-per-fiat': this.createSatoshiPerFiatCard.bind(this)
        };
        
        this.animationDelay = 50; // Stagger animation for multiple cards
        this.setupStyles();
    }

    setupStyles() {
        // Inject enhanced card styles if not already present
        if (!document.getElementById('rate-renderer-styles')) {
            const style = document.createElement('style');
            style.id = 'rate-renderer-styles';
            style.textContent = `
                .rate-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    transform: translateY(0);
                    opacity: 1;
                }
                
                .rate-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
                
                .rate-card.entering {
                    opacity: 0;
                    transform: translateY(20px);
                }
                
                .rate-card.entering.animate-in {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .currency-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }
                
                .currency-flag {
                    font-size: 24px;
                    line-height: 1;
                    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
                }
                
                .currency-details {
                    flex: 1;
                }
                
                .currency-name {
                    font-weight: 600;
                    font-size: 14px;
                    color: #1a1a1a;
                    margin: 0;
                }
                
                .currency-code {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin: 0;
                }
                
                .rate-value {
                    font-size: 18px;
                    font-weight: 700;
                    color: #2563eb;
                    text-align: right;
                    word-break: break-all;
                }
                
                .rate-unit {
                    font-size: 14px;
                    font-weight: 500;
                    color: #64748b;
                    margin-left: 4px;
                }
                
                .rate-card[data-card-type="btc"] .rate-value {
                    color: #f59e0b;
                }
                
                .rate-card[data-card-type="bits"] .rate-value {
                    color: #10b981;
                }
                
                .rate-card[data-card-type="satoshi"] .rate-value {
                    color: #8b5cf6;
                }
                
                .rate-precision {
                    font-size: 12px;
                    opacity: 0.7;
                }
                
                @media (prefers-reduced-motion: reduce) {
                    .rate-card {
                        transition: none;
                    }
                    
                    .rate-card:hover {
                        transform: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Factory method to create rate cards based on type
     */
    createRateCard(type, currencyCode, config, ...args) {
        const factory = this.cardTypes[type];
        if (!factory) {
            throw new Error(`Unknown card type: ${type}`);
        }
        
        return factory(currencyCode, config, ...args);
    }

    /**
     * Render multiple rate cards with staggered animation
     */
    renderRateCards(container, type, currencies, rates) {
        if (!container || !rates) {
            console.warn('Invalid container or rates provided to renderRateCards');
            return;
        }

        // Clear existing content
        container.innerHTML = '';
        
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        let animationIndex = 0;
        
        Object.entries(currencies).forEach(([code, config]) => {
            if (rates[code]) {
                const card = this.createRateCard(type, code, config, rates[code], config.amount);
                
                // Add entrance animation
                card.classList.add('entering');
                
                // Stagger the animation
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, animationIndex * this.animationDelay);
                
                fragment.appendChild(card);
                animationIndex++;
            }
        });
        
        container.appendChild(fragment);
        container.style.display = 'grid';
    }

    /**
     * Update existing card with new data
     */
    updateRateCard(card, newValue, animated = true) {
        const rateValueElement = card.querySelector('.rate-value');
        if (!rateValueElement) return;

        if (animated) {
            // Add update animation
            rateValueElement.style.transition = 'color 0.3s ease';
            rateValueElement.style.color = '#10b981'; // Green for update
            
            setTimeout(() => {
                rateValueElement.textContent = newValue;
                rateValueElement.style.color = ''; // Reset to default
            }, 150);
        } else {
            rateValueElement.textContent = newValue;
        }
    }

    // BTC Card Creation Methods
    createFiatPerBtcCard(currencyCode, config, rate) {
        const card = this.createBaseCard('btc');
        
        const formattedRate = formatCurrency(rate, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        card.innerHTML = `
            <div class="currency-info">
                <span class="currency-flag" role="img" aria-label="${config.name} flag">${config.flag}</span>
                <div class="currency-details">
                    <div class="currency-name">1 BTC</div>
                    <div class="currency-code">${currencyCode}</div>
                </div>
            </div>
            <div class="rate-value" aria-label="${formattedRate} ${config.name}">
                ${config.symbol}${formattedRate}
            </div>
        `;

        this.addCardMetadata(card, {
            currencyCode,
            rate,
            type: 'fiat-per-btc',
            unit: 'BTC'
        });

        return card;
    }

    createBtcPerFiatCard(currencyCode, config, rate, fiatAmount) {
        const card = this.createBaseCard('btc');
        
        const btcAmount = fiatAmount / rate;
        const formattedBtc = this.formatBtcAmount(btcAmount);
        const formattedFiat = formatNumber(fiatAmount);

        card.innerHTML = `
            <div class="currency-info">
                <span class="currency-flag" role="img" aria-label="${config.name} flag">${config.flag}</span>
                <div class="currency-details">
                    <div class="currency-name">${config.symbol}${formattedFiat}</div>
                    <div class="currency-code">${currencyCode}</div>
                </div>
            </div>
            <div class="rate-value" aria-label="${formattedBtc} Bitcoin">
                ${formattedBtc}<span class="rate-unit">BTC</span>
            </div>
        `;

        this.addCardMetadata(card, {
            currencyCode,
            rate,
            fiatAmount,
            btcAmount,
            type: 'btc-per-fiat',
            unit: 'BTC'
        });

        return card;
    }

    // BITS Card Creation Methods
    createFiatPerBitsCard(currencyCode, config, rate) {
        const card = this.createBaseCard('bits');
        
        const bitsRate = rate / 1000000; // Convert BTC to BITS
        const formattedRate = this.formatBitsRate(bitsRate);

        card.innerHTML = `
            <div class="currency-info">
                <span class="currency-flag" role="img" aria-label="${config.name} flag">${config.flag}</span>
                <div class="currency-details">
                    <div class="currency-name">1 BITS</div>
                    <div class="currency-code">${currencyCode}</div>
                </div>
            </div>
            <div class="rate-value" aria-label="${formattedRate} ${config.name}">
                ${config.symbol}${formattedRate}
            </div>
        `;

        this.addCardMetadata(card, {
            currencyCode,
            rate: bitsRate,
            type: 'fiat-per-bits',
            unit: 'BITS'
        });

        return card;
    }

    createBitsPerFiatCard(currencyCode, config, rate, fiatAmount) {
        const card = this.createBaseCard('bits');
        
        const bitsRate = rate / 1000000; // Convert BTC to BITS rate
        const bitsAmount = fiatAmount / bitsRate;
        const formattedBits = formatLargeNumber(bitsAmount, 'BITS');
        const formattedFiat = formatNumber(fiatAmount);

        card.innerHTML = `
            <div class="currency-info">
                <span class="currency-flag" role="img" aria-label="${config.name} flag">${config.flag}</span>
                <div class="currency-details">
                    <div class="currency-name">${config.symbol}${formattedFiat}</div>
                    <div class="currency-code">${currencyCode}</div>
                </div>
            </div>
            <div class="rate-value" aria-label="${formattedBits}">
                ${formattedBits}
            </div>
        `;

        this.addCardMetadata(card, {
            currencyCode,
            rate: bitsRate,
            fiatAmount,
            bitsAmount,
            type: 'bits-per-fiat',
            unit: 'BITS'
        });

        return card;
    }

    // Satoshi Card Creation Methods
    createFiatPerSatoshiCard(currencyCode, config, rate) {
        const card = this.createBaseCard('satoshi');
        
        const satoshiRate = rate / 100000000; // Convert BTC to Satoshi
        const formattedRate = this.formatSatoshiRate(satoshiRate);

        card.innerHTML = `
            <div class="currency-info">
                <span class="currency-flag" role="img" aria-label="${config.name} flag">${config.flag}</span>
                <div class="currency-details">
                    <div class="currency-name">1 Satoshi</div>
                    <div class="currency-code">${currencyCode}</div>
                </div>
            </div>
            <div class="rate-value" aria-label="${formattedRate} ${config.name}">
                ${config.symbol}${formattedRate}
            </div>
        `;

        this.addCardMetadata(card, {
            currencyCode,
            rate: satoshiRate,
            type: 'fiat-per-satoshi',
            unit: 'sats'
        });

        return card;
    }

    createSatoshiPerFiatCard(currencyCode, config, rate, fiatAmount) {
        const card = this.createBaseCard('satoshi');
        
        const satoshiRate = rate / 100000000; // Convert BTC to Satoshi rate
        const satoshiAmount = fiatAmount / satoshiRate;
        const formattedSatoshi = formatLargeNumber(satoshiAmount, 'sats');
        const formattedFiat = formatNumber(fiatAmount);

        card.innerHTML = `
            <div class="currency-info">
                <span class="currency-flag" role="img" aria-label="${config.name} flag">${config.flag}</span>
                <div class="currency-details">
                    <div class="currency-name">${config.symbol}${formattedFiat}</div>
                    <div class="currency-code">${currencyCode}</div>
                </div>
            </div>
            <div class="rate-value" aria-label="${formattedSatoshi}">
                ${formattedSatoshi}
            </div>
        `;

        this.addCardMetadata(card, {
            currencyCode,
            rate: satoshiRate,
            fiatAmount,
            satoshiAmount,
            type: 'satoshi-per-fiat',
            unit: 'sats'
        });

        return card;
    }

    // Helper Methods
    createBaseCard(cardType) {
        const card = document.createElement('div');
        card.className = 'rate-card';
        card.setAttribute('data-card-type', cardType);
        card.setAttribute('role', 'article');
        card.setAttribute('tabindex', '0');
        
        // Add hover and focus effects
        card.addEventListener('mouseenter', this.handleCardHover.bind(this));
        card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
        card.addEventListener('focus', this.handleCardFocus.bind(this));
        card.addEventListener('blur', this.handleCardBlur.bind(this));
        
        return card;
    }

    addCardMetadata(card, metadata) {
        // Store metadata for potential future use (sorting, filtering, etc.)
        card.dataset.currency = metadata.currencyCode;
        card.dataset.type = metadata.type;
        card.dataset.unit = metadata.unit;
        
        if (metadata.rate !== undefined) {
            card.dataset.rate = metadata.rate.toString();
        }
    }

    formatBtcAmount(btcAmount) {
        if (btcAmount >= 1) {
            return btcAmount.toFixed(4);
        } else if (btcAmount >= 0.001) {
            return btcAmount.toFixed(6);
        } else {
            return btcAmount.toExponential(2);
        }
    }

    formatBitsRate(bitsRate) {
        // Format with 6 decimal places and add space after 3 digits
        const sixDecimalRate = bitsRate.toFixed(6);
        return sixDecimalRate.replace(/(\.\d{3})(\d{3})$/, '$1 $2');
    }

    formatSatoshiRate(satoshiRate) {
        // Format very small numbers appropriately
        if (satoshiRate < 0.000001) {
            return satoshiRate.toExponential(2);
        } else {
            return satoshiRate.toFixed(8);
        }
    }

    // Event Handlers
    handleCardHover(event) {
        const card = event.currentTarget;
        card.style.zIndex = '10';
        
        // Add subtle scale effect
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            card.style.transform = 'translateY(-4px) scale(1.02)';
        }
    }

    handleCardLeave(event) {
        const card = event.currentTarget;
        card.style.zIndex = '';
        
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            card.style.transform = '';
        }
    }

    handleCardFocus(event) {
        const card = event.currentTarget;
        card.style.outline = '2px solid #2563eb';
        card.style.outlineOffset = '2px';
    }

    handleCardBlur(event) {
        const card = event.currentTarget;
        card.style.outline = '';
        card.style.outlineOffset = '';
    }

    // Public utility methods
    getAllCards(container) {
        return container ? Array.from(container.querySelectorAll('.rate-card')) : [];
    }

    getCardByCurrency(container, currencyCode) {
        return container ? container.querySelector(`[data-currency="${currencyCode}"]`) : null;
    }

    sortCardsByRate(container, ascending = true) {
        const cards = this.getAllCards(container);
        const sortedCards = cards.sort((a, b) => {
            const rateA = parseFloat(a.dataset.rate) || 0;
            const rateB = parseFloat(b.dataset.rate) || 0;
            return ascending ? rateA - rateB : rateB - rateA;
        });

        // Re-append in sorted order
        sortedCards.forEach(card => container.appendChild(card));
    }

    filterCardsByCurrency(container, searchTerm) {
        const cards = this.getAllCards(container);
        const term = searchTerm.toLowerCase();

        cards.forEach(card => {
            const currency = card.dataset.currency.toLowerCase();
            const currencyName = card.querySelector('.currency-name')?.textContent.toLowerCase() || '';
            const matches = currency.includes(term) || currencyName.includes(term);
            
            card.style.display = matches ? '' : 'none';
        });
    }
}

// Export for use in other modules
export default RateRenderer;