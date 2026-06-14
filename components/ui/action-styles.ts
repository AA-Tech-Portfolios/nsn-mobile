import type { TextStyle, ViewStyle } from "react-native";

import { nsnColors } from "@/lib/nsn-data";

export const nsnActionButtonStyles = {
  primary: {
    minHeight: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#5E8FD6",
    backgroundColor: nsnColors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  } satisfies ViewStyle,
  secondary: {
    minHeight: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  } satisfies ViewStyle,
  quietUtility: {
    minHeight: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.025)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  } satisfies ViewStyle,
  selectedPill: {
    borderColor: nsnColors.selectedChipBorder,
    backgroundColor: nsnColors.selectedChip,
  } satisfies ViewStyle,
};

export const nsnActionTextStyles = {
  primary: {
    color: "#FFFFFF",
    fontWeight: "900",
    textAlign: "center",
  } satisfies TextStyle,
  secondary: {
    color: nsnColors.text,
    fontWeight: "900",
    textAlign: "center",
  } satisfies TextStyle,
  quietUtility: {
    color: "#A8B7DA",
    fontWeight: "900",
    textAlign: "center",
  } satisfies TextStyle,
  selectedPill: {
    color: nsnColors.selectedChipText,
  } satisfies TextStyle,
};
