"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stock = stock;
const functions_1 = require("@azure/functions");
function stock(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
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
                }
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
                }
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
                }
            };
        }
        try {
            const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${apiKey}`;
            context.log(`Fetching stock data for symbol: ${symbol}`);
            const response = yield fetch(apiUrl, {
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
                    }
                };
            }
            const data = yield response.json();
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
                    }
                };
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
            context.log(`Successfully fetched data for ${symbol}: Current: $${roundedCurrentPrice}, Previous: $${roundedPreviousClose}`);
            return {
                status: 200,
                jsonBody: stockData,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=300' // 5-minute cache
                }
            };
        }
        catch (error) {
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
                    }
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
                }
            };
        }
    });
}
functions_1.app.http('stock', {
    methods: ['GET'],
    route: 'stock/{symbol}',
    authLevel: 'anonymous',
    handler: stock
});
//# sourceMappingURL=stock.js.map