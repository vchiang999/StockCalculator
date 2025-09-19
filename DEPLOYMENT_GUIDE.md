# Azure Static Web Apps Deployment Guide

## Prerequisites

1. **Azure Account**: Ensure you have an active Azure subscription
2. **GitHub Repository**: Your code should be pushed to a GitHub repository
3. **Alpha Vantage API Key**: Get a free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)

## Step 1: Create Azure Static Web Apps Resource

### Using Azure Portal

1. **Navigate to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Azure account

2. **Create Static Web App**
   - Click "Create a resource" (+)
   - Search for "Static Web Apps"
   - Click "Create"

3. **Configure Basic Settings**
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or select existing (e.g., `rg-stock-calculator`)
   - **Name**: Enter a unique name (e.g., `stock-calculator-app`)
   - **Plan Type**: Select "Free" for development/testing
   - **Region**: Choose a region close to your users (e.g., `East US 2`)

4. **Configure Deployment**
   - **Source**: Select "GitHub"
   - **GitHub Account**: Authorize Azure to access your GitHub account
   - **Organization**: Select your GitHub username/organization
   - **Repository**: Select your stock calculator repository
   - **Branch**: Select `main` (or your default branch)

5. **Build Configuration**
   - **Build Presets**: Select "Custom"
   - **App location**: `/` (root directory)
   - **Api location**: `api`
   - **Output location**: `dist`

6. **Review and Create**
   - Review all settings
   - Click "Create"
   - Wait for deployment to complete (2-3 minutes)

### Using Azure CLI (Alternative)

```bash
# Login to Azure
az login

# Create resource group (if needed)
az group create --name rg-stock-calculator --location eastus2

# Create Static Web App
az staticwebapp create \
  --name stock-calculator-app \
  --resource-group rg-stock-calculator \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO_NAME \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location "dist" \
  --login-with-github
```

## Step 2: Configure GitHub Repository Connection

After creating the Static Web App, Azure automatically:

1. **Creates GitHub Secret**: Adds `AZURE_STATIC_WEB_APPS_API_TOKEN` to your repository secrets
2. **Updates Workflow**: The existing workflow file will be used for deployment
3. **Triggers Deployment**: First deployment starts automatically

### Verify GitHub Integration

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Confirm `AZURE_STATIC_WEB_APPS_API_TOKEN` secret exists

## Step 3: Configure Environment Variables

### Add Alpha Vantage API Key

1. **In Azure Portal**
   - Navigate to your Static Web App resource
   - Go to **Settings** → **Configuration**
   - Click **+ Add** under "Application settings"
   - **Name**: `ALPHA_VANTAGE_API_KEY`
   - **Value**: Your Alpha Vantage API key
   - Click **OK** and then **Save**

2. **Using Azure CLI**
   ```bash
   az staticwebapp appsettings set \
     --name stock-calculator-app \
     --resource-group rg-stock-calculator \
     --setting-names ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```

### Additional Environment Variables (Optional)

You may also want to configure:

```
FUNCTIONS_WORKER_RUNTIME=node
```

## Step 4: Verify Deployment

### Check Deployment Status

1. **GitHub Actions**
   - Go to your repository → **Actions** tab
   - Check the latest workflow run
   - Ensure all steps complete successfully

2. **Azure Portal**
   - Navigate to your Static Web App
   - Go to **Overview** → **Functions**
   - Verify the `stock` function is listed and running

### Test the Application

1. **Get Application URL**
   - In Azure Portal, go to your Static Web App
   - Copy the URL from the **Overview** page

2. **Test Frontend**
   - Visit the application URL
   - Verify the interface loads correctly

3. **Test API**
   - Test the API endpoint: `https://your-app-url.azurestaticapps.net/api/stock/AAPL`
   - Should return stock data for Apple Inc.

## Step 5: Custom Domain (Optional)

### Add Custom Domain

1. **In Azure Portal**
   - Navigate to your Static Web App
   - Go to **Settings** → **Custom domains**
   - Click **+ Add**
   - Enter your domain name
   - Follow DNS configuration instructions

### SSL Certificate

Azure Static Web Apps automatically provides SSL certificates for custom domains.

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the API key is correctly set in Configuration
   - Check that the key has the correct permissions
   - Ensure no extra spaces in the key value

2. **Build Failures**
   - Check GitHub Actions logs for specific errors
   - Verify `package.json` scripts are correct
   - Ensure all dependencies are listed

3. **API Function Not Found**
   - Verify `api` folder structure is correct
   - Check that `host.json` is properly configured
   - Ensure TypeScript compilation is successful

4. **CORS Issues**
   - Azure Static Web Apps automatically handles CORS between frontend and API
   - No additional configuration needed for same-origin requests

### Monitoring and Logs

1. **Application Insights** (Optional)
   - Enable Application Insights for detailed monitoring
   - Track API performance and errors

2. **Function Logs**
   - View logs in Azure Portal → Functions → Monitor
   - Use for debugging API issues

## Security Best Practices

1. **API Key Security**
   - Never commit API keys to source control
   - Use Azure Key Vault for production environments
   - Rotate API keys regularly

2. **Access Control**
   - Consider enabling authentication for production
   - Use Azure AD integration if needed

3. **Rate Limiting**
   - Monitor API usage to stay within Alpha Vantage limits
   - Implement client-side caching to reduce API calls

## Cost Optimization

1. **Free Tier Limits**
   - 100 GB bandwidth per month
   - 0.5 GB storage
   - Custom domains included

2. **Monitoring Usage**
   - Check usage in Azure Portal
   - Set up billing alerts if needed

## Next Steps

After successful deployment:

1. **Monitor Performance**: Set up Application Insights
2. **Add Features**: Implement additional stock analysis features
3. **Scale**: Consider upgrading to Standard tier for production use
4. **Backup**: Set up automated backups of configuration