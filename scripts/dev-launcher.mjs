// Server launcher for the Claude preview tool.
//
// - Puts the user-space Node install (~/.local/node) on PATH because
//   Next.js spawns `node` worker processes from PATH.
// - Serves the production build (`next start`) by default: the preview
//   sandbox blocks Turbopack's dev-mode worker processes, so `next dev`
//   only works from a regular terminal. Run `npm run build` first.
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");

if (!existsSync(nextBin)) {
  console.error(`next binary not found at ${nextBin} — run: npm install`);
  process.exit(1);
}

const env = { ...process.env };
const nodeBin = `${env.HOME}/.local/node/bin`;
if (!env.PATH?.includes(nodeBin)) {
  env.PATH = `${nodeBin}:${env.PATH ?? "/usr/bin:/bin"}`;
}

const mode = env.NEXT_MODE || "start";
if (mode === "start" && !existsSync(path.join(projectRoot, ".next", "BUILD_ID"))) {
  console.error("No production build found — run: npm run build");
  process.exit(1);
}

const port = env.PORT || "3777";
const child = spawn(process.execPath, [nextBin, mode, "--port", port], {
  cwd: projectRoot,
  stdio: "inherit",
  env,
});
child.on("exit", (code) => process.exit(code ?? 0));
