import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { getTranslationLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { nsnColors } from "@/lib/nsn-data";
import { canMeetInPerson, deriveVerificationLevel, getMeetingSafetyCopy, getVerificationLevelLabel } from "@/lib/softhello-mvp";

const CREATED_EVENTS_KEY = "nsn.created-events.v1";

const noiseLevels = ["Quiet", "Balanced", "Lively"] as const;
const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const eventsTranslations = {
  English: {
    title: "My Events",
    subtitle: "Create your own experiences and invite others on your terms.",
    createEvent: "Create a Meetup",
    emptyTitle: "No events created yet",
    emptyCopy: "Host a coffee meetup, movie night, board games, walk, study session or anything that feels like you.",
    sheetTitle: "Create a Meetup",
    sheetSubtitle: "Set the plan, the place, and the vibe.",
    eventName: "Event name",
    eventNamePlaceholder: "Board games and coffee",
    date: "Date",
    datePlaceholder: "24 May",
    time: "Time",
    timePlaceholder: "6:30pm",
    venue: "Venue",
    venuePlaceholder: "Chatswood Social Cafe",
    backupVenue: "Bad weather backup",
    backupVenuePlaceholder: "Indoor table at nearby cafe",
    noiseLevel: "Noise level",
    address: "Address",
    addressPlaceholder: "Enter an address or pick below",
    mapReady: "OpenStreetMap / MapLibre ready",
    chooseFromMap: "Choose from map",
    mapCopy: "Pick a suggested North Shore place now. This panel can host a MapLibre map when native map tiles are added.",
    description: "Description",
    descriptionPlaceholder: "What should people expect?",
    backupPrefix: "Backup",
    save: "Create Meetup",
    verificationRequiredTitle: "Real Person Verified required",
    verificationRequiredCopy: "To keep meetups trustworthy, creators need Real Person Verified status before opening a real-world plan.",
    reviewSettings: "Review settings",
    verificationTitle: "Confirm your details",
    verificationCopy: "Before creating real-world plans, please confirm the profile details members rely on for safety.",
    displayName: "Name",
    suburb: "Local area",
    age: "Age confirmation",
    photo: "Profile photo",
    contact: "Contact status",
    transport: "Arrival method",
    ageConfirmed: "18 or older confirmed",
    ageMissing: "Needs confirmation",
    photoAdded: "Photo added",
    photoMissing: "Can be added later",
    confirmDetails: "Review in profile",
    editProfile: "Edit profile",
    close: "Close",
    noise: { Quiet: "Quiet", Balanced: "Balanced", Lively: "Lively" },
  },
  Chinese: {
    title: "我的活动",
    subtitle: "创建自己的体验，并按你的方式邀请他人。",
    createEvent: "创建聚会",
    emptyTitle: "还没有创建活动",
    emptyCopy: "发起咖啡聚会、电影夜、桌游、散步、学习小组，或任何像你的活动。",
    sheetTitle: "创建聚会",
    sheetSubtitle: "设置计划、地点和氛围。",
    eventName: "活动名称",
    eventNamePlaceholder: "桌游和咖啡",
    date: "日期",
    datePlaceholder: "5月24日",
    time: "时间",
    timePlaceholder: "晚上6:30",
    venue: "地点",
    venuePlaceholder: "Chatswood Social Cafe",
    backupVenue: "恶劣天气备用地点",
    backupVenuePlaceholder: "附近咖啡馆的室内座位",
    noiseLevel: "噪音水平",
    address: "地址",
    addressPlaceholder: "输入地址或从下方选择",
    mapReady: "OpenStreetMap / MapLibre 已就绪",
    chooseFromMap: "从地图选择",
    mapCopy: "现在选择一个推荐的 North Shore 地点。添加原生地图图块后，这个面板可以承载 MapLibre 地图。",
    description: "描述",
    descriptionPlaceholder: "大家可以期待什么？",
    backupPrefix: "备用",
    save: "创建聚会",
    verificationRequiredTitle: "需要真人验证",
    verificationRequiredCopy: "为了保持聚会可信，创建者需要先完成真人验证，才能发布线下计划。",
    reviewSettings: "检查设置",
    verificationTitle: "确认你的资料",
    verificationCopy: "创建线下计划前，请确认成员会依赖的安全资料。",
    displayName: "姓名",
    suburb: "本地区域",
    age: "年龄确认",
    photo: "资料照片",
    contact: "联系方式状态",
    transport: "到达方式",
    ageConfirmed: "已确认年满18岁",
    ageMissing: "需要确认",
    photoAdded: "已添加照片",
    photoMissing: "可以稍后添加",
    confirmDetails: "在资料中检查",
    editProfile: "编辑资料",
    close: "关闭",
    noise: { Quiet: "安静", Balanced: "适中", Lively: "热闹" },
  },
  Japanese: {
    title: "自分のイベント",
    subtitle: "自分らしい体験を作り、自分の条件で人を招待しましょう。",
    createEvent: "ミートアップを作成",
    emptyTitle: "まだイベントはありません",
    emptyCopy: "コーヒー、映画、ボードゲーム、散歩、勉強会など、自分らしい集まりを開けます。",
    sheetTitle: "ミートアップを作成",
    sheetSubtitle: "予定、場所、雰囲気を設定します。",
    eventName: "イベント名",
    eventNamePlaceholder: "ボードゲームとコーヒー",
    date: "日付",
    datePlaceholder: "5月24日",
    time: "時間",
    timePlaceholder: "18:30",
    venue: "場所",
    venuePlaceholder: "Chatswood Social Cafe",
    backupVenue: "悪天候時の予備場所",
    backupVenuePlaceholder: "近くのカフェの屋内席",
    noiseLevel: "騒音レベル",
    address: "住所",
    addressPlaceholder: "住所を入力するか下から選択",
    mapReady: "OpenStreetMap / MapLibre 準備完了",
    chooseFromMap: "地図から選択",
    mapCopy: "North Shore のおすすめ場所を選べます。ネイティブ地図タイル追加後、このパネルに MapLibre 地図を表示できます。",
    description: "説明",
    descriptionPlaceholder: "参加者に伝えたいことは？",
    backupPrefix: "予備",
    save: "ミートアップを作成",
    verificationRequiredTitle: "本人確認が必要です",
    verificationRequiredCopy: "安心できるミートアップのため、主催者は現実の予定を公開する前に本人確認が必要です。",
    reviewSettings: "設定を確認",
    verificationTitle: "詳細を確認",
    verificationCopy: "現実の予定を作成する前に、メンバーが安全のために頼るプロフィール情報を確認してください。",
    displayName: "名前",
    suburb: "地域",
    age: "年齢確認",
    photo: "プロフィール写真",
    contact: "連絡先ステータス",
    transport: "到着方法",
    ageConfirmed: "18歳以上確認済み",
    ageMissing: "確認が必要",
    photoAdded: "写真追加済み",
    photoMissing: "後で追加できます",
    confirmDetails: "プロフィールで確認",
    editProfile: "プロフィール編集",
    close: "閉じる",
    noise: { Quiet: "静か", Balanced: "ほどよい", Lively: "にぎやか" },
  },
  Korean: {
    title: "내 이벤트",
    subtitle: "내 방식으로 경험을 만들고 사람들을 초대하세요.",
    createEvent: "모임 만들기",
    emptyTitle: "아직 만든 이벤트가 없어요",
    emptyCopy: "커피 모임, 영화 밤, 보드게임, 산책, 스터디 또는 나다운 활동을 열어보세요.",
    sheetTitle: "모임 만들기",
    sheetSubtitle: "계획, 장소, 분위기를 설정하세요.",
    eventName: "이벤트 이름",
    eventNamePlaceholder: "보드게임과 커피",
    date: "날짜",
    datePlaceholder: "5월 24일",
    time: "시간",
    timePlaceholder: "오후 6:30",
    venue: "장소",
    venuePlaceholder: "Chatswood Social Cafe",
    backupVenue: "악천후 대안",
    backupVenuePlaceholder: "근처 카페의 실내 자리",
    noiseLevel: "소음 수준",
    address: "주소",
    addressPlaceholder: "주소를 입력하거나 아래에서 선택",
    mapReady: "OpenStreetMap / MapLibre 준비됨",
    chooseFromMap: "지도에서 선택",
    mapCopy: "North Shore의 추천 장소를 선택하세요. 네이티브 지도 타일이 추가되면 이 패널에 MapLibre 지도를 넣을 수 있어요.",
    description: "설명",
    descriptionPlaceholder: "사람들이 무엇을 기대하면 좋을까요?",
    backupPrefix: "대안",
    save: "모임 만들기",
    verificationRequiredTitle: "실명 확인이 필요해요",
    verificationRequiredCopy: "신뢰할 수 있는 모임을 위해, 주최자는 실제 계획을 열기 전에 실명 확인 상태가 필요해요.",
    reviewSettings: "설정 확인",
    verificationTitle: "정보 확인",
    verificationCopy: "실제 계획을 만들기 전에, 멤버들이 안전을 위해 참고하는 프로필 정보를 확인해 주세요.",
    displayName: "이름",
    suburb: "지역",
    age: "나이 확인",
    photo: "프로필 사진",
    contact: "연락처 상태",
    transport: "도착 방법",
    ageConfirmed: "만 18세 이상 확인됨",
    ageMissing: "확인 필요",
    photoAdded: "사진 추가됨",
    photoMissing: "나중에 추가 가능",
    confirmDetails: "프로필에서 확인",
    editProfile: "프로필 편집",
    close: "닫기",
    noise: { Quiet: "조용함", Balanced: "적당함", Lively: "활기참" },
  },
  Hebrew: {
    title: "האירועים שלי",
    subtitle: "צור חוויות משלך והזמן אחרים בתנאים שמתאימים לך.",
    createEvent: "יצירת אירוע",
    emptyTitle: "עדיין לא נוצרו אירועים",
    emptyCopy: "אפשר לארח קפה, ערב סרט, משחקי קופסה, הליכה, מפגש לימוד או כל דבר שמרגיש לך נכון.",
    sheetTitle: "יצירת אירוע",
    sheetSubtitle: "קבע את התוכנית, המקום והאווירה.",
    eventName: "שם האירוע",
    eventNamePlaceholder: "משחקי קופסה וקפה",
    date: "תאריך",
    datePlaceholder: "24 במאי",
    time: "שעה",
    timePlaceholder: "18:30",
    venue: "מקום",
    venuePlaceholder: "בית קפה חברתי בצ'אטסווד",
    backupVenue: "חלופה למזג אוויר גרוע",
    backupVenuePlaceholder: "שולחן בפנים בבית קפה קרוב",
    noiseLevel: "רמת רעש",
    address: "כתובת",
    addressPlaceholder: "הקלד כתובת או בחר מהרשימה",
    mapReady: "מוכן ל-OpenStreetMap / MapLibre",
    chooseFromMap: "בחר מהמפה",
    mapCopy: "בחר כרגע מקום מוצע באזור North Shore. הפאנל הזה יוכל להכיל מפת MapLibre כשיתווספו אריחי מפה.",
    description: "תיאור",
    descriptionPlaceholder: "למה אנשים יכולים לצפות?",
    backupPrefix: "חלופה",
    save: "יצירת אירוע",
    verificationRequiredTitle: "נדרש אימות אדם אמיתי",
    verificationRequiredCopy: "כדי לשמור על אמון במפגשים, יוצרים צריכים סטטוס אימות אדם אמיתי לפני פתיחת תוכנית בעולם האמיתי.",
    reviewSettings: "סקירת הגדרות",
    verificationTitle: "אישור הפרטים שלך",
    verificationCopy: "לפני יצירת תוכניות בעולם האמיתי, נא לאשר את פרטי הפרופיל שחברים מסתמכים עליהם לבטיחות.",
    displayName: "שם",
    suburb: "אזור מקומי",
    age: "אישור גיל",
    photo: "תמונת פרופיל",
    contact: "סטטוס קשר",
    transport: "דרך הגעה",
    ageConfirmed: "אושר גיל 18 ומעלה",
    ageMissing: "נדרש אישור",
    photoAdded: "נוספה תמונה",
    photoMissing: "אפשר להוסיף אחר כך",
    confirmDetails: "סקירה בפרופיל",
    editProfile: "עריכת פרופיל",
    close: "סגירה",
    noise: { Quiet: "שקט", Balanced: "מאוזן", Lively: "תוסס" },
  },
} as const;

const placeSuggestions = [
  {
    id: "lane-cove-library",
    name: "Lane Cove Library",
    address: "Library Walk, Lane Cove NSW",
    coordinates: "33.8145°S, 151.1690°E",
  },
  {
    id: "chatswood-interchange",
    name: "Chatswood Interchange",
    address: "Railway Street, Chatswood NSW",
    coordinates: "33.7974°S, 151.1803°E",
  },
  {
    id: "north-sydney-civic",
    name: "North Sydney Civic Centre",
    address: "200 Miller Street, North Sydney NSW",
    coordinates: "33.8342°S, 151.2089°E",
  },
];

type NoiseLevel = (typeof noiseLevels)[number];

type CreatedEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  backupVenue: string;
  noiseLevel: NoiseLevel;
  address: string;
  mapPlace: string;
  coordinates: string;
  description: string;
  preEventQuestions?: string[];
  postEventQuestions?: string[];
};

type EventDraft = Omit<CreatedEvent, "id">;

const emptyDraft: EventDraft = {
  title: "",
  date: "",
  time: "",
  venue: "",
  backupVenue: "",
  noiseLevel: "Balanced",
  address: "",
  mapPlace: "",
  coordinates: "",
  description: "",
};

const createEventId = (title: string) => {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42);

  return `${slug || "event"}-${Date.now().toString(36)}`;
};

export default function EventsScreen() {
  const router = useRouter();
  const {
    ageConfirmed,
    appLanguage,
    contactEmail,
    contactPhone,
    displayName,
    hasIdentityDocument,
    identitySelfieUri,
    isNightMode,
    profilePhotoUri,
    saveSoftHelloMvpState,
    suburb,
    transportationMethod,
    verificationLevel,
  } = useAppSettings();
  const appLanguageBase = getTranslationLanguageBase(appLanguage);
  const copy = eventsTranslations[appLanguageBase as keyof typeof eventsTranslations] ?? eventsTranslations.English;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const isDay = !isNightMode;
  const effectiveVerificationLevel = deriveVerificationLevel({ contactEmail, contactPhone, identitySelfieUri, hasIdentityDocument });
  const canCreateMeetups = canMeetInPerson(effectiveVerificationLevel);
  const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [showVerificationGate, setShowVerificationGate] = useState(false);
  const [isVerificationReviewOpen, setIsVerificationReviewOpen] = useState(false);
  const [draft, setDraft] = useState<EventDraft>(emptyDraft);

  const isDraftValid = useMemo(
    () => Boolean(draft.title.trim() && draft.date.trim() && draft.time.trim() && draft.venue.trim() && draft.address.trim()),
    [draft.address, draft.date, draft.time, draft.title, draft.venue]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadCreatedEvents() {
      try {
        const storedEvents = await AsyncStorage.getItem(CREATED_EVENTS_KEY);

        if (storedEvents && isMounted) {
          setCreatedEvents(JSON.parse(storedEvents) as CreatedEvent[]);
        }
      } catch (error) {
        console.log("Created events could not load:", error);
      }
    }

    loadCreatedEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveEvents = async (events: CreatedEvent[]) => {
    setCreatedEvents(events);

    try {
      await AsyncStorage.setItem(CREATED_EVENTS_KEY, JSON.stringify(events));
    } catch (error) {
      console.log("Created events could not save:", error);
    }
  };

  const updateDraft = (field: keyof EventDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const selectPlace = (place: (typeof placeSuggestions)[number]) => {
    setDraft((current) => ({
      ...current,
      address: place.address,
      mapPlace: place.name,
      coordinates: place.coordinates,
      venue: current.venue || place.name,
    }));
  };

  const resetCreator = () => {
    setDraft(emptyDraft);
    setIsCreatorOpen(false);
  };

  const openCreator = () => {
    if (!canCreateMeetups) {
      setShowVerificationGate(true);
      return;
    }

    setShowVerificationGate(false);
    setIsCreatorOpen(true);
  };

  const confirmVerificationDetails = async () => {
    setIsVerificationReviewOpen(false);
    setShowVerificationGate(false);
    router.push("/(tabs)/profile");
  };

  const createEvent = () => {
    if (!isDraftValid) {
      return;
    }

    const newEvent: CreatedEvent = {
      ...draft,
      id: createEventId(draft.title),
      title: draft.title.trim(),
      date: draft.date.trim(),
      time: draft.time.trim(),
      venue: draft.venue.trim(),
      backupVenue: draft.backupVenue.trim(),
      address: draft.address.trim(),
      mapPlace: draft.mapPlace.trim(),
      coordinates: draft.coordinates.trim(),
      description: draft.description.trim(),
      preEventQuestions: [
        "What's something you're looking forward to this week?",
        "What's your favorite way to spend a weekend?",
        "What's a hobby or interest you'd like to share?"
      ],
      postEventQuestions: [
        "How did you find the atmosphere?",
        "What was your favorite part of the meetup?",
        "Would you like to meet again?"
      ],
    };

    saveEvents([newEvent, ...createdEvents]);
    resetCreator();
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.title}</Text>

        <Text style={[styles.subtitle, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>
          {copy.subtitle}
        </Text>

        <TouchableOpacity
          style={[styles.createButton, !canCreateMeetups && styles.createButtonLocked, isRtl && styles.rtlRow]}
          activeOpacity={0.8}
          onPress={openCreator}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canCreateMeetups }}
        >
          <IconSymbol name="add" color={nsnColors.text} size={19} />
          <Text style={[styles.createButtonText, isRtl && styles.rtlText]}>{copy.createEvent}</Text>
        </TouchableOpacity>

        {showVerificationGate ? (
          <View style={[styles.card, styles.verificationGateCard, isDay && styles.dayCard]}>
            <Text style={[styles.cardTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.verificationRequiredTitle}</Text>
            <Text style={[styles.cardText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{copy.verificationRequiredCopy}</Text>
            <Text style={[styles.verificationGateStatus, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{getMeetingSafetyCopy(effectiveVerificationLevel, appLanguageBase)}</Text>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => setIsVerificationReviewOpen(true)}
              style={[styles.reviewSettingsButton, isRtl && styles.rtlRow]}
              accessibilityRole="button"
            >
              <Text style={styles.reviewSettingsText}>{copy.reviewSettings}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {createdEvents.length === 0 ? (
          <View style={[styles.card, isDay && styles.dayCard]}>
            <Text style={[styles.cardTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.emptyTitle}</Text>

            <Text style={[styles.cardText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>
              {copy.emptyCopy}
            </Text>
          </View>
        ) : (
          <View style={styles.eventList}>
            {createdEvents.map((event) => (
              <TouchableOpacity key={event.id} activeOpacity={0.9} onPress={() => router.push(`/event/${event.id}`)} style={[styles.eventCard, isDay && styles.dayCard]}>
                <View style={[styles.eventHeader, isRtl && styles.rtlRow]}>
                  <View style={[styles.noiseBadge, event.noiseLevel === "Quiet" && styles.quietBadge, event.noiseLevel === "Lively" && styles.livelyBadge]}>
                    <Text style={styles.noiseBadgeText}>{copy.noise[event.noiseLevel]}</Text>
                  </View>
                  <Text style={[styles.eventDate, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{event.date} · {event.time}</Text>
                </View>
                <Text style={[styles.eventTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{event.title}</Text>
                <Text style={[styles.eventMeta, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>⌖ {event.venue}</Text>
                <Text style={[styles.eventMeta, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>◎ {event.mapPlace || event.address}</Text>
                {event.backupVenue ? (
                  <Text style={[styles.eventMeta, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>☔ {copy.backupPrefix}: {event.backupVenue}</Text>
                ) : null}
                {event.description ? (
                  <Text style={[styles.eventDescription, isDay && styles.dayText, isRtl && styles.rtlText]}>{event.description}</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal animationType="slide" visible={isCreatorOpen} onRequestClose={resetCreator}>
        <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
          <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.sheetHeader, isRtl && styles.rtlRow]}>
              <View>
                <Text style={[styles.sheetTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.sheetTitle}</Text>
                <Text style={[styles.sheetSubtitle, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{copy.sheetSubtitle}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={resetCreator}
                accessibilityRole="button"
                accessibilityLabel={copy.close}
                style={[styles.closeButton, isDay && styles.dayCloseButton]}
              >
                <IconSymbol name="xmark" color={isDay ? "#53677A" : nsnColors.muted} size={15} />
                <Text style={[styles.closeText, isDay && styles.daySubtitle]}>{copy.close}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formStack}>
              <LabeledInput label={copy.eventName} value={draft.title} onChangeText={(value) => updateDraft("title", value)} placeholder={copy.eventNamePlaceholder} isDay={isDay} isRtl={isRtl} />

              <View style={[styles.inlineFields, isRtl && styles.rtlRow]}>
                <View style={styles.inlineField}>
                  <LabeledInput label={copy.date} value={draft.date} onChangeText={(value) => updateDraft("date", value)} placeholder={copy.datePlaceholder} isDay={isDay} isRtl={isRtl} />
                </View>
                <View style={styles.inlineField}>
                  <LabeledInput label={copy.time} value={draft.time} onChangeText={(value) => updateDraft("time", value)} placeholder={copy.timePlaceholder} isDay={isDay} isRtl={isRtl} />
                </View>
              </View>

              <LabeledInput label={copy.venue} value={draft.venue} onChangeText={(value) => updateDraft("venue", value)} placeholder={copy.venuePlaceholder} isDay={isDay} isRtl={isRtl} />
              <LabeledInput label={copy.backupVenue} value={draft.backupVenue} onChangeText={(value) => updateDraft("backupVenue", value)} placeholder={copy.backupVenuePlaceholder} isDay={isDay} isRtl={isRtl} />

              <View>
                <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.noiseLevel}</Text>
                <View style={[styles.noiseRow, isRtl && styles.rtlRow]}>
                  {noiseLevels.map((level) => {
                    const active = draft.noiseLevel === level;

                    return (
                      <TouchableOpacity
                        key={level}
                        activeOpacity={0.82}
                        onPress={() => setDraft((current) => ({ ...current, noiseLevel: level }))}
                        style={[styles.noiseOption, isDay && styles.dayNoiseOption, active && styles.noiseOptionActive]}
                      >
                        <Text style={[styles.noiseOptionText, isDay && styles.daySubtitle, active && styles.noiseOptionTextActive]}>{copy.noise[level]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <LabeledInput label={copy.address} value={draft.address} onChangeText={(value) => updateDraft("address", value)} placeholder={copy.addressPlaceholder} isDay={isDay} isRtl={isRtl} />

              <View style={[styles.mapPanel, isDay && styles.dayMapPanel]}>
                <View style={styles.mapGrid}>
                  <Text style={styles.mapPin}>⌖</Text>
                  <Text style={styles.mapWatermark}>{copy.mapReady}</Text>
                </View>
                <Text style={[styles.mapTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{draft.mapPlace || copy.chooseFromMap}</Text>
                <Text style={[styles.mapCopy, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>
                  {draft.coordinates || copy.mapCopy}
                </Text>
              </View>

              <View style={styles.placeList}>
                {placeSuggestions.map((place) => {
                  const selected = draft.mapPlace === place.name;

                  return (
                    <TouchableOpacity
                      key={place.id}
                      activeOpacity={0.82}
                      onPress={() => selectPlace(place)}
                      style={[styles.placeOption, isDay && styles.dayPlaceOption, selected && styles.placeOptionActive, isRtl && styles.rtlRow]}
                    >
                      <View style={styles.placeCopy}>
                        <Text style={[styles.placeName, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{place.name}</Text>
                        <Text style={[styles.placeAddress, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{place.address}</Text>
                      </View>
                      <Text style={[styles.placeCheck, selected && styles.placeCheckActive]}>{selected ? "✓" : ""}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <LabeledInput
                label={copy.description}
                value={draft.description}
                onChangeText={(value) => updateDraft("description", value)}
                placeholder={copy.descriptionPlaceholder}
                isDay={isDay}
                isRtl={isRtl}
                multiline
              />
            </View>

            <TouchableOpacity activeOpacity={0.88} onPress={createEvent} disabled={!isDraftValid} style={[styles.saveButton, !isDraftValid && styles.saveButtonDisabled]}>
              <Text style={styles.saveButtonText}>{copy.save}</Text>
            </TouchableOpacity>
          </ScrollView>
        </ScreenContainer>
      </Modal>

      <Modal transparent animationType="fade" visible={isVerificationReviewOpen} onRequestClose={() => setIsVerificationReviewOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.verificationSheet, isDay && styles.dayModalSheet]}>
            <Text style={[styles.sheetReviewTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.verificationTitle}</Text>
            <Text style={[styles.sheetReviewCopy, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{copy.verificationCopy}</Text>
            <View style={styles.reviewList}>
              {[
                { label: copy.displayName, value: displayName || "NSN member" },
                { label: copy.suburb, value: suburb || "Not set" },
                { label: copy.age, value: ageConfirmed ? copy.ageConfirmed : copy.ageMissing },
                { label: copy.photo, value: profilePhotoUri ? copy.photoAdded : copy.photoMissing },
                { label: copy.contact, value: getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase) },
                { label: copy.transport, value: transportationMethod },
              ].map((item) => (
                <View key={item.label} style={[styles.reviewRow, isDay && styles.dayReviewRow, isRtl && styles.rtlRow]}>
                  <Text style={[styles.reviewLabel, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{item.label}</Text>
                  <Text style={[styles.reviewValue, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{item.value}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity activeOpacity={0.86} onPress={confirmVerificationDetails} style={styles.confirmReviewButton}>
              <Text style={styles.confirmReviewText}>{copy.confirmDetails}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.82} onPress={() => setIsVerificationReviewOpen(false)} style={[styles.secondaryReviewButton, isDay && styles.dayReviewRow]}>
              <Text style={[styles.secondaryReviewText, isDay && styles.dayTitle]}>{copy.close}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  isDay,
  multiline,
  isRtl,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  isDay?: boolean;
  multiline?: boolean;
  isRtl?: boolean;
}) {
  return (
    <View>
      <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textArea, isDay && styles.dayInput, isRtl && styles.rtlInput]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  container: {
    flex: 1,
    backgroundColor: nsnColors.background,
    padding: 20,
  },
  content: { padding: 20, paddingBottom: 112 },

  dayContainer: {
    backgroundColor: "#E8EDF2",
  },
  rtlRow: { flexDirection: "row-reverse" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  rtlInput: { textAlign: "right", writingDirection: "rtl" },

  title: {
    color: nsnColors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  dayTitle: {
    color: "#0B1220",
  },

  subtitle: {
    color: nsnColors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  daySubtitle: {
    color: "#53677A",
  },
  dayText: {
    color: "#111827",
  },

  createButton: {
    backgroundColor: nsnColors.primary,
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    marginBottom: 20,
  },
  createButtonLocked: {
    backgroundColor: "#6D83A8",
  },

  createButtonText: {
    color: nsnColors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    padding: 18,
  },
  verificationGateCard: {
    marginBottom: 20,
  },
  verificationGateStatus: {
    color: nsnColors.muted,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    marginTop: 10,
  },
  reviewSettingsButton: {
    alignSelf: "flex-start",
    minHeight: 38,
    borderRadius: 13,
    backgroundColor: nsnColors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    marginTop: 13,
  },
  reviewSettingsText: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  dayCard: {
    backgroundColor: "#EEF3F4",
    borderColor: "#C5D0DA",
  },

  cardTitle: {
    color: nsnColors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },

  cardText: {
    color: nsnColors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  eventList: { gap: 12 },
  eventCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    padding: 16,
  },
  eventHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 },
  noiseBadge: { borderRadius: 12, backgroundColor: "rgba(247,200,91,0.18)", paddingHorizontal: 10, paddingVertical: 5 },
  quietBadge: { backgroundColor: "rgba(24,200,209,0.18)" },
  livelyBadge: { backgroundColor: "rgba(114,214,126,0.18)" },
  noiseBadgeText: { color: nsnColors.text, fontSize: 11, fontWeight: "900" },
  eventDate: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginBottom: 0 },
  eventTitle: { color: nsnColors.text, fontSize: 18, fontWeight: "900", lineHeight: 24, marginBottom: 6 },
  eventMeta: { color: nsnColors.muted, fontSize: 13, lineHeight: 19, marginBottom: 0 },
  eventDescription: { color: nsnColors.text, fontSize: 14, lineHeight: 21, marginTop: 10 },
  sheetContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 18 },
  sheetTitle: { color: nsnColors.text, fontSize: 26, fontWeight: "900", lineHeight: 32 },
  sheetSubtitle: { color: nsnColors.muted, fontSize: 14, lineHeight: 20, marginTop: 3 },
  closeButton: {
    minHeight: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nsnColors.surface,
    borderWidth: 1,
    borderColor: nsnColors.border,
  },
  dayCloseButton: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  closeText: { color: nsnColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "900" },
  formStack: { gap: 14 },
  label: { color: nsnColors.text, fontSize: 13, lineHeight: 18, fontWeight: "800", marginBottom: 7 },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    color: nsnColors.text,
    fontSize: 14,
    paddingHorizontal: 14,
  },
  dayInput: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA", color: "#0B1220" },
  textArea: { minHeight: 104, paddingTop: 13, lineHeight: 20 },
  inlineFields: { flexDirection: "row", gap: 10 },
  inlineField: { flex: 1 },
  noiseRow: { flexDirection: "row", gap: 8 },
  noiseOption: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNoiseOption: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  noiseOptionActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  noiseOptionText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900", marginBottom: 0 },
  noiseOptionTextActive: { color: nsnColors.text },
  mapPanel: {
    minHeight: 174,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#284476",
    backgroundColor: nsnColors.surfaceRaised,
    overflow: "hidden",
  },
  dayMapPanel: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  mapGrid: {
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10213A",
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  mapPin: { color: nsnColors.cyan, fontSize: 32, fontWeight: "900" },
  mapWatermark: { position: "absolute", right: 12, bottom: 10, color: "#A6B1C7", fontSize: 10, fontWeight: "800" },
  mapTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21, marginHorizontal: 14, marginTop: 12 },
  mapCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginHorizontal: 14, marginTop: 4, marginBottom: 13 },
  placeList: { gap: 9 },
  placeOption: {
    minHeight: 64,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.03)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    gap: 10,
  },
  dayPlaceOption: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  placeOptionActive: { borderColor: nsnColors.primary },
  placeCopy: { flex: 1 },
  placeName: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  placeAddress: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginBottom: 0 },
  placeCheck: { width: 22, color: nsnColors.muted, fontSize: 16, fontWeight: "900", textAlign: "right" },
  placeCheckActive: { color: nsnColors.primary },
  saveButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: nsnColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  saveButtonDisabled: { opacity: 0.42 },
  saveButtonText: { color: nsnColors.text, fontSize: 16, fontWeight: "900" },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(2,8,20,0.42)", padding: 16 },
  verificationSheet: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 16 },
  dayModalSheet: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  sheetReviewTitle: { color: nsnColors.text, fontSize: 20, fontWeight: "900", lineHeight: 26 },
  sheetReviewCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19, marginTop: 4, marginBottom: 12 },
  reviewList: { gap: 8 },
  reviewRow: { minHeight: 56, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", paddingHorizontal: 12, paddingVertical: 9 },
  dayReviewRow: { backgroundColor: "#E8EDF2", borderColor: "#C5D0DA" },
  reviewLabel: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15, marginBottom: 2 },
  reviewValue: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  confirmReviewButton: { minHeight: 48, borderRadius: 15, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", marginTop: 12 },
  confirmReviewText: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  secondaryReviewButton: { minHeight: 46, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center", marginTop: 9 },
  secondaryReviewText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
});
