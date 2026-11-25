import type { Metadata } from "next";
import Link from "next/link";
import PageHead, { Cue } from "@/components/PageHead";
import Pager from "@/components/Pager";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "성과 · 마무리" };

function Bar({ label, value, pct, after }: { label: string; value: string; pct: number; after?: boolean }) {
  return (
    <div className={after ? "bar is-after" : "bar"}>
      <span>{label}</span>
      <div className="bar-track" aria-hidden="true">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="bar-v">{value}</span>
    </div>
  );
}

// 05 성과 · 마무리 (3분) — 내용 출처: 15분 발표 구성표 6장 (11/25: 1분 30초 · 1분 · 30초)
//   11/26: 서울 메이트 수치를 서비스 중인 v4 기준(같은 100문항: 0% → 55% → 70%, RAG만 대비 McNemar p=0.03)으로,
//          안전 시험은 결과 파일대로 9/10(1개 사람 판정), 남은 과제는 ERLink 페이지 다음 단계와 맞춤
export default function Results() {
  return (
    <>
      <main id="main" className="wrap page">
        <PageHead path="/results" title="무엇을 달성했고, 어떻게 확인했나" />

        <section aria-label="가장 중요한 성과" style={{ display: "grid", gap: 14 }}>
          <Cue time="1분 30초">가장 중요한 성과</Cue>
          <div className="grid-2">
            <div className="panel">
              <div className="sec-row">
                <b>서울 메이트 · 사실 정확도</b>
                <span className="delta">0% → 70%</span>
              </div>
              <div className="bars" role="img" aria-label="모델 혼자 0%, 검색 자료(RAG)를 붙이면 55%, 파인튜닝 모델에 검색 자료를 붙이면 70%">
                <Bar label="모델 혼자" value="0%" pct={1} />
                <Bar label="+ 검색 자료" value="55%" pct={55} />
                <Bar label="+ 파인튜닝" value="70%" pct={70} after />
              </div>
              <p className="note">같은 100문항 · 지어낸 숫자 0% · RAG만 대비 p=0.03 · 안전 시험 9/10 (1개는 사람 판정)</p>
            </div>
            <div className="panel">
              <div className="sec-row">
                <b>ERLink · 위급 환자 과소평가</b>
                <span className="delta">−9.4%p</span>
              </div>
              {/* 막대 길이는 11.9% 를 79% 폭으로 맞춘 비율 (2.5% → 17%) */}
              <div className="bars" role="img" aria-label="규칙만 11.9%, 규칙과 모델 2.5%">
                <Bar label="규칙만" value="11.9%" pct={79} />
                <Bar label="규칙 + 모델" value="2.5%" pct={17} after />
              </div>
              <p className="note">서울 119 신고 평가용 약 1.87만 건 · 위급 인식 53% → 90% · 추천 근거 인용률 100%</p>
            </div>
          </div>
        </section>

        <section aria-label="내가 맡아 해결한 문제" style={{ display: "grid", gap: 14 }}>
          <Cue time="1분">내가 맡아 해결한 문제</Cue>
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

        <section aria-label="남은 과제" style={{ display: "grid", gap: 14 }}>
          <Cue time="30초" tone="wip">
            남은 과제
          </Cue>
          <ul className="todo">
            <li>짧은 신고 위급 인식 69% → 과소평가율 더 낮추기</li>
            <li>병원과 바로 연결 (지금은 응답을 대신 누름)</li>
            <li>클라우드로 옮기고 현장에서 검증</li>
            <li>서울 메이트 · 여러 곳 비교 질문 보강</li>
          </ul>
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
