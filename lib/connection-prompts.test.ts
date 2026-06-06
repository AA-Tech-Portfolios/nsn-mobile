import { describe, expect, it } from "vitest";

import {
  connectionPromptCategories,
  getConnectionPromptSummary,
  getMeetupConnectionInsights,
  getSharedConnectionPrompts,
} from "./connection-prompts";
import { demoPersonaList } from "./demo-personas";

describe("connection prompts", () => {
  it("keeps the alpha prompt layer broad, optional, and non-performative", () => {
    expect(connectionPromptCategories.map((category) => category.id)).toEqual([
      "socialComfort",
      "conversationSeeds",
      "humorStyle",
      "appreciates",
      "learningGrowth",
    ]);

    const allText = demoPersonaList.map((persona) => getConnectionPromptSummary(persona.id).join(" ")).join(" ");

    expect(allText).not.toMatch(/completion|complete your profile|required|score|ranking|rank|match percentage|bachelor|master|phd|degree/i);
  });

  it("seeds every demo persona with at least one gentle prompt in each category", () => {
    for (const persona of demoPersonaList) {
      const summary = getConnectionPromptSummary(persona.id);

      expect(summary.length).toBeGreaterThanOrEqual(connectionPromptCategories.length);
      expect(summary).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/warms up|small groups|listening|one-on-one|starts conversations/i),
          expect.stringMatching(/coffee|japan|autumn|comfort food|mountains|learn/i),
          expect.stringMatching(/humor|jokes|playful|wholesome|dry/i),
          expect.stringMatching(/appreciates/i),
          expect.stringMatching(/learn/i),
        ]),
      );
    }
  });

  it("highlights similarities without exposing differences or exact counts", () => {
    const shared = getSharedConnectionPrompts("nsn-tester", "maya-host");

    expect(shared).toEqual(
      expect.arrayContaining([
        expect.stringContaining("both"),
        expect.stringMatching(/coffee|Japan|Autumn|learn/i),
      ]),
    );
    expect(shared.join(" ")).not.toMatch(/different|doesn't|does not|only one|0|1|2|3|4|5|score|rank/i);
  });

  it("turns meetup attendee context into soft reassurance rather than measurement", () => {
    const insights = getMeetupConnectionInsights(["nsn-tester", "maya-host", "jordan-member"]);

    expect(insights).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/prefer smaller groups|small groups/i),
        expect.stringMatching(/warm up|time/i),
        expect.stringMatching(/conversation starter|coffee|Japan|Autumn/i),
      ]),
    );
    expect(insights.join(" ")).not.toMatch(/\b\d+\b|count|percent|score|rank|most popular|completion/i);
  });
});
