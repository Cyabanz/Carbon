// Carbon Theme System
// Enhanced shared theme management for all Carbon pages with color wheel support

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
            },
            'cyberpunk': {
                base: '#0a0a0a',
                surface: '#1a1a2e',
                overlay: '#16213e',
                muted: '#533483',
                subtle: '#e94560',
                text: '#ffffff',
                love: '#ff0080',
                gold: '#ffff00',
                rose: '#ff8c00',
                pine: '#00ff80',
                foam: '#00ffff',
                iris: '#8000ff',
                highlightLow: '#0f0f23',
                highlightMed: '#1a1a2e',
                highlightHigh: '#16213e'
            },
            'sunset': {
                base: '#2d1b69',
                surface: '#11052c',
                overlay: '#3c096c',
                muted: '#5a189a',
                subtle: '#7b2cbf',
                text: '#ffffff',
                love: '#f72585',
                gold: '#f9844a',
                rose: '#ff9500',
                pine: '#06ffa5',
                foam: '#40e0d0',
                iris: '#c77dff',
                highlightLow: '#240046',
                highlightMed: '#3c096c',
                highlightHigh: '#5a189a'
            },
            'ocean': {
                base: '#001845',
                surface: '#003d82',
                overlay: '#0353a4',
                muted: '#457b9d',
                subtle: '#f1faee',
                text: '#ffffff',
                love: '#e63946',
                gold: '#f77f00',
                rose: '#fcbf49',
                pine: '#38a3a5',
                foam: '#57cc99',
                iris: '#80b918',
                highlightLow: '#001233',
                highlightMed: '#023047',
                highlightHigh: '#219ebc'
            },
            'forest': {
                base: '#1b4332',
                surface: '#2d5016',
                overlay: '#3e7317',
                muted: '#4c956c',
                subtle: '#a7c957',
                text: '#ffffff',
                love: '#f77f00',
                gold: '#fcbf49',
                rose: '#eae2b7',
                pine: '#2f9b69',
                foam: '#4c956c',
                iris: '#a7c957',
                highlightLow: '#081c15',
                highlightMed: '#1b4332',
                highlightHigh: '#2d5016'
            },
            'neon': {
                base: '#0c0c0c',
                surface: '#1a1a1a',
                overlay: '#2d2d2d',
                muted: '#4a4a4a',
                subtle: '#ffffff',
                text: '#ffffff',
                love: '#ff073a',
                gold: '#ffff00',
                rose: '#ff6b35',
                pine: '#39ff14',
                foam: '#00ffff',
                iris: '#bf40bf',
                highlightLow: '#0f0f0f',
                highlightMed: '#1f1f1f',
                highlightHigh: '#2f2f2f'
            },
            'vintage': {
                base: '#2c1810',
                surface: '#3e2723',
                overlay: '#5d4037',
                muted: '#795548',
                subtle: '#bcaaa4',
                text: '#efebe9',
                love: '#d32f2f',
                gold: '#f57c00',
                rose: '#ff5722',
                pine: '#388e3c',
                foam: '#0097a7',
                iris: '#7b1fa2',
                highlightLow: '#1e0e08',
                highlightMed: '#3e2723',
                highlightHigh: '#5d4037'
            },
            'midnight': {
                base: '#0d1117',
                surface: '#161b22',
                overlay: '#21262d',
                muted: '#484f58',
                subtle: '#b1bac4',
                text: '#f0f6fc',
                love: '#f85149',
                gold: '#d29922',
                rose: '#ff8700',
                pine: '#56d364',
                foam: '#79c0ff',
                iris: '#a5a5ff',
                highlightLow: '#0d1117',
                highlightMed: '#161b22',
                highlightHigh: '#21262d'
            },
            'aurora': {
                base: '#2e1065',
                surface: '#3730a3',
                overlay: '#4338ca',
                muted: '#6366f1',
                subtle: '#c7d2fe',
                text: '#ffffff',
                love: '#f43f5e',
                gold: '#eab308',
                rose: '#f97316',
                pine: '#22c55e',
                foam: '#06b6d4',
                iris: '#8b5cf6',
                highlightLow: '#1e1b4b',
                highlightMed: '#312e81',
                highlightHigh: '#3730a3'
            },
            'cherry-blossom': {
                base: '#4a1c40',
                surface: '#6b2c5c',
                overlay: '#8b3a5c',
                muted: '#a04668',
                subtle: '#d4a5a5',
                text: '#ffffff',
                love: '#ff6b9d',
                gold: '#ffb347',
                rose: '#ffcccb',
                pine: '#90ee90',
                foam: '#add8e6',
                iris: '#dda0dd',
                highlightLow: '#2c1a2b',
                highlightMed: '#4a1c40',
                highlightHigh: '#6b2c5c'
            }
        };
        
        this.customThemes = {};
        this.loadCustomThemes();
        this.init();
    }

    init() {
        // Load custom themes FIRST before applying any theme
        this.loadCustomThemes();
        
        // Load saved theme with improved localStorage key
        this.currentTheme = localStorage.getItem('carbon-theme-global') || 'rose-pine';
        
        // Small delay to ensure custom themes are loaded
        setTimeout(() => {
            this.applyTheme(this.currentTheme);
        }, 50);
        
        // Listen for Firebase auth state changes to sync themes
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    // Load themes from Firebase when user signs in
                    this.loadThemesFromFirebase();
                }
            });
        }
        
        // Listen for theme changes from other windows/tabs
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
            // Also listen for custom theme changes
            if (event.key === 'carbon-custom-themes' && event.newValue) {
                this.loadCustomThemes();
                // Re-apply current theme in case it's a custom theme that was updated
                setTimeout(() => this.applyTheme(this.currentTheme), 50);
            }
        });
    }

    loadCustomThemes() {
        const saved = localStorage.getItem('carbon-custom-themes');
        if (saved) {
            try {
                this.customThemes = JSON.parse(saved);
            } catch (e) {
                console.warn('Could not load custom themes:', e);
                this.customThemes = {};
            }
        }
    }

    saveCustomThemes() {
        localStorage.setItem('carbon-custom-themes', JSON.stringify(this.customThemes));
    }

    // Color wheel functionality
    createCustomTheme(name, baseColor) {
        const theme = this.generateThemeFromColor(baseColor);
        this.customThemes[name] = theme;
        this.saveCustomThemes();
        
        // Immediately apply the new theme
        this.applyTheme(name);
        
        // Broadcast the theme change
        this.broadcastThemeChange(name, theme);
        
        // Sync to Firebase if available
        this.syncThemesToFirebase();
        
        return theme;
    }
    
    async syncThemesToFirebase() {
        // Check if Firebase is available and user is authenticated
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
            try {
                const user = firebase.auth().currentUser;
                const db = firebase.firestore();
                
                await db.collection('users').doc(user.uid).set({
                    customThemes: this.customThemes,
                    lastThemeSync: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                
                console.log('Custom themes synced to Firebase');
            } catch (error) {
                console.error('Error syncing themes to Firebase:', error);
            }
        }
    }
    
    async loadThemesFromFirebase() {
        // Check if Firebase is available and user is authenticated
        if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
            try {
                const user = firebase.auth().currentUser;
                const db = firebase.firestore();
                
                const doc = await db.collection('users').doc(user.uid).get();
                if (doc.exists && doc.data().customThemes) {
                    this.customThemes = doc.data().customThemes;
                    this.saveCustomThemes();
                    console.log('Custom themes loaded from Firebase');
                }
            } catch (error) {
                console.error('Error loading themes from Firebase:', error);
            }
        }
    }

    generateThemeFromColor(hexColor) {
        const hsl = this.hexToHsl(hexColor);
        const isDark = hsl.l < 0.5;
        
        // Generate a complete theme palette from the base color using advanced color theory
        const theme = {
            base: this.adjustColor(hexColor, isDark ? 0 : -0.4, isDark ? 0 : -0.1),
            surface: this.adjustColor(hexColor, isDark ? 0.05 : -0.35, isDark ? 0.05 : -0.08),
            overlay: this.adjustColor(hexColor, isDark ? 0.1 : -0.25, isDark ? 0.1 : -0.05),
            muted: this.adjustColor(hexColor, isDark ? 0.15 : -0.15, isDark ? 0.2 : 0.1),
            subtle: this.adjustColor(hexColor, isDark ? 0.25 : -0.05, isDark ? 0.35 : 0.2),
            text: isDark ? '#ffffff' : '#000000',
            // Use complementary and triadic color schemes for better harmony
            love: this.generateHarmoniousColor(hexColor, 'complementary', 0.1, 0.1), // Complementary
            gold: this.generateHarmoniousColor(hexColor, 'triadic', 0.2, 0.15), // Triadic
            rose: this.generateHarmoniousColor(hexColor, 'analogous', 0.25, 0.2), // Analogous
            pine: this.generateHarmoniousColor(hexColor, 'split-complementary', 0.1, 0.05), // Split-complementary
            foam: this.generateHarmoniousColor(hexColor, 'tetradic', 0.3, 0.25), // Tetradic
            iris: this.generateHarmoniousColor(hexColor, 'monochromatic', 0.2, 0.3), // Monochromatic
            highlightLow: this.adjustColor(hexColor, isDark ? 0.02 : -0.38, isDark ? 0.02 : -0.12),
            highlightMed: this.adjustColor(hexColor, isDark ? 0.08 : -0.2, isDark ? 0.15 : 0.05),
            highlightHigh: this.adjustColor(hexColor, isDark ? 0.15 : -0.1, isDark ? 0.25 : 0.15)
        };
        
        return theme;
    }
    
    generateHarmoniousColor(baseColor, harmonyType, lightness = 0, saturation = 0) {
        const hsl = this.hexToHsl(baseColor);
        let newHue = hsl.h;
        
        switch (harmonyType) {
            case 'complementary':
                newHue = (hsl.h + 0.5) % 1;
                break;
            case 'triadic':
                newHue = (hsl.h + 0.333) % 1;
                break;
            case 'analogous':
                newHue = (hsl.h + 0.083) % 1; // 30 degrees
                break;
            case 'split-complementary':
                newHue = (hsl.h + 0.417) % 1; // 150 degrees
                break;
            case 'tetradic':
                newHue = (hsl.h + 0.25) % 1; // 90 degrees
                break;
            case 'monochromatic':
                newHue = hsl.h; // Same hue, different lightness/saturation
                break;
            default:
                newHue = hsl.h;
        }
        
        const newSaturation = Math.max(0, Math.min(1, hsl.s + saturation));
        const newLightness = Math.max(0, Math.min(1, hsl.l + lightness));
        
        return this.hslToHex(newHue, newSaturation, newLightness);
    }

    hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h, s, l };
    }

    hslToHex(h, s, l) {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;
        if (h < 1/6) {
            r = c; g = x; b = 0;
        } else if (h < 2/6) {
            r = x; g = c; b = 0;
        } else if (h < 3/6) {
            r = 0; g = c; b = x;
        } else if (h < 4/6) {
            r = 0; g = x; b = c;
        } else if (h < 5/6) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    adjustColor(hex, lightness = 0, saturation = 0, hueShift = 0) {
        const hsl = this.hexToHsl(hex);
        hsl.h = (hsl.h + hueShift / 360) % 1;
        if (hsl.h < 0) hsl.h += 1;
        hsl.s = Math.max(0, Math.min(1, hsl.s + saturation));
        hsl.l = Math.max(0, Math.min(1, hsl.l + lightness));
        return this.hslToHex(hsl.h, hsl.s, hsl.l);
    }

    applyTheme(themeName) {
        // Check if it's a custom theme
        let theme;
        if (this.customThemes[themeName]) {
            theme = this.customThemes[themeName];
        } else if (this.themes[themeName]) {
            theme = this.themes[themeName];
        } else {
            console.warn(`Theme ${themeName} not found, falling back to rose-pine`);
            themeName = 'rose-pine';
            theme = this.themes[themeName];
        }

        this.currentTheme = themeName;
        
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
        
        // Broadcast theme change to other windows
        this.broadcastThemeChange(themeName, theme);
    }

    broadcastThemeChange(themeName, theme) {
        // Broadcast to all windows
        const message = {
            type: 'carbon-theme-change',
            theme: themeName,
            themeData: theme
        };

        // Send to parent window
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage(message, '*');
            }
        } catch (e) {
            console.log('Could not message parent:', e);
        }

        // Send to opener window
        try {
            if (window.opener && window.opener !== window) {
                window.opener.postMessage(message, '*');
            }
        } catch (e) {
            console.log('Could not message opener:', e);
        }

        // Trigger storage event for same-origin tabs
        try {
            localStorage.setItem('carbon-theme-broadcast', JSON.stringify({
                timestamp: Date.now(),
                theme: themeName,
                themeData: theme
            }));
        } catch (e) {
            console.log('Could not trigger storage event:', e);
        }
    }

    updateTailwindConfig(theme) {
        try {
            if (window.tailwind && window.tailwind.config) {
                const config = window.tailwind.config;
                if (config.theme && config.theme.extend && config.theme.extend.colors) {
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
        const backgroundType = localStorage.getItem('carbon-background-global') || 'gradient';
        
        switch (backgroundType) {
            case 'solid':
                document.body.style.background = theme.base;
                break;
            case 'pattern':
                document.body.style.background = `${theme.base} url('data:image/svg+xml,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="1" fill="%23ffffff" fill-opacity="0.1"/></svg>')`;
                break;
            case 'particles':
                document.body.style.background = theme.base;
                break;
            case 'gradient':
            default:
                document.body.style.background = `linear-gradient(135deg, ${theme.base} 0%, ${theme.surface} 50%, ${theme.overlay} 100%)`;
                break;
        }
        
        // Check for custom background
        const customBg = localStorage.getItem('carbon-custom-bg-global');
        if (customBg) {
            document.body.style.background = `url(${customBg}) center/cover`;
        }
        
        document.body.style.backgroundAttachment = 'fixed';
    }

    getTheme(themeName = null) {
        const name = themeName || this.currentTheme;
        return this.customThemes[name] || this.themes[name];
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(themeName) {
        this.applyTheme(themeName);
    }

    getAllThemes() {
        return { ...this.themes, ...this.customThemes };
    }

    deleteCustomTheme(themeName) {
        if (this.customThemes[themeName]) {
            delete this.customThemes[themeName];
            this.saveCustomThemes();
            
            // If currently using this theme, switch to default
            if (this.currentTheme === themeName) {
                this.applyTheme('rose-pine');
            }
            
            // Sync to Firebase if available
            this.syncThemesToFirebase();
        }
    }

    // Color wheel UI creation
    createColorWheel(container, callback) {
        const wheel = document.createElement('div');
        wheel.className = 'color-wheel-container';
        wheel.innerHTML = `
            <div class="color-wheel-header">
                <h3>Create Custom Theme</h3>
                <p>Choose a base color to generate your theme</p>
            </div>
            <div class="color-wheel-content">
                <div class="color-wheel-input">
                    <input type="color" id="color-wheel-picker" value="#9ccfd8">
                    <label for="color-wheel-picker">Base Color</label>
                </div>
                <div class="theme-preview-container">
                    <div class="theme-preview-item">
                        <div class="preview-colors">
                            <div class="color-swatch" data-color="base"></div>
                            <div class="color-swatch" data-color="surface"></div>
                            <div class="color-swatch" data-color="overlay"></div>
                            <div class="color-swatch" data-color="foam"></div>
                            <div class="color-swatch" data-color="iris"></div>
                            <div class="color-swatch" data-color="love"></div>
                        </div>
                        <div class="preview-text">Custom Theme Preview</div>
                    </div>
                </div>
                <div class="color-wheel-actions">
                    <input type="text" id="theme-name-input" placeholder="Enter theme name..." maxlength="20">
                    <button id="create-theme-btn">Create Theme</button>
                    <button id="cancel-theme-btn">Cancel</button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .color-wheel-container {
                background: var(--theme-surface);
                border: 2px solid var(--theme-overlay);
                border-radius: 1rem;
                padding: 2rem;
                max-width: 400px;
                margin: 0 auto;
            }
            .color-wheel-header h3 {
                color: var(--theme-text);
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
            .color-wheel-header p {
                color: var(--theme-subtle);
                font-size: 0.9rem;
                margin-bottom: 1.5rem;
            }
            .color-wheel-input {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            .color-wheel-input input[type="color"] {
                width: 60px;
                height: 60px;
                border: 3px solid var(--theme-overlay);
                border-radius: 50%;
                cursor: pointer;
                background: none;
            }
            .color-wheel-input label {
                color: var(--theme-text);
                font-weight: 600;
            }
            .theme-preview-container {
                margin-bottom: 1.5rem;
            }
            .theme-preview-item {
                background: var(--theme-base);
                border: 1px solid var(--theme-overlay);
                border-radius: 0.5rem;
                padding: 1rem;
                text-align: center;
            }
            .preview-colors {
                display: flex;
                justify-content: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            .color-swatch {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 2px solid var(--theme-overlay);
            }
            .preview-text {
                color: var(--theme-text);
                font-weight: 600;
            }
            .color-wheel-actions {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .color-wheel-actions input {
                background: var(--theme-overlay);
                border: 1px solid var(--theme-highlight-med);
                border-radius: 0.5rem;
                padding: 0.75rem;
                color: var(--theme-text);
                font-size: 0.9rem;
            }
            .color-wheel-actions input:focus {
                outline: none;
                border-color: var(--theme-foam);
            }
            .color-wheel-actions button {
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            #create-theme-btn {
                background: var(--theme-foam);
                color: var(--theme-base);
                border: none;
            }
            #create-theme-btn:hover {
                background: var(--theme-pine);
                transform: translateY(-1px);
            }
            #cancel-theme-btn {
                background: var(--theme-overlay);
                color: var(--theme-text);
                border: 1px solid var(--theme-highlight-med);
            }
            #cancel-theme-btn:hover {
                background: var(--theme-highlight-med);
            }
        `;

        if (!document.head.querySelector('#color-wheel-styles')) {
            style.id = 'color-wheel-styles';
            document.head.appendChild(style);
        }

        container.appendChild(wheel);

        // Set up event listeners
        const colorPicker = wheel.querySelector('#color-wheel-picker');
        const themeNameInput = wheel.querySelector('#theme-name-input');
        const createBtn = wheel.querySelector('#create-theme-btn');
        const cancelBtn = wheel.querySelector('#cancel-theme-btn');
        const swatches = wheel.querySelectorAll('.color-swatch');

        const updatePreview = () => {
            const color = colorPicker.value;
            const theme = this.generateThemeFromColor(color);
            
            swatches.forEach(swatch => {
                const colorType = swatch.dataset.color;
                swatch.style.backgroundColor = theme[colorType];
            });

            // Update preview background
            const previewItem = wheel.querySelector('.theme-preview-item');
            previewItem.style.background = `linear-gradient(135deg, ${theme.base} 0%, ${theme.surface} 50%, ${theme.overlay} 100%)`;
        };

        colorPicker.addEventListener('input', updatePreview);
        
        createBtn.addEventListener('click', () => {
            const name = themeNameInput.value.trim();
            if (!name) {
                alert('Please enter a theme name');
                return;
            }
            
            if (this.themes[name] || this.customThemes[name]) {
                if (!confirm(`Theme "${name}" already exists. Replace it?`)) {
                    return;
                }
            }

            const theme = this.createCustomTheme(name, colorPicker.value);
            this.applyTheme(name);
            
            if (callback) callback(name, theme);
            container.removeChild(wheel);
        });

        cancelBtn.addEventListener('click', () => {
            container.removeChild(wheel);
        });

        // Initial preview update
        updatePreview();
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
