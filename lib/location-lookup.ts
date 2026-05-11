import type { TimezoneSetting } from "@/lib/app-settings";
import { sydneyLocalities, type SydneyLocality } from "./sydney-localities";

export type LocalAreaSuggestion = TimezoneSetting & {
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

export function normalizeLocationLookupQuery(query: string) {
  return toSearchToken(query);
}

const localityToSuggestion = (locality: SydneyLocality): LocalAreaSuggestion => ({
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

// Prototype currently uses local fallback suburb data. Future version should use
// an Australian suburb/locality API or maintained dataset behind this service.
export function lookupLocalAreaSuggestions(query: string, limit = 7) {
  const normalized = normalizeLocationLookupQuery(query);

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

export function findNearestLocalAreaSuggestion(latitude: number, longitude: number) {
  const localitiesOnly = sydneyLocalities.filter((locality) => locality.kind === "Suburb");

  return localityToSuggestion(
    localitiesOnly.reduce((nearest, locality) => {
      const nearestDistance = Math.hypot(nearest.latitude - latitude, nearest.longitude - longitude);
      const localityDistance = Math.hypot(locality.latitude - latitude, locality.longitude - longitude);

      return localityDistance < nearestDistance ? locality : nearest;
    }, localitiesOnly[0])
  );
}
