import { ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";
import { getProfilePreferenceCopy } from "@/lib/profile-preference-translations";
import { formatPreferenceChipLabel, formatSelectedPreferenceChipLabel, getPreferenceChipIcon, getSettingsPreferenceLayout } from "@/lib/preferences-layout";

const hobbyOptions = [
  "Coffee",
  "Movies",
  "Board games",
  "Walks",
  "Reading",
  "Libraries",
  "Food spots",
  "Live music",
  "Quiet music",
  "Art",
  "Museums",
  "Markets",
  "Beach days",
  "Picnics",
  "Fitness",
  "Photography",
  "Gaming",
  "Pets",
  "Volunteering",
];

export default function HobbiesInterestsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { appLanguage, hobbiesInterests, homeLayoutDensity, isNightMode, saveSoftHelloMvpState } = useAppSettings();
  const isDay = !isNightMode;
  const preferenceLayout = getSettingsPreferenceLayout(width, homeLayoutDensity);
  const isWide = preferenceLayout.isDesktop;
  const preferenceCopy = getProfilePreferenceCopy(getLanguageBase(appLanguage));
  const copy = preferenceCopy.hobbies;
  const backLabel = preferenceCopy.back ?? getProfilePreferenceCopy("English").back;

  const toggleInterest = async (interest: string) => {
    const nextInterests = hobbiesInterests.includes(interest)
      ? hobbiesInterests.filter((item) => item !== interest)
      : [...hobbiesInterests, interest];

    await saveSoftHelloMvpState({ hobbiesInterests: nextInterests });
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={[styles.content, isWide && styles.contentWide, { gap: preferenceLayout.sectionGap }]} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => router.replace({ pathname: "/(tabs)/profile", params: { menu: "preferences" } })} style={[styles.backButton, isDay && styles.dayIconButton]} accessibilityRole="button" accessibilityLabel={backLabel}>
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <View style={[styles.headerCard, { borderRadius: preferenceLayout.cardRadius, padding: preferenceLayout.cardPadding }, isDay && styles.dayCard]}>
          <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>
            {copy.copy}
          </Text>
        </View>

        <View style={[styles.card, { borderRadius: preferenceLayout.cardRadius, gap: preferenceLayout.sectionGap, padding: preferenceLayout.cardPadding }, isDay && styles.dayCard]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>{copy.personalTime}</Text>
            <Text style={[styles.count, isDay && styles.dayMutedText]}>{copy.selected(hobbiesInterests.length)}</Text>
          </View>
          <View style={[styles.optionGrid, { gap: preferenceLayout.optionGap }]}>
            {hobbyOptions.map((option) => {
              const active = hobbiesInterests.includes(option);
              const localizedOption = copy.options?.[option] ?? option;
              const icon = getPreferenceChipIcon(option);
              const chipLabel = active
                ? formatSelectedPreferenceChipLabel(localizedOption, icon)
                : formatPreferenceChipLabel(localizedOption, icon);

              return (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.82}
                  onPress={() => toggleInterest(option)}
                  style={[
                    styles.chip,
                    isWide ? preferenceLayout.optionCard : preferenceLayout.fullWidthCard,
                    { minHeight: preferenceLayout.minTapTarget },
                    isDay && styles.dayChip,
                    active && styles.chipActive,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={chipLabel}
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, isDay && styles.dayTitle, active && styles.activeText]}>{chipLabel}</Text>
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
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  sectionTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21 },
  count: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", lineHeight: 17 },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  chip: { minHeight: 38, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  dayChip: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  chipActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  chipText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, textAlign: "center" },
  dayCard: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#53677A" },
  activeText: { color: "#FFFFFF" },
});
