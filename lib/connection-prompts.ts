import { demoPersonas, type DemoPersonaId } from "./demo-personas";

export type ConnectionPromptCategoryId =
  | "socialComfort"
  | "conversationSeeds"
  | "humorStyle"
  | "appreciates"
  | "learningGrowth";

export type ConnectionPromptCategory = {
  id: ConnectionPromptCategoryId;
  title: string;
};

export type ConversationSeed = {
  label: string;
  value: string;
};

export type ConnectionPromptProfile = {
  socialComfort: string[];
  conversationSeeds: ConversationSeed[];
  humorStyle: string[];
  appreciates: string[];
  learningGrowth: string[];
};

export const connectionPromptCategories: ConnectionPromptCategory[] = [
  { id: "socialComfort", title: "Social comfort & pacing" },
  { id: "conversationSeeds", title: "Conversation seeds" },
  { id: "humorStyle", title: "Humor & conversation style" },
  { id: "appreciates", title: "Things I appreciate" },
  { id: "learningGrowth", title: "Learning & growth" },
];

const connectionPromptProfiles: Record<DemoPersonaId, ConnectionPromptProfile> = {
  "nsn-tester": {
    socialComfort: ["Warms up after a little while", "Prefers small groups", "Enjoys listening"],
    conversationSeeds: [
      { label: "Tea or coffee", value: "Coffee" },
      { label: "Dream destination", value: "Japan" },
      { label: "Favourite season", value: "Autumn" },
      { label: "Hobby to try", value: "Pottery" },
    ],
    humorStyle: ["Light jokes occasionally", "Wholesome humor"],
    appreciates: ["Appreciates patience", "Appreciates kindness", "Appreciates clear communication"],
    learningGrowth: ["Enjoys learning new things", "Learns best by doing"],
  },
  "maya-host": {
    socialComfort: ["Usually starts conversations easily", "Prefers smaller groups", "Can help people join in"],
    conversationSeeds: [
      { label: "Tea or coffee", value: "Coffee" },
      { label: "Dream destination", value: "Japan" },
      { label: "Comfort food", value: "Laksa" },
      { label: "Something to learn", value: "Watercolour painting" },
    ],
    humorStyle: ["Playful and humorous", "Wholesome humor"],
    appreciates: ["Appreciates curiosity", "Appreciates inclusiveness", "Appreciates reliability"],
    learningGrowth: ["Enjoys teaching others", "Happy to help others learn"],
  },
  "jordan-member": {
    socialComfort: ["Can be shy at first", "Prefers one-on-one chats", "Enjoys listening more than speaking"],
    conversationSeeds: [
      { label: "Tea or coffee", value: "Tea" },
      { label: "Beach or mountains", value: "Mountains" },
      { label: "Favourite season", value: "Autumn" },
      { label: "Something to learn", value: "Guitar" },
    ],
    humorStyle: ["Dry humor", "Nerdy humor"],
    appreciates: ["Appreciates patience", "Appreciates respectfulness", "Appreciates openness"],
    learningGrowth: ["Learns best through conversation", "Sometimes needs extra time with new topics"],
  },
};

const isDemoPersonaId = (personId: string | null | undefined): personId is DemoPersonaId =>
  Boolean(personId && personId in demoPersonas);

export const getConnectionPromptProfile = (personId: string | null | undefined) =>
  isDemoPersonaId(personId) ? connectionPromptProfiles[personId] : undefined;

export const getConnectionPromptSummary = (personId: string | null | undefined) => {
  const profile = getConnectionPromptProfile(personId);
  if (!profile) return [];

  return [
    ...profile.socialComfort,
    ...profile.conversationSeeds.map((seed) => `${seed.label}: ${seed.value}`),
    ...profile.humorStyle,
    ...profile.appreciates,
    ...profile.learningGrowth,
  ];
};

export const getSharedConnectionPrompts = (
  firstPersonId: string | null | undefined,
  secondPersonId: string | null | undefined,
) => {
  const firstProfile = getConnectionPromptProfile(firstPersonId);
  const secondProfile = getConnectionPromptProfile(secondPersonId);
  if (!firstProfile || !secondProfile) return [];

  const secondSeedValues = new Set(
    secondProfile.conversationSeeds.map((seed) => seed.value.toLowerCase()),
  );
  const sharedSeeds = firstProfile.conversationSeeds.filter((seed) =>
    secondSeedValues.has(seed.value.toLowerCase()),
  );
  const secondAppreciates = new Set(secondProfile.appreciates.map((item) => item.toLowerCase()));
  const sharedAppreciates = firstProfile.appreciates.filter((item) =>
    secondAppreciates.has(item.toLowerCase()),
  );
  const secondHumor = new Set(secondProfile.humorStyle.map((item) => item.toLowerCase()));
  const sharedHumor = firstProfile.humorStyle.filter((item) =>
    secondHumor.has(item.toLowerCase()),
  );

  return [
    ...sharedSeeds.map((seed) => `You both mentioned ${seed.value}.`),
    ...sharedAppreciates.map((item) => `You both ${item.toLowerCase()}.`),
    ...sharedHumor.map((item) => `You both have ${item.toLowerCase()} in your conversation style.`),
  ].slice(0, 4);
};

export const getMeetupConnectionInsights = (personIds: string[]) => {
  const profiles = personIds
    .map((personId) => getConnectionPromptProfile(personId))
    .filter((profile): profile is ConnectionPromptProfile => Boolean(profile));
  if (!profiles.length) return [];

  const socialComfort = profiles.flatMap((profile) => profile.socialComfort).join(" ");
  const seedValues = profiles.flatMap((profile) => profile.conversationSeeds.map((seed) => seed.value));
  const hasCoffee = seedValues.includes("Coffee");
  const hasJapan = seedValues.includes("Japan");
  const hasAutumn = seedValues.includes("Autumn");

  return [
    /small/i.test(socialComfort)
      ? "Several attendees prefer smaller groups."
      : "Some attendees prefer gentler pacing.",
    /warms up|shy/i.test(socialComfort)
      ? "Some attendees may need a little time to warm up."
      : "Some attendees are comfortable helping conversation begin.",
    hasCoffee
      ? "Coffee could be an easy conversation starter."
      : hasJapan
        ? "Japan could be an easy conversation starter."
        : hasAutumn
          ? "Autumn could be an easy conversation starter."
          : "Shared interests can be used as gentle conversation starters.",
  ];
};
