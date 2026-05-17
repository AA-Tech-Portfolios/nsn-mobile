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

export type HomeFitToScreenContext = {
  enabled: boolean;
  viewportWidth: number;
  viewportHeight: number;
};

export const homeLayoutPreferenceRoles = {
  primaryView: "Controls which Home sections appear.",
  layoutComfort: "Controls the spacing and density of the visible Home sections.",
  fitToScreen: "Adjusts dashboard spacing and layout to better fit your current screen size.",
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

export function shouldUseHomeFitToScreen({ enabled, viewportWidth, viewportHeight }: HomeFitToScreenContext): boolean {
  return enabled && viewportWidth >= 900 && (viewportHeight <= 860 || viewportWidth >= 1500);
}

export function getHomeFitToScreenPreset(name: HomeLayoutPresetName, context: HomeFitToScreenContext): HomeLayoutPreset {
  const base = getHomeLayoutPreset(name);

  if (!shouldUseHomeFitToScreen(context)) {
    return base;
  }

  const compact = homeLayoutPresets.Compact;
  const shortWindow = context.viewportHeight <= 820;
  const ratio = shortWindow ? 0.68 : 0.82;
  const reduce = (value: number, min: number) => Math.max(min, Math.round(value * ratio));

  return {
    ...base,
    sectionGap: reduce(base.sectionGap, shortWindow ? 4 : 6),
    cardPadding: reduce(base.cardPadding, shortWindow ? 7 : compact.cardPadding),
    cardMinHeight: reduce(base.cardMinHeight, shortWindow ? 58 : compact.cardMinHeight),
    utilityCardMinHeight: reduce(base.utilityCardMinHeight, shortWindow ? 42 : compact.utilityCardMinHeight),
    heroPaddingVertical: reduce(base.heroPaddingVertical, shortWindow ? 5 : 8),
    headerBottomGap: reduce(base.headerBottomGap, shortWindow ? 4 : compact.headerBottomGap),
    eventCardPadding: reduce(base.eventCardPadding, shortWindow ? 6 : compact.eventCardPadding),
    eventCardMinHeight: reduce(base.eventCardMinHeight, shortWindow ? 78 : compact.eventCardMinHeight),
    eventImageWidth: reduce(base.eventImageWidth, shortWindow ? 62 : compact.eventImageWidth),
    eventImageHeight: reduce(base.eventImageHeight, shortWindow ? 62 : compact.eventImageHeight),
    eventDescriptionLines: 1,
    chipGap: reduce(base.chipGap, compact.chipGap),
    chipPaddingHorizontal: reduce(base.chipPaddingHorizontal, compact.chipPaddingHorizontal),
    chipPaddingVertical: reduce(base.chipPaddingVertical, shortWindow ? 3 : compact.chipPaddingVertical),
    smallActionMinHeight: reduce(base.smallActionMinHeight, compact.smallActionMinHeight),
    mapHeight: shortWindow ? 76 : reduce(base.mapHeight, compact.mapHeight),
    mapCardMinHeight: shortWindow ? 150 : reduce(base.mapCardMinHeight, compact.mapCardMinHeight),
    desktopGridGap: reduce(base.desktopGridGap, shortWindow ? 5 : compact.desktopGridGap),
    mobileStackGap: reduce(base.mobileStackGap, shortWindow ? 5 : compact.mobileStackGap),
    panelMaxHeight: Math.min(base.panelMaxHeight, Math.max(420, context.viewportHeight - 190)),
    bottomPadding: shortWindow ? 12 : 20,
    screenPaddingTop: reduce(base.screenPaddingTop, shortWindow ? 4 : compact.screenPaddingTop),
  };
}
