// DOM elements
const stockSymbolInput = document.getElementById('stockSymbol');
const searchBtn = document.getElementById('searchBtn');
const loadingDiv = document.getElementById('loading');
const resultsSection = document.getElementById('results');
const errorSection = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

// Result display elements
const stockName = document.getElementById('stockName');
const currentPrice = document.getElementById('currentPrice');
const previousClose = document.getElementById('previousClose');
const gainTargets = document.getElementById('gainTargets');
const lossTargets = document.getElementById('lossTargets');

// Application state
let isLoading = false;

// Event listeners
searchBtn.addEventListener('click', handleSearch);
stockSymbolInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Input validation and formatting
stockSymbolInput.addEventListener('input', (e) => {
    // Convert to uppercase and limit to 5 characters
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
});

// Main search handler
async function handleSearch() {
    const symbol = stockSymbolInput.value.trim();
    
    if (!validateSymbol(symbol)) {
        showError('Please enter a valid stock symbol (1-5 letters)');
        return;
    }
    
    if (isLoading) return;
    
    try {
        setLoadingState(true);
        hideError();
        hideResults();
        
        // Call the Azure Function API
        const stockData = await fetchStockData(symbol);
        displayStockData(stockData);
        
    } catch (error) {
        setLoadingState(false);
        console.error('Search error:', error);
        
        // Handle different types of errors
        if (error.code) {
            showError(getErrorMessage(error.code));
        } else {
            showError('An unexpected error occurred. Please try again.');
        }
    }
}

// API functions
async function fetchStockData(symbol) {
    const apiUrl = `/api/stock/${symbol.toUpperCase()}`;
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            // Handle API errors
            if (result.error) {
                const error = new Error(result.error.message);
                error.code = result.error.code;
                throw error;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }
        
        if (!result.success || !result.data) {
            throw new Error('Invalid response format from API');
        }
        
        return result.data;
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            const networkError = new Error('Network connection error. Please check your internet connection.');
            networkError.code = 'NETWORK_ERROR';
            throw networkError;
        }
        throw error;
    }
}

// Error message mapping
function getErrorMessage(errorCode) {
    const errorMessages = {
        'INVALID_SYMBOL': 'Please enter a valid stock symbol (1-5 letters)',
        'SYMBOL_NOT_FOUND': 'Stock symbol not found. Please check the symbol and try again.',
        'API_UNAVAILABLE': 'Stock data service is temporarily unavailable. Please try again later.',
        'NETWORK_ERROR': 'Network connection error. Please check your internet connection.',
        'RATE_LIMITED': 'Too many requests. Please wait a moment before searching again.',
        'MISSING_SYMBOL': 'Please enter a stock symbol'
    };
    
    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
}

// Validation functions
function validateSymbol(symbol) {
    return symbol && symbol.length >= 1 && symbol.length <= 5 && /^[A-Z]+$/.test(symbol);
}

// UI state management
function setLoadingState(loading) {
    isLoading = loading;
    searchBtn.disabled = loading;
    stockSymbolInput.disabled = loading;
    
    if (loading) {
        loadingDiv.classList.remove('hidden');
    } else {
        loadingDiv.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
}

function hideError() {
    errorSection.classList.add('hidden');
}

function showResults() {
    resultsSection.classList.remove('hidden');
    errorSection.classList.add('hidden');
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

// Price calculation functions
function calculatePriceTargets(basePrice) {
    return {
        gains: {
            five: roundPrice(basePrice * 1.05),
            ten: roundPrice(basePrice * 1.10),
            fifteen: roundPrice(basePrice * 1.15)
        },
        losses: {
            five: roundPrice(basePrice * 0.95),
            ten: roundPrice(basePrice * 0.90),
            fifteen: roundPrice(basePrice * 0.85)
        }
    };
}

function roundPrice(price) {
    return Math.round(price * 100) / 100;
}

// Display functions
function displayStockData(stockData) {
    // Set loading state to false when displaying data
    setLoadingState(false);
    
    // Display stock information
    stockName.textContent = `${stockData.symbol}`;
    currentPrice.textContent = `Current: $${stockData.currentPrice.toFixed(2)}`;
    previousClose.textContent = `Previous Close: $${stockData.previousClose.toFixed(2)}`;
    
    // Calculate and display price targets based on previous close
    const targets = calculatePriceTargets(stockData.previousClose);
    
    // Display gain targets
    gainTargets.innerHTML = `
        <div class="target-item">
            <span class="percentage">+5%</span>
            <span class="price">$${targets.gains.five.toFixed(2)}</span>
        </div>
        <div class="target-item">
            <span class="percentage">+10%</span>
            <span class="price">$${targets.gains.ten.toFixed(2)}</span>
        </div>
        <div class="target-item">
            <span class="percentage">+15%</span>
            <span class="price">$${targets.gains.fifteen.toFixed(2)}</span>
        </div>
    `;
    
    // Display loss targets
    lossTargets.innerHTML = `
        <div class="target-item">
            <span class="percentage">-5%</span>
            <span class="price">$${targets.losses.five.toFixed(2)}</span>
        </div>
        <div class="target-item">
            <span class="percentage">-10%</span>
            <span class="price">$${targets.losses.ten.toFixed(2)}</span>
        </div>
        <div class="target-item">
            <span class="percentage">-15%</span>
            <span class="price">$${targets.losses.fifteen.toFixed(2)}</span>
        </div>
    `;
    
    showResults();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Stock Price Calculator initialized');
    stockSymbolInput.focus();
});