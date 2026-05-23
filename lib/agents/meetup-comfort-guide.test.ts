import { describe, expect, it } from "vitest";

import { meetupComfortGuideAgent } from "./meetup-comfort-guide";

describe("meetup comfort guide agent", () => {
  it("defines a prototype-safe comfort guide without live AI wiring", () => {
    expect(meetupComfortGuideAgent).toMatchObject({
      id: "nsn-meetup-comfort-guide",
      name: "NSN Meetup Comfort Guide",
      status: "prototype-prompt-only",
    });

    const combined = [
      meetupComfortGuideAgent.systemPrompt,
      ...meetupComfortGuideAgent.boundaries,
    ].join(" ").toLowerCase();

    expect(combined).toContain("prototype prompt asset only");
    expect(combined).toContain("no api calls");
    expect(combined).toContain("not a therapist");
    expect(combined).toContain("privacy-first");
    expect(combined).toContain("do not use hype");
    expect(combined).toContain("gamification");
    expect(combined).toContain("without diagnosing");
  });

  it("covers common meetup uncertainty questions", () => {
    expect(meetupComfortGuideAgent.exampleQuestions).toEqual([
      "Is it okay to come alone?",
      "Can I just listen quietly?",
      "How social is this meetup?",
      "What should I expect when arriving?",
      "What if I feel awkward at first?",
    ]);
  });

  it("keeps example responses short, reassuring, and non-judgemental", () => {
    for (const example of meetupComfortGuideAgent.exampleResponses) {
      expect(example.response.length).toBeLessThanOrEqual(190);
    }

    const responses = meetupComfortGuideAgent.exampleResponses.map((example) => example.response).join(" ").toLowerCase();

    expect(responses).toContain("quiet participation is welcome");
    expect(responses).toContain("give yourself a minute");
    expect(responses).toContain("easy-paced");
    expect(responses).not.toMatch(/achievement unlocked|leaderboard|streak|rankings|scarcity|hurry|diagnos|treatment|clinical|socially behind|lonely|fix yourself|should attend|must talk|be brave|push yourself/);
  });
});
