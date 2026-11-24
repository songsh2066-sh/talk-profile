"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { links, steps } from "@/data/talk";

// 위쪽 메뉴: 발표 순서대로 번호·이름 (11/25: 배정 시간 표시는 뺌). 지금 페이지는 검게 표시합니다.
export default function TopBar() {
  const path = usePathname();
  return (
    <header className="topbar">
      <div className="topbar-in">
        <Link href="/" className="brand" aria-label="송상헌 · 처음으로">
          <span className="brand-mark" aria-hidden="true" />
          송상헌
        </Link>
        <nav className="stepnav" aria-label="발표 순서">
          {steps.map((s) => {
            const on = s.path === path;
            return (
              <Link key={s.path} href={s.path} className={on ? "on" : undefined} aria-current={on ? "page" : undefined}>
                <span className="mono step-no">{s.no}</span>
                {s.label}
              </Link>
            );
          })}
        </nav>
        <a className="btn btn-quiet btn-sm" href={links.resume} target="_blank" rel="noreferrer">
          문서형 이력서 ↗
        </a>
      </div>
    </header>
  );
}
