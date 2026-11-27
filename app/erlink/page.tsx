import type { Metadata } from "next";
import Image from "next/image";
import PageHead, { Cue } from "@/components/PageHead";
import Pager from "@/components/Pager";
import Backup, { type Shot } from "@/components/Backup";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "메인 프로젝트 · ERLink AI" };

// 03 메인 프로젝트 (7분) — 내용 출처: 15분 발표 구성표 4장 (11/25 개편)
//   발표 대본이 따로 없어서, 블록마다 굵은 글 = 말할 핵심, 작은 글 = 덧붙일 설명으로 씁니다.
//   발표 시간 배분(화면에는 표시 안 함): 문제 40초 · 흐름 50초 · 라이브 시연 3분 · 기술과 결과 1분 30초 · 한계와 다음 단계 20초 (11/26 2차: 성과 탭에서 되돌림)

// 전체 흐름 (11/26 사용자 결정): ERLink = 신고부터 이송 병원 확정까지 한 서비스. 상황실 AI가 가운데서
//   신고 화면(신고자 + 상황실 AI)과 상황 판단 화면(구급대원 + 상황실 AI)을 돕는다. 신고는 ERLink로 받는다고 가정
const hubLeft = {
  screen: "신고 화면",
  who: "신고자 + 상황실 AI",
  steps: [
    { n: "①", t: "신고자가 말하거나 적어서 신고", d: "위치는 자동으로 전달" },
    { n: "②", t: "상황실 AI가 두 가지를 묻고 안내", d: "부르면 대답하나요? 숨을 쉬나요? 숨을 안 쉬면 바로 가슴 압박 안내" },
    { n: "⑥", t: "병원이 확정되면 신고자에게 알림", d: "‘이송할 병원이 정해졌어요’" },
  ],
};
const hubAi = ["중증도", "빈 병상 · 도착 시간", "병원 역량 · 포화도", "법 조문 근거", "순위 · 검토"];
const hubRight = {
  screen: "상황 판단 화면",
  who: "구급대원 + 상황실 AI",
  steps: [
    { n: "③", t: "상황실 AI가 병원 3곳을 근거와 함께 추천", d: "도착 시간 · 빈 병상 · 법 조문 근거" },
    { n: "④", t: "병원에 수용 요청 → 병원이 승인·거절", d: "전화를 돌리는 대신 요청. 거절하면 그 병원을 빼고 바로 다시 추천" },
    { n: "⑤", t: "구급대원이 이송 병원을 확정", d: "고칠 수 없는 감사 기록으로 남음" },
  ],
};

// 라이브 시연 순서 (b = 할 일, s = 짚을 말)
const demo = [
  { b: "신고 — 휴대폰으로 ‘눌러서 말하기’", s: "“할아버지가 가슴을 움켜쥐고 쓰러졌어요” → 노트북의 음성 인식이 받아 적고, 확인한 뒤 보냄 → 상황실 AI가 질문 두 개 → 숨을 안 쉬면 가슴 압박 안내" },
  { b: "상황 판단 — 상황실 AI가 받은 신고", s: "급한 신고(숨 안 쉼·대답 없음)가 맨 위에 빨간 표시 → ‘불러와서 추천 받기’ 한 번" },
  { b: "상황실 AI 추천 — 왜 이 병원인지", s: "중증도 등급과 꼭 필요한 처치 → 1순위 병원·도착 시간·빈 병상 → 오른쪽 근거 서랍의 판단 이유와 법 조문 → 지도 경로" },
  { b: "병원 수용 요청 — 병원이 승인해야 확정", s: "‘병원 수용 요청’ → 응답 기다리는 중. 오늘은 병원과 연결됐다고 가정하고 병원 응답(승인·거절)을 대신 누름 → 승인이면 확정 버튼이 켜짐. 시간이 되면 ‘변경’ → 거절 → 그 병원을 빼고 바로 다시 추천" },
  { b: "구급대원 확정과 기록", s: "가운데 확인 창 → 초록 완료 화면 → 상황실 AI가 신고자 휴대폰에 ‘이송할 병원이 정해졌어요’ → 감사 기록 ‘고친 흔적 없음’" },
];

// 판단 단계 (ERLink LangGraph: triage → bed → route → capability → saturation → protocol → supervisor → critic → 승인(확정) → 기록)
// 11/26 발표 전날: 10단계를 '사람이 병원을 고를 때 묻는 순서' 4묶음으로 (설명하기 쉽게)
const agentGroups = [
  { q: "얼마나 위급한가?", steps: ["중증도"], d: "신고를 읽고 등급을 정함" },
  { q: "어디로 갈 수 있나?", steps: ["빈 병상", "도착 시간", "병원 역량", "포화도"], d: "자리가 있고, 가깝고, 필요한 처치가 되고, 덜 붐비는 병원" },
  { q: "왜 이 병원인가?", steps: ["근거", "순위", "검토"], d: "법 조문을 찾아 붙이고, 점수로 3곳을 고른 뒤 마지막 점검" },
  { q: "결정은 사람이", steps: ["사람 확정", "기록"], d: "병원 승인 + 구급대원 확정 없이는 끝나지 않음", human: true },
];

// 11/25 사용자 결정: '내가 만든 것' → '기술 → ERLink에 적용한 방법 → 확인한 결과'
//   (11/26: 화면에서 '교육에서 배운 것' 표현은 빼고, 마무리 한 줄에만 교육 언급을 남김 — 사용자 결정)
//   (11/25: ERLink 에서는 중간평가에서 쓴 것을 설명하지 않음 — 사용자 결정)
//   (11/26 발표 전날: 하이브리드·평가 설명을 쉬운 말로, 배포 · 운영 줄은 뺌 — 사용자 결정)
const learned = [
  {
    t: "파인튜닝",
    how: ["119 신고 8.6만 건으로 ", "중증도 분류에 파인튜닝", ", 위급 환자 과소평가율을 줄임"],
    chips: ["KoELECTRA-small", "비대칭 손실", "AI Hub 119 신고"],
    v: "11.9→2.5%",
    vl: "위급 환자 과소평가",
    hl: true,
  },
  {
    t: "RAG",
    how: ["법령 6개와 응급 지침을 조문 단위로 나눠 두고, ", "추천마다 근거가 되는 법 조문", "을 찾아 붙입니다."],
    chips: ["BM25 + e5 임베딩", "RRF", "pgvector"],
    v: "100%",
    vl: "추천 근거 조문 인용률",
  },
  {
    t: "하이브리드 설계",
    how: ["규칙과 AI가 따로 판단하고, ", "둘 중 더 위급하게 본 쪽", "을 따릅니다."],
    chips: ["규칙 + 모델", "OSRM 도로망", "가중 점수"],
    v: "0건",
    vl: "위급 환자를 경증으로 본 경우",
  },
  {
    t: "소버린 AI · 로컬",
    how: ["중증도 판단, 음성 인식, 지도까지 ", "모두 제 로컬에서 돌아갑니다", ". 외부 AI를 쓰지 않아 환자 정보가 밖으로 나가지 않습니다."],
    chips: ["ONNX int8", "faster-whisper", "자체 서울 지도"],
    v: "14.7MB · 3ms",
    vl: "모델 크기 · 판단 시간",
  },
];

// 한계와 다음 단계 (11/26 2차: 성과 탭에서 되돌림 · 신고 접수도 가정임을 밝힘)
// 11/26 저녁: 발표 대본 문장 그대로 (칸 제목 → 지금 → 다음)
const roadmap = [
  { t: "짧은 신고에도", now: "오늘 시연 영상의 신고는 위급한 단서가 분명했습니다.", next: "실제로는 단서가 불분명하거나 한마디만 하고 끊기는 경우도 있습니다. 그때에도 위급을 놓치지 않게 하겠습니다." },
  { t: "병원과 연결", now: "오늘 시연 영상의 병원 응답은 제가 대신 눌렀습니다.", next: "병원이 직접 수용 요청을 받는 화면을 만들어 ERLink와 병원을 연결하겠습니다." },
  { t: "현장 검증", now: "ERLink는 아직 현장 구급대원의 검증을 받지 못했습니다.", next: "실제 구급대원의 의견을 받아 현장에서 쓸 수 있게 다듬겠습니다." },
];

const W = 1440;
const backup: Shot[] = [
  { src: "/shots/erlink-v2-report.webp", alt: "노트북 신고 화면: 가운데 큰 ‘눌러서 말하기’ 버튼과 글로 적기 칸", caption: "① 신고 첫 화면 — 말하기 · 글로 적기", width: W, height: 832 },
  { src: "/shots/erlink-v2-queue.webp", alt: "상황 판단 화면: 상황실 AI가 받은 신고 2건, 맨 위 ‘심정지 의심’ 빨간 표시와 ‘불러와서 추천 받기’", caption: "② 상황 판단 — 상황실 AI가 받은 신고, 급한 신고가 맨 위", width: W, height: 832 },
  { src: "/shots/erlink-result.webp", alt: "추천 결과: 1순위 병원 도착 시간·빈 병상과 대안", caption: "③ 추천 결과 (11/23 실제 병상 자료 · 화면 개편 전)", width: 1568, height: 782 },
  { src: "/shots/erlink-rerecommend.webp", alt: "병원이 거절한 뒤 그 병원을 빼고 다시 추천한 화면", caption: "④ 병원 거절 → 빼고 다시 추천 (11/23 · 개편 전)", width: 1568, height: 782 },
  { src: "/shots/erlink-v2-approved.webp", alt: "상황 판단 화면: 초록 완료 블록 ‘○○병원으로 확정했어요’, 상황실 AI가 신고자에게 알림, 확정 기록", caption: "⑤ 구급대원 확정 — 완료 화면", width: W, height: 832 },
  { src: "/shots/erlink-v2-report-decided.webp", alt: "신고자 화면: 이송할 병원이 정해졌어요, 진행 단계 접수·구급대원 확인·병원 찾는 중·병원 확정 완료", caption: "⑥ 확정 뒤 신고자 화면", width: 1040, height: 792 },
  { src: "/shots/erlink-audit.webp", alt: "감사 기록 화면: 결정 목록과 해시 체인 정상", caption: "⑦ 감사 기록 · 해시 체인 (11/23 · 개편 전)", width: 1568, height: 782 },
];

export default function ERLink() {
  return (
    <main id="main" className="wrap page">
      {/* ── 문제 ── */}
      <section className="split" aria-label="문제">
        <div style={{ display: "grid", gap: 20 }}>
          <PageHead path="/erlink" status="동작 중 · erlink.songsh.cloud" meta="메인 프로젝트 · 개인" title="ERLink AI">
            신고부터 이송 병원 확정까지, <span className="hl">상황실 AI가 신고자와 구급대원을 돕는</span> 서비스. 신고자에게는 응급처치를
            안내하고, 구급대원에게는 병원 3곳을 근거와 함께 추천합니다. 최종 확정은 구급대원이 합니다.
          </PageHead>
          <div className="panel">
            <Cue>문제</Cue>
            <p className="say">병원을 찾는 동안, 환자는 기다리기만 하고 구급대원은 전화를 돌리기만 합니다.</p>
            <ul className="prob">
              <li>
                <b>신고자</b>
                <span>환자 곁에서 지금 무엇을 해야 하는지, 병원이 정해졌는지 바로 알기 어렵습니다.</span>
              </li>
              <li>
                <b>구급대원</b>
                <span>어느 응급실이 받을 수 있는지 확인하느라 병원에 차례로 전화를 겁니다. 거절되면 다시 겁니다.</span>
              </li>
            </ul>
          </div>
        </div>
        <figure className="phones">
          <div className="shot">
            <Image src="/shots/erlink-v2-phone.webp" alt="휴대폰 신고 첫 화면: 무슨 일인지 말해 주세요, 큰 빨간 말하기 버튼" width={390} height={844} sizes="(max-width: 920px) 45vw, 240px" priority />
          </div>
          <div className="shot">
            <Image src="/shots/erlink-v2-phone-cpr.webp" alt="숨을 안 쉰다고 답하면 나오는 가슴 압박 안내: 1분에 100~120번, 세 단계" width={390} height={844} sizes="(max-width: 920px) 45vw, 240px" />
          </div>
          <figcaption className="note">신고자 휴대폰 — 상황실 AI가 묻고, 숨을 안 쉬면 바로 가슴 압박 안내 (신고를 ERLink로 받는다고 가정한 시연)</figcaption>
        </figure>
      </section>

      {/* ── 전체 흐름 ── */}
      <section aria-labelledby="flow-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="flow-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              전체 흐름
            </span>
            상황실 AI는 묻고, 안내하고, 추천합니다. 결정은 사람이 합니다
          </h2>
        </div>
        <div className="hub">
          {[hubLeft, null, hubRight].map((side, i) =>
            side ? (
              <div key={side.screen} className="hub-side">
                <div className="hub-head">
                  <b>{side.screen}</b>
                  <span>{side.who}</span>
                </div>
                <ol>
                  {side.steps.map((s) => (
                    <li key={s.n}>
                      <span className="mono hub-n">{s.n}</span>
                      <span>
                        <b>{s.t}</b>
                        <small>{s.d}</small>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div key={i} className="hub-ai">
                <span className="hub-arrow l" aria-hidden="true">⇄</span>
                <b>상황실 AI</b>
                <ol aria-label="상황실 AI의 판단 단계">
                  {hubAi.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ol>
                <span className="hub-arrow r" aria-hidden="true">⇄</span>
              </div>
            ),
          )}
        </div>
      </section>

      {/* ── 라이브 시연 ── */}
      <section className="split-r" aria-label="라이브 시연">
        <div className="panel">
          <Cue>라이브 시연 · erlink.songsh.cloud</Cue>
          <ol className="demo">
            {demo.map((d) => (
              <li key={d.b}>
                <b>{d.b}</b>
                <span>{d.s}</span>
              </li>
            ))}
          </ol>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <a className="btn btn-ink" href={links.erlinkReport} target="_blank" rel="noreferrer">
              신고 화면 ↗
            </a>
            <a className="btn" href={links.erlinkDecide} target="_blank" rel="noreferrer">
              상황 판단 ↗
            </a>
            <a className="btn" href={links.erlinkAudit} target="_blank" rel="noreferrer">
              감사 기록 ↗
            </a>
          </div>
          <p className="note">발표 노트북에서 ERLink가 실행 중일 때 열립니다. 상황 판단·감사 기록은 시연 계정 로그인이 필요합니다.</p>
        </div>
        <aside className="panel qr-card" aria-label="휴대폰으로 신고 화면 열기">
          <div className="qr">
            <Image src="/qr-erlink-report.svg" alt="erlink.songsh.cloud/report 로 가는 QR 코드" width={168} height={168} unoptimized />
          </div>
          <b>휴대폰으로 신고 화면 열기</b>
          <span className="mono note">erlink.songsh.cloud/report</span>
          <ul className="prep">
            <li>시연 전: 노트북 ERLink 실행 · 상황 판단 로그인 · 확정 대기 정리</li>
            <li>휴대폰은 위치 ‘허용’ (노트북으로 신고하면 /report?demo=1 로 지도에서 위치 지정)</li>
          </ul>
        </aside>
      </section>

      <Backup title="시연이 안 될 때 · 캡처 7장" shots={backup} />

      {/* ── 기술과 결과 (11/25, 11/26 이름 변경) ── */}
      <section aria-labelledby="built-h" style={{ display: "grid", gap: 20 }}>
        <div className="sec-row">
          <h2 id="built-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              기술과 결과
            </span>
            핵심은 Multi-Agent
          </h2>
          <span className="note">개인 프로젝트 · 기획부터 배포까지</span>
        </div>
        <div className="panel agentai">
          <div className="sec-row">
            <div className="agentai-t">
              <b>Agent AI</b>
              <span className="mono note">LangGraph · 에이전트 10개를 한 흐름으로</span>
            </div>
            <span className="learn-tag">Multi-Agent</span>
          </div>
          <ol className="agentai-groups">
            {agentGroups.map((g, i) => (
              <li key={g.q} className={g.human ? "is-human" : undefined}>
                <span className="ag-q">
                  <span className="mono">{["①", "②", "③", "④"][i]}</span> {g.q}
                </span>
                <span className="ag-steps">
                  {g.steps.map((s) => (
                    <span key={s} className="ag-step">
                      {s}
                    </span>
                  ))}
                </span>
                <span className="ag-d">{g.d}</span>
              </li>
            ))}
          </ol>
          <p className="agentai-one">
            <b>AI 하나가 다 하지 않고 일을 10개로 나눴습니다.</b> 그래서 단계마다 근거가 남고, 틀리면 어디서 틀렸는지 찾을 수 있습니다.
          </p>
        </div>
        <h3 className="learned-title">각 단계는 RAG와 파인튜닝으로 더 엄격하게</h3>
        <div className="learned" role="table" aria-label="ERLink에 쓴 기술과 확인한 결과">
          <div className="learned-row is-head" role="row">
            <span role="columnheader">기술</span>
            <span role="columnheader">ERLink에 적용한 방법</span>
            <span role="columnheader">확인한 결과</span>
          </div>
          {learned.map((l) => (
            <div key={l.t} className="learned-row" role="row">
              <div className="learned-what" role="cell">
                <b>{l.t}</b>
              </div>
              <div className="learned-how" role="cell">
                <p>
                  {l.how[0]}
                  <b>{l.how[1]}</b>
                  {l.how[2]}
                </p>
                <ul className="chips" aria-label="사용 기술">
                  {l.chips.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="learned-v" role="cell">
                <span className="mono learned-num">{l.hl ? <span className="hl">{l.v}</span> : l.v}</span>
                <span className="note">{l.vl}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 한계와 다음 단계 (11/26 2차: 성과 탭에서 되돌림) ── */}
      <section aria-labelledby="er-lim-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="er-lim-h" className="sec-title">
            앞으로의 계획
          </h2>
        </div>
        <ol className="roadmap">
          {roadmap.map((r, i) => (
            <li key={r.t}>
              <span className="rm-t">
                <span className="mono">{["①", "②", "③"][i]}</span> {r.t}
              </span>
              <span className="rm-row rm-today">
                <b>지금</b> <span>{r.now}</span>
              </span>
              <span className="rm-row rm-next">
                <b>다음</b> <span>{r.next}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <p className="say next">“마지막으로, 교육 초반에 외부 AI로 만든 추가 프로젝트도 짧게 보여 드리겠습니다.”</p>

      <Pager path="/erlink" />
    </main>
  );
}
