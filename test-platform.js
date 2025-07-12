const { detectPlatform, getApiBaseUrl, getFunctionPath } = require('./platform-detector');

console.log('🧪 Testing Platform Detection...\n');

// Test platform detection
console.log('1. Platform Detection:');
console.log(`   Detected platform: ${detectPlatform()}`);

// Test API base URL
console.log('\n2. API Base URL:');
console.log(`   Base URL: ${getApiBaseUrl()}`);

// Test function paths
console.log('\n3. Function Paths:');
console.log(`   VM API: ${getFunctionPath('vm')}`);
console.log(`   CSRF Token: ${getFunctionPath('vm/csrf-token')}`);

// Test different scenarios
console.log('\n4. Testing different scenarios:');

// Simulate Vercel environment
process.env.VERCEL = '1';
console.log(`   Vercel env: ${detectPlatform()} -> ${getFunctionPath('vm')}`);

// Simulate Netlify environment
delete process.env.VERCEL;
process.env.NETLIFY = '1';
console.log(`   Netlify env: ${detectPlatform()} -> ${getFunctionPath('vm')}`);

// Simulate local environment
delete process.env.NETLIFY;
console.log(`   Local env: ${detectPlatform()} -> ${getFunctionPath('vm')}`);

console.log('\n✅ Platform detection test completed!');
console.log('\n📝 Expected results:');
console.log('   - Vercel: /api/vm');
console.log('   - Netlify: /.netlify/functions/vm');
console.log('   - Local: /api/vm');