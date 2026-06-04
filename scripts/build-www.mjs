// Copies the single-file game (index.html) into www/ for Capacitor.
// The game is a self-contained HTML file with no build step, so "build"
// just means staging it (plus any future static assets) into the web dir.
import { mkdirSync, copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const www = join(root, "www");
mkdirSync(www, { recursive: true });

const src = join(root, "index.html");
if (!existsSync(src)) {
  console.error("index.html not found at repo root");
  process.exit(1);
}
copyFileSync(src, join(www, "index.html"));
console.log("Staged index.html -> www/index.html");
