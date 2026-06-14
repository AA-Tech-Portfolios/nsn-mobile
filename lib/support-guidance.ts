export type SupportGuidanceId = "slow-start" | "calmer-meetups" | "gentle-friendships" | "gentle-dating";

export type SupportGuidanceIcon = "shield" | "group" | "heart";

export type SupportGuidanceSection = {
  title: string;
  copy: string;
};

export type SupportGuidanceAction = {
  label: string;
  route: "comfort" | "contact" | "interests" | "help" | "coming-later";
};

export type SupportGuidance = {
  id: SupportGuidanceId;
  icon: SupportGuidanceIcon;
  title: string;
  eyebrow: string;
  copy: string;
  points: string[];
  detailIntro: string;
  details: SupportGuidanceSection[];
  actions: SupportGuidanceAction[];
  footerNote?: string;
};

export const supportGuidanceItems: SupportGuidance[] = [
  {
    id: "slow-start",
    icon: "shield",
    eyebrow: "Guidance only",
    title: "First steps when you feel unsure",
    copy: "You do not need to disclose why a meetup feels hard, and you can keep your support needs private.",
    points: [
      "It is okay to join slowly.",
      "It is okay to observe first.",
      "It is okay to skip, leave, or try again later.",
      "You do not need to perform socially to belong.",
    ],
    detailIntro: "A first step can be small. You can look around, save an event, change your mind, or try a quieter plan later.",
    details: [
      {
        title: "Start with the smallest useful step",
        copy: "Browsing events, checking the venue, or reading chat expectations can count as progress. You do not have to join immediately.",
      },
      {
        title: "Keep your privacy intact",
        copy: "Use private or warm-up visibility, keep your profile photo blurred, and share only broad details that feel comfortable.",
      },
      {
        title: "Leaving is allowed",
        copy: "Skipping, stepping outside, leaving early, or trying again another week should stay normal and low-pressure.",
      },
    ],
    actions: [
      { label: "Review comfort settings", route: "comfort" },
      { label: "Review contact preferences", route: "contact" },
      { label: "Contact developers", route: "help" },
    ],
    footerNote:
      "NSN is not mental health care, therapy, crisis support, or emergency support. If you are in immediate danger or need urgent help, contact local emergency or crisis services.",
  },
  {
    id: "calmer-meetups",
    icon: "group",
    eyebrow: "Local prototype",
    title: "Choosing a calmer first meetup",
    copy: "Optional ideas for people who like more predictability, quiet, or familiarity before joining groups.",
    points: [
      "Choose small groups first.",
      "Pick quiet venues where possible.",
      "Arrive with a guide or buddy if that becomes available.",
      "Use low-message mode if chat feels draining.",
      "Use deciding later or need encouragement RSVP states when available.",
      "Tell the host if calm introductions would help.",
      "Choose alcohol-free or low-noise meetups where helpful.",
    ],
    detailIntro: "Calmer meetups are about reducing pressure, not proving that you are ready for every kind of social plan.",
    details: [
      {
        title: "Look for comfort signals",
        copy: "Small group, low-noise, alcohol-free, indoor backup, and no-filming labels can help you choose plans with fewer surprises.",
      },
      {
        title: "Use softer contact settings",
        copy: "Low-message mode, details-only updates, and slower reply expectations can make planning feel more manageable.",
      },
      {
        title: "Ask for simple introductions",
        copy: "Where hosts support it, a calm hello, a clear meeting point, and a low-pressure way to join the group can help first-time attendees settle in.",
      },
    ],
    actions: [
      { label: "Set group size preferences", route: "comfort" },
      { label: "Set contact preferences", route: "contact" },
      { label: "Buddy/guide mode - coming later", route: "coming-later" },
    ],
  },
  {
    id: "gentle-friendships",
    icon: "group",
    eyebrow: "Learn more",
    title: "Gentle friendships",
    copy: "Friendship can start small. NSN should make room for steady, low-pressure connection without needing to perform.",
    points: [
      "Friendships can build slowly.",
      "Small repeated interactions matter.",
      "Quiet people still belong.",
      "It is okay to reconnect after silence.",
      "Not every meetup has to become a deep friendship.",
      "Shared comfort and consistency matter more than performance.",
    ],
    detailIntro: "Friendship does not have to arrive as a big moment. Sometimes it grows through familiarity and repeated ease.",
    details: [
      {
        title: "Let familiarity do some of the work",
        copy: "Seeing the same people at small events, sharing one topic, or saying hello again later can be enough.",
      },
      {
        title: "Keep expectations light",
        copy: "A pleasant chat can stay a pleasant chat. A meetup does not have to become a close friendship to be worthwhile.",
      },
      {
        title: "Reconnect without over-explaining",
        copy: "Silence happens. A simple hello or another shared event can be a gentle way back in.",
      },
    ],
    actions: [
      { label: "Review hobbies and interests", route: "interests" },
      { label: "Contact developers", route: "help" },
    ],
  },
  {
    id: "gentle-dating",
    icon: "heart",
    eyebrow: "Optional guidance",
    title: "Gentle dating",
    copy: "Dating can stay optional and consent-first here. NSN is not a dating app, and connection should never feel rushed.",
    points: [
      "Dating does not need to move quickly.",
      "It is okay to start as friends.",
      "Mutual comfort matters more than pressure.",
      "Respect hesitation and pacing differences.",
      "Attraction can grow gradually.",
      "No one owes immediate openness, affection, or commitment.",
      "Rejection should remain respectful and safe.",
      "It is okay to leave or step back kindly.",
    ],
    detailIntro: "This guidance is for keeping optional romantic interest respectful, slow, and consent-first without turning NSN into a dating app.",
    details: [
      {
        title: "Start with mutual comfort",
        copy: "A friendly pace is valid. No one has to be immediately open, affectionate, or certain.",
      },
      {
        title: "Respect pacing differences",
        copy: "Hesitation, taking time, or preferring group settings should be treated as normal, not as a challenge to overcome.",
      },
      {
        title: "Keep rejection safe",
        copy: "A no, a pause, or a change of mind should be accepted without pressure, punishment, or repeated asking.",
      },
    ],
    actions: [
      { label: "Review contact preferences", route: "contact" },
      { label: "Review comfort settings", route: "comfort" },
    ],
    footerNote: "No matching scores, attractiveness rankings, compatibility percentages, or swiping are used here.",
  },
];

export const supportBelongingGuidance = supportGuidanceItems.filter((item) =>
  item.id === "slow-start" || item.id === "calmer-meetups"
);

export const gentleConnectionGuidance = supportGuidanceItems.filter((item) =>
  item.id === "gentle-friendships" || item.id === "gentle-dating"
);

export function getSupportGuidanceById(id?: string | string[]) {
  const guideId = Array.isArray(id) ? id[0] : id;
  return supportGuidanceItems.find((item) => item.id === guideId) ?? supportGuidanceItems[0];
}
