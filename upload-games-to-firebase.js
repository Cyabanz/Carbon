const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
// You'll need to replace this with your actual service account key
const serviceAccount = {
  "type": "service_account",
  "project_id": "carbon-network-7b43c",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@carbon-network-7b43c.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/v1/metadata/x509/firebase-adminsdk-xxxxx%40carbon-network-7b43c.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Initialize Admin SDK (commented out - you'll need actual credentials)
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// For demonstration, let's create a simple script that works with your existing setup
async function uploadGamesToFirebase() {
  console.log('🎮 Starting Firebase Games Upload...');
  
  try {
    // Read games.json
    const gamesJsonPath = path.join(__dirname, 'games.json');
    const gamesData = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));
    
    console.log(`📊 Found ${gamesData.total_games} games to upload`);
    
    // Since we can't use admin SDK without credentials, 
    // let's create a browser-compatible script instead
    console.log('📝 Creating browser-compatible upload script...');
    
    const browserScript = `
// AUTOMATIC FIREBASE UPLOAD SCRIPT - Run this in your browser console
(async function() {
  console.log('🎮 Auto-uploading ${gamesData.total_games} games to Firebase...');
  
  // Check Firebase
  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    console.error('❌ Firebase not available');
    return;
  }
  
  const db = firebase.firestore();
  const gamesData = ${JSON.stringify(gamesData, null, 2)};
  
  console.log('📤 Starting upload...');
  let uploaded = 0;
  
  // Upload each game
  for (const game of gamesData.games) {
    try {
      const gameId = game.directory.replace('games/', '');
      
      const gameDoc = {
        id: gameId,
        title: game.name,
        name: game.name,
        directory: game.directory,
        path: game.path,
        category: 'action',
        image: \`https://via.placeholder.com/400x300/00d4ff/ffffff?text=\${encodeURIComponent(game.name)}\`,
        description: \`Play \${game.name} - HTML5 game from YouTube Playables\`,
        featured: uploaded < 3, // Make first 3 games featured
        url: \`./games/\${gameId}/index.html\`,
        developer: 'YouTube Playables',
        release: '2024',
        technology: 'HTML5',
        platforms: ['Browser'],
        tags: ['html5', 'youtube-playables', 'browser'],
        controls: 'Mouse and keyboard controls',
        addedAt: firebase.firestore.FieldValue.serverTimestamp(),
        playCount: 0,
        avgRating: 0,
        totalPlaytime: 0,
        active: true
      };
      
      await db.collection('games').doc(gameId).set(gameDoc);
      uploaded++;
      
      if (uploaded % 10 === 0) {
        console.log(\`✅ Uploaded \${uploaded}/\${gamesData.games.length} games\`);
      }
      
    } catch (error) {
      console.error(\`❌ Failed to upload \${game.name}:\`, error);
    }
  }
  
  // Create metadata
  await db.collection('metadata').doc('games').set({
    totalGames: gamesData.total_games,
    uploadedGames: uploaded,
    source: gamesData.source,
    description: gamesData.description,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    categories: ['action', 'puzzle', 'arcade', 'strategy', 'racing', 'sports']
  });
  
  console.log(\`🎉 Upload complete! \${uploaded} games uploaded to Firebase\`);
  
  // Verify
  const snapshot = await db.collection('games').get();
  console.log(\`✅ Verification: \${snapshot.size} games in Firebase\`);
  console.log('🔄 Refreshing games display...');
  
  // Refresh the page to load from Firebase
  if (typeof initializeGames === 'function') {
    initializeGames();
  }
  
})();`;
    
    // Write the browser script
    fs.writeFileSync(path.join(__dirname, 'auto-upload-script.js'), browserScript);
    console.log('✅ Browser upload script created: auto-upload-script.js');
    
    return browserScript;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the upload
uploadGamesToFirebase();