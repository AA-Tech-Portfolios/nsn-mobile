import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { chatSeed, nsnColors } from "@/lib/nsn-data";
import { blockUser, createSafetyReport, leaveEvent } from "@/lib/softhello-mvp";

type ChatMessage = (typeof chatSeed)[number];
type SoftExitChoice = "stepBack" | "skipToday";

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const chatTranslations = {
  English: {
    title: "Movie Night — Watch + Chat",
    members: "4 members",
    today: "Today",
    you: "You",
    now: "Now",
    joined: "You joined the group",
    private: "This chat is only for this meetup.",
    placeholder: "Type a message...",
    disclaimer: "Chat disappears after the meetup.",
    softExitTitle: "Soft Exit",
    softExitCopy: "You can step back without making it a big thing. This group not being your group does not mean you are behind.",
    softExitQuiet: "Your chat is quiet for now. You can look for another group when you are ready.",
    safetyTitle: "Safety options",
    safetyCopy: "Use these when something feels off. They stay private in this prototype.",
    reportConcern: "Report concern",
    reportConcernCopy: "Private structured safety note.",
    blockHost: "Block host",
    blockHostCopy: "Stops direct interaction privately.",
    stepBack: "Step back",
    stepBackCopy: "Send a gentle preset message.",
    skipToday: "Skip today",
    skipTodayCopy: "Leave the meetup without pressure.",
    findAnotherGroup: "Find another group",
    findAnotherGroupCopy: "Look for a better fit.",
    reopenOptions: "Reopen chat options",
    softExitPresets: {
      stepBack: "Thanks, I am going to step back for now.",
      skipToday: "I am not able to make it today, but I appreciate the invite.",
    },
  },
  Arabic: {
    title: "ليلة فيلم — مشاهدة + دردشة",
    members: "4 أعضاء",
    today: "اليوم",
    you: "أنت",
    now: "الآن",
    joined: "انضممت إلى المجموعة",
    private: "هذه الدردشة مخصصة لهذا اللقاء فقط.",
    placeholder: "اكتب رسالة...",
    disclaimer: "تختفي الدردشة بعد اللقاء.",
    softExitTitle: "خروج هادئ",
    softExitCopy: "يمكنك التراجع دون أن يكون الأمر كبيراً. كون هذه المجموعة ليست مجموعتك لا يعني أنك متأخر.",
    softExitQuiet: "الدردشة هادئة الآن. يمكنك البحث عن مجموعة أخرى عندما تكون مستعداً.",
    safetyTitle: "خيارات السلامة",
    safetyCopy: "استخدمها عندما تشعر أن هناك شيئاً غير مريح. تبقى خاصة في هذا النموذج.",
    reportConcern: "الإبلاغ عن مشكلة",
    reportConcernCopy: "ملاحظة سلامة خاصة ومنظمة.",
    blockHost: "حظر المضيف",
    blockHostCopy: "يوقف التفاعل المباشر بشكل خاص.",
    stepBack: "تراجع",
    stepBackCopy: "أرسل رسالة جاهزة ولطيفة.",
    skipToday: "تخطى اليوم",
    skipTodayCopy: "غادر اللقاء دون ضغط.",
    findAnotherGroup: "ابحث عن مجموعة أخرى",
    findAnotherGroupCopy: "ابحث عن ما يناسبك أكثر.",
    reopenOptions: "إعادة فتح خيارات الدردشة",
    softExitPresets: {
      stepBack: "شكراً، سأتراجع الآن.",
      skipToday: "لا أستطيع الحضور اليوم، لكنني أقدر الدعوة.",
    },
  },
  Chinese: {
    title: "电影之夜 — 观看 + 聊天",
    members: "4 位成员",
    today: "今天",
    you: "你",
    now: "现在",
    joined: "你已加入群组",
    private: "此聊天仅用于这个聚会。",
    placeholder: "输入消息...",
    disclaimer: "聚会结束后聊天会消失。",
    softExitTitle: "温和退出",
    softExitCopy: "你可以退一步，不需要把事情变得很严重。这个小组不适合你，并不代表你落后了。",
    softExitQuiet: "你的聊天现在已安静下来。准备好时，你可以寻找另一个小组。",
    safetyTitle: "安全选项",
    safetyCopy: "当你觉得不对劲时使用。这些操作在原型中保持私密。",
    reportConcern: "报告问题",
    reportConcernCopy: "私密的结构化安全记录。",
    blockHost: "屏蔽主持人",
    blockHostCopy: "私下停止直接互动。",
    stepBack: "退一步",
    stepBackCopy: "发送一条温和的预设消息。",
    skipToday: "今天先不去",
    skipTodayCopy: "无压力地离开这次聚会。",
    findAnotherGroup: "寻找其他小组",
    findAnotherGroupCopy: "找一个更适合你的选择。",
    reopenOptions: "重新打开聊天选项",
    softExitPresets: {
      stepBack: "谢谢，我现在想先退一步。",
      skipToday: "我今天无法参加，但很感谢邀请。",
    },
  },
  French: {
    title: "Soirée cinéma — Regarder + discuter",
    members: "4 membres",
    today: "Aujourd'hui",
    you: "Vous",
    now: "Maintenant",
    joined: "Vous avez rejoint le groupe",
    private: "Ce chat est réservé à cette rencontre.",
    placeholder: "Écrire un message...",
    disclaimer: "Le chat disparaît après la rencontre.",
    softExitTitle: "Sortie douce",
    softExitCopy: "Vous pouvez prendre du recul sans en faire quelque chose de lourd. Si ce groupe n'est pas le vôtre, cela ne veut pas dire que vous êtes en retard.",
    softExitQuiet: "Votre chat est en pause pour l'instant. Vous pourrez chercher un autre groupe quand vous serez prêt.",
    safetyTitle: "Options de sécurité",
    safetyCopy: "À utiliser si quelque chose vous semble anormal. Elles restent privées dans ce prototype.",
    reportConcern: "Signaler un souci",
    reportConcernCopy: "Note de sécurité privée et structurée.",
    blockHost: "Bloquer l'hôte",
    blockHostCopy: "Arrête les interactions directes en privé.",
    stepBack: "Prendre du recul",
    stepBackCopy: "Envoyer un message prédéfini doux.",
    skipToday: "Passer aujourd'hui",
    skipTodayCopy: "Quitter la rencontre sans pression.",
    findAnotherGroup: "Trouver un autre groupe",
    findAnotherGroupCopy: "Chercher une meilleure affinité.",
    reopenOptions: "Rouvrir les options du chat",
    softExitPresets: {
      stepBack: "Merci, je vais prendre un peu de recul pour l'instant.",
      skipToday: "Je ne peux pas venir aujourd'hui, mais merci pour l'invitation.",
    },
  },
  German: {
    title: "Filmabend — Schauen + Chatten",
    members: "4 Mitglieder",
    today: "Heute",
    you: "Du",
    now: "Jetzt",
    joined: "Du bist der Gruppe beigetreten",
    private: "Dieser Chat ist nur für dieses Treffen.",
    placeholder: "Nachricht schreiben...",
    disclaimer: "Der Chat verschwindet nach dem Treffen.",
    softExitTitle: "Sanfter Ausstieg",
    softExitCopy: "Du kannst dich zurückziehen, ohne daraus etwas Großes zu machen. Wenn diese Gruppe nicht deine Gruppe ist, heißt das nicht, dass du zurückbleibst.",
    softExitQuiet: "Dein Chat ist jetzt ruhiggestellt. Du kannst nach einer anderen Gruppe suchen, wenn du bereit bist.",
    safetyTitle: "Sicherheitsoptionen",
    safetyCopy: "Nutze sie, wenn sich etwas nicht richtig anfühlt. Sie bleiben in diesem Prototyp privat.",
    reportConcern: "Anliegen melden",
    reportConcernCopy: "Private strukturierte Sicherheitsnotiz.",
    blockHost: "Host blockieren",
    blockHostCopy: "Stoppt direkte Interaktion privat.",
    stepBack: "Zurücktreten",
    stepBackCopy: "Eine sanfte Vorlage senden.",
    skipToday: "Heute aussetzen",
    skipTodayCopy: "Das Treffen ohne Druck verlassen.",
    findAnotherGroup: "Andere Gruppe finden",
    findAnotherGroupCopy: "Nach einer besseren Passung suchen.",
    reopenOptions: "Chat-Optionen erneut öffnen",
    softExitPresets: {
      stepBack: "Danke, ich ziehe mich erst einmal zurück.",
      skipToday: "Ich kann heute nicht kommen, aber danke für die Einladung.",
    },
  },
  Hebrew: {
    title: "ערב סרט — צפייה + צ'אט",
    members: "4 חברים",
    today: "היום",
    you: "את/ה",
    now: "עכשיו",
    joined: "הצטרפת לקבוצה",
    private: "הצ'אט הזה מיועד רק למפגש הזה.",
    placeholder: "הקלד הודעה...",
    disclaimer: "הצ'אט נעלם אחרי המפגש.",
    softExitTitle: "יציאה רכה",
    softExitCopy: "אפשר לקחת צעד אחורה בלי להפוך את זה למשהו גדול. אם זו לא הקבוצה שלך, זה לא אומר שנשארת מאחור.",
    softExitQuiet: "הצ'אט שלך שקט כרגע. אפשר לחפש קבוצה אחרת כשתהיה מוכן.",
    safetyTitle: "אפשרויות בטיחות",
    safetyCopy: "השתמש בזה כשמשהו מרגיש לא תקין. זה נשאר פרטי באב הטיפוס.",
    reportConcern: "דיווח על חשש",
    reportConcernCopy: "הערת בטיחות פרטית ומובנית.",
    blockHost: "חסימת המארח",
    blockHostCopy: "עוצר אינטראקציה ישירה באופן פרטי.",
    stepBack: "לקחת צעד אחורה",
    stepBackCopy: "שלח הודעה מוכנה ועדינה.",
    skipToday: "לדלג היום",
    skipTodayCopy: "לעזוב את המפגש בלי לחץ.",
    findAnotherGroup: "למצוא קבוצה אחרת",
    findAnotherGroupCopy: "לחפש התאמה טובה יותר.",
    reopenOptions: "לפתוח מחדש אפשרויות צ'אט",
    softExitPresets: {
      stepBack: "תודה, אני לוקח/ת צעד אחורה כרגע.",
      skipToday: "אני לא יכול/ה להגיע היום, אבל תודה על ההזמנה.",
    },
  },
  Japanese: {
    title: "映画ナイト — 観る + 話す",
    members: "4人のメンバー",
    today: "今日",
    you: "あなた",
    now: "今",
    joined: "グループに参加しました",
    private: "このチャットはこのミートアップ専用です。",
    placeholder: "メッセージを入力...",
    disclaimer: "チャットはミートアップ後に消えます。",
    softExitTitle: "やさしい退出",
    softExitCopy: "大ごとにせず、少し距離を置いて大丈夫です。このグループが合わなくても、あなたが遅れているわけではありません。",
    softExitQuiet: "チャットはいったん静かになりました。準備ができたら、別のグループを探せます。",
    safetyTitle: "安全オプション",
    safetyCopy: "違和感があるときに使えます。このプロトタイプでは非公開です。",
    reportConcern: "懸念を報告",
    reportConcernCopy: "非公開の構造化された安全メモ。",
    blockHost: "ホストをブロック",
    blockHostCopy: "直接のやり取りを非公開で止めます。",
    stepBack: "距離を置く",
    stepBackCopy: "やさしい定型メッセージを送る。",
    skipToday: "今日は見送る",
    skipTodayCopy: "プレッシャーなくミートアップを離れる。",
    findAnotherGroup: "別のグループを探す",
    findAnotherGroupCopy: "もっと合う場所を探す。",
    reopenOptions: "チャットの選択肢を開き直す",
    softExitPresets: {
      stepBack: "ありがとう。今はいったん距離を置きます。",
      skipToday: "今日は参加できませんが、誘ってくれてありがとう。",
    },
  },
  Korean: {
    title: "영화의 밤 — 보기 + 채팅",
    members: "멤버 4명",
    today: "오늘",
    you: "나",
    now: "지금",
    joined: "그룹에 참여했습니다",
    private: "이 채팅은 이 모임 전용입니다.",
    placeholder: "메시지 입력...",
    disclaimer: "채팅은 모임 후 사라집니다.",
    softExitTitle: "부드러운 나가기",
    softExitCopy: "큰일처럼 만들지 않고 물러나도 괜찮아요. 이 그룹이 내 그룹이 아니라고 해서 뒤처진 것은 아니에요.",
    softExitQuiet: "지금은 채팅이 조용해졌어요. 준비되면 다른 그룹을 찾아볼 수 있어요.",
    safetyTitle: "안전 옵션",
    safetyCopy: "뭔가 불편하게 느껴질 때 사용하세요. 이 프로토타입에서는 비공개로 유지돼요.",
    reportConcern: "문제 신고",
    reportConcernCopy: "비공개 구조화 안전 메모.",
    blockHost: "호스트 차단",
    blockHostCopy: "직접 상호작용을 비공개로 중지해요.",
    stepBack: "잠시 물러나기",
    stepBackCopy: "부드러운 기본 메시지를 보내요.",
    skipToday: "오늘은 쉬기",
    skipTodayCopy: "부담 없이 모임에서 나가요.",
    findAnotherGroup: "다른 그룹 찾기",
    findAnotherGroupCopy: "더 잘 맞는 곳을 찾아요.",
    reopenOptions: "채팅 옵션 다시 열기",
    softExitPresets: {
      stepBack: "고마워요. 지금은 잠시 물러날게요.",
      skipToday: "오늘은 참석하기 어렵지만, 초대해줘서 고마워요.",
    },
  },
  Russian: {
    title: "Ночь кино — смотреть + чат",
    members: "4 участника",
    today: "Сегодня",
    you: "Вы",
    now: "Сейчас",
    joined: "Вы присоединились к группе",
    private: "Этот чат только для этой встречи.",
    placeholder: "Введите сообщение...",
    disclaimer: "Чат исчезнет после встречи.",
    softExitTitle: "Мягкий выход",
    softExitCopy: "Вы можете отойти без лишней драмы. Если эта группа не ваша, это не значит, что вы отстаете.",
    softExitQuiet: "Ваш чат пока тихий. Вы можете поискать другую группу, когда будете готовы.",
    safetyTitle: "Параметры безопасности",
    safetyCopy: "Используйте, если что-то кажется неправильным. В этом прототипе они остаются приватными.",
    reportConcern: "Сообщить о проблеме",
    reportConcernCopy: "Приватная структурированная заметка о безопасности.",
    blockHost: "Заблокировать организатора",
    blockHostCopy: "Приватно прекращает прямое взаимодействие.",
    stepBack: "Отойти",
    stepBackCopy: "Отправить мягкое готовое сообщение.",
    skipToday: "Пропустить сегодня",
    skipTodayCopy: "Покинуть встречу без давления.",
    findAnotherGroup: "Найти другую группу",
    findAnotherGroupCopy: "Поискать более подходящий вариант.",
    reopenOptions: "Открыть настройки чата снова",
    softExitPresets: {
      stepBack: "Спасибо, я пока отойду.",
      skipToday: "Я не смогу прийти сегодня, но спасибо за приглашение.",
    },
  },
  Spanish: {
    title: "Noche de cine — Ver + chatear",
    members: "4 miembros",
    today: "Hoy",
    you: "Tú",
    now: "Ahora",
    joined: "Te uniste al grupo",
    private: "Este chat es solo para esta quedada.",
    placeholder: "Escribe un mensaje...",
    disclaimer: "El chat desaparece después de la quedada.",
    softExitTitle: "Salida suave",
    softExitCopy: "Puedes apartarte sin convertirlo en algo grande. Que este grupo no sea tu grupo no significa que te estés quedando atrás.",
    softExitQuiet: "Tu chat queda tranquilo por ahora. Puedes buscar otro grupo cuando estés listo.",
    safetyTitle: "Opciones de seguridad",
    safetyCopy: "Úsalas cuando algo se sienta raro. En este prototipo se mantienen privadas.",
    reportConcern: "Reportar inquietud",
    reportConcernCopy: "Nota de seguridad privada y estructurada.",
    blockHost: "Bloquear anfitrión",
    blockHostCopy: "Detiene la interacción directa en privado.",
    stepBack: "Apartarme",
    stepBackCopy: "Enviar un mensaje suave ya preparado.",
    skipToday: "Saltar hoy",
    skipTodayCopy: "Salir de la quedada sin presión.",
    findAnotherGroup: "Buscar otro grupo",
    findAnotherGroupCopy: "Buscar algo que encaje mejor.",
    reopenOptions: "Reabrir opciones del chat",
    softExitPresets: {
      stepBack: "Gracias, voy a apartarme por ahora.",
      skipToday: "Hoy no puedo ir, pero agradezco la invitación.",
    },
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
  const router = useRouter();
  const {
    isNightMode,
    translationLanguage,
    eventMemberships,
    blockedUserIds,
    safetyReports,
    saveSoftHelloMvpState,
  } = useAppSettings();
  const translationLanguageBase = getLanguageBase(translationLanguage);
  const isDay = !isNightMode;
  const isRtl = rtlLanguages.has(translationLanguageBase);
  const copy = chatTranslations[translationLanguageBase as keyof typeof chatTranslations] ?? chatTranslations.English;
  const translatedMessages = chatMessageTranslations[translationLanguageBase as keyof typeof chatMessageTranslations];
  const [messages, setMessages] = useState<ChatMessage[]>(chatSeed);
  const [draft, setDraft] = useState("");
  const [softExitOpen, setSoftExitOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [softExitChoice, setSoftExitChoice] = useState<SoftExitChoice | null>(null);
  const softExitMessage = softExitChoice ? copy.softExitPresets[softExitChoice] : null;
  const eventId = "movie-night-watch-chat";
  const hostUserId = "maya-host";

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { id: String(Date.now()), name: copy.you, avatar: "Y", text: trimmed, time: copy.now, mine: true },
    ]);
    setDraft("");
  };

  const reportConcern = async () => {
    const report = createSafetyReport(eventId, hostUserId, "Safety concern");
    await saveSoftHelloMvpState({ safetyReports: [...safetyReports, report] });
    Alert.alert("Report saved", "Thanks. This prototype stores the concern privately for moderator review.");
  };

  const blockHost = async () => {
    await saveSoftHelloMvpState({ blockedUserIds: blockUser(hostUserId, blockedUserIds) });
    Alert.alert("Blocked privately", "You will not receive direct interaction from this prototype host.");
  };

  const chooseSoftExit = async (choice: SoftExitChoice) => {
    setSoftExitChoice(choice);

    if (choice === "skipToday") {
      await saveSoftHelloMvpState({ eventMemberships: leaveEvent(eventId, eventMemberships) });
    }
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
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              setSafetyOpen((current) => !current);
              setSoftExitOpen(false);
            }}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={copy.safetyTitle}
          >
            <IconSymbol name="flag" color={isDay ? "#0B1220" : nsnColors.text} size={21} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              setSoftExitOpen((current) => !current);
              setSafetyOpen(false);
            }}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={copy.softExitTitle}
          >
            <IconSymbol name="settings" color={isDay ? "#0B1220" : nsnColors.text} size={21} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.chat} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.dayPill, isDay && styles.dayPillLight]}><Text style={[styles.dayPillText, isDay && styles.dayMutedText]}>{copy.today}</Text></View>
          <View style={[styles.systemNotice, isDay && styles.dayCard]}>
            <Text style={[styles.systemText, isDay && styles.dayTitle]}>{copy.joined}</Text>
            <Text style={[styles.systemSubtext, isDay && styles.dayMutedText]}>{copy.private}</Text>
          </View>

          {safetyOpen && (
            <View style={[styles.softExitPanel, isDay && styles.daySoftExitPanel]}>
              <Text style={[styles.softExitTitle, isDay && styles.dayTitle]}>{copy.safetyTitle}</Text>
              <Text style={[styles.softExitCopy, isDay && styles.dayMutedText]}>{copy.safetyCopy}</Text>
              <View style={styles.softExitActions}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={reportConcern}
                  style={[styles.softExitAction, isDay && styles.daySoftExitAction]}
                >
                  <Text style={[styles.softExitActionText, isDay && styles.dayTitle]}>{copy.reportConcern}</Text>
                  <Text style={[styles.softExitActionCopy, isDay && styles.dayMutedText]}>{copy.reportConcernCopy}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={blockHost}
                  style={[styles.softExitAction, isDay && styles.daySoftExitAction]}
                >
                  <Text style={[styles.softExitActionText, isDay && styles.dayTitle]}>{copy.blockHost}</Text>
                  <Text style={[styles.softExitActionCopy, isDay && styles.dayMutedText]}>{copy.blockHostCopy}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(softExitOpen || softExitChoice) && (
            <View style={[styles.softExitPanel, isDay && styles.daySoftExitPanel]}>
              <Text style={[styles.softExitTitle, isDay && styles.dayTitle]}>{copy.softExitTitle}</Text>
              <Text style={[styles.softExitCopy, isDay && styles.dayMutedText]}>{copy.softExitCopy}</Text>
              {softExitMessage ? (
                <View style={[styles.softExitResult, isDay && styles.daySoftExitResult]}>
                  <Text style={[styles.softExitResultText, isDay && styles.dayTitle]}>{softExitMessage}</Text>
                  <Text style={[styles.softExitResultSubtext, isDay && styles.dayMutedText]}>{copy.softExitQuiet}</Text>
                </View>
              ) : (
                <View style={styles.softExitActions}>
                  <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={() => chooseSoftExit("stepBack")}
                    style={[styles.softExitAction, isDay && styles.daySoftExitAction]}
                  >
                    <Text style={[styles.softExitActionText, isDay && styles.dayTitle]}>{copy.stepBack}</Text>
                    <Text style={[styles.softExitActionCopy, isDay && styles.dayMutedText]}>{copy.stepBackCopy}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={() => chooseSoftExit("skipToday")}
                    style={[styles.softExitAction, isDay && styles.daySoftExitAction]}
                  >
                    <Text style={[styles.softExitActionText, isDay && styles.dayTitle]}>{copy.skipToday}</Text>
                    <Text style={[styles.softExitActionCopy, isDay && styles.dayMutedText]}>{copy.skipTodayCopy}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.82}
                    onPress={() => router.push("/(tabs)/meetups")}
                    style={[styles.softExitAction, isDay && styles.daySoftExitAction]}
                  >
                    <Text style={[styles.softExitActionText, isDay && styles.dayTitle]}>{copy.findAnotherGroup}</Text>
                    <Text style={[styles.softExitActionCopy, isDay && styles.dayMutedText]}>{copy.findAnotherGroupCopy}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

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
          {softExitChoice && (
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => {
                setSoftExitChoice(null);
                setSoftExitOpen(true);
              }}
              style={[styles.resumeButton, isDay && styles.dayCard]}
            >
              <Text style={[styles.resumeButtonText, isDay && styles.dayTitle]}>{copy.reopenOptions}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity activeOpacity={0.75} style={[styles.addButton, isDay && styles.dayCard]}>
            <IconSymbol name="add" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
          </TouchableOpacity>
          <View style={[styles.inputWrap, isDay && styles.dayInputWrap]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={copy.placeholder}
              placeholderTextColor={isDay ? "#7890AE" : nsnColors.mutedSoft}
              style={[styles.input, isDay && styles.dayTitle, isRtl && styles.rtlInput]}
              textAlign={isRtl ? "right" : "left"}
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
  softExitPanel: { borderRadius: 18, backgroundColor: "#0D1B2F", borderWidth: 1, borderColor: "#2B4578", padding: 14, marginBottom: 18 },
  daySoftExitPanel: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6" },
  softExitTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "800", lineHeight: 21, marginBottom: 4 },
  softExitCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19, marginBottom: 12 },
  softExitActions: { gap: 9 },
  softExitAction: { borderRadius: 14, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, paddingHorizontal: 12, paddingVertical: 10 },
  daySoftExitAction: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  softExitActionText: { color: nsnColors.text, fontSize: 13, fontWeight: "800", lineHeight: 18 },
  softExitActionCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 1 },
  softExitResult: { borderRadius: 14, backgroundColor: "rgba(114,214,126,0.11)", borderWidth: 1, borderColor: "rgba(114,214,126,0.28)", padding: 12 },
  daySoftExitResult: { backgroundColor: "#E9F7ED", borderColor: "#A8D9B5" },
  softExitResultText: { color: nsnColors.text, fontSize: 13, fontWeight: "800", lineHeight: 19 },
  softExitResultSubtext: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
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
  resumeButton: { minHeight: 40, borderRadius: 16, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, alignItems: "center", justifyContent: "center", marginBottom: 9 },
  resumeButtonText: { color: nsnColors.text, fontSize: 13, fontWeight: "800" },
  addButton: { position: "absolute", left: 0, bottom: 42, width: 40, height: 40, borderRadius: 20, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.border },
  inputWrap: { marginLeft: 48, minHeight: 44, borderRadius: 22, backgroundColor: "#061121", borderWidth: 1, borderColor: nsnColors.border, flexDirection: "row", alignItems: "center", paddingLeft: 15, paddingRight: 5 },
  dayInputWrap: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  input: { flex: 1, color: nsnColors.text, fontSize: 14, minHeight: 42 },
  rtlInput: { paddingRight: 2, writingDirection: "rtl" },
  sendButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center" },
  disclaimer: { color: nsnColors.muted, fontSize: 11, textAlign: "center", marginTop: 8, lineHeight: 15 },
});
