import type { NextConfig } from "next";

// 발표용 프로필 사이트: 모든 페이지가 정적(빌드 때 HTML로 만들어 둠)이라 Vercel 무료 요금제로 충분합니다.
const nextConfig: NextConfig = {
  poweredByHeader: false,
};

export default nextConfig;
