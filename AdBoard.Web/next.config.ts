import type { NextConfig } from "next";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://adboard-backend:8080';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    sassOptions: {
        sourceMap: true,
    },
    env: {
        NEXT_PUBLIC_API_URL: API_URL,
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${API_URL}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;
