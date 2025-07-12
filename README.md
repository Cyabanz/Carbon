# Hyperbeam VM Demo

A web-based virtual machine demo using Hyperbeam's cloud gaming platform with CSRF protection and rate limiting.

## 🚨 Fixing the 404 Error

The 404 error you're experiencing is because the API endpoints (`/api/vm` and `/api/vm/csrf-token`) are Vercel serverless functions that only work when deployed to Vercel. Here are the solutions:

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

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Set your Hyperbeam API key:**
   ```bash
   export HYPERBEAM_API_KEY=your_api_key_here
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Set environment variable in Vercel:**
   ```bash
   npx vercel env add HYPERBEAM_API_KEY
   ```

## 🔧 How It Works

- **vm.html**: The main demo page that creates and manages Hyperbeam sessions
- **server.js**: Local development server that mimics the Vercel serverless functions
- **api/vm/**: Vercel serverless functions for production deployment

## 📋 Requirements

- Node.js 14+ 
- Hyperbeam API key (get one at https://hyperbeam.com)
- For production: Vercel account

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
- **Production**: Ensure the project is deployed to Vercel and environment variables are set

### API Key Issues
- Verify your Hyperbeam API key is valid
- Check that the environment variable is set correctly
- For Vercel: Use `npx vercel env ls` to verify

### Session Creation Fails
- Check browser console for detailed error messages
- Verify network connectivity
- Ensure rate limits aren't exceeded

## 📁 Project Structure

```
├── vm.html              # Main demo page
├── server.js            # Local development server
├── api/                 # Vercel serverless functions
│   ├── vm/
│   │   ├── index.js     # Main VM API
│   │   └── csrf-token.js # CSRF token endpoint
│   └── health.js        # Health check
├── package.json         # Dependencies and scripts
├── vercel.json          # Vercel configuration
└── deploy.sh           # Deployment script
```

## 🔐 Security Features

- CSRF token validation
- Rate limiting per IP address
- Session isolation
- Automatic session cleanup
- Secure cookie handling

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HYPERBEAM_API_KEY` | Your Hyperbeam API key | Yes |
| `PORT` | Local server port (default: 3000) | No |

## 📝 License

MIT License - feel free to use this for your own projects!