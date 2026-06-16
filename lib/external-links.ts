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

type ExternalOpenAlertButton = {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
};

type ExternalOpenAlert = (
  title: string,
  message?: string,
  buttons?: ExternalOpenAlertButton[],
) => void;

type WebConfirm = (message: string) => boolean;

type ExternalOpenConfirmationOptions = {
  destination: ExternalOpenDestination;
  externalLinks: ExternalLinksPreference;
  platform: string;
  alert: ExternalOpenAlert;
  confirm?: WebConfirm;
};

type ExternalOpenFailureOptions = {
  platform: string;
  title: string;
  message: string;
  alert: ExternalOpenAlert;
  notify?: (message: string) => void;
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

export const getExternalOpenConfirmationMessage = (destination: ExternalOpenDestination) => {
  const confirmationCopy = getExternalOpenConfirmationCopy(destination);

  return [confirmationCopy.body, ...confirmationCopy.details].join("\n\n");
};

const getDefaultWebConfirm = (): WebConfirm | undefined => {
  const maybeWindow = (globalThis as typeof globalThis & {
    window?: { confirm?: WebConfirm };
  }).window;

  return typeof maybeWindow?.confirm === "function" ? maybeWindow.confirm : undefined;
};

export const openExternalDestinationWithConfirmation = (
  {
    destination,
    externalLinks,
    platform,
    alert,
    confirm = getDefaultWebConfirm(),
  }: ExternalOpenConfirmationOptions,
  openExternalDestination: () => void,
) => {
  if (!externalLinks.askBeforeOpeningExternalApps) {
    openExternalDestination();
    return;
  }

  const confirmationCopy = getExternalOpenConfirmationCopy(destination);
  const message = getExternalOpenConfirmationMessage(destination);

  if (platform === "web") {
    if (confirm?.(message)) {
      openExternalDestination();
    }

    return;
  }

  alert(confirmationCopy.title, message, [
    { text: confirmationCopy.cancelLabel, style: "cancel" },
    { text: confirmationCopy.openLabel, onPress: openExternalDestination },
  ]);
};

export const showExternalOpenFailure = ({
  platform,
  title,
  message,
  alert,
  notify,
}: ExternalOpenFailureOptions) => {
  if (platform === "web") {
    notify?.(message);
    return;
  }

  alert(title, message);
};
