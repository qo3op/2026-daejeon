# 대전시 투표사무원 자동배정 시스템

서버 없이 GitHub Pages에서 실행하는 단일 HTML 프로토타입입니다.

## 실행 방법

`index.html`을 브라우저에서 열면 됩니다.

GitHub Pages 배포 주소 예시:

```text
https://qo3op.github.io/2026-daejeon/
```

## 카카오 주소 변환 키

카카오 JavaScript 키는 코드에 저장하지 않습니다.

화면 상단의 `카카오 JavaScript 키` 입력칸에 키를 입력한 뒤 `키 저장`을 누르면 현재 브라우저의 localStorage에만 저장됩니다.

카카오 개발자 콘솔의 Web 플랫폼 도메인에는 아래 주소를 등록하세요.

```text
https://qo3op.github.io
https://qo3op.github.io/2026-daejeon
```

## CSV 업로드

신청명단 CSV는 주소만 있어도 업로드 후 좌표 변환을 시도합니다. 변환된 위도/경도는 화면의 신청명단에 채워지고 `좌표 포함 신청명단 다운로드` 버튼으로 내려받을 수 있습니다.

투표소 CSV 권장 컬럼:

```text
구분,자치구,행정동,투표소명,주소,필요인원,위도,경도
```

신청명단 CSV 권장 컬럼:

```text
부서명,성명,직급,생년월일,연락처,주소,가능투표유형
```

## 보안

`.env`, 엑셀/CSV/PDF/HWPX/HWP, 백업 파일, 실행파일, 빌드 산출물은 `.gitignore`로 제외합니다.
