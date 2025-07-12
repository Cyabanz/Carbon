const http = require('http');

console.log('🔍 Debugging API 500 Error...\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log(`   HYPERBEAM_API_KEY: ${process.env.HYPERBEAM_API_KEY ? 'SET' : 'NOT SET'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

// Test CSRF endpoint
const testCsrfEndpoint = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:3000/api/vm/csrf-token', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   CSRF Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`   CSRF Token: ${json.csrfToken ? 'Received' : 'Missing'}`);
            resolve(json.csrfToken);
          } catch (e) {
            console.log(`   CSRF Response: ${data}`);
            reject(e);
          }
        } else {
          console.log(`   CSRF Error: ${data}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`   CSRF Error: ${err.message}`);
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
};

// Test VM endpoint with CSRF token
const testVmEndpoint = (csrfToken) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({});
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/vm',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
        'Cookie': 'csrfSecret=test' // This will be set by the CSRF endpoint
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`   VM Status: ${res.statusCode}`);
        console.log(`   VM Headers:`, res.headers);
        
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log(`   VM Response: Session created successfully`);
            resolve(json);
          } catch (e) {
            console.log(`   VM Response: ${data}`);
            reject(e);
          }
        } else {
          try {
            const json = JSON.parse(data);
            console.log(`   VM Error: ${json.error}`);
            if (json.details) console.log(`   Details: ${json.details}`);
          } catch (e) {
            console.log(`   VM Error Response: ${data}`);
          }
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`   VM Error: ${err.message}`);
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
};

// Run tests
async function runDebugTests() {
  try {
    console.log('2. Testing CSRF Endpoint...');
    const csrfToken = await testCsrfEndpoint();
    
    console.log('\n3. Testing VM Endpoint...');
    await testVmEndpoint(csrfToken);
    
    console.log('\n✅ API endpoints are working correctly!');
    
  } catch (error) {
    console.log(`\n❌ Test failed: ${error.message}`);
    
    if (!process.env.HYPERBEAM_API_KEY) {
      console.log('\n🔧 To fix this:');
      console.log('   1. Get a Hyperbeam API key from https://hyperbeam.com');
      console.log('   2. Set the environment variable:');
      console.log('      export HYPERBEAM_API_KEY=your_api_key_here');
      console.log('   3. Restart the server: npm start');
    } else {
      console.log('\n🔧 Possible issues:');
      console.log('   1. Invalid Hyperbeam API key');
      console.log('   2. Network connectivity issues');
      console.log('   3. Hyperbeam service temporarily unavailable');
    }
  }
}

// Check if server is running
const checkServer = () => {
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
      reject(new Error('Server not responding'));
    });
  });
};

// Main execution
async function main() {
  try {
    console.log('0. Checking if server is running...');
    await checkServer();
    console.log('   ✅ Server is running on http://localhost:3000');
    
    await runDebugTests();
    
  } catch (error) {
    console.log(`   ❌ Server error: ${error.message}`);
    console.log('\n🔧 To fix this:');
    console.log('   1. Start the server: npm start');
    console.log('   2. Make sure port 3000 is not in use');
    console.log('   3. Check that all dependencies are installed: npm install');
  }
}

main();