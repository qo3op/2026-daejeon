# 대전시 투표사무원 자동배정 시스템

Vite + Vanilla JavaScript 기반의 투표사무원 자동배정 프론트엔드 프로토타입입니다.

보안 점검 결과 npm `xlsx` 패키지는 현재 high severity 취약점이 있어 의존성에서 제외했습니다. 엑셀 업로드 UI와 정규화 함수는 남겨 두었고, 안전한 파서 검토 후 연결하도록 구성되어 있습니다.

## 설치 방법

```bash
npm install
```

PowerShell 실행 정책으로 `npm`이 막히는 경우 Windows에서는 아래 명령을 사용합니다.

```bash
npm.cmd install
```

## 필요한 환경변수

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```env
VITE_KAKAO_JS_KEY=카카오_JavaScript_키
```

실제 `.env` 파일은 GitHub에 올리지 않습니다. 예시는 `.env.example`을 확인하세요.

## 실행 방법

```bash
npm run dev
```

PowerShell 실행 정책으로 `npm`이 막히는 경우:

```bash
npm.cmd run dev
```

## 빌드 명령어

```bash
npm run build
```

PowerShell 실행 정책으로 `npm`이 막히는 경우:

```bash
npm.cmd run build
```
