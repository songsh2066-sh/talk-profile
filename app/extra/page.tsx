import type { Metadata } from "next";
import Image from "next/image";
import PageHead from "@/components/PageHead";
import Pager from "@/components/Pager";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "추가 프로젝트" };

// 04 추가 프로젝트 (합계 3분) — 소개할 프로젝트는 구성표 5장이 정해지면 바꿉니다.
export default function Extra() {
  return (
    <main id="main" className="wrap page">
      <PageHead path="/extra" title="짧은 기간에 끝까지 만든 것들">
        각 1분 30초 · 무엇을 만들었고, 무엇을 확인했는지만.
      </PageHead>

      <section className="grid-2" aria-label="추가 프로젝트">
        <article className="mini">
          <div className="mini-visual">
            <figure className="shot">
              <Image
                src="/projects/memory-detective.webp"
                alt="기억 탐정 사건 접수서 화면: 기억나는 장면과 힌트 카드 입력"
                width={910}
                height={568}
                sizes="(max-width: 720px) 100vw, 520px"
              />
            </figure>
          </div>
          <div className="mini-body">
            <div className="mini-top">
              <h2>기억 탐정 AI</h2>
              <span className="mono note">1분 30초</span>
            </div>
            <p className="body">기억나는 장면과 힌트 카드만으로 영화·애니메이션 후보를 근거와 함께 찾아 주는 AI.</p>
            <dl className="facts">
              <div className="fact">
                <dt>4</dt>
                <dd>배포한 버전 (1.0 → 1.3)</dd>
              </div>
              <div className="fact">
                <dt>6</dt>
                <dd>힌트 카드 항목</dd>
              </div>
              <div className="fact">
                <dt>0</dt>
                <dd>서버에 남는 입력</dd>
              </div>
            </dl>
            <ul className="chips" aria-label="사용 기술">
              <li>Apps Script</li>
              <li>JavaScript</li>
              <li>OpenAI API</li>
            </ul>
            <a className="btn" href={links.memoryDetective} target="_blank" rel="noreferrer">
              Web app ↗
            </a>
          </div>
        </article>

        <article className="mini">
          <div className="mini-visual">
            <div className="placeholder">[웹 이력서 화면 캡처 — 기존 프로필 사이트]</div>
          </div>
          <div className="mini-body">
            <div className="mini-top">
              <h2>웹 이력서 플랫폼</h2>
              <span className="mono note">1분 30초</span>
            </div>
            <p className="body">경력 원장 기반 AI 이력서 플랫폼의 제안서·PRD를 쓰고, 공개 이력서 페이지를 Next.js로 만들어 Vercel에 배포.</p>
            <dl className="facts">
              <div className="fact">
                <dt>2</dt>
                <dd>언어 (KO · EN)</dd>
              </div>
              <div className="fact">
                <dt>PDF</dt>
                <dd>인쇄용 이력서 레이아웃</dd>
              </div>
              <div className="fact">
                <dt>PRD</dt>
                <dd>제안서 · 요구사항 문서</dd>
              </div>
            </dl>
            <ul className="chips" aria-label="사용 기술">
              <li>Next.js</li>
              <li>TypeScript</li>
              <li>Vercel</li>
            </ul>
            <a className="btn" href={links.oldProfile} target="_blank" rel="noreferrer">
              사이트 보기 ↗
            </a>
          </div>
        </article>
      </section>

      <Pager path="/extra" />
    </main>
  );
}
