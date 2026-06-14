import { describe, expect, it } from "vitest";

import {
  getLegalPrivacyDocument,
  legalPrivacyDocuments,
  legalPrivacySettingsSummary,
} from "./legal-privacy-alpha";

describe("legal and privacy alpha placeholders", () => {
  it("defines the required alpha legal/privacy documents", () => {
    expect(legalPrivacyDocuments.map((document) => document.id)).toEqual([
      "privacy-policy",
      "terms-of-service",
      "prototype-notice",
    ]);
    expect(legalPrivacySettingsSummary).toContain("Alpha placeholders");
    expect(getLegalPrivacyDocument("missing").id).toBe("prototype-notice");
  });

  it("keeps privacy copy prototype-safe and local-data clear", () => {
    const privacy = getLegalPrivacyDocument("privacy-policy");
    const copy = [privacy.summary, privacy.footerNote, ...privacy.sections.map((section) => section.copy)].join(" ");

    expect(copy).toMatch(/alpha prototype/i);
    expect(copy).toMatch(/stored locally on your device/i);
    expect(copy).toMatch(/profile preferences/i);
    expect(copy).toMatch(/RSVP state/i);
    expect(copy).toMatch(/My Circle prototype notes/i);
    expect(copy).toMatch(/delete local prototype data from Settings/i);
    expect(copy).toMatch(/External links may open maps, websites, or other apps outside NSN/i);
    expect(copy).toMatch(/No production backend or account system is currently active/i);
    expect(copy).toMatch(/reviewed before beta or public launch/i);
    expect(copy).not.toMatch(/never collects|guarantee|guaranteed|production-ready|analytics|tracking/i);
  });

  it("keeps terms copy broad without meetup guarantees", () => {
    const terms = getLegalPrivacyDocument("terms-of-service");
    const copy = [terms.summary, terms.footerNote, ...terms.sections.map((section) => section.copy)].join(" ");

    expect(copy).toMatch(/alpha prototype and may change/i);
    expect(copy).toMatch(/Use NSN respectfully/i);
    expect(copy).toMatch(/prototype or demo content/i);
    expect(copy).toMatch(/does not guarantee event attendance, safety, accessibility, venue details, transport/i);
    expect(copy).toMatch(/responsible for deciding whether to attend/i);
    expect(copy).toMatch(/External links and external apps are outside NSN's control/i);
    expect(copy).not.toMatch(/I agree|accept these terms|binding|warranty|verified venue/i);
  });

  it("keeps the prototype notice short and current-scope oriented", () => {
    const notice = getLegalPrivacyDocument("prototype-notice");
    const copy = [notice.summary, notice.footerNote, ...notice.sections.map((section) => section.copy)].join(" ");

    expect(copy).toMatch(/local Sydney North Shore alpha/i);
    expect(copy).toMatch(/may change/i);
    expect(copy).toMatch(/seeded or demo-only/i);
    expect(copy).toMatch(/cleared from Settings/i);
    expect(copy).not.toMatch(/production|launch-ready|guarantee|verified/i);
  });
});
