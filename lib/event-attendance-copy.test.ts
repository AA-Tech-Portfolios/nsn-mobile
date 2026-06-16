import { describe, expect, it } from "vitest";

import { dayEvents, eveningEvents, movieNight } from "./nsn-data";
import {
  getCurrentRsvpCopy,
  getExpectedGroupSizeCopy,
  getExpectedGroupSizeValue,
} from "./event-attendance-copy";

describe("event attendance copy", () => {
  it("separates current RSVP state from expected group size comfort context", () => {
    expect(getCurrentRsvpCopy("going")).toBe("Current RSVP: Going");
    expect(getCurrentRsvpCopy("none")).toBe("Current RSVP: No RSVP yet");
    expect(getExpectedGroupSizeValue(movieNight)).toBe("3–4");
    expect(getExpectedGroupSizeCopy(movieNight)).toBe("Expected group size: 3–4");

    const visibleCopy = [
      getCurrentRsvpCopy("going"),
      getExpectedGroupSizeCopy(movieNight),
    ].join(" ");

    expect(visibleCopy).toContain("Current RSVP");
    expect(visibleCopy).toContain("Expected group size");
    expect(visibleCopy).not.toMatch(/current group size|current attendees|confirmed attendees/i);
  });

  it("keeps Board Games expected group size within the event capacity", () => {
    const boardGames = eveningEvents.find(
      (event) => event.id === "board-games-coffee",
    );

    expect(boardGames).toBeDefined();
    expect(getExpectedGroupSizeValue(boardGames!)).toBe("4–5");
    expect(getExpectedGroupSizeCopy(boardGames!)).toBe(
      "Expected group size: 4–5",
    );
  });

  it("matches Harbour Walk expected group size to the eight-person hero image", () => {
    const harbourWalk = dayEvents.find(
      (event) => event.id === "harbour-walk-waverton",
    );

    expect(harbourWalk).toBeDefined();
    expect(getExpectedGroupSizeValue(harbourWalk!)).toBe("4–8");
    expect(getExpectedGroupSizeCopy(harbourWalk!)).toBe(
      "Expected group size: 4–8",
    );
  });
});
