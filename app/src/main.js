// DESTINY FANTASY v2 — 부트스트랩
import "./style.css";
import { initScreens, registerScreen, showScreen } from "./core/screens.js";
import { loadAssets } from "./core/assets.js";
import { checkSave } from "./core/storage.js";
import { preloadImages } from "./game/imagecache.js";
import { TitleScreen } from "./ui/title.js";
import { FieldScreen } from "./game/field.js";
import { CharsScreen, SettingsScreen, MenuScreen, BattleScreen } from "./ui/stubs.js";

// 모듈이 실제로 로드/실행되었음을 표시 (index.html의 부팅 타임아웃 진단용)
window.__DF_BOOTED = true;

const root = document.getElementById("screens");
initScreens(root);

function showError(msg) {
  root.innerHTML = `<section class="screen" style="position:static;display:flex;align-items:center;justify-content:center;height:100%;padding:24px;color:#ff9a8a;text-align:center;white-space:pre-wrap;font-size:13px">실행 오류\n\n${msg}</section>`;
}

registerScreen("title", TitleScreen);
registerScreen("field", FieldScreen);
registerScreen("battle", BattleScreen);
registerScreen("menu", MenuScreen);
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
  try {
    fitApp();
    showLoading(0);
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("에셋 로딩 시간 초과 (네트워크/캐시 확인)")), 15000));
    await Promise.race([loadAssets((done, total) => showLoading(Math.round((done / total) * 100))), timeout]);
    preloadImages();
    checkSave();
    showScreen("title");
  } catch (e) {
    showError((e && (e.stack || e.message)) || "unknown error");
  }
}

boot();
