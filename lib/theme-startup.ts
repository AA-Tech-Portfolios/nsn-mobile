import type { ColorScheme } from "@/constants/theme";

export function getInitialAppColorScheme(_systemScheme: ColorScheme | null | undefined): ColorScheme {
  // NSN uses its own Day/Night mode, so Expo Go's system dark mode should not tint the root palette at startup.
  return "light";
}
