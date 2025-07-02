self.__uv$config = {
  prefix: "/uv/",
  encodeUrl: Ultraviolet.codec.plain.encode,
  decodeUrl: Ultraviolet.codec.plain.decode,
  handler: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.handler.js",
  client: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.client.js",
  bundle: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.bundle.js",
  config: "/uv.config.js",
  sw: "https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.sw.js",
  // --- VENCORD INJECTION ---
  onBeforeScriptExecute: async function () {
    while (typeof __uv$eval === "undefined")
      await new Promise((r) => setTimeout(r, 1));

    // Only run inside the iframe (not top-level window)
    if (window.top === window) return;

    // Decode the proxied URL
    const decodedUrl = self.__uv$config.decodeUrl(
      location.pathname.replace(self.__uv$config.prefix, "")
    );
    const currentHost = new URL(decodedUrl).host;

    // Inject Vencord only on Discord
    if (currentHost === "discord.com") {
      __uv$eval(`
        (async () => {
          const cachedStorage = localStorage;
          async function loadVencord(url) {
            try {
              let el = document.createElement(url.endsWith('.js') ? 'script' : 'style');
              el.textContent = await (await fetch(url)).text();
              document.head.appendChild(el);
            } catch (e) {}
          }
          await loadVencord("https://raw.githubusercontent.com/Vencord/builds/refs/heads/main/browser.js");
          await loadVencord("https://raw.githubusercontent.com/Vencord/builds/refs/heads/main/browser.css");
          window.onload = () => {
            window.localStorage = cachedStorage;
            this.localStorage = cachedStorage;
            localStorage = cachedStorage;
          };
        })();
      `);
    }
  }
};
