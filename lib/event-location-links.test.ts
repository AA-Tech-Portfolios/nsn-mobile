import { describe, expect, it } from "vitest";

import { buildEventLocationSearchUrl } from "./event-location-links";

describe("event location links", () => {
  it("builds a maps search URL for an event venue", () => {
    expect(buildEventLocationSearchUrl("Lane Cove Village")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Lane%20Cove%20Village",
    );
  });

  it("keeps the search useful when an area is available", () => {
    expect(buildEventLocationSearchUrl("Event Cinemas", "Macquarie Centre")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Event%20Cinemas%20Macquarie%20Centre",
    );
  });

  it("supports preferred map apps without implying live tracking", () => {
    expect(buildEventLocationSearchUrl("Event Cinemas", "Macquarie Centre", "system-default")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Event%20Cinemas%20Macquarie%20Centre",
    );
    expect(buildEventLocationSearchUrl("Event Cinemas", "Macquarie Centre", "google-maps")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Event%20Cinemas%20Macquarie%20Centre",
    );
    expect(buildEventLocationSearchUrl("Event Cinemas", "Macquarie Centre", "apple-maps")).toBe(
      "https://maps.apple.com/?q=Event%20Cinemas%20Macquarie%20Centre",
    );
    expect(buildEventLocationSearchUrl("Event Cinemas", "Macquarie Centre", "waze")).toBe(
      "https://waze.com/ul?q=Event%20Cinemas%20Macquarie%20Centre",
    );
  });
});
