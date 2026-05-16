import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ChatProfilePreviewSheet } from "@/components/chat-profile-preview-sheet";
import { ProfileAvatar } from "@/components/profile-avatar";
import { getTranslationLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { allEvents, eventChatSeeds, nsnColors, type ChatMessage, type EventItem } from "@/lib/nsn-data";
import { getChatProfilePreview } from "@/lib/chat-profile-preview";
import {
  askAboutMeetupQuestionGroups,
  firstMeetupSupportOptions,
  getFirstMeetupSupportSummary,
  type AskAboutMeetupQuestion,
  type FirstMeetupSupportOption,
} from "@/lib/options-hub";
import {
  blockUser,
  cancelSafetyReport,
  canChatPrivately,
  createSafetyReport,
  deriveVerificationLevel,
  getVerificationLevelLabel,
  leaveEvent,
  unblockUser,
  type SafetyReportReason,
  type SafetyReportRoute,
} from "@/lib/softhello-mvp";
import { getProfilePreferenceCopy } from "@/lib/profile-preference-translations";

type SoftExitChoice = "stepBack" | "skipToday";
type CannotMakeItReason = "unwell" | "work" | "appointment" | "somethingCameUp" | "changedMind";
type SafetyReportReasonOption = {
  reason: SafetyReportReason;
  copy: string;
};
type ReportFlowCopy = {
  targetTitle: string;
  routeTitle: string;
  hostRole: string;
  memberRole: string;
  chatRole: string;
  reportToHost: string;
  reportToHostCopy: string;
  appReview: string;
  appReviewCopy: string;
  cancelWindow: string;
  cancelReport: string;
  reportCancelled: string;
  reportSaved: string;
};
type ArrivalUpdateCopy = {
  title: string;
  runningLate: string;
  cannotMakeIt: string;
  cannotMakeItReasonTitle: string;
  runningLateMessage: (method: string) => string;
  cannotMakeItReasons: Record<CannotMakeItReason, { label: string; message: string }>;
};
type ReportTarget = {
  id: string;
  name: string;
  role: "host" | "member" | "chat";
};
type MemberBlockCopy = {
  blockMember: string;
  blockMemberCopy: string;
  unblockMember: string;
  unblockMemberCopy: string;
  chooseMember: string;
  blockedMemberSaved: string;
  unblockedMemberSaved: string;
  blockedMemberCopy: (name: string) => string;
  unblockedMemberCopy: (name: string) => string;
};
type ChatMenuCopy = {
  title: string;
  current: string;
  openLabel: string;
  landingTitle: string;
  landingCopy: string;
  meetupGroups: string;
  people: string;
  privateChat: string;
  host: string;
  member: string;
};
type ChatTarget =
  | {
      id: string;
      type: "group";
      title: string;
      subtitle: string;
      emoji: string;
      tone: string;
      eventId: string;
    }
  | {
      id: string;
      type: "person";
      title: string;
      subtitle: string;
      emoji: string;
      tone: string;
      personId: string;
    };

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const escalationReportReasons: SafetyReportReasonOption[] = [
  { reason: "Safety threat", copy: "Immediate risk, coercion, stalking, threats, or unsafe meetup behavior." },
  { reason: "Harassment", copy: "Repeated unwanted contact, intimidation, sexual pressure, or abusive messages." },
  { reason: "Underage risk", copy: "Someone may be under 18 or trying to involve a minor." },
  { reason: "Impersonation", copy: "Pretending to be another person, using stolen details, or misleading identity." },
  { reason: "Fraud", copy: "Money requests, scams, phishing, blackmail, or suspicious links." },
];

const otherReportReasons: SafetyReportReasonOption[] = [
  { reason: "Fake profile", copy: "Profile details, photos, or behavior do not seem genuine." },
  { reason: "Spam", copy: "Promotional messages, repetitive outreach, or unrelated links." },
  { reason: "Hate or discrimination", copy: "Abuse targeting identity, culture, religion, disability, gender, or sexuality." },
  { reason: "Privacy concern", copy: "Sharing private information, screenshots, or personal details without consent." },
  { reason: "Other", copy: "Something else feels wrong and should be reviewed." },
];

const reportTargets: ReportTarget[] = [
  { id: "maya-host", name: "Maya", role: "host" },
  { id: "alon-member", name: "Alon", role: "member" },
  { id: "james-member", name: "James", role: "member" },
  { id: "movie-night-watch-chat", name: "Whole chat", role: "chat" },
];

const memberBlockTargets = reportTargets.filter((target) => target.role === "member");
const directChatTargets = [
  { id: "person-maya-host", personId: "maya-host", name: "Maya", role: "host", emoji: "M", tone: "#174667" },
  { id: "person-alon-member", personId: "alon-member", name: "Alon", role: "member", emoji: "A", tone: "#1590C9" },
  { id: "person-james-member", personId: "james-member", name: "James", role: "member", emoji: "J", tone: "#0F5B7C" },
] as const;

const directChatSeedByPerson: Record<string, ChatMessage[]> = {
  "maya-host": [
    { id: "maya-direct-1", personId: "maya-host", name: "Maya", avatar: "M", text: "Hi, happy to help if you have any questions before the meetup.", time: "4:28pm", mine: false },
  ],
  "alon-member": [
    { id: "alon-direct-1", personId: "alon-member", name: "Alon", avatar: "A", text: "Hey, nice to meet you here.", time: "4:30pm", mine: false },
  ],
  "james-member": [
    { id: "james-direct-1", personId: "james-member", name: "James", avatar: "J", text: "Hi, are you going to the movie night too?", time: "4:31pm", mine: false },
  ],
};

const directChatMessageTranslations: Record<string, Record<string, string>> = {
  Chinese: {
    "maya-direct-1": "你好，如果聚会前有任何问题，我很乐意帮忙。",
    "alon-direct-1": "你好，很高兴在这里认识你。",
    "james-direct-1": "你好，你也会去电影夜吗？",
  },
  Japanese: {
    "maya-direct-1": "こんにちは。ミートアップ前に質問があれば、いつでもどうぞ。",
    "alon-direct-1": "こんにちは、ここで会えてうれしいです。",
    "james-direct-1": "こんにちは。映画ナイトにも参加しますか？",
  },
  Korean: {
    "maya-direct-1": "안녕하세요. 모임 전에 궁금한 점이 있으면 도와드릴게요.",
    "alon-direct-1": "안녕하세요, 여기서 만나서 반가워요.",
    "james-direct-1": "안녕하세요, 영화 밤에도 가시나요?",
  },
  Hebrew: {
    "maya-direct-1": "היי, אשמח לעזור אם יש לך שאלות לפני המפגש.",
    "alon-direct-1": "היי, נעים להכיר אותך כאן.",
    "james-direct-1": "היי, גם את/ה מגיע/ה לערב הסרט?",
  },
};

const localizeDirectMessages = (messagesByPerson: Record<string, ChatMessage[]>, languageBase: string) => {
  const translatedDirectMessages = directChatMessageTranslations[languageBase];
  if (!translatedDirectMessages) return messagesByPerson;

  return Object.fromEntries(
    Object.entries(messagesByPerson).map(([personId, messages]) => [
      personId,
      messages.map((message) => ({
        ...message,
        text: translatedDirectMessages[message.id] ?? message.text,
      })),
    ])
  ) as Record<string, ChatMessage[]>;
};

const reportFlowCopy: ReportFlowCopy = {
  targetTitle: "Who is this about?",
  routeTitle: "Where should this go?",
  hostRole: "Host",
  memberRole: "Member",
  chatRole: "Group",
  reportToHost: "Report to host first",
  reportToHostCopy: "Use this when the concern is about another member and the host may be able to step in.",
  appReview: "Submit for app review",
  appReviewCopy: "Use this for host issues, urgent escalation, or when reporting to the host does not help.",
  cancelWindow: "You can cancel this report for 10 minutes.",
  cancelReport: "Cancel report",
  reportCancelled: "Report cancelled",
  reportSaved: "Report saved",
};

const arrivalUpdateCopy: ArrivalUpdateCopy = {
  title: "Arrival updates",
  runningLate: "Running late",
  cannotMakeIt: "Can’t make it",
  cannotMakeItReasonTitle: "Why can’t you make it?",
  runningLateMessage: (method: string) => `Quick update: I am running late. I am coming by ${method.toLowerCase()}, so I will keep you posted.`,
  cannotMakeItReasons: {
    unwell: { label: "Feeling unwell", message: "I am sorry, I am feeling unwell and will not be able to make it today. I hope the meetup goes well." },
    work: { label: "Work came up", message: "I am sorry, work has come up and I will not be able to make it today. I hope the meetup goes well." },
    appointment: { label: "Appointment", message: "I am sorry, I have an appointment and will not be able to make it today. I hope the meetup goes well." },
    somethingCameUp: { label: "Something came up", message: "I am sorry, something came up and I will not be able to make it today. I hope the meetup goes well." },
    changedMind: { label: "Changed my mind", message: "I am sorry, I have changed my mind and will not be able to make it today. I hope the meetup goes well." },
  } satisfies Record<CannotMakeItReason, { label: string; message: string }>,
};

const safetyReasonTranslations: Record<string, Partial<Record<SafetyReportReason, { label: string; copy: string }>>> = {
  Chinese: {
    "Safety threat": { label: "安全威胁", copy: "即时风险、胁迫、跟踪、威胁或不安全的线下行为。" },
    Harassment: { label: "骚扰", copy: "反复的不受欢迎联系、恐吓、性压力或辱骂消息。" },
    "Underage risk": { label: "未成年人风险", copy: "有人可能未满18岁，或试图让未成年人参与。" },
    Impersonation: { label: "冒充他人", copy: "假装成他人、使用被盗信息，或误导身份。" },
    Fraud: { label: "欺诈", copy: "索要钱款、诈骗、钓鱼、勒索或可疑链接。" },
    "Fake profile": { label: "虚假资料", copy: "资料、照片或行为看起来不真实。" },
    Spam: { label: "垃圾信息", copy: "推广消息、重复联系或无关链接。" },
    "Hate or discrimination": { label: "仇恨或歧视", copy: "针对身份、文化、宗教、残障、性别或性取向的攻击。" },
    "Privacy concern": { label: "隐私问题", copy: "未经同意分享私人信息、截图或个人细节。" },
    Other: { label: "其他", copy: "还有其他感觉不对、需要审核的情况。" },
  },
  Japanese: {
    "Safety threat": { label: "安全上の脅威", copy: "差し迫った危険、強要、つきまとい、脅し、不安全なミートアップ行動。" },
    Harassment: { label: "ハラスメント", copy: "望まない連絡の繰り返し、威圧、性的な圧力、攻撃的なメッセージ。" },
    "Underage risk": { label: "未成年のリスク", copy: "18歳未満の可能性、または未成年を巻き込もうとしている可能性。" },
    Impersonation: { label: "なりすまし", copy: "他人のふり、盗まれた情報の使用、誤解を招く本人情報。" },
    Fraud: { label: "詐欺", copy: "金銭要求、詐欺、フィッシング、脅迫、不審なリンク。" },
    "Fake profile": { label: "偽プロフィール", copy: "プロフィール情報、写真、行動が本物らしく見えない。" },
    Spam: { label: "スパム", copy: "宣伝、繰り返しの連絡、関係のないリンク。" },
    "Hate or discrimination": { label: "憎悪または差別", copy: "属性、文化、宗教、障がい、性別、性的指向を対象にした攻撃。" },
    "Privacy concern": { label: "プライバシーの懸念", copy: "同意なく個人情報、スクリーンショット、私的な詳細を共有している。" },
    Other: { label: "その他", copy: "他に違和感があり、確認が必要なこと。" },
  },
  Korean: {
    "Safety threat": { label: "안전 위협", copy: "즉각적인 위험, 강요, 스토킹, 협박 또는 안전하지 않은 모임 행동." },
    Harassment: { label: "괴롭힘", copy: "반복적인 원치 않는 연락, 위협, 성적 압박 또는 모욕적인 메시지." },
    "Underage risk": { label: "미성년자 위험", copy: "누군가 만 18세 미만이거나 미성년자를 참여시키려는 경우." },
    Impersonation: { label: "사칭", copy: "다른 사람인 척하거나 도용된 정보, 오해를 부르는 신원 사용." },
    Fraud: { label: "사기", copy: "금전 요구, 사기, 피싱, 협박 또는 의심스러운 링크." },
    "Fake profile": { label: "가짜 프로필", copy: "프로필 정보, 사진 또는 행동이 진짜처럼 보이지 않음." },
    Spam: { label: "스팸", copy: "홍보 메시지, 반복 연락 또는 관련 없는 링크." },
    "Hate or discrimination": { label: "혐오 또는 차별", copy: "정체성, 문화, 종교, 장애, 성별 또는 성적 지향을 향한 공격." },
    "Privacy concern": { label: "개인정보 우려", copy: "동의 없이 개인 정보, 스크린샷 또는 사적인 내용을 공유." },
    Other: { label: "기타", copy: "그 밖에 이상하게 느껴져 검토가 필요한 내용." },
  },
  Hebrew: {
    "Safety threat": { label: "איום בטיחותי", copy: "סיכון מיידי, כפייה, מעקב, איומים או התנהגות לא בטוחה במפגש." },
    Harassment: { label: "הטרדה", copy: "פנייה חוזרת לא רצויה, הפחדה, לחץ מיני או הודעות פוגעניות." },
    "Underage risk": { label: "חשש לקטין", copy: "ייתכן שמישהו מתחת לגיל 18 או מנסה לערב קטין." },
    Impersonation: { label: "התחזות", copy: "העמדת פנים כאדם אחר או שימוש בפרטים מטעים." },
    Fraud: { label: "הונאה", copy: "בקשות כסף, תרמיות, פישינג, סחיטה או קישורים חשודים." },
    "Fake profile": { label: "פרופיל מזויף", copy: "פרטי פרופיל, תמונות או התנהגות לא נראים אמינים." },
    Spam: { label: "ספאם", copy: "הודעות פרסומיות, פנייה חוזרת או קישורים לא קשורים." },
    "Hate or discrimination": { label: "שנאה או אפליה", copy: "פגיעה שמכוונת לזהות, תרבות, דת, מוגבלות, מגדר או מיניות." },
    "Privacy concern": { label: "חשש לפרטיות", copy: "שיתוף מידע פרטי, צילומי מסך או פרטים אישיים ללא הסכמה." },
    Other: { label: "אחר", copy: "משהו אחר מרגיש לא תקין וצריך בדיקה." },
  },
};

const reportFlowTranslations = {
  Chinese: {
    targetTitle: "这是关于谁？",
    routeTitle: "发送到哪里？",
    hostRole: "主持人",
    memberRole: "成员",
    chatRole: "群组",
    reportToHost: "先报告给主持人",
    reportToHostCopy: "当问题涉及另一名成员，且主持人可能介入时使用。",
    appReview: "提交给应用审核",
    appReviewCopy: "用于主持人问题、紧急升级，或报告给主持人没有帮助时。",
    cancelWindow: "你可以在10分钟内取消这条报告。",
    cancelReport: "取消报告",
    reportCancelled: "报告已取消",
    reportSaved: "报告已保存",
  },
  Japanese: {
    targetTitle: "これは誰についてですか？",
    routeTitle: "どこに送りますか？",
    hostRole: "主催者",
    memberRole: "メンバー",
    chatRole: "グループ",
    reportToHost: "まず主催者に報告",
    reportToHostCopy: "別のメンバーに関する懸念で、主催者が対応できそうな場合に使います。",
    appReview: "アプリ審査に送信",
    appReviewCopy: "主催者の問題、緊急のエスカレーション、または主催者への報告で解決しない場合に使います。",
    cancelWindow: "この報告は10分間キャンセルできます。",
    cancelReport: "報告をキャンセル",
    reportCancelled: "報告をキャンセルしました",
    reportSaved: "報告を保存しました",
  },
  Korean: {
    targetTitle: "누구에 대한 내용인가요?",
    routeTitle: "어디로 보낼까요?",
    hostRole: "주최자",
    memberRole: "멤버",
    chatRole: "그룹",
    reportToHost: "먼저 주최자에게 신고",
    reportToHostCopy: "다른 멤버에 대한 우려이고 주최자가 도와줄 수 있을 때 사용하세요.",
    appReview: "앱 검토로 제출",
    appReviewCopy: "주최자 문제, 긴급 신고, 또는 주최자에게 신고해도 도움이 되지 않을 때 사용하세요.",
    cancelWindow: "이 신고는 10분 동안 취소할 수 있어요.",
    cancelReport: "신고 취소",
    reportCancelled: "신고가 취소됨",
    reportSaved: "신고가 저장됨",
  },
  Hebrew: {
    targetTitle: "על מי הדיווח?",
    routeTitle: "לאן לשלוח את זה?",
    hostRole: "מארח/ת",
    memberRole: "חבר/ה",
    chatRole: "קבוצה",
    reportToHost: "לדווח קודם למארח/ת",
    reportToHostCopy: "מתאים כשמדובר בחבר/ה אחר/ת והמארח/ת יכולים להתערב.",
    appReview: "שליחה לבדיקה באפליקציה",
    appReviewCopy: "מתאים לבעיה עם המארח/ת, הסלמה דחופה, או אם דיווח למארח/ת לא עזר.",
    cancelWindow: "אפשר לבטל את הדיווח במשך 10 דקות.",
    cancelReport: "ביטול דיווח",
    reportCancelled: "הדיווח בוטל",
    reportSaved: "הדיווח נשמר",
  },
} satisfies Record<string, ReportFlowCopy>;

const arrivalUpdateTranslations = {
  Hebrew: {
    title: "עדכוני הגעה",
    runningLate: "מאחר/ת",
    cannotMakeIt: "לא אוכל להגיע",
    cannotMakeItReasonTitle: "למה לא תוכל/י להגיע?",
    runningLateMessage: (method: string) => `עדכון קצר: אני מאחר/ת. אני מגיע/ה באמצעות ${method}, ואעדכן בהמשך.`,
    cannotMakeItReasons: {
      unwell: { label: "לא מרגיש/ה טוב", message: "סליחה, אני לא מרגיש/ה טוב ולא אוכל להגיע היום. מקווה שהמפגש יהיה מוצלח." },
      work: { label: "עבודה צצה", message: "סליחה, צצה לי עבודה ולא אוכל להגיע היום. מקווה שהמפגש יהיה מוצלח." },
      appointment: { label: "תור או פגישה", message: "סליחה, יש לי תור או פגישה ולא אוכל להגיע היום. מקווה שהמפגש יהיה מוצלח." },
      somethingCameUp: { label: "משהו צץ", message: "סליחה, משהו צץ ולא אוכל להגיע היום. מקווה שהמפגש יהיה מוצלח." },
      changedMind: { label: "שיניתי את דעתי", message: "סליחה, שיניתי את דעתי ולא אוכל להגיע היום. מקווה שהמפגש יהיה מוצלח." },
    } satisfies Record<CannotMakeItReason, { label: string; message: string }>,
  },
  Chinese: {
    title: "到达更新",
    runningLate: "会迟到",
    cannotMakeIt: "无法参加",
    cannotMakeItReasonTitle: "为什么无法参加？",
    runningLateMessage: (method: string) => `快速更新：我会迟到。我会通过${method}到达，会继续更新。`,
    cannotMakeItReasons: {
      unwell: { label: "身体不适", message: "抱歉，我今天身体不舒服，不能参加了。希望聚会顺利。" },
      work: { label: "工作临时有事", message: "抱歉，工作上临时有事，我今天不能参加了。希望聚会顺利。" },
      appointment: { label: "有预约", message: "抱歉，我有一个预约，今天不能参加了。希望聚会顺利。" },
      somethingCameUp: { label: "临时有事", message: "抱歉，临时有事，我今天不能参加了。希望聚会顺利。" },
      changedMind: { label: "改变主意", message: "抱歉，我改变主意了，今天不能参加。希望聚会顺利。" },
    } satisfies Record<CannotMakeItReason, { label: string; message: string }>,
  },
  Japanese: {
    title: "到着の更新",
    runningLate: "遅れています",
    cannotMakeIt: "参加できません",
    cannotMakeItReasonTitle: "参加できない理由は？",
    runningLateMessage: (method: string) => `短い更新：少し遅れています。${method}で向かっているので、また知らせます。`,
    cannotMakeItReasons: {
      unwell: { label: "体調不良", message: "すみません、今日は体調が悪く参加できません。ミートアップがうまくいきますように。" },
      work: { label: "仕事が入った", message: "すみません、仕事が入って今日は参加できません。ミートアップがうまくいきますように。" },
      appointment: { label: "予定がある", message: "すみません、予定があり今日は参加できません。ミートアップがうまくいきますように。" },
      somethingCameUp: { label: "急用ができた", message: "すみません、急用ができて今日は参加できません。ミートアップがうまくいきますように。" },
      changedMind: { label: "気が変わった", message: "すみません、気が変わったので今日は参加しません。ミートアップがうまくいきますように。" },
    } satisfies Record<CannotMakeItReason, { label: string; message: string }>,
  },
  Korean: {
    title: "도착 업데이트",
    runningLate: "늦는 중",
    cannotMakeIt: "참석 불가",
    cannotMakeItReasonTitle: "왜 참석할 수 없나요?",
    runningLateMessage: (method: string) => `간단 업데이트: 제가 늦고 있어요. ${method}(으)로 가는 중이라 계속 알려드릴게요.`,
    cannotMakeItReasons: {
      unwell: { label: "몸이 좋지 않음", message: "죄송해요, 오늘 몸이 좋지 않아 참석하지 못할 것 같아요. 모임이 잘 진행되길 바라요." },
      work: { label: "일이 생김", message: "죄송해요, 일이 생겨 오늘 참석하지 못할 것 같아요. 모임이 잘 진행되길 바라요." },
      appointment: { label: "예약/약속", message: "죄송해요, 다른 약속이 있어 오늘 참석하지 못할 것 같아요. 모임이 잘 진행되길 바라요." },
      somethingCameUp: { label: "급한 일이 생김", message: "죄송해요, 급한 일이 생겨 오늘 참석하지 못할 것 같아요. 모임이 잘 진행되길 바라요." },
      changedMind: { label: "마음이 바뀜", message: "죄송해요, 마음이 바뀌어 오늘 참석하지 않으려 해요. 모임이 잘 진행되길 바라요." },
    } satisfies Record<CannotMakeItReason, { label: string; message: string }>,
  },
} satisfies Record<string, ArrivalUpdateCopy>;

const memberBlockTranslations = {
  English: {
    blockMember: "Block member",
    blockMemberCopy: "Choose a member to stop direct interaction privately.",
    unblockMember: "Unblock member",
    unblockMemberCopy: "Allow direct interaction with this member again.",
    chooseMember: "Choose member",
    blockedMemberSaved: "Member blocked privately",
    unblockedMemberSaved: "Member unblocked",
    blockedMemberCopy: (name: string) => `You will not receive direct interaction from ${name}.`,
    unblockedMemberCopy: (name: string) => `Direct interaction with ${name} is allowed again.`,
  },
  Hebrew: {
    blockMember: "חסימת חבר/ה",
    blockMemberCopy: "בחר/י חבר/ה כדי לעצור אינטראקציה ישירה באופן פרטי.",
    unblockMember: "ביטול חסימת חבר/ה",
    unblockMemberCopy: "לאפשר שוב אינטראקציה ישירה עם החבר/ה.",
    chooseMember: "בחר/י חבר/ה",
    blockedMemberSaved: "החבר/ה נחסם/ה באופן פרטי",
    unblockedMemberSaved: "חסימת החבר/ה בוטלה",
    blockedMemberCopy: (name: string) => `לא תקבל/י אינטראקציה ישירה מ-${name}.`,
    unblockedMemberCopy: (name: string) => `אינטראקציה ישירה עם ${name} מותרת שוב.`,
  },
  Chinese: {
    blockMember: "屏蔽成员",
    blockMemberCopy: "选择一名成员，私下停止直接互动。",
    unblockMember: "取消屏蔽成员",
    unblockMemberCopy: "允许再次与这名成员直接互动。",
    chooseMember: "选择成员",
    blockedMemberSaved: "已私下屏蔽成员",
    unblockedMemberSaved: "已取消屏蔽成员",
    blockedMemberCopy: (name: string) => `你将不会收到来自 ${name} 的直接互动。`,
    unblockedMemberCopy: (name: string) => `已再次允许与 ${name} 直接互动。`,
  },
  Japanese: {
    blockMember: "メンバーをブロック",
    blockMemberCopy: "メンバーを選び、直接のやり取りを非公開で停止します。",
    unblockMember: "メンバーのブロックを解除",
    unblockMemberCopy: "このメンバーとの直接のやり取りを再び許可します。",
    chooseMember: "メンバーを選択",
    blockedMemberSaved: "メンバーを非公開でブロックしました",
    unblockedMemberSaved: "メンバーのブロックを解除しました",
    blockedMemberCopy: (name: string) => `${name} からの直接のやり取りは届きません。`,
    unblockedMemberCopy: (name: string) => `${name} との直接のやり取りが再び許可されました。`,
  },
  Korean: {
    blockMember: "멤버 차단",
    blockMemberCopy: "직접 상호작용을 비공개로 중단할 멤버를 선택하세요.",
    unblockMember: "멤버 차단 해제",
    unblockMemberCopy: "이 멤버와의 직접 상호작용을 다시 허용합니다.",
    chooseMember: "멤버 선택",
    blockedMemberSaved: "멤버가 비공개로 차단됨",
    unblockedMemberSaved: "멤버 차단 해제됨",
    blockedMemberCopy: (name: string) => `${name}님의 직접 상호작용을 받지 않아요.`,
    unblockedMemberCopy: (name: string) => `${name}님과의 직접 상호작용이 다시 허용됐어요.`,
  },
} satisfies Record<string, MemberBlockCopy>;

const chatMenuTranslations = {
  English: {
    title: "Meetup chats",
    current: "Current chat",
    openLabel: "Choose meetup chat",
    landingTitle: "Choose a chat",
    landingCopy: "Select a meetup group or verified person to open the right conversation.",
    meetupGroups: "Meetup groups",
    people: "People",
    privateChat: "Private chat",
    host: "Host",
    member: "Member",
  },
  Hebrew: {
    title: "צ'אטים של מפגשים",
    current: "הצ'אט הנוכחי",
    openLabel: "בחירת צ'אט מפגש",
    landingTitle: "בחירת צ'אט",
    landingCopy: "בחר/י קבוצת מפגש או אדם מאומת כדי לפתוח את השיחה המתאימה.",
    meetupGroups: "קבוצות מפגש",
    people: "אנשים",
    privateChat: "צ'אט פרטי",
    host: "מארח/ת",
    member: "חבר/ה",
  },
  Chinese: {
    title: "聚会聊天",
    current: "当前聊天",
    openLabel: "选择聚会聊天",
    landingTitle: "选择聊天",
    landingCopy: "选择聚会群组或已验证成员，打开合适的对话。",
    meetupGroups: "聚会群组",
    people: "成员",
    privateChat: "私聊",
    host: "主持人",
    member: "成员",
  },
  Japanese: {
    title: "ミートアップチャット",
    current: "現在のチャット",
    openLabel: "ミートアップチャットを選択",
    landingTitle: "チャットを選択",
    landingCopy: "ミートアップグループまたは確認済みの人を選んで、適切な会話を開きます。",
    meetupGroups: "ミートアップグループ",
    people: "人",
    privateChat: "個別チャット",
    host: "主催者",
    member: "メンバー",
  },
  Korean: {
    title: "모임 채팅",
    current: "현재 채팅",
    openLabel: "모임 채팅 선택",
    landingTitle: "채팅 선택",
    landingCopy: "모임 그룹이나 인증된 사람을 선택해 알맞은 대화를 여세요.",
    meetupGroups: "모임 그룹",
    people: "사람들",
    privateChat: "개인 채팅",
    host: "주최자",
    member: "멤버",
  },
} satisfies Record<string, ChatMenuCopy>;

const chatEventTitleTranslations: Record<string, Record<string, string>> = {
  Hebrew: {
    "picnic-easy-hangout": "פיקניק — מפגש קליל",
    "beach-day-chill-vibes": "יום חוף — אווירה רגועה",
    "library-calm-study": "לימוד רגוע בספרייה",
    "coffee-lane-cove": "קפה — שלום קליל",
    "harbour-walk-waverton": "הליכת נמל — קצב קל",
    "movie-night-watch-chat": "ערב סרט — צפייה + צ'אט",
    "board-games-coffee": "משחקי קופסה + קפה",
    "ramen-small-table": "ראמן — שולחן קטן",
    "quiet-music-listening": "האזנה למוזיקה שקטה",
  },
  Chinese: {
    "picnic-easy-hangout": "野餐 — 轻松相处",
    "beach-day-chill-vibes": "海边日 — 放松氛围",
    "library-calm-study": "图书馆安静学习",
    "coffee-lane-cove": "咖啡 — 轻松打招呼",
    "harbour-walk-waverton": "海港散步 — 轻松节奏",
    "movie-night-watch-chat": "电影夜 — 观看 + 聊天",
    "board-games-coffee": "桌游 + 咖啡",
    "ramen-small-table": "拉面 — 小桌",
    "quiet-music-listening": "安静音乐聆听",
  },
  Japanese: {
    "picnic-easy-hangout": "ピクニック — 気楽な集まり",
    "beach-day-chill-vibes": "ビーチデー — ゆったりした雰囲気",
    "library-calm-study": "図書館で静かな勉強",
    "coffee-lane-cove": "コーヒー — 気軽にこんにちは",
    "harbour-walk-waverton": "ハーバー散歩 — ゆっくりペース",
    "movie-night-watch-chat": "映画ナイト — 観る + 話す",
    "board-games-coffee": "ボードゲーム + コーヒー",
    "ramen-small-table": "ラーメン — 小さなテーブル",
    "quiet-music-listening": "静かな音楽を聴く",
  },
  Korean: {
    "picnic-easy-hangout": "피크닉 — 편안한 시간",
    "beach-day-chill-vibes": "해변의 날 — 여유로운 분위기",
    "library-calm-study": "도서관 차분한 스터디",
    "coffee-lane-cove": "커피 — 부담 없는 인사",
    "harbour-walk-waverton": "하버 산책 — 쉬운 속도",
    "movie-night-watch-chat": "영화 밤 — 보기 + 대화",
    "board-games-coffee": "보드게임 + 커피",
    "ramen-small-table": "라멘 — 작은 테이블",
    "quiet-music-listening": "조용한 음악 감상",
  },
};

const getChatMemberLabel = (event: EventItem, languageBase: string) =>
  languageBase === "Hebrew"
    ? event.people.replace("people", "אנשים")
    : languageBase === "Chinese"
      ? event.people.replace("people", "位成员")
      : languageBase === "Japanese"
        ? event.people.replace("people", "人")
        : languageBase === "Korean"
          ? event.people.replace("people", "명")
      : event.people;

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
    reportConcernCopy: "Choose a private report reason for moderator review.",
    escalationReasons: "Escalation reasons",
    otherReportReasons: "Other report reasons",
    blockHost: "Block host",
    blockHostCopy: "Stops direct interaction privately.",
    unblockHost: "Unblock host",
    unblockHostCopy: "Allow direct interaction again.",
    blockChoiceTitle: "Block this person?",
    blockChoiceCopy: "You can only block, or block and also choose a report reason.",
    blockOnly: "Just block",
    blockAndReport: "Block and report",
    blockedSaved: "Blocked privately",
    blockedSavedCopy: "You will not receive direct interaction from this prototype host.",
    unblockedSaved: "Unblocked",
    unblockedSavedCopy: "Direct interaction is allowed again in this prototype.",
    chooseReportAfterBlock: "Blocked. Choose a report reason if you want moderator review too.",
    cancel: "Cancel",
    stepBack: "Step back",
    stepBackCopy: "Send a gentle preset message.",
    skipToday: "Skip today",
    skipTodayCopy: "Leave the meetup without pressure.",
    findAnotherGroup: "Find another group",
    findAnotherGroupCopy: "Look for a better fit.",
    reopenOptions: "Reopen chat options",
    trustRequiredTitle: "Contact Verified required",
    trustRequiredCopy: "Private chats open only when both people have verified contact details.",
    reviewSettings: "Review Trust status",
    reviewTrustStatusHint: "Opens Profile so you can review and add contact verification details.",
    backToChatChooserHint: "Returns to the chat chooser.",
    openChatListHint: "Opens the list of meetup groups and people you can chat with.",
    safetyOptionsHint: "Opens private safety, report, and block options for this chat.",
    softExitHint: "Opens gentle options for stepping back from this meetup chat.",
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
    reportConcernCopy: "اختر سبب بلاغ خاص للمراجعة.",
    escalationReasons: "أسباب التصعيد",
    otherReportReasons: "أسباب أخرى للإبلاغ",
    blockHost: "حظر المضيف",
    blockHostCopy: "يوقف التفاعل المباشر بشكل خاص.",
    unblockHost: "إلغاء حظر المضيف",
    unblockHostCopy: "اسمح بالتفاعل المباشر مرة أخرى.",
    blockChoiceTitle: "حظر هذا الشخص؟",
    blockChoiceCopy: "يمكنك الحظر فقط، أو الحظر واختيار سبب بلاغ أيضاً.",
    blockOnly: "حظر فقط",
    blockAndReport: "حظر وإبلاغ",
    blockedSaved: "تم الحظر بشكل خاص",
    blockedSavedCopy: "لن تتلقى تفاعلاً مباشراً من مضيف النموذج هذا.",
    unblockedSaved: "تم إلغاء الحظر",
    unblockedSavedCopy: "أصبح التفاعل المباشر مسموحاً مرة أخرى في هذا النموذج.",
    chooseReportAfterBlock: "تم الحظر. اختر سبب البلاغ إذا أردت مراجعة المشرف أيضاً.",
    cancel: "إلغاء",
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
    reportConcernCopy: "选择一个私密举报原因供审核。",
    escalationReasons: "升级处理原因",
    otherReportReasons: "其他举报原因",
    blockHost: "屏蔽主持人",
    blockHostCopy: "私下停止直接互动。",
    unblockHost: "取消屏蔽主持人",
    unblockHostCopy: "再次允许直接互动。",
    blockChoiceTitle: "屏蔽此人？",
    blockChoiceCopy: "你可以只屏蔽，或屏蔽并选择举报原因。",
    blockOnly: "只屏蔽",
    blockAndReport: "屏蔽并举报",
    blockedSaved: "已私密屏蔽",
    blockedSavedCopy: "你不会再收到此原型主持人的直接互动。",
    unblockedSaved: "已取消屏蔽",
    unblockedSavedCopy: "此原型中再次允许直接互动。",
    chooseReportAfterBlock: "已屏蔽。如需审核，也可以选择举报原因。",
    cancel: "取消",
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
    reportConcernCopy: "Choisir un motif privé pour examen.",
    escalationReasons: "Motifs d'escalade",
    otherReportReasons: "Autres motifs",
    blockHost: "Bloquer l'hôte",
    blockHostCopy: "Arrête les interactions directes en privé.",
    unblockHost: "Débloquer l'hôte",
    unblockHostCopy: "Autoriser à nouveau l'interaction directe.",
    blockChoiceTitle: "Bloquer cette personne ?",
    blockChoiceCopy: "Vous pouvez seulement bloquer, ou bloquer et choisir aussi un motif de signalement.",
    blockOnly: "Bloquer seulement",
    blockAndReport: "Bloquer et signaler",
    blockedSaved: "Bloqué en privé",
    blockedSavedCopy: "Vous ne recevrez pas d'interaction directe de cet hôte du prototype.",
    unblockedSaved: "Débloqué",
    unblockedSavedCopy: "L'interaction directe est à nouveau autorisée dans ce prototype.",
    chooseReportAfterBlock: "Bloqué. Choisissez un motif si vous voulez aussi un examen.",
    cancel: "Annuler",
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
    reportConcernCopy: "Wähle einen privaten Meldegrund zur Prüfung.",
    escalationReasons: "Eskalationsgründe",
    otherReportReasons: "Andere Meldegründe",
    blockHost: "Host blockieren",
    blockHostCopy: "Stoppt direkte Interaktion privat.",
    unblockHost: "Host entsperren",
    unblockHostCopy: "Direkte Interaktion wieder erlauben.",
    blockChoiceTitle: "Diese Person blockieren?",
    blockChoiceCopy: "Du kannst nur blockieren oder blockieren und zusätzlich einen Meldegrund wählen.",
    blockOnly: "Nur blockieren",
    blockAndReport: "Blockieren und melden",
    blockedSaved: "Privat blockiert",
    blockedSavedCopy: "Du erhältst keine direkte Interaktion mehr von diesem Prototyp-Host.",
    unblockedSaved: "Entsperrt",
    unblockedSavedCopy: "Direkte Interaktion ist in diesem Prototyp wieder erlaubt.",
    chooseReportAfterBlock: "Blockiert. Wähle einen Meldegrund, wenn du auch eine Prüfung möchtest.",
    cancel: "Abbrechen",
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
    reportConcernCopy: "בחר סיבת דיווח פרטית לבדיקה.",
    escalationReasons: "סיבות להסלמה",
    otherReportReasons: "סיבות דיווח אחרות",
    blockHost: "חסימת המארח",
    blockHostCopy: "עוצר אינטראקציה ישירה באופן פרטי.",
    unblockHost: "ביטול חסימת המארח",
    unblockHostCopy: "לאפשר שוב אינטראקציה ישירה.",
    blockChoiceTitle: "לחסום את האדם הזה?",
    blockChoiceCopy: "אפשר רק לחסום, או לחסום וגם לבחור סיבת דיווח.",
    blockOnly: "רק לחסום",
    blockAndReport: "לחסום ולדווח",
    blockedSaved: "נחסם באופן פרטי",
    blockedSavedCopy: "לא תקבל/י אינטראקציה ישירה מהמארח באב הטיפוס.",
    unblockedSaved: "החסימה בוטלה",
    unblockedSavedCopy: "אינטראקציה ישירה מותרת שוב באב הטיפוס.",
    chooseReportAfterBlock: "נחסם. אפשר לבחור סיבת דיווח אם רוצים גם בדיקת מנחה.",
    cancel: "ביטול",
    stepBack: "לקחת צעד אחורה",
    stepBackCopy: "שלח הודעה מוכנה ועדינה.",
    skipToday: "לדלג היום",
    skipTodayCopy: "לעזוב את המפגש בלי לחץ.",
    findAnotherGroup: "למצוא קבוצה אחרת",
    findAnotherGroupCopy: "לחפש התאמה טובה יותר.",
    reopenOptions: "לפתוח מחדש אפשרויות צ'אט",
    trustRequiredTitle: "נדרש אימות קשר",
    trustRequiredCopy: "צ'אטים פרטיים נפתחים רק כששני האנשים אימתו פרטי קשר.",
    reviewSettings: "סקירת סטטוס אמון",
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
    reportConcernCopy: "確認用の非公開の報告理由を選びます。",
    escalationReasons: "エスカレーション理由",
    otherReportReasons: "その他の報告理由",
    blockHost: "ホストをブロック",
    blockHostCopy: "直接のやり取りを非公開で止めます。",
    unblockHost: "ホストのブロック解除",
    unblockHostCopy: "直接のやり取りを再び許可します。",
    blockChoiceTitle: "この人をブロックしますか？",
    blockChoiceCopy: "ブロックだけ、またはブロックして報告理由を選べます。",
    blockOnly: "ブロックのみ",
    blockAndReport: "ブロックして報告",
    blockedSaved: "非公開でブロックしました",
    blockedSavedCopy: "このプロトタイプのホストから直接のやり取りは届きません。",
    unblockedSaved: "ブロックを解除しました",
    unblockedSavedCopy: "このプロトタイプで直接のやり取りが再び許可されます。",
    chooseReportAfterBlock: "ブロックしました。確認も希望する場合は報告理由を選んでください。",
    cancel: "キャンセル",
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
    reportConcernCopy: "검토를 위한 비공개 신고 사유를 선택하세요.",
    escalationReasons: "긴급 검토 사유",
    otherReportReasons: "기타 신고 사유",
    blockHost: "호스트 차단",
    blockHostCopy: "직접 상호작용을 비공개로 중지해요.",
    unblockHost: "호스트 차단 해제",
    unblockHostCopy: "직접 상호작용을 다시 허용해요.",
    blockChoiceTitle: "이 사람을 차단할까요?",
    blockChoiceCopy: "차단만 하거나, 차단 후 신고 사유도 선택할 수 있어요.",
    blockOnly: "차단만",
    blockAndReport: "차단하고 신고",
    blockedSaved: "비공개로 차단됨",
    blockedSavedCopy: "이 프로토타입 호스트의 직접 상호작용을 받지 않아요.",
    unblockedSaved: "차단 해제됨",
    unblockedSavedCopy: "이 프로토타입에서 직접 상호작용이 다시 허용돼요.",
    chooseReportAfterBlock: "차단됐어요. 검토도 원하면 신고 사유를 선택하세요.",
    cancel: "취소",
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
    reportConcernCopy: "Выберите приватную причину для проверки.",
    escalationReasons: "Причины эскалации",
    otherReportReasons: "Другие причины",
    blockHost: "Заблокировать организатора",
    blockHostCopy: "Приватно прекращает прямое взаимодействие.",
    unblockHost: "Разблокировать организатора",
    unblockHostCopy: "Снова разрешить прямое взаимодействие.",
    blockChoiceTitle: "Заблокировать этого человека?",
    blockChoiceCopy: "Можно только заблокировать или заблокировать и выбрать причину жалобы.",
    blockOnly: "Только заблокировать",
    blockAndReport: "Заблокировать и пожаловаться",
    blockedSaved: "Заблокировано приватно",
    blockedSavedCopy: "Вы не будете получать прямое взаимодействие от этого прототипного организатора.",
    unblockedSaved: "Разблокировано",
    unblockedSavedCopy: "Прямое взаимодействие снова разрешено в этом прототипе.",
    chooseReportAfterBlock: "Заблокировано. Выберите причину, если также нужна проверка.",
    cancel: "Отмена",
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
    reportConcernCopy: "Elige un motivo privado para revisión.",
    escalationReasons: "Motivos de escalamiento",
    otherReportReasons: "Otros motivos",
    blockHost: "Bloquear anfitrión",
    blockHostCopy: "Detiene la interacción directa en privado.",
    unblockHost: "Desbloquear anfitrión",
    unblockHostCopy: "Permite de nuevo la interacción directa.",
    blockChoiceTitle: "¿Bloquear a esta persona?",
    blockChoiceCopy: "Puedes solo bloquear, o bloquear y elegir también un motivo de reporte.",
    blockOnly: "Solo bloquear",
    blockAndReport: "Bloquear y reportar",
    blockedSaved: "Bloqueado en privado",
    blockedSavedCopy: "No recibirás interacción directa de este anfitrión del prototipo.",
    unblockedSaved: "Desbloqueado",
    unblockedSavedCopy: "La interacción directa vuelve a estar permitida en este prototipo.",
    chooseReportAfterBlock: "Bloqueado. Elige un motivo si también quieres revisión.",
    cancel: "Cancelar",
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

const chatTrustGateTranslations = {
  English: {
    trustRequiredTitle: "Contact Verified required",
    trustRequiredCopy: "Private chats open only when both people have verified contact details.",
    reviewSettings: "Review Trust status",
  },
  Japanese: {
    trustRequiredTitle: "連絡先認証が必要です",
    trustRequiredCopy: "両方の人が連絡先を認証すると、プライベートチャットが利用できます。",
    reviewSettings: "信頼ステータスを確認",
  },
  Korean: {
    trustRequiredTitle: "연락처 인증이 필요해요",
    trustRequiredCopy: "두 사람 모두 연락처를 인증하면 개인 채팅을 사용할 수 있어요.",
    reviewSettings: "신뢰 상태 확인",
  },
  Chinese: {
    trustRequiredTitle: "需要联系方式验证",
    trustRequiredCopy: "只有双方都验证联系方式后，私人聊天才会开放。",
    reviewSettings: "查看信任状态",
  },
  Hebrew: {
    trustRequiredTitle: "נדרש אימות קשר",
    trustRequiredCopy: "צ'אטים פרטיים נפתחים רק כששני האנשים אימתו פרטי קשר.",
    reviewSettings: "סקירת סטטוס אמון",
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
  const { eventId: requestedEventIdParam } = useLocalSearchParams<{ eventId?: string | string[] }>();
  const requestedEventId = Array.isArray(requestedEventIdParam) ? requestedEventIdParam[0] : requestedEventIdParam;
  const {
    isNightMode,
    appLanguage,
    translationLanguage,
    contactEmail,
    contactPhone,
    identitySelfieUri,
    hasIdentityDocument,
    eventMemberships,
    blockedUserIds,
    safetyReports,
    transportationMethod,
    screenReaderHints,
    saveSoftHelloMvpState,
  } = useAppSettings();
  const appLanguageBase = getTranslationLanguageBase(appLanguage);
  const translationLanguageBase = getTranslationLanguageBase(translationLanguage);
  const isDay = !isNightMode;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const copy = chatTranslations[appLanguageBase as keyof typeof chatTranslations] ?? chatTranslations.English;
  const chatCopy = { ...chatTranslations.English, ...copy };
  const trustGateCopy = chatTrustGateTranslations[appLanguageBase as keyof typeof chatTrustGateTranslations] ?? chatTrustGateTranslations.English;
  const localizedReportFlowCopy = reportFlowTranslations[appLanguageBase as keyof typeof reportFlowTranslations] ?? reportFlowCopy;
  const localizedArrivalUpdateCopy =
    arrivalUpdateTranslations[appLanguageBase as keyof typeof arrivalUpdateTranslations] ?? arrivalUpdateCopy;
  const localizedSafetyReasons = safetyReasonTranslations[appLanguageBase] ?? {};
  const memberBlockCopy = memberBlockTranslations[appLanguageBase as keyof typeof memberBlockTranslations] ?? memberBlockTranslations.English;
  const chatMenuCopy = chatMenuTranslations[appLanguageBase as keyof typeof chatMenuTranslations] ?? chatMenuTranslations.English;
  const chatEventTitleCopy = chatEventTitleTranslations[appLanguageBase] ?? {};
  const translatedMessages = chatMessageTranslations[translationLanguageBase as keyof typeof chatMessageTranslations];
  const transportationOptionsCopy = getProfilePreferenceCopy(appLanguageBase).transportation.options ?? {};
  const effectiveVerificationLevel = deriveVerificationLevel({ contactEmail, contactPhone, identitySelfieUri, hasIdentityDocument });
  const canUsePrivateChats = canChatPrivately(effectiveVerificationLevel);
  const [eventMessagesById, setEventMessagesById] = useState<Record<string, ChatMessage[]>>(() => ({ ...eventChatSeeds }));
  const [directMessagesByPerson, setDirectMessagesByPerson] = useState<Record<string, ChatMessage[]>>(directChatSeedByPerson);
  const [draft, setDraft] = useState("");
  const [selectedChatId, setSelectedChatId] = useState("movie-night-watch-chat");
  const [selectedChatTargetId, setSelectedChatTargetId] = useState<string | null>(null);
  const [previewPersonId, setPreviewPersonId] = useState<string | null>(null);
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [softExitOpen, setSoftExitOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [reportReasonsOpen, setReportReasonsOpen] = useState(false);
  const [blockChoiceOpen, setBlockChoiceOpen] = useState(false);
  const [memberBlockOpen, setMemberBlockOpen] = useState(false);
  const [blockNotice, setBlockNotice] = useState("");
  const [selectedReportTargetId, setSelectedReportTargetId] = useState("maya-host");
  const [selectedBlockMemberId, setSelectedBlockMemberId] = useState(memberBlockTargets[0]?.id ?? "");
  const [selectedReportRoute, setSelectedReportRoute] = useState<SafetyReportRoute>("app_review");
  const [lastReportId, setLastReportId] = useState<string | null>(null);
  const [reportNotice, setReportNotice] = useState("");
  const [cannotMakeItOpen, setCannotMakeItOpen] = useState(false);
  const [softExitChoice, setSoftExitChoice] = useState<SoftExitChoice | null>(null);
  const [chatPlusOpen, setChatPlusOpen] = useState(false);
  const [selectedFirstMeetupSupport, setSelectedFirstMeetupSupport] = useState<FirstMeetupSupportOption[]>(["No extra support"]);
  const [selectedMeetupQuestion, setSelectedMeetupQuestion] = useState<AskAboutMeetupQuestion | null>(null);
  const softExitMessage = softExitChoice ? copy.softExitPresets[softExitChoice] : null;
  useEffect(() => {
    if (!requestedEventId || !allEvents.some((event) => event.id === requestedEventId)) return;

    setSelectedChatId(requestedEventId);
    setSelectedChatTargetId(`group-${requestedEventId}`);
  }, [requestedEventId]);
  const selectedChat = allEvents.find((event) => event.id === selectedChatId) ?? allEvents.find((event) => event.id === "movie-night-watch-chat") ?? allEvents[0]!;
  const selectedChatTitle = chatEventTitleCopy[selectedChat.id] ?? selectedChat.title;
  const selectedChatMembers = selectedChat.id === "movie-night-watch-chat" ? copy.members : getChatMemberLabel(selectedChat, appLanguageBase);
  const groupChatTargets: ChatTarget[] = allEvents.map((event) => ({
    id: `group-${event.id}`,
    type: "group",
    title: chatEventTitleCopy[event.id] ?? event.title,
    subtitle: `${event.venue} · ${event.id === "movie-night-watch-chat" ? copy.members : getChatMemberLabel(event, appLanguageBase)}`,
    emoji: event.emoji,
    tone: event.imageTone,
    eventId: event.id,
  }));
  const personChatTargets: ChatTarget[] = directChatTargets.map((person) => ({
    id: person.id,
    type: "person",
    title: person.name,
    subtitle: `${chatMenuCopy.privateChat} · ${person.role === "host" ? chatMenuCopy.host : chatMenuCopy.member}`,
    emoji: person.emoji,
    tone: person.tone,
    personId: person.personId,
  }));
  const chatTargets = [...groupChatTargets, ...personChatTargets];
  const selectedChatTarget = selectedChatTargetId ? chatTargets.find((target) => target.id === selectedChatTargetId) : undefined;
  const isPersonChat = selectedChatTarget?.type === "person";
  const activeChatTitle = selectedChatTarget?.title ?? selectedChatTitle;
  const activeChatSubtitle = selectedChatTarget?.subtitle ?? selectedChatMembers;
  const activeChatEmoji = selectedChatTarget?.emoji ?? selectedChat.emoji;
  const activeChatTone = selectedChatTarget?.tone ?? selectedChat.imageTone;
  const activeChatProfile = selectedChatTarget?.type === "person" ? getChatProfilePreview(selectedChatTarget.personId) : undefined;
  const conversationId = selectedChatTarget?.type === "person" ? selectedChatTarget.personId : selectedChat.id;
  const eventId = selectedChat.id;
  const activeMessages =
    selectedChatTarget?.type === "person"
      ? localizeDirectMessages(directMessagesByPerson, appLanguageBase)[selectedChatTarget.personId] ?? []
      : eventMessagesById[selectedChat.id] ?? eventChatSeeds[selectedChat.id] ?? [];
  const previewProfile = getChatProfilePreview(previewPersonId);
  const getMessagePersonId = (message: ChatMessage) =>
    message.personId ??
    directChatTargets.find((person) => person.name === message.name)?.personId ??
    null;
  const hostUserId = "maya-host";
  const isHostBlocked = blockedUserIds.includes(hostUserId);
  const selectedBlockMember = memberBlockTargets.find((target) => target.id === selectedBlockMemberId) ?? memberBlockTargets[0];
  const isSelectedMemberBlocked = selectedBlockMember ? blockedUserIds.includes(selectedBlockMember.id) : false;
  const selectedReportTarget = reportTargets.find((target) => target.id === selectedReportTargetId) ?? reportTargets[0];
  const effectiveReportRoute =
    selectedReportTarget.role === "host" || selectedReportTarget.role === "chat" ? "app_review" : selectedReportRoute;
  const lastReport = lastReportId ? safetyReports.find((report) => report.id === lastReportId) : undefined;
  const canCancelLastReport = Boolean(lastReport && !lastReport.cancelledAt && lastReport.cancelUntil && Date.now() <= Date.parse(lastReport.cancelUntil));

  if (!canUsePrivateChats) {
    return (
      <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
        <View style={[styles.screen, isDay && styles.dayContainer]}>
          <View style={[styles.header, isDay && styles.dayHeader]}>
            <View style={styles.eventAvatar}><Text style={styles.eventEmoji}>💬</Text></View>
            <View style={styles.headerText}>
              <Text style={[styles.title, isDay && styles.dayTitle]}>{trustGateCopy.trustRequiredTitle}</Text>
              <Text style={[styles.subtitle, isDay && styles.dayMutedText]}>{getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase)}</Text>
            </View>
          </View>
          <View style={[styles.trustGateCard, isDay && styles.dayCard]}>
            <Text style={[styles.alphaGuideLabel, isDay && styles.dayAccentText]}>Alpha testing</Text>
            <Text style={[styles.trustGateTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{trustGateCopy.trustRequiredTitle}</Text>
            <Text style={[styles.trustGateCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{trustGateCopy.trustRequiredCopy}</Text>
            <Text style={[styles.trustGateCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
              This gate is a prototype state. No real verification provider or private messaging system is connected yet.
            </Text>
            <Text style={[styles.trustGateStatus, isDay && styles.dayAccentText, isRtl && styles.rtlText]}>
              {getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase)}
            </Text>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push("/(tabs)/profile")} style={styles.trustGateButton} accessibilityRole="button" accessibilityHint={screenReaderHints ? chatCopy.reviewTrustStatusHint : undefined}>
              <Text style={styles.trustGateButtonText}>{trustGateCopy.reviewSettings}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const nextMessage: ChatMessage = { id: String(Date.now()), name: copy.you, avatar: "Y", text: trimmed, time: copy.now, mine: true };

    if (selectedChatTarget?.type === "person") {
      setDirectMessagesByPerson((current) => ({
        ...current,
        [selectedChatTarget.personId]: [...(current[selectedChatTarget.personId] ?? []), nextMessage],
      }));
    } else {
      setEventMessagesById((current) => ({
        ...current,
        [selectedChat.id]: [...(current[selectedChat.id] ?? []), nextMessage],
      }));
    }

    setDraft("");
  };

  const sendArrivalUpdate = (text: string) => {
    setEventMessagesById((current) => ({
      ...current,
      [selectedChat.id]: [
        ...(current[selectedChat.id] ?? []),
        { id: String(Date.now()), name: copy.you, avatar: "Y", text, time: copy.now, mine: true },
      ],
    }));
  };

  const sendRunningLateUpdate = () => {
    sendArrivalUpdate(localizedArrivalUpdateCopy.runningLateMessage(transportationOptionsCopy[transportationMethod]?.label ?? transportationMethod));
  };

  const sendCannotMakeItUpdate = async (reason: CannotMakeItReason) => {
    sendArrivalUpdate(localizedArrivalUpdateCopy.cannotMakeItReasons[reason].message);
    setCannotMakeItOpen(false);
    await saveSoftHelloMvpState({ eventMemberships: leaveEvent(eventId, eventMemberships) });
  };

  const toggleFirstMeetupSupportOption = (option: FirstMeetupSupportOption) => {
    setSelectedFirstMeetupSupport((current) => {
      if (option === "No extra support") return ["No extra support"];

      const selectedWithoutFallback = current.filter((item) => item !== "No extra support");
      const nextSelection = selectedWithoutFallback.includes(option)
        ? selectedWithoutFallback.filter((item) => item !== option)
        : [...selectedWithoutFallback, option];

      return nextSelection.length > 0 ? nextSelection : ["No extra support"];
    });
  };

  const reportConcern = async (reason: SafetyReportReason) => {
    const report = createSafetyReport(conversationId, selectedReportTarget.id, reason, new Date().toISOString(), {
      reportedUserName: selectedReportTarget.name,
      route: effectiveReportRoute,
    });
    await saveSoftHelloMvpState({ safetyReports: [...safetyReports, report] });
    setReportReasonsOpen(false);
    setBlockChoiceOpen(false);
    setLastReportId(report.id);
    setReportNotice(
      effectiveReportRoute === "host_review"
        ? `${reason} about ${selectedReportTarget.name} was sent to the host.`
        : `${reason} about ${selectedReportTarget.name} was submitted for app review.`
    );
    Alert.alert(localizedReportFlowCopy.reportSaved, `${localizedReportFlowCopy.cancelWindow}`);
  };

  const cancelLastReport = async () => {
    if (!lastReportId) return;

    const nextReports = cancelSafetyReport(lastReportId, safetyReports);
    await saveSoftHelloMvpState({ safetyReports: nextReports });
    setReportNotice(localizedReportFlowCopy.reportCancelled);
    setLastReportId(null);
  };

  const saveBlockedHost = async () => {
    await saveSoftHelloMvpState({ blockedUserIds: blockUser(hostUserId, blockedUserIds) });
  };

  const blockHostOnly = async () => {
    await saveBlockedHost();
    setBlockChoiceOpen(false);
    setReportReasonsOpen(false);
    setMemberBlockOpen(false);
    setBlockNotice(copy.blockedSavedCopy);
  };

  const blockHostAndReport = async () => {
    await saveBlockedHost();
    setBlockChoiceOpen(false);
    setMemberBlockOpen(false);
    setSafetyOpen(true);
    setReportReasonsOpen(true);
    setBlockNotice(copy.chooseReportAfterBlock);
  };

  const unblockHost = async () => {
    await saveSoftHelloMvpState({ blockedUserIds: unblockUser(hostUserId, blockedUserIds) });
    setBlockChoiceOpen(false);
    setReportReasonsOpen(false);
    setMemberBlockOpen(false);
    setBlockNotice(copy.unblockedSavedCopy);
  };

  const blockMemberOnly = async () => {
    if (!selectedBlockMember) return;

    await saveSoftHelloMvpState({ blockedUserIds: blockUser(selectedBlockMember.id, blockedUserIds) });
    setBlockChoiceOpen(false);
    setReportReasonsOpen(false);
    setBlockNotice(memberBlockCopy.blockedMemberCopy(selectedBlockMember.name));
  };

  const blockMemberAndReport = async () => {
    if (!selectedBlockMember) return;

    await saveSoftHelloMvpState({ blockedUserIds: blockUser(selectedBlockMember.id, blockedUserIds) });
    setSelectedReportTargetId(selectedBlockMember.id);
    setSelectedReportRoute("host_review");
    setMemberBlockOpen(false);
    setBlockChoiceOpen(false);
    setReportReasonsOpen(true);
    setBlockNotice(copy.chooseReportAfterBlock);
  };

  const unblockMember = async () => {
    if (!selectedBlockMember) return;

    await saveSoftHelloMvpState({ blockedUserIds: unblockUser(selectedBlockMember.id, blockedUserIds) });
    setReportReasonsOpen(false);
    setBlockNotice(memberBlockCopy.unblockedMemberCopy(selectedBlockMember.name));
  };

  const chooseSoftExit = async (choice: SoftExitChoice) => {
    setSoftExitChoice(choice);

    if (choice === "skipToday") {
      await saveSoftHelloMvpState({ eventMemberships: leaveEvent(eventId, eventMemberships) });
    }
  };

  const chooseChat = (target: ChatTarget) => {
    if (target.type === "group") {
      setSelectedChatId(target.eventId);
    }

    setSelectedChatTargetId(target.id);
    setChatMenuOpen(false);
    setSafetyOpen(false);
    setSoftExitOpen(false);
    setReportReasonsOpen(false);
    setBlockChoiceOpen(false);
    setMemberBlockOpen(false);
    setCannotMakeItOpen(false);
    setChatPlusOpen(false);
    setBlockNotice("");
    setReportNotice("");
  };

  const renderChatTargetButton = (target: ChatTarget) => {
    const active = selectedChatTarget?.id === target.id;
    const targetProfile = target.type === "person" ? getChatProfilePreview(target.personId) : undefined;

    return (
      <TouchableOpacity
        key={target.id}
        activeOpacity={0.82}
        onPress={() => chooseChat(target)}
        style={[styles.chatMenuItem, isDay && styles.daySoftExitAction, active && styles.chatMenuItemActive]}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        accessibilityHint={screenReaderHints ? `Opens ${target.type === "person" ? "a private chat with" : "the group chat for"} ${target.title}.` : undefined}
      >
        {target.type === "person" ? (
          <ProfileAvatar
            displayName={target.title}
            avatarText={target.emoji}
            tone={targetProfile?.avatarTone ?? target.tone}
            privateProfile={targetProfile?.avatarPrivate}
            comfortMode={targetProfile?.privacyMode}
            size={40}
            isDay={isDay}
          />
        ) : (
          <View style={[styles.chatMenuEmoji, { backgroundColor: target.tone }]}>
            <Text style={styles.chatMenuEmojiText}>{target.emoji}</Text>
          </View>
        )}
        <View style={styles.chatMenuItemBody}>
          <Text style={[styles.chatMenuItemTitle, isDay && styles.dayTitle, active && styles.chatMenuItemTextActive, isRtl && styles.rtlText]}>{target.title}</Text>
          <Text style={[styles.chatMenuItemMeta, isDay && styles.dayMutedText, active && styles.chatMenuItemTextActive, isRtl && styles.rtlText]}>
            {target.subtitle}
          </Text>
        </View>
        <Text style={[styles.chatMenuStatus, active && styles.chatMenuItemTextActive]}>{active ? "✓" : "›"}</Text>
      </TouchableOpacity>
    );
  };

  if (!selectedChatTarget) {
    return (
      <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
        <View style={[styles.screen, isDay && styles.dayContainer]}>
          <ScrollView style={styles.chat} contentContainerStyle={styles.chatSelectionContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.chatSelectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{chatMenuCopy.landingTitle}</Text>
            <Text style={[styles.chatSelectionCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{chatMenuCopy.landingCopy}</Text>

            <View style={[styles.alphaGuideCard, isDay && styles.dayCard]}>
              <Text style={[styles.alphaGuideLabel, isDay && styles.dayAccentText]}>Alpha testing</Text>
              <Text style={[styles.alphaGuideTitle, isDay && styles.dayTitle]}>Demo conversations</Text>
              <Text style={[styles.alphaGuideCopy, isDay && styles.dayMutedText]}>
                Try switching between group and private chats, sending a local message, and using soft-exit options. Reports, blocks, and private chats are prototype-only.
              </Text>
            </View>

            <Text style={[styles.chatMenuSectionTitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{chatMenuCopy.meetupGroups}</Text>
            <View style={styles.chatSelectionList}>{groupChatTargets.map(renderChatTargetButton)}</View>

            <Text style={[styles.chatMenuSectionTitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{chatMenuCopy.people}</Text>
            <View style={styles.chatSelectionList}>{personChatTargets.map(renderChatTargetButton)}</View>
          </ScrollView>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <View style={[styles.screen, isDay && styles.dayContainer]}>
          <View style={[styles.header, isDay && styles.dayHeader]}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              setSelectedChatTargetId(null);
              setChatMenuOpen(false);
              setSafetyOpen(false);
              setSoftExitOpen(false);
              setCannotMakeItOpen(false);
              setChatPlusOpen(false);
            }}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={chatMenuCopy.openLabel}
            accessibilityHint={screenReaderHints ? chatCopy.backToChatChooserHint : undefined}
          >
            <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.78}
            onPress={() => {
              setChatMenuOpen((current) => !current);
              setSafetyOpen(false);
              setSoftExitOpen(false);
              setChatPlusOpen(false);
            }}
            style={styles.chatPickerButton}
            accessibilityRole="button"
            accessibilityLabel={chatMenuCopy.openLabel}
            accessibilityHint={screenReaderHints ? chatCopy.openChatListHint : undefined}
          >
            {selectedChatTarget.type === "person" ? (
              <ProfileAvatar
                displayName={activeChatTitle}
                avatarText={activeChatEmoji}
                tone={activeChatProfile?.avatarTone ?? activeChatTone}
                privateProfile={activeChatProfile?.avatarPrivate}
                comfortMode={activeChatProfile?.privacyMode}
                size={42}
                isDay={isDay}
              />
            ) : (
              <View style={[styles.eventAvatar, { backgroundColor: activeChatTone }]}><Text style={styles.eventEmoji}>{activeChatEmoji}</Text></View>
            )}
            <View style={styles.headerText}>
              <Text style={[styles.title, isDay && styles.dayTitle]}>{activeChatTitle}</Text>
              <Text style={[styles.subtitle, isDay && styles.dayMutedText]}>{activeChatSubtitle}</Text>
            </View>
            <Text style={[styles.chatPickerChevron, isDay && styles.dayMutedText]}>{chatMenuOpen ? "⌃" : "⌄"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              setSafetyOpen((current) => !current);
              setReportReasonsOpen(false);
              setBlockChoiceOpen(false);
              setMemberBlockOpen(false);
              setSoftExitOpen(false);
              setChatPlusOpen(false);
            }}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={copy.safetyTitle}
            accessibilityHint={screenReaderHints ? chatCopy.safetyOptionsHint : undefined}
          >
            <IconSymbol name="more" color={isDay ? "#0B1220" : nsnColors.text} size={21} />
          </TouchableOpacity>
          {!isPersonChat ? (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => {
                setSoftExitOpen((current) => !current);
                setSafetyOpen(false);
                setMemberBlockOpen(false);
                setChatPlusOpen(false);
              }}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel={copy.softExitTitle}
              accessibilityHint={screenReaderHints ? chatCopy.softExitHint : undefined}
            >
              <IconSymbol name="settings" color={isDay ? "#0B1220" : nsnColors.text} size={21} />
            </TouchableOpacity>
          ) : null}
        </View>

        {chatMenuOpen ? (
          <View style={[styles.chatMenu, isDay && styles.dayCard]}>
            <Text style={[styles.chatMenuTitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{chatMenuCopy.title}</Text>
            <ScrollView style={styles.chatMenuList} contentContainerStyle={styles.chatMenuListContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.chatMenuSectionTitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{chatMenuCopy.meetupGroups}</Text>
              {groupChatTargets.map(renderChatTargetButton)}
              <Text style={[styles.chatMenuSectionTitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{chatMenuCopy.people}</Text>
              {personChatTargets.map(renderChatTargetButton)}
            </ScrollView>
          </View>
        ) : null}

        <ScrollView style={styles.chat} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false} scrollEnabled={!chatMenuOpen}>
          <View style={[styles.alphaGuideCard, isDay && styles.dayCard]}>
            <Text style={[styles.alphaGuideLabel, isDay && styles.dayAccentText]}>Alpha testing</Text>
            <Text style={[styles.alphaGuideCopy, isDay && styles.dayMutedText]}>
              Messages stay in this prototype session. Try the tone, arrival updates, and soft exit controls without treating this as a live chat.
            </Text>
          </View>
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
                  onPress={() => setReportReasonsOpen((current) => !current)}
                  style={[styles.softExitAction, isDay && styles.daySoftExitAction]}
                >
                  <Text style={[styles.softExitActionText, isDay && styles.dayTitle]}>{copy.reportConcern}</Text>
                  <Text style={[styles.softExitActionCopy, isDay && styles.dayMutedText]}>{copy.reportConcernCopy}</Text>
                </TouchableOpacity>
                {reportReasonsOpen ? (
                  <View style={styles.reportReasonStack}>
                    <Text style={[styles.reportReasonHeading, isDay && styles.dayMutedText]}>{localizedReportFlowCopy.targetTitle}</Text>
                    <View style={styles.reportTargetGrid}>
                      {reportTargets.map((target) => {
                        const active = selectedReportTarget.id === target.id;
                        const roleLabel =
                          target.role === "host"
                            ? localizedReportFlowCopy.hostRole
                            : target.role === "member"
                              ? localizedReportFlowCopy.memberRole
                              : localizedReportFlowCopy.chatRole;

                        return (
                          <TouchableOpacity
                            key={target.id}
                            activeOpacity={0.82}
                            onPress={() => {
                              setSelectedReportTargetId(target.id);
                              if (target.role !== "member") setSelectedReportRoute("app_review");
                            }}
                            style={[
                              styles.reportTargetButton,
                              isDay && styles.dayReportReasonButton,
                              active && styles.reportTargetButtonActive,
                            ]}
                            accessibilityRole="button"
                            accessibilityState={{ selected: active }}
                          >
                            <Text style={[styles.reportTargetName, isDay && styles.dayTitle, active && styles.reportTargetTextActive]}>{target.name}</Text>
                            <Text style={[styles.reportTargetRole, isDay && styles.dayMutedText, active && styles.reportTargetTextActive]}>{roleLabel}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    {selectedReportTarget.role === "member" ? (
                      <>
                        <Text style={[styles.reportReasonHeading, isDay && styles.dayMutedText]}>{localizedReportFlowCopy.routeTitle}</Text>
                        <View style={styles.reportRouteStack}>
                          {([
                            { value: "host_review" as SafetyReportRoute, label: localizedReportFlowCopy.reportToHost, copy: localizedReportFlowCopy.reportToHostCopy },
                            { value: "app_review" as SafetyReportRoute, label: localizedReportFlowCopy.appReview, copy: localizedReportFlowCopy.appReviewCopy },
                          ]).map((route) => {
                            const active = selectedReportRoute === route.value;

                            return (
                              <TouchableOpacity
                                key={route.value}
                                activeOpacity={0.82}
                                onPress={() => setSelectedReportRoute(route.value)}
                                style={[styles.reportRouteButton, isDay && styles.dayReportReasonButton, active && styles.reportTargetButtonActive]}
                                accessibilityRole="button"
                                accessibilityState={{ selected: active }}
                              >
                                <Text style={[styles.reportReasonText, isDay && styles.dayTitle, active && styles.reportTargetTextActive]}>{route.label}</Text>
                                <Text style={[styles.reportReasonCopy, isDay && styles.dayMutedText, active && styles.reportTargetTextActive]}>{route.copy}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </>
                    ) : (
                      <View style={[styles.reportRouteButton, isDay && styles.dayReportReasonButton]}>
                        <Text style={[styles.reportReasonText, isDay && styles.dayTitle]}>{localizedReportFlowCopy.appReview}</Text>
                        <Text style={[styles.reportReasonCopy, isDay && styles.dayMutedText]}>{localizedReportFlowCopy.appReviewCopy}</Text>
                      </View>
                    )}
                    <Text style={[styles.reportReasonHeading, isDay && styles.dayMutedText]}>{copy.escalationReasons}</Text>
                    {escalationReportReasons.map((option) => {
                      const localizedOption = localizedSafetyReasons[option.reason] ?? { label: option.reason, copy: option.copy };

                      return (
                        <TouchableOpacity
                          key={option.reason}
                          activeOpacity={0.82}
                          onPress={() => reportConcern(option.reason)}
                          style={[styles.reportReasonButton, isDay && styles.dayReportReasonButton]}
                          accessibilityRole="button"
                          accessibilityLabel={`Report ${option.reason}`}
                        >
                          <Text style={[styles.reportReasonText, isDay && styles.dayTitle]}>{localizedOption.label}</Text>
                          <Text style={[styles.reportReasonCopy, isDay && styles.dayMutedText]}>{localizedOption.copy}</Text>
                        </TouchableOpacity>
                      );
                    })}
                    <Text style={[styles.reportReasonHeading, isDay && styles.dayMutedText]}>{copy.otherReportReasons}</Text>
                    {otherReportReasons.map((option) => {
                      const localizedOption = localizedSafetyReasons[option.reason] ?? { label: option.reason, copy: option.copy };

                      return (
                        <TouchableOpacity
                          key={option.reason}
                          activeOpacity={0.82}
                          onPress={() => reportConcern(option.reason)}
                          style={[styles.reportReasonButton, isDay && styles.dayReportReasonButton]}
                          accessibilityRole="button"
                          accessibilityLabel={`Report ${option.reason}`}
                        >
                          <Text style={[styles.reportReasonText, isDay && styles.dayTitle]}>{localizedOption.label}</Text>
                          <Text style={[styles.reportReasonCopy, isDay && styles.dayMutedText]}>{localizedOption.copy}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
                {reportNotice ? (
                  <View style={[styles.softExitResult, isDay && styles.daySoftExitResult]}>
                    <Text style={[styles.softExitResultText, isDay && styles.dayTitle]}>{reportNotice}</Text>
                    {canCancelLastReport ? (
                      <TouchableOpacity activeOpacity={0.82} onPress={cancelLastReport} style={styles.cancelReportButton}>
                        <Text style={styles.cancelReportText}>{localizedReportFlowCopy.cancelReport}</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={[styles.softExitResultSubtext, isDay && styles.dayMutedText]}>{localizedReportFlowCopy.cancelWindow}</Text>
                    )}
                  </View>
                ) : null}
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => {
                    setMemberBlockOpen((current) => !current);
                    setReportReasonsOpen(false);
                    setBlockChoiceOpen(false);
                    setBlockNotice("");
                  }}
                  style={[styles.softExitAction, isDay && styles.daySoftExitAction]}
                >
                  <Text style={[styles.softExitActionText, isDay && styles.dayTitle]}>
                    {isSelectedMemberBlocked ? memberBlockCopy.unblockMember : memberBlockCopy.blockMember}
                  </Text>
                  <Text style={[styles.softExitActionCopy, isDay && styles.dayMutedText]}>
                    {isSelectedMemberBlocked ? memberBlockCopy.unblockMemberCopy : memberBlockCopy.blockMemberCopy}
                  </Text>
                </TouchableOpacity>
                {memberBlockOpen ? (
                  <View style={[styles.blockChoiceCard, isDay && styles.dayReportReasonButton]}>
                    <Text style={[styles.blockChoiceTitle, isDay && styles.dayTitle]}>{memberBlockCopy.chooseMember}</Text>
                    <View style={styles.reportTargetGrid}>
                      {memberBlockTargets.map((target) => {
                        const active = selectedBlockMember?.id === target.id;
                        const blocked = blockedUserIds.includes(target.id);

                        return (
                          <TouchableOpacity
                            key={target.id}
                            activeOpacity={0.82}
                            onPress={() => {
                              setSelectedBlockMemberId(target.id);
                              setBlockNotice("");
                            }}
                            style={[
                              styles.reportTargetButton,
                              isDay && styles.dayReportReasonButton,
                              active && styles.reportTargetButtonActive,
                            ]}
                            accessibilityRole="button"
                            accessibilityState={{ selected: active }}
                          >
                            <Text style={[styles.reportTargetName, isDay && styles.dayTitle, active && styles.reportTargetTextActive]}>{target.name}</Text>
                            <Text style={[styles.reportTargetRole, isDay && styles.dayMutedText, active && styles.reportTargetTextActive]}>
                              {blocked ? memberBlockCopy.unblockMember : localizedReportFlowCopy.memberRole}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <View style={styles.blockChoiceActions}>
                      {isSelectedMemberBlocked ? (
                        <TouchableOpacity activeOpacity={0.82} onPress={unblockMember} style={[styles.blockChoiceButton, isDay && styles.daySoftExitAction]}>
                          <Text style={[styles.blockChoiceButtonText, isDay && styles.dayTitle]}>{memberBlockCopy.unblockMember}</Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TouchableOpacity activeOpacity={0.82} onPress={blockMemberOnly} style={[styles.blockChoiceButton, isDay && styles.daySoftExitAction]}>
                            <Text style={[styles.blockChoiceButtonText, isDay && styles.dayTitle]}>{copy.blockOnly}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity activeOpacity={0.82} onPress={blockMemberAndReport} style={[styles.blockChoiceButton, styles.blockChoiceButtonDanger]}>
                            <Text style={styles.blockChoiceButtonTextDanger}>{copy.blockAndReport}</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                ) : null}
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={
                    isHostBlocked
                      ? unblockHost
                      : () => {
                          setBlockChoiceOpen((current) => !current);
                          setReportReasonsOpen(false);
                          setMemberBlockOpen(false);
                          setBlockNotice("");
                        }
                  }
                  style={[styles.softExitAction, isDay && styles.daySoftExitAction]}
                >
                  <Text style={[styles.softExitActionText, isDay && styles.dayTitle]}>{isHostBlocked ? copy.unblockHost : copy.blockHost}</Text>
                  <Text style={[styles.softExitActionCopy, isDay && styles.dayMutedText]}>{isHostBlocked ? copy.unblockHostCopy : copy.blockHostCopy}</Text>
                </TouchableOpacity>
                {blockChoiceOpen && !isHostBlocked ? (
                  <View style={[styles.blockChoiceCard, isDay && styles.dayReportReasonButton]}>
                    <Text style={[styles.blockChoiceTitle, isDay && styles.dayTitle]}>{copy.blockChoiceTitle}</Text>
                    <Text style={[styles.blockChoiceCopy, isDay && styles.dayMutedText]}>{copy.blockChoiceCopy}</Text>
                    <View style={styles.blockChoiceActions}>
                      <TouchableOpacity activeOpacity={0.82} onPress={blockHostOnly} style={[styles.blockChoiceButton, isDay && styles.daySoftExitAction]}>
                        <Text style={[styles.blockChoiceButtonText, isDay && styles.dayTitle]}>{copy.blockOnly}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.82} onPress={blockHostAndReport} style={[styles.blockChoiceButton, styles.blockChoiceButtonDanger]}>
                        <Text style={styles.blockChoiceButtonTextDanger}>{copy.blockAndReport}</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => setBlockChoiceOpen(false)} style={styles.blockCancelButton}>
                      <Text style={[styles.blockCancelText, isDay && styles.dayMutedText]}>{copy.cancel}</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {blockNotice ? (
                  <View style={[styles.softExitResult, isDay && styles.daySoftExitResult]}>
                    <Text style={[styles.softExitResultText, isDay && styles.dayTitle]}>{isHostBlocked ? copy.blockedSaved : copy.unblockedSaved}</Text>
                    <Text style={[styles.softExitResultSubtext, isDay && styles.dayMutedText]}>{blockNotice}</Text>
                  </View>
                ) : null}
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

          {activeMessages.map((message) => {
            const personId = getMessagePersonId(message);
            const profile = getChatProfilePreview(personId);

            return (
              <View key={message.id} style={[styles.messageRow, message.mine && styles.messageRowMine]}>
                {!message.mine ? (
                  <TouchableOpacity
                    activeOpacity={0.78}
                    disabled={!personId}
                    onPress={() => personId && setPreviewPersonId(personId)}
                    style={styles.avatarButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Preview ${message.name}'s profile`}
                  >
                    <ProfileAvatar
                      displayName={message.name}
                      avatarText={message.avatar}
                      tone={profile?.avatarTone ?? "#164E6A"}
                      privateProfile={profile?.avatarPrivate}
                      comfortMode={profile?.privacyMode}
                      size={34}
                      isDay={isDay}
                    />
                  </TouchableOpacity>
                ) : null}
                <View style={[styles.messageBlock, message.mine && styles.messageBlockMine]}>
                  {!message.mine && <Text style={[styles.senderName, isDay && styles.dayMutedText]}>{message.name}</Text>}
                  <View style={[styles.bubble, message.mine ? styles.myBubble : styles.theirBubble, isDay && !message.mine && styles.dayCard]}>
                    <Text style={[styles.bubbleText, isDay && !message.mine && styles.dayTitle]}>{translatedMessages?.[message.id as keyof typeof translatedMessages] ?? message.text}</Text>
                    <Text style={[styles.messageTime, isDay && !message.mine && styles.dayMessageTime]}>{message.time}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.composerWrap}>
          {!isPersonChat ? <View style={[styles.arrivalPanel, isDay && styles.dayCard]}>
            <Text style={[styles.arrivalTitle, isDay && styles.dayTitle]}>{localizedArrivalUpdateCopy.title}</Text>
            <View style={styles.arrivalActions}>
              <TouchableOpacity activeOpacity={0.82} onPress={sendRunningLateUpdate} style={styles.arrivalButton}>
                <Text style={styles.arrivalButtonText}>{localizedArrivalUpdateCopy.runningLate}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => setCannotMakeItOpen((current) => !current)}
                style={[styles.arrivalButton, styles.arrivalButtonMuted]}
              >
                <Text style={[styles.arrivalButtonText, styles.arrivalButtonMutedText, isDay && styles.dayArrivalButtonMutedText]}>
                  {localizedArrivalUpdateCopy.cannotMakeIt}
                </Text>
              </TouchableOpacity>
            </View>
            {cannotMakeItOpen ? (
              <View style={styles.cannotMakeItPanel}>
                <Text style={[styles.cannotMakeItTitle, isDay && styles.dayTitle]}>{localizedArrivalUpdateCopy.cannotMakeItReasonTitle}</Text>
                <View style={styles.cannotMakeItGrid}>
                  {(Object.keys(localizedArrivalUpdateCopy.cannotMakeItReasons) as CannotMakeItReason[]).map((reason) => (
                    <TouchableOpacity
                      key={reason}
                      activeOpacity={0.82}
                      onPress={() => sendCannotMakeItUpdate(reason)}
                      style={[styles.cannotMakeItReasonButton, isDay && styles.dayCannotMakeItReasonButton]}
                    >
                      <Text style={[styles.cannotMakeItReasonText, isDay && styles.dayTitle]}>
                        {localizedArrivalUpdateCopy.cannotMakeItReasons[reason].label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}
          </View> : null}
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
          {chatPlusOpen ? (
            <View style={[styles.chatPlusPanel, isDay && styles.dayCard]}>
              <Text style={[styles.chatPlusTitle, isDay && styles.dayTitle]}>Prototype meetup tools</Text>
              <Text style={[styles.chatPlusCopy, isDay && styles.dayMutedText]}>
                Local helper chips only. Reports, blocks, leaving, or emergency help stay in the safety menu.
              </Text>
              <Text style={[styles.chatPlusSectionLabel, isDay && styles.dayMutedText]}>First meetup support</Text>
              <View style={styles.chatPlusChipRow}>
                {firstMeetupSupportOptions.map((option) => {
                  const active = selectedFirstMeetupSupport.includes(option.label);

                  return (
                    <TouchableOpacity
                      key={option.label}
                      activeOpacity={0.82}
                      onPress={() => toggleFirstMeetupSupportOption(option.label)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={option.label}
                      accessibilityHint={option.description}
                      style={[styles.chatPlusChip, isDay && styles.daySoftExitAction, active && styles.chatPlusChipActive]}
                    >
                      <Text style={[styles.chatPlusChipText, isDay && styles.dayTitle, active && styles.chatPlusChipTextActive]}>{option.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={[styles.chatPlusMeta, isDay && styles.dayMutedText]}>
                Current: {getFirstMeetupSupportSummary(selectedFirstMeetupSupport)}
              </Text>
              {askAboutMeetupQuestionGroups.map((group) => (
                <View key={group.phase} style={styles.chatPlusQuestionGroup}>
                  <Text style={[styles.chatPlusSectionLabel, isDay && styles.dayMutedText]}>{group.title}</Text>
                  <View style={styles.chatPlusChipRow}>
                    {group.questions.map((question) => {
                      const active = selectedMeetupQuestion === question;

                      return (
                        <TouchableOpacity
                          key={question}
                          activeOpacity={0.82}
                          onPress={() => {
                            setSelectedMeetupQuestion(question);
                            setDraft(question);
                          }}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                          accessibilityLabel={question}
                          accessibilityHint="Adds this pre-written demo question to the composer."
                          style={[styles.chatPlusQuestionChip, isDay && styles.daySoftExitAction, active && styles.chatPlusChipActive]}
                        >
                          <Text style={[styles.chatPlusQuestionText, isDay && styles.dayTitle, active && styles.chatPlusChipTextActive]}>{question}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
              {selectedMeetupQuestion ? (
                <Text style={[styles.chatPlusMeta, isDay && styles.dayMutedText]}>Added to composer: {selectedMeetupQuestion}</Text>
              ) : null}
            </View>
          ) : null}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              setChatPlusOpen((current) => !current);
              setSafetyOpen(false);
              setSoftExitOpen(false);
            }}
            accessibilityRole="button"
            accessibilityLabel="Open prototype meetup tools"
            accessibilityHint="Opens local first meetup support and ask-about-this-meetup chips."
            style={[styles.addButton, isDay && styles.dayCard, chatPlusOpen && styles.addButtonActive]}
          >
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
      <ChatProfilePreviewSheet
        visible={Boolean(previewProfile)}
        profile={previewProfile}
        isDay={isDay}
        onClose={() => setPreviewPersonId(null)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background, paddingHorizontal: 18 },
  dayContainer: { backgroundColor: "#E8EDF2" },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 8, paddingBottom: 12, borderBottomWidth: 1, borderColor: nsnColors.border },
  dayHeader: { borderColor: "#C5D0DA" },
  eventAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#26133F", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.primary },
  eventEmoji: { fontSize: 22 },
  chatPickerButton: { flex: 1, minHeight: 46, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 16, paddingRight: 8 },
  headerText: { flex: 1 },
  title: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 21 },
  dayTitle: { color: "#0B1220" },
  subtitle: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  dayMutedText: { color: "#53677A" },
  dayAccentText: { color: "#445E93" },
  chatPickerChevron: { width: 20, color: nsnColors.muted, fontSize: 18, fontWeight: "900", lineHeight: 22, textAlign: "center" },
  iconButton: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  chatMenu: { maxHeight: 360, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 10, marginTop: 10, marginBottom: 8 },
  chatMenuTitle: { color: nsnColors.muted, fontSize: 12, fontWeight: "900", lineHeight: 17, marginBottom: 8 },
  chatMenuSectionTitle: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15, marginTop: 4, marginBottom: 6, textTransform: "uppercase" },
  chatMenuList: { maxHeight: 300 },
  chatMenuListContent: { gap: 8 },
  chatMenuItem: { minHeight: 64, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", flexDirection: "row", alignItems: "center", gap: 10, padding: 10 },
  chatMenuItemActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  chatMenuEmoji: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  chatMenuEmojiText: { fontSize: 20 },
  chatMenuItemBody: { flex: 1 },
  chatMenuItemTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  chatMenuItemMeta: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  chatMenuStatus: { width: 20, color: nsnColors.muted, fontSize: 16, fontWeight: "900", textAlign: "center" },
  chatMenuItemTextActive: { color: "#FFFFFF" },
  chat: { flex: 1 },
  chatContent: { paddingTop: 16, paddingBottom: 96 },
  chatSelectionContent: { paddingTop: 22, paddingBottom: 112 },
  chatSelectionTitle: { color: nsnColors.text, fontSize: 28, fontWeight: "900", lineHeight: 35 },
  chatSelectionCopy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginTop: 4, marginBottom: 18 },
  chatSelectionList: { gap: 8, marginBottom: 18 },
  alphaGuideCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", padding: 14, marginBottom: 14 },
  alphaGuideLabel: { color: nsnColors.day, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  alphaGuideTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20, marginTop: 2 },
  alphaGuideCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  dayPill: { alignSelf: "center", backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 13, paddingVertical: 7, borderRadius: 15, marginBottom: 14 },
  dayPillLight: { backgroundColor: "#EEF3F4" },
  dayPillText: { color: nsnColors.muted, fontSize: 12, fontWeight: "700" },
  systemNotice: { alignSelf: "center", width: "68%", borderRadius: 16, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, paddingVertical: 12, paddingHorizontal: 13, marginBottom: 18 },
  dayCard: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  systemText: { color: nsnColors.text, textAlign: "center", fontSize: 12, lineHeight: 17 },
  systemSubtext: { color: nsnColors.muted, textAlign: "center", fontSize: 12, lineHeight: 17 },
  trustGateCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 16, marginTop: 16 },
  trustGateTitle: { color: nsnColors.text, fontSize: 17, fontWeight: "900", lineHeight: 23 },
  trustGateCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 20, marginTop: 6, marginBottom: 10 },
  trustGateStatus: { color: nsnColors.day, fontSize: 12, fontWeight: "900", lineHeight: 17, marginBottom: 12 },
  trustGateButton: { width: "100%", minHeight: 46, borderRadius: 15, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 14, paddingVertical: 10 },
  trustGateButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", lineHeight: 20, textAlign: "center" },
  softExitPanel: { borderRadius: 18, backgroundColor: "#0D1B2F", borderWidth: 1, borderColor: "#2B4578", padding: 14, marginBottom: 18 },
  daySoftExitPanel: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  softExitTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "800", lineHeight: 21, marginBottom: 4 },
  softExitCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19, marginBottom: 12 },
  softExitActions: { gap: 9 },
  softExitAction: { borderRadius: 14, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, paddingHorizontal: 12, paddingVertical: 10 },
  daySoftExitAction: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  softExitActionText: { color: nsnColors.text, fontSize: 13, fontWeight: "800", lineHeight: 18 },
  softExitActionCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 1 },
  reportReasonStack: { gap: 8, paddingTop: 2, paddingBottom: 3 },
  reportReasonHeading: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15, letterSpacing: 0, textTransform: "uppercase" },
  reportReasonButton: { borderRadius: 12, backgroundColor: "rgba(255,255,255,0.035)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", paddingHorizontal: 11, paddingVertical: 9 },
  dayReportReasonButton: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  reportReasonText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  reportReasonCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  reportTargetGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  reportTargetButton: { flexGrow: 1, minWidth: 118, minHeight: 50, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.035)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", paddingHorizontal: 10, paddingVertical: 8 },
  reportTargetButtonActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  reportTargetName: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  reportTargetRole: { color: nsnColors.muted, fontSize: 11, fontWeight: "800", lineHeight: 15, marginTop: 1 },
  reportTargetTextActive: { color: "#FFFFFF" },
  reportRouteStack: { gap: 8 },
  reportRouteButton: { borderRadius: 12, backgroundColor: "rgba(255,255,255,0.035)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", paddingHorizontal: 11, paddingVertical: 9 },
  cancelReportButton: { alignSelf: "flex-start", minHeight: 34, borderRadius: 999, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 12, marginTop: 9 },
  cancelReportText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900", lineHeight: 17 },
  blockChoiceCard: { borderRadius: 14, backgroundColor: "rgba(255,255,255,0.035)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", padding: 12, gap: 8 },
  blockChoiceTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  blockChoiceCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  blockChoiceActions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  blockChoiceButton: { flex: 1, minWidth: 130, minHeight: 40, borderRadius: 12, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 },
  blockChoiceButtonDanger: { backgroundColor: "#B42318", borderColor: "#B42318" },
  blockChoiceButtonText: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17, textAlign: "center" },
  blockChoiceButtonTextDanger: { color: "#FFFFFF", fontSize: 12, fontWeight: "900", lineHeight: 17, textAlign: "center" },
  blockCancelButton: { minHeight: 30, alignItems: "center", justifyContent: "center" },
  blockCancelText: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", lineHeight: 17 },
  softExitResult: { borderRadius: 14, backgroundColor: "rgba(114,214,126,0.11)", borderWidth: 1, borderColor: "rgba(114,214,126,0.28)", padding: 12 },
  daySoftExitResult: { backgroundColor: "#E9F7ED", borderColor: "#A8D9B5" },
  softExitResultText: { color: nsnColors.text, fontSize: 13, fontWeight: "800", lineHeight: 19 },
  softExitResultSubtext: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 4 },
  messageRow: { flexDirection: "row", gap: 9, marginBottom: 14, alignItems: "flex-end" },
  messageRowMine: { justifyContent: "flex-end" },
  avatarButton: { width: 34, height: 34, borderRadius: 17 },
  messageBlock: { maxWidth: "76%" },
  messageBlockMine: { alignItems: "flex-end" },
  senderName: { color: nsnColors.muted, fontSize: 12, marginBottom: 4, lineHeight: 16 },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 8 },
  theirBubble: { backgroundColor: nsnColors.surface, borderTopLeftRadius: 8 },
  myBubble: { backgroundColor: nsnColors.primary, borderBottomRightRadius: 8 },
  bubbleText: { color: nsnColors.text, fontSize: 14, lineHeight: 20 },
  messageTime: { alignSelf: "flex-end", color: "rgba(245,247,255,0.62)", fontSize: 11, marginTop: 4, lineHeight: 14 },
  dayMessageTime: { color: "#7890AE" },
  composerWrap: { paddingBottom: 96 },
  arrivalPanel: { borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 10, marginBottom: 9 },
  arrivalTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17, marginBottom: 8 },
  arrivalActions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  arrivalButton: { flex: 1, minWidth: 130, minHeight: 38, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: nsnColors.primary, paddingHorizontal: 10 },
  arrivalButtonMuted: { backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: nsnColors.border },
  arrivalButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900", lineHeight: 17, textAlign: "center" },
  arrivalButtonMutedText: { color: nsnColors.text },
  dayArrivalButtonMutedText: { color: "#0B1220" },
  cannotMakeItPanel: { gap: 8, marginTop: 10 },
  cannotMakeItTitle: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  cannotMakeItGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  cannotMakeItReasonButton: { flexGrow: 1, minWidth: 150, minHeight: 36, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.06)", alignItems: "center", justifyContent: "center", paddingHorizontal: 10 },
  dayCannotMakeItReasonButton: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  cannotMakeItReasonText: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17, textAlign: "center" },
  resumeButton: { minHeight: 40, borderRadius: 16, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, alignItems: "center", justifyContent: "center", marginBottom: 9 },
  resumeButtonText: { color: nsnColors.text, fontSize: 13, fontWeight: "800" },
  chatPlusPanel: { borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 10, marginBottom: 9, gap: 8 },
  chatPlusTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  chatPlusCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 16 },
  chatPlusSectionLabel: { color: nsnColors.muted, fontSize: 10, fontWeight: "900", lineHeight: 14, textTransform: "uppercase" },
  chatPlusChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  chatPlusChip: { minHeight: 34, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 7 },
  chatPlusQuestionGroup: { gap: 6 },
  chatPlusQuestionChip: { minHeight: 34, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, paddingVertical: 7 },
  chatPlusChipActive: { borderColor: nsnColors.primary, backgroundColor: nsnColors.primary },
  chatPlusChipText: { color: nsnColors.text, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  chatPlusQuestionText: { color: nsnColors.text, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  chatPlusChipTextActive: { color: "#FFFFFF" },
  chatPlusMeta: { color: nsnColors.muted, fontSize: 11, fontWeight: "800", lineHeight: 15 },
  addButtonActive: { borderColor: nsnColors.primary, backgroundColor: "rgba(80,104,255,0.18)" },
  addButton: { position: "absolute", left: 0, bottom: 42, width: 40, height: 40, borderRadius: 20, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.border },
  inputWrap: { marginLeft: 48, minHeight: 44, borderRadius: 22, backgroundColor: "#061121", borderWidth: 1, borderColor: nsnColors.border, flexDirection: "row", alignItems: "center", paddingLeft: 15, paddingRight: 5 },
  dayInputWrap: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  input: { flex: 1, color: nsnColors.text, fontSize: 14, minHeight: 42 },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  rtlInput: { paddingRight: 2, writingDirection: "rtl" },
  sendButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center" },
  disclaimer: { color: nsnColors.muted, fontSize: 11, textAlign: "center", marginTop: 8, lineHeight: 15 },
});
