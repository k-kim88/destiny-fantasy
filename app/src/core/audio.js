// 사운드 (Web Audio 합성) — 원작에서 추출
let AC=null,muted=false;
function audioInit(){ if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}} if(AC&&AC.state==="suspended")AC.resume(); }
function blip(f,d,t="square",v=.13,sl=null){ if(muted||!AC)return; const n=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();
  o.type=t;o.frequency.setValueAtTime(f,n);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(40,sl),n+d);
  g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(AC.destination);o.start(n);o.stop(n+d);}
function noise(d,v=.25,cut=1800){ if(muted||!AC)return; const n=AC.currentTime,s=AC.createBufferSource();
  const b=AC.createBuffer(1,Math.max(1,AC.sampleRate*d),AC.sampleRate),dd=b.getChannelData(0);
  for(let i=0;i<dd.length;i++)dd[i]=(Math.random()*2-1)*(1-i/dd.length);
  s.buffer=b;const g=AC.createGain(),fl=AC.createBiquadFilter();fl.type="lowpass";fl.frequency.value=cut;
  g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);s.connect(fl).connect(g).connect(AC.destination);s.start(n);s.stop(n+d);}
const SFX={
 menu:()=>blip(520,.05,"square",.09), attack:()=>blip(200,.08,"square",.12,90),
 hit:()=>{noise(.16,.3,1600);blip(120,.1,"sawtooth",.1,60);}, crit:()=>{noise(.24,.38,2400);blip(160,.16,"sawtooth",.14,70);},
 fire:()=>{noise(.32,.22,1200);blip(220,.3,"sawtooth",.1,520);}, thunder:()=>{noise(.26,.36,3000);blip(950,.18,"square",.12,180);},
 heal:()=>[523,659,784].forEach((f,i)=>setTimeout(()=>blip(f,.14,"sine",.12),i*85)),
 item:()=>{blip(660,.08,"triangle",.12);setTimeout(()=>blip(880,.1,"triangle",.12),80);},
 encounter:()=>{blip(300,.08,"square",.12);setTimeout(()=>blip(520,.12,"square",.12),90);},
 level:()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>blip(f,.14,"square",.12),i*90)),
 win:()=>[523,659,784,1047,880,1047].forEach((f,i)=>setTimeout(()=>blip(f,.2,"square",.13),i*130)),
 lose:()=>[392,330,262,196].forEach((f,i)=>setTimeout(()=>blip(f,.28,"triangle",.13),i*170)),
};

export { audioInit, SFX };
export function setMuted(m){ muted = m; }
