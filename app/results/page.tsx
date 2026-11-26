import type { Metadata } from "next";
import Link from "next/link";
import Pager from "@/components/Pager";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "마무리" };

// 05 마무리 — 11/26 2차 사용자 결정: 성과 탭을 마무리 탭으로 바꿈 (주소는 그대로 /results — 링크가 바뀌지 않게)
//   11/26 발표 전날 디자인: 세 프로젝트를 ERLink 로고처럼 '경로'로 잇고(외부 AI → 내 노트북 → 사람 생명이 걸린 문제),
//   마무리 문장을 줄로 나눠 가운데 세 줄(근거 · 일을 나눔 · 평가)에 오늘 보여 준 근거를 작게 붙임

const stops = [
  { t: "외부 AI 연결", d: "추가 프로젝트" },
  { t: "내 노트북의 작은 모델", d: "서울 메이트" },
  { t: "사람 생명이 걸린 문제", d: "ERLink" },
];

const lines = [
  { c: "근거를 붙이고", n: "RAG · 실시간 자료와 법 조문" },
  { c: "일을 나누고", n: "Multi-Agent · 에이전트 10개" },
  { c: "평가하면", n: "같은 기준으로 · 100문항 · 119 신고" },
];

export default function Closing() {
  return (
    <main id="main" className="wrap page finale-page">
      <section className="route-wrap" aria-label="교육 기간에 걸어온 길">
        <svg className="route" viewBox="0 0 1000 64" aria-hidden="true">
          <path className="route-line" pathLength={1} d="M24 52 C 262 52, 262 32, 500 32 S 738 12, 976 12" />
          <circle className="route-dot d1" cx="24" cy="52" r="7" />
          <circle className="route-dot d2" cx="500" cy="32" r="7" />
          <circle className="route-ring" cx="976" cy="12" r="10" />
          <circle className="route-core" cx="976" cy="12" r="3.5" />
        </svg>
        <ol className="route-stops">
          {stops.map((s, i) => (
            <li key={s.t} className={i === stops.length - 1 ? "is-last" : undefined}>
              <b>{s.t}</b>
              <span>{s.d}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="finale">
        <span className="finale-lead">작은 모델이라도,</span>
        {lines.map((l) => (
          <span key={l.c} className="finale-row">
            <span className="finale-c">{l.c}</span>
            <small className="finale-n" aria-hidden="true">
              {l.n}
            </small>
          </span>
        ))}
        <span className="finale-end">믿을 수 있는 AI를 만들 수 있습니다.</span>
      </p>

      <footer className="finale-foot">
        <p className="finale-thanks">감사합니다</p>
        <div className="finale-btns">
          <a className="btn" href={links.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a className="btn" href={`mailto:${links.email}`}>
            {links.email}
          </a>
          <Link className="btn btn-ink" href="/">
            처음으로
          </Link>
        </div>
      </footer>

      <Pager path="/results" />
    </main>
  );
}
