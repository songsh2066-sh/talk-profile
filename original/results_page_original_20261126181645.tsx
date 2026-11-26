import type { Metadata } from "next";
import Link from "next/link";
import Pager from "@/components/Pager";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "마무리" };

// 05 마무리 — 11/26 2차 사용자 결정: 성과 탭을 마무리 탭으로 바꿈.
//   '두 프로젝트로 확인한 것'은 각 프로젝트의 결과에 이미 있고, '한계와 다음 단계'는 중간평가·ERLink 페이지 끝으로 되돌림.
//   여기는 한 줄 정리와 감사 인사만 (주소는 그대로 /results — 링크가 바뀌지 않게)

export default function Closing() {
  return (
    <main id="main">
      <section className="closing" aria-label="마무리">
        <div className="wrap closing-in">
          <span className="cue">마무리</span>
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
      <div className="wrap page">
        <Pager path="/results" />
      </div>
    </main>
  );
}
