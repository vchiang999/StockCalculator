import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

interface AlphaVantageResponse {
    'Global Quote': {
        '01. symbol': string;
        '02. open': string;
        '03. high': string;
        '04. low': string;
        '05. price': string;
        '06. volume': string;
        '07. latest trading day': string;
        '08. previous close': string;
        '09. change': string;
        '10. change percent': string;
    };
}

interface StockResponse {
    success: boolean;
    data?: {
        symbol: string;
        currentPrice: number;
        previousClose: number;
        lastUpdated: string;
    };
    error?: {
        code: string;
        message: string;
    };
}

export async function stock(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const symbol = request.params.symbol;

    if (!symbol) {
        return {
            status: 400,
            jsonBody: {
                success: false,
                error: {
                    code: 'MISSING_SYMBOL',
                    message: 'Stock symbol is required'
                }
            } as StockResponse
        };
    }

    // Validate stock symbol format (1-5 characters, letters only)
    const symbolRegex = /^[A-Za-z]{1,5}$/;
    if (!symbolRegex.test(symbol)) {
        return {
            status: 400,
            jsonBody: {
                success: false,
                error: {
                    code: 'INVALID_SYMBOL',
                    message: 'Please enter a valid stock symbol (1-5 letters)'
                }
            } as StockResponse
        };
    }

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
        context.log('ERROR: Alpha Vantage API key not configured');
        return {
            status: 500,
            jsonBody: {
                success: false,
                error: {
                    code: 'API_UNAVAILABLE',
                    message: 'Stock data service is temporarily unavailable. Please try again later.'
                }
            } as StockResponse
        };
    }

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
            return {
                status: 502,
                jsonBody: {
                    success: false,
                    error: {
                        code: 'API_UNAVAILABLE',
                        message: 'Stock data service is temporarily unavailable. Please try again later.'
                    }
                } as StockResponse
            };
        }

        const data: AlphaVantageResponse = await response.json();
        
        // Check if the response contains valid data
        if (!data['Global Quote'] || !data['Global Quote']['01. symbol']) {
            context.log(`WARN: No data found for symbol: ${symbol}`);
            return {
                status: 404,
                jsonBody: {
                    success: false,
                    error: {
                        code: 'SYMBOL_NOT_FOUND',
                        message: 'Stock symbol not found. Please check the symbol and try again.'
                    }
                } as StockResponse
            };
        }

        const quote = data['Global Quote'];
        const currentPrice = parseFloat(quote['05. price']);
        const previousClose = parseFloat(quote['08. previous close']);

        // Round prices to 2 decimal places
        const roundedCurrentPrice = Math.round(currentPrice * 100) / 100;
        const roundedPreviousClose = Math.round(previousClose * 100) / 100;

        const stockData: StockResponse = {
            success: true,
            data: {
                symbol: quote['01. symbol'],
                currentPrice: roundedCurrentPrice,
                previousClose: roundedPreviousClose,
                lastUpdated: quote['07. latest trading day']
            }
        };

        context.log(`Successfully fetched data for ${symbol}: Current: $${roundedCurrentPrice}, Previous: $${roundedPreviousClose}`);

        return {
            status: 200,
            jsonBody: stockData,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // 5-minute cache
            }
        };

    } catch (error) {
        context.log('ERROR: Error fetching stock data:', error);
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
            return {
                status: 502,
                jsonBody: {
                    success: false,
                    error: {
                        code: 'NETWORK_ERROR',
                        message: 'Network connection error. Please check your internet connection.'
                    }
                } as StockResponse
            };
        }

        return {
            status: 500,
            jsonBody: {
                success: false,
                error: {
                    code: 'API_UNAVAILABLE',
                    message: 'Stock data service is temporarily unavailable. Please try again later.'
                }
            } as StockResponse
        };
    }
}

app.http('stock', {
    methods: ['GET'],
    route: 'stock/{symbol}',
    authLevel: 'anonymous',
    handler: stock
});