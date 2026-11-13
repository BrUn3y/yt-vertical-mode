import { copyFile, mkdir } from "node:fs/promises";
const root = new URL("../", import.meta.url);
await mkdir(new URL("docs/assets/", root), { recursive: true });
for (const file of ["geometry.js", "ui.js"]) {
  await copyFile(new URL(`extension/${file}`, root), new URL(`docs/assets/${file}`, root));
}
await copyFile(new URL("extension/icons/icon-32.png", root), new URL("docs/assets/favicon.png", root));
console.log("Website assets synced. Open /docs/ with npm run preview.");
