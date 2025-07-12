# 🔧 Fixing the 500 Error

## 🚨 **Root Cause Identified**

The 500 error you're seeing is caused by **missing environment variables**. Here's what's happening:

1. **HYPERBEAM_API_KEY is not set** - This causes the server to return a 500 error
2. **CSRF token validation issues** - The browser can't properly validate the security token

## ✅ **Step-by-Step Fix**

### Step 1: Get a Hyperbeam API Key

1. Go to https://hyperbeam.com
2. Sign up for an account
3. Navigate to your dashboard
4. Copy your API key

### Step 2: Set the Environment Variable

**For Local Development:**
```bash
export HYPERBEAM_API_KEY=your_actual_api_key_here
```

**For Vercel:**
```bash
npx vercel env add HYPERBEAM_API_KEY
```

**For Netlify:**
```bash
npx netlify env:set HYPERBEAM_API_KEY your_actual_api_key_here
```

### Step 3: Restart the Server

**Local Development:**
```bash
# Stop the current server (Ctrl+C)
npm start
```

**Vercel/Netlify:**
The environment variable will be applied automatically on the next deployment.

### Step 4: Test the Fix

Run the debug tool to verify everything is working:
```bash
node debug-api.js
```

## 🔍 **Verification Steps**

### Check Environment Variable
```bash
echo $HYPERBEAM_API_KEY
```
Should show your API key (not empty).

### Test API Endpoints
```bash
node debug-api.js
```
Should show:
- ✅ HYPERBEAM_API_KEY: SET
- ✅ CSRF Status: 200
- ✅ VM Status: 200 (or proper error message)

### Test in Browser
1. Open http://localhost:3000
2. Open browser console (F12)
3. Click "Create New Session"
4. Should see successful session creation

## 🚨 **Common Issues & Solutions**

### Issue: "HYPERBEAM_API_KEY: NOT SET"
**Solution:** Set the environment variable as shown above.

### Issue: "Invalid API key" error
**Solution:** 
1. Verify your API key is correct
2. Check that you copied the entire key
3. Ensure the key is active in your Hyperbeam dashboard

### Issue: "Service temporarily unavailable"
**Solution:**
1. Check your internet connection
2. Verify Hyperbeam service is up
3. Try again in a few minutes

### Issue: "Rate limit exceeded"
**Solution:**
1. Wait 5 minutes before trying again
2. You're limited to 2 sessions per IP address

## 🎯 **Quick Test Commands**

```bash
# Check if API key is set
echo $HYPERBEAM_API_KEY

# Test the API
node debug-api.js

# Start server (if not running)
npm start

# Test platform detection
node test-platform.js
```

## 📝 **Expected Results After Fix**

When everything is working correctly, you should see:

1. **Environment Variable:**
   ```
   HYPERBEAM_API_KEY: SET
   ```

2. **API Test Results:**
   ```
   ✅ Server is running on http://localhost:3000
   ✅ CSRF Token: Received
   ✅ VM Response: Session created successfully
   ```

3. **Browser Console:**
   ```
   🔍 Platform detected: local, CSRF path: /api/vm/csrf-token
   🔍 Platform detected: local, VM API path: /api/vm
   📡 API response status: 200
   Session created successfully!
   ```

## 🆘 **Still Having Issues?**

If you're still getting errors after following these steps:

1. **Check the server logs** - Look for detailed error messages
2. **Verify API key format** - Should be a long string without spaces
3. **Test with curl** - Try the API endpoints directly
4. **Check browser console** - Look for network errors

Run this command for detailed debugging:
```bash
node debug-api.js
```

The debug tool will show you exactly what's failing and how to fix it!