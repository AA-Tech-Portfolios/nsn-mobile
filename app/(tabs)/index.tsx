import { type ComponentProps, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Image, type ImageSourcePropType, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

import { defaultHomeSectionOrder, defaultHomeVisibleSections, getLanguageBase, type CardOutlineStyle, type GroupSizePreference, type HomeCardLayout, type HomeEventLayout, type HomeEventVisualMode, type HomeHeaderControlsDensity, type HomeLayoutDensity, type HomeSectionOrderKey, type HomeViewMode, type HomeVisibleSections, type NoiseLevelPreference, type PhotoRecordingComfortPreference, type SocialEnergyPreference, useAppSettings } from "@/lib/app-settings";
import { LocalAreaPicker } from "@/components/local-area-picker";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { allEvents, dayEvents, eveningEvents, type EventItem, noiseLevelOptions, nsnColors } from "@/lib/nsn-data";
import { findNearestNsnSydneyLocalArea, normalizeNsnSearchQuery, type NsnLocalAreaSuggestion, searchNsnEvents } from "@/lib/nsn-search";
import { getComfortEventScore, isNearbyEvent, isSmallGroupEvent, isWeatherSafeEvent } from "@/lib/home-view-filters";
import { prioritizeEventsForComfort } from "@/lib/softhello-mvp";
import { formatEventTimeLabel, formatPreferredDate, formatPreferredTime, formatTemperatureLabel } from "@/lib/regional-format";
import { getEventFoodPreferenceMatches } from "@/lib/preferences/food-preferences";
import { getEventInterestPreferenceMatches } from "@/lib/preferences/interests";
import { getHomePreferenceDisclosure } from "@/lib/progressive-disclosure";
import { getHomeLayoutPreset, homeLayoutPreferenceRoles } from "@/lib/home-layout-presets";
import { getHomeEventPreviewAsset, type HomeEventPreviewAssetKey } from "@/lib/home-event-preview-assets";
import { getHomeTodayContextLabel } from "@/lib/home-header-context";
import {
  askAboutMeetupQuestionGroups,
  firstMeetupSupportOptions,
  getFirstMeetupSupportSummary,
  getOptionsHubCategoryCards,
  getOptionsHubSection,
  optionsHubSections,
  type AskAboutMeetupQuestion,
  type FirstMeetupSupportOption,
  type OptionsHubCategoryCard,
  type OptionsHubRow,
  type OptionsHubSectionId,
} from "@/lib/options-hub";

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);
const appLocaleMap: Record<string, string> = {
  Arabic: "ar",
  "Arabic (Egypt)": "ar-EG",
  "Arabic (Gulf)": "ar-AE",
  "Arabic (Levant)": "ar-JO",
  "Arabic (Maghreb)": "ar-MA",
  "Arabic (Modern Standard)": "ar",
  Afrikaans: "af-ZA",
  Albanian: "sq-AL",
  Armenian: "hy-AM",
  Chinese: "zh-CN",
  "Chinese (Cantonese)": "yue-HK",
  "Chinese (Hong Kong)": "zh-HK",
  "Chinese (Mainland China)": "zh-CN",
  "Chinese (Singapore)": "zh-SG",
  "Chinese (Taiwan)": "zh-TW",
  Croatian: "hr-HR",
  Czech: "cs-CZ",
  "Dutch (BE)": "nl-BE",
  "English (Australia)": "en-AU",
  "English (AU)": "en-AU",
  "English (CA)": "en-CA",
  "English (HK)": "en-HK",
  "English (IE)": "en-IE",
  "English (IN)": "en-IN",
  "English (JM)": "en-JM",
  "English (NZ)": "en-NZ",
  "English (SG)": "en-SG",
  "English (UK)": "en-GB",
  "English (US)": "en-US",
  "English (ZA)": "en-ZA",
  Estonian: "et-EE",
  French: "fr",
  "French (BE)": "fr-BE",
  "French (CA)": "fr-CA",
  "French (Central Africa)": "fr-CM",
  "French (CH)": "fr-CH",
  "French (FR)": "fr-FR",
  "French (North Africa)": "fr-MA",
  "French (West Africa)": "fr-SN",
  German: "de",
  "German (AT)": "de-AT",
  "German (BE)": "de-BE",
  "German (CH)": "de-CH",
  "German (Germany)": "de-DE",
  "German (LI)": "de-LI",
  "German (LU)": "de-LU",
  Hebrew: "he",
  "Haitian Creole": "ht-HT",
  Hungarian: "hu-HU",
  "Italian (CH)": "it-CH",
  Japanese: "ja",
  Korean: "ko",
  Latvian: "lv-LV",
  Lithuanian: "lt-LT",
  Luxembourgish: "lb-LU",
  "Portuguese (BR)": "pt-BR",
  "Portuguese (PT)": "pt-PT",
  Russian: "ru",
  Slovak: "sk-SK",
  Spanish: "es",
  "Spanish (Latin America)": "es-419",
  "Spanish (Mexico)": "es-MX",
  "Spanish (Spain)": "es-ES",
  Yiddish: "yi",
};
const filterKeys = ["All", "Outdoor", "Indoor", "Food", "Active"] as const;
type EventFilter = (typeof filterKeys)[number];
const noiseFilterKeys: NoiseLevelPreference[] = ["Any", ...noiseLevelOptions];
type HomeSearchMode = "areas" | "meetups";
type HomePanel = "none" | "search" | "filters" | "customize" | "preferences" | "options";
type HomeSectionKey = keyof HomeVisibleSections;

const homeSectionLabels: Record<HomeSectionKey, string> = {
  weather: "Weather update",
  map: "Selected location map",
  noiseGuide: "Noise level guide",
  search: "Search NSN",
  recommendedEvents: "Recommended events",
  dayEvents: "Day events",
  nightEvents: "Night events",
};

const homeSectionIcons: Record<HomeSectionKey, ComponentProps<typeof IconSymbol>["name"]> = {
  weather: "weather",
  map: "location",
  noiseGuide: "volume",
  search: "magnifyingglass",
  recommendedEvents: "experience",
  dayEvents: "experience",
  nightEvents: "low-pressure",
};

const homeDensityOptions: Array<{ value: HomeLayoutDensity; icon: string; label: string; copy: string }> = [
  { value: "Compact", icon: "▦", label: "Compact", copy: "Tighter cards" },
  { value: "Comfortable", icon: "◐", label: "Comfortable", copy: "Easy scan" },
  { value: "Spacious", icon: "□", label: "Spacious", copy: "More room" },
];

const homeHeaderControlDensityOptions: Array<{ value: HomeHeaderControlsDensity; icon: ComponentProps<typeof IconSymbol>["name"]; label: string; copy: string }> = [
  { value: "Compact", icon: "ellipsis", label: "Compact", copy: "Smallest header buttons" },
  { value: "Comfortable", icon: "settings", label: "Comfortable", copy: "Balanced spacing" },
  { value: "Spacious", icon: "palette", label: "Spacious", copy: "Larger tap targets" },
];

const cardOutlineOptions: Array<{ value: CardOutlineStyle; label: string; copy: string }> = [
  { value: "Minimal", label: "Minimal", copy: "Softer borders" },
  { value: "Standard", label: "Standard", copy: "Balanced outline" },
  { value: "Strong", label: "Strong", copy: "Bold NSN outline" },
];

const homeCardLayoutOptions: Array<{ value: HomeCardLayout; icon: string; label: string; copy: string }> = [
  { value: "Vertical list", icon: "☰", label: "Vertical list", copy: "Classic top-to-bottom" },
  { value: "Horizontal cards", icon: "↔", label: "Horizontal", copy: "Side-by-side scroll" },
  { value: "Boxed grid", icon: "▦", label: "Boxed grid", copy: "Grid of cards" },
  { value: "Layered cards", icon: "▱", label: "Layered", copy: "Stacked cards" },
  { value: "Magazine", icon: "◨", label: "Magazine", copy: "Large featured cards" },
];

const homeEventVisualModeOptions: Array<{ value: HomeEventVisualMode; icon: string; label: string; copy: string }> = [
  { value: "Emoji/Icon", icon: "◌", label: "Emoji/Icon", copy: "Clear symbolic cards" },
  { value: "Preview image", icon: "◧", label: "Preview image", copy: "Use venue previews" },
];

const homeViewModeLabels: Record<HomeViewMode, string> = {
  Essential: "⚡ Essential view",
  Comfortable: "🌙 Comfortable view",
};

const homeEventLayoutLabels: Record<HomeEventLayout, string> = {
  List: "📋 List view",
  Map: "🗺️ Map view",
};

const homeFilterLabels = {
  nearby: "📍 Nearby",
  smallGroups: "👥 Small groups",
  weatherSafe: "☀️ Weather-safe",
};

const noiseGuideTranslations = {
  English: {
    title: "Noise Level Guide",
    copy: "Filter by the actual sound level of the place, separate from how much talking is expected.",
    filters: { Any: "All", Quiet: "Quiet", Balanced: "Moderate", Lively: "Lively" },
    levels: {
      Quiet: { icon: "🔇", label: "Quiet", copy: "Low noise" },
      Balanced: { icon: "🌿", label: "Moderate", copy: "Moderate noise" },
      Lively: { icon: "🎉", label: "Lively", copy: "More energy" },
    },
  },
  Chinese: {
    title: "噪音水平指南",
    copy: "按场地的实际声音水平筛选，和预期聊天多少分开考虑。",
    filters: { Any: "全部", Quiet: "安静", Balanced: "适中", Lively: "热闹" },
    levels: {
      Quiet: { icon: "🔇", label: "安静", copy: "低噪音" },
      Balanced: { icon: "🌿", label: "适中", copy: "中等噪音" },
      Lively: { icon: "🔊", label: "热闹", copy: "更有活力" },
    },
  },
  Japanese: {
    title: "騒音レベルガイド",
    copy: "会話量の期待とは別に、場所そのものの音量で絞り込めます。",
    filters: { Any: "すべて", Quiet: "静か", Balanced: "ほどよい", Lively: "にぎやか" },
    levels: {
      Quiet: { icon: "🔇", label: "静か", copy: "低い騒音" },
      Balanced: { icon: "🌿", label: "ほどよい", copy: "中程度の騒音" },
      Lively: { icon: "🔊", label: "にぎやか", copy: "より活気あり" },
    },
  },
  Korean: {
    title: "소음 수준 안내",
    copy: "예상 대화량과 별개로, 장소의 실제 소리 수준으로 필터링하세요.",
    filters: { Any: "전체", Quiet: "조용함", Balanced: "적당함", Lively: "활기참" },
    levels: {
      Quiet: { icon: "🔇", label: "조용함", copy: "낮은 소음" },
      Balanced: { icon: "🌿", label: "적당함", copy: "중간 소음" },
      Lively: { icon: "🔊", label: "활기참", copy: "더 에너지 있음" },
    },
  },
  Arabic: {
    title: "دليل مستوى الضوضاء",
    copy: "فلتر حسب الصوت الفعلي للمكان، بشكل منفصل عن مقدار الحديث المتوقع.",
    filters: { Any: "الكل", Quiet: "هادئ", Balanced: "متوازن", Lively: "نشيط" },
    levels: {
      Quiet: { icon: "🔇", label: "هادئ", copy: "ضوضاء منخفضة" },
      Balanced: { icon: "🌿", label: "متوازن", copy: "ضوضاء معتدلة" },
      Lively: { icon: "🔊", label: "نشيط", copy: "طاقة أكثر" },
    },
  },
  Hebrew: {
    title: "מדריך רמת רעש",
    copy: "סינון לפי רמת הצליל בפועל במקום, בנפרד מכמות השיחה הצפויה.",
    filters: { Any: "הכל", Quiet: "שקט", Balanced: "מאוזן", Lively: "תוסס" },
    levels: {
      Quiet: { icon: "🔇", label: "שקט", copy: "רעש נמוך" },
      Balanced: { icon: "🌿", label: "מאוזן", copy: "רעש מתון" },
      Lively: { icon: "🔊", label: "תוסס", copy: "יותר אנרגיה" },
    },
  },
} as const;

const remotePreview = (uri: string): ImageSourcePropType => ({ uri });

const photoStylePreviewSources: Record<HomeEventPreviewAssetKey, ImageSourcePropType> = {
  picnic: remotePreview("https://unsplash.com/photos/Bsyj_GezIQQ/download?force=true"),
  beach: remotePreview("https://unsplash.com/photos/kJ6SgBhp9Uc/download?force=true"),
  movie: remotePreview("https://unsplash.com/photos/GvJBboqOebI/download?force=true"),
};

const photoStylePreview = (eventId: string) => {
  const previewAsset = getHomeEventPreviewAsset(eventId);

  return previewAsset ? photoStylePreviewSources[previewAsset.assetKey] : undefined;
};

const eventLivePreviews: Record<string, { photo: ImageSourcePropType; place: string; pulse: string }> = {
  "picnic-easy-hangout": {
    photo: photoStylePreview("picnic-easy-hangout")!,
    place: "Lane Cove",
    pulse: "Live 2",
  },
  "beach-day-chill-vibes": {
    photo: photoStylePreview("beach-day-chill-vibes")!,
    place: "Palm Beach",
    pulse: "Live 5",
  },
  "library-calm-study": {
    photo: remotePreview("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=280&q=80"),
    place: "Chatswood",
    pulse: "Live 1",
  },
  "coffee-lane-cove": {
    photo: remotePreview("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=280&q=80"),
    place: "Lane Cove",
    pulse: "Live 3",
  },
  "harbour-walk-waverton": {
    photo: remotePreview("https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=280&q=80"),
    place: "Waverton",
    pulse: "Live 4",
  },
  "movie-night-watch-chat": {
    photo: photoStylePreview("movie-night-watch-chat")!,
    place: "Macquarie",
    pulse: "Live 6",
  },
  "board-games-coffee": {
    photo: remotePreview("https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=280&q=80"),
    place: "Chatswood",
    pulse: "Live 2",
  },
  "ramen-small-table": {
    photo: remotePreview("https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=280&q=80"),
    place: "Crows Nest",
    pulse: "Live 3",
  },
  "quiet-music-listening": {
    photo: remotePreview("https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=280&q=80"),
    place: "North Sydney",
    pulse: "Live 1",
  },
};

const eventTranslations: Record<string, Record<string, Partial<Pick<EventItem, "title" | "category" | "people" | "description" | "tone" | "weather">>>> = {
  Chinese: {
    "picnic-easy-hangout": { title: "野餐 — 轻松相处", category: "户外", people: "2–4 位成员", description: "带些零食，坐下来放松。不需要一直聊天。", tone: "适中", weather: "受天气影响" },
    "beach-day-chill-vibes": { title: "海边日 — 放松氛围", category: "户外", people: "3–6 位成员", description: "阳光、海边和好相处的人。自带毛巾。", tone: "适中", weather: "受天气影响" },
    "library-calm-study": { title: "图书馆安静学习", category: "室内", people: "2–5 位成员", description: "安静的桌边时间，轻松聊天休息和温和重置。", tone: "安静", weather: "适合雨天" },
    "coffee-lane-cove": { title: "咖啡 — 轻松打招呼", category: "美食", people: "2–4 位成员", description: "喝杯咖啡，找个舒服的位置，需要时随时离开。", tone: "适中", weather: "有室内备用" },
    "harbour-walk-waverton": { title: "海港散步 — 轻松节奏", category: "活动", people: "3–6 位成员", description: "慢慢散步，有安静时刻和小范围聊天的空间。", tone: "适中", weather: "受天气影响" },
    "movie-night-watch-chat": { title: "电影夜 — 观看 + 聊天", category: "室内", people: "2–4 位成员", description: "先看电影，之后如果感觉合适再轻松聊天。", tone: "安静", weather: "有室内备用" },
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
    "movie-night-watch-chat": { title: "映画ナイト — 観る + 話す", category: "屋内", people: "2–4人", description: "まず映画を観て、よければ後で少し話します。", tone: "静か", weather: "屋内の予備案あり" },
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
    "movie-night-watch-chat": { title: "영화 밤 — 보기 + 대화", category: "실내", people: "2–4명", description: "먼저 영화를 보고, 괜찮으면 이후에 가볍게 대화해요.", tone: "조용함", weather: "실내 대안 있음" },
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
    "movie-night-watch-chat": {
      title: "ערב סרט — צפייה + צ'אט",
      category: "פנים",
      people: "2–4 אנשים",
      description: "צופים קודם, וצ'אט קליל אחר כך אם זה מרגיש נכון.",
      tone: "שקט",
      weather: "חלופה מקורה מוכנה",
    },
    "board-games-coffee": {
      title: "משחקי קופסה + קפה",
      category: "פנים",
      people: "3–5 אנשים",
      description: "משחקים פשוטים, שתייה חמה ופתיחות שיחה קלילות.",
      tone: "מאוזן",
      weather: "ידידותי לגשם",
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

function Pill({ label, active, isDay, density = "Comfortable", onPress, accessibilityLabel }: { label: string; active?: boolean; isDay?: boolean; density?: HomeLayoutDensity; onPress: () => void; accessibilityLabel?: string }) {
  const layoutPreset = getHomeLayoutPreset(density);

  return (
    <TouchableOpacity
      activeOpacity={0.78}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(active) }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[
        styles.pill,
        { height: layoutPreset.smallActionMinHeight, paddingHorizontal: layoutPreset.chipPaddingHorizontal, borderRadius: layoutPreset.smallActionMinHeight / 2 },
        active && styles.pillActive,
        isDay && styles.dayPill,
        isDay && active && styles.dayPillActive,
      ]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive, isDay && styles.dayPillText, isDay && active && styles.dayPillTextActive, ]}>{active ? "✓ " : ""}{label}</Text>
    </TouchableOpacity>
  );
}

const getSocialPaceLabel = (tone: string) => {
  if (tone === "Quiet") return "Low chat";
  if (tone === "Balanced") return "Easy pace";
  if (tone === "Lively") return "Chatty";
  return tone;
};

const eventMapDetails: Record<string, { suburb: string; x: number; y: number; roads: string[] }> = {
  "picnic-easy-hangout": { suburb: "Lane Cove", x: 54, y: 48, roads: ["Delhi Rd", "River Ave", "Parklands Ave"] },
  "beach-day-chill-vibes": { suburb: "Palm Beach", x: 70, y: 20, roads: ["Barrenjoey Rd", "Ocean Rd", "Pittwater Rd"] },
  "library-calm-study": { suburb: "Chatswood", x: 48, y: 40, roads: ["Victoria Ave", "Archer St", "Pacific Hwy"] },
  "coffee-lane-cove": { suburb: "Lane Cove", x: 40, y: 52, roads: ["Longueville Rd", "Pacific Hwy", "Epping Rd"] },
  "harbour-walk-waverton": { suburb: "Waverton", x: 36, y: 68, roads: ["Bay Rd", "Balls Head Rd", "Harbour foreshore"] },
  "movie-night-watch-chat": { suburb: "Macquarie Park", x: 62, y: 36, roads: ["Herring Rd", "Waterloo Rd", "M2"] },
  "board-games-coffee": { suburb: "Chatswood", x: 50, y: 42, roads: ["Victoria Ave", "Anderson St", "Pacific Hwy"] },
  "ramen-small-table": { suburb: "Crows Nest", x: 42, y: 62, roads: ["Willoughby Rd", "Falcon St", "Pacific Hwy"] },
  "quiet-music-listening": { suburb: "North Sydney", x: 44, y: 70, roads: ["Miller St", "Pacific Hwy", "Walker St"] },
};

const getNoiseTagLabel = (label: string) => (label === "Balanced" ? "Moderate sound" : `${label} sound`);

const getEventPeopleRange = (people: string) => {
  const [first = 0, second = first] = people.match(/\d+/g)?.map(Number) ?? [];
  return { min: first, max: second };
};

const getGroupSizePreferenceScore = (event: EventItem, preference: GroupSizePreference) => {
  const range = getEventPeopleRange(event.people);

  if (preference === "Flexible") return 0;
  if (preference === "1:1") return range.max <= 2 ? 3 : range.max <= 3 ? 1 : -2;
  if (preference === "2-3 people") return range.max <= 3 && range.min <= 3 ? 3 : range.max <= 4 ? 1 : -1;
  if (preference === "4-6 people") return range.max >= 4 && range.max <= 6 ? 3 : range.max <= 3 ? 0 : -1;
  return range.max <= 4 ? 3 : range.max <= 6 ? 1 : -2;
};

const getSocialEnergyPreferenceScore = (event: EventItem, preference: SocialEnergyPreference) => {
  if (preference === "Calm") return event.noiseLevel === "Quiet" || event.tone === "Quiet" ? 3 : event.noiseLevel === "Balanced" ? 1 : -2;
  if (preference === "Balanced") return event.noiseLevel === "Balanced" || event.tone === "Balanced" ? 3 : 1;
  if (preference === "Social") return event.tone === "Balanced" || event.noiseLevel === "Balanced" ? 3 : event.tone === "Lively" ? 2 : 0;
  return event.tone === "Lively" || event.noiseLevel === "Lively" ? 3 : event.noiseLevel === "Balanced" ? 1 : -1;
};

const getTrustFoundationEventChips = (event: EventItem, socialEnergyPreference: SocialEnergyPreference, groupSizePreference: GroupSizePreference, verifiedButPrivate: boolean) => {
  const chips: string[] = [];
  const range = getEventPeopleRange(event.people);

  if (groupSizePreference !== "Flexible" && range.max <= 4) chips.push("Small group");
  if (socialEnergyPreference === "Calm" && (event.noiseLevel === "Quiet" || event.tone === "Quiet")) chips.push("Calm vibe");
  if (event.tone === "Quiet") chips.push("Low chat");
  if (verifiedButPrivate) chips.push("Verified/private friendly");

  return chips.filter((chip, index, all) => all.indexOf(chip) === index).slice(0, 2);
};

const getMediaComfortEventChip = (event: EventItem, photoRecordingComfortPreferences: PhotoRecordingComfortPreference[]) => {
  const eventLabels = event.mediaComfortLabels ?? ["Ask before photos"];

  if (photoRecordingComfortPreferences.includes("No videos please") || eventLabels.includes("No filming")) return "No filming";
  if (photoRecordingComfortPreferences.includes("No photos of me") || photoRecordingComfortPreferences.includes("Ask me first")) return "Ask before photos";
  if (photoRecordingComfortPreferences.includes("Group photos are okay")) return "Group photos by consent";
  if (photoRecordingComfortPreferences.includes("Venue/event photos are okay")) return "Venue photos okay";
  if (photoRecordingComfortPreferences.includes("No public posting without permission") || eventLabels.includes("No public posting")) return "No public posting";
  if (photoRecordingComfortPreferences.includes("Prefer no screenshots of chats/profile")) return "No screenshots";

  return eventLabels[0];
};

function EventTag({ icon, label, density = "Comfortable", isDay, isRtl }: { icon: "pace" | "volume" | "volume.off" | "weather" | "visibility" | "food" | "interests"; label: string; density?: HomeLayoutDensity; isDay?: boolean; isRtl?: boolean }) {
  const layoutPreset = getHomeLayoutPreset(density);

  return (
    <View
      style={[
        styles.eventTag,
        { gap: Math.max(4, layoutPreset.chipGap - 3), paddingHorizontal: Math.max(7, layoutPreset.chipPaddingHorizontal - 3), paddingVertical: Math.max(3, layoutPreset.chipPaddingVertical - 3) },
        isDay && styles.dayEventTag,
        isRtl && styles.rtlRow,
      ]}
    >
      <IconSymbol name={icon} color={isDay ? "#53677A" : nsnColors.muted} size={12} />
      <Text style={[styles.eventTagText, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{label}</Text>
    </View>
  );
}

function LayoutPreviewIcon({ layout, active, isDay }: { layout: HomeCardLayout; active?: boolean; isDay?: boolean }) {
  const blockStyle = [styles.layoutPreviewBlock, isDay && styles.dayLayoutPreviewBlock, active && styles.layoutPreviewBlockActive];
  const lineStyle = [styles.layoutPreviewLine, active && styles.layoutPreviewLineActive];

  if (layout === "Vertical list") {
    return (
      <View style={styles.layoutPreviewCanvas} accessible={false}>
        {[0, 1, 2].map((item) => (
          <View key={item} style={styles.layoutPreviewListRow}>
            <View style={[styles.layoutPreviewDot, active && styles.layoutPreviewDotActive]} />
            <View style={lineStyle} />
          </View>
        ))}
      </View>
    );
  }

  if (layout === "Horizontal cards") {
    return (
      <View style={[styles.layoutPreviewCanvas, styles.layoutPreviewHorizontal]} accessible={false}>
        {[0, 1, 2].map((item) => <View key={item} style={[...blockStyle, styles.layoutPreviewTallBlock]} />)}
      </View>
    );
  }

  if (layout === "Boxed grid") {
    return (
      <View style={[styles.layoutPreviewCanvas, styles.layoutPreviewGrid]} accessible={false}>
        {[0, 1, 2, 3].map((item) => <View key={item} style={[...blockStyle, styles.layoutPreviewGridBlock]} />)}
      </View>
    );
  }

  if (layout === "Layered cards") {
    return (
      <View style={[styles.layoutPreviewCanvas, styles.layoutPreviewLayered]} accessible={false}>
        <View style={[...blockStyle, styles.layoutPreviewLayer, styles.layoutPreviewLayerBack]} />
        <View style={[...blockStyle, styles.layoutPreviewLayer, styles.layoutPreviewLayerMiddle]} />
        <View style={[...blockStyle, styles.layoutPreviewLayer, styles.layoutPreviewLayerFront]} />
      </View>
    );
  }

  return (
    <View style={[styles.layoutPreviewCanvas, styles.layoutPreviewMagazine]} accessible={false}>
      <View style={[...blockStyle, styles.layoutPreviewMagazineLead]} />
      <View style={[...blockStyle, styles.layoutPreviewMagazineSide]} />
    </View>
  );
}

function getPrototypeSceneKind(event: EventItem) {
  if (event.id.includes("picnic")) return "picnic";
  if (event.id.includes("beach")) return "beach";
  if (event.id.includes("movie")) return "movie";
  if (event.id.includes("board") || event.id.includes("coffee")) return "cafe";
  return "local";
}

function EventPrototypeScene({ event, place, isDay }: { event: EventItem; place?: string; isDay?: boolean }) {
  const kind = getPrototypeSceneKind(event);
  const sceneStyle =
    kind === "picnic"
      ? styles.prototypePicnicScene
      : kind === "beach"
        ? styles.prototypeBeachScene
        : kind === "movie"
          ? styles.prototypeMovieScene
          : kind === "cafe"
            ? styles.prototypeCafeScene
            : styles.prototypeLocalScene;

  return (
    <View style={[styles.prototypeEventScene, sceneStyle, isDay && styles.dayPrototypeEventSceneFrame]} accessible={false}>
      {kind === "picnic" ? (
        <>
          <View style={styles.prototypeSceneSky} />
          <View style={styles.prototypePicnicGrass} />
          <View style={styles.prototypePicnicBlanket} />
          <View style={[styles.prototypePerson, styles.prototypePicnicPersonOne]} />
          <View style={[styles.prototypePerson, styles.prototypePicnicPersonTwo]} />
          <View style={styles.prototypePicnicBasket} />
        </>
      ) : null}
      {kind === "beach" ? (
        <>
          <View style={styles.prototypeBeachSky} />
          <View style={styles.prototypeBeachWater} />
          <View style={styles.prototypeBeachSand} />
          <View style={styles.prototypeBeachSun} />
          <View style={[styles.prototypeBeachUmbrella, styles.prototypeBeachUmbrellaTop]} />
          <View style={[styles.prototypeBeachUmbrella, styles.prototypeBeachUmbrellaStem]} />
        </>
      ) : null}
      {kind === "movie" ? (
        <>
          <View style={styles.prototypeMovieWall} />
          <View style={styles.prototypeMovieScreen} />
          <View style={[styles.prototypeMovieSeatRow, styles.prototypeMovieSeatRowBack]} />
          <View style={[styles.prototypeMovieSeatRow, styles.prototypeMovieSeatRowFront]} />
          <View style={styles.prototypeMovieGlow} />
        </>
      ) : null}
      {kind === "cafe" ? (
        <>
          <View style={styles.prototypeCafeTable} />
          <View style={styles.prototypeCafeMug} />
          <View style={styles.prototypeCafeMugHandle} />
          <View style={styles.prototypeCafeBoard} />
          {[0, 1, 2, 3].map((tile) => (
            <View key={tile} style={[styles.prototypeCafeTile, tile % 2 === 0 && styles.prototypeCafeTileAlt, { left: 18 + tile * 10 }]} />
          ))}
        </>
      ) : null}
      {kind === "local" ? (
        <>
          <View style={styles.prototypeLocalGlow} />
          <Text style={styles.prototypeLocalEmoji}>{event.emoji}</Text>
        </>
      ) : null}
      <View style={styles.prototypeEventSceneLabel}>
        <Text style={styles.prototypeEventSceneLabelText} numberOfLines={1}>{place ?? event.venue}</Text>
      </View>
    </View>
  );
}

function EventCard({ event, isDay, appLanguageBase, locale, timeFormatPreference, density, cardLayout, visualMode, cardOutlineStyle, socialEnergyPreference, groupSizePreference, photoRecordingComfortPreferences, foodBeveragePreferenceIds, interestPreferenceIds, interestComfortTagsByInterest, verifiedButPrivate, featured, highlighted, onHighlight }: { event: EventItem; isDay?: boolean; appLanguageBase: string; locale: string; timeFormatPreference: ReturnType<typeof useAppSettings>["timeFormatPreference"]; density: HomeLayoutDensity; cardLayout: HomeCardLayout; visualMode: HomeEventVisualMode; cardOutlineStyle: CardOutlineStyle; socialEnergyPreference: SocialEnergyPreference; groupSizePreference: GroupSizePreference; photoRecordingComfortPreferences: PhotoRecordingComfortPreference[]; foodBeveragePreferenceIds: string[]; interestPreferenceIds: string[]; interestComfortTagsByInterest: Record<string, string[]>; verifiedButPrivate: boolean; featured?: boolean; highlighted?: boolean; onHighlight?: (eventId: string) => void }) {
  const router = useRouter();
  const isRtl = rtlLanguages.has(appLanguageBase);
  const localizedEvent = { ...event, ...(eventTranslations[appLanguageBase]?.[event.id] ?? {}) };
  const noiseCopy = noiseGuideTranslations[appLanguageBase as keyof typeof noiseGuideTranslations] ?? noiseGuideTranslations.English;
  const eventNoise = noiseCopy.levels[event.noiseLevel];
  const livePreview = eventLivePreviews[event.id];
  const isCompactLayout = cardLayout === "Horizontal cards" || cardLayout === "Boxed grid";
  const layoutPreset = getHomeLayoutPreset(density);
  const shouldUsePreviewImage = visualMode === "Preview image" && Boolean(livePreview?.photo);
  const shouldUsePrototypeFallback = visualMode === "Preview image" && !livePreview?.photo;
  const eventTime = formatEventTimeLabel(event.time, { locale, timeFormatPreference });
  const trustFoundationChips = getTrustFoundationEventChips(event, socialEnergyPreference, groupSizePreference, verifiedButPrivate);
  const mediaComfortChip = getMediaComfortEventChip(event, photoRecordingComfortPreferences);
  const foodPreferenceChips = getEventFoodPreferenceMatches(event, foodBeveragePreferenceIds, 2);
  const interestPreferenceChips = getEventInterestPreferenceMatches(event, interestPreferenceIds, interestComfortTagsByInterest, 2);
  const eventOutlineStyle =
    cardOutlineStyle === "Minimal"
      ? styles.eventCardOutlineMinimal
      : cardOutlineStyle === "Standard"
        ? styles.eventCardOutlineStandard
        : styles.eventCardOutlineStrong;
  const dayEventOutlineStyle =
    cardOutlineStyle === "Minimal"
      ? styles.dayEventCardOutlineMinimal
      : cardOutlineStyle === "Standard"
        ? styles.dayEventCardOutlineStandard
        : styles.dayEventCardOutlineStrong;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => {
        onHighlight?.(event.id);
        router.push(`/event/${event.id}`);
      }}
      onPressIn={() => onHighlight?.(event.id)}
      accessibilityRole="button"
      accessibilityState={{ selected: highlighted }}
      accessibilityLabel={`Open meetup ${localizedEvent.title}`}
      style={[
        styles.eventCard,
        density === "Compact" && styles.eventCardCompact,
        density === "Spacious" && styles.eventCardSpacious,
        { borderRadius: layoutPreset.cardRadius - 2, minHeight: layoutPreset.eventCardMinHeight, padding: layoutPreset.eventCardPadding },
        cardLayout === "Horizontal cards" && styles.eventCardHorizontal,
        cardLayout === "Boxed grid" && styles.eventCardGrid,
        cardLayout === "Magazine" && styles.eventCardMagazine,
        cardLayout === "Magazine" && featured && styles.eventCardMagazineFeatured,
        isDay ? styles.dayCard : null,
        eventOutlineStyle,
        isDay && dayEventOutlineStyle,
        cardLayout === "Layered cards" && styles.eventCardLayered,
        highlighted && styles.eventCardHighlighted,
        highlighted && isDay && styles.dayEventCardHighlighted,
        isRtl && !isCompactLayout && styles.rtlEventCard,
      ]}
    >
      <View style={[
        styles.eventImage,
        shouldUsePreviewImage && styles.eventImagePhoto,
        density === "Compact" && styles.eventImageCompact,
        density === "Spacious" && styles.eventImageSpacious,
        { width: layoutPreset.eventImageWidth, minHeight: layoutPreset.eventImageHeight, borderRadius: Math.max(12, layoutPreset.cardRadius - 6) },
        isCompactLayout && styles.eventImageWide,
        cardLayout === "Magazine" && featured && styles.eventImageMagazineFeatured,
        { backgroundColor: event.imageTone },
      ]}>
        {shouldUsePreviewImage && livePreview ? (
          <>
            <Image source={livePreview.photo} resizeMode="cover" style={styles.eventPreviewPhoto} />
            <View style={styles.eventPreviewOverlay}>
              <Text style={styles.eventPreviewPlace} numberOfLines={1}>{livePreview.place}</Text>
            </View>
          </>
        ) : shouldUsePrototypeFallback ? (
          <EventPrototypeScene event={event} place={livePreview?.place} isDay={isDay} />
        ) : (
          <Text style={[styles.eventEmoji, density === "Compact" && styles.eventEmojiCompact]}>{event.emoji}</Text>
        )}
      </View>
      <View style={[styles.eventBody, isCompactLayout && styles.eventBodyStacked]}>
        <View style={[styles.eventTopLine, isRtl && styles.rtlRow]}>
          <View style={[styles.smallTag, isDay ? styles.daySmallTag : null, ]}>
            <Text style={[styles.smallTagText, isDay ? styles.daySmallTagText : null, isRtl && styles.rtlText]}>{localizedEvent.category}</Text>
          </View>
          <Text style={[styles.eventTitle, isDay ? styles.dayHeadingText : null, isRtl && styles.rtlText]} numberOfLines={1}>{localizedEvent.title}</Text>
        </View>
        <View style={[styles.eventMetaRow, isRtl && styles.rtlRow]}>
          <IconSymbol name="location" color={isDay ? "#53677A" : nsnColors.muted} size={12} />
          <Text style={[styles.eventMeta, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{event.venue}</Text>
        </View>
        <View style={[styles.eventMetaRow, isRtl && styles.rtlRow]}>
          <IconSymbol name="group" color={isDay ? "#53677A" : nsnColors.muted} size={12} />
          <Text style={[styles.eventMeta, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{localizedEvent.people}{"  \u00B7  "}{eventTime}</Text>
        </View>
        <Text style={[styles.eventDescription, isDay ? styles.dayText : null, isRtl && styles.rtlText]} numberOfLines={layoutPreset.eventDescriptionLines}>{localizedEvent.description}</Text>
        <View style={[styles.eventTags, { gap: layoutPreset.chipGap, marginTop: density === "Compact" ? 5 : density === "Spacious" ? 9 : 7 }, density === "Compact" && styles.eventTagsCompact, isRtl && styles.rtlRow]}>
          <EventTag icon="pace" label={`Pace: ${getSocialPaceLabel(localizedEvent.tone)}`} density={density} isDay={isDay} isRtl={isRtl} />
          <EventTag icon={event.noiseLevel === "Quiet" ? "volume.off" : "volume"} label={getNoiseTagLabel(eventNoise.label)} density={density} isDay={isDay} isRtl={isRtl} />
          <EventTag icon="weather" label={localizedEvent.weather} density={density} isDay={isDay} isRtl={isRtl} />
          {trustFoundationChips.map((chip) => (
            <EventTag key={chip} icon="pace" label={chip} density={density} isDay={isDay} isRtl={isRtl} />
          ))}
          {foodPreferenceChips.map((chip) => (
            <EventTag key={`food-${chip}`} icon="food" label={chip} density={density} isDay={isDay} isRtl={isRtl} />
          ))}
          {interestPreferenceChips.map((chip) => (
            <EventTag key={`interest-${chip}`} icon="interests" label={chip} density={density} isDay={isDay} isRtl={isRtl} />
          ))}
          <EventTag icon="visibility" label={mediaComfortChip} density={density} isDay={isDay} isRtl={isRtl} />
        </View>
      </View>
      <View style={styles.cardArrow}>
        <IconSymbol name={isRtl ? "chevron.left" : "chevron.right"} color={isDay ? "#53677A" : nsnColors.muted} size={26} />
      </View>
    </TouchableOpacity>
  );
}

const homeTranslations = {
  English: {
    subtitle: "Low-pressure meetups around the North Shore.",
    day: "Day ☀️",
    night: "Night 🌙",
    morning: "🌅 Good morning",
    afternoon: "☀️ Good afternoon",
    evening: "🌙 Good evening",
    change: "Change",
    weatherUpdate: "Weather update",
    loadingWeather: (city: string) => `Loading ${city} weather...`,
    rainLikely: (city: string, temp: number) => `☔ Rain likely today • ${city} ${temp}°C • Indoor alternatives recommended.`,
    slightRain: (city: string, temp: number) => `🌦️ Slight rain possible • ${city} ${temp}°C • We'll keep you updated.`,
    warmDay: (city: string, temp: number) => `☀️ Warm day • ${city} ${temp}°C • Great for outdoor meetups.`,
    goodWeather: (city: string, temp: number, rain: number) => `🌤️ Good meetup weather • ${city} ${temp}°C • Rain chance ${rain}%.`,
    filters: ["All", "Outdoor", "Indoor", "Food", "Active"],
    dayEvents: "☀️ Day Events",
    eveningEvents: "🌙 Evening Events",
    seeAll: "View preferences",
    hideHidden: "Hide hidden",
    createMeetup: "Create a Meetup",
    dayVsNight: "Day vs Night",
    dayVsNightCopy: "Find the right vibe at the right time.",
    weatherAdaptive: "Weather Adaptive",
    weatherAdaptiveCopy: "We suggest indoor alternatives if plans change.",
    clickForMore: "Click here for more info...",
    dayVsNightMore: "Day events are brighter and activity-friendly. Night events lean calmer, indoors, and easier to leave when your social battery is low.",
    weatherAdaptiveMore: "Outdoor events can carry backup plans. If rain or heat gets in the way, NSN can suggest indoor alternatives before you commit.",
    searchEvents: "Search events",
    searchEventsCopy: "Search events by suburb, activity, time, group size, or vibe.",
    searchEventsHint: "Shows a temporary search options message.",
    changeEventView: "Change event view and filters",
    changeEventViewCopy: "Choose how events are shown: compact view, comfortable view, nearby, small groups only, weather-safe, or map/list view.",
    changeEventViewHint: "Shows a temporary view and filter options message.",
    dismissMessage: "Dismiss message",
    ok: "OK",
    eveningSuggestion: "Evening suggestion",
    eveningSuggestionCopy: "It looks like evening where you are. Switch to Night mode?",
    daytimeSuggestion: "Daytime suggestion",
    daytimeSuggestionCopy: "It looks like daytime where you are. Switch to Day mode?",
    switch: "Switch",
    switchToNightMode: "Switch to Night mode",
    switchToDayMode: "Switch to Day mode",
    dismissThemeSuggestion: "Dismiss theme suggestion",
    notNow: "Not now",
  },
  Arabic: {
    subtitle: "لقاءات بلا ضغط حول نورث شور.",
    day: "نهار ☀️",
    night: "ليل 🌙",
    morning: "🌅 صباح الخير",
    afternoon: "☀️ مساء الخير",
    evening: "🌙 مساء هادئ",
    change: "تغيير",
    weatherUpdate: "تحديث الطقس",
    loadingWeather: (city: string) => `جارٍ تحميل طقس ${city}...`,
    rainLikely: (city: string, temp: number) => `☔ المطر محتمل اليوم • ${city} ${temp}°C • نوصي ببدائل داخلية.`,
    slightRain: (city: string, temp: number) => `🌦️ احتمال مطر خفيف • ${city} ${temp}°C • سنبقيك على اطلاع.`,
    warmDay: (city: string, temp: number) => `☀️ يوم دافئ • ${city} ${temp}°C • مناسب للقاءات الخارجية.`,
    goodWeather: (city: string, temp: number, rain: number) => `🌤️ طقس جيد للقاءات • ${city} ${temp}°C • احتمال المطر ${rain}%.`,
    filters: ["الكل", "خارجي", "داخلي", "طعام", "نشاط"],
    dayEvents: "☀️ فعاليات النهار",
    eveningEvents: "🌙 فعاليات المساء",
    seeAll: "عرض الكل",
    dayVsNight: "نهار أم ليل",
    dayVsNightCopy: "اعثر على الأجواء المناسبة في الوقت المناسب.",
    weatherAdaptive: "يتكيف مع الطقس",
    weatherAdaptiveCopy: "نقترح بدائل داخلية إذا تغيرت الخطط.",
    clickForMore: "اضغط هنا للمزيد...",
    dayVsNightMore: "فعاليات النهار أنشط وأكثر إشراقاً. فعاليات الليل أهدأ وغالباً في الداخل وأسهل للمغادرة عند الحاجة.",
    weatherAdaptiveMore: "يمكن للفعاليات الخارجية أن تتضمن خطة بديلة. إذا تغير الطقس، نقترح خيارات داخلية قبل الالتزام.",
  },
  Chinese: {
    subtitle: "北岸周边的低压力聚会。",
    day: "白天 ☀️",
    night: "夜晚 🌙",
    morning: "🌅 早上好",
    afternoon: "☀️ 下午好",
    evening: "🌙 晚上好",
    change: "更改",
    weatherUpdate: "天气更新",
    loadingWeather: (city: string) => `正在加载 ${city} 天气...`,
    rainLikely: (city: string, temp: number) => `☔ 今天可能下雨 • ${city} ${temp}°C • 建议选择室内替代方案。`,
    slightRain: (city: string, temp: number) => `🌦️ 可能有小雨 • ${city} ${temp}°C • 我们会持续更新。`,
    warmDay: (city: string, temp: number) => `☀️ 温暖的一天 • ${city} ${temp}°C • 很适合户外聚会。`,
    goodWeather: (city: string, temp: number, rain: number) => `🌤️ 适合聚会的天气 • ${city} ${temp}°C • 降雨概率 ${rain}%。`,
    filters: ["全部", "户外", "室内", "美食", "活动"],
    dayEvents: "☀️ 白天活动",
    eveningEvents: "🌙 夜间活动",
    seeAll: "查看全部",
    hideHidden: "隐藏已隐藏",
    createMeetup: "创建聚会",
    dayVsNight: "白天与夜晚",
    dayVsNightCopy: "在合适的时间找到合适的氛围。",
    weatherAdaptive: "适应天气",
    weatherAdaptiveCopy: "如果计划变化，我们会建议室内替代方案。",
    clickForMore: "点击查看更多...",
    dayVsNightMore: "白天活动更明亮、更适合活动。夜晚活动更安静、偏室内，也更容易在社交能量低时离开。",
    weatherAdaptiveMore: "户外活动可以有备用方案。如果下雨或太热，NSN 可以在你确认前建议室内选择。",
    searchEvents: "搜索活动",
    searchEventsCopy: "按郊区、活动、时间、人数或氛围搜索活动。",
    searchEventsHint: "显示临时搜索选项消息。",
    changeEventView: "更改活动视图和筛选",
    changeEventViewCopy: "选择活动显示方式：紧凑视图、舒适视图、附近、小团体优先、天气安全或地图/列表视图。",
    changeEventViewHint: "显示临时视图和筛选选项消息。",
    dismissMessage: "关闭消息",
    ok: "好的",
    eveningSuggestion: "夜晚建议",
    eveningSuggestionCopy: "你所在的位置看起来已到晚上。切换到夜间模式？",
    daytimeSuggestion: "白天建议",
    daytimeSuggestionCopy: "你所在的位置看起来是白天。切换到日间模式？",
    switch: "切换",
    switchToNightMode: "切换到夜间模式",
    switchToDayMode: "切换到日间模式",
    dismissThemeSuggestion: "关闭模式建议",
    notNow: "暂不",
  },
  French: {
    subtitle: "Rencontres sans pression autour de la North Shore.",
    day: "Jour ☀️",
    night: "Nuit 🌙",
    morning: "🌅 Bonjour",
    afternoon: "☀️ Bon après-midi",
    evening: "🌙 Bonsoir",
    change: "Changer",
    weatherUpdate: "Météo",
    loadingWeather: (city: string) => `Chargement de la météo de ${city}...`,
    rainLikely: (city: string, temp: number) => `☔ Pluie probable aujourd'hui • ${city} ${temp}°C • Alternatives intérieures recommandées.`,
    slightRain: (city: string, temp: number) => `🌦️ Petite pluie possible • ${city} ${temp}°C • Nous vous tiendrons au courant.`,
    warmDay: (city: string, temp: number) => `☀️ Journée chaude • ${city} ${temp}°C • Idéal pour des rencontres dehors.`,
    goodWeather: (city: string, temp: number, rain: number) => `🌤️ Bonne météo pour rencontrer • ${city} ${temp}°C • Risque de pluie ${rain}%.`,
    filters: ["Tout", "Extérieur", "Intérieur", "Repas", "Actif"],
    dayEvents: "☀️ Événements de jour",
    eveningEvents: "🌙 Événements du soir",
    seeAll: "Tout voir",
    dayVsNight: "Jour ou nuit",
    dayVsNightCopy: "Trouvez la bonne ambiance au bon moment.",
    weatherAdaptive: "Adapté à la météo",
    weatherAdaptiveCopy: "Nous suggérons des alternatives intérieures si les plans changent.",
    clickForMore: "Cliquez pour plus d'infos...",
    dayVsNightMore: "Les événements de jour sont plus lumineux et actifs. Les événements du soir sont plus calmes, souvent intérieurs, et plus faciles à quitter quand l'énergie sociale baisse.",
    weatherAdaptiveMore: "Les événements extérieurs peuvent avoir un plan de secours. Si pluie ou chaleur gênent, NSN peut suggérer des alternatives intérieures avant votre engagement.",
  },
  German: {
    subtitle: "Treffen ohne Druck rund um die North Shore.",
    day: "Tag ☀️",
    night: "Nacht 🌙",
    morning: "🌅 Guten Morgen",
    afternoon: "☀️ Guten Tag",
    evening: "🌙 Guten Abend",
    change: "Ändern",
    weatherUpdate: "Wetter-Update",
    loadingWeather: (city: string) => `${city}-Wetter wird geladen...`,
    rainLikely: (city: string, temp: number) => `☔ Heute wahrscheinlich Regen • ${city} ${temp}°C • Innenalternativen empfohlen.`,
    slightRain: (city: string, temp: number) => `🌦️ Leichter Regen möglich • ${city} ${temp}°C • Wir halten dich auf dem Laufenden.`,
    warmDay: (city: string, temp: number) => `☀️ Warmer Tag • ${city} ${temp}°C • Gut für Treffen draußen.`,
    goodWeather: (city: string, temp: number, rain: number) => `🌤️ Gutes Treffen-Wetter • ${city} ${temp}°C • Regenchance ${rain}%.`,
    filters: ["Alle", "Draußen", "Drinnen", "Essen", "Aktiv"],
    dayEvents: "☀️ Tages-Events",
    eveningEvents: "🌙 Abend-Events",
    seeAll: "Alle ansehen",
    dayVsNight: "Tag und Nacht",
    dayVsNightCopy: "Finde die passende Stimmung zur passenden Zeit.",
    weatherAdaptive: "Wetterangepasst",
    weatherAdaptiveCopy: "Wir schlagen Innenalternativen vor, wenn sich Pläne ändern.",
    clickForMore: "Mehr Infos...",
    dayVsNightMore: "Tages-Events sind heller und aktiver. Abend-Events sind ruhiger, eher drinnen und leichter zu verlassen, wenn deine soziale Energie niedrig ist.",
    weatherAdaptiveMore: "Outdoor-Events können Backup-Pläne haben. Bei Regen oder Hitze kann NSN Innenalternativen vorschlagen, bevor du zusagst.",
  },
  Hebrew: {
    subtitle: "מפגשים בלי לחץ באזור החוף הצפוני.",
    day: "יום ☀️",
    night: "לילה 🌙",
    morning: "🌅 בוקר טוב",
    afternoon: "☀️ צהריים טובים",
    evening: "🌙 ערב טוב",
    change: "שנה",
    weatherUpdate: "עדכון מזג אוויר",
    loadingWeather: (city: string) => `טוען מזג אוויר עבור ${city}...`,
    rainLikely: (city: string, temp: number) => `☔ סביר גשם היום • ${city} ${temp}°C • מומלצות חלופות מקורות.`,
    slightRain: (city: string, temp: number) => `🌦️ ייתכן גשם קל • ${city} ${temp}°C • נעדכן אותך.`,
    warmDay: (city: string, temp: number) => `☀️ יום חמים • ${city} ${temp}°C • נהדר למפגשים בחוץ.`,
    goodWeather: (city: string, temp: number, rain: number) => `🌤️ מזג אוויר טוב למפגש • ${city} ${temp}°C • סיכוי לגשם ${rain}%.`,
    filters: ["הכל", "חוץ", "פנים", "אוכל", "פעיל"],
    dayEvents: "☀️ אירועי יום",
    eveningEvents: "🌙 אירועי ערב",
    seeAll: "הצג הכל",
    hideHidden: "הסתר מוסתרים",
    createMeetup: "יצירת מפגש",
    dayVsNight: "יום מול לילה",
    dayVsNightCopy: "מצא את הווייב הנכון בזמן הנכון.",
    weatherAdaptive: "מותאם למזג האוויר",
    weatherAdaptiveCopy: "נציע חלופות מקורות אם התוכניות משתנות.",
    clickForMore: "לחצו כאן למידע נוסף...",
    dayVsNightMore: "אירועי יום מתאימים יותר לפעילות ולאור. אירועי לילה רגועים יותר, לרוב בפנים, וקלים יותר לעזיבה כשנגמרת האנרגיה החברתית.",
    weatherAdaptiveMore: "לאירועים בחוץ יכולה להיות תוכנית גיבוי. אם גשם או חום מפריעים, NSN יכול להציע חלופות מקורות לפני שמתחייבים.",
  },
  Japanese: {
    subtitle: "North Shore 周辺の低プレッシャーなミートアップ。",
    day: "昼 ☀️",
    night: "夜 🌙",
    morning: "🌅 おはようございます",
    afternoon: "☀️ こんにちは",
    evening: "🌙 こんばんは",
    change: "変更",
    weatherUpdate: "天気の更新",
    loadingWeather: (city: string) => `${city} の天気を読み込み中...`,
    rainLikely: (city: string, temp: number) => `☔ 今日は雨の可能性 • ${city} ${temp}°C • 屋内の代替案がおすすめです。`,
    slightRain: (city: string, temp: number) => `🌦️ 小雨の可能性 • ${city} ${temp}°C • 更新をお知らせします。`,
    warmDay: (city: string, temp: number) => `☀️ 暖かい日 • ${city} ${temp}°C • 屋外ミートアップに向いています。`,
    goodWeather: (city: string, temp: number, rain: number) => `🌤️ ミートアップ日和 • ${city} ${temp}°C • 降雨確率 ${rain}%。`,
    filters: ["すべて", "屋外", "屋内", "食事", "アクティブ"],
    dayEvents: "☀️ 昼のイベント",
    eveningEvents: "🌙 夜のイベント",
    seeAll: "すべて見る",
    hideHidden: "非表示を隠す",
    createMeetup: "ミートアップを作成",
    dayVsNight: "昼と夜",
    dayVsNightCopy: "ちょうどよい時間に、ちょうどよい雰囲気を。",
    weatherAdaptive: "天気に対応",
    weatherAdaptiveCopy: "予定が変わる場合は屋内の代替案を提案します。",
    clickForMore: "詳しく見る...",
    dayVsNightMore: "昼のイベントは明るく活動向きです。夜のイベントはより落ち着き、屋内寄りで、社交エネルギーが低い時にも離れやすいです。",
    weatherAdaptiveMore: "屋外イベントにはバックアップ案を持たせられます。雨や暑さが気になる場合、参加前に屋内案を提案できます。",
    searchEvents: "イベントを検索",
    searchEventsCopy: "郊外、活動、時間、人数、雰囲気でイベントを検索できます。",
    searchEventsHint: "一時的な検索オプションメッセージを表示します。",
    changeEventView: "イベント表示とフィルターを変更",
    changeEventViewCopy: "コンパクト表示、ゆったり表示、近く、小人数のみ、天気対応、地図/リスト表示を選べます。",
    changeEventViewHint: "一時的な表示・フィルターオプションメッセージを表示します。",
    dismissMessage: "メッセージを閉じる",
    ok: "了解",
    eveningSuggestion: "夜の提案",
    eveningSuggestionCopy: "現在地は夜の時間帯のようです。夜モードに切り替えますか？",
    daytimeSuggestion: "昼の提案",
    daytimeSuggestionCopy: "現在地は昼の時間帯のようです。昼モードに切り替えますか？",
    switch: "切り替え",
    switchToNightMode: "夜モードに切り替え",
    switchToDayMode: "昼モードに切り替え",
    dismissThemeSuggestion: "モード提案を閉じる",
    notNow: "今はしない",
  },
  Korean: {
    subtitle: "노스쇼어 주변의 부담 없는 모임.",
    day: "낮 ☀️",
    night: "밤 🌙",
    morning: "🌅 좋은 아침",
    afternoon: "☀️ 좋은 오후",
    evening: "🌙 좋은 저녁",
    change: "변경",
    weatherUpdate: "날씨 업데이트",
    loadingWeather: (city: string) => `${city} 날씨를 불러오는 중...`,
    rainLikely: (city: string, temp: number) => `☔ 오늘 비 가능성 • ${city} ${temp}°C • 실내 대안을 추천해요.`,
    slightRain: (city: string, temp: number) => `🌦️ 약한 비 가능성 • ${city} ${temp}°C • 계속 알려드릴게요.`,
    warmDay: (city: string, temp: number) => `☀️ 따뜻한 날 • ${city} ${temp}°C • 야외 모임에 좋아요.`,
    goodWeather: (city: string, temp: number, rain: number) => `🌤️ 모임하기 좋은 날씨 • ${city} ${temp}°C • 비 확률 ${rain}%.`,
    filters: ["전체", "야외", "실내", "음식", "활동"],
    dayEvents: "☀️ 낮 이벤트",
    eveningEvents: "🌙 저녁 이벤트",
    seeAll: "모두 보기",
    hideHidden: "숨긴 항목 숨기기",
    createMeetup: "모임 만들기",
    dayVsNight: "낮과 밤",
    dayVsNightCopy: "맞는 시간에 맞는 분위기를 찾아요.",
    weatherAdaptive: "날씨에 맞춤",
    weatherAdaptiveCopy: "계획이 바뀌면 실내 대안을 제안해요.",
    clickForMore: "더 보기...",
    dayVsNightMore: "낮 이벤트는 더 밝고 활동적이에요. 밤 이벤트는 더 차분하고 실내 중심이며, 사회적 에너지가 낮을 때 떠나기 쉬워요.",
    weatherAdaptiveMore: "야외 이벤트에는 백업 계획을 둘 수 있어요. 비나 더위가 방해되면 참여 전에 실내 대안을 제안할 수 있어요.",
    searchEvents: "이벤트 검색",
    searchEventsCopy: "교외, 활동, 시간, 그룹 크기 또는 분위기로 이벤트를 검색하세요.",
    searchEventsHint: "임시 검색 옵션 메시지를 표시합니다.",
    changeEventView: "이벤트 보기 및 필터 변경",
    changeEventViewCopy: "컴팩트 보기, 편안한 보기, 근처, 소규모만, 날씨 안전, 지도/목록 보기를 선택하세요.",
    changeEventViewHint: "임시 보기 및 필터 옵션 메시지를 표시합니다.",
    dismissMessage: "메시지 닫기",
    ok: "확인",
    eveningSuggestion: "저녁 제안",
    eveningSuggestionCopy: "현재 위치가 저녁 시간처럼 보여요. 밤 모드로 전환할까요?",
    daytimeSuggestion: "낮 제안",
    daytimeSuggestionCopy: "현재 위치가 낮 시간처럼 보여요. 낮 모드로 전환할까요?",
    switch: "전환",
    switchToNightMode: "밤 모드로 전환",
    switchToDayMode: "낮 모드로 전환",
    dismissThemeSuggestion: "모드 제안 닫기",
    notNow: "나중에",
  },
  Russian: {
    subtitle: "Встречи без давления вокруг North Shore.",
    day: "День ☀️",
    night: "Ночь 🌙",
    morning: "🌅 Доброе утро",
    afternoon: "☀️ Добрый день",
    evening: "🌙 Добрый вечер",
    change: "Изменить",
    weatherUpdate: "Погода",
    loadingWeather: (city: string) => `Загружаем погоду для ${city}...`,
    rainLikely: (city: string, temp: number) => `☔ Сегодня вероятен дождь • ${city} ${temp}°C • Рекомендуем варианты в помещении.`,
    slightRain: (city: string, temp: number) => `🌦️ Возможен небольшой дождь • ${city} ${temp}°C • Мы сообщим обновления.`,
    warmDay: (city: string, temp: number) => `☀️ Тёплый день • ${city} ${temp}°C • Отлично для встреч на улице.`,
    goodWeather: (city: string, temp: number, rain: number) => `🌤️ Хорошая погода для встречи • ${city} ${temp}°C • Вероятность дождя ${rain}%.`,
    filters: ["Все", "На улице", "В помещении", "Еда", "Активно"],
    dayEvents: "☀️ Дневные события",
    eveningEvents: "🌙 Вечерние события",
    seeAll: "Все",
    dayVsNight: "День и ночь",
    dayVsNightCopy: "Найдите нужную атмосферу в нужное время.",
    weatherAdaptive: "С учётом погоды",
    weatherAdaptiveCopy: "Мы предложим варианты в помещении, если планы изменятся.",
    clickForMore: "Нажмите, чтобы узнать больше...",
    dayVsNightMore: "Дневные события более активные и светлые. Вечерние обычно спокойнее, чаще в помещении, и из них проще уйти, если устали.",
    weatherAdaptiveMore: "У событий на улице может быть запасной план. Если мешает дождь или жара, NSN предложит варианты в помещении.",
  },
  Spanish: {
    subtitle: "Quedadas sin presión por North Shore.",
    day: "Día ☀️",
    night: "Noche 🌙",
    morning: "🌅 Buenos días",
    afternoon: "☀️ Buenas tardes",
    evening: "🌙 Buenas noches",
    change: "Cambiar",
    weatherUpdate: "Actualización del clima",
    loadingWeather: (city: string) => `Cargando clima de ${city}...`,
    rainLikely: (city: string, temp: number) => `☔ Probable lluvia hoy • ${city} ${temp}°C • Recomendamos alternativas interiores.`,
    slightRain: (city: string, temp: number) => `🌦️ Posible lluvia ligera • ${city} ${temp}°C • Te mantendremos al día.`,
    warmDay: (city: string, temp: number) => `☀️ Día cálido • ${city} ${temp}°C • Genial para quedadas al aire libre.`,
    goodWeather: (city: string, temp: number, rain: number) => `🌤️ Buen clima para quedar • ${city} ${temp}°C • Probabilidad de lluvia ${rain}%.`,
    filters: ["Todo", "Exterior", "Interior", "Comida", "Activo"],
    dayEvents: "☀️ Eventos de día",
    eveningEvents: "🌙 Eventos de noche",
    seeAll: "Ver todo",
    dayVsNight: "Día vs noche",
    dayVsNightCopy: "Encuentra el ambiente correcto en el momento correcto.",
    weatherAdaptive: "Adaptado al clima",
    weatherAdaptiveCopy: "Sugerimos alternativas interiores si cambian los planes.",
    clickForMore: "Haz clic para más información...",
    dayVsNightMore: "Los eventos de día son más luminosos y activos. Los de noche suelen ser más tranquilos, interiores y fáciles de dejar si necesitas descansar.",
    weatherAdaptiveMore: "Los eventos al aire libre pueden tener un plan alternativo. Si llueve o hace mucho calor, NSN puede sugerir opciones interiores.",
  },
} as const;

function NsnLogoMark({ isDay }: { isDay?: boolean }) {
  return (
    <View style={[styles.nsnLogoMark, isDay && styles.dayNsnLogoMark]} accessible={false}>
      <Text style={styles.nsnLogoMoon}>{"\u263E"}</Text>
      <Text style={styles.nsnLogoText}>NSN</Text>
    </View>
  );
}

function HeaderActionButton({
  accessibilityLabel,
  accessibilityHint,
  isDay,
  density = "Comfortable",
  onPress,
  children,
}: {
  accessibilityLabel: string;
  accessibilityHint: string;
  isDay: boolean;
  density?: HomeHeaderControlsDensity;
  onPress: () => void;
  children: ReactNode;
}) {
  if (Platform.OS === "web") {
    const buttonSize = density === "Compact" ? 38 : density === "Spacious" ? 46 : 42;

    return (
      <button
        type="button"
        role="button"
        aria-label={accessibilityLabel}
        title={accessibilityLabel}
        onClick={onPress}
        style={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: isDay ? "#C5D0DA" : "#5F79A9",
          backgroundColor: isDay ? "#F4F7F8" : "#163F8D",
          display: "flex",
          padding: 0,
          cursor: "pointer",
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={[
        styles.headerActionButton,
        density === "Compact" && styles.headerActionButtonCompact,
        density === "Spacious" && styles.headerActionButtonSpacious,
        isDay && styles.dayBellButton,
      ]}
      hitSlop={6}
    >
      {children}
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const { isNightMode, setIsNightMode, timezone, timeContextMode, weather, appLanguage, batterySaver, reduceMotion, slowerTransitions, comfortPreferences, socialEnergyPreference, groupSizePreference, photoRecordingComfortPreferences, foodBeveragePreferenceIds, interestPreferenceIds, interestComfortTagsByInterest, verifiedButPrivate, pinnedEventIds, hiddenEventIds, noiseLevelPreference, homeViewMode, homeNearbyOnly, homeSmallGroupsOnly, homeWeatherSafeOnly, homeEventLayout, homeLayoutDensity, homeHeaderControlsDensity, homeCardLayout, homeEventVisualMode, homeVisibleSections, homeSectionOrder, suggestNightModeInEvenings, timeFormatPreference, clockDisplayStyle, showDigitalTimeWithAnalog, temperatureUnitPreference, dayNightModePreference, cardOutlineStyle, saveSoftHelloMvpState } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = homeTranslations[appLanguageBase as keyof typeof homeTranslations] ?? homeTranslations.English;
  const homeCopy = { ...homeTranslations.English, ...copy };
  const noiseCopy = noiseGuideTranslations[appLanguageBase as keyof typeof noiseGuideTranslations] ?? noiseGuideTranslations.English;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const locale = appLocaleMap[appLanguage] ?? appLocaleMap[appLanguageBase] ?? "en-AU";
  const shouldAutoFitDashboard = viewportWidth >= 900 && viewportHeight <= 820;
  const effectiveHomeLayoutDensity = shouldAutoFitDashboard ? "Compact" : homeLayoutDensity;
  
  const mode = isNightMode ? "night" : "day"; // State
  const [activeFilter, setActiveFilter] = useState<EventFilter>("All");
  const [showHiddenEvents, setShowHiddenEvents] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<"day-night" | "weather" | null>(null);
  const [dismissedThemeSuggestion, setDismissedThemeSuggestion] = useState<"day" | "night" | null>(null);
  const [headerPlaceholder, setHeaderPlaceholder] = useState<{ title: string; copy: string } | null>(null);
  const [openHomePanel, setOpenHomePanel] = useState<HomePanel>("none");
  const [homeUpdateNotice, setHomeUpdateNotice] = useState<string | null>(null);
  const [homeSearchMode, setHomeSearchMode] = useState<HomeSearchMode>("areas");
  const [nsnSearchQuery, setNsnSearchQuery] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [mapZoomLevel, setMapZoomLevel] = useState(0);
  const [mapFocusMode, setMapFocusMode] = useState<"area" | "event">("area");
  const [openHomeAdvancedSettings, setOpenHomeAdvancedSettings] = useState(false);
  const [openHomeLayoutStyles, setOpenHomeLayoutStyles] = useState(false);
  const [activeOptionsSectionId, setActiveOptionsSectionId] = useState<OptionsHubSectionId | null>(null);
  const [activeOptionsDetailId, setActiveOptionsDetailId] = useState<string | null>(null);
  const [selectedFirstMeetupSupport, setSelectedFirstMeetupSupport] = useState<FirstMeetupSupportOption[]>(["No extra support"]);
  const [selectedMeetupQuestion, setSelectedMeetupQuestion] = useState<AskAboutMeetupQuestion | null>(null);
  const showHomeControls = openHomePanel === "filters";
  const showCustomiseHome = openHomePanel === "customize";
  const showNsnSearch = openHomePanel === "search";
  const showLayoutPreferences = openHomePanel === "preferences";
  const showOptionsHub = openHomePanel === "options";
  const shouldLockDashboardScroll = false;
  const lockedDashboardHeight = Math.max(0, viewportHeight - 82);

  const baseEvents = useMemo(() => {
    const hiddenIds = new Set(hiddenEventIds);
    const pinnedIds = new Set(pinnedEventIds);
    const events = prioritizeEventsForComfort(isNightMode ? eveningEvents : dayEvents, comfortPreferences)
      .filter((event) => showHiddenEvents || !hiddenIds.has(event.id))
      .sort((a, b) => Number(pinnedIds.has(b.id)) - Number(pinnedIds.has(a.id)));

    const categoryFilteredEvents = activeFilter === "All"
      ? events
      : events.filter((event) => event.category === activeFilter || event.tags.includes(activeFilter));

    if (noiseLevelPreference === "Any") {
      return categoryFilteredEvents;
    }

    return categoryFilteredEvents.filter((event) => event.noiseLevel === noiseLevelPreference);
  }, [activeFilter, comfortPreferences, hiddenEventIds, isNightMode, noiseLevelPreference, pinnedEventIds, showHiddenEvents]);

  const activeEvents = useMemo(() => {
    const selectedArea = `${timezone.label} ${timezone.city} ${timezone.country}`.toLocaleLowerCase();
    let nextEvents = [...baseEvents];

    if (homeSmallGroupsOnly) {
      nextEvents = nextEvents.filter(isSmallGroupEvent);
    }

    if (homeWeatherSafeOnly) {
      nextEvents = nextEvents.filter(isWeatherSafeEvent);
    }

    nextEvents.sort((a, b) => {
      if (homeNearbyOnly) {
        const nearbyDelta = Number(isNearbyEvent(b, selectedArea)) - Number(isNearbyEvent(a, selectedArea));
        if (nearbyDelta !== 0) return nearbyDelta;
      }

      const trustDelta =
        getSocialEnergyPreferenceScore(b, socialEnergyPreference) +
        getGroupSizePreferenceScore(b, groupSizePreference) -
        (getSocialEnergyPreferenceScore(a, socialEnergyPreference) + getGroupSizePreferenceScore(a, groupSizePreference));

      if (trustDelta !== 0) return trustDelta;

      const foodDelta =
        getEventFoodPreferenceMatches(b, foodBeveragePreferenceIds, 3).length -
        getEventFoodPreferenceMatches(a, foodBeveragePreferenceIds, 3).length;

      if (foodDelta !== 0) return foodDelta;

      const interestDelta =
        getEventInterestPreferenceMatches(b, interestPreferenceIds, interestComfortTagsByInterest, 3).length -
        getEventInterestPreferenceMatches(a, interestPreferenceIds, interestComfortTagsByInterest, 3).length;

      if (interestDelta !== 0) return interestDelta;

      if (homeViewMode === "Comfortable") {
        return getComfortEventScore(a) - getComfortEventScore(b);
      }

      return 0;
    });

    return nextEvents;
  }, [baseEvents, foodBeveragePreferenceIds, groupSizePreference, homeNearbyOnly, homeSmallGroupsOnly, homeViewMode, homeWeatherSafeOnly, interestComfortTagsByInterest, interestPreferenceIds, socialEnergyPreference, timezone.city, timezone.country, timezone.label]);
  const isDay = !isNightMode;
  const effectiveReduceMotion = reduceMotion || batterySaver;
  const [now, setNow] = useState(new Date());
  const outlineStyle = cardOutlineStyle === "Minimal" ? styles.outlineMinimal : cardOutlineStyle === "Standard" ? styles.outlineStandard : styles.outlineStrong;
  const dayOutlineStyle = cardOutlineStyle === "Minimal" ? styles.dayOutlineMinimal : cardOutlineStyle === "Standard" ? styles.dayOutlineStandard : styles.dayOutlineStrong;
  const outlinedCardStyle = [outlineStyle, isDay && dayOutlineStyle];
  const buttonOutlineStyle = cardOutlineStyle === "Minimal" ? styles.buttonOutlineMinimal : cardOutlineStyle === "Standard" ? styles.buttonOutlineStandard : styles.buttonOutlineStrong;
  const dayButtonOutlineStyle = cardOutlineStyle === "Minimal" ? styles.dayButtonOutlineMinimal : cardOutlineStyle === "Standard" ? styles.dayButtonOutlineStandard : styles.dayButtonOutlineStrong;
  const outlinedButtonStyle = [buttonOutlineStyle, isDay && dayButtonOutlineStyle];
  const homeLayoutPreset = getHomeLayoutPreset(effectiveHomeLayoutDensity);
  const homeLayoutCardStyle = {
    borderRadius: homeLayoutPreset.cardRadius,
    minHeight: homeLayoutPreset.cardMinHeight,
    padding: homeLayoutPreset.cardPadding,
  };
  const homeLayoutUtilityCardStyle = {
    borderRadius: homeLayoutPreset.cardRadius,
    minHeight: homeLayoutPreset.utilityCardMinHeight,
    paddingHorizontal: homeLayoutPreset.cardPadding,
    paddingVertical: Math.max(10, homeLayoutPreset.cardPadding - 2),
  };
  const homeLayoutMapCardStyle = {
    borderRadius: homeLayoutPreset.cardRadius,
    minHeight: homeLayoutPreset.mapCardMinHeight,
    padding: homeLayoutPreset.cardPadding,
  };
  const homeLayoutPanelStyle = {
    borderRadius: homeLayoutPreset.cardRadius,
    padding: homeLayoutPreset.cardPadding,
    gap: homeLayoutPreset.mobileStackGap,
    marginBottom: homeLayoutPreset.sectionGap,
  };
  const homeLayoutSectionStyle = {
    borderRadius: homeLayoutPreset.cardRadius,
    padding: homeLayoutPreset.cardPadding,
    gap: homeLayoutPreset.mobileStackGap,
  };
  const homeLayoutChipStyle = {
    minHeight: homeLayoutPreset.tapTarget,
    paddingHorizontal: homeLayoutPreset.chipPaddingHorizontal,
    paddingVertical: homeLayoutPreset.chipPaddingVertical,
  };
  const homeLayoutSmallActionStyle = {
    minHeight: homeLayoutPreset.smallActionMinHeight,
    paddingHorizontal: homeLayoutPreset.chipPaddingHorizontal,
  };
  const homeLayoutRoundButtonStyle = {
    width: homeLayoutPreset.tapTarget,
    height: homeLayoutPreset.tapTarget,
    borderRadius: Math.max(12, homeLayoutPreset.tapTarget / 2),
  };
  const mapZoomScale = 0.9 + mapZoomLevel * 0.12 + (mapFocusMode === "event" ? 0.08 : 0);

  const selectNoiseLevelPreference = (preference: NoiseLevelPreference) => {
    saveSoftHelloMvpState({ noiseLevelPreference: preference });
  };

  const showPrototypeUpdate = (message = "Saved locally") => {
    setHomeUpdateNotice(message);
    setTimeout(() => setHomeUpdateNotice(null), 1600);
  };

  const updateHomeViewMode = (value: HomeViewMode) => {
    saveSoftHelloMvpState({ homeViewMode: value });
    showPrototypeUpdate("Home view saved locally");
  };

  const updateHomeEventLayout = (value: HomeEventLayout) => {
    saveSoftHelloMvpState({ homeEventLayout: value });
    showPrototypeUpdate("Event view saved locally");
  };

  const updateHomeLayoutDensity = (value: HomeLayoutDensity) => {
    saveSoftHelloMvpState({ homeLayoutDensity: value });
    showPrototypeUpdate("Home spacing saved locally");
  };

  const updateHomeHeaderControlsDensity = (value: HomeHeaderControlsDensity) => {
    saveSoftHelloMvpState({ homeHeaderControlsDensity: value });
    showPrototypeUpdate("Header controls saved locally");
  };

  const updateHomeCardLayout = (value: HomeCardLayout) => {
    saveSoftHelloMvpState({ homeCardLayout: value });
    showPrototypeUpdate("Layout preference saved locally");
  };

  const updateHomeEventVisualMode = (value: HomeEventVisualMode) => {
    saveSoftHelloMvpState({ homeEventVisualMode: value });
    showPrototypeUpdate("Event preview style saved locally");
  };

  const updateDayNightModePreference = (value: typeof dayNightModePreference) => {
    saveSoftHelloMvpState({ dayNightModePreference: value });
    showPrototypeUpdate("Day/Night behaviour saved locally");
  };

  const updateCardOutlineStyle = (value: CardOutlineStyle) => {
    saveSoftHelloMvpState({ cardOutlineStyle: value });
    showPrototypeUpdate("Outline style saved locally");
  };

  const restoreDefaultDashboardLayout = () => {
    saveSoftHelloMvpState({
      homeViewMode: "Essential",
      homeNearbyOnly: false,
      homeSmallGroupsOnly: false,
      homeWeatherSafeOnly: false,
      homeEventLayout: "List",
      homeLayoutDensity: "Compact",
      homeHeaderControlsDensity: "Comfortable",
      homeCardLayout: "Vertical list",
      homeEventVisualMode: "Preview image",
      homeVisibleSections: defaultHomeVisibleSections,
      homeSectionOrder: defaultHomeSectionOrder,
      dayNightModePreference: "Follow selected suburb/local time",
      cardOutlineStyle: "Strong",
      showWeekday: true,
    });
    setActiveFilter("All");
    setShowHiddenEvents(false);
    setOpenHomePanel("preferences");
    showPrototypeUpdate("Default dashboard saved locally");
  };

  const updateHomeSection = (key: HomeSectionKey, value: boolean) => {
    saveSoftHelloMvpState({ homeVisibleSections: { ...homeVisibleSections, [key]: value } });
    showPrototypeUpdate("Home sections saved locally");
  };

  const moveHomeSection = (key: HomeSectionOrderKey, direction: -1 | 1) => {
    const currentIndex = homeSectionOrder.indexOf(key);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= homeSectionOrder.length) return;

    const nextOrder = [...homeSectionOrder];
    [nextOrder[currentIndex], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[currentIndex]];
    saveSoftHelloMvpState({ homeSectionOrder: nextOrder });
    showPrototypeUpdate("Home flow saved locally");
  };

  const showSearchPlaceholder = useCallback(() => {
    setHeaderPlaceholder(null);
    setExpandedInsight(null);
    setOpenHomePanel("search");
    setHomeSearchMode("areas");
  }, []);

  const normalizedNsnSearchQuery = normalizeNsnSearchQuery(nsnSearchQuery);
  const searchableMeetups = useMemo(
    () => allEvents.filter((event) => showHiddenEvents || !hiddenEventIds.includes(event.id)),
    [hiddenEventIds, showHiddenEvents]
  );
  const matchingMeetups = useMemo(
    () => searchNsnEvents(searchableMeetups, nsnSearchQuery, eventTranslations[appLanguageBase] ?? {}, 4),
    [appLanguageBase, nsnSearchQuery, searchableMeetups]
  );
  const isMeetupSearch = homeSearchMode === "meetups" && Boolean(normalizedNsnSearchQuery);
  const recommendedEventLimit = shouldAutoFitDashboard || homeViewMode === "Essential" ? 3 : 5;
  const displayedEvents = isMeetupSearch ? matchingMeetups : activeEvents.slice(0, recommendedEventLimit);
  const hasNoMeetupSearchResults = isMeetupSearch && matchingMeetups.length === 0;
  const hasNoFilteredEvents = !isMeetupSearch && activeEvents.length === 0;
  const selectedMapEvent = displayedEvents.find((event) => event.id === highlightedEventId) ?? displayedEvents[0] ?? activeEvents[0] ?? allEvents[0];
  const selectedMapEventCopy = selectedMapEvent ? { ...selectedMapEvent, ...(eventTranslations[appLanguageBase]?.[selectedMapEvent.id] ?? {}) } : null;
  const selectedMapEventIndex = selectedMapEvent ? displayedEvents.findIndex((event) => event.id === selectedMapEvent.id) : -1;
  const selectedMapDetails = selectedMapEvent ? eventMapDetails[selectedMapEvent.id] : null;
  const selectedMapTime = selectedMapEvent ? formatEventTimeLabel(selectedMapEvent.time, { locale, timeFormatPreference }) : null;
  const canCycleMapEvent = displayedEvents.length > 1;
  const shouldShowModeEvents =
    homeVisibleSections.recommendedEvents &&
    (isNightMode ? homeVisibleSections.nightEvents : homeVisibleSections.dayEvents);

  const cycleMapEvent = () => {
    if (!canCycleMapEvent) return;

    const nextIndex = selectedMapEventIndex < 0 ? 0 : (selectedMapEventIndex + 1) % displayedEvents.length;
    setHighlightedEventId(displayedEvents[nextIndex].id);
    setMapFocusMode("event");
    setMapZoomLevel(2);
  };

  const zoomInMap = () => {
    setMapZoomLevel((level) => Math.min(4, level + 1));
  };

  const zoomOutMap = () => {
    setMapFocusMode("area");
    setMapZoomLevel((level) => Math.max(0, level - 1));
  };

  const focusSelectedMapEvent = () => {
    setMapFocusMode("event");
    setMapZoomLevel(2);
  };

  const renderPrototypeMapCanvas = () => (
    <View style={[styles.prototypeMapCanvas, { height: homeLayoutPreset.mapHeight, minHeight: homeLayoutPreset.mapHeight, borderRadius: Math.max(14, homeLayoutPreset.cardRadius - 4) }, isDay && styles.dayPrototypeMapCanvas]}>
      <View pointerEvents="none" style={[styles.prototypeMapContent, { minHeight: homeLayoutPreset.mapHeight, transform: [{ scale: mapZoomScale }] }]}>
        <View style={[styles.prototypeMapWater, isDay && styles.dayPrototypeMapWater]} />
        <View style={[styles.prototypeMapGreen, styles.prototypeMapGreenTop]} />
        <View style={[styles.prototypeMapGreen, styles.prototypeMapGreenBottom]} />
        <View style={[styles.prototypeMapRoad, styles.prototypeMapRoadPrimary, isDay && styles.dayPrototypeMapRoad]} />
        <View style={[styles.prototypeMapRoad, styles.prototypeMapRoadSecondary, isDay && styles.dayPrototypeMapRoad]} />
        <View style={[styles.prototypeMapRoad, styles.prototypeMapRoadTertiary, isDay && styles.dayPrototypeMapRoad]} />
        <View style={[styles.prototypeMapRoad, styles.prototypeMapRoadHarbour, isDay && styles.dayPrototypeMapRoad]} />
        <Text style={[styles.prototypeMapCityLabel, isDay && styles.dayPrototypeMapRoadLabel]}>Sydney</Text>
        <Text style={[styles.prototypeMapNorthLabel, isDay && styles.dayPrototypeMapRoadLabel]}>North Shore</Text>
        {(selectedMapDetails?.roads ?? ["Pacific Hwy", "Victoria Ave", "Harbour foreshore"]).map((road, index) => (
          <Text key={road} style={[styles.prototypeMapRoadLabel, index === 1 && styles.prototypeMapRoadLabelSecond, index === 2 && styles.prototypeMapRoadLabelThird, isDay && styles.dayPrototypeMapRoadLabel]} numberOfLines={1}>
            {road}
          </Text>
        ))}
        <View style={[styles.prototypeMapArea, isDay && styles.dayPrototypeMapArea]}>
          <Text style={[styles.prototypeMapAreaText, isDay && styles.dayHeadingText]} numberOfLines={1}>
            {selectedMapDetails?.suburb ?? timezone.label}
          </Text>
        </View>
        <View style={[styles.prototypeMapPin, isDay && styles.dayPrototypeMapPin, { left: `${selectedMapDetails?.x ?? 48}%`, top: `${selectedMapDetails?.y ?? 46}%` }]}>
          <IconSymbol name="location" color="#FFFFFF" size={16} />
        </View>
      </View>
      <View pointerEvents="none" style={[styles.prototypeMapVenueBadge, isDay && styles.dayPrototypeMapArea]}>
        <Text style={[styles.prototypeMapVenueKicker, isDay && styles.dayMutedText]}>Selected event</Text>
        <Text style={[styles.prototypeMapVenueName, isDay && styles.dayHeadingText]} numberOfLines={1}>
          {selectedMapEvent?.venue ?? selectedMapDetails?.suburb ?? timezone.label}
        </Text>
        <Text style={[styles.prototypeMapVenueSuburb, isDay && styles.dayMutedText]} numberOfLines={1}>
          {selectedMapDetails?.suburb ?? timezone.city}
        </Text>
      </View>
      <View style={styles.prototypeMapZoomControls}>
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={zoomInMap}
          disabled={mapZoomLevel >= 4}
          accessibilityRole="button"
          accessibilityLabel="Zoom in"
          accessibilityHint={mapZoomLevel >= 4 ? "Maximum demo map zoom reached." : "Zooms in the demo map."}
          accessibilityState={{ disabled: mapZoomLevel >= 4 }}
          style={[styles.prototypeMapZoomButton, homeLayoutRoundButtonStyle, isDay && styles.dayPrototypeMapZoomButton, mapZoomLevel >= 4 && styles.disabledMoveButton]}
        >
          <Text style={[styles.prototypeMapZoomText, isDay && styles.dayPrototypeMapZoomText]}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={zoomOutMap}
          disabled={mapZoomLevel <= 0 && mapFocusMode === "area"}
          accessibilityRole="button"
          accessibilityLabel="Zoom out"
          accessibilityHint={mapZoomLevel <= 0 && mapFocusMode === "area" ? "Minimum demo map zoom reached." : "Zooms out the demo map."}
          accessibilityState={{ disabled: mapZoomLevel <= 0 && mapFocusMode === "area" }}
          style={[styles.prototypeMapZoomButton, homeLayoutRoundButtonStyle, isDay && styles.dayPrototypeMapZoomButton, mapZoomLevel <= 0 && mapFocusMode === "area" && styles.disabledMoveButton]}
        >
          <Text style={[styles.prototypeMapZoomText, isDay && styles.dayPrototypeMapZoomText]}>{"\u2212"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.78}
          onPress={focusSelectedMapEvent}
          accessibilityRole="button"
          accessibilityLabel="Recenter on selected event location"
          style={[styles.prototypeMapZoomButton, homeLayoutRoundButtonStyle, styles.prototypeMapResetButton, isDay && styles.dayPrototypeMapZoomButton]}
        >
          <IconSymbol name="location" color={isDay ? "#284E92" : "#FFFFFF"} size={14} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const chooseLocalArea = (area: NsnLocalAreaSuggestion) => {
    saveSoftHelloMvpState({ timezone: area, suburb: area.label });
    setNsnSearchQuery(area.label);
    setOpenHomePanel("none");
    setHeaderPlaceholder({
      title: `${area.resultType} set to ${area.label}`,
      copy: area.resultType === "Region"
        ? "Region selected for prototype browsing. Weather and local prompts use a nearby Sydney fallback point."
        : `Weather, local time, and nearby prompts now use the closest Sydney prototype point for ${area.label}.`,
    });
  };
  const detectLocalArea = async () => {
    setDetectingLocation(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setHeaderPlaceholder({
          title: "Location permission not enabled",
          copy: "You can still choose a Sydney or North Shore suburb manually from Search NSN.",
        });
        return;
      }

      const lastKnownLocation = await Location.getLastKnownPositionAsync({ maxAge: 10 * 60 * 1000 });
      const currentLocation = lastKnownLocation ?? await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const nearestArea = findNearestNsnSydneyLocalArea(currentLocation.coords.latitude, currentLocation.coords.longitude);
      chooseLocalArea(nearestArea);
    } catch (error) {
      console.log("Location detection failed:", error);
      setHeaderPlaceholder({
        title: "Location could not be detected",
        copy: "Try again in a moment, or choose your local area manually.",
      });
    } finally {
      setDetectingLocation(false);
    }
  };

  const showViewFilterPlaceholder = useCallback(() => {
    setHeaderPlaceholder(null);
    setExpandedInsight(null);
    setOpenHomePanel((current) => current === "filters" ? "none" : "filters");
  }, []);

  const showCustomizeHomePanel = useCallback(() => {
    setHeaderPlaceholder(null);
    setExpandedInsight(null);
    setOpenHomePanel((current) => current === "customize" ? "none" : "customize");
  }, []);

  const showLayoutPreferencesPanel = useCallback(() => {
    setHeaderPlaceholder(null);
    setExpandedInsight(null);
    setOpenHomePanel((current) => current === "preferences" ? "none" : "preferences");
  }, []);

  const showOptionsHubPanel = useCallback(() => {
    setHeaderPlaceholder(null);
    setExpandedInsight(null);
    setActiveOptionsSectionId(null);
    setActiveOptionsDetailId(null);
    setOpenHomePanel((current) => current === "options" ? "none" : "options");
  }, []);

  const closeHomePanel = useCallback(() => {
    setOpenHomePanel("none");
  }, []);

  const toggleFirstMeetupSupportOption = (option: FirstMeetupSupportOption) => {
    setSelectedFirstMeetupSupport((current) => {
      if (option === "No extra support") return ["No extra support"];

      const selectedWithoutFallback = current.filter((item) => item !== "No extra support");
      const nextSelection = selectedWithoutFallback.includes(option)
        ? selectedWithoutFallback.filter((item) => item !== option)
        : [...selectedWithoutFallback, option];

      return nextSelection.length > 0 ? nextSelection : ["No extra support"];
    });
    showPrototypeUpdate("First meetup support saved locally");
  };

  const switchToSuggestedTheme = (suggestedMode: "day" | "night") => {
    if (dayNightModePreference !== "Manual toggle") {
      saveSoftHelloMvpState({ dayNightModePreference: "Manual toggle" });
    }
    setIsNightMode(suggestedMode === "night");
  };

  useEffect(() => {
  const timer = setInterval(() => { setNow(new Date()); }, batterySaver && clockDisplayStyle !== "Analog" ? 60 * 1000 : 1000);

  return () => clearInterval(timer);}, [batterySaver, clockDisplayStyle]
  );

  useEffect(() => {
    if (!highlightedEventId || displayedEvents.some((event) => event.id === highlightedEventId)) return;
    setHighlightedEventId(displayedEvents[0]?.id ?? null);
  }, [displayedEvents, highlightedEventId]);

  const localTimeZone = timeContextMode === "Automatic device time" ? undefined : timezone.timeZone;
  const formattedDate = formatPreferredDate(now, {
    locale: "en-AU",
    timeZone: timezone.timeZone,
    dateFormatPreference: "Device / locale",
    showWeekday: true,
  });
  const formattedTime = formatPreferredTime(now, {
    locale,
    timeZone: localTimeZone,
    timeFormatPreference,
  });
  const clockParts = new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    ...(localTimeZone ? { timeZone: localTimeZone } : {}),
  }).formatToParts(now);
  const clockHour = Number(clockParts.find((part) => part.type === "hour")?.value ?? now.getHours());
  const clockMinute = Number(clockParts.find((part) => part.type === "minute")?.value ?? now.getMinutes());
  const clockSecond = Number(clockParts.find((part) => part.type === "second")?.value ?? now.getSeconds());
  const analogHourRotation = `${(clockHour % 12) * 30 + clockMinute * 0.5 + clockSecond / 120}deg`;
  const analogMinuteRotation = `${clockMinute * 6 + clockSecond * 0.1}deg`;
  const analogSecondRotation = `${clockSecond * 6}deg`;
  const shouldShowDigitalClock = clockDisplayStyle !== "Analog" || showDigitalTimeWithAnalog;

  // ===== LIVE TIME =====
  const getHourForTimeZone = (timeZone?: string) =>
    Number(
      new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        hour12: false,
        ...(timeZone ? { timeZone } : {}),
      }).format(now)
    );
  const deviceHour = getHourForTimeZone();
  const selectedLocalHour = getHourForTimeZone(timezone.timeZone);
  const hour = timeContextMode === "Automatic device time" ? deviceHour : selectedLocalHour;

  const greeting =
  hour < 12
    ? copy.morning
    : hour < 18
    ? copy.afternoon
    : copy.evening;

  const localHour = dayNightModePreference === "Follow system/device time" ? deviceHour : dayNightModePreference === "Follow selected suburb/local time" ? selectedLocalHour : hour;
  const timeZoneName = new Intl.DateTimeFormat("en-AU", {
    timeZone: timezone.timeZone,
    timeZoneName: "short",
  }).formatToParts(now).find((part) => part.type === "timeZoneName")?.value ?? "";
  const selectedLocalMonth = Number(new Intl.DateTimeFormat("en-AU", { month: "numeric", timeZone: timezone.timeZone }).format(now));
  const isSydneyDaylightSaving = timezone.timeZone === "Australia/Sydney" && (/DT|Daylight/i.test(timeZoneName) || selectedLocalMonth >= 10 || selectedLocalMonth <= 3);
  const nightStartHour = isSydneyDaylightSaving ? 19 : 18;
  const localTimeSuggestedMode = localHour >= nightStartHour || localHour < 6 ? "night" : "day";
  const todayContextLabel = getHomeTodayContextLabel(hour);
  const shouldShowThemeSuggestion = suggestNightModeInEvenings && localTimeSuggestedMode !== mode && dismissedThemeSuggestion !== localTimeSuggestedMode;
  const themeSuggestion =
    localTimeSuggestedMode === "night"
      ? {
          icon: "🌙",
          title: homeCopy.eveningSuggestion,
          copy: homeCopy.eveningSuggestionCopy,
          button: homeCopy.switch,
        }
      : {
          icon: "☀️",
          title: homeCopy.daytimeSuggestion,
          copy: homeCopy.daytimeSuggestionCopy,
          button: homeCopy.switch,
        };

  useEffect(() => {
    if (dayNightModePreference === "Manual toggle") return;

    const shouldUseNightMode = localTimeSuggestedMode === "night";
    if (shouldUseNightMode !== isNightMode) {
      setIsNightMode(shouldUseNightMode);
    }
  }, [dayNightModePreference, isNightMode, localTimeSuggestedMode, setIsNightMode]);

  // ===== WEATHER =====
  const temperatureLabel = formatTemperatureLabel(weather.temperature, temperatureUnitPreference);
  const weatherMessage =
  weather.temperature === null || weather.rainChance === null || temperatureLabel === null
    ? copy.loadingWeather(timezone.city)
    : weather.rainChance >= 70
    ? `Rain likely today • ${timezone.city} ${temperatureLabel} • Indoor alternatives recommended.`
    : weather.rainChance >= 35
    ? `Slight rain possible • ${timezone.city} ${temperatureLabel} • We'll keep you updated.`
    : weather.temperature >= 28
    ? `Warm weather • ${timezone.city} ${temperatureLabel} • Choose shade and water-friendly plans.`
    : `Good meetup weather • ${timezone.city} ${temperatureLabel} • Rain chance ${weather.rainChance}%.`;

  const weatherStatus =
    weather.temperature === null || weather.rainChance === null || temperatureLabel === null
      ? copy.loadingWeather(timezone.city)
      : weather.rainChance >= 70
        ? "Rain likely today"
        : weather.rainChance >= 35
          ? "Slight rain possible"
          : weather.temperature >= 28
            ? "Warm and mostly clear"
            : "Good for low-pressure meetups";
  const weatherTemperature = temperatureLabel ?? "--";
  const weatherRainChance = weather.rainChance === null ? "--" : `${weather.rainChance}% rain`;
  const weatherAdvice =
    weather.temperature === null || weather.rainChance === null || temperatureLabel === null
      ? "Live weather is loading for the selected local area."
      : weather.rainChance >= 70
        ? "Indoor alternatives recommended."
        : weather.rainChance >= 35
          ? "We will keep you updated."
          : weather.temperature >= 28
            ? "Choose shade and water-friendly plans."
            : `${timezone.city} looks meetup-friendly.`;
  const showWeatherDemoDetails = () => {
    setOpenHomePanel("none");
    setHeaderPlaceholder({
      title: "Demo weather guidance",
      copy: `${weatherStatus}. ${weatherAdvice} Demo only: this does not create a live alert or calendar action.`,
    });
  };

  const weatherIcon =
  weather.rainChance === null
    ? "☁️"
    : weather.rainChance >= 70
    ? "☔"
    : weather.rainChance >= 35
    ? "🌦️"
    : "🌤️";

  // ===== ANIMATIONS =====
  const weatherFloat = useRef(new Animated.Value(0)).current;
  const modeTransition = useRef(new Animated.Value(isDay ? 1 : 0)).current;
  const modePulse = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (effectiveReduceMotion) {
        weatherFloat.setValue(0);
        return;
      }

      const weatherAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(weatherFloat, {
            toValue: -4,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(weatherFloat, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );

      weatherAnimation.start();

      return () => weatherAnimation.stop();
    }, [effectiveReduceMotion, weatherFloat]);

    useEffect(() => {
      if (effectiveReduceMotion) {
        modeTransition.setValue(isDay ? 1 : 0);
        modePulse.setValue(0);
        return;
      }

      const transitionDuration = slowerTransitions ? 1100 : 460;
      const pulseInDuration = slowerTransitions ? 520 : 230;
      const pulseOutDuration = slowerTransitions ? 620 : 260;

      modePulse.setValue(0);
      Animated.parallel([
        Animated.timing(modeTransition, {
          toValue: isDay ? 1 : 0,
          duration: transitionDuration,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(modePulse, {
            toValue: 1,
            duration: pulseInDuration,
            useNativeDriver: true,
          }),
          Animated.timing(modePulse, {
            toValue: 0,
            duration: pulseOutDuration,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }, [effectiveReduceMotion, isDay, modePulse, modeTransition, slowerTransitions]);

    const animatedScreenColor = modeTransition.interpolate({
      inputRange: [0, 1],
      outputRange: ["#0B1626", "#E8EDF2"],
    });

    const modeGlowOpacity = modePulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.36],
    });

    const modeGlowScale = modePulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.94, 1.04],
    });

    const modeIconScale = modePulse.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.16],
    });

    const headerIconSize = homeHeaderControlsDensity === "Compact" ? 20 : homeHeaderControlsDensity === "Spacious" ? 24 : 22;
    const headerToggleIconSize = homeHeaderControlsDensity === "Compact" ? 15 : homeHeaderControlsDensity === "Spacious" ? 18 : 16;
    const homePreferenceDisclosure = getHomePreferenceDisclosure("filters");
    const homeLayoutDisclosure = getHomePreferenceDisclosure("layout");

    const renderHomeDisclosureToggle = ({
      title,
      copy,
      open,
      onPress,
    }: {
      title: string;
      copy: string;
      open: boolean;
      onPress: () => void;
    }) => (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${open ? "Collapse" : "Expand"} ${title}`}
        accessibilityState={{ expanded: open }}
        style={[styles.homeDisclosureToggle, homeLayoutUtilityCardStyle, isDay && styles.dayLocationResultButton, outlinedButtonStyle, isRtl && styles.rtlRow]}
      >
        <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
          <Text style={[styles.homeDisclosureTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{title}</Text>
          <Text style={[styles.homeDisclosureCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy}</Text>
        </View>
        <IconSymbol name={open ? "chevron.up" : "chevron.down"} color={isDay ? "#53677A" : nsnColors.muted} size={18} />
      </TouchableOpacity>
    );

    const renderDefaultDashboardControl = () => (
      <TouchableOpacity
        activeOpacity={0.84}
        onPress={restoreDefaultDashboardLayout}
        accessibilityRole="button"
        accessibilityLabel="Restore default dashboard layout"
        accessibilityHint="Restores the recommended NSN Home layout."
        style={[styles.defaultDashboardButton, homeLayoutUtilityCardStyle, isDay && styles.dayLocationResultButton, outlinedButtonStyle, isRtl && styles.rtlRow]}
      >
        <IconSymbol name="checkmark" color={isDay ? "#284E92" : "#C7B07A"} size={18} />
        <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
          <Text style={[styles.defaultDashboardTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Default view</Text>
          <Text style={[styles.defaultDashboardCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Restore the recommended NSN Home layout.</Text>
        </View>
      </TouchableOpacity>
    );

    const handleOptionsHubRowPress = (rowId: string) => {
      switch (rowId) {
        case "home-preferences":
          showViewFilterPlaceholder();
          return;
        case "customize-home":
          showCustomizeHomePanel();
          return;
        case "view-preferences":
          showLayoutPreferencesPanel();
          return;
        case "transportation-method":
          router.push({ pathname: "/(tabs)/profile", params: { menu: "transportPreferences" } } as never);
          return;
        case "contact-preference":
        case "contact-boundaries":
          router.push({ pathname: "/(tabs)/profile", params: { menu: "contactPreferencePanel" } } as never);
          return;
        case "location-preference":
          router.push({ pathname: "/(tabs)/profile", params: { menu: "locationPreferencePanel" } } as never);
          return;
        case "first-meetup-support":
          setActiveOptionsDetailId("first-meetup-support");
          return;
        case "ask-about-this-meetup":
          setActiveOptionsDetailId("ask-about-this-meetup");
          return;
        case "chat-plus-tools":
          router.push("/(tabs)/chats" as never);
          return;
        case "settings-privacy":
          router.push({ pathname: "/(tabs)/settings", params: { from: "home" } } as never);
          return;
        case "help-support":
          router.push({ pathname: "/(tabs)/profile", params: { menu: "helpSupport" } } as never);
          return;
        case "report-block-emergency":
          router.push({ pathname: "/(tabs)/profile", params: { menu: "blockReport" } } as never);
          return;
        case "alpha-walkthrough":
          router.push("/(tabs)/alpha-walkthrough" as never);
          return;
        case "restore-default-home":
          restoreDefaultDashboardLayout();
          return;
        case "saved-locally-note":
          showPrototypeUpdate("Prototype tools use local state only");
          return;
        default:
          showPrototypeUpdate("Demo action only");
      }
    };

    const renderOptionsHubRow = (row: OptionsHubRow) => (
      <TouchableOpacity
        key={row.id}
        activeOpacity={0.84}
        onPress={() => handleOptionsHubRowPress(row.id)}
        accessibilityRole="button"
        accessibilityLabel={row.title}
        accessibilityHint={row.description}
        style={[styles.optionsHubRow, { borderRadius: Math.max(15, homeLayoutPreset.cardRadius - 5), minHeight: homeLayoutPreset.cardMinHeight - 18, gap: homeLayoutPreset.chipGap, paddingHorizontal: homeLayoutPreset.cardPadding - 2, paddingVertical: homeLayoutPreset.cardPadding - 5 }, isDay && styles.dayLocationResultButton, outlinedButtonStyle, isRtl && styles.rtlRow]}
      >
        <View style={[styles.optionsHubIconBadge, isDay && styles.daySectionToggle]}>
          <IconSymbol name={row.icon} color={isDay ? "#445E93" : "#C7B07A"} size={18} />
        </View>
        <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
          <Text style={[styles.optionsHubRowTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{row.title}</Text>
          <Text style={[styles.optionsHubRowDescription, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{row.description}</Text>
        </View>
      </TouchableOpacity>
    );

    const renderOptionsHubCategoryCard = (category: OptionsHubCategoryCard) => (
      <TouchableOpacity
        key={category.id}
        activeOpacity={0.84}
        onPress={() => {
          setActiveOptionsSectionId(category.id);
          setActiveOptionsDetailId(null);
        }}
        accessibilityRole="button"
        accessibilityLabel={category.title}
        accessibilityHint={category.description}
        style={[styles.optionsHubCategoryCard, { borderRadius: Math.max(15, homeLayoutPreset.cardRadius - 5), minHeight: homeLayoutPreset.cardMinHeight - 12, gap: homeLayoutPreset.chipGap, padding: homeLayoutPreset.cardPadding - 2 }, isDay && styles.dayLocationResultButton, outlinedButtonStyle, isRtl && styles.rtlRow]}
      >
        <View style={[styles.optionsHubIconBadge, isDay && styles.daySectionToggle]}>
          <IconSymbol name={category.icon} color={isDay ? "#445E93" : "#C7B07A"} size={18} />
        </View>
        <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
          <Text style={[styles.optionsHubSectionTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{category.title}</Text>
          <Text style={[styles.optionsHubSectionCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{category.description}</Text>
        </View>
      </TouchableOpacity>
    );

    const renderFirstMeetupSupportPanel = () => (
      <View style={[styles.optionsHubInlinePanel, { borderRadius: Math.max(15, homeLayoutPreset.cardRadius - 5), padding: homeLayoutPreset.cardPadding - 2, gap: homeLayoutPreset.mobileStackGap }, isDay && styles.dayLocationResultButton]}>
        <Text style={[styles.optionsHubInlineTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>First meetup support</Text>
        <Text style={[styles.optionsHubInlineCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
          Local prototype preferences only. This does not request a real guide, create matching, or open a private 1:1 flow.
        </Text>
        <View style={[styles.optionsHubChipRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
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
                style={[styles.optionsHubChoiceChip, { minHeight: homeLayoutPreset.cardMinHeight - 20, borderRadius: Math.max(14, homeLayoutPreset.cardRadius - 7), paddingHorizontal: homeLayoutPreset.chipPaddingHorizontal, paddingVertical: homeLayoutPreset.chipPaddingVertical }, isDay && styles.dayLocationResultButton, active && styles.homeControlChipActive]}
              >
                <Text style={[styles.optionsHubChoiceTitle, isDay && styles.dayHeadingText, active && styles.homeControlChipTextActive, isRtl && styles.rtlText]}>
                  {active ? "Selected: " : ""}{option.label}
                </Text>
                <Text style={[styles.optionsHubChoiceCopy, isDay && styles.dayMutedText, active && styles.homeControlChipTextActive, isRtl && styles.rtlText]}>{option.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={[styles.optionsHubInlineMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
          Current: {getFirstMeetupSupportSummary(selectedFirstMeetupSupport)}
        </Text>
      </View>
    );

    const renderAskAboutMeetupPanel = () => (
      <View style={[styles.optionsHubInlinePanel, { borderRadius: Math.max(15, homeLayoutPreset.cardRadius - 5), padding: homeLayoutPreset.cardPadding - 2, gap: homeLayoutPreset.mobileStackGap }, isDay && styles.dayLocationResultButton]}>
        <Text style={[styles.optionsHubInlineTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Ask about this meetup</Text>
        <Text style={[styles.optionsHubInlineCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
          Demo question chips only. For reporting, blocking, leaving, or emergency help, use the existing safety flows.
        </Text>
        {askAboutMeetupQuestionGroups.map((group) => (
          <View key={group.phase} style={[styles.optionsHubQuestionGroup, { gap: homeLayoutPreset.chipGap }]}>
            <Text style={[styles.optionsHubQuestionPhase, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{group.title}</Text>
            <View style={[styles.optionsHubChipRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              {group.questions.map((question) => {
                const active = selectedMeetupQuestion === question;

                return (
                  <TouchableOpacity
                    key={question}
                    activeOpacity={0.82}
                    onPress={() => {
                      setSelectedMeetupQuestion(question);
                      showPrototypeUpdate("Meetup helper question selected");
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={question}
                    style={[styles.optionsHubQuestionChip, homeLayoutSmallActionStyle, isDay && styles.dayLocationResultButton, active && styles.homeControlChipActive]}
                  >
                    <Text style={[styles.optionsHubQuestionText, isDay && styles.dayHeadingText, active && styles.homeControlChipTextActive, isRtl && styles.rtlText]}>{question}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
        {selectedMeetupQuestion ? (
          <View style={[styles.optionsHubHelperResult, { borderRadius: Math.max(13, homeLayoutPreset.cardRadius - 7), padding: homeLayoutPreset.cardPadding - 4 }, isDay && styles.dayLocationResultButton]}>
            <Text style={[styles.optionsHubInlineTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Demo helper selected</Text>
            <Text style={[styles.optionsHubInlineCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{selectedMeetupQuestion}</Text>
          </View>
        ) : null}
      </View>
    );

    const renderOptionsHub = () => {
      const activeSection = getOptionsHubSection(activeOptionsSectionId, optionsHubSections);

      if (!activeSection) {
        return (
          <View style={[styles.optionsHubStack, { gap: homeLayoutPreset.mobileStackGap }]}>
            <View style={[styles.optionsHubCategoryGrid, { gap: homeLayoutPreset.chipGap }]}>
              {getOptionsHubCategoryCards(optionsHubSections).map(renderOptionsHubCategoryCard)}
            </View>
            <Text style={[styles.optionsHubSafetyNote, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
              Choose a category to view its details. Prototype tools remain local and do not add backend, auth, or matching behavior.
            </Text>
          </View>
        );
      }

      if (activeOptionsDetailId === "first-meetup-support" || activeOptionsDetailId === "ask-about-this-meetup") {
        return (
          <View style={[styles.optionsHubStack, { gap: homeLayoutPreset.mobileStackGap }]}>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => setActiveOptionsDetailId(null)}
              accessibilityRole="button"
              accessibilityLabel={`Back to ${activeSection.title}`}
              style={[styles.optionsHubBackButton, homeLayoutSmallActionStyle, isDay && styles.dayLocationResultButton, outlinedButtonStyle, isRtl && styles.rtlRow]}
            >
              <IconSymbol name={isRtl ? "chevron.right" : "chevron.left"} color={isDay ? "#53677A" : nsnColors.muted} size={16} />
              <Text style={[styles.optionsHubQuestionText, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{activeSection.title}</Text>
            </TouchableOpacity>
            {activeOptionsDetailId === "first-meetup-support" ? renderFirstMeetupSupportPanel() : renderAskAboutMeetupPanel()}
          </View>
        );
      }

      return (
        <View style={[styles.optionsHubStack, { gap: homeLayoutPreset.mobileStackGap }]}>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => {
              setActiveOptionsSectionId(null);
              setActiveOptionsDetailId(null);
            }}
            accessibilityRole="button"
            accessibilityLabel="Back to Options categories"
            style={[styles.optionsHubBackButton, homeLayoutSmallActionStyle, isDay && styles.dayLocationResultButton, outlinedButtonStyle, isRtl && styles.rtlRow]}
          >
            <IconSymbol name={isRtl ? "chevron.right" : "chevron.left"} color={isDay ? "#53677A" : nsnColors.muted} size={16} />
            <Text style={[styles.optionsHubQuestionText, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Options categories</Text>
          </TouchableOpacity>
          <View style={[styles.optionsHubSection, { borderRadius: Math.max(16, homeLayoutPreset.cardRadius - 4) }, isDay && styles.dayLocationResultButton, outlinedButtonStyle]}>
            <View style={[styles.optionsHubSectionHeader, { minHeight: homeLayoutPreset.cardMinHeight - 18, gap: homeLayoutPreset.chipGap, paddingHorizontal: homeLayoutPreset.cardPadding, paddingVertical: homeLayoutPreset.cardPadding - 4 }, isRtl && styles.rtlRow]}>
              <View style={[styles.optionsHubIconBadge, isDay && styles.daySectionToggle]}>
                <IconSymbol name={activeSection.icon} color={isDay ? "#445E93" : "#C7B07A"} size={18} />
              </View>
              <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
                <Text style={[styles.optionsHubSectionTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{activeSection.title}</Text>
                <Text style={[styles.optionsHubSectionCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{activeSection.description}</Text>
              </View>
            </View>
            <View style={[styles.optionsHubSectionBody, { gap: homeLayoutPreset.chipGap, paddingHorizontal: homeLayoutPreset.cardPadding - 4, paddingBottom: homeLayoutPreset.cardPadding - 4 }]}>
              {activeSection.rows.map(renderOptionsHubRow)}
              {activeSection.id === "safetyPrivacy" ? (
                <Text style={[styles.optionsHubSafetyNote, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  Safety note: the meetup helper is not a safety system. Use report, block, leave, or emergency flows for safety needs.
                </Text>
              ) : null}
              {activeSection.id === "prototypeTools" ? (
                <Text style={[styles.optionsHubSafetyNote, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  Demo actions stay local to this prototype and do not add backend, auth, or matching behavior.
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      );
    };

    let hasRenderedEventSection = false;
    const renderHomeSection = (sectionKey: HomeSectionOrderKey): ReactNode => {
      if (sectionKey === "search") {
        return homeVisibleSections.search && !showNsnSearch ? (
          <TouchableOpacity
            key={sectionKey}
            activeOpacity={0.84}
            onPress={showSearchPlaceholder}
            accessibilityRole="button"
            accessibilityLabel="Open Search NSN"
            accessibilityHint="Search suburbs, regions, and meetups."
            style={[styles.homeSearchEntryCard, styles.dashboardUtilityCard, homeLayoutUtilityCardStyle, isDay && styles.dayHeaderPlaceholderCard, outlinedCardStyle, isRtl && styles.rtlRow]}
          >
            <IconSymbol name="magnifyingglass" color={isDay ? "#284E92" : "#C7B07A"} size={20} />
            <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
              <Text style={[styles.headerPlaceholderTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Search NSN</Text>
              <Text style={[styles.headerPlaceholderCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                Find a suburb, region, or low-pressure meetup idea.
              </Text>
            </View>
          </TouchableOpacity>
        ) : null;
      }

      if (sectionKey === "weather") {
        return homeVisibleSections.weather ? (
          <View key={sectionKey} style={[styles.localContextGroup, { gap: homeLayoutPreset.mobileStackGap }, shouldAutoFitDashboard && styles.localContextGroupAutoFit]}>
            <View style={[styles.dashboardPair, { gap: homeLayoutPreset.desktopGridGap }]}>
            <TouchableOpacity
              activeOpacity={0.86}
              onPress={showWeatherDemoDetails}
              accessibilityRole="button"
              accessibilityLabel="Open demo weather guidance"
              accessibilityHint={weatherMessage}
              style={[styles.weatherCard, styles.dashboardCard, homeLayoutCardStyle, isDay && styles.dayCard, outlinedCardStyle, isRtl && styles.rtlRow]}
            >
              <View style={[styles.weatherBody, isRtl && styles.rtlBlock]}>
                <View style={[styles.weatherTitleRow, isRtl && styles.rtlRow]}>
                  <IconSymbol name="weather" color={isDay ? "#284E92" : "#C7B07A"} size={16} />
                  <Text style={[styles.weatherTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.weatherUpdate}</Text>
                </View>
                <Text style={[styles.weatherStatus, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{weatherStatus}</Text>
                <View style={[styles.weatherMetricRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                  <Text style={[styles.weatherMetric, { paddingHorizontal: homeLayoutPreset.chipPaddingHorizontal - 2, paddingVertical: Math.max(3, homeLayoutPreset.chipPaddingVertical - 4) }, isDay && styles.dayMutedText]}>{weatherTemperature}</Text>
                  <Text style={[styles.weatherMetric, { paddingHorizontal: homeLayoutPreset.chipPaddingHorizontal - 2, paddingVertical: Math.max(3, homeLayoutPreset.chipPaddingVertical - 4) }, isDay && styles.dayMutedText]}>{weatherRainChance}</Text>
                </View>
                <Text style={[styles.weatherCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{weatherAdvice}</Text>
              </View>
              <Animated.Text style={[styles.weatherIcon, { transform: [{ translateY: weatherFloat }] }]}>
                {weatherIcon}
              </Animated.Text>
            </TouchableOpacity>
            <View style={[styles.todayCard, styles.dashboardCard, homeLayoutCardStyle, isDay && styles.dayCard, outlinedCardStyle]}>
              <View style={[styles.sectionTitleRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                <IconSymbol name="calendar" color={isDay ? "#284E92" : "#C7B07A"} size={17} />
                <Text style={[styles.todayTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Today</Text>
              </View>
              <Text style={[styles.todayDate, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{formattedDate}</Text>
              <Text style={[styles.todayCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                {todayContextLabel}
              </Text>
              <Text style={[styles.todayNote, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                No calendar sync yet - prototype only.
              </Text>
            </View>
            </View>
            {homeVisibleSections.map ? (
              <View style={[styles.locationMapCard, styles.dashboardCard, homeLayoutMapCardStyle, isDay && styles.dayCard, outlinedCardStyle]}>
                <View style={[styles.sectionTitleRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                  <IconSymbol name="location" color={isDay ? "#284E92" : "#C7B07A"} size={17} />
                  <Text style={[styles.locationMapTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Sydney North Shore map</Text>
                </View>
                {renderPrototypeMapCanvas()}
                <Text style={[styles.locationMapEvent, isDay && styles.dayHeadingText, isRtl && styles.rtlText]} numberOfLines={1}>
                  {selectedMapEventCopy?.title ?? "Local area"}
                </Text>
                <Text style={[styles.locationMapMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]} numberOfLines={2}>
                  {selectedMapEvent ? `${selectedMapEvent.venue}, ${selectedMapDetails?.suburb ?? timezone.label} • ${selectedMapTime}` : `${timezone.label}, ${timezone.country}`}
                </Text>
                <View style={[styles.locationMapActions, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                  <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={cycleMapEvent}
                    disabled={!canCycleMapEvent}
                    accessibilityRole="button"
                    accessibilityLabel="Show next event location"
                    accessibilityHint={canCycleMapEvent ? "Cycles through demo event locations." : "Only one demo event location is currently visible."}
                    style={[styles.locationMapAction, homeLayoutSmallActionStyle, isDay && styles.dayLocationMapAction, outlinedButtonStyle, !canCycleMapEvent && styles.disabledMoveButton]}
                  >
                    <IconSymbol name="flexible" color={isDay ? "#284E92" : "#C7B07A"} size={14} />
                    <Text style={[styles.locationMapActionText, isDay && styles.dayLinkText]}>Next event</Text>
                  </TouchableOpacity>
                  {selectedMapEvent ? (
                    <TouchableOpacity
                      activeOpacity={0.82}
                      onPress={() => router.push(`/event/${selectedMapEvent.id}`)}
                      accessibilityRole="button"
                      accessibilityLabel={`Open meetup ${selectedMapEventCopy?.title ?? selectedMapEvent.title}`}
                      style={[styles.locationMapAction, homeLayoutSmallActionStyle, isDay && styles.dayLocationMapAction, outlinedButtonStyle, styles.locationMapPrimaryAction]}
                    >
                      <IconSymbol name="chevron.right" color="#FFFFFF" size={14} />
                      <Text style={styles.locationMapPrimaryActionText}>Open event</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ) : null}
          </View>
        ) : null;
      }

      if (sectionKey === "map") {
        if (homeVisibleSections.weather) return null;
        return homeVisibleSections.map ? (
          <View key={sectionKey} style={[styles.locationMapCard, styles.dashboardCard, homeLayoutMapCardStyle, isDay && styles.dayCard, outlinedCardStyle]}>
            <View style={[styles.sectionTitleRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              <IconSymbol name="location" color={isDay ? "#284E92" : "#C7B07A"} size={18} />
              <Text style={[styles.locationMapTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Sydney North Shore map</Text>
            </View>
            {renderPrototypeMapCanvas()}
            <Text style={[styles.locationMapEvent, isDay && styles.dayHeadingText, isRtl && styles.rtlText]} numberOfLines={1}>
              {selectedMapEventCopy?.title ?? "Local area"}
            </Text>
            <Text style={[styles.locationMapMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]} numberOfLines={2}>
              {selectedMapEvent ? `${selectedMapEvent.venue}, ${selectedMapDetails?.suburb ?? timezone.label} • ${selectedMapTime}` : `${timezone.label}, ${timezone.country}`}
            </Text>
            <View style={[styles.locationMapActions, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={cycleMapEvent}
                disabled={!canCycleMapEvent}
                accessibilityRole="button"
                accessibilityLabel="Show next event location"
                accessibilityHint={canCycleMapEvent ? "Cycles through demo event locations." : "Only one demo event location is currently visible."}
                style={[styles.locationMapAction, homeLayoutSmallActionStyle, isDay && styles.dayLocationMapAction, outlinedButtonStyle, !canCycleMapEvent && styles.disabledMoveButton]}
              >
                <IconSymbol name="flexible" color={isDay ? "#284E92" : "#C7B07A"} size={14} />
                <Text style={[styles.locationMapActionText, isDay && styles.dayLinkText]}>Next event</Text>
              </TouchableOpacity>
              {selectedMapEvent ? (
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => router.push(`/event/${selectedMapEvent.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open meetup ${selectedMapEventCopy?.title ?? selectedMapEvent.title}`}
                  style={[styles.locationMapAction, homeLayoutSmallActionStyle, isDay && styles.dayLocationMapAction, outlinedButtonStyle, styles.locationMapPrimaryAction]}
                >
                  <IconSymbol name="chevron.right" color="#FFFFFF" size={14} />
                  <Text style={styles.locationMapPrimaryActionText}>Open event</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ) : null;
      }

      if (sectionKey === "noiseGuide") {
        return homeVisibleSections.noiseGuide ? (
          <View key={sectionKey} style={[styles.noiseGuideCard, styles.dashboardCard, homeLayoutCardStyle, isDay && styles.dayCard, outlinedCardStyle]}>
            <View style={[styles.noiseGuideHeader, isRtl && styles.rtlRow]}>
              <View style={isRtl && styles.rtlBlock}>
                <Text style={[styles.noiseGuideTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{noiseCopy.title}</Text>
                <Text style={[styles.noiseGuideCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{noiseCopy.copy}</Text>
              </View>
            </View>
            <View style={[styles.noiseLevelRow, { gap: homeLayoutPreset.desktopGridGap }, isRtl && styles.rtlRow]}>
              {noiseLevelOptions.map((level) => {
                const levelCopy = noiseCopy.levels[level];
                const active = noiseLevelPreference === level;

                return (
                  <TouchableOpacity
                    key={level}
                    activeOpacity={0.82}
                    onPress={() => selectNoiseLevelPreference(level)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`${levelCopy.label} noise preference`}
                    style={[styles.noiseLevelItem, { borderRadius: Math.max(14, homeLayoutPreset.cardRadius - 6), minHeight: homeLayoutPreset.cardMinHeight - 8, paddingHorizontal: homeLayoutPreset.cardPadding - 4, paddingVertical: homeLayoutPreset.cardPadding - 4 }, active && styles.noiseLevelItemActive, isDay && styles.dayNoiseLevelItem, active && isDay && styles.dayNoiseLevelItemActive]}
                  >
                    <Text style={styles.noiseLevelIcon}>{levelCopy.icon}</Text>
                    <Text style={[styles.noiseLevelTitle, isDay && styles.dayHeadingText, active && styles.noiseLevelTitleActive, isRtl && styles.rtlText]}>{levelCopy.label}</Text>
                    <Text style={[styles.noiseLevelCopy, isDay && styles.dayMutedText, active && styles.noiseLevelCopyActive, isRtl && styles.rtlText]}>{levelCopy.copy}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={[styles.noiseFilterRow, styles.homeWrappingChipRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              {noiseFilterKeys.map((filter) => (
                <Pill
                  key={filter}
                  label={noiseCopy.filters[filter]}
                  active={noiseLevelPreference === filter}
                  isDay={isDay}
                  density={effectiveHomeLayoutDensity}
                  onPress={() => selectNoiseLevelPreference(filter)}
                />
              ))}
            </View>
          </View>
        ) : null;
      }

      const isEventSectionKey = sectionKey === "recommendedEvents" || sectionKey === "dayEvents" || sectionKey === "nightEvents";
      const activeEventSectionKey = isNightMode ? "nightEvents" : "dayEvents";

      if (!isEventSectionKey || hasRenderedEventSection || (sectionKey !== "recommendedEvents" && sectionKey !== activeEventSectionKey)) {
        return null;
      }

      hasRenderedEventSection = true;

      return shouldShowModeEvents ? (
        <View key="home-events" style={[styles.homeMajorSection, homeLayoutSectionStyle, shouldAutoFitDashboard && styles.homeMajorSectionAutoFit, styles.dashboardWideCard, isDay && styles.dayCard, outlinedCardStyle]}>
          <View style={[styles.sectionHeader, { minHeight: homeLayoutPreset.tapTarget, marginBottom: homeLayoutPreset.headerBottomGap / 4 }, isRtl && styles.rtlRow]}>
            <View style={[styles.sectionTitleRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              <IconSymbol name={homeSectionIcons[activeEventSectionKey]} color={isDay ? "#284E92" : "#C7B07A"} size={18} />
              <Text style={[styles.sectionTitle, isDay ? styles.dayHeadingText : null, isRtl && styles.rtlText]}>
                {isMeetupSearch ? "Matching meetups" : mode === "day" ? copy.dayEvents : copy.eveningEvents}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={showLayoutPreferencesPanel}
              accessibilityRole="button"
              accessibilityLabel="View event layout preferences"
              style={[styles.sectionActionButton, homeLayoutSmallActionStyle, isDay && styles.daySectionActionButton, outlinedButtonStyle]}
            >
              <IconSymbol name="visibility" color={isDay ? "#445E93" : "#C7B07A"} size={15} />
              <Text style={[styles.seeAll, isDay ? styles.dayLinkText : null, isRtl && styles.rtlText]}>
                View Preferences
              </Text>
            </TouchableOpacity>
          </View>
          {!isMeetupSearch ? (
            <View style={[styles.eventCategoryFilterRow, styles.homeWrappingChipRow, { gap: homeLayoutPreset.chipGap, paddingBottom: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              {copy.filters.map((filter, index) => {
                const filterKey = filterKeys[index];

                return (
                  <Pill
                    key={filterKey}
                    label={filter}
                    active={activeFilter === filterKey}
                    isDay={isDay}
                    density={effectiveHomeLayoutDensity}
                    accessibilityLabel={`${filter} event category filter`}
                    onPress={() => setActiveFilter(filterKey)}
                  />
                );
              })}
            </View>
          ) : null}
          <View style={[styles.cardStack, { gap: homeLayoutPreset.mobileStackGap }, effectiveHomeLayoutDensity === "Compact" && styles.cardStackCompact, effectiveHomeLayoutDensity === "Spacious" && styles.cardStackSpacious]}>
            {homeEventLayout === "Map" && !isMeetupSearch ? (
              <View style={[styles.mapPreviewCard, homeLayoutUtilityCardStyle, isDay && styles.dayLocationResultButton, outlinedCardStyle, isRtl && styles.rtlRow]}>
                <IconSymbol name="location" color={isDay ? "#284E92" : "#C7B07A"} size={20} />
                <View style={styles.headerPlaceholderBody}>
                  <Text style={[styles.locationResultTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Map view prototype</Text>
                  <Text style={[styles.locationResultMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                    Showing recommended local meetups in a compact list until map pins are connected.
                  </Text>
                </View>
              </View>
            ) : null}
            {homeCardLayout === "Horizontal cards" ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.horizontalEventScroller, { gap: homeLayoutPreset.desktopGridGap }, isRtl && styles.rtlRow]}>
                {displayedEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} isDay={isDay} appLanguageBase={appLanguageBase} locale={locale} timeFormatPreference={timeFormatPreference} density={effectiveHomeLayoutDensity} cardLayout={homeCardLayout} visualMode={homeEventVisualMode} cardOutlineStyle={cardOutlineStyle} socialEnergyPreference={socialEnergyPreference} groupSizePreference={groupSizePreference} photoRecordingComfortPreferences={photoRecordingComfortPreferences} foodBeveragePreferenceIds={foodBeveragePreferenceIds} interestPreferenceIds={interestPreferenceIds} interestComfortTagsByInterest={interestComfortTagsByInterest} verifiedButPrivate={verifiedButPrivate} featured={index === 0} highlighted={selectedMapEvent?.id === event.id} onHighlight={setHighlightedEventId} />
                ))}
              </ScrollView>
            ) : (
              <View
                style={[
                  styles.eventLayoutStack,
                  homeCardLayout === "Boxed grid" && styles.eventLayoutGrid,
                  homeCardLayout === "Layered cards" && styles.eventLayoutLayered,
                  homeCardLayout === "Magazine" && styles.eventLayoutMagazine,
                  { gap: homeLayoutPreset.desktopGridGap },
                ]}
              >
                {displayedEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} isDay={isDay} appLanguageBase={appLanguageBase} locale={locale} timeFormatPreference={timeFormatPreference} density={effectiveHomeLayoutDensity} cardLayout={homeCardLayout} visualMode={homeEventVisualMode} cardOutlineStyle={cardOutlineStyle} socialEnergyPreference={socialEnergyPreference} groupSizePreference={groupSizePreference} photoRecordingComfortPreferences={photoRecordingComfortPreferences} foodBeveragePreferenceIds={foodBeveragePreferenceIds} interestPreferenceIds={interestPreferenceIds} interestComfortTagsByInterest={interestComfortTagsByInterest} verifiedButPrivate={verifiedButPrivate} featured={index === 0} highlighted={selectedMapEvent?.id === event.id} onHighlight={setHighlightedEventId} />
                ))}
              </View>
            )}
            {hasNoMeetupSearchResults || hasNoFilteredEvents ? (
              <View style={[styles.searchEmptyCard, homeLayoutUtilityCardStyle, isDay && styles.dayLocationResultButton]}>
                <Text style={[styles.locationResultTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>
                  {hasNoFilteredEvents && activeFilter !== "All" ? "No matching meetups in this category yet." : "No matching meetups right now."}
                </Text>
                <Text style={[styles.locationResultMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  {hasNoFilteredEvents && activeFilter !== "All" ? "Try another filter — NSN is still an early prototype." : "Try relaxing a filter - NSN is still an early prototype."}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : null;
    };

    return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={styles.screen}>
      <Animated.View style={[styles.animatedScreen, { backgroundColor: animatedScreenColor }]}>
        <Animated.View
          style={[
            styles.modeGlow,
            { pointerEvents: "none" },
            {
              opacity: modeGlowOpacity,
              transform: [{ scale: modeGlowScale }],
              backgroundColor: isDay ? "#C7B07A" : "#4D6F91",
            },
          ]}
        />
        <ScrollView
          style={[
            styles.scrollSurface,
            shouldLockDashboardScroll && styles.scrollSurfaceLocked,
            shouldLockDashboardScroll && { maxHeight: lockedDashboardHeight },
          ]}
          scrollEnabled={!shouldLockDashboardScroll}
          bounces={!shouldLockDashboardScroll}
          contentContainerStyle={[
            styles.content,
            { paddingTop: homeLayoutPreset.screenPaddingTop, paddingBottom: homeLayoutPreset.bottomPadding },
            effectiveHomeLayoutDensity === "Compact" && styles.contentCompact,
            effectiveHomeLayoutDensity === "Spacious" && styles.contentSpacious,
            shouldAutoFitDashboard && styles.contentAutoFit,
            shouldLockDashboardScroll && styles.contentLockedDashboard,
            shouldLockDashboardScroll && { minHeight: lockedDashboardHeight, maxHeight: lockedDashboardHeight },
          ]}
          showsVerticalScrollIndicator={!shouldLockDashboardScroll}
          keyboardShouldPersistTaps="handled"
        >
        <View style={[styles.header, { marginBottom: homeLayoutPreset.headerBottomGap }, isRtl && styles.rtlRow]}>
          <View style={[styles.headerTitle, isRtl && styles.rtlBlock]}>
            <View style={[styles.brandRow, isRtl && styles.rtlRow]}>
              <NsnLogoMark isDay={isDay} />
              <Text style={[styles.logo, isDay && styles.dayText]}>NSN</Text>
            </View>
            <Text style={[styles.subtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.subtitle}</Text>
          </View>
          <View
            style={[
              styles.headerActions,
              homeHeaderControlsDensity === "Compact" && styles.headerActionsCompact,
              homeHeaderControlsDensity === "Spacious" && styles.headerActionsSpacious,
              isRtl && styles.rtlRow,
            ]}
          >
            <View
              style={[
                styles.headerModeToggle,
                homeHeaderControlsDensity === "Compact" && styles.headerModeToggleCompact,
                homeHeaderControlsDensity === "Spacious" && styles.headerModeToggleSpacious,
                isDay && styles.dayModeToggle,
                isRtl && styles.rtlRow,
              ]}
              accessibilityRole="radiogroup"
              accessibilityLabel="Day and Night mode"
            >
              <TouchableOpacity
                activeOpacity={0.86}
                onPress={() => {
                  if (dayNightModePreference !== "Manual toggle") saveSoftHelloMvpState({ dayNightModePreference: "Manual toggle" });
                  setIsNightMode(false);
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: mode === "day" }}
                accessibilityLabel="Day mode toggle"
                accessibilityHint={dayNightModePreference === "Manual toggle" ? "Switches the dashboard to Day mode." : "Returns Day/Night behaviour to manual and switches to Day mode."}
                style={[
                  styles.headerModeToggleOption,
                  homeHeaderControlsDensity === "Compact" && styles.headerModeToggleOptionCompact,
                  homeHeaderControlsDensity === "Spacious" && styles.headerModeToggleOptionSpacious,
                  mode === "day" && styles.modeToggleDayActive,
                ]}
              >
                <Animated.Text style={[styles.headerModeToggleIcon, { fontSize: headerToggleIconSize }, isDay && mode !== "day" && styles.dayModeToggleText, mode === "day" && styles.modeToggleDayActiveText, mode === "day" && { transform: [{ scale: modeIconScale }] }]}>{"\u2600"}</Animated.Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.86}
                onPress={() => {
                  if (dayNightModePreference !== "Manual toggle") saveSoftHelloMvpState({ dayNightModePreference: "Manual toggle" });
                  setIsNightMode(true);
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: mode === "night" }}
                accessibilityLabel="Night mode toggle"
                accessibilityHint={dayNightModePreference === "Manual toggle" ? "Switches the dashboard to Night mode." : "Returns Day/Night behaviour to manual and switches to Night mode."}
                style={[
                  styles.headerModeToggleOption,
                  homeHeaderControlsDensity === "Compact" && styles.headerModeToggleOptionCompact,
                  homeHeaderControlsDensity === "Spacious" && styles.headerModeToggleOptionSpacious,
                  mode === "night" && styles.modeToggleNightActive,
                ]}
              >
                <Animated.Text style={[styles.headerModeToggleIcon, { fontSize: headerToggleIconSize }, isDay && mode !== "night" && styles.dayModeToggleText, mode === "night" && { transform: [{ scale: modeIconScale }] }]}>{"\u263E"}</Animated.Text>
              </TouchableOpacity>
            </View>
            <HeaderActionButton
              onPress={showSearchPlaceholder}
              accessibilityLabel="Search"
              accessibilityHint="Search North Shore suburbs and prototype meetups."
              isDay={isDay}
              density={homeHeaderControlsDensity}
            >
              <IconSymbol name="magnifyingglass" color={isDay ? "#0B1220" : nsnColors.text} size={headerIconSize} />
            </HeaderActionButton>
            <HeaderActionButton
              onPress={showOptionsHubPanel}
              accessibilityLabel="Options"
              accessibilityHint="Opens Home, preferences, meetups, privacy, alpha testing, and prototype tools."
              isDay={isDay}
              density={homeHeaderControlsDensity}
            >
              <IconSymbol name="settings" color={isDay ? "#0B1220" : nsnColors.text} size={headerIconSize} />
            </HeaderActionButton>
          </View>
        </View>

        <View style={[styles.localDashboardHeader, { borderRadius: homeLayoutPreset.heroRadius, paddingVertical: homeLayoutPreset.heroPaddingVertical, marginBottom: homeLayoutPreset.sectionGap }, shouldAutoFitDashboard && styles.localDashboardHeaderAutoFit, isDay && styles.dayLocalDashboardHeader, outlinedCardStyle]}>
          <View style={[styles.localDashboardBody, isRtl && styles.rtlBlock]}>
            <Text style={[styles.greetingText, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{greeting}</Text>
            <View style={[styles.localMetaRow, isRtl && styles.rtlRow]}>
              <IconSymbol name="location" color={isDay ? "#284E92" : "#C7B07A"} size={15} />
              <Text style={[styles.localMetaText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{timezone.label}, {timezone.country}</Text>
            </View>
            <View
              style={[styles.localTimePill, { minHeight: homeLayoutPreset.tapTarget, paddingVertical: homeLayoutPreset.chipPaddingVertical, paddingHorizontal: homeLayoutPreset.chipPaddingHorizontal }, isDay && styles.dayLocalTimePill]}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`Current time: ${formattedTime}`}
            >
              {clockDisplayStyle === "Analog" ? (
                <View style={[styles.analogClock, isDay && styles.dayAnalogClock]} accessible={false}>
                  {Array.from({ length: 12 }).map((_, tickIndex) => (
                    <View key={tickIndex} style={[styles.analogClockTickRail, { transform: [{ rotate: `${tickIndex * 30}deg` }] }]}>
                      <View style={[styles.analogClockTick, tickIndex % 3 === 0 && styles.analogClockHourTick, isDay && styles.dayAnalogClockTick]} />
                    </View>
                  ))}
                  <Text style={[styles.analogClockNumber, styles.analogClockNumber12, isDay && styles.dayAnalogClockNumber]}>12</Text>
                  <Text style={[styles.analogClockNumber, styles.analogClockNumber3, isDay && styles.dayAnalogClockNumber]}>3</Text>
                  <Text style={[styles.analogClockNumber, styles.analogClockNumber6, isDay && styles.dayAnalogClockNumber]}>6</Text>
                  <Text style={[styles.analogClockNumber, styles.analogClockNumber9, isDay && styles.dayAnalogClockNumber]}>9</Text>
                  <View style={[styles.analogHandRail, { transform: [{ rotate: analogHourRotation }] }]}>
                    <View style={[styles.analogHandStem, styles.analogHandHour, isDay && styles.dayAnalogHand]} />
                  </View>
                  <View style={[styles.analogHandRail, { transform: [{ rotate: analogMinuteRotation }] }]}>
                    <View style={[styles.analogHandStem, styles.analogHandMinute, isDay && styles.dayAnalogHand]} />
                  </View>
                  <View style={[styles.analogHandRail, { transform: [{ rotate: analogSecondRotation }] }]}>
                    <View style={[styles.analogHandStem, styles.analogHandSecond]} />
                  </View>
                  <View style={[styles.analogClockDot, isDay && styles.dayAnalogClockDot]} />
                </View>
              ) : null}
              {shouldShowDigitalClock ? (
                <Text style={[styles.localTimeText, isDay && styles.dayHeadingText]}>{formattedTime}</Text>
              ) : null}
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.84}
          onPress={() => router.push("/(tabs)/alpha-walkthrough" as never)}
          accessibilityRole="button"
          accessibilityLabel="Open Alpha Tester Walkthrough"
          accessibilityHint="Opens the local prototype walkthrough for NSN testers."
          style={[styles.homeAlphaGuideCard, homeLayoutUtilityCardStyle, isDay && styles.dayHeaderPlaceholderCard, outlinedCardStyle, isRtl && styles.rtlRow]}
        >
          <View style={[styles.homeAlphaGuideIcon, isDay && styles.daySectionToggle]}>
            <IconSymbol name="visibility" color={isDay ? "#445E93" : "#C7B07A"} size={18} />
          </View>
          <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
            <Text style={[styles.homeAlphaGuideKicker, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Alpha testing</Text>
            <Text style={[styles.headerPlaceholderTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Tester walkthrough</Text>
            <Text style={[styles.headerPlaceholderCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]} numberOfLines={effectiveHomeLayoutDensity === "Compact" ? 1 : 2}>
              A compact guide to what is demo-only, saved locally, and ready for feedback.
            </Text>
          </View>
          <IconSymbol name={isRtl ? "chevron.left" : "chevron.right"} color={isDay ? "#53677A" : nsnColors.muted} size={18} />
        </TouchableOpacity>

        {showHomeControls || showCustomiseHome || showLayoutPreferences || showOptionsHub ? (
          <View style={[styles.homeControlsCard, homeLayoutPanelStyle, isDay && styles.dayHeaderPlaceholderCard, outlinedCardStyle]}>
            <ScrollView
              style={[styles.homeControlsPanelScroll, { maxHeight: homeLayoutPreset.panelMaxHeight }]}
              contentContainerStyle={[styles.homeControlsPanelContent, { gap: homeLayoutPreset.mobileStackGap }]}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
            >
            <View style={[styles.locationSearchHeader, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
                <Text style={[styles.headerPlaceholderTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>
                  {showOptionsHub ? "Options" : showLayoutPreferences ? "View Preferences" : showCustomiseHome ? "Customize Home" : "Home Preferences"}
                </Text>
                <Text style={[styles.headerPlaceholderCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  {showOptionsHub
                    ? "One calm place for Home, preferences, meetups, safety, alpha testing, and local prototype tools."
                    : showLayoutPreferences
                    ? "Choose how event cards appear on your screen."
                    : showCustomiseHome
                      ? "Choose which Home sections stay visible in this prototype."
                      : "Tune filters, spacing, and the dashboard feel."}
                </Text>
              </View>
              {homeUpdateNotice ? <Text style={[styles.homeUpdateNotice, isDay && styles.dayLinkText]}>{homeUpdateNotice}</Text> : null}
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={closeHomePanel}
                accessibilityRole="button"
                accessibilityLabel={showOptionsHub ? "Collapse Options" : "Collapse Home filters"}
                style={[styles.homeCollapseButton, homeLayoutSmallActionStyle, isDay && styles.dayHeaderPlaceholderDismiss, outlinedButtonStyle]}
              >
                <IconSymbol name="chevron.down" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                <Text style={[styles.homeSummaryAdjustText, isDay && styles.dayMutedText]}>Collapse Panel</Text>
              </TouchableOpacity>
            </View>
            {showOptionsHub ? renderOptionsHub() : renderDefaultDashboardControl()}
            {showHomeControls ? (
              <>
            <View style={[styles.homeControlGroup, { gap: homeLayoutPreset.chipGap }]}>
              <Text style={[styles.homeControlGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Primary view</Text>
              <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              {(["Essential", "Comfortable"] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.82}
                  onPress={() => updateHomeViewMode(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: homeViewMode === option }}
                  accessibilityLabel={`${option} view`}
                  style={[styles.homeControlChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton, homeViewMode === option && styles.homeControlChipActive]}
                >
                  <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText, homeViewMode === option && styles.homeControlChipTextActive]}>
                    {homeViewMode === option ? "Selected: " : ""}{homeViewModeLabels[option]}
                  </Text>
                </TouchableOpacity>
              ))}
              </View>
              <Text style={[styles.homeSelectedCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                {homeLayoutPreferenceRoles.primaryView}
              </Text>
            </View>
            <View style={[styles.homeControlGroup, { gap: homeLayoutPreset.chipGap }]}>
              <Text style={[styles.homeControlGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Optional filters</Text>
              <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              {[
                { label: homeFilterLabels.nearby, value: homeNearbyOnly, update: (value: boolean) => saveSoftHelloMvpState({ homeNearbyOnly: value }) },
                { label: homeFilterLabels.smallGroups, value: homeSmallGroupsOnly, update: (value: boolean) => saveSoftHelloMvpState({ homeSmallGroupsOnly: value }) },
                { label: homeFilterLabels.weatherSafe, value: homeWeatherSafeOnly, update: (value: boolean) => saveSoftHelloMvpState({ homeWeatherSafeOnly: value }) },
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.label}
                  activeOpacity={0.82}
                  onPress={() => {
                    filter.update(!filter.value);
                    showPrototypeUpdate("Filters saved locally");
                  }}
                  accessibilityRole="switch"
                  accessibilityState={{ checked: filter.value }}
                  accessibilityLabel={filter.label}
                  style={[styles.homeControlChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton, filter.value && styles.homeControlChipActive]}
                >
                  <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText, filter.value && styles.homeControlChipTextActive]}>
                    {filter.value ? "On: " : ""}{filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
              </View>
            </View>
            <View style={[styles.homeControlGroup, { gap: homeLayoutPreset.chipGap }]}>
              <Text style={[styles.homeControlGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Event display</Text>
              <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              {(["List", "Map"] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.82}
                  onPress={() => updateHomeEventLayout(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: homeEventLayout === option }}
                  accessibilityLabel={`${option} event view`}
                  style={[styles.homeControlChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton, homeEventLayout === option && styles.homeControlChipActive]}
                >
                  <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText, homeEventLayout === option && styles.homeControlChipTextActive]}>
                    {homeEventLayout === option ? "Selected: " : ""}{homeEventLayoutLabels[option]}
                  </Text>
                </TouchableOpacity>
              ))}
              </View>
            </View>
            <View style={[styles.homeControlGroup, { gap: homeLayoutPreset.chipGap }]}>
              {renderHomeDisclosureToggle({
                title: "Advanced display settings",
                copy: "Spacing, header density, day/night behaviour, and outlines stay available without crowding the first view.",
                open: openHomeAdvancedSettings,
                onPress: () => setOpenHomeAdvancedSettings((current) => !current),
              })}
              {openHomeAdvancedSettings ? (
                <View style={[styles.homeDisclosureBody, { gap: homeLayoutPreset.mobileStackGap }]}>
                  {homePreferenceDisclosure.advanced.includes("layoutComfort") ? (
                    <View style={[styles.homeControlGroup, { gap: homeLayoutPreset.chipGap }]}>
                      <Text style={[styles.homeControlGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Layout comfort</Text>
                      <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                        {homeDensityOptions.map((option) => {
                          const active = homeLayoutDensity === option.value;

                          return (
                            <TouchableOpacity
                              key={option.value}
                              activeOpacity={0.84}
                              onPress={() => updateHomeLayoutDensity(option.value)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                              accessibilityLabel={`${option.label} Home layout density`}
                              style={[styles.homeControlChip, styles.homeSegmentChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton, active && styles.homeControlChipActive]}
                            >
                              <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText, active && styles.homeControlChipTextActive]}>
                                {active ? "Selected: " : ""}{option.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      <Text style={[styles.homeSelectedCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                        {homeDensityOptions.find((option) => option.value === homeLayoutDensity)?.copy}. {homeLayoutPreferenceRoles.layoutComfort}
                      </Text>
                    </View>
                  ) : null}
                  {homePreferenceDisclosure.advanced.includes("headerControls") ? (
                    <View style={[styles.homeControlGroup, { gap: homeLayoutPreset.chipGap }]}>
                      <Text style={[styles.homeControlGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Header controls</Text>
                      <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                        {homeHeaderControlDensityOptions.map((option) => {
                          const active = homeHeaderControlsDensity === option.value;

                          return (
                            <TouchableOpacity
                              key={option.value}
                              activeOpacity={0.84}
                              onPress={() => updateHomeHeaderControlsDensity(option.value)}
                              accessibilityRole="button"
                              accessibilityState={{ selected: active }}
                              accessibilityLabel={`${option.label} header controls`}
                              style={[styles.homeControlChip, styles.homeSegmentChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton, active && styles.homeControlChipActive]}
                            >
                              <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText, active && styles.homeControlChipTextActive]}>
                                {active ? "Selected: " : ""}{option.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      <Text style={[styles.homeSelectedCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                        {homeHeaderControlDensityOptions.find((option) => option.value === homeHeaderControlsDensity)?.copy}
                      </Text>
                    </View>
                  ) : null}
                  {homePreferenceDisclosure.advanced.includes("dayNightBehaviour") ? (
                    <View style={[styles.homeControlGroup, { gap: homeLayoutPreset.chipGap }]}>
                      <Text style={[styles.homeControlGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Day/Night behaviour</Text>
                      <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                        {(["Manual toggle", "Follow system/device time", "Follow selected suburb/local time"] as const).map((option) => {
                          const active = dayNightModePreference === option;
                          const label = option === "Manual toggle" ? "Manual" : option === "Follow system/device time" ? "Device Time" : "Local Time";

                          return (
                            <TouchableOpacity
                              key={option}
                              activeOpacity={0.82}
                              onPress={() => updateDayNightModePreference(option)}
                              accessibilityRole="radio"
                              accessibilityState={{ checked: active }}
                              accessibilityLabel={`${label} Day Night behaviour`}
                              style={[styles.homeControlChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton, active && styles.homeControlChipActive]}
                            >
                              <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText, active && styles.homeControlChipTextActive]}>
                                {active ? "Selected: " : ""}{label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}
                  {homePreferenceDisclosure.advanced.includes("cardOutlineStyle") ? (
                    <View style={[styles.homeControlGroup, { gap: homeLayoutPreset.chipGap }]}>
                      <Text style={[styles.homeControlGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Card outline style</Text>
                      <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                        {cardOutlineOptions.map((option) => {
                          const active = cardOutlineStyle === option.value;

                          return (
                            <TouchableOpacity
                              key={option.value}
                              activeOpacity={0.82}
                              onPress={() => updateCardOutlineStyle(option.value)}
                              accessibilityRole="radio"
                              accessibilityState={{ checked: active }}
                              accessibilityLabel={`${option.label} card outline style`}
                              style={[styles.homeControlChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton, active && styles.homeControlChipActive]}
                            >
                              <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText, active && styles.homeControlChipTextActive]}>
                                {active ? "Selected: " : ""}{option.label}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
            <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={showCustomizeHomePanel}
                accessibilityRole="button"
                accessibilityLabel="Customize Home sections"
                style={[styles.homeControlChip, styles.homePanelNavChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton]}
              >
                <IconSymbol name="settings" color={isDay ? "#445E93" : "#C7B07A"} size={16} />
                <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText]}>Customize Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={showLayoutPreferencesPanel}
                accessibilityRole="button"
                accessibilityLabel="View event layout preferences"
                style={[styles.homeControlChip, styles.homePanelNavChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton]}
              >
                <IconSymbol name="visibility" color={isDay ? "#445E93" : "#C7B07A"} size={16} />
                <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText]}>View Preferences</Text>
              </TouchableOpacity>
            </View>
              </>
            ) : null}
            {showCustomiseHome ? (
              <>
              <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={showViewFilterPlaceholder}
                  accessibilityRole="button"
                  accessibilityLabel="Open Home Preferences"
                  style={[styles.homeControlChip, styles.homePanelNavChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton]}
                >
                  <IconSymbol name="settings" color={isDay ? "#445E93" : "#C7B07A"} size={16} />
                  <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText]}>Home Preferences</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.homeSectionOrderList, { gap: homeLayoutPreset.chipGap }]}>
                {homeSectionOrder.map((key, index) => {
                  const visible = homeVisibleSections[key];

                  return (
                    <View key={key} style={[styles.homeSectionOrderItem, { borderRadius: Math.max(15, homeLayoutPreset.cardRadius - 5), minHeight: homeLayoutPreset.cardMinHeight - 20, gap: homeLayoutPreset.chipGap, paddingHorizontal: homeLayoutPreset.cardPadding - 4, paddingVertical: homeLayoutPreset.cardPadding - 6 }, isDay && styles.dayLocationResultButton, visible && styles.homeSectionOrderItemActive]}>
                      <View style={[styles.homeSectionOrderMain, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                        <View style={[styles.homeSectionHandle, isDay && styles.daySectionToggle]}>
                          <IconSymbol name="more" color={isDay ? "#53677A" : "#7890B8"} size={18} />
                        </View>
                        <IconSymbol name={homeSectionIcons[key]} color={visible ? "#C7B07A" : isDay ? "#445E93" : "#9FB0CD"} size={17} />
                        <View style={[styles.homeSectionOrderText, isRtl && styles.rtlBlock]}>
                          <Text style={[styles.homeSectionOrderTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{homeSectionLabels[key]}</Text>
                          <Text style={[styles.homeSectionOrderMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                            {visible ? "Visible on Home" : "Hidden from Home"}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.homeSectionRowControls, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                        <TouchableOpacity
                          activeOpacity={0.82}
                          onPress={() => updateHomeSection(key, !visible)}
                          accessibilityRole="switch"
                          accessibilityState={{ checked: visible }}
                          accessibilityLabel={`${homeSectionLabels[key]} visibility`}
                          style={[styles.homeSectionVisibilityButton, homeLayoutSmallActionStyle, visible && styles.homeSectionVisibilityButtonActive]}
                        >
                          <Text style={[styles.homeSectionVisibilityText, visible && styles.homeControlChipTextActive]}>
                            {visible ? "Shown" : "Hidden"}
                          </Text>
                        </TouchableOpacity>
                        <View style={[styles.homeSectionMoveControls, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                          <TouchableOpacity
                            activeOpacity={0.78}
                            onPress={() => moveHomeSection(key, -1)}
                            disabled={index === 0}
                            accessibilityRole="button"
                            accessibilityLabel={`Move ${homeSectionLabels[key]} up`}
                            accessibilityHint={index === 0 ? "This Home section is already first." : "Moves this Home section up and saves locally."}
                            style={[styles.homeSectionMoveButton, homeLayoutRoundButtonStyle, index === 0 && styles.disabledMoveButton]}
                          >
                            <IconSymbol name="chevron.up" color={index === 0 ? "#607086" : isDay ? "#445E93" : "#C7B07A"} size={17} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.78}
                            onPress={() => moveHomeSection(key, 1)}
                            disabled={index === homeSectionOrder.length - 1}
                            accessibilityRole="button"
                            accessibilityLabel={`Move ${homeSectionLabels[key]} down`}
                            accessibilityHint={index === homeSectionOrder.length - 1 ? "This Home section is already last." : "Moves this Home section down and saves locally."}
                            style={[styles.homeSectionMoveButton, homeLayoutRoundButtonStyle, index === homeSectionOrder.length - 1 && styles.disabledMoveButton]}
                          >
                            <IconSymbol name="chevron.down" color={index === homeSectionOrder.length - 1 ? "#607086" : isDay ? "#445E93" : "#C7B07A"} size={17} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
              </>
            ) : null}
            {showLayoutPreferences ? (
              <>
                <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                  <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={showViewFilterPlaceholder}
                    accessibilityRole="button"
                    accessibilityLabel="Open Home Preferences"
                    style={[styles.homeControlChip, styles.homePanelNavChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton]}
                  >
                    <IconSymbol name="settings" color={isDay ? "#445E93" : "#C7B07A"} size={16} />
                    <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText]}>Home Preferences</Text>
                  </TouchableOpacity>
                </View>
                {homeLayoutDisclosure.primary.includes("eventVisuals") ? (
                  <View style={[styles.homeControlGroup, { gap: homeLayoutPreset.chipGap }]}>
                    <Text style={[styles.homeControlGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Event visuals</Text>
                    <View style={[styles.homeControlRow, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
                      {homeEventVisualModeOptions.map((option) => {
                        const active = homeEventVisualMode === option.value;

                        return (
                          <TouchableOpacity
                            key={option.value}
                            activeOpacity={0.84}
                            onPress={() => updateHomeEventVisualMode(option.value)}
                            accessibilityRole="button"
                            accessibilityState={{ selected: active }}
                            accessibilityLabel={`${option.label} event visual mode`}
                            style={[styles.homeControlChip, styles.homeSegmentChip, homeLayoutChipStyle, isDay && styles.dayLocationResultButton, active && styles.homeControlChipActive]}
                          >
                            <Text style={[styles.homeControlChipText, isDay && styles.dayHeadingText, active && styles.homeControlChipTextActive]}>
                              {active ? "Selected: " : ""}{option.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <Text style={[styles.homeSelectedCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                      {homeEventVisualModeOptions.find((option) => option.value === homeEventVisualMode)?.copy}
                    </Text>
                  </View>
                ) : null}
                {homeLayoutDisclosure.advanced.includes("eventCardLayouts") ? (
                  <View style={[styles.homeControlGroup, { gap: homeLayoutPreset.chipGap }]}>
                    {renderHomeDisclosureToggle({
                      title: "Card layout styles",
                      copy: `${homeCardLayout} is active. Open this only when you want to compare card shapes.`,
                      open: openHomeLayoutStyles,
                      onPress: () => setOpenHomeLayoutStyles((current) => !current),
                    })}
                    {openHomeLayoutStyles ? (
                      <View style={[styles.homeDisclosureBody, { gap: homeLayoutPreset.mobileStackGap }]}>
                        <View style={[styles.layoutCompactList, { gap: homeLayoutPreset.chipGap }]}>
                          {homeCardLayoutOptions.map((option) => {
                            const active = homeCardLayout === option.value;

                            return (
                              <TouchableOpacity
                                key={option.value}
                                activeOpacity={0.84}
                                onPress={() => updateHomeCardLayout(option.value)}
                                accessibilityRole="button"
                                accessibilityState={{ selected: active }}
                                accessibilityLabel={`${option.label} event card layout`}
                                style={[styles.layoutCompactOption, homeLayoutUtilityCardStyle, isDay && styles.dayLocationResultButton, active && styles.layoutPreferenceCardActive]}
                              >
                                <LayoutPreviewIcon layout={option.value} active={active} isDay={isDay} />
                                <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
                                  <Text style={[styles.layoutPreferenceTitle, isDay && styles.dayHeadingText, active && styles.homeControlChipTextActive, isRtl && styles.rtlText]}>
                                    {active ? "Selected: " : ""}{option.label}
                                  </Text>
                                  <Text style={[styles.layoutPreferenceCopy, isDay && styles.dayMutedText, active && styles.homeControlChipTextActive, isRtl && styles.rtlText]}>
                                    {option.copy}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </>
            ) : null}
            </ScrollView>
          </View>
        ) : null}

        {headerPlaceholder ? (
          <View
            style={[styles.headerPlaceholderCard, homeLayoutUtilityCardStyle, isDay && styles.dayHeaderPlaceholderCard, outlinedCardStyle, isRtl && styles.rtlRow]}
            accessibilityRole="alert"
          >
            <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
              <Text style={[styles.headerPlaceholderTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>
                {headerPlaceholder.title}
              </Text>
              <Text style={[styles.headerPlaceholderCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                {headerPlaceholder.copy}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={() => setHeaderPlaceholder(null)}
              accessibilityRole="button"
              accessibilityLabel={homeCopy.dismissMessage}
              style={[styles.headerPlaceholderDismiss, homeLayoutSmallActionStyle, isDay && styles.dayHeaderPlaceholderDismiss, outlinedButtonStyle]}
            >
              <IconSymbol name="xmark" color={isDay ? "#53677A" : nsnColors.muted} size={14} />
              <Text style={[styles.headerPlaceholderDismissText, isDay && styles.dayMutedText]}>Close</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {showNsnSearch ? (
          <View style={[styles.locationSearchCard, homeLayoutPanelStyle, isDay && styles.dayHeaderPlaceholderCard, outlinedCardStyle]}>
            <View style={[styles.locationSearchHeader, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              <View style={[styles.headerPlaceholderBody, isRtl && styles.rtlBlock]}>
                <Text style={[styles.headerPlaceholderTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>
                  Search NSN
                </Text>
                <Text style={[styles.headerPlaceholderCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  Search suburbs and regions for your local area, or switch to meetups for activities like coffee, walks, and board games.
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.78}
                onPress={closeHomePanel}
                accessibilityRole="button"
                accessibilityLabel="Close Search NSN"
                style={[styles.headerPlaceholderDismiss, homeLayoutSmallActionStyle, isDay && styles.dayHeaderPlaceholderDismiss, outlinedButtonStyle]}
              >
                <IconSymbol name="xmark" color={isDay ? "#53677A" : nsnColors.muted} size={14} />
                <Text style={[styles.headerPlaceholderDismissText, isDay && styles.dayMutedText]}>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.searchModeTabs, { gap: homeLayoutPreset.chipGap }, isRtl && styles.rtlRow]}>
              {(["areas", "meetups"] as const).map((modeKey) => {
                const active = homeSearchMode === modeKey;
                const label = modeKey === "areas" ? "Suburbs & areas" : "Meetups";

                return (
                  <TouchableOpacity
                    key={modeKey}
                    activeOpacity={0.82}
                    onPress={() => {
                      setHomeSearchMode(modeKey);
                      setNsnSearchQuery("");
                    }}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={label}
                    style={[styles.searchModeTab, homeLayoutChipStyle, isDay && styles.dayLocationResultButton, active && styles.searchModeTabActive]}
                  >
                    <Text style={[styles.searchModeTabText, isDay && styles.dayHeadingText, active && styles.searchModeTabTextActive]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {homeSearchMode === "areas" ? (
              <>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={detectLocalArea}
              disabled={detectingLocation}
              accessibilityRole="button"
              accessibilityLabel="Use current location"
              accessibilityHint="Requests permission and detects the closest supported Sydney or North Shore prototype area."
              accessibilityState={{ disabled: detectingLocation }}
              style={[styles.detectLocationButton, { minHeight: homeLayoutPreset.tapTarget, borderRadius: Math.max(14, homeLayoutPreset.cardRadius - 8), paddingHorizontal: homeLayoutPreset.chipPaddingHorizontal }, detectingLocation && styles.detectLocationButtonDisabled]}
            >
              <IconSymbol name="location" color={nsnColors.text} size={18} />
              <Text style={styles.detectLocationButtonText}>
                {detectingLocation ? "Detecting local area..." : "Use current location"}
              </Text>
            </TouchableOpacity>
            <LocalAreaPicker
              query={nsnSearchQuery}
              onQueryChange={setNsnSearchQuery}
              onSelect={chooseLocalArea}
              selectedAreaId={timezone.id}
              isDay={isDay}
              isRtl={isRtl}
              limit={7}
            />
              </>
            ) : null}
            {homeSearchMode === "meetups" ? (
              <View style={[styles.locationInputWrap, isDay && styles.dayLocationInputWrap, isRtl && styles.rtlRow]}>
                <IconSymbol name="magnifyingglass" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                <TextInput
                  value={nsnSearchQuery}
                  onChangeText={setNsnSearchQuery}
                  placeholder="Search meetup activity..."
                  placeholderTextColor={isDay ? "#63758A" : nsnColors.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Search NSN meetups"
                  style={[styles.locationInput, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}
                />
              </View>
            ) : null}
            {homeSearchMode === "meetups" && !normalizedNsnSearchQuery ? (
              <View style={[styles.searchPromptCard, homeLayoutUtilityCardStyle, isDay && styles.dayLocationResultButton]}>
                <Text style={[styles.locationResultTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>
                  Search for a meetup idea or activity.
                </Text>
                <Text style={[styles.locationResultMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  Try coffee, walk, board games, library, or ramen.
                </Text>
              </View>
            ) : null}
            {homeSearchMode === "meetups" && matchingMeetups.length > 0 ? (
              <View style={[styles.searchResultGroup, { gap: homeLayoutPreset.chipGap }]}>
                <Text style={[styles.searchResultGroupTitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Matching meetups</Text>
                <View style={[styles.searchResultStack, { gap: homeLayoutPreset.chipGap }]}>
                  {matchingMeetups.map((event) => {
                    const eventCopy = { ...event, ...(eventTranslations[appLanguageBase]?.[event.id] ?? {}) };

                    return (
                      <TouchableOpacity
                        key={event.id}
                        activeOpacity={0.82}
                        onPress={() => {
                          setHighlightedEventId(event.id);
                          router.push(`/event/${event.id}`);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Open meetup ${eventCopy.title}`}
                        style={[styles.locationResultButton, styles.meetupSearchResultButton, homeLayoutUtilityCardStyle, isDay && styles.dayLocationResultButton]}
                      >
                        <View style={[styles.searchResultTopLine, isRtl && styles.rtlRow]}>
                          <Text style={[styles.locationResultTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{eventCopy.title}</Text>
                          <Text style={styles.searchResultBadge}>Meetup</Text>
                        </View>
                        <Text style={[styles.locationResultMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{eventCopy.venue} - {eventCopy.category}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null}
            {hasNoMeetupSearchResults ? (
              <View style={[styles.searchEmptyCard, homeLayoutUtilityCardStyle, isDay && styles.dayLocationResultButton]}>
                <Text style={[styles.locationResultTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>No matching meetups yet.</Text>
                <Text style={[styles.locationResultMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  Try another suburb, region, or activity - NSN is still an early local prototype.
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {shouldShowThemeSuggestion ? (
          <View style={[styles.themeSuggestionCard, homeLayoutUtilityCardStyle, isDay && styles.dayThemeSuggestionCard, outlinedCardStyle, isRtl && styles.rtlRow]}>
            <Text style={styles.themeSuggestionIcon}>{themeSuggestion.icon}</Text>
            <View style={[styles.themeSuggestionBody, isRtl && styles.rtlBlock]}>
              <Text style={[styles.themeSuggestionTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{themeSuggestion.title}</Text>
              <Text style={[styles.themeSuggestionCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{themeSuggestion.copy}</Text>
              <View style={[styles.themeSuggestionActions, isRtl && styles.rtlRow]}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => switchToSuggestedTheme(localTimeSuggestedMode)}
                  accessibilityRole="button"
                  accessibilityLabel={localTimeSuggestedMode === "night" ? homeCopy.switchToNightMode : homeCopy.switchToDayMode}
                  style={[styles.themeSuggestionSwitch, homeLayoutSmallActionStyle]}
                >
                  <Text style={styles.themeSuggestionSwitchText}>{themeSuggestion.button}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => setDismissedThemeSuggestion(localTimeSuggestedMode)}
                  accessibilityRole="button"
                  accessibilityLabel={homeCopy.dismissThemeSuggestion}
                  style={[styles.themeSuggestionDismiss, homeLayoutSmallActionStyle, isDay && styles.dayThemeSuggestionDismiss, outlinedButtonStyle]}
                >
                  <IconSymbol name="xmark" color={isDay ? "#53677A" : nsnColors.muted} size={14} />
                  <Text style={[styles.themeSuggestionDismissText, isDay && styles.dayMutedText]}>{homeCopy.notNow}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        <View style={[styles.homeSectionFlow, { gap: homeLayoutPreset.sectionGap, marginBottom: homeLayoutPreset.sectionGap }]}>
          {homeSectionOrder.map((sectionKey) => renderHomeSection(sectionKey))}
        </View>
      
        {homeViewMode === "Comfortable" ? (
          <>
        <TouchableOpacity activeOpacity={0.88} onPress={() => router.push("/(tabs)/events")} style={[styles.createMeetupButton, { minHeight: homeLayoutPreset.tapTarget + 8, marginTop: homeLayoutPreset.sectionGap, borderRadius: Math.max(15, homeLayoutPreset.cardRadius - 5) }, outlinedButtonStyle, isRtl && styles.rtlRow]}>
          <IconSymbol name="add" color={nsnColors.text} size={20} />
          <Text style={[styles.createMeetupButtonText, isRtl && styles.rtlText]}>
            {"createMeetup" in copy ? copy.createMeetup : "Create a Meetup"}
          </Text>
        </TouchableOpacity>

        <View style={[styles.insightGrid, { gap: homeLayoutPreset.desktopGridGap, marginTop: homeLayoutPreset.sectionGap }, isRtl && styles.rtlRow]}>
          <TouchableOpacity activeOpacity={0.84} onPress={() => setExpandedInsight(expandedInsight === "day-night" ? null : "day-night")} style={[styles.insightCard, homeLayoutCardStyle, isDay ? styles.dayCard : null]}>
            <Text style={styles.insightIcon}>☀️</Text>
            <Text style={[styles.insightTitle, isDay ? styles.dayHeadingText : null, isRtl && styles.rtlText]}>{copy.dayVsNight}</Text>
            <Text style={[styles.insightCopy, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{copy.dayVsNightCopy}</Text>
            <Text style={[styles.moreInfoText, isRtl && styles.rtlText]}>{copy.clickForMore}</Text>
            {expandedInsight === "day-night" ? (
              <Text style={[styles.insightDetail, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{copy.dayVsNightMore}</Text>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.84} onPress={() => setExpandedInsight(expandedInsight === "weather" ? null : "weather")} style={[styles.insightCard, homeLayoutCardStyle, isDay ? styles.dayCard : null]}>
            <Text style={styles.insightIcon}>🌧</Text>
            <Text style={[styles.insightTitle, isDay ? styles.dayHeadingText : null, isRtl && styles.rtlText]}>{copy.weatherAdaptive}</Text>
            <Text style={[styles.insightCopy, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{copy.weatherAdaptiveCopy}</Text>
            <Text style={[styles.moreInfoText, isRtl && styles.rtlText]}>{copy.clickForMore}</Text>
            {expandedInsight === "weather" ? (
              <Text style={[styles.insightDetail, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{copy.weatherAdaptiveMore}</Text>
            ) : null}
          </TouchableOpacity>
        </View>
          </>
        ) : null}
      </ScrollView>
      </Animated.View>
    </ScreenContainer>
  );
}

// Styling
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B1626" },
  animatedScreen: { flex: 1 },
  scrollSurface: { flex: 1, backgroundColor: "transparent" },
  scrollSurfaceLocked: { overflow: "hidden" },
  modeGlow: { position: "absolute", top: -58, alignSelf: "center", width: 230, height: 230, borderRadius: 115 },
  dayBellButton: {backgroundColor: "#F4F7F8", },
  dayBellText: { color: "#0B1220", },
  dayCard: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA", },
  dayHeadingText: { color: "#0B1220", },
  dayLinkText: { color: "#445E93", },
  dayMutedText: { color: "#53677A", },
  outlineMinimal: { borderWidth: 1, borderColor: "#2A3C59" },
  outlineStandard: { borderWidth: 1.25, borderColor: "#4D6794" },
  outlineStrong: { borderWidth: 1.75, borderColor: "#7890B8" },
  dayOutlineMinimal: { borderWidth: 1, borderColor: "#C5D0DA" },
  dayOutlineStandard: { borderWidth: 1.25, borderColor: "#9FB2C8" },
  dayOutlineStrong: { borderWidth: 1.75, borderColor: "#6F87A1" },
  buttonOutlineMinimal: { borderWidth: 1, borderColor: "#38527C" },
  buttonOutlineStandard: { borderWidth: 1.25, borderColor: "#5F79A9" },
  buttonOutlineStrong: { borderWidth: 1.5, borderColor: "#7890B8" },
  dayButtonOutlineMinimal: { borderWidth: 1, borderColor: "#C5D0DA" },
  dayButtonOutlineStandard: { borderWidth: 1.25, borderColor: "#9FB2C8" },
  dayButtonOutlineStrong: { borderWidth: 1.5, borderColor: "#6F87A1" },
  dayLivePreview: { borderColor: "#C5D0DA", backgroundColor: "#E6EDF1" },
  dayPill: { backgroundColor: "#F5F7F8", borderColor: "#C5D0DA", },
  dayPillActive: { backgroundColor: "#536C9E", borderColor: "#536C9E", },
  dayPillText: { color: "#0B1220", },
  dayPillTextActive: { color: "#FFFFFF", },
  dayScreen: { backgroundColor: "#E8EDF2" },
  dayText: { color: "#1E252C", },
  dayNoiseLevelItem: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  dayNoiseLevelItemActive: { backgroundColor: "#DFE8EF", borderColor: "#6F87A1" },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 112 },
  contentCompact: { paddingTop: 6, paddingBottom: 96 },
  contentSpacious: { paddingTop: 14, paddingBottom: 126 },
  contentAutoFit: { paddingTop: 8, paddingBottom: 92 },
  contentLockedDashboard: { paddingBottom: 132 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 12 },
  headerTitle: { flex: 1, minWidth: 0 },
  headerActions: { flexShrink: 0, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: 9, marginLeft: 12 },
  headerActionsCompact: { gap: 6 },
  headerActionsSpacious: { gap: 11 },
  headerActionButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#5F79A9", backgroundColor: "#163F8D" },
  headerActionButtonCompact: { width: 38, height: 38, borderRadius: 19 },
  headerActionButtonSpacious: { width: 46, height: 46, borderRadius: 23 },
  headerModeToggle: { height: 42, flexDirection: "row", gap: 4, borderRadius: 21, padding: 4, backgroundColor: "#0F1B2C", borderWidth: 1, borderColor: "#38527C" },
  headerModeToggleCompact: { height: 38, borderRadius: 19, padding: 3 },
  headerModeToggleSpacious: { height: 46, borderRadius: 23, padding: 5 },
  headerModeToggleOption: { width: 34, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  headerModeToggleOptionCompact: { width: 31, height: 30, borderRadius: 15 },
  headerModeToggleOptionSpacious: { width: 36, height: 34, borderRadius: 17 },
  headerModeToggleIcon: { color: "#FFFFFF", fontSize: 16, fontWeight: "900", lineHeight: 20 },
  localDashboardHeader: { alignItems: "center", justifyContent: "center", borderRadius: 24, borderWidth: 1, borderColor: "#38527C", backgroundColor: "#0F2340", paddingHorizontal: 20, paddingVertical: 18, marginBottom: 12 },
  localDashboardHeaderAutoFit: { paddingVertical: 14, marginBottom: 10 },
  dayLocalDashboardHeader: { backgroundColor: "#F4F7F8", borderColor: "#B7C7DD" },
  localDashboardBody: { alignItems: "center", minWidth: 0 },
  localDashboardKicker: { color: "#A8B7DA", fontSize: 10, fontWeight: "900", lineHeight: 14, textTransform: "uppercase", marginBottom: 5 },
  greetingText: { color: nsnColors.text, fontSize: 27, fontWeight: "900", lineHeight: 33, textAlign: "center" },
  localMetaRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 5 },
  localMetaText: { color: nsnColors.muted, fontSize: 14, fontWeight: "800", lineHeight: 19, textAlign: "center" },
  localTimePill: { alignSelf: "center", minHeight: 42, flexDirection: "row", gap: 12, borderRadius: 28, borderWidth: 1, borderColor: "#5F79A9", backgroundColor: "#132B52", paddingHorizontal: 12, paddingVertical: 9, alignItems: "center", justifyContent: "center", marginTop: 10 },
  dayLocalTimePill: { backgroundColor: "#E4ECF4", borderColor: "#B7C7DD" },
  localTimeText: { color: nsnColors.text, fontSize: 18, fontWeight: "900", lineHeight: 23 },
  localDateText: { color: nsnColors.muted, fontSize: 11, fontWeight: "800", lineHeight: 15, marginTop: 7, textAlign: "center" },
  analogClock: { width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: "#C7B07A", alignItems: "center", justifyContent: "center", backgroundColor: "#F8FAFC" },
  dayAnalogClock: { borderColor: "#284E92", backgroundColor: "#FFFFFF" },
  analogClockNumber: { position: "absolute", color: "#3F4754", fontSize: 16, fontWeight: "900", lineHeight: 19, zIndex: 2 },
  dayAnalogClockNumber: { color: "#284E92" },
  analogClockNumber12: { top: 8, alignSelf: "center" },
  analogClockNumber3: { right: 10, top: 38 },
  analogClockNumber6: { bottom: 7, alignSelf: "center" },
  analogClockNumber9: { left: 10, top: 38 },
  analogClockTickRail: { position: "absolute", left: 0, top: 0, width: 96, height: 96, alignItems: "center" },
  analogClockTick: { width: 3, height: 9, borderRadius: 2, backgroundColor: "#3F4754", marginTop: 7 },
  analogClockHourTick: { width: 5, height: 15, marginTop: 5 },
  dayAnalogClockTick: { backgroundColor: "#284E92" },
  analogClockDot: { position: "absolute", width: 13, height: 13, borderRadius: 7, borderWidth: 3, borderColor: "#D8342A", backgroundColor: "#FFFFFF", zIndex: 5 },
  dayAnalogClockDot: { backgroundColor: "#FFFFFF", borderColor: "#D8342A" },
  analogHandRail: { position: "absolute", left: 0, top: 0, width: 96, height: 96, zIndex: 3 },
  analogHandStem: { position: "absolute", left: 45, bottom: 47, borderRadius: 999, backgroundColor: "#3F4754" },
  analogHandHour: { left: 44.5, width: 7, height: 29 },
  analogHandMinute: { left: 45.5, width: 5, height: 39 },
  analogHandSecond: { left: 47, width: 2, height: 41, backgroundColor: "#D8342A" },
  dayAnalogHand: { backgroundColor: "#284E92" },
  headerPlaceholderCard: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 18, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.055)", paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  homeSearchEntryCard: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 18, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.055)", paddingHorizontal: 14, paddingVertical: 12 },
  homeAlphaGuideCard: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 18, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.055)", marginBottom: 12 },
  homeAlphaGuideIcon: { width: 36, height: 36, borderRadius: 14, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.045)", alignItems: "center", justifyContent: "center" },
  homeAlphaGuideKicker: { color: "#A8B7DA", fontSize: 10, fontWeight: "900", lineHeight: 14, textTransform: "uppercase", marginBottom: 1 },
  homeControlsSummaryCard: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 18, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 14, paddingVertical: 11, marginBottom: 16 },
  homeSummaryChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  homeSummaryChip: { maxWidth: 142, borderRadius: 999, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.055)", color: nsnColors.muted, fontSize: 10, fontWeight: "900", lineHeight: 14, paddingHorizontal: 8, paddingVertical: 3, overflow: "hidden" },
  daySummaryChip: { borderColor: "#C5D0DA", backgroundColor: "#E6EDF1", color: "#53677A" },
  homeSummaryAdjustButton: { minHeight: 32, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  homeSummaryAdjustText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900", lineHeight: 16 },
  homeCollapseButton: { minHeight: 34, borderRadius: 17, borderWidth: 1, borderColor: "#7890B8", backgroundColor: "rgba(31,78,154,0.18)", paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 },
  homeControlsCard: { borderRadius: 20, borderWidth: 1, borderColor: "#38527C", backgroundColor: "rgba(16,33,58,0.94)", padding: 15, marginBottom: 14, gap: 12 },
  homeControlsPanelScroll: { maxHeight: 560 },
  homeControlsPanelContent: { gap: 12, paddingBottom: 2 },
  defaultDashboardButton: { minHeight: 54, borderRadius: 16, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(33,75,149,0.14)", paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  defaultDashboardTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  defaultDashboardCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 15, marginTop: 1 },
  optionsHubStack: { gap: 9 },
  optionsHubCategoryGrid: { flexDirection: "row", flexWrap: "wrap", alignItems: "stretch" },
  optionsHubCategoryCard: { flexGrow: 1, flexShrink: 1, flexBasis: 250, minWidth: 220, borderRadius: 15, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(16,29,49,0.74)", flexDirection: "row", alignItems: "center", gap: 9 },
  optionsHubBackButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  optionsHubSection: { borderRadius: 16, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(255,255,255,0.04)", overflow: "hidden" },
  optionsHubSectionHeader: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  optionsHubIconBadge: { width: 34, height: 34, borderRadius: 13, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.045)", alignItems: "center", justifyContent: "center" },
  optionsHubSectionTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  optionsHubSectionCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 15, marginTop: 1 },
  optionsHubSectionBadge: { minWidth: 24, color: "#C7D3EA", textAlign: "center", borderRadius: 999, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.055)", fontSize: 10, fontWeight: "900", lineHeight: 14, paddingHorizontal: 7, paddingVertical: 3, overflow: "hidden" },
  optionsHubSectionBody: { gap: 8, paddingHorizontal: 10, paddingBottom: 10 },
  optionsHubRow: { minHeight: 62, borderRadius: 15, borderWidth: 1, borderColor: "#3B5276", backgroundColor: "rgba(16,29,49,0.74)", paddingHorizontal: 11, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 9 },
  optionsHubRowTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  optionsHubRowDescription: { color: "#A8B7DA", fontSize: 11, lineHeight: 15, marginTop: 1 },
  optionsHubRowBadge: { maxWidth: 94, color: "#C7D3EA", textAlign: "center", borderRadius: 999, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.055)", fontSize: 10, fontWeight: "900", lineHeight: 14, paddingHorizontal: 7, paddingVertical: 3, overflow: "hidden" },
  optionsHubInlinePanel: { borderRadius: 15, borderWidth: 1, borderColor: "#3B5276", backgroundColor: "rgba(16,29,49,0.74)", padding: 11, gap: 8 },
  optionsHubInlineTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  optionsHubInlineCopy: { color: "#A8B7DA", fontSize: 11, lineHeight: 16 },
  optionsHubInlineMeta: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  optionsHubChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  optionsHubChoiceChip: { flexGrow: 1, flexBasis: 142, minHeight: 58, borderRadius: 14, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "#101D31", paddingHorizontal: 10, paddingVertical: 9 },
  optionsHubChoiceTitle: { color: nsnColors.text, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  optionsHubChoiceCopy: { color: "#A8B7DA", fontSize: 10, lineHeight: 14, marginTop: 2 },
  optionsHubQuestionGroup: { gap: 6 },
  optionsHubQuestionPhase: { color: nsnColors.muted, fontSize: 10, fontWeight: "900", lineHeight: 14, textTransform: "uppercase" },
  optionsHubQuestionChip: { minHeight: 34, borderRadius: 13, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "#101D31", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 7 },
  optionsHubQuestionText: { color: "#C7D3EA", fontSize: 11, fontWeight: "900", lineHeight: 15 },
  optionsHubHelperResult: { borderRadius: 13, borderWidth: 1, borderColor: "rgba(114,214,126,0.3)", backgroundColor: "rgba(114,214,126,0.1)", padding: 10 },
  optionsHubSafetyNote: { color: nsnColors.muted, fontSize: 11, lineHeight: 16, fontWeight: "700" },
  homeControlGroup: { gap: 6 },
  homeControlGroupLabel: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  homeControlRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  homeControlChip: { minHeight: 38, borderRadius: 13, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "#101D31", paddingHorizontal: 12, alignItems: "center", justifyContent: "center" },
  homeControlChipActive: { borderColor: "#D2E0FF", backgroundColor: "#214B95" },
  homeControlChipText: { color: "#C7D3EA", fontSize: 12, fontWeight: "900", lineHeight: 16 },
  homeControlChipTextActive: { color: "#FFFFFF" },
  homeDisclosureToggle: { minHeight: 54, borderRadius: 16, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(255,255,255,0.045)", paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  homeDisclosureTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  homeDisclosureCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 15, marginTop: 1 },
  homeDisclosureBody: { gap: 12, paddingTop: 4 },
  homeSegmentChip: { flexGrow: 1, flexBasis: 104 },
  homeSelectedCopy: { color: nsnColors.muted, fontSize: 11, fontWeight: "800", lineHeight: 15 },
  homeDensityRow: { flexDirection: "row", gap: 10 },
  homeDensityCard: { flex: 1, minHeight: 92, borderRadius: 16, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "#101D31", paddingHorizontal: 11, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  homeDensityCardActive: { borderColor: "#D2E0FF", backgroundColor: "#214B95" },
  homeDensityIcon: { color: nsnColors.muted, fontSize: 30, fontWeight: "900", lineHeight: 34 },
  homeDensityTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, textAlign: "center", marginTop: 3 },
  homeDensityCopy: { color: nsnColors.muted, fontSize: 11, fontWeight: "800", lineHeight: 15, textAlign: "center", marginTop: 2 },
  homeHeaderDensityRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  homeHeaderDensityCard: { flexGrow: 1, flexBasis: 126, minHeight: 76, borderRadius: 15, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "#101D31", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 10 },
  homeHeaderDensityTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 16, textAlign: "center", marginTop: 5 },
  homeHeaderDensityCopy: { color: "#C7D3EA", fontSize: 10, fontWeight: "800", lineHeight: 14, textAlign: "center", marginTop: 1 },
  homePanelNavChip: { flexDirection: "row", gap: 7 },
  layoutPreferenceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  layoutPreferenceCard: { flexGrow: 1, flexBasis: 138, minHeight: 130, borderRadius: 16, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "#101D31", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 12 },
  layoutPreferenceCardActive: { borderColor: "#D2E0FF", backgroundColor: "#214B95" },
  layoutPreferenceIcon: { color: nsnColors.muted, fontSize: 18, fontWeight: "900", lineHeight: 22, marginTop: 4 },
  layoutPreferenceTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 16, textAlign: "center", marginTop: 7 },
  layoutPreferenceCopy: { color: nsnColors.muted, fontSize: 10, fontWeight: "800", lineHeight: 14, textAlign: "center", marginTop: 1 },
  layoutCompactList: { gap: 8 },
  layoutCompactOption: { minHeight: 58, borderRadius: 15, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "#101D31", flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  visualModeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  visualModeCard: { flexGrow: 1, flexBasis: 190, minHeight: 94, borderRadius: 16, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "#101D31", alignItems: "center", justifyContent: "center", paddingHorizontal: 12, paddingVertical: 12 },
  visualModeIcon: { color: nsnColors.muted, fontSize: 28, fontWeight: "900", lineHeight: 32 },
  layoutPreviewCanvas: { width: 54, height: 38, alignItems: "center", justifyContent: "center" },
  layoutPreviewListRow: { width: 48, height: 9, flexDirection: "row", alignItems: "center", gap: 5 },
  layoutPreviewDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#7890B8" },
  layoutPreviewDotActive: { backgroundColor: "#FFFFFF" },
  layoutPreviewLine: { flex: 1, height: 4, borderRadius: 3, backgroundColor: "#7890B8" },
  layoutPreviewLineActive: { backgroundColor: "#FFFFFF" },
  layoutPreviewHorizontal: { flexDirection: "row", gap: 5 },
  layoutPreviewGrid: { width: 42, flexDirection: "row", flexWrap: "wrap", gap: 4 },
  layoutPreviewLayered: { alignItems: "center", justifyContent: "center" },
  layoutPreviewMagazine: { flexDirection: "row", gap: 5 },
  layoutPreviewBlock: { backgroundColor: "#7890B8", borderRadius: 3 },
  dayLayoutPreviewBlock: { backgroundColor: "#6F87A1" },
  layoutPreviewBlockActive: { backgroundColor: "#FFFFFF" },
  layoutPreviewTallBlock: { width: 13, height: 27 },
  layoutPreviewGridBlock: { width: 18, height: 14 },
  layoutPreviewLayer: { position: "absolute", width: 44, height: 13 },
  layoutPreviewLayerBack: { top: 6, transform: [{ rotate: "-18deg" }], opacity: 0.68 },
  layoutPreviewLayerMiddle: { top: 13, transform: [{ rotate: "-10deg" }], opacity: 0.84 },
  layoutPreviewLayerFront: { top: 20, transform: [{ rotate: "-4deg" }] },
  layoutPreviewMagazineLead: { width: 22, height: 29 },
  layoutPreviewMagazineSide: { width: 15, height: 29 },
  homeSectionToggleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingTop: 2 },
  homeSectionOrderList: { gap: 7, paddingTop: 2 },
  homeSectionOrderItem: { minHeight: 56, borderRadius: 15, borderWidth: 1, borderColor: "#3B5276", backgroundColor: "rgba(16,29,49,0.86)", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 9, paddingHorizontal: 10, paddingVertical: 8 },
  homeSectionOrderItemActive: { borderColor: "#7890B8", backgroundColor: "rgba(33,75,149,0.16)" },
  homeSectionOrderMain: { flex: 1, minWidth: 190, flexDirection: "row", alignItems: "center", gap: 9 },
  homeSectionHandle: { width: 28, height: 32, borderRadius: 11, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" },
  homeSectionOrderText: { flex: 1, minWidth: 0 },
  homeSectionOrderTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 16 },
  homeSectionOrderMeta: { color: "#A8B7DA", fontSize: 10, fontWeight: "800", lineHeight: 14, marginTop: 1 },
  homeSectionRowControls: { flexDirection: "row", alignItems: "center", gap: 7 },
  homeSectionToggle: { minHeight: 34, flex: 1, borderRadius: 12, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "#101D31", paddingHorizontal: 10, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center" },
  daySectionToggle: { backgroundColor: "#E8EDF2", borderColor: "#9FB4CE" },
  homeSectionToggleActive: { borderColor: "#D2E0FF", backgroundColor: "#214B95" },
  homeSectionVisibilityButton: { minHeight: 32, minWidth: 70, borderRadius: 12, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(255,255,255,0.045)", alignItems: "center", justifyContent: "center", paddingHorizontal: 10 },
  homeSectionVisibilityButtonActive: { borderColor: "#D2E0FF", backgroundColor: "#214B95" },
  homeSectionVisibilityText: { color: "#C7D3EA", fontSize: 11, fontWeight: "900", lineHeight: 15 },
  homeSectionMoveControls: { flexDirection: "row", gap: 6 },
  homeSectionMoveButton: { width: 32, height: 32, borderRadius: 12, borderWidth: 1, borderColor: "#5F79A9", backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  disabledMoveButton: { opacity: 0.56 },
  homeUpdateNotice: { color: "#A8B7DA", fontSize: 11, fontWeight: "900", lineHeight: 15 },
  dayHeaderPlaceholderCard: { borderColor: "#C5D0DA", backgroundColor: "#F4F7F8" },
  headerPlaceholderBody: { flex: 1, minWidth: 0 },
  headerPlaceholderTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  headerPlaceholderCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  headerPlaceholderDismiss: { minHeight: 32, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  dayHeaderPlaceholderDismiss: { borderColor: "#C5D0DA" },
  headerPlaceholderDismissText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900" },
  locationSearchCard: { borderRadius: 18, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.055)", padding: 14, marginBottom: 12, gap: 12 },
  locationSearchHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  locationInputWrap: { minHeight: 44, borderRadius: 14, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "#101D31", paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  dayLocationInputWrap: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  locationInput: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "700", paddingVertical: 8 },
  detectLocationButton: { minHeight: 42, borderRadius: 14, backgroundColor: "#536C9E", paddingHorizontal: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  detectLocationButtonDisabled: { opacity: 0.72 },
  detectLocationButtonText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  searchModeTabs: { flexDirection: "row", gap: 8 },
  searchModeTab: { flex: 1, minHeight: 36, borderRadius: 12, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "#101D31", alignItems: "center", justifyContent: "center", paddingHorizontal: 10 },
  searchModeTabActive: { borderColor: "#7890B8", backgroundColor: "#536C9E" },
  searchModeTabText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900", lineHeight: 16 },
  searchModeTabTextActive: { color: "#FFFFFF" },
  searchResultGroup: { gap: 7 },
  searchResultGroupTitle: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  searchResultStack: { gap: 8 },
  searchResultTopLine: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  searchResultBadge: { flexShrink: 0, borderRadius: 8, borderWidth: 1, borderColor: "#2A3C59", color: nsnColors.muted, fontSize: 10, fontWeight: "900", lineHeight: 14, paddingHorizontal: 7, paddingVertical: 2 },
  activeSearchResultBadge: { borderColor: nsnColors.day, color: nsnColors.text },
  searchEmptyCard: { borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, paddingHorizontal: 11, paddingVertical: 10 },
  searchPromptCard: { borderRadius: 14, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.045)", paddingHorizontal: 11, paddingVertical: 10 },
  mapPreviewCard: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", paddingHorizontal: 11, paddingVertical: 10 },
  locationResultButton: { borderRadius: 12, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, paddingHorizontal: 10, paddingVertical: 8 },
  meetupSearchResultButton: { backgroundColor: "rgba(255,255,255,0.035)" },
  dayLocationResultButton: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  activeLocationResultButton: { borderColor: "#C7B07A", backgroundColor: "#172A5C" },
  dayActiveLocationResultButton: { borderColor: "#6F87A1", backgroundColor: "#DFE8EF" },
  locationResultTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 16 },
  locationResultMeta: { color: nsnColors.muted, fontSize: 11, lineHeight: 15, marginTop: 2 },
  activeLocationResultText: { color: nsnColors.text },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 11 },
  nsnLogoMark: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#1590C9", alignItems: "center", justifyContent: "center", overflow: "hidden", borderWidth: 1.25, borderColor: "rgba(255,255,255,0.28)" },
  dayNsnLogoMark: { borderColor: "#B7C7DD" },
  nsnLogoMoon: { position: "absolute", left: 8, top: 2, color: "#FFE074", fontSize: 17, fontWeight: "900", lineHeight: 21 },
  nsnLogoText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900", lineHeight: 15, marginTop: 9 },
  logo: { color: nsnColors.text, fontSize: 28, fontWeight: "900", letterSpacing: 0, lineHeight: 34 },
  moon: { color: nsnColors.day },
  subtitle: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 1 },
  bellButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface },
  bellText: { color: nsnColors.text, fontSize: 20 },
  modeToggle: { alignSelf: "center", flexDirection: "row", gap: 6, borderRadius: 999, padding: 5, backgroundColor: "#0F1B2C", borderWidth: 1, borderColor: "#38527C", marginBottom: 16 },
  dayModeToggle: { backgroundColor: "#DDE6EC", borderColor: "#B7C7DD" },
  modeToggleOption: { minHeight: 38, minWidth: 94, borderRadius: 999, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingHorizontal: 14 },
  modeToggleDayActive: { backgroundColor: "#D9C78E" },
  modeToggleNightActive: { backgroundColor: "#284E92" },
  modeToggleIcon: { color: "#FFFFFF", fontSize: 18, fontWeight: "900", lineHeight: 22 },
  modeToggleText: { color: nsnColors.muted, fontWeight: "900", fontSize: 13 },
  modeToggleTextActive: { color: "#FFFFFF" },
  modeToggleDayActiveText: { color: "#1B2233" },
  dayModeToggleText: { color: "#53677A" },
  segmented: { flexDirection: "row", borderRadius: 24, padding: 4, backgroundColor: "#0F1B2C", borderWidth: 1, borderColor: "#2A3C59", marginBottom: 16 },
  segmentedDay: { backgroundColor: "#DDE6EC", borderColor: "#C5D0DA", },
  segment: { flex: 1, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  segmentDay: { backgroundColor: "#D9C78E" },
  segmentInactiveDayText: {backgroundColor: "transparent", color: "#63758A", },
  segmentNight: { backgroundColor: "#284E92" },
  segmentText: { color: nsnColors.muted, fontWeight: "700", fontSize: 14 },
  segmentDayText: { color: "#1B2233" },
  segmentNightText: { color: nsnColors.text },
  themeSuggestionCard: { flexDirection: "row", alignItems: "flex-start", gap: 11, borderRadius: 18, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.055)", paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  dayThemeSuggestionCard: { borderColor: "#C5D0DA", backgroundColor: "#F4F7F8" },
  themeSuggestionIcon: { fontSize: 22, lineHeight: 27 },
  themeSuggestionBody: { flex: 1, minWidth: 0 },
  themeSuggestionTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  themeSuggestionCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  themeSuggestionActions: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  themeSuggestionSwitch: { minHeight: 34, borderRadius: 16, backgroundColor: "#1F4E9A", paddingHorizontal: 14, alignItems: "center", justifyContent: "center" },
  themeSuggestionSwitchText: { color: nsnColors.text, fontSize: 12, fontWeight: "900" },
  themeSuggestionDismiss: { minHeight: 32, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  dayThemeSuggestionDismiss: { borderColor: "#C5D0DA" },
  themeSuggestionDismissText: { color: nsnColors.muted, fontSize: 12, fontWeight: "800" },
  contextRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  dateText: { color: nsnColors.text, fontSize: 13, lineHeight: 19 },
  locationText: { color: nsnColors.muted, fontSize: 12, lineHeight: 18 },
  changeText: { color: "#A8B7DA", fontSize: 12, fontWeight: "700" },
  homeSectionFlow: { flexDirection: "row", flexWrap: "wrap", alignItems: "stretch", gap: 10, marginBottom: 8, width: "100%" },
  localContextGroup: { flexGrow: 1, flexShrink: 1, flexBasis: 430, alignSelf: "stretch", gap: 10, minWidth: 0 },
  localContextGroupAutoFit: { flexBasis: 410, gap: 9 },
  dashboardCard: { flexGrow: 1, flexShrink: 1, flexBasis: 210 },
  dashboardUtilityCard: { flexGrow: 1, flexShrink: 1, flexBasis: "100%" },
  dashboardWideCard: { flexGrow: 1.65, flexShrink: 1, flexBasis: 560, minWidth: 0 },
  homeMajorSection: { alignSelf: "stretch", gap: 10, borderRadius: 20, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.045)", padding: 13 },
  homeMajorSectionAutoFit: { padding: 12, gap: 8 },
  dashboardPair: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  weatherCard: { minHeight: 92, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 11, backgroundColor: "#102B4E", borderWidth: 1, borderColor: "#38527C" },
  weatherBody: { flex: 1, minWidth: 0 },
  weatherTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  weatherTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 19 },
  weatherStatus: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, marginTop: 5 },
  weatherMetricRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  weatherMetric: { color: "#C7D3EA", fontSize: 11, fontWeight: "900", lineHeight: 15, borderRadius: 999, borderWidth: 1, borderColor: "#4D6794", paddingHorizontal: 8, paddingVertical: 3, overflow: "hidden" },
  weatherCopy: { color: "#C7D3EA", fontSize: 11, lineHeight: 16, maxWidth: 290, marginTop: 5 },
  weatherIcon: { fontSize: 28, marginLeft: 8 },
  todayCard: { minHeight: 92, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: "#0F223D", borderWidth: 1, borderColor: "#38527C" },
  todayTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  todayDate: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 19, marginTop: 7 },
  todayCopy: { color: "#C7D3EA", fontSize: 12, fontWeight: "800", lineHeight: 17, marginTop: 3 },
  todayNote: { color: "#9FB0CD", fontSize: 10, fontWeight: "800", lineHeight: 14, marginTop: 5 },
  locationMapCard: { minHeight: 266, flexGrow: 1, borderRadius: 20, padding: 13, backgroundColor: "#0F223D", borderWidth: 1, borderColor: "#38527C" },
  locationMapTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  prototypeMapCanvas: { minHeight: 148, flexGrow: 1, borderRadius: 16, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "#102B4E", overflow: "hidden", marginTop: 9, marginBottom: 8 },
  prototypeMapContent: { flex: 1, minHeight: 148 },
  dayPrototypeMapCanvas: { backgroundColor: "#E4ECF4", borderColor: "#B7C7DD" },
  prototypeMapRoad: { position: "absolute", backgroundColor: "rgba(199,211,234,0.25)", borderRadius: 999 },
  dayPrototypeMapRoad: { backgroundColor: "rgba(86,103,122,0.28)" },
  prototypeMapRoadPrimary: { width: 250, height: 12, left: -24, top: 50, transform: [{ rotate: "-11deg" }] },
  prototypeMapRoadSecondary: { width: 12, height: 148, right: 54, top: -20, transform: [{ rotate: "22deg" }] },
  prototypeMapRoadTertiary: { width: 190, height: 8, left: 42, top: 24, transform: [{ rotate: "7deg" }], opacity: 0.8 },
  prototypeMapRoadHarbour: { width: 150, height: 8, left: 84, bottom: 22, transform: [{ rotate: "-18deg" }], opacity: 0.76 },
  prototypeMapWater: { position: "absolute", right: -24, bottom: -18, width: 118, height: 92, borderRadius: 54, backgroundColor: "rgba(62,146,190,0.28)", transform: [{ rotate: "-24deg" }] },
  dayPrototypeMapWater: { backgroundColor: "rgba(62,146,190,0.22)" },
  prototypeMapGreen: { position: "absolute", borderRadius: 999, backgroundColor: "rgba(114,214,126,0.16)" },
  prototypeMapGreenTop: { width: 90, height: 34, left: 18, top: 10, transform: [{ rotate: "-10deg" }] },
  prototypeMapGreenBottom: { width: 110, height: 30, left: 12, bottom: 14, transform: [{ rotate: "9deg" }] },
  prototypeMapRoadLabel: { position: "absolute", left: 22, top: 38, color: "rgba(245,247,255,0.82)", fontSize: 9, fontWeight: "900" },
  prototypeMapRoadLabelSecond: { left: 104, top: 18 },
  prototypeMapRoadLabelThird: { left: 128, bottom: 20, top: undefined },
  dayPrototypeMapRoadLabel: { color: "rgba(45,59,82,0.78)" },
  prototypeMapCityLabel: { position: "absolute", right: 34, bottom: 38, color: "rgba(245,247,255,0.7)", fontSize: 10, fontWeight: "900" },
  prototypeMapNorthLabel: { position: "absolute", left: 18, top: 74, color: "rgba(245,247,255,0.76)", fontSize: 10, fontWeight: "900" },
  prototypeMapPin: { position: "absolute", marginLeft: -15, marginTop: -15, width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: "#FFFFFF", backgroundColor: "#214B95", alignItems: "center", justifyContent: "center" },
  dayPrototypeMapPin: { backgroundColor: "#284E92" },
  prototypeMapArea: { position: "absolute", left: 10, bottom: 9, maxWidth: "62%", borderRadius: 12, backgroundColor: "rgba(8,17,31,0.72)", paddingHorizontal: 9, paddingVertical: 5 },
  dayPrototypeMapArea: { backgroundColor: "rgba(255,255,255,0.72)" },
  prototypeMapAreaText: { color: nsnColors.text, fontSize: 10, fontWeight: "900", lineHeight: 14 },
  prototypeMapVenueBadge: { position: "absolute", left: 10, top: 10, maxWidth: "58%", borderRadius: 13, backgroundColor: "rgba(8,17,31,0.78)", paddingHorizontal: 10, paddingVertical: 7 },
  prototypeMapVenueKicker: { color: "#A8B7DA", fontSize: 8, fontWeight: "900", lineHeight: 11, textTransform: "uppercase" },
  prototypeMapVenueName: { color: nsnColors.text, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  prototypeMapVenueSuburb: { color: "#C7D3EA", fontSize: 10, fontWeight: "800", lineHeight: 14, marginTop: 1 },
  prototypeMapZoomControls: { position: "absolute", top: 10, right: 10, gap: 6 },
  prototypeMapZoomButton: { width: 34, height: 34, borderRadius: 12, borderWidth: 1, borderColor: "#7890B8", backgroundColor: "rgba(8,17,31,0.82)", alignItems: "center", justifyContent: "center" },
  dayPrototypeMapZoomButton: { borderColor: "#6F87A1", backgroundColor: "rgba(255,255,255,0.9)" },
  prototypeMapResetButton: { marginTop: 1 },
  prototypeMapZoomText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", lineHeight: 24 },
  dayPrototypeMapZoomText: { color: "#284E92" },
  locationMapEvent: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  locationMapMeta: { color: "#C7D3EA", fontSize: 11, fontWeight: "800", lineHeight: 16, marginTop: 2 },
  locationMapActions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 11 },
  locationMapAction: { minHeight: 32, borderRadius: 13, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(255,255,255,0.055)", paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  dayLocationMapAction: { backgroundColor: "#E4ECF4" },
  locationMapActionText: { color: "#C7D3EA", fontSize: 11, fontWeight: "900", lineHeight: 15 },
  locationMapPrimaryAction: { backgroundColor: "#214B95", borderColor: "#D2E0FF" },
  locationMapPrimaryActionText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900", lineHeight: 15 },
  noiseGuideCard: { borderRadius: 18, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "#0D1A2C", padding: 14, marginBottom: 14 },
  noiseGuideHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  noiseGuideTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  noiseGuideCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  noiseLevelRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  noiseLevelItem: { flex: 1, minHeight: 78, borderRadius: 14, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center", paddingHorizontal: 8, paddingVertical: 10 },
  noiseLevelItemActive: { borderColor: "#7890B8", backgroundColor: "rgba(83,108,158,0.24)" },
  noiseLevelIcon: { fontSize: 20, lineHeight: 24, marginBottom: 4 },
  noiseLevelTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17, textAlign: "center" },
  noiseLevelTitleActive: { color: nsnColors.text },
  noiseLevelCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 15, textAlign: "center" },
  noiseLevelCopyActive: { color: nsnColors.text },
  noiseFilterRow: { gap: 8 },
  homeWrappingChipRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  eventCategoryFilterRow: { gap: 8, paddingTop: 6, paddingBottom: 8, paddingRight: 4 },
  pill: { height: 34, paddingHorizontal: 16, borderRadius: 17, backgroundColor: "#101D31", borderWidth: 1, borderColor: "#2A3C59", alignItems: "center", justifyContent: "center" },
  pillActive: { backgroundColor: "#284E92", borderColor: "#9BB4E4" },
  pillText: { color: nsnColors.muted, fontWeight: "700", fontSize: 12 },
  pillTextActive: { color: nsnColors.text },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 7, flex: 1, minWidth: 0 },
  sectionTitle: { color: nsnColors.text, fontSize: 17, fontWeight: "900", lineHeight: 23 },
  sectionActionButton: { minHeight: 32, borderRadius: 15, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(33,75,149,0.18)", paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  daySectionActionButton: { backgroundColor: "#E4ECF4", borderColor: "#B7C7DD" },
  seeAll: { color: "#A8B7DA", fontSize: 12, fontWeight: "700" },
  cardStack: { gap: 10 },
  cardStackCompact: { gap: 7 },
  cardStackSpacious: { gap: 14 },
  eventLayoutStack: { gap: 10 },
  eventLayoutGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  eventLayoutLayered: { gap: 0 },
  eventLayoutMagazine: { gap: 12 },
  horizontalEventScroller: { gap: 10, paddingRight: 4 },
  eventCard: { flexDirection: "row", minHeight: 126, borderRadius: 18, backgroundColor: "#0F1B2C", borderWidth: 1, borderColor: "#2A3C59", padding: 10, overflow: "hidden" },
  eventCardOutlineMinimal: { borderWidth: 1, borderColor: "#2A3C59" },
  eventCardOutlineStandard: { borderWidth: 1.25, borderColor: "#4D6794" },
  eventCardOutlineStrong: { borderWidth: 1.75, borderColor: "#7890B8" },
  dayEventCardOutlineMinimal: { borderWidth: 1, borderColor: "#C5D0DA" },
  dayEventCardOutlineStandard: { borderWidth: 1.25, borderColor: "#9FB2C8" },
  dayEventCardOutlineStrong: { borderWidth: 1.75, borderColor: "#6F87A1" },
  eventCardCompact: { minHeight: 108, padding: 8 },
  eventCardSpacious: { minHeight: 148, padding: 12 },
  eventCardHorizontal: { width: 236, minHeight: 236, flexDirection: "column" },
  eventCardGrid: { flexGrow: 1, flexBasis: 158, minHeight: 232, flexDirection: "column" },
  eventCardLayered: { borderLeftWidth: 4, borderLeftColor: "#7890B8", marginTop: -2 },
  eventCardMagazine: { minHeight: 132 },
  eventCardMagazineFeatured: { minHeight: 180 },
  eventCardHighlighted: { borderColor: "#D2E0FF", backgroundColor: "#122A55" },
  dayEventCardHighlighted: { borderColor: "#6F87A1", backgroundColor: "#E4ECF4" },
  rtlEventCard: { flexDirection: "row-reverse" },
  eventImage: { width: 88, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  eventImagePhoto: { overflow: "hidden", backgroundColor: "#102743" },
  eventImageCompact: { width: 70, borderRadius: 12 },
  eventImageSpacious: { width: 98 },
  eventImageWide: { width: "100%", height: 82, marginBottom: 10 },
  eventImageMagazineFeatured: { width: 116 },
  eventEmoji: { fontSize: 34 },
  prototypeEventScene: { flex: 1, alignSelf: "stretch", width: "100%", height: "100%", minHeight: 82, borderRadius: 14, overflow: "hidden", backgroundColor: "#102743" },
  dayPrototypeEventSceneFrame: { borderWidth: 1, borderColor: "rgba(255,255,255,0.52)" },
  prototypePicnicScene: { backgroundColor: "#8CC1D7" },
  prototypeBeachScene: { backgroundColor: "#7ABDD8" },
  prototypeMovieScene: { backgroundColor: "#151A2A" },
  prototypeCafeScene: { backgroundColor: "#7D5A3A" },
  prototypeLocalScene: { backgroundColor: "#203B64", alignItems: "center", justifyContent: "center" },
  prototypeSceneSky: { position: "absolute", left: 0, right: 0, top: 0, height: "48%", backgroundColor: "#86B9D2" },
  prototypePicnicGrass: { position: "absolute", left: -8, right: -8, bottom: -10, height: "64%", borderTopLeftRadius: 46, borderTopRightRadius: 42, backgroundColor: "#5D8F53" },
  prototypePicnicBlanket: { position: "absolute", left: 14, right: 16, bottom: 18, height: 24, borderRadius: 6, backgroundColor: "#D34B45", transform: [{ rotate: "-8deg" }] },
  prototypePerson: { position: "absolute", width: 14, height: 14, borderRadius: 7, backgroundColor: "#F2C49D", borderWidth: 2, borderColor: "#25334A" },
  prototypePicnicPersonOne: { left: 18, bottom: 46 },
  prototypePicnicPersonTwo: { right: 18, bottom: 42 },
  prototypePicnicBasket: { position: "absolute", left: 36, bottom: 28, width: 15, height: 11, borderRadius: 4, backgroundColor: "#C78A42", borderWidth: 1, borderColor: "rgba(70,43,25,0.5)" },
  prototypeBeachSky: { position: "absolute", left: 0, right: 0, top: 0, height: "36%", backgroundColor: "#8BC6DE" },
  prototypeBeachWater: { position: "absolute", left: -10, right: -6, top: "30%", height: "35%", borderRadius: 34, backgroundColor: "#4A91B8" },
  prototypeBeachSand: { position: "absolute", left: -10, right: -8, bottom: -12, height: "47%", borderTopLeftRadius: 44, borderTopRightRadius: 34, backgroundColor: "#D8BD7A" },
  prototypeBeachSun: { position: "absolute", right: 12, top: 9, width: 16, height: 16, borderRadius: 8, backgroundColor: "#FFD36F" },
  prototypeBeachUmbrella: { position: "absolute", backgroundColor: "#CF4C4A" },
  prototypeBeachUmbrellaTop: { left: 19, bottom: 36, width: 34, height: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  prototypeBeachUmbrellaStem: { left: 35, bottom: 16, width: 3, height: 28, borderRadius: 2, backgroundColor: "#644936" },
  prototypeMovieWall: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#141B2C" },
  prototypeMovieScreen: { position: "absolute", left: 12, right: 12, top: 13, height: 31, borderRadius: 4, backgroundColor: "#E8EEF7" },
  prototypeMovieGlow: { position: "absolute", left: 22, right: 22, top: 40, height: 20, borderRadius: 18, backgroundColor: "rgba(98,139,201,0.32)" },
  prototypeMovieSeatRow: { position: "absolute", left: 8, right: 8, height: 10, borderRadius: 6, backgroundColor: "#633B49" },
  prototypeMovieSeatRowBack: { bottom: 25, opacity: 0.74 },
  prototypeMovieSeatRowFront: { bottom: 11, backgroundColor: "#8E3F4B" },
  prototypeCafeTable: { position: "absolute", left: -10, right: -10, bottom: -24, height: "72%", borderTopLeftRadius: 48, borderTopRightRadius: 48, backgroundColor: "#9A6A42" },
  prototypeCafeMug: { position: "absolute", left: 17, top: 18, width: 21, height: 18, borderRadius: 8, backgroundColor: "#F2E7D2", borderWidth: 2, borderColor: "#6B4A32" },
  prototypeCafeMugHandle: { position: "absolute", left: 34, top: 23, width: 10, height: 9, borderRadius: 5, borderWidth: 2, borderColor: "#F2E7D2" },
  prototypeCafeBoard: { position: "absolute", right: 12, bottom: 24, width: 38, height: 28, borderRadius: 6, backgroundColor: "#214B95", transform: [{ rotate: "6deg" }] },
  prototypeCafeTile: { position: "absolute", bottom: 33, width: 8, height: 8, borderRadius: 2, backgroundColor: "#D8E6FF", transform: [{ rotate: "6deg" }] },
  prototypeCafeTileAlt: { backgroundColor: "#C7B07A" },
  prototypeLocalGlow: { position: "absolute", width: 62, height: 62, borderRadius: 31, backgroundColor: "rgba(199,176,122,0.18)" },
  prototypeLocalEmoji: { fontSize: 32 },
  prototypeEventSceneLabel: { position: "absolute", left: 6, right: 6, bottom: 6, minHeight: 20, borderRadius: 9, backgroundColor: "rgba(2,8,20,0.72)", alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  prototypeEventSceneLabelText: { color: "#FFFFFF", fontSize: 9, fontWeight: "900", lineHeight: 12 },
  eventPreviewPhoto: { width: "100%", height: "100%" },
  eventPreviewOverlay: { position: "absolute", left: 6, right: 6, bottom: 6, minHeight: 20, borderRadius: 9, backgroundColor: "rgba(2,8,20,0.72)", alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  eventPreviewPlace: { color: "#FFFFFF", fontSize: 9, fontWeight: "900", lineHeight: 12 },
  eventEmojiCompact: { fontSize: 28 },
  eventBody: { flex: 1, paddingLeft: 11, paddingRight: 4 },
  eventBodyStacked: { paddingLeft: 0, paddingRight: 0 },
  eventTopLine: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 3 },
  rtlRow: { flexDirection: "row-reverse" },
  rtlBlock: { alignItems: "flex-end" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  smallTag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 9, backgroundColor: "rgba(114,214,126,0.18)" },
  smallTagText: { color: nsnColors.green, fontSize: 10, fontWeight: "800" },
  daySmallTag: { backgroundColor: "#D9F0DD", },
  daySmallTagText: { color: "#3E6F47", },
  eventTitle: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 19 },
  eventMetaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  eventMeta: { color: nsnColors.muted, fontSize: 11, lineHeight: 16 },
  eventMetaDay: { color: "#CBD7EA", },
  eventDescription: { color: nsnColors.text, fontSize: 12, lineHeight: 17, marginTop: 2 },
  eventTags: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 7 },
  eventTagsCompact: { marginTop: 5 },
  eventTag: { minHeight: 22, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  dayEventTag: { backgroundColor: "#F4F7F8", borderWidth: 1, borderColor: "#C5D0DA" },
  eventTagText: { color: nsnColors.muted, fontSize: 10, lineHeight: 14 },
  livePreview: { width: 82, height: 104, borderRadius: 15, borderWidth: 1, borderColor: "#2A3C59", backgroundColor: "#081A2F", overflow: "hidden", marginLeft: 6 },
  miniMap: { height: 42, backgroundColor: "#102743", overflow: "hidden", justifyContent: "flex-end", paddingHorizontal: 7, paddingBottom: 5 },
  mapRoad: { position: "absolute", backgroundColor: "rgba(148,163,184,0.28)", borderRadius: 10 },
  mapRoadMain: { width: 94, height: 9, left: -7, top: 15, transform: [{ rotate: "-14deg" }] },
  mapRoadCross: { width: 9, height: 58, right: 21, top: -8, transform: [{ rotate: "22deg" }] },
  mapPinDot: { position: "absolute", right: 26, top: 14, width: 11, height: 11, borderRadius: 6, borderWidth: 2, borderColor: nsnColors.text, backgroundColor: nsnColors.cyan },
  mapPlaceText: { color: nsnColors.text, fontSize: 9, fontWeight: "900", lineHeight: 12 },
  livePhoto: { height: 62, width: "100%", backgroundColor: nsnColors.surfaceSoft },
  liveBadge: { position: "absolute", left: 6, bottom: 6, minHeight: 19, borderRadius: 10, backgroundColor: "rgba(2,8,20,0.78)", flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: nsnColors.cyan },
  liveBadgeText: { color: nsnColors.text, fontSize: 9, fontWeight: "900" },
  cardArrow: { width: 30, alignItems: "center", justifyContent: "center" },
  cardArrowText: { color: nsnColors.text, fontSize: 32, lineHeight: 34 },
  createMeetupButton: { height: 52, borderRadius: 15, marginTop: 18, marginBottom: 2, backgroundColor: "#1F4E9A", overflow: "hidden", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  createMeetupButtonText: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 20 },
  insightGrid: { flexDirection: "row", gap: 10, marginTop: 16 },
  insightCard: { flex: 1, minHeight: 116, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#0D1A2C", padding: 14 },
  insightIcon: { fontSize: 25, marginBottom: 7 },
  insightTitle: { color: nsnColors.text, fontWeight: "800", fontSize: 13, lineHeight: 18 },
  insightCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  moreInfoText: { color: nsnColors.warning, fontSize: 12, lineHeight: 17, fontWeight: "800", marginTop: 8 },
  insightDetail: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  insightEmoji: { fontSize: 22, marginBottom: 6, marginTop: 2},
});
