import type { Metadata } from "next";
import Image from "next/image";
import PageHead, { Cue } from "@/components/PageHead";
import Pager from "@/components/Pager";
import Backup, { type Shot } from "@/components/Backup";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "중간평가 · 서울 메이트" };

// 02 중간평가 (3분) — 11/25 개편: ERLink 페이지와 같은 틀 (도안: 발표용 프로필 사이트 시안 MidtermV2)
//   발표 대본이 따로 없어서, 블록마다 굵은 글 = 말할 핵심, 작은 글 = 덧붙일 설명으로 씁니다.
//   발표 시간 배분(화면에는 표시 안 함): 문제 20초 · 흐름 30초 · 라이브 시연 1분 · 세 단계 30초 · 배운 것 40초 · 한계 20초
//   수치 출처: Lite LLM project/results (final_eval_20261123172213/score_v2_summary.md, n8n/rag_eval_summary_20261120022907.csv,
//             safety_20261122153933.txt), data/ft/seoulmate_ft_report_20261123162932.md
//   응답 시간은 100문항 연속 측정 평균 (화면 캡처의 응답 시간은 모델을 바꾼 직후라 로딩 시간이 섞여 있어 쓰지 않음)

// 질문 하나가 지나가는 길
const flow = [
  { n: "①", who: "수집 · n8n", t: "30분마다 서울시 자료 수집", d: "5곳의 혼잡도·추정 인구·12시간 예측을 모아 저장. 지금도 계속 돌고 있습니다", key: false },
  { n: "②", who: "검색 자료 · Qdrant", t: "근거로 쓸 문서로 저장", d: "bge-m3로 임베딩하고, 질문의 장소·시각으로 찾아서 붙입니다", key: false },
  { n: "③", who: "게이트웨이 · LiteLLM (Azure)", t: "키 검사 · 호출 제한 · 기록", d: "사람마다 다른 키. Tailscale 암호화 터널로만 내 노트북에 연결됩니다", key: false },
  { n: "④", who: "답변 · 내 노트북 Ollama", t: "seoulmate-1.7b가 근거로 답함", d: "Qwen3-1.7B를 직접 파인튜닝. 숫자 계산과 개인정보 차단은 코드가 맡습니다", key: true },
];

// 라이브 시연 순서 (b = 할 일, s = 짚을 말) — 모델은 seoulmate-1.7b 하나로만
const demo = [
  { b: "틀린 키 → 거절, 시연용 키 → 입장", s: "게이트웨이가 키를 검사합니다. 통과하면 ‘키 확인됨’과 쓸 수 있는 모델이 표시됨" },
  { b: "‘오늘의 서울’ 기준 시각", s: "n8n이 30분마다 모은 실시간 자료라는 것만 짚기" },
  { b: "“명동 오후 7시에 붐빌까?”", s: "기다리는 동안 “이 질문이 Azure 게이트웨이와 터널을 지나 제 노트북으로 갑니다” → 답변 아래 근거와 응답 시간 → 명동 카드의 7시 막대와 맞춰 보기" },
  { b: "“명동 사람 전화번호 알려줘”", s: "모델을 부르지 않고 0.1초 만에 거절" },
];

// 같은 질문, 세 단계 (shot 이 없으면 캡처 받을 자리로 표시)
type Step = { n: string; who: string; t: string; v: string; vl: string; pick?: boolean; ph: string; shot?: { src: string; alt: string; w: number; h: number } };
const steps: Step[] = [
  { n: "①", who: "기본 모델 · qwen3:1.7b", t: "실시간 자료가 없어 모른다고 하거나 지어냄", v: "0/20", vl: "1차 평가 20문항", ph: "‘일반 채팅’에 같은 질문" },
  { n: "②", who: "+ RAG · qwen3:1.7b + 수집 자료", t: "지금 혼잡도는 맞히지만 ‘몇 시’ 예측은 자주 틀림", v: "55%", vl: "정확도 · 예측 2/20 · 평균 8.9초", ph: "서울 메이트 + qwen3:1.7b" },
  { n: "③", who: "+ 파인튜닝 · seoulmate-1.7b", t: "예측까지 근거대로 맞힘, 지어낸 숫자 0%", v: "75%", vl: "정확도 · 예측 17/20 · 평균 6.3초", pick: true, ph: "서울 메이트 + seoulmate-1.7b" },
];

// 교육에서 배운 것 → 서울 메이트에 적용한 방법 → 확인한 결과
const learned = [
  {
    t: "소버린 AI · 게이트웨이",
    how: ["내 노트북 모델을 ", "Azure의 LiteLLM 게이트웨이로만", " 열고, 사람마다 키와 호출 제한을 따로 줬습니다."],
    chips: ["Ollama", "LiteLLM · Caddy", "Tailscale"],
    v: "9/10",
    vl: "안전 시험 통과 (1개는 사람 판정)",
  },
  {
    t: "n8n 자동화",
    how: ["", "30분마다 수집 → 임베딩 → Qdrant 저장", "까지 사람 손 없이 돌게 했습니다."],
    chips: ["n8n (Docker)", "서울 열린데이터광장 API"],
    v: "810",
    vl: "학습·평가에 쓴 수집 기록",
  },
  {
    t: "RAG",
    how: ["질문의 ", "장소와 시각으로 수집 자료를 찾아", " 근거로 붙였습니다."],
    chips: ["Qdrant", "bge-m3 임베딩"],
    v: "0 → 19/20",
    vl: "1차 평가 정답",
  },
  {
    t: "파인튜닝",
    how: ["수집 자료로 만든 ", "문답 1,725개로 Qwen3-1.7B를 LoRA 학습", "해, 자료 속 예측 값을 읽고 해요체로 짧게 답하게 했습니다."],
    chips: ["LoRA · Colab GPU", "GGUF → Ollama"],
    v: "2 → 17/20",
    vl: "예측 질문 정답",
    hl: true,
  },
  {
    t: "평가로 증명",
    how: ["11/22 이후 자료는 ", "학습에 쓰지 않고 평가용으로만", " 떼어 두고, 같은 100문항으로 비교했습니다."],
    chips: ["시간 기준 분리", "McNemar 검정"],
    v: "p=0.005",
    vl: "55% → 75% 차이가 우연이 아님",
  },
];

// 아직 약한 것
const limits = [
  { t: "여러 곳을 한꺼번에 비교하는 질문에 약함", d: "“어디가 제일 한산해?” 같은 질문은 세 모델 모두 0~2/6" },
  { t: "노트북 한 대 · 서울 5곳", d: "노트북이 꺼지면 답을 못 하고, 장소가 5곳뿐" },
];

const backup: Shot[] = [
  { src: "/shots/mt-login.webp", alt: "서울 메이트 API 키로 입장 화면: 키 입력칸과 답변 경로(브라우저 → Azure 게이트웨이 → Tailscale → 발표자 PC Ollama)", caption: "① API 키로 입장", width: 1400, height: 837 },
  { src: "/shots/mt-n8n-collect.webp", alt: "n8n 워크플로 서울 도시데이터 30분 수집: 30분마다 → 장소 목록 → 서울 도시데이터 호출 → 스냅샷 정리 → 저장", caption: "② n8n 30분 수집 워크플로", width: 1400, height: 666 },
  { src: "/shots/mt-n8n-exec.webp", alt: "n8n 실행 기록: 11월 25일 30분마다 Succeeded", caption: "③ 30분마다 성공한 실행 기록 (11/25)", width: 1400, height: 698 },
  { src: "/shots/mt-n8n-rag.webp", alt: "n8n RAG 적재 워크플로: 수집 파일 읽기 → 문서 만들기 → bge-m3 임베딩 → Qdrant 저장", caption: "④ RAG 적재 (bge-m3 → Qdrant)", width: 1400, height: 698 },
];

export default function Midterm() {
  return (
    <main id="main" className="wrap page">
      {/* ── 문제 ── */}
      <section className="split" aria-label="문제">
        <div style={{ display: "grid", gap: 20 }}>
          <PageHead path="/midterm" status="배포됨" meta="중간평가 프로젝트" title="서울 메이트">
            서울 시민과 관광객에게 <span className="hl">지금 어디가 붐비는지, 몇 시에 붐빌지</span>를 근거와 함께 알려 주는 혼잡도 안내.
            외부 AI 없이 내 서버와 내 노트북 모델이 답합니다.
          </PageHead>
          <div className="panel">
            <Cue>문제</Cue>
            <p className="say">서울 혼잡도는 공공 데이터로 다 나와 있는데, 작은 AI 모델은 그걸 모릅니다.</p>
            <p className="body">
              물어보면 모른다고 하거나 숫자를 지어냅니다. 그래서 <b>실시간 자료를 모아 근거로 붙이고(RAG), 그 자료를 읽는 법을 모델에
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

      {/* ── 전체 흐름 ── */}
      <section aria-labelledby="mt-flow-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="mt-flow-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              전체 흐름
            </span>
            질문은 내 게이트웨이를 지나 내 노트북 모델이 답합니다
          </h2>
        </div>
        <ol className="roles">
          {flow.map((f) => (
            <li key={f.n} className={f.key ? "role is-ai" : "role"}>
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
          <p className="note">시연은 seoulmate-1.7b 하나로만 합니다. 모델을 바꾸면 메모리에 다시 올리느라 멈출 수 있습니다.</p>
        </div>
        <aside className="panel" aria-label="시연 화면 미리 보기">
          <div className="mt-pair">
            <figure className="shot">
              <Image src="/shots/mt-answer.webp" alt="seoulmate-1.7b 답변: 지금 강남역은 많이 붐벼요, 아래에 근거 강남역 16시 20분 기준" width={382} height={231} sizes="(max-width: 920px) 50vw, 220px" />
              <figcaption>답변 + 근거</figcaption>
            </figure>
            <figure className="shot">
              <Image src="/shots/mt-pii.webp" alt="개인정보 질문 차단: 죄송해요, 개인정보는 알려 드릴 수 없어요. 모델 호출 안 함, 응답 0.1초" width={404} height={329} sizes="(max-width: 920px) 50vw, 220px" />
              <figcaption>개인정보 차단 · 0.1초</figcaption>
            </figure>
          </div>
          <ul className="prep">
            <li>시연 전: Azure VM · 노트북 Ollama · Tailscale · n8n 켜기</li>
            <li>모델은 seoulmate-1.7b로, 5분 전에 질문 한 번 (미리 올려 두기)</li>
            <li>‘오후 7시’가 12시간 막대 안에 있는지 확인 (아니면 몇 시간 뒤로 바꿔 묻기)</li>
          </ul>
        </aside>
      </section>

      <Backup title="시연이 안 될 때 · 캡처 4장" shots={backup} />

      {/* ── 같은 질문, 세 단계 ── */}
      <section aria-labelledby="mt-steps-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="mt-steps-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              같은 질문, 세 단계
            </span>
            자료를 붙이고, 읽는 법을 학습시킬수록 맞혔습니다
          </h2>
          <span className="note">질문: “명동 오후 7시에 붐빌까?” (같은 시각에 캡처)</span>
        </div>
        <ol className="steps3">
          {steps.map((s) => (
            <li key={s.n} className={s.pick ? "step3 is-pick" : "step3"}>
              <span className="role-who">
                <span className="mono">{s.n}</span> {s.who}
                {s.pick ? " ✓ 채택" : ""}
              </span>
              {s.shot ? (
                <figure className="shot">
                  <Image src={s.shot.src} alt={s.shot.alt} width={s.shot.w} height={s.shot.h} sizes="(max-width: 860px) 100vw, 340px" />
                </figure>
              ) : (
                <div className="ph">
                  캡처 받을 자리
                  <br />
                  {s.ph}
                </div>
              )}
              <b>{s.t}</b>
              <span className="step3-v">
                <span className="mono learned-num">{s.pick ? <span className="hl">{s.v}</span> : s.v}</span>
                <span className="note">{s.vl}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="note">
          ②·③은 학습에 쓰지 않은 100문항을 같은 RAG 자료로 채점 (55% → 75%, McNemar p=0.005). ①은 자료 없이 물은 1차 평가 20문항. 응답
          시간은 연속 측정 평균.
        </p>
      </section>

      {/* ── 배운 것을 이렇게 썼습니다 ── */}
      <section aria-labelledby="mt-learned-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="mt-learned-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              배운 것을 이렇게 썼습니다
            </span>
            교육에서 배운 것을 한 서비스로 묶었습니다
          </h2>
        </div>
        <div className="learned" role="table" aria-label="교육에서 배운 것을 서울 메이트에 적용한 방법">
          <div className="learned-row is-head" role="row">
            <span role="columnheader">교육에서 배운 것</span>
            <span role="columnheader">서울 메이트에 적용한 방법</span>
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
                {l.t === "파인튜닝" ? <div className="ph ph-sm">Colab 학습 화면 받을 자리</div> : null}
              </div>
              <div className="learned-v" role="cell">
                <span className="mono learned-num">{l.hl ? <span className="hl">{l.v}</span> : l.v}</span>
                <span className="note">{l.vl}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 한계 → ERLink ── */}
      <section aria-labelledby="mt-lim-h" style={{ display: "grid", gap: 16 }}>
        <div className="sec-row">
          <h2 id="mt-lim-h" className="sec-title">
            <span className="cue" style={{ display: "block", marginBottom: 4 }}>
              한계
            </span>
            아직 약한 것
          </h2>
        </div>
        <ul className="mt-limits">
          {limits.map((l) => (
            <li key={l.t}>
              <b>{l.t}</b>
              <span>{l.d}</span>
            </li>
          ))}
        </ul>
        <p className="say next">“여기서 익힌 RAG·파인튜닝·평가 방식을, 사람 생명이 걸린 문제에 적용한 것이 다음 프로젝트 ERLink입니다.”</p>
      </section>

      <Pager path="/midterm" />
    </main>
  );
}
