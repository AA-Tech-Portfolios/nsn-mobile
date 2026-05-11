import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const walkthroughSteps = [
  {
    title: "Welcome to NSN",
    eyebrow: "Prototype",
    copy: "North Shore Nights is a calm local prototype for low-pressure meetups around Sydney's North Shore. It is for trying the feel of the experience, not for live public matching yet.",
    actionLabel: "Start with local area",
    route: "/(tabs)",
    icon: "low-pressure",
  },
  {
    title: "Search suburbs, regions, and meetups",
    eyebrow: "For alpha testing",
    copy: "Use Search NSN on Home to look up a Sydney suburb, broader region, or meetup idea like coffee, walks, board games, Inner West, or Chatswood. Selecting a suburb or region updates the prototype local area.",
    actionLabel: "Open Home",
    route: "/(tabs)",
    icon: "location",
  },
  {
    title: "Review comfort and privacy",
    eyebrow: "Saved locally",
    copy: "Settings & Privacy lets you try Basic or Advanced controls, profile blur, visibility, battery saver, low light mode, and prototype safety states. Some account and safety actions are demo-only.",
    actionLabel: "Open Settings & Privacy",
    route: "/(tabs)/settings",
    icon: "visibility",
  },
  {
    title: "Browse meetups",
    eyebrow: "Demo meetups",
    copy: "Browse small plans like coffee, walks, films, games, and quiet indoor options. Nothing joins a real public meetup during alpha testing.",
    actionLabel: "Browse meetups",
    route: "/(tabs)/meetups",
    icon: "calendar",
  },
  {
    title: "Open alerts and notifications",
    eyebrow: "Demo only",
    copy: "Alerts show how weather-aware reminders and gentle meetup prompts may work later. Notification snooze is labelled as a prototype setting.",
    actionLabel: "Open Alerts",
    route: "/(tabs)/notifications",
    icon: "bell",
  },
  {
    title: "Visit your profile",
    eyebrow: "Local profile",
    copy: "Try comfort preferences, profile preview, visibility controls, and the user menu. Trust, verification, report, and account features are clearly labelled while unfinished.",
    actionLabel: "Open Profile",
    route: "/(tabs)/profile",
    icon: "person.fill",
  },
  {
    title: "Ready to explore",
    eyebrow: "No pressure",
    copy: "Take it slowly. You can browse, adjust privacy, open a meetup, or leave without committing. Alpha feedback should focus on clarity, comfort, and what feels too heavy.",
    actionLabel: "Finish walkthrough",
    route: "/(tabs)",
    icon: "checkmark",
  },
] as const;

export default function AlphaWalkthroughScreen() {
  const router = useRouter();
  const { isNightMode, appLanguage, suburb, screenReaderHints } = useAppSettings();
  const [stepIndex, setStepIndex] = useState(0);
  const isDay = !isNightMode;
  const isRtl = rtlLanguages.has(getLanguageBase(appLanguage));
  const step = walkthroughSteps[stepIndex];
  const progressText = `Step ${stepIndex + 1} of ${walkthroughSteps.length}`;
  const localAreaCopy = useMemo(
    () => (suburb ? `Current local area: ${suburb}. You can change it from Search NSN on Home or from Profile.` : "No local area is set yet. Search NSN on Home can find a suburb, region, or activity."),
    [suburb]
  );
  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < walkthroughSteps.length - 1;

  const openStepRoute = () => {
    router.push(step.route as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[styles.backButton, isDay && styles.dayIconButton]}
          accessibilityRole="button"
          accessibilityLabel="Close alpha tester walkthrough"
        >
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <Text style={[styles.title, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Alpha tester walkthrough</Text>
        <Text style={[styles.subtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
          A short, low-pressure tour for first-time testers. NSN is a Sydney/North Shore prototype, and some features are demo-only.
        </Text>

        <View style={[styles.progressCard, isDay && styles.dayCard]}>
          <Text style={[styles.progressText, isDay && styles.dayAccentText]}>{progressText}</Text>
          <View style={[styles.progressTrack, isDay && styles.dayProgressTrack]}>
            <View style={[styles.progressFill, { width: `${((stepIndex + 1) / walkthroughSteps.length) * 100}%` }]} />
          </View>
        </View>

        <View style={[styles.stepCard, isDay && styles.dayCard]}>
          <View style={[styles.stepHeader, isRtl && styles.rtlRow]}>
            <View style={[styles.stepIcon, isDay && styles.dayIconBubble]}>
              <IconSymbol name={step.icon} color={isDay ? "#3949DB" : nsnColors.day} size={24} />
            </View>
            <View style={styles.stepHeaderCopy}>
              <Text style={[styles.stepEyebrow, isDay && styles.dayAccentText, isRtl && styles.rtlText]}>{step.eyebrow}</Text>
              <Text style={[styles.stepTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{step.title}</Text>
            </View>
          </View>
          <Text style={[styles.stepCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{step.copy}</Text>
          {stepIndex === 1 ? (
            <Text style={[styles.localAreaNote, isDay && styles.dayLocalAreaNote, isRtl && styles.rtlText]}>{localAreaCopy}</Text>
          ) : null}
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={openStepRoute}
            accessibilityRole="button"
            accessibilityLabel={step.actionLabel}
            accessibilityHint={screenReaderHints ? `Opens ${step.title}.` : undefined}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{step.actionLabel}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.stepList, isRtl && styles.rtlRow]}>
          {walkthroughSteps.map((item, index) => {
            const active = index === stepIndex;
            return (
              <TouchableOpacity
                key={item.title}
                activeOpacity={0.78}
                onPress={() => setStepIndex(index)}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}. ${index + 1} of ${walkthroughSteps.length}`}
                accessibilityState={{ selected: active }}
                style={[styles.stepPill, isDay && styles.dayStepPill, active && styles.stepPillActive]}
              >
                <Text style={[styles.stepPillText, isDay && styles.dayStepPillText, active && styles.stepPillTextActive]}>
                  {index + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity
            activeOpacity={0.78}
            onPress={() => setStepIndex((current) => Math.max(0, current - 1))}
            disabled={!canGoBack}
            accessibilityRole="button"
            accessibilityLabel="Previous walkthrough step"
            accessibilityState={{ disabled: !canGoBack }}
            style={[styles.navButton, isDay && styles.dayNavButton, !canGoBack && styles.disabledButton]}
          >
            <Text style={[styles.navButtonText, isDay && styles.dayTitle]}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.78}
            onPress={() => (canGoNext ? setStepIndex((current) => current + 1) : router.push("/(tabs)" as never))}
            accessibilityRole="button"
            accessibilityLabel={canGoNext ? "Next walkthrough step" : "Finish walkthrough"}
            style={[styles.navButton, styles.nextButton]}
          >
            <Text style={styles.nextButtonText}>{canGoNext ? "Next" : "Done"}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.noteCard, isDay && styles.dayCard]}>
          <Text style={[styles.noteTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Prototype note</Text>
          <Text style={[styles.noteCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Account deletion, verification, moderation, notification delivery, and safety systems are not production systems yet. No real account action is taken in this alpha walkthrough.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayContainer: { backgroundColor: "#EAF4FF" },
  content: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 20, paddingBottom: 36 },
  backButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)", marginBottom: 12 },
  dayIconButton: { backgroundColor: "#DCEEFF" },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "900", lineHeight: 35 },
  dayTitle: { color: "#0B1220" },
  subtitle: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginTop: 6, marginBottom: 16 },
  dayMutedText: { color: "#3B4A63" },
  dayAccentText: { color: "#3949DB" },
  progressCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 14, marginBottom: 12 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  progressText: { color: nsnColors.day, fontSize: 12, fontWeight: "900", lineHeight: 17, marginBottom: 8 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  dayProgressTrack: { backgroundColor: "#C7D8F0" },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: nsnColors.primary },
  stepCard: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surfaceRaised, padding: 18 },
  stepHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  stepIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(119,134,255,0.12)" },
  dayIconBubble: { backgroundColor: "#EDF2FF" },
  stepHeaderCopy: { flex: 1 },
  stepEyebrow: { color: nsnColors.day, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  stepTitle: { color: nsnColors.text, fontSize: 21, fontWeight: "900", lineHeight: 27, marginTop: 2 },
  stepCopy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
  localAreaNote: { borderRadius: 14, borderWidth: 1, borderColor: "rgba(247,200,91,0.45)", backgroundColor: "rgba(247,200,91,0.12)", color: "#F7C85B", fontSize: 12, fontWeight: "800", lineHeight: 18, padding: 11, marginTop: 12 },
  dayLocalAreaNote: { backgroundColor: "#FFF7D8", borderColor: "#D4A91E", color: "#7C5A00" },
  primaryButton: { alignSelf: "flex-start", minHeight: 44, borderRadius: 15, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, marginTop: 16 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", lineHeight: 18 },
  stepList: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  stepPill: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" },
  dayStepPill: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  stepPillActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  stepPillText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900" },
  dayStepPillText: { color: "#3B4A63" },
  stepPillTextActive: { color: "#FFFFFF" },
  navRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  navButton: { flex: 1, minHeight: 44, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" },
  dayNavButton: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  nextButton: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  disabledButton: { opacity: 0.45 },
  navButtonText: { color: nsnColors.text, fontSize: 13, fontWeight: "900" },
  nextButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },
  noteCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", padding: 14, marginTop: 16 },
  noteTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  noteCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  rtlRow: { flexDirection: "row-reverse" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
});
