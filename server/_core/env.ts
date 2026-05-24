const LOCAL_JWT_SECRET = "nsn-mobile-local-development-jwt-secret-only";
const LOCAL_NODE_ENVS = new Set(["development", "test"]);

function getCookieSecret() {
  const nodeEnv = process.env.NODE_ENV ?? "";
  const secret = process.env.JWT_SECRET;

  if (secret && new TextEncoder().encode(secret).length >= 32) {
    return secret;
  }

  if (LOCAL_NODE_ENVS.has(nodeEnv)) {
    return LOCAL_JWT_SECRET;
  }

  throw new Error(
    "JWT_SECRET is required in production-like environments and must be at least 32 bytes.",
  );
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: getCookieSecret(),
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
