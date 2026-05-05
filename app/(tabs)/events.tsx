import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { nsnColors } from "@/lib/nsn-data";

export default function EventsScreen() {
  const { isNightMode } = useAppSettings();
  const isDay = !isNightMode;

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <View style={[styles.container, isDay && styles.dayContainer]}>
        <Text style={[styles.title, isDay && styles.dayTitle]}>My Events</Text>

        <Text style={[styles.subtitle, isDay && styles.daySubtitle]}>
          Create your own experiences and invite others on your terms.
        </Text>

        <TouchableOpacity style={styles.createButton} activeOpacity={0.8}>
          <Text style={styles.createButtonText}>＋ Create Event</Text>
        </TouchableOpacity>

        <View style={[styles.card, isDay && styles.dayCard]}>
          <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>No events created yet</Text>

          <Text style={[styles.cardText, isDay && styles.daySubtitle]}>
            Host a coffee meetup, movie night, board games, walk, study session or anything that feels like you.
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
    color: "#52657F",
  },

  createButton: {
    backgroundColor: nsnColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  createButtonText: {
    color: nsnColors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    padding: 18,
  },
  dayCard: {
    backgroundColor: "#F4F9FF",
    borderColor: "#AFC4E6",
  },

  cardTitle: {
    color: nsnColors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },

  cardText: {
    color: nsnColors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});
