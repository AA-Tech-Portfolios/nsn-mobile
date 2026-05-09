import { useState } from "react";
import { Alert, Modal, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { allEvents, movieNight, nsnColors, type EventItem } from "@/lib/nsn-data";
import {
  canMeetInPerson,
  deriveVerificationLevel,
  getEventMembership,
  getMeetingSafetyCopy,
  getVerificationLevelLabel,
  hideEvent,
  joinEvent,
  removeSavedPlace,
  savePlace,
  savePostEventFeedback,
  pinEvent,
  type PostEventFeedback,
  unhideEvent,
  unpinEvent,
} from "@/lib/softhello-mvp";

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const savePlaceTranslations = {
  English: { save: "Save place", saved: "Saved", savedMessage: "Place saved", removedMessage: "Place removed" },
  Arabic: { save: "حفظ المكان", saved: "محفوظ", savedMessage: "تم حفظ المكان", removedMessage: "تمت إزالة المكان" },
  Hebrew: { save: "שמירת מקום", saved: "נשמר", savedMessage: "המקום נשמר", removedMessage: "המקום הוסר" },
  Russian: { save: "Сохранить место", saved: "Сохранено", savedMessage: "Место сохранено", removedMessage: "Место удалено" },
  Spanish: { save: "Guardar lugar", saved: "Guardado", savedMessage: "Lugar guardado", removedMessage: "Lugar eliminado" },
} as const;

const eventActionTranslations = {
  English: {
    shareTitle: "Share event",
    shareMessage: (title: string, venue: string, time: string) => `I found this NSN meetup: ${title} at ${venue}, ${time}.`,
    shareError: "This event could not be shared right now.",
    copiedMessage: "Event details copied to clipboard.",
    moreTitle: "Event options",
    moreCopy: "Tune how this meetup appears for you.",
    pin: "Pin event",
    unpin: "Unpin event",
    hide: "Hide from Home",
    unhide: "Show on Home",
    viewSavedPlaces: "View saved places",
    close: "Close",
    pinnedMessage: "Event pinned",
    unpinnedMessage: "Event unpinned",
    hiddenMessage: "Event hidden from Home",
    unhiddenMessage: "Event visible on Home",
  },
  Hebrew: {
    shareTitle: "שיתוף אירוע",
    shareMessage: (title: string, venue: string, time: string) => `מצאתי מפגש ב-NSN: ${title} ב-${venue}, ${time}.`,
    shareError: "לא הצלחנו לשתף את האירוע כרגע.",
    copiedMessage: "פרטי האירוע הועתקו ללוח.",
    moreTitle: "אפשרויות אירוע",
    moreCopy: "התאם/י איך המפגש הזה מופיע עבורך.",
    pin: "נעץ אירוע",
    unpin: "בטל נעיצה",
    hide: "הסתר מהבית",
    unhide: "הצג בבית",
    viewSavedPlaces: "הצג מקומות שמורים",
    close: "סגירה",
    pinnedMessage: "האירוע ננעץ",
    unpinnedMessage: "נעיצת האירוע בוטלה",
    hiddenMessage: "האירוע הוסתר מהבית",
    unhiddenMessage: "האירוע יוצג בבית",
  },
} as const;

const verificationWindowTranslations = {
  English: {
    title: "Confirm your details",
    copy: "Before in-person meetups, NSN asks you to confirm the basics other members rely on for safety.",
    displayName: "Name",
    suburb: "Local area",
    age: "Age confirmation",
    photo: "Profile photo",
    contact: "Contact status",
    transport: "Arrival method",
    ageConfirmed: "18 or older confirmed",
    ageMissing: "Needs confirmation",
    photoAdded: "Photo added",
    photoMissing: "Can be added later",
    confirm: "Review in profile",
    editProfile: "Edit profile",
    close: "Close",
    verifiedTitle: "Details confirmed",
    verifiedCopy: "You are ready for in-person meetups.",
  },
  Hebrew: {
    title: "אישור הפרטים שלך",
    copy: "לפני מפגשים פנים אל פנים, NSN מבקשת לאשר את הפרטים הבסיסיים שחברים אחרים מסתמכים עליהם לבטיחות.",
    displayName: "שם",
    suburb: "אזור מקומי",
    age: "אישור גיל",
    photo: "תמונת פרופיל",
    contact: "סטטוס קשר",
    transport: "דרך הגעה",
    ageConfirmed: "אושר גיל 18 ומעלה",
    ageMissing: "נדרש אישור",
    photoAdded: "נוספה תמונה",
    photoMissing: "אפשר להוסיף אחר כך",
    confirm: "סקירה בפרופיל",
    editProfile: "עריכת פרופיל",
    close: "סגירה",
    verifiedTitle: "הפרטים אושרו",
    verifiedCopy: "אפשר להצטרף למפגשים פנים אל פנים.",
  },
} as const;

const noiseGuideTranslations = {
  English: {
    title: "Noise level",
    copy: "This describes the sound level of the venue, separate from the social pressure to talk.",
    levels: {
      Quiet: { icon: "🔇", label: "Quiet", copy: "Low noise" },
      Balanced: { icon: "🌿", label: "Balanced", copy: "Moderate noise" },
      Lively: { icon: "🔊", label: "Lively", copy: "More energy" },
    },
  },
  Hebrew: {
    title: "רמת רעש",
    copy: "זה מתאר את רמת הצליל במקום, בנפרד מהלחץ החברתי לדבר.",
    levels: {
      Quiet: { icon: "🔇", label: "שקט", copy: "רעש נמוך" },
      Balanced: { icon: "🌿", label: "מאוזן", copy: "רעש מתון" },
      Lively: { icon: "🔊", label: "תוסס", copy: "יותר אנרגיה" },
    },
  },
} as const;

const detailEventTranslations: Record<string, Record<string, Partial<Pick<EventItem, "title" | "category" | "people" | "description" | "tone" | "weather">>>> = {
  Hebrew: {
    "picnic-easy-hangout": {
      title: "פיקניק — מפגש קליל",
      category: "חוץ",
      people: "2–4 אנשים",
      description: "מביאים נשנושים, יושבים ונרגעים. אין לחץ לדבר כל הזמן.",
      tone: "מאוזן",
      weather: "תלוי במזג האוויר",
    },
    "beach-day-chill-vibes": {
      title: "יום חוף — אווירה רגועה",
      category: "חוץ",
      people: "3–6 אנשים",
      description: "שמש, ים וחברה טובה. להביא מגבת.",
      tone: "מאוזן",
      weather: "תלוי במזג האוויר",
    },
    "library-calm-study": {
      title: "לימוד רגוע בספרייה",
      category: "פנים",
      people: "2–5 אנשים",
      description: "זמן שקט סביב שולחן, הפסקות שיחה קלות ואיפוס עדין.",
      tone: "שקט",
      weather: "ידידותי לגשם",
    },
    "coffee-lane-cove": {
      title: "קפה — שלום קליל",
      category: "אוכל",
      people: "2–4 אנשים",
      description: "קפה, ישיבה נוחה, ואפשר ללכת מתי שצריך.",
      tone: "מאוזן",
      weather: "חלופה מקורה מוכנה",
    },
    "harbour-walk-waverton": {
      title: "הליכת נמל — קצב קל",
      category: "פעיל",
      people: "3–6 אנשים",
      description: "הליכה איטית עם מקום לשקט ולשיחות צדדיות.",
      tone: "מאוזן",
      weather: "תלוי במזג האוויר",
    },
    "board-games-coffee": {
      title: "משחקי קופסה + קפה",
      category: "פנים",
      people: "3–5 אנשים",
      description: "משחקים פשוטים, שתייה חמה ופתיחות שיחה קלילות.",
      tone: "מאוזן",
      weather: "ידידותי לגשם",
    },
    "ramen-small-table": {
      title: "ראמן — שולחן קטן",
      category: "אוכל",
      people: "3–5 אנשים",
      description: "אוכל חם, היכרות פשוטה, בלי לחץ להישאר מאוחר.",
      tone: "מאוזן",
      weather: "ידידותי לגשם",
    },
    "quiet-music-listening": {
      title: "האזנה למוזיקה שקטה",
      category: "פנים",
      people: "2–5 אנשים",
      description: "משתפים כמה שירים רגועים ומדברים רק כמה שמרגיש טוב.",
      tone: "שקט",
      weather: "חלופה מקורה מוכנה",
    },
  },
};

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
    today: "Today",
    tonight: "Tonight",
    genericDescriptionSuffix: "A low-pressure meetup with clear expectations before you join.",
    weatherAffectedCopy: "Weather may affect this plan, so check the backup option before heading out.",
    weatherFriendlyCopy: "This event has a weather-friendly plan.",
    genericMeetingCopy: (venue: string) => `Meet near ${venue} about 10 minutes before the start time. The host can share a calmer exact spot in chat.`,
    softExitTitle: "You can change your mind",
    softExitCopy: "It is okay to skip this meetup if it does not feel like your pace today. You can find another group, step back from the chat, or come back later.",
    verifyBeforeMeeting: "Verify before meeting",
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
    today: "اليوم",
    tonight: "الليلة",
    genericDescriptionSuffix: "لقاء بلا ضغط مع توقعات واضحة قبل الانضمام.",
    weatherAffectedCopy: "قد يؤثر الطقس على هذه الخطة، لذا تحقق من خيار النسخ الاحتياطي قبل الخروج.",
    weatherFriendlyCopy: "لهذا الحدث خطة مناسبة للطقس.",
    genericMeetingCopy: (venue: string) => `نلتقي بالقرب من ${venue} قبل وقت البداية بحوالي 10 دقائق. يمكن للمضيف مشاركة مكان أكثر هدوءاً في الدردشة.`,
    softExitTitle: "يمكنك تغيير رأيك",
    softExitCopy: "لا بأس في تخطي هذا اللقاء إذا لم يناسب وتيرتك اليوم. يمكنك العثور على مجموعة أخرى، أو التراجع عن الدردشة، أو العودة لاحقاً.",
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
    today: "היום",
    tonight: "הערב",
    genericDescriptionSuffix: "מפגש בלי לחץ עם ציפיות ברורות לפני ההצטרפות.",
    weatherAffectedCopy: "מזג האוויר עשוי להשפיע על התוכנית, אז כדאי לבדוק את אפשרות הגיבוי לפני שיוצאים.",
    weatherFriendlyCopy: "לאירוע הזה יש תוכנית שמתאימה למזג האוויר.",
    genericMeetingCopy: (venue: string) => `ניפגש ליד ${venue} כ-10 דקות לפני שעת ההתחלה. המארח יכול לשתף נקודה רגועה ומדויקת יותר בצ'אט.`,
    softExitTitle: "אפשר לשנות את דעתך",
    softExitCopy: "זה בסדר לדלג על המפגש אם הוא לא מרגיש בקצב שלך היום. אפשר למצוא קבוצה אחרת, לקחת צעד אחורה מהצ'אט, או לחזור מאוחר יותר.",
    verifyBeforeMeeting: "אימות לפני מפגש",
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
    today: "Сегодня",
    tonight: "Сегодня вечером",
    genericDescriptionSuffix: "Встреча без давления с понятными ожиданиями перед присоединением.",
    weatherAffectedCopy: "Погода может повлиять на план, поэтому проверьте запасной вариант перед выходом.",
    weatherFriendlyCopy: "У этой встречи есть план, подходящий для погоды.",
    genericMeetingCopy: (venue: string) => `Встречаемся рядом с ${venue} примерно за 10 минут до начала. Организатор может поделиться более спокойной точной точкой в чате.`,
    softExitTitle: "Вы можете передумать",
    softExitCopy: "Можно пропустить эту встречу, если сегодня она не подходит вашему темпу. Вы можете найти другую группу, отойти от чата или вернуться позже.",
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
    today: "Hoy",
    tonight: "Esta noche",
    genericDescriptionSuffix: "Una quedada sin presión con expectativas claras antes de unirte.",
    weatherAffectedCopy: "El clima puede afectar este plan, así que revisa la opción de respaldo antes de salir.",
    weatherFriendlyCopy: "Este evento tiene un plan adecuado para el clima.",
    genericMeetingCopy: (venue: string) => `Quedamos cerca de ${venue} unos 10 minutos antes de la hora de inicio. La persona anfitriona puede compartir un punto exacto más tranquilo en el chat.`,
    softExitTitle: "Puedes cambiar de opinión",
    softExitCopy: "Está bien saltarte esta quedada si hoy no va a tu ritmo. Puedes encontrar otro grupo, apartarte del chat o volver más tarde.",
  },
} as const;

function DetailMetaRow({
  iconName,
  label,
  isDay,
  isRtl,
}: {
  iconName: "location" | "calendar" | "group";
  label: string;
  isDay?: boolean;
  isRtl?: boolean;
}) {
  return (
    <View style={[styles.metaRow, isRtl && styles.rtlRow]}>
      <View style={[styles.metaIconWrap, isDay && styles.dayMetaIconWrap]}>
        <IconSymbol name={iconName} color={isDay ? "#2F80ED" : "#E5E7EB"} size={19} />
      </View>
      <Text style={[styles.metaLine, isDay && styles.dayText, isRtl && styles.rtlText]}>{label}</Text>
    </View>
  );
}

export default function EventDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const {
    ageConfirmed,
    appLanguage,
    displayName,
    isNightMode,
    profilePhotoUri,
    contactEmail,
    contactPhone,
    identitySelfieUri,
    hasIdentityDocument,
    suburb,
    transportationMethod,
    verificationLevel,
    eventMemberships,
    postEventFeedback,
    savedPlaces,
    pinnedEventIds,
    hiddenEventIds,
    screenReaderHints,
    saveSoftHelloMvpState,
  } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = eventTranslations[appLanguageBase as keyof typeof eventTranslations] ?? eventTranslations.English;
  const saveCopy = savePlaceTranslations[appLanguageBase as keyof typeof savePlaceTranslations] ?? savePlaceTranslations.English;
  const actionCopy = eventActionTranslations[appLanguageBase as keyof typeof eventActionTranslations] ?? eventActionTranslations.English;
  const verificationCopy = verificationWindowTranslations[appLanguageBase as keyof typeof verificationWindowTranslations] ?? verificationWindowTranslations.English;
  const noiseCopy = noiseGuideTranslations[appLanguageBase as keyof typeof noiseGuideTranslations] ?? noiseGuideTranslations.English;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const isDay = !isNightMode;
  const iconColor = isDay ? "#0B1220" : nsnColors.text;
  const event = allEvents.find((item) => item.id === id) ?? movieNight;
  const localizedEvent = { ...event, ...(detailEventTranslations[appLanguageBase]?.[event.id] ?? {}) };
  const isMovieNight = event.id === movieNight.id;
  const eventTitle = isMovieNight ? copy.title : localizedEvent.title.replace(" — ", " —\n");
  const eventCategory = isMovieNight ? copy.category : localizedEvent.category;
  const eventTone = isMovieNight ? copy.tone : `☽ ${localizedEvent.tone}`;
  const eventDate = isMovieNight ? copy.date : `${isNightMode ? copy.tonight : copy.today} · ${event.time}`;
  const eventPeople = isMovieNight ? copy.people : localizedEvent.people;
  const eventDescription = isMovieNight ? copy.description : `${localizedEvent.description} ${copy.genericDescriptionSuffix}`;
  const eventNoise = noiseCopy.levels[event.noiseLevel];
  const eventWeatherCopy = event.weather.includes("Weather")
    ? copy.weatherAffectedCopy
    : copy.weatherFriendlyCopy;
  const eventMeetingCopy = isMovieNight
    ? copy.meetingCopy
    : copy.genericMeetingCopy(event.venue);
  const membership = getEventMembership(event.id, eventMemberships);
  const hasJoined = membership.status === "joined";
  const effectiveVerificationLevel = deriveVerificationLevel({ contactEmail, contactPhone, identitySelfieUri, hasIdentityDocument });
  const canMeet = canMeetInPerson(effectiveVerificationLevel);
  const existingFeedback = postEventFeedback.find((item) => item.eventId === event.id);
  const savedPlaceId = `event:${event.id}:${event.venue}`;
  const isPlaceSaved = savedPlaces.some((place) => place.id === savedPlaceId);
  const isEventPinned = pinnedEventIds.includes(event.id);
  const isEventHidden = hiddenEventIds.includes(event.id);

  const shareEvent = async () => {
    const message = actionCopy.shareMessage(event.title, event.venue, eventDate);

    try {
      if (Platform.OS === "web") {
        const webNavigator = typeof navigator !== "undefined" ? navigator : undefined;

        if (webNavigator?.share) {
          await webNavigator.share({ title: actionCopy.shareTitle, text: message });
          return;
        }

        if (webNavigator?.clipboard?.writeText) {
          await webNavigator.clipboard.writeText(message);
          Alert.alert(actionCopy.shareTitle, actionCopy.copiedMessage);
          return;
        }
      }

      await Share.share({
        title: actionCopy.shareTitle,
        message,
      });
    } catch {
      Alert.alert(actionCopy.shareTitle, actionCopy.shareError);
    }
  };

  const handleJoin = async () => {
    if (!canMeet) {
      setIsVerificationOpen(true);
      return;
    }

    const nextMemberships = joinEvent(event.id, eventMemberships);
    await saveSoftHelloMvpState({ eventMemberships: nextMemberships });
    router.push({ pathname: "/(tabs)/chats" });
  };

  const confirmVerificationDetails = async () => {
    setIsVerificationOpen(false);
    router.push("/(tabs)/profile");
  };

  const saveFeedback = async (comfort: PostEventFeedback["comfort"], wouldMeetAgain: boolean) => {
    const nextFeedback = savePostEventFeedback(
      {
        eventId: event.id,
        comfort,
        wouldMeetAgain,
        createdAt: new Date().toISOString(),
      },
      postEventFeedback
    );

    await saveSoftHelloMvpState({ postEventFeedback: nextFeedback });
  };

  const toggleSavedPlace = async () => {
    const nextSavedPlaces = isPlaceSaved
      ? removeSavedPlace(savedPlaceId, savedPlaces)
      : savePlace(
          {
            id: savedPlaceId,
            venue: event.venue,
            category: event.category,
            sourceEventId: event.id,
            sourceEventTitle: event.title,
            weather: event.weather,
            savedAt: new Date().toISOString(),
          },
          savedPlaces
        );

    await saveSoftHelloMvpState({ savedPlaces: nextSavedPlaces });
    Alert.alert(isPlaceSaved ? saveCopy.removedMessage : saveCopy.savedMessage, event.venue);
  };

  const togglePinnedEvent = async () => {
    const nextPinnedEventIds = isEventPinned ? unpinEvent(event.id, pinnedEventIds) : pinEvent(event.id, pinnedEventIds);
    const nextHiddenEventIds = isEventPinned ? hiddenEventIds : unhideEvent(event.id, hiddenEventIds);

    await saveSoftHelloMvpState({ pinnedEventIds: nextPinnedEventIds, hiddenEventIds: nextHiddenEventIds });
    setIsMoreMenuOpen(false);
    Alert.alert(isEventPinned ? actionCopy.unpinnedMessage : actionCopy.pinnedMessage, event.title);
  };

  const toggleHiddenEvent = async () => {
    const nextHiddenEventIds = isEventHidden ? unhideEvent(event.id, hiddenEventIds) : hideEvent(event.id, hiddenEventIds);
    const nextPinnedEventIds = isEventHidden ? pinnedEventIds : unpinEvent(event.id, pinnedEventIds);

    await saveSoftHelloMvpState({ hiddenEventIds: nextHiddenEventIds, pinnedEventIds: nextPinnedEventIds });
    setIsMoreMenuOpen(false);
    Alert.alert(isEventHidden ? actionCopy.unhiddenMessage : actionCopy.hiddenMessage, event.title);
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayScreen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={[styles.screen, isDay && styles.dayScreen]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.topBar, isRtl && styles.rtlRow]}>
          <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={[styles.iconButton, isDay && styles.dayIconButton]} accessibilityRole="button" accessibilityLabel="Go back" accessibilityHint={screenReaderHints ? "Returns to the previous screen." : undefined}>
            <IconSymbol name="chevron.left" color={iconColor} size={26} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={toggleSavedPlace}
              accessibilityRole="button"
              accessibilityLabel={isPlaceSaved ? saveCopy.saved : saveCopy.save}
              accessibilityHint={screenReaderHints ? (isPlaceSaved ? "Removes this venue from your saved places." : "Saves this venue to your saved places.") : undefined}
              style={[styles.iconButton, isDay && styles.dayIconButton, isPlaceSaved && styles.savedIconButton]}
            >
              <IconSymbol name={isPlaceSaved ? "bookmark" : "bookmark.border"} color={isPlaceSaved ? nsnColors.day : iconColor} size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={shareEvent}
              accessibilityRole="button"
              accessibilityLabel={actionCopy.shareTitle}
              accessibilityHint={screenReaderHints ? "Shares this meetup with someone else, or copies a share message on web." : undefined}
              style={[styles.iconButton, isDay && styles.dayIconButton]}
            >
              <IconSymbol name="share" color={iconColor} size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setIsMoreMenuOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={actionCopy.moreTitle}
              accessibilityHint={screenReaderHints ? "Opens event options such as pin, hide, and saved places." : undefined}
              style={[styles.iconButton, isDay && styles.dayIconButton, (isEventPinned || isEventHidden) && styles.activeMoreButton]}
            >
              <IconSymbol name="more" color={iconColor} size={23} />
            </TouchableOpacity>
          </View>
        </View>

        <Modal transparent animationType="fade" visible={isMoreMenuOpen} onRequestClose={() => setIsMoreMenuOpen(false)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.actionSheet, isDay && styles.dayActionSheet]}>
              <Text style={[styles.actionSheetTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{actionCopy.moreTitle}</Text>
              <Text style={[styles.actionSheetCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{actionCopy.moreCopy}</Text>
              <View style={styles.actionList}>
                <TouchableOpacity activeOpacity={0.82} onPress={togglePinnedEvent} style={[styles.actionRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]} accessibilityRole="button" accessibilityHint={screenReaderHints ? "Changes whether this event is prioritized for you." : undefined}>
                  <IconSymbol name="pin" color={isEventPinned ? nsnColors.day : iconColor} size={20} />
                  <Text style={[styles.actionText, isDay && styles.dayText, isRtl && styles.rtlText]}>{isEventPinned ? actionCopy.unpin : actionCopy.pin}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.82} onPress={toggleHiddenEvent} style={[styles.actionRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]} accessibilityRole="button" accessibilityHint={screenReaderHints ? "Changes whether this event appears on Home." : undefined}>
                  <IconSymbol name={isEventHidden ? "visibility" : "visibility.off"} color={isEventHidden ? "#2F80ED" : nsnColors.danger} size={20} />
                  <Text style={[styles.actionText, isDay && styles.dayText, isRtl && styles.rtlText]}>{isEventHidden ? actionCopy.unhide : actionCopy.hide}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => {
                    setIsMoreMenuOpen(false);
                    router.push("/(tabs)/saved-places");
                  }}
                  style={[styles.actionRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]}
                  accessibilityRole="button"
                  accessibilityHint={screenReaderHints ? "Opens your saved places list." : undefined}
                >
                  <IconSymbol name="bookmark" color={nsnColors.day} size={20} />
                  <Text style={[styles.actionText, isDay && styles.dayText, isRtl && styles.rtlText]}>{actionCopy.viewSavedPlaces}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={0.82} onPress={() => setIsMoreMenuOpen(false)} style={styles.closeActionButton}>
                <Text style={styles.closeActionText}>{actionCopy.close}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal transparent animationType="fade" visible={isVerificationOpen} onRequestClose={() => setIsVerificationOpen(false)}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.verificationSheet, isDay && styles.dayActionSheet]}>
              <Text style={[styles.actionSheetTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{verificationCopy.title}</Text>
              <Text style={[styles.actionSheetCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{verificationCopy.copy}</Text>
              <View style={styles.verificationList}>
                {[
                  { label: verificationCopy.displayName, value: displayName || "NSN member" },
                  { label: verificationCopy.suburb, value: suburb || event.venue },
                  { label: verificationCopy.age, value: ageConfirmed ? verificationCopy.ageConfirmed : verificationCopy.ageMissing },
                  { label: verificationCopy.photo, value: profilePhotoUri ? verificationCopy.photoAdded : verificationCopy.photoMissing },
                  { label: verificationCopy.contact, value: getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase) },
                  { label: verificationCopy.transport, value: transportationMethod },
                ].map((item) => (
                  <View key={item.label} style={[styles.verificationRow, isDay && styles.dayActionRow, isRtl && styles.rtlRow]}>
                    <Text style={[styles.verificationLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{item.label}</Text>
                    <Text style={[styles.verificationValue, isDay && styles.dayText, isRtl && styles.rtlText]}>{item.value}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.verificationActions}>
              <TouchableOpacity activeOpacity={0.82} onPress={confirmVerificationDetails} style={styles.confirmVerificationButton} accessibilityRole="button" accessibilityHint={screenReaderHints ? "Confirms these details for this meetup check." : undefined}>
                  <Text style={styles.confirmVerificationText}>{verificationCopy.confirm}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => {
                    setIsVerificationOpen(false);
                    router.push("/(tabs)/profile");
                  }}
                  style={[styles.secondaryVerificationButton, isDay && styles.dayActionRow]}
                  accessibilityRole="button"
                  accessibilityHint={screenReaderHints ? "Opens Profile to update trust, contact, and profile details." : undefined}
                >
                  <Text style={[styles.secondaryVerificationText, isDay && styles.dayText]}>{verificationCopy.editProfile}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.82} onPress={() => setIsVerificationOpen(false)} style={styles.closeActionButton}>
                  <Text style={styles.closeActionText}>{verificationCopy.close}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={[styles.heroPanel, isDay && styles.dayPanel]}>
          <View style={styles.eventAvatar}>
            <Text style={styles.avatarEmoji}>{event.emoji}</Text>
          </View>
          <Text style={[styles.title, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{eventTitle}</Text>
          <View style={[styles.tagRow, isRtl && styles.rtlRow]}>
            <Text style={[styles.primaryChip, isRtl && styles.rtlText]}>{eventCategory}</Text>
            <Text style={[styles.quietChip, isDay && styles.dayQuietChip, isRtl && styles.rtlText]}>{eventTone}</Text>
          </View>
        </View>

        <View style={styles.metaStack}>
          <DetailMetaRow iconName="location" label={event.venue} isDay={isDay} isRtl={isRtl} />
          <DetailMetaRow iconName="calendar" label={eventDate} isDay={isDay} isRtl={isRtl} />
          <DetailMetaRow iconName="group" label={eventPeople} isDay={isDay} isRtl={isRtl} />
        </View>

        <TouchableOpacity
          activeOpacity={0.86}
          onPress={toggleSavedPlace}
          style={[styles.savePlaceButton, isDay && styles.daySavePlaceButton, isRtl && styles.rtlRow]}
          accessibilityRole="button"
          accessibilityHint={screenReaderHints ? (isPlaceSaved ? "Removes this venue from saved places." : "Saves this venue so you can find it later.") : undefined}
        >
          <IconSymbol name={isPlaceSaved ? "bookmark" : "bookmark.border"} color={isPlaceSaved ? nsnColors.day : iconColor} size={20} />
          <Text style={[styles.savePlaceText, isDay && styles.dayText, isRtl && styles.rtlText]}>{isPlaceSaved ? saveCopy.saved : saveCopy.save}</Text>
        </TouchableOpacity>

        <Text style={[styles.description, isDay && styles.dayText, isRtl && styles.rtlText]}>{eventDescription}</Text>

        <TouchableOpacity activeOpacity={0.86} style={[styles.weatherCard, isDay && styles.dayCard, isRtl && styles.rtlRow]}>
          <View style={isRtl && styles.rtlBlock}>
            <Text style={[styles.weatherTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.weatherTitle}</Text>
            <Text style={[styles.weatherCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{isMovieNight ? copy.weatherCopy : eventWeatherCopy}</Text>
          </View>
          <Text style={styles.weatherIcon}>☁️</Text>
        </TouchableOpacity>

        <View style={[styles.noiseGuideCard, isDay && styles.dayCard, isRtl && styles.rtlRow]}>
          <View style={[styles.noiseIconWrap, isDay && styles.dayMetaIconWrap]}>
            <Text style={styles.noiseIcon}>{eventNoise.icon}</Text>
          </View>
          <View style={[styles.noiseCopyBlock, isRtl && styles.rtlBlock]}>
            <Text style={[styles.noiseTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{noiseCopy.title}: {eventNoise.label}</Text>
            <Text style={[styles.noiseDescription, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{eventNoise.copy}. {noiseCopy.copy}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.whatToExpect}</Text>
        <View style={[styles.expectGrid, isRtl && styles.rtlRow]}>
          <View style={[styles.expectCard, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
            <Text style={styles.expectIcon}>◇</Text>
            <Text style={[styles.expectTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.lowPressure}</Text>
            <Text style={[styles.expectCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.lowPressureCopy}</Text>
          </View>
          <View style={[styles.expectCard, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
            <Text style={styles.expectIcon}>◌</Text>
            <Text style={[styles.expectTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.sharedExperience}</Text>
            <Text style={[styles.expectCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.sharedExperienceCopy}</Text>
          </View>
          <View style={[styles.expectCard, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
            <Text style={styles.expectIcon}>↺</Text>
            <Text style={[styles.expectTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.flexible}</Text>
            <Text style={[styles.expectCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.flexibleCopy}</Text>
          </View>
        </View>

        <View style={[styles.meetingPanel, isDay && styles.dayMeetingPanel, isRtl && styles.rtlBlock]}>
          <Text style={[styles.sectionTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.meetingPoint}</Text>
          <Text style={[styles.meetingCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{eventMeetingCopy}</Text>
        </View>

        <View style={[styles.safetyPanel, isDay && styles.dayCard, isRtl && styles.rtlBlock]}>
          <View style={[styles.safetyHeader, isRtl && styles.rtlRow]}>
            <Text style={[styles.safetyTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>Meeting safety</Text>
            <Text style={[styles.verificationChip, canMeet && styles.verificationChipReady]}>
              {getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase)}
            </Text>
          </View>
          <Text style={[styles.safetyCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{getMeetingSafetyCopy(effectiveVerificationLevel, appLanguageBase)}</Text>
        </View>

        <View style={[styles.softExitCard, isDay && styles.daySoftExitCard, isRtl && styles.rtlBlock]}>
          <Text style={[styles.softExitTitle, isDay && styles.dayHeadingText, isRtl && styles.rtlText]}>{copy.softExitTitle}</Text>
          <Text style={[styles.softExitCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.softExitCopy}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleJoin}
          style={[styles.joinButton, !canMeet && styles.joinButtonLocked]}
          accessibilityRole="button"
          accessibilityHint={screenReaderHints ? (hasJoined ? "Opens the meetup group chat." : canMeet ? "Joins this meetup." : "Opens verification details required before meeting in person.") : undefined}
        >
          <Text style={styles.joinText}>
            {hasJoined ? "Open Meetup Chat" : canMeet ? copy.join : "verifyBeforeMeeting" in copy ? copy.verifyBeforeMeeting : "Verify before meeting"}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.spotsText, isDay && styles.dayMutedText]}>{copy.spotsLeft}</Text>

        {hasJoined ? (
          <View style={[styles.feedbackPanel, isDay && styles.dayCard]}>
            <Text style={[styles.safetyTitle, isDay && styles.dayHeadingText]}>Private post-event check-in</Text>
            <Text style={[styles.safetyCopy, isDay && styles.dayMutedText]}>
              {existingFeedback ? "Feedback saved privately for this meetup." : "After the meetup, note how it felt. This is never a public rating."}
            </Text>
            <View style={styles.feedbackActions}>
              <TouchableOpacity activeOpacity={0.82} onPress={() => saveFeedback("Good", true)} style={styles.feedbackButton}>
                <Text style={styles.feedbackButtonText}>Good</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.82} onPress={() => saveFeedback("Mixed", false)} style={styles.feedbackButton}>
                <Text style={styles.feedbackButtonText}>Mixed</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.82} onPress={() => saveFeedback("Unsafe", false)} style={[styles.feedbackButton, styles.feedbackButtonDanger]}>
                <Text style={styles.feedbackButtonText}>Unsafe</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
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
  dayMetaIconWrap: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6" },
  dayMutedText: { color: "#3B4A63" },
  dayPanel: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  dayQuietChip: { color: "#3B4A63", backgroundColor: "#EAF4FF" },
  dayText: { color: "#0B1220" },
  dayActionSheet: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6" },
  dayActionRow: { backgroundColor: "#EAF4FF", borderColor: "#B8C9E6" },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  topActions: { flexDirection: "row", gap: 8 },
  rtlRow: { flexDirection: "row-reverse" },
  rtlBlock: { alignItems: "flex-end" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  iconButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: nsnColors.border },
  savedIconButton: { borderColor: "rgba(247,200,91,0.68)", backgroundColor: "rgba(247,200,91,0.12)" },
  activeMoreButton: { borderColor: "rgba(47,128,237,0.52)", backgroundColor: "rgba(47,128,237,0.12)" },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(2,8,20,0.42)", padding: 16 },
  actionSheet: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#071426", padding: 16 },
  verificationSheet: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#071426", padding: 16 },
  actionSheetTitle: { color: nsnColors.text, fontSize: 18, fontWeight: "900", lineHeight: 24 },
  actionSheetCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19, marginTop: 3, marginBottom: 12 },
  actionList: { gap: 8 },
  actionRow: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", paddingHorizontal: 12 },
  actionText: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  closeActionButton: { minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: nsnColors.primary, marginTop: 12 },
  closeActionText: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  verificationList: { gap: 8 },
  verificationRow: { minHeight: 56, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", paddingHorizontal: 12, paddingVertical: 9 },
  verificationLabel: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15, marginBottom: 2 },
  verificationValue: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  verificationActions: { marginTop: 12, gap: 9 },
  confirmVerificationButton: { minHeight: 48, borderRadius: 15, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center" },
  confirmVerificationText: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  secondaryVerificationButton: { minHeight: 46, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center" },
  secondaryVerificationText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  heroPanel: { alignItems: "center", borderRadius: 28, paddingTop: 8, paddingBottom: 22, backgroundColor: "#061121", borderWidth: 1, borderColor: "rgba(56,72,255,0.22)", marginBottom: 18 },
  eventAvatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#21123E", borderWidth: 2, borderColor: nsnColors.primary, alignItems: "center", justifyContent: "center", marginTop: -2, marginBottom: 18 },
  avatarEmoji: { fontSize: 43 },
  title: { color: nsnColors.text, fontSize: 28, fontWeight: "800", textAlign: "center", letterSpacing: -0.5, lineHeight: 34 },
  tagRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  primaryChip: { color: nsnColors.text, fontSize: 12, fontWeight: "800", backgroundColor: nsnColors.primary, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 14, overflow: "hidden" },
  quietChip: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", backgroundColor: "rgba(255,255,255,0.06)", paddingHorizontal: 13, paddingVertical: 7, borderRadius: 14, overflow: "hidden" },
  metaStack: { gap: 8, marginBottom: 12 },
  savePlaceButton: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", marginBottom: 14 },
  daySavePlaceButton: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6" },
  savePlaceText: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaIconWrap: { width: 32, height: 32, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(148,163,184,0.18)" },
  metaLine: { flex: 1, color: nsnColors.text, fontSize: 14, lineHeight: 20 },
  description: { color: nsnColors.text, fontSize: 15, lineHeight: 23, marginBottom: 14 },
  weatherCard: { minHeight: 78, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 18, paddingHorizontal: 16, paddingVertical: 13, backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: "#284476", marginBottom: 19 },
  weatherTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20 },
  weatherCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, maxWidth: 250 },
  weatherIcon: { fontSize: 28 },
  noiseGuideCard: { minHeight: 74, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#06101F", padding: 13, marginBottom: 16 },
  noiseIconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: nsnColors.border },
  noiseIcon: { fontSize: 21, lineHeight: 24 },
  noiseCopyBlock: { flex: 1 },
  noiseTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  noiseDescription: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 2 },
  sectionTitle: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 23, marginBottom: 10 },
  expectGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  expectCard: { width: "48%", minHeight: 82, borderRadius: 16, padding: 13, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border },
  expectIcon: { color: "#7FA9FF", fontSize: 18, marginBottom: 4 },
  expectTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "800", lineHeight: 18 },
  expectCopy: { color: nsnColors.muted, fontSize: 11, lineHeight: 16, marginTop: 1 },
  meetingPanel: { borderTopWidth: 1, borderColor: nsnColors.border, paddingTop: 14, marginTop: 2, marginBottom: 18 },
  meetingCopy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21 },
  softExitCard: { borderRadius: 18, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: nsnColors.border, padding: 15, marginBottom: 18 },
  daySoftExitCard: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6" },
  softExitTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "800", lineHeight: 20, marginBottom: 4 },
  softExitCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
  safetyPanel: { borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#06101F", padding: 14, marginBottom: 14 },
  safetyHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 },
  safetyTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  safetyCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
  verificationChip: { color: nsnColors.warning, borderColor: "rgba(247,200,91,0.45)", borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, fontSize: 11, fontWeight: "900", overflow: "hidden" },
  verificationChipReady: { color: nsnColors.green, borderColor: "rgba(114,214,126,0.45)" },
  joinButton: { height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: nsnColors.primary },
  joinButtonLocked: { backgroundColor: "#3A4358" },
  joinText: { color: nsnColors.text, fontSize: 16, fontWeight: "800" },
  spotsText: { color: nsnColors.muted, textAlign: "center", marginTop: 10, fontSize: 13, lineHeight: 19 },
  feedbackPanel: { borderRadius: 17, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "#06101F", padding: 14, marginTop: 14 },
  feedbackActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  feedbackButton: { flex: 1, minHeight: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: nsnColors.surfaceRaised, borderWidth: 1, borderColor: nsnColors.border },
  feedbackButtonDanger: { borderColor: "rgba(255,119,119,0.45)" },
  feedbackButtonText: { color: nsnColors.text, fontSize: 12, fontWeight: "900" },
});
