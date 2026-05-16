import { describe, expect, it } from "vitest";

import {
  getPersonalityPresenceSelectedCount,
  normalizePersonalityPresenceChoice,
  normalizePersonalityPresenceList,
  personalityPresenceComfortAroundOptions,
  personalityPresenceHairOptions,
  personalityPresencePersonalStyleOptions,
  personalityPresenceSocialStyleOptions,
} from "./personality-presence";

describe("personality and presence preferences", () => {
  it("keeps appearance fields optional and bounded to soft descriptors", () => {
    expect(normalizePersonalityPresenceChoice(null, personalityPresenceHairOptions)).toBeNull();
    expect(normalizePersonalityPresenceChoice("Dark", personalityPresenceHairOptions)).toBe("Dark");
    expect(normalizePersonalityPresenceChoice("Exact height" as never, personalityPresenceHairOptions)).toBeNull();
    expect(personalityPresenceHairOptions).toContain("Prefer not to say");
  });

  it("deduplicates multi-select social and comfort preferences", () => {
    expect(
      normalizePersonalityPresenceList(
        ["More introverted", "More introverted", "Rank me highly" as never],
        personalityPresenceSocialStyleOptions
      )
    ).toEqual(["More introverted"]);
    expect(normalizePersonalityPresenceList(["Good listeners"], personalityPresenceComfortAroundOptions)).toEqual(["Good listeners"]);
    expect(normalizePersonalityPresenceList(["Smart casual", "Smart casual"], personalityPresencePersonalStyleOptions)).toEqual(["Smart casual"]);
  });

  it("counts only user-provided preference values, not privacy visibility", () => {
    expect(
      getPersonalityPresenceSelectedCount({
        hair: "Prefer not to say",
        eyes: null,
        facialHair: null,
        style: "Casual",
        personalStyles: ["Smart casual", "Don't mind what others wear"],
        socialStyles: ["Quiet at first, warmer later"],
        connectionPreferences: [],
        comfortableAround: ["Kind and patient", "Good listeners"],
      })
    ).toBe(7);
  });
});
