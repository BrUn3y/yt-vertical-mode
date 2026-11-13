(() => {
  "use strict";
  // Shared by the actual player controls and the website's interactive preview.
  const styles = `
    :host { all: initial; font-family: Arial, Helvetica, sans-serif; color: #191a19; color-scheme: light; }
    * { box-sizing: border-box; }
    [hidden] { display: none !important; }
    button, input { font: inherit; }
    button { cursor: pointer; }
    button:focus-visible, input:focus-visible { outline: 2px solid #2948ba; outline-offset: 4px; }
    .toolbar { position: absolute; top: 24px; right: 24px; display: flex; gap: 7px; pointer-events: auto; }
    .pill { display: flex; align-items: center; gap: 8px; border: 1px solid #191a1926; color: #191a19; background: #f2f1ebf5; border-radius: 5px; padding: 11px 14px; font-size: 12px; }
    .pill:hover { background: #d2e0f8; }
    .pill svg { width: 16px; height: 16px; }
    #exit { padding: 10px 13px; }
    #panel { position: absolute; right: 24px; top: 80px; width: min(344px, calc(100% - 32px)); max-height: calc(100% - 160px); overflow-y: auto; pointer-events: auto; background: #f2f1eb; border: 8px solid #c3d8f8; border-radius: 12px; box-shadow: 0 12px 36px #0002; padding: 23px; }
    .eyebrow { font: 9px/1.4 'Courier New', monospace; letter-spacing: 1.1px; margin: 0 0 29px; text-transform: uppercase; }
    header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    h2 { font-size: 38px; line-height: .97; letter-spacing: -1.8px; margin: 0; font-weight: 400; }
    .close { color: #191a19; background: transparent; border: 0; font-size: 24px; padding: 0 2px; line-height: 1; }
    .subtitle { color: #676960; font-size: 11px; line-height: 1.6; margin: 0 0 24px; }
    .presets { display: flex; border: 1px solid #191a1940; margin-bottom: 24px; }
    .preset { flex: 1; border: 0; padding: 11px 5px; background: transparent; color: #4e5049; font-size: 11px; }
    .preset + .preset { border-left: 1px solid #191a1940; }
    .preset[aria-pressed="true"] { color: #fff; background: #2948ba; }
    .row { display: flex; justify-content: space-between; font-size: 12px; margin-top: 23px; margin-bottom: 12px; }
    output { color: #2948ba; font: 11px/1.3 'Courier New', monospace; }
    input[type="range"] { appearance: none; background: transparent; width: 100%; height: 18px; margin: 0; cursor: pointer; }
    input[type="range"]::-webkit-slider-runnable-track { height: 1px; background: #7d8074; }
    input[type="range"]::-webkit-slider-thumb { appearance: none; width: 13px; height: 13px; margin-top: -6px; border-radius: 50%; border: 2px solid #f2f1eb; background: #2948ba; box-shadow: 0 0 0 1px #2948ba; }
    input[type="range"]::-moz-range-track { height: 1px; background: #7d8074; }
    input[type="range"]::-moz-range-thumb { width: 11px; height: 11px; border-radius: 50%; border: 2px solid #f2f1eb; background: #2948ba; }
    input:disabled { opacity: .35; cursor: default; }
    .ends { display: flex; justify-content: space-between; color: #73766a; font-size: 9px; margin-top: 4px; }
    .help { color: #676960; font-size: 11px; line-height: 1.6; margin: 17px 0 12px; min-height: 18px; }
    .reset { border: 0; background: transparent; color: #2948ba; padding: 6px 0; font-size: 11px; }
    footer { color: #73766a; font: 8px/1.6 'Courier New', monospace; letter-spacing: .7px; border-top: 1px solid #191a1926; margin-top: 19px; padding-top: 14px; text-transform: uppercase; }
    #toast { position: absolute; left: 50%; bottom: 100px; transform: translateX(-50%); width: max-content; max-width: calc(100% - 48px); color: #191a19; background: #f2f1ebf5; border: 1px solid #191a1933; border-radius: 5px; padding: 12px 16px; font-size: 12px; line-height: 1.6; text-align: center; }
    @media(max-width: 500px) { .toolbar { top: 16px; right: 16px; } #panel { top: 70px; right: 16px; } }
    @media(prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
  `;
  const markup = `
    <div class="toolbar">
      <button class="pill" id="adjust" aria-expanded="false" aria-controls="panel" title="Adjust framing">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="#f2f1eb"/><circle cx="15" cy="17" r="3" fill="#f2f1eb"/></svg>
        Adjust framing
      </button>
      <button class="pill" id="exit" aria-label="Exit Vertical mode" title="Exit Vertical mode">✕</button>
    </div>
    <section id="panel" aria-label="Vertical mode settings" hidden>
      <p class="eyebrow">Vertical / mode — settings</p>
      <header><h2>Your frame.<br>Your rules.</h2><button class="close" id="close-panel" aria-label="Close settings">×</button></header>
      <p class="subtitle">A little adjustment. A different perspective.</p>
      <div class="presets" role="group" aria-label="Framing mode">
        <button class="preset" id="fill" aria-pressed="true">Fill screen ↗</button>
        <button class="preset" id="fit" aria-pressed="false">Full video</button>
      </div>
      <div class="row"><label for="crop">Crop</label><output id="crop-value" for="crop">100%</output></div>
      <input id="crop" type="range" min="0" max="100" step="1" value="100" aria-describedby="crop-help">
      <div class="ends" id="crop-help"><span>Full video</span><span>Fill screen</span></div>
      <div class="row"><label for="position">Horizontal framing</label><output id="position-value" for="position">Center</output></div>
      <input id="position" type="range" min="0" max="100" step="1" value="50" aria-describedby="pan-help">
      <div class="ends"><span>Left</span><span>Right</span></div>
      <p class="help" id="pan-help">Choose the part of the video you want to see.</p>
      <button class="reset" id="reset">↺ Reset framing</button>
      <footer>Saved automatically. Only on this device.</footer>
    </section>
    <div id="toast" role="status" aria-live="polite" hidden></div>
  `;
  globalThis.YTVerticalUI = Object.freeze({ styles, markup });
})();
