export type SkyThemeId =
  | "default"
  | "sunset"
  | "night-sky"
  | "soft-clouds"
  | "sunrise"
  | "starlight"
  | "moonlight";

export type SkyThemeMode = {
  accentGradient: readonly [string, string, string];
  surfaceTint: string;
  borderColor: string;
  glyphColor: string;
  textOnAccent: string;
};

export type SkyTheme = {
  id: SkyThemeId;
  label: string;
  emoji: string;
  description: string;
  light: SkyThemeMode;
  dark: SkyThemeMode;
};

export const defaultSkyThemeId: SkyThemeId = "default";

export const skyThemes: readonly SkyTheme[] = [
  {
    id: "default",
    label: "Default NSN",
    emoji: "NSN",
    description: "Keeps the standard NSN appearance with no extra sky accent.",
    light: {
      accentGradient: ["#FFFFFF", "#F8FAFC", "#FFFFFF"],
      surfaceTint: "#FFFFFF",
      borderColor: "#D7E0EA",
      glyphColor: "#536C9E",
      textOnAccent: "#0B1220",
    },
    dark: {
      accentGradient: ["#0B1626", "#10213A", "#0B1626"],
      surfaceTint: "#0B1626",
      borderColor: "rgba(148,163,184,0.22)",
      glyphColor: "#7CAAC9",
      textOnAccent: "#F8FAFC",
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    emoji: "🌅",
    description: "A gentle peach-and-sky accent for warm, low-pressure moments.",
    light: {
      accentGradient: ["#FFFFFF", "#FFF7F1", "#F8FBFF"],
      surfaceTint: "#FFF7F1",
      borderColor: "#F1D8C8",
      glyphColor: "#C06C4E",
      textOnAccent: "#172033",
    },
    dark: {
      accentGradient: ["#101929", "#2A1722", "#142034"],
      surfaceTint: "#2A1722",
      borderColor: "rgba(244,183,151,0.28)",
      glyphColor: "#F4B797",
      textOnAccent: "#FFF7F1",
    },
  },
  {
    id: "night-sky",
    label: "Night Sky",
    emoji: "🌌",
    description: "A quiet indigo accent that stays subtle in both Day and Night modes.",
    light: {
      accentGradient: ["#FFFFFF", "#F5F7FF", "#F8FCFF"],
      surfaceTint: "#F5F7FF",
      borderColor: "#D9E0F4",
      glyphColor: "#536C9E",
      textOnAccent: "#101827",
    },
    dark: {
      accentGradient: ["#081323", "#121B35", "#0B1626"],
      surfaceTint: "#121B35",
      borderColor: "rgba(124,170,201,0.26)",
      glyphColor: "#9FC7FF",
      textOnAccent: "#F8FAFC",
    },
  },
  {
    id: "soft-clouds",
    label: "Soft Clouds",
    emoji: "☁️",
    description: "A pale airy accent for clean headers and calm empty states.",
    light: {
      accentGradient: ["#FFFFFF", "#F8FBFF", "#FFFFFF"],
      surfaceTint: "#F8FBFF",
      borderColor: "#D8E4F0",
      glyphColor: "#6F89A8",
      textOnAccent: "#0B1220",
    },
    dark: {
      accentGradient: ["#0B1626", "#172437", "#0F1B2C"],
      surfaceTint: "#172437",
      borderColor: "rgba(166,177,199,0.24)",
      glyphColor: "#A8B7DA",
      textOnAccent: "#F8FAFC",
    },
  },
  {
    id: "sunrise",
    label: "Sunrise",
    emoji: "🌄",
    description: "A soft morning accent for optimistic, grounded starts.",
    light: {
      accentGradient: ["#FFFFFF", "#FFF9E8", "#F6FBFF"],
      surfaceTint: "#FFF9E8",
      borderColor: "#EBDFAF",
      glyphColor: "#B9851F",
      textOnAccent: "#172033",
    },
    dark: {
      accentGradient: ["#0B1626", "#252012", "#122033"],
      surfaceTint: "#252012",
      borderColor: "rgba(235,203,130,0.28)",
      glyphColor: "#EBCB82",
      textOnAccent: "#FFF9E8",
    },
  },
  {
    id: "starlight",
    label: "Starlight",
    emoji: "⭐",
    description: "A tiny sparkle accent without turning screens into night-only spaces.",
    light: {
      accentGradient: ["#FFFFFF", "#FAF8FF", "#FFFFFF"],
      surfaceTint: "#FAF8FF",
      borderColor: "#E4DDF4",
      glyphColor: "#7764A8",
      textOnAccent: "#101827",
    },
    dark: {
      accentGradient: ["#0B1626", "#1B1835", "#101827"],
      surfaceTint: "#1B1835",
      borderColor: "rgba(184,167,255,0.25)",
      glyphColor: "#B8A7FF",
      textOnAccent: "#F8FAFC",
    },
  },
  {
    id: "moonlight",
    label: "Moonlight",
    emoji: "🌙",
    description: "A cool moonlit accent for quiet moments, not a nighttime-only signal.",
    light: {
      accentGradient: ["#FFFFFF", "#F7FAFD", "#F9F8FF"],
      surfaceTint: "#F7FAFD",
      borderColor: "#DDE6F0",
      glyphColor: "#637B9F",
      textOnAccent: "#0B1220",
    },
    dark: {
      accentGradient: ["#07111F", "#152131", "#111827"],
      surfaceTint: "#152131",
      borderColor: "rgba(216,230,240,0.22)",
      glyphColor: "#D8E6F0",
      textOnAccent: "#F8FAFC",
    },
  },
] as const;

export function normalizeSkyThemeId(value: unknown): SkyThemeId {
  return typeof value === "string" && skyThemes.some((theme) => theme.id === value)
    ? (value as SkyThemeId)
    : defaultSkyThemeId;
}

export function getSkyTheme(id: unknown): SkyTheme {
  const normalizedId = normalizeSkyThemeId(id);
  return skyThemes.find((theme) => theme.id === normalizedId) ?? skyThemes[0];
}

export function getSkyThemeMode(theme: SkyTheme, isNightMode: boolean): SkyThemeMode {
  return isNightMode ? theme.dark : theme.light;
}
