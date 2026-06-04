// 타이틀 화면
import { L, getLang, setLang } from "../core/i18n.js";
import { hasSaveData } from "../core/storage.js";
import { showScreen } from "../core/screens.js";
import { newGame, loadGame } from "../game/state.js";
import { toast } from "../core/toast.js";

export function TitleScreen() {
  return {
    mount(root) {
      const el = document.createElement("section");
      el.className = "screen";
      el.style.position = "static";
      const canCont = hasSaveData();
      el.innerHTML = `
        <div class="top"><div class="langpill" id="langTop"></div></div>
        <div class="logowrap df-logo">
          <span class="word w1">DESTINY</span><span class="word w2">FANTASY</span>
          <div class="df-rule"><span class="line"></span><span class="gem"></span><span class="line r"></span></div>
          <div class="df-sub">A CLASSIC TALE</div>
        </div>
        <div class="win menuwin" style="margin-bottom:6px;">
          <ul class="menu-list" id="titleMenu">
            <li class="menu-item sel" data-a="new">${L("newGame")}</li>
            <li class="menu-item ${canCont ? "" : "disabled"}" data-a="cont">${L("cont")}<span class="sub">${canCont ? "Ch.1" : ""}</span></li>
            <li class="menu-item" data-a="chars">${L("chars")}</li>
            <li class="menu-item" data-a="settings">${L("settings")}</li>
          </ul>
        </div>
        <div class="foot">© 2026 DAWN STUDIO · Ver 2.0</div>`;
      root.appendChild(el);

      // 언어 토글
      const langTop = el.querySelector("#langTop");
      const renderLang = () => {
        langTop.innerHTML = ["ko", "ja"].map(l =>
          `<button class="chip ${getLang() === l ? "on" : ""}" data-l="${l}">${l === "ko" ? "한국어" : "日本語"}</button>`
        ).join("");
        langTop.querySelectorAll(".chip").forEach(b => b.onclick = () => {
          setLang(b.dataset.l);
          showScreen("title");
        });
      };
      renderLang();

      // 메뉴
      const items = el.querySelectorAll(".menu-item");
      items.forEach(li => {
        li.onmouseenter = () => { items.forEach(x => x.classList.remove("sel")); li.classList.add("sel"); };
        li.onclick = () => {
          const a = li.dataset.a;
          if (a === "new") { newGame(); showScreen("field"); }
          else if (a === "cont" && canCont) { if (loadGame()) showScreen("field"); else toast(L("noSave")); }
          else if (a === "chars") showScreen("chars");
          else if (a === "settings") showScreen("settings");
        };
      });
      return el;
    },
  };
}
