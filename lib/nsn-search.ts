import type { TimezoneSetting } from "@/lib/app-settings";
import type { EventItem } from "@/lib/nsn-data";
import { sydneyLocalities, type SydneyLocality } from "./sydney-localities";

export type NsnLocalAreaSuggestion = TimezoneSetting & {
  region: SydneyLocality["region"];
  resultType: SydneyLocality["kind"];
  aliases: string[];
};

const toSearchToken = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");

export function normalizeNsnSearchQuery(query: string) {
  return toSearchToken(query);
}

const localityToSuggestion = (locality: SydneyLocality): NsnLocalAreaSuggestion => ({
  id: `nsn-${locality.id}`,
  label: locality.displayName,
  city: locality.displayName,
  country: locality.region,
  timeZone: "Australia/Sydney",
  latitude: locality.latitude,
  longitude: locality.longitude,
  region: locality.region,
  resultType: locality.kind,
  aliases: locality.aliases ?? [],
});

const getLocalitySearchText = (locality: SydneyLocality) =>
  [locality.displayName, locality.region, locality.kind, ...(locality.aliases ?? [])].map(toSearchToken).join(" ");

export function searchNsnSydneyLocalAreas(query: string, limit = 7) {
  const normalized = normalizeNsnSearchQuery(query);

  if (!normalized) {
    return [];
  }

  const exactMatches: SydneyLocality[] = [];
  const partialMatches: SydneyLocality[] = [];

  for (const locality of sydneyLocalities) {
    const tokens = [locality.displayName, locality.region, ...(locality.aliases ?? [])].map(toSearchToken);
    const isExact = tokens.some((token) => token === normalized);
    const isPartial = getLocalitySearchText(locality).includes(normalized);

    if (isExact) {
      exactMatches.push(locality);
    } else if (isPartial) {
      partialMatches.push(locality);
    }
  }

  return [...exactMatches, ...partialMatches].slice(0, limit).map(localityToSuggestion);
}

export function findNearestNsnSydneyLocalArea(latitude: number, longitude: number) {
  const localitiesOnly = sydneyLocalities.filter((locality) => locality.kind === "Suburb");

  return localityToSuggestion(
    localitiesOnly.reduce((nearest, locality) => {
      const nearestDistance = Math.hypot(nearest.latitude - latitude, nearest.longitude - longitude);
      const localityDistance = Math.hypot(locality.latitude - latitude, locality.longitude - longitude);

      return localityDistance < nearestDistance ? locality : nearest;
    }, localitiesOnly[0])
  );
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
  ].map(toSearchToken).join(" ");

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
