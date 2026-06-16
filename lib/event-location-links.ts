import type { PreferredMapApp } from "./external-links";

export const buildEventLocationSearchUrl = (
  venue: string,
  area?: string,
  preferredMapApp: PreferredMapApp = "google-maps",
) => {
  const query = [venue, area].filter(Boolean).join(" ").trim();
  const encodedQuery = encodeURIComponent(query);

  if (preferredMapApp === "apple-maps") {
    return `https://maps.apple.com/?q=${encodedQuery}`;
  }

  if (preferredMapApp === "waze") {
    return `https://waze.com/ul?q=${encodedQuery}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
};
