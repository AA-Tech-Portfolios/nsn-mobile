import { describe, expect, it } from "vitest";

import { getHomeEventPreviewAsset, requiredPhotoStyleHomeEventIds } from "./home-event-preview-assets";

describe("home event preview assets", () => {
  it("requires photo-style assets for the primary visual meetup cards", () => {
    expect(requiredPhotoStyleHomeEventIds).toEqual([
      "picnic-easy-hangout",
      "beach-day-chill-vibes",
      "movie-night-watch-chat",
    ]);

    for (const eventId of requiredPhotoStyleHomeEventIds) {
      const asset = getHomeEventPreviewAsset(eventId);

      expect(asset?.presentation).toBe("photo-style");
      expect(asset?.isPlaceholder).toBe(false);
    }
  });
});
