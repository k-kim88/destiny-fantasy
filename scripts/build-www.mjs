// Stages the static site (index.html + PWA assets) into www/ for Capacitor.
// The game is a self-contained HTML file with no build step, so "build"
// just means copying it and the PWA files (manifest, service worker, icons)
// into the web dir. The same files at the repo root also serve as the
// hosted PWA (e.g. GitHub Pages).
import { mkdirSync, copyFileSync, existsSync, cpSync } from "node:fs";
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

// Required: the game itself
copyFileSync(src, join(www, "index.html"));
console.log("Staged index.html -> www/index.html");

// Optional: PWA assets (present when PWA support is enabled)
for (const f of ["manifest.webmanifest", "sw.js"]) {
  const p = join(root, f);
  if (existsSync(p)) {
    copyFileSync(p, join(www, f));
    console.log("Staged " + f);
  }
}
const icons = join(root, "icons");
if (existsSync(icons)) {
  cpSync(icons, join(www, "icons"), { recursive: true });
  console.log("Staged icons/");
}
