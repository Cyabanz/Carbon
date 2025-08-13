// COMPLETE FIREBASE UPLOAD - ALL 67 GAMES
// Your actual Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC4ilHYP1T-kdXbWPoHJHhD2aj0pNWmMec',
  authDomain: 'carbon-services.firebaseapp.com',
  databaseURL: 'https://carbon-services-default-rtdb.firebaseio.com',
  projectId: 'carbon-services',
  storageBucket: 'carbon-services.firebasestorage.app',
  messagingSenderId: '288385472070',
  appId: '1:288385472070:web:c4be3ff186e248fc645c47',
  measurementId: 'G-Y2K1RQYE74'
};

console.log('🔥 Uploading ALL 67 games to your Firebase...');

(async function() {
  try {
    // Initialize Firebase if not already done
      firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();
    
    const games = [
  {
    "_id": "3d-bowling",
    "id": "3d-bowling",
    "title": "3D Bowling",
    "name": "3D Bowling",
    "directory": "games/3d-bowling",
    "path": "./games/3d-bowling",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=3D%20Bowling",
    "description": "Play 3D Bowling - HTML5 game from YouTube Playables",
    "featured": true,
    "url": "./games/3d-bowling/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.717Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "8-ball-classic",
    "id": "8-ball-classic",
    "title": "8-Ball Classic",
    "name": "8-Ball Classic",
    "directory": "games/8-ball-classic",
    "path": "./games/8-ball-classic",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=8-Ball%20Classic",
    "description": "Play 8-Ball Classic - HTML5 game from YouTube Playables",
    "featured": true,
    "url": "./games/8-ball-classic/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "99-balls-3d",
    "id": "99-balls-3d",
    "title": "99 Balls 3D",
    "name": "99 Balls 3D",
    "directory": "games/99-balls-3d",
    "path": "./games/99-balls-3d",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=99%20Balls%203D",
    "description": "Play 99 Balls 3D - HTML5 game from YouTube Playables",
    "featured": true,
    "url": "./games/99-balls-3d/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "amaze",
    "id": "amaze",
    "title": "Amaze",
    "name": "Amaze",
    "directory": "games/amaze",
    "path": "./games/amaze",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Amaze",
    "description": "Play Amaze - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/amaze/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "angry-birds-showdown",
    "id": "angry-birds-showdown",
    "title": "Angry Birds Showdown",
    "name": "Angry Birds Showdown",
    "directory": "games/angry-birds-showdown",
    "path": "./games/angry-birds-showdown",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Angry%20Birds%20Showdown",
    "description": "Play Angry Birds Showdown - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/angry-birds-showdown/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "aquapark-io",
    "id": "aquapark-io",
    "title": "Aquapark.io",
    "name": "Aquapark.io",
    "directory": "games/aquapark-io",
    "path": "./games/aquapark-io",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Aquapark.io",
    "description": "Play Aquapark.io - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/aquapark-io/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "archery-world-tour",
    "id": "archery-world-tour",
    "title": "Archery World Tour",
    "name": "Archery World Tour",
    "directory": "games/archery-world-tour",
    "path": "./games/archery-world-tour",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Archery%20World%20Tour",
    "description": "Play Archery World Tour - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/archery-world-tour/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "attack-hole",
    "id": "attack-hole",
    "title": "Attack Hole",
    "name": "Attack Hole",
    "directory": "games/attack-hole",
    "path": "./games/attack-hole",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Attack%20Hole",
    "description": "Play Attack Hole - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/attack-hole/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "ball-blast",
    "id": "ball-blast",
    "title": "Ball Blast",
    "name": "Ball Blast",
    "directory": "games/ball-blast",
    "path": "./games/ball-blast",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Ball%20Blast",
    "description": "Play Ball Blast - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/ball-blast/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "basketball-frvr",
    "id": "basketball-frvr",
    "title": "Basketball FRVR",
    "name": "Basketball FRVR",
    "directory": "games/basketball-frvr",
    "path": "./games/basketball-frvr",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Basketball%20FRVR",
    "description": "Play Basketball FRVR - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/basketball-frvr/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "basket-battle",
    "id": "basket-battle",
    "title": "Basket Battle",
    "name": "Basket Battle",
    "directory": "games/basket-battle",
    "path": "./games/basket-battle",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Basket%20Battle",
    "description": "Play Basket Battle - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/basket-battle/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "bazooka-boy",
    "id": "bazooka-boy",
    "title": "Bazooka Boy",
    "name": "Bazooka Boy",
    "directory": "games/bazooka-boy",
    "path": "./games/bazooka-boy",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Bazooka%20Boy",
    "description": "Play Bazooka Boy - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/bazooka-boy/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "bolly-beat",
    "id": "bolly-beat",
    "title": "Bolly Beat",
    "name": "Bolly Beat",
    "directory": "games/bolly-beat",
    "path": "./games/bolly-beat",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Bolly%20Beat",
    "description": "Play Bolly Beat - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/bolly-beat/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "bottle-jump-3d",
    "id": "bottle-jump-3d",
    "title": "Bottle Jump 3D",
    "name": "Bottle Jump 3D",
    "directory": "games/bottle-jump-3d",
    "path": "./games/bottle-jump-3d",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Bottle%20Jump%203D",
    "description": "Play Bottle Jump 3D - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/bottle-jump-3d/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "bouncemasters",
    "id": "bouncemasters",
    "title": "Bouncemasters",
    "name": "Bouncemasters",
    "directory": "games/bouncemasters",
    "path": "./games/bouncemasters",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Bouncemasters",
    "description": "Play Bouncemasters - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/bouncemasters/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "bowmasters",
    "id": "bowmasters",
    "title": "Bowmasters",
    "name": "Bowmasters",
    "directory": "games/bowmasters",
    "path": "./games/bowmasters",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Bowmasters",
    "description": "Play Bowmasters - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/bowmasters/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "bridge-race",
    "id": "bridge-race",
    "title": "Bridge Race",
    "name": "Bridge Race",
    "directory": "games/bridge-race",
    "path": "./games/bridge-race",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Bridge%20Race",
    "description": "Play Bridge Race - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/bridge-race/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "build-a-queen",
    "id": "build-a-queen",
    "title": "Build a Queen",
    "name": "Build a Queen",
    "directory": "games/build-a-queen",
    "path": "./games/build-a-queen",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Build%20a%20Queen",
    "description": "Play Build a Queen - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/build-a-queen/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "cannon-balls-3d",
    "id": "cannon-balls-3d",
    "title": "Cannon Balls 3D",
    "name": "Cannon Balls 3D",
    "directory": "games/cannon-balls-3d",
    "path": "./games/cannon-balls-3d",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Cannon%20Balls%203D",
    "description": "Play Cannon Balls 3D - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/cannon-balls-3d/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "carrom-clash",
    "id": "carrom-clash",
    "title": "Carrom Clash",
    "name": "Carrom Clash",
    "directory": "games/carrom-clash",
    "path": "./games/carrom-clash",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Carrom%20Clash",
    "description": "Play Carrom Clash - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/carrom-clash/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "chess-classic",
    "id": "chess-classic",
    "title": "Chess Classic",
    "name": "Chess Classic",
    "directory": "games/chess-classic",
    "path": "./games/chess-classic",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Chess%20Classic",
    "description": "Play Chess Classic - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/chess-classic/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "city-smash",
    "id": "city-smash",
    "title": "City Smash",
    "name": "City Smash",
    "directory": "games/city-smash",
    "path": "./games/city-smash",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=City%20Smash",
    "description": "Play City Smash - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/city-smash/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "color-burst-3d",
    "id": "color-burst-3d",
    "title": "Color Burst 3D",
    "name": "Color Burst 3D",
    "directory": "games/color-burst-3d",
    "path": "./games/color-burst-3d",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Color%20Burst%203D",
    "description": "Play Color Burst 3D - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/color-burst-3d/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "color-match",
    "id": "color-match",
    "title": "Color Match",
    "name": "Color Match",
    "directory": "games/color-match",
    "path": "./games/color-match",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Color%20Match",
    "description": "Play Color Match - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/color-match/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "color-water-sort-3d",
    "id": "color-water-sort-3d",
    "title": "Color Water Sort 3D",
    "name": "Color Water Sort 3D",
    "directory": "games/color-water-sort-3d",
    "path": "./games/color-water-sort-3d",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Color%20Water%20Sort%203D",
    "description": "Play Color Water Sort 3D - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/color-water-sort-3d/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "crossy-road",
    "id": "crossy-road",
    "title": "Crossy Road",
    "name": "Crossy Road",
    "directory": "games/crossy-road",
    "path": "./games/crossy-road",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Crossy%20Road",
    "description": "Play Crossy Road - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/crossy-road/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "dig-deep",
    "id": "dig-deep",
    "title": "Dig Deep",
    "name": "Dig Deep",
    "directory": "games/dig-deep",
    "path": "./games/dig-deep",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Dig%20Deep",
    "description": "Play Dig Deep - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/dig-deep/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "draw-the-line",
    "id": "draw-the-line",
    "title": "Draw the Line",
    "name": "Draw the Line",
    "directory": "games/draw-the-line",
    "path": "./games/draw-the-line",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Draw%20the%20Line",
    "description": "Play Draw the Line - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/draw-the-line/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "fashion-battle",
    "id": "fashion-battle",
    "title": "Fashion Battle",
    "name": "Fashion Battle",
    "directory": "games/fashion-battle",
    "path": "./games/fashion-battle",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Fashion%20Battle",
    "description": "Play Fashion Battle - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/fashion-battle/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "find-the-alien",
    "id": "find-the-alien",
    "title": "Find the Alien",
    "name": "Find the Alien",
    "directory": "games/find-the-alien",
    "path": "./games/find-the-alien",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Find%20the%20Alien",
    "description": "Play Find the Alien - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/find-the-alien/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.718Z",
    "updatedAt": "2025-08-13T22:52:56.718Z"
  },
  {
    "_id": "flappy-dunk",
    "id": "flappy-dunk",
    "title": "Flappy Dunk",
    "name": "Flappy Dunk",
    "directory": "games/flappy dunk",
    "path": "./games/flappy dunk",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Flappy%20Dunk",
    "description": "Play Flappy Dunk - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/flappy-dunk/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "fork-n-sausage",
    "id": "fork-n-sausage",
    "title": "Fork n Sausage",
    "name": "Fork n Sausage",
    "directory": "games/fork-n-sausage",
    "path": "./games/fork-n-sausage",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Fork%20n%20Sausage",
    "description": "Play Fork n Sausage - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/fork-n-sausage/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "freekick-football",
    "id": "freekick-football",
    "title": "Freekick Football",
    "name": "Freekick Football",
    "directory": "games/freekick-football",
    "path": "./games/freekick-football",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Freekick%20Football",
    "description": "Play Freekick Football - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/freekick-football/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "go-escape",
    "id": "go-escape",
    "title": "Go Escape",
    "name": "Go Escape",
    "directory": "games/go-escape",
    "path": "./games/go-escape",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Go%20Escape",
    "description": "Play Go Escape - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/go-escape/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "guess-their-answer",
    "id": "guess-their-answer",
    "title": "Guess Their Answer",
    "name": "Guess Their Answer",
    "directory": "games/guess-their-answer",
    "path": "./games/guess-their-answer",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Guess%20Their%20Answer",
    "description": "Play Guess Their Answer - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/guess-their-answer/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "gym-stack",
    "id": "gym-stack",
    "title": "Gym Stack",
    "name": "Gym Stack",
    "directory": "games/gym-stack",
    "path": "./games/gym-stack",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Gym%20Stack",
    "description": "Play Gym Stack - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/gym-stack/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "harvest-io",
    "id": "harvest-io",
    "title": "Harvest.io",
    "name": "Harvest.io",
    "directory": "games/harvest-io",
    "path": "./games/harvest-io",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Harvest.io",
    "description": "Play Harvest.io - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/harvest-io/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "hide-n-seek",
    "id": "hide-n-seek",
    "title": "Hide n Seek",
    "name": "Hide n Seek",
    "directory": "games/hide-n-seek",
    "path": "./games/hide-n-seek",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Hide%20n%20Seek",
    "description": "Play Hide n Seek - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/hide-n-seek/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "hill-climb-racing-lite",
    "id": "hill-climb-racing-lite",
    "title": "Hill Climb Racing Lite",
    "name": "Hill Climb Racing Lite",
    "directory": "games/hill-climb-racing-lite",
    "path": "./games/hill-climb-racing-lite",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Hill%20Climb%20Racing%20Lite",
    "description": "Play Hill Climb Racing Lite - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/hill-climb-racing-lite/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "kitchen-bazar",
    "id": "kitchen-bazar",
    "title": "Kitchen Bazar",
    "name": "Kitchen Bazar",
    "directory": "games/kitchen-bazar",
    "path": "./games/kitchen-bazar",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Kitchen%20Bazar",
    "description": "Play Kitchen Bazar - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/kitchen-bazar/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "magic-tiles-3",
    "id": "magic-tiles-3",
    "title": "Magic Tiles 3",
    "name": "Magic Tiles 3",
    "directory": "games/magic-tiles-3",
    "path": "./games/magic-tiles-3",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Magic%20Tiles%203",
    "description": "Play Magic Tiles 3 - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/magic-tiles-3/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "maze-speedrun",
    "id": "maze-speedrun",
    "title": "Maze Speedrun",
    "name": "Maze Speedrun",
    "directory": "games/maze-speedrun",
    "path": "./games/maze-speedrun",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Maze%20Speedrun",
    "description": "Play Maze Speedrun - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/maze-speedrun/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "mob-control-html5",
    "id": "mob-control-html5",
    "title": "Mob Control HTML5",
    "name": "Mob Control HTML5",
    "directory": "games/mob-control-html5",
    "path": "./games/mob-control-html5",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Mob%20Control%20HTML5",
    "description": "Play Mob Control HTML5 - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/mob-control-html5/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "om-nom-run",
    "id": "om-nom-run",
    "title": "Om Nom Run",
    "name": "Om Nom Run",
    "directory": "games/om-nom-run",
    "path": "./games/om-nom-run",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Om%20Nom%20Run",
    "description": "Play Om Nom Run - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/om-nom-run/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "pac-man-superfast",
    "id": "pac-man-superfast",
    "title": "Pac-Man Superfast",
    "name": "Pac-Man Superfast",
    "directory": "games/pac-man-superfast",
    "path": "./games/pac-man-superfast",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Pac-Man%20Superfast",
    "description": "Play Pac-Man Superfast - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/pac-man-superfast/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "parking-rush",
    "id": "parking-rush",
    "title": "Parking Rush",
    "name": "Parking Rush",
    "directory": "games/parking-rush",
    "path": "./games/parking-rush",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Parking%20Rush",
    "description": "Play Parking Rush - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/parking-rush/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "pokey-ball",
    "id": "pokey-ball",
    "title": "Pokey Ball",
    "name": "Pokey Ball",
    "directory": "games/pokey-ball",
    "path": "./games/pokey-ball",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Pokey%20Ball",
    "description": "Play Pokey Ball - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/pokey-ball/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "pou",
    "id": "pou",
    "title": "Pou",
    "name": "Pou",
    "directory": "games/pou",
    "path": "./games/pou",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Pou",
    "description": "Play Pou - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/pou/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "race-master-3d",
    "id": "race-master-3d",
    "title": "Race Master 3D",
    "name": "Race Master 3D",
    "directory": "games/race-master-3d",
    "path": "./games/race-master-3d",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Race%20Master%203D",
    "description": "Play Race Master 3D - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/race-master-3d/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "room-sort",
    "id": "room-sort",
    "title": "Room Sort",
    "name": "Room Sort",
    "directory": "games/room-sort",
    "path": "./games/room-sort",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Room%20Sort",
    "description": "Play Room Sort - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/room-sort/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "scooter-xtreme",
    "id": "scooter-xtreme",
    "title": "Scooter Xtreme",
    "name": "Scooter Xtreme",
    "directory": "games/scooter-xtreme",
    "path": "./games/scooter-xtreme",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Scooter%20Xtreme",
    "description": "Play Scooter Xtreme - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/scooter-xtreme/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "slice-it-all",
    "id": "slice-it-all",
    "title": "Slice It All",
    "name": "Slice It All",
    "directory": "games/slice-it-all",
    "path": "./games/slice-it-all",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Slice%20It%20All",
    "description": "Play Slice It All - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/slice-it-all/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "slime-io",
    "id": "slime-io",
    "title": "Slime.io",
    "name": "Slime.io",
    "directory": "games/slime-io",
    "path": "./games/slime-io",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Slime.io",
    "description": "Play Slime.io - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/slime-io/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "solar-smash",
    "id": "solar-smash",
    "title": "Solar Smash",
    "name": "Solar Smash",
    "directory": "games/solar-smash",
    "path": "./games/solar-smash",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Solar%20Smash",
    "description": "Play Solar Smash - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/solar-smash/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "stacky-dash",
    "id": "stacky-dash",
    "title": "Stacky Dash",
    "name": "Stacky Dash",
    "directory": "games/stacky-dash",
    "path": "./games/stacky-dash",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Stacky%20Dash",
    "description": "Play Stacky Dash - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/stacky-dash/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "state-io",
    "id": "state-io",
    "title": "State.io",
    "name": "State.io",
    "directory": "games/state io",
    "path": "./games/state io",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=State.io",
    "description": "Play State.io - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/state-io/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "stealth-master",
    "id": "stealth-master",
    "title": "Stealth Master",
    "name": "Stealth Master",
    "directory": "games/stealth-master",
    "path": "./games/stealth-master",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Stealth%20Master",
    "description": "Play Stealth Master - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/stealth-master/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "supreme-duelist",
    "id": "supreme-duelist",
    "title": "Supreme Duelist",
    "name": "Supreme Duelist",
    "directory": "games/supreme-duelist",
    "path": "./games/supreme-duelist",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Supreme%20Duelist",
    "description": "Play Supreme Duelist - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/supreme-duelist/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "sushi-roll",
    "id": "sushi-roll",
    "title": "Sushi Roll",
    "name": "Sushi Roll",
    "directory": "games/sushi-roll",
    "path": "./games/sushi-roll",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Sushi%20Roll",
    "description": "Play Sushi Roll - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/sushi-roll/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "sword-play",
    "id": "sword-play",
    "title": "Sword Play",
    "name": "Sword Play",
    "directory": "games/sword-play",
    "path": "./games/sword-play",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Sword%20Play",
    "description": "Play Sword Play - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/sword-play/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "table-tennis",
    "id": "table-tennis",
    "title": "Table Tennis",
    "name": "Table Tennis",
    "directory": "games/table-tennis",
    "path": "./games/table-tennis",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Table%20Tennis",
    "description": "Play Table Tennis - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/table-tennis/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "tall-man-run",
    "id": "tall-man-run",
    "title": "Tall Man Run",
    "name": "Tall Man Run",
    "directory": "games/tall-man-run",
    "path": "./games/tall-man-run",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Tall%20Man%20Run",
    "description": "Play Tall Man Run - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/tall-man-run/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "texas-holdem",
    "id": "texas-holdem",
    "title": "Texas Hold'em",
    "name": "Texas Hold'em",
    "directory": "games/texas-holdem",
    "path": "./games/texas-holdem",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Texas%20Hold'em",
    "description": "Play Texas Hold'em - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/texas-holdem/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "tiletopia",
    "id": "tiletopia",
    "title": "Tiletopia",
    "name": "Tiletopia",
    "directory": "games/tiletopia",
    "path": "./games/tiletopia",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Tiletopia",
    "description": "Play Tiletopia - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/tiletopia/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "tower-crash-3d",
    "id": "tower-crash-3d",
    "title": "Tower Crash 3D",
    "name": "Tower Crash 3D",
    "directory": "games/tower-crash-3d",
    "path": "./games/tower-crash-3d",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Tower%20Crash%203D",
    "description": "Play Tower Crash 3D - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/tower-crash-3d/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "trivia-crack",
    "id": "trivia-crack",
    "title": "Trivia Crack",
    "name": "Trivia Crack",
    "directory": "games/trivia-crack",
    "path": "./games/trivia-crack",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Trivia%20Crack",
    "description": "Play Trivia Crack - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/trivia-crack/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  },
  {
    "_id": "turbo-stars",
    "id": "turbo-stars",
    "title": "Turbo Stars",
    "name": "Turbo Stars",
    "directory": "games/turbo-stars",
    "path": "./games/turbo-stars",
    "category": "action",
    "image": "https://via.placeholder.com/400x300/00d4ff/ffffff?text=Turbo%20Stars",
    "description": "Play Turbo Stars - HTML5 game from YouTube Playables",
    "featured": false,
    "url": "./games/turbo-stars/index.html",
    "developer": "YouTube Playables",
    "release": "2024",
    "technology": "HTML5",
    "platforms": [
      "Browser"
    ],
    "tags": [
      "html5",
      "youtube-playables",
      "browser-game"
    ],
    "controls": "Mouse and keyboard controls",
    "playCount": 0,
    "avgRating": 0,
    "totalPlaytime": 0,
    "active": true,
    "addedAt": "2025-08-13T22:52:56.719Z",
    "updatedAt": "2025-08-13T22:52:56.719Z"
  }
];
    
    console.log(`📤 Starting upload of ${games.length} games...`);
    
    let uploaded = 0;
    
    // Upload in small batches
    const batchSize = 10;
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
        uploaded += gameBatch.length;
        console.log(`✅ Uploaded: ${uploaded}/${games.length} games`);
      } catch (error) {
        console.error('Batch failed:', error);
      }
    }
    
    // Upload metadata
    await db.collection('metadata').doc('games').set({
      totalGames: games.length,
      uploadedGames: uploaded,
      source: 'YouTube Playables',
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('🎉 UPLOAD COMPLETE!');
    
    // Verify
    const snapshot = await db.collection('games').get();
    console.log(`🔍 Verification: ${snapshot.size} games in Firebase`);
    
  } catch (error) {
    console.error('Upload failed:', error);
  }
})();