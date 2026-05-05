import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { getLanguageBase, timezoneOptions, timezoneRegions, type TimezoneRegion, type TimezoneSetting, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { dayEvents, eveningEvents, EventItem, nsnColors } from "@/lib/nsn-data";

function Pill({ label, active, isDay }: { label: string; active?: boolean; isDay?: boolean }) {
  return (
    <TouchableOpacity style={[styles.pill, active && styles.pillActive, isDay && styles.dayPill, isDay && active && styles.dayPillActive, ]}>
      <Text style={[styles.pillText, active && styles.pillTextActive, isDay && styles.dayPillText, isDay && active && styles.dayPillTextActive, ]}>{label}</Text>
    </TouchableOpacity>
  );
}

function EventCard({ event, isDay, }: { event: EventItem; isDay?: boolean; }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => router.push(`/event/${event.id}`)}
      style={[styles.eventCard, isDay ? styles.dayCard : null, ]}
    >
      <View style={[styles.eventImage, { backgroundColor: event.imageTone }]}>
        <Text style={styles.eventEmoji}>{event.emoji}</Text>
      </View>
      <View style={styles.eventBody}>
        <View style={styles.eventTopLine}>
          <View style={[styles.smallTag, isDay ? styles.daySmallTag : null, ]}>
            <Text style={[styles.smallTagText, isDay ? styles.daySmallTagText : null, ]}>{event.category}</Text>
          </View>
          <Text style={[styles.eventTitle, isDay ? styles.dayHeadingText : null, ]} numberOfLines={1}>{event.title}</Text>
        </View>
        <Text style={[styles.eventMeta, isDay ? styles.dayMutedText : null, ]}>⌖ {event.venue}</Text>
        <Text style={[styles.eventMeta, isDay ? styles.dayMutedText : null, ]}>◎ {event.people}  ·  {event.time}</Text>
        <Text style={[styles.eventDescription, isDay ? styles.dayText : null, ]} numberOfLines={2}>{event.description}</Text>
        <View style={styles.eventTags}>
          <Text style={[styles.eventTagText, isDay ? styles.dayMutedText : null, ]}>🌿 {event.tone}</Text>
          <Text style={[styles.eventTagText, isDay ? styles.dayMutedText : null, ]}>☔ {event.weather}</Text>
        </View>
      </View>
      <View style={styles.cardArrow}>
        <Text style={[styles.cardArrowText, isDay ? styles.dayMutedText : null, ]}>›</Text>
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
    dayVsNight: "Day vs Night",
    dayVsNightCopy: "Find the right vibe at the right time.",
    weatherAdaptive: "Weather Adaptive",
    weatherAdaptiveCopy: "We suggest indoor alternatives if plans change.",
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
  },
  Hebrew: {
    subtitle: "מפגשים בלי לחץ סביב North Shore.",
    day: "יום ☀️",
    night: "לילה 🌙",
    morning: "🌅 בוקר טוב",
    afternoon: "☀️ צהריים טובים",
    evening: "🌙 ערב טוב",
    change: "שנה",
    timezone: "אזור זמן",
    done: "סיום",
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
    dayVsNight: "יום מול לילה",
    dayVsNightCopy: "מצא את הווייב הנכון בזמן הנכון.",
    weatherAdaptive: "מותאם למזג האוויר",
    weatherAdaptiveCopy: "נציע חלופות מקורות אם התוכניות משתנות.",
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
  const { isNightMode, setIsNightMode, timezone, setTimezone, appLanguage } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = homeTranslations[appLanguageBase as keyof typeof homeTranslations] ?? homeTranslations.English;
  
  const mode = isNightMode ? "night" : "day"; // State
  const activeEvents = useMemo(() => (isNightMode ? eveningEvents : dayEvents), [isNightMode]);
  const isDay = !isNightMode;
  const [now, setNow] = useState(new Date());
  const [isTimezonePickerOpen, setIsTimezonePickerOpen] = useState(false);
  const [worldCapitalOptions, setWorldCapitalOptions] = useState<TimezoneSetting[]>([]);
  const [isLoadingCapitals, setIsLoadingCapitals] = useState(false);
  const [capitalLoadError, setCapitalLoadError] = useState<string | null>(null);
  const timezonePickerRegions = ["All", ...timezoneRegions] as const;
  const [selectedTimezoneRegion, setSelectedTimezoneRegion] = useState<TimezoneRegion | "All">("All");
  const allTimezoneOptions = useMemo(() => {
    const curatedKeys = new Set(timezoneOptions.map((option) => `${option.city}|${option.country}`.toLowerCase()));
    const capitals = worldCapitalOptions.filter((option) => !curatedKeys.has(`${option.city}|${option.country}`.toLowerCase()));

    return [...timezoneOptions, ...capitals].sort((a, b) => a.label.localeCompare(b.label));
  }, [worldCapitalOptions]);
  const regionTimezoneOptions = allTimezoneOptions.filter(
    (option) => selectedTimezoneRegion === "All" || option.region === selectedTimezoneRegion
  );

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

  const formattedDate = timezoneNow.toLocaleDateString("en-AU", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: displayTimeZone,
}
  );

  const formattedTime = timezoneNow.toLocaleTimeString("en-AU", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: displayTimeZone,
}

  );

  // ===== LIVE TIME =====
  const hour = Number(
    new Intl.DateTimeFormat("en-AU", {
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

    useEffect(() => {
      Animated.loop(
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
      ).start();
    }, [weatherFloat]
  
      );  

    return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayScreen}>
      <ScrollView style={[styles.screen, isDay && styles.dayScreen]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.logo, isDay && styles.dayText]}>NSN <Text style={styles.moon}>☾</Text></Text>
            <Text style={[styles.subtitle, isDay && styles.dayMutedText]}>{copy.subtitle}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.75} style={[styles.bellButton, isDay ? styles.dayBellButton : null]}>
            <Text style={[styles.bellText, isDay ? styles.dayBellText : null]}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.segmented, isDay ? styles.segmentedDay : null]}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setIsNightMode(false)} style={[styles.segment, mode === "day" ? styles.segmentDay : null, ]}>
            <Text style={[styles.segmentText, mode === "day" ? styles.segmentDayText : null, isDay && mode !== "day" ? styles.segmentInactiveDayText : null,]}>{copy.day}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setIsNightMode(true)} style={[styles.segment, mode === "night" ? styles.segmentNight : null, ]}>
            <Text style={[styles.segmentText, mode === "night" ? styles.segmentNightText : null, isDay && mode === "day" ? styles.segmentInactiveDayText : null, ]}>{copy.night}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contextRow}>
          <View>
            <Text style={[styles.dateText, isDay && styles.dayMutedText]}>{greeting} • {formattedDate} • {formattedTime}</Text>
            <Text style={[styles.locationText, isDay && styles.dayMutedText]}>📍 {timezone.label}, {timezone.country}</Text>
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
              <View style={styles.timezoneHeader}>
                <Text style={[styles.timezoneTitle, isDay && styles.dayHeadingText]}>{copy.timezone}</Text>
                <TouchableOpacity activeOpacity={0.75} onPress={() => setIsTimezonePickerOpen(false)}>
                  <Text style={[styles.changeText, isDay && styles.dayLinkText]}>{copy.done}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.78}
                onPress={detectTimezone}
                style={[styles.autoTimezoneButton, isDay && styles.dayTimezoneOption]}
              >
                <Text style={[styles.timezoneOptionLabel, isDay && styles.dayHeadingText]}>Detect automatically</Text>
                <Text style={[styles.timezoneOptionMeta, isDay && styles.dayMutedText]}>Use this device's timezone when it matches a supported city.</Text>
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timezoneRegionRow}>
                {timezonePickerRegions.map((region) => {
                  const active = selectedTimezoneRegion === region;

                  return (
                    <TouchableOpacity
                      key={region}
                      activeOpacity={0.78}
                      onPress={() => setSelectedTimezoneRegion(region)}
                      style={[styles.timezoneRegionPill, isDay && styles.dayTimezoneRegionPill, active && styles.timezoneRegionPillActive]}
                    >
                      <Text style={[styles.timezoneRegionText, isDay && styles.dayMutedText, active && styles.timezoneRegionTextActive]}>{region}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <ScrollView style={styles.timezoneList} nestedScrollEnabled showsVerticalScrollIndicator>
              {isLoadingCapitals ? (
                <Text style={[styles.timezoneStatusText, isDay && styles.dayMutedText]}>Loading world capitals...</Text>
              ) : null}
              {capitalLoadError ? (
                <Text style={[styles.timezoneStatusText, isDay && styles.dayMutedText]}>{capitalLoadError}</Text>
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
                    style={[styles.timezoneOption, isDay && styles.dayTimezoneOption, selected && styles.timezoneOptionActive]}
                  >
                    <View>
                      <Text style={[styles.timezoneOptionLabel, isDay && styles.dayHeadingText]}>{option.label}</Text>
                      <Text style={[styles.timezoneOptionMeta, isDay && styles.dayMutedText]}>{option.country} · {option.utcOffset}</Text>
                      <Text style={[styles.timezoneOptionMeta, isDay && styles.dayMutedText]}>
                        {option.usesAutoTimezone ? "World capital · auto weather timezone" : option.timeZone}
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

        <TouchableOpacity activeOpacity={0.86} style={[styles.weatherCard, isDay && styles.dayCard]}>
          <View>
            <Text style={[styles.weatherTitle, isDay && styles.dayHeadingText]}>{copy.weatherUpdate}</Text>
            <Text style={[styles.weatherCopy, isDay && styles.dayMutedText]}>{weatherMessage}</Text>
          </View>
          <Animated.Text style={[styles.weatherIcon, { transform: [{ translateY: weatherFloat }] }, ]}
>
{weatherIcon}
</Animated.Text>
        </TouchableOpacity>
      
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {copy.filters.map((filter, index) => (
            <Pill key={filter} label={filter} active={index === 0} isDay={isDay} />
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDay ? styles.dayHeadingText : null]}>{mode === "day" ? copy.dayEvents : copy.eveningEvents}</Text>
          <Text style={[styles.seeAll, isDay ? styles.dayLinkText : null]}>{copy.seeAll}</Text>
        </View>
        <View style={styles.cardStack}>
          {activeEvents.map((event) => (<EventCard key={event.id} event={event} isDay={isDay} />))}
        </View>

        <View style={styles.insightGrid}>
          <View style={[styles.insightCard, isDay ? styles.dayCard : null]}>
            <Text style={styles.insightIcon}>☀️</Text>
            <Text style={[styles.insightTitle, isDay ? styles.dayHeadingText : null]}>{copy.dayVsNight}</Text>
            <Text style={[styles.insightCopy, isDay ? styles.dayMutedText : null]}>{copy.dayVsNightCopy}</Text>
          </View>
          <View style={[styles.insightCard, isDay ? styles.dayCard : null]}>
            <Text style={styles.insightIcon}>🌧</Text>
            <Text style={[styles.insightTitle, isDay ? styles.dayHeadingText : null]}>{copy.weatherAdaptive}</Text>
            <Text style={[styles.insightCopy, isDay ? styles.dayMutedText : null]}>{copy.weatherAdaptiveCopy}</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// Styling
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayBellButton: {backgroundColor: "#FFFFFF", },
  dayBellText: { color: "#0B1220", },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6", },
  dayHeadingText: { color: "#0B1220", },
  dayLinkText: { color: "#3949DB", },
  dayMutedText: { color: "#3B4A63", },
  dayPill: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6", },
  dayPillActive: { backgroundColor: "#4353FF", borderColor: "#4353FF", },
  dayPillText: { color: "#0B1220", },
  dayPillTextActive: { color: "#FFFFFF", },
  dayScreen: { backgroundColor: "#EAF4FF" },
  dayText: { color: "#111111", },
  dayTimezoneOption: { borderColor: "#B8C9E6" },
  dayTimezoneSheet: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
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
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)", padding: 16 },
  timezoneSheet: { borderRadius: 20, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surfaceRaised, padding: 16, gap: 10 },
  timezoneHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
  timezoneTitle: { color: nsnColors.text, fontSize: 18, fontWeight: "800", lineHeight: 24 },
  autoTimezoneButton: { minHeight: 62, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.03)", paddingHorizontal: 13, justifyContent: "center" },
  timezoneRegionRow: { gap: 8, paddingVertical: 2 },
  timezoneRegionPill: { minHeight: 34, borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.03)", paddingHorizontal: 13, alignItems: "center", justifyContent: "center" },
  dayTimezoneRegionPill: { borderColor: "#B8C9E6", backgroundColor: "#EAF4FF" },
  timezoneRegionPillActive: { borderColor: nsnColors.primary, backgroundColor: nsnColors.primary },
  timezoneRegionText: { color: nsnColors.muted, fontSize: 12, fontWeight: "800" },
  timezoneRegionTextActive: { color: nsnColors.text },
  timezoneList: { maxHeight: 280 },
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
  pill: { height: 34, paddingHorizontal: 16, borderRadius: 17, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: "#13243E", alignItems: "center", justifyContent: "center" },
  pillActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  pillText: { color: nsnColors.muted, fontWeight: "700", fontSize: 12 },
  pillTextActive: { color: nsnColors.text },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 9 },
  sectionTitle: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 22 },
  seeAll: { color: "#96A5FF", fontSize: 12, fontWeight: "700" },
  cardStack: { gap: 10 },
  eventCard: { flexDirection: "row", minHeight: 126, borderRadius: 18, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, padding: 10, overflow: "hidden" },
  eventImage: { width: 88, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  eventEmoji: { fontSize: 34 },
  eventBody: { flex: 1, paddingLeft: 11, paddingRight: 4 },
  eventTopLine: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 3 },
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
  cardArrow: { width: 30, alignItems: "center", justifyContent: "center" },
  cardArrowText: { color: nsnColors.text, fontSize: 32, lineHeight: 34 },
  insightGrid: { flexDirection: "row", gap: 10, marginTop: 16 },
  insightCard: { flex: 1, minHeight: 116, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#06101F", padding: 14 },
  insightIcon: { fontSize: 25, marginBottom: 7 },
  insightTitle: { color: nsnColors.text, fontWeight: "800", fontSize: 13, lineHeight: 18 },
  insightCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  insightEmoji: { fontSize: 22, marginBottom: 6, marginTop: 2},
});
