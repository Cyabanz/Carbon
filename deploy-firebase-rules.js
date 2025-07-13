// Script to deploy Firebase Realtime Database rules
const fs = require('fs');
const path = require('path');

// Read the Firebase rules
const rulesPath = path.join(__dirname, 'firebase-rules.json');
const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

console.log('📋 Firebase Rules to deploy:');
console.log(JSON.stringify(rules, null, 2));

console.log('\n🚀 To deploy these rules to Firebase:');
console.log('1. Install Firebase CLI: npm install -g firebase-tools');
console.log('2. Login to Firebase: firebase login');
console.log('3. Initialize Firebase (if not done): firebase init');
console.log('4. Deploy rules: firebase deploy --only database');
console.log('\nOr manually copy the rules to Firebase Console:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Select your project: carbon-services');
console.log('3. Go to Realtime Database > Rules');
console.log('4. Replace the rules with the content from firebase-rules.json');
console.log('5. Click "Publish"');

// Alternative: Use Firebase Admin SDK if available
try {
  const admin = require('firebase-admin');
  console.log('\n✅ Firebase Admin SDK available');
  console.log('You can also deploy programmatically using the Admin SDK');
} catch (error) {
  console.log('\n⚠️ Firebase Admin SDK not installed');
  console.log('Install with: npm install firebase-admin');
} 