// == Carbon Proxy Main Script ==
// (Place this file in your /public or root as lethal.proxy.carbon.js)
// All logic: tabs, proxy toggle, search engine dropdown, suggestions, modal, snapshot, history

// ---- BEGIN LETHAL IMPORTS ----
import {
  makeURL,
  getProxied,
  setProxy,
  setTransport,
  setWisp,
} from "/lethal.mjs";
// ---- END LETHAL IMPORTS ----

const engines = {
  "https://search.brave.com/search?q=%s": "Brave",
  "https://duckduckgo.com/?q=%s": "DuckDuckGo",
  "https://www.google.com/search?q=%s": "Google",
  "https://www.bing.com/search?q=%s": "Bing",
  "https://search.yahoo.com/search?p=%s": "Yahoo",
  "https://www.ecosia.org/search?q=%s": "Ecosia"
};

// -- Search Engine Dropdown --
const searchEngineBtn = document.getElementById("search-engine-btn");
const searchEngineText = document.getElementById("search-engine-text");
const searchEngineDropdown = document.getElementById("search-engine-dropdown");

function getCurrentSearchEngine() {
  return localStorage.getItem("search-engine") || "https://search.brave.com/search?q=%s";
}
function setCurrentSearchEngine(url) {
  localStorage.setItem("search-engine", url);
  searchEngineText.textContent = engines[url] || "Unknown";
}
function updateSearchEngineDisplay() {
  const current = getCurrentSearchEngine();
  searchEngineText.textContent = engines[current] || "Brave";
}
searchEngineBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  searchEngineDropdown.classList.toggle("hidden");
  const arrow = searchEngineBtn.querySelector("svg");
  arrow.style.transform = searchEngineDropdown.classList.contains("hidden") ? "rotate(0deg)" : "rotate(180deg)";
});
document.querySelectorAll("[data-engine]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const engine = e.target.dataset.engine;
    setCurrentSearchEngine(engine);
    searchEngineDropdown.classList.add("hidden");
    const arrow = searchEngineBtn.querySelector("svg");
    arrow.style.transform = "rotate(0deg)";
    const tab = getActiveTab();
    if (tab && tab.history[tab.pointer]) {
      let v = tab.history[tab.pointer];
      if (!/^(https?:)?\/\//.test(v) && v.length > 0) renderTabContent(tab);
    }
  });
});
updateSearchEngineDisplay();

// -- Proxy Toggle Button --
const proxyToggleBtn = document.getElementById("proxy-toggle-btn");
const proxyToggleText = document.getElementById("proxy-toggle-text");
function updateProxyToggleUI(backend) {
  if (backend === "scram") {
    proxyToggleBtn.classList.remove('border-cyan-400');
    proxyToggleBtn.classList.add('border-yellow-400', 'bg-yellow-500/20');
    proxyToggleText.textContent = "Scramjet";
  } else {
    proxyToggleBtn.classList.remove('border-yellow-400', 'bg-yellow-500/20');
    proxyToggleBtn.classList.add('border-cyan-400');
    proxyToggleText.textContent = "UV";
  }
}
proxyToggleBtn.addEventListener("click", async function() {
  const currentBackend = localStorage.getItem("proxy-backend") || "uv";
  const newBackend = currentBackend === "uv" ? "scram" : "uv";
  await setProxy(newBackend);
  localStorage.setItem("proxy-backend", newBackend);
  updateProxyToggleUI(newBackend);
  const tab = getActiveTab();
  if (tab) renderTabContent(tab);
});
let initialBackend = localStorage.getItem("proxy-backend") || "uv";
updateProxyToggleUI(initialBackend);

// ---- Proxy Setup ----
let backend = localStorage.getItem("proxy-backend") || "uv";
let wisp = localStorage.getItem("wisp-server") || "wss://anura.pro/";
let transport = localStorage.getItem("proxy-transport");
setWisp(wisp);
setProxy(backend);
if (transport) setTransport(transport);
else if (navigator.userAgent.indexOf("Firefox") > 0) setTransport("libcurl");
else setTransport("epoxy");

// -- Tabs Logic --
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
    title.textContent = tab.title.length > 18 ? tab.title.slice(0, 15) + "..." : tab.title;
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
  document.getElementById("address-bar-input").value = tab.history[tab.pointer] || "";
}
function renderTabContent(tab) {
  const iframe = document.getElementById("proxy-iframe");
  if (!tab || typeof tab.pointer !== "number" || tab.pointer < 0 || !tab.history[tab.pointer]) {
    iframe.src = "";
    return;
  }
  let url = tab.history[tab.pointer];
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
  if (tab.pointer < tab.history.length - 1) {
    tab.history = tab.history.slice(0, tab.pointer + 1);
  }
  tab.history.push(url);
  tab.pointer = tab.history.length - 1;
  tab.url = url;
  tab.title = url ? url : "New Tab";
}
function getActiveTab() { return tabs.find(t => t.id === activeTab); }

// -- DuckDuckGo Search Suggestions (with CORS proxy for Vercel) --
const addressInput = document.getElementById("address-bar-input");
const suggestionBox = document.getElementById("suggestion-box");
let suggestionActive = -1;
let currentSuggestions = [];
let suggestionFetchController = null;
addressInput.addEventListener("input", async function(e) {
  const val = addressInput.value.trim();
  if (!val || val.startsWith("http")) {
    suggestionBox.classList.add("hidden");
    suggestionBox.innerHTML = "";
    currentSuggestions = [];
    suggestionActive = -1;
    return;
  }
  // DuckDuckGo with CORS proxy (for Vercel)
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
});

// -- Form/Navigation --
document.getElementById("address-bar-form").addEventListener("submit", async function(event) {
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
  const homepage = "";
  updateTabHistory(tab, homepage);
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
const menuBtn = document.getElementById("menu-btn");
const dropdown = document.getElementById("dropdown-menu");
menuBtn.onclick = (e) => { dropdown.classList.toggle("hidden"); e.stopPropagation(); };
window.onclick = (e) => {
  if (!dropdown.contains(e.target) && e.target !== menuBtn) dropdown.classList.add("hidden");
  if (!searchEngineDropdown.contains(e.target) && e.target !== searchEngineBtn) {
    searchEngineDropdown.classList.add("hidden");
    const arrow = searchEngineBtn.querySelector("svg");
    arrow.style.transform = "rotate(0deg)";
  }
  closeHistoryModal();
};
document.getElementById("clear-history-btn").onclick = function() {
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
document.getElementById("close-all-tabs-btn").onclick = function() {
  if (tabs.length > 0) takeTabsSnapshot();
  tabs = [];
  activeTab = null;
  renderTabs();
  document.getElementById("proxy-iframe").src = "";
  document.getElementById("address-bar-input").value = "";
  dropdown.classList.add("hidden");
};
document.getElementById("restore-tabs-btn").onclick = function() {
  restoreTabsFromSnapshot();
  dropdown.classList.add("hidden");
};
document.getElementById("new-tab-btn").addEventListener("click", () => addTab());

// -- History Modal Logic --
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

// -- Keyboard Shortcuts --
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "t") {
    e.preventDefault(); addTab();
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
});

// -- INIT --
window.addEventListener("DOMContentLoaded", () => {
  if (tabs.length === 0) addTab();
});
