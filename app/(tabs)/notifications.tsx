import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { nsnColors } from "@/lib/nsn-data";

const alerts = [
  { icon: "🌧", title: "Rain expected later", copy: "Picnic plans may need an indoor fallback. We’ll suggest options nearby.", tone: "Weather" },
  { icon: "🍿", title: "Movie Night starts at 7:00pm", copy: "Meet at the Event Cinemas ticket counter around 6:50pm.", tone: "Meetup" },
  { icon: "🌙", title: "Quiet evening events available", copy: "Low-noise indoor meetups are open around Chatswood and Macquarie Park.", tone: "Night" },
];

export default function NotificationsScreen() {
  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Weather-aware prompts and gentle meetup reminders.</Text>

        <View style={styles.weatherFlow}>
          <View style={styles.flowStep}><Text style={styles.flowIcon}>🧺</Text><Text style={styles.flowText}>Picnic at St. Leonards Park</Text></View>
          <Text style={styles.flowArrow}>›</Text>
          <View style={styles.flowStep}><Text style={styles.flowIcon}>🌧</Text><Text style={styles.flowText}>Rain expected</Text></View>
          <Text style={styles.flowArrow}>›</Text>
          <View style={styles.flowStep}><Text style={styles.flowIcon}>🎳</Text><Text style={styles.flowText}>Switch to bowling night</Text></View>
        </View>

        <View style={styles.list}>
          {alerts.map((alert) => (
            <TouchableOpacity key={alert.title} activeOpacity={0.85} style={styles.alertCard}>
              <View style={styles.alertIcon}><Text style={styles.alertEmoji}>{alert.icon}</Text></View>
              <View style={styles.alertBody}>
                <View style={styles.alertTopLine}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertTone}>{alert.tone}</Text>
                </View>
                <Text style={styles.alertCopy}>{alert.copy}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "800", lineHeight: 35 },
  subtitle: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginBottom: 18 },
  weatherFlow: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#061121", padding: 12, marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 7 },
  flowStep: { flex: 1, minHeight: 80, borderRadius: 16, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", padding: 8 },
  flowIcon: { fontSize: 24, marginBottom: 5 },
  flowText: { color: nsnColors.text, fontSize: 11, lineHeight: 15, textAlign: "center", fontWeight: "700" },
  flowArrow: { color: nsnColors.muted, fontSize: 24 },
  list: { gap: 10 },
  alertCard: { flexDirection: "row", gap: 12, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 13 },
  alertIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: nsnColors.surfaceRaised, alignItems: "center", justifyContent: "center" },
  alertEmoji: { fontSize: 23 },
  alertBody: { flex: 1 },
  alertTopLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  alertTitle: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  alertTone: { color: nsnColors.day, fontSize: 11, fontWeight: "800", lineHeight: 15 },
  alertCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 4 },
});
