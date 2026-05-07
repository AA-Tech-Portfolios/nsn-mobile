import { useEffect, useState } from "react";
import { View, Text, TextInput, Platform, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { getLanguageBase, type SoftHelloVisibility, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { nsnColors, profileVibes } from "@/lib/nsn-data";
import { getProfilePreferenceCopy } from "@/lib/profile-preference-translations";
import { isAllowedDisplayName, nameNotAllowedMessage } from "@/lib/profile-validation";
import { canMeetInPerson, getMeetingSafetyCopy, getVerificationLevelLabel, type SoftHelloComfortPreference, verificationLevels } from "@/lib/softhello-mvp";

const rows = [
  { icon: "calendar", key: "meetups", route: "/meetups" },
  { icon: "message", key: "chats", route: "/chats" },
  { icon: "group", key: "events", route: "/events" },
  { icon: "explore", key: "locationPreference", route: "/location-preference" },
  { icon: "transport", key: "transportation", route: "/transportation-preference" },
  { icon: "food", key: "foodPreferences", route: "/food-preferences" },
  { icon: "interests", key: "hobbiesInterests", route: "/hobbies-interests" },
  { icon: "location", key: "places", route: "/saved-places" },
  { icon: "settings", key: "settings", route: "/settings" },
] as const;

const comfortOptions: SoftHelloComfortPreference[] = ["Small groups", "Text-first", "Quiet", "Flexible pace", "Indoor backup"];
const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const profileTranslations = {
  English: {
    addPhoto: "Add photo",
    editPhoto: "Edit photo",
    changePhoto: "Change photo",
    choosePhoto: "Choose photo",
    removePhoto: "Remove photo",
    cancel: "Cancel",
    done: "Done",
    edit: "Edit",
    save: "Save",
    saved: "Saved ✓",
    trustStatus: "Trust status",
    comfortProfile: "Comfort profile",
    noComfortPreferences: "No comfort preferences set yet.",
    vibeLimitMessage: "Let's keep this calm. What 5 vibes feel most like you?",
    myVibes: "My Vibes",
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
  English: "Food & Payment Preferences",
  Arabic: "تفضيلات الطعام والدفع",
  Hebrew: "העדפות אוכל ותשלום",
  Russian: "Еда и оплата",
  Spanish: "Comida y pago",
  Chinese: "饮食与付款偏好",
  French: "Repas et paiement",
  German: "Essen und Zahlung",
  Japanese: "食事と支払い",
  Korean: "음식 및 결제 선호",
  Yiddish: "עסן און באצאלונג",
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

export default function ProfileScreen() {
  const router = useRouter();
  const {
    isNightMode,
    blurProfilePhoto,
    appLanguage,
    displayName,
    setDisplayName,
    profilePhotoUri,
    setProfilePhotoUri,
    visibilityPreference,
    comfortPreferences,
    verificationLevel,
    saveSoftHelloMvpState,
  } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const isDay = !isNightMode;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const copy = profileTranslations[appLanguageBase as keyof typeof profileTranslations] ?? profileTranslations.English;
  const vibeCopy = profileVibeTranslations[appLanguageBase] ?? {};
  const comfortCopy = comfortPreferenceTranslations[appLanguageBase] ?? {};
  const visibilityCopy = visibilityModeTranslations[appLanguageBase as keyof typeof visibilityModeTranslations] ?? visibilityModeTranslations.English;
  const profilePreferenceCopy = getProfilePreferenceCopy(appLanguageBase);
  const visibilityModeCopy = visibilityPreference === "Blurred" ? visibilityCopy.comfortCopy : visibilityCopy.openCopy;
  const getComfortLabel = (preference: SoftHelloComfortPreference) => comfortCopy[preference] ?? preference;
  const comfortSummary = comfortPreferences.length ? comfortPreferences.map(getComfortLabel).join(" · ") : copy.noComfortPreferences;
  const getRowLabel = (key: (typeof rows)[number]["key"]) => {
    if (key === "locationPreference") return profilePreferenceCopy.rows.locationPreference;
    if (key === "transportation") return profilePreferenceCopy.rows.transportation;
    if (key === "foodPreferences") return profilePreferenceCopy.rows.foodPreferences;
    if (key === "hobbiesInterests") return profilePreferenceCopy.rows.hobbiesInterests;

    return copy.rows[key];
  };

  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(displayName);
  const [nameError, setNameError] = useState("");
  const [showNameSaved, setShowNameSaved] = useState(false);

  const [selectedVibes, setSelectedVibes] = useState(profileVibes.slice(0, 5));
  const [isEditingVibes, setIsEditingVibes] = useState(false);
  const [vibeLimitMessage, setVibeLimitMessage] = useState("");
  const [showVibesSaved, setShowVibesSaved] = useState(false);
  const [draftComfortPreferences, setDraftComfortPreferences] = useState<SoftHelloComfortPreference[]>(comfortPreferences);
  const [isEditingComfort, setIsEditingComfort] = useState(false);
  const [showComfortSaved, setShowComfortSaved] = useState(false);

  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const [aboutMe, setAboutMe] = useState<string>(copy.aboutText);
  const [aboutLanguageBase, setAboutLanguageBase] = useState(appLanguageBase);

  const [showSaved, setShowSaved] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  useEffect(() => {
    const previousAboutText =
      profileTranslations[aboutLanguageBase as keyof typeof profileTranslations]?.aboutText ?? profileTranslations.English.aboutText;

    if (!isEditingAbout && aboutMe === previousAboutText) {
      setAboutMe(copy.aboutText);
      setAboutLanguageBase(appLanguageBase);
    }
  }, [aboutLanguageBase, aboutMe, appLanguageBase, copy.aboutText, isEditingAbout]);

  const pickProfilePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo access to choose a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhotoUri(result.assets[0].uri);
    }
  };

  const handleAvatarPress = () => {
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

  const updateVisibilityPreference = async (nextPreference: SoftHelloVisibility) => {
    if (nextPreference === visibilityPreference) return;

    await saveSoftHelloMvpState({ visibilityPreference: nextPreference });
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

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRight}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.push("/(tabs)/settings")}
            style={[styles.settingsButton, isDay && styles.dayIconButton]}
            accessibilityRole="button"
            accessibilityLabel={copy.rows.settings}
          >
            <IconSymbol name="settings" color={isDay ? "#0B1220" : nsnColors.text} size={23} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={handleAvatarPress} 
            style={styles.avatarRing}
          
            accessibilityRole="button"
            accessibilityLabel={
              profilePhotoUri
                ? "Edit profile photo"
                : "Add profile photo"
            }
            accessibilityHint="Opens profile photo options"
          >
            {profilePhotoUri ? (
              <Image source={{ uri: profilePhotoUri }} style={styles.avatarImage} blurRadius={blurProfilePhoto ? 12 : 0} />
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
            accessibilityLabel={ profilePhotoUri ? "Edit profile photo" : "Add profile photo"}  
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
          setProfilePhotoUri(null);
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
          <View style={[styles.visibilityModeCard, isDay && styles.dayVisibilityModeCard]}>
            <Text style={[styles.visibilityModeTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{visibilityCopy.title}</Text>
            <View style={[styles.visibilityModeSegmented, isDay && styles.dayVisibilityModeSegmented, isRtl && styles.rtlRow]}>
              {([
                { value: "Blurred" as SoftHelloVisibility, label: visibilityCopy.comfortMode },
                { value: "Visible" as SoftHelloVisibility, label: visibilityCopy.openMode },
              ]).map((option) => {
                const active = visibilityPreference === option.value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                    accessibilityState={{ selected: active }}
                    activeOpacity={0.82}
                    onPress={() => updateVisibilityPreference(option.value)}
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
          </View>

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
              <Text style={[styles.name, isDay && styles.dayTitle]}>{displayName}</Text>
            )}

            <TouchableOpacity
              onPress={toggleNameEditing}

              accessibilityRole="button"
              accessibilityLabel={
                isEditingName
                  ? "Save name"
                  : "Edit name"
              }
            >

              {isEditingName ? (
                <Text style={styles.editText}>{copy.done}</Text>
              ) : showNameSaved ? (
                <Text style={styles.editText}>{copy.saved}</Text>
              ) : (
                <IconSymbol name="edit" color={isDay ? "#3B4A63" : nsnColors.muted} size={18} />
              )}
            </TouchableOpacity>
          </View>
          {nameError ? <Text style={[styles.inlineMessage, isDay && styles.dayMessage]}>{nameError}</Text> : null}
        </View>

        <View style={[styles.trustCard, isDay && styles.dayCard]}>
          <View style={[styles.trustHeader, isRtl && styles.rtlRow]}>
            <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.trustStatus}</Text>
            <Text style={[styles.trustPill, isDay && styles.dayTrustPill, canMeetInPerson(verificationLevel) && styles.trustPillReady, isDay && canMeetInPerson(verificationLevel) && styles.dayTrustPillReady]}>
              {getVerificationLevelLabel(verificationLevel, appLanguageBase)}
            </Text>
          </View>
          <Text style={[styles.trustCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{getMeetingSafetyCopy(verificationLevel, appLanguageBase)}</Text>
          <View style={styles.verificationSteps}>
            {verificationLevels.map((level) => (
              <View key={level} style={[styles.verificationStep, isDay && styles.dayVerificationStep, level === verificationLevel && styles.verificationStepActive, isDay && level === verificationLevel && styles.dayVerificationStepActive]}>
                <Text style={[styles.verificationStepText, isDay && styles.dayVerificationStepText, level === verificationLevel && styles.verificationStepTextActive, isDay && level === verificationLevel && styles.dayVerificationStepTextActive]}>
                  {getVerificationLevelLabel(level, appLanguageBase)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.trustCard, isDay && styles.dayCard]}>
          <View style={[styles.cardTitleRow, isRtl && styles.rtlRow]}>
            <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.comfortProfile}</Text>
            <Text style={styles.editText} onPress={toggleComfortEditing}>
              {showComfortSaved ? copy.saved : isEditingComfort ? copy.done : copy.edit}
            </Text>
          </View>
          {isEditingComfort ? (
            <View style={[styles.preferenceGrid, isRtl && styles.rtlRow]}>
              {comfortOptions.map((preference) => {
                const active = draftComfortPreferences.includes(preference);
                const label = getComfortLabel(preference);

                return (
                  <TouchableOpacity
                    key={preference}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityState={{ selected: active }}
                    activeOpacity={0.78}
                    onPress={() => toggleComfortPreference(preference)}
                  >
                    <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, !active && styles.vibeChipMuted, active && styles.comfortChipActive, isDay && active && styles.dayComfortChipActive, isRtl && styles.rtlText]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text style={[styles.trustCopy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{comfortSummary}</Text>
          )}
        </View>

        <View style={[styles.sectionTitleRow, isRtl && styles.rtlRow]}>
          <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.myVibes}</Text>

          <Text style={styles.editText} onPress={toggleVibeEditing}>
            {showVibesSaved ? copy.saved : isEditingVibes ? copy.done : copy.edit}
          </Text>
        </View>

        <View style={[styles.vibeGrid, isRtl && styles.rtlRow]}>
          {profileVibes.map((vibe) => {
            const selected = selectedVibes.includes(vibe);
            const vibeLabel = vibeCopy[vibe] ?? vibe;

            if (!isEditingVibes && !selected) return null;

            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={vibeLabel}
                accessibilityState={{
                  selected,
                }}  
                
                accessibilityHint={
                  isEditingVibes
                    ? "Double tap to select or deselect"
                    : undefined
                }

                key={vibe}
                activeOpacity={0.75}
                onPress={() => isEditingVibes && toggleVibe(vibe)}
              >
                <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, isEditingVibes && !selected && styles.vibeChipMuted, isRtl && styles.rtlText]}>
                  {selected ? vibeLabel : `＋ ${vibeLabel}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {vibeLimitMessage ? <Text style={[styles.inlineMessage, isDay && styles.dayMessage]}>{vibeLimitMessage}</Text> : null}

        <View style={[styles.sectionTitleRow, isRtl && styles.rtlRow]}>
          <Text style={[styles.sectionTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.about}</Text>
          <Text
            accessibilityRole="button"
            accessibilityLabel={
              isEditingAbout
                ? "Save about me"
                : "Edit about me"
            }

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

        <View style={[styles.aboutCard, isDay && styles.dayCard]}>
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
        </View>

        <View style={[styles.settingsList, isDay && styles.dayCard]}>
          {rows.map((row, index) => (
            <TouchableOpacity 
              key={row.key}
              accessibilityRole="button"
              accessibilityLabel={getRowLabel(row.key)}
              accessibilityHint="Opens section"
              activeOpacity={0.78}
              onPress={() => router.push(row.route as any)}
              style={[styles.row, index < rows.length - 1 && styles.rowBorder, isDay && index < rows.length - 1 && styles.dayRowBorder]}
            >

              <IconSymbol name={row.icon} color={isDay ? "#3B4A63" : nsnColors.muted} size={22} />
              <Text style={[styles.rowLabel, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{getRowLabel(row.key)}</Text>
              <Text style={[styles.rowChevron, isDay && styles.dayMutedText]}>›</Text>
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
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 30 },
  topRight: { alignItems: "flex-end", marginBottom: 8 },
  settingsButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)" },
  dayIconButton: { backgroundColor: "#DCEEFF" },
  profileHeader: { alignItems: "center", marginBottom: 22 },
  avatar: { width: 90, height: 90, borderRadius: 45, alignItems: "center", justifyContent: "center", backgroundColor: "#1590C9" },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  avatarRing: { width: 104, height: 104, borderRadius: 52, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: nsnColors.primary, backgroundColor: "rgba(56,72,255,0.10)" },
  avatarText: { color: nsnColors.text, fontSize: 38, fontWeight: "900" },
  photoButton: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, alignSelf: "center", },
  dayPhotoButton: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  photoButtonText: { color: "#7786FF", fontSize: 12, fontWeight: "800" },
  dayPhotoButtonText: { color: "#3949DB" },
  visibilityModeCard: { width: "100%", maxWidth: 370, borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.025)", padding: 12, marginTop: 12 },
  dayVisibilityModeCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  visibilityModeTitle: { color: nsnColors.text, fontSize: 13, fontWeight: "900", lineHeight: 18, marginBottom: 8, textAlign: "center" },
  visibilityModeSegmented: { minHeight: 40, flexDirection: "row", borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.04)" },
  dayVisibilityModeSegmented: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  visibilityModeOption: { flex: 1, minHeight: 38, alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  dayVisibilityModeOption: { backgroundColor: "#F8FBFF" },
  visibilityModeOptionActive: { backgroundColor: nsnColors.primary },
  dayVisibilityModeOptionActive: { backgroundColor: "#3848FF" },
  visibilityModeText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900", lineHeight: 17, textAlign: "center" },
  visibilityModeTextActive: { color: "#FFFFFF" },
  visibilityModeCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 8, textAlign: "center" },
  trustCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 14, marginBottom: 16 },
  trustHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6 },
  trustPill: { color: nsnColors.warning, borderColor: "rgba(247,200,91,0.45)", borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, fontSize: 11, fontWeight: "900", overflow: "hidden" },
  trustPillReady: { color: nsnColors.green, borderColor: "rgba(114,214,126,0.45)" },
  dayTrustPill: { color: "#7C5A00", backgroundColor: "#FFF7D8", borderColor: "#D4A91E" },
  dayTrustPillReady: { color: "#0F6B2F", backgroundColor: "#E8F8EE", borderColor: "#55A96E" },
  trustCopy: { color: nsnColors.muted, fontSize: 13, lineHeight: 19 },
  verificationSteps: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 12 },
  verificationStep: { borderRadius: 999, borderWidth: 1, borderColor: nsnColors.border, paddingHorizontal: 9, paddingVertical: 5, backgroundColor: "rgba(255,255,255,0.03)" },
  verificationStepActive: { borderColor: nsnColors.primary, backgroundColor: "rgba(56,72,255,0.22)" },
  verificationStepText: { color: nsnColors.muted, fontSize: 11, fontWeight: "800" },
  verificationStepTextActive: { color: nsnColors.text },
  dayVerificationStep: { backgroundColor: "#F8FBFF", borderColor: "#6D83A8" },
  dayVerificationStepActive: { backgroundColor: "#3848FF", borderColor: "#3848FF" },
  dayVerificationStepText: { color: "#38465F" },
  dayVerificationStepTextActive: { color: "#FFFFFF" },
  photoMenu: { marginTop: 8, width: 185, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, overflow: "hidden", alignSelf: "center", },
  photoMenuItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: nsnColors.border, },
  photoMenuItemLast: { paddingVertical: 12, paddingHorizontal: 14, },
  photoMenuText: { color: nsnColors.text, fontSize: 13, fontWeight: "700", textAlign: "center", },
  photoMenuDeleteText: { color: "#FF6B6B", fontSize: 13, fontWeight: "800", textAlign: "center", },
  name: { color: nsnColors.text, fontSize: 26, fontWeight: "800", lineHeight: 33 },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#3B4A63" },
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
  dayComfortChipActive: { backgroundColor: "#3848FF", borderColor: "#3848FF", color: "#FFFFFF" },
  vibeChipMuted: { opacity: 0.45, borderStyle: "dashed" },
  rtlRow: { flexDirection: "row-reverse" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  inlineMessage: { color: "#F7C85B", fontSize: 12, lineHeight: 17, fontWeight: "700", marginTop: -10, marginBottom: 16, textAlign: "center" },
  dayMessage: { color: "#7C5A00" },
  aboutCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.025)", padding: 15, marginBottom: 16 },
  aboutInput: { minHeight: 80, textAlignVertical: "top", padding: 0, margin: 0, borderWidth: 0, backgroundColor: "transparent", ...(Platform.OS === "web" ? ({ outlineStyle: "none", outlineWidth: 0, outlineColor: "transparent", boxShadow: "none", appearance: "none", caretColor: "#7786FF" } as any) : {}) },
  aboutText: { color: nsnColors.text, fontSize: 15, lineHeight: 23 },
  settingsList: { borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface },
  row: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: nsnColors.border },
  dayRowBorder: { borderBottomColor: "#B8C9E6" },
  rowIcon: { width: 30, color: nsnColors.text, fontSize: 17 },
  rowLabel: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "600", lineHeight: 20 },
  rowChevron: { color: nsnColors.muted, fontSize: 26, lineHeight: 30 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
});
