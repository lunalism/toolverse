# 🛠️ Toolverse - 무료 온라인 도구 모음

**Toolverse**는 일상과 업무에 필요한 다양한 도구들을 모아놓은 **올인원 온라인 툴박스**입니다.  
깔끔한 UI와 빠른 성능, 그리고 광고 없는 쾌적한 경험을 제공합니다.

---

## ✨ 주요 기능

| 카테고리       | 제공 도구                                                   |
|----------------|--------------------------------------------------------------|
| 이미지 도구    | HEIC 변환기, 이미지 → PDF 변환기, 컬러 추출기                |
| PDF 도구       | PDF 분할, 병합, 미리보기 기반 페이지 조작                   |
| 텍스트 도구    | 문자 수 세기, 텍스트 비교                                    |
| 유틸리티 도구  | 비밀번호 생성기, IP 주소 확인기, 나이/날짜 계산기           |

---

## ⚙️ 기술 스택

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **스타일링**: TailwindCSS + Pretendard
- **컴포넌트 라이브러리**: [shadcn/ui](https://ui.shadcn.com/)
- **이미지 변환**: `sharp`, `@saschazar/wasm-image-converter`
- **PDF 처리**: `pdf-lib`, `pdfjs-dist`
- **파일 핸들링**: `react-dropzone`

---

## 📦 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/lunalism/toolverse.git
cd toolverse

# 2. 패키지 설치
pnpm install

# 3. 개발 서버 실행
pnpm dev
```
로컬 서버: http://localhost:3000

---

## 🧩 기여 방법

Toolverse는 오픈소스로 누구나 기여할 수 있습니다.  
아래 가이드를 따라 자유롭게 기능 개선, 버그 수정, 아이디어 제안을 해주세요!

### 1. Issue 또는 PR 등록

- 개선 아이디어, 버그 리포트, 새로운 도구 제안 등 모두 환영합니다.
- 먼저 [Issues](https://github.com/your-username/toolverse/issues) 탭에서 중복 여부를 확인해주세요.

### 2. 개발 전 확인사항

- 브랜치는 `feature/도구명` 또는 `fix/문제명`으로 생성해주세요.
- 커밋 전 아래 명령어로 코드 정리 및 빌드 확인
  ```bash
  npm lint && npm build
  ```

### 3. 커밋 메시지 규칙

- 영어 + 이모지 스타일을 사용합니다.
- 예시:
  - `✨ feat: Add password strength meter`
  - `🐛 fix: Handle HEIC conversion error`
  - `🎨 style: Adjust layout spacing for PDF preview`

### 4. PR 작성 시 체크리스트

- [ ] 기능 설명 또는 변경 내용 요약
- [ ] 동작 스크린샷 포함 (UI 관련 변경일 경우)
- [ ] 관련 Issue 번호 태그 (예: `Closes #12`)

---

---

## 📄 라이선스

MIT License