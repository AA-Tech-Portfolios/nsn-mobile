import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Stack, useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { movieNight, nsnColors } from "@/lib/nsn-data";

export default function EventDetailsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={styles.iconButton}>
            <IconSymbol name="chevron.left" color={nsnColors.text} size={26} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity activeOpacity={0.75} style={styles.iconButton}>
              <IconSymbol name="share" color={nsnColors.text} size={22} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.75} style={styles.iconButton}>
              <IconSymbol name="more" color={nsnColors.text} size={23} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.heroPanel}>
          <View style={styles.eventAvatar}>
            <Text style={styles.avatarEmoji}>{movieNight.emoji}</Text>
          </View>
          <Text style={styles.title}>Movie Night —{`\n`}Watch + Chat</Text>
          <View style={styles.tagRow}>
            <Text style={styles.primaryChip}>Indoor</Text>
            <Text style={styles.quietChip}>☽ Quiet</Text>
          </View>
        </View>

        <View style={styles.metaStack}>
          <Text style={styles.metaLine}>⌖ Macquarie Centre Event Cinemas</Text>
          <Text style={styles.metaLine}>▣ Saturday, 24 May · 7:00pm</Text>
          <Text style={styles.metaLine}>♧ 2–4 people</Text>
        </View>

        <Text style={styles.description}>Watch first, optional chat after if it feels right. Perfect for low-pressure meetups.</Text>

        <TouchableOpacity activeOpacity={0.86} style={styles.weatherCard}>
          <View>
            <Text style={styles.weatherTitle}>☀ Weather update</Text>
            <Text style={styles.weatherCopy}>Rain expected in the evening. This is an indoor meetup.</Text>
          </View>
          <Text style={styles.weatherIcon}>☁️</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>What to expect</Text>
        <View style={styles.expectGrid}>
          <View style={styles.expectCard}>
            <Text style={styles.expectIcon}>◇</Text>
            <Text style={styles.expectTitle}>Low pressure</Text>
            <Text style={styles.expectCopy}>No forced talking</Text>
          </View>
          <View style={styles.expectCard}>
            <Text style={styles.expectIcon}>◌</Text>
            <Text style={styles.expectTitle}>Shared experience</Text>
            <Text style={styles.expectCopy}>Watch together</Text>
          </View>
          <View style={styles.expectCard}>
            <Text style={styles.expectIcon}>↺</Text>
            <Text style={styles.expectTitle}>Flexible</Text>
            <Text style={styles.expectCopy}>Chat after if it feels right</Text>
          </View>
        </View>

        <View style={styles.meetingPanel}>
          <Text style={styles.sectionTitle}>Meeting point</Text>
          <Text style={styles.meetingCopy}>Meet at Event Cinemas ticket counter at 6:50pm. We’ll grab seats together.</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push({ pathname: "/(tabs)/chats" })}
          style={styles.joinButton}
        >
          <Text style={styles.joinText}>Join Meetup</Text>
        </TouchableOpacity>
        <Text style={styles.spotsText}>3 spots left</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  topActions: { flexDirection: "row", gap: 8 },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: nsnColors.border },
  heroPanel: { alignItems: "center", borderRadius: 28, paddingTop: 8, paddingBottom: 22, backgroundColor: "#061121", borderWidth: 1, borderColor: "rgba(56,72,255,0.22)", marginBottom: 18 },
  eventAvatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#21123E", borderWidth: 2, borderColor: nsnColors.primary, alignItems: "center", justifyContent: "center", marginTop: -2, marginBottom: 18 },
  avatarEmoji: { fontSize: 43 },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "800", textAlign: "center", letterSpacing: -0.5, lineHeight: 34 },
  tagRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  primaryChip: { color: nsnColors.text, fontSize: 12, fontWeight: "800", backgroundColor: nsnColors.primary, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 14, overflow: "hidden" },
  quietChip: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", backgroundColor: "rgba(255,255,255,0.06)", paddingHorizontal: 13, paddingVertical: 7, borderRadius: 14, overflow: "hidden" },
  metaStack: { gap: 7, marginBottom: 12 },
  metaLine: { color: nsnColors.text, fontSize: 14, lineHeight: 20 },
  description: { color: nsnColors.text, fontSize: 15, lineHeight: 23, marginBottom: 14 },
  weatherCard: { minHeight: 78, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 18, paddingHorizontal: 16, paddingVertical: 13, backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: "#284476", marginBottom: 19 },
  weatherTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  weatherCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, maxWidth: 250 },
  weatherIcon: { fontSize: 28 },
  sectionTitle: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 23, marginBottom: 10 },
  expectGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  expectCard: { width: "48%", minHeight: 82, borderRadius: 16, padding: 13, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border },
  expectIcon: { color: "#7FA9FF", fontSize: 18, marginBottom: 4 },
  expectTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "800", lineHeight: 18 },
  expectCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 16, marginTop: 1 },
  meetingPanel: { borderTopWidth: 1, borderColor: nsnColors.border, paddingTop: 14, marginTop: 2, marginBottom: 18 },
  meetingCopy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
  joinButton: { height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: nsnColors.primary },
  joinText: { color: nsnColors.text, fontSize: 16, fontWeight: "800" },
  spotsText: { color: nsnColors.muted, textAlign: "center", marginTop: 10, fontSize: 13, lineHeight: 19 },
});
