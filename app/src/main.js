// DESTINY FANTASY v2 — 부트스트랩
import "./style.css";
import { initScreens, registerScreen, showScreen } from "./core/screens.js";
import { loadAssets } from "./core/assets.js";
import { checkSave } from "./core/storage.js";
import { TitleScreen } from "./ui/title.js";
import { FieldScreen, CharsScreen, SettingsScreen } from "./ui/stubs.js";

const root = document.getElementById("screens");
initScreens(root);

registerScreen("title", TitleScreen);
registerScreen("field", FieldScreen);
registerScreen("chars", CharsScreen);
registerScreen("settings", SettingsScreen);

// 디바이스 높이에 맞춰 #app 스케일 (원작 fitApp 이식)
function fitApp() {
  const app = document.getElementById("app");
  if (!app) return;
  const sc = Math.min(1, window.innerHeight / 852);
  app.style.transform = `scale(${sc})`;
}
window.addEventListener("resize", fitApp);

function showLoading(pct) {
  root.innerHTML = `
    <section class="screen" style="position:static;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;height:100%">
      <div class="df-logo"><span class="word w1" style="font-size:34px">DESTINY</span><span class="word w2" style="font-size:34px">FANTASY</span></div>
      <div style="width:200px"><div class="bar exp"><i style="width:${pct}%"></i></div></div>
      <div style="color:var(--ink-3);font-size:11px;letter-spacing:.2em">LOADING ${pct}%</div>
    </section>`;
}

async function boot() {
  fitApp();
  showLoading(0);
  try {
    await loadAssets((done, total) => showLoading(Math.round((done / total) * 100)));
  } catch (e) {
    root.innerHTML = `<section class="screen" style="position:static;display:flex;align-items:center;justify-content:center;padding:24px;color:var(--atk);text-align:center">에셋 로딩 실패<br><small style="color:var(--ink-3)">${e.message}</small></section>`;
    return;
  }
  checkSave();
  showScreen("title");
}

boot();
