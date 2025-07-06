# Firebase Tab Sync Implementation

## Overview

This implementation adds comprehensive Firebase synchronization to the Carbon browser's proxy.html file, enabling real-time syncing of tabs, tab history, pinned tabs, tab groups, tab notes, and tab colors across multiple devices.

## Features Implemented

### 1. Tab Synchronization
- **Complete tab state sync**: All tab properties including ID, title, URL, history, pointer position, pinned status, locked status, color, custom title, group ID, and notes
- **Active tab tracking**: Syncs which tab is currently active
- **UI state sync**: Syncs vertical tabs mode and tab bar visibility preferences

### 2. Tab History Management
- **Individual tab history**: Each tab's navigation history and current position
- **Global browsing history**: Complete browsing history across all tabs
- **History restoration**: Ability to restore previous browsing sessions

### 3. Tab Groups Support
- **Group metadata**: Group names, colors, and IDs
- **Group counter synchronization**: Ensures unique group IDs across devices
- **Tab-to-group assignments**: Maintains which tabs belong to which groups

### 4. Pinned Tabs
- **Pinned state sync**: Maintains pinned status across devices
- **Pin/unpin operations**: Real-time synchronization of pin changes

### 5. Tab Colors and Notes
- **Custom tab colors**: Syncs tab color assignments
- **Tab notes**: Syncs user-added notes for tabs

### 6. Tab Restoration
- **Recently closed tabs**: Maintains snapshots of closed tabs for restoration
- **Session restoration**: Ability to restore entire tab sessions from Firebase

## Firebase Collections Structure

### user-tabs/{userId}
```javascript
{
  tabs: [
    {
      id: "tab-1",
      title: "Tab Title",
      url: "https://example.com",
      history: ["https://example.com", "https://another.com"],
      pointer: 0,
      pinned: false,
      locked: false,
      color: "#ff0000",
      customTitle: "Custom Name",
      groupId: "group-1",
      notes: "User notes",
      timestamp: 1234567890
    }
  ],
  activeTab: "tab-1",
  verticalTabsMode: false,
  tabBarHidden: false,
  lastUpdated: timestamp
}
```

### user-tab-groups/{userId}
```javascript
{
  groups: [
    {
      id: "group-1",
      name: "Work",
      color: "#3b82f6",
      timestamp: 1234567890
    }
  ],
  groupIdCounter: 2,
  lastUpdated: timestamp
}
```

### user-tab-history/{userId}
```javascript
{
  globalHistory: [
    {
      id: "unique-id",
      url: "https://example.com",
      title: "Page Title",
      timestamp: "2024-01-01T00:00:00.000Z",
      visits: 1
    }
  ],
  tabHistory: [
    {
      tabId: "tab-1",
      history: ["https://example.com"],
      pointer: 0,
      timestamp: 1234567890
    }
  ],
  lastUpdated: timestamp
}
```

### user-tab-restore/{userId}
```javascript
{
  lastTabs: [/* previous tab states */],
  closedTabsSnapshot: [/* recently closed tabs */],
  timestamp: 1234567890,
  lastUpdated: timestamp
}
```

## Key Functions

### Core Sync Functions
- `syncAllTabsToFirebase()`: Syncs all current tabs and UI state
- `syncTabGroupsToFirebase()`: Syncs tab group data
- `syncTabHistoryToFirebase()`: Syncs browsing history
- `syncTabRestoreDataToFirebase()`: Syncs restoration data
- `loadAllDataFromFirebase()`: Loads all data from Firebase on login

### Enhanced Tab Operations (with Firebase sync)
- `addTabWithSync()`: Creates new tab and syncs to Firebase
- `removeTabWithSync()`: Removes tab and syncs to Firebase
- `togglePinTabWithSync()`: Toggles pin status with sync
- `setTabColorWithSync()`: Sets tab color with sync
- `renameTabWithSync()`: Renames tab with sync
- `updateTabNotesWithSync()`: Updates tab notes with sync
- `assignTabToGroupWithSync()`: Assigns tab to group with sync

### Real-time Listeners
- `setupTabSyncListeners()`: Sets up real-time listeners for cross-device sync
- Detects changes from other devices and optionally applies them

## Auto-Sync Features

### Periodic Sync
- Automatically syncs every 30 seconds when user is logged in
- Ensures data consistency across devices

### Event-Based Sync
- Syncs immediately on tab operations (create, remove, modify)
- Syncs on page unload using `sendBeacon` for reliability

### Function Hooking
- Automatically hooks into existing tab management functions
- Adds Firebase sync to legacy functions without breaking existing code

## Usage

### Prerequisites
1. Firebase project configured with Firestore
2. Firebase authentication enabled
3. Proper Firebase security rules set up

### Implementation Notes
- Uses Firebase v9 compat mode for easier integration
- Handles offline scenarios gracefully
- Provides extensive error logging
- Maintains backward compatibility with existing code

### Configuration
Update the Firebase configuration in the code:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Security Considerations

### Firestore Security Rules
Ensure proper security rules are in place:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /user-tabs/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /user-tab-groups/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /user-tab-history/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /user-tab-restore/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Performance Optimizations

- **Debounced sync**: Prevents excessive Firebase writes
- **Conditional sync**: Only syncs when user is authenticated
- **Selective loading**: Loads only necessary data
- **Efficient queries**: Uses merge operations to minimize data transfer

## Error Handling

- Comprehensive try-catch blocks around all Firebase operations
- Graceful degradation when Firebase is unavailable
- Detailed error logging for debugging
- Fallback to localStorage when Firebase fails

## Browser Compatibility

- Works with all modern browsers that support:
  - ES6+ features (async/await, arrow functions)
  - Firebase SDK v9+
  - Local Storage API
  - SendBeacon API (for reliable sync on page unload)

## Future Enhancements

Potential improvements for future versions:
- Conflict resolution for simultaneous edits from multiple devices
- Compression for large tab datasets
- Offline queue for sync operations
- Tab preview thumbnails sync
- Collaborative tab sharing features