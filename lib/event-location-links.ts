export const buildEventLocationSearchUrl = (venue: string, area?: string) => {
  const query = [venue, area].filter(Boolean).join(" ").trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};
