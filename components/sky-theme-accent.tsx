import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { getSkyThemeMode, type SkyTheme } from "@/lib/sky-themes";

type SkyThemeAccentProps = {
  theme: SkyTheme;
  isNightMode: boolean;
  variant?: "band" | "preview" | "quiet";
  style?: StyleProp<ViewStyle>;
};

export function SkyThemeAccent({
  theme,
  isNightMode,
  variant = "band",
  style,
}: SkyThemeAccentProps) {
  if (theme.id === "default") {
    return null;
  }

  const mode = getSkyThemeMode(theme, isNightMode);
  const height = variant === "preview" ? 32 : variant === "quiet" ? 44 : 24;

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.root,
        styles[variant],
        {
          minHeight: height,
          backgroundColor: mode.surfaceTint,
          borderColor: mode.borderColor,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.haze,
          styles.hazeStart,
          { backgroundColor: mode.accentGradient[0], borderColor: mode.borderColor },
        ]}
      />
      <View style={[styles.haze, styles.hazeEnd, { backgroundColor: mode.accentGradient[1] }]} />
      <Text style={[styles.glyph, { color: mode.glyphColor }]}>{theme.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    position: "relative",
  },
  band: {
    borderRadius: 14,
    marginBottom: 12,
  },
  preview: {
    alignSelf: "stretch",
    borderRadius: 12,
    marginBottom: 8,
  },
  quiet: {
    borderRadius: 18,
    marginBottom: 16,
  },
  haze: {
    opacity: 0.44,
    position: "absolute",
  },
  hazeStart: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    height: 42,
    left: -10,
    top: -20,
    width: 120,
  },
  hazeEnd: {
    borderRadius: 999,
    bottom: -28,
    height: 56,
    right: -18,
    width: 148,
  },
  glyph: {
    fontSize: 15,
    fontWeight: "700",
    opacity: 0.72,
    position: "absolute",
    right: 12,
    top: 6,
  },
});
