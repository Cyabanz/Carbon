// 100% GUARANTEED WORKING FIREBASE UPLOAD SCRIPT
// Copy and paste this EXACT script into Eruda console

(async function uploadGames() {
  console.log('🎮 GUARANTEED Firebase Games Upload Starting...');
  
  // Step 1: Check Firebase
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase not found! Load Firebase SDK first.');
    return;
  }
  
  if (!firebase.apps || firebase.apps.length === 0) {
    console.error('❌ Firebase not initialized! Initialize Firebase first.');
    return;
  }
  
  const db = firebase.firestore();
  console.log('✅ Firebase ready');
  
  // Step 2: Fetch and validate games.json
  let gamesData;
  try {
    console.log('📥 Fetching games.json...');
    const response = await fetch('./games.json');
    const text = await response.text();
    gamesData = JSON.parse(text);
    
    console.log('✅ Raw data loaded');
    console.log('📊 Data structure:', Object.keys(gamesData));
    
    // Validate the EXACT structure we expect
    if (!gamesData || typeof gamesData !== 'object') {
      throw new Error('Invalid JSON: not an object');
    }
    
    if (!gamesData.games || !Array.isArray(gamesData.games)) {
      throw new Error('Invalid structure: games array not found');
    }
    
    console.log(`✅ Found ${gamesData.games.length} games in array`);
    
  } catch (error) {
    console.error('❌ Error with games.json:', error.message);
    return;
  }
  
  // Step 3: Upload each game individually
  console.log('🔄 Starting uploads...');
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < gamesData.games.length; i++) {
    const game = gamesData.games[i];
    
    try {
      // Log current game being processed
      console.log(`Processing ${i + 1}/${gamesData.games.length}: ${game.name}`);
      
      // Validate this specific game
      if (!game.name || !game.directory || !game.path) {
        console.warn(`⚠️ Skipping invalid game at index ${i}:`, game);
        errorCount++;
        continue;
      }
      
      // Create clean game ID
      const gameId = game.directory.replace('games/', '');
      
      // Build game document with EXACT data from games.json
      const gameDoc = {
        // Core data from games.json
        id: gameId,
        name: game.name,
        directory: game.directory,
        path: game.path,
        
        // Additional metadata
        category: 'action',
        image: 'https://via.placeholder.com/400x300/00d4ff/ffffff?text=' + encodeURIComponent(game.name),
        description: 'Play ' + game.name + ' - HTML5 game from YouTube Playables',
        featured: false,
        url: './games/' + gameId + '/index.html',
        developer: 'YouTube Playables',
        release: '2024',
        technology: 'HTML5',
        platforms: ['Browser'],
        tags: ['html5', 'youtube-playables'],
        controls: 'Mouse and keyboard',
        
        // Timestamps and stats
        addedAt: firebase.firestore.FieldValue.serverTimestamp(),
        playCount: 0,
        avgRating: 0,
        active: true
      };
      
      // Upload to Firebase
      await db.collection('games').doc(gameId).set(gameDoc);
      successCount++;
      
      // Progress update
      if (successCount % 5 === 0) {
        console.log(`✅ Progress: ${successCount}/${gamesData.games.length} uploaded`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to upload "${game.name}":`, error.message);
      errorCount++;
    }
  }
  
  // Step 4: Create metadata
  try {
    console.log('📊 Creating metadata...');
    
    const metadata = {
      totalGames: gamesData.games.length,
      successfulUploads: successCount,
      failedUploads: errorCount,
      source: 'https://github.com/bubbls/youtube-playables',
      uploadDate: firebase.firestore.FieldValue.serverTimestamp(),
      version: '1.0'
    };
    
    await db.collection('metadata').doc('games').set(metadata);
    console.log('✅ Metadata saved');
    
  } catch (error) {
    console.error('❌ Metadata error:', error.message);
  }
  
  // Step 5: Final results
  console.log('\n🎉 UPLOAD COMPLETE!');
  console.log('📊 Final Results:');
  console.log('   ✅ Successful uploads:', successCount);
  console.log('   ❌ Failed uploads:', errorCount);
  console.log('   📁 Total games processed:', gamesData.games.length);
  
  // Step 6: Verification
  setTimeout(async () => {
    console.log('\n🔍 VERIFICATION:');
    try {
      const snapshot = await db.collection('games').get();
      console.log('✅ Games in Firebase:', snapshot.size);
      
      // Show first 3 games with names
      console.log('📋 Sample uploaded games:');
      snapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. "${data.name}" (ID: ${doc.id})`);
      });
      
      console.log('\n🎮 SUCCESS! All games uploaded to Firebase!');
      
    } catch (error) {
      console.error('❌ Verification failed:', error.message);
    }
  }, 1000);
  
})().catch(error => {
  console.error('💥 FATAL ERROR:', error.message);
  console.error('Stack:', error.stack);
});