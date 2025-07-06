# Carbon Theme System & Firebase Setup

## Overview

This implementation adds a comprehensive theme system to Carbon that works across all pages (settings.html, games.html, proxy.html, carbon.html) with real-time theme switching and local storage persistence.

## Theme System Features

### 🎨 Available Themes
- **Rose Pine** (default) - Elegant purple/pink theme
- **Dark** - Modern dark theme with slate colors
- **Light** - Clean light theme for daytime use
- **Catppuccin** - Popular pastel theme
- **Nord** - Arctic-inspired theme
- **Gruvbox** - Retro warm colors
- **Tokyo Night** - Vibrant purple night theme
- **Dracula** - Classic vampire theme

### 🖼️ Background Options
- **Gradient** - Dynamic gradient based on theme colors
- **Solid** - Flat background color
- **Pattern** - Subtle dot pattern overlay
- **Particles** - Animated particle background (extensible)
- **Custom Image** - User-uploaded background images

### ⚡ Real-time Features
- Cross-tab theme synchronization
- Live theme preview
- Instant theme switching
- Local storage persistence
- Message-based communication between windows

## File Structure

```
carbon/
├── settings.html          # Main theme settings interface
├── games.html            # Games page with theme support
├── proxy.html           # Proxy browser with theme support
├── carbon.html          # Game player with theme support
├── carbon-theme.js      # Shared theme system (NEW)
├── firestore.rules      # Firebase security rules (NEW)
└── THEME_SETUP.md      # This documentation (NEW)
```

## Installation & Setup

### 1. Theme System Setup

The theme system is automatically included in all pages via `carbon-theme.js`. No additional setup required for basic functionality.

**Files Updated:**
- ✅ `settings.html` - Enhanced with comprehensive theme controls
- ✅ `games.html` - Added theme script inclusion
- ✅ `proxy.html` - Added theme script inclusion  
- ✅ `carbon.html` - Added theme script inclusion

### 2. Firebase Rules Deployment

Deploy the security rules to your Firebase project:

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project directory
firebase init firestore

# Copy the provided firestore.rules to your project
cp firestore.rules /path/to/your/firebase/project/

# Deploy the rules
firebase deploy --only firestore:rules
```

### 3. Local Storage Configuration

The theme system uses these localStorage keys:

```javascript
// Theme settings
'carbon-theme-global'     // Current theme name
'carbon-background'       // Background type
'carbon-custom-bg'        // Custom background image data URL

// Settings page specific
'carbon-theme'            // Settings page theme
'carbon-panic-key'        // Panic key setting
'carbon-cloak-enabled'    // Tab cloaking enabled
// ... other settings
```

## Usage Guide

### For Users

1. **Access Settings**: Navigate to `carbon://settings` or visit `settings.html`
2. **Choose Theme**: Click on any theme preview in the "Theme Colors" section
3. **Select Background**: Choose from Gradient, Solid, Pattern, or Particles
4. **Upload Custom**: Use the "Custom Background Image" section for personal images
5. **Save Settings**: Click "Save All Settings" to persist changes

### For Developers

#### Using the Theme System

```javascript
// Access the global theme manager
const themeManager = window.carbonTheme;

// Get current theme
const currentTheme = themeManager.getCurrentTheme();

// Change theme programmatically
themeManager.setTheme('tokyo-night');

// Get theme colors
const theme = themeManager.getTheme('gruvbox');
console.log(theme.foam); // Returns the foam color for gruvbox theme

// Listen for theme changes
window.addEventListener('message', (event) => {
  if (event.data.type === 'carbon-theme-change') {
    console.log('Theme changed to:', event.data.theme);
  }
});
```

#### Adding New Themes

Add new themes to the `themes` object in `carbon-theme.js`:

```javascript
'my-theme': {
  base: '#1a1a1a',
  surface: '#2d2d2d',
  overlay: '#404040',
  muted: '#6b6b6b',
  subtle: '#a0a0a0',
  text: '#ffffff',
  love: '#ff6b6b',
  gold: '#ffd93d',
  rose: '#ff8c82',
  pine: '#6bcf7f',
  foam: '#4d9de0',
  iris: '#bb9af7',
  highlightLow: '#1f1f1f',
  highlightMed: '#333333',
  highlightHigh: '#4d4d4d'
}
```

#### CSS Integration

Themes automatically update CSS custom properties:

```css
/* Use theme variables in your CSS */
.my-element {
  background: var(--theme-surface);
  color: var(--theme-text);
  border: 1px solid var(--theme-overlay);
}

/* Or use the gradient */
.gradient-bg {
  background: var(--theme-gradient);
}
```

## Firebase Collections

### Required Collections

The application uses these Firestore collections:

#### `/games/{gameId}`
- Game data and metadata
- Public read access
- Admin write access

#### `/games/{gameId}/ratings/{userId}`
- User game ratings (1-5 stars)
- Users can only write their own ratings
- Public read access

#### `/games/{gameId}/comments/{commentId}`
- Game comments and reviews
- Users can write/edit their own comments
- Public read access

#### `/games/{gameId}/comments/{commentId}/replies/{replyId}`
- Comment replies
- Users can write/edit their own replies
- Public read access

#### `/users/{userId}`
- User profile and preferences
- Users can only access their own data
- Stores: `likedGames`, `favoriteGames`, `playlist`, `history`, `gameStats`

#### `/userSettings/{settingId}`
- User settings and preferences
- Authenticated user access
- Stores theme, background, and privacy settings

### Optional Collections

#### `/themes/{themeId}`
- Custom user-created themes
- Public read for public themes
- Users can create/edit their own themes

#### `/analytics/{document}`
- Usage analytics (write-only for users)
- Admin read access only

## Security Features

### XSS Protection
- HTML escaping for all user-generated content
- URL validation for images and links
- Input sanitization and length limits
- CSP headers in settings.html

### Data Validation
- Server-side validation in Firebase rules
- Client-side validation for UX
- Type checking for all data fields
- Size limits on user uploads

### Access Control
- User isolation (users can only access their own data)
- Owner-based permissions for comments/ratings
- Rate limiting for comment submissions
- Anonymous read access for public content

## Troubleshooting

### Theme Not Applying
1. Check browser console for JavaScript errors
2. Verify `carbon-theme.js` is loading correctly
3. Check if localStorage is accessible
4. Clear localStorage and refresh: `localStorage.clear()`

### Cross-Tab Sync Issues
1. Verify both tabs are on the same domain
2. Check that localStorage events are firing
3. Test with different browsers

### Firebase Permission Errors
1. Verify rules are deployed correctly
2. Check user authentication status
3. Verify collection and document paths
4. Test with Firebase console

### Custom Background Not Saving
1. Check file size (max 10MB)
2. Verify image format (PNG, JPG, WebP)
3. Check localStorage space availability
4. Test with smaller images

## Performance Considerations

- **Theme switching**: ~50ms (CSS variable updates)
- **Cross-tab sync**: ~100ms (localStorage events)
- **Custom backgrounds**: Stored as data URLs (consider file size)
- **Firebase queries**: Optimized with proper indexing

## Browser Support

- **Modern browsers**: Full support (Chrome 80+, Firefox 75+, Safari 13+)
- **CSS Variables**: Required for theme system
- **LocalStorage**: Required for persistence
- **PostMessage API**: Required for cross-tab communication

## Contributing

To add new themes or features:

1. Follow the existing theme color structure
2. Test across all Carbon pages
3. Ensure mobile responsiveness
4. Update documentation
5. Test Firebase rules in emulator

## License

This theme system is part of the Carbon project. Refer to the main project license for usage terms.