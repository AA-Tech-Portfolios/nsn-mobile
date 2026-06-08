type OptionsHubIcon =
  | "house.fill"
  | "settings"
  | "sliders"
  | "layout"
  | "transport"
  | "contact"
  | "location"
  | "help"
  | "heart"
  | "group"
  | "message"
  | "shield"
  | "weather"
  | "accessibility"
  | "pace"
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
    icon: "layout",
    title: "Appearance & Layout",
    description: "Home dashboard filters, event cards, and calm local scanning layout.",
    rows: [
      row({
        id: "home-preferences",
        icon: "settings",
        title: "Home & event cards",
        description: "Essential Home filters, event-card layout, and preview controls.",
        badge: "Saved locally",
      }),
      row({
        id: "customize-home",
        icon: "layout",
        title: "Home layout preview",
        description: "Paused during alpha so mobile testers see the recommended local prototype layout.",
        badge: "Paused",
      }),
      row({
        id: "view-preferences",
        icon: "sliders",
        title: "View density",
        description: "Paused during alpha while event-card density and mobile readability are simplified.",
        badge: "Paused",
      }),
    ],
  },
  {
    id: "userPreferences",
    icon: "settings",
    title: "Preferences",
    description: "Local profile, meetup, and comfort preferences without crowding Home.",
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
        title: "Conversation starters",
        description: "Optional starter and quick-reply chips for low-pressure chat.",
        badge: "Demo",
      }),
    ],
  },
  {
    id: "chatContact",
    icon: "message",
    title: "Chat & Contact",
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
    title: "Safety & Support",
    description: "Guidelines, quiet exits, support resources, privacy, and boundary controls.",
    rows: [
      row({
        id: "safety-boundaries",
        icon: "shield",
        title: "Community Guidelines",
        description: "Consent, privacy, quiet exits, and low-pressure participation reminders.",
        badge: "Guidance",
      }),
      row({
        id: "help-support",
        icon: "help",
        title: "Help & Support",
        description: "Open non-urgent help, outside support, and preparedness guidance.",
        badge: "Support",
      }),
      row({
        id: "support-resources",
        icon: "heart",
        title: "Support & Resources",
        description: "Prototype community, accessibility, wellbeing, and practical life resources.",
        badge: "Demo",
      }),
      row({
        id: "block-report",
        icon: "flag",
        title: "Block & Report",
        description: "Boundary and report-shaped demos for unwanted contact.",
        badge: "Demo",
      }),
    ],
  },
  {
    id: "alphaTesting",
    icon: "flag",
    title: "Alpha Testing",
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
    title: "App Settings",
    description: "Local-only prototype controls that do not create backend changes.",
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
    label: "Guide requested",
    description: "Optional local-only note that a clearer arrival handoff would help.",
    badge: "Prototype",
  },
  {
    label: "Help finding the group",
    description: "Optional local-only note for clearer meetup-point instructions.",
    badge: "Prototype",
  },
  {
    label: "Quiet joiner",
    description: "Optional local-only note for arriving without introductions right away.",
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

export const meetupComfortRoleOptions = [
  {
    label: "Quiet joiner",
    description: "Optional broad note: you may settle in before chatting.",
    badge: "Saved locally",
  },
  {
    label: "Happy to chat",
    description: "Optional broad note: light conversation is welcome.",
    badge: "Saved locally",
  },
  {
    label: "First-time attendee",
    description: "Optional broad note: clearer arrival cues may help.",
    badge: "Saved locally",
  },
  {
    label: "Host helper",
    description: "Optional broad note: you can help with simple group orientation.",
    badge: "Saved locally",
  },
  {
    label: "Guide requested",
    description: "Optional broad note: a calmer first hello would help.",
    badge: "Saved locally",
  },
] as const;

export type MeetupComfortRoleOption = (typeof meetupComfortRoleOptions)[number]["label"];

export const conversationStarterPrompts = [
  "What brings you here tonight?",
  "Favourite quiet café or spot around Sydney?",
  "Beach, movies, cafés, or board games?",
  "What kind of meetups feel easiest for you?",
  "Still warming up? That’s okay.",
] as const;

export type ConversationStarterPrompt = (typeof conversationStarterPrompts)[number];

export const quickReplyOptions = [
  "Mostly listening tonight 😊",
  "Happy to chat",
  "Still warming up",
  "I might join closer to the time",
  "Deciding later",
  "Need encouragement",
] as const;

export type QuickReplyOption = (typeof quickReplyOptions)[number];

export const arrivingAloneReassuranceItems = [
  {
    label: "Many arrive solo",
    copy: "Many people attend alone for the first time.",
  },
  {
    label: "Quiet joining",
    copy: "Quiet joining is completely okay here.",
  },
  {
    label: "Low-pressure atmosphere",
    copy: "Low-pressure atmosphere.",
  },
  {
    label: "Your pace",
    copy: "You can arrive, observe quietly, or join conversations at your own pace.",
  },
] as const;

export type ArrivingAloneReassuranceItem = (typeof arrivingAloneReassuranceItems)[number];

export const practicalMeetupGuidanceItems = [
  {
    label: "Weather awareness",
    copy: "Informational only: check the forecast before leaving and bring a simple backup layer if useful.",
  },
  {
    label: "Transport disruptions",
    copy: "Informational only: check your preferred transport app or timetable before heading out.",
  },
  {
    label: "Venue accessibility",
    copy: "Informational only: review venue access notes or contact the venue directly when details matter.",
  },
  {
    label: "Getting home calmly",
    copy: "Informational only: keep a simple route home in mind, including a backup transport option.",
  },
  {
    label: "Basic first-aid awareness",
    copy: "Informational only: general first-aid resources can be useful background; rely on qualified services for urgent health concerns.",
  },
] as const;

export type PracticalMeetupGuidanceItem = (typeof practicalMeetupGuidanceItems)[number];

export const safetyBoundaryGuidanceCategories = [
  {
    label: "Consent & comfort",
    icon: "shield",
    description: "Respect personal boundaries and comfort levels.",
    detail: "Ask before photos, recordings, close contact, or sharing personal details. Comfort can change during a meetup.",
  },
  {
    label: "Quiet exits",
    icon: "pace",
    description: "You may leave a meetup anytime.",
    detail: "Stepping away, taking a break, or heading home early can stay simple and low-pressure.",
  },
  {
    label: "Conversation boundaries",
    icon: "message",
    description: "No pressure to answer every question.",
    detail: "It is okay to redirect a topic, keep answers broad, or say you would rather not share.",
  },
  {
    label: "Privacy awareness",
    icon: "contact",
    description: "No pressure to share personal details.",
    detail: "Share only what feels appropriate for a local prototype meetup, and respect other people's privacy choices.",
  },
  {
    label: "Meetup expectations",
    icon: "group",
    description: "Keep plans clear, kind, and consent-first.",
    detail: "Arrive with reasonable expectations: small groups, clear meeting points, and room for different social energy.",
  },
  {
    label: "Low-pressure participation",
    icon: "help",
    description: "Quiet participation is welcome.",
    detail: "Listening, joining slowly, or taking part in short moments can all be valid ways to attend.",
  },
  {
    label: "Optional pacing",
    icon: "sliders",
    description: "Move at a pace that feels manageable.",
    detail: "You can warm up slowly, reply later, or choose simpler meetups without needing to explain.",
  },
] as const satisfies ReadonlyArray<{
  label: string;
  icon: OptionsHubIcon;
  description: string;
  detail: string;
}>;

export type SafetyBoundaryGuidanceCategory = (typeof safetyBoundaryGuidanceCategories)[number];

export const getCalmFaviconUrl = (domain: string) => `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

export const preparednessGuidanceCategories = [
  {
    label: "Emergency guidance",
    icon: "shield",
    description: "Informational only: know which external services apply if something is urgent.",
    badge: "External",
    detailTitle: "Emergency guidance",
    detailIntro: "Informational only. NSN is a local prototype; urgent help belongs with external services.",
    details: ["Use external emergency services for urgent situations.", "Leave or step away if that is the simplest calmer option available to you."],
    resources: [
      {
        title: "Triple Zero (000)",
        copy: "For urgent police, fire, or ambulance emergencies.",
        badge: "External",
        url: "https://www.triplezero.gov.au/",
        faviconUrl: getCalmFaviconUrl("triplezero.gov.au"),
        iconFallback: "shield",
      },
    ],
  },
  {
    label: "Non-emergency support",
    icon: "help",
    description: "Optional external support links can sit outside reporting and blocking tools.",
    badge: "Optional",
    detailTitle: "Non-emergency support",
    detailIntro: "Optional Australian resources for information or support outside NSN. This is informational only.",
    details: ["Choose the resource that fits your situation.", "Health decisions and urgent support belong with qualified services outside NSN."],
    resources: [
      {
        title: "Healthdirect Australia",
        copy: "Australian health information and service guidance.",
        badge: "External",
        url: "https://www.healthdirect.gov.au/",
        faviconUrl: getCalmFaviconUrl("healthdirect.gov.au"),
        iconFallback: "help",
      },
      {
        title: "NSW Mental Health Line",
        copy: "NSW mental health phone support information.",
        badge: "External",
        url: "https://www.health.nsw.gov.au/mentalhealth/Pages/Mental-Health-Line.aspx",
        faviconUrl: getCalmFaviconUrl("health.nsw.gov.au"),
        iconFallback: "help",
      },
      {
        title: "Lifeline Australia",
        copy: "External crisis support and suicide prevention information.",
        badge: "External",
        url: "https://www.lifeline.org.au/",
        faviconUrl: getCalmFaviconUrl("lifeline.org.au"),
        iconFallback: "help",
      },
      {
        title: "NSW Ambulance Non-Emergency Guidance",
        copy: "Information about non-emergency ambulance pathways and alternatives.",
        badge: "External",
        url: "https://www.ambulance.nsw.gov.au/our-services/emergency-services",
        faviconUrl: getCalmFaviconUrl("ambulance.nsw.gov.au"),
        iconFallback: "help",
      },
      {
        title: "Beyond Blue",
        copy: "External wellbeing information and support options.",
        badge: "External",
        url: "https://www.beyondblue.org.au/",
        faviconUrl: getCalmFaviconUrl("beyondblue.org.au"),
        iconFallback: "help",
      },
      {
        title: "headspace",
        copy: "External youth mental health and wellbeing information.",
        badge: "External",
        url: "https://headspace.org.au/",
        faviconUrl: getCalmFaviconUrl("headspace.org.au"),
        iconFallback: "help",
      },
      {
        title: "QLife",
        copy: "External LGBTIQ+ peer support and referral information.",
        badge: "External",
        url: "https://qlife.org.au/",
        faviconUrl: getCalmFaviconUrl("qlife.org.au"),
        iconFallback: "help",
      },
      {
        title: "Autism Connect",
        copy: "External autism information, support, and referral helpline details.",
        badge: "External",
        url: "https://www.amaze.org.au/autismconnect/",
        faviconUrl: getCalmFaviconUrl("amaze.org.au"),
        iconFallback: "accessibility",
      },
      {
        title: "Griefline",
        copy: "External grief and loss support resources.",
        badge: "External",
        url: "https://griefline.org.au/",
        faviconUrl: getCalmFaviconUrl("griefline.org.au"),
        iconFallback: "help",
      },
      {
        title: "1800RESPECT",
        copy: "External domestic, family, and sexual violence support information.",
        badge: "External",
        url: "https://www.1800respect.org.au/",
        faviconUrl: getCalmFaviconUrl("1800respect.org.au"),
        iconFallback: "shield",
      },
    ],
  },
  {
    label: "Weather awareness",
    icon: "weather",
    description: "Informational weather checks before leaving; conditions are yours to review.",
    badge: "Informational",
    detailTitle: "Weather awareness",
    detailIntro: "A simple weather check can make a meetup feel easier to plan.",
    details: ["Check the forecast before leaving.", "Consider a layer, umbrella, water, or an indoor backup if useful."],
    resources: [
      {
        title: "Bureau of Meteorology",
        copy: "Official Australian weather forecasts and warnings.",
        badge: "External",
        url: "https://www.bom.gov.au/nsw/",
        faviconUrl: getCalmFaviconUrl("bom.gov.au"),
        iconFallback: "weather",
      },
      {
        title: "NSW SES weather preparedness",
        copy: "External storm, flood, and severe weather preparedness information.",
        badge: "External",
        url: "https://www.ses.nsw.gov.au/",
        faviconUrl: getCalmFaviconUrl("ses.nsw.gov.au"),
        iconFallback: "weather",
      },
    ],
  },
  {
    label: "Transport disruptions",
    icon: "transport",
    description: "Optional reminder to check your own route and backup transport.",
    badge: "Informational",
    detailTitle: "Transport disruptions",
    detailIntro: "Optional route checks for getting there and getting home calmly.",
    details: ["Check your preferred transport app or timetable before heading out.", "Keep a simple backup route in mind if the meetup finishes later."],
    resources: [
      {
        title: "Service NSW Live Traffic",
        copy: "Road closures, changed traffic conditions, and Live Traffic NSW guidance.",
        badge: "External",
        url: "https://www.service.nsw.gov.au/transaction/live-traffic-nsw",
        faviconUrl: getCalmFaviconUrl("service.nsw.gov.au"),
        iconFallback: "transport",
      },
      {
        title: "Transport for NSW travel alerts",
        copy: "Public transport alerts and disruption information.",
        badge: "External",
        url: "https://transportnsw.info/alerts",
        faviconUrl: getCalmFaviconUrl("transportnsw.info"),
        iconFallback: "transport",
      },
      {
        title: "Sydney Trains service alerts",
        copy: "Train-focused service alerts through Transport for NSW.",
        badge: "External",
        url: "https://transportnsw.info/alerts#/train",
        faviconUrl: getCalmFaviconUrl("transportnsw.info"),
        iconFallback: "transport",
      },
    ],
  },
  {
    label: "Accessibility",
    icon: "accessibility",
    description: "Optional note to review venue access details when they matter.",
    badge: "Optional",
    detailTitle: "Accessibility",
    detailIntro: "Venue access can vary, so check details directly when they matter.",
    details: ["Review venue notes for entrances, seating, noise, bathrooms, and step-free access.", "Contact the venue directly if you need current details."],
    resources: [
      {
        title: "Service NSW accessibility services",
        copy: "External information for Service NSW accessibility and language support.",
        badge: "External",
        url: "https://www.service.nsw.gov.au/services/accessibility-services",
        faviconUrl: getCalmFaviconUrl("service.nsw.gov.au"),
        iconFallback: "accessibility",
      },
      {
        title: "Transport accessibility services",
        copy: "Accessible travel information for stations, stops, wharves, and disruptions.",
        badge: "External",
        url: "https://transportnsw.info/travel-info/using-public-transport/accessible-travel/accessibility-services-available-at-stations",
        faviconUrl: getCalmFaviconUrl("transportnsw.info"),
        iconFallback: "accessibility",
      },
    ],
  },
  {
    label: "First-aid awareness",
    icon: "help",
    description: "Informational awareness only; rely on qualified services for health concerns.",
    badge: "Informational",
    detailTitle: "First-aid awareness",
    detailIntro: "General first-aid awareness can be useful background and informational only.",
    details: ["Use qualified services for urgent health concerns.", "These resources are for general awareness and preparedness."],
    resources: [
      {
        title: "Australian Red Cross First Aid",
        copy: "External first-aid courses and awareness information.",
        badge: "External",
        url: "https://www.redcross.org.au/firstaid/",
        faviconUrl: getCalmFaviconUrl("redcross.org.au"),
        iconFallback: "help",
      },
      {
        title: "St John Ambulance resources",
        copy: "External first-aid learning and awareness resources.",
        badge: "External",
        url: "https://stjohnnsw.com.au/",
        faviconUrl: getCalmFaviconUrl("stjohnnsw.com.au"),
        iconFallback: "help",
      },
    ],
  },
  {
    label: "Arriving alone",
    icon: "group",
    description: "Optional reassurance that many people attend alone for the first time.",
    badge: "Low-pressure",
    detailTitle: "Arriving alone",
    detailIntro: "Many attendees arrive alone for the first time. You do not need to perform socially to be welcome.",
    details: ["Many attendees arrive alone.", "Quiet joining is okay.", "You can observe first, join at your own pace, or leave anytime."],
    resources: [],
  },
  {
    label: "Quiet exits",
    icon: "pace",
    description: "Optional reminder that stepping away or leaving early can be okay.",
    badge: "Low-pressure",
    detailTitle: "Quiet exits",
    detailIntro: "Leaving early or taking a break can stay ordinary and low-pressure.",
    details: ["You can step outside, pause, or head home when you need to.", "No long explanation is required in this prototype guidance."],
    resources: [],
  },
  {
    label: "Meetup guidance",
    icon: "message",
    description: "Practical prototype notes for what to bring, where to meet, and how to join calmly.",
    badge: "Prototype",
    detailTitle: "Meetup guidance",
    detailIntro: "Small practical checks can make a meetup easier to join.",
    details: ["Check the meeting point and approximate arrival time.", "Bring what helps you feel comfortable, such as water, a charger, or headphones for travel."],
    resources: [],
  },
] as const satisfies ReadonlyArray<{
  label: string;
  icon: OptionsHubIcon;
  description: string;
  badge: string;
  detailTitle: string;
  detailIntro: string;
  details: readonly string[];
  resources: readonly { title: string; copy: string; badge: string; url?: string; faviconUrl?: string; iconFallback?: OptionsHubIcon }[];
}>;

export type PreparednessGuidanceCategory = (typeof preparednessGuidanceCategories)[number];

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
