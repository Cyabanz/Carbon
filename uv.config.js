self.__uv$config = {
  prefix: "/uv/",
  encodeUrl: Ultraviolet.codec.plain.encode,
  decodeUrl: Ultraviolet.codec.plain.decode,
  handler: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.handler.js",
  client: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.client.js",
  bundle: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.bundle.js",
  config: "/uv.config.js",
  sw: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.sw.js"
};

// Vencord + AdGuard + Dark Reader + Custom CSS/JS injection for Discord.com via UV proxy
(function vencordAndEnhancementsInjection() {
  function waitForEvalReady() {
    return new Promise(resolve => {
      if (typeof __uv$eval !== "undefined") return resolve();
      const interval = setInterval(() => {
        if (typeof __uv$eval !== "undefined") {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });
  }

  // Only run in the proxied iframe, not the top frame
  if (window.top === window) return;

  waitForEvalReady().then(() => {
    const decodedUrl = self.__uv$config.decodeUrl(
      location.pathname.replace(self.__uv$config.prefix, "")
    );
    let currentHost = "";
    try {
      currentHost = new URL(decodedUrl).host;
    } catch (e) {
      return;
    }
    if (currentHost === "discord.com") {
      __uv$eval(`
        (async () => {
          // --- Vencord Injection ---
          const cachedStorage = localStorage;
          async function loadVencordResource(url) {
            try {
              let el;
              if (url.endsWith(".js")) {
                el = document.createElement('script');
                el.type = "text/javascript";
                el.textContent = await (await fetch(url)).text();
              } else if (url.endsWith(".css")) {
                el = document.createElement('style');
                el.textContent = await (await fetch(url)).text();
              } else {
                return;
              }
              document.head.appendChild(el);
            } catch (e) {}
          }
          await loadVencordResource("https://raw.githubusercontent.com/Vencord/builds/refs/heads/main/browser.js");
          await loadVencordResource("https://raw.githubusercontent.com/Vencord/builds/refs/heads/main/browser.css");
          window.addEventListener("load", () => {
            window.localStorage = cachedStorage;
            this.localStorage = cachedStorage;
            localStorage = cachedStorage;
          });

          // --- AdGuard JS Injection ---
          await loadVencordResource("https://cdn.jsdelivr.net/npm/adguard-js@4.0.34/dist/adguard.js");

          // --- Dark Reader Injection ---
          // Loads Dark Reader from CDN and enables it with default settings
          const darkReaderScript = document.createElement("script");
          darkReaderScript.src = "https://cdn.jsdelivr.net/npm/darkreader@4.9.82/darkreader.min.js";
          darkReaderScript.onload = function() {
            if (window.DarkReader) {
              // Enable Dark Reader with default settings, always dark
              window.DarkReader.enable({
                brightness: 100,
                contrast: 100,
                sepia: 0
              });
            }
          };
          document.head.appendChild(darkReaderScript);

          // --- Custom CSS Injector ---
          window.injectCustomCSS = function(css) {
            let styleTag = document.getElementById('custom-css-injector');
            if (!styleTag) {
              styleTag = document.createElement('style');
              styleTag.id = 'custom-css-injector';
              document.head.appendChild(styleTag);
            }
            styleTag.textContent = css;
          };

          // --- Custom Script Injector ---
          window.injectCustomScript = function(js) {
            let scriptTag = document.createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.textContent = js;
            document.body.appendChild(scriptTag);
          };

          // Example usage (commented):
          // window.injectCustomCSS("body { font-family: monospace !important; }");
          // window.injectCustomScript("alert('Custom script!');");
        })();
      `);
    }
  });
})();
