// 캐릭터/직업 데이터 (원작 index.html에서 추출)
const ROSTER=[
 {key:"gwangmin",name:{ko:"광민",ja:"グァンミン"},job:{ko:"용사",ja:"勇者"},role:"hero",row:"front",
  hp:240,mp:42,atk:46,def:34,mat:18,spd:38,spells:["fire"],
  str:80,vit:74,mag:24,spr:36,agi:56,luk:42,
  eq:[{s:{ko:"무기",ja:"武器"},n:{ko:"군용 검",ja:"軍用剣"}},{s:{ko:"방패",ja:"盾"},n:{ko:"강철 방패",ja:"鋼の盾"}},
      {s:{ko:"머리",ja:"頭"},n:{ko:"전투모",ja:"戦闘帽"}},{s:{ko:"몸",ja:"体"},n:{ko:"방탄 야상",ja:"防弾ジャケット"}},
      {s:{ko:"장신구",ja:"装飾"},n:{ko:"군번줄",ja:"認識票"}}],res:{0:0,1:0,2:0,3:1,4:1,5:-1}},
 {key:"akane",name:{ko:"아카네",ja:"アカネ"},job:{ko:"마법사",ja:"魔法使い"},role:"mage",row:"back",
  hp:160,mp:130,atk:24,def:22,mat:62,spd:42,spells:["fire","thunder","heal"],
  str:28,vit:40,mag:78,spr:66,agi:50,luk:48,
  eq:[{s:{ko:"무기",ja:"武器"},n:{ko:"견습 지팡이",ja:"見習いの杖"}},{s:{ko:"방패",ja:"盾"},n:{ko:"—",ja:"—"}},
      {s:{ko:"머리",ja:"頭"},n:{ko:"마녀 모자",ja:"魔女の帽子"}},{s:{ko:"몸",ja:"体"},n:{ko:"수습 로브",ja:"見習いローブ"}},
      {s:{ko:"장신구",ja:"装飾"},n:{ko:"마력의 구슬",ja:"魔力の珠"}}],res:{0:1,1:1,2:1,3:0,4:-1,5:1}},
 {key:"pu",name:{ko:"푸",ja:"プー"},job:{ko:"궁수",ja:"弓使い"},role:"archer",row:"front",
  hp:185,mp:40,atk:48,def:24,mat:20,spd:56,spells:[],
  str:64,vit:52,mag:24,spr:34,agi:86,luk:60,
  eq:[{s:{ko:"무기",ja:"武器"},n:{ko:"장궁",ja:"長弓"}},{s:{ko:"방패",ja:"盾"},n:{ko:"—",ja:"—"}},
      {s:{ko:"머리",ja:"頭"},n:{ko:"—",ja:"—"}},{s:{ko:"몸",ja:"体"},n:{ko:"가죽 조끼",ja:"革のベスト"}},
      {s:{ko:"장신구",ja:"装飾"},n:{ko:"숲의 부적",ja:"森の護符"}}],res:{0:-1,1:0,2:0,3:2,4:0,5:0}},
 {key:"minmin",name:{ko:"민민",ja:"ミンミン"},job:{ko:"격투가",ja:"格闘家"},role:"brawler",row:"front",
  hp:280,mp:24,atk:52,def:28,mat:10,spd:40,spells:[],
  str:94,vit:88,mag:8,spr:20,agi:44,luk:32,
  eq:[{s:{ko:"무기",ja:"武器"},n:{ko:"강철 너클",ja:"鋼のナックル"}},{s:{ko:"방패",ja:"盾"},n:{ko:"—",ja:"—"}},
      {s:{ko:"머리",ja:"頭"},n:{ko:"—",ja:"—"}},{s:{ko:"몸",ja:"体"},n:{ko:"붕대",ja:"包帯"}},
      {s:{ko:"장신구",ja:"装飾"},n:{ko:"끊어진 족쇄",ja:"砕けた枷"}}],res:{0:1,1:-1,2:0,3:0,4:-1,5:1}},
 {key:"tachikawa",name:{ko:"타치카와",ja:"タチカワ"},job:{ko:"힐러",ja:"ヒーラー"},role:"cleric",row:"back",
  hp:170,mp:140,atk:22,def:24,mat:46,spd:36,spells:["heal","fire"],
  str:32,vit:46,mag:50,spr:84,agi:46,luk:54,
  eq:[{s:{ko:"무기",ja:"武器"},n:{ko:"치유 지팡이",ja:"癒しの杖"}},{s:{ko:"방패",ja:"盾"},n:{ko:"—",ja:"—"}},
      {s:{ko:"머리",ja:"頭"},n:{ko:"성포 두건",ja:"聖布の頭巾"}},{s:{ko:"몸",ja:"体"},n:{ko:"사제 로브",ja:"司祭のローブ"}},
      {s:{ko:"장신구",ja:"装飾"},n:{ko:"생명의 펜던트",ja:"命のペンダント"}}],res:{0:0,1:0,2:0,3:0,4:2,5:-2}},
];
const GROWTH={
 hero:{hp:34,mp:4,atk:6,def:5,mat:2,spd:2,str:4,vit:4,mag:1,spr:1,agi:2,luk:1},
 mage:{hp:18,mp:14,atk:2,def:2,mat:7,spd:2,str:1,vit:2,mag:5,spr:3,agi:2,luk:2},
 archer:{hp:22,mp:5,atk:6,def:2,mat:2,spd:4,str:3,vit:2,mag:1,spr:1,agi:5,luk:3},
 brawler:{hp:38,mp:3,atk:7,def:3,mat:0,spd:3,str:5,vit:5,mag:0,spr:1,agi:2,luk:1},
 cleric:{hp:22,mp:14,atk:2,def:2,mat:5,spd:2,str:1,vit:2,mag:3,spr:5,agi:2,luk:2},
};
const LEARN={ hero:{4:"skillready"}, mage:{}, cleric:{} };

function mk(r){const o={key:r.key,name:r.name,job:r.job,role:r.role,row:r.row,lv:1,exp:0,
  hp:r.hp,maxHp:r.hp,mp:r.mp,maxMp:r.mp,atk:r.atk,def:r.def,mat:r.mat,spd:r.spd,spells:[...r.spells],
  str:r.str,vit:r.vit,mag:r.mag,spr:r.spr,agi:r.agi,luk:r.luk,eq:r.eq,res:r.res};return o;}

export { ROSTER, GROWTH, LEARN, mk };
