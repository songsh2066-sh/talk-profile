import type { Metadata } from "next";
import Image from "next/image";
import PageHead, { Cue } from "@/components/PageHead";
import Pager from "@/components/Pager";
import Backup, { type Shot } from "@/components/Backup";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "1차 프로젝트 · ERLink AI" };

// 판단 단계 (ERLink LangGraph 흐름: triage → bed → route → capability → saturation → protocol → supervisor → critic → 승인 → 기록)
const agents = [
  { n: "01", t: "중증도", d: "규칙 + KoELECTRA (ONNX)" },
  { n: "02", t: "병상", d: "공공 API 10분 수집" },
  { n: "03", t: "이송 시간", d: "OSRM + 시간대 교통계수" },
  { n: "04", t: "역량 · 포화도", d: "수용 정보 · 요일 프로필" },
  { n: "05", t: "근거 RAG", d: "BM25 + e5 · RRF" },
  { n: "06", t: "순위 · 검토", d: "가중 점수 + Critic" },
  { n: "07", t: "사람 승인", d: "LangGraph 중단점", human: true },
  { n: "08", t: "감사 기록", d: "SHA-256 해시 체인" },
];

const tech = ["LangGraph", "FastAPI", "Next.js", "PostgreSQL · PostGIS · pgvector", "Redis", "ONNX Runtime", "faster-whisper", "Docker Compose", "GitHub Actions"];

const W = 1568;
const H = 782;
const backup: Shot[] = [
  { src: "/shots/erlink-report.webp", alt: "신고자 화면: 가슴 통증·노인 버튼과 시연 위치", caption: "① 신고자 화면 — 버튼으로 신고", width: W, height: H },
  { src: "/shots/erlink-result.webp", alt: "상황 판단 화면: 1순위 국립중앙의료원 약 4분과 대안 표", caption: "② 추천 3곳 — 도착 시간·빈 병상·근거", width: W, height: H },
  { src: "/shots/erlink-approved.webp", alt: "승인 완료: 승인자와 결정 번호, 감사 기록 링크", caption: "③ 구급대원 승인 → 기록", width: W, height: H },
  { src: "/shots/erlink-trauma.webp", alt: "중증 외상 신고: 외상센터 우선 배지", caption: "④ 중증 외상 — 외상센터 우선", width: W, height: H },
  { src: "/shots/erlink-rerecommend.webp", alt: "전화 거절 뒤 그 병원을 빼고 다시 추천한 화면", caption: "⑤ 전화로 거절되면 빼고 다시 추천", width: W, height: H },
  { src: "/shots/erlink-audit.webp", alt: "감사 기록 화면: 결정 목록과 해시 체인 정상", caption: "⑥ 감사 기록 · 해시 체인 검증", width: W, height: H },
];

// 03 1차 프로젝트 (4분) — 내용 출처: 15분 발표 구성표 v3 4장
export default function ERLink() {
  return (
    <main id="main" className="wrap page">
      <section className="split" aria-label="문제">
        <div style={{ display: "grid", gap: 20 }}>
          <PageHead path="/erlink" status="동작 중 · 시연 가능" meta="1차 프로젝트 · 개인" title="ERLink AI">
            119 구급대의 이송 병원 선정을 돕는 Multi-Agent AI. 신고 한 번에 <span className="hl">병원 3곳을 법 조문 근거와 함께</span>{" "}
            추천하고, 확정은 구급대원이 합니다.
          </PageHead>
          <div className="panel">
            <Cue time="40초" tone="wip">
              문제
            </Cue>
            <p className="body">
              응급실이 지금 받을 수 있는지, 필요한 시술이 되는지 대부분 <b>전화로 확인</b>합니다. 거절되면 다시 찾는 동안 환자는 구급차
              안에서 기다립니다. 정보는 공공 데이터에 이미 있지만, 그 순간 근거와 함께 보여 주는 도구가 없었습니다.
            </p>
          </div>
        </div>
        <figure className="shot">
          <Image
            src="/shots/erlink-result.webp"
            alt="ERLink 상황 판단 화면: 2등급 심혈관, 1순위 국립중앙의료원 약 4분, 지도와 대안 표"
            width={W}
            height={H}
            sizes="(max-width: 920px) 100vw, 520px"
            priority
          />
          <figcaption>상황 판단 화면 · 시연용 위치 · 실제 119와 연결되지 않음</figcaption>
        </figure>
      </section>

      <section aria-labelledby="arch-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="arch-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              <span className="mono">1분 20초</span> · 구조와 내 역할
            </span>
            역할별 Agent가 차례로 판단합니다
          </h2>
          <span className="note">기획 · 데이터 · 모델 · Agent · 화면 · 시험까지 혼자</span>
        </div>
        <ol className="agents">
          {agents.map((a) => (
            <li key={a.n} className={a.human ? "agent is-human" : "agent"}>
              <span className="agent-n">{a.n}</span>
              <b>{a.t}</b>
              <span className="agent-t">{a.d}</span>
            </li>
          ))}
        </ol>
        <div className="ideas">
          <div className="idea">
            <b>과소평가를 더 무겁게</b>
            <p>119 신고 8.6만 건으로 파인튜닝, 위급 환자를 낮게 보는 실수에 큰 벌점. 모델은 규칙보다 등급을 올리기만 합니다.</p>
          </div>
          <div className="idea">
            <b>추천마다 근거 조문</b>
            <p>법령 6개 + 응급 지침을 조문 단위로 검색해 “왜 이 병원인지”를 붙입니다.</p>
          </div>
          <div className="idea">
            <b>환자 정보는 밖으로 안 나감</b>
            <p>모델·음성 인식 모두 노트북에서. 외부 AI 서버로 보내지 않습니다.</p>
          </div>
        </div>
        <ul className="chips" aria-label="사용 기술">
          {tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="split-r" aria-label="라이브 시연">
        <div className="panel">
          <Cue time="1분 30초">라이브 시연</Cue>
          <ol className="steps">
            <li>신고자 화면: ‘가슴 통증 · 노인’ 버튼으로 신고</li>
            <li>상황 판단 화면에서 접수 건 불러오기</li>
            <li>추천 받기 → 1순위와 판단 이유 · 근거 조문</li>
            <li>승인 → 감사 기록 확인</li>
            <li className="later">시간이 되면: 중증 외상 · 전화 거절 시 재추천</li>
          </ol>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <a className="btn btn-ink" href={links.erlinkReport} target="_blank" rel="noreferrer">
              신고 화면 열기 ↗
            </a>
            <a className="btn" href={links.erlinkDecide} target="_blank" rel="noreferrer">
              상황 판단 화면 ↗
            </a>
          </div>
          <p className="note">발표 노트북에서 ERLink가 실행 중일 때만 열립니다 (localhost:3000).</p>
        </div>
        <figure className="shot shot-tall">
          <Image src="/shots/erlink-reasons.webp" alt="판단 이유 패널: 도착 시간, 빈 병상, 점수 구성 막대와 근거 조문 2건" width={390} height={726} sizes="(max-width: 920px) 100vw, 400px" />
          <figcaption>판단 이유 · 점수 구성 · 근거 조문</figcaption>
        </figure>
      </section>

      <Backup title="시연이 안 될 때 · 리허설 캡처 6장" shots={backup} />

      <section aria-label="확인한 결과" style={{ display: "grid", gap: 10 }}>
        <Cue time="30초">확인한 결과</Cue>
        <div className="proof">
          <div>
            <span className="proof-v">
              <span className="hl">637</span>
            </span>
            <span className="note">자동 시험 (Python 551 · 화면 E2E 86)</span>
          </div>
          <div>
            <span className="proof-v">CI 4단계</span>
            <span className="note">코드 검사 · 시험 · 빌드 · Docker 통합</span>
          </div>
          <div>
            <span className="proof-v">8차</span>
            <span className="note">화면 검토 · 지적마다 재발 방지 시험</span>
          </div>
        </div>
      </section>

      <Pager path="/erlink" />
    </main>
  );
}
