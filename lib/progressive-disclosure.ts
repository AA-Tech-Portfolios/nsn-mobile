export type HomePreferenceDisclosurePanel = "filters" | "customize" | "layout";

export type HomePreferenceControlId =
  | "primaryView"
  | "optionalFilters"
  | "eventDisplay"
  | "layoutComfort"
  | "headerControls"
  | "dayNightBehaviour"
  | "cardOutlineStyle"
  | "sectionOrder"
  | "eventVisuals"
  | "eventCardLayouts";

export type DisclosureGroup<T extends string> = {
  id: T;
  defaultOpen?: boolean;
  selectedCount?: number;
};

const unique = <T extends string>(items: T[]) => Array.from(new Set(items));

export function getHomePreferenceDisclosure(panel: HomePreferenceDisclosurePanel): {
  primary: HomePreferenceControlId[];
  advanced: HomePreferenceControlId[];
} {
  if (panel === "customize") {
    return {
      primary: ["sectionOrder"],
      advanced: [],
    };
  }

  if (panel === "layout") {
    return {
      primary: ["eventVisuals"],
      advanced: ["eventCardLayouts"],
    };
  }

  return {
    primary: ["primaryView", "optionalFilters", "eventDisplay"],
    advanced: ["layoutComfort", "headerControls", "dayNightBehaviour", "cardOutlineStyle"],
  };
}

export function getCalmDefaultOpenGroupIds<T extends string>(
  groups: Array<DisclosureGroup<T>>,
  options: { maxOpen?: number } = {}
) {
  const maxOpen = options.maxOpen ?? 1;
  const selected = groups.filter((group) => (group.selectedCount ?? 0) > 0).map((group) => group.id);
  const defaultOpen = groups.filter((group) => group.defaultOpen).map((group) => group.id);

  return unique([...selected, ...defaultOpen]).slice(0, maxOpen);
}

export function getExpandableGroupSummary({
  selectedCount,
  totalCount,
  fallback = "Tap to review",
}: {
  selectedCount?: number;
  totalCount?: number;
  fallback?: string;
}) {
  if (selectedCount) return `${selectedCount} selected`;
  if (totalCount) return `${totalCount} ${totalCount === 1 ? "option" : "options"}`;
  return fallback;
}
