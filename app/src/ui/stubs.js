// 아직 새 구조로 포팅되지 않은 화면용 임시 스텁.
import { L, getLang } from "../core/i18n.js";
import { showScreen } from "../core/screens.js";

const backLabel = () => (getLang() === "ko" ? "뒤로" : "戻る");

function stub(title, note, back) {
  return {
    mount(root) {
      const el = document.createElement("section");
      el.className = "screen";
      el.style.cssText = "position:static;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:24px;text-align:center;";
      el.innerHTML = `
        <div class="df-logo" style="opacity:.9"><span class="word w1" style="font-size:30px">DESTINY</span><span class="word w2" style="font-size:30px">FANTASY</span></div>
        <div class="win win-pad" style="max-width:300px">
          <div class="win-title"><span>${title}</span></div>
          <p style="padding:16px 14px;color:var(--ink-2);font-size:13px;line-height:1.7">${note}</p>
        </div>
        <button class="gbtn" id="back">‹ ${backLabel()}</button>`;
      root.appendChild(el);
      el.querySelector("#back").onclick = back;
      return el;
    },
  };
}

export const CharsScreen = () => stub(L("chars"), "캐릭터 도감 화면 — 이식 예정", () => showScreen("title"));
export const SettingsScreen = () => stub(L("settings"), "설정 화면 — 이식 예정", () => showScreen("title"));
export const MenuScreen = () => stub(L("menu"), "메뉴/스테이터스/편성 — 이식 예정", () => showScreen("field"));
export const BattleScreen = () => stub("BATTLE", "전투 시스템 — 다음 단계에서 이식 예정.<br>필드 탐험·이동·인카운터·자동저장은 동작합니다.", () => showScreen("field"));
