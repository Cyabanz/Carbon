// --- Inlined for performance lol ---
import {
  makeURL,
  getProxied,
  setProxy,
  setTransport,
  setWisp,
} from "/lethal.mjs";
// --- END LETHAL IMPORTS ---

const engines = {
  "https://search.brave.com/search?q=%s": ["Brave", "bxl-brave"],
  "https://duckduckgo.com/?q=%s": ["DuckDuckGo", "bxl-duckduckgo"],
  "https://www.google.com/search?q=%s": ["Google", "bxl-google"],
  "https://www.bing.com/search?q=%s": ["Bing", "bxl-microsoft"],
  "https://search.yahoo.com/search?p=%s": ["Yahoo", "bxl-yahoo"],
  "https://www.ecosia.org/search?q=%s": ["Ecosia", "bxl-leaf"],
};

// --- Search Engine Dropdown as Boxicon Button ---
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
      const tab = tabManager.getActiveTab();
      if (tab && tab.history[tab.pointer]) {
        let v = tab.history[tab.pointer];
        if (!/^(https?:)?\/\//.test(v) && v.length > 0)
          tabManager.renderTabContent(tab);
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
      const tab = tabManager.getActiveTab();
      if (tab) tabManager.renderTabContent(tab);
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

/* --- TABS LOGIC WITH HORIZONTAL/VERTICAL TOGGLE AND PINNED TABS --- */
class TabManager {
  constructor() {
    this.tabs = [];
    this.activeTabId = null;
    this.nextTabId = 1;
    this.closedTabsSnapshot = [];
    this.isVerticalLayout = false;
    this.setupTabContainers();
    this.init();
  }

  setupTabContainers() {
    // Set up horizontal and vertical containers if not present
    this.horizontalBar = document.getElementById("tabs-bar");
    // Vertical sidebar: add if missing (dynamic for retrofitting)
    if (!document.getElementById("vertical-tab-sidebar")) {
      const sidebar = document.createElement("div");
      sidebar.id = "vertical-tab-sidebar";
      sidebar.className =
        "hidden bg-overlay/80 border-r border-highlight-med/50 w-64 flex-shrink-0";
      sidebar.innerHTML = `
        <div class="p-2">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-muted uppercase tracking-wide">Tabs</h3>
            <button
              id="new-tab-btn-vertical"
              class="w-6 h-6 rounded bg-transparent hover:bg-highlight-med text-muted hover:text-text font-bold text-sm transition-all duration-200 flex items-center justify-center"
              title="New Tab (Ctrl+T)"
            >+</button>
          </div>
          <div
            id="vertical-tabs-container"
            class="vertical-tabs space-y-1 max-h-96 overflow-y-auto scrollbar-hide"
          ></div>
        </div>
      `;
      // Insert before main content area (find main container)
      const mainContainer = document.querySelector("#main-container") || document.querySelector(".bg-surface/90");
      if (mainContainer && mainContainer.firstElementChild) {
        mainContainer.insertBefore(sidebar, mainContainer.firstElementChild);
      }
    }
    this.verticalSidebar = document.getElementById("vertical-tab-sidebar");
    this.verticalContainer = document.getElementById("vertical-tabs-container");
    // Add toggle button if not present
    if (!document.getElementById("tab-layout-toggle")) {
      const horizontalTabBar = this.horizontalBar.parentElement;
      const toggleBtn = document.createElement("button");
      toggleBtn.id = "tab-layout-toggle";
      toggleBtn.className =
        "flex-shrink-0 w-8 h-8 rounded bg-transparent hover:bg-highlight-med text-muted hover:text-text transition-all duration-200 flex items-center justify-center mx-2";
      toggleBtn.title = "Switch to Vertical Tabs";
      toggleBtn.innerHTML = `<i id="tab-layout-icon" class="bx bx-layout text-lg"></i>`;
      horizontalTabBar.insertBefore(toggleBtn, this.horizontalBar);
      // Wire up event
      toggleBtn.addEventListener("click", () => this.toggleTabLayout());
    }
    // Add new vertical tab button event
    document.getElementById("new-tab-btn-vertical").addEventListener("click", () => {
      this.createNewTab("New Tab", "");
    });
  }

  init() {
    this.setupEventListeners();
    this.createNewTab("New Tab", "");
  }

  setupEventListeners() {
    // Tab layout toggle already wired up in setupTabContainers()
    // New tab (horizontal)
    const newTabBtn = document.getElementById("new-tab-btn");
    if (newTabBtn) {
      newTabBtn.addEventListener("click", () => this.createNewTab("New Tab", ""));
    }
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        this.createNewTab("New Tab", "");
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "w") {
        e.preventDefault();
        if (this.tabs.length > 1) {
          this.closeTab(this.activeTabId);
        }
      }
      // Tab focus cycling
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "Tab") {
        e.preventDefault();
        const idx = this.tabs.findIndex((t) => t.id === this.activeTabId);
        if (this.tabs.length > 1 && idx !== -1)
          this.switchToTab(this.tabs[(idx + 1) % this.tabs.length].id);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Tab") {
        e.preventDefault();
        const idx = this.tabs.findIndex((t) => t.id === this.activeTabId);
        if (this.tabs.length > 1 && idx !== -1)
          this.switchToTab(this.tabs[(idx - 1 + this.tabs.length) % this.tabs.length].id);
      }
    });
  }

  toggleTabLayout() {
    this.isVerticalLayout = !this.isVerticalLayout;
    const icon = document.getElementById("tab-layout-icon");
    if (this.isVerticalLayout) {
      this.verticalSidebar.classList.remove("hidden");
      this.horizontalBar.parentElement.classList.add("hidden");
      icon.className = "bx bx-columns text-lg";
      icon.parentElement.title = "Switch to Horizontal Tabs";
    } else {
      this.verticalSidebar.classList.add("hidden");
      this.horizontalBar.parentElement.classList.remove("hidden");
      icon.className = "bx bx-layout text-lg";
      icon.parentElement.title = "Switch to Vertical Tabs";
    }
    this.renderTabs();
  }

  createNewTab(title, url) {
    const tab = {
      id: "tab-" + this.nextTabId++,
      title: title || "New Tab",
      url: url || "",
      history: url ? [url] : [],
      pointer: url ? 0 : -1,
      isPinned: false,
      favicon: "bx bx-globe",
    };
    this.tabs.push(tab);
    this.activeTabId = tab.id;
    this.renderTabs();
    this.updateAddressBar(tab);
    this.renderTabContent(tab);
    return tab;
  }

  closeTab(tabId) {
    const tabIndex = this.tabs.findIndex((t) => t.id === tabId);
    if (tabIndex === -1) return;
    this.takeTabsSnapshot();
    this.tabs.splice(tabIndex, 1);
    if (this.activeTabId === tabId) {
      if (this.tabs.length > 0) {
        const newActiveIndex = tabIndex >= this.tabs.length ? this.tabs.length - 1 : tabIndex;
        this.activeTabId = this.tabs[newActiveIndex].id;
      } else {
        this.activeTabId = null;
      }
    }
    this.renderTabs();
    if (this.activeTabId) {
      const tab = this.tabs.find((t) => t.id === this.activeTabId);
      this.updateAddressBar(tab);
      this.renderTabContent(tab);
    } else {
      document.getElementById("proxy-iframe").src = "";
      document.getElementById("address-bar-input").value = "";
    }
  }

  togglePinTab(tabId) {
    const tab = this.tabs.find((t) => t.id === tabId);
    if (tab) {
      tab.isPinned = !tab.isPinned;
      // Move pinned tabs to the beginning
      this.tabs.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
      this.renderTabs();
    }
  }

  switchToTab(tabId) {
    this.activeTabId = tabId;
    this.renderTabs();
    const tab = this.tabs.find((t) => t.id === tabId);
    this.updateAddressBar(tab);
    this.renderTabContent(tab);
  }

  renderTabs() {
    // Render both horizontal and vertical at once for dynamic switch
    this.horizontalBar.innerHTML = "";
    this.verticalContainer.innerHTML = "";
    this.tabs.forEach((tab) => {
      const horizontalTabEl = this.createTabElement(tab, false);
      const verticalTabEl = this.createTabElement(tab, true);
      this.horizontalBar.appendChild(horizontalTabEl);
      this.verticalContainer.appendChild(verticalTabEl);
    });
    // Show only the active layout
    if (this.isVerticalLayout) {
      this.verticalSidebar.classList.remove("hidden");
      this.horizontalBar.parentElement.classList.add("hidden");
    } else {
      this.verticalSidebar.classList.add("hidden");
      this.horizontalBar.parentElement.classList.remove("hidden");
    }
  }

  createTabElement(tab, vertical = false) {
    const tabDiv = document.createElement("div");
    tabDiv.className = `tab-item ${tab.id === this.activeTabId ? "active" : ""} ${tab.isPinned ? "pinned" : ""}`;
    tabDiv.setAttribute("data-tab-id", tab.id);
    // Style for vertical tabs
    if (vertical) tabDiv.style.width = "100%";
    const favicon = document.createElement("i");
    favicon.className = `${tab.favicon} text-sm text-foam`;

    const title = document.createElement("span");
    title.className = 'tab-title text-sm text-text truncate';
    title.textContent = tab.title;

    const pinBtn = document.createElement("button");
    pinBtn.className = 'tab-pin-btn text-xs text-muted hover:text-gold transition-colors';
    pinBtn.innerHTML = `<i class="bx ${tab.isPinned ? "bxs-pin" : "bx-pin"} text-xs"></i>`;
    pinBtn.title = tab.isPinned ? "Unpin Tab" : "Pin Tab";

    const closeBtn = document.createElement("button");
    closeBtn.className = 'tab-close-btn text-xs text-muted hover:text-love transition-colors';
    closeBtn.innerHTML = '<i class="bx bx-x text-sm"></i>';
    closeBtn.title = 'Close Tab';

    // Click events
    tabDiv.addEventListener("click", (e) => {
      if (e.target === closeBtn || e.target.closest('.tab-close-btn')) return;
      if (e.target === pinBtn || e.target.closest('.tab-pin-btn')) return;
      this.switchToTab(tab.id);
    });
    pinBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.togglePinTab(tab.id);
    });
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.tabs.length > 1) {
        this.closeTab(tab.id);
      }
    });

    tabDiv.appendChild(favicon);
    if (!tab.isPinned || vertical) {
      tabDiv.appendChild(title);
    }
    if (!tab.isPinned) {
      tabDiv.appendChild(pinBtn);
      tabDiv.appendChild(closeBtn);
    }
    return tabDiv;
  }

  updateTabTitle(tabId, title) {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.title = title;
      this.renderTabs();
    }
  }

  updateTabFavicon(tabId, favicon) {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.favicon = favicon;
      this.renderTabs();
    }
  }

  updateTabHistory(tab, url) {
    if (tab.pointer < tab.history.length - 1) {
      tab.history = tab.history.slice(0, tab.pointer + 1);
    }
    tab.history.push(url);
    tab.pointer = tab.history.length - 1;
    tab.url = url;
    tab.title = url ? url : "New Tab";
    this.renderTabs();
  }

  getActiveTab() {
    return this.tabs.find((t) => t.id === this.activeTabId);
  }

  updateAddressBar(tab) {
    document.getElementById("address-bar-input").value =
      tab && tab.history[tab.pointer] ? tab.history[tab.pointer] : "";
  }

  async renderTabContent(tab) {
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
    try {
      let urlToLoad = makeURL(url, search);
      iframe.src = await getProxied(urlToLoad);
    } catch (e) {
      iframe.src = "";
    }
  }

  takeTabsSnapshot() {
    this.closedTabsSnapshot = JSON.parse(JSON.stringify(this.tabs));
    localStorage.setItem("last-tabs", JSON.stringify(this.closedTabsSnapshot));
  }

  restoreTabsFromSnapshot() {
    let fromLS = localStorage.getItem("last-tabs");
    let snapshot = this.closedTabsSnapshot.length
      ? this.closedTabsSnapshot
      : fromLS
        ? JSON.parse(fromLS)
        : [];
    if (!snapshot.length) return;
    this.tabs = snapshot.map((tab) => ({
      ...tab,
      id: "tab-" + this.nextTabId++,
    }));
    this.activeTabId = this.tabs.length ? this.tabs[0].id : null;
    this.renderTabs();
    if (this.activeTabId) {
      const tab = this.tabs.find((t) => t.id === this.activeTabId);
      this.updateAddressBar(tab);
      this.renderTabContent(tab);
    }
    this.closedTabsSnapshot = [];
    localStorage.removeItem("last-tabs");
  }
}

// --- Initialize singleton TabManager
const tabManager = new TabManager();

// --- Address bar, suggestions, navigation, menu, history (mostly as in your code) ---
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
      signal: suggestionFetchController.signal,
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
          `<div class="suggestion-item${i === suggestionActive ? " active" : ""}" data-idx="${i}">${s.replace(/</g, "&lt;")}</div>`,
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
document.getElementById("address-bar-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  suggestionBox.classList.add("hidden");
  suggestionActive = -1;
  const tab = tabManager.getActiveTab();
  if (!tab) return;
  let url = addressInput.value.trim();
  if (!url) return;
  tabManager.updateTabHistory(tab, url);
  tabManager.renderTabContent(tab);
});
document.getElementById("back-btn").onclick = function () {
  const tab = tabManager.getActiveTab();
  if (!tab || tab.pointer <= 0) return;
  tab.pointer--;
  tabManager.updateAddressBar(tab);
  tabManager.renderTabContent(tab);
};
document.getElementById("forward-btn").onclick = function () {
  const tab = tabManager.getActiveTab();
  if (!tab || tab.pointer >= tab.history.length - 1) return;
  tab.pointer++;
  tabManager.updateAddressBar(tab);
  tabManager.renderTabContent(tab);
};
document.getElementById("refresh-btn").onclick = function () {
  const tab = tabManager.getActiveTab();
  if (!tab || typeof tab.pointer !== "number" || tab.pointer < 0) return;
  tabManager.renderTabContent(tab);
};
function takeTabsSnapshot() {
  tabManager.takeTabsSnapshot();
}
function restoreTabsFromSnapshot() {
  tabManager.restoreTabsFromSnapshot();
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
  const tab = tabManager.getActiveTab();
  if (!tab) return;
  tab.history = [];
  tab.pointer = -1;
  tab.url = "New Tab";
  tab.title = "New Tab";
  tabManager.updateAddressBar(tab);
  tabManager.renderTabContent(tab);
  dropdown.classList.add("hidden");
};
document.getElementById("close-all-tabs-btn").onclick = function () {
  if (tabManager.tabs.length > 0) tabManager.takeTabsSnapshot();
  tabManager.tabs = [];
  tabManager.activeTabId = null;
  tabManager.renderTabs();
  document.getElementById("proxy-iframe").src = "";
  document.getElementById("address-bar-input").value = "";
  dropdown.classList.add("hidden");
};
document.getElementById("restore-tabs-btn").onclick = function () {
  tabManager.restoreTabsFromSnapshot();
  dropdown.classList.add("hidden");
};

/* --- History Modal --- */
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
  const tab = tabManager.getActiveTab();
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
      tabManager.updateAddressBar(tab);
      tabManager.renderTabContent(tab);
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

// --- Drag-and-drop for horizontal tabs ---
const tabsContainer = document.getElementById("tabs-bar");
new Sortable(tabsContainer, {
  animation: 150,
  onEnd: function (evt) {
    const { oldIndex, newIndex } = evt;
    if (oldIndex === newIndex) return;
    const [movedTab] = tabManager.tabs.splice(oldIndex, 1);
    tabManager.tabs.splice(newIndex, 0, movedTab);
    tabManager.renderTabs();
  },
});

// -- INIT --
if (tabManager.tabs.length === 0) tabManager.createNewTab("New Tab", "");

// Example: create a pinned demo tab
setTimeout(() => {
  const demoTab = tabManager.createNewTab('GitHub', 'https://github.com');
  tabManager.createNewTab('Stack Overflow', 'https://stackoverflow.com');
  tabManager.togglePinTab(demoTab.id);
}, 500);