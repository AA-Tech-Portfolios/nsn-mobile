export const quietSpaceActivitiesCopy = {
  title: "Quiet Space Activities",
  copy: "Optional comfort tools for before or after a meetup.",
} as const;

export const quietSpaceConversationPrompts = [
  "What's a place you'd happily visit again?",
  "Tea, coffee, or something else?",
  "What's a small thing that made your week better?",
  "Beach walk or cozy café?",
  "What's a hobby you'd like to try?",
] as const;

export const quietSpaceActivitySafety = {
  autoplay: false,
  competitiveMechanics: false,
  leaderboards: false,
  levels: false,
  scores: false,
  streaks: false,
  timers: false,
} as const;

export const quietSpaceReadingNook = {
  title: "Reading Nook",
  sampleTitle: "A Small Window of Evening",
  sampleText:
    "The room became quiet in layers. First the kettle settled, then the street outside softened, and finally the small window held the evening like a lantern. Mira opened her book to no particular page and let one sentence arrive at a time.",
  narratorLabel: "Narrator coming later",
  autoplay: false,
  backgroundOptions: [
    { id: "soft-dark", label: "Soft dark", backgroundColor: "#111D2D", textColor: "#E8EEF6" },
    { id: "paper", label: "Paper", backgroundColor: "#F7F0DF", textColor: "#2C261F" },
    { id: "mist", label: "Mist", backgroundColor: "#EEF4F5", textColor: "#172537" },
  ],
  fontOptions: [
    { id: "calm-sans", label: "Calm sans", fontFamily: undefined },
    { id: "serif", label: "Serif", fontFamily: "Georgia" },
  ],
  textSizeOptions: [
    { id: "small", label: "Small", fontSize: 15, lineHeight: 23 },
    { id: "medium", label: "Medium", fontSize: 17, lineHeight: 26 },
    { id: "large", label: "Large", fontSize: 19, lineHeight: 29 },
  ],
} as const;

export const quietSpaceActivityCards = [
  {
    id: "coloring-canvas",
    title: "Coloring Canvas",
    copy: "A gentle space to color, doodle, or unwind.",
    statusLabel: "Alpha canvas",
    placeholderCopy: "Tap the soft squares below to add color. This stays on this screen only.",
    iconName: "palette",
  },
  {
    id: "reading-nook",
    title: quietSpaceReadingNook.title,
    copy: "A short place to read, pause, or settle for a minute.",
    statusLabel: "Alpha reader",
    placeholderCopy: "Try a short passage and adjust the reading style. Narration stays optional.",
    iconName: "guide",
  },
  {
    id: "jigsaw-puzzles",
    title: "Jigsaw Puzzles",
    copy: "Simple calming puzzles with no timer, no score, and no pressure.",
    statusLabel: "Coming later",
    placeholderCopy: "Future puzzle sizes may include 12 pieces, 24 pieces, and 48 pieces.",
    iconName: "layout",
  },
  {
    id: "zen-blocks",
    title: "Zen Blocks",
    copy: "Stack soft shapes at your own pace.",
    statusLabel: "Coming later",
    placeholderCopy: "A quiet stacking prototype can be added later without scores, timers, or levels.",
    iconName: "low-pressure",
  },
  {
    id: "cat-corner",
    title: "Cat Corner",
    copy: "A tiny quiet visitor may stop by when the app feels calm.",
    statusLabel: "Rare visitor unchanged",
    placeholderCopy: "This points to the existing Rare Visitor Cat idea without changing its rarity or cooldown.",
    iconName: "pets",
  },
  {
    id: "conversation-cards",
    title: "Conversation Cards",
    copy: "Gentle prompts you can use, skip, or keep for later.",
    statusLabel: "Available now",
    placeholderCopy: "Show another soft prompt whenever you want a small conversation warm-up.",
    iconName: "pace",
  },
] as const;

export function getNextQuietSpacePromptIndex(currentIndex: number) {
  if (currentIndex < 0 || currentIndex >= quietSpaceConversationPrompts.length - 1) {
    return 0;
  }

  return currentIndex + 1;
}
