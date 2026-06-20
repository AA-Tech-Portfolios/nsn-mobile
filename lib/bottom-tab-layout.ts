type BottomTabPlatform = "native" | "web";

type BottomTabLayoutOptions = {
  bottomInset: number;
  largerTouchTargets: boolean;
  platform: BottomTabPlatform;
};

type BottomTabIconLabelColorOptions = {
  color: string;
  focused: boolean;
  isDay: boolean;
};

export function getBottomTabBarLayout({
  bottomInset,
  largerTouchTargets,
  platform,
}: BottomTabLayoutOptions) {
  const tabContentHeight = largerTouchTargets ? 76 : 68;
  const bottomSafeArea = platform === "web" ? Math.max(bottomInset, 0) : Math.max(bottomInset, 12);
  const paddingTop = 4;
  const paddingBottom = bottomSafeArea + 4;
  const tabBarHeight = tabContentHeight + bottomSafeArea + 8;

  return {
    bottomSafeArea,
    paddingBottom,
    paddingTop,
    tabBarHeight,
    tabContentHeight,
  };
}

export function getBottomTabIconLabelColor({
  color,
  focused,
  isDay,
}: BottomTabIconLabelColorOptions) {
  if (!focused) {
    return color;
  }

  return isDay ? "#14335F" : "#F8FBFF";
}
