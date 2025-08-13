const fs = require('fs');

console.log('🎮 Generating Firebase Upload Script...');

try {
  // Read games.json
  const gamesData = JSON.parse(fs.readFileSync('./games.json', 'utf8'));
  console.log(`📊 Found ${gamesData.total_games} games to upload`);
  
  // Create browser-compatible upload script
  const browserScript = `// AUTOMATIC FIREBASE UPLOAD SCRIPT
// This script will upload all ${gamesData.total_games} games to Firebase
console.log('🎮 Auto-uploading ${gamesData.total_games} games to Firebase...');

(async function() {
  // Check Firebase
  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    console.error('❌ Firebase not available - make sure you are on a page with Firebase loaded');
    return;
  }
  
  const db = firebase.firestore();
  const gamesData = ${JSON.stringify(gamesData, null, 2)};
  
  console.log('📤 Starting upload of ' + gamesData.games.length + ' games...');
  let uploaded = 0;
  let failed = 0;
  
  // Upload each game
  for (let i = 0; i < gamesData.games.length; i++) {
    const game = gamesData.games[i];
    
    try {
      const gameId = game.directory.replace('games/', '');
      
      const gameDoc = {
        id: gameId,
        title: game.name,
        name: game.name,
        directory: game.directory,
        path: game.path,
        category: 'action',
        image: 'https://via.placeholder.com/400x300/00d4ff/ffffff?text=' + encodeURIComponent(game.name),
        description: 'Play ' + game.name + ' - HTML5 game from YouTube Playables',
        featured: i < 3, // Make first 3 games featured
        url: './games/' + gameId + '/index.html',
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
      
      if (uploaded % 5 === 0) {
        console.log('✅ Progress: ' + uploaded + '/' + gamesData.games.length + ' games uploaded');
      }
      
    } catch (error) {
      console.error('❌ Failed to upload ' + game.name + ':', error);
      failed++;
    }
  }
  
  // Create metadata
  try {
    await db.collection('metadata').doc('games').set({
      totalGames: gamesData.total_games || gamesData.games.length,
      uploadedGames: uploaded,
      failedGames: failed,
      source: gamesData.source || 'YouTube Playables',
      description: gamesData.description || 'Collection of YouTube Playable games',
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      categories: ['action', 'puzzle', 'arcade', 'strategy', 'racing', 'sports'],
      version: '1.0'
    });
    console.log('✅ Metadata created');
  } catch (error) {
    console.error('❌ Metadata creation failed:', error);
  }
  
  console.log('🎉 UPLOAD COMPLETE!');
  console.log('✅ Successfully uploaded: ' + uploaded + ' games');
  console.log('❌ Failed uploads: ' + failed + ' games');
  
  // Verify upload
  try {
    const snapshot = await db.collection('games').get();
    console.log('🔍 Verification: ' + snapshot.size + ' games found in Firebase');
    
    // Show sample games
    console.log('📋 Sample uploaded games:');
    snapshot.docs.slice(0, 3).forEach((doc, index) => {
      const data = doc.data();
      console.log('   ' + (index + 1) + '. "' + data.name + '" (ID: ' + doc.id + ')');
    });
    
    console.log('');
    console.log('🎮 SUCCESS! All games are now in Firebase!');
    console.log('🔄 You can now refresh the page to see games loaded from Firebase');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
  
})().catch(error => {
  console.error('💥 Fatal error during upload:', error);
});`;

  // Write the script
  fs.writeFileSync('./auto-upload-to-firebase.js', browserScript);
  
  console.log('✅ Auto-upload script generated: auto-upload-to-firebase.js');
  console.log('📋 Instructions:');
  console.log('   1. Open your games.html page in browser');
  console.log('   2. Open browser console (F12)');
  console.log('   3. Copy and paste the contents of auto-upload-to-firebase.js');
  console.log('   4. Press Enter and watch games upload!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}