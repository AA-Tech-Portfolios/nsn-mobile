import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  backgroundCommunityOptions,
  backgroundStudyAreaOptions,
  backgroundStudyStatusOptions,
  backgroundVisibilityOptions,
  backgroundWorkOptions,
  backgroundWorkRhythmOptions,
  communicationPreferenceOptions,
  getLifeContextFreshnessLabel,
  groupSizePreferenceOptions,
  lifeContextCurrentStateOptions,
  lifeContextFieldOptions,
  lifeContextLearningOptions,
  photoRecordingComfortOptions,
  physicalContactComfortOptions,
  socialEnergyOptions,
  type BackgroundCommunityPreference,
  type BackgroundStudyAreaPreference,
  type BackgroundStudyStatusPreference,
  type BackgroundVisibilityPreference,
  type BackgroundWorkPreference,
  type BackgroundWorkRhythmPreference,
  type CommunicationPreference,
  type ContactPreference,
  type GroupSizePreference,
  type LifeContextCurrentStatePreference,
  type LifeContextFieldPreference,
  type LifeContextLearningPreference,
  type NsnComfortMode,
  type PhotoRecordingComfortPreference,
  type PhysicalContactComfortPreference,
  type SocialEnergyPreference,
  type SoftHelloIntent,
  type TransportationMethod,
  useAppSettings,
} from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";
import {
  foodPreferenceGroups,
  getFoodBeverageOptionsByGroup,
  getFoodPreferenceGroupSelectedCount,
  getSelectedFoodPreferenceLabels,
  searchFoodBeveragePreferences,
  type FoodBeveragePreference,
  type FoodPreferenceGroupId,
} from "@/lib/preferences/food-preferences";
import {
  getInterestCategorySelectedCount,
  getInterestComfortTagLabels,
  getInterestOptionsByCategory,
  getInterestPreference,
  getInterestPreferenceLabels,
  getSelectedInterestLabels,
  interestCategories,
  interestComfortTags,
  searchInterestPreferences,
  type InterestCategoryId,
  type InterestComfortTagId,
  type InterestPreference,
} from "@/lib/preferences/interests";

type PreferenceSection = "overview" | "comfort" | "background" | "food" | "interests" | "transport" | "contact" | "location";

const preferenceSections: Record<PreferenceSection, { icon: string; title: string; copy: string }> = {
  overview: {
    icon: "🧭",
    title: "User preferences",
    copy: "Choose what makes local meetups feel easier. These settings stay prototype-safe and help shape recommendations without pretending to be a production matching engine.",
  },
  comfort: {
    icon: "🛡️",
    title: "Comfort & trust",
    copy: "Visibility, social energy, communication, group size, verification, photo comfort, and physical contact preferences in one calmer view.",
  },
  background: {
    icon: "ðŸŒ±",
    title: "Work, study & life context",
    copy: "Share what you're doing, learning, or interested in - only if you want to. Keep it broad, optional, and privacy-controlled.",
  },
  food: {
    icon: "🍽️",
    title: "Food & beverage",
    copy: "Food and drink preferences help NSN suggest comfortable meetups. This is not a food delivery or restaurant recommendation system.",
  },
  interests: {
    icon: "🎨",
    title: "Hobbies & interests",
    copy: "Interests help with low-pressure activity ideas and conversation starters without turning Profile into a quiz.",
  },
  transport: {
    icon: "🚆",
    title: "Transportation method",
    copy: "Share how you are likely to arrive so meeting points and event notes can feel clearer.",
  },
  contact: {
    icon: "💬",
    title: "Contact preference",
    copy: "Let others know the communication style that feels easiest before and around meetups.",
  },
  location: {
    icon: "📍",
    title: "Location preference",
    copy: "Keep your local area, discovery radius, and privacy signals easy to review.",
  },
};

const compactPanelBySection: Record<PreferenceSection, string> = {
  overview: "preferences",
  comfort: "comfortTrust",
  background: "backgroundCommunity",
  food: "foodBeverage",
  interests: "hobbiesInterests",
  transport: "preferences",
  contact: "preferences",
  location: "preferences",
};

const comfortModes: NsnComfortMode[] = ["Comfort Mode", "Warm Up Mode", "Open Mode"];
const transportOptions: Array<{ value: TransportationMethod; icon: string; copy: string }> = [
  { value: "Driving", icon: "🚗", copy: "I may need parking or a clear meeting point." },
  { value: "Public transport", icon: "🚆", copy: "Train, bus, metro, light rail, or ferry feels easiest." },
  { value: "Walking", icon: "🚶", copy: "I am nearby and arriving on foot." },
  { value: "Cycling", icon: "🚲", copy: "I may need somewhere reasonable to lock up." },
  { value: "Rideshare", icon: "🚙", copy: "A pickup or drop-off friendly spot helps." },
  { value: "Getting dropped off", icon: "🤝", copy: "Someone else is helping me get there." },
  { value: "Not sure yet", icon: "🧭", copy: "I will decide closer to the meetup." },
];
const contactOptions: Array<{ value: ContactPreference; icon: string; copy: string }> = [
  { value: "In person", icon: "👋", copy: "I prefer rapport to build naturally at the meetup." },
  { value: "Text", icon: "💬", copy: "A low-pressure message first feels useful." },
  { value: "Email", icon: "✉️", copy: "Slower, more considered notes work best." },
  { value: "Phone", icon: "☎️", copy: "A quick call can help me feel clearer." },
  { value: "Video", icon: "🎥", copy: "A short video hello can help before an in-person plan." },
];
const intentOptions: SoftHelloIntent[] = ["Friends", "Dating", "Both", "Exploring"];

const normalizePreferenceSection = (section?: string | string[]): PreferenceSection => {
  const value = Array.isArray(section) ? section[0] : section;

  return value === "comfort" ||
    value === "background" ||
    value === "food" ||
    value === "interests" ||
    value === "transport" ||
    value === "contact" ||
    value === "location"
    ? value
    : "overview";
};

export default function UserPreferencesScreen() {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const { width } = useWindowDimensions();
  const {
    comfortMode,
    socialEnergyPreference,
    communicationPreferences,
    groupSizePreference,
    photoRecordingComfortPreferences,
    physicalContactComfortPreferences,
    backgroundStudyStatuses,
    backgroundStudyAreas,
    backgroundStudyVisibility,
    backgroundWorkPreferences,
    backgroundWorkRhythms,
    backgroundWorkVisibility,
    backgroundCommunityPreferences,
    backgroundCommunityVisibility,
    lifeContextCurrentStates,
    lifeContextCurrentVisibility,
    lifeContextFields,
    lifeContextFieldVisibility,
    lifeContextLearningInterests,
    lifeContextLearningVisibility,
    lifeContextLastUpdatedAt,
    verifiedButPrivate,
    foodBeveragePreferenceIds,
    interestPreferenceIds,
    interestComfortTagsByInterest,
    transportationMethod,
    contactPreferences,
    suburb,
    intent,
    isNightMode,
    useApproximateLocation,
    setUseApproximateLocation,
    showDistanceInMeetups,
    setShowDistanceInMeetups,
    showSuburbArea,
    homeNearbyOnly,
    screenReaderHints,
    saveSoftHelloMvpState,
  } = useAppSettings();
  const isDay = !isNightMode;
  const isWide = width >= 900;
  const [activeSection, setActiveSection] = useState<PreferenceSection>(() => normalizePreferenceSection(section));
  const [foodSearch, setFoodSearch] = useState("");
  const [interestSearch, setInterestSearch] = useState("");
  const [openFoodGroups, setOpenFoodGroups] = useState<FoodPreferenceGroupId[]>(foodPreferenceGroups.filter((group) => group.defaultOpen).map((group) => group.id));
  const [showAllFoodGroups, setShowAllFoodGroups] = useState<FoodPreferenceGroupId[]>([]);
  const [openInterestCategories, setOpenInterestCategories] = useState<InterestCategoryId[]>(interestCategories.filter((category) => category.defaultOpen).map((category) => category.id));
  const [showAllInterestCategories, setShowAllInterestCategories] = useState<InterestCategoryId[]>([]);
  const [activeInterestComfortId, setActiveInterestComfortId] = useState<string | null>(interestPreferenceIds[0] ?? null);

  useEffect(() => {
    setActiveSection(normalizePreferenceSection(section));
  }, [section]);

  useEffect(() => {
    if (activeInterestComfortId && interestPreferenceIds.includes(activeInterestComfortId)) return;
    setActiveInterestComfortId(interestPreferenceIds[0] ?? null);
  }, [activeInterestComfortId, interestPreferenceIds]);

  const selectedFoodLabels = useMemo(() => getSelectedFoodPreferenceLabels(foodBeveragePreferenceIds, 10), [foodBeveragePreferenceIds]);
  const selectedInterestLabels = useMemo(() => getSelectedInterestLabels(interestPreferenceIds, 10), [interestPreferenceIds]);
  const selectedInterestOptions = useMemo(
    () => interestPreferenceIds.map((id) => getInterestPreference(id)).filter((option): option is InterestPreference => Boolean(option)),
    [interestPreferenceIds]
  );
  const activeInterestForComfort = activeInterestComfortId ? getInterestPreference(activeInterestComfortId) : null;
  const foodSearchResults = useMemo(() => searchFoodBeveragePreferences(foodSearch), [foodSearch]);
  const interestSearchResults = useMemo(() => searchInterestPreferences(interestSearch), [interestSearch]);
  const activeMeta = preferenceSections[activeSection];
  const lifeContextFreshness = useMemo(() => getLifeContextFreshnessLabel(lifeContextLastUpdatedAt), [lifeContextLastUpdatedAt]);

  const showSection = (nextSection: PreferenceSection) => {
    setActiveSection(nextSection);
  };

  const openCompactView = () => {
    router.replace({ pathname: "/(tabs)/profile", params: { menu: compactPanelBySection[activeSection] } } as never);
  };

  const toggleFoodPreference = async (preferenceId: string) => {
    const nextPreferences = foodBeveragePreferenceIds.includes(preferenceId)
      ? foodBeveragePreferenceIds.filter((item) => item !== preferenceId)
      : [...foodBeveragePreferenceIds, preferenceId];

    await saveSoftHelloMvpState({ foodBeveragePreferenceIds: nextPreferences });
  };

  const toggleInterestPreference = async (preferenceId: string) => {
    const isSelected = interestPreferenceIds.includes(preferenceId);
    const nextPreferences = isSelected ? interestPreferenceIds.filter((item) => item !== preferenceId) : [...interestPreferenceIds, preferenceId];
    const nextComfortTags = { ...interestComfortTagsByInterest };

    if (isSelected) {
      delete nextComfortTags[preferenceId];
    }

    await saveSoftHelloMvpState({
      interestPreferenceIds: nextPreferences,
      interestComfortTagsByInterest: nextComfortTags,
      hobbiesInterests: getInterestPreferenceLabels(nextPreferences),
    });

    if (!isSelected) {
      setActiveInterestComfortId(preferenceId);
    }
  };

  const toggleInterestComfortTag = async (interestId: string, tagId: InterestComfortTagId) => {
    const currentTags = interestComfortTagsByInterest[interestId] ?? [];
    const nextTags = currentTags.includes(tagId) ? currentTags.filter((item) => item !== tagId) : [...currentTags, tagId];
    const nextComfortTags = { ...interestComfortTagsByInterest, [interestId]: nextTags };

    if (!nextTags.length) {
      delete nextComfortTags[interestId];
    }

    await saveSoftHelloMvpState({ interestComfortTagsByInterest: nextComfortTags });
  };

  const toggleCommunicationPreference = async (preference: CommunicationPreference) => {
    const nextPreferences = communicationPreferences.includes(preference)
      ? communicationPreferences.filter((item) => item !== preference)
      : [...communicationPreferences, preference];

    await saveSoftHelloMvpState({ communicationPreferences: nextPreferences.length ? nextPreferences : ["Details only"] });
  };

  const togglePhotoRecordingPreference = async (preference: PhotoRecordingComfortPreference) => {
    const nextPreferences = photoRecordingComfortPreferences.includes(preference)
      ? photoRecordingComfortPreferences.filter((item) => item !== preference)
      : [...photoRecordingComfortPreferences, preference];

    await saveSoftHelloMvpState({ photoRecordingComfortPreferences: nextPreferences.length ? nextPreferences : ["Ask me first"] });
  };

  const togglePhysicalContactPreference = async (preference: PhysicalContactComfortPreference) => {
    const nextPreferences = physicalContactComfortPreferences.includes(preference)
      ? physicalContactComfortPreferences.filter((item) => item !== preference)
      : [...physicalContactComfortPreferences, preference];

    await saveSoftHelloMvpState({ physicalContactComfortPreferences: nextPreferences.length ? nextPreferences : ["Ask first"] });
  };

  const toggleBackgroundListItem = <T extends string>(current: T[], option: T, exclusiveOptions: T[] = []) => {
    if (current.includes(option)) {
      return current.filter((item) => item !== option);
    }

    if (option === ("Prefer not to say" as T) || exclusiveOptions.includes(option)) {
      return [option];
    }

    return [...current.filter((item) => item !== ("Prefer not to say" as T) && !exclusiveOptions.includes(item)), option];
  };

  const toggleBackgroundStudyStatus = async (preference: BackgroundStudyStatusPreference) => {
    await saveSoftHelloMvpState({ backgroundStudyStatuses: toggleBackgroundListItem(backgroundStudyStatuses, preference) });
  };

  const toggleBackgroundStudyArea = async (preference: BackgroundStudyAreaPreference) => {
    await saveSoftHelloMvpState({ backgroundStudyAreas: toggleBackgroundListItem(backgroundStudyAreas, preference) });
  };

  const toggleBackgroundWorkPreference = async (preference: BackgroundWorkPreference) => {
    await saveSoftHelloMvpState({ backgroundWorkPreferences: toggleBackgroundListItem(backgroundWorkPreferences, preference, ["Not currently working"]) });
  };

  const toggleBackgroundWorkRhythm = async (preference: BackgroundWorkRhythmPreference) => {
    await saveSoftHelloMvpState({ backgroundWorkRhythms: toggleBackgroundListItem(backgroundWorkRhythms, preference) });
  };

  const toggleBackgroundCommunityPreference = async (preference: BackgroundCommunityPreference) => {
    await saveSoftHelloMvpState({ backgroundCommunityPreferences: toggleBackgroundListItem(backgroundCommunityPreferences, preference) });
  };

  const toggleLifeContextCurrentState = async (preference: LifeContextCurrentStatePreference) => {
    await saveSoftHelloMvpState({ lifeContextCurrentStates: toggleBackgroundListItem(lifeContextCurrentStates, preference) });
  };

  const toggleLifeContextField = async (preference: LifeContextFieldPreference) => {
    await saveSoftHelloMvpState({ lifeContextFields: toggleBackgroundListItem(lifeContextFields, preference) });
  };

  const toggleLifeContextLearningInterest = async (preference: LifeContextLearningPreference) => {
    await saveSoftHelloMvpState({ lifeContextLearningInterests: toggleBackgroundListItem(lifeContextLearningInterests, preference) });
  };

  const updateBackgroundVisibility = async (
    key: "backgroundStudyVisibility" | "backgroundWorkVisibility" | "backgroundCommunityVisibility",
    preference: BackgroundVisibilityPreference
  ) => {
    if (key === "backgroundStudyVisibility") {
      await saveSoftHelloMvpState({ backgroundStudyVisibility: preference });
      return;
    }

    if (key === "backgroundWorkVisibility") {
      await saveSoftHelloMvpState({ backgroundWorkVisibility: preference });
      return;
    }

    await saveSoftHelloMvpState({ backgroundCommunityVisibility: preference });
  };

  const updateLifeContextVisibility = async (
    key: "lifeContextCurrentVisibility" | "lifeContextFieldVisibility" | "lifeContextLearningVisibility",
    preference: BackgroundVisibilityPreference
  ) => {
    if (key === "lifeContextCurrentVisibility") {
      await saveSoftHelloMvpState({ lifeContextCurrentVisibility: preference });
      return;
    }

    if (key === "lifeContextFieldVisibility") {
      await saveSoftHelloMvpState({ lifeContextFieldVisibility: preference });
      return;
    }

    await saveSoftHelloMvpState({ lifeContextLearningVisibility: preference });
  };

  const toggleContactPreference = async (preference: ContactPreference) => {
    const nextPreferences = contactPreferences.includes(preference)
      ? contactPreferences.filter((item) => item !== preference)
      : [...contactPreferences, preference];

    await saveSoftHelloMvpState({ contactPreferences: nextPreferences.length ? nextPreferences : ["Text"] });
  };

  const toggleFoodGroup = (groupId: FoodPreferenceGroupId) => {
    setOpenFoodGroups((current) => (current.includes(groupId) ? current.filter((item) => item !== groupId) : [...current, groupId]));
  };

  const toggleFoodGroupLimit = (groupId: FoodPreferenceGroupId) => {
    setShowAllFoodGroups((current) => (current.includes(groupId) ? current.filter((item) => item !== groupId) : [...current, groupId]));
  };

  const toggleInterestCategory = (categoryId: InterestCategoryId) => {
    setOpenInterestCategories((current) => (current.includes(categoryId) ? current.filter((item) => item !== categoryId) : [...current, categoryId]));
  };

  const toggleInterestCategoryLimit = (categoryId: InterestCategoryId) => {
    setShowAllInterestCategories((current) => (current.includes(categoryId) ? current.filter((item) => item !== categoryId) : [...current, categoryId]));
  };

  const renderChip = ({
    key,
    label,
    active,
    onPress,
    icon,
    meta,
    wide,
  }: {
    key: string;
    label: string;
    active: boolean;
    onPress: () => void;
    icon?: string;
    meta?: string;
    wide?: boolean;
  }) => (
    <TouchableOpacity
      key={key}
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.chip, wide && styles.chipWide, isDay && styles.dayChip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityLabel={`${active ? "Selected: " : ""}${label}`}
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, isDay && styles.dayTitle, active && styles.activeText]} numberOfLines={wide ? 2 : 1}>
        {active ? "Selected: " : ""}
        {icon ? `${icon} ` : ""}
        {label}
      </Text>
      {meta ? <Text style={[styles.chipMeta, isDay && styles.dayMutedText, active && styles.activeText]} numberOfLines={2}>{meta}</Text> : null}
    </TouchableOpacity>
  );

  const renderFoodChip = (option: FoodBeveragePreference) =>
    renderChip({
      key: option.id,
      label: option.label,
      icon: option.icon,
      active: foodBeveragePreferenceIds.includes(option.id),
      onPress: () => toggleFoodPreference(option.id),
      meta: option.ageSensitive ? "Age-appropriate only" : option.subgroup,
    });

  const renderInterestChip = (option: InterestPreference) =>
    renderChip({
      key: option.id,
      label: option.label,
      icon: option.icon,
      active: interestPreferenceIds.includes(option.id),
      onPress: () => toggleInterestPreference(option.id),
    });

  const renderSectionCard = (title: string, copy: string, icon: string, children: ReactNode) => (
    <View key={title} style={[styles.card, isWide && styles.cardWide, isDay && styles.dayCard]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardIcon]}>{icon}</Text>
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{title}</Text>
          <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>{copy}</Text>
        </View>
      </View>
      {children}
    </View>
  );

  const renderSummary = (labels: string[], fallback: string) => (
    <View style={styles.summaryChips}>
      {labels.length ? labels.map((label) => <Text key={label} style={[styles.summaryChip, isDay && styles.daySummaryChip]}>{label}</Text>) : <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>{fallback}</Text>}
    </View>
  );

  const backgroundSelectedCount =
    lifeContextCurrentStates.length +
    lifeContextFields.length +
    lifeContextLearningInterests.length +
    backgroundStudyStatuses.length +
    backgroundStudyAreas.length +
    backgroundWorkPreferences.length +
    backgroundWorkRhythms.length +
    backgroundCommunityPreferences.length;
  const backgroundOverviewSummary = [
    lifeContextCurrentStates.length ? `Context: ${lifeContextCurrentStates.slice(0, 2).join(", ")}` : "",
    lifeContextFields.length ? `Fields: ${lifeContextFields.slice(0, 2).join(", ")}` : "",
    lifeContextLearningInterests.length ? `Learning: ${lifeContextLearningInterests.slice(0, 2).join(", ")}` : "",
    backgroundStudyAreas.length ? `Study: ${backgroundStudyAreas.slice(0, 2).join(", ")}` : "",
    backgroundWorkPreferences.length ? `Work: ${backgroundWorkPreferences.slice(0, 2).join(", ")}` : "",
    backgroundCommunityPreferences.length ? `Community: ${backgroundCommunityPreferences.slice(0, 2).join(", ")}` : "",
  ]
    .filter(Boolean)
    .join(" / ");

  const overviewCards = [
    { section: "comfort" as const, title: "Comfort & trust", icon: "🛡️", copy: `${comfortMode} / ${socialEnergyPreference} energy / ${groupSizePreference}`, meta: "Visibility, contact, verification, and consent." },
    { section: "food" as const, title: "Food & beverage", icon: "🍽️", copy: `${foodBeveragePreferenceIds.length} selected`, meta: selectedFoodLabels.join(", ") || "Cuisines, drinks, dietary needs, and avoidances." },
    { section: "interests" as const, title: "Hobbies & interests", icon: "🎨", copy: `${interestPreferenceIds.length} selected`, meta: selectedInterestLabels.join(", ") || "Activities, genres, and comfort-aware tags." },
    { section: "transport" as const, title: "Transportation method", icon: "🚆", copy: transportationMethod, meta: "Arrival comfort and meeting point notes." },
    { section: "contact" as const, title: "Contact preference", icon: "💬", copy: contactPreferences.join(", ") || "Text", meta: "How you prefer pre-meetup communication." },
    { section: "location" as const, title: "Location preference", icon: "📍", copy: suburb || "Sydney North Shore", meta: "Local area, radius, and profile location privacy." },
    { section: "background" as const, title: "Work, study & life context", icon: "ðŸŒ±", copy: backgroundSelectedCount ? `${backgroundSelectedCount} selected` : "Private by default", meta: backgroundOverviewSummary || "Broad work, study, learning, and volunteering context with visibility controls." },
  ];

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={[styles.content, isWide && styles.contentWide]} contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator>
        <View style={styles.topActions}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.replace({ pathname: "/(tabs)/profile", params: { menu: "preferences" } } as never)}
            style={[styles.iconButton, isDay && styles.dayIconButton]}
            accessibilityRole="button"
            accessibilityLabel="Back to Profile"
          >
            <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={23} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.78}
            onPress={openCompactView}
            style={[styles.secondaryButton, isDay && styles.dayChip]}
            accessibilityRole="button"
            accessibilityLabel="Open compact preference view"
          >
            <IconSymbol name="resize" color={isDay ? "#445E93" : "#DDE8FF"} size={17} />
            <Text style={[styles.secondaryButtonText, isDay && styles.dayTitle]}>{isWide ? "Compact view" : "Open compact view"}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.headerCard, isDay && styles.dayCard]}>
          <Text style={styles.headerIcon}>{activeMeta.icon}</Text>
          <View style={styles.headerText}>
            <Text style={[styles.eyebrow, isDay && styles.dayMutedText]}>NSN preferences</Text>
            <Text style={[styles.title, isDay && styles.dayTitle]}>{activeMeta.title}</Text>
            <Text style={[styles.copy, isDay && styles.dayMutedText]}>{activeMeta.copy}</Text>
          </View>
          <Text style={[styles.prototypeBadge, isDay && styles.daySummaryChip]}>Updated locally for this prototype</Text>
        </View>

        <ScrollView horizontal={!isWide} showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.sectionNav, isWide && styles.sectionNavWide]}>
          {(Object.keys(preferenceSections) as PreferenceSection[]).map((item) => {
            const meta = preferenceSections[item];
            const active = activeSection === item;

            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.78}
                onPress={() => showSection(item)}
                style={[styles.navPill, isDay && styles.dayChip, active && styles.navPillActive]}
                accessibilityRole="button"
                accessibilityLabel={`Open ${meta.title}`}
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.navPillText, isDay && styles.dayTitle, active && styles.activeText]}>{active ? "Selected: " : ""}{meta.icon} {meta.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {activeSection === "overview" ? (
          <View style={[styles.overviewGrid, isWide && styles.overviewGridWide]}>
            {overviewCards.map((item) => (
              <TouchableOpacity
                key={item.section}
                activeOpacity={0.82}
                onPress={() => showSection(item.section)}
                style={[styles.overviewCard, isWide && styles.overviewCardWide, isDay && styles.dayCard]}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.title}`}
              >
                <Text style={styles.overviewIcon}>{item.icon}</Text>
                <View style={styles.cardBody}>
                  <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{item.title}</Text>
                  <Text style={[styles.overviewValue, isDay && styles.dayTitle]}>{item.copy}</Text>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]} numberOfLines={3}>{item.meta}</Text>
                </View>
                <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={21} />
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {activeSection === "comfort" ? (
          <View style={[styles.cardGrid, isWide && styles.cardGridWide]}>
            {renderSectionCard("Progressive visibility", "Choose how much profile detail feels right. Copy is prototype-safe and does not imply production privacy enforcement.", "👁️", (
              <View style={styles.chipGrid}>
                {comfortModes.map((mode) => renderChip({ key: mode, label: mode, icon: mode === "Comfort Mode" ? "🛡️" : mode === "Warm Up Mode" ? "🌤️" : "✨", active: comfortMode === mode, onPress: () => saveSoftHelloMvpState({ comfortMode: mode }), wide: true }))}
              </View>
            ))}
            {renderSectionCard("Social energy", "Choose the kind of social energy that feels easiest today.", "🌿", (
              <View style={styles.chipGrid}>
                {socialEnergyOptions.map((option: SocialEnergyPreference) => renderChip({ key: option, label: option, icon: option === "Calm" ? "🌿" : option === "Balanced" ? "⚖️" : option === "Social" ? "💬" : "✨", active: socialEnergyPreference === option, onPress: () => saveSoftHelloMvpState({ socialEnergyPreference: option }) }))}
              </View>
            ))}
            {renderSectionCard("Communication preferences", "These help others understand how you like to communicate before a meetup.", "💬", (
              <View style={styles.chipGrid}>
                {communicationPreferenceOptions.map((option) => renderChip({ key: option, label: option, active: communicationPreferences.includes(option), onPress: () => toggleCommunicationPreference(option) }))}
              </View>
            ))}
            {renderSectionCard("Group size preferences", "Keep plans aligned with the number of people that feels comfortable.", "👥", (
              <View style={styles.chipGrid}>
                {groupSizePreferenceOptions.map((option: GroupSizePreference) => renderChip({ key: option, label: option, icon: option === "Small groups only" ? "👥" : undefined, active: groupSizePreference === option, onPress: () => saveSoftHelloMvpState({ groupSizePreference: option }) }))}
              </View>
            ))}
            {renderSectionCard("Verified but private", "Your contact/trust status can be checked without making your full profile fully open. No real verification provider is connected yet.", "✅", (
              <View style={styles.chipGrid}>
                {renderChip({ key: "verified-private-on", label: "Verified, but private", active: verifiedButPrivate, onPress: () => saveSoftHelloMvpState({ verifiedButPrivate: true }), wide: true })}
                {renderChip({ key: "verified-private-off", label: "Show normal trust status", active: !verifiedButPrivate, onPress: () => saveSoftHelloMvpState({ verifiedButPrivate: false }), wide: true })}
              </View>
            ))}
            {renderSectionCard("Photo & recording comfort", "NSN can show preferences and reminders, but it cannot fully prevent screenshots, photos, videos, or public sharing.", "📷", (
              <View style={styles.chipGrid}>
                {photoRecordingComfortOptions.map((option) => renderChip({ key: option, label: option, icon: option === "Ask me first" ? "📷" : undefined, active: photoRecordingComfortPreferences.includes(option), onPress: () => togglePhotoRecordingPreference(option), wide: true }))}
              </View>
            ))}
            {renderSectionCard("Physical contact comfort", "Let others know what kind of greeting or personal-space boundary feels easiest. This is a preference signal, not an enforcement system.", "🤝", (
              <View style={styles.chipGrid}>
                {physicalContactComfortOptions.map((option) => renderChip({ key: option, label: option, active: physicalContactComfortPreferences.includes(option), onPress: () => togglePhysicalContactPreference(option), wide: true }))}
              </View>
            ))}
          </View>
        ) : null}

        {activeSection === "background" ? (
          <View style={styles.preferenceStack}>
            <View style={[styles.searchCard, isDay && styles.dayCard]}>
              <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>Work, study & life context</Text>
              <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>
                Share what you're doing, learning, or interested in - only if you want to. NSN recommends broad context first, not exact workplaces, schools, schedules, or daily routines.
              </Text>
              <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>
                {lifeContextFreshness.label}
                {lifeContextFreshness.stale ? " - a gentle review might help keep this accurate." : ""}
              </Text>
              {renderSummary(
                [
                  ...lifeContextCurrentStates.slice(0, 3),
                  ...lifeContextFields.slice(0, 3),
                  ...lifeContextLearningInterests.slice(0, 3),
                  ...backgroundStudyAreas.slice(0, 3),
                  ...backgroundWorkPreferences.slice(0, 3),
                  ...backgroundCommunityPreferences.slice(0, 3),
                ],
                "No life context selected yet. Everything stays private by default."
              )}
            </View>
            <View style={[styles.cardGrid, isWide && styles.cardGridWide]}>
              {renderSectionCard("Current context", "Choose one or more broad current states. This should feel like gentle conversation context, not an occupation requirement.", "ðŸ§­", (
                <>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Visibility</Text>
                  <View style={styles.chipGrid}>
                    {backgroundVisibilityOptions.map((option) =>
                      renderChip({
                        key: `life-current-${option}`,
                        label: option,
                        active: lifeContextCurrentVisibility === option,
                        onPress: () => updateLifeContextVisibility("lifeContextCurrentVisibility", option),
                        wide: true,
                      })
                    )}
                  </View>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Current state</Text>
                  <View style={styles.chipGrid}>
                    {lifeContextCurrentStateOptions.map((option) =>
                      renderChip({
                        key: option,
                        label: option,
                        active: lifeContextCurrentStates.includes(option),
                        onPress: () => toggleLifeContextCurrentState(option),
                      })
                    )}
                  </View>
                </>
              ))}
              {renderSectionCard("Broad field or area", "Use broad categories only. NSN does not ask for exact employers, schools, organisations, or schedules in this prototype.", "ðŸ’¼", (
                <>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Visibility</Text>
                  <View style={styles.chipGrid}>
                    {backgroundVisibilityOptions.map((option) =>
                      renderChip({
                        key: `life-field-${option}`,
                        label: option,
                        active: lifeContextFieldVisibility === option,
                        onPress: () => updateLifeContextVisibility("lifeContextFieldVisibility", option),
                        wide: true,
                      })
                    )}
                  </View>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Broad categories</Text>
                  <View style={styles.chipGrid}>
                    {lifeContextFieldOptions.map((option) =>
                      renderChip({
                        key: option,
                        label: option,
                        active: lifeContextFields.includes(option),
                        onPress: () => toggleLifeContextField(option),
                      })
                    )}
                  </View>
                </>
              ))}
              {renderSectionCard("Interested in / learning about", "Share curiosity or learning topics that could become easy conversation starters.", "âœ¨", (
                <>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Visibility</Text>
                  <View style={styles.chipGrid}>
                    {backgroundVisibilityOptions.map((option) =>
                      renderChip({
                        key: `life-learning-${option}`,
                        label: option,
                        active: lifeContextLearningVisibility === option,
                        onPress: () => updateLifeContextVisibility("lifeContextLearningVisibility", option),
                        wide: true,
                      })
                    )}
                  </View>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Learning topics</Text>
                  <View style={styles.chipGrid}>
                    {lifeContextLearningOptions.map((option) =>
                      renderChip({
                        key: option,
                        label: option,
                        active: lifeContextLearningInterests.includes(option),
                        onPress: () => toggleLifeContextLearningInterest(option),
                      })
                    )}
                  </View>
                </>
              ))}
              {renderSectionCard("Study", "Use broad study context only. School or university names are not required and should stay private unless you choose otherwise later.", "ðŸ“š", (
                <>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Visibility</Text>
                  <View style={styles.chipGrid}>
                    {backgroundVisibilityOptions.map((option) =>
                      renderChip({
                        key: `study-${option}`,
                        label: option,
                        active: backgroundStudyVisibility === option,
                        onPress: () => updateBackgroundVisibility("backgroundStudyVisibility", option),
                        wide: true,
                      })
                    )}
                  </View>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Study status</Text>
                  <View style={styles.chipGrid}>
                    {backgroundStudyStatusOptions.map((option) =>
                      renderChip({
                        key: option,
                        label: option,
                        active: backgroundStudyStatuses.includes(option),
                        onPress: () => toggleBackgroundStudyStatus(option),
                      })
                    )}
                  </View>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Study areas</Text>
                  <View style={styles.chipGrid}>
                    {backgroundStudyAreaOptions.map((option) =>
                      renderChip({
                        key: option,
                        label: option,
                        active: backgroundStudyAreas.includes(option),
                        onPress: () => toggleBackgroundStudyArea(option),
                      })
                    )}
                  </View>
                </>
              ))}
              {renderSectionCard("Work", "Choose broad industry or rhythm signals. Exact employer names and schedules are not requested in this prototype.", "ðŸ’¼", (
                <>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Visibility</Text>
                  <View style={styles.chipGrid}>
                    {backgroundVisibilityOptions.map((option) =>
                      renderChip({
                        key: `work-${option}`,
                        label: option,
                        active: backgroundWorkVisibility === option,
                        onPress: () => updateBackgroundVisibility("backgroundWorkVisibility", option),
                        wide: true,
                      })
                    )}
                  </View>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Work area</Text>
                  <View style={styles.chipGrid}>
                    {backgroundWorkOptions.map((option) =>
                      renderChip({
                        key: option,
                        label: option,
                        active: backgroundWorkPreferences.includes(option),
                        onPress: () => toggleBackgroundWorkPreference(option),
                      })
                    )}
                  </View>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Work rhythm</Text>
                  <View style={styles.chipGrid}>
                    {backgroundWorkRhythmOptions.map((option) =>
                      renderChip({
                        key: option,
                        label: option,
                        active: backgroundWorkRhythms.includes(option),
                        onPress: () => toggleBackgroundWorkRhythm(option),
                      })
                    )}
                  </View>
                </>
              ))}
              {renderSectionCard("Volunteering & community", "Share broad community interests without naming exact organisations. Organisation names should remain optional and private by default if added later.", "ðŸ¤", (
                <>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Visibility</Text>
                  <View style={styles.chipGrid}>
                    {backgroundVisibilityOptions.map((option) =>
                      renderChip({
                        key: `community-${option}`,
                        label: option,
                        active: backgroundCommunityVisibility === option,
                        onPress: () => updateBackgroundVisibility("backgroundCommunityVisibility", option),
                        wide: true,
                      })
                    )}
                  </View>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Community areas</Text>
                  <View style={styles.chipGrid}>
                    {backgroundCommunityOptions.map((option) =>
                      renderChip({
                        key: option,
                        label: option,
                        active: backgroundCommunityPreferences.includes(option),
                        onPress: () => toggleBackgroundCommunityPreference(option),
                      })
                    )}
                  </View>
                </>
              ))}
              {renderSectionCard("Prototype matching notes", "Later, this can help suggest study groups, volunteering meetups, or shared industry conversation starters. No production recommendation engine is implied yet.", "ðŸ§­", (
                <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>
                  Work, study, and life context should stay optional, broad, and easy to hide. Tester feedback will decide whether this feels useful and safe.
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {activeSection === "food" ? (
          <View style={styles.preferenceStack}>
            <View style={[styles.searchCard, isDay && styles.dayCard]}>
              <View style={[styles.searchBox, isDay && styles.dayInput]}>
                <IconSymbol name="magnifyingglass" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                <TextInput
                  value={foodSearch}
                  onChangeText={setFoodSearch}
                  placeholder="Search pizza, bubble tea, halal, pistachio..."
                  placeholderTextColor={isDay ? "#6E7B88" : nsnColors.muted}
                  style={[styles.searchInput, isDay && styles.dayTitle]}
                  accessibilityLabel="Search food and beverage preferences"
                  selectionColor="#7786FF"
                  underlineColorAndroid="transparent"
                />
              </View>
              <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>Selected preferences</Text>
              {renderSummary(selectedFoodLabels, "No food preferences selected yet.")}
            </View>
            {foodSearch.trim() ? (
              renderSectionCard("Search results", "Matching cuisines, foods, drinks, dietary needs, and avoidances.", "🔎", (
                foodSearchResults.length ? <View style={styles.chipGrid}>{foodSearchResults.map(renderFoodChip)}</View> : <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>No matching preference yet. Try another food, drink, cuisine, dietary need, or avoidance.</Text>
              ))
            ) : (
              <View style={[styles.cardGrid, isWide && styles.cardGridWide]}>
                {foodPreferenceGroups.map((group) => {
                  const options = getFoodBeverageOptionsByGroup(group.id);
                  const selectedCount = getFoodPreferenceGroupSelectedCount(foodBeveragePreferenceIds, group.id);
                  const isOpen = openFoodGroups.includes(group.id);
                  const showAll = showAllFoodGroups.includes(group.id);
                  const visibleLimit = group.defaultVisible ?? 8;
                  const visibleOptions = showAll ? options : options.filter((option, index) => index < visibleLimit || foodBeveragePreferenceIds.includes(option.id));
                  const hiddenCount = options.length - visibleOptions.length;

                  return (
                    <View key={group.id} style={[styles.card, isWide && styles.cardWide, isDay && styles.dayCard]}>
                      <TouchableOpacity
                        activeOpacity={0.78}
                        onPress={() => toggleFoodGroup(group.id)}
                        style={styles.accordionHeader}
                        accessibilityRole="button"
                        accessibilityLabel={`${group.title} food preference group`}
                        accessibilityValue={{ text: isOpen ? "Expanded" : "Collapsed" }}
                      >
                        <Text style={styles.cardIcon}>{group.icon}</Text>
                        <View style={styles.cardBody}>
                          <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{group.title}</Text>
                          <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>{group.copy}</Text>
                        </View>
                        {selectedCount ? <Text style={[styles.countBadge, isDay && styles.daySummaryChip]}>{selectedCount}</Text> : null}
                        <IconSymbol name={isOpen ? "chevron.up" : "chevron.down"} color={isDay ? "#53677A" : nsnColors.muted} size={21} />
                      </TouchableOpacity>
                      {isOpen ? (
                        <>
                          {group.ageSensitive ? <Text style={[styles.notice, isDay && styles.dayMutedText]}>Alcohol preferences are optional and only relevant for age-appropriate events.</Text> : null}
                          <View style={styles.chipGrid}>{visibleOptions.map(renderFoodChip)}</View>
                          {hiddenCount > 0 || showAll ? (
                            <TouchableOpacity activeOpacity={0.78} onPress={() => toggleFoodGroupLimit(group.id)} style={[styles.showMoreButton, isDay && styles.dayChip]} accessibilityRole="button" accessibilityLabel={showAll ? `Show fewer ${group.title} options` : `Show more ${group.title} options`}>
                              <Text style={[styles.secondaryButtonText, isDay && styles.dayTitle]}>{showAll ? "Show fewer" : `Show ${hiddenCount} more`}</Text>
                            </TouchableOpacity>
                          ) : null}
                        </>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ) : null}

        {activeSection === "interests" ? (
          <View style={styles.preferenceStack}>
            <View style={[styles.searchCard, isDay && styles.dayCard]}>
              <View style={[styles.searchBox, isDay && styles.dayInput]}>
                <IconSymbol name="magnifyingglass" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                <TextInput
                  value={interestSearch}
                  onChangeText={setInterestSearch}
                  placeholder="Search anime, board games, walking, books..."
                  placeholderTextColor={isDay ? "#6E7B88" : nsnColors.muted}
                  style={[styles.searchInput, isDay && styles.dayTitle]}
                  accessibilityLabel="Search hobbies and interests"
                  selectionColor="#7786FF"
                  underlineColorAndroid="transparent"
                />
              </View>
              <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>Selected interests</Text>
              {renderSummary(selectedInterestLabels, "No hobbies or interests selected yet.")}
            </View>
            {renderSectionCard("Comfort modifiers", "Mark how each selected interest feels. These labels are prototype comfort signals for future matching and event planning.", "🌿", (
              activeInterestForComfort ? (
                <>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalChipRow}>
                    {selectedInterestOptions.slice(0, 12).map((option) =>
                      renderChip({ key: option.id, label: option.label, icon: option.icon, active: activeInterestForComfort.id === option.id, onPress: () => setActiveInterestComfortId(option.id) })
                    )}
                  </ScrollView>
                  <View style={styles.chipGrid}>
                    {interestComfortTags.map((tag) =>
                      renderChip({
                        key: tag.id,
                        label: tag.label,
                        active: (interestComfortTagsByInterest[activeInterestForComfort.id] ?? []).includes(tag.id),
                        onPress: () => toggleInterestComfortTag(activeInterestForComfort.id, tag.id),
                        meta: tag.copy,
                        wide: true,
                      })
                    )}
                  </View>
                </>
              ) : (
                <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>Select an interest below to add comfort modifiers.</Text>
              )
            ))}
            {interestSearch.trim() ? (
              renderSectionCard("Search results", "Matching interests, genres, categories, and aliases.", "🔎", (
                interestSearchResults.length ? <View style={styles.chipGrid}>{interestSearchResults.map(renderInterestChip)}</View> : <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>No matching interest yet. Try another activity, genre, category, or local place.</Text>
              ))
            ) : (
              <View style={[styles.cardGrid, isWide && styles.cardGridWide]}>
                {interestCategories.map((category) => {
                  const options = getInterestOptionsByCategory(category.id);
                  const selectedCount = getInterestCategorySelectedCount(interestPreferenceIds, category.id);
                  const isOpen = openInterestCategories.includes(category.id);
                  const showAll = showAllInterestCategories.includes(category.id);
                  const visibleLimit = category.defaultVisible ?? 8;
                  const visibleOptions = showAll ? options : options.filter((option, index) => index < visibleLimit || interestPreferenceIds.includes(option.id));
                  const hiddenCount = options.length - visibleOptions.length;

                  return (
                    <View key={category.id} style={[styles.card, isWide && styles.cardWide, isDay && styles.dayCard]}>
                      <TouchableOpacity
                        activeOpacity={0.78}
                        onPress={() => toggleInterestCategory(category.id)}
                        style={styles.accordionHeader}
                        accessibilityRole="button"
                        accessibilityLabel={`${category.title} interest group`}
                        accessibilityValue={{ text: isOpen ? "Expanded" : "Collapsed" }}
                      >
                        <Text style={styles.cardIcon}>{category.icon}</Text>
                        <View style={styles.cardBody}>
                          <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{category.title}</Text>
                          <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>{category.copy}</Text>
                        </View>
                        {selectedCount ? <Text style={[styles.countBadge, isDay && styles.daySummaryChip]}>{selectedCount}</Text> : null}
                        <IconSymbol name={isOpen ? "chevron.up" : "chevron.down"} color={isDay ? "#53677A" : nsnColors.muted} size={21} />
                      </TouchableOpacity>
                      {isOpen ? (
                        <>
                          <View style={styles.chipGrid}>{visibleOptions.map(renderInterestChip)}</View>
                          {hiddenCount > 0 || showAll ? (
                            <TouchableOpacity activeOpacity={0.78} onPress={() => toggleInterestCategoryLimit(category.id)} style={[styles.showMoreButton, isDay && styles.dayChip]} accessibilityRole="button" accessibilityLabel={showAll ? `Show fewer ${category.title} options` : `Show more ${category.title} options`}>
                              <Text style={[styles.secondaryButtonText, isDay && styles.dayTitle]}>{showAll ? "Show fewer" : `Show ${hiddenCount} more`}</Text>
                            </TouchableOpacity>
                          ) : null}
                        </>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        ) : null}

        {activeSection === "transport" ? (
          <View style={[styles.cardGrid, isWide && styles.cardGridWide]}>
            {transportOptions.map((option) => {
              const active = transportationMethod === option.value;

              return (
                <TouchableOpacity key={option.value} activeOpacity={0.82} onPress={() => saveSoftHelloMvpState({ transportationMethod: option.value })} style={[styles.optionCard, isWide && styles.optionCardWide, isDay && styles.dayCard, active && styles.optionCardActive]} accessibilityRole="button" accessibilityState={{ selected: active }} accessibilityLabel={`${active ? "Selected: " : ""}${option.value}`}>
                  <Text style={styles.optionEmoji}>{option.icon}</Text>
                  <View style={styles.cardBody}>
                    <Text style={[styles.optionTitle, isDay && styles.dayTitle, active && styles.activeText]}>{active ? "Selected: " : ""}{option.value}</Text>
                    <Text style={[styles.optionCopy, isDay && styles.dayMutedText, active && styles.activeText]}>{option.copy}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {activeSection === "contact" ? (
          <View style={[styles.cardGrid, isWide && styles.cardGridWide]}>
            {contactOptions.map((option) => {
              const active = contactPreferences.includes(option.value);

              return (
                <TouchableOpacity key={option.value} activeOpacity={0.82} onPress={() => toggleContactPreference(option.value)} style={[styles.optionCard, isWide && styles.optionCardWide, isDay && styles.dayCard, active && styles.optionCardActive]} accessibilityRole="button" accessibilityState={{ selected: active }} accessibilityLabel={`${active ? "Selected: " : ""}${option.value}`}>
                  <Text style={styles.optionEmoji}>{option.icon}</Text>
                  <View style={styles.cardBody}>
                    <Text style={[styles.optionTitle, isDay && styles.dayTitle, active && styles.activeText]}>{active ? "Selected: " : ""}{option.value}</Text>
                    <Text style={[styles.optionCopy, isDay && styles.dayMutedText, active && styles.activeText]}>{option.copy}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {activeSection === "location" ? (
          <View style={[styles.cardGrid, isWide && styles.cardGridWide]}>
            {renderSectionCard("Local area", "Your suburb or local area is used as a gentle prototype signal for nearby plans.", "📍", (
              <>
                <Text style={[styles.locationValue, isDay && styles.dayTitle]}>{suburb || "Sydney North Shore"}</Text>
                <TouchableOpacity activeOpacity={0.78} onPress={() => router.push("/location-preference" as never)} style={[styles.showMoreButton, isDay && styles.dayChip]} accessibilityRole="button" accessibilityLabel="Open local area editor">
                  <Text style={[styles.secondaryButtonText, isDay && styles.dayTitle]}>Open local area editor</Text>
                </TouchableOpacity>
              </>
            ))}
            {renderSectionCard("I am here for", "Keep intent lightweight and changeable.", "🧭", (
              <View style={styles.chipGrid}>
                {intentOptions.map((option) => renderChip({ key: option, label: option, active: intent === option, onPress: () => saveSoftHelloMvpState({ intent: option }) }))}
              </View>
            ))}
            {renderSectionCard("Location privacy and discovery", "These controls are prototype preference signals for local area display and nearby suggestions.", "🗺️", (
              <View style={styles.chipGrid}>
                {renderChip({ key: "show-area", label: "Show suburb/local area", active: showSuburbArea, onPress: () => saveSoftHelloMvpState({ showSuburbArea: !showSuburbArea }), wide: true })}
                {renderChip({ key: "approximate", label: "Use approximate location", active: useApproximateLocation, onPress: () => setUseApproximateLocation(!useApproximateLocation), wide: true })}
                {renderChip({ key: "distance", label: "Show distance in meetups", active: showDistanceInMeetups, onPress: () => setShowDistanceInMeetups(!showDistanceInMeetups), wide: true })}
                {renderChip({ key: "nearby", label: "Prefer nearby meetups", active: homeNearbyOnly, onPress: () => saveSoftHelloMvpState({ homeNearbyOnly: !homeNearbyOnly }), wide: true })}
              </View>
            ))}
          </View>
        ) : null}

        {screenReaderHints ? <Text style={[styles.accessibilityNote, isDay && styles.dayMutedText]}>All preference chips are buttons and announce their selected state.</Text> : null}
        {Platform.OS === "web" ? <View style={styles.bottomSpacer} /> : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayContainer: { backgroundColor: "#E8EDF2" },
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 96, gap: 14 },
  contentWide: { width: "100%", maxWidth: 1220, alignSelf: "center", paddingHorizontal: 24, paddingTop: 18 },
  topActions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)" },
  dayIconButton: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  secondaryButton: { minHeight: 40, borderRadius: 14, borderWidth: 1, borderColor: "#5A6EA5", backgroundColor: "rgba(85, 111, 186, 0.2)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 14 },
  secondaryButtonText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  headerCard: { borderRadius: 20, borderWidth: 1.2, borderColor: "#5A6EA5", backgroundColor: nsnColors.surface, padding: 18, gap: 13, flexDirection: "row", alignItems: "flex-start", flexWrap: "wrap" },
  headerIcon: { fontSize: 34, lineHeight: 42 },
  headerText: { flex: 1, minWidth: 240, gap: 4 },
  eyebrow: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", letterSpacing: 0, textTransform: "uppercase" },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "900", lineHeight: 34 },
  copy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
  prototypeBadge: { alignSelf: "flex-start", borderRadius: 999, borderWidth: 1, borderColor: nsnColors.border, color: nsnColors.text, fontSize: 11, fontWeight: "900", lineHeight: 16, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "rgba(255,255,255,0.05)" },
  sectionNav: { gap: 9, paddingVertical: 2 },
  sectionNavWide: { flexDirection: "row", flexWrap: "wrap" },
  navPill: { minHeight: 38, borderRadius: 999, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", alignItems: "center", justifyContent: "center", paddingHorizontal: 13 },
  navPillActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  navPillText: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  overviewGrid: { gap: 12 },
  overviewGridWide: { flexDirection: "row", flexWrap: "wrap" },
  overviewCard: { borderRadius: 18, borderWidth: 1.2, borderColor: "#5A6EA5", backgroundColor: nsnColors.surface, padding: 15, gap: 12, flexDirection: "row", alignItems: "flex-start" },
  overviewCardWide: { width: "32%", minWidth: 320, flexGrow: 1 },
  overviewIcon: { fontSize: 27, lineHeight: 34 },
  overviewValue: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, marginTop: 2 },
  preferenceStack: { gap: 14 },
  cardGrid: { gap: 14 },
  cardGridWide: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" },
  card: { borderRadius: 18, borderWidth: 1.2, borderColor: "#5A6EA5", backgroundColor: nsnColors.surface, padding: 15, gap: 13 },
  cardWide: { width: "48%", minWidth: 360, flexGrow: 1 },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 11 },
  cardIcon: { width: 34, fontSize: 24, lineHeight: 30, textAlign: "center" },
  cardBody: { flex: 1, minWidth: 0 },
  cardTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21 },
  cardCopy: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 2 },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  horizontalChipRow: { gap: 8, paddingBottom: 2 },
  chip: { minHeight: 38, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", alignItems: "flex-start", justifyContent: "center", paddingHorizontal: 12, paddingVertical: 8, maxWidth: "100%" },
  chipWide: { flexBasis: 210, flexGrow: 1 },
  chipActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  chipText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  chipMeta: { color: nsnColors.muted, fontSize: 11, fontWeight: "700", lineHeight: 16, marginTop: 2 },
  searchCard: { borderRadius: 18, borderWidth: 1.2, borderColor: "#5A6EA5", backgroundColor: nsnColors.surface, padding: 15, gap: 12 },
  searchBox: { minHeight: 44, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 12 },
  searchInput: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "800" },
  summaryChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  summaryChip: { color: nsnColors.text, fontSize: 11, fontWeight: "900", lineHeight: 16, borderRadius: 999, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.055)", paddingHorizontal: 9, paddingVertical: 5 },
  accordionHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  countBadge: { color: nsnColors.text, fontSize: 11, fontWeight: "900", lineHeight: 16, borderRadius: 999, borderWidth: 1, borderColor: nsnColors.border, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "rgba(255,255,255,0.055)" },
  notice: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 18 },
  showMoreButton: { minHeight: 38, alignSelf: "flex-start", borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  optionCard: { minHeight: 88, borderRadius: 18, borderWidth: 1.2, borderColor: "#5A6EA5", backgroundColor: nsnColors.surface, flexDirection: "row", alignItems: "center", gap: 13, padding: 14 },
  optionCardWide: { width: "31%", minWidth: 300, flexGrow: 1 },
  optionCardActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  optionEmoji: { width: 34, fontSize: 24, lineHeight: 30, textAlign: "center" },
  optionTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  optionCopy: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 2 },
  locationValue: { color: nsnColors.text, fontSize: 19, fontWeight: "900", lineHeight: 25 },
  accessibilityNote: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 18 },
  bottomSpacer: { height: 12 },
  dayCard: { backgroundColor: "#EEF3F4", borderColor: "#6F87A1" },
  dayChip: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  daySummaryChip: { backgroundColor: "#E8EEF3", borderColor: "#C5D0DA", color: "#0B1220" },
  dayInput: { backgroundColor: "#F8FAFC", borderColor: "#C5D0DA" },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#53677A" },
  activeText: { color: "#FFFFFF" },
});
