import { ScrollView, View, Text, TextInput, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useState } from "react";

import { appPalettes, getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { nsnColors } from "@/lib/nsn-data";

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
};

const englishCopy: SettingsCopy = {
  title: "Settings & Privacy",
  subtitle: "Choose how you want others to see you.",
  accessibility: "Accessibility",
  largerText: "Larger text",
  largerTextCopy: "Increase text size on this screen and save the preference for the app.",
  highContrast: "High contrast",
  highContrastCopy: "Strengthen borders and text contrast for easier scanning.",
  reduceMotion: "Reduce motion",
  reduceMotionCopy: "Prefer calmer transitions and less decorative movement.",
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
  },
};

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu"]);

const accessibilityTranslations: Record<string, Required<Pick<SettingsCopy, "accessibility" | "largerText" | "largerTextCopy" | "highContrast" | "highContrastCopy" | "reduceMotion" | "reduceMotionCopy" | "screenReaderHints" | "screenReaderHintsCopy">>> = {
  English: {
    accessibility: "Accessibility",
    largerText: "Larger text",
    largerTextCopy: "Increase text size on this screen and save the preference for the app.",
    highContrast: "High contrast",
    highContrastCopy: "Strengthen borders and text contrast for easier scanning.",
    reduceMotion: "Reduce motion",
    reduceMotionCopy: "Prefer calmer transitions and less decorative movement.",
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
  } = useAppSettings();
  const isDay = !isNightMode;
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showFirstNameOnly, setShowFirstNameOnly] = useState(true);
  const [sameAgeGroupsOnly, setSameAgeGroupsOnly] = useState(false);
  const [revealAfterRsvp, setRevealAfterRsvp] = useState(true);
  const [friendsOfFriendsOnly, setFriendsOfFriendsOnly] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"app" | "translation" | "palette" | null>(null);
  const [appLanguageSearch, setAppLanguageSearch] = useState("");
  const [translationLanguageSearch, setTranslationLanguageSearch] = useState("");
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = settingsTranslations[appLanguageBase] ?? englishCopy;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const paletteAccent = appPalette.swatches[2];
  const contrastTextStyle = highContrast && (isDay ? styles.dayHighContrastText : styles.nightHighContrastText);
  const contrastMutedStyle = highContrast && (isDay ? styles.dayHighContrastMutedText : styles.nightHighContrastMutedText);
  const accessibilityCopy = accessibilityTranslations[appLanguageBase] ?? accessibilityTranslations.English;

  const languageOptions = [
    { label: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
    { label: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
    { label: "Chinese", nativeName: "中文", flag: "🇨🇳" },
    { label: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
    { label: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
    { label: "English", nativeName: "English", flag: "🇬🇧" },
    { label: "English (AU)", nativeName: "English · Australia", flag: "🇦🇺" },
    { label: "English (UK)", nativeName: "English · United Kingdom", flag: "🇬🇧" },
    { label: "English (US)", nativeName: "English · United States", flag: "🇺🇸" },
    { label: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
    { label: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
    { label: "French", nativeName: "Français", flag: "🇫🇷" },
    { label: "French (CA)", nativeName: "Français · Canada", flag: "🇨🇦" },
    { label: "French (FR)", nativeName: "Français · France", flag: "🇫🇷" },
    { label: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { label: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
    { label: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
    { label: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { label: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
    { label: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
    { label: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    { label: "Korean", nativeName: "한국어", flag: "🇰🇷" },
    { label: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
    { label: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
    { label: "Persian", nativeName: "فارسی", flag: "🇮🇷" },
    { label: "Polish", nativeName: "Polski", flag: "🇵🇱" },
    { label: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
    { label: "Romanian", nativeName: "Română", flag: "🇷🇴" },
    { label: "Russian", nativeName: "Русский", flag: "🇷🇺" },
    { label: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { label: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
    { label: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
    { label: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
    { label: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
    { label: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
    { label: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  ].sort((a, b) => a.label.localeCompare(b.label));
  const filterLanguages = (query: string) => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return languageOptions;
    return languageOptions.filter((language) =>
      `${language.label} ${language.nativeName} ${getLanguageBase(language.label)}`.toLocaleLowerCase().includes(normalized)
    );
  };
  const appLanguageOptions = filterLanguages(appLanguageSearch);
  const translationLanguageOptions = filterLanguages(translationLanguageSearch);
  const selectExactLanguage = (value: string, selectLanguage: (language: string) => void) => {
    const exactMatch = languageOptions.find((language) => {
      const query = value.trim().toLocaleLowerCase();
      return (
        language.label.toLocaleLowerCase() === query ||
        language.nativeName.toLocaleLowerCase() === query ||
        getLanguageBase(language.label).toLocaleLowerCase() === query
      );
    });
    if (exactMatch) {
      selectLanguage(exactMatch.label);
    }
  };

  const privacyRows = [
    {
      label: copy.blurProfilePhoto,
      copy: copy.blurProfilePhotoCopy,
      value: blurProfilePhoto,
      onValueChange: setBlurProfilePhoto,
    },
    {
      label: copy.privateProfile,
      copy: copy.privateProfileCopy,
      value: privateProfile,
      onValueChange: setPrivateProfile,
    },
    {
      label: copy.showFirstNameOnly,
      copy: copy.showFirstNameOnlyCopy,
      value: showFirstNameOnly,
      onValueChange: setShowFirstNameOnly,
    },
    {
      label: copy.sameAgeGroupsOnly,
      copy: copy.sameAgeGroupsOnlyCopy,
      value: sameAgeGroupsOnly,
      onValueChange: setSameAgeGroupsOnly,
    },
    {
      label: copy.revealAfterRsvp,
      copy: copy.revealAfterRsvpCopy,
      value: revealAfterRsvp,
      onValueChange: setRevealAfterRsvp,
    },
    {
      label: copy.friendsOfFriendsOnly,
      copy: copy.friendsOfFriendsOnlyCopy,
      value: friendsOfFriendsOnly,
      onValueChange: setFriendsOfFriendsOnly,
    },
  ];

  const accessibilityRows = [
    {
      label: accessibilityCopy.largerText,
      copy: accessibilityCopy.largerTextCopy,
      value: largerText,
      onValueChange: setLargerText,
    },
    {
      label: accessibilityCopy.highContrast,
      copy: accessibilityCopy.highContrastCopy,
      value: highContrast,
      onValueChange: setHighContrast,
    },
    {
      label: accessibilityCopy.reduceMotion,
      copy: accessibilityCopy.reduceMotionCopy,
      value: reduceMotion,
      onValueChange: setReduceMotion,
    },
    {
      label: accessibilityCopy.screenReaderHints,
      copy: accessibilityCopy.screenReaderHintsCopy,
      value: screenReaderHints,
      onValueChange: setScreenReaderHints,
    },
  ];

  const notificationRows = [
    {
      label: copy.meetupReminders ?? englishCopy.meetupReminders,
      copy: copy.meetupRemindersCopy ?? englishCopy.meetupRemindersCopy,
      value: meetupReminders,
      onValueChange: setMeetupReminders,
    },
    {
      label: copy.weatherAlerts ?? englishCopy.weatherAlerts,
      copy: copy.weatherAlertsCopy ?? englishCopy.weatherAlertsCopy,
      value: weatherAlerts,
      onValueChange: setWeatherAlerts,
    },
    {
      label: copy.chatNotifications ?? englishCopy.chatNotifications,
      copy: copy.chatNotificationsCopy ?? englishCopy.chatNotificationsCopy,
      value: chatNotifications,
      onValueChange: setChatNotifications,
    },
    {
      label: copy.quietNotifications ?? englishCopy.quietNotifications,
      copy: copy.quietNotificationsCopy ?? englishCopy.quietNotificationsCopy,
      value: quietNotifications,
      onValueChange: setQuietNotifications,
    },
  ];

  const locationRows = [
    {
      label: copy.useApproximateLocation ?? englishCopy.useApproximateLocation,
      copy: copy.useApproximateLocationCopy ?? englishCopy.useApproximateLocationCopy,
      value: useApproximateLocation,
      onValueChange: setUseApproximateLocation,
    },
    {
      label: copy.showDistanceInMeetups ?? englishCopy.showDistanceInMeetups,
      copy: copy.showDistanceInMeetupsCopy ?? englishCopy.showDistanceInMeetupsCopy,
      value: showDistanceInMeetups,
      onValueChange: setShowDistanceInMeetups,
    },
  ];

  const safetyRows = [
    {
      label: copy.allowMessageRequests ?? englishCopy.allowMessageRequests,
      copy: copy.allowMessageRequestsCopy ?? englishCopy.allowMessageRequestsCopy,
      value: allowMessageRequests,
      onValueChange: setAllowMessageRequests,
    },
    {
      label: copy.safetyCheckIns ?? englishCopy.safetyCheckIns,
      copy: copy.safetyCheckInsCopy ?? englishCopy.safetyCheckInsCopy,
      value: safetyCheckIns,
      onValueChange: setSafetyCheckIns,
    },
  ];

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView
        style={[styles.screen, isDay && styles.dayContainer]}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
      >
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
        </View>

        <Text style={[styles.sectionTitle, largerText && styles.largeSectionTitle, isDay && styles.dayTitle, contrastTextStyle, isRtl && styles.rtlText]}>{accessibilityCopy.accessibility}</Text>
        <View style={[styles.card, isDay && styles.dayCard, highContrast && styles.highContrastCard]}>
          {accessibilityRows.map((row, index) => (
            <View key={row.label} style={[styles.settingRow, largerText && styles.largeSettingRow, isRtl && styles.rtlRow, index < accessibilityRows.length - 1 && styles.rowDivider, isDay && index < accessibilityRows.length - 1 && styles.dayRowDivider, highContrast && index < accessibilityRows.length - 1 && styles.highContrastDivider]}>
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
          {copy.appearance ?? englishCopy.appearance}
        </Text>
        <View style={[styles.card, isDay && styles.dayCard, highContrast && styles.highContrastCard]}>
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
              onPress={() => setOpenDropdown(openDropdown === "palette" ? null : "palette")}
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
                {appPalette.label}
              </Text>
              <Text style={[styles.dropdownChevron, isDay && styles.daySubtitle]}>⌄</Text>
            </TouchableOpacity>
          </View>

          {openDropdown === "palette" && (
            <View style={[styles.dropdownMenu, styles.paletteMenu, isDay && styles.dayDropdownMenu]}>
              {appPalettes.map((palette) => {
                const selected = appPalette.id === palette.id;

                return (
                  <TouchableOpacity
                    key={palette.id}
                    activeOpacity={0.75}
                    onPress={() => {
                      setAppPalette(palette);
                      setOpenDropdown(null);
                    }}
                    style={[styles.dropdownOption, styles.paletteOption, isRtl && styles.rtlRow, isDay && styles.dayDropdownOption]}
                  >
                    <View style={styles.paletteOptionCopy}>
                      <View style={styles.paletteSwatches}>
                        {palette.swatches.map((swatch) => (
                          <View key={swatch} style={[styles.paletteSwatch, { backgroundColor: swatch }]} />
                        ))}
                      </View>
                      <Text style={[styles.dropdownOptionText, isDay && styles.dayLabel, isRtl && styles.rtlText]}>{palette.label}</Text>
                      <Text style={[styles.dropdownNativeText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{palette.description}</Text>
                    </View>
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected, selected && { borderColor: paletteAccent }]}>
                      {selected && <View style={[styles.radioInner, { backgroundColor: paletteAccent }]} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
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
              onPress={() => setOpenDropdown(openDropdown === "app" ? null : "app")}
              accessibilityRole="button"
              accessibilityLabel={copy.appLanguage}
              accessibilityHint={screenReaderHints ? copy.appLanguageCopy : undefined}
              style={[styles.dropdownButton, isRtl && styles.rtlDropdownButton, isDay && styles.dayDropdownButton, highContrast && styles.highContrastButton]}
            >
              <Text style={[styles.dropdownText, largerText && styles.largeDropdownText, isDay && styles.dayLabel, contrastTextStyle]}>
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
                  selectExactLanguage(value, setAppLanguage);
                }}
                placeholder="Search language..."
                placeholderTextColor={isDay ? "#5F728F" : nsnColors.mutedSoft}
                style={[styles.languageSearchInput, isDay && styles.dayLanguageSearchInput, largerText && styles.largeDropdownText]}
                accessibilityLabel="Search app language"
              />
              {appLanguageOptions.map((language) => (
                <TouchableOpacity
                  key={language.label}
                  activeOpacity={0.75}
                  onPress={() => {
                    setAppLanguage(language.label);
                    setAppLanguageSearch("");
                    setOpenDropdown(null);
                  }}
                  style={[styles.dropdownOption, isRtl && styles.rtlRow, isDay && styles.dayDropdownOption]}
                >
                  <View>
                    <Text style={[styles.dropdownOptionText, isDay && styles.dayLabel, isRtl && styles.rtlText]}>{language.flag} {language.label}</Text>
                    <Text style={[styles.dropdownNativeText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{language.nativeName}</Text>
                  </View>
                  <View style={[styles.radioOuter, appLanguage === language.label && styles.radioOuterSelected, appLanguage === language.label && { borderColor: paletteAccent }]}>
                    {appLanguage === language.label && <View style={[styles.radioInner, { backgroundColor: paletteAccent }]} />}
                  </View>
                </TouchableOpacity>
              ))}
              {appLanguageOptions.length === 0 && (
                <Text style={[styles.noResultsText, isDay && styles.daySubtitle]}>No language found</Text>
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
              onPress={() => setOpenDropdown(openDropdown === "translation" ? null : "translation")}
              accessibilityRole="button"
              accessibilityLabel={copy.translateMeetupsChats}
              accessibilityHint={screenReaderHints ? copy.translateMeetupsChatsCopy : undefined}
              style={[styles.dropdownButton, isRtl && styles.rtlDropdownButton, isDay && styles.dayDropdownButton, highContrast && styles.highContrastButton]}
            >
              <Text style={[styles.dropdownText, largerText && styles.largeDropdownText, isDay && styles.dayLabel, contrastTextStyle]}>
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
                  selectExactLanguage(value, setTranslationLanguage);
                }}
                placeholder="Search language..."
                placeholderTextColor={isDay ? "#5F728F" : nsnColors.mutedSoft}
                style={[styles.languageSearchInput, isDay && styles.dayLanguageSearchInput, largerText && styles.largeDropdownText]}
                accessibilityLabel="Search translation language"
              />
              {translationLanguageOptions.map((language) => (
                <TouchableOpacity
                  key={language.label}
                  activeOpacity={0.75}
                  onPress={() => {
                    setTranslationLanguage(language.label);
                    setTranslationLanguageSearch("");
                    setOpenDropdown(null);
                  }}
                  style={[styles.dropdownOption, isRtl && styles.rtlRow, isDay && styles.dayDropdownOption]}
                >
                  <View>
                    <Text style={[styles.dropdownOptionText, isDay && styles.dayLabel, isRtl && styles.rtlText]}>{language.flag} {language.label}</Text>
                    <Text style={[styles.dropdownNativeText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{language.nativeName}</Text>
                  </View>
                  <View style={[styles.radioOuter, translationLanguage === language.label && styles.radioOuterSelected, translationLanguage === language.label && { borderColor: paletteAccent }]}>
                    {translationLanguage === language.label && <View style={[styles.radioInner, { backgroundColor: paletteAccent }]} />}
                  </View>
                </TouchableOpacity>
              ))}
              {translationLanguageOptions.length === 0 && (
                <Text style={[styles.noResultsText, isDay && styles.daySubtitle]}>No language found</Text>
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
  largeSettingRow: {
    minHeight: 86,
    paddingVertical: 17,
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
    maxHeight: undefined,
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
