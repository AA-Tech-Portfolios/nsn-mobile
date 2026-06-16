import { demoPersonas } from "./demo-personas";

export const nsnColors = {
  background: "#0B1626",
  surface: "#0F1B2C",
  surfaceRaised: "#10213A",
  surfaceSoft: "#152238",
  border: "#2A3C59",
  text: "#F5F7FF",
  muted: "#B8C4D8",
  mutedSoft: "#8EA0B8",
  primary: "#536C9E",
  primarySoft: "#445E93",
  selectedChip: "#214B95",
  selectedChipBorder: "#8FAFD1",
  selectedChipText: "#FFFFFF",
  cyan: "#7CAAC9",
  day: "#C7B07A",
  green: "#72D67E",
  warning: "#FFD66E",
  danger: "#FF7777",
};

export type NoiseLevel = "Quiet" | "Balanced" | "Lively";

export const noiseLevelOptions: NoiseLevel[] = ["Quiet", "Balanced", "Lively"];

export type EventSocialEnergy = "Low" | "Medium" | "Higher";
export type EventDisplayNoiseLevel = "Quiet" | "Moderate" | "Lively";
export type EventConversationStyle = "Casual" | "Guided" | "Activity-based" | "Mostly flexible";
export type EventArrivalConfidenceNote =
  | "Public transport friendly"
  | "Parking nearby"
  | "Short walk from station"
  | "First-time friendly"
  | "Clear meeting point"
  | "Accessible venue";
export type EventLifeStageCue = "Young adults" | "Adults" | "Mixed ages" | "Similar life stage";
export type EventArrivalPreviewImageKind = "venue" | "arrival" | "landmark";

export type EventArrivalPreviewImage = {
  kind: EventArrivalPreviewImageKind;
  title: string;
  caption: string;
  imageKey?: string;
  placeholderIcon: string;
};

export type EventArrivalPreview = {
  approximateArea: string;
  nearbyLandmark: string;
  arrivalSummary: string;
  meetingPointHint: string;
  mapSearchArea: string;
  confidenceNotes: string[];
  venuePreviewImages?: EventArrivalPreviewImage[];
};

export type EventComfortSignals = {
  socialEnergy: EventSocialEnergy;
  noiseLevel: EventDisplayNoiseLevel;
  groupSize: string;
  conversationStyle: EventConversationStyle;
};

export const eventAtmosphereLabelOptions = [
  "Quiet",
  "Balanced",
  "Lively",
  "Cozy",
  "Small group",
  "Low-pressure",
  "Outdoor calm",
  "Indoor backup",
  "First-time friendly",
] as const;

export type EventAtmosphereLabel = typeof eventAtmosphereLabelOptions[number];

export const eventComfortLabelOptions = [
  "Calm & quiet",
  "Casual social",
  "Cozy indoor",
  "Explorative/day out",
  "Food-focused",
  "Activity-focused",
  "Conversation-light",
  "Conversation-heavy",
  "Energetic/social vibe",
  "Flexible pacing",
  "Small groups preferred",
  "Large crowds okay",
  "Crowd-sensitive",
  "Quiet corners available",
  "Easy step-out/reset nearby",
  "Calm meetup alternative nearby",
  "Lower-pressure participation",
  "High-energy social vibe",
  "Flexible social pacing",
  "Small celebrations",
  "Close-friends vibe",
  "Pool party",
  "Calm gathering",
  "Public event nearby",
  "Loud music possible",
  "Loud environment possible",
  "Bring earbuds/headphones if helpful",
  "Noise-sensitive friendly",
  "Quiet recharge nearby",
  "Lower-noise alternative nearby",
  "Fireworks/event noise possible",
  "Chill alternative meetup",
  "Join/leave flexibly",
  "Pet-friendly meetup",
  "Pet-free meetup",
  "Sensitive to pets/allergies",
  "Outdoor animal exposure possible",
  "Calm around animals",
  "Prefer animal-free indoor spaces",
  "Quiet recharge space nearby",
  "Lower sensory stimulation",
  "Strong smells possible",
  "Outdoor airflow",
  "Calm seating area",
  "Flexible pacing welcome",
  "Join at your own pace",
  "Quiet reset areas nearby",
  "Smaller subgroup available",
  "Leave whenever you need",
] as const;

export type EventComfortLabel = typeof eventComfortLabelOptions[number];

export type PrototypeVerificationState = "unverified" | "pending" | "verified" | "host-verified";

export type MeetupParticipantRole = "host" | "co-host" | "participant";

export type MeetupVenueType = "park" | "beach" | "cafe" | "cinema" | "library" | "community-room" | "restaurant" | "walk" | "activity";

export type MeetupComfortTag =
  | "quiet"
  | "low-noise"
  | "beginner-friendly"
  | "public-place"
  | "library-friendly"
  | "indoor-backup"
  | "transport-friendly"
  | "quiet-conversation"
  | "study-work-session"
  | "reading"
  | "board-game"
  | "cafe-nearby"
  | "public-transport-access";

export type MeetupTrustParticipant = {
  id: string;
  displayName: string;
  role: MeetupParticipantRole;
  verificationState: PrototypeVerificationState;
};

export type MeetupTrustProfile = {
  host: MeetupTrustParticipant;
  coHosts?: MeetupTrustParticipant[];
  participantLimit: {
    min: number;
    max: number;
  };
  venueType: MeetupVenueType;
  comfortTags: MeetupComfortTag[];
  weatherAlternatives?: string[];
  accountabilityNote: string;
};

export type EventItem = {
  id: string;
  title: string;
  category: string;
  venue: string;
  time: string;
  people: string;
  description: string;
  tone: string;
  noiseLevel: NoiseLevel;
  weather: string;
  imageTone: string;
  emoji: string;
  tags: string[];
  comfortSignals?: EventComfortSignals;
  arrivalConfidenceNotes?: EventArrivalConfidenceNote[];
  arrivalPreview?: EventArrivalPreview;
  lifeStageCues?: EventLifeStageCue[];
  comfortLabels?: EventComfortLabel[];
  atmosphereLabels?: EventAtmosphereLabel[];
  mediaComfortLabels?: string[];
  preEventQuestions?: string[];
  postEventQuestions?: string[];
  trustProfile?: MeetupTrustProfile;
};

const mayaPersona = demoPersonas["maya-host"];
const nsnTesterPersona = demoPersonas["nsn-tester"];
const jordanPersona = demoPersonas["jordan-member"];

const mayaHost: MeetupTrustParticipant = { id: mayaPersona.id, displayName: mayaPersona.displayName, role: "host", verificationState: "host-verified" };
const nsnTesterCoHost: MeetupTrustParticipant = { id: nsnTesterPersona.id, displayName: nsnTesterPersona.displayName, role: "co-host", verificationState: "verified" };
const jordanHost: MeetupTrustParticipant = { id: jordanPersona.id, displayName: jordanPersona.displayName, role: "host", verificationState: "verified" };

export const dayEvents: EventItem[] = [
  {
    id: "picnic-easy-hangout",
    title: "Picnic — Easy Hangout",
    category: "Outdoor",
    venue: "Lane Cove National Park",
    time: "11:00am",
    people: "2–4 people",
    description: "Bring snacks, sit, relax. No pressure to talk constantly.",
    tone: "Balanced",
    noiseLevel: "Quiet",
    weather: "Weather dependent",
    imageTone: "#19432D",
    emoji: "🧺",
    tags: ["Outdoor", "Balanced", "Picnic gathering", "Food-focused", "Conversation-light"],
    comfortSignals: {
      socialEnergy: "Low",
      noiseLevel: "Quiet",
      groupSize: "3–5",
      conversationStyle: "Mostly flexible",
    },
    arrivalConfidenceNotes: [
      "Public transport friendly",
      "Clear meeting point",
      "First-time friendly",
    ],
    arrivalPreview: {
      approximateArea: "Lane Cove National Park picnic area",
      nearbyLandmark: "Near a main park path and picnic tables",
      arrivalSummary: "Outdoor meetup in a broad park area, with space to arrive slowly and settle before joining.",
      meetingPointHint: "Meet near the picnic tables by a main path. The host can clarify the calmest nearby spot in chat.",
      mapSearchArea: "Lane Cove National Park picnic area",
      confidenceNotes: ["Broad park area", "Public transport friendly", "Clear meeting point"],
      venuePreviewImages: [
        {
          kind: "landmark",
          title: "Park meeting point",
          caption: "Demo outdoor landmark preview",
          imageKey: "picnic-easy-hangout",
          placeholderIcon: "picnic",
        },
        {
          kind: "arrival",
          title: "Arrival path",
          caption: "Look for the main path near picnic tables",
          placeholderIcon: "path",
        },
      ],
    },
    lifeStageCues: ["Mixed ages", "Adults"],
    comfortLabels: ["Calm & quiet", "Casual social", "Food-focused", "Conversation-light", "Small groups preferred", "Lower-pressure participation", "Outdoor airflow", "Join at your own pace", "Leave whenever you need"],
    atmosphereLabels: ["Quiet", "Small group", "Low-pressure", "Outdoor calm", "First-time friendly"],
    mediaComfortLabels: ["Ask before photos", "Group photos by consent"],
    preEventQuestions: [
      "What's your favourite picnic snack?",
      "What's one thing you're looking forward to today?",
      "Do you have a go-to outdoor activity?"
    ],
    postEventQuestions: [
      "How was the picnic spot?",
      "Did you try any new snacks?",
      "Would you like to do this again?"
    ],
    trustProfile: {
      host: mayaHost,
      coHosts: [nsnTesterCoHost],
      participantLimit: { min: 2, max: 4 },
      venueType: "park",
      comfortTags: ["quiet", "beginner-friendly", "public-place", "indoor-backup", "transport-friendly"],
      weatherAlternatives: ["Chatswood shopping centre", "casual cafe table", "library meetup", "board games indoors"],
      accountabilityNote: "Privacy keeps personal details limited, while hosts and participants still carry a local readiness preview.",
    },
  },
  {
    id: "beach-day-chill-vibes",
    title: "Beach Day — Chill Vibes",
    category: "Outdoor",
    venue: "Palm Beach",
    time: "1:00pm",
    people: "3–6 people",
    description: "Sun, ocean and good company. BYO towel.",
    tone: "Balanced",
    noiseLevel: "Balanced",
    weather: "Weather dependent",
    imageTone: "#1A4964",
    emoji: "🌊",
    tags: ["Outdoor", "Balanced", "Beach walk", "Activity-focused", "Explorative/day out"],
    comfortSignals: {
      socialEnergy: "Medium",
      noiseLevel: "Lively",
      groupSize: "4–6",
      conversationStyle: "Activity-based",
    },
    arrivalConfidenceNotes: [
      "Public transport friendly",
      "Parking nearby",
      "Clear meeting point",
    ],
    arrivalPreview: {
      approximateArea: "Palm Beach foreshore area",
      nearbyLandmark: "Near the beach path and visible foreshore entry",
      arrivalSummary: "Broad outdoor area with a visible landmark and room to wait at your own pace.",
      meetingPointHint: "Meet near the beach path entrance before deciding where to sit or walk.",
      mapSearchArea: "Palm Beach NSW foreshore",
      confidenceNotes: ["Broad foreshore area", "Parking nearby", "Clear meeting point"],
      venuePreviewImages: [
        {
          kind: "landmark",
          title: "Foreshore landmark",
          caption: "Demo beach arrival preview",
          imageKey: "beach-day-chill-vibes",
          placeholderIcon: "wave",
        },
      ],
    },
    lifeStageCues: ["Young adults", "Mixed ages"],
    comfortLabels: ["Explorative/day out", "Activity-focused", "Energetic/social vibe", "Flexible pacing", "Large crowds okay", "Flexible social pacing", "High-energy social vibe", "Loud environment possible", "Outdoor animal exposure possible", "Outdoor airflow", "Join/leave flexibly"],
    atmosphereLabels: ["Balanced", "Lively", "Outdoor calm"],
    mediaComfortLabels: ["Ask before photos", "Venue photos okay"],
    trustProfile: {
      host: mayaHost,
      participantLimit: { min: 3, max: 6 },
      venueType: "beach",
      comfortTags: ["public-place", "transport-friendly", "beginner-friendly"],
      weatherAlternatives: ["movie", "arcade", "bowling", "casual dining near transport"],
      accountabilityNote: "Beach plans stay public and small; privacy preferences do not remove host accountability.",
    },
  },
  {
    id: "library-calm-study",
    title: "Library Calm Study",
    category: "Indoor",
    venue: "Chatswood Library",
    time: "2:30pm",
    people: "2–5 people",
    description: "Quiet table time, light chat breaks and a gentle reset.",
    tone: "Quiet",
    noiseLevel: "Quiet",
    weather: "Rain friendly",
    imageTone: "#29365E",
    emoji: "📚",
    tags: ["Indoor", "Quiet", "Cozy indoor", "Conversation-light"],
    comfortSignals: {
      socialEnergy: "Low",
      noiseLevel: "Quiet",
      groupSize: "3–5",
      conversationStyle: "Guided",
    },
    arrivalConfidenceNotes: [
      "Short walk from station",
      "First-time friendly",
      "Accessible venue",
    ],
    arrivalPreview: {
      approximateArea: "Chatswood Library area",
      nearbyLandmark: "Near the library entrance and quiet study levels",
      arrivalSummary: "Indoor venue preview with a simple arrival point and quiet places nearby.",
      meetingPointHint: "Meet near the library entrance, then move to a table that feels calm enough.",
      mapSearchArea: "Chatswood Library",
      confidenceNotes: ["Short walk from station", "Indoor venue", "First-time friendly"],
      venuePreviewImages: [
        {
          kind: "venue",
          title: "Library entrance",
          caption: "Demo image placeholder for this alpha",
          placeholderIcon: "book",
        },
        {
          kind: "arrival",
          title: "Quiet arrival spot",
          caption: "Look for a calm table after meeting",
          placeholderIcon: "chair",
        },
      ],
    },
    lifeStageCues: ["Adults", "Similar life stage"],
    comfortLabels: ["Calm & quiet", "Cozy indoor", "Conversation-light", "Crowd-sensitive", "Quiet corners available", "Lower sensory stimulation", "Noise-sensitive friendly", "Pet-free meetup", "Calm seating area", "Quiet recharge space nearby"],
    atmosphereLabels: ["Quiet", "Cozy", "Small group", "Low-pressure", "First-time friendly"],
    mediaComfortLabels: ["Private meetup", "No public posting"],
    trustProfile: {
      host: mayaHost,
      participantLimit: { min: 2, max: 5 },
      venueType: "library",
      comfortTags: ["quiet", "low-noise", "library-friendly", "quiet-conversation", "study-work-session", "reading", "cafe-nearby", "public-transport-access"],
      weatherAlternatives: ["stay at the library", "nearby cafe break", "quiet board game table"],
      accountabilityNote: "Library meetups are small, quiet, optional, and reviewed as real local plans, not anonymous drop-ins.",
    },
  },
  {
    id: "coffee-lane-cove",
    title: "Coffee — Low-Key Hello",
    category: "Food",
    venue: "Lane Cove Village",
    time: "10:00am",
    people: "2–4 people",
    description: "Grab a coffee, sit somewhere easy, leave whenever you need.",
    tone: "Balanced",
    noiseLevel: "Balanced",
    weather: "Indoor backup ready",
    imageTone: "#5A3823",
    emoji: "☕",
    tags: ["Food", "Indoor", "Balanced", "Café meetup", "Food-focused", "Conversation-light"],
    comfortSignals: {
      socialEnergy: "Low",
      noiseLevel: "Moderate",
      groupSize: "3–5",
      conversationStyle: "Casual",
    },
    arrivalConfidenceNotes: [
      "Public transport friendly",
      "Parking nearby",
      "First-time friendly",
    ],
    arrivalPreview: {
      approximateArea: "Lane Cove Village cafe strip",
      nearbyLandmark: "Near the cafe entrances around the village plaza",
      arrivalSummary: "Small cafe-area meetup with nearby seats and an easy option to browse first.",
      meetingPointHint: "Meet near a cafe entrance in the village area before choosing a table together.",
      mapSearchArea: "Lane Cove Village cafes",
      confidenceNotes: ["Public transport friendly", "Parking nearby", "First-time friendly"],
      venuePreviewImages: [
        {
          kind: "venue",
          title: "Cafe exterior",
          caption: "Demo image placeholder for this alpha",
          placeholderIcon: "coffee",
        },
      ],
    },
    lifeStageCues: ["Mixed ages", "Similar life stage"],
    comfortLabels: ["Casual social", "Cozy indoor", "Food-focused", "Conversation-light", "Small groups preferred", "Flexible social pacing", "Calm seating area", "Join at your own pace", "Leave whenever you need"],
    atmosphereLabels: ["Balanced", "Cozy", "Small group", "Low-pressure", "Indoor backup"],
    mediaComfortLabels: ["Ask before photos", "Private meetup"],
    preEventQuestions: [
      "What's your favourite type of coffee?",
      "Do you have a morning routine?",
      "What's a book or podcast you enjoy?"
    ],
    postEventQuestions: [
      "How was the coffee?",
      "Did you discover anything new?",
      "Would you meet for coffee again?"
    ],
    trustProfile: {
      host: mayaHost,
      participantLimit: { min: 2, max: 4 },
      venueType: "cafe",
      comfortTags: ["quiet", "beginner-friendly", "public-place", "indoor-backup", "transport-friendly", "cafe-nearby"],
      weatherAlternatives: ["stay indoors at the cafe", "Chatswood shopping centre", "library meetup"],
      accountabilityNote: "Small table plans show a local readiness preview without exposing private identity documents.",
    },
  },
  {
    id: "harbour-walk-waverton",
    title: "Harbour Walk — Easy Pace",
    category: "Active",
    venue: "Waverton Park",
    time: "4:00pm",
    people: "4–8 people",
    description: "A slow walk with room for quiet moments and side chats.",
    tone: "Balanced",
    noiseLevel: "Quiet",
    weather: "Weather dependent",
    imageTone: "#1E4F55",
    emoji: "🚶",
    tags: ["Active", "Outdoor", "Balanced", "Beach walk", "Activity-focused", "Conversation-light"],
    comfortSignals: {
      socialEnergy: "Medium",
      noiseLevel: "Quiet",
      groupSize: "4–8",
      conversationStyle: "Activity-based",
    },
    arrivalConfidenceNotes: [
      "Short walk from station",
      "Clear meeting point",
      "First-time friendly",
    ],
    arrivalPreview: {
      approximateArea: "Waverton Park and foreshore area",
      nearbyLandmark: "Near the park path with harbour-side open space",
      arrivalSummary: "Outdoor walking meetup with a broad start point and easy side-by-side arrival.",
      meetingPointHint: "Meet near the park path entrance, then start the walk once everyone is ready.",
      mapSearchArea: "Waverton Park",
      confidenceNotes: ["Short walk from station", "Broad outdoor area", "First-time friendly"],
      venuePreviewImages: [
        {
          kind: "landmark",
          title: "Park path",
          caption: "Demo image placeholder for this alpha",
          placeholderIcon: "path",
        },
      ],
    },
    lifeStageCues: ["Adults", "Mixed ages"],
    comfortLabels: ["Explorative/day out", "Activity-focused", "Conversation-light", "Flexible pacing", "Small groups preferred", "Easy step-out/reset nearby", "Outdoor animal exposure possible", "Outdoor airflow", "Flexible pacing welcome"],
    atmosphereLabels: ["Quiet", "Balanced", "Small group", "Outdoor calm", "Low-pressure"],
    mediaComfortLabels: ["Venue photos okay", "Ask before photos"],
    trustProfile: {
      host: jordanHost,
      participantLimit: { min: 4, max: 8 },
      venueType: "walk",
      comfortTags: ["quiet", "public-place", "transport-friendly", "beginner-friendly"],
      weatherAlternatives: ["cafe nearby", "library meetup", "casual dining", "movie"],
      accountabilityNote: "Walks stay public, flexible, and tied to participant readiness notes.",
    },
  },
];

export const eveningEvents: EventItem[] = [
  {
    id: "movie-night-watch-chat",
    title: "Movie Night — Watch + Chat",
    category: "Indoor",
    venue: "Macquarie Centre Event Cinemas",
    time: "7:00pm",
    people: "2–4 people",
    description: "Watch first, optional chat after if it feels right.",
    tone: "Quiet",
    noiseLevel: "Lively",
    weather: "Indoor backup ready",
    imageTone: "#281C45",
    emoji: "🍿",
    tags: ["Indoor", "Quiet", "Movie marathons", "Conversation-light", "Cozy indoor"],
    comfortSignals: {
      socialEnergy: "Low",
      noiseLevel: "Lively",
      groupSize: "3–5",
      conversationStyle: "Guided",
    },
    arrivalConfidenceNotes: [
      "Public transport friendly",
      "Parking nearby",
      "Clear meeting point",
    ],
    arrivalPreview: {
      approximateArea: "Macquarie Centre cinema area",
      nearbyLandmark: "Near the cinema entrance inside the shopping centre",
      arrivalSummary: "Indoor meetup with a clear pre-movie meeting point and places to wait nearby.",
      meetingPointHint: "Meet near the cinema entrance before tickets or snacks, then decide how much to chat.",
      mapSearchArea: "Macquarie Centre cinema",
      confidenceNotes: ["Short walk from station", "Indoor venue", "Clear meeting point"],
      venuePreviewImages: [
        {
          kind: "venue",
          title: "Cinema entrance",
          caption: "Demo indoor venue preview",
          imageKey: "movie-night-watch-chat",
          placeholderIcon: "cinema",
        },
        {
          kind: "arrival",
          title: "Inside arrival point",
          caption: "Meet near the cinema entrance before the session",
          placeholderIcon: "door",
        },
      ],
    },
    lifeStageCues: ["Young adults", "Adults"],
    comfortLabels: ["Cozy indoor", "Conversation-light", "Flexible pacing", "Large crowds okay", "Loud music possible", "Bring earbuds/headphones if helpful", "Lower-noise alternative nearby", "Lower-pressure participation", "Pet-free meetup", "Join/leave flexibly"],
    atmosphereLabels: ["Quiet", "Cozy", "Low-pressure", "Indoor backup", "First-time friendly"],
    mediaComfortLabels: ["No filming", "Private meetup"],
    preEventQuestions: [
      "What's your favourite movie genre?",
      "Have you seen this movie before?",
      "What's a movie that made you laugh/cry?"
    ],
    postEventQuestions: [
      "What did you think of the movie?",
      "How was the theatre experience?",
      "Would you watch a movie together again?"
    ],
    trustProfile: {
      host: mayaHost,
      coHosts: [nsnTesterCoHost],
      participantLimit: { min: 2, max: 4 },
      venueType: "cinema",
      comfortTags: ["quiet", "beginner-friendly", "public-place", "indoor-backup", "transport-friendly"],
      weatherAlternatives: ["same cinema plan", "casual dining", "arcade", "Chatswood shopping centre"],
      accountabilityNote: "The host can keep the plan clear, but reports still go through calm app review in this prototype.",
    },
  },
  {
    id: "board-games-coffee",
    title: "Board Games + Coffee",
    category: "Indoor",
    venue: "Chatswood Social Café",
    time: "6:30pm",
    people: "3–5 people",
    description: "Simple games, warm drinks and easy conversation starters.",
    tone: "Balanced",
    noiseLevel: "Balanced",
    weather: "Rain friendly",
    imageTone: "#3B2D15",
    emoji: "🎲",
    tags: ["Indoor", "Food", "Balanced", "Board games", "Café meetup", "Activity-focused"],
    comfortSignals: {
      socialEnergy: "Medium",
      noiseLevel: "Moderate",
      groupSize: "4–6",
      conversationStyle: "Activity-based",
    },
    arrivalConfidenceNotes: [
      "Short walk from station",
      "First-time friendly",
      "Clear meeting point",
    ],
    arrivalPreview: {
      approximateArea: "Chatswood cafe area near the station",
      nearbyLandmark: "Near the cafe entrance and station-side streets",
      arrivalSummary: "Indoor table meetup with a familiar station-side area and a simple first hello.",
      meetingPointHint: "Meet near the cafe entrance before choosing the table or game.",
      mapSearchArea: "Chatswood cafes near station",
      confidenceNotes: ["Short walk from station", "Indoor venue", "First-time friendly"],
      venuePreviewImages: [
        {
          kind: "venue",
          title: "Cafe entrance",
          caption: "Demo image placeholder for this alpha",
          placeholderIcon: "coffee",
        },
        {
          kind: "landmark",
          title: "Station-side area",
          caption: "Use broad area cues rather than seat-level details",
          placeholderIcon: "station",
        },
      ],
    },
    lifeStageCues: ["Mixed ages", "Similar life stage"],
    comfortLabels: ["Casual social", "Cozy indoor", "Activity-focused", "Conversation-heavy", "Close-friends vibe", "Small celebrations", "Flexible social pacing", "Smaller subgroup available", "Calm meetup alternative nearby"],
    atmosphereLabels: ["Balanced", "Cozy", "Small group", "First-time friendly"],
    mediaComfortLabels: ["Ask before photos", "Private meetup"],
    trustProfile: {
      host: mayaHost,
      participantLimit: { min: 3, max: 5 },
      venueType: "cafe",
      comfortTags: ["beginner-friendly", "public-place", "indoor-backup", "transport-friendly", "board-game", "cafe-nearby"],
      weatherAlternatives: ["keep the indoor table", "arcade", "bowling", "casual dining"],
      accountabilityNote: "Game tables stay small enough for consent checks and easy switching.",
    },
  },
  {
    id: "ramen-small-table",
    title: "Ramen — Small Table",
    category: "Food",
    venue: "Crows Nest",
    time: "6:15pm",
    people: "3–5 people",
    description: "Warm food, simple introductions and no pressure to stay late.",
    tone: "Balanced",
    noiseLevel: "Balanced",
    weather: "Rain friendly",
    imageTone: "#55331C",
    emoji: "🍜",
    tags: ["Food", "Indoor", "Balanced", "Casual dining", "Group lunch/dinner", "Food-focused"],
    comfortSignals: {
      socialEnergy: "Medium",
      noiseLevel: "Moderate",
      groupSize: "4–6",
      conversationStyle: "Casual",
    },
    arrivalConfidenceNotes: [
      "Public transport friendly",
      "Parking nearby",
      "First-time friendly",
    ],
    arrivalPreview: {
      approximateArea: "Crows Nest village dining area",
      nearbyLandmark: "Near the restaurant strip and village footpaths",
      arrivalSummary: "Small table meetup in a familiar dining area with room to arrive with someone you know.",
      meetingPointHint: "Meet just outside the restaurant area before going in together.",
      mapSearchArea: "Crows Nest NSW restaurants",
      confidenceNotes: ["Public transport friendly", "Parking nearby", "First-time friendly"],
      venuePreviewImages: [
        {
          kind: "venue",
          title: "Restaurant strip",
          caption: "Demo image placeholder for this alpha",
          placeholderIcon: "bowl",
        },
      ],
    },
    lifeStageCues: ["Adults", "Mixed ages"],
    comfortLabels: ["Casual social", "Food-focused", "Conversation-heavy", "Small groups preferred", "Close-friends vibe", "Strong smells possible", "Join/leave flexibly"],
    atmosphereLabels: ["Balanced", "Small group", "Low-pressure", "Indoor backup"],
    mediaComfortLabels: ["Private meetup", "No public posting"],
    trustProfile: {
      host: jordanHost,
      participantLimit: { min: 3, max: 5 },
      venueType: "restaurant",
      comfortTags: ["public-place", "indoor-backup", "transport-friendly", "beginner-friendly"],
      weatherAlternatives: ["stay indoors", "movie", "cafe", "board games"],
      accountabilityNote: "Food meetups keep names and profiles limited, but behaviour can still be reported.",
    },
  },
  {
    id: "quiet-music-listening",
    title: "Quiet Music Listening",
    category: "Indoor",
    venue: "North Sydney Community Room",
    time: "7:30pm",
    people: "2–5 people",
    description: "Share a few calm songs and chat only as much as feels good.",
    tone: "Quiet",
    noiseLevel: "Balanced",
    weather: "Indoor backup ready",
    imageTone: "#1F2B4A",
    emoji: "🎧",
    tags: ["Indoor", "Quiet", "Cozy indoor", "Conversation-light"],
    comfortSignals: {
      socialEnergy: "Low",
      noiseLevel: "Quiet",
      groupSize: "3–5",
      conversationStyle: "Guided",
    },
    arrivalConfidenceNotes: [
      "Public transport friendly",
      "First-time friendly",
      "Accessible venue",
    ],
    arrivalPreview: {
      approximateArea: "North Sydney community room area",
      nearbyLandmark: "Near the community room entrance and quieter indoor seating",
      arrivalSummary: "Indoor low-noise meetup with a gentle arrival point and a clear room-style setting.",
      meetingPointHint: "Meet near the community room entrance before finding seats together.",
      mapSearchArea: "North Sydney community centre",
      confidenceNotes: ["Public transport friendly", "Indoor venue", "Accessible venue"],
      venuePreviewImages: [
        {
          kind: "venue",
          title: "Community room entrance",
          caption: "Demo image placeholder for this alpha",
          placeholderIcon: "room",
        },
        {
          kind: "arrival",
          title: "Quiet entry",
          caption: "Arrive near the entrance, then settle in slowly",
          placeholderIcon: "music",
        },
      ],
    },
    lifeStageCues: ["Adults", "Similar life stage"],
    comfortLabels: ["Calm & quiet", "Cozy indoor", "Conversation-light", "Calm gathering", "Lower sensory stimulation", "Quiet recharge nearby", "Quiet recharge space nearby", "Calm seating area", "Flexible pacing welcome"],
    atmosphereLabels: ["Quiet", "Cozy", "Small group", "Low-pressure", "First-time friendly"],
    mediaComfortLabels: ["No filming", "Private meetup"],
    trustProfile: {
      host: mayaHost,
      participantLimit: { min: 2, max: 5 },
      venueType: "community-room",
      comfortTags: ["quiet", "low-noise", "beginner-friendly", "public-place", "indoor-backup", "quiet-conversation", "transport-friendly"],
      weatherAlternatives: ["stay indoors", "library meetup", "quiet cafe", "board games"],
      accountabilityNote: "Quiet rooms are for low-pressure presence, not forced sharing.",
    },
  },
];

export const movieNight = eveningEvents[0];
export const allEvents = [...dayEvents, ...eveningEvents];

export const profileVibes = [
  "🌿 Calm",
  "💬 Good listener",
  "🎲 Into games",
  "⭐ Thoughtful",
  "👥 Small groups",
  "☕ Coffee",
  "🎬 Movies",
  "🚶 Walks",
  "📚 Libraries",
  "🧺 Picnics",
  "🍜 Food spots",
  "🎧 Quiet music",
  "🧠 Deep chats",
  "🌊 Beach days",
  "🎨 Creative",
];

export type ChatMessage = {
  id: string;
  personId?: string;
  name: string;
  avatar: string;
  text: string;
  time: string;
  mine: boolean;
};

export const eventChatSeeds: Record<string, ChatMessage[]> = {
  "picnic-easy-hangout": [
    { id: "picnic-1", personId: "maya-host", name: "Maya", avatar: "M", text: "I will be near the picnic tables by the main path at 10:55. No rush if your arrival is quiet.", time: "9:42am", mine: false },
    { id: "picnic-2", personId: "jordan-member", name: "Jordan", avatar: "J", text: "Could we ask before photos? I am keeping my profile and pictures limited today.", time: "9:48am", mine: false },
    { id: "picnic-3", personId: "nsn-tester", name: "NSN Tester", avatar: "N", text: "Works for me. I can bring cut fruit and keep it easy.", time: "9:50am", mine: false },
    { id: "picnic-4", name: "You", avatar: "Y", text: "I might join quietly at first, but I am looking forward to it.", time: "9:53am", mine: true },
  ],
  "coffee-lane-cove": [
    { id: "coffee-1", personId: "maya-host", name: "Maya", avatar: "M", text: "I booked a small table near the side wall. Easy to step outside if it gets loud.", time: "8:36am", mine: false },
    { id: "coffee-2", personId: "jordan-member", name: "Jordan", avatar: "J", text: "Thanks. I may arrive right on time and keep my details light until we meet.", time: "8:44am", mine: false },
    { id: "coffee-3", personId: "nsn-tester", name: "NSN Tester", avatar: "N", text: "Low-key hello sounds perfect. I will grab a coffee first.", time: "8:51am", mine: false },
    { id: "coffee-4", name: "You", avatar: "Y", text: "Can we keep photos off unless everyone says yes?", time: "8:55am", mine: true },
  ],
  "library-calm-study": [
    { id: "library-1", personId: "maya-host", name: "Maya", avatar: "M", text: "I will pick a table in the open study area. Quiet arrival is completely fine.", time: "1:42pm", mine: false },
    { id: "library-2", personId: "jordan-member", name: "Jordan", avatar: "J", text: "I am likely to wave and settle in first, then chat during the break.", time: "1:48pm", mine: false },
    { id: "library-3", personId: "nsn-tester", name: "NSN Tester", avatar: "N", text: "I can bring spare sticky notes if anyone needs them.", time: "1:52pm", mine: false },
    { id: "library-4", name: "You", avatar: "Y", text: "Thanks. I like the plan of short chat breaks and mostly quiet time.", time: "1:55pm", mine: true },
  ],
  "movie-night-watch-chat": [
    { id: "movie-1", personId: "nsn-tester", name: "NSN Tester", avatar: "N", text: "Hey! I will be there around 6:45pm and can wait near the cinema entrance.", time: "4:32pm", mine: false },
    { id: "movie-2", personId: "maya-host", name: "Maya", avatar: "M", text: "Lovely. Watch first, optional chat after. No pressure if you want to head home.", time: "4:34pm", mine: false },
    { id: "movie-3", personId: "jordan-member", name: "Jordan", avatar: "J", text: "Same here, I have not seen this movie yet. Please ask before photos.", time: "4:35pm", mine: false },
    { id: "movie-4", name: "You", avatar: "Y", text: "Can not wait. I may do a quiet arrival and say hi after tickets.", time: "4:36pm", mine: true },
  ],
  "board-games-coffee": [
    { id: "board-1", personId: "maya-host", name: "Maya", avatar: "M", text: "I will bring two simple games and keep rules-light options ready.", time: "5:15pm", mine: false },
    { id: "board-2", personId: "jordan-member", name: "Jordan", avatar: "J", text: "Rules-light sounds good. I am okay joining a round after watching one first.", time: "5:19pm", mine: false },
    { id: "board-3", personId: "nsn-tester", name: "NSN Tester", avatar: "N", text: "I can grab the first coffees. No table photos unless everyone opts in.", time: "5:26pm", mine: false },
    { id: "board-4", name: "You", avatar: "Y", text: "Watching one round first would help me too. Thanks for making room for that.", time: "5:30pm", mine: true },
  ],
  "beach-day-chill-vibes": [
    { id: "beach-1", personId: "maya-host", name: "Maya", avatar: "M", text: "I will set a broad meeting point near the main path, then we can choose a quieter patch.", time: "11:10am", mine: false },
    { id: "beach-2", personId: "jordan-member", name: "Jordan", avatar: "J", text: "I prefer to keep personal details light, but I will post an arrival update once I am nearby.", time: "11:18am", mine: false },
    { id: "beach-3", personId: "nsn-tester", name: "NSN Tester", avatar: "N", text: "I will bring sunscreen. Ask before photos, especially if people are in frame.", time: "11:22am", mine: false },
    { id: "beach-4", name: "You", avatar: "Y", text: "Sounds good. I may sit a little back from the busiest area at first.", time: "11:25am", mine: true },
  ],
};

export const chatSeed: ChatMessage[] = [
  { id: "1", name: "NSN Tester", avatar: "N", text: "Hey! I'll be there around 6:45pm.", time: "4:32pm", mine: false },
  { id: "2", name: "Maya", avatar: "M", text: "Awesome! Looking forward to it 🎬", time: "4:34pm", mine: false },
  { id: "3", name: "Jordan", avatar: "J", text: "Same here, I have not seen this movie yet.", time: "4:35pm", mine: false },
  { id: "4", name: "You", avatar: "Y", text: "Can’t wait! See you all there 🙂", time: "4:36pm", mine: true },
];
