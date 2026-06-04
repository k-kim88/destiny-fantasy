// 필드(맵/이동/인카운터) — 원작 index.html 엔진을 모듈로 이식
import { MAP, COLS, ROWS, WALK, TILE, CANW, CANH, clampf } from "../data/gamedata.js";
import { ROSTER } from "../data/characters.js";
import { G, recruit, saveGame } from "./state.js";
import { SPRIMG, ANIMIMG } from "./imagecache.js";
import { SFX, audioInit } from "../core/audio.js";
import { toast } from "../core/toast.js";
import { L, nm, getLang } from "../core/i18n.js";
import { showScreen } from "../core/screens.js";

let fc, fx2, mini, miniCtx;
let cam = { x: 0, y: 0 };
let _groundCv = null, _objs = [], _parts = [], _sprc = null;
let _t = 0, _fieldRAF = 0, _lastTs = 0, _camInit = false, _ovlCv = null;
let _active = false, _moving = false, facing = 1, _encDist = 0, _encNext = 160;
let held = { up: false, down: false, left: false, right: false };

const EVENTS = [
  { c: 8, r: 5, key: "pu" },
  { c: 11, r: 8, key: "minmin" },
  { c: 5, r: 9, key: "tachikawa" },
];

function clearHeld() { held.up = held.down = held.left = held.right = false; _moving = false; }
function tileWalk(px, py) { const c = Math.floor(px / TILE), r = Math.floor(py / TILE); return r >= 0 && r < ROWS && c >= 0 && c < COLS && WALK.has(MAP[r][c]); }
function srnd(s) { return function () { s = (s * 1664525 + 1013904223) >>> 0; return (s >>> 8) / 16777216; }; }
function mkCv(w, h) { const cv = document.createElement("canvas"); cv.width = Math.round(w); cv.height = Math.round(h); return cv; }

/* ----- scene building (ground / sprites / objects / particles / overlay) ----- */
function buildGround() {
  _groundCv = document.createElement("canvas"); _groundCv.width = COLS * TILE; _groundCv.height = ROWS * TILE;
  const g = _groundCv.getContext("2d");
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const t = MAP[r][c], x = c * TILE, y = r * TILE, rnd = srnd((r * 97 + c * 131 + 7) >>> 0);
    if (t === 2) {
      const wg = g.createLinearGradient(0, y, 0, y + TILE); wg.addColorStop(0, "#2c6a84"); wg.addColorStop(1, "#123a52"); g.fillStyle = wg; g.fillRect(x, y, TILE, TILE);
      g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(x, y + 2, TILE, 2);
      for (let i = 0; i < 8; i++) { g.fillStyle = "rgba(185,222,235,.10)"; g.fillRect(x + rnd() * TILE, y + rnd() * TILE, 3, 1); }
    } else if (t === 3 || t === 5) {
      g.fillStyle = "#7a6243"; g.fillRect(x, y, TILE, TILE);
      for (let i = 0; i < 30; i++) { const px = x + rnd() * TILE, py = y + rnd() * TILE, s = 1 + rnd() * 2; g.fillStyle = rnd() < .5 ? "#6b543a" : "#8c7150"; g.fillRect(px, py, s, s); }
    } else {
      const gv = Math.floor(rnd() * 3); g.fillStyle = ["#2f5a32", "#356134", "#2a5230"][gv]; g.fillRect(x, y, TILE, TILE);
      for (let i = 0; i < 22; i++) { const px = x + rnd() * TILE, py = y + rnd() * TILE, sh = rnd(); g.fillStyle = sh < .4 ? "#3c6e3a" : sh < .75 ? "#264c27" : "#49864d"; g.fillRect(px, py, 2, 3 + rnd() * 3); }
      if (rnd() < .12) { const fxp = x + 10 + rnd() * (TILE - 20), fyp = y + 10 + rnd() * (TILE - 20); g.fillStyle = "#caa24a"; g.fillRect(fxp - 0.5, fyp, 1, 5); g.fillStyle = ["#e6c074", "#d97fae", "#fff0f5", "#ffd86b"][Math.floor(rnd() * 4)]; g.beginPath(); g.arc(fxp, fyp, 2.6, 0, 7); g.fill(); }
    }
  }
  const lg = g.createLinearGradient(0, 0, 0, _groundCv.height);
  lg.addColorStop(0, "rgba(255,250,220,.05)"); lg.addColorStop(.5, "rgba(0,0,0,0)"); lg.addColorStop(1, "rgba(0,12,22,.24)");
  g.fillStyle = lg; g.fillRect(0, 0, _groundCv.width, _groundCv.height);
}
function makeTree(v) {
  const w = Math.round(TILE * 1.5), h = Math.round(TILE * 2.0), cv = mkCv(w, h), c = cv.getContext("2d"), cx = w / 2;
  c.fillStyle = "#4a3420"; c.fillRect(cx - w * 0.055, h * 0.62, w * 0.11, h * 0.36); c.fillStyle = "#6e5234"; c.fillRect(cx - w * 0.055, h * 0.62, w * 0.045, h * 0.36);
  const pal = [["#244625", "#356134", "#4d8a4f"], ["#2a4a2c", "#3c6e3a", "#5fa258"], ["#1f3c27", "#2f5a32", "#43824a"]][v] || ["#244625", "#356134", "#4d8a4f"];
  const blobs = [[cx, h * 0.34, w * 0.42], [cx - w * 0.26, h * 0.46, w * 0.30], [cx + w * 0.26, h * 0.46, w * 0.30], [cx, h * 0.19, w * 0.30], [cx - w * 0.14, h * 0.30, w * 0.26], [cx + w * 0.16, h * 0.30, w * 0.26]];
  c.fillStyle = pal[0]; blobs.forEach((b) => { c.beginPath(); c.arc(b[0], b[1] + 5, b[2], 0, 7); c.fill(); });
  c.fillStyle = pal[1]; blobs.forEach((b) => { c.beginPath(); c.arc(b[0], b[1], b[2] * 0.92, 0, 7); c.fill(); });
  c.fillStyle = pal[2]; blobs.forEach((b) => { c.beginPath(); c.arc(b[0] - b[2] * 0.26, b[1] - b[2] * 0.28, b[2] * 0.5, 0, 7); c.fill(); });
  return cv;
}
function makeRock() {
  const w = Math.round(TILE * 0.92), h = Math.round(TILE * 0.78), cv = mkCv(w, h), c = cv.getContext("2d");
  c.fillStyle = "#4e525a"; c.beginPath(); c.moveTo(w * 0.1, h); c.lineTo(w * 0.02, h * 0.5); c.lineTo(w * 0.32, h * 0.16); c.lineTo(w * 0.7, h * 0.2); c.lineTo(w * 0.98, h * 0.56); c.lineTo(w * 0.9, h); c.closePath(); c.fill();
  c.fillStyle = "#666b74"; c.beginPath(); c.moveTo(w * 0.32, h * 0.16); c.lineTo(w * 0.7, h * 0.2); c.lineTo(w * 0.55, h * 0.5); c.lineTo(w * 0.3, h * 0.46); c.closePath(); c.fill();
  c.fillStyle = "#3a3e45"; c.fillRect(w * 0.1, h * 0.82, w * 0.8, h * 0.18); return cv;
}
function makeBoss() {
  const w = Math.round(TILE * 1.0), h = Math.round(TILE * 1.8), cv = mkCv(w, h), c = cv.getContext("2d"), cx = w / 2;
  c.fillStyle = "#26222e"; c.beginPath(); c.moveTo(cx - w * 0.22, h); c.lineTo(cx - w * 0.16, h * 0.18); c.lineTo(cx, h * 0.04); c.lineTo(cx + w * 0.16, h * 0.18); c.lineTo(cx + w * 0.22, h); c.closePath(); c.fill();
  c.fillStyle = "#3a3346"; c.beginPath(); c.moveTo(cx, h * 0.04); c.lineTo(cx + w * 0.16, h * 0.18); c.lineTo(cx + w * 0.22, h); c.lineTo(cx, h); c.closePath(); c.fill();
  c.fillStyle = "#c43c2a"; c.beginPath(); c.arc(cx, h * 0.42, w * 0.1, 0, 7); c.fill(); return cv;
}
function makeLantern() {
  const w = Math.round(TILE * 0.5), h = Math.round(TILE * 1.1), cv = mkCv(w, h), c = cv.getContext("2d"), cx = w / 2;
  c.fillStyle = "#5b4128"; c.fillRect(cx - 2, h * 0.3, 4, h * 0.7); c.fillStyle = "#7e5a22"; c.fillRect(cx - w * 0.3, h * 0.12, w * 0.6, h * 0.22);
  c.fillStyle = "#ffe08a"; c.beginPath(); c.arc(cx, h * 0.23, w * 0.22, 0, 7); c.fill(); return cv;
}
function buildSprites() { _sprc = { tree0: makeTree(0), tree1: makeTree(1), tree2: makeTree(2), rock: makeRock(), boss: makeBoss(), lantern: makeLantern() }; }
function buildObjects() {
  _objs = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const t = MAP[r][c];
    if (t === 1) { const rnd = srnd((r * 53 + c * 89 + 3) >>> 0), kind = rnd() < .8 ? "tree" : "rock", v = Math.floor(rnd() * 3); _objs.push({ wx: c * TILE + TILE / 2, fy: r * TILE + TILE - 6, kind, v, sway: rnd() * 6.28 }); }
    else if (t === 4) _objs.push({ wx: c * TILE + TILE / 2, fy: r * TILE + TILE - 6, kind: "boss", v: 0, sway: 0 });
    else if (t === 5) _objs.push({ wx: c * TILE + TILE / 2, fy: r * TILE + TILE - 6, kind: "lantern", v: 0, sway: 0 });
  }
}
function initParts() { _parts = []; for (let i = 0; i < 12; i++) _parts.push({ x: Math.random() * CANW, y: Math.random() * CANH, ph: Math.random() * 6.28, sp: .15 + Math.random() * .4, r: 1 + Math.random() * 1.6 }); }
function buildOverlay() {
  _ovlCv = document.createElement("canvas"); _ovlCv.width = CANW; _ovlCv.height = CANH; const o = _ovlCv.getContext("2d");
  const ag = o.createLinearGradient(0, 0, 0, CANH); ag.addColorStop(0, "rgba(10,30,24,.5)"); ag.addColorStop(.25, "rgba(10,20,30,0)"); ag.addColorStop(.8, "rgba(8,14,28,0)"); ag.addColorStop(1, "rgba(5,8,20,.55)"); o.fillStyle = ag; o.fillRect(0, 0, CANW, CANH);
  const vg = o.createRadialGradient(CANW / 2, CANH * 0.46, CANH * 0.22, CANW / 2, CANH * 0.5, CANH * 0.72); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.5)"); o.fillStyle = vg; o.fillRect(0, 0, CANW, CANH);
}
function buildFieldScene() { buildGround(); buildSprites(); buildObjects(); initParts(); buildOverlay(); _camInit = false; }

/* ----- drawing ----- */
function drawObj(o) {
  const sx = o.wx - cam.x, sy = o.fy - cam.y;
  fx2.fillStyle = "rgba(0,0,0,.26)"; fx2.beginPath(); fx2.ellipse(sx, sy - 2, TILE * 0.32, TILE * 0.13, 0, 0, 7); fx2.fill();
  let img = null, sway = 0;
  if (o.kind === "tree") { img = _sprc["tree" + o.v]; sway = Math.sin(_t * 0.0015 + o.sway) * 3; }
  else if (o.kind === "rock") img = _sprc.rock; else if (o.kind === "boss") img = _sprc.boss; else if (o.kind === "lantern") img = _sprc.lantern;
  if (img) fx2.drawImage(img, sx - img.width / 2 + sway, sy - img.height);
  if (o.kind === "boss" && !(G && G.bossDefeated)) { const p = 0.5 + 0.5 * Math.sin(_t * 0.004); fx2.fillStyle = `rgba(220,60,42,${0.18 + 0.32 * p})`; fx2.beginPath(); fx2.arc(sx, sy - _sprc.boss.height * 0.55, TILE * 0.4, 0, 7); fx2.fill(); }
  if (o.kind === "lantern") { const p = 0.5 + 0.5 * Math.sin(_t * 0.005 + o.sway); fx2.fillStyle = `rgba(255,210,120,${0.12 + 0.2 * p})`; fx2.beginPath(); fx2.arc(sx, sy - _sprc.lantern.height * 0.78, TILE * 0.34, 0, 7); fx2.fill(); }
}
function drawPlayer() {
  const sx = G.wx - cam.x, sy = G.wy - cam.y;
  fx2.fillStyle = "rgba(0,0,0,.30)"; fx2.beginPath(); fx2.ellipse(sx, sy - 2, TILE * 0.26, TILE * 0.11, 0, 0, 7); fx2.fill();
  const key = G.party[0].key;
  const set = ANIMIMG && ANIMIMG[key] ? (_moving ? ANIMIMG[key].walk : ANIMIMG[key].idle) : null;
  let img = null;
  if (set && set.length) { const fps = _moving ? 7 : 2.2; img = set[Math.floor(_t / 1000 * fps) % set.length]; }
  const bob = _moving ? 0 : Math.sin(_t * 0.005) * 1.2;
  if (img && img.complete && img.naturalWidth) { fx2.save(); fx2.imageSmoothingEnabled = true; const hh = TILE * 1.62, ww = hh * img.naturalWidth / img.naturalHeight; fx2.translate(sx, sy + bob); fx2.scale(facing, 1); fx2.drawImage(img, -ww / 2, -hh, ww, hh); fx2.restore(); return; }
  const pim = SPRIMG && SPRIMG[key];
  if (pim && pim.complete && pim.naturalWidth) { fx2.save(); fx2.imageSmoothingEnabled = false; const hh = TILE * 1.34, ww = hh * pim.naturalWidth / pim.naturalHeight; fx2.translate(sx, sy + bob); fx2.scale(facing, 1); fx2.drawImage(pim, -ww / 2, -hh, ww, hh); fx2.restore(); fx2.imageSmoothingEnabled = true; }
  else { fx2.fillStyle = "#e6c074"; fx2.beginPath(); fx2.arc(sx, sy - TILE * 0.5 + bob, TILE * 0.2, 0, 7); fx2.fill(); }
}

/* ----- movement + encounters ----- */
let _lastMoveTile = "", _lastMoveSave = 0;
function maybeAutosaveMove() {
  const tile = G.px + "," + G.py;
  if (tile === _lastMoveTile) return;
  _lastMoveTile = tile;
  const now = Date.now();
  if (now - _lastMoveSave < 5000) return;
  _lastMoveSave = now;
  saveGame();
}
function encounter(boss) {
  clearHeld();
  SFX.encounter();
  stopFieldLoop();
  showScreen("battle", { boss: !!boss });
}
function updateMove(dt) {
  let vx = (held.right ? 1 : 0) - (held.left ? 1 : 0), vy = (held.down ? 1 : 0) - (held.up ? 1 : 0);
  _moving = !!(vx || vy);
  if (vx && vy) { vx *= 0.7071; vy *= 0.7071; }
  if (vx) facing = vx > 0 ? 1 : -1;
  if (!_moving) return;
  const sp = TILE * 0.052 * (dt / 16);
  const nx = G.wx + vx * sp;
  if (tileWalk(nx + (vx > 0 ? TILE * 0.26 : vx < 0 ? -TILE * 0.26 : 0), G.wy)) G.wx = nx;
  const ny = G.wy + vy * sp;
  if (tileWalk(G.wx, ny + (vy > 0 ? TILE * 0.16 : vy < 0 ? -TILE * 0.34 : 0))) G.wy = ny;
  G.px = clampf(Math.floor(G.wx / TILE), 0, COLS - 1); G.py = clampf(Math.floor(G.wy / TILE), 0, ROWS - 1);
  drawMini();
  maybeAutosaveMove();
  // 동료 합류 이벤트 (컷신 이식 전까지 즉시 합류)
  const ev = EVENTS.find((e) => e.c === G.px && e.r === G.py && !(G.events && G.events[e.key]));
  if (ev) {
    G.events[ev.key] = 1; clearHeld();
    if (recruit(ev.key)) { renderRail(); toast(nm(ROSTER.find((r) => r.key === ev.key).name) + " " + (getLang() === "ko" ? "합류!" : "加入！")); saveGame(); }
    return;
  }
  const t = MAP[G.py][G.px];
  if (t === 4 && !G.bossDefeated) { encounter(true); return; }
  if (t === 0) { _encDist += sp; if (_encDist >= _encNext) { _encDist = 0; _encNext = TILE * (3.5 + Math.random() * 4); encounter(false); } }
}

/* ----- render loop ----- */
function renderFieldFrame(ts) {
  if (!_active || !G) { _fieldRAF = 0; return; }
  _t = ts; const dt = Math.min(50, (ts - _lastTs) || 16); _lastTs = ts;
  if (G.wx == null) { G.wx = G.px * TILE + TILE / 2; G.wy = G.py * TILE + TILE * 0.6; }
  updateMove(dt);
  if (!_active) { _fieldRAF = 0; return; }
  const worldW = COLS * TILE, worldH = ROWS * TILE;
  const pcx = G.wx, pcy = G.wy - TILE * 0.2;
  const tx = worldW <= CANW ? (worldW - CANW) / 2 : clampf(pcx - CANW / 2, 0, worldW - CANW);
  const ty = worldH <= CANH ? (worldH - CANH) / 2 : clampf(pcy - CANH * 0.46, 0, worldH - CANH);
  if (!_camInit) { cam.x = tx; cam.y = ty; _camInit = true; } else { cam.x += (tx - cam.x) * 0.16; cam.y += (ty - cam.y) * 0.16; }
  fx2.clearRect(0, 0, CANW, CANH);
  fx2.fillStyle = "#0d1a14"; fx2.fillRect(0, 0, CANW, CANH);
  fx2.drawImage(_groundCv, -Math.round(cam.x), -Math.round(cam.y));
  const c0 = Math.max(0, Math.floor(cam.x / TILE)), c1 = Math.min(COLS - 1, Math.ceil((cam.x + CANW) / TILE));
  const r0 = Math.max(0, Math.floor(cam.y / TILE)), r1 = Math.min(ROWS - 1, Math.ceil((cam.y + CANH) / TILE));
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
    if (MAP[r][c] !== 2) continue;
    const x = c * TILE - cam.x, y = r * TILE - cam.y;
    fx2.strokeStyle = "rgba(190,225,240,.16)"; fx2.lineWidth = 1.5;
    for (let i = 0; i < 2; i++) { const yy = y + TILE * (0.4 + i * 0.32) + Math.sin(_t * 0.003 + c + i) * 2; fx2.beginPath(); fx2.moveTo(x + TILE * 0.2, yy); fx2.lineTo(x + TILE * 0.8, yy); fx2.stroke(); }
  }
  const list = [];
  for (const o of _objs) { const sx = o.wx - cam.x, sy = o.fy - cam.y; if (sx > -TILE * 2 && sx < CANW + TILE * 2 && sy > -TILE * 3 && sy < CANH + TILE * 2) list.push(o); }
  list.push({ kind: "__player", fy: G.wy });
  list.sort((a, b) => a.fy - b.fy);
  for (const o of list) { if (o.kind === "__player") drawPlayer(); else drawObj(o); }
  // story markers (! over recruit tiles)
  const pulse = 0.5 + 0.5 * Math.sin(_t * 0.005);
  for (const e of EVENTS) {
    if (G.events && G.events[e.key]) continue;
    const sx = e.c * TILE + TILE / 2 - cam.x, sy = e.r * TILE + TILE * 0.34 - cam.y;
    fx2.fillStyle = `rgba(230,192,116,${0.18 + 0.18 * pulse})`; fx2.beginPath(); fx2.arc(sx, sy - 6, TILE * 0.34, 0, 7); fx2.fill();
    fx2.fillStyle = `rgba(255,236,180,${0.7 + 0.3 * pulse})`; fx2.font = "bold 26px Georgia,serif"; fx2.textAlign = "center"; fx2.textBaseline = "middle"; fx2.fillText("!", sx, sy - 14 - pulse * 3); fx2.textBaseline = "alphabetic"; fx2.textAlign = "left";
  }
  for (const p of _parts) {
    p.y -= p.sp * dt * 0.05; p.x += Math.sin(_t * 0.001 + p.ph) * 0.4; if (p.y < -4) { p.y = CANH + 4; p.x = Math.random() * CANW; }
    const a = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(_t * 0.004 + p.ph)); fx2.fillStyle = `rgba(245,222,150,${a})`; fx2.beginPath(); fx2.arc(p.x, p.y, p.r, 0, 7); fx2.fill();
    fx2.fillStyle = `rgba(245,222,150,${a * 0.25})`; fx2.beginPath(); fx2.arc(p.x, p.y, p.r * 2.6, 0, 7); fx2.fill();
  }
  if (_ovlCv) fx2.drawImage(_ovlCv, 0, 0);
  _fieldRAF = requestAnimationFrame(renderFieldFrame);
}
function startFieldLoop() { if (!_groundCv) return; fc.width = CANW; fc.height = CANH; if (!_fieldRAF) { _lastTs = performance.now(); _fieldRAF = requestAnimationFrame(renderFieldFrame); } }
function stopFieldLoop() { _active = false; if (_fieldRAF) { cancelAnimationFrame(_fieldRAF); _fieldRAF = 0; } clearHeld(); }

function drawMini() {
  if (!mini) return;
  const x = miniCtx; mini.width = COLS * 6; mini.height = ROWS * 6;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const t = MAP[r][c];
    x.fillStyle = t === 1 ? "#1c3a22" : t === 2 ? "#1d4e8c" : t === 4 ? "#c43c2a" : t === 5 ? "#e6c074" : (t === 3 ? "#7a6243" : "#2f5a32");
    x.fillRect(c * 6, r * 6, 6, 6);
  }
  x.fillStyle = "#fff"; x.fillRect(G.px * 6, G.py * 6, 6, 6);
  x.strokeStyle = "rgba(0,0,0,.5)"; x.strokeRect(G.px * 6, G.py * 6, 6, 6);
}
function renderRail() {
  const rail = document.getElementById("fieldRail");
  if (!rail) return;
  rail.innerHTML = G.party.map((p) => `<div class="m"><div class="nm">${nm(p.name)}</div>
    <div class="bar hp" style="height:5px;margin-top:3px;"><i style="width:${p.hp / p.maxHp * 100}%"></i></div>
    <div class="bar mp" style="height:4px;margin-top:2px;"><i style="width:${p.maxMp ? p.mp / p.maxMp * 100 : 0}%"></i></div></div>`).join("");
}

/* ----- screen ----- */
function setHeld(dir, on) { if (dir in held) { held[dir] = on; audioInit(); } }

export function FieldScreen() {
  return {
    mount(root) {
      const el = document.createElement("section");
      el.className = "screen";
      el.style.position = "static";
      el.innerHTML = `
        <canvas id="field-canvas" width="360" height="528"></canvas>
        <div class="win plate locplate"><div class="kicker">NORTHERN PLAINS</div><div class="nm">${L("locName")}</div></div>
        <div class="win plate gilplate"><div class="kicker">GIL</div><div class="v" id="gilVal">${G.gil.toLocaleString()}</div></div>
        <div class="win minimap"><canvas id="mini" width="86" height="86"></canvas></div>
        <div class="win" id="fieldRail"></div>
        <div id="controls">
          <div id="dpad">
            <div class="dbtn up" data-dir="up">▲</div><div class="dbtn down" data-dir="down">▼</div>
            <div class="dbtn left" data-dir="left">◀</div><div class="dbtn right" data-dir="right">▶</div>
            <div class="hub"></div>
          </div>
          <div id="rbtns">
            <div class="rbtn menu" id="btnMenu">☰</div>
            <div class="rbtn b" id="btnB">B</div>
            <div class="rbtn a" id="btnA">A</div>
          </div>
        </div>
        <div id="fieldHint">A = ${getLang() === "ko" ? "전투 진입" : "戦闘"}</div>`;
      root.appendChild(el);

      fc = el.querySelector("#field-canvas"); fx2 = fc.getContext("2d");
      mini = el.querySelector("#mini"); miniCtx = mini.getContext("2d");

      if (!_groundCv) buildFieldScene();
      renderRail();
      drawMini();
      _active = true;
      startFieldLoop();

      // D-pad
      el.querySelectorAll(".dbtn[data-dir]").forEach((b) => {
        const on = (e) => { e.preventDefault(); setHeld(b.dataset.dir, true); };
        const off = (e) => { e.preventDefault(); setHeld(b.dataset.dir, false); };
        b.addEventListener("pointerdown", on); b.addEventListener("pointerup", off);
        b.addEventListener("pointerleave", off); b.addEventListener("pointercancel", off);
      });
      this._keydown = (e) => { const m = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" }; if (m[e.key]) { e.preventDefault(); setHeld(m[e.key], true); } };
      this._keyup = (e) => { const m = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" }; if (m[e.key]) setHeld(m[e.key], false); };
      this._up = () => clearHeld();
      document.addEventListener("keydown", this._keydown);
      document.addEventListener("keyup", this._keyup);
      document.addEventListener("pointerup", this._up);

      el.querySelector("#btnMenu").onclick = () => { SFX.menu(); showScreen("menu"); };
      el.querySelector("#btnA").onclick = () => { SFX.menu(); encounter(false); };
      el.querySelector("#btnB").onclick = () => { SFX.menu(); };
      return el;
    },
    unmount() {
      stopFieldLoop();
      document.removeEventListener("keydown", this._keydown);
      document.removeEventListener("keyup", this._keyup);
      document.removeEventListener("pointerup", this._up);
    },
  };
}
