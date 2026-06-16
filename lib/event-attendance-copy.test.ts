import { describe, expect, it } from "vitest";

import { eveningEvents, movieNight } from "./nsn-data";
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
});
