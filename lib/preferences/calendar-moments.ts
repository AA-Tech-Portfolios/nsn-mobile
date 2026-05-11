export type CalendarMomentGroupId = "australianLocal" | "culturalReligious" | "personal";

export type CalendarMomentState =
  | "Celebrate"
  | "Observe"
  | "Interested"
  | "Prefer quiet plans"
  | "Not relevant to me"
  | "Prefer not to say";

export type CalendarMomentVisibility =
  | "Private"
  | "Matched/shared visibility only"
  | "Visible on profile preview"
  | "Prefer not to say";

export type CalendarMomentPreference = {
  id: string;
  label: string;
  group: CalendarMomentGroupId;
  icon?: string;
  copy: string;
  aliases?: string[];
};

export type CalendarMomentGroup = {
  id: CalendarMomentGroupId;
  title: string;
  icon: string;
  copy: string;
  defaultOpen?: boolean;
  defaultVisible?: number;
};

export type CalendarMomentStates = Record<string, CalendarMomentState>;

export type CustomCalendarMoment = {
  id: string;
  label: string;
  state: CalendarMomentState;
  createdAt: string;
};

export const calendarMomentStateOptions: Array<{ value: CalendarMomentState; icon: string; copy: string }> = [
  { value: "Celebrate", icon: "🎉", copy: "This is something I celebrate or enjoy joining." },
  { value: "Observe", icon: "🕯️", copy: "This matters to me as an observance or meaningful time." },
  { value: "Interested", icon: "🌏", copy: "I am interested in related events or learning more." },
  { value: "Prefer quiet plans", icon: "🌙", copy: "Keep plans gentle or quieter around this time." },
  { value: "Not relevant to me", icon: "—", copy: "This is not relevant for my meetup suggestions." },
  { value: "Prefer not to say", icon: "🔒", copy: "Keep this private and unspecified." },
];

export const calendarMomentVisibilityOptions: CalendarMomentVisibility[] = [
  "Private",
  "Matched/shared visibility only",
  "Visible on profile preview",
  "Prefer not to say",
];

export const defaultCalendarMomentVisibility: CalendarMomentVisibility = "Private";
export const defaultCalendarMomentStates: CalendarMomentStates = {};
export const defaultCustomCalendarMoments: CustomCalendarMoment[] = [];

export const calendarMomentGroups: CalendarMomentGroup[] = [
  {
    id: "australianLocal",
    title: "Australian & local",
    icon: "🇦🇺",
    copy: "Australian holidays, Sydney moments, school breaks, and local North Shore-friendly planning signals.",
    defaultOpen: true,
    defaultVisible: 7,
  },
  {
    id: "culturalReligious",
    title: "Cultural & religious",
    icon: "🌏",
    copy: "Optional cultural, religious, and community moments that may shape comfortable plans.",
    defaultOpen: true,
    defaultVisible: 7,
  },
  {
    id: "personal",
    title: "Personal moments",
    icon: "🎂",
    copy: "Broad personal calendar seasons that can affect social energy and planning.",
    defaultOpen: true,
    defaultVisible: 7,
  },
];

export const calendarMomentPreferences: CalendarMomentPreference[] = [
  { id: "anzac-day", label: "ANZAC Day", group: "australianLocal", icon: "🇦🇺", copy: "A national day of remembrance.", aliases: ["australia", "remembrance", "public holiday"] },
  { id: "easter-long-weekend", label: "Easter long weekend", group: "australianLocal", icon: "🐣", copy: "Long weekend planning, travel, and quieter catchups.", aliases: ["easter", "long weekend", "holiday"] },
  { id: "kings-birthday", label: "King's Birthday", group: "australianLocal", icon: "🇦🇺", copy: "Public holiday timing and local plans.", aliases: ["public holiday", "long weekend"] },
  { id: "labour-day", label: "Labour Day", group: "australianLocal", icon: "🇦🇺", copy: "Public holiday timing and low-pressure plans.", aliases: ["labor day", "public holiday", "long weekend"] },
  { id: "christmas-boxing-day", label: "Christmas / Boxing Day", group: "australianLocal", icon: "🎄", copy: "Busy family season, quiet plans, or festive events.", aliases: ["christmas", "boxing day", "holiday", "quiet"] },
  { id: "new-years-eve", label: "New Year's Eve", group: "australianLocal", icon: "🎆", copy: "Celebrations, low-key alternatives, or quiet-night preferences.", aliases: ["new year", "nye", "fireworks", "quiet"] },
  { id: "school-holidays", label: "School holidays", group: "australianLocal", icon: "📚", copy: "Busier venues, family schedules, and local activity timing.", aliases: ["school break", "term break", "busy", "quiet"] },
  { id: "vivid-sydney", label: "Vivid Sydney", group: "australianLocal", icon: "💡", copy: "Sydney light festival ideas or crowd-aware planning.", aliases: ["vivid", "festival", "lights", "sydney"] },
  { id: "sydney-festival", label: "Sydney Festival", group: "australianLocal", icon: "🎭", copy: "Arts and festival ideas around Sydney.", aliases: ["festival", "arts", "sydney"] },
  { id: "mardi-gras", label: "Mardi Gras", group: "australianLocal", icon: "🌈", copy: "Community events, celebration, or quieter alternatives.", aliases: ["pride", "festival", "lgbtqia", "sydney"] },
  { id: "naidoc-week", label: "NAIDOC Week", group: "australianLocal", icon: "🇦🇺", copy: "Community learning, cultural respect, and local events.", aliases: ["first nations", "indigenous", "cultural", "community"] },
  { id: "local-markets-festivals", label: "Local markets/festivals", group: "australianLocal", icon: "🧺", copy: "North Shore markets, fairs, local festivals, and gentle outings.", aliases: ["market", "markets", "festival", "north shore", "local"] },
  { id: "lunar-new-year", label: "Lunar New Year", group: "culturalReligious", icon: "🧧", copy: "Cultural celebration, food, family, and community events.", aliases: ["chinese new year", "seollal", "tet", "cultural", "festival"] },
  { id: "diwali", label: "Diwali", group: "culturalReligious", icon: "🪔", copy: "Festival of lights and community celebration.", aliases: ["deepavali", "festival", "lights", "religious", "cultural"] },
  { id: "eid", label: "Eid", group: "culturalReligious", icon: "🌙", copy: "Observance, celebration, and family/community time.", aliases: ["eid al fitr", "eid al adha", "religious", "muslim"] },
  { id: "ramadan", label: "Ramadan", group: "culturalReligious", icon: "🌙", copy: "Observance period where timing, food, and alcohol-free plans may matter.", aliases: ["fasting", "iftar", "religious", "muslim", "alcohol-free"] },
  { id: "hanukkah", label: "Hanukkah", group: "culturalReligious", icon: "🕯️", copy: "Observance, family time, and community events.", aliases: ["chanukah", "jewish", "religious", "lights"] },
  { id: "passover", label: "Passover", group: "culturalReligious", icon: "🕯️", copy: "Observance, family time, and food considerations.", aliases: ["pesach", "jewish", "religious", "food"] },
  { id: "orthodox-easter", label: "Orthodox Easter", group: "culturalReligious", icon: "🕯️", copy: "Observance, celebration, and family/community time.", aliases: ["easter", "religious", "orthodox"] },
  { id: "holi", label: "Holi", group: "culturalReligious", icon: "🎨", copy: "Festival celebration and community events.", aliases: ["festival", "colours", "colors", "cultural"] },
  { id: "vesak", label: "Vesak", group: "culturalReligious", icon: "🕯️", copy: "Observance, reflection, and community time.", aliases: ["buddhist", "religious", "observance"] },
  { id: "moon-festival", label: "Moon Festival", group: "culturalReligious", icon: "🥮", copy: "Cultural celebration and community food events.", aliases: ["mid-autumn", "mid autumn", "cultural", "festival"] },
  { id: "halloween", label: "Halloween", group: "culturalReligious", icon: "🎃", copy: "Seasonal events, costume nights, or quiet alternatives.", aliases: ["costume", "seasonal", "party", "quiet"] },
  { id: "valentines-day", label: "Valentine's Day", group: "culturalReligious", icon: "💐", copy: "Can be relevant for social pressure, dating context, or quiet plans.", aliases: ["valentine", "dating", "quiet", "romance"] },
  { id: "birthday-month", label: "Birthday month", group: "personal", icon: "🎂", copy: "Birthday season, gentle celebration, or low-key planning.", aliases: ["birthday", "celebrate", "personal"] },
  { id: "anniversary", label: "Anniversary", group: "personal", icon: "📅", copy: "A meaningful personal date or season.", aliases: ["personal", "date", "memory"] },
  { id: "exam-season", label: "Exam season", group: "personal", icon: "📚", copy: "A busy or stressful time where quieter plans may help.", aliases: ["exams", "study", "quiet", "school", "uni"] },
  { id: "uni-break", label: "Uni break", group: "personal", icon: "🎓", copy: "University break timing and more flexible plans.", aliases: ["university", "student", "break", "holiday"] },
  { id: "work-busy-season", label: "Work busy season", group: "personal", icon: "💼", copy: "A work-heavy period where simple plans may be easier.", aliases: ["work", "busy", "quiet", "schedule"] },
  { id: "prefer-quiet-plans-during-this-time", label: "Prefer quiet plans during this time", group: "personal", icon: "🌙", copy: "Gentle signal for lower-pressure plans around busy or sensitive seasons.", aliases: ["quiet", "low pressure", "busy", "sensitive"] },
  { id: "open-to-cultural-events", label: "Open to cultural events", group: "personal", icon: "🌏", copy: "Open to cultural festivals, learning, food, and community events.", aliases: ["cultural", "festival", "learning", "community"] },
];

const calendarMomentIds = new Set(calendarMomentPreferences.map((moment) => moment.id));
const calendarMomentStateValues = new Set(calendarMomentStateOptions.map((option) => option.value));
const calendarMomentVisibilityValues = new Set(calendarMomentVisibilityOptions);

export const normalizeCalendarMomentStates = (states?: CalendarMomentStates | null): CalendarMomentStates => {
  if (!states) return defaultCalendarMomentStates;

  return Object.entries(states).reduce<CalendarMomentStates>((nextStates, [id, state]) => {
    if (calendarMomentIds.has(id) && calendarMomentStateValues.has(state)) {
      nextStates[id] = state;
    }

    return nextStates;
  }, {});
};

export const normalizeCalendarMomentVisibility = (visibility?: CalendarMomentVisibility | null): CalendarMomentVisibility =>
  visibility && calendarMomentVisibilityValues.has(visibility) ? visibility : defaultCalendarMomentVisibility;

export const normalizeCustomCalendarMoments = (moments?: CustomCalendarMoment[] | null): CustomCalendarMoment[] => {
  if (!moments) return defaultCustomCalendarMoments;

  return moments
    .map((moment) => ({
      id: typeof moment.id === "string" && moment.id.trim() ? moment.id : `custom-${Date.now()}`,
      label: typeof moment.label === "string" ? moment.label.trim().slice(0, 80) : "",
      state: calendarMomentStateValues.has(moment.state) ? moment.state : "Interested",
      createdAt: typeof moment.createdAt === "string" && moment.createdAt ? moment.createdAt : new Date().toISOString(),
    }))
    .filter((moment) => moment.label);
};

const normalizeSearch = (value: string) => value.trim().toLowerCase();

export const searchCalendarMoments = (query: string, customMoments: CustomCalendarMoment[] = []) => {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return [];

  const groupById = new Map(calendarMomentGroups.map((group) => [group.id, group]));
  const builtInResults = calendarMomentPreferences.filter((moment) => {
    const group = groupById.get(moment.group);
    const haystack = [
      moment.label,
      moment.copy,
      group?.title,
      group?.copy,
      ...(moment.aliases ?? []),
      ...calendarMomentStateOptions.map((option) => `${option.value} ${option.copy}`),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  const customResults = customMoments
    .filter((moment) => `${moment.label} ${moment.state} custom personal`.toLowerCase().includes(normalizedQuery))
    .map<CalendarMomentPreference>((moment) => ({
      id: moment.id,
      label: moment.label,
      group: "personal",
      icon: "✨",
      copy: "Custom calendar moment saved locally in this prototype.",
      aliases: ["custom", "personal"],
    }));

  return [...builtInResults, ...customResults];
};

export const getCalendarMomentGroupOptions = (groupId: CalendarMomentGroupId) =>
  calendarMomentPreferences.filter((moment) => moment.group === groupId);

export const getSelectedCalendarMomentLabels = (
  states: CalendarMomentStates,
  customMoments: CustomCalendarMoment[] = [],
  limit = 8
) => {
  const labels = calendarMomentPreferences
    .filter((moment) => states[moment.id])
    .map((moment) => `${moment.label}: ${states[moment.id]}`);

  const customLabels = customMoments.map((moment) => `${moment.label}: ${moment.state}`);

  return [...labels, ...customLabels].slice(0, limit);
};
