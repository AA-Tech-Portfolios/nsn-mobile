import type { IconSymbolName } from "@/components/ui/icon-symbol-map";

export type LegalPrivacyDocumentId = "privacy-policy" | "terms-of-service" | "prototype-notice";

export type LegalPrivacyDocument = {
  id: LegalPrivacyDocumentId;
  title: string;
  eyebrow: string;
  summary: string;
  route: `/legal/${LegalPrivacyDocumentId}`;
  iconName: IconSymbolName;
  sections: { title: string; copy: string }[];
  footerNote: string;
};

export const legalPrivacyDocuments: LegalPrivacyDocument[] = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    eyebrow: "Alpha placeholder",
    summary: "How local prototype data is handled before beta review.",
    route: "/legal/privacy-policy",
    iconName: "shield",
    sections: [
      {
        title: "Current alpha scope",
        copy: "NSN is currently an alpha prototype. Most data is stored locally on your device while the app is being shaped and tested.",
      },
      {
        title: "Local prototype data",
        copy: "Local data may include profile preferences, RSVP state, My Circle prototype notes, saved or hidden events, created demo meetups, planning notes, feedback/report drafts, and app settings.",
      },
      {
        title: "Deleting local data",
        copy: "You can delete local prototype data from Settings. This clears local prototype data on this device and does not act as production account deletion.",
      },
      {
        title: "External links",
        copy: "External links may open maps, websites, or other apps outside NSN. Settings can ask before opening external destinations.",
      },
      {
        title: "Production systems",
        copy: "No production backend or account system is currently active unless a later build clearly enables one.",
      },
    ],
    footerNote: "This placeholder should be reviewed before beta or public launch.",
  },
  {
    id: "terms-of-service",
    title: "Terms of Service",
    eyebrow: "Alpha placeholder",
    summary: "Basic prototype expectations without production legal guarantees.",
    route: "/legal/terms-of-service",
    iconName: "clipboard",
    sections: [
      {
        title: "Alpha use",
        copy: "NSN is an alpha prototype and may change. Screens, wording, features, and seeded content can be revised as the product learns.",
      },
      {
        title: "Respectful use",
        copy: "Use NSN respectfully and avoid using prototype surfaces to pressure, mislead, harass, or exclude other people.",
      },
      {
        title: "Meetup content",
        copy: "Meetup information is prototype or demo content unless a screen clearly states otherwise.",
      },
      {
        title: "No guarantees",
        copy: "NSN does not guarantee event attendance, safety, accessibility, venue details, transport, map accuracy, or external services.",
      },
      {
        title: "Your decision",
        copy: "You are responsible for deciding whether to attend a meetup and for checking venue, location, transport, and access details before leaving.",
      },
      {
        title: "External services",
        copy: "External links and external apps are outside NSN's control.",
      },
    ],
    footerNote: "This placeholder should be reviewed before beta or public launch.",
  },
  {
    id: "prototype-notice",
    title: "Prototype Notice",
    eyebrow: "Local alpha",
    summary: "A short reminder about what NSN is and is not right now.",
    route: "/legal/prototype-notice",
    iconName: "info",
    sections: [
      {
        title: "Local alpha",
        copy: "NSN is currently a local Sydney North Shore alpha.",
      },
      {
        title: "Things may change",
        copy: "Features, data, wording, layouts, and screens may change while the app is being tested.",
      },
      {
        title: "Demo content",
        copy: "Some meetup content, profile examples, notes, and support surfaces are seeded or demo-only.",
      },
      {
        title: "Local reset",
        copy: "Local prototype data can be cleared from Settings on this device.",
      },
    ],
    footerNote: "This notice is informational for alpha testers and should be reviewed before beta or public launch.",
  },
];

export const legalPrivacySettingsSummary =
  "Alpha placeholders for privacy, terms, prototype scope, and local data expectations.";

export const getLegalPrivacyDocument = (id?: string | string[]) => {
  const normalizedId = Array.isArray(id) ? id[0] : id;
  return (
    legalPrivacyDocuments.find((document) => document.id === normalizedId) ??
    legalPrivacyDocuments.find((document) => document.id === "prototype-notice")!
  );
};
