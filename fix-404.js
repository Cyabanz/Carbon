#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Fixing 404 Error for vm.html\n');

// Check if dependencies are installed
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.log('❌ Failed to install dependencies');
    process.exit(1);
  }
}

// Check if server.js exists
if (!fs.existsSync('server.js')) {
  console.log('❌ server.js not found. Please ensure all files are present.');
  process.exit(1);
}

// Check if server is already running
try {
  execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
  console.log('✅ Server is already running on http://localhost:3000');
  console.log('\n🎉 Your vm.html should now work!');
  console.log('   Open http://localhost:3000 in your browser');
} catch (error) {
  console.log('🚀 Starting local development server...');
  console.log('   This will fix the 404 error by providing the missing API endpoints');
  console.log('\n📝 To start the server manually, run: npm start');
  console.log('📝 To access the demo, open: http://localhost:3000');
  console.log('\n⚠️  Note: You may need to set HYPERBEAM_API_KEY for full functionality');
  console.log('   Set it with: export HYPERBEAM_API_KEY=your_api_key_here');
  
  // Start the server
  try {
    execSync('npm start', { stdio: 'inherit' });
  } catch (error) {
    console.log('\n❌ Failed to start server. Please run manually: npm start');
  }
}

console.log('\n📚 For more information, see README.md');