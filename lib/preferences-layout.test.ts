import { describe, expect, it } from "vitest";

import {
  formatPreferenceCategoryChipLabel,
  formatPreferenceChipLabel,
  formatSelectedPreferenceChipLabel,
  getPreferenceCategoryIcon,
  getPreferenceChipIcon,
  getSettingsBackTarget,
  getSettingsPreferenceLayout,
} from "./preferences-layout";

describe("settings and preference layout", () => {
  it("stacks settings cards and options on mobile", () => {
    const layout = getSettingsPreferenceLayout(390, "Comfortable");

    expect(layout.isDesktop).toBe(false);
    expect(layout.sectionCard).toMatchObject({ flexBasis: "100%", minWidth: "100%" });
    expect(layout.optionCard).toMatchObject({ flexBasis: "100%", minWidth: "100%" });
    expect(layout.fullWidthCard).toMatchObject({ flexBasis: "100%", minWidth: "100%" });
  });

  it("uses responsive desktop card and option grids", () => {
    const layout = getSettingsPreferenceLayout(1180, "Comfortable");

    expect(layout.isDesktop).toBe(true);
    expect(layout.sectionCard).toMatchObject({ flexGrow: 1, flexShrink: 1, flexBasis: 320, minWidth: 320 });
    expect(layout.optionCard).toMatchObject({ flexGrow: 1, flexShrink: 1, flexBasis: 160, minWidth: 160 });
    expect(layout.fullWidthCard).toMatchObject({ flexBasis: "100%", minWidth: "100%" });
  });

  it("scales spacing and tap targets with the selected density", () => {
    const compact = getSettingsPreferenceLayout(1180, "Compact");
    const comfortable = getSettingsPreferenceLayout(1180, "Comfortable");
    const spacious = getSettingsPreferenceLayout(1180, "Spacious");

    expect(compact.sectionGap).toBeLessThan(comfortable.sectionGap);
    expect(comfortable.sectionGap).toBeLessThan(spacious.sectionGap);
    expect(compact.cardPadding).toBeLessThan(comfortable.cardPadding);
    expect(comfortable.cardPadding).toBeLessThan(spacious.cardPadding);
    expect(compact.minTapTarget).toBeLessThan(spacious.minTapTarget);
  });
});

describe("preference chip metadata", () => {
  it("centralizes preference category icons", () => {
    expect(getPreferenceCategoryIcon("overview")).toBe("👤");
    expect(getPreferenceCategoryIcon("comfort")).toBe("🛡️");
    expect(getPreferenceCategoryIcon("background")).toBe("🎓");
    expect(getPreferenceCategoryIcon("calendar")).toBe("🗓️");
    expect(getPreferenceCategoryIcon("food")).toBe("🍽️");
    expect(getPreferenceCategoryIcon("interests")).toBe("🎨");
    expect(getPreferenceCategoryIcon("transport")).toBe("🚆");
    expect(getPreferenceCategoryIcon("contact")).toBe("💬");
    expect(getPreferenceCategoryIcon("location")).toBe("📍");
    expect(formatPreferenceCategoryChipLabel("Food & beverage", "food")).toBe("🍽️ Food & beverage");
  });

  it("returns common calm icons for repeated preference labels", () => {
    expect(getPreferenceChipIcon("Coffee")).toBe("☕");
    expect(getPreferenceChipIcon("Movies")).toBe("🎬");
    expect(getPreferenceChipIcon("Board games")).toBe("🎲");
    expect(getPreferenceChipIcon("Walking")).toBe("🚶");
    expect(getPreferenceChipIcon("Libraries")).toBe("📚");
    expect(getPreferenceChipIcon("Vegetarian-friendly")).toBe("🥗");
    expect(getPreferenceChipIcon("Japanese")).toBe("🇯🇵");
    expect(getPreferenceChipIcon("Australian")).toBe("🇦🇺");
    expect(getPreferenceChipIcon("Chicken")).toBe("🍗");
    expect(getPreferenceChipIcon("Beef")).toBe("🥩");
    expect(getPreferenceChipIcon("Sandwiches")).toBe("🥪");
    expect(getPreferenceChipIcon("Tea")).toBe("🍵");
    expect(getPreferenceChipIcon("Ice cream")).toBe("🍦");
    expect(getPreferenceChipIcon("Pizza")).toBe("🍕");
    expect(getPreferenceChipIcon("Burgers")).toBe("🍔");
    expect(getPreferenceChipIcon("Pasta")).toBe("🍝");
    expect(getPreferenceChipIcon("Food")).toBe("🍽️");
    expect(getPreferenceChipIcon("Pets")).toBe("🐾");
    expect(getPreferenceChipIcon("Games")).toBe("🎮");
    expect(getPreferenceChipIcon("Music")).toBe("🎧");
    expect(getPreferenceChipIcon("Reading")).toBe("📚");
    expect(getPreferenceChipIcon("Live music")).toBe("🎶");
    expect(getPreferenceChipIcon("Beach days")).toBe("🌊");
    expect(getPreferenceChipIcon("Vegetarian")).toBe("🥗");
    expect(getPreferenceChipIcon("Vegan")).toBe("🌱");
    expect(getPreferenceChipIcon("Calm")).toBe("🌿");
    expect(getPreferenceChipIcon("Good listener")).toBe("💬");
    expect(getPreferenceChipIcon("Small groups")).toBe("🧑‍🤝‍🧑");
    expect(getPreferenceChipIcon("Public transport")).toBe("🚌");
    expect(getPreferenceChipIcon("Driving")).toBe("🚗");
    expect(getPreferenceChipIcon("Cycling")).toBe("🚲");
    expect(getPreferenceChipIcon("Rideshare")).toBe("🚕");
    expect(getPreferenceChipIcon("Prefer nearby only")).toBe("🏠");
    expect(getPreferenceChipIcon("In person")).toBe("👥");
    expect(getPreferenceChipIcon("Email")).toBe("✉️");
    expect(getPreferenceChipIcon("Text")).toBe("📱");
    expect(getPreferenceChipIcon("Phone")).toBe("📞");
    expect(getPreferenceChipIcon("Video")).toBe("🎥");
    expect(getPreferenceChipIcon("Low-message mode")).toBe("🔕");
    expect(getPreferenceChipIcon("Reminders only")).toBe("🕰️");
    expect(getPreferenceChipIcon("Hobbies")).toBe("🎨");
    expect(getPreferenceChipIcon("Transport")).toBe("🚆");
    expect(getPreferenceChipIcon("Contact")).toBe("💬");
    expect(getPreferenceChipIcon("Calendar & cultural moments")).toBe("🗓️");
  });

  it("keeps serious safety and privacy labels unplayful", () => {
    expect(getPreferenceChipIcon("Safety, privacy & consent details")).toBeUndefined();
    expect(getPreferenceChipIcon("Block & report")).toBeUndefined();
    expect(formatPreferenceChipLabel("Safety, privacy & consent details")).toBe("Safety, privacy & consent details");
  });

  it("formats labels without duplicating existing icons", () => {
    expect(formatPreferenceChipLabel("Coffee")).toBe("☕ Coffee");
    expect(formatPreferenceChipLabel("☕ Coffee")).toBe("☕ Coffee");
    expect(formatPreferenceChipLabel("Movies", "🎬")).toBe("🎬 Movies");
    expect(formatPreferenceChipLabel("🎬 Movies", "🎬")).toBe("🎬 Movies");
    expect(formatPreferenceChipLabel("Japanese", "🍣")).toBe("🇯🇵 Japanese");
    expect(formatPreferenceChipLabel("🍣 Japanese", "🇯🇵")).toBe("🍣 Japanese");
  });

  it("formats selected labels with one selected prefix and one icon", () => {
    expect(formatSelectedPreferenceChipLabel("Coffee")).toBe("Selected: ☕ Coffee");
    expect(formatSelectedPreferenceChipLabel("Selected: Coffee")).toBe("Selected: ☕ Coffee");
    expect(formatSelectedPreferenceChipLabel("☕ Coffee")).toBe("Selected: ☕ Coffee");
    expect(formatSelectedPreferenceChipLabel("Food & beverage", getPreferenceCategoryIcon("food"))).toBe("Selected: 🍽️ Food & beverage");
  });
});

describe("settings back navigation", () => {
  it("returns to Profile when opened from profile surfaces", () => {
    expect(getSettingsBackTarget("profile")).toEqual({ pathname: "/(tabs)/profile" });
    expect(getSettingsBackTarget("user-options")).toEqual({ pathname: "/(tabs)/profile", params: { menu: "options" } });
  });

  it("returns to another known source route when provided", () => {
    expect(getSettingsBackTarget("home")).toEqual({ pathname: "/(tabs)" });
    expect(getSettingsBackTarget("alpha-walkthrough")).toEqual({ pathname: "/(tabs)/alpha-walkthrough" });
    expect(getSettingsBackTarget("notifications")).toEqual({ pathname: "/(tabs)/notifications" });
  });

  it("falls back to Profile for direct visits or unknown sources", () => {
    expect(getSettingsBackTarget()).toEqual({ pathname: "/(tabs)/profile" });
    expect(getSettingsBackTarget("unknown")).toEqual({ pathname: "/(tabs)/profile" });
  });
});
