export type EventDetailHeroAssetKey =
  | "picnicBlanket"
  | "beach"
  | "movie"
  | "library"
  | "coffee"
  | "harbourWalk"
  | "boardGames"
  | "ramen"
  | "music";
export type RequiredEventDetailHeroId =
  | "library-calm-study"
  | "coffee-lane-cove"
  | "harbour-walk-waverton"
  | "picnic-easy-hangout"
  | "beach-day-chill-vibes"
  | "movie-night-watch-chat"
  | "board-games-coffee"
  | "ramen-small-table"
  | "quiet-music-listening";

export type EventDetailHeroAsset = {
  eventId: RequiredEventDetailHeroId;
  assetKey: EventDetailHeroAssetKey;
  presentation: "detail-hero";
  visualStyle: "photo-background";
  isPlaceholder: false;
};

export const requiredEventDetailHeroIds: readonly RequiredEventDetailHeroId[] = [
  "library-calm-study",
  "coffee-lane-cove",
  "harbour-walk-waverton",
  "picnic-easy-hangout",
  "beach-day-chill-vibes",
  "movie-night-watch-chat",
  "board-games-coffee",
  "ramen-small-table",
  "quiet-music-listening",
] as const;

const eventDetailHeroAssets: Record<RequiredEventDetailHeroId, EventDetailHeroAsset> = {
  "library-calm-study": {
    eventId: "library-calm-study",
    assetKey: "library",
    presentation: "detail-hero",
    visualStyle: "photo-background",
    isPlaceholder: false,
  },
  "coffee-lane-cove": {
    eventId: "coffee-lane-cove",
    assetKey: "coffee",
    presentation: "detail-hero",
    visualStyle: "photo-background",
    isPlaceholder: false,
  },
  "harbour-walk-waverton": {
    eventId: "harbour-walk-waverton",
    assetKey: "harbourWalk",
    presentation: "detail-hero",
    visualStyle: "photo-background",
    isPlaceholder: false,
  },
  "picnic-easy-hangout": {
    eventId: "picnic-easy-hangout",
    assetKey: "picnicBlanket",
    presentation: "detail-hero",
    visualStyle: "photo-background",
    isPlaceholder: false,
  },
  "beach-day-chill-vibes": {
    eventId: "beach-day-chill-vibes",
    assetKey: "beach",
    presentation: "detail-hero",
    visualStyle: "photo-background",
    isPlaceholder: false,
  },
  "movie-night-watch-chat": {
    eventId: "movie-night-watch-chat",
    assetKey: "movie",
    presentation: "detail-hero",
    visualStyle: "photo-background",
    isPlaceholder: false,
  },
  "board-games-coffee": {
    eventId: "board-games-coffee",
    assetKey: "boardGames",
    presentation: "detail-hero",
    visualStyle: "photo-background",
    isPlaceholder: false,
  },
  "ramen-small-table": {
    eventId: "ramen-small-table",
    assetKey: "ramen",
    presentation: "detail-hero",
    visualStyle: "photo-background",
    isPlaceholder: false,
  },
  "quiet-music-listening": {
    eventId: "quiet-music-listening",
    assetKey: "music",
    presentation: "detail-hero",
    visualStyle: "photo-background",
    isPlaceholder: false,
  },
};

export const getEventDetailHeroAsset = (eventId: string) =>
  eventDetailHeroAssets[eventId as RequiredEventDetailHeroId];
