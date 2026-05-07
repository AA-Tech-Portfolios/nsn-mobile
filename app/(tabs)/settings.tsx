import { ScrollView, View, Text, TextInput, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import { appPalettes, getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { nsnColors } from "@/lib/nsn-data";
import { createSettingsToggleSections, selectSettingsPalette, toggleSettingsDropdown, type SettingsDropdownName } from "@/lib/settings-controls";

type SettingsCopy = {
  title: string;
  subtitle: string;
  accessibility?: string;
  largerText?: string;
  largerTextCopy?: string;
  highContrast?: string;
  highContrastCopy?: string;
  reduceMotion?: string;
  reduceMotionCopy?: string;
  screenReaderHints?: string;
  screenReaderHintsCopy?: string;
  translations: string;
  blurProfilePhoto: string;
  blurProfilePhotoCopy: string;
  privateProfile: string;
  privateProfileCopy: string;
  showFirstNameOnly: string;
  showFirstNameOnlyCopy: string;
  sameAgeGroupsOnly: string;
  sameAgeGroupsOnlyCopy: string;
  revealAfterRsvp: string;
  revealAfterRsvpCopy: string;
  friendsOfFriendsOnly: string;
  friendsOfFriendsOnlyCopy: string;
  appLanguage: string;
  appLanguageCopy: string;
  translateMeetupsChats: string;
  translateMeetupsChatsCopy: string;
  appearance?: string;
  colorPalette?: string;
  colorPaletteCopy?: string;
  notifications?: string;
  meetupReminders?: string;
  meetupRemindersCopy?: string;
  weatherAlerts?: string;
  weatherAlertsCopy?: string;
  chatNotifications?: string;
  chatNotificationsCopy?: string;
  quietNotifications?: string;
  quietNotificationsCopy?: string;
  locationDiscovery?: string;
  useApproximateLocation?: string;
  useApproximateLocationCopy?: string;
  showDistanceInMeetups?: string;
  showDistanceInMeetupsCopy?: string;
  safetyContact?: string;
  allowMessageRequests?: string;
  allowMessageRequestsCopy?: string;
  safetyCheckIns?: string;
  safetyCheckInsCopy?: string;
  restartOnboarding?: string;
  restartOnboardingCopy?: string;
  restartOnboardingAction?: string;
  searchLanguage?: string;
  noLanguageFound?: string;
};

const englishCopy: SettingsCopy = {
  title: "Settings & Privacy",
  subtitle: "Choose how you want others to see you.",
  accessibility: "Accessibility",
  largerText: "Larger text",
  largerTextCopy: "Increase text size on this screen and save the preference for the app.",
  highContrast: "High contrast",
  highContrastCopy: "Strengthen borders and text contrast for easier scanning.",
  reduceMotion: "Disable animations",
  reduceMotionCopy: "Turn off decorative movement and use instant Day/Night changes.",
  screenReaderHints: "Screen reader hints",
  screenReaderHintsCopy: "Add extra labels and hints for assistive technologies.",
  translations: "Translations",
  blurProfilePhoto: "Blur profile photo",
  blurProfilePhotoCopy: "Keep your photo softened until you choose otherwise.",
  privateProfile: "Private profile",
  privateProfileCopy: "Limit profile details across discovery surfaces.",
  showFirstNameOnly: "Show first name only",
  showFirstNameOnlyCopy: "Use your first name in meetups and chats.",
  sameAgeGroupsOnly: "Only show me same age groups",
  sameAgeGroupsOnlyCopy: "Prioritise meetups with people in a similar age range.",
  revealAfterRsvp: "Only reveal profile after RSVP",
  revealAfterRsvpCopy: "Show your profile once both sides have committed to the plan.",
  friendsOfFriendsOnly: "Friends-of-friends only",
  friendsOfFriendsOnlyCopy: "Prefer people connected through your trusted network.",
  appLanguage: "App language",
  appLanguageCopy: "Choose the language used across NSN.",
  translateMeetupsChats: "Translate meetups and chats",
  translateMeetupsChatsCopy: "Show event details and chat messages in this language.",
  appearance: "Appearance",
  colorPalette: "Color palette",
  colorPaletteCopy: "Choose the mood and accent colors you prefer.",
  notifications: "Notifications",
  meetupReminders: "Meetup reminders",
  meetupRemindersCopy: "Get reminders before meetups you have joined.",
  weatherAlerts: "Weather alerts",
  weatherAlertsCopy: "Receive updates when weather may affect an outdoor plan.",
  chatNotifications: "Chat notifications",
  chatNotificationsCopy: "Notify me when meetup group chats have new messages.",
  quietNotifications: "Quiet notifications",
  quietNotificationsCopy: "Keep notification tone gentle and avoid attention-heavy alerts.",
  locationDiscovery: "Location & Discovery",
  useApproximateLocation: "Use approximate location",
  useApproximateLocationCopy: "Show nearby options without sharing a precise location.",
  showDistanceInMeetups: "Show distance in meetups",
  showDistanceInMeetupsCopy: "Display approximate distance on event and meetup cards.",
  safetyContact: "Safety & Contact",
  allowMessageRequests: "Allow message requests",
  allowMessageRequestsCopy: "Let people message before you join the same meetup.",
  safetyCheckIns: "Safety check-ins",
  safetyCheckInsCopy: "Enable gentle check-in prompts around joined meetups.",
  restartOnboarding: "Restart SoftHello onboarding",
  restartOnboardingCopy: "Revisit age confirmation, suburb, intent, nickname, photo and visibility choices.",
  restartOnboardingAction: "Start",
  searchLanguage: "Search language...",
  noLanguageFound: "No language found",
};

const settingsTranslations: Record<string, SettingsCopy> = {
  English: englishCopy,
  Arabic: {
    title: "الإعدادات والخصوصية",
    subtitle: "اختر كيف تريد أن يراك الآخرون.",
    translations: "الترجمات",
    blurProfilePhoto: "طمس صورة الملف الشخصي",
    blurProfilePhotoCopy: "اجعل صورتك غير واضحة حتى تختار غير ذلك.",
    privateProfile: "ملف شخصي خاص",
    privateProfileCopy: "قلل تفاصيل ملفك الشخصي في أماكن الاكتشاف.",
    showFirstNameOnly: "إظهار الاسم الأول فقط",
    showFirstNameOnlyCopy: "استخدم اسمك الأول في اللقاءات والدردشات.",
    sameAgeGroupsOnly: "إظهار الفئات العمرية المشابهة فقط",
    sameAgeGroupsOnlyCopy: "أعط الأولوية للقاءات مع أشخاص من عمر قريب.",
    revealAfterRsvp: "كشف الملف الشخصي بعد تأكيد الحضور فقط",
    revealAfterRsvpCopy: "اعرض ملفك الشخصي بعد التزام الطرفين بالخطة.",
    friendsOfFriendsOnly: "أصدقاء الأصدقاء فقط",
    friendsOfFriendsOnlyCopy: "فضّل الأشخاص المرتبطين بشبكتك الموثوقة.",
    appLanguage: "لغة التطبيق",
    appLanguageCopy: "اختر اللغة المستخدمة في NSN.",
    translateMeetupsChats: "ترجمة اللقاءات والدردشات",
    translateMeetupsChatsCopy: "اعرض تفاصيل الفعاليات ورسائل الدردشة بهذه اللغة.",
    restartOnboarding: "إعادة بدء إعداد SoftHello",
    restartOnboardingCopy: "راجع تأكيد العمر والضاحية والنية والاسم والصورة وخيارات الظهور.",
    restartOnboardingAction: "ابدأ",
    searchLanguage: "ابحث عن لغة…",
    noLanguageFound: "لم يتم العثور على لغة",
  },
  Chinese: {
    title: "设置与隐私",
    subtitle: "选择你希望他人如何看到你。",
    translations: "翻译",
    blurProfilePhoto: "模糊个人照片",
    blurProfilePhotoCopy: "在你决定之前，让照片保持柔化显示。",
    privateProfile: "私人资料",
    privateProfileCopy: "限制发现页面中的个人资料细节。",
    showFirstNameOnly: "仅显示名字",
    showFirstNameOnlyCopy: "在聚会和聊天中使用你的名字。",
    sameAgeGroupsOnly: "只显示相近年龄组",
    sameAgeGroupsOnlyCopy: "优先显示年龄相近的人参加的聚会。",
    revealAfterRsvp: "RSVP 后才显示资料",
    revealAfterRsvpCopy: "双方确认计划后再显示你的资料。",
    friendsOfFriendsOnly: "仅限朋友的朋友",
    friendsOfFriendsOnlyCopy: "优先选择来自可信关系网络的人。",
    appLanguage: "应用语言",
    appLanguageCopy: "选择 NSN 使用的语言。",
    translateMeetupsChats: "翻译聚会和聊天",
    translateMeetupsChatsCopy: "用此语言显示活动详情和聊天消息。",
    restartOnboarding: "重新开始 SoftHello 引导",
    restartOnboardingCopy: "重新设置年龄确认、地区、意图、昵称、照片和可见性选择。",
    restartOnboardingAction: "开始",
    searchLanguage: "搜索语言...",
    noLanguageFound: "未找到语言",
  },
  French: {
    title: "Paramètres et confidentialité",
    subtitle: "Choisissez comment les autres peuvent vous voir.",
    translations: "Traductions",
    blurProfilePhoto: "Flouter la photo de profil",
    blurProfilePhotoCopy: "Gardez votre photo adoucie jusqu'à ce que vous décidiez autrement.",
    privateProfile: "Profil privé",
    privateProfileCopy: "Limitez les détails du profil dans les espaces de découverte.",
    showFirstNameOnly: "Afficher seulement le prénom",
    showFirstNameOnlyCopy: "Utilisez votre prénom dans les rencontres et les discussions.",
    sameAgeGroupsOnly: "Afficher seulement les groupes du même âge",
    sameAgeGroupsOnlyCopy: "Priorisez les rencontres avec des personnes d'un âge proche.",
    revealAfterRsvp: "Révéler le profil seulement après RSVP",
    revealAfterRsvpCopy: "Affichez votre profil une fois que les deux côtés ont confirmé.",
    friendsOfFriendsOnly: "Amis d'amis uniquement",
    friendsOfFriendsOnlyCopy: "Préférez les personnes liées à votre réseau de confiance.",
    appLanguage: "Langue de l'application",
    appLanguageCopy: "Choisissez la langue utilisée dans NSN.",
    translateMeetupsChats: "Traduire les rencontres et discussions",
    translateMeetupsChatsCopy: "Afficher les détails et messages dans cette langue.",
    restartOnboarding: "Recommencer l'accueil SoftHello",
    restartOnboardingCopy: "Revoir l'âge, le quartier, l'intention, le pseudo, la photo et la visibilité.",
    restartOnboardingAction: "Commencer",
    searchLanguage: "Rechercher une langue...",
    noLanguageFound: "Aucune langue trouvée",
  },
  German: {
    title: "Einstellungen und Datenschutz",
    subtitle: "Wähle, wie andere dich sehen sollen.",
    translations: "Übersetzungen",
    blurProfilePhoto: "Profilfoto weichzeichnen",
    blurProfilePhotoCopy: "Halte dein Foto unscharf, bis du etwas anderes wählst.",
    privateProfile: "Privates Profil",
    privateProfileCopy: "Begrenze Profildetails in Entdeckungsbereichen.",
    showFirstNameOnly: "Nur Vornamen anzeigen",
    showFirstNameOnlyCopy: "Verwende deinen Vornamen in Treffen und Chats.",
    sameAgeGroupsOnly: "Nur ähnliche Altersgruppen anzeigen",
    sameAgeGroupsOnlyCopy: "Bevorzuge Treffen mit Menschen in ähnlichem Alter.",
    revealAfterRsvp: "Profil erst nach RSVP anzeigen",
    revealAfterRsvpCopy: "Zeige dein Profil, sobald beide Seiten zugesagt haben.",
    friendsOfFriendsOnly: "Nur Freunde von Freunden",
    friendsOfFriendsOnlyCopy: "Bevorzuge Personen aus deinem vertrauenswürdigen Netzwerk.",
    appLanguage: "App-Sprache",
    appLanguageCopy: "Wähle die Sprache für NSN.",
    translateMeetupsChats: "Treffen und Chats übersetzen",
    translateMeetupsChatsCopy: "Zeige Eventdetails und Chatnachrichten in dieser Sprache.",
    restartOnboarding: "SoftHello-Einstieg neu starten",
    restartOnboardingCopy: "Alter, Ort, Absicht, Spitzname, Foto und Sichtbarkeit erneut festlegen.",
    restartOnboardingAction: "Starten",
    searchLanguage: "Sprache suchen...",
    noLanguageFound: "Keine Sprache gefunden",
  },
  Hebrew: {
    title: "הגדרות ופרטיות",
    subtitle: "בחר איך תרצה שאחרים יראו אותך.",
    translations: "תרגומים",
    blurProfilePhoto: "טשטוש תמונת פרופיל",
    blurProfilePhotoCopy: "השאר את התמונה מטושטשת עד שתבחר אחרת.",
    privateProfile: "פרופיל פרטי",
    privateProfileCopy: "הגבל פרטי פרופיל באזורי גילוי.",
    showFirstNameOnly: "הצג שם פרטי בלבד",
    showFirstNameOnlyCopy: "השתמש בשם הפרטי שלך במפגשים ובצ'אטים.",
    sameAgeGroupsOnly: "הצג רק קבוצות גיל דומות",
    sameAgeGroupsOnlyCopy: "תן עדיפות למפגשים עם אנשים בטווח גיל דומה.",
    revealAfterRsvp: "חשוף פרופיל רק אחרי אישור הגעה",
    revealAfterRsvpCopy: "הצג את הפרופיל לאחר ששני הצדדים התחייבו לתוכנית.",
    friendsOfFriendsOnly: "חברים של חברים בלבד",
    friendsOfFriendsOnlyCopy: "העדף אנשים שמחוברים דרך הרשת המהימנה שלך.",
    appLanguage: "שפת האפליקציה",
    appLanguageCopy: "בחר את השפה שבה NSN ישתמש.",
    translateMeetupsChats: "תרגום מפגשים וצ'אטים",
    translateMeetupsChatsCopy: "הצג פרטי אירועים והודעות צ'אט בשפה זו.",
    appearance: "מראה",
    colorPalette: "ערכת צבעים",
    colorPaletteCopy: "בחר את האווירה וצבעי ההדגשה שמתאימים לך.",
    notifications: "התראות",
    meetupReminders: "תזכורות למפגשים",
    meetupRemindersCopy: "קבל תזכורות לפני מפגשים שהצטרפת אליהם.",
    weatherAlerts: "התראות מזג אוויר",
    weatherAlertsCopy: "קבל עדכונים כשמזג האוויר עשוי להשפיע על תוכנית בחוץ.",
    chatNotifications: "התראות צ'אט",
    chatNotificationsCopy: "קבל התראה כשיש הודעות חדשות בצ'אטים של מפגשים.",
    quietNotifications: "התראות שקטות",
    quietNotificationsCopy: "שמור על התראות עדינות וללא משיכת תשומת לב חזקה.",
    locationDiscovery: "מיקום וגילוי",
    useApproximateLocation: "שימוש במיקום מקורב",
    useApproximateLocationCopy: "הצג אפשרויות קרובות בלי לשתף מיקום מדויק.",
    showDistanceInMeetups: "הצג מרחק במפגשים",
    showDistanceInMeetupsCopy: "הצג מרחק משוער בכרטיסי אירועים ומפגשים.",
    safetyContact: "בטיחות ויצירת קשר",
    allowMessageRequests: "אפשר בקשות הודעה",
    allowMessageRequestsCopy: "אפשר לאנשים לשלוח הודעה לפני שאתם באותו מפגש.",
    safetyCheckIns: "בדיקות בטיחות",
    safetyCheckInsCopy: "הפעל תזכורות עדינות סביב מפגשים שהצטרפת אליהם.",
    restartOnboarding: "התחלת ההיכרות עם SoftHello מחדש",
    restartOnboardingCopy: "בדיקה מחדש של גיל, אזור, כוונה, כינוי, תמונה והעדפות חשיפה.",
    restartOnboardingAction: "התחלה",
    searchLanguage: "חיפוש שפה…",
    noLanguageFound: "לא נמצאה שפה",
  },
  Hindi: {
    title: "सेटिंग्स और गोपनीयता",
    subtitle: "चुनें कि दूसरे आपको कैसे देखें।",
    translations: "अनुवाद",
    blurProfilePhoto: "प्रोफ़ाइल फ़ोटो धुंधली करें",
    blurProfilePhotoCopy: "जब तक आप न चाहें, अपनी फ़ोटो को नरम रखें।",
    privateProfile: "निजी प्रोफ़ाइल",
    privateProfileCopy: "डिस्कवरी सतहों पर प्रोफ़ाइल विवरण सीमित करें।",
    showFirstNameOnly: "केवल पहला नाम दिखाएँ",
    showFirstNameOnlyCopy: "मीटअप और चैट में अपना पहला नाम उपयोग करें।",
    sameAgeGroupsOnly: "सिर्फ समान आयु समूह दिखाएँ",
    sameAgeGroupsOnlyCopy: "करीब आयु वाले लोगों के मीटअप को प्राथमिकता दें।",
    revealAfterRsvp: "RSVP के बाद ही प्रोफ़ाइल दिखाएँ",
    revealAfterRsvpCopy: "दोनों पक्षों की सहमति के बाद प्रोफ़ाइल दिखाएँ।",
    friendsOfFriendsOnly: "केवल दोस्तों के दोस्त",
    friendsOfFriendsOnlyCopy: "अपने भरोसेमंद नेटवर्क से जुड़े लोगों को प्राथमिकता दें।",
    appLanguage: "ऐप भाषा",
    appLanguageCopy: "NSN में उपयोग की जाने वाली भाषा चुनें।",
    translateMeetupsChats: "मीटअप और चैट का अनुवाद करें",
    translateMeetupsChatsCopy: "इवेंट विवरण और चैट संदेश इस भाषा में दिखाएँ।",
    restartOnboarding: "SoftHello परिचय फिर शुरू करें",
    restartOnboardingCopy: "उम्र, उपनगर, इरादा, नाम, फ़ोटो और दृश्यता विकल्प फिर से देखें।",
    restartOnboardingAction: "शुरू करें",
    searchLanguage: "भाषा खोजें…",
    noLanguageFound: "भाषा नहीं मिली",
  },
  Italian: {
    title: "Impostazioni e privacy",
    subtitle: "Scegli come vuoi essere visto dagli altri.",
    translations: "Traduzioni",
    blurProfilePhoto: "Sfoca la foto profilo",
    blurProfilePhotoCopy: "Mantieni la foto sfocata finché non scegli diversamente.",
    privateProfile: "Profilo privato",
    privateProfileCopy: "Limita i dettagli del profilo nelle aree di scoperta.",
    showFirstNameOnly: "Mostra solo il nome",
    showFirstNameOnlyCopy: "Usa il tuo nome nei meetup e nelle chat.",
    sameAgeGroupsOnly: "Mostrami solo gruppi di età simile",
    sameAgeGroupsOnlyCopy: "Dai priorità ai meetup con persone di età simile.",
    revealAfterRsvp: "Mostra il profilo solo dopo RSVP",
    revealAfterRsvpCopy: "Mostra il profilo quando entrambi confermano il piano.",
    friendsOfFriendsOnly: "Solo amici di amici",
    friendsOfFriendsOnlyCopy: "Preferisci persone collegate alla tua rete fidata.",
    appLanguage: "Lingua dell'app",
    appLanguageCopy: "Scegli la lingua usata in NSN.",
    translateMeetupsChats: "Traduci meetup e chat",
    translateMeetupsChatsCopy: "Mostra dettagli eventi e messaggi in questa lingua.",
  },
  Japanese: {
    title: "設定とプライバシー",
    subtitle: "他の人にどう見えるかを選びます。",
    translations: "翻訳",
    blurProfilePhoto: "プロフィール写真をぼかす",
    blurProfilePhotoCopy: "必要になるまで写真をぼかして表示します。",
    privateProfile: "非公開プロフィール",
    privateProfileCopy: "発見画面で表示されるプロフィール情報を制限します。",
    showFirstNameOnly: "名だけを表示",
    showFirstNameOnlyCopy: "ミートアップとチャットで名だけを使います。",
    sameAgeGroupsOnly: "同年代のグループのみ表示",
    sameAgeGroupsOnlyCopy: "近い年齢層の人がいるミートアップを優先します。",
    revealAfterRsvp: "RSVP後のみプロフィールを表示",
    revealAfterRsvpCopy: "双方が予定に同意した後にプロフィールを表示します。",
    friendsOfFriendsOnly: "友達の友達のみ",
    friendsOfFriendsOnlyCopy: "信頼できるネットワークにつながる人を優先します。",
    appLanguage: "アプリの言語",
    appLanguageCopy: "NSNで使う言語を選びます。",
    translateMeetupsChats: "ミートアップとチャットを翻訳",
    translateMeetupsChatsCopy: "イベント詳細とチャットをこの言語で表示します。",
    restartOnboarding: "SoftHelloの案内をやり直す",
    restartOnboardingCopy: "年齢、地域、目的、ニックネーム、写真、表示設定を見直します。",
    restartOnboardingAction: "開始",
    searchLanguage: "言語を検索…",
    noLanguageFound: "言語が見つかりません",
  },
  Korean: {
    title: "설정 및 개인정보",
    subtitle: "다른 사람에게 어떻게 보일지 선택하세요.",
    translations: "번역",
    blurProfilePhoto: "프로필 사진 흐리게 하기",
    blurProfilePhotoCopy: "원할 때까지 사진을 부드럽게 흐리게 유지합니다.",
    privateProfile: "비공개 프로필",
    privateProfileCopy: "탐색 화면에서 프로필 세부 정보를 제한합니다.",
    showFirstNameOnly: "이름만 표시",
    showFirstNameOnlyCopy: "모임과 채팅에서 이름만 사용합니다.",
    sameAgeGroupsOnly: "비슷한 연령대만 표시",
    sameAgeGroupsOnlyCopy: "비슷한 나이대의 사람들이 있는 모임을 우선합니다.",
    revealAfterRsvp: "RSVP 후에만 프로필 공개",
    revealAfterRsvpCopy: "양쪽이 계획에 동의한 뒤 프로필을 보여줍니다.",
    friendsOfFriendsOnly: "친구의 친구만",
    friendsOfFriendsOnlyCopy: "신뢰할 수 있는 네트워크와 연결된 사람을 선호합니다.",
    appLanguage: "앱 언어",
    appLanguageCopy: "NSN에서 사용할 언어를 선택하세요.",
    translateMeetupsChats: "모임과 채팅 번역",
    translateMeetupsChatsCopy: "이벤트 정보와 채팅 메시지를 이 언어로 표시합니다.",
    restartOnboarding: "SoftHello 온보딩 다시 시작",
    restartOnboardingCopy: "나이, 지역, 의도, 닉네임, 사진, 공개 설정을 다시 확인합니다.",
    restartOnboardingAction: "시작",
    searchLanguage: "언어 검색…",
    noLanguageFound: "언어를 찾을 수 없습니다",
  },
  Persian: {
    title: "تنظیمات و حریم خصوصی",
    subtitle: "انتخاب کنید دیگران شما را چگونه ببینند.",
    translations: "ترجمه‌ها",
    blurProfilePhoto: "محو کردن عکس پروفایل",
    blurProfilePhotoCopy: "عکس خود را تا زمانی که بخواهید نرم و محو نگه دارید.",
    privateProfile: "پروفایل خصوصی",
    privateProfileCopy: "جزئیات پروفایل را در بخش‌های کشف محدود کنید.",
    showFirstNameOnly: "فقط نام کوچک را نشان بده",
    showFirstNameOnlyCopy: "در دیدارها و چت‌ها از نام کوچک استفاده کنید.",
    sameAgeGroupsOnly: "فقط گروه‌های سنی مشابه را نشان بده",
    sameAgeGroupsOnlyCopy: "دیدارهای افراد با سن نزدیک را در اولویت بگذارید.",
    revealAfterRsvp: "نمایش پروفایل فقط بعد از RSVP",
    revealAfterRsvpCopy: "پس از تعهد هر دو طرف به برنامه، پروفایل را نشان بده.",
    friendsOfFriendsOnly: "فقط دوستانِ دوستان",
    friendsOfFriendsOnlyCopy: "افراد متصل به شبکه قابل اعتماد خود را ترجیح دهید.",
    appLanguage: "زبان برنامه",
    appLanguageCopy: "زبان استفاده‌شده در NSN را انتخاب کنید.",
    translateMeetupsChats: "ترجمه دیدارها و چت‌ها",
    translateMeetupsChatsCopy: "جزئیات رویداد و پیام‌ها را به این زبان نشان دهید.",
    restartOnboarding: "شروع دوباره آشنایی با SoftHello",
    restartOnboardingCopy: "سن، محله، نیت، نام، عکس و گزینه‌های نمایش را دوباره مرور کنید.",
    restartOnboardingAction: "شروع",
    searchLanguage: "جستجوی زبان…",
    noLanguageFound: "زبانی پیدا نشد",
  },
  Spanish: {
    title: "Configuración y privacidad",
    subtitle: "Elige cómo quieres que otros te vean.",
    translations: "Traducciones",
    blurProfilePhoto: "Difuminar foto de perfil",
    blurProfilePhotoCopy: "Mantén tu foto suavizada hasta que decidas lo contrario.",
    privateProfile: "Perfil privado",
    privateProfileCopy: "Limita los detalles del perfil en las áreas de descubrimiento.",
    showFirstNameOnly: "Mostrar solo el nombre",
    showFirstNameOnlyCopy: "Usa tu nombre en quedadas y chats.",
    sameAgeGroupsOnly: "Mostrar solo grupos de edad similar",
    sameAgeGroupsOnlyCopy: "Prioriza quedadas con personas de edad similar.",
    revealAfterRsvp: "Revelar perfil solo después de RSVP",
    revealAfterRsvpCopy: "Muestra tu perfil cuando ambas partes confirmen el plan.",
    friendsOfFriendsOnly: "Solo amigos de amigos",
    friendsOfFriendsOnlyCopy: "Prefiere personas conectadas a tu red de confianza.",
    appLanguage: "Idioma de la app",
    appLanguageCopy: "Elige el idioma usado en NSN.",
    translateMeetupsChats: "Traducir quedadas y chats",
    translateMeetupsChatsCopy: "Muestra detalles de eventos y mensajes en este idioma.",
    restartOnboarding: "Reiniciar bienvenida de SoftHello",
    restartOnboardingCopy: "Revisa edad, suburbio, intención, apodo, foto y visibilidad.",
    restartOnboardingAction: "Empezar",
    searchLanguage: "Buscar idioma...",
    noLanguageFound: "No se encontró idioma",
  },
  Urdu: {
    title: "ترتیبات اور رازداری",
    subtitle: "منتخب کریں کہ دوسرے آپ کو کیسے دیکھیں۔",
    translations: "تراجم",
    blurProfilePhoto: "پروفائل تصویر دھندلی کریں",
    blurProfilePhotoCopy: "جب تک آپ چاہیں اپنی تصویر نرم اور دھندلی رکھیں۔",
    privateProfile: "نجی پروفائل",
    privateProfileCopy: "دریافت کے حصوں میں پروفائل کی تفصیلات محدود کریں۔",
    showFirstNameOnly: "صرف پہلا نام دکھائیں",
    showFirstNameOnlyCopy: "میٹ اپس اور چیٹس میں اپنا پہلا نام استعمال کریں۔",
    sameAgeGroupsOnly: "صرف ہم عمر گروپس دکھائیں",
    sameAgeGroupsOnlyCopy: "قریب عمر کے لوگوں والے میٹ اپس کو ترجیح دیں۔",
    revealAfterRsvp: "RSVP کے بعد ہی پروفائل دکھائیں",
    revealAfterRsvpCopy: "جب دونوں طرف سے منصوبہ پکا ہو جائے تو پروفائل دکھائیں۔",
    friendsOfFriendsOnly: "صرف دوستوں کے دوست",
    friendsOfFriendsOnlyCopy: "اپنے قابل اعتماد نیٹ ورک سے جڑے لوگوں کو ترجیح دیں۔",
    appLanguage: "ایپ کی زبان",
    appLanguageCopy: "NSN میں استعمال ہونے والی زبان منتخب کریں۔",
    translateMeetupsChats: "میٹ اپس اور چیٹس کا ترجمہ",
    translateMeetupsChatsCopy: "ایونٹ کی تفصیلات اور چیٹ پیغامات اس زبان میں دکھائیں۔",
    restartOnboarding: "SoftHello تعارف دوبارہ شروع کریں",
    restartOnboardingCopy: "عمر، علاقہ، ارادہ، نام، تصویر اور نمائش کے انتخاب دوبارہ دیکھیں۔",
    restartOnboardingAction: "شروع کریں",
    searchLanguage: "زبان تلاش کریں…",
    noLanguageFound: "زبان نہیں ملی",
  },
  Bengali: {
    title: "সেটিংস ও গোপনীয়তা",
    subtitle: "অন্যরা আপনাকে কীভাবে দেখবে তা বেছে নিন।",
    translations: "অনুবাদ",
    blurProfilePhoto: "প্রোফাইল ছবি ঝাপসা করুন",
    blurProfilePhotoCopy: "আপনি না চাইলে আপনার ছবি নরমভাবে ঝাপসা রাখা হবে।",
    privateProfile: "ব্যক্তিগত প্রোফাইল",
    privateProfileCopy: "ডিসকভারি অংশে প্রোফাইলের বিস্তারিত সীমিত করুন।",
    showFirstNameOnly: "শুধু প্রথম নাম দেখান",
    showFirstNameOnlyCopy: "মিটআপ ও চ্যাটে আপনার প্রথম নাম ব্যবহার করুন।",
    sameAgeGroupsOnly: "শুধু কাছাকাছি বয়সের গ্রুপ দেখান",
    sameAgeGroupsOnlyCopy: "একই ধরনের বয়সের মানুষের মিটআপকে অগ্রাধিকার দিন।",
    revealAfterRsvp: "RSVP করার পরই প্রোফাইল দেখান",
    revealAfterRsvpCopy: "দুই পক্ষ পরিকল্পনায় রাজি হলে আপনার প্রোফাইল দেখান।",
    friendsOfFriendsOnly: "শুধু বন্ধুদের বন্ধু",
    friendsOfFriendsOnlyCopy: "আপনার বিশ্বস্ত নেটওয়ার্কের সঙ্গে যুক্ত মানুষদের অগ্রাধিকার দিন।",
    appLanguage: "অ্যাপের ভাষা",
    appLanguageCopy: "NSN-এ ব্যবহৃত ভাষা বেছে নিন।",
    translateMeetupsChats: "মিটআপ ও চ্যাট অনুবাদ করুন",
    translateMeetupsChatsCopy: "ইভেন্টের বিস্তারিত ও চ্যাট বার্তা এই ভাষায় দেখান।",
    restartOnboarding: "SoftHello পরিচিতি আবার শুরু করুন",
    restartOnboardingCopy: "বয়স, এলাকা, উদ্দেশ্য, নাম, ছবি ও দৃশ্যমানতার পছন্দ আবার দেখুন।",
    restartOnboardingAction: "শুরু করুন",
    searchLanguage: "ভাষা খুঁজুন…",
    noLanguageFound: "কোনো ভাষা পাওয়া যায়নি",
  },
  Danish: {
    title: "Indstillinger og privatliv",
    subtitle: "Vælg, hvordan andre skal se dig.",
    translations: "Oversættelser",
    blurProfilePhoto: "Slør profilbillede",
    blurProfilePhotoCopy: "Hold dit billede sløret, indtil du vælger andet.",
    privateProfile: "Privat profil",
    privateProfileCopy: "Begræns profildetaljer i opdagelsesområder.",
    showFirstNameOnly: "Vis kun fornavn",
    showFirstNameOnlyCopy: "Brug dit fornavn i meetups og chats.",
    sameAgeGroupsOnly: "Vis kun samme aldersgrupper",
    sameAgeGroupsOnlyCopy: "Prioritér meetups med personer i en lignende alder.",
    revealAfterRsvp: "Vis kun profil efter RSVP",
    revealAfterRsvpCopy: "Vis din profil, når begge sider har sagt ja til planen.",
    friendsOfFriendsOnly: "Kun venners venner",
    friendsOfFriendsOnlyCopy: "Foretræk personer forbundet gennem dit betroede netværk.",
    appLanguage: "Appsprog",
    appLanguageCopy: "Vælg sproget, der bruges i NSN.",
    translateMeetupsChats: "Oversæt meetups og chats",
    translateMeetupsChatsCopy: "Vis eventdetaljer og chatbeskeder på dette sprog.",
  },
  Dutch: {
    title: "Instellingen en privacy",
    subtitle: "Kies hoe anderen jou mogen zien.",
    translations: "Vertalingen",
    blurProfilePhoto: "Profielfoto vervagen",
    blurProfilePhotoCopy: "Houd je foto verzacht totdat je anders kiest.",
    privateProfile: "Privéprofiel",
    privateProfileCopy: "Beperk profielgegevens in ontdekkingsoverzichten.",
    showFirstNameOnly: "Alleen voornaam tonen",
    showFirstNameOnlyCopy: "Gebruik je voornaam in meetups en chats.",
    sameAgeGroupsOnly: "Alleen vergelijkbare leeftijdsgroepen tonen",
    sameAgeGroupsOnlyCopy: "Geef voorrang aan meetups met mensen van vergelijkbare leeftijd.",
    revealAfterRsvp: "Profiel pas tonen na RSVP",
    revealAfterRsvpCopy: "Toon je profiel zodra beide kanten met het plan instemmen.",
    friendsOfFriendsOnly: "Alleen vrienden van vrienden",
    friendsOfFriendsOnlyCopy: "Geef voorkeur aan mensen uit je vertrouwde netwerk.",
    appLanguage: "App-taal",
    appLanguageCopy: "Kies de taal die NSN gebruikt.",
    translateMeetupsChats: "Meetups en chats vertalen",
    translateMeetupsChatsCopy: "Toon eventdetails en chatberichten in deze taal.",
  },
  Filipino: {
    title: "Mga Setting at Privacy",
    subtitle: "Piliin kung paano ka makikita ng iba.",
    translations: "Mga salin",
    blurProfilePhoto: "Palabuhin ang profile photo",
    blurProfilePhotoCopy: "Panatilihing malabo ang larawan hanggang pumili ka ng iba.",
    privateProfile: "Pribadong profile",
    privateProfileCopy: "Limitahan ang detalye ng profile sa discovery surfaces.",
    showFirstNameOnly: "Ipakita lang ang unang pangalan",
    showFirstNameOnlyCopy: "Gamitin ang unang pangalan sa meetups at chats.",
    sameAgeGroupsOnly: "Ipakita lang ang kaparehong age groups",
    sameAgeGroupsOnlyCopy: "Unahin ang meetups kasama ang taong nasa katulad na edad.",
    revealAfterRsvp: "Ipakita lang ang profile pagkatapos ng RSVP",
    revealAfterRsvpCopy: "Ipakita ang profile kapag parehong panig ay committed na sa plano.",
    friendsOfFriendsOnly: "Friends-of-friends lang",
    friendsOfFriendsOnlyCopy: "Unahin ang taong konektado sa trusted network mo.",
    appLanguage: "Wika ng app",
    appLanguageCopy: "Piliin ang wikang gagamitin sa NSN.",
    translateMeetupsChats: "Isalin ang meetups at chats",
    translateMeetupsChatsCopy: "Ipakita ang event details at chat messages sa wikang ito.",
    restartOnboarding: "Simulan muli ang SoftHello onboarding",
    restartOnboardingCopy: "Balikan ang edad, lugar, layunin, pangalan, larawan at visibility choices.",
    restartOnboardingAction: "Simulan",
    searchLanguage: "Maghanap ng wika…",
    noLanguageFound: "Walang nahanap na wika",
  },
  Finnish: {
    title: "Asetukset ja yksityisyys",
    subtitle: "Valitse, miten muut näkevät sinut.",
    translations: "Käännökset",
    blurProfilePhoto: "Sumenna profiilikuva",
    blurProfilePhotoCopy: "Pidä kuva pehmennettynä, kunnes valitset toisin.",
    privateProfile: "Yksityinen profiili",
    privateProfileCopy: "Rajoita profiilitietoja löytönäkymissä.",
    showFirstNameOnly: "Näytä vain etunimi",
    showFirstNameOnlyCopy: "Käytä etunimeäsi tapaamisissa ja chateissa.",
    sameAgeGroupsOnly: "Näytä vain samat ikäryhmät",
    sameAgeGroupsOnlyCopy: "Suosi tapaamisia samanikäisten ihmisten kanssa.",
    revealAfterRsvp: "Näytä profiili vasta RSVP:n jälkeen",
    revealAfterRsvpCopy: "Näytä profiilisi, kun molemmat osapuolet ovat sitoutuneet suunnitelmaan.",
    friendsOfFriendsOnly: "Vain kavereiden kaverit",
    friendsOfFriendsOnlyCopy: "Suosi luotetun verkostosi kautta yhdistyviä ihmisiä.",
    appLanguage: "Sovelluksen kieli",
    appLanguageCopy: "Valitse NSN:ssä käytettävä kieli.",
    translateMeetupsChats: "Käännä tapaamiset ja chatit",
    translateMeetupsChatsCopy: "Näytä tapahtumatiedot ja chat-viestit tällä kielellä.",
  },
  Greek: {
    title: "Ρυθμίσεις και απόρρητο",
    subtitle: "Επιλέξτε πώς θέλετε να σας βλέπουν οι άλλοι.",
    translations: "Μεταφράσεις",
    blurProfilePhoto: "Θόλωμα φωτογραφίας προφίλ",
    blurProfilePhotoCopy: "Κρατήστε τη φωτογραφία σας θολή μέχρι να επιλέξετε αλλιώς.",
    privateProfile: "Ιδιωτικό προφίλ",
    privateProfileCopy: "Περιορίστε τις λεπτομέρειες προφίλ στις περιοχές ανακάλυψης.",
    showFirstNameOnly: "Εμφάνιση μόνο μικρού ονόματος",
    showFirstNameOnlyCopy: "Χρησιμοποιήστε το μικρό σας όνομα σε meetups και chats.",
    sameAgeGroupsOnly: "Μόνο παρόμοιες ηλικιακές ομάδες",
    sameAgeGroupsOnlyCopy: "Δώστε προτεραιότητα σε meetups με άτομα παρόμοιας ηλικίας.",
    revealAfterRsvp: "Εμφάνιση προφίλ μόνο μετά το RSVP",
    revealAfterRsvpCopy: "Εμφανίστε το προφίλ σας όταν και οι δύο πλευρές δεσμευτούν στο σχέδιο.",
    friendsOfFriendsOnly: "Μόνο φίλοι φίλων",
    friendsOfFriendsOnlyCopy: "Προτιμήστε άτομα συνδεδεμένα με το αξιόπιστο δίκτυό σας.",
    appLanguage: "Γλώσσα εφαρμογής",
    appLanguageCopy: "Επιλέξτε τη γλώσσα που χρησιμοποιείται στο NSN.",
    translateMeetupsChats: "Μετάφραση meetups και chats",
    translateMeetupsChatsCopy: "Εμφάνιση λεπτομερειών εκδηλώσεων και μηνυμάτων σε αυτή τη γλώσσα.",
  },
  Indonesian: {
    title: "Pengaturan & Privasi",
    subtitle: "Pilih bagaimana orang lain melihat Anda.",
    translations: "Terjemahan",
    blurProfilePhoto: "Buramkan foto profil",
    blurProfilePhotoCopy: "Biarkan foto Anda lembut hingga Anda memilih sebaliknya.",
    privateProfile: "Profil privat",
    privateProfileCopy: "Batasi detail profil di area penemuan.",
    showFirstNameOnly: "Tampilkan nama depan saja",
    showFirstNameOnlyCopy: "Gunakan nama depan Anda di meetup dan chat.",
    sameAgeGroupsOnly: "Hanya tampilkan kelompok usia serupa",
    sameAgeGroupsOnlyCopy: "Prioritaskan meetup dengan orang dalam rentang usia serupa.",
    revealAfterRsvp: "Tampilkan profil hanya setelah RSVP",
    revealAfterRsvpCopy: "Tampilkan profil Anda setelah kedua pihak berkomitmen pada rencana.",
    friendsOfFriendsOnly: "Hanya teman dari teman",
    friendsOfFriendsOnlyCopy: "Prioritaskan orang yang terhubung melalui jaringan tepercaya Anda.",
    appLanguage: "Bahasa aplikasi",
    appLanguageCopy: "Pilih bahasa yang digunakan di NSN.",
    translateMeetupsChats: "Terjemahkan meetup dan chat",
    translateMeetupsChatsCopy: "Tampilkan detail event dan pesan chat dalam bahasa ini.",
    restartOnboarding: "Mulai ulang perkenalan SoftHello",
    restartOnboardingCopy: "Tinjau usia, area, niat, nama, foto, dan pilihan visibilitas.",
    restartOnboardingAction: "Mulai",
    searchLanguage: "Cari bahasa…",
    noLanguageFound: "Bahasa tidak ditemukan",
  },
  Malay: {
    title: "Tetapan & Privasi",
    subtitle: "Pilih cara orang lain melihat anda.",
    translations: "Terjemahan",
    blurProfilePhoto: "Kaburkan foto profil",
    blurProfilePhotoCopy: "Pastikan foto anda dikaburkan sehingga anda memilih sebaliknya.",
    privateProfile: "Profil peribadi",
    privateProfileCopy: "Hadkan butiran profil pada ruang penemuan.",
    showFirstNameOnly: "Tunjukkan nama pertama sahaja",
    showFirstNameOnlyCopy: "Gunakan nama pertama anda dalam meetup dan chat.",
    sameAgeGroupsOnly: "Tunjukkan kumpulan umur yang sama sahaja",
    sameAgeGroupsOnlyCopy: "Utamakan meetup dengan orang dalam julat umur serupa.",
    revealAfterRsvp: "Dedahkan profil hanya selepas RSVP",
    revealAfterRsvpCopy: "Tunjukkan profil apabila kedua-dua pihak bersetuju dengan rancangan.",
    friendsOfFriendsOnly: "Rakan kepada rakan sahaja",
    friendsOfFriendsOnlyCopy: "Utamakan orang yang berkaitan melalui rangkaian dipercayai anda.",
    appLanguage: "Bahasa aplikasi",
    appLanguageCopy: "Pilih bahasa yang digunakan dalam NSN.",
    translateMeetupsChats: "Terjemah meetup dan chat",
    translateMeetupsChatsCopy: "Tunjukkan butiran acara dan mesej chat dalam bahasa ini.",
    restartOnboarding: "Mulakan semula pengenalan SoftHello",
    restartOnboardingCopy: "Semak umur, kawasan, niat, nama, foto dan pilihan keterlihatan.",
    restartOnboardingAction: "Mula",
    searchLanguage: "Cari bahasa…",
    noLanguageFound: "Bahasa tidak ditemui",
  },
  Norwegian: {
    title: "Innstillinger og personvern",
    subtitle: "Velg hvordan andre skal se deg.",
    translations: "Oversettelser",
    blurProfilePhoto: "Slør profilbilde",
    blurProfilePhotoCopy: "Hold bildet ditt sløret til du velger noe annet.",
    privateProfile: "Privat profil",
    privateProfileCopy: "Begrens profildetaljer i oppdagelsesflater.",
    showFirstNameOnly: "Vis bare fornavn",
    showFirstNameOnlyCopy: "Bruk fornavnet ditt i meetups og chatter.",
    sameAgeGroupsOnly: "Vis bare samme aldersgrupper",
    sameAgeGroupsOnlyCopy: "Prioriter meetups med personer i lignende alder.",
    revealAfterRsvp: "Vis profil bare etter RSVP",
    revealAfterRsvpCopy: "Vis profilen din når begge sider har forpliktet seg til planen.",
    friendsOfFriendsOnly: "Bare venners venner",
    friendsOfFriendsOnlyCopy: "Foretrekk personer koblet gjennom ditt betrodde nettverk.",
    appLanguage: "Appspråk",
    appLanguageCopy: "Velg språket som brukes i NSN.",
    translateMeetupsChats: "Oversett meetups og chatter",
    translateMeetupsChatsCopy: "Vis arrangementsdetaljer og chatmeldinger på dette språket.",
  },
  Polish: {
    title: "Ustawienia i prywatność",
    subtitle: "Wybierz, jak inni mają Cię widzieć.",
    translations: "Tłumaczenia",
    blurProfilePhoto: "Rozmyj zdjęcie profilowe",
    blurProfilePhotoCopy: "Zachowaj zdjęcie rozmyte, dopóki nie wybierzesz inaczej.",
    privateProfile: "Profil prywatny",
    privateProfileCopy: "Ogranicz szczegóły profilu w miejscach odkrywania.",
    showFirstNameOnly: "Pokaż tylko imię",
    showFirstNameOnlyCopy: "Używaj imienia w spotkaniach i czatach.",
    sameAgeGroupsOnly: "Pokazuj tylko podobne grupy wiekowe",
    sameAgeGroupsOnlyCopy: "Priorytetowo traktuj spotkania z osobami w podobnym wieku.",
    revealAfterRsvp: "Pokaż profil dopiero po RSVP",
    revealAfterRsvpCopy: "Pokaż profil, gdy obie strony potwierdzą plan.",
    friendsOfFriendsOnly: "Tylko znajomi znajomych",
    friendsOfFriendsOnlyCopy: "Preferuj osoby połączone przez zaufaną sieć.",
    appLanguage: "Język aplikacji",
    appLanguageCopy: "Wybierz język używany w NSN.",
    translateMeetupsChats: "Tłumacz spotkania i czaty",
    translateMeetupsChatsCopy: "Pokazuj szczegóły wydarzeń i wiadomości w tym języku.",
  },
  Portuguese: {
    title: "Definições e privacidade",
    subtitle: "Escolha como quer que os outros o vejam.",
    translations: "Traduções",
    blurProfilePhoto: "Desfocar foto de perfil",
    blurProfilePhotoCopy: "Mantenha a foto suavizada até escolher o contrário.",
    privateProfile: "Perfil privado",
    privateProfileCopy: "Limite detalhes do perfil nas áreas de descoberta.",
    showFirstNameOnly: "Mostrar apenas o primeiro nome",
    showFirstNameOnlyCopy: "Use o primeiro nome em encontros e chats.",
    sameAgeGroupsOnly: "Mostrar apenas grupos da mesma idade",
    sameAgeGroupsOnlyCopy: "Priorize encontros com pessoas de idade semelhante.",
    revealAfterRsvp: "Revelar perfil só após RSVP",
    revealAfterRsvpCopy: "Mostre o perfil quando ambos confirmarem o plano.",
    friendsOfFriendsOnly: "Apenas amigos de amigos",
    friendsOfFriendsOnlyCopy: "Prefira pessoas ligadas à sua rede de confiança.",
    appLanguage: "Idioma da app",
    appLanguageCopy: "Escolha o idioma usado no NSN.",
    translateMeetupsChats: "Traduzir encontros e chats",
    translateMeetupsChatsCopy: "Mostrar detalhes de eventos e mensagens neste idioma.",
  },
  Romanian: {
    title: "Setări și confidențialitate",
    subtitle: "Alege cum vrei să te vadă ceilalți.",
    translations: "Traduceri",
    blurProfilePhoto: "Estompează fotografia de profil",
    blurProfilePhotoCopy: "Păstrează fotografia estompată până alegi altfel.",
    privateProfile: "Profil privat",
    privateProfileCopy: "Limitează detaliile profilului în zonele de descoperire.",
    showFirstNameOnly: "Afișează doar prenumele",
    showFirstNameOnlyCopy: "Folosește prenumele în întâlniri și chaturi.",
    sameAgeGroupsOnly: "Arată doar grupuri de vârstă similare",
    sameAgeGroupsOnlyCopy: "Prioritizează întâlnirile cu persoane de vârstă apropiată.",
    revealAfterRsvp: "Afișează profilul doar după RSVP",
    revealAfterRsvpCopy: "Arată profilul când ambele părți au confirmat planul.",
    friendsOfFriendsOnly: "Doar prietenii prietenilor",
    friendsOfFriendsOnlyCopy: "Preferă persoane conectate prin rețeaua ta de încredere.",
    appLanguage: "Limba aplicației",
    appLanguageCopy: "Alege limba folosită în NSN.",
    translateMeetupsChats: "Tradu întâlniri și chaturi",
    translateMeetupsChatsCopy: "Arată detalii de eveniment și mesaje în această limbă.",
  },
  Russian: {
    title: "Настройки и конфиденциальность",
    subtitle: "Выберите, как другие будут видеть вас.",
    translations: "Переводы",
    blurProfilePhoto: "Размыть фото профиля",
    blurProfilePhotoCopy: "Оставляйте фото размытым, пока не выберете иначе.",
    privateProfile: "Закрытый профиль",
    privateProfileCopy: "Ограничьте детали профиля в разделах поиска.",
    showFirstNameOnly: "Показывать только имя",
    showFirstNameOnlyCopy: "Используйте имя в встречах и чатах.",
    sameAgeGroupsOnly: "Показывать только похожие возрастные группы",
    sameAgeGroupsOnlyCopy: "Отдавайте приоритет встречам с людьми похожего возраста.",
    revealAfterRsvp: "Показывать профиль только после RSVP",
    revealAfterRsvpCopy: "Показывайте профиль, когда обе стороны подтвердили план.",
    friendsOfFriendsOnly: "Только друзья друзей",
    friendsOfFriendsOnlyCopy: "Предпочитайте людей из вашей доверенной сети.",
    appLanguage: "Язык приложения",
    appLanguageCopy: "Выберите язык, используемый в NSN.",
    translateMeetupsChats: "Переводить встречи и чаты",
    translateMeetupsChatsCopy: "Показывать детали событий и сообщения чата на этом языке.",
    restartOnboarding: "Перезапустить знакомство с SoftHello",
    restartOnboardingCopy: "Снова выбрать возраст, район, цель, имя, фото и видимость.",
    restartOnboardingAction: "Начать",
    searchLanguage: "Поиск языка...",
    noLanguageFound: "Язык не найден",
  },
  Swedish: {
    title: "Inställningar och integritet",
    subtitle: "Välj hur andra ska se dig.",
    translations: "Översättningar",
    blurProfilePhoto: "Sudda profilbild",
    blurProfilePhotoCopy: "Håll din bild mjukad tills du väljer annat.",
    privateProfile: "Privat profil",
    privateProfileCopy: "Begränsa profildetaljer i upptäcktsytor.",
    showFirstNameOnly: "Visa bara förnamn",
    showFirstNameOnlyCopy: "Använd ditt förnamn i meetups och chattar.",
    sameAgeGroupsOnly: "Visa bara samma åldersgrupper",
    sameAgeGroupsOnlyCopy: "Prioritera meetups med personer i liknande ålder.",
    revealAfterRsvp: "Visa profil först efter RSVP",
    revealAfterRsvpCopy: "Visa din profil när båda sidor har bekräftat planen.",
    friendsOfFriendsOnly: "Endast vänners vänner",
    friendsOfFriendsOnlyCopy: "Föredra personer kopplade via ditt betrodda nätverk.",
    appLanguage: "Appspråk",
    appLanguageCopy: "Välj språket som används i NSN.",
    translateMeetupsChats: "Översätt meetups och chattar",
    translateMeetupsChatsCopy: "Visa eventdetaljer och chattmeddelanden på detta språk.",
  },
  Thai: {
    title: "การตั้งค่าและความเป็นส่วนตัว",
    subtitle: "เลือกว่าต้องการให้คนอื่นเห็นคุณอย่างไร",
    translations: "การแปล",
    blurProfilePhoto: "เบลอรูปโปรไฟล์",
    blurProfilePhotoCopy: "เก็บรูปของคุณให้ดูนุ่ม/เบลอจนกว่าคุณจะเลือกเปลี่ยน",
    privateProfile: "โปรไฟล์ส่วนตัว",
    privateProfileCopy: "จำกัดรายละเอียดโปรไฟล์ในพื้นที่การค้นพบ",
    showFirstNameOnly: "แสดงเฉพาะชื่อจริง",
    showFirstNameOnlyCopy: "ใช้ชื่อจริงของคุณในมีตอัปและแชต",
    sameAgeGroupsOnly: "แสดงเฉพาะกลุ่มอายุใกล้เคียง",
    sameAgeGroupsOnlyCopy: "ให้ความสำคัญกับมีตอัปที่มีคนช่วงอายุใกล้เคียง",
    revealAfterRsvp: "เปิดเผยโปรไฟล์หลัง RSVP เท่านั้น",
    revealAfterRsvpCopy: "แสดงโปรไฟล์เมื่อทั้งสองฝ่ายตกลงเข้าร่วมแผนแล้ว",
    friendsOfFriendsOnly: "เฉพาะเพื่อนของเพื่อน",
    friendsOfFriendsOnlyCopy: "ให้ความสำคัญกับคนที่เชื่อมต่อผ่านเครือข่ายที่ไว้ใจได้",
    appLanguage: "ภาษาของแอป",
    appLanguageCopy: "เลือกภาษาที่ใช้ใน NSN",
    translateMeetupsChats: "แปลมีตอัปและแชต",
    translateMeetupsChatsCopy: "แสดงรายละเอียดกิจกรรมและข้อความแชตในภาษานี้",
    restartOnboarding: "เริ่มแนะนำ SoftHello ใหม่",
    restartOnboardingCopy: "ทบทวนอายุ พื้นที่ ความตั้งใจ ชื่อ รูปภาพ และการมองเห็นอีกครั้ง",
    restartOnboardingAction: "เริ่ม",
    searchLanguage: "ค้นหาภาษา…",
    noLanguageFound: "ไม่พบภาษา",
  },
  Turkish: {
    title: "Ayarlar ve Gizlilik",
    subtitle: "Başkalarının sizi nasıl göreceğini seçin.",
    translations: "Çeviriler",
    blurProfilePhoto: "Profil fotoğrafını bulanıklaştır",
    blurProfilePhotoCopy: "Aksi seçilene kadar fotoğrafınızı yumuşatılmış tutun.",
    privateProfile: "Özel profil",
    privateProfileCopy: "Keşif alanlarında profil ayrıntılarını sınırlandırın.",
    showFirstNameOnly: "Yalnızca adı göster",
    showFirstNameOnlyCopy: "Meetup ve sohbetlerde adınızı kullanın.",
    sameAgeGroupsOnly: "Yalnızca benzer yaş grupları",
    sameAgeGroupsOnlyCopy: "Benzer yaş aralığındaki kişilerle meetup'lara öncelik verin.",
    revealAfterRsvp: "Profili yalnızca RSVP sonrası göster",
    revealAfterRsvpCopy: "İki taraf da plana bağlı kalınca profilinizi gösterin.",
    friendsOfFriendsOnly: "Yalnızca arkadaşların arkadaşları",
    friendsOfFriendsOnlyCopy: "Güvenilir ağınız üzerinden bağlı kişileri tercih edin.",
    appLanguage: "Uygulama dili",
    appLanguageCopy: "NSN'de kullanılacak dili seçin.",
    translateMeetupsChats: "Meetup ve sohbetleri çevir",
    translateMeetupsChatsCopy: "Etkinlik ayrıntılarını ve sohbet mesajlarını bu dilde gösterin.",
    restartOnboarding: "SoftHello başlangıcını yeniden başlat",
    restartOnboardingCopy: "Yaş, bölge, niyet, ad, fotoğraf ve görünürlük seçimlerini yeniden gözden geçir.",
    restartOnboardingAction: "Başla",
    searchLanguage: "Dil ara…",
    noLanguageFound: "Dil bulunamadı",
  },
  Ukrainian: {
    title: "Налаштування та приватність",
    subtitle: "Оберіть, як інші бачитимуть вас.",
    translations: "Переклади",
    blurProfilePhoto: "Розмити фото профілю",
    blurProfilePhotoCopy: "Залишайте фото розмитим, доки не оберете інакше.",
    privateProfile: "Приватний профіль",
    privateProfileCopy: "Обмежте деталі профілю в зонах пошуку.",
    showFirstNameOnly: "Показувати лише ім'я",
    showFirstNameOnlyCopy: "Використовуйте ім'я у зустрічах і чатах.",
    sameAgeGroupsOnly: "Показувати лише схожі вікові групи",
    sameAgeGroupsOnlyCopy: "Надавайте перевагу зустрічам з людьми схожого віку.",
    revealAfterRsvp: "Показувати профіль лише після RSVP",
    revealAfterRsvpCopy: "Показуйте профіль, коли обидві сторони підтвердили план.",
    friendsOfFriendsOnly: "Лише друзі друзів",
    friendsOfFriendsOnlyCopy: "Віддавайте перевагу людям із вашої довіреної мережі.",
    appLanguage: "Мова застосунку",
    appLanguageCopy: "Оберіть мову, яка використовується в NSN.",
    translateMeetupsChats: "Перекладати зустрічі та чати",
    translateMeetupsChatsCopy: "Показувати деталі подій і повідомлення цією мовою.",
  },
  Vietnamese: {
    title: "Cài đặt & quyền riêng tư",
    subtitle: "Chọn cách bạn muốn người khác nhìn thấy mình.",
    translations: "Bản dịch",
    blurProfilePhoto: "Làm mờ ảnh hồ sơ",
    blurProfilePhotoCopy: "Giữ ảnh của bạn được làm mờ cho đến khi bạn chọn khác.",
    privateProfile: "Hồ sơ riêng tư",
    privateProfileCopy: "Giới hạn chi tiết hồ sơ trong các khu vực khám phá.",
    showFirstNameOnly: "Chỉ hiển thị tên",
    showFirstNameOnlyCopy: "Dùng tên của bạn trong meetup và chat.",
    sameAgeGroupsOnly: "Chỉ hiển thị nhóm cùng độ tuổi",
    sameAgeGroupsOnlyCopy: "Ưu tiên meetup với người trong độ tuổi tương tự.",
    revealAfterRsvp: "Chỉ hiển thị hồ sơ sau RSVP",
    revealAfterRsvpCopy: "Hiển thị hồ sơ khi cả hai bên đã cam kết với kế hoạch.",
    friendsOfFriendsOnly: "Chỉ bạn của bạn bè",
    friendsOfFriendsOnlyCopy: "Ưu tiên người được kết nối qua mạng lưới đáng tin cậy.",
    appLanguage: "Ngôn ngữ ứng dụng",
    appLanguageCopy: "Chọn ngôn ngữ dùng trong NSN.",
    translateMeetupsChats: "Dịch meetup và chat",
    translateMeetupsChatsCopy: "Hiển thị chi tiết sự kiện và tin nhắn bằng ngôn ngữ này.",
    restartOnboarding: "Bắt đầu lại phần giới thiệu SoftHello",
    restartOnboardingCopy: "Xem lại tuổi, khu vực, ý định, tên, ảnh và lựa chọn hiển thị.",
    restartOnboardingAction: "Bắt đầu",
    searchLanguage: "Tìm ngôn ngữ…",
    noLanguageFound: "Không tìm thấy ngôn ngữ",
  },
};

const supplementalSettingsTranslations: Record<string, Partial<SettingsCopy>> = {
  Afrikaans: {
    title: "Instellings en privaatheid",
    subtitle: "Kies hoe jy wil hê ander jou moet sien.",
    translations: "Vertalings",
    blurProfilePhoto: "Vervaag profielfoto",
    blurProfilePhotoCopy: "Hou jou foto versag totdat jy anders kies.",
    privateProfile: "Private profiel",
    privateProfileCopy: "Beperk profielbesonderhede op ontdekkingplekke.",
    showFirstNameOnly: "Wys net voornaam",
    showFirstNameOnlyCopy: "Gebruik jou voornaam in ontmoetings en geselsies.",
    sameAgeGroupsOnly: "Wys net soortgelyke ouderdomsgroepe",
    sameAgeGroupsOnlyCopy: "Gee voorkeur aan ontmoetings met mense in 'n soortgelyke ouderdomsgroep.",
    revealAfterRsvp: "Wys profiel eers ná RSVP",
    revealAfterRsvpCopy: "Wys jou profiel sodra albei kante tot die plan verbind is.",
    friendsOfFriendsOnly: "Net vriende van vriende",
    friendsOfFriendsOnlyCopy: "Verkies mense wat deur jou vertroude netwerk verbind is.",
    appLanguage: "Toepassingstaal",
    appLanguageCopy: "Kies die taal wat NSN gebruik.",
    translateMeetupsChats: "Vertaal ontmoetings en geselsies",
    translateMeetupsChatsCopy: "Wys geleentheidbesonderhede en boodskappe in hierdie taal.",
    appearance: "Voorkoms",
    colorPalette: "Kleurpalet",
    colorPaletteCopy: "Kies die stemming en aksentkleure wat jy verkies.",
    notifications: "Kennisgewings",
    locationDiscovery: "Ligging en ontdekking",
    safetyContact: "Veiligheid en kontak",
    restartOnboarding: "Begin SoftHello-kennismaking weer",
    restartOnboardingAction: "Begin",
    searchLanguage: "Soek taal…",
    noLanguageFound: "Geen taal gevind nie",
  },
  Albanian: {
    title: "Cilësimet dhe privatësia",
    subtitle: "Zgjidh si dëshiron të të shohin të tjerët.",
    translations: "Përkthime",
    blurProfilePhoto: "Turbullo foton e profilit",
    blurProfilePhotoCopy: "Mbaje foton të zbutur derisa të zgjedhësh ndryshe.",
    privateProfile: "Profil privat",
    privateProfileCopy: "Kufizo detajet e profilit në hapësirat e zbulimit.",
    showFirstNameOnly: "Shfaq vetëm emrin",
    showFirstNameOnlyCopy: "Përdor emrin në takime dhe biseda.",
    sameAgeGroupsOnly: "Shfaq vetëm grupmosha të ngjashme",
    sameAgeGroupsOnlyCopy: "Jepi përparësi takimeve me njerëz të një moshe të afërt.",
    revealAfterRsvp: "Zbulo profilin vetëm pas RSVP",
    revealAfterRsvpCopy: "Shfaq profilin pasi të dy palët të jenë angazhuar në plan.",
    friendsOfFriendsOnly: "Vetëm miq të miqve",
    friendsOfFriendsOnlyCopy: "Prefero njerëz të lidhur përmes rrjetit tënd të besuar.",
    appLanguage: "Gjuha e aplikacionit",
    appLanguageCopy: "Zgjidh gjuhën që përdoret në NSN.",
    translateMeetupsChats: "Përkthe takimet dhe bisedat",
    translateMeetupsChatsCopy: "Shfaq detajet e eventeve dhe mesazhet në këtë gjuhë.",
    appearance: "Pamja",
    colorPalette: "Paleta e ngjyrave",
    colorPaletteCopy: "Zgjidh atmosferën dhe ngjyrat theksuese që preferon.",
    notifications: "Njoftime",
    locationDiscovery: "Vendndodhja dhe zbulimi",
    safetyContact: "Siguria dhe kontakti",
    restartOnboarding: "Rifillo prezantimin e SoftHello",
    restartOnboardingAction: "Fillo",
    searchLanguage: "Kërko gjuhë…",
    noLanguageFound: "Nuk u gjet gjuhë",
  },
  Armenian: {
    title: "Կարգավորումներ և գաղտնիություն",
    subtitle: "Ընտրեք, թե ինչպես եք ուզում, որ ուրիշները ձեզ տեսնեն։",
    translations: "Թարգմանություններ",
    blurProfilePhoto: "Լղոզել պրոֆիլի լուսանկարը",
    blurProfilePhotoCopy: "Պահեք լուսանկարը մեղմացված, մինչև այլ բան ընտրեք։",
    privateProfile: "Մասնավոր պրոֆիլ",
    privateProfileCopy: "Սահմանափակեք պրոֆիլի մանրամասները հայտնաբերման հատվածներում։",
    showFirstNameOnly: "Ցույց տալ միայն անունը",
    showFirstNameOnlyCopy: "Օգտագործեք ձեր անունը հանդիպումներում և զրույցներում։",
    sameAgeGroupsOnly: "Ցույց տալ միայն նման տարիքային խմբեր",
    sameAgeGroupsOnlyCopy: "Առաջնահերթություն տվեք մոտ տարիք ունեցող մարդկանց հանդիպումներին։",
    revealAfterRsvp: "Բացել պրոֆիլը միայն RSVP-ից հետո",
    revealAfterRsvpCopy: "Ցույց տվեք պրոֆիլը, երբ երկու կողմերն էլ համաձայնել են ծրագրին։",
    friendsOfFriendsOnly: "Միայն ընկերների ընկերներ",
    friendsOfFriendsOnlyCopy: "Նախընտրեք մարդկանց, որոնք կապված են ձեր վստահելի ցանցով։",
    appLanguage: "Հավելվածի լեզու",
    appLanguageCopy: "Ընտրեք NSN-ում օգտագործվող լեզուն։",
    translateMeetupsChats: "Թարգմանել հանդիպումները և զրույցները",
    translateMeetupsChatsCopy: "Ցույց տալ միջոցառման մանրամասները և հաղորդագրությունները այս լեզվով։",
    appearance: "Տեսք",
    colorPalette: "Գունապնակ",
    colorPaletteCopy: "Ընտրեք նախընտրած տրամադրությունն ու շեշտադրման գույները։",
    notifications: "Ծանուցումներ",
    locationDiscovery: "Տեղադրություն և հայտնաբերում",
    safetyContact: "Անվտանգություն և կապ",
    restartOnboarding: "Կրկին սկսել SoftHello ծանոթացումը",
    restartOnboardingAction: "Սկսել",
    searchLanguage: "Որոնել լեզու…",
    noLanguageFound: "Լեզու չի գտնվել",
  },
  Croatian: {
    title: "Postavke i privatnost",
    subtitle: "Odaberi kako želiš da te drugi vide.",
    translations: "Prijevodi",
    blurProfilePhoto: "Zamuti profilnu fotografiju",
    blurProfilePhotoCopy: "Drži fotografiju ublaženom dok ne odabereš drukčije.",
    privateProfile: "Privatni profil",
    privateProfileCopy: "Ograniči detalje profila u prostorima za otkrivanje.",
    showFirstNameOnly: "Prikaži samo ime",
    showFirstNameOnlyCopy: "Koristi ime u susretima i chatovima.",
    sameAgeGroupsOnly: "Prikaži samo slične dobne skupine",
    sameAgeGroupsOnlyCopy: "Daj prednost susretima s ljudima slične dobi.",
    revealAfterRsvp: "Prikaži profil tek nakon RSVP-a",
    revealAfterRsvpCopy: "Prikaži profil kada su se obje strane obvezale na plan.",
    friendsOfFriendsOnly: "Samo prijatelji prijatelja",
    friendsOfFriendsOnlyCopy: "Preferiraj ljude povezane kroz tvoju pouzdanu mrežu.",
    appLanguage: "Jezik aplikacije",
    appLanguageCopy: "Odaberi jezik koji NSN koristi.",
    translateMeetupsChats: "Prevedi susrete i chatove",
    translateMeetupsChatsCopy: "Prikaži detalje događaja i poruke na ovom jeziku.",
    appearance: "Izgled",
    colorPalette: "Paleta boja",
    colorPaletteCopy: "Odaberi raspoloženje i naglasne boje koje preferiraš.",
    notifications: "Obavijesti",
    locationDiscovery: "Lokacija i otkrivanje",
    safetyContact: "Sigurnost i kontakt",
    restartOnboarding: "Ponovno pokreni SoftHello uvod",
    restartOnboardingAction: "Počni",
    searchLanguage: "Pretraži jezik…",
    noLanguageFound: "Jezik nije pronađen",
  },
  Czech: {
    title: "Nastavení a soukromí",
    subtitle: "Vyberte, jak chcete, aby vás ostatní viděli.",
    translations: "Překlady",
    blurProfilePhoto: "Rozmazat profilovou fotku",
    blurProfilePhotoCopy: "Nechte fotku jemně rozmazanou, dokud nezvolíte jinak.",
    privateProfile: "Soukromý profil",
    privateProfileCopy: "Omezte detaily profilu v objevovacích plochách.",
    showFirstNameOnly: "Zobrazit pouze křestní jméno",
    showFirstNameOnlyCopy: "Používejte křestní jméno v setkáních a chatech.",
    sameAgeGroupsOnly: "Zobrazit jen podobné věkové skupiny",
    sameAgeGroupsOnlyCopy: "Upřednostnit setkání s lidmi podobného věku.",
    revealAfterRsvp: "Zobrazit profil až po RSVP",
    revealAfterRsvpCopy: "Ukažte profil, když obě strany potvrdí plán.",
    friendsOfFriendsOnly: "Jen přátelé přátel",
    friendsOfFriendsOnlyCopy: "Preferujte lidi propojené přes vaši důvěryhodnou síť.",
    appLanguage: "Jazyk aplikace",
    appLanguageCopy: "Vyberte jazyk používaný v NSN.",
    translateMeetupsChats: "Překládat setkání a chaty",
    translateMeetupsChatsCopy: "Zobrazovat detaily událostí a zprávy v tomto jazyce.",
    appearance: "Vzhled",
    colorPalette: "Paleta barev",
    colorPaletteCopy: "Vyberte náladu a akcentní barvy, které preferujete.",
    notifications: "Oznámení",
    locationDiscovery: "Poloha a objevování",
    safetyContact: "Bezpečí a kontakt",
    restartOnboarding: "Spustit úvod SoftHello znovu",
    restartOnboardingAction: "Začít",
    searchLanguage: "Hledat jazyk…",
    noLanguageFound: "Jazyk nebyl nalezen",
  },
  Estonian: {
    title: "Seaded ja privaatsus",
    subtitle: "Vali, kuidas soovid, et teised sind näeksid.",
    translations: "Tõlked",
    blurProfilePhoto: "Hägusta profiilifoto",
    blurProfilePhotoCopy: "Hoia foto pehmendatuna, kuni valid teisiti.",
    privateProfile: "Privaatne profiil",
    privateProfileCopy: "Piira profiili üksikasju avastuspindadel.",
    showFirstNameOnly: "Kuva ainult eesnimi",
    showFirstNameOnlyCopy: "Kasuta eesnime kohtumistel ja vestlustes.",
    sameAgeGroupsOnly: "Kuva ainult sarnased vanuserühmad",
    sameAgeGroupsOnlyCopy: "Eelista kohtumisi sarnases vanuses inimestega.",
    revealAfterRsvp: "Ava profiil alles pärast RSVP-d",
    revealAfterRsvpCopy: "Näita profiili, kui mõlemad pooled on plaaniga nõustunud.",
    friendsOfFriendsOnly: "Ainult sõprade sõbrad",
    friendsOfFriendsOnlyCopy: "Eelista inimesi, kes on seotud sinu usaldusvõrgustiku kaudu.",
    appLanguage: "Rakenduse keel",
    appLanguageCopy: "Vali keel, mida NSN kasutab.",
    translateMeetupsChats: "Tõlgi kohtumised ja vestlused",
    translateMeetupsChatsCopy: "Kuva sündmuse üksikasjad ja sõnumid selles keeles.",
    appearance: "Välimus",
    colorPalette: "Värvipalett",
    colorPaletteCopy: "Vali eelistatud meeleolu ja aktsentvärvid.",
    notifications: "Teavitused",
    locationDiscovery: "Asukoht ja avastamine",
    safetyContact: "Turvalisus ja kontakt",
    restartOnboarding: "Alusta SoftHello tutvustust uuesti",
    restartOnboardingAction: "Alusta",
    searchLanguage: "Otsi keelt…",
    noLanguageFound: "Keelt ei leitud",
  },
  Hungarian: {
    title: "Beállítások és adatvédelem",
    subtitle: "Válaszd ki, hogyan lássanak mások.",
    translations: "Fordítások",
    blurProfilePhoto: "Profilfotó elmosása",
    blurProfilePhotoCopy: "Tartsd a fotódat lágyítva, amíg másként nem döntesz.",
    privateProfile: "Privát profil",
    privateProfileCopy: "Korlátozd a profil részleteit a felfedezési felületeken.",
    showFirstNameOnly: "Csak keresztnév megjelenítése",
    showFirstNameOnlyCopy: "Használd a keresztnevedet találkozókon és chatekben.",
    sameAgeGroupsOnly: "Csak hasonló korcsoportokat mutass",
    sameAgeGroupsOnlyCopy: "Részesítsd előnyben a hasonló korú emberekkel való találkozókat.",
    revealAfterRsvp: "Profil megjelenítése csak RSVP után",
    revealAfterRsvpCopy: "A profil akkor jelenjen meg, amikor mindkét fél elköteleződött a terv mellett.",
    friendsOfFriendsOnly: "Csak barátok barátai",
    friendsOfFriendsOnlyCopy: "Részesítsd előnyben a megbízható hálózatodon keresztül kapcsolódó embereket.",
    appLanguage: "Alkalmazás nyelve",
    appLanguageCopy: "Válaszd ki az NSN-ben használt nyelvet.",
    translateMeetupsChats: "Találkozók és chatek fordítása",
    translateMeetupsChatsCopy: "Eseményrészletek és üzenetek megjelenítése ezen a nyelven.",
    appearance: "Megjelenés",
    colorPalette: "Színpaletta",
    colorPaletteCopy: "Válaszd ki a kedvelt hangulatot és kiemelő színeket.",
    notifications: "Értesítések",
    locationDiscovery: "Hely és felfedezés",
    safetyContact: "Biztonság és kapcsolat",
    restartOnboarding: "SoftHello bevezető újraindítása",
    restartOnboardingAction: "Indítás",
    searchLanguage: "Nyelv keresése…",
    noLanguageFound: "Nem található nyelv",
  },
  "Haitian Creole": {
    title: "Anviwònman ak vi prive",
    subtitle: "Chwazi kijan ou vle lòt moun wè ou.",
    accessibility: "Aksesibilite",
    largerText: "Tèks pi gwo",
    largerTextCopy: "Ogmante gwosè tèks sou ekran sa a epi sove preferans lan pou aplikasyon an.",
    highContrast: "Kontras pi fò",
    highContrastCopy: "Ranfòse bordi ak kontras tèks pou li pi fasil pou eskane.",
    reduceMotion: "Diminye mouvman",
    reduceMotionCopy: "Prefere tranzisyon pi kalm ak mwens mouvman dekoratif.",
    screenReaderHints: "Endikasyon pou lektè ekran",
    screenReaderHintsCopy: "Ajoute plis etikèt ak endikasyon pou teknoloji asistans yo.",
    translations: "Tradiksyon",
    blurProfilePhoto: "Bwouye foto pwofil la",
    blurProfilePhotoCopy: "Kenbe foto ou adousi jiskaske ou chwazi otreman.",
    privateProfile: "Pwofil prive",
    privateProfileCopy: "Limite detay pwofil yo nan espas dekouvèt yo.",
    showFirstNameOnly: "Montre sèlman prenon",
    showFirstNameOnlyCopy: "Sèvi ak prenon ou nan rankont ak chat yo.",
    sameAgeGroupsOnly: "Montre sèlman gwoup laj ki sanble",
    sameAgeGroupsOnlyCopy: "Bay rankont ak moun ki gen laj pwòch priyorite.",
    revealAfterRsvp: "Montre pwofil sèlman apre RSVP",
    revealAfterRsvpCopy: "Montre pwofil ou lè toude bò yo dakò ak plan an.",
    friendsOfFriendsOnly: "Sèlman zanmi zanmi",
    friendsOfFriendsOnlyCopy: "Prefere moun ki konekte atravè rezo ou fè konfyans.",
    appLanguage: "Lang aplikasyon an",
    appLanguageCopy: "Chwazi lang NSN itilize a.",
    translateMeetupsChats: "Tradui rankont ak chat",
    translateMeetupsChatsCopy: "Montre detay evènman ak mesaj nan lang sa a.",
    appearance: "Aparans",
    colorPalette: "Palèt koulè",
    colorPaletteCopy: "Chwazi atitid ak koulè aksan ou prefere.",
    notifications: "Notifikasyon",
    meetupReminders: "Rapèl rankont",
    meetupRemindersCopy: "Resevwa rapèl avan rankont ou te antre ladan yo.",
    weatherAlerts: "Alèt move tan",
    weatherAlertsCopy: "Resevwa mizajou lè move tan ka afekte yon plan deyò.",
    chatNotifications: "Notifikasyon chat",
    chatNotificationsCopy: "Fè m konnen lè chat gwoup rankont yo gen nouvo mesaj.",
    quietNotifications: "Notifikasyon trankil",
    quietNotificationsCopy: "Kenbe ton notifikasyon yo dou epi evite alèt ki pran twòp atansyon.",
    locationDiscovery: "Kote ak dekouvèt",
    useApproximateLocation: "Sèvi ak kote apwoksimatif",
    useApproximateLocationCopy: "Montre opsyon ki toupre san pataje kote egzak ou.",
    showDistanceInMeetups: "Montre distans nan rankont yo",
    showDistanceInMeetupsCopy: "Montre distans apwoksimatif sou kat evènman ak rankont yo.",
    safetyContact: "Sekirite ak kontak",
    allowMessageRequests: "Pèmèt demann mesaj",
    allowMessageRequestsCopy: "Kite moun voye mesaj anvan ou antre nan menm rankont la.",
    safetyCheckIns: "Verifikasyon sekirite",
    safetyCheckInsCopy: "Aktive rapèl dou pou tcheke kijan ou ye bò kote rankont ou antre yo.",
    restartOnboarding: "Rekòmanse entwodiksyon SoftHello",
    restartOnboardingCopy: "Revizite konfimasyon laj, katye, entansyon, tinon, foto ak chwa vizibilite.",
    restartOnboardingAction: "Kòmanse",
    searchLanguage: "Chèche lang...",
    noLanguageFound: "Pa jwenn okenn lang",
  },
  Latvian: {
    title: "Iestatījumi un privātums",
    subtitle: "Izvēlies, kā vēlies, lai citi tevi redz.",
    translations: "Tulkojumi",
    blurProfilePhoto: "Aizmiglot profila foto",
    blurProfilePhotoCopy: "Saglabā foto maigi aizmiglotu, līdz izvēlies citādi.",
    privateProfile: "Privāts profils",
    privateProfileCopy: "Ierobežo profila informāciju atklāšanas vietās.",
    showFirstNameOnly: "Rādīt tikai vārdu",
    showFirstNameOnlyCopy: "Lieto savu vārdu tikšanās reizēs un tērzēšanā.",
    sameAgeGroupsOnly: "Rādīt tikai līdzīgas vecuma grupas",
    sameAgeGroupsOnlyCopy: "Dod priekšroku tikšanās reizēm ar līdzīga vecuma cilvēkiem.",
    revealAfterRsvp: "Atklāt profilu tikai pēc RSVP",
    revealAfterRsvpCopy: "Rādi profilu, kad abas puses ir piekritušas plānam.",
    friendsOfFriendsOnly: "Tikai draugu draugi",
    friendsOfFriendsOnlyCopy: "Dod priekšroku cilvēkiem, kas saistīti caur uzticamu tīklu.",
    appLanguage: "Lietotnes valoda",
    appLanguageCopy: "Izvēlies valodu, ko izmanto NSN.",
    translateMeetupsChats: "Tulkot tikšanās un tērzēšanu",
    translateMeetupsChatsCopy: "Rādi pasākumu informāciju un ziņojumus šajā valodā.",
    appearance: "Izskats",
    colorPalette: "Krāsu palete",
    colorPaletteCopy: "Izvēlies noskaņu un akcenta krāsas, kas tev patīk.",
    notifications: "Paziņojumi",
    locationDiscovery: "Atrašanās vieta un atklāšana",
    safetyContact: "Drošība un kontakts",
    restartOnboarding: "Sākt SoftHello ievadu no jauna",
    restartOnboardingAction: "Sākt",
    searchLanguage: "Meklēt valodu…",
    noLanguageFound: "Valoda nav atrasta",
  },
  Lithuanian: {
    title: "Nustatymai ir privatumas",
    subtitle: "Pasirink, kaip nori, kad kiti tave matytų.",
    translations: "Vertimai",
    blurProfilePhoto: "Sulieti profilio nuotrauką",
    blurProfilePhotoCopy: "Laikyk nuotrauką sušvelnintą, kol pasirinksi kitaip.",
    privateProfile: "Privatus profilis",
    privateProfileCopy: "Apribok profilio informaciją atradimo vietose.",
    showFirstNameOnly: "Rodyti tik vardą",
    showFirstNameOnlyCopy: "Naudok vardą susitikimuose ir pokalbiuose.",
    sameAgeGroupsOnly: "Rodyti tik panašias amžiaus grupes",
    sameAgeGroupsOnlyCopy: "Pirmenybę teik susitikimams su panašaus amžiaus žmonėmis.",
    revealAfterRsvp: "Profilį rodyti tik po RSVP",
    revealAfterRsvpCopy: "Rodyk profilį, kai abi pusės įsipareigojo planui.",
    friendsOfFriendsOnly: "Tik draugų draugai",
    friendsOfFriendsOnlyCopy: "Pirmenybę teik žmonėms iš patikimo tinklo.",
    appLanguage: "Programėlės kalba",
    appLanguageCopy: "Pasirink NSN naudojamą kalbą.",
    translateMeetupsChats: "Versti susitikimus ir pokalbius",
    translateMeetupsChatsCopy: "Rodyti renginių informaciją ir žinutes šia kalba.",
    appearance: "Išvaizda",
    colorPalette: "Spalvų paletė",
    colorPaletteCopy: "Pasirink nuotaiką ir akcento spalvas, kurios tau patinka.",
    notifications: "Pranešimai",
    locationDiscovery: "Vieta ir atradimas",
    safetyContact: "Saugumas ir kontaktas",
    restartOnboarding: "Pradėti SoftHello įvadą iš naujo",
    restartOnboardingAction: "Pradėti",
    searchLanguage: "Ieškoti kalbos…",
    noLanguageFound: "Kalba nerasta",
  },
  Luxembourgish: {
    title: "Astellungen a Privatsphär",
    subtitle: "Wiel, wéi aner Leit dech gesi sollen.",
    translations: "Iwwersetzungen",
    blurProfilePhoto: "Profilfoto verwëschen",
    blurProfilePhotoCopy: "Hal deng Foto mëll verwëscht, bis du eppes anescht wiels.",
    privateProfile: "Privat Profil",
    privateProfileCopy: "Limitéier Profildetailer an Entdeckungsberäicher.",
    showFirstNameOnly: "Nëmmen Virnumm weisen",
    showFirstNameOnlyCopy: "Benotz däi Virnumm bei Meetups a Chatten.",
    sameAgeGroupsOnly: "Nëmmen änlech Altersgruppen weisen",
    sameAgeGroupsOnlyCopy: "Gëff Meetups mat Leit an engem änlechen Alter Virrang.",
    revealAfterRsvp: "Profil eréischt no RSVP weisen",
    revealAfterRsvpCopy: "Weis däi Profil, wann zwou Säiten dem Plang zougestëmmt hunn.",
    friendsOfFriendsOnly: "Nëmmen Frënn vu Frënn",
    friendsOfFriendsOnlyCopy: "Bevirdeelegt Leit, déi iwwer däi vertraut Netzwierk verbonne sinn.",
    appLanguage: "App-Sprooch",
    appLanguageCopy: "Wiel d'Sprooch, déi NSN benotzt.",
    translateMeetupsChats: "Meetups a Chatten iwwersetzen",
    translateMeetupsChatsCopy: "Weis Eventdetailer a Messagen an dëser Sprooch.",
    appearance: "Ausgesinn",
    colorPalette: "Faarfpalette",
    colorPaletteCopy: "Wiel d'Stëmmung an Akzentfaarwen, déi dir gefalen.",
    notifications: "Notifikatiounen",
    locationDiscovery: "Standuert an Entdeckung",
    safetyContact: "Sécherheet a Kontakt",
    restartOnboarding: "SoftHello-Aféierung nei starten",
    restartOnboardingAction: "Start",
    searchLanguage: "Sprooch sichen…",
    noLanguageFound: "Keng Sprooch fonnt",
  },
  Slovak: {
    title: "Nastavenia a súkromie",
    subtitle: "Vyberte, ako chcete, aby vás ostatní videli.",
    translations: "Preklady",
    blurProfilePhoto: "Rozmazať profilovú fotku",
    blurProfilePhotoCopy: "Nechajte fotku jemne rozmazanú, kým nezvolíte inak.",
    privateProfile: "Súkromný profil",
    privateProfileCopy: "Obmedzte detaily profilu v objavovacích priestoroch.",
    showFirstNameOnly: "Zobraziť iba krstné meno",
    showFirstNameOnlyCopy: "Používajte krstné meno v stretnutiach a chatoch.",
    sameAgeGroupsOnly: "Zobraziť len podobné vekové skupiny",
    sameAgeGroupsOnlyCopy: "Uprednostnite stretnutia s ľuďmi podobného veku.",
    revealAfterRsvp: "Zobraziť profil až po RSVP",
    revealAfterRsvpCopy: "Zobrazte profil, keď sa obe strany zaviažu k plánu.",
    friendsOfFriendsOnly: "Iba priatelia priateľov",
    friendsOfFriendsOnlyCopy: "Preferujte ľudí prepojených cez vašu dôveryhodnú sieť.",
    appLanguage: "Jazyk aplikácie",
    appLanguageCopy: "Vyberte jazyk používaný v NSN.",
    translateMeetupsChats: "Prekladať stretnutia a chaty",
    translateMeetupsChatsCopy: "Zobrazovať detaily udalostí a správy v tomto jazyku.",
    appearance: "Vzhľad",
    colorPalette: "Paleta farieb",
    colorPaletteCopy: "Vyberte náladu a akcentové farby, ktoré preferujete.",
    notifications: "Upozornenia",
    locationDiscovery: "Poloha a objavovanie",
    safetyContact: "Bezpečnosť a kontakt",
    restartOnboarding: "Spustiť úvod SoftHello znova",
    restartOnboardingAction: "Začať",
    searchLanguage: "Hľadať jazyk…",
    noLanguageFound: "Jazyk sa nenašiel",
  },
  Yiddish: {
    title: "איינשטעלונגען און פריוואטקייט",
    subtitle: "קלייב ווי דו ווילסט אז אנדערע זאלן דיך זען.",
    accessibility: "צוטריטלעכקייט",
    largerText: "גרעסערער טעקסט",
    largerTextCopy: "פארגרעסער דעם טעקסט אויף דעם עקראַן און היט אפ די אויסוואל פאר דער אפ.",
    highContrast: "הויכער קאנטראסט",
    highContrastCopy: "פארשטערק גרענעצן און טעקסט-קאנטראסט כדי עס זאל זיין גרינגער צו איבערקוקן.",
    reduceMotion: "ווייניקער באוועגונג",
    reduceMotionCopy: "קלייב רואיגערע איבערגאנגען און ווייניקער דעקאראטיווע באוועגונג.",
    screenReaderHints: "הינווייזן פאר סקרין-רידער",
    screenReaderHintsCopy: "לייג צו מער לעיבלעך און הינווייזן פאר הילף-טעכנאלאגיעס.",
    translations: "איבערזעצונגען",
    blurProfilePhoto: "פארנעפל פראפיל-בילד",
    blurProfilePhotoCopy: "האלט דיין בילד פארווייכערט ביז דו קלייבסט אנדערש.",
    privateProfile: "פריוואטער פראפיל",
    privateProfileCopy: "באגרענעץ פראפיל-פרטים אין אנטדעקונג-ערטער.",
    showFirstNameOnly: "ווייז בלויז דעם ערשטן נאמען",
    showFirstNameOnlyCopy: "נוץ דיין ערשטן נאמען אין מיטאפס און שמועסן.",
    sameAgeGroupsOnly: "ווייז נאר ענלעכע עלטער-גרופעס",
    sameAgeGroupsOnlyCopy: "גיב עדיפות צו מיטאפס מיט מענטשן אין אן ענלעכן עלטער.",
    revealAfterRsvp: "ווייז פראפיל נאר נאך RSVP",
    revealAfterRsvpCopy: "ווייז דיין פראפיל ווען ביידע זייטן האבן מסכים געווען צום פלאן.",
    friendsOfFriendsOnly: "בלויז חברים פון חברים",
    friendsOfFriendsOnlyCopy: "גיב עדיפות צו מענטשן פארבונדן דורך דיין צוטרוי-נעץ.",
    appLanguage: "שפראך פון דער אפ",
    appLanguageCopy: "קלייב די שפראך וואס NSN ניצט.",
    translateMeetupsChats: "איבערזעצן מיטאפס און שמועסן",
    translateMeetupsChatsCopy: "ווייז געשעעניש-פרטים און מעסעדזשעס אין דער שפראך.",
    appearance: "אויסזען",
    colorPalette: "קאליר-פאלעטע",
    colorPaletteCopy: "קלייב די שטימונג און אקצענט-קאלירן וואס דו האסט ליב.",
    notifications: "מעלדונגען",
    meetupReminders: "מיטאפ-דערמאנונגען",
    meetupRemindersCopy: "באקום דערמאנונגען פאר מיטאפס וואו דו ביסט איינגעשריבן.",
    weatherAlerts: "וועטער-ווארענונגען",
    weatherAlertsCopy: "באקום דערהייַנטיקונגען ווען וועטער קען משפיע זיין אויף אן דרויסנדיקן פלאן.",
    chatNotifications: "שמועס-מעלדונגען",
    chatNotificationsCopy: "זאג מיר ווען מיטאפ-גרופע שמועסן האבן נייע מעסעדזשעס.",
    quietNotifications: "שטילע מעלדונגען",
    quietNotificationsCopy: "האלט מעלדונגען מילד און נישט צו אויפמערקזאמקייט-שווער.",
    locationDiscovery: "ארט און אנטדעקונג",
    useApproximateLocation: "נוץ אן אומגעפערן ארט",
    useApproximateLocationCopy: "ווייז נאענטע אפציעס אן טיילן דיין גענויעם ארט.",
    showDistanceInMeetups: "ווייז דיסטאנץ אין מיטאפס",
    showDistanceInMeetupsCopy: "ווייז אומגעפער דיסטאנץ אויף געשעעניש- און מיטאפ-קארטלעך.",
    safetyContact: "זיכערקייט און קאנטאקט",
    allowMessageRequests: "דערלויב מעסעדזש-בקשות",
    allowMessageRequestsCopy: "לאז מענטשן דיר שיקן א מעסעדזש איידער דו טרעסט אריין אין דער זעלבער מיטאפ.",
    safetyCheckIns: "זיכערקייט-טשעק-אינס",
    safetyCheckInsCopy: "אקטיוויזיר מילדע פרעגן ארום מיטאפס וואו דו ביסט איינגעשריבן.",
    restartOnboarding: "אנהייבן SoftHello ווידער",
    restartOnboardingCopy: "גיי נאכאמאל דורך עלטער-באשטעטיקונג, געגנט, כוונה, צונאמען, בילד און זעבארקייט.",
    restartOnboardingAction: "אנהייבן",
    searchLanguage: "זוך שפראך...",
    noLanguageFound: "קיין שפראך נישט געפונען",
  },
};

const regionalEnglishSettings: Record<string, Partial<SettingsCopy>> = {
  "English (AU)": {
    colorPalette: "Colour palette",
    colorPaletteCopy: "Choose the mood and accent colours you prefer.",
  },
  "English (CA)": {
    colorPalette: "Colour palette",
    colorPaletteCopy: "Choose the mood and accent colours you prefer.",
  },
  "English (HK)": {
    colorPalette: "Colour palette",
    colorPaletteCopy: "Choose the mood and accent colours you prefer.",
  },
  "English (IE)": {
    colorPalette: "Colour palette",
    colorPaletteCopy: "Choose the mood and accent colours you prefer.",
  },
  "English (JM)": {
    colorPalette: "Colour palette",
    colorPaletteCopy: "Choose the mood and accent colours you prefer.",
  },
  "English (IN)": {
    colorPalette: "Colour palette",
    colorPaletteCopy: "Choose the mood and accent colours you prefer.",
  },
  "English (NZ)": {
    colorPalette: "Colour palette",
    colorPaletteCopy: "Choose the mood and accent colours you prefer.",
  },
  "English (SG)": {
    colorPalette: "Colour palette",
    colorPaletteCopy: "Choose the mood and accent colours you prefer.",
  },
  "English (UK)": {
    colorPalette: "Colour palette",
    colorPaletteCopy: "Choose the mood and accent colours you prefer.",
  },
  "English (ZA)": {
    colorPalette: "Colour palette",
    colorPaletteCopy: "Choose the mood and accent colours you prefer.",
  },
};

const settingsSectionTranslations: Record<string, Partial<SettingsCopy>> = {
  Arabic: {
    appearance: "المظهر",
    colorPalette: "لوحة الألوان",
    colorPaletteCopy: "اختر المزاج وألوان التمييز التي تفضلها.",
    notifications: "الإشعارات",
    meetupReminders: "تذكيرات اللقاءات",
    meetupRemindersCopy: "احصل على تذكيرات قبل اللقاءات التي انضممت إليها.",
    weatherAlerts: "تنبيهات الطقس",
    weatherAlertsCopy: "استقبل تحديثات عندما قد يؤثر الطقس على خطة خارجية.",
    chatNotifications: "إشعارات الدردشة",
    chatNotificationsCopy: "أخبرني عند وجود رسائل جديدة في دردشات اللقاءات.",
    quietNotifications: "إشعارات هادئة",
    quietNotificationsCopy: "حافظ على نغمة الإشعارات لطيفة وبعيدة عن لفت الانتباه الزائد.",
    locationDiscovery: "الموقع والاكتشاف",
    useApproximateLocation: "استخدام موقع تقريبي",
    useApproximateLocationCopy: "اعرض خيارات قريبة دون مشاركة موقع دقيق.",
    showDistanceInMeetups: "إظهار المسافة في اللقاءات",
    showDistanceInMeetupsCopy: "اعرض المسافة التقريبية على بطاقات الفعاليات واللقاءات.",
    safetyContact: "السلامة والتواصل",
    allowMessageRequests: "السماح بطلبات الرسائل",
    allowMessageRequestsCopy: "دع الأشخاص يراسلونك قبل الانضمام إلى نفس اللقاء.",
    safetyCheckIns: "اطمئنانات السلامة",
    safetyCheckInsCopy: "فعّل تذكيرات لطيفة حول اللقاءات التي انضممت إليها.",
    accessibility: "إمكانية الوصول",
    largerText: "نص أكبر",
    largerTextCopy: "كبّر النص واحفظ هذا التفضيل للتطبيق.",
    highContrast: "تباين عالٍ",
    highContrastCopy: "قوِّ الحدود وتباين النص لتسهيل القراءة.",
    reduceMotion: "تقليل الحركة",
    reduceMotionCopy: "فضّل انتقالات أهدأ وحركة أقل.",
    screenReaderHints: "تلميحات قارئ الشاشة",
    screenReaderHintsCopy: "أضف تسميات وتلميحات إضافية للتقنيات المساعدة.",
  },
  Chinese: {
    appearance: "外观",
    colorPalette: "配色",
    colorPaletteCopy: "选择你喜欢的氛围和强调色。",
    notifications: "通知",
    meetupReminders: "聚会提醒",
    meetupRemindersCopy: "在你加入的聚会开始前收到提醒。",
    weatherAlerts: "天气提醒",
    weatherAlertsCopy: "当天气可能影响户外计划时接收更新。",
    chatNotifications: "聊天通知",
    chatNotificationsCopy: "聚会群聊有新消息时通知我。",
    quietNotifications: "安静通知",
    quietNotificationsCopy: "保持通知语气温和，避免过度吸引注意。",
    locationDiscovery: "位置与发现",
    useApproximateLocation: "使用大致位置",
    useApproximateLocationCopy: "显示附近选项，而不分享精确位置。",
    showDistanceInMeetups: "在聚会中显示距离",
    showDistanceInMeetupsCopy: "在活动和聚会卡片上显示大致距离。",
    safetyContact: "安全与联系",
    allowMessageRequests: "允许消息请求",
    allowMessageRequestsCopy: "允许他人在加入同一聚会前给你发消息。",
    safetyCheckIns: "安全确认",
    safetyCheckInsCopy: "围绕已加入的聚会启用温和确认提醒。",
  },
  French: {
    appearance: "Apparence",
    colorPalette: "Palette de couleurs",
    colorPaletteCopy: "Choisissez l'ambiance et les couleurs d'accent que vous préférez.",
    notifications: "Notifications",
    meetupReminders: "Rappels de rencontres",
    meetupRemindersCopy: "Recevez des rappels avant les rencontres que vous avez rejointes.",
    weatherAlerts: "Alertes météo",
    weatherAlertsCopy: "Recevez des mises à jour quand la météo peut affecter un plan extérieur.",
    chatNotifications: "Notifications de chat",
    chatNotificationsCopy: "Prévenez-moi quand les chats de rencontre ont de nouveaux messages.",
    quietNotifications: "Notifications calmes",
    quietNotificationsCopy: "Gardez un ton de notification doux, sans alertes trop insistantes.",
    locationDiscovery: "Lieu et découverte",
    useApproximateLocation: "Utiliser une position approximative",
    useApproximateLocationCopy: "Afficher des options proches sans partager une position précise.",
    showDistanceInMeetups: "Afficher la distance dans les rencontres",
    showDistanceInMeetupsCopy: "Afficher une distance approximative sur les cartes d'événement et de rencontre.",
    safetyContact: "Sécurité et contact",
    allowMessageRequests: "Autoriser les demandes de message",
    allowMessageRequestsCopy: "Permettre aux personnes d'envoyer un message avant de rejoindre la même rencontre.",
    safetyCheckIns: "Points de sécurité",
    safetyCheckInsCopy: "Activer des rappels doux autour des rencontres rejointes.",
  },
  German: {
    appearance: "Darstellung",
    colorPalette: "Farbpalette",
    colorPaletteCopy: "Wähle Stimmung und Akzentfarben, die dir angenehm sind.",
    notifications: "Benachrichtigungen",
    meetupReminders: "Treffen-Erinnerungen",
    meetupRemindersCopy: "Erhalte Erinnerungen vor Treffen, denen du beigetreten bist.",
    weatherAlerts: "Wetterhinweise",
    weatherAlertsCopy: "Erhalte Updates, wenn Wetter einen Plan im Freien beeinflussen kann.",
    chatNotifications: "Chat-Benachrichtigungen",
    chatNotificationsCopy: "Benachrichtige mich bei neuen Nachrichten in Gruppen-Chats.",
    quietNotifications: "Leise Benachrichtigungen",
    quietNotificationsCopy: "Halte Benachrichtigungen sanft und vermeide aufdringliche Hinweise.",
    locationDiscovery: "Standort und Entdecken",
    useApproximateLocation: "Ungefähren Standort verwenden",
    useApproximateLocationCopy: "Zeige nahe Optionen, ohne einen genauen Standort zu teilen.",
    showDistanceInMeetups: "Entfernung in Treffen anzeigen",
    showDistanceInMeetupsCopy: "Zeige ungefähre Entfernung auf Event- und Treffen-Karten.",
    safetyContact: "Sicherheit und Kontakt",
    allowMessageRequests: "Nachrichtenanfragen erlauben",
    allowMessageRequestsCopy: "Erlaube Nachrichten, bevor ihr demselben Treffen beitretet.",
    safetyCheckIns: "Sicherheits-Check-ins",
    safetyCheckInsCopy: "Aktiviere sanfte Check-in-Hinweise rund um beigetretene Treffen.",
  },
  Hindi: {
    appearance: "दिखावट",
    colorPalette: "रंग पैलेट",
    colorPaletteCopy: "अपनी पसंद का मूड और ऐक्सेंट रंग चुनें।",
    notifications: "सूचनाएँ",
    meetupReminders: "मीटअप रिमाइंडर",
    meetupRemindersCopy: "जिन मीटअप में आप शामिल हुए हैं, उनसे पहले रिमाइंडर पाएँ।",
    weatherAlerts: "मौसम अलर्ट",
    weatherAlertsCopy: "जब मौसम किसी बाहरी योजना को प्रभावित कर सकता है, अपडेट पाएँ।",
    chatNotifications: "चैट सूचनाएँ",
    chatNotificationsCopy: "मीटअप ग्रुप चैट में नए संदेश आने पर सूचित करें।",
    quietNotifications: "शांत सूचनाएँ",
    quietNotificationsCopy: "सूचनाओं का स्वर नरम रखें और ध्यान खींचने वाले अलर्ट से बचें।",
    locationDiscovery: "स्थान और खोज",
    useApproximateLocation: "अनुमानित स्थान उपयोग करें",
    useApproximateLocationCopy: "सटीक स्थान साझा किए बिना पास के विकल्प दिखाएँ।",
    showDistanceInMeetups: "मीटअप में दूरी दिखाएँ",
    showDistanceInMeetupsCopy: "इवेंट और मीटअप कार्ड पर अनुमानित दूरी दिखाएँ।",
    safetyContact: "सुरक्षा और संपर्क",
    allowMessageRequests: "संदेश अनुरोध अनुमति दें",
    allowMessageRequestsCopy: "लोगों को समान मीटअप में शामिल होने से पहले संदेश भेजने दें।",
    safetyCheckIns: "सुरक्षा चेक-इन",
    safetyCheckInsCopy: "शामिल मीटअप के आसपास नरम चेक-इन संकेत चालू करें।",
  },
  Italian: {
    appearance: "Aspetto",
    colorPalette: "Palette colori",
    colorPaletteCopy: "Scegli l'atmosfera e i colori di accento che preferisci.",
    notifications: "Notifiche",
    meetupReminders: "Promemoria meetup",
    meetupRemindersCopy: "Ricevi promemoria prima dei meetup a cui hai aderito.",
    weatherAlerts: "Avvisi meteo",
    weatherAlertsCopy: "Ricevi aggiornamenti quando il meteo può influire su un piano all'aperto.",
    chatNotifications: "Notifiche chat",
    chatNotificationsCopy: "Avvisami quando le chat dei meetup hanno nuovi messaggi.",
    quietNotifications: "Notifiche discrete",
    quietNotificationsCopy: "Mantieni notifiche gentili ed evita avvisi troppo insistenti.",
    locationDiscovery: "Posizione e scoperta",
    useApproximateLocation: "Usa posizione approssimativa",
    useApproximateLocationCopy: "Mostra opzioni vicine senza condividere una posizione precisa.",
    showDistanceInMeetups: "Mostra distanza nei meetup",
    showDistanceInMeetupsCopy: "Mostra la distanza approssimativa su schede evento e meetup.",
    safetyContact: "Sicurezza e contatto",
    allowMessageRequests: "Consenti richieste di messaggio",
    allowMessageRequestsCopy: "Permetti messaggi prima di unirvi allo stesso meetup.",
    safetyCheckIns: "Check-in di sicurezza",
    safetyCheckInsCopy: "Attiva promemoria gentili intorno ai meetup a cui partecipi.",
  },
  Japanese: {
    appearance: "外観",
    colorPalette: "カラーパレット",
    colorPaletteCopy: "好みの雰囲気とアクセントカラーを選びます。",
    notifications: "通知",
    meetupReminders: "ミートアップのリマインダー",
    meetupRemindersCopy: "参加したミートアップの前にリマインダーを受け取ります。",
    weatherAlerts: "天気アラート",
    weatherAlertsCopy: "天気が屋外プランに影響しそうなときに更新を受け取ります。",
    chatNotifications: "チャット通知",
    chatNotificationsCopy: "ミートアップのグループチャットに新着メッセージがあると通知します。",
    quietNotifications: "静かな通知",
    quietNotificationsCopy: "通知をやさしい雰囲気に保ち、注意を引きすぎないようにします。",
    locationDiscovery: "場所と発見",
    useApproximateLocation: "おおよその位置を使う",
    useApproximateLocationCopy: "正確な位置を共有せずに近くの選択肢を表示します。",
    showDistanceInMeetups: "ミートアップで距離を表示",
    showDistanceInMeetupsCopy: "イベントやミートアップのカードにおおよその距離を表示します。",
    safetyContact: "安全と連絡",
    allowMessageRequests: "メッセージリクエストを許可",
    allowMessageRequestsCopy: "同じミートアップに参加する前でもメッセージできるようにします。",
    safetyCheckIns: "安全チェックイン",
    safetyCheckInsCopy: "参加したミートアップの前後にやさしい確認を表示します。",
  },
  Korean: {
    appearance: "모양",
    colorPalette: "색상 팔레트",
    colorPaletteCopy: "원하는 분위기와 강조 색상을 선택하세요.",
    notifications: "알림",
    meetupReminders: "모임 알림",
    meetupRemindersCopy: "참여한 모임 전에 알림을 받아요.",
    weatherAlerts: "날씨 알림",
    weatherAlertsCopy: "날씨가 야외 계획에 영향을 줄 수 있을 때 업데이트를 받아요.",
    chatNotifications: "채팅 알림",
    chatNotificationsCopy: "모임 그룹 채팅에 새 메시지가 있으면 알려줘요.",
    quietNotifications: "조용한 알림",
    quietNotificationsCopy: "알림을 부드럽게 유지하고 부담스러운 알림을 피합니다.",
    locationDiscovery: "위치와 탐색",
    useApproximateLocation: "대략적인 위치 사용",
    useApproximateLocationCopy: "정확한 위치를 공유하지 않고 가까운 옵션을 보여줘요.",
    showDistanceInMeetups: "모임에서 거리 표시",
    showDistanceInMeetupsCopy: "이벤트와 모임 카드에 대략적인 거리를 표시해요.",
    safetyContact: "안전과 연락",
    allowMessageRequests: "메시지 요청 허용",
    allowMessageRequestsCopy: "같은 모임에 참여하기 전에도 메시지할 수 있게 해요.",
    safetyCheckIns: "안전 체크인",
    safetyCheckInsCopy: "참여한 모임 주변에 부드러운 확인 알림을 켜요.",
  },
  Persian: {
    appearance: "ظاهر",
    colorPalette: "پالت رنگ",
    colorPaletteCopy: "حال‌وهوا و رنگ‌های برجسته‌ای را که ترجیح می‌دهید انتخاب کنید.",
    notifications: "اعلان‌ها",
    meetupReminders: "یادآوری دیدارها",
    meetupRemindersCopy: "پیش از دیدارهایی که به آن‌ها پیوسته‌اید یادآوری بگیرید.",
    weatherAlerts: "هشدارهای هوا",
    weatherAlertsCopy: "وقتی هوا ممکن است روی برنامه بیرونی اثر بگذارد، به‌روزرسانی بگیرید.",
    chatNotifications: "اعلان‌های چت",
    chatNotificationsCopy: "وقتی در چت‌های گروهی دیدار پیام تازه هست به من اطلاع بده.",
    quietNotifications: "اعلان‌های آرام",
    quietNotificationsCopy: "لحن اعلان‌ها را ملایم نگه دارید و از هشدارهای پرتنش دوری کنید.",
    locationDiscovery: "مکان و کشف",
    useApproximateLocation: "استفاده از مکان تقریبی",
    useApproximateLocationCopy: "گزینه‌های نزدیک را بدون اشتراک‌گذاری مکان دقیق نشان بده.",
    showDistanceInMeetups: "نمایش فاصله در دیدارها",
    showDistanceInMeetupsCopy: "فاصله تقریبی را روی کارت‌های رویداد و دیدار نشان بده.",
    safetyContact: "ایمنی و تماس",
    allowMessageRequests: "اجازه درخواست پیام",
    allowMessageRequestsCopy: "اجازه بده افراد پیش از پیوستن به همان دیدار پیام بدهند.",
    safetyCheckIns: "بررسی‌های ایمنی",
    safetyCheckInsCopy: "یادآوری‌های ملایم بررسی را پیرامون دیدارهای پیوسته فعال کن.",
  },
  Urdu: {
    appearance: "ظاہری شکل",
    colorPalette: "رنگوں کی پیلیٹ",
    colorPaletteCopy: "اپنی پسند کا ماحول اور نمایاں رنگ منتخب کریں۔",
    notifications: "اطلاعات",
    meetupReminders: "میٹ اپ یاددہانیاں",
    meetupRemindersCopy: "جن میٹ اپس میں آپ شامل ہیں، ان سے پہلے یاددہانی پائیں۔",
    weatherAlerts: "موسم کی اطلاعات",
    weatherAlertsCopy: "جب موسم کسی بیرونی منصوبے کو متاثر کر سکتا ہو تو اپ ڈیٹس پائیں۔",
    chatNotifications: "چیٹ اطلاعات",
    chatNotificationsCopy: "میٹ اپ گروپ چیٹس میں نئے پیغامات پر مجھے بتائیں۔",
    quietNotifications: "خاموش اطلاعات",
    quietNotificationsCopy: "اطلاعات کو نرم رکھیں اور زیادہ توجہ کھینچنے والی الرٹس سے بچیں۔",
    locationDiscovery: "مقام اور دریافت",
    useApproximateLocation: "تقریبی مقام استعمال کریں",
    useApproximateLocationCopy: "درست مقام شیئر کیے بغیر قریبی اختیارات دکھائیں۔",
    showDistanceInMeetups: "میٹ اپس میں فاصلہ دکھائیں",
    showDistanceInMeetupsCopy: "ایونٹ اور میٹ اپ کارڈز پر اندازاً فاصلہ دکھائیں۔",
    safetyContact: "حفاظت اور رابطہ",
    allowMessageRequests: "پیغام کی درخواستیں اجازت دیں",
    allowMessageRequestsCopy: "لوگوں کو ایک ہی میٹ اپ میں شامل ہونے سے پہلے پیغام بھیجنے دیں۔",
    safetyCheckIns: "حفاظتی چیک اِن",
    safetyCheckInsCopy: "شامل میٹ اپس کے آس پاس نرم چیک اِن یاددہانیاں فعال کریں۔",
  },
  Bengali: {
    appearance: "দেখনদারি",
    colorPalette: "রঙের প্যালেট",
    colorPaletteCopy: "আপনার পছন্দের মুড ও অ্যাকসেন্ট রঙ বেছে নিন।",
    notifications: "বিজ্ঞপ্তি",
    meetupReminders: "মিটআপ রিমাইন্ডার",
    meetupRemindersCopy: "আপনি যেসব মিটআপে যোগ দিয়েছেন তার আগে রিমাইন্ডার পান।",
    weatherAlerts: "আবহাওয়া সতর্কতা",
    weatherAlertsCopy: "আবহাওয়া কোনো বাইরের পরিকল্পনায় প্রভাব ফেলতে পারে হলে আপডেট পান।",
    chatNotifications: "চ্যাট বিজ্ঞপ্তি",
    chatNotificationsCopy: "মিটআপ গ্রুপ চ্যাটে নতুন বার্তা এলে আমাকে জানান।",
    quietNotifications: "শান্ত বিজ্ঞপ্তি",
    quietNotificationsCopy: "বিজ্ঞপ্তির সুর নরম রাখুন এবং বেশি মনোযোগ-টানা সতর্কতা এড়ান।",
    locationDiscovery: "অবস্থান ও আবিষ্কার",
    useApproximateLocation: "আনুমানিক অবস্থান ব্যবহার করুন",
    useApproximateLocationCopy: "নির্দিষ্ট অবস্থান শেয়ার না করে কাছাকাছি বিকল্প দেখান।",
    showDistanceInMeetups: "মিটআপে দূরত্ব দেখান",
    showDistanceInMeetupsCopy: "ইভেন্ট ও মিটআপ কার্ডে আনুমানিক দূরত্ব দেখান।",
    safetyContact: "নিরাপত্তা ও যোগাযোগ",
    allowMessageRequests: "বার্তার অনুরোধ অনুমতি দিন",
    allowMessageRequestsCopy: "একই মিটআপে যোগ দেওয়ার আগে মানুষকে বার্তা পাঠাতে দিন।",
    safetyCheckIns: "নিরাপত্তা চেক-ইন",
    safetyCheckInsCopy: "যোগ দেওয়া মিটআপ ঘিরে নরম চেক-ইন রিমাইন্ডার চালু করুন।",
  },
  Filipino: {
    appearance: "Hitsura",
    colorPalette: "Paleta ng kulay",
    colorPaletteCopy: "Piliin ang mood at accent colors na mas komportable sa iyo.",
    notifications: "Mga notification",
    meetupReminders: "Meetup reminders",
    meetupRemindersCopy: "Makatanggap ng paalala bago ang meetups na sinalihan mo.",
    weatherAlerts: "Weather alerts",
    weatherAlertsCopy: "Makatanggap ng update kapag maaaring maapektuhan ng panahon ang outdoor plan.",
    chatNotifications: "Chat notifications",
    chatNotificationsCopy: "I-notify ako kapag may bagong mensahe sa meetup group chats.",
    quietNotifications: "Tahimik na notifications",
    quietNotificationsCopy: "Panatilihing banayad ang tono at iwasan ang alerts na masyadong agaw-pansin.",
    locationDiscovery: "Lokasyon at discovery",
    useApproximateLocation: "Gamitin ang tinatayang lokasyon",
    useApproximateLocationCopy: "Magpakita ng malapit na options nang hindi ibinabahagi ang eksaktong lokasyon.",
    showDistanceInMeetups: "Ipakita ang distance sa meetups",
    showDistanceInMeetupsCopy: "Ipakita ang tinatayang distance sa event at meetup cards.",
    safetyContact: "Safety at contact",
    allowMessageRequests: "Payagan ang message requests",
    allowMessageRequestsCopy: "Hayaan ang iba na mag-message bago kayo sumali sa parehong meetup.",
    safetyCheckIns: "Safety check-ins",
    safetyCheckInsCopy: "I-on ang banayad na check-in prompts sa paligid ng sinalihang meetups.",
  },
  Indonesian: {
    appearance: "Tampilan",
    colorPalette: "Palet warna",
    colorPaletteCopy: "Pilih suasana dan warna aksen yang Anda sukai.",
    notifications: "Notifikasi",
    meetupReminders: "Pengingat meetup",
    meetupRemindersCopy: "Dapatkan pengingat sebelum meetup yang Anda ikuti.",
    weatherAlerts: "Peringatan cuaca",
    weatherAlertsCopy: "Terima pembaruan saat cuaca dapat memengaruhi rencana luar ruangan.",
    chatNotifications: "Notifikasi chat",
    chatNotificationsCopy: "Beri tahu saya saat chat grup meetup memiliki pesan baru.",
    quietNotifications: "Notifikasi tenang",
    quietNotificationsCopy: "Jaga nada notifikasi tetap lembut dan hindari peringatan yang terlalu menarik perhatian.",
    locationDiscovery: "Lokasi & penemuan",
    useApproximateLocation: "Gunakan lokasi perkiraan",
    useApproximateLocationCopy: "Tampilkan opsi terdekat tanpa membagikan lokasi tepat.",
    showDistanceInMeetups: "Tampilkan jarak di meetup",
    showDistanceInMeetupsCopy: "Tampilkan perkiraan jarak di kartu event dan meetup.",
    safetyContact: "Keamanan & kontak",
    allowMessageRequests: "Izinkan permintaan pesan",
    allowMessageRequestsCopy: "Biarkan orang mengirim pesan sebelum bergabung di meetup yang sama.",
    safetyCheckIns: "Check-in keamanan",
    safetyCheckInsCopy: "Aktifkan pengingat check-in lembut di sekitar meetup yang diikuti.",
  },
  Malay: {
    appearance: "Penampilan",
    colorPalette: "Palet warna",
    colorPaletteCopy: "Pilih suasana dan warna aksen yang anda suka.",
    notifications: "Pemberitahuan",
    meetupReminders: "Peringatan meetup",
    meetupRemindersCopy: "Terima peringatan sebelum meetup yang anda sertai.",
    weatherAlerts: "Amaran cuaca",
    weatherAlertsCopy: "Terima kemas kini apabila cuaca mungkin menjejaskan rancangan luar.",
    chatNotifications: "Pemberitahuan chat",
    chatNotificationsCopy: "Beritahu saya apabila chat kumpulan meetup ada mesej baharu.",
    quietNotifications: "Pemberitahuan lembut",
    quietNotificationsCopy: "Kekalkan nada pemberitahuan yang lembut dan elakkan amaran yang terlalu menarik perhatian.",
    locationDiscovery: "Lokasi & penemuan",
    useApproximateLocation: "Guna lokasi anggaran",
    useApproximateLocationCopy: "Tunjukkan pilihan berdekatan tanpa berkongsi lokasi tepat.",
    showDistanceInMeetups: "Tunjukkan jarak dalam meetup",
    showDistanceInMeetupsCopy: "Tunjukkan jarak anggaran pada kad acara dan meetup.",
    safetyContact: "Keselamatan & hubungan",
    allowMessageRequests: "Benarkan permintaan mesej",
    allowMessageRequestsCopy: "Benarkan orang menghantar mesej sebelum menyertai meetup yang sama.",
    safetyCheckIns: "Daftar masuk keselamatan",
    safetyCheckInsCopy: "Aktifkan peringatan daftar masuk lembut sekitar meetup yang disertai.",
  },
  Thai: {
    appearance: "รูปลักษณ์",
    colorPalette: "พาเลตสี",
    colorPaletteCopy: "เลือกบรรยากาศและสีเน้นที่คุณชอบ",
    notifications: "การแจ้งเตือน",
    meetupReminders: "เตือนมีตอัป",
    meetupRemindersCopy: "รับการเตือนก่อนมีตอัปที่คุณเข้าร่วม",
    weatherAlerts: "แจ้งเตือนสภาพอากาศ",
    weatherAlertsCopy: "รับอัปเดตเมื่อสภาพอากาศอาจส่งผลต่อแผนกลางแจ้ง",
    chatNotifications: "แจ้งเตือนแชต",
    chatNotificationsCopy: "แจ้งฉันเมื่อแชตกลุ่มมีตอัปมีข้อความใหม่",
    quietNotifications: "การแจ้งเตือนแบบนุ่มนวล",
    quietNotificationsCopy: "คงโทนการแจ้งเตือนให้สุภาพและไม่ดึงความสนใจเกินไป",
    locationDiscovery: "ตำแหน่งและการค้นพบ",
    useApproximateLocation: "ใช้ตำแหน่งโดยประมาณ",
    useApproximateLocationCopy: "แสดงตัวเลือกใกล้เคียงโดยไม่แชร์ตำแหน่งที่แม่นยำ",
    showDistanceInMeetups: "แสดงระยะทางในมีตอัป",
    showDistanceInMeetupsCopy: "แสดงระยะทางโดยประมาณบนการ์ดกิจกรรมและมีตอัป",
    safetyContact: "ความปลอดภัยและการติดต่อ",
    allowMessageRequests: "อนุญาตคำขอส่งข้อความ",
    allowMessageRequestsCopy: "ให้ผู้อื่นส่งข้อความก่อนเข้าร่วมมีตอัปเดียวกันได้",
    safetyCheckIns: "เช็กอินความปลอดภัย",
    safetyCheckInsCopy: "เปิดการเตือนเช็กอินแบบนุ่มนวลรอบมีตอัปที่เข้าร่วม",
  },
  Vietnamese: {
    appearance: "Giao diện",
    colorPalette: "Bảng màu",
    colorPaletteCopy: "Chọn tâm trạng và màu nhấn bạn thích.",
    notifications: "Thông báo",
    meetupReminders: "Nhắc meetup",
    meetupRemindersCopy: "Nhận nhắc nhở trước các meetup bạn đã tham gia.",
    weatherAlerts: "Cảnh báo thời tiết",
    weatherAlertsCopy: "Nhận cập nhật khi thời tiết có thể ảnh hưởng đến kế hoạch ngoài trời.",
    chatNotifications: "Thông báo chat",
    chatNotificationsCopy: "Báo cho tôi khi chat nhóm meetup có tin nhắn mới.",
    quietNotifications: "Thông báo nhẹ nhàng",
    quietNotificationsCopy: "Giữ thông báo dịu nhẹ và tránh cảnh báo gây chú ý quá mức.",
    locationDiscovery: "Vị trí & khám phá",
    useApproximateLocation: "Dùng vị trí gần đúng",
    useApproximateLocationCopy: "Hiển thị lựa chọn gần bạn mà không chia sẻ vị trí chính xác.",
    showDistanceInMeetups: "Hiển thị khoảng cách trong meetup",
    showDistanceInMeetupsCopy: "Hiển thị khoảng cách gần đúng trên thẻ sự kiện và meetup.",
    safetyContact: "An toàn & liên hệ",
    allowMessageRequests: "Cho phép yêu cầu tin nhắn",
    allowMessageRequestsCopy: "Cho phép người khác nhắn trước khi cùng tham gia một meetup.",
    safetyCheckIns: "Check-in an toàn",
    safetyCheckInsCopy: "Bật nhắc nhở check-in nhẹ nhàng quanh các meetup đã tham gia.",
  },
  Russian: {
    appearance: "Внешний вид",
    colorPalette: "Цветовая палитра",
    colorPaletteCopy: "Выберите настроение и акцентные цвета, которые вам подходят.",
    notifications: "Уведомления",
    meetupReminders: "Напоминания о встречах",
    meetupRemindersCopy: "Получайте напоминания перед встречами, к которым вы присоединились.",
    weatherAlerts: "Погодные уведомления",
    weatherAlertsCopy: "Получайте обновления, если погода может повлиять на план на улице.",
    chatNotifications: "Уведомления чата",
    chatNotificationsCopy: "Сообщать о новых сообщениях в групповых чатах встреч.",
    quietNotifications: "Тихие уведомления",
    quietNotificationsCopy: "Сохраняйте мягкий тон уведомлений без резких сигналов.",
    locationDiscovery: "Локация и поиск",
    useApproximateLocation: "Использовать примерное местоположение",
    useApproximateLocationCopy: "Показывать варианты рядом без точного местоположения.",
    showDistanceInMeetups: "Показывать расстояние во встречах",
    showDistanceInMeetupsCopy: "Показывать примерное расстояние на карточках событий и встреч.",
    safetyContact: "Безопасность и контакт",
    allowMessageRequests: "Разрешить запросы сообщений",
    allowMessageRequestsCopy: "Позволить людям писать до присоединения к одной встрече.",
    safetyCheckIns: "Проверки безопасности",
    safetyCheckInsCopy: "Включить мягкие напоминания вокруг присоединённых встреч.",
  },
  Spanish: {
    appearance: "Apariencia",
    colorPalette: "Paleta de colores",
    colorPaletteCopy: "Elige el ambiente y los colores de acento que prefieres.",
    notifications: "Notificaciones",
    meetupReminders: "Recordatorios de quedadas",
    meetupRemindersCopy: "Recibe recordatorios antes de las quedadas a las que te uniste.",
    weatherAlerts: "Alertas del clima",
    weatherAlertsCopy: "Recibe actualizaciones cuando el clima pueda afectar un plan al aire libre.",
    chatNotifications: "Notificaciones de chat",
    chatNotificationsCopy: "Avísame cuando los chats de quedadas tengan mensajes nuevos.",
    quietNotifications: "Notificaciones tranquilas",
    quietNotificationsCopy: "Mantén un tono suave y evita alertas que llamen demasiado la atención.",
    locationDiscovery: "Ubicación y descubrimiento",
    useApproximateLocation: "Usar ubicación aproximada",
    useApproximateLocationCopy: "Muestra opciones cercanas sin compartir una ubicación precisa.",
    showDistanceInMeetups: "Mostrar distancia en quedadas",
    showDistanceInMeetupsCopy: "Muestra la distancia aproximada en tarjetas de eventos y quedadas.",
    safetyContact: "Seguridad y contacto",
    allowMessageRequests: "Permitir solicitudes de mensaje",
    allowMessageRequestsCopy: "Permite mensajes antes de unirse a la misma quedada.",
    safetyCheckIns: "Controles de seguridad",
    safetyCheckInsCopy: "Activa recordatorios suaves alrededor de las quedadas unidas.",
  },
  Danish: {
    appearance: "Udseende",
    colorPalette: "Farvepalet",
    colorPaletteCopy: "Vælg den stemning og de accentfarver, du foretrækker.",
    notifications: "Notifikationer",
    meetupReminders: "Meetup-påmindelser",
    meetupRemindersCopy: "Få påmindelser før meetups, du har tilmeldt dig.",
    weatherAlerts: "Vejrvarsler",
    weatherAlertsCopy: "Få opdateringer, når vejret kan påvirke en udendørs plan.",
    chatNotifications: "Chatnotifikationer",
    chatNotificationsCopy: "Giv mig besked, når meetup-gruppechats har nye beskeder.",
    quietNotifications: "Stille notifikationer",
    quietNotificationsCopy: "Hold notifikationerne blide og undgå opmærksomhedstunge alarmer.",
    locationDiscovery: "Placering og opdagelse",
    useApproximateLocation: "Brug omtrentlig placering",
    useApproximateLocationCopy: "Vis muligheder i nærheden uden at dele en præcis placering.",
    showDistanceInMeetups: "Vis afstand i meetups",
    showDistanceInMeetupsCopy: "Vis omtrentlig afstand på event- og meetupkort.",
    safetyContact: "Sikkerhed og kontakt",
    allowMessageRequests: "Tillad beskedanmodninger",
    allowMessageRequestsCopy: "Lad personer sende beskeder, før I deltager i samme meetup.",
    safetyCheckIns: "Sikkerheds-check-ins",
    safetyCheckInsCopy: "Slå blide check-in-påmindelser til omkring dine meetups.",
  },
  Dutch: {
    appearance: "Weergave",
    colorPalette: "Kleurenpalet",
    colorPaletteCopy: "Kies de sfeer en accentkleuren die je prettig vindt.",
    notifications: "Meldingen",
    meetupReminders: "Meetup-herinneringen",
    meetupRemindersCopy: "Ontvang herinneringen voor meetups waaraan je deelneemt.",
    weatherAlerts: "Weerwaarschuwingen",
    weatherAlertsCopy: "Ontvang updates wanneer het weer een buitenplan kan beïnvloeden.",
    chatNotifications: "Chatmeldingen",
    chatNotificationsCopy: "Laat het me weten wanneer meetup-groepschats nieuwe berichten hebben.",
    quietNotifications: "Rustige meldingen",
    quietNotificationsCopy: "Houd meldingen zacht en vermijd aandachttrekkende waarschuwingen.",
    locationDiscovery: "Locatie en ontdekken",
    useApproximateLocation: "Gebruik globale locatie",
    useApproximateLocationCopy: "Toon opties in de buurt zonder een exacte locatie te delen.",
    showDistanceInMeetups: "Afstand tonen in meetups",
    showDistanceInMeetupsCopy: "Toon geschatte afstand op event- en meetupkaarten.",
    safetyContact: "Veiligheid en contact",
    allowMessageRequests: "Berichtverzoeken toestaan",
    allowMessageRequestsCopy: "Laat mensen berichten sturen voordat jullie bij dezelfde meetup zitten.",
    safetyCheckIns: "Veiligheidscheck-ins",
    safetyCheckInsCopy: "Schakel zachte check-in prompts in rond meetups waaraan je meedoet.",
  },
  Finnish: {
    appearance: "Ulkoasu",
    colorPalette: "Väripaletti",
    colorPaletteCopy: "Valitse tunnelma ja korostusvärit, jotka tuntuvat sinusta hyviltä.",
    notifications: "Ilmoitukset",
    meetupReminders: "Tapaamismuistutukset",
    meetupRemindersCopy: "Saat muistutuksia ennen tapaamisia, joihin olet liittynyt.",
    weatherAlerts: "Sääilmoitukset",
    weatherAlertsCopy: "Saat päivityksiä, kun sää voi vaikuttaa ulkosuunnitelmaan.",
    chatNotifications: "Chat-ilmoitukset",
    chatNotificationsCopy: "Ilmoita, kun tapaamisen ryhmächatissa on uusia viestejä.",
    quietNotifications: "Rauhalliset ilmoitukset",
    quietNotificationsCopy: "Pidä ilmoitukset lempeinä ja vältä huomiota vaativia hälytyksiä.",
    locationDiscovery: "Sijainti ja löytäminen",
    useApproximateLocation: "Käytä likimääräistä sijaintia",
    useApproximateLocationCopy: "Näytä lähellä olevia vaihtoehtoja jakamatta tarkkaa sijaintia.",
    showDistanceInMeetups: "Näytä etäisyys tapaamisissa",
    showDistanceInMeetupsCopy: "Näytä likimääräinen etäisyys tapahtuma- ja tapaamiskorteissa.",
    safetyContact: "Turvallisuus ja yhteydenpito",
    allowMessageRequests: "Salli viestipyynnöt",
    allowMessageRequestsCopy: "Anna ihmisten lähettää viesti ennen samaan tapaamiseen liittymistä.",
    safetyCheckIns: "Turvallisuustarkistukset",
    safetyCheckInsCopy: "Ota käyttöön lempeät tarkistusmuistutukset liittymiesi tapaamisten ympärillä.",
  },
  Greek: {
    appearance: "Εμφάνιση",
    colorPalette: "Παλέτα χρωμάτων",
    colorPaletteCopy: "Επιλέξτε τη διάθεση και τα χρώματα έμφασης που προτιμάτε.",
    notifications: "Ειδοποιήσεις",
    meetupReminders: "Υπενθυμίσεις συναντήσεων",
    meetupRemindersCopy: "Λάβετε υπενθυμίσεις πριν από συναντήσεις στις οποίες έχετε συμμετάσχει.",
    weatherAlerts: "Ειδοποιήσεις καιρού",
    weatherAlertsCopy: "Λάβετε ενημερώσεις όταν ο καιρός μπορεί να επηρεάσει ένα εξωτερικό σχέδιο.",
    chatNotifications: "Ειδοποιήσεις συνομιλίας",
    chatNotificationsCopy: "Ειδοποιήστε με όταν οι ομαδικές συνομιλίες συναντήσεων έχουν νέα μηνύματα.",
    quietNotifications: "Ήρεμες ειδοποιήσεις",
    quietNotificationsCopy: "Κρατήστε τον τόνο των ειδοποιήσεων ήπιο και χωρίς έντονες ειδοποιήσεις.",
    locationDiscovery: "Τοποθεσία και ανακάλυψη",
    useApproximateLocation: "Χρήση κατά προσέγγιση τοποθεσίας",
    useApproximateLocationCopy: "Εμφανίστε κοντινές επιλογές χωρίς κοινοποίηση ακριβούς τοποθεσίας.",
    showDistanceInMeetups: "Εμφάνιση απόστασης στις συναντήσεις",
    showDistanceInMeetupsCopy: "Εμφανίστε κατά προσέγγιση απόσταση σε κάρτες εκδηλώσεων και συναντήσεων.",
    safetyContact: "Ασφάλεια και επικοινωνία",
    allowMessageRequests: "Να επιτρέπονται αιτήματα μηνυμάτων",
    allowMessageRequestsCopy: "Επιτρέψτε σε άτομα να στείλουν μήνυμα πριν μπείτε στην ίδια συνάντηση.",
    safetyCheckIns: "Έλεγχοι ασφαλείας",
    safetyCheckInsCopy: "Ενεργοποιήστε ήπιες υπενθυμίσεις ελέγχου γύρω από τις συναντήσεις σας.",
  },
  Norwegian: {
    appearance: "Utseende",
    colorPalette: "Fargepalett",
    colorPaletteCopy: "Velg stemningen og aksentfargene du foretrekker.",
    notifications: "Varsler",
    meetupReminders: "Meetup-påminnelser",
    meetupRemindersCopy: "Få påminnelser før meetups du har blitt med på.",
    weatherAlerts: "Værvarsler",
    weatherAlertsCopy: "Motta oppdateringer når været kan påvirke en utendørs plan.",
    chatNotifications: "Chatvarsler",
    chatNotificationsCopy: "Varsle meg når meetup-gruppechatter har nye meldinger.",
    quietNotifications: "Stille varsler",
    quietNotificationsCopy: "Hold varslene milde og unngå oppmerksomhetstunge varsler.",
    locationDiscovery: "Plassering og oppdagelse",
    useApproximateLocation: "Bruk omtrentlig plassering",
    useApproximateLocationCopy: "Vis alternativer i nærheten uten å dele nøyaktig plassering.",
    showDistanceInMeetups: "Vis avstand i meetups",
    showDistanceInMeetupsCopy: "Vis omtrentlig avstand på event- og meetupkort.",
    safetyContact: "Sikkerhet og kontakt",
    allowMessageRequests: "Tillat meldingsforespørsler",
    allowMessageRequestsCopy: "La folk sende melding før dere blir med på samme meetup.",
    safetyCheckIns: "Sikkerhetsinnsjekker",
    safetyCheckInsCopy: "Aktiver milde innsjekkingspåminnelser rundt meetups du har blitt med på.",
  },
  Polish: {
    appearance: "Wygląd",
    colorPalette: "Paleta kolorów",
    colorPaletteCopy: "Wybierz nastrój i kolory akcentu, które preferujesz.",
    notifications: "Powiadomienia",
    meetupReminders: "Przypomnienia o spotkaniach",
    meetupRemindersCopy: "Otrzymuj przypomnienia przed spotkaniami, do których dołączysz.",
    weatherAlerts: "Alerty pogodowe",
    weatherAlertsCopy: "Otrzymuj aktualizacje, gdy pogoda może wpłynąć na plan na zewnątrz.",
    chatNotifications: "Powiadomienia czatu",
    chatNotificationsCopy: "Powiadom mnie, gdy czaty grupowe spotkań mają nowe wiadomości.",
    quietNotifications: "Ciche powiadomienia",
    quietNotificationsCopy: "Zachowaj łagodny ton powiadomień i unikaj natarczywych alertów.",
    locationDiscovery: "Lokalizacja i odkrywanie",
    useApproximateLocation: "Użyj przybliżonej lokalizacji",
    useApproximateLocationCopy: "Pokaż opcje w pobliżu bez udostępniania dokładnej lokalizacji.",
    showDistanceInMeetups: "Pokaż odległość w spotkaniach",
    showDistanceInMeetupsCopy: "Wyświetl przybliżoną odległość na kartach wydarzeń i spotkań.",
    safetyContact: "Bezpieczeństwo i kontakt",
    allowMessageRequests: "Zezwalaj na prośby o wiadomość",
    allowMessageRequestsCopy: "Pozwól ludziom pisać przed dołączeniem do tego samego spotkania.",
    safetyCheckIns: "Kontrole bezpieczeństwa",
    safetyCheckInsCopy: "Włącz łagodne przypomnienia kontrolne wokół spotkań, do których dołączasz.",
  },
  Portuguese: {
    appearance: "Aparência",
    colorPalette: "Paleta de cores",
    colorPaletteCopy: "Escolha o ambiente e as cores de destaque que prefere.",
    notifications: "Notificações",
    meetupReminders: "Lembretes de encontros",
    meetupRemindersCopy: "Receba lembretes antes dos encontros a que se juntou.",
    weatherAlerts: "Alertas meteorológicos",
    weatherAlertsCopy: "Receba atualizações quando o tempo puder afetar um plano ao ar livre.",
    chatNotifications: "Notificações de chat",
    chatNotificationsCopy: "Avise-me quando os chats de grupo dos encontros tiverem novas mensagens.",
    quietNotifications: "Notificações discretas",
    quietNotificationsCopy: "Mantenha as notificações suaves e evite alertas que chamem muita atenção.",
    locationDiscovery: "Localização e descoberta",
    useApproximateLocation: "Usar localização aproximada",
    useApproximateLocationCopy: "Mostre opções próximas sem partilhar uma localização precisa.",
    showDistanceInMeetups: "Mostrar distância nos encontros",
    showDistanceInMeetupsCopy: "Mostre distância aproximada nos cartões de eventos e encontros.",
    safetyContact: "Segurança e contacto",
    allowMessageRequests: "Permitir pedidos de mensagem",
    allowMessageRequestsCopy: "Permita mensagens antes de se juntarem ao mesmo encontro.",
    safetyCheckIns: "Check-ins de segurança",
    safetyCheckInsCopy: "Ative lembretes suaves de check-in em torno dos encontros aderidos.",
  },
  Romanian: {
    appearance: "Aspect",
    colorPalette: "Paletă de culori",
    colorPaletteCopy: "Alege starea și culorile de accent pe care le preferi.",
    notifications: "Notificări",
    meetupReminders: "Mementouri pentru întâlniri",
    meetupRemindersCopy: "Primește mementouri înaintea întâlnirilor la care te-ai alăturat.",
    weatherAlerts: "Alerte meteo",
    weatherAlertsCopy: "Primește actualizări când vremea poate afecta un plan în aer liber.",
    chatNotifications: "Notificări chat",
    chatNotificationsCopy: "Anunță-mă când chaturile de grup ale întâlnirilor au mesaje noi.",
    quietNotifications: "Notificări liniștite",
    quietNotificationsCopy: "Păstrează notificările blânde și evită alertele prea insistente.",
    locationDiscovery: "Locație și descoperire",
    useApproximateLocation: "Folosește locația aproximativă",
    useApproximateLocationCopy: "Afișează opțiuni apropiate fără a partaja locația exactă.",
    showDistanceInMeetups: "Arată distanța în întâlniri",
    showDistanceInMeetupsCopy: "Afișează distanța aproximativă pe cardurile de eveniment și întâlnire.",
    safetyContact: "Siguranță și contact",
    allowMessageRequests: "Permite cereri de mesaj",
    allowMessageRequestsCopy: "Permite oamenilor să trimită mesaj înainte de aceeași întâlnire.",
    safetyCheckIns: "Verificări de siguranță",
    safetyCheckInsCopy: "Activează verificări blânde în jurul întâlnirilor la care participi.",
  },
  Swedish: {
    appearance: "Utseende",
    colorPalette: "Färgpalett",
    colorPaletteCopy: "Välj den stämning och de accentfärger du föredrar.",
    notifications: "Aviseringar",
    meetupReminders: "Meetup-påminnelser",
    meetupRemindersCopy: "Få påminnelser före meetups du har gått med i.",
    weatherAlerts: "Vädervarningar",
    weatherAlertsCopy: "Få uppdateringar när vädret kan påverka en utomhusplan.",
    chatNotifications: "Chattaviseringar",
    chatNotificationsCopy: "Meddela mig när meetup-gruppchattar har nya meddelanden.",
    quietNotifications: "Tysta aviseringar",
    quietNotificationsCopy: "Håll aviseringstonen mild och undvik uppmärksamhetstunga larm.",
    locationDiscovery: "Plats och upptäckt",
    useApproximateLocation: "Använd ungefärlig plats",
    useApproximateLocationCopy: "Visa alternativ i närheten utan att dela exakt plats.",
    showDistanceInMeetups: "Visa avstånd i meetups",
    showDistanceInMeetupsCopy: "Visa ungefärligt avstånd på event- och meetupkort.",
    safetyContact: "Säkerhet och kontakt",
    allowMessageRequests: "Tillåt meddelandeförfrågningar",
    allowMessageRequestsCopy: "Låt personer skicka meddelanden innan ni går med i samma meetup.",
    safetyCheckIns: "Säkerhetsincheckningar",
    safetyCheckInsCopy: "Aktivera milda incheckningspåminnelser kring meetups du har gått med i.",
  },
  Turkish: {
    appearance: "Görünüm",
    colorPalette: "Renk paleti",
    colorPaletteCopy: "Tercih ettiğiniz ruh halini ve vurgu renklerini seçin.",
    notifications: "Bildirimler",
    meetupReminders: "Meetup hatırlatıcıları",
    meetupRemindersCopy: "Katıldığınız meetuplardan önce hatırlatıcı alın.",
    weatherAlerts: "Hava durumu uyarıları",
    weatherAlertsCopy: "Hava durumu açık hava planını etkileyebileceğinde güncellemeler alın.",
    chatNotifications: "Sohbet bildirimleri",
    chatNotificationsCopy: "Meetup grup sohbetlerinde yeni mesaj olduğunda bildir.",
    quietNotifications: "Sessiz bildirimler",
    quietNotificationsCopy: "Bildirim tonunu nazik tutun ve dikkat çekici uyarılardan kaçının.",
    locationDiscovery: "Konum ve keşif",
    useApproximateLocation: "Yaklaşık konum kullan",
    useApproximateLocationCopy: "Kesin konum paylaşmadan yakındaki seçenekleri göster.",
    showDistanceInMeetups: "Meetuplarda mesafeyi göster",
    showDistanceInMeetupsCopy: "Etkinlik ve meetup kartlarında yaklaşık mesafeyi göster.",
    safetyContact: "Güvenlik ve iletişim",
    allowMessageRequests: "Mesaj isteklerine izin ver",
    allowMessageRequestsCopy: "Aynı meetupa katılmadan önce insanların mesaj atmasına izin ver.",
    safetyCheckIns: "Güvenlik kontrolleri",
    safetyCheckInsCopy: "Katıldığınız meetuplar etrafında nazik kontrol hatırlatıcıları açın.",
  },
  Ukrainian: {
    appearance: "Вигляд",
    colorPalette: "Колірна палітра",
    colorPaletteCopy: "Оберіть настрій і акцентні кольори, які вам підходять.",
    notifications: "Сповіщення",
    meetupReminders: "Нагадування про зустрічі",
    meetupRemindersCopy: "Отримуйте нагадування перед зустрічами, до яких ви приєдналися.",
    weatherAlerts: "Погодні сповіщення",
    weatherAlertsCopy: "Отримуйте оновлення, коли погода може вплинути на план надворі.",
    chatNotifications: "Сповіщення чату",
    chatNotificationsCopy: "Повідомляти, коли групові чати зустрічей мають нові повідомлення.",
    quietNotifications: "Тихі сповіщення",
    quietNotificationsCopy: "Зберігайте м'який тон сповіщень і уникайте нав'язливих сигналів.",
    locationDiscovery: "Локація і пошук",
    useApproximateLocation: "Використовувати приблизну локацію",
    useApproximateLocationCopy: "Показувати варіанти поруч без точної локації.",
    showDistanceInMeetups: "Показувати відстань у зустрічах",
    showDistanceInMeetupsCopy: "Показувати приблизну відстань на картках подій і зустрічей.",
    safetyContact: "Безпека і контакт",
    allowMessageRequests: "Дозволити запити повідомлень",
    allowMessageRequestsCopy: "Дозволити людям писати перед приєднанням до тієї самої зустрічі.",
    safetyCheckIns: "Перевірки безпеки",
    safetyCheckInsCopy: "Увімкнути м'які нагадування про перевірку навколо ваших зустрічей.",
  },
};

const paletteTranslations: Record<string, Record<string, { label: string; description: string }>> = {
  Arabic: {
    midnight: { label: "منتصف الليل NSN", description: "كحلي عميق مع لمسات نيلي وفيروزية." },
    ocean: { label: "هدوء المحيط", description: "درجات الأزرق والأكوا والسماء الناعمة." },
    forest: { label: "غابة اجتماعية", description: "أسطح خضراء دائمة مع لمسات دافئة وودودة." },
    sunset: { label: "غروب دافئ", description: "لمسات مرجانية وذهبية لمزاج أكثر نعومة." },
    lavender: { label: "لافندر هادئ", description: "لمسات بنفسجية ناعمة لشعور اجتماعي أهدأ." },
  },
  Chinese: {
    midnight: { label: "午夜 NSN", description: "深海军蓝，搭配靛蓝和青绿色强调色。" },
    ocean: { label: "海洋平静", description: "蓝色、水色和柔和天空色。" },
    forest: { label: "森林社交", description: "常青色界面，带温暖友好的高亮。" },
    sunset: { label: "温暖日落", description: "珊瑚色和金色强调，带来更柔和的心情。" },
    lavender: { label: "安静薰衣草", description: "柔和紫色强调，营造更平静的社交感。" },
  },
  French: {
    midnight: { label: "Minuit NSN", description: "Bleu nuit profond avec accents indigo et turquoise." },
    ocean: { label: "Calme océan", description: "Bleu, aqua et tons doux de ciel." },
    forest: { label: "Forêt sociale", description: "Surfaces vert forêt avec touches chaleureuses." },
    sunset: { label: "Coucher chaud", description: "Accents corail et or pour une humeur plus douce." },
    lavender: { label: "Lavande calme", description: "Accents violets doux pour une sensation sociale plus calme." },
  },
  German: {
    midnight: { label: "Mitternacht NSN", description: "Tiefes Marineblau mit Indigo- und Türkisakzenten." },
    ocean: { label: "Ozeanruhe", description: "Blau-, Aqua- und weiche Himmelstöne." },
    forest: { label: "Sozialer Wald", description: "Immergrüne Flächen mit warmen freundlichen Highlights." },
    sunset: { label: "Warmer Sonnenuntergang", description: "Koralle und Gold für eine weichere Stimmung." },
    lavender: { label: "Ruhiger Lavendel", description: "Weiche violette Akzente für ein ruhigeres soziales Gefühl." },
  },
  Hebrew: {
    midnight: { label: "חצות NSN", description: "כחול עמוק עם הדגשות אינדיגו וטורקיז." },
    ocean: { label: "רוגע אוקיינוס", description: "כחול, אקווה וגווני שמיים רכים." },
    forest: { label: "יער חברתי", description: "משטחי ירוק-עד עם הדגשות חמימות וידידותיות." },
    sunset: { label: "שקיעה חמימה", description: "הדגשות קורל וזהב לאווירה רכה יותר." },
    lavender: { label: "לבנדר שקט", description: "הדגשות סגולות רכות לתחושה חברתית רגועה יותר." },
  },
  Hindi: {
    midnight: { label: "मिडनाइट NSN", description: "इंडिगो और टील ऐक्सेंट के साथ गहरा नेवी।" },
    ocean: { label: "ओशन calm", description: "नीले, एक्वा और नरम आसमानी रंग।" },
    forest: { label: "फॉरेस्ट सोशल", description: "गरम दोस्ताना हाइलाइट्स के साथ एवरग्रीन सतहें।" },
    sunset: { label: "सनसेट वार्म", description: "नरम मूड के लिए कोरल और गोल्ड ऐक्सेंट।" },
    lavender: { label: "लैवेंडर quiet", description: "शांत सामाजिक एहसास के लिए नरम बैंगनी ऐक्सेंट।" },
  },
  Italian: {
    midnight: { label: "Mezzanotte NSN", description: "Blu navy profondo con accenti indaco e teal." },
    ocean: { label: "Calma oceano", description: "Toni blu, acqua e cielo morbido." },
    forest: { label: "Foresta sociale", description: "Superfici sempreverdi con accenti caldi e amichevoli." },
    sunset: { label: "Tramonto caldo", description: "Accenti corallo e oro per un mood più morbido." },
    lavender: { label: "Lavanda quieta", description: "Accenti viola morbidi per una sensazione sociale più calma." },
  },
  Japanese: {
    midnight: { label: "ミッドナイト NSN", description: "深いネイビーにインディゴとティールのアクセント。" },
    ocean: { label: "オーシャン Calm", description: "ブルー、アクア、やわらかな空色のトーン。" },
    forest: { label: "フォレスト Social", description: "常緑の面に温かく親しみやすいハイライト。" },
    sunset: { label: "サンセット Warm", description: "やわらかな気分のためのコーラルとゴールドのアクセント。" },
    lavender: { label: "ラベンダー Quiet", description: "より落ち着いた社交感のための淡い紫のアクセント。" },
  },
  Korean: {
    midnight: { label: "미드나이트 NSN", description: "인디고와 틸 포인트가 있는 깊은 네이비." },
    ocean: { label: "오션 Calm", description: "블루, 아쿠아, 부드러운 하늘색 톤." },
    forest: { label: "포레스트 Social", description: "따뜻하고 친근한 포인트가 있는 에버그린 표면." },
    sunset: { label: "선셋 Warm", description: "부드러운 분위기의 코랄과 골드 포인트." },
    lavender: { label: "라벤더 Quiet", description: "더 차분한 사회적 느낌을 위한 부드러운 보라 포인트." },
  },
  Persian: {
    midnight: { label: "نیمه‌شب NSN", description: "سرمه‌ای عمیق با لمسه‌های نیلی و فیروزه‌ای." },
    ocean: { label: "آرامش اقیانوس", description: "رنگ‌های آبی، آکوا و آسمانی نرم." },
    forest: { label: "جنگل اجتماعی", description: "سطح‌های سبز همیشه‌بهار با برجسته‌های گرم و دوستانه." },
    sunset: { label: "غروب گرم", description: "لمسه‌های مرجانی و طلایی برای حال‌وهوایی نرم‌تر." },
    lavender: { label: "اسطوخودوس آرام", description: "لمسه‌های بنفش نرم برای حس اجتماعی آرام‌تر." },
  },
  Urdu: {
    midnight: { label: "نصف شب NSN", description: "انڈیگو اور ٹیل جھلکوں کے ساتھ گہرا نیوی۔" },
    ocean: { label: "سمندری سکون", description: "نیلے، ایکوا اور نرم آسمانی رنگ۔" },
    forest: { label: "سماجی جنگل", description: "گرم دوستانہ جھلکوں کے ساتھ evergreen سطحیں۔" },
    sunset: { label: "گرم غروب", description: "نرم مزاج کے لیے کورل اور سنہری جھلکیں۔" },
    lavender: { label: "پرسکون لیونڈر", description: "زیادہ پرسکون سماجی احساس کے لیے نرم جامنی جھلکیں۔" },
  },
  Bengali: {
    midnight: { label: "মিডনাইট NSN", description: "ইন্ডিগো ও টিল অ্যাকসেন্টসহ গভীর নেভি।" },
    ocean: { label: "ওশান শান্তি", description: "নীল, অ্যাকোয়া ও নরম আকাশি টোন।" },
    forest: { label: "সামাজিক বন", description: "উষ্ণ বন্ধুত্বপূর্ণ হাইলাইটসহ চিরসবুজ পৃষ্ঠ।" },
    sunset: { label: "উষ্ণ সূর্যাস্ত", description: "নরম মুডের জন্য কোরাল ও সোনালি অ্যাকসেন্ট।" },
    lavender: { label: "শান্ত ল্যাভেন্ডার", description: "আরও শান্ত সামাজিক অনুভূতির জন্য নরম বেগুনি অ্যাকসেন্ট।" },
  },
  Filipino: {
    midnight: { label: "Midnight NSN", description: "Malalim na navy na may indigo at teal accents." },
    ocean: { label: "Ocean Calm", description: "Blue, aqua at malambot na sky tones." },
    forest: { label: "Forest Social", description: "Evergreen surfaces na may mainit at friendly highlights." },
    sunset: { label: "Sunset Warm", description: "Coral at gold accents para sa mas banayad na mood." },
    lavender: { label: "Lavender Quiet", description: "Malambot na purple accents para sa mas kalmadong social feel." },
  },
  Indonesian: {
    midnight: { label: "Midnight NSN", description: "Navy gelap dengan aksen indigo dan teal." },
    ocean: { label: "Ocean Calm", description: "Nuansa biru, aqua, dan langit lembut." },
    forest: { label: "Forest Social", description: "Permukaan hijau abadi dengan sorotan hangat dan ramah." },
    sunset: { label: "Sunset Warm", description: "Aksen koral dan emas untuk suasana yang lebih lembut." },
    lavender: { label: "Lavender Quiet", description: "Aksen ungu lembut untuk rasa sosial yang lebih tenang." },
  },
  Malay: {
    midnight: { label: "Midnight NSN", description: "Biru navy gelap dengan aksen indigo dan teal." },
    ocean: { label: "Ocean Calm", description: "Nada biru, aqua dan langit lembut." },
    forest: { label: "Forest Social", description: "Permukaan hijau dengan sorotan hangat dan mesra." },
    sunset: { label: "Sunset Warm", description: "Aksen karang dan emas untuk suasana lebih lembut." },
    lavender: { label: "Lavender Quiet", description: "Aksen ungu lembut untuk rasa sosial yang lebih tenang." },
  },
  Thai: {
    midnight: { label: "Midnight NSN", description: "น้ำเงินเข้มพร้อมสีเน้นอินดิโกและทีล" },
    ocean: { label: "Ocean Calm", description: "โทนฟ้า อะควา และสีท้องฟ้านุ่มๆ" },
    forest: { label: "Forest Social", description: "พื้นผิวเขียวเข้มพร้อมไฮไลต์อบอุ่นและเป็นมิตร" },
    sunset: { label: "Sunset Warm", description: "สีเน้นคอรัลและทองเพื่ออารมณ์ที่นุ่มขึ้น" },
    lavender: { label: "Lavender Quiet", description: "สีม่วงนุ่มๆ สำหรับความรู้สึกทางสังคมที่สงบขึ้น" },
  },
  Turkish: {
    midnight: { label: "Gece Yarısı NSN", description: "İndigo ve teal vurgulu derin lacivert." },
    ocean: { label: "Okyanus Sakinliği", description: "Mavi, aqua ve yumuşak gökyüzü tonları." },
    forest: { label: "Sosyal Orman", description: "Sıcak ve dostça vurgularla yaprak dökmeyen yüzeyler." },
    sunset: { label: "Sıcak Gün Batımı", description: "Daha yumuşak bir ruh hali için mercan ve altın vurgular." },
    lavender: { label: "Sakin Lavanta", description: "Daha sakin bir sosyal his için yumuşak mor vurgular." },
  },
  Vietnamese: {
    midnight: { label: "Midnight NSN", description: "Xanh navy sâu với điểm nhấn chàm và teal." },
    ocean: { label: "Ocean Calm", description: "Tông xanh, aqua và màu trời dịu." },
    forest: { label: "Forest Social", description: "Bề mặt xanh lá với điểm nhấn ấm áp và thân thiện." },
    sunset: { label: "Sunset Warm", description: "Điểm nhấn san hô và vàng cho tâm trạng mềm hơn." },
    lavender: { label: "Lavender Quiet", description: "Điểm nhấn tím dịu cho cảm giác xã hội bình tĩnh hơn." },
  },
  Russian: {
    midnight: { label: "Полночь NSN", description: "Глубокий тёмно-синий с индиго и бирюзовыми акцентами." },
    ocean: { label: "Океанское спокойствие", description: "Синие, аква и мягкие небесные тона." },
    forest: { label: "Лесное общение", description: "Вечнозелёные поверхности с тёплыми дружелюбными акцентами." },
    sunset: { label: "Тёплый закат", description: "Коралловые и золотые акценты для более мягкого настроения." },
    lavender: { label: "Тихая лаванда", description: "Мягкие фиолетовые акценты для более спокойного общения." },
  },
  Spanish: {
    midnight: { label: "Medianoche NSN", description: "Azul marino profundo con acentos índigo y turquesa." },
    ocean: { label: "Calma océano", description: "Tonos azules, aqua y cielo suave." },
    forest: { label: "Bosque social", description: "Superficies verdes con detalles cálidos y amables." },
    sunset: { label: "Atardecer cálido", description: "Acentos coral y dorado para un ánimo más suave." },
    lavender: { label: "Lavanda tranquila", description: "Acentos morados suaves para una sensación social más calmada." },
  },
  Afrikaans: {
    midnight: { label: "Middernag NSN", description: "Diep vlootblou met indigo- en tealkleur-aksente." },
    ocean: { label: "Oseaan-kalmte", description: "Blou, aqua en sagte lugtone." },
    forest: { label: "Sosiale woud", description: "Immergroen oppervlaktes met warm, vriendelike hoogtepunte." },
    sunset: { label: "Warm sonsondergang", description: "Koraal- en goudaksente vir 'n sagter stemming." },
    lavender: { label: "Stil laventel", description: "Sagte pers aksente vir 'n rustiger sosiale gevoel." },
  },
  Albanian: {
    midnight: { label: "Mesnatë NSN", description: "Blu e errët me thekse indigo dhe teal." },
    ocean: { label: "Qetësi oqeani", description: "Tone blu, aqua dhe qielli të butë." },
    forest: { label: "Pyll social", description: "Sipërfaqe të gjelbra me thekse të ngrohta e miqësore." },
    sunset: { label: "Perëndim i ngrohtë", description: "Thekse korali dhe ari për një humor më të butë." },
    lavender: { label: "Livando e qetë", description: "Thekse vjollce të buta për një ndjesi sociale më të qetë." },
  },
  Armenian: {
    midnight: { label: "Կեսգիշեր NSN", description: "Խորը մուգ կապույտ՝ ինդիգո և թիլ շեշտերով։" },
    ocean: { label: "Օվկիանոսի հանգստություն", description: "Կապույտ, ակվա և մեղմ երկնագույն երանգներ։" },
    forest: { label: "Սոցիալական անտառ", description: "Մշտադալար մակերեսներ՝ ջերմ և ընկերական շեշտերով։" },
    sunset: { label: "Ջերմ մայրամուտ", description: "Կորալային և ոսկեգույն շեշտեր՝ ավելի մեղմ տրամադրության համար։" },
    lavender: { label: "Հանգիստ նարդոս", description: "Մեղմ մանուշակագույն շեշտեր՝ ավելի հանգիստ սոցիալական զգացողության համար։" },
  },
  Croatian: {
    midnight: { label: "Ponoćni NSN", description: "Duboka mornarsko plava s indigo i teal naglascima." },
    ocean: { label: "Oceanska smirenost", description: "Plavi, aqua i nježni nebeski tonovi." },
    forest: { label: "Društvena šuma", description: "Zimzelene površine s toplim i prijateljskim naglascima." },
    sunset: { label: "Topli zalazak", description: "Koraljni i zlatni naglasci za mekše raspoloženje." },
    lavender: { label: "Mirna lavanda", description: "Nježni ljubičasti naglasci za mirniji društveni osjećaj." },
  },
  Czech: {
    midnight: { label: "Půlnoční NSN", description: "Hluboká námořnická modř s indigovými a tyrkysovými akcenty." },
    ocean: { label: "Oceánský klid", description: "Modré, akvamarínové a jemné nebeské tóny." },
    forest: { label: "Sociální les", description: "Stálezelené plochy s teplými a přátelskými akcenty." },
    sunset: { label: "Teplý západ", description: "Korálové a zlaté akcenty pro jemnější náladu." },
    lavender: { label: "Tichá levandule", description: "Jemné fialové akcenty pro klidnější společenský pocit." },
  },
  Danish: {
    midnight: { label: "Midnat NSN", description: "Dyb marineblå med indigo- og teal-accenter." },
    ocean: { label: "Havro", description: "Blå, aqua og bløde himmeltoner." },
    forest: { label: "Social skov", description: "Stedsegrønne flader med varme, venlige highlights." },
    sunset: { label: "Varm solnedgang", description: "Koral- og guldaccenter for en blødere stemning." },
    lavender: { label: "Rolig lavendel", description: "Bløde lilla accenter for en roligere social følelse." },
  },
  Dutch: {
    midnight: { label: "Middernacht NSN", description: "Diep marineblauw met indigo- en tealaccenten." },
    ocean: { label: "Oceaankalmte", description: "Blauwe, aqua en zachte luchttinten." },
    forest: { label: "Sociaal bos", description: "Groene oppervlakken met warme, vriendelijke accenten." },
    sunset: { label: "Warme zonsondergang", description: "Koraal- en goudaccenten voor een zachtere stemming." },
    lavender: { label: "Rustige lavendel", description: "Zachte paarse accenten voor een kalmer sociaal gevoel." },
  },
  English: {
    midnight: { label: "Midnight NSN", description: "Deep navy with indigo and teal accents." },
    ocean: { label: "Ocean Calm", description: "Blue, aqua, and soft sky tones." },
    forest: { label: "Forest Social", description: "Evergreen surfaces with warm friendly highlights." },
    sunset: { label: "Sunset Warm", description: "Warm coral and gold accents for a softer mood." },
    lavender: { label: "Lavender Quiet", description: "Soft purple accents for a calmer social feel." },
  },
  Estonian: {
    midnight: { label: "Kesköö NSN", description: "Sügav tumesinine indigo ja teal-aktsentidega." },
    ocean: { label: "Ookeani rahu", description: "Sinised, aqua ja pehmed taeva toonid." },
    forest: { label: "Sotsiaalne mets", description: "Igihaljad pinnad soojade ja sõbralike rõhutustega." },
    sunset: { label: "Soe päikeseloojang", description: "Koralli ja kulla aktsendid pehmema meeleolu jaoks." },
    lavender: { label: "Vaikne lavendel", description: "Pehmed lillad aktsendid rahulikuma sotsiaalse tunde jaoks." },
  },
  Finnish: {
    midnight: { label: "Keskiyö NSN", description: "Syvä laivastonsininen indigo- ja teal-korostuksilla." },
    ocean: { label: "Meren rauha", description: "Sinisiä, aqua- ja pehmeitä taivaan sävyjä." },
    forest: { label: "Sosiaalinen metsä", description: "Ikivihreitä pintoja lämpimillä ja ystävällisillä korostuksilla." },
    sunset: { label: "Lämmin auringonlasku", description: "Koralli- ja kultakorostuksia pehmeämpään tunnelmaan." },
    lavender: { label: "Rauhallinen laventeli", description: "Pehmeitä violetteja korostuksia rauhallisempaan sosiaaliseen tunteeseen." },
  },
  Greek: {
    midnight: { label: "Μεσάνυχτα NSN", description: "Βαθύ ναυτικό μπλε με indigo και teal τόνους." },
    ocean: { label: "Ηρεμία ωκεανού", description: "Μπλε, aqua και απαλοί ουράνιοι τόνοι." },
    forest: { label: "Κοινωνικό δάσος", description: "Αειθαλή επίπεδα με ζεστές και φιλικές πινελιές." },
    sunset: { label: "Ζεστό ηλιοβασίλεμα", description: "Κοραλλί και χρυσές πινελιές για πιο απαλή διάθεση." },
    lavender: { label: "Ήρεμη λεβάντα", description: "Απαλοί μωβ τόνοι για πιο ήρεμη κοινωνική αίσθηση." },
  },
  "Haitian Creole": {
    midnight: { label: "Minwi NSN", description: "Ble maren fon ak aksan endigo ak teal." },
    ocean: { label: "Kalm oseyan", description: "Ton ble, aqua ak syèl dou." },
    forest: { label: "Forè sosyal", description: "Sifas vèt ak aksan cho, zanmitay." },
    sunset: { label: "Kouche solèy cho", description: "Aksan koray ak lò pou yon atitid pi dou." },
    lavender: { label: "Lavand trankil", description: "Aksan mov dou pou yon santiman sosyal pi kalm." },
  },
  Hungarian: {
    midnight: { label: "Éjféli NSN", description: "Mély tengerészkék indigó és türkiz hangsúlyokkal." },
    ocean: { label: "Óceáni nyugalom", description: "Kék, aqua és lágy égbolt tónusok." },
    forest: { label: "Közösségi erdő", description: "Örökzöld felületek meleg, barátságos kiemelésekkel." },
    sunset: { label: "Meleg naplemente", description: "Korall és arany hangsúlyok egy lágyabb hangulathoz." },
    lavender: { label: "Csendes levendula", description: "Lágy lila hangsúlyok egy nyugodtabb közösségi érzéshez." },
  },
  Latvian: {
    midnight: { label: "Pusnakts NSN", description: "Dziļi tumši zils ar indigo un tirkīza akcentiem." },
    ocean: { label: "Okeāna miers", description: "Zili, akva un maigi debesu toņi." },
    forest: { label: "Sociālais mežs", description: "Mūžzaļas virsmas ar siltiem un draudzīgiem akcentiem." },
    sunset: { label: "Silts saulriets", description: "Koraļļu un zelta akcenti maigākai noskaņai." },
    lavender: { label: "Klusa lavanda", description: "Maigi violeti akcenti mierīgākai sociālajai sajūtai." },
  },
  Lithuanian: {
    midnight: { label: "Vidurnakčio NSN", description: "Gili tamsiai mėlyna su indigo ir teal akcentais." },
    ocean: { label: "Vandenyno ramybė", description: "Mėlyni, aqua ir švelnūs dangaus tonai." },
    forest: { label: "Socialinis miškas", description: "Visžalės plokštumos su šiltais ir draugiškais akcentais." },
    sunset: { label: "Šiltas saulėlydis", description: "Koralų ir aukso akcentai švelnesnei nuotaikai." },
    lavender: { label: "Rami levanda", description: "Švelnūs violetiniai akcentai ramesniam socialiniam jausmui." },
  },
  Luxembourgish: {
    midnight: { label: "Mëtternuecht NSN", description: "Déift Marineblo mat Indigo- an Teal-Akzenter." },
    ocean: { label: "Ozeanrou", description: "Blo, Aqua a mëll Himmelstéin." },
    forest: { label: "Soziale Bësch", description: "Immergréng Flächen mat waarmen a frëndlechen Akzenter." },
    sunset: { label: "Waarme Sonnenënnergang", description: "Korall- a Goldakzenter fir eng méi mëll Stëmmung." },
    lavender: { label: "Rouege Lavendel", description: "Mëll violett Akzenter fir e méi rouegt soziaalt Gefill." },
  },
  Norwegian: {
    midnight: { label: "Midnatt NSN", description: "Dyp marineblå med indigo- og tealaksenter." },
    ocean: { label: "Havro", description: "Blå, aqua og myke himmeltoner." },
    forest: { label: "Sosial skog", description: "Eviggrønne flater med varme og vennlige høydepunkter." },
    sunset: { label: "Varm solnedgang", description: "Korall- og gullaksenter for en mykere stemning." },
    lavender: { label: "Rolig lavendel", description: "Myke lilla aksenter for en roligere sosial følelse." },
  },
  Polish: {
    midnight: { label: "Północ NSN", description: "Głęboki granat z akcentami indygo i teal." },
    ocean: { label: "Oceaniczny spokój", description: "Niebieskie, aqua i miękkie odcienie nieba." },
    forest: { label: "Społeczny las", description: "Wiecznie zielone powierzchnie z ciepłymi, przyjaznymi akcentami." },
    sunset: { label: "Ciepły zachód", description: "Koralowe i złote akcenty dla łagodniejszego nastroju." },
    lavender: { label: "Cicha lawenda", description: "Miękkie fioletowe akcenty dla spokojniejszego społecznego odczucia." },
  },
  Portuguese: {
    midnight: { label: "Meia-noite NSN", description: "Azul-marinho profundo com acentos índigo e teal." },
    ocean: { label: "Calma oceano", description: "Tons azuis, aqua e céu suave." },
    forest: { label: "Floresta social", description: "Superfícies verdes com destaques quentes e amigáveis." },
    sunset: { label: "Pôr do sol quente", description: "Acentos coral e dourados para um ambiente mais suave." },
    lavender: { label: "Lavanda tranquila", description: "Acentos roxos suaves para uma sensação social mais calma." },
  },
  Romanian: {
    midnight: { label: "Miez de noapte NSN", description: "Bleumarin profund cu accente indigo și teal." },
    ocean: { label: "Calm oceanic", description: "Tonuri albastre, aqua și cer blând." },
    forest: { label: "Pădure socială", description: "Suprafețe verzi cu accente calde și prietenoase." },
    sunset: { label: "Apus cald", description: "Accente corai și aurii pentru o stare mai blândă." },
    lavender: { label: "Lavandă liniștită", description: "Accente mov delicate pentru o senzație socială mai calmă." },
  },
  Slovak: {
    midnight: { label: "Polnočný NSN", description: "Hlboká námornícka modrá s indigovými a tyrkysovými akcentmi." },
    ocean: { label: "Oceánsky pokoj", description: "Modré, aqua a jemné nebeské tóny." },
    forest: { label: "Spoločenský les", description: "Vždyzelené povrchy s teplými a priateľskými akcentmi." },
    sunset: { label: "Teplý západ", description: "Koralové a zlaté akcenty pre jemnejšiu náladu." },
    lavender: { label: "Tichá levanduľa", description: "Jemné fialové akcenty pre pokojnejší spoločenský pocit." },
  },
  Swedish: {
    midnight: { label: "Midnatt NSN", description: "Djup marinblå med indigo- och tealaccenter." },
    ocean: { label: "Oceanro", description: "Blå, aqua och mjuka himmelstoner." },
    forest: { label: "Social skog", description: "Vintergröna ytor med varma, vänliga accenter." },
    sunset: { label: "Varm solnedgång", description: "Korall- och guldaccenter för en mjukare stämning." },
    lavender: { label: "Stilla lavendel", description: "Mjuka lila accenter för en lugnare social känsla." },
  },
  Ukrainian: {
    midnight: { label: "Північ NSN", description: "Глибокий темно-синій з акцентами індиго та бірюзи." },
    ocean: { label: "Океанський спокій", description: "Сині, аква та м'які небесні тони." },
    forest: { label: "Соціальний ліс", description: "Вічнозелені поверхні з теплими дружніми акцентами." },
    sunset: { label: "Теплий захід", description: "Коралові та золоті акценти для м'якшого настрою." },
    lavender: { label: "Тиха лаванда", description: "М'які фіолетові акценти для спокійнішого соціального відчуття." },
  },
  Yiddish: {
    midnight: { label: "האלבע נאכט NSN", description: "טיף מארינבלוי מיט אינדיגא און טיל אקצענטן." },
    ocean: { label: "אקעאן-רואיקייט", description: "בלויע, אקווא און ווייכע הימל-טאנען." },
    forest: { label: "געזעלשאפטלעכער וואלד", description: "אייביג-גרינע אויבערפלעכן מיט ווארעמע פריינטלעכע אקצענטן." },
    sunset: { label: "ווארעמער זונפארגאנג", description: "קאראל און גאלד אקצענטן פאר א ווייכערער שטימונג." },
    lavender: { label: "שטילער לאווענדער", description: "ווייכע פערפל אקצענטן פאר א רואיגערער געזעלשאפטלעכער געפיל." },
  },
};

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const accessibilityTranslations: Record<string, Required<Pick<SettingsCopy, "accessibility" | "largerText" | "largerTextCopy" | "highContrast" | "highContrastCopy" | "reduceMotion" | "reduceMotionCopy" | "screenReaderHints" | "screenReaderHintsCopy">>> = {
  English: {
    accessibility: "Accessibility",
    largerText: "Larger text",
    largerTextCopy: "Increase text size on this screen and save the preference for the app.",
    highContrast: "High contrast",
    highContrastCopy: "Strengthen borders and text contrast for easier scanning.",
    reduceMotion: "Disable animations",
    reduceMotionCopy: "Turn off decorative movement and use instant Day/Night changes.",
    screenReaderHints: "Screen reader hints",
    screenReaderHintsCopy: "Add extra labels and hints for assistive technologies.",
  },
  Arabic: {
    accessibility: "إمكانية الوصول",
    largerText: "نص أكبر",
    largerTextCopy: "كبّر حجم النص واحفظ هذا التفضيل للتطبيق.",
    highContrast: "تباين عالٍ",
    highContrastCopy: "قوِّ الحدود وتباين النص لتسهيل القراءة.",
    reduceMotion: "تقليل الحركة",
    reduceMotionCopy: "استخدم انتقالات أهدأ وحركة أقل.",
    screenReaderHints: "تلميحات قارئ الشاشة",
    screenReaderHintsCopy: "أضف تسميات وتلميحات إضافية للتقنيات المساعدة.",
  },
  Hebrew: {
    accessibility: "נגישות",
    largerText: "טקסט גדול יותר",
    largerTextCopy: "הגדל את גודל הטקסט ושמור את ההעדפה לאפליקציה.",
    highContrast: "ניגודיות גבוהה",
    highContrastCopy: "חזק גבולות וניגודיות טקסט לסריקה קלה יותר.",
    reduceMotion: "הפחתת תנועה",
    reduceMotionCopy: "העדף מעברים רגועים ופחות תנועה דקורטיבית.",
    screenReaderHints: "רמזים לקורא מסך",
    screenReaderHintsCopy: "הוסף תוויות ורמזים לטכנולוגיות מסייעות.",
  },
  Chinese: {
    accessibility: "辅助功能",
    largerText: "更大文字",
    largerTextCopy: "增大此屏幕文字，并为应用保存偏好。",
    highContrast: "高对比度",
    highContrastCopy: "增强边框和文字对比度，便于浏览。",
    reduceMotion: "减少动态效果",
    reduceMotionCopy: "使用更平静的过渡和更少装饰动画。",
    screenReaderHints: "屏幕阅读器提示",
    screenReaderHintsCopy: "为辅助技术添加额外标签和提示。",
  },
  French: {
    accessibility: "Accessibilité",
    largerText: "Texte plus grand",
    largerTextCopy: "Augmente la taille du texte et enregistre la préférence.",
    highContrast: "Contraste élevé",
    highContrastCopy: "Renforce les bordures et le contraste du texte.",
    reduceMotion: "Réduire les animations",
    reduceMotionCopy: "Préférer des transitions plus calmes.",
    screenReaderHints: "Aides lecteur d'écran",
    screenReaderHintsCopy: "Ajoute des libellés et indications pour les technologies d'assistance.",
  },
  German: {
    accessibility: "Barrierefreiheit",
    largerText: "Größerer Text",
    largerTextCopy: "Erhöhe die Textgröße und speichere die Einstellung.",
    highContrast: "Hoher Kontrast",
    highContrastCopy: "Verstärke Rahmen und Textkontrast.",
    reduceMotion: "Bewegung reduzieren",
    reduceMotionCopy: "Bevorzuge ruhigere Übergänge und weniger Bewegung.",
    screenReaderHints: "Screenreader-Hinweise",
    screenReaderHintsCopy: "Füge zusätzliche Labels und Hinweise für Hilfstechnologien hinzu.",
  },
  Hindi: {
    accessibility: "सुलभता",
    largerText: "बड़ा टेक्स्ट",
    largerTextCopy: "टेक्स्ट आकार बढ़ाएँ और ऐप के लिए पसंद सेव करें।",
    highContrast: "उच्च कंट्रास्ट",
    highContrastCopy: "आसान पढ़ने के लिए बॉर्डर और टेक्स्ट कंट्रास्ट बढ़ाएँ।",
    reduceMotion: "मोशन कम करें",
    reduceMotionCopy: "शांत ट्रांज़िशन और कम सजावटी मूवमेंट पसंद करें।",
    screenReaderHints: "स्क्रीन रीडर संकेत",
    screenReaderHintsCopy: "सहायक तकनीकों के लिए अतिरिक्त लेबल और संकेत जोड़ें।",
  },
  Italian: {
    accessibility: "Accessibilità",
    largerText: "Testo più grande",
    largerTextCopy: "Aumenta il testo e salva la preferenza per l'app.",
    highContrast: "Contrasto elevato",
    highContrastCopy: "Rafforza bordi e contrasto del testo.",
    reduceMotion: "Riduci movimento",
    reduceMotionCopy: "Preferisci transizioni più calme.",
    screenReaderHints: "Suggerimenti screen reader",
    screenReaderHintsCopy: "Aggiungi etichette e suggerimenti per tecnologie assistive.",
  },
  Japanese: {
    accessibility: "アクセシビリティ",
    largerText: "大きい文字",
    largerTextCopy: "文字サイズを大きくし、アプリの設定として保存します。",
    highContrast: "高コントラスト",
    highContrastCopy: "境界線と文字のコントラストを強めます。",
    reduceMotion: "動きを減らす",
    reduceMotionCopy: "落ち着いた遷移と少ない動きを優先します。",
    screenReaderHints: "スクリーンリーダーのヒント",
    screenReaderHintsCopy: "支援技術向けのラベルとヒントを追加します。",
  },
  Korean: {
    accessibility: "접근성",
    largerText: "큰 글자",
    largerTextCopy: "글자 크기를 키우고 앱 설정으로 저장합니다.",
    highContrast: "고대비",
    highContrastCopy: "테두리와 텍스트 대비를 강화합니다.",
    reduceMotion: "움직임 줄이기",
    reduceMotionCopy: "차분한 전환과 적은 움직임을 선호합니다.",
    screenReaderHints: "스크린 리더 힌트",
    screenReaderHintsCopy: "보조 기술을 위한 추가 라벨과 힌트를 추가합니다.",
  },
  Persian: {
    accessibility: "دسترسی‌پذیری",
    largerText: "متن بزرگ‌تر",
    largerTextCopy: "اندازه متن را افزایش دهید و برای برنامه ذخیره کنید.",
    highContrast: "کنتراست بالا",
    highContrastCopy: "حاشیه‌ها و کنتراست متن را قوی‌تر کنید.",
    reduceMotion: "کاهش حرکت",
    reduceMotionCopy: "انتقال‌های آرام‌تر و حرکت کمتر را ترجیح دهید.",
    screenReaderHints: "راهنمای صفحه‌خوان",
    screenReaderHintsCopy: "برچسب‌ها و راهنمایی‌های بیشتر برای فناوری‌های کمکی اضافه کنید.",
  },
  Spanish: {
    accessibility: "Accesibilidad",
    largerText: "Texto más grande",
    largerTextCopy: "Aumenta el tamaño del texto y guarda la preferencia.",
    highContrast: "Alto contraste",
    highContrastCopy: "Refuerza bordes y contraste del texto.",
    reduceMotion: "Reducir movimiento",
    reduceMotionCopy: "Prefiere transiciones más tranquilas.",
    screenReaderHints: "Ayudas para lector de pantalla",
    screenReaderHintsCopy: "Añade etiquetas e indicaciones para tecnologías asistivas.",
  },
  Urdu: {
    accessibility: "رسائی",
    largerText: "بڑا متن",
    largerTextCopy: "متن کا سائز بڑھائیں اور ایپ کے لیے محفوظ کریں۔",
    highContrast: "زیادہ کنٹراسٹ",
    highContrastCopy: "آسان پڑھنے کے لیے بارڈرز اور متن کا کنٹراسٹ بڑھائیں۔",
    reduceMotion: "حرکت کم کریں",
    reduceMotionCopy: "زیادہ پرسکون تبدیلیاں اور کم حرکت ترجیح دیں۔",
    screenReaderHints: "اسکرین ریڈر اشارے",
    screenReaderHintsCopy: "معاون ٹیکنالوجیز کے لیے اضافی لیبلز اور اشارے شامل کریں۔",
  },
  Yiddish: {
    accessibility: "צוטריטלעכקייט",
    largerText: "גרעסערער טעקסט",
    largerTextCopy: "פארגרעסער דעם טעקסט און היט אפ די אויסוואל פאר דער אפ.",
    highContrast: "הויכער קאנטראסט",
    highContrastCopy: "פארשטערק גרענעצן און טעקסט-קאנטראסט כדי עס זאל זיין גרינגער צו לייענען.",
    reduceMotion: "ווייניקער באוועגונג",
    reduceMotionCopy: "נוץ רואיגערע איבערגאנגען און ווייניקער באוועגונג.",
    screenReaderHints: "הינווייזן פאר סקרין-רידער",
    screenReaderHintsCopy: "לייג צו מער לעיבלעך און הינווייזן פאר הילף-טעכנאלאגיעס.",
  },
  Bengali: {
    accessibility: "অ্যাক্সেসিবিলিটি",
    largerText: "বড় টেক্সট",
    largerTextCopy: "টেক্সটের আকার বাড়িয়ে অ্যাপের জন্য পছন্দটি সংরক্ষণ করুন।",
    highContrast: "উচ্চ কনট্রাস্ট",
    highContrastCopy: "সহজে পড়ার জন্য বর্ডার ও টেক্সট কনট্রাস্ট বাড়ান।",
    reduceMotion: "মোশন কমান",
    reduceMotionCopy: "শান্ত ট্রানজিশন এবং কম নড়াচড়া ব্যবহার করুন।",
    screenReaderHints: "স্ক্রিন রিডার নির্দেশনা",
    screenReaderHintsCopy: "সহায়ক প্রযুক্তির জন্য অতিরিক্ত লেবেল ও নির্দেশনা যোগ করুন।",
  },
  Danish: {
    accessibility: "Tilgængelighed",
    largerText: "Større tekst",
    largerTextCopy: "Gør teksten større og gem præferencen for appen.",
    highContrast: "Høj kontrast",
    highContrastCopy: "Gør kanter og tekstkontrast tydeligere.",
    reduceMotion: "Reducer bevægelse",
    reduceMotionCopy: "Foretræk roligere overgange og mindre bevægelse.",
    screenReaderHints: "Skærmlæser-hjælp",
    screenReaderHintsCopy: "Tilføj ekstra labels og hints til hjælpeteknologier.",
  },
  Dutch: {
    accessibility: "Toegankelijkheid",
    largerText: "Grotere tekst",
    largerTextCopy: "Vergroot de tekst en sla de voorkeur op voor de app.",
    highContrast: "Hoog contrast",
    highContrastCopy: "Versterk randen en tekstcontrast voor beter scannen.",
    reduceMotion: "Beweging verminderen",
    reduceMotionCopy: "Gebruik rustigere overgangen en minder beweging.",
    screenReaderHints: "Screenreader-hints",
    screenReaderHintsCopy: "Voeg extra labels en hints toe voor ondersteunende technologie.",
  },
  Filipino: {
    accessibility: "Accessibility",
    largerText: "Mas malaking text",
    largerTextCopy: "Palakihin ang text at i-save ang preference para sa app.",
    highContrast: "Mataas na contrast",
    highContrastCopy: "Palakasin ang borders at text contrast para mas madaling basahin.",
    reduceMotion: "Bawasan ang galaw",
    reduceMotionCopy: "Mas kalmadong transitions at mas kaunting movement.",
    screenReaderHints: "Screen reader hints",
    screenReaderHintsCopy: "Magdagdag ng labels at hints para sa assistive technologies.",
  },
  Finnish: {
    accessibility: "Saavutettavuus",
    largerText: "Suurempi teksti",
    largerTextCopy: "Suurenna tekstiä ja tallenna asetus sovellukselle.",
    highContrast: "Korkea kontrasti",
    highContrastCopy: "Vahvista reunoja ja tekstin kontrastia.",
    reduceMotion: "Vähennä liikettä",
    reduceMotionCopy: "Suosi rauhallisempia siirtymiä ja vähemmän liikettä.",
    screenReaderHints: "Ruudunlukijan vihjeet",
    screenReaderHintsCopy: "Lisää tunnisteita ja vihjeitä avustaville teknologioille.",
  },
  Greek: {
    accessibility: "Προσβασιμότητα",
    largerText: "Μεγαλύτερο κείμενο",
    largerTextCopy: "Αυξήστε το μέγεθος κειμένου και αποθηκεύστε την προτίμηση.",
    highContrast: "Υψηλή αντίθεση",
    highContrastCopy: "Ενισχύστε τα περιγράμματα και την αντίθεση κειμένου.",
    reduceMotion: "Μείωση κίνησης",
    reduceMotionCopy: "Προτιμήστε πιο ήρεμες μεταβάσεις και λιγότερη κίνηση.",
    screenReaderHints: "Υποδείξεις αναγνώστη οθόνης",
    screenReaderHintsCopy: "Προσθέστε ετικέτες και υποδείξεις για βοηθητικές τεχνολογίες.",
  },
  Indonesian: {
    accessibility: "Aksesibilitas",
    largerText: "Teks lebih besar",
    largerTextCopy: "Perbesar teks dan simpan preferensi untuk aplikasi.",
    highContrast: "Kontras tinggi",
    highContrastCopy: "Perkuat garis dan kontras teks agar mudah dipindai.",
    reduceMotion: "Kurangi gerakan",
    reduceMotionCopy: "Pilih transisi lebih tenang dan gerakan lebih sedikit.",
    screenReaderHints: "Petunjuk pembaca layar",
    screenReaderHintsCopy: "Tambahkan label dan petunjuk untuk teknologi bantu.",
  },
  Malay: {
    accessibility: "Kebolehcapaian",
    largerText: "Teks lebih besar",
    largerTextCopy: "Besarkan teks dan simpan pilihan untuk aplikasi.",
    highContrast: "Kontras tinggi",
    highContrastCopy: "Kuatkan sempadan dan kontras teks.",
    reduceMotion: "Kurangkan gerakan",
    reduceMotionCopy: "Utamakan peralihan lebih tenang dan kurang gerakan.",
    screenReaderHints: "Petunjuk pembaca skrin",
    screenReaderHintsCopy: "Tambah label dan petunjuk untuk teknologi bantuan.",
  },
  Norwegian: {
    accessibility: "Tilgjengelighet",
    largerText: "Større tekst",
    largerTextCopy: "Øk tekststørrelsen og lagre innstillingen for appen.",
    highContrast: "Høy kontrast",
    highContrastCopy: "Gjør rammer og tekstkontrast tydeligere.",
    reduceMotion: "Reduser bevegelse",
    reduceMotionCopy: "Foretrekk roligere overganger og mindre bevegelse.",
    screenReaderHints: "Skjermleser-hint",
    screenReaderHintsCopy: "Legg til ekstra etiketter og hint for hjelpeteknologi.",
  },
  Polish: {
    accessibility: "Dostępność",
    largerText: "Większy tekst",
    largerTextCopy: "Zwiększ rozmiar tekstu i zapisz preferencję dla aplikacji.",
    highContrast: "Wysoki kontrast",
    highContrastCopy: "Wzmocnij obramowania i kontrast tekstu.",
    reduceMotion: "Ogranicz ruch",
    reduceMotionCopy: "Preferuj spokojniejsze przejścia i mniej ruchu.",
    screenReaderHints: "Wskazówki czytnika ekranu",
    screenReaderHintsCopy: "Dodaj etykiety i wskazówki dla technologii wspomagających.",
  },
  Portuguese: {
    accessibility: "Acessibilidade",
    largerText: "Texto maior",
    largerTextCopy: "Aumente o texto e guarde a preferência para a app.",
    highContrast: "Alto contraste",
    highContrastCopy: "Reforce bordas e contraste do texto.",
    reduceMotion: "Reduzir movimento",
    reduceMotionCopy: "Prefira transições mais calmas e menos movimento.",
    screenReaderHints: "Dicas para leitor de ecrã",
    screenReaderHintsCopy: "Adicione etiquetas e dicas para tecnologias de assistência.",
  },
  Romanian: {
    accessibility: "Accesibilitate",
    largerText: "Text mai mare",
    largerTextCopy: "Mărește textul și salvează preferința pentru aplicație.",
    highContrast: "Contrast ridicat",
    highContrastCopy: "Întărește marginile și contrastul textului.",
    reduceMotion: "Redu mișcarea",
    reduceMotionCopy: "Preferă tranziții mai calme și mai puțină mișcare.",
    screenReaderHints: "Indicații pentru cititor ecran",
    screenReaderHintsCopy: "Adaugă etichete și indicații pentru tehnologii asistive.",
  },
  Russian: {
    accessibility: "Специальные возможности",
    largerText: "Крупный текст",
    largerTextCopy: "Увеличьте размер текста и сохраните настройку для приложения.",
    highContrast: "Высокая контрастность",
    highContrastCopy: "Усильте границы и контраст текста для удобного просмотра.",
    reduceMotion: "Уменьшить движение",
    reduceMotionCopy: "Использовать более спокойные переходы и меньше движения.",
    screenReaderHints: "Подсказки для экранного диктора",
    screenReaderHintsCopy: "Добавить дополнительные метки и подсказки для вспомогательных технологий.",
  },
  Swedish: {
    accessibility: "Tillgänglighet",
    largerText: "Större text",
    largerTextCopy: "Öka textstorleken och spara inställningen för appen.",
    highContrast: "Hög kontrast",
    highContrastCopy: "Stärk ramar och textkontrast.",
    reduceMotion: "Minska rörelse",
    reduceMotionCopy: "Föredra lugnare övergångar och mindre rörelse.",
    screenReaderHints: "Skärmläsarhintar",
    screenReaderHintsCopy: "Lägg till etiketter och hintar för hjälpmedel.",
  },
  Thai: {
    accessibility: "การช่วยการเข้าถึง",
    largerText: "ข้อความใหญ่ขึ้น",
    largerTextCopy: "เพิ่มขนาดข้อความและบันทึกเป็นค่าของแอป",
    highContrast: "คอนทราสต์สูง",
    highContrastCopy: "เพิ่มความชัดของเส้นขอบและข้อความ",
    reduceMotion: "ลดการเคลื่อนไหว",
    reduceMotionCopy: "ใช้การเปลี่ยนหน้าที่สงบขึ้นและเคลื่อนไหวน้อยลง",
    screenReaderHints: "คำแนะนำสำหรับโปรแกรมอ่านหน้าจอ",
    screenReaderHintsCopy: "เพิ่มป้ายกำกับและคำแนะนำสำหรับเทคโนโลยีช่วยเหลือ",
  },
  Turkish: {
    accessibility: "Erişilebilirlik",
    largerText: "Daha büyük metin",
    largerTextCopy: "Metin boyutunu artır ve uygulama için kaydet.",
    highContrast: "Yüksek kontrast",
    highContrastCopy: "Kenarlıkları ve metin kontrastını güçlendir.",
    reduceMotion: "Hareketi azalt",
    reduceMotionCopy: "Daha sakin geçişler ve daha az hareket kullan.",
    screenReaderHints: "Ekran okuyucu ipuçları",
    screenReaderHintsCopy: "Yardımcı teknolojiler için ek etiketler ve ipuçları ekle.",
  },
  Ukrainian: {
    accessibility: "Доступність",
    largerText: "Більший текст",
    largerTextCopy: "Збільште текст і збережіть налаштування для застосунку.",
    highContrast: "Високий контраст",
    highContrastCopy: "Посильте межі та контраст тексту.",
    reduceMotion: "Зменшити рух",
    reduceMotionCopy: "Надавайте перевагу спокійнішим переходам і меншій кількості руху.",
    screenReaderHints: "Підказки для читача екрана",
    screenReaderHintsCopy: "Додайте мітки та підказки для допоміжних технологій.",
  },
  Vietnamese: {
    accessibility: "Trợ năng",
    largerText: "Chữ lớn hơn",
    largerTextCopy: "Tăng kích thước chữ và lưu tùy chọn cho ứng dụng.",
    highContrast: "Độ tương phản cao",
    highContrastCopy: "Tăng viền và độ tương phản văn bản.",
    reduceMotion: "Giảm chuyển động",
    reduceMotionCopy: "Ưu tiên chuyển cảnh nhẹ hơn và ít chuyển động hơn.",
    screenReaderHints: "Gợi ý trình đọc màn hình",
    screenReaderHintsCopy: "Thêm nhãn và gợi ý cho công nghệ hỗ trợ.",
  },
};

export default function SettingsScreen() {
  const router = useRouter();
  const {
    isNightMode,
    blurProfilePhoto,
    setBlurProfilePhoto,
    largerText,
    setLargerText,
    highContrast,
    setHighContrast,
    reduceMotion,
    setReduceMotion,
    screenReaderHints,
    setScreenReaderHints,
    largerTouchTargets,
    setLargerTouchTargets,
    reduceTransparency,
    setReduceTransparency,
    boldText,
    setBoldText,
    simplifiedInterface,
    setSimplifiedInterface,
    slowerTransitions,
    setSlowerTransitions,
    meetupReminders,
    setMeetupReminders,
    weatherAlerts,
    setWeatherAlerts,
    chatNotifications,
    setChatNotifications,
    quietNotifications,
    setQuietNotifications,
    useApproximateLocation,
    setUseApproximateLocation,
    showDistanceInMeetups,
    setShowDistanceInMeetups,
    allowMessageRequests,
    setAllowMessageRequests,
    safetyCheckIns,
    setSafetyCheckIns,
    appLanguage,
    setAppLanguage,
    translationLanguage,
    setTranslationLanguage,
    appPalette,
    setAppPalette,
    softSurfaces,
    setSoftSurfaces,
    clearBorders,
    setClearBorders,
    resetOnboarding,
  } = useAppSettings();
  const isDay = !isNightMode;
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showFirstNameOnly, setShowFirstNameOnly] = useState(true);
  const [sameAgeGroupsOnly, setSameAgeGroupsOnly] = useState(false);
  const [revealAfterRsvp, setRevealAfterRsvp] = useState(true);
  const [friendsOfFriendsOnly, setFriendsOfFriendsOnly] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<SettingsDropdownName | null>(null);
  const [appLanguageSearch, setAppLanguageSearch] = useState("");
  const [translationLanguageSearch, setTranslationLanguageSearch] = useState("");
  const [appLanguageRegionBase, setAppLanguageRegionBase] = useState<string | null>(null);
  const [translationLanguageRegionBase, setTranslationLanguageRegionBase] = useState<string | null>(null);
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy: SettingsCopy = {
    ...englishCopy,
    ...(settingsSectionTranslations[appLanguageBase] ?? {}),
    ...(settingsTranslations[appLanguageBase] ?? {}),
    ...(supplementalSettingsTranslations[appLanguageBase] ?? {}),
    ...(regionalEnglishSettings[appLanguage] ?? {}),
  };
  const paletteCopy = paletteTranslations[appLanguageBase] ?? {};
  const appearanceOptionCopy = appLanguageBase === "Hebrew"
    ? {
        softSurfaces: "משטחים רכים",
        softSurfacesCopy: "רכך רקעים וגבולות כדי שהמסכים ירגישו רגועים יותר.",
        clearBorders: "גבולות ברורים",
        clearBordersCopy: "חזק את קווי ההפרדה סביב כרטיסים ותפריטים.",
      }
    : {
        softSurfaces: "Soft surfaces",
        softSurfacesCopy: "Soften panels and borders so screens feel calmer.",
        clearBorders: "Clear borders",
        clearBordersCopy: "Strengthen card and menu outlines for clearer separation.",
      };
  const isRtl = rtlLanguages.has(appLanguageBase);
  const paletteAccent = appPalette.swatches[2];
  const contrastTextStyle = highContrast && (isDay ? styles.dayHighContrastText : styles.nightHighContrastText);
  const contrastMutedStyle = highContrast && (isDay ? styles.dayHighContrastMutedText : styles.nightHighContrastMutedText);
  const accessibilityCopy = accessibilityTranslations[appLanguageBase] ?? accessibilityTranslations.English;
  const extraAccessibilityCopy = appLanguageBase === "Hebrew"
    ? {
        largerTouchTargets: "אזורי לחיצה גדולים",
        largerTouchTargetsCopy: "הגדל כפתורים ואזורים לחיצים כדי שיהיה קל יותר ללחוץ בבטחה.",
        reduceTransparency: "פחות שקיפות",
        reduceTransparencyCopy: "השתמש ברקעים אטומים יותר כדי לשפר קריאות.",
        boldText: "טקסט מודגש",
        boldTextCopy: "חזק משקלי טקסט בממשק לסריקה קלה יותר.",
        simplifiedInterface: "ממשק פשוט יותר",
        simplifiedInterfaceCopy: "הפחת פרטים משניים כדי שהמסכים יהיו רגועים יותר.",
        slowerTransitions: "מעברים איטיים יותר",
        slowerTransitionsCopy: "האט שינויי מצב כמו יום ולילה כדי שיהיה יותר זמן להתמצא.",
      }
    : {
        largerTouchTargets: "Larger touch targets",
        largerTouchTargetsCopy: "Make buttons and tap areas larger so they are easier to press confidently.",
        reduceTransparency: "Reduce transparency",
        reduceTransparencyCopy: "Use more solid surfaces to improve readability.",
        boldText: "Bold interface text",
        boldTextCopy: "Strengthen label weights across the interface for easier scanning.",
        simplifiedInterface: "Simplified interface",
        simplifiedInterfaceCopy: "Reduce secondary detail so screens feel calmer and easier to parse.",
        slowerTransitions: "Slower transitions",
        slowerTransitionsCopy: "Slow down mode changes like Day and Night so there is more time to orient.",
      };

  const languageOptions = [
    { label: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
    { label: "Arabic (Egypt)", nativeName: "العربية · مصر", flag: "🇪🇬" },
    { label: "Arabic (Gulf)", nativeName: "العربية · الخليج", flag: "🇦🇪" },
    { label: "Arabic (Levant)", nativeName: "العربية · الشام", flag: "🇯🇴" },
    { label: "Arabic (Maghreb)", nativeName: "العربية · المغرب العربي", flag: "🇲🇦" },
    { label: "Arabic (Modern Standard)", nativeName: "العربية الفصحى", flag: "🇸🇦" },
    { label: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦" },
    { label: "Albanian", nativeName: "Shqip", flag: "🇦🇱" },
    { label: "Armenian", nativeName: "Հայերեն", flag: "🇦🇲" },
    { label: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
    { label: "Chinese", nativeName: "中文", flag: "🇨🇳" },
    { label: "Chinese (Cantonese)", nativeName: "粵語 · 香港", flag: "🇭🇰" },
    { label: "Chinese (Hong Kong)", nativeName: "繁體中文 · 香港", flag: "🇭🇰" },
    { label: "Chinese (Mainland China)", nativeName: "简体中文 · 中国大陆", flag: "🇨🇳" },
    { label: "Chinese (Singapore)", nativeName: "简体中文 · 新加坡", flag: "🇸🇬" },
    { label: "Chinese (Taiwan)", nativeName: "繁體中文 · 台灣", flag: "🇹🇼" },
    { label: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
    { label: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
    { label: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
    { label: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
    { label: "Dutch (BE)", nativeName: "Nederlands · België", flag: "🇧🇪" },
    { label: "English", nativeName: "English", flag: "🇬🇧" },
    { label: "English (AU)", nativeName: "English · Australia", flag: "🇦🇺" },
    { label: "English (CA)", nativeName: "English · Canada", flag: "🇨🇦" },
    { label: "English (HK)", nativeName: "English · Hong Kong", flag: "🇭🇰" },
    { label: "English (IE)", nativeName: "English · Ireland", flag: "🇮🇪" },
    { label: "English (IN)", nativeName: "English · India", flag: "🇮🇳" },
    { label: "English (JM)", nativeName: "English · Jamaica", flag: "🇯🇲" },
    { label: "English (NZ)", nativeName: "English · New Zealand", flag: "🇳🇿" },
    { label: "English (SG)", nativeName: "English · Singapore", flag: "🇸🇬" },
    { label: "English (UK)", nativeName: "English · United Kingdom", flag: "🇬🇧" },
    { label: "English (US)", nativeName: "English · United States", flag: "🇺🇸" },
    { label: "English (ZA)", nativeName: "English · South Africa", flag: "🇿🇦" },
    { label: "Estonian", nativeName: "Eesti", flag: "🇪🇪" },
    { label: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
    { label: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
    { label: "French", nativeName: "Français", flag: "🇫🇷" },
    { label: "French (BE)", nativeName: "Français · Belgique", flag: "🇧🇪" },
    { label: "French (CA)", nativeName: "Français · Canada", flag: "🇨🇦" },
    { label: "French (Central Africa)", nativeName: "Français · Afrique centrale", flag: "🌍" },
    { label: "French (CH)", nativeName: "Français · Suisse", flag: "🇨🇭" },
    { label: "French (FR)", nativeName: "Français · France", flag: "🇫🇷" },
    { label: "French (North Africa)", nativeName: "Français · Afrique du Nord", flag: "🌍" },
    { label: "French (West Africa)", nativeName: "Français · Afrique de l'Ouest", flag: "🌍" },
    { label: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { label: "German (AT)", nativeName: "Deutsch · Österreich", flag: "🇦🇹" },
    { label: "German (BE)", nativeName: "Deutsch · Belgien", flag: "🇧🇪" },
    { label: "German (CH)", nativeName: "Deutsch · Schweiz", flag: "🇨🇭" },
    { label: "German (Germany)", nativeName: "Deutsch · Deutschland", flag: "🇩🇪" },
    { label: "German (LI)", nativeName: "Deutsch · Liechtenstein", flag: "🇱🇮" },
    { label: "German (LU)", nativeName: "Deutsch · Luxemburg", flag: "🇱🇺" },
    { label: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
    { label: "Haitian Creole", nativeName: "Kreyòl ayisyen", flag: "🇭🇹" },
    { label: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
    { label: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { label: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
    { label: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
    { label: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
    { label: "Italian (CH)", nativeName: "Italiano · Svizzera", flag: "🇨🇭" },
    { label: "Latvian", nativeName: "Latviešu", flag: "🇱🇻" },
    { label: "Lithuanian", nativeName: "Lietuvių", flag: "🇱🇹" },
    { label: "Luxembourgish", nativeName: "Lëtzebuergesch", flag: "🇱🇺" },
    { label: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    { label: "Korean", nativeName: "한국어", flag: "🇰🇷" },
    { label: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
    { label: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
    { label: "Persian", nativeName: "فارسی", flag: "🇮🇷" },
    { label: "Polish", nativeName: "Polski", flag: "🇵🇱" },
    { label: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
    { label: "Portuguese (BR)", nativeName: "Português · Brasil", flag: "🇧🇷" },
    { label: "Portuguese (PT)", nativeName: "Português · Portugal", flag: "🇵🇹" },
    { label: "Romanian", nativeName: "Română", flag: "🇷🇴" },
    { label: "Russian", nativeName: "Русский", flag: "🇷🇺" },
    { label: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰" },
    { label: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { label: "Spanish (Spain)", nativeName: "Español · España", flag: "🇪🇸" },
    { label: "Spanish (Latin America)", nativeName: "Español · Latinoamérica", flag: "🌎" },
    { label: "Spanish (Mexico)", nativeName: "Español · México", flag: "🇲🇽" },
    { label: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
    { label: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
    { label: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
    { label: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
    { label: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
    { label: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
    { label: "Yiddish", nativeName: "יידיש", flag: "🌐" },
  ].sort((a, b) => a.label.localeCompare(b.label));
  const getRegionalLanguages = (baseLanguage: string) =>
    languageOptions.filter((language) => language.label !== baseLanguage && getLanguageBase(language.label) === baseLanguage);
  const hasRegionalLanguages = (language: string) => getRegionalLanguages(language).length > 0;
  const filterLanguages = (query: string, regionBase: string | null) => {
    const normalized = query.trim().toLocaleLowerCase();
    const options = regionBase
      ? getRegionalLanguages(regionBase)
      : languageOptions.filter((language) => language.label === getLanguageBase(language.label));

    if (!normalized) return options;
    return options.filter((language) =>
      `${language.label} ${language.nativeName} ${getLanguageBase(language.label)}`.toLocaleLowerCase().includes(normalized)
    );
  };
  const appLanguageOptions = filterLanguages(appLanguageSearch, appLanguageRegionBase);
  const translationLanguageOptions = filterLanguages(translationLanguageSearch, translationLanguageRegionBase);
  const selectExactLanguage = (
    value: string,
    selectLanguage: (language: string) => void,
    setRegionBase: (language: string | null) => void
  ) => {
    const exactMatch = languageOptions.find((language) => {
      const query = value.trim().toLocaleLowerCase();
      return (
        language.label.toLocaleLowerCase() === query ||
        language.nativeName.toLocaleLowerCase() === query ||
        getLanguageBase(language.label).toLocaleLowerCase() === query
      );
    });
    if (exactMatch) {
      if (exactMatch.label === getLanguageBase(exactMatch.label) && hasRegionalLanguages(exactMatch.label)) {
        setRegionBase(exactMatch.label);
        return;
      }

      selectLanguage(exactMatch.label);
    }
  };
  const selectLanguageOption = (
    language: (typeof languageOptions)[number],
    selectLanguage: (language: string) => void,
    setSearch: (value: string) => void,
    setRegionBase: (language: string | null) => void
  ) => {
    if (language.label === getLanguageBase(language.label) && hasRegionalLanguages(language.label)) {
      setRegionBase(language.label);
      setSearch("");
      return;
    }

    selectLanguage(language.label);
    setSearch("");
    setRegionBase(null);
    setOpenDropdown(null);
  };

  const { privacyRows, notificationRows, locationRows, safetyRows, accessibilityRows } = createSettingsToggleSections({
    copy,
    englishCopy,
    accessibilityCopy,
    state: {
      blurProfilePhoto,
      privateProfile,
      showFirstNameOnly,
      sameAgeGroupsOnly,
      revealAfterRsvp,
      friendsOfFriendsOnly,
      meetupReminders,
      weatherAlerts,
      chatNotifications,
      quietNotifications,
      useApproximateLocation,
      showDistanceInMeetups,
      allowMessageRequests,
      safetyCheckIns,
      largerText,
      highContrast,
      reduceMotion,
      screenReaderHints,
    },
    actions: {
      setBlurProfilePhoto,
      setPrivateProfile,
      setShowFirstNameOnly,
      setSameAgeGroupsOnly,
      setRevealAfterRsvp,
      setFriendsOfFriendsOnly,
      setMeetupReminders,
      setWeatherAlerts,
      setChatNotifications,
      setQuietNotifications,
      setUseApproximateLocation,
      setShowDistanceInMeetups,
      setAllowMessageRequests,
      setSafetyCheckIns,
      setLargerText,
      setHighContrast,
      setReduceMotion,
      setScreenReaderHints,
    },
  });
  const extraAccessibilityRows = [
    {
      label: extraAccessibilityCopy.largerTouchTargets,
      copy: extraAccessibilityCopy.largerTouchTargetsCopy,
      value: largerTouchTargets,
      onValueChange: setLargerTouchTargets,
    },
    {
      label: extraAccessibilityCopy.reduceTransparency,
      copy: extraAccessibilityCopy.reduceTransparencyCopy,
      value: reduceTransparency,
      onValueChange: setReduceTransparency,
    },
    {
      label: extraAccessibilityCopy.boldText,
      copy: extraAccessibilityCopy.boldTextCopy,
      value: boldText,
      onValueChange: setBoldText,
    },
    {
      label: extraAccessibilityCopy.simplifiedInterface,
      copy: extraAccessibilityCopy.simplifiedInterfaceCopy,
      value: simplifiedInterface,
      onValueChange: setSimplifiedInterface,
    },
    {
      label: extraAccessibilityCopy.slowerTransitions,
      copy: extraAccessibilityCopy.slowerTransitionsCopy,
      value: slowerTransitions,
      onValueChange: setSlowerTransitions,
    },
  ];
  const allAccessibilityRows = [...accessibilityRows, ...extraAccessibilityRows];

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView
        style={[styles.screen, isDay && styles.dayContainer]}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
      >
        <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={[styles.backButton, isDay && styles.dayIconButton]} accessibilityRole="button" accessibilityLabel="Go back">
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <Text style={[styles.title, largerText && styles.largeTitle, isDay && styles.dayTitle, contrastTextStyle, isRtl && styles.rtlText]}>{copy.title}</Text>
        <Text style={[styles.subtitle, largerText && styles.largeBodyText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>
          {copy.subtitle}
        </Text>

        <View style={[styles.card, isDay && styles.dayCard, highContrast && styles.highContrastCard]}>
          {privacyRows.map((row, index) => (
            <View key={row.label} style={[styles.settingRow, largerText && styles.largeSettingRow, isRtl && styles.rtlRow, index < privacyRows.length - 1 && styles.rowDivider, isDay && index < privacyRows.length - 1 && styles.dayRowDivider, highContrast && index < privacyRows.length - 1 && styles.highContrastDivider]}>
              <View style={styles.settingCopy}>
                <Text style={[styles.label, largerText && styles.largeLabel, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlText]}>{row.label}</Text>
                <Text style={[styles.helperText, largerText && styles.largeHelperText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>{row.copy}</Text>
              </View>
              <Switch
                value={row.value}
                onValueChange={row.onValueChange}
                accessibilityLabel={row.label}
                accessibilityHint={screenReaderHints ? row.copy : undefined}
                trackColor={{ false: isDay ? "#B8C9E6" : nsnColors.border, true: paletteAccent }}
                thumbColor={row.value ? "#FFFFFF" : isDay ? "#F4F9FF" : nsnColors.muted}
              />
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, largerText && styles.largeSectionTitle, isDay && styles.dayTitle, contrastTextStyle, isRtl && styles.rtlText]}>
          {copy.notifications ?? englishCopy.notifications}
        </Text>
        <View style={[styles.card, isDay && styles.dayCard, highContrast && styles.highContrastCard]}>
          {notificationRows.map((row, index) => (
            <View key={row.label} style={[styles.settingRow, largerText && styles.largeSettingRow, isRtl && styles.rtlRow, index < notificationRows.length - 1 && styles.rowDivider, isDay && index < notificationRows.length - 1 && styles.dayRowDivider, highContrast && index < notificationRows.length - 1 && styles.highContrastDivider]}>
              <View style={styles.settingCopy}>
                <Text style={[styles.label, largerText && styles.largeLabel, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlText]}>{row.label}</Text>
                <Text style={[styles.helperText, largerText && styles.largeHelperText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>{row.copy}</Text>
              </View>
              <Switch
                value={row.value}
                onValueChange={row.onValueChange}
                accessibilityLabel={row.label}
                accessibilityHint={screenReaderHints ? row.copy : undefined}
                trackColor={{ false: isDay ? "#B8C9E6" : nsnColors.border, true: paletteAccent }}
                thumbColor={row.value ? "#FFFFFF" : isDay ? "#F4F9FF" : nsnColors.muted}
              />
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, largerText && styles.largeSectionTitle, isDay && styles.dayTitle, contrastTextStyle, isRtl && styles.rtlText]}>
          {copy.locationDiscovery ?? englishCopy.locationDiscovery}
        </Text>
        <View style={[styles.card, isDay && styles.dayCard, highContrast && styles.highContrastCard]}>
          {locationRows.map((row, index) => (
            <View key={row.label} style={[styles.settingRow, largerText && styles.largeSettingRow, isRtl && styles.rtlRow, index < locationRows.length - 1 && styles.rowDivider, isDay && index < locationRows.length - 1 && styles.dayRowDivider, highContrast && index < locationRows.length - 1 && styles.highContrastDivider]}>
              <View style={styles.settingCopy}>
                <Text style={[styles.label, largerText && styles.largeLabel, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlText]}>{row.label}</Text>
                <Text style={[styles.helperText, largerText && styles.largeHelperText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>{row.copy}</Text>
              </View>
              <Switch
                value={row.value}
                onValueChange={row.onValueChange}
                accessibilityLabel={row.label}
                accessibilityHint={screenReaderHints ? row.copy : undefined}
                trackColor={{ false: isDay ? "#B8C9E6" : nsnColors.border, true: paletteAccent }}
                thumbColor={row.value ? "#FFFFFF" : isDay ? "#F4F9FF" : nsnColors.muted}
              />
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, largerText && styles.largeSectionTitle, isDay && styles.dayTitle, contrastTextStyle, isRtl && styles.rtlText]}>
          {copy.safetyContact ?? englishCopy.safetyContact}
        </Text>
        <View style={[styles.card, isDay && styles.dayCard, highContrast && styles.highContrastCard]}>
          {safetyRows.map((row, index) => (
            <View key={row.label} style={[styles.settingRow, largerText && styles.largeSettingRow, isRtl && styles.rtlRow, index < safetyRows.length - 1 && styles.rowDivider, isDay && index < safetyRows.length - 1 && styles.dayRowDivider, highContrast && index < safetyRows.length - 1 && styles.highContrastDivider]}>
              <View style={styles.settingCopy}>
                <Text style={[styles.label, largerText && styles.largeLabel, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlText]}>{row.label}</Text>
                <Text style={[styles.helperText, largerText && styles.largeHelperText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>{row.copy}</Text>
              </View>
              <Switch
                value={row.value}
                onValueChange={row.onValueChange}
                accessibilityLabel={row.label}
                accessibilityHint={screenReaderHints ? row.copy : undefined}
                trackColor={{ false: isDay ? "#B8C9E6" : nsnColors.border, true: paletteAccent }}
                thumbColor={row.value ? "#FFFFFF" : isDay ? "#F4F9FF" : nsnColors.muted}
              />
            </View>
          ))}
          <TouchableOpacity
            activeOpacity={0.78}
            onPress={resetOnboarding}
            accessibilityRole="button"
            accessibilityLabel={copy.restartOnboarding ?? englishCopy.restartOnboarding}
            accessibilityHint={copy.restartOnboardingCopy ?? englishCopy.restartOnboardingCopy}
            style={[styles.actionRow, isRtl && styles.rtlRow, styles.rowDivider, isDay && styles.dayRowDivider, highContrast && styles.highContrastDivider]}
          >
            <View style={styles.settingCopy}>
              <Text style={[styles.label, largerText && styles.largeLabel, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlText]}>
                {copy.restartOnboarding ?? englishCopy.restartOnboarding}
              </Text>
              <Text style={[styles.helperText, largerText && styles.largeHelperText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>
                {copy.restartOnboardingCopy ?? englishCopy.restartOnboardingCopy}
              </Text>
            </View>
            <Text style={[styles.actionText, isDay && styles.dayActionText]}>{copy.restartOnboardingAction ?? englishCopy.restartOnboardingAction}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, largerText && styles.largeSectionTitle, isDay && styles.dayTitle, contrastTextStyle, isRtl && styles.rtlText]}>{accessibilityCopy.accessibility}</Text>
        <View style={[styles.card, isDay && styles.dayCard, highContrast && styles.highContrastCard]}>
          {allAccessibilityRows.map((row, index) => (
            <View key={row.label} style={[styles.settingRow, largerText && styles.largeSettingRow, largerTouchTargets && styles.accessibleSettingRow, isRtl && styles.rtlRow, index < allAccessibilityRows.length - 1 && styles.rowDivider, isDay && index < allAccessibilityRows.length - 1 && styles.dayRowDivider, highContrast && index < allAccessibilityRows.length - 1 && styles.highContrastDivider]}>
              <View style={styles.settingCopy}>
                <Text style={[styles.label, largerText && styles.largeLabel, boldText && styles.boldInterfaceText, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlText]}>{row.label}</Text>
                <Text style={[styles.helperText, largerText && styles.largeHelperText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>{row.copy}</Text>
              </View>
              <Switch
                value={row.value}
                onValueChange={row.onValueChange}
                accessibilityLabel={row.label}
                accessibilityHint={screenReaderHints ? row.copy : undefined}
                trackColor={{ false: isDay ? "#B8C9E6" : nsnColors.border, true: paletteAccent }}
                thumbColor={row.value ? "#FFFFFF" : isDay ? "#F4F9FF" : nsnColors.muted}
              />
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, largerText && styles.largeSectionTitle, isDay && styles.dayTitle, contrastTextStyle, isRtl && styles.rtlText]}>
          {copy.appearance ?? englishCopy.appearance}
        </Text>
        <View style={[styles.card, isDay && styles.dayCard, highContrast && styles.highContrastCard]}>
          {[
            { label: appearanceOptionCopy.softSurfaces, copy: appearanceOptionCopy.softSurfacesCopy, value: softSurfaces, onValueChange: setSoftSurfaces },
            { label: appearanceOptionCopy.clearBorders, copy: appearanceOptionCopy.clearBordersCopy, value: clearBorders, onValueChange: setClearBorders },
          ].map((row) => (
            <View key={row.label} style={[styles.settingRow, isRtl && styles.rtlRow, styles.rowDivider, isDay && styles.dayRowDivider, highContrast && styles.highContrastDivider]}>
              <View style={styles.settingCopy}>
                <Text style={[styles.label, largerText && styles.largeLabel, boldText && styles.boldInterfaceText, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlText]}>{row.label}</Text>
                <Text style={[styles.helperText, largerText && styles.largeHelperText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>{row.copy}</Text>
              </View>
              <Switch
                value={row.value}
                onValueChange={row.onValueChange}
                accessibilityLabel={row.label}
                accessibilityHint={screenReaderHints ? row.copy : undefined}
                trackColor={{ false: isDay ? "#B8C9E6" : nsnColors.border, true: paletteAccent }}
                thumbColor={row.value ? "#FFFFFF" : isDay ? "#F4F9FF" : nsnColors.muted}
              />
            </View>
          ))}
          <View style={[styles.dropdownRow, isRtl && styles.rtlRow]}>
            <View style={styles.settingCopy}>
              <Text style={[styles.label, largerText && styles.largeLabel, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlText]}>
                {copy.colorPalette ?? englishCopy.colorPalette}
              </Text>
              <Text style={[styles.helperText, largerText && styles.largeHelperText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>
                {copy.colorPaletteCopy ?? englishCopy.colorPaletteCopy}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={() => setOpenDropdown(toggleSettingsDropdown(openDropdown, "palette"))}
              accessibilityRole="button"
              accessibilityLabel={copy.colorPalette ?? englishCopy.colorPalette}
              accessibilityHint={screenReaderHints ? copy.colorPaletteCopy ?? englishCopy.colorPaletteCopy : undefined}
              style={[styles.dropdownButton, styles.paletteDropdownButton, isRtl && styles.rtlDropdownButton, isDay && styles.dayDropdownButton, highContrast && styles.highContrastButton]}
            >
              <View style={styles.paletteMiniSwatches}>
                {appPalette.swatches.slice(0, 4).map((swatch) => (
                  <View key={swatch} style={[styles.paletteMiniSwatch, { backgroundColor: swatch }]} />
                ))}
              </View>
              <Text style={[styles.dropdownText, largerText && styles.largeDropdownText, isDay && styles.dayLabel, contrastTextStyle]}>
                {paletteCopy[appPalette.id]?.label ?? appPalette.label}
              </Text>
              <Text style={[styles.dropdownChevron, isDay && styles.daySubtitle]}>⌄</Text>
            </TouchableOpacity>
          </View>

          {openDropdown === "palette" && (
            <ScrollView
              style={[styles.dropdownMenu, styles.paletteMenu, isDay && styles.dayDropdownMenu]}
              contentContainerStyle={styles.paletteMenuContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              {appPalettes.map((palette) => {
                const selected = appPalette.id === palette.id;

                return (
                  <TouchableOpacity
                    key={palette.id}
                    activeOpacity={0.75}
                    onPress={() => setOpenDropdown(selectSettingsPalette(palette, setAppPalette))}
                    style={[styles.dropdownOption, styles.paletteOption, isRtl && styles.rtlRow, isDay && styles.dayDropdownOption]}
                  >
                    <View style={styles.paletteOptionCopy}>
                      <View style={styles.paletteSwatches}>
                        {palette.swatches.map((swatch) => (
                          <View key={swatch} style={[styles.paletteSwatch, { backgroundColor: swatch }]} />
                        ))}
                      </View>
                      <Text style={[styles.dropdownOptionText, isDay && styles.dayLabel, isRtl && styles.rtlText]}>{paletteCopy[palette.id]?.label ?? palette.label}</Text>
                      <Text style={[styles.dropdownNativeText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{paletteCopy[palette.id]?.description ?? palette.description}</Text>
                    </View>
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected, selected && { borderColor: paletteAccent }]}>
                      {selected && <View style={[styles.radioInner, { backgroundColor: paletteAccent }]} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        <Text style={[styles.sectionTitle, largerText && styles.largeSectionTitle, isDay && styles.dayTitle, contrastTextStyle, isRtl && styles.rtlText]}>{copy.translations}</Text>
        <View style={[styles.card, isDay && styles.dayCard, highContrast && styles.highContrastCard]}>
          <View style={[styles.dropdownRow, isRtl && styles.rtlRow, styles.rowDivider, isDay && styles.dayRowDivider]}>
            <View style={styles.settingCopy}>
              <Text style={[styles.label, largerText && styles.largeLabel, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlText]}>{copy.appLanguage}</Text>
              <Text style={[styles.helperText, largerText && styles.largeHelperText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>{copy.appLanguageCopy}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={() => setOpenDropdown(toggleSettingsDropdown(openDropdown, "app"))}
              accessibilityRole="button"
              accessibilityLabel={copy.appLanguage}
              accessibilityHint={screenReaderHints ? copy.appLanguageCopy : undefined}
              style={[styles.dropdownButton, isRtl && styles.rtlDropdownButton, isDay && styles.dayDropdownButton, highContrast && styles.highContrastButton]}
            >
              <Text style={[styles.dropdownText, styles.languageValueText, largerText && styles.largeDropdownText, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlAlignedText]}>
                {languageOptions.find((language) => language.label === appLanguage)?.flag} {appLanguage}
              </Text>
              <Text style={[styles.dropdownChevron, isDay && styles.daySubtitle]}>⌄</Text>
            </TouchableOpacity>
          </View>

          {openDropdown === "app" && (
            <ScrollView
              style={[styles.dropdownMenu, isDay && styles.dayDropdownMenu]}
              contentContainerStyle={styles.dropdownMenuContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              <TextInput
                value={appLanguageSearch}
                onChangeText={(value) => {
                  setAppLanguageSearch(value);
                  selectExactLanguage(value, setAppLanguage, setAppLanguageRegionBase);
                }}
                placeholder={copy.searchLanguage ?? englishCopy.searchLanguage}
                placeholderTextColor={isDay ? "#5F728F" : nsnColors.mutedSoft}
                style={[styles.languageSearchInput, isDay && styles.dayLanguageSearchInput, largerText && styles.largeDropdownText, isRtl && styles.rtlSearchInput]}
                accessibilityLabel={copy.searchLanguage ?? englishCopy.searchLanguage}
              />
              {appLanguageRegionBase && (
                <View style={[styles.languageRegionHeader, isDay && styles.dayDropdownOption, isRtl && styles.rtlRow]}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => {
                      setAppLanguageRegionBase(null);
                      setAppLanguageSearch("");
                    }}
                    style={styles.languageRegionBack}
                  >
                    <Text style={[styles.languageRegionBackText, isDay && styles.dayLabel]}>{isRtl ? "›" : "‹"}</Text>
                  </TouchableOpacity>
                  <View style={styles.languageOptionCopy}>
                    <Text style={[styles.dropdownOptionText, isDay && styles.dayLabel, isRtl && styles.rtlAlignedText]}>{appLanguageRegionBase}</Text>
                    <Text style={[styles.dropdownNativeText, isDay && styles.daySubtitle, isRtl && styles.rtlAlignedText]}>
                      {getRegionalLanguages(appLanguageRegionBase).map((language) => language.nativeName).join(" / ")}
                    </Text>
                  </View>
                </View>
              )}
              {appLanguageOptions.map((language) => {
                const optionIsRtl = rtlLanguages.has(getLanguageBase(language.label));
                const hasRegions = language.label === getLanguageBase(language.label) && hasRegionalLanguages(language.label);

                return (
                  <TouchableOpacity
                    key={language.label}
                    activeOpacity={0.75}
                    onPress={() => selectLanguageOption(language, setAppLanguage, setAppLanguageSearch, setAppLanguageRegionBase)}
                    style={[styles.dropdownOption, isRtl && styles.rtlRow, isDay && styles.dayDropdownOption]}
                  >
                    <View style={styles.languageOptionCopy}>
                      <Text style={[styles.dropdownOptionText, styles.languageLabelText, isDay && styles.dayLabel, isRtl && styles.rtlAlignedText]}>{language.flag} {language.label}</Text>
                      <Text style={[styles.dropdownNativeText, optionIsRtl ? styles.languageNativeRtlText : styles.languageNativeLtrText, isDay && styles.daySubtitle, isRtl && styles.rtlAlignedText]}>
                        {hasRegions ? getRegionalLanguages(language.label).map((option) => option.nativeName).join(" / ") : language.nativeName}
                      </Text>
                    </View>
                    {hasRegions ? (
                      <Text style={[styles.dropdownChevron, isDay && styles.daySubtitle]}>{isRtl ? "‹" : "›"}</Text>
                    ) : (
                      <View style={[styles.radioOuter, appLanguage === language.label && styles.radioOuterSelected, appLanguage === language.label && { borderColor: paletteAccent }]}>
                        {appLanguage === language.label && <View style={[styles.radioInner, { backgroundColor: paletteAccent }]} />}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
              {appLanguageOptions.length === 0 && (
                <Text style={[styles.noResultsText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{copy.noLanguageFound ?? englishCopy.noLanguageFound}</Text>
              )}
            </ScrollView>
          )}

          <View style={[styles.dropdownRow, isRtl && styles.rtlRow]}>
            <View style={styles.settingCopy}>
              <Text style={[styles.label, largerText && styles.largeLabel, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlText]}>{copy.translateMeetupsChats}</Text>
              <Text style={[styles.helperText, largerText && styles.largeHelperText, isDay && styles.daySubtitle, contrastMutedStyle, isRtl && styles.rtlText]}>{copy.translateMeetupsChatsCopy}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={() => setOpenDropdown(toggleSettingsDropdown(openDropdown, "translation"))}
              accessibilityRole="button"
              accessibilityLabel={copy.translateMeetupsChats}
              accessibilityHint={screenReaderHints ? copy.translateMeetupsChatsCopy : undefined}
              style={[styles.dropdownButton, isRtl && styles.rtlDropdownButton, isDay && styles.dayDropdownButton, highContrast && styles.highContrastButton]}
            >
              <Text style={[styles.dropdownText, styles.languageValueText, largerText && styles.largeDropdownText, isDay && styles.dayLabel, contrastTextStyle, isRtl && styles.rtlAlignedText]}>
                {languageOptions.find((language) => language.label === translationLanguage)?.flag} {translationLanguage}
              </Text>
              <Text style={[styles.dropdownChevron, isDay && styles.daySubtitle]}>⌄</Text>
            </TouchableOpacity>
          </View>

          {openDropdown === "translation" && (
            <ScrollView
              style={[styles.dropdownMenu, isDay && styles.dayDropdownMenu]}
              contentContainerStyle={styles.dropdownMenuContent}
              nestedScrollEnabled
              showsVerticalScrollIndicator
            >
              <TextInput
                value={translationLanguageSearch}
                onChangeText={(value) => {
                  setTranslationLanguageSearch(value);
                  selectExactLanguage(value, setTranslationLanguage, setTranslationLanguageRegionBase);
                }}
                placeholder={copy.searchLanguage ?? englishCopy.searchLanguage}
                placeholderTextColor={isDay ? "#5F728F" : nsnColors.mutedSoft}
                style={[styles.languageSearchInput, isDay && styles.dayLanguageSearchInput, largerText && styles.largeDropdownText, isRtl && styles.rtlSearchInput]}
                accessibilityLabel={copy.searchLanguage ?? englishCopy.searchLanguage}
              />
              {translationLanguageRegionBase && (
                <View style={[styles.languageRegionHeader, isDay && styles.dayDropdownOption, isRtl && styles.rtlRow]}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => {
                      setTranslationLanguageRegionBase(null);
                      setTranslationLanguageSearch("");
                    }}
                    style={styles.languageRegionBack}
                  >
                    <Text style={[styles.languageRegionBackText, isDay && styles.dayLabel]}>{isRtl ? "›" : "‹"}</Text>
                  </TouchableOpacity>
                  <View style={styles.languageOptionCopy}>
                    <Text style={[styles.dropdownOptionText, isDay && styles.dayLabel, isRtl && styles.rtlAlignedText]}>{translationLanguageRegionBase}</Text>
                    <Text style={[styles.dropdownNativeText, isDay && styles.daySubtitle, isRtl && styles.rtlAlignedText]}>
                      {getRegionalLanguages(translationLanguageRegionBase).map((language) => language.nativeName).join(" / ")}
                    </Text>
                  </View>
                </View>
              )}
              {translationLanguageOptions.map((language) => {
                const optionIsRtl = rtlLanguages.has(getLanguageBase(language.label));
                const hasRegions = language.label === getLanguageBase(language.label) && hasRegionalLanguages(language.label);

                return (
                  <TouchableOpacity
                    key={language.label}
                    activeOpacity={0.75}
                    onPress={() => selectLanguageOption(language, setTranslationLanguage, setTranslationLanguageSearch, setTranslationLanguageRegionBase)}
                    style={[styles.dropdownOption, isRtl && styles.rtlRow, isDay && styles.dayDropdownOption]}
                  >
                    <View style={styles.languageOptionCopy}>
                      <Text style={[styles.dropdownOptionText, styles.languageLabelText, isDay && styles.dayLabel, isRtl && styles.rtlAlignedText]}>{language.flag} {language.label}</Text>
                      <Text style={[styles.dropdownNativeText, optionIsRtl ? styles.languageNativeRtlText : styles.languageNativeLtrText, isDay && styles.daySubtitle, isRtl && styles.rtlAlignedText]}>
                        {hasRegions ? getRegionalLanguages(language.label).map((option) => option.nativeName).join(" / ") : language.nativeName}
                      </Text>
                    </View>
                    {hasRegions ? (
                      <Text style={[styles.dropdownChevron, isDay && styles.daySubtitle]}>{isRtl ? "‹" : "›"}</Text>
                    ) : (
                      <View style={[styles.radioOuter, translationLanguage === language.label && styles.radioOuterSelected, translationLanguage === language.label && { borderColor: paletteAccent }]}>
                        {translationLanguage === language.label && <View style={[styles.radioInner, { backgroundColor: paletteAccent }]} />}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
              {translationLanguageOptions.length === 0 && (
                <Text style={[styles.noResultsText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{copy.noLanguageFound ?? englishCopy.noLanguageFound}</Text>
              )}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: nsnColors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 36,
  },
  dayContainer: {
    backgroundColor: "#EAF4FF",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: 10,
  },
  dayIconButton: {
    backgroundColor: "#DCEEFF",
  },
  title: {
    color: nsnColors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },
  largeTitle: {
    fontSize: 32,
    lineHeight: 39,
  },
  dayTitle: {
    color: "#0B1220",
  },
  subtitle: {
    color: nsnColors.muted,
    fontSize: 15,
    marginBottom: 20,
  },
  largeBodyText: {
    fontSize: 17,
    lineHeight: 24,
  },
  daySubtitle: {
    color: "#3B4A63",
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: nsnColors.surface,
    overflow: "hidden",
  },
  dayCard: {
    backgroundColor: "#DCEEFF",
    borderColor: "#B8C9E6",
  },
  highContrastCard: {
    borderColor: "#3848FF",
    borderWidth: 2,
  },
  sectionTitle: {
    color: nsnColors.text,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 22,
    marginTop: 22,
    marginBottom: 10,
  },
  largeSectionTitle: {
    fontSize: 19,
    lineHeight: 26,
  },
  settingRow: {
    minHeight: 72,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  actionRow: {
    minHeight: 72,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  actionText: {
    color: "#7786FF",
    fontSize: 13,
    fontWeight: "900",
  },
  dayActionText: {
    color: "#3949DB",
  },
  largeSettingRow: {
    minHeight: 86,
    paddingVertical: 17,
  },
  accessibleSettingRow: {
    minHeight: 88,
    paddingVertical: 18,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: nsnColors.border,
  },
  dayRowDivider: {
    borderBottomColor: "#B8C9E6",
  },
  highContrastDivider: {
    borderBottomColor: "#3848FF",
  },
  settingCopy: {
    flex: 1,
  },
  rtlRow: {
    flexDirection: "row-reverse",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  rtlAlignedText: {
    textAlign: "right",
  },
  dropdownRow: {
    minHeight: 76,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  dropdownButton: {
    minWidth: 116,
    minHeight: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.04)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 13,
  },
  paletteDropdownButton: {
    minWidth: 210,
  },
  paletteMiniSwatches: {
    flexDirection: "row",
    alignItems: "center",
  },
  paletteMiniSwatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: -3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
  },
  rtlDropdownButton: {
    flexDirection: "row-reverse",
  },
  dayDropdownButton: {
    backgroundColor: "#EAF4FF",
    borderColor: "#B8C9E6",
  },
  highContrastButton: {
    borderColor: "#3848FF",
    borderWidth: 2,
  },
  dropdownText: {
    color: nsnColors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  largeDropdownText: {
    fontSize: 15,
  },
  dropdownChevron: {
    color: nsnColors.muted,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 18,
  },
  dropdownMenu: {
    maxHeight: 280,
    marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#314666",
    borderRadius: 14,
    backgroundColor: "#0B1D35",
  },
  dayDropdownMenu: {
    borderColor: "#8EACD6",
    backgroundColor: "#F7FBFF",
  },
  dropdownMenuContent: {
    paddingVertical: 6,
  },
  paletteMenu: {
    maxHeight: 300,
  },
  paletteMenuContent: {
    paddingVertical: 6,
  },
  languageSearchInput: {
    minHeight: 42,
    marginHorizontal: 10,
    marginBottom: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#314666",
    color: nsnColors.text,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: "700",
  },
  rtlSearchInput: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  dayLanguageSearchInput: {
    borderColor: "#8EACD6",
    color: "#0B1220",
    backgroundColor: "#EAF4FF",
  },
  dropdownOption: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(166,177,199,0.14)",
  },
  languageOptionCopy: {
    flex: 1,
  },
  languageRegionHeader: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(166,177,199,0.14)",
  },
  languageRegionBack: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: nsnColors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  languageRegionBackText: {
    color: nsnColors.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 24,
  },
  languageValueText: {
    writingDirection: "ltr",
  },
  languageLabelText: {
    writingDirection: "ltr",
  },
  languageNativeLtrText: {
    writingDirection: "ltr",
  },
  languageNativeRtlText: {
    writingDirection: "rtl",
  },
  paletteOption: {
    alignItems: "center",
    gap: 14,
  },
  paletteOptionCopy: {
    flex: 1,
  },
  paletteSwatches: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 8,
  },
  paletteSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
  },
  dayDropdownOption: {
    borderBottomColor: "#C7D8F0",
  },
  dropdownOptionText: {
    color: nsnColors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  dropdownNativeText: {
    color: nsnColors.muted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: nsnColors.mutedSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: nsnColors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: nsnColors.primary,
  },
  noResultsText: {
    color: nsnColors.muted,
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  label: {
    color: nsnColors.text,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  largeLabel: {
    fontSize: 17,
    lineHeight: 23,
  },
  boldInterfaceText: {
    fontWeight: "900",
  },
  dayLabel: {
    color: "#0B1220",
  },
  dayHighContrastText: {
    color: "#000000",
  },
  dayHighContrastMutedText: {
    color: "#14213D",
  },
  nightHighContrastText: {
    color: "#FFFFFF",
  },
  nightHighContrastMutedText: {
    color: "#E5EDFF",
  },
  helperText: {
    color: nsnColors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  largeHelperText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
