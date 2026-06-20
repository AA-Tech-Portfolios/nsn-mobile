import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const clearMetroCache = process.argv.includes("--clear");
const metroCommand = clearMetroCache ? "pnpm dev:metro:clear" : "pnpm dev:metro";
const concurrentlyBin = fileURLToPath(
  new URL("../node_modules/concurrently/dist/bin/concurrently.js", import.meta.url),
);

const child = spawn(process.execPath, [concurrentlyBin, "-k", "pnpm dev:server", metroCommand], {
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
