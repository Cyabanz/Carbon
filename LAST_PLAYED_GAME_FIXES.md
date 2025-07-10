# Last Played Game & Game Status Display Fixes

## Overview
Fixed issues with last played game display in bio/profile and game status not showing properly upon page refresh in `play.html`.

## Issues Fixed

### 1. Last Played Game Not Displaying in Profile
**Problem**: The profile.html expected `lastPlayedGame` and `lastPlayedTime` fields in the user document, but play.html was only updating the `history` array.

**Solution**: 
- Updated `trackPlayActivity()` function to set both `lastPlayedGame` and `lastPlayedTime` fields
- Updated `setInGame()` function to immediately update last played game when user starts playing
- Added fallback error handling to ensure these fields are always updated

**Changes Made:**
```javascript
// Now updates both history array AND profile fields
await userRef.update({
  lastPlayedGame: gameId,
  lastPlayedTime: firebase.firestore.FieldValue.serverTimestamp()
});
```

### 2. Game Status Not Displaying Upon Refresh
**Problem**: When users refreshed the page while on a game, their status would reset to "online" instead of showing "ingame".

**Solution**:
- Modified `restoreUserStatus()` to detect if user is on a game page
- If on a game page (has `id` parameter), set status to "ingame" instead of "online"
- Added `updateStatusDisplay()` function to verify and fix status discrepancies

**Changes Made:**
```javascript
// Check if we're on a game page (has gameId parameter)
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');

if (gameId) {
  // If on a game page, set status to in-game
  await this.updateUserStatus(this.STATUS_TYPES.INGAME, gameId);
  localStorage.setItem('carbon-user-status', this.STATUS_TYPES.INGAME);
}
```

### 3. Missing User Document Fields
**Problem**: Some users might have incomplete user documents missing required fields for profile display.

**Solution**:
- Added `initializeUserDocument()` function that runs on login
- Creates complete user document for new users
- Updates existing users' documents with missing fields
- Ensures all required fields exist: `lastPlayedGame`, `lastPlayedTime`, `currentGame`, `status`, `history`

**New User Document Structure:**
```javascript
{
  uid: currentUser.uid,
  email: currentUser.email || '',
  displayName: currentUser.displayName || '',
  photoURL: currentUser.photoURL || '',
  username: '',
  bio: '',
  status: 'online',
  currentGame: null,
  lastPlayedGame: null,           // ← Required for profile
  lastPlayedTime: null,           // ← Required for profile  
  lastSeen: serverTimestamp(),
  likedGames: [],
  favoriteGames: [],
  playlist: [],
  history: [],                    // ← Game history array
  friends: [],
  friendRequests: [],
  createdAt: serverTimestamp()
}
```

### 4. Enhanced Error Handling
**Problem**: Errors in updating user data could prevent profile information from being saved.

**Solution**:
- Added comprehensive try-catch blocks with fallback approaches
- Uses `merge: true` when direct updates fail
- Multiple retry attempts for critical fields
- Detailed logging for debugging

## Technical Implementation

### Key Functions Enhanced

1. **`trackPlayActivity(uid, gameId, gameTitle)`**
   - Now updates `lastPlayedGame` and `lastPlayedTime` immediately
   - Still maintains `history` array for game history
   - Added fallback error handling

2. **`userStatusManager.setInGame(gameId)`**
   - Updates user status to "ingame"
   - Immediately sets `lastPlayedGame` and `lastPlayedTime`
   - Ensures profile displays current game correctly

3. **`userStatusManager.restoreUserStatus()`**
   - Detects if user is on a game page during refresh
   - Sets appropriate status ("ingame" vs "online")
   - Maintains correct status across page refreshes

4. **`initializeUserDocument()`** (New)
   - Ensures all required fields exist in user document
   - Creates complete structure for new users
   - Updates missing fields for existing users

5. **`updateStatusDisplay(user)`** (New)
   - Verifies status consistency on page load
   - Fixes status discrepancies automatically
   - Provides logging for debugging

### Data Flow

1. **User loads game page** → Status set to "ingame" + current game set
2. **User starts playing** → `lastPlayedGame` and `lastPlayedTime` updated
3. **User refreshes page** → Status correctly restored as "ingame"
4. **Profile page loads** → Displays last played game from `lastPlayedGame` field
5. **Friends list updates** → Shows correct "Playing X game" status

### Database Fields

**User Document Fields for Profile:**
- `currentGame` - ID of currently playing game (for live status)
- `lastPlayedGame` - ID of last played game (for profile "Last Played" section)
- `lastPlayedTime` - Timestamp of when game was last played
- `status` - Current user status ("online", "ingame", "offline")
- `history` - Array of recently played games (chronological order)

## Testing Scenarios

1. **✅ Play a game** → Profile should show it as "Last Played Game"
2. **✅ Refresh while playing** → Status should remain "ingame" 
3. **✅ Switch between games** → Last played should update to newest game
4. **✅ View friend's profile** → Should show their current/last played game
5. **✅ New user signup** → All fields should be properly initialized
6. **✅ Existing user login** → Missing fields should be added automatically

## Benefits

- **Accurate Profile Display**: Last played games now show correctly in bio/profile
- **Persistent Status**: Game status survives page refreshes
- **Robust Error Handling**: Multiple fallback approaches prevent data loss
- **Complete User Documents**: All users have properly structured profiles
- **Real-time Updates**: Status changes are immediately reflected
- **Backward Compatibility**: Existing functionality preserved

## Profile Integration

The profile.html now receives:
- `userData.currentGame` - For "Currently Playing" display
- `userData.lastPlayedGame` - For "Last Played Game" display  
- `userData.lastPlayedTime` - For "Last played X ago" timestamps
- `userData.status` - For online/offline/ingame indicators

This ensures the profile bio section displays accurate and up-to-date gaming activity.