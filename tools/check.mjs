import { readFile, readdir, access } from "node:fs/promises";
import { spawnSync } from "node:child_process";
const root = new URL("../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("extension/manifest.json", root)));
const pkg = JSON.parse(await readFile(new URL("package.json", root)));
if (manifest.version !== pkg.version) throw Error("Package and manifest versions differ.");
for (const file of ["geometry.js", "ui.js"]) {
  const source = await readFile(new URL(`extension/${file}`, root));
  const published = await readFile(new URL(`docs/assets/${file}`, root));
  if (!source.equals(published)) throw Error(`Run npm run build:site: ${file} is out of sync.`);
}
async function checkDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
    if (entry.isDirectory()) { await checkDirectory(file); continue; }
    if (/\.(m?js)$/.test(entry.name)) {
      const check = spawnSync(process.execPath, ["--check", file.pathname], { encoding: "utf8" });
      if (check.status !== 0) throw Error(check.stderr);
    }
    if (entry.name.endsWith(".html")) {
      const html = await readFile(file, "utf8");
      for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
        const reference = match[1];
        if (/^(?:https?:|chrome:|dia:|\/)/.test(reference)) continue;
        await access(new URL(reference.split("#")[0], file));
      }
      if (!html.includes('lang="en"')) throw Error(`Missing English language declaration: ${file.pathname}`);
    }
  }
}
for (const path of ["extension/", "docs/", "tests/", "tools/"]) await checkDirectory(new URL(path, root));
console.log(`Version ${manifest.version}: JavaScript syntax, local assets, language declarations, and shared UI assets checked.`);
