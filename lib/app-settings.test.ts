import { describe, expect, it } from "vitest";

import {
  DEFAULT_NSN_LANGUAGE,
  availabilityTimingOptions,
  calculateAgeFromBirthYear,
  calculateBirthYearFromAge,
  datingStyleOptions,
  defaultHomeSectionOrder,
  defaultPhotoRecordingComfortPreferences,
  defaultPhysicalContactComfortPreferences,
  getPrototypePreferenceDefaults,
  friendshipStyleOptions,
  getTranslationLanguageBase,
  isBirthYearInAdultProfileRange,
  languageComfortOptions,
  locationComfortPreferenceOptions,
  lifeComfortOptions,
  meetupRhythmOptions,
  normalizePhotoRecordingComfortPreferences,
  normalizeLanguageComfortPreferences,
  normalizeNsnLanguage,
  normalizeMeetupContactPreferences,
  nsnLocalLanguageOptions,
  nsnPlannedGlobalLanguageOptions,
  nsnPlannedLocalCommunityLanguageOptions,
  photoRecordingComfortOptions,
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

describe("birth year profile age", () => {
  const referenceDate = new Date("2026-06-20T12:00:00.000Z");

  it("calculates displayed age from birth year instead of storing a static age", () => {
    expect(calculateAgeFromBirthYear(1998, referenceDate)).toBe(28);
    expect(calculateAgeFromBirthYear(1998, new Date("2027-06-20T12:00:00.000Z"))).toBe(29);
    expect(calculateAgeFromBirthYear(null, referenceDate)).toBeNull();
  });

  it("can migrate a legacy saved age into a birth year", () => {
    expect(calculateBirthYearFromAge(28, referenceDate)).toBe(1998);
    expect(calculateBirthYearFromAge(null, referenceDate)).toBeNull();
  });

  it("preserves the adult profile age range with birth-year validation", () => {
    expect(isBirthYearInAdultProfileRange(2008, referenceDate)).toBe(true);
    expect(isBirthYearInAdultProfileRange(2009, referenceDate)).toBe(false);
    expect(isBirthYearInAdultProfileRange(1931, referenceDate)).toBe(true);
    expect(isBirthYearInAdultProfileRange(1930, referenceDate)).toBe(false);
  });
});

describe("photo and recording comfort preferences", () => {
  it("exposes the intended selectable options for settings and profile rendering", () => {
    expect(photoRecordingComfortOptions).toEqual([
      "Ask me first",
      "No photos of me",
      "Group photos are okay",
      "Venue/event photos are okay",
      "No videos please",
      "No public posting without permission",
      "Prefer no screenshots of chats/profile",
    ]);
  });

  it("persists valid selections and restores defaults when saved selections are empty", () => {
    expect(
      normalizePhotoRecordingComfortPreferences([
        "No videos please",
        "No public posting without permission",
        "Unknown saved option" as never,
      ]),
    ).toEqual(["No videos please", "No public posting without permission"]);

    expect(normalizePhotoRecordingComfortPreferences([])).toEqual(
      defaultPhotoRecordingComfortPreferences,
    );
  });
});

describe("alpha prototype defaults", () => {
  it("keeps tiny tutorials off by default for alpha users", () => {
    expect(getPrototypePreferenceDefaults().showTinyTutorials).toBe(false);
  });

  it("resets privacy, comfort, readiness, and alpha-only preferences together", () => {
    expect(getPrototypePreferenceDefaults()).toMatchObject({
      comfortMode: "Comfort Mode",
      visibilityPreference: "Blurred",
      privateProfile: false,
      blurProfilePhoto: true,
      blurLevel: "Medium blur",
      softRevealSuggestions: true,
      softRevealPace: "Gradual reveal",
      preferSoftRevealPeople: false,
      warmUpLowerBlur: true,
      showSuburbArea: false,
      middleNameDisplay: "Hidden",
      lastNameDisplay: "Hidden",
      showMiddleName: false,
      showLastName: false,
      showAge: false,
      showPreferredAgeRange: false,
      showGender: false,
      showInterests: false,
      showComfortPreferences: false,
      minimalProfileView: false,
      verificationLevel: "Readiness not reviewed",
      verifiedButPrivate: true,
      socialEnergyPreference: "Calm",
      communicationPreferences: [],
      groupSizePreference: "Small groups only",
      photoRecordingComfortPreferences: defaultPhotoRecordingComfortPreferences,
      physicalContactComfortPreferences: defaultPhysicalContactComfortPreferences,
      profileShortcutLayout: "Clean",
      settingsPrivacyMode: "Basic",
      userPreferenceTextMode: "Simple",
      emojiDisplayMode: "Full emoji display",
      showProfileControlsShortcut: true,
      showAlertsSettingsShortcut: true,
      showTinyTutorials: false,
      meetupReminders: true,
      weatherAlerts: true,
      chatNotifications: true,
      quietNotifications: false,
      notificationSnoozed: false,
      useApproximateLocation: true,
      showDistanceInMeetups: true,
      allowMessageRequests: false,
      safetyCheckIns: true,
      batterySaver: false,
      lowLightMode: false,
      largerText: false,
      highContrast: false,
      reduceMotion: false,
      screenReaderHints: true,
    });
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
