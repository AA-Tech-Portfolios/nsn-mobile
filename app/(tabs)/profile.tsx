import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TextInput, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, Image, Alert, Modal, useWindowDimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  communicationPreferenceOptions,
  getLanguageBase,
  groupSizePreferenceOptions,
  photoRecordingComfortOptions,
  physicalContactComfortOptions,
  socialEnergyOptions,
  type CommunicationPreference,
  type GroupSizePreference,
  type HomeEventLayout,
  type HomeEventVisualMode,
  type HomeHeaderControlsDensity,
  type HomeLayoutDensity,
  type ProfileGender,
  type ProfileShortcutLayout,
  type ProfileWidthPreference,
  type PhotoRecordingComfortPreference,
  type PhysicalContactComfortPreference,
  type SocialEnergyPreference,
  useAppSettings,
} from "@/lib/app-settings";
import { LocalAreaPicker } from "@/components/local-area-picker";
import { ScreenContainer } from "@/components/screen-container";
import { ProfileVisibilityPreview, getBlurRadius, getEffectiveBlurLevel } from "@/components/profile-visibility-preview";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { LocalAreaSuggestion } from "@/lib/location-lookup";
import { nsnColors, profileVibes } from "@/lib/nsn-data";
import {
  defaultFoodBeveragePreferenceIds,
  foodPreferenceGroups,
  getFoodBeverageOptionsByGroup,
  getFoodPreferenceGroupSelectedCount,
  getSelectedFoodPreferenceLabels,
  searchFoodBeveragePreferences,
  type FoodBeveragePreference,
  type FoodPreferenceGroupId,
} from "@/lib/preferences/food-preferences";
import {
  defaultInterestComfortTagsByInterest,
  defaultInterestPreferenceIds,
  getInterestCategorySelectedCount,
  getInterestComfortTagLabels,
  getInterestOptionsByCategory,
  getInterestPreference,
  getInterestPreferenceLabels,
  getSelectedInterestLabels,
  interestCategories,
  interestComfortTags,
  searchInterestPreferences,
  type InterestCategoryId,
  type InterestComfortTagId,
  type InterestPreference,
} from "@/lib/preferences/interests";
import { getProfilePreferenceCopy } from "@/lib/profile-preference-translations";
import { isAllowedDisplayName, nameNotAllowedMessage } from "@/lib/profile-validation";
import { canMeetInPerson, deriveVerificationLevel, getMeetingSafetyCopy, getVerificationLevelLabel, type SoftHelloComfortPreference, verificationLevels } from "@/lib/softhello-mvp";

const rows = [
  { icon: "calendar", key: "meetups", route: "/meetups" },
  { icon: "message", key: "chats", route: "/chats" },
  { icon: "group", key: "events", route: "/events" },
  { icon: "explore", key: "locationPreference", route: "/location-preference" },
  { icon: "transport", key: "transportation", route: "/transportation-preference" },
  { icon: "contact", key: "contactPreference", route: "/contact-preference" },
  { icon: "food", key: "foodPreferences", route: "/food-preferences" },
  { icon: "interests", key: "hobbiesInterests", route: "/hobbies-interests" },
  { icon: "location", key: "places", route: "/saved-places" },
] as const;

const settingsRow = { icon: "settings", key: "settings", route: "/settings" } as const;
type ProfileShortcutRow = (typeof rows)[number] | typeof settingsRow;
type ProfileShortcutKey = ProfileShortcutRow["key"];
type ProfileMenuPanel = "main" | "edit" | "privacy" | "preferences" | "comfortTrust" | "foodBeverage" | "hobbiesInterests" | "display" | "layout" | "width" | "notifications" | "blockReport";
const expandedProfileRows: ProfileShortcutRow[] = [...rows, settingsRow];
const profileShortcutLayoutOptions: ProfileShortcutLayout[] = ["Clean", "Expanded"];
const profileWidthPreferenceOptions: ProfileWidthPreference[] = ["Contained", "Wide"];
const profileHomeLayoutDensityOptions: HomeLayoutDensity[] = ["Compact", "Comfortable", "Spacious"];
const profileHeaderControlsDensityOptions: HomeHeaderControlsDensity[] = ["Compact", "Comfortable", "Spacious"];
const profileEventVisualModeOptions: HomeEventVisualMode[] = ["Emoji/Icon", "Preview image"];
const profileEventLayoutOptions: HomeEventLayout[] = ["List", "Map"];

const comfortOptions: SoftHelloComfortPreference[] = ["Small groups", "Text-first", "Quiet", "Flexible pace", "Indoor backup"];
const profileInterestOptions = [
  "Coffee",
  "Movies",
  "Walks",
  "Dinner",
  "Games",
  "Board games",
  "Reading",
  "Food spots",
  "Live music",
  "Art",
  "Museums",
  "Markets",
  "Beach days",
  "Picnics",
  "Fitness",
  "Photography",
  "Gaming",
  "Pets",
  "Volunteering",
];
const profileInterestEmoji: Record<string, string> = {
  Coffee: "☕",
  Movies: "🎬",
  Walks: "🥾",
  Dinner: "🍽️",
  Games: "🎮",
  "Board games": "🎲",
  Reading: "📚",
  "Food spots": "🍜",
  "Live music": "🎵",
  Art: "🎨",
  Museums: "🏛️",
  Markets: "🧺",
  "Beach days": "🏖️",
  Picnics: "🧺",
  Fitness: "🏃",
  Photography: "📷",
  Gaming: "🎮",
  Pets: "🐾",
  Volunteering: "🤝",
};
const comfortPreferenceEmoji: Record<SoftHelloComfortPreference, string> = {
  "Small groups": "👥",
  "Text-first": "💬",
  Quiet: "🌙",
  "Flexible pace": "🌿",
  "Indoor backup": "🏠",
};
const genderOptions: ProfileGender[] = ["Not specified", "Male", "Female", "Other"];
const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const profileTranslations = {
  English: {
    addPhoto: "Add photo",
    editPhoto: "Edit photo",
    addProfilePhotoLabel: "Add profile photo",
    editProfilePhotoLabel: "Edit profile photo",
    profilePhotoOptionsHint: "Opens profile photo options",
    photoPermissionTitle: "Permission needed",
    profilePhotoPermissionCopy: "Please allow photo access to choose a profile picture.",
    identitySelfiePermissionCopy: "Please allow photo access to add an identity selfie.",
    changePhoto: "Change photo",
    choosePhoto: "Choose photo",
    removePhoto: "Remove photo",
    cancel: "Cancel",
    done: "Done",
    edit: "Edit",
    save: "Save",
    saved: "Saved ✓",
    saveName: "Save name",
    editName: "Edit name",
    saveAbout: "Save about me",
    editAbout: "Edit about me",
    selectOrDeselectHint: "Double tap to select or deselect",
    trustStatus: "Trust status",
    reviewSettings: "Review settings",
    profileMenuHint: "Opens profile shortcuts, layout, width, and settings links.",
    trustStatusHint: "Opens contact, selfie, and ID fields used for trust status.",
    opensSectionHint: "Opens section",
    verificationReviewTitle: "Confirm your details",
    verificationReviewCopy: "Review the profile details used for trust and in-person meetup safety.",
    verificationName: "Name",
    verificationSuburb: "Local area",
    verificationAge: "Age confirmation",
    verificationPhoto: "Profile photo",
    verificationContact: "Contact status",
    verificationTransport: "Arrival method",
    ageConfirmed: "18 or older confirmed",
    ageMissing: "Needs confirmation",
    photoAdded: "Photo added",
    photoMissing: "Can be added later",
    confirmDetails: "Confirm details",
    defaultMemberName: "NSN member",
    notSet: "Not set",
    comfortProfile: "Comfort profile",
    noComfortPreferences: "No comfort preferences set yet.",
    vibeLimitMessage: "Let's keep this calm. What 5 vibes feel most like you?",
    myVibes: "My vibes",
    about: "About me",
    aboutText: "I enjoy meaningful conversations, board games, good coffee and exploring new places around the North Shore.",
    rows: { meetups: "My Meetups", chats: "My Chats", events: "My Events", places: "Saved Places", settings: "Settings & Privacy" },
  },
  Arabic: {
    addPhoto: "إضافة صورة",
    editPhoto: "تعديل الصورة",
    changePhoto: "تغيير الصورة",
    choosePhoto: "اختيار صورة",
    removePhoto: "إزالة الصورة",
    cancel: "إلغاء",
    done: "تم",
    edit: "تعديل",
    save: "حفظ",
    saved: "تم الحفظ ✓",
    trustStatus: "حالة الثقة",
    comfortProfile: "ملف الراحة",
    noComfortPreferences: "لم يتم اختيار تفضيلات راحة بعد.",
    vibeLimitMessage: "لنبقي الأمر هادئاً. ما هي الأجواء الخمسة الأقرب لك؟",
    myVibes: "أجوائي",
    about: "نبذة عني",
    aboutText: "أستمتع بالمحادثات الهادفة، ألعاب الطاولة، القهوة الجيدة واستكشاف أماكن جديدة حول نورث شور.",
    rows: { meetups: "لقاءاتي", chats: "دردشاتي", events: "فعالياتي", places: "الأماكن المحفوظة", settings: "الإعدادات والخصوصية" },
  },
  Hebrew: {
    addPhoto: "הוסף תמונה",
    editPhoto: "ערוך תמונה",
    changePhoto: "החלף תמונה",
    choosePhoto: "בחר תמונה",
    removePhoto: "הסר תמונה",
    cancel: "ביטול",
    done: "סיום",
    edit: "ערוך",
    save: "שמור",
    saved: "נשמר ✓",
    trustStatus: "סטטוס אמון",
    reviewSettings: "סקירת הגדרות",
    verificationReviewTitle: "אישור הפרטים שלך",
    verificationReviewCopy: "סקירת פרטי הפרופיל שמשמשים לאמון ולבטיחות במפגשים פנים אל פנים.",
    verificationName: "שם",
    verificationSuburb: "אזור מקומי",
    verificationAge: "אישור גיל",
    verificationPhoto: "תמונת פרופיל",
    verificationContact: "סטטוס קשר",
    verificationTransport: "דרך הגעה",
    ageConfirmed: "אושר גיל 18 ומעלה",
    ageMissing: "נדרש אישור",
    photoAdded: "נוספה תמונה",
    photoMissing: "אפשר להוסיף אחר כך",
    confirmDetails: "אישור פרטים",
    comfortProfile: "פרופיל נוחות",
    noComfortPreferences: "עדיין לא הוגדרו העדפות נוחות.",
    vibeLimitMessage: "נשמור על זה רגוע. אילו 5 וייבים הכי מרגישים כמוך?",
    myVibes: "הווייבים שלי",
    about: "עליי",
    aboutText: "אני נהנה משיחות משמעותיות, משחקי קופסה, קפה טוב וגילוי מקומות חדשים באזור המקומי.",
    rows: { meetups: "המפגשים שלי", chats: "הצ'אטים שלי", events: "האירועים שלי", places: "מקומות שמורים", settings: "הגדרות ופרטיות" },
  },
  Russian: {
    addPhoto: "Добавить фото",
    editPhoto: "Редактировать фото",
    changePhoto: "Сменить фото",
    choosePhoto: "Выбрать фото",
    removePhoto: "Удалить фото",
    cancel: "Отмена",
    done: "Готово",
    edit: "Изменить",
    save: "Сохранить",
    saved: "Сохранено ✓",
    trustStatus: "Статус доверия",
    comfortProfile: "Профиль комфорта",
    noComfortPreferences: "Предпочтения комфорта пока не выбраны.",
    vibeLimitMessage: "Давайте спокойно: какие 5 вайбов больше всего про вас?",
    myVibes: "Мои вайбы",
    about: "Обо мне",
    aboutText: "Мне нравятся содержательные разговоры, настольные игры, хороший кофе и новые места на North Shore.",
    rows: { meetups: "Мои встречи", chats: "Мои чаты", events: "Мои события", places: "Сохранённые места", settings: "Настройки и приватность" },
  },
  Spanish: {
    addPhoto: "Añadir foto",
    editPhoto: "Editar foto",
    changePhoto: "Cambiar foto",
    choosePhoto: "Elegir foto",
    removePhoto: "Quitar foto",
    cancel: "Cancelar",
    done: "Listo",
    edit: "Editar",
    save: "Guardar",
    saved: "Guardado ✓",
    trustStatus: "Estado de confianza",
    comfortProfile: "Perfil de comodidad",
    noComfortPreferences: "Aún no hay preferencias de comodidad.",
    vibeLimitMessage: "Mantengámoslo tranquilo. ¿Qué 5 vibes se sienten más como tú?",
    myVibes: "Mis vibes",
    about: "Sobre mí",
    aboutText: "Disfruto conversaciones con sentido, juegos de mesa, buen café y explorar lugares nuevos por North Shore.",
    rows: { meetups: "Mis quedadas", chats: "Mis chats", events: "Mis eventos", places: "Lugares guardados", settings: "Configuración y privacidad" },
  },
  Chinese: {
    addPhoto: "添加照片",
    editPhoto: "编辑照片",
    changePhoto: "更换照片",
    choosePhoto: "选择照片",
    removePhoto: "移除照片",
    cancel: "取消",
    done: "完成",
    edit: "编辑",
    save: "保存",
    saved: "已保存 ✓",
    trustStatus: "信任状态",
    comfortProfile: "舒适偏好",
    noComfortPreferences: "还没有设置舒适偏好。",
    vibeLimitMessage: "保持轻松。哪 5 种氛围最像你？",
    myVibes: "我的氛围",
    about: "关于我",
    aboutText: "我喜欢有意义的聊天、桌游、好咖啡，也喜欢探索 North Shore 的新地方。",
    rows: { meetups: "我的聚会", chats: "我的聊天", events: "我的活动", places: "收藏地点", settings: "设置与隐私" },
  },
  French: {
    addPhoto: "Ajouter une photo",
    editPhoto: "Modifier la photo",
    changePhoto: "Changer la photo",
    choosePhoto: "Choisir une photo",
    removePhoto: "Retirer la photo",
    cancel: "Annuler",
    done: "Terminé",
    edit: "Modifier",
    save: "Enregistrer",
    saved: "Enregistré ✓",
    trustStatus: "Statut de confiance",
    comfortProfile: "Profil de confort",
    noComfortPreferences: "Aucune préférence de confort définie pour le moment.",
    vibeLimitMessage: "Gardons ça calme. Quels sont les 5 vibes qui te ressemblent le plus ?",
    myVibes: "Mes vibes",
    about: "À propos de moi",
    aboutText: "J'aime les conversations qui ont du sens, les jeux de société, le bon café et découvrir de nouveaux lieux autour de North Shore.",
    rows: { meetups: "Mes rencontres", chats: "Mes chats", events: "Mes événements", places: "Lieux enregistrés", settings: "Paramètres et confidentialité" },
  },
  German: {
    addPhoto: "Foto hinzufügen",
    editPhoto: "Foto bearbeiten",
    changePhoto: "Foto ändern",
    choosePhoto: "Foto auswählen",
    removePhoto: "Foto entfernen",
    cancel: "Abbrechen",
    done: "Fertig",
    edit: "Bearbeiten",
    save: "Speichern",
    saved: "Gespeichert ✓",
    trustStatus: "Vertrauensstatus",
    comfortProfile: "Komfortprofil",
    noComfortPreferences: "Noch keine Komfortpräferenzen festgelegt.",
    vibeLimitMessage: "Bleiben wir entspannt. Welche 5 Vibes passen am meisten zu dir?",
    myVibes: "Meine Vibes",
    about: "Über mich",
    aboutText: "Ich mag gute Gespräche, Brettspiele, guten Kaffee und neue Orte rund um North Shore.",
    rows: { meetups: "Meine Meetups", chats: "Meine Chats", events: "Meine Events", places: "Gespeicherte Orte", settings: "Einstellungen und Datenschutz" },
  },
  Japanese: {
    addPhoto: "写真を追加",
    editPhoto: "写真を編集",
    changePhoto: "写真を変更",
    choosePhoto: "写真を選択",
    removePhoto: "写真を削除",
    cancel: "キャンセル",
    done: "完了",
    edit: "編集",
    save: "保存",
    saved: "保存済み ✓",
    trustStatus: "信頼ステータス",
    reviewSettings: "設定を確認",
    verificationReviewTitle: "詳細を確認",
    verificationReviewCopy: "信頼と対面ミートアップの安全に使われるプロフィール情報を確認します。",
    verificationName: "名前",
    verificationSuburb: "地域",
    verificationAge: "年齢確認",
    verificationPhoto: "プロフィール写真",
    verificationContact: "連絡先ステータス",
    verificationTransport: "到着方法",
    ageConfirmed: "18歳以上確認済み",
    ageMissing: "確認が必要",
    photoAdded: "写真追加済み",
    photoMissing: "後で追加できます",
    confirmDetails: "詳細を確認",
    comfortProfile: "安心プロフィール",
    noComfortPreferences: "安心の好みはまだ設定されていません。",
    vibeLimitMessage: "落ち着いて選びましょう。あなたらしい雰囲気を5つ選ぶなら？",
    myVibes: "自分の雰囲気",
    about: "自己紹介",
    aboutText: "意味のある会話、ボードゲーム、おいしいコーヒー、North Shore 周辺の新しい場所を楽しむのが好きです。",
    rows: { meetups: "自分のミートアップ", chats: "自分のチャット", events: "自分のイベント", places: "保存した場所", settings: "設定とプライバシー" },
  },
  Korean: {
    addPhoto: "사진 추가",
    editPhoto: "사진 편집",
    changePhoto: "사진 변경",
    choosePhoto: "사진 선택",
    removePhoto: "사진 삭제",
    cancel: "취소",
    done: "완료",
    edit: "편집",
    save: "저장",
    saved: "저장됨 ✓",
    trustStatus: "신뢰 상태",
    reviewSettings: "설정 확인",
    verificationReviewTitle: "정보 확인",
    verificationReviewCopy: "신뢰와 대면 모임 안전에 사용되는 프로필 정보를 확인하세요.",
    verificationName: "이름",
    verificationSuburb: "지역",
    verificationAge: "나이 확인",
    verificationPhoto: "프로필 사진",
    verificationContact: "연락처 상태",
    verificationTransport: "도착 방법",
    ageConfirmed: "만 18세 이상 확인됨",
    ageMissing: "확인 필요",
    photoAdded: "사진 추가됨",
    photoMissing: "나중에 추가 가능",
    confirmDetails: "정보 확인",
    comfortProfile: "편안함 프로필",
    noComfortPreferences: "아직 편안함 선호가 설정되지 않았어요.",
    vibeLimitMessage: "차분하게 골라봐요. 나와 가장 닮은 분위기 5가지는 무엇인가요?",
    myVibes: "나의 분위기",
    about: "내 소개",
    aboutText: "의미 있는 대화, 보드게임, 좋은 커피, North Shore 주변의 새로운 장소 탐색을 좋아해요.",
    rows: { meetups: "내 모임", chats: "내 채팅", events: "내 이벤트", places: "저장한 장소", settings: "설정 및 개인정보" },
  },
  Yiddish: {
    addPhoto: "צולייגן בילד",
    editPhoto: "רעדאגירן בילד",
    changePhoto: "טוישן בילד",
    choosePhoto: "קלייבן בילד",
    removePhoto: "אוועקנעמען בילד",
    cancel: "בטל",
    done: "פארטיק",
    edit: "רעדאגירן",
    save: "היטן",
    saved: "אפגעהיטן ✓",
    trustStatus: "צוטרוי-סטאטוס",
    comfortProfile: "באקוועמקייט-פראפיל",
    noComfortPreferences: "נאך נישט אויסגעקליבן קיין באקוועמקייט-פרעפערענצן.",
    vibeLimitMessage: "לאמיר עס האלטן רואיג. וועלכע 5 שטימונגען שפירן זיך מערסט ווי דו?",
    myVibes: "מיינע שטימונגען",
    about: "וועגן מיר",
    aboutText: "איך האב ליב באדייטפולע שמועסן, ברעט-שפילן, גוטע קאווע און אנטדעקן נייע ערטער ארום North Shore.",
    rows: { meetups: "מיינע מיטאפס", chats: "מיינע שמועסן", events: "מיינע געשעענישן", places: "געהיטענע ערטער", settings: "איינשטעלונגען און פריוואטקייט" },
  },
} as const;

const profileVibeTranslations: Record<string, Record<string, string>> = {
  Hebrew: {
    "🌿 Calm": "🌿 רגוע",
    "💬 Good listener": "💬 מקשיב טוב",
    "🎲 Into games": "🎲 אוהב משחקים",
    "⭐ Thoughtful": "⭐ מתחשב",
    "👥 Small groups": "👥 קבוצות קטנות",
    "☕ Coffee": "☕ קפה",
    "🎬 Movies": "🎬 סרטים",
    "🚶 Walks": "🚶 הליכות",
    "📚 Libraries": "📚 ספריות",
    "🧺 Picnics": "🧺 פיקניקים",
    "🍜 Food spots": "🍜 מקומות אוכל",
    "🎧 Quiet music": "🎧 מוזיקה שקטה",
    "🧠 Deep chats": "🧠 שיחות עומק",
    "🌊 Beach days": "🌊 ימי חוף",
    "🎨 Creative": "🎨 יצירתי",
  },
  Arabic: {
    "🌿 Calm": "🌿 هادئ",
    "💬 Good listener": "💬 مستمع جيد",
    "🎲 Into games": "🎲 يحب الألعاب",
    "⭐ Thoughtful": "⭐ مراعي",
    "👥 Small groups": "👥 مجموعات صغيرة",
    "☕ Coffee": "☕ قهوة",
    "🎬 Movies": "🎬 أفلام",
    "🚶 Walks": "🚶 مشي",
    "📚 Libraries": "📚 مكتبات",
    "🧺 Picnics": "🧺 نزهات",
    "🍜 Food spots": "🍜 أماكن طعام",
    "🎧 Quiet music": "🎧 موسيقى هادئة",
    "🧠 Deep chats": "🧠 أحاديث عميقة",
    "🌊 Beach days": "🌊 أيام الشاطئ",
    "🎨 Creative": "🎨 إبداعي",
  },
  Russian: {
    "🌿 Calm": "🌿 Спокойный",
    "💬 Good listener": "💬 Хорошо слушаю",
    "🎲 Into games": "🎲 Люблю игры",
    "⭐ Thoughtful": "⭐ Внимательный",
    "👥 Small groups": "👥 Малые группы",
    "☕ Coffee": "☕ Кофе",
    "🎬 Movies": "🎬 Кино",
    "🚶 Walks": "🚶 Прогулки",
    "📚 Libraries": "📚 Библиотеки",
    "🧺 Picnics": "🧺 Пикники",
    "🍜 Food spots": "🍜 Еда",
    "🎧 Quiet music": "🎧 Тихая музыка",
    "🧠 Deep chats": "🧠 Глубокие беседы",
    "🌊 Beach days": "🌊 Пляжные дни",
    "🎨 Creative": "🎨 Творческий",
  },
  Spanish: {
    "🌿 Calm": "🌿 Tranquilo",
    "💬 Good listener": "💬 Buen oyente",
    "🎲 Into games": "🎲 Me gustan los juegos",
    "⭐ Thoughtful": "⭐ Considerado",
    "👥 Small groups": "👥 Grupos pequeños",
    "☕ Coffee": "☕ Café",
    "🎬 Movies": "🎬 Películas",
    "🚶 Walks": "🚶 Paseos",
    "📚 Libraries": "📚 Bibliotecas",
    "🧺 Picnics": "🧺 Picnics",
    "🍜 Food spots": "🍜 Lugares para comer",
    "🎧 Quiet music": "🎧 Música tranquila",
    "🧠 Deep chats": "🧠 Charlas profundas",
    "🌊 Beach days": "🌊 Días de playa",
    "🎨 Creative": "🎨 Creativo",
  },
  Chinese: {
    "🌿 Calm": "🌿 平静",
    "💬 Good listener": "💬 善于倾听",
    "🎲 Into games": "🎲 喜欢游戏",
    "⭐ Thoughtful": "⭐ 体贴",
    "👥 Small groups": "👥 小团体",
    "☕ Coffee": "☕ 咖啡",
    "🎬 Movies": "🎬 电影",
    "🚶 Walks": "🚶 散步",
    "📚 Libraries": "📚 图书馆",
    "🧺 Picnics": "🧺 野餐",
    "🍜 Food spots": "🍜 美食地点",
    "🎧 Quiet music": "🎧 安静音乐",
    "🧠 Deep chats": "🧠 深聊",
    "🌊 Beach days": "🌊 海边日",
    "🎨 Creative": "🎨 创意",
  },
  French: {
    "🌿 Calm": "🌿 Calme",
    "💬 Good listener": "💬 Bonne écoute",
    "🎲 Into games": "🎲 Jeux",
    "⭐ Thoughtful": "⭐ Attentionné",
    "👥 Small groups": "👥 Petits groupes",
    "☕ Coffee": "☕ Café",
    "🎬 Movies": "🎬 Films",
    "🚶 Walks": "🚶 Balades",
    "📚 Libraries": "📚 Bibliothèques",
    "🧺 Picnics": "🧺 Pique-niques",
    "🍜 Food spots": "🍜 Bonnes adresses",
    "🎧 Quiet music": "🎧 Musique douce",
    "🧠 Deep chats": "🧠 Conversations profondes",
    "🌊 Beach days": "🌊 Journées plage",
    "🎨 Creative": "🎨 Créatif",
  },
  German: {
    "🌿 Calm": "🌿 Ruhig",
    "💬 Good listener": "💬 Guter Zuhörer",
    "🎲 Into games": "🎲 Spiele",
    "⭐ Thoughtful": "⭐ Aufmerksam",
    "👥 Small groups": "👥 Kleine Gruppen",
    "☕ Coffee": "☕ Kaffee",
    "🎬 Movies": "🎬 Filme",
    "🚶 Walks": "🚶 Spaziergänge",
    "📚 Libraries": "📚 Bibliotheken",
    "🧺 Picnics": "🧺 Picknicks",
    "🍜 Food spots": "🍜 Essensorte",
    "🎧 Quiet music": "🎧 Ruhige Musik",
    "🧠 Deep chats": "🧠 Tiefe Gespräche",
    "🌊 Beach days": "🌊 Strandtage",
    "🎨 Creative": "🎨 Kreativ",
  },
  Japanese: {
    "🌿 Calm": "🌿 落ち着き",
    "💬 Good listener": "💬 聞き上手",
    "🎲 Into games": "🎲 ゲーム好き",
    "⭐ Thoughtful": "⭐ 思いやり",
    "👥 Small groups": "👥 少人数",
    "☕ Coffee": "☕ コーヒー",
    "🎬 Movies": "🎬 映画",
    "🚶 Walks": "🚶 散歩",
    "📚 Libraries": "📚 図書館",
    "🧺 Picnics": "🧺 ピクニック",
    "🍜 Food spots": "🍜 食事スポット",
    "🎧 Quiet music": "🎧 静かな音楽",
    "🧠 Deep chats": "🧠 深い会話",
    "🌊 Beach days": "🌊 ビーチの日",
    "🎨 Creative": "🎨 クリエイティブ",
  },
  Korean: {
    "🌿 Calm": "🌿 차분함",
    "💬 Good listener": "💬 잘 들어줌",
    "🎲 Into games": "🎲 게임 좋아함",
    "⭐ Thoughtful": "⭐ 배려심",
    "👥 Small groups": "👥 소규모",
    "☕ Coffee": "☕ 커피",
    "🎬 Movies": "🎬 영화",
    "🚶 Walks": "🚶 산책",
    "📚 Libraries": "📚 도서관",
    "🧺 Picnics": "🧺 피크닉",
    "🍜 Food spots": "🍜 맛집",
    "🎧 Quiet music": "🎧 조용한 음악",
    "🧠 Deep chats": "🧠 깊은 대화",
    "🌊 Beach days": "🌊 바닷가",
    "🎨 Creative": "🎨 창의적",
  },
  Yiddish: {
    "🌿 Calm": "🌿 רואיג",
    "💬 Good listener": "💬 גוטער צוהערער",
    "🎲 Into games": "🎲 האט ליב שפילן",
    "⭐ Thoughtful": "⭐ באטראכטזאם",
    "👥 Small groups": "👥 קליינע גרופעס",
    "☕ Coffee": "☕ קאווע",
    "🎬 Movies": "🎬 פילמען",
    "🚶 Walks": "🚶 שפאצירן",
    "📚 Libraries": "📚 ביבליאטעקן",
    "🧺 Picnics": "🧺 פיקניקס",
    "🍜 Food spots": "🍜 עסן-ערטער",
    "🎧 Quiet music": "🎧 שטילע מוזיק",
    "🧠 Deep chats": "🧠 טיפע שמועסן",
    "🌊 Beach days": "🌊 ברעג-טעג",
    "🎨 Creative": "🎨 שעפעריש",
  },
};

const comfortPreferenceTranslations: Record<string, Record<SoftHelloComfortPreference, string>> = {
  Arabic: {
    "Small groups": "مجموعات صغيرة",
    "Text-first": "النص أولاً",
    Quiet: "هادئ",
    "Flexible pace": "وتيرة مرنة",
    "Indoor backup": "خطة داخلية بديلة",
  },
  Chinese: {
    "Small groups": "小团体",
    "Text-first": "先文字聊天",
    Quiet: "安静",
    "Flexible pace": "灵活节奏",
    "Indoor backup": "室内备用方案",
  },
  French: {
    "Small groups": "Petits groupes",
    "Text-first": "Texte d'abord",
    Quiet: "Calme",
    "Flexible pace": "Rythme flexible",
    "Indoor backup": "Plan intérieur",
  },
  German: {
    "Small groups": "Kleine Gruppen",
    "Text-first": "Erst schreiben",
    Quiet: "Ruhig",
    "Flexible pace": "Flexibles Tempo",
    "Indoor backup": "Drinnen als Backup",
  },
  Hebrew: {
    "Small groups": "קבוצות קטנות",
    "Text-first": "קודם טקסט",
    Quiet: "שקט",
    "Flexible pace": "קצב גמיש",
    "Indoor backup": "חלופה בפנים",
  },
  Japanese: {
    "Small groups": "少人数",
    "Text-first": "まずテキスト",
    Quiet: "静か",
    "Flexible pace": "柔軟なペース",
    "Indoor backup": "屋内の代替案",
  },
  Korean: {
    "Small groups": "소규모",
    "Text-first": "문자 먼저",
    Quiet: "조용함",
    "Flexible pace": "유연한 속도",
    "Indoor backup": "실내 대안",
  },
  Russian: {
    "Small groups": "Малые группы",
    "Text-first": "Сначала текст",
    Quiet: "Тихо",
    "Flexible pace": "Гибкий темп",
    "Indoor backup": "Запасной вариант в помещении",
  },
  Spanish: {
    "Small groups": "Grupos pequeños",
    "Text-first": "Primero texto",
    Quiet: "Tranquilo",
    "Flexible pace": "Ritmo flexible",
    "Indoor backup": "Plan interior",
  },
  Yiddish: {
    "Small groups": "קליינע גרופעס",
    "Text-first": "ערשט טעקסט",
    Quiet: "שטיל",
    "Flexible pace": "פלעקסיבלער ריטעם",
    "Indoor backup": "אינעווייניק אלס רעזערוו",
  },
};

const visibilityModeTranslations = {
  English: {
    title: "Profile visibility",
    comfortMode: "Comfort Mode",
    openMode: "Open Mode",
    comfortCopy: "Your photo stays blurred until you choose to open up.",
    openCopy: "Your photo is visible from the start.",
  },
  Arabic: {
    title: "ظهور الملف الشخصي",
    comfortMode: "وضع الراحة",
    openMode: "الوضع المفتوح",
    comfortCopy: "تبقى صورتك ضبابية حتى تختار أن تظهرها.",
    openCopy: "تظهر صورتك بوضوح من البداية.",
  },
  Hebrew: {
    title: "נראות הפרופיל",
    comfortMode: "מצב נוחות",
    openMode: "מצב פתוח",
    comfortCopy: "התמונה שלך נשארת מטושטשת עד שתבחר לפתוח.",
    openCopy: "התמונה שלך גלויה מההתחלה.",
  },
  Chinese: {
    title: "资料可见性",
    comfortMode: "舒适模式",
    openMode: "开放模式",
    comfortCopy: "你的照片会保持模糊，直到你选择公开。",
    openCopy: "你的照片从一开始就会显示。",
  },
  Japanese: {
    title: "プロフィールの表示",
    comfortMode: "コンフォートモード",
    openMode: "オープンモード",
    comfortCopy: "自分で公開するまで、写真はぼかされたままです。",
    openCopy: "写真は最初から表示されます。",
  },
  Korean: {
    title: "프로필 공개",
    comfortMode: "컴포트 모드",
    openMode: "오픈 모드",
    comfortCopy: "직접 공개하기 전까지 사진은 흐리게 유지돼요.",
    openCopy: "사진이 처음부터 표시돼요.",
  },
  Russian: {
    title: "Видимость профиля",
    comfortMode: "Комфортный режим",
    openMode: "Открытый режим",
    comfortCopy: "Фото остаётся размытым, пока вы не решите открыться.",
    openCopy: "Фото видно сразу.",
  },
  Spanish: {
    title: "Visibilidad del perfil",
    comfortMode: "Modo comodidad",
    openMode: "Modo abierto",
    comfortCopy: "Tu foto permanece difuminada hasta que decidas abrirte.",
    openCopy: "Tu foto se muestra claramente desde el inicio.",
  },
} as const;

const locationPreferenceRowTranslations = {
  English: "Location Preference",
  Arabic: "تفضيل الموقع",
  Hebrew: "העדפת מיקום",
  Russian: "Предпочтение локации",
  Spanish: "Preferencia de ubicación",
  Chinese: "位置偏好",
  French: "Préférence de lieu",
  German: "Standortpräferenz",
  Japanese: "場所の希望",
  Korean: "위치 선호",
  Yiddish: "ארט-פרעפערענץ",
} as const;

const transportationRowTranslations = {
  English: "Transportation Method",
  Arabic: "طريقة الوصول",
  Hebrew: "דרך הגעה",
  Russian: "Способ прибытия",
  Spanish: "Método de transporte",
  Chinese: "交通方式",
  French: "Mode de transport",
  German: "Anreiseart",
  Japanese: "移動手段",
  Korean: "이동 방법",
  Yiddish: "טראנספארט-אופֿן",
} as const;

const foodPreferencesRowTranslations = {
  English: "Food Preferences",
  Arabic: "تفضيلات الطعام",
  Hebrew: "העדפות אוכל",
  Russian: "Еда",
  Spanish: "Comida",
  Chinese: "饮食偏好",
  French: "Repas",
  German: "Essen",
  Japanese: "食事",
  Korean: "음식 선호",
  Yiddish: "עסן",
} as const;

const hobbiesInterestsRowTranslations = {
  English: "Hobbies & Interests",
  Arabic: "الهوايات والاهتمامات",
  Hebrew: "תחביבים ותחומי עניין",
  Russian: "Хобби и интересы",
  Spanish: "Hobbies e intereses",
  Chinese: "爱好与兴趣",
  French: "Loisirs et centres d'intérêt",
  German: "Hobbys und Interessen",
  Japanese: "趣味と興味",
  Korean: "취미와 관심사",
  Yiddish: "האביס און אינטערעסן",
} as const;

const profileMenuTranslations = {
  English: {
    menuTitle: "Profile shortcuts",
    layoutTitle: "Profile layout",
    clean: "Clean profile",
    cleanCopy: "Move shortcuts into this menu.",
    expanded: "Full profile",
    expandedCopy: "Show shortcuts as rows.",
    widthTitle: "Screen width",
    contained: "Contained",
    containedCopy: "Keep profile sections comfortably centered.",
    wide: "Wide screen",
    wideCopy: "Stretch profile sections across the screen.",
  },
  Chinese: {
    menuTitle: "资料快捷入口",
    layoutTitle: "资料布局",
    clean: "简洁资料",
    cleanCopy: "把快捷入口移到这个菜单里。",
    expanded: "完整资料",
    expandedCopy: "把快捷入口显示为列表行。",
    widthTitle: "屏幕宽度",
    contained: "居中显示",
    containedCopy: "让资料区域舒适地居中显示。",
    wide: "宽屏显示",
    wideCopy: "让资料区域横向铺开。",
  },
  Hebrew: {
    menuTitle: "קיצורי פרופיל",
    layoutTitle: "תצוגת פרופיל",
    clean: "פרופיל נקי",
    cleanCopy: "להעביר קיצורים לתפריט הזה.",
    expanded: "פרופיל מלא",
    expandedCopy: "להציג קיצורים כשורות.",
    widthTitle: "רוחב מסך",
    contained: "מרוכז",
    containedCopy: "להשאיר את אזורי הפרופיל ממורכזים בנוחות.",
    wide: "מסך רחב",
    wideCopy: "למתוח את אזורי הפרופיל לרוחב המסך.",
  },
  Japanese: {
    menuTitle: "プロフィールショートカット",
    layoutTitle: "プロフィールレイアウト",
    clean: "シンプルプロフィール",
    cleanCopy: "ショートカットをこのメニューに移動します。",
    expanded: "フルプロフィール",
    expandedCopy: "ショートカットを行として表示します。",
    widthTitle: "画面幅",
    contained: "中央寄せ",
    containedCopy: "プロフィールセクションを見やすく中央に配置します。",
    wide: "ワイド画面",
    wideCopy: "プロフィールセクションを画面幅いっぱいに広げます。",
  },
  Korean: {
    menuTitle: "프로필 바로가기",
    layoutTitle: "프로필 레이아웃",
    clean: "깔끔한 프로필",
    cleanCopy: "바로가기를 이 메뉴로 이동합니다.",
    expanded: "전체 프로필",
    expandedCopy: "바로가기를 행으로 표시합니다.",
    widthTitle: "화면 너비",
    contained: "가운데 정렬",
    containedCopy: "프로필 섹션을 편안하게 가운데에 둡니다.",
    wide: "넓은 화면",
    wideCopy: "프로필 섹션을 화면 전체로 넓힙니다.",
  },
} as const;

const profileVerificationTranslations = {
  English: {
    reviewSettings: "Review settings",
    title: "Confirm your details",
    copy: "Review the profile details used for trust and in-person meetup safety.",
    name: "Name",
    suburb: "Local area",
    age: "Age confirmation",
    photo: "Profile photo",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    phone: "Phone number",
    phonePlaceholder: "+61 400 000 000",
    selfie: "Facial recognition selfie",
    selfieMissing: "Needs selfie",
    selfieAdded: "Selfie added",
    addSelfie: "Add selfie",
    selfieHint: "Adds or replaces the selfie used for identity verification.",
    idDocument: "Government ID",
    idMissing: "Needs ID check",
    idProvided: "ID provided",
    idDocumentHint: "Toggles whether a government ID has been provided.",
    contact: "Current trust status",
    transport: "Arrival method",
    ageConfirmed: "18 or older confirmed",
    ageMissing: "Needs confirmation",
    photoAdded: "Photo added",
    photoMissing: "Can be added later",
    confirmDetails: "Save trust settings",
    confirmDetailsHint: "Saves trust settings and updates your current verification status.",
  },
  Chinese: {
    reviewSettings: "检查设置",
    title: "确认你的资料",
    copy: "检查用于信任状态和线下聚会安全的资料。",
    name: "姓名",
    suburb: "本地区域",
    age: "年龄确认",
    photo: "资料照片",
    email: "邮箱地址",
    emailPlaceholder: "you@example.com",
    phone: "电话号码",
    phonePlaceholder: "+61 400 000 000",
    selfie: "人脸识别自拍",
    selfieMissing: "需要自拍",
    selfieAdded: "已添加自拍",
    addSelfie: "添加自拍",
    selfieHint: "添加或替换用于身份验证的自拍。",
    idDocument: "政府身份证件",
    idMissing: "需要证件检查",
    idProvided: "已提供证件",
    idDocumentHint: "切换是否已提供政府身份证件。",
    contact: "当前信任状态",
    transport: "到达方式",
    ageConfirmed: "已确认年满 18 岁",
    ageMissing: "需要确认",
    photoAdded: "已添加照片",
    photoMissing: "可以稍后添加",
    confirmDetails: "保存信任设置",
    confirmDetailsHint: "保存信任设置并更新你当前的验证状态。",
  },
  Japanese: {
    reviewSettings: "設定を確認",
    title: "詳細を確認",
    copy: "信頼ステータスと対面ミートアップの安全に使われるプロフィール情報を確認します。",
    name: "名前",
    suburb: "地域",
    age: "年齢確認",
    photo: "プロフィール写真",
    email: "メールアドレス",
    emailPlaceholder: "you@example.com",
    phone: "電話番号",
    phonePlaceholder: "+61 400 000 000",
    selfie: "顔認証用セルフィー",
    selfieMissing: "セルフィーが必要",
    selfieAdded: "セルフィー追加済み",
    addSelfie: "セルフィーを追加",
    selfieHint: "本人確認に使うセルフィーを追加または置き換えます。",
    idDocument: "政府発行ID",
    idMissing: "ID確認が必要",
    idProvided: "ID提供済み",
    idDocumentHint: "政府発行IDが提供済みかどうかを切り替えます。",
    contact: "現在の信頼ステータス",
    transport: "到着方法",
    ageConfirmed: "18歳以上確認済み",
    ageMissing: "確認が必要",
    photoAdded: "写真追加済み",
    photoMissing: "後で追加できます",
    confirmDetails: "信頼設定を保存",
    confirmDetailsHint: "信頼設定を保存し、現在の確認ステータスを更新します。",
  },
  Korean: {
    reviewSettings: "설정 확인",
    title: "정보 확인",
    copy: "신뢰 상태와 대면 모임 안전에 사용되는 프로필 정보를 확인하세요.",
    name: "이름",
    suburb: "지역",
    age: "나이 확인",
    photo: "프로필 사진",
    email: "이메일 주소",
    emailPlaceholder: "you@example.com",
    phone: "전화번호",
    phonePlaceholder: "+61 400 000 000",
    selfie: "얼굴 인식 셀피",
    selfieMissing: "셀피 필요",
    selfieAdded: "셀피 추가됨",
    addSelfie: "셀피 추가",
    selfieHint: "신원 확인에 사용할 셀피를 추가하거나 교체합니다.",
    idDocument: "정부 발급 신분증",
    idMissing: "신분증 확인 필요",
    idProvided: "신분증 제공됨",
    idDocumentHint: "정부 발급 신분증 제공 여부를 전환합니다.",
    contact: "현재 신뢰 상태",
    transport: "도착 방법",
    ageConfirmed: "만 18세 이상 확인됨",
    ageMissing: "확인 필요",
    photoAdded: "사진 추가됨",
    photoMissing: "나중에 추가 가능",
    confirmDetails: "신뢰 설정 저장",
    confirmDetailsHint: "신뢰 설정을 저장하고 현재 인증 상태를 업데이트합니다.",
  },
  Hebrew: {
    reviewSettings: "סקירת הגדרות",
    title: "אישור הפרטים שלך",
    copy: "סקירת פרטי הפרופיל שמשמשים לאמון ולבטיחות במפגשים פנים אל פנים.",
    name: "שם",
    suburb: "אזור מקומי",
    age: "אישור גיל",
    photo: "תמונת פרופיל",
    email: "כתובת אימייל",
    emailPlaceholder: "you@example.com",
    phone: "מספר טלפון",
    phonePlaceholder: "+61 400 000 000",
    selfie: "סלפי לזיהוי פנים",
    selfieMissing: "נדרש סלפי",
    selfieAdded: "נוסף סלפי",
    addSelfie: "הוספת סלפי",
    idDocument: "תעודה ממשלתית",
    idMissing: "נדרש אימות תעודה",
    idProvided: "סופקה תעודה",
    contact: "סטטוס אמון נוכחי",
    transport: "דרך הגעה",
    ageConfirmed: "אושר גיל 18 ומעלה",
    ageMissing: "נדרש אישור",
    photoAdded: "נוספה תמונה",
    photoMissing: "אפשר להוסיף אחר כך",
    confirmDetails: "שמירת הגדרות אמון",
  },
} as const;

export default function ProfileScreen() {
  const router = useRouter();
  const { menu } = useLocalSearchParams<{ menu?: string }>();
  const { width } = useWindowDimensions();
  const {
    ageConfirmed,
    age,
    accountPaused,
    isNightMode,
    blurProfilePhoto,
    blurLevel,
    warmUpLowerBlur,
    comfortMode,
    privateProfile,
    showSuburbArea,
    showInterests,
    showComfortPreferences,
    minimalProfileView,
    appLanguage,
    displayName,
    setDisplayName,
    middleName,
    lastName,
    gender,
    middleNameDisplay,
    lastNameDisplay,
    showMiddleName,
    showLastName,
    showAge,
    showPreferredAgeRange,
    showGender,
    profilePhotoUri,
    setProfilePhotoUri,
    contactEmail,
    contactPhone,
    identitySelfieUri,
    setIdentitySelfieUri,
    hasIdentityDocument,
    comfortPreferences,
    contactPreferences,
    socialEnergyPreference,
    communicationPreferences,
    groupSizePreference,
    photoRecordingComfortPreferences,
    physicalContactComfortPreferences,
    verifiedButPrivate,
    verificationLevel,
    profileShortcutLayout,
    profileWidthPreference,
    homeEventLayout,
    homeLayoutDensity,
    homeHeaderControlsDensity,
    homeEventVisualMode,
    dateFormatPreference,
    showWeekday,
    timeFormatPreference,
    clockDisplayStyle,
    showDigitalTimeWithAnalog,
    temperatureUnitPreference,
    dayNightModePreference,
    cardOutlineStyle,
    screenReaderHints,
    softSurfaces,
    clearBorders,
    brandTheme,
    saveSoftHelloMvpState,
    preferredAgeMin,
    preferredAgeMax,
    suburb,
    timezone,
    hobbiesInterests,
    transportationMethod,
    foodBeveragePreferenceIds,
    interestPreferenceIds,
    interestComfortTagsByInterest,
  } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const isDay = !isNightMode;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const copy = profileTranslations[appLanguageBase as keyof typeof profileTranslations] ?? profileTranslations.English;
  const profileCopy = { ...profileTranslations.English, ...copy, rows: { ...profileTranslations.English.rows, ...copy.rows } };
  const vibeCopy = profileVibeTranslations[appLanguageBase] ?? {};
  const comfortCopy = comfortPreferenceTranslations[appLanguageBase] ?? {};
  const visibilityCopy = visibilityModeTranslations[appLanguageBase as keyof typeof visibilityModeTranslations] ?? visibilityModeTranslations.English;
  const profileMenuCopy = profileMenuTranslations[appLanguageBase as keyof typeof profileMenuTranslations] ?? profileMenuTranslations.English;
  const profileVerificationCopy = profileVerificationTranslations[appLanguageBase as keyof typeof profileVerificationTranslations] ?? profileVerificationTranslations.English;
  const profileVerificationA11yCopy = { ...profileVerificationTranslations.English, ...profileVerificationCopy };
  const profilePreferenceCopy = getProfilePreferenceCopy(appLanguageBase);
  const visibilityModeCopy =
    comfortMode === "Comfort Mode"
      ? "Profiles are blurred, with matched or shared visibility only."
      : comfortMode === "Warm Up Mode"
        ? "Profiles are partly visible and reveal more when both people feel comfortable."
        : "People in the event can see basic profile details.";
  const effectiveVerificationLevel = deriveVerificationLevel({ contactEmail, contactPhone, identitySelfieUri, hasIdentityDocument });
  const getComfortLabel = (preference: SoftHelloComfortPreference) => comfortCopy[preference] ?? preference;
  const comfortSummary = comfortPreferences.length ? comfortPreferences.map(getComfortLabel).join(" · ") : copy.noComfortPreferences;
  const getRowLabel = (key: ProfileShortcutKey) => {
    if (key === "locationPreference") return profilePreferenceCopy.rows.locationPreference;
    if (key === "transportation") return profilePreferenceCopy.rows.transportation;
    if (key === "contactPreference") return profilePreferenceCopy.rows.contactPreference ?? "Contact Preference";
    if (key === "foodPreferences") return profilePreferenceCopy.rows.foodPreferences;
    if (key === "hobbiesInterests") return profilePreferenceCopy.rows.hobbiesInterests;

    return copy.rows[key];
  };
  const isCleanProfile = profileShortcutLayout === "Clean";
  const isWideProfile = profileWidthPreference === "Wide";
  const isSoftHelloTheme = brandTheme.id === "softhello";
  const isWideLayout = width >= 880;
  const isDesktopUserOptions = width >= 760;
  const shouldOpenFullPreferenceView = Platform.OS === "web" && width >= 900;
  const profileSectionMaxWidth = isWideProfile ? "100%" : 980;
  const profileTopCardMaxWidth = isWideProfile && isWideLayout ? 620 : isWideLayout ? 480 : brandTheme.layout.cardMaxWidth;

  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(displayName);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [draftMiddleName, setDraftMiddleName] = useState(middleName);
  const [draftLastName, setDraftLastName] = useState(lastName);
  const [showLastNameSaved, setShowLastNameSaved] = useState(false);
  const [isEditingAge, setIsEditingAge] = useState(false);
  const [draftAge, setDraftAge] = useState(age ? String(age) : "");
  const [draftPreferredAgeMin, setDraftPreferredAgeMin] = useState(String(preferredAgeMin));
  const [draftPreferredAgeMax, setDraftPreferredAgeMax] = useState(String(preferredAgeMax));
  const [draftGender, setDraftGender] = useState<ProfileGender>(gender);
  const [showAgeSaved, setShowAgeSaved] = useState(false);
  const [nameError, setNameError] = useState("");
  const [showNameSaved, setShowNameSaved] = useState(false);

  const [selectedVibes, setSelectedVibes] = useState(profileVibes.slice(0, 5));
  const [isEditingVibes, setIsEditingVibes] = useState(false);
  const [vibeLimitMessage, setVibeLimitMessage] = useState("");
  const [showVibesSaved, setShowVibesSaved] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [showInterestsSaved, setShowInterestsSaved] = useState(false);
  const [draftComfortPreferences, setDraftComfortPreferences] = useState<SoftHelloComfortPreference[]>(comfortPreferences);
  const [isEditingComfort, setIsEditingComfort] = useState(false);
  const [showComfortSaved, setShowComfortSaved] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profileMenuPanel, setProfileMenuPanel] = useState<ProfileMenuPanel>("main");
  const [foodPreferenceSearch, setFoodPreferenceSearch] = useState("");
  const [openFoodPreferenceGroups, setOpenFoodPreferenceGroups] = useState<FoodPreferenceGroupId[]>(
    foodPreferenceGroups.filter((group) => group.defaultOpen).map((group) => group.id)
  );
  const [showAllFoodPreferenceGroups, setShowAllFoodPreferenceGroups] = useState<FoodPreferenceGroupId[]>([]);
  const [interestPreferenceSearch, setInterestPreferenceSearch] = useState("");
  const [openInterestCategories, setOpenInterestCategories] = useState<InterestCategoryId[]>(
    interestCategories.filter((category) => category.defaultOpen).map((category) => category.id)
  );
  const [showAllInterestCategories, setShowAllInterestCategories] = useState<InterestCategoryId[]>([]);
  const [activeInterestComfortId, setActiveInterestComfortId] = useState<string | null>(null);
  const [isVerificationReviewOpen, setIsVerificationReviewOpen] = useState(false);
  const [draftContactEmail, setDraftContactEmail] = useState(contactEmail);
  const [draftContactPhone, setDraftContactPhone] = useState(contactPhone);
  const [draftIdentitySelfieUri, setDraftIdentitySelfieUri] = useState<string | null>(identitySelfieUri);
  const [draftHasIdentityDocument, setDraftHasIdentityDocument] = useState(hasIdentityDocument);

  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const [aboutMe, setAboutMe] = useState<string>(copy.aboutText);
  const [aboutLanguageBase, setAboutLanguageBase] = useState(appLanguageBase);

  const [showSaved, setShowSaved] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [showAboutInPreview, setShowAboutInPreview] = useState(comfortMode === "Open Mode");
  const [showVibesInPreview, setShowVibesInPreview] = useState(comfortMode !== "Comfort Mode");
  const [isEditingSuburb, setIsEditingSuburb] = useState(false);
  const [draftSuburb, setDraftSuburb] = useState(suburb);
  const [showSuburbSaved, setShowSuburbSaved] = useState(false);
  const profileMenuButtonRef = useRef<any>(null);
  const profileDrawerCloseRef = useRef<any>(null);

  const closeProfileMenu = useCallback(() => {
    setShowProfileMenu(false);
    setProfileMenuPanel("main");

    if (Platform.OS === "web") {
      setTimeout(() => profileMenuButtonRef.current?.focus?.(), 0);
    }
  }, []);

  const openProfileOptionsPanel = useCallback((panel: ProfileMenuPanel = "main") => {
    setShowPhotoMenu(false);
    setIsVerificationReviewOpen(false);
    setProfileMenuPanel(panel);
    setShowProfileMenu(true);
  }, []);

  const openFullPreferenceView = useCallback(
    (section: "overview" | "comfort" | "food" | "interests" | "transport" | "contact" | "location" = "overview") => {
      setShowPhotoMenu(false);
      setIsVerificationReviewOpen(false);
      setShowProfileMenu(false);
      router.push({ pathname: "/user-preferences", params: { section } } as never);
    },
    [router]
  );

  const openPreferenceDestination = useCallback(
    (
      panel: "preferences" | "comfortTrust" | "foodBeverage" | "hobbiesInterests",
      section: "overview" | "comfort" | "food" | "interests"
    ) => {
      if (shouldOpenFullPreferenceView) {
        openFullPreferenceView(section);
        return;
      }

      openProfileOptionsPanel(panel);
    },
    [openFullPreferenceView, openProfileOptionsPanel, shouldOpenFullPreferenceView]
  );

  useEffect(() => {
    if (menu === "preferences") {
      openProfileOptionsPanel("preferences");
    }

    if (menu === "comfortTrust") {
      openProfileOptionsPanel("comfortTrust");
    }

    if (menu === "foodBeverage") {
      openProfileOptionsPanel("foodBeverage");
    }

    if (menu === "hobbiesInterests") {
      openProfileOptionsPanel("hobbiesInterests");
    }
  }, [menu, openProfileOptionsPanel]);

  useEffect(() => {
    if (!showProfileMenu || Platform.OS !== "web") return undefined;

    const focusTimer = setTimeout(() => profileDrawerCloseRef.current?.focus?.(), 0);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProfileMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeProfileMenu, showProfileMenu]);

  useEffect(() => {
    const previousAboutText =
      profileTranslations[aboutLanguageBase as keyof typeof profileTranslations]?.aboutText ?? profileTranslations.English.aboutText;

    if (!isEditingAbout && aboutMe === previousAboutText) {
      setAboutMe(copy.aboutText);
      setAboutLanguageBase(appLanguageBase);
    }
  }, [aboutLanguageBase, aboutMe, appLanguageBase, copy.aboutText, isEditingAbout]);

  useEffect(() => {
    if (!isEditingSuburb) {
      setDraftSuburb(suburb);
    }
  }, [isEditingSuburb, suburb]);

  useEffect(() => {
    if (!isEditingLastName) {
      setDraftMiddleName(middleName);
      setDraftLastName(lastName);
    }
  }, [isEditingLastName, lastName, middleName]);

  useEffect(() => {
    if (!isEditingAge) {
      setDraftAge(age ? String(age) : "");
      setDraftPreferredAgeMin(String(preferredAgeMin));
      setDraftPreferredAgeMax(String(preferredAgeMax));
      setDraftGender(gender);
    }
  }, [age, gender, isEditingAge, preferredAgeMax, preferredAgeMin]);

  const saveProfilePhotoPreview = (uri: string | null) => {
    setProfilePhotoUri(uri);
    saveSoftHelloMvpState({ profilePhotoUri: uri });
  };

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(profileCopy.photoPermissionTitle, profileCopy.profilePhotoPermissionCopy);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      saveProfilePhotoPreview(result.assets[0].uri);
    }
  };

  const handleProfilePhotoDrop = (event: any) => {
    event.preventDefault?.();
    const file = event.dataTransfer?.files?.[0] ?? event.nativeEvent?.dataTransfer?.files?.[0];

    if (!file || typeof file.type !== "string" || !file.type.startsWith("image/")) return;

    const createObjectUrl = globalThis.URL?.createObjectURL;
    if (!createObjectUrl) return;

    saveProfilePhotoPreview(createObjectUrl(file));
  };

  const photoDropZoneProps = Platform.OS === "web"
    ? ({
        onDragOver: (event: any) => event.preventDefault?.(),
        onDrop: handleProfilePhotoDrop,
      } as any)
    : {};

  const handleAvatarPress = () => {
    setShowProfileMenu(false);
    setShowPhotoMenu(!showPhotoMenu);
  };

  const saveName = () => {
    const nextName = draftName.trim();

    if (!isAllowedDisplayName(nextName)) {
      setNameError(nameNotAllowedMessage);
      return;
    }

    setDisplayName(nextName);
    saveSoftHelloMvpState({ displayName: nextName });
    setNameError("");
    setIsEditingName(false);
    setShowNameSaved(true);
    setTimeout(() => {
      setShowNameSaved(false);
    }, 1000);
  };

  const toggleNameEditing = () => {
    if (isEditingName) {
      saveName();
      return;
    }

    setDraftName(displayName);
    setNameError("");
    setShowNameSaved(false);
    setIsEditingName(true);
  };

  const saveLastName = async () => {
    const nextMiddleName = draftMiddleName.trim();
    const nextLastName = draftLastName.trim();

    await saveSoftHelloMvpState({
      middleName: nextMiddleName,
      lastName: nextLastName,
      middleNameDisplay: nextMiddleName ? middleNameDisplay : "Hidden",
      lastNameDisplay: nextLastName ? lastNameDisplay : "Hidden",
      showMiddleName: nextMiddleName ? showMiddleName : false,
      showLastName: nextLastName ? showLastName : false,
    });
    setIsEditingLastName(false);
    setShowLastNameSaved(true);
    setTimeout(() => {
      setShowLastNameSaved(false);
    }, 1000);
  };

  const toggleLastNameEditing = () => {
    if (isEditingLastName) {
      saveLastName();
      return;
    }

    setDraftMiddleName(middleName);
    setDraftLastName(lastName);
    setShowLastNameSaved(false);
    setIsEditingLastName(true);
  };

  const saveAgeAndGroup = async () => {
    const nextAge = Number.parseInt(draftAge, 10);
    const nextPreferredMin = Number.parseInt(draftPreferredAgeMin, 10);
    const nextPreferredMax = Number.parseInt(draftPreferredAgeMax, 10);

    await saveSoftHelloMvpState({
      age: Number.isFinite(nextAge) ? nextAge : age,
      preferredAgeMin: Number.isFinite(nextPreferredMin) ? nextPreferredMin : preferredAgeMin,
      preferredAgeMax: Number.isFinite(nextPreferredMax) ? nextPreferredMax : preferredAgeMax,
      gender: draftGender,
      showGender: draftGender === "Not specified" ? false : showGender,
    });
    setIsEditingAge(false);
    setShowAgeSaved(true);
    setTimeout(() => {
      setShowAgeSaved(false);
    }, 1000);
  };

  const toggleAgeEditing = () => {
    if (isEditingAge) {
      saveAgeAndGroup();
      return;
    }

    setDraftAge(age ? String(age) : "");
    setDraftPreferredAgeMin(String(preferredAgeMin));
    setDraftPreferredAgeMax(String(preferredAgeMax));
    setDraftGender(gender);
    setShowAgeSaved(false);
    setIsEditingAge(true);
  };

  const toggleVibeEditing = () => {
    if (isEditingVibes) {
      setIsEditingVibes(false);
      setVibeLimitMessage("");
      setShowVibesSaved(true);
      setTimeout(() => {
        setShowVibesSaved(false);
      }, 1000);
      return;
    }

    setShowVibesSaved(false);
    setIsEditingVibes(true);
  };

  const toggleInterestEditing = () => {
    if (isEditingInterests) {
      setIsEditingInterests(false);
      setShowInterestsSaved(true);
      setTimeout(() => {
        setShowInterestsSaved(false);
      }, 1000);
      return;
    }

    setShowInterestsSaved(false);
    setIsEditingInterests(true);
  };

  const toggleProfileInterest = async (interest: string) => {
    const nextInterests = hobbiesInterests.includes(interest)
      ? hobbiesInterests.filter((item) => item !== interest)
      : [...hobbiesInterests, interest];

    await saveSoftHelloMvpState({ hobbiesInterests: nextInterests });
  };

  const saveSuburb = async (area: LocalAreaSuggestion) => {
    await saveSoftHelloMvpState({ suburb: area.label, timezone: area });
    setDraftSuburb(area.label);
    setIsEditingSuburb(false);
    setShowSuburbSaved(true);
    setTimeout(() => {
      setShowSuburbSaved(false);
    }, 1000);
  };

  const toggleSuburbEditing = () => {
    if (isEditingSuburb) {
      setIsEditingSuburb(false);
      return;
    }

    setDraftSuburb(suburb);
    setShowSuburbSaved(false);
    setIsEditingSuburb(true);
  };

  const pickIdentitySelfie = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(profileCopy.photoPermissionTitle, profileCopy.identitySelfiePermissionCopy);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setDraftIdentitySelfieUri(result.assets[0].uri);
    }
  };

  const toggleComfortEditing = async () => {
    if (isEditingComfort) {
      await saveSoftHelloMvpState({ comfortPreferences: draftComfortPreferences });
      setIsEditingComfort(false);
      setShowComfortSaved(true);
      setTimeout(() => {
        setShowComfortSaved(false);
      }, 1000);
      return;
    }

    setDraftComfortPreferences(comfortPreferences);
    setShowComfortSaved(false);
    setIsEditingComfort(true);
  };

  const toggleComfortPreference = (preference: SoftHelloComfortPreference) => {
    setDraftComfortPreferences((current) =>
      current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference]
    );
  };

  const getComfortModePreviewDefaults = (nextMode: typeof comfortMode) => {
    if (nextMode === "Comfort Mode") {
      return {
        visibilityPreference: "Blurred" as const,
        blurProfilePhoto: true,
        showSuburbArea: false,
        middleNameDisplay: "Hidden" as const,
        lastNameDisplay: "Hidden" as const,
        showMiddleName: false,
        showLastName: false,
        showAge: false,
        showPreferredAgeRange: false,
        showGender: false,
        showInterests: false,
        showComfortPreferences: false,
        minimalProfileView: false,
      };
    }

    if (nextMode === "Warm Up Mode") {
      return {
        visibilityPreference: "Blurred" as const,
        blurProfilePhoto: true,
        showSuburbArea: false,
        middleNameDisplay: "Hidden" as const,
        lastNameDisplay: "Hidden" as const,
        showMiddleName: false,
        showLastName: false,
        showAge: Boolean(age),
        showPreferredAgeRange: false,
        showGender: gender !== "Not specified",
        showInterests: true,
        showComfortPreferences: true,
        minimalProfileView: false,
      };
    }

    return {
      visibilityPreference: "Visible" as const,
      blurProfilePhoto: false,
      showSuburbArea: true,
      middleNameDisplay: middleName ? ("Full" as const) : ("Hidden" as const),
      lastNameDisplay: lastName ? ("Full" as const) : ("Hidden" as const),
      showMiddleName: Boolean(middleName),
      showLastName: Boolean(lastName),
      showAge: Boolean(age),
      showPreferredAgeRange: true,
      showGender: gender !== "Not specified",
      showInterests: true,
      showComfortPreferences: true,
      minimalProfileView: false,
    };
  };

  const updateComfortMode = async (nextMode: typeof comfortMode) => {
    if (nextMode === comfortMode) return;
    const previewDefaults = getComfortModePreviewDefaults(nextMode);
    setShowAboutInPreview(nextMode === "Open Mode");
    setShowVibesInPreview(nextMode !== "Comfort Mode");

    await saveSoftHelloMvpState({
      comfortMode: nextMode,
      ...previewDefaults,
    });
  };

  const updateSocialEnergyPreference = async (preference: SocialEnergyPreference) => {
    await saveSoftHelloMvpState({ socialEnergyPreference: preference });
  };

  const updateGroupSizePreference = async (preference: GroupSizePreference) => {
    await saveSoftHelloMvpState({ groupSizePreference: preference });
  };

  const toggleCommunicationPreference = async (preference: CommunicationPreference) => {
    const nextPreferences = communicationPreferences.includes(preference)
      ? communicationPreferences.filter((item) => item !== preference)
      : [...communicationPreferences, preference];

    await saveSoftHelloMvpState({ communicationPreferences: nextPreferences });
  };

  const togglePhotoRecordingComfortPreference = async (preference: PhotoRecordingComfortPreference) => {
    const nextPreferences = photoRecordingComfortPreferences.includes(preference)
      ? photoRecordingComfortPreferences.filter((item) => item !== preference)
      : [...photoRecordingComfortPreferences, preference];

    await saveSoftHelloMvpState({ photoRecordingComfortPreferences: nextPreferences });
  };

  const togglePhysicalContactComfortPreference = async (preference: PhysicalContactComfortPreference) => {
    const nextPreferences = physicalContactComfortPreferences.includes(preference)
      ? physicalContactComfortPreferences.filter((item) => item !== preference)
      : [...physicalContactComfortPreferences, preference];

    await saveSoftHelloMvpState({ physicalContactComfortPreferences: nextPreferences.length ? nextPreferences : ["Ask first"] });
  };

  const toggleFoodBeveragePreference = async (preferenceId: string) => {
    const nextPreferences = foodBeveragePreferenceIds.includes(preferenceId)
      ? foodBeveragePreferenceIds.filter((item) => item !== preferenceId)
      : [...foodBeveragePreferenceIds, preferenceId];

    await saveSoftHelloMvpState({ foodBeveragePreferenceIds: nextPreferences });
  };

  const toggleFoodPreferenceGroup = (groupId: FoodPreferenceGroupId) => {
    setOpenFoodPreferenceGroups((current) =>
      current.includes(groupId) ? current.filter((item) => item !== groupId) : [...current, groupId]
    );
  };

  const toggleFoodPreferenceGroupLimit = (groupId: FoodPreferenceGroupId) => {
    setShowAllFoodPreferenceGroups((current) =>
      current.includes(groupId) ? current.filter((item) => item !== groupId) : [...current, groupId]
    );
  };

  const toggleInterestPreference = async (preferenceId: string) => {
    const isSelected = interestPreferenceIds.includes(preferenceId);
    const nextPreferences = isSelected
      ? interestPreferenceIds.filter((item) => item !== preferenceId)
      : [...interestPreferenceIds, preferenceId];
    const nextComfortTags = { ...interestComfortTagsByInterest };

    if (isSelected) {
      delete nextComfortTags[preferenceId];
    } else if (!nextComfortTags[preferenceId]) {
      nextComfortTags[preferenceId] = ["open-to-this"];
    }

    const nextHobbiesInterests = getInterestPreferenceLabels(nextPreferences);

    await saveSoftHelloMvpState({
      interestPreferenceIds: nextPreferences,
      interestComfortTagsByInterest: nextComfortTags,
      hobbiesInterests: nextHobbiesInterests,
    });

    if (!isSelected) {
      setActiveInterestComfortId(preferenceId);
    } else if (activeInterestComfortId === preferenceId) {
      setActiveInterestComfortId(nextPreferences[0] ?? null);
    }
  };

  const toggleInterestCategory = (categoryId: InterestCategoryId) => {
    setOpenInterestCategories((current) =>
      current.includes(categoryId) ? current.filter((item) => item !== categoryId) : [...current, categoryId]
    );
  };

  const toggleInterestCategoryLimit = (categoryId: InterestCategoryId) => {
    setShowAllInterestCategories((current) =>
      current.includes(categoryId) ? current.filter((item) => item !== categoryId) : [...current, categoryId]
    );
  };

  const toggleInterestComfortTag = async (interestId: string, tagId: InterestComfortTagId) => {
    const currentTags = (interestComfortTagsByInterest[interestId] ?? ["open-to-this"]) as InterestComfortTagId[];
    const nextTags = currentTags.includes(tagId)
      ? currentTags.filter((item) => item !== tagId)
      : tagId === "not-for-me"
        ? ["not-for-me" as InterestComfortTagId]
        : [...currentTags.filter((item) => item !== "not-for-me"), tagId];

    await saveSoftHelloMvpState({
      interestComfortTagsByInterest: {
        ...interestComfortTagsByInterest,
        [interestId]: nextTags,
      },
    });
  };

  const toggleVerifiedButPrivate = async () => {
    await saveSoftHelloMvpState({ verifiedButPrivate: !verifiedButPrivate });
  };

  const updateWarmUpLowerBlur = async (value: boolean) => {
    await saveSoftHelloMvpState({ warmUpLowerBlur: value });
  };

  const updateProfileShortcutLayout = async (nextLayout: ProfileShortcutLayout) => {
    if (nextLayout === profileShortcutLayout) return;

    await saveSoftHelloMvpState({ profileShortcutLayout: nextLayout });
  };

  const updateProfileWidthPreference = async (nextPreference: ProfileWidthPreference) => {
    if (nextPreference === profileWidthPreference) return;

    await saveSoftHelloMvpState({ profileWidthPreference: nextPreference });
  };

  const updateProfileDisplayPreference = async (
    snapshot: Partial<{
      homeEventLayout: HomeEventLayout;
      homeLayoutDensity: HomeLayoutDensity;
      homeHeaderControlsDensity: HomeHeaderControlsDensity;
      homeEventVisualMode: HomeEventVisualMode;
    }>
  ) => {
    await saveSoftHelloMvpState(snapshot);
  };

  const openVerificationReview = () => {
    setShowProfileMenu(false);
    setDraftContactEmail(contactEmail);
    setDraftContactPhone(contactPhone);
    setDraftIdentitySelfieUri(identitySelfieUri);
    setDraftHasIdentityDocument(hasIdentityDocument);
    setIsVerificationReviewOpen(true);
  };

  const confirmVerificationDetails = async () => {
    const nextVerificationLevel = deriveVerificationLevel({
      contactEmail: draftContactEmail,
      contactPhone: draftContactPhone,
      identitySelfieUri: draftIdentitySelfieUri,
      hasIdentityDocument: draftHasIdentityDocument,
    });

    await saveSoftHelloMvpState({
      contactEmail: draftContactEmail.trim(),
      contactPhone: draftContactPhone.trim(),
      identitySelfieUri: draftIdentitySelfieUri,
      hasIdentityDocument: draftHasIdentityDocument,
      verificationLevel: nextVerificationLevel,
    });
    setIsVerificationReviewOpen(false);
  };

  const resetProfileDefaults = async () => {
    await saveSoftHelloMvpState({
      comfortMode: "Comfort Mode",
      visibilityPreference: "Blurred",
      privateProfile: false,
      blurProfilePhoto: true,
      blurLevel: "Medium blur",
      warmUpLowerBlur: true,
      showSuburbArea: false,
      middleNameDisplay: "Hidden",
      lastNameDisplay: "Hidden",
      showMiddleName: false,
      showLastName: false,
      showAge: false,
      showPreferredAgeRange: false,
      showGender: false,
      showInterests: false,
      showComfortPreferences: false,
      minimalProfileView: false,
      hobbiesInterests: ["Coffee", "Movies", "Walks", "Dinner"],
      comfortPreferences: ["Small groups", "Text-first", "Quiet"],
      contactPreferences: ["Text"],
      socialEnergyPreference: "Calm",
      communicationPreferences: ["Low-message mode", "Details only"],
      groupSizePreference: "Small groups only",
      photoRecordingComfortPreferences: ["Ask me first", "No public posting without permission", "Prefer no screenshots of chats/profile"],
      physicalContactComfortPreferences: ["Ask first", "Prefer personal space"],
      verifiedButPrivate: true,
      foodBeveragePreferenceIds: defaultFoodBeveragePreferenceIds,
      interestPreferenceIds: defaultInterestPreferenceIds,
      interestComfortTagsByInterest: defaultInterestComfortTagsByInterest,
    });
    setShowProfileMenu(false);
  };

  const showDeleteAccountNotice = () => {
    setShowProfileMenu(false);
    Alert.alert(
      "Delete account",
      "Accounts are not connected in the NSN pilot yet. When authentication is added, this will permanently delete your account and profile data."
    );
  };

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((item) => item !== vibe));
      setVibeLimitMessage("");
    } else if (selectedVibes.length < 5) {
      setSelectedVibes([...selectedVibes, vibe]);
      setVibeLimitMessage("");
    } else {
      setVibeLimitMessage(copy.vibeLimitMessage);
    }
  };
  const reviewVerificationLevel = deriveVerificationLevel({
    contactEmail: draftContactEmail,
    contactPhone: draftContactPhone,
    identitySelfieUri: draftIdentitySelfieUri,
    hasIdentityDocument: draftHasIdentityDocument,
  });
  const verificationLevelCards = [
    {
      level: "Unverified",
      title: "Level 0",
      meaning: "New or incomplete account.",
      treatment: "Can browse limited content, but cannot meet in person.",
      active: reviewVerificationLevel === "Unverified",
    },
    {
      level: "Contact Verified",
      title: "Level 1",
      meaning: "Email or phone saved locally in this pilot.",
      treatment: "Can create a basic profile and use low-risk interactions.",
      active: reviewVerificationLevel === "Contact Verified",
    },
    {
      level: "Real Person Verified",
      title: "Level 2",
      meaning: "Live selfie plus ID check modelled in the prototype.",
      treatment: "Required before in-person meeting eligibility.",
      active: reviewVerificationLevel === "Real Person Verified",
    },
  ];
  const selectedFoodPreferenceLabels = useMemo(
    () => getSelectedFoodPreferenceLabels(foodBeveragePreferenceIds, 8),
    [foodBeveragePreferenceIds]
  );
  const foodPreferenceSearchResults = useMemo(
    () => searchFoodBeveragePreferences(foodPreferenceSearch),
    [foodPreferenceSearch]
  );

  const renderFoodPreferenceChip = (option: FoodBeveragePreference) => {
    const active = foodBeveragePreferenceIds.includes(option.id);
    const group = foodPreferenceGroups.find((item) => item.id === option.group);

    return (
      <TouchableOpacity
        key={option.id}
        accessibilityRole="button"
        accessibilityLabel={`Food and beverage preference ${option.label}`}
        accessibilityState={{ selected: active }}
        activeOpacity={0.78}
        onPress={() => toggleFoodBeveragePreference(option.id)}
        style={[styles.foodPreferenceChip, isDay && styles.daySoftOption, active && styles.foodPreferenceChipActive]}
      >
        <Text style={[styles.foodPreferenceChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]} numberOfLines={1}>
          {active ? "Selected: " : ""}{option.icon ? `${option.icon} ` : ""}{option.label}
        </Text>
        {option.ageSensitive ? (
          <Text style={[styles.foodPreferenceChipMeta, active && styles.profileLayoutTextActive]}>Optional 18+</Text>
        ) : group ? (
          <Text style={[styles.foodPreferenceChipMeta, active && styles.profileLayoutTextActive]}>{group.title}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };
  const selectedInterestPreferenceLabels = useMemo(
    () => getSelectedInterestLabels(interestPreferenceIds, 8),
    [interestPreferenceIds]
  );
  const selectedInterestPreferenceOptions = useMemo(
    () => interestPreferenceIds.map(getInterestPreference).filter((option): option is InterestPreference => Boolean(option)),
    [interestPreferenceIds]
  );
  const interestPreferenceSearchResults = useMemo(
    () => searchInterestPreferences(interestPreferenceSearch),
    [interestPreferenceSearch]
  );
  const activeInterestForComfort =
    selectedInterestPreferenceOptions.find((option) => option.id === activeInterestComfortId) ?? selectedInterestPreferenceOptions[0] ?? null;

  const renderInterestPreferenceChip = (option: InterestPreference) => {
    const active = interestPreferenceIds.includes(option.id);
    const category = interestCategories.find((item) => item.id === option.category);
    const comfortLabels = active ? getInterestComfortTagLabels(interestComfortTagsByInterest[option.id]) : [];
    const meta = comfortLabels.length
      ? comfortLabels.slice(0, 2).join(", ")
      : option.genres?.length
        ? option.genres.slice(0, 2).join(", ")
        : category?.title;

    return (
      <TouchableOpacity
        key={option.id}
        accessibilityRole="button"
        accessibilityLabel={`Hobby and interest preference ${option.label}`}
        accessibilityState={{ selected: active }}
        activeOpacity={0.78}
        onPress={() => toggleInterestPreference(option.id)}
        style={[styles.foodPreferenceChip, isDay && styles.daySoftOption, active && styles.foodPreferenceChipActive]}
      >
        <Text style={[styles.foodPreferenceChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]} numberOfLines={1}>
          {active ? "Selected: " : ""}{option.icon ? `${option.icon} ` : ""}{option.label}
        </Text>
        {meta ? (
          <Text style={[styles.foodPreferenceChipMeta, active && styles.profileLayoutTextActive]} numberOfLines={1}>{meta}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const trustFoundationsSection = (
    <View style={[styles.profileSectionCard, !isCleanProfile && styles.detailedSectionCard, isWideProfile && styles.detailedSectionCardWide, isDay && styles.dayCard, softSurfaces && styles.softSurfaceCard, clearBorders && styles.clearBorderCard]}>
      <View style={[styles.cardTitleRow, isRtl && styles.rtlRow]}>
        <View style={styles.profileLayoutBody}>
          <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Comfort & trust</Text>
          <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Phase 1 prototype controls for visibility, energy, communication, group size, and verified-but-private trust.
          </Text>
        </View>
        <Text style={[styles.trustPill, isDay && styles.dayTrustPill]}>Prototype</Text>
      </View>

      <View style={styles.trustFoundationGroup}>
        <Text style={[styles.trustFoundationTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Progressive visibility</Text>
        <View style={[styles.preferenceGrid, styles.compactGrid, isRtl && styles.rtlRow]}>
          {(["Comfort Mode", "Warm Up Mode", "Open Mode"] as const).map((modeOption) => {
            const active = comfortMode === modeOption;

            return (
              <TouchableOpacity
                key={modeOption}
                accessibilityRole="button"
                accessibilityLabel={`Use ${modeOption}`}
                accessibilityState={{ selected: active }}
                activeOpacity={0.78}
                onPress={() => updateComfortMode(modeOption)}
              >
                <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, !active && styles.vibeChipMuted, active && styles.comfortChipActive, isDay && active && styles.dayComfortChipActive, isRtl && styles.rtlText]}>
                  {active ? `Selected: ${modeOption}` : modeOption}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={[styles.trustFoundationCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{visibilityModeCopy}</Text>
      </View>

      <View style={styles.trustFoundationGroup}>
        <Text style={[styles.trustFoundationTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Social energy</Text>
        <Text style={[styles.trustFoundationCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Choose the kind of social energy that feels easiest today.</Text>
        <View style={[styles.preferenceGrid, styles.compactGrid, isRtl && styles.rtlRow]}>
          {socialEnergyOptions.map((option) => {
            const active = socialEnergyPreference === option;

            return (
              <TouchableOpacity
                key={option}
                accessibilityRole="button"
                accessibilityLabel={`Social energy ${option}`}
                accessibilityState={{ selected: active }}
                activeOpacity={0.78}
                onPress={() => updateSocialEnergyPreference(option)}
              >
                <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, !active && styles.vibeChipMuted, active && styles.comfortChipActive, isDay && active && styles.dayComfortChipActive, isRtl && styles.rtlText]}>
                  {active ? `Selected: ${option}` : option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.trustFoundationGroup}>
        <Text style={[styles.trustFoundationTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Communication preferences</Text>
        <Text style={[styles.trustFoundationCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>These help others understand how you like to communicate before a meetup.</Text>
        <View style={[styles.preferenceGrid, styles.compactGrid, isRtl && styles.rtlRow]}>
          {communicationPreferenceOptions.map((option) => {
            const active = communicationPreferences.includes(option);

            return (
              <TouchableOpacity
                key={option}
                accessibilityRole="button"
                accessibilityLabel={`Communication preference ${option}`}
                accessibilityState={{ selected: active }}
                activeOpacity={0.78}
                onPress={() => toggleCommunicationPreference(option)}
              >
                <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, !active && styles.vibeChipMuted, active && styles.comfortChipActive, isDay && active && styles.dayComfortChipActive, isRtl && styles.rtlText]}>
                  {active ? `Selected: ${option}` : option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.trustFoundationGroup}>
        <Text style={[styles.trustFoundationTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Group size preference</Text>
        <View style={[styles.preferenceGrid, styles.compactGrid, isRtl && styles.rtlRow]}>
          {groupSizePreferenceOptions.map((option) => {
            const active = groupSizePreference === option;

            return (
              <TouchableOpacity
                key={option}
                accessibilityRole="button"
                accessibilityLabel={`Group size preference ${option}`}
                accessibilityState={{ selected: active }}
                activeOpacity={0.78}
                onPress={() => updateGroupSizePreference(option)}
              >
                <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, !active && styles.vibeChipMuted, active && styles.comfortChipActive, isDay && active && styles.dayComfortChipActive, isRtl && styles.rtlText]}>
                  {active ? `Selected: ${option}` : option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.trustFoundationGroup}>
        <Text style={[styles.trustFoundationTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Photo & recording comfort</Text>
        <Text style={[styles.trustFoundationCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
          Let others know what feels okay around photos, videos, and screenshots. NSN can guide consent, but it can't fully prevent someone from using another device.
        </Text>
        <View style={[styles.preferenceGrid, styles.compactGrid, isRtl && styles.rtlRow]}>
          {photoRecordingComfortOptions.map((option) => {
            const active = photoRecordingComfortPreferences.includes(option);

            return (
              <TouchableOpacity
                key={option}
                accessibilityRole="button"
                accessibilityLabel={`Photo and recording comfort ${option}`}
                accessibilityState={{ selected: active }}
                activeOpacity={0.78}
                onPress={() => togglePhotoRecordingComfortPreference(option)}
              >
                <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, !active && styles.vibeChipMuted, active && styles.comfortChipActive, isDay && active && styles.dayComfortChipActive, isRtl && styles.rtlText]}>
                  {active ? `Selected: ${option}` : option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={[styles.trustFoundationCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
          Please don't screenshot or share someone's profile, chat, or meetup details without permission.
        </Text>
      </View>

      <View style={styles.trustFoundationGroup}>
        <Text style={[styles.trustFoundationTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Physical contact comfort</Text>
        <Text style={[styles.trustFoundationCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
          Let others know what kind of greeting or personal-space boundary feels easiest. This is a preference signal, not enforcement.
        </Text>
        <View style={[styles.preferenceGrid, styles.compactGrid, isRtl && styles.rtlRow]}>
          {physicalContactComfortOptions.map((option) => {
            const active = physicalContactComfortPreferences.includes(option);

            return (
              <TouchableOpacity
                key={option}
                accessibilityRole="button"
                accessibilityLabel={`Physical contact comfort ${option}`}
                accessibilityState={{ selected: active }}
                activeOpacity={0.78}
                onPress={() => togglePhysicalContactComfortPreference(option)}
              >
                <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, !active && styles.vibeChipMuted, active && styles.comfortChipActive, isDay && active && styles.dayComfortChipActive, isRtl && styles.rtlText]}>
                  {active ? `Selected: ${option}` : option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.82}
        onPress={toggleVerifiedButPrivate}
        style={[styles.verifiedPrivateOption, isDay && styles.daySoftOption, verifiedButPrivate && styles.verifiedPrivateOptionActive]}
        accessibilityRole="switch"
        accessibilityLabel="Verified but private prototype trust state"
        accessibilityState={{ checked: verifiedButPrivate }}
      >
        <View style={styles.profileLayoutBody}>
          <Text style={[styles.trustFoundationTitle, verifiedButPrivate && styles.verifiedPrivateTextActive, isDay && styles.dayTitle, isRtl && styles.rtlText]}>
            Verified, but private
          </Text>
          <Text style={[styles.trustFoundationCopy, verifiedButPrivate && styles.verifiedPrivateTextActive, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Your contact/trust status can be checked without making your profile fully open. Prototype only - no real verification provider is connected yet.
          </Text>
        </View>
        <View style={styles.profileLayoutCheck}>{verifiedButPrivate ? <IconSymbol name="checkmark" color="#FFFFFF" size={18} /> : null}</View>
      </TouchableOpacity>
    </View>
  );

  const comfortTrustSummarySection = (
    <View style={[styles.trustCard, styles.simpleTrustCard, isWideProfile && styles.detailedSectionCardWide, isDay && styles.dayCard, softSurfaces && styles.softSurfaceCard, clearBorders && styles.clearBorderCard]}>
      <View style={[styles.trustHeader, isRtl && styles.rtlRow]}>
        <View style={styles.profileLayoutBody}>
          <Text style={[styles.sectionTitle, styles.trustTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Comfort & trust</Text>
          <Text style={[styles.simpleTrustCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            {comfortMode} / {socialEnergyPreference} energy / {groupSizePreference}
          </Text>
        </View>
        <Text style={[styles.trustPill, isDay && styles.dayTrustPill]}>Prototype</Text>
      </View>
      <View style={styles.privacySummaryGrid}>
        {[
          { label: "Visibility", value: comfortMode },
          { label: "Communication", value: communicationPreferences.slice(0, 2).join(", ") || "Not set" },
          { label: "Photo comfort", value: photoRecordingComfortPreferences.slice(0, 2).join(", ") || "Ask first" },
          { label: "Contact comfort", value: physicalContactComfortPreferences.slice(0, 2).join(", ") || "Ask first" },
          { label: "Trust status", value: verifiedButPrivate ? "Verified, private" : "Visible when shared" },
        ].map((item) => (
          <View key={item.label} style={[styles.privacySummaryItem, isDay && styles.daySoftOption]}>
            <Text style={[styles.privacySummaryLabel, isDay && styles.dayMutedText]}>{item.label}</Text>
            <Text style={[styles.privacySummaryValue, isDay && styles.dayTitle]} numberOfLines={2}>{item.value}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => openPreferenceDestination("comfortTrust", "comfort")}
        style={[styles.reviewSettingsButton, styles.simpleReviewButton, isRtl && styles.rtlRow]}
        accessibilityRole="button"
        accessibilityLabel="Manage Comfort and trust in User Options"
      >
        <Text style={styles.reviewSettingsText}>Manage in User Options</Text>
      </TouchableOpacity>
    </View>
  );

  const profileOptionsPanelTitle =
    profileMenuPanel === "edit"
      ? "Edit profile"
      : profileMenuPanel === "privacy"
        ? "Privacy guide"
        : profileMenuPanel === "preferences"
          ? "User preferences"
          : profileMenuPanel === "comfortTrust"
            ? "Comfort & trust"
            : profileMenuPanel === "foodBeverage"
              ? "Food & beverage"
              : profileMenuPanel === "hobbiesInterests"
                ? "Hobbies & interests"
                : profileMenuPanel === "display"
                  ? "Display & layout"
                  : profileMenuPanel === "layout"
                    ? "Profile layout"
                    : profileMenuPanel === "width"
                      ? "Width settings"
                      : profileMenuPanel === "notifications"
                        ? "Notifications"
                        : profileMenuPanel === "blockReport"
                          ? "Block & report"
                          : "Profile controls";

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView
        style={[styles.screen, isDay && styles.dayContainer]}
        contentContainerStyle={[
          styles.content,
          {
            maxWidth: isWideProfile ? "100%" : brandTheme.layout.profileMaxWidth,
            paddingHorizontal: brandTheme.spacing.screenX,
            paddingTop: brandTheme.spacing.screenY,
          },
          isSoftHelloTheme && styles.softHelloContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRight}>
          <TouchableOpacity
            ref={profileMenuButtonRef}
            activeOpacity={0.75}
            onPress={() => openProfileOptionsPanel("main")}
            style={[styles.settingsButton, isDay && styles.dayIconButton]}
            accessibilityRole="button"
            accessibilityLabel="Open user options"
            accessibilityHint={screenReaderHints ? profileCopy.profileMenuHint : undefined}
          >
            <IconSymbol name="more" color={isDay ? "#0B1220" : nsnColors.text} size={23} />
          </TouchableOpacity>
          {showProfileMenu ? (
            <Modal transparent animationType={isDesktopUserOptions ? "fade" : "slide"} visible={showProfileMenu} onRequestClose={closeProfileMenu}>
              <Pressable
                style={[styles.profileDrawerBackdrop, !isDesktopUserOptions && styles.profileDrawerBackdropMobile]}
                onPress={closeProfileMenu}
                accessibilityRole="button"
                accessibilityLabel="Close user options"
              >
                <Pressable
                  style={[styles.profileOptionsDrawer, !isDesktopUserOptions && styles.profileOptionsDrawerMobile, isDay && styles.dayProfileOptionsDrawer]}
                  onPress={(event) => event.stopPropagation()}
                  accessible
                  accessibilityLabel="User options"
                  accessibilityViewIsModal
                >
                  <View style={[styles.profileOptionsHeader, isRtl && styles.rtlRow]}>
                    <View style={styles.profileLayoutBody}>
                      <Text style={[styles.profileOptionsEyebrow, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>User Options</Text>
                      <Text style={[styles.profileOptionsTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>
                        {profileOptionsPanelTitle}
                      </Text>
                      <Text style={[styles.profileOptionsCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                        Review profile, privacy, preferences, and prototype account tools in one place.
                      </Text>
                    </View>
                    <TouchableOpacity
                      ref={profileDrawerCloseRef}
                      activeOpacity={0.78}
                      onPress={closeProfileMenu}
                      style={[styles.profileOptionsCloseButton, isDay && styles.daySoftOption, isRtl && styles.rtlRow]}
                      accessibilityRole="button"
                      accessibilityLabel="Close user options"
                    >
                      <IconSymbol name="xmark" color={isDay ? "#0B1220" : nsnColors.text} size={18} />
                      <Text style={[styles.profileOptionsCloseText, isDay && styles.dayTitle]}>Close</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.profileMenu, styles.profileMenuDocked, isDay && styles.dayCard]}>
              <ScrollView
                style={styles.profileMenuScroll}
                contentContainerStyle={styles.profileMenuContent}
                nestedScrollEnabled
                showsVerticalScrollIndicator
              >
                {profileMenuPanel === "main" ? (
                  <>
                    <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>User options</Text>
                    <TouchableOpacity
                      activeOpacity={0.78}
                      onPress={() => setProfileMenuPanel("edit")}
                      style={styles.profileMenuItem}
                      accessibilityRole="button"
                      accessibilityLabel="Edit profile"
                    >
                      <IconSymbol name="edit" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                      <View style={styles.profileMenuItemBody}>
                        <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Edit profile</Text>
                        <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>Name, photo, interests, and vibes.</Text>
                      </View>
                      <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.78}
                      onPress={() => setProfileMenuPanel("privacy")}
                      style={styles.profileMenuItem}
                      accessibilityRole="button"
                      accessibilityLabel="Privacy guide"
                    >
                      <IconSymbol name="visibility" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                      <View style={styles.profileMenuItemBody}>
                        <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Privacy guide</Text>
                        <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>Review blur, private profile, and preview controls.</Text>
                      </View>
                      <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                    </TouchableOpacity>
                    <View style={[styles.profileMenuDivider, isDay && styles.dayRowBorder]} />
                    {[
                      { icon: "sliders" as const, title: "User preferences", copy: "Comfort & trust, social energy, communication, transport, food, and hobbies.", panel: "preferences" as const },
                      { icon: "layout" as const, title: "Display & layout", copy: `${homeEventLayout} events, ${homeLayoutDensity.toLowerCase()} Home density.`, panel: "display" as const },
                      { icon: "group" as const, title: "Profile layout", copy: isCleanProfile ? "Simple layout selected." : "Detailed layout selected.", panel: "layout" as const },
                      { icon: "resize" as const, title: "Width settings", copy: isWideProfile ? "Wide width selected." : "Contained width selected.", panel: "width" as const },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.title}
                        activeOpacity={0.78}
                        onPress={() => {
                          if (item.panel === "preferences" && shouldOpenFullPreferenceView) {
                            openFullPreferenceView("overview");
                            return;
                          }

                          setProfileMenuPanel(item.panel);
                        }}
                        style={styles.profileMenuItem}
                        accessibilityRole="button"
                        accessibilityLabel={item.title}
                      >
                        <IconSymbol name={item.icon} color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                        <View style={styles.profileMenuItemBody}>
                          <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>{item.title}</Text>
                          <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>{item.copy}</Text>
                        </View>
                        <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                      </TouchableOpacity>
                    ))}
                    <View style={[styles.profileMenuDivider, isDay && styles.dayRowBorder]} />
                    <TouchableOpacity
                      activeOpacity={0.78}
                      onPress={() => setProfileMenuPanel("notifications")}
                      style={styles.profileMenuItem}
                      accessibilityRole="button"
                      accessibilityLabel="Notifications"
                    >
                      <IconSymbol name="bell" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                      <View style={styles.profileMenuItemBody}>
                        <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Notifications</Text>
                        <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>Manage event and safety alerts.</Text>
                      </View>
                      <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.78}
                      onPress={() => setProfileMenuPanel("blockReport")}
                      style={styles.profileMenuItem}
                      accessibilityRole="button"
                      accessibilityLabel="Block and report"
                    >
                      <IconSymbol name="flag" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                      <View style={styles.profileMenuItemBody}>
                        <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Block & report</Text>
                        <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>For unsafe, pushy, or unwanted contact.</Text>
                      </View>
                      <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                    </TouchableOpacity>
                    <View style={[styles.profileMenuDivider, isDay && styles.dayRowBorder]} />
                    <TouchableOpacity
                      activeOpacity={0.78}
                      onPress={() => {
                        setShowProfileMenu(false);
                        router.push("/settings" as any);
                      }}
                      style={styles.profileMenuItem}
                      accessibilityRole="button"
                      accessibilityLabel={getRowLabel("settings")}
                    >
                      <IconSymbol name="settings" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                      <View style={styles.profileMenuItemBody}>
                        <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>{getRowLabel("settings")}</Text>
                        <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>General settings, privacy, and account controls.</Text>
                      </View>
                      <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                    </TouchableOpacity>
                  </>
                ) : null}
                {profileMenuPanel === "edit" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("main")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to profile menu">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>User options</Text>
                    </TouchableOpacity>
                    <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>Quick edits</Text>
                    {[
                      { icon: "edit" as const, title: "Name", copy: "Update your first name or nickname.", action: () => { setShowProfileMenu(false); setIsEditingName(true); } },
                      { icon: "person.fill" as const, title: "Photo", copy: "Add, replace, or remove your profile photo.", action: () => { setShowProfileMenu(false); setShowPhotoMenu(true); } },
                      { icon: "calendar" as const, title: "Age, range & gender", copy: "Edit age, preferred age range, and optional gender.", action: () => { setShowProfileMenu(false); router.push("/settings" as any); } },
                      { icon: "location" as const, title: "Local area", copy: "Change your suburb or hide it from preview.", action: () => { setShowProfileMenu(false); setIsEditingSuburb(true); } },
                      { icon: "interests" as const, title: "Interests", copy: "Choose first-meetup interests shown in preview.", action: () => openPreferenceDestination("hobbiesInterests", "interests") },
                      { icon: "group" as const, title: "My vibes", copy: "Update the quick feel for your social style.", action: () => { setShowProfileMenu(false); setIsEditingVibes(true); } },
                      { icon: "visibility" as const, title: "Comfort preferences", copy: "Adjust small groups, text-first and quiet preferences.", action: () => { setShowProfileMenu(false); router.push("/settings" as any); } },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.title}
                        activeOpacity={0.78}
                        onPress={item.action}
                        style={styles.profileMenuItem}
                        accessibilityRole="button"
                        accessibilityLabel={`Edit ${item.title}`}
                      >
                        <IconSymbol name={item.icon} color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                        <View style={styles.profileMenuItemBody}>
                          <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>{item.title}</Text>
                          <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>{item.copy}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                ) : null}
                {profileMenuPanel === "privacy" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("main")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to profile menu">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Privacy guide</Text>
                    </TouchableOpacity>
                    <View style={[styles.profileMenuInfoCard, isDay && styles.daySoftOption]}>
                      <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>Your current profile visibility</Text>
                      <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                        {comfortMode} keeps your preview {comfortMode === "Comfort Mode" ? "private and blurred." : comfortMode === "Warm Up Mode" ? "partly visible while you warm up." : "open to people at the event."}
                      </Text>
                    </View>
                    {[
                      { title: "Comfort Mode", copy: "Hides details by default and keeps profiles blurred until matched or shared." },
                      { title: "Warm Up Mode", copy: "Shows a few friendly details while keeping sensitive details hidden." },
                      { title: "Open Mode", copy: "Shows basic profile details to people in the event." },
                      { title: "Preview controls", copy: "Use Shown/Hidden buttons on Profile, or manage everything in Settings & Privacy." },
                    ].map((item) => (
                      <View key={item.title} style={[styles.profileMenuGuideRow, isDay && styles.daySoftOption]}>
                        <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>{item.title}</Text>
                        <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>{item.copy}</Text>
                      </View>
                    ))}
                    <TouchableOpacity
                      activeOpacity={0.82}
                      onPress={() => {
                        setShowProfileMenu(false);
                        router.push("/settings" as any);
                      }}
                      style={[styles.profileLayoutOption, styles.profileMenuPrimaryAction]}
                      accessibilityRole="button"
                      accessibilityLabel="Open Settings and Privacy"
                    >
                      <View style={styles.profileLayoutBody}>
                        <Text style={[styles.profileLayoutTitle, styles.profileLayoutTextActive]}>Open Settings & Privacy</Text>
                        <Text style={[styles.profileLayoutCopy, styles.profileLayoutTextActive]}>Fine-tune blur, private profile, and preview details.</Text>
                      </View>
                      <IconSymbol name="chevron.right" color="#FFFFFF" size={20} />
                    </TouchableOpacity>
                  </>
                ) : null}
                {profileMenuPanel === "preferences" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("main")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to profile menu">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>User preferences</Text>
                    </TouchableOpacity>
                    {shouldOpenFullPreferenceView ? (
                      <TouchableOpacity
                        activeOpacity={0.82}
                        onPress={() => openFullPreferenceView("overview")}
                        style={[styles.profileLayoutOption, styles.profileMenuPrimaryAction]}
                        accessibilityRole="button"
                        accessibilityLabel="Open full view for user preferences"
                      >
                        <View style={styles.profileLayoutBody}>
                          <Text style={[styles.profileLayoutTitle, styles.profileLayoutTextActive]}>Open full view</Text>
                          <Text style={[styles.profileLayoutCopy, styles.profileLayoutTextActive]}>Use the wider desktop layout for categories, search, and selected summaries.</Text>
                        </View>
                        <IconSymbol name="resize" color="#FFFFFF" size={20} />
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      activeOpacity={0.78}
                      onPress={() => openPreferenceDestination("comfortTrust", "comfort")}
                      style={[styles.profileMenuItem, styles.profileMenuFeaturedItem, isDay && styles.daySoftOption]}
                      accessibilityRole="button"
                      accessibilityLabel="Comfort and trust"
                    >
                      <IconSymbol name="shield" color={isDay ? "#445E93" : "#C7B07A"} size={20} />
                      <View style={styles.profileMenuItemBody}>
                        <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Comfort & trust</Text>
                        <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>
                          Visibility, social energy, communication, group size, verification, and photo comfort.
                        </Text>
                      </View>
                      <Text style={[styles.profileMenuStatusBadge, isDay && styles.dayTrustPill]}>Prototype</Text>
                      <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.78}
                      onPress={() => openPreferenceDestination("foodBeverage", "food")}
                      style={[styles.profileMenuItem, isDay && styles.daySoftOption]}
                      accessibilityRole="button"
                      accessibilityLabel="Food and beverage preferences"
                    >
                      <IconSymbol name="food" color={isDay ? "#445E93" : "#C7B07A"} size={20} />
                      <View style={styles.profileMenuItemBody}>
                        <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Food & beverage</Text>
                        <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>
                          Cuisines, drinks, dietary needs, avoidances, and alcohol comfort.
                        </Text>
                        {selectedFoodPreferenceLabels.length ? (
                          <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]} numberOfLines={1}>
                            {selectedFoodPreferenceLabels.join(", ")}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={[styles.profileMenuStatusBadge, isDay && styles.dayTrustPill]}>{foodBeveragePreferenceIds.length} selected</Text>
                      <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.78}
                      onPress={() => openPreferenceDestination("hobbiesInterests", "interests")}
                      style={[styles.profileMenuItem, isDay && styles.daySoftOption]}
                      accessibilityRole="button"
                      accessibilityLabel="Hobbies and interests preferences"
                    >
                      <IconSymbol name="interests" color={isDay ? "#445E93" : "#C7B07A"} size={20} />
                      <View style={styles.profileMenuItemBody}>
                        <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Hobbies & interests</Text>
                        <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>
                          Activities, genres, local exploring, and comfort-aware tags.
                        </Text>
                        {selectedInterestPreferenceLabels.length ? (
                          <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]} numberOfLines={1}>
                            {selectedInterestPreferenceLabels.join(", ")}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={[styles.profileMenuStatusBadge, isDay && styles.dayTrustPill]}>{interestPreferenceIds.length} selected</Text>
                      <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                    </TouchableOpacity>
                    {[
                      { icon: "transport" as const, label: getRowLabel("transportation"), route: "/transportation-preference" },
                      { icon: "contact" as const, label: getRowLabel("contactPreference"), route: "/contact-preference" },
                      { icon: "explore" as const, label: getRowLabel("locationPreference"), route: "/location-preference" },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.route}
                        activeOpacity={0.78}
                        onPress={() => {
                          setShowProfileMenu(false);
                          if (shouldOpenFullPreferenceView && item.route === "/transportation-preference") {
                            openFullPreferenceView("transport");
                            return;
                          }
                          if (shouldOpenFullPreferenceView && item.route === "/contact-preference") {
                            openFullPreferenceView("contact");
                            return;
                          }
                          if (shouldOpenFullPreferenceView && item.route === "/location-preference") {
                            openFullPreferenceView("location");
                            return;
                          }

                          router.push(item.route as any);
                        }}
                        style={styles.profileMenuItem}
                        accessibilityRole="button"
                        accessibilityLabel={item.label}
                      >
                        <IconSymbol name={item.icon} color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                        <View style={styles.profileMenuItemBody}>
                          <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>{item.label}</Text>
                        </View>
                        <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                      </TouchableOpacity>
                    ))}
                  </>
                ) : null}
                {profileMenuPanel === "foodBeverage" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("preferences")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to user preferences">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>User preferences</Text>
                    </TouchableOpacity>
                    {shouldOpenFullPreferenceView ? (
                      <TouchableOpacity activeOpacity={0.82} onPress={() => openFullPreferenceView("food")} style={[styles.profileLayoutOption, styles.profileMenuPrimaryAction]} accessibilityRole="button" accessibilityLabel="Open full view for Food and beverage preferences">
                        <View style={styles.profileLayoutBody}>
                          <Text style={[styles.profileLayoutTitle, styles.profileLayoutTextActive]}>Open full view</Text>
                          <Text style={[styles.profileLayoutCopy, styles.profileLayoutTextActive]}>Use the wider desktop food preference layout.</Text>
                        </View>
                        <IconSymbol name="resize" color="#FFFFFF" size={20} />
                      </TouchableOpacity>
                    ) : null}
                    <View style={[styles.profileMenuInfoCard, isDay && styles.daySoftOption]}>
                      <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>Food & beverage preferences</Text>
                      <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                        Food preferences are used locally in this prototype to help suggest comfortable meetups. This is not a food delivery or restaurant recommendation system.
                      </Text>
                    </View>
                    <View style={styles.foodPreferenceSearchWrap}>
                      <IconSymbol name="magnifyingglass" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <TextInput
                        value={foodPreferenceSearch}
                        onChangeText={setFoodPreferenceSearch}
                        placeholder="Search pizza, bubble tea, halal..."
                        placeholderTextColor={isDay ? "#6E7B88" : nsnColors.muted}
                        style={[styles.foodPreferenceSearchInput, isDay && styles.dayTitle]}
                        accessibilityLabel="Search food and beverage preferences"
                        selectionColor="#7786FF"
                        underlineColorAndroid="transparent"
                      />
                      {foodPreferenceSearch ? (
                        <TouchableOpacity
                          activeOpacity={0.78}
                          onPress={() => setFoodPreferenceSearch("")}
                          accessibilityRole="button"
                          accessibilityLabel="Clear food and beverage search"
                          style={styles.foodPreferenceClearButton}
                        >
                          <IconSymbol name="xmark" color={isDay ? "#53677A" : nsnColors.muted} size={16} />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <View style={[styles.foodPreferenceSummary, isDay && styles.daySoftOption]}>
                      <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText]}>Selected</Text>
                      {selectedFoodPreferenceLabels.length ? (
                        <View style={[styles.foodPreferenceSummaryChipRow, isRtl && styles.rtlRow]}>
                          {selectedFoodPreferenceLabels.map((label, index) => (
                            <Text key={`${label}-${index}`} style={[styles.foodPreferenceSummaryChip, isDay && styles.dayTrustPill]}>{label}</Text>
                          ))}
                          {foodBeveragePreferenceIds.length > selectedFoodPreferenceLabels.length ? (
                            <Text style={[styles.foodPreferenceSummaryChip, isDay && styles.dayTrustPill]}>
                              +{foodBeveragePreferenceIds.length - selectedFoodPreferenceLabels.length} more
                            </Text>
                          ) : null}
                        </View>
                      ) : (
                        <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>No food preferences selected yet.</Text>
                      )}
                    </View>
                    {foodPreferenceSearch.trim() ? (
                      <View style={styles.foodPreferenceAccordionStack}>
                        <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>
                          Search results
                        </Text>
                        {foodPreferenceSearchResults.length ? (
                          <View style={[styles.foodPreferenceChipGrid, isRtl && styles.rtlRow]}>
                            {foodPreferenceSearchResults.map(renderFoodPreferenceChip)}
                          </View>
                        ) : (
                          <View style={[styles.profileMenuGuideRow, isDay && styles.daySoftOption]}>
                            <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>No matching preference yet</Text>
                            <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                              Try another food, drink, cuisine, dietary need, or avoidance.
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View style={styles.foodPreferenceAccordionStack}>
                        {foodPreferenceGroups.map((group) => {
                          const options = getFoodBeverageOptionsByGroup(group.id);
                          const selectedCount = getFoodPreferenceGroupSelectedCount(foodBeveragePreferenceIds, group.id);
                          const isOpen = openFoodPreferenceGroups.includes(group.id);
                          const showAll = showAllFoodPreferenceGroups.includes(group.id);
                          const visibleLimit = group.defaultVisible ?? 8;
                          const visibleOptions = showAll
                            ? options
                            : options.filter((option, index) => index < visibleLimit || foodBeveragePreferenceIds.includes(option.id));
                          const hiddenCount = options.length - visibleOptions.length;

                          return (
                            <View key={group.id} style={[styles.foodPreferenceGroup, isDay && styles.daySoftOption]}>
                              <TouchableOpacity
                                activeOpacity={0.78}
                                onPress={() => toggleFoodPreferenceGroup(group.id)}
                                style={[styles.foodPreferenceGroupHeader, isRtl && styles.rtlRow]}
                                accessibilityRole="button"
                                accessibilityLabel={`${group.title} food preference group`}
                                accessibilityValue={{ text: isOpen ? "Expanded" : "Collapsed" }}
                              >
                                <View style={styles.profileLayoutBody}>
                                  <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>{group.icon ? `${group.icon} ` : ""}{group.title}</Text>
                                  <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>{group.copy}</Text>
                                </View>
                                <View style={[styles.foodPreferenceGroupHeaderMeta, isRtl && styles.rtlRow]}>
                                  {selectedCount ? <Text style={[styles.profileMenuStatusBadge, isDay && styles.dayTrustPill]}>{selectedCount} selected</Text> : null}
                                  <IconSymbol name={isOpen ? "chevron.up" : "chevron.down"} color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                                </View>
                              </TouchableOpacity>
                              {isOpen ? (
                                <>
                                  {group.ageSensitive ? (
                                    <Text style={[styles.foodPreferenceNotice, isDay && styles.dayMutedText]}>
                                      Alcohol preferences are optional and only relevant for age-appropriate events.
                                    </Text>
                                  ) : null}
                                  <View style={[styles.foodPreferenceChipGrid, isRtl && styles.rtlRow]}>
                                    {visibleOptions.map(renderFoodPreferenceChip)}
                                  </View>
                                  {hiddenCount > 0 || showAll ? (
                                    <TouchableOpacity
                                      activeOpacity={0.78}
                                      onPress={() => toggleFoodPreferenceGroupLimit(group.id)}
                                      style={[styles.foodPreferenceShowMoreButton, isDay && styles.daySoftOption]}
                                      accessibilityRole="button"
                                      accessibilityLabel={showAll ? `Show fewer ${group.title} options` : `Show more ${group.title} options`}
                                    >
                                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>
                                        {showAll ? "Show fewer" : `Show ${hiddenCount} more`}
                                      </Text>
                                    </TouchableOpacity>
                                  ) : null}
                                </>
                              ) : null}
                            </View>
                          );
                        })}
                      </View>
                    )}
                    <View style={[styles.profileMenuInfoCard, isDay && styles.daySoftOption]}>
                      <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>Dietary safety note</Text>
                      <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                        Dietary preferences help with meetup suggestions, but users should still confirm ingredients with venues.
                      </Text>
                    </View>
                  </>
                ) : null}
                {profileMenuPanel === "hobbiesInterests" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("preferences")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to user preferences">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>User preferences</Text>
                    </TouchableOpacity>
                    {shouldOpenFullPreferenceView ? (
                      <TouchableOpacity activeOpacity={0.82} onPress={() => openFullPreferenceView("interests")} style={[styles.profileLayoutOption, styles.profileMenuPrimaryAction]} accessibilityRole="button" accessibilityLabel="Open full view for Hobbies and interests">
                        <View style={styles.profileLayoutBody}>
                          <Text style={[styles.profileLayoutTitle, styles.profileLayoutTextActive]}>Open full view</Text>
                          <Text style={[styles.profileLayoutCopy, styles.profileLayoutTextActive]}>Use the wider desktop interests layout.</Text>
                        </View>
                        <IconSymbol name="resize" color="#FFFFFF" size={20} />
                      </TouchableOpacity>
                    ) : null}
                    <View style={[styles.profileMenuInfoCard, isDay && styles.daySoftOption]}>
                      <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>Hobbies & interests</Text>
                      <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                        Interests help NSN suggest comfortable activities and conversation starters. This is a local prototype preference layer, not a dating quiz or production matching engine.
                      </Text>
                    </View>
                    <View style={styles.foodPreferenceSearchWrap}>
                      <IconSymbol name="magnifyingglass" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <TextInput
                        value={interestPreferenceSearch}
                        onChangeText={setInterestPreferenceSearch}
                        placeholder="Search anime, horror, walking..."
                        placeholderTextColor={isDay ? "#6E7B88" : nsnColors.muted}
                        style={[styles.foodPreferenceSearchInput, isDay && styles.dayTitle]}
                        accessibilityLabel="Search hobbies and interests"
                        selectionColor="#7786FF"
                        underlineColorAndroid="transparent"
                      />
                      {interestPreferenceSearch ? (
                        <TouchableOpacity
                          activeOpacity={0.78}
                          onPress={() => setInterestPreferenceSearch("")}
                          accessibilityRole="button"
                          accessibilityLabel="Clear hobbies and interests search"
                          style={styles.foodPreferenceClearButton}
                        >
                          <IconSymbol name="xmark" color={isDay ? "#53677A" : nsnColors.muted} size={16} />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <View style={[styles.foodPreferenceSummary, isDay && styles.daySoftOption]}>
                      <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText]}>Selected</Text>
                      {selectedInterestPreferenceLabels.length ? (
                        <View style={[styles.foodPreferenceSummaryChipRow, isRtl && styles.rtlRow]}>
                          {selectedInterestPreferenceLabels.map((label, index) => (
                            <Text key={`${label}-${index}`} style={[styles.foodPreferenceSummaryChip, isDay && styles.dayTrustPill]}>{label}</Text>
                          ))}
                          {interestPreferenceIds.length > selectedInterestPreferenceLabels.length ? (
                            <Text style={[styles.foodPreferenceSummaryChip, isDay && styles.dayTrustPill]}>
                              +{interestPreferenceIds.length - selectedInterestPreferenceLabels.length} more
                            </Text>
                          ) : null}
                        </View>
                      ) : (
                        <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>No hobbies or interests selected yet.</Text>
                      )}
                    </View>
                    <View style={[styles.profileMenuInfoCard, isDay && styles.daySoftOption]}>
                      <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>Comfort modifiers</Text>
                      <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                        Mark how each selected interest feels. These labels are prototype comfort signals for future matching and event planning.
                      </Text>
                      {activeInterestForComfort ? (
                        <>
                          <View style={[styles.foodPreferenceSummaryChipRow, styles.interestComfortTargetRow, isRtl && styles.rtlRow]}>
                            {selectedInterestPreferenceOptions.slice(0, 8).map((option) => {
                              const active = activeInterestForComfort.id === option.id;

                              return (
                                <TouchableOpacity
                                  key={option.id}
                                  activeOpacity={0.78}
                                  onPress={() => setActiveInterestComfortId(option.id)}
                                  accessibilityRole="button"
                                  accessibilityLabel={`Edit comfort tags for ${option.label}`}
                                  accessibilityState={{ selected: active }}
                                  style={[styles.interestComfortTargetChip, isDay && styles.daySoftOption, active && styles.foodPreferenceChipActive]}
                                >
                                  <Text style={[styles.foodPreferenceChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]} numberOfLines={1}>
                                    {active ? `Editing: ${option.label}` : option.label}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                          <View style={[styles.foodPreferenceChipGrid, styles.interestComfortTagGrid, isRtl && styles.rtlRow]}>
                            {interestComfortTags.map((tag) => {
                              const active = (interestComfortTagsByInterest[activeInterestForComfort.id] ?? []).includes(tag.id);

                              return (
                                <TouchableOpacity
                                  key={tag.id}
                                  activeOpacity={0.78}
                                  onPress={() => toggleInterestComfortTag(activeInterestForComfort.id, tag.id)}
                                  accessibilityRole="button"
                                  accessibilityLabel={`${tag.label} for ${activeInterestForComfort.label}`}
                                  accessibilityState={{ selected: active }}
                                  style={[styles.foodPreferenceChip, isDay && styles.daySoftOption, active && styles.foodPreferenceChipActive]}
                                >
                                  <Text style={[styles.foodPreferenceChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]} numberOfLines={1}>
                                    {active ? `Selected: ${tag.label}` : tag.label}
                                  </Text>
                                  <Text style={[styles.foodPreferenceChipMeta, active && styles.profileLayoutTextActive]} numberOfLines={1}>{tag.copy}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </>
                      ) : (
                        <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                          Select an interest below to add comfort modifiers.
                        </Text>
                      )}
                    </View>
                    {interestPreferenceSearch.trim() ? (
                      <View style={styles.foodPreferenceAccordionStack}>
                        <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>Search results</Text>
                        {interestPreferenceSearchResults.length ? (
                          <View style={[styles.foodPreferenceChipGrid, isRtl && styles.rtlRow]}>
                            {interestPreferenceSearchResults.map(renderInterestPreferenceChip)}
                          </View>
                        ) : (
                          <View style={[styles.profileMenuGuideRow, isDay && styles.daySoftOption]}>
                            <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>No matching interest yet</Text>
                            <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                              Try another activity, genre, category, or local place.
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View style={styles.foodPreferenceAccordionStack}>
                        {interestCategories.map((category) => {
                          const options = getInterestOptionsByCategory(category.id);
                          const selectedCount = getInterestCategorySelectedCount(interestPreferenceIds, category.id);
                          const isOpen = openInterestCategories.includes(category.id);
                          const showAll = showAllInterestCategories.includes(category.id);
                          const visibleLimit = category.defaultVisible ?? 8;
                          const visibleOptions = showAll
                            ? options
                            : options.filter((option, index) => index < visibleLimit || interestPreferenceIds.includes(option.id));
                          const hiddenCount = options.length - visibleOptions.length;

                          return (
                            <View key={category.id} style={[styles.foodPreferenceGroup, isDay && styles.daySoftOption]}>
                              <TouchableOpacity
                                activeOpacity={0.78}
                                onPress={() => toggleInterestCategory(category.id)}
                                style={[styles.foodPreferenceGroupHeader, isRtl && styles.rtlRow]}
                                accessibilityRole="button"
                                accessibilityLabel={`${category.title} interest group`}
                                accessibilityValue={{ text: isOpen ? "Expanded" : "Collapsed" }}
                              >
                                <View style={styles.profileLayoutBody}>
                                  <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>{category.icon ? `${category.icon} ` : ""}{category.title}</Text>
                                  <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>{category.copy}</Text>
                                </View>
                                <View style={[styles.foodPreferenceGroupHeaderMeta, isRtl && styles.rtlRow]}>
                                  {selectedCount ? <Text style={[styles.profileMenuStatusBadge, isDay && styles.dayTrustPill]}>{selectedCount} selected</Text> : null}
                                  <IconSymbol name={isOpen ? "chevron.up" : "chevron.down"} color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                                </View>
                              </TouchableOpacity>
                              {isOpen ? (
                                <>
                                  <View style={[styles.foodPreferenceChipGrid, isRtl && styles.rtlRow]}>
                                    {visibleOptions.map(renderInterestPreferenceChip)}
                                  </View>
                                  {hiddenCount > 0 || showAll ? (
                                    <TouchableOpacity
                                      activeOpacity={0.78}
                                      onPress={() => toggleInterestCategoryLimit(category.id)}
                                      style={[styles.foodPreferenceShowMoreButton, isDay && styles.daySoftOption]}
                                      accessibilityRole="button"
                                      accessibilityLabel={showAll ? `Show fewer ${category.title} options` : `Show more ${category.title} options`}
                                    >
                                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>
                                        {showAll ? "Show fewer" : `Show ${hiddenCount} more`}
                                      </Text>
                                    </TouchableOpacity>
                                  ) : null}
                                </>
                              ) : null}
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </>
                ) : null}
                {profileMenuPanel === "comfortTrust" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("preferences")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to user preferences">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>User preferences</Text>
                    </TouchableOpacity>
                    {shouldOpenFullPreferenceView ? (
                      <TouchableOpacity activeOpacity={0.82} onPress={() => openFullPreferenceView("comfort")} style={[styles.profileLayoutOption, styles.profileMenuPrimaryAction]} accessibilityRole="button" accessibilityLabel="Open full view for Comfort and trust">
                        <View style={styles.profileLayoutBody}>
                          <Text style={[styles.profileLayoutTitle, styles.profileLayoutTextActive]}>Open full view</Text>
                          <Text style={[styles.profileLayoutCopy, styles.profileLayoutTextActive]}>Use the wider desktop comfort and trust layout.</Text>
                        </View>
                        <IconSymbol name="resize" color="#FFFFFF" size={20} />
                      </TouchableOpacity>
                    ) : null}
                    <View style={[styles.profileMenuInfoCard, isDay && styles.daySoftOption]}>
                      <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>Comfort & trust</Text>
                      <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                        These controls tell others what feels easiest before a meetup. They are prototype preferences and reminders, not guaranteed enforcement.
                      </Text>
                    </View>
                    {trustFoundationsSection}
                    <TouchableOpacity
                      activeOpacity={0.82}
                      onPress={() => {
                        setShowProfileMenu(false);
                        router.push("/settings" as any);
                      }}
                      style={[styles.profileLayoutOption, styles.profileMenuPrimaryAction]}
                      accessibilityRole="button"
                      accessibilityLabel="Open Settings and Privacy comfort and trust controls"
                    >
                      <View style={styles.profileLayoutBody}>
                        <Text style={[styles.profileLayoutTitle, styles.profileLayoutTextActive]}>Open Settings & Privacy</Text>
                        <Text style={[styles.profileLayoutCopy, styles.profileLayoutTextActive]}>Use the full settings page for search, accordions, and account controls.</Text>
                      </View>
                      <IconSymbol name="chevron.right" color="#FFFFFF" size={20} />
                    </TouchableOpacity>
                  </>
                ) : null}
                {profileMenuPanel === "display" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("main")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to profile menu">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Display & layout</Text>
                    </TouchableOpacity>
                    <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>Home and event display</Text>
                    <View style={styles.profileDisplayGrid}>
                      <View style={styles.profileDisplayGroup}>
                        <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Event layout</Text>
                        <View style={[styles.profileDisplayChipRow, isRtl && styles.rtlRow]}>
                          {profileEventLayoutOptions.map((option) => {
                            const active = homeEventLayout === option;

                            return (
                              <TouchableOpacity
                                key={option}
                                activeOpacity={0.82}
                                onPress={() => updateProfileDisplayPreference({ homeEventLayout: option })}
                                accessibilityRole="button"
                                accessibilityState={{ selected: active }}
                                accessibilityLabel={`${option} event layout`}
                                style={[styles.profileDisplayChip, isDay && styles.daySoftOption, active && styles.profileDisplayChipActive]}
                              >
                                <IconSymbol name={option === "Map" ? "location" : "calendar"} color={active ? "#FFFFFF" : isDay ? "#445E93" : "#C7B07A"} size={15} />
                                <Text style={[styles.profileDisplayChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{option}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                      <View style={styles.profileDisplayGroup}>
                        <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Event visuals</Text>
                        <View style={[styles.profileDisplayChipRow, isRtl && styles.rtlRow]}>
                          {profileEventVisualModeOptions.map((option) => {
                            const active = homeEventVisualMode === option;

                            return (
                              <TouchableOpacity
                                key={option}
                                activeOpacity={0.82}
                                onPress={() => updateProfileDisplayPreference({ homeEventVisualMode: option })}
                                accessibilityRole="button"
                                accessibilityState={{ selected: active }}
                                accessibilityLabel={`${option} event display`}
                                style={[styles.profileDisplayChip, isDay && styles.daySoftOption, active && styles.profileDisplayChipActive]}
                              >
                                <IconSymbol name={option === "Preview image" ? "preview" : "experience"} color={active ? "#FFFFFF" : isDay ? "#445E93" : "#C7B07A"} size={15} />
                                <Text style={[styles.profileDisplayChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{option}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                      <View style={styles.profileDisplayGroup}>
                        <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Home density</Text>
                        <View style={[styles.profileDisplayChipRow, isRtl && styles.rtlRow]}>
                          {profileHomeLayoutDensityOptions.map((option) => {
                            const active = homeLayoutDensity === option;

                            return (
                              <TouchableOpacity
                                key={option}
                                activeOpacity={0.82}
                                onPress={() => updateProfileDisplayPreference({ homeLayoutDensity: option })}
                                accessibilityRole="button"
                                accessibilityState={{ selected: active }}
                                accessibilityLabel={`${option} Home density`}
                                style={[styles.profileDisplayChip, isDay && styles.daySoftOption, active && styles.profileDisplayChipActive]}
                              >
                                <Text style={[styles.profileDisplayChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{option}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                      <View style={styles.profileDisplayGroup}>
                        <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Header controls</Text>
                        <View style={[styles.profileDisplayChipRow, isRtl && styles.rtlRow]}>
                          {profileHeaderControlsDensityOptions.map((option) => {
                            const active = homeHeaderControlsDensity === option;

                            return (
                              <TouchableOpacity
                                key={option}
                                activeOpacity={0.82}
                                onPress={() => updateProfileDisplayPreference({ homeHeaderControlsDensity: option })}
                                accessibilityRole="button"
                                accessibilityState={{ selected: active }}
                                accessibilityLabel={`${option} header controls`}
                                style={[styles.profileDisplayChip, isDay && styles.daySoftOption, active && styles.profileDisplayChipActive]}
                              >
                                <IconSymbol name="settings" color={active ? "#FFFFFF" : isDay ? "#445E93" : "#C7B07A"} size={15} />
                                <Text style={[styles.profileDisplayChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{option}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                      <View style={styles.profileDisplayGroup}>
                        <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Regional formats</Text>
                        <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                          {dateFormatPreference} · {showWeekday ? "weekday on" : "weekday off"} · {timeFormatPreference}
                        </Text>
                        <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                          {clockDisplayStyle}{clockDisplayStyle === "Analog" && showDigitalTimeWithAnalog ? " + digital" : ""} · {temperatureUnitPreference} · {cardOutlineStyle} outlines
                        </Text>
                        <TouchableOpacity
                          activeOpacity={0.82}
                          onPress={() => {
                            setShowProfileMenu(false);
                            router.push({ pathname: "/settings", params: { section: "regionalFormats" } } as never);
                          }}
                          accessibilityRole="button"
                          accessibilityLabel="View regional format preferences"
                          accessibilityHint={screenReaderHints ? "Opens Settings to adjust date, time, clock and unit display." : undefined}
                          style={[styles.profileDisplayChip, styles.profileDisplayActionChip, isDay && styles.daySoftOption]}
                        >
                          <IconSymbol name="settings" color={isDay ? "#445E93" : "#A8B7DA"} size={14} />
                          <Text style={[styles.profileDisplayChipText, isDay && styles.dayTitle]}>View preferences</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                ) : null}
                {profileMenuPanel === "notifications" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("main")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to profile menu">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Notifications</Text>
                    </TouchableOpacity>
                    {[
                      { title: "Meetup reminders", copy: "Gentle reminders before plans you join." },
                      { title: "Safety alerts", copy: "Updates about changes, reports, or event safety notes." },
                      { title: "Chat notifications", copy: "Messages from meetup group chats." },
                      { title: "Quiet notifications", copy: "Keep alerts lower-pressure and less attention-heavy." },
                    ].map((item) => (
                      <View key={item.title} style={[styles.profileMenuGuideRow, isDay && styles.daySoftOption]}>
                        <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>{item.title}</Text>
                        <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>{item.copy}</Text>
                      </View>
                    ))}
                    <TouchableOpacity
                      activeOpacity={0.82}
                      onPress={() => {
                        setShowProfileMenu(false);
                        router.push("/settings" as any);
                      }}
                      style={[styles.profileLayoutOption, styles.profileMenuPrimaryAction]}
                      accessibilityRole="button"
                      accessibilityLabel="Manage notifications in Settings and Privacy"
                    >
                      <View style={styles.profileLayoutBody}>
                        <Text style={[styles.profileLayoutTitle, styles.profileLayoutTextActive]}>Manage in Settings & Privacy</Text>
                        <Text style={[styles.profileLayoutCopy, styles.profileLayoutTextActive]}>Use Advanced settings for notification switches.</Text>
                      </View>
                      <IconSymbol name="chevron.right" color="#FFFFFF" size={20} />
                    </TouchableOpacity>
                  </>
                ) : null}
                {profileMenuPanel === "blockReport" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("main")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to profile menu">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Block & report</Text>
                    </TouchableOpacity>
                    <View style={[styles.profileMenuInfoCard, isDay && styles.daySoftOption]}>
                      <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>Safety first</Text>
                      <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                        In the NSN pilot these are local mock actions. Account-based blocking and reports will connect when authentication exists.
                      </Text>
                    </View>
                    {[
                      { title: "Block a member", copy: "Hide future contact from someone once accounts are enabled.", alert: "Blocking will connect to account profiles after the NSN pilot." },
                      { title: "Report unsafe behaviour", copy: "Flag pushy, unsafe, or unwanted contact for review.", alert: "Reporting will connect to moderation tools after the NSN pilot." },
                      { title: "View blocked people", copy: "Review and unblock people later.", alert: "Your blocked list will appear here once accounts exist." },
                    ].map((item) => (
                      <TouchableOpacity
                        key={item.title}
                        activeOpacity={0.78}
                        onPress={() => Alert.alert(item.title, item.alert)}
                        style={styles.profileMenuItem}
                        accessibilityRole="button"
                        accessibilityLabel={item.title}
                      >
                        <IconSymbol name="flag" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                        <View style={styles.profileMenuItemBody}>
                          <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>{item.title}</Text>
                          <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>{item.copy}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    <View style={[styles.profileMenuInfoCard, styles.profileMenuWarningCard]}>
                      <Text style={[styles.profileLayoutTitle, styles.profileMenuWarningTitle]}>Immediate danger</Text>
                      <Text style={[styles.profileLayoutCopy, styles.profileMenuWarningCopy]}>If you feel unsafe, leave the situation and contact local emergency services.</Text>
                    </View>
                  </>
                ) : null}
                {profileMenuPanel === "layout" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("main")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to profile menu">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Profile layout</Text>
                    </TouchableOpacity>
                    <View style={styles.profileLayoutStack}>
                      {profileShortcutLayoutOptions.map((option) => {
                        const active = profileShortcutLayout === option;
                        const label = option === "Clean" ? "Simple layout" : "Detailed layout";
                        const optionCopy = option === "Clean" ? "Lighter profile with the preview and key edit controls." : "Full profile with privacy, comfort, trust, and shortcuts.";

                        return (
                          <TouchableOpacity
                            key={option}
                            activeOpacity={0.82}
                            onPress={() => updateProfileShortcutLayout(option)}
                            style={[styles.profileLayoutOption, isDay && styles.daySoftOption, active && styles.profileLayoutOptionActive]}
                            accessibilityRole="button"
                            accessibilityState={{ selected: active }}
                          >
                            <View style={styles.profileLayoutBody}>
                              <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{label}</Text>
                              <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText, active && styles.profileLayoutTextActive]}>{optionCopy}</Text>
                            </View>
                            <View style={styles.profileLayoutCheck}>{active ? <IconSymbol name="checkmark" color="#FFFFFF" size={18} /> : null}</View>
                          </TouchableOpacity>
                        );
                      })}
                      <View
                        style={[styles.profileLayoutOption, styles.profileMenuDisabledOption, isDay && styles.daySoftOption]}
                        accessibilityRole="text"
                        accessibilityState={{ disabled: true }}
                        accessibilityLabel="Full-width profile layout coming soon"
                      >
                        <View style={styles.profileLayoutBody}>
                          <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>Full-width</Text>
                          <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>Coming soon for larger dashboards and external displays.</Text>
                        </View>
                        <Text style={[styles.profileMenuStatusBadge, styles.profileMenuComingSoonBadge]}>Coming soon</Text>
                      </View>
                    </View>
                  </>
                ) : null}
                {profileMenuPanel === "width" ? (
                  <>
                    <TouchableOpacity activeOpacity={0.78} onPress={() => setProfileMenuPanel("main")} style={styles.profileMenuBack} accessibilityRole="button" accessibilityLabel="Back to profile menu">
                      <IconSymbol name="chevron.left" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Width settings</Text>
                    </TouchableOpacity>
                    <View style={styles.profileLayoutStack}>
                      {profileWidthPreferenceOptions.map((option) => {
                        const active = profileWidthPreference === option;
                        const label = option === "Contained" ? "Contained width" : "Wide width";
                        const optionCopy = option === "Contained" ? "Keep cards near the center." : "Use the wider dashboard-style layout.";

                        return (
                          <TouchableOpacity
                            key={option}
                            activeOpacity={0.82}
                            onPress={() => updateProfileWidthPreference(option)}
                            style={[styles.profileLayoutOption, isDay && styles.daySoftOption, active && styles.profileLayoutOptionActive]}
                            accessibilityRole="button"
                            accessibilityState={{ selected: active }}
                          >
                            <View style={styles.profileLayoutBody}>
                              <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{label}</Text>
                              <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText, active && styles.profileLayoutTextActive]}>{optionCopy}</Text>
                            </View>
                            <View style={styles.profileLayoutCheck}>{active ? <IconSymbol name="checkmark" color="#FFFFFF" size={18} /> : null}</View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                ) : null}
                {false ? (
                  <>
                <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>User menu</Text>
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => {
                    setShowProfileMenu(false);
                    setIsEditingInterests(true);
                  }}
                  style={styles.profileMenuItem}
                  accessibilityRole="button"
                  accessibilityLabel="Edit menu"
                >
                  <IconSymbol name="edit" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                  <View style={styles.profileMenuItemBody}>
                    <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Edit menu</Text>
                    <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>Name, photo, interests, and vibes.</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => {
                    setShowProfileMenu(false);
                    router.push("/settings" as any);
                  }}
                  style={styles.profileMenuItem}
                  accessibilityRole="button"
                  accessibilityLabel="Privacy guide"
                >
                  <IconSymbol name="visibility" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                  <View style={styles.profileMenuItemBody}>
                    <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Privacy guide</Text>
                    <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>Review blur, private profile, and preview controls.</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.profileMenuDivider, isDay && styles.dayRowBorder]} />
                <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>User preferences</Text>
                {[
                  { icon: "transport" as const, label: getRowLabel("transportation"), route: "/transportation-preference" },
                  { icon: "contact" as const, label: getRowLabel("contactPreference"), route: "/contact-preference" },
                  { icon: "explore" as const, label: getRowLabel("locationPreference"), route: "/location-preference" },
                  { icon: "food" as const, label: getRowLabel("foodPreferences"), route: "/food-preferences" },
                  { icon: "interests" as const, label: getRowLabel("hobbiesInterests"), route: "/hobbies-interests" },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.route}
                    activeOpacity={0.78}
                    onPress={() => {
                      setShowProfileMenu(false);
                      if (shouldOpenFullPreferenceView && item.route === "/transportation-preference") {
                        openFullPreferenceView("transport");
                        return;
                      }
                      if (shouldOpenFullPreferenceView && item.route === "/contact-preference") {
                        openFullPreferenceView("contact");
                        return;
                      }
                      if (shouldOpenFullPreferenceView && item.route === "/location-preference") {
                        openFullPreferenceView("location");
                        return;
                      }
                      if (shouldOpenFullPreferenceView && item.route === "/food-preferences") {
                        openFullPreferenceView("food");
                        return;
                      }
                      if (shouldOpenFullPreferenceView && item.route === "/hobbies-interests") {
                        openFullPreferenceView("interests");
                        return;
                      }

                      router.push(item.route as any);
                    }}
                    style={styles.profileMenuItem}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                  >
                    <IconSymbol name={item.icon} color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                    <View style={styles.profileMenuItemBody}>
                      <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>{item.label}</Text>
                    </View>
                    <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                  </TouchableOpacity>
                ))}
                <View style={[styles.profileMenuDivider, isDay && styles.dayRowBorder]} />
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => {
                    setShowProfileMenu(false);
                    router.push("/notifications" as any);
                  }}
                  style={styles.profileMenuItem}
                  accessibilityRole="button"
                  accessibilityLabel="Notifications"
                >
                  <IconSymbol name="bell" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                  <View style={styles.profileMenuItemBody}>
                    <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Notifications</Text>
                    <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>Manage event and safety alerts.</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => {
                    setShowProfileMenu(false);
                    Alert.alert("Block & report", "Block and report tools will connect to accounts after the NSN pilot.");
                  }}
                  style={styles.profileMenuItem}
                  accessibilityRole="button"
                  accessibilityLabel="Block and report"
                >
                  <IconSymbol name="flag" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                  <View style={styles.profileMenuItemBody}>
                    <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Block & report</Text>
                    <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>For unsafe, pushy, or unwanted contact.</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.profileMenuDivider, isDay && styles.dayRowBorder]} />
                <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>Profile layout</Text>
                <View style={styles.profileLayoutStack}>
                  {profileShortcutLayoutOptions.map((option) => {
                    const active = profileShortcutLayout === option;
                    const label = option === "Clean" ? "Simple layout" : "Detailed layout";
                    const optionCopy =
                      option === "Clean"
                        ? "Lighter profile with the preview and key edit controls."
                        : "Full profile with privacy, comfort, trust, and shortcuts.";

                    return (
                      <TouchableOpacity
                        key={option}
                        activeOpacity={0.82}
                        onPress={() => updateProfileShortcutLayout(option)}
                        style={[styles.profileLayoutOption, isDay && styles.daySoftOption, active && styles.profileLayoutOptionActive]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <View style={styles.profileLayoutBody}>
                          <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{label}</Text>
                          <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText, active && styles.profileLayoutTextActive]}>{optionCopy}</Text>
                        </View>
                        <Text style={[styles.profileLayoutCheck, active && styles.profileLayoutTextActive]}>{active ? "✓" : ""}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={[styles.profileMenuDivider, isDay && styles.dayRowBorder]} />
                <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>Width settings</Text>
                <View style={[styles.profileLayoutStack, styles.profileWidthStack]}>
                  {profileWidthPreferenceOptions.map((option) => {
                    const active = profileWidthPreference === option;
                    const label = option === "Contained" ? "Contained width" : "Wide width";
                    const optionCopy = option === "Contained" ? "Keep cards near the center." : "Use the wider dashboard-style layout.";

                    return (
                      <TouchableOpacity
                        key={option}
                        activeOpacity={0.82}
                        onPress={() => updateProfileWidthPreference(option)}
                        style={[styles.profileLayoutOption, isDay && styles.daySoftOption, active && styles.profileLayoutOptionActive]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <View style={styles.profileLayoutBody}>
                          <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{label}</Text>
                          <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText, active && styles.profileLayoutTextActive]}>{optionCopy}</Text>
                        </View>
                        <Text style={[styles.profileLayoutCheck, active && styles.profileLayoutTextActive]}>{active ? "✓" : ""}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={[styles.profileMenuDivider, isDay && styles.dayRowBorder]} />
                <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>Settings & Privacy</Text>
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => {
                    setShowProfileMenu(false);
                    router.push("/settings" as any);
                  }}
                  style={styles.profileMenuItem}
                  accessibilityRole="button"
                  accessibilityLabel={getRowLabel("settings")}
                >
                  <IconSymbol name="settings" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                  <View style={styles.profileMenuItemBody}>
                    <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>{getRowLabel("settings")}</Text>
                    <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>General settings, privacy, and account controls.</Text>
                  </View>
                  <IconSymbol name="chevron.right" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                </TouchableOpacity>
                <Text style={[styles.profileMenuTitle, isDay && styles.dayMutedText]}>General settings</Text>
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={resetProfileDefaults}
                  style={styles.profileMenuItem}
                  accessibilityRole="button"
                  accessibilityLabel="Reset to defaults"
                >
                  <IconSymbol name="settings" color={isDay ? "#53677A" : nsnColors.muted} size={20} />
                  <View style={styles.profileMenuItemBody}>
                    <Text style={[styles.profileMenuText, isDay && styles.dayTitle]}>Reset to defaults</Text>
                    <Text style={[styles.profileMenuDescription, isDay && styles.dayMutedText]}>Restore NSN privacy and comfort defaults.</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.profileMenuDivider, styles.profileMenuDestructiveDivider]} />
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={showDeleteAccountNotice}
                  style={[styles.profileMenuItem, styles.profileMenuDestructiveItem]}
                  accessibilityRole="button"
                  accessibilityLabel="Delete account"
                >
                  <IconSymbol name="flag" color="#E23D5A" size={20} />
                  <View style={styles.profileMenuItemBody}>
                    <Text style={[styles.profileMenuText, styles.profileMenuDestructiveText]}>Delete account</Text>
                    <Text style={[styles.profileMenuDescription, styles.profileMenuDestructiveDescription]}>Permanent account deletion, once accounts exist.</Text>
                  </View>
                </TouchableOpacity>
                  </>
                ) : null}
              </ScrollView>
                  </View>
                </Pressable>
              </Pressable>
            </Modal>
          ) : null}
        </View>

        <View style={[styles.alphaGuideCard, isDay && styles.dayCard, clearBorders && styles.clearBorderCard]}>
          <Text style={[styles.alphaGuideLabel, isDay && styles.dayAccentText, isRtl && styles.rtlText]}>Alpha testing</Text>
          <Text style={[styles.alphaGuideTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>What to try on Profile</Text>
          <Text style={[styles.alphaGuideCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
            Adjust your comfort profile, preview visibility, and local area. Verification, trust, account deletion, block, and report controls are prototype-only until real account systems exist.
          </Text>
        </View>

        {false ? (
        <View style={[styles.profileDisplayCard, isDay && styles.dayCard, clearBorders && styles.clearBorderCard]}>
          <View style={[styles.cardTitleRow, isRtl && styles.rtlRow]}>
            <View style={[styles.profileDisplayTitleRow, isRtl && styles.rtlRow]}>
              <IconSymbol name="visibility" color={isDay ? "#445E93" : "#C7B07A"} size={20} />
              <View style={styles.profileLayoutBody}>
                <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Display & layout</Text>
                <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  View Preferences for Home cards, event previews, and header controls.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.profileDisplayGrid}>
            <View style={styles.profileDisplayGroup}>
              <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Event layout</Text>
              <View style={[styles.profileDisplayChipRow, isRtl && styles.rtlRow]}>
                {profileEventLayoutOptions.map((option) => {
                  const active = homeEventLayout === option;

                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.82}
                      onPress={() => updateProfileDisplayPreference({ homeEventLayout: option })}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`${option} event layout`}
                      style={[styles.profileDisplayChip, isDay && styles.daySoftOption, active && styles.profileDisplayChipActive]}
                    >
                      <IconSymbol name={option === "Map" ? "location" : "calendar"} color={active ? "#FFFFFF" : isDay ? "#445E93" : "#C7B07A"} size={15} />
                      <Text style={[styles.profileDisplayChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.profileDisplayGroup}>
              <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Event visuals</Text>
              <View style={[styles.profileDisplayChipRow, isRtl && styles.rtlRow]}>
                {profileEventVisualModeOptions.map((option) => {
                  const active = homeEventVisualMode === option;

                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.82}
                      onPress={() => updateProfileDisplayPreference({ homeEventVisualMode: option })}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`${option} event display`}
                      style={[styles.profileDisplayChip, isDay && styles.daySoftOption, active && styles.profileDisplayChipActive]}
                    >
                      <IconSymbol name={option === "Preview image" ? "preview" : "experience"} color={active ? "#FFFFFF" : isDay ? "#445E93" : "#C7B07A"} size={15} />
                      <Text style={[styles.profileDisplayChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.profileDisplayGroup}>
              <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Home density</Text>
              <View style={[styles.profileDisplayChipRow, isRtl && styles.rtlRow]}>
                {profileHomeLayoutDensityOptions.map((option) => {
                  const active = homeLayoutDensity === option;

                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.82}
                      onPress={() => updateProfileDisplayPreference({ homeLayoutDensity: option })}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`${option} Home density`}
                      style={[styles.profileDisplayChip, isDay && styles.daySoftOption, active && styles.profileDisplayChipActive]}
                    >
                      <Text style={[styles.profileDisplayChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.profileDisplayGroup}>
              <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Header controls</Text>
              <View style={[styles.profileDisplayChipRow, isRtl && styles.rtlRow]}>
                {profileHeaderControlsDensityOptions.map((option) => {
                  const active = homeHeaderControlsDensity === option;

                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.82}
                      onPress={() => updateProfileDisplayPreference({ homeHeaderControlsDensity: option })}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`${option} header controls`}
                      style={[styles.profileDisplayChip, isDay && styles.daySoftOption, active && styles.profileDisplayChipActive]}
                    >
                      <IconSymbol name="settings" color={active ? "#FFFFFF" : isDay ? "#445E93" : "#C7B07A"} size={15} />
                      <Text style={[styles.profileDisplayChipText, isDay && styles.dayTitle, active && styles.profileLayoutTextActive]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.profileDisplayGroup}>
              <Text style={[styles.profileDisplayGroupLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Regional formats</Text>
              <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                {dateFormatPreference} · {timeFormatPreference} · {temperatureUnitPreference}
              </Text>
              <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                {dayNightModePreference} · {cardOutlineStyle} outlines
              </Text>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => router.push({ pathname: "/settings", params: { section: "regionalFormats" } } as never)}
                accessibilityRole="button"
                accessibilityLabel="View regional format preferences"
                accessibilityHint={screenReaderHints ? "Opens Settings to adjust date, time, clock and unit display." : undefined}
                style={[styles.profileDisplayChip, styles.profileDisplayActionChip, isDay && styles.daySoftOption]}
              >
                <IconSymbol name="settings" color={isDay ? "#445E93" : "#A8B7DA"} size={14} />
                <Text style={[styles.profileDisplayChipText, isDay && styles.dayTitle]}>View Preferences</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        ) : null}

        <View
          style={[
            styles.profileHeader,
            !isCleanProfile && styles.profileHeaderDetailed,
            !isCleanProfile && isDay && styles.dayCard,
            !isCleanProfile && softSurfaces && styles.softSurfaceCard,
            !isCleanProfile && clearBorders && styles.clearBorderCard,
            isSoftHelloTheme && styles.softHelloProfileHeader,
            { maxWidth: profileSectionMaxWidth },
          ]}
        >
          {accountPaused ? (
            <View style={[styles.pausedProfileBanner, isDay && styles.daySoftOption, clearBorders && styles.clearBorderCard]}>
              <Text style={[styles.pausedProfileTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Profile paused</Text>
              <Text style={[styles.pausedProfileCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                You are taking a break from NSN. Your settings are saved, and you can reactivate from Settings & Privacy.
              </Text>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => saveSoftHelloMvpState({ accountPaused: false })}
                style={styles.reviewSettingsButton}
                accessibilityRole="button"
                accessibilityLabel="Reactivate profile"
              >
                <Text style={styles.reviewSettingsText}>Reactivate profile</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={handleAvatarPress} 
            style={styles.avatarRing}
          
            accessibilityRole="button"
            accessibilityLabel={
              profilePhotoUri
                ? profileCopy.editProfilePhotoLabel
                : profileCopy.addProfilePhotoLabel
            }
            accessibilityHint={profileCopy.profilePhotoOptionsHint}
          >
            {profilePhotoUri ? (
              <Image
                source={{ uri: profilePhotoUri }}
                style={styles.avatarImage}
                blurRadius={blurProfilePhoto ? getBlurRadius(getEffectiveBlurLevel(comfortMode, blurLevel, warmUpLowerBlur)) : 0}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleAvatarPress} 
            style={[styles.photoButton, isDay && styles.dayPhotoButton]} 
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={profilePhotoUri ? profileCopy.editProfilePhotoLabel : profileCopy.addProfilePhotoLabel}
          >
            <Text style={[styles.photoButtonText, isDay && styles.dayPhotoButtonText]}>
              {profilePhotoUri ? copy.editPhoto : copy.addPhoto}
            </Text>
          </TouchableOpacity>
                
          {showPhotoMenu && (
            <View style={[styles.photoMenu, isDay && styles.dayCard]}>
          <TouchableOpacity
            style={styles.photoMenuItem}
            onPress={() => {
            setShowPhotoMenu(false);
            pickProfilePhoto();
          }}
    >
      <Text style={[styles.photoMenuText, isDay && styles.dayTitle]}>
        {profilePhotoUri ? copy.changePhoto : copy.choosePhoto}
      </Text>
    </TouchableOpacity>

    {profilePhotoUri && (
      <TouchableOpacity
        style={styles.photoMenuItem}
        onPress={() => {
          saveProfilePhotoPreview(null);
          setShowPhotoMenu(false);
        }}
      >
        <Text style={styles.photoMenuDeleteText}>{copy.removePhoto}</Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={styles.photoMenuItem}
      onPress={() => setShowPhotoMenu(false)}
    >
      <Text style={[styles.photoMenuText, isDay && styles.dayTitle]}>{copy.cancel}</Text>
    </TouchableOpacity>
  </View>
)}
          <TouchableOpacity
            {...photoDropZoneProps}
            activeOpacity={0.82}
            onPress={pickProfilePhoto}
            style={[styles.photoDropZone, isDay && styles.daySoftOption]}
            accessibilityRole="button"
            accessibilityLabel="Choose or drop a profile photo"
            accessibilityHint="Tap to choose a photo. On web, you can also drag and drop an image here."
          >
            <IconSymbol name="add" color={isDay ? "#445E93" : "#C7B07A"} size={18} />
            <View style={styles.photoDropZoneCopy}>
              <Text style={[styles.photoDropZoneTitle, isDay && styles.dayTitle]}>Profile photo preview</Text>
              <Text style={[styles.photoDropZoneText, isDay && styles.dayMutedText]}>
                Drag and drop a photo, or tap to choose one.
              </Text>
              <Text style={[styles.photoDropZoneNote, isDay && styles.dayMutedText]}>
                Preview only - no photo is uploaded yet.
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.nameRow}>
            {isEditingName ? (
              <TextInput
                value={draftName}
                onChangeText={(value) => {
                  setDraftName(value);
                  if (nameError) setNameError("");
                }}
                autoFocus
                style={[styles.nameInput, isDay && styles.dayTitle]}
                selectionColor="#7786FF"
                onSubmitEditing={saveName}
              />
            ) : (
              <Text style={[styles.name, isDay && styles.dayTitle]}>
                {[displayName, middleName, lastName].filter(Boolean).join(" ")}
              </Text>
            )}

            <TouchableOpacity
              onPress={toggleNameEditing}
              accessibilityRole="button"
              accessibilityLabel={isEditingName ? profileCopy.saveName : profileCopy.editName}
            >
              {isEditingName ? (
                <Text style={styles.editText}>{copy.done}</Text>
              ) : showNameSaved ? (
                <Text style={styles.editText}>{copy.saved}</Text>
              ) : (
                <IconSymbol name="edit" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
              )}
            </TouchableOpacity>
          </View>
          {nameError ? <Text style={[styles.inlineMessage, styles.identityMessage, isDay && styles.dayMessage]}>{nameError}</Text> : null}
          {!isCleanProfile ? (
          <View style={styles.inlineEditRow}>
            {isEditingLastName ? (
              <>
                <TextInput value={draftMiddleName} onChangeText={setDraftMiddleName} autoFocus placeholder="Middle name" placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft} style={[styles.lastNameInput, isDay && styles.dayInput, isRtl && styles.rtlInput]} selectionColor="#7786FF" />
                <TextInput value={draftLastName} onChangeText={setDraftLastName} placeholder="Last name" placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft} style={[styles.lastNameInput, isDay && styles.dayInput, isRtl && styles.rtlInput]} selectionColor="#7786FF" onSubmitEditing={saveLastName} />
              </>
            ) : (
              <Text style={[styles.identitySummaryText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                {middleName || lastName ? "Optional name parts saved" : "Middle/last name not set"}
              </Text>
            )}
            <Text style={styles.editText} onPress={toggleLastNameEditing}>
              {showLastNameSaved ? copy.saved : isEditingLastName ? copy.done : middleName || lastName ? copy.edit : "Add"}
            </Text>
          </View>
          ) : null}
          {!isCleanProfile ? (
          <View style={styles.nameToggleRow}>
            {middleName ? (
              <TouchableOpacity activeOpacity={0.82} onPress={() => saveSoftHelloMvpState({ middleNameDisplay: middleNameDisplay === "Hidden" ? "Initial" : middleNameDisplay === "Initial" ? "Full" : "Hidden" })} style={[styles.nameVisibilityToggle, isDay && styles.daySoftOption, middleNameDisplay !== "Hidden" && styles.localAreaVisibilityToggleActive]} accessibilityRole="button">
                <Text style={[styles.localAreaVisibilityText, isDay && styles.dayTitle, middleNameDisplay !== "Hidden" && styles.localAreaVisibilityTextActive]}>Middle {middleNameDisplay === "Hidden" ? "hidden" : middleNameDisplay === "Initial" ? "initial" : "shown"}</Text>
              </TouchableOpacity>
            ) : null}
            {lastName ? (
              <TouchableOpacity activeOpacity={0.82} onPress={() => saveSoftHelloMvpState({ lastNameDisplay: lastNameDisplay === "Hidden" ? "Initial" : lastNameDisplay === "Initial" ? "Full" : "Hidden" })} style={[styles.nameVisibilityToggle, isDay && styles.daySoftOption, lastNameDisplay !== "Hidden" && styles.localAreaVisibilityToggleActive]} accessibilityRole="button">
                <Text style={[styles.localAreaVisibilityText, isDay && styles.dayTitle, lastNameDisplay !== "Hidden" && styles.localAreaVisibilityTextActive]}>Last {lastNameDisplay === "Hidden" ? "hidden" : lastNameDisplay === "Initial" ? "initial" : "shown"}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          ) : null}
          {!isCleanProfile ? (
          <View style={[styles.profileBasicsCard, styles.ageEditorCard, isDay && styles.dayVisibilityModeCard]}>
            <View style={[styles.cardTitleRow, isRtl && styles.rtlRow]}>
              <View style={styles.profileLayoutBody}>
                <Text style={[styles.visibilityModeTitle, styles.leftAlignedTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Age & group preferences</Text>
                <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  {age ? `${age} · prefers ${preferredAgeMin}-${preferredAgeMax}` : `Prefers ${preferredAgeMin}-${preferredAgeMax}`}
                  {gender !== "Not specified" ? ` · ${gender}` : ""}
                </Text>
              </View>
              <Text style={styles.editText} onPress={toggleAgeEditing}>{showAgeSaved ? copy.saved : isEditingAge ? copy.done : copy.edit}</Text>
            </View>
            {isEditingAge ? (
              <>
                <View style={styles.rangeRow}>
                  <TextInput value={draftAge} onChangeText={(value) => setDraftAge(value.replace(/[^0-9]/g, "").slice(0, 2))} keyboardType="number-pad" placeholder="Age" placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft} style={[styles.rangeInput, isDay && styles.dayInput]} />
                  <TextInput value={draftPreferredAgeMin} onChangeText={(value) => setDraftPreferredAgeMin(value.replace(/[^0-9]/g, "").slice(0, 2))} keyboardType="number-pad" placeholder="Min" placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft} style={[styles.rangeInput, isDay && styles.dayInput]} />
                  <TextInput value={draftPreferredAgeMax} onChangeText={(value) => setDraftPreferredAgeMax(value.replace(/[^0-9]/g, "").slice(0, 2))} keyboardType="number-pad" placeholder="Max" placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft} style={[styles.rangeInput, isDay && styles.dayInput]} />
                </View>
                <View style={styles.preferenceGrid}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity key={option} activeOpacity={0.78} onPress={() => setDraftGender(option)} style={[styles.genderChip, isDay && styles.dayCard, draftGender === option && styles.interestChipActive]} accessibilityRole="radio" accessibilityState={{ checked: draftGender === option }}>
                      <Text style={[styles.genderChipText, isDay && styles.dayTitle]}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            ) : null}
            <View style={styles.nameToggleRow}>
              <TouchableOpacity activeOpacity={0.82} onPress={() => saveSoftHelloMvpState({ showAge: !showAge })} style={[styles.nameVisibilityToggle, isDay && styles.daySoftOption, showAge && styles.localAreaVisibilityToggleActive]} accessibilityRole="switch" accessibilityState={{ checked: showAge }}>
                <Text style={[styles.localAreaVisibilityText, isDay && styles.dayTitle, showAge && styles.localAreaVisibilityTextActive]}>{showAge ? "Age shown" : "Age hidden"}</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.82} onPress={() => saveSoftHelloMvpState({ showPreferredAgeRange: !showPreferredAgeRange })} style={[styles.nameVisibilityToggle, isDay && styles.daySoftOption, showPreferredAgeRange && styles.localAreaVisibilityToggleActive]} accessibilityRole="switch" accessibilityState={{ checked: showPreferredAgeRange }}>
                <Text style={[styles.localAreaVisibilityText, isDay && styles.dayTitle, showPreferredAgeRange && styles.localAreaVisibilityTextActive]}>{showPreferredAgeRange ? "Range shown" : "Range hidden"}</Text>
              </TouchableOpacity>
              {gender !== "Not specified" ? (
                <TouchableOpacity activeOpacity={0.82} onPress={() => saveSoftHelloMvpState({ showGender: !showGender })} style={[styles.nameVisibilityToggle, isDay && styles.daySoftOption, showGender && styles.localAreaVisibilityToggleActive]} accessibilityRole="switch" accessibilityState={{ checked: showGender }}>
                  <Text style={[styles.localAreaVisibilityText, isDay && styles.dayTitle, showGender && styles.localAreaVisibilityTextActive]}>{showGender ? "Gender shown" : "Gender hidden"}</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          ) : null}
          {false ? (
          <View style={styles.identitySummary}>
            <View style={[styles.identitySummaryRow, isRtl && styles.rtlRow]}>
              <IconSymbol name="location" color={isDay ? "#53677A" : nsnColors.muted} size={15} />
              <Text style={[styles.identitySummaryText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{suburb || profileCopy.notSet}</Text>
            </View>
            <Text style={[styles.identitySummaryText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
              {age ? `${age}` : ageConfirmed ? "18+" : profileVerificationCopy.ageMissing} · {hobbiesInterests.slice(0, 4).join(", ") || "Interests not set"}
            </Text>
            <Text style={[styles.identitySummaryText, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Comfort: {comfortSummary}</Text>
          </View>
          ) : null}
          <View style={[styles.profileCardsGrid, { maxWidth: profileSectionMaxWidth }, isWideLayout && styles.profileCardsGridWide]}>
          <View
            style={[
              styles.profilePreviewBlock,
              {
                maxWidth: profileTopCardMaxWidth,
                borderRadius: brandTheme.radius.card,
                padding: brandTheme.spacing.compactPadding,
              },
              isDay && styles.dayVisibilityModeCard,
            ]}
          >
            <Text style={[styles.visibilityModeTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>How others see me</Text>
            <ProfileVisibilityPreview
              displayName={displayName}
              middleName={middleName}
              lastName={lastName}
              suburb={suburb}
              age={age}
              preferredAgeMin={preferredAgeMin}
              preferredAgeMax={preferredAgeMax}
              gender={gender}
              middleNameDisplay={middleNameDisplay}
              lastNameDisplay={lastNameDisplay}
              interests={hobbiesInterests}
              comfortPreferences={comfortPreferences}
              contactPreferences={contactPreferences}
              socialEnergyPreference={socialEnergyPreference}
              communicationPreferences={communicationPreferences}
              groupSizePreference={groupSizePreference}
              photoRecordingComfortPreferences={photoRecordingComfortPreferences}
              verifiedButPrivate={verifiedButPrivate}
              comfortMode={comfortMode}
              profilePhotoUri={profilePhotoUri}
              privateProfile={privateProfile}
              blurProfilePhoto={blurProfilePhoto}
              blurLevel={blurLevel}
              warmUpLowerBlur={warmUpLowerBlur}
              showSuburbArea={showSuburbArea}
              showMiddleName={showMiddleName}
              showLastName={showLastName}
              showAge={showAge}
              showPreferredAgeRange={showPreferredAgeRange}
              showGender={showGender}
              showInterests={showInterests}
              showComfortPreferences={showComfortPreferences}
              minimalProfileView={minimalProfileView}
              aboutMe={aboutMe}
              showAboutMe={showAboutInPreview}
              vibes={selectedVibes.map((vibe) => vibeCopy[vibe] ?? vibe)}
              showVibes={showVibesInPreview}
              isDay={isDay}
            />
          </View>
          <View style={[styles.profileControlsColumn, { maxWidth: profileTopCardMaxWidth }]}>
          <View
            style={[
              styles.visibilityModeCard,
              {
                maxWidth: profileTopCardMaxWidth,
                borderRadius: brandTheme.radius.card,
                padding: brandTheme.spacing.compactPadding,
              },
              isDay && styles.dayVisibilityModeCard,
            ]}
          >
            <Text style={[styles.visibilityModeTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{visibilityCopy.title}</Text>
            <View style={[styles.visibilityModeSegmented, isDay && styles.dayVisibilityModeSegmented, isRtl && styles.rtlRow]}>
              {([
                { value: "Comfort Mode" as const, label: visibilityCopy.comfortMode },
                { value: "Warm Up Mode" as const, label: "Warm Up Mode" },
                { value: "Open Mode" as const, label: visibilityCopy.openMode },
              ]).map((option) => {
                const active = comfortMode === option.value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                    accessibilityState={{ selected: active }}
                    activeOpacity={0.82}
                    onPress={() => updateComfortMode(option.value)}
                    style={[
                      styles.visibilityModeOption,
                      isDay && styles.dayVisibilityModeOption,
                      active && styles.visibilityModeOptionActive,
                      isDay && active && styles.dayVisibilityModeOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.visibilityModeText,
                        isDay && styles.dayMutedText,
                        active && styles.visibilityModeTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.visibilityModeCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{visibilityModeCopy}</Text>
            {comfortMode === "Warm Up Mode" ? (
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => updateWarmUpLowerBlur(!warmUpLowerBlur)}
                style={[styles.warmUpBlurOption, isDay && styles.daySoftOption, warmUpLowerBlur && styles.warmUpBlurOptionActive]}
                accessibilityRole="switch"
                accessibilityState={{ checked: warmUpLowerBlur }}
              >
                <View style={styles.profileLayoutBody}>
                  <Text style={[styles.profileLayoutTitle, isDay && styles.dayTitle]}>Lower blur in Warm Up</Text>
                  <Text style={[styles.profileLayoutCopy, isDay && styles.dayMutedText]}>
                    {warmUpLowerBlur ? "Using a softer blur for partial visibility." : "Keeping your selected blur level."}
                  </Text>
                </View>
                <View style={styles.profileLayoutCheck}>{warmUpLowerBlur ? <IconSymbol name="checkmark" color="#FFFFFF" size={18} /> : null}</View>
              </TouchableOpacity>
            ) : null}
          </View>

          <View
            style={[
              styles.profileBasicsCard,
              {
                maxWidth: profileTopCardMaxWidth,
                borderRadius: brandTheme.radius.card,
                padding: brandTheme.spacing.compactPadding,
              },
              isDay && styles.dayVisibilityModeCard,
            ]}
          >
            <View style={[styles.cardTitleRow, isRtl && styles.rtlRow]}>
              <View style={styles.profileLayoutBody}>
                <Text style={[styles.visibilityModeTitle, styles.leftAlignedTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Local area</Text>
                <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                  {comfortMode === "Open Mode"
                    ? "Used for local events and shown when your visibility setting allows it."
                    : "Used for local matching. You control whether it appears in the preview."}
                </Text>
              </View>
              <Text style={styles.editText} onPress={toggleSuburbEditing}>
                {showSuburbSaved ? copy.saved : isEditingSuburb ? copy.done : copy.edit}
              </Text>
            </View>
            {isEditingSuburb ? (
              <LocalAreaPicker
                query={draftSuburb}
                onQueryChange={setDraftSuburb}
                onSelect={saveSuburb}
                selectedAreaId={timezone.id}
                isDay={isDay}
                isRtl={isRtl}
                autoFocus
                limit={7}
                placeholder="Search suburb or region..."
                promptCopy="Search and select a suburb, region, or locality for your profile."
              />
            ) : (
              <Text style={[styles.localAreaValue, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{suburb || "Local area not set"}</Text>
            )}
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => saveSoftHelloMvpState({ showSuburbArea: !showSuburbArea })}
              style={[styles.localAreaVisibilityToggle, isDay && styles.daySoftOption, showSuburbArea && styles.localAreaVisibilityToggleActive]}
              accessibilityRole="switch"
              accessibilityState={{ checked: showSuburbArea }}
            >
              <IconSymbol name={showSuburbArea ? "visibility" : "visibility.off"} color={showSuburbArea ? "#FFFFFF" : isDay ? "#53677A" : nsnColors.muted} size={16} />
              <Text style={[styles.localAreaVisibilityText, isDay && styles.dayTitle, showSuburbArea && styles.localAreaVisibilityTextActive]}>
                {showSuburbArea ? "Shown in preview" : "Hidden from preview"}
              </Text>
            </TouchableOpacity>
          </View>
          </View>

        </View>

        </View>

        <View style={[styles.profileSectionCard, !isCleanProfile && styles.detailedSectionCard, isWideProfile && styles.detailedSectionCardWide, isDay && styles.dayCard, softSurfaces && styles.softSurfaceCard, clearBorders && styles.clearBorderCard]}>
          <View style={[styles.cardTitleRow, isRtl && styles.rtlRow]}>
            <View style={styles.profileLayoutBody}>
              <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.about}</Text>
              <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                Describe yourself so people can get to know you a little before meeting.
              </Text>
            </View>
            <Text
              accessibilityRole="button"
              accessibilityLabel={isEditingAbout ? profileCopy.saveAbout : profileCopy.editAbout}
              style={styles.editText}
              onPress={() => {
                if (isEditingAbout) {
                  setShowSaved(true);
                  setTimeout(() => {
                    setShowSaved(false);
                  }, 1000);
                }

                setIsEditingAbout(!isEditingAbout);
              }}
            >
              {showSaved ? copy.saved : isEditingAbout ? copy.save : copy.edit}
            </Text>
          </View>
          {isEditingAbout ? (
            <TextInput
              style={[styles.aboutText, styles.aboutInput, isDay && styles.dayTitle, isRtl && styles.rtlText]}
              value={aboutMe}
              onChangeText={setAboutMe}
              autoFocus
              multiline
              selectionColor="#7786FF"
              underlineColorAndroid="transparent"
            />
          ) : (
            <Text style={[styles.aboutText, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{aboutMe}</Text>
          )}
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => setShowAboutInPreview((current) => !current)}
            style={[styles.previewVisibilityToggle, isDay && styles.daySoftOption, showAboutInPreview && styles.localAreaVisibilityToggleActive]}
            accessibilityRole="switch"
            accessibilityState={{ checked: showAboutInPreview }}
          >
            <IconSymbol name={showAboutInPreview ? "visibility" : "visibility.off"} color={showAboutInPreview ? "#FFFFFF" : isDay ? "#53677A" : nsnColors.muted} size={16} />
            <Text style={[styles.localAreaVisibilityText, isDay && styles.dayTitle, showAboutInPreview && styles.localAreaVisibilityTextActive]}>
              {showAboutInPreview ? "Shown in preview" : "Hidden from preview"}
            </Text>
          </TouchableOpacity>

          <View style={[styles.profileCardDivider, isDay && styles.dayRowBorder]} />
          <View style={[styles.cardTitleRow, isRtl && styles.rtlRow]}>
            <View style={styles.profileLayoutBody}>
              <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.myVibes}</Text>
              <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>A quick feel for your social style.</Text>
            </View>
            <Text style={styles.editText} onPress={toggleVibeEditing}>
              {showVibesSaved ? copy.saved : isEditingVibes ? copy.done : copy.edit}
            </Text>
          </View>
          <View style={[styles.vibeGrid, styles.compactGrid, isRtl && styles.rtlRow]}>
            {profileVibes.map((vibe) => {
              const selected = selectedVibes.includes(vibe);
              const vibeLabel = vibeCopy[vibe] ?? vibe;

              if (!isEditingVibes && !selected) return null;

              return (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={vibeLabel}
                  accessibilityState={{ selected }}
                  accessibilityHint={isEditingVibes ? profileCopy.selectOrDeselectHint : undefined}
                  key={vibe}
                  activeOpacity={0.75}
                  onPress={() => isEditingVibes && toggleVibe(vibe)}
                >
                  <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, isEditingVibes && !selected && styles.vibeChipMuted, isRtl && styles.rtlText]}>
                    {selected ? vibeLabel : `+ ${vibeLabel}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {vibeLimitMessage ? <Text style={[styles.inlineMessage, styles.cardInlineMessage, isDay && styles.dayMessage]}>{vibeLimitMessage}</Text> : null}
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => setShowVibesInPreview((current) => !current)}
            style={[styles.previewVisibilityToggle, isDay && styles.daySoftOption, showVibesInPreview && styles.localAreaVisibilityToggleActive]}
            accessibilityRole="switch"
            accessibilityState={{ checked: showVibesInPreview }}
          >
            <IconSymbol name={showVibesInPreview ? "visibility" : "visibility.off"} color={showVibesInPreview ? "#FFFFFF" : isDay ? "#53677A" : nsnColors.muted} size={16} />
            <Text style={[styles.localAreaVisibilityText, isDay && styles.dayTitle, showVibesInPreview && styles.localAreaVisibilityTextActive]}>
              {showVibesInPreview ? "Shown in preview" : "Hidden from preview"}
            </Text>
          </TouchableOpacity>
        </View>

        {!isCleanProfile ? (
        <View style={[styles.profileSectionCard, styles.detailedSectionCard, isWideProfile && styles.detailedSectionCardWide, isDay && styles.dayCard, softSurfaces && styles.softSurfaceCard, clearBorders && styles.clearBorderCard]}>
          <View style={[styles.cardTitleRow, isRtl && styles.rtlRow]}>
            <View style={styles.profileLayoutBody}>
              <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Interests</Text>
              <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Choose what you enjoy. This updates your profile preview.</Text>
            </View>
            <Text style={styles.editText} onPress={toggleInterestEditing}>
              {showInterestsSaved ? copy.saved : isEditingInterests ? copy.done : copy.edit}
            </Text>
          </View>
          <View style={[styles.vibeGrid, styles.compactGrid, isRtl && styles.rtlRow]}>
            {(isEditingInterests ? profileInterestOptions : hobbiesInterests).map((interest) => {
              const selected = hobbiesInterests.includes(interest);
              const interestLabel = `${profileInterestEmoji[interest] ? `${profileInterestEmoji[interest]} ` : ""}${interest}`;

              if (!isEditingInterests && !selected) return null;

              return (
                <TouchableOpacity
                  key={interest}
                  accessibilityRole="button"
                  accessibilityLabel={interest}
                  accessibilityState={{ selected }}
                  accessibilityHint={isEditingInterests ? profileCopy.selectOrDeselectHint : undefined}
                  activeOpacity={0.75}
                  onPress={() => isEditingInterests && toggleProfileInterest(interest)}
                >
                  <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, isEditingInterests && !selected && styles.vibeChipMuted, selected && isEditingInterests && styles.interestChipActive, isRtl && styles.rtlText]}>
                    {isEditingInterests && !selected ? `+ ${interestLabel}` : interestLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => saveSoftHelloMvpState({ showInterests: !showInterests })}
            style={[styles.previewVisibilityToggle, isDay && styles.daySoftOption, showInterests && styles.localAreaVisibilityToggleActive]}
            accessibilityRole="switch"
            accessibilityState={{ checked: showInterests }}
          >
            <IconSymbol name={showInterests ? "visibility" : "visibility.off"} color={showInterests ? "#FFFFFF" : isDay ? "#53677A" : nsnColors.muted} size={16} />
            <Text style={[styles.localAreaVisibilityText, isDay && styles.dayTitle, showInterests && styles.localAreaVisibilityTextActive]}>
              {showInterests ? "Shown in preview" : "Hidden from preview"}
            </Text>
          </TouchableOpacity>
          <View style={[styles.profileCardDivider, isDay && styles.dayRowBorder]} />
          <View style={[styles.cardTitleRow, isRtl && styles.rtlRow]}>
            <View style={styles.profileLayoutBody}>
              <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Comfort preferences</Text>
              <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                These help people understand your pace without oversharing.
              </Text>
            </View>
            <Text style={styles.editText} onPress={toggleComfortEditing}>
              {showComfortSaved ? copy.saved : isEditingComfort ? copy.done : copy.edit}
            </Text>
          </View>
          <View style={[styles.preferenceGrid, styles.compactGrid, isRtl && styles.rtlRow]}>
            {(isEditingComfort ? comfortOptions : comfortPreferences).map((preference) => {
              const active = draftComfortPreferences.includes(preference);
              const label = getComfortLabel(preference);
              const comfortLabel = `${comfortPreferenceEmoji[preference]} ${label}`;

              if (!isEditingComfort && !comfortPreferences.includes(preference)) return null;

              return (
                <TouchableOpacity
                  key={preference}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: active }}
                  accessibilityHint={isEditingComfort ? profileCopy.selectOrDeselectHint : undefined}
                  activeOpacity={0.78}
                  onPress={() => isEditingComfort && toggleComfortPreference(preference)}
                >
                  <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, isEditingComfort && !active && styles.vibeChipMuted, active && isEditingComfort && styles.comfortChipActive, isDay && active && isEditingComfort && styles.dayComfortChipActive, isRtl && styles.rtlText]}>
                    {isEditingComfort && !active ? `+ ${comfortLabel}` : comfortLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => saveSoftHelloMvpState({ showComfortPreferences: !showComfortPreferences })}
            style={[styles.previewVisibilityToggle, isDay && styles.daySoftOption, showComfortPreferences && styles.localAreaVisibilityToggleActive]}
            accessibilityRole="switch"
            accessibilityState={{ checked: showComfortPreferences }}
          >
            <IconSymbol name={showComfortPreferences ? "visibility" : "visibility.off"} color={showComfortPreferences ? "#FFFFFF" : isDay ? "#53677A" : nsnColors.muted} size={16} />
            <Text style={[styles.localAreaVisibilityText, isDay && styles.dayTitle, showComfortPreferences && styles.localAreaVisibilityTextActive]}>
              {showComfortPreferences ? "Shown in preview" : "Hidden from preview"}
            </Text>
          </TouchableOpacity>
        </View>
        ) : null}

        {comfortTrustSummarySection}

        {isCleanProfile ? (
          <View style={[styles.trustCard, styles.simpleTrustCard, isWideProfile && styles.detailedSectionCardWide, isDay && styles.dayCard, softSurfaces && styles.softSurfaceCard, clearBorders && styles.clearBorderCard]}>
            <View style={[styles.trustHeader, isRtl && styles.rtlRow]}>
              <Text style={[styles.sectionTitle, styles.trustTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.trustStatus}</Text>
              <Text style={[styles.trustPill, isDay && styles.dayTrustPill, canMeetInPerson(effectiveVerificationLevel) && styles.trustPillReady, isDay && canMeetInPerson(effectiveVerificationLevel) && styles.dayTrustPillReady]}>
                {getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase)}
              </Text>
            </View>
            <Text style={[styles.simpleTrustCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
              {canMeetInPerson(effectiveVerificationLevel) ? "Ready for in-person meetup safety checks." : "You can browse and prepare. In-person meetups need Real Person Verified status."}
            </Text>
            <View style={styles.verificationSteps}>
              {verificationLevels.map((level) => (
                <View key={level} style={[styles.verificationStep, isDay && styles.dayVerificationStep, level === effectiveVerificationLevel && styles.verificationStepActive, isDay && level === effectiveVerificationLevel && styles.dayVerificationStepActive]}>
                  <Text style={[styles.verificationStepText, isDay && styles.dayVerificationStepText, level === effectiveVerificationLevel && styles.verificationStepTextActive, isDay && level === effectiveVerificationLevel && styles.dayVerificationStepTextActive]}>
                    {getVerificationLevelLabel(level, appLanguageBase)}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={openVerificationReview}
              style={[styles.reviewSettingsButton, styles.simpleReviewButton, isRtl && styles.rtlRow]}
              accessibilityRole="button"
              accessibilityHint={screenReaderHints ? profileCopy.trustStatusHint : undefined}
            >
              <Text style={styles.reviewSettingsText}>{profileVerificationCopy.reviewSettings}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!isCleanProfile ? (
          <>
        <View style={[styles.profileSectionCard, styles.detailedSectionCard, isWideProfile && styles.detailedSectionCardWide, isDay && styles.dayCard, softSurfaces && styles.softSurfaceCard, clearBorders && styles.clearBorderCard]}>
          <View style={[styles.cardTitleRow, isRtl && styles.rtlRow]}>
            <View style={styles.profileLayoutBody}>
              <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Privacy & visibility</Text>
              <Text style={[styles.sectionSubtitle, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>These settings control the preview above.</Text>
            </View>
            <Text
              style={styles.editText}
              onPress={() => router.push("/settings" as any)}
              accessibilityRole="button"
              accessibilityLabel="Manage privacy and visibility"
            >
              Manage
            </Text>
          </View>
          <View style={styles.privacySummaryGrid}>
            {[
              { label: "Private profile", value: privateProfile ? "On" : "Off" },
              { label: "Blur profile photo", value: blurProfilePhoto ? `On · ${blurLevel.replace(" blur", "")}` : "Off" },
              { label: "Show suburb", value: showSuburbArea ? "On" : "Off" },
              { label: "Show interests", value: showInterests ? "On" : "Off" },
              { label: "Show comfort", value: showComfortPreferences ? "On" : "Off" },
              { label: "Minimal profile", value: minimalProfileView ? "On" : "Off" },
            ].map((item) => (
              <View key={item.label} style={[styles.privacySummaryItem, isDay && styles.daySoftOption]}>
                <Text style={[styles.privacySummaryLabel, isDay && styles.dayMutedText]}>{item.label}</Text>
                <Text style={[styles.privacySummaryValue, isDay && styles.dayTitle]}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.trustCard, styles.detailedSectionCard, isWideProfile && styles.detailedSectionCardWide, isDay && styles.dayCard, softSurfaces && styles.softSurfaceCard, clearBorders && styles.clearBorderCard]}>
          <View style={[styles.trustHeader, isRtl && styles.rtlRow]}>
            <Text style={[styles.sectionTitle, styles.trustTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.trustStatus}</Text>
            <Text style={[styles.trustPill, isDay && styles.dayTrustPill, canMeetInPerson(effectiveVerificationLevel) && styles.trustPillReady, isDay && canMeetInPerson(effectiveVerificationLevel) && styles.dayTrustPillReady]}>
              {getVerificationLevelLabel(effectiveVerificationLevel, appLanguageBase)}
            </Text>
          </View>
          <Text style={[styles.trustCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{getMeetingSafetyCopy(effectiveVerificationLevel, appLanguageBase)}</Text>
          <View style={styles.verificationSteps}>
            {verificationLevels.map((level) => (
              <View key={level} style={[styles.verificationStep, isDay && styles.dayVerificationStep, level === effectiveVerificationLevel && styles.verificationStepActive, isDay && level === effectiveVerificationLevel && styles.dayVerificationStepActive]}>
                <Text style={[styles.verificationStepText, isDay && styles.dayVerificationStepText, level === effectiveVerificationLevel && styles.verificationStepTextActive, isDay && level === effectiveVerificationLevel && styles.dayVerificationStepTextActive]}>
                  {getVerificationLevelLabel(level, appLanguageBase)}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={openVerificationReview}
            style={[styles.reviewSettingsButton, isRtl && styles.rtlRow]}
            accessibilityRole="button"
            accessibilityHint={screenReaderHints ? profileCopy.trustStatusHint : undefined}
          >
            <Text style={styles.reviewSettingsText}>{profileVerificationCopy.reviewSettings}</Text>
          </TouchableOpacity>
        </View>

          <View style={[styles.settingsList, styles.detailedSectionCard, isWideProfile && styles.detailedSectionCardWide, { borderRadius: brandTheme.radius.card }, isDay && styles.dayCard, softSurfaces && styles.softSurfaceCard, clearBorders && styles.clearBorderCard]}>
            {expandedProfileRows.map((row, index) => (
              <TouchableOpacity 
                key={row.key}
                accessibilityRole="button"
                accessibilityLabel={getRowLabel(row.key)}
                accessibilityHint={profileCopy.opensSectionHint}
                activeOpacity={0.78}
                onPress={() => {
                  if (row.key === "foodPreferences") {
                    openPreferenceDestination("foodBeverage", "food");
                    return;
                  }

                  if (row.key === "hobbiesInterests") {
                    openPreferenceDestination("hobbiesInterests", "interests");
                    return;
                  }

                  if (row.key === "transportation" && shouldOpenFullPreferenceView) {
                    openFullPreferenceView("transport");
                    return;
                  }

                  if (row.key === "contactPreference" && shouldOpenFullPreferenceView) {
                    openFullPreferenceView("contact");
                    return;
                  }

                  if (row.key === "locationPreference" && shouldOpenFullPreferenceView) {
                    openFullPreferenceView("location");
                    return;
                  }

                  router.push(row.route as any);
                }}
                style={[styles.row, index < expandedProfileRows.length - 1 && styles.rowBorder, isDay && index < expandedProfileRows.length - 1 && styles.dayRowBorder]}
              >

                <IconSymbol name={row.icon} color={isDay ? "#53677A" : nsnColors.muted} size={22} />
                <Text style={[styles.rowLabel, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{getRowLabel(row.key)}</Text>
                <Text style={[styles.rowChevron, isDay && styles.dayMutedText]}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
          </>
        ) : null}
      </ScrollView>

      <Modal transparent animationType="fade" visible={isVerificationReviewOpen} onRequestClose={() => setIsVerificationReviewOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.verificationSheet, isDay && styles.dayModalSheet]}>
            <Text style={[styles.verificationReviewTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{profileVerificationCopy.title}</Text>
            <Text style={[styles.verificationReviewCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
              Choose how much trust evidence you want to model in this local pilot. Real verification still needs a provider before production.
            </Text>
            <View style={styles.verificationLevelList}>
              {verificationLevelCards.map((item) => (
                <View key={item.level} style={[styles.verificationLevelCard, isDay && styles.daySoftOption, item.active && styles.verificationLevelCardActive]}>
                  <View style={styles.verificationLevelHeader}>
                    <Text style={[styles.verificationLevelKicker, isDay && styles.dayMutedText, item.active && styles.verificationLevelTextActive]}>{item.title}</Text>
                    <Text style={[styles.verificationLevelName, isDay && styles.dayTitle, item.active && styles.verificationLevelTextActive]}>{item.level}</Text>
                  </View>
                  <Text style={[styles.verificationLevelCopy, isDay && styles.dayMutedText, item.active && styles.verificationLevelTextActive]}>{item.meaning}</Text>
                  <Text style={[styles.verificationLevelTreatment, isDay && styles.dayTitle, item.active && styles.verificationLevelTextActive]}>{item.treatment}</Text>
                </View>
              ))}
              <View style={[styles.verificationLevelCard, isDay && styles.daySoftOption]}>
                <View style={styles.verificationLevelHeader}>
                  <Text style={[styles.verificationLevelKicker, isDay && styles.dayMutedText]}>Level 3</Text>
                  <Text style={[styles.verificationLevelName, isDay && styles.dayTitle]}>Identity Verified</Text>
                </View>
                <Text style={[styles.verificationLevelCopy, isDay && styles.dayMutedText]}>Optional ID verification confirming name and age.</Text>
                <Text style={[styles.verificationLevelTreatment, isDay && styles.dayTitle]}>Post-MVP unless needed for a high-trust flow.</Text>
              </View>
            </View>
            <View style={styles.verificationReviewList}>
              <View style={[styles.verificationInputGroup, isDay && styles.daySoftOption]}>
                <Text style={[styles.verificationReviewValue, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Level 1: Contact Verified</Text>
                <Text style={[styles.verificationReviewLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>Add an email or phone number to model contact verification.</Text>
                <View style={styles.verificationContactGrid}>
                  <TextInput
                    value={draftContactEmail}
                    onChangeText={setDraftContactEmail}
                    placeholder={profileVerificationCopy.emailPlaceholder}
                    placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.verificationInput, styles.verificationCompactInput, isDay && styles.dayInput, isRtl && styles.rtlInput]}
                  />
                  <TextInput
                    value={draftContactPhone}
                    onChangeText={setDraftContactPhone}
                    placeholder={profileVerificationCopy.phonePlaceholder}
                    placeholderTextColor={isDay ? "#63758A" : nsnColors.mutedSoft}
                    keyboardType="phone-pad"
                    style={[styles.verificationInput, styles.verificationCompactInput, isDay && styles.dayInput, isRtl && styles.rtlInput]}
                  />
                </View>
              </View>
              <View style={[styles.verificationActionGrid, isRtl && styles.rtlRow]}>
                <TouchableOpacity activeOpacity={0.82} onPress={pickIdentitySelfie} style={[styles.verificationActionCard, isDay && styles.daySoftOption]} accessibilityRole="button" accessibilityHint={screenReaderHints ? profileVerificationA11yCopy.selfieHint : undefined}>
                  <Text style={[styles.verificationReviewValue, isDay && styles.dayTitle, isRtl && styles.rtlText]}>Level 2: Real Person</Text>
                  <Text style={[styles.verificationReviewLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                    {draftIdentitySelfieUri ? profileVerificationCopy.selfieAdded : profileVerificationCopy.addSelfie}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.82} onPress={() => setDraftHasIdentityDocument((current) => !current)} style={[styles.verificationActionCard, isDay && styles.daySoftOption]} accessibilityRole="button" accessibilityHint={screenReaderHints ? profileVerificationA11yCopy.idDocumentHint : undefined}>
                  <Text style={[styles.verificationReviewValue, isDay && styles.dayTitle, isRtl && styles.rtlText]}>ID check</Text>
                  <Text style={[styles.verificationReviewLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                    {draftHasIdentityDocument ? profileVerificationCopy.idProvided : profileVerificationCopy.idMissing}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.86} onPress={confirmVerificationDetails} style={styles.confirmReviewButton} accessibilityRole="button" accessibilityHint={screenReaderHints ? profileVerificationA11yCopy.confirmDetailsHint : undefined}>
              <Text style={styles.confirmReviewText}>{profileVerificationCopy.confirmDetails}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.82} onPress={() => setIsVerificationReviewOpen(false)} style={[styles.secondaryReviewButton, isDay && styles.daySoftOption]}>
              <Text style={[styles.secondaryReviewText, isDay && styles.dayTitle]}>{copy.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayContainer: { backgroundColor: "#E8EDF2" },
  content: { width: "100%", maxWidth: 1120, alignSelf: "center", paddingHorizontal: 20, paddingTop: 18, paddingBottom: 112 },
  contentWide: { maxWidth: "100%" },
  softHelloContent: { alignItems: "stretch", paddingBottom: 42 },
  rtlInput: { textAlign: "right", writingDirection: "rtl" },
  topRight: { alignItems: "flex-end", marginBottom: 8, zIndex: 20 },
  settingsButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)" },
  dayIconButton: { backgroundColor: "#EEF3F4" },
  profileDrawerBackdrop: { flex: 1, alignItems: "flex-end", justifyContent: "center", backgroundColor: "rgba(2,8,20,0.58)", padding: 18 },
  profileDrawerBackdropMobile: { justifyContent: "flex-end", padding: 10 },
  profileOptionsDrawer: { width: 440, maxWidth: "96%", height: "100%", maxHeight: 820, borderRadius: 24, borderWidth: 1, borderColor: "#536C9E", backgroundColor: "#0B1626", padding: 14, gap: 12, shadowColor: "#000000", shadowOpacity: 0.32, shadowRadius: 24, shadowOffset: { width: -8, height: 10 }, elevation: 16 },
  profileOptionsDrawerMobile: { width: "100%", maxWidth: "100%", height: "92%", maxHeight: "92%", borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  dayProfileOptionsDrawer: { backgroundColor: "#E8EDF2", borderColor: "#9FB2C8" },
  profileOptionsHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 4, paddingTop: 2 },
  profileOptionsEyebrow: { color: nsnColors.cyan, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  profileOptionsTitle: { color: nsnColors.text, fontSize: 22, fontWeight: "900", lineHeight: 28 },
  profileOptionsCopy: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 2 },
  profileOptionsCloseButton: { minHeight: 40, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.05)", flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 11 },
  profileOptionsCloseText: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  profileMenu: { width: "100%", maxWidth: 410, maxHeight: 720, marginTop: 8, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface },
  profileMenuDocked: { flex: 1, maxWidth: "100%", maxHeight: "100%", marginTop: 0, borderRadius: 18, borderColor: "#3C5277", backgroundColor: "rgba(255,255,255,0.025)" },
  profileMenuScroll: { width: "100%" },
  profileMenuContent: { padding: 8 },
  profileMenuTitle: { color: nsnColors.muted, fontSize: 12, fontWeight: "900", lineHeight: 17, paddingHorizontal: 10, paddingVertical: 5 },
  profileMenuItem: { minHeight: 62, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 12, paddingVertical: 9 },
  profileMenuFeaturedItem: { borderWidth: 1, borderColor: "rgba(124,170,201,0.45)", backgroundColor: "rgba(124,170,201,0.1)" },
  profileMenuDisabledOption: { opacity: 0.72, borderStyle: "dashed" },
  profileMenuStatusBadge: { color: nsnColors.warning, borderColor: "rgba(247,200,91,0.45)", borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, fontSize: 10, fontWeight: "900", overflow: "hidden" },
  profileMenuComingSoonBadge: { color: nsnColors.muted, borderColor: "rgba(166,177,199,0.35)" },
  profileMenuBack: { minHeight: 48, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 10, marginBottom: 8 },
  profileMenuItemBody: { flex: 1, gap: 2 },
  profileMenuText: { flex: 1, color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  profileMenuDescription: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 17 },
  profileMenuChevron: { color: nsnColors.muted, fontSize: 20, fontWeight: "900", lineHeight: 24 },
  profileMenuDivider: { height: 1, backgroundColor: nsnColors.border, marginVertical: 10 },
  profileMenuDestructiveDivider: { backgroundColor: "rgba(226,61,90,0.28)", marginTop: 14 },
  profileMenuDestructiveItem: { backgroundColor: "rgba(226,61,90,0.08)" },
  profileMenuDestructiveText: { color: "#E23D5A" },
  profileMenuDestructiveDescription: { color: "#B83A50" },
  profileMenuInfoCard: { borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", padding: 12, marginBottom: 8 },
  profileMenuGuideRow: { borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.025)", paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  profileMenuPrimaryAction: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary, marginTop: 2 },
  profileMenuWarningCard: { borderColor: "rgba(247,200,91,0.55)", backgroundColor: "rgba(247,200,91,0.14)", marginTop: 8 },
  profileMenuWarningTitle: { color: "#7C5A00" },
  profileMenuWarningCopy: { color: "#7C5A00" },
  foodPreferenceSearchWrap: { minHeight: 46, borderRadius: 14, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(255,255,255,0.045)", flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 11, marginBottom: 10 },
  foodPreferenceSearchInput: { flex: 1, minHeight: 42, color: nsnColors.text, fontSize: 13, fontWeight: "800", paddingVertical: 0 },
  foodPreferenceClearButton: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.05)" },
  foodPreferenceSummary: { borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", padding: 11, marginBottom: 10, gap: 8 },
  foodPreferenceSummaryChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  foodPreferenceSummaryChip: { color: nsnColors.warning, borderColor: "rgba(247,200,91,0.45)", borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, fontSize: 11, fontWeight: "900", overflow: "hidden" },
  foodPreferenceAccordionStack: { gap: 9, marginBottom: 10 },
  foodPreferenceGroup: { borderRadius: 15, borderWidth: 1, borderColor: "#3C5277", backgroundColor: "rgba(255,255,255,0.025)", overflow: "hidden" },
  foodPreferenceGroupHeader: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  foodPreferenceGroupHeaderMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  foodPreferenceNotice: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", lineHeight: 17, paddingHorizontal: 12, paddingBottom: 8 },
  foodPreferenceChipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 10, paddingBottom: 10 },
  foodPreferenceChip: { minHeight: 38, maxWidth: "100%", borderRadius: 13, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(255,255,255,0.045)", paddingHorizontal: 10, paddingVertical: 7, justifyContent: "center" },
  foodPreferenceChipActive: { borderColor: "#D2E0FF", backgroundColor: "#214B95" },
  foodPreferenceChipText: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 16 },
  foodPreferenceChipMeta: { color: nsnColors.muted, fontSize: 10, fontWeight: "800", lineHeight: 14, marginTop: 1 },
  foodPreferenceShowMoreButton: { alignSelf: "flex-start", minHeight: 34, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", alignItems: "center", justifyContent: "center", paddingHorizontal: 12, marginLeft: 10, marginBottom: 10 },
  interestComfortTargetRow: { marginTop: 10, marginBottom: 8 },
  interestComfortTargetChip: { minHeight: 34, maxWidth: "100%", borderRadius: 13, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(255,255,255,0.045)", paddingHorizontal: 10, paddingVertical: 7, justifyContent: "center" },
  interestComfortTagGrid: { paddingHorizontal: 0, paddingBottom: 0, marginTop: 2 },
  alphaGuideCard: { width: "100%", maxWidth: 980, alignSelf: "center", borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", padding: 14, marginBottom: 14 },
  alphaGuideLabel: { color: nsnColors.day, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  alphaGuideTitle: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20, marginTop: 2 },
  alphaGuideCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  profileDisplayCard: { width: "100%", maxWidth: 980, alignSelf: "center", borderRadius: 18, borderWidth: 1, borderColor: "#38527C", backgroundColor: "#0F223D", padding: 14, marginBottom: 16, gap: 12 },
  profileDisplayTitleRow: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 9 },
  profileDisplayGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  profileDisplayGroup: { flexGrow: 1, flexBasis: 220, gap: 7 },
  profileDisplayGroupLabel: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15, textTransform: "uppercase" },
  profileDisplayChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  profileDisplayChip: { minHeight: 34, borderRadius: 13, borderWidth: 1, borderColor: "#4D6794", backgroundColor: "rgba(255,255,255,0.045)", paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  profileDisplayActionChip: { alignSelf: "flex-start", marginTop: 4 },
  profileDisplayChipActive: { borderColor: "#D2E0FF", backgroundColor: "#214B95" },
  profileDisplayChipText: { color: nsnColors.text, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  profileLayoutStack: { gap: 8 },
  profileWidthStack: { marginTop: 8 },
  profileLayoutOption: { minHeight: 58, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", flexDirection: "row", alignItems: "center", gap: 10, padding: 10 },
  daySoftOption: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  profileLayoutOptionActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  profileLayoutBody: { flex: 1 },
  profileLayoutTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  profileLayoutCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 2 },
  profileLayoutCheck: { width: 22, color: nsnColors.muted, fontSize: 16, fontWeight: "900", textAlign: "center" },
  profileLayoutTextActive: { color: "#FFFFFF" },
  profileHeader: { width: "100%", alignSelf: "center", alignItems: "center", marginTop: 4, marginBottom: 22, gap: 10, padding: 6 },
  profileHeaderDetailed: { borderRadius: 20, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 16 },
  softHelloProfileHeader: { alignSelf: "center", width: "100%", marginBottom: 30 },
  pausedProfileBanner: { width: "100%", maxWidth: 520, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(56,72,255,0.10)", padding: 14, marginBottom: 8 },
  pausedProfileTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21 },
  pausedProfileCopy: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 18, marginTop: 4 },
  avatar: { width: 90, height: 90, borderRadius: 45, alignItems: "center", justifyContent: "center", backgroundColor: "#1590C9" },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  avatarRing: { width: 104, height: 104, borderRadius: 52, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: nsnColors.primary, backgroundColor: "rgba(56,72,255,0.10)" },
  avatarText: { color: nsnColors.text, fontSize: 38, fontWeight: "900" },
  photoButton: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, alignSelf: "center", },
  dayPhotoButton: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  photoButtonText: { color: "#7786FF", fontSize: 12, fontWeight: "800" },
  dayPhotoButtonText: { color: "#445E93" },
  photoDropZone: { width: "100%", maxWidth: 380, minHeight: 78, borderRadius: 16, borderWidth: 1, borderStyle: "dashed", borderColor: "#4D6794", backgroundColor: "rgba(255,255,255,0.035)", flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 13, paddingVertical: 11, marginTop: 4 },
  photoDropZoneCopy: { flex: 1, minWidth: 0 },
  photoDropZoneTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  photoDropZoneText: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 1 },
  photoDropZoneNote: { color: nsnColors.muted, fontSize: 10, fontWeight: "900", lineHeight: 14, marginTop: 3, textTransform: "uppercase" },
  identitySummary: { alignItems: "center", gap: 6, marginTop: 2, marginBottom: 4, width: "100%" },
  identitySummaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  identitySummaryText: { color: nsnColors.muted, fontSize: 13, fontWeight: "800", lineHeight: 19, textAlign: "center" },
  identityMessage: { marginTop: 2, marginBottom: 2 },
  inlineEditRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" },
  lastNameInput: { minHeight: 38, minWidth: 190, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, color: nsnColors.text, fontSize: 13, fontWeight: "800", paddingHorizontal: 12 },
  nameToggleRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  nameVisibilityToggle: { minHeight: 34, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 12 },
  ageEditorCard: { alignSelf: "center", marginTop: 8 },
  rangeRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  rangeInput: { minHeight: 40, width: 78, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, color: nsnColors.text, fontSize: 13, fontWeight: "900", paddingHorizontal: 12, textAlign: "center" },
  genderChip: { minHeight: 38, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", paddingHorizontal: 13 },
  genderChipText: { color: nsnColors.text, fontSize: 12, fontWeight: "900" },
  profileCardsGrid: { width: "100%", alignSelf: "center", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 8 },
  profileCardsGridWide: { flexDirection: "row", alignItems: "flex-start", justifyContent: "center" },
  profileControlsColumn: { width: "100%", maxWidth: 480, alignItems: "center", gap: 14 },
  profileBasicsCard: { width: "100%", maxWidth: 480, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.025)", padding: 12, marginTop: 12 },
  leftAlignedTitle: { textAlign: "left", marginBottom: 0 },
  locationInput: { minHeight: 42, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, color: nsnColors.text, fontSize: 14, fontWeight: "800", paddingHorizontal: 12, marginTop: 8 },
  localAreaValue: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20, marginTop: 8 },
  localAreaVisibilityToggle: { minHeight: 38, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 12, marginTop: 10 },
  previewVisibilityToggle: { alignSelf: "flex-start", minHeight: 38, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 12, marginTop: 12 },
  localAreaVisibilityToggleActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  localAreaVisibilityText: { color: nsnColors.text, fontSize: 12, fontWeight: "900", lineHeight: 17 },
  localAreaVisibilityTextActive: { color: "#FFFFFF" },
  visibilityModeCard: { width: "100%", maxWidth: 480, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.025)", padding: 12, marginTop: 12 },
  dayVisibilityModeCard: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  visibilityModeTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, marginBottom: 8, textAlign: "center" },
  visibilityModeSegmented: { minHeight: 40, flexDirection: "row", borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)" },
  dayVisibilityModeSegmented: { backgroundColor: "#F4F7F8", borderColor: "#C5D0DA" },
  visibilityModeOption: { flex: 1, minHeight: 38, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  dayVisibilityModeOption: { backgroundColor: "#F4F7F8" },
  visibilityModeOptionActive: { backgroundColor: nsnColors.primary },
  dayVisibilityModeOptionActive: { backgroundColor: "#536C9E" },
  visibilityModeText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900", lineHeight: 17, textAlign: "center" },
  visibilityModeTextActive: { color: "#FFFFFF" },
  visibilityModeCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 8, textAlign: "center" },
  warmUpBlurOption: { minHeight: 58, borderRadius: 13, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", flexDirection: "row", alignItems: "center", gap: 10, padding: 10, marginTop: 10 },
  warmUpBlurOptionActive: { borderColor: nsnColors.cyan, backgroundColor: "rgba(56,72,255,0.16)" },
  profilePreviewBlock: { width: "100%", maxWidth: 480, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.025)", padding: 12, marginTop: 12 },
  profileSectionCard: { width: "100%", maxWidth: 980, alignSelf: "center", borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 16, marginBottom: 18 },
  detailedSectionCard: { width: "100%", maxWidth: 980, alignSelf: "center", marginBottom: 14 },
  detailedSectionCardWide: { maxWidth: "100%" },
  sectionSubtitle: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 17, marginTop: 2 },
  profileCardDivider: { height: 1, backgroundColor: nsnColors.border, marginVertical: 14 },
  compactGrid: { marginBottom: 0 },
  interestChipActive: { borderColor: nsnColors.primary, backgroundColor: "rgba(56,72,255,0.16)" },
  cardInlineMessage: { marginTop: 10, marginBottom: 0, textAlign: "left" },
  privacySummaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  privacySummaryItem: { flexGrow: 1, minWidth: 140, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.035)", paddingHorizontal: 12, paddingVertical: 10 },
  privacySummaryLabel: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  privacySummaryValue: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, marginTop: 2 },
  trustCard: { width: "100%", maxWidth: 980, alignSelf: "center", borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 16, marginBottom: 16 },
  simpleTrustCard: { paddingVertical: 14 },
  trustHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 },
  trustTitle: { fontWeight: "900" },
  trustPill: { color: nsnColors.warning, borderColor: "rgba(247,200,91,0.45)", borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, fontSize: 11, fontWeight: "900", overflow: "hidden" },
  trustPillReady: { color: nsnColors.green, borderColor: "rgba(114,214,126,0.45)" },
  dayTrustPill: { color: "#7C5A00", backgroundColor: "#FFF7D8", borderColor: "#D4A91E" },
  dayTrustPillReady: { color: "#0F6B2F", backgroundColor: "#E8F8EE", borderColor: "#55A96E" },
  trustCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
  simpleTrustCopy: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 18 },
  trustFoundationGroup: { gap: 8, marginTop: 12 },
  trustFoundationTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  trustFoundationCopy: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 17 },
  verifiedPrivateOption: { minHeight: 72, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", flexDirection: "row", alignItems: "center", gap: 10, padding: 12, marginTop: 14 },
  verifiedPrivateOptionActive: { borderColor: nsnColors.primary, backgroundColor: "rgba(56,72,255,0.2)" },
  verifiedPrivateTextActive: { color: "#FFFFFF" },
  verificationSteps: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 12 },
  verificationStep: { borderRadius: 999, borderWidth: 1, borderColor: nsnColors.border, paddingHorizontal: 9, paddingVertical: 5, backgroundColor: "rgba(255,255,255,0.03)" },
  verificationStepActive: { borderColor: nsnColors.primary, backgroundColor: "rgba(56,72,255,0.22)" },
  verificationStepText: { color: nsnColors.muted, fontSize: 11, fontWeight: "800" },
  verificationStepTextActive: { color: nsnColors.text },
  dayVerificationStep: { backgroundColor: "#F4F7F8", borderColor: "#6D83A8" },
  dayVerificationStepActive: { backgroundColor: "#536C9E", borderColor: "#536C9E" },
  dayVerificationStepText: { color: "#38465F" },
  dayVerificationStepTextActive: { color: "#FFFFFF" },
  reviewSettingsButton: { alignSelf: "flex-start", minHeight: 36, borderRadius: 13, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 13, marginTop: 12 },
  simpleReviewButton: { minHeight: 34, marginTop: 10 },
  reviewSettingsText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900", lineHeight: 17 },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(2,8,20,0.42)", padding: 16 },
  verificationSheet: { borderRadius: 22, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 16 },
  dayModalSheet: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA" },
  verificationReviewTitle: { color: nsnColors.text, fontSize: 20, fontWeight: "900", lineHeight: 26 },
  verificationReviewCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19, marginTop: 4, marginBottom: 12 },
  verificationLevelList: { gap: 8, marginBottom: 10 },
  verificationLevelCard: { borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", paddingHorizontal: 12, paddingVertical: 10 },
  verificationLevelCardActive: { borderColor: nsnColors.primary, backgroundColor: "rgba(56,72,255,0.18)" },
  verificationLevelHeader: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 4 },
  verificationLevelKicker: { color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  verificationLevelName: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  verificationLevelCopy: { color: nsnColors.muted, fontSize: 12, fontWeight: "700", lineHeight: 17 },
  verificationLevelTreatment: { color: nsnColors.text, fontSize: 12, fontWeight: "800", lineHeight: 17, marginTop: 3 },
  verificationLevelTextActive: { color: "#FFFFFF" },
  verificationReviewList: { gap: 8 },
  verificationReviewRow: { minHeight: 56, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", paddingHorizontal: 12, paddingVertical: 9 },
  verificationReviewLabel: { flex: 1, color: nsnColors.muted, fontSize: 11, fontWeight: "900", lineHeight: 15 },
  verificationReviewValue: { flex: 1.5, color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  verificationInputGroup: { borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", paddingHorizontal: 12, paddingVertical: 9 },
  verificationInput: { minHeight: 42, borderRadius: 12, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, color: nsnColors.text, fontSize: 14, fontWeight: "800", paddingHorizontal: 12, marginTop: 7 },
  verificationContactGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  verificationCompactInput: { flexGrow: 1, flexBasis: 190 },
  verificationActionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  verificationActionCard: { flexGrow: 1, flexBasis: 190, minHeight: 62, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", paddingHorizontal: 12, paddingVertical: 10 },
  dayInput: { backgroundColor: "#FFFFFF", borderColor: "#C5D0DA", color: "#0B1220" },
  confirmReviewButton: { minHeight: 48, borderRadius: 15, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center", marginTop: 12 },
  confirmReviewText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900", lineHeight: 20 },
  secondaryReviewButton: { minHeight: 46, borderRadius: 15, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.04)", alignItems: "center", justifyContent: "center", marginTop: 9 },
  secondaryReviewText: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18 },
  photoMenu: { marginTop: 8, width: 185, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, overflow: "hidden", alignSelf: "center", },
  photoMenuItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: nsnColors.border, },
  photoMenuItemLast: { paddingVertical: 12, paddingHorizontal: 14, },
  photoMenuText: { color: nsnColors.text, fontSize: 13, fontWeight: "700", textAlign: "center", },
  photoMenuDeleteText: { color: "#FF6B6B", fontSize: 13, fontWeight: "800", textAlign: "center", },
  name: { color: nsnColors.text, fontSize: 26, fontWeight: "800", lineHeight: 33 },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#53677A" },
  dayAccentText: { color: "#445E93" },
  nameInput: { color: nsnColors.text, fontSize: 26, fontWeight: "800", lineHeight: 33, textAlign: "center", minWidth: 120, borderBottomWidth: 1, borderBottomColor: nsnColors.primary, paddingVertical: 2 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12 },
  cardTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 },
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 23 },
  editText: { color: "#7786FF", fontSize: 13, fontWeight: "700" },
  preferenceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginTop: 2 },
  vibeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  vibeChip: { color: nsnColors.text, fontSize: 13, lineHeight: 18, fontWeight: "700", paddingHorizontal: 13, paddingVertical: 9, borderRadius: 14, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, overflow: "hidden" },
  comfortChipActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary, color: nsnColors.text },
  dayComfortChipActive: { backgroundColor: "#536C9E", borderColor: "#536C9E", color: "#FFFFFF" },
  vibeChipMuted: { opacity: 0.45, borderStyle: "dashed" },
  rtlRow: { flexDirection: "row-reverse" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  inlineMessage: { color: "#F7C85B", fontSize: 12, lineHeight: 17, fontWeight: "700", marginTop: -10, marginBottom: 16, textAlign: "center" },
  dayMessage: { color: "#7C5A00" },
  aboutCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.025)", padding: 16, marginBottom: 16 },
  aboutInput: { minHeight: 80, textAlignVertical: "top", padding: 0, margin: 0, borderWidth: 0, backgroundColor: "transparent", ...(Platform.OS === "web" ? ({ outlineStyle: "none", outlineWidth: 0, outlineColor: "transparent", boxShadow: "none", appearance: "none", caretColor: "#7786FF" } as any) : {}) },
  aboutText: { color: nsnColors.text, fontSize: 15, lineHeight: 23 },
  settingsList: { borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface },
  row: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: nsnColors.border },
  dayRowBorder: { borderBottomColor: "#C5D0DA" },
  rowIcon: { width: 30, color: nsnColors.text, fontSize: 17 },
  rowLabel: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "600", lineHeight: 20 },
  rowChevron: { color: nsnColors.muted, fontSize: 26, lineHeight: 30 },
  dayCard: { backgroundColor: "#EEF3F4", borderColor: "#C5D0DA" },
  softSurfaceCard: { backgroundColor: "rgba(220,238,255,0.72)", borderColor: "rgba(184,201,230,0.56)" },
  clearBorderCard: { borderColor: "#6F8BB8", borderWidth: 1.5 },
});
