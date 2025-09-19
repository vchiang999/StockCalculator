#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script helps verify that the Azure Static Web App deployment is configured correctly
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class DeploymentVerifier {
    constructor() {
        this.baseUrl = process.argv[2];
        if (!this.baseUrl) {
            console.error('Usage: node verify-deployment.js <your-static-web-app-url>');
            console.error('Example: node verify-deployment.js https://your-app.azurestaticapps.net');
            process.exit(1);
        }
        
        // Remove trailing slash
        this.baseUrl = this.baseUrl.replace(/\/$/, '');
    }

    async makeRequest(url) {
        return new Promise((resolve, reject) => {
            const request = https.get(url, (response) => {
                let data = '';
                
                response.on('data', (chunk) => {
                    data += chunk;
                });
                
                response.on('end', () => {
                    resolve({
                        statusCode: response.statusCode,
                        headers: response.headers,
                        body: data
                    });
                });
            });
            
            request.on('error', (error) => {
                reject(error);
            });
            
            request.setTimeout(10000, () => {
                request.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }

    async verifyFrontend() {
        console.log('🔍 Verifying frontend deployment...');
        
        try {
            const response = await this.makeRequest(this.baseUrl);
            
            if (response.statusCode === 200) {
                console.log('✅ Frontend is accessible');
                
                // Check if it contains expected content
                if (response.body.includes('Stock Price Calculator') || 
                    response.body.includes('stock') || 
                    response.body.includes('calculator')) {
                    console.log('✅ Frontend content looks correct');
                } else {
                    console.log('⚠️  Frontend content may not be correct');
                }
            } else {
                console.log(`❌ Frontend returned status code: ${response.statusCode}`);
            }
        } catch (error) {
            console.log(`❌ Frontend verification failed: ${error.message}`);
        }
    }

    async verifyAPI() {
        console.log('\n🔍 Verifying API deployment...');
        
        // Test with a known stock symbol
        const testSymbol = 'AAPL';
        const apiUrl = `${this.baseUrl}/api/stock/${testSymbol}`;
        
        try {
            const response = await this.makeRequest(apiUrl);
            
            if (response.statusCode === 200) {
                console.log('✅ API is accessible');
                
                try {
                    const data = JSON.parse(response.body);
                    
                    if (data.success && data.data) {
                        console.log('✅ API returns valid stock data');
                        console.log(`   Symbol: ${data.data.symbol}`);
                        console.log(`   Current Price: $${data.data.currentPrice}`);
                        console.log(`   Previous Close: $${data.data.previousClose}`);
                        console.log(`   Last Updated: ${data.data.lastUpdated}`);
                    } else if (data.error) {
                        console.log(`⚠️  API returned error: ${data.error.message}`);
                        if (data.error.code === 'API_UNAVAILABLE') {
                            console.log('   This might indicate the Alpha Vantage API key is not configured');
                        }
                    }
                } catch (parseError) {
                    console.log('⚠️  API response is not valid JSON');
                }
            } else if (response.statusCode === 404) {
                console.log('❌ API endpoint not found - check function deployment');
            } else if (response.statusCode === 500) {
                console.log('❌ API internal server error - check function logs');
            } else {
                console.log(`❌ API returned status code: ${response.statusCode}`);
            }
        } catch (error) {
            console.log(`❌ API verification failed: ${error.message}`);
        }
    }

    async verifyConfiguration() {
        console.log('\n🔍 Verifying local configuration...');
        
        // Check if required files exist
        const requiredFiles = [
            'package.json',
            'vite.config.js',
            'index.html',
            'api/package.json',
            'api/host.json',
            'api/src/functions/stock.ts',
            '.github/workflows/azure-static-web-apps-ci-cd.yml'
        ];
        
        let allFilesExist = true;
        
        for (const file of requiredFiles) {
            if (fs.existsSync(file)) {
                console.log(`✅ ${file} exists`);
            } else {
                console.log(`❌ ${file} is missing`);
                allFilesExist = false;
            }
        }
        
        if (allFilesExist) {
            console.log('✅ All required files are present');
        }
        
        // Check package.json scripts
        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            const requiredScripts = ['build', 'dev'];
            
            for (const script of requiredScripts) {
                if (packageJson.scripts && packageJson.scripts[script]) {
                    console.log(`✅ npm script '${script}' is configured`);
                } else {
                    console.log(`⚠️  npm script '${script}' is missing`);
                }
            }
        } catch (error) {
            console.log('⚠️  Could not verify package.json scripts');
        }
    }

    async run() {
        console.log(`🚀 Verifying deployment for: ${this.baseUrl}\n`);
        
        await this.verifyConfiguration();
        await this.verifyFrontend();
        await this.verifyAPI();
        
        console.log('\n📋 Deployment Verification Complete');
        console.log('\nIf you see any issues:');
        console.log('1. Check the GitHub Actions workflow logs');
        console.log('2. Verify environment variables in Azure Portal');
        console.log('3. Check Azure Function logs for API issues');
        console.log('4. Refer to DEPLOYMENT_GUIDE.md for detailed instructions');
    }
}

// Run the verification
const verifier = new DeploymentVerifier();
verifier.run().catch(console.error);