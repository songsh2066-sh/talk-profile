"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { neighbors } from "@/data/talk";

// 발표 중 키보드 →·← (또는 PageDown·PageUp)로 다음·이전 페이지로 넘깁니다.
// 글 입력 칸에 있을 때와 Ctrl·Alt·Cmd 를 같이 누른 경우는 건드리지 않습니다.
export default function KeyNav() {
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    const { prev, next } = neighbors(path);
    if (prev) router.prefetch(prev.path);
    if (next) router.prefetch(next.path);
    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      // 누른 순간의 주소로 앞뒤를 다시 계산 (빠르게 연달아 눌러도 한 칸씩 정확히 이동)
      const { prev, next } = neighbors(window.location.pathname);
      if ((e.key === "ArrowRight" || e.key === "PageDown") && next) {
        e.preventDefault();
        router.push(next.path);
      } else if ((e.key === "ArrowLeft" || e.key === "PageUp") && prev) {
        e.preventDefault();
        router.push(prev.path);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [path, router]);
  return null;
}
