# Hyperbeam Shared Sessions

## Overview

The Hyperbeam Shared Sessions feature allows multiple users to collaborate on a single virtual machine session. Users can create shared sessions, invite others via share codes, and collaborate in real-time with WebSocket-based communication.

## Features

### 🚀 Core Functionality
- **Create Shared Sessions**: Generate a new Hyperbeam VM session with a unique share code
- **Join Sessions**: Enter a share code to join an existing session
- **Real-time Collaboration**: WebSocket-based communication for live updates
- **User Management**: Track connected users and their roles (creator vs. participants)
- **Session Lifecycle**: Automatic session termination and cleanup

### 🎯 Key Features
- **Share Codes**: 6-character alphanumeric codes for easy sharing
- **User Limits**: Maximum 10 users per session
- **Session Duration**: 10-minute sessions for shared collaboration
- **Real-time Updates**: Live notifications for user join/leave events
- **Connection Status**: Visual indicators for WebSocket connection status
- **Responsive UI**: Modern, mobile-friendly interface

## Architecture

### Backend Components

#### 1. Session Management
```javascript
// Shared session store
const sharedSessionStore = new NodeCache({
  stdTTL: 600, // 10 minutes
  checkperiod: 60,
  useClones: false
});

// WebSocket connections
const sharedSessionConnections = new Map();
```

#### 2. API Endpoints
- `POST /api/vm/shared/create` - Create a new shared session
- `POST /api/vm/shared/join` - Join an existing session
- `POST /api/vm/shared/leave` - Leave a session
- `GET /api/vm/shared/:shareCode` - Get session information

#### 3. WebSocket Server
- Real-time communication for session updates
- User join/leave notifications
- Session termination alerts
- Connection management

### Frontend Components

#### 1. Shared Session Manager
```javascript
class SharedSessionManager {
  constructor() {
    this.currentSession = null;
    this.websocket = null;
    this.shareCode = null;
    this.isCreator = false;
  }
  // ... methods for session management
}
```

#### 2. UI Components
- Session creation/joining interface
- Real-time user list
- Connection status indicators
- Share code modal
- VM iframe display

## Usage

### Creating a Shared Session

1. Navigate to the Shared Sessions page
2. Click "Create Shared Session"
3. Wait for the session to be created
4. Share the generated code with others
5. Start collaborating!

### Joining a Shared Session

1. Navigate to the Shared Sessions page
2. Enter the share code in the "Join Session" field
3. Click "Join Session"
4. You'll be connected to the shared VM

### Sharing Session Codes

- Share codes are 6-character alphanumeric strings (e.g., "ABC123")
- Click the "Copy Code" button to copy to clipboard
- Share via any communication method (chat, email, etc.)

## API Reference

### Create Session
```http
POST /api/vm/shared/create
Content-Type: application/json

Response:
{
  "sessionId": "hyperbeam-session-id",
  "shareCode": "ABC123",
  "url": "https://embed.hyperbeam.com/...",
  "expiresAt": 1234567890
}
```

### Join Session
```http
POST /api/vm/shared/join
Content-Type: application/json

{
  "shareCode": "ABC123"
}

Response:
{
  "sessionId": "hyperbeam-session-id",
  "shareCode": "ABC123",
  "url": "https://embed.hyperbeam.com/...",
  "users": [...],
  "isNewUser": true,
  "expiresAt": 1234567890
}
```

### Leave Session
```http
POST /api/vm/shared/leave
Content-Type: application/json

{
  "shareCode": "ABC123"
}

Response:
{
  "success": true
}
```

### Get Session Info
```http
GET /api/vm/shared/ABC123

Response:
{
  "sessionId": "hyperbeam-session-id",
  "shareCode": "ABC123",
  "url": "https://embed.hyperbeam.com/...",
  "users": [...],
  "createdAt": 1234567890,
  "expiresAt": 1234567890
}
```

## WebSocket Events

### Client to Server
```javascript
// Ping to keep connection alive
{ type: 'ping' }

// User activity
{ type: 'user_activity' }
```

### Server to Client
```javascript
// Session information
{
  type: 'session_info',
  sessionId: '...',
  shareCode: '...',
  users: [...],
  url: '...',
  expiresAt: 1234567890
}

// User joined
{
  type: 'user_joined',
  user: { id: '...', ip: '...', joinedAt: 1234567890, isCreator: false },
  totalUsers: 3
}

// User left
{
  type: 'user_left',
  user: { id: '...', ip: '...', joinedAt: 1234567890, isCreator: false },
  totalUsers: 2
}

// Session terminated
{
  type: 'session_terminated',
  reason: 'time_limit'
}

// Pong response
{ type: 'pong' }
```

## Configuration

### Environment Variables
```bash
# Required for Hyperbeam integration
HYPERBEAM_API_KEY=your_hyperbeam_api_key_here
```

### Server Configuration
```javascript
// Session duration (10 minutes)
const SHARED_SESSION_DURATION = 10 * 60 * 1000;

// Maximum users per session
const MAX_USERS_PER_SHARED_SESSION = 10;

// Inactivity timeout (30 seconds)
const INACTIVITY_TIMEOUT = 30 * 1000;
```

## Security Features

### Rate Limiting
- Maximum 2 sessions per IP address
- Session timeout after 10 minutes
- Inactivity detection and cleanup

### Access Control
- Share code validation
- User IP tracking
- Session ownership verification

### WebSocket Security
- Connection validation with share codes
- Automatic cleanup on disconnect
- Error handling and logging

## Error Handling

### Common Error Scenarios
1. **Invalid Share Code**: Session not found or expired
2. **Session Full**: Maximum users reached
3. **API Key Missing**: Hyperbeam service unavailable
4. **Network Issues**: Connection failures
5. **Session Expired**: Automatic cleanup

### Error Responses
```javascript
{
  "error": "Session not found or expired",
  "details": "The share code provided is invalid or the session has expired"
}
```

## Integration

### Adding to Navigation
The shared session feature is integrated into the main Carbon navigation:

```javascript
// Menu button
<button id="carbon-shared-session-btn">
  <i class="bx bx-share-alt text-pine"></i>
  <span>Shared Sessions</span>
  <span class="ml-auto text-xs bg-pine/20 text-pine px-2 py-0.5 rounded-full">NEW</span>
</button>

// URL handling
} else if (url === "carbon://shared-session") {
  iframe.src = "/shared-session.html";
  iframe.dataset.loadedUrl = url;
}
```

### Dependencies
- `ws` - WebSocket server
- `node-cache` - Session storage
- `node-fetch` - HTTP requests
- Express.js - Web framework

## Development

### Running Locally
1. Install dependencies: `npm install`
2. Set Hyperbeam API key: `export HYPERBEAM_API_KEY=your_key`
3. Start server: `node server.js`
4. Access: `http://localhost:3000/shared-session`

### Testing
- API endpoints can be tested with curl or Postman
- WebSocket connections can be tested with browser dev tools
- Full integration testing available via the UI

## Future Enhancements

### Planned Features
- [ ] Persistent sessions with database storage
- [ ] User authentication and profiles
- [ ] Session recording and playback
- [ ] Advanced collaboration tools
- [ ] Mobile app support
- [ ] Session templates and presets

### Potential Improvements
- [ ] Better error recovery
- [ ] Session analytics
- [ ] Custom branding options
- [ ] Integration with external tools
- [ ] Advanced security features

## Troubleshooting

### Common Issues

1. **WebSocket Connection Fails**
   - Check if the server is running
   - Verify share code is valid
   - Check browser console for errors

2. **Session Creation Fails**
   - Verify HYPERBEAM_API_KEY is set
   - Check Hyperbeam service status
   - Review server logs for details

3. **Users Can't Join**
   - Verify share code is correct
   - Check if session is full
   - Ensure session hasn't expired

4. **Real-time Updates Not Working**
   - Check WebSocket connection status
   - Verify browser supports WebSockets
   - Check network connectivity

### Debug Mode
Enable debug logging by setting:
```javascript
console.log('Debug mode enabled');
```

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs
3. Test with the provided test endpoints
4. Verify configuration settings

## License

This feature is part of the Carbon project and follows the same licensing terms.