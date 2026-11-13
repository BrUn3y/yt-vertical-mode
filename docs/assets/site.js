"use strict";

const screen = document.querySelector("#demo-screen");
const illustration = document.querySelector("#demo-image");
const host = document.querySelector("#settings-preview");
const preview = host.attachShadow({ mode: "open" });
preview.innerHTML = `<style>${globalThis.YTVerticalUI.styles}
  .toolbar { display: none; }
  #panel { position: relative; inset: auto; width: 100%; max-height: none; margin: 0; border-width: 0; padding: 25px; box-shadow: none; border-radius: 8px; }
  .eyebrow { margin-bottom: 25px; }
  #close-panel { display: none; }
</style>${globalThis.YTVerticalUI.markup}`;
preview.querySelector("#panel").hidden = false;
let crop = 100;
let position = 50;

function renderDemo() {
  const frame = globalThis.YTVerticalGeometry.calculateFrame(screen.clientWidth, screen.clientHeight, 1600, 900, crop, position);
  if (!frame) return;
  for (const key of ["width", "height", "left", "top"]) illustration.style[key] = `${frame[key]}px`;
  preview.querySelector("#crop").value = crop;
  preview.querySelector("#position").value = position;
  preview.querySelector("#crop-value").textContent = `${crop}%`;
  preview.querySelector("#position-value").textContent = position === 50 ? "Center" : `${position}%`;
  preview.querySelector("#fill").setAttribute("aria-pressed", String(crop === 100));
  preview.querySelector("#fit").setAttribute("aria-pressed", String(crop === 0));
  preview.querySelector("#position").disabled = !frame.canPan;
  preview.querySelector("#pan-help").textContent = frame.canPan ? "Choose the part of the video you want to see." : "Increase the crop to move the frame.";
  document.querySelector("#demo-status").textContent = `${crop === 100 ? "FILL SCREEN" : crop === 0 ? "FULL VIDEO" : `CROP ${crop}%`} / ${position === 50 ? "CENTERED" : position < 50 ? "LOOKING LEFT" : "LOOKING RIGHT"}`;
}
preview.querySelector("#crop").addEventListener("input", event => { crop = Number(event.target.value); renderDemo(); });
preview.querySelector("#position").addEventListener("input", event => { position = Number(event.target.value); renderDemo(); });
preview.querySelector("#fill").addEventListener("click", () => { crop = 100; renderDemo(); });
preview.querySelector("#fit").addEventListener("click", () => { crop = 0; renderDemo(); });
preview.querySelector("#reset").addEventListener("click", () => { crop = 100; position = 50; renderDemo(); });
preview.querySelector("footer").textContent = "LIVE PREVIEW / YOUR BROWSER SETTINGS STAY AS THEY ARE.";
new ResizeObserver(renderDemo).observe(screen);
renderDemo();

let feedbackTimer;
for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    const feedback = document.querySelector("#copy-feedback");
    clearTimeout(feedbackTimer);
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      feedback.textContent = `Copied ${button.dataset.copy} — paste it into your address bar.`;
    } catch {
      feedback.textContent = `Type ${button.dataset.copy} into your address bar.`;
    }
    feedbackTimer = setTimeout(() => { feedback.textContent = ""; }, 7000);
  });
}
