import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["logo.clearbit.com"],
  },
  webpack: (config, { dev }) => {
    config.watchOptions = {
      ...(config.watchOptions ?? {}),
      aggregateTimeout: 300,
      ignored: /node_modules|\.next/,
      poll: 1000,
    };

    if (dev) {
      config.cache = false;
    }

    return config;
  },
};

export default nextConfig;
