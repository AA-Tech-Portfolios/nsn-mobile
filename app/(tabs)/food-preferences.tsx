import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { type DietaryPreference, type MealPaymentPreference, useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";

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

const paymentOptions: { value: MealPaymentPreference; copy: string }[] = [
  { value: "Pay my own way", copy: "I prefer to order and pay for myself." },
  { value: "Split evenly", copy: "I am comfortable sharing the bill evenly with the group." },
  { value: "Discuss as a group", copy: "I would rather decide together at the meetup." },
];

export default function FoodPreferencesScreen() {
  const router = useRouter();
  const { dietaryPreferences, isNightMode, mealPaymentPreference, saveSoftHelloMvpState } = useAppSettings();
  const isDay = !isNightMode;

  const toggleDietaryPreference = async (preference: DietaryPreference) => {
    const nextPreferences =
      preference === "No preference"
        ? ["No preference" as DietaryPreference]
        : dietaryPreferences.includes(preference)
          ? dietaryPreferences.filter((item) => item !== preference)
          : [...dietaryPreferences.filter((item) => item !== "No preference"), preference];

    await saveSoftHelloMvpState({ dietaryPreferences: nextPreferences.length ? nextPreferences : ["No preference"] });
  };

  const savePaymentPreference = async (preference: MealPaymentPreference) => {
    await saveSoftHelloMvpState({ mealPaymentPreference: preference });
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={[styles.backButton, isDay && styles.dayIconButton]} accessibilityRole="button" accessibilityLabel="Go back">
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <View style={[styles.headerCard, isDay && styles.dayCard]}>
          <Text style={[styles.title, isDay && styles.dayTitle]}>Food & Payment Preferences</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>
            Share dietary needs and meal payment expectations before food meetups, so nobody has to guess at the table.
          </Text>
        </View>

        <View style={[styles.card, isDay && styles.dayCard]}>
          <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>Food or dietary preferences</Text>
          <View style={styles.optionGrid}>
            {dietaryOptions.map((option) => {
              const active = dietaryPreferences.includes(option);

              return (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.82}
                  onPress={() => toggleDietaryPreference(option)}
                  style={[styles.chip, isDay && styles.dayChip, active && styles.chipActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.chipText, isDay && styles.dayTitle, active && styles.activeText]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.card, isDay && styles.dayCard]}>
          <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>Meal payment preference</Text>
          <View style={styles.paymentStack}>
            {paymentOptions.map((option) => {
              const active = mealPaymentPreference === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.82}
                  onPress={() => savePaymentPreference(option.value)}
                  style={[styles.paymentOption, isDay && styles.dayChip, active && styles.chipActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.paymentTitle, isDay && styles.dayTitle, active && styles.activeText]}>{option.value}</Text>
                  <Text style={[styles.paymentCopy, isDay && styles.dayMutedText, active && styles.activeText]}>{option.copy}</Text>
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
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  chip: { minHeight: 38, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  dayChip: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  chipActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  chipText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, textAlign: "center" },
  paymentStack: { gap: 9 },
  paymentOption: { borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", padding: 12 },
  paymentTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  paymentCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#3B4A63" },
  activeText: { color: "#FFFFFF" },
});
