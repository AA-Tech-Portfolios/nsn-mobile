import { describe, expect, it } from "vitest";

import { getUserPreferenceRowDescription, profileSupportRowMetadata, userPreferenceRowMetadata } from "./profile-menu-row-metadata";

describe("profile menu row metadata", () => {
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
    expect(profileSupportRowMetadata.icon).toBe("help");
  });

  it("can switch preference row copy between simple and detailed text", () => {
    expect(getUserPreferenceRowDescription("comfort", "Simple")).toBe("Visibility, trust, and meeting comfort.");
    expect(getUserPreferenceRowDescription("comfort", "Detailed")).toBe(
      "Visibility, social energy, communication, group size, verification, and photo comfort."
    );
    expect(getUserPreferenceRowDescription("personality", "Simple")).toBe("Optional human context.");
    expect(getUserPreferenceRowDescription("food", "Simple")).toBe("Food, drinks, and dietary comfort.");
  });
});
