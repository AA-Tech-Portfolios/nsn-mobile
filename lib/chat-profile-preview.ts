import type { NsnComfortMode } from "@/lib/app-settings";

export type ChatProfilePreview = {
  personId: string;
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
  hiddenDetailNote?: string;
};

const chatProfilePreviews: Record<string, ChatProfilePreview> = {
  "maya-host": {
    personId: "maya-host",
    displayName: "Maya",
    role: "Host",
    avatarText: "M",
    avatarTone: "#174667",
    avatarPrivate: false,
    privacyMode: "Warm Up Mode",
    trustState: "Real Person Verified (prototype)",
    vibes: ["Warm host", "Low-pressure planner", "Coffee first"],
    about: "Keeps plans gentle, clear, and easy to step into.",
    sharedInterests: ["Coffee", "Movies", "Picnics", "Board games"],
    comfortNotes: ["Quiet arrival welcome", "Optional chat after", "Check in before changing plans"],
    photoBoundary: "Ask before photos; no public posting without consent.",
    contactBoundary: "Keep contact in NSN chat first.",
  },
  "james-member": {
    personId: "james-member",
    displayName: "James",
    role: "Member",
    avatarText: "J",
    avatarTone: "#0F5B7C",
    avatarPrivate: true,
    privacyMode: "Comfort Mode",
    trustState: "Contact Verified (prototype)",
    vibes: ["Quiet arrival okay", "Text-first"],
    sharedInterests: ["Movies", "Coffee"],
    comfortNotes: ["May observe before joining in", "Prefers short planning messages"],
    photoBoundary: "Profile photo hidden; ask before photos.",
    contactBoundary: "No contact sharing outside this chat.",
    hiddenDetailNote: "Some profile details are private until James chooses to share more.",
  },
  "alon-member": {
    personId: "alon-member",
    displayName: "Alon",
    role: "Member",
    avatarText: "A",
    avatarTone: "#1590C9",
    avatarPrivate: false,
    privacyMode: "Open Mode",
    trustState: "Real Person Verified (prototype)",
    vibes: ["Good listener", "Small groups"],
    about: "Likes calm chats, movies, and small local plans.",
    sharedInterests: ["Movies", "Coffee", "Walks"],
    comfortNotes: ["Happy with small groups", "Text-first planning is fine"],
    photoBoundary: "Ask before photos.",
    contactBoundary: "Chat in NSN first.",
  },
};

export const getChatProfilePreview = (personId: string | null | undefined) =>
  personId ? chatProfilePreviews[personId] : undefined;
