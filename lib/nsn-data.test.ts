import { describe, expect, it } from "vitest";

import { chatSeed, dayEvents, eveningEvents, movieNight, nsnColors, profileVibes } from "./nsn-data";

describe("NSN prototype data", () => {
  it("keeps event identifiers unique and route-safe", () => {
    const allEvents = [...dayEvents, ...eveningEvents];
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
    expect(dayEvents.length).toBeGreaterThanOrEqual(2);
    expect(eveningEvents.length).toBeGreaterThanOrEqual(2);
    expect(chatSeed.some((message) => message.mine)).toBe(true);
    expect(profileVibes.length).toBeGreaterThanOrEqual(12);
    expect(profileVibes).toEqual(expect.arrayContaining(["🌿 Calm", "👥 Small groups", "☕ Coffee", "🎬 Movies", "📚 Libraries"]));
  });

  it("uses a dark, high-contrast NSN palette", () => {
    expect(nsnColors.background).toBe("#020814");
    expect(nsnColors.text).toBe("#F5F7FF");
    expect(nsnColors.primary).toBe("#3848FF");
  });
});
