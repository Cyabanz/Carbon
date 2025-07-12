#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Hyperbeam VM Demo Setup');
console.log('==========================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setup() {
  console.log('1. Checking current setup...\n');
  
  // Check if API key is set
  const hasApiKey = process.env.HYPERBEAM_API_KEY;
  console.log(`   HYPERBEAM_API_KEY: ${hasApiKey ? '✅ SET' : '❌ NOT SET'}`);
  
  // Check if dependencies are installed
  const hasNodeModules = fs.existsSync('node_modules');
  console.log(`   Dependencies: ${hasNodeModules ? '✅ INSTALLED' : '❌ NOT INSTALLED'}`);
  
  // Check if server is running
  let serverRunning = false;
  try {
    execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
    serverRunning = true;
  } catch (error) {
    // Server not running
  }
  console.log(`   Local Server: ${serverRunning ? '✅ RUNNING' : '❌ NOT RUNNING'}`);
  
  console.log('\n2. Setup Options:\n');
  console.log('   A) Get Hyperbeam API key and configure everything');
  console.log('   B) Just set the API key (if you already have one)');
  console.log('   C) Test current setup');
  console.log('   D) Exit');
  
  const choice = await askQuestion('\nChoose an option (A/B/C/D): ');
  
  switch (choice.toUpperCase()) {
    case 'A':
      await fullSetup();
      break;
    case 'B':
      await setApiKey();
      break;
    case 'C':
      await testSetup();
      break;
    case 'D':
      console.log('\nSetup cancelled. Goodbye!');
      break;
    default:
      console.log('\nInvalid choice. Please run the script again.');
  }
  
  rl.close();
}

async function fullSetup() {
  console.log('\n🔧 Full Setup Process\n');
  
  console.log('Step 1: Getting Hyperbeam API Key');
  console.log('==================================');
  console.log('1. Go to https://hyperbeam.com');
  console.log('2. Sign up for an account (free tier available)');
  console.log('3. Navigate to your dashboard');
  console.log('4. Find your API key in the settings');
  console.log('5. Copy the entire API key\n');
  
  const apiKey = await askQuestion('Paste your Hyperbeam API key here: ');
  
  if (!apiKey || apiKey.trim().length < 10) {
    console.log('❌ Invalid API key. Please make sure you copied the entire key.');
    return;
  }
  
  console.log('\nStep 2: Installing Dependencies');
  console.log('===============================');
  
  if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependencies installed successfully');
    } catch (error) {
      console.log('❌ Failed to install dependencies');
      return;
    }
  } else {
    console.log('✅ Dependencies already installed');
  }
  
  console.log('\nStep 3: Setting Environment Variable');
  console.log('====================================');
  
  // Set environment variable for current session
  process.env.HYPERBEAM_API_KEY = apiKey;
  
  console.log('✅ API key set for current session');
  console.log('\nTo make this permanent, add this line to your shell profile:');
  console.log(`export HYPERBEAM_API_KEY="${apiKey}"`);
  
  console.log('\nStep 4: Starting Server');
  console.log('=======================');
  
  console.log('Starting local development server...');
  console.log('The server will be available at http://localhost:3000');
  console.log('\nPress Ctrl+C to stop the server when you\'re done testing.\n');
  
  try {
    execSync('npm start', { stdio: 'inherit' });
  } catch (error) {
    console.log('\nServer stopped.');
  }
}

async function setApiKey() {
  console.log('\n🔑 Setting API Key\n');
  
  const apiKey = await askQuestion('Enter your Hyperbeam API key: ');
  
  if (!apiKey || apiKey.trim().length < 10) {
    console.log('❌ Invalid API key. Please make sure you copied the entire key.');
    return;
  }
  
  // Set environment variable for current session
  process.env.HYPERBEAM_API_KEY = apiKey;
  
  console.log('✅ API key set for current session');
  console.log('\nTo make this permanent, add this line to your shell profile:');
  console.log(`export HYPERBEAM_API_KEY="${apiKey}"`);
  
  console.log('\nTo test the setup, run:');
  console.log('node debug-api.js');
}

async function testSetup() {
  console.log('\n🧪 Testing Current Setup\n');
  
  try {
    execSync('node debug-api.js', { stdio: 'inherit' });
  } catch (error) {
    console.log('\n❌ Test failed. Please check the error messages above.');
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nSetup interrupted. Goodbye!');
  rl.close();
  process.exit(0);
});

setup().catch(console.error);