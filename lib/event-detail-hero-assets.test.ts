import { describe, expect, it } from "vitest";

import {
  getEventDetailHeroAsset,
  requiredEventDetailHeroIds,
} from "./event-detail-hero-assets";
import { allEvents } from "./nsn-data";

describe("event detail hero assets", () => {
  it("keeps local hero coverage for every seeded demo event detail page", () => {
    expect(requiredEventDetailHeroIds).toEqual([
      "library-calm-study",
      "coffee-lane-cove",
      "harbour-walk-waverton",
      "picnic-easy-hangout",
      "beach-day-chill-vibes",
      "movie-night-watch-chat",
      "board-games-coffee",
      "ramen-small-table",
      "quiet-music-listening",
    ]);

    for (const eventId of allEvents.map((event) => event.id)) {
      const asset = getEventDetailHeroAsset(eventId);

      expect(asset?.presentation).toBe("detail-hero");
      expect(asset?.visualStyle).toBe("photo-background");
      expect(asset?.isPlaceholder).toBe(false);
    }
  });

  it("uses calm fallback categories for detail heroes without dedicated artwork", () => {
    expect(getEventDetailHeroAsset("coffee-lane-cove")?.assetKey).toBe("coffee");
    expect(getEventDetailHeroAsset("board-games-coffee")?.assetKey).toBe("boardGames");
    expect(getEventDetailHeroAsset("ramen-small-table")?.assetKey).toBe("ramen");
    expect(getEventDetailHeroAsset("library-calm-study")?.assetKey).toBe("library");
    expect(getEventDetailHeroAsset("quiet-music-listening")?.assetKey).toBe("music");
  });

  it("uses dedicated hero photos for picnic, harbour walk, and beach", () => {
    expect(getEventDetailHeroAsset("harbour-walk-waverton")?.assetKey).toBe("harbourWalk");
    expect(getEventDetailHeroAsset("picnic-easy-hangout")?.assetKey).toBe("picnicBlanket");
    expect(getEventDetailHeroAsset("beach-day-chill-vibes")?.assetKey).toBe("beach");
  });
});
