import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://mangrove.sman10pentagon.sch.id/api/:path*",
      },
    ];
  },
};

export default nextConfig;
