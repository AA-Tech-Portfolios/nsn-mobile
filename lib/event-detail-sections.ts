import type { IconSymbolName } from "@/components/ui/icon-symbol-map";

export type EventDetailSectionId =
  | "whatToExpect"
  | "comfortPacing"
  | "optionalConversation"
  | "arrival"
  | "safetyBoundaries";

export type EventDetailSectionPlan = {
  id: EventDetailSectionId;
  title: string;
  summary: string;
  iconName: IconSymbolName;
  initiallyExpanded: boolean;
};

export const eventDetailSectionPlan: EventDetailSectionPlan[] = [
  {
    id: "whatToExpect",
    title: "What to expect",
    summary: "The social feel, pace, and how much participation is optional.",
    iconName: "experience",
    initiallyExpanded: true,
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
    title: "Arrival",
    summary: "Meeting point, weather, transport, and accessibility basics.",
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
    title: "Community guidelines",
    summary: "Consent reminders, soft exits, and prototype limits.",
    iconName: "shield",
    initiallyExpanded: false,
  },
];

export const initialExpandedEventDetailSections = eventDetailSectionPlan
  .filter((section) => section.initiallyExpanded)
  .map((section) => section.id);
