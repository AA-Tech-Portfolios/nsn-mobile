import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { nsnColors } from "@/lib/nsn-data";

const alerts = [
  { icon: "🌧", title: "Rain expected later", copy: "Picnic plans may need an indoor fallback. We’ll suggest options nearby.", tone: "Weather" },
  { icon: "🍿", title: "Movie Night starts at 7:00pm", copy: "Meet at the Event Cinemas ticket counter around 6:50pm.", tone: "Meetup" },
  { icon: "🌙", title: "Quiet evening events available", copy: "Low-noise indoor meetups are open around Chatswood and Macquarie Park.", tone: "Night" },
];

const notificationTranslations = {
  English: {
    title: "Notifications",
    subtitle: "Weather-aware prompts and gentle meetup reminders.",
    flow: ["Picnic at St. Leonards Park", "Rain expected", "Switch to bowling night"],
    alerts,
  },
  Arabic: {
    title: "الإشعارات",
    subtitle: "تنبيهات تراعي الطقس وتذكيرات لقاء لطيفة.",
    flow: ["نزهة في St. Leonards Park", "مطر متوقع", "التحويل إلى ليلة بولينغ"],
    alerts: [
      { icon: "🌧", title: "مطر متوقع لاحقاً", copy: "قد تحتاج خطط النزهة إلى بديل داخلي. سنقترح خيارات قريبة.", tone: "الطقس" },
      { icon: "🍿", title: "ليلة الفيلم تبدأ 7:00م", copy: "قابل المجموعة عند شباك Event Cinemas حوالي 6:50م.", tone: "لقاء" },
      { icon: "🌙", title: "فعاليات هادئة متاحة مساءً", copy: "لقاءات داخلية منخفضة الضوضاء مفتوحة حول Chatswood و Macquarie Park.", tone: "مساء" },
    ],
  },
  Hebrew: {
    title: "התראות",
    subtitle: "תזכורות עדינות למפגשים ועדכונים לפי מזג האוויר.",
    flow: ["פיקניק ב-St. Leonards Park", "צפוי גשם", "מעבר לערב באולינג"],
    alerts: [
      { icon: "🌧", title: "גשם צפוי בהמשך", copy: "ייתכן שתוכניות הפיקניק יצטרכו חלופה מקורה. נציע אפשרויות קרובות.", tone: "מזג אוויר" },
      { icon: "🍿", title: "ערב הסרט מתחיל ב-19:00", copy: "נפגשים ליד דלפק Event Cinemas בערך ב-18:50.", tone: "מפגש" },
      { icon: "🌙", title: "אירועי ערב שקטים זמינים", copy: "מפגשים מקורים ושקטים פתוחים סביב Chatswood ו-Macquarie Park.", tone: "ערב" },
    ],
  },
  Russian: {
    title: "Оповещения",
    subtitle: "Подсказки с учётом погоды и мягкие напоминания о встречах.",
    flow: ["Пикник в St. Leonards Park", "Ожидается дождь", "Перейти на вечер боулинга"],
    alerts: [
      { icon: "🌧", title: "Позже ожидается дождь", copy: "Для пикника может понадобиться вариант в помещении. Мы предложим места рядом.", tone: "Погода" },
      { icon: "🍿", title: "Ночь кино начинается в 19:00", copy: "Встречайтесь у стойки Event Cinemas примерно в 18:50.", tone: "Встреча" },
      { icon: "🌙", title: "Доступны тихие вечерние события", copy: "Спокойные встречи в помещении открыты рядом с Chatswood и Macquarie Park.", tone: "Вечер" },
    ],
  },
  Spanish: {
    title: "Alertas",
    subtitle: "Avisos según el clima y recordatorios suaves de quedadas.",
    flow: ["Picnic en St. Leonards Park", "Lluvia esperada", "Cambiar a noche de bolos"],
    alerts: [
      { icon: "🌧", title: "Se espera lluvia más tarde", copy: "El picnic quizá necesite una alternativa interior. Sugeriremos opciones cerca.", tone: "Clima" },
      { icon: "🍿", title: "Noche de cine empieza a las 19:00", copy: "Quedad en el mostrador de Event Cinemas sobre las 18:50.", tone: "Quedada" },
      { icon: "🌙", title: "Eventos tranquilos disponibles", copy: "Hay quedadas interiores de bajo ruido cerca de Chatswood y Macquarie Park.", tone: "Noche" },
    ],
  },
} as const;

export default function NotificationsScreen() {
  const { isNightMode, appLanguage } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const isDay = !isNightMode;
  const copy = notificationTranslations[appLanguageBase as keyof typeof notificationTranslations] ?? notificationTranslations.English;

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
        <Text style={[styles.subtitle, isDay && styles.dayMutedText]}>{copy.subtitle}</Text>

        <View style={[styles.weatherFlow, isDay && styles.dayWeatherFlow]}>
          <View style={[styles.flowStep, isDay && styles.dayCard]}><Text style={styles.flowIcon}>🧺</Text><Text style={[styles.flowText, isDay && styles.dayTitle]}>{copy.flow[0]}</Text></View>
          <Text style={[styles.flowArrow, isDay && styles.dayMutedText]}>›</Text>
          <View style={[styles.flowStep, isDay && styles.dayCard]}><Text style={styles.flowIcon}>🌧</Text><Text style={[styles.flowText, isDay && styles.dayTitle]}>{copy.flow[1]}</Text></View>
          <Text style={[styles.flowArrow, isDay && styles.dayMutedText]}>›</Text>
          <View style={[styles.flowStep, isDay && styles.dayCard]}><Text style={styles.flowIcon}>🎳</Text><Text style={[styles.flowText, isDay && styles.dayTitle]}>{copy.flow[2]}</Text></View>
        </View>

        <View style={styles.list}>
          {copy.alerts.map((alert) => (
            <TouchableOpacity key={alert.title} activeOpacity={0.85} style={[styles.alertCard, isDay && styles.dayCard]}>
              <View style={[styles.alertIcon, isDay && styles.dayIconBubble]}><Text style={styles.alertEmoji}>{alert.icon}</Text></View>
              <View style={styles.alertBody}>
                <View style={styles.alertTopLine}>
                  <Text style={[styles.alertTitle, isDay && styles.dayTitle]}>{alert.title}</Text>
                  <Text style={[styles.alertTone, isDay && styles.dayAccentText]}>{alert.tone}</Text>
                </View>
                <Text style={[styles.alertCopy, isDay && styles.dayMutedText]}>{alert.copy}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayContainer: { backgroundColor: "#EAF4FF" },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28 },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "800", lineHeight: 35 },
  dayTitle: { color: "#0B1220" },
  subtitle: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginBottom: 18 },
  dayMutedText: { color: "#3B4A63" },
  weatherFlow: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#061121", padding: 12, marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 7 },
  dayWeatherFlow: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  flowStep: { flex: 1, minHeight: 80, borderRadius: 16, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", padding: 8 },
  flowIcon: { fontSize: 24, marginBottom: 5 },
  flowText: { color: nsnColors.text, fontSize: 11, lineHeight: 15, textAlign: "center", fontWeight: "700" },
  flowArrow: { color: nsnColors.muted, fontSize: 24 },
  list: { gap: 10 },
  alertCard: { flexDirection: "row", gap: 12, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 13 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  alertIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: nsnColors.surfaceRaised, alignItems: "center", justifyContent: "center" },
  dayIconBubble: { backgroundColor: "#EAF4FF" },
  alertEmoji: { fontSize: 23 },
  alertBody: { flex: 1 },
  alertTopLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  alertTitle: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  alertTone: { color: nsnColors.day, fontSize: 11, fontWeight: "800", lineHeight: 15 },
  dayAccentText: { color: "#3949DB" },
  alertCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 4 },
});
