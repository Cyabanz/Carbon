#!/bin/bash

echo "🚀 Universal Hyperbeam Demo Deployment"
echo "======================================"

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

# Function to deploy to Vercel
deploy_vercel() {
    echo "🚀 Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    npx vercel --prod
    
    echo "✅ Vercel deployment complete!"
    echo "🔧 Make sure to set the HYPERBEAM_API_KEY environment variable in Vercel:"
    echo "   npx vercel env add HYPERBEAM_API_KEY"
}

# Function to deploy to Netlify
deploy_netlify() {
    echo "🚀 Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        echo "📦 Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    # Deploy to Netlify
    npx netlify deploy --prod --dir=.
    
    echo "✅ Netlify deployment complete!"
    echo "🔧 Make sure to set the HYPERBEAM_API_KEY environment variable in Netlify:"
    echo "   npx netlify env:set HYPERBEAM_API_KEY your_api_key_here"
}

# Function to deploy to both platforms
deploy_both() {
    echo "🚀 Deploying to both Vercel and Netlify..."
    
    echo ""
    echo "=== Vercel Deployment ==="
    deploy_vercel
    
    echo ""
    echo "=== Netlify Deployment ==="
    deploy_netlify
    
    echo ""
    echo "🎉 Deployment to both platforms complete!"
}

# Check for command line arguments
if [ "$1" = "vercel" ]; then
    deploy_vercel
elif [ "$1" = "netlify" ]; then
    deploy_netlify
elif [ "$1" = "both" ]; then
    deploy_both
else
    # Interactive mode
    echo ""
    echo "Choose deployment target:"
    echo "1) Vercel"
    echo "2) Netlify"
    echo "3) Both platforms"
    echo "4) Cancel"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            deploy_vercel
            ;;
        2)
            deploy_netlify
            ;;
        3)
            deploy_both
            ;;
        4)
            echo "Deployment cancelled."
            exit 0
            ;;
        *)
            echo "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
fi

echo ""
echo "📝 Environment Variable Setup:"
echo "=============================="
echo "Vercel:"
echo "  npx vercel env add HYPERBEAM_API_KEY"
echo ""
echo "Netlify:"
echo "  npx netlify env:set HYPERBEAM_API_KEY your_api_key_here"
echo "  Or set via Netlify dashboard: Site settings > Environment variables"