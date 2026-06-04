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

## 프로젝트 구조

```
index.html              ← 게임 본체(단일 파일, 유일한 소스)
capacitor.config.json   ← Capacitor 설정 (appId, 스플래시, 상태바 등)
package.json            ← 빌드/동기화 스크립트
scripts/
  build-www.mjs         ← index.html → www/ 로 복사(웹 빌드)
  gen-assets.mjs        ← 아이콘/스플래시 소스 PNG 생성(sharp)
assets/                 ← 아이콘·스플래시 소스 이미지(1024 / 2732)
android/                ← Android 네이티브 프로젝트 (Android Studio로 열기)
ios/                    ← iOS 네이티브 프로젝트 (Xcode로 열기)
```

> `www/`, `node_modules/`, 네이티브 빌드 산출물은 `.gitignore` 처리되어 있습니다.
> 클론 후 항상 `npm install` → `npm run build`(또는 `npx cap sync`)를 먼저 실행하세요.

---

## 사전 준비

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
