// Carbon Theme System - Enhanced Version
// Enhanced shared theme management for all Carbon pages with color wheel support

class CarbonTheme {
    constructor() {
        this.currentTheme = 'rose-pine';
        this.themes = {
            // Enhanced Rose Pine theme
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
            // Enhanced Dark theme
            'dark': {
                base: '#0a0a0a',
                surface: '#1a1a1a',
                overlay: '#2a2a2a',
                muted: '#6b7280',
                subtle: '#9ca3af',
                text: '#f9fafb',
                love: '#ef4444',
                gold: '#f59e0b',
                rose: '#f97316',
                pine: '#10b981',
                foam: '#06b6d4',
                iris: '#8b5cf6',
                highlightLow: '#111111',
                highlightMed: '#333333',
                highlightHigh: '#555555'
            },
            // Enhanced Light theme
            'light': {
                base: '#fafafa',
                surface: '#f5f5f5',
                overlay: '#e5e5e5',
                muted: '#71717a',
                subtle: '#52525b',
                text: '#18181b',
                love: '#dc2626',
                gold: '#d97706',
                rose: '#ea580c',
                pine: '#16a34a',
                foam: '#0891b2',
                iris: '#7c3aed',
                highlightLow: '#f8f8f8',
                highlightMed: '#eeeeee',
                highlightHigh: '#e0e0e0'
            },
            // Enhanced Catppuccin theme
            'catppuccin': {
                base: '#1e1e2e',
                surface: '#313244',
                overlay: '#45475a',
                muted: '#6c7086',
                subtle: '#a6adc8',
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
            // Enhanced Nord theme
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
            // Enhanced Gruvbox theme
            'gruvbox': {
                base: '#282828',
                surface: '#3c3836',
                overlay: '#504945',
                muted: '#665c54',
                subtle: '#bdae93',
                text: '#fbf1c7',
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
            // Enhanced Tokyo Night theme
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
            // Enhanced Dracula theme
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
            // NEW: Solarized Dark theme
            'solarized-dark': {
                base: '#002b36',
                surface: '#073642',
                overlay: '#586e75',
                muted: '#657b83',
                subtle: '#839496',
                text: '#fdf6e3',
                love: '#dc322f',
                gold: '#b58900',
                rose: '#cb4b16',
                pine: '#859900',
                foam: '#2aa198',
                iris: '#6c71c4',
                highlightLow: '#002b36',
                highlightMed: '#073642',
                highlightHigh: '#586e75'
            },
            // NEW: Solarized Light theme
            'solarized-light': {
                base: '#fdf6e3',
                surface: '#eee8d5',
                overlay: '#93a1a1',
                muted: '#839496',
                subtle: '#657b83',
                text: '#002b36',
                love: '#dc322f',
                gold: '#b58900',
                rose: '#cb4b16',
                pine: '#859900',
                foam: '#2aa198',
                iris: '#6c71c4',
                highlightLow: '#fdf6e3',
                highlightMed: '#eee8d5',
                highlightHigh: '#93a1a1'
            },
            // NEW: Monokai theme
            'monokai': {
                base: '#272822',
                surface: '#383830',
                overlay: '#49483e',
                muted: '#75715e',
                subtle: '#a59f85',
                text: '#f8f8f2',
                love: '#f92672',
                gold: '#f4bf75',
                rose: '#fd971f',
                pine: '#a6e22e',
                foam: '#66d9ef',
                iris: '#ae81ff',
                highlightLow: '#1e1f1c',
                highlightMed: '#383830',
                highlightHigh: '#49483e'
            },
            // NEW: One Dark theme
            'one-dark': {
                base: '#1e2127',
                surface: '#282c34',
                overlay: '#3e4451',
                muted: '#5c6370',
                subtle: '#abb2bf',
                text: '#abb2bf',
                love: '#e06c75',
                gold: '#d19a66',
                rose: '#e5c07b',
                pine: '#98c379',
                foam: '#56b6c2',
                iris: '#c678dd',
                highlightLow: '#1e2127',
                highlightMed: '#282c34',
                highlightHigh: '#3e4451'
            },
            // NEW: Cyberpunk theme
            'cyberpunk': {
                base: '#0a0a0a',
                surface: '#1a1a2e',
                overlay: '#16213e',
                muted: '#0f3460',
                subtle: '#e94560',
                text: '#00d4ff',
                love: '#ff073a',
                gold: '#ffb700',
                rose: '#ff6b35',
                pine: '#39ff14',
                foam: '#00d4ff',
                iris: '#bf00ff',
                highlightLow: '#0a0a0a',
                highlightMed: '#1a1a2e',
                highlightHigh: '#16213e'
            },
            // NEW: Sunset theme
            'sunset': {
                base: '#2d1b69',
                surface: '#11235a',
                overlay: '#0b2545',
                muted: '#8b5a3c',
                subtle: '#f18867',
                text: '#ffeaa7',
                love: '#ff7675',
                gold: '#fdcb6e',
                rose: '#e17055',
                pine: '#00b894',
                foam: '#74b9ff',
                iris: '#a29bfe',
                highlightLow: '#2d1b69',
                highlightMed: '#11235a',
                highlightHigh: '#0b2545'
            },
            // NEW: Forest theme
            'forest': {
                base: '#1e2124',
                surface: '#2f3136',
                overlay: '#36393f',
                muted: '#4f545c',
                subtle: '#b9bbbe',
                text: '#dcddde',
                love: '#ed4245',
                gold: '#faa61a',
                rose: '#f57c00',
                pine: '#57f287',
                foam: '#5865f2',
                iris: '#9c59b6',
                highlightLow: '#1e2124',
                highlightMed: '#2f3136',
                highlightHigh: '#36393f'
            },
            // NEW: Ocean theme
            'ocean': {
                base: '#0f1419',
                surface: '#1f2937',
                overlay: '#374151',
                muted: '#6b7280',
                subtle: '#9ca3af',
                text: '#f9fafb',
                love: '#ef4444',
                gold: '#f59e0b',
                rose: '#f97316',
                pine: '#10b981',
                foam: '#06b6d4',
                iris: '#8b5cf6',
                highlightLow: '#0f1419',
                highlightMed: '#1f2937',
                highlightHigh: '#374151'
            },
            // NEW: Retro theme
            'retro': {
                base: '#2e2e2e',
                surface: '#3e3e3e',
                overlay: '#4e4e4e',
                muted: '#777777',
                subtle: '#cccccc',
                text: '#ffffff',
                love: '#ff6b6b',
                gold: '#ffd93d',
                rose: '#ff8e53',
                pine: '#6bcf7f',
                foam: '#4ecdc4',
                iris: '#a8e6cf',
                highlightLow: '#2e2e2e',
                highlightMed: '#3e3e3e',
                highlightHigh: '#4e4e4e'
            },
            // NEW: Neon theme
            'neon': {
                base: '#0d0d0d',
                surface: '#1a1a1a',
                overlay: '#262626',
                muted: '#525252',
                subtle: '#a3a3a3',
                text: '#ffffff',
                love: '#ff0080',
                gold: '#ffff00',
                rose: '#ff8000',
                pine: '#00ff80',
                foam: '#0080ff',
                iris: '#8000ff',
                highlightLow: '#0d0d0d',
                highlightMed: '#1a1a1a',
                highlightHigh: '#262626'
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
        
        return theme;
    }

    generateThemeFromColor(hexColor) {
        const hsl = this.hexToHsl(hexColor);
        const isDark = hsl.l < 0.5;
        
        // Generate a complete theme palette from the base color
        const theme = {
            base: this.adjustColor(hexColor, isDark ? 0 : -0.4, isDark ? 0 : -0.1),
            surface: this.adjustColor(hexColor, isDark ? 0.05 : -0.35, isDark ? 0.05 : -0.08),
            overlay: this.adjustColor(hexColor, isDark ? 0.1 : -0.25, isDark ? 0.1 : -0.05),
            muted: this.adjustColor(hexColor, isDark ? 0.15 : -0.15, isDark ? 0.2 : 0.1),
            subtle: this.adjustColor(hexColor, isDark ? 0.25 : -0.05, isDark ? 0.35 : 0.2),
            text: isDark ? '#ffffff' : '#000000',
            love: this.adjustColor(hexColor, 0.3, 0.1, 15), // Shift hue slightly
            gold: this.adjustColor(hexColor, 0.2, 0.15, 45),
            rose: this.adjustColor(hexColor, 0.25, 0.2, 30),
            pine: this.adjustColor(hexColor, 0.1, 0.05, -60),
            foam: this.adjustColor(hexColor, 0.3, 0.25, -30),
            iris: this.adjustColor(hexColor, 0.2, 0.3, 60),
            highlightLow: this.adjustColor(hexColor, isDark ? 0.02 : -0.38, isDark ? 0.02 : -0.12),
            highlightMed: this.adjustColor(hexColor, isDark ? 0.08 : -0.2, isDark ? 0.15 : 0.05),
            highlightHigh: this.adjustColor(hexColor, isDark ? 0.15 : -0.1, isDark ? 0.25 : 0.15)
        };
        
        return theme;
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
                this.initParticleBackground(theme);
                break;
            case 'animated':
                this.initAnimatedBackground(theme);
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
        
        // Add theme transition effect
        document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
    }

    // Enhanced particle background
    initParticleBackground(theme) {
        if (document.getElementById('particle-canvas')) {
            document.getElementById('particle-canvas').remove();
        }
        
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                dx: (Math.random() - 0.5) * 0.5,
                dy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: theme.foam + '40',
                opacity: Math.random() * 0.5 + 0.2
            };
        }
        
        function animate() {
            ctx.fillStyle = theme.base;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.dx;
                particle.y += particle.dy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.dx = -particle.dx;
                if (particle.y < 0 || particle.y > canvas.height) particle.dy = -particle.dy;
                
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }
        
        resizeCanvas();
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
        animate();
        
        window.addEventListener('resize', resizeCanvas);
    }

    // Animated gradient background
    initAnimatedBackground(theme) {
        const style = document.createElement('style');
        style.id = 'animated-bg-style';
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            body {
                background: linear-gradient(-45deg, ${theme.base}, ${theme.surface}, ${theme.overlay}, ${theme.foam}) !important;
                background-size: 400% 400% !important;
                animation: gradientShift 15s ease infinite !important;
            }
        `;
        
        // Remove existing animated background
        const existing = document.getElementById('animated-bg-style');
        if (existing) existing.remove();
        
        document.head.appendChild(style);
    }

    // Theme import/export functionality
    exportTheme(themeName) {
        const theme = this.getTheme(themeName);
        if (!theme) {
            throw new Error(`Theme "${themeName}" not found`);
        }
        
        const exportData = {
            name: themeName,
            theme: theme,
            version: '1.0',
            exportDate: new Date().toISOString(),
            isCustom: !!this.customThemes[themeName]
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `carbon-theme-${themeName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importTheme(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    if (!importData.name || !importData.theme) {
                        reject(new Error('Invalid theme file format'));
                        return;
                    }
                    
                    // Validate theme structure
                    const requiredKeys = ['base', 'surface', 'overlay', 'text'];
                    const hasRequiredKeys = requiredKeys.every(key => importData.theme.hasOwnProperty(key));
                    
                    if (!hasRequiredKeys) {
                        reject(new Error('Invalid theme structure'));
                        return;
                    }
                    
                    // Add to custom themes
                    this.customThemes[importData.name] = importData.theme;
                    this.saveCustomThemes();
                    
                    resolve(importData.name);
                } catch (error) {
                    reject(new Error('Error parsing theme file: ' + error.message));
                }
            };
            reader.readAsText(file);
        });
    }

    // Theme preview functionality
    previewTheme(themeName, duration = 3000) {
        const originalTheme = this.currentTheme;
        this.applyTheme(themeName);
        
        // Show preview notification
        this.showNotification(`Previewing theme: ${themeName}`, duration);
        
        setTimeout(() => {
            this.applyTheme(originalTheme);
        }, duration);
    }

    // Notification system
    showNotification(message, duration = 3000) {
        // Remove existing notification
        const existing = document.getElementById('carbon-theme-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.id = 'carbon-theme-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--theme-surface);
            color: var(--theme-text);
            padding: 12px 20px;
            border-radius: 8px;
            border: 1px solid var(--theme-overlay);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Advanced color manipulation
    generateComplementaryTheme(baseTheme) {
        const theme = this.getTheme(baseTheme);
        if (!theme) return null;
        
        const complementaryTheme = {};
        
        // Generate complementary colors
        Object.keys(theme).forEach(key => {
            const color = theme[key];
            if (color.startsWith('#')) {
                const hsl = this.hexToHsl(color);
                // Shift hue by 180 degrees for complementary
                hsl.h = (hsl.h + 0.5) % 1;
                complementaryTheme[key] = this.hslToHex(hsl.h, hsl.s, hsl.l);
            } else {
                complementaryTheme[key] = color;
            }
        });
        
        return complementaryTheme;
    }

    generateAnalogousTheme(baseTheme, shift = 30) {
        const theme = this.getTheme(baseTheme);
        if (!theme) return null;
        
        const analogousTheme = {};
        
        // Generate analogous colors
        Object.keys(theme).forEach(key => {
            const color = theme[key];
            if (color.startsWith('#')) {
                const hsl = this.hexToHsl(color);
                // Shift hue by specified degrees for analogous
                hsl.h = (hsl.h + shift / 360) % 1;
                analogousTheme[key] = this.hslToHex(hsl.h, hsl.s, hsl.l);
            } else {
                analogousTheme[key] = color;
            }
        });
        
        return analogousTheme;
    }

    // Enhanced color accessibility
    getColorAccessibility(color1, color2) {
        const luminance1 = this.getLuminance(color1);
        const luminance2 = this.getLuminance(color2);
        
        const brighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        
        return (brighter + 0.05) / (darker + 0.05);
    }

    getLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        const rsRGB = rgb.r / 255;
        const gsRGB = rgb.g / 255;
        const bsRGB = rgb.b / 255;

        const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
        const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
        const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Theme validation
    validateTheme(theme) {
        const requiredKeys = [
            'base', 'surface', 'overlay', 'muted', 'subtle', 'text',
            'love', 'gold', 'rose', 'pine', 'foam', 'iris',
            'highlightLow', 'highlightMed', 'highlightHigh'
        ];
        
        const missingKeys = requiredKeys.filter(key => !theme.hasOwnProperty(key));
        
        if (missingKeys.length > 0) {
            return {
                valid: false,
                errors: [`Missing required keys: ${missingKeys.join(', ')}`]
            };
        }
        
        // Validate color formats
        const invalidColors = [];
        Object.keys(theme).forEach(key => {
            const color = theme[key];
            if (typeof color === 'string' && color.startsWith('#') && !/^#[0-9A-F]{6}$/i.test(color)) {
                invalidColors.push(key);
            }
        });
        
        if (invalidColors.length > 0) {
            return {
                valid: false,
                errors: [`Invalid color format for: ${invalidColors.join(', ')}`]
            };
        }
        
        return { valid: true, errors: [] };
    }

    // Batch theme operations
    importMultipleThemes(files) {
        const promises = Array.from(files).map(file => this.importTheme(file));
        return Promise.allSettled(promises);
    }

    exportAllCustomThemes() {
        const exportData = {
            themes: this.customThemes,
            version: '1.0',
            exportDate: new Date().toISOString(),
            count: Object.keys(this.customThemes).length
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `carbon-custom-themes-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
