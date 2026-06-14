export type PreferredMapApp = "system-default" | "google-maps" | "apple-maps" | "waze";

export type ExternalLinksPreference = {
  askBeforeOpeningExternalApps: boolean;
  preferredMapApp: PreferredMapApp;
};

export type ExternalOpenDestination = {
  kind: "maps" | "website" | "app";
  destinationAppName?: string;
  broadAreaName?: string;
};

export const defaultExternalLinksPreference: ExternalLinksPreference = {
  askBeforeOpeningExternalApps: true,
  preferredMapApp: "system-default",
};

export const normalizeExternalLinksPreference = (
  value?: Partial<ExternalLinksPreference> | null,
): ExternalLinksPreference => ({
  askBeforeOpeningExternalApps:
    value?.askBeforeOpeningExternalApps ??
    defaultExternalLinksPreference.askBeforeOpeningExternalApps,
  preferredMapApp: value?.preferredMapApp ?? defaultExternalLinksPreference.preferredMapApp,
});

export const getExternalOpenConfirmationCopy = (destination: ExternalOpenDestination) => {
  const details = [
    destination.destinationAppName ? `Destination: ${destination.destinationAppName}` : null,
    destination.broadAreaName ? `Area: ${destination.broadAreaName}` : null,
  ].filter(Boolean);

  return {
    title: "Open external app?",
    body: "You are about to leave NSN and open an external app.",
    details,
    openLabel: "Open",
    cancelLabel: "Cancel",
  };
};
