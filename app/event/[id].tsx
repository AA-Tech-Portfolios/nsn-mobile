import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { nsnActionButtonStyles, nsnActionTextStyles } from "@/components/ui/action-styles";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { IconSymbolName } from "@/components/ui/icon-symbol-map";
import {
  getTranslationLanguageBase,
  type PhotoRecordingComfortPreference,
  useAppSettings,
} from "@/lib/app-settings";
import {
  eventDetailViewModes,
  getEventDetailSupportBlockOrder,
  getInitialExpandedEventDetailSections,
  getVisibleEventDetailSections,
  initialExpandedEventDetailSections,
  type EventDetailSectionId,
  type EventDetailViewMode,
} from "@/lib/event-detail-sections";
import {
  getEventDetailActionHoverPalette,
  getEventDetailHeroImageOutlinePalette,
  getEventDetailHeroImageViewerCopy,
  getEventDetailHeroImageResizeMode,
  getEventDetailHumanMomentPalette,
  getEventDetailSelectedPalette,
  getEventVibeLabel,
} from "@/lib/event-detail-ui";
import {
  getEventDetailHeroAsset,
  type EventDetailHeroAssetKey,
} from "@/lib/event-detail-hero-assets";
import { buildEventCalendarFile, getEventCalendarSaveCopy } from "@/lib/event-calendar-file";
import { shouldShowMissingEvent, shouldWaitForCreatedEventLookup } from "@/lib/event-detail-lookup";
import { buildEventLocationSearchUrl } from "@/lib/event-location-links";
import {
  openExternalDestinationWithConfirmation,
  showExternalOpenFailure,
  type ExternalOpenDestination,
} from "@/lib/external-links";
import { getExpectedGroupSizeCopy, getExpectedGroupSizeValue } from "@/lib/event-attendance-copy";
import { eventCommunityGuidelinesCopy } from "@/lib/community-guidelines-copy";
import { NSN_CREATED_EVENTS_STORAGE_KEY } from "@/lib/local-prototype-storage";
import {
  allEvents,
  movieNight,
  nsnColors,
  type EventArrivalPreview,
  type EventItem,
} from "@/lib/nsn-data";
import {
  askAboutMeetupQuestionGroups,
  conversationStarterPrompts,
  firstMeetupSupportOptions,
  getFirstMeetupSupportSummary,
  meetupComfortRoleOptions,
  practicalMeetupGuidanceItems,
  quickReplyOptions,
  type AskAboutMeetupQuestion,
  type ConversationStarterPrompt,
  type FirstMeetupSupportOption,
  type MeetupComfortRoleOption,
  type QuickReplyOption,
} from "@/lib/options-hub";
import {
  canMeetInPerson,
  getEffectivePrototypeVerificationLevel,
  getEventTrustSummary,
  getEventMembership,
  getMeetingSafetyCopy,
  getRsvpDescription,
  getRsvpLabel,
  getAttendTogetherDescription,
  getAttendTogetherLabel,
  getWeatherFallbackSuggestions,
  getVerificationLevelLabel,
  hideEvent,
  joinEvent,
  leaveEvent,
  removeSavedPlace,
  savePlace,
  savePostEventFeedback,
  pinEvent,
  setEventAttendTogetherStatus,
  setEventRsvpStatus,
  shouldOpenMeetupChat,
  type AttendTogetherStatus,
  type EventMembershipStatus,
  type PostEventFeedback,
  unhideEvent,
  unpinEvent,
} from "@/lib/softhello-mvp";
import {
  meetupOptOutActions,
  meetupReadinessItems,
  planningToolActions,
  type MeetupOptOutAction,
} from "@/lib/meetup-alpha-ux";

const CREATED_EVENTS_KEY = NSN_CREATED_EVENTS_STORAGE_KEY;
const EVENT_DETAIL_VIEW_MODE_STORAGE_KEY = "nsn.event-detail.view-mode.v1";
const DEFAULT_EVENT_DETAIL_VIEW_MODE: EventDetailViewMode = "essential";

const eventDetailImageSources: Record<EventDetailHeroAssetKey, ImageSourcePropType> = {
  picnicBlanket: require("../../assets/images/events/detail-picnic-easy-hangout.png"),
  beach: require("../../assets/images/events/detail-beach-day-chill-vibes.png"),
  movie: { uri: "https://unsplash.com/photos/GvJBboqOebI/download?force=true" },
  library: { uri: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=85" },
  coffee: { uri: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85" },
  harbourWalk: require("../../assets/images/events/detail-harbour-walk-waverton.png"),
  boardGames: { uri: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1200&q=85" },
  ramen: { uri: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=1200&q=85" },
  music: { uri: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85" },
};

const getEventDetailImageSource = (eventId: string) => {
  const heroAsset = getEventDetailHeroAsset(eventId);

  return heroAsset ? eventDetailImageSources[heroAsset.assetKey] : undefined;
};

type CreatedEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  backupVenue: string;
  noiseLevel: string;
  address: string;
  mapPlace: string;
  coordinates: string;
  description: string;
  preEventQuestions?: string[];
  postEventQuestions?: string[];
};

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const getDetailMediaComfortLabels = (
  event: EventItem,
  photoRecordingComfortPreferences: PhotoRecordingComfortPreference[],
) => {
  const labels = [...(event.mediaComfortLabels ?? ["Ask before photos"])];

  if (photoRecordingComfortPreferences.includes("Ask me first")) labels.push("Ask before photos");
  if (photoRecordingComfortPreferences.includes("No photos of me")) labels.push("No photos of me");
  if (photoRecordingComfortPreferences.includes("Group photos are okay"))
    labels.push("Group photos only if everyone agrees");
  if (photoRecordingComfortPreferences.includes("Venue/event photos are okay"))
    labels.push("Venue photos okay");
  if (photoRecordingComfortPreferences.includes("No videos please")) labels.push("No filming");
  if (photoRecordingComfortPreferences.includes("No public posting without permission"))
    labels.push("No public posting");
  if (photoRecordingComfortPreferences.includes("Prefer no screenshots of chats/profile"))
    labels.push("Prefer no screenshots");

  return labels.filter((label, index, all) => all.indexOf(label) === index).slice(0, 5);
};

const savePlaceTranslations = {
  English: {
    save: "Save place",
    saved: "Saved",
    savedMessage: "Place saved",
    removedMessage: "Place removed",
  },
  Chinese: {
    save: "收藏地点",
    saved: "已收藏",
    savedMessage: "地点已收藏",
    removedMessage: "地点已移除",
  },
  Japanese: {
    save: "場所を保存",
    saved: "保存済み",
    savedMessage: "場所を保存しました",
    removedMessage: "場所を削除しました",
  },
  Korean: {
    save: "장소 저장",
    saved: "저장됨",
    savedMessage: "장소가 저장됨",
    removedMessage: "장소가 제거됨",
  },
  Arabic: {
    save: "حفظ المكان",
    saved: "محفوظ",
    savedMessage: "تم حفظ المكان",
    removedMessage: "تمت إزالة المكان",
  },
  Hebrew: {
    save: "שמירת מקום",
    saved: "נשמר",
    savedMessage: "המקום נשמר",
    removedMessage: "המקום הוסר",
  },
  Russian: {
    save: "Сохранить место",
    saved: "Сохранено",
    savedMessage: "Место сохранено",
    removedMessage: "Место удалено",
  },
  Spanish: {
    save: "Guardar lugar",
    saved: "Guardado",
    savedMessage: "Lugar guardado",
    removedMessage: "Lugar eliminado",
  },
} as const;

const eventActionTranslations = {
  English: {
    goBack: "Go back",
    goBackHint: "Returns to the previous screen.",
    shareTitle: "Share event",
    shareMessage: (title: string, venue: string, time: string) =>
      `I found this NSN meetup: ${title} at ${venue}, ${time}.`,
    shareError: "This event could not be shared right now.",
    copiedMessage: "Event details copied to clipboard.",
    savePlaceHint: "Saves this venue to your saved places.",
    removeSavedPlaceHint: "Removes this venue from your saved places.",
    shareHint: "Shares this meetup with someone else, or copies a share message on web.",
    moreHint: "Opens event options such as pin, hide, and saved places.",
    moreTitle: "Event options",
    moreCopy: "Tune how this meetup appears for you.",
    pin: "Pin event",
    unpin: "Unpin event",
    pinHint: "Changes whether this event is prioritised for you.",
    hide: "Hide from Home",
    unhide: "Show on Home",
    hideHint: "Changes whether this event appears on Home.",
    viewSavedPlaces: "View saved places",
    viewSavedPlacesHint: "Opens your saved places list.",
    close: "Close",
    pinnedMessage: "Event pinned",
    unpinnedMessage: "Event unpinned",
    hiddenMessage: "Event hidden from Home",
    unhiddenMessage: "Event visible on Home",
  },
  Hebrew: {
    shareTitle: "שיתוף אירוע",
    shareMessage: (title: string, venue: string, time: string) =>
      `מצאתי מפגש ב-NSN: ${title} ב-${venue}, ${time}.`,
    shareError: "לא הצלחנו לשתף את האירוע כרגע.",
    copiedMessage: "פרטי האירוע הועתקו ללוח.",
    moreTitle: "אפשרויות אירוע",
    moreCopy: "התאם/י איך המפגש הזה מופיע עבורך.",
    pin: "נעץ אירוע",
    unpin: "בטל נעיצה",
    hide: "הסתר מהבית",
    unhide: "הצג בבית",
    viewSavedPlaces: "הצג מקומות שמורים",
    close: "סגירה",
    pinnedMessage: "האירוע ננעץ",
    unpinnedMessage: "נעיצת האירוע בוטלה",
    hiddenMessage: "האירוע הוסתר מהבית",
    unhiddenMessage: "האירוע יוצג בבית",
  },
  Chinese: {
    shareTitle: "分享活动",
    shareMessage: (title: string, venue: string, time: string) =>
      `我发现了这个 NSN 聚会：${title}，地点 ${venue}，时间 ${time}。`,
    shareError: "现在无法分享此活动。",
    copiedMessage: "活动详情已复制到剪贴板。",
    moreTitle: "活动选项",
    moreCopy: "调整此聚会对你的显示方式。",
    pin: "置顶活动",
    unpin: "取消置顶",
    hide: "从首页隐藏",
    unhide: "在首页显示",
    viewSavedPlaces: "查看收藏地点",
    close: "关闭",
    pinnedMessage: "活动已置顶",
    unpinnedMessage: "已取消置顶",
    hiddenMessage: "活动已从首页隐藏",
    unhiddenMessage: "活动已在首页显示",
  },
  Japanese: {
    shareTitle: "イベントを共有",
    shareMessage: (title: string, venue: string, time: string) =>
      `NSNのミートアップを見つけました：${title}、${venue}、${time}。`,
    shareError: "現在このイベントを共有できません。",
    copiedMessage: "イベント詳細をクリップボードにコピーしました。",
    moreTitle: "イベントオプション",
    moreCopy: "このミートアップの表示方法を調整します。",
    pin: "イベントをピン留め",
    unpin: "ピン留めを解除",
    hide: "ホームから非表示",
    unhide: "ホームに表示",
    viewSavedPlaces: "保存済みの場所を見る",
    close: "閉じる",
    pinnedMessage: "イベントをピン留めしました",
    unpinnedMessage: "ピン留めを解除しました",
    hiddenMessage: "イベントをホームから非表示にしました",
    unhiddenMessage: "イベントをホームに表示しました",
  },
  Korean: {
    shareTitle: "이벤트 공유",
    shareMessage: (title: string, venue: string, time: string) =>
      `NSN 모임을 찾았어요: ${title}, ${venue}, ${time}.`,
    shareError: "지금은 이 이벤트를 공유할 수 없어요.",
    copiedMessage: "이벤트 정보가 클립보드에 복사됐어요.",
    moreTitle: "이벤트 옵션",
    moreCopy: "이 모임이 표시되는 방식을 조정하세요.",
    pin: "이벤트 고정",
    unpin: "고정 해제",
    hide: "홈에서 숨기기",
    unhide: "홈에 표시",
    viewSavedPlaces: "저장한 장소 보기",
    close: "닫기",
    pinnedMessage: "이벤트가 고정됨",
    unpinnedMessage: "이벤트 고정 해제됨",
    hiddenMessage: "이벤트가 홈에서 숨겨짐",
    unhiddenMessage: "이벤트가 홈에 표시됨",
  },
} as const;

const verificationWindowTranslations = {
  English: {
    title: "Review prototype details",
    copy: "Local preview only: review the basics this alpha uses to explain future meetup readiness. No real identity provider or production review is connected.",
    displayName: "Name",
    suburb: "Local area",
    age: "Age confirmation",
    photo: "Profile photo",
    contact: "Contact preview",
    transport: "Arrival method",
    ageConfirmed: "18 or older confirmed",
    ageMissing: "Needs confirmation",
    photoAdded: "Photo added",
    photoMissing: "Can be added later",
    confirm: "Review in profile",
    editProfile: "Edit Profile",
    close: "Close",
    defaultMemberName: "NSN member",
    confirmHint: "Reviews these local prototype details for this meetup preview.",
    editProfileHint: "Opens Profile to update readiness, contact, and profile details.",
    verifiedTitle: "Prototype details reviewed",
    verifiedCopy: "This local preview is marked ready to continue.",
  },
  Hebrew: {
    title: "אישור הפרטים שלך",
    copy: "לפני מפגשים פנים אל פנים, NSN מבקשת לאשר את הפרטים הבסיסיים שחברים אחרים מסתמכים עליהם לבטיחות.",
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
    confirm: "סקירה בפרופיל",
    editProfile: "עריכת פרופיל",
    close: "סגירה",
    verifiedTitle: "הפרטים אושרו",
    verifiedCopy: "אפשר להצטרף למפגשים פנים אל פנים.",
  },
  Chinese: {
    title: "确认你的资料",
    copy: "线下聚会前，NSN 会请你确认其他成员用于安全判断的基本信息。",
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
    confirm: "在资料中检查",
    editProfile: "编辑资料",
    close: "关闭",
    verifiedTitle: "资料已确认",
    verifiedCopy: "你已准备好参加线下聚会。",
  },
  Japanese: {
    title: "詳細を確認",
    copy: "対面ミートアップの前に、NSNは他のメンバーが安全のために頼る基本情報の確認をお願いします。",
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
    confirm: "プロフィールで確認",
    editProfile: "プロフィール編集",
    close: "閉じる",
    verifiedTitle: "詳細を確認しました",
    verifiedCopy: "対面ミートアップの準備ができています。",
  },
  Korean: {
    title: "정보 확인",
    copy: "대면 모임 전에 NSN은 다른 멤버들이 안전을 위해 참고하는 기본 정보를 확인해요.",
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
    confirm: "프로필에서 확인",
    editProfile: "프로필 편집",
    close: "닫기",
    verifiedTitle: "정보 확인됨",
    verifiedCopy: "대면 모임에 참여할 준비가 됐어요.",
  },
} as const;

const noiseGuideTranslations = {
  English: {
    title: "Noise level",
    copy: "This describes the sound level of the venue, separate from the social pressure to talk.",
    levels: {
      Quiet: { icon: "🔇", label: "Quiet", copy: "Low noise" },
      Balanced: { icon: "🌿", label: "Moderate", copy: "Moderate noise" },
      Lively: { icon: "🔊", label: "Lively", copy: "More energy" },
    },
  },
  Hebrew: {
    title: "רמת רעש",
    copy: "זה מתאר את רמת הצליל במקום, בנפרד מהלחץ החברתי לדבר.",
    levels: {
      Quiet: { icon: "🔇", label: "שקט", copy: "רעש נמוך" },
      Balanced: { icon: "🌿", label: "מאוזן", copy: "רעש מתון" },
      Lively: { icon: "🔊", label: "תוסס", copy: "יותר אנרגיה" },
    },
  },
  Chinese: {
    title: "噪音水平",
    copy: "这描述场地的声音水平，和社交上是否需要多说话分开。",
    levels: {
      Quiet: { icon: "🔇", label: "安静", copy: "低噪音" },
      Balanced: { icon: "🌿", label: "适中", copy: "中等噪音" },
      Lively: { icon: "🔊", label: "热闹", copy: "更有活力" },
    },
  },
  Japanese: {
    title: "騒音レベル",
    copy: "会話への社会的プレッシャーとは別に、会場の音量を示します。",
    levels: {
      Quiet: { icon: "🔇", label: "静か", copy: "低い騒音" },
      Balanced: { icon: "🌿", label: "ほどよい", copy: "中程度の騒音" },
      Lively: { icon: "🔊", label: "にぎやか", copy: "より活気あり" },
    },
  },
  Korean: {
    title: "소음 수준",
    copy: "말해야 한다는 사회적 부담과 별개로, 장소의 실제 소리 수준을 나타냅니다.",
    levels: {
      Quiet: { icon: "🔇", label: "조용함", copy: "낮은 소음" },
      Balanced: { icon: "🌿", label: "적당함", copy: "중간 소음" },
      Lively: { icon: "🔊", label: "활기참", copy: "더 에너지 있음" },
    },
  },
} as const;

const getDetailSocialPaceLabel = (tone: string) => {
  if (tone === "Quiet") return "Low chat";
  if (tone === "Balanced") return "Easy pace";
  if (tone === "Lively") return "Chatty";
  return tone;
};

const detailEventTranslations: Record<
  string,
  Record<
    string,
    Partial<Pick<EventItem, "title" | "category" | "people" | "description" | "tone" | "weather">>
  >
> = {
  Chinese: {
    "picnic-easy-hangout": {
      title: "野餐 — 轻松相处",
      category: "户外",
      people: "2–4 位成员",
      description: "带些零食，坐下来放松。不需要一直聊天。",
      tone: "适中",
      weather: "受天气影响",
    },
    "beach-day-chill-vibes": {
      title: "海边日 — 放松氛围",
      category: "户外",
      people: "3–6 位成员",
      description: "阳光、海边和好相处的人。自带毛巾。",
      tone: "适中",
      weather: "受天气影响",
    },
    "library-calm-study": {
      title: "图书馆安静学习",
      category: "室内",
      people: "2–5 位成员",
      description: "安静的桌边时间，轻松聊天休息和温和重置。",
      tone: "安静",
      weather: "适合雨天",
    },
    "coffee-lane-cove": {
      title: "咖啡 — 轻松打招呼",
      category: "美食",
      people: "2–4 位成员",
      description: "喝杯咖啡，找个舒服的位置，需要时随时离开。",
      tone: "适中",
      weather: "有室内备用",
    },
    "harbour-walk-waverton": {
      title: "海港散步 — 轻松节奏",
      category: "活动",
      people: "3–6 位成员",
      description: "慢慢散步，有安静时刻和小范围聊天的空间。",
      tone: "适中",
      weather: "受天气影响",
    },
    "board-games-coffee": {
      title: "桌游 + 咖啡",
      category: "室内",
      people: "3–5 位成员",
      description: "简单游戏、热饮和轻松的聊天开场。",
      tone: "适中",
      weather: "适合雨天",
    },
    "ramen-small-table": {
      title: "拉面 — 小桌",
      category: "美食",
      people: "3–5 位成员",
      description: "热乎的食物、简单介绍，不必有压力待到很晚。",
      tone: "适中",
      weather: "适合雨天",
    },
    "quiet-music-listening": {
      title: "安静音乐聆听",
      category: "室内",
      people: "2–5 位成员",
      description: "分享几首平静的歌，只按舒服的程度聊天。",
      tone: "安静",
      weather: "有室内备用",
    },
  },
  Japanese: {
    "picnic-easy-hangout": {
      title: "ピクニック — 気楽な集まり",
      category: "屋外",
      people: "2–4人",
      description: "軽食を持って、座って、リラックス。ずっと話す必要はありません。",
      tone: "ほどよい",
      weather: "天気次第",
    },
    "beach-day-chill-vibes": {
      title: "ビーチデー — ゆったりした雰囲気",
      category: "屋外",
      people: "3–6人",
      description: "太陽、海、気楽な時間。タオルを持参してください。",
      tone: "ほどよい",
      weather: "天気次第",
    },
    "library-calm-study": {
      title: "図書館で静かな勉強",
      category: "屋内",
      people: "2–5人",
      description: "静かなテーブル時間、軽い会話休憩、やさしいリセット。",
      tone: "静か",
      weather: "雨でも安心",
    },
    "coffee-lane-cove": {
      title: "コーヒー — 気軽にこんにちは",
      category: "食事",
      people: "2–4人",
      description: "コーヒーを飲み、居心地よく座り、必要ならいつでも帰れます。",
      tone: "ほどよい",
      weather: "屋内の予備案あり",
    },
    "harbour-walk-waverton": {
      title: "ハーバー散歩 — ゆっくりペース",
      category: "アクティブ",
      people: "3–6人",
      description: "静かな時間と横並びの会話ができる、ゆっくりした散歩。",
      tone: "ほどよい",
      weather: "天気次第",
    },
    "board-games-coffee": {
      title: "ボードゲーム + コーヒー",
      category: "屋内",
      people: "3–5人",
      description: "シンプルなゲーム、温かい飲み物、気軽な会話のきっかけ。",
      tone: "ほどよい",
      weather: "雨でも安心",
    },
    "ramen-small-table": {
      title: "ラーメン — 小さなテーブル",
      category: "食事",
      people: "3–5人",
      description: "温かい食事、簡単な自己紹介、遅くまで残るプレッシャーなし。",
      tone: "ほどよい",
      weather: "雨でも安心",
    },
    "quiet-music-listening": {
      title: "静かな音楽を聴く",
      category: "屋内",
      people: "2–5人",
      description: "落ち着いた曲をいくつか共有し、心地よい分だけ話します。",
      tone: "静か",
      weather: "屋内の予備案あり",
    },
  },
  Korean: {
    "picnic-easy-hangout": {
      title: "피크닉 — 편안한 시간",
      category: "야외",
      people: "2–4명",
      description: "간식을 가져와 앉아서 쉬어요. 계속 말해야 할 부담은 없어요.",
      tone: "적당함",
      weather: "날씨 영향 있음",
    },
    "beach-day-chill-vibes": {
      title: "해변의 날 — 여유로운 분위기",
      category: "야외",
      people: "3–6명",
      description: "햇살, 바다, 좋은 사람들. 수건을 가져오세요.",
      tone: "적당함",
      weather: "날씨 영향 있음",
    },
    "library-calm-study": {
      title: "도서관 차분한 스터디",
      category: "실내",
      people: "2–5명",
      description: "조용한 테이블 시간, 가벼운 대화 휴식, 부드러운 리셋.",
      tone: "조용함",
      weather: "비 오는 날 적합",
    },
    "coffee-lane-cove": {
      title: "커피 — 부담 없는 인사",
      category: "음식",
      people: "2–4명",
      description: "커피를 마시고 편한 곳에 앉아 필요하면 언제든 떠날 수 있어요.",
      tone: "적당함",
      weather: "실내 대안 있음",
    },
    "harbour-walk-waverton": {
      title: "하버 산책 — 쉬운 속도",
      category: "활동",
      people: "3–6명",
      description: "조용한 순간과 옆자리 대화가 가능한 느린 산책.",
      tone: "적당함",
      weather: "날씨 영향 있음",
    },
    "board-games-coffee": {
      title: "보드게임 + 커피",
      category: "실내",
      people: "3–5명",
      description: "간단한 게임, 따뜻한 음료, 쉬운 대화 시작점.",
      tone: "적당함",
      weather: "비 오는 날 적합",
    },
    "ramen-small-table": {
      title: "라멘 — 작은 테이블",
      category: "음식",
      people: "3–5명",
      description: "따뜻한 음식, 간단한 소개, 늦게까지 있어야 한다는 부담 없음.",
      tone: "적당함",
      weather: "비 오는 날 적합",
    },
    "quiet-music-listening": {
      title: "조용한 음악 감상",
      category: "실내",
      people: "2–5명",
      description: "차분한 노래 몇 곡을 공유하고 편한 만큼만 이야기해요.",
      tone: "조용함",
      weather: "실내 대안 있음",
    },
  },
  Hebrew: {
    "picnic-easy-hangout": {
      title: "פיקניק — מפגש קליל",
      category: "חוץ",
      people: "2–4 אנשים",
      description: "מביאים נשנושים, יושבים ונרגעים. אין לחץ לדבר כל הזמן.",
      tone: "מאוזן",
      weather: "תלוי במזג האוויר",
    },
    "beach-day-chill-vibes": {
      title: "יום חוף — אווירה רגועה",
      category: "חוץ",
      people: "3–6 אנשים",
      description: "שמש, ים וחברה טובה. להביא מגבת.",
      tone: "מאוזן",
      weather: "תלוי במזג האוויר",
    },
    "library-calm-study": {
      title: "לימוד רגוע בספרייה",
      category: "פנים",
      people: "2–5 אנשים",
      description: "זמן שקט סביב שולחן, הפסקות שיחה קלות ואיפוס עדין.",
      tone: "שקט",
      weather: "ידידותי לגשם",
    },
    "coffee-lane-cove": {
      title: "קפה — שלום קליל",
      category: "אוכל",
      people: "2–4 אנשים",
      description: "קפה, ישיבה נוחה, ואפשר ללכת מתי שצריך.",
      tone: "מאוזן",
      weather: "חלופה מקורה מוכנה",
    },
    "harbour-walk-waverton": {
      title: "הליכת נמל — קצב קל",
      category: "פעיל",
      people: "3–6 אנשים",
      description: "הליכה איטית עם מקום לשקט ולשיחות צדדיות.",
      tone: "מאוזן",
      weather: "תלוי במזג האוויר",
    },
    "board-games-coffee": {
      title: "משחקי קופסה + קפה",
      category: "פנים",
      people: "3–5 אנשים",
      description: "משחקים פשוטים, שתייה חמה ופתיחות שיחה קלילות.",
      tone: "מאוזן",
      weather: "ידידותי לגשם",
    },
    "ramen-small-table": {
      title: "ראמן — שולחן קטן",
      category: "אוכל",
      people: "3–5 אנשים",
      description: "אוכל חם, היכרות פשוטה, בלי לחץ להישאר מאוחר.",
      tone: "מאוזן",
      weather: "ידידותי לגשם",
    },
    "quiet-music-listening": {
      title: "האזנה למוזיקה שקטה",
      category: "פנים",
      people: "2–5 אנשים",
      description: "משתפים כמה שירים רגועים ומדברים רק כמה שמרגיש טוב.",
      tone: "שקט",
      weather: "חלופה מקורה מוכנה",
    },
  },
};

const eventTranslations = {
  English: {
    title: "Movie Night —\nWatch + Chat",
    category: "Indoor",
    tone: "Pace: Low chat",
    date: "Saturday, 24 May · 7:00pm",
    people: "2–4 people",
    description:
      "Watch first, optional chat after if it feels right. Perfect for low-pressure meetups.",
    weatherTitle: "Weather update",
    weatherCopy: "Rain expected in the evening. This is an indoor meetup.",
    whatToExpect: "What to expect",
    lowPressure: "Low pressure",
    lowPressureCopy: "No forced talking",
    sharedExperience: "Shared experience",
    sharedExperienceCopy: "Watch together",
    flexible: "Flexible",
    flexibleCopy: "Chat after if it feels right",
    meetingPoint: "Meeting point",
    meetingCopy: "Meet at Event Cinemas ticket counter at 6:50pm. We'll grab seats together.",
    join: "Join Meetup",
    spotsLeft: "3 spots left",
    today: "Today",
    tonight: "Tonight",
    genericDescriptionSuffix: "A low-pressure meetup with clear expectations before you join.",
    weatherAffectedCopy:
      "Weather may affect this plan, so check the backup option before heading out.",
    weatherFriendlyCopy: "This event has a weather-friendly plan.",
    genericMeetingCopy: (venue: string) =>
      `Meet near ${venue} about 10 minutes before the start time. The host can share a calmer nearby spot in chat.`,
    meetingSafety: "Prototype meetup readiness",
    softExitTitle: "You can change your mind",
    softExitCopy:
      "You can leave early, take a quiet break, step back from the chat, or come back later. No pressure to talk constantly.",
    ctaReassurance: "Arrive solo, leave anytime, or just listen first.",
    verifyBeforeMeeting: "Verify before meeting",
    openMeetupChat: "Open Meetup Chat",
    openMeetupChatHint: "Opens the meetup group chat.",
    joinHint: "Joins this meetup.",
    verifyBeforeMeetingHint: "Opens local prototype details before meeting in person.",
    postEventCheckIn: "Private post-event check-in",
    feedbackSaved: "Feedback saved privately for this meetup.",
    feedbackPrompt: "After the meetup, note how it felt. This is never a public rating.",
    feedbackGood: "Good",
    feedbackMixed: "Mixed",
    feedbackUnsafe: "Unsafe",
    preEventQuestionsTitle: "Conversation starters",
    preEventQuestionsCopy:
      "Optional prompts and quick replies for low-pressure chat. Use one, ignore them, or join quietly.",
  },
  Chinese: {
    title: "电影夜 —\n观看 + 聊天",
    category: "室内",
    tone: "☽ 安静",
    date: "5月24日，星期六 · 晚上7:00",
    people: "2–4 位成员",
    description: "先看电影，之后如果感觉合适再轻松聊天。适合低压力聚会。",
    weatherTitle: "☀ 天气更新",
    weatherCopy: "预计晚上有雨。这是室内聚会。",
    whatToExpect: "可以期待什么",
    lowPressure: "低压力",
    lowPressureCopy: "不强迫聊天",
    sharedExperience: "共同体验",
    sharedExperienceCopy: "一起观看",
    flexible: "灵活",
    flexibleCopy: "感觉合适再聊天",
    meetingPoint: "集合点",
    meetingCopy: "晚上6:50在 Event Cinemas 售票处见。我们会一起入座。",
    join: "加入聚会",
    spotsLeft: "剩余 3 个名额",
    today: "今天",
    tonight: "今晚",
    genericDescriptionSuffix: "加入前会有清晰预期的低压力聚会。",
    weatherAffectedCopy: "天气可能影响这个计划，出发前请查看备用方案。",
    weatherFriendlyCopy: "此活动已有适合天气的计划。",
    genericMeetingCopy: (venue: string) =>
      `开始前约10分钟在 ${venue} 附近见。主持人可以在聊天中分享更安静的准确地点。`,
    meetingSafety: "聚会安全",
    softExitTitle: "你可以改变主意",
    softExitCopy:
      "如果今天感觉不适合自己的节奏，可以跳过这次聚会。你可以找另一个小组、从聊天中退一步，或稍后再回来。",
    verifyBeforeMeeting: "见面前验证",
    openMeetupChat: "打开聚会聊天",
    openMeetupChatHint: "打开聚会群聊。",
    joinHint: "加入此聚会。",
    verifyBeforeMeetingHint: "打开线下见面前所需的验证详情。",
    postEventCheckIn: "私密会后反馈",
    feedbackSaved: "此聚会的反馈已私密保存。",
    feedbackPrompt: "聚会后记录你的感受。这绝不是公开评分。",
    feedbackGood: "很好",
    feedbackMixed: "一般",
    feedbackUnsafe: "不安全",
    preEventQuestionsTitle: "破冰问题",
    preEventQuestionsCopy: "这些问题可以帮助在聚会开始对话。",
  },
  Japanese: {
    title: "映画ナイト —\n観る + 話す",
    category: "屋内",
    tone: "☽ 静か",
    date: "5月24日（土）· 19:00",
    people: "2–4人",
    description:
      "まず映画を観て、よければ後で少し話します。低プレッシャーなミートアップにぴったりです。",
    weatherTitle: "☀ 天気の更新",
    weatherCopy: "夜に雨が予想されています。これは屋内ミートアップです。",
    whatToExpect: "期待できること",
    lowPressure: "低プレッシャー",
    lowPressureCopy: "無理に話さなくてOK",
    sharedExperience: "共有体験",
    sharedExperienceCopy: "一緒に観る",
    flexible: "柔軟",
    flexibleCopy: "よければ後で話す",
    meetingPoint: "集合場所",
    meetingCopy: "18:50に Event Cinemas のチケットカウンターで会いましょう。一緒に席へ向かいます。",
    join: "ミートアップに参加",
    spotsLeft: "残り3枠",
    today: "今日",
    tonight: "今夜",
    genericDescriptionSuffix: "参加前に期待値が分かる、低プレッシャーなミートアップです。",
    weatherAffectedCopy:
      "天気がこの予定に影響する場合があります。出発前に予備案を確認してください。",
    weatherFriendlyCopy: "このイベントには天気に対応した予定があります。",
    genericMeetingCopy: (venue: string) =>
      `開始約10分前に ${venue} の近くで会いましょう。主催者がチャットでより静かな正確な場所を共有できます。`,
    meetingSafety: "ミートアップの安全",
    softExitTitle: "気が変わっても大丈夫",
    softExitCopy:
      "今日の自分のペースに合わないなら、このミートアップを休んでも大丈夫です。別のグループを探したり、チャットから少し離れたり、後で戻ることもできます。",
    verifyBeforeMeeting: "会う前に確認",
    openMeetupChat: "ミートアップチャットを開く",
    openMeetupChatHint: "ミートアップのグループチャットを開きます。",
    joinHint: "このミートアップに参加します。",
    verifyBeforeMeetingHint: "対面前に必要な確認情報を開きます。",
    postEventCheckIn: "非公開のイベント後チェックイン",
    feedbackSaved: "このミートアップのフィードバックを非公開で保存しました。",
    feedbackPrompt: "ミートアップ後に感じたことを記録できます。公開評価ではありません。",
    feedbackGood: "良かった",
    feedbackMixed: "普通",
    feedbackUnsafe: "不安だった",
    preEventQuestionsTitle: "アイスブレイカー質問",
    preEventQuestionsCopy: "これらの質問はミートアップで会話を始めるのに役立ちます。",
  },
  Korean: {
    title: "영화 밤 —\n보기 + 대화",
    category: "실내",
    tone: "☽ 조용함",
    date: "5월 24일 토요일 · 오후 7:00",
    people: "2–4명",
    description: "먼저 영화를 보고, 괜찮으면 이후에 가볍게 대화해요. 부담 없는 모임에 좋아요.",
    weatherTitle: "☀ 날씨 업데이트",
    weatherCopy: "저녁에 비가 예상돼요. 이 모임은 실내 모임입니다.",
    whatToExpect: "기대할 수 있는 것",
    lowPressure: "낮은 부담",
    lowPressureCopy: "억지 대화 없음",
    sharedExperience: "함께하는 경험",
    sharedExperienceCopy: "같이 보기",
    flexible: "유연함",
    flexibleCopy: "괜찮으면 이후 대화",
    meetingPoint: "만나는 지점",
    meetingCopy: "오후 6:50에 Event Cinemas 매표소에서 만나요. 함께 자리를 잡을게요.",
    join: "모임 참여",
    spotsLeft: "3자리 남음",
    today: "오늘",
    tonight: "오늘 밤",
    genericDescriptionSuffix: "참여 전 기대가 명확한 부담 없는 모임입니다.",
    weatherAffectedCopy: "날씨가 이 계획에 영향을 줄 수 있으니 출발 전 대안을 확인하세요.",
    weatherFriendlyCopy: "이 이벤트에는 날씨에 맞춘 계획이 있어요.",
    genericMeetingCopy: (venue: string) =>
      `시작 약 10분 전에 ${venue} 근처에서 만나요. 주최자가 채팅에서 더 조용한 정확한 장소를 공유할 수 있어요.`,
    meetingSafety: "모임 안전",
    softExitTitle: "마음이 바뀌어도 괜찮아요",
    softExitCopy:
      "오늘 내 속도와 맞지 않으면 이 모임을 건너뛰어도 괜찮아요. 다른 그룹을 찾거나, 채팅에서 잠시 물러나거나, 나중에 돌아올 수 있어요.",
    verifyBeforeMeeting: "만나기 전 인증",
    openMeetupChat: "모임 채팅 열기",
    openMeetupChatHint: "모임 그룹 채팅을 엽니다.",
    joinHint: "이 모임에 참여합니다.",
    verifyBeforeMeetingHint: "대면 전에 필요한 인증 정보를 엽니다.",
    postEventCheckIn: "비공개 모임 후 체크인",
    feedbackSaved: "이 모임의 피드백이 비공개로 저장됐어요.",
    feedbackPrompt: "모임 후 느낌을 기록하세요. 공개 평점이 아니에요.",
    feedbackGood: "좋음",
    feedbackMixed: "보통",
    feedbackUnsafe: "불안함",
    preEventQuestionsTitle: "아이스브레이커 질문",
    preEventQuestionsCopy: "이 질문들은 모임에서 대화를 시작하는 데 도움이 될 수 있어요.",
  },
  Arabic: {
    title: "ليلة فيلم —\nمشاهدة + دردشة",
    category: "داخلي",
    tone: "☽ هادئ",
    date: "السبت، 24 مايو · 7:00 مساءً",
    people: "2–4 أشخاص",
    description: "نشاهد أولاً، ثم دردشة اختيارية إذا كان ذلك مناسباً. مثالي للقاءات بلا ضغط.",
    weatherTitle: "☀ تحديث الطقس",
    weatherCopy: "المطر متوقع في المساء. هذا لقاء داخلي.",
    whatToExpect: "ماذا تتوقع",
    lowPressure: "ضغط منخفض",
    lowPressureCopy: "لا حديث إجباري",
    sharedExperience: "تجربة مشتركة",
    sharedExperienceCopy: "نشاهد معاً",
    flexible: "مرن",
    flexibleCopy: "دردشة بعد ذلك إذا كان الأمر مناسباً",
    meetingPoint: "نقطة اللقاء",
    meetingCopy: "نلتقي عند شباك تذاكر Event Cinemas الساعة 6:50 مساءً. سنجلس معاً.",
    join: "انضم للقاء",
    spotsLeft: "3 أماكن متبقية",
    today: "اليوم",
    tonight: "الليلة",
    genericDescriptionSuffix: "لقاء بلا ضغط مع توقعات واضحة قبل الانضمام.",
    weatherAffectedCopy:
      "قد يؤثر الطقس على هذه الخطة، لذا تحقق من خيار النسخ الاحتياطي قبل الخروج.",
    weatherFriendlyCopy: "لهذا الحدث خطة مناسبة للطقس.",
    genericMeetingCopy: (venue: string) =>
      `نلتقي بالقرب من ${venue} قبل وقت البداية بحوالي 10 دقائق. يمكن للمضيف مشاركة مكان أكثر هدوءاً في الدردشة.`,
    softExitTitle: "يمكنك تغيير رأيك",
    softExitCopy:
      "لا بأس في تخطي هذا اللقاء إذا لم يناسب وتيرتك اليوم. يمكنك العثور على مجموعة أخرى، أو التراجع عن الدردشة، أو العودة لاحقاً.",
    preEventQuestionsTitle: "أسئلة كسر الحواجز",
    preEventQuestionsCopy: "هذه الأسئلة يمكن أن تساعد في بدء المحادثات في اللقاء.",
  },
  Hebrew: {
    title: "ערב סרט —\nצפייה + שיחה",
    category: "בפנים",
    tone: "☽ שקט",
    date: "שבת, 24 במאי · 19:00",
    people: "2–4 אנשים",
    description: "קודם צופים, ואז שיחה אופציונלית אם זה מרגיש מתאים. מושלם למפגש בלי לחץ.",
    weatherTitle: "☀ עדכון מזג אוויר",
    weatherCopy: "צפוי גשם בערב. זה מפגש במקום סגור.",
    whatToExpect: "למה לצפות",
    lowPressure: "בלי לחץ",
    lowPressureCopy: "אין שיחה כפויה",
    sharedExperience: "חוויה משותפת",
    sharedExperienceCopy: "צופים יחד",
    flexible: "גמיש",
    flexibleCopy: "אפשר לדבר אחר כך אם מתאים",
    meetingPoint: "נקודת מפגש",
    meetingCopy: "ניפגש בדלפק הכרטיסים של Event Cinemas בשעה 18:50. נתפוס מקומות יחד.",
    join: "הצטרפות למפגש",
    spotsLeft: "נותרו 3 מקומות",
    today: "היום",
    tonight: "הערב",
    genericDescriptionSuffix: "מפגש בלי לחץ עם ציפיות ברורות לפני ההצטרפות.",
    weatherAffectedCopy:
      "מזג האוויר עשוי להשפיע על התוכנית, אז כדאי לבדוק את אפשרות הגיבוי לפני שיוצאים.",
    weatherFriendlyCopy: "לאירוע הזה יש תוכנית שמתאימה למזג האוויר.",
    genericMeetingCopy: (venue: string) =>
      `ניפגש ליד ${venue} כ-10 דקות לפני שעת ההתחלה. המארח יכול לשתף נקודה רגועה ומדויקת יותר בצ'אט.`,
    softExitTitle: "אפשר לשנות את דעתך",
    softExitCopy:
      "זה בסדר לדלג על המפגש אם הוא לא מרגיש בקצב שלך היום. אפשר למצוא קבוצה אחרת, לקחת צעד אחורה מהצ'אט, או לחזור מאוחר יותר.",
    verifyBeforeMeeting: "אימות לפני מפגש",
    preEventQuestionsTitle: "שאלות קרח-שבירה",
    preEventQuestionsCopy: "שאלות אלו יכולות לעזור להתחיל שיחות במפגש.",
  },
  Russian: {
    title: "Киновечер —\nСмотрим + общаемся",
    category: "В помещении",
    tone: "☽ Спокойно",
    date: "Суббота, 24 мая · 19:00",
    people: "2–4 человека",
    description:
      "Сначала смотрим фильм, потом можно пообщаться, если захочется. Отлично для встреч без давления.",
    weatherTitle: "☀ Погода",
    weatherCopy: "Вечером ожидается дождь. Встреча проходит в помещении.",
    whatToExpect: "Чего ожидать",
    lowPressure: "Без давления",
    lowPressureCopy: "Никаких обязательных разговоров",
    sharedExperience: "Общий опыт",
    sharedExperienceCopy: "Смотрим вместе",
    flexible: "Гибко",
    flexibleCopy: "Можно поговорить после фильма",
    meetingPoint: "Место встречи",
    meetingCopy: "Встречаемся у кассы Event Cinemas в 18:50. Займём места вместе.",
    join: "Присоединиться",
    spotsLeft: "Осталось 3 места",
    today: "Сегодня",
    tonight: "Сегодня вечером",
    genericDescriptionSuffix: "Встреча без давления с понятными ожиданиями перед присоединением.",
    weatherAffectedCopy:
      "Погода может повлиять на план, поэтому проверьте запасной вариант перед выходом.",
    weatherFriendlyCopy: "У этой встречи есть план, подходящий для погоды.",
    genericMeetingCopy: (venue: string) =>
      `Встречаемся рядом с ${venue} примерно за 10 минут до начала. Организатор может поделиться более спокойной точной точкой в чате.`,
    softExitTitle: "Вы можете передумать",
    softExitCopy:
      "Можно пропустить эту встречу, если сегодня она не подходит вашему темпу. Вы можете найти другую группу, отойти от чата или вернуться позже.",
    preEventQuestionsTitle: "Ледоколы",
    preEventQuestionsCopy: "Эти вопросы могут помочь начать разговоры на встрече.",
  },
  Spanish: {
    title: "Noche de cine —\nVer + charlar",
    category: "Interior",
    tone: "☽ Tranquilo",
    date: "Sábado, 24 de mayo · 7:00 p. m.",
    people: "2–4 personas",
    description:
      "Primero vemos la película y luego charla opcional si apetece. Perfecto para quedadas sin presión.",
    weatherTitle: "☀ Actualización del clima",
    weatherCopy: "Se espera lluvia por la tarde. Esta quedada es en interior.",
    whatToExpect: "Qué esperar",
    lowPressure: "Sin presión",
    lowPressureCopy: "Sin charla forzada",
    sharedExperience: "Experiencia compartida",
    sharedExperienceCopy: "Ver juntos",
    flexible: "Flexible",
    flexibleCopy: "Charlar después si apetece",
    meetingPoint: "Punto de encuentro",
    meetingCopy:
      "Nos vemos en la taquilla de Event Cinemas a las 6:50 p. m. Buscaremos asientos juntos.",
    join: "Unirse",
    spotsLeft: "Quedan 3 lugares",
    today: "Hoy",
    tonight: "Esta noche",
    genericDescriptionSuffix: "Una quedada sin presión con expectativas claras antes de unirte.",
    weatherAffectedCopy:
      "El clima puede afectar este plan, así que revisa la opción de respaldo antes de salir.",
    weatherFriendlyCopy: "Este evento tiene un plan adecuado para el clima.",
    genericMeetingCopy: (venue: string) =>
      `Quedamos cerca de ${venue} unos 10 minutos antes de la hora de inicio. La persona anfitriona puede compartir un punto cercano más tranquilo en el chat.`,
    softExitTitle: "Puedes cambiar de opinión",
    softExitCopy:
      "Está bien saltarte esta quedada si hoy no va a tu ritmo. Puedes encontrar otro grupo, apartarte del chat o volver más tarde.",
    preEventQuestionsTitle: "Preguntas de hielo",
    preEventQuestionsCopy: "Estas preguntas pueden ayudar a iniciar conversaciones en la quedada.",
  },
} as const;

function DetailMetaRow({
  actionAccessibilityHint,
  actionAccessibilityLabel,
  actionIconName = "explore",
  iconName,
  label,
  onPress,
  isDay,
  isRtl,
}: {
  actionAccessibilityHint?: string;
  actionAccessibilityLabel?: string;
  actionIconName?: IconSymbolName;
  iconName: "location" | "calendar" | "group";
  label: string;
  onPress?: () => void;
  isDay?: boolean;
  isRtl?: boolean;
}) {
  const hoverPalette = getEventDetailActionHoverPalette(Boolean(isDay));
  const content = (isHovered = false) => (
    <>
      <View style={[styles.metaIconWrap, isDay && styles.dayMetaIconWrap]}>
        <IconSymbol name={iconName} color={isDay ? "#2F80ED" : "#E5E7EB"} size={19} />
      </View>
      <Text style={[styles.metaLine, isDay && styles.dayText, isRtl && styles.rtlText]}>
        {label}
      </Text>
      {onPress ? (
        <View
          style={[
            styles.metaActionIconWrap,
            isDay && styles.dayMetaActionIconWrap,
            isHovered && {
              backgroundColor: hoverPalette.backgroundColor,
              borderColor: hoverPalette.borderColor,
            },
          ]}
        >
          <IconSymbol
            name={actionIconName}
            color={isHovered ? (isDay ? "#284E92" : "#E5E7EB") : isDay ? "#53677A" : nsnColors.muted}
            size={17}
          />
        </View>
      ) : null}
    </>
  );

  if (!onPress) {
    return <View style={[styles.metaRow, isRtl && styles.rtlRow]}>{content()}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={actionAccessibilityLabel ?? `Open broad area in maps for ${label}`}
      accessibilityHint={
        actionAccessibilityHint ?? "Opens an approximate area search, not live navigation."
      }
      style={({ hovered, pressed }) => [
        styles.metaRow,
        styles.metaRowAction,
        (hovered || pressed) && styles.metaRowActionHovered,
        isRtl && styles.rtlRow,
      ]}
    >
      {({ hovered, pressed }) => content(hovered || pressed)}
    </Pressable>
  );
}

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isHeroImageOpen, setIsHeroImageOpen] = useState(false);
  const [viewMode, setViewMode] = useState<EventDetailViewMode>(DEFAULT_EVENT_DETAIL_VIEW_MODE);
  const [expandedSections, setExpandedSections] = useState<EventDetailSectionId[]>(
    getInitialExpandedEventDetailSections(DEFAULT_EVENT_DETAIL_VIEW_MODE) ??
      initialExpandedEventDetailSections,
  );
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>([]);
  const [createdEventsLoaded, setCreatedEventsLoaded] = useState(false);
  const [selectedFirstMeetupSupport, setSelectedFirstMeetupSupport] = useState<
    FirstMeetupSupportOption[]
  >(["No extra support"]);
  const [selectedMeetupQuestion, setSelectedMeetupQuestion] = useState<
    AskAboutMeetupQuestion | ConversationStarterPrompt | QuickReplyOption | null
  >(null);
  const [selectedComfortRoles, setSelectedComfortRoles] = useState<MeetupComfortRoleOption[]>([]);
  const [selectedOptOutAction, setSelectedOptOutAction] = useState<MeetupOptOutAction | null>(null);
  const [selectedPlanningToolId, setSelectedPlanningToolId] =
    useState<(typeof planningToolActions)[number]["id"]>("arrival");
  const [isReadinessToolsOpen, setIsReadinessToolsOpen] = useState(false);
  const {
    ageConfirmed,
    appLanguage,
    displayName,
    isNightMode,
    profilePhotoUri,
    contactEmail,
    contactPhone,
    identitySelfieUri,
    hasIdentityDocument,
    suburb,
    transportationMethod,
    verificationLevel,
    eventMemberships,
    postEventFeedback,
    photoRecordingComfortPreferences,
    savedPlaces,
    pinnedEventIds,
    hiddenEventIds,
    screenReaderHints,
    externalLinks,
    saveSoftHelloMvpState,
  } = useAppSettings();
  const appLanguageBase = getTranslationLanguageBase(appLanguage);
  const copy =
    eventTranslations[appLanguageBase as keyof typeof eventTranslations] ??
    eventTranslations.English;
  const saveCopy =
    savePlaceTranslations[appLanguageBase as keyof typeof savePlaceTranslations] ??
    savePlaceTranslations.English;
  const actionCopy =
    eventActionTranslations[appLanguageBase as keyof typeof eventActionTranslations] ??
    eventActionTranslations.English;
  const verificationCopy = verificationWindowTranslations.English;
  const noiseCopy =
    noiseGuideTranslations[appLanguageBase as keyof typeof noiseGuideTranslations] ??
    noiseGuideTranslations.English;
  const eventCopy = { ...eventTranslations.English, ...copy };
  const eventActionCopy = { ...eventActionTranslations.English, ...actionCopy };
  const eventVerificationCopy = { ...verificationWindowTranslations.English, ...verificationCopy };
  const isRtl = rtlLanguages.has(appLanguageBase);
  const isDay = !isNightMode;
  const iconColor = isDay ? "#0B1220" : nsnColors.text;
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCreatedEvents() {
      try {
        const storedEvents = await AsyncStorage.getItem(CREATED_EVENTS_KEY);

        if (storedEvents && isMounted) {
          setCreatedEvents(JSON.parse(storedEvents) as CreatedEvent[]);
        }
      } catch (error) {
        console.warn("Created events could not load:", error);
      } finally {
        if (isMounted) {
          setCreatedEventsLoaded(true);
        }
      }
    }

    loadCreatedEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadViewMode() {
      try {
        const storedMode = await AsyncStorage.getItem(EVENT_DETAIL_VIEW_MODE_STORAGE_KEY);

        if (
          isMounted &&
          (storedMode === "essential" || storedMode === "detailed" || storedMode === "onTheWay")
        ) {
          setViewMode(storedMode);
        }
      } catch (error) {
        console.warn("Event detail view mode could not load:", error);
      }
    }

    void loadViewMode();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!copyFeedback) return undefined;

    const feedbackTimer = setTimeout(() => setCopyFeedback(null), 2600);
    return () => clearTimeout(feedbackTimer);
  }, [copyFeedback]);

  useEffect(() => {
    AsyncStorage.setItem(EVENT_DETAIL_VIEW_MODE_STORAGE_KEY, viewMode).catch((error) => {
      console.warn("Event detail view mode could not save:", error);
    });
  }, [viewMode]);

  useEffect(() => {
    const visibleNextSections = getVisibleEventDetailSections(viewMode);
    const defaultExpandedSections = getInitialExpandedEventDetailSections(viewMode);

    setExpandedSections((current) => {
      const stillVisibleSections = current.filter((section) =>
        visibleNextSections.includes(section),
      );

      if (stillVisibleSections.length > 0) {
        return stillVisibleSections;
      }

      return defaultExpandedSections.filter((section) => visibleNextSections.includes(section));
    });
  }, [viewMode]);

  const routeEventId = Array.isArray(id) ? id[0] : id;
  const demoEvent = allEvents.find((item) => item.id === routeEventId);
  const createdEvent = createdEvents.find((item) => item.id === routeEventId);
  const rawEvent = demoEvent ?? createdEvent;
  const eventLookupState = {
    routeEventId,
    hasDemoEvent: Boolean(demoEvent),
    hasCreatedEvent: Boolean(createdEvent),
    createdEventsLoaded,
  };

  if (shouldWaitForCreatedEventLookup(eventLookupState)) {
    return (
      <ScreenContainer
        containerClassName="bg-background"
        safeAreaClassName="bg-background"
        style={isDay && styles.dayScreen}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView
          style={[styles.screen, isDay && styles.dayScreen]}
          contentContainerStyle={styles.content}
        >
          <View style={[styles.notFoundCard, isDay && styles.dayCard]}>
            <Text style={[styles.notFoundEyebrow, isDay && styles.dayMutedText]}>Local alpha</Text>
            <Text style={[styles.notFoundTitle, isDay && styles.dayHeadingText]}>
              Loading meetup preview
            </Text>
            <Text style={[styles.notFoundCopy, isDay && styles.dayMutedText]}>
              Checking local prototype meetups on this device.
            </Text>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (shouldShowMissingEvent(eventLookupState)) {
    return (
      <ScreenContainer
        containerClassName="bg-background"
        safeAreaClassName="bg-background"
        style={isDay && styles.dayScreen}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView
          style={[styles.screen, isDay && styles.dayScreen]}
          contentContainerStyle={styles.content}
        >
          <View style={[styles.notFoundCard, isDay && styles.dayCard]}>
            <Text style={[styles.notFoundEyebrow, isDay && styles.dayMutedText]}>Local alpha</Text>
            <Text style={[styles.notFoundTitle, isDay && styles.dayHeadingText]}>
              Event not found in this alpha
            </Text>
            <Text style={[styles.notFoundCopy, isDay && styles.dayMutedText]}>
              This meetup is not available in the local prototype data on this device. You can go
              back to Home or Meetups and choose another plan.
            </Text>
            <View style={styles.notFoundActions}>
              <TouchableOpacity
                activeOpacity={0.84}
                onPress={() => router.replace("/(tabs)" as never)}
                accessibilityRole="button"
                accessibilityLabel="Back to Home"
                style={styles.notFoundPrimaryButton}
              >
                <Text style={styles.notFoundPrimaryText}>Back to Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.78}
                onPress={() => router.replace("/(tabs)/meetups" as never)}
                accessibilityRole="button"
                accessibilityLabel="Open Meetups"
                style={[styles.notFoundSecondaryButton, isDay && styles.dayActionRow]}
              >
                <Text style={[styles.notFoundSecondaryText, isDay && styles.dayText]}>Meetups</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  const event: EventItem = createdEvent
    ? {
        id: createdEvent.id,
        title: createdEvent.title,
        category: "Custom",
        venue: createdEvent.venue,
        time: createdEvent.time,
        people: "2–10 people",
        description: createdEvent.description,
        tone: "Balanced",
        noiseLevel: createdEvent.noiseLevel as any,
        weather: "Indoor ready",
        imageTone: "#29365E",
        emoji: "📅",
        tags: ["Custom"],
        preEventQuestions: createdEvent.preEventQuestions,
        postEventQuestions: createdEvent.postEventQuestions,
      }
    : (rawEvent as EventItem);
  const localizedEvent = {
    ...event,
    ...(detailEventTranslations[appLanguageBase]?.[event.id] ?? {}),
  };
  const isMovieNight = event.id === movieNight.id;
  const eventTitle = isMovieNight ? copy.title : localizedEvent.title.replace(" — ", " —\n");
  const eventTitlePlain = eventTitle.replace(/\n/g, " ");
  const eventCategory = isMovieNight ? copy.category : localizedEvent.category;
  const eventTone = isMovieNight
    ? copy.tone
    : `Pace: ${getDetailSocialPaceLabel(localizedEvent.tone)}`;
  const eventDate = isMovieNight
    ? copy.date
    : createdEvent
      ? `${createdEvent.date} · ${createdEvent.time}`
      : `${isNightMode ? copy.tonight : copy.today} · ${event.time}`;
  const expectedGroupSizeCopy = getExpectedGroupSizeCopy(event);
  const eventDescription = isMovieNight
    ? copy.description
    : `${localizedEvent.description} ${copy.genericDescriptionSuffix}`;
  const eventDetailImage = getEventDetailImageSource(event.id);
  const heroImageViewerCopy = getEventDetailHeroImageViewerCopy(eventTitlePlain);
  const heroImageOutlinePalette = getEventDetailHeroImageOutlinePalette();
  const humanMomentPalette = getEventDetailHumanMomentPalette(isDay);
  const eventNoise = noiseCopy.levels[event.noiseLevel];
  const eventWeatherCopy = event.weather.includes("Weather")
    ? copy.weatherAffectedCopy
    : copy.weatherFriendlyCopy;
  const eventWeatherFallbacks = getWeatherFallbackSuggestions(
    event,
    event.weather.includes("Weather") ? "rainy" : "clear",
  );
  const eventTrustSummary = getEventTrustSummary(event.trustProfile);
  const mediaComfortLabels = getDetailMediaComfortLabels(event, photoRecordingComfortPreferences);
  const eventMeetingCopy = isMovieNight ? copy.meetingCopy : copy.genericMeetingCopy(event.venue);
  const arrivalPreview: EventArrivalPreview = event.arrivalPreview ?? {
    approximateArea: event.venue,
    nearbyLandmark: "Local prototype landmark details are not set yet.",
    arrivalSummary: "Use the broad venue area and host notes before leaving.",
    meetingPointHint: eventMeetingCopy,
    mapSearchArea: event.venue,
    confidenceNotes: event.arrivalConfidenceNotes ?? ["Clear meeting point"],
    venuePreviewImages: [],
  };
  const membership = getEventMembership(event.id, eventMemberships);
  const canOpenMeetupChat = shouldOpenMeetupChat(membership.status);
  const rsvpChoices: { status: EventMembershipStatus; label: string }[] = [
    { status: "going", label: "Going" },
    { status: "interested", label: "Interested" },
    { status: "deciding_later", label: "Deciding later" },
    { status: "running_late", label: "Running late" },
    { status: "unable", label: "Unable to make it" },
    { status: "none", label: "Clear" },
  ];
  const attendTogetherChoices: AttendTogetherStatus[] = [
    "solo",
    "bringing_someone",
    "maybe_bringing_someone",
  ];
  const attendTogetherStatus = membership.attendTogetherStatus ?? "solo";
  const effectiveVerificationLevel = getEffectivePrototypeVerificationLevel(
    { contactEmail, contactPhone, identitySelfieUri, hasIdentityDocument },
    verificationLevel,
  );
  const canMeet = canMeetInPerson(effectiveVerificationLevel);
  const existingFeedback = postEventFeedback.find((item) => item.eventId === event.id);
  const savedPlaceId = `event:${event.id}:${event.venue}`;
  const isPlaceSaved = savedPlaces.some((place) => place.id === savedPlaceId);
  const isEventPinned = pinnedEventIds.includes(event.id);
  const isEventHidden = hiddenEventIds.includes(event.id);
  const eventSnapshotItems = [
    { iconName: "location", label: "Venue", copy: event.venue, accentColor: "#63B3FF" },
    {
      iconName: "volume",
      label: "Noise",
      copy: `${eventNoise.label} · ${eventTone.replace("Pace: ", "")}`,
      accentColor: "#75C8D8",
    },
    {
      iconName: "low-pressure",
      label: "Vibe",
      copy: "Low pressure · optional chat.",
      accentColor: "#5FC8AE",
    },
    {
      iconName: "group",
      label: "Group",
      copy: getExpectedGroupSizeValue(event),
      accentColor: "#8DA7FF",
    },
  ] satisfies { iconName: IconSymbolName; label: string; copy: string; accentColor: string }[];
  const visibleSections = getVisibleEventDetailSections(viewMode);
  const supportBlockOrder = getEventDetailSupportBlockOrder(viewMode);
  const viewModeOption = eventDetailViewModes.find((mode) => mode.id === viewMode);
  const isOnTheWayMode = viewMode === "onTheWay";
  const selectedControlPalette = getEventDetailSelectedPalette(isDay);
  const selectedControlSurfaceStyle = {
    backgroundColor: selectedControlPalette.backgroundColor,
    borderColor: selectedControlPalette.borderColor,
  } as const;
  const selectedControlTextStyle = { color: selectedControlPalette.textColor } as const;
  const vibeLabel = getEventVibeLabel();
  const tonightVibeCopy = isMovieNight
    ? "Watch first, chat later. Most people arrive quietly, settle in, and ease into conversation after the movie. It is okay to listen first or say hello when you are ready."
    : "Arrive gently, settle in, and let the meetup warm up around you. Some people may chat early, others may listen first, and it is okay to join when you feel ready.";
  const firstFiveMinutesCopy = isMovieNight
    ? "You arrive near the cinema entrance. Someone from the group may already be waiting. Some people may chat, others may simply stand nearby. It is okay to watch first, listen first, or step away if you need."
    : "You arrive near the meetup area and look for a small group waiting nearby. Some people may already be chatting, while others are just settling in. You can listen first, join slowly, or take a moment before saying hello.";
  const findingTheGroupCopy = isMovieNight
    ? "Meet near the cinema entrance before tickets or snacks. Look for a small group waiting nearby. You can arrive slowly, check the space first, and join when ready."
    : `${arrivalPreview.meetingPointHint} Look for a small group waiting nearby. You can arrive slowly, check the space first, and join when ready.`;
  const planningToolGuidance = {
    arrival: {
      title: "Plan my arrival",
      copy: `${meetupReadinessItems.find((item) => item.id === "meeting-point")?.copy ?? ""} Venue reminder: ${event.venue}.`,
    },
    bring: {
      title: "What should I bring?",
      copy: meetupReadinessItems.find((item) => item.id === "plan")?.copy ?? "",
    },
    "quieter-option": {
      title: "Need a quieter option?",
      copy:
        eventWeatherFallbacks.length > 0
          ? `${meetupReadinessItems.find((item) => item.id === "backup")?.copy ?? ""} Nearby ideas: ${eventWeatherFallbacks
              .slice(0, 2)
              .join(", ")}.`
          : (meetupReadinessItems.find((item) => item.id === "comfort")?.copy ?? ""),
    },
    "leave-early": {
      title: "Leaving early is okay",
      copy: meetupReadinessItems.find((item) => item.id === "exit")?.copy ?? "",
    },
    "change-mind": {
      title: "Change my mind",
      copy: "Use the local-only actions below if this meetup stops feeling right. Nothing here contacts a host, reserves a spot, or starts live support.",
    },
  } as const;
  const isSectionExpanded = (section: EventDetailSectionId) => expandedSections.includes(section);
  const toggleEventDetailSection = (section: EventDetailSectionId) => {
    setExpandedSections((current) => {
      const isOpen = current.includes(section);

      if (isOpen) {
        return current.filter((item) => item !== section);
      }

      return [section];
    });
  };
  const isSectionVisible = (section: EventDetailSectionId) => visibleSections.includes(section);
  const renderViewModeToggle = () => (
    <View style={[styles.viewModePanel, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
      <View style={[styles.viewModeRow, isRtl && styles.rtlRow]}>
        {eventDetailViewModes.map((mode) => {
          const active = mode.id === viewMode;

          return (
            <TouchableOpacity
              key={mode.id}
              activeOpacity={0.82}
              onPress={() => setViewMode(mode.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[
                styles.viewModeChip,
                isDay && styles.dayActionRow,
                active && styles.viewModeChipActive,
                active && selectedControlSurfaceStyle,
              ]}
            >
              <Text
                style={[
                  styles.viewModeChipText,
                  isDay && styles.dayText,
                  active && styles.viewModeChipTextActive,
                  active && selectedControlTextStyle,
                  isRtl && styles.rtlText,
                ]}
              >
                {mode.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={[styles.viewModeHelper, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
        {viewModeOption?.helper}
      </Text>
    </View>
  );
  const renderArrivalContent = (mode: EventDetailViewMode, compact = false) => {
    const showDetailedArrival = mode === "detailed";
    const isFastArrivalMode = mode === "onTheWay";
    const containerStyles = [
      styles.meetingPanel,
      isDay && styles.dayMeetingPanel,
      isRtl && styles.rtlBlock,
      compact && styles.meetingPanelCompact,
    ];
    const confidenceNotes = arrivalPreview.confidenceNotes.length
      ? arrivalPreview.confidenceNotes
      : (event.arrivalConfidenceNotes ?? []);
    const lookForCopy = isMovieNight
      ? "A small group waiting near the cinema entrance."
      : "A small group waiting near the meetup area.";
    const arrivalRows = isFastArrivalMode
      ? [
          { label: "Venue", value: event.venue },
          { label: "Time", value: eventDate },
          { label: "Meeting point", value: arrivalPreview.meetingPointHint },
          { label: "Nearby landmark", value: arrivalPreview.nearbyLandmark },
          { label: "Look for", value: lookForCopy },
        ]
      : [
          { label: "Approximate area", value: arrivalPreview.approximateArea },
          { label: "Meeting point", value: arrivalPreview.meetingPointHint },
          { label: "Nearby landmark", value: arrivalPreview.nearbyLandmark },
          { label: "Look for", value: lookForCopy },
        ];
    const logisticsRows = [
      { label: "Weather", copy: isMovieNight ? copy.weatherCopy : eventWeatherCopy },
      ...practicalMeetupGuidanceItems.slice(0, 2).map((item) => ({
        label: item.label,
        copy: item.copy,
      })),
    ];

    return (
      <View style={containerStyles}>
        <View
          style={[
            styles.arrivalLeadCard,
            isDay && styles.dayArrivalLeadCard,
            compact && styles.arrivalLeadCardCompact,
          ]}
        >
          <View style={[styles.arrivalPreviewKickerRow, isRtl && styles.rtlRow]}>
            <IconSymbol name="location" color={isDay ? "#284E92" : "#B7CFFF"} size={15} />
            <Text
              style={[
                styles.arrivalPreviewKicker,
                isDay && styles.dayMutedText,
                isRtl && styles.rtlText,
              ]}
            >
              {isFastArrivalMode ? "Next step" : "Finding the group"}
            </Text>
          </View>
          <Text
            style={[
              styles.arrivalLeadTitle,
              isDay && styles.dayHeadingText,
              isRtl && styles.rtlText,
            ]}
          >
            {isFastArrivalMode ? arrivalPreview.meetingPointHint : arrivalPreview.approximateArea}
          </Text>
          <Text
            style={[styles.arrivalLeadCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}
          >
            {findingTheGroupCopy}
          </Text>
        </View>
        <View
          style={[styles.arrivalList, isDay && styles.dayArrivalList, isRtl && styles.rtlBlock]}
        >
          {arrivalRows.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.arrivalListRow,
                index < arrivalRows.length - 1 && styles.arrivalListRowBorder,
                isDay && index < arrivalRows.length - 1 && styles.dayDivider,
                isRtl && styles.rtlRow,
              ]}
            >
              <Text
                style={[
                  styles.arrivalListLabel,
                  isDay && styles.dayMutedText,
                  isRtl && styles.rtlText,
                ]}
              >
                {item.label}
              </Text>
              <Text
                style={[
                  styles.arrivalListValue,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
        {isFastArrivalMode ? (
          <TouchableOpacity
            activeOpacity={0.84}
            onPress={() => {
              void openEventLocation();
            }}
            accessibilityRole="button"
            accessibilityLabel="Get directions"
            accessibilityHint="Opens a broad map search for this meetup area."
            style={[
              styles.mapActionButton,
              isDay && styles.dayMapActionButton,
              isRtl && styles.rtlRow,
            ]}
          >
            <IconSymbol name="explore" color={isDay ? "#0F3F73" : "#EAF3FF"} size={18} />
            <Text
              style={[
                styles.mapActionButtonText,
                isDay && styles.dayHeadingText,
                isRtl && styles.rtlText,
              ]}
            >
              Get directions
            </Text>
          </TouchableOpacity>
        ) : null}
        {confidenceNotes.length > 0 && !isFastArrivalMode ? (
          <View style={[styles.arrivalConfidenceBlock, isRtl && styles.rtlBlock]}>
            <Text
              style={[
                styles.arrivalNoticeTitle,
                isDay && styles.dayHeadingText,
                isRtl && styles.rtlText,
              ]}
            >
              Arrival confidence
            </Text>
            <View style={[styles.mediaComfortChipRow, isRtl && styles.rtlRow]}>
              {confidenceNotes.map((note) => (
                <Text
                  key={note}
                  style={[
                    styles.mediaComfortChip,
                    isDay && styles.dayMediaComfortChip,
                    isRtl && styles.rtlText,
                  ]}
                >
                  {note}
                </Text>
              ))}
            </View>
            <Text
              style={[
                styles.mediaComfortNote,
                isDay && styles.dayMutedText,
                isRtl && styles.rtlText,
              ]}
            >
              Prototype notes only; check venue details before leaving.
            </Text>
          </View>
        ) : null}
        <View
          style={[
            styles.reassuranceBlock,
            styles.supportAccentBlock,
            isDay && styles.daySupportAccentBlock,
            isRtl && styles.rtlBlock,
          ]}
        >
          <View style={[styles.mediaComfortHeader, isRtl && styles.rtlRow]}>
            <View style={[styles.mediaComfortIconWrap, isDay && styles.dayMetaIconWrap]}>
              <IconSymbol name="low-pressure" color={isDay ? "#53677A" : "#8FAFD1"} size={20} />
            </View>
            <Text
              style={[
                styles.mediaComfortTitle,
                isDay && styles.dayHeadingText,
                isRtl && styles.rtlText,
              ]}
            >
              You can arrive slowly or leave anytime
            </Text>
          </View>
          <Text
            style={[styles.mediaComfortCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}
          >
            Wait nearby, watch first, or step out early if that feels better. This is local-only
            guidance, not live host tracking or safety support.
          </Text>
        </View>
        <View
          style={[
            styles.arrivalNoticeBlock,
            isDay && styles.dayArrivalNoticeBlock,
            isRtl && styles.rtlBlock,
          ]}
        >
          <Text
            style={[
              styles.arrivalNoticeTitle,
              isDay && styles.dayHeadingText,
              isRtl && styles.rtlText,
            ]}
          >
            {isFastArrivalMode ? "Weather and transport" : "Weather, transport, and access"}
          </Text>
          <View style={styles.arrivalNoticeList}>
            {logisticsRows.map((item, index) => (
              <View key={`${item.label}-${index}`} style={styles.arrivalNoticeRow}>
                <Text
                  style={[
                    styles.arrivalNoticeLabel,
                    isDay && styles.dayMutedText,
                    isRtl && styles.rtlText,
                  ]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.arrivalNoticeCopy,
                    isDay && styles.dayMutedText,
                    isRtl && styles.rtlText,
                  ]}
                >
                  {item.copy}
                </Text>
              </View>
            ))}
            {!isFastArrivalMode && eventWeatherFallbacks.length > 0 ? (
              <Text
                style={[
                  styles.mediaComfortNote,
                  isDay && styles.dayMutedText,
                  isRtl && styles.rtlText,
                ]}
              >
                Backup idea: {eventWeatherFallbacks.slice(0, 2).join(", ")}.
              </Text>
            ) : null}
          </View>
        </View>
        {showDetailedArrival && event.trustProfile ? (
          <View
            style={[styles.mediaComfortCard, isDay && styles.dayCard, isRtl && styles.rtlBlock]}
          >
            <View style={[styles.mediaComfortHeader, isRtl && styles.rtlRow]}>
              <View style={[styles.mediaComfortIconWrap, isDay && styles.dayMetaIconWrap]}>
                <IconSymbol name="shield" color={isDay ? "#53677A" : "#8FAFD1"} size={20} />
              </View>
              <Text
                style={[
                  styles.mediaComfortTitle,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                Host & venue preview
              </Text>
            </View>
            <Text
              style={[
                styles.mediaComfortCopy,
                isDay && styles.dayMutedText,
                isRtl && styles.rtlText,
              ]}
            >
              {eventTrustSummary}. Host preview: {event.trustProfile.host.displayName}. Venue type:{" "}
              {event.trustProfile.venueType.replace("-", " ")}.
            </Text>
          </View>
        ) : null}
        {showDetailedArrival ? (
          <>
            <View style={[styles.arrivalFamiliarityBlock, isRtl && styles.rtlBlock]}>
              <Text
                style={[
                  styles.mediaComfortTitle,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                Venue familiarity preview
              </Text>
              <View style={[styles.arrivalFamiliarityGrid, isRtl && styles.rtlRow]}>
                {(arrivalPreview.venuePreviewImages?.length
                  ? arrivalPreview.venuePreviewImages
                  : [
                      {
                        kind: "venue" as const,
                        title: "Venue preview",
                        caption: "No demo image is attached yet.",
                        placeholderIcon: "location",
                      },
                    ]
                ).map((image) => {
                    const imageSource = image.imageKey
                      ? getEventDetailImageSource(image.imageKey)
                      : undefined;

                  return (
                    <View
                      key={`${image.kind}-${image.title}`}
                      style={[
                        styles.arrivalFamiliarityCard,
                        isDay && styles.dayArrivalFamiliarityCard,
                      ]}
                    >
                      {imageSource ? (
                        <Image source={imageSource} style={styles.arrivalFamiliarityImage} />
                      ) : (
                        <View
                          style={[
                            styles.arrivalFamiliarityPlaceholder,
                            isDay && styles.dayArrivalFamiliarityPlaceholder,
                          ]}
                        >
                          <IconSymbol
                            name="location"
                            color={isDay ? "#5B6D8E" : "#B7CFFF"}
                            size={18}
                          />
                          <Text
                            style={[
                              styles.arrivalFamiliarityPlaceholderText,
                              isDay && styles.dayMutedText,
                            ]}
                          >
                            Preview coming soon
                          </Text>
                        </View>
                      )}
                      <View style={styles.arrivalFamiliarityText}>
                        <Text
                          style={[
                            styles.arrivalFamiliarityTitle,
                            isDay && styles.dayHeadingText,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          {image.title}
                        </Text>
                        <Text
                          style={[
                            styles.arrivalFamiliarityCaption,
                            isDay && styles.dayMutedText,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          {image.caption}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
            <Text
              style={[
                styles.meetingCopy,
                styles.meetingPrivacyCopy,
                isDay && styles.dayMutedText,
                isRtl && styles.rtlText,
              ]}
            >
              NSN uses broad local area details here. This preview is for arrival comfort and does
              not show participant locations or live mapping.
            </Text>
          </>
        ) : null}
      </View>
    );
  };
  const renderOnTheWayPanel = () => (
    <View style={[styles.onTheWayPanel, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
      <Text style={[styles.safetyTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>
        On the way now
      </Text>
      <Text style={[styles.safetyCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
        Start with the meeting point, landmark, and broad venue area. Exact live tracking and
        emergency support are not connected in this prototype.
      </Text>
      {renderArrivalContent("onTheWay", true)}
    </View>
  );
  const confirmExternalOpen = (
    destination: ExternalOpenDestination,
    openExternalDestination: () => void,
  ) => {
    openExternalDestinationWithConfirmation(
      {
        destination,
        externalLinks,
        platform: Platform.OS,
        alert: Alert.alert,
      },
      openExternalDestination,
    );
  };
  const openEventLocation = async () => {
    const preferredMapAppName =
      externalLinks.preferredMapApp === "apple-maps"
        ? "Apple Maps"
        : externalLinks.preferredMapApp === "google-maps"
          ? "Google Maps"
          : externalLinks.preferredMapApp === "waze"
            ? "Waze"
            : "Maps";
    const mapsUrl = buildEventLocationSearchUrl(
      arrivalPreview.mapSearchArea,
      undefined,
      externalLinks.preferredMapApp,
    );

    const openMaps = async () => {
      try {
        if (Platform.OS === "web") {
          const webWindow = typeof window !== "undefined" ? window : undefined;
          webWindow?.open(mapsUrl, "_blank", "noopener,noreferrer");
          return;
        }

        await Linking.openURL(mapsUrl);
      } catch {
        showExternalOpenFailure({
          platform: Platform.OS,
          title: "Maps unavailable",
          message: `Use the broad arrival area shown here: ${arrivalPreview.approximateArea}.`,
          alert: Alert.alert,
          notify: setCopyFeedback,
        });
      }
    };

    confirmExternalOpen(
      {
        kind: "maps",
        destinationAppName: preferredMapAppName,
        broadAreaName: arrivalPreview.mapSearchArea,
      },
      () => {
        void openMaps();
      },
    );
  };
  const saveEventToCalendar = () => {
    const calendarCopy = getEventCalendarSaveCopy(eventTitle.replace(/\n/g, " "));
    const saveCalendarFile = async () => {
      const calendarFile = buildEventCalendarFile({
        title: eventTitle.replace(/\n/g, " "),
        venue: event.venue,
        dateLabel: eventDate,
        timeLabel: event.time,
        description: eventDescription,
      });

      try {
        if (Platform.OS === "web") {
          const webWindow = typeof window !== "undefined" ? window : undefined;
          const webDocument = typeof document !== "undefined" ? document : undefined;

          if (!webWindow || !webDocument) return;

          const calendarBlob = new Blob([calendarFile.content], { type: calendarFile.mimeType });
          const calendarUrl = webWindow.URL.createObjectURL(calendarBlob);
          const downloadLink = webDocument.createElement("a");
          downloadLink.href = calendarUrl;
          downloadLink.download = calendarFile.filename;
          downloadLink.rel = "noopener";
          webDocument.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.remove();
          webWindow.URL.revokeObjectURL(calendarUrl);
          setCopyFeedback("Calendar file created locally.");
          return;
        }

        await Linking.openURL(
          `data:${calendarFile.mimeType},${encodeURIComponent(calendarFile.content)}`,
        );
      } catch {
        showExternalOpenFailure({
          platform: Platform.OS,
          title: "Calendar unavailable",
          message: "Could not create a local calendar file for this prototype event.",
          alert: Alert.alert,
          notify: setCopyFeedback,
        });
      }
    };

    if (Platform.OS === "web") {
      const webConfirm = typeof window !== "undefined" ? window.confirm : undefined;

      if (webConfirm?.(calendarCopy.body)) {
        void saveCalendarFile();
      }

      return;
    }

    Alert.alert(calendarCopy.title, calendarCopy.body, [
      { text: calendarCopy.cancelLabel, style: "cancel" },
      { text: calendarCopy.saveLabel, onPress: () => void saveCalendarFile() },
    ]);
  };
  const toggleFirstMeetupSupportOption = (option: FirstMeetupSupportOption) => {
    setSelectedFirstMeetupSupport((current) => {
      if (option === "No extra support") return ["No extra support"];

      const selectedWithoutFallback = current.filter((item) => item !== "No extra support");
      const nextSelection = selectedWithoutFallback.includes(option)
        ? selectedWithoutFallback.filter((item) => item !== option)
        : [...selectedWithoutFallback, option];

      return nextSelection.length > 0 ? nextSelection : ["No extra support"];
    });
  };
  const toggleComfortRole = (role: MeetupComfortRoleOption) => {
    setSelectedComfortRoles((current) =>
      current.includes(role) ? current.filter((item) => item !== role) : [...current, role],
    );
  };

  const shareEvent = async () => {
    const message = actionCopy.shareMessage(event.title, event.venue, eventDate);

    try {
      if (Platform.OS === "web") {
        const webNavigator = typeof navigator !== "undefined" ? navigator : undefined;

        if (webNavigator?.share) {
          await webNavigator.share({ title: actionCopy.shareTitle, text: message });
          return;
        }

        if (webNavigator?.clipboard?.writeText) {
          await webNavigator.clipboard.writeText(message);
          setCopyFeedback(actionCopy.copiedMessage);
          return;
        }
      }

      await Share.share({
        title: actionCopy.shareTitle,
        message,
      });
    } catch {
      Alert.alert(actionCopy.shareTitle, actionCopy.shareError);
    }
  };

  const saveRsvpStatus = async (status: EventMembershipStatus) => {
    if (status === "going" && !canMeet) {
      setIsVerificationOpen(true);
      return;
    }

    const nextMemberships = setEventRsvpStatus(event.id, eventMemberships, status);
    await saveSoftHelloMvpState({ eventMemberships: nextMemberships });
  };

  const saveAttendTogetherStatus = async (status: AttendTogetherStatus) => {
    const nextMemberships = setEventAttendTogetherStatus(event.id, eventMemberships, status);
    await saveSoftHelloMvpState({ eventMemberships: nextMemberships });
  };

  const handleOptOutAction = async (action: MeetupOptOutAction) => {
    setSelectedOptOutAction(action);

    if (action.id === "leave") {
      await saveSoftHelloMvpState({ eventMemberships: leaveEvent(event.id, eventMemberships) });
      return;
    }

    if (action.id === "not-right-fit") {
      await saveSoftHelloMvpState({
        eventMemberships: setEventRsvpStatus(event.id, eventMemberships, "not_this_time"),
      });
      return;
    }

    if (
      action.id === "change-group" ||
      action.id === "calmer-option" ||
      action.id === "maybe-later"
    ) {
      await saveSoftHelloMvpState({
        eventMemberships: setEventRsvpStatus(event.id, eventMemberships, "deciding_later"),
      });
      return;
    }

    if (action.id === "hide") {
      await saveSoftHelloMvpState({
        hiddenEventIds: hideEvent(event.id, hiddenEventIds),
        pinnedEventIds: unpinEvent(event.id, pinnedEventIds),
      });
    }
  };

  const renderPlanningToolsPanel = () => (
    <View style={[styles.eventAccordion, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => setIsReadinessToolsOpen((current) => !current)}
        accessibilityRole="button"
        accessibilityState={{ expanded: isReadinessToolsOpen }}
        accessibilityLabel={`${isReadinessToolsOpen ? "Collapse" : "Expand"} planning tools`}
        style={[styles.eventAccordionHeader, isRtl && styles.rtlRow]}
      >
        <View style={[styles.eventAccordionTitleRow, isRtl && styles.rtlRow]}>
          <View style={[styles.eventAccordionIconWrap, isDay && styles.dayMetaIconWrap]}>
            <IconSymbol name="guide" color={isDay ? "#53677A" : "#8FAFD1"} size={18} />
          </View>
          <View style={styles.eventAccordionTitleBlock}>
            <Text
              style={[
                styles.eventAccordionTitle,
                isDay && styles.dayHeadingText,
                isRtl && styles.rtlText,
              ]}
            >
              Planning tools
            </Text>
            <Text
              style={[
                styles.eventAccordionSummary,
                isDay && styles.dayMutedText,
                isRtl && styles.rtlText,
              ]}
            >
              Optional local-only tools for arrival, backup plans, and quiet exits.
            </Text>
          </View>
        </View>
        <IconSymbol
          name={isReadinessToolsOpen ? "chevron.up" : "chevron.down"}
          color={isDay ? "#53677A" : nsnColors.muted}
          size={18}
        />
      </TouchableOpacity>
      {isReadinessToolsOpen ? (
        <View style={styles.eventAccordionBody}>
          <View
            style={[
              styles.planningToolbox,
              isDay && styles.dayArrivalList,
              isRtl && styles.rtlBlock,
            ]}
          >
            <View style={[styles.safetyHeader, isRtl && styles.rtlRow]}>
              <View style={styles.readinessHeaderCopy}>
                <Text
                  style={[
                    styles.safetyTitle,
                    isDay && styles.dayHeadingText,
                    isRtl && styles.rtlText,
                  ]}
                >
                  Optional toolbox
                </Text>
                <Text
                  style={[styles.safetyCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}
                >
                  Local-only prompts for planning, pacing, and stepping back if you need to.
                </Text>
              </View>
              <Text style={[styles.rsvpStatusChip, isDay && styles.dayVerificationChip]}>
                Prototype
              </Text>
            </View>
            <View style={[styles.planningToolChipRow, isRtl && styles.rtlRow]}>
              {planningToolActions.map((tool) => {
                const active = selectedPlanningToolId === tool.id;

                return (
                  <TouchableOpacity
                    key={tool.id}
                    activeOpacity={0.82}
                    onPress={() => {
                      setSelectedPlanningToolId(tool.id);
                      if (tool.id !== "change-mind") {
                        setSelectedOptOutAction(null);
                      }
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={tool.label}
                    accessibilityHint={tool.description}
                    style={[
                      styles.meetupSupportChip,
                      isDay && styles.dayActionRow,
                      active && styles.meetupSupportChipActive,
                      active && selectedControlSurfaceStyle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.meetupSupportChipText,
                        isDay && styles.dayText,
                        active && styles.meetupSupportChipTextActive,
                        active && selectedControlTextStyle,
                        isRtl && styles.rtlText,
                      ]}
                    >
                      {tool.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View
              style={[
                styles.planningToolResult,
                selectedPlanningToolId === "change-mind"
                  ? styles.supportAccentBlock
                  : styles.arrivalNoticeBlock,
                selectedPlanningToolId === "change-mind" && isDay && styles.daySupportAccentBlock,
                selectedPlanningToolId !== "change-mind" && isDay && styles.dayArrivalNoticeBlock,
                isRtl && styles.rtlBlock,
              ]}
            >
              <Text
                style={[
                  styles.planningToolResultTitle,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                {planningToolGuidance[selectedPlanningToolId].title}
              </Text>
              <Text
                style={[
                  styles.planningToolResultCopy,
                  isDay && styles.dayMutedText,
                  isRtl && styles.rtlText,
                ]}
              >
                {planningToolGuidance[selectedPlanningToolId].copy}
              </Text>
            </View>
            {selectedPlanningToolId === "change-mind" || selectedOptOutAction ? (
              <View
                style={[
                  styles.optOutPanel,
                  styles.planningToolOptOutPanel,
                  isRtl && styles.rtlBlock,
                ]}
              >
                <View style={[styles.optOutActions, isRtl && styles.rtlRow]}>
                  {meetupOptOutActions.map((action) => {
                    const active = selectedOptOutAction?.id === action.id;

                    return (
                      <TouchableOpacity
                        key={action.id}
                        activeOpacity={0.82}
                        onPress={() => handleOptOutAction(action)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={action.label}
                        accessibilityHint={action.copy}
                        style={[
                          styles.optOutChoice,
                          isDay && styles.dayActionRow,
                          active && styles.meetupSupportChipActive,
                          active && selectedControlSurfaceStyle,
                        ]}
                      >
                        <IconSymbol
                          name={action.iconName}
                          color={active ? "#FFFFFF" : isDay ? "#53677A" : nsnColors.muted}
                          size={15}
                        />
                        <Text
                          style={[
                            styles.optOutChoiceText,
                            isDay && styles.dayText,
                            active && styles.meetupSupportChipTextActive,
                            active && selectedControlTextStyle,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          {action.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {selectedOptOutAction ? (
                  <View style={[styles.optOutResult, isDay && styles.dayActionRow]}>
                    <Text
                      style={[
                        styles.readinessTitle,
                        isDay && styles.dayHeadingText,
                        isRtl && styles.rtlText,
                      ]}
                    >
                      {selectedOptOutAction.label}
                    </Text>
                    <Text
                      style={[
                        styles.readinessCopy,
                        isDay && styles.dayMutedText,
                        isRtl && styles.rtlText,
                      ]}
                    >
                      {selectedOptOutAction.result}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            <Text
              style={[
                styles.planningToolFootnote,
                isDay && styles.dayMutedText,
                isRtl && styles.rtlText,
              ]}
            >
              These tools stay local to this prototype. They do not contact a host, reserve a spot,
              or connect live safety support.
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );

  const renderRsvpPanel = () =>
    isOnTheWayMode ? (
      <View
        style={[
          styles.rsvpPanel,
          styles.compactRsvpPanel,
          isDay && styles.dayCard,
          isRtl && styles.rtlBlock,
        ]}
      >
        <View style={[styles.safetyHeader, isRtl && styles.rtlRow]}>
          <Text
            style={[styles.safetyTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}
          >
            Current RSVP & support note
          </Text>
          <Text style={[styles.rsvpStatusChip, isDay && styles.dayVerificationChip]}>
            {getRsvpLabel(membership.status)}
          </Text>
        </View>
        <View style={[styles.arrivalList, styles.compactMetaList, isDay && styles.dayArrivalList]}>
          {[
            { label: "RSVP", value: getRsvpDescription(membership.status) },
            { label: "Walking in", value: getAttendTogetherDescription(attendTogetherStatus) },
          ].map((item, index, items) => (
            <View
              key={item.label}
              style={[
                styles.arrivalListRow,
                index < items.length - 1 && styles.arrivalListRowBorder,
                isDay && index < items.length - 1 && styles.dayDivider,
                isRtl && styles.rtlRow,
              ]}
            >
              <Text
                style={[
                  styles.arrivalListLabel,
                  isDay && styles.dayMutedText,
                  isRtl && styles.rtlText,
                ]}
              >
                {item.label}
              </Text>
              <Text
                style={[
                  styles.arrivalListValue,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={[
            styles.reassuranceBlock,
            styles.supportAccentBlock,
            isDay && styles.daySupportAccentBlock,
            isRtl && styles.rtlBlock,
          ]}
        >
          <Text
            style={[styles.safetyTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}
          >
            You do not have to walk in alone
          </Text>
          <Text style={[styles.safetyCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Bring a friend, sibling, partner, parent, or support person. Open Essential or Detailed
            if you want to change your RSVP or support note.
          </Text>
        </View>
      </View>
    ) : (
      <View style={[styles.rsvpPanel, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
        <View style={[styles.safetyHeader, isRtl && styles.rtlRow]}>
          <Text
            style={[styles.safetyTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}
          >
            Local RSVP preview
          </Text>
          <Text style={[styles.rsvpStatusChip, isDay && styles.dayVerificationChip]}>
            {getRsvpLabel(membership.status)}
          </Text>
        </View>
        <Text style={[styles.safetyCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
          Prototype only: this RSVP is saved locally on this device. It does not reserve a real
          spot, message anyone, or change the meetup plan.
        </Text>
        <Text
          style={[styles.rsvpDescription, isDay && styles.dayMutedText, isRtl && styles.rtlText]}
        >
          {getRsvpDescription(membership.status)}
        </Text>
        <View style={styles.rsvpActions}>
          {rsvpChoices.map((choice) => {
            const active =
              choice.status === membership.status ||
              (choice.status === "going" && membership.status === "joined");

            return (
              <TouchableOpacity
                key={choice.status}
                activeOpacity={0.82}
                onPress={() => saveRsvpStatus(choice.status)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  styles.rsvpChoice,
                  isDay && styles.dayActionRow,
                  active && styles.rsvpChoiceActive,
                  active && selectedControlSurfaceStyle,
                ]}
              >
                <Text
                  style={[
                    styles.rsvpChoiceText,
                    isDay && styles.dayText,
                    active && styles.rsvpChoiceTextActive,
                    active && selectedControlTextStyle,
                  ]}
                >
                  {choice.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={[
            styles.attendTogetherReassurance,
            styles.supportAccentBlock,
            isDay && styles.daySupportAccentBlock,
            isRtl && styles.rtlBlock,
          ]}
        >
          <Text
            style={[styles.safetyTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}
          >
            You do not have to walk in alone
          </Text>
          <Text style={[styles.safetyCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Bring a friend, sibling, partner, parent, or support person. They do not need to be on
            NSN for this local prototype note.
          </Text>
          <View style={styles.rsvpActions}>
            {attendTogetherChoices.map((choice) => {
              const active = choice === attendTogetherStatus;

              return (
                <TouchableOpacity
                  key={choice}
                  activeOpacity={0.82}
                  onPress={() => saveAttendTogetherStatus(choice)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={[
                    styles.rsvpChoice,
                    isDay && styles.dayActionRow,
                    active && styles.rsvpChoiceActive,
                    active && selectedControlSurfaceStyle,
                  ]}
                >
                  <Text
                    style={[
                      styles.rsvpChoiceText,
                      isDay && styles.dayText,
                      active && styles.rsvpChoiceTextActive,
                      active && selectedControlTextStyle,
                    ]}
                  >
                    {getAttendTogetherLabel(choice)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text
            style={[styles.rsvpDescription, isDay && styles.dayMutedText, isRtl && styles.rtlText]}
          >
            {getAttendTogetherDescription(attendTogetherStatus)}
          </Text>
        </View>
      </View>
    );

  const handleJoin = async () => {
    if (canOpenMeetupChat) {
      router.push({ pathname: "/(tabs)/chats", params: { eventId: event.id } } as never);
      return;
    }

    if (!canMeet) {
      setIsVerificationOpen(true);
      return;
    }

    const nextMemberships = joinEvent(event.id, eventMemberships);
    await saveSoftHelloMvpState({ eventMemberships: nextMemberships });
    router.push({ pathname: "/(tabs)/chats", params: { eventId: event.id } } as never);
  };

  const confirmVerificationDetails = async () => {
    setIsVerificationOpen(false);
    router.push("/(tabs)/profile");
  };

  const saveFeedback = async (comfort: PostEventFeedback["comfort"], wouldMeetAgain: boolean) => {
    const nextFeedback = savePostEventFeedback(
      {
        eventId: event.id,
        comfort,
        wouldMeetAgain,
        createdAt: new Date().toISOString(),
      },
      postEventFeedback,
    );

    await saveSoftHelloMvpState({ postEventFeedback: nextFeedback });
  };

  const toggleSavedPlace = async () => {
    const nextSavedPlaces = isPlaceSaved
      ? removeSavedPlace(savedPlaceId, savedPlaces)
      : savePlace(
          {
            id: savedPlaceId,
            venue: event.venue,
            category: event.category,
            sourceEventId: event.id,
            sourceEventTitle: event.title,
            weather: event.weather,
            savedAt: new Date().toISOString(),
          },
          savedPlaces,
        );

    await saveSoftHelloMvpState({ savedPlaces: nextSavedPlaces });
    Alert.alert(isPlaceSaved ? saveCopy.removedMessage : saveCopy.savedMessage, event.venue);
  };

  const togglePinnedEvent = async () => {
    const nextPinnedEventIds = isEventPinned
      ? unpinEvent(event.id, pinnedEventIds)
      : pinEvent(event.id, pinnedEventIds);
    const nextHiddenEventIds = isEventPinned
      ? hiddenEventIds
      : unhideEvent(event.id, hiddenEventIds);

    await saveSoftHelloMvpState({
      pinnedEventIds: nextPinnedEventIds,
      hiddenEventIds: nextHiddenEventIds,
    });
    setIsMoreMenuOpen(false);
    Alert.alert(isEventPinned ? actionCopy.unpinnedMessage : actionCopy.pinnedMessage, event.title);
  };

  const toggleHiddenEvent = async () => {
    const nextHiddenEventIds = isEventHidden
      ? unhideEvent(event.id, hiddenEventIds)
      : hideEvent(event.id, hiddenEventIds);
    const nextPinnedEventIds = isEventHidden
      ? pinnedEventIds
      : unpinEvent(event.id, pinnedEventIds);

    await saveSoftHelloMvpState({
      hiddenEventIds: nextHiddenEventIds,
      pinnedEventIds: nextPinnedEventIds,
    });
    setIsMoreMenuOpen(false);
    Alert.alert(isEventHidden ? actionCopy.unhiddenMessage : actionCopy.hiddenMessage, event.title);
  };

  const renderAccordionSection = (
    section: EventDetailSectionId,
    title: string,
    summary: string,
    iconName: IconSymbolName,
    children: ReactNode,
  ) => {
    const expanded = isSectionExpanded(section);

    return (
      <View style={[styles.eventAccordion, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => toggleEventDetailSection(section)}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={`${expanded ? "Collapse" : "Expand"} ${title}`}
          style={[styles.eventAccordionHeader, isRtl && styles.rtlRow]}
        >
          <View style={[styles.eventAccordionTitleRow, isRtl && styles.rtlRow]}>
            <View style={[styles.eventAccordionIconWrap, isDay && styles.dayMetaIconWrap]}>
              <IconSymbol name={iconName} color={isDay ? "#53677A" : "#8FAFD1"} size={18} />
            </View>
            <View style={styles.eventAccordionTitleBlock}>
              <Text
                style={[
                  styles.eventAccordionTitle,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                {title}
              </Text>
              <Text
                style={[
                  styles.eventAccordionSummary,
                  isDay && styles.dayMutedText,
                  isRtl && styles.rtlText,
                ]}
              >
                {summary}
              </Text>
            </View>
          </View>
          <IconSymbol
            name={expanded ? "chevron.up" : "chevron.down"}
            color={isDay ? "#53677A" : nsnColors.muted}
            size={18}
          />
        </TouchableOpacity>
        {expanded ? <View style={styles.eventAccordionBody}>{children}</View> : null}
      </View>
    );
  };

  return (
    <ScreenContainer
      containerClassName="bg-background"
      safeAreaClassName="bg-background"
      style={isDay && styles.dayScreen}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        ref={scrollRef}
        style={[styles.screen, isDay && styles.dayScreen]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.topBar, isRtl && styles.rtlRow]}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.back()}
            style={[styles.iconButton, isDay && styles.dayIconButton]}
            accessibilityRole="button"
            accessibilityLabel={eventActionCopy.goBack}
            accessibilityHint={screenReaderHints ? eventActionCopy.goBackHint : undefined}
          >
            <IconSymbol name="chevron.left" color={iconColor} size={26} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={shareEvent}
              accessibilityRole="button"
              accessibilityLabel={actionCopy.shareTitle}
              accessibilityHint={screenReaderHints ? eventActionCopy.shareHint : undefined}
              style={[styles.iconButton, isDay && styles.dayIconButton]}
            >
              <IconSymbol name="share" color={iconColor} size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setIsMoreMenuOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={actionCopy.moreTitle}
              accessibilityHint={screenReaderHints ? eventActionCopy.moreHint : undefined}
              style={[
                styles.iconButton,
                isDay && styles.dayIconButton,
                (isEventPinned || isEventHidden) && styles.activeMoreButton,
              ]}
            >
              <IconSymbol name="more" color={iconColor} size={23} />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          transparent
          animationType="fade"
          visible={isMoreMenuOpen}
          onRequestClose={() => setIsMoreMenuOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.actionSheet, isDay && styles.dayActionSheet]}>
              <Text
                style={[
                  styles.actionSheetTitle,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                {actionCopy.moreTitle}
              </Text>
              <Text
                style={[
                  styles.actionSheetCopy,
                  isDay && styles.dayMutedText,
                  isRtl && styles.rtlText,
                ]}
              >
                {actionCopy.moreCopy}
              </Text>
              <View style={styles.actionList}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={togglePinnedEvent}
                  style={[styles.actionRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]}
                  accessibilityRole="button"
                  accessibilityHint={screenReaderHints ? eventActionCopy.pinHint : undefined}
                >
                  <IconSymbol
                    name="pin"
                    color={isEventPinned ? nsnColors.day : iconColor}
                    size={20}
                  />
                  <Text
                    style={[styles.actionText, isDay && styles.dayText, isRtl && styles.rtlText]}
                  >
                    {isEventPinned ? actionCopy.unpin : actionCopy.pin}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={toggleHiddenEvent}
                  style={[styles.actionRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]}
                  accessibilityRole="button"
                  accessibilityHint={screenReaderHints ? eventActionCopy.hideHint : undefined}
                >
                  <IconSymbol
                    name={isEventHidden ? "visibility" : "visibility.off"}
                    color={isEventHidden ? "#2F80ED" : nsnColors.danger}
                    size={20}
                  />
                  <Text
                    style={[styles.actionText, isDay && styles.dayText, isRtl && styles.rtlText]}
                  >
                    {isEventHidden ? actionCopy.unhide : actionCopy.hide}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => {
                    setIsMoreMenuOpen(false);
                    router.push("/(tabs)/saved-places");
                  }}
                  style={[styles.actionRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]}
                  accessibilityRole="button"
                  accessibilityHint={
                    screenReaderHints ? eventActionCopy.viewSavedPlacesHint : undefined
                  }
                >
                  <IconSymbol name="bookmark" color={nsnColors.day} size={20} />
                  <Text
                    style={[styles.actionText, isDay && styles.dayText, isRtl && styles.rtlText]}
                  >
                    {actionCopy.viewSavedPlaces}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => setIsMoreMenuOpen(false)}
                style={styles.closeActionButton}
              >
                <Text style={styles.closeActionText}>{actionCopy.close}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          animationType="fade"
          visible={isVerificationOpen}
          onRequestClose={() => setIsVerificationOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.verificationSheet, isDay && styles.dayActionSheet]}>
              <Text
                style={[
                  styles.actionSheetTitle,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                {verificationCopy.title}
              </Text>
              <Text
                style={[
                  styles.actionSheetCopy,
                  isDay && styles.dayMutedText,
                  isRtl && styles.rtlText,
                ]}
              >
                {verificationCopy.copy}
              </Text>
              <View style={styles.verificationList}>
                {[
                  {
                    label: verificationCopy.displayName,
                    value: displayName || eventVerificationCopy.defaultMemberName,
                  },
                  { label: verificationCopy.suburb, value: suburb || event.venue },
                  {
                    label: verificationCopy.age,
                    value: ageConfirmed
                      ? verificationCopy.ageConfirmed
                      : verificationCopy.ageMissing,
                  },
                  {
                    label: verificationCopy.photo,
                    value: profilePhotoUri
                      ? verificationCopy.photoAdded
                      : verificationCopy.photoMissing,
                  },
                  {
                    label: verificationCopy.contact,
                    value: getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase),
                  },
                  { label: verificationCopy.transport, value: transportationMethod },
                ].map((item) => (
                  <View
                    key={item.label}
                    style={[
                      styles.verificationRow,
                      isDay && styles.dayActionRow,
                      isRtl && styles.rtlRow,
                    ]}
                  >
                    <Text
                      style={[
                        styles.verificationLabel,
                        isDay && styles.dayMutedText,
                        isRtl && styles.rtlText,
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.verificationValue,
                        isDay && styles.dayText,
                        isRtl && styles.rtlText,
                      ]}
                    >
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.verificationActions}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={confirmVerificationDetails}
                  style={styles.confirmVerificationButton}
                  accessibilityRole="button"
                  accessibilityHint={
                    screenReaderHints ? eventVerificationCopy.confirmHint : undefined
                  }
                >
                  <Text style={styles.confirmVerificationText}>{verificationCopy.confirm}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => {
                    setIsVerificationOpen(false);
                    router.push("/(tabs)/profile");
                  }}
                  style={[styles.secondaryVerificationButton, isDay && styles.dayActionRow]}
                  accessibilityRole="button"
                  accessibilityHint={
                    screenReaderHints ? eventVerificationCopy.editProfileHint : undefined
                  }
                >
                  <Text style={[styles.secondaryVerificationText, isDay && styles.dayText]}>
                    {verificationCopy.editProfile}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => setIsVerificationOpen(false)}
                  style={styles.closeActionButton}
                >
                  <Text style={styles.closeActionText}>{verificationCopy.close}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent
          animationType="fade"
          visible={Boolean(eventDetailImage && isHeroImageOpen)}
          onRequestClose={() => setIsHeroImageOpen(false)}
        >
          <View style={styles.heroImageModalBackdrop}>
            <View style={styles.heroImageModalTopBar}>
              <TouchableOpacity
                activeOpacity={0.78}
                onPress={() => setIsHeroImageOpen(false)}
                accessibilityRole="button"
                accessibilityLabel={heroImageViewerCopy.closeLabel}
                style={styles.heroImageModalCloseButton}
              >
                <IconSymbol name="chevron.left" color={nsnColors.text} size={24} />
              </TouchableOpacity>
              <Text
                style={[
                  styles.heroImageModalTitle,
                  isRtl && styles.rtlText,
                ]}
              >
                {heroImageViewerCopy.title}
              </Text>
            </View>
            {eventDetailImage ? (
              <View style={styles.heroImageModalImageFrame}>
                <Image
                  source={eventDetailImage}
                  resizeMode="contain"
                  style={styles.heroImageModalImage}
                />
                <View
                  pointerEvents="none"
                  style={[
                    styles.heroImageInnerOutline,
                    {
                      backgroundColor: heroImageOutlinePalette.overlayColor,
                      borderColor: heroImageOutlinePalette.borderColor,
                    },
                  ]}
                />
              </View>
            ) : null}
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => setIsHeroImageOpen(false)}
              accessibilityRole="button"
              accessibilityLabel={heroImageViewerCopy.closeLabel}
              style={styles.heroImageModalReturnButton}
            >
              <Text style={styles.heroImageModalReturnText}>
                {heroImageViewerCopy.closeLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <View style={[styles.heroPanel, isDay && styles.dayPanel]}>
          {eventDetailImage ? (
            <Pressable
              onPress={() => setIsHeroImageOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={heroImageViewerCopy.openLabel}
              accessibilityHint={screenReaderHints ? heroImageViewerCopy.openHint : undefined}
              style={({ hovered, pressed }) => [
                styles.eventHeroImageFrame,
                isDay && styles.dayEventHeroImageFrame,
                (hovered || pressed) && styles.eventHeroImageFrameHovered,
              ]}
            >
              <Image
                source={eventDetailImage}
                resizeMode={getEventDetailHeroImageResizeMode()}
                style={styles.eventHeroImage}
              />
              <View
                pointerEvents="none"
                style={[
                  styles.heroImageInnerOutline,
                  {
                    backgroundColor: heroImageOutlinePalette.overlayColor,
                    borderColor: heroImageOutlinePalette.borderColor,
                  },
                ]}
              />
              <View style={styles.eventHeroImageExpandCue}>
                <IconSymbol name="resize" color={nsnColors.text} size={17} />
              </View>
              <View style={styles.eventHeroImageBadge}>
                <Text style={styles.avatarEmoji}>{event.emoji}</Text>
              </View>
            </Pressable>
          ) : (
            <View style={styles.eventAvatar}>
              <Text style={styles.avatarEmoji}>{event.emoji}</Text>
            </View>
          )}
          <Text style={[styles.title, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>
            {eventTitle}
          </Text>
          <View style={[styles.tagRow, isRtl && styles.rtlRow]}>
            <Text
              style={[styles.primaryChip, isDay && styles.dayPrimaryChip, isRtl && styles.rtlText]}
            >
              {eventCategory}
            </Text>
            <Text style={[styles.quietChip, isDay && styles.dayQuietChip, isRtl && styles.rtlText]}>
              {eventTone}
            </Text>
            {(event.atmosphereLabels ?? []).slice(0, 2).map((label) => (
              <Text
                key={label}
                style={[styles.quietChip, isDay && styles.dayQuietChip, isRtl && styles.rtlText]}
              >
                {label}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.metaStack}>
          <DetailMetaRow
            iconName="location"
            label={event.venue}
            onPress={openEventLocation}
            isDay={isDay}
            isRtl={isRtl}
          />
          <DetailMetaRow
            actionAccessibilityHint="Creates a local calendar file. This does not reserve a spot or message anyone."
            actionAccessibilityLabel={`Save ${eventTitle.replace(/\n/g, " ")} to local calendar`}
            actionIconName="calendar"
            iconName="calendar"
            label={eventDate}
            onPress={saveEventToCalendar}
            isDay={isDay}
            isRtl={isRtl}
          />
          <DetailMetaRow
            iconName="group"
            label={expectedGroupSizeCopy}
            isDay={isDay}
            isRtl={isRtl}
          />
        </View>

        {!isOnTheWayMode ? (
          <View
            style={[
              styles.quickReferenceSection,
              isDay && styles.dayCard,
              isRtl && styles.rtlBlock,
            ]}
          >
            <View style={[styles.quickReferenceHeader, isRtl && styles.rtlBlock]}>
              <Text
                style={[
                  styles.quickReferenceKicker,
                  isDay && styles.dayMutedText,
                  isRtl && styles.rtlText,
                ]}
              >
                Event snapshot
              </Text>
              <Text
                style={[
                  styles.quickReferenceTitle,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                The basics before you decide how to arrive
              </Text>
            </View>
            <View style={[styles.quickReferenceGrid, isRtl && styles.rtlRow]}>
              {eventSnapshotItems.map((item) => (
                <View
                  key={item.label}
                  style={[
                    styles.quickReferenceCard,
                    isDay && styles.dayActionRow,
                    isRtl && styles.rtlBlock,
                    {
                      borderLeftWidth: 3,
                      borderLeftColor: item.accentColor,
                    },
                  ]}
                >
                  <View style={[styles.quickReferenceCardHeader, isRtl && styles.rtlRow]}>
                    <IconSymbol
                      name={item.iconName}
                      color={isDay ? "#53677A" : "#8FAFD1"}
                      size={16}
                    />
                    <Text
                      style={[
                        styles.quickReferenceCardTitle,
                        isDay && styles.dayHeadingText,
                        isRtl && styles.rtlText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.quickReferenceCardCopy,
                      isDay && styles.dayMutedText,
                      isRtl && styles.rtlText,
                    ]}
                  >
                    {item.copy}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {renderViewModeToggle()}

        {!isOnTheWayMode ? (
          <View
            style={[
              styles.safetyPanel,
              styles.compactReadinessPanel,
              isDay && styles.dayCompactReadinessPanel,
              isDay && styles.dayCard,
              isRtl && styles.rtlBlock,
            ]}
          >
            <View style={[styles.safetyHeader, isRtl && styles.rtlRow]}>
              <Text
                style={[
                  styles.safetyTitle,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                {eventCopy.meetingSafety}
              </Text>
              <Text
                style={[
                  styles.verificationChip,
                  isDay && styles.dayVerificationChip,
                  canMeet && styles.verificationChipReady,
                  isDay && canMeet && styles.dayVerificationChipReady,
                ]}
              >
                {getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase)}
              </Text>
            </View>
            <Text
              style={[styles.safetyCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}
            >
              {getMeetingSafetyCopy(effectiveVerificationLevel, appLanguageBase)}
            </Text>
            {!canMeet ? (
              <TouchableOpacity
                activeOpacity={0.84}
                onPress={() => setIsVerificationOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={eventCopy.verifyBeforeMeeting}
                style={[styles.verifyInlineButton, isRtl && styles.rtlRow]}
              >
                <IconSymbol name="shield" color="#FFFFFF" size={16} />
                <Text style={styles.verifyInlineButtonText}>{eventCopy.verifyBeforeMeeting}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {!isOnTheWayMode ? (
          <TouchableOpacity
            activeOpacity={0.86}
            onPress={toggleSavedPlace}
            style={[
              styles.savePlaceButton,
              isDay && styles.daySavePlaceButton,
              isRtl && styles.rtlRow,
            ]}
            accessibilityRole="button"
            accessibilityHint={
              screenReaderHints
                ? isPlaceSaved
                  ? eventActionCopy.removeSavedPlaceHint
                  : eventActionCopy.savePlaceHint
                : undefined
            }
          >
            <IconSymbol
              name={isPlaceSaved ? "bookmark" : "bookmark.border"}
              color={isPlaceSaved ? nsnColors.day : iconColor}
              size={20}
            />
            <Text style={[styles.savePlaceText, isDay && styles.dayText, isRtl && styles.rtlText]}>
              {isPlaceSaved ? saveCopy.saved : saveCopy.save}
            </Text>
          </TouchableOpacity>
        ) : null}

        {!isOnTheWayMode ? (
          <Text style={[styles.description, isDay && styles.dayText, isRtl && styles.rtlText]}>
            {eventDescription}
          </Text>
        ) : null}

        {!isOnTheWayMode ? (
          <View
            style={[
              styles.humanMomentCard,
              styles.tonightVibeCard,
              isDay && styles.dayCard,
              isRtl && styles.rtlBlock,
            ]}
          >
            <View style={[styles.mediaComfortHeader, isRtl && styles.rtlRow]}>
              <View style={[styles.mediaComfortIconWrap, isDay && styles.dayMetaIconWrap]}>
                <IconSymbol name="experience" color={isDay ? "#53677A" : "#8FAFD1"} size={20} />
              </View>
              <Text
                style={[
                  styles.mediaComfortTitle,
                  isDay && styles.dayHeadingText,
                  isRtl && styles.rtlText,
                ]}
              >
                {vibeLabel}
              </Text>
            </View>
            <Text
              style={[
                styles.mediaComfortCopy,
                styles.humanMomentCopy,
                isDay && styles.dayMutedText,
                isRtl && styles.rtlText,
              ]}
            >
              {tonightVibeCopy}
            </Text>
          </View>
        ) : null}

        {!isOnTheWayMode ? (
          <View style={styles.eventAccordionStack}>
            {isSectionVisible("whatToExpect")
              ? renderAccordionSection(
                  "whatToExpect",
                  "What to expect",
                  "The social feel, first few minutes, and how optional chat can stay.",
                  "experience",
                  <>
                    <View style={styles.expectList}>
                      {[
                        {
                          iconName: "low-pressure" as const,
                          title: copy.lowPressure,
                          copy: copy.lowPressureCopy,
                        },
                        {
                          iconName: "experience" as const,
                          title: copy.sharedExperience,
                          copy: copy.sharedExperienceCopy,
                        },
                        {
                          iconName: "flexible" as const,
                          title: copy.flexible,
                          copy: copy.flexibleCopy,
                        },
                      ].map((item) => (
                        <View
                          key={item.title}
                          style={[
                            styles.expectRow,
                            isDay && styles.dayDivider,
                            isRtl && styles.rtlRow,
                          ]}
                        >
                          <View style={[styles.expectRowIconWrap, isDay && styles.dayMetaIconWrap]}>
                            <IconSymbol
                              name={item.iconName}
                              color={isDay ? "#53677A" : "#8FAFD1"}
                              size={18}
                            />
                          </View>
                          <View style={[styles.expectRowCopy, isRtl && styles.rtlBlock]}>
                            <Text
                              style={[
                                styles.expectTitle,
                                isDay && styles.dayHeadingText,
                                isRtl && styles.rtlText,
                              ]}
                            >
                              {item.title}
                            </Text>
                            <Text
                              style={[
                                styles.expectCopy,
                                isDay && styles.dayMutedText,
                                isRtl && styles.rtlText,
                              ]}
                            >
                              {item.copy}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <View
                      style={[
                        styles.reassuranceBlock,
                        styles.soloArrivalCard,
                        {
                          backgroundColor: humanMomentPalette.backgroundColor,
                          borderColor: humanMomentPalette.borderColor,
                        },
                        isRtl && styles.rtlBlock,
                      ]}
                    >
                      <View style={[styles.mediaComfortHeader, isRtl && styles.rtlRow]}>
                        <View
                          style={[styles.mediaComfortIconWrap, isDay && styles.dayMetaIconWrap]}
                        >
                          <IconSymbol
                            name="low-pressure"
                            color={isDay ? "#53677A" : "#8FAFD1"}
                            size={20}
                          />
                        </View>
                        <Text
                          style={[
                            styles.mediaComfortTitle,
                            isDay && styles.dayHeadingText,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          Imagine the first five minutes
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.mediaComfortCopy,
                          isDay && styles.dayMutedText,
                          isRtl && styles.rtlText,
                        ]}
                      >
                        {firstFiveMinutesCopy}
                      </Text>
                    </View>
                  </>,
                )
              : null}

            {isSectionVisible("optionalConversation")
              ? renderAccordionSection(
                  "optionalConversation",
                  "Optional conversation",
                  "Gentle prompts and clarity questions only if they help.",
                  "message",
                  <>
                    {event.preEventQuestions && event.preEventQuestions.length > 0 && (
                      <View
                        style={[
                          styles.questionsPanel,
                          isDay && styles.dayCard,
                          isRtl && styles.rtlBlock,
                        ]}
                      >
                        <Text
                          style={[
                            styles.sectionTitle,
                            isDay && styles.dayHeadingText,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          {copy.preEventQuestionsTitle}
                        </Text>
                        <Text
                          style={[
                            styles.questionsCopy,
                            isDay && styles.dayMutedText,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          {copy.preEventQuestionsCopy}
                        </Text>
                        <View style={styles.questionsList}>
                          {conversationStarterPrompts.map((question) => (
                            <Text
                              key={question}
                              style={[
                                styles.questionText,
                                isDay && styles.dayText,
                                isRtl && styles.rtlText,
                              ]}
                            >
                              • {question}
                            </Text>
                          ))}
                          {event.preEventQuestions.map((question, index) => (
                            <Text
                              key={index}
                              style={[
                                styles.questionText,
                                isDay && styles.dayText,
                                isRtl && styles.rtlText,
                              ]}
                            >
                              • {question}
                            </Text>
                          ))}
                        </View>
                        <View style={[styles.mediaComfortChipRow, isRtl && styles.rtlRow]}>
                          {quickReplyOptions.map((reply) => (
                            <TouchableOpacity
                              key={reply}
                              activeOpacity={0.82}
                              onPress={() => setSelectedMeetupQuestion(reply)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: selectedMeetupQuestion === reply }}
                              accessibilityLabel={reply}
                              style={[
                                styles.meetupQuestionChip,
                                isDay && styles.dayActionRow,
                                selectedMeetupQuestion === reply && styles.meetupSupportChipActive,
                                selectedMeetupQuestion === reply && selectedControlSurfaceStyle,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.meetupQuestionText,
                                  isDay && styles.dayText,
                                  selectedMeetupQuestion === reply &&
                                    styles.meetupSupportChipTextActive,
                                  selectedMeetupQuestion === reply && selectedControlTextStyle,
                                  isRtl && styles.rtlText,
                                ]}
                              >
                                {reply}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}

                    <View
                      style={[
                        styles.meetupSupportPanel,
                        isDay && styles.dayCard,
                        isRtl && styles.rtlBlock,
                      ]}
                    >
                      <View style={[styles.meetupSupportHeader, isRtl && styles.rtlRow]}>
                        <View
                          style={[styles.meetupSupportIconWrap, isDay && styles.dayMetaIconWrap]}
                        >
                          <IconSymbol
                            name="message"
                            color={isDay ? "#53677A" : "#8FAFD1"}
                            size={20}
                          />
                        </View>
                        <View style={styles.weatherCopyBlock}>
                          <Text
                            style={[
                              styles.safetyTitle,
                              isDay && styles.dayHeadingText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            Meetup clarity questions
                          </Text>
                          <Text
                            style={[
                              styles.safetyCopy,
                              isDay && styles.dayMutedText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            Demo question chips for clarity. For report, block, leave, or emergency
                            help, use existing safety flows.
                          </Text>
                        </View>
                      </View>
                      {askAboutMeetupQuestionGroups.map((group) => (
                        <View key={group.phase} style={styles.meetupQuestionGroup}>
                          <Text
                            style={[
                              styles.meetupQuestionPhase,
                              isDay && styles.dayMutedText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            {group.title}
                          </Text>
                          <View style={[styles.meetupSupportChipRow, isRtl && styles.rtlRow]}>
                            {group.questions.map((question) => {
                              const active = selectedMeetupQuestion === question;

                              return (
                                <TouchableOpacity
                                  key={question}
                                  activeOpacity={0.82}
                                  onPress={() => setSelectedMeetupQuestion(question)}
                                  accessibilityRole="button"
                                  accessibilityState={{ selected: active }}
                                  accessibilityLabel={question}
                                  style={[
                                    styles.meetupQuestionChip,
                                    isDay && styles.dayActionRow,
                                    active && styles.meetupSupportChipActive,
                                    active && selectedControlSurfaceStyle,
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.meetupQuestionText,
                                      isDay && styles.dayText,
                                      active && styles.meetupSupportChipTextActive,
                                      active && selectedControlTextStyle,
                                      isRtl && styles.rtlText,
                                    ]}
                                  >
                                    {question}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      ))}
                      {selectedMeetupQuestion ? (
                        <View style={[styles.meetupHelperResult, isDay && styles.dayActionRow]}>
                          <Text
                            style={[
                              styles.safetyTitle,
                              isDay && styles.dayHeadingText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            Demo helper selected
                          </Text>
                          <Text
                            style={[
                              styles.safetyCopy,
                              isDay && styles.dayMutedText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            {selectedMeetupQuestion}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </>,
                )
              : null}

            {isSectionVisible("arrival")
              ? renderAccordionSection(
                  "arrival",
                  "Finding the group",
                  "Where to go first, what landmark to look for, and how to join at your pace.",
                  "location",
                  renderArrivalContent(viewMode),
                )
              : null}

            {isSectionVisible("comfortPacing")
              ? renderAccordionSection(
                  "comfortPacing",
                  "Comfort & pacing",
                  "Ways to arrive, participate, pause, and be around photos.",
                  "low-pressure",
                  <>
                    {event.trustProfile?.comfortTags.length ? (
                      <View
                        style={[
                          styles.mediaComfortCard,
                          isDay && styles.dayCard,
                          isRtl && styles.rtlBlock,
                        ]}
                      >
                        <View style={[styles.mediaComfortHeader, isRtl && styles.rtlRow]}>
                          <View
                            style={[styles.mediaComfortIconWrap, isDay && styles.dayMetaIconWrap]}
                          >
                            <IconSymbol
                              name="sliders"
                              color={isDay ? "#53677A" : "#8FAFD1"}
                              size={20}
                            />
                          </View>
                          <Text
                            style={[
                              styles.mediaComfortTitle,
                              isDay && styles.dayHeadingText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            Comfort tags
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.mediaComfortCopy,
                            isDay && styles.dayMutedText,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          Tags describe the meetup setting. They are not labels for people, and they
                          can help you choose a calmer fit.
                        </Text>
                        <View style={[styles.mediaComfortChipRow, isRtl && styles.rtlRow]}>
                          {event.trustProfile.comfortTags.map((tag) => (
                            <Text
                              key={tag}
                              style={[
                                styles.mediaComfortChip,
                                isDay && styles.dayMediaComfortChip,
                                isRtl && styles.rtlText,
                              ]}
                            >
                              {tag.replace(/-/g, " ")}
                            </Text>
                          ))}
                        </View>
                      </View>
                    ) : null}

                    {event.comfortLabels?.length ? (
                      <View
                        style={[
                          styles.mediaComfortCard,
                          isDay && styles.dayCard,
                          isRtl && styles.rtlBlock,
                        ]}
                      >
                        <View style={[styles.mediaComfortHeader, isRtl && styles.rtlRow]}>
                          <View
                            style={[styles.mediaComfortIconWrap, isDay && styles.dayMetaIconWrap]}
                          >
                            <IconSymbol
                              name="info"
                              color={isDay ? "#53677A" : "#8FAFD1"}
                              size={20}
                            />
                          </View>
                          <Text
                            style={[
                              styles.mediaComfortTitle,
                              isDay && styles.dayHeadingText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            Meetup comfort & participation
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.mediaComfortCopy,
                            isDay && styles.dayMutedText,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          Optional environment cues for joining at your own pace. Energetic and
                          calmer styles can both belong here, and stepping away or rejoining is
                          okay.
                        </Text>
                        <View style={[styles.mediaComfortChipRow, isRtl && styles.rtlRow]}>
                          {event.comfortLabels.map((label) => (
                            <Text
                              key={label}
                              style={[
                                styles.mediaComfortChip,
                                isDay && styles.dayMediaComfortChip,
                                isRtl && styles.rtlText,
                              ]}
                            >
                              {label}
                            </Text>
                          ))}
                        </View>
                      </View>
                    ) : null}

                    <View
                      style={[
                        styles.mediaComfortCard,
                        isDay && styles.dayCard,
                        isRtl && styles.rtlBlock,
                      ]}
                    >
                      <View style={[styles.mediaComfortHeader, isRtl && styles.rtlRow]}>
                        <View
                          style={[styles.mediaComfortIconWrap, isDay && styles.dayMetaIconWrap]}
                        >
                          <IconSymbol
                            name="visibility"
                            color={isDay ? "#53677A" : "#8FAFD1"}
                            size={20}
                          />
                        </View>
                        <Text
                          style={[
                            styles.mediaComfortTitle,
                            isDay && styles.dayHeadingText,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          {eventCommunityGuidelinesCopy.mediaTitle}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.mediaComfortCopy,
                          isDay && styles.dayMutedText,
                          isRtl && styles.rtlText,
                        ]}
                      >
                        {eventCommunityGuidelinesCopy.mediaCopy}
                      </Text>
                      <View style={[styles.mediaComfortChipRow, isRtl && styles.rtlRow]}>
                        {mediaComfortLabels.map((label) => (
                          <Text
                            key={label}
                            style={[
                              styles.mediaComfortChip,
                              isDay && styles.dayMediaComfortChip,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            {label}
                          </Text>
                        ))}
                      </View>
                      <Text
                        style={[
                          styles.mediaComfortNote,
                          isDay && styles.dayMutedText,
                          isRtl && styles.rtlText,
                        ]}
                      >
                        {eventCommunityGuidelinesCopy.mediaNote}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.meetupSupportPanel,
                        isDay && styles.dayCard,
                        isRtl && styles.rtlBlock,
                      ]}
                    >
                      <View style={[styles.meetupSupportHeader, isRtl && styles.rtlRow]}>
                        <View
                          style={[styles.meetupSupportIconWrap, isDay && styles.dayMetaIconWrap]}
                        >
                          <IconSymbol
                            name="guide"
                            color={isDay ? "#53677A" : "#8FAFD1"}
                            size={20}
                          />
                        </View>
                        <View style={styles.weatherCopyBlock}>
                          <Text
                            style={[
                              styles.safetyTitle,
                              isDay && styles.dayHeadingText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            {eventCommunityGuidelinesCopy.firstMeetupSupportTitle}
                          </Text>
                          <Text
                            style={[
                              styles.safetyCopy,
                              isDay && styles.dayMutedText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            {eventCommunityGuidelinesCopy.firstMeetupSupportCopy}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.meetupSupportChipRow, isRtl && styles.rtlRow]}>
                        {firstMeetupSupportOptions.map((option) => {
                          const active = selectedFirstMeetupSupport.includes(option.label);

                          return (
                            <TouchableOpacity
                              key={option.label}
                              activeOpacity={0.82}
                              onPress={() => toggleFirstMeetupSupportOption(option.label)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                              accessibilityLabel={option.label}
                              accessibilityHint={option.description}
                              style={[
                                styles.meetupSupportChip,
                                isDay && styles.dayActionRow,
                                active && styles.meetupSupportChipActive,
                                active && selectedControlSurfaceStyle,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.meetupSupportChipText,
                                  isDay && styles.dayText,
                                  active && styles.meetupSupportChipTextActive,
                                  active && selectedControlTextStyle,
                                  isRtl && styles.rtlText,
                                ]}
                              >
                                {option.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      <Text
                        style={[
                          styles.meetupSupportSummary,
                          isDay && styles.dayMutedText,
                          isRtl && styles.rtlText,
                        ]}
                      >
                        Current: {getFirstMeetupSupportSummary(selectedFirstMeetupSupport)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.meetupSupportPanel,
                        isDay && styles.dayCard,
                        isRtl && styles.rtlBlock,
                      ]}
                    >
                      <View style={[styles.meetupSupportHeader, isRtl && styles.rtlRow]}>
                        <View
                          style={[styles.meetupSupportIconWrap, isDay && styles.dayMetaIconWrap]}
                        >
                          <IconSymbol
                            name="group"
                            color={isDay ? "#53677A" : "#8FAFD1"}
                            size={20}
                          />
                        </View>
                        <View style={styles.weatherCopyBlock}>
                          <Text
                            style={[
                              styles.safetyTitle,
                              isDay && styles.dayHeadingText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            {eventCommunityGuidelinesCopy.comfortRolesTitle}
                          </Text>
                          <Text
                            style={[
                              styles.safetyCopy,
                              isDay && styles.dayMutedText,
                              isRtl && styles.rtlText,
                            ]}
                          >
                            {eventCommunityGuidelinesCopy.comfortRolesCopy}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.meetupSupportChipRow, isRtl && styles.rtlRow]}>
                        {meetupComfortRoleOptions.map((option) => {
                          const active = selectedComfortRoles.includes(option.label);

                          return (
                            <TouchableOpacity
                              key={option.label}
                              activeOpacity={0.82}
                              onPress={() => toggleComfortRole(option.label)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                              accessibilityLabel={option.label}
                              accessibilityHint={option.description}
                              style={[
                                styles.meetupSupportChip,
                                isDay && styles.dayActionRow,
                                active && styles.meetupSupportChipActive,
                                active && selectedControlSurfaceStyle,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.meetupSupportChipText,
                                  isDay && styles.dayText,
                                  active && styles.meetupSupportChipTextActive,
                                  active && selectedControlTextStyle,
                                  isRtl && styles.rtlText,
                                ]}
                              >
                                {option.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      <Text
                        style={[
                          styles.meetupSupportSummary,
                          isDay && styles.dayMutedText,
                          isRtl && styles.rtlText,
                        ]}
                      >
                        Current:{" "}
                        {selectedComfortRoles.length
                          ? selectedComfortRoles.join(", ")
                          : "None selected"}
                      </Text>
                    </View>
                  </>,
                )
              : null}

            {isSectionVisible("safetyBoundaries")
              ? renderAccordionSection(
                  "safetyBoundaries",
                  eventCommunityGuidelinesCopy.sectionTitle,
                  eventCommunityGuidelinesCopy.sectionSummary,
                  "shield",
                  <View
                    style={[
                      styles.guidanceList,
                      isDay && styles.dayArrivalList,
                      isRtl && styles.rtlBlock,
                    ]}
                  >
                    {[
                      { title: copy.softExitTitle, copy: copy.softExitCopy },
                      {
                        title: eventCommunityGuidelinesCopy.mismatchTitle,
                        copy: eventCommunityGuidelinesCopy.mismatchCopy,
                      },
                      {
                        title: eventCommunityGuidelinesCopy.reportsTitle,
                        copy: eventCommunityGuidelinesCopy.reportsCopy,
                      },
                    ].map((item, index, items) => (
                      <View
                        key={item.title}
                        style={[
                          styles.guidanceRow,
                          index < items.length - 1 && styles.arrivalListRowBorder,
                          isDay && index < items.length - 1 && styles.dayDivider,
                        ]}
                      >
                        <Text
                          style={[
                            styles.guidanceTitle,
                            isDay && styles.dayHeadingText,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={[
                            styles.guidanceCopy,
                            isDay && styles.dayMutedText,
                            isRtl && styles.rtlText,
                          ]}
                        >
                          {item.copy}
                        </Text>
                      </View>
                    ))}
                  </View>,
                )
              : null}
          </View>
        ) : (
          <View style={styles.eventAccordionStack}>{renderOnTheWayPanel()}</View>
        )}

        <View style={styles.eventAccordionStack}>
          {supportBlockOrder.map((blockId) =>
            blockId === "planningTools" ? (
              <View key={blockId}>{renderPlanningToolsPanel()}</View>
            ) : (
              <View key={blockId}>{renderRsvpPanel()}</View>
            ),
          )}
        </View>

        <Text
          style={[styles.ctaReassurance, isDay && styles.dayMutedText, isRtl && styles.rtlText]}
        >
          {eventCopy.ctaReassurance}
        </Text>

        {canMeet || canOpenMeetupChat ? (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleJoin}
            style={styles.joinButton}
            accessibilityRole="button"
            accessibilityHint={
              screenReaderHints
                ? canOpenMeetupChat
                  ? eventCopy.openMeetupChatHint
                  : eventCopy.joinHint
                : undefined
            }
          >
            <Text style={styles.joinText}>
              {canOpenMeetupChat ? eventCopy.openMeetupChat : copy.join}
            </Text>
          </TouchableOpacity>
        ) : null}
        <Text style={[styles.spotsText, isDay && styles.dayMutedText]}>
          RSVP and support-person notes stay local to this prototype. They do not reserve a spot or
          message anyone.
        </Text>

        {canOpenMeetupChat ? (
          <View style={[styles.feedbackPanel, isDay && styles.dayCard]}>
            <Text style={[styles.safetyTitle, isDay && styles.dayHeadingText]}>
              {eventCopy.postEventCheckIn}
            </Text>
            <Text style={[styles.safetyCopy, isDay && styles.dayMutedText]}>
              {existingFeedback ? eventCopy.feedbackSaved : eventCopy.feedbackPrompt}
            </Text>
            {event.postEventQuestions &&
              event.postEventQuestions.length > 0 &&
              !existingFeedback && (
                <View style={styles.postQuestionsList}>
                  {event.postEventQuestions.map((question, index) => (
                    <Text key={index} style={[styles.postQuestionText, isDay && styles.dayText]}>
                      • {question}
                    </Text>
                  ))}
                </View>
              )}
            <View style={styles.feedbackActions}>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => saveFeedback("Good", true)}
                style={styles.feedbackButton}
              >
                <Text style={styles.feedbackButtonText}>{eventCopy.feedbackGood}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => saveFeedback("Mixed", false)}
                style={styles.feedbackButton}
              >
                <Text style={styles.feedbackButtonText}>{eventCopy.feedbackMixed}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => saveFeedback("Unsafe", false)}
                style={[styles.feedbackButton, styles.feedbackButtonDanger]}
              >
                <Text style={styles.feedbackButtonText}>{eventCopy.feedbackUnsafe}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
      {copyFeedback ? (
        <View
          pointerEvents="none"
          style={[styles.copyFeedbackToast, isDay && styles.dayActionSheet]}
        >
          <IconSymbol name="checkmark" color={isDay ? "#0F6B2F" : nsnColors.green} size={18} />
          <Text style={[styles.copyFeedbackText, isDay && styles.dayText]}>{copyFeedback}</Text>
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayScreen: { backgroundColor: "#FFFFFF" },
  dayCard: { backgroundColor: "#FFFFFF", borderColor: "#D7E0EA" },
  dayHeadingText: { color: "#0B1220" },
  dayIconButton: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  dayMeetingPanel: { borderColor: "#C5D0DA" },
  dayMetaIconWrap: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  dayMutedText: { color: "#53677A" },
  dayPanel: { backgroundColor: "#FFFFFF", borderColor: "#D7E0EA" },
  dayQuietChip: { color: "#53677A", backgroundColor: "#F7FAFC" },
  dayText: { color: "#0B1220" },
  dayActionSheet: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  dayActionRow: { backgroundColor: "#FFFFFF", borderColor: "#D7E0EA" },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 128 },
  notFoundCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    padding: 18,
    marginTop: 44,
  },
  notFoundEyebrow: {
    color: nsnColors.muted,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  notFoundTitle: {
    color: nsnColors.text,
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30,
    marginTop: 8,
  },
  notFoundCopy: {
    color: nsnColors.muted,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    marginTop: 8,
  },
  notFoundActions: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 },
  notFoundPrimaryButton: {
    ...nsnActionButtonStyles.primary,
    flexGrow: 1,
    flexBasis: 150,
  },
  notFoundPrimaryText: {
    ...nsnActionTextStyles.primary,
    fontSize: 14,
    lineHeight: 20,
  },
  notFoundSecondaryButton: {
    ...nsnActionButtonStyles.secondary,
    flexGrow: 1,
    flexBasis: 120,
  },
  notFoundSecondaryText: {
    ...nsnActionTextStyles.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  topActions: { flexDirection: "row", gap: 8 },
  rtlRow: { flexDirection: "row-reverse" },
  rtlBlock: { alignItems: "flex-end" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: nsnColors.border,
  },
  savedIconButton: {
    borderColor: "rgba(247,200,91,0.68)",
    backgroundColor: "rgba(247,200,91,0.12)",
  },
  activeMoreButton: {
    borderColor: "rgba(47,128,237,0.52)",
    backgroundColor: "rgba(47,128,237,0.12)",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(2,8,20,0.42)",
    padding: 16,
  },
  actionSheet: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0F1B2C",
    padding: 16,
  },
  verificationSheet: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0F1B2C",
    padding: 16,
  },
  actionSheetTitle: { color: nsnColors.text, fontSize: 18, fontWeight: "900", lineHeight: 24 },
  actionSheetCopy: {
    color: nsnColors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
    marginBottom: 12,
  },
  actionList: { gap: 8 },
  actionRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionText: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  closeActionButton: {
    ...nsnActionButtonStyles.primary,
    minHeight: 46,
    marginTop: 12,
  },
  closeActionText: { ...nsnActionTextStyles.primary, fontSize: 14, lineHeight: 20 },
  heroImageModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(2,8,20,0.96)",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
  },
  heroImageModalTopBar: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  heroImageModalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(199,176,122,0.68)",
  },
  heroImageModalTitle: {
    flex: 1,
    color: nsnColors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 23,
  },
  heroImageModalImageFrame: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#050B14",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  heroImageModalImage: { width: "100%", height: "100%" },
  heroImageInnerOutline: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderRadius: 24,
  },
  heroImageModalReturnButton: {
    ...nsnActionButtonStyles.primary,
    minHeight: 48,
    marginTop: 14,
  },
  heroImageModalReturnText: {
    ...nsnActionTextStyles.primary,
    fontSize: 14,
    lineHeight: 20,
  },
  verificationList: { gap: 8 },
  verificationRow: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  verificationLabel: {
    color: nsnColors.muted,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
    marginBottom: 2,
  },
  verificationValue: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  verificationActions: { marginTop: 12, gap: 9 },
  confirmVerificationButton: {
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: nsnColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmVerificationText: {
    color: nsnColors.text,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20,
  },
  secondaryVerificationButton: {
    minHeight: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryVerificationText: {
    color: nsnColors.text,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
  },
  heroPanel: {
    alignItems: "center",
    borderRadius: 28,
    paddingTop: 8,
    paddingBottom: 22,
    backgroundColor: "#061121",
    borderWidth: 1,
    borderColor: "rgba(56,72,255,0.22)",
    marginBottom: 18,
  },
  eventAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#21123E",
    borderWidth: 2,
    borderColor: nsnColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2,
    marginBottom: 18,
  },
  eventHeroImageFrame: {
    width: "100%",
    height: 330,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#07111F",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  dayEventHeroImageFrame: { backgroundColor: "#F7FAFC", borderColor: "#D7E0EA" },
  eventHeroImageFrameHovered: {
    borderColor: "rgba(247,200,91,0.9)",
    shadowColor: "#F7C85B",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  eventHeroImage: { width: "100%", height: "100%" },
  eventHeroImageExpandCue: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(2,8,20,0.64)",
    borderWidth: 1,
    borderColor: "rgba(247,200,91,0.68)",
  },
  eventHeroImageBadge: {
    position: "absolute",
    left: 14,
    bottom: 14,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(33,18,62,0.92)",
    borderWidth: 2,
    borderColor: nsnColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 43 },
  title: {
    color: nsnColors.text,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0,
    lineHeight: 34,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  primaryChip: {
    ...nsnActionButtonStyles.selectedPill,
    maxWidth: "100%",
    ...nsnActionTextStyles.selectedPill,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 14,
    overflow: "hidden",
  },
  dayPrimaryChip: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  quietChip: {
    maxWidth: "100%",
    color: nsnColors.muted,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 14,
    overflow: "hidden",
  },
  metaStack: { gap: 8, marginBottom: 12 },
  walkingIntoCard: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 14,
    gap: 12,
    marginBottom: 14,
  },
  walkingIntoHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  walkingIntoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  walkingIntoSignal: {
    flexGrow: 1,
    flexBasis: 132,
    minHeight: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 11,
    paddingVertical: 9,
    gap: 2,
  },
  dayWalkingIntoSignal: { backgroundColor: "#F7FAFC", borderColor: "#C5D0DA" },
  walkingIntoLabel: {
    color: nsnColors.muted,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    textTransform: "uppercase",
  },
  walkingIntoValue: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  savePlaceButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  daySavePlaceButton: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  savePlaceText: {
    flexShrink: 1,
    minWidth: 0,
    color: nsnColors.text,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    textAlign: "center",
  },
  metaRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  metaRowAction: { minHeight: 38, borderRadius: 14, paddingRight: 8 },
  metaIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
  metaLine: { flex: 1, color: nsnColors.text, fontSize: 14, lineHeight: 20 },
  metaRowActionHovered: { backgroundColor: "rgba(199,176,122,0.055)" },
  metaActionIconWrap: {
    width: 31,
    height: 31,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  dayMetaActionIconWrap: { borderColor: "transparent" },
  description: { color: nsnColors.text, fontSize: 15, lineHeight: 23, marginBottom: 14 },
  quickReferenceSection: { marginBottom: 18 },
  quickReferenceHeader: { marginBottom: 9 },
  quickReferenceKicker: {
    color: nsnColors.muted,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    textTransform: "uppercase",
  },
  quickReferenceTitle: {
    color: nsnColors.text,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
    marginTop: 1,
  },
  quickReferenceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickReferenceCard: {
    flexGrow: 1,
    flexBasis: 190,
    minHeight: 82,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 4,
    overflow: "hidden",
  },
  quickReferenceCardHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  quickReferenceCardTitle: {
    color: nsnColors.text,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
  },
  quickReferenceCardCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  humanMomentCard: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(124,170,201,0.34)",
    backgroundColor: "rgba(124,170,201,0.08)",
    padding: 14,
    gap: 8,
    marginBottom: 16,
  },
  tonightVibeCard: { marginTop: -2 },
  humanMomentCopy: { fontSize: 13, lineHeight: 20 },
  viewModePanel: { marginBottom: 16, gap: 8 },
  viewModeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  viewModeChip: {
    minHeight: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  viewModeChipActive: {
    borderColor: "#6FA8FF",
    backgroundColor: "rgba(47,128,237,0.2)",
  },
  viewModeChipText: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 16 },
  viewModeChipTextActive: { color: "#EAF3FF" },
  viewModeHelper: { color: nsnColors.muted, fontSize: 12, lineHeight: 18 },
  eventAccordionStack: { gap: 13, marginBottom: 18 },
  onTheWayPanel: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(99,179,255,0.28)",
    backgroundColor: "rgba(12,26,43,0.96)",
    padding: 14,
    gap: 11,
  },
  onTheWayMetaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  onTheWayMetaCard: {
    flexGrow: 1,
    flexBasis: 160,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 11,
    paddingVertical: 10,
    gap: 4,
  },
  eventAccordion: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    overflow: "hidden",
  },
  eventAccordionHeader: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  eventAccordionTitleRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  eventAccordionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: nsnColors.border,
  },
  eventAccordionTitleBlock: { flex: 1, minWidth: 0 },
  eventAccordionTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  eventAccordionSummary: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  eventAccordionBody: { paddingHorizontal: 13, paddingBottom: 15 },
  weatherCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: nsnColors.surfaceRaised,
    borderWidth: 1,
    borderColor: "#284476",
    marginBottom: 19,
  },
  weatherCopyBlock: { flex: 1, minWidth: 0 },
  weatherTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  weatherCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, maxWidth: 320 },
  weatherFallbackCopy: { marginTop: 4, maxWidth: 320, fontWeight: "800" },
  weatherIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: nsnColors.border,
  },
  weatherIcon: { fontSize: 28 },
  noiseGuideCard: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 13,
    marginBottom: 16,
  },
  noiseIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: nsnColors.border,
  },
  noiseIcon: { fontSize: 21, lineHeight: 24 },
  noiseCopyBlock: { flex: 1, minWidth: 0 },
  noiseTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  noiseDescription: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 2 },
  mediaComfortCard: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 14,
    gap: 9,
    marginBottom: 16,
  },
  mediaComfortHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  mediaComfortIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: nsnColors.border,
  },
  mediaComfortTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  mediaComfortCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18 },
  mediaComfortChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  mediaComfortChip: {
    maxWidth: "100%",
    color: "#D2E0FF",
    borderColor: "rgba(124,170,201,0.45)",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
    overflow: "hidden",
    backgroundColor: "rgba(124,170,201,0.1)",
  },
  dayMediaComfortChip: { color: "#445E93", borderColor: "#9AADE8", backgroundColor: "#EDF2FF" },
  mediaComfortNote: { color: nsnColors.muted, fontSize: 11, lineHeight: 16, fontWeight: "700" },
  soloArrivalCard: { borderColor: "rgba(168, 183, 218, 0.38)", backgroundColor: "#101F34" },
  findingGroupCard: {
    borderColor: "rgba(124,170,201,0.34)",
    backgroundColor: "rgba(124,170,201,0.08)",
  },
  sectionTitle: {
    color: nsnColors.text,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 23,
    marginBottom: 10,
  },
  expectGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  expectList: { gap: 0, marginBottom: 12 },
  expectRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.14)",
  },
  expectRowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    flexShrink: 0,
  },
  expectRowCopy: { flex: 1, minWidth: 0, gap: 2 },
  expectCard: {
    width: "48%",
    minHeight: 82,
    borderRadius: 16,
    padding: 13,
    backgroundColor: nsnColors.surface,
    borderWidth: 1,
    borderColor: nsnColors.border,
  },
  expectIcon: { color: "#8FAFD1", fontSize: 18, marginBottom: 4 },
  expectTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "800", lineHeight: 18 },
  expectCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 16, marginTop: 1 },
  meetingPanel: {
    borderTopWidth: 1,
    borderColor: nsnColors.border,
    paddingTop: 14,
    marginTop: 2,
    marginBottom: 18,
  },
  meetingPanelCompact: {
    borderTopWidth: 0,
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  arrivalLeadCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(99,179,255,0.34)",
    backgroundColor: "rgba(99,179,255,0.08)",
    padding: 13,
    gap: 5,
    marginTop: 12,
  },
  arrivalLeadCardCompact: { marginTop: 0 },
  dayArrivalLeadCard: { borderColor: "#AFC4DD", backgroundColor: "#F3F7FF" },
  arrivalLeadTitle: { color: nsnColors.text, fontSize: 16, fontWeight: "900", lineHeight: 22 },
  arrivalLeadCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18 },
  meetingCopy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
  meetingPrivacyCopy: { marginTop: 8, fontSize: 12, lineHeight: 18 },
  arrivalPreviewSummaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(124,170,201,0.34)",
    backgroundColor: "rgba(124,170,201,0.08)",
    padding: 13,
    gap: 5,
    marginTop: 12,
  },
  arrivalPreviewSummaryCardCompact: { marginTop: 0 },
  dayArrivalPreviewSummaryCard: { borderColor: "#AFC4DD", backgroundColor: "#F3F7FF" },
  arrivalPreviewKickerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  arrivalPreviewKicker: {
    color: "#B7CFFF",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    textTransform: "uppercase",
  },
  arrivalPreviewArea: { color: nsnColors.text, fontSize: 16, fontWeight: "900", lineHeight: 22 },
  arrivalPreviewSummary: { color: nsnColors.muted, fontSize: 12, lineHeight: 18 },
  arrivalPreviewDetailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginTop: 10 },
  arrivalPreviewDetailCard: {
    flexGrow: 1,
    flexBasis: 190,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.035)",
    paddingHorizontal: 11,
    paddingVertical: 10,
    gap: 5,
  },
  dayArrivalPreviewDetailCard: { borderColor: "#D2DCE8", backgroundColor: "#FFFFFF" },
  arrivalPreviewDetailLabel: {
    color: nsnColors.muted,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    textTransform: "uppercase",
  },
  arrivalPreviewDetailValue: {
    color: nsnColors.text,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
  },
  arrivalList: {
    marginTop: 11,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    backgroundColor: "rgba(255,255,255,0.025)",
    overflow: "hidden",
  },
  compactMetaList: { marginTop: 4 },
  dayArrivalList: { borderColor: "#D2DCE8", backgroundColor: "#FFFFFF" },
  arrivalListRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  arrivalListRowBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(148,163,184,0.14)" },
  arrivalListLabel: {
    width: 92,
    color: nsnColors.muted,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    textTransform: "uppercase",
    flexShrink: 0,
  },
  arrivalListValue: {
    flex: 1,
    color: nsnColors.text,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
  },
  mapActionButton: {
    minHeight: 42,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(99,179,255,0.34)",
    backgroundColor: "rgba(99,179,255,0.1)",
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginTop: 12,
  },
  dayMapActionButton: { borderColor: "#AFC4DD", backgroundColor: "#F3F7FF" },
  mapActionButtonText: { color: "#EAF3FF", fontSize: 12, fontWeight: "900", lineHeight: 16 },
  arrivalConfidenceBlock: { gap: 8, marginTop: 13 },
  arrivalNoticeBlock: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 12,
    gap: 8,
    marginTop: 12,
  },
  dayArrivalNoticeBlock: { borderColor: "#D2DCE8", backgroundColor: "#FFFFFF" },
  arrivalNoticeTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  arrivalNoticeList: { gap: 8 },
  arrivalNoticeRow: { gap: 3 },
  arrivalNoticeLabel: {
    color: nsnColors.muted,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    textTransform: "uppercase",
  },
  arrivalNoticeCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  arrivalFamiliarityBlock: { gap: 8, marginTop: 14 },
  arrivalFamiliarityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  arrivalFamiliarityCard: {
    flexGrow: 1,
    flexBasis: 156,
    minHeight: 168,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.035)",
    overflow: "hidden",
  },
  dayArrivalFamiliarityCard: { borderColor: "#D2DCE8", backgroundColor: "#FFFFFF" },
  arrivalFamiliarityImage: { width: "100%", height: 92, resizeMode: "cover" },
  arrivalFamiliarityPlaceholder: {
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(124,170,201,0.08)",
    borderBottomWidth: 1,
    borderBottomColor: nsnColors.border,
  },
  dayArrivalFamiliarityPlaceholder: {
    backgroundColor: "#F4F7FB",
    borderBottomColor: "#D2DCE8",
  },
  arrivalFamiliarityPlaceholderText: {
    color: nsnColors.muted,
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 13,
  },
  arrivalFamiliarityText: { paddingHorizontal: 10, paddingVertical: 9, gap: 2 },
  arrivalFamiliarityTitle: {
    color: nsnColors.text,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17,
  },
  arrivalFamiliarityCaption: { color: nsnColors.muted, fontSize: 11, lineHeight: 16 },
  meetupSupportPanel: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 14,
    gap: 10,
    marginBottom: 14,
  },
  guidancePanelTight: { marginBottom: 2 },
  meetupSupportHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  meetupSupportIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: nsnColors.border,
  },
  meetupSupportChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  meetupReassuranceCard: {
    flexGrow: 1,
    flexBasis: 138,
    minHeight: 70,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 3,
  },
  meetupSupportChip: {
    minHeight: 36,
    maxWidth: "100%",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  meetupSupportChipActive: { ...nsnActionButtonStyles.selectedPill },
  meetupSupportChipText: {
    flexShrink: 1,
    color: nsnColors.text,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
  },
  meetupSupportChipTextActive: { color: nsnColors.selectedChipText },
  meetupSupportSummary: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  meetupQuestionGroup: { gap: 6 },
  meetupQuestionPhase: {
    color: nsnColors.muted,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
    textTransform: "uppercase",
  },
  meetupQuestionChip: {
    minHeight: 34,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  meetupQuestionText: {
    flexShrink: 1,
    color: nsnColors.text,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
  },
  meetupHelperResult: {
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(114,214,126,0.3)",
    backgroundColor: "rgba(114,214,126,0.1)",
    padding: 10,
  },
  practicalGuidanceList: { gap: 8 },
  practicalGuidanceRow: {
    borderRadius: 13,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 3,
  },
  softExitCard: {
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: nsnColors.border,
    padding: 15,
    marginBottom: 18,
  },
  daySoftExitCard: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  softExitTitle: {
    color: nsnColors.text,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    marginBottom: 4,
  },
  softExitCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
  ctaReassurance: {
    color: nsnColors.muted,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 9,
  },
  safetyPanel: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 14,
    marginBottom: 14,
  },
  compactReadinessPanel: { marginTop: 2, marginBottom: 10 },
  dayCompactReadinessPanel: { borderColor: "#D4A91E", backgroundColor: "#FFF8E2" },
  safetyHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  safetyTitle: {
    flexShrink: 1,
    minWidth: 0,
    color: nsnColors.text,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20,
  },
  safetyCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
  verificationChip: {
    flexShrink: 1,
    maxWidth: "100%",
    color: nsnColors.warning,
    borderColor: "rgba(247,200,91,0.45)",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
  },
  verificationChipReady: { color: nsnColors.green, borderColor: "rgba(114,214,126,0.45)" },
  dayVerificationChip: { color: "#7C5A00", backgroundColor: "#FFF7D8", borderColor: "#D4A91E" },
  dayVerificationChipReady: {
    color: "#0F6B2F",
    backgroundColor: "#E8F8EE",
    borderColor: "#55A96E",
  },
  rsvpPanel: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 14,
    marginBottom: 14,
  },
  compactRsvpPanel: { gap: 10 },
  rsvpStatusChip: {
    flexShrink: 1,
    maxWidth: "100%",
    color: nsnColors.day,
    borderColor: "rgba(124,170,201,0.45)",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
  },
  rsvpDescription: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 7 },
  rsvpActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  attendTogetherBlock: {
    borderTopWidth: 1,
    borderTopColor: nsnColors.border,
    marginTop: 14,
    paddingTop: 14,
    gap: 2,
  },
  attendTogetherReassurance: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(95,200,174,0.3)",
    backgroundColor: "rgba(95,200,174,0.08)",
    marginTop: 14,
    padding: 13,
    gap: 2,
  },
  rsvpChoice: {
    minHeight: 40,
    maxWidth: "100%",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 118,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  rsvpChoiceActive: { ...nsnActionButtonStyles.selectedPill },
  rsvpChoiceText: {
    flexShrink: 1,
    minWidth: 0,
    color: nsnColors.text,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 16,
    textAlign: "center",
  },
  rsvpChoiceTextActive: { color: nsnColors.selectedChipText },
  planningToolbox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 13,
    gap: 12,
  },
  planningToolChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  planningToolResult: { gap: 5, marginTop: 2 },
  planningToolResultTitle: {
    color: nsnColors.text,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
  },
  planningToolResultCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18 },
  planningToolOptOutPanel: {
    marginBottom: 0,
    borderColor: "rgba(148,163,184,0.16)",
    backgroundColor: "rgba(255,255,255,0.025)",
    padding: 12,
  },
  planningToolFootnote: {
    color: nsnColors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
  },
  readinessPanel: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 14,
    marginBottom: 14,
    gap: 12,
  },
  readinessHeaderCopy: { flex: 1, minWidth: 0 },
  readinessList: { gap: 8 },
  readinessRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  readinessIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: nsnColors.border,
    flexShrink: 0,
  },
  readinessCopyBlock: { flex: 1, minWidth: 0 },
  readinessTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  readinessCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  optOutPanel: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 14,
    marginBottom: 14,
    gap: 12,
  },
  optOutActions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optOutChoice: {
    minHeight: 40,
    maxWidth: "100%",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 142,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  optOutChoiceText: {
    flexShrink: 1,
    minWidth: 0,
    color: nsnColors.text,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 16,
    textAlign: "center",
  },
  optOutResult: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(114,214,126,0.3)",
    backgroundColor: "rgba(114,214,126,0.1)",
    padding: 10,
  },
  tutorialPanel: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 14,
    marginBottom: 14,
    gap: 9,
  },
  tutorialCardList: { gap: 8 },
  tutorialCard: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  dismissTutorialButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  joinButton: {
    minHeight: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nsnColors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1BB6C8",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  joinText: {
    flexShrink: 1,
    minWidth: 0,
    color: nsnColors.text,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 21,
    textAlign: "center",
  },
  spotsText: {
    color: nsnColors.muted,
    textAlign: "center",
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
  },
  feedbackPanel: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 14,
    marginTop: 14,
  },
  feedbackActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  feedbackButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nsnColors.surfaceRaised,
    borderWidth: 1,
    borderColor: nsnColors.border,
  },
  feedbackButtonDanger: { borderColor: "rgba(255,119,119,0.45)" },
  feedbackButtonText: { color: nsnColors.text, fontSize: 12, fontWeight: "900" },
  copyFeedbackToast: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0F1B2C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
  },
  copyFeedbackText: {
    color: nsnColors.text,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
    textAlign: "center",
  },
  questionsPanel: {
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "#0D1A2C",
    padding: 14,
    marginBottom: 14,
  },
  questionsCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19, marginBottom: 10 },
  questionsList: { gap: 6 },
  questionText: { color: nsnColors.text, fontSize: 14, lineHeight: 20 },
  postQuestionsList: { gap: 6, marginTop: 10, marginBottom: 10 },
  postQuestionText: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
  guidanceList: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.16)",
    backgroundColor: "rgba(255,255,255,0.025)",
    overflow: "hidden",
  },
  guidanceRow: { paddingHorizontal: 12, paddingVertical: 12, gap: 4 },
  guidanceTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  guidanceCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
  reassuranceBlock: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    gap: 8,
    marginTop: 12,
  },
  supportAccentBlock: {
    borderColor: "rgba(95,200,174,0.3)",
    backgroundColor: "rgba(95,200,174,0.08)",
  },
  daySupportAccentBlock: { borderColor: "#93D5C4", backgroundColor: "#ECFBF7" },
  dayDivider: { borderBottomColor: "#D2DCE8" },
  verifyInlineButton: {
    alignSelf: "flex-start",
    minHeight: 38,
    borderRadius: 14,
    backgroundColor: nsnColors.day,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 13,
    marginTop: 12,
  },
  verifyInlineButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900", lineHeight: 17 },
});
