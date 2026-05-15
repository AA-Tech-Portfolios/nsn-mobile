export const nsnColors = {
  background: "#0B1626",
  surface: "#0F1B2C",
  surfaceRaised: "#10213A",
  surfaceSoft: "#152238",
  border: "#2A3C59",
  text: "#F5F7FF",
  muted: "#A6B1C7",
  mutedSoft: "#74819A",
  primary: "#536C9E",
  primarySoft: "#445E93",
  cyan: "#7CAAC9",
  day: "#C7B07A",
  green: "#72D67E",
  warning: "#F7C85B",
  danger: "#FF7777",
};

export type NoiseLevel = "Quiet" | "Balanced" | "Lively";

export const noiseLevelOptions: NoiseLevel[] = ["Quiet", "Balanced", "Lively"];

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
  mediaComfortLabels?: string[];
  preEventQuestions?: string[];
  postEventQuestions?: string[];
};

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
    tags: ["Outdoor", "Balanced"],
    mediaComfortLabels: ["Ask before photos", "Group photos by consent"],
    preEventQuestions: [
      "What's your favorite picnic snack?",
      "What's one thing you're looking forward to today?",
      "Do you have a go-to outdoor activity?"
    ],
    postEventQuestions: [
      "How was the picnic spot?",
      "Did you try any new snacks?",
      "Would you like to do this again?"
    ],
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
    tags: ["Outdoor", "Balanced"],
    mediaComfortLabels: ["Ask before photos", "Venue photos okay"],
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
    tags: ["Indoor", "Quiet"],
    mediaComfortLabels: ["Private meetup", "No public posting"],
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
    tags: ["Food", "Indoor", "Balanced"],
    mediaComfortLabels: ["Ask before photos", "Private meetup"],
    preEventQuestions: [
      "What's your favorite type of coffee?",
      "Do you have a morning routine?",
      "What's a book or podcast you enjoy?"
    ],
    postEventQuestions: [
      "How was the coffee?",
      "Did you discover anything new?",
      "Would you meet for coffee again?"
    ],
  },
  {
    id: "harbour-walk-waverton",
    title: "Harbour Walk — Easy Pace",
    category: "Active",
    venue: "Waverton Park",
    time: "4:00pm",
    people: "3–6 people",
    description: "A slow walk with room for quiet moments and side chats.",
    tone: "Balanced",
    noiseLevel: "Quiet",
    weather: "Weather dependent",
    imageTone: "#1E4F55",
    emoji: "🚶",
    tags: ["Active", "Outdoor", "Balanced"],
    mediaComfortLabels: ["Venue photos okay", "Ask before photos"],
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
    tags: ["Indoor", "Quiet"],
    mediaComfortLabels: ["No filming", "Private meetup"],
    preEventQuestions: [
      "What's your favorite movie genre?",
      "Have you seen this movie before?",
      "What's a movie that made you laugh/cry?"
    ],
    postEventQuestions: [
      "What did you think of the movie?",
      "How was the theater experience?",
      "Would you watch a movie together again?"
    ],
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
    tags: ["Indoor", "Food", "Balanced"],
    mediaComfortLabels: ["Ask before photos", "Private meetup"],
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
    tags: ["Food", "Indoor", "Balanced"],
    mediaComfortLabels: ["Private meetup", "No public posting"],
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
    tags: ["Indoor", "Quiet"],
    mediaComfortLabels: ["No filming", "Private meetup"],
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
    { id: "picnic-2", personId: "james-member", name: "James", avatar: "J", text: "Could we ask before photos? I am keeping my profile and pictures limited today.", time: "9:48am", mine: false },
    { id: "picnic-3", personId: "alon-member", name: "Alon", avatar: "A", text: "Works for me. I can bring cut fruit and keep it easy.", time: "9:50am", mine: false },
    { id: "picnic-4", name: "You", avatar: "Y", text: "I might join quietly at first, but I am looking forward to it.", time: "9:53am", mine: true },
  ],
  "coffee-lane-cove": [
    { id: "coffee-1", personId: "maya-host", name: "Maya", avatar: "M", text: "I booked a small table near the side wall. Easy to step outside if it gets loud.", time: "8:36am", mine: false },
    { id: "coffee-2", personId: "james-member", name: "James", avatar: "J", text: "Thanks. I may arrive right on time and keep my details light until we meet.", time: "8:44am", mine: false },
    { id: "coffee-3", personId: "alon-member", name: "Alon", avatar: "A", text: "Low-key hello sounds perfect. I will grab a coffee first.", time: "8:51am", mine: false },
    { id: "coffee-4", name: "You", avatar: "Y", text: "Can we keep photos off unless everyone says yes?", time: "8:55am", mine: true },
  ],
  "library-calm-study": [
    { id: "library-1", personId: "maya-host", name: "Maya", avatar: "M", text: "I will pick a table in the open study area. Quiet arrival is completely fine.", time: "1:42pm", mine: false },
    { id: "library-2", personId: "james-member", name: "James", avatar: "J", text: "I am likely to wave and settle in first, then chat during the break.", time: "1:48pm", mine: false },
    { id: "library-3", personId: "alon-member", name: "Alon", avatar: "A", text: "I can bring spare sticky notes if anyone needs them.", time: "1:52pm", mine: false },
    { id: "library-4", name: "You", avatar: "Y", text: "Thanks. I like the plan of short chat breaks and mostly quiet time.", time: "1:55pm", mine: true },
  ],
  "movie-night-watch-chat": [
    { id: "movie-1", personId: "alon-member", name: "Alon", avatar: "A", text: "Hey! I will be there around 6:45pm and can wait near the cinema entrance.", time: "4:32pm", mine: false },
    { id: "movie-2", personId: "maya-host", name: "Maya", avatar: "M", text: "Lovely. Watch first, optional chat after. No pressure if you want to head home.", time: "4:34pm", mine: false },
    { id: "movie-3", personId: "james-member", name: "James", avatar: "J", text: "Same here, I have not seen this movie yet. Please ask before photos.", time: "4:35pm", mine: false },
    { id: "movie-4", name: "You", avatar: "Y", text: "Can not wait. I may do a quiet arrival and say hi after tickets.", time: "4:36pm", mine: true },
  ],
  "board-games-coffee": [
    { id: "board-1", personId: "maya-host", name: "Maya", avatar: "M", text: "I will bring two simple games and keep rules-light options ready.", time: "5:15pm", mine: false },
    { id: "board-2", personId: "james-member", name: "James", avatar: "J", text: "Rules-light sounds good. I am okay joining a round after watching one first.", time: "5:19pm", mine: false },
    { id: "board-3", personId: "alon-member", name: "Alon", avatar: "A", text: "I can grab the first coffees. No table photos unless everyone opts in.", time: "5:26pm", mine: false },
    { id: "board-4", name: "You", avatar: "Y", text: "Watching one round first would help me too. Thanks for making room for that.", time: "5:30pm", mine: true },
  ],
  "beach-day-chill-vibes": [
    { id: "beach-1", personId: "maya-host", name: "Maya", avatar: "M", text: "I will set a broad meeting point near the main path, then we can choose a quieter patch.", time: "11:10am", mine: false },
    { id: "beach-2", personId: "james-member", name: "James", avatar: "J", text: "I prefer to keep personal details light, but I will post an arrival update once I am nearby.", time: "11:18am", mine: false },
    { id: "beach-3", personId: "alon-member", name: "Alon", avatar: "A", text: "I will bring sunscreen. Ask before photos, especially if people are in frame.", time: "11:22am", mine: false },
    { id: "beach-4", name: "You", avatar: "Y", text: "Sounds good. I may sit a little back from the busiest area at first.", time: "11:25am", mine: true },
  ],
};

export const chatSeed: ChatMessage[] = [
  { id: "1", name: "Alon", avatar: "A", text: "Hey! I'll be there around 6:45pm 😊", time: "4:32pm", mine: false },
  { id: "2", name: "Maya", avatar: "M", text: "Awesome! Looking forward to it 🎬", time: "4:34pm", mine: false },
  { id: "3", name: "James", avatar: "J", text: "Same here, haven’t seen this movie yet!", time: "4:35pm", mine: false },
  { id: "4", name: "You", avatar: "Y", text: "Can’t wait! See you all there 🙂", time: "4:36pm", mine: true },
];
