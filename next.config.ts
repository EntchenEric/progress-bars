import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/bar.png',
        destination: '/bar',
      },
      {
        source: '/bar.svg',
        destination: '/bar',
      },
    ]
  },
};

export default nextConfig;
