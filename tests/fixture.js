"use strict";

// Local-only stand-in for extension storage, so the fixture also exercises persistence.
if (!globalThis.chrome?.runtime?.id) {
  globalThis.chrome = {
    storage: { local: {
      async get(key) { return { [key]: JSON.parse(localStorage.getItem(key) || "null") }; },
      async set(value) { for (const [key, item] of Object.entries(value)) localStorage.setItem(key, JSON.stringify(item)); }
    } },
    runtime: { onMessage: { addListener() {} } }
  };
}

const canvas = document.createElement("canvas");
canvas.width = 1920;
canvas.height = 1080;
const ctx = canvas.getContext("2d");
const sky = ctx.createLinearGradient(0, 0, 0, 1080);
sky.addColorStop(0, "#647962");
sky.addColorStop(.58, "#e4d5a4");
sky.addColorStop(1, "#81936c");
ctx.fillStyle = sky;
ctx.fillRect(0, 0, 1920, 1080);
ctx.fillStyle = "#f4e9b7";
ctx.beginPath(); ctx.arc(1280, 270, 68, 0, Math.PI * 2); ctx.fill();
for (const [color, points] of [
  ["#6d805c", [[0, 870], [300, 490], [500, 650], [1020, 170], [1320, 680], [1650, 470], [1920, 800]]],
  ["#496343", [[0, 930], [440, 580], [620, 780], [980, 440], [1330, 820], [1580, 620], [1920, 850]]],
  ["#2b442f", [[0, 960], [300, 820], [700, 970], [1100, 800], [1450, 990], [1920, 840]]]
]) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, 1080);
  for (const [x, y] of points) ctx.lineTo(x, y);
  ctx.lineTo(1920, 1080); ctx.closePath(); ctx.fill();
}
ctx.strokeStyle = "#e9f2de55";
ctx.lineWidth = 2;
ctx.setLineDash([10, 12]);
for (const x of [656.25, 1263.75]) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1080); ctx.stroke(); }
ctx.setLineDash([]);
ctx.fillStyle = "#f0f5e8";
ctx.font = "600 26px system-ui";
ctx.textAlign = "center";
for (const [text, x] of [["LEFT", 260], ["CENTER", 960], ["RIGHT", 1660]]) ctx.fillText(text, x, 140);
ctx.font = "500 17px system-ui";
ctx.fillStyle = "#e2edd7aa";
ctx.fillText("1920 × 1080 · 16:9 · TEST VIDEO", 960, 1000);

const video = document.querySelector("video");
video.srcObject = canvas.captureStream(1);
void video.play();
document.querySelector(".ytp-fullscreen-button").addEventListener("click", () => {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.querySelector("#movie_player").requestFullscreen();
});
document.querySelector("#play").addEventListener("click", event => {
  if (video.paused) { void video.play(); event.currentTarget.textContent = "Ⅱ"; event.currentTarget.setAttribute("aria-label", "Pause"); }
  else { video.pause(); event.currentTarget.textContent = "▶"; event.currentTarget.setAttribute("aria-label", "Play"); }
});
