import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  calendar: "calendar-today",
  message: "chat-bubble-outline",
  bell: "notifications-none",
  "person.fill": "person",
  settings: "settings",
  location: "place",
  group: "groups",
  share: "ios-share",
  more: "more-vert",
  ellipsis: "more-horiz",
  magnifyingglass: "search",
  add: "add",
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
} satisfies Record<string, MaterialIconName>;

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
