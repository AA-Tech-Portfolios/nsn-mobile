import { describe, expect, it } from "vitest";

import {
  canPlayAmbientAudio,
  getAmbientPlaybackUnavailableCopy,
  getNextQuietSpacePromptIndex,
  quietSpaceAmbientPreview,
  quietSpaceAmbientPlaceholder,
  quietSpaceCards,
  quietSpaceConversationPrompts,
  quietSpaceCopy,
  quietSpaceProfileEntry,
  resolveAmbientPlaybackState,
} from "./quiet-space";

describe("quiet space", () => {
  it("renders the alpha comfort area copy and ambient placeholder card", () => {
    expect(quietSpaceCopy.title).toBe("Quiet Space");
    expect(quietSpaceCopy.helperCopy).toBe(
      "A small place to pause, settle, or warm up before a meetup.",
    );
    expect(quietSpaceCards.map((card) => card.title)).toEqual(["Ambient sounds"]);
  });

  it("cycles through gentle conversation cards", () => {
    expect(quietSpaceConversationPrompts).toEqual([
      "What's a place you'd happily visit again?",
      "Tea, coffee, or something else?",
      "What's a small thing that made your week better?",
      "Beach walk or cozy café?",
      "What's a hobby you'd like to try?",
    ]);
    expect(getNextQuietSpacePromptIndex(0)).toBe(1);
    expect(getNextQuietSpacePromptIndex(quietSpaceConversationPrompts.length - 1)).toBe(0);
    expect(getNextQuietSpacePromptIndex(-1)).toBe(0);
  });

  it("marks ambient audio as a non-playing placeholder", () => {
    expect(quietSpaceAmbientPlaceholder.copy).toBe(
      "Calming sounds may be added later, such as rain, ocean, café ambience, or soft piano. Audio will always be optional and never autoplay.",
    );
    expect(quietSpaceAmbientPlaceholder.buttonLabel).toBe("Alpha preview below");
    expect(quietSpaceAmbientPlaceholder.buttonDisabled).toBe(true);
    expect(quietSpaceAmbientPlaceholder.autoplay).toBe(false);
  });

  it("allows an explicit alpha ambient sample while staying marked coming later", () => {
    expect(quietSpaceAmbientPreview).toEqual({
      title: "Sample preview",
      helperCopy:
        "Tap play to try a short alpha preview. Speed and volume can be adjusted while playing. More samples may be added as this alpha develops. Nothing starts by itself.",
      comingLaterLabel: "Coming later",
      playLabel: "Play sample",
      pauseLabel: "Pause sample",
      replayLabel: "Replay sample",
      controlBarLabel: "Sample controls",
      rewindLabel: "Rewind",
      unwindLabel: "Unwind",
      downloadLabel: "Download sample",
      downloadUnavailableLabel: "Download not available for voices",
      speedLabel: "Speed",
      speedOptions: [0.75, 1, 1.25],
      volumeLabel: "Volume",
      volumeOptions: [
        { value: 0.35, label: "Low" },
        { value: 0.6, label: "Medium" },
        { value: 0.85, label: "Full" },
      ],
      sampleOptions: [
        { id: "soft-white-noise", label: "Soft white noise" },
        { id: "beach-waves", label: "Beach waves" },
        { id: "morning-birds", label: "Morning birds" },
        { id: "forest-breeze", label: "Forest breeze" },
        { id: "creek-water", label: "Creek water" },
        { id: "evening-crickets", label: "Evening crickets" },
        { id: "gentle-rain", label: "Gentle rain" },
        { id: "soft-classical-piano", label: "Soft classical piano" },
        { id: "calm-voice-male", label: "Calm voice - male" },
        { id: "calm-voice-female", label: "Calm voice - female" },
      ],
      autoplay: false,
    });
  });

  it("includes soft white noise and nature options without static language", () => {
    const sampleLabels = quietSpaceAmbientPreview.sampleOptions.map((sample) => sample.label);

    expect(sampleLabels).toEqual([
      "Soft white noise",
      "Beach waves",
      "Morning birds",
      "Forest breeze",
      "Creek water",
      "Evening crickets",
      "Gentle rain",
      "Soft classical piano",
      "Calm voice - male",
      "Calm voice - female",
    ]);
    expect(sampleLabels.join(" ")).not.toMatch(/\bstatic\b/i);
  });

  it("labels sample downloads as optional and excludes voice export", () => {
    expect(quietSpaceAmbientPreview.helperCopy).toContain(
      "Speed and volume can be adjusted while playing",
    );
    expect(quietSpaceAmbientPreview.helperCopy).toContain("alpha develops");
    expect(quietSpaceAmbientPreview.helperCopy).toContain("Nothing starts by itself");
    expect(quietSpaceAmbientPreview.downloadLabel).toBe("Download sample");
    expect(quietSpaceAmbientPreview.downloadUnavailableLabel).toBe(
      "Download not available for voices",
    );
    expect(
      `${quietSpaceAmbientPreview.downloadLabel} ${quietSpaceAmbientPreview.downloadUnavailableLabel}`,
    ).not.toMatch(/\bmust|required|streak|score|leaderboard\b/i);
  });

  it("labels the sample control bar without pressure language", () => {
    expect(quietSpaceAmbientPreview.controlBarLabel).toBe("Sample controls");
    expect(quietSpaceAmbientPreview.rewindLabel).toBe("Rewind");
    expect(quietSpaceAmbientPreview.unwindLabel).toBe("Unwind");
    expect(
      `${quietSpaceAmbientPreview.controlBarLabel} ${quietSpaceAmbientPreview.rewindLabel} ${quietSpaceAmbientPreview.unwindLabel}`,
    ).not.toMatch(/\bmust|required|streak|score|leaderboard|challenge\b/i);
  });

  it("keeps the feature optional and non-competitive", () => {
    const visibleCopy = [
      quietSpaceCopy.title,
      quietSpaceCopy.helperCopy,
      quietSpaceAmbientPlaceholder.copy,
      quietSpaceAmbientPlaceholder.buttonLabel,
      ...quietSpaceCards.flatMap((card) => [card.title, card.copy]),
      ...quietSpaceConversationPrompts,
    ].join(" ");

    expect(visibleCopy).toContain("optional");
    expect(visibleCopy).not.toMatch(/\bleaderboard|streak|score|rank|challenge|must|therapy|treatment\b/i);
  });

  it("provides a clear Profile entry point for testers", () => {
    expect(quietSpaceProfileEntry).toEqual({
      title: "Quiet Space",
      copy: "Optional pause cards for before or after a meetup.",
      actionLabel: "Open Quiet Space",
      route: "/(tabs)/quiet-space",
    });
  });

  it("allows web ambient playback when Web Audio is available", () => {
    expect(canPlayAmbientAudio({ platformOS: "web", hasAudioContext: true })).toBe(true);
    expect(resolveAmbientPlaybackState({ didStartAudio: true })).toEqual({
      isPlaying: true,
      helperCopy: null,
    });
  });

  it("does not enter playing state for unsupported native ambient playback", () => {
    expect(canPlayAmbientAudio({ platformOS: "ios", hasAudioContext: false })).toBe(false);
    expect(resolveAmbientPlaybackState({ didStartAudio: false })).toEqual({
      isPlaying: false,
      helperCopy: "Ambient audio is currently available on web during alpha testing.",
    });
  });

  it("provides native helper copy when ambient playback is unsupported", () => {
    expect(getAmbientPlaybackUnavailableCopy({ platformOS: "android", hasAudioContext: false })).toBe(
      "Ambient audio is currently available on web during alpha testing.",
    );
  });

  it("keeps playback reset when audio start fails", () => {
    expect(resolveAmbientPlaybackState({ didStartAudio: false })).toEqual({
      isPlaying: false,
      helperCopy: "Ambient audio is currently available on web during alpha testing.",
    });
  });
});
