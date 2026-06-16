import { describe, expect, it, vi } from "vitest";

import {
  defaultExternalLinksPreference,
  getExternalOpenConfirmationCopy,
  openExternalDestinationWithConfirmation,
  normalizeExternalLinksPreference,
  showExternalOpenFailure,
} from "./external-links";

describe("external link preferences", () => {
  it("asks before opening external apps by default", () => {
    expect(defaultExternalLinksPreference).toEqual({
      askBeforeOpeningExternalApps: true,
      preferredMapApp: "system-default",
    });
    expect(normalizeExternalLinksPreference(null)).toEqual(defaultExternalLinksPreference);
  });

  it("keeps confirmation copy calm and transparent", () => {
    const copy = getExternalOpenConfirmationCopy({
      kind: "maps",
      destinationAppName: "Maps",
      broadAreaName: "Macquarie Centre cinema area",
    });

    expect(copy.title).toBe("Open external app?");
    expect(copy.body).toBe("You are about to leave NSN and open an external app.");
    expect(copy.details).toEqual([
      "Destination: Maps",
      "Area: Macquarie Centre cinema area",
    ]);
    expect([copy.openLabel, copy.cancelLabel]).toEqual(["Open", "Cancel"]);
    expect([copy.title, copy.body, ...copy.details].join(" ")).not.toMatch(
      /tracking|permission|special access|analytics/i,
    );
  });

  it("uses a web-safe confirm path before opening external destinations", () => {
    const openExternalDestination = vi.fn();
    const alert = vi.fn();
    const confirm = vi.fn(() => true);

    openExternalDestinationWithConfirmation(
      {
        destination: {
          kind: "maps",
          destinationAppName: "Maps",
          broadAreaName: "Macquarie Centre cinema area",
        },
        externalLinks: defaultExternalLinksPreference,
        platform: "web",
        alert,
        confirm,
      },
      openExternalDestination,
    );

    expect(confirm).toHaveBeenCalledWith(
      expect.stringContaining("You are about to leave NSN"),
    );
    expect(openExternalDestination).toHaveBeenCalledTimes(1);
    expect(alert).not.toHaveBeenCalled();
  });

  it("keeps users in NSN when they cancel web external confirmation", () => {
    const openExternalDestination = vi.fn();

    openExternalDestinationWithConfirmation(
      {
        destination: {
          kind: "website",
          destinationAppName: "Venue website",
        },
        externalLinks: defaultExternalLinksPreference,
        platform: "web",
        alert: vi.fn(),
        confirm: vi.fn(() => false),
      },
      openExternalDestination,
    );

    expect(openExternalDestination).not.toHaveBeenCalled();
  });

  it("keeps native external confirmation on Alert.alert", () => {
    const openExternalDestination = vi.fn();
    const alert = vi.fn();

    openExternalDestinationWithConfirmation(
      {
        destination: {
          kind: "app",
          destinationAppName: "Calendar",
        },
        externalLinks: defaultExternalLinksPreference,
        platform: "ios",
        alert,
      },
      openExternalDestination,
    );

    expect(alert).toHaveBeenCalledWith(
      "Open external app?",
      expect.stringContaining("You are about to leave NSN"),
      expect.arrayContaining([
        expect.objectContaining({ text: "Cancel", style: "cancel" }),
        expect.objectContaining({ onPress: openExternalDestination }),
      ]),
    );
    expect(openExternalDestination).not.toHaveBeenCalled();
  });

  it("uses a web-safe notice instead of Alert.alert for external open failures", () => {
    const alert = vi.fn();
    const notify = vi.fn();

    showExternalOpenFailure({
      platform: "web",
      title: "Open link",
      message: "Could not open this support link.",
      alert,
      notify,
    });

    expect(notify).toHaveBeenCalledWith("Could not open this support link.");
    expect(alert).not.toHaveBeenCalled();
  });
});
