# Enhanced Carbon Theme System with Color Wheel

## Overview

The Carbon theme system has been enhanced to provide a unified theming experience across all HTML files with custom color wheel functionality for creating personalized themes.

## Features

### 🎨 Color Wheel Theme Creator
- **Custom Theme Generation**: Create personalized themes using a color wheel interface
- **Smart Color Palette**: Automatically generates a complete color palette from a single base color
- **Live Preview**: See your theme in real-time as you adjust colors
- **Intelligent Contrast**: Automatically adjusts for light/dark themes based on color brightness

### 🔄 Cross-Page Synchronization
- **Real-time Updates**: Theme changes instantly sync across all open Carbon pages
- **Local Storage**: Persistent theme preferences using global storage keys
- **Cross-tab Communication**: Theme changes broadcast to all open tabs/windows

### 🎯 Universal Coverage
The enhanced theme system works across all Carbon pages:
- ✅ **settings.html** - Full theme management interface
- ✅ **newtab.html** - Quick theme switching
- ✅ **games.html** - Automatic theme application
- ✅ **history.html** - Consistent theming
- ✅ **carbon.html** - Game page theming

## How to Use

### Creating Custom Themes

1. **Open Settings**: Navigate to `settings.html`
2. **Access Color Wheel**: Click the "Custom" theme preview with the palette icon
3. **Choose Base Color**: Use the color picker to select your preferred base color
4. **Preview Theme**: Watch the live preview update with your color palette
5. **Name Your Theme**: Enter a unique name for your custom theme
6. **Create Theme**: Click "Create Theme" to save and apply

### Managing Themes

#### Preset Themes
- Rose Pine (default)
- Dark
- Light
- Catppuccin
- Nord
- Gruvbox
- Tokyo Night
- Dracula

#### Custom Themes
- View all your custom themes in the "Your Custom Themes" section
- Delete custom themes using the × button
- Apply any theme by clicking on its preview

### Theme Storage

The system uses consistent local storage keys:
- `carbon-theme-global`: Current active theme
- `carbon-custom-themes`: All user-created custom themes
- `carbon-background-global`: Background style preference
- `carbon-custom-bg-global`: Custom background image

## Technical Implementation

### Color Generation Algorithm

The color wheel system uses HSL color space manipulation to generate harmonious color palettes:

```javascript
// Generate theme from base color
generateThemeFromColor(hexColor) {
    const hsl = this.hexToHsl(hexColor);
    const isDark = hsl.l < 0.5;
    
    // Create palette with proper contrast
    const theme = {
        base: this.adjustColor(hexColor, isDark ? 0 : -0.4, isDark ? 0 : -0.1),
        surface: this.adjustColor(hexColor, isDark ? 0.05 : -0.35, isDark ? 0.05 : -0.08),
        // ... more colors with calculated adjustments
    };
}
```

### Cross-Page Communication

```javascript
// Broadcast theme changes
broadcastThemeChange(themeName, theme) {
    const message = {
        type: 'carbon-theme-change',
        theme: themeName,
        themeData: theme
    };
    
    // Send to parent/opener windows
    window.parent.postMessage(message, '*');
    window.opener.postMessage(message, '*');
    
    // Trigger storage event for same-origin tabs
    localStorage.setItem('carbon-theme-broadcast', JSON.stringify({
        timestamp: Date.now(),
        theme: themeName,
        themeData: theme
    }));
}
```

### CSS Variable System

All themes use CSS custom properties for consistency:

```css
:root {
    --theme-base: #191724;
    --theme-surface: #1f1d2e;
    --theme-overlay: #26233a;
    --theme-text: #e0def4;
    --theme-foam: #9ccfd8;
    /* ... more theme variables */
}
```

## File Changes Summary

### Enhanced Files

1. **carbon-theme.js** - Complete rewrite with color wheel functionality
2. **settings.html** - Added color wheel UI and custom theme management
3. **newtab.html** - Updated to use global theme system
4. **games.html** - Enhanced theme integration
5. **history.html** - Added theme system support
6. **carbon.html** - Updated theme integration

### Key Improvements

- **Unified Storage**: All files now use `carbon-theme-global` for consistency
- **Real-time Sync**: Theme changes instantly propagate across all pages
- **Custom Themes**: Users can create unlimited personalized themes
- **Better UX**: Smooth transitions and live previews
- **Backward Compatibility**: Existing themes continue to work

## Color Wheel Interface

### Design Elements

- **Color Picker**: 60px circular color input with theme-aware border
- **Live Preview**: Shows 6 key colors from the generated palette
- **Theme Name Input**: Text field for naming custom themes
- **Action Buttons**: Create and Cancel with hover effects
- **Responsive Design**: Works on both desktop and mobile devices

### Color Palette Generation

Each custom theme generates 14 distinct colors:
- **Base Colors**: base, surface, overlay
- **Text Colors**: text, muted, subtle
- **Accent Colors**: love, gold, rose, pine, foam, iris
- **Highlight Colors**: highlightLow, highlightMed, highlightHigh

## Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Future Enhancements

- [ ] Theme import/export functionality
- [ ] More color wheel options (triadic, complementary, etc.)
- [ ] Theme sharing between users
- [ ] Accessibility contrast checking
- [ ] Theme scheduling (time-based themes)

## Troubleshooting

### Theme Not Applying
1. Ensure `carbon-theme.js` is loading properly
2. Check browser console for JavaScript errors
3. Clear local storage and recreate themes

### Cross-Page Sync Issues
1. Verify all pages include `carbon-theme.js`
2. Check for popup blockers preventing message passing
3. Ensure pages are on the same origin

### Custom Themes Not Saving
1. Check browser local storage permissions
2. Verify theme names are unique
3. Ensure sufficient storage space

---

**Note**: This enhanced theme system maintains full backward compatibility with existing Carbon installations while providing powerful new customization options.