import Link from "next/link";
import { neighbors } from "@/data/talk";

// 페이지 맨 아래 이전·다음 버튼 (키보드 ←→ 와 같은 순서)
export default function Pager({ path }: { path: string }) {
  const { prev, next } = neighbors(path);
  return (
    <nav className="pager" aria-label="이전·다음 페이지">
      {prev ? (
        <Link href={prev.path} className="pager-btn">
          <span className="mono pager-k">이전 · {prev.no}</span>
          <b>← {prev.title}</b>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.path} className="pager-btn is-next">
          <span className="mono pager-k">
            다음 · {next.no}
          </span>
          <b>{next.title} →</b>
        </Link>
      ) : null}
    </nav>
  );
}
