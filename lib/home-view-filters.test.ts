import { describe, expect, it } from "vitest";

import { dayEvents, eveningEvents } from "./nsn-data";
import { getComfortEventScore, isNearbyEvent, isSmallGroupEvent, isWeatherSafeEvent } from "./home-view-filters";

describe("Home view filters", () => {
  it("detects small group events from prototype people labels", () => {
    expect(isSmallGroupEvent(dayEvents.find((event) => event.id === "coffee-lane-cove")!)).toBe(true);
    expect(isSmallGroupEvent(dayEvents.find((event) => event.id === "harbour-walk-waverton")!)).toBe(false);
  });

  it("detects indoor or backup events as weather-safe", () => {
    expect(isWeatherSafeEvent(eveningEvents.find((event) => event.id === "movie-night-watch-chat")!)).toBe(true);
    expect(isWeatherSafeEvent(dayEvents.find((event) => event.id === "beach-day-chill-vibes")!)).toBe(false);
  });

  it("prioritises nearby and comfortable events", () => {
    const coffee = dayEvents.find((event) => event.id === "coffee-lane-cove")!;
    const beach = dayEvents.find((event) => event.id === "beach-day-chill-vibes")!;

    expect(isNearbyEvent(coffee, "Lane Cove North Shore")).toBe(true);
    expect(getComfortEventScore(coffee)).toBeLessThan(getComfortEventScore(beach));
  });
});
