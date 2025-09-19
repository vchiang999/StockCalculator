// Simple test to verify function structure
const fs = require('fs');
const path = require('path');

console.log('=== API Deployment Test ===');
console.log('Current directory:', process.cwd());
console.log('API directory contents:');

try {
    const apiDir = fs.readdirSync('.');
    apiDir.forEach(file => {
        console.log(`- ${file}`);
        if (file === 'dist') {
            console.log('  dist/ contents:');
            const distContents = fs.readdirSync('./dist');
            distContents.forEach(distFile => {
                console.log(`    - ${distFile}`);
                if (distFile === 'src') {
                    console.log('      src/ contents:');
                    const srcContents = fs.readdirSync('./dist/src');
                    srcContents.forEach(srcFile => {
                        console.log(`        - ${srcFile}`);
                    });
                }
            });
        }
    });

    // Check if index.js exists and can be loaded
    const indexPath = './dist/src/index.js';
    if (fs.existsSync(indexPath)) {
        console.log('✅ index.js exists');
        console.log('index.js content preview:');
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        console.log(indexContent.substring(0, 200) + '...');
    } else {
        console.log('❌ index.js NOT found');
    }

} catch (error) {
    console.error('Error:', error.message);
}