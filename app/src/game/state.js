// 게임 상태 (G) — 원작의 전역 G를 모듈 라이브 바인딩으로
import { ROSTER, mk } from "../data/characters.js";
import { TILE } from "../data/gamedata.js";
import { saveState, loadState } from "../core/storage.js";

export let G = null;

export function newGame() {
  const start = ["gwangmin", "akane"];
  G = {
    px: 1, py: 5, wx: 1 * TILE + TILE / 2, wy: 5 * TILE + TILE * 0.6,
    recruited: start.slice(), party: null,
    items: { potion: 18, hipotion: 7, ether: 9 },
    gil: 24860, bossDefeated: false, events: {},
    ch1: "free", // v2: 챕터1 컷신 이식 전까지 자유 탐험으로 시작
  };
  G.party = G.recruited.map((k) => mk(ROSTER.find((r) => r.key === k)));
  return G;
}

export function recruit(key) {
  if (!G.recruited.includes(key)) {
    G.recruited.push(key);
    G.party.push(mk(ROSTER.find((r) => r.key === key)));
    return true;
  }
  return false;
}

export function loadGame() {
  const s = loadState();
  if (s) { G = s; return true; }
  return false;
}

export function saveGame() { return G ? saveState(G) : false; }
