"use strict";

const statusText = document.querySelector("#status");
const statusDot = document.querySelector("#status-dot");
const toggleButton = document.querySelector("#toggle");
const hint = document.querySelector("#hint");
let tabId;

function update(state) {
  if (!state?.available) {
    statusText.textContent = "Open a video to get started";
    statusDot.classList.remove("ready");
    toggleButton.disabled = true;
    return;
  }
  statusText.textContent = state.active ? "Vertical mode is on" : "Your video is ready";
  statusDot.classList.add("ready");
  toggleButton.disabled = false;
  toggleButton.replaceChildren(document.createTextNode(state.active ? "Exit Vertical mode" : "Enable in this tab"));
  const arrow = document.createElement("span");
  arrow.textContent = state.active ? "×" : "↗";
  arrow.setAttribute("aria-hidden", "true");
  toggleButton.append(arrow);
  hint.textContent = state.active ? "Adjust your frame from the player." : "Window mode. Use the player button for fullscreen.";
}

async function connect() {
  if (!globalThis.chrome?.tabs) return;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    tabId = tab?.id;
    if (tabId == null) return;
    const state = await chrome.tabs.sendMessage(tabId, { type: "YTVM_STATUS" }, { frameId: 0 });
    update(state);
  } catch {
    statusText.textContent = "Open YouTube or reload your video";
  }
}

toggleButton.addEventListener("click", async () => {
  toggleButton.disabled = true;
  try {
    update(await chrome.tabs.sendMessage(tabId, { type: "YTVM_TOGGLE_WINDOW" }, { frameId: 0 }));
  } catch {
    update(null);
    statusText.textContent = "Reload YouTube to connect the extension";
  }
});

void connect();
