const express = require('express');
const path = require('path');
const Tokens = require("csrf");
const cookie = require("cookie");
const NodeCache = require("node-cache");
const fetch = require("node-fetch");
const WebSocket = require('ws');
const openRouterHandler = require('./api/openrouter.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Add security headers (must come before static file serving)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.static('.'));

// CSRF setup
const tokens = new Tokens();

// Session store
const sessionStore = new NodeCache({ 
  stdTTL: 300,
  checkperiod: 60,
  useClones: false
});

// Rate limiting store
const rateLimitStore = new NodeCache({
  stdTTL: 300,
  checkperiod: 60
});

// Shared session store
const sharedSessionStore = new NodeCache({
  stdTTL: 600, // 10 minutes for shared sessions
  checkperiod: 60,
  useClones: false
});

// WebSocket connections for shared sessions
const sharedSessionConnections = new Map();

// Constants
const MAX_SESSIONS_PER_IP = 2;
const SESSION_DURATION = 4 * 60 * 1000; // 4 minutes
const INACTIVITY_TIMEOUT = 30 * 1000; // 30 seconds
const SHARED_SESSION_DURATION = 10 * 60 * 1000; // 10 minutes for shared sessions
const MAX_USERS_PER_SHARED_SESSION = 10;

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         'unknown';
}

function validateSessionId(sessionId) {
  return typeof sessionId === 'string' && sessionId.length > 0 && sessionId.length < 256;
}

async function terminateHyperbeamSession(sessionId) {
  const apiKey = process.env.HYPERBEAM_API_KEY;
  if (!apiKey) return false;
  
  try {
    const response = await fetch(`https://engine.hyperbeam.com/v0/vm/${sessionId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return response.ok || response.status === 404;
  } catch (error) {
    console.error(`Failed to terminate Hyperbeam session ${sessionId}:`, error.message);
    return false;
  }
}

function cleanupSession(sessionId) {
  const session = sessionStore.get(sessionId);
  if (session) {
    if (session.limitTimer) clearTimeout(session.limitTimer);
    if (session.inactivityTimer) clearTimeout(session.inactivityTimer);
    
    const ipSessions = rateLimitStore.get(session.clientIP) || [];
    const updatedSessions = ipSessions.filter(id => id !== sessionId);
    
    if (updatedSessions.length > 0) {
      rateLimitStore.set(session.clientIP, updatedSessions);
    } else {
      rateLimitStore.del(session.clientIP);
    }
    
    sessionStore.del(sessionId);
  }
}

async function terminateSession(sessionId, reason = 'timeout') {
  console.log(`Terminating session ${sessionId} due to ${reason}`);
  await terminateHyperbeamSession(sessionId);
  cleanupSession(sessionId);
}

// Shared session management functions
function generateShareCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createSharedSession(sessionId, embedUrl, creatorIP) {
  const shareCode = generateShareCode();
  const now = Date.now();
  const expiresAt = now + SHARED_SESSION_DURATION;
  
  const sharedSession = {
    id: sessionId,
    shareCode: shareCode,
    creatorIP: creatorIP,
    createdAt: now,
    expiresAt: expiresAt,
    users: [{
      id: creatorIP,
      ip: creatorIP,
      joinedAt: now,
      isCreator: true
    }],
    url: embedUrl,
    limitTimer: setTimeout(() => terminateSharedSession(shareCode, 'time_limit'), SHARED_SESSION_DURATION)
  };
  
  sharedSessionStore.set(shareCode, sharedSession);
  console.log(`Created shared session ${shareCode} for session ${sessionId}`);
  
  return shareCode;
}

function joinSharedSession(shareCode, userIP) {
  const sharedSession = sharedSessionStore.get(shareCode);
  
  if (!sharedSession) {
    return { success: false, error: 'Session not found or expired' };
  }
  
  if (sharedSession.users.length >= MAX_USERS_PER_SHARED_SESSION) {
    return { success: false, error: 'Session is full' };
  }
  
  // Check if user is already in the session
  const existingUser = sharedSession.users.find(user => user.ip === userIP);
  if (existingUser) {
    return { success: true, session: sharedSession, isNewUser: false };
  }
  
  // Add new user
  const newUser = {
    id: userIP,
    ip: userIP,
    joinedAt: Date.now(),
    isCreator: false
  };
  
  sharedSession.users.push(newUser);
  sharedSessionStore.set(shareCode, sharedSession);
  
  // Notify other users via WebSocket
  broadcastToSharedSession(shareCode, {
    type: 'user_joined',
    user: newUser,
    totalUsers: sharedSession.users.length
  });
  
  console.log(`User ${userIP} joined shared session ${shareCode}`);
  
  return { success: true, session: sharedSession, isNewUser: true };
}

function leaveSharedSession(shareCode, userIP) {
  const sharedSession = sharedSessionStore.get(shareCode);
  
  if (!sharedSession) {
    return false;
  }
  
  const userIndex = sharedSession.users.findIndex(user => user.ip === userIP);
  if (userIndex === -1) {
    return false;
  }
  
  const removedUser = sharedSession.users.splice(userIndex, 1)[0];
  sharedSessionStore.set(shareCode, sharedSession);
  
  // Notify other users via WebSocket
  broadcastToSharedSession(shareCode, {
    type: 'user_left',
    user: removedUser,
    totalUsers: sharedSession.users.length
  });
  
  console.log(`User ${userIP} left shared session ${shareCode}`);
  
  // If no users left, terminate the session
  if (sharedSession.users.length === 0) {
    terminateSharedSession(shareCode, 'no_users');
  }
  
  return true;
}

async function terminateSharedSession(shareCode, reason = 'timeout') {
  console.log(`Terminating shared session ${shareCode} due to ${reason}`);
  
  const sharedSession = sharedSessionStore.get(shareCode);
  if (sharedSession) {
    if (sharedSession.limitTimer) {
      clearTimeout(sharedSession.limitTimer);
    }
    
    // Notify all users via WebSocket
    broadcastToSharedSession(shareCode, {
      type: 'session_terminated',
      reason: reason
    });
    
    // Terminate the underlying Hyperbeam session
    await terminateHyperbeamSession(sharedSession.id);
    
    // Clean up WebSocket connections
    const connections = sharedSessionConnections.get(shareCode);
    if (connections) {
      connections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, 'Session terminated');
        }
      });
      sharedSessionConnections.delete(shareCode);
    }
  }
  
  sharedSessionStore.del(shareCode);
}

function broadcastToSharedSession(shareCode, message) {
  const connections = sharedSessionConnections.get(shareCode);
  if (connections) {
    connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }
}

// CSRF Token endpoint
app.get('/api/vm/csrf-token', (req, res) => {
  try {
    const secret = tokens.secretSync();
    const token = tokens.create(secret);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("csrfSecret", secret, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
        secure: false, // Set to false for local development
      })
    );

    res.status(200).json({ csrfToken: token });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate CSRF token',
      details: error.message
    });
  }
});

// Main VM API endpoint
app.all('/api/vm', async (req, res) => {
  console.log(`🚀 API Request: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-csrf-token');
  
  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  
  const clientIP = getClientIP(req);
  
  try {
    if (req.method === "POST") {
      // Parse cookies
      const cookies = cookie.parse(req.headers.cookie || "");
      const secret = cookies.csrfSecret;
      const csrfToken = req.headers["x-csrf-token"];
      
      if (!secret || !csrfToken) {
        return res.status(403).json({ error: "Missing CSRF credentials" });
      }
      
      // Verify CSRF token
      let csrfValid = false;
      try {
        csrfValid = tokens.verify(secret, csrfToken);
      } catch (csrfError) {
        return res.status(403).json({ error: "CSRF verification failed" });
      }
      
      if (!csrfValid) {
        return res.status(403).json({ error: "Invalid CSRF token" });
      }

      // Rate limiting check
      const ipSessions = rateLimitStore.get(clientIP) || [];
      
      if (ipSessions.length >= MAX_SESSIONS_PER_IP) {
        return res.status(429).json({ 
          error: `Rate limit exceeded. Maximum ${MAX_SESSIONS_PER_IP} sessions allowed per IP.`,
          retryAfter: 300
        });
      }

      // Check API key
      const apiKey = process.env.HYPERBEAM_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ 
          error: "Service temporarily unavailable",
          details: "HYPERBEAM_API_KEY not configured"
        });
      }

      // Create Hyperbeam session
      try {
        const requestBody = {
          timeout: {
            absolute: Math.floor(SESSION_DURATION / 1000),
            inactive: Math.floor(INACTIVITY_TIMEOUT / 1000),
            offline: 3600
          }
        };
        
        const hyperbeamResponse = await fetch("https://engine.hyperbeam.com/v0/vm", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "Hyperbeam-Demo/1.0"
          },
          body: JSON.stringify(requestBody),
        });

        if (!hyperbeamResponse.ok) {
          const errorText = await hyperbeamResponse.text();
          console.error('Hyperbeam API error:', hyperbeamResponse.status, errorText);
          
          let errorMessage = "Failed to create session";
          let details = `HTTP ${hyperbeamResponse.status}`;
          
          if (hyperbeamResponse.status === 401) {
            errorMessage = "Invalid API key";
            details = "Please check your Hyperbeam API key";
          } else if (hyperbeamResponse.status === 429) {
            errorMessage = "Service temporarily overloaded";
            details = "Too many requests, please try again later";
          }
          
          return res.status(500).json({ 
            error: errorMessage,
            details: details
          });
        }

        const sessionData = await hyperbeamResponse.json();
        const sessionId = sessionData.session_id;
        const embedUrl = sessionData.embed_url;
        
        if (!sessionId || !embedUrl) {
          return res.status(500).json({ error: "Invalid session data received" });
        }

        const now = Date.now();
        const expiresAt = now + SESSION_DURATION;
        
        // Setup timers
        const limitTimer = setTimeout(() => terminateSession(sessionId, 'time_limit'), SESSION_DURATION);
        let inactivityTimer = setTimeout(() => terminateSession(sessionId, 'inactivity'), INACTIVITY_TIMEOUT);

        // Store session
        const session = {
          id: sessionId,
          clientIP,
          createdAt: now,
          lastActive: now,
          expiresAt,
          limitTimer,
          inactivityTimer,
          url: embedUrl
        };
        
        sessionStore.set(sessionId, session);
        rateLimitStore.set(clientIP, [...ipSessions, sessionId]);

        return res.status(200).json({
          id: sessionId,
          url: embedUrl,
          expiresAt
        });
        
      } catch (fetchError) {
        console.error('Fetch error when creating session:', fetchError);
        return res.status(500).json({ 
          error: "Failed to connect to session service",
          details: fetchError.message
        });
      }

    } else if (req.method === "PATCH") {
      // Activity ping
      const { sessionId } = req.body;
      
      if (!validateSessionId(sessionId)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }

      const session = sessionStore.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found or expired" });
      }

      if (session.clientIP !== clientIP) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Reset inactivity timer
      if (session.inactivityTimer) {
        clearTimeout(session.inactivityTimer);
      }
      
      session.inactivityTimer = setTimeout(() => terminateSession(sessionId, 'inactivity'), INACTIVITY_TIMEOUT);
      session.lastActive = Date.now();
      
      sessionStore.set(sessionId, session);

      return res.status(200).json({ ok: true });

    } else if (req.method === "DELETE") {
      // Session termination
      const cookies = cookie.parse(req.headers.cookie || "");
      const secret = cookies.csrfSecret;
      const csrfToken = req.headers["x-csrf-token"];
      
      if (!secret || !csrfToken || !tokens.verify(secret, csrfToken)) {
        return res.status(403).json({ error: "Invalid CSRF token" });
      }

      const { sessionId } = req.body;

      if (!validateSessionId(sessionId)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }

      const session = sessionStore.get(sessionId);
      if (session && session.clientIP !== clientIP) {
        return res.status(403).json({ error: "Access denied" });
      }

      await terminateSession(sessionId, 'user_request');
      return res.status(200).json({ ok: true });

    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
    
  } catch (error) {
    console.error('Unexpected API Error:', error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message
    });
  }
});

// OpenRouter API endpoint
app.post('/api/openrouter', async (req, res) => {
  try {
    await openRouterHandler(req, res);
  } catch (error) {
    console.error('Error in OpenRouter handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve games.json
app.get('/games.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'games.json'));
});

// Shared session endpoints
app.post('/api/vm/shared/create', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    
    // Check API key
    const apiKey = process.env.HYPERBEAM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "Service temporarily unavailable",
        details: "HYPERBEAM_API_KEY not configured"
      });
    }

    // Create Hyperbeam session
    const requestBody = {
      timeout: {
        absolute: Math.floor(SHARED_SESSION_DURATION / 1000),
        inactive: Math.floor(INACTIVITY_TIMEOUT / 1000),
        offline: 3600
      }
    };
    
    const hyperbeamResponse = await fetch("https://engine.hyperbeam.com/v0/vm", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "Hyperbeam-Demo/1.0"
      },
      body: JSON.stringify(requestBody),
    });

    if (!hyperbeamResponse.ok) {
      const errorText = await hyperbeamResponse.text();
      console.error('Hyperbeam API error:', hyperbeamResponse.status, errorText);
      
      let errorMessage = "Failed to create session";
      let details = `HTTP ${hyperbeamResponse.status}`;
      
      if (hyperbeamResponse.status === 401) {
        errorMessage = "Invalid API key";
        details = "Please check your Hyperbeam API key";
      } else if (hyperbeamResponse.status === 429) {
        errorMessage = "Service temporarily overloaded";
        details = "Too many requests, please try again later";
      }
      
      return res.status(500).json({ 
        error: errorMessage,
        details: details
      });
    }

    const sessionData = await hyperbeamResponse.json();
    const sessionId = sessionData.session_id;
    const embedUrl = sessionData.embed_url;
    
    if (!sessionId || !embedUrl) {
      return res.status(500).json({ error: "Invalid session data received" });
    }

    // Create shared session
    const shareCode = createSharedSession(sessionId, embedUrl, clientIP);

    return res.status(200).json({
      sessionId: sessionId,
      shareCode: shareCode,
      url: embedUrl,
      expiresAt: Date.now() + SHARED_SESSION_DURATION
    });
    
  } catch (error) {
    console.error('Error creating shared session:', error);
    return res.status(500).json({ 
      error: "Failed to create shared session",
      details: error.message
    });
  }
});

app.post('/api/vm/shared/join', async (req, res) => {
  try {
    const { shareCode } = req.body;
    const clientIP = getClientIP(req);
    
    if (!shareCode || typeof shareCode !== 'string') {
      return res.status(400).json({ error: "Invalid share code" });
    }
    
    const result = joinSharedSession(shareCode.toUpperCase(), clientIP);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    
    return res.status(200).json({
      sessionId: result.session.id,
      shareCode: result.session.shareCode,
      url: result.session.url,
      users: result.session.users,
      isNewUser: result.isNewUser,
      expiresAt: result.session.expiresAt
    });
    
  } catch (error) {
    console.error('Error joining shared session:', error);
    return res.status(500).json({ 
      error: "Failed to join shared session",
      details: error.message
    });
  }
});

app.post('/api/vm/shared/leave', async (req, res) => {
  try {
    const { shareCode } = req.body;
    const clientIP = getClientIP(req);
    
    if (!shareCode || typeof shareCode !== 'string') {
      return res.status(400).json({ error: "Invalid share code" });
    }
    
    const success = leaveSharedSession(shareCode.toUpperCase(), clientIP);
    
    if (!success) {
      return res.status(400).json({ error: "Failed to leave session" });
    }
    
    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Error leaving shared session:', error);
    return res.status(500).json({ 
      error: "Failed to leave shared session",
      details: error.message
    });
  }
});

app.get('/api/vm/shared/:shareCode', async (req, res) => {
  try {
    const { shareCode } = req.params;
    const sharedSession = sharedSessionStore.get(shareCode.toUpperCase());
    
    if (!sharedSession) {
      return res.status(404).json({ error: "Session not found or expired" });
    }
    
    return res.status(200).json({
      sessionId: sharedSession.id,
      shareCode: sharedSession.shareCode,
      url: sharedSession.url,
      users: sharedSession.users,
      createdAt: sharedSession.createdAt,
      expiresAt: sharedSession.expiresAt
    });
    
  } catch (error) {
    console.error('Error getting shared session info:', error);
    return res.status(500).json({ 
      error: "Failed to get session info",
      details: error.message
    });
  }
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/ai', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'settings.html'));
});

app.get('/shared-session', (req, res) => {
  res.sendFile(path.join(__dirname, 'shared-session.html'));
});

app.get('/test-ai', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-ai.html'));
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Local development server running on http://localhost:${PORT}`);
  console.log(`📝 VM demo available at http://localhost:${PORT}`);
  console.log(`AI Chat available at: http://localhost:${PORT}/ai`);
  console.log(`Settings available at: http://localhost:${PORT}/settings`);
  console.log(`🔗 WebSocket server available at ws://localhost:${PORT}`);
  
  if (!process.env.HYPERBEAM_API_KEY) {
    console.log(`⚠️  Warning: HYPERBEAM_API_KEY environment variable is not set`);
    console.log(`   Set it with: export HYPERBEAM_API_KEY=your_api_key_here`);
    console.log(`   Or create a .env file with: HYPERBEAM_API_KEY=your_api_key_here`);
  } else {
    console.log(`✅ HYPERBEAM_API_KEY is configured`);
  }
});

// WebSocket server for shared sessions
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const shareCode = url.searchParams.get('shareCode');
  const clientIP = getClientIP(req);
  
  if (!shareCode) {
    ws.close(1008, 'Share code required');
    return;
  }
  
  const sharedSession = sharedSessionStore.get(shareCode.toUpperCase());
  if (!sharedSession) {
    ws.close(1008, 'Session not found or expired');
    return;
  }
  
  // Add WebSocket to the session's connections
  if (!sharedSessionConnections.has(shareCode.toUpperCase())) {
    sharedSessionConnections.set(shareCode.toUpperCase(), new Set());
  }
  sharedSessionConnections.get(shareCode.toUpperCase()).add(ws);
  
  // Send current session info to the new connection
  ws.send(JSON.stringify({
    type: 'session_info',
    sessionId: sharedSession.id,
    shareCode: sharedSession.shareCode,
    users: sharedSession.users,
    url: sharedSession.url,
    expiresAt: sharedSession.expiresAt
  }));
  
  console.log(`WebSocket connected for shared session ${shareCode} from ${clientIP}`);
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
          
        case 'user_activity':
          // Update user activity timestamp
          const session = sharedSessionStore.get(shareCode.toUpperCase());
          if (session) {
            const user = session.users.find(u => u.ip === clientIP);
            if (user) {
              user.lastActivity = Date.now();
              sharedSessionStore.set(shareCode.toUpperCase(), session);
            }
          }
          break;
          
        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });
  
  ws.on('close', (code, reason) => {
    console.log(`WebSocket disconnected for shared session ${shareCode} from ${clientIP}: ${code} - ${reason}`);
    
    // Remove WebSocket from connections
    const connections = sharedSessionConnections.get(shareCode.toUpperCase());
    if (connections) {
      connections.delete(ws);
      if (connections.size === 0) {
        sharedSessionConnections.delete(shareCode.toUpperCase());
      }
    }
  });
  
  ws.on('error', (error) => {
    console.error(`WebSocket error for shared session ${shareCode}:`, error);
  });
});
