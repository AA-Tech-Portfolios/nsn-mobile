import { describe, expect, it } from "vitest";

import { getHomeTodayContextLabel, getLocalGreetingPeriod } from "./home-header-context";

describe("home header context", () => {
  it("uses a morning period before midday", () => {
    expect(getLocalGreetingPeriod(8)).toBe("morning");
  });

  it("uses an afternoon period after midday", () => {
    expect(getLocalGreetingPeriod(14)).toBe("afternoon");
  });

  it("uses an evening period only in the evening", () => {
    expect(getLocalGreetingPeriod(19)).toBe("evening");
  });

  it("uses a night period overnight", () => {
    expect(getLocalGreetingPeriod(2)).toBe("night");
  });

  it("does not produce dashboard labels", () => {
    for (const hour of [2, 8, 14, 19]) {
      expect(getLocalGreetingPeriod(hour)).not.toMatch(/dashboard/i);
    }
  });

  it("returns Home today card copy for each local time period", () => {
    expect(getHomeTodayContextLabel(8)).toBe("Morning local meetup window");
    expect(getHomeTodayContextLabel(14)).toBe("Afternoon local context");
    expect(getHomeTodayContextLabel(19)).toBe("Evening-friendly meetup window");
    expect(getHomeTodayContextLabel(2)).toBe("Quiet overnight local context");
  });
});
