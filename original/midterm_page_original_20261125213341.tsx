import type { Metadata } from "next";
import Image from "next/image";
import PageHead, { Cue } from "@/components/PageHead";
import Pager from "@/components/Pager";
import { links } from "@/data/talk";

export const metadata: Metadata = { title: "중간평가 · 서울 메이트" };

// 02 중간평가 프로젝트 (3분) — 내용 출처: 15분 발표 구성표 v3 3장
export default function Midterm() {
  return (
    <main id="main" className="wrap page">
      <PageHead path="/midterm" status="배포됨" meta="중간평가 프로젝트" title="서울 메이트">
        서울 시민과 관광객이 <span className="hl">지금 어디가 붐비는지, 몇 시에 붐빌지</span>를 근거와 함께 알 수 있도록, 외부 AI 없이 내
        서버와 내 PC에서 답하는 소버린 AI 혼잡도 안내.
      </PageHead>

      <section className="split-l" aria-label="문제와 데이터, 구현">
        <div className="panel">
          <Cue time="30초">문제와 데이터</Cue>
          <b>대표 질문</b>
          <p className="body">
            “오후 3시에 명동 붐빌까?”
            <br />
            “지금 강남역 붐벼?”
          </p>
          <b>데이터</b>
          <p className="body">서울시 실시간 도시데이터 (OA-21285) · 서울 열린데이터광장, n8n이 30분마다 수집</p>
          <p className="note">출처: data.seoul.go.kr</p>
        </div>
        <div className="panel">
          <Cue time="60초">구현</Cue>
          <ol className="flow" aria-label="처리 흐름">
            <li className="node">
              <b>n8n</b> 30분 수집
            </li>
            <li className="arrow" aria-hidden="true">→</li>
            <li className="node">
              <b>Qdrant</b> · bge-m3 임베딩
            </li>
            <li className="arrow" aria-hidden="true">→</li>
            <li className="node">
              <b>LiteLLM</b> 키 검사·제한
            </li>
            <li className="arrow" aria-hidden="true">→</li>
            <li className="node">
              <b>Tailscale</b>
            </li>
            <li className="arrow" aria-hidden="true">→</li>
            <li className="node is-key">
              <b>내 PC Ollama</b> seoulmate-1.7b
            </li>
          </ol>
          <p className="body">
            seoulmate-1.7b = Qwen3-1.7B를 수집 자료로 만든 약 1,700개 문답으로 LoRA 파인튜닝. 예측 흐름·질문 시각 값은 코드가 계산하고,
            개인정보 질문은 모델을 부르지 않고 차단합니다.
          </p>
        </div>
      </section>

      <section aria-labelledby="cmp-h" style={{ display: "grid", gap: 14 }}>
        <div className="sec-row">
          <h2 id="cmp-h" className="sec-title">
            네 가지 방식 비교
          </h2>
          <span className="note">학습에 쓰지 않은 100문항 · 핵심 사실 정확도</span>
        </div>
        <div className="table-box">
          <table className="cmp">
            <thead>
              <tr>
                <th scope="col">방식</th>
                <th scope="col">설정</th>
                <th scope="col">정확도</th>
                <th scope="col">응답 시간</th>
                <th scope="col">한계</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">프롬프트</th>
                <td>qwen3:1.7b + 답변 규칙, 수집 자료 없음</td>
                <td className="num">
                  0/20 <span className="na">(1차 20문항)</span>
                </td>
                <td className="num na">미측정</td>
                <td>실시간 혼잡도를 알 수 없어 모른다고 하거나 지어냄</td>
              </tr>
              <tr>
                <th scope="row">RAG</th>
                <td>qwen3:1.7b + Qdrant 검색 자료 + 예시 대화 2개</td>
                <td className="num">55%</td>
                <td className="num">8.9~9.7초</td>
                <td>예측 질문 2/20, 말투가 섞임</td>
              </tr>
              <tr>
                <th scope="row">파인튜닝</th>
                <td>seoulmate-1.7b 단독, 수집 자료 없음</td>
                <td className="num na">미측정</td>
                <td className="num na">미측정</td>
                <td className="na">미측정</td>
              </tr>
              <tr className="is-pick">
                <th scope="row">하이브리드 ✓ 채택</th>
                <td>seoulmate-1.7b + RAG + 코드 계산·안전장치</td>
                <td className="num">
                  <b>75%</b>
                </td>
                <td className="num">6.3~6.6초</td>
                <td>여러 곳 비교 0~2/6</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="note">같은 RAG 자료에서 기본 모델 55% → 파인튜닝 75% (McNemar p=0.005) · 예측 질문 2/20 → 17/20 · 지어낸 숫자 0%</p>
      </section>

      <section className="split-r" aria-label="웹 시연">
        <figure className="shot">
          <Image
            src="/projects/seoulmate.webp"
            alt="서울 메이트 화면: 장소별 실시간 혼잡도"
            width={890}
            height={556}
            sizes="(max-width: 920px) 100vw, 620px"
            priority
          />
          <figcaption>서울 메이트 화면 (이전 버전 캡처 — 발표 전 최신 화면으로 교체)</figcaption>
        </figure>
        <div className="panel">
          <Cue time="90초">웹 시연</Cue>
          <ol className="steps">
            <li>시연용 API 키 입력 (화면에 표시 안 됨)</li>
            <li>“오후 3시에 명동 붐빌까?” 전송</li>
            <li>기본 모델은 틀리고 seoulmate-1.7b는 맞힘</li>
            <li>답변 아래 근거 자료 · 응답 시간 확인</li>
            <li>개인정보 질문은 차단</li>
          </ol>
          <a className="btn btn-ink" href={links.seoulmate} target="_blank" rel="noreferrer">
            대시보드 열기 ↗
          </a>
        </div>
      </section>

      <Pager path="/midterm" />
    </main>
  );
}
