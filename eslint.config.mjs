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
      // eslint-config-expo 56 enables React Compiler lint rules by default.
      // NSN is not compiler-gated yet, so keep the existing hook safety rules
      // without turning the config update into a broad compiler migration.
      "react-hooks/config": "off",
      "react-hooks/error-boundaries": "off",
      "react-hooks/gating": "off",
      "react-hooks/globals": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/set-state-in-render": "off",
      "react-hooks/static-components": "off",
      "react-hooks/unsupported-syntax": "off",
      "react-hooks/use-memo": "off",
    },
  },
]);
