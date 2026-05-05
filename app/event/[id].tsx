import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { allEvents, movieNight, nsnColors } from "@/lib/nsn-data";

const eventTranslations = {
  English: {
    title: "Movie Night —\nWatch + Chat",
    category: "Indoor",
    tone: "☽ Quiet",
    date: "Saturday, 24 May · 7:00pm",
    people: "2–4 people",
    description: "Watch first, optional chat after if it feels right. Perfect for low-pressure meetups.",
    weatherTitle: "☀ Weather update",
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
  },
} as const;

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { appLanguage, isNightMode } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = eventTranslations[appLanguageBase as keyof typeof eventTranslations] ?? eventTranslations.English;
  const isDay = !isNightMode;
  const iconColor = isDay ? "#0B1220" : nsnColors.text;
  const event = allEvents.find((item) => item.id === id) ?? movieNight;
  const isMovieNight = event.id === movieNight.id;
  const eventTitle = isMovieNight ? copy.title : event.title.replace(" — ", " —\n");
  const eventCategory = isMovieNight ? copy.category : event.category;
  const eventTone = isMovieNight ? copy.tone : `☽ ${event.tone}`;
  const eventDate = isMovieNight ? copy.date : `${isNightMode ? "Tonight" : "Today"} · ${event.time}`;
  const eventPeople = isMovieNight ? copy.people : event.people;
  const eventDescription = isMovieNight ? copy.description : `${event.description} A low-pressure meetup with clear expectations before you join.`;
  const eventWeatherCopy = event.weather.includes("Weather")
    ? "Weather may affect this plan, so check the backup option before heading out."
    : "This event has a weather-friendly plan.";
  const eventMeetingCopy = isMovieNight
    ? copy.meetingCopy
    : `Meet near ${event.venue} about 10 minutes before the start time. The host can share a calmer exact spot in chat.`;

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayScreen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={[styles.screen, isDay && styles.dayScreen]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={[styles.iconButton, isDay && styles.dayIconButton]}>
            <IconSymbol name="chevron.left" color={iconColor} size={26} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity activeOpacity={0.75} style={[styles.iconButton, isDay && styles.dayIconButton]}>
              <IconSymbol name="share" color={iconColor} size={22} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.75} style={[styles.iconButton, isDay && styles.dayIconButton]}>
              <IconSymbol name="more" color={iconColor} size={23} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.heroPanel, isDay && styles.dayPanel]}>
          <View style={styles.eventAvatar}>
            <Text style={styles.avatarEmoji}>{event.emoji}</Text>
          </View>
          <Text style={[styles.title, isDay && styles.dayHeadingText]}>{eventTitle}</Text>
          <View style={styles.tagRow}>
            <Text style={styles.primaryChip}>{eventCategory}</Text>
            <Text style={[styles.quietChip, isDay && styles.dayQuietChip]}>{eventTone}</Text>
          </View>
        </View>

        <View style={styles.metaStack}>
          <Text style={[styles.metaLine, isDay && styles.dayText]}>⌖ {event.venue}</Text>
          <Text style={[styles.metaLine, isDay && styles.dayText]}>▣ {eventDate}</Text>
          <Text style={[styles.metaLine, isDay && styles.dayText]}>♧ {eventPeople}</Text>
        </View>

        <Text style={[styles.description, isDay && styles.dayText]}>{eventDescription}</Text>

        <TouchableOpacity activeOpacity={0.86} style={[styles.weatherCard, isDay && styles.dayCard]}>
          <View>
            <Text style={[styles.weatherTitle, isDay && styles.dayHeadingText]}>{copy.weatherTitle}</Text>
            <Text style={[styles.weatherCopy, isDay && styles.dayMutedText]}>{isMovieNight ? copy.weatherCopy : eventWeatherCopy}</Text>
          </View>
          <Text style={styles.weatherIcon}>☁️</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, isDay && styles.dayHeadingText]}>{copy.whatToExpect}</Text>
        <View style={styles.expectGrid}>
          <View style={[styles.expectCard, isDay && styles.dayCard]}>
            <Text style={styles.expectIcon}>◇</Text>
            <Text style={[styles.expectTitle, isDay && styles.dayHeadingText]}>{copy.lowPressure}</Text>
            <Text style={[styles.expectCopy, isDay && styles.dayMutedText]}>{copy.lowPressureCopy}</Text>
          </View>
          <View style={[styles.expectCard, isDay && styles.dayCard]}>
            <Text style={styles.expectIcon}>◌</Text>
            <Text style={[styles.expectTitle, isDay && styles.dayHeadingText]}>{copy.sharedExperience}</Text>
            <Text style={[styles.expectCopy, isDay && styles.dayMutedText]}>{copy.sharedExperienceCopy}</Text>
          </View>
          <View style={[styles.expectCard, isDay && styles.dayCard]}>
            <Text style={styles.expectIcon}>↺</Text>
            <Text style={[styles.expectTitle, isDay && styles.dayHeadingText]}>{copy.flexible}</Text>
            <Text style={[styles.expectCopy, isDay && styles.dayMutedText]}>{copy.flexibleCopy}</Text>
          </View>
        </View>

        <View style={[styles.meetingPanel, isDay && styles.dayMeetingPanel]}>
          <Text style={[styles.sectionTitle, isDay && styles.dayHeadingText]}>{copy.meetingPoint}</Text>
          <Text style={[styles.meetingCopy, isDay && styles.dayMutedText]}>{eventMeetingCopy}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push({ pathname: "/(tabs)/chats" })}
          style={styles.joinButton}
        >
          <Text style={styles.joinText}>{copy.join}</Text>
        </TouchableOpacity>
        <Text style={[styles.spotsText, isDay && styles.dayMutedText]}>{copy.spotsLeft}</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayScreen: { backgroundColor: "#EAF4FF" },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  dayHeadingText: { color: "#0B1220" },
  dayIconButton: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6" },
  dayMeetingPanel: { borderColor: "#B8C9E6" },
  dayMutedText: { color: "#3B4A63" },
  dayPanel: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  dayQuietChip: { color: "#3B4A63", backgroundColor: "#EAF4FF" },
  dayText: { color: "#0B1220" },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  topActions: { flexDirection: "row", gap: 8 },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: nsnColors.border },
  heroPanel: { alignItems: "center", borderRadius: 28, paddingTop: 8, paddingBottom: 22, backgroundColor: "#061121", borderWidth: 1, borderColor: "rgba(56,72,255,0.22)", marginBottom: 18 },
  eventAvatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#21123E", borderWidth: 2, borderColor: nsnColors.primary, alignItems: "center", justifyContent: "center", marginTop: -2, marginBottom: 18 },
  avatarEmoji: { fontSize: 43 },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "800", textAlign: "center", letterSpacing: -0.5, lineHeight: 34 },
  tagRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  primaryChip: { color: nsnColors.text, fontSize: 12, fontWeight: "800", backgroundColor: nsnColors.primary, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 14, overflow: "hidden" },
  quietChip: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", backgroundColor: "rgba(255,255,255,0.06)", paddingHorizontal: 13, paddingVertical: 7, borderRadius: 14, overflow: "hidden" },
  metaStack: { gap: 7, marginBottom: 12 },
  metaLine: { color: nsnColors.text, fontSize: 14, lineHeight: 20 },
  description: { color: nsnColors.text, fontSize: 15, lineHeight: 23, marginBottom: 14 },
  weatherCard: { minHeight: 78, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 18, paddingHorizontal: 16, paddingVertical: 13, backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: "#284476", marginBottom: 19 },
  weatherTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  weatherCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, maxWidth: 250 },
  weatherIcon: { fontSize: 28 },
  sectionTitle: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 23, marginBottom: 10 },
  expectGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  expectCard: { width: "48%", minHeight: 82, borderRadius: 16, padding: 13, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border },
  expectIcon: { color: "#7FA9FF", fontSize: 18, marginBottom: 4 },
  expectTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "800", lineHeight: 18 },
  expectCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 16, marginTop: 1 },
  meetingPanel: { borderTopWidth: 1, borderColor: nsnColors.border, paddingTop: 14, marginTop: 2, marginBottom: 18 },
  meetingCopy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
  joinButton: { height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: nsnColors.primary },
  joinText: { color: nsnColors.text, fontSize: 16, fontWeight: "800" },
  spotsText: { color: nsnColors.muted, textAlign: "center", marginTop: 10, fontSize: 13, lineHeight: 19 },
});
