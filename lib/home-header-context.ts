export function getLocalGreetingPeriod(hour: number) {
  const normalizedHour = ((Math.floor(hour) % 24) + 24) % 24;

  if (normalizedHour >= 5 && normalizedHour < 12) return "morning";
  if (normalizedHour >= 12 && normalizedHour < 17) return "afternoon";
  if (normalizedHour >= 17 && normalizedHour < 24) return "evening";
  return "night";
}

export function getHomeTodayContextLabel(hour: number) {
  const period = getLocalGreetingPeriod(hour);

  if (period === "morning") return "Morning local meetup window";
  if (period === "afternoon") return "Afternoon local context";
  if (period === "evening") return "Evening-friendly meetup window";

  return "Quiet overnight local context";
}
