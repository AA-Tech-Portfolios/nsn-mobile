import type { NsnComfortMode } from "./app-settings";
import type { SoftRevealPreferences } from "./soft-reveal";

export type DemoPersonaId = "nsn-tester" | "maya-host" | "jordan-member";

export type DemoPersona = {
  id: DemoPersonaId;
  displayName: string;
  role: "Host" | "Member";
  avatarText: string;
  avatarTone: string;
  avatarPrivate: boolean;
  privacyMode: NsnComfortMode;
  trustState: string;
  vibes: string[];
  about?: string;
  sharedInterests: string[];
  comfortNotes: string[];
  photoBoundary: string;
  contactBoundary: string;
  softRevealPreferences: SoftRevealPreferences;
  hiddenDetailNote?: string;
};

export const demoPersonas: Record<DemoPersonaId, DemoPersona> = {
  "nsn-tester": {
    id: "nsn-tester",
    displayName: "NSN Tester",
    role: "Member",
    avatarText: "N",
    avatarTone: "#1590C9",
    avatarPrivate: false,
    privacyMode: "Comfort Mode",
    trustState: "Contact Verified (prototype)",
    vibes: ["Calm", "Thoughtful", "Small groups", "Privacy-conscious"],
    about: "Trying the alpha slowly, with small groups and clear boundaries.",
    sharedInterests: ["Coffee", "Movies", "Walks"],
    comfortNotes: [
      "Text-first planning is fine",
      "Small groups feel easiest",
      "Keeps profile details light",
    ],
    photoBoundary: "Ask before photos.",
    contactBoundary: "Chat in NSN first.",
    softRevealPreferences: {
      suggestionsEnabled: true,
      revealPace: "Gradual reveal",
      preferSoftRevealPeople: false,
    },
  },
  "maya-host": {
    id: "maya-host",
    displayName: "Maya",
    role: "Host",
    avatarText: "M",
    avatarTone: "#174667",
    avatarPrivate: false,
    privacyMode: "Warm Up Mode",
    trustState: "Real Person Verified (prototype)",
    vibes: ["Gentle host", "Cafe plans", "Art nights", "Warm-up pace"],
    about: "Keeps plans gentle, clear, and easy to step into.",
    sharedInterests: ["Coffee", "Movies", "Picnics", "Board games"],
    comfortNotes: [
      "Quiet arrival welcome",
      "Optional chat after",
      "Check in before changing plans",
    ],
    photoBoundary: "Ask before photos; no public posting without consent.",
    contactBoundary: "Keep contact in NSN chat first.",
    softRevealPreferences: {
      suggestionsEnabled: true,
      revealPace: "Comfortable sooner",
      preferSoftRevealPeople: true,
    },
  },
  "jordan-member": {
    id: "jordan-member",
    displayName: "Jordan",
    role: "Member",
    avatarText: "J",
    avatarTone: "#0F5B7C",
    avatarPrivate: true,
    privacyMode: "Comfort Mode",
    trustState: "Contact Verified (prototype)",
    vibes: ["Movies", "Games", "Relaxed chats", "Listening first"],
    sharedInterests: ["Movies", "Board games"],
    comfortNotes: [
      "May observe before joining in",
      "Prefers short planning messages",
      "Comfortable listening first",
    ],
    photoBoundary: "Profile photo hidden; ask before photos.",
    contactBoundary: "No contact sharing outside this chat.",
    softRevealPreferences: {
      suggestionsEnabled: true,
      revealPace: "Manual only",
      preferSoftRevealPeople: false,
    },
    hiddenDetailNote: "Some profile details are private until Jordan chooses to share more.",
  },
};

export const demoPersonaList = Object.values(demoPersonas);

export const getDemoPersona = (personId: string | null | undefined) =>
  personId && personId in demoPersonas ? demoPersonas[personId as DemoPersonaId] : undefined;
