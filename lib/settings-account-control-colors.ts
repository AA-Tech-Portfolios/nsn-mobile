import { nsnSupportReadabilityColors } from "./support-readability";

export const accountControlToneColors = {
  pause: {
    dark: {
      border: "#FFD66E",
      surface: nsnSupportReadabilityColors.darkWarningSurface,
      cardBorder: "rgba(255,214,110,0.45)",
      cardSurface: "rgba(255,214,110,0.08)",
      text: nsnSupportReadabilityColors.darkWarningText,
      body: nsnSupportReadabilityColors.darkWarningBody,
    },
    light: {
      border: "#B98500",
      surface: nsnSupportReadabilityColors.lightWarningSurface,
      cardBorder: "#B98500",
      cardSurface: "#FFFDF2",
      text: nsnSupportReadabilityColors.lightWarningText,
      body: nsnSupportReadabilityColors.lightWarningBody,
    },
  },
  resume: {
    light: {
      border: "#55A96E",
      surface: "#E8F8EE",
      text: "#0F6B2F",
    },
  },
} as const;
