import { spawn } from "node:child_process";
import net from "node:net";

const preferredPort = Number(process.env.EXPO_WEB_PORT ?? 8081);

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + 20; port += 1) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(`No available Expo web port found from ${startPort} to ${startPort + 19}`);
}

const port = await findAvailablePort(preferredPort);

if (port !== preferredPort) {
  console.log(`[expo] Port ${preferredPort} is busy, using ${port} instead.`);
}

const command = process.platform === "win32" ? "cmd.exe" : "npx";
const args =
  process.platform === "win32"
    ? ["/d", "/s", "/c", `npx expo start --web --port ${port}`]
    : ["expo", "start", "--web", "--port", String(port)];

const child = spawn(command, args, {
  env: {
    ...process.env,
    EXPO_USE_METRO_WORKSPACE_ROOT: "1",
  },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
