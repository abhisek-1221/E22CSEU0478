import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/evaluation-service/:path*',
        destination: 'http://20.244.56.144/evaluation-service/:path*',
      },
    ];
  },
};

export default nextConfig;
