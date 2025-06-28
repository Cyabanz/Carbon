//////////////////////////////
///     Backend + Proxy    ///
//////////////////////////////

// --- Scramjet, BareMux, UV, Service Worker, and Backend Logic ---

// --- Scramjet + BareMux Init ---
let scramjet = null, BareMux = null, connection = null;
let wispURL = null, transportURL = null, proxyOption = null;
const transportOptions = {
  epoxy: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport/dist/index.mjs",
  libcurl: "https://cdn.jsdelivr.net/npm/@mercuryworkshop/libcurl-transport/dist/index.mjs"
};

async function ensureBareScramReady() {
  if (!scramjet) {
    await import("/scram/scramjet.shared.js");
    await import("/scram/scramjet.controller.js");
    const { ScramjetController } = await import("/scram/scramjet.controller.js");
    scramjet = new ScramjetController({
      files: {
        wasm: "/scram/scramjet.wasm.wasm",
        worker: "/scram/scramjet.worker.js",
        client: "/scram/scramjet.client.js",
        shared: "/scram/scramjet.shared.js",
        sync: "/scram/scramjet.sync.js",
      },
      flags: {
        serviceworkers: false,
        syncxhr: false,
        naiiveRewriter: false,
        strictRewrites: true,
        rewriterLogs: false,
        captureErrors: true,
        cleanErrors: true,
        scramitize: false,
        sourcemaps: true,
      },
    });
    await scramjet.init();
  }
  if (!BareMux) {
    BareMux = await import("https://cdn.jsdelivr.net/gh/Coding4Hours/cdn/bare-mux/index.mjs");
    connection = new BareMux.BareMuxConnection("/bareworker.js");
  }
  return { scramjet, BareMux, connection };
}

// Service Worker registration
const swAllowedHostnames = ["localhost", "127.0.0.1"];
async function registerSW() {
  if (!navigator.serviceWorker) {
    if (
      location.protocol !== "https:" &&
      !swAllowedHostnames.includes(location.hostname)
    )
      throw new Error("Service workers cannot be registered without https.");
    throw new Error("Your browser doesn't support service workers.");
  }
  await navigator.serviceWorker.register("./ultraworker.js");
}
await registerSW();
console.log("lethal.js: Service Worker registered");

// --- Proxy/Transport/Wisp Control ---
async function updateBareMux() {
  if (connection && transportURL && wispURL) {
    await connection.setTransport(transportURL, [{ wisp: wispURL }]);
  }
}
export async function setTransport(transport) {
  transportURL = transportOptions[transport] || transport;
  await updateBareMux();
}
export function getTransport() { return transportURL; }
export async function setWisp(wisp) { wispURL = wisp; await updateBareMux(); }
export function getWisp() { return wispURL; }
export async function setProxy(proxy) {
  proxyOption = proxy;
  if (proxy === "uv") {
    await import("https://cdn.jsdelivr.net/gh/Coding4Hours/cdn/uv/uv.bundle.js");
    await import("./uv.config.js");
  } else {
    await ensureBareScramReady();
    await import("/scram/scramjet.worker.js");
  }
}
export function getProxy() { return proxyOption; }
export function makeURL(input, template = "https://search.brave.com/search?q=%s") {
  try { return new URL(input).toString(); } catch (err) {}
  const url = new URL(`http://${input}`);
  if (url.hostname.includes(".")) return url.toString();
  return template.replace("%s", encodeURIComponent(input));
}
export async function getProxied(input) {
  const url = makeURL(input);
  if (proxyOption === "scram") {
    await ensureBareScramReady();
    return scramjet.encodeUrl(url);
  }
  return __uv$config.prefix + __uv$config.encodeUrl(url);
}

//////////////////////////////
///        UI Logic        ///
//////////////////////////////

const CARBON_NEWTAB = "carbon://newtab";
const CARBON_HISTORY = "carbon://history";
const engines = {
  "https://search.brave.com/search?q=%s": ["Brave", "bxl-brave"],
  "https://duckduckgo.com/?q=%s": ["DuckDuckGo", "bxl-duckduckgo"],
  "https://www.google.com/search?q=%s": ["Google", "bxl-google"],
  "https://www.bing.com/search?q=%s": ["Bing", "bxl-microsoft"],
  "https://search.yahoo.com/search?p=%s": ["Yahoo", "bxl-yahoo"],
  "https://www.ecosia.org/search?q=%s": ["Ecosia", "bxl-leaf"]
};

function getCurrentSearchEngine() {
  return localStorage.getItem("search-engine") || "https://search.brave.com/search?q=%s";
}
function setCurrentSearchEngine(url) {
  localStorage.setItem("search-engine", url);
  updateSearchEngineDisplay();
}
function updateSearchEngineDisplay() {
  const current = getCurrentSearchEngine();
  const [name, icon] = engines[current] || ["Brave", "bxl-brave"];
  document.getElementById("search-engine-icon").className = `bx ${icon} text-2xl`;
  document.getElementById("search-engine-btn").title = name;
}

// Proxy Toggle UI
function getCurrentProxy() {
  return localStorage.getItem("proxy-backend") || "uv";
}
function setCurrentProxy(proxy) {
  localStorage.setItem("proxy-backend", proxy);
  updateProxyToggleUI(proxy);
}
function updateProxyToggleUI(proxy) {
  const btn = document.getElementById("proxy-toggle-btn");
  const icon = document.getElementById("proxy-toggle-icon");
  if (proxy === "scram") {
    btn.classList.remove('border-cyan-400');
    btn.classList.add('border-yellow-400', 'bg-yellow-500/20');
    icon.className = "bx bx-network-chart text-2xl";
    btn.title = "Scramjet";
  } else {
    btn.classList.remove('border-yellow-400', 'bg-yellow-500/20');
    btn.classList.add('border-cyan-400');
    icon.className = "bx bx-cloud text-2xl";
    btn.title = "UV";
  }
}

let backend = getCurrentProxy();
let wisp = localStorage.getItem("wisp-server") || "wss://anura.pro/";
let transport = localStorage.getItem("proxy-transport");
setWisp(wisp);
setProxy(backend);
if (transport) setTransport(transport);
else if (navigator.userAgent.indexOf("Firefox") > 0) setTransport("libcurl");
else setTransport("epoxy");

// --- Tabs Logic ---
let tabs = [];
let activeTab = null;
let tabIdCounter = 1;
let closedTabsSnapshot = [];
function createTab(url = "") {
  const id = "tab-" + tabIdCounter++;
  if (url === CARBON_NEWTAB || url === "") {
    return {
      id,
      title: "New Tab",
      url: CARBON_NEWTAB,
      history: [CARBON_NEWTAB],
      pointer: 0
    };
  }
  if (url === CARBON_HISTORY) {
    return {
      id,
      title: "Tab History",
      url: CARBON_HISTORY,
      history: [CARBON_HISTORY],
      pointer: 0
    };
  }
  return {
    id,
    title: url ? url : "New Tab",
    url,
    history: url ? [url] : [],
    pointer: url ? 0 : -1
  };
}
function renderTabs() {
  const tabsBar = document.getElementById("tabs-bar");
  tabsBar.innerHTML = "";
  tabs.forEach((tab, idx) => {
    const tabElement = document.createElement("div");
    tabElement.className = `
      relative flex items-center cursor-pointer select-none transition-all duration-200 group
      ${tab.id === activeTab 
        ? 'bg-dark-600 text-white border-t-2 border-cyan-400' 
        : 'bg-dark-700/50 text-gray-300 hover:bg-dark-600/70 hover:text-white border-t-2 border-transparent'
      }
    `;
    tabElement.style.cssText = `
      height: 36px;
      min-width: 180px;
      max-width: 240px;
      margin-right: -8px;
      clip-path: polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%);
      padding: 0 20px 0 16px;
      z-index: ${tab.id === activeTab ? '10' : '1'};
    `;
    tabElement.setAttribute("draggable", "true");
    tabElement.setAttribute("data-tab-id", tab.id);
    const content = document.createElement("div");
    content.className = "flex items-center w-full h-full";
    const title = document.createElement("span");
    let dispTitle = tab.title;
    if (tab.history[tab.pointer] === CARBON_NEWTAB) dispTitle = "New Tab";
    if (tab.history[tab.pointer] === CARBON_HISTORY) dispTitle = "Tab History";
    title.textContent = dispTitle.length > 18 ? dispTitle.slice(0, 15) + "..." : dispTitle;
    title.className = "flex-1 truncate text-sm font-medium";
    content.appendChild(title);
    const closeBtn = document.createElement("button");
    closeBtn.className = "ml-2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100";
    closeBtn.innerHTML = "&times;";
    closeBtn.title = "Close Tab (Ctrl+W)";
    closeBtn.style.fontSize = "16px";
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      removeTab(tab.id);
    };
    content.appendChild(closeBtn);
    tabElement.appendChild(content);
    tabElement.onclick = () => setActiveTab(tab.id);
    tabElement.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", tab.id);
      tabElement.classList.add("opacity-50");
    });
    tabElement.addEventListener("dragend", (e) => {
      tabElement.classList.remove("opacity-50");
    });
    tabElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      tabElement.classList.add("ring-2", "ring-cyan-400");
    });
    tabElement.addEventListener("dragleave", (e) => {
      tabElement.classList.remove("ring-2", "ring-cyan-400");
    });
    tabElement.addEventListener("drop", (e) => {
      e.preventDefault();
      tabElement.classList.remove("ring-2", "ring-cyan-400");
      const draggedTabId = e.dataTransfer.getData("text/plain");
      reorderTab(draggedTabId, tab.id);
    });
    tabsBar.appendChild(tabElement);
  });
}
function updateAddressBar(tab) {
  const input = document.getElementById("address-bar-input");
  if (tab.history[tab.pointer] === CARBON_NEWTAB) {
    input.value = "";
    input.placeholder = "Search the web freely";
  } else if (tab.history[tab.pointer] === CARBON_HISTORY) {
    input.value = CARBON_HISTORY;
    input.placeholder = "Tab History";
  } else {
    input.value = tab.history[tab.pointer] || "";
    input.placeholder = "Search the web freely";
  }
}
function renderTabContent(tab) {
  const iframe = document.getElementById("proxy-iframe");
  if (!tab || typeof tab.pointer !== "number" || tab.pointer < 0 || !tab.history[tab.pointer]) {
    iframe.src = "";
    return;
  }
  let url = tab.history[tab.pointer];
  if (url === CARBON_NEWTAB) {
    iframe.srcdoc = `
      <!DOCTYPE html>
      <html style="background: #1a1a2e; color: #fff; height:100%;margin:0;padding:0;">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap" rel="stylesheet">
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
      </head>
      <body style="height:100%;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#0f0f23 0%,#1a1a2e 60%,#16213e 100%)">
        <div style="text-align:center;">
          <i class='bx bxs-cube text-7xl' style="color:#0ff;font-size:64px;"></i>
          <h1 style="font-size:2.2rem;font-weight:700;margin-top:12px;">CARBON Proxy</h1>
          <p style="font-size:1.1rem;color:#aaa;margin-top:8px;">A secure, private, tabbed web proxy browser.</p>
        </div>
        <div style="margin-top:48px;display:flex;gap:24px;justify-content:center;">
          <button onclick="parent.dispatchEvent(new CustomEvent('carbon-newtab'))" style="padding:20px 36px;border:none;border-radius:14px;background:#23234d;color:#fff;font-size:1.07rem;font-weight:500;cursor:pointer;box-shadow:0 4px 32px 0 #0008;transition:background 0.2s;">New Tab</button>
          <button onclick="parent.dispatchEvent(new CustomEvent('carbon-history'))" style="padding:20px 36px;border:none;border-radius:14px;background:#16213e;color:#0ff;font-size:1.07rem;font-weight:500;cursor:pointer;box-shadow:0 4px 32px 0 #0008;transition:background 0.2s;">Tab History</button>
        </div>
      </body>
      </html>
    `;
    return;
  }
  if (url === CARBON_HISTORY) {
    let allHistory = [];
    tabs.forEach(tab => {
      if(Array.isArray(tab.history)) {
        tab.history.forEach((url, idx) => {
          if(url && url !== CARBON_NEWTAB && url !== CARBON_HISTORY)
            allHistory.push({url, tabId: tab.id, tabTitle: tab.title, idx});
        });
      }
    });
    iframe.srcdoc = `
      <!DOCTYPE html>
      <html style="background: #23234d; color: #fff; height:100%;margin:0;">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap" rel="stylesheet">
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
      </head>
      <body style="height:100%;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;font-family:'Inter',sans-serif;">
        <div style="width:100%;max-width:600px;margin:auto;">
          <h2 style="font-size:2rem;font-weight:700;margin:36px 0 18px;text-align:center;"><i class='bx bx-history' style="vertical-align:middle;color:#0ff;"></i> History</h2>
          <div style="max-height:360px;overflow-y:auto;background:#1a1a2e;border-radius:14px;padding:20px;">
            ${allHistory.length === 0 ? "<div style='color:#aaa;text-align:center;'>No history available.</div>" : allHistory.map(h => `<div style="margin:7px 0;padding:10px 0;border-bottom:1px solid #333;display:flex;align-items:center;">
              <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:1.03rem;color:#0ff;cursor:pointer;" onclick="parent.postMessage({type:'carbon-history-nav',tabId:'${h.tabId}',idx:${h.idx}},'*')">${h.url}</span>
            </div>`).join("")}
          </div>
        </div>
      </body>
      </html>
    `;
    return;
  }
  let search = getCurrentSearchEngine();
  makeURLAndProxied(url, search).then(src => { iframe.src = src; });
}
async function makeURLAndProxied(url, search) {
  try {
    let urlToLoad = makeURL(url, search);
    return await getProxied(urlToLoad);
  } catch (e) { return ""; }
}
function setActiveTab(tabId) {
  activeTab = tabId;
  renderTabs();
  const tab = tabs.find(t => t.id === tabId);
  updateAddressBar(tab);
  renderTabContent(tab);
}
function addTab(url = "") {
  const tab = createTab(url);
  tabs.push(tab);
  setActiveTab(tab.id);
}
function removeTab(tabId) {
  const idx = tabs.findIndex(t => t.id === tabId);
  if (idx !== -1) {
    takeTabsSnapshot();
    tabs.splice(idx, 1);
    if (activeTab === tabId) {
      if (tabs[idx - 1]) setActiveTab(tabs[idx - 1].id);
      else if (tabs[idx]) setActiveTab(tabs[idx].id);
      else {
        activeTab = null;
        renderTabs();
        document.getElementById("proxy-iframe").src = "";
        document.getElementById("address-bar-input").value = "";
      }
    } else {
      renderTabs();
    }
  }
}
function reorderTab(draggedTabId, targetTabId) {
  const fromIdx = tabs.findIndex(t => t.id === draggedTabId);
  const toIdx = tabs.findIndex(t => t.id === targetTabId);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
  const [removed] = tabs.splice(fromIdx, 1);
  tabs.splice(toIdx, 0, removed);
  renderTabs();
}
function updateTabHistory(tab, url) {
  if (url === CARBON_NEWTAB || url === CARBON_HISTORY) {
    tab.history = [url];
    tab.pointer = 0;
    tab.url = url;
    tab.title = url === CARBON_NEWTAB ? "New Tab" : "Tab History";
    return;
  }
  if (tab.pointer < tab.history.length - 1) {
    tab.history = tab.history.slice(0, tab.pointer + 1);
  }
  tab.history.push(url);
  tab.pointer = tab.history.length - 1;
  tab.url = url;
  tab.title = url ? url : "New Tab";
}
function getActiveTab() { return tabs.find(t => t.id === activeTab); }

// --- Search Engine Dropdown & Proxy Dropdown ---
document.getElementById("search-engine-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  document.getElementById("search-engine-dropdown").classList.toggle("hidden");
});
document.querySelectorAll("#search-engine-dropdown [data-engine]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const engine = e.currentTarget.dataset.engine;
    setCurrentSearchEngine(engine);
    document.getElementById("search-engine-dropdown").classList.add("hidden");
    const tab = getActiveTab();
    if (tab && tab.history[tab.pointer]) {
      let v = tab.history[tab.pointer];
      if (!/^(https?:)?\/\//.test(v) && v.length > 0) renderTabContent(tab);
    }
  });
});
updateSearchEngineDisplay();

document.getElementById("proxy-toggle-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  document.getElementById("proxy-dropdown").classList.toggle("hidden");
});
document.querySelectorAll("#proxy-dropdown [data-proxy]").forEach(btn => {
  btn.addEventListener("click", async (e) => {
    const proxy = e.currentTarget.dataset.proxy;
    await setProxy(proxy);
    setCurrentProxy(proxy);
    document.getElementById("proxy-dropdown").classList.add("hidden");
    const tab = getActiveTab();
    if (tab) renderTabContent(tab);
  });
});
updateProxyToggleUI(getCurrentProxy());

// --- DuckDuckGo Suggestions ---
const addressInput = document.getElementById("address-bar-input");
const suggestionBox = document.getElementById("suggestion-box");
let suggestionActive = -1;
let currentSuggestions = [];
let suggestionFetchController = null;
addressInput.addEventListener("input", async function(e) {
  const val = addressInput.value.trim();
  if (!val || val.startsWith("http") || val.startsWith(CARBON_NEWTAB) || val.startsWith(CARBON_HISTORY)) {
    suggestionBox.classList.add("hidden");
    suggestionBox.innerHTML = "";
    currentSuggestions = [];
    suggestionActive = -1;
    return;
  }
  const apiUrl = "https://corsproxy.io/?" + encodeURIComponent("https://ac.duckduckgo.com/ac/?q=" + encodeURIComponent(val) + "&type=list");
  if (suggestionFetchController) suggestionFetchController.abort();
  suggestionFetchController = new AbortController();
  try {
    const resp = await fetch(apiUrl, { signal: suggestionFetchController.signal });
    if (!resp.ok) throw new Error();
    const data = await resp.json();
    currentSuggestions = (data || []).map(s => s.phrase).filter(Boolean);
    if (currentSuggestions.length === 0) {
      suggestionBox.classList.add("hidden");
      suggestionBox.innerHTML = "";
      suggestionActive = -1;
      return;
    }
    suggestionBox.innerHTML = currentSuggestions.map((s, i) =>
      `<div class="suggestion-item${i === suggestionActive ? ' active' : ''}" data-idx="${i}">${s.replace(/</g,"&lt;")}</div>`
    ).join("");
    suggestionBox.classList.remove("hidden");
    suggestionActive = -1;
  } catch (err) {
    suggestionBox.classList.add("hidden");
    suggestionBox.innerHTML = "";
    currentSuggestions = [];
    suggestionActive = -1;
  }
});
addressInput.addEventListener("keydown", function(e) {
  if (!currentSuggestions.length || suggestionBox.classList.contains("hidden")) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    suggestionActive = (suggestionActive + 1) % currentSuggestions.length;
    updateSuggestionBoxActive();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    suggestionActive = (suggestionActive - 1 + currentSuggestions.length) % currentSuggestions.length;
    updateSuggestionBoxActive();
  } else if (e.key === "Enter") {
    if (suggestionActive !== -1) {
      e.preventDefault();
      selectSuggestion(suggestionActive);
    }
    suggestionBox.classList.add("hidden");
  } else if (e.key === "Escape") {
    suggestionBox.classList.add("hidden");
    suggestionActive = -1;
  }
});
function updateSuggestionBoxActive() {
  Array.from(suggestionBox.children).forEach((el, i) => {
    if (i === suggestionActive) el.classList.add("active");
    else el.classList.remove("active");
  });
  if (suggestionActive !== -1) {
    const el = suggestionBox.children[suggestionActive];
    if (el) el.scrollIntoView({ block: "nearest" });
    addressInput.value = currentSuggestions[suggestionActive];
  }
}
function selectSuggestion(idx) {
  if (idx < 0 || idx >= currentSuggestions.length) return;
  addressInput.value = currentSuggestions[idx];
  suggestionBox.classList.add("hidden");
  suggestionActive = -1;
}
suggestionBox.addEventListener("mousedown", function(e) {
  const target = e.target.closest('.suggestion-item');
  if (target) {
    const idx = parseInt(target.dataset.idx);
    selectSuggestion(idx);
    setTimeout(() => {
      document.getElementById("address-bar-form").dispatchEvent(new Event("submit"));
    }, 0);
  }
});
document.addEventListener("click", function(e) {
  if (!suggestionBox.contains(e.target) && e.target !== addressInput) {
    suggestionBox.classList.add("hidden");
    suggestionActive = -1;
  }
  if (!document.getElementById("proxy-dropdown").contains(e.target) && e.target !== document.getElementById("proxy-toggle-btn")) {
    document.getElementById("proxy-dropdown").classList.add("hidden");
  }
  if (!document.getElementById("search-engine-dropdown").contains(e.target) && e.target !== document.getElementById("search-engine-btn")) {
    document.getElementById("search-engine-dropdown").classList.add("hidden");
  }
});

// --- Form/Navigation ---
document.getElementById("address-bar-form").addEventListener("submit", async function(event) {
  event.preventDefault();
  suggestionBox.classList.add("hidden");
  suggestionActive = -1;
  const tab = getActiveTab();
  if (!tab) return;
  let url = addressInput.value.trim();
  if (!url) return;
  if (url === CARBON_NEWTAB) {
    updateTabHistory(tab, CARBON_NEWTAB);
    renderTabs();
    renderTabContent(tab);
    return;
  }
  if (url === CARBON_HISTORY) {
    updateTabHistory(tab, CARBON_HISTORY);
    renderTabs();
    renderTabContent(tab);
    return;
  }
  updateTabHistory(tab, url);
  renderTabs();
  renderTabContent(tab);
});
document.getElementById("back-btn").onclick = function() {
  const tab = getActiveTab();
  if (!tab || tab.pointer <= 0) return;
  tab.pointer--;
  updateAddressBar(tab);
  renderTabContent(tab);
};
document.getElementById("forward-btn").onclick = function() {
  const tab = getActiveTab();
  if (!tab || tab.pointer >= tab.history.length - 1) return;
  tab.pointer++;
  updateAddressBar(tab);
  renderTabContent(tab);
};
document.getElementById("refresh-btn").onclick = function() {
  const tab = getActiveTab();
  if (!tab || typeof tab.pointer !== "number" || tab.pointer < 0) return;
  renderTabContent(tab);
};
document.getElementById("home-btn").onclick = function() {
  const tab = getActiveTab();
  if (!tab) return;
  updateTabHistory(tab, CARBON_NEWTAB);
  updateAddressBar(tab);
  renderTabContent(tab);
};
function takeTabsSnapshot() {
  closedTabsSnapshot = JSON.parse(JSON.stringify(tabs));
  localStorage.setItem("carbon-proxy-last-tabs", JSON.stringify(closedTabsSnapshot));
}
function restoreTabsFromSnapshot() {
  let fromLS = localStorage.getItem("carbon-proxy-last-tabs");
  let snapshot = closedTabsSnapshot.length
    ? closedTabsSnapshot
    : (fromLS ? JSON.parse(fromLS) : []);
  if (!snapshot.length) return;
  tabs = snapshot.map(tab => ({
    ...tab,
    id: "tab-" + (tabIdCounter++),
  }));
  activeTab = tabs.length ? tabs[0].id : null;
  renderTabs();
  setActiveTab(activeTab);
  closedTabsSnapshot = [];
  localStorage.removeItem("carbon-proxy-last-tabs");
}
document.getElementById("menu-btn").onclick = (e) => { document.getElementById("dropdown-menu").classList.toggle("hidden"); e.stopPropagation(); };
window.onclick = (e) => {
  if (!document.getElementById("dropdown-menu").contains(e.target) && e.target !== document.getElementById("menu-btn"))
    document.getElementById("dropdown-menu").classList.add("hidden");
};
document.getElementById("clear-history-btn").onclick = function() {
  const tab = getActiveTab();
  if (!tab) return;
  tab.history = [CARBON_NEWTAB];
  tab.pointer = 0;
  tab.url = CARBON_NEWTAB;
  tab.title = "New Tab";
  updateAddressBar(tab);
  renderTabContent(tab);
  document.getElementById("dropdown-menu").classList.add("hidden");
};
document.getElementById("close-all-tabs-btn").onclick = function() {
  if (tabs.length > 0) takeTabsSnapshot();
  tabs = [];
  activeTab = null;
  renderTabs();
  document.getElementById("proxy-iframe").src = "";
  document.getElementById("address-bar-input").value = "";
  document.getElementById("dropdown-menu").classList.add("hidden");
};
document.getElementById("restore-tabs-btn").onclick = function() {
  restoreTabsFromSnapshot();
  document.getElementById("dropdown-menu").classList.add("hidden");
};
document.getElementById("new-tab-btn").addEventListener("click", () => addTab(CARBON_NEWTAB));

// --- History Modal Logic ---
const historyBtn = document.getElementById("history-btn");
const historyModalBg = document.getElementById("history-modal-bg");
const historyModal = document.getElementById("history-modal");
const modalHistoryList = document.getElementById("modal-history-list");
const closeHistoryModalBtn = document.getElementById("close-history-modal");
historyBtn.onclick = (e) => { renderModalHistoryList(); openHistoryModal(); e.stopPropagation(); };
closeHistoryModalBtn.onclick = closeHistoryModal;
historyModalBg.onclick = function(e) { if (e.target === historyModalBg) closeHistoryModal(); };
function openHistoryModal() {
  historyModalBg.classList.remove("pointer-events-none", "opacity-0");
  historyModalBg.classList.add("pointer-events-auto", "opacity-100");
  historyModal.classList.remove("scale-95", "opacity-0");
  historyModal.classList.add("scale-100", "opacity-100");
}
function closeHistoryModal() {
  historyModalBg.classList.add("pointer-events-none", "opacity-0");
  historyModalBg.classList.remove("pointer-events-auto", "opacity-100");
  historyModal.classList.add("scale-95", "opacity-0");
  historyModal.classList.remove("scale-100", "opacity-100");
}
function renderModalHistoryList() {
  const tab = getActiveTab();
  modalHistoryList.innerHTML = "";
  if (!tab || !tab.history.length) {
    modalHistoryList.innerHTML = "<div class='text-gray-500 italic text-center py-4'>No history for this tab.</div>";
    return;
  }
  tab.history.forEach((url, idx) => {
    if(url === CARBON_NEWTAB || url === CARBON_HISTORY) return;
    const row = document.createElement("div");
    row.className = `flex items-center justify-between p-3 rounded-lg hover:bg-dark-600 cursor-pointer transition-colors ${idx === tab.pointer ? 'bg-cyan-500/20 border border-cyan-400' : ''}`;
    row.innerHTML = `<span class="flex-1 ${idx === tab.pointer ? 'text-cyan-400 font-bold' : ''} truncate">${url}</span>`;
    row.onclick = () => {
      tab.pointer = idx;
      updateAddressBar(tab);
      renderTabContent(tab);
      closeHistoryModal();
    };
    if (tab.history.length > 1) {
      const rmBtn = document.createElement("button");
      rmBtn.className = "ml-2 text-gray-400 hover:text-red-500";
      rmBtn.title = "Remove from history";
      rmBtn.textContent = "✕";
      rmBtn.onclick = (e) => {
        e.stopPropagation();
        tab.history.splice(idx, 1);
        if (tab.pointer >= tab.history.length) tab.pointer = tab.history.length - 1;
        renderModalHistoryList();
      };
      row.appendChild(rmBtn);
    }
    modalHistoryList.appendChild(row);
  });
}

// --- Fullscreen Button Logic ---
const fullscreenBtn = document.getElementById("fullscreen-btn");
fullscreenBtn.onclick = function() {
  let el = document.documentElement;
  if (!document.fullscreenElement && el.requestFullscreen) {
    el.requestFullscreen();
    fullscreenBtn.title = "Exit Fullscreen";
    fullscreenBtn.querySelector('i').className = "bx bx-exit-fullscreen text-2xl text-gray-300 group-hover:text-white transition-colors";
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
    fullscreenBtn.title = "Fullscreen";
    fullscreenBtn.querySelector('i').className = "bx bx-fullscreen text-2xl text-gray-300 group-hover:text-white transition-colors";
  }
};
document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement) {
    fullscreenBtn.title = "Fullscreen";
    fullscreenBtn.querySelector('i').className = "bx bx-fullscreen text-2xl text-gray-300 group-hover:text-white transition-colors";
  } else {
    fullscreenBtn.title = "Exit Fullscreen";
    fullscreenBtn.querySelector('i').className = "bx bx-exit-fullscreen text-2xl text-gray-300 group-hover:text-white transition-colors";
  }
});

// --- Keyboard Shortcuts & iframe parent communication ---
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "t") {
    e.preventDefault(); addTab(CARBON_NEWTAB);
  }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "w") {
    e.preventDefault(); if (activeTab) removeTab(activeTab);
  }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "Tab") {
    e.preventDefault();
    const idx = tabs.findIndex(t => t.id === activeTab);
    if (tabs.length > 1 && idx !== -1) setActiveTab(tabs[(idx + 1) % tabs.length].id);
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Tab") {
    e.preventDefault();
    const idx = tabs.findIndex(t => t.id === activeTab);
    if (tabs.length > 1 && idx !== -1) setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length].id);
  }
  if (e.altKey && !e.shiftKey && e.key === "ArrowLeft") document.getElementById("back-btn").click();
  if (e.altKey && !e.shiftKey && e.key === "ArrowRight") document.getElementById("forward-btn").click();
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "n") {
    e.preventDefault(); addTab(CARBON_NEWTAB);
  }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "h") {
    e.preventDefault();
    const tab = getActiveTab();
    if (tab) updateTabHistory(tab, CARBON_HISTORY);
    renderTabs();
    renderTabContent(getActiveTab());
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "f") {
    e.preventDefault();
    fullscreenBtn.click();
  }
});
window.addEventListener('message', function(ev) {
  if (!ev.data) return;
  if (ev.data.type === 'carbon-history-nav' && ev.data.tabId && typeof ev.data.idx === 'number') {
    const t = tabs.find(t => t.id === ev.data.tabId);
    if (t && t.history[ev.data.idx]) {
      t.pointer = ev.data.idx;
      setActiveTab(t.id);
      updateAddressBar(t);
      renderTabContent(t);
    }
  }
});
window.addEventListener('carbon-newtab', () => {
  addTab(CARBON_NEWTAB);
});
window.addEventListener('carbon-history', () => {
  const tab = getActiveTab();
  if (tab) {
    updateTabHistory(tab, CARBON_HISTORY);
    renderTabs();
    renderTabContent(tab);
  }
});
window.addEventListener("DOMContentLoaded", () => {
  if (tabs.length === 0) addTab(CARBON_NEWTAB);
  document.body.style.height = "100vh";
  document.body.style.width = "100vw";
  document.getElementById("__carbon-root").style.height = "100%";
  document.getElementById("__carbon_root").style.width = "100%";
});
