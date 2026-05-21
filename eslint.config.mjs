// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from "eslint/config";
import expoConfig from "eslint-config-expo/flat.js";

export default defineConfig([
  expoConfig,
  {
    ignores: [
      ".expo/",
      ".pnpm-store/",
      ".vscode/",
      "android/",
      "coverage/",
      "dist/",
      "ios/",
      "node_modules/",
      "web-build/",
    ],
  },
  {
    files: [
      "app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "hooks/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
      "shared/**/*.{ts,tsx}",
    ],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);
