# Profile Status Persistence Fixes

## Overview
Fixed the critical issue where manual status changes (like setting to "idle" or "dnd") in `profile.html` were not persisting across page refreshes. The status would always reset to "online" after refreshing the page.

## Issues Fixed

### 1. Status Always Reset to "Online" on Refresh
**Problem**: The `setUserOnline()` function was always called on page load, forcing the status to "online" regardless of what the user had manually selected.

**Root Cause**: 
```javascript
// This function ALWAYS set status to 'online'
async function setUserOnline() {
  await updateUserStatus('online'); // ← Force online every time
}
```

**Solution**: 
- Replaced `setUserOnline()` with `restoreUserStatus()`
- Added localStorage persistence for manual status selections
- Implemented smart status restoration with age validation

### 2. No localStorage Persistence for Manual Status Changes
**Problem**: When users manually selected "idle" or "dnd" from the dropdown, these choices weren't saved anywhere for restoration.

**Solution**: Enhanced the `updateUserStatus()` function to automatically save status to localStorage:
```javascript
// Save status to localStorage for persistence across refreshes
localStorage.setItem('carbon-user-status', status);
localStorage.setItem('carbon-user-status-timestamp', Date.now().toString());
```

### 3. Status Selector Not Reflecting Current Status
**Problem**: The status dropdown didn't show the correct current status when the page loaded.

**Solution**: Added `loadCurrentUserStatus()` function that:
- Reads current status from Firebase
- Updates the status selector dropdown
- Synchronizes localStorage with Firebase data

### 4. Periodic Heartbeat Forcing Online Status
**Problem**: The periodic heartbeat was forcing users back to "online" status every 30 seconds.

**Solution**: Modified heartbeat to maintain current status instead of forcing "online":
```javascript
// OLD: Always force online
await updateUserStatus('online');

// NEW: Maintain current status
const currentStatus = localStorage.getItem('carbon-user-status') || 'online';
await updateUserStatus(currentStatus);
```

## Technical Implementation

### Enhanced Status Management System

1. **`updateUserStatus(status, gameId)`** - Now with persistence
   - Updates Firebase with new status
   - Saves status and timestamp to localStorage
   - Updates UI elements (status indicator, dropdown)
   - Handles game-specific status changes

2. **`restoreUserStatus()`** - Smart status restoration
   - Checks localStorage for saved status
   - Validates status age (max 1 hour)
   - Falls back to "online" for old/invalid statuses
   - Sets up page unload handlers and heartbeat

3. **`loadCurrentUserStatus()`** - Firebase synchronization
   - Loads current status from Firebase on page load
   - Updates status selector dropdown
   - Synchronizes localStorage with Firebase data
   - Updates visual status indicators

### Status Persistence Logic

#### **Status Age Validation**
```javascript
const savedTimestamp = parseInt(localStorage.getItem('carbon-user-status-timestamp') || '0');
const statusAge = Date.now() - savedTimestamp;

// Only restore if less than 1 hour old
if (savedStatus && validStatuses.includes(savedStatus) && statusAge < 3600000) {
  statusToRestore = savedStatus;
} else {
  statusToRestore = 'online'; // Default for old/invalid statuses
}
```

#### **Valid Status Types**
- `online` - User is active and available
- `idle` - User is away but not busy  
- `dnd` - Do Not Disturb (busy)
- `ingame` - Currently playing a game (automatic)
- `offline` - User has left the site (automatic)

### Data Flow

1. **Page Load**:
   ```
   User loads profile.html
   → restoreUserStatus() checks localStorage
   → If valid saved status exists (< 1 hour old): restore it
   → If no valid status: default to 'online'
   → loadCurrentUserStatus() syncs with Firebase
   → Status selector shows correct current status
   ```

2. **Manual Status Change**:
   ```
   User selects 'idle' from dropdown
   → updateUserStatus('idle') called
   → Firebase updated with new status
   → localStorage saves status + timestamp
   → UI updated (indicator + dropdown)
   ```

3. **Page Refresh**:
   ```
   User refreshes page
   → restoreUserStatus() finds 'idle' in localStorage
   → Status age is recent (< 1 hour)
   → Status restored to 'idle' instead of 'online'
   → UI shows 'idle' status correctly
   ```

4. **Periodic Heartbeat** (every 30 seconds):
   ```
   → Read current status from localStorage
   → Maintain that status (don't force 'online')
   → Only update if page is visible
   ```

### Error Handling & Fallbacks

- **LocalStorage unavailable**: Falls back to 'online' status
- **Firebase errors**: Graceful degradation with console logging
- **Invalid status values**: Filtered to valid options only
- **Missing DOM elements**: Safe element checking before updates
- **Timestamp corruption**: Defaults to 'online' for safety

### Page Lifecycle Management

**Page Load**: Restore saved status or default to online
**Status Change**: Save immediately to localStorage + Firebase  
**Page Visible**: Maintain current status via heartbeat
**Page Hidden**: Continue maintaining status
**Page Unload**: Set to offline status
**Browser Close**: Set to offline status

## Benefits

✅ **Status Persistence**: Manual selections survive page refreshes  
✅ **Smart Restoration**: Old statuses expire and default to online  
✅ **UI Consistency**: Dropdown always shows current status  
✅ **Performance**: Minimal Firebase calls with localStorage caching  
✅ **User Experience**: No more frustrating status resets  
✅ **Backward Compatibility**: Existing functionality preserved  

## Testing Scenarios

### ✅ Basic Status Persistence
1. Set status to "Idle"
2. Refresh page
3. **Expected**: Status remains "Idle"

### ✅ Status Age Expiration
1. Set status to "DND"
2. Wait 1+ hours (or manually modify timestamp in localStorage)
3. Refresh page
4. **Expected**: Status resets to "Online"

### ✅ Firebase Synchronization
1. Set status to "Idle" on device A
2. Load profile.html on device B
3. **Expected**: Status shows as "Idle" on device B

### ✅ Game Status Override
1. Set manual status to "DND"
2. Start playing a game
3. **Expected**: Status changes to "In Game"
4. Stop playing game
5. **Expected**: Status returns to "DND"

### ✅ Cross-Session Persistence
1. Set status to "Idle"
2. Close browser completely
3. Reopen browser and load profile
4. **Expected**: Status restores to "Idle" (if within 1 hour)

## Breaking Changes
**None** - All changes are backward compatible and additive.

## Storage Usage
- `carbon-user-status`: Current user status string
- `carbon-user-status-timestamp`: Unix timestamp of last status change

The status persistence system ensures users maintain their preferred availability status across sessions while providing smart defaults for stale data.