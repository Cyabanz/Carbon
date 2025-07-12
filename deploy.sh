#!/bin/bash

echo "🚀 Deploying Hyperbeam Demo..."

# Check if HYPERBEAM_API_KEY is set
if [ -z "$HYPERBEAM_API_KEY" ]; then
    echo "❌ Error: HYPERBEAM_API_KEY environment variable is not set"
    echo "Please set it with: export HYPERBEAM_API_KEY=your_api_key_here"
    exit 1
fi

echo "✅ HYPERBEAM_API_KEY is set"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at the URL shown above"
echo "🔧 Make sure to set the HYPERBEAM_API_KEY environment variable in Vercel:"
echo "   npx vercel env add HYPERBEAM_API_KEY"