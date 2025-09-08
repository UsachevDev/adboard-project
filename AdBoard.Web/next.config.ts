import type { NextConfig } from "next";

// Базовый URL API. По умолчанию используется локальный backend.
// При работе в Docker значение следует переопределять через NEXT_PUBLIC_API_URL.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
