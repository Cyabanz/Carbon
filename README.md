# Hyperbeam VM Demo

A web-based virtual machine demo using Hyperbeam's cloud gaming platform with CSRF protection and rate limiting. **Works on Vercel, Netlify, and locally!**

## 🚨 Fixing the 404 Error

The 404 error you're experiencing is because the API endpoints (`/api/vm` and `/api/vm/csrf-token`) are serverless functions that only work when deployed or running locally with the development server. Here are the solutions:

### Option 1: Run Locally (Recommended for Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set your Hyperbeam API key:**
   ```bash
   export HYPERBEAM_API_KEY=your_api_key_here
   ```
   
   Or create a `.env` file:
   ```
   HYPERBEAM_API_KEY=your_api_key_here
   ```

3. **Start the local development server:**
   ```bash
   npm start
   ```

4. **Access the demo:**
   Open http://localhost:3000 in your browser

### Option 2: Deploy to Vercel (Production)

1. **Set your Hyperbeam API key:**
   ```bash
   export HYPERBEAM_API_KEY=your_api_key_here
   ```

2. **Deploy:**
   ```bash
   npm run deploy:vercel
   ```

3. **Set environment variable in Vercel:**
   ```bash
   npx vercel env add HYPERBEAM_API_KEY
   ```

### Option 3: Deploy to Netlify (Production)

1. **Set your Hyperbeam API key:**
   ```bash
   export HYPERBEAM_API_KEY=your_api_key_here
   ```

2. **Deploy:**
   ```bash
   npm run deploy:netlify
   ```

3. **Set environment variable in Netlify:**
   ```bash
   npx netlify env:set HYPERBEAM_API_KEY your_api_key_here
   ```

### Option 4: Deploy to Both Platforms

1. **Set your Hyperbeam API key:**
   ```bash
   export HYPERBEAM_API_KEY=your_api_key_here
   ```

2. **Deploy to both:**
   ```bash
   npm run deploy:both
   ```

3. **Set environment variables on both platforms**

## 🔧 How It Works

- **vm.html**: The main demo page that creates and manages Hyperbeam sessions
- **server.js**: Local development server that mimics the serverless functions
- **api/vm/**: Vercel serverless functions for production deployment
- **netlify/functions/vm/**: Netlify serverless functions for production deployment
- **platform-detector.js**: Automatically detects the platform and uses the correct API endpoints

## 📋 Requirements

- Node.js 14+ 
- Hyperbeam API key (get one at https://hyperbeam.com)
- For production: Vercel and/or Netlify account

## 🚀 Features

- ✅ CSRF protection
- ✅ Rate limiting (2 sessions per IP)
- ✅ Session timeout (4 minutes)
- ✅ Inactivity detection (30 seconds)
- ✅ Automatic cleanup
- ✅ Fullscreen support
- ✅ Real-time session status

## 🔍 Troubleshooting

### 404 Error
- **Local**: Make sure you're running `npm start` and accessing http://localhost:3000
- **Production**: Ensure the project is deployed to Vercel/Netlify and environment variables are set

### API Key Issues
- Verify your Hyperbeam API key is valid
- Check that the environment variable is set correctly
- For Vercel: Use `npx vercel env ls` to verify
- For Netlify: Use `npx netlify env:list` to verify

### Session Creation Fails
- Check browser console for detailed error messages
- Verify network connectivity
- Ensure rate limits aren't exceeded

## 📁 Project Structure

```
├── vm.html                    # Main demo page
├── server.js                  # Local development server
├── platform-detector.js       # Platform detection utility
├── api/                       # Vercel serverless functions
│   ├── vm/
│   │   ├── index.js          # Main VM API
│   │   └── csrf-token.js     # CSRF token endpoint
│   └── health.js             # Health check
├── netlify/                   # Netlify serverless functions
│   └── functions/
│       └── vm/
│           ├── index.js      # Main VM API
│           └── csrf-token.js # CSRF token endpoint
├── package.json              # Dependencies and scripts
├── vercel.json               # Vercel configuration
├── netlify.toml              # Netlify configuration
├── deploy.sh                 # Vercel deployment script
├── deploy-netlify.sh         # Netlify deployment script
└── deploy-universal.sh       # Universal deployment script
```

## 🔐 Security Features

- CSRF token validation
- Rate limiting per IP address
- Session isolation
- Automatic session cleanup
- Secure cookie handling

## 🌐 Platform Compatibility

This project is designed to work seamlessly across multiple platforms:

### ✅ **Vercel**
- Uses `/api/vm` endpoints
- Configured via `vercel.json`
- Deploy with `npm run deploy:vercel`

### ✅ **Netlify**
- Uses `/.netlify/functions/vm` endpoints
- Configured via `netlify.toml`
- Deploy with `npm run deploy:netlify`

### ✅ **Local Development**
- Uses `/api/vm` endpoints (mimics Vercel)
- Runs on Express server
- Start with `npm start`

### 🔄 **Automatic Platform Detection**
The `platform-detector.js` utility automatically detects which platform you're running on and uses the appropriate API endpoints, so the same code works everywhere!

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HYPERBEAM_API_KEY` | Your Hyperbeam API key | Yes |
| `PORT` | Local server port (default: 3000) | No |

## 📝 License

MIT License - feel free to use this for your own projects!