#!/usr/bin/env node

const fetch = require('node-fetch');

async function verifySetup() {
  const args = process.argv.slice(2);
  const baseUrl = args[0] || 'http://localhost:3000';
  
  console.log('🔍 Verifying Hyperbeam Demo Setup...\n');
  console.log(`📍 Testing against: ${baseUrl}\n`);
  
  let allTestsPassed = true;
  
  // Test 1: Health endpoint
  console.log('1. Testing health endpoint...');
  try {
    const healthRes = await fetch(`${baseUrl}/api/health`);
    if (healthRes.ok) {
      console.log('   ✅ Health endpoint working');
    } else {
      console.log(`   ❌ Health endpoint failed: ${healthRes.status}`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ Health endpoint error: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Test 2: CSRF token endpoint
  console.log('\n2. Testing CSRF token endpoint...');
  try {
    const csrfRes = await fetch(`${baseUrl}/api/vm/csrf-token`);
    if (csrfRes.ok) {
      const data = await csrfRes.json();
      if (data.csrfToken) {
        console.log('   ✅ CSRF token endpoint working');
      } else {
        console.log('   ❌ CSRF token not returned');
        allTestsPassed = false;
      }
    } else {
      console.log(`   ❌ CSRF endpoint failed: ${csrfRes.status}`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ CSRF endpoint error: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Test 3: Main API endpoint - OPTIONS
  console.log('\n3. Testing main API endpoint (OPTIONS)...');
  try {
    const optionsRes = await fetch(`${baseUrl}/api/vm`, { method: 'OPTIONS' });
    if (optionsRes.ok) {
      console.log('   ✅ OPTIONS method working');
    } else {
      console.log(`   ❌ OPTIONS method failed: ${optionsRes.status}`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ❌ OPTIONS method error: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Test 4: Main API endpoint - POST (should fail without CSRF, but not 405)
  console.log('\n4. Testing main API endpoint (POST without CSRF)...');
  try {
    const postRes = await fetch(`${baseUrl}/api/vm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    if (postRes.status === 405) {
      console.log('   ❌ POST method not allowed (405) - this indicates a routing issue');
      allTestsPassed = false;
    } else if (postRes.status === 403) {
      console.log('   ✅ POST method working (403 expected without CSRF)');
    } else {
      console.log(`   ⚠️  POST method returned: ${postRes.status} (unexpected)`);
    }
  } catch (error) {
    console.log(`   ❌ POST method error: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Test 5: PATCH endpoint
  console.log('\n5. Testing PATCH endpoint...');
  try {
    const patchRes = await fetch(`${baseUrl}/api/vm`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: 'test-session' })
    });
    
    if (patchRes.status === 405) {
      console.log('   ❌ PATCH method not allowed (405) - this indicates a routing issue');
      allTestsPassed = false;
    } else if (patchRes.status === 404) {
      console.log('   ✅ PATCH method working (404 expected for invalid session)');
    } else {
      console.log(`   ⚠️  PATCH method returned: ${patchRes.status} (unexpected)`);
    }
  } catch (error) {
    console.log(`   ❌ PATCH method error: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('✅ All basic tests passed!');
    console.log('\n📝 Next steps:');
    console.log('1. Set your HYPERBEAM_API_KEY environment variable');
    console.log('2. Deploy to Vercel: npx vercel --prod');
    console.log('3. Test the full application');
  } else {
    console.log('❌ Some tests failed');
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check that the server is running');
    console.log('2. Verify the API files are in the correct location');
    console.log('3. Check the Vercel configuration');
    console.log('4. See TROUBLESHOOTING.md for more help');
  }
  console.log('='.repeat(50));
}

verifySetup().catch(console.error);