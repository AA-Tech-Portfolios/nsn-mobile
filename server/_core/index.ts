import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import type { RequestHandler } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";

const LOCAL_CORS_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function normalizeCorsOrigin(origin: string) {
  try {
    return new URL(origin).origin;
  } catch {
    return null;
  }
}

function parseAllowedOrigins() {
  return new Set(
    (process.env.CORS_ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
      .map(normalizeCorsOrigin)
      .filter((origin): origin is string => Boolean(origin)),
  );
}

function isLocalDevOrigin(origin: string) {
  if (process.env.NODE_ENV !== "development") return false;

  try {
    const url = new URL(origin);
    return LOCAL_CORS_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

function isAllowedCorsOrigin(origin: string) {
  const normalizedOrigin = normalizeCorsOrigin(origin);
  if (!normalizedOrigin) return false;

  return parseAllowedOrigins().has(normalizedOrigin) || isLocalDevOrigin(normalizedOrigin);
}

export function createCorsMiddleware(): RequestHandler {
  return (req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigin =
      typeof origin === "string" && isAllowedCorsOrigin(origin) ? normalizeCorsOrigin(origin) : null;

    if (allowedOrigin) {
      res.header("Access-Control-Allow-Origin", allowedOrigin);
      res.header("Access-Control-Allow-Credentials", "true");
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  };
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(createCorsMiddleware());

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer().catch(console.error);
}
