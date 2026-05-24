import { afterEach, describe, expect, it, vi } from "vitest";
import type { User } from "../../drizzle/schema";
import { createStorageProxyHandler } from "./storageProxy";

const ORIGINAL_FETCH = globalThis.fetch;

const user: User = {
  id: 42,
  openId: "user-42",
  name: "Private User",
  email: "user@example.com",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createResponse() {
  return {
    statusCode: 200,
    sent: undefined as string | undefined,
    redirected: undefined as { status: number; url: string } | undefined,
    headers: new Map<string, string>(),
    status(statusCode: number) {
      this.statusCode = statusCode;
      return this;
    },
    send(body: string) {
      this.sent = body;
      return this;
    },
    set(name: string, value: string) {
      this.headers.set(name, value);
      return this;
    },
    redirect(status: number, url: string) {
      this.redirected = { status, url };
      return this;
    },
  };
}

function createRequest(key: string) {
  return {
    params: { "0": key },
    headers: {},
  };
}

function mockFetch() {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    json: async () => ({ url: "https://signed.example.com/object" }),
  })) as unknown as typeof fetch;
  globalThis.fetch = fetchMock;
  return fetchMock;
}

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  vi.restoreAllMocks();
});

describe("createStorageProxyHandler", () => {
  it("rejects unauthenticated private object requests", async () => {
    const fetchMock = mockFetch();
    const handler = createStorageProxyHandler({
      forgeApiUrl: "https://forge.example.com",
      forgeApiKey: "forge-key",
      authenticateRequest: async () => null,
    });
    const res = createResponse();

    await handler(createRequest("users/42/photo.png") as never, res as never, vi.fn());

    expect(res.statusCode).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects private object requests for the wrong owner", async () => {
    const fetchMock = mockFetch();
    const handler = createStorageProxyHandler({
      forgeApiUrl: "https://forge.example.com",
      forgeApiKey: "forge-key",
      authenticateRequest: async () => user,
    });
    const res = createResponse();

    await handler(createRequest("users/7/photo.png") as never, res as never, vi.fn());

    expect(res.statusCode).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("allows unauthenticated public objects under the public prefix", async () => {
    const fetchMock = mockFetch();
    const handler = createStorageProxyHandler({
      forgeApiUrl: "https://forge.example.com",
      forgeApiKey: "forge-key",
      authenticateRequest: async () => null,
    });
    const res = createResponse();

    await handler(createRequest("public/events/banner.png") as never, res as never, vi.fn());

    expect(res.redirected).toEqual({ status: 307, url: "https://signed.example.com/object" });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("allows private object requests for the owning user", async () => {
    const fetchMock = mockFetch();
    const handler = createStorageProxyHandler({
      forgeApiUrl: "https://forge.example.com",
      forgeApiKey: "forge-key",
      authenticateRequest: async () => user,
    });
    const res = createResponse();

    await handler(createRequest("users/42/photo.png") as never, res as never, vi.fn());

    expect(res.redirected).toEqual({ status: 307, url: "https://signed.example.com/object" });
    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
