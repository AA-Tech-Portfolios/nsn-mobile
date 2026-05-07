import { allEvents, type EventItem } from "./nsn-data";

export type SoftHelloComfortPreference = "Small groups" | "Text-first" | "Quiet" | "Flexible pace" | "Indoor backup";

export type SoftHelloVerificationLevel = "Unverified" | "Contact Verified" | "Real Person Verified";

export type EventMembershipStatus = "none" | "joined" | "left";

export type EventMembership = {
  eventId: string;
  status: EventMembershipStatus;
  joinedAt?: string;
  leftAt?: string;
};

export type SafetyReportReason = "Safety concern" | "Harassment" | "Fake profile" | "Underage concern" | "Spam" | "Other";

export type SafetyReport = {
  id: string;
  eventId: string;
  reportedUserId: string;
  reason: SafetyReportReason;
  createdAt: string;
};

export type PostEventFeedback = {
  eventId: string;
  comfort: "Good" | "Mixed" | "Unsafe";
  wouldMeetAgain: boolean;
  createdAt: string;
};

export type SavedPlace = {
  id: string;
  venue: string;
  category: string;
  sourceEventId: string;
  sourceEventTitle: string;
  weather: string;
  savedAt: string;
};

export const defaultComfortPreferences: SoftHelloComfortPreference[] = ["Small groups", "Text-first", "Quiet"];

export const verificationLevels: SoftHelloVerificationLevel[] = ["Unverified", "Contact Verified", "Real Person Verified"];

export const verificationRank: Record<SoftHelloVerificationLevel, number> = {
  Unverified: 0,
  "Contact Verified": 1,
  "Real Person Verified": 2,
};

export function canMeetInPerson(level: SoftHelloVerificationLevel) {
  return verificationRank[level] >= verificationRank["Real Person Verified"];
}

const meetingSafetyCopyTranslations: Record<string, Record<SoftHelloVerificationLevel, string>> = {
  English: {
    Unverified: "You can browse and prepare, but meeting in person requires Real Person Verified status.",
    "Contact Verified": "Contact Verified users can chat, but in-person meetups require Real Person Verified status.",
    "Real Person Verified": "You are marked Real Person Verified in this prototype, so this meetup can move toward an in-person plan.",
  },
  Arabic: {
    Unverified: "يمكنك التصفح والاستعداد، لكن اللقاءات الشخصية تتطلب حالة شخص حقيقي موثق.",
    "Contact Verified": "يمكن للمستخدمين الموثقين عبر التواصل الدردشة، لكن اللقاءات الشخصية تتطلب حالة شخص حقيقي موثق.",
    "Real Person Verified": "أنت موثق كشخص حقيقي في هذا النموذج، لذلك يمكن لهذا اللقاء الانتقال نحو خطة شخصية.",
  },
  Chinese: {
    Unverified: "你可以浏览和准备，但线下见面需要完成真人验证。",
    "Contact Verified": "已验证联系方式的用户可以聊天，但线下聚会需要真人验证状态。",
    "Real Person Verified": "你在此原型中已标记为真人验证，因此这个聚会可以进入线下计划。",
  },
  French: {
    Unverified: "Vous pouvez parcourir et préparer, mais les rencontres en personne nécessitent le statut Personne réelle vérifiée.",
    "Contact Verified": "Les personnes avec contact vérifié peuvent discuter, mais les rencontres en personne nécessitent le statut Personne réelle vérifiée.",
    "Real Person Verified": "Vous êtes marqué comme Personne réelle vérifiée dans ce prototype, donc cette rencontre peut avancer vers un plan en personne.",
  },
  German: {
    Unverified: "Du kannst stöbern und dich vorbereiten, aber persönliche Treffen erfordern den Status Echtperson verifiziert.",
    "Contact Verified": "Personen mit Kontaktverifizierung können chatten, aber persönliche Treffen erfordern den Status Echtperson verifiziert.",
    "Real Person Verified": "Du bist in diesem Prototyp als Echtperson verifiziert markiert, daher kann dieses Treffen zu einem persönlichen Plan werden.",
  },
  Hebrew: {
    Unverified: "אפשר לעיין ולהתכונן, אבל מפגש פנים אל פנים דורש סטטוס אימות אדם אמיתי.",
    "Contact Verified": "משתמשים עם אימות קשר יכולים לשוחח, אבל מפגשים פנים אל פנים דורשים סטטוס אימות אדם אמיתי.",
    "Real Person Verified": "את/ה מסומן/ת באב הטיפוס כאדם אמיתי מאומת, ולכן המפגש יכול להתקדם לתוכנית פנים אל פנים.",
  },
  Japanese: {
    Unverified: "閲覧や準備はできますが、対面のミートアップには真人確認済みステータスが必要です。",
    "Contact Verified": "連絡先確認済みのユーザーはチャットできますが、対面のミートアップには真人確認済みステータスが必要です。",
    "Real Person Verified": "このプロトタイプでは真人確認済みとして表示されているため、このミートアップは対面の計画に進めます。",
  },
  Korean: {
    Unverified: "둘러보고 준비할 수는 있지만, 직접 만나는 모임에는 실제 사람 인증 상태가 필요해요.",
    "Contact Verified": "연락처 인증 사용자는 채팅할 수 있지만, 직접 만나는 모임에는 실제 사람 인증 상태가 필요해요.",
    "Real Person Verified": "이 프로토타입에서 실제 사람 인증으로 표시되어 있어 이 모임은 대면 계획으로 이어질 수 있어요.",
  },
  Russian: {
    Unverified: "Вы можете просматривать и готовиться, но для личных встреч нужен статус подтверждённого реального человека.",
    "Contact Verified": "Пользователи с подтверждённым контактом могут общаться, но для личных встреч нужен статус подтверждённого реального человека.",
    "Real Person Verified": "В этом прототипе вы отмечены как подтверждённый реальный человек, поэтому встреча может перейти к очному плану.",
  },
  Spanish: {
    Unverified: "Puedes explorar y prepararte, pero las quedadas en persona requieren estado de Persona real verificada.",
    "Contact Verified": "Las personas con contacto verificado pueden chatear, pero las quedadas en persona requieren estado de Persona real verificada.",
    "Real Person Verified": "Estás marcado como Persona real verificada en este prototipo, así que esta quedada puede avanzar hacia un plan presencial.",
  },
  Yiddish: {
    Unverified: "דו קענסט דורכקוקן און זיך גרייטן, אבער טרעפן זיך פנים-אל-פנים פארלאנגט סטאטוס פון באשטעטיגטער אמתער מענטש.",
    "Contact Verified": "באנוצער מיט באשטעטיגטן קאנטאקט קענען שמועסן, אבער פנים-אל-פנים מיטאפס פארלאנגען סטאטוס פון באשטעטיגטער אמתער מענטש.",
    "Real Person Verified": "דו ביסט אנגעצייכנט אלס באשטעטיגטער אמתער מענטש אין דעם פראטאטייפ, דעריבער קען דער מיטאפ גיין צו א פנים-אל-פנים פלאן.",
  },
};

const verificationLevelLabelTranslations: Record<string, Record<SoftHelloVerificationLevel, string>> = {
  English: {
    Unverified: "Unverified",
    "Contact Verified": "Contact Verified",
    "Real Person Verified": "Real Person Verified",
  },
  Arabic: {
    Unverified: "غير موثق",
    "Contact Verified": "تم توثيق التواصل",
    "Real Person Verified": "شخص حقيقي موثق",
  },
  Chinese: {
    Unverified: "未验证",
    "Contact Verified": "联系方式已验证",
    "Real Person Verified": "真人已验证",
  },
  French: {
    Unverified: "Non vérifié",
    "Contact Verified": "Contact vérifié",
    "Real Person Verified": "Personne réelle vérifiée",
  },
  German: {
    Unverified: "Nicht verifiziert",
    "Contact Verified": "Kontakt verifiziert",
    "Real Person Verified": "Echtperson verifiziert",
  },
  Hebrew: {
    Unverified: "לא מאומת",
    "Contact Verified": "אימות קשר",
    "Real Person Verified": "אימות אדם אמיתי",
  },
  Japanese: {
    Unverified: "未確認",
    "Contact Verified": "連絡先確認済み",
    "Real Person Verified": "真人確認済み",
  },
  Korean: {
    Unverified: "미인증",
    "Contact Verified": "연락처 인증",
    "Real Person Verified": "실제 사람 인증",
  },
  Russian: {
    Unverified: "Не подтверждено",
    "Contact Verified": "Контакт подтверждён",
    "Real Person Verified": "Реальный человек подтверждён",
  },
  Spanish: {
    Unverified: "Sin verificar",
    "Contact Verified": "Contacto verificado",
    "Real Person Verified": "Persona real verificada",
  },
  Yiddish: {
    Unverified: "נישט באשטעטיגט",
    "Contact Verified": "קאנטאקט באשטעטיגט",
    "Real Person Verified": "אמתער מענטש באשטעטיגט",
  },
};

export function getMeetingSafetyCopy(level: SoftHelloVerificationLevel, languageBase = "English") {
  const localizedCopy = meetingSafetyCopyTranslations[languageBase] ?? meetingSafetyCopyTranslations.English;

  return localizedCopy[level];
}

export function getVerificationLevelLabel(level: SoftHelloVerificationLevel, languageBase = "English") {
  const localizedLabels = verificationLevelLabelTranslations[languageBase] ?? verificationLevelLabelTranslations.English;

  return localizedLabels[level];
}

export function getEventMembership(eventId: string, memberships: EventMembership[]) {
  return memberships.find((membership) => membership.eventId === eventId) ?? { eventId, status: "none" as const };
}

export function joinEvent(eventId: string, memberships: EventMembership[], now = new Date().toISOString()): EventMembership[] {
  const existing = getEventMembership(eventId, memberships);
  const next: EventMembership = { ...existing, eventId, status: "joined", joinedAt: existing.joinedAt ?? now, leftAt: undefined };

  return memberships.some((membership) => membership.eventId === eventId)
    ? memberships.map((membership) => (membership.eventId === eventId ? next : membership))
    : [...memberships, next];
}

export function leaveEvent(eventId: string, memberships: EventMembership[], now = new Date().toISOString()): EventMembership[] {
  const existing = getEventMembership(eventId, memberships);
  const next: EventMembership = { ...existing, eventId, status: "left", leftAt: now };

  return memberships.some((membership) => membership.eventId === eventId)
    ? memberships.map((membership) => (membership.eventId === eventId ? next : membership))
    : [...memberships, next];
}

export function blockUser(userId: string, blockedUserIds: string[]) {
  return blockedUserIds.includes(userId) ? blockedUserIds : [...blockedUserIds, userId];
}

export function createSafetyReport(eventId: string, reportedUserId: string, reason: SafetyReportReason, now = new Date().toISOString()): SafetyReport {
  return {
    id: `${eventId}-${reportedUserId}-${Date.parse(now) || now}`,
    eventId,
    reportedUserId,
    reason,
    createdAt: now,
  };
}

export function savePostEventFeedback(feedback: PostEventFeedback, existing: PostEventFeedback[]) {
  return existing.some((item) => item.eventId === feedback.eventId)
    ? existing.map((item) => (item.eventId === feedback.eventId ? feedback : item))
    : [...existing, feedback];
}

export function savePlace(place: SavedPlace, existing: SavedPlace[]) {
  return existing.some((item) => item.id === place.id)
    ? existing.map((item) => (item.id === place.id ? { ...item, ...place, savedAt: item.savedAt } : item))
    : [place, ...existing];
}

export function removeSavedPlace(placeId: string, existing: SavedPlace[]) {
  return existing.filter((place) => place.id !== placeId);
}

export function pinEvent(eventId: string, pinnedEventIds: string[]) {
  return pinnedEventIds.includes(eventId) ? pinnedEventIds : [eventId, ...pinnedEventIds];
}

export function unpinEvent(eventId: string, pinnedEventIds: string[]) {
  return pinnedEventIds.filter((id) => id !== eventId);
}

export function hideEvent(eventId: string, hiddenEventIds: string[]) {
  return hiddenEventIds.includes(eventId) ? hiddenEventIds : [eventId, ...hiddenEventIds];
}

export function unhideEvent(eventId: string, hiddenEventIds: string[]) {
  return hiddenEventIds.filter((id) => id !== eventId);
}

export function filterEventsForComfort(events: EventItem[], preferences: SoftHelloComfortPreference[]) {
  if (preferences.length === 0) return events;

  return events.filter((event) => {
    if (preferences.includes("Small groups") && !/2|3|4|5|6/.test(event.people)) return false;
    if (preferences.includes("Quiet") && event.tone !== "Quiet" && event.tone !== "Balanced") return false;
    if (preferences.includes("Indoor backup") && !event.tags.includes("Indoor") && !event.weather.toLowerCase().includes("backup")) return false;

    return true;
  });
}

function getComfortMatchScore(event: EventItem, preferences: SoftHelloComfortPreference[]) {
  return preferences.reduce((score, preference) => {
    if (preference === "Small groups" && /2|3|4|5|6/.test(event.people)) return score + 1;
    if (preference === "Quiet" && (event.tone === "Quiet" || event.tone === "Balanced")) return score + 1;
    if (preference === "Indoor backup" && (event.tags.includes("Indoor") || event.weather.toLowerCase().includes("backup"))) return score + 1;
    if (preference === "Flexible pace" && (event.tone === "Quiet" || event.tone === "Balanced")) return score + 1;
    if (preference === "Text-first") return score + 1;

    return score;
  }, 0);
}

export function prioritizeEventsForComfort(events: EventItem[], preferences: SoftHelloComfortPreference[]) {
  if (preferences.length === 0) return events;

  return events
    .map((event, index) => ({ event, index, score: getComfortMatchScore(event, preferences) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ event }) => event);
}

export const softHelloSampleEvents = allEvents;
