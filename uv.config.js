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

// Vencord injection for Discord.com via UV proxy
(function vencordInjection() {
  // Wait for UV eval to exist
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

  // Wait for __uv$eval, then execute
  waitForEvalReady().then(() => {
    // Decode the real target URL
    const decodedUrl = self.__uv$config.decodeUrl(
      location.pathname.replace(self.__uv$config.prefix, "")
    );
    let currentHost = "";
    try {
      currentHost = new URL(decodedUrl).host;
    } catch (e) {
      // If not a valid URL, do not continue
      return;
    }
    // Only inject on Discord
    if (currentHost === "discord.com") {
      __uv$eval(`
        (async () => {
          // Fetch and inject Vencord
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
            } catch (e) {
              // Fail silently
            }
          }
          await loadVencordResource("https://raw.githubusercontent.com/Vencord/builds/refs/heads/main/browser.js");
          await loadVencordResource("https://raw.githubusercontent.com/Vencord/builds/refs/heads/main/browser.css");

          // Restore localStorage after load for Vencord to work correctly
          window.addEventListener("load", () => {
            window.localStorage = cachedStorage;
            this.localStorage = cachedStorage;
            localStorage = cachedStorage;
          });
        })();
      `);
    }
  });
})();
