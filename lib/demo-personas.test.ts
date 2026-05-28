import { describe, expect, it } from "vitest";

import { demoPersonaList, demoPersonas } from "./demo-personas";

describe("NSN demo personas", () => {
  it("keeps a small reusable fictional persona set for prototype assets", () => {
    expect(demoPersonaList.map((persona) => persona.displayName)).toEqual(["NSN Tester", "Maya", "Jordan"]);
    expect(demoPersonas["nsn-tester"].vibes).toEqual(expect.arrayContaining(["Calm", "Small groups", "Privacy-conscious"]));
    expect(demoPersonas["maya-host"].sharedInterests).toEqual(expect.arrayContaining(["Coffee", "Board games"]));
    expect(demoPersonas["jordan-member"].comfortNotes.join(" ")).toContain("listening first");
  });

  it("avoids over-specific personal details in demo persona text", () => {
    const visibleText = JSON.stringify(demoPersonaList).toLowerCase();

    expect(visibleText).not.toMatch(/address|street|apartment|workplace|school|university|routine|schedule|diagnosis|salary/);
  });
});
