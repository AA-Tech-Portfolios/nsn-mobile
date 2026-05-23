export type AppStatusBarStyle = "light" | "dark";

export function getAppStatusBarStyle(isNightMode: boolean): AppStatusBarStyle {
  return isNightMode ? "light" : "dark";
}
