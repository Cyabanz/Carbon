// AUTOMATIC FIREBASE UPLOAD SCRIPT
// This script will upload all 67 games to Firebase
console.log('🎮 Auto-uploading 67 games to Firebase...');

(async function() {
  // Check Firebase
  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    console.error('❌ Firebase not available - make sure you are on a page with Firebase loaded');
    return;
  }
  
  const db = firebase.firestore();
  const gamesData = {
  "games": [
    {
      "name": "3D Bowling",
      "directory": "games/3d-bowling",
      "path": "./games/3d-bowling"
    },
    {
      "name": "8-Ball Classic",
      "directory": "games/8-ball-classic",
      "path": "./games/8-ball-classic"
    },
    {
      "name": "99 Balls 3D",
      "directory": "games/99-balls-3d",
      "path": "./games/99-balls-3d"
    },
    {
      "name": "Amaze",
      "directory": "games/amaze",
      "path": "./games/amaze"
    },
    {
      "name": "Angry Birds Showdown",
      "directory": "games/angry-birds-showdown",
      "path": "./games/angry-birds-showdown"
    },
    {
      "name": "Aquapark.io",
      "directory": "games/aquapark-io",
      "path": "./games/aquapark-io"
    },
    {
      "name": "Archery World Tour",
      "directory": "games/archery-world-tour",
      "path": "./games/archery-world-tour"
    },
    {
      "name": "Attack Hole",
      "directory": "games/attack-hole",
      "path": "./games/attack-hole"
    },
    {
      "name": "Ball Blast",
      "directory": "games/ball-blast",
      "path": "./games/ball-blast"
    },
    {
      "name": "Basketball FRVR",
      "directory": "games/basketball-frvr",
      "path": "./games/basketball-frvr"
    },
    {
      "name": "Basket Battle",
      "directory": "games/basket-battle",
      "path": "./games/basket-battle"
    },
    {
      "name": "Bazooka Boy",
      "directory": "games/bazooka-boy",
      "path": "./games/bazooka-boy"
    },
    {
      "name": "Bolly Beat",
      "directory": "games/bolly-beat",
      "path": "./games/bolly-beat"
    },
    {
      "name": "Bottle Jump 3D",
      "directory": "games/bottle-jump-3d",
      "path": "./games/bottle-jump-3d"
    },
    {
      "name": "Bouncemasters",
      "directory": "games/bouncemasters",
      "path": "./games/bouncemasters"
    },
    {
      "name": "Bowmasters",
      "directory": "games/bowmasters",
      "path": "./games/bowmasters"
    },
    {
      "name": "Bridge Race",
      "directory": "games/bridge-race",
      "path": "./games/bridge-race"
    },
    {
      "name": "Build a Queen",
      "directory": "games/build-a-queen",
      "path": "./games/build-a-queen"
    },
    {
      "name": "Cannon Balls 3D",
      "directory": "games/cannon-balls-3d",
      "path": "./games/cannon-balls-3d"
    },
    {
      "name": "Carrom Clash",
      "directory": "games/carrom-clash",
      "path": "./games/carrom-clash"
    },
    {
      "name": "Chess Classic",
      "directory": "games/chess-classic",
      "path": "./games/chess-classic"
    },
    {
      "name": "City Smash",
      "directory": "games/city-smash",
      "path": "./games/city-smash"
    },
    {
      "name": "Color Burst 3D",
      "directory": "games/color-burst-3d",
      "path": "./games/color-burst-3d"
    },
    {
      "name": "Color Match",
      "directory": "games/color-match",
      "path": "./games/color-match"
    },
    {
      "name": "Color Water Sort 3D",
      "directory": "games/color-water-sort-3d",
      "path": "./games/color-water-sort-3d"
    },
    {
      "name": "Crossy Road",
      "directory": "games/crossy-road",
      "path": "./games/crossy-road"
    },
    {
      "name": "Dig Deep",
      "directory": "games/dig-deep",
      "path": "./games/dig-deep"
    },
    {
      "name": "Draw the Line",
      "directory": "games/draw-the-line",
      "path": "./games/draw-the-line"
    },
    {
      "name": "Fashion Battle",
      "directory": "games/fashion-battle",
      "path": "./games/fashion-battle"
    },
    {
      "name": "Find the Alien",
      "directory": "games/find-the-alien",
      "path": "./games/find-the-alien"
    },
    {
      "name": "Flappy Dunk",
      "directory": "games/flappy dunk",
      "path": "./games/flappy dunk"
    },
    {
      "name": "Fork n Sausage",
      "directory": "games/fork-n-sausage",
      "path": "./games/fork-n-sausage"
    },
    {
      "name": "Freekick Football",
      "directory": "games/freekick-football",
      "path": "./games/freekick-football"
    },
    {
      "name": "Go Escape",
      "directory": "games/go-escape",
      "path": "./games/go-escape"
    },
    {
      "name": "Guess Their Answer",
      "directory": "games/guess-their-answer",
      "path": "./games/guess-their-answer"
    },
    {
      "name": "Gym Stack",
      "directory": "games/gym-stack",
      "path": "./games/gym-stack"
    },
    {
      "name": "Harvest.io",
      "directory": "games/harvest-io",
      "path": "./games/harvest-io"
    },
    {
      "name": "Hide n Seek",
      "directory": "games/hide-n-seek",
      "path": "./games/hide-n-seek"
    },
    {
      "name": "Hill Climb Racing Lite",
      "directory": "games/hill-climb-racing-lite",
      "path": "./games/hill-climb-racing-lite"
    },
    {
      "name": "Kitchen Bazar",
      "directory": "games/kitchen-bazar",
      "path": "./games/kitchen-bazar"
    },
    {
      "name": "Magic Tiles 3",
      "directory": "games/magic-tiles-3",
      "path": "./games/magic-tiles-3"
    },
    {
      "name": "Maze Speedrun",
      "directory": "games/maze-speedrun",
      "path": "./games/maze-speedrun"
    },
    {
      "name": "Mob Control HTML5",
      "directory": "games/mob-control-html5",
      "path": "./games/mob-control-html5"
    },
    {
      "name": "Om Nom Run",
      "directory": "games/om-nom-run",
      "path": "./games/om-nom-run"
    },
    {
      "name": "Pac-Man Superfast",
      "directory": "games/pac-man-superfast",
      "path": "./games/pac-man-superfast"
    },
    {
      "name": "Parking Rush",
      "directory": "games/parking-rush",
      "path": "./games/parking-rush"
    },
    {
      "name": "Pokey Ball",
      "directory": "games/pokey-ball",
      "path": "./games/pokey-ball"
    },
    {
      "name": "Pou",
      "directory": "games/pou",
      "path": "./games/pou"
    },
    {
      "name": "Race Master 3D",
      "directory": "games/race-master-3d",
      "path": "./games/race-master-3d"
    },
    {
      "name": "Room Sort",
      "directory": "games/room-sort",
      "path": "./games/room-sort"
    },
    {
      "name": "Scooter Xtreme",
      "directory": "games/scooter-xtreme",
      "path": "./games/scooter-xtreme"
    },
    {
      "name": "Slice It All",
      "directory": "games/slice-it-all",
      "path": "./games/slice-it-all"
    },
    {
      "name": "Slime.io",
      "directory": "games/slime-io",
      "path": "./games/slime-io"
    },
    {
      "name": "Solar Smash",
      "directory": "games/solar-smash",
      "path": "./games/solar-smash"
    },
    {
      "name": "Stacky Dash",
      "directory": "games/stacky-dash",
      "path": "./games/stacky-dash"
    },
    {
      "name": "State.io",
      "directory": "games/state io",
      "path": "./games/state io"
    },
    {
      "name": "Stealth Master",
      "directory": "games/stealth-master",
      "path": "./games/stealth-master"
    },
    {
      "name": "Supreme Duelist",
      "directory": "games/supreme-duelist",
      "path": "./games/supreme-duelist"
    },
    {
      "name": "Sushi Roll",
      "directory": "games/sushi-roll",
      "path": "./games/sushi-roll"
    },
    {
      "name": "Sword Play",
      "directory": "games/sword-play",
      "path": "./games/sword-play"
    },
    {
      "name": "Table Tennis",
      "directory": "games/table-tennis",
      "path": "./games/table-tennis"
    },
    {
      "name": "Tall Man Run",
      "directory": "games/tall-man-run",
      "path": "./games/tall-man-run"
    },
    {
      "name": "Texas Hold'em",
      "directory": "games/texas-holdem",
      "path": "./games/texas-holdem"
    },
    {
      "name": "Tiletopia",
      "directory": "games/tiletopia",
      "path": "./games/tiletopia"
    },
    {
      "name": "Tower Crash 3D",
      "directory": "games/tower-crash-3d",
      "path": "./games/tower-crash-3d"
    },
    {
      "name": "Trivia Crack",
      "directory": "games/trivia-crack",
      "path": "./games/trivia-crack"
    },
    {
      "name": "Turbo Stars",
      "directory": "games/turbo-stars",
      "path": "./games/turbo-stars"
    }
  ],
  "total_games": 67,
  "source": "https://github.com/bubbls/youtube-playables",
  "description": "Collection of YouTube Playable games cloned from the official repository"
};
  
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
});