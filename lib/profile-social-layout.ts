export const profileHomeSectionOrder = [
  "avatarPhoto",
  "name",
  "myVibes",
  "profileVisibilityPreview",
  "aboutMe",
  "profileShortcuts",
  "localArea",
  "interests",
  "comfortTrust",
  "privacy",
  "verificationTrust",
] as const;

export type ProfileHomeSectionId = (typeof profileHomeSectionOrder)[number];
export type ProfileManagementSectionId = "comfortTrustDetails" | "workStudyLifeContext" | "trustStatusDetails";
export type MainProfileSummaryRowId =
  | "localArea"
  | "interests"
  | "comfortTrust"
  | "privacy"
  | "verificationTrust";

export type MainProfileSummaryRow = {
  id: MainProfileSummaryRowId;
  icon: "location" | "interests" | "shield" | "settings" | "badge";
  title: string;
  description: string;
};

export const mainProfileSummaryRows: readonly MainProfileSummaryRow[] = [
  {
    id: "localArea",
    icon: "location",
    title: "Local area",
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
    title: "Comfort & trust",
    description: "Pace, privacy, and low-pressure meeting comfort.",
  },
  {
    id: "privacy",
    icon: "settings",
    title: "Privacy",
    description: "Profile visibility and prototype trust settings.",
  },
  {
    id: "verificationTrust",
    icon: "badge",
    title: "Verification / trust status",
    description: "Prototype trust level and in-person readiness.",
  },
] as const;

export const getProfileHomeSectionOrder = () => [...profileHomeSectionOrder];

export const getMainProfileSummaryRows = () => [...mainProfileSummaryRows];

export const getSimpleProfileSummaryRows = () =>
  mainProfileSummaryRows.filter((row) => row.id === "verificationTrust");

export const getDetailedProfileSummaryRows = () =>
  mainProfileSummaryRows.filter((row) =>
    row.id === "localArea" ||
    row.id === "interests" ||
    row.id === "comfortTrust" ||
    row.id === "privacy"
  );

export const shouldShowManagementSectionOnProfileHome = (_section: ProfileManagementSectionId) => false;
