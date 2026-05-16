export type HomeLayoutPresetName = "Compact" | "Comfortable" | "Spacious";

export type HomeLayoutPreset = {
  name: HomeLayoutPresetName;
  sectionGap: number;
  cardPadding: number;
  cardRadius: number;
  cardMinHeight: number;
  utilityCardMinHeight: number;
  heroPaddingVertical: number;
  heroRadius: number;
  headerBottomGap: number;
  eventCardPadding: number;
  eventCardMinHeight: number;
  eventImageWidth: number;
  eventImageHeight: number;
  eventDescriptionLines: number;
  chipGap: number;
  chipPaddingHorizontal: number;
  chipPaddingVertical: number;
  smallActionMinHeight: number;
  tapTarget: number;
  mapHeight: number;
  mapCardMinHeight: number;
  desktopGridGap: number;
  mobileStackGap: number;
  panelMaxHeight: number;
  bottomPadding: number;
  screenPaddingTop: number;
};

export const homeLayoutPreferenceRoles = {
  primaryView: "Controls which Home sections appear.",
  layoutComfort: "Controls the spacing and density of the visible Home sections.",
} as const;

export const homeLayoutSectionCoverage = [
  "alphaTesterGuide",
  "weatherUpdate",
  "todayCard",
  "northShoreMap",
  "dayEvents",
  "nightEvents",
  "recommendedEvents",
  "searchNsn",
  "noiseGuide",
  "sectionVisibilityRows",
  "eventCards",
  "sectionHeaders",
  "chipsTagsAndSmallActions",
] as const;

const homeLayoutPresets: Record<HomeLayoutPresetName, HomeLayoutPreset> = {
  Compact: {
    name: "Compact",
    sectionGap: 8,
    cardPadding: 10,
    cardRadius: 16,
    cardMinHeight: 76,
    utilityCardMinHeight: 50,
    heroPaddingVertical: 12,
    heroRadius: 20,
    headerBottomGap: 8,
    eventCardPadding: 8,
    eventCardMinHeight: 108,
    eventImageWidth: 86,
    eventImageHeight: 86,
    eventDescriptionLines: 1,
    chipGap: 6,
    chipPaddingHorizontal: 9,
    chipPaddingVertical: 5,
    smallActionMinHeight: 34,
    tapTarget: 40,
    mapHeight: 126,
    mapCardMinHeight: 224,
    desktopGridGap: 8,
    mobileStackGap: 8,
    panelMaxHeight: 500,
    bottomPadding: 132,
    screenPaddingTop: 6,
  },
  Comfortable: {
    name: "Comfortable",
    sectionGap: 12,
    cardPadding: 14,
    cardRadius: 20,
    cardMinHeight: 92,
    utilityCardMinHeight: 58,
    heroPaddingVertical: 18,
    heroRadius: 24,
    headerBottomGap: 12,
    eventCardPadding: 10,
    eventCardMinHeight: 126,
    eventImageWidth: 104,
    eventImageHeight: 104,
    eventDescriptionLines: 2,
    chipGap: 8,
    chipPaddingHorizontal: 12,
    chipPaddingVertical: 7,
    smallActionMinHeight: 38,
    tapTarget: 44,
    mapHeight: 150,
    mapCardMinHeight: 266,
    desktopGridGap: 10,
    mobileStackGap: 10,
    panelMaxHeight: 560,
    bottomPadding: 148,
    screenPaddingTop: 12,
  },
  Spacious: {
    name: "Spacious",
    sectionGap: 18,
    cardPadding: 18,
    cardRadius: 24,
    cardMinHeight: 112,
    utilityCardMinHeight: 68,
    heroPaddingVertical: 24,
    heroRadius: 28,
    headerBottomGap: 16,
    eventCardPadding: 13,
    eventCardMinHeight: 148,
    eventImageWidth: 118,
    eventImageHeight: 118,
    eventDescriptionLines: 3,
    chipGap: 10,
    chipPaddingHorizontal: 14,
    chipPaddingVertical: 8,
    smallActionMinHeight: 44,
    tapTarget: 50,
    mapHeight: 184,
    mapCardMinHeight: 310,
    desktopGridGap: 14,
    mobileStackGap: 14,
    panelMaxHeight: 620,
    bottomPadding: 164,
    screenPaddingTop: 14,
  },
};

export function getHomeLayoutPreset(name: HomeLayoutPresetName): HomeLayoutPreset {
  return homeLayoutPresets[name];
}
