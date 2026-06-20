import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import type { IconSymbolName } from "@/components/ui/icon-symbol-map";
import {
  getNextQuietSpacePromptIndex,
  quietSpaceActivitiesCopy,
  quietSpaceActivityCards,
  quietSpaceConversationPrompts,
  quietSpaceReadingNook,
} from "@/constants/quiet-space-activities";
import { nsnColors } from "@/lib/nsn-data";

type QuietSpaceActivitiesProps = {
  isDay: boolean;
};

type ReadingBackgroundId = (typeof quietSpaceReadingNook.backgroundOptions)[number]["id"];
type ReadingFontId = (typeof quietSpaceReadingNook.fontOptions)[number]["id"];
type ReadingSizeId = (typeof quietSpaceReadingNook.textSizeOptions)[number]["id"];

const coloringSwatches = ["#EAF2FF", "#D8F3F0", "#FDECC8", "#F6D9E4", "#E8E0FF"];
const emptyCanvas = Array.from({ length: 16 }, () => 0);

export function QuietSpaceActivities({ isDay }: QuietSpaceActivitiesProps) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [canvasCells, setCanvasCells] = useState(emptyCanvas);
  const [readingBackgroundId, setReadingBackgroundId] = useState<ReadingBackgroundId>(
    quietSpaceReadingNook.backgroundOptions[0].id,
  );
  const [readingFontId, setReadingFontId] = useState<ReadingFontId>(
    quietSpaceReadingNook.fontOptions[0].id,
  );
  const [readingSizeId, setReadingSizeId] = useState<ReadingSizeId>(
    quietSpaceReadingNook.textSizeOptions[1].id,
  );
  const activePrompt = quietSpaceConversationPrompts[promptIndex];
  const activeReadingBackground =
    quietSpaceReadingNook.backgroundOptions.find((option) => option.id === readingBackgroundId) ??
    quietSpaceReadingNook.backgroundOptions[0];
  const activeReadingFont =
    quietSpaceReadingNook.fontOptions.find((option) => option.id === readingFontId) ??
    quietSpaceReadingNook.fontOptions[0];
  const activeReadingSize =
    quietSpaceReadingNook.textSizeOptions.find((option) => option.id === readingSizeId) ??
    quietSpaceReadingNook.textSizeOptions[1];

  const showAnotherPrompt = () => {
    setPromptIndex((current) => getNextQuietSpacePromptIndex(current));
  };

  const colorCanvasCell = (index: number) => {
    setCanvasCells((current) =>
      current.map((value, cellIndex) =>
        cellIndex === index ? (value + 1) % coloringSwatches.length : value,
      ),
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>
          {quietSpaceActivitiesCopy.title}
        </Text>
        <Text style={[styles.sectionCopy, isDay && styles.dayMutedText]}>
          {quietSpaceActivitiesCopy.copy}
        </Text>
      </View>

      <View style={styles.cardList}>
        {quietSpaceActivityCards.map((activity) => {
          const iconName = activity.iconName as IconSymbolName;

          return (
            <View key={activity.id} style={[styles.card, isDay && styles.dayCard]}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, isDay && styles.dayIconBubble]}>
                  <IconSymbol name={iconName} color={isDay ? "#445E93" : nsnColors.day} size={20} />
                </View>
                <View style={styles.cardTitleCopy}>
                  <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{activity.title}</Text>
                  <Text style={[styles.statusText, isDay && styles.dayAccentText]}>
                    {activity.statusLabel}
                  </Text>
                </View>
              </View>
              <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>{activity.copy}</Text>

              {activity.id === "coloring-canvas" ? (
                <View style={[styles.canvasPreview, isDay && styles.daySoftPanel]}>
                  <View style={styles.canvasGrid}>
                    {canvasCells.map((swatchIndex, index) => (
                      <TouchableOpacity
                        key={`color-cell-${index}`}
                        activeOpacity={0.78}
                        onPress={() => colorCanvasCell(index)}
                        accessibilityRole="button"
                        accessibilityLabel={`Coloring square ${index + 1}`}
                        style={[
                          styles.canvasCell,
                          {
                            backgroundColor: coloringSwatches[swatchIndex],
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.placeholderCopy, isDay && styles.dayMutedText]}>
                    {activity.placeholderCopy}
                  </Text>
                </View>
              ) : null}

              {activity.id === "conversation-cards" ? (
                <View style={styles.activityStack}>
                  <View style={[styles.promptCard, isDay && styles.dayPromptCard]}>
                    <Text style={[styles.promptText, isDay && styles.dayTitle]}>{activePrompt}</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={showAnotherPrompt}
                    accessibilityRole="button"
                    accessibilityLabel="Show another card"
                    style={styles.primaryButton}
                  >
                    <Text style={styles.primaryButtonText}>Show another card</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {activity.id === "reading-nook" ? (
                <View style={styles.activityStack}>
                  <View
                    style={[
                      styles.readerPanel,
                      {
                        backgroundColor: activeReadingBackground.backgroundColor,
                        borderColor: isDay ? "#D8E1EA" : "rgba(120,144,184,0.22)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.readerTitle,
                        {
                          color: activeReadingBackground.textColor,
                          fontFamily: activeReadingFont.fontFamily,
                        },
                      ]}
                    >
                      {quietSpaceReadingNook.sampleTitle}
                    </Text>
                    <Text
                      style={[
                        styles.readerText,
                        {
                          color: activeReadingBackground.textColor,
                          fontFamily: activeReadingFont.fontFamily,
                          fontSize: activeReadingSize.fontSize,
                          lineHeight: activeReadingSize.lineHeight,
                        },
                      ]}
                    >
                      {quietSpaceReadingNook.sampleText}
                    </Text>
                  </View>

                  <View style={styles.readerControls}>
                    <View style={styles.readerControlGroup}>
                      <Text style={[styles.readerControlLabel, isDay && styles.dayMutedText]}>
                        Background
                      </Text>
                      <View style={styles.optionRow}>
                        {quietSpaceReadingNook.backgroundOptions.map((option) => {
                          const active = readingBackgroundId === option.id;

                          return (
                            <TouchableOpacity
                              key={option.id}
                              activeOpacity={0.78}
                              onPress={() => setReadingBackgroundId(option.id)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                              style={[
                                styles.readerOption,
                                isDay && styles.dayReaderOption,
                                active && styles.readerOptionActive,
                              ]}
                            >
                              <View
                                style={[
                                  styles.readerSwatch,
                                  { backgroundColor: option.backgroundColor },
                                ]}
                              />
                              <Text
                                style={[
                                  styles.readerOptionText,
                                  isDay && styles.dayMutedText,
                                  active && styles.readerOptionTextActive,
                                ]}
                              >
                                {option.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    <View style={styles.readerControlGroup}>
                      <Text style={[styles.readerControlLabel, isDay && styles.dayMutedText]}>
                        Font
                      </Text>
                      <View style={styles.optionRow}>
                        {quietSpaceReadingNook.fontOptions.map((option) => {
                          const active = readingFontId === option.id;

                          return (
                            <TouchableOpacity
                              key={option.id}
                              activeOpacity={0.78}
                              onPress={() => setReadingFontId(option.id)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                              style={[
                                styles.readerOption,
                                isDay && styles.dayReaderOption,
                                active && styles.readerOptionActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.readerOptionText,
                                  isDay && styles.dayMutedText,
                                  active && styles.readerOptionTextActive,
                                ]}
                              >
                                {option.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    <View style={styles.readerControlGroup}>
                      <Text style={[styles.readerControlLabel, isDay && styles.dayMutedText]}>
                        Text size
                      </Text>
                      <View style={styles.optionRow}>
                        {quietSpaceReadingNook.textSizeOptions.map((option) => {
                          const active = readingSizeId === option.id;

                          return (
                            <TouchableOpacity
                              key={option.id}
                              activeOpacity={0.78}
                              onPress={() => setReadingSizeId(option.id)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                              style={[
                                styles.readerOption,
                                isDay && styles.dayReaderOption,
                                active && styles.readerOptionActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.readerOptionText,
                                  isDay && styles.dayMutedText,
                                  active && styles.readerOptionTextActive,
                                ]}
                              >
                                {option.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>

                  <Text style={[styles.placeholderCopy, isDay && styles.daySoftNote]}>
                    {quietSpaceReadingNook.narratorLabel}. {activity.placeholderCopy}
                  </Text>
                </View>
              ) : null}

              {activity.id !== "coloring-canvas" &&
              activity.id !== "conversation-cards" &&
              activity.id !== "reading-nook" ? (
                <Text style={[styles.placeholderCopy, isDay && styles.daySoftNote]}>
                  {activity.placeholderCopy}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  sectionHeader: { gap: 4 },
  sectionTitle: { color: nsnColors.text, fontSize: 22, fontWeight: "900", lineHeight: 28 },
  sectionCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 20 },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#53677A" },
  dayAccentText: { color: "#445E93" },
  cardList: { gap: 10 },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    padding: 14,
    gap: 10,
  },
  dayCard: { backgroundColor: "#FFFFFF", borderColor: "#D8E1EA" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(119,134,255,0.12)",
    flexShrink: 0,
  },
  dayIconBubble: { backgroundColor: "#EDF2FF" },
  cardTitleCopy: { flex: 1, minWidth: 0 },
  cardTitle: { color: nsnColors.text, fontSize: 18, fontWeight: "900", lineHeight: 24 },
  statusText: { color: nsnColors.day, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  cardCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 20 },
  canvasPreview: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(120,144,184,0.22)",
    backgroundColor: "rgba(255,255,255,0.035)",
    padding: 12,
    gap: 10,
  },
  daySoftPanel: { backgroundColor: "#F4F7F8", borderColor: "#D8E1EA" },
  canvasGrid: {
    width: "100%",
    maxWidth: 248,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  canvasCell: {
    width: 56,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(83,103,122,0.24)",
  },
  activityStack: { gap: 10 },
  promptCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(119,134,255,0.28)",
    backgroundColor: "rgba(119,134,255,0.08)",
    padding: 14,
  },
  dayPromptCard: { borderColor: "#C7D8F0", backgroundColor: "#F4F7FC" },
  promptText: { color: nsnColors.text, fontSize: 17, fontWeight: "900", lineHeight: 24 },
  readerPanel: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  readerTitle: { fontSize: 18, fontWeight: "900", lineHeight: 25 },
  readerText: { fontWeight: "600" },
  readerControls: { gap: 10 },
  readerControlGroup: { gap: 6 },
  readerControlLabel: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  readerOption: {
    minHeight: 36,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 11,
  },
  dayReaderOption: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  readerOptionActive: {
    backgroundColor: nsnColors.selectedChip,
    borderColor: nsnColors.selectedChipBorder,
  },
  readerOptionText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  readerOptionTextActive: { color: nsnColors.selectedChipText },
  readerSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(83,103,122,0.26)",
  },
  primaryButton: {
    alignSelf: "flex-start",
    minHeight: 42,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1BB6C8",
    backgroundColor: nsnColors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", lineHeight: 18 },
  placeholderCopy: {
    color: nsnColors.muted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 18,
  },
  daySoftNote: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D8E1EA",
    backgroundColor: "#F4F7F8",
    color: "#53677A",
    padding: 11,
  },
});
