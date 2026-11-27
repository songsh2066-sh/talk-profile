import Link from "next/link";
import Pager from "@/components/Pager";
import { links, steps } from "@/data/talk";

// 01 홈 · 자기소개 (1분) — 오늘 발표 목록은 data/talk.ts 의 순서·시간
//   11/26 개편 (도안: 발표용 프로필 사이트 시안 MainV2): 대표 수치 4칸·'이렇게 만듭니다' 대신
//   소개 문단 + 전공·과정 한 줄 + 교육 기간 동안 만든 프로젝트 + 사용한 기술 (보여 주기만, 말은 짧게)

// 교육 기간 동안 만든 프로젝트 (웹 이력서는 교육 기간 전이라 뺌 — 11/26 사용자 결정)
const built = [
  { when: "2026.10", name: "기억 탐정 AI · 서울 먹킷리스트", how: "외부 AI(API)", main: false },
  { when: "2026.11 · 중간평가", name: "서울 메이트", how: "내 노트북 작은 모델 · RAG · 파인튜닝", main: false },
  { when: "2026.11 · 메인", name: "ERLink AI", how: "상황실 AI · 신고부터 이송 병원 확정까지", main: true },
];

// 사용한 기술 (세 프로젝트에서 실제로 쓴 것)
const skills = [
  { t: "모델 · 학습", items: ["PyTorch", "LoRA 파인튜닝", "Qwen3", "KoELECTRA", "ONNX", "Ollama"] },
  { t: "에이전트 · 검색", items: ["LangGraph", "RAG", "Qdrant", "pgvector", "n8n", "LiteLLM"] },
  { t: "서비스 · 배포", items: ["FastAPI", "Next.js", "PostgreSQL", "Docker Compose", "Azure", "Cloudflare Tunnel", "GitHub Actions"] },
];

export default function Home() {
  return (
    <main id="main">
      <section className="hero wrap">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">AI 에이전트 개발자</p>
            <h1 className="hero-name">
              송상헌 <span className="hero-alt">SONG SANGHEON</span>
            </h1>
            <p className="tagline">
              <span className="hl">작은 모델로</span>
              <br />
              믿을 수 있는 AI 만들기
            </p>
            <p className="hero-intro">
              외부 AI에 맡기지 않고 제 서버와 노트북에서 돌아가는 작은 모델로 실제 서비스를 만들고,{" "}
              <b>필요한 자료를 찾아 근거로 붙여 주고 그 자료를 읽는 법을 직접 가르치며</b> 모델을 개선해 나갔습니다.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-ink" href="/midterm">
                발표 시작 →
              </Link>
              <a className="btn" href={links.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a className="btn" href={links.resume} target="_blank" rel="noreferrer">
                문서형 이력서 ↗
              </a>
            </div>
            <p className="hero-meta">소프트웨어·빅데이터 전공 · 서울시립대학교 AI Agent 과정 참여 중</p>
            <p className="hero-note">오늘은 저에 대한 소개보다는, 이번 교육 과정에서 무엇을 배우고 어떤 프로젝트를 만들었는지 보여드리겠습니다.</p>
          </div>

          <aside className="agenda" aria-labelledby="agenda-h">
            <div className="agenda-head">
              <h2 id="agenda-h">오늘 발표</h2>
              <span className="note">메뉴 순서 = 발표 순서</span>
            </div>
            <ol>
              {steps.map((s) => (
                <li key={s.path}>
                  <Link href={s.path}>
                    <span className="mono agenda-t">{s.no}</span>
                    <span>
                      <b>{s.title}</b>
                      <span className="sub">{s.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <div className="wrap page" style={{ paddingTop: 48 }}>
        <section aria-labelledby="built-h" style={{ display: "grid", gap: 16 }}>
          <div className="sec-row">
            <h2 id="built-h" className="sec-title">
              교육 기간 만든 프로젝트
            </h2>
            <span className="note">외부 AI → 내 서버·내 모델</span>
          </div>
          <ol className="tl">
            {built.map((b) => (
              <li key={b.when} className={b.main ? "tl-item is-main" : "tl-item"}>
                <span className="mono tl-when">{b.when}</span>
                <b>{b.name}</b>
                <span className="tl-how">{b.how}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="skill-h" style={{ display: "grid", gap: 16 }}>
          <h2 id="skill-h" className="sec-title">
            사용한 기술
          </h2>
          <div className="skills">
            {skills.map((g) => (
              <div key={g.t} className="skill-group">
                <b>{g.t}</b>
                <ul className="chips" aria-label={g.t}>
                  {g.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <Pager path="/" />
        <p className="keyhint">키보드 → · ← 로 다음·이전 페이지</p>
      </div>
    </main>
  );
}
