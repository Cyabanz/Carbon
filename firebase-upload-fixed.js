// FIXED FIREBASE GAMES UPLOAD - Copy and paste this into Eruda console
(async function() {
  console.log('🎮 Firebase Games Upload Starting (Fixed Version)...');
  
  // Check Firebase availability
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase not found!');
    return;
  }
  
  if (!firebase.apps.length) {
    console.error('❌ Firebase not initialized!');
    return;
  }
  
  const db = firebase.firestore();
  
  // Fetch games data
  let gamesData;
  try {
    console.log('📥 Fetching games.json...');
    const response = await fetch('./games.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    gamesData = await response.json();
    console.log('✅ Games data loaded:', gamesData);
    console.log(`📊 Found ${gamesData.total_games} games to upload`);
  } catch (error) {
    console.error('❌ Error fetching games.json:', error);
    return;
  }
  
  // Validate games data
  if (!gamesData.games || !Array.isArray(gamesData.games)) {
    console.error('❌ Invalid games data structure');
    return;
  }
  
  // Upload games one by one to avoid batch issues
  console.log('🔄 Starting individual uploads...');
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < gamesData.games.length; i++) {
    const game = gamesData.games[i];
    
    try {
      // Validate game data
      if (!game.name || !game.directory) {
        console.warn(`⚠️ Skipping invalid game at index ${i}:`, game);
        continue;
      }
      
      // Generate clean game ID
      const gameId = game.directory.replace('games/', '').replace(/[^a-zA-Z0-9-_]/g, '-');
      
      // Create game document
      const gameDoc = {
        id: gameId,
        name: game.name || 'Unknown Game',
        directory: game.directory || '',
        path: game.path || '',
        category: 'action',
        image: `https://via.placeholder.com/400x300/00d4ff/ffffff?text=${encodeURIComponent(game.name || 'Game')}`,
        description: `Play ${game.name || 'this game'} - A fun HTML5 game from YouTube Playables`,
        featured: false,
        url: `./games/${gameId}/index.html`,
        developer: 'YouTube Playables',
        release: '2024',
        technology: 'HTML5',
        platforms: ['Browser'],
        tags: ['html5', 'youtube-playables', 'browser-game'],
        controls: 'Use mouse and keyboard to play',
        source: gamesData.source || 'https://github.com/bubbls/youtube-playables',
        addedAt: firebase.firestore.FieldValue.serverTimestamp(),
        playCount: 0,
        avgRating: 0,
        totalPlaytime: 0,
        active: true
      };
      
      // Upload individual game
      await db.collection('games').doc(gameId).set(gameDoc);
      successCount++;
      
      if (successCount % 10 === 0) {
        console.log(`✅ Uploaded ${successCount}/${gamesData.games.length} games`);
      }
      
    } catch (error) {
      console.error(`❌ Error uploading game ${i} (${game.name}):`, error);
      errorCount++;
    }
  }
  
  // Create metadata
  try {
    console.log('📊 Creating metadata...');
    await db.collection('metadata').doc('games').set({
      totalGames: gamesData.total_games || gamesData.games.length,
      uploadedGames: successCount,
      failedGames: errorCount,
      source: gamesData.source || 'https://github.com/bubbls/youtube-playables',
      description: gamesData.description || 'YouTube Playables collection',
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
      version: '1.0.1'
    });
    console.log('✅ Metadata created');
  } catch (error) {
    console.error('❌ Error creating metadata:', error);
  }
  
  console.log(`🎉 Upload complete!`);
  console.log(`✅ Successfully uploaded: ${successCount} games`);
  console.log(`❌ Failed uploads: ${errorCount} games`);
  
  // Verify upload
  setTimeout(async () => {
    console.log('🔍 Verifying upload...');
    try {
      const snapshot = await db.collection('games').get();
      console.log(`📊 Total games in Firebase: ${snapshot.size}`);
      
      // Show sample games with proper names
      console.log('📋 Sample games:');
      snapshot.docs.slice(0, 5).forEach(doc => {
        const data = doc.data();
        console.log(`   • ${data.name} (ID: ${doc.id})`);
      });
      
    } catch (error) {
      console.error('❌ Verification error:', error);
    }
  }, 2000);
  
})().catch(error => {
  console.error('💥 Fatal error:', error.message || error);
  console.error('Stack trace:', error.stack);
});