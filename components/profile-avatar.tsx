import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import type { NsnBlurLevel, NsnComfortMode } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";

export function getBlurRadius(level: NsnBlurLevel) {
  if (level === "Soft blur") return 6;
  if (level === "Strong blur") return 18;
  return 12;
}

export function getEffectiveBlurLevel(comfortMode: NsnComfortMode, blurLevel: NsnBlurLevel, warmUpLowerBlur: boolean) {
  return comfortMode === "Warm Up Mode" && warmUpLowerBlur ? "Soft blur" : blurLevel;
}

export type ProfileAvatarProps = {
  displayName?: string;
  avatarText?: string;
  profilePhotoUri?: string | null;
  size?: number;
  tone?: string;
  isDay?: boolean;
  privateProfile?: boolean;
  blurProfilePhoto?: boolean;
  blurLevel?: NsnBlurLevel;
  comfortMode?: NsnComfortMode;
  warmUpLowerBlur?: boolean;
  effectiveBlurLevel?: NsnBlurLevel;
  forceBlur?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ProfileAvatar({
  displayName = "NSN member",
  avatarText,
  profilePhotoUri = null,
  size = 48,
  tone = "#1590C9",
  isDay = false,
  privateProfile = false,
  blurProfilePhoto = false,
  blurLevel = "Medium blur",
  comfortMode = "Comfort Mode",
  warmUpLowerBlur = true,
  effectiveBlurLevel,
  forceBlur,
  style,
}: ProfileAvatarProps) {
  const initial = (avatarText || displayName.trim().charAt(0) || "N").toUpperCase();
  const shouldBlur = forceBlur ?? Boolean(privateProfile || blurProfilePhoto || comfortMode === "Comfort Mode");
  const visibleBlurLevel = effectiveBlurLevel ?? getEffectiveBlurLevel(comfortMode, blurLevel, warmUpLowerBlur);
  const initialBlurOpacity = visibleBlurLevel === "Strong blur" ? 0.5 : visibleBlurLevel === "Soft blur" ? 0.24 : 0.36;
  const borderRadius = size / 2;
  const fontSize = Math.max(11, Math.round(size * 0.42));

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: privateProfile ? (isDay ? "#DCE5EE" : "#1B2A42") : tone,
        },
        privateProfile && styles.privateAvatar,
        isDay && styles.dayAvatar,
        style,
      ]}
    >
      {profilePhotoUri ? (
        <Image
          source={{ uri: profilePhotoUri }}
          style={{ width: size, height: size, borderRadius }}
          blurRadius={shouldBlur ? getBlurRadius(visibleBlurLevel) : 0}
        />
      ) : (
        <Text style={[styles.initial, { fontSize, lineHeight: Math.round(size * 0.52) }, shouldBlur && styles.blurredInitial, privateProfile && styles.privateInitial, isDay && styles.dayInitial]}>
          {initial}
        </Text>
      )}
      {shouldBlur && !profilePhotoUri ? <View pointerEvents="none" style={[styles.privateOverlay, { borderRadius, opacity: initialBlurOpacity }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nsnColors.primary,
  },
  dayAvatar: {
    borderWidth: 1,
    borderColor: "rgba(83,108,158,0.2)",
  },
  privateAvatar: {
    borderWidth: 1,
    borderColor: "rgba(166,177,199,0.32)",
  },
  initial: {
    color: "#FFFFFF",
    fontWeight: "900",
    textAlign: "center",
  },
  dayInitial: {
    color: "#0B1220",
  },
  privateInitial: {
    color: nsnColors.muted,
  },
  blurredInitial: {
    opacity: 0.32,
  },
  privateOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11,22,38,0.18)",
  },
});
