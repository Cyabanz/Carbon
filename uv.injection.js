// Start with the base uv.client.js from Ultraviolet
// Add this line at the end to load your injector.js
const script = document.createElement("script");
script.src = "/injector.js";
document.documentElement.appendChild(script);
