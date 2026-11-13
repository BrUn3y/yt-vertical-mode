import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const root = new URL("../extension/", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("manifest.json", root)));

test("Manifest V3 package includes every referenced file", async () => {
  assert.equal(manifest.manifest_version, 3);
  const paths = [manifest.action.default_popup, ...Object.values(manifest.icons)];
  for (const script of manifest.content_scripts) paths.push(...script.js, ...script.css);
  for (const path of paths) await access(new URL(path, root));
});

test("requests only storage and limits content scripts to YouTube", () => {
  assert.deepEqual(manifest.permissions, ["storage"]);
  assert.equal(manifest.host_permissions, undefined);
  for (const script of manifest.content_scripts) {
    assert.ok(script.matches.every(match => /^https:\/\/(www\.)?youtube(-nocookie)?\.com\//.test(match)));
  }
});
