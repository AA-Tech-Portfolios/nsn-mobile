import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

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

export default function HomeScreen() {
  const [mode, setMode] = useState<"day" | "night">("day"); // State
  const activeEvents = useMemo(() => (mode === "day" ? dayEvents : eveningEvents), [mode]);
  const isDay = mode === "day";
  const [now, setNow] = useState(new Date()); useEffect(() => {
  const timer = setInterval(() => { setNow(new Date()); 
  const hour = now.getHours();

    }, 1000); // updates every second

  return () => clearInterval(timer);}, []
  );

  const formattedDate = now.toLocaleDateString("en-AU", {
  weekday: "long",
  day: "numeric",
  month: "long",
}
  );

  const formattedTime = now.toLocaleTimeString("en-AU", {
  hour: "2-digit",
  minute: "2-digit",
}

  );

  // ===== LIVE TIME =====
  const hour = now.getHours();

  const greeting =
  hour < 12
    ? "🌅 Good morning"
    : hour < 18
    ? "☀️ Good afternoon"
    : "🌙 Good evening";

  // ===== WEATHER =====
  const [weather, setWeather] = useState({
    temperature: null as number | null,
    rainChance: null as number | null,
  });

  const weatherMessage =
  weather.temperature === null || weather.rainChance === null
    ? "Loading local weather..."
    : weather.rainChance >= 70
    ? `☔ Rain likely today • Sydney ${weather.temperature}°C • Indoor alternatives recommended.`
    : weather.rainChance >= 35
    ? `🌦️ Slight rain possible • Sydney ${weather.temperature}°C • We'll keep you updated.`
    : weather.temperature >= 28
    ? `☀️ Warm day • Sydney ${weather.temperature}°C • Great for outdoor meetups.`
    : `🌤️ Good meetup weather • Sydney ${weather.temperature}°C • Rain chance ${weather.rainChance}%.`;

  useEffect(() => {
  async function fetchWeather() {
    try {
      const latitude = -33.75;
      const longitude = 151.15;

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=precipitation_probability&timezone=Australia%2FSydney&forecast_days=1`
      );

      const data = await response.json();

      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        rainChance: data.hourly.precipitation_probability?.[0] ?? null,
      });
    } catch (error) {
      console.log("Weather fetch failed:", error);
    }
  }

  fetchWeather();

  const timer = setInterval(fetchWeather, 15 * 60 * 1000);

  return () => clearInterval(timer);}, []

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
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <ScrollView style={[styles.screen, isDay && styles.dayScreen]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.logo, isDay && styles.dayText]}>NSN <Text style={styles.moon}>☾</Text></Text>
            <Text style={[styles.subtitle, isDay && styles.dayMutedText]}>Low-pressure meetups around the North Shore.</Text>
          </View>
          <TouchableOpacity activeOpacity={0.75} style={[styles.bellButton, isDay ? styles.dayBellButton : null]}>
            <Text style={[styles.bellText, isDay ? styles.dayBellText : null]}>🔔</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.segmented, isDay ? styles.segmentedDay : null]}>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setMode("day")} style={[styles.segment, mode === "day" ? styles.segmentDay : null, ]}>
            <Text style={[styles.segmentText, mode === "day" ? styles.segmentDayText : null, isDay && mode !== "day" ? styles.segmentInactiveDayText : null,]}>Day ☀️</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} onPress={() => setMode("night")} style={[styles.segment, mode === "night" ? styles.segmentNight : null, ]}>
            <Text style={[styles.segmentText, mode === "night" ? styles.segmentNightText : null, isDay && mode === "day" ? styles.segmentInactiveDayText : null, ]}>Night 🌙</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contextRow}>
          <View>
            <Text style={[styles.dateText, isDay && styles.dayMutedText]}>{greeting} • {formattedDate} • {formattedTime}</Text>
            <Text style={[styles.locationText, isDay && styles.dayMutedText]}>📍 North Shore, NSW</Text>
          </View>
          <TouchableOpacity activeOpacity={0.75}>
            <Text style={[styles.changeText, isDay ? styles.dayLinkText : null]}>Change</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.86} style={[styles.weatherCard, isDay && styles.dayCard]}>
          <View>
            <Text style={[styles.weatherTitle, isDay && styles.dayHeadingText]}>Weather update</Text>
            <Text style={[styles.weatherCopy, isDay && styles.dayMutedText]}>{weatherMessage}</Text>
          </View>
          <Animated.Text style={[styles.weatherIcon, { transform: [{ translateY: weatherFloat }] }, ]}
>
{weatherIcon}
</Animated.Text>
        </TouchableOpacity>
      
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {['All', 'Outdoor', 'Indoor', 'Food', 'Active'].map((filter, index) => (
            <Pill key={filter} label={filter} active={index === 0} isDay={isDay} />
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDay ? styles.dayHeadingText : null]}>{mode === "day" ? "☀️ Day Events" : "🌙 Evening Events"}</Text>
          <Text style={[styles.seeAll, isDay ? styles.dayLinkText : null]}>See all</Text>
        </View>
        <View style={styles.cardStack}>
          {activeEvents.map((event) => (<EventCard key={event.id} event={event} isDay={isDay} />))}
        </View>

        <View style={styles.insightGrid}>
          <View style={[styles.insightCard, isDay ? styles.dayCard : null]}>
            <Text style={styles.insightIcon}>☀️</Text>
            <Text style={[styles.insightTitle, isDay ? styles.dayHeadingText : null]}>Day vs Night</Text>
            <Text style={[styles.insightCopy, isDay ? styles.dayMutedText : null]}>Find the right vibe at the right time.</Text>
          </View>
          <View style={[styles.insightCard, isDay ? styles.dayCard : null]}>
            <Text style={styles.insightIcon}>🌧</Text>
            <Text style={[styles.insightTitle, isDay ? styles.dayHeadingText : null]}>Weather Adaptive</Text>
            <Text style={[styles.insightCopy, isDay ? styles.dayMutedText : null]}>We suggest indoor alternatives if plans change.</Text>
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
