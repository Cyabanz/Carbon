// Security Headers Configuration
// This file provides security headers for various hosting platforms

// For Netlify (netlify.toml)
const netlifyConfig = `
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://www.gstatic.com https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com; frame-ancestors 'none';"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Cache-Control = "no-store, no-cache, must-revalidate, proxy-revalidate"
    Pragma = "no-cache"
    Expires = "0"

[[headers]]
  for = "*.html"
  [headers.values]
    Content-Type = "text/html; charset=utf-8"
    X-Robots-Tag = "noindex, nofollow, noarchive, nosnippet"

[[headers]]
  for = "*.js"
  [headers.values]
    Content-Type = "application/javascript; charset=utf-8"
    X-Robots-Tag = "noindex, nofollow"
`;

// For Vercel (vercel.json)
const vercelConfig = {
  headers: [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Frame-Options",
          value: "DENY"
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff"
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block"
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin"
        },
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://www.gstatic.com https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com; frame-ancestors 'none';"
        },
        {
          key: "Permissions-Policy",
          value: "geolocation=(), microphone=(), camera=()"
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains"
        },
        {
          key: "Cache-Control",
          value: "no-store, no-cache, must-revalidate, proxy-revalidate"
        },
        {
          key: "Pragma",
          value: "no-cache"
        },
        {
          key: "Expires",
          value: "0"
        }
      ]
    },
    {
      source: "/(.*).html",
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow, noarchive, nosnippet"
        }
      ]
    }
  ]
};

// For Apache (.htaccess)
const apacheConfig = `
# Security Headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://www.gstatic.com https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com; frame-ancestors 'none';"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Disable caching
Header always set Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate"
Header always set Pragma "no-cache"
Header always set Expires "0"

# Prevent access to source files
<Files "*.js">
    Header always set X-Robots-Tag "noindex, nofollow"
</Files>

<Files "*.html">
    Header always set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet"
</Files>

# Disable directory browsing
Options -Indexes

# Prevent access to sensitive files
<FilesMatch "^\\.(htaccess|htpasswd|ini|log|sh|sql|conf)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Block common attack patterns
RewriteEngine On
RewriteCond %{QUERY_STRING} (\<|%3C).*script.*(\>|%3E) [NC,OR]
RewriteCond %{QUERY_STRING} GLOBALS(=|\[|\%[0-9A-Z]{0,2}) [OR]
RewriteCond %{QUERY_STRING} _REQUEST(=|\[|\%[0-9A-Z]{0,2}) [OR]
RewriteCond %{QUERY_STRING} proc/self/environ [OR]
RewriteCond %{QUERY_STRING} mosConfig [OR]
RewriteCond %{QUERY_STRING} base64_(en|de)code[^(]*\\([^)]*\\) [OR]
RewriteCond %{QUERY_STRING} (<|%3C)([^s]*s)+cript.*(>|%3E) [NC,OR]
RewriteCond %{QUERY_STRING} (\<|%3C).*iframe.*(\>|%3E) [NC]
RewriteRule .* - [F]
`;

// For Nginx (nginx.conf)
const nginxConfig = `
# Security Headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://www.gstatic.com https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com; frame-ancestors 'none';" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Disable caching
add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate" always;
add_header Pragma "no-cache" always;
add_header Expires "0" always;

# Prevent access to source files
location ~* \\.(js|html)$ {
    add_header X-Robots-Tag "noindex, nofollow" always;
}

# Block access to sensitive files
location ~ /\\.. {
    deny all;
}

location ~ \\.(htaccess|htpasswd|ini|log|sh|sql|conf)$ {
    deny all;
}
`;

// Export configurations
module.exports = {
  netlifyConfig,
  vercelConfig,
  apacheConfig,
  nginxConfig
};

console.log(`
🔒 SECURITY CONFIGURATION FILES CREATED

To implement server-side protection:

1. For Netlify: Copy the netlifyConfig content to netlify.toml
2. For Vercel: Copy the vercelConfig content to vercel.json  
3. For Apache: Copy the apacheConfig content to .htaccess
4. For Nginx: Copy the nginxConfig content to your nginx.conf

These configurations will add:
- X-Frame-Options: Prevent iframe embedding
- X-Content-Type-Options: Prevent MIME type sniffing
- X-XSS-Protection: Enable XSS protection
- Content-Security-Policy: Restrict resource loading
- Strict-Transport-Security: Force HTTPS
- Cache-Control: Prevent caching
- X-Robots-Tag: Prevent search engine indexing

Combine with the client-side protection for maximum security.
`); 