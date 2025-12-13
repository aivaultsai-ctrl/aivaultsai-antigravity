import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "zod/v3": "zod",
    };
    return config;
  },
  experimental: {
    // @ts-ignore
    turbo: {
      resolveAlias: {
        "zod/v3": "zod",
      },
    },
  },
};

export default nextConfig;
