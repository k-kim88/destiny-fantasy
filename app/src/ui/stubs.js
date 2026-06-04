// 아직 새 구조로 포팅되지 않은 화면용 임시 스텁.
// (필드/전투/메뉴/캐릭터/설정은 원작 index.html에서 단계적으로 이식 예정)
import { L } from "../core/i18n.js";
import { showScreen } from "../core/screens.js";

function stub(titleKey, note) {
  return {
    mount(root) {
      const el = document.createElement("section");
      el.className = "screen";
      el.style.cssText = "position:static;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:24px;text-align:center;";
      el.innerHTML = `
        <div class="df-logo" style="opacity:.9"><span class="word w1" style="font-size:30px">DESTINY</span><span class="word w2" style="font-size:30px">FANTASY</span></div>
        <div class="win win-pad" style="max-width:300px">
          <div class="win-title"><span>${typeof titleKey === "function" ? titleKey() : L(titleKey)}</span></div>
          <p style="padding:16px 14px;color:var(--ink-2);font-size:13px;line-height:1.7">${note}</p>
        </div>
        <button class="gbtn" id="back">‹ ${L("back")}</button>`;
      root.appendChild(el);
      el.querySelector("#back").onclick = () => showScreen("title");
      return el;
    },
  };
}

export const FieldScreen = () => stub(() => L("toField"), "필드/전투 시스템을 새 구조로 이식하는 중입니다.<br>현재는 새 프로젝트의 코어(화면 전환·저장·다국어·에셋 로딩)와 타이틀이 동작합니다.");
export const CharsScreen = () => stub("chars", "캐릭터 도감 화면 — 이식 예정");
export const SettingsScreen = () => stub("settings", "설정 화면 — 이식 예정");
