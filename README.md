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

1. Issue 또는 PR 등록 (아이디어, 버그, 기능 제안 등 모두 환영!)
2. PR 전 pnpm lint && pnpm build 통과 확인
3. 커밋 메시지 스타일:
- 영어 + 이모지 조합 예시:
  -✨ feat: Add password strength meter
  - 🐛 fix: Resolve image upload bug

---

## 📄 라이선스

MIT License