import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, extname, sep } from "node:path";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml" };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://127.0.0.1");
    if (url.pathname === "/") { response.writeHead(302, { Location: "/docs/" }).end(); return; }
    const path = url.pathname === "/watch" ? "/tests/fixture.html" : url.pathname === "/docs/" ? "/docs/index.html" : url.pathname;
    const file = resolve(root, `.${decodeURIComponent(path)}`);
    if (!file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    response.end(body);
  } catch { response.writeHead(404).end("Not found"); }
}).listen(4173, "127.0.0.1", () => console.log("Website: http://127.0.0.1:4173/docs/\nPopup: http://127.0.0.1:4173/extension/popup.html\nTest player: http://127.0.0.1:4173/watch?v=demo"));
