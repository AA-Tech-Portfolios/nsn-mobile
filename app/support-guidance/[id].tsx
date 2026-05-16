import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";
import { getSupportGuidanceById, type SupportGuidanceAction } from "@/lib/support-guidance";

export default function SupportGuidanceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { isNightMode } = useAppSettings();
  const { width } = useWindowDimensions();
  const isDay = !isNightMode;
  const guide = getSupportGuidanceById(id);
  const contentWidth = Math.min(width - 24, 920);

  const openAction = (action: SupportGuidanceAction) => {
    if (action.route === "coming-later") return;

    if (action.route === "help") {
      router.push({ pathname: "/(tabs)/profile", params: { menu: "helpSupport" } } as never);
      return;
    }

    router.push({ pathname: "/user-preferences", params: { section: action.route } } as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView contentContainerStyle={[styles.content, { width: contentWidth }]} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
          <Text style={[styles.backText, isDay && styles.dayMutedText]}>Back</Text>
        </TouchableOpacity>

        <View style={[styles.heroCard, isDay && styles.dayCard]}>
          <View style={styles.heroTitleRow}>
            <View style={[styles.iconBadge, isDay && styles.dayIconBadge]}>
              <IconSymbol name={guide.icon} color={isDay ? "#445E93" : "#C7B07A"} size={24} />
            </View>
            <View style={styles.flexBody}>
              <Text style={[styles.eyebrow, isDay && styles.dayMutedText]}>{guide.eyebrow}</Text>
              <Text style={[styles.title, isDay && styles.dayTitle]}>{guide.title}</Text>
            </View>
          </View>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>{guide.detailIntro}</Text>
          <View style={styles.pointGrid}>
            {guide.points.map((point) => (
              <Text key={point} style={[styles.pointChip, isDay && styles.dayChip]}>
                {point}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.sectionStack}>
          {guide.details.map((section) => (
            <View key={section.title} style={[styles.detailCard, isDay && styles.dayCard]}>
              <Text style={[styles.detailTitle, isDay && styles.dayTitle]}>{section.title}</Text>
              <Text style={[styles.copy, isDay && styles.dayMutedText]}>{section.copy}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.detailCard, isDay && styles.dayCard]}>
          <Text style={[styles.detailTitle, isDay && styles.dayTitle]}>Useful next steps</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>
            These links are shortcuts to prototype settings or support surfaces. They are optional and saved locally where the current prototype supports it.
          </Text>
          <View style={styles.actionGrid}>
            {guide.actions.map((action) => {
              const disabled = action.route === "coming-later";

              return (
                <TouchableOpacity
                  key={action.label}
                  activeOpacity={disabled ? 1 : 0.82}
                  onPress={() => openAction(action)}
                  style={[styles.actionButton, disabled && styles.disabledButton, isDay && styles.dayChip]}
                  accessibilityRole="button"
                  accessibilityState={{ disabled }}
                  accessibilityLabel={action.label}
                >
                  <Text style={[styles.actionText, isDay && styles.dayTitle]}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.noticeCard, isDay && styles.dayCard]}>
          <Text style={[styles.eyebrow, isDay && styles.dayMutedText]}>Prototype-safe note</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>
            This guide is optional, privacy-first, and does not ask you to share loneliness, anxiety, neurodivergence, disability, trauma, or support needs.
          </Text>
          {guide.footerNote ? <Text style={[styles.copy, isDay && styles.dayMutedText]}>{guide.footerNote}</Text> : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { alignSelf: "center", paddingHorizontal: 12, paddingTop: 12, paddingBottom: 36 },
  dayContainer: { backgroundColor: "#F4F7FB" },
  backButton: { alignSelf: "flex-start", minHeight: 38, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8, marginBottom: 8 },
  backText: { color: nsnColors.muted, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  heroCard: { borderRadius: 18, borderWidth: 1, borderColor: "#3C5277", backgroundColor: "#0F223D", padding: 16, gap: 12, marginBottom: 12 },
  dayCard: { borderColor: "#C8D5E8", backgroundColor: "#FFFFFF" },
  heroTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  iconBadge: { width: 44, height: 44, borderRadius: 16, borderWidth: 1, borderColor: "rgba(124,170,201,0.28)", backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center" },
  dayIconBadge: { backgroundColor: "#EDF3FA", borderColor: "#D4E0EF" },
  flexBody: { flex: 1, minWidth: 0 },
  eyebrow: { color: nsnColors.warning, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  title: { color: nsnColors.text, fontSize: 24, fontWeight: "900", lineHeight: 31 },
  dayTitle: { color: "#102235" },
  copy: { color: nsnColors.muted, fontSize: 13, fontWeight: "700", lineHeight: 20 },
  dayMutedText: { color: "#53677A" },
  pointGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pointChip: { maxWidth: "100%", borderRadius: 999, borderWidth: 1, borderColor: "rgba(124,170,201,0.28)", backgroundColor: "rgba(255,255,255,0.035)", color: nsnColors.muted, fontSize: 11, fontWeight: "800", lineHeight: 15, paddingHorizontal: 9, paddingVertical: 6, overflow: "hidden" },
  dayChip: { borderColor: "#D4E0EF", backgroundColor: "#F5F8FC", color: "#53677A" },
  sectionStack: { gap: 10, marginBottom: 12 },
  detailCard: { borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", padding: 14, gap: 7, marginBottom: 10 },
  detailTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21 },
  actionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  actionButton: { minHeight: 38, borderRadius: 13, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(255,255,255,0.045)", alignItems: "center", justifyContent: "center", paddingHorizontal: 11, paddingVertical: 7 },
  disabledButton: { opacity: 0.72, borderStyle: "dashed" },
  actionText: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 16 },
  noticeCard: { borderRadius: 16, borderWidth: 1, borderStyle: "dashed", borderColor: "rgba(247,200,91,0.45)", backgroundColor: "rgba(247,200,91,0.08)", padding: 14, gap: 7 },
});
