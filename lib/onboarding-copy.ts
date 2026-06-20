import { calculateAgeFromBirthYear } from "./app-settings";

export const onboardingCopy = {
  welcomeIntro: {
    mobile:
      "NSN is a Sydney North Shore alpha for trying calm, low-pressure meetup ideas. You do not need to prove yourself to belong.",
    desktop:
      "NSN is a Sydney North Shore alpha prototype for trying calm, low-pressure meetup ideas: coffee, walks, movies, dinner, games and small local plans. You do not need to prove yourself to belong.",
  },
  welcomePrivacy: {
    mobile:
      "You can browse quietly, browse first, join at your own pace, or skip setup for testing. You can attend with someone you know and do not need to arrive alone. Small meetups are enough.",
    desktop:
      "You choose what appears in this local prototype. Browse quietly, browse first, join at your own pace, and warm up gradually. You can attend with someone you know and do not need to arrive alone. Small meetups are enough.",
  },
  preferredAgeRangeHint: "NSN starts at 18+ and keeps age ranges realistic for this adult local alpha.",
  preferredAgeRangePreferenceHelper:
    "Preferred age range helps us suggest meetups and people you may feel comfortable connecting with. It is a preference, not a strict requirement.",
  showPreferredAgeRange: "Show the adult age range you prefer in your profile preview.",
  skipButton: {
    accessibilityHint: "Uses a private local tester profile so you can explore the alpha prototype.",
    copy: "Alpha tester shortcut. You can finish profile setup later from Profile.",
  },
} as const;

export function formatBirthYearAgePreview(
  birthYear: number | null | undefined,
  referenceDate = new Date(),
) {
  const age = calculateAgeFromBirthYear(birthYear, referenceDate);
  return age === null ? "" : `Age: ${age}`;
}
