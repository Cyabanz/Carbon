# Firebase Realtime Database Setup for Carbon Multi

## Overview
All multiplayer games have been converted to use Firebase Realtime Database instead of Firestore to eliminate quota limits and improve performance. This includes:

- **Typing Duel**: Speed typing challenge with real-time progress tracking
- **Reaction Test**: Lightning-fast reflexes with best-of-5 rounds  
- **Mini Racing**: High-speed track racing with emoji cars and obstacles
- **Ping Pong**: Real-time paddle action (already using Realtime Database)

## Firebase Rules Setup

1. Go to your Firebase Console
2. Navigate to **Realtime Database** → **Rules**
3. Replace the existing rules with the following:

```json
{
  "rules": {
    "game-rooms": {
      "$roomId": {
        ".read": true,
        ".write": "auth != null",
        "gameState": {
          ".read": true,
          ".write": "auth != null"
        }
      }
    },
    "pong-rooms": {
      "$roomId": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    "pong-physics": {
      "$roomId": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    "pong-players": {
      "$roomId": {
        ".read": true,
        ".write": "auth != null"
      }
    },
    ".read": false,
    ".write": false
  }
}
```

## Database Structure

### General Game Rooms (`game-rooms`)
Used for Typing Duel, Reaction Test, and Mini Racing:

```
game-rooms/
  {roomId}/
    gameType: "typing" | "reaction" | "racing"
    hostId: string
    hostName: string
    hostPhoto: string
    guestId: string | null
    guestName: string | null
    guestPhoto: string | null
    status: "waiting" | "playing" | "completed" | "disconnected"
    winner: "player1" | "player2" | "tie" | null
    createdAt: timestamp
    lastActivity: timestamp
    gameState: {
      // Game-specific state data
    }
```

### Typing Duel Game State
```
gameState: {
  sentence: string
  player1Progress: number
  player1Text: string
  player2Progress: number
  player2Text: string
  finished: {
    player1: boolean
    player2: boolean
  }
  errors: {
    player1: number
    player2: number
  }
  startTime: timestamp | null
  endTime: timestamp | null
  winner: "player1" | "player2" | null
}
```

### Reaction Test Game State
```
gameState: {
  round: number
  maxRounds: number (5)
  currentState: "waiting" | "go" | "early" | "results" | "completed"
  changeTime: timestamp
  player1Score: number
  player2Score: number
  player1Time: number | null | -1 (for early)
  player2Time: number | null | -1 (for early)
}
```

### Mini Racing Game State
```
gameState: {
  maxLaps: number (3)
  player1: {
    x: number
    y: number
    laps: number
    speed: number
    finishLineCrossed: boolean
  }
  player2: {
    x: number
    y: number
    laps: number
    speed: number
    finishLineCrossed: boolean
  }
  obstacles: [
    {
      x: number
      y: number
    }
  ]
}
```

### Ping Pong Structure
Ping Pong uses separate paths for optimized performance:
- `pong-rooms/{roomId}` - Room metadata
- `pong-physics/{roomId}` - Ball physics and paddles
- `pong-players/{roomId}` - Player connection status

## Benefits of Realtime Database

1. **No Quota Limits**: Unlike Firestore, Realtime Database has much higher limits
2. **Real-time Updates**: Instant synchronization across all players
3. **Better Performance**: Optimized for real-time multiplayer games
4. **Simplified Data Model**: Easier to manage game state
5. **Disconnect Handling**: Built-in `.onDisconnect()` for cleanup

## Game Features

### Typing Duel
- Real-time typing progress visualization
- Character-by-character accuracy tracking
- Error counting and correction feedback
- Instant winner detection
- Visual feedback for typing correctness

### Reaction Test
- Random timing between 2-5 seconds
- "Too early" penalty detection
- Best-of-5 rounds scoring
- Real-time reaction time display
- Color-coded game states

### Mini Racing
- Emoji-based graphics (🏎️🚗 cars, 📦 crates)
- Collision detection with obstacles
- Lap counting and finish line detection
- Arrow key controls for movement
- Real-time position synchronization

### Ping Pong
- 60 FPS guest prediction for smooth gameplay
- 30 FPS authoritative host physics
- Client-side prediction with server correction
- Responsive paddle collision detection
- Optimized for low-latency multiplayer

## Testing

All games support:
- Anonymous authentication (guest play)
- Google sign-in authentication
- Room creation and joining
- Real-time opponent matching
- Disconnection handling
- Winner screens with animations
- Clean session management

## Performance Optimizations

- Throttled updates to prevent excessive database calls
- Client-side prediction for smooth gameplay
- Optimized data structures for minimal bandwidth
- Efficient listener management
- Automatic cleanup on disconnection

The system is now completely quota-free and provides smooth real-time multiplayer gaming experience!