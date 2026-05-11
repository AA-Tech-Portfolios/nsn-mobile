export type SydneyRegion =
  | "Sydney CBD"
  | "Eastern Suburbs"
  | "Inner West"
  | "Northern Beaches"
  | "North Shore"
  | "Western Sydney"
  | "South-Western Sydney"
  | "Sutherland Shire";

export type SydneyLocalityKind = "Suburb" | "Region";

export type SydneyLocality = {
  id: string;
  displayName: string;
  region: SydneyRegion;
  kind: SydneyLocalityKind;
  latitude: number;
  longitude: number;
  aliases?: string[];
};

// Local prototype fallback. Keep this compact and replace/augment via
// location-lookup.ts when an Australian locality API or maintained dataset lands.
export const sydneyLocalities: SydneyLocality[] = [
  { id: "region-sydney-cbd", displayName: "Sydney CBD", region: "Sydney CBD", kind: "Region", latitude: -33.8688, longitude: 151.2093, aliases: ["CBD", "City", "Sydney city"] },
  { id: "region-eastern-suburbs", displayName: "Eastern Suburbs", region: "Eastern Suburbs", kind: "Region", latitude: -33.8915, longitude: 151.2509, aliases: ["East", "Eastern Sydney"] },
  { id: "region-inner-west", displayName: "Inner West", region: "Inner West", kind: "Region", latitude: -33.8899, longitude: 151.1648, aliases: ["Innerwest"] },
  { id: "region-northern-beaches", displayName: "Northern Beaches", region: "Northern Beaches", kind: "Region", latitude: -33.7545, longitude: 151.2876, aliases: ["Beaches", "Northern Sydney beaches"] },
  { id: "region-north-shore", displayName: "North Shore", region: "North Shore", kind: "Region", latitude: -33.75, longitude: 151.15, aliases: ["Upper North Shore", "Lower North Shore"] },
  { id: "region-western-sydney", displayName: "Western Sydney", region: "Western Sydney", kind: "Region", latitude: -33.8144, longitude: 150.9993, aliases: ["West Sydney", "West"] },
  { id: "region-south-western-sydney", displayName: "South-Western Sydney", region: "South-Western Sydney", kind: "Region", latitude: -33.9196, longitude: 150.9254, aliases: ["South West", "Southwestern Sydney"] },
  { id: "region-sutherland-shire", displayName: "Sutherland Shire", region: "Sutherland Shire", kind: "Region", latitude: -34.0353, longitude: 151.0577, aliases: ["The Shire", "Shire"] },
  { id: "sydney-cbd", displayName: "Sydney CBD", region: "Sydney CBD", kind: "Suburb", latitude: -33.8688, longitude: 151.2093, aliases: ["CBD", "City", "Town Hall", "Circular Quay", "Wynyard"] },
  { id: "haymarket", displayName: "Haymarket", region: "Sydney CBD", kind: "Suburb", latitude: -33.8806, longitude: 151.2058, aliases: ["Chinatown"] },
  { id: "surry-hills", displayName: "Surry Hills", region: "Sydney CBD", kind: "Suburb", latitude: -33.8846, longitude: 151.212, aliases: ["Surry"] },
  { id: "bondi", displayName: "Bondi", region: "Eastern Suburbs", kind: "Suburb", latitude: -33.8915, longitude: 151.2657, aliases: ["Bondi Beach"] },
  { id: "randwick", displayName: "Randwick", region: "Eastern Suburbs", kind: "Suburb", latitude: -33.9147, longitude: 151.2418 },
  { id: "newtown", displayName: "Newtown", region: "Inner West", kind: "Suburb", latitude: -33.8984, longitude: 151.1775 },
  { id: "marrickville", displayName: "Marrickville", region: "Inner West", kind: "Suburb", latitude: -33.911, longitude: 151.155 },
  { id: "strathfield", displayName: "Strathfield", region: "Inner West", kind: "Suburb", latitude: -33.8795, longitude: 151.0843 },
  { id: "parramatta", displayName: "Parramatta", region: "Western Sydney", kind: "Suburb", latitude: -33.8144, longitude: 151.0011, aliases: ["Parra"] },
  { id: "blacktown", displayName: "Blacktown", region: "Western Sydney", kind: "Suburb", latitude: -33.771, longitude: 150.9063 },
  { id: "liverpool", displayName: "Liverpool", region: "South-Western Sydney", kind: "Suburb", latitude: -33.9209, longitude: 150.9231 },
  { id: "bankstown", displayName: "Bankstown", region: "South-Western Sydney", kind: "Suburb", latitude: -33.9173, longitude: 151.0359 },
  { id: "cronulla", displayName: "Cronulla", region: "Sutherland Shire", kind: "Suburb", latitude: -34.0575, longitude: 151.1529 },
  { id: "miranda", displayName: "Miranda", region: "Sutherland Shire", kind: "Suburb", latitude: -34.0348, longitude: 151.1007 },
  { id: "manly", displayName: "Manly", region: "Northern Beaches", kind: "Suburb", latitude: -33.7969, longitude: 151.2855 },
  { id: "dee-why", displayName: "Dee Why", region: "Northern Beaches", kind: "Suburb", latitude: -33.7539, longitude: 151.2855 },
  { id: "brookvale", displayName: "Brookvale", region: "Northern Beaches", kind: "Suburb", latitude: -33.7615, longitude: 151.2743 },
  { id: "chatswood", displayName: "Chatswood", region: "North Shore", kind: "Suburb", latitude: -33.7969, longitude: 151.1833 },
  { id: "st-ives", displayName: "St Ives", region: "North Shore", kind: "Suburb", latitude: -33.7291, longitude: 151.1593, aliases: ["St. Ives", "Saint Ives"] },
  { id: "hornsby", displayName: "Hornsby", region: "North Shore", kind: "Suburb", latitude: -33.7039, longitude: 151.0997 },
  { id: "turramurra", displayName: "Turramurra", region: "North Shore", kind: "Suburb", latitude: -33.7314, longitude: 151.1287 },
  { id: "pymble", displayName: "Pymble", region: "North Shore", kind: "Suburb", latitude: -33.7434, longitude: 151.1417 },
  { id: "west-pymble", displayName: "West Pymble", region: "North Shore", kind: "Suburb", latitude: -33.7669, longitude: 151.1285 },
  { id: "gordon", displayName: "Gordon", region: "North Shore", kind: "Suburb", latitude: -33.7569, longitude: 151.1517 },
  { id: "killara", displayName: "Killara", region: "North Shore", kind: "Suburb", latitude: -33.7666, longitude: 151.1622 },
  { id: "lindfield", displayName: "Lindfield", region: "North Shore", kind: "Suburb", latitude: -33.7756, longitude: 151.1689 },
  { id: "roseville", displayName: "Roseville", region: "North Shore", kind: "Suburb", latitude: -33.7841, longitude: 151.1783 },
  { id: "artarmon", displayName: "Artarmon", region: "North Shore", kind: "Suburb", latitude: -33.8088, longitude: 151.1844 },
  { id: "lane-cove", displayName: "Lane Cove", region: "North Shore", kind: "Suburb", latitude: -33.8152, longitude: 151.1667 },
  { id: "north-sydney", displayName: "North Sydney", region: "North Shore", kind: "Suburb", latitude: -33.839, longitude: 151.2071 },
  { id: "crows-nest", displayName: "Crows Nest", region: "North Shore", kind: "Suburb", latitude: -33.8258, longitude: 151.2016 },
  { id: "neutral-bay", displayName: "Neutral Bay", region: "North Shore", kind: "Suburb", latitude: -33.8319, longitude: 151.219 },
  { id: "mosman", displayName: "Mosman", region: "North Shore", kind: "Suburb", latitude: -33.8276, longitude: 151.2446 },
  { id: "wahroonga", displayName: "Wahroonga", region: "North Shore", kind: "Suburb", latitude: -33.7181, longitude: 151.1156 },
  { id: "waitara", displayName: "Waitara", region: "North Shore", kind: "Suburb", latitude: -33.7105, longitude: 151.103 },
  { id: "asquith", displayName: "Asquith", region: "North Shore", kind: "Suburb", latitude: -33.6879, longitude: 151.1086 },
  { id: "thornleigh", displayName: "Thornleigh", region: "North Shore", kind: "Suburb", latitude: -33.7312, longitude: 151.0789 },
  { id: "pennant-hills", displayName: "Pennant Hills", region: "North Shore", kind: "Suburb", latitude: -33.7378, longitude: 151.0732 },
  { id: "epping", displayName: "Epping", region: "North Shore", kind: "Suburb", latitude: -33.7727, longitude: 151.0818 },
  { id: "macquarie-park", displayName: "Macquarie Park", region: "North Shore", kind: "Suburb", latitude: -33.7756, longitude: 151.1179, aliases: ["Macquarie"] },
  { id: "ryde", displayName: "Ryde", region: "North Shore", kind: "Suburb", latitude: -33.8136, longitude: 151.1066 },
];
