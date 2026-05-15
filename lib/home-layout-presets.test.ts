import { describe, expect, it } from "vitest";

import {
  getHomeLayoutPreset,
  homeLayoutPreferenceRoles,
  homeLayoutSectionCoverage,
} from "./home-layout-presets";

describe("home layout presets", () => {
  it("keeps Primary view and Layout comfort responsible for different decisions", () => {
    expect(homeLayoutPreferenceRoles.primaryView).toContain("which Home sections appear");
    expect(homeLayoutPreferenceRoles.layoutComfort).toContain("density");
  });

  it("covers the Home sections and small controls that should share density rules", () => {
    expect(homeLayoutSectionCoverage).toEqual([
      "alphaTesterGuide",
      "weatherUpdate",
      "todayCard",
      "northShoreMap",
      "dayEvents",
      "nightEvents",
      "recommendedEvents",
      "searchNsn",
      "noiseGuide",
      "sectionVisibilityRows",
      "eventCards",
      "sectionHeaders",
      "chipsTagsAndSmallActions",
    ]);
  });

  it("orders spacing, card size, map height, and grid gap from compact to spacious", () => {
    const compact = getHomeLayoutPreset("Compact");
    const comfortable = getHomeLayoutPreset("Comfortable");
    const spacious = getHomeLayoutPreset("Spacious");

    expect(compact.sectionGap).toBeLessThan(comfortable.sectionGap);
    expect(comfortable.sectionGap).toBeLessThan(spacious.sectionGap);
    expect(compact.cardPadding).toBeLessThan(comfortable.cardPadding);
    expect(comfortable.cardPadding).toBeLessThan(spacious.cardPadding);
    expect(compact.cardMinHeight).toBeLessThan(comfortable.cardMinHeight);
    expect(comfortable.cardMinHeight).toBeLessThan(spacious.cardMinHeight);
    expect(compact.mapHeight).toBeLessThan(comfortable.mapHeight);
    expect(comfortable.mapHeight).toBeLessThan(spacious.mapHeight);
    expect(compact.desktopGridGap).toBeLessThan(comfortable.desktopGridGap);
    expect(comfortable.desktopGridGap).toBeLessThan(spacious.desktopGridGap);
  });

  it("keeps mobile tap targets reachable while still changing density", () => {
    const compact = getHomeLayoutPreset("Compact");
    const comfortable = getHomeLayoutPreset("Comfortable");
    const spacious = getHomeLayoutPreset("Spacious");

    expect(compact.tapTarget).toBeGreaterThanOrEqual(40);
    expect(comfortable.tapTarget).toBeGreaterThanOrEqual(44);
    expect(spacious.tapTarget).toBeGreaterThanOrEqual(48);
    expect(compact.tapTarget).toBeLessThan(spacious.tapTarget);
  });
});
