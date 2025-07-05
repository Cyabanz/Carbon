// This runs in every proxied page (inject via custom uv.client.js)
(function () {
  const SETTINGS_KEY = "uv_extension_settings";

  // Helper to get settings
  function getSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    } catch {
      return {};
    }
  }

  // Helper to inject a script by URL
  function injectScript(url, callback) {
    const s = document.createElement("script");
    s.src = url;
    s.onload = callback || null;
    document.documentElement.appendChild(s);
  }

  // Helper to inject inline JS
  function injectCustomJS(code) {
    if (!code) return;
    const s = document.createElement("script");
    s.textContent = code;
    document.documentElement.appendChild(s);
  }

  // Helper to inject CSS
  function injectCustomCSS(css) {
    if (!css) return;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Ad blocker simple fallback CSS (optional)
  const fallbackAdBlockCSS = `
    [id*="ad"], [class*="ad"], [class*="ads"], [id*="ads"] { display: none !important; }
  `;

  // Called to inject all enabled features
  function applySettings(settings) {
    // Clear previous injected elements (optional, if you want to hot-reload)
    // TODO: implement if needed

    // Dark Reader
    if (settings.darkReader) {
      injectScript("https://cdn.jsdelivr.net/npm/darkreader/darkreader.min.js", () => {
        window.DarkReader && window.DarkReader.enable({ brightness: 100, contrast: 90, sepia: 10 });
      });
    }

    // Ad Blocker (AdGuard)
    if (settings.adBlock) {
      injectScript("https://cdn.jsdelivr.net/npm/adguard-js@4.0.34/dist/adguard.js");
      injectCustomCSS(fallbackAdBlockCSS);
    }

    // Custom CSS
    if (settings.customCSS) {
      injectCustomCSS(settings.customCSS);
    }

    // Custom JS
    if (settings.customJS) {
      injectCustomJS(settings.customJS);
    }
  }

  // Listen for messages from extensions.html
  window.addEventListener("message", (event) => {
    if (event.data && event.data.uvExtensionSettings) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(event.data.uvExtensionSettings));
      applySettings(event.data.uvExtensionSettings);
    }
  });

  // On page load, apply settings
  document.addEventListener("DOMContentLoaded", () => {
    const settings = getSettings();
    applySettings(settings);
  });
})();
