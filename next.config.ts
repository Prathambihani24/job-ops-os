import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd()),
  transpilePackages: [
    "@gtm-os/config",
    "@gtm-os/providers",
    "@gtm-os/shared-domain",
    "@gtm-os/types"
  ],
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib': path.resolve(__dirname, 'lib'),
    };
    console.log('Alias @/lib set to:', path.resolve(__dirname, 'lib'));
    return config;
  },
};

export default nextConfig;