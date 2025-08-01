const Tokens = require("csrf");
const cookie = require("cookie");
const NodeCache = require("node-cache");
const fetch = require("node-fetch");

const tokens = new Tokens();

// Use node-cache for better serverless compatibility
// Sessions expire automatically after 5 minutes (cleanup buffer)
const sessionStore = new NodeCache({ 
  stdTTL: 300, // 5 minutes TTL
  checkperiod: 60, // Check for expired keys every minute
  useClones: false
});

// Rate limiting store - tracks sessions per IP
const rateLimitStore = new NodeCache({
  stdTTL: 300, // 5 minutes
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
    return response.ok || response.status === 404; // 404 means already terminated
  } catch (error) {
    console.error(`Failed to terminate Hyperbeam session ${sessionId}:`, error.message);
    return false;
  }
}

function cleanupSession(sessionId) {
  const session = sessionStore.get(sessionId);
  if (session) {
    // Clear timers
    if (session.limitTimer) clearTimeout(session.limitTimer);
    if (session.inactivityTimer) clearTimeout(session.inactivityTimer);
    
    // Update IP session count
    const ipSessions = rateLimitStore.get(session.clientIP) || [];
    const updatedSessions = ipSessions.filter(id => id !== sessionId);
    
    if (updatedSessions.length > 0) {
      rateLimitStore.set(session.clientIP, updatedSessions);
    } else {
      rateLimitStore.del(session.clientIP);
    }
    
    // Remove from session store
    sessionStore.del(sessionId);
  }
}

async function terminateSession(sessionId, reason = 'timeout') {
  console.log(`Terminating session ${sessionId} due to ${reason}`);
  
  await terminateHyperbeamSession(sessionId);
  cleanupSession(sessionId);
}

module.exports = async function handler(req, res) {
  console.log(`🚀 API Request: ${req.method} ${req.url}`);
  console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
  
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-csrf-token');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  
  const clientIP = getClientIP(req);
  console.log(`Client IP: ${clientIP}`);
  
  try {
    if (req.method === "POST") {
      console.log("📝 POST request detected");
      
      // Parse cookies
      const cookies = cookie.parse(req.headers.cookie || "");
      console.log("🍪 Cookies:", cookies);
      
      const secret = cookies.csrfSecret;
      const csrfToken = req.headers["x-csrf-token"];
      
      console.log(`🔐 CSRF check - Secret: ${secret ? 'present' : 'missing'}, Token: ${csrfToken ? 'present' : 'missing'}`);
      
      if (!secret) {
        console.log("❌ Missing CSRF secret");
        return res.status(403).json({ error: "Missing CSRF secret" });
      }
      
      if (!csrfToken) {
        console.log("❌ Missing CSRF token");
        return res.status(403).json({ error: "Missing CSRF token" });
      }
      
      // Verify CSRF token
      let csrfValid = false;
      try {
        csrfValid = tokens.verify(secret, csrfToken);
        console.log(`🔐 CSRF verification result: ${csrfValid}`);
      } catch (csrfError) {
        console.error("🔐 CSRF verification error:", csrfError);
        return res.status(403).json({ error: "CSRF verification failed" });
      }
      
      if (!csrfValid) {
        console.log("❌ Invalid CSRF token");
        return res.status(403).json({ error: "Invalid CSRF token" });
      }

      // Rate limiting check
      const ipSessions = rateLimitStore.get(clientIP) || [];
      console.log(`🚦 Rate limit check - IP: ${clientIP}, Sessions: ${ipSessions.length}/${MAX_SESSIONS_PER_IP}`);
      
      if (ipSessions.length >= MAX_SESSIONS_PER_IP) {
        console.log("🚦 Rate limit exceeded");
        return res.status(429).json({ 
          error: `Rate limit exceeded. Maximum ${MAX_SESSIONS_PER_IP} sessions allowed per IP.`,
          retryAfter: 300
        });
      }

      // Validate API key
      const apiKey = process.env.HYPERBEAM_API_KEY;
      console.log(`🔑 API Key check: ${apiKey ? 'present' : 'MISSING'}`);
      
      if (!apiKey) {
        console.error('❌ Missing HYPERBEAM_API_KEY environment variable');
        return res.status(500).json({ error: "Service temporarily unavailable" });
      }

      // Create Hyperbeam session
      console.log("🎯 Attempting to create Hyperbeam session...");
      
      try {
        // Format request according to Hyperbeam API v0 documentation
        const requestBody = {
          timeout: {
            absolute: Math.floor(SESSION_DURATION / 1000), // 4 minutes in seconds
            inactive: Math.floor(INACTIVITY_TIMEOUT / 1000), // 30 seconds
            offline: 3600 // 1 hour (default)
          }
        };
        console.log("📤 Request body:", JSON.stringify(requestBody, null, 2));
        
        const hyperbeamResponse = await fetch("https://engine.hyperbeam.com/v0/vm", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "User-Agent": "Hyperbeam-Demo/1.0"
          },
          body: JSON.stringify(requestBody),
        });

        console.log(`📥 Hyperbeam response status: ${hyperbeamResponse.status}`);
        console.log(`📥 Hyperbeam response headers:`, Object.fromEntries(hyperbeamResponse.headers.entries()));

        if (!hyperbeamResponse.ok) {
          const errorText = await hyperbeamResponse.text();
          console.error('❌ Hyperbeam API error:', hyperbeamResponse.status, errorText);
          
          // Provide more specific error messages
          let errorMessage = "Failed to create session";
          let details = `HTTP ${hyperbeamResponse.status}`;
          
          if (hyperbeamResponse.status === 401) {
            errorMessage = "Invalid API key";
            details = "Please check your Hyperbeam API key";
          } else if (hyperbeamResponse.status === 429) {
            errorMessage = "Service temporarily overloaded";
            details = "Too many requests, please try again later";
          } else if (hyperbeamResponse.status === 400) {
            errorMessage = "Invalid request format";
            details = "Request format error";
          }
          
          return res.status(500).json({ 
            error: errorMessage,
            details: details
          });
        }

        let sessionData;
        try {
          sessionData = await hyperbeamResponse.json();
        } catch (error) {
          console.error('Failed to parse Hyperbeam response as JSON:', error.message);
          const responseText = await hyperbeamResponse.text().catch(() => 'Unable to read response');
          console.error('Response content:', responseText);
          return res.status(500).json({ 
            error: "Invalid response from Hyperbeam API",
            details: "Expected JSON but received HTML or malformed response"
          });
        }
        
        console.log("📦 Session data received:", JSON.stringify(sessionData, null, 2));
        
        // Hyperbeam API returns session_id, embed_url, admin_token
        const sessionId = sessionData.session_id;
        const embedUrl = sessionData.embed_url;
        
        if (!sessionId || !embedUrl) {
          console.error('❌ Invalid session data:', sessionData);
          return res.status(500).json({ error: "Invalid session data received" });
        }

        const now = Date.now();
        const expiresAt = now + SESSION_DURATION;

        console.log("⏱️ Setting up timers...");
        
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
        
        // Update rate limiting
        rateLimitStore.set(clientIP, [...ipSessions, sessionId]);

        console.log("✅ Session created successfully:", sessionId);

        return res.status(200).json({
          id: sessionId,
          url: embedUrl,
          expiresAt
        });
        
      } catch (fetchError) {
        console.error('❌ Fetch error when creating session:', fetchError);
        return res.status(500).json({ 
          error: "Failed to connect to session service",
          details: process.env.NODE_ENV === 'development' ? fetchError.message : "Network error"
        });
      }

    } else if (req.method === "PATCH") {
      console.log("🔧 PATCH request detected");
      
      // Activity ping to reset inactivity timer
      let body;
      try {
        // Handle different content types
        if (typeof req.body === "string") {
          body = JSON.parse(req.body);
        } else if (req.body && typeof req.body === "object") {
          body = req.body;
        } else {
          console.log("📝 Request body:", req.body);
          return res.status(400).json({ error: "Invalid request body" });
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return res.status(400).json({ error: "Invalid JSON body" });
      }

      const { sessionId } = body;
      console.log(`🔍 Session ID from PATCH: ${sessionId}`);
      
      if (!validateSessionId(sessionId)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }

      const session = sessionStore.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found or expired" });
      }

      // Verify session belongs to same IP (basic security check)
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
      console.log("🗑️ DELETE request detected");
      
      // Explicit session termination
      const cookies = cookie.parse(req.headers.cookie || "");
      const secret = cookies.csrfSecret;
      const csrfToken = req.headers["x-csrf-token"];
      
      if (!secret || !csrfToken || !tokens.verify(secret, csrfToken)) {
        return res.status(403).json({ error: "Invalid CSRF token" });
      }

      let sessionId;
      try {
        // Handle different content types
        if (typeof req.body === "string") {
          const body = JSON.parse(req.body);
          sessionId = body.sessionId;
        } else if (req.body && typeof req.body === "object") {
          sessionId = req.body.sessionId;
        } else {
          return res.status(400).json({ error: "Invalid request body" });
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return res.status(400).json({ error: "Invalid JSON body" });
      }

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
      console.log(`❌ Method not allowed: ${req.method}`);
      return res.status(405).json({ error: "Method not allowed" });
    }
    
  } catch (error) {
    console.error('💥 Unexpected API Error:', error);
    console.error('Stack trace:', error.stack);
    return res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : "Unexpected error occurred"
    });
  }
};