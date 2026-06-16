import type { IconSymbolName } from "@/components/ui/icon-symbol-map";

export type EventDetailSectionId =
  | "whatToExpect"
  | "comfortPacing"
  | "optionalConversation"
  | "arrival"
  | "safetyBoundaries";

export type EventDetailViewMode = "essential" | "detailed" | "onTheWay";
export type EventDetailSupportBlockId = "planningTools" | "rsvp";

export type EventDetailSectionPlan = {
  id: EventDetailSectionId;
  title: string;
  summary: string;
  iconName: IconSymbolName;
  initiallyExpanded: boolean;
};

export type EventDetailViewModePlan = {
  id: EventDetailViewMode;
  label: string;
  helper: string;
  defaultMode?: boolean;
};

export const eventDetailSectionPlan: EventDetailSectionPlan[] = [
  {
    id: "whatToExpect",
    title: "What to expect",
    summary: "The social feel, first few minutes, and how optional chat can stay.",
    iconName: "experience",
    initiallyExpanded: false,
  },
  {
    id: "optionalConversation",
    title: "Optional conversation",
    summary: "Gentle prompts and clarity questions only if they help.",
    iconName: "message",
    initiallyExpanded: false,
  },
  {
    id: "arrival",
    title: "Finding the group",
    summary: "Where to go first, what landmark to look for, and how to join at your pace.",
    iconName: "location",
    initiallyExpanded: false,
  },
  {
    id: "comfortPacing",
    title: "Comfort & pacing",
    summary: "Ways to arrive, participate, pause, and be around photos.",
    iconName: "low-pressure",
    initiallyExpanded: false,
  },
  {
    id: "safetyBoundaries",
    title: "Keeping things comfortable",
    summary:
      "Ask first, respect boundaries, leave anytime, and remember this is still a prototype.",
    iconName: "shield",
    initiallyExpanded: false,
  },
];

export const initialExpandedEventDetailSections = eventDetailSectionPlan
  .filter((section) => section.initiallyExpanded)
  .map((section) => section.id);

const initialExpandedSectionsByMode: Record<EventDetailViewMode, EventDetailSectionId[]> = {
  essential: [],
  detailed: [],
  onTheWay: [],
};

export const eventDetailViewModes: EventDetailViewModePlan[] = [
  {
    id: "essential",
    label: "Essential",
    helper: "Quick, warm overview",
    defaultMode: true,
  },
  {
    id: "detailed",
    label: "Detailed",
    helper: "Full event notes",
  },
  {
    id: "onTheWay",
    label: "On the way",
    helper: "Find the group fast",
  },
];

const visibleSectionsByMode: Record<EventDetailViewMode, EventDetailSectionId[]> = {
  essential: ["whatToExpect", "arrival"],
  detailed: eventDetailSectionPlan.map((section) => section.id),
  onTheWay: ["arrival"],
};

const supportBlockOrderByMode: Record<EventDetailViewMode, EventDetailSupportBlockId[]> = {
  essential: ["planningTools", "rsvp"],
  detailed: ["planningTools", "rsvp"],
  onTheWay: ["rsvp"],
};

export const getVisibleEventDetailSections = (mode: EventDetailViewMode): EventDetailSectionId[] =>
  visibleSectionsByMode[mode];

export const getInitialExpandedEventDetailSections = (
  mode: EventDetailViewMode,
): EventDetailSectionId[] => initialExpandedSectionsByMode[mode];

export const getEventDetailSupportBlockOrder = (
  mode: EventDetailViewMode,
): EventDetailSupportBlockId[] => supportBlockOrderByMode[mode];
