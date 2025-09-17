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

// Sample rates for fallback when API fails
const SAMPLE_RATES = {
    'usd': 43000, 'eur': 39000, 'gbp': 34000, 'jpy': 6400000,
    'aud': 65000, 'cad': 58000, 'chf': 38000, 'cny': 310000,
    'sek': 460000, 'nzd': 71000, 'mxn': 740000, 'sgd': 58000,
    'hkd': 340000, 'nok': 470000, 'try': 1480000, 'zar': 780000,
    'brl': 220000, 'inr': 3600000, 'krw': 57000000, 'twd': 1390000
};

// Main tab switching functionality
function showMainTab(tabId) {
    // Hide all main tabs
    document.querySelectorAll('.main-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all main tab buttons
    document.querySelectorAll('.main-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected main tab
    document.getElementById(tabId + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Show/hide sub-navigation based on tab
    const btcSubNav = document.getElementById('btc-sub-navigation');
    const btsSubNav = document.getElementById('bts-sub-navigation');
    const stsSubNav = document.getElementById('sts-sub-navigation');
    
    // Hide all sub-navigations first
    btcSubNav.style.display = 'none';
    btsSubNav.style.display = 'none';
    stsSubNav.style.display = 'none';
    
    // Show the appropriate sub-navigation
    if (tabId === 'btc') {
        btcSubNav.style.display = 'flex';
    } else if (tabId === 'bts') {
        btsSubNav.style.display = 'flex';
    } else if (tabId === 'sts') {
        stsSubNav.style.display = 'flex';
    }
    
    // Display appropriate content
    if (Object.keys(currentRates).length > 0) {
        displayCurrentActiveTab();
    }
}

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
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    hideAllContainers();
    
    try {
        // Use a simpler API that works better with CORS
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const btcUsdRate = data.bpi.USD.rate_float;
        
        // Convert to other currencies using approximate rates
        currentRates = {
            'usd': btcUsdRate,
            'eur': btcUsdRate * 0.85,
            'gbp': btcUsdRate * 0.73,
            'jpy': btcUsdRate * 110,
            'aud': btcUsdRate * 1.35,
            'cad': btcUsdRate * 1.25,
            'chf': btcUsdRate * 0.88,
            'cny': btcUsdRate * 6.4,
            'sek': btcUsdRate * 9.5,
            'nzd': btcUsdRate * 1.45,
            'mxn': btcUsdRate * 18,
            'sgd': btcUsdRate * 1.35,
            'hkd': btcUsdRate * 7.8,
            'nok': btcUsdRate * 9.2,
            'try': btcUsdRate * 27,
            'zar': btcUsdRate * 15,
            'brl': btcUsdRate * 5.2,
            'inr': btcUsdRate * 83,
            'krw': btcUsdRate * 1300,
            'twd': btcUsdRate * 31
        };
        
        updateLastUpdateTime();
        displayCurrentActiveTab();
        
    } catch (error) {
        console.warn('API Error:', error);
        showError('API Error - Using sample rates. For live rates, please ensure internet connection.');
        currentRates = SAMPLE_RATES;
        displayCurrentActiveTab();
    }
}

function hideAllContainers() {
    // BTC containers
    document.getElementById('fiatPerBtcContainer').style.display = 'none';
    document.getElementById('btcPerFiatContainer').style.display = 'none';
    // BTS containers
    document.getElementById('fiatPerBitsContainer').style.display = 'none';
    document.getElementById('bitsPerFiatContainer').style.display = 'none';
    // STS containers
    document.getElementById('fiatPerSatoshiContainer').style.display = 'none';
    document.getElementById('satoshiPerFiatContainer').style.display = 'none';
}

function displayCurrentActiveTab() {
    const activeMainTab = document.querySelector('.main-tab.active');
    if (activeMainTab) {
        const tabId = activeMainTab.id.replace('-tab', '');
        if (tabId === 'btc') {
            displayCurrentBtcPage();
        } else if (tabId === 'bts') {
            displayCurrentBtsPage();
        } else if (tabId === 'sts') {
            displayCurrentStsPage();
        }
    }
}

function displayCurrentBtcPage() {
    const activePage = document.querySelector('#btc-tab .page.active');
    if (activePage && activePage.id === 'fiat-per-btc') {
        displayFiatPerBtc(currentRates);
    } else if (activePage && activePage.id === 'btc-per-fiat') {
        displayBtcPerFiat(currentRates);
    } else {
        displayFiatPerBtc(currentRates);
    }
}

function displayCurrentBtsPage() {
    const activePage = document.querySelector('#bts-tab .page.active');
    if (activePage && activePage.id === 'fiat-per-bits') {
        displayFiatPerBits(currentRates);
    } else if (activePage && activePage.id === 'bits-per-fiat') {
        displayBitsPerFiat(currentRates);
    } else {
        displayFiatPerBits(currentRates);
    }
}

function displayCurrentStsPage() {
    const activePage = document.querySelector('#sts-tab .page.active');
    if (activePage && activePage.id === 'fiat-per-satoshi') {
        displayFiatPerSatoshi(currentRates);
    } else if (activePage && activePage.id === 'satoshi-per-fiat') {
        displaySatoshiPerFiat(currentRates);
    } else {
        displayFiatPerSatoshi(currentRates);
    }
}

function showPage(pageId) {
    // Get the current active main tab to determine which pages to work with
    const activeMainTab = document.querySelector('.main-tab.active');
    if (!activeMainTab) return;
    
    // Hide all pages within the active main tab
    activeMainTab.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all nav buttons in all sub-navigations
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update display based on the page
    if (Object.keys(currentRates).length > 0) {
        if (pageId === 'fiat-per-btc') {
            displayFiatPerBtc(currentRates);
        } else if (pageId === 'btc-per-fiat') {
            displayBtcPerFiat(currentRates);
        } else if (pageId === 'fiat-per-bits') {
            displayFiatPerBits(currentRates);
        } else if (pageId === 'bits-per-fiat') {
            displayBitsPerFiat(currentRates);
        } else if (pageId === 'fiat-per-satoshi') {
            displayFiatPerSatoshi(currentRates);
        } else if (pageId === 'satoshi-per-fiat') {
            displaySatoshiPerFiat(currentRates);
        }
    }
}

// BTC Tab Functions
function displayFiatPerBtc(bitcoinRates) {
    const container = document.getElementById('fiatPerBtcContainer');
    container.innerHTML = '';

    if (!bitcoinRates || Object.keys(bitcoinRates).length === 0) {
        document.getElementById('loading').style.display = 'none';
        showError('No exchange rate data available');
        return;
    }

    Object.entries(currencies).forEach(([code, config]) => {
        if (bitcoinRates[code]) {
            const bitcoinPrice = bitcoinRates[code];
            const rateCard = createFiatPerBtcCard(code, config, bitcoinPrice);
            container.appendChild(rateCard);
        }
    });

    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    container.style.display = 'grid';
}

function displayBtcPerFiat(bitcoinRates) {
    const container = document.getElementById('btcPerFiatContainer');
    container.innerHTML = '';

    if (!bitcoinRates || Object.keys(bitcoinRates).length === 0) {
        document.getElementById('loading').style.display = 'none';
        showError('No exchange rate data available');
        return;
    }

    Object.entries(currencies).forEach(([code, config]) => {
        if (bitcoinRates[code]) {
            const bitcoinPrice = bitcoinRates[code];
            const amount = config.amount;
            const btcAmount = amount / bitcoinPrice; // How much BTC you can buy
            const rateCard = createBtcPerFiatCard(code, config, amount, btcAmount);
            container.appendChild(rateCard);
        }
    });

    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    container.style.display = 'grid';
}

// STS Tab Functions
function displayFiatPerSatoshi(bitcoinRates) {
    const container = document.getElementById('fiatPerSatoshiContainer');
    container.innerHTML = '';

    if (!bitcoinRates || Object.keys(bitcoinRates).length === 0) {
        document.getElementById('loading').style.display = 'none';
        showError('No exchange rate data available');
        return;
    }

    Object.entries(currencies).forEach(([code, config]) => {
        if (bitcoinRates[code]) {
            const bitcoinPrice = bitcoinRates[code];
            const satoshiRate = bitcoinPrice / 100000000; // Convert BTC to Satoshi
            const rateCard = createFiatPerSatoshiCard(code, config, satoshiRate);
            container.appendChild(rateCard);
        }
    });

    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    container.style.display = 'grid';
}

function displaySatoshiPerFiat(bitcoinRates) {
    const container = document.getElementById('satoshiPerFiatContainer');
    container.innerHTML = '';

    if (!bitcoinRates || Object.keys(bitcoinRates).length === 0) {
        document.getElementById('loading').style.display = 'none';
        showError('No exchange rate data available');
        return;
    }

    Object.entries(currencies).forEach(([code, config]) => {
        if (bitcoinRates[code]) {
            const bitcoinPrice = bitcoinRates[code];
            const satoshiRate = bitcoinPrice / 100000000; // Convert BTC to Satoshi rate
            const amount = config.amount;
            const satoshiAmount = amount / satoshiRate; // How many Satoshi you can buy
            const rateCard = createSatoshiPerFiatCard(code, config, amount, satoshiAmount);
            container.appendChild(rateCard);
        }
    });

    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    container.style.display = 'grid';
}

function displayFiatPerBits(bitcoinRates) {
    const container = document.getElementById('fiatPerBitsContainer');
    container.innerHTML = '';

    if (!bitcoinRates || Object.keys(bitcoinRates).length === 0) {
        document.getElementById('loading').style.display = 'none';
        showError('No exchange rate data available');
        return;
    }

    Object.entries(currencies).forEach(([code, config]) => {
        if (bitcoinRates[code]) {
            const bitcoinPrice = bitcoinRates[code];
            const bitsRate = bitcoinPrice / 1000000; // Convert BTC to BITS
            
            const rateCard = createFiatPerBitsCard(code, config, bitsRate);
            container.appendChild(rateCard);
        }
    });

    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    container.style.display = 'grid';
}

function displayBitsPerFiat(bitcoinRates) {
    const container = document.getElementById('bitsPerFiatContainer');
    container.innerHTML = '';

    if (!bitcoinRates || Object.keys(bitcoinRates).length === 0) {
        document.getElementById('loading').style.display = 'none';
        showError('No exchange rate data available');
        return;
    }

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
    document.getElementById('error').style.display = 'none';
    container.style.display = 'grid';
}

// BTC Card Creation Functions
function createFiatPerBtcCard(currencyCode, config, rate) {
    const card = document.createElement('div');
    card.className = 'rate-card';
    
    const formattedRate = rate.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    card.innerHTML = `
        <div class="currency-info">
            <span class="currency-flag">${config.flag}</span>
            <div>
                <div class="currency-name">1 BTC</div>
                <div style="font-size: 12px; color: #666;">${currencyCode.toUpperCase()}</div>
            </div>
        </div>
        <div class="rate-value">
            ${config.symbol}${formattedRate}
        </div>
    `;
    
    return card;
}

function createBtcPerFiatCard(currencyCode, config, fiatAmount, btcAmount) {
    const card = document.createElement('div');
    card.className = 'rate-card';
    
    // Format BTC amount with appropriate precision
    const formattedBtc = btcAmount >= 1 
        ? btcAmount.toFixed(4)
        : btcAmount >= 0.001
        ? btcAmount.toFixed(6)
        : btcAmount.toExponential(2);
    
    card.innerHTML = `
        <div class="currency-info">
            <span class="currency-flag">${config.flag}</span>
            <div>
                <div class="currency-name">${config.symbol}${fiatAmount}</div>
                <div style="font-size: 12px; color: #666;">${currencyCode.toUpperCase()}</div>
            </div>
        </div>
        <div class="rate-value">
            ${formattedBtc} BTC
        </div>
    `;
    
    return card;
}

// STS Card Creation Functions
function createFiatPerSatoshiCard(currencyCode, config, rate) {
    const card = document.createElement('div');
    card.className = 'rate-card';
    
    // Format very small numbers with appropriate precision
    const formattedRate = rate < 0.000001 
        ? rate.toExponential(2)
        : rate.toFixed(8);
    
    card.innerHTML = `
        <div class="currency-info">
            <span class="currency-flag">${config.flag}</span>
            <div>
                <div class="currency-name">1 Satoshi</div>
                <div style="font-size: 12px; color: #666;">${currencyCode.toUpperCase()}</div>
            </div>
        </div>
        <div class="rate-value">
            ${config.symbol}${formattedRate}
        </div>
    `;
    
    return card;
}

function createSatoshiPerFiatCard(currencyCode, config, fiatAmount, satoshiAmount) {
    const card = document.createElement('div');
    card.className = 'rate-card';
    
    // Format Satoshi amount with appropriate precision
    const formattedSatoshi = satoshiAmount >= 1000000000 
        ? (satoshiAmount / 1000000000).toFixed(2) + 'B'
        : satoshiAmount >= 1000000
        ? (satoshiAmount / 1000000).toFixed(2) + 'M'
        : satoshiAmount >= 1000
        ? (satoshiAmount / 1000).toFixed(2) + 'K'
        : satoshiAmount.toFixed(0);
    
    card.innerHTML = `
        <div class="currency-info">
            <span class="currency-flag">${config.flag}</span>
            <div>
                <div class="currency-name">${config.symbol}${fiatAmount}</div>
                <div style="font-size: 12px; color: #666;">${currencyCode.toUpperCase()}</div>
            </div>
        </div>
        <div class="rate-value">
            ${formattedSatoshi} sats
        </div>
    `;
    
    return card;
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

function showError(message) {
    const errorEl = document.getElementById('error');
    errorEl.innerHTML = message;
    errorEl.style.display = 'block';
    document.getElementById('loading').style.display = 'none';
}

function updateLastUpdateTime(usingSampleData = false) {
    const now = new Date();
    const timeString = now.toLocaleString();
    const prefix = usingSampleData ? 'Sample data loaded: ' : 'Last updated: ';
    document.getElementById('lastUpdate').textContent = `${prefix}${timeString}`;
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Start with sample data to avoid loading issues
    currentRates = SAMPLE_RATES;
    updateLastUpdateTime(true);
    displayCurrentActiveTab();
    
    // Then try to fetch real data
    fetchRates();
});