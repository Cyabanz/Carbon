# 🚀 Complete Deployment Guide

This guide covers deploying the Hyperbeam VM Demo to **Vercel**, **Netlify**, and **local development**.

## 📋 Prerequisites

1. **Hyperbeam API Key**: Get one at https://hyperbeam.com
2. **Node.js 14+**: Install from https://nodejs.org
3. **Git**: For version control

## 🔧 Quick Setup

### 1. Set Environment Variable
```bash
export HYPERBEAM_API_KEY=your_api_key_here
```

### 2. Install Dependencies
```bash
npm install
```

## 🌐 Deployment Options

### Option A: Local Development (Recommended for Testing)

```bash
npm start
```
Then open http://localhost:3000

### Option B: Deploy to Vercel

```bash
npm run deploy:vercel
```

**After deployment:**
```bash
npx vercel env add HYPERBEAM_API_KEY
```

### Option C: Deploy to Netlify

```bash
npm run deploy:netlify
```

**After deployment:**
```bash
npx netlify env:set HYPERBEAM_API_KEY your_api_key_here
```

### Option D: Deploy to Both Platforms

```bash
npm run deploy:both
```

### Option E: Interactive Deployment

```bash
npm run deploy
```
This will prompt you to choose your deployment target.

## 🔍 Platform Detection

The app automatically detects which platform it's running on:

- **Vercel**: Uses `/api/vm` endpoints
- **Netlify**: Uses `/.netlify/functions/vm` endpoints  
- **Local**: Uses `/api/vm` endpoints (via Express server)

## 📁 File Structure

```
├── vm.html                    # Main demo page
├── server.js                  # Local development server
├── platform-detector.js       # Platform detection utility
├── api/                       # Vercel serverless functions
│   └── vm/
│       ├── index.js          # Main VM API
│       └── csrf-token.js     # CSRF token endpoint
├── netlify/                   # Netlify serverless functions
│   └── functions/
│       └── vm/
│           ├── index.js      # Main VM API
│           └── csrf-token.js # CSRF token endpoint
├── vercel.json               # Vercel configuration
├── netlify.toml              # Netlify configuration
└── deploy-*.sh               # Deployment scripts
```

## 🔐 Environment Variables

| Platform | Variable | Set via |
|----------|----------|---------|
| All | `HYPERBEAM_API_KEY` | Required for full functionality |
| Vercel | `HYPERBEAM_API_KEY` | `npx vercel env add` |
| Netlify | `HYPERBEAM_API_KEY` | `npx netlify env:set` or dashboard |
| Local | `HYPERBEAM_API_KEY` | `export` or `.env` file |

## 🚨 Troubleshooting

### 404 Errors
- **Local**: Ensure `npm start` is running
- **Vercel**: Check deployment status and environment variables
- **Netlify**: Check deployment status and environment variables

### API Key Issues
- Verify your Hyperbeam API key is valid
- Check environment variables are set correctly
- Use platform-specific commands to verify:
  - Vercel: `npx vercel env ls`
  - Netlify: `npx netlify env:list`

### Deployment Failures
- Ensure all dependencies are installed: `npm install`
- Check that the API key is set: `echo $HYPERBEAM_API_KEY`
- Verify platform CLI tools are installed

## 🎯 Testing

### Test Platform Detection
```bash
node test-platform.js
```

### Test Local Server
```bash
node test-setup.js
```

### Test Full Functionality
1. Start local server: `npm start`
2. Open http://localhost:3000
3. Click "Create New Session"
4. Verify session creation and management

## 📝 Platform-Specific Notes

### Vercel
- Functions timeout: 10 seconds
- Cold start: ~100-200ms
- Global edge network

### Netlify
- Functions timeout: 10 seconds (default)
- Cold start: ~200-500ms
- Global CDN

### Local Development
- No timeout limits
- Instant response
- Full debugging capabilities

## 🔄 Migration Between Platforms

The app is designed to work seamlessly across platforms. To migrate:

1. **From Local to Vercel**: Run `npm run deploy:vercel`
2. **From Local to Netlify**: Run `npm run deploy:netlify`
3. **Between Vercel and Netlify**: Deploy to both with `npm run deploy:both`

No code changes required - the platform detector handles everything automatically!

## 🎉 Success!

Once deployed, your Hyperbeam VM Demo will be available at:
- **Local**: http://localhost:3000
- **Vercel**: https://your-project.vercel.app
- **Netlify**: https://your-project.netlify.app

The same codebase works perfectly on all platforms! 🚀