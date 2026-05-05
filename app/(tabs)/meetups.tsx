import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { dayEvents, eveningEvents, nsnColors } from "@/lib/nsn-data";

const upcoming = [eveningEvents[0], dayEvents[0], eveningEvents[1]];

export default function MeetupsScreen() {
  const router = useRouter();
  const { isNightMode } = useAppSettings();
  const isDay = !isNightMode;

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, isDay && styles.dayTitle]}>My Meetups</Text>
        <Text style={[styles.subtitle, isDay && styles.dayMutedText]}>Small plans that feel easy to join.</Text>

        <View style={[styles.summaryCard, isDay && styles.dayCard]}>
          <Text style={styles.summaryLabel}>Next meetup</Text>
          <Text style={[styles.summaryTitle, isDay && styles.dayTitle]}>Movie Night — Watch + Chat</Text>
          <Text style={[styles.summaryCopy, isDay && styles.dayMutedText]}>Tonight at 7:00pm · Macquarie Centre Event Cinemas</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push("/event/movie-night-watch-chat")} style={styles.summaryButton}>
            <Text style={styles.summaryButtonText}>View details</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>Upcoming</Text>
        <View style={styles.list}>
          {upcoming.map((event, index) => (
            <TouchableOpacity key={event.id} activeOpacity={0.85} style={[styles.meetupCard, isDay && styles.dayCard]} onPress={() => router.push(`/event/${event.id}`)}>
              <View style={[styles.emojiBox, { backgroundColor: event.imageTone }]}><Text style={styles.emoji}>{event.emoji}</Text></View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{event.title}</Text>
                <Text style={[styles.cardMeta, isDay && styles.dayMutedText]}>{event.venue} · {event.time}</Text>
                <Text style={styles.cardCopy}>{event.people} · {index === 0 ? "Joined" : "Suggested"}</Text>
              </View>
              <Text style={[styles.chevron, isDay && styles.dayMutedText]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayContainer: { backgroundColor: "#EAF4FF" },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "800", lineHeight: 35 },
  dayTitle: { color: "#0B1220" },
  subtitle: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginBottom: 18 },
  dayMutedText: { color: "#52657F" },
  summaryCard: { borderRadius: 24, backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: "#2B4578", padding: 18, marginBottom: 22 },
  dayCard: { backgroundColor: "#F4F9FF", borderColor: "#AFC4E6" },
  summaryLabel: { color: nsnColors.day, fontSize: 12, fontWeight: "800", lineHeight: 17, marginBottom: 8 },
  summaryTitle: { color: nsnColors.text, fontSize: 21, fontWeight: "800", lineHeight: 27 },
  summaryCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 20, marginTop: 6, marginBottom: 14 },
  summaryButton: { alignSelf: "flex-start", backgroundColor: nsnColors.primary, borderRadius: 15, paddingHorizontal: 16, paddingVertical: 9 },
  summaryButtonText: { color: nsnColors.text, fontWeight: "800", fontSize: 13 },
  sectionTitle: { color: nsnColors.text, fontSize: 17, fontWeight: "800", lineHeight: 24, marginBottom: 10 },
  list: { gap: 10 },
  meetupCard: { minHeight: 88, borderRadius: 18, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, flexDirection: "row", alignItems: "center", padding: 10 },
  emojiBox: { width: 64, height: 64, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 29 },
  cardBody: { flex: 1, paddingHorizontal: 11 },
  cardTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 19 },
  cardMeta: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  cardCopy: { color: nsnColors.green, fontSize: 11, lineHeight: 16, marginTop: 3, fontWeight: "700" },
  chevron: { color: nsnColors.muted, fontSize: 30, lineHeight: 34 },
});
