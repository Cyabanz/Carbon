// Firebase Configuration and Services
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Firestore Collections Structure:
/*
Collections used by the games platform:

1. daily-content/{date}
   - gameOfTheDay: object (complete game data)
   - dailyPicks: array (array of game objects)
   - date: string

2. user-progress/{userId}
   - lastPlayed: object
     - gameId: number
     - timestamp: number
     - progress: number (0-100)
   - completedGames: array of gameIds
   - totalPlaytime: number (milliseconds)
   - achievements: array

3. user-activity/{userId}
   - activities: array of activity objects
     - action: string
     - data: object
     - timestamp: number
     - userId: string

4. user-pins/{userId}
   - gameId: number (or null)
   - timestamp: number

5. user-preferences/{userId}
   - favoriteCategories: array
   - difficulty: string
   - notifications: boolean
   - theme: string

6. game-stats/{gameId}
   - playCount: number
   - avgRating: number
   - totalPlaytime: number
   - lastUpdated: timestamp
*/

// Firebase Rules Example:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read daily content
    match /daily-content/{date} {
      allow read: if true;
      allow write: if false; // Only server can write
    }
    
    // Users can only access their own data
    match /user-progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /user-activity/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /user-pins/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /user-preferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Game stats are readable by all, writable by authenticated users
    match /game-stats/{gameId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
*/

// Helper functions for Firebase operations
export const FirebaseService = {
  // Daily content management
  async getDailyContent() {
    const today = new Date().toDateString();
    try {
      const dailyDoc = await getDoc(doc(db, 'daily-content', today));
      return dailyDoc.exists() ? dailyDoc.data() : null;
    } catch (error) {
      console.error('Error fetching daily content:', error);
      return null;
    }
  },

  async setDailyContent(gameOfTheDay, dailyPicks) {
    const today = new Date().toDateString();
    try {
      await setDoc(doc(db, 'daily-content', today), {
        gameOfTheDay,
        dailyPicks,
        date: today,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error('Error setting daily content:', error);
    }
  },

  // User progress management
  async updateUserProgress(userId, gameId, progress = 0) {
    try {
      await setDoc(doc(db, 'user-progress', userId), {
        lastPlayed: {
          gameId,
          timestamp: Date.now(),
          progress
        }
      }, { merge: true });
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  },

  async getUserProgress(userId) {
    try {
      const progressDoc = await getDoc(doc(db, 'user-progress', userId));
      return progressDoc.exists() ? progressDoc.data() : null;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  },

  // Activity tracking
  async trackActivity(userId, action, data = {}) {
    const activity = {
      action,
      data,
      timestamp: Date.now(),
      userId
    };

    try {
      await updateDoc(doc(db, 'user-activity', userId), {
        activities: arrayUnion(activity)
      });
    } catch (error) {
      // Document might not exist, create it
      try {
        await setDoc(doc(db, 'user-activity', userId), {
          activities: [activity]
        });
      } catch (createError) {
        console.error('Failed to track activity:', createError);
      }
    }
  },

  async getUserActivities(userId, limit = 10) {
    try {
      const activityDoc = await getDoc(doc(db, 'user-activity', userId));
      if (activityDoc.exists()) {
        const activities = activityDoc.data().activities || [];
        return activities.slice(-limit).reverse();
      }
      return [];
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }
  },

  // Pinned games management
  async pinGame(userId, gameId) {
    try {
      await setDoc(doc(db, 'user-pins', userId), {
        gameId,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error pinning game:', error);
    }
  },

  async unpinGame(userId) {
    try {
      await setDoc(doc(db, 'user-pins', userId), {
        gameId: null,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error unpinning game:', error);
    }
  },

  async getPinnedGame(userId) {
    try {
      const pinnedDoc = await getDoc(doc(db, 'user-pins', userId));
      return pinnedDoc.exists() ? pinnedDoc.data() : null;
    } catch (error) {
      console.error('Error fetching pinned game:', error);
      return null;
    }
  },

  // Game statistics
  async updateGameStats(gameId, playCount = 1) {
    try {
      const statsRef = doc(db, 'game-stats', gameId.toString());
      await updateDoc(statsRef, {
        playCount: increment(playCount),
        lastPlayed: Date.now()
      });
    } catch (error) {
      // Document might not exist, create it
      try {
        await setDoc(doc(db, 'game-stats', gameId.toString()), {
          playCount: 1,
          lastPlayed: Date.now(),
          avgRating: 0,
          totalPlaytime: 0
        });
      } catch (createError) {
        console.error('Failed to update game stats:', createError);
      }
    }
  }
};

// Demo mode for development/testing
export const DemoMode = {
  enabled: true, // Set to false when using real Firebase
  
  // Simulated data for demo
  demoUser: {
    uid: 'demo-user-123',
    isAnonymous: true,
    displayName: 'Demo User',
    photoURL: null
  },

  demoProgress: {
    lastPlayed: {
      gameId: 1,
      timestamp: Date.now() - 86400000, // 1 day ago
      progress: 65
    }
  },

  demoActivities: [
    { action: 'play', data: { gameId: 1 }, timestamp: Date.now() - 3600000 },
    { action: 'search', data: { query: 'puzzle' }, timestamp: Date.now() - 7200000 },
    { action: 'pin', data: { gameId: 2 }, timestamp: Date.now() - 10800000 }
  ],

  demoPinnedGame: { gameId: 2, timestamp: Date.now() - 86400000 }
};

export default firebaseConfig;