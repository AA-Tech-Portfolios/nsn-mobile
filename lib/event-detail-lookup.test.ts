import { describe, expect, it } from "vitest";

import {
  shouldShowMissingEvent,
  shouldWaitForCreatedEventLookup,
} from "./event-detail-lookup";

describe("event detail lookup state", () => {
  it("waits for created events before showing not found for local meetup ids", () => {
    const lookup = {
      routeEventId: "created-movie-night",
      hasDemoEvent: false,
      hasCreatedEvent: false,
      createdEventsLoaded: false,
    };

    expect(shouldWaitForCreatedEventLookup(lookup)).toBe(true);
    expect(shouldShowMissingEvent(lookup)).toBe(false);
  });

  it("shows not found only after created event storage has loaded", () => {
    expect(
      shouldShowMissingEvent({
        routeEventId: "missing-event",
        hasDemoEvent: false,
        hasCreatedEvent: false,
        createdEventsLoaded: true,
      }),
    ).toBe(true);
  });

  it("treats an absent route id as not found after created event storage has loaded", () => {
    expect(
      shouldShowMissingEvent({
        routeEventId: undefined,
        hasDemoEvent: false,
        hasCreatedEvent: false,
        createdEventsLoaded: true,
      }),
    ).toBe(true);
  });
});
