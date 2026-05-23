export type GuidanceSurface = "meetups" | "profile" | "chats";

export type GuidancePreferenceMode = "Minimal" | "Gentle guidance" | "Detailed onboarding";

export type GuideTip = {
  label: string;
  copy: string;
};

export const guidancePreferenceModes: GuidancePreferenceMode[] = [
  "Minimal",
  "Gentle guidance",
  "Detailed onboarding",
];

export const guidesAndTipsBySurface: Record<GuidanceSurface, GuideTip> = {
  meetups: {
    label: "Gentle tip",
    copy: "You do not need to RSVP immediately. Browsing quietly is okay too.",
  },
  profile: {
    label: "Comfort note",
    copy: "Comfort preferences help people understand your social style gently.",
  },
  chats: {
    label: "Quiet chat note",
    copy: "Quiet participation is welcome.",
  },
};

export function getGuideTipForSurface(surface: GuidanceSurface) {
  return guidesAndTipsBySurface[surface];
}
