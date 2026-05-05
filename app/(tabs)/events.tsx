import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { nsnColors } from "@/lib/nsn-data";

export default function EventsScreen() {
  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <View style={styles.container}>
        <Text style={styles.title}>My Events</Text>

        <Text style={styles.subtitle}>
          Create your own experiences and invite others on your terms.
        </Text>

        <TouchableOpacity style={styles.createButton} activeOpacity={0.8}>
          <Text style={styles.createButtonText}>＋ Create Event</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>No events created yet</Text>

          <Text style={styles.cardText}>
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