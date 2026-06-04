// 게임 데이터: 스펠/아이템/몬스터/맵 (원작에서 추출)
const SPELLS={
 fire:{name:{ko:"파이어",ja:"ファイア"},mp:8,kind:"atkOne",power:60,el:0,emo:"🔥"},
 thunder:{name:{ko:"라이트닝",ja:"サンダー"},mp:22,kind:"atkAll",power:74,el:2,emo:"⚡"},
 heal:{name:{ko:"케어",ja:"ケアル"},mp:6,kind:"healOne",power:160,el:4,emo:"✨"},
};
const ITEMS={
 potion:{name:{ko:"포션",ja:"ポーション"},desc:{ko:"HP 150 회복",ja:"HP150回復"},kind:"hp",power:150},
 hipotion:{name:{ko:"하이포션",ja:"ハイポーション"},desc:{ko:"HP 500 회복",ja:"HP500回復"},kind:"hp",power:500},
 ether:{name:{ko:"에테르",ja:"エーテル"},desc:{ko:"MP 80 회복",ja:"MP80回復"},kind:"mp",power:80},
};
const MONSTERS={
 slime:{name:{ko:"슬라임",ja:"スライム"},emo:"🟢",hp:80,atk:30,def:10,spd:24,exp:26},
 bat:{name:{ko:"박쥐",ja:"コウモリ"},emo:"🦇",hp:60,atk:34,def:6,spd:54,exp:30},
 goblin:{name:{ko:"고블린",ja:"ゴブリン"},emo:"👺",hp:120,atk:42,def:18,spd:32,exp:54},
 dragon:{name:{ko:"드래곤",ja:"ドラゴン"},emo:"🐉",hp:1800,atk:80,def:34,spd:42,exp:420,boss:true},
};

/* 맵 */
const MAP=["111111111111111","100000000000141","101100010001001","100001010101001",
 "100101000100001","100100220010011","100000220010001","101100000100101",
 "100001010001001","153000100000001","111111111111111"].map(r=>r.split("").map(Number));
const COLS=MAP[0].length,ROWS=MAP.length,WALK=new Set([0,3,4,5]);

export const TILE = 48, CANW = 393, CANH = 852;
export const clampf = (v, a, b) => (v < a ? a : v > b ? b : v);
export { SPELLS, ITEMS, MONSTERS, MAP, COLS, ROWS, WALK };
