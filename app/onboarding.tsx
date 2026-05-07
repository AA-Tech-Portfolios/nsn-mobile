import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AustralianLocality, australianLocalities, getAustralianLocalityLabel } from "@/lib/australian-localities";
import { getLanguageBase, SoftHelloIntent, SoftHelloVisibility, useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";
import { isAllowedDisplayName, nameNotAllowedMessage } from "@/lib/profile-validation";
import { defaultComfortPreferences, type SoftHelloComfortPreference } from "@/lib/softhello-mvp";

const intentOptions: SoftHelloIntent[] = ["Friends", "Dating", "Both", "Exploring"];
const comfortOptions: SoftHelloComfortPreference[] = ["Small groups", "Text-first", "Quiet", "Flexible pace", "Indoor backup"];

const visibilityOptions: {
  value: SoftHelloVisibility;
  title: string;
  copy: string;
}[] = [
  {
    value: "Blurred",
    title: "Comfort Mode",
    copy: "Start private. Reveal only when you choose.",
  },
  {
    value: "Visible",
    title: "Open Mode",
    copy: "Show your photo clearly from the start.",
  },
];

const onboardingTranslations = {
  English: {
    tagline: "Meet people, not pressure.",
    step: "Step 1 of 5",
    title: "Nice to meet you.",
    copy: "Create a calm profile for local friendships, dating, or simply exploring at your own pace.",
    ageConfirm: "I confirm I am 18 or older",
    adultsOnly: "SoftHello is for adults only.",
    suburbLabel: "Suburb or local area",
    recognised: "Recognised:",
    chooseSuggestion: "Choose a suggestion to confirm your local area.",
    hereFor: "I am here for",
    nameLabel: "Name or nickname",
    photoLabel: "Optional photo",
    photoSelected: "Photo selected",
    photoLater: "You can add this later",
    photoCopy: "Profiles can stay blurred until you are ready.",
    changePhoto: "Change",
    addPhoto: "Add",
    visibilityLabel: "Visibility preference",
    comfortLabel: "Comfort preferences",
    comfortCopy: "These shape event suggestions without hiding everything else.",
    enter: "Enter SoftHello",
    permissionTitle: "Permission needed",
    permissionCopy: "Please allow photo access to choose a profile picture, or continue without one.",
    intents: {} as Partial<Record<SoftHelloIntent, string>>,
    comfortOptions: {} as Partial<Record<SoftHelloComfortPreference, string>>,
    visibilityOptions: {} as Partial<Record<SoftHelloVisibility, { title: string; copy: string }>>,
  },
  Hebrew: {
    tagline: "לפגוש אנשים, בלי לחץ.",
    step: "שלב 1 מתוך 5",
    title: "נעים להכיר.",
    copy: "צרו פרופיל רגוע לחברויות מקומיות, דייטינג, או פשוט חקירה בקצב שלכם.",
    ageConfirm: "אני מאשר/ת שאני בן/בת 18 ומעלה",
    adultsOnly: "SoftHello מיועדת למבוגרים בלבד.",
    suburbLabel: "פרבר או אזור מקומי",
    recognised: "זוהה:",
    chooseSuggestion: "בחר/י הצעה כדי לאשר את האזור המקומי שלך.",
    hereFor: "אני כאן בשביל",
    nameLabel: "שם או כינוי",
    photoLabel: "תמונה אופציונלית",
    photoSelected: "תמונה נבחרה",
    photoLater: "אפשר להוסיף את זה אחר כך",
    photoCopy: "פרופילים יכולים להישאר מטושטשים עד שתרגיש/י מוכן/ה.",
    changePhoto: "שינוי",
    addPhoto: "הוספה",
    visibilityLabel: "העדפת נראות",
    comfortLabel: "העדפות נוחות",
    comfortCopy: "אלה מעצבות הצעות לאירועים בלי להסתיר את כל השאר.",
    enter: "כניסה ל-SoftHello",
    permissionTitle: "נדרשת הרשאה",
    permissionCopy: "יש לאפשר גישה לתמונות כדי לבחור תמונת פרופיל, או להמשיך בלי תמונה.",
    intents: {
      Friends: "חברים",
      Dating: "דייטינג",
      Both: "שניהם",
      Exploring: "חקירה",
    },
    comfortOptions: {
      "Small groups": "קבוצות קטנות",
      "Text-first": "טקסט קודם",
      Quiet: "שקט",
      "Flexible pace": "קצב גמיש",
      "Indoor backup": "גיבוי בפנים",
    },
    visibilityOptions: {
      Blurred: { title: "מצב נוחות", copy: "להתחיל בפרטי. לחשוף רק כשאת/ה בוחר/ת." },
      Visible: { title: "מצב פתוח", copy: "להציג את התמונה בבירור מההתחלה." },
    },
  },
} as const;

const normalizeLocalitySearch = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

const chatswoodLocality = australianLocalities.find((locality) => locality.suburb === "Chatswood");

export default function OnboardingScreen() {
  const router = useRouter();
  const { appLanguage, completeOnboarding, isNightMode } = useAppSettings();
  const isDay = !isNightMode;
  const copy = onboardingTranslations[getLanguageBase(appLanguage) as keyof typeof onboardingTranslations] ?? onboardingTranslations.English;
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [suburb, setSuburb] = useState("Chatswood");
  const [selectedLocality, setSelectedLocality] = useState<AustralianLocality | undefined>(chatswoodLocality);
  const [intent, setIntent] = useState<SoftHelloIntent>("Exploring");
  const [displayName, setDisplayName] = useState("");
  const [nameError, setNameError] = useState("");
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [visibilityPreference, setVisibilityPreference] = useState<SoftHelloVisibility>("Blurred");
  const [comfortPreferences, setComfortPreferences] = useState<SoftHelloComfortPreference[]>(defaultComfortPreferences);

  const canContinue = useMemo(
    () => ageConfirmed && suburb.trim().length >= 2 && isAllowedDisplayName(displayName),
    [ageConfirmed, displayName, suburb]
  );

  const localitySuggestions = useMemo(() => {
    const query = normalizeLocalitySearch(suburb);

    if (query.length < 2) {
      return [];
    }

    return australianLocalities
      .filter((locality) => {
        const suburbName = normalizeLocalitySearch(locality.suburb);
        const label = normalizeLocalitySearch(getAustralianLocalityLabel(locality));

        return suburbName.startsWith(query) || label.includes(query);
      })
      .slice(0, 6);
  }, [suburb]);

  const updateSuburb = (value: string) => {
    setSuburb(value);

    const normalizedValue = normalizeLocalitySearch(value);
    const exactMatch = australianLocalities.find((locality) => {
      const suburbName = normalizeLocalitySearch(locality.suburb);
      const label = normalizeLocalitySearch(getAustralianLocalityLabel(locality));

      return suburbName === normalizedValue || label === normalizedValue;
    });

    setSelectedLocality(exactMatch);
  };

  const selectLocality = (locality: AustralianLocality) => {
    setSelectedLocality(locality);
    setSuburb(getAustralianLocalityLabel(locality));
  };

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(copy.permissionTitle, copy.permissionCopy);
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

  const finishOnboarding = async () => {
    if (!canContinue) {
      if (displayName.trim().length > 0 && !isAllowedDisplayName(displayName)) {
        setNameError(nameNotAllowedMessage);
      }

      return;
    }

    await completeOnboarding({
      ageConfirmed,
      suburb: selectedLocality ? getAustralianLocalityLabel(selectedLocality) : suburb.trim(),
      intent,
      displayName: displayName.trim(),
      profilePhotoUri,
      visibilityPreference,
      comfortPreferences,
      verificationLevel: "Contact Verified",
      eventMemberships: [],
      blockedUserIds: [],
      safetyReports: [],
      postEventFeedback: [],
      savedPlaces: [],
      pinnedEventIds: [],
      hiddenEventIds: [],
      transportationMethod: "Public transport",
      dietaryPreferences: ["No preference"],
      mealPaymentPreference: "Pay my own way",
      hobbiesInterests: ["Coffee", "Movies", "Walks"],
    });

    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayScreen}>
      <ScrollView style={[styles.screen, isDay && styles.dayScreen]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandLockup}>
          <View style={styles.logoMark}>
            <View style={styles.logoBubbleLeft} />
            <View style={styles.logoBubbleRight} />
          </View>
          <Text style={[styles.brand, isDay && styles.dayTitle]}>SoftHello</Text>
          <Text style={[styles.tagline, isDay && styles.dayMutedText]}>{copy.tagline}</Text>
        </View>

        <View style={[styles.panel, isDay && styles.dayPanel]}>
          <Text style={[styles.stepLabel, isDay && styles.dayAccentText]}>{copy.step}</Text>
          <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText]}>
            {copy.copy}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAgeConfirmed((current) => !current)}
          style={[styles.confirmCard, isDay && styles.dayCard, ageConfirmed && styles.confirmCardActive]}
        >
          <View style={[styles.checkBox, ageConfirmed && styles.checkBoxActive]}>
            <Text style={styles.checkText}>{ageConfirmed ? "✓" : ""}</Text>
          </View>
          <View style={styles.confirmCopy}>
            <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{copy.ageConfirm}</Text>
            <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>{copy.adultsOnly}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.formStack}>
          <View>
            <Text style={[styles.label, isDay && styles.dayTitle]}>{copy.suburbLabel}</Text>
            <TextInput
              value={suburb}
              onChangeText={updateSuburb}
              placeholder="Chatswood"
              placeholderTextColor={isDay ? "#6E7F99" : nsnColors.mutedSoft}
              style={[styles.input, isDay && styles.dayInput]}
            />
            {selectedLocality ? (
              <Text style={[styles.localityStatus, isDay && styles.dayMutedText]}>
                {copy.recognised} {getAustralianLocalityLabel(selectedLocality)}
              </Text>
            ) : suburb.trim().length >= 2 ? (
              <Text style={[styles.localityStatus, isDay && styles.dayMutedText]}>
                {copy.chooseSuggestion}
              </Text>
            ) : null}
            {localitySuggestions.length > 0 ? (
              <View style={[styles.localityList, isDay && styles.dayCard]}>
                {localitySuggestions.map((locality) => {
                  const selected =
                    selectedLocality &&
                    selectedLocality.suburb === locality.suburb &&
                    selectedLocality.state === locality.state &&
                    selectedLocality.postcode === locality.postcode;

                  return (
                    <TouchableOpacity
                      key={`${locality.suburb}-${locality.state}-${locality.postcode}`}
                      activeOpacity={0.82}
                      onPress={() => selectLocality(locality)}
                      style={[styles.localityOption, selected && styles.localityOptionActive]}
                    >
                      <View>
                        <Text style={[styles.localityName, isDay && styles.dayTitle]}>{locality.suburb}</Text>
                        <Text style={[styles.localityMeta, isDay && styles.dayMutedText]}>
                          {locality.state} {locality.postcode}
                        </Text>
                      </View>
                      <Text style={[styles.localityCheck, selected && styles.localityCheckActive]}>{selected ? "✓" : ""}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          <View>
            <Text style={[styles.label, isDay && styles.dayTitle]}>{copy.hereFor}</Text>
            <View style={styles.optionGrid}>
              {intentOptions.map((option) => {
                const active = intent === option;

                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.82}
                    onPress={() => setIntent(option)}
                    style={[styles.intentOption, isDay && styles.dayChoice, active && styles.choiceActive]}
                  >
                    <Text style={[styles.choiceText, isDay && styles.dayMutedText, active && styles.choiceTextActive]}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={[styles.label, isDay && styles.dayTitle]}>{copy.nameLabel}</Text>
            <TextInput
              value={displayName}
              onChangeText={(value) => {
                setDisplayName(value);
                if (nameError) setNameError("");
              }}
              onBlur={() => {
                if (displayName.trim().length > 0 && !isAllowedDisplayName(displayName)) {
                  setNameError(nameNotAllowedMessage);
                }
              }}
              placeholder="Sam"
              placeholderTextColor={isDay ? "#6E7F99" : nsnColors.mutedSoft}
              style={[styles.input, isDay && styles.dayInput]}
            />
            {nameError ? <Text style={[styles.inlineMessage, isDay && styles.dayMessage]}>{nameError}</Text> : null}
          </View>

          <View>
            <Text style={[styles.label, isDay && styles.dayTitle]}>{copy.photoLabel}</Text>
            <View style={[styles.photoRow, isDay && styles.dayCard]}>
              <View style={styles.photoPreview}>
                {profilePhotoUri ? (
                  <Image source={{ uri: profilePhotoUri }} style={styles.photoImage} blurRadius={visibilityPreference === "Blurred" ? 12 : 0} />
                ) : (
                  <Text style={styles.photoInitial}>{displayName.trim().charAt(0).toUpperCase() || "S"}</Text>
                )}
              </View>
              <View style={styles.photoBody}>
                <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{profilePhotoUri ? copy.photoSelected : copy.photoLater}</Text>
                <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>{copy.photoCopy}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={pickProfilePhoto} style={styles.smallButton}>
                <Text style={styles.smallButtonText}>{profilePhotoUri ? copy.changePhoto : copy.addPhoto}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={[styles.label, isDay && styles.dayTitle]}>{copy.visibilityLabel}</Text>
            <View style={styles.visibilityStack}>
              {visibilityOptions.map((option) => {
                const active = visibilityPreference === option.value;
                const localizedOption = copy.visibilityOptions[option.value] ?? option;

                return (
                  <TouchableOpacity
                    key={option.value}
                    activeOpacity={0.84}
                    onPress={() => setVisibilityPreference(option.value)}
                    style={[styles.visibilityCard, isDay && styles.dayCard, active && styles.visibilityActive]}
                  >
                    <View>
                      <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{localizedOption.title}</Text>
                      <Text style={[styles.cardCopy, isDay && styles.dayMutedText]}>{localizedOption.copy}</Text>
                    </View>
                    <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                      {active ? <View style={styles.radioInner} /> : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={[styles.label, isDay && styles.dayTitle]}>{copy.comfortLabel}</Text>
            <View style={styles.optionGrid}>
              {comfortOptions.map((option) => {
                const active = comfortPreferences.includes(option);

                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.82}
                    onPress={() =>
                      setComfortPreferences((current) =>
                        current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
                      )
                    }
                    style={[styles.intentOption, isDay && styles.dayChoice, active && styles.choiceActive]}
                  >
                    <Text style={[styles.choiceText, isDay && styles.dayMutedText, active && styles.choiceTextActive]}>{copy.comfortOptions[option] ?? option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.localityStatus, isDay && styles.dayMutedText]}>
              {copy.comfortCopy}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          disabled={!canContinue}
          onPress={finishOnboarding}
          style={[styles.primaryButton, !canContinue && styles.primaryButtonDisabled]}
        >
          <Text style={styles.primaryButtonText}>{copy.enter}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFF9F1" },
  dayScreen: { backgroundColor: "#FFF9F1" },
  content: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 34 },
  brandLockup: { alignItems: "center", marginBottom: 22 },
  logoMark: { width: 88, height: 58, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  logoBubbleLeft: { position: "absolute", left: 15, width: 48, height: 48, borderRadius: 24, backgroundColor: "#6C5CE7" },
  logoBubbleRight: { position: "absolute", right: 15, width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFB48A" },
  brand: { color: "#18182E", fontSize: 34, fontWeight: "900", lineHeight: 42 },
  tagline: { color: "#6C5CE7", fontSize: 16, fontWeight: "700", lineHeight: 23 },
  panel: { borderRadius: 20, borderWidth: 1, borderColor: "#EFE2D8", backgroundColor: "#FFFFFF", padding: 18, marginBottom: 14 },
  dayPanel: { backgroundColor: "#FFFFFF", borderColor: "#EFE2D8" },
  stepLabel: { color: "#6C5CE7", fontSize: 12, fontWeight: "900", lineHeight: 17, marginBottom: 8 },
  dayAccentText: { color: "#6C5CE7" },
  title: { color: "#18182E", fontSize: 24, fontWeight: "900", lineHeight: 31 },
  dayTitle: { color: "#18182E" },
  copy: { color: "#5F6575", fontSize: 14, lineHeight: 21, marginTop: 6 },
  dayMutedText: { color: "#5F6575" },
  confirmCard: {
    minHeight: 76,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EFE2D8",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    marginBottom: 17,
  },
  dayCard: { backgroundColor: "#FFFFFF", borderColor: "#EFE2D8" },
  confirmCardActive: { borderColor: "#6C5CE7" },
  checkBox: { width: 28, height: 28, borderRadius: 9, borderWidth: 1, borderColor: "#D9CFE8", alignItems: "center", justifyContent: "center" },
  checkBoxActive: { backgroundColor: "#6C5CE7", borderColor: "#6C5CE7" },
  checkText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
  confirmCopy: { flex: 1 },
  cardTitle: { color: "#18182E", fontSize: 14, fontWeight: "900", lineHeight: 20 },
  cardCopy: { color: "#5F6575", fontSize: 12, lineHeight: 17, marginTop: 2 },
  formStack: { gap: 16 },
  label: { color: "#18182E", fontSize: 13, fontWeight: "900", lineHeight: 18, marginBottom: 7 },
  input: {
    minHeight: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#EFE2D8",
    backgroundColor: "#FFFFFF",
    color: "#18182E",
    fontSize: 15,
    paddingHorizontal: 14,
  },
  dayInput: { borderColor: "#EFE2D8", backgroundColor: "#FFFFFF", color: "#18182E" },
  inlineMessage: { color: "#9A6A00", fontSize: 12, lineHeight: 17, fontWeight: "800", marginTop: 7 },
  dayMessage: { color: "#9A6A00" },
  localityStatus: { color: "#5F6575", fontSize: 12, lineHeight: 17, marginTop: 7 },
  localityList: { borderRadius: 16, borderWidth: 1, borderColor: "#EFE2D8", backgroundColor: "#FFFFFF", marginTop: 9, overflow: "hidden" },
  localityOption: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F1E8DF",
  },
  localityOptionActive: { backgroundColor: "#FAF7FF" },
  localityName: { color: "#18182E", fontSize: 14, fontWeight: "900", lineHeight: 20 },
  localityMeta: { color: "#5F6575", fontSize: 12, lineHeight: 17 },
  localityCheck: { width: 22, color: "#9A8EAB", fontSize: 16, fontWeight: "900", textAlign: "right" },
  localityCheckActive: { color: "#6C5CE7" },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  intentOption: {
    minHeight: 42,
    minWidth: "47%",
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EFE2D8",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  dayChoice: { backgroundColor: "#FFFFFF", borderColor: "#EFE2D8" },
  choiceActive: { backgroundColor: "#6C5CE7", borderColor: "#6C5CE7" },
  choiceText: { color: "#5F6575", fontSize: 13, fontWeight: "900" },
  choiceTextActive: { color: "#FFFFFF" },
  photoRow: {
    minHeight: 82,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EFE2D8",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  photoPreview: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#18182E", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  photoImage: { width: 56, height: 56, borderRadius: 28 },
  photoInitial: { color: "#FFFFFF", fontSize: 23, fontWeight: "900" },
  photoBody: { flex: 1 },
  smallButton: { minHeight: 36, borderRadius: 13, backgroundColor: "#F2EDFF", alignItems: "center", justifyContent: "center", paddingHorizontal: 13 },
  smallButtonText: { color: "#6C5CE7", fontSize: 12, fontWeight: "900" },
  visibilityStack: { gap: 9 },
  visibilityCard: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EFE2D8",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 14,
  },
  visibilityActive: { borderColor: "#6C5CE7", backgroundColor: "#FAF7FF" },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: "#D9CFE8", alignItems: "center", justifyContent: "center" },
  radioOuterActive: { borderColor: "#6C5CE7" },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: "#6C5CE7" },
  primaryButton: { height: 54, borderRadius: 17, backgroundColor: "#6C5CE7", alignItems: "center", justifyContent: "center", marginTop: 22 },
  primaryButtonDisabled: { opacity: 0.42 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
});
