import type { Express, RequestHandler } from "express";
import type { User } from "../../drizzle/schema";
import { ENV } from "./env";
import { sdk } from "./sdk";

type StorageProxyOptions = {
  forgeApiUrl: string;
  forgeApiKey: string;
  authenticateRequest: (req: Parameters<RequestHandler>[0]) => Promise<User | null>;
};

function decodeStorageKey(rawKey: string) {
  let key = rawKey;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const decoded = decodeURIComponent(key);
      if (decoded === key) return decoded;
      key = decoded;
    } catch {
      return null;
    }
  }

  return key;
}

function normalizeStorageKey(rawKey: string | undefined) {
  if (!rawKey) return null;

  const decoded = decodeStorageKey(rawKey);
  if (!decoded || decoded !== decoded.trim() || decoded.startsWith("/") || decoded.includes("\\")) {
    return null;
  }

  const parts = decoded.split("/");
  if (parts.some((part) => !part || part === "." || part === "..")) {
    return null;
  }

  if (parts[0] === "public" && parts.length > 1) {
    return { key: parts.join("/"), visibility: "public" as const };
  }

  if (parts[0] === "generated" && parts.length > 1) {
    return { key: parts.join("/"), visibility: "public" as const };
  }

  if (parts[0] === "users" && /^\d+$/.test(parts[1] ?? "") && parts.length > 2) {
    return { key: parts.join("/"), visibility: "private" as const, ownerId: Number(parts[1]) };
  }

  return null;
}

async function getAuthenticatedUser(
  req: Parameters<RequestHandler>[0],
  authenticateRequest: StorageProxyOptions["authenticateRequest"],
) {
  try {
    return await authenticateRequest(req);
  } catch {
    return null;
  }
}

export function createStorageProxyHandler(options: StorageProxyOptions): RequestHandler {
  return async (req, res) => {
    const normalized = normalizeStorageKey((req.params as Record<string, string>)["0"]);
    if (!normalized) {
      res.status(400).send("Invalid storage key");
      return;
    }

    if (!options.forgeApiUrl || !options.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    if (normalized.visibility === "private") {
      const user = await getAuthenticatedUser(req, options.authenticateRequest);
      if (!user) {
        res.status(401).send("Authentication required");
        return;
      }
      if (user.id !== normalized.ownerId) {
        res.status(403).send("Storage object not accessible");
        return;
      }
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        options.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", normalized.key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${options.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  };
}

export function registerStorageProxy(app: Express) {
  app.get(
    "/manus-storage/*",
    createStorageProxyHandler({
      forgeApiUrl: ENV.forgeApiUrl,
      forgeApiKey: ENV.forgeApiKey,
      authenticateRequest: (req) => sdk.authenticateRequest(req),
    }),
  );
}
