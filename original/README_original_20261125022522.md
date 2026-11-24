# 발표용 프로필 사이트 (서울시립대 실전 AI 과정 · 2026.11.27)

15분 발표 구성표(v3) 순서대로 넘기는 프로필 사이트입니다. 기존 프로필(https://web-resume-bice.vercel.app)은 그대로 두고, 이 저장소를 새 Vercel 프로젝트로 따로 배포합니다.

| 순서 | 주소 | 내용 | 시간 |
|---|---|---|---|
| 01 | `/` | 홈 · 자기소개 · 오늘 발표 순서 | 1분 |
| 02 | `/midterm` | 중간평가 · 서울 메이트 (네 가지 방식 비교표, 대시보드 열기) | 3분 |
| 03 | `/erlink` | 1차 프로젝트 · ERLink AI (구조, 시연 순서, 예비 캡처) | 4분 |
| 04 | `/extra` | 추가 프로젝트 | 3분 |
| 05 | `/results` | 성과 · 마무리 | 4분 |

- 발표 중 키보드 `→` `←` (또는 PageDown·PageUp)로 다음·이전 페이지
- 순서·시간·링크는 `data/talk.ts` 한 곳에서 바꿉니다
- ERLink 시연 버튼은 발표 노트북에서 ERLink가 실행 중일 때만 열립니다 (`localhost:3000`)
- 디자인: 기존 프로필의 "근거 노트" 토큰(색·글꼴)을 그대로 씀 — `app/globals.css`
- 검색 노출 안 함 (`robots: noindex`)

## 실행 (내 PC)

```powershell
npm install        # 의존성 설치 (처음 한 번)
npm run dev        # 개발 서버 http://localhost:3001 (ERLink 가 3000 을 쓰므로 3001)
npm run build      # 배포 전 빌드 확인
```
