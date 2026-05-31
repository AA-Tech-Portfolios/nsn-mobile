import type { NsnComfortMode } from "@/lib/app-settings";
import { getSoftRevealIndicator, type SoftRevealPreferences } from "./soft-reveal";
import { demoPersonas } from "./demo-personas";

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
  softRevealPreferences: SoftRevealPreferences;
  softRevealIndicator: string;
  hiddenDetailNote?: string;
};

const toChatProfilePreview = (personId: keyof typeof demoPersonas): ChatProfilePreview => {
  const persona = demoPersonas[personId];

  return {
    personId: persona.id,
    displayName: persona.displayName,
    role: persona.role,
    avatarText: persona.avatarText,
    avatarTone: persona.avatarTone,
    avatarPrivate: persona.avatarPrivate,
    privacyMode: persona.privacyMode,
    trustState: persona.trustState,
    vibes: persona.vibes,
    about: persona.about,
    sharedInterests: persona.sharedInterests,
    comfortNotes: persona.comfortNotes,
    photoBoundary: persona.photoBoundary,
    contactBoundary: persona.contactBoundary,
    softRevealPreferences: persona.softRevealPreferences,
    softRevealIndicator: getSoftRevealIndicator(persona.softRevealPreferences),
    hiddenDetailNote: persona.hiddenDetailNote,
  };
};

const chatProfilePreviews: Record<string, ChatProfilePreview> = {
  "nsn-tester": toChatProfilePreview("nsn-tester"),
  "maya-host": toChatProfilePreview("maya-host"),
  "jordan-member": toChatProfilePreview("jordan-member"),
};

export const getChatProfilePreview = (personId: string | null | undefined) =>
  personId ? chatProfilePreviews[personId] : undefined;
