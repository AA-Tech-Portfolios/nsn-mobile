export type PersonalityPresenceHair =
  | "Dark"
  | "Brown"
  | "Black"
  | "Blonde"
  | "Grey"
  | "Colourful/dyed"
  | "Varies"
  | "Prefer not to say";

export type PersonalityPresenceEyes =
  | "Brown"
  | "Hazel/green-brown"
  | "Green"
  | "Blue"
  | "Grey"
  | "Prefer not to say";

export type PersonalityPresenceFacialHair =
  | "Usually clean-shaven"
  | "Stubble"
  | "Beard"
  | "Moustache"
  | "Varies"
  | "Not applicable"
  | "Prefer not to say";

export type PersonalityPresenceStyle =
  | "Casual"
  | "Neat"
  | "Sporty"
  | "Creative"
  | "Classic"
  | "Relaxed"
  | "Prefer not to say";

export type PersonalityPresencePersonalStyle =
  | "Casual"
  | "Relaxed"
  | "Neat/simple"
  | "Smart casual"
  | "Creative/artsy"
  | "Sporty"
  | "Cozy/comfy"
  | "Minimalist"
  | "Formal when needed"
  | "Depends on the setting"
  | "Don't mind what others wear"
  | "Still figuring out my style"
  | "Prefer not to say";

export type PersonalityPresenceSocialStyle =
  | "More introverted"
  | "More extroverted"
  | "Somewhere in between"
  | "Quiet at first, warmer later"
  | "Usually talkative"
  | "Prefer smaller conversations"
  | "Comfortable in groups"
  | "I usually approach others"
  | "People usually approach me"
  | "I warm up better with a familiar person nearby";

export type PersonalityPresenceConnectionPreference =
  | "Friendship"
  | "Community/group hangouts"
  | "Dating open, but not the main focus"
  | "Family-friendly meetups"
  | "Study/work/social support"
  | "Not looking for romance here";

export type PersonalityPresenceComfortAround =
  | "Kind and patient"
  | "Calm and thoughtful"
  | "Curious and open-minded"
  | "Playful and light-hearted"
  | "Direct but respectful"
  | "Good listeners"
  | "Emotionally steady"
  | "Shared hobbies matter"
  | "Shared values matter";

export const personalityPresenceHairOptions: PersonalityPresenceHair[] = [
  "Dark",
  "Brown",
  "Black",
  "Blonde",
  "Grey",
  "Colourful/dyed",
  "Varies",
  "Prefer not to say",
];

export const personalityPresenceEyeOptions: PersonalityPresenceEyes[] = [
  "Brown",
  "Hazel/green-brown",
  "Green",
  "Blue",
  "Grey",
  "Prefer not to say",
];

export const personalityPresenceFacialHairOptions: PersonalityPresenceFacialHair[] = [
  "Usually clean-shaven",
  "Stubble",
  "Beard",
  "Moustache",
  "Varies",
  "Not applicable",
  "Prefer not to say",
];

export const personalityPresenceStyleOptions: PersonalityPresenceStyle[] = [
  "Casual",
  "Neat",
  "Sporty",
  "Creative",
  "Classic",
  "Relaxed",
  "Prefer not to say",
];

export const personalityPresencePersonalStyleOptions: PersonalityPresencePersonalStyle[] = [
  "Casual",
  "Relaxed",
  "Neat/simple",
  "Smart casual",
  "Creative/artsy",
  "Sporty",
  "Cozy/comfy",
  "Minimalist",
  "Formal when needed",
  "Depends on the setting",
  "Don't mind what others wear",
  "Still figuring out my style",
  "Prefer not to say",
];

export const personalityPresenceSocialStyleOptions: PersonalityPresenceSocialStyle[] = [
  "More introverted",
  "More extroverted",
  "Somewhere in between",
  "Quiet at first, warmer later",
  "Usually talkative",
  "Prefer smaller conversations",
  "Comfortable in groups",
  "I usually approach others",
  "People usually approach me",
  "I warm up better with a familiar person nearby",
];

export const personalityPresenceConnectionOptions: PersonalityPresenceConnectionPreference[] = [
  "Friendship",
  "Community/group hangouts",
  "Dating open, but not the main focus",
  "Family-friendly meetups",
  "Study/work/social support",
  "Not looking for romance here",
];

export const personalityPresenceComfortAroundOptions: PersonalityPresenceComfortAround[] = [
  "Kind and patient",
  "Calm and thoughtful",
  "Curious and open-minded",
  "Playful and light-hearted",
  "Direct but respectful",
  "Good listeners",
  "Emotionally steady",
  "Shared hobbies matter",
  "Shared values matter",
];

export const normalizePersonalityPresenceChoice = <T extends string>(
  value: T | null | undefined,
  options: readonly T[]
): T | null => (value && options.includes(value) ? value : null);

export const normalizePersonalityPresenceList = <T extends string>(
  value: T[] | null | undefined,
  options: readonly T[]
): T[] => Array.from(new Set((value ?? []).filter((preference): preference is T => options.includes(preference))));

export const getPersonalityPresenceSelectedCount = ({
  hair,
  eyes,
  facialHair,
  style,
  personalStyles,
  socialStyles,
  connectionPreferences,
  comfortableAround,
}: {
  hair?: PersonalityPresenceHair | null;
  eyes?: PersonalityPresenceEyes | null;
  facialHair?: PersonalityPresenceFacialHair | null;
  style?: PersonalityPresenceStyle | null;
  personalStyles: readonly PersonalityPresencePersonalStyle[];
  socialStyles: readonly PersonalityPresenceSocialStyle[];
  connectionPreferences: readonly PersonalityPresenceConnectionPreference[];
  comfortableAround: readonly PersonalityPresenceComfortAround[];
}) =>
  [hair, eyes, facialHair, style].filter(Boolean).length +
  personalStyles.length +
  socialStyles.length +
  connectionPreferences.length +
  comfortableAround.length;
