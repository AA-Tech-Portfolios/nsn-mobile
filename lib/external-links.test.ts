import { describe, expect, it } from "vitest";

import {
  defaultExternalLinksPreference,
  getExternalOpenConfirmationCopy,
  normalizeExternalLinksPreference,
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
});
