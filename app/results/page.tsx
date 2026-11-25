import type { Metadata } from "next";
import Link from "next/link";
import PageHead, { Cue } from "@/components/PageHead";
import Pager from "@/components/Pager";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "성과 · 마무리" };

// 05 성과 · 마무리 (3분) — 내용 출처: 15분 발표 구성표 6장
//   11/26 개편 (도안: 발표용 프로필 사이트 시안 ResultsV3):
//   프로젝트 페이지는 '시연 → 결과'까지, 성과 탭은 돌아보고 앞을 말하는 곳.
//   막대 그래프 대신 숫자 두 개 · 해결한 문제 2개 · 한계와 다음 단계(ERLink 3 + 서울 메이트 1) · 마무리
//   서울 메이트 수치는 서비스 중인 v4 기준(같은 100문항, 0% → 70%)

// 두 프로젝트로 확인한 것
const keys = [
  { t: "서울 메이트 · 사실 정확도", v: "0% → 70%", d: "작은 모델 혼자 → 검색 자료(RAG) + 파인튜닝 · 같은 100문항 · 지어낸 숫자 0%" },
  { t: "ERLink · 위급 환자 과소평가", v: "11.9% → 2.5%", d: "규칙만 → 규칙 + 파인튜닝 모델 · 서울 119 신고 평가용 약 1.87만 건" },
];

// 아직 못 한 것 → 다음에 할 것 (ERLink 페이지의 한계와 다음 단계 + 서울 메이트 한 줄)
const nexts = [
  {
    p: "ERLink",
    lt: "짧은 신고에 약함",
    ld: "첫 한두 문장만으로는 위급 환자를 69%만 알아봄 (통화 30초 분량이면 90%)",
    pt: "과소평가율 더 낮추기",
    pd: "놓친 사례를 질환별로 모아 규칙과 학습 데이터를 보강하고, 짧은 신고는 더 일찍 위급으로",
  },
  {
    p: "ERLink",
    lt: "병원 연결은 아직 가정",
    ld: "오늘 시연의 병원 응답은 발표자가 대신 누름",
    pt: "병원과 바로 연결",
    pd: "병원 화면에서 수용 요청을 받아 승인·거절, 전화 없이 연결",
  },
  {
    p: "ERLink",
    lt: "노트북 한 대 · 서울에서만 · 현장 검증 전",
    ld: "꺼지면 멈추고, 자료가 서울뿐이고, 실제 구급대원이 써 보지 않음",
    pt: "클라우드로 옮기고 현장에서 검증",
    pd: "서버 이전과 모니터링, 구급대원·상황요원 6~10명 의견 받기",
  },
  {
    p: "서울 메이트",
    lt: "여러 곳 비교 질문에 약함",
    ld: "“어디가 제일 한산해?” 같은 질문은 0~2/6",
    pt: "비교 질문 보강",
    pd: "장소별 값을 코드가 먼저 비교하고, 모델은 결과를 설명만",
  },
];

export default function Results() {
  return (
    <>
      <main id="main" className="wrap page">
        <PageHead path="/results" title="무엇을 달성했고, 어떻게 확인했나" />

        <section aria-label="두 프로젝트로 확인한 것" style={{ display: "grid", gap: 14 }}>
          <Cue>두 프로젝트로 확인한 것</Cue>
          <div className="grid-2">
            {keys.map((k) => (
              <div key={k.t} className="panel key-result">
                <span className="key-t">{k.t}</span>
                <span className="mono key-v">
                  <span className="hl">{k.v}</span>
                </span>
                <span className="key-d">{k.d}</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="내가 맡아 해결한 문제" style={{ display: "grid", gap: 14 }}>
          <Cue>내가 맡아 해결한 문제</Cue>
          <div className="ideas">
            <div className="idea">
              <b>학습 데이터의 버그를 찾았다</b>
              <p>
                서울 메이트: 파인튜닝 후에도 예측 질문을 틀림 → 학습 문답을 전수 검사해 예측 정답 약 47%가 틀린 생성기 버그를 고치고,
                계산은 코드가 맡게 설계. 정확도 47% → 70%.
              </p>
            </div>
            <div className="idea">
              <b>고치면 다른 곳이 깨지는 반복을 끊었다</b>
              <p>
                ERLink: 지적 항목만 고치던 방식을 원칙을 검사하는 자동 시험으로 바꿈(추천 기록 714건). CI와 같은 7단계 푸시 전 점검으로
                12차 검토까지 자동 시험 669개 · CI 통과.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="res-lim-h" style={{ display: "grid", gap: 16 }}>
          <div className="sec-row">
            <h2 id="res-lim-h" className="sec-title">
              <span className="cue" style={{ display: "block", marginBottom: 4 }}>
                한계와 다음 단계
              </span>
              아직 못 한 것과, 다음에 할 것
            </h2>
          </div>
          <div className="nexts" role="table" aria-label="아직 못 한 것과 다음에 할 것">
            <div className="nexts-row is-head" role="row">
              <span role="columnheader">아직 못 한 것</span>
              <span aria-hidden="true" />
              <span role="columnheader">다음에 할 것</span>
            </div>
            {nexts.map((n) => (
              <div key={n.lt} className="nexts-row" role="row">
                <div className="nexts-lim" role="cell">
                  <span className="proj-tag">{n.p}</span>
                  <b>{n.lt}</b>
                  <span>{n.ld}</span>
                </div>
                <span className="nexts-arrow is-tagged" aria-hidden="true">
                  →
                </span>
                <div className="nexts-plan is-tagged" role="cell">
                  <b>{n.pt}</b>
                  <span>{n.pd}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Pager path="/results" />
      </main>

      <section className="closing" aria-label="마무리">
        <div className="wrap closing-in">
          <p className="closing-q">
            외부 AI 없이 작은 모델로도, <span className="mark">틀리는 곳을 알고 설계로 막으면</span> 믿을 수 있는 AI를 만들 수 있습니다.
          </p>
          <div className="closing-foot">
            <span>송상헌 · AI 에이전트 개발자 · 감사합니다</span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
          </div>
        </div>
      </section>
    </>
  );
}
