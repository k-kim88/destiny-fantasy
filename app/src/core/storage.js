// 저장 시스템 — localStorage 기반 (단일 슬롯)
import { L } from "./i18n.js";

const SAVE_KEY = "df_save_v2";

export const hasStore = (() => {
  try {
    const k = "__df_test";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch (e) {
    return false;
  }
})();

let _rawSave = null;
export function hasSaveData() { return !!_rawSave; }

// 저장 마크: 저장될 때마다 화면 상단에 잠깐 표시
function flashSaveMark() {
  const el = document.getElementById("saveMark");
  if (!el) return;
  const tx = el.querySelector(".sm-tx");
  if (tx) tx.textContent = L("autoSaved");
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 1300);
}

export function saveState(state) {
  if (!hasStore) return false;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    _rawSave = "1";
    flashSaveMark();
    return true;
  } catch (e) {
    return false;
  }
}

export function loadState() {
  if (!hasStore) return null;
  try {
    const r = localStorage.getItem(SAVE_KEY);
    return r ? JSON.parse(r) : null;
  } catch (e) {
    return null;
  }
}

export function checkSave() {
  if (!hasStore) { _rawSave = null; return false; }
  try { _rawSave = localStorage.getItem(SAVE_KEY) ? "1" : null; } catch (e) { _rawSave = null; }
  return !!_rawSave;
}

export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  _rawSave = null;
}
