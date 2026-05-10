import type { ViewStyle, TextStyle } from "react-native";

export type BrandThemeId = "nsn" | "softhello";
export type BrandLayoutDensity = "friendly" | "premium";

export type BrandThemeTokens = {
  id: BrandThemeId;
  name: string;
  shortName: string;
  availability: "default" | "feature-flagged";
  tone: string;
  logo: {
    wordmark: string;
    monogram: string;
    signal: string;
  };
  spacing: {
    screenX: number;
    screenY: number;
    sectionGap: number;
    cardGap: number;
    cardPadding: number;
    compactPadding: number;
  };
  radius: {
    card: number;
    panel: number;
    control: number;
    chip: number;
    avatar: number;
  };
  typography: {
    title: Pick<TextStyle, "fontSize" | "lineHeight" | "fontWeight">;
    sectionTitle: Pick<TextStyle, "fontSize" | "lineHeight" | "fontWeight">;
    body: Pick<TextStyle, "fontSize" | "lineHeight" | "fontWeight">;
    label: Pick<TextStyle, "fontSize" | "lineHeight" | "fontWeight">;
    caption: Pick<TextStyle, "fontSize" | "lineHeight" | "fontWeight">;
  };
  layout: {
    density: BrandLayoutDensity;
    profileMaxWidth: number | `${number}%`;
    cardMaxWidth: number | `${number}%`;
    dashboardRailWidth: number;
    dashboardContentGap: number;
  };
};

export const isSoftHelloThemeEnabled = process.env.EXPO_PUBLIC_ENABLE_SOFTHELLO_THEME === "true";

export const brandThemes: Record<BrandThemeId, BrandThemeTokens> = {
  nsn: {
    id: "nsn",
    name: "North Shore Nights",
    shortName: "NSN",
    availability: "default",
    tone: "Community-first, friendly local, slightly playful.",
    logo: {
      wordmark: "North Shore Nights",
      monogram: "NSN",
      signal: "Local pilot",
    },
    spacing: {
      screenX: 20,
      screenY: 18,
      sectionGap: 16,
      cardGap: 12,
      cardPadding: 14,
      compactPadding: 10,
    },
    radius: {
      card: 18,
      panel: 20,
      control: 14,
      chip: 14,
      avatar: 52,
    },
    typography: {
      title: { fontSize: 26, lineHeight: 33, fontWeight: "800" },
      sectionTitle: { fontSize: 16, lineHeight: 23, fontWeight: "800" },
      body: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
      label: { fontSize: 13, lineHeight: 18, fontWeight: "900" },
      caption: { fontSize: 12, lineHeight: 17, fontWeight: "800" },
    },
    layout: {
      density: "friendly",
      profileMaxWidth: 1120,
      cardMaxWidth: 370,
      dashboardRailWidth: 0,
      dashboardContentGap: 16,
    },
  },
  softhello: {
    id: "softhello",
    name: "SoftHello",
    shortName: "SH",
    availability: "feature-flagged",
    tone: "Premium, quieter, more spacious global experience.",
    logo: {
      wordmark: "SoftHello",
      monogram: "SH",
      signal: "Future theme",
    },
    spacing: {
      screenX: 28,
      screenY: 26,
      sectionGap: 24,
      cardGap: 16,
      cardPadding: 20,
      compactPadding: 12,
    },
    radius: {
      card: 12,
      panel: 14,
      control: 10,
      chip: 10,
      avatar: 48,
    },
    typography: {
      title: { fontSize: 24, lineHeight: 31, fontWeight: "800" },
      sectionTitle: { fontSize: 15, lineHeight: 22, fontWeight: "800" },
      body: { fontSize: 14, lineHeight: 22, fontWeight: "400" },
      label: { fontSize: 12, lineHeight: 17, fontWeight: "900" },
      caption: { fontSize: 12, lineHeight: 18, fontWeight: "700" },
    },
    layout: {
      density: "premium",
      profileMaxWidth: 1180,
      cardMaxWidth: 420,
      dashboardRailWidth: 280,
      dashboardContentGap: 24,
    },
  },
};

export function normalizeBrandThemeId(value?: string | null): BrandThemeId {
  if (value === "softhello" && isSoftHelloThemeEnabled) return "softhello";
  return "nsn";
}

export function getBrandTheme(value?: string | null) {
  return brandThemes[normalizeBrandThemeId(value)];
}

export function getBrandCardStyle(theme: BrandThemeTokens): ViewStyle {
  return {
    borderRadius: theme.radius.card,
    padding: theme.spacing.cardPadding,
    gap: theme.spacing.cardGap,
  };
}
