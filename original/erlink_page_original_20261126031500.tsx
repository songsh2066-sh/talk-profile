import type { Metadata } from "next";
import Image from "next/image";
import PageHead, { Cue } from "@/components/PageHead";
import Pager from "@/components/Pager";
import Backup, { type Shot } from "@/components/Backup";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "메인 프로젝트 · ERLink AI" };

// 03 메인 프로젝트 (7분) — 내용 출처: 15분 발표 구성표 4장 (11/25 개편)
//   발표 대본이 따로 없어서, 블록마다 굵은 글 = 말할 핵심, 작은 글 = 덧붙일 설명으로 씁니다.
//   발표 시간 배분(화면에는 표시 안 함): 문제 40초 · 흐름 50초 · 라이브 시연 3분 · 기술과 결과 1분 50초 · 한계와 다음 단계 40초

// 누가 무엇을 하나 (사람과 AI의 역할)
const flow = [
  { n: "①", who: "신고자", t: "말하거나 적어서 신고", d: "질문은 둘뿐 — 부르면 대답하나요? 숨을 쉬나요? 숨을 안 쉬면 바로 가슴 압박 안내" },
  { n: "②", who: "AI", t: "병원 3곳을 근거와 함께 추천", d: "중증도 → 빈 병상·도착 시간·병원 역량·포화도 → 법 조문 근거 → 순위 → 검토" },
  { n: "③", who: "병원", t: "수용 요청에 승인·거절", d: "전화를 돌리는 대신 추천된 병원에 요청. 병원이 승인하면 이송 승인 버튼이 켜지고, 거절하면 그 병원을 빼고 바로 다시 추천" },
  { n: "④", who: "구급대원", t: "승인하고 기록을 남김", d: "신고자 화면에 '이송할 병원이 정해졌어요'. 결정은 고칠 수 없는 감사 기록으로" },
];

// 라이브 시연 순서 (b = 할 일, s = 짚을 말)
const demo = [
  { b: "신고 — 휴대폰으로 ‘눌러서 말하기’", s: "“할아버지가 가슴을 움켜쥐고 쓰러졌어요” → 노트북의 음성 인식이 받아 적고, 확인한 뒤 보냄 → 질문 두 개 → ‘종각역 1번 출구 바로 앞’ 같은 위치 설명 한 줄" },
  { b: "상황 판단 — 기다리는 신고가 먼저", s: "급한 신고(숨 안 쉼·대답 없음)가 맨 위에 빨간 표시 → ‘불러와서 추천 받기’ 한 번" },
  { b: "추천 결과 — 왜 이 병원인지", s: "중증도 등급과 꼭 필요한 처치 → 1순위 병원·도착 시간·빈 병상 → 오른쪽 근거 서랍의 판단 이유와 법 조문 → 지도 경로" },
  { b: "병원 수용 요청 — 병원이 승인해야 이송 승인", s: "‘병원 수용 요청’ → 응답 기다리는 중. 오늘은 병원과 연결됐다고 가정하고 병원 응답(승인·거절)을 대신 누름 → 승인이면 이송 승인 버튼이 켜짐. 시간이 되면 ‘변경’ → 거절 → 그 병원을 빼고 바로 다시 추천" },
  { b: "승인과 기록", s: "가운데 확인 창 → 초록 완료 화면 → 신고자 휴대폰도 ‘이송할 병원이 정해졌어요’ → 감사 기록 ‘고친 흔적 없음’" },
];

// 판단 단계 (ERLink LangGraph: triage → bed → route → capability → saturation → protocol → supervisor → critic → 승인 → 기록)
const agents = ["중증도", "빈 병상", "도착 시간", "병원 역량", "포화도", "근거", "순위", "검토", "사람 승인", "기록"];
const HUMAN = "사람 승인";

// 11/25 사용자 결정: '내가 만든 것' → '기술 → ERLink에 적용한 방법 → 확인한 결과'
//   (11/26: 화면에서 '교육에서 배운 것' 표현은 빼고, 마무리 한 줄에만 교육 언급을 남김 — 사용자 결정)
//   (11/25: ERLink 에서는 중간평가에서 쓴 것을 설명하지 않음 — 사용자 결정)
const learned = [
  {
    t: "파인튜닝",
    how: ["119 신고 8.6만 건으로 ", "KoELECTRA를 중증도 분류에 파인튜닝", ". 위급 환자를 낮게 보는 실수에 더 큰 벌점을 줬습니다."],
    chips: ["KoELECTRA-small", "비대칭 손실", "AI Hub 119 신고"],
    v: "11.9→2.5%",
    vl: "위급 환자 과소평가",
    hl: true,
  },
  {
    t: "RAG",
    how: ["법령 6개와 응급 지침을 조문 단위로 나눠 ", "단어 검색 + 뜻 검색을 함께", " 쓰고 순위를 합쳤습니다. 추천마다 근거 조문이 붙습니다."],
    chips: ["BM25 + e5 임베딩", "RRF", "pgvector"],
    v: "100%",
    vl: "추천 근거 조문 인용률",
  },
  {
    t: "하이브리드 설계",
    how: ["규칙이 기본이고 ", "모델은 등급을 올리기만", " 합니다. 도착 시간과 점수 같은 계산은 코드가 맡습니다."],
    chips: ["규칙 + 모델", "OSRM 도로망", "가중 점수"],
    v: "0건",
    vl: "위급 환자를 경증으로 본 경우",
  },
  {
    t: "소버린 AI · 로컬 모델",
    how: ["모델을 줄여 ", "노트북 CPU에서 판단", "하고, 음성 인식과 지도도 노트북 안에서 돌립니다. 환자 정보가 외부 AI 서버로 나가지 않습니다."],
    chips: ["ONNX int8", "faster-whisper", "자체 서울 지도"],
    v: "14.7MB · 3ms",
    vl: "중증도 모델 크기 · 판단 시간",
  },
  {
    t: "평가로 증명",
    how: ["학습에 쓰지 않은 평가셋을 먼저 떼어 두고, 바꿀 때마다 ", "같은 기준으로 다시 쟀습니다", "."],
    chips: ["서울 평가용 1.87만 건", "원칙 검사 714건"],
    v: "53→90%",
    vl: "위급 환자 알아본 비율",
  },
  {
    t: "배포 · 운영",
    how: ["서비스를 ", "Docker Compose로 한 번에", " 띄우고, 올릴 때마다 시험이 돌게 했습니다. 공개 주소는 Cloudflare Tunnel로 붙였습니다."],
    chips: ["FastAPI · Next.js", "PostgreSQL · Redis", "GitHub Actions"],
    v: "669",
    vl: "자동 시험 · CI 통과",
  },
];

// 아직 못 한 것 → 다음에 할 것 (11/25 사용자 결정: 한계 하나에 계획 하나를 짝지어, 수치 줄은 위 표에 있으니 뺌)
const nexts = [
  {
    lt: "짧은 신고에 약함",
    ld: "첫 한두 문장만으로는 위급 환자를 69%만 알아봄 (통화 30초 분량이면 90%)",
    pt: "과소평가율 더 낮추기",
    pd: "놓친 사례를 질환별로 모아 규칙과 학습 데이터를 보강하고, 짧은 신고는 더 일찍 위급으로",
  },
  {
    lt: "병원 연결은 아직 가정",
    ld: "오늘 시연의 병원 응답은 발표자가 대신 누름",
    pt: "병원과 바로 연결",
    pd: "병원 화면에서 수용 요청을 받아 승인·거절, 전화 없이 연결",
  },
  {
    lt: "노트북 한 대 · 서울에서만 · 현장 검증 전",
    ld: "꺼지면 멈추고, 자료가 서울뿐이고, 실제 구급대원이 써 보지 않음",
    pt: "클라우드로 옮기고 현장에서 검증",
    pd: "서버 이전과 모니터링, 구급대원·상황요원 6~10명 의견 받기",
  },
];

const W = 1440;
const backup: Shot[] = [
  { src: "/shots/erlink-v2-report.webp", alt: "노트북 신고 화면: 가운데 큰 ‘눌러서 말하기’ 버튼과 글로 적기 칸", caption: "① 신고 첫 화면 — 말하기 · 글로 적기", width: W, height: 832 },
  { src: "/shots/erlink-v2-queue.webp", alt: "상황 판단 화면: 신고 접수 대기 3건, 맨 위 ‘의식 없음 의심’ 빨간 표시와 ‘불러와서 추천 받기’", caption: "② 상황 판단 — 급한 신고가 맨 위", width: W, height: 832 },
  { src: "/shots/erlink-result.webp", alt: "추천 결과: 1순위 병원 도착 시간·빈 병상과 대안", caption: "③ 추천 결과 (11/23 실제 병상 자료 · 화면 개편 전)", width: 1568, height: 782 },
  { src: "/shots/erlink-rerecommend.webp", alt: "병원이 거절한 뒤 그 병원을 빼고 다시 추천한 화면", caption: "④ 병원 거절 → 빼고 다시 추천 (11/23 · 개편 전)", width: 1568, height: 782 },
  { src: "/shots/erlink-v2-report-decided.webp", alt: "신고자 화면: 이송할 병원이 정해졌어요, 진행 단계 4개 완료, 보낸 위치 지도", caption: "⑤ 승인 뒤 신고자 화면", width: 1040, height: 792 },
  { src: "/shots/erlink-audit.webp", alt: "감사 기록 화면: 결정 목록과 해시 체인 정상", caption: "⑥ 감사 기록 · 해시 체인 (11/23)", width: 1568, height: 782 },
];

export default function ERLink() {
  return (
    <main id="main" className="wrap page">
      {/* ── 문제 ── */}
      <section className="split" aria-label="문제">
        <div style={{ display: "grid", gap: 20 }}>
          <PageHead path="/erlink" status="동작 중 · erlink.songsh.cloud" meta="메인 프로젝트 · 개인" title="ERLink AI">
            119 구급대가 환자를 <span className="hl">어느 병원으로 옮길지 빨리 정하도록</span> 돕는 AI. 신고 한 번에 병원 3곳을 도착 시간·빈
            병상·법 조문 근거와 함께 추천하고, 확정은 사람이 합니다.
          </PageHead>
          <div className="panel">
            <Cue>문제</Cue>
            <p className="say">어느 응급실이 받을 수 있는지 모른 채, 병원에 차례로 전화를 돌립니다.</p>
            <p className="body">
              거절되면 다음 병원에 다시 걸고, 그동안 환자는 구급차 안에서 기다립니다. 빈 병상과 병원 역량 정보는 공공 데이터에 이미
              있지만, 그걸로 <b>어느 병원에 먼저 요청할지</b> 근거와 함께 정해 주는 도구가 없었습니다.
            </p>
          </div>
        </div>
        <figure className="phones">
          <div className="shot">
            <Image src="/shots/erlink-v2-phone.webp" alt="휴대폰 신고 첫 화면: 무슨 일인지 말해 주세요, 큰 빨간 말하기 버튼" width={390} height={844} sizes="(max-width: 920px) 45vw, 240px" priority />
          </div>
          <div className="shot">
            <Image src="/shots/erlink-v2-phone-cpr.webp" alt="숨을 안 쉰다고 답하면 나오는 가슴 압박 안내: 1분에 100~120번, 세 단계" width={390} height={844} sizes="(max-width: 920px) 45vw, 240px" />
          </div>
          <figcaption className="note">신고자 휴대폰 — 첫 화면 · 숨을 안 쉬면 바로 가슴 압박 안내 (시연용, 실제 119와 연결되지 않음)</figcaption>
        </figure>
      </section>

      {/* ── 전체 흐름 ── */}
      <section aria-labelledby="flow-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="flow-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              전체 흐름
            </span>
            AI는 근거와 함께 추천하고, 결정은 사람이 합니다
          </h2>
        </div>
        <ol className="roles">
          {flow.map((f) => (
            <li key={f.n} className={f.who === "AI" ? "role is-ai" : "role"}>
              <span className="role-who">
                <span className="mono">{f.n}</span> {f.who}
              </span>
              <b>{f.t}</b>
              <p>{f.d}</p>
            </li>
          ))}
        </ol>
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
            <li>시연 전: 노트북 ERLink 실행 · 상황 판단 로그인 · 승인 대기 정리</li>
            <li>휴대폰은 위치 ‘허용’ (노트북으로 신고하면 /report?demo=1 로 지도에서 위치 지정)</li>
          </ul>
        </aside>
      </section>

      <Backup title="시연이 안 될 때 · 캡처 6장" shots={backup} />

      {/* ── 기술과 결과 (11/25, 11/26 이름 변경) ── */}
      <section aria-labelledby="built-h" style={{ display: "grid", gap: 20 }}>
        <div className="sec-row">
          <h2 id="built-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              기술과 결과
            </span>
            어떤 기술로 만들었고, 무엇을 확인했나
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
          <ol className="agentai-flow">
            {agents.map((a) => (
              <li key={a} className={a === HUMAN ? "is-human" : undefined}>
                {a}
              </li>
            ))}
          </ol>
          <p className="agentai-one">
            에이전트마다 한 가지 일만 맡아 단계마다 근거를 남기고, <b>‘사람 승인’에서 멈춰 병원 응답과 구급대원 승인 없이는 확정되지 않습니다.</b>
          </p>
        </div>
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
        <p className="say next">“교육에서 배운 RAG·파인튜닝·하이브리드를, 사람 생명이 걸린 문제에 맞게 더 엄격하게 적용했습니다.”</p>
      </section>

      {/* ── 한계와 다음 단계 (11/25) ── */}
      <section aria-labelledby="lim-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="lim-h" className="sec-title">
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
                <b>{n.lt}</b>
                <span>{n.ld}</span>
              </div>
              <span className="nexts-arrow" aria-hidden="true">
                →
              </span>
              <div className="nexts-plan" role="cell">
                <b>{n.pt}</b>
                <span>{n.pd}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="say next">“ERLink로 큰 시스템을 끝까지 만들어 봤다면, 짧게 만든 프로젝트도 하나씩 보여 드리겠습니다.”</p>
      </section>

      <Pager path="/erlink" />
    </main>
  );
}
