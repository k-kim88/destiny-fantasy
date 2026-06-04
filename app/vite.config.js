import { defineConfig } from "vite";

// GitHub Pages: https://<user>.github.io/destiny-fantasy/app/ 에 배포
// 로컬 dev에서는 "/" 로 동작하도록 환경에 따라 base 설정
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/destiny-fantasy/app/" : "/",
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
}));
