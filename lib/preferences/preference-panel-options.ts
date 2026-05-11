import type {
  LocationComfortPreference,
  MeetupContactPreference,
  TransportationMethod,
  TransportationPreference,
} from "../app-settings";

export type PreferenceOptionDetail<T extends string> = {
  value: T;
  icon: string;
  copy: string;
  group?: string;
};

export const transportationPreferenceDetails: PreferenceOptionDetail<TransportationPreference>[] = [
  { value: "Walking", icon: "🚶", copy: "Nearby meetups and clear walking directions feel easiest.", group: "Transport method" },
  { value: "Public transport", icon: "🚆", copy: "Train, metro, bus, ferry, or light rail access helps.", group: "Transport method" },
  { value: "Train", icon: "🚆", copy: "Meetups near train stations are preferred.", group: "Transport method" },
  { value: "Metro", icon: "🚇", copy: "Metro access makes the plan easier.", group: "Transport method" },
  { value: "Bus", icon: "🚌", copy: "Bus-friendly meeting points are useful.", group: "Transport method" },
  { value: "Ferry", icon: "⛴️", copy: "Ferry access is comfortable for some local plans.", group: "Transport method" },
  { value: "Light rail", icon: "🚈", copy: "Light rail access helps where available.", group: "Transport method" },
  { value: "Driving", icon: "🚗", copy: "Driving is okay if the meeting point is clear.", group: "Transport method" },
  { value: "Parking needed", icon: "🅿️", copy: "Parking details make meetups feel easier.", group: "Transport method" },
  { value: "Rideshare / taxi", icon: "🚕", copy: "Pickup and drop-off friendly locations help.", group: "Transport method" },
  { value: "Cycling", icon: "🚲", copy: "Bike-friendly routes and lock-up spots matter.", group: "Transport method" },
  { value: "Carpool okay", icon: "🤝", copy: "Carpooling could be okay when trust and logistics are clear.", group: "Transport method" },
  { value: "Prefer nearby only", icon: "📍", copy: "Nearby plans feel more comfortable.", group: "Travel comfort" },
  { value: "Avoid long travel", icon: "🧭", copy: "Long trips can make meetups feel less easy.", group: "Travel comfort" },
  { value: "Step-free / accessible routes preferred", icon: "♿", copy: "Step-free and accessible routes are preferred where possible.", group: "Travel comfort" },
  { value: "Short trips only", icon: "⏱️", copy: "Short travel windows are best.", group: "Travel comfort" },
  { value: "Comfortable travelling at night", icon: "🌙", copy: "Evening travel can feel okay with clear plans.", group: "Travel comfort" },
  { value: "Prefer daytime travel", icon: "☀️", copy: "Daytime travel feels easier.", group: "Travel comfort" },
  { value: "Prefer well-lit routes", icon: "💡", copy: "Well-lit routes and meeting points are preferred.", group: "Travel comfort" },
  { value: "Prefer close to public transport", icon: "🚉", copy: "A short walk from transport helps.", group: "Travel comfort" },
];

export const meetupContactPreferenceDetails: PreferenceOptionDetail<MeetupContactPreference>[] = [
  { value: "In-app chat", icon: "💬", copy: "Keep coordination inside the app prototype.", group: "Communication style" },
  { value: "Details only", icon: "📝", copy: "Key details without lots of extra chat.", group: "Communication style" },
  { value: "Low-message mode", icon: "🔕", copy: "Fewer messages and less pressure.", group: "Communication style" },
  { value: "Chat before meetup", icon: "💬", copy: "A short chat beforehand can help.", group: "Communication style" },
  { value: "Group chat okay", icon: "👥", copy: "Group meetup chat feels okay.", group: "Communication style" },
  { value: "Direct messages okay", icon: "✉️", copy: "Direct messages are okay when relevant.", group: "Communication style" },
  { value: "Voice call okay", icon: "📞", copy: "A short voice call can be okay.", group: "Communication style" },
  { value: "No voice calls", icon: "🚫", copy: "Text-based planning is preferred.", group: "Communication style" },
  { value: "Reminders only", icon: "⏰", copy: "Just the essential reminders.", group: "Communication style" },
  { value: "Prefer clear plans", icon: "✅", copy: "Clear time, place, and plan details help.", group: "Communication style" },
  { value: "Prefer short messages", icon: "↔️", copy: "Short practical messages feel easiest.", group: "Communication style" },
  { value: "Okay with check-ins", icon: "🛟", copy: "Gentle check-ins are okay around the meetup.", group: "Communication style" },
  { value: "Slow replies are okay", icon: "🌿", copy: "No need for instant replies.", group: "Timing and pace" },
  { value: "Reply when I can", icon: "🕊️", copy: "Replies happen when there is time and energy.", group: "Timing and pace" },
  { value: "Same-day messages okay", icon: "📅", copy: "Same-day coordination is okay.", group: "Timing and pace" },
  { value: "Prefer planning ahead", icon: "🗓️", copy: "Advance notice makes plans easier.", group: "Timing and pace" },
  { value: "Last-minute plans okay", icon: "⚡", copy: "Short-notice plans can be okay.", group: "Timing and pace" },
  { value: "No pressure to reply quickly", icon: "🌿", copy: "Keep message expectations low-pressure.", group: "Timing and pace" },
];

export const locationComfortPreferenceDetails: PreferenceOptionDetail<LocationComfortPreference>[] = [
  { value: "Near my selected suburb", icon: "📍", copy: "Meetups near your selected suburb feel easiest.", group: "Area comfort" },
  { value: "North Shore preferred", icon: "🌉", copy: "North Shore plans are preferred.", group: "Area comfort" },
  { value: "Sydney CBD okay", icon: "🏙️", copy: "Sydney CBD meetups can be okay.", group: "Area comfort" },
  { value: "Northern Beaches okay", icon: "🌊", copy: "Northern Beaches plans can be okay.", group: "Area comfort" },
  { value: "Inner West okay", icon: "🚆", copy: "Inner West plans can be okay.", group: "Area comfort" },
  { value: "Close to public transport", icon: "🚉", copy: "Transport-adjacent venues feel easier.", group: "Venue comfort" },
  { value: "Parking nearby", icon: "🅿️", copy: "Nearby parking helps.", group: "Venue comfort" },
  { value: "Indoor venues", icon: "🏠", copy: "Indoor venues feel comfortable.", group: "Venue comfort" },
  { value: "Outdoor venues", icon: "🌳", copy: "Parks, walks, and outdoor venues feel comfortable.", group: "Venue comfort" },
  { value: "Quiet venues", icon: "🌿", copy: "Lower-noise venues are preferred.", group: "Venue comfort" },
  { value: "Well-lit areas", icon: "💡", copy: "Well-lit locations are preferred.", group: "Venue comfort" },
  { value: "Familiar places", icon: "🧭", copy: "Familiar public places feel easier.", group: "Venue comfort" },
  { value: "Easy exit / easy to leave", icon: "🚪", copy: "Simple arrival and exit paths matter.", group: "Venue comfort" },
  { value: "Avoid crowded venues", icon: "👥", copy: "Lower-crowd plans feel better.", group: "Venue comfort" },
  { value: "Avoid loud bars", icon: "🔕", copy: "Loud bar settings are not preferred.", group: "Venue comfort" },
  { value: "Prefer daytime locations", icon: "☀️", copy: "Daytime plans feel easier.", group: "Time comfort" },
  { value: "Comfortable with evening locations", icon: "🌙", copy: "Evening locations can be okay with clear plans.", group: "Time comfort" },
  { value: "Do not show exact location", icon: "🔒", copy: "Avoid sharing exact places or routines.", group: "Location privacy" },
  { value: "Share suburb only", icon: "📍", copy: "Suburb-level sharing is enough.", group: "Location privacy" },
  { value: "Share region only", icon: "🗺️", copy: "Region-level sharing is preferred.", group: "Location privacy" },
  { value: "Ask before sharing location", icon: "❔", copy: "Ask before sharing more location context.", group: "Location privacy" },
];

export const transportationMethodByPreference: Partial<Record<TransportationPreference, TransportationMethod>> = {
  Walking: "Walking",
  "Public transport": "Public transport",
  Train: "Public transport",
  Metro: "Public transport",
  Bus: "Public transport",
  Ferry: "Public transport",
  "Light rail": "Public transport",
  Driving: "Driving",
  "Parking needed": "Driving",
  "Rideshare / taxi": "Rideshare",
  Cycling: "Cycling",
};
