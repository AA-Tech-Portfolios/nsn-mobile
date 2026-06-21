import { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { QuietSpaceActivities } from "@/components/quiet-space-activities";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppSettings } from "@/lib/app-settings";
import {
  getAmbientPlaybackUnavailableCopy,
  quietSpaceAmbientPreview,
  quietSpaceAmbientPlaceholder,
  quietSpaceCards,
  quietSpaceCopy,
  resolveAmbientPlaybackState,
} from "@/lib/quiet-space";
import { nsnColors } from "@/lib/nsn-data";
import type { IconSymbolName } from "@/components/ui/icon-symbol-map";

type AmbientSampleId = (typeof quietSpaceAmbientPreview.sampleOptions)[number]["id"];
type AmbientSpeed = (typeof quietSpaceAmbientPreview.speedOptions)[number];
type AmbientVolume = (typeof quietSpaceAmbientPreview.volumeOptions)[number]["value"];

type AmbientAudioHandles = {
  context: AudioContext;
  source: AudioBufferSourceNode;
  gain: GainNode;
};

type WebAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const quietSpaceIcons: Record<(typeof quietSpaceCards)[number]["id"], IconSymbolName> = {
  "ambient-sounds": "volume.off",
};

function isVoiceSample(sampleId: AmbientSampleId) {
  return sampleId === "calm-voice-male" || sampleId === "calm-voice-female";
}

function findPreferredVoice(voices: SpeechSynthesisVoice[], sampleId: AmbientSampleId) {
  const voiceHints =
    sampleId === "calm-voice-female"
      ? ["female", "woman", "samantha", "victoria", "karen", "zira", "susan", "aria"]
      : ["male", "man", "daniel", "david", "mark", "alex", "guy", "fred"];

  return (
    voices.find((voice) =>
      voiceHints.some((hint) => voice.name.toLowerCase().includes(hint)),
    ) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
    voices[0]
  );
}

function writeWaveString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function createWaveBlob(buffer: AudioBuffer, gainValue: number) {
  const channelData = buffer.getChannelData(0);
  const bytesPerSample = 2;
  const headerBytes = 44;
  const dataBytes = channelData.length * bytesPerSample;
  const arrayBuffer = new ArrayBuffer(headerBytes + dataBytes);
  const view = new DataView(arrayBuffer);

  writeWaveString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeWaveString(view, 8, "WAVE");
  writeWaveString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 8 * bytesPerSample, true);
  writeWaveString(view, 36, "data");
  view.setUint32(40, dataBytes, true);

  let offset = headerBytes;
  for (let index = 0; index < channelData.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, channelData[index] * gainValue));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += bytesPerSample;
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

function getSampleFileName(sample: NonNullable<typeof quietSpaceAmbientPreview.sampleOptions[number]>) {
  return `${sample.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}.wav`;
}

export default function QuietSpaceScreen() {
  const router = useRouter();
  const { isNightMode, screenReaderHints } = useAppSettings();
  const isDay = !isNightMode;
  const [ambientSampleId, setAmbientSampleId] = useState<AmbientSampleId>("beach-waves");
  const [ambientSpeed, setAmbientSpeed] = useState<AmbientSpeed>(1);
  const [ambientVolume, setAmbientVolume] = useState<AmbientVolume>(0.6);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [ambientPlaybackHelperCopy, setAmbientPlaybackHelperCopy] = useState<string | null>(null);
  const audioHandlesRef = useRef<AmbientAudioHandles | null>(null);
  const selectedAmbientSample = quietSpaceAmbientPreview.sampleOptions.find(
    (sample) => sample.id === ambientSampleId,
  );

  const stopAmbientPreview = (updateState = true) => {
    try {
      audioHandlesRef.current?.source.stop();
    } catch {
      // Source may already be stopped when replaying or switching samples.
    }
    audioHandlesRef.current?.context.close();
    audioHandlesRef.current = null;

    if (Platform.OS === "web" && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (updateState) {
      setIsAmbientPlaying(false);
    }
  };

  useEffect(() => stopAmbientPreview, []);

  const fillGentleRain = (data: Float32Array, sampleRate: number) => {
    let last = 0;
    for (let index = 0; index < data.length; index += 1) {
      const seconds = index / sampleRate;
      const drizzle = (Math.random() * 2 - 1) * 0.018;
      const filtered = last * 0.96 + drizzle * 0.04;
      last = filtered;
      const softPulse = Math.sin(seconds * Math.PI * 2 * 1.7 * ambientSpeed) * 0.008;
      data[index] = filtered + softPulse;
    }
  };

  const fillSoftWhiteNoise = (data: Float32Array) => {
    let last = 0;
    for (let index = 0; index < data.length; index += 1) {
      const softNoise = (Math.random() * 2 - 1) * 0.045;
      last = last * 0.985 + softNoise * 0.015;
      data[index] = last;
    }
  };

  const fillMorningBirds = (data: Float32Array, sampleRate: number) => {
    for (let index = 0; index < data.length; index += 1) {
      const seconds = index / sampleRate;
      const lightAir = (Math.random() * 2 - 1) * 0.002;
      const chirpOne = Math.sin(seconds * Math.PI * 2 * 880) * 0.035;
      const chirpTwo = Math.sin(seconds * Math.PI * 2 * 1180) * 0.025;
      const chirpWindow =
        Math.max(0, Math.sin(seconds * Math.PI * 2 * 0.42 * ambientSpeed)) ** 8;
      const secondWindow =
        Math.max(0, Math.sin((seconds + 0.37) * Math.PI * 2 * 0.31 * ambientSpeed)) ** 10;
      data[index] = lightAir + chirpOne * chirpWindow + chirpTwo * secondWindow;
    }
  };

  const fillForestBreeze = (data: Float32Array, sampleRate: number) => {
    let last = 0;
    for (let index = 0; index < data.length; index += 1) {
      const seconds = index / sampleRate;
      const gust = (Math.sin(seconds * Math.PI * 0.48 * ambientSpeed) + 1) / 2;
      const leafNoise = (Math.random() * 2 - 1) * (0.009 + gust * 0.022);
      last = last * 0.965 + leafNoise * 0.035;
      data[index] = last;
    }
  };

  const fillCreekWater = (data: Float32Array, sampleRate: number) => {
    let last = 0;
    for (let index = 0; index < data.length; index += 1) {
      const seconds = index / sampleRate;
      const ripple = (Math.sin(seconds * Math.PI * 2 * 3.4 * ambientSpeed) + 1) / 2;
      const waterNoise = (Math.random() * 2 - 1) * (0.014 + ripple * 0.026);
      last = last * 0.86 + waterNoise * 0.14;
      data[index] = last * 0.72;
    }
  };

  const fillEveningCrickets = (data: Float32Array, sampleRate: number) => {
    for (let index = 0; index < data.length; index += 1) {
      const seconds = index / sampleRate;
      const pulse =
        Math.max(0, Math.sin(seconds * Math.PI * 2 * 5.8 * ambientSpeed)) ** 14;
      const secondPulse =
        Math.max(0, Math.sin((seconds + 0.19) * Math.PI * 2 * 4.6 * ambientSpeed)) ** 16;
      const cricketOne = Math.sin(seconds * Math.PI * 2 * 3150) * 0.022 * pulse;
      const cricketTwo = Math.sin(seconds * Math.PI * 2 * 2480) * 0.016 * secondPulse;
      const nightAir = (Math.random() * 2 - 1) * 0.0015;
      data[index] = nightAir + cricketOne + cricketTwo;
    }
  };

  const fillBeachWaves = (data: Float32Array, sampleRate: number) => {
    let last = 0;
    for (let index = 0; index < data.length; index += 1) {
      const seconds = index / sampleRate;
      const swell =
        (Math.sin(seconds * Math.PI * 0.72 * ambientSpeed) + 1) / 2;
      const foamNoise = (Math.random() * 2 - 1) * (0.012 + swell * 0.03);
      const foam = last * 0.92 + foamNoise * 0.08;
      last = foam;
      data[index] = foam * (0.65 + swell * 0.35);
    }
  };

  const fillSoftClassicalPiano = (data: Float32Array, sampleRate: number) => {
    const notes = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23];
    const noteDuration = 0.62 / ambientSpeed;

    for (let index = 0; index < data.length; index += 1) {
      const seconds = index / sampleRate;
      const noteIndex = Math.floor(seconds / noteDuration) % notes.length;
      const noteTime = seconds % noteDuration;
      const frequency = notes[noteIndex];
      const attack = Math.min(1, noteTime / 0.035);
      const decay = Math.exp(-noteTime * 3.2);
      const envelope = attack * decay;
      const fundamental = Math.sin(seconds * Math.PI * 2 * frequency);
      const softOvertone = Math.sin(seconds * Math.PI * 2 * frequency * 2) * 0.18;
      data[index] = (fundamental + softOvertone) * envelope * 0.12;
    }
  };

  const createAmbientBuffer = (context: AudioContext, durationSeconds = 4) => {
    const frameCount = context.sampleRate * durationSeconds;
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const data = buffer.getChannelData(0);

    if (ambientSampleId === "soft-white-noise") {
      fillSoftWhiteNoise(data);
    } else if (ambientSampleId === "beach-waves") {
      fillBeachWaves(data, context.sampleRate);
    } else if (ambientSampleId === "morning-birds") {
      fillMorningBirds(data, context.sampleRate);
    } else if (ambientSampleId === "forest-breeze") {
      fillForestBreeze(data, context.sampleRate);
    } else if (ambientSampleId === "creek-water") {
      fillCreekWater(data, context.sampleRate);
    } else if (ambientSampleId === "evening-crickets") {
      fillEveningCrickets(data, context.sampleRate);
    } else if (ambientSampleId === "gentle-rain") {
      fillGentleRain(data, context.sampleRate);
    } else if (ambientSampleId === "soft-classical-piano") {
      fillSoftClassicalPiano(data, context.sampleRate);
    } else {
      fillBeachWaves(data, context.sampleRate);
    }

    return buffer;
  };

  const getAudioContextConstructor = () => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      return null;
    }

    const webAudioWindow = window as WebAudioWindow;
    return webAudioWindow.AudioContext ?? webAudioWindow.webkitAudioContext ?? null;
  };

  const playAmbientSound = () => {
    const AudioContextCtor = getAudioContextConstructor();

    if (!AudioContextCtor) {
      const nextState = resolveAmbientPlaybackState({ didStartAudio: false });
      setIsAmbientPlaying(nextState.isPlaying);
      setAmbientPlaybackHelperCopy(nextState.helperCopy);
      return false;
    }

    const context = new AudioContextCtor();
    try {
      const buffer = createAmbientBuffer(context);
      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      source.loop = true;
      source.playbackRate.value = ambientSpeed;
      gain.gain.value = ambientVolume * 0.14;
      source.connect(gain);
      gain.connect(context.destination);
      source.start();
      audioHandlesRef.current = { context, source, gain };
      const nextState = resolveAmbientPlaybackState({ didStartAudio: true });
      setIsAmbientPlaying(nextState.isPlaying);
      setAmbientPlaybackHelperCopy(nextState.helperCopy);
      return true;
    } catch {
      context.close();
      audioHandlesRef.current = null;
      const nextState = resolveAmbientPlaybackState({ didStartAudio: false });
      setIsAmbientPlaying(nextState.isPlaying);
      setAmbientPlaybackHelperCopy(nextState.helperCopy);
      return false;
    }
  };

  const downloadAmbientSample = () => {
    if (isVoiceSample(ambientSampleId) || !selectedAmbientSample) {
      return;
    }

    const AudioContextCtor = getAudioContextConstructor();

    if (!AudioContextCtor || typeof document === "undefined" || typeof URL === "undefined") {
      return;
    }

    const context = new AudioContextCtor();
    const buffer = createAmbientBuffer(context);
    const blob = createWaveBlob(buffer, ambientVolume * 0.14);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = getSampleFileName(selectedAmbientSample);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    context.close();
  };

  const playCalmVoice = (speed = ambientSpeed, volume = ambientVolume) => {
    if (Platform.OS === "web" && typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Take a slow breath. You can arrive gently, and move at your own pace.",
      );
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = findPreferredVoice(voices, ambientSampleId);
      utterance.rate = speed;
      utterance.pitch = ambientSampleId === "calm-voice-female" ? 1.08 : 0.86;
      utterance.volume = volume;
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.onend = () => setIsAmbientPlaying(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsAmbientPlaying(true);
      setAmbientPlaybackHelperCopy(null);
      return true;
    }

    const nextState = resolveAmbientPlaybackState({ didStartAudio: false });
    setIsAmbientPlaying(nextState.isPlaying);
    setAmbientPlaybackHelperCopy(nextState.helperCopy);
    return false;
  };

  const getSelectedSamplePlaybackUnavailableCopy = () => {
    if (isVoiceSample(ambientSampleId)) {
      return Platform.OS === "web" && typeof window !== "undefined" && "speechSynthesis" in window
        ? null
        : getAmbientPlaybackUnavailableCopy({ platformOS: Platform.OS, hasAudioContext: false });
    }

    return getAmbientPlaybackUnavailableCopy({
      platformOS: Platform.OS,
      hasAudioContext: Boolean(getAudioContextConstructor()),
    });
  };

  const toggleAmbientPreview = () => {
    if (isSelectedSamplePlaybackDisabled) {
      setAmbientPlaybackHelperCopy(selectedSamplePlaybackUnavailableCopy);
      return;
    }

    if (isAmbientPlaying) {
      stopAmbientPreview();
      return;
    }

    if (ambientSampleId === "calm-voice-male" || ambientSampleId === "calm-voice-female") {
      playCalmVoice();
      return;
    }

    playAmbientSound();
  };

  const replayAmbientPreview = () => {
    if (isSelectedSamplePlaybackDisabled) {
      setAmbientPlaybackHelperCopy(selectedSamplePlaybackUnavailableCopy);
      return;
    }

    stopAmbientPreview(false);

    setTimeout(() => {
      if (ambientSampleId === "calm-voice-male" || ambientSampleId === "calm-voice-female") {
        playCalmVoice();
      } else {
        playAmbientSound();
      }
    }, 0);
  };

  const unwindAmbientPreview = () => {
    stopAmbientPreview();
  };

  const chooseAmbientSample = (sampleId: AmbientSampleId) => {
    if (isAmbientPlaying) {
      stopAmbientPreview();
    }
    setAmbientPlaybackHelperCopy(null);
    setAmbientSampleId(sampleId);
  };

  const chooseAmbientSpeed = (speed: AmbientSpeed) => {
    if (audioHandlesRef.current) {
      const { context, source } = audioHandlesRef.current;
      source.playbackRate.setValueAtTime(speed, context.currentTime);
    } else if (isAmbientPlaying && isVoiceSample(ambientSampleId)) {
      playCalmVoice(speed, ambientVolume);
    }
    setAmbientSpeed(speed);
  };

  const chooseAmbientVolume = (volume: AmbientVolume) => {
    if (audioHandlesRef.current) {
      const { context, gain } = audioHandlesRef.current;
      gain.gain.setValueAtTime(volume * 0.14, context.currentTime);
    } else if (isAmbientPlaying && isVoiceSample(ambientSampleId)) {
      playCalmVoice(ambientSpeed, volume);
    }
    setAmbientVolume(volume);
  };

  const selectedSamplePlaybackUnavailableCopy = getSelectedSamplePlaybackUnavailableCopy();
  const isSelectedSamplePlaybackDisabled = Boolean(selectedSamplePlaybackUnavailableCopy);
  const visibleAmbientPlaybackHelperCopy =
    ambientPlaybackHelperCopy ?? selectedSamplePlaybackUnavailableCopy;

  return (
    <ScreenContainer
      containerClassName="bg-background"
      safeAreaClassName="bg-background"
      style={isDay && styles.dayContainer}
    >
      <ScrollView
        style={[styles.screen, isDay && styles.dayContainer]}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator
      >
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[styles.backButton, isDay && styles.dayIconButton]}
          accessibilityRole="button"
          accessibilityLabel="Close Quiet Space"
        >
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={[styles.headerIcon, isDay && styles.dayIconBubble]}>
            <IconSymbol name="moon" color={isDay ? "#445E93" : nsnColors.day} size={23} />
          </View>
          <Text style={[styles.title, isDay && styles.dayTitle]}>{quietSpaceCopy.title}</Text>
          <Text style={[styles.helperCopy, isDay && styles.dayMutedText]}>
            {quietSpaceCopy.helperCopy}
          </Text>
        </View>

        <View style={styles.cardList}>
          {quietSpaceCards.map((card) => {
            const iconName = quietSpaceIcons[card.id];

            if (card.id === "ambient-sounds") {
              return (
                <View key={card.id} style={[styles.card, isDay && styles.dayCard]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.cardIcon, isDay && styles.dayIconBubble]}>
                      <IconSymbol name={iconName} color={isDay ? "#445E93" : nsnColors.day} size={20} />
                    </View>
                    <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{card.title}</Text>
                  </View>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>
                    {quietSpaceAmbientPlaceholder.copy}
                  </Text>
                  <TouchableOpacity
                    disabled={quietSpaceAmbientPlaceholder.buttonDisabled}
                    accessibilityRole="button"
                    accessibilityLabel={quietSpaceAmbientPlaceholder.buttonLabel}
                    accessibilityHint={
                      screenReaderHints
                        ? "Ambient sounds are a placeholder and do not play audio."
                        : undefined
                    }
                    accessibilityState={{ disabled: quietSpaceAmbientPlaceholder.buttonDisabled }}
                    style={[styles.placeholderButton, isDay && styles.dayPlaceholderButton]}
                  >
                    <Text style={[styles.placeholderButtonText, isDay && styles.dayAccentText]}>
                      {quietSpaceAmbientPlaceholder.buttonLabel}
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.previewPanel, isDay && styles.dayPreviewPanel]}>
                    <View style={styles.previewHeader}>
                      <View style={styles.previewHeaderText}>
                        <Text style={[styles.previewTitle, isDay && styles.dayTitle]}>
                          {quietSpaceAmbientPreview.title}
                        </Text>
                        <Text style={[styles.previewCopy, isDay && styles.dayMutedText]}>
                          {quietSpaceAmbientPreview.helperCopy}
                        </Text>
                        {visibleAmbientPlaybackHelperCopy ? (
                          <Text style={[styles.previewSupportCopy, isDay && styles.dayMutedText]}>
                            {visibleAmbientPlaybackHelperCopy}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={[styles.previewBadge, isDay && styles.dayPreviewBadge]}>
                        {quietSpaceAmbientPreview.comingLaterLabel}
                      </Text>
                    </View>

                    <View style={styles.controlGroup}>
                      <Text style={[styles.controlLabel, isDay && styles.dayMutedText]}>Sample</Text>
                      <Text style={[styles.selectedSampleText, isDay && styles.dayAccentText]}>
                        Selected: {selectedAmbientSample?.label ?? "Beach waves"}
                      </Text>
                      <View style={styles.segmentedRow}>
                        {quietSpaceAmbientPreview.sampleOptions.map((sample) => {
                          const active = ambientSampleId === sample.id;

                          return (
                            <TouchableOpacity
                              key={sample.id}
                              activeOpacity={0.78}
                              onPress={() => chooseAmbientSample(sample.id)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                              style={[
                                styles.segmentButton,
                                isDay && styles.daySegmentButton,
                                active && styles.segmentButtonActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.segmentText,
                                  isDay && styles.dayMutedText,
                                  active && styles.segmentTextActive,
                                ]}
                              >
                                {sample.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    <View style={styles.controlGroup}>
                      <Text style={[styles.controlLabel, isDay && styles.dayMutedText]}>
                        {quietSpaceAmbientPreview.speedLabel}
                      </Text>
                      <View style={styles.segmentedRow}>
                        {quietSpaceAmbientPreview.speedOptions.map((speed) => {
                          const active = ambientSpeed === speed;

                          return (
                            <TouchableOpacity
                              key={speed}
                              activeOpacity={0.78}
                              onPress={() => chooseAmbientSpeed(speed)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                              style={[
                                styles.speedButton,
                                isDay && styles.daySegmentButton,
                                active && styles.segmentButtonActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.segmentText,
                                  isDay && styles.dayMutedText,
                                  active && styles.segmentTextActive,
                                ]}
                              >
                                {speed}x
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    <View style={styles.controlGroup}>
                      <Text style={[styles.controlLabel, isDay && styles.dayMutedText]}>
                        {quietSpaceAmbientPreview.volumeLabel}
                      </Text>
                      <View style={styles.segmentedRow}>
                        {quietSpaceAmbientPreview.volumeOptions.map((volume) => {
                          const active = ambientVolume === volume.value;

                          return (
                            <TouchableOpacity
                              key={volume.value}
                              activeOpacity={0.78}
                              onPress={() => chooseAmbientVolume(volume.value)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                              style={[
                                styles.speedButton,
                                isDay && styles.daySegmentButton,
                                active && styles.segmentButtonActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.segmentText,
                                  isDay && styles.dayMutedText,
                                  active && styles.segmentTextActive,
                                ]}
                              >
                                {volume.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    <View
                      style={[styles.controlBar, isDay && styles.dayControlBar]}
                      accessibilityLabel={quietSpaceAmbientPreview.controlBarLabel}
                    >
                      <Text style={[styles.controlLabel, isDay && styles.dayMutedText]}>
                        {quietSpaceAmbientPreview.controlBarLabel}
                      </Text>
                      <View style={styles.controlBarRow}>
                        <TouchableOpacity
                          activeOpacity={0.82}
                          disabled={isSelectedSamplePlaybackDisabled}
                          onPress={replayAmbientPreview}
                          accessibilityRole="button"
                          accessibilityLabel={quietSpaceAmbientPreview.rewindLabel}
                          accessibilityState={{ disabled: isSelectedSamplePlaybackDisabled }}
                          style={[
                            styles.controlBarButton,
                            isDay && styles.daySegmentButton,
                            isSelectedSamplePlaybackDisabled && styles.controlBarButtonDisabled,
                          ]}
                        >
                          <IconSymbol name="flexible" color={isDay ? "#445E93" : nsnColors.day} size={17} />
                          <Text style={[styles.controlBarButtonText, isDay && styles.dayAccentText]}>
                            {quietSpaceAmbientPreview.rewindLabel}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.82}
                          disabled={isSelectedSamplePlaybackDisabled}
                          onPress={toggleAmbientPreview}
                          accessibilityRole="button"
                          accessibilityLabel={
                            isAmbientPlaying
                              ? quietSpaceAmbientPreview.pauseLabel
                              : quietSpaceAmbientPreview.playLabel
                          }
                          accessibilityState={{ disabled: isSelectedSamplePlaybackDisabled }}
                          style={[
                            styles.controlBarButton,
                            styles.controlBarPrimaryButton,
                            isSelectedSamplePlaybackDisabled && styles.controlBarButtonDisabled,
                          ]}
                        >
                          <IconSymbol
                            name={isAmbientPlaying ? "volume.off" : "volume"}
                            color="#FFFFFF"
                            size={18}
                          />
                          <Text style={styles.controlBarPrimaryText}>
                            {isAmbientPlaying
                              ? quietSpaceAmbientPreview.pauseLabel
                              : quietSpaceAmbientPreview.playLabel}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.82}
                          onPress={unwindAmbientPreview}
                          accessibilityRole="button"
                          accessibilityLabel={quietSpaceAmbientPreview.unwindLabel}
                          style={[styles.controlBarButton, isDay && styles.daySegmentButton]}
                        >
                          <IconSymbol name="xmark" color={isDay ? "#445E93" : nsnColors.day} size={17} />
                          <Text style={[styles.controlBarButtonText, isDay && styles.dayAccentText]}>
                            {quietSpaceAmbientPreview.unwindLabel}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.82}
                          disabled={isVoiceSample(ambientSampleId)}
                          onPress={downloadAmbientSample}
                          accessibilityRole="button"
                          accessibilityLabel={
                            isVoiceSample(ambientSampleId)
                              ? quietSpaceAmbientPreview.downloadUnavailableLabel
                              : quietSpaceAmbientPreview.downloadLabel
                          }
                          accessibilityState={{ disabled: isVoiceSample(ambientSampleId) }}
                          style={[
                            styles.controlBarButton,
                            isDay && styles.daySegmentButton,
                            isVoiceSample(ambientSampleId) && styles.downloadButtonDisabled,
                          ]}
                        >
                          <IconSymbol name="share" color={isDay ? "#445E93" : nsnColors.day} size={17} />
                          <Text style={[styles.controlBarButtonText, isDay && styles.dayAccentText]}>
                            {isVoiceSample(ambientSampleId)
                              ? quietSpaceAmbientPreview.downloadUnavailableLabel
                              : quietSpaceAmbientPreview.downloadLabel}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }

            return null;
          })}
        </View>

        <QuietSpaceActivities isDay={isDay} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayContainer: { backgroundColor: "#FAFBFC" },
  content: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    gap: 14,
    padding: 20,
    paddingBottom: 36,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  dayIconButton: { backgroundColor: "#EEF3F4" },
  header: { alignItems: "flex-start", gap: 8, paddingTop: 2, paddingBottom: 2 },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(119,134,255,0.12)",
  },
  dayIconBubble: { backgroundColor: "#EDF2FF" },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "900", lineHeight: 35 },
  dayTitle: { color: "#0B1220" },
  helperCopy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
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
  cardTitle: { color: nsnColors.text, fontSize: 18, fontWeight: "900", lineHeight: 24 },
  cardCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 20 },
  placeholderButton: {
    alignSelf: "flex-start",
    minHeight: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    justifyContent: "center",
    paddingHorizontal: 12,
    opacity: 0.64,
  },
  dayPlaceholderButton: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  placeholderButtonText: { color: nsnColors.day, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  previewPanel: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(120,144,184,0.22)",
    backgroundColor: "rgba(255,255,255,0.035)",
    padding: 12,
    gap: 12,
  },
  dayPreviewPanel: { backgroundColor: "#F4F7F8", borderColor: "#D8E1EA" },
  previewHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  previewHeaderText: { flex: 1, minWidth: 0 },
  previewTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  previewCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 2 },
  previewSupportCopy: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", lineHeight: 18, marginTop: 6 },
  previewBadge: {
    color: "#F7C85B",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(247,200,91,0.36)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 92,
    flexShrink: 0,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
  },
  dayPreviewBadge: { color: "#7C5A00", borderColor: "#D4A91E", backgroundColor: "#FFF7D8" },
  controlGroup: { gap: 6 },
  controlLabel: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  selectedSampleText: { color: nsnColors.day, fontSize: 12, fontWeight: "800", lineHeight: 17 },
  segmentedRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  segmentButton: {
    minHeight: 36,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 11,
  },
  speedButton: {
    minHeight: 34,
    minWidth: 58,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  daySegmentButton: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  segmentButtonActive: { backgroundColor: nsnColors.selectedChip, borderColor: nsnColors.selectedChipBorder },
  segmentText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  segmentTextActive: { color: nsnColors.selectedChipText },
  controlBar: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(120,144,184,0.22)",
    backgroundColor: "rgba(255,255,255,0.035)",
    padding: 10,
    gap: 8,
  },
  dayControlBar: { backgroundColor: "#FFFFFF", borderColor: "#D8E1EA" },
  controlBarRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
  controlBarButton: {
    minHeight: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 12,
  },
  controlBarPrimaryButton: {
    borderColor: "#1BB6C8",
    backgroundColor: nsnColors.primary,
  },
  controlBarButtonDisabled: { opacity: 0.56 },
  controlBarButtonText: { color: nsnColors.day, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  controlBarPrimaryText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", lineHeight: 18 },
  playButton: {
    alignSelf: "flex-start",
    minHeight: 42,
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1BB6C8",
    backgroundColor: nsnColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
  },
  playButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900", lineHeight: 18 },
  replayButton: {
    alignSelf: "flex-start",
    minHeight: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 12,
  },
  replayButtonText: { color: nsnColors.day, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  downloadButtonDisabled: { opacity: 0.56 },
});
