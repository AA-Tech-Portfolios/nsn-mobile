import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { getLanguageBase, timezoneOptions, timezoneRegions, type NoiseLevelPreference, type TimezoneRegion, type TimezoneSetting, useAppSettings } from "@/lib/app-settings";
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
const timezoneRegionTranslations: Record<string, Partial<Record<TimezoneRegion | "All", string>>> = {
  Arabic: {
    All: "الكل",
    UTC: "UTC",
    Oceania: "أوقيانوسيا",
    Asia: "آسيا",
    "Middle East": "الشرق الأوسط",
    Africa: "أفريقيا",
    Europe: "أوروبا",
    "North America": "أمريكا الشمالية",
    "Central America": "أمريكا الوسطى",
    "South America": "أمريكا الجنوبية",
  },
  Hebrew: {
    All: "הכל",
    UTC: "UTC",
    Oceania: "אוקיאניה",
    Asia: "אסיה",
    "Middle East": "המזרח התיכון",
    Africa: "אפריקה",
    Europe: "אירופה",
    "North America": "צפון אמריקה",
    "Central America": "מרכז אמריקה",
    "South America": "דרום אמריקה",
  },
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
    timezone: "Timezone",
    done: "Done",
    allRegions: "All",
    detectAutomatically: "Detect automatically",
    detectAutomaticallyCopy: "Use this device's timezone when it matches a supported city.",
    searchTimezones: "Search city, country, or timezone",
    noTimezonesFound: "No matching timezones found.",
    loadingCapitals: "Loading world capitals...",
    worldCapitalAutoTimezone: "World capital · auto weather timezone",
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
  },
  Arabic: {
    subtitle: "لقاءات بلا ضغط حول نورث شور.",
    day: "نهار ☀️",
    night: "ليل 🌙",
    morning: "🌅 صباح الخير",
    afternoon: "☀️ مساء الخير",
    evening: "🌙 مساء هادئ",
    change: "تغيير",
    timezone: "المنطقة الزمنية",
    done: "تم",
    allRegions: "الكل",
    detectAutomatically: "اكتشاف تلقائي",
    detectAutomaticallyCopy: "استخدم المنطقة الزمنية لهذا الجهاز عندما تطابق مدينة مدعومة.",
    loadingCapitals: "جارٍ تحميل عواصم العالم...",
    worldCapitalAutoTimezone: "عاصمة عالمية · منطقة زمنية تلقائية للطقس",
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
    timezone: "时区",
    done: "完成",
    allRegions: "全部",
    detectAutomatically: "自动检测",
    detectAutomaticallyCopy: "当设备时区匹配支持城市时使用它。",
    loadingCapitals: "正在加载世界首都...",
    worldCapitalAutoTimezone: "世界首都 · 自动天气时区",
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
    dayVsNight: "白天与夜晚",
    dayVsNightCopy: "在合适的时间找到合适的氛围。",
    weatherAdaptive: "适应天气",
    weatherAdaptiveCopy: "如果计划变化，我们会建议室内替代方案。",
    clickForMore: "点击查看更多...",
    dayVsNightMore: "白天活动更明亮、更适合活动。夜晚活动更安静、偏室内，也更容易在社交能量低时离开。",
    weatherAdaptiveMore: "户外活动可以有备用方案。如果下雨或太热，NSN 可以在你确认前建议室内选择。",
  },
  French: {
    subtitle: "Rencontres sans pression autour de la North Shore.",
    day: "Jour ☀️",
    night: "Nuit 🌙",
    morning: "🌅 Bonjour",
    afternoon: "☀️ Bon après-midi",
    evening: "🌙 Bonsoir",
    change: "Changer",
    timezone: "Fuseau horaire",
    done: "Terminé",
    allRegions: "Tout",
    detectAutomatically: "Détecter automatiquement",
    detectAutomaticallyCopy: "Utiliser le fuseau de cet appareil quand il correspond à une ville prise en charge.",
    loadingCapitals: "Chargement des capitales du monde...",
    worldCapitalAutoTimezone: "Capitale mondiale · fuseau météo automatique",
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
    timezone: "Zeitzone",
    done: "Fertig",
    allRegions: "Alle",
    detectAutomatically: "Automatisch erkennen",
    detectAutomaticallyCopy: "Die Zeitzone dieses Geräts verwenden, wenn sie zu einer unterstützten Stadt passt.",
    loadingCapitals: "Welt-Hauptstädte werden geladen...",
    worldCapitalAutoTimezone: "Welt-Hauptstadt · automatische Wetter-Zeitzone",
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
    timezone: "אזור זמן",
    done: "סיום",
    allRegions: "הכל",
    detectAutomatically: "זיהוי אוטומטי",
    detectAutomaticallyCopy: "השתמש באזור הזמן של המכשיר כשהוא מתאים לעיר נתמכת.",
    searchTimezones: "חיפוש עיר, מדינה או אזור זמן",
    noTimezonesFound: "לא נמצאו אזורי זמן תואמים.",
    loadingCapitals: "טוען ערי בירה בעולם...",
    worldCapitalAutoTimezone: "עיר בירה עולמית · אזור זמן אוטומטי למזג אוויר",
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
    timezone: "タイムゾーン",
    done: "完了",
    allRegions: "すべて",
    detectAutomatically: "自動検出",
    detectAutomaticallyCopy: "対応している都市と一致する場合、このデバイスのタイムゾーンを使います。",
    loadingCapitals: "世界の首都を読み込み中...",
    worldCapitalAutoTimezone: "世界の首都 · 天気用自動タイムゾーン",
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
    dayVsNight: "昼と夜",
    dayVsNightCopy: "ちょうどよい時間に、ちょうどよい雰囲気を。",
    weatherAdaptive: "天気に対応",
    weatherAdaptiveCopy: "予定が変わる場合は屋内の代替案を提案します。",
    clickForMore: "詳しく見る...",
    dayVsNightMore: "昼のイベントは明るく活動向きです。夜のイベントはより落ち着き、屋内寄りで、社交エネルギーが低い時にも離れやすいです。",
    weatherAdaptiveMore: "屋外イベントにはバックアップ案を持たせられます。雨や暑さが気になる場合、参加前に屋内案を提案できます。",
  },
  Korean: {
    subtitle: "노스쇼어 주변의 부담 없는 모임.",
    day: "낮 ☀️",
    night: "밤 🌙",
    morning: "🌅 좋은 아침",
    afternoon: "☀️ 좋은 오후",
    evening: "🌙 좋은 저녁",
    change: "변경",
    timezone: "시간대",
    done: "완료",
    allRegions: "전체",
    detectAutomatically: "자동 감지",
    detectAutomaticallyCopy: "지원 도시와 맞으면 이 기기의 시간대를 사용합니다.",
    loadingCapitals: "세계 수도를 불러오는 중...",
    worldCapitalAutoTimezone: "세계 수도 · 자동 날씨 시간대",
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
    dayVsNight: "낮과 밤",
    dayVsNightCopy: "맞는 시간에 맞는 분위기를 찾아요.",
    weatherAdaptive: "날씨에 맞춤",
    weatherAdaptiveCopy: "계획이 바뀌면 실내 대안을 제안해요.",
    clickForMore: "더 보기...",
    dayVsNightMore: "낮 이벤트는 더 밝고 활동적이에요. 밤 이벤트는 더 차분하고 실내 중심이며, 사회적 에너지가 낮을 때 떠나기 쉬워요.",
    weatherAdaptiveMore: "야외 이벤트에는 백업 계획을 둘 수 있어요. 비나 더위가 방해되면 참여 전에 실내 대안을 제안할 수 있어요.",
  },
  Russian: {
    subtitle: "Встречи без давления вокруг North Shore.",
    day: "День ☀️",
    night: "Ночь 🌙",
    morning: "🌅 Доброе утро",
    afternoon: "☀️ Добрый день",
    evening: "🌙 Добрый вечер",
    change: "Изменить",
    timezone: "Часовой пояс",
    done: "Готово",
    allRegions: "Все",
    detectAutomatically: "Определить автоматически",
    detectAutomaticallyCopy: "Использовать часовой пояс устройства, если он совпадает с поддерживаемым городом.",
    loadingCapitals: "Загружаем столицы мира...",
    worldCapitalAutoTimezone: "Мировая столица · авточасовой пояс для погоды",
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
    timezone: "Zona horaria",
    done: "Listo",
    allRegions: "Todo",
    detectAutomatically: "Detectar automáticamente",
    detectAutomaticallyCopy: "Usar la zona horaria de este dispositivo cuando coincida con una ciudad compatible.",
    loadingCapitals: "Cargando capitales del mundo...",
    worldCapitalAutoTimezone: "Capital mundial · zona horaria automática para el clima",
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

type RestCountry = {
  cca2?: string;
  capital?: string[];
  capitalInfo?: { latlng?: number[] };
  name?: { common?: string };
  region?: string;
  subregion?: string;
  timezones?: string[];
};

const normalizeIdPart = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const parseUtcOffsetMinutes = (value?: string) => {
  if (!value || value === "UTC") {
    return 0;
  }

  const match = value.match(/^UTC([+-])(\d{2}):?(\d{2})?$/);

  if (!match) {
    return 0;
  }

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? "0");

  return sign * (hours * 60 + minutes);
};

const mapCountryRegionToTimezoneRegion = (region?: string, subregion?: string): TimezoneRegion => {
  if (region === "Africa") {
    return "Africa";
  }

  if (region === "Europe") {
    return "Europe";
  }

  if (region === "Oceania") {
    return "Oceania";
  }

  if (region === "Asia") {
    return subregion === "Western Asia" ? "Middle East" : "Asia";
  }

  if (region === "Americas") {
    if (subregion?.includes("South")) {
      return "South America";
    }

    if (subregion?.includes("Central") || subregion === "Caribbean") {
      return "Central America";
    }

    return "North America";
  }

  return "UTC";
};

const getTimezoneNow = (date: Date, option: TimezoneSetting) =>
  option.utcOffsetMinutes === undefined ? date : new Date(date.getTime() + option.utcOffsetMinutes * 60 * 1000);

const getDisplayTimeZone = (option: TimezoneSetting) => (option.utcOffsetMinutes === undefined ? option.timeZone : "UTC");

export default function HomeScreen() {
  const router = useRouter();
  const { isNightMode, setIsNightMode, timezone, setTimezone, appLanguage, resetOnboarding, reduceMotion, slowerTransitions, comfortPreferences, pinnedEventIds, hiddenEventIds, noiseLevelPreference, saveSoftHelloMvpState } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = homeTranslations[appLanguageBase as keyof typeof homeTranslations] ?? homeTranslations.English;
  const noiseCopy = noiseGuideTranslations[appLanguageBase as keyof typeof noiseGuideTranslations] ?? noiseGuideTranslations.English;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const locale = appLocaleMap[appLanguage] ?? appLocaleMap[appLanguageBase] ?? "en-AU";
  
  const mode = isNightMode ? "night" : "day"; // State
  const [activeFilter, setActiveFilter] = useState<EventFilter>("All");
  const [showHiddenEvents, setShowHiddenEvents] = useState(false);
  const [expandedInsight, setExpandedInsight] = useState<"day-night" | "weather" | null>(null);
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
  const [isTimezonePickerOpen, setIsTimezonePickerOpen] = useState(false);
  const [worldCapitalOptions, setWorldCapitalOptions] = useState<TimezoneSetting[]>([]);
  const [isLoadingCapitals, setIsLoadingCapitals] = useState(false);
  const [capitalLoadError, setCapitalLoadError] = useState<string | null>(null);
  const timezonePickerRegions = ["All", ...timezoneRegions] as const;
  const [selectedTimezoneRegion, setSelectedTimezoneRegion] = useState<TimezoneRegion | "All">("All");
  const [timezoneSearch, setTimezoneSearch] = useState("");
  const allTimezoneOptions = useMemo(() => {
    const curatedKeys = new Set(timezoneOptions.map((option) => `${option.city}|${option.country}`.toLowerCase()));
    const capitals = worldCapitalOptions.filter((option) => !curatedKeys.has(`${option.city}|${option.country}`.toLowerCase()));

    return [...timezoneOptions, ...capitals].sort((a, b) => a.label.localeCompare(b.label));
  }, [worldCapitalOptions]);
  const normalizedTimezoneSearch = timezoneSearch.trim().toLowerCase();
  const regionTimezoneOptions = allTimezoneOptions.filter((option) => {
    const matchesRegion = selectedTimezoneRegion === "All" || option.region === selectedTimezoneRegion;

    if (!matchesRegion) {
      return false;
    }

    if (!normalizedTimezoneSearch) {
      return true;
    }

    return [option.label, option.city, option.country, option.region, option.timeZone, option.utcOffset]
      .join(" ")
      .toLowerCase()
      .includes(normalizedTimezoneSearch);
  });

  const detectTimezone = () => {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const detectedOption = allTimezoneOptions.find((option) => option.timeZone === detectedTimeZone);

    if (detectedOption) {
      setTimezone(detectedOption);
      setSelectedTimezoneRegion(detectedOption.region);
    } else {
      setTimezone(timezoneOptions[0]);
      setSelectedTimezoneRegion("UTC");
    }

    setIsTimezonePickerOpen(false);
  };

  const selectNoiseLevelPreference = (preference: NoiseLevelPreference) => {
    saveSoftHelloMvpState({ noiseLevelPreference: preference });
  };

  useEffect(() => {
  const timer = setInterval(() => { setNow(new Date()); }, 1000); // updates every second

  return () => clearInterval(timer);}, []
  );

  useEffect(() => {
    if (!isTimezonePickerOpen || worldCapitalOptions.length > 0 || isLoadingCapitals) {
      return;
    }

    let isMounted = true;

    async function fetchWorldCapitals() {
      try {
        setIsLoadingCapitals(true);
        setCapitalLoadError(null);

        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,capitalInfo,timezones,region,subregion,cca2"
        );

        if (!response.ok) {
          throw new Error("Capital list request failed");
        }

        const countries = (await response.json()) as RestCountry[];
        const capitalOptions = countries
          .flatMap((country) => {
            const capital = country.capital?.[0];
            const countryName = country.name?.common;
            const [latitude, longitude] = country.capitalInfo?.latlng ?? [];

            if (!capital || !countryName || latitude === undefined || longitude === undefined) {
              return [];
            }

            const utcOffset = country.timezones?.[0] ?? "UTC";
            const idCountryPart = country.cca2?.toLowerCase() ?? normalizeIdPart(countryName);

            return [
              {
                id: `capital-${idCountryPart}-${normalizeIdPart(capital)}`,
                label: capital,
                city: capital,
                country: countryName,
                region: mapCountryRegionToTimezoneRegion(country.region, country.subregion),
                timeZone: "UTC",
                utcOffset,
                utcOffsetMinutes: parseUtcOffsetMinutes(utcOffset),
                usesAutoTimezone: true,
                latitude,
                longitude,
              } satisfies TimezoneSetting,
            ];
          })
          .sort((a, b) => a.label.localeCompare(b.label));

        if (isMounted) {
          setWorldCapitalOptions(capitalOptions);
        }
      } catch (error) {
        console.log("World capitals fetch failed:", error);

        if (isMounted) {
          setCapitalLoadError("World capitals could not load right now. Curated cities are still available.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingCapitals(false);
        }
      }
    }

    fetchWorldCapitals();

    return () => {
      isMounted = false;
    };
  }, [isLoadingCapitals, isTimezonePickerOpen, worldCapitalOptions.length]);

  const timezoneNow = getTimezoneNow(now, timezone);
  const displayTimeZone = getDisplayTimeZone(timezone);

  const formattedDate = timezoneNow.toLocaleDateString(locale, {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: displayTimeZone,
}
  );

  const formattedTime = timezoneNow.toLocaleTimeString(locale, {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: displayTimeZone,
}

  );

  // ===== LIVE TIME =====
  const hour = Number(
    new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      hour12: false,
      timeZone: displayTimeZone,
    }).format(timezoneNow)
  );

  const greeting =
  hour < 12
    ? copy.morning
    : hour < 18
    ? copy.afternoon
    : copy.evening;

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
        `https://api.open-meteo.com/v1/forecast?latitude=${timezone.latitude}&longitude=${timezone.longitude}&current=temperature_2m&hourly=precipitation_probability&timezone=${encodeURIComponent(timezone.usesAutoTimezone ? "auto" : timezone.timeZone)}&forecast_days=1`
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
          <View style={isRtl && styles.rtlBlock}>
            <Text style={[styles.logo, isDay && styles.dayText]}>NSN</Text>
            <Text style={[styles.subtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.subtitle}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={resetOnboarding}
            accessibilityRole="button"
            accessibilityLabel="Restart NSN onboarding"
            accessibilityHint="Opens the setup flow again."
            style={[styles.bellButton, isDay ? styles.dayBellButton : null]}
          >
            <IconSymbol name="person.fill" color={isDay ? "#0B1220" : nsnColors.text} size={22} />
          </TouchableOpacity>
        </View>

        <View style={[styles.segmented, isDay ? styles.segmentedDay : null, isRtl && styles.rtlRow]}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setIsNightMode(false)} style={[styles.segment, mode === "day" ? styles.segmentDay : null, ]}>
            <Text style={[styles.segmentText, mode === "day" ? styles.segmentDayText : null, isDay && mode !== "day" ? styles.segmentInactiveDayText : null,]}>{copy.day}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setIsNightMode(true)} style={[styles.segment, mode === "night" ? styles.segmentNight : null, ]}>
            <Text style={[styles.segmentText, mode === "night" ? styles.segmentNightText : null, isDay && mode === "day" ? styles.segmentInactiveDayText : null, ]}>{copy.night}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.contextRow, isRtl && styles.rtlRow]}>
          <View style={isRtl && styles.rtlBlock}>
            <Text style={[styles.dateText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{greeting} • {formattedDate} • {formattedTime}</Text>
            <Text style={[styles.locationText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>📍 {timezone.label}, {timezone.country}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.75} onPress={() => setIsTimezonePickerOpen(true)}>
            <Text style={[styles.changeText, isDay ? styles.dayLinkText : null]}>{copy.change}</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={isTimezonePickerOpen}
          onRequestClose={() => setIsTimezonePickerOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.timezoneSheet, isDay && styles.dayTimezoneSheet]}>
              <View style={[styles.timezoneHeader, isRtl && styles.rtlRow]}>
                <Text style={[styles.timezoneTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.timezone}</Text>
                <TouchableOpacity activeOpacity={0.75} onPress={() => setIsTimezonePickerOpen(false)}>
                  <Text style={[styles.changeText, isDay && styles.dayLinkText]}>{copy.done}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.78}
                onPress={detectTimezone}
                style={[styles.autoTimezoneButton, isDay && styles.dayTimezoneOption]}
              >
                <Text style={[styles.timezoneOptionLabel, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.detectAutomatically}</Text>
                <Text style={[styles.timezoneOptionMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.detectAutomaticallyCopy}</Text>
              </TouchableOpacity>

              <TextInput
                value={timezoneSearch}
                onChangeText={setTimezoneSearch}
                placeholder={"searchTimezones" in copy ? copy.searchTimezones : "Search city, country, or timezone"}
                placeholderTextColor={isDay ? "#6E7F99" : nsnColors.mutedSoft}
                style={[styles.timezoneSearchInput, isDay && styles.dayTimezoneSearchInput, isRtl && styles.rtlText]}
                selectionColor={nsnColors.primary}
              />

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.timezoneRegionRow, isRtl && styles.rtlRow]}>
                {timezonePickerRegions.map((region) => {
                  const active = selectedTimezoneRegion === region;
                  const regionLabel = timezoneRegionTranslations[appLanguageBase]?.[region] ?? (region === "All" ? copy.allRegions : region);

                  return (
                    <TouchableOpacity
                      key={region}
                      activeOpacity={0.78}
                      onPress={() => setSelectedTimezoneRegion(region)}
                      style={[styles.timezoneRegionPill, isDay && styles.dayTimezoneRegionPill, active && styles.timezoneRegionPillActive]}
                    >
                      <Text style={[styles.timezoneRegionText, isDay && styles.dayMutedText, active && styles.timezoneRegionTextActive]}>{regionLabel}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <ScrollView style={styles.timezoneList} nestedScrollEnabled showsVerticalScrollIndicator>
              {isLoadingCapitals ? (
                <Text style={[styles.timezoneStatusText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.loadingCapitals}</Text>
              ) : null}
              {capitalLoadError ? (
                <Text style={[styles.timezoneStatusText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{capitalLoadError}</Text>
              ) : null}
              {regionTimezoneOptions.length === 0 ? (
                <Text style={[styles.timezoneStatusText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  {"noTimezonesFound" in copy ? copy.noTimezonesFound : "No matching timezones found."}
                </Text>
              ) : null}
              {regionTimezoneOptions.map((option) => {
                const selected = option.id === timezone.id;

                return (
                  <TouchableOpacity
                    key={option.id}
                    activeOpacity={0.78}
                    onPress={() => {
                      setTimezone(option);
                      setIsTimezonePickerOpen(false);
                    }}
                    style={[styles.timezoneOption, isDay && styles.dayTimezoneOption, selected && styles.timezoneOptionActive, isRtl && styles.rtlRow]}
                  >
                    <View style={isRtl && styles.rtlBlock}>
                      <Text style={[styles.timezoneOptionLabel, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{option.label}</Text>
                      <Text style={[styles.timezoneOptionMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{option.country} · {option.utcOffset}</Text>
                      <Text style={[styles.timezoneOptionMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                        {option.usesAutoTimezone ? copy.worldCapitalAutoTimezone : option.timeZone}
                      </Text>
                    </View>
                    <Text style={[styles.timezoneCheck, selected && styles.timezoneCheckActive]}>{selected ? "✓" : ""}</Text>
                  </TouchableOpacity>
                );
              })}
              </ScrollView>
            </View>
          </View>
        </Modal>

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
  dayTimezoneOption: { borderColor: "#B8C9E6" },
  dayTimezoneSheet: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  dayNoiseLevelItem: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  dayNoiseLevelItemActive: { backgroundColor: "#EEF7FF", borderColor: nsnColors.primary },
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
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
  contextRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  dateText: { color: nsnColors.text, fontSize: 13, lineHeight: 19 },
  locationText: { color: nsnColors.muted, fontSize: 12, lineHeight: 18 },
  changeText: { color: "#96A5FF", fontSize: 12, fontWeight: "700" },
  modalBackdrop: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.45)", padding: 16 },
  timezoneSheet: { width: "100%", maxWidth: 920, maxHeight: "88%", alignSelf: "center", borderRadius: 20, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surfaceRaised, padding: 16, gap: 10 },
  timezoneHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  timezoneTitle: { color: nsnColors.text, fontSize: 18, fontWeight: "800", lineHeight: 24 },
  autoTimezoneButton: { minHeight: 62, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.03)", paddingHorizontal: 13, justifyContent: "center" },
  timezoneSearchInput: { minHeight: 46, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", color: nsnColors.text, paddingHorizontal: 13, fontSize: 14, fontWeight: "700" },
  dayTimezoneSearchInput: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6", color: "#0B1220" },
  timezoneRegionRow: { gap: 8, paddingVertical: 2 },
  timezoneRegionPill: { minHeight: 34, borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.03)", paddingHorizontal: 13, alignItems: "center", justifyContent: "center" },
  dayTimezoneRegionPill: { borderColor: "#B8C9E6", backgroundColor: "#EAF4FF" },
  timezoneRegionPillActive: { borderColor: nsnColors.primary, backgroundColor: nsnColors.primary },
  timezoneRegionText: { color: nsnColors.muted, fontSize: 12, fontWeight: "800" },
  timezoneRegionTextActive: { color: nsnColors.text },
  timezoneList: { maxHeight: 520 },
  timezoneOption: { minHeight: 58, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.03)", paddingHorizontal: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  timezoneOptionActive: { borderColor: nsnColors.primary },
  timezoneOptionLabel: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  timezoneOptionMeta: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  timezoneStatusText: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 17, paddingHorizontal: 4, paddingVertical: 8 },
  timezoneCheck: { width: 24, color: nsnColors.muted, fontSize: 16, fontWeight: "900", textAlign: "right" },
  timezoneCheckActive: { color: nsnColors.primary },
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
