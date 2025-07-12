#!/bin/bash

echo "🚀 Deploying Hyperbeam Demo to Netlify..."

# Check if HYPERBEAM_API_KEY is set
if [ -z "$HYPERBEAM_API_KEY" ]; then
    echo "❌ Error: HYPERBEAM_API_KEY environment variable is not set"
    echo "Please set it with: export HYPERBEAM_API_KEY=your_api_key_here"
    exit 1
fi

echo "✅ HYPERBEAM_API_KEY is set"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod --dir=.

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at the URL shown above"
echo "🔧 Make sure to set the HYPERBEAM_API_KEY environment variable in Netlify:"
echo "   netlify env:set HYPERBEAM_API_KEY your_api_key_here"
echo ""
echo "📝 To set environment variables in Netlify dashboard:"
echo "   1. Go to your site settings in Netlify"
echo "   2. Navigate to Environment variables"
echo "   3. Add HYPERBEAM_API_KEY with your API key value"