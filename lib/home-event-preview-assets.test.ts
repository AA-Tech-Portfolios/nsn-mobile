import { describe, expect, it } from "vitest";

import {
  getHomeEventPreviewAsset,
  requiredHomeEventPreviewIds,
} from "./home-event-preview-assets";
import { allEvents } from "./nsn-data";

describe("home event preview assets", () => {
  it("keeps list thumbnails separate from detail hero artwork", () => {
    expect(requiredHomeEventPreviewIds).toEqual(allEvents.map((event) => event.id));

    for (const eventId of requiredHomeEventPreviewIds) {
      const asset = getHomeEventPreviewAsset(eventId);

      expect(asset?.presentation).toBe("list-thumbnail");
      expect(asset?.isPlaceholder).toBe(false);
    }
  });

  it("restores the real photo thumbnail keys for the event selection menu", () => {
    expect(getHomeEventPreviewAsset("movie-night-watch-chat")?.assetKey).toBe("movie-list");
    expect(getHomeEventPreviewAsset("harbour-walk-waverton")?.assetKey).toBe("harbour-walk-list");
    expect(getHomeEventPreviewAsset("beach-day-chill-vibes")?.assetKey).toBe("beach-photo-list");
    expect(getHomeEventPreviewAsset("quiet-music-listening")?.assetKey).toBe("music-list");
    expect(getHomeEventPreviewAsset("board-games-coffee")?.assetKey).toBe("board-games-list");
  });
});
