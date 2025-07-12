const http = require('http');

console.log('🧪 Testing local server setup...\n');

// Test if server is running
const testServer = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`Server responded with status ${res.statusCode}`));
      }
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

// Test CSRF token endpoint
const testCsrfEndpoint = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/api/vm/csrf-token', (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`CSRF endpoint responded with status ${res.statusCode}`));
      }
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

// Run tests
async function runTests() {
  try {
    console.log('1. Testing if server is running...');
    await testServer();
    console.log('✅ Server is running on http://localhost:3000');
    
    console.log('\n2. Testing CSRF token endpoint...');
    await testCsrfEndpoint();
    console.log('✅ CSRF token endpoint is working');
    
    console.log('\n🎉 All tests passed! Your local setup is working correctly.');
    console.log('\n📝 You can now:');
    console.log('   - Open http://localhost:3000 in your browser');
    console.log('   - Set HYPERBEAM_API_KEY environment variable to test full functionality');
    console.log('   - Or deploy to Vercel for production use');
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
    console.log('\n🔧 To fix this:');
    console.log('   1. Make sure you ran: npm start');
    console.log('   2. Check that port 3000 is not in use');
    console.log('   3. Verify all dependencies are installed: npm install');
  }
}

runTests();