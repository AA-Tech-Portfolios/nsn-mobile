import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";
import { getProfilePreferenceCopy } from "@/lib/profile-preference-translations";

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
  "Volunteering",
];

export default function HobbiesInterestsScreen() {
  const router = useRouter();
  const { appLanguage, hobbiesInterests, isNightMode, saveSoftHelloMvpState } = useAppSettings();
  const isDay = !isNightMode;
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
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={[styles.backButton, isDay && styles.dayIconButton]} accessibilityRole="button" accessibilityLabel={backLabel}>
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <View style={[styles.headerCard, isDay && styles.dayCard]}>
          <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>
            {copy.copy}
          </Text>
        </View>

        <View style={[styles.card, isDay && styles.dayCard]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>{copy.personalTime}</Text>
            <Text style={[styles.count, isDay && styles.dayMutedText]}>{copy.selected(hobbiesInterests.length)}</Text>
          </View>
          <View style={styles.optionGrid}>
            {hobbyOptions.map((option) => {
              const active = hobbiesInterests.includes(option);
              const localizedOption = copy.options?.[option] ?? option;

              return (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.82}
                  onPress={() => toggleInterest(option)}
                  style={[styles.chip, isDay && styles.dayChip, active && styles.chipActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, isDay && styles.dayTitle, active && styles.activeText]}>{localizedOption}</Text>
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
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  sectionTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21 },
  count: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", lineHeight: 17 },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  chip: { minHeight: 38, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  dayChip: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  chipActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  chipText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, textAlign: "center" },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#3B4A63" },
  activeText: { color: "#FFFFFF" },
});
