// --- Inlined for performance lol ---
import {
  makeURL,
  getProxied,
  setProxy,
  setTransport,
  setWisp,
} from "/lethal.mjs";
// --- END LETHAL IMPORTS ---

// --- Tab Layout Modes ---
const TAB_MODES = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical"
};
let tabsMode = localStorage.getItem("tabs-mode") || TAB_MODES.HORIZONTAL;
function setTabsMode(mode) {
  tabsMode = mode;
  localStorage.setItem("tabs-mode", mode);
  renderTabs();
  updateTabsModeButton();
}
function toggleTabsMode() {
  setTabsMode(tabsMode === TAB_MODES.HORIZONTAL ? TAB_MODES.VERTICAL : TAB_MODES.HORIZONTAL);
}
function updateTabsModeButton() {
  const btn = document.getElementById("tabs-mode-toggle-btn");
  if (btn) {
    btn.title = tabsMode === TAB_MODES.HORIZONTAL
      ? "Switch to Vertical Tabs"
      : "Switch to Horizontal Tabs";
    btn.querySelector("i").className =
      tabsMode === TAB_MODES.HORIZONTAL
        ? "bx bx-transfer-alt"
        : "bx bx-transfer";
  }
}
function ensureTabsModeButton() {
  if (!document.getElementById("tabs-mode-toggle-btn")) {
    const btn = document.createElement("button");
    btn.id = "tabs-mode-toggle-btn";
    btn.className =
      "mx-2 mb-1 flex-shrink-0 w-8 h-8 rounded-full bg-transparent hover:bg-highlight-med text-muted hover:text-text font-bold text-xl transition-all duration-200 flex items-center justify-center";
    btn.innerHTML = '<i class="bx bx-transfer-alt"></i>';
    btn.addEventListener("click", toggleTabsMode);
    btn.title = "Switch to Vertical Tabs";
    const tabBar = document.getElementById("tabs-bar");
    tabBar.parentNode.insertBefore(btn, document.getElementById("new-tab-btn"));
  }
  updateTabsModeButton();
}
ensureTabsModeButton();

// --- Pinned Tabs ---
let pinnedTabIds = JSON.parse(localStorage.getItem("pinned-tabs") || "[]");
function pinTab(tabId) {
  if (!pinnedTabIds.includes(tabId)) {
    pinnedTabIds.push(tabId);
    localStorage.setItem("pinned-tabs", JSON.stringify(pinnedTabIds));
    renderTabs();
  }
}
function unpinTab(tabId) {
  pinnedTabIds = pinnedTabIds.filter((id) => id !== tabId);
  localStorage.setItem("pinned-tabs", JSON.stringify(pinnedTabIds));
  renderTabs();
}
function isTabPinned(tabId) {
  return pinnedTabIds.includes(tabId);
}
function ensurePinnedTabsBar() {
  if (!document.getElementById("pinned-tabs-bar")) {
    const pinnedBar = document.createElement("div");
    pinnedBar.id = "pinned-tabs-bar";
    pinnedBar.className = "flex items-end overflow-x-auto scrollbar-hide min-h-[36px] px-2 py-1";
    const tabBar = document.getElementById("tabs-bar");
    tabBar.parentNode.insertBefore(pinnedBar, tabBar);
  }
}
ensurePinnedTabsBar();

const engines = {
  "https://search.brave.com/search?q=%s": ["Brave", "bxl-brave"],
  "https://duckduckgo.com/?q=%s": ["DuckDuckGo", "bxl-duckduckgo"],
  "https://www.google.com/search?q=%s": ["Google", "bxl-google"],
  "https://www.bing.com/search?q=%s": ["Bing", "bxl-microsoft"],
  "https://search.yahoo.com/search?p=%s": ["Yahoo", "bxl-yahoo"],
  "https://www.ecosia.org/search?q=%s": ["Ecosia", "bxl-leaf"]
};

const wispBtn = document.getElementById("wisp-btn");
const searchEngineBtn = document.getElementById("search-engine-btn");
const searchEngineIcon = document.getElementById("search-engine-icon");
const searchEngineDropdown = document.getElementById("search-engine-dropdown");
function getCurrentSearchEngine() {
  return (
    localStorage.getItem("search-engine") ||
    "https://search.brave.com/search?q=%s"
  );
}
function setCurrentSearchEngine(url) {
  localStorage.setItem("search-engine", url);
  updateSearchEngineDisplay();
}
function updateSearchEngineDisplay() {
  const current = getCurrentSearchEngine();
  const [name, icon] = engines[current] || ["Brave", "bxl-brave"];
  searchEngineIcon.className = `bx ${icon} text-2xl`;
  searchEngineBtn.title = name;
}
searchEngineBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  searchEngineDropdown.classList.toggle("hidden");
});
wispBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const wispServer =
    localStorage.getItem("wisp-server") || "wss://anura.pro/";
  const newWisp = prompt("Enter Wisp server URL:", wispServer);
  if (newWisp) {
    setWisp(newWisp);
    localStorage.setItem("wisp-server", newWisp);
    alert(`Wisp server set to: ${newWisp}`);
  }
});
document
  .querySelectorAll("#search-engine-dropdown [data-engine]")
  .forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const engine = e.currentTarget.dataset.engine;
      setCurrentSearchEngine(engine);
      searchEngineDropdown.classList.add("hidden");
      const tab = getActiveTab();
      if (tab && tab.history[tab.pointer]) {
        let v = tab.history[tab.pointer];
        if (!/^(https?:)?\/\//.test(v) && v.length > 0)
          renderTabContent(tab);
      }
    });
  });
updateSearchEngineDisplay();

const proxyToggleBtn = document.getElementById("proxy-toggle-btn");
const proxyToggleIcon = document.getElementById("proxy-toggle-icon");
const proxyDropdown = document.getElementById("proxy-dropdown");
function getCurrentProxy() {
  return localStorage.getItem("proxy-backend") || "uv";
}
function setCurrentProxy(proxy) {
  localStorage.setItem("proxy-backend", proxy);
  updateProxyToggleUI(proxy);
}
function updateProxyToggleUI(proxy) {
  if (proxy === "scram") {
    proxyToggleBtn.classList.remove("border-foam");
    proxyToggleBtn.classList.add("border-gold", "bg-gold/20");
    proxyToggleIcon.className = "bx bx-network-chart text-2xl";
    proxyToggleBtn.title = "Scramjet";
  } else {
    proxyToggleBtn.classList.remove("border-gold", "bg-gold/20");
    proxyToggleBtn.classList.add("border-foam");
    proxyToggleIcon.className = "bx bx-cloud text-2xl";
    proxyToggleBtn.title = "UV";
  }
}
proxyToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  proxyDropdown.classList.toggle("hidden");
});
document
  .querySelectorAll("#proxy-dropdown [data-proxy]")
  .forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const proxy = e.currentTarget.dataset.proxy;
      await setProxy(proxy);
      setCurrentProxy(proxy);
      proxyDropdown.classList.add("hidden");
      const tab = getActiveTab();
      if (tab) renderTabContent(tab);
    });
  });
updateProxyToggleUI(getCurrentProxy());

// --- Proxy Setup ---
let backend = getCurrentProxy();
let wisp = localStorage.getItem("wisp-server") || "wss://anura.pro/";
let transport = localStorage.getItem("proxy-transport");
setWisp(wisp);
setProxy(backend);
if (transport) setTransport(transport);
else if (navigator.userAgent.indexOf("Firefox") > 0)
  setTransport("libcurl");
else setTransport("epoxy");

// --- Tabs Logic ---
let tabs = [];
let activeTab = null;
let tabIdCounter = 1;
let closedTabsSnapshot = [];
function createTab(url = "") {
  const id = "tab-" + tabIdCounter++;
  return {
    id,
    title: url ? url : "New Tab",
    url,
    history: url ? [url] : [],
    pointer: url ? 0 : -1
  };
}
function renderTabs() {
  ensureTabsModeButton();
  ensurePinnedTabsBar();
  const tabsBar = document.getElementById("tabs-bar");
  const pinnedBar = document.getElementById("pinned-tabs-bar");

  // Split pinned/unpinned
  const pinnedTabs = tabs.filter(tab => isTabPinned(tab.id));
  const regularTabs = tabs.filter(tab => !isTabPinned(tab.id));

  // Clear
  tabsBar.innerHTML = "";
  pinnedBar.innerHTML = "";

  // Render tabs
  function renderTabElement(tab, idx, inPinnedBar) {
    const tabElement = document.createElement("div");
    tabElement.className = `
      relative flex items-center cursor-pointer select-none transition-all duration-200 group
      ${
        tab.id === activeTab
          ? "bg-highlight-med text-text border-t-2 border-foam"
          : "bg-overlay/50 text-subtle hover:bg-highlight-med/70 hover:text-text border-t-2 border-transparent"
      }
      ${isTabPinned(tab.id) ? "pinned-tab" : ""}
    `;
    tabElement.style.cssText = `
      height: 36px;
      min-width: 180px;
      max-width: 240px;
      margin-right: -8px;
      clip-path: polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%);
      padding: 0 20px 0 16px;
      z-index: ${tab.id === activeTab ? "10" : "1"};
      ${tabsMode === TAB_MODES.VERTICAL && !inPinnedBar ? "display:block;width:100%;margin:0 0 8px 0;min-width:unset;max-width:unset;" : ""}
    `;
    tabElement.setAttribute("data-tab-id", tab.id);
    const content = document.createElement("div");
    content.className = "flex items-center w-full h-full";
    const title = document.createElement("span");
    title.textContent =
      tab.title.length > 18 ? tab.title.slice(0, 15) + "..." : tab.title;
    title.className = "flex-1 truncate text-sm font-medium";
    content.appendChild(title);

    // Pin/unpin button
    const pinBtn = document.createElement("button");
    pinBtn.className =
      "ml-2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100";
    pinBtn.title = isTabPinned(tab.id) ? "Unpin Tab" : "Pin Tab";
    pinBtn.innerHTML = isTabPinned(tab.id)
      ? '<i class="bx bxs-pin"></i>'
      : '<i class="bx bx-pin"></i>';
    pinBtn.style.fontSize = "16px";
    pinBtn.onclick = (e) => {
      e.stopPropagation();
      if (isTabPinned(tab.id)) unpinTab(tab.id);
      else pinTab(tab.id);
    };
    content.appendChild(pinBtn);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.className =
      "ml-2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100";
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

    return tabElement;
  }

  // Modes
  if (tabsMode === TAB_MODES.HORIZONTAL) {
    pinnedTabs.forEach((tab, idx) =>
      pinnedBar.appendChild(renderTabElement(tab, idx, true))
    );
    regularTabs.forEach((tab, idx) =>
      tabsBar.appendChild(renderTabElement(tab, idx, false))
    );
    tabsBar.className = "flex items-end flex-1 overflow-x-auto scrollbar-hide min-h-[40px] px-2 pt-2";
    pinnedBar.className = "flex items-end overflow-x-auto scrollbar-hide min-h-[36px] px-2 py-1";
  } else {
    // VERTICAL
    pinnedTabs.forEach((tab, idx) =>
      pinnedBar.appendChild(renderTabElement(tab, idx, true))
    );
    regularTabs.forEach((tab, idx) =>
      tabsBar.appendChild(renderTabElement(tab, idx, false))
    );
    tabsBar.className = "flex flex-col items-stretch flex-1 overflow-y-auto scrollbar-hide min-w-[180px] px-2 pt-2";
    pinnedBar.className = "flex flex-col items-stretch overflow-y-auto scrollbar-hide min-w-[180px] px-2 py-1";
  }
}
function updateAddressBar(tab) {
  document.getElementById("address-bar-input").value =
    tab.history[tab.pointer] || "";
}
function renderTabContent(tab) {
  const iframe = document.getElementById("proxy-iframe");
  if (
    !tab ||
    typeof tab.pointer !== "number" ||
    tab.pointer < 0 ||
    !tab.history[tab.pointer]
  ) {
    iframe.src = "";
    return;
  }
  let url = tab.history[tab.pointer];
  let search = getCurrentSearchEngine();
  makeURLAndProxied(url, search).then((src) => {
    iframe.src = src;
  });
}
async function makeURLAndProxied(url, search) {
  try {
    let urlToLoad = makeURL(url, search);
    return await getProxied(urlToLoad);
  } catch (e) {
    return "";
  }
}
function setActiveTab(tabId) {
  activeTab = tabId;
  renderTabs();
  const tab = tabs.find((t) => t.id === tabId);
  updateAddressBar(tab);
  renderTabContent(tab);
}
function addTab(url = "") {
  const tab = createTab(url);
  tabs.push(tab);
  setActiveTab(tab.id);
}
function removeTab(tabId) {
  const idx = tabs.findIndex((t) => t.id === tabId);
  if (idx !== -1) {
    takeTabsSnapshot();
    tabs.splice(idx, 1);
    pinnedTabIds = pinnedTabIds.filter((id) => id !== tabId);
    localStorage.setItem("pinned-tabs", JSON.stringify(pinnedTabIds));
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
function updateTabHistory(tab, url) {
  if (tab.pointer < tab.history.length - 1) {
    tab.history = tab.history.slice(0, tab.pointer + 1);
  }
  tab.history.push(url);
  tab.pointer = tab.history.length - 1;
  tab.url = url;
  tab.title = url ? url : "New Tab";
}
function getActiveTab() {
  return tabs.find((t) => t.id === activeTab);
}

const addressInput = document.getElementById("address-bar-input");
const suggestionBox = document.getElementById("suggestion-box");
let suggestionActive = -1;
let currentSuggestions = [];
let suggestionFetchController = null;
addressInput.addEventListener("input", async function (e) {
  const val = addressInput.value.trim();
  if (!val || val.startsWith("http")) {
    suggestionBox.classList.add("hidden");
    suggestionBox.innerHTML = "";
    currentSuggestions = [];
    suggestionActive = -1;
    return;
  }
  const apiUrl = `https://corsproxy.io/?url=${encodeURIComponent(`https://duckduckgo.com/ac/?q=${encodeURIComponent(val)}&type=list`)}`;
  if (suggestionFetchController) suggestionFetchController.abort();
  suggestionFetchController = new AbortController();
  try {
    const resp = await fetch(apiUrl, {
      signal: suggestionFetchController.signal
    });
    if (!resp.ok) throw new Error();
    const data = await resp.json();
    let suggestionsData;
    if (data.contents) {
      if (typeof data.contents === "string") {
        suggestionsData = JSON.parse(data.contents);
      } else {
        suggestionsData = data.contents;
      }
    } else {
      suggestionsData = data;
    }
    currentSuggestions = (suggestionsData[1] || []).filter(Boolean);
    if (currentSuggestions.length === 0) {
      suggestionBox.classList.add("hidden");
      suggestionBox.innerHTML = "";
      suggestionActive = -1;
      return;
    }
    suggestionBox.innerHTML = currentSuggestions
      .map(
        (s, i) =>
          `<div class="suggestion-item${i === suggestionActive ? " active" : ""}" data-idx="${i}">${s.replace(/</g, "&lt;")}</div>`
      )
      .join("");
    suggestionBox.classList.remove("hidden");
    suggestionActive = -1;
  } catch (err) {
    suggestionBox.classList.add("hidden");
    suggestionBox.innerHTML = "";
    currentSuggestions = [];
    suggestionActive = -1;
  }
});
addressInput.addEventListener("keydown", function (e) {
  if (
    !currentSuggestions.length ||
    suggestionBox.classList.contains("hidden")
  )
    return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    suggestionActive = (suggestionActive + 1) % currentSuggestions.length;
    updateSuggestionBoxActive();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    suggestionActive =
      (suggestionActive - 1 + currentSuggestions.length) %
      currentSuggestions.length;
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
suggestionBox.addEventListener("mousedown", function (e) {
  const target = e.target.closest(".suggestion-item");
  if (target) {
    const idx = parseInt(target.dataset.idx);
    selectSuggestion(idx);
    setTimeout(() => {
      document
        .getElementById("address-bar-form")
        .dispatchEvent(new Event("submit"));
    }, 0);
  }
});
document.addEventListener("click", function (e) {
  if (!suggestionBox.contains(e.target) && e.target !== addressInput) {
    suggestionBox.classList.add("hidden");
    suggestionActive = -1;
  }
  if (!proxyDropdown.contains(e.target) && e.target !== proxyToggleBtn) {
    proxyDropdown.classList.add("hidden");
  }
  if (
    !searchEngineDropdown.contains(e.target) &&
    e.target !== searchEngineBtn
  ) {
    searchEngineDropdown.classList.add("hidden");
  }
});

document
  .getElementById("address-bar-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    suggestionBox.classList.add("hidden");
    suggestionActive = -1;
    const tab = getActiveTab();
    if (!tab) return;
    let url = addressInput.value.trim();
    if (!url) return;
    updateTabHistory(tab, url);
    renderTabs();
    renderTabContent(tab);
  });
document.getElementById("back-btn").onclick = function () {
  const tab = getActiveTab();
  if (!tab || tab.pointer <= 0) return;
  tab.pointer--;
  updateAddressBar(tab);
  renderTabContent(tab);
};
document.getElementById("forward-btn").onclick = function () {
  const tab = getActiveTab();
  if (!tab || tab.pointer >= tab.history.length - 1) return;
  tab.pointer++;
  updateAddressBar(tab);
  renderTabContent(tab);
};
document.getElementById("refresh-btn").onclick = function () {
  const tab = getActiveTab();
  if (!tab || typeof tab.pointer !== "number" || tab.pointer < 0) return;
  renderTabContent(tab);
};
function takeTabsSnapshot() {
  closedTabsSnapshot = JSON.parse(JSON.stringify(tabs));
  localStorage.setItem("last-tabs", JSON.stringify(closedTabsSnapshot));
}
function restoreTabsFromSnapshot() {
  let fromLS = localStorage.getItem("last-tabs");
  let snapshot = closedTabsSnapshot.length
    ? closedTabsSnapshot
    : fromLS
      ? JSON.parse(fromLS)
      : [];
  if (!snapshot.length) return;
  tabs = snapshot.map((tab) => ({
    ...tab,
    id: "tab-" + tabIdCounter++
  }));
  activeTab = tabs.length ? tabs[0].id : null;
  renderTabs();
  setActiveTab(activeTab);
  closedTabsSnapshot = [];
  localStorage.removeItem("last-tabs");
}
const menuBtn = document.getElementById("menu-btn");
const dropdown = document.getElementById("dropdown-menu");
menuBtn.onclick = (e) => {
  dropdown.classList.toggle("hidden");
  e.stopPropagation();
};
window.onclick = (e) => {
  if (!dropdown.contains(e.target) && e.target !== menuBtn)
    dropdown.classList.add("hidden");
};
document.getElementById("clear-history-btn").onclick = function () {
  const tab = getActiveTab();
  if (!tab) return;
  tab.history = [];
  tab.pointer = -1;
  tab.url = "New Tab";
  tab.title = "New Tab";
  updateAddressBar(tab);
  renderTabContent(tab);
  dropdown.classList.add("hidden");
};
document.getElementById("close-all-tabs-btn").onclick = function () {
  if (tabs.length > 0) takeTabsSnapshot();
  tabs = [];
  activeTab = null;
  renderTabs();
  document.getElementById("proxy-iframe").src = "";
  document.getElementById("address-bar-input").value = "";
  dropdown.classList.add("hidden");
};
document.getElementById("restore-tabs-btn").onclick = function () {
  restoreTabsFromSnapshot();
  dropdown.classList.add("hidden");
};
document
  .getElementById("new-tab-btn")
  .addEventListener("click", () => addTab());

const historyBtn = document.getElementById("history-btn");
const historyModalBg = document.getElementById("history-modal-bg");
const historyModal = document.getElementById("history-modal");
const modalHistoryList = document.getElementById("modal-history-list");
const closeHistoryModalBtn = document.getElementById("close-history-modal");
historyBtn.onclick = (e) => {
  renderModalHistoryList();
  openHistoryModal();
  e.stopPropagation();
};
closeHistoryModalBtn.onclick = closeHistoryModal;
historyModalBg.onclick = function (e) {
  if (e.target === historyModalBg) closeHistoryModal();
};
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
    modalHistoryList.innerHTML =
      "<div class='text-muted italic text-center py-4'>No history for this tab.</div>";
    return;
  }
  tab.history.forEach((url, idx) => {
    const row = document.createElement("div");
    row.className = `flex items-center justify-between p-3 rounded-lg hover:bg-highlight-med cursor-pointer transition-colors ${idx === tab.pointer ? "bg-foam/20 border border-foam" : ""}`;
    row.innerHTML = `<span class="flex-1 ${idx === tab.pointer ? "text-foam font-bold" : ""} truncate">${url}</span>`;
    row.onclick = () => {
      tab.pointer = idx;
      updateAddressBar(tab);
      renderTabContent(tab);
      closeHistoryModal();
    };
    if (tab.history.length > 1) {
      const rmBtn = document.createElement("button");
      rmBtn.className = "ml-2 text-muted hover:text-love";
      rmBtn.title = "Remove from history";
      rmBtn.textContent = "✕";
      rmBtn.onclick = (e) => {
        e.stopPropagation();
        tab.history.splice(idx, 1);
        if (tab.pointer >= tab.history.length)
          tab.pointer = tab.history.length - 1;
        renderModalHistoryList();
      };
      row.appendChild(rmBtn);
    }
    modalHistoryList.appendChild(row);
  });
}

// -- Keyboard Shortcuts --
document.addEventListener("keydown", (e) => {
  if (
    (e.ctrlKey || e.metaKey) &&
    !e.shiftKey &&
    e.key.toLowerCase() === "t"
  ) {
    e.preventDefault();
    addTab();
  }
  if (
    (e.ctrlKey || e.metaKey) &&
    !e.shiftKey &&
    e.key.toLowerCase() === "w"
  ) {
    e.preventDefault();
    if (activeTab) removeTab(activeTab);
  }
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "Tab") {
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.id === activeTab);
    if (tabs.length > 1 && idx !== -1)
      setActiveTab(tabs[(idx + 1) % tabs.length].id);
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Tab") {
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.id === activeTab);
    if (tabs.length > 1 && idx !== -1)
      setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length].id);
  }
  if (e.altKey && !e.shiftKey && e.key === "ArrowLeft")
    document.getElementById("back-btn").click();
  if (e.altKey && !e.shiftKey && e.key === "ArrowRight")
    document.getElementById("forward-btn").click();
  // Toggle tab layout mode
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "l") {
    e.preventDefault();
    toggleTabsMode();
  }
});

// -- INIT --
if (tabs.length === 0) addTab();

const tabsContainer = document.getElementById("tabs-bar");
new Sortable(tabsContainer, {
  animation: 150,
  onEnd: function (evt) {
    const { oldIndex, newIndex } = evt;
    if (oldIndex === newIndex) return;
    const [movedTab] = tabs.splice(oldIndex, 1);
    tabs.splice(newIndex, 0, movedTab);
    renderTabs();
  }
});
