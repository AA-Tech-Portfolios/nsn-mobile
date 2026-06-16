export type HomeEventPreviewAssetKey =
  | "picnic-list"
  | "beach-list"
  | "beach-photo-list"
  | "library-list"
  | "coffee-list"
  | "walk-list"
  | "harbour-walk-list"
  | "movie-list"
  | "board-games-list"
  | "ramen-list"
  | "music-list";

export type RequiredHomeEventPreviewId =
  | "picnic-easy-hangout"
  | "beach-day-chill-vibes"
  | "library-calm-study"
  | "coffee-lane-cove"
  | "harbour-walk-waverton"
  | "movie-night-watch-chat"
  | "board-games-coffee"
  | "ramen-small-table"
  | "quiet-music-listening";

export type HomeEventPreviewAsset = {
  eventId: RequiredHomeEventPreviewId;
  assetKey: HomeEventPreviewAssetKey;
  presentation: "list-thumbnail";
  isPlaceholder: false;
};

export const requiredHomeEventPreviewIds: readonly RequiredHomeEventPreviewId[] = [
  "picnic-easy-hangout",
  "beach-day-chill-vibes",
  "library-calm-study",
  "coffee-lane-cove",
  "harbour-walk-waverton",
  "movie-night-watch-chat",
  "board-games-coffee",
  "ramen-small-table",
  "quiet-music-listening",
] as const;

const homeEventPreviewAssets: Record<RequiredHomeEventPreviewId, HomeEventPreviewAsset> = {
  "picnic-easy-hangout": {
    eventId: "picnic-easy-hangout",
    assetKey: "picnic-list",
    presentation: "list-thumbnail",
    isPlaceholder: false,
  },
  "beach-day-chill-vibes": {
    eventId: "beach-day-chill-vibes",
    assetKey: "beach-photo-list",
    presentation: "list-thumbnail",
    isPlaceholder: false,
  },
  "library-calm-study": {
    eventId: "library-calm-study",
    assetKey: "library-list",
    presentation: "list-thumbnail",
    isPlaceholder: false,
  },
  "coffee-lane-cove": {
    eventId: "coffee-lane-cove",
    assetKey: "coffee-list",
    presentation: "list-thumbnail",
    isPlaceholder: false,
  },
  "harbour-walk-waverton": {
    eventId: "harbour-walk-waverton",
    assetKey: "harbour-walk-list",
    presentation: "list-thumbnail",
    isPlaceholder: false,
  },
  "movie-night-watch-chat": {
    eventId: "movie-night-watch-chat",
    assetKey: "movie-list",
    presentation: "list-thumbnail",
    isPlaceholder: false,
  },
  "board-games-coffee": {
    eventId: "board-games-coffee",
    assetKey: "board-games-list",
    presentation: "list-thumbnail",
    isPlaceholder: false,
  },
  "ramen-small-table": {
    eventId: "ramen-small-table",
    assetKey: "ramen-list",
    presentation: "list-thumbnail",
    isPlaceholder: false,
  },
  "quiet-music-listening": {
    eventId: "quiet-music-listening",
    assetKey: "music-list",
    presentation: "list-thumbnail",
    isPlaceholder: false,
  },
};

export const getHomeEventPreviewAsset = (eventId: string) =>
  homeEventPreviewAssets[eventId as RequiredHomeEventPreviewId];
