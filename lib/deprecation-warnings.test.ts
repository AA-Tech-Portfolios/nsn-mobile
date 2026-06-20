import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoots = ["app", "components", "lib"];
const sourceExtensionPattern = /\.[jt]sx?$/;

const collectSourceFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return collectSourceFiles(fullPath);
    }

    if (!sourceExtensionPattern.test(fullPath) || /\.test\.[jt]sx?$/.test(fullPath)) {
      return [];
    }

    return [fullPath];
  });

const appSourceFiles = sourceRoots.flatMap((root) => collectSourceFiles(path.join(repoRoot, root)));

const findFilesContaining = (pattern: RegExp) =>
  appSourceFiles
    .filter((filePath) => pattern.test(readFileSync(filePath, "utf8")))
    .map((filePath) => path.relative(repoRoot, filePath));

describe("runtime deprecation warning guards", () => {
  it("does not use the deprecated Expo image picker media type options enum", () => {
    expect(findFilesContaining(new RegExp(["MediaType", "Options"].join("")))).toEqual([]);
  });

  it("keeps Expo Router calls on string hrefs so React Navigation does not receive object-form navigate calls", () => {
    expect(findFilesContaining(/\brouter\.(push|replace|navigate)\s*\(\s*\{/)).toEqual([]);
  });
});
