import type { Metadata } from "next";
import Image from "next/image";
import PageHead, { Cue } from "@/components/PageHead";
import Pager from "@/components/Pager";
import Backup, { type Shot } from "@/components/Backup";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "메인 프로젝트 · ERLink AI" };

// 03 메인 프로젝트 (7분) — 내용 출처: 15분 발표 구성표 4장 (11/25 개편)
//   발표 대본이 따로 없어서, 블록마다 굵은 글 = 말할 핵심, 작은 글 = 덧붙일 설명으로 씁니다.
//   시간: 문제 40초 · 흐름 50초 · 라이브 시연 3분 · 내가 만든 것 1분 50초 · 결과·한계·계획 40초

// 누가 무엇을 하나 (사람과 AI의 역할)
const flow = [
  { n: "①", who: "신고자", t: "말하거나 적어서 신고", d: "질문은 둘뿐 — 부르면 대답하나요? 숨을 쉬나요? 숨을 안 쉬면 바로 가슴 압박 안내" },
  { n: "②", who: "AI", t: "병원 3곳을 근거와 함께 추천", d: "중증도 → 빈 병상·도착 시간·병원 역량·포화도 → 법 조문 근거 → 순위 → 검토" },
  { n: "③", who: "상황요원", t: "응급실에 전화해 수용 확인", d: "'수용 가능'을 기록해야 승인 버튼이 켜짐. 수용 불가면 그 병원을 빼고 다시 추천" },
  { n: "④", who: "구급대원", t: "승인하고 기록을 남김", d: "신고자 화면에 '이송할 병원이 정해졌어요'. 결정은 고칠 수 없는 감사 기록으로" },
];

// 라이브 시연 순서 (b = 할 일, s = 짚을 말)
const demo = [
  { b: "신고 — 휴대폰으로 ‘눌러서 말하기’", s: "“할아버지가 가슴을 움켜쥐고 쓰러졌어요” → 노트북의 음성 인식이 받아 적고, 확인한 뒤 보냄 → 질문 두 개 → ‘종각역 1번 출구 바로 앞’ 같은 위치 설명 한 줄" },
  { b: "상황 판단 — 기다리는 신고가 먼저", s: "급한 신고(숨 안 쉼·대답 없음)가 맨 위에 빨간 표시 → ‘불러와서 추천 받기’ 한 번" },
  { b: "추천 결과 — 왜 이 병원인지", s: "중증도 등급과 꼭 필요한 처치 → 1순위 병원·도착 시간·빈 병상 → 오른쪽 근거 서랍의 판단 이유와 법 조문 → 지도 경로" },
  { b: "전화 확인 — ‘수용 가능’을 눌러야 승인", s: "노란 상자의 응급실 번호로 확인. 시간이 되면 ‘수용 불가’ → 그 병원을 빼고 바로 다시 추천" },
  { b: "승인과 기록", s: "가운데 확인 창 → 초록 완료 화면 → 신고자 휴대폰도 ‘이송할 병원이 정해졌어요’ → 감사 기록 ‘고친 흔적 없음’" },
];

// 판단 단계 (ERLink LangGraph: triage → bed → route → capability → saturation → protocol → supervisor → critic → 승인 → 기록)
const agents = [
  { n: "01", t: "중증도", d: "규칙 + KoELECTRA" },
  { n: "02", t: "빈 병상", d: "공공 API 10분 수집" },
  { n: "03", t: "도착 시간", d: "OSRM + 시간대 계수" },
  { n: "04", t: "병원 역량", d: "시술·외상·소아센터" },
  { n: "05", t: "포화도", d: "요일·시간대 프로필" },
  { n: "06", t: "근거", d: "법령·지침 RAG" },
  { n: "07", t: "순위", d: "가중 점수 + 원칙 규칙" },
  { n: "08", t: "검토", d: "Critic 경고" },
  { n: "09", t: "사람 승인", d: "전화 확인 + 중단점", human: true },
  { n: "10", t: "기록", d: "SHA-256 해시 체인" },
];

// 내가 만든 것 (v = 대표 숫자)
const built = [
  { t: "데이터 수집", v: "10분", d: "응급실 병상 공공 API를 10분마다 수집(노트북 상시). 병원 역량·외상센터·소아센터 목록, AI Hub 119 신고 8.6만 건으로 학습·평가." },
  { t: "중증도 AI", v: "14.7MB · 3ms", d: "규칙 + KoELECTRA-small 파인튜닝. 위급 환자를 낮게 보는 실수에 큰 벌점을 주고, 모델은 규칙보다 등급을 올리기만 합니다. ONNX int8로 노트북 CPU에서." },
  { t: "근거 RAG", v: "인용 100%", d: "법령 6개와 응급 지침을 조문 단위로 BM25 + e5 임베딩(RRF) 검색. 추천마다 “왜 이 병원인지” 근거 조문을 붙입니다." },
  { t: "음성 신고", v: "로컬 STT", d: "faster-whisper(small)가 노트북에서 받아 적고, 신고자가 확인한 뒤 보냅니다. 받아 적은 글로 판단한 위급도가 정답 녹취로 판단한 것과 81.5% 같음(광주 200건)." },
  { t: "지도 · 위치", v: "외부 요청 0", d: "OpenStreetMap으로 서울 지도를 직접 만들어 외부 지도 서버를 부르지 않습니다(신고 위치가 새지 않음). ‘종각역 1번 출구 바로 앞’ 같은 위치 설명 한 줄." },
  { t: "안전 · 운영", v: "시험 669", d: "개인정보 가림, 로그인, 경고 확인, 감사 기록. Cloudflare Tunnel로 공개 주소, 자동 시험(Python 565·화면 104) + 통합 39 + GitHub Actions CI." },
];

const tech = ["LangGraph", "FastAPI", "Next.js", "PostgreSQL · PostGIS · pgvector", "Redis", "ONNX Runtime", "faster-whisper", "MapLibre", "Docker Compose", "Cloudflare Tunnel", "GitHub Actions"];

// 한계 (정직하게) → 앞으로 계획 (11/25 사용자: 피드백 목록 대신 한계와 계획)
const limits = [
  { t: "짧은 신고에 약함", d: "첫 한두 문장만으로는 위급 환자를 69%만 알아봄 (통화 30초 분량이면 90%)" },
  { t: "서울 안에서만 추천", d: "병원·도로·지도 자료가 서울만 있어서, 서울을 5km 넘게 벗어난 신고는 추천하지 않음" },
  { t: "아직 현장 검증 전", d: "노트북 한 대에서 동작(꺼지면 멈춤), 실제 구급대원·상황요원이 써 보지 않음" },
];
const plans = [
  { t: "과소평가율 더 낮추기 (지금 2.5%)", d: "위급 환자를 놓친 사례를 질환별로 모아 규칙과 학습 데이터를 보강하고, 더 보수적인 기준(위급 인식 95%·99%)에서 경보가 얼마나 느는지 함께 잼" },
  { t: "신고 길이별 판단 기준", d: "짧은 신고는 더 일찍 위급으로 보게 운영점을 나눔" },
  { t: "클라우드 서버로", d: "노트북 → 서버 이전, 모니터링(Grafana)과 장애 대응 연습" },
  { t: "현장 의견 받기", d: "구급대원·상황요원 6~10명이 직접 써 보고, 고칠 점을 다시 시험으로" },
];

const W = 1440;
const backup: Shot[] = [
  { src: "/shots/erlink-v2-report.webp", alt: "노트북 신고 화면: 가운데 큰 ‘눌러서 말하기’ 버튼과 글로 적기 칸", caption: "① 신고 첫 화면 — 말하기 · 글로 적기", width: W, height: 832 },
  { src: "/shots/erlink-v2-queue.webp", alt: "상황 판단 화면: 신고 접수 대기 3건, 맨 위 ‘의식 없음 의심’ 빨간 표시와 ‘불러와서 추천 받기’", caption: "② 상황 판단 — 급한 신고가 맨 위", width: W, height: 832 },
  { src: "/shots/erlink-result.webp", alt: "추천 결과: 1순위 병원 도착 시간·빈 병상과 대안", caption: "③ 추천 결과 (11/23 실제 병상 자료 · 화면 개편 전)", width: 1568, height: 782 },
  { src: "/shots/erlink-rerecommend.webp", alt: "전화 거절 뒤 그 병원을 빼고 다시 추천한 화면", caption: "④ 수용 불가 → 빼고 다시 추천 (11/23 · 개편 전)", width: 1568, height: 782 },
  { src: "/shots/erlink-v2-report-decided.webp", alt: "신고자 화면: 이송할 병원이 정해졌어요, 진행 단계 4개 완료, 보낸 위치 지도", caption: "⑤ 승인 뒤 신고자 화면", width: 1040, height: 792 },
  { src: "/shots/erlink-audit.webp", alt: "감사 기록 화면: 결정 목록과 해시 체인 정상", caption: "⑥ 감사 기록 · 해시 체인 (11/23)", width: 1568, height: 782 },
];

export default function ERLink() {
  return (
    <main id="main" className="wrap page">
      {/* ── 40초 · 문제 ── */}
      <section className="split" aria-label="문제">
        <div style={{ display: "grid", gap: 20 }}>
          <PageHead path="/erlink" status="동작 중 · erlink.songsh.cloud" meta="메인 프로젝트 · 개인" title="ERLink AI">
            119 구급대가 환자를 <span className="hl">어느 병원으로 옮길지 빨리 정하도록</span> 돕는 AI. 신고 한 번에 병원 3곳을 도착 시간·빈
            병상·법 조문 근거와 함께 추천하고, 확정은 사람이 합니다.
          </PageHead>
          <div className="panel">
            <Cue time="40초">문제</Cue>
            <p className="say">응급실이 지금 받을 수 있는지, 필요한 시술이 되는지 대부분 전화로 확인합니다.</p>
            <p className="body">
              거절되면 다시 찾는 동안 환자는 구급차 안에서 기다립니다. 빈 병상과 병원 역량 정보는 공공 데이터에 이미 있지만, 그 순간{" "}
              <b>근거와 함께</b> 보여 주는 도구가 없었습니다.
            </p>
            <ul className="users" aria-label="사용자">
              <li>
                <b>신고자</b>
                <span>말하거나 적기</span>
              </li>
              <li>
                <b>119 상황요원</b>
                <span>추천 확인 · 응급실 전화</span>
              </li>
              <li>
                <b>구급대원</b>
                <span>최종 승인</span>
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
          <figcaption className="note">신고자 휴대폰 — 첫 화면 · 숨을 안 쉬면 바로 가슴 압박 안내 (시연용, 실제 119와 연결되지 않음)</figcaption>
        </figure>
      </section>

      {/* ── 50초 · 전체 흐름 ── */}
      <section aria-labelledby="flow-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="flow-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              <span className="mono">50초</span> · 전체 흐름
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

      {/* ── 3분 · 라이브 시연 ── */}
      <section className="split-r" aria-label="라이브 시연">
        <div className="panel">
          <Cue time="3분">라이브 시연 · erlink.songsh.cloud</Cue>
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

      {/* ── 1분 50초 · 내가 만든 것 ── */}
      <section aria-labelledby="built-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="built-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              <span className="mono">1분 50초</span> · 내가 만든 것
            </span>
            기획부터 배포까지 혼자 만들었습니다
          </h2>
          <span className="note">개인 프로젝트 · 역할별 Agent가 차례로 판단하고 단계마다 근거를 남김</span>
        </div>
        <ol className="agents is-10">
          {agents.map((a) => (
            <li key={a.n} className={a.human ? "agent is-human" : "agent"}>
              <span className="agent-n">{a.n}</span>
              <b>{a.t}</b>
              <span className="agent-t">{a.d}</span>
            </li>
          ))}
        </ol>
        <div className="built">
          {built.map((b) => (
            <div key={b.t} className="built-item">
              <div className="built-top">
                <b>{b.t}</b>
                <span className="mono built-v">{b.v}</span>
              </div>
              <p>{b.d}</p>
            </div>
          ))}
        </div>
        <ul className="chips" aria-label="사용 기술">
          {tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      {/* ── 40초 · 확인한 결과 · 한계 · 앞으로 계획 ── */}
      <section aria-labelledby="lim-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="lim-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              <span className="mono">40초</span> · 확인한 결과 · 한계 · 앞으로 계획
            </span>
            확인한 것과, 아직 못 한 것
          </h2>
        </div>
        <div className="proof">
          <div>
            <span className="proof-v">
              <span className="hl">11.9→2.5%</span>
            </span>
            <span className="note">위급 환자 과소평가 (규칙만 → 규칙 + 모델, 서울 119 평가용 약 1.87만 건)</span>
          </div>
          <div>
            <span className="proof-v">100%</span>
            <span className="note">추천 근거 조문 인용률</span>
          </div>
          <div>
            <span className="proof-v">669</span>
            <span className="note">자동 시험 (Python 565 · 화면 104) + 통합 39 · CI 통과</span>
          </div>
          <div>
            <span className="proof-v">12차</span>
            <span className="note">화면·흐름 검토 · 지적마다 재발 방지 시험</span>
          </div>
        </div>
        <div className="lp">
          <div className="lp-col is-wip">
            <span className="cue is-wip">한계</span>
            <ul>
              {limits.map((l) => (
                <li key={l.t}>
                  <b>{l.t}</b>
                  <span>{l.d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lp-col">
            <span className="cue">앞으로 계획</span>
            <ul>
              {plans.map((p) => (
                <li key={p.t}>
                  <b>{p.t}</b>
                  <span>{p.d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="say next">“ERLink로 큰 시스템을 끝까지 만들어 봤다면, 짧게 만든 프로젝트도 하나씩 보여 드리겠습니다.”</p>
      </section>

      <Pager path="/erlink" />
    </main>
  );
}
