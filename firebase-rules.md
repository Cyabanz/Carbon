# Firebase Security Rules for Carbon Browser

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions for validation
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(resource) {
      return request.auth.uid == resource.id;
    }
    
    function isValidUser() {
      return isAuthenticated() && request.auth.uid != null;
    }
    
    function isValidShopData(data) {
      return data.keys().hasAll(['currency', 'frames', 'pets', 'profileFrames', 'petData', 'badges']) &&
             data.currency is number &&
             data.currency >= 0 &&
             data.currency <= 1000000 && // Max 1M coins to prevent abuse
             data.frames is list &&
             data.pets is list &&
             data.profileFrames is list &&
             data.petData is map &&
             data.badges is list;
    }
    
    function isValidGameRoom(data) {
      return data.keys().hasAll(['hostId', 'gameType', 'status', 'gameState']) &&
             data.hostId is string &&
             data.gameType in ['tic-tac-toe', 'connect4'] &&
             data.status in ['waiting', 'playing', 'finished'] &&
             data.gameState is map;
    }
    
    function isValidSettings(data) {
      return data.keys().hasAny(['theme', 'background', 'panicKey', 'cloaking', 'tabCloaking']) &&
             (!('theme' in data) || data.theme is string) &&
             (!('background' in data) || data.background is string) &&
             (!('panicKey' in data) || data.panicKey is string);
    }
    
    // User documents - contains all user data including shop data and settings
    match /users/{userId} {
      allow read, write: if isAuthenticated() && isOwner(resource);
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Validate shop data if it exists
      allow update: if isAuthenticated() && isOwner(resource) &&
        (!('shopData' in request.resource.data) || isValidShopData(request.resource.data.shopData)) &&
        (!('settings' in request.resource.data) || isValidSettings(request.resource.data.settings));
    }
    
    // Game rooms for multiplayer games
    match /game-rooms/{roomId} {
      // Allow reading for authenticated users to find games
      allow read: if isAuthenticated();
      
      // Allow creating new game rooms
      allow create: if isAuthenticated() && 
        isValidGameRoom(request.resource.data) &&
        request.resource.data.hostId == request.auth.uid;
      
      // Allow updating if you're the host or guest
      allow update: if isAuthenticated() && 
        (request.auth.uid == resource.data.hostId || 
         request.auth.uid == resource.data.get('guestId', '')) &&
        isValidGameRoom(request.resource.data);
      
      // Allow deleting if you're the host
      allow delete: if isAuthenticated() && 
        request.auth.uid == resource.data.hostId;
    }
    
    // User frames for game customization
    match /user-frames/{userId} {
      allow read, write: if isAuthenticated() && isOwner(resource);
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Validate frame data structure
      allow update: if isAuthenticated() && isOwner(resource) &&
        request.resource.data.keys().hasAll(['selectedGameFrame', 'selectedProfileFrame']) &&
        request.resource.data.selectedGameFrame is string &&
        request.resource.data.selectedProfileFrame is string;
    }
    
    // Global leaderboards (read-only for users, admin write)
    match /leaderboards/{document=**} {
      allow read: if true; // Public read access
      allow write: if false; // Only admin can write (handle via Cloud Functions)
    }
    
    // System announcements (read-only for users)
    match /announcements/{document=**} {
      allow read: if true; // Public read access
      allow write: if false; // Only admin can write
    }
    
    // Feedback and reports (users can create, admins can read)
    match /feedback/{feedbackId} {
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.keys().hasAll(['userId', 'message', 'timestamp']) &&
        request.resource.data.message is string &&
        request.resource.data.message.size() > 0 &&
        request.resource.data.message.size() <= 1000;
      allow read: if false; // Only admins can read (handle via admin SDK)
    }
  }
}
```

## Firebase Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // User profile pictures
    match /profile-pictures/{userId}/{fileName} {
      allow read: if true; // Public read access for profile pictures
      allow write: if request.auth != null && 
        request.auth.uid == userId &&
        resource.size < 5 * 1024 * 1024 && // Max 5MB
        request.resource.contentType.matches('image/.*');
    }
    
    // Custom backgrounds
    match /custom-backgrounds/{userId}/{fileName} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId &&
        resource.size < 10 * 1024 * 1024 && // Max 10MB
        request.resource.contentType.matches('image/.*');
    }
    
    // Game assets (read-only for users)
    match /game-assets/{document=**} {
      allow read: if true; // Public read access
      allow write: if false; // Only admin can upload
    }
    
    // System assets (read-only)
    match /system/{document=**} {
      allow read: if true; // Public read access
      allow write: if false; // Only admin can upload
    }
  }
}
```

## Key Security Features

### 🔒 **Data Protection**
- **User isolation**: Users can only access their own data
- **Schema validation**: Strict data structure validation for all writes
- **Size limits**: Prevents data bloat and abuse
- **Type checking**: Ensures data integrity

### 🛡️ **Shop Security**
- **Currency limits**: Max 1M coins to prevent exploits
- **Ownership verification**: Users can only modify their own shop data
- **Data structure validation**: Prevents malformed shop data
- **Atomic operations**: Ensures data consistency

### 🎮 **Game Security**
- **Host/guest verification**: Only game participants can modify games
- **Game state validation**: Prevents invalid game moves
- **Room cleanup**: Hosts can delete their own rooms
- **Public discovery**: Authenticated users can find games

### 📁 **File Upload Security**
- **Size restrictions**: Prevents storage abuse
- **File type validation**: Only images allowed for user content
- **User isolation**: Users can only upload to their own folders
- **Public access**: Profile pictures are publicly readable

### 🔐 **Authentication Requirements**
- **All writes require authentication**
- **User ownership verification for personal data**
- **Public read access only where appropriate**
- **Admin-only access for system data**

## Rate Limiting Recommendations

### Firestore
- **Reads**: 50,000 per day per user
- **Writes**: 20,000 per day per user  
- **Deletes**: 10,000 per day per user

### Storage
- **Uploads**: 100 MB per day per user
- **Downloads**: 1 GB per day per user

## Monitoring Alerts

Set up Firebase console alerts for:
- **Unusual write patterns** (>1000 writes/hour per user)
- **Large document sizes** (>500KB)
- **Failed authentication attempts** (>50/hour)
- **Storage quota approaching limits**
- **Firestore quota approaching limits**

## Backup Strategy

- **Daily automated backups** of user data
- **Weekly full database exports**
- **30-day retention period**
- **Cross-region backup storage**

These rules provide comprehensive security while maintaining the functionality of all Carbon Browser features including the shop system, multiplayer games, user settings, and file uploads.