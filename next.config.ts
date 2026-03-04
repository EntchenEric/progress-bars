import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/bar.svg',
        destination: '/bar?_format=svg',
      },
      {
        source: '/bar.png',
        destination: '/bar?_format=png',
      },
    ]
  },
};

export default nextConfig;
