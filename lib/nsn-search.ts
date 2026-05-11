import type { TimezoneSetting } from "@/lib/app-settings";
import type { EventItem } from "@/lib/nsn-data";

export const nsnSydneyLocalAreas: TimezoneSetting[] = [
  { id: "nsn-chatswood", label: "Chatswood", city: "Chatswood", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7969, longitude: 151.1833 },
  { id: "nsn-st-ives", label: "St Ives", city: "St Ives", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7291, longitude: 151.1593 },
  { id: "nsn-hornsby", label: "Hornsby", city: "Hornsby", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7039, longitude: 151.0997 },
  { id: "nsn-turramurra", label: "Turramurra", city: "Turramurra", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7314, longitude: 151.1287 },
  { id: "nsn-pymble", label: "Pymble", city: "Pymble", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7434, longitude: 151.1417 },
  { id: "nsn-gordon", label: "Gordon", city: "Gordon", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7569, longitude: 151.1517 },
  { id: "nsn-killara", label: "Killara", city: "Killara", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7666, longitude: 151.1622 },
  { id: "nsn-lindfield", label: "Lindfield", city: "Lindfield", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7756, longitude: 151.1689 },
  { id: "nsn-roseville", label: "Roseville", city: "Roseville", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7841, longitude: 151.1783 },
  { id: "nsn-artarmon", label: "Artarmon", city: "Artarmon", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8088, longitude: 151.1844 },
  { id: "nsn-lane-cove", label: "Lane Cove", city: "Lane Cove", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8152, longitude: 151.1667 },
  { id: "nsn-north-sydney", label: "North Sydney", city: "North Sydney", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.839, longitude: 151.2071 },
  { id: "nsn-crows-nest", label: "Crows Nest", city: "Crows Nest", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8258, longitude: 151.2016 },
  { id: "nsn-neutral-bay", label: "Neutral Bay", city: "Neutral Bay", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8319, longitude: 151.219 },
  { id: "nsn-mosman", label: "Mosman", city: "Mosman", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8276, longitude: 151.2446 },
  { id: "nsn-wahroonga", label: "Wahroonga", city: "Wahroonga", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7181, longitude: 151.1156 },
  { id: "nsn-waitara", label: "Waitara", city: "Waitara", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7105, longitude: 151.103 },
  { id: "nsn-asquith", label: "Asquith", city: "Asquith", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.6879, longitude: 151.1086 },
  { id: "nsn-thornleigh", label: "Thornleigh", city: "Thornleigh", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7312, longitude: 151.0789 },
  { id: "nsn-pennant-hills", label: "Pennant Hills", city: "Pennant Hills", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7378, longitude: 151.0732 },
  { id: "nsn-epping", label: "Epping", city: "Epping", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7727, longitude: 151.0818 },
  { id: "nsn-macquarie-park", label: "Macquarie Park", city: "Macquarie Park", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.7756, longitude: 151.1179 },
  { id: "nsn-ryde", label: "Ryde", city: "Ryde", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8136, longitude: 151.1066 },
  { id: "nsn-st-leonards", label: "St Leonards", city: "St Leonards", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8223, longitude: 151.1939 },
  { id: "nsn-willoughby", label: "Willoughby", city: "Willoughby", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8014, longitude: 151.1994 },
  { id: "nsn-cammeray", label: "Cammeray", city: "Cammeray", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8216, longitude: 151.2122 },
  { id: "nsn-cremorne", label: "Cremorne", city: "Cremorne", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8286, longitude: 151.2266 },
  { id: "nsn-waverton", label: "Waverton", city: "Waverton", country: "Sydney / North Shore", timeZone: "Australia/Sydney", latitude: -33.8388, longitude: 151.1961 },
  { id: "nsn-manly", label: "Manly", city: "Manly", country: "Sydney / Northern Beaches", timeZone: "Australia/Sydney", latitude: -33.7969, longitude: 151.2855 },
  { id: "nsn-sydney-cbd", label: "Sydney CBD", city: "Sydney CBD", country: "Sydney", timeZone: "Australia/Sydney", latitude: -33.8688, longitude: 151.2093 },
];

export function normalizeNsnSearchQuery(query: string) {
  return query.trim().toLocaleLowerCase();
}

export function searchNsnSydneyLocalAreas(query: string, limit = 6) {
  const normalized = normalizeNsnSearchQuery(query);
  const areas = normalized
    ? nsnSydneyLocalAreas.filter((area) =>
        `${area.label} ${area.city} ${area.country}`.toLocaleLowerCase().includes(normalized)
      )
    : nsnSydneyLocalAreas;

  return areas.slice(0, limit);
}

export function findNearestNsnSydneyLocalArea(latitude: number, longitude: number) {
  return nsnSydneyLocalAreas.reduce((nearest, area) => {
    const nearestDistance = Math.hypot(nearest.latitude - latitude, nearest.longitude - longitude);
    const areaDistance = Math.hypot(area.latitude - latitude, area.longitude - longitude);

    return areaDistance < nearestDistance ? area : nearest;
  }, nsnSydneyLocalAreas[0]);
}

export function matchesNsnEventSearch(event: EventItem, query: string, localizedEvent?: Partial<EventItem>) {
  const normalized = normalizeNsnSearchQuery(query);

  if (!normalized) {
    return true;
  }

  const searchableEvent = { ...event, ...localizedEvent };
  const haystack = [
    searchableEvent.title,
    searchableEvent.category,
    searchableEvent.venue,
    searchableEvent.time,
    searchableEvent.people,
    searchableEvent.description,
    searchableEvent.tone,
    searchableEvent.noiseLevel,
    searchableEvent.weather,
    searchableEvent.tags.join(" "),
  ].join(" ").toLocaleLowerCase();

  return haystack.includes(normalized);
}

export function searchNsnEvents(events: EventItem[], query: string, localizedEvents: Record<string, Partial<EventItem>> = {}, limit = 6) {
  const normalized = normalizeNsnSearchQuery(query);

  if (!normalized) {
    return [];
  }

  return events
    .filter((event) => matchesNsnEventSearch(event, normalized, localizedEvents[event.id]))
    .slice(0, limit);
}
