import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLanguageBase, type ContactPreference, useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";
import { getProfilePreferenceCopy } from "@/lib/profile-preference-translations";
import { formatPreferenceChipLabel, formatSelectedPreferenceChipLabel, getPreferenceChipIcon, getSettingsPreferenceLayout } from "@/lib/preferences-layout";

const contactOptions: { value: ContactPreference; label: string; copy: string }[] = [
  { value: "In person", label: "In person", copy: "I prefer to build rapport naturally at the meetup." },
  { value: "Text", label: "Text", copy: "I like a low-pressure message first." },
  { value: "Email", label: "Email", copy: "I prefer slower, more considered notes." },
  { value: "Phone", label: "Phone", copy: "A quick call can help me feel clearer before meeting." },
  { value: "Video", label: "Video", copy: "A short video hello can help before an in-person plan." },
];

export default function ContactPreferenceScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { appLanguage, contactPreferences, homeLayoutDensity, isNightMode, saveSoftHelloMvpState } = useAppSettings();
  const isDay = !isNightMode;
  const preferenceLayout = getSettingsPreferenceLayout(width, homeLayoutDensity);
  const isWide = preferenceLayout.isDesktop;
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
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={[styles.content, isWide && styles.contentWide, { gap: preferenceLayout.sectionGap }]} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => router.replace({ pathname: "/(tabs)/profile", params: { menu: "preferences" } })} style={[styles.backButton, isDay && styles.dayIconButton]} accessibilityRole="button" accessibilityLabel={backLabel}>
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <View style={[styles.headerCard, { borderRadius: preferenceLayout.cardRadius, padding: preferenceLayout.cardPadding }, isDay && styles.dayCard]}>
          <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>{copy.copy}</Text>
        </View>

        <View style={[styles.card, { borderRadius: preferenceLayout.cardRadius, gap: preferenceLayout.sectionGap, padding: preferenceLayout.cardPadding }, isDay && styles.dayCard]}>
          <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>{copy.selected(contactPreferences.length)}</Text>
          <View style={[styles.optionGrid, isWide && styles.optionGridWide, { gap: preferenceLayout.optionGap }]}>
            {contactOptions.map((option) => {
              const active = contactPreferences.includes(option.value);
              const localizedOption = copy.options?.[option.value] ?? option;
              const icon = getPreferenceChipIcon(option.value);
              const optionLabel = active
                ? formatSelectedPreferenceChipLabel(localizedOption.label, icon)
                : formatPreferenceChipLabel(localizedOption.label, icon);

              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.82}
                  onPress={() => toggleContactPreference(option.value)}
                  style={[
                    styles.optionCard,
                    isWide ? preferenceLayout.sectionCard : preferenceLayout.fullWidthCard,
                    { borderRadius: preferenceLayout.cardRadius, minHeight: Math.max(72, preferenceLayout.minTapTarget) },
                    isDay && styles.dayChip,
                    active && styles.optionCardActive,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={optionLabel}
                  accessibilityState={{ selected: active }}
                >
                  <View style={styles.optionIcon}>
                    <IconSymbol name="contact" color={active ? "#FFFFFF" : isDay ? "#53677A" : nsnColors.muted} size={20} />
                  </View>
                  <View style={styles.optionBody}>
                    <Text style={[styles.optionTitle, isDay && styles.dayTitle, active && styles.activeText]}>{optionLabel}</Text>
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
  dayContainer: { backgroundColor: "#E8EDF2" },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 112, gap: 16 },
  contentWide: { width: "100%", maxWidth: 1040, alignSelf: "center", paddingHorizontal: 24, paddingTop: 18 },
  backButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)" },
  dayIconButton: { backgroundColor: "#EEF3F4" },
  headerCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 16 },
  title: { color: nsnColors.text, fontSize: 26, fontWeight: "900", lineHeight: 32 },
  copy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  card: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 14, gap: 12 },
  sectionTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21 },
  optionGrid: { gap: 10 },
  optionGridWide: { flexDirection: "row", flexWrap: "wrap", alignItems: "stretch" },
  optionCard: { minHeight: 72, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", flexDirection: "row", alignItems: "center", gap: 12, padding: 13 },
  optionCardActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  optionIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.10)" },
  optionBody: { flex: 1 },
  optionTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  optionCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  dayCard: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  dayChip: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#53677A" },
  activeText: { color: "#FFFFFF" },
  check: { width: 22, color: nsnColors.muted, fontSize: 16, fontWeight: "900", textAlign: "center" },
  checkActive: { color: "#FFFFFF" },
});
