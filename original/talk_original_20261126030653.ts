// 발표 순서 = 메뉴 순서 (서울시립대 실전 AI 과정 15분 발표 구성표 — 11/25 개편: 1·3·7·1·3분)
// 순서·시간·이름을 바꾸려면 여기만 고치면 메뉴, 이전·다음 버튼, ←→ 키 이동이 함께 바뀝니다.
export type Step = {
  no: string;
  path: string;
  label: string; // 메뉴에 보이는 짧은 이름
  title: string; // 이전·다음 버튼에 보이는 이름
  minutes: number;
  range: string; // 발표 시간표 위치
  summary: string; // 홈의 '오늘 발표' 한 줄
};

export const steps: Step[] = [
  { no: "01", path: "/", label: "소개", title: "홈 · 자기소개", minutes: 1, range: "0:00–1:00", summary: "관심 분야와 오늘 소개할 프로젝트" },
  { no: "02", path: "/midterm", label: "중간평가", title: "중간평가 · 서울 메이트", minutes: 3, range: "1:00–4:00", summary: "외부 AI 없이 작은 모델로 혼잡도 맞히기 · 0% → 70% · 시연" },
  { no: "03", path: "/erlink", label: "ERLink", title: "메인 프로젝트 · ERLink AI", minutes: 7, range: "4:00–11:00", summary: "119 이송 병원 추천 — 신고부터 병원 승인까지 라이브 시연 · 배운 것을 이렇게 썼습니다" },
  { no: "04", path: "/extra", label: "추가 프로젝트", title: "추가 프로젝트", minutes: 1, range: "11:00–12:00", summary: "기억 탐정 AI · 서울 먹킷리스트 · 웹 이력서 플랫폼" },
  { no: "05", path: "/results", label: "성과", title: "성과 · 마무리", minutes: 3, range: "12:00–15:00", summary: "무엇을 달성했고 어떻게 확인했는지" },
];

export const links = {
  github: "https://github.com/songsh2066-sh",
  email: "songsh0529@gmail.com",
  // 기존 프로필 사이트의 문서형 이력서 (그 사이트는 그대로 둡니다)
  resume: "https://web-resume-bice.vercel.app/ko/resume",
  seoulmate: "https://litellm-song.koreasouth.cloudapp.azure.com/seoulmate/",
  // ERLink 공개 주소 (발표 노트북의 ERLink 를 Cloudflare Tunnel 로 연결 — 노트북에서 실행 중일 때만 열림)
  erlink: "https://erlink.songsh.cloud",
  erlinkReport: "https://erlink.songsh.cloud/report",
  erlinkReportOld: "https://erlink.songsh.cloud/report?ui=old",
  erlinkDecide: "https://erlink.songsh.cloud/decide",
  erlinkAudit: "https://erlink.songsh.cloud/audit",
  // 교육 기간에 만든 서울 먹킷리스트 (나들이·맛집 코스 에이전트, 11/26 이름 변경 — 중간평가 서울 메이트와 다른 프로젝트)
  seoulmateTrip: "https://seoulmate-six.vercel.app/",
  memoryDetective:
    "https://script.google.com/macros/s/AKfycbxQjsRZW1-UDQfN7ywW4rqMgDL-blAU6RKvAYGjGwj2rLLNMfTSRPapeKHV_gZEnhI9/exec",
  oldProfile: "https://web-resume-bice.vercel.app/ko",
};

export function neighbors(path: string) {
  const i = steps.findIndex((s) => s.path === path);
  return { prev: i > 0 ? steps[i - 1] : undefined, next: i >= 0 && i < steps.length - 1 ? steps[i + 1] : undefined, current: steps[i] };
}
