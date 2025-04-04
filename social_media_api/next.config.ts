import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '**',
      },
    ],
  },
  // Server options
  serverRuntimeConfig: {
    // Will only be available on the server side
    authToken: process.env.AUTH_TOKEN,
  },
};

export default nextConfig;
