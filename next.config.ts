import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/bar.svg',
        destination: '/bar?_format=svg',
      },
    ]
  },
};

export default nextConfig;
