const express = require('express');
const path = require('path');
const Tokens = require("csrf");
const cookie = require("cookie");
const NodeCache = require("node-cache");
const fetch = require("node-fetch");
const openRouterHandler = require('./api/openrouter.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
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

// Constants
const MAX_SESSIONS_PER_IP = 2;
const SESSION_DURATION = 4 * 60 * 1000; // 4 minutes
const INACTIVITY_TIMEOUT = 30 * 1000; // 30 seconds

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

app.get('/test-ai', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-ai.html'));
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Local development server running on http://localhost:${PORT}`);
  console.log(`📝 VM demo available at http://localhost:${PORT}`);
  console.log(`AI Chat available at: http://localhost:${PORT}/ai`);
  console.log(`Settings available at: http://localhost:${PORT}/settings`);
  
  if (!process.env.HYPERBEAM_API_KEY) {
    console.log(`⚠️  Warning: HYPERBEAM_API_KEY environment variable is not set`);
    console.log(`   Set it with: export HYPERBEAM_API_KEY=your_api_key_here`);
    console.log(`   Or create a .env file with: HYPERBEAM_API_KEY=your_api_key_here`);
  } else {
    console.log(`✅ HYPERBEAM_API_KEY is configured`);
  }
});
