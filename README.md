# DESTINY FANTASY — 모바일 앱 (Capacitor)

레트로 JRPG **DESTINY FANTASY**를 [Capacitor](https://capacitorjs.com/)로 감싸
Android(`.aab`/`.apk`) · iOS(`.ipa`) 네이티브 앱으로 빌드/배포할 수 있도록 구성한 프로젝트입니다.

게임 본체는 백엔드 없이 동작하는 **단일 파일** `index.html` 하나이며, Capacitor가 이를
네이티브 WebView로 감싸 앱스토어 배포가 가능한 형태로 만들어 줍니다.

| 항목 | 값 |
| --- | --- |
| App ID | `com.fancsglobal.destinyfantasy` |
| App Name | `DESTINY FANTASY` |
| Web 소스 | `index.html` (저장소 루트, 단일 파일) |
| Capacitor webDir | `www/` (`index.html`에서 생성됨, git 미추적) |

---

## 두 가지 사용 방법

| | PWA (설치형 웹앱) | Capacitor (네이티브 앱) |
| --- | --- | --- |
| 빌드 도구 | **불필요** | Android Studio / Xcode 필요 |
| 배포 | HTTPS 호스팅 + "홈 화면에 추가" | Google Play / App Store |
| 오프라인 | ✅ (서비스워커) | ✅ |
| 추천 | **지금 바로 쓰기** | 정식 스토어 출시 |

---

## ⭐ 방법 1: PWA (빌드 없이 바로 사용)

브라우저에서 설치해 전체화면·오프라인 앱처럼 쓰는 방식입니다. 빌드 도구가 필요 없습니다.

구성 파일: `index.html` · `manifest.webmanifest` · `sw.js` · `icons/`

### GitHub Pages로 호스팅 (무료, 자동)

1. GitHub 저장소 → **Settings → Pages → Build and deployment → Source** 를
   **"GitHub Actions"** 로 설정 (최초 1회)
2. 이 브랜치가 `main`에 머지되거나 푸시되면 `.github/workflows/pages.yml`이
   자동 배포 → `https://k-kim88.github.io/destiny-fantasy/` 에서 접속
3. 폰에서 그 주소를 열고:
   - **iOS(Safari):** 공유 → "홈 화면에 추가"
   - **Android(Chrome):** 메뉴(⋮) → "앱 설치" / "홈 화면에 추가"

> 이미 다른 곳에 호스팅 중이라면 GitHub Pages 없이도 됩니다.
> `index.html`, `manifest.webmanifest`, `sw.js`, `icons/` 4가지를
> **같은 폴더(HTTPS)** 에 함께 올리기만 하면 PWA로 동작합니다.

### 로컬에서 테스트

```bash
npx http-server . -p 8080    # 또는: python3 -m http.server 8080
# http://localhost:8080 접속 (localhost는 HTTPS 없이도 PWA 동작)
```

---

## 프로젝트 구조

```
index.html              ← 게임 본체(단일 파일, 유일한 소스)
manifest.webmanifest    ← PWA 매니페스트
sw.js                   ← PWA 서비스워커(오프라인 캐시)
icons/                  ← PWA 아이콘(192/512/maskable/apple-touch)
capacitor.config.json   ← Capacitor 설정 (appId, 스플래시, 상태바 등)
package.json            ← 빌드/동기화 스크립트
scripts/
  build-www.mjs         ← index.html + PWA 파일 → www/ 로 스테이징
  gen-assets.mjs        ← 네이티브 아이콘/스플래시 소스 PNG 생성(sharp)
  gen-pwa-icons.mjs     ← PWA 아이콘 생성(sharp)
assets/                 ← 네이티브 아이콘·스플래시 소스(1024 / 2732)
android/                ← Android 네이티브 프로젝트 (Android Studio로 열기)
ios/                    ← iOS 네이티브 프로젝트 (Xcode로 열기)
.github/workflows/      ← GitHub Pages 자동 배포(PWA 호스팅)
```

> `www/`, `node_modules/`, 네이티브 빌드 산출물은 `.gitignore` 처리되어 있습니다.
> 클론 후 항상 `npm install` → `npm run build`(또는 `npx cap sync`)를 먼저 실행하세요.

---

## 방법 2: Capacitor (앱스토어 네이티브 앱)

### 사전 준비

```bash
npm install            # 의존성 설치
npm run build          # index.html을 www/로 스테이징
npx cap sync           # www + 설정 + 플러그인을 네이티브 프로젝트에 반영
```

- **Android 빌드:** Android Studio + JDK 17 + Android SDK
- **iOS 빌드:** macOS + Xcode + CocoaPods (`sudo gem install cocoapods`)

---

## Android 빌드 / 실행

```bash
npm run build
npx cap sync android
npx cap open android        # Android Studio가 열림
```

Android Studio에서:
- 실기기/에뮬레이터로 실행: ▶ Run
- 스토어용 **AAB**: `Build → Generate Signed Bundle / APK → Android App Bundle`
  (최초 1회 업로드 키스토어 생성 필요)

CLI로 디버그 APK만 빠르게 뽑기:
```bash
cd android && ./gradlew assembleDebug
# 결과물: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## iOS 빌드 / 실행 (macOS 전용)

```bash
npm run build
npx cap sync ios
npx cap open ios            # Xcode가 열림
```

Xcode에서:
- `Signing & Capabilities`에서 본인 Apple Developer 팀 선택
- 실기기/시뮬레이터로 실행
- 스토어용 **IPA**: `Product → Archive → Distribute App`

---

## 아이콘 / 스플래시 변경

소스 이미지는 `assets/`에 있습니다 (`scripts/gen-assets.mjs`로 생성됨).
직접 만든 1024×1024 아이콘 / 2732×2732 스플래시로 교체한 뒤 재생성하세요:

```bash
node scripts/gen-assets.mjs            # (선택) 기본 테마 이미지 재생성
npx capacitor-assets generate --android --ios
```

생성되는 파일:
- `assets/icon-only.png` (1024) — 앱 아이콘
- `assets/icon-foreground.png` / `icon-background.png` — Android 적응형 아이콘
- `assets/splash.png` / `splash-dark.png` (2732) — 스플래시(라이트/다크)

---

## 게임 코드 수정 시

게임을 고치려면 루트의 `index.html`만 편집하면 됩니다. 이후:

```bash
npx cap sync       # 변경분을 네이티브 프로젝트로 반영
```

> **오프라인 동작 참고:** 현재 `index.html`은 Google Fonts를 네트워크로 불러옵니다.
> 인터넷이 없으면 시스템 serif 폰트로 자연스럽게 폴백되지만, 완전한 오프라인
> 일관성을 원하면 폰트를 앱 내부에 번들링(다운로드 후 로컬 `@font-face`로 포함)하는
> 것을 권장합니다. 게임 로직·세이브(localStorage)·오디오는 모두 오프라인에서 동작합니다.
