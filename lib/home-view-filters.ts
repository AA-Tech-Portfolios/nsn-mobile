import type { EventItem } from "@/lib/nsn-data";

export const isSmallGroupEvent = (event: EventItem) => {
  const counts = event.people.match(/\d+/g)?.map(Number) ?? [];
  return counts.length ? Math.max(...counts) <= 4 : false;
};

export const isWeatherSafeEvent = (event: EventItem) =>
  event.category === "Indoor" ||
  event.tags.includes("Indoor") ||
  /rain|backup|indoor/i.test(`${event.weather} ${event.description}`);

export const isNearbyEvent = (event: EventItem, selectedArea: string) =>
  `${event.title} ${event.venue} ${event.description}`
    .toLocaleLowerCase()
    .split(/\s+/)
    .some((part) => part.length > 3 && selectedArea.toLocaleLowerCase().includes(part));

export const getComfortEventScore = (event: EventItem) =>
  (event.noiseLevel === "Quiet" ? 0 : event.noiseLevel === "Balanced" ? 1 : 3) +
  (isSmallGroupEvent(event) ? 0 : 1) +
  (isWeatherSafeEvent(event) ? 0 : 1);
