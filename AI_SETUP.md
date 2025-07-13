# Fusion AI Chat Setup Guide

## Overview
The Fusion AI Chat is a multi-conversation AI chat interface that supports multiple AI models through OpenRouter API.

## Features
- Multi-conversation support with Firebase
- Multiple AI personalities and models
- Reasoning mode support
- Web search functionality
- Conversation export
- Usage tracking and limits
- Google authentication

## Setup Instructions

### 1. Get OpenRouter API Key
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up for an account
3. Get your API key from the dashboard
4. The API key will be used to access various AI models

### 2. Configure API Key
You have two options:

#### Option A: Environment Variable (Recommended for production)
```bash
export OPENROUTER_API_KEY="your-api-key-here"
```

#### Option B: Direct in Code (For development only)
Edit `api/openrouter.js` and replace:
```javascript
const API_KEY = process.env.OPENROUTER_API_KEY || "your-openrouter-api-key-here";
```
with:
```javascript
const API_KEY = "your-actual-api-key-here";
```

### 3. Start the Server
```bash
npm start
```

### 4. Access the AI Chat
Open your browser and go to:
- AI Chat: `http://localhost:3000/ai`
- Settings: `http://localhost:3000/settings`

## Usage

### Authentication
- Click "Sign in with Google" to authenticate
- Your conversations will be saved to Firebase

### Creating Conversations
- Click "New conversation" to start a new chat
- Switch between conversations using the sidebar

### AI Personalities
- **Friendly**: Warm and conversational (GPT-3.5)
- **Professional**: Direct and efficient (GPT-4o Mini)
- **Humorous**: Witty and light-hearted (Claude-3 Haiku)
- **Creative**: Imaginative and original (GPT-4o)
- **Analytical**: Logical and precise (GPT-4o)

### Reasoning Modes
- **Focused**: Deterministic, logical, step-by-step
- **Balanced**: Blend of focus and creativity
- **Creative**: Open, lateral, imaginative

### Features
- **Regenerate**: Regenerate AI responses
- **Reasoning**: Show AI's step-by-step reasoning
- **Web Search**: Search the web (5 searches per day)
- **Export**: Download conversation as text file
- **Clear**: Clear conversation history

## Usage Limits
- **Messages**: 10 per hour
- **Web Searches**: 5 per day
- Limits reset automatically

## Troubleshooting

### API Key Issues
- Ensure your OpenRouter API key is valid
- Check that you have sufficient credits in your OpenRouter account

### Firebase Issues
- The app uses Firebase for authentication and data storage
- Ensure you have a stable internet connection

### Server Issues
- Make sure all dependencies are installed: `npm install`
- Check that port 3000 is available
- Restart the server if needed

## Models Available
- GPT-3.5 Turbo
- GPT-4o Mini
- GPT-4o
- Claude-3 Haiku
- Claude-3 Sonnet
- Gemini Pro

## Security Notes
- Never commit your API key to version control
- Use environment variables in production
- The app includes XSS protection with DOMPurify
- All user inputs are sanitized

## Support
If you encounter issues:
1. Check the browser console for errors
2. Verify your API key is correct
3. Ensure all dependencies are installed
4. Check your internet connection 