import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  experimental: {
    externalDir: true
  },
  transpilePackages: [
    "@gtm-os/config",
    "@gtm-os/providers",
    "@gtm-os/shared-domain",
    "@gtm-os/types"
  ],
  output: "standalone"
};

export default nextConfig;
