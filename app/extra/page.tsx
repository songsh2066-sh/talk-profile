import type { Metadata } from "next";
import Image from "next/image";
import PageHead from "@/components/PageHead";
import Pager from "@/components/Pager";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "추가 프로젝트" };

// 04 추가 프로젝트 (합계 1분, 11/25 개편) — 교육 기간 동안 만든 것 3개 (사용자가 준 순서: 기억 탐정 → 서울 메이트 → 웹 이력서)
//   서울 메이트(나들이 코스, seoulmate-six.vercel.app)는 중간평가의 서울 메이트(혼잡도 안내)와 다른 프로젝트
//   내용 출처: 각 사이트와 웹 이력서의 프로젝트 기록 (11/25 확인)
type Project = {
  name: string;
  when: string;
  one: string;
  note?: string;
  facts: { v: string; l: string }[];
  tech: string[];
  href: string;
  cta: string;
  host: string;
  shot?: { src: string; alt: string; w: number; h: number };
};

const projects: Project[] = [
  {
    name: "기억 탐정 AI",
    when: "2026.10 · 배포됨",
    one: "기억나는 장면과 힌트 카드만으로 영화·애니메이션 후보를 근거와 함께 찾아 주는 AI.",
    facts: [
      { v: "4", l: "배포한 버전 (1.0 → 1.3)" },
      { v: "6", l: "힌트 카드 항목" },
      { v: "0", l: "서버에 남는 입력" },
    ],
    tech: ["Apps Script", "JavaScript", "OpenAI API"],
    href: links.memoryDetective,
    cta: "Web app ↗",
    host: "script.google.com",
    shot: { src: "/projects/memory-detective.webp", alt: "기억 탐정 사건 접수서 화면: 기억나는 장면과 힌트 카드 입력", w: 910, h: 568 },
  },
  {
    name: "서울 메이트",
    when: "2026.10 · 배포됨",
    one: "날씨·혼잡도·운영시간을 도구로 직접 확인해 서울 나들이와 맛집 코스를 짜 주는 AI 에이전트.",
    note: "중간평가의 서울 메이트(혼잡도 안내)와는 다른 프로젝트",
    facts: [
      { v: "121", l: "실시간 연동 장소" },
      { v: "83", l: "자동 테스트" },
      { v: "2", l: "공공 데이터 API (서울시 · 관광공사)" },
    ],
    tech: ["Python", "FastAPI", "Claude API · Tool calling", "Vercel"],
    href: links.seoulmateTrip,
    cta: "사이트 보기 ↗",
    host: "seoulmate-six.vercel.app",
    shot: { src: "/projects/seoulmate-trip.webp", alt: "서울 메이트 첫 화면: 서울 먹킷리스트, 오늘은 어디로 갈까? 지금 가기 좋은 먹자골목 6곳과 실시간 장소 121곳", w: 1000, h: 822 },
  },
  {
    name: "웹 이력서 플랫폼",
    when: "배포됨",
    one: "경력 원장 기반 AI 이력서 플랫폼의 제안서·PRD를 쓰고, 공개 이력서 페이지를 Next.js로 만들어 Vercel에 배포.",
    facts: [
      { v: "2", l: "언어 (KO · EN)" },
      { v: "PDF", l: "인쇄용 이력서 레이아웃" },
      { v: "PRD", l: "제안서 · 요구사항 문서" },
    ],
    tech: ["Next.js", "TypeScript", "Vercel"],
    href: links.oldProfile,
    cta: "사이트 보기 ↗",
    host: "web-resume-bice.vercel.app",
    shot: { src: "/projects/web-resume.webp", alt: "웹 이력서 첫 화면: 송상헌, 확인한 데이터로만 답하는 AI 에이전트를 만듭니다, 검증 기록과 대표 수치", w: 1000, h: 623 },
  },
];

export default function Extra() {
  return (
    <main id="main" className="wrap page">
      <PageHead path="/extra" title="교육 기간 동안 만든 것들">
        무엇을 만들었고, 무엇을 확인했는지만.
      </PageHead>

      <section className="grid-3" aria-label="추가 프로젝트">
        {projects.map((p) => (
          <article key={p.name} className="mini">
            <div className="mini-visual">
              {p.shot ? (
                <figure className="shot">
                  <Image src={p.shot.src} alt={p.shot.alt} width={p.shot.w} height={p.shot.h} sizes="(max-width: 720px) 100vw, 360px" />
                </figure>
              ) : (
                <a className="siteframe" href={p.href} target="_blank" rel="noreferrer" aria-label={`${p.name} 사이트 열기`}>
                  <span className="siteframe-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span className="mono">{p.host}</span>
                  </span>
                  <span className="siteframe-body">
                    <b>{p.name}</b>
                    <span>사이트 열기 ↗</span>
                  </span>
                </a>
              )}
            </div>
            <div className="mini-body">
              <div className="mini-top">
                <h2>{p.name}</h2>
                <span className="mono note">{p.when}</span>
              </div>
              <p className="body">{p.one}</p>
              {p.note ? <p className="note">{p.note}</p> : null}
              <dl className="facts">
                {p.facts.map((f) => (
                  <div key={f.l} className="fact">
                    <dt>{f.v}</dt>
                    <dd>{f.l}</dd>
                  </div>
                ))}
              </dl>
              <ul className="chips" aria-label="사용 기술">
                {p.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a className="btn" href={p.href} target="_blank" rel="noreferrer">
                {p.cta}
              </a>
            </div>
          </article>
        ))}
      </section>

      <Pager path="/extra" />
    </main>
  );
}
