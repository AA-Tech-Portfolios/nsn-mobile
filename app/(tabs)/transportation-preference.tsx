import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { type TransportationMethod, useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";

const transportationOptions: { value: TransportationMethod; label: string; copy: string }[] = [
  { value: "Driving", label: "Driving", copy: "I may need parking or a clear meeting point." },
  { value: "Public transport", label: "Public transport", copy: "I am arriving by train, bus, metro, light rail, or ferry." },
  { value: "Walking", label: "Walking", copy: "I am nearby and arriving on foot." },
  { value: "Cycling", label: "Cycling", copy: "I may need somewhere reasonable to lock up." },
  { value: "Rideshare", label: "Rideshare", copy: "I may need a pickup/drop-off friendly spot." },
  { value: "Getting dropped off", label: "Getting dropped off", copy: "Someone else is helping me get there." },
  { value: "Not sure yet", label: "Not sure yet", copy: "I will decide closer to the meetup." },
];

export default function TransportationPreferenceScreen() {
  const router = useRouter();
  const { isNightMode, saveSoftHelloMvpState, transportationMethod } = useAppSettings();
  const isDay = !isNightMode;

  const saveTransportationMethod = async (nextMethod: TransportationMethod) => {
    await saveSoftHelloMvpState({ transportationMethod: nextMethod });
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[styles.backButton, isDay && styles.dayIconButton]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <View style={[styles.headerCard, isDay && styles.dayCard]}>
          <Text style={[styles.title, isDay && styles.dayTitle]}>Transportation Method</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>
            Choose how you usually arrive so meetups can make the meeting point and timing feel easier.
          </Text>
        </View>

        <View style={styles.optionStack}>
          {transportationOptions.map((option) => {
            const active = transportationMethod === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                activeOpacity={0.82}
                onPress={() => saveTransportationMethod(option.value)}
                style={[styles.optionCard, isDay && styles.dayCard, active && styles.optionCardActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <View style={styles.optionIcon}>
                  <IconSymbol name="transport" color={active ? "#FFFFFF" : isDay ? "#3B4A63" : nsnColors.muted} size={21} />
                </View>
                <View style={styles.optionBody}>
                  <Text style={[styles.optionTitle, isDay && styles.dayTitle, active && styles.activeText]}>{option.label}</Text>
                  <Text style={[styles.optionCopy, isDay && styles.dayMutedText, active && styles.activeText]}>{option.copy}</Text>
                </View>
                <Text style={[styles.check, active && styles.checkActive]}>{active ? "✓" : ""}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayContainer: { backgroundColor: "#EAF4FF" },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 34, gap: 16 },
  backButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)" },
  dayIconButton: { backgroundColor: "#DCEEFF" },
  headerCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 16 },
  title: { color: nsnColors.text, fontSize: 26, fontWeight: "900", lineHeight: 32 },
  copy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  optionStack: { gap: 10 },
  optionCard: { minHeight: 72, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, flexDirection: "row", alignItems: "center", gap: 12, padding: 13 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  optionCardActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  optionIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)" },
  optionBody: { flex: 1 },
  optionTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  optionCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#3B4A63" },
  activeText: { color: "#FFFFFF" },
  check: { width: 22, color: nsnColors.muted, fontSize: 16, fontWeight: "900", textAlign: "center" },
  checkActive: { color: "#FFFFFF" },
});
