import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      enabled: false, // disable Turbopack — use stable Webpack instead
    },
  },
};

export default nextConfig;