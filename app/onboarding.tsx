import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { ProfileVisibilityPreview, getBlurRadius, getEffectiveBlurLevel } from "@/components/profile-visibility-preview";
import { ScreenContainer } from "@/components/screen-container";
import type { NsnBlurLevel, NsnComfortMode, ProfileGender, SoftHelloIntent } from "@/lib/app-settings";
import { defaultPhotoRecordingComfortPreferences, useAppSettings } from "@/lib/app-settings";
import { AustralianLocality, australianLocalities, getAustralianLocalityLabel } from "@/lib/australian-localities";
import { nsnColors } from "@/lib/nsn-data";
import { isAllowedDisplayName, nameNotAllowedMessage } from "@/lib/profile-validation";
import { defaultComfortPreferences, type SoftHelloComfortPreference } from "@/lib/softhello-mvp";

const firstMeetupInterests = ["Coffee", "Movies", "Walks", "Dinner", "Games", "More"];
const MIN_ADULT_AGE = 18;
const MAX_PROFILE_AGE = 95;
const MAX_PREFERRED_AGE_SPAN = 35;
const comfortModes: { value: NsnComfortMode; copy: string }[] = [
  { value: "Comfort Mode", copy: "Profiles are blurred, with matched or shared visibility only." },
  { value: "Warm Up Mode", copy: "Profiles are partly visible and reveal more when both people feel comfortable." },
  { value: "Open Mode", copy: "People in the event can see basic profile details." },
];
const comfortPreferenceOptions: SoftHelloComfortPreference[] = ["Small groups", "Text-first", "Quiet", "Flexible pace"];
const comfortPreferenceLabels: Record<SoftHelloComfortPreference, string> = {
  "Small groups": "I like small groups",
  "Text-first": "I prefer text first",
  Quiet: "I'm a little shy",
  "Flexible pace": "I'm easy going",
  "Indoor backup": "I prefer indoor backup",
};
const blurLevels: NsnBlurLevel[] = ["Soft blur", "Medium blur", "Strong blur"];
const intentOptions: SoftHelloIntent[] = ["Friends", "Dating", "Both", "Exploring"];
const genderOptions: ProfileGender[] = ["Not specified", "Male", "Female", "Other"];

const normalizeLocalitySearch = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

const chatswoodLocality = australianLocalities.find((locality) => locality.suburb === "Chatswood");

export default function OnboardingScreen() {
  const router = useRouter();
  const { stage: stageParam } = useLocalSearchParams<{ stage?: string }>();
  const settings = useAppSettings();
  const isDay = !settings.isNightMode;
  const brandTheme = settings.brandTheme;
  const requestedStage = Number.parseInt(Array.isArray(stageParam) ? stageParam[0] : stageParam ?? "", 10);
  const hasDirectStage = Number.isFinite(requestedStage);
  const initialStage = hasDirectStage ? Math.min(Math.max(requestedStage, 0), 4) : 0;
  const [stage, setStage] = useState(initialStage);
  const [displayName, setDisplayName] = useState(settings.displayName === "Alon" ? (hasDirectStage ? "Sam" : "") : settings.displayName);
  const [middleName, setMiddleName] = useState(settings.middleName);
  const [lastName, setLastName] = useState(settings.lastName);
  const [gender, setGender] = useState<ProfileGender>(settings.gender);
  const [ageInput, setAgeInput] = useState(settings.age ? String(settings.age) : hasDirectStage ? "28" : "");
  const [preferredAgeMinInput, setPreferredAgeMinInput] = useState(String(settings.preferredAgeMin));
  const [preferredAgeMaxInput, setPreferredAgeMaxInput] = useState(String(settings.preferredAgeMax));
  const [suburb, setSuburb] = useState(settings.suburb || "Chatswood");
  const [selectedLocality, setSelectedLocality] = useState<AustralianLocality | undefined>(chatswoodLocality);
  const [intent, setIntent] = useState<SoftHelloIntent>(settings.intent);
  const [interests, setInterests] = useState<string[]>(settings.hobbiesInterests.length ? settings.hobbiesInterests : ["Coffee", "Movies", "Walks"]);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(settings.profilePhotoUri);
  const [comfortMode, setComfortMode] = useState<NsnComfortMode>(settings.comfortMode);
  const [comfortPreferences, setComfortPreferences] = useState<SoftHelloComfortPreference[]>(
    settings.comfortPreferences.length ? settings.comfortPreferences : defaultComfortPreferences
  );
  const [privateProfile, setPrivateProfile] = useState(settings.privateProfile);
  const [blurProfilePhoto, setBlurProfilePhoto] = useState(settings.blurProfilePhoto);
  const [blurLevel, setBlurLevel] = useState<NsnBlurLevel>(settings.blurLevel);
  const [warmUpLowerBlur, setWarmUpLowerBlur] = useState(settings.warmUpLowerBlur);
  const [showSuburbArea, setShowSuburbArea] = useState(settings.showSuburbArea);
  const [showMiddleName, setShowMiddleName] = useState(settings.showMiddleName);
  const [showLastName, setShowLastName] = useState(settings.showLastName);
  const [showAge, setShowAge] = useState(settings.showAge);
  const [showPreferredAgeRange, setShowPreferredAgeRange] = useState(settings.showPreferredAgeRange);
  const [showGender, setShowGender] = useState(settings.showGender);
  const [showInterests, setShowInterests] = useState(settings.showInterests);
  const [showComfortPreferences, setShowComfortPreferences] = useState(settings.showComfortPreferences);
  const [minimalProfileView, setMinimalProfileView] = useState(settings.minimalProfileView);
  const [nameError, setNameError] = useState("");

  const age = Number.parseInt(ageInput, 10);
  const preferredAgeMinRaw = Number.parseInt(preferredAgeMinInput, 10);
  const preferredAgeMaxRaw = Number.parseInt(preferredAgeMaxInput, 10);
  const hasPreferredAgeRange = preferredAgeMinInput.trim().length > 0 && preferredAgeMaxInput.trim().length > 0;
  const preferredAgeMin = Number.isFinite(preferredAgeMinRaw) ? preferredAgeMinRaw : MIN_ADULT_AGE;
  const preferredAgeMax = Number.isFinite(preferredAgeMaxRaw) ? preferredAgeMaxRaw : preferredAgeMin;
  const isAdult = Number.isFinite(age) && age >= MIN_ADULT_AGE && age <= MAX_PROFILE_AGE;
  const preferredAgeRangeIsValid =
    hasPreferredAgeRange &&
    preferredAgeMin >= MIN_ADULT_AGE &&
    preferredAgeMax <= MAX_PROFILE_AGE &&
    preferredAgeMax >= preferredAgeMin &&
    preferredAgeMax - preferredAgeMin <= MAX_PREFERRED_AGE_SPAN;
  const ageValidationMessage =
    ageInput.trim().length && !isAdult
      ? `NSN is adult-only, so age needs to be between ${MIN_ADULT_AGE} and ${MAX_PROFILE_AGE}.`
      : "";
  const preferredAgeValidationMessage =
    hasPreferredAgeRange && !preferredAgeRangeIsValid
      ? `Preferred age range must stay between ${MIN_ADULT_AGE} and ${MAX_PROFILE_AGE}, with the lower age first and no more than ${MAX_PREFERRED_AGE_SPAN} years wide.`
      : "";
  const canContinueAbout =
    isAdult &&
    isAllowedDisplayName(displayName) &&
    suburb.trim().length >= 2 &&
    preferredAgeRangeIsValid &&
    interests.length > 0;

  const localitySuggestions = useMemo(() => {
    const query = normalizeLocalitySearch(suburb);
    if (query.length < 2) return [];

    return australianLocalities
      .filter((locality) => {
        const suburbName = normalizeLocalitySearch(locality.suburb);
        const label = normalizeLocalitySearch(getAustralianLocalityLabel(locality));
        return suburbName.startsWith(query) || label.includes(query);
      })
      .slice(0, 5);
  }, [suburb]);

  const updateSuburb = (value: string) => {
    setSuburb(value);
    const normalizedValue = normalizeLocalitySearch(value);
    setSelectedLocality(
      australianLocalities.find((locality) => {
        const suburbName = normalizeLocalitySearch(locality.suburb);
        const label = normalizeLocalitySearch(getAustralianLocalityLabel(locality));
        return suburbName === normalizedValue || label === normalizedValue;
      })
    );
  };

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo access to choose a profile picture, or continue without one.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhotoUri(result.assets[0].uri);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((current) => (current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]));
  };

  const toggleComfortPreference = (preference: SoftHelloComfortPreference) => {
    setComfortPreferences((current) =>
      current.includes(preference) ? current.filter((item) => item !== preference) : [...current, preference]
    );
  };

  const updateComfortMode = (nextMode: NsnComfortMode) => {
    setComfortMode(nextMode);
    if (nextMode === "Comfort Mode") {
      setBlurProfilePhoto(true);
      setShowSuburbArea(false);
      setShowMiddleName(false);
      setShowLastName(false);
      setShowAge(false);
      setShowPreferredAgeRange(false);
      setShowGender(false);
      setShowInterests(false);
      setShowComfortPreferences(false);
      setMinimalProfileView(false);
      return;
    }

    if (nextMode === "Warm Up Mode") {
      setBlurProfilePhoto(true);
      setShowSuburbArea(false);
      setShowMiddleName(false);
      setShowLastName(false);
      setShowAge(Boolean(age));
      setShowPreferredAgeRange(false);
      setShowGender(gender !== "Not specified");
      setShowInterests(true);
      setShowComfortPreferences(true);
      setMinimalProfileView(false);
      return;
    }

    setBlurProfilePhoto(false);
    setShowSuburbArea(true);
    setShowMiddleName(Boolean(middleName.trim()));
    setShowLastName(Boolean(lastName.trim()));
    setShowAge(Boolean(age));
    setShowPreferredAgeRange(true);
    setShowGender(gender !== "Not specified");
    setShowInterests(true);
    setShowComfortPreferences(true);
    setMinimalProfileView(false);
  };

  const selectLocality = (locality: AustralianLocality) => {
    setSelectedLocality(locality);
    setSuburb(getAustralianLocalityLabel(locality));
  };

  const nextStage = () => {
    if (stage === 1 && !canContinueAbout) {
      if (displayName.trim().length > 0 && !isAllowedDisplayName(displayName)) setNameError(nameNotAllowedMessage);
      return;
    }
    setStage((current) => Math.min(current + 1, 4));
  };

  const finishOnboarding = async () => {
    const finalSuburb = selectedLocality ? getAustralianLocalityLabel(selectedLocality) : suburb.trim();
    await settings.completeOnboarding({
      ageConfirmed: true,
      age,
      preferredAgeMin,
      preferredAgeMax,
      suburb: finalSuburb,
      intent,
      displayName: displayName.trim() || "NSN member",
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      gender,
      showMiddleName: Boolean(middleName.trim() && showMiddleName),
      showLastName: Boolean(lastName.trim() && showLastName),
      showAge,
      showPreferredAgeRange,
      showGender: Boolean(gender !== "Not specified" && showGender),
      profilePhotoUri,
      visibilityPreference: comfortMode === "Open Mode" ? "Visible" : "Blurred",
      comfortMode,
      privateProfile,
      blurProfilePhoto,
      blurLevel,
      warmUpLowerBlur,
      showSuburbArea,
      showInterests,
      showComfortPreferences,
      minimalProfileView,
      comfortPreferences,
      verificationLevel: "Unverified",
      eventMemberships: [],
      blockedUserIds: [],
      safetyReports: [],
      postEventFeedback: [],
      savedPlaces: [],
      pinnedEventIds: [],
      hiddenEventIds: [],
      contactPreferences: ["Text"],
      socialEnergyPreference: "Calm",
      communicationPreferences: ["Low-message mode", "Details only"],
      groupSizePreference: "Small groups only",
      photoRecordingComfortPreferences: defaultPhotoRecordingComfortPreferences,
      verifiedButPrivate: true,
      transportationMethod: "Public transport",
      dietaryPreferences: ["No preference"],
      hobbiesInterests: interests,
      appLanguage: settings.appLanguage,
      translationLanguage: settings.translationLanguage,
      brandThemeId: settings.brandThemeId,
    });
    router.replace("/(tabs)");
  };

  const stageTitles = ["Welcome", "About you", "Meeting comfort", "Privacy", "Review"];
  const selectedSuburb = selectedLocality ? getAustralianLocalityLabel(selectedLocality) : suburb.trim();

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayScreen}>
      <ScrollView
        style={[styles.screen, isDay && styles.dayScreen]}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: brandTheme.spacing.screenX,
            paddingTop: brandTheme.spacing.screenY,
            gap: brandTheme.spacing.sectionGap,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandLockup}>
          <View style={[styles.logoMark, { borderRadius: brandTheme.radius.panel }, isDay && styles.dayCard]}>
            <Text style={[styles.logoText, isDay && styles.dayTitle]}>{brandTheme.logo.monogram}</Text>
            <View style={styles.logoSignal} />
          </View>
          <Text style={[styles.brand, brandTheme.typography.title, isDay && styles.dayTitle]}>{brandTheme.logo.wordmark}</Text>
          <Text style={[styles.tagline, isDay && styles.dayAccentText]}>{brandTheme.id === "softhello" ? "A softer way to say hello." : "Local plans, calmer starts."}</Text>
        </View>

        <View style={styles.progressRow}>
          {stageTitles.map((title, index) => (
            <View key={title} style={[styles.progressDot, index <= stage && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={[styles.stepLabel, isDay && styles.dayAccentText]}>Stage {stage + 1} of 5 - {stageTitles[stage]}</Text>

        {stage === 0 ? (
          <View style={[styles.panel, isDay && styles.dayPanel]}>
            <Text style={[styles.title, isDay && styles.dayTitle]}>Meet nearby, without the pressure.</Text>
            <Text style={[styles.copy, isDay && styles.dayMutedText]}>
              NSN is a Sydney North Shore pilot for safe, respectful and genuine first meetups: coffee, walks, movies, dinner, games and small local events.
            </Text>
            <Text style={[styles.copy, isDay && styles.dayMutedText]}>
              You control what others can see. Start private, warm up gradually, or keep things more open at an event.
            </Text>
          </View>
        ) : null}

        {stage === 1 ? (
          <View style={styles.formStack}>
            <View>
              <Text style={[styles.label, isDay && styles.dayTitle]}>Name or nickname</Text>
              <TextInput
                value={displayName}
                onChangeText={(value) => {
                  setDisplayName(value);
                  if (nameError) setNameError("");
                }}
                placeholder="Sam"
                placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft}
                style={[styles.input, isDay && styles.dayInput]}
              />
              {nameError ? <Text style={[styles.inlineMessage, isDay && styles.dayMessage]}>{nameError}</Text> : null}
            </View>
            <View>
              <View style={styles.twoColumn}>
                <View style={styles.column}>
                  <Text style={[styles.label, isDay && styles.dayTitle]}>Optional middle name</Text>
                  <TextInput
                    value={middleName}
                    onChangeText={setMiddleName}
                    placeholder="Leave blank"
                    placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft}
                    style={[styles.input, isDay && styles.dayInput]}
                  />
                </View>
                <View style={styles.column}>
                  <Text style={[styles.label, isDay && styles.dayTitle]}>Optional last name</Text>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Leave blank"
                    placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft}
                    style={[styles.input, isDay && styles.dayInput]}
                  />
                </View>
              </View>
              <Text style={[styles.localityStatus, isDay && styles.dayMutedText]}>
                You can save these for later and choose whether they appear in your profile preview.
              </Text>
            </View>

            <View style={styles.twoColumn}>
              <View style={styles.column}>
                <Text style={[styles.label, isDay && styles.dayTitle]}>Age</Text>
                <TextInput
                  value={ageInput}
                  onChangeText={(value) => setAgeInput(value.replace(/[^0-9]/g, "").slice(0, 2))}
                  keyboardType="number-pad"
                  placeholder="28"
                  placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft}
                  style={[styles.input, isDay && styles.dayInput]}
                />
              </View>
              <View style={styles.column}>
                <Text style={[styles.label, isDay && styles.dayTitle]}>Preferred age range</Text>
                <View style={styles.rangeRow}>
                  <TextInput value={preferredAgeMinInput} onChangeText={(value) => setPreferredAgeMinInput(value.replace(/[^0-9]/g, "").slice(0, 2))} keyboardType="number-pad" style={[styles.rangeInput, isDay && styles.dayInput]} />
                  <Text style={[styles.rangeDash, isDay && styles.dayMutedText]}>to</Text>
                  <TextInput value={preferredAgeMaxInput} onChangeText={(value) => setPreferredAgeMaxInput(value.replace(/[^0-9]/g, "").slice(0, 2))} keyboardType="number-pad" style={[styles.rangeInput, isDay && styles.dayInput]} />
                </View>
              </View>
            </View>
            {ageValidationMessage ? <Text style={[styles.inlineMessage, isDay && styles.dayMessage]}>{ageValidationMessage}</Text> : null}
            {preferredAgeValidationMessage ? <Text style={[styles.inlineMessage, isDay && styles.dayMessage]}>{preferredAgeValidationMessage}</Text> : null}
            <Text style={[styles.localityStatus, isDay && styles.dayMutedText]}>
              Preferred matching starts at {MIN_ADULT_AGE}. NSN keeps age ranges realistic and within the adult pilot.
            </Text>

            <View>
              <Text style={[styles.label, isDay && styles.dayTitle]}>Optional gender</Text>
              <View style={styles.optionGrid}>
                {genderOptions.map((option) => (
                  <Choice key={option} label={option} active={gender === option} isDay={isDay} onPress={() => setGender(option)} />
                ))}
              </View>
              <Text style={[styles.localityStatus, isDay && styles.dayMutedText]}>
                This is optional, local for now, and hidden from preview unless you choose to show it.
              </Text>
            </View>

            <View>
              <Text style={[styles.label, isDay && styles.dayTitle]}>Usual suburb or area</Text>
              <TextInput value={suburb} onChangeText={updateSuburb} placeholder="Chatswood" placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft} style={[styles.input, isDay && styles.dayInput]} />
              {localitySuggestions.length ? (
                <View style={[styles.localityList, isDay && styles.dayCard]}>
                  {localitySuggestions.map((locality) => (
                    <TouchableOpacity key={`${locality.suburb}-${locality.postcode}`} activeOpacity={0.8} onPress={() => selectLocality(locality)} style={styles.localityOption}>
                      <Text style={[styles.localityName, isDay && styles.dayTitle]}>{getAustralianLocalityLabel(locality)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>

            <View>
              <Text style={[styles.label, isDay && styles.dayTitle]}>First meetup interests</Text>
              <View style={styles.optionGrid}>
                {firstMeetupInterests.map((interest) => (
                  <Choice key={interest} label={interest} active={interests.includes(interest)} isDay={isDay} onPress={() => toggleInterest(interest)} />
                ))}
              </View>
            </View>

            <View>
              <Text style={[styles.label, isDay && styles.dayTitle]}>What brings you here?</Text>
              <View style={styles.optionGrid}>
                {intentOptions.map((option) => (
                  <Choice key={option} label={option} active={intent === option} isDay={isDay} onPress={() => setIntent(option)} />
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {stage === 2 ? (
          <View style={styles.formStack}>
            {comfortModes.map((mode) => (
              <TouchableOpacity key={mode.value} activeOpacity={0.84} onPress={() => updateComfortMode(mode.value)} style={[styles.selectionCard, isDay && styles.dayCard, comfortMode === mode.value && styles.selectionActive]}>
                <View style={styles.selectionCopy}>
                  <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{mode.value}</Text>
                  <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>{mode.copy}</Text>
                </View>
                <Text style={styles.selectionCheck}>{comfortMode === mode.value ? "✓" : ""}</Text>
              </TouchableOpacity>
            ))}

            <View>
              <Text style={[styles.label, isDay && styles.dayTitle]}>Comfort preferences</Text>
              <View style={styles.optionGrid}>
                {comfortPreferenceOptions.map((preference) => (
                  <Choice key={preference} label={comfortPreferenceLabels[preference]} active={comfortPreferences.includes(preference)} isDay={isDay} onPress={() => toggleComfortPreference(preference)} />
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {stage === 3 ? (
          <View style={styles.formStack}>
            <ToggleRow label="Private profile" copy="Limit profile details unless you choose to share more." value={privateProfile} onPress={() => setPrivateProfile((current) => !current)} isDay={isDay} />
            <ToggleRow label="Blur profile photo" copy="Keep your photo softened in event views." value={blurProfilePhoto} onPress={() => setBlurProfilePhoto((current) => !current)} isDay={isDay} />
            {comfortMode === "Warm Up Mode" ? (
              <ToggleRow
                label="Lower blur in Warm Up"
                copy="Use a softer blur while warming up, or turn this off to keep your chosen blur level."
                value={warmUpLowerBlur}
                onPress={() => setWarmUpLowerBlur((current) => !current)}
                isDay={isDay}
              />
            ) : null}
            <View>
              <Text style={[styles.label, isDay && styles.dayTitle]}>Blur level</Text>
              <View style={styles.optionGrid}>
                {blurLevels.map((level) => <Choice key={level} label={level} active={blurLevel === level} isDay={isDay} onPress={() => setBlurLevel(level)} />)}
              </View>
            </View>
            <ToggleRow label="Show suburb / area" copy="Use a local area, never your precise location." value={showSuburbArea} onPress={() => setShowSuburbArea((current) => !current)} isDay={isDay} />
            <ToggleRow label="Show middle name" copy="Only available if you entered an optional middle name." value={Boolean(middleName.trim() && showMiddleName)} onPress={() => setShowMiddleName((current) => !current)} isDay={isDay} />
            <ToggleRow label="Show last name" copy="Only available if you entered an optional last name." value={Boolean(lastName.trim() && showLastName)} onPress={() => setShowLastName((current) => !current)} isDay={isDay} />
            <ToggleRow label="Show age" copy="Let others see your age in the preview." value={showAge} onPress={() => setShowAge((current) => !current)} isDay={isDay} />
            <ToggleRow label="Show preferred age range" copy="Show the adult age range you prefer for matching." value={showPreferredAgeRange} onPress={() => setShowPreferredAgeRange((current) => !current)} isDay={isDay} />
            <ToggleRow label="Show gender" copy="Only available if you selected an optional gender." value={Boolean(gender !== "Not specified" && showGender)} onPress={() => setShowGender((current) => !current)} isDay={isDay} />
            <ToggleRow label="Show interests" copy="Let event members see first-meetup interests." value={showInterests} onPress={() => setShowInterests((current) => !current)} isDay={isDay} />
            <ToggleRow label="Show comfort preferences" copy="Share gentle context like text-first or small groups." value={showComfortPreferences} onPress={() => setShowComfortPreferences((current) => !current)} isDay={isDay} />
            <ToggleRow label="Minimal profile view" copy="Show only the basics in event-visible previews." value={minimalProfileView} onPress={() => setMinimalProfileView((current) => !current)} isDay={isDay} />

            <View>
              <Text style={[styles.label, isDay && styles.dayTitle]}>How others see me</Text>
              <ProfileVisibilityPreview
                displayName={displayName}
                middleName={middleName}
                lastName={lastName}
                suburb={selectedSuburb}
                age={age}
                preferredAgeMin={preferredAgeMin}
                preferredAgeMax={preferredAgeMax}
                gender={gender}
                interests={interests}
                comfortPreferences={comfortPreferences}
                photoRecordingComfortPreferences={defaultPhotoRecordingComfortPreferences}
                comfortMode={comfortMode}
                profilePhotoUri={profilePhotoUri}
                privateProfile={privateProfile}
                blurProfilePhoto={blurProfilePhoto}
                blurLevel={blurLevel}
                warmUpLowerBlur={warmUpLowerBlur}
                showSuburbArea={showSuburbArea}
                showMiddleName={Boolean(middleName.trim() && showMiddleName)}
                showLastName={Boolean(lastName.trim() && showLastName)}
                showAge={showAge}
                showPreferredAgeRange={showPreferredAgeRange}
                showGender={Boolean(gender !== "Not specified" && showGender)}
                showInterests={showInterests}
                showComfortPreferences={showComfortPreferences}
                minimalProfileView={minimalProfileView}
                isDay={isDay}
              />
            </View>

            <TouchableOpacity activeOpacity={0.8} onPress={pickProfilePhoto} style={[styles.photoRow, isDay && styles.dayCard]}>
              <View style={styles.photoPreview}>
                {profilePhotoUri ? (
                  <Image
                    source={{ uri: profilePhotoUri }}
                    style={styles.photoImage}
                    blurRadius={blurProfilePhoto ? getBlurRadius(getEffectiveBlurLevel(comfortMode, blurLevel, warmUpLowerBlur)) : 0}
                  />
                ) : (
                  <Text style={styles.photoInitial}>{displayName.trim().charAt(0).toUpperCase() || "N"}</Text>
                )}
              </View>
              <View style={styles.selectionCopy}>
                <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{profilePhotoUri ? "Change optional photo" : "Add optional photo"}</Text>
                <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>You can leave this blank for now.</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        {stage === 4 ? (
          <View style={[styles.panel, isDay && styles.dayPanel]}>
            <Text style={[styles.title, isDay && styles.dayTitle]}>Review your NSN setup</Text>
            <Summary label="Age" value={`${age}`} isDay={isDay} />
            <Summary label="Preferred age range" value={`${preferredAgeMin}-${preferredAgeMax}`} isDay={isDay} />
            <Summary label="Middle name" value={middleName.trim() ? (showMiddleName ? "Saved, shown in preview" : "Saved, hidden from preview") : "Not added"} isDay={isDay} />
            <Summary label="Last name" value={lastName.trim() ? (showLastName ? "Saved, shown in preview" : "Saved, hidden from preview") : "Not added"} isDay={isDay} />
            <Summary label="Gender" value={gender !== "Not specified" ? (showGender ? `${gender}, shown in preview` : `${gender}, hidden from preview`) : "Not specified"} isDay={isDay} />
            <Summary label="Suburb / area" value={selectedSuburb || "Not set"} isDay={isDay} />
            <Summary label="Interests" value={interests.join(", ")} isDay={isDay} />
            <Summary label="Comfort mode" value={comfortMode} isDay={isDay} />
            <Summary label="Privacy" value={`${privateProfile ? "Private profile" : "Event-visible"} · ${blurProfilePhoto ? blurLevel : "Photo clear"} · ${minimalProfileView ? "Minimal view" : "Details controlled"}`} isDay={isDay} />
          </View>
        ) : null}

        <View style={styles.buttonRow}>
          {stage > 0 ? (
            <TouchableOpacity activeOpacity={0.85} onPress={() => setStage((current) => Math.max(current - 1, 0))} style={[styles.secondaryButton, isDay && styles.dayCard]}>
              <Text style={[styles.secondaryButtonText, isDay && styles.dayTitle]}>Back</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity activeOpacity={0.88} disabled={stage === 1 && !canContinueAbout} onPress={stage === 4 ? finishOnboarding : nextStage} style={[styles.primaryButton, stage === 1 && !canContinueAbout && styles.primaryButtonDisabled]}>
            <Text style={styles.primaryButtonText}>{stage === 0 ? "Get Started" : stage === 4 ? "Finish setup" : "Continue"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Choice({ label, active, isDay, onPress }: { label: string; active: boolean; isDay: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={[styles.choice, isDay && styles.dayChoice, active && styles.choiceActive]}>
      <Text style={[styles.choiceText, isDay && styles.dayMutedText, active && styles.choiceTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ToggleRow({ label, copy, value, onPress, isDay }: { label: string; copy: string; value: boolean; onPress: () => void; isDay: boolean }) {
  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={[styles.selectionCard, isDay && styles.dayCard, value && styles.selectionActive]}>
      <View style={styles.selectionCopy}>
        <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{label}</Text>
        <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>{copy}</Text>
      </View>
      <Text style={styles.selectionCheck}>{value ? "✓" : ""}</Text>
    </TouchableOpacity>
  );
}

function Summary({ label, value, isDay }: { label: string; value: string; isDay: boolean }) {
  return (
    <View style={[styles.summaryRow, isDay && styles.daySummaryRow]}>
      <Text style={[styles.summaryLabel, isDay && styles.dayMutedText]}>{label}</Text>
      <Text style={[styles.summaryValue, isDay && styles.dayTitle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayScreen: { backgroundColor: "#E8EDF2" },
  content: { paddingHorizontal: 22, paddingTop: 22, paddingBottom: 36, gap: 16 },
  brandLockup: { alignItems: "center" },
  logoMark: { width: 92, height: 58, borderRadius: 20, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surfaceRaised, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  logoText: { color: nsnColors.text, fontSize: 24, fontWeight: "900", letterSpacing: 0 },
  logoSignal: { position: "absolute", right: 12, top: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: nsnColors.cyan },
  brand: { color: nsnColors.text, fontSize: 32, fontWeight: "900", lineHeight: 38, textAlign: "center" },
  tagline: { color: nsnColors.cyan, fontSize: 15, fontWeight: "800", lineHeight: 21, textAlign: "center", marginTop: 3 },
  progressRow: { flexDirection: "row", gap: 7, justifyContent: "center" },
  progressDot: { width: 30, height: 5, borderRadius: 3, backgroundColor: "rgba(166,177,199,0.25)" },
  progressDotActive: { backgroundColor: nsnColors.primary },
  stepLabel: { color: nsnColors.cyan, fontSize: 12, fontWeight: "900", lineHeight: 17, textAlign: "center" },
  panel: { borderRadius: 20, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 18, gap: 10 },
  dayPanel: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  title: { color: nsnColors.text, fontSize: 24, fontWeight: "900", lineHeight: 31 },
  copy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
  formStack: { gap: 16 },
  label: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, marginBottom: 8 },
  input: { minHeight: 50, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, color: nsnColors.text, fontSize: 15, paddingHorizontal: 14 },
  dayInput: { borderColor: "#C5D0DA", backgroundColor: "#FFFFFF", color: "#0B1220" },
  twoColumn: { flexDirection: "row", gap: 12 },
  column: { flex: 1 },
  rangeRow: { minHeight: 50, flexDirection: "row", alignItems: "center", gap: 8 },
  rangeInput: { flex: 1, minHeight: 50, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, color: nsnColors.text, fontSize: 15, textAlign: "center" },
  rangeDash: { color: nsnColors.muted, fontSize: 12, fontWeight: "800" },
  inlineMessage: { color: nsnColors.warning, fontSize: 12, lineHeight: 17, fontWeight: "800" },
  localityStatus: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  localityList: { borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, marginTop: 9, overflow: "hidden" },
  localityOption: { minHeight: 46, justifyContent: "center", paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: nsnColors.border },
  localityName: { color: nsnColors.text, fontSize: 13, fontWeight: "800" },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  choice: { minHeight: 42, minWidth: "47%", flex: 1, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  dayChoice: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  choiceActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  choiceText: { color: nsnColors.muted, fontSize: 13, fontWeight: "900", textAlign: "center" },
  choiceTextActive: { color: "#FFFFFF" },
  selectionCard: { minHeight: 72, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  selectionActive: { borderColor: nsnColors.cyan, backgroundColor: "rgba(56,72,255,0.16)" },
  selectionCopy: { flex: 1 },
  selectionCheck: { width: 24, color: nsnColors.cyan, fontSize: 18, fontWeight: "900", textAlign: "center" },
  cardTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  cardCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  photoRow: { minHeight: 82, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  photoPreview: { width: 56, height: 56, borderRadius: 28, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  photoImage: { width: 56, height: 56, borderRadius: 28 },
  photoInitial: { color: "#FFFFFF", fontSize: 23, fontWeight: "900" },
  summaryRow: { borderRadius: 14, backgroundColor: "rgba(255,255,255,0.04)", padding: 12, gap: 3 },
  daySummaryRow: { backgroundColor: "#FFFFFF" },
  summaryLabel: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  summaryValue: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 6 },
  primaryButton: { flex: 1, minHeight: 54, borderRadius: 17, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  primaryButtonDisabled: { opacity: 0.42 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  secondaryButton: { minHeight: 54, borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  secondaryButtonText: { color: nsnColors.text, fontSize: 14, fontWeight: "900" },
  dayCard: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#53677A" },
  dayAccentText: { color: nsnColors.primary },
  dayMessage: { color: "#7A5600" },
});
