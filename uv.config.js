self.__uv$config = {
    prefix: '/uv/service/',
    bare: 'https://petezahgames.com/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    client: '/uv/uv.client.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};

(async () => {
    // Wait for Ultraviolet's eval to be available
    while (typeof __uv$eval === "undefined")
        await new Promise((r) => setTimeout(r, 1));

    // Only run in iframes
    if (window.top === window) return;

    // Optional: Check for localStorage flag to allow/deny injection
    if (window.top.localStorage.getItem("shouldInject") == "false") {
        return;
    }

    // Get the real destination URL from the proxied path
    const decodedUrl = __uv$config.decodeUrl(
        location.pathname.replace(__uv$config.prefix, "")
    );
    const currentHost = new URL(decodedUrl).host;

    // Inject Vencord only for Discord
    if (currentHost === "discord.com") {
        __uv$eval(`
            const cachedStorage = localStorage;
            const loadVencord = async (url) => {
                try {
                    let el = document.createElement(url.endsWith('.js') ? 'script' : 'style');
                    el.textContent = await (await fetch(url)).text();
                    document.head.appendChild(el);
                } catch (error) {}
            };

            loadVencord("https://raw.githubusercontent.com/Vencord/builds/refs/heads/main/browser.js");
            loadVencord("https://raw.githubusercontent.com/Vencord/builds/refs/heads/main/browser.css");

            window.onload = () => {
                window.localStorage = cachedStorage;
                this.localStorage = cachedStorage;
                localStorage = cachedStorage;
            };
        `);
    }
    // Optionally, you can add adblocker or other logic here as in your original code
})();
