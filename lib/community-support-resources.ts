import type { IconSymbolName } from "@/components/ui/icon-symbol-map";

export type CommunitySupportResource = {
  title: string;
  copy: string;
  badge: "Demo placeholder";
};

export type CommunitySupportResourceCategory = {
  id: string;
  icon: IconSymbolName;
  title: string;
  description: string;
  badge: "Alpha demo";
  boundaryNote: string;
  resources: CommunitySupportResource[];
};

const demoPlaceholder = "Demo placeholder" as const;

export const communitySupportResourceCategories: CommunitySupportResourceCategory[] = [
  {
    id: "life-skills",
    icon: "eco",
    title: "Life Skills",
    description: "Small practical resources for everyday confidence and independence.",
    badge: "Alpha demo",
    boundaryNote: "Prototype placeholders only; not verified, personalized, or a substitute for qualified services.",
    resources: [
      { title: "Cooking basics", copy: "Simple starter guides for low-cost meals and kitchen confidence.", badge: demoPlaceholder },
      { title: "Budgeting help", copy: "Gentle money-planning prompts for weekly expenses and saving basics.", badge: demoPlaceholder },
      { title: "Public transport guides", copy: "Beginner-friendly route planning and travel confidence resources.", badge: demoPlaceholder },
      { title: "Study support", copy: "Quiet study planning, deadlines, and finding help before things pile up.", badge: demoPlaceholder },
      { title: "Beginner job readiness", copy: "Resume basics, interview practice, and first-job preparation links.", badge: demoPlaceholder },
    ],
  },
  {
    id: "community-connection",
    icon: "group",
    title: "Community & Connection",
    description: "Low-pressure ways to find familiar people, places, and community rhythms.",
    badge: "Alpha demo",
    boundaryNote: "Prototype placeholders only; local groups and opportunities are not verified yet.",
    resources: [
      { title: "Volunteering", copy: "Gentle local volunteering ideas with clear expectations and flexible time.", badge: demoPlaceholder },
      { title: "Local community groups", copy: "Libraries, neighbourhood centres, and interest-based community spaces.", badge: demoPlaceholder },
      { title: "Meetup confidence tips", copy: "Small steps for arriving, observing, joining slowly, or leaving calmly.", badge: demoPlaceholder },
      { title: "Social support resources", copy: "Non-urgent community support pathways outside NSN.", badge: demoPlaceholder },
    ],
  },
  {
    id: "accessibility-disability",
    icon: "accessibility",
    title: "Accessibility & Disability Support",
    description: "Inclusive access information for planning around needs, energy, and comfort.",
    badge: "Alpha demo",
    boundaryNote: "Prototype placeholders only; access details need direct checking before relying on them.",
    resources: [
      { title: "Accessibility information", copy: "Step-free access, bathrooms, seating, sensory load, and venue notes.", badge: demoPlaceholder },
      { title: "Sensory-friendly resources", copy: "Quieter spaces, lower-noise events, and planning around overwhelm.", badge: demoPlaceholder },
      { title: "Disability support links", copy: "Broad information pathways for disability services and local supports.", badge: demoPlaceholder },
      { title: "Inclusive community services", copy: "Community spaces that aim to welcome different access needs.", badge: demoPlaceholder },
    ],
  },
  {
    id: "animals-wildlife",
    icon: "pets",
    title: "Animals & Wildlife",
    description: "Calming, community-minded resources connected to animals and local wildlife.",
    badge: "Alpha demo",
    boundaryNote: "Prototype placeholders only; volunteering and welfare links are not verified yet.",
    resources: [
      { title: "Wildlife rescue support", copy: "Where to learn about local rescue pathways and who to contact.", badge: demoPlaceholder },
      { title: "Animal welfare links", copy: "General animal welfare, shelters, and responsible care resources.", badge: demoPlaceholder },
      { title: "Volunteering opportunities", copy: "Low-pressure ways to help with animal and wildlife organisations.", badge: demoPlaceholder },
      { title: "Calming animal interactions", copy: "Ideas for gentle animal-adjacent activities where appropriate.", badge: demoPlaceholder },
    ],
  },
  {
    id: "crisis-emergency",
    icon: "shield",
    title: "Crisis & Emergency Support",
    description: "Clear reminders that urgent situations belong with external emergency and specialist services.",
    badge: "Alpha demo",
    boundaryNote: "Prototype placeholders only; if something is urgent, use local emergency or crisis services outside NSN.",
    resources: [
      { title: "Crisis helplines", copy: "Placeholder for external helplines that must be reviewed before launch.", badge: demoPlaceholder },
      { title: "Domestic violence support", copy: "Placeholder for specialist support pathways outside NSN.", badge: demoPlaceholder },
      { title: "Homelessness assistance", copy: "Placeholder for housing and emergency accommodation information.", badge: demoPlaceholder },
      { title: "Emergency contacts", copy: "Placeholder for local emergency contact guidance and official services.", badge: demoPlaceholder },
    ],
  },
];

export const communitySupportResourceFutureNotes = [
  "Localized resource discovery",
  "Regional/community partnerships",
  "Accessibility preferences",
  "Volunteer/community initiatives",
  "Optional resource recommendations",
  "Support personalization",
  "Multilingual accessibility support",
] as const;
