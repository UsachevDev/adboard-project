// Next 14/15, TS-версия
import type { NextConfig } from "next";

const API_INTERNAL_URL = (
  process.env.API_INTERNAL_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://adboard-project.onrender.com" // бек на Render
    : "http://adboard-backend:8080")         // локальный докер
).replace(/\/$/, "");                         // без завершающего '/'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_INTERNAL_URL}/api/:path*`,
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "standalone",
};

export default nextConfig;
