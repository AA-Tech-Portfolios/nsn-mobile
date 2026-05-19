#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const port = Number(process.env.EXPO_TUNNEL_PORT ?? 8081);
const clearCache = !["0", "false", "no"].includes(
  String(process.env.EXPO_TUNNEL_CLEAR ?? "1").toLowerCase(),
);

function resolveNgrokBin() {
  const suffix = process.platform === "win32" ? ".exe" : "";
  const candidates = [
    path.resolve("node_modules", "ngrok", "bin", `ngrok${suffix}`),
    path.resolve(
      "node_modules",
      ".pnpm",
      "ngrok@5.0.0-beta.2",
      "node_modules",
      "ngrok",
      "bin",
      `ngrok${suffix}`,
    ),
  ];

  const bin = candidates.find((candidate) => fs.existsSync(candidate));
  if (!bin) {
    throw new Error("ngrok binary not found. Run `pnpm install` first.");
  }
  return bin;
}

function commandForPnpm(args) {
  if (process.platform === "win32") {
    return {
      command: "cmd.exe",
      args: ["/d", "/s", "/c", ["pnpm", ...args].join(" ")],
    };
  }
  return { command: "pnpm", args };
}

function parseTunnelUrl(line) {
  const jsonStart = line.indexOf("{");
  if (jsonStart >= 0) {
    try {
      const event = JSON.parse(line.slice(jsonStart));
      if (typeof event.url === "string" && event.url.startsWith("https://")) {
        return event.url;
      }
    } catch {
      // Fall through to logfmt parsing.
    }
  }

  const match = line.match(/\burl=(https:\/\/[^\s]+)/);
  return match?.[1] ?? null;
}

function waitForTunnelUrl(ngrok) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => {
      reject(new Error("ngrok did not report a tunnel URL within 30 seconds."));
    }, 30_000);

    ngrok.stdout.on("data", (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);

      for (const line of text.split(/\r?\n/)) {
        const url = parseTunnelUrl(line);
        if (url) {
          clearTimeout(timeout);
          resolve(url);
          return;
        }
      }
    });

    ngrok.stderr.on("data", (data) => {
      const text = data.toString();
      output += text;
      process.stderr.write(text);
    });

    ngrok.on("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`ngrok exited before creating a tunnel (code ${code}).\n${output}`));
    });
  });
}

let ngrok;
let expo;

function shutdown(signal) {
  expo?.kill(signal);
  ngrok?.kill(signal);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

const ngrokArgs = [
  "http",
  String(port),
  "--log",
  "stdout",
  "--log-format",
  "logfmt",
  "--log-level",
  "info",
];

if (process.env.NGROK_AUTHTOKEN) {
  ngrokArgs.push("--authtoken", process.env.NGROK_AUTHTOKEN);
}

ngrok = spawn(resolveNgrokBin(), ngrokArgs, {
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});

try {
  const tunnelUrl = await waitForTunnelUrl(ngrok);
  console.log(`[expo] Using ngrok tunnel ${tunnelUrl}`);

  const expoArgs = ["exec", "expo", "start", "--localhost", "--port", String(port)];
  if (clearCache) {
    expoArgs.push("-c");
  }

  const pnpm = commandForPnpm(expoArgs);
  expo = spawn(pnpm.command, pnpm.args, {
    env: {
      ...process.env,
      EXPO_PACKAGER_PROXY_URL: tunnelUrl,
    },
    stdio: "inherit",
    windowsHide: true,
  });

  expo.on("exit", (code, signal) => {
    ngrok?.kill();
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
} catch (error) {
  ngrok?.kill();
  console.error(error.message);
  if (!process.env.NGROK_AUTHTOKEN) {
    console.error(
      "Set NGROK_AUTHTOKEN or run `pnpm exec ngrok config add-authtoken <token>` first.",
    );
  }
  process.exit(1);
}
