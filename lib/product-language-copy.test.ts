import { describe, expect, it } from "vitest";

import { productLanguageCopy } from "./product-language-copy";

describe("product language copy", () => {
  it("keeps NSN alpha-local, SofterHello current-local, and SoftHello future-facing", () => {
    const visibleCopy = Object.values(productLanguageCopy).join(" ");

    expect(productLanguageCopy.alphaPilotName).toBe("North Shore Nights");
    expect(productLanguageCopy.alphaPilotShortName).toBe("NSN");
    expect(productLanguageCopy.currentLocalAppName).toBe("SofterHello");
    expect(productLanguageCopy.globalFutureDirectionName).toBe("SoftHello");
    expect(visibleCopy).toMatch(/Sydney\/North Shore alpha pilot/i);
    expect(visibleCopy).toMatch(/current local app identity/i);
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
    expect(visibleCopy).not.toMatch(/\bSoftHello is the current local app identity\b/i);
  });
});
