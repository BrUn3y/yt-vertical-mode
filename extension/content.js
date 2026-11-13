(() => {
  "use strict";
  if (globalThis.__ytVerticalModeLoaded) return;
  globalThis.__ytVerticalModeLoaded = true;

  const { clamp, calculateFrame } = globalThis.YTVerticalGeometry;
  const storageKey = "ytvmSettings";
  const portraitIcon = '<svg viewBox="0 0 24 28" fill="none" aria-hidden="true"><rect x="5" y="2" width="14" height="24" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="m10 10 5 4-5 4z" fill="currentColor"/></svg>';
  let player = null;
  let video = null;
  let button = null;
  let overlay = null;
  let ui = null;
  let active = false;
  let ownsFullscreen = false;
  let settings = { crop: 100, position: 50 };
  let saveTimer;
  let scanFrame;
  let layoutFrame;
  let toastTimer;
  let revision = 0;
  let session = 0;
  let restoreFocus = null;

  const isWatchPage = () => location.pathname === "/watch" || /^\/(embed|live)\//.test(location.pathname);

  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try { chrome.storage.local.set({ [storageKey]: settings }).catch(() => {}); } catch { /* Extension reloaded. */ }
    }, 160);
  }

  function changeSettings(patch) {
    revision++;
    settings = {
      crop: clamp(patch.crop ?? settings.crop, 100),
      position: clamp(patch.position ?? settings.position)
    };
    renderSettings();
    scheduleLayout();
    persist();
  }

  function renderSettings() {
    if (!ui) return;
    ui.querySelector("#crop").value = settings.crop;
    ui.querySelector("#position").value = settings.position;
    ui.querySelector("#crop-value").textContent = `${Math.round(settings.crop)}%`;
    ui.querySelector("#position-value").textContent = settings.position === 50 ? "Center" : `${Math.round(settings.position)}%`;
    ui.querySelector("#fill").setAttribute("aria-pressed", String(settings.crop === 100));
    ui.querySelector("#fit").setAttribute("aria-pressed", String(settings.crop === 0));
  }

  function layout() {
    layoutFrame = null;
    if (!active || !player || !video) return;
    const frame = calculateFrame(player.clientWidth, player.clientHeight, video.videoWidth, video.videoHeight, settings.crop, settings.position);
    if (!frame) return; // Wait for actual metadata; never guess the video's aspect ratio.
    for (const key of ["width", "height", "left", "top"]) {
      const value = `${frame[key]}px`;
      if (player.style.getPropertyValue(`--ytvm-${key}`) !== value) player.style.setProperty(`--ytvm-${key}`, value);
    }
    ui.querySelector("#position").disabled = !frame.canPan;
    ui.querySelector("#pan-help").textContent = frame.canPan ? "Choose the part of the video you want to see." : "Increase the crop to move the frame.";
  }

  function scheduleLayout() {
    if (layoutFrame == null) layoutFrame = requestAnimationFrame(layout);
  }

  function notify(message) {
    if (!ui) return;
    const toast = ui.querySelector("#toast");
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4200);
  }

  function setPanel(open, focus = false) {
    if (!ui) return;
    ui.querySelector("#panel").hidden = !open;
    ui.querySelector("#adjust").setAttribute("aria-expanded", String(open));
    if (focus) ui.querySelector(open ? "#close-panel" : "#adjust").focus();
  }

  function exit({ fullscreen = true, focus = true } = {}) {
    if (!active) return;
    active = false;
    session++;
    const shouldExit = ownsFullscreen && document.fullscreenElement === player;
    ownsFullscreen = false;
    player?.removeAttribute("data-ytvm-active");
    document.documentElement.classList.remove("ytvm-active");
    button?.setAttribute("aria-pressed", "false");
    button?.setAttribute("title", "Vertical mode (Alt + Shift + V)");
    setPanel(false);
    clearTimeout(toastTimer);
    if (ui) ui.querySelector("#toast").hidden = true;
    if (fullscreen && shouldExit) document.exitFullscreen().catch(() => {});
    if (focus && restoreFocus?.isConnected) restoreFocus.focus({ preventScroll: true });
    restoreFocus = null;
    for (const key of ["width", "height", "left", "top"]) player?.style.removeProperty(`--ytvm-${key}`);
    window.dispatchEvent(new Event("resize"));
  }

  async function enter({ fullscreen = true } = {}) {
    if (!player || !video || active) return;
    active = true;
    const thisSession = ++session;
    const thisPlayer = player;
    restoreFocus = document.activeElement;
    player.setAttribute("data-ytvm-active", "true");
    document.documentElement.classList.add("ytvm-active");
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("title", "Exit Vertical mode (Alt + Shift + V)");
    ownsFullscreen = document.fullscreenElement === player;
    scheduleLayout();
    renderSettings();
    // Keep the request within the click's user activation (before any await).
    if (fullscreen && document.fullscreenElement !== player) {
      try {
        await player.requestFullscreen();
        if (session !== thisSession || !active) {
          if (document.fullscreenElement === thisPlayer) await document.exitFullscreen();
          return;
        }
        ownsFullscreen = true;
      } catch {
        if (session === thisSession && active) notify("Window mode is on. Use the YouTube ⛶ button for fullscreen.");
      }
    } else {
      notify("Vertical mode is on. Adjust framing at the top right.");
    }
    scheduleLayout();
  }

  function toggle(options) {
    if (active) exit();
    else void enter(options);
  }

  function buildOverlay() {
    overlay = document.createElement("div");
    overlay.className = "ytvm-overlay";
    ui = overlay.attachShadow({ mode: "open" });
    ui.innerHTML = `<style>${globalThis.YTVerticalUI.styles}</style>${globalThis.YTVerticalUI.markup}`;
    // YouTube listens to bubbling clicks and keys; these controls keep their own events.
    for (const name of ["click", "dblclick", "pointerdown", "pointerup", "keydown", "keyup"]) {
      overlay.addEventListener(name, event => event.stopPropagation());
    }
    ui.querySelector("#adjust").addEventListener("click", () => setPanel(ui.querySelector("#panel").hidden, true));
    ui.querySelector("#close-panel").addEventListener("click", () => setPanel(false, true));
    ui.querySelector("#exit").addEventListener("click", () => exit());
    ui.querySelector("#fill").addEventListener("click", () => changeSettings({ crop: 100 }));
    ui.querySelector("#fit").addEventListener("click", () => changeSettings({ crop: 0 }));
    ui.querySelector("#crop").addEventListener("input", event => changeSettings({ crop: Number(event.target.value) }));
    ui.querySelector("#position").addEventListener("input", event => changeSettings({ position: Number(event.target.value) }));
    ui.querySelector("#reset").addEventListener("click", () => changeSettings({ crop: 100, position: 50 }));
    player.append(overlay);
  }

  const sizeObserver = new ResizeObserver(scheduleLayout);

  function attachVideo(nextVideo) {
    if (nextVideo === video) return;
    for (const event of ["loadedmetadata", "resize", "emptied"]) video?.removeEventListener(event, scheduleLayout);
    video = nextVideo;
    for (const event of ["loadedmetadata", "resize", "emptied"]) video?.addEventListener(event, scheduleLayout);
    scheduleLayout();
  }

  function scan() {
    scanFrame = null;
    const nextPlayer = isWatchPage() ? document.querySelector("#movie_player") : null;
    if (player !== nextPlayer) {
      exit({ focus: false });
      sizeObserver.disconnect();
      button?.remove();
      overlay?.remove();
      attachVideo(null);
      player = nextPlayer;
      button = null;
      overlay = null;
      ui = null;
      if (player) sizeObserver.observe(player);
    }
    if (!player) return;
    attachVideo(player.querySelector("video.html5-main-video"));
    const controls = player.querySelector(".ytp-right-controls");
    if (!controls || !video) return;
    if (!button) {
      button = document.createElement("button");
      button.className = "ytp-button ytvm-button";
      button.type = "button";
      button.title = "Vertical mode (Alt + Shift + V)";
      button.setAttribute("aria-label", "Vertical mode");
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = `${portraitIcon}<span class="ytvm-button-label">Vertical mode</span>`;
      button.addEventListener("click", event => { event.stopPropagation(); toggle(); });
    }
    if (!button.isConnected) {
      // YouTube can nest the fullscreen button inside a controls subgroup.
      const fullscreenButton = controls.querySelector(".ytp-fullscreen-button");
      if (fullscreenButton) fullscreenButton.before(button);
      else controls.append(button);
    }
    if (!overlay?.isConnected) { overlay?.remove(); buildOverlay(); renderSettings(); scheduleLayout(); }
  }

  function scheduleScan() {
    if (scanFrame == null) scanFrame = requestAnimationFrame(scan);
  }

  document.addEventListener("fullscreenchange", () => {
    if (active && document.fullscreenElement === player) ownsFullscreen = true;
    else if (active && ownsFullscreen) exit({ fullscreen: false });
    scheduleLayout();
  });
  document.addEventListener("keydown", event => {
    const target = event.composedPath()[0];
    const editing = target instanceof Element && (target.matches("input, textarea, select") || target.isContentEditable);
    if (event.altKey && event.shiftKey && event.code === "KeyV" && !event.ctrlKey && !event.metaKey && !editing && !event.repeat && button?.isConnected) {
      event.preventDefault();
      event.stopPropagation();
      toggle();
    }
    if (event.key === "Escape" && active && !document.fullscreenElement) {
      event.preventDefault();
      exit();
    }
  }, true);
  document.addEventListener("yt-navigate-start", () => exit({ focus: false }));
  document.addEventListener("yt-navigate-finish", scheduleScan);
  window.addEventListener("popstate", scheduleScan);
  window.addEventListener("resize", scheduleLayout);
  // Only child-list changes: playback progress and inline video styles do not trigger scans.
  new MutationObserver(scheduleScan).observe(document.documentElement, { childList: true, subtree: true });

  try {
    const initialRevision = revision;
    chrome.storage.local.get(storageKey).then(result => {
      if (revision !== initialRevision) return;
      const saved = result[storageKey];
      settings = { crop: clamp(saved?.crop, 100), position: clamp(saved?.position) };
      renderSettings();
      scheduleLayout();
    }).catch(() => {});
    chrome.runtime.onMessage.addListener((message, _sender, respond) => {
      if (message?.type === "YTVM_STATUS") {
        respond({ available: Boolean(player && video && button?.isConnected), active, settings });
      } else if (message?.type === "YTVM_TOGGLE_WINDOW") {
        if (!player || !video || !button?.isConnected) { respond({ available: false }); return; }
        toggle({ fullscreen: false });
        respond({ available: true, active });
      }
    });
  } catch { /* The local preview works without the Chrome extension API. */ }
  scan();
})();
