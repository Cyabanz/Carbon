# Enhanced Carbon Usage Guide

## 🚀 Getting Started with Enhanced Features

### Firebase Authentication Setup
1. Open proxy.html in your browser
2. The system will automatically attempt anonymous authentication
3. Once authenticated, all your tab data will sync across devices
4. Look for the ✅ authentication confirmation in the console

### First Time Setup
```javascript
// Check if user is authenticated
console.log('User authenticated:', currentUser?.uid);

// Test Firebase sync
reloadSettings(); // Manually reload settings
testTabCloaking(); // Test tab cloaking functionality
testPanicKey(); // Test panic key setup
```

## 📋 Tab Management Examples

### Creating and Managing Tab Groups
```javascript
// Create a new tab group
const projectGroup = createTabGroup("Project Alpha", "#3b82f6");

// Assign tabs to groups
assignTabToGroup("tab-123", projectGroup.id);

// Batch assign multiple tabs
tabs.filter(tab => tab.url.includes('github.com'))
    .forEach(tab => assignTabToGroup(tab.id, projectGroup.id));
```

### Custom Tab Titles and Notes
```javascript
// Set custom title
renameTab("tab-123", "Important Research");

// Add notes to tab
updateTabNotes("tab-123", "Meeting notes for Q4 planning");

// Set tab color for visual organization
setTabColor("tab-123", "#22c55e");
```

### Advanced Tab Operations
```javascript
// Duplicate tab with all settings
duplicateTab("tab-123");

// Lock important tabs
toggleTabLock("tab-123");

// Pin frequently used tabs
togglePinTab("tab-123");

// Close all tabs except current (respects locked tabs)
closeOtherTabs(activeTab);
```

## 🎨 Theme Management Examples

### Applying Themes
```javascript
// Apply a built-in theme
window.carbonTheme.setTheme('cyberpunk');

// Preview a theme for 3 seconds
window.carbonTheme.previewTheme('sunset', 3000);

// Get current theme data
const currentTheme = window.carbonTheme.getCurrentTheme();
```

### Creating Custom Themes
```javascript
// Create theme from color
const customTheme = window.carbonTheme.createCustomTheme(
    'MyTheme', 
    '#9ccfd8'
);

// Generate complementary theme
const complementary = window.carbonTheme.generateComplementaryTheme('rose-pine');

// Generate analogous theme (30 degree shift)
const analogous = window.carbonTheme.generateAnalogousTheme('tokyo-night', 30);
```

### Theme Import/Export
```javascript
// Export current theme
window.carbonTheme.exportTheme('rose-pine');

// Export all custom themes
window.carbonTheme.exportAllCustomThemes();

// Import theme from file
const fileInput = document.getElementById('theme-file');
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    try {
        const themeName = await window.carbonTheme.importTheme(file);
        console.log(`Imported theme: ${themeName}`);
    } catch (error) {
        console.error('Import failed:', error.message);
    }
});
```

## 🔄 Firebase Sync Examples

### Manual Sync Operations
```javascript
// Force sync all data to Firebase
syncAllDataToFirebase();

// Load data from Firebase
loadTabDataFromFirebase();

// Check sync status
console.log('Sync in progress:', syncInProgress);
console.log('Last sync time:', new Date(lastSyncTime));
```

### Backup and Restore
```javascript
// Create local backup
createTabsBackup();

// Restore from backup file
const fileInput = document.getElementById('backup-file');
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    restoreTabsFromBackup(file);
});

// Export tab history for specific tab
exportTabHistory("tab-123");
```

## 🔧 Advanced Configuration

### Custom Sync Settings
```javascript
// Adjust sync frequency (default: 30 seconds)
setInterval(() => {
    if (currentUser) {
        syncAllDataToFirebase();
    }
}, 15000); // Sync every 15 seconds

// Custom sync filters
function customSync() {
    const filteredTabs = tabs.filter(tab => !tab.url.startsWith('carbon://'));
    // Sync only non-internal tabs
}
```

### Theme Customization
```javascript
// Set custom background type
localStorage.setItem('carbon-background-global', 'particles');
window.carbonTheme.applyTheme(window.carbonTheme.getCurrentTheme());

// Custom background image
localStorage.setItem('carbon-custom-bg-global', 'https://example.com/bg.jpg');
window.carbonTheme.applyTheme(window.carbonTheme.getCurrentTheme());
```

## 🎯 Best Practices

### Tab Organization
1. **Use Groups**: Organize tabs by project, category, or priority
2. **Custom Titles**: Use meaningful names for easy identification
3. **Color Coding**: Assign colors based on importance or category
4. **Pin Important Tabs**: Keep frequently used tabs always visible
5. **Lock Critical Tabs**: Prevent accidental closure of important work

### Theme Management
1. **Export Themes**: Backup your custom themes regularly
2. **Test Accessibility**: Ensure good contrast ratios for readability
3. **Preview Before Applying**: Use preview feature to test themes
4. **Organize Custom Themes**: Use descriptive names for custom themes

### Sync Optimization
1. **Stable Connection**: Ensure stable internet for reliable sync
2. **Regular Backups**: Create manual backups for important sessions
3. **Monitor Sync Status**: Check console for sync confirmations
4. **Batch Operations**: Group multiple changes to reduce sync frequency

## 🐛 Troubleshooting

### Sync Issues
```javascript
// Check authentication status
console.log('User authenticated:', !!currentUser);

// Check Firebase connection
console.log('Firebase initialized:', !!firebase.apps.length);

// Force refresh settings
loadSettingsFromFirebase();

// Clear local cache if needed
localStorage.removeItem('carbon-tabs-data');
localStorage.removeItem('carbon-custom-themes');
```

### Theme Problems
```javascript
// Reset to default theme
window.carbonTheme.applyTheme('rose-pine');

// Validate custom theme
const theme = window.carbonTheme.getTheme('custom-theme');
const validation = window.carbonTheme.validateTheme(theme);
console.log('Theme valid:', validation.valid);

// Remove problematic custom theme
window.carbonTheme.deleteCustomTheme('problematic-theme');
```

### Tab Recovery
```javascript
// Restore last session
restoreTabsFromSnapshot();

// Check for closed tabs backup
const lastTabs = localStorage.getItem('last-tabs');
if (lastTabs) {
    console.log('Closed tabs available for restore');
}

// Force reload tab data
loadTabsData();
```

## 🎨 UI Customization Examples

### Vertical Tabs Setup
```javascript
// Enable vertical tabs
toggleVerticalTabs();

// Save preference
localStorage.setItem("vertical-tabs-mode", "true");

// Notify iframes of layout change
notifyIframesVerticalTabsState();
```

### Tab Bar Customization
```javascript
// Hide tab bar
toggleTabBarVisibility();

// Custom tab bar styling
document.getElementById('tabs-bar').style.background = '#custom-color';

// Adjust tab spacing
document.querySelectorAll('.tab').forEach(tab => {
    tab.style.margin = '2px';
});
```

## 📊 Monitoring and Analytics

### Performance Tracking
```javascript
// Monitor sync performance
const syncStart = Date.now();
syncAllDataToFirebase().then(() => {
    console.log(`Sync completed in ${Date.now() - syncStart}ms`);
});

// Track tab operations
console.log(`Total tabs: ${tabs.length}`);
console.log(`Pinned tabs: ${tabs.filter(t => t.pinned).length}`);
console.log(`Locked tabs: ${tabs.filter(t => t.locked).length}`);
```

### Usage Statistics
```javascript
// Tab group usage
const groupStats = tabGroups.map(group => ({
    name: group.name,
    tabCount: tabs.filter(t => t.groupId === group.id).length
}));

// Theme usage tracking
const themeUsage = {
    current: window.carbonTheme.getCurrentTheme(),
    customCount: Object.keys(window.carbonTheme.customThemes).length,
    totalAvailable: Object.keys(window.carbonTheme.getAllThemes()).length
};
```

## 🔒 Security Best Practices

### Data Protection
```javascript
// Verify user isolation
console.log('User ID:', currentUser?.uid);

// Check data encryption (Firebase handles this automatically)
console.log('Data encrypted in transit and at rest');

// Monitor authentication state
auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? 'Logged in' : 'Logged out');
});
```

### Privacy Controls
```javascript
// Disable sync for sensitive tabs
function disableSyncForTab(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
        tab.noSync = true; // Custom flag to skip sync
    }
}

// Clear all synced data
async function clearAllSyncedData() {
    if (currentUser) {
        await db.collection('users').doc(currentUser.uid).delete();
        console.log('All synced data cleared');
    }
}
```

## 🌟 Pro Tips

### Productivity Enhancements
1. **Keyboard Shortcuts**: Master the keyboard shortcuts for faster navigation
2. **Tab Templates**: Create tab group templates for common workflows
3. **Theme Switching**: Use different themes for different types of work
4. **Backup Schedules**: Set up regular backup exports
5. **Sync Monitoring**: Keep an eye on sync status for important changes

### Advanced Workflows
1. **Project Isolation**: Use separate tab groups for different projects
2. **Context Switching**: Use colors and titles to quickly identify tab purposes
3. **Research Organization**: Use notes and groups for research sessions
4. **Cross-Device Continuity**: Take advantage of real-time sync for seamless device switching

This enhanced Carbon experience provides enterprise-level tab management with modern sync capabilities while maintaining the sleek, user-friendly interface that Carbon is known for.