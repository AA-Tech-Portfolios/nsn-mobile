export const alphaWalkthroughCopy = {
  title: "Alpha tester walkthrough",
  subtitle:
    "A short, low-pressure tour for first-time testers. NSN is a Sydney/North Shore prototype, and some features are demo-only.",
  closeLabel: "Close alpha tester walkthrough",
  previousLabel: "Previous walkthrough step",
  nextLabel: "Next walkthrough step",
  finishLabel: "Finish walkthrough",
  prototypeNoteTitle: "Prototype note",
  prototypeNoteCopy:
    "Account deletion, identity checks, report review, notification delivery, and meetup check-in reminders are not production systems yet. No real account action is taken in this alpha walkthrough.",
} as const;

export const alphaWalkthroughSteps = [
  {
    title: "Start gently",
    eyebrow: "Prototype",
    copy: "NSN is a Sydney/North Shore alpha for trying low-pressure meetup ideas. Nothing here joins a real public meetup yet.",
    actionLabel: "Open Home",
    route: "/(tabs)",
    icon: "low-pressure",
  },
  {
    title: "Browse one meetup",
    eyebrow: "Demo meetups",
    copy: "Look for a calm activity like coffee, a walk, or a quiet indoor plan. Focus on whether the wording feels clear and low-pressure.",
    actionLabel: "Browse meetups",
    route: "/(tabs)/meetups",
    icon: "calendar",
  },
  {
    title: "Check comfort controls",
    eyebrow: "Saved locally",
    copy: "Review Profile for privacy, comfort, local area, and prototype detail labels. These settings stay local in the alpha.",
    actionLabel: "Open Profile",
    route: "/(tabs)/profile",
    icon: "person.fill",
  },
  {
    title: "Share feedback simply",
    eyebrow: "No pressure",
    copy: "You can skip chats, use tester shortcuts, or leave a flow anytime. Feedback can be short and specific: what felt clear, heavy, or unfinished.",
    actionLabel: "Finish walkthrough",
    route: "/(tabs)",
    icon: "checkmark",
  },
] as const;
