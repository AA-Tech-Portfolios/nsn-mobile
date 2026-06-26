import { describe, expect, it } from "vitest";

import {
  appearanceLayoutControlMetadata,
  getUserPreferenceRows,
  getUserPreferenceRowDescription,
  profileAppInfoDedication,
  profileAppInfoTransparencyNote,
  profileReleaseOutlook,
  profileOptionGroups,
  profileResourceSupportRowMetadata,
  profileSupportRowMetadata,
  userPreferenceRowMetadata,
} from "./profile-menu-row-metadata";

describe("profile menu row metadata", () => {
  it("defines the Profile User Options drawer around clear top-level areas", () => {
    expect(profileOptionGroups.map((group) => group.title)).toEqual([
      "Profile",
      "Preferences",
      "Appearance & Layout",
      "Safety & Support",
      "App Settings",
    ]);
    expect(profileOptionGroups.map((group) => group.id)).toEqual([
      "profile",
      "preferences",
      "appearanceLayout",
      "safetySupport",
      "appSettings",
    ]);

    const helperCopy = profileOptionGroups.flatMap((group) => [group.description, group.helperCopy]).join(" ");

    expect(helperCopy).toContain("local-only");
    expect(helperCopy.toLowerCase()).not.toMatch(/guarantee|verified|verification|moderation|production pairing|live safety support|host tracking enabled/);
  });

  it("keeps Appearance & Layout controls distinct without deep nesting", () => {
    expect(appearanceLayoutControlMetadata.map((item) => item.title)).toEqual([
      "Home & event cards",
      "Profile detail level",
      "Profile width",
    ]);
    expect(appearanceLayoutControlMetadata.map((item) => item.scope)).toEqual([
      "Home and Event Details",
      "Profile",
      "Profile",
    ]);

    const combined = appearanceLayoutControlMetadata.flatMap((item) => [item.title, item.description, item.previewCopy]).join(" ");

    expect(combined).toContain("local-only");
    expect(combined).not.toMatch(/Display & Layout|Width Settings|Profile Layout/);
    expect(combined.toLowerCase()).not.toMatch(/matching quality|verification|moderation|emergency|ai agent/);
  });

  it("keeps every user preference category row visually complete", () => {
    for (const row of userPreferenceRowMetadata) {
      expect(row.icon, row.title).toBeTruthy();
      expect(row.title).toBeTruthy();
      expect(row.description).toBeTruthy();
      expect(row.badgeKind).toBeTruthy();
      expect(row.chevron).toBe(true);
    }
  });

  it("sets explicit icons for preference and support rows testers look for", () => {
    expect(userPreferenceRowMetadata.find((row) => row.key === "transport")?.icon).toBe("transport");
    expect(userPreferenceRowMetadata.find((row) => row.key === "personality")?.icon).toBe("person.fill");
    expect(userPreferenceRowMetadata.find((row) => row.key === "contact")?.icon).toBe("contact");
    expect(userPreferenceRowMetadata.find((row) => row.key === "location")?.icon).toBe("location");
    expect(profileSupportRowMetadata.icon).toBe("guide");
    expect(profileResourceSupportRowMetadata.icon).toBe("heart");
    expect(profileResourceSupportRowMetadata.title).toBe("Support & Resources");
    expect(profileResourceSupportRowMetadata.badge).toBe("Demo");
  });

  it("can switch preference row copy between simple and detailed text", () => {
    expect(getUserPreferenceRowDescription("comfort", "Simple")).toBe("Privacy, visibility, and meeting comfort.");
    expect(getUserPreferenceRowDescription("comfort", "Detailed")).toBe(
      "Privacy, visibility, social energy, communication, group size, and photo comfort."
    );
    expect(getUserPreferenceRowDescription("personality", "Simple")).toBe("Optional human context.");
    expect(getUserPreferenceRowDescription("food", "Simple")).toBe("Food, drinks, and dietary comfort.");
  });

  it("supports a future alphabetical preference category order without changing the grouped default", () => {
    expect(getUserPreferenceRows().map((row) => row.key)).toEqual(userPreferenceRowMetadata.map((row) => row.key));
    expect(getUserPreferenceRows().every((row) => row.groupId === "preferences")).toBe(true);
    expect(getUserPreferenceRows("Alphabetical").map((row) => row.title)).toEqual([
      "Calendar & Cultural Moments",
      "Contact Preference",
      "Food & Beverage",
      "Hobbies & Interests",
      "Location Preference",
      "Personality & Presence",
      "Privacy & Comfort",
      "Transportation Method",
      "Work, Study & Life Context",
    ]);
  });

  it("keeps the App Info dedication warm and understated", () => {
    expect(profileAppInfoDedication.title).toBe("In loving memory");
    expect(profileAppInfoDedication.copy).toContain("In loving memory of my grandmother.");
    expect(profileAppInfoDedication.copy).toContain("care, belonging, and meaningful human connection");
    expect(profileAppInfoDedication.placement).toBe("appInfoBottom");
    expect(`${profileAppInfoDedication.title} ${profileAppInfoDedication.copy}`.toLowerCase()).not.toMatch(
      /hero|dramatic|spotlight|animated|flashy/
    );
  });

  it("keeps the App Info AI transparency note neutral and factual", () => {
    const visibleCopy = `${profileAppInfoTransparencyNote.title} ${profileAppInfoTransparencyNote.copy}`;

    expect(profileAppInfoTransparencyNote.title).toBe("How NSN was built");
    expect(profileAppInfoTransparencyNote.copy).toContain("AI-powered software development tools");
    expect(profileAppInfoTransparencyNote.copy).toContain("Product decisions");
    expect(profileAppInfoTransparencyNote.copy).toContain("remain the responsibility of the creator");
    expect(profileAppInfoTransparencyNote.placement).toBe("appInfo");
    expect(visibleCopy.toLowerCase()).not.toMatch(/warning|alert|apology|replaced by ai|autonomous ai|promotion|powered by ai magic/);
  });

  it("frames the release outlook as an estimated beta path, not a launch promise", () => {
    const visibleCopy = [
      profileReleaseOutlook.title,
      profileReleaseOutlook.body,
      ...profileReleaseOutlook.stages.flatMap((stage) => [stage.label, stage.title, stage.copy]),
    ].join(" ");

    expect(profileReleaseOutlook.title).toBe("Release outlook");
    expect(profileReleaseOutlook.body).toContain("alpha prototype");
    expect(profileReleaseOutlook.body).toContain("small local beta");
    expect(profileReleaseOutlook.body).toContain("rough estimate is 6-12 months");
    expect(profileReleaseOutlook.stages.map((stage) => `${stage.label} - ${stage.title}`)).toEqual([
      "Now - Alpha prototype",
      "Next - Closed local alpha",
      "Later - Small public beta",
      "Future - Broader identity",
    ]);
    expect(visibleCopy).toContain("community hosts");
    expect(visibleCopy).toContain("real-world meetup feedback");
    expect(visibleCopy.toLowerCase()).not.toMatch(/launching in 1 year|guaranteed|guarantee|fixed release date|promised launch/);
  });
});
