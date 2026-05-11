import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLanguageBase, type DietaryPreference, useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";
import { getProfilePreferenceCopy } from "@/lib/profile-preference-translations";

const dietaryOptions: DietaryPreference[] = [
  "No preference",
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-free",
  "Dairy-free",
  "Nut allergy",
  "Seafood allergy",
  "Prefer non-alcohol venues",
];

export default function FoodPreferencesScreen() {
  const router = useRouter();
  const { appLanguage, dietaryPreferences, isNightMode, saveSoftHelloMvpState } = useAppSettings();
  const isDay = !isNightMode;
  const preferenceCopy = getProfilePreferenceCopy(getLanguageBase(appLanguage));
  const copy = preferenceCopy.food;
  const backLabel = preferenceCopy.back ?? getProfilePreferenceCopy("English").back;

  const toggleDietaryPreference = async (preference: DietaryPreference) => {
    const nextPreferences =
      preference === "No preference"
        ? ["No preference" as DietaryPreference]
        : dietaryPreferences.includes(preference)
          ? dietaryPreferences.filter((item) => item !== preference)
          : [...dietaryPreferences.filter((item) => item !== "No preference"), preference];

    await saveSoftHelloMvpState({ dietaryPreferences: nextPreferences.length ? nextPreferences : ["No preference"] });
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => router.replace({ pathname: "/(tabs)/profile", params: { menu: "preferences" } })} style={[styles.backButton, isDay && styles.dayIconButton]} accessibilityRole="button" accessibilityLabel={backLabel}>
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <View style={[styles.headerCard, isDay && styles.dayCard]}>
          <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>
            {copy.copy}
          </Text>
        </View>

        <View style={[styles.card, isDay && styles.dayCard]}>
          <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>{copy.dietary}</Text>
          <View style={styles.optionGrid}>
            {dietaryOptions.map((option) => {
              const active = dietaryPreferences.includes(option);
              const localizedOption = copy.dietaryOptions?.[option] ?? option;

              return (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.82}
                  onPress={() => toggleDietaryPreference(option)}
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
  dayContainer: { backgroundColor: "#E8EDF2" },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 34, gap: 16 },
  backButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)" },
  dayIconButton: { backgroundColor: "#EEF3F4" },
  headerCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 16 },
  title: { color: nsnColors.text, fontSize: 26, fontWeight: "900", lineHeight: 32 },
  copy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  card: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 14, gap: 12 },
  sectionTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21 },
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
