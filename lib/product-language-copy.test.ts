import { describe, expect, it } from "vitest";

import { productLanguageCopy } from "./product-language-copy";

describe("product language copy", () => {
  it("keeps NSN current and SoftHello future-facing", () => {
    const visibleCopy = Object.values(productLanguageCopy).join(" ");

    expect(productLanguageCopy.currentPilotName).toBe("North Shore Nights");
    expect(productLanguageCopy.currentPilotShortName).toBe("NSN");
    expect(productLanguageCopy.futureProductName).toBe("SoftHello");
    expect(visibleCopy).toMatch(/current Sydney\/North Shore alpha pilot/i);
    expect(visibleCopy).toMatch(/future broader product direction/i);
    expect(visibleCopy).toMatch(/not live or production-ready/i);
  });

  it("keeps retired naming exploration out of the current pilot position", () => {
    expect(productLanguageCopy.retiredNamingNote).toMatch(/historical naming exploration/i);
    expect(productLanguageCopy.retiredNamingNote).not.toMatch(/current pilot|public-facing pilot|launched/i);
  });

  it("avoids positive launch claims for SoftHello", () => {
    const visibleCopy = Object.values(productLanguageCopy).join(" ");

    expect(visibleCopy).not.toMatch(/\bSoftHello is (live|launched|available|production-ready)\b/i);
    expect(visibleCopy).not.toMatch(/\bcurrent SoftHello (release|launch|product)\b/i);
  });
});
