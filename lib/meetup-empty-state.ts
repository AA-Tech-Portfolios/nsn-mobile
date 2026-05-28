export type MeetupEmptyStateReason = "filtered" | "search" | "no-active-events";
export type MeetupEmptyStateMode = "day" | "night";

export type MeetupEmptyStateCopy = {
  title: string;
  copy: string;
  suggestion: string;
};

export function getMeetupEmptyStateCopy({
  hour,
  mode,
  reason,
}: {
  hour: number;
  mode: MeetupEmptyStateMode;
  reason: MeetupEmptyStateReason;
}): MeetupEmptyStateCopy {
  if (reason === "search") {
    return {
      title: "No matching meetup in the alpha yet",
      copy: "Try another suburb, activity, or a broader phrase. The local prototype is still growing.",
      suggestion: "Nothing has been hidden from you; there just may not be a matching demo meetup yet.",
    };
  }

  if (reason === "filtered") {
    return {
      title: "Nothing matching those filters yet",
      copy: "There may still be gentle options nearby. Try widening the filters or switching the layout density.",
      suggestion: "NSN is still a small Sydney/North Shore alpha community.",
    };
  }

  if (hour < 5) {
    return {
      title: "Quiet hours right now",
      copy: "NSN is taking the night softly. More local meetup ideas may appear later today.",
      suggestion: "This Sydney/North Shore alpha is still small and local.",
    };
  }

  if (hour < 8) {
    return {
      title: "Early morning calm",
      copy: "No active meetups are showing yet. The day can start slowly here.",
      suggestion: "More local meetup ideas may appear later today.",
    };
  }

  if (hour >= 21) {
    return {
      title: "Evening winding down",
      copy: "Nothing nearby is active in this prototype view right now.",
      suggestion: "Try the day view later, or adjust filters if you are browsing ahead.",
    };
  }

  if (mode === "night") {
    return {
      title: "Quiet evening tonight",
      copy: "Nothing nearby is active right now. More local meetups may appear later.",
      suggestion: "NSN is still a small Sydney/North Shore alpha community.",
    };
  }

  return {
    title: "No active events right now",
    copy: "Nothing nearby is showing in this prototype view at the moment.",
    suggestion: "Try adjusting filters or layout density, or check back later today.",
  };
}
