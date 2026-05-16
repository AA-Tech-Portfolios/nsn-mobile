import { describe, expect, it } from "vitest";

import {
  DEFAULT_NSN_LANGUAGE,
  getTranslationLanguageBase,
  normalizeNsnLanguage,
  normalizeMeetupContactPreferences,
  nsnLocalLanguageOptions,
  nsnPlannedGlobalLanguageOptions,
  nsnPlannedLocalCommunityLanguageOptions,
  toggleMeetupContactPreferenceSelection,
} from "./app-settings";

describe("NSN alpha language staging", () => {
  it("keeps only reviewed or explicitly staged alpha languages selectable", () => {
    expect(nsnLocalLanguageOptions.map((language) => language.label)).toEqual([
      "English (Australia)",
      "Hebrew",
      "Chinese (Simplified)",
      "Chinese (Traditional)",
      "Korean",
      "Japanese",
    ]);
  });

  it("keeps local community and global expansion languages planned-only", () => {
    expect(nsnPlannedLocalCommunityLanguageOptions.map((language) => language.label)).toEqual([
      "Hindi",
      "Arabic",
      "Vietnamese",
      "Punjabi",
      "Persian / Farsi",
      "Filipino / Tagalog",
      "Indonesian",
      "Malay / Bahasa Melayu",
    ]);
    expect(nsnPlannedGlobalLanguageOptions.map((language) => language.label)).toEqual([
      "Spanish",
      "French",
      "German",
      "Portuguese",
      "Italian",
      "Dutch",
      "Greek",
      "Turkish",
      "Russian",
      "Ukrainian",
      "Swedish",
      "Danish",
      "Norwegian",
      "Finnish",
    ]);
    expect(nsnPlannedLocalCommunityLanguageOptions.every((language) => language.selectable === false)).toBe(true);
    expect(nsnPlannedGlobalLanguageOptions.every((language) => language.selectable === false)).toBe(true);
  });

  it("normalizes broad Chinese safely and falls Traditional Chinese back to English until reviewed", () => {
    expect(normalizeNsnLanguage("Chinese")).toBe("Chinese (Simplified)");
    expect(normalizeNsnLanguage("Chinese (Taiwan)")).toBe("Chinese (Traditional)");
    expect(normalizeNsnLanguage("Spanish")).toBe(DEFAULT_NSN_LANGUAGE);
    expect(getTranslationLanguageBase("Chinese (Simplified)")).toBe("Chinese");
    expect(getTranslationLanguageBase("Chinese (Traditional)")).toBe("English");
  });
});

describe("meetup contact preference conflicts", () => {
  it("does not preserve contradictory voice call preferences", () => {
    expect(normalizeMeetupContactPreferences(["Voice call okay", "No voice calls"])).toEqual(["No voice calls"]);
    expect(normalizeMeetupContactPreferences(["No voice calls", "Voice call okay"])).toEqual(["Voice call okay"]);
  });

  it("keeps details-only and reminder-only modes exclusive from broader chat and call options", () => {
    expect(normalizeMeetupContactPreferences(["Details only", "Chat before meetup"])).toEqual(["Chat before meetup"]);
    expect(normalizeMeetupContactPreferences(["Group chat okay", "Reminders only"])).toEqual(["Reminders only"]);
    expect(normalizeMeetupContactPreferences(["Reminders only", "Direct messages okay"])).toEqual(["Direct messages okay"]);
  });

  it("normalizes local toggle updates before they are saved", () => {
    expect(toggleMeetupContactPreferenceSelection(["No voice calls"], "Voice call okay")).toEqual(["Voice call okay"]);
    expect(toggleMeetupContactPreferenceSelection(["Chat before meetup", "Group chat okay"], "Details only")).toEqual(["Details only"]);
    expect(toggleMeetupContactPreferenceSelection(["Prefer planning ahead"], "Last-minute plans okay")).toEqual(["Last-minute plans okay"]);
  });
});
