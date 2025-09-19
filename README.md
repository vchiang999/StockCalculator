# Stock Price Calculator

A modern, responsive web application that calculates stock price targets based on percentage gains and losses. Built for Azure Static Web Apps with Azure Functions backend.

## Features

- Real-time stock price lookup
- Calculate price targets for +5%, +10%, +15% gains
- Calculate price targets for -5%, -10%, -15% losses
- Clean, modern responsive design
- Azure Static Web Apps deployment with CI/CD

## Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # Frontend JavaScript
├── package.json        # Frontend dependencies
├── api/                # Azure Functions backend
│   ├── src/
│   │   └── functions/
│   │       └── stock.ts # Stock data API endpoint
│   ├── package.json    # Backend dependencies
│   ├── host.json       # Azure Functions configuration
│   └── tsconfig.json   # TypeScript configuration
└── README.md           # This file
```

## Development Setup

### Prerequisites

- Node.js 18+ 
- Azure Functions Core Tools
- Git

### Frontend Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

### Backend Development

1. Navigate to the api directory:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the local settings template:
   ```bash
   cp local.settings.json.template local.settings.json
   ```

4. Add your Alpha Vantage API key to `local.settings.json`

5. Start the Azure Functions:
   ```bash
   npm start
   ```

## Deployment

This project is configured for automatic deployment to Azure Static Web Apps using GitHub Actions.

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/azure-static-web-apps-ci-cd.yml`) automatically:

- Triggers on pushes to the `main` branch
- Builds the frontend using Vite
- Deploys both frontend and API to Azure Static Web Apps
- Handles pull request previews

### Setup Requirements

To enable deployment, you need to:

1. Create an Azure Static Web Apps resource in the Azure portal
2. Connect it to your GitHub repository
3. Add the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret to your GitHub repository settings
4. Configure the Alpha Vantage API key in Azure Static Web Apps application settings

### Manual Deployment

You can also build and preview locally:

```bash
# Build the project
npm run build

# Preview the built project
npm run preview
```

## API Endpoints

- `GET /api/stock/{symbol}` - Get stock data and price targets for a given symbol

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Azure Functions (Node.js/TypeScript)
- **Hosting**: Azure Static Web Apps
- **CI/CD**: GitHub Actions
- **External API**: Alpha Vantage API
