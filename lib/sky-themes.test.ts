import { describe, expect, it } from "vitest";

import {
  defaultSkyThemeId,
  getSkyTheme,
  getSkyThemeMode,
  normalizeSkyThemeId,
  skyThemes,
} from "./sky-themes";

describe("Sky Themes", () => {
  it("keeps Default NSN first and includes the curated theme set", () => {
    expect(skyThemes.map((theme) => theme.id)).toEqual([
      "default",
      "sunset",
      "night-sky",
      "soft-clouds",
      "sunrise",
      "starlight",
      "moonlight",
    ]);
    expect(skyThemes[0]).toMatchObject({ id: defaultSkyThemeId, label: "Default NSN" });
  });

  it("normalizes unknown or missing theme IDs back to Default NSN", () => {
    expect(normalizeSkyThemeId("sunset")).toBe("sunset");
    expect(normalizeSkyThemeId("Night Sky")).toBe(defaultSkyThemeId);
    expect(normalizeSkyThemeId("busy-wallpaper")).toBe(defaultSkyThemeId);
    expect(normalizeSkyThemeId(undefined)).toBe(defaultSkyThemeId);
  });

  it("keeps light mode accents pale and dark mode accents distinct", () => {
    const sunset = getSkyTheme("sunset");

    expect(getSkyThemeMode(sunset, false).surfaceTint).toBe("#FFF7F1");
    expect(getSkyThemeMode(sunset, true).surfaceTint).toBe("#2A1722");
    expect(sunset.description).toContain("gentle");
  });
});
