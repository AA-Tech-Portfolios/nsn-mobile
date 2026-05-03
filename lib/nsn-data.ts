export const nsnColors = {
  background: "#020814",
  surface: "#071426",
  surfaceRaised: "#0B1D35",
  surfaceSoft: "#101B31",
  border: "#22324D",
  text: "#F5F7FF",
  muted: "#A6B1C7",
  mutedSoft: "#74819A",
  primary: "#3848FF",
  primarySoft: "#2736C8",
  cyan: "#18C8D1",
  day: "#FFE5A3",
  green: "#72D67E",
  warning: "#F7C85B",
  danger: "#FF7777",
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
  weather: string;
  imageTone: string;
  emoji: string;
  tags: string[];
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
    weather: "Weather dependent",
    imageTone: "#19432D",
    emoji: "🧺",
    tags: ["Outdoor", "Balanced"],
  },
  {
    id: "beach-day-chill-vibes",
    title: "Beach Day — Chill Vibes",
    category: "Outdoor",
    venue: "Manly Beach",
    time: "1:00pm",
    people: "3–6 people",
    description: "Sun, ocean and good company. BYO towel.",
    tone: "Balanced",
    weather: "Weather dependent",
    imageTone: "#1A4964",
    emoji: "🌊",
    tags: ["Outdoor", "Balanced"],
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
    weather: "Indoor backup ready",
    imageTone: "#281C45",
    emoji: "🍿",
    tags: ["Indoor", "Quiet"],
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
    weather: "Rain friendly",
    imageTone: "#3B2D15",
    emoji: "🎲",
    tags: ["Indoor", "Balanced"],
  },
];

export const movieNight = eveningEvents[0];

export const profileVibes = ["🌿 Calm", "💬 Good listener", "🎲 Into games", "⭐ Thoughtful", "👥 Small groups"];

export const chatSeed = [
  { id: "1", name: "Alon", avatar: "A", text: "Hey! I'll be there around 6:45pm 😊", time: "4:32pm", mine: false },
  { id: "2", name: "Maya", avatar: "M", text: "Awesome! Looking forward to it 🎬", time: "4:34pm", mine: false },
  { id: "3", name: "James", avatar: "J", text: "Same here, haven’t seen this movie yet!", time: "4:35pm", mine: false },
  { id: "4", name: "You", avatar: "Y", text: "Can’t wait! See you all there 🙂", time: "4:36pm", mine: true },
];
