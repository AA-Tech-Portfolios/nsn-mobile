import type { EventItem } from "@/lib/nsn-data";
import { findNearestLocalAreaSuggestion, lookupLocalAreaSuggestions, normalizeLocationLookupQuery, type LocalAreaSuggestion } from "./location-lookup";

export type NsnLocalAreaSuggestion = LocalAreaSuggestion;

export function normalizeNsnSearchQuery(query: string) {
  return normalizeLocationLookupQuery(query);
}

export function searchNsnSydneyLocalAreas(query: string, limit = 7) {
  return lookupLocalAreaSuggestions(query, limit);
}

export function findNearestNsnSydneyLocalArea(latitude: number, longitude: number) {
  return findNearestLocalAreaSuggestion(latitude, longitude);
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
  ].map(normalizeLocationLookupQuery).join(" ");

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
