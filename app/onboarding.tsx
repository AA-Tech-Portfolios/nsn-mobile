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
const rtlLanguages = new Set(["Hebrew"]);

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
    tagline: "Meet locally, move gently.",
    step: "Step 1 of 5 - Your local setup",
    title: "Nice to meet you.",
    copy: "Set up a calm NSN profile for local North Shore plans, friendships, dating, or simply exploring at your own pace.",
    logoLabel: "NSN logo",
    suburbPlaceholder: "Chatswood",
    namePlaceholder: "Sam",
    ageConfirm: "I confirm I am 18 or older",
    adultsOnly: "North Shore Nights is for adults only.",
    suburbLabel: "Suburb or local area",
    recognised: "Recognised:",
    chooseSuggestion: "Choose a suggestion to confirm your local area.",
    hereFor: "What brings you here?",
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
    enter: "Enter NSN",
    permissionTitle: "Permission needed",
    permissionCopy: "Please allow photo access to choose a profile picture, or continue without one.",
    nameNotAllowed: nameNotAllowedMessage,
    intents: {} as Partial<Record<SoftHelloIntent, string>>,
    comfortOptions: {} as Partial<Record<SoftHelloComfortPreference, string>>,
    visibilityOptions: {} as Partial<Record<SoftHelloVisibility, { title: string; copy: string }>>,
  },
  Chinese: {
    tagline: "本地相识，轻松前行。",
    step: "第 1 步，共 5 步 - 本地设置",
    title: "很高兴认识你。",
    copy: "为 North Shore 本地计划、友谊、约会，或按自己节奏探索，设置一个平静的 NSN 资料。",
    logoLabel: "NSN 标志",
    suburbPlaceholder: "Chatswood",
    namePlaceholder: "Sam",
    ageConfirm: "我确认自己已满18岁",
    adultsOnly: "North Shore Nights 仅限成年人使用。",
    suburbLabel: "郊区或本地区域",
    recognised: "已识别：",
    chooseSuggestion: "选择一个建议以确认你的本地区域。",
    hereFor: "你来这里是为了什么？",
    nameLabel: "姓名或昵称",
    photoLabel: "可选照片",
    photoSelected: "已选择照片",
    photoLater: "你可以稍后添加",
    photoCopy: "资料照片可以保持模糊，直到你准备好再显示。",
    changePhoto: "更改",
    addPhoto: "添加",
    visibilityLabel: "可见性偏好",
    comfortLabel: "舒适偏好",
    comfortCopy: "这些会影响活动推荐，但不会隐藏其他所有内容。",
    enter: "进入 NSN",
    permissionTitle: "需要权限",
    permissionCopy: "请允许照片访问以选择资料照片，或不添加照片继续。",
    nameNotAllowed: "抱歉，这个名字不可用，请换一个名字。",
    intents: {
      Friends: "交朋友",
      Dating: "约会",
      Both: "两者皆可",
      Exploring: "探索",
    },
    comfortOptions: {
      "Small groups": "小团体",
      "Text-first": "先文字聊天",
      Quiet: "安静",
      "Flexible pace": "灵活节奏",
      "Indoor backup": "室内备用方案",
    },
    visibilityOptions: {
      Blurred: { title: "舒适模式", copy: "先保持私密。只在你选择时显示。" },
      Visible: { title: "开放模式", copy: "从一开始就清晰显示你的照片。" },
    },
  },
  Japanese: {
    tagline: "近くで出会い、やさしく進む。",
    step: "ステップ 1/5 - 地元の設定",
    title: "はじめまして。",
    copy: "North Shore の予定、友達づくり、デート、または自分のペースでの探索のために、落ち着いた NSN プロフィールを設定しましょう。",
    logoLabel: "NSN ロゴ",
    suburbPlaceholder: "Chatswood",
    namePlaceholder: "Sam",
    ageConfirm: "18歳以上であることを確認します",
    adultsOnly: "North Shore Nights は成人向けです。",
    suburbLabel: "郊外または地域",
    recognised: "認識済み:",
    chooseSuggestion: "候補を選んで地域を確認してください。",
    hereFor: "ここに来た目的は？",
    nameLabel: "名前またはニックネーム",
    photoLabel: "任意の写真",
    photoSelected: "写真を選択しました",
    photoLater: "後で追加できます",
    photoCopy: "準備ができるまで、プロフィール写真はぼかしたままにできます。",
    changePhoto: "変更",
    addPhoto: "追加",
    visibilityLabel: "表示の希望",
    comfortLabel: "安心できる希望",
    comfortCopy: "イベント提案に反映されますが、他の選択肢をすべて隠すわけではありません。",
    enter: "NSN に入る",
    permissionTitle: "権限が必要です",
    permissionCopy: "プロフィール写真を選ぶには写真へのアクセスを許可してください。写真なしでも続行できます。",
    nameNotAllowed: "すみません、この名前は使えません。別の名前を選んでください。",
    intents: { Friends: "友達", Dating: "デート", Both: "両方", Exploring: "探索" },
    comfortOptions: {
      "Small groups": "少人数",
      "Text-first": "まずテキスト",
      Quiet: "静か",
      "Flexible pace": "柔軟なペース",
      "Indoor backup": "屋内の予備案",
    },
    visibilityOptions: {
      Blurred: { title: "コンフォートモード", copy: "最初は非公開。表示するタイミングは自分で選べます。" },
      Visible: { title: "オープンモード", copy: "最初から写真をはっきり表示します。" },
    },
  },
  Korean: {
    tagline: "가까이 만나고, 천천히 움직여요.",
    step: "1/5단계 - 지역 설정",
    title: "반가워요.",
    copy: "North Shore의 약속, 친구, 데이트, 또는 내 속도에 맞춘 탐색을 위해 차분한 NSN 프로필을 설정하세요.",
    logoLabel: "NSN 로고",
    suburbPlaceholder: "Chatswood",
    namePlaceholder: "Sam",
    ageConfirm: "만 18세 이상임을 확인합니다",
    adultsOnly: "North Shore Nights는 성인만 사용할 수 있어요.",
    suburbLabel: "교외 또는 지역",
    recognised: "인식됨:",
    chooseSuggestion: "추천 항목을 선택해 지역을 확인하세요.",
    hereFor: "무엇을 위해 오셨나요?",
    nameLabel: "이름 또는 닉네임",
    photoLabel: "선택 사진",
    photoSelected: "사진 선택됨",
    photoLater: "나중에 추가할 수 있어요",
    photoCopy: "준비될 때까지 프로필 사진을 흐리게 둘 수 있어요.",
    changePhoto: "변경",
    addPhoto: "추가",
    visibilityLabel: "공개 방식",
    comfortLabel: "편안함 선호",
    comfortCopy: "이 설정은 이벤트 추천에 반영되지만 다른 선택지를 모두 숨기지는 않아요.",
    enter: "NSN 시작하기",
    permissionTitle: "권한이 필요해요",
    permissionCopy: "프로필 사진을 선택하려면 사진 접근을 허용하거나, 사진 없이 계속하세요.",
    nameNotAllowed: "죄송해요, 이 이름은 사용할 수 없어요. 다른 이름을 선택해 주세요.",
    intents: { Friends: "친구", Dating: "데이트", Both: "둘 다", Exploring: "탐색" },
    comfortOptions: {
      "Small groups": "소규모 그룹",
      "Text-first": "문자 먼저",
      Quiet: "조용함",
      "Flexible pace": "유연한 속도",
      "Indoor backup": "실내 대안",
    },
    visibilityOptions: {
      Blurred: { title: "컴포트 모드", copy: "처음에는 비공개로 시작하고, 원할 때만 공개하세요." },
      Visible: { title: "오픈 모드", copy: "처음부터 사진을 선명하게 보여줘요." },
    },
  },
  Hebrew: {
    tagline: "לפגוש אנשים, בלי לחץ.",
    step: "שלב 1 מתוך 5",
    title: "נעים להכיר.",
    copy: "צרו פרופיל רגוע לחברויות מקומיות, דייטינג, או פשוט חקירה בקצב שלכם.",
    ageConfirm: "אני מאשר/ת שאני בן/בת 18 ומעלה",
    adultsOnly: "NSN מיועדת למבוגרים בלבד.",
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
    enter: "כניסה ל-NSN",
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
  const { appLanguage, completeOnboarding, isNightMode, translationLanguage } = useAppSettings();
  const isDay = !isNightMode;
  const appLanguageBase = getLanguageBase(appLanguage);
  const isRtl = rtlLanguages.has(appLanguageBase);
  const copy = onboardingTranslations[appLanguageBase as keyof typeof onboardingTranslations] ?? onboardingTranslations.English;
  const onboardingCopy = { ...onboardingTranslations.English, ...copy };
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
        setNameError(onboardingCopy.nameNotAllowed);
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
      verificationLevel: "Unverified",
      eventMemberships: [],
      blockedUserIds: [],
      safetyReports: [],
      postEventFeedback: [],
      savedPlaces: [],
      pinnedEventIds: [],
      hiddenEventIds: [],
      transportationMethod: "Public transport",
      dietaryPreferences: ["No preference"],
      hobbiesInterests: ["Coffee", "Movies", "Walks"],
      appLanguage,
      translationLanguage,
    });

    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayScreen}>
      <ScrollView style={[styles.screen, isDay && styles.dayScreen]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandLockup}>
          <View style={[styles.logoMark, isDay && styles.dayLogoMark]} accessibilityRole="image" accessibilityLabel={onboardingCopy.logoLabel}>
            <Text style={[styles.logoText, isDay && styles.dayLogoText]}>NSN</Text>
            <View style={[styles.logoSignal, isDay && styles.dayLogoSignal]} />
          </View>
          <Text style={[styles.brand, isDay && styles.dayTitle, isRtl && styles.rtlText]}>North Shore Nights</Text>
          <Text style={[styles.tagline, isDay && styles.dayAccentText, isRtl && styles.rtlText]}>{copy.tagline}</Text>
        </View>

        <View style={[styles.panel, isDay && styles.dayPanel]}>
          <Text style={[styles.stepLabel, isDay && styles.dayAccentText, isRtl && styles.rtlText]}>{copy.step}</Text>
          <Text style={[styles.title, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.title}</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            {copy.copy}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAgeConfirmed((current) => !current)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: ageConfirmed }}
          accessibilityLabel={copy.ageConfirm}
          style={[styles.confirmCard, isDay && styles.dayCard, ageConfirmed && styles.confirmCardActive]}
        >
          <View style={[styles.checkBox, ageConfirmed && styles.checkBoxActive]}>
            <Text style={styles.checkText}>{ageConfirmed ? "✓" : ""}</Text>
          </View>
          <View style={styles.confirmCopy}>
            <Text style={[styles.cardTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.ageConfirm}</Text>
            <Text style={[styles.cardCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.adultsOnly}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.formStack}>
          <View>
            <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.suburbLabel}</Text>
            <TextInput
              value={suburb}
              onChangeText={updateSuburb}
              placeholder={onboardingCopy.suburbPlaceholder}
              placeholderTextColor={isDay ? "#6E7F99" : nsnColors.mutedSoft}
              style={[styles.input, isDay && styles.dayInput, isRtl && styles.rtlInput]}
            />
            {selectedLocality ? (
              <Text style={[styles.localityStatus, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                {copy.recognised} {getAustralianLocalityLabel(selectedLocality)}
              </Text>
            ) : suburb.trim().length >= 2 ? (
              <Text style={[styles.localityStatus, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
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
                        <Text style={[styles.localityName, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{locality.suburb}</Text>
                        <Text style={[styles.localityMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
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
            <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.hereFor}</Text>
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
                    <Text style={[styles.choiceText, isDay && styles.dayMutedText, active && styles.choiceTextActive]}>{copy.intents[option] ?? option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.nameLabel}</Text>
            <TextInput
              value={displayName}
              onChangeText={(value) => {
                setDisplayName(value);
                if (nameError) setNameError("");
              }}
              onBlur={() => {
                if (displayName.trim().length > 0 && !isAllowedDisplayName(displayName)) {
                  setNameError(onboardingCopy.nameNotAllowed);
                }
              }}
              placeholder={onboardingCopy.namePlaceholder}
              placeholderTextColor={isDay ? "#6E7F99" : nsnColors.mutedSoft}
              style={[styles.input, isDay && styles.dayInput, isRtl && styles.rtlInput]}
            />
            {nameError ? <Text style={[styles.inlineMessage, isDay && styles.dayMessage, isRtl && styles.rtlText]}>{nameError}</Text> : null}
          </View>

          <View>
            <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.photoLabel}</Text>
            <View style={[styles.photoRow, isDay && styles.dayCard]}>
              <View style={styles.photoPreview}>
                {profilePhotoUri ? (
                  <Image source={{ uri: profilePhotoUri }} style={styles.photoImage} blurRadius={visibilityPreference === "Blurred" ? 12 : 0} />
                ) : (
                  <Text style={styles.photoInitial}>{displayName.trim().charAt(0).toUpperCase() || "S"}</Text>
                )}
              </View>
              <View style={styles.photoBody}>
                <Text style={[styles.cardTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{profilePhotoUri ? copy.photoSelected : copy.photoLater}</Text>
                <Text style={[styles.cardCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.photoCopy}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={pickProfilePhoto} style={styles.smallButton}>
                <Text style={styles.smallButtonText}>{profilePhotoUri ? copy.changePhoto : copy.addPhoto}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.visibilityLabel}</Text>
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
                      <Text style={[styles.cardTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{localizedOption.title}</Text>
                      <Text style={[styles.cardCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{localizedOption.copy}</Text>
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
            <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.comfortLabel}</Text>
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
            <Text style={[styles.localityStatus, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
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
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayScreen: { backgroundColor: "#EAF4FF" },
  content: { paddingHorizontal: 22, paddingTop: 22, paddingBottom: 36 },
  brandLockup: { alignItems: "center", marginBottom: 24 },
  logoMark: { width: 98, height: 60, borderRadius: 20, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surfaceRaised, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  dayLogoMark: { borderColor: "#B8C9E6", backgroundColor: "#FFFFFF" },
  logoText: { color: nsnColors.text, fontSize: 24, fontWeight: "900", lineHeight: 30, letterSpacing: 0 },
  dayLogoText: { color: "#0B1220" },
  logoSignal: { position: "absolute", right: 12, top: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: nsnColors.cyan },
  dayLogoSignal: { backgroundColor: nsnColors.primary },
  brand: { color: nsnColors.text, fontSize: 34, fontWeight: "900", lineHeight: 40, textAlign: "center" },
  tagline: { color: nsnColors.cyan, fontSize: 16, fontWeight: "800", lineHeight: 22, textAlign: "center", marginTop: 3 },
  panel: { borderRadius: 20, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 18, marginBottom: 16 },
  dayPanel: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  stepLabel: { color: nsnColors.cyan, fontSize: 12, fontWeight: "900", lineHeight: 17, marginBottom: 10 },
  dayAccentText: { color: nsnColors.primary },
  title: { color: nsnColors.text, fontSize: 24, fontWeight: "900", lineHeight: 31 },
  dayTitle: { color: "#0B1220" },
  copy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  dayMutedText: { color: "#3B4A63" },
  confirmCard: {
    minHeight: 76,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    marginBottom: 17,
  },
  dayCard: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  confirmCardActive: { borderColor: nsnColors.cyan },
  checkBox: { width: 28, height: 28, borderRadius: 9, borderWidth: 1, borderColor: nsnColors.border, alignItems: "center", justifyContent: "center" },
  checkBoxActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  checkText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
  confirmCopy: { flex: 1 },
  cardTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  cardCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  formStack: { gap: 17 },
  label: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, marginBottom: 8 },
  input: {
    minHeight: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    color: nsnColors.text,
    fontSize: 15,
    paddingHorizontal: 14,
  },
  dayInput: { borderColor: "#B8C9E6", backgroundColor: "#FFFFFF", color: "#0B1220" },
  inlineMessage: { color: nsnColors.warning, fontSize: 12, lineHeight: 17, fontWeight: "800", marginTop: 7 },
  dayMessage: { color: "#7A5600" },
  localityStatus: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 7 },
  localityList: { borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, marginTop: 9, overflow: "hidden" },
  localityOption: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: nsnColors.border,
  },
  localityOptionActive: { backgroundColor: "rgba(56,72,255,0.16)" },
  localityName: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  localityMeta: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  localityCheck: { width: 22, color: nsnColors.mutedSoft, fontSize: 16, fontWeight: "900", textAlign: "right" },
  localityCheckActive: { color: nsnColors.cyan },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  intentOption: {
    minHeight: 42,
    minWidth: "47%",
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  dayChoice: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6" },
  choiceActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  choiceText: { color: nsnColors.muted, fontSize: 13, fontWeight: "900" },
  choiceTextActive: { color: "#FFFFFF" },
  photoRow: {
    minHeight: 82,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  photoPreview: { width: 56, height: 56, borderRadius: 28, backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: nsnColors.border, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  photoImage: { width: 56, height: 56, borderRadius: 28 },
  photoInitial: { color: "#FFFFFF", fontSize: 23, fontWeight: "900" },
  photoBody: { flex: 1 },
  smallButton: { minHeight: 36, borderRadius: 13, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 13 },
  smallButtonText: { color: nsnColors.text, fontSize: 12, fontWeight: "900" },
  visibilityStack: { gap: 9 },
  visibilityCard: {
    minHeight: 72,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 14,
  },
  visibilityActive: { borderColor: nsnColors.cyan, backgroundColor: "rgba(56,72,255,0.16)" },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: nsnColors.border, alignItems: "center", justifyContent: "center" },
  radioOuterActive: { borderColor: nsnColors.cyan },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: nsnColors.cyan },
  primaryButton: { height: 54, borderRadius: 17, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", marginTop: 24 },
  primaryButtonDisabled: { opacity: 0.42 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  rtlInput: { textAlign: "right", writingDirection: "rtl" },
});
