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
  | "Clean-shaven"
  | "Light stubble"
  | "Beard"
  | "Moustache"
  | "Varies"
  | "Cannot / don't grow facial hair"
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

export type PersonalityPresencePresentation =
  | "Masculine-presenting"
  | "Feminine-presenting"
  | "Soft/neutral presentation"
  | "Mixed presentation"
  | "Androgynous"
  | "Varies by setting"
  | "Prefer not to say";

export type PersonalityPresenceHairCue =
  | "Bald / shaved head"
  | "Very short hair"
  | "Medium-length hair"
  | "Long hair"
  | "Curly/wavy hair"
  | "Straight hair"
  | "Dark hair"
  | "Brown hair"
  | "Blonde hair"
  | "Grey/silver hair"
  | "Dyed/colourful hair"
  | "Thinning/receding hair"
  | "Wears head coverings sometimes"
  | "Varies"
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
  | "Still figuring out my style"
  | "Prefer not to say";

export type PersonalityPresenceAccessories =
  | "Rings"
  | "Necklaces"
  | "Bracelets"
  | "Beads"
  | "Watches"
  | "Earrings"
  | "Piercings"
  | "Cultural jewellery"
  | "Minimal accessories"
  | "Sentimental items"
  | "Depends on the day"
  | "Prefer not to say";

export type PersonalityPresenceGrooming =
  | "No makeup usually"
  | "Light makeup"
  | "Creative makeup"
  | "Makeup for special occasions"
  | "Groomed/simple"
  | "Natural look"
  | "Depends on the setting"
  | "Not applicable"
  | "Prefer not to say";

export type PersonalityPresenceVoicePresence =
  | "Quiet voice"
  | "Calm voice"
  | "Warm/friendly tone"
  | "Expressive when comfortable"
  | "Soft-spoken"
  | "Talkative once comfortable"
  | "Prefer text first"
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

export type PersonalityPresencePromptId =
  | "harmless-superpower"
  | "quiet-fictional-world"
  | "comforting-weather"
  | "recharge-socially"
  | "mood-snack-drink"
  | "welcoming-meetup"
  | "meetup-warm-up"
  | "try-one-day"
  | "relaxed-places"
  | "instant-skill";

export type PersonalityPresencePrompt = {
  id: PersonalityPresencePromptId;
  prompt: string;
  options: string[];
};

export type PersonalityPresencePromptResponse = {
  promptId: PersonalityPresencePromptId;
  option: string;
  customResponse?: string;
};

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
  "Clean-shaven",
  "Light stubble",
  "Beard",
  "Moustache",
  "Varies",
  "Cannot / don't grow facial hair",
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

export const personalityPresencePresentationOptions: PersonalityPresencePresentation[] = [
  "Masculine-presenting",
  "Feminine-presenting",
  "Soft/neutral presentation",
  "Mixed presentation",
  "Androgynous",
  "Varies by setting",
  "Prefer not to say",
];

export const personalityPresenceHairCueOptions: PersonalityPresenceHairCue[] = [
  "Bald / shaved head",
  "Very short hair",
  "Medium-length hair",
  "Long hair",
  "Curly/wavy hair",
  "Straight hair",
  "Dark hair",
  "Brown hair",
  "Blonde hair",
  "Grey/silver hair",
  "Dyed/colourful hair",
  "Thinning/receding hair",
  "Wears head coverings sometimes",
  "Varies",
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
  "Still figuring out my style",
  "Prefer not to say",
];

export const personalityPresenceAccessoriesOptions: PersonalityPresenceAccessories[] = [
  "Rings",
  "Necklaces",
  "Bracelets",
  "Beads",
  "Watches",
  "Earrings",
  "Piercings",
  "Cultural jewellery",
  "Minimal accessories",
  "Sentimental items",
  "Depends on the day",
  "Prefer not to say",
];

export const personalityPresenceGroomingOptions: PersonalityPresenceGrooming[] = [
  "No makeup usually",
  "Light makeup",
  "Creative makeup",
  "Makeup for special occasions",
  "Groomed/simple",
  "Natural look",
  "Depends on the setting",
  "Not applicable",
  "Prefer not to say",
];

export const personalityPresenceVoicePresenceOptions: PersonalityPresenceVoicePresence[] = [
  "Quiet voice",
  "Calm voice",
  "Warm/friendly tone",
  "Expressive when comfortable",
  "Soft-spoken",
  "Talkative once comfortable",
  "Prefer text first",
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

export const personalityPresencePromptOptions: PersonalityPresencePrompt[] = [
  {
    id: "harmless-superpower",
    prompt: "If you had a harmless superpower, what would it be?",
    options: ["Teleportation", "Healing", "Flying", "Talking to animals", "Pause time", "Endless energy", "Calm stressful situations", "Understand every language", "Invisibility", "Other..."],
  },
  {
    id: "quiet-fictional-world",
    prompt: "What fictional world would you quietly live in?",
    options: ["Cozy fantasy village", "Sci-fi future city", "Studio Ghibli-style world", "Space exploration", "Peaceful magic school", "Quiet island town", "Mystery/adventure world", "Other..."],
  },
  {
    id: "comforting-weather",
    prompt: "What kind of weather feels comforting to you?",
    options: ["Rainy evenings", "Sunny but cool", "Cozy winter weather", "Warm nights", "Storm watching indoors", "Beach weather", "Fresh morning air", "Cloudy calm days", "Other..."],
  },
  {
    id: "recharge-socially",
    prompt: "What helps you recharge socially?",
    options: ["Quiet time alone", "Small groups", "Music", "Gaming", "Nature walks", "Watching movies", "Creative hobbies", "Long sleep", "Calm cafes", "Other..."],
  },
  {
    id: "mood-snack-drink",
    prompt: "What snack or drink instantly improves your mood?",
    options: ["Tea", "Coffee", "Hot chocolate", "Bubble tea", "Fresh fruit", "Something salty", "Something sweet", "Cold water", "A cozy meal", "Other..."],
  },
  {
    id: "welcoming-meetup",
    prompt: "What small thing makes a meetup feel welcoming?",
    options: ["Clear plans", "Friendly hello", "Quiet corner", "Easy seating", "Text-first check-in", "Someone saving a spot", "Gentle introductions", "No pressure to talk", "Other..."],
  },
  {
    id: "meetup-warm-up",
    prompt: "What helps you warm up at a meetup?",
    options: ["I prefer listening first", "I may need a few minutes to settle in", "Happy to chat if someone starts", "I enjoy smaller groups", "I like knowing the plan before arriving", "Other..."],
  },
  {
    id: "try-one-day",
    prompt: "What hobby or activity would you love to try one day?",
    options: ["Pottery", "Dancing", "Rock climbing", "Photography", "Board games", "Gardening", "Cooking class", "Language learning", "Kayaking", "Other..."],
  },
  {
    id: "relaxed-places",
    prompt: "What kind of places help you feel relaxed?",
    options: ["Libraries", "Bookshops", "Parks", "Beaches", "Quiet cafes", "Museums", "Walking trails", "Gardens", "Home", "Other..."],
  },
  {
    id: "instant-skill",
    prompt: "If you could instantly learn one skill, what would it be?",
    options: ["Cooking", "Drawing", "Singing", "Another language", "Coding", "Swimming", "Public speaking", "Playing an instrument", "DIY repairs", "Other..."],
  },
];

const personalityPresencePromptById = new Map(personalityPresencePromptOptions.map((option) => [option.id, option]));
const personalityPresencePromptIds = new Set(personalityPresencePromptById.keys());
export const personalityPresencePromptResponseMaxLength = 120;

const truncatePromptResponse = (response: string) => {
  if (response.length <= personalityPresencePromptResponseMaxLength) return response;
  const truncated = response.slice(0, personalityPresencePromptResponseMaxLength);
  return truncated.slice(0, truncated.lastIndexOf(" ")).trim() || truncated.trim();
};

export const normalizePersonalityPresenceChoice = <T extends string>(
  value: T | null | undefined,
  options: readonly T[]
): T | null => (value && options.includes(value) ? value : null);

export const normalizePersonalityPresenceList = <T extends string>(
  value: T[] | null | undefined,
  options: readonly T[]
): T[] => Array.from(new Set((value ?? []).filter((preference): preference is T => options.includes(preference))));

export const normalizePersonalityPresencePromptResponses = (
  value: (PersonalityPresencePromptResponse | { promptId: PersonalityPresencePromptId; response?: string })[] | null | undefined
): PersonalityPresencePromptResponse[] =>
  Array.from(
    (value ?? [])
      .reduce((responses, item) => {
        const prompt = personalityPresencePromptById.get(item.promptId);
        if (!prompt) return responses;

        const legacyResponse = "response" in item ? item.response?.replace(/\s+/g, " ").trim() : "";
        const rawOption = "option" in item ? item.option?.replace(/\s+/g, " ").trim() : "";
        const option = rawOption && prompt.options.includes(rawOption) ? rawOption : legacyResponse || rawOption ? "Other..." : "";
        const customResponse = truncatePromptResponse(
          ("customResponse" in item ? item.customResponse : legacyResponse || (!rawOption || rawOption === "Other..." ? "" : rawOption))?.replace(/\s+/g, " ").trim() ?? ""
        );

        if (option && personalityPresencePromptIds.has(item.promptId)) {
          responses.set(item.promptId, {
            promptId: item.promptId,
            option,
            ...(option === "Other..." && customResponse ? { customResponse } : {}),
          });
        }
        return responses;
      }, new Map<PersonalityPresencePromptId, PersonalityPresencePromptResponse>())
      .values()
  );

export const getPersonalityPresenceSelectedCount = ({
  hair,
  hairCues,
  eyes,
  facialHair,
  style,
  presentation,
  personalStyles,
  accessories,
  grooming,
  voicePresence,
  socialStyles,
  connectionPreferences,
  comfortableAround,
  promptResponses,
}: {
  hair?: PersonalityPresenceHair | null;
  hairCues?: readonly PersonalityPresenceHairCue[];
  eyes?: PersonalityPresenceEyes | null;
  facialHair?: PersonalityPresenceFacialHair | null;
  style?: PersonalityPresenceStyle | null;
  presentation?: PersonalityPresencePresentation | null;
  personalStyles: readonly PersonalityPresencePersonalStyle[];
  accessories?: readonly PersonalityPresenceAccessories[];
  grooming?: readonly PersonalityPresenceGrooming[];
  voicePresence?: readonly PersonalityPresenceVoicePresence[];
  socialStyles: readonly PersonalityPresenceSocialStyle[];
  connectionPreferences: readonly PersonalityPresenceConnectionPreference[];
  comfortableAround: readonly PersonalityPresenceComfortAround[];
  promptResponses?: readonly PersonalityPresencePromptResponse[];
}) =>
  [hair, eyes, facialHair, style, presentation].filter(Boolean).length +
  (hairCues?.length ?? 0) +
  personalStyles.length +
  (accessories?.length ?? 0) +
  (grooming?.length ?? 0) +
  (voicePresence?.length ?? 0) +
  socialStyles.length +
  connectionPreferences.length +
  comfortableAround.length +
  (promptResponses?.length ?? 0);
