import { describe, expect, it } from "vitest";

import { communitySupportResourceCategories, communitySupportResourceFutureNotes } from "./community-support-resources";

describe("community support resource prototype metadata", () => {
  it("keeps resource categories gentle, broad, and prototype-only", () => {
    expect(communitySupportResourceCategories.map((category) => category.title)).toEqual([
      "Life Skills",
      "Community & Connection",
      "Accessibility & Disability Support",
      "Animals & Wildlife",
      "Crisis & Emergency Support",
    ]);

    expect(communitySupportResourceCategories.every((category) => category.badge === "Alpha demo")).toBe(true);
    expect(communitySupportResourceCategories.every((category) => category.resources.every((resource) => resource.badge === "Demo placeholder"))).toBe(true);
  });

  it("states clear support boundaries without sounding clinical or verified", () => {
    const combined = communitySupportResourceCategories
      .flatMap((category) => [
        category.title,
        category.description,
        category.boundaryNote,
        ...category.resources.flatMap((resource) => [resource.title, resource.copy, resource.badge]),
      ])
      .join(" ")
      .toLowerCase();

    expect(combined).toContain("prototype");
    expect(combined).toContain("not verified");
    expect(combined).not.toMatch(/therapy platform|diagnosis|professional advice|verified service|case management|social-work replacement|live monitoring|guaranteed/);
  });

  it("separates future support ideas from the current alpha scope", () => {
    expect(communitySupportResourceFutureNotes).toEqual([
      "Localized resource discovery",
      "Regional/community partnerships",
      "Accessibility preferences",
      "Volunteer/community initiatives",
      "Optional resource recommendations",
      "Support personalization",
      "Multilingual accessibility support",
    ]);
  });
});
