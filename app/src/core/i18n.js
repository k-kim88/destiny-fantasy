// 언어 데이터 (원작 index.html에서 추출). 함수형 문자열 포함.
const T={
 ko:{newGame:"새 게임",cont:"이어하기",chars:"캐릭터",settings:"설정",turnOrder:"행동 순서",
   cmd:"커맨드",magic:"마법",item:"아이템",target:"대상 선택",skill:"특기",tapTarget:"대상을 탭하세요",
   execute:"실행",cancel:"취소",flee:"도주",back:"뒤로",close:"닫기",toField:"필드로",
   front:"전열",back:"후열",party:"파티",menu:"메뉴",gil:"소지금",playTime:"플레이 타임",
   commands:["공격","마법","특기","아이템","방어","도주"],
   menuCmds:["아이템","마법","장비","능력","편성","스테이터스","설정","세이브"],
   baseLabels:["힘","체력","마력","정신","민첩","운"],derivedLabels:["공격","방어","마공","마방","회피","치명"],
   elements:["화","빙","뇌","풍","광","암"],baseTitle:"기본 능력치",battleTitle:"전투 능력치",
   equipTitle:"장비",elemTitle:"속성 내성",nextLv:"다음 레벨까지",lvUp:"레벨 업!",
   formDesc:"탭하여 전열 ↔ 후열을 전환합니다. 전열은 받는 물리 피해와 가하는 근접 피해가 모두 큽니다. 후열은 피해를 덜 받지만 근접 위력이 감소합니다.",
   emptySlot:"빈 자리",enemyLine:"적진",formBonus:"진형 보너스: 전열 방어 +0% · 후열 피격 −30%",
   sound:"사운드",theme:"테마",font:"글꼴",language:"언어",fontOpt:["세리프","산세리프","도트"],
   appeared:n=>`${n}이(가) 나타났다!`,victory:"승리!",gained:n=>`경험치 ${n} 획득`,
   wiped:"파티가 전멸했다...",defeated:n=>`${n}을(를) 쓰러뜨렸다!`,fled:"도망쳤다!",noflee:"도망칠 수 없었다!",
   defend:n=>`${n}은(는) 방어 태세!`,saved:"저장되었습니다",loaded:"불러왔어요",noSave:"저장 데이터 없음",autoSaved:"저장됨",noStore:"이 환경은 저장 미지원",
   locName:"북부 평원" },
 ja:{newGame:"はじめから",cont:"つづきから",chars:"キャラ",settings:"せってい",turnOrder:"行動順",
   cmd:"コマンド",magic:"まほう",item:"どうぐ",target:"たいしょう選択",skill:"とくぎ",tapTarget:"たいしょうをタップ",
   execute:"けってい",cancel:"キャンセル",flee:"にげる",back:"もどる",close:"とじる",toField:"フィールドへ",
   front:"前列",back:"後列",party:"パーティ",menu:"メニュー",gil:"しょじきん",playTime:"プレイ時間",
   commands:["こうげき","まほう","とくぎ","どうぐ","ぼうぎょ","にげる"],
   menuCmds:["どうぐ","まほう","そうび","のうりょく","たいれつ","ステータス","せってい","セーブ"],
   baseLabels:["力","体力","魔力","精神","敏捷","運"],derivedLabels:["攻撃","防御","魔攻","魔防","回避","会心"],
   elements:["火","氷","雷","風","光","闇"],baseTitle:"きほん能力",battleTitle:"せんとう能力",
   equipTitle:"そうび",elemTitle:"属性たいせい",nextLv:"次のレベルまで",lvUp:"レベルアップ！",
   formDesc:"タップで 前列 ↔ 後列 を切り替え。前列は受ける物理ダメージと与える近接ダメージが大きい。後列は被ダメージが減るが近接威力が下がる。",
   emptySlot:"くうせき",enemyLine:"てきじん",formBonus:"たいれつボーナス: 前列 防御 +0% · 後列 被弾 −30%",
   sound:"サウンド",theme:"テーマ",font:"フォント",language:"げんご",fontOpt:["セリフ","サンセリフ","ドット"],
   appeared:n=>`${n}が あらわれた！`,victory:"しょうり！",gained:n=>`経験値 ${n} かくとく`,
   wiped:"パーティは ぜんめつした...",defeated:n=>`${n}を たおした！`,fled:"にげだした！",noflee:"にげられない！",
   defend:n=>`${n}は ぼうぎょ！`,saved:"セーブしました",loaded:"ロードしました",noSave:"セーブデータなし",autoSaved:"セーブ",noStore:"この環境はセーブ非対応",
   locName:"北の平原" }
};

let lang = (() => { try { return localStorage.getItem("df_lang") || "ko"; } catch (e) { return "ko"; } })();
export function getLang() { return lang; }
export function setLang(l) { lang = l; try { localStorage.setItem("df_lang", l); } catch (e) {} }
export function L(k) { return T[lang][k]; }
// 캐릭터/직업 등 {ko,ja} 형태의 다국어 객체를 현재 언어로
export function nm(o) { return o == null ? "" : (typeof o === "object" ? (o[lang] ?? o.ko ?? "") : o); }
export { T };
