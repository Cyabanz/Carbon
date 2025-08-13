// FIREBASE CLEANUP SCRIPT - Run this first to clean up bad data
(async function() {
  console.log('🧹 Starting Firebase cleanup...');
  
  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    console.error('❌ Firebase not available');
    return;
  }
  
  const db = firebase.firestore();
  
  try {
    // Get all games
    console.log('📋 Fetching existing games...');
    const snapshot = await db.collection('games').get();
    console.log(`Found ${snapshot.size} games to check`);
    
    let deletedCount = 0;
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      // Delete games with undefined names or invalid IDs
      if (!data.name || data.name === 'undefined' || !doc.id || doc.id === 'undefined') {
        console.log(`🗑️ Marking for deletion: ${doc.id} (name: ${data.name})`);
        batch.delete(doc.ref);
        deletedCount++;
      }
    });
    
    if (deletedCount > 0) {
      await batch.commit();
      console.log(`✅ Cleaned up ${deletedCount} invalid games`);
    } else {
      console.log('✨ No cleanup needed');
    }
    
    // Also clean metadata if needed
    await db.collection('metadata').doc('games').delete();
    console.log('🗑️ Cleared metadata');
    
    console.log('🎉 Cleanup complete! Ready for fresh upload.');
    
  } catch (error) {
    console.error('❌ Cleanup error:', error);
  }
})();