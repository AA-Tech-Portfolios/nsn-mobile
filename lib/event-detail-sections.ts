import type { IconSymbolName } from "@/components/ui/icon-symbol-map";

export type EventDetailSectionId = "whatToExpect" | "comfortPacing" | "optionalConversation" | "arrival" | "safetyBoundaries";

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
    summary: "The plan, sound level, weather, and practical basics in one place.",
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
    summary: "Where to meet and how to clarify the exact spot.",
    iconName: "location",
    initiallyExpanded: false,
  },
  {
    id: "comfortPacing",
    title: "Comfort & pacing",
    summary: "Ways to arrive, participate, pause, and be around photos.",
    iconName: "low-pressure",
    initiallyExpanded: true,
  },
  {
    id: "safetyBoundaries",
    title: "Safety & boundaries",
    summary: "Soft exits, consent reminders, and prototype limits.",
    iconName: "shield",
    initiallyExpanded: false,
  },
];

export const initialExpandedEventDetailSections = eventDetailSectionPlan
  .filter((section) => section.initiallyExpanded)
  .map((section) => section.id);

export const getEventDetailQuickJumpItems = () =>
  eventDetailSectionPlan.map(({ id, title, iconName }) => ({ section: id, label: title, iconName }));
