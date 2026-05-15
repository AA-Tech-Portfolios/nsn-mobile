export type HomeEventPreviewAssetKey = "picnic" | "beach" | "movie";
export type RequiredPhotoStyleHomeEventId = "picnic-easy-hangout" | "beach-day-chill-vibes" | "movie-night-watch-chat";

export type HomeEventPreviewAsset = {
  eventId: RequiredPhotoStyleHomeEventId;
  assetKey: HomeEventPreviewAssetKey;
  presentation: "photo-style";
  isPlaceholder: false;
};

export const requiredPhotoStyleHomeEventIds: readonly RequiredPhotoStyleHomeEventId[] = [
  "picnic-easy-hangout",
  "beach-day-chill-vibes",
  "movie-night-watch-chat",
] as const;

const homeEventPreviewAssets: Record<RequiredPhotoStyleHomeEventId, HomeEventPreviewAsset> = {
  "picnic-easy-hangout": {
    eventId: "picnic-easy-hangout",
    assetKey: "picnic",
    presentation: "photo-style",
    isPlaceholder: false,
  },
  "beach-day-chill-vibes": {
    eventId: "beach-day-chill-vibes",
    assetKey: "beach",
    presentation: "photo-style",
    isPlaceholder: false,
  },
  "movie-night-watch-chat": {
    eventId: "movie-night-watch-chat",
    assetKey: "movie",
    presentation: "photo-style",
    isPlaceholder: false,
  },
};

export const getHomeEventPreviewAsset = (eventId: string) =>
  homeEventPreviewAssets[eventId as RequiredPhotoStyleHomeEventId];
