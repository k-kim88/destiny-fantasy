// 화면(스크린) 라우터 — 한 번에 하나의 스크린만 표시
// 각 스크린은 { mount(root, ctx), unmount?() } 형태의 객체를 반환하는 팩토리로 등록한다.

const registry = new Map();
let current = null;
let rootEl = null;

export function initScreens(root) { rootEl = root; }

export function registerScreen(name, factory) { registry.set(name, factory); }

export function showScreen(name, ctx = {}) {
  const factory = registry.get(name);
  if (!factory) { console.warn("unknown screen:", name); return; }
  if (current && current.unmount) { try { current.unmount(); } catch (e) {} }
  rootEl.innerHTML = "";
  rootEl.scrollTop = 0;
  const screen = factory(ctx) || {};
  current = screen;
  const el = screen.mount ? screen.mount(rootEl, ctx) : null;
  if (el) { el.classList.add("fade"); }
  return screen;
}

export function currentScreen() { return current; }
