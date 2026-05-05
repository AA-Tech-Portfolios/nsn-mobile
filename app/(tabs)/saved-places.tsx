import { View, Text, StyleSheet } from "react-native";

import { useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { nsnColors } from "@/lib/nsn-data";

export default function SavedPlacesScreen() {
  const { isNightMode } = useAppSettings();
  const isDay = !isNightMode;

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <View style={[styles.container, isDay && styles.dayContainer]}>
        <Text style={[styles.title, isDay && styles.dayTitle]}>Saved Places</Text>
        <Text style={[styles.subtitle, isDay && styles.daySubtitle]}>
          Your favourite cafés, parks, libraries and quiet meetup spots will appear here.
        </Text>

        <View style={[styles.emptyCard, isDay && styles.dayCard]}>
          <Text style={[styles.emptyTitle, isDay && styles.dayTitle]}>No saved places yet</Text>
          <Text style={[styles.emptyText, isDay && styles.daySubtitle]}>
            Later, you’ll be able to save places from meetup pages or map suggestions.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nsnColors.background,
    padding: 20,
  },
  dayContainer: {
    backgroundColor: "#EAF4FF",
  },
  title: {
    color: nsnColors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  dayTitle: {
    color: "#0B1220",
  },
  subtitle: {
    color: nsnColors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  daySubtitle: {
    color: "#3B4A63",
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    borderRadius: 18,
    padding: 18,
  },
  dayCard: {
    backgroundColor: "#DCEEFF",
    borderColor: "#B8C9E6",
  },
  emptyTitle: {
    color: nsnColors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
  emptyText: {
    color: nsnColors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
