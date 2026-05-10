import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLanguageBase, type ContactPreference, useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";
import { getProfilePreferenceCopy } from "@/lib/profile-preference-translations";

const contactOptions: { value: ContactPreference; label: string; copy: string }[] = [
  { value: "In person", label: "In person", copy: "I prefer to build rapport naturally at the meetup." },
  { value: "Text", label: "Text", copy: "I like a low-pressure message first." },
  { value: "Email", label: "Email", copy: "I prefer slower, more considered notes." },
  { value: "Phone", label: "Phone", copy: "A quick call can help me feel clearer before meeting." },
  { value: "Video", label: "Video", copy: "A short video hello can help before an in-person plan." },
];

export default function ContactPreferenceScreen() {
  const router = useRouter();
  const { appLanguage, contactPreferences, isNightMode, saveSoftHelloMvpState } = useAppSettings();
  const isDay = !isNightMode;
  const preferenceCopy = getProfilePreferenceCopy(getLanguageBase(appLanguage));
  const englishCopy = getProfilePreferenceCopy("English");
  const copy = preferenceCopy.contact ?? englishCopy.contact!;
  const backLabel = preferenceCopy.back ?? englishCopy.back;

  const toggleContactPreference = async (preference: ContactPreference) => {
    const nextPreferences = contactPreferences.includes(preference)
      ? contactPreferences.filter((item) => item !== preference)
      : [...contactPreferences, preference];

    await saveSoftHelloMvpState({ contactPreferences: nextPreferences.length ? nextPreferences : ["Text"] });
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => router.replace({ pathname: "/(tabs)/profile", params: { menu: "preferences" } })} style={[styles.backButton, isDay && styles.dayIconButton]} accessibilityRole="button" accessibilityLabel={backLabel}>
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <View style={[styles.headerCard, isDay && styles.dayCard]}>
          <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>{copy.copy}</Text>
        </View>

        <View style={[styles.card, isDay && styles.dayCard]}>
          <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>{copy.selected(contactPreferences.length)}</Text>
          <View style={styles.optionGrid}>
            {contactOptions.map((option) => {
              const active = contactPreferences.includes(option.value);
              const localizedOption = copy.options?.[option.value] ?? option;

              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.82}
                  onPress={() => toggleContactPreference(option.value)}
                  style={[styles.optionCard, isDay && styles.dayChip, active && styles.optionCardActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <View style={styles.optionIcon}>
                    <IconSymbol name="contact" color={active ? "#FFFFFF" : isDay ? "#3B4A63" : nsnColors.muted} size={20} />
                  </View>
                  <View style={styles.optionBody}>
                    <Text style={[styles.optionTitle, isDay && styles.dayTitle, active && styles.activeText]}>{localizedOption.label}</Text>
                    <Text style={[styles.optionCopy, isDay && styles.dayMutedText, active && styles.activeText]}>{localizedOption.copy}</Text>
                  </View>
                  <Text style={[styles.check, active && styles.checkActive]}>{active ? "✓" : ""}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
  card: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 14, gap: 12 },
  sectionTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21 },
  optionGrid: { gap: 10 },
  optionCard: { minHeight: 72, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", flexDirection: "row", alignItems: "center", gap: 12, padding: 13 },
  optionCardActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  optionIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)" },
  optionBody: { flex: 1 },
  optionTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  optionCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  dayChip: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#3B4A63" },
  activeText: { color: "#FFFFFF" },
  check: { width: 22, color: nsnColors.muted, fontSize: 16, fontWeight: "900", textAlign: "center" },
  checkActive: { color: "#FFFFFF" },
});
