// Platform detection utility
// This helps determine which platform we're running on and provides appropriate configurations

function detectPlatform() {
  // Check for Vercel environment
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return 'vercel';
  }
  
  // Check for Netlify environment
  if (process.env.NETLIFY || process.env.NETLIFY_DEV) {
    return 'netlify';
  }
  
  // Check for Netlify Functions
  if (process.env.AWS_LAMBDA_FUNCTION_NAME && process.env.AWS_LAMBDA_FUNCTION_NAME.includes('netlify')) {
    return 'netlify';
  }
  
  // Default to local
  return 'local';
}

function getApiBaseUrl() {
  const platform = detectPlatform();
  
  switch (platform) {
    case 'vercel':
      return '/api';
    case 'netlify':
      return '/.netlify/functions';
    case 'local':
    default:
      return '/api';
  }
}

function getFunctionPath(functionName) {
  const platform = detectPlatform();
  
  switch (platform) {
    case 'vercel':
      return `/api/${functionName}`;
    case 'netlify':
      return `/.netlify/functions/${functionName}`;
    case 'local':
    default:
      return `/api/${functionName}`;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    detectPlatform,
    getApiBaseUrl,
    getFunctionPath
  };
}

// For browser usage
if (typeof window !== 'undefined') {
  window.platformDetector = {
    detectPlatform: () => {
      // Browser detection logic
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      
      if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
        return 'vercel';
      }
      
      if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
        return 'netlify';
      }
      
      if (pathname.includes('/.netlify/functions/')) {
        return 'netlify';
      }
      
      return 'local';
    },
    getApiBaseUrl: () => {
      const platform = window.platformDetector.detectPlatform();
      
      switch (platform) {
        case 'vercel':
          return '/api';
        case 'netlify':
          return '/.netlify/functions';
        case 'local':
        default:
          return '/api';
      }
    },
    getFunctionPath: (functionName) => {
      const platform = window.platformDetector.detectPlatform();
      
      switch (platform) {
        case 'vercel':
          return `/api/${functionName}`;
        case 'netlify':
          return `/.netlify/functions/${functionName}`;
        case 'local':
        default:
          return `/api/${functionName}`;
      }
    }
  };
}