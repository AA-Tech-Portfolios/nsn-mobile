export type ProfileRefreshPromptId = "interests" | "localArea" | "meetupPreferences";

export type ProfileRefreshPrompt = {
  id: ProfileRefreshPromptId;
  prompt: string;
  actionLabel: string;
  dismissPermanentlyLabel: string;
};

export const connectionFirstProfilePrinciples = {
  profileRole: "Optional conversation aid",
  summary:
    "Profiles should support getting to know someone through meetups, shared activities, and conversation.",
  primaryDiscovery: ["Meetups", "Shared interests", "Events", "Community participation"],
  successThought: "I'd like to talk with this person.",
} as const;

export const profilePressureWarnings = {
  disallowedProfilePressure: [
    "Profile completion percentages",
    "Your profile is incomplete",
    "Mandatory social sharing",
    "Excessive prompts",
  ],
  preferredProfileLanguage: ["Add if you'd like", "Optional", "You can leave this blank"],
  disallowedPopularityMechanics: [
    "Follower counts",
    "Like counts",
    "Popularity rankings",
    "Public engagement metrics",
  ],
} as const;

const profileRefreshPrompts: readonly ProfileRefreshPrompt[] = [
  {
    id: "interests",
    prompt: "Are these interests still relevant?",
    actionLabel: "Update if you'd like",
    dismissPermanentlyLabel: "Don't ask again",
  },
  {
    id: "localArea",
    prompt: "Would you like to update your local area?",
    actionLabel: "Update if you'd like",
    dismissPermanentlyLabel: "Don't ask again",
  },
  {
    id: "meetupPreferences",
    prompt: "Have your meetup preferences changed?",
    actionLabel: "Review if you'd like",
    dismissPermanentlyLabel: "Don't ask again",
  },
] as const;

export const getConnectionFirstProfileRefreshPrompts = () => [...profileRefreshPrompts];

export const meaningfulMemorySection = {
  titleOptions: ["Meaningful Memories", "Appreciated Moments", "Things I'm Glad Happened"],
  description: "Optional reflections that can help someone start a real conversation.",
  purpose: "Self-expression, reflection, and connection.",
  notAFeed: true,
  examples: [
    "Had coffee with an old friend after several years.",
    "Attended my first meetup and felt welcomed.",
    "Helped someone move house and made a new friend.",
  ],
} as const;

export const appreciationNoteGuidance = {
  purpose: "Optional appreciation messages between users that feel human and personal.",
  not: ["Ratings", "Reviews", "Endorsements", "Reputation scores"],
  examples: [
    "Thank you for making me feel comfortable at my first meetup.",
    "I appreciated our conversation about moving countries.",
    "Thanks for organising today's event.",
  ],
} as const;
