import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const appUrl = process.env.SCREENSHOT_URL ?? "http://localhost:8081";
const debugPort = Number(process.env.EDGE_DEBUG_PORT ?? 9333);
const outputDir = resolve(process.cwd(), "screenshots");
const edgeProfileDir = resolve(outputDir, `.edge-profile-${Date.now()}`);
const edgeCandidates = [
  process.env.EDGE_PATH,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "msedge",
  "microsoft-edge",
  "google-chrome",
  "chromium",
].filter(Boolean);

const onboardingSnapshot = {
  hasCompletedOnboarding: true,
  ageConfirmed: true,
  suburb: "Chatswood, NSW 2067",
  intent: "Exploring",
  displayName: "Alon",
  profilePhotoUri: null,
  visibilityPreference: "Blurred",
};

const viewports = [
  { name: "home-web-mobile", width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  { name: "home-web-desktop", width: 1280, height: 900, deviceScaleFactor: 1, mobile: false },
];

function findEdge() {
  const candidate = edgeCandidates.find((path) => path && (path.includes("\\") || path.includes("/")) && existsSync(path));
  return candidate ?? edgeCandidates.find((path) => path && !path.includes("\\") && !path.includes("/"));
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

async function removeProfileDir() {
  const workspaceRoot = resolve(process.cwd());
  const resolvedProfile = resolve(edgeProfileDir);

  if (!resolvedProfile.startsWith(workspaceRoot)) {
    return;
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      rmSync(resolvedProfile, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === 7) {
        console.warn(`Could not remove temporary Edge profile: ${error.message}`);
        return;
      }

      await delay(250);
    }
  }
}

async function waitForDebugServer() {
  const versionUrl = `http://127.0.0.1:${debugPort}/json/version`;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(versionUrl);
      if (response.ok) return;
    } catch {
      // Edge is still booting.
    }

    await delay(250);
  }

  throw new Error(`Edge DevTools did not become available on port ${debugPort}.`);
}

async function createPageTarget() {
  const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: "PUT" });

  if (!response.ok) {
    throw new Error(`Could not create a browser target: ${response.status}`);
  }

  return response.json();
}

function createCdpClient(webSocketDebuggerUrl) {
  let nextId = 1;
  const pending = new Map();
  const listeners = new Map();
  const socket = new WebSocket(webSocketDebuggerUrl);

  const opened = new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", rejectOpen, { once: true });
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));

    if (message.id && pending.has(message.id)) {
      const { resolve: resolveMessage, reject } = pending.get(message.id);
      pending.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolveMessage(message.result);
      }
      return;
    }

    const callbacks = listeners.get(message.method);
    callbacks?.forEach((callback) => callback(message.params));
  });

  return {
    async open() {
      await opened;
    },
    send(method, params = {}) {
      const id = nextId;
      nextId += 1;

      const result = new Promise((resolveMessage, reject) => {
        pending.set(id, { resolve: resolveMessage, reject });
      });

      socket.send(JSON.stringify({ id, method, params }));
      return result;
    },
    waitFor(method, timeout = 10000) {
      return new Promise((resolveWait, rejectWait) => {
        const callbacks = listeners.get(method) ?? new Set();
        const timer = setTimeout(() => {
          callbacks.delete(resolveWait);
          rejectWait(new Error(`Timed out waiting for ${method}.`));
        }, timeout);

        const callback = (params) => {
          clearTimeout(timer);
          callbacks.delete(callback);
          resolveWait(params);
        };

        callbacks.add(callback);
        listeners.set(method, callbacks);
      });
    },
    close() {
      socket.close();
    },
  };
}

async function navigateAndWait(client, url) {
  const load = client.waitFor("Page.loadEventFired", 20000).catch(() => null);
  await client.send("Page.navigate", { url });
  await load;
  await delay(1800);
}

async function waitForHome(client) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const result = await client.send("Runtime.evaluate", {
      expression: `document.body?.innerText?.includes("Low-pressure meetups around the North Shore.") ?? false`,
      returnByValue: true,
    });

    if (result.result?.value === true) return;
    await delay(250);
  }

  throw new Error("Home tab did not finish rendering before the screenshot timeout.");
}

async function captureViewport(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", viewport);
  await navigateAndWait(client, appUrl);
  await client.send("Runtime.evaluate", {
    expression: `localStorage.setItem("softhello.onboarding.v1", ${JSON.stringify(JSON.stringify(onboardingSnapshot))})`,
  });
  await navigateAndWait(client, appUrl);
  await waitForHome(client);

  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  const outputPath = resolve(outputDir, `${viewport.name}.png`);
  writeFileSync(outputPath, Buffer.from(screenshot.data, "base64"));
  return outputPath;
}

const edgePath = findEdge();

if (!edgePath) {
  throw new Error("Could not find Microsoft Edge, Chrome, or Chromium.");
}

mkdirSync(outputDir, { recursive: true });

const edge = spawn(edgePath, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${edgeProfileDir}`,
  "about:blank",
], {
  stdio: "ignore",
  windowsHide: true,
});

const capturedPaths = [];

try {
  await waitForDebugServer();
  const target = await createPageTarget();
  const client = createCdpClient(target.webSocketDebuggerUrl);
  await client.open();
  await client.send("Page.enable");
  await client.send("Runtime.enable");

  for (const viewport of viewports) {
    capturedPaths.push(await captureViewport(client, viewport));
  }

  client.close();
} finally {
  edge.kill();
  await removeProfileDir();
}

console.log(capturedPaths.join("\n"));
