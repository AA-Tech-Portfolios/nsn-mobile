import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const appUrl = process.env.SCREENSHOT_URL ?? "http://localhost:8083";
const debugPort = Number(process.env.EDGE_DEBUG_PORT ?? 9444);
const outputDir = resolve(process.cwd(), "screenshots", "checkpoint");
const edgeProfileDir = resolve(tmpdir(), `nsn-checkpoint-edge-profile-${Date.now()}`);
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

const profileSnapshot = {
  hasCompletedOnboarding: true,
  ageConfirmed: true,
  age: 26,
  preferredAgeMin: 25,
  preferredAgeMax: 40,
  suburb: "Chatswood, NSW 2067",
  intent: "Exploring",
  displayName: "Alon",
  middleName: "",
  lastName: "",
  gender: "Male",
  profilePhotoUri: null,
  comfortMode: "Comfort Mode",
  visibilityPreference: "Blurred",
  blurProfilePhoto: true,
  blurLevel: "Medium blur",
  hobbiesInterests: ["Coffee", "Movies", "Walks", "Dinner"],
  comfortPreferences: ["Small groups", "Text-first", "Quiet"],
  contactPreferences: ["Text"],
  profileShortcutLayout: "Expanded",
  profileWidthPreference: "Contained",
  showSuburbArea: false,
  showInterests: false,
  showComfortPreferences: false,
  showAge: false,
  showPreferredAgeRange: false,
  showGender: false,
};

const onboardingSnapshot = {
  ...profileSnapshot,
  hasCompletedOnboarding: false,
  comfortMode: "Warm Up Mode",
  showInterests: true,
  showComfortPreferences: true,
  showAge: true,
  showGender: true,
};

const viewport = { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false };

const screens = [
  { name: "01-home", path: "/" },
  { name: "02-meetups", path: "/meetups" },
  { name: "03-chats", path: "/chats" },
  { name: "04-alerts", path: "/notifications" },
  { name: "05-profile", path: "/profile" },
  { name: "06-settings-privacy", path: "/settings" },
];

function findEdge() {
  const candidate = edgeCandidates.find((path) => path && (path.includes("\\") || path.includes("/")) && existsSync(path));
  return candidate ?? edgeCandidates.find((path) => path && !path.includes("\\") && !path.includes("/"));
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

async function removeProfileDir() {
  const workspaceRoot = resolve(tmpdir());
  const resolvedProfile = resolve(edgeProfileDir);

  if (!resolvedProfile.startsWith(workspaceRoot)) return;

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
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
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
  if (!response.ok) throw new Error(`Could not create a browser target: ${response.status}`);
  return response.json();
}

function createCdpClient(webSocketDebuggerUrl) {
  let nextId = 1;
  const pending = new Map();
  const listeners = new Map();
  const socket = new WebSocket(webSocketDebuggerUrl);

  const rejectPending = (error) => {
    for (const { reject } of pending.values()) reject(error);
    pending.clear();
  };

  const opened = new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", rejectOpen, { once: true });
  });

  socket.addEventListener("error", () => rejectPending(new Error("Browser DevTools WebSocket failed.")));
  socket.addEventListener("close", () => rejectPending(new Error("Browser DevTools WebSocket closed.")));
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));

    if (message.id && pending.has(message.id)) {
      const { resolve: resolveMessage, reject } = pending.get(message.id);
      pending.delete(message.id);
      message.error ? reject(new Error(message.error.message)) : resolveMessage(message.result);
      return;
    }

    listeners.get(message.method)?.forEach((callback) => callback(message.params));
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
          callbacks.delete(callback);
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

async function setSnapshot(client, snapshot) {
  await navigateAndWait(client, appUrl);
  await client.send("Runtime.evaluate", {
    expression: `localStorage.setItem("softhello.onboarding.v1", ${JSON.stringify(JSON.stringify(snapshot))})`,
  });
}

async function waitForText(client, text) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const result = await client.send("Runtime.evaluate", {
      expression: `document.body?.innerText?.includes(${JSON.stringify(text)}) ?? false`,
      returnByValue: true,
    });
    if (result.result?.value === true) return;
    await delay(250);
  }
  throw new Error(`Timed out waiting for text: ${text}`);
}

async function capture(client, name) {
  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  const outputPath = resolve(outputDir, `${name}.png`);
  writeFileSync(outputPath, Buffer.from(screenshot.data, "base64"));
  return outputPath;
}

const edgePath = findEdge();
if (!edgePath) throw new Error("Could not find Microsoft Edge, Chrome, or Chromium.");

mkdirSync(outputDir, { recursive: true });

const edge = spawn(edgePath, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${edgeProfileDir}`,
  "about:blank",
], { stdio: "ignore", windowsHide: true });

const capturedPaths = [];

try {
  await waitForDebugServer();
  const target = await createPageTarget();
  const client = createCdpClient(target.webSocketDebuggerUrl);
  await client.open();
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Emulation.setDeviceMetricsOverride", viewport);

  await setSnapshot(client, profileSnapshot);
  for (const screen of screens) {
    await navigateAndWait(client, `${appUrl}${screen.path}`);
    capturedPaths.push(await capture(client, screen.name));
  }

  for (const stage of [
    { index: 0, wait: "Stage 1 of 5", name: "07-onboarding-stage-1-welcome" },
    { index: 1, wait: "Stage 2 of 5", name: "08-onboarding-stage-2-about-you" },
    { index: 2, wait: "Stage 3 of 5", name: "09-onboarding-stage-3-meeting-comfort" },
    { index: 3, wait: "Stage 4 of 5", name: "10-onboarding-stage-4-privacy" },
    { index: 4, wait: "Stage 5 of 5", name: "11-onboarding-stage-5-review" },
  ]) {
    await setSnapshot(client, onboardingSnapshot);
    await navigateAndWait(client, `${appUrl}/onboarding?stage=${stage.index}`);
    await waitForText(client, stage.wait);
    capturedPaths.push(await capture(client, stage.name));
  }

  client.close();
} finally {
  edge.kill();
  await removeProfileDir();
}

console.log(capturedPaths.join("\n"));
