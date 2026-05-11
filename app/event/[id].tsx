import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Modal, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLanguageBase, type PhotoRecordingComfortPreference, useAppSettings } from "@/lib/app-settings";
import { allEvents, movieNight, nsnColors, type EventItem } from "@/lib/nsn-data";
import {
  canMeetInPerson,
  deriveVerificationLevel,
  getEventMembership,
  getMeetingSafetyCopy,
  getVerificationLevelLabel,
  hideEvent,
  joinEvent,
  removeSavedPlace,
  savePlace,
  savePostEventFeedback,
  pinEvent,
  type PostEventFeedback,
  unhideEvent,
  unpinEvent,
} from "@/lib/softhello-mvp";

const CREATED_EVENTS_KEY = "nsn.created-events.v1";

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

const getDetailMediaComfortLabels = (event: EventItem, photoRecordingComfortPreferences: PhotoRecordingComfortPreference[]) => {
  const labels = [...(event.mediaComfortLabels ?? ["Ask before photos"])];

  if (photoRecordingComfortPreferences.includes("Ask me first")) labels.push("Ask before photos");
  if (photoRecordingComfortPreferences.includes("No photos of me")) labels.push("No photos of me");
  if (photoRecordingComfortPreferences.includes("Group photos are okay")) labels.push("Group photos only if everyone agrees");
  if (photoRecordingComfortPreferences.includes("Venue/event photos are okay")) labels.push("Venue photos okay");
  if (photoRecordingComfortPreferences.includes("No videos please")) labels.push("No filming");
  if (photoRecordingComfortPreferences.includes("No public posting without permission")) labels.push("No public posting");
  if (photoRecordingComfortPreferences.includes("Prefer no screenshots of chats/profile")) labels.push("Prefer no screenshots");

  return labels.filter((label, index, all) => all.indexOf(label) === index).slice(0, 5);
};

const savePlaceTranslations = {
  English: { save: "Save place", saved: "Saved", savedMessage: "Place saved", removedMessage: "Place removed" },
  Chinese: { save: "收藏地点", saved: "已收藏", savedMessage: "地点已收藏", removedMessage: "地点已移除" },
  Japanese: { save: "場所を保存", saved: "保存済み", savedMessage: "場所を保存しました", removedMessage: "場所を削除しました" },
  Korean: { save: "장소 저장", saved: "저장됨", savedMessage: "장소가 저장됨", removedMessage: "장소가 제거됨" },
  Arabic: { save: "حفظ المكان", saved: "محفوظ", savedMessage: "تم حفظ المكان", removedMessage: "تمت إزالة المكان" },
  Hebrew: { save: "שמירת מקום", saved: "נשמר", savedMessage: "המקום נשמר", removedMessage: "המקום הוסר" },
  Russian: { save: "Сохранить место", saved: "Сохранено", savedMessage: "Место сохранено", removedMessage: "Место удалено" },
  Spanish: { save: "Guardar lugar", saved: "Guardado", savedMessage: "Lugar guardado", removedMessage: "Lugar eliminado" },
} as const;

const eventActionTranslations = {
  English: {
    goBack: "Go back",
    goBackHint: "Returns to the previous screen.",
    shareTitle: "Share event",
    shareMessage: (title: string, venue: string, time: string) => `I found this NSN meetup: ${title} at ${venue}, ${time}.`,
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
    shareMessage: (title: string, venue: string, time: string) => `מצאתי מפגש ב-NSN: ${title} ב-${venue}, ${time}.`,
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
    shareMessage: (title: string, venue: string, time: string) => `我发现了这个 NSN 聚会：${title}，地点 ${venue}，时间 ${time}。`,
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
    shareMessage: (title: string, venue: string, time: string) => `NSNのミートアップを見つけました：${title}、${venue}、${time}。`,
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
    shareMessage: (title: string, venue: string, time: string) => `NSN 모임을 찾았어요: ${title}, ${venue}, ${time}.`,
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
    title: "Confirm your details",
    copy: "Before in-person meetups, NSN asks you to confirm the basics other members rely on for safety.",
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
    confirm: "Review in profile",
    editProfile: "Edit profile",
    close: "Close",
    defaultMemberName: "NSN member",
    confirmHint: "Confirms these details for this meetup check.",
    editProfileHint: "Opens Profile to update trust, contact, and profile details.",
    verifiedTitle: "Details confirmed",
    verifiedCopy: "You are ready for in-person meetups.",
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

const detailEventTranslations: Record<string, Record<string, Partial<Pick<EventItem, "title" | "category" | "people" | "description" | "tone" | "weather">>>> = {
  Chinese: {
    "picnic-easy-hangout": { title: "野餐 — 轻松相处", category: "户外", people: "2–4 位成员", description: "带些零食，坐下来放松。不需要一直聊天。", tone: "适中", weather: "受天气影响" },
    "beach-day-chill-vibes": { title: "海边日 — 放松氛围", category: "户外", people: "3–6 位成员", description: "阳光、海边和好相处的人。自带毛巾。", tone: "适中", weather: "受天气影响" },
    "library-calm-study": { title: "图书馆安静学习", category: "室内", people: "2–5 位成员", description: "安静的桌边时间，轻松聊天休息和温和重置。", tone: "安静", weather: "适合雨天" },
    "coffee-lane-cove": { title: "咖啡 — 轻松打招呼", category: "美食", people: "2–4 位成员", description: "喝杯咖啡，找个舒服的位置，需要时随时离开。", tone: "适中", weather: "有室内备用" },
    "harbour-walk-waverton": { title: "海港散步 — 轻松节奏", category: "活动", people: "3–6 位成员", description: "慢慢散步，有安静时刻和小范围聊天的空间。", tone: "适中", weather: "受天气影响" },
    "board-games-coffee": { title: "桌游 + 咖啡", category: "室内", people: "3–5 位成员", description: "简单游戏、热饮和轻松的聊天开场。", tone: "适中", weather: "适合雨天" },
    "ramen-small-table": { title: "拉面 — 小桌", category: "美食", people: "3–5 位成员", description: "热乎的食物、简单介绍，不必有压力待到很晚。", tone: "适中", weather: "适合雨天" },
    "quiet-music-listening": { title: "安静音乐聆听", category: "室内", people: "2–5 位成员", description: "分享几首平静的歌，只按舒服的程度聊天。", tone: "安静", weather: "有室内备用" },
  },
  Japanese: {
    "picnic-easy-hangout": { title: "ピクニック — 気楽な集まり", category: "屋外", people: "2–4人", description: "軽食を持って、座って、リラックス。ずっと話す必要はありません。", tone: "ほどよい", weather: "天気次第" },
    "beach-day-chill-vibes": { title: "ビーチデー — ゆったりした雰囲気", category: "屋外", people: "3–6人", description: "太陽、海、気楽な時間。タオルを持参してください。", tone: "ほどよい", weather: "天気次第" },
    "library-calm-study": { title: "図書館で静かな勉強", category: "屋内", people: "2–5人", description: "静かなテーブル時間、軽い会話休憩、やさしいリセット。", tone: "静か", weather: "雨でも安心" },
    "coffee-lane-cove": { title: "コーヒー — 気軽にこんにちは", category: "食事", people: "2–4人", description: "コーヒーを飲み、居心地よく座り、必要ならいつでも帰れます。", tone: "ほどよい", weather: "屋内の予備案あり" },
    "harbour-walk-waverton": { title: "ハーバー散歩 — ゆっくりペース", category: "アクティブ", people: "3–6人", description: "静かな時間と横並びの会話ができる、ゆっくりした散歩。", tone: "ほどよい", weather: "天気次第" },
    "board-games-coffee": { title: "ボードゲーム + コーヒー", category: "屋内", people: "3–5人", description: "シンプルなゲーム、温かい飲み物、気軽な会話のきっかけ。", tone: "ほどよい", weather: "雨でも安心" },
    "ramen-small-table": { title: "ラーメン — 小さなテーブル", category: "食事", people: "3–5人", description: "温かい食事、簡単な自己紹介、遅くまで残るプレッシャーなし。", tone: "ほどよい", weather: "雨でも安心" },
    "quiet-music-listening": { title: "静かな音楽を聴く", category: "屋内", people: "2–5人", description: "落ち着いた曲をいくつか共有し、心地よい分だけ話します。", tone: "静か", weather: "屋内の予備案あり" },
  },
  Korean: {
    "picnic-easy-hangout": { title: "피크닉 — 편안한 시간", category: "야외", people: "2–4명", description: "간식을 가져와 앉아서 쉬어요. 계속 말해야 할 부담은 없어요.", tone: "적당함", weather: "날씨 영향 있음" },
    "beach-day-chill-vibes": { title: "해변의 날 — 여유로운 분위기", category: "야외", people: "3–6명", description: "햇살, 바다, 좋은 사람들. 수건을 가져오세요.", tone: "적당함", weather: "날씨 영향 있음" },
    "library-calm-study": { title: "도서관 차분한 스터디", category: "실내", people: "2–5명", description: "조용한 테이블 시간, 가벼운 대화 휴식, 부드러운 리셋.", tone: "조용함", weather: "비 오는 날 적합" },
    "coffee-lane-cove": { title: "커피 — 부담 없는 인사", category: "음식", people: "2–4명", description: "커피를 마시고 편한 곳에 앉아 필요하면 언제든 떠날 수 있어요.", tone: "적당함", weather: "실내 대안 있음" },
    "harbour-walk-waverton": { title: "하버 산책 — 쉬운 속도", category: "활동", people: "3–6명", description: "조용한 순간과 옆자리 대화가 가능한 느린 산책.", tone: "적당함", weather: "날씨 영향 있음" },
    "board-games-coffee": { title: "보드게임 + 커피", category: "실내", people: "3–5명", description: "간단한 게임, 따뜻한 음료, 쉬운 대화 시작점.", tone: "적당함", weather: "비 오는 날 적합" },
    "ramen-small-table": { title: "라멘 — 작은 테이블", category: "음식", people: "3–5명", description: "따뜻한 음식, 간단한 소개, 늦게까지 있어야 한다는 부담 없음.", tone: "적당함", weather: "비 오는 날 적합" },
    "quiet-music-listening": { title: "조용한 음악 감상", category: "실내", people: "2–5명", description: "차분한 노래 몇 곡을 공유하고 편한 만큼만 이야기해요.", tone: "조용함", weather: "실내 대안 있음" },
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
    description: "Watch first, optional chat after if it feels right. Perfect for low-pressure meetups.",
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
    weatherAffectedCopy: "Weather may affect this plan, so check the backup option before heading out.",
    weatherFriendlyCopy: "This event has a weather-friendly plan.",
    genericMeetingCopy: (venue: string) => `Meet near ${venue} about 10 minutes before the start time. The host can share a calmer exact spot in chat.`,
    meetingSafety: "Meeting safety",
    softExitTitle: "You can change your mind",
    softExitCopy: "It is okay to skip this meetup if it does not feel like your pace today. You can find another group, step back from the chat, or come back later.",
    verifyBeforeMeeting: "Verify before meeting",
    openMeetupChat: "Open Meetup Chat",
    openMeetupChatHint: "Opens the meetup group chat.",
    joinHint: "Joins this meetup.",
    verifyBeforeMeetingHint: "Opens verification details required before meeting in person.",
    postEventCheckIn: "Private post-event check-in",
    feedbackSaved: "Feedback saved privately for this meetup.",
    feedbackPrompt: "After the meetup, note how it felt. This is never a public rating.",
    feedbackGood: "Good",
    feedbackMixed: "Mixed",
    feedbackUnsafe: "Unsafe",
    preEventQuestionsTitle: "Icebreaker questions",
    preEventQuestionsCopy: "These questions can help start conversations at the meetup.",
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
    genericMeetingCopy: (venue: string) => `开始前约10分钟在 ${venue} 附近见。主持人可以在聊天中分享更安静的准确地点。`,
    meetingSafety: "聚会安全",
    softExitTitle: "你可以改变主意",
    softExitCopy: "如果今天感觉不适合自己的节奏，可以跳过这次聚会。你可以找另一个小组、从聊天中退一步，或稍后再回来。",
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
    description: "まず映画を観て、よければ後で少し話します。低プレッシャーなミートアップにぴったりです。",
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
    weatherAffectedCopy: "天気がこの予定に影響する場合があります。出発前に予備案を確認してください。",
    weatherFriendlyCopy: "このイベントには天気に対応した予定があります。",
    genericMeetingCopy: (venue: string) => `開始約10分前に ${venue} の近くで会いましょう。主催者がチャットでより静かな正確な場所を共有できます。`,
    meetingSafety: "ミートアップの安全",
    softExitTitle: "気が変わっても大丈夫",
    softExitCopy: "今日の自分のペースに合わないなら、このミートアップを休んでも大丈夫です。別のグループを探したり、チャットから少し離れたり、後で戻ることもできます。",
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
    genericMeetingCopy: (venue: string) => `시작 약 10분 전에 ${venue} 근처에서 만나요. 주최자가 채팅에서 더 조용한 정확한 장소를 공유할 수 있어요.`,
    meetingSafety: "모임 안전",
    softExitTitle: "마음이 바뀌어도 괜찮아요",
    softExitCopy: "오늘 내 속도와 맞지 않으면 이 모임을 건너뛰어도 괜찮아요. 다른 그룹을 찾거나, 채팅에서 잠시 물러나거나, 나중에 돌아올 수 있어요.",
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
    weatherAffectedCopy: "قد يؤثر الطقس على هذه الخطة، لذا تحقق من خيار النسخ الاحتياطي قبل الخروج.",
    weatherFriendlyCopy: "لهذا الحدث خطة مناسبة للطقس.",
    genericMeetingCopy: (venue: string) => `نلتقي بالقرب من ${venue} قبل وقت البداية بحوالي 10 دقائق. يمكن للمضيف مشاركة مكان أكثر هدوءاً في الدردشة.`,
    softExitTitle: "يمكنك تغيير رأيك",
    softExitCopy: "لا بأس في تخطي هذا اللقاء إذا لم يناسب وتيرتك اليوم. يمكنك العثور على مجموعة أخرى، أو التراجع عن الدردشة، أو العودة لاحقاً.",
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
    weatherAffectedCopy: "מזג האוויר עשוי להשפיע על התוכנית, אז כדאי לבדוק את אפשרות הגיבוי לפני שיוצאים.",
    weatherFriendlyCopy: "לאירוע הזה יש תוכנית שמתאימה למזג האוויר.",
    genericMeetingCopy: (venue: string) => `ניפגש ליד ${venue} כ-10 דקות לפני שעת ההתחלה. המארח יכול לשתף נקודה רגועה ומדויקת יותר בצ'אט.`,
    softExitTitle: "אפשר לשנות את דעתך",
    softExitCopy: "זה בסדר לדלג על המפגש אם הוא לא מרגיש בקצב שלך היום. אפשר למצוא קבוצה אחרת, לקחת צעד אחורה מהצ'אט, או לחזור מאוחר יותר.",
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
    description: "Сначала смотрим фильм, потом можно пообщаться, если захочется. Отлично для встреч без давления.",
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
    weatherAffectedCopy: "Погода может повлиять на план, поэтому проверьте запасной вариант перед выходом.",
    weatherFriendlyCopy: "У этой встречи есть план, подходящий для погоды.",
    genericMeetingCopy: (venue: string) => `Встречаемся рядом с ${venue} примерно за 10 минут до начала. Организатор может поделиться более спокойной точной точкой в чате.`,
    softExitTitle: "Вы можете передумать",
    softExitCopy: "Можно пропустить эту встречу, если сегодня она не подходит вашему темпу. Вы можете найти другую группу, отойти от чата или вернуться позже.",
    preEventQuestionsTitle: "Ледоколы",
    preEventQuestionsCopy: "Эти вопросы могут помочь начать разговоры на встрече.",
  },
  Spanish: {
    title: "Noche de cine —\nVer + charlar",
    category: "Interior",
    tone: "☽ Tranquilo",
    date: "Sábado, 24 de mayo · 7:00 p. m.",
    people: "2–4 personas",
    description: "Primero vemos la película y luego charla opcional si apetece. Perfecto para quedadas sin presión.",
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
    meetingCopy: "Nos vemos en la taquilla de Event Cinemas a las 6:50 p. m. Buscaremos asientos juntos.",
    join: "Unirse",
    spotsLeft: "Quedan 3 lugares",
    today: "Hoy",
    tonight: "Esta noche",
    genericDescriptionSuffix: "Una quedada sin presión con expectativas claras antes de unirte.",
    weatherAffectedCopy: "El clima puede afectar este plan, así que revisa la opción de respaldo antes de salir.",
    weatherFriendlyCopy: "Este evento tiene un plan adecuado para el clima.",
    genericMeetingCopy: (venue: string) => `Quedamos cerca de ${venue} unos 10 minutos antes de la hora de inicio. La persona anfitriona puede compartir un punto exacto más tranquilo en el chat.`,
    softExitTitle: "Puedes cambiar de opinión",
    softExitCopy: "Está bien saltarte esta quedada si hoy no va a tu ritmo. Puedes encontrar otro grupo, apartarte del chat o volver más tarde.",
    preEventQuestionsTitle: "Preguntas de hielo",
    preEventQuestionsCopy: "Estas preguntas pueden ayudar a iniciar conversaciones en la quedada.",
  },
} as const;

function DetailMetaRow({
  iconName,
  label,
  isDay,
  isRtl,
}: {
  iconName: "location" | "calendar" | "group";
  label: string;
  isDay?: boolean;
  isRtl?: boolean;
}) {
  return (
    <View style={[styles.metaRow, isRtl && styles.rtlRow]}>
      <View style={[styles.metaIconWrap, isDay && styles.dayMetaIconWrap]}>
        <IconSymbol name={iconName} color={isDay ? "#2F80ED" : "#E5E7EB"} size={19} />
      </View>
      <Text style={[styles.metaLine, isDay && styles.dayText, isRtl && styles.rtlText]}>{label}</Text>
    </View>
  );
}

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>([]);
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
    saveSoftHelloMvpState,
  } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = eventTranslations[appLanguageBase as keyof typeof eventTranslations] ?? eventTranslations.English;
  const saveCopy = savePlaceTranslations[appLanguageBase as keyof typeof savePlaceTranslations] ?? savePlaceTranslations.English;
  const actionCopy = eventActionTranslations[appLanguageBase as keyof typeof eventActionTranslations] ?? eventActionTranslations.English;
  const verificationCopy = verificationWindowTranslations[appLanguageBase as keyof typeof verificationWindowTranslations] ?? verificationWindowTranslations.English;
  const noiseCopy = noiseGuideTranslations[appLanguageBase as keyof typeof noiseGuideTranslations] ?? noiseGuideTranslations.English;
  const eventCopy = { ...eventTranslations.English, ...copy };
  const eventActionCopy = { ...eventActionTranslations.English, ...actionCopy };
  const eventVerificationCopy = { ...verificationWindowTranslations.English, ...verificationCopy };
  const isRtl = rtlLanguages.has(appLanguageBase);
  const isDay = !isNightMode;
  const iconColor = isDay ? "#0B1220" : nsnColors.text;

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

  const rawEvent = allEvents.find((item) => item.id === id) ?? createdEvents.find((item) => item.id === id) ?? movieNight;
  const isCreatedEvent = createdEvents.some((item) => item.id === id);
  const event: EventItem = isCreatedEvent ? {
    id: (rawEvent as CreatedEvent).id,
    title: (rawEvent as CreatedEvent).title,
    category: "Custom",
    venue: (rawEvent as CreatedEvent).venue,
    time: (rawEvent as CreatedEvent).time,
    people: "2–10 people",
    description: (rawEvent as CreatedEvent).description,
    tone: "Balanced",
    noiseLevel: (rawEvent as CreatedEvent).noiseLevel as any,
    weather: "Indoor ready",
    imageTone: "#29365E",
    emoji: "📅",
    tags: ["Custom"],
    preEventQuestions: (rawEvent as CreatedEvent).preEventQuestions,
    postEventQuestions: (rawEvent as CreatedEvent).postEventQuestions,
  } : rawEvent as EventItem;
  const localizedEvent = { ...event, ...(detailEventTranslations[appLanguageBase]?.[event.id] ?? {}) };
  const isMovieNight = event.id === movieNight.id;
  const eventTitle = isMovieNight ? copy.title : localizedEvent.title.replace(" — ", " —\n");
  const eventCategory = isMovieNight ? copy.category : localizedEvent.category;
  const eventTone = isMovieNight ? copy.tone : `Pace: ${getDetailSocialPaceLabel(localizedEvent.tone)}`;
  const eventDate = isMovieNight ? copy.date : isCreatedEvent ? `${(rawEvent as CreatedEvent).date} · ${(rawEvent as CreatedEvent).time}` : `${isNightMode ? copy.tonight : copy.today} · ${event.time}`;
  const eventPeople = isMovieNight ? copy.people : localizedEvent.people;
  const eventDescription = isMovieNight ? copy.description : `${localizedEvent.description} ${copy.genericDescriptionSuffix}`;
  const eventNoise = noiseCopy.levels[event.noiseLevel];
  const eventWeatherCopy = event.weather.includes("Weather")
    ? copy.weatherAffectedCopy
    : copy.weatherFriendlyCopy;
  const mediaComfortLabels = getDetailMediaComfortLabels(event, photoRecordingComfortPreferences);
  const eventMeetingCopy = isMovieNight
    ? copy.meetingCopy
    : copy.genericMeetingCopy(event.venue);
  const membership = getEventMembership(event.id, eventMemberships);
  const hasJoined = membership.status === "joined";
  const effectiveVerificationLevel = deriveVerificationLevel({ contactEmail, contactPhone, identitySelfieUri, hasIdentityDocument });
  const canMeet = canMeetInPerson(effectiveVerificationLevel);
  const existingFeedback = postEventFeedback.find((item) => item.eventId === event.id);
  const savedPlaceId = `event:${event.id}:${event.venue}`;
  const isPlaceSaved = savedPlaces.some((place) => place.id === savedPlaceId);
  const isEventPinned = pinnedEventIds.includes(event.id);
  const isEventHidden = hiddenEventIds.includes(event.id);

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
          Alert.alert(actionCopy.shareTitle, actionCopy.copiedMessage);
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

  const handleJoin = async () => {
    if (!canMeet) {
      setIsVerificationOpen(true);
      return;
    }

    const nextMemberships = joinEvent(event.id, eventMemberships);
    await saveSoftHelloMvpState({ eventMemberships: nextMemberships });
    router.push({ pathname: "/(tabs)/chats" });
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
      postEventFeedback
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
          savedPlaces
        );

    await saveSoftHelloMvpState({ savedPlaces: nextSavedPlaces });
    Alert.alert(isPlaceSaved ? saveCopy.removedMessage : saveCopy.savedMessage, event.venue);
  };

  const togglePinnedEvent = async () => {
    const nextPinnedEventIds = isEventPinned ? unpinEvent(event.id, pinnedEventIds) : pinEvent(event.id, pinnedEventIds);
    const nextHiddenEventIds = isEventPinned ? hiddenEventIds : unhideEvent(event.id, hiddenEventIds);

    await saveSoftHelloMvpState({ pinnedEventIds: nextPinnedEventIds, hiddenEventIds: nextHiddenEventIds });
    setIsMoreMenuOpen(false);
    Alert.alert(isEventPinned ? actionCopy.unpinnedMessage : actionCopy.pinnedMessage, event.title);
  };

  const toggleHiddenEvent = async () => {
    const nextHiddenEventIds = isEventHidden ? unhideEvent(event.id, hiddenEventIds) : hideEvent(event.id, hiddenEventIds);
    const nextPinnedEventIds = isEventHidden ? pinnedEventIds : unpinEvent(event.id, pinnedEventIds);

    await saveSoftHelloMvpState({ hiddenEventIds: nextHiddenEventIds, pinnedEventIds: nextPinnedEventIds });
    setIsMoreMenuOpen(false);
    Alert.alert(isEventHidden ? actionCopy.unhiddenMessage : actionCopy.hiddenMessage, event.title);
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayScreen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={[styles.screen, isDay && styles.dayScreen]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.topBar, isRtl && styles.rtlRow]}>
          <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={[styles.iconButton, isDay && styles.dayIconButton]} accessibilityRole="button" accessibilityLabel={eventActionCopy.goBack} accessibilityHint={screenReaderHints ? eventActionCopy.goBackHint : undefined}>
            <IconSymbol name="chevron.left" color={iconColor} size={26} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={toggleSavedPlace}
              accessibilityRole="button"
              accessibilityLabel={isPlaceSaved ? saveCopy.saved : saveCopy.save}
              accessibilityHint={screenReaderHints ? (isPlaceSaved ? eventActionCopy.removeSavedPlaceHint : eventActionCopy.savePlaceHint) : undefined}
              style={[styles.iconButton, isDay && styles.dayIconButton, isPlaceSaved && styles.savedIconButton]}
            >
              <IconSymbol name={isPlaceSaved ? "bookmark" : "bookmark.border"} color={isPlaceSaved ? nsnColors.day : iconColor} size={22} />
            </TouchableOpacity>
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
              style={[styles.iconButton, isDay && styles.dayIconButton, (isEventPinned || isEventHidden) && styles.activeMoreButton]}
            >
              <IconSymbol name="more" color={iconColor} size={23} />
            </TouchableOpacity>
          </View>
        </View>

        <Modal transparent animationType="fade" visible={isMoreMenuOpen} onRequestClose={() => setIsMoreMenuOpen(false)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.actionSheet, isDay && styles.dayActionSheet]}>
              <Text style={[styles.actionSheetTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{actionCopy.moreTitle}</Text>
              <Text style={[styles.actionSheetCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{actionCopy.moreCopy}</Text>
              <View style={styles.actionList}>
                <TouchableOpacity activeOpacity={0.82} onPress={togglePinnedEvent} style={[styles.actionRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]} accessibilityRole="button" accessibilityHint={screenReaderHints ? eventActionCopy.pinHint : undefined}>
                  <IconSymbol name="pin" color={isEventPinned ? nsnColors.day : iconColor} size={20} />
                  <Text style={[styles.actionText, isDay && styles.dayText, isRtl && styles.rtlText]}>{isEventPinned ? actionCopy.unpin : actionCopy.pin}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.82} onPress={toggleHiddenEvent} style={[styles.actionRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]} accessibilityRole="button" accessibilityHint={screenReaderHints ? eventActionCopy.hideHint : undefined}>
                  <IconSymbol name={isEventHidden ? "visibility" : "visibility.off"} color={isEventHidden ? "#2F80ED" : nsnColors.danger} size={20} />
                  <Text style={[styles.actionText, isDay && styles.dayText, isRtl && styles.rtlText]}>{isEventHidden ? actionCopy.unhide : actionCopy.hide}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => {
                    setIsMoreMenuOpen(false);
                    router.push("/(tabs)/saved-places");
                  }}
                  style={[styles.actionRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]}
                  accessibilityRole="button"
                  accessibilityHint={screenReaderHints ? eventActionCopy.viewSavedPlacesHint : undefined}
                >
                  <IconSymbol name="bookmark" color={nsnColors.day} size={20} />
                  <Text style={[styles.actionText, isDay && styles.dayText, isRtl && styles.rtlText]}>{actionCopy.viewSavedPlaces}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={0.82} onPress={() => setIsMoreMenuOpen(false)} style={styles.closeActionButton}>
                <Text style={styles.closeActionText}>{actionCopy.close}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal transparent animationType="fade" visible={isVerificationOpen} onRequestClose={() => setIsVerificationOpen(false)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.verificationSheet, isDay && styles.dayActionSheet]}>
              <Text style={[styles.actionSheetTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{verificationCopy.title}</Text>
              <Text style={[styles.actionSheetCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{verificationCopy.copy}</Text>
              <View style={styles.verificationList}>
                {[
                  { label: verificationCopy.displayName, value: displayName || eventVerificationCopy.defaultMemberName },
                  { label: verificationCopy.suburb, value: suburb || event.venue },
                  { label: verificationCopy.age, value: ageConfirmed ? verificationCopy.ageConfirmed : verificationCopy.ageMissing },
                  { label: verificationCopy.photo, value: profilePhotoUri ? verificationCopy.photoAdded : verificationCopy.photoMissing },
                  { label: verificationCopy.contact, value: getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase) },
                  { label: verificationCopy.transport, value: transportationMethod },
                ].map((item) => (
                  <View key={item.label} style={[styles.verificationRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]}>
                    <Text style={[styles.verificationLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{item.label}</Text>
                    <Text style={[styles.verificationValue, isDay && styles.dayText, isRtl && styles.rtlText]}>{item.value}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.verificationActions}>
              <TouchableOpacity activeOpacity={0.82} onPress={confirmVerificationDetails} style={styles.confirmVerificationButton} accessibilityRole="button" accessibilityHint={screenReaderHints ? eventVerificationCopy.confirmHint : undefined}>
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
                  accessibilityHint={screenReaderHints ? eventVerificationCopy.editProfileHint : undefined}
                >
                  <Text style={[styles.secondaryVerificationText, isDay && styles.dayText]}>{verificationCopy.editProfile}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.82} onPress={() => setIsVerificationOpen(false)} style={styles.closeActionButton}>
                  <Text style={styles.closeActionText}>{verificationCopy.close}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={[styles.heroPanel, isDay && styles.dayPanel]}>
          <View style={styles.eventAvatar}>
            <Text style={styles.avatarEmoji}>{event.emoji}</Text>
          </View>
          <Text style={[styles.title, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{eventTitle}</Text>
          <View style={[styles.tagRow, isRtl && styles.rtlRow]}>
            <Text style={[styles.primaryChip, isRtl && styles.rtlText]}>{eventCategory}</Text>
            <Text style={[styles.quietChip, isDay && styles.dayQuietChip, isRtl && styles.rtlText]}>{eventTone}</Text>
          </View>
        </View>

        <View style={styles.metaStack}>
          <DetailMetaRow iconName="location" label={event.venue} isDay={isDay} isRtl={isRtl} />
          <DetailMetaRow iconName="calendar" label={eventDate} isDay={isDay} isRtl={isRtl} />
          <DetailMetaRow iconName="group" label={eventPeople} isDay={isDay} isRtl={isRtl} />
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          onPress={toggleSavedPlace}
          style={[styles.savePlaceButton, isDay && styles.daySavePlaceButton, isRtl && styles.rtlRow]}
          accessibilityRole="button"
          accessibilityHint={screenReaderHints ? (isPlaceSaved ? eventActionCopy.removeSavedPlaceHint : eventActionCopy.savePlaceHint) : undefined}
        >
          <IconSymbol name={isPlaceSaved ? "bookmark" : "bookmark.border"} color={isPlaceSaved ? nsnColors.day : iconColor} size={20} />
          <Text style={[styles.savePlaceText, isDay && styles.dayText, isRtl && styles.rtlText]}>{isPlaceSaved ? saveCopy.saved : saveCopy.save}</Text>
        </TouchableOpacity>

        <Text style={[styles.description, isDay && styles.dayText, isRtl && styles.rtlText]}>{eventDescription}</Text>

        <TouchableOpacity activeOpacity={0.86} style={[styles.weatherCard, isDay && styles.dayCard, isRtl && styles.rtlRow]}>
          <View style={[styles.weatherIconWrap, isDay && styles.dayMetaIconWrap]}>
            <IconSymbol name="weather" color={isDay ? "#53677A" : "#8FAFD1"} size={24} />
          </View>
          <View style={[styles.weatherCopyBlock, isRtl && styles.rtlBlock]}>
            <Text style={[styles.weatherTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.weatherTitle}</Text>
            <Text style={[styles.weatherCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{isMovieNight ? copy.weatherCopy : eventWeatherCopy}</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.noiseGuideCard, isDay && styles.dayCard, isRtl && styles.rtlRow]}>
          <View style={[styles.noiseIconWrap, isDay && styles.dayMetaIconWrap]}>
            <IconSymbol name={event.noiseLevel === "Quiet" ? "volume.off" : "volume"} color={isDay ? "#53677A" : "#8FAFD1"} size={22} />
          </View>
          <View style={[styles.noiseCopyBlock, isRtl && styles.rtlBlock]}>
            <Text style={[styles.noiseTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{noiseCopy.title}: {eventNoise.label}</Text>
            <Text style={[styles.noiseDescription, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{eventNoise.copy}. {noiseCopy.copy}</Text>
          </View>
        </View>

        <View style={[styles.mediaComfortCard, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
          <View style={[styles.mediaComfortHeader, isRtl && styles.rtlRow]}>
            <View style={[styles.mediaComfortIconWrap, isDay && styles.dayMetaIconWrap]}>
              <IconSymbol name="visibility" color={isDay ? "#53677A" : "#8FAFD1"} size={20} />
            </View>
            <Text style={[styles.mediaComfortTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Photo & recording comfort</Text>
          </View>
          <Text style={[styles.mediaComfortCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Let others know what feels okay around photos, videos, and screenshots. NSN can guide consent, but it can't fully prevent someone from using another device.
          </Text>
          <View style={[styles.mediaComfortChipRow, isRtl && styles.rtlRow]}>
            {mediaComfortLabels.map((label) => (
              <Text key={label} style={[styles.mediaComfortChip, isDay && styles.dayMediaComfortChip, isRtl && styles.rtlText]}>{label}</Text>
            ))}
          </View>
          <Text style={[styles.mediaComfortNote, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Please don't screenshot or share someone's profile, chat, or meetup details without permission. Prototype note: NSN can show preferences and reminders, but cannot guarantee screenshot/photo prevention.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.whatToExpect}</Text>
        <View style={[styles.expectGrid, isRtl && styles.rtlRow]}>
          <View style={[styles.expectCard, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
            <IconSymbol name="low-pressure" color={isDay ? "#53677A" : "#8FAFD1"} size={20} />
            <Text style={[styles.expectTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.lowPressure}</Text>
            <Text style={[styles.expectCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.lowPressureCopy}</Text>
          </View>
          <View style={[styles.expectCard, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
            <IconSymbol name="experience" color={isDay ? "#53677A" : "#8FAFD1"} size={20} />
            <Text style={[styles.expectTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.sharedExperience}</Text>
            <Text style={[styles.expectCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.sharedExperienceCopy}</Text>
          </View>
          <View style={[styles.expectCard, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
            <IconSymbol name="flexible" color={isDay ? "#53677A" : "#8FAFD1"} size={20} />
            <Text style={[styles.expectTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.flexible}</Text>
            <Text style={[styles.expectCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.flexibleCopy}</Text>
          </View>
        </View>

        {event.preEventQuestions && event.preEventQuestions.length > 0 && (
          <View style={[styles.questionsPanel, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
            <Text style={[styles.sectionTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.preEventQuestionsTitle}</Text>
            <Text style={[styles.questionsCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.preEventQuestionsCopy}</Text>
            <View style={styles.questionsList}>
              {event.preEventQuestions.map((question, index) => (
                <Text key={index} style={[styles.questionText, isDay && styles.dayText, isRtl && styles.rtlText]}>
                  • {question}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.meetingPanel, isDay && styles.dayMeetingPanel, isRtl && styles.rtlBlock]}>
          <Text style={[styles.sectionTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.meetingPoint}</Text>
          <Text style={[styles.meetingCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{eventMeetingCopy}</Text>
        </View>

        <View style={[styles.safetyPanel, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
          <View style={[styles.safetyHeader, isRtl && styles.rtlRow]}>
            <Text style={[styles.safetyTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{eventCopy.meetingSafety}</Text>
            <Text style={[styles.verificationChip, isDay && styles.dayVerificationChip, canMeet && styles.verificationChipReady, isDay && canMeet && styles.dayVerificationChipReady]}>
              {getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase)}
            </Text>
          </View>
          <Text style={[styles.safetyCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{getMeetingSafetyCopy(effectiveVerificationLevel, appLanguageBase)}</Text>
        </View>

        <View style={[styles.softExitCard, isDay && styles.daySoftExitCard, isRtl && styles.rtlBlock]}>
          <Text style={[styles.softExitTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.softExitTitle}</Text>
          <Text style={[styles.softExitCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.softExitCopy}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleJoin}
          style={[styles.joinButton, !canMeet && styles.joinButtonLocked]}
          accessibilityRole="button"
          accessibilityHint={screenReaderHints ? (hasJoined ? eventCopy.openMeetupChatHint : canMeet ? eventCopy.joinHint : eventCopy.verifyBeforeMeetingHint) : undefined}
        >
          <Text style={styles.joinText}>
            {hasJoined ? eventCopy.openMeetupChat : canMeet ? copy.join : eventCopy.verifyBeforeMeeting}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.spotsText, isDay && styles.dayMutedText]}>{copy.spotsLeft}</Text>

        {hasJoined ? (
          <View style={[styles.feedbackPanel, isDay && styles.dayCard]}>
            <Text style={[styles.safetyTitle, isDay && styles.dayHeadingText]}>{eventCopy.postEventCheckIn}</Text>
            <Text style={[styles.safetyCopy, isDay && styles.dayMutedText]}>
              {existingFeedback ? eventCopy.feedbackSaved : eventCopy.feedbackPrompt}
            </Text>
            {event.postEventQuestions && event.postEventQuestions.length > 0 && !existingFeedback && (
              <View style={styles.postQuestionsList}>
                {event.postEventQuestions.map((question, index) => (
                  <Text key={index} style={[styles.postQuestionText, isDay && styles.dayText]}>
                    • {question}
                  </Text>
                ))}
              </View>
            )}
            <View style={styles.feedbackActions}>
              <TouchableOpacity activeOpacity={0.82} onPress={() => saveFeedback("Good", true)} style={styles.feedbackButton}>
                <Text style={styles.feedbackButtonText}>{eventCopy.feedbackGood}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.82} onPress={() => saveFeedback("Mixed", false)} style={styles.feedbackButton}>
                <Text style={styles.feedbackButtonText}>{eventCopy.feedbackMixed}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.82} onPress={() => saveFeedback("Unsafe", false)} style={[styles.feedbackButton, styles.feedbackButtonDanger]}>
                <Text style={styles.feedbackButtonText}>{eventCopy.feedbackUnsafe}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayScreen: { backgroundColor: "#E8EDF2" },
  dayCard: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  dayHeadingText: { color: "#0B1220" },
  dayIconButton: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  dayMeetingPanel: { borderColor: "#C5D0DA" },
  dayMetaIconWrap: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  dayMutedText: { color: "#53677A" },
  dayPanel: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  dayQuietChip: { color: "#53677A", backgroundColor: "#E8EDF2" },
  dayText: { color: "#0B1220" },
  dayActionSheet: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  dayActionRow: { backgroundColor: "#E8EDF2", borderColor: "#C5D0DA" },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  topActions: { flexDirection: "row", gap: 8 },
  rtlRow: { flexDirection: "row-reverse" },
  rtlBlock: { alignItems: "flex-end" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: nsnColors.border },
  savedIconButton: { borderColor: "rgba(247,200,91,0.68)", backgroundColor: "rgba(247,200,91,0.12)" },
  activeMoreButton: { borderColor: "rgba(47,128,237,0.52)", backgroundColor: "rgba(47,128,237,0.12)" },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(2,8,20,0.42)", padding: 16 },
  actionSheet: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#0F1B2C", padding: 16 },
  verificationSheet: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#0F1B2C", padding: 16 },
  actionSheetTitle: { color: nsnColors.text, fontSize: 18, fontWeight: "900", lineHeight: 24 },
  actionSheetCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19, marginTop: 3, marginBottom: 12 },
  actionList: { gap: 8 },
  actionRow: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", paddingHorizontal: 12 },
  actionText: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  closeActionButton: { minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: nsnColors.primary, marginTop: 12 },
  closeActionText: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  verificationList: { gap: 8 },
  verificationRow: { minHeight: 56, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", paddingHorizontal: 12, paddingVertical: 9 },
  verificationLabel: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15, marginBottom: 2 },
  verificationValue: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  verificationActions: { marginTop: 12, gap: 9 },
  confirmVerificationButton: { minHeight: 48, borderRadius: 15, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center" },
  confirmVerificationText: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  secondaryVerificationButton: { minHeight: 46, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" },
  secondaryVerificationText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  heroPanel: { alignItems: "center", borderRadius: 28, paddingTop: 8, paddingBottom: 22, backgroundColor: "#061121", borderWidth: 1, borderColor: "rgba(56,72,255,0.22)", marginBottom: 18 },
  eventAvatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#21123E", borderWidth: 2, borderColor: nsnColors.primary, alignItems: "center", justifyContent: "center", marginTop: -2, marginBottom: 18 },
  avatarEmoji: { fontSize: 43 },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "800", textAlign: "center", letterSpacing: -0.5, lineHeight: 34 },
  tagRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  primaryChip: { color: nsnColors.text, fontSize: 12, fontWeight: "800", backgroundColor: nsnColors.primary, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 14, overflow: "hidden" },
  quietChip: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", backgroundColor: "rgba(255,255,255,0.06)", paddingHorizontal: 13, paddingVertical: 7, borderRadius: 14, overflow: "hidden" },
  metaStack: { gap: 8, marginBottom: 12 },
  savePlaceButton: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", marginBottom: 14 },
  daySavePlaceButton: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  savePlaceText: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaIconWrap: { width: 32, height: 32, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(148,163,184,0.18)" },
  metaLine: { flex: 1, color: nsnColors.text, fontSize: 14, lineHeight: 20 },
  description: { color: nsnColors.text, fontSize: 15, lineHeight: 23, marginBottom: 14 },
  weatherCard: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 13, backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: "#284476", marginBottom: 19 },
  weatherCopyBlock: { flex: 1 },
  weatherTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  weatherCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, maxWidth: 250 },
  weatherIconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: nsnColors.border },
  weatherIcon: { fontSize: 28 },
  noiseGuideCard: { minHeight: 74, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#0D1A2C", padding: 13, marginBottom: 16 },
  noiseIconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: nsnColors.border },
  noiseIcon: { fontSize: 21, lineHeight: 24 },
  noiseCopyBlock: { flex: 1 },
  noiseTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  noiseDescription: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 2 },
  mediaComfortCard: { borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#0D1A2C", padding: 14, gap: 9, marginBottom: 16 },
  mediaComfortHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  mediaComfortIconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: nsnColors.border },
  mediaComfortTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  mediaComfortCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18 },
  mediaComfortChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  mediaComfortChip: { color: "#D2E0FF", borderColor: "rgba(124,170,201,0.45)", borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 5, fontSize: 11, fontWeight: "900", overflow: "hidden", backgroundColor: "rgba(124,170,201,0.1)" },
  dayMediaComfortChip: { color: "#445E93", borderColor: "#9AADE8", backgroundColor: "#EDF2FF" },
  mediaComfortNote: { color: nsnColors.muted, fontSize: 11, lineHeight: 16, fontWeight: "700" },
  sectionTitle: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 23, marginBottom: 10 },
  expectGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  expectCard: { width: "48%", minHeight: 82, borderRadius: 16, padding: 13, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border },
  expectIcon: { color: "#8FAFD1", fontSize: 18, marginBottom: 4 },
  expectTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "800", lineHeight: 18 },
  expectCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 16, marginTop: 1 },
  meetingPanel: { borderTopWidth: 1, borderColor: nsnColors.border, paddingTop: 14, marginTop: 2, marginBottom: 18 },
  meetingCopy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
  softExitCard: { borderRadius: 18, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: nsnColors.border, padding: 15, marginBottom: 18 },
  daySoftExitCard: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  softExitTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20, marginBottom: 4 },
  softExitCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
  safetyPanel: { borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#0D1A2C", padding: 14, marginBottom: 14 },
  safetyHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 },
  safetyTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  safetyCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
  verificationChip: { color: nsnColors.warning, borderColor: "rgba(247,200,91,0.45)", borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, fontSize: 11, fontWeight: "900", overflow: "hidden" },
  verificationChipReady: { color: nsnColors.green, borderColor: "rgba(114,214,126,0.45)" },
  dayVerificationChip: { color: "#7C5A00", backgroundColor: "#FFF7D8", borderColor: "#D4A91E" },
  dayVerificationChipReady: { color: "#0F6B2F", backgroundColor: "#E8F8EE", borderColor: "#55A96E" },
  joinButton: { height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: nsnColors.primary },
  joinButtonLocked: { backgroundColor: "#3A4358" },
  joinText: { color: nsnColors.text, fontSize: 16, fontWeight: "800" },
  spotsText: { color: nsnColors.muted, textAlign: "center", marginTop: 10, fontSize: 13, lineHeight: 19 },
  feedbackPanel: { borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#0D1A2C", padding: 14, marginTop: 14 },
  feedbackActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  feedbackButton: { flex: 1, minHeight: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: nsnColors.border },
  feedbackButtonDanger: { borderColor: "rgba(255,119,119,0.45)" },
  feedbackButtonText: { color: nsnColors.text, fontSize: 12, fontWeight: "900" },
  questionsPanel: { borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#0D1A2C", padding: 14, marginBottom: 14 },
  questionsCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19, marginBottom: 10 },
  questionsList: { gap: 6 },
  questionText: { color: nsnColors.text, fontSize: 14, lineHeight: 20 },
  postQuestionsList: { gap: 6, marginTop: 10, marginBottom: 10 },
  postQuestionText: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
});
