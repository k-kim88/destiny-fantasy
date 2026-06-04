// Generates PWA icons (any + maskable) into icons/ using the same
// navy/gold DESTINY FANTASY emblem, font-independent.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "icons");
mkdirSync(out, { recursive: true });

const GOLD_D = "#b8924a", GOLD_HI = "#fff7da";
const defs = `
  <radialGradient id="bg" cx="50%" cy="34%" r="85%">
    <stop offset="0%" stop-color="#16245e"/><stop offset="55%" stop-color="#0a1840"/>
    <stop offset="100%" stop-color="#050b22"/>
  </radialGradient>
  <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fff7da"/><stop offset="46%" stop-color="#e7bd63"/>
    <stop offset="54%" stop-color="#c9963f"/><stop offset="100%" stop-color="#9a6c28"/>
  </linearGradient>`;

const emblem = (hh, hw, ty, fs) => `
  <polygon points="0,${-hh} ${hw},0 0,${hh} ${-hw},0" fill="url(#gold)" stroke="${GOLD_D}" stroke-width="4"/>
  <polygon points="0,${-hh} ${hw},0 ${-hw},0" fill="${GOLD_HI}" opacity=".22"/>
  <text x="0" y="${ty}" font-family="Georgia,serif" font-size="${fs}" font-weight="bold" text-anchor="middle" fill="url(#gold)" stroke="${GOLD_D}" stroke-width="2">DF</text>`;

// "any" icon: full-bleed, emblem large (matches the store icon look)
const anySVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>${defs}</defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <g transform="translate(256,250)">${emblem(150, 120, 36, 120)}</g>
</svg>`;

// "maskable" icon: emblem within the central safe zone, full navy bleed
const maskSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>${defs}</defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <g transform="translate(256,256)">${emblem(110, 88, 26, 88)}</g>
</svg>`;

async function png(svg, size, file) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(out, file));
  console.log("wrote icons/" + file);
}

await png(anySVG, 192, "icon-192.png");
await png(anySVG, 512, "icon-512.png");
await png(anySVG, 180, "apple-touch-icon.png");
await png(maskSVG, 512, "maskable-512.png");
console.log("done");
