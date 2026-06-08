import { describe, expect, it } from "vitest";

import {
  askAboutMeetupQuestionGroups,
  arrivingAloneReassuranceItems,
  conversationStarterPrompts,
  firstMeetupSupportOptions,
  getFirstMeetupSupportSummary,
  getOptionsHubCategoryCards,
  getOptionsHubSection,
  meetupComfortRoleOptions,
  practicalMeetupGuidanceItems,
  preparednessGuidanceCategories,
  quickReplyOptions,
  safetyBoundaryGuidanceCategories,
  optionsHubSections,
} from "./options-hub";

describe("options hub metadata", () => {
  it("keeps the unified Options drawer sections available", () => {
    expect(optionsHubSections.map((section) => section.id)).toEqual([
      "home",
      "userPreferences",
      "meetups",
      "chatContact",
      "safetyPrivacy",
      "alphaTesting",
      "prototypeTools",
    ]);
  });

  it("standardizes every row for mobile scanning", () => {
    for (const section of optionsHubSections) {
      for (const row of section.rows) {
        expect(row.icon, row.title).toBeTruthy();
        expect(row.title).toBeTruthy();
        expect(row.description).toBeTruthy();
        expect(row.badge).toBeTruthy();
        expect(row.chevron).toBe(true);
      }
    }
  });

  it("creates a first-level category hub without exposing every row at once", () => {
    const cards = getOptionsHubCategoryCards(optionsHubSections);

    expect(cards.map((card) => card.id)).toEqual(optionsHubSections.map((section) => section.id));
    expect(cards[0]).toMatchObject({
      id: "home",
      title: "Appearance & Layout",
      badge: "3 options",
    });
    expect(cards.map((card) => card.title)).toEqual([
      "Appearance & Layout",
      "Preferences",
      "Meetups",
      "Chat & Contact",
      "Safety & Support",
      "Alpha Testing",
      "App Settings",
    ]);
    expect(cards.every((card) => card.chevron)).toBe(true);
    expect(cards.every((card) => !("rows" in card))).toBe(true);
  });

  it("returns details only for the selected section", () => {
    const meetups = getOptionsHubSection("meetups", optionsHubSections);
    const missing = getOptionsHubSection("missing", optionsHubSections);

    expect(meetups?.rows.map((row) => row.id)).toEqual(["first-meetup-support", "ask-about-this-meetup"]);
    expect(missing).toBeUndefined();
  });

  it("keeps first meetup support local and prototype-only", () => {
    expect(firstMeetupSupportOptions.map((option) => option.label)).toEqual([
      "Guide requested",
      "Help finding the group",
      "Quiet joiner",
      "Meet near entrance",
      "No extra support",
    ]);

    expect(firstMeetupSupportOptions.every((option) => option.badge === "Prototype")).toBe(true);
    expect(getFirstMeetupSupportSummary([])).toBe("No extra support");
    expect(getFirstMeetupSupportSummary(["Guide requested", "Quiet joiner", "Meet near entrance"])).toBe("Guide requested, Quiet joiner +1");
  });

  it("uses pre-generated meetup helper chips across before, during, and after phases", () => {
    const allQuestions = askAboutMeetupQuestionGroups.flatMap((group) => group.questions);

    expect(allQuestions).toContain("What should I expect?");
    expect(allQuestions).toContain("What should I bring?");
    expect(allQuestions).toContain("Is it okay if I’m quiet?");
    expect(allQuestions).toContain("What if I’m late?");
    expect(allQuestions).toContain("How do I leave politely?");
    expect(allQuestions).toContain("Help me reflect after the meetup.");
    expect(askAboutMeetupQuestionGroups.map((group) => group.phase)).toEqual(["before", "during", "after"]);
  });

  it("keeps conversation starters gentle and optional", () => {
    expect(conversationStarterPrompts).toEqual(expect.arrayContaining([
      "What brings you here tonight?",
      "Favourite quiet café or spot around Sydney?",
      "Beach, movies, cafés, or board games?",
      "What kind of meetups feel easiest for you?",
      "Still warming up? That’s okay.",
    ]));
    expect(quickReplyOptions).toEqual(expect.arrayContaining([
      "Mostly listening tonight 😊",
      "Happy to chat",
      "Still warming up",
      "I might join closer to the time",
      "Deciding later",
      "Need encouragement",
    ]));
    expect([...conversationStarterPrompts, ...quickReplyOptions].join(" ").toLowerCase()).not.toMatch(/ai|score|match|rank|compatib/);
  });

  it("offers broad local-only comfort roles without strict identity labels", () => {
    expect(meetupComfortRoleOptions.map((option) => option.label)).toEqual([
      "Quiet joiner",
      "Happy to chat",
      "First-time attendee",
      "Host helper",
      "Guide requested",
    ]);
    expect(meetupComfortRoleOptions.every((option) => option.badge === "Saved locally")).toBe(true);
    expect(meetupComfortRoleOptions.map((option) => option.description).join(" ").toLowerCase()).toContain("optional");
  });

  it("keeps arriving-alone reassurance warm without clinical or alarmist wording", () => {
    expect(arrivingAloneReassuranceItems.map((item) => item.copy)).toEqual(expect.arrayContaining([
      "Many people attend alone for the first time.",
      "Quiet joining is completely okay here.",
      "You can arrive, observe quietly, or join conversations at your own pace.",
    ]));
    expect(arrivingAloneReassuranceItems.some((item) => item.label === "Low-pressure atmosphere")).toBe(true);

    const combined = arrivingAloneReassuranceItems.flatMap((item) => [item.label, item.copy]).join(" ").toLowerCase();
    expect(combined).not.toMatch(/therapy|therapeutic|clinical|diagnos|crisis|emergency|monitor|tracked|guarantee/);
  });

  it("keeps practical meetup guidance informational-only", () => {
    expect(practicalMeetupGuidanceItems.map((item) => item.label)).toEqual([
      "Weather awareness",
      "Transport disruptions",
      "Venue accessibility",
      "Getting home calmly",
      "Basic first-aid awareness",
    ]);

    const combined = practicalMeetupGuidanceItems.flatMap((item) => [item.label, item.copy]).join(" ").toLowerCase();
    expect(combined).toContain("informational only");
    expect(combined).not.toMatch(/medical advice|emergency support|crisis response|live tracking|safety monitoring|guarantee/);
  });

  it("does not present the helper as production AI or safety support", () => {
    const meetupSection = optionsHubSections.find((section) => section.id === "meetups");
    const safetySection = optionsHubSections.find((section) => section.id === "safetyPrivacy");
    const blockReport = safetySection?.rows.find((row) => row.title === "Block & Report");

    expect(meetupSection?.rows.some((row) => row.title === "Conversation starters" && row.badge === "Demo")).toBe(true);
    expect(safetySection?.title).toBe("Safety & Support");
    expect(safetySection?.rows.some((row) => row.title === "Block & Report")).toBe(true);
    expect(safetySection?.rows.some((row) => row.title === "Preparedness & Guidance")).toBe(false);
    expect(safetySection?.rows.find((row) => row.title === "Help & Support")?.description).toMatch(/preparedness guidance/i);
    expect(blockReport?.badge).toBe("Demo");
    expect(blockReport?.description).not.toMatch(/safety|preparedness|arriving alone|first-aid|weather|transport|emergency/i);
  });

  it("keeps safety boundaries broader than moderation while Block & Report stays focused", () => {
    expect(safetyBoundaryGuidanceCategories.map((category) => category.label)).toEqual([
      "Consent & comfort",
      "Quiet exits",
      "Conversation boundaries",
      "Privacy awareness",
      "Meetup expectations",
      "Low-pressure participation",
      "Optional pacing",
    ]);

    const safetySection = optionsHubSections.find((section) => section.id === "safetyPrivacy");
    expect(safetySection?.rows.map((row) => row.title)).toEqual(expect.arrayContaining([
      "Community Guidelines",
      "Help & Support",
      "Support & Resources",
      "Block & Report",
    ]));
    expect(safetySection?.rows.map((row) => row.title)).toEqual([
      "Community Guidelines",
      "Help & Support",
      "Support & Resources",
      "Block & Report",
    ]);

    const combined = safetyBoundaryGuidanceCategories
      .flatMap((category) => [category.label, category.description, category.detail])
      .join(" ")
      .toLowerCase();

    expect(combined).toContain("you may leave a meetup anytime");
    expect(combined).toContain("quiet participation is welcome");
    expect(combined).toContain("no pressure to share personal details");
    expect(combined).not.toMatch(/weather|transport|first-aid|triple zero|healthdirect|lifeline|ambulance|moderation|report unsafe|block members|compatibility|score|therapy|clinical|surveillance|panic/);
  });

  it("keeps preparedness guidance nested, optional, and non-surveillance oriented", () => {
    expect(preparednessGuidanceCategories.map((category) => category.label)).toEqual([
      "Emergency guidance",
      "Non-emergency support",
      "Weather awareness",
      "Transport disruptions",
      "Accessibility",
      "First-aid awareness",
      "Arriving alone",
      "Quiet exits",
      "Meetup guidance",
    ]);

    const combined = preparednessGuidanceCategories
      .flatMap((category) => [category.label, category.description, category.badge, category.icon])
      .join(" ")
      .toLowerCase();

    const safetySection = optionsHubSections.find((section) => section.id === "safetyPrivacy");
    const helpSupportRow = safetySection?.rows.find((row) => row.id === "help-support");

    expect(helpSupportRow?.description.toLowerCase()).toContain("preparedness");
    expect(safetySection?.rows.some((row) => row.id === "preparedness-guidance")).toBe(false);
    expect(combined).toContain("informational");
    expect(combined).toContain("optional");
    expect(combined).not.toMatch(/panic|alarmist|surveillance|tracking|monitoring|medical advice|diagnosis|crisis intervention|safety guarantee/);
  });

  it("keeps preparedness details lightweight, Australian, and informational only", () => {
    const resourceTitles = preparednessGuidanceCategories.flatMap((category) => category.resources.map((resource) => resource.title));

    expect(resourceTitles).toEqual(expect.arrayContaining([
      "Triple Zero (000)",
      "Healthdirect Australia",
      "NSW Mental Health Line",
      "Lifeline Australia",
      "NSW Ambulance Non-Emergency Guidance",
      "Australian Red Cross First Aid",
      "St John Ambulance resources",
      "Service NSW Live Traffic",
      "Transport for NSW travel alerts",
      "Sydney Trains service alerts",
      "Bureau of Meteorology",
      "Service NSW accessibility services",
      "Transport accessibility services",
    ]));

    const emergency = preparednessGuidanceCategories.find((category) => category.label === "Emergency guidance");
    const arrivingAlone = preparednessGuidanceCategories.find((category) => category.label === "Arriving alone");

    expect(emergency?.resources.some((resource) => resource.copy === "For urgent police, fire, or ambulance emergencies.")).toBe(true);
    expect(arrivingAlone?.details.join(" ")).toContain("Many attendees arrive alone");
    expect(arrivingAlone?.details.join(" ")).toContain("Quiet joining is okay");
    expect(arrivingAlone?.details.join(" ")).toContain("leave anytime");

    const combined = preparednessGuidanceCategories
      .flatMap((category) => [
        category.detailTitle,
        category.detailIntro,
        ...category.details,
        ...category.resources.flatMap((resource) => [resource.title, resource.copy, resource.badge]),
      ])
      .join(" ")
      .toLowerCase();

    expect(combined).toContain("informational only");
    expect(combined).not.toMatch(/nsn provides emergency|medical advice|diagnosis|crisis intervention|live monitoring|safety guarantee|therapy|therapeutic|clinical/);
  });

  it("adds calm favicon metadata for recognizable external resource cards", () => {
    const brandedResources = preparednessGuidanceCategories.flatMap((category) =>
      category.resources.filter((resource) => resource.faviconUrl)
    );

    expect(brandedResources.map((resource) => resource.title)).toEqual(expect.arrayContaining([
      "Lifeline Australia",
      "Beyond Blue",
      "Healthdirect Australia",
      "headspace",
      "QLife",
      "Autism Connect",
      "Griefline",
      "1800RESPECT",
      "Service NSW Live Traffic",
      "Transport for NSW travel alerts",
      "Sydney Trains service alerts",
      "Bureau of Meteorology",
      "Service NSW accessibility services",
    ]));

    for (const resource of brandedResources) {
      expect(resource.faviconUrl).toMatch(/^https:\/\/www\.google\.com\/s2\/favicons\?sz=64&domain=/);
      expect(resource.iconFallback).toBeTruthy();
      expect(resource.url).toMatch(/^https:\/\//);
    }
  });
});
