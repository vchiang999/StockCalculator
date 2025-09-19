// Simple test to verify the stock function structure
// This is a basic validation since we can't run the actual function without Node.js

const fs = require('fs');

// Read the compiled TypeScript file (would be in dist/ after compilation)
// For now, just verify the source file exists and has the right structure

try {
    const sourceCode = fs.readFileSync('./src/functions/stock.ts', 'utf8');
    
    console.log('✅ Stock function file exists');
    
    // Check for key components
    const checks = [
        { name: 'Alpha Vantage API URL', pattern: /alphavantage\.co\/query/ },
        { name: 'GLOBAL_QUOTE function', pattern: /GLOBAL_QUOTE/ },
        { name: 'Symbol validation', pattern: /symbolRegex/ },
        { name: 'Error handling', pattern: /catch.*error/ },
        { name: 'Response format', pattern: /success.*data.*error/ },
        { name: 'Price rounding', pattern: /Math\.round.*100/ },
        { name: 'API key check', pattern: /ALPHA_VANTAGE_API_KEY/ }
    ];
    
    checks.forEach(check => {
        if (check.pattern.test(sourceCode)) {
            console.log(`✅ ${check.name} implemented`);
        } else {
            console.log(`❌ ${check.name} missing`);
        }
    });
    
    console.log('\n📋 Function structure validation complete');
    
} catch (error) {
    console.error('❌ Error reading stock function file:', error.message);
}