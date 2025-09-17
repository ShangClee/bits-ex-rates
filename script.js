// Currency configurations with symbols and names
const currencies = {
    'usd': { name: 'US Dollar', symbol: '$', flag: '🇺🇸', amount: 1 },
    'eur': { name: 'Euro', symbol: '€', flag: '🇪🇺', amount: 1 },
    'gbp': { name: 'British Pound', symbol: '£', flag: '🇬🇧', amount: 1 },
    'jpy': { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', amount: 100 },
    'aud': { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', amount: 1 },
    'cad': { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', amount: 1 },
    'chf': { name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', amount: 1 },
    'cny': { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', amount: 1 },
    'sek': { name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', amount: 10 },
    'nzd': { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', amount: 1 },
    'mxn': { name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', amount: 10 },
    'sgd': { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', amount: 1 },
    'hkd': { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', amount: 10 },
    'nok': { name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', amount: 10 },
    'try': { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', amount: 10 },
    'zar': { name: 'South African Rand', symbol: 'R', flag: '🇿🇦', amount: 10 },
    'brl': { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', amount: 1 },
    'inr': { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', amount: 10 },
    'krw': { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', amount: 1000 },
    'twd': { name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼', amount: 10 }
};

let currentRates = {};

const SAMPLE_RATES = {
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.25,
    BTC: 0.000021
};

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update display if we have rates
    if (Object.keys(currentRates).length > 0) {
        if (pageId === 'fiat-per-bits') {
            displayFiatPerBits(currentRates);
        } else {
            displayBitsPerFiat(currentRates);
        }
    }
}

async function fetchRates() {
    const display = document.querySelector('.rate-card');
    display.innerHTML = '<p>Loading rates...</p>';
    
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        currentRates = data.rates;
    } catch (error) {
        console.warn('API Error:', error);
        currentRates = SAMPLE_RATES;
        display.innerHTML += '<p class="error">Using sample rates due to API error</p>';
    }
    
    updateDisplay();
}

function hideAllContainers() {
    document.getElementById('fiatPerBitsContainer').style.display = 'none';
    document.getElementById('bitsPerFiatContainer').style.display = 'none';
}

function displayCurrentPage() {
    const activePage = document.querySelector('.page.active');
    if (activePage.id === 'fiat-per-bits') {
        displayFiatPerBits(currentRates);
    } else {
        displayBitsPerFiat(currentRates);
    }
}

function displayFiatPerBits(bitcoinRates) {
    const container = document.getElementById('fiatPerBitsContainer');
    container.innerHTML = '';

    Object.entries(currencies).forEach(([code, config]) => {
        if (bitcoinRates[code]) {
            const bitcoinPrice = bitcoinRates[code];
            const bitsRate = bitcoinPrice / 1000000; // Convert BTC to BITS
            
            const rateCard = createFiatPerBitsCard(code, config, bitsRate);
            container.appendChild(rateCard);
        }
    });

    document.getElementById('loading').style.display = 'none';
    container.style.display = 'grid';
}

function displayBitsPerFiat(bitcoinRates) {
    const container = document.getElementById('bitsPerFiatContainer');
    container.innerHTML = '';

    Object.entries(currencies).forEach(([code, config]) => {
        if (bitcoinRates[code]) {
            const bitcoinPrice = bitcoinRates[code];
            const bitsRate = bitcoinPrice / 1000000; // Convert BTC to BITS rate
            
            const amount = config.amount;
            const bitsAmount = amount / bitsRate; // How many BITS you can buy
            const rateCard = createBitsPerFiatCard(code, config, amount, bitsAmount);
            container.appendChild(rateCard);
        }
    });

    document.getElementById('loading').style.display = 'none';
    container.style.display = 'grid';
}

function createFiatPerBitsCard(currencyCode, config, rate) {
    const card = document.createElement('div');
    card.className = 'rate-card';
    
    // Format the rate with 6 decimal places and space after 3 digits
    const sixDecimalRate = rate.toFixed(6);
    const formattedRate = sixDecimalRate.replace(/(\.\d{3})(\d{3})$/, '$1 $2');
    
    card.innerHTML = `
        <div class="currency-info">
            <span class="currency-flag">${config.flag}</span>
            <div>
                <div class="currency-name">1 BITS</div>
                <div style="font-size: 12px; color: #666;">${currencyCode.toUpperCase()}</div>
            </div>
        </div>
        <div class="rate-value">
            ${config.symbol}${formattedRate}
        </div>
    `;
    
    return card;
}

function createBitsPerFiatCard(currencyCode, config, fiatAmount, bitsAmount) {
    const card = document.createElement('div');
    card.className = 'rate-card';
    
    // Format BITS amount with 2 decimal places
    const formattedBits = bitsAmount >= 1000000 
        ? (bitsAmount / 1000000).toFixed(2) + 'M'
        : bitsAmount >= 1000
        ? (bitsAmount / 1000).toFixed(2) + 'K'
        : bitsAmount.toFixed(2);
    
    card.innerHTML = `
        <div class="currency-info">
            <span class="currency-flag">${config.flag}</span>
            <div>
                <div class="currency-name">${config.symbol}${fiatAmount}</div>
                <div style="font-size: 12px; color: #666;">${currencyCode.toUpperCase()}</div>
            </div>
        </div>
        <div class="rate-value">
            ${formattedBits} BITS
        </div>
    `;
    
    return card;
}

function showFallbackRates() {
    // Sample rates for testing when API fails
    const sampleRates = {
        'usd': 43000, 'eur': 39000, 'gbp': 34000, 'jpy': 6400000,
        'aud': 65000, 'cad': 58000, 'chf': 38000, 'cny': 310000,
        'sek': 460000, 'nzd': 71000, 'mxn': 740000, 'sgd': 58000,
        'hkd': 340000, 'nok': 470000, 'try': 1480000, 'zar': 780000,
        'brl': 220000, 'inr': 3600000, 'krw': 57000000, 'twd': 1390000
    };
    
    setTimeout(() => {
        document.getElementById('error').innerHTML = `
            <strong>API Error - Showing Sample Rates</strong><br>
            For live rates, please host this file on a web server.<br>
            <small>Quick fix: Use Python: <code>python -m http.server 8000</code> then visit <code>http://localhost:8000</code></small>
        `;
        currentRates = sampleRates;
        displayCurrentPage();
    }, 2000);
}

function showError(message) {
    const errorEl = document.getElementById('error');
    errorEl.innerHTML = message;
    errorEl.style.display = 'block';
    document.getElementById('loading').style.display = 'none';
}

function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleString();
    document.getElementById('lastUpdate