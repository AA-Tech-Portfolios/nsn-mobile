import { execFileSync } from "node:child_process";

import { describe, expect, it } from "vitest";

describe("Expo app config", () => {
  it("can be evaluated by the Expo config loader", () => {
    const output = execFileSync(
      process.execPath,
      ["node_modules/expo/bin/cli", "config", "--type", "public", "--json"],
      {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      },
    );

    const config = JSON.parse(output) as { name?: string; slug?: string };

    expect(config.name).toBe("SofterHello");
    expect(config.slug).toBe("nsn-mobile");
  });
});
