import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a minimal self-contained server in .next/standalone for the Docker image.
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  // Don't generate AGENTS.md instructions for AI coding tools during `next dev`.
  agentRules: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
