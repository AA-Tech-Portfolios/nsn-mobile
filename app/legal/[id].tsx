import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppSettings } from "@/lib/app-settings";
import { getLegalPrivacyDocument } from "@/lib/legal-privacy-alpha";
import { nsnColors } from "@/lib/nsn-data";
import { nsnSupportReadabilityColors } from "@/lib/support-readability";

export default function LegalPrivacyDocumentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { isNightMode } = useAppSettings();
  const { width } = useWindowDimensions();
  const isDay = !isNightMode;
  const document = getLegalPrivacyDocument(id);
  const contentWidth = Math.min(width - 24, 920);

  return (
    <ScreenContainer
      containerClassName="bg-background"
      safeAreaClassName="bg-background"
      containerStyle={isDay && styles.dayContainer}
      style={isDay && styles.dayContainer}
    >
      <ScrollView
        style={[styles.screen, isDay && styles.dayContainer]}
        contentContainerStyle={[styles.content, { width: contentWidth }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <IconSymbol
            name="chevron.left"
            color={
              isDay
                ? nsnSupportReadabilityColors.lightMutedText
                : nsnSupportReadabilityColors.darkMutedText
            }
            size={18}
          />
          <Text style={[styles.backText, isDay && styles.dayMutedText]}>Back</Text>
        </TouchableOpacity>

        <View style={[styles.heroCard, isDay && styles.dayCard]}>
          <View style={styles.heroTitleRow}>
            <View style={[styles.iconBadge, isDay && styles.dayIconBadge]}>
              <IconSymbol name={document.iconName} color={isDay ? "#445E93" : "#C7B07A"} size={24} />
            </View>
            <View style={styles.flexBody}>
              <Text style={[styles.eyebrow, isDay && styles.dayMutedText]}>
                {document.eyebrow}
              </Text>
              <Text style={[styles.title, isDay && styles.dayTitle]}>{document.title}</Text>
            </View>
          </View>
          <Text selectable style={[styles.copy, isDay && styles.dayMutedText]}>
            {document.summary}
          </Text>
        </View>

        <View style={styles.sectionStack}>
          {document.sections.map((section) => (
            <View key={section.title} style={[styles.detailCard, isDay && styles.dayCard]}>
              <Text selectable style={[styles.detailTitle, isDay && styles.dayTitle]}>
                {section.title}
              </Text>
              <Text selectable style={[styles.copy, isDay && styles.dayMutedText]}>
                {section.copy}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.noticeCard, isDay && styles.dayNoticeCard]}>
          <Text selectable style={[styles.eyebrow, isDay && styles.dayMutedText]}>
            Before beta
          </Text>
          <Text selectable style={[styles.copy, isDay && styles.dayMutedText]}>
            {document.footerNote}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnSupportReadabilityColors.darkSurface },
  content: { alignSelf: "center", paddingHorizontal: 12, paddingTop: 12, paddingBottom: 36 },
  dayContainer: { backgroundColor: "#F4F7FB" },
  backButton: {
    alignSelf: "flex-start",
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  backText: {
    color: nsnSupportReadabilityColors.darkMutedText,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
  },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#4A6390",
    backgroundColor: nsnSupportReadabilityColors.darkRaisedSurface,
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  dayCard: { borderColor: "#BCCCE1", backgroundColor: "#FFFFFF" },
  heroTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(124,170,201,0.28)",
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  dayIconBadge: { backgroundColor: "#EDF3FA", borderColor: "#D4E0EF" },
  flexBody: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: nsnSupportReadabilityColors.badgeText,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
    textTransform: "uppercase",
  },
  title: { color: nsnColors.text, fontSize: 24, fontWeight: "900", lineHeight: 31 },
  dayTitle: { color: "#102235" },
  copy: {
    color: nsnSupportReadabilityColors.darkMutedText,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 21,
  },
  dayMutedText: { color: nsnSupportReadabilityColors.lightMutedText },
  sectionStack: { gap: 10, marginBottom: 12 },
  detailCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3D567E",
    backgroundColor: "rgba(255,255,255,0.055)",
    padding: 14,
    gap: 7,
  },
  detailTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21 },
  noticeCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,214,110,0.65)",
    backgroundColor: "rgba(255,214,110,0.11)",
    padding: 14,
    gap: 7,
  },
  dayNoticeCard: { borderColor: "#D6C17E", backgroundColor: "#FFF8DF" },
});
