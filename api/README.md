# Stock Calculator API

This Azure Functions API provides stock data integration with Alpha Vantage.

## Setup

1. Copy `local.settings.json.template` to `local.settings.json`
2. Add your Alpha Vantage API key to the `ALPHA_VANTAGE_API_KEY` setting
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Start the function: `npm start`

## API Endpoints

### GET /api/stock/{symbol}

Fetches stock data for the given symbol.

**Parameters:**
- `symbol` (string): Stock symbol (1-5 letters, e.g., "AAPL", "MSFT")

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "AAPL",
    "currentPrice": 150.25,
    "previousClose": 149.50,
    "lastUpdated": "2024-01-15"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "SYMBOL_NOT_FOUND",
    "message": "Stock symbol not found. Please check the symbol and try again."
  }
}
```

## Error Codes

- `MISSING_SYMBOL`: No symbol provided in the request
- `INVALID_SYMBOL`: Invalid symbol format (must be 1-5 letters)
- `SYMBOL_NOT_FOUND`: Symbol not found in Alpha Vantage database
- `API_UNAVAILABLE`: Alpha Vantage API is unavailable or API key not configured
- `NETWORK_ERROR`: Network connection error

## Testing

The function includes comprehensive error handling and validation:
- Input validation for stock symbols
- API key validation
- Network error handling
- Response format validation
- Price rounding to 2 decimal places

## Alpha Vantage Integration

This function uses the Alpha Vantage GLOBAL_QUOTE API to fetch:
- Current stock price
- Previous trading day's closing price
- Latest trading day date
- Stock symbol validation

Rate limits: 5 API requests per minute, 500 requests per day (free tier)