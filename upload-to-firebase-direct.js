const fs = require('fs');
const path = require('path');

// Since we don't have actual Firebase credentials, we'll simulate the upload
// and generate the exact data that would be uploaded to Firebase

console.log('🎮 Starting Direct Firebase Upload...');

async function uploadGamesToFirebase() {
  try {
    // Read games.json
    const gamesJsonPath = path.join(__dirname, 'games.json');
    const gamesData = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));
    
    console.log(`📊 Found ${gamesData.total_games} games to upload`);
    
    // Simulate Firebase upload by creating the exact data structure
    const firebaseGames = [];
    const uploadResults = {
      uploaded: 0,
      failed: 0,
      games: []
    };
    
    console.log('📤 Processing games for Firebase upload...');
    
    // Process each game
    for (let i = 0; i < gamesData.games.length; i++) {
      const game = gamesData.games[i];
      
      try {
        // Generate clean game ID
        const gameId = game.directory.replace('games/', '').replace(/[^a-zA-Z0-9-_]/g, '-');
        
        // Create Firebase document structure
        const gameDoc = {
          // Document ID
          _id: gameId,
          
          // Core game data
          id: gameId,
          title: game.name,
          name: game.name,
          directory: game.directory,
          path: game.path,
          
          // Game metadata
          category: 'action',
          image: `https://via.placeholder.com/400x300/00d4ff/ffffff?text=${encodeURIComponent(game.name)}`,
          description: `Play ${game.name} - HTML5 game from YouTube Playables`,
          featured: i < 3, // First 3 games featured
          url: `./games/${gameId}/index.html`,
          developer: 'YouTube Playables',
          release: '2024',
          technology: 'HTML5',
          platforms: ['Browser'],
          tags: ['html5', 'youtube-playables', 'browser-game'],
          controls: 'Mouse and keyboard controls',
          
          // Stats and metadata
          playCount: 0,
          avgRating: 0,
          totalPlaytime: 0,
          active: true,
          
          // Timestamps (would be server timestamp in real Firebase)
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        firebaseGames.push(gameDoc);
        uploadResults.uploaded++;
        uploadResults.games.push({
          id: gameId,
          name: game.name,
          status: 'success'
        });
        
        console.log(`✅ Processed: ${game.name} (${uploadResults.uploaded}/${gamesData.games.length})`);
        
      } catch (error) {
        console.error(`❌ Failed to process ${game.name}:`, error.message);
        uploadResults.failed++;
        uploadResults.games.push({
          id: game.directory,
          name: game.name,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    // Create metadata document
    const metadata = {
      totalGames: gamesData.total_games,
      uploadedGames: uploadResults.uploaded,
      failedGames: uploadResults.failed,
      source: gamesData.source,
      description: gamesData.description,
      lastUpdated: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
      categories: ['action', 'puzzle', 'arcade', 'strategy', 'racing', 'sports'],
      version: '1.0'
    };
    
    // Save the Firebase data structure to files (simulating upload)
    console.log('💾 Saving Firebase data structure...');
    
    // Save individual game documents
    const gamesCollectionPath = path.join(__dirname, 'firebase-games-collection');
    if (!fs.existsSync(gamesCollectionPath)) {
      fs.mkdirSync(gamesCollectionPath);
    }
    
    firebaseGames.forEach(game => {
      const gameFilePath = path.join(gamesCollectionPath, `${game.id}.json`);
      fs.writeFileSync(gameFilePath, JSON.stringify(game, null, 2));
    });
    
    // Save metadata
    fs.writeFileSync(path.join(__dirname, 'firebase-metadata.json'), JSON.stringify(metadata, null, 2));
    
    // Save complete games collection
    fs.writeFileSync(path.join(__dirname, 'firebase-games-complete.json'), JSON.stringify(firebaseGames, null, 2));
    
    // Generate Firebase import script
    const importScript = `
// FIREBASE IMPORT SCRIPT - Run this in browser console on a page with Firebase loaded
console.log('🔥 Importing ${uploadResults.uploaded} games to Firebase...');

(async function() {
  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    console.error('❌ Firebase not available');
    return;
  }
  
  const db = firebase.firestore();
  const games = ${JSON.stringify(firebaseGames, null, 2)};
  const metadata = ${JSON.stringify(metadata, null, 2)};
  
  console.log('📤 Starting batch upload...');
  
  // Upload games in batches (Firebase limit is 500 per batch)
  const batchSize = 500;
  let totalUploaded = 0;
  
  for (let i = 0; i < games.length; i += batchSize) {
    const batch = db.batch();
    const gameBatch = games.slice(i, i + batchSize);
    
    gameBatch.forEach(game => {
      const docRef = db.collection('games').doc(game.id);
      batch.set(docRef, {
        ...game,
        addedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    
    try {
      await batch.commit();
      totalUploaded += gameBatch.length;
      console.log(\`✅ Uploaded batch: \${totalUploaded}/\${games.length} games\`);
    } catch (error) {
      console.error('❌ Batch upload failed:', error);
    }
  }
  
  // Upload metadata
  await db.collection('metadata').doc('games').set({
    ...metadata,
    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  console.log('🎉 Upload complete!');
  console.log(\`✅ Uploaded: \${totalUploaded} games\`);
  
  // Verify
  const snapshot = await db.collection('games').get();
  console.log(\`🔍 Verification: \${snapshot.size} games in Firebase\`);
  
  // Show sample
  console.log('📋 Sample games:');
  snapshot.docs.slice(0, 5).forEach((doc, i) => {
    const data = doc.data();
    console.log(\`   \${i + 1}. "\${data.name}" (ID: \${doc.id})\`);
  });
  
})().catch(console.error);`;
    
    fs.writeFileSync(path.join(__dirname, 'firebase-import-script.js'), importScript);
    
    // Results
    console.log('\n🎉 UPLOAD SIMULATION COMPLETE!');
    console.log(`✅ Successfully processed: ${uploadResults.uploaded} games`);
    console.log(`❌ Failed to process: ${uploadResults.failed} games`);
    console.log(`📊 Total games: ${gamesData.games.length}`);
    
    console.log('\n📁 Files created:');
    console.log(`   • firebase-games-complete.json (${firebaseGames.length} games)`);
    console.log(`   • firebase-metadata.json (metadata)`);
    console.log(`   • firebase-import-script.js (ready to run)`);
    console.log(`   • firebase-games-collection/ (${firebaseGames.length} individual files)`);
    
    console.log('\n🔥 To upload to Firebase:');
    console.log('   1. Open your website with Firebase loaded');
    console.log('   2. Open browser console');
    console.log('   3. Copy/paste contents of firebase-import-script.js');
    console.log('   4. Press Enter and watch upload!');
    
    // Verify we have all games
    console.log('\n🔍 VERIFICATION:');
    console.log(`   Games in JSON: ${gamesData.games.length}`);
    console.log(`   Games processed: ${firebaseGames.length}`);
    console.log(`   Match: ${gamesData.games.length === firebaseGames.length ? '✅ YES' : '❌ NO'}`);
    
    // Show sample games
    console.log('\n📋 Sample processed games:');
    firebaseGames.slice(0, 5).forEach((game, i) => {
      console.log(`   ${i + 1}. "${game.name}" (ID: ${game.id})`);
    });
    
    return {
      success: true,
      uploaded: uploadResults.uploaded,
      failed: uploadResults.failed,
      total: gamesData.games.length,
      games: firebaseGames
    };
    
  } catch (error) {
    console.error('💥 Upload simulation failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the upload simulation
uploadGamesToFirebase().then(result => {
  if (result.success) {
    console.log(`\n🎮 SUCCESS! All ${result.total} games ready for Firebase upload!`);
  } else {
    console.log(`\n💥 FAILED: ${result.error}`);
  }
}).catch(console.error);