import type { NextConfig } from "next";

// ВАЖНО: внутри docker-сети обращаемся к внутренним портам сервисов.
// .NET живёт на 8080, legacy (Spring) тоже слушает 8080.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://adboard-backend:8080";
const LEGACY_API_URL =
  process.env.NEXT_PUBLIC_API_URL_LEGACY || "http://adboard-backend-legacy:8080";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: { sourceMap: true },
  async rewrites() {
    return [
      // .NET
      { source: "/api/:path*", destination: `${API_URL}/api/:path*` },
      // LEGACY (Spring)
      { source: "/api-legacy/:path*", destination: `${LEGACY_API_URL}/api/:path*` },
    ];
  },
};

export default nextConfig;
