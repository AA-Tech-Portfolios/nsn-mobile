import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import type { GuideTip } from "@/lib/guides-and-tips";
import { nsnColors } from "@/lib/nsn-data";

type GuidesAndTipsCardProps = {
  tip: GuideTip;
  isDay?: boolean;
  onDismiss: () => void;
};

export function GuidesAndTipsCard({ tip, isDay = false, onDismiss }: GuidesAndTipsCardProps) {
  return (
    <View style={[styles.card, isDay && styles.dayCard]}>
      <View style={[styles.iconBubble, isDay && styles.dayIconBubble]}>
        <IconSymbol name="lightbulb" color={isDay ? "#445E93" : "#A8B7DA"} size={18} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.label, isDay && styles.dayMutedText]}>{tip.label}</Text>
        <Text style={[styles.copy, isDay && styles.dayTitle]}>{tip.copy}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.78}
        onPress={onDismiss}
        style={[styles.dismissButton, isDay && styles.dayDismissButton]}
        accessibilityRole="button"
        accessibilityLabel="Dismiss guidance tip"
      >
        <Text style={[styles.dismissText, isDay && styles.dayDismissText]}>Hide</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.035)",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 14,
  },
  dayCard: {
    borderColor: "#C5D0DA",
    backgroundColor: "#F5F8FA",
  },
  iconBubble: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(168,183,218,0.12)",
  },
  dayIconBubble: {
    backgroundColor: "#E8EEF5",
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    color: nsnColors.muted,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
  },
  copy: {
    color: nsnColors.text,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  dayTitle: {
    color: "#0B1220",
  },
  dayMutedText: {
    color: "#53677A",
  },
  dismissButton: {
    minHeight: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: nsnColors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  dayDismissButton: {
    borderColor: "#C5D0DA",
    backgroundColor: "#FFFFFF",
  },
  dismissText: {
    color: "#A8B7DA",
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
  },
  dayDismissText: {
    color: "#445E93",
  },
});
