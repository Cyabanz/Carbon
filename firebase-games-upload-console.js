// Firebase Games Upload Script for Console/Eruda
// Paste this entire script into your browser console (Eruda) to upload all games to Firebase

(async function uploadGamesToFirebase() {
  console.log('🎮 Starting Firebase Games Upload...');
  
  // Check if Firebase is available
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase not found! Make sure Firebase SDK is loaded.');
    return;
  }
  
  if (!firebase.apps.length) {
    console.error('❌ Firebase not initialized! Make sure Firebase is configured.');
    return;
  }
  
  const db = firebase.firestore();
  
  // Fetch games.json data
  let gamesData;
  try {
    console.log('📥 Fetching games.json...');
    const response = await fetch('./games.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    gamesData = await response.json();
    console.log(`✅ Found ${gamesData.total_games} games to upload`);
  } catch (error) {
    console.error('❌ Error fetching games.json:', error);
    return;
  }
  
  // Upload games to Firebase
  let batch = db.batch(); // Initialize batch here
  const gamesCollection = db.collection('games');
  let uploadCount = 0;
  
  console.log('🔄 Starting batch upload...');
  
  for (let i = 0; i < gamesData.games.length; i++) {
    const game = gamesData.games[i];
    
    // Generate game ID from directory name
    const gameId = game.directory.replace('games/', '');
    
    // Enhanced game object for Firebase
    const gameDoc = {
      id: gameId,
      name: game.name,
      directory: game.directory,
      path: game.path,
      category: 'action', // Default category, you can customize this
      image: `https://via.placeholder.com/400x300/00d4ff/ffffff?text=${encodeURIComponent(game.name)}`,
      description: `Play ${game.name} - A fun HTML5 game from YouTube Playables`,
      featured: false,
      url: `./games/${gameId}/index.html`, // Assuming index.html in each game folder
      developer: 'YouTube Playables',
      release: '2024',
      technology: 'HTML5',
      platforms: ['Browser'],
      tags: ['html5', 'youtube-playables', 'browser-game'],
      controls: 'Use mouse and keyboard to play',
      // Metadata
      source: gamesData.source,
      addedAt: firebase.firestore.FieldValue.serverTimestamp(),
      playCount: 0,
      avgRating: 0,
      totalPlaytime: 0,
      active: true
    };
    
    // Add to batch
    const docRef = gamesCollection.doc(gameId);
    batch.set(docRef, gameDoc);
    uploadCount++;
    
    // Firebase batch limit is 500, so commit if we reach that
    if (uploadCount % 500 === 0 || i === gamesData.games.length - 1) {
      try {
        await batch.commit();
        console.log(`✅ Uploaded batch: ${uploadCount} games`);
        
        // Create new batch for remaining games
        if (i < gamesData.games.length - 1) {
          batch = db.batch();
        }
      } catch (error) {
        console.error(`❌ Error uploading batch at game ${uploadCount}:`, error);
        return;
      }
    }
  }
  
  // Create metadata document
  try {
    console.log('📊 Creating metadata document...');
    await db.collection('metadata').doc('games').set({
      totalGames: gamesData.total_games,
      source: gamesData.source,
      description: gamesData.description,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      uploadedAt: firebase.firestore.FieldValue.serverTimestamp(),
      categories: ['action', 'puzzle', 'arcade', 'strategy', 'racing'], // Default categories
      version: '1.0.0'
    });
    console.log('✅ Metadata document created');
  } catch (error) {
    console.error('❌ Error creating metadata:', error);
  }
  
  // Create game categories collection
  try {
    console.log('📂 Creating game categories...');
    const categories = [
      { id: 'action', name: 'Action', description: 'Fast-paced action games', icon: '⚡' },
      { id: 'puzzle', name: 'Puzzle', description: 'Brain-teasing puzzle games', icon: '🧩' },
      { id: 'arcade', name: 'Arcade', description: 'Classic arcade-style games', icon: '🕹️' },
      { id: 'strategy', name: 'Strategy', description: 'Strategic thinking games', icon: '🎯' },
      { id: 'racing', name: 'Racing', description: 'High-speed racing games', icon: '🏎️' },
      { id: 'sports', name: 'Sports', description: 'Sports and athletic games', icon: '⚽' }
    ];
    
    const categoriesBatch = db.batch();
    categories.forEach(category => {
      const catRef = db.collection('categories').doc(category.id);
      categoriesBatch.set(catRef, {
        ...category,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await categoriesBatch.commit();
    console.log('✅ Game categories created');
  } catch (error) {
    console.error('❌ Error creating categories:', error);
  }
  
  console.log(`🎉 Firebase upload complete! ${uploadCount} games uploaded successfully`);
  console.log('📋 Summary:');
  console.log(`   • Games uploaded: ${uploadCount}`);
  console.log(`   • Source: ${gamesData.source}`);
  console.log(`   • Collections created: games, metadata, categories`);
  console.log('');
  console.log('🔍 You can now query your games in Firebase console:');
  console.log('   firebase.firestore().collection("games").get().then(snapshot => console.log("Games:", snapshot.docs.map(doc => doc.data())))');
  
})().catch(error => {
  console.error('💥 Fatal error during upload:', error);
});

// Helper function to verify upload (run this after the main script)
function verifyUpload() {
  console.log('🔍 Verifying Firebase upload...');
  
  firebase.firestore().collection('games').get().then(snapshot => {
    console.log(`✅ Found ${snapshot.size} games in Firebase`);
    console.log('📋 Sample games:');
    snapshot.docs.slice(0, 5).forEach(doc => {
      const game = doc.data();
      console.log(`   • ${game.name} (${doc.id})`);
    });
  }).catch(error => {
    console.error('❌ Error verifying upload:', error);
  });
  
  firebase.firestore().collection('metadata').doc('games').get().then(doc => {
    if (doc.exists) {
      console.log('✅ Metadata document found:', doc.data());
    } else {
      console.log('⚠️ Metadata document not found');
    }
  }).catch(error => {
    console.error('❌ Error checking metadata:', error);
  });
}

// Auto-run verification after 2 seconds
setTimeout(verifyUpload, 2000);