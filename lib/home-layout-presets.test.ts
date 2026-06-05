import { describe, expect, it } from "vitest";

import {
  getHomeFitToScreenPreset,
  getHomeLayoutPreset,
  homeLayoutPreferenceRoles,
  homeLayoutSectionCoverage,
  shouldUseHomeFitToScreen,
} from "./home-layout-presets";

describe("home layout presets", () => {
  it("keeps Primary view and Layout comfort responsible for different decisions", () => {
    expect(homeLayoutPreferenceRoles.primaryView).toContain("which Home sections appear");
    expect(homeLayoutPreferenceRoles.layoutComfort).toContain("density");
    expect(homeLayoutPreferenceRoles.fitToScreen).toContain("current screen size");
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

  it("uses readable, equal event thumbnail dimensions for each density", () => {
    const compact = getHomeLayoutPreset("Compact");
    const comfortable = getHomeLayoutPreset("Comfortable");
    const spacious = getHomeLayoutPreset("Spacious");

    expect(compact.eventImageWidth).toBe(compact.eventImageHeight);
    expect(comfortable.eventImageWidth).toBe(comfortable.eventImageHeight);
    expect(spacious.eventImageWidth).toBe(spacious.eventImageHeight);
    expect(compact.eventImageWidth).toBeGreaterThanOrEqual(90);
    expect(compact.eventImageWidth).toBeLessThan(comfortable.eventImageWidth);
    expect(comfortable.eventImageWidth).toBeLessThan(spacious.eventImageWidth);
  });

  it("keeps scroll content clear of the taller bottom tabs", () => {
    expect(getHomeLayoutPreset("Compact").bottomPadding).toBeGreaterThanOrEqual(132);
    expect(getHomeLayoutPreset("Comfortable").bottomPadding).toBeGreaterThanOrEqual(148);
    expect(getHomeLayoutPreset("Spacious").bottomPadding).toBeGreaterThanOrEqual(164);
  });

  it("keeps compact mobile event cards readable without taking over the feed", () => {
    const compact = getHomeLayoutPreset("Compact");

    expect(compact.eventCardMinHeight).toBeGreaterThanOrEqual(118);
    expect(compact.eventImageWidth).toBeLessThanOrEqual(92);
    expect(compact.eventImageHeight).toBe(compact.eventImageWidth);
    expect(compact.eventDescriptionLines).toBeGreaterThanOrEqual(2);
  });

  it("only enables Fit to screen for desktop-sized constrained or wide browser windows", () => {
    expect(shouldUseHomeFitToScreen({ enabled: false, viewportWidth: 1280, viewportHeight: 760 })).toBe(false);
    expect(shouldUseHomeFitToScreen({ enabled: true, viewportWidth: 390, viewportHeight: 760 })).toBe(false);
    expect(shouldUseHomeFitToScreen({ enabled: true, viewportWidth: 1280, viewportHeight: 760 })).toBe(true);
    expect(shouldUseHomeFitToScreen({ enabled: true, viewportWidth: 1700, viewportHeight: 940 })).toBe(true);
  });

  it("reduces spacing and card sizing without shrinking tap targets like browser zoom", () => {
    const base = getHomeLayoutPreset("Comfortable");
    const fitted = getHomeFitToScreenPreset("Comfortable", { enabled: true, viewportWidth: 1280, viewportHeight: 760 });

    expect(fitted.sectionGap).toBeLessThan(base.sectionGap);
    expect(fitted.cardPadding).toBeLessThan(base.cardPadding);
    expect(fitted.mapHeight).toBeLessThan(base.mapHeight);
    expect(fitted.bottomPadding).toBeLessThan(base.bottomPadding);
    expect(fitted.tapTarget).toBe(base.tapTarget);
    expect(fitted.eventDescriptionLines).toBe(2);
    expect(fitted.bottomPadding).toBeLessThanOrEqual(20);
  });

  it("returns the original density preset when Fit to screen is off", () => {
    expect(getHomeFitToScreenPreset("Spacious", { enabled: false, viewportWidth: 1280, viewportHeight: 760 })).toEqual(getHomeLayoutPreset("Spacious"));
  });
});
