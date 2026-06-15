import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native (.node) addon. Keep it external so Next does
  // not try to bundle/trace it during the build and loads it at runtime —
  // the supported pattern for native modules in route handlers.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
