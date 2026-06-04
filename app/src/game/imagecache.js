// 스프라이트/애니메이션 데이터 URI를 Image 객체로 미리 로드
import { ASSETS } from "../core/assets.js";

export const SPRIMG = {};
export const ANIMIMG = {};

export function preloadImages() {
  for (const k in ASSETS.sprites) {
    const im = new Image();
    im.src = ASSETS.sprites[k];
    SPRIMG[k] = im;
  }
  for (const k in ASSETS.anim) {
    ANIMIMG[k] = {};
    for (const st in ASSETS.anim[k]) {
      ANIMIMG[k][st] = ASSETS.anim[k][st].map((u) => {
        const im = new Image();
        im.src = u;
        return im;
      });
    }
  }
}
