import { describe, expect, it } from "vitest";

import { formatBroadLocalArea } from "./australian-localities";
import { getLocalAreaPickerCopy } from "./local-area-copy";

describe("local area picker copy", () => {
  it("uses calm result wording without matchmaking or growth language", () => {
    const localCopy = getLocalAreaPickerCopy("local");
    const australiaCopy = getLocalAreaPickerCopy("australia");
    const visibleCopy = Object.values(localCopy).concat(Object.values(australiaCopy)).join(" ");

    expect(localCopy.resultGroupTitle).toBe("Suburbs and regions");
    expect(localCopy.emptyTitle).toBe("No suburb or region found yet.");
    expect(visibleCopy).not.toMatch(/\bmatching|matchmaking|popular|limited|hurry|scarcity|growth\b/i);
  });

  it("removes postcode details from profile preview copy", () => {
    expect(formatBroadLocalArea("Chatswood NSW 2067")).toBe("Chatswood");
    expect(formatBroadLocalArea("Crows Nest, NSW 2065")).toBe("Crows Nest");
    expect(formatBroadLocalArea("Sydney North Shore")).toBe("Sydney North Shore");
  });
});
