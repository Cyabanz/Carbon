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

// Only run in browser context, not in worker
if (typeof window !== "undefined" && typeof document !== "undefined") {
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

    // Only run in the proxied iframe, not the main window
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
      // Only inject on Discord
      if (currentHost === "discord.com") {
        __uv$eval(`
          (async () => {
            // Vencord
            const cachedStorage = localStorage;
            async function loadResource(url, type) {
              try {
                let el;
                if (type === 'js') {
                  el = document.createElement('script');
                  el.type = "text/javascript";
                  el.textContent = await (await fetch(url)).text();
                } else if (type === 'css') {
                  el = document.createElement('style');
                  el.textContent = await (await fetch(url)).text();
                } else if (type === 'cdn') {
                  el = document.createElement('script');
                  el.type = "text/javascript";
                  el.src = url;
                }
                document.head.appendChild(el);
              } catch (e) {}
            }
            await loadResource("https://raw.githubusercontent.com/Vencord/builds/refs/heads/main/browser.js", "js");
            await loadResource("https://raw.githubusercontent.com/Vencord/builds/refs/heads/main/browser.css", "css");
            window.addEventListener("load", () => {
              window.localStorage = cachedStorage;
              this.localStorage = cachedStorage;
              localStorage = cachedStorage;
            });

            // AdGuard
            await loadResource("https://cdn.jsdelivr.net/npm/adguard-js@4.0.34/dist/adguard.js", "js");

            // Inject simple dark theme CSS
            (function injectDarkCSS() {
              const darkCSS = \`
                html, body {
                  background: #181a1b !important;
                  color: #e8e6e3 !important;
                  color-scheme: dark !important;
                }
                * {
                  background-color: transparent !important;
                  border-color: #23272a !important;
                  color: inherit !important;
                }
                a, a * {
                  color: #8ab4f8 !important;
                }
                /* Optional: tweak Discord UI for better dark appearance */
                [class*="background"], [class*="container"], [class*="scroller"], [class*="content"] {
                  background: #181a1b !important;
                  color: #e8e6e3 !important;
                }
                ::selection {
                  background: #3a3f41 !important;
                }
                /* Scrollbars */
                ::-webkit-scrollbar {
                  background: #23272a !important;
                  width: 12px;
                }
                ::-webkit-scrollbar-thumb {
                  background: #2c2f33 !important;
                }
              \`;
              let style = document.createElement('style');
              style.id = 'uv-injected-dark-css';
              style.textContent = darkCSS;
              document.head.appendChild(style);
            })();

            // Custom CSS/JS injectors
            window.injectCustomCSS = function(css) {
              let styleTag = document.getElementById('custom-css-injector');
              if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'custom-css-injector';
                document.head.appendChild(styleTag);
              }
              styleTag.textContent = css;
            };
            window.injectCustomScript = function(js) {
              let scriptTag = document.createElement('script');
              scriptTag.type = 'text/javascript';
              scriptTag.textContent = js;
              document.body.appendChild(scriptTag);
            };
          })();
        `);
      }
    });
  })();
}
