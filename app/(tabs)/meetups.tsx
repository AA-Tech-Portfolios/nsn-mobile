import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { dayEvents, eveningEvents, nsnColors } from "@/lib/nsn-data";

const upcoming = [eveningEvents[0], dayEvents[0], eveningEvents[1]];

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

export default function MeetupsScreen() {
  const router = useRouter();
  const { isNightMode, translationLanguage } = useAppSettings();
  const isDay = !isNightMode;
  const copy = meetupsTranslations[translationLanguage as keyof typeof meetupsTranslations] ?? meetupsTranslations.English;

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
        <Text style={[styles.subtitle, isDay && styles.dayMutedText]}>{copy.subtitle}</Text>

        <View style={[styles.summaryCard, isDay && styles.dayCard]}>
          <Text style={[styles.summaryLabel, isDay && styles.dayAccentText]}>{copy.next}</Text>
          <Text style={[styles.summaryTitle, isDay && styles.dayTitle]}>{copy.summaryTitle}</Text>
          <Text style={[styles.summaryCopy, isDay && styles.dayMutedText]}>{copy.summaryCopy}</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={() => router.push("/event/movie-night-watch-chat")} style={styles.summaryButton}>
            <Text style={styles.summaryButtonText}>{copy.details}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>{copy.upcoming}</Text>
        <View style={styles.list}>
          {upcoming.map((event, index) => (
            <TouchableOpacity key={event.id} activeOpacity={0.85} style={[styles.meetupCard, isDay && styles.dayCard]} onPress={() => router.push(`/event/${event.id}`)}>
              <View style={[styles.emojiBox, { backgroundColor: event.imageTone }]}><Text style={styles.emoji}>{event.emoji}</Text></View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, isDay && styles.dayTitle]}>{event.title}</Text>
                <Text style={[styles.cardMeta, isDay && styles.dayMutedText]}>{event.venue} · {event.time}</Text>
                <Text style={[styles.cardCopy, isDay && styles.daySuccessText]}>{event.people} · {index === 0 ? copy.joined : copy.suggested}</Text>
              </View>
              <Text style={[styles.chevron, isDay && styles.dayMutedText]}>›</Text>
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
  summaryCard: { borderRadius: 24, backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: "#2B4578", padding: 18, marginBottom: 22 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  summaryLabel: { color: nsnColors.day, fontSize: 12, fontWeight: "800", lineHeight: 17, marginBottom: 8 },
  dayAccentText: { color: "#3949DB" },
  summaryTitle: { color: nsnColors.text, fontSize: 21, fontWeight: "800", lineHeight: 27 },
  summaryCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 20, marginTop: 6, marginBottom: 14 },
  summaryButton: { alignSelf: "flex-start", backgroundColor: nsnColors.primary, borderRadius: 15, paddingHorizontal: 16, paddingVertical: 9 },
  summaryButtonText: { color: nsnColors.text, fontWeight: "800", fontSize: 13 },
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
