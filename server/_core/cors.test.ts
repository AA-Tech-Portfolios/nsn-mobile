import { afterEach, describe, expect, it, vi } from "vitest";
import { createCorsMiddleware } from "./index";

const ORIGINAL_ENV = { ...process.env };

function createRequest(origin?: string, method = "GET") {
  return {
    method,
    headers: origin ? { origin } : {},
  };
}

function createResponse() {
  const headers = new Map<string, string>();

  return {
    headers,
    statusCode: undefined as number | undefined,
    header(name: string, value: string) {
      headers.set(name, value);
      return this;
    },
    sendStatus(status: number) {
      this.statusCode = status;
      return this;
    },
  };
}

async function runCors(origin?: string, method = "GET") {
  const middleware = createCorsMiddleware();
  const req = createRequest(origin, method);
  const res = createResponse();
  const next = vi.fn();

  middleware(req as never, res as never, next);

  return { res, next };
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
});

describe("createCorsMiddleware", () => {
  it("sets credentialed CORS headers for an explicitly allowed origin", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "production",
      CORS_ALLOWED_ORIGINS: "https://app.example.com, https://preview.example.com",
    };

    const { res, next } = await runCors("https://preview.example.com");

    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("https://preview.example.com");
    expect(res.headers.get("Access-Control-Allow-Credentials")).toBe("true");
    expect(next).toHaveBeenCalledOnce();
  });

  it("does not set origin or credential headers for a blocked origin", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "production",
      CORS_ALLOWED_ORIGINS: "https://app.example.com",
    };

    const { res, next } = await runCors("https://evil.example.com");

    expect(res.headers.get("Access-Control-Allow-Origin")).toBeUndefined();
    expect(res.headers.get("Access-Control-Allow-Credentials")).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });

  it("does not throw or set credentialed headers for malformed origin values", async () => {
    process.env = {
      ...ORIGINAL_ENV,
      NODE_ENV: "production",
      CORS_ALLOWED_ORIGINS: "https://app.example.com",
    };

    const { res, next } = await runCors("not a url");

    expect(res.headers.get("Access-Control-Allow-Origin")).toBeUndefined();
    expect(res.headers.get("Access-Control-Allow-Credentials")).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });

  it("permits localhost origins only in development", async () => {
    process.env = { ...ORIGINAL_ENV, NODE_ENV: "development", CORS_ALLOWED_ORIGINS: "" };

    const { res, next } = await runCors("http://localhost:8081");

    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:8081");
    expect(res.headers.get("Access-Control-Allow-Credentials")).toBe("true");
    expect(next).toHaveBeenCalledOnce();
  });
});
