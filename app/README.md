# DESTINY FANTASY — v2 (모듈형 재구축)

원작 단일 파일 게임(`/index.html`)을 **제대로 된 프로젝트 구조**로 처음부터 다시 만드는 작업 폴더입니다.
원작은 그대로 두고(루트의 `index.html`, 라이브 `…/destiny-fantasy/`), 이 폴더에서 새 구조로 점진 이식합니다.

- **스택**: Vite + 바닐라 JS(ES 모듈) — 빌드는 GitHub Actions가 수행
- **배포 위치**: `https://k-kim88.github.io/destiny-fantasy/app/` (루트 게임과 별도)
- **그림/스토리 데이터**: 원작에서 추출해 `public/data/*.json` 으로 분리 (부팅 시 로드)

## 구조

```
app/
  index.html              앱 셸 (#app, #screens, 토스트/저장마크)
  vite.config.js          base=/destiny-fantasy/app/ (배포 서브경로)
  public/
    manifest.webmanifest  PWA 매니페스트
    icons/                PWA 아이콘
    data/                 원작에서 추출한 그림·스토리 데이터(JSON)
      art / sprites / anim / story / ch1
  src/
    main.js               부트스트랩 (에셋 로딩 → 타이틀)
    style.css             디자인 시스템(원작 CSS 이식) + v2 호스트 스타일
    core/
      i18n.js             다국어(ko/ja) 문자열 + L()/nm()
      storage.js          저장 시스템(localStorage) + 저장 마크
      assets.js           정적 데이터 로더 + frameURI()
      screens.js          화면 라우터(등록/전환)
    ui/
      title.js            타이틀 화면 (동작)
      stubs.js            필드/캐릭터/설정 임시 화면(이식 예정)
```

## 로컬 개발

```bash
cd app
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성 (CI가 자동 수행)
```

## 진행 상황 / 로드맵

- [x] 프로젝트 스캐폴드 (Vite, 폴더 구조, CI 배포)
- [x] 코어: 화면 라우터 · 저장(localStorage) · 다국어 · 에셋 로더
- [x] 디자인 시스템 CSS 이식, 로딩 화면, **타이틀 화면**
- [ ] 필드(맵/이동/인카운터) 이식 — `src/game/field.js`
- [ ] 전투 시스템 이식 — `src/game/battle.js`
- [ ] 메뉴/스테이터스/편성 이식 — `src/ui/`
- [ ] 스토리/컷신 이식
- [ ] 게임 데이터 모듈화(캐릭터/몬스터/아이템/스펠/맵) — `src/data/`
- [ ] 자동저장 · PWA 서비스워커 · 오프라인

> 전투/필드 등 게임 로직은 원작에서 한 모듈씩 옮겨오며, 옮길 때마다 `app/` 빌드가
> `…/destiny-fantasy/app/` 에 배포되어 바로 확인할 수 있습니다.
