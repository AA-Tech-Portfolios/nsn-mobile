import { View, Text, StyleSheet } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { nsnColors } from "@/lib/nsn-data";

export default function SavedPlacesScreen() {
  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <View style={styles.container}>
        <Text style={styles.title}>Saved Places</Text>
        <Text style={styles.subtitle}>
          Your favourite cafés, parks, libraries and quiet meetup spots will appear here.
        </Text>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No saved places yet</Text>
          <Text style={styles.emptyText}>
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
  title: {
    color: nsnColors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    color: nsnColors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    borderRadius: 18,
    padding: 18,
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