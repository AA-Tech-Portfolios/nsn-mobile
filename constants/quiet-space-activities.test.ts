import { describe, expect, it } from "vitest";

import {
  getNextQuietSpacePromptIndex,
  quietSpaceActivitiesCopy,
  quietSpaceActivityCards,
  quietSpaceActivitySafety,
  quietSpaceConversationPrompts,
  quietSpaceReadingNook,
} from "./quiet-space-activities";

describe("quiet space activities", () => {
  it("renders all alpha activity cards under a comfort-tools frame", () => {
    expect(quietSpaceActivitiesCopy.title).toBe("Quiet Space Activities");
    expect(quietSpaceActivityCards.map((activity) => activity.title)).toEqual([
      "Coloring Canvas",
      "Reading Nook",
      "Jigsaw Puzzles",
      "Zen Blocks",
      "Cat Corner",
      "Conversation Cards",
    ]);
    expect(quietSpaceActivityCards.find((activity) => activity.id === "coloring-canvas")).toMatchObject({
      copy: "A gentle space to color, doodle, or unwind.",
      statusLabel: "Alpha canvas",
    });
    expect(quietSpaceActivityCards.find((activity) => activity.id === "reading-nook")).toMatchObject({
      copy: "A short place to read, pause, or settle for a minute.",
      statusLabel: "Alpha reader",
    });
  });

  it("provides a quiet reading nook with soft style controls and narrator placeholder", () => {
    expect(quietSpaceReadingNook.title).toBe("Reading Nook");
    expect(quietSpaceReadingNook.sampleTitle).toBe("A Small Window of Evening");
    expect(quietSpaceReadingNook.sampleText).toContain("The room became quiet in layers.");
    expect(quietSpaceReadingNook.backgroundOptions.map((option) => option.label)).toEqual([
      "Soft dark",
      "Paper",
      "Mist",
    ]);
    expect(quietSpaceReadingNook.fontOptions.map((option) => option.label)).toEqual([
      "Calm sans",
      "Serif",
    ]);
    expect(quietSpaceReadingNook.textSizeOptions.map((option) => option.label)).toEqual([
      "Small",
      "Medium",
      "Large",
    ]);
    expect(quietSpaceReadingNook.narratorLabel).toBe("Narrator coming later");
    expect(quietSpaceReadingNook.autoplay).toBe(false);
  });

  it("keeps activity copy soft and non-competitive", () => {
    const visibleCopy = [
      quietSpaceActivitiesCopy.title,
      quietSpaceActivitiesCopy.copy,
      ...quietSpaceActivityCards.flatMap((activity) => [
        activity.title,
        activity.copy,
        activity.statusLabel,
        activity.placeholderCopy,
      ]),
      quietSpaceReadingNook.title,
      quietSpaceReadingNook.sampleTitle,
      quietSpaceReadingNook.sampleText,
      quietSpaceReadingNook.narratorLabel,
      ...quietSpaceConversationPrompts,
    ].join(" ");

    expect(visibleCopy).toContain("no timer");
    expect(visibleCopy).toContain("no score");
    expect(visibleCopy).toContain("no pressure");
    expect(visibleCopy).not.toMatch(
      /\b(game|games|Tetris|leaderboard|streak|rank|beat|win|lose|challenge)\b/i,
    );
  });

  it("does not introduce autoplay or competitive mechanics", () => {
    expect(quietSpaceActivitySafety).toEqual({
      autoplay: false,
      competitiveMechanics: false,
      leaderboards: false,
      levels: false,
      scores: false,
      streaks: false,
      timers: false,
    });
  });

  it("keeps conversation card cycling gentle and unchanged", () => {
    expect(quietSpaceConversationPrompts).toEqual([
      "What's a place you'd happily visit again?",
      "Tea, coffee, or something else?",
      "What's a small thing that made your week better?",
      "Beach walk or cozy café?",
      "What's a hobby you'd like to try?",
    ]);
    expect(getNextQuietSpacePromptIndex(0)).toBe(1);
    expect(getNextQuietSpacePromptIndex(quietSpaceConversationPrompts.length - 1)).toBe(0);
  });
});
