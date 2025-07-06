// Carbon Theme System
// Shared theme management for all Carbon pages

class CarbonTheme {
    constructor() {
        this.currentTheme = 'rose-pine';
        this.themes = {
            'rose-pine': {
                base: '#191724',
                surface: '#1f1d2e',
                overlay: '#26233a',
                muted: '#6e6a86',
                subtle: '#908caa',
                text: '#e0def4',
                love: '#eb6f92',
                gold: '#f6c177',
                rose: '#ebbcba',
                pine: '#31748f',
                foam: '#9ccfd8',
                iris: '#c4a7e7',
                highlightLow: '#21202e',
                highlightMed: '#403d52',
                highlightHigh: '#524f67'
            },
            'dark': {
                base: '#0f172a',
                surface: '#1e293b',
                overlay: '#334155',
                muted: '#64748b',
                subtle: '#94a3b8',
                text: '#f1f5f9',
                love: '#ef4444',
                gold: '#f59e0b',
                rose: '#f97316',
                pine: '#059669',
                foam: '#06b6d4',
                iris: '#8b5cf6',
                highlightLow: '#1e293b',
                highlightMed: '#475569',
                highlightHigh: '#64748b'
            },
            'light': {
                base: '#f8fafc',
                surface: '#e2e8f0',
                overlay: '#cbd5e1',
                muted: '#64748b',
                subtle: '#475569',
                text: '#0f172a',
                love: '#dc2626',
                gold: '#d97706',
                rose: '#ea580c',
                pine: '#047857',
                foam: '#0891b2',
                iris: '#7c3aed',
                highlightLow: '#f1f5f9',
                highlightMed: '#e2e8f0',
                highlightHigh: '#cbd5e1'
            },
            'catppuccin': {
                base: '#1e1e2e',
                surface: '#313244',
                overlay: '#45475a',
                muted: '#6c7086',
                subtle: '#9399b2',
                text: '#cdd6f4',
                love: '#f38ba8',
                gold: '#f9e2af',
                rose: '#fab387',
                pine: '#a6e3a1',
                foam: '#89dceb',
                iris: '#cba6f7',
                highlightLow: '#181825',
                highlightMed: '#313244',
                highlightHigh: '#45475a'
            },
            'nord': {
                base: '#2e3440',
                surface: '#3b4252',
                overlay: '#434c5e',
                muted: '#4c566a',
                subtle: '#d8dee9',
                text: '#eceff4',
                love: '#bf616a',
                gold: '#ebcb8b',
                rose: '#d08770',
                pine: '#a3be8c',
                foam: '#88c0d0',
                iris: '#b48ead',
                highlightLow: '#2e3440',
                highlightMed: '#434c5e',
                highlightHigh: '#4c566a'
            },
            'gruvbox': {
                base: '#282828',
                surface: '#3c3836',
                overlay: '#504945',
                muted: '#665c54',
                subtle: '#a89984',
                text: '#ebdbb2',
                love: '#fb4934',
                gold: '#fabd2f',
                rose: '#fe8019',
                pine: '#b8bb26',
                foam: '#8ec07c',
                iris: '#d3869b',
                highlightLow: '#1d2021',
                highlightMed: '#3c3836',
                highlightHigh: '#504945'
            },
            'tokyo-night': {
                base: '#1a1b26',
                surface: '#24283b',
                overlay: '#414868',
                muted: '#565f89',
                subtle: '#a9b1d6',
                text: '#c0caf5',
                love: '#f7768e',
                gold: '#e0af68',
                rose: '#ff9e64',
                pine: '#9ece6a',
                foam: '#7dcfff',
                iris: '#bb9af7',
                highlightLow: '#16161e',
                highlightMed: '#24283b',
                highlightHigh: '#414868'
            },
            'dracula': {
                base: '#282a36',
                surface: '#44475a',
                overlay: '#6272a4',
                muted: '#6272a4',
                subtle: '#f8f8f2',
                text: '#f8f8f2',
                love: '#ff5555',
                gold: '#f1fa8c',
                rose: '#ffb86c',
                pine: '#50fa7b',
                foam: '#8be9fd',
                iris: '#bd93f9',
                highlightLow: '#21222c',
                highlightMed: '#44475a',
                highlightHigh: '#6272a4'
            }
        };
        
        this.init();
    }

    init() {
        // Load saved theme
        this.currentTheme = localStorage.getItem('carbon-theme-global') || 'rose-pine';
        this.applyTheme(this.currentTheme);
        
        // Listen for theme changes
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'carbon-theme-change') {
                this.applyTheme(event.data.theme);
            }
        });
        
        // Listen for storage changes (cross-tab theme sync)
        window.addEventListener('storage', (event) => {
            if (event.key === 'carbon-theme-global' && event.newValue) {
                this.applyTheme(event.newValue);
            }
        });
    }

    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme ${themeName} not found, falling back to rose-pine`);
            themeName = 'rose-pine';
        }

        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', themeName);
        
        // Update Tailwind config if it exists
        if (window.tailwind && window.tailwind.config) {
            this.updateTailwindConfig(theme);
        }
        
        // Update CSS custom properties
        this.updateCSSProperties(theme);
        
        // Apply theme-specific styles
        this.applyThemeStyles(theme);
        
        // Store theme globally
        localStorage.setItem('carbon-theme-global', themeName);
    }

    updateTailwindConfig(theme) {
        try {
            // Update Tailwind config with new theme colors
            if (window.tailwind && window.tailwind.config) {
                const config = window.tailwind.config;
                if (config.theme && config.theme.extend && config.theme.extend.colors) {
                    // Map theme colors to existing color names
                    const colorMap = {
                        'rp-base': theme.base,
                        'rp-surface': theme.surface,
                        'rp-overlay': theme.overlay,
                        'rp-muted': theme.muted,
                        'rp-subtle': theme.subtle,
                        'rp-text': theme.text,
                        'rp-love': theme.love,
                        'rp-gold': theme.gold,
                        'rp-rose': theme.rose,
                        'rp-pine': theme.pine,
                        'rp-foam': theme.foam,
                        'rp-iris': theme.iris,
                        'rp-highlight-low': theme.highlightLow,
                        'rp-highlight-med': theme.highlightMed,
                        'rp-highlight-high': theme.highlightHigh,
                        // Generic mappings
                        'base': theme.base,
                        'surface': theme.surface,
                        'overlay': theme.overlay,
                        'muted': theme.muted,
                        'subtle': theme.subtle,
                        'text': theme.text,
                        'love': theme.love,
                        'gold': theme.gold,
                        'rose': theme.rose,
                        'pine': theme.pine,
                        'foam': theme.foam,
                        'iris': theme.iris,
                        'highlight-low': theme.highlightLow,
                        'highlight-med': theme.highlightMed,
                        'highlight-high': theme.highlightHigh
                    };
                    
                    Object.assign(config.theme.extend.colors, colorMap);
                }
            }
        } catch (e) {
            console.warn('Could not update Tailwind config:', e);
        }
    }

    updateCSSProperties(theme) {
        const root = document.documentElement;
        
        // Update theme CSS variables
        root.style.setProperty('--theme-base', theme.base);
        root.style.setProperty('--theme-surface', theme.surface);
        root.style.setProperty('--theme-overlay', theme.overlay);
        root.style.setProperty('--theme-muted', theme.muted);
        root.style.setProperty('--theme-subtle', theme.subtle);
        root.style.setProperty('--theme-text', theme.text);
        root.style.setProperty('--theme-love', theme.love);
        root.style.setProperty('--theme-gold', theme.gold);
        root.style.setProperty('--theme-rose', theme.rose);
        root.style.setProperty('--theme-pine', theme.pine);
        root.style.setProperty('--theme-foam', theme.foam);
        root.style.setProperty('--theme-iris', theme.iris);
        root.style.setProperty('--theme-highlight-low', theme.highlightLow);
        root.style.setProperty('--theme-highlight-med', theme.highlightMed);
        root.style.setProperty('--theme-highlight-high', theme.highlightHigh);
        
        // Create gradient
        const gradient = `linear-gradient(135deg, ${theme.base} 0%, ${theme.surface} 50%, ${theme.overlay} 100%)`;
        root.style.setProperty('--theme-gradient', gradient);
        
        // Update old variable names for compatibility
        root.style.setProperty('--text-color', theme.text);
        root.style.setProperty('--surface-color', theme.surface);
        root.style.setProperty('--overlay-color', theme.overlay);
        root.style.setProperty('--highlight-med', theme.highlightMed);
        root.style.setProperty('--highlight-high', theme.highlightHigh);
        root.style.setProperty('--foam', theme.foam);
        root.style.setProperty('--love', theme.love);
        root.style.setProperty('--gold', theme.gold);
        root.style.setProperty('--pine', theme.pine);
        root.style.setProperty('--iris', theme.iris);
        root.style.setProperty('--muted', theme.muted);
        root.style.setProperty('--subtle', theme.subtle);
    }

    applyThemeStyles(theme) {
        // Apply dynamic background based on saved background setting
        const backgroundType = localStorage.getItem('carbon-background') || 'gradient';
        
        switch (backgroundType) {
            case 'solid':
                document.body.style.background = theme.base;
                break;
            case 'pattern':
                document.body.style.background = `${theme.base} url('data:image/svg+xml,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="1" fill="%23ffffff" fill-opacity="0.1"/></svg>')`;
                break;
            case 'particles':
                document.body.style.background = theme.base;
                // Could add particle effect here
                break;
            case 'gradient':
            default:
                document.body.style.background = `linear-gradient(135deg, ${theme.base} 0%, ${theme.surface} 50%, ${theme.overlay} 100%)`;
                break;
        }
        
        // Check for custom background
        const customBg = localStorage.getItem('carbon-custom-bg');
        if (customBg) {
            document.body.style.background = `url(${customBg}) center/cover`;
        }
        
        document.body.style.backgroundAttachment = 'fixed';
    }

    getTheme(themeName = null) {
        return this.themes[themeName || this.currentTheme];
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(themeName) {
        this.applyTheme(themeName);
    }
}

// Initialize theme system when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.carbonTheme = new CarbonTheme();
    });
} else {
    window.carbonTheme = new CarbonTheme();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarbonTheme;
}