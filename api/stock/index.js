module.exports = async function (context, req) {
    context.log('Http function processed request for url "' + req.url + '"');

    const symbol = req.params.symbol;

    if (!symbol) {
        context.res = {
            status: 400,
            body: {
                success: false,
                error: {
                    code: 'MISSING_SYMBOL',
                    message: 'Stock symbol is required'
                }
            }
        };
        return;
    }

    // Validate stock symbol format (1-5 characters, letters only)
    const symbolRegex = /^[A-Za-z]{1,5}$/;
    if (!symbolRegex.test(symbol)) {
        context.res = {
            status: 400,
            body: {
                success: false,
                error: {
                    code: 'INVALID_SYMBOL',
                    message: 'Please enter a valid stock symbol (1-5 letters)'
                }
            }
        };
        return;
    }

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

    try {
        const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${apiKey}`;
        
        context.log(`Fetching stock data for symbol: ${symbol}`);
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Stock-Calculator/1.0'
            }
        });

        if (!response.ok) {
            context.log(`ERROR: Alpha Vantage API returned status: ${response.status}`);
            context.res = {
                status: 502,
                body: {
                    success: false,
                    error: {
                        code: 'API_UNAVAILABLE',
                        message: 'Stock data service is temporarily unavailable. Please try again later.'
                    }
                }
            };
            return;
        }

        const data = await response.json();
        
        // Check if the response contains valid data
        if (!data['Global Quote'] || !data['Global Quote']['01. symbol']) {
            context.log(`WARN: No data found for symbol: ${symbol}`);
            context.res = {
                status: 404,
                body: {
                    success: false,
                    error: {
                        code: 'SYMBOL_NOT_FOUND',
                        message: 'Stock symbol not found. Please check the symbol and try again.'
                    }
                }
            };
            return;
        }

        const quote = data['Global Quote'];
        const currentPrice = parseFloat(quote['05. price']);
        const previousClose = parseFloat(quote['08. previous close']);

        // Round prices to 2 decimal places
        const roundedCurrentPrice = Math.round(currentPrice * 100) / 100;
        const roundedPreviousClose = Math.round(previousClose * 100) / 100;

        const stockData = {
            success: true,
            data: {
                symbol: quote['01. symbol'],
                currentPrice: roundedCurrentPrice,
                previousClose: roundedPreviousClose,
                lastUpdated: quote['07. latest trading day']
            }
        };

        context.log(`Successfully fetched data for ${symbol}: Current: ${roundedCurrentPrice}, Previous: ${roundedPreviousClose}`);

        context.res = {
            status: 200,
            body: stockData,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // 5-minute cache
            }
        };

    } catch (error) {
        context.log('ERROR: Error fetching stock data:', error);
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
            context.res = {
                status: 502,
                body: {
                    success: false,
                    error: {
                        code: 'NETWORK_ERROR',
                        message: 'Network connection error. Please check your internet connection.'
                    }
                }
            };
            return;
        }

        context.res = {
            status: 500,
            body: {
                success: false,
                error: {
                    code: 'API_UNAVAILABLE',
                    message: 'Stock data service is temporarily unavailable. Please try again later.'
                }
            }
        };
    }
};