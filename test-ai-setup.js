// Test script for Fusion AI Chat setup
const express = require('express');
const path = require('path');

// Test if the OpenRouter handler can be loaded
try {
  const openRouterHandler = require('./api/openrouter.js');
  console.log('✅ OpenRouter handler loaded successfully');
} catch (error) {
  console.error('❌ Failed to load OpenRouter handler:', error.message);
}

// Test if required files exist
const fs = require('fs');
const requiredFiles = [
  'ai.html',
  'ai.css',
  'api/openrouter.js',
  'server.js'
];

console.log('\n📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Test if dependencies are installed
console.log('\n📦 Checking dependencies:');
const packageJson = require('./package.json');
const requiredDeps = ['express', 'node-fetch'];
requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep} is installed`);
  } else {
    console.log(`❌ ${dep} is missing`);
  }
});

console.log('\n🚀 Setup Instructions:');
console.log('1. Get your OpenRouter API key from https://openrouter.ai/');
console.log('2. Set the API key in api/openrouter.js or as environment variable');
console.log('3. Run: npm start');
console.log('4. Open: http://localhost:3000/ai');
console.log('\n📖 See AI_SETUP.md for detailed instructions'); 