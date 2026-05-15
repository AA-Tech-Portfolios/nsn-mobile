import { describe, expect, it } from "vitest";

import {
  askAboutMeetupQuestionGroups,
  firstMeetupSupportOptions,
  getFirstMeetupSupportSummary,
  getOptionsHubCategoryCards,
  getOptionsHubSection,
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
      title: "Home",
      badge: "3 options",
    });
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
      "Request a guide",
      "Help finding the group",
      "Quiet arrival",
      "Meet near entrance",
      "No extra support",
    ]);

    expect(firstMeetupSupportOptions.every((option) => option.badge === "Prototype")).toBe(true);
    expect(getFirstMeetupSupportSummary([])).toBe("No extra support");
    expect(getFirstMeetupSupportSummary(["Request a guide", "Quiet arrival", "Meet near entrance"])).toBe("Request a guide, Quiet arrival +1");
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

  it("does not present the helper as production AI or safety support", () => {
    const meetupSection = optionsHubSections.find((section) => section.id === "meetups");
    const safetySection = optionsHubSections.find((section) => section.id === "safetyPrivacy");

    expect(meetupSection?.rows.some((row) => row.title === "Ask about this meetup" && row.badge === "Demo")).toBe(true);
    expect(safetySection?.rows.some((row) => row.title === "Report, block, or emergency help")).toBe(true);
  });
});
