import { meaningfulMemorySection } from "./connection-first-profile";

export const profileHomeSectionOrder = [
  "avatarPhoto",
  "name",
  "myVibes",
  "aboutMe",
  "meaningfulMemories",
  "verificationTrust",
  "profileShortcuts",
  "localArea",
  "interests",
  "comfortTrust",
  "privacy",
  "profileVisibilityPreview",
] as const;

export type ProfileHomeSectionId = (typeof profileHomeSectionOrder)[number];
export type ProfileManagementSectionId = "comfortTrustDetails" | "workStudyLifeContext" | "readinessPreviewDetails";
export type MainProfileSummaryRowId =
  | "meaningfulMemories"
  | "localArea"
  | "interests"
  | "comfortTrust"
  | "privacy"
  | "verificationTrust";

export type MainProfileSummaryRow = {
  id: MainProfileSummaryRowId;
  icon: "experience" | "location" | "interests" | "shield" | "settings" | "badge";
  title: string;
  description: string;
};

export const mainProfileSummaryRows: readonly MainProfileSummaryRow[] = [
  {
    id: "meaningfulMemories",
    icon: "experience",
    title: meaningfulMemorySection.titleOptions[0],
    description: meaningfulMemorySection.description,
  },
  {
    id: "localArea",
    icon: "location",
    title: "Local Area",
    description: "Broad area used for local plans.",
  },
  {
    id: "interests",
    icon: "interests",
    title: "Interests",
    description: "What you enjoy for easier meetup ideas.",
  },
  {
    id: "comfortTrust",
    icon: "shield",
    title: "Privacy & Comfort",
    description: "Pace, privacy, and low-pressure meeting comfort.",
  },
  {
    id: "privacy",
    icon: "settings",
    title: "Privacy",
    description: "Profile visibility and local readiness preview settings.",
  },
  {
    id: "verificationTrust",
    icon: "badge",
    title: "Readiness preview",
    description: "Local-only comfort and meetup readiness note.",
  },
] as const;

export const getProfileHomeSectionOrder = () => [...profileHomeSectionOrder];

export const getMainProfileSummaryRows = () => [...mainProfileSummaryRows];

export const getSimpleProfileSummaryRows = () =>
  mainProfileSummaryRows.filter((row) => row.id === "verificationTrust");

export const getDetailedProfileSummaryRows = () =>
  mainProfileSummaryRows.filter((row) =>
    row.id === "meaningfulMemories" ||
    row.id === "localArea" ||
    row.id === "interests" ||
    row.id === "comfortTrust" ||
    row.id === "privacy"
  );

export const shouldShowManagementSectionOnProfileHome = (_section: ProfileManagementSectionId) => false;
