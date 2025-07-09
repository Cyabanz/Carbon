# User Status Persistence Fixes

## Overview
Fixed user status management in `play.html` to properly persist user status across page refreshes and handle offline/online states correctly.

## Issues Fixed

### 1. Status Not Persisting on Refresh
**Problem**: User status was not saved in localStorage and wasn't restored when the page reloaded.

**Solution**: 
- Added `localStorage` storage for user status and last activity time
- Added `restoreUserStatus()` function that runs on page load to set user as online
- Status is now persisted across browser sessions

### 2. No Offline Status After 2 Minutes
**Problem**: The original code only showed an inactivity overlay after 20 seconds but never marked users as offline.

**Solution**:
- Extended timer system with two phases:
  - 20 seconds: Show inactivity overlay (unchanged)
  - 2 minutes (120 seconds): Mark user as offline in Firebase
- Added proper offline status tracking

### 3. No Page Visibility Tracking
**Problem**: Users weren't marked offline when they switched tabs or minimized the browser.

**Solution**:
- Added `visibilitychange` event listeners
- Added `focus`/`blur` event listeners
- Users are marked offline after 30 seconds of being on a different tab
- Automatically come back online when they return to the tab

### 4. Status Recovery on Activity
**Problem**: No mechanism to bring users back from offline status when they became active again.

**Solution**:
- Enhanced activity detection to check current status
- If user was offline, they're automatically brought back to online status
- Activity resets all timers and clears offline states

## New Features

### Enhanced Status Manager
Created a comprehensive `userStatusManager` object with:

- **Status Types**: `online`, `ingame`, `offline`
- **Persistent Storage**: Uses both localStorage and Firebase
- **Timer Management**: Handles multiple concurrent timers safely
- **Activity Tracking**: Monitors mouse, keyboard, and page visibility
- **Cleanup**: Proper timer cleanup on logout and page unload

### Status Transitions
- **Page Load**: Always start as "online"
- **Game Start**: Switch to "ingame" 
- **20 seconds inactive**: Show inactivity overlay (visual only)
- **2 minutes inactive**: Mark as "offline" in Firebase
- **Tab switch**: Mark as "offline" after 30 seconds
- **Return to tab**: Back to "online"
- **Any activity**: Reset timers, return to appropriate status
- **Page close**: Mark as "offline"

## Technical Implementation

### Key Functions
- `userStatusManager.init()` - Initialize status tracking
- `userStatusManager.setInGame(gameId)` - Set in-game status
- `userStatusManager.setOnline()` - Set online status  
- `userStatusManager.setOffline()` - Set offline status
- `userStatusManager.onUserActivity()` - Handle user activity
- `userStatusManager.cleanup()` - Clean up timers

### Event Listeners
- Mouse/keyboard events for activity tracking
- `visibilitychange` for tab switching
- `focus`/`blur` for window switching
- `beforeunload`/`unload` for page exit
- `pagehide` for mobile browsers

### Storage
- `carbon-user-status` - Current user status in localStorage
- `carbon-last-activity` - Timestamp of last activity
- Firebase `users` collection - Real-time status for other users

## Backward Compatibility
- Kept original `initializeInactivityDetection()` and `resetInactivityTimer()` functions
- No breaking changes to existing code
- Enhanced functionality is additive

## Testing Scenarios
1. **Refresh page** - Status should persist and restore as "online"
2. **Switch tabs for 30+ seconds** - Should go offline
3. **Return to tab** - Should come back online
4. **Stay inactive for 2+ minutes** - Should go offline
5. **Move mouse after being offline** - Should come back online
6. **Close browser** - Should be marked offline
7. **Start playing a game** - Should show as "ingame"

## Benefits
- Users now have accurate online/offline status
- Status persists across browser sessions
- Real-time status updates for friend lists
- Better user experience with automatic status recovery
- Proper cleanup prevents memory leaks
- Mobile-friendly with `pagehide` support