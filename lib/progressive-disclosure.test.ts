import { describe, expect, it } from "vitest";

import {
  getCalmDefaultOpenGroupIds,
  getExpandableGroupSummary,
  getHomePreferenceDisclosure,
} from "./progressive-disclosure";

describe("progressive disclosure helpers", () => {
  it("keeps Home's primary preference controls separate from advanced display controls", () => {
    const disclosure = getHomePreferenceDisclosure("filters");

    expect(disclosure.primary).toEqual(["primaryView", "optionalFilters", "eventDisplay"]);
    expect(disclosure.advanced).toEqual(["layoutComfort", "headerControls", "dayNightBehaviour", "cardOutlineStyle"]);
  });

  it("opens only one calm group by default when many groups are marked default open", () => {
    const openGroups = getCalmDefaultOpenGroupIds(
      [
        { id: "local", defaultOpen: true },
        { id: "cultural", defaultOpen: true },
        { id: "personal", defaultOpen: true },
      ],
      { maxOpen: 1 }
    );

    expect(openGroups).toEqual(["local"]);
  });

  it("opens a selected group ahead of a default group without expanding the whole surface", () => {
    const openGroups = getCalmDefaultOpenGroupIds(
      [
        { id: "local", defaultOpen: true },
        { id: "cultural", selectedCount: 2 },
        { id: "personal" },
      ],
      { maxOpen: 1 }
    );

    expect(openGroups).toEqual(["cultural"]);
  });

  it("summarizes collapsed groups without making every option visible", () => {
    expect(getExpandableGroupSummary({ selectedCount: 3, totalCount: 18 })).toBe("3 selected");
    expect(getExpandableGroupSummary({ selectedCount: 0, totalCount: 18 })).toBe("18 options");
    expect(getExpandableGroupSummary({ selectedCount: 0, totalCount: 1 })).toBe("1 option");
  });
});
