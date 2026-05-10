import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { getLanguageBase, type NoiseLevelPreference, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { dayEvents, eveningEvents, type EventItem, noiseLevelOptions, nsnColors } from "@/lib/nsn-data";
import { prioritizeEventsForComfort } from "@/lib/softhello-mvp";

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

const noiseGuideTranslations = {
  English: {
    title: "Noise Level Guide",
    copy: "Filter by the actual sound level of the place, separate from how much talking is expected.",
    filters: { Any: "All", Quiet: "Quiet", Balanced: "Balanced", Lively: "Lively" },
    levels: {
      Quiet: { icon: "🔇", label: "Quiet", copy: "Low noise" },
      Balanced: { icon: "🌿", label: "Balanced", copy: "Moderate noise" },
      Lively: { icon: "🔊", label: "Lively", copy: "More energy" },
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

const eventLivePreviews: Record<string, { photo: string; place: string; pulse: string }> = {
  "picnic-easy-hangout": {
    photo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=280&q=80",
    place: "Lane Cove",
    pulse: "Live 2",
  },
  "beach-day-chill-vibes": {
    photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=280&q=80",
    place: "Palm Beach",
    pulse: "Live 5",
  },
  "library-calm-study": {
    photo: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=280&q=80",
    place: "Chatswood",
    pulse: "Live 1",
  },
  "coffee-lane-cove": {
    photo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=280&q=80",
    place: "Lane Cove",
    pulse: "Live 3",
  },
  "harbour-walk-waverton": {
    photo: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=280&q=80",
    place: "Waverton",
    pulse: "Live 4",
  },
  "movie-night-watch-chat": {
    photo: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=280&q=80",
    place: "Macquarie",
    pulse: "Live 6",
  },
  "board-games-coffee": {
    photo: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=280&q=80",
    place: "Chatswood",
    pulse: "Live 2",
  },
  "ramen-small-table": {
    photo: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=280&q=80",
    place: "Crows Nest",
    pulse: "Live 3",
  },
  "quiet-music-listening": {
    photo: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=280&q=80",
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

function Pill({ label, active, isDay, onPress }: { label: string; active?: boolean; isDay?: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={[styles.pill, active && styles.pillActive, isDay && styles.dayPill, isDay && active && styles.dayPillActive, ]}>
      <Text style={[styles.pillText, active && styles.pillTextActive, isDay && styles.dayPillText, isDay && active && styles.dayPillTextActive, ]}>{label}</Text>
    </TouchableOpacity>
  );
}

function EventCard({ event, isDay, appLanguageBase }: { event: EventItem; isDay?: boolean; appLanguageBase: string }) {
  const router = useRouter();
  const isRtl = rtlLanguages.has(appLanguageBase);
  const localizedEvent = { ...event, ...(eventTranslations[appLanguageBase]?.[event.id] ?? {}) };
  const noiseCopy = noiseGuideTranslations[appLanguageBase as keyof typeof noiseGuideTranslations] ?? noiseGuideTranslations.English;
  const eventNoise = noiseCopy.levels[event.noiseLevel];
  const livePreview = eventLivePreviews[event.id];

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => router.push(`/event/${event.id}`)}
      style={[styles.eventCard, isDay ? styles.dayCard : null, isRtl && styles.rtlEventCard]}
    >
      <View style={[styles.eventImage, { backgroundColor: event.imageTone }]}>
        <Text style={styles.eventEmoji}>{event.emoji}</Text>
      </View>
      <View style={styles.eventBody}>
        <View style={[styles.eventTopLine, isRtl && styles.rtlRow]}>
          <View style={[styles.smallTag, isDay ? styles.daySmallTag : null, ]}>
            <Text style={[styles.smallTagText, isDay ? styles.daySmallTagText : null, isRtl && styles.rtlText]}>{localizedEvent.category}</Text>
          </View>
          <Text style={[styles.eventTitle, isDay ? styles.dayHeadingText : null, isRtl && styles.rtlText]} numberOfLines={1}>{localizedEvent.title}</Text>
        </View>
        <Text style={[styles.eventMeta, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>⌖ {event.venue}</Text>
        <Text style={[styles.eventMeta, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>◎ {localizedEvent.people}  ·  {event.time}</Text>
        <Text style={[styles.eventDescription, isDay ? styles.dayText : null, isRtl && styles.rtlText]} numberOfLines={2}>{localizedEvent.description}</Text>
        <View style={[styles.eventTags, isRtl && styles.rtlRow]}>
          <Text style={[styles.eventTagText, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>🌿 {localizedEvent.tone}</Text>
          <Text style={[styles.eventTagText, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{eventNoise.icon} {eventNoise.label}</Text>
          <Text style={[styles.eventTagText, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>☔ {localizedEvent.weather}</Text>
        </View>
      </View>
      {livePreview ? (
        <View style={[styles.livePreview, isDay && styles.dayLivePreview]}>
          <View style={styles.miniMap}>
            <View style={[styles.mapRoad, styles.mapRoadMain]} />
            <View style={[styles.mapRoad, styles.mapRoadCross]} />
            <View style={styles.mapPinDot} />
            <Text style={styles.mapPlaceText} numberOfLines={1}>{livePreview.place}</Text>
          </View>
          <Image source={{ uri: livePreview.photo }} style={styles.livePhoto} />
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>{livePreview.pulse}</Text>
          </View>
        </View>
      ) : null}
      <View style={styles.cardArrow}>
        <Text style={[styles.cardArrowText, isDay ? styles.dayMutedText : null, ]}>{isRtl ? "‹" : "›"}</Text>
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
    seeAll: "See all",
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

function HeaderActionButton({
  accessibilityLabel,
  accessibilityHint,
  isDay,
  onPress,
  children,
}: {
  accessibilityLabel: string;
  accessibilityHint: string;
  isDay: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  if (Platform.OS === "web") {
    return (
      <button
        type="button"
        role="button"
        aria-label={accessibilityLabel}
        title={accessibilityLabel}
        onClick={onPress}
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: nsnColors.border,
          backgroundColor: isDay ? "#FFFFFF" : nsnColors.surface,
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
      style={[styles.headerActionButton, isDay && styles.dayBellButton]}
      hitSlop={6}
    >
      {children}
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { isNightMode, setIsNightMode, timezone, appLanguage, reduceMotion, slowerTransitions, comfortPreferences, pinnedEventIds, hiddenEventIds, noiseLevelPreference, saveSoftHelloMvpState } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = homeTranslations[appLanguageBase as keyof typeof homeTranslations] ?? homeTranslations.English;
  const homeCopy = { ...homeTranslations.English, ...copy };
  const noiseCopy = noiseGuideTranslations[appLanguageBase as keyof typeof noiseGuideTranslations] ?? noiseGuideTranslations.English;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const locale = appLocaleMap[appLanguage] ?? appLocaleMap[appLanguageBase] ?? "en-AU";
  
  const mode = isNightMode ? "night" : "day"; // State
  const [activeFilter, setActiveFilter] = useState<EventFilter>("All");
  const [showHiddenEvents, setShowHiddenEvents] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<"day-night" | "weather" | null>(null);
  const [dismissedThemeSuggestion, setDismissedThemeSuggestion] = useState<"day" | "night" | null>(null);
  const [headerPlaceholder, setHeaderPlaceholder] = useState<{ title: string; copy: string } | null>(null);
  const activeEvents = useMemo(() => {
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
  const isDay = !isNightMode;
  const [now, setNow] = useState(new Date());

  const selectNoiseLevelPreference = (preference: NoiseLevelPreference) => {
    saveSoftHelloMvpState({ noiseLevelPreference: preference });
  };

  const showSearchPlaceholder = useCallback(() => {
    setHeaderPlaceholder({
      title: homeCopy.searchEvents,
      copy: homeCopy.searchEventsCopy,
    });
  }, [homeCopy.searchEvents, homeCopy.searchEventsCopy]);

  const showViewFilterPlaceholder = useCallback(() => {
    setHeaderPlaceholder({
      title: homeCopy.changeEventView,
      copy: homeCopy.changeEventViewCopy,
    });
  }, [homeCopy.changeEventView, homeCopy.changeEventViewCopy]);

  const switchToSuggestedTheme = (suggestedMode: "day" | "night") => {
    setIsNightMode(suggestedMode === "night");
  };

  useEffect(() => {
  const timer = setInterval(() => { setNow(new Date()); }, 1000); // updates every second

  return () => clearInterval(timer);}, []
  );


  const formattedDate = now.toLocaleDateString(locale, {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: timezone.timeZone,
}
  );

  const formattedTime = now.toLocaleTimeString(locale, {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: timezone.timeZone,
}

  );

  // ===== LIVE TIME =====
  const hour = Number(
    new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      hour12: false,
      timeZone: timezone.timeZone,
    }).format(now)
  );

  const greeting =
  hour < 12
    ? copy.morning
    : hour < 18
    ? copy.afternoon
    : copy.evening;

  const localHour = hour;
  const localTimeSuggestedMode = localHour >= 18 || localHour < 6 ? "night" : "day";
  const shouldShowThemeSuggestion = localTimeSuggestedMode !== mode && dismissedThemeSuggestion !== localTimeSuggestedMode;
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

  // ===== WEATHER =====
  const [weather, setWeather] = useState({
    temperature: null as number | null,
    rainChance: null as number | null,
  });

  const weatherMessage =
  weather.temperature === null || weather.rainChance === null
    ? copy.loadingWeather(timezone.city)
    : weather.rainChance >= 70
    ? copy.rainLikely(timezone.city, weather.temperature)
    : weather.rainChance >= 35
    ? copy.slightRain(timezone.city, weather.temperature)
    : weather.temperature >= 28
    ? copy.warmDay(timezone.city, weather.temperature)
    : copy.goodWeather(timezone.city, weather.temperature, weather.rainChance);

  useEffect(() => {
  async function fetchWeather() {
    try {
      setWeather({ temperature: null, rainChance: null });

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${timezone.latitude}&longitude=${timezone.longitude}&current=temperature_2m&hourly=precipitation_probability&timezone=${encodeURIComponent(timezone.timeZone)}&forecast_days=1`
      );

      const data = await response.json();
      const currentHourIndex = data.hourly.time?.findIndex((time: string) => time === data.current.time) ?? 0;
      const rainChance = data.hourly.precipitation_probability?.[currentHourIndex >= 0 ? currentHourIndex : 0] ?? null;

      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        rainChance,
      });
    } catch (error) {
      console.log("Weather fetch failed:", error);
    }
  }

  fetchWeather();

  const timer = setInterval(fetchWeather, 15 * 60 * 1000);

  return () => clearInterval(timer);}, [timezone]

    );

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
      if (reduceMotion) {
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
    }, [reduceMotion, weatherFloat]);

    useEffect(() => {
      if (reduceMotion) {
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
    }, [isDay, modePulse, modeTransition, reduceMotion, slowerTransitions]);

    const animatedScreenColor = modeTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [nsnColors.background, "#EAF4FF"],
    });

    const modeGlowOpacity = modePulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.36],
    });

    const modeGlowScale = modePulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.94, 1.04],
    });

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
              backgroundColor: isDay ? "#F2C94C" : "#2F80ED",
            },
          ]}
        />
      <ScrollView style={styles.scrollSurface} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, isRtl && styles.rtlRow]}>
          <View style={[styles.headerTitle, isRtl && styles.rtlBlock]}>
            <Text style={[styles.logo, isDay && styles.dayText]}>NSN</Text>
            <Text style={[styles.subtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.subtitle}</Text>
          </View>
          <View style={[styles.headerActions, isRtl && styles.rtlRow]}>
            <HeaderActionButton
              onPress={showSearchPlaceholder}
              accessibilityLabel={homeCopy.searchEvents}
              accessibilityHint={homeCopy.searchEventsHint}
              isDay={isDay}
            >
              <IconSymbol name="magnifyingglass" color={isDay ? "#0B1220" : nsnColors.text} size={22} />
            </HeaderActionButton>
            <HeaderActionButton
              onPress={showViewFilterPlaceholder}
              accessibilityLabel={homeCopy.changeEventView}
              accessibilityHint={homeCopy.changeEventViewHint}
              isDay={isDay}
            >
              <IconSymbol name="ellipsis" color={isDay ? "#0B1220" : nsnColors.text} size={22} />
            </HeaderActionButton>
          </View>
        </View>

        {headerPlaceholder ? (
          <View
            style={[styles.headerPlaceholderCard, isDay && styles.dayHeaderPlaceholderCard, isRtl && styles.rtlRow]}
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
              style={[styles.headerPlaceholderDismiss, isDay && styles.dayHeaderPlaceholderDismiss]}
            >
              <Text style={[styles.headerPlaceholderDismissText, isDay && styles.dayMutedText]}>{homeCopy.ok}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={[styles.segmented, isDay ? styles.segmentedDay : null, isRtl && styles.rtlRow]}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setIsNightMode(false)} style={[styles.segment, mode === "day" ? styles.segmentDay : null, ]}>
            <Text style={[styles.segmentText, mode === "day" ? styles.segmentDayText : null, isDay && mode !== "day" ? styles.segmentInactiveDayText : null,]}>{copy.day}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setIsNightMode(true)} style={[styles.segment, mode === "night" ? styles.segmentNight : null, ]}>
            <Text style={[styles.segmentText, mode === "night" ? styles.segmentNightText : null, isDay && mode === "day" ? styles.segmentInactiveDayText : null, ]}>{copy.night}</Text>
          </TouchableOpacity>
        </View>

        {shouldShowThemeSuggestion ? (
          <View style={[styles.themeSuggestionCard, isDay && styles.dayThemeSuggestionCard, isRtl && styles.rtlRow]}>
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
                  style={styles.themeSuggestionSwitch}
                >
                  <Text style={styles.themeSuggestionSwitchText}>{themeSuggestion.button}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => setDismissedThemeSuggestion(localTimeSuggestedMode)}
                  accessibilityRole="button"
                  accessibilityLabel={homeCopy.dismissThemeSuggestion}
                  style={[styles.themeSuggestionDismiss, isDay && styles.dayThemeSuggestionDismiss]}
                >
                  <Text style={[styles.themeSuggestionDismissText, isDay && styles.dayMutedText]}>{homeCopy.notNow}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

        <View style={[styles.contextRow, isRtl && styles.rtlRow]}>
          <View style={isRtl && styles.rtlBlock}>
            <Text style={[styles.dateText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{greeting} • {formattedDate} • {formattedTime}</Text>
            <Text style={[styles.locationText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>📍 {timezone.label}, {timezone.country}</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.86} style={[styles.weatherCard, isDay && styles.dayCard, isRtl && styles.rtlRow]}>
          <View style={isRtl && styles.rtlBlock}>
            <Text style={[styles.weatherTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.weatherUpdate}</Text>
            <Text style={[styles.weatherCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{weatherMessage}</Text>
          </View>
          <Animated.Text style={[styles.weatherIcon, { transform: [{ translateY: weatherFloat }] }, ]}
>
{weatherIcon}
</Animated.Text>
        </TouchableOpacity>
      
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterRow, isRtl && styles.rtlRow]}>
          {copy.filters.map((filter, index) => {
            const filterKey = filterKeys[index];

            return (
              <Pill
                key={filterKey}
                label={filter}
                active={activeFilter === filterKey}
                isDay={isDay}
                onPress={() => setActiveFilter(filterKey)}
              />
            );
          })}
        </ScrollView>

        <View style={[styles.noiseGuideCard, isDay && styles.dayCard]}>
          <View style={[styles.noiseGuideHeader, isRtl && styles.rtlRow]}>
            <View style={isRtl && styles.rtlBlock}>
              <Text style={[styles.noiseGuideTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{noiseCopy.title}</Text>
              <Text style={[styles.noiseGuideCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{noiseCopy.copy}</Text>
            </View>
          </View>
          <View style={[styles.noiseLevelRow, isRtl && styles.rtlRow]}>
            {noiseLevelOptions.map((level) => {
              const levelCopy = noiseCopy.levels[level];
              const active = noiseLevelPreference === level;

              return (
                <TouchableOpacity
                  key={level}
                  activeOpacity={0.82}
                  onPress={() => selectNoiseLevelPreference(level)}
                  style={[styles.noiseLevelItem, active && styles.noiseLevelItemActive, isDay && styles.dayNoiseLevelItem, active && isDay && styles.dayNoiseLevelItemActive]}
                >
                  <Text style={styles.noiseLevelIcon}>{levelCopy.icon}</Text>
                  <Text style={[styles.noiseLevelTitle, isDay && styles.dayHeadingText, active && styles.noiseLevelTitleActive, isRtl && styles.rtlText]}>{levelCopy.label}</Text>
                  <Text style={[styles.noiseLevelCopy, isDay && styles.dayMutedText, active && styles.noiseLevelCopyActive, isRtl && styles.rtlText]}>{levelCopy.copy}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.noiseFilterRow, isRtl && styles.rtlRow]}>
            {noiseFilterKeys.map((filter) => (
              <Pill
                key={filter}
                label={noiseCopy.filters[filter]}
                active={noiseLevelPreference === filter}
                isDay={isDay}
                onPress={() => selectNoiseLevelPreference(filter)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={[styles.sectionHeader, isRtl && styles.rtlRow]}>
          <Text style={[styles.sectionTitle, isDay ? styles.dayHeadingText : null, isRtl && styles.rtlText]}>{mode === "day" ? copy.dayEvents : copy.eveningEvents}</Text>
          <TouchableOpacity activeOpacity={0.75} onPress={() => setShowHiddenEvents((current) => !current)}>
            <Text style={[styles.seeAll, isDay ? styles.dayLinkText : null, isRtl && styles.rtlText]}>
              {showHiddenEvents ? ("hideHidden" in copy ? copy.hideHidden : "Hide hidden") : copy.seeAll}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardStack}>
          {activeEvents.map((event) => (<EventCard key={event.id} event={event} isDay={isDay} appLanguageBase={appLanguageBase} />))}
        </View>

        <TouchableOpacity activeOpacity={0.88} onPress={() => router.push("/(tabs)/events")} style={[styles.createMeetupButton, isRtl && styles.rtlRow]}>
          <IconSymbol name="add" color={nsnColors.text} size={20} />
          <Text style={[styles.createMeetupButtonText, isRtl && styles.rtlText]}>
            {"createMeetup" in copy ? copy.createMeetup : "Create a Meetup"}
          </Text>
        </TouchableOpacity>

        <View style={[styles.insightGrid, isRtl && styles.rtlRow]}>
          <TouchableOpacity activeOpacity={0.84} onPress={() => setExpandedInsight(expandedInsight === "day-night" ? null : "day-night")} style={[styles.insightCard, isDay ? styles.dayCard : null]}>
            <Text style={styles.insightIcon}>☀️</Text>
            <Text style={[styles.insightTitle, isDay ? styles.dayHeadingText : null, isRtl && styles.rtlText]}>{copy.dayVsNight}</Text>
            <Text style={[styles.insightCopy, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{copy.dayVsNightCopy}</Text>
            <Text style={[styles.moreInfoText, isRtl && styles.rtlText]}>{copy.clickForMore}</Text>
            {expandedInsight === "day-night" ? (
              <Text style={[styles.insightDetail, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{copy.dayVsNightMore}</Text>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.84} onPress={() => setExpandedInsight(expandedInsight === "weather" ? null : "weather")} style={[styles.insightCard, isDay ? styles.dayCard : null]}>
            <Text style={styles.insightIcon}>🌧</Text>
            <Text style={[styles.insightTitle, isDay ? styles.dayHeadingText : null, isRtl && styles.rtlText]}>{copy.weatherAdaptive}</Text>
            <Text style={[styles.insightCopy, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{copy.weatherAdaptiveCopy}</Text>
            <Text style={[styles.moreInfoText, isRtl && styles.rtlText]}>{copy.clickForMore}</Text>
            {expandedInsight === "weather" ? (
              <Text style={[styles.insightDetail, isDay ? styles.dayMutedText : null, isRtl && styles.rtlText]}>{copy.weatherAdaptiveMore}</Text>
            ) : null}
          </TouchableOpacity>
        </View>
      </ScrollView>
      </Animated.View>
    </ScreenContainer>
  );
}

// Styling
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  animatedScreen: { flex: 1 },
  scrollSurface: { flex: 1, backgroundColor: "transparent" },
  modeGlow: { position: "absolute", top: -58, alignSelf: "center", width: 230, height: 230, borderRadius: 115 },
  dayBellButton: {backgroundColor: "#FFFFFF", },
  dayBellText: { color: "#0B1220", },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6", },
  dayHeadingText: { color: "#0B1220", },
  dayLinkText: { color: "#3949DB", },
  dayMutedText: { color: "#3B4A63", },
  dayLivePreview: { borderColor: "#B8C9E6", backgroundColor: "#EEF7FF" },
  dayPill: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6", },
  dayPillActive: { backgroundColor: "#4353FF", borderColor: "#4353FF", },
  dayPillText: { color: "#0B1220", },
  dayPillTextActive: { color: "#FFFFFF", },
  dayScreen: { backgroundColor: "#EAF4FF" },
  dayText: { color: "#111111", },
  dayNoiseLevelItem: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  dayNoiseLevelItemActive: { backgroundColor: "#EEF7FF", borderColor: nsnColors.primary },
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  headerTitle: { flex: 1, minWidth: 0 },
  headerActions: { flexShrink: 0, flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 12 },
  headerActionButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface },
  headerPlaceholderCard: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 18, borderWidth: 1, borderColor: "#24426F", backgroundColor: "rgba(255,255,255,0.045)", paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  dayHeaderPlaceholderCard: { borderColor: "#B8C9E6", backgroundColor: "#F8FBFF" },
  headerPlaceholderBody: { flex: 1, minWidth: 0 },
  headerPlaceholderTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  headerPlaceholderCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  headerPlaceholderDismiss: { minHeight: 32, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, paddingHorizontal: 13, alignItems: "center", justifyContent: "center" },
  dayHeaderPlaceholderDismiss: { borderColor: "#B8C9E6" },
  headerPlaceholderDismissText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900" },
  logo: { color: nsnColors.text, fontSize: 25, fontWeight: "800", letterSpacing: -0.4, lineHeight: 32 },
  moon: { color: nsnColors.day },
  subtitle: { color: nsnColors.muted, fontSize: 13, lineHeight: 18 },
  bellButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface },
  bellText: { color: nsnColors.text, fontSize: 20 },
  segmented: { flexDirection: "row", borderRadius: 24, padding: 4, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, marginBottom: 12 },
  segmentedDay: { backgroundColor: "#DCEEFF", borderColor: "#9FB6D8", },
  segment: { flex: 1, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  segmentDay: { backgroundColor: nsnColors.day },
  segmentInactiveDayText: {backgroundColor: "transparent", color: "#6E7F99", },
  segmentNight: { backgroundColor: nsnColors.primary },
  segmentText: { color: nsnColors.muted, fontWeight: "700", fontSize: 14 },
  segmentDayText: { color: "#1B2233" },
  segmentNightText: { color: nsnColors.text },
  themeSuggestionCard: { flexDirection: "row", alignItems: "flex-start", gap: 11, borderRadius: 18, borderWidth: 1, borderColor: "#24426F", backgroundColor: "rgba(255,255,255,0.045)", paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  dayThemeSuggestionCard: { borderColor: "#B8C9E6", backgroundColor: "#F8FBFF" },
  themeSuggestionIcon: { fontSize: 22, lineHeight: 27 },
  themeSuggestionBody: { flex: 1, minWidth: 0 },
  themeSuggestionTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  themeSuggestionCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  themeSuggestionActions: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  themeSuggestionSwitch: { minHeight: 32, borderRadius: 16, backgroundColor: nsnColors.primary, paddingHorizontal: 14, alignItems: "center", justifyContent: "center" },
  themeSuggestionSwitchText: { color: nsnColors.text, fontSize: 12, fontWeight: "900" },
  themeSuggestionDismiss: { minHeight: 32, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, paddingHorizontal: 12, alignItems: "center", justifyContent: "center" },
  dayThemeSuggestionDismiss: { borderColor: "#B8C9E6" },
  themeSuggestionDismissText: { color: nsnColors.muted, fontSize: 12, fontWeight: "800" },
  contextRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  dateText: { color: nsnColors.text, fontSize: 13, lineHeight: 19 },
  locationText: { color: nsnColors.muted, fontSize: 12, lineHeight: 18 },
  changeText: { color: "#96A5FF", fontSize: 12, fontWeight: "700" },
  weatherCard: { minHeight: 72, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 18, paddingHorizontal: 16, paddingVertical: 13, backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: "#1B3566", marginBottom: 12 },
  weatherTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  weatherCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, maxWidth: 250 },
  weatherIcon: { fontSize: 28 },
  filterRow: { gap: 8, paddingBottom: 14 },
  noiseGuideCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#06101F", padding: 14, marginBottom: 14 },
  noiseGuideHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  noiseGuideTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  noiseGuideCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  noiseLevelRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  noiseLevelItem: { flex: 1, minHeight: 78, borderRadius: 14, borderWidth: 1, borderColor: "#172B49", backgroundColor: "rgba(255,255,255,0.03)", alignItems: "center", justifyContent: "center", paddingHorizontal: 8, paddingVertical: 10 },
  noiseLevelItemActive: { borderColor: nsnColors.primary, backgroundColor: "rgba(56,72,255,0.16)" },
  noiseLevelIcon: { fontSize: 20, lineHeight: 24, marginBottom: 4 },
  noiseLevelTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17, textAlign: "center" },
  noiseLevelTitleActive: { color: nsnColors.text },
  noiseLevelCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 15, textAlign: "center" },
  noiseLevelCopyActive: { color: nsnColors.text },
  noiseFilterRow: { gap: 8 },
  pill: { height: 34, paddingHorizontal: 16, borderRadius: 17, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: "#13243E", alignItems: "center", justifyContent: "center" },
  pillActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  pillText: { color: nsnColors.muted, fontWeight: "700", fontSize: 12 },
  pillTextActive: { color: nsnColors.text },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 9 },
  sectionTitle: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 22 },
  seeAll: { color: "#96A5FF", fontSize: 12, fontWeight: "700" },
  cardStack: { gap: 10 },
  eventCard: { flexDirection: "row", minHeight: 126, borderRadius: 18, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, padding: 10, overflow: "hidden" },
  rtlEventCard: { flexDirection: "row-reverse" },
  eventImage: { width: 88, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  eventEmoji: { fontSize: 34 },
  eventBody: { flex: 1, paddingLeft: 11, paddingRight: 4 },
  eventTopLine: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 3 },
  rtlRow: { flexDirection: "row-reverse" },
  rtlBlock: { alignItems: "flex-end" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  smallTag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 9, backgroundColor: "rgba(114,214,126,0.18)" },
  smallTagText: { color: nsnColors.green, fontSize: 10, fontWeight: "800" },
  daySmallTag: { backgroundColor: "#D9F0DD", },
  daySmallTagText: { color: "#3E6F47", },
  eventTitle: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 19 },
  eventMeta: { color: nsnColors.muted, fontSize: 11, lineHeight: 16 },
  eventMetaDay: { color: "#CBD7EA", },
  eventDescription: { color: nsnColors.text, fontSize: 12, lineHeight: 17, marginTop: 2 },
  eventTags: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 7 },
  eventTagText: { color: nsnColors.muted, fontSize: 10, lineHeight: 14, backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, overflow: "hidden" },
  livePreview: { width: 82, height: 104, borderRadius: 15, borderWidth: 1, borderColor: "#24426F", backgroundColor: "#081A2F", overflow: "hidden", marginLeft: 6 },
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
  createMeetupButton: { height: 50, borderRadius: 15, marginTop: 14, marginBottom: 2, backgroundColor: nsnColors.primary, overflow: "hidden", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  createMeetupButtonText: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 20 },
  insightGrid: { flexDirection: "row", gap: 10, marginTop: 16 },
  insightCard: { flex: 1, minHeight: 116, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#06101F", padding: 14 },
  insightIcon: { fontSize: 25, marginBottom: 7 },
  insightTitle: { color: nsnColors.text, fontWeight: "800", fontSize: 13, lineHeight: 18 },
  insightCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  moreInfoText: { color: nsnColors.warning, fontSize: 12, lineHeight: 17, fontWeight: "800", marginTop: 8 },
  insightDetail: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  insightEmoji: { fontSize: 22, marginBottom: 6, marginTop: 2},
});
