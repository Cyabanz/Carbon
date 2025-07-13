const Tokens = require("csrf");
const cookie = require("cookie");

exports.handler = async function(event, context) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    };
    
    // Handle CORS preflight requests
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }
    
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const tokens = new Tokens();
    const secret = tokens.secretSync();
    const token = tokens.create(secret);

    // Set cookie header
    const cookieHeader = cookie.serialize("csrfSecret", secret, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
      secure: process.env.NODE_ENV === "production",
    });

    headers['Set-Cookie'] = cookieHeader;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ csrfToken: token })
    };
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to generate CSRF token',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};