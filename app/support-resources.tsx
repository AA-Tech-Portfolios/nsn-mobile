import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppSettings } from "@/lib/app-settings";
import { communitySupportResourceCategories, communitySupportResourceFutureNotes } from "@/lib/community-support-resources";
import { nsnColors } from "@/lib/nsn-data";
import { nsnSupportReadabilityColors } from "@/lib/support-readability";

export default function SupportResourcesScreen() {
  const router = useRouter();
  const { isNightMode } = useAppSettings();
  const { width } = useWindowDimensions();
  const isDay = !isNightMode;
  const contentWidth = Math.min(width - 24, 920);
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>(["life-skills"]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategoryIds((current) =>
      current.includes(categoryId) ? current.filter((id) => id !== categoryId) : [...current, categoryId]
    );
  };

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
          <IconSymbol name="chevron.left" color={isDay ? nsnSupportReadabilityColors.lightMutedText : nsnSupportReadabilityColors.darkMutedText} size={18} />
          <Text style={[styles.backText, isDay && styles.dayMutedText]}>Back</Text>
        </TouchableOpacity>

        <View style={[styles.heroCard, isDay && styles.dayCard]}>
          <View style={styles.heroTitleRow}>
            <View style={[styles.iconBadge, isDay && styles.dayIconBadge]}>
              <IconSymbol name="heart" color={isDay ? "#445E93" : "#C7B07A"} size={24} />
            </View>
            <View style={styles.flexBody}>
              <Text style={[styles.eyebrow, isDay && styles.dayMutedText]}>Alpha prototype</Text>
              <Text style={[styles.title, isDay && styles.dayTitle]}>Support & Resources</Text>
            </View>
          </View>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>
            Support should feel approachable. Explore local, community, accessibility, wellbeing, and practical life resources at your own pace.
          </Text>
          <Text style={[styles.noticeText, isDay && styles.dayNoticeText]}>
            Demo placeholders only. Resources are not reviewed yet, and NSN is not therapy, emergency services, crisis care, or a replacement for qualified support.
          </Text>
        </View>

        <View style={styles.categoryStack}>
          {communitySupportResourceCategories.map((category) => {
            const isOpen = openCategoryIds.includes(category.id);

            return (
              <View key={category.id} style={[styles.categoryCard, isDay && styles.dayCard]}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => toggleCategory(category.id)}
                  style={styles.categoryHeader}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isOpen }}
                  accessibilityLabel={`${category.title} resources`}
                >
                  <View style={[styles.iconBadgeSmall, isDay && styles.dayIconBadge]}>
                    <IconSymbol name={category.icon} color={isDay ? "#445E93" : "#C7B07A"} size={20} />
                  </View>
                  <View style={styles.flexBody}>
                    <Text style={[styles.categoryTitle, isDay && styles.dayTitle]}>{category.title}</Text>
                    <Text style={[styles.copy, isDay && styles.dayMutedText]}>{category.description}</Text>
                  </View>
                  <Text style={[styles.badge, isDay && styles.dayChip]}>{category.badge}</Text>
                  <IconSymbol name={isOpen ? "chevron.up" : "chevron.down"} color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                </TouchableOpacity>

                {isOpen ? (
                  <View style={styles.categoryBody}>
                    <Text style={[styles.boundaryText, isDay && styles.dayMutedText]}>{category.boundaryNote}</Text>
                    {category.resources.map((resource) => (
                      <View key={resource.title} style={[styles.resourceRow, isDay && styles.daySoftOption]}>
                        <View style={styles.flexBody}>
                          <Text style={[styles.resourceTitle, isDay && styles.dayTitle]}>{resource.title}</Text>
                          <Text style={[styles.copy, isDay && styles.dayMutedText]}>{resource.copy}</Text>
                        </View>
                        <Text style={[styles.badge, isDay && styles.dayChip]}>{resource.badge}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={[styles.noticeCard, isDay && styles.dayCard]}>
          <Text style={[styles.detailTitle, isDay && styles.dayTitle]}>Future exploration</Text>
          <View style={styles.futureGrid}>
            {communitySupportResourceFutureNotes.map((note) => (
              <Text key={note} style={[styles.futureChip, isDay && styles.dayChip]}>
                {note}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnSupportReadabilityColors.darkSurface },
  content: { alignSelf: "center", paddingHorizontal: 12, paddingTop: 12, paddingBottom: 36 },
  dayContainer: { backgroundColor: "#F4F7FB" },
  backButton: { alignSelf: "flex-start", minHeight: 38, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8, marginBottom: 8 },
  backText: { color: nsnSupportReadabilityColors.darkMutedText, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  heroCard: { borderRadius: 18, borderWidth: 1, borderColor: "#4A6390", backgroundColor: nsnSupportReadabilityColors.darkRaisedSurface, padding: 16, gap: 12, marginBottom: 12 },
  dayCard: { borderColor: "#BCCCE1", backgroundColor: "#FFFFFF" },
  heroTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  iconBadge: { width: 44, height: 44, borderRadius: 16, borderWidth: 1, borderColor: "rgba(124,170,201,0.28)", backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center" },
  iconBadgeSmall: { width: 38, height: 38, borderRadius: 14, borderWidth: 1, borderColor: "rgba(124,170,201,0.28)", backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center" },
  dayIconBadge: { backgroundColor: "#EDF3FA", borderColor: "#D4E0EF" },
  flexBody: { flex: 1, minWidth: 0 },
  eyebrow: { color: nsnSupportReadabilityColors.badgeText, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  title: { color: nsnColors.text, fontSize: 24, fontWeight: "900", lineHeight: 31 },
  dayTitle: { color: "#102235" },
  copy: { color: nsnSupportReadabilityColors.darkMutedText, fontSize: 13, fontWeight: "800", lineHeight: 21 },
  dayMutedText: { color: nsnSupportReadabilityColors.lightMutedText },
  noticeText: { color: "#F2D9A0", fontSize: 12, fontWeight: "900", lineHeight: 19 },
  dayNoticeText: { color: nsnSupportReadabilityColors.lightWarningBody },
  categoryStack: { gap: 10, marginBottom: 12 },
  categoryCard: { borderRadius: 16, borderWidth: 1, borderColor: "#3D567E", backgroundColor: "rgba(255,255,255,0.055)", padding: 12, gap: 10 },
  categoryHeader: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 10 },
  categoryTitle: { color: nsnColors.text, fontSize: 16, fontWeight: "900", lineHeight: 22 },
  categoryBody: { gap: 8, paddingTop: 4 },
  boundaryText: { color: nsnSupportReadabilityColors.darkMutedText, fontSize: 12, fontWeight: "900", lineHeight: 19 },
  resourceRow: { borderRadius: 14, borderWidth: 1, borderColor: "rgba(184,196,216,0.28)", backgroundColor: "rgba(255,255,255,0.045)", padding: 10, flexDirection: "row", alignItems: "flex-start", gap: 8 },
  resourceTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  badge: { maxWidth: 112, borderRadius: 999, borderWidth: 1, borderColor: "rgba(184,196,216,0.45)", backgroundColor: "rgba(255,255,255,0.055)", color: nsnSupportReadabilityColors.darkMutedText, fontSize: 10, fontWeight: "900", lineHeight: 14, paddingHorizontal: 8, paddingVertical: 5, overflow: "hidden", textAlign: "center" },
  dayChip: { borderColor: "#C8D5E8", backgroundColor: "#F3F7FC", color: nsnSupportReadabilityColors.lightMutedText },
  daySoftOption: { borderColor: "#D4E0EF", backgroundColor: "#F7FAFD" },
  noticeCard: { borderRadius: 16, borderWidth: 1, borderStyle: "dashed", borderColor: "rgba(255,214,110,0.65)", backgroundColor: "rgba(255,214,110,0.11)", padding: 14, gap: 10 },
  detailTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21 },
  futureGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  futureChip: { maxWidth: "100%", borderRadius: 999, borderWidth: 1, borderColor: "rgba(184,196,216,0.45)", backgroundColor: "rgba(255,255,255,0.055)", color: nsnSupportReadabilityColors.darkMutedText, fontSize: 11, fontWeight: "900", lineHeight: 16, paddingHorizontal: 9, paddingVertical: 6, overflow: "hidden" },
});
