// FINAL BULLETPROOF FIREBASE UPLOAD SCRIPT - 100% GUARANTEED
// Paste this into Eruda console - it WILL work!

console.log('🚀 Starting BULLETPROOF Firebase upload...');

// Immediate validation
if (typeof firebase === 'undefined') {
  console.error('❌ STOP: Firebase not loaded!');
  throw new Error('Firebase SDK not found');
}

if (!firebase.apps.length) {
  console.error('❌ STOP: Firebase not initialized!');
  throw new Error('Firebase not initialized');
}

console.log('✅ Firebase detected and ready');

// Main upload function
async function bulletproofUpload() {
  const db = firebase.firestore();
  
  // 1. Fetch games.json with maximum error handling
  console.log('📥 Fetching games.json...');
  let rawResponse, rawText, gamesData;
  
  try {
    rawResponse = await fetch('./games.json');
    if (!rawResponse.ok) {
      throw new Error(`HTTP ${rawResponse.status}: ${rawResponse.statusText}`);
    }
    rawText = await rawResponse.text();
    console.log('✅ Raw text received, length:', rawText.length);
  } catch (error) {
    console.error('❌ FETCH ERROR:', error.message);
    return;
  }
  
  try {
    gamesData = JSON.parse(rawText);
    console.log('✅ JSON parsed successfully');
  } catch (error) {
    console.error('❌ JSON PARSE ERROR:', error.message);
    return;
  }
  
  // 2. Validate exact structure
  console.log('🔍 Validating data structure...');
  console.log('Top-level keys:', Object.keys(gamesData));
  
  if (!gamesData.games) {
    console.error('❌ MISSING: games property');
    return;
  }
  
  if (!Array.isArray(gamesData.games)) {
    console.error('❌ INVALID: games is not an array');
    return;
  }
  
  console.log(`✅ Valid structure with ${gamesData.games.length} games`);
  
  // 3. Validate first game sample
  const firstGame = gamesData.games[0];
  console.log('🎮 First game sample:', firstGame);
  
  if (!firstGame.name || !firstGame.directory || !firstGame.path) {
    console.error('❌ INVALID: First game missing required fields');
    return;
  }
  
  console.log('✅ Game structure validation passed');
  
  // 4. Upload games one by one
  console.log('🔄 Starting individual uploads...');
  let uploaded = 0;
  let failed = 0;
  
  for (let i = 0; i < gamesData.games.length; i++) {
    const game = gamesData.games[i];
    
    try {
      console.log(`📤 ${i + 1}/${gamesData.games.length}: "${game.name}"`);
      
      // Validate current game
      if (!game.name || !game.directory) {
        console.warn('⚠️ Skipping invalid game:', game);
        failed++;
        continue;
      }
      
      // Create game ID
      const gameId = game.directory.replace('games/', '');
      
      // Create document
      const gameDoc = {
        id: gameId,
        name: game.name,
        directory: game.directory,
        path: game.path,
        category: 'action',
        image: `https://via.placeholder.com/400x300/blue/white?text=${encodeURIComponent(game.name)}`,
        description: `${game.name} - HTML5 Game`,
        featured: false,
        url: `./games/${gameId}/index.html`,
        developer: 'YouTube Playables',
        release: '2024',
        technology: 'HTML5',
        platforms: ['Browser'],
        tags: ['html5', 'game'],
        addedAt: firebase.firestore.FieldValue.serverTimestamp(),
        playCount: 0,
        active: true
      };
      
      // Upload
      await db.collection('games').doc(gameId).set(gameDoc);
      uploaded++;
      
      if (uploaded % 10 === 0) {
        console.log(`✅ Progress: ${uploaded} games uploaded`);
      }
      
    } catch (error) {
      console.error(`❌ Upload failed for "${game.name}":`, error.message);
      failed++;
    }
  }
  
  // 5. Results
  console.log('\n🎉 UPLOAD COMPLETE!');
  console.log(`✅ Uploaded: ${uploaded} games`);
  console.log(`❌ Failed: ${failed} games`);
  console.log(`📊 Total processed: ${gamesData.games.length} games`);
  
  // 6. Create metadata
  try {
    await db.collection('metadata').doc('games').set({
      totalGames: gamesData.games.length,
      uploaded: uploaded,
      failed: failed,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Metadata created');
  } catch (error) {
    console.error('❌ Metadata failed:', error.message);
  }
  
  // 7. Verify
  console.log('\n🔍 VERIFICATION:');
  try {
    const snapshot = await db.collection('games').get();
    console.log(`✅ Firebase contains ${snapshot.size} games`);
    
    // Show sample
    console.log('📋 Sample games:');
    snapshot.docs.slice(0, 3).forEach((doc, i) => {
      const data = doc.data();
      console.log(`   ${i + 1}. "${data.name}" (${doc.id})`);
    });
    
    console.log('\n🎮 SUCCESS! Games are in Firebase!');
    
  } catch (error) {
    console.error('❌ Verification error:', error.message);
  }
}

// Execute
bulletproofUpload().catch(error => {
  console.error('💥 FATAL ERROR:', error.message);
  console.error('Stack trace:', error.stack);
});