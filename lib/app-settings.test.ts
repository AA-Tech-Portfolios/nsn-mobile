import { describe, expect, it } from "vitest";

import {
  DEFAULT_NSN_LANGUAGE,
  availabilityTimingOptions,
  datingStyleOptions,
  defaultHomeSectionOrder,
  friendshipStyleOptions,
  getTranslationLanguageBase,
  languageComfortOptions,
  locationComfortPreferenceOptions,
  lifeComfortOptions,
  meetupRhythmOptions,
  normalizeLanguageComfortPreferences,
  normalizeNsnLanguage,
  normalizeMeetupContactPreferences,
  nsnLocalLanguageOptions,
  nsnPlannedGlobalLanguageOptions,
  nsnPlannedLocalCommunityLanguageOptions,
  socialDurationOptions,
  toggleMeetupContactPreferenceSelection,
} from "./app-settings";
import { availabilityTimingPreferenceDetails, datingStylePreferenceDetails, friendshipStylePreferenceDetails, languageComfortPreferenceDetails, locationComfortPreferenceDetails, meetupRhythmPreferenceDetails, socialDurationPreferenceDetails } from "./preferences/preference-panel-options";

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

  it("uses neutral icons for multilingual or non-region-specific language entries", () => {
    expect(nsnPlannedLocalCommunityLanguageOptions.find((language) => language.label === "Arabic")?.flag).toBe("🌐");
    expect(nsnPlannedLocalCommunityLanguageOptions.find((language) => language.label === "Punjabi")?.flag).toBe("🌐");
    expect(nsnPlannedLocalCommunityLanguageOptions.find((language) => language.label === "Persian / Farsi")?.flag).toBe("🌐");
    expect(nsnPlannedLocalCommunityLanguageOptions.find((language) => language.label === "Malay / Bahasa Melayu")?.flag).toBe("🌐");
    expect(nsnLocalLanguageOptions.find((language) => language.label === "Chinese (Traditional)")?.flag).toBe("🌐");
    expect(nsnPlannedGlobalLanguageOptions.every((language) => language.flag === "🌐")).toBe(true);
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

describe("language comfort preference staging", () => {
  it("keeps English conversation comfort optional, warm, and non-ranking", () => {
    expect(languageComfortOptions).toEqual([
      "Native English speaker",
      "Fluent English",
      "Advanced English",
      "Still learning English",
      "Prefer simple English",
      "Comfortable with slower conversation",
      "Happy to help others practise English",
      "Prefer multilingual-friendly meetups",
      "Prefer not to say",
    ]);
    expect(languageComfortPreferenceDetails.map((option) => option.group)).toEqual(expect.arrayContaining([
      "English conversation comfort",
      "Conversation support",
      "Multilingual-friendly meetups",
      "Privacy",
    ]));
    expect(languageComfortPreferenceDetails.map((option) => option.copy).join(" ")).not.toMatch(/good english|bad english|score|rank|test/i);
  });

  it("lets Prefer not to say stay exclusive", () => {
    expect(normalizeLanguageComfortPreferences(["Still learning English", "Prefer not to say"])).toEqual(["Prefer not to say"]);
  });
});

describe("location comfort preference staging", () => {
  it("includes optional sensory, conversation, and practical venue comfort groups", () => {
    expect(locationComfortPreferenceOptions).toEqual(expect.arrayContaining([
      "Prefer smoke-free venues",
      "Sensitive to strong perfumes/colognes",
      "Prefer lighter conversation first",
      "Prefer avoiding politics initially",
      "Prefer avoiding religion debates",
      "Avoid personal questioning early on",
      "Sensitive to sarcasm-heavy humour",
      "Comfortable with playful banter",
      "Prefer calmer language",
      "Calm atmosphere",
      "Flexible conversation pacing",
      "Public restroom access",
      "Wheelchair-accessible routes",
      "Loud environment possible",
      "Bring earbuds/headphones if helpful",
      "Accessibility details coming later",
    ]));
    expect(locationComfortPreferenceDetails.map((option) => option.group)).toEqual(expect.arrayContaining([
      "Smoke & air comfort",
      "Fragrance & scent comfort",
      "Conversation comfort",
      "Meetup tone labels",
      "Venue accessibility & practical comfort",
      "Loud environment guidance",
    ]));
  });
});

describe("life comfort preference staging", () => {
  it("keeps optional support preferences broad and non-clinical", () => {
    expect(lifeComfortOptions).toEqual([
      "Approaching people can feel hard",
      "I warm up slowly socially",
      "Large groups can feel overwhelming",
      "Sleep schedules can vary",
      "Motivation can fluctuate",
      "Exercise consistency can be difficult",
      "I recharge alone sometimes",
      "Busy/noisy places can feel draining",
      "I overthink social situations sometimes",
      "I prefer gentle pacing",
      "Prefer not to say",
    ]);
  });
});

describe("connection expectation and meetup pacing staging", () => {
  it("keeps connection and timing preferences optional and low-pressure", () => {
    expect(friendshipStyleOptions).toEqual(expect.arrayContaining([
      "Casual friendships",
      "Open to gradual connection",
      "Shared hobbies first",
    ]));
    expect(datingStyleOptions).toEqual(expect.arrayContaining([
      "Friendship-first dating",
      "Exploring without pressure",
      "Prefer getting to know people slowly",
    ]));
    expect(meetupRhythmOptions).toEqual(expect.arrayContaining(["One-time meetup", "Fortnightly", "Occasional/random"]));
    expect(availabilityTimingOptions).toEqual(expect.arrayContaining(["Weekdays", "Weekends", "Flexible schedule"]));
    expect(socialDurationOptions).toEqual(expect.arrayContaining(["Quick meetup (30-45 mins)", "Flexible timing", "Leave anytime"]));
    expect([
      ...friendshipStylePreferenceDetails,
      ...datingStylePreferenceDetails,
      ...meetupRhythmPreferenceDetails,
      ...availabilityTimingPreferenceDetails,
      ...socialDurationPreferenceDetails,
    ].map((option) => option.copy).join(" ")).not.toMatch(/score|ranking|optimization|time wasters/i);
  });
});

describe("Home alpha defaults", () => {
  it("keeps meetup discovery primary and map detail lower in the default flow", () => {
    expect(defaultHomeSectionOrder).toEqual([
      "recommendedEvents",
      "dayEvents",
      "nightEvents",
      "weather",
      "map",
      "search",
      "noiseGuide",
    ]);
  });
});
