import { defineConfig } from "vite";

// GitHub Pages: https://<user>.github.io/destiny-fantasy/app/ 에 배포
// 로컬 dev에서는 "/" 로 동작하도록 환경에 따라 base 설정
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/destiny-fantasy/app/" : "/",
  build: {
    outDir: "dist",
    // 구형 iOS Safari까지 호환되도록 최신 문법(??, ?. 등)을 트랜스파일
    target: ["es2017", "safari11"],
    assetsInlineLimit: 0,
    // 파일명을 해시 없이 고정 → 캐시된 옛 index.html이 사라진 해시 파일을
    // 404로 가리키는 문제를 방지 (재배포해도 경로가 안정적)
    rollupOptions: {
      output: {
        entryFileNames: "assets/app.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/app[extname]",
      },
    },
  },
}));
