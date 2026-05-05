import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { chatSeed, nsnColors } from "@/lib/nsn-data";

type ChatMessage = (typeof chatSeed)[number];

const chatTranslations = {
  English: {
    title: "Movie Night — Watch + Chat",
    members: "4 members",
    today: "Today",
    joined: "You joined the group",
    private: "This chat is only for this meetup.",
    placeholder: "Type a message...",
    disclaimer: "Chat disappears after the meetup.",
  },
  Arabic: {
    title: "ليلة فيلم — مشاهدة + دردشة",
    members: "4 أعضاء",
    today: "اليوم",
    joined: "انضممت إلى المجموعة",
    private: "هذه الدردشة مخصصة لهذا اللقاء فقط.",
    placeholder: "اكتب رسالة...",
    disclaimer: "تختفي الدردشة بعد اللقاء.",
  },
  Chinese: {
    title: "电影之夜 — 观看 + 聊天",
    members: "4 位成员",
    today: "今天",
    joined: "你已加入群组",
    private: "此聊天仅用于这个聚会。",
    placeholder: "输入消息...",
    disclaimer: "聚会结束后聊天会消失。",
  },
  French: {
    title: "Soirée cinéma — Regarder + discuter",
    members: "4 membres",
    today: "Aujourd'hui",
    joined: "Vous avez rejoint le groupe",
    private: "Ce chat est réservé à cette rencontre.",
    placeholder: "Écrire un message...",
    disclaimer: "Le chat disparaît après la rencontre.",
  },
  German: {
    title: "Filmabend — Schauen + Chatten",
    members: "4 Mitglieder",
    today: "Heute",
    joined: "Du bist der Gruppe beigetreten",
    private: "Dieser Chat ist nur für dieses Treffen.",
    placeholder: "Nachricht schreiben...",
    disclaimer: "Der Chat verschwindet nach dem Treffen.",
  },
  Hebrew: {
    title: "ערב סרט — צפייה + צ'אט",
    members: "4 חברים",
    today: "היום",
    joined: "הצטרפת לקבוצה",
    private: "הצ'אט הזה מיועד רק למפגש הזה.",
    placeholder: "הקלד הודעה...",
    disclaimer: "הצ'אט נעלם אחרי המפגש.",
  },
  Japanese: {
    title: "映画ナイト — 観る + 話す",
    members: "4人のメンバー",
    today: "今日",
    joined: "グループに参加しました",
    private: "このチャットはこのミートアップ専用です。",
    placeholder: "メッセージを入力...",
    disclaimer: "チャットはミートアップ後に消えます。",
  },
  Korean: {
    title: "영화의 밤 — 보기 + 채팅",
    members: "멤버 4명",
    today: "오늘",
    joined: "그룹에 참여했습니다",
    private: "이 채팅은 이 모임 전용입니다.",
    placeholder: "메시지 입력...",
    disclaimer: "채팅은 모임 후 사라집니다.",
  },
  Russian: {
    title: "Ночь кино — смотреть + чат",
    members: "4 участника",
    today: "Сегодня",
    joined: "Вы присоединились к группе",
    private: "Этот чат только для этой встречи.",
    placeholder: "Введите сообщение...",
    disclaimer: "Чат исчезнет после встречи.",
  },
  Spanish: {
    title: "Noche de cine — Ver + chatear",
    members: "4 miembros",
    today: "Hoy",
    joined: "Te uniste al grupo",
    private: "Este chat es solo para esta quedada.",
    placeholder: "Escribe un mensaje...",
    disclaimer: "El chat desaparece después de la quedada.",
  },
} as const;

const chatMessageTranslations = {
  Arabic: {
    "1": "مرحباً! سأصل حوالي 6:45م 😊",
    "2": "رائع! متحمسة لذلك 🎬",
    "3": "وأنا أيضاً، لم أشاهد هذا الفيلم بعد!",
    "4": "لا أستطيع الانتظار! أراكم هناك 🙂",
  },
  Chinese: {
    "1": "嘿！我大概 6:45 到 😊",
    "2": "太好了！很期待 🎬",
    "3": "我也是，还没看过这部电影！",
    "4": "等不及了！到时候见 🙂",
  },
  French: {
    "1": "Salut ! J’arriverai vers 18h45 😊",
    "2": "Super ! J’ai hâte 🎬",
    "3": "Moi aussi, je n’ai pas encore vu ce film !",
    "4": "Trop hâte ! À tout à l’heure 🙂",
  },
  German: {
    "1": "Hey! Ich bin gegen 18:45 da 😊",
    "2": "Super! Ich freue mich darauf 🎬",
    "3": "Ich auch, ich habe den Film noch nicht gesehen!",
    "4": "Kann es kaum erwarten! Bis dann 🙂",
  },
  Hebrew: {
    "1": "היי! אגיע בערך ב-18:45 😊",
    "2": "מעולה! מחכה לזה 🎬",
    "3": "גם אני, עוד לא ראיתי את הסרט הזה!",
    "4": "לא יכול לחכות! נתראה שם 🙂",
  },
  Japanese: {
    "1": "やあ！6:45ごろ着く予定です 😊",
    "2": "いいね！楽しみ 🎬",
    "3": "私も。この映画はまだ観てない！",
    "4": "楽しみ！では現地で 🙂",
  },
  Korean: {
    "1": "안녕! 6시 45분쯤 도착할게 😊",
    "2": "좋아! 기대돼 🎬",
    "3": "나도, 이 영화 아직 못 봤어!",
    "4": "기대된다! 거기서 봐 🙂",
  },
  Russian: {
    "1": "Привет! Я буду примерно в 18:45 😊",
    "2": "Отлично! Жду с нетерпением 🎬",
    "3": "Я тоже, ещё не видел этот фильм!",
    "4": "Не могу дождаться! Увидимся там 🙂",
  },
  Spanish: {
    "1": "¡Hey! Llegaré sobre las 18:45 😊",
    "2": "¡Genial! Tengo ganas 🎬",
    "3": "Yo también, aún no he visto esta película.",
    "4": "¡Qué ganas! Nos vemos allí 🙂",
  },
} as const;

export default function ChatsScreen() {
  const { isNightMode, translationLanguage } = useAppSettings();
  const translationLanguageBase = getLanguageBase(translationLanguage);
  const isDay = !isNightMode;
  const copy = chatTranslations[translationLanguageBase as keyof typeof chatTranslations] ?? chatTranslations.English;
  const translatedMessages = chatMessageTranslations[translationLanguageBase as keyof typeof chatMessageTranslations];
  const [messages, setMessages] = useState<ChatMessage[]>(chatSeed);
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { id: String(Date.now()), name: "You", avatar: "Y", text: trimmed, time: "Now", mine: true },
    ]);
    setDraft("");
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <View style={[styles.screen, isDay && styles.dayContainer]}>
        <View style={[styles.header, isDay && styles.dayHeader]}>
          <View style={styles.eventAvatar}><Text style={styles.eventEmoji}>🍿</Text></View>
          <View style={styles.headerText}>
            <Text style={[styles.title, isDay && styles.dayTitle]}>{copy.title}</Text>
            <Text style={[styles.subtitle, isDay && styles.dayMutedText]}>{copy.members}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.75} style={styles.iconButton}>
            <IconSymbol name="more" color={isDay ? "#0B1220" : nsnColors.text} size={22} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.chat} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.dayPill, isDay && styles.dayPillLight]}><Text style={[styles.dayPillText, isDay && styles.dayMutedText]}>{copy.today}</Text></View>
          <View style={[styles.systemNotice, isDay && styles.dayCard]}>
            <Text style={[styles.systemText, isDay && styles.dayTitle]}>{copy.joined}</Text>
            <Text style={[styles.systemSubtext, isDay && styles.dayMutedText]}>{copy.private}</Text>
          </View>

          {messages.map((message) => (
            <View key={message.id} style={[styles.messageRow, message.mine && styles.messageRowMine]}>
              {!message.mine && <View style={styles.avatar}><Text style={styles.avatarText}>{message.avatar}</Text></View>}
              <View style={[styles.messageBlock, message.mine && styles.messageBlockMine]}>
                {!message.mine && <Text style={[styles.senderName, isDay && styles.dayMutedText]}>{message.name}</Text>}
                <View style={[styles.bubble, message.mine ? styles.myBubble : styles.theirBubble, isDay && !message.mine && styles.dayCard]}>
                  <Text style={[styles.bubbleText, isDay && !message.mine && styles.dayTitle]}>{translatedMessages?.[message.id as keyof typeof translatedMessages] ?? message.text}</Text>
                  <Text style={[styles.messageTime, isDay && !message.mine && styles.dayMessageTime]}>{message.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composerWrap}>
          <TouchableOpacity activeOpacity={0.75} style={[styles.addButton, isDay && styles.dayCard]}>
            <IconSymbol name="add" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
          </TouchableOpacity>
          <View style={[styles.inputWrap, isDay && styles.dayInputWrap]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={copy.placeholder}
              placeholderTextColor={isDay ? "#7890AE" : nsnColors.mutedSoft}
              style={[styles.input, isDay && styles.dayTitle]}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity activeOpacity={0.8} onPress={sendMessage} style={styles.sendButton}>
              <IconSymbol name="paperplane.fill" color={nsnColors.text} size={19} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.disclaimer, isDay && styles.dayMutedText]}>{copy.disclaimer}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background, paddingHorizontal: 18 },
  dayContainer: { backgroundColor: "#EAF4FF" },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 8, paddingBottom: 12, borderBottomWidth: 1, borderColor: nsnColors.border },
  dayHeader: { borderColor: "#B8C9E6" },
  eventAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#26133F", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.primary },
  eventEmoji: { fontSize: 22 },
  headerText: { flex: 1 },
  title: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 21 },
  dayTitle: { color: "#0B1220" },
  subtitle: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  dayMutedText: { color: "#3B4A63" },
  iconButton: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  chat: { flex: 1 },
  chatContent: { paddingTop: 16, paddingBottom: 16 },
  dayPill: { alignSelf: "center", backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 13, paddingVertical: 7, borderRadius: 15, marginBottom: 14 },
  dayPillLight: { backgroundColor: "#DCEEFF" },
  dayPillText: { color: nsnColors.muted, fontSize: 12, fontWeight: "700" },
  systemNotice: { alignSelf: "center", width: "68%", borderRadius: 16, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, paddingVertical: 12, paddingHorizontal: 13, marginBottom: 18 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  systemText: { color: nsnColors.text, textAlign: "center", fontSize: 12, lineHeight: 17 },
  systemSubtext: { color: nsnColors.muted, textAlign: "center", fontSize: 12, lineHeight: 17 },
  messageRow: { flexDirection: "row", gap: 9, marginBottom: 14, alignItems: "flex-end" },
  messageRowMine: { justifyContent: "flex-end" },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#164E6A", alignItems: "center", justifyContent: "center" },
  avatarText: { color: nsnColors.text, fontSize: 13, fontWeight: "800" },
  messageBlock: { maxWidth: "76%" },
  messageBlockMine: { alignItems: "flex-end" },
  senderName: { color: nsnColors.muted, fontSize: 12, marginBottom: 4, lineHeight: 16 },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 8 },
  theirBubble: { backgroundColor: nsnColors.surface, borderTopLeftRadius: 8 },
  myBubble: { backgroundColor: nsnColors.primary, borderBottomRightRadius: 8 },
  bubbleText: { color: nsnColors.text, fontSize: 14, lineHeight: 20 },
  messageTime: { alignSelf: "flex-end", color: "rgba(245,247,255,0.62)", fontSize: 11, marginTop: 4, lineHeight: 14 },
  dayMessageTime: { color: "#7890AE" },
  composerWrap: { paddingBottom: 10 },
  addButton: { position: "absolute", left: 0, bottom: 42, width: 40, height: 40, borderRadius: 20, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.border },
  inputWrap: { marginLeft: 48, minHeight: 44, borderRadius: 22, backgroundColor: "#061121", borderWidth: 1, borderColor: nsnColors.border, flexDirection: "row", alignItems: "center", paddingLeft: 15, paddingRight: 5 },
  dayInputWrap: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  input: { flex: 1, color: nsnColors.text, fontSize: 14, minHeight: 42 },
  sendButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center" },
  disclaimer: { color: nsnColors.muted, fontSize: 11, textAlign: "center", marginTop: 8, lineHeight: 15 },
});
