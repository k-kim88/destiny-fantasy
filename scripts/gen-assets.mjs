// Generates app icon + splash source images for @capacitor/assets.
// On-brand with DESTINY FANTASY: navy radial background, gold ornamental
// frame, faceted diamond emblem + "DF" monogram. Font-independent emblem;
// text uses a generic serif so it renders without bundled fonts.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "assets");
mkdirSync(out, { recursive: true });

const GOLD = "#e6c074", GOLD_D = "#b8924a", GOLD_HI = "#fff7da";

// Ornamental gold corner brackets, scaled to a 1024 viewBox region [pad..1024-pad]
function frame(pad, len = 150, w = 8) {
  const a = pad, b = 1024 - pad;
  const c = (x, y, hx, hy) =>
    `<path d="M ${x} ${y} h ${hx}" stroke="${GOLD}" stroke-width="${w}" stroke-linecap="round" fill="none"/>` +
    `<path d="M ${x} ${y} v ${hy}" stroke="${GOLD}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  return (
    c(a, a, len, len) + c(b, a, -len, len) + c(a, b, len, -len) + c(b, b, -len, -len)
  );
}

// Faceted diamond emblem centered at (cx,cy) with half-height hh
function diamond(cx, cy, hh, hw) {
  const top = `${cx},${cy - hh}`, right = `${cx + hw},${cy}`,
    bot = `${cx},${cy + hh}`, left = `${cx - hw},${cy}`;
  return `
    <polygon points="${top} ${right} ${bot} ${left}" fill="url(#gold)" stroke="${GOLD_D}" stroke-width="4"/>
    <line x1="${cx}" y1="${cy - hh}" x2="${cx}" y2="${cy + hh}" stroke="${GOLD_D}" stroke-width="3" opacity=".7"/>
    <line x1="${cx - hw}" y1="${cy}" x2="${cx + hw}" y2="${cy}" stroke="${GOLD_D}" stroke-width="3" opacity=".7"/>
    <polygon points="${top} ${right} ${left}" fill="${GOLD_HI}" opacity=".22"/>`;
}

const defs = `
  <defs>
    <radialGradient id="bg" cx="50%" cy="32%" r="85%">
      <stop offset="0%" stop-color="#16245e"/>
      <stop offset="55%" stop-color="#0a1840"/>
      <stop offset="100%" stop-color="#050b22"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff7da"/>
      <stop offset="46%" stop-color="#e7bd63"/>
      <stop offset="54%" stop-color="#c9963f"/>
      <stop offset="100%" stop-color="#9a6c28"/>
    </linearGradient>
  </defs>`;

const monogram = (cx, cy, size) =>
  `<text x="${cx}" y="${cy}" font-family="Georgia,'Times New Roman',serif" font-size="${size}" font-weight="bold" text-anchor="middle" fill="url(#gold)" stroke="${GOLD_D}" stroke-width="2">DF</text>`;

const wordmark = (cx, y, size) =>
  `<text x="${cx}" y="${y}" font-family="Georgia,serif" font-size="${size}" letter-spacing="${size*0.18}" font-weight="bold" text-anchor="middle" fill="${GOLD}">DESTINY FANTASY</text>`;

// Full square icon (with background)
function iconSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${defs}
    <rect width="1024" height="1024" rx="0" fill="url(#bg)"/>
    ${frame(96)}
    ${diamond(512, 430, 250, 200)}
    ${monogram(512, 480, 200)}
    ${wordmark(512, 760, 58)}
  </svg>`;
}

// Foreground only (transparent) for Android adaptive icon — keep within ~62% safe area
function foregroundSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${defs}
    ${diamond(512, 470, 200, 160)}
    ${monogram(512, 515, 165)}
  </svg>`;
}

function backgroundSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${defs}<rect width="1024" height="1024" fill="url(#bg)"/></svg>`;
}

// Splash 2732x2732 (centered emblem on navy, generous quiet space)
function splashSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732">
    ${defs}
    <rect width="2732" height="2732" fill="url(#bg)"/>
    <g transform="translate(1366,1230)">
      <polygon points="0,-250 200,0 0,250 -200,0" fill="url(#gold)" stroke="${GOLD_D}" stroke-width="4"/>
      <polygon points="0,-250 200,0 -200,0" fill="${GOLD_HI}" opacity=".22"/>
      <text x="0" y="48" font-family="Georgia,serif" font-size="200" font-weight="bold" text-anchor="middle" fill="url(#gold)" stroke="${GOLD_D}" stroke-width="2">DF</text>
    </g>
    <text x="1366" y="1720" font-family="Georgia,serif" font-size="120" letter-spacing="22" font-weight="bold" text-anchor="middle" fill="${GOLD}">DESTINY FANTASY</text>
  </svg>`;
}

async function render(svg, file) {
  await sharp(Buffer.from(svg)).png().toFile(join(out, file));
  console.log("wrote", file);
}

await render(iconSVG(), "icon-only.png");
await render(foregroundSVG(), "icon-foreground.png");
await render(backgroundSVG(), "icon-background.png");
await render(splashSVG(), "splash.png");
await render(splashSVG(), "splash-dark.png");
console.log("done");
