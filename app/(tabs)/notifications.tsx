import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { getLanguageBase, type LiveWeatherAlert, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { nsnColors } from "@/lib/nsn-data";

type NotificationAlert = {
  icon: string;
  title: string;
  copy: string;
  tone: string;
  isLive?: boolean;
  action?: LiveWeatherAlert["action"] | "event" | "events";
};

const alerts: NotificationAlert[] = [
  { icon: "🌧", title: "Rain expected later", copy: "Picnic plans may need an indoor fallback. We’ll suggest options nearby.", tone: "Weather", action: "home" },
  { icon: "🍿", title: "Movie Night starts at 7:00pm", copy: "Meet at the Event Cinemas ticket counter around 6:50pm.", tone: "Meetup", action: "event" },
  { icon: "🌙", title: "Quiet evening events available", copy: "Low-noise indoor meetups are open around Chatswood and Macquarie Park.", tone: "Night", action: "events" },
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
  Chinese: {
    title: "通知",
    subtitle: "根据天气变化提供温和的聚会提醒。",
    flow: ["St. Leonards Park 野餐", "预计有雨", "改为保龄球之夜"],
    alerts: [
      { icon: "🌧", title: "稍后预计有雨", copy: "野餐计划可能需要室内备用方案。我们会建议附近选项。", tone: "天气" },
      { icon: "🍿", title: "电影之夜 7:00pm 开始", copy: "请在 6:50pm 左右到 Event Cinemas 售票处集合。", tone: "聚会" },
      { icon: "🌙", title: "安静的夜间活动可参加", copy: "Chatswood 和 Macquarie Park 附近有低噪音室内聚会。", tone: "夜晚" },
    ],
  },
  French: {
    title: "Notifications",
    subtitle: "Invitations météo et rappels de rencontre doux.",
    flow: ["Pique-nique à St. Leonards Park", "Pluie attendue", "Passer à une soirée bowling"],
    alerts: [
      { icon: "🌧", title: "Pluie attendue plus tard", copy: "Le pique-nique peut nécessiter une alternative intérieure. Nous suggérerons des options proches.", tone: "Météo" },
      { icon: "🍿", title: "La soirée cinéma commence à 19h00", copy: "Rendez-vous au comptoir Event Cinemas vers 18h50.", tone: "Rencontre" },
      { icon: "🌙", title: "Événements calmes disponibles ce soir", copy: "Des rencontres intérieures peu bruyantes sont ouvertes autour de Chatswood et Macquarie Park.", tone: "Soir" },
    ],
  },
  German: {
    title: "Hinweise",
    subtitle: "Wetterbewusste Hinweise und sanfte Treffen-Erinnerungen.",
    flow: ["Picknick im St. Leonards Park", "Regen erwartet", "Zu Bowlingabend wechseln"],
    alerts: [
      { icon: "🌧", title: "Später wird Regen erwartet", copy: "Picknick-Pläne brauchen vielleicht eine Alternative drinnen. Wir schlagen Optionen in der Nähe vor.", tone: "Wetter" },
      { icon: "🍿", title: "Filmabend beginnt um 19:00", copy: "Trefft euch gegen 18:50 am Event Cinemas-Schalter.", tone: "Treffen" },
      { icon: "🌙", title: "Ruhige Abend-Events verfügbar", copy: "Leise Indoor-Treffen sind rund um Chatswood und Macquarie Park offen.", tone: "Abend" },
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
  Japanese: {
    title: "通知",
    subtitle: "天気に合わせた案内と、やさしいミートアップのリマインダー。",
    flow: ["St. Leonards Park でピクニック", "雨の予報", "ボウリングナイトに変更"],
    alerts: [
      { icon: "🌧", title: "このあと雨の予報", copy: "ピクニックには屋内の代替案が必要かもしれません。近くの選択肢を提案します。", tone: "天気" },
      { icon: "🍿", title: "映画ナイトは19:00開始", copy: "18:50ごろ Event Cinemas のチケットカウンターで集合します。", tone: "ミートアップ" },
      { icon: "🌙", title: "静かな夜イベントがあります", copy: "Chatswood と Macquarie Park 周辺で、低音量の屋内ミートアップが開いています。", tone: "夜" },
    ],
  },
  Korean: {
    title: "알림",
    subtitle: "날씨를 고려한 안내와 부드러운 모임 알림.",
    flow: ["St. Leonards Park 피크닉", "비 예상", "볼링 나이트로 변경"],
    alerts: [
      { icon: "🌧", title: "이후 비가 예상돼요", copy: "피크닉 계획에 실내 대안이 필요할 수 있어요. 가까운 옵션을 제안할게요.", tone: "날씨" },
      { icon: "🍿", title: "영화의 밤은 7:00pm 시작", copy: "6:50pm쯤 Event Cinemas 매표소에서 만나요.", tone: "모임" },
      { icon: "🌙", title: "조용한 저녁 이벤트 가능", copy: "Chatswood와 Macquarie Park 주변에 조용한 실내 모임이 열려 있어요.", tone: "밤" },
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
  const router = useRouter();
  const { isNightMode, appLanguage, liveWeatherAlert, showAlertsSettingsShortcut } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const isDay = !isNightMode;
  const copy = notificationTranslations[appLanguageBase as keyof typeof notificationTranslations] ?? notificationTranslations.English;

  const displayAlerts: NotificationAlert[] = liveWeatherAlert ? [{ ...liveWeatherAlert, isLive: true }, ...copy.alerts] : [...copy.alerts];
  const openNotificationSettings = () => {
    router.push({ pathname: "/(tabs)/settings", params: { section: "notifications", from: "notifications" } } as never);
  };
  const openAlert = (alert: NotificationAlert) => {
    if (alert.action === "settings") {
      openNotificationSettings();
      return;
    }

    if (alert.action === "event") {
      router.push("/event/movie-night-watch-chat");
      return;
    }

    if (alert.action === "events") {
      router.push("/(tabs)/events");
      return;
    }

    router.push("/(tabs)");
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
            <Text style={[styles.subtitle, isDay && styles.dayMutedText]}>{copy.subtitle}</Text>
          </View>
          {showAlertsSettingsShortcut ? (
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={openNotificationSettings}
              style={[styles.settingsShortcut, isDay && styles.daySettingsShortcut]}
              accessibilityRole="button"
              accessibilityLabel="Open notification settings"
            >
              <IconSymbol name="settings" size={18} color={isDay ? "#445E93" : nsnColors.day} />
              <Text style={[styles.settingsShortcutText, isDay && styles.dayAccentText]}>Settings</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={[styles.alphaGuideCard, isDay && styles.dayCard]}>
          <Text style={[styles.alphaGuideLabel, isDay && styles.dayAccentText]}>Alpha testing</Text>
          <Text style={[styles.alphaGuideTitle, isDay && styles.dayTitle]}>Demo alerts only</Text>
          <Text style={[styles.alphaGuideCopy, isDay && styles.dayMutedText]}>
            These cards show the tone of future weather-aware reminders and meetup prompts. No real push notification is sent from this prototype.
          </Text>
        </View>

        <View style={[styles.weatherFlow, isDay && styles.dayWeatherFlow]}>
          <View style={[styles.flowStep, isDay && styles.dayCard]}><Text style={styles.flowIcon}>🧺</Text><Text style={[styles.flowText, isDay && styles.dayTitle]}>{copy.flow[0]}</Text></View>
          <Text style={[styles.flowArrow, isDay && styles.dayMutedText]}>›</Text>
          <View style={[styles.flowStep, isDay && styles.dayCard]}><Text style={styles.flowIcon}>🌧</Text><Text style={[styles.flowText, isDay && styles.dayTitle]}>{copy.flow[1]}</Text></View>
          <Text style={[styles.flowArrow, isDay && styles.dayMutedText]}>›</Text>
          <View style={[styles.flowStep, isDay && styles.dayCard]}><Text style={styles.flowIcon}>🎳</Text><Text style={[styles.flowText, isDay && styles.dayTitle]}>{copy.flow[2]}</Text></View>
        </View>

        <View style={styles.list}>
          {displayAlerts.map((alert) => (
            <TouchableOpacity
              key={alert.title}
              activeOpacity={0.85}
              onPress={() => openAlert(alert)}
              accessibilityRole="button"
              accessibilityLabel={`${alert.title}. ${alert.copy}`}
              style={[styles.alertCard, alert.isLive && styles.liveAlertCard, isDay && styles.dayCard, isDay && alert.isLive && styles.dayLiveAlertCard]}
            >
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
  dayContainer: { backgroundColor: "#E8EDF2" },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 112 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 18 },
  headerCopy: { flex: 1 },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "800", lineHeight: 35 },
  dayTitle: { color: "#0B1220" },
  subtitle: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
  dayMutedText: { color: "#53677A" },
  settingsShortcut: { minHeight: 38, borderRadius: 19, borderWidth: 1, borderColor: "#284476", backgroundColor: nsnColors.surface, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 6 },
  daySettingsShortcut: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  settingsShortcutText: { color: nsnColors.day, fontSize: 12, fontWeight: "800", lineHeight: 16 },
  alphaGuideCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", padding: 14, marginBottom: 14 },
  alphaGuideLabel: { color: nsnColors.day, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  alphaGuideTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20, marginTop: 2 },
  alphaGuideCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  weatherFlow: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#061121", padding: 12, marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 7 },
  dayWeatherFlow: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  flowStep: { flex: 1, minHeight: 80, borderRadius: 16, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", padding: 8 },
  flowIcon: { fontSize: 24, marginBottom: 5 },
  flowText: { color: nsnColors.text, fontSize: 11, lineHeight: 15, textAlign: "center", fontWeight: "700" },
  flowArrow: { color: nsnColors.muted, fontSize: 24 },
  list: { gap: 10 },
  alertCard: { flexDirection: "row", gap: 12, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 13 },
  liveAlertCard: { borderColor: nsnColors.day, backgroundColor: "#0B1930" },
  dayCard: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  dayLiveAlertCard: { backgroundColor: "#D7EAFF", borderColor: "#5C7CFA" },
  alertIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: nsnColors.surfaceRaised, alignItems: "center", justifyContent: "center" },
  dayIconBubble: { backgroundColor: "#E8EDF2" },
  alertEmoji: { fontSize: 23 },
  alertBody: { flex: 1 },
  alertTopLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  alertTitle: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  alertTone: { color: nsnColors.day, fontSize: 11, fontWeight: "800", lineHeight: 15 },
  dayAccentText: { color: "#445E93" },
  alertCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 4 },
});
