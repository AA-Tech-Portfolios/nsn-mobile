import { describe, expect, it } from "vitest";

import { allEvents, chatSeed, dayEvents, eveningEvents, eventChatSeeds, eventComfortLabelOptions, eventAtmosphereLabelOptions, movieNight, nsnColors, profileVibes } from "./nsn-data";

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
      expect(eventChatSeeds[eventId].some((message) => message.personId === "jordan-member")).toBe(true);
      expect(eventChatSeeds[eventId].some((message) => message.personId === "nsn-tester")).toBe(true);
    }

    const combinedText = requiredEventIds
      .flatMap((eventId) => eventChatSeeds[eventId].map((message) => message.text.toLowerCase()))
      .join(" ");

    expect(combinedText).toContain("ask before photos");
    expect(combinedText).toContain("quiet");
    expect(combinedText).toContain("arrival");
  });

  it("keeps meetup comfort and participation labels optional, broad, and non-ranking", () => {
    expect(eventComfortLabelOptions).toEqual(expect.arrayContaining([
      "Small groups preferred",
      "Calm & quiet",
      "Casual social",
      "Cozy indoor",
      "Explorative/day out",
      "Food-focused",
      "Activity-focused",
      "Conversation-light",
      "Conversation-heavy",
      "Energetic/social vibe",
      "Flexible pacing",
      "Large crowds okay",
      "Crowd-sensitive",
      "High-energy social vibe",
      "Loud environment possible",
      "Bring earbuds/headphones if helpful",
      "Noise-sensitive friendly",
      "Lower-noise alternative nearby",
      "Pool party",
      "Pet-free meetup",
      "Sensitive to pets/allergies",
      "Quiet recharge space nearby",
      "Join at your own pace",
      "Leave whenever you need",
    ]));

    const knownLabels = new Set(eventComfortLabelOptions);
    const seededLabels = allEvents.flatMap((event) => event.comfortLabels ?? []);
    const seededTags = allEvents.flatMap((event) => event.tags);

    expect(seededLabels).toEqual(expect.arrayContaining([
      "High-energy social vibe",
      "Loud environment possible",
      "Lower-pressure participation",
      "Noise-sensitive friendly",
      "Quiet recharge space nearby",
      "Outdoor animal exposure possible",
      "Join/leave flexibly",
    ]));
    expect(seededTags).toEqual(expect.arrayContaining([
      "Picnic gathering",
      "Café meetup",
      "Casual dining",
      "Group lunch/dinner",
      "Beach walk",
      "Activity-focused",
    ]));

    for (const event of allEvents) {
      expect(event.comfortLabels?.length).toBeGreaterThan(0);
      for (const label of event.comfortLabels ?? []) {
        expect(knownLabels.has(label)).toBe(true);
      }
    }
  });

  it("uses atmosphere labels for venue feel rather than popularity", () => {
    expect(eventAtmosphereLabelOptions).toEqual(expect.arrayContaining([
      "Quiet",
      "Balanced",
      "Lively",
      "Cozy",
      "Small group",
      "Low-pressure",
      "Outdoor calm",
      "Indoor backup",
      "First-time friendly",
    ]));

    const forbidden = /trending|hot|popular|score|rank|likes|views/i;
    for (const event of allEvents) {
      expect(event.atmosphereLabels?.length).toBeGreaterThan(0);
      expect(event.atmosphereLabels?.join(" ")).not.toMatch(forbidden);
      for (const label of event.atmosphereLabels ?? []) {
        expect(eventAtmosphereLabelOptions).toContain(label);
      }
    }
  });

  it("uses a dark, high-contrast NSN palette", () => {
    expect(nsnColors.background).toBe("#0B1626");
    expect(nsnColors.text).toBe("#F5F7FF");
    expect(nsnColors.primary).toBe("#536C9E");
  });
});
