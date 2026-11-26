import type { Metadata } from "next";
import Image from "next/image";
import PageHead, { Cue } from "@/components/PageHead";
import Pager from "@/components/Pager";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "중간평가 · 서울 메이트" };

// 02 중간평가 (3분) — 11/26 개편 (도안: 발표용 프로필 사이트 시안 MidtermV2)
//   목표 → 라이브 시연 4단계 (11/26: 전체 흐름 상자는 뺌 — 시연 입장 화면과 n8n 기록이 대신 보여 줌)(qwen3 자료 없음 vs seoulmate) → 결과(최종 성능표 4줄) → ERLink 로
//   발표 대본이 따로 없어서, 블록마다 굵은 글 = 말할 핵심, 작은 글 = 덧붙일 설명으로 씁니다.
//   발표 시간 배분(화면에는 표시 안 함): 목표 20초 · 흐름 20초 · 라이브 시연 1분 30초 · 결과 40초 · 마무리 10초
//   성능표 출처(같은 100문항 · 공정 채점 v2): Lite LLM project/results
//     - 자료 없음(qwen3:1.7b · seoulmate-1.7b): final_eval_20261125235823 (data/ft/final_eval100_noctx_20261125235705.jsonl)
//     - 검색 자료(RAG) 붙임(qwen3:1.7b · seoulmate-1.7b): final_eval_20261123172213
//   seoulmate-1.7b = 지금 서비스 중인 v4 (70%). v3 75% 와 차이 없음(McNemar p=0.33), RAG만 붙인 qwen 대비 유의(p=0.03)

// 라이브 시연 순서 (b = 할 일, s = 짚을 말)
const demo = [
  { b: "API 키로 입장", s: "게이트웨이가 키를 검사합니다. 통과하면 ‘키 확인됨’과 쓸 수 있는 모델이 표시됨" },
  { b: "일반 채팅 · qwen3:1.7b에게 “지금 강남역 붐벼?”", s: "자료 없이 모델만 답합니다. 모른다고 하거나 숫자를 지어냄 (답 아래 ‘자료 검색 없음’)" },
  { b: "서울 메이트 · seoulmate-1.7b에게 “지금 강남역 붐벼?”", s: "수집 자료를 근거로 답합니다. 답 아래 기준 시각과 근거 → 왼쪽 강남역 카드와 같은 값" },
  { b: "n8n 실행 기록에서 방금 질문이 지나간 길", s: "맨 위 실행을 열면 질문 분석 → Qdrant 검색(장소·시각) → 게이트웨이 LLM 호출 → 화면에 응답. 일반 채팅은 n8n을 거치지 않아 기록에 없음" },
];

// 시연 화면 두 장 (같은 질문, 같은 시각)
const pair = [
  { src: "/shots/mt-demo-qwen.webp", alt: "일반 채팅 qwen3:1.7b의 답: 강남역은 여전히 붐벼요. 답 아래 자료 검색 없음(일반 채팅)", w: 394, h: 426, cap: "qwen3:1.7b · 자료 없음", pick: false },
  { src: "/shots/mt-demo-seoulmate.webp", alt: "서울 메이트 seoulmate-1.7b의 답: 아니요, 지금 강남역은 한산한 편이에요. 11월 25일 23시 50분 기준 여유, 추정 인구 26,000~28,000명. 근거 강남역 23:50 기준", w: 399, h: 492, cap: "seoulmate-1.7b · 근거와 함께", pick: true },
];

// 한계와 다음 단계 (11/26 2차: 성과 탭에서 프로젝트 끝으로 되돌림)
// 11/26 발표 전날: '한계와 다음 단계' 대신 '아쉬운 점' 한 문장. 더 큰 모델과 비교한 적은 없어 '작아서 안 됐다'고 단정하지 않음

// 최종 성능표 (같은 100문항, 공정 채점)
const rows = [
  { way: "프롬프트", setup: "qwen3:1.7b", acc: "0%", made: "61%", style: "34%", sec: "5.5초", warn: true },
  { way: "RAG", setup: "qwen3:1.7b + 검색 자료(RAG)", acc: "55%", made: "1%", style: "50%", sec: "8.9초", warn: false },
  { way: "파인튜닝", setup: "seoulmate-1.7b", acc: "0%", made: "70%", style: "95%", sec: "3.1초", warn: true },
  { way: "하이브리드 (서비스)", setup: "seoulmate-1.7b + 검색 자료(RAG)", acc: "70%", made: "0%", style: "100%", sec: "6.6초", warn: false, pick: true },
];

export default function Midterm() {
  return (
    <main id="main" className="wrap page">
      {/* ── 목표 ── */}
      <section className="split" aria-label="목표">
        <div style={{ display: "grid", gap: 20 }}>
          <PageHead path="/midterm" status="배포됨" meta="중간평가 프로젝트" title="서울 메이트">
            서울 시민과 관광객에게 <span className="hl">지금 어디가 붐비는지, 몇 시에 붐빌지</span>를 근거와 함께 알려 주는 혼잡도 안내.
            외부 AI 없이 내 서버와 내 노트북 모델이 답합니다.
          </PageHead>
          <div className="panel">
            <Cue>목표</Cue>
            <p className="say">외부 AI 없이, 노트북의 작은 모델(qwen3:1.7b)로 서울 혼잡도를 맞히기</p>
            <p className="body">
              그대로 물어보면 모른다고 하거나 지어냅니다. 그래서 <b>실시간 자료를 모아 근거로 붙이고(RAG), 그 자료를 읽는 법을 모델에
              학습(파인튜닝)</b>시켰습니다.
            </p>
            <p className="note">데이터: 서울시 실시간 도시데이터(OA-21285) · 서울 열린데이터광장 · 5곳</p>
          </div>
        </div>
        <figure className="shot">
          <Image src="/shots/mt-today.webp" alt="서울 메이트 오늘의 서울: 5곳의 지금 혼잡도와 앞으로 12시간 예상 인구 막대" width={980} height={951} sizes="(max-width: 920px) 100vw, 520px" priority />
          <figcaption>‘오늘의 서울’ — 장소마다 지금 혼잡도와 앞으로 12시간 예측 막대 (11/24 16:20 기준)</figcaption>
        </figure>
      </section>

      {/* ── 라이브 시연 ── */}
      <section className="split-r" aria-label="라이브 시연">
        <div className="panel">
          <Cue>라이브 시연 · 서울 메이트</Cue>
          <ol className="demo">
            {demo.map((d) => (
              <li key={d.b}>
                <b>{d.b}</b>
                <span>{d.s}</span>
              </li>
            ))}
          </ol>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <a className="btn btn-ink" href={links.seoulmate} target="_blank" rel="noreferrer">
              서울 메이트 열기 ↗
            </a>
          </div>
          <p className="note">같은 질문을 두 모델에게: 아래 결과표의 첫 줄과 마지막 줄</p>
        </div>
        <aside className="panel" aria-label="시연 화면 미리 보기">
          <div className="mt-pair">
            {pair.map((p) => (
              <figure key={p.src} className={p.pick ? "shot is-pick" : "shot"}>
                <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(max-width: 920px) 50vw, 240px" />
                <figcaption>{p.cap}</figcaption>
              </figure>
            ))}
          </div>
          <ul className="prep">
            <li>시연 전: Azure VM · 노트북 Ollama · Tailscale · n8n 켜기</li>
          </ul>
        </aside>
      </section>

      {/* ── 시연이 안 될 때 (시연 순서대로 캡처 4장, 누르면 원본) ── */}
      <details className="backup">
        <summary>시연이 안 될 때 · 시연 순서대로 캡처 4장</summary>
        <div className="mt-backup">
          <div className="mt-backup-top">
            <a className="shot" href="/shots/mt-login.webp" target="_blank" rel="noreferrer">
              <Image src="/shots/mt-login.webp" alt="서울 메이트 API 키로 입장 화면: 키 입력칸과 답변 경로(브라우저 → Azure 게이트웨이 → Tailscale → 발표자 PC Ollama)" width={1400} height={837} sizes="(max-width: 720px) 100vw, 600px" />
              <span className="cap">
                <b>①</b> API 키로 입장
              </span>
            </a>
            <div className="mt-pair">
              {pair.map((p, i) => (
                <a key={p.src} className={p.pick ? "shot is-pick" : "shot"} href={p.src} target="_blank" rel="noreferrer">
                  <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(max-width: 720px) 50vw, 240px" />
                  <span className="cap">
                    <b>{i === 0 ? "②" : "③"}</b> {p.cap}
                  </span>
                </a>
              ))}
            </div>
          </div>
          <a className="shot" href="/shots/mt-n8n-ask-exec.webp" target="_blank" rel="noreferrer">
            <Image
              src="/shots/mt-n8n-ask-exec.webp"
              alt="n8n 실행 기록: 서울 메이트 API, 질문 받기 → 질문 분석 → Qdrant 검색(장소·시각) → 프롬프트 만들기 → 자료 있음? → 게이트웨이 LLM 호출 → 응답 만들기 → 화면에 응답, 모두 성공"
              width={1400}
              height={694}
              sizes="(max-width: 1100px) 100vw, 1060px"
            />
            <span className="cap">
              <b>④</b> n8n 실행 기록 — 방금 질문이 지나간 길 (질문 분석 → Qdrant 검색 → 게이트웨이 LLM 호출 → 화면에 응답)
            </span>
          </a>
        </div>
      </details>

      {/* ── 결과 · 최종 성능표 ── */}
      <section aria-labelledby="mt-result-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="mt-result-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              결과
            </span>
            모델 혼자로는 0%, 자료를 붙이면 55%,
            <br />
            학습한 모델에 자료를 붙이면 <span className="hl">70%</span>
          </h2>
        </div>
        <div className="table-box">
          <table className="cmp result-table">
            <caption>최종 성능표 · 같은 100문항, 공정 채점</caption>
            <thead>
              <tr>
                <th scope="col">방식</th>
                <th scope="col">모델과 설정</th>
                <th scope="col" className="r">
                  사실 정확도
                </th>
                <th scope="col" className="r">
                  지어낸 숫자
                </th>
                <th scope="col" className="r">
                  해요체
                </th>
                <th scope="col" className="r">
                  평균 응답
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.way} className={r.pick ? "is-pick" : undefined}>
                  <th scope="row">{r.way}</th>
                  <td>{r.setup}</td>
                  <td className="num r strong">{r.pick ? <span className="hl">{r.acc}</span> : r.acc}</td>
                  <td className={r.warn ? "num r warn" : "num r"}>{r.made}</td>
                  <td className="num r">{r.style}</td>
                  <td className="num r">{r.sec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-takeaway">
          RAG가 사실을 주고, 파인튜닝이 그 사실을 읽는 법과 말투를 다듬습니다. <span className="hl">둘을 합쳐야 사실에 가깝게 답합니다.</span>
        </p>
      </section>

      {/* ── 한계와 다음 단계 (11/26 2차) ── */}
      <section aria-labelledby="mt-lim-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="mt-lim-h" className="sec-title">
            아쉬운 점
          </h2>
        </div>
        <div className="panel">
          <p className="say">
            작은 모델을 큰 모델만큼 쓸 만하게 만들고 싶었지만, 노트북 성능의 한계로 큰 모델과 나란히 시험해 보지 못해,{" "}
            <span className="hl">얼마나 따라잡았는지 확인하지 못한 것</span>이 아쉽습니다.
          </p>
          <div className="mt-gap" role="img" aria-label="정확도: 지금 서비스 70%, 더 큰 모델은 노트북에서 돌릴 수 없어 재 보지 못함">
            <div className="mt-gap-row">
              <span className="mt-gap-k">
                <b>지금 서비스</b>
                <small>seoulmate-1.7b + 검색 자료 · 노트북</small>
              </span>
              <span className="mt-gap-bar">
                <i style={{ width: "70%" }} />
              </span>
              <span className="mt-gap-v">70%</span>
            </div>
            <div className="mt-gap-row is-unknown">
              <span className="mt-gap-k">
                <b>더 큰 모델</b>
                <small>노트북에서 돌릴 수 없어 재 보지 못함</small>
              </span>
              <span className="mt-gap-bar">
                <i>?</i>
              </span>
              <span className="mt-gap-v">?</span>
            </div>
          </div>
        </div>
      </section>

      <p className="say next">“작은 모델도 자료와 학습을 더하면 70%까지 오르는 걸 확인했고, 이번엔 틀리면 안 되는 문제에 써 봤습니다.”</p>

      <Pager path="/midterm" />
    </main>
  );
}
