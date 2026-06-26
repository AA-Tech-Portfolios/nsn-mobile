import { describe, expect, it } from "vitest";

import { accountControlToneColors } from "./settings-account-control-colors";
import { nsnSupportReadabilityColors } from "./support-readability";

describe("settings account control colors", () => {
  it("keeps account pause in the warning/yellow family", () => {
    expect(accountControlToneColors.pause.dark.border).toBe("#FFD66E");
    expect(accountControlToneColors.pause.dark.text).toBe(nsnSupportReadabilityColors.darkWarningText);
    expect(accountControlToneColors.pause.light.surface).toBe(nsnSupportReadabilityColors.lightWarningSurface);
    expect(accountControlToneColors.pause.light.text).toBe(nsnSupportReadabilityColors.lightWarningText);
  });

  it("keeps account resume in the positive/green family", () => {
    expect(accountControlToneColors.resume.light.border).toBe("#55A96E");
    expect(accountControlToneColors.resume.light.text).toBe("#0F6B2F");
  });
});
