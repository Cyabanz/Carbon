// This runs in extensions.html
document.addEventListener("DOMContentLoaded", () => {
  // Storage key must match injector.js
  const SETTINGS_KEY = "uv_extension_settings";

  function getSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  // Load current settings
  const settings = getSettings();
  document.getElementById("adblock").checked = !!settings.adBlock;
  document.getElementById("darkreader").checked = !!settings.darkReader;
  document.getElementById("customcss").value = settings.customCSS || "";
  document.getElementById("customjs").value = settings.customJS || "";

  // Find the proxy iframe (assume id="uv-frame", adjust if needed)
  function getProxyFrame() {
    for (const frame of window.parent.frames) {
      try {
        if (frame.location.pathname.startsWith(self.__uv$config.prefix)) {
          return frame;
        }
      } catch {}
    }
    // fallback
    const uvf = window.parent.document.getElementById("uv-frame");
    return uvf ? uvf.contentWindow : null;
  }

  document.getElementById("save").onclick = () => {
    const status = document.getElementById("status");
    const newSettings = {
      adBlock: document.getElementById("adblock").checked,
      darkReader: document.getElementById("darkreader").checked,
      customCSS: document.getElementById("customcss").value,
      customJS: document.getElementById("customjs").value
    };
    saveSettings(newSettings);

    // Send to proxy page(s)
    const proxyFrame = getProxyFrame();
    if (proxyFrame) {
      proxyFrame.postMessage({ uvExtensionSettings: newSettings }, "*");
      status.textContent = "Settings applied!";
    } else {
      status.textContent = "Could not find proxy frame!";
    }
    setTimeout(() => status.textContent = "", 2000);
  };
});
