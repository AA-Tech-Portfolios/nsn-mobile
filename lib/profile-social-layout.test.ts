import { describe, expect, it } from "vitest";

import {
  getDetailedProfileSummaryRows,
  getMainProfileSummaryRows,
  getProfileHomeSectionOrder,
  getSimpleProfileSummaryRows,
  shouldShowManagementSectionOnProfileHome,
} from "./profile-social-layout";

describe("profile social layout", () => {
  it("keeps the main profile page ordered around social identity first", () => {
    expect(getProfileHomeSectionOrder()).toEqual([
      "avatarPhoto",
      "name",
      "myVibes",
      "profileVisibilityPreview",
      "aboutMe",
      "profileShortcuts",
      "localArea",
      "interests",
      "comfortTrust",
      "privacy",
      "verificationTrust",
    ]);
  });

  it("keeps heavy management sections off the main profile page", () => {
    expect(shouldShowManagementSectionOnProfileHome("comfortTrustDetails")).toBe(false);
    expect(shouldShowManagementSectionOnProfileHome("workStudyLifeContext")).toBe(false);
    expect(shouldShowManagementSectionOnProfileHome("trustStatusDetails")).toBe(false);
  });

  it("shows only clean summary rows after About me and My vibes", () => {
    expect(getMainProfileSummaryRows().map((row) => row.id)).toEqual([
      "localArea",
      "interests",
      "comfortTrust",
      "privacy",
      "verificationTrust",
    ]);
  });

  it("keeps management rows out of Simple layout summaries", () => {
    expect(getSimpleProfileSummaryRows().map((row) => row.id)).toEqual(["verificationTrust"]);
  });

  it("moves Local area, Interests, Comfort & trust, and Privacy into Detailed layout", () => {
    expect(getDetailedProfileSummaryRows().map((row) => row.id)).toEqual([
      "localArea",
      "interests",
      "comfortTrust",
      "privacy",
    ]);
  });
});
