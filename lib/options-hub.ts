type OptionsHubIcon =
  | "house.fill"
  | "settings"
  | "sliders"
  | "layout"
  | "transport"
  | "contact"
  | "location"
  | "help"
  | "group"
  | "message"
  | "shield"
  | "flag"
  | "bookmark"
  | "edit";

export type OptionsHubSectionId =
  | "home"
  | "userPreferences"
  | "meetups"
  | "chatContact"
  | "safetyPrivacy"
  | "alphaTesting"
  | "prototypeTools";

export type OptionsHubRow = {
  id: string;
  icon: OptionsHubIcon;
  title: string;
  description: string;
  badge: string;
  chevron: true;
};

export type OptionsHubSection = {
  id: OptionsHubSectionId;
  icon: OptionsHubIcon;
  title: string;
  description: string;
  rows: OptionsHubRow[];
};

export type OptionsHubCategoryCard = {
  id: OptionsHubSectionId;
  icon: OptionsHubIcon;
  title: string;
  description: string;
  badge: string;
  chevron: true;
};

const row = (item: Omit<OptionsHubRow, "chevron">): OptionsHubRow => ({
  ...item,
  chevron: true,
});

export const optionsHubSections: OptionsHubSection[] = [
  {
    id: "home",
    icon: "house.fill",
    title: "Home",
    description: "Dashboard filters, layout, and calm local scanning.",
    rows: [
      row({
        id: "home-preferences",
        icon: "settings",
        title: "Home Preferences",
        description: "Essential filters and event display controls.",
        badge: "Saved locally",
      }),
      row({
        id: "customize-home",
        icon: "layout",
        title: "Customize Home",
        description: "Choose which Home sections stay visible.",
        badge: "Local",
      }),
      row({
        id: "view-preferences",
        icon: "sliders",
        title: "View Preferences",
        description: "Card style, preview, and layout density.",
        badge: "Saved locally",
      }),
    ],
  },
  {
    id: "userPreferences",
    icon: "settings",
    title: "User preferences",
    description: "Profile comfort settings without crowding Home.",
    rows: [
      row({
        id: "transportation-method",
        icon: "transport",
        title: "Transportation Method",
        description: "How you usually get to local meetups.",
        badge: "Preference",
      }),
      row({
        id: "contact-preference",
        icon: "contact",
        title: "Contact Preference",
        description: "How you prefer people to contact you.",
        badge: "Preference",
      }),
      row({
        id: "location-preference",
        icon: "location",
        title: "Location Preference",
        description: "Areas and distance comfort for meetup discovery.",
        badge: "Preference",
      }),
    ],
  },
  {
    id: "meetups",
    icon: "group",
    title: "Meetups",
    description: "Low-pressure support before, during, and after events.",
    rows: [
      row({
        id: "first-meetup-support",
        icon: "help",
        title: "First meetup support",
        description: "Mock support preferences for arriving with less pressure.",
        badge: "Prototype",
      }),
      row({
        id: "ask-about-this-meetup",
        icon: "message",
        title: "Ask about this meetup",
        description: "Pre-written question chips for meetup clarity.",
        badge: "Demo",
      }),
    ],
  },
  {
    id: "chatContact",
    icon: "message",
    title: "Chat & contact",
    description: "Local chat helpers, arrival updates, and contact boundaries.",
    rows: [
      row({
        id: "chat-plus-tools",
        icon: "message",
        title: "Chat plus tools",
        description: "Local-only helpers behind the chat plus button.",
        badge: "Demo",
      }),
      row({
        id: "contact-boundaries",
        icon: "contact",
        title: "Contact boundaries",
        description: "Review contact preferences before private chats.",
        badge: "Preference",
      }),
    ],
  },
  {
    id: "safetyPrivacy",
    icon: "shield",
    title: "Safety & privacy",
    description: "Safety, reporting, privacy, and visibility controls.",
    rows: [
      row({
        id: "settings-privacy",
        icon: "shield",
        title: "Settings & Privacy",
        description: "Open the existing privacy and prototype settings area.",
        badge: "Settings",
      }),
      row({
        id: "help-support",
        icon: "help",
        title: "Help & Support",
        description: "Open non-urgent app feedback and support guidance.",
        badge: "Support",
      }),
      row({
        id: "report-block-emergency",
        icon: "flag",
        title: "Report, block, or emergency help",
        description: "Use existing safety flows for urgent or trust concerns.",
        badge: "Safety",
      }),
    ],
  },
  {
    id: "alphaTesting",
    icon: "flag",
    title: "Alpha testing",
    description: "Tester walkthrough and prototype clarity notes.",
    rows: [
      row({
        id: "alpha-walkthrough",
        icon: "flag",
        title: "Alpha Tester Walkthrough",
        description: "A compact tour for understanding this prototype.",
        badge: "Demo",
      }),
    ],
  },
  {
    id: "prototypeTools",
    icon: "edit",
    title: "Prototype tools",
    description: "Local-only controls that do not create backend changes.",
    rows: [
      row({
        id: "restore-default-home",
        icon: "layout",
        title: "Restore default Home",
        description: "Reset dashboard presentation in local prototype state.",
        badge: "Saved locally",
      }),
      row({
        id: "saved-locally-note",
        icon: "bookmark",
        title: "Saved locally language",
        description: "Demo actions explain when changes stay on this device.",
        badge: "Prototype",
      }),
    ],
  },
];

export const getOptionsHubCategoryCards = (sections: readonly OptionsHubSection[] = optionsHubSections): OptionsHubCategoryCard[] =>
  sections.map((section) => ({
    id: section.id,
    icon: section.icon,
    title: section.title,
    description: section.description,
    badge: `${section.rows.length} ${section.rows.length === 1 ? "option" : "options"}`,
    chevron: true,
  }));

export const getOptionsHubSection = (sectionId: string | null | undefined, sections: readonly OptionsHubSection[] = optionsHubSections) =>
  sectionId ? sections.find((section) => section.id === sectionId) : undefined;

export const firstMeetupSupportOptions = [
  {
    label: "Request a guide",
    description: "Mock preference for someone to help orient you at arrival.",
    badge: "Prototype",
  },
  {
    label: "Help finding the group",
    description: "Mock preference for clearer meetup-point instructions.",
    badge: "Prototype",
  },
  {
    label: "Quiet arrival",
    description: "Mock preference for arriving without introductions right away.",
    badge: "Prototype",
  },
  {
    label: "Meet near entrance",
    description: "Mock preference for a simple visible meeting spot.",
    badge: "Prototype",
  },
  {
    label: "No extra support",
    description: "Keep the meetup flow as-is.",
    badge: "Prototype",
  },
] as const;

export type FirstMeetupSupportOption = (typeof firstMeetupSupportOptions)[number]["label"];

export const askAboutMeetupQuestionGroups = [
  {
    phase: "before",
    title: "Before",
    questions: ["What should I expect?", "What should I bring?", "Is it okay if I’m quiet?"],
  },
  {
    phase: "during",
    title: "During",
    questions: ["What if I’m late?", "How do I leave politely?"],
  },
  {
    phase: "after",
    title: "After",
    questions: ["Help me reflect after the meetup."],
  },
] as const;

export type AskAboutMeetupQuestion = (typeof askAboutMeetupQuestionGroups)[number]["questions"][number];

export const getFirstMeetupSupportSummary = (selectedOptions: readonly FirstMeetupSupportOption[]) => {
  const selectedWithoutFallback = selectedOptions.filter((option) => option !== "No extra support");

  if (selectedWithoutFallback.length === 0) {
    return "No extra support";
  }

  if (selectedWithoutFallback.length <= 2) {
    return selectedWithoutFallback.join(", ");
  }

  return `${selectedWithoutFallback.slice(0, 2).join(", ")} +${selectedWithoutFallback.length - 2}`;
};
