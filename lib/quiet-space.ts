import {
  getNextQuietSpacePromptIndex,
  quietSpaceConversationPrompts,
} from "../constants/quiet-space-activities";

export { getNextQuietSpacePromptIndex, quietSpaceConversationPrompts };

export const quietSpaceCopy = {
  title: "Quiet Space",
  helperCopy: "A small place to pause, settle, or warm up before a meetup.",
} as const;

export const quietSpaceProfileEntry = {
  title: "Quiet Space",
  copy: "Optional pause cards for before or after a meetup.",
  actionLabel: "Open Quiet Space",
  route: "/(tabs)/quiet-space",
} as const;

export const quietSpaceAmbientPlaceholder = {
  title: "Ambient sounds",
  copy:
    "Calming sounds may be added later, such as rain, ocean, café ambience, or soft piano. Audio will always be optional and never autoplay.",
  buttonLabel: "Alpha preview below",
  buttonDisabled: true,
  autoplay: false,
} as const;

export const quietSpaceAmbientPreview = {
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
} as const;

export const quietSpaceCards = [
  {
    id: "ambient-sounds",
    title: quietSpaceAmbientPlaceholder.title,
    copy: quietSpaceAmbientPlaceholder.copy,
  },
] as const;
