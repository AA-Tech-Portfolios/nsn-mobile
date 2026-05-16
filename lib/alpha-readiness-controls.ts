export type AlphaActionKind = "comingSoon" | "demo" | "local";
export type AlphaActionLabel = "Coming soon" | "Demo" | "Saved locally";

export type ProfileDrawerPanel =
  | "preferences"
  | "comfortTrust"
  | "personalityPresence"
  | "backgroundCommunity"
  | "calendarMoments"
  | "foodBeverage"
  | "hobbiesInterests"
  | "transportPreferences"
  | "contactPreferencePanel"
  | "locationPreferencePanel";

export type ProfilePreferenceSection =
  | "overview"
  | "comfort"
  | "personality"
  | "background"
  | "calendar"
  | "food"
  | "interests"
  | "transport"
  | "contact"
  | "location";

export function getAlphaActionLabel(kind: AlphaActionKind): AlphaActionLabel {
  if (kind === "comingSoon") return "Coming soon";
  if (kind === "demo") return "Demo";
  return "Saved locally";
}

export function getAlphaRecentStatusCopy(label?: AlphaActionLabel) {
  if (label === "Demo") return "Demo saved locally";
  if (label === "Coming soon") return "Coming soon";
  return "Saved locally";
}

export function getProfilePreferenceDestination({
  panel,
  platform,
  section,
  width,
}: {
  panel: ProfileDrawerPanel;
  platform: string;
  section: ProfilePreferenceSection;
  width: number;
}) {
  if (platform === "web" && width >= 900) {
    return {
      closesDrawer: true,
      kind: "full-view" as const,
      section,
    };
  }

  return {
    closesDrawer: false,
    kind: "drawer-panel" as const,
    panel,
  };
}

export function getDependentSettingAvailability({
  copy,
  disabledCopy,
  enabled,
}: {
  copy: string;
  disabledCopy: string;
  enabled: boolean;
}) {
  if (enabled) {
    return {
      accessibilityHint: copy,
      copy,
      disabled: false,
    };
  }

  return {
    accessibilityHint: disabledCopy,
    copy: `${copy} ${disabledCopy}`,
    disabled: true,
  };
}

export function getOnboardingAboutRequirement({
  hasAllowedName,
  hasInterests,
  hasLocalArea,
  hasPreferredAgeRange,
  isAdult,
}: {
  hasAllowedName: boolean;
  hasInterests: boolean;
  hasLocalArea: boolean;
  hasPreferredAgeRange: boolean;
  isAdult: boolean;
}) {
  if (!hasAllowedName) return "Choose an allowed name or nickname to continue.";
  if (!isAdult) return "Enter an age between 18 and 95 to continue.";
  if (!hasPreferredAgeRange) return "Choose a valid adult preferred age range to continue.";
  if (!hasLocalArea) return "Choose a suburb or local area to continue.";
  if (!hasInterests) return "Choose at least one first-meetup interest to continue.";
  return null;
}
