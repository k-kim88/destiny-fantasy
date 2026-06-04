// 에셋 로더 — 정적 JSON 데이터(그림/스프라이트/애니메이션/스토리)를 부팅 시 로드
// 원작에서는 모든 base64 그림이 HTML에 인라인돼 있었지만, 여기서는 public/data/*.json 으로 분리해 로드한다.

const FILES = {
  art: "data/art.json",       // 캐릭터 일러스트 (컷신용)
  sprites: "data/sprites.json", // 필드/메뉴 스프라이트
  anim: "data/anim.json",     // 전투 애니메이션 프레임
  story: "data/story.json",   // 스토리 스크립트
  ch1: "data/ch1.json",       // 챕터1 대본
};

export const ASSETS = { art: {}, sprites: {}, anim: {}, story: {}, ch1: [] };

// base()는 Vite가 배포 경로(BASE_URL)를 주입
function url(p) {
  const env = import.meta.env || {};
  const base = env.BASE_URL || "/";
  return base.replace(/\/$/, "") + "/" + p;
}

export async function loadAssets(onProgress) {
  const keys = Object.keys(FILES);
  let done = 0;
  await Promise.all(
    keys.map(async (k) => {
      const res = await fetch(url(FILES[k]));
      if (!res.ok) throw new Error(`failed to load ${FILES[k]}: ${res.status}`);
      ASSETS[k] = await res.json();
      done++;
      onProgress && onProgress(done, keys.length, k);
    })
  );
  return ASSETS;
}

// 헬퍼: 캐릭터 스프라이트/애니 프레임 URI
export function frameURI(key, state, idx = 0) {
  const a = ASSETS.anim && ASSETS.anim[key];
  if (a && a[state] && a[state].length) return a[state][Math.min(idx, a[state].length - 1)];
  return (ASSETS.sprites && ASSETS.sprites[key]) || null;
}
