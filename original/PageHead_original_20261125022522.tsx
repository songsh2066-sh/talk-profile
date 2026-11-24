import { neighbors } from "@/data/talk";

// 프로젝트 페이지 머리: 상태 배지 · 순서 번호 · 배정 시간 · 제목 · 한 줄 소개
export default function PageHead({
  path,
  status,
  statusTone = "ok",
  meta,
  title,
  children,
}: {
  path: string;
  status?: string;
  statusTone?: "ok" | "wip";
  meta?: string;
  title: string;
  children?: React.ReactNode;
}) {
  const { current } = neighbors(path);
  return (
    <div className="page-head">
      <div className="page-meta">
        {status ? (
          <span className={`status is-${statusTone}`}>
            <span className="status-dot" aria-hidden="true" />
            {status}
          </span>
        ) : null}
        {current ? (
          <span className="mono note">
            {current.no} · {meta ?? current.title} · {current.minutes}분
          </span>
        ) : null}
      </div>
      <h1 className="page-title">{title}</h1>
      {children ? <p className="page-lead">{children}</p> : null}
    </div>
  );
}

// 블록 위의 작은 시간 표시 (예: "30초 · 문제와 데이터")
export function Cue({ time, children, tone = "ok" }: { time: string; children: React.ReactNode; tone?: "ok" | "wip" }) {
  return (
    <p className={`cue is-${tone}`}>
      <span className="mono">{time}</span> · {children}
    </p>
  );
}
