import type { IconSymbolName } from "@/components/ui/icon-symbol-map";

export type MeetupReadinessItem = {
  id: "expect" | "meeting-point" | "host-note" | "plan" | "comfort" | "backup" | "exit";
  title: string;
  copy: string;
  iconName: IconSymbolName;
};

export type MeetupOptOutAction = {
  id: "leave" | "not-right-fit" | "change-group" | "calmer-option" | "hide" | "maybe-later";
  label: string;
  copy: string;
  result: string;
  iconName: IconSymbolName;
};

export type MeetupTutorialCard = {
  id: "privacy" | "visibility-preview" | "comfort-modes" | "meetup-readiness" | "soft-exit";
  title: string;
  copy: string;
  actionLabel: string;
  surface: "Profile" | "Settings" | "Meetups" | "Event details" | "Alpha walkthrough";
  iconName: IconSymbolName;
};

export const meetupReadinessItems: MeetupReadinessItem[] = [
  {
    id: "expect",
    title: "What to expect",
    copy: "A small, low-pressure meetup. It is okay to arrive quietly and warm up slowly.",
    iconName: "experience",
  },
  {
    id: "meeting-point",
    title: "Meeting point",
    copy: "Check the venue and broad meeting point before leaving. Exact live tracking is not connected.",
    iconName: "location",
  },
  {
    id: "host-note",
    title: "Host or organiser note",
    copy: "Look for simple organiser context, such as where the group may wait or how the plan should feel.",
    iconName: "group",
  },
  {
    id: "plan",
    title: "Practical plan",
    copy: "Bring what helps: water, charger, headphones for travel, or a simple route home.",
    iconName: "transport",
  },
  {
    id: "comfort",
    title: "Comfort reminder",
    copy: "Keep your privacy and pace. Photos, personal details, and conversation can stay optional.",
    iconName: "shield",
  },
  {
    id: "backup",
    title: "Backup plan",
    copy: "Have a quieter nearby option or a simple way home in mind if the plan does not suit the day.",
    iconName: "weather",
  },
  {
    id: "exit",
    title: "Leaving early",
    copy: "You can step out or leave early without explaining. This is prototype guidance only - no live safety, host tracking, or emergency support is connected.",
    iconName: "pace",
  },
];

export const meetupOptOutActions: MeetupOptOutAction[] = [
  {
    id: "leave",
    label: "Leave this meetup",
    copy: "Step away from this local plan preview without a public explanation.",
    result: "Marked locally as left. No public explanation is posted.",
    iconName: "pace",
  },
  {
    id: "not-right-fit",
    label: "Not the right fit",
    copy: "Use this when the activity, group size, or timing does not feel right today.",
    result: "Marked locally as not the right fit for now. No guilt, no public reason.",
    iconName: "low-pressure",
  },
  {
    id: "change-group",
    label: "Change group",
    copy: "Use this when a smaller, quieter, or different group shape would feel better.",
    result: "Saved locally as wanting a different group fit. No public explanation is shared.",
    iconName: "group",
  },
  {
    id: "calmer-option",
    label: "Find a calmer option",
    copy: "Keep this as a private preference signal and browse for a quieter plan.",
    result: "Saved locally as looking for a calmer option. No recommendation system is connected.",
    iconName: "volume.off",
  },
  {
    id: "hide",
    label: "Hide this event",
    copy: "Hide this card from your local prototype view if it keeps getting in the way.",
    result: "Hidden locally on this device. You can show it again from event options.",
    iconName: "visibility.off",
  },
  {
    id: "maybe-later",
    label: "Maybe another time",
    copy: "Keep the door open without joining or explaining.",
    result: "Saved locally as deciding later. You can revisit when it feels easier.",
    iconName: "calendar",
  },
];

export const meetupTutorialCards: MeetupTutorialCard[] = [
  {
    id: "privacy",
    title: "Privacy basics",
    copy: "Profile details can stay limited. Local prototype controls show intended privacy pacing without connecting real account systems.",
    actionLabel: "Review privacy",
    surface: "Profile",
    iconName: "shield",
  },
  {
    id: "visibility-preview",
    title: "Visibility preview",
    copy: "Use the preview to see what a calmer profile might reveal, blur, or keep hidden before opening up more.",
    actionLabel: "Try preview",
    surface: "Profile",
    iconName: "visibility",
  },
  {
    id: "comfort-modes",
    title: "Comfort modes",
    copy: "Comfort Mode, Warm Up Mode, and Open Mode are local prototype settings for pacing visibility.",
    actionLabel: "Compare modes",
    surface: "Settings",
    iconName: "sliders",
  },
  {
    id: "meetup-readiness",
    title: "RSVP and readiness",
    copy: "RSVP states and readiness notes are local only. They help testers inspect the flow without reserving a real spot.",
    actionLabel: "Open readiness",
    surface: "Event details",
    iconName: "calendar",
  },
  {
    id: "soft-exit",
    title: "Soft exits",
    copy: "You can skip, leave, hide, or choose maybe later. The prototype keeps these changes on this device and does not post a reason.",
    actionLabel: "See exit options",
    surface: "Meetups",
    iconName: "pace",
  },
];
