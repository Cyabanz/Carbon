//////////////////////////////
///          Init          ///
//////////////////////////////

await import("/scram/scramjet.shared.js")
await import("/scram/scramjet.controller.js")

const scramjet = new ScramjetController({
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
})

scramjet.init()

import * as BareMux from "https://cdn.jsdelivr.net/gh/Coding4Hours/cdn/bare-mux/index.mjs"

//////////////////////////////
///         Options        ///
//////////////////////////////

let wispURL = null
let transportURL = null
let proxyOption = null

const transportOptions = {
  epoxy:
    "https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport/dist/index.mjs",
  libcurl:
    "https://cdn.jsdelivr.net/npm/@mercuryworkshop/libcurl-transport/dist/index.mjs",
}

//////////////////////////////
///           SW           ///
//////////////////////////////
const stockSW = "./ultraworker.js"
const swAllowedHostnames = ["localhost", "127.0.0.1"]

async function waitForSWReady(timeout = 8000) {
  // Wait for the Service Worker to be active and controlling the page
  if (!("serviceWorker" in navigator)) {
    if (
      location.protocol !== "https:" &&
      !swAllowedHostnames.includes(location.hostname)
    )
      throw new Error("Service workers cannot be registered without https.")
    throw new Error("Your browser doesn't support service workers.")
  }

  // Register if needed
  let registration = await navigator.serviceWorker.getRegistration();
  if (!registration) registration = await navigator.serviceWorker.register(stockSW)

  // Wait for activation and for this page to be controlled
  const start = Date.now()
  while (
    (!registration.active && !registration.waiting) ||
    !navigator.serviceWorker.controller
  ) {
    await new Promise((r) => setTimeout(r, 100))
    if (Date.now() - start > timeout)
      throw new Error("Timeout waiting for Service Worker to activate")
    registration = await navigator.serviceWorker.getRegistration();
  }
  // If not controlled after activation, reload once (should never loop infinitely)
  if (!navigator.serviceWorker.controller) {
    location.reload()
    throw new Error("Reloading to claim Service Worker control")
  }
  return registration
}

let connection = null
async function getBareMuxConnection(retries = 10, delay = 300) {
  // Wait for SW before constructing connection
  await waitForSWReady()
  let lastError
  for (let i = 0; i < retries; ++i) {
    try {
      connection = new BareMux.BareMuxConnection("/bareworker.js")
      // Try a client probe or handshake if available
      // If there's a connect() or open() method, call it and await.
      if (typeof connection.connect === "function") await connection.connect()
      return connection
    } catch (e) {
      lastError = e
      await new Promise((r) => setTimeout(r, delay))
    }
  }
  throw lastError || new Error("Unable to connect to bare-mux after retries")
}

//////////////////////////////
///        Functions       ///
//////////////////////////////
export function makeURL(
  input,
  template = "https://search.brave.com/search?q=%s",
) {
  try {
    return new URL(input).toString()
  } catch (err) {}

  const url = new URL(`http://${input}`)
  if (url.hostname.includes(".")) return url.toString()

  return template.replace("%s", encodeURIComponent(input))
}

async function updateBareMux() {
  if (transportURL != null && wispURL != null) {
    // Ensure connection is ready
    if (!connection) connection = await getBareMuxConnection()
    await connection.setTransport(transportURL, [{ wisp: wispURL }])
  }
}

export async function setTransport(transport) {
  transportURL = transportOptions[transport]
  if (!transportURL) {
    transportURL = transport
  }
  await updateBareMux()
}

export function getTransport() {
  return transportURL
}

export async function setWisp(wisp) {
  wispURL = wisp
  await updateBareMux()
}

export function getWisp() {
  return wispURL
}

export async function setProxy(proxy) {
  if (proxy === "uv") {
    await import("https://cdn.jsdelivr.net/gh/Coding4Hours/cdn/uv/uv.bundle.js")
    await import("./uv.config.js")
  } else {
    import("/scram/scramjet.worker.js")
  }
  proxyOption = proxy
}

export function getProxy() {
  return proxyOption
}

export async function getProxied(input) {
  const url = makeURL(input)
  if (proxyOption === "scram") return scramjet.encodeUrl(url)
  // Ensure bare-mux is ready before using UV!
  if (!connection) connection = await getBareMuxConnection()
  return __uv$config.prefix + __uv$config.encodeUrl(url)
}
