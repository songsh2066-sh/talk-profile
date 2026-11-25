import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import TopBar from "@/components/TopBar";
import KeyNav from "@/components/KeyNav";

const SITE = process.env.PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "송상헌 · 작은 모델로 믿을 수 있는 AI 만들기", template: "%s · 송상헌" },
  description: "서울시립대 AI Agent 과정 발표용 프로필. 서울 메이트(중간평가)와 ERLink AI(메인 프로젝트)를 발표 순서대로 소개합니다.",
  // 발표용 사이트라 검색에 노출하지 않습니다 (기존 프로필 사이트가 공개용).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0e131a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a href="#main" className="skip">
          본문으로 건너뛰기
        </a>
        <TopBar />
        <KeyNav />
        {children}
      </body>
    </html>
  );
}
