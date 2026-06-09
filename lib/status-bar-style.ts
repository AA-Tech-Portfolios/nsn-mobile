export type AppStatusBarStyle = "light" | "dark";

export const NSN_NIGHT_STATUS_BAR_BACKGROUND = "#020814";
export const NSN_DAY_STATUS_BAR_BACKGROUND = "#ECEFE6";

export function getAppStatusBarStyle(isNightMode: boolean): AppStatusBarStyle {
  return isNightMode ? "light" : "dark";
}

export function getAppStatusBarBackgroundColor(isNightMode: boolean) {
  return isNightMode ? NSN_NIGHT_STATUS_BAR_BACKGROUND : NSN_DAY_STATUS_BAR_BACKGROUND;
}
