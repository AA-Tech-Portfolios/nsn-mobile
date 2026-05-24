import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

async function loadEnv(overrides: Record<string, string | undefined>) {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV, ...overrides };
  return import("./env");
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});

describe("ENV JWT_SECRET validation", () => {
  it("fails startup in production when JWT_SECRET is missing", async () => {
    await expect(loadEnv({ NODE_ENV: "production", JWT_SECRET: "" })).rejects.toThrow(
      /JWT_SECRET/,
    );
  });

  it("fails startup in preview when JWT_SECRET is too short", async () => {
    await expect(loadEnv({ NODE_ENV: "preview", JWT_SECRET: "short-secret" })).rejects.toThrow(
      /at least 32/,
    );
  });

  it("allows a clearly labelled local fallback in development", async () => {
    const { ENV } = await loadEnv({ NODE_ENV: "development", JWT_SECRET: "" });

    expect(ENV.cookieSecret).toBe("nsn-mobile-local-development-jwt-secret-only");
  });

  it("allows a clearly labelled local fallback in test", async () => {
    const { ENV } = await loadEnv({ NODE_ENV: "test", JWT_SECRET: "" });

    expect(ENV.cookieSecret).toBe("nsn-mobile-local-development-jwt-secret-only");
  });
});
