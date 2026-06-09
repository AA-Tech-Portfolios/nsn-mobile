import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { alphaWalkthroughCopy, alphaWalkthroughSteps } from "@/lib/alpha-walkthrough-copy";
import { meetupTutorialCards, type MeetupTutorialCard } from "@/lib/meetup-alpha-ux";
import { nsnColors } from "@/lib/nsn-data";

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

export default function AlphaWalkthroughScreen() {
  const router = useRouter();
  const { isNightMode, appLanguage, suburb, screenReaderHints } = useAppSettings();
  const [stepIndex, setStepIndex] = useState(0);
  const [dismissedTutorialIds, setDismissedTutorialIds] = useState<MeetupTutorialCard["id"][]>([]);
  const isDay = !isNightMode;
  const isRtl = rtlLanguages.has(getLanguageBase(appLanguage));
  const step = alphaWalkthroughSteps[stepIndex];
  const progressText = `Step ${stepIndex + 1} of ${alphaWalkthroughSteps.length}`;
  const localAreaCopy = useMemo(
    () => (suburb ? `Current local area: ${suburb}. You can change it from Search NSN on Home or from Profile.` : "No local area is set yet. Search NSN on Home can find a suburb, region, or activity."),
    [suburb]
  );
  const canGoBack = stepIndex > 0;
  const canGoNext = stepIndex < alphaWalkthroughSteps.length - 1;
  const visibleTutorialCards = meetupTutorialCards.filter((card) => !dismissedTutorialIds.includes(card.id));

  const openStepRoute = () => {
    router.push(step.route as never);
  };

  const dismissTutorial = (tutorialId: MeetupTutorialCard["id"]) => {
    setDismissedTutorialIds((current) => (current.includes(tutorialId) ? current : [...current, tutorialId]));
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[styles.backButton, isDay && styles.dayIconButton]}
          accessibilityRole="button"
          accessibilityLabel={alphaWalkthroughCopy.closeLabel}
        >
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <Text style={[styles.title, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{alphaWalkthroughCopy.title}</Text>
        <Text style={[styles.subtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
          {alphaWalkthroughCopy.subtitle}
        </Text>

        <View style={[styles.progressCard, isDay && styles.dayCard]}>
          <Text style={[styles.progressText, isDay && styles.dayAccentText]}>{progressText}</Text>
          <View style={[styles.progressTrack, isDay && styles.dayProgressTrack]}>
            <View style={[styles.progressFill, { width: `${((stepIndex + 1) / alphaWalkthroughSteps.length) * 100}%` }]} />
          </View>
        </View>

        <View style={[styles.stepCard, isDay && styles.dayCard]}>
          <View style={[styles.stepHeader, isRtl && styles.rtlRow]}>
            <View style={[styles.stepIcon, isDay && styles.dayIconBubble]}>
              <IconSymbol name={step.icon} color={isDay ? "#445E93" : nsnColors.day} size={24} />
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
          {alphaWalkthroughSteps.map((item, index) => {
            const active = index === stepIndex;
            return (
              <TouchableOpacity
                key={item.title}
                activeOpacity={0.78}
                onPress={() => setStepIndex(index)}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}. ${index + 1} of ${alphaWalkthroughSteps.length}`}
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

        <View style={[styles.tutorialPanel, isDay && styles.dayCard]}>
          <Text style={[styles.progressText, isDay && styles.dayAccentText, isRtl && styles.rtlText]}>Interactive tutorials</Text>
          <Text style={[styles.noteCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Dismissible local cards for the flows testers should try. No analytics or backend persistence is connected.
          </Text>
          <View style={styles.tutorialList}>
            {visibleTutorialCards.map((card) => (
              <View
                key={card.id}
                style={[styles.tutorialCard, isDay && styles.dayNavButton, isRtl && styles.rtlRow]}
              >
                <View style={[styles.stepIconSmall, isDay && styles.dayIconBubble]}>
                  <IconSymbol name={card.iconName} color={isDay ? "#445E93" : nsnColors.day} size={18} />
                </View>
                <View style={styles.tutorialCopy}>
                  <Text style={[styles.tutorialTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{card.title}</Text>
                  <Text style={[styles.tutorialText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{card.copy}</Text>
                  <TouchableOpacity
                    activeOpacity={0.78}
                    onPress={() => router.push(card.id === "comfort-modes" ? "/(tabs)/settings" as never : card.id === "meetup-readiness" || card.id === "soft-exit" ? "/event/movie-night-watch-chat" as never : "/(tabs)/profile" as never)}
                    accessibilityRole="button"
                    accessibilityLabel={card.actionLabel}
                    style={[styles.tutorialActionButton, isDay && styles.dayStepPill]}
                  >
                    <Text style={[styles.tutorialAction, isDay && styles.dayAccentText, isRtl && styles.rtlText]}>{card.actionLabel}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => dismissTutorial(card.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Dismiss ${card.title}`}
                  style={[styles.dismissButton, isDay && styles.dayStepPill]}
                >
                  <IconSymbol name="xmark" color={isDay ? "#53677A" : nsnColors.muted} size={15} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {visibleTutorialCards.length === 0 ? (
            <Text style={[styles.tutorialText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
              Tutorial cards dismissed for this visit. The dismissal was not sent anywhere.
            </Text>
          ) : null}
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity
            activeOpacity={0.78}
            onPress={() => setStepIndex((current) => Math.max(0, current - 1))}
            disabled={!canGoBack}
            accessibilityRole="button"
            accessibilityLabel={alphaWalkthroughCopy.previousLabel}
            accessibilityState={{ disabled: !canGoBack }}
            style={[styles.navButton, isDay && styles.dayNavButton, !canGoBack && styles.disabledButton]}
          >
            <Text style={[styles.navButtonText, isDay && styles.dayTitle]}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.78}
            onPress={() => (canGoNext ? setStepIndex((current) => current + 1) : router.push("/(tabs)" as never))}
            accessibilityRole="button"
            accessibilityLabel={canGoNext ? alphaWalkthroughCopy.nextLabel : alphaWalkthroughCopy.finishLabel}
            style={[styles.navButton, styles.nextButton]}
          >
            <Text style={styles.nextButtonText}>{canGoNext ? "Next" : "Done"}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.noteCard, isDay && styles.dayCard]}>
          <Text style={[styles.noteTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{alphaWalkthroughCopy.prototypeNoteTitle}</Text>
          <Text style={[styles.noteCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            {alphaWalkthroughCopy.prototypeNoteCopy}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayContainer: { backgroundColor: "#FAFBFC" },
  content: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 20, paddingBottom: 36 },
  backButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)", marginBottom: 12 },
  dayIconButton: { backgroundColor: "#EEF3F4" },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "900", lineHeight: 35 },
  dayTitle: { color: "#0B1220" },
  subtitle: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginTop: 6, marginBottom: 16 },
  dayMutedText: { color: "#53677A" },
  dayAccentText: { color: "#445E93" },
  progressCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 14, marginBottom: 12 },
  dayCard: { backgroundColor: "#FFFFFF", borderColor: "#D8E1EA" },
  progressText: { color: nsnColors.day, fontSize: 12, fontWeight: "900", lineHeight: 17, marginBottom: 8 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  dayProgressTrack: { backgroundColor: "#C7D8F0" },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: nsnColors.primary },
  stepCard: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surfaceRaised, padding: 18 },
  stepHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  stepIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(119,134,255,0.12)", flexShrink: 0 },
  stepIconSmall: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(119,134,255,0.12)", flexShrink: 0 },
  dayIconBubble: { backgroundColor: "#EDF2FF" },
  stepHeaderCopy: { flex: 1, minWidth: 0 },
  stepEyebrow: { color: nsnColors.day, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  stepTitle: { color: nsnColors.text, fontSize: 21, fontWeight: "900", lineHeight: 27, marginTop: 2 },
  stepCopy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
  localAreaNote: { borderRadius: 14, borderWidth: 1, borderColor: "rgba(247,200,91,0.45)", backgroundColor: "rgba(247,200,91,0.12)", color: "#F7C85B", fontSize: 12, fontWeight: "800", lineHeight: 18, padding: 11, marginTop: 12 },
  dayLocalAreaNote: { backgroundColor: "#FFF7D8", borderColor: "#D4A91E", color: "#7C5A00" },
  primaryButton: { alignSelf: "flex-start", maxWidth: "100%", minHeight: 44, borderRadius: 15, borderWidth: StyleSheet.hairlineWidth, borderColor: "#1BB6C8", backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 16, marginTop: 16 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", lineHeight: 18, textAlign: "center" },
  stepList: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  stepPill: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" },
  dayStepPill: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  stepPillActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  stepPillText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900" },
  dayStepPillText: { color: "#53677A" },
  stepPillTextActive: { color: "#FFFFFF" },
  tutorialPanel: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", padding: 14, marginTop: 16, gap: 10 },
  tutorialList: { gap: 8 },
  tutorialCard: { minHeight: 88, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 12 },
  tutorialCopy: { flex: 1, minWidth: 0 },
  tutorialTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 19 },
  tutorialText: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 2 },
  tutorialActionButton: { alignSelf: "flex-start", minHeight: 32, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, marginTop: 7 },
  tutorialAction: { color: nsnColors.day, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  dismissButton: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  navRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  navButton: { flex: 1, minHeight: 44, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" },
  dayNavButton: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
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
