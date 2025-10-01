// Next 14/15, TS-версия
import type { NextConfig } from "next";

const raw = process.env.API_INTERNAL_URL ?? "http://adboard-backend:8080";
const API_INTERNAL_URL = raw.replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_INTERNAL_URL}/api/:path*`,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
