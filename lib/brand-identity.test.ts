import { describe, expect, it } from "vitest";

import { brandIdentity, getBrandIdentitySummary } from "./brand-identity";

describe("brand identity config", () => {
  it("separates the current local app identity from alpha and global names", () => {
    expect(brandIdentity).toEqual({
      appDisplayName: "SofterHello",
      currentLocalAppName: "SofterHello",
      globalFutureName: "SoftHello",
      localPilotName: "North Shore Nights",
      localPilotShortName: "NSN",
    });
  });

  it("summarizes the three-layer naming model without making SoftHello current", () => {
    expect(getBrandIdentitySummary()).toBe(
      "SofterHello is the current local app identity. North Shore Nights (NSN) remains the Sydney/North Shore alpha pilot name. SoftHello is reserved for the broader global/future direction.",
    );
  });
});
