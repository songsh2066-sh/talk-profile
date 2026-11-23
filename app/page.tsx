import Link from "next/link";
import Pager from "@/components/Pager";
import { links, steps } from "@/data/talk";

// 01 홈 · 자기소개 (1분)
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
              외부 AI 없이 작은 모델로 실제 서비스를 만들고, 개선은 같은 평가셋의 숫자로 확인합니다. 오늘은 서울 메이트와 ERLink를
              중심으로 소개합니다.
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
          </div>

          <aside className="agenda" aria-labelledby="agenda-h">
            <div className="agenda-head">
              <h2 id="agenda-h">오늘 발표 · 15분</h2>
              <span className="note">메뉴 순서 = 발표 순서</span>
            </div>
            <ol>
              {steps.map((s) => (
                <li key={s.path}>
                  <Link href={s.path}>
                    <span className="mono agenda-t">{s.range}</span>
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
        <dl className="metrics" aria-label="대표 수치">
          <div className="metric">
            <dt className="metric-v">
              <span className="hl">55→75%</span>
            </dt>
            <dd>
              <span className="metric-l">서울 메이트 정확도</span>
              <span className="metric-s">같은 100문항 · 기본 모델 → 파인튜닝</span>
            </dd>
          </div>
          <div className="metric">
            <dt className="metric-v">
              <span className="hl">11.9→2.5%</span>
            </dt>
            <dd>
              <span className="metric-l">ERLink 위급 환자 과소평가</span>
              <span className="metric-s">서울 119 신고 평가용 약 1.87만 건</span>
            </dd>
          </div>
          <div className="metric">
            <dt className="metric-v">
              <span className="hl">637</span>
            </dt>
            <dd>
              <span className="metric-l">ERLink 자동 시험</span>
              <span className="metric-s">Python 551 · 화면 E2E 86 · CI 통과</span>
            </dd>
          </div>
          <div className="metric">
            <dt className="metric-v">
              <span className="hl">8.6만</span>
            </dt>
            <dd>
              <span className="metric-l">119 신고로 학습</span>
              <span className="metric-s">ERLink 중증도 모델 · KoELECTRA 파인튜닝</span>
            </dd>
          </div>
        </dl>

        <section aria-labelledby="how-h" style={{ display: "grid", gap: 20 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h2 id="how-h" className="sec-title">
              이렇게 만듭니다
            </h2>
            <p className="note">두 프로젝트에 같은 원칙을 썼습니다.</p>
          </div>
          <ol className="principles">
            <li className="principle">
              <span className="mono principle-n">01</span>
              <b className="principle-t">실데이터에 연결한다</b>
              <p className="principle-b">서울 실시간 도시데이터, 응급실 병상 공공 API, 119 신고 녹취.</p>
            </li>
            <li className="principle">
              <span className="mono principle-n">02</span>
              <b className="principle-t">평가로 증명한다</b>
              <p className="principle-b">학습에 쓰지 않은 평가셋을 먼저 만들고, 바꾼 뒤에 같은 기준으로 다시 잽니다.</p>
            </li>
            <li className="principle">
              <span className="mono principle-n">03</span>
              <b className="principle-t">약한 곳은 설계로 막는다</b>
              <p className="principle-b">작은 모델이 약한 계산은 코드가, 위험한 결정은 사람이 맡습니다.</p>
            </li>
            <li className="principle">
              <span className="mono principle-n">04</span>
              <b className="principle-t">끝까지 배포한다</b>
              <p className="principle-b">Vercel · Azure · Docker Compose · GitHub Actions CI.</p>
            </li>
          </ol>
        </section>

        <Pager path="/" />
        <p className="keyhint">키보드 → · ← 로 다음·이전 페이지</p>
      </div>
    </main>
  );
}
