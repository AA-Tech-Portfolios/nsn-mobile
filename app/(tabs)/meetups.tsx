import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { dayEvents, eveningEvents, nsnColors } from "@/lib/nsn-data";
import { canChatPrivately, deriveVerificationLevel, getVerificationLevelLabel } from "@/lib/softhello-mvp";

const upcoming = [eveningEvents[0], dayEvents[0], eveningEvents[1]];

const meetupEventTranslations: Record<string, Record<string, { title: string; people: string }>> = {
  Arabic: {
    "movie-night-watch-chat": { title: "ليلة فيلم — مشاهدة + دردشة", people: "2–4 أشخاص" },
    "picnic-easy-hangout": { title: "نزهة — لقاء سهل", people: "2–4 أشخاص" },
    "board-games-coffee": { title: "ألعاب لوحية + قهوة", people: "3–5 أشخاص" },
  },
  Chinese: {
    "movie-night-watch-chat": { title: "电影之夜 — 观看 + 聊天", people: "2–4 人" },
    "picnic-easy-hangout": { title: "野餐 — 轻松相处", people: "2–4 人" },
    "board-games-coffee": { title: "桌游 + 咖啡", people: "3–5 人" },
  },
  French: {
    "movie-night-watch-chat": { title: "Soirée cinéma — Regarder + discuter", people: "2–4 personnes" },
    "picnic-easy-hangout": { title: "Pique-nique — Moment simple", people: "2–4 personnes" },
    "board-games-coffee": { title: "Jeux de société + café", people: "3–5 personnes" },
  },
  German: {
    "movie-night-watch-chat": { title: "Filmabend — Schauen + Chatten", people: "2–4 Personen" },
    "picnic-easy-hangout": { title: "Picknick — Lockeres Treffen", people: "2–4 Personen" },
    "board-games-coffee": { title: "Brettspiele + Kaffee", people: "3–5 Personen" },
  },
  Hebrew: {
    "movie-night-watch-chat": { title: "ערב סרט — צפייה + צ'אט", people: "2–4 אנשים" },
    "picnic-easy-hangout": { title: "פיקניק — מפגש קליל", people: "2–4 אנשים" },
    "board-games-coffee": { title: "משחקי קופסה + קפה", people: "3–5 אנשים" },
  },
  Japanese: {
    "movie-night-watch-chat": { title: "映画ナイト — 観る + 話す", people: "2–4人" },
    "picnic-easy-hangout": { title: "ピクニック — 気軽な集まり", people: "2–4人" },
    "board-games-coffee": { title: "ボードゲーム + コーヒー", people: "3–5人" },
  },
  Korean: {
    "movie-night-watch-chat": { title: "영화의 밤 — 보기 + 채팅", people: "2–4명" },
    "picnic-easy-hangout": { title: "피크닉 — 편한 만남", people: "2–4명" },
    "board-games-coffee": { title: "보드게임 + 커피", people: "3–5명" },
  },
  Russian: {
    "movie-night-watch-chat": { title: "Ночь кино — смотреть + чат", people: "2–4 человека" },
    "picnic-easy-hangout": { title: "Пикник — лёгкая встреча", people: "2–4 человека" },
    "board-games-coffee": { title: "Настольные игры + кофе", people: "3–5 человек" },
  },
  Spanish: {
    "movie-night-watch-chat": { title: "Noche de cine — Ver + chatear", people: "2–4 personas" },
    "picnic-easy-hangout": { title: "Picnic — Encuentro fácil", people: "2–4 personas" },
    "board-games-coffee": { title: "Juegos de mesa + café", people: "3–5 personas" },
  },
};

const meetupsTranslations = {
  English: {
    title: "My Meetups",
    subtitle: "Small plans that feel easy to join.",
    next: "Next meetup",
    summaryTitle: "Movie Night — Watch + Chat",
    summaryCopy: "Tonight at 7:00pm · Macquarie Centre Event Cinemas",
    details: "View details",
    upcoming: "Upcoming",
    joined: "Joined",
    suggested: "Suggested",
    trustRequiredTitle: "Contact Verified required",
    trustRequiredCopy: "Meetups and private chats open once both people have verified contact details.",
    reviewSettings: "Review Trust status",
  },
  Arabic: {
    title: "لقاءاتي",
    subtitle: "خطط صغيرة يسهل الانضمام إليها.",
    next: "اللقاء التالي",
    summaryTitle: "ليلة فيلم — مشاهدة + دردشة",
    summaryCopy: "الليلة 7:00م · سينما إيفنت في ماكواري سنتر",
    details: "عرض التفاصيل",
    upcoming: "القادم",
    joined: "منضم",
    suggested: "مقترح",
  },
  Chinese: {
    title: "我的聚会",
    subtitle: "轻松加入的小计划。",
    next: "下一个聚会",
    summaryTitle: "电影之夜 — 观看 + 聊天",
    summaryCopy: "今晚 7:00 · Macquarie Centre Event Cinemas",
    details: "查看详情",
    upcoming: "即将开始",
    joined: "已加入",
    suggested: "推荐",
  },
  French: {
    title: "Mes rencontres",
    subtitle: "De petits plans faciles à rejoindre.",
    next: "Prochaine rencontre",
    summaryTitle: "Soirée cinéma — Regarder + discuter",
    summaryCopy: "Ce soir à 19h00 · Macquarie Centre Event Cinemas",
    details: "Voir les détails",
    upcoming: "À venir",
    joined: "Rejoint",
    suggested: "Suggéré",
  },
  German: {
    title: "Meine Treffen",
    subtitle: "Kleine Pläne, denen man leicht beitreten kann.",
    next: "Nächstes Treffen",
    summaryTitle: "Filmabend — Schauen + Chatten",
    summaryCopy: "Heute um 19:00 · Macquarie Centre Event Cinemas",
    details: "Details ansehen",
    upcoming: "Demnächst",
    joined: "Beigetreten",
    suggested: "Vorgeschlagen",
  },
  Hebrew: {
    title: "המפגשים שלי",
    subtitle: "תוכניות קטנות שקל להצטרף אליהן.",
    next: "המפגש הבא",
    summaryTitle: "ערב סרט — צפייה + צ'אט",
    summaryCopy: "הערב ב-19:00 · Macquarie Centre Event Cinemas",
    details: "הצג פרטים",
    upcoming: "בקרוב",
    joined: "הצטרפת",
    suggested: "מוצע",
    trustRequiredTitle: "נדרש אימות קשר",
    trustRequiredCopy: "מפגשים וצ'אטים פרטיים נפתחים כששני האנשים אימתו פרטי קשר.",
    reviewSettings: "סקירת סטטוס אמון",
  },
  Japanese: {
    title: "マイミートアップ",
    subtitle: "気軽に参加できる小さな予定。",
    next: "次のミートアップ",
    summaryTitle: "映画ナイト — 観る + 話す",
    summaryCopy: "今夜 7:00 · Macquarie Centre Event Cinemas",
    details: "詳細を見る",
    upcoming: "予定",
    joined: "参加済み",
    suggested: "おすすめ",
  },
  Korean: {
    title: "내 모임",
    subtitle: "부담 없이 참여하기 쉬운 작은 계획.",
    next: "다음 모임",
    summaryTitle: "영화의 밤 — 보기 + 채팅",
    summaryCopy: "오늘 밤 7:00 · Macquarie Centre Event Cinemas",
    details: "자세히 보기",
    upcoming: "예정",
    joined: "참여함",
    suggested: "추천",
  },
  Russian: {
    title: "Мои встречи",
    subtitle: "Небольшие планы, к которым легко присоединиться.",
    next: "Следующая встреча",
    summaryTitle: "Ночь кино — смотреть + чат",
    summaryCopy: "Сегодня в 19:00 · Macquarie Centre Event Cinemas",
    details: "Подробнее",
    upcoming: "Скоро",
    joined: "Участвуете",
    suggested: "Рекомендовано",
  },
  Spanish: {
    title: "Mis quedadas",
    subtitle: "Planes pequeños a los que es fácil unirse.",
    next: "Próxima quedada",
    summaryTitle: "Noche de cine — Ver + chatear",
    summaryCopy: "Hoy a las 19:00 · Macquarie Centre Event Cinemas",
    details: "Ver detalles",
    upcoming: "Próximas",
    joined: "Unido",
    suggested: "Sugerido",
  },
} as const;

const meetupsTrustGateTranslations = {
  English: {
    trustRequiredTitle: "Contact Verified required",
    trustRequiredCopy: "Meetups and private chats open once both people have verified contact details.",
    reviewSettings: "Review Trust status",
  },
  Hebrew: {
    trustRequiredTitle: "נדרש אימות קשר",
    trustRequiredCopy: "מפגשים וצ'אטים פרטיים נפתחים כששני האנשים אימתו פרטי קשר.",
    reviewSettings: "סקירת סטטוס אמון",
  },
} as const;

export default function MeetupsScreen() {
  const router = useRouter();
  const { contactEmail, contactPhone, hasIdentityDocument, identitySelfieUri, isNightMode, translationLanguage } = useAppSettings();
  const translationLanguageBase = getLanguageBase(translationLanguage);
  const isDay = !isNightMode;
  const copy = meetupsTranslations[translationLanguageBase as keyof typeof meetupsTranslations] ?? meetupsTranslations.English;
  const trustGateCopy = meetupsTrustGateTranslations[translationLanguageBase as keyof typeof meetupsTrustGateTranslations] ?? meetupsTrustGateTranslations.English;
  const effectiveVerificationLevel = deriveVerificationLevel({ contactEmail, contactPhone, identitySelfieUri, hasIdentityDocument });
  const canUseMeetups = canChatPrivately(effectiveVerificationLevel);

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
        <Text style={[styles.subtitle, isDay && styles.dayMutedText]}>{copy.subtitle}</Text>

        {!canUseMeetups ? (
          <View style={[styles.trustGateCard, isDay && styles.dayCard]}>
            <Text style={[styles.gateTitle, isDay && styles.dayTitle]}>{trustGateCopy.trustRequiredTitle}</Text>
            <Text style={[styles.gateCopy, isDay && styles.dayMutedText]}>{trustGateCopy.trustRequiredCopy}</Text>
            <Text style={[styles.gateStatus, isDay && styles.dayAccentText]}>{getVerificationLevelLabel(effectiveVerificationLevel, translationLanguageBase)}</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push("/(tabs)/profile")} style={styles.summaryButton}>
              <Text style={styles.summaryButtonText}>{trustGateCopy.reviewSettings}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {canUseMeetups ? <View style={[styles.summaryCard, isDay && styles.dayCard]}>
          <Text style={[styles.summaryLabel, isDay && styles.dayAccentText]}>{copy.next}</Text>
          <Text style={[styles.summaryTitle, isDay && styles.dayTitle]}>{copy.summaryTitle}</Text>
          <Text style={[styles.summaryCopy, isDay && styles.dayMutedText]}>{copy.summaryCopy}</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push("/event/movie-night-watch-chat")} style={styles.summaryButton}>
            <Text style={styles.summaryButtonText}>{copy.details}</Text>
          </TouchableOpacity>
        </View> : null}

        {canUseMeetups ? <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>{copy.upcoming}</Text> : null}
        {canUseMeetups ? <View style={styles.list}>
          {upcoming.map((event, index) => {
            const localizedEvent = meetupEventTranslations[translationLanguageBase]?.[event.id] ?? event;

            return (
            <TouchableOpacity key={event.id} activeOpacity={0.85} style={[styles.meetupCard, isDay && styles.dayCard]} onPress={() => router.push(`/event/${event.id}`)}>
              <View style={[styles.emojiBox, { backgroundColor: event.imageTone }]}><Text style={styles.emoji}>{event.emoji}</Text></View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{localizedEvent.title}</Text>
                <Text style={[styles.cardMeta, isDay && styles.dayMutedText]}>{event.venue} · {event.time}</Text>
                <Text style={[styles.cardCopy, isDay && styles.daySuccessText]}>{localizedEvent.people} · {index === 0 ? copy.joined : copy.suggested}</Text>
              </View>
              <Text style={[styles.chevron, isDay && styles.dayMutedText]}>›</Text>
            </TouchableOpacity>
            );
          })}
        </View> : null}
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
  summaryCard: { borderRadius: 24, backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: "#2B4578", padding: 18, marginBottom: 22 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  summaryLabel: { color: nsnColors.day, fontSize: 12, fontWeight: "800", lineHeight: 17, marginBottom: 8 },
  dayAccentText: { color: "#3949DB" },
  summaryTitle: { color: nsnColors.text, fontSize: 21, fontWeight: "800", lineHeight: 27 },
  summaryCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 20, marginTop: 6, marginBottom: 14 },
  summaryButton: { alignSelf: "flex-start", backgroundColor: nsnColors.primary, borderRadius: 15, paddingHorizontal: 16, paddingVertical: 9 },
  summaryButtonText: { color: nsnColors.text, fontWeight: "800", fontSize: 13 },
  trustGateCard: { borderRadius: 22, backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: "#2B4578", padding: 18, marginBottom: 22 },
  gateTitle: { color: nsnColors.text, fontSize: 17, fontWeight: "900", lineHeight: 23 },
  gateCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 20, marginTop: 6, marginBottom: 10 },
  gateStatus: { color: nsnColors.day, fontSize: 12, fontWeight: "900", lineHeight: 17, marginBottom: 12 },
  sectionTitle: { color: nsnColors.text, fontSize: 17, fontWeight: "800", lineHeight: 24, marginBottom: 10 },
  list: { gap: 10 },
  meetupCard: { minHeight: 88, borderRadius: 18, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, flexDirection: "row", alignItems: "center", padding: 10 },
  emojiBox: { width: 64, height: 64, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 29 },
  cardBody: { flex: 1, paddingHorizontal: 11 },
  cardTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 19 },
  cardMeta: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  cardCopy: { color: nsnColors.green, fontSize: 11, lineHeight: 16, marginTop: 3, fontWeight: "700" },
  daySuccessText: { color: "#2F7A3C" },
  chevron: { color: nsnColors.muted, fontSize: 30, lineHeight: 34 },
});
