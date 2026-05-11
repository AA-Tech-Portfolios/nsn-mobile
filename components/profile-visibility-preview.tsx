import { Image, StyleSheet, Text, View } from "react-native";

import type {
  CommunicationPreference,
  ContactPreference,
  GroupSizePreference,
  NsnBlurLevel,
  NsnComfortMode,
  ProfileGender,
  ProfileNameDisplayMode,
  SocialEnergyPreference,
} from "@/lib/app-settings";
import { useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";
import type { SoftHelloComfortPreference } from "@/lib/softhello-mvp";

export type ProfileVisibilityPreviewProps = {
  displayName: string;
  middleName?: string;
  lastName?: string;
  suburb: string;
  age?: number | null;
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  gender?: ProfileGender;
  middleNameDisplay?: ProfileNameDisplayMode;
  lastNameDisplay?: ProfileNameDisplayMode;
  interests: string[];
  comfortPreferences: SoftHelloComfortPreference[];
  contactPreferences?: ContactPreference[];
  socialEnergyPreference?: SocialEnergyPreference;
  communicationPreferences?: CommunicationPreference[];
  groupSizePreference?: GroupSizePreference;
  verifiedButPrivate?: boolean;
  comfortMode: NsnComfortMode;
  profilePhotoUri: string | null;
  privateProfile: boolean;
  blurProfilePhoto: boolean;
  blurLevel: NsnBlurLevel;
  warmUpLowerBlur: boolean;
  showSuburbArea: boolean;
  showMiddleName?: boolean;
  showLastName?: boolean;
  showAge?: boolean;
  showPreferredAgeRange?: boolean;
  showGender?: boolean;
  showInterests: boolean;
  showComfortPreferences: boolean;
  minimalProfileView: boolean;
  aboutMe?: string;
  showAboutMe?: boolean;
  vibes?: string[];
  showVibes?: boolean;
  isDay?: boolean;
};

export function getBlurRadius(level: NsnBlurLevel) {
  if (level === "Soft blur") return 6;
  if (level === "Strong blur") return 18;
  return 12;
}

export function getEffectiveBlurLevel(comfortMode: NsnComfortMode, blurLevel: NsnBlurLevel, warmUpLowerBlur: boolean) {
  return comfortMode === "Warm Up Mode" && warmUpLowerBlur ? "Soft blur" : blurLevel;
}

export function ProfileVisibilityPreview({
  displayName,
  middleName = "",
  lastName = "",
  suburb,
  age = null,
  preferredAgeMin,
  preferredAgeMax,
  gender = "Not specified",
  middleNameDisplay,
  lastNameDisplay,
  interests,
  comfortPreferences,
  contactPreferences = [],
  socialEnergyPreference,
  communicationPreferences = [],
  groupSizePreference,
  verifiedButPrivate = true,
  comfortMode,
  profilePhotoUri,
  privateProfile,
  blurProfilePhoto,
  blurLevel,
  warmUpLowerBlur,
  showSuburbArea,
  showMiddleName = false,
  showLastName = false,
  showAge = false,
  showPreferredAgeRange = false,
  showGender = false,
  showInterests,
  showComfortPreferences,
  minimalProfileView,
  aboutMe = "",
  showAboutMe = false,
  vibes = [],
  showVibes = false,
  isDay = false,
}: ProfileVisibilityPreviewProps) {
  const { brandTheme } = useAppSettings();
  const name = displayName.trim() || "NSN member";
  const formatNamePart = (value: string, mode: ProfileNameDisplayMode | undefined, legacyVisible: boolean) => {
    const trimmed = value.trim();
    const displayMode = mode ?? (legacyVisible ? "Full" : "Hidden");
    if (!trimmed || displayMode === "Hidden") return "";
    if (displayMode === "Initial") return `${trimmed.charAt(0).toUpperCase()}.`;
    return trimmed;
  };
  const publicName = [
    name,
    formatNamePart(middleName, middleNameDisplay, showMiddleName),
    formatNamePart(lastName, lastNameDisplay, showLastName),
  ].filter(Boolean).join(" ");
  const initial = name.charAt(0).toUpperCase() || "N";
  const visibleInterests = privateProfile || minimalProfileView || !showInterests ? [] : interests.slice(0, 4);
  const visibleComfort = privateProfile || minimalProfileView || !showComfortPreferences ? [] : comfortPreferences.slice(0, 3);
  const visibleContact = privateProfile || minimalProfileView || !showComfortPreferences ? [] : contactPreferences.slice(0, 3);
  const visibleCommunication = privateProfile || minimalProfileView || !showComfortPreferences ? [] : communicationPreferences.slice(0, 3);
  const visibleSocialEnergy = privateProfile || minimalProfileView || !showComfortPreferences ? "" : socialEnergyPreference;
  const visibleGroupSize = privateProfile || minimalProfileView || !showComfortPreferences ? "" : groupSizePreference;
  const visibleVibes = privateProfile || minimalProfileView || !showVibes ? [] : vibes.slice(0, 3);
  const visibleAbout = privateProfile || minimalProfileView || !showAboutMe ? "" : aboutMe.trim();
  const shouldBlur = privateProfile || comfortMode === "Comfort Mode" || (comfortMode === "Warm Up Mode" && blurProfilePhoto);
  const effectiveBlurLevel = getEffectiveBlurLevel(comfortMode, blurLevel, warmUpLowerBlur);
  const status = privateProfile
    ? "Private profile"
    : comfortMode === "Comfort Mode"
      ? "Matched/shared visibility only"
      : comfortMode === "Warm Up Mode"
        ? "Partially visible at this event"
        : "Event-visible profile";

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: brandTheme.radius.card,
          padding: brandTheme.spacing.cardPadding,
          gap: brandTheme.spacing.cardGap,
          maxWidth: brandTheme.layout.cardMaxWidth,
        },
        isDay && styles.dayCard,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          {profilePhotoUri ? (
            <Image source={{ uri: profilePhotoUri }} style={styles.avatarImage} blurRadius={shouldBlur ? getBlurRadius(effectiveBlurLevel) : 0} />
          ) : (
            <Text style={styles.avatarInitial}>{initial}</Text>
          )}
        </View>
        <View style={styles.identity}>
          <Text style={[styles.name, brandTheme.typography.sectionTitle, isDay && styles.dayTitle]}>{privateProfile ? "Private NSN member" : publicName}</Text>
          <Text style={[styles.status, brandTheme.typography.caption, isDay && styles.dayMuted]}>{status}</Text>
        </View>
      </View>

      {privateProfile ? (
        <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>
          Only your RSVP and safety basics are visible until you choose to share more.
        </Text>
      ) : (
        <View style={styles.detailStack}>
          {showSuburbArea && suburb.trim() ? <Text style={[styles.detail, brandTheme.typography.label, isDay && styles.dayTitle]}>{suburb.trim()}</Text> : null}
          {showAge && age ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Age: {age}</Text> : null}
          {showPreferredAgeRange && preferredAgeMin && preferredAgeMax ? (
            <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Preferred age range: {preferredAgeMin}-{preferredAgeMax}</Text>
          ) : null}
          {showGender && gender !== "Not specified" ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Gender: {gender}</Text> : null}
          {visibleAbout ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>{visibleAbout}</Text> : null}
          {visibleVibes.length ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Vibes: {visibleVibes.join(", ")}</Text> : null}
          {visibleInterests.length ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Interests: {visibleInterests.join(", ")}</Text> : null}
          {visibleComfort.length ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Comfort: {visibleComfort.join(", ")}</Text> : null}
          {visibleContact.length ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Contact: {visibleContact.join(", ")}</Text> : null}
          {visibleSocialEnergy ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Social energy: {visibleSocialEnergy}</Text> : null}
          {visibleCommunication.length ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Communication: {visibleCommunication.join(", ")}</Text> : null}
          {visibleGroupSize ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Group size: {visibleGroupSize}</Text> : null}
          {verifiedButPrivate ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Verified, but private: trust status can be checked without opening the full profile.</Text> : null}
          {minimalProfileView ? <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted]}>Minimal view is on, so only basics are shown.</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    padding: 14,
    gap: 12,
  },
  dayCard: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nsnColors.primary,
  },
  avatarImage: { width: 64, height: 64, borderRadius: 32 },
  avatarInitial: { color: "#FFFFFF", fontSize: 27, fontWeight: "900" },
  identity: { flex: 1 },
  name: { color: nsnColors.text, fontSize: 16, fontWeight: "900", lineHeight: 22 },
  status: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", lineHeight: 17, marginTop: 2 },
  detailStack: { gap: 6 },
  detail: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  copy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  dayTitle: { color: "#0B1220" },
  dayMuted: { color: "#53677A" },
});
