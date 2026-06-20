import { describe, expect, it } from "vitest";

import { getBottomTabBarLayout, getBottomTabIconLabelColor } from "./bottom-tab-layout";

describe("bottom tab bar layout", () => {
  it("keeps the web tab bar compact when there is no browser safe-area inset", () => {
    const layout = getBottomTabBarLayout({
      bottomInset: 0,
      largerTouchTargets: false,
      platform: "web",
    });

    expect(layout.tabContentHeight).toBe(68);
    expect(layout.bottomSafeArea).toBe(0);
    expect(layout.tabBarHeight).toBe(76);
    expect(layout.paddingBottom).toBeLessThanOrEqual(8);
  });

  it("keeps larger touch targets readable without turning the tab bar into a footer", () => {
    const layout = getBottomTabBarLayout({
      bottomInset: 0,
      largerTouchTargets: true,
      platform: "web",
    });

    expect(layout.tabContentHeight).toBe(76);
    expect(layout.tabBarHeight).toBeLessThanOrEqual(88);
  });

  it("respects native bottom safe area without adding an excessive fixed spacer", () => {
    const layout = getBottomTabBarLayout({
      bottomInset: 24,
      largerTouchTargets: false,
      platform: "native",
    });

    expect(layout.bottomSafeArea).toBe(24);
    expect(layout.paddingBottom).toBe(28);
    expect(layout.tabBarHeight).toBeLessThanOrEqual(100);
  });

  it("uses high contrast text and icon colors for selected tabs", () => {
    expect(
      getBottomTabIconLabelColor({
        color: "#7786FF",
        focused: true,
        isDay: false,
      }),
    ).toBe("#F8FBFF");
    expect(
      getBottomTabIconLabelColor({
        color: "#445E93",
        focused: true,
        isDay: true,
      }),
    ).toBe("#14335F");
    expect(
      getBottomTabIconLabelColor({
        color: "#9AA7B8",
        focused: false,
        isDay: false,
      }),
    ).toBe("#9AA7B8");
  });
});
