import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
const publicEnvMappings = {
  VITE_APP_ID: "EXPO_PUBLIC_APP_ID",
  VITE_OAUTH_PORTAL_URL: "EXPO_PUBLIC_OAUTH_PORTAL_URL",
  OAUTH_SERVER_URL: "EXPO_PUBLIC_OAUTH_SERVER_URL",
  OWNER_OPEN_ID: "EXPO_PUBLIC_OWNER_OPEN_ID",
  OWNER_NAME: "EXPO_PUBLIC_OWNER_NAME",
};

function loadDotEnvWithoutOverridingShell() {
  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    // Keep parsing intentionally small: this loader only handles KEY=value pairs.
    const match = line.match(/^([^=]+)=(.*)$/);

    if (!match) {
      continue;
    }

    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function exposePlatformEnvToExpo() {
  for (const [systemVar, expoVar] of Object.entries(publicEnvMappings)) {
    if (process.env[systemVar] && !process.env[expoVar]) {
      process.env[expoVar] = process.env[systemVar];
    }
  }
}

// Shell/platform variables win over .env so deployed values are never replaced by local placeholders.
loadDotEnvWithoutOverridingShell();
exposePlatformEnvToExpo();
