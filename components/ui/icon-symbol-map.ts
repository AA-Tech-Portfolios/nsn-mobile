import type MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";

export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

export const ICON_SYMBOL_MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  code: "code",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.up": "keyboard-arrow-up",
  "chevron.down": "keyboard-arrow-down",
  xmark: "close",
  calendar: "calendar-today",
  message: "chat-bubble-outline",
  bell: "notifications-none",
  "person.fill": "person",
  settings: "settings",
  sliders: "tune",
  heart: "favorite-border",
  layout: "dashboard-customize",
  resize: "open-in-full",
  battery: "battery-saver",
  preview: "preview",
  badge: "badge",
  shield: "shield",
  accessibility: "accessibility",
  palette: "palette",
  language: "translate",
  account: "manage-accounts",
  "life-context": "school",
  location: "place",
  group: "groups",
  share: "ios-share",
  more: "more-vert",
  ellipsis: "more-horiz",
  magnifyingglass: "search",
  add: "add",
  checkmark: "check",
  edit: "edit",
  flag: "outlined-flag",
  bookmark: "bookmark",
  "bookmark.border": "bookmark-border",
  pin: "push-pin",
  visibility: "visibility",
  "visibility.off": "visibility-off",
  explore: "explore",
  transport: "directions-transit",
  food: "restaurant",
  interests: "interests",
  contact: "contact-phone",
  help: "help-outline",
  weather: "wb-cloudy",
  "low-pressure": "sentiment-satisfied-alt",
  experience: "local-activity",
  flexible: "sync",
  volume: "volume-up",
  "volume.off": "volume-off",
  pace: "forum",
} satisfies Record<string, MaterialIconName>;

export type IconSymbolName = keyof typeof ICON_SYMBOL_MAPPING;

export const ICON_SYMBOL_FALLBACK: MaterialIconName = "help-outline";

export function getMaterialIconName(name: IconSymbolName | string): MaterialIconName {
  return ICON_SYMBOL_MAPPING[name as IconSymbolName] ?? ICON_SYMBOL_FALLBACK;
}
