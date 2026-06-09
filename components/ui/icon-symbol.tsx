import { SymbolWeight } from "expo-symbols";
import { type ColorValue, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from "react-native-svg";

import { ICON_SYMBOL_MAPPING, type IconSymbolName } from "./icon-symbol-map";

type IconShapeProps = {
  color: ColorValue;
  strokeWidth: number;
};

const renderIconShape = (name: IconSymbolName, { color, strokeWidth }: IconShapeProps) => {
  const strokeProps = {
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  switch (name) {
    case "house.fill":
      return (
        <>
          <Path d="M3.5 11.2 12 4l8.5 7.2" {...strokeProps} />
          <Path d="M5.8 10.2v9.1h4.1v-5.2h4.2v5.2h4.1v-9.1" {...strokeProps} />
        </>
      );
    case "paperplane.fill":
      return (
        <>
          <Path d="M4 5.2 20 12 4 18.8l2.3-6.8L4 5.2Z" {...strokeProps} />
          <Path d="M6.5 12H20" {...strokeProps} />
        </>
      );
    case "code":
    case "chevron.left.forwardslash.chevron.right":
      return (
        <>
          <Polyline points="9,7 4,12 9,17" {...strokeProps} />
          <Line x1="14.5" y1="6" x2="9.5" y2="18" {...strokeProps} />
          <Polyline points="15,7 20,12 15,17" {...strokeProps} />
        </>
      );
    case "chevron.right":
      return <Polyline points="9,5 16,12 9,19" {...strokeProps} />;
    case "chevron.left":
      return <Polyline points="15,5 8,12 15,19" {...strokeProps} />;
    case "chevron.up":
      return <Polyline points="6,15 12,9 18,15" {...strokeProps} />;
    case "chevron.down":
      return <Polyline points="6,9 12,15 18,9" {...strokeProps} />;
    case "xmark":
      return (
        <>
          <Line x1="7" y1="7" x2="17" y2="17" {...strokeProps} />
          <Line x1="17" y1="7" x2="7" y2="17" {...strokeProps} />
        </>
      );
    case "calendar":
      return (
        <>
          <Rect x="4.5" y="5.5" width="15" height="14" rx="2.5" {...strokeProps} />
          <Line x1="8" y1="3.8" x2="8" y2="7.2" {...strokeProps} />
          <Line x1="16" y1="3.8" x2="16" y2="7.2" {...strokeProps} />
          <Line x1="4.8" y1="10" x2="19.2" y2="10" {...strokeProps} />
        </>
      );
    case "message":
    case "pace":
      return (
        <>
          <Path d="M5.5 6.5h13v8.2a2.3 2.3 0 0 1-2.3 2.3H10l-4.5 3v-3.3a2.3 2.3 0 0 1-2-2.3V8.8a2.3 2.3 0 0 1 2-2.3Z" {...strokeProps} />
          <Line x1="8" y1="10" x2="16" y2="10" {...strokeProps} />
          <Line x1="8" y1="13.2" x2="13.5" y2="13.2" {...strokeProps} />
        </>
      );
    case "bell":
      return (
        <>
          <Path d="M6.5 16.5h11l-1.3-2.1v-3.6a4.2 4.2 0 0 0-8.4 0v3.6L6.5 16.5Z" {...strokeProps} />
          <Path d="M10.2 19a2 2 0 0 0 3.6 0" {...strokeProps} />
        </>
      );
    case "person.fill":
    case "account":
      return (
        <>
          <Circle cx="12" cy="8.3" r="3.4" {...strokeProps} />
          <Path d="M5.6 19.2a6.7 6.7 0 0 1 12.8 0" {...strokeProps} />
        </>
      );
    case "settings":
      return (
        <>
          <Circle cx="12" cy="12" r="3.2" {...strokeProps} />
          <Path d="M12 3.7v2.1M12 18.2v2.1M4.8 7.1l1.8 1.1M17.4 15.8l1.8 1.1M4.8 16.9l1.8-1.1M17.4 8.2l1.8-1.1" {...strokeProps} />
        </>
      );
    case "sliders":
      return (
        <>
          <Line x1="5" y1="7" x2="19" y2="7" {...strokeProps} />
          <Line x1="5" y1="12" x2="19" y2="12" {...strokeProps} />
          <Line x1="5" y1="17" x2="19" y2="17" {...strokeProps} />
          <Circle cx="9" cy="7" r="1.6" {...strokeProps} />
          <Circle cx="15" cy="12" r="1.6" {...strokeProps} />
          <Circle cx="11" cy="17" r="1.6" {...strokeProps} />
        </>
      );
    case "heart":
      return <Path d="M12 19.2s-7-4.4-7-9.3a3.7 3.7 0 0 1 6.7-2.2A3.7 3.7 0 0 1 18.4 10c0 4.8-6.4 9.2-6.4 9.2Z" {...strokeProps} />;
    case "eco":
      return (
        <>
          <Path d="M5.5 18.5c7.6-.4 12-5.2 13.2-12.8-7.2.6-12.4 4.8-13.2 12.8Z" {...strokeProps} />
          <Path d="M7 17c2.8-3.5 5.5-5.6 9.6-7.4" {...strokeProps} />
        </>
      );
    case "pets":
      return (
        <>
          <Circle cx="7.2" cy="9" r="1.5" {...strokeProps} />
          <Circle cx="11" cy="6.8" r="1.5" {...strokeProps} />
          <Circle cx="15" cy="9" r="1.5" {...strokeProps} />
          <Circle cx="17.5" cy="13" r="1.5" {...strokeProps} />
          <Path d="M8.2 17.8c.8-3.1 2.1-4.8 3.9-4.8s3.1 1.7 3.8 4.8c-1.8 1.3-5.7 1.3-7.7 0Z" {...strokeProps} />
        </>
      );
    case "volunteer":
      return (
        <>
          <Path d="M7.5 12.8 12 17l4.5-4.2a3 3 0 0 0-4.5-4 3 3 0 0 0-4.5 4Z" {...strokeProps} />
          <Path d="M4 14.5c2.5 4.2 5.2 6 8 6s5.5-1.8 8-6" {...strokeProps} />
        </>
      );
    case "layout":
      return (
        <>
          <Rect x="4" y="4.5" width="7" height="6.5" rx="1.5" {...strokeProps} />
          <Rect x="13" y="4.5" width="7" height="6.5" rx="1.5" {...strokeProps} />
          <Rect x="4" y="13" width="16" height="6.5" rx="1.5" {...strokeProps} />
        </>
      );
    case "resize":
      return (
        <>
          <Polyline points="8,4 4,4 4,8" {...strokeProps} />
          <Line x1="4.5" y1="4.5" x2="9" y2="9" {...strokeProps} />
          <Polyline points="16,20 20,20 20,16" {...strokeProps} />
          <Line x1="15" y1="15" x2="19.5" y2="19.5" {...strokeProps} />
        </>
      );
    case "battery":
      return (
        <>
          <Rect x="4" y="8" width="14" height="8" rx="2" {...strokeProps} />
          <Path d="M20 10.3v3.4" {...strokeProps} />
          <Path d="m10.5 14 2.2-3.8v2.9h2.1L12.6 17v-3h-2.1Z" {...strokeProps} />
        </>
      );
    case "preview":
    case "visibility":
      return (
        <>
          <Path d="M3.8 12s3-5.5 8.2-5.5 8.2 5.5 8.2 5.5-3 5.5-8.2 5.5S3.8 12 3.8 12Z" {...strokeProps} />
          <Circle cx="12" cy="12" r="2.4" {...strokeProps} />
        </>
      );
    case "visibility.off":
      return (
        <>
          <Path d="M4.2 4.2 19.8 19.8" {...strokeProps} />
          <Path d="M7 7.4C4.9 9 3.8 12 3.8 12s3 5.5 8.2 5.5c1.2 0 2.3-.3 3.2-.7" {...strokeProps} />
          <Path d="M10.7 6.6c.4-.1.8-.1 1.3-.1 5.2 0 8.2 5.5 8.2 5.5s-.8 1.5-2.3 3" {...strokeProps} />
        </>
      );
    case "badge":
      return (
        <>
          <Rect x="6" y="4" width="12" height="16" rx="2.2" {...strokeProps} />
          <Circle cx="12" cy="9" r="2" {...strokeProps} />
          <Path d="M9 15.5c1.5-1.5 4.5-1.5 6 0" {...strokeProps} />
        </>
      );
    case "shield":
      return <Path d="M12 21s7-3.4 7-9.5V6.2L12 3.5 5 6.2v5.3C5 17.6 12 21 12 21Z" {...strokeProps} />;
    case "accessibility":
      return (
        <>
          <Circle cx="12" cy="4.8" r="1.5" {...strokeProps} />
          <Path d="M5.5 9.2h13M12 7.8v5.1M8.5 20l2.2-7.1h2.6L15.5 20" {...strokeProps} />
        </>
      );
    case "palette":
      return (
        <>
          <Path d="M12 4a8 8 0 0 0 0 16h1.2a1.8 1.8 0 0 0 1.1-3.2 1.9 1.9 0 0 1 1.2-3.4H17a3 3 0 0 0 3-3C20 6.8 16.5 4 12 4Z" {...strokeProps} />
          <Circle cx="8.5" cy="10" r=".6" fill={color} />
          <Circle cx="11.3" cy="7.8" r=".6" fill={color} />
          <Circle cx="14.4" cy="8.5" r=".6" fill={color} />
        </>
      );
    case "language":
      return (
        <>
          <Circle cx="12" cy="12" r="8.2" {...strokeProps} />
          <Path d="M4 12h16M12 4c2 2.1 3.1 4.8 3.1 8S14 17.9 12 20M12 4c-2 2.1-3.1 4.8-3.1 8S10 17.9 12 20" {...strokeProps} />
        </>
      );
    case "life-context":
      return (
        <>
          <Path d="M4 8.2 12 4l8 4.2-8 4.2-8-4.2Z" {...strokeProps} />
          <Path d="M7 11v4.3c2.8 2.2 7.2 2.2 10 0V11" {...strokeProps} />
        </>
      );
    case "location":
    case "pin":
      return (
        <>
          <Path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11Z" {...strokeProps} />
          <Circle cx="12" cy="10" r="2.1" {...strokeProps} />
        </>
      );
    case "group":
      return (
        <>
          <Circle cx="12" cy="8" r="3" {...strokeProps} />
          <Path d="M6.2 19a5.9 5.9 0 0 1 11.6 0" {...strokeProps} />
          <Path d="M4.2 16.8a4.4 4.4 0 0 1 3.2-3.1M19.8 16.8a4.4 4.4 0 0 0-3.2-3.1" {...strokeProps} />
        </>
      );
    case "share":
      return (
        <>
          <Circle cx="18" cy="5.5" r="2.2" {...strokeProps} />
          <Circle cx="6" cy="12" r="2.2" {...strokeProps} />
          <Circle cx="18" cy="18.5" r="2.2" {...strokeProps} />
          <Line x1="8" y1="11" x2="16" y2="6.6" {...strokeProps} />
          <Line x1="8" y1="13" x2="16" y2="17.4" {...strokeProps} />
        </>
      );
    case "more":
      return (
        <>
          <Circle cx="12" cy="5.5" r="1.2" fill={color} />
          <Circle cx="12" cy="12" r="1.2" fill={color} />
          <Circle cx="12" cy="18.5" r="1.2" fill={color} />
        </>
      );
    case "ellipsis":
      return (
        <>
          <Circle cx="6.5" cy="12" r="1.2" fill={color} />
          <Circle cx="12" cy="12" r="1.2" fill={color} />
          <Circle cx="17.5" cy="12" r="1.2" fill={color} />
        </>
      );
    case "magnifyingglass":
      return (
        <>
          <Circle cx="10.8" cy="10.8" r="5.8" {...strokeProps} />
          <Line x1="15.2" y1="15.2" x2="20" y2="20" {...strokeProps} />
        </>
      );
    case "add":
      return (
        <>
          <Line x1="12" y1="5" x2="12" y2="19" {...strokeProps} />
          <Line x1="5" y1="12" x2="19" y2="12" {...strokeProps} />
        </>
      );
    case "checkmark":
      return <Polyline points="5,12.5 10,17 19,7" {...strokeProps} />;
    case "edit":
      return (
        <>
          <Path d="M5 16.8 4.5 20l3.2-.5L18.8 8.4l-2.7-2.7L5 16.8Z" {...strokeProps} />
          <Line x1="14.7" y1="7.1" x2="17.4" y2="9.8" {...strokeProps} />
        </>
      );
    case "flag":
      return (
        <>
          <Line x1="6" y1="4" x2="6" y2="20" {...strokeProps} />
          <Path d="M6 5h11l-1.6 4L17 13H6" {...strokeProps} />
        </>
      );
    case "bookmark":
      return <Path d="M7 5.5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 17 5.5V20l-5-3.2L7 20V5.5Z" fill={color} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />;
    case "bookmark.border":
      return <Path d="M7 5.5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 17 5.5V20l-5-3.2L7 20V5.5Z" {...strokeProps} />;
    case "explore":
      return (
        <>
          <Circle cx="12" cy="12" r="8" {...strokeProps} />
          <Path d="m14.7 9.3-1.8 5.4-5.4 1.8 1.8-5.4 5.4-1.8Z" {...strokeProps} />
        </>
      );
    case "transport":
      return (
        <>
          <Rect x="5" y="4.5" width="14" height="13" rx="2.4" {...strokeProps} />
          <Line x1="7.5" y1="9" x2="16.5" y2="9" {...strokeProps} />
          <Circle cx="8.5" cy="14.5" r="1" fill={color} />
          <Circle cx="15.5" cy="14.5" r="1" fill={color} />
          <Line x1="8" y1="20" x2="10" y2="17.5" {...strokeProps} />
          <Line x1="16" y1="20" x2="14" y2="17.5" {...strokeProps} />
        </>
      );
    case "food":
      return (
        <>
          <Path d="M7 4v7M5 4v7M9 4v7M5 11h4v9" {...strokeProps} />
          <Path d="M16 4c2.1 2.1 2.1 5.5 0 7.6V20" {...strokeProps} />
        </>
      );
    case "interests":
      return (
        <>
          <Circle cx="8" cy="8" r="3" {...strokeProps} />
          <Circle cx="16" cy="8" r="3" {...strokeProps} />
          <Circle cx="12" cy="16" r="3" {...strokeProps} />
        </>
      );
    case "contact":
      return (
        <>
          <Path d="M7.2 5.2h3l1.4 3.4-2 1.2a11 11 0 0 0 4.6 4.6l1.2-2 3.4 1.4v3a2 2 0 0 1-2.2 2C9.4 18.1 5.9 14.6 5.2 7.4a2 2 0 0 1 2-2.2Z" {...strokeProps} />
        </>
      );
    case "weather":
      return (
        <>
          <Path d="M7.3 17.2h9.1a3.7 3.7 0 0 0 .5-7.4A5.2 5.2 0 0 0 6.8 11a3.1 3.1 0 0 0 .5 6.2Z" {...strokeProps} />
          <Path d="M8.8 8.4a4.4 4.4 0 0 1 6.5-2.3" {...strokeProps} />
        </>
      );
    case "low-pressure":
      return (
        <>
          <Circle cx="12" cy="12" r="8" {...strokeProps} />
          <Path d="M8.5 13.8c1.8 2 5.2 2 7 0" {...strokeProps} />
          <Circle cx="9" cy="10" r=".8" fill={color} />
          <Circle cx="15" cy="10" r=".8" fill={color} />
        </>
      );
    case "experience":
      return <Polygon points="12,4.2 14.3,9 19.6,9.7 15.8,13.4 16.7,18.7 12,16.2 7.3,18.7 8.2,13.4 4.4,9.7 9.7,9" {...strokeProps} />;
    case "flexible":
      return (
        <>
          <Path d="M6 8.5A6.8 6.8 0 0 1 18 7" {...strokeProps} />
          <Polyline points="18,3.8 18,7 14.8,7" {...strokeProps} />
          <Path d="M18 15.5A6.8 6.8 0 0 1 6 17" {...strokeProps} />
          <Polyline points="6,20.2 6,17 9.2,17" {...strokeProps} />
        </>
      );
    case "volume":
      return (
        <>
          <Path d="M5 9.5h3.2L13 5.8v12.4l-4.8-3.7H5v-5Z" {...strokeProps} />
          <Path d="M16 9c1.1 1.7 1.1 4.3 0 6M18.6 7c2.1 3 2.1 7 0 10" {...strokeProps} />
        </>
      );
    case "volume.off":
      return (
        <>
          <Path d="M5 9.5h3.2L13 5.8v12.4l-4.8-3.7H5v-5Z" {...strokeProps} />
          <Line x1="17" y1="10" x2="21" y2="14" {...strokeProps} />
          <Line x1="21" y1="10" x2="17" y2="14" {...strokeProps} />
        </>
      );
    case "help":
    default:
      return (
        <>
          <Circle cx="12" cy="12" r="8" {...strokeProps} />
          <Path d="M9.6 9.3A2.6 2.6 0 0 1 12 7.8c1.6 0 2.8 1 2.8 2.4 0 1.1-.6 1.8-1.7 2.5-.8.5-1.1.9-1.1 1.8" {...strokeProps} />
          <Circle cx="12" cy="17.2" r=".7" fill={color} />
        </>
      );
  }
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: ColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = ICON_SYMBOL_MAPPING[name] ? name : "help";

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style} pointerEvents="none">
      {renderIconShape(iconName, { color, strokeWidth: Math.max(1.7, size / 12) })}
    </Svg>
  );
}
