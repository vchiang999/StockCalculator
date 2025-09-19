# Azure Static Web Apps Deployment Checklist

## Pre-Deployment Checklist

- [ ] **Code is ready**
  - [ ] All tasks 1-6 are completed and tested locally
  - [ ] Frontend builds successfully (`npm run build`)
  - [ ] API builds successfully (`npm run func:build`)
  - [ ] Code is committed and pushed to GitHub main branch

- [ ] **Azure Prerequisites**
  - [ ] Azure subscription is active
  - [ ] GitHub account is connected to Azure
  - [ ] Alpha Vantage API key is obtained

## Deployment Steps

### Step 1: Create Azure Static Web App Resource
- [ ] Navigate to Azure Portal (portal.azure.com)
- [ ] Create new Static Web App resource
- [ ] Configure basic settings:
  - [ ] Subscription selected
  - [ ] Resource group created/selected
  - [ ] Unique app name chosen
  - [ ] Free tier selected (for development)
  - [ ] Region selected
- [ ] Configure GitHub integration:
  - [ ] GitHub account authorized
  - [ ] Repository selected
  - [ ] Branch set to `main`
- [ ] Configure build settings:
  - [ ] App location: `/`
  - [ ] API location: `api`
  - [ ] Output location: `dist`
- [ ] Review and create resource
- [ ] Wait for deployment completion (2-3 minutes)

### Step 2: Verify GitHub Integration
- [ ] Check GitHub repository secrets
- [ ] Confirm `AZURE_STATIC_WEB_APPS_API_TOKEN` secret exists
- [ ] Verify GitHub Actions workflow triggered automatically
- [ ] Check workflow run completed successfully

### Step 3: Configure Environment Variables
- [ ] Navigate to Static Web App in Azure Portal
- [ ] Go to Settings → Configuration
- [ ] Add application setting:
  - [ ] Name: `ALPHA_VANTAGE_API_KEY`
  - [ ] Value: Your Alpha Vantage API key
- [ ] Save configuration
- [ ] Wait for restart (automatic)

### Step 4: Test Deployment
- [ ] Get application URL from Azure Portal
- [ ] Test frontend:
  - [ ] Website loads correctly
  - [ ] UI elements are visible
  - [ ] No console errors
- [ ] Test API:
  - [ ] Visit: `https://your-app-url.azurestaticapps.net/api/stock/AAPL`
  - [ ] Verify JSON response with stock data
  - [ ] Test with different stock symbols
- [ ] Test full application flow:
  - [ ] Enter stock symbol in frontend
  - [ ] Verify price targets are calculated and displayed
  - [ ] Test error handling with invalid symbols

## Post-Deployment Verification

### Using Verification Script
- [ ] Run verification script:
  ```bash
  node scripts/verify-deployment.js https://your-app-url.azurestaticapps.net
  ```
- [ ] Review all verification results
- [ ] Address any issues found

### Manual Testing
- [ ] Test on different devices (desktop, mobile)
- [ ] Test with different stock symbols:
  - [ ] Valid symbols (AAPL, MSFT, GOOGL)
  - [ ] Invalid symbols (should show error)
- [ ] Verify price calculations are accurate
- [ ] Check loading states and error messages

## Troubleshooting Common Issues

### Build Failures
- [ ] Check GitHub Actions logs for specific errors
- [ ] Verify all dependencies are in package.json
- [ ] Ensure build scripts are correct
- [ ] Check for TypeScript compilation errors

### API Not Working
- [ ] Verify Alpha Vantage API key is set correctly
- [ ] Check Azure Function logs in portal
- [ ] Test API key with Alpha Vantage directly
- [ ] Verify function deployment in Azure

### Frontend Issues
- [ ] Check browser console for JavaScript errors
- [ ] Verify static assets are loading
- [ ] Check network tab for failed requests
- [ ] Verify build output in `dist` folder

## Security and Best Practices

- [ ] **API Key Security**
  - [ ] API key is stored in Azure configuration (not in code)
  - [ ] No API keys committed to repository
  - [ ] Consider using Azure Key Vault for production

- [ ] **Monitoring Setup**
  - [ ] Enable Application Insights (optional)
  - [ ] Set up alerts for errors
  - [ ] Monitor API usage to stay within limits

- [ ] **Performance Optimization**
  - [ ] Verify caching headers are set
  - [ ] Check bundle size and optimization
  - [ ] Test loading performance

## Production Readiness (Optional)

- [ ] **Custom Domain**
  - [ ] Configure custom domain in Azure
  - [ ] Set up DNS records
  - [ ] Verify SSL certificate

- [ ] **Advanced Configuration**
  - [ ] Set up staging slots
  - [ ] Configure authentication (if needed)
  - [ ] Set up monitoring and alerts

- [ ] **Documentation**
  - [ ] Update README with deployment URL
  - [ ] Document any custom configuration
  - [ ] Create user guide if needed

## Success Criteria

✅ **Deployment is successful when:**
- [ ] Website is accessible at Azure Static Web Apps URL
- [ ] Stock search functionality works end-to-end
- [ ] Price calculations are accurate
- [ ] Error handling works properly
- [ ] GitHub Actions workflow runs successfully
- [ ] All verification checks pass

## Next Steps After Deployment

1. **Share the application** - The app is now live and can be shared
2. **Monitor usage** - Keep an eye on Azure metrics and costs
3. **Plan improvements** - Consider additional features or optimizations
4. **Set up monitoring** - Enable Application Insights for production use

---

**Note**: Keep this checklist handy during deployment and check off items as you complete them. If you encounter issues, refer to the detailed DEPLOYMENT_GUIDE.md for troubleshooting steps.