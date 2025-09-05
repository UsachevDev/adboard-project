import type { NextConfig } from "next";

// ВАЖНО: внутри docker-сети обращаемся к внутреннему порту сервиса.
// .NET живёт на 8080.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://adboard-backend:8080";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: { sourceMap: true },
  async rewrites() {
    return [
      // .NET
      { source: "/api/:path*", destination: `${API_URL}/api/:path*` },
    ];
  },
};

export default nextConfig;
