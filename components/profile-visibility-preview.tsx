import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ProfileAvatar, getEffectiveBlurLevel } from "@/components/profile-avatar";
import type {
  CommunicationPreference,
  ContactPreference,
  GroupSizePreference,
  NsnBlurLevel,
  NsnComfortMode,
  PhotoRecordingComfortPreference,
  ProfileGender,
  ProfileNameDisplayMode,
  SocialEnergyPreference,
} from "@/lib/app-settings";
import { useAppSettings } from "@/lib/app-settings";
import { formatBroadLocalArea } from "@/lib/australian-localities";
import { nsnColors } from "@/lib/nsn-data";
import { profileVisibilityPreviewCopy } from "@/lib/profile-visibility-copy";
import type { SoftHelloComfortPreference } from "@/lib/softhello-mvp";

export { getBlurRadius, getEffectiveBlurLevel } from "@/components/profile-avatar";

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
  photoRecordingComfortPreferences?: PhotoRecordingComfortPreference[];
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
  personalityPresenceLabels?: string[];
  showPersonalityPresence?: boolean;
  editActions?: Partial<Record<ProfilePreviewEditTarget, ProfilePreviewEditAction>>;
  isDay?: boolean;
  isRtl?: boolean;
};

export type ProfilePreviewEditTarget =
  | "localArea"
  | "age"
  | "preferredAgeRange"
  | "gender"
  | "vibes"
  | "interests"
  | "comfort"
  | "contact"
  | "socialEnergy"
  | "communication"
  | "groupSize"
  | "photoRecording"
  | "verificationTrust"
  | "personalityPresence";

export type ProfilePreviewEditAction = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

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
  photoRecordingComfortPreferences = [],
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
  personalityPresenceLabels = [],
  showPersonalityPresence = false,
  editActions = {},
  isDay = false,
  isRtl = false,
}: ProfileVisibilityPreviewProps) {
  const { brandTheme } = useAppSettings();
  const name = displayName.trim() || "NSN member";
  const broadSuburb = formatBroadLocalArea(suburb);
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
  const visibleInterests = privateProfile || minimalProfileView || !showInterests ? [] : interests.slice(0, 4);
  const visibleComfort = privateProfile || minimalProfileView || !showComfortPreferences ? [] : comfortPreferences.slice(0, 3);
  const visibleContact = privateProfile || minimalProfileView || !showComfortPreferences ? [] : contactPreferences.slice(0, 3);
  const visibleCommunication = privateProfile || minimalProfileView || !showComfortPreferences ? [] : communicationPreferences.slice(0, 3);
  const visibleSocialEnergy = privateProfile || minimalProfileView || !showComfortPreferences ? "" : socialEnergyPreference;
  const visibleGroupSize = privateProfile || minimalProfileView || !showComfortPreferences ? "" : groupSizePreference;
  const visiblePhotoRecording = privateProfile || minimalProfileView || !showComfortPreferences ? [] : photoRecordingComfortPreferences.slice(0, 2);
  const visibleVibes = privateProfile || minimalProfileView || !showVibes ? [] : vibes.slice(0, 3);
  const visiblePersonalityPresence =
    privateProfile || minimalProfileView || !showPersonalityPresence ? [] : personalityPresenceLabels.slice(0, 3);
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
  const renderEditAction = (target: ProfilePreviewEditTarget) => {
    const action = editActions[target];
    if (!action) return null;

    return (
      <TouchableOpacity
        activeOpacity={0.78}
        onPress={action.onPress}
        style={[styles.editPill, isDay && styles.dayEditPill]}
        accessibilityRole="button"
        accessibilityLabel={action.accessibilityLabel ?? action.label}
      >
        <Text style={[styles.editPillText, isDay && styles.dayEditPillText]}>{action.label}</Text>
      </TouchableOpacity>
    );
  };
  const renderDetailLine = (target: ProfilePreviewEditTarget | null, copy: string, emphasis = false) => (
    <View style={[styles.detailLine, isRtl && styles.rtlRow]}>
      <Text
        style={[
          emphasis ? styles.detail : styles.copy,
          brandTheme.typography[emphasis ? "label" : "caption"],
          isDay && (emphasis ? styles.dayTitle : styles.dayMuted),
          isRtl && styles.rtlText,
        ]}
      >
        {copy}
      </Text>
      {target ? renderEditAction(target) : null}
    </View>
  );

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
      <View style={[styles.header, isRtl && styles.rtlRow]}>
        <ProfileAvatar
          displayName={name}
          profilePhotoUri={profilePhotoUri}
          size={64}
          privateProfile={privateProfile}
          forceBlur={shouldBlur}
          effectiveBlurLevel={effectiveBlurLevel}
          isDay={isDay}
        />
        <View style={styles.identity}>
          <Text style={[styles.name, brandTheme.typography.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>
            {privateProfile ? profileVisibilityPreviewCopy.privateProfileName : publicName}
          </Text>
          <Text style={[styles.status, brandTheme.typography.caption, isDay && styles.dayMuted, isRtl && styles.rtlText]}>{status}</Text>
        </View>
      </View>

      {privateProfile ? (
        <Text style={[styles.copy, brandTheme.typography.caption, isDay && styles.dayMuted, isRtl && styles.rtlText]}>
          {profileVisibilityPreviewCopy.privateProfileNote}
        </Text>
      ) : (
        <View style={styles.detailStack}>
          {showSuburbArea && broadSuburb ? renderDetailLine("localArea", `Local Area: ${broadSuburb}`, true) : null}
          {showAge && age ? renderDetailLine("age", `Age: ${age}`) : null}
          {showPreferredAgeRange && preferredAgeMin && preferredAgeMax ? (
            renderDetailLine("preferredAgeRange", `Age comfort range: ${preferredAgeMin}-${preferredAgeMax}`)
          ) : null}
          {showGender && gender !== "Not specified" ? renderDetailLine("gender", `Gender: ${gender}`) : null}
          {visibleAbout ? renderDetailLine(null, visibleAbout) : null}
          {visibleVibes.length ? renderDetailLine("vibes", `Vibes: ${visibleVibes.join(", ")}`) : null}
          {visibleInterests.length ? renderDetailLine("interests", `Interests: ${visibleInterests.join(", ")}`) : null}
          {visibleComfort.length ? renderDetailLine("comfort", `Comfort: ${visibleComfort.join(", ")}`) : null}
          {visibleContact.length ? renderDetailLine("contact", `Contact: ${visibleContact.join(", ")}`) : null}
          {visibleSocialEnergy ? renderDetailLine("socialEnergy", `Social energy: ${visibleSocialEnergy}`) : null}
          {visibleCommunication.length ? renderDetailLine("communication", `Communication: ${visibleCommunication.join(", ")}`) : null}
          {visibleGroupSize ? renderDetailLine("groupSize", `Group size: ${visibleGroupSize}`) : null}
          {visiblePhotoRecording.length ? renderDetailLine("photoRecording", `Photo & recording: ${visiblePhotoRecording.join(", ")}`) : null}
          {visiblePersonalityPresence.length ? renderDetailLine("personalityPresence", `Personality & Presence: ${visiblePersonalityPresence.join(", ")}`) : null}
          {verifiedButPrivate ? renderDetailLine("verificationTrust", profileVisibilityPreviewCopy.prototypeDetailsNote) : null}
          {minimalProfileView ? renderDetailLine(null, profileVisibilityPreviewCopy.minimalProfileViewNote) : null}
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
    width: "100%",
    alignSelf: "center",
  },
  dayCard: { backgroundColor: "#FFFFFF", borderColor: "#D8E1EA" },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  identity: { flex: 1 },
  name: { color: nsnColors.text, fontSize: 16, fontWeight: "900", lineHeight: 22 },
  status: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", lineHeight: 17, marginTop: 2 },
  detailStack: { gap: 6 },
  detailLine: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  detail: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  copy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  editPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(144, 174, 229, 0.55)",
    backgroundColor: "rgba(83, 113, 172, 0.28)",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  editPillText: { color: "#DDE8FF", fontSize: 10, fontWeight: "900", lineHeight: 13 },
  dayEditPill: { borderColor: "#8BA0BF", backgroundColor: "#E7EEF8" },
  dayEditPillText: { color: "#24436F" },
  dayTitle: { color: "#0B1220" },
  dayMuted: { color: "#53677A" },
  rtlRow: { flexDirection: "row-reverse" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
});
