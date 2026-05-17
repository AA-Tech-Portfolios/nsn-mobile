export const nsnSupportReadabilityColors = {
  darkSurface: "#0F1B2C",
  darkRaisedSurface: "#13243A",
  darkMutedText: "#C2CCE0",
  darkSubtleText: "#AEBBD1",
  lightSurface: "#FFFFFF",
  lightMutedText: "#3F5368",
  lightSubtleText: "#53677A",
  badgeText: "#FFE08A",
  badgeDisabledText: "#C8D3E4",
  darkBadgeBackground: "#2C2A1E",
  darkBadgeBorder: "#B99537",
  darkBadgeNeutralBackground: "#202A3A",
  darkBadgeNeutralBorder: "#8798B2",
  lightBadgeText: "#4F3900",
  lightBadgeBackground: "#FFF1B8",
  lightBadgeBorder: "#B98500",
  lightBadgeNeutralText: "#2D4664",
  lightBadgeNeutralBackground: "#E7EFF7",
  lightBadgeNeutralBorder: "#8EA6C2",
  darkWarningSurface: "#2D2B20",
  darkWarningText: "#FFE08A",
  darkWarningBody: "#FFF0B8",
  lightWarningSurface: "#FFF6DB",
  lightWarningText: "#674800",
  lightWarningBody: "#5C4308",
} as const;

const expandHex = (hex: string) => {
  const normalized = hex.replace("#", "");
  return normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;
};

const getRgbChannel = (hex: string, start: number) => parseInt(expandHex(hex).slice(start, start + 2), 16) / 255;

const getLinearChannel = (channel: number) =>
  channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

const getRelativeLuminance = (hex: string) => {
  const red = getLinearChannel(getRgbChannel(hex, 0));
  const green = getLinearChannel(getRgbChannel(hex, 2));
  const blue = getLinearChannel(getRgbChannel(hex, 4));

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export function getContrastRatio(foreground: string, background: string) {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}
