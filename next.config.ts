import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore build errors
  },
};

export default nextConfig;
