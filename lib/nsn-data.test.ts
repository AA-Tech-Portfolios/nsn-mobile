import { describe, expect, it } from "vitest";

import { allEvents, chatSeed, dayEvents, eveningEvents, eventChatSeeds, movieNight, nsnColors, profileVibes } from "./nsn-data";

describe("NSN prototype data", () => {
  it("keeps event identifiers unique and route-safe", () => {
    const ids = allEvents.map((event) => event.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("defines the Movie Night detail event used by the primary join flow", () => {
    expect(movieNight.id).toBe("movie-night-watch-chat");
    expect(movieNight.title).toContain("Movie Night");
    expect(movieNight.tags).toEqual(expect.arrayContaining(["Indoor", "Quiet"]));
    expect(movieNight.people).toMatch(/2–4/);
  });

  it("contains enough seeded content for the home, chat, and profile screens", () => {
    expect(dayEvents.length).toBeGreaterThanOrEqual(5);
    expect(eveningEvents.length).toBeGreaterThanOrEqual(4);
    expect(allEvents.some((event) => event.venue === "Palm Beach")).toBe(true);
    expect(chatSeed.some((message) => message.mine)).toBe(true);
    expect(profileVibes.length).toBeGreaterThanOrEqual(12);
    expect(profileVibes).toEqual(expect.arrayContaining(["🌿 Calm", "👥 Small groups", "☕ Coffee", "🎬 Movies", "📚 Libraries"]));
  });

  it("adds event-specific chats for the key alpha meetup previews", () => {
    const requiredEventIds = [
      "picnic-easy-hangout",
      "coffee-lane-cove",
      "library-calm-study",
      "movie-night-watch-chat",
      "board-games-coffee",
      "beach-day-chill-vibes",
    ];

    expect(Object.keys(eventChatSeeds)).toEqual(expect.arrayContaining(requiredEventIds));

    for (const eventId of requiredEventIds) {
      expect(eventChatSeeds[eventId]?.length).toBeGreaterThanOrEqual(4);
      expect(eventChatSeeds[eventId].some((message) => message.personId === "maya-host")).toBe(true);
      expect(eventChatSeeds[eventId].some((message) => message.personId === "james-member")).toBe(true);
    }

    const combinedText = requiredEventIds
      .flatMap((eventId) => eventChatSeeds[eventId].map((message) => message.text.toLowerCase()))
      .join(" ");

    expect(combinedText).toContain("ask before photos");
    expect(combinedText).toContain("quiet");
    expect(combinedText).toContain("arrival");
  });

  it("uses a dark, high-contrast NSN palette", () => {
    expect(nsnColors.background).toBe("#0B1626");
    expect(nsnColors.text).toBe("#F5F7FF");
    expect(nsnColors.primary).toBe("#536C9E");
  });
});
