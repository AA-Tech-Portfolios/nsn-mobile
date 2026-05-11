import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { nsnColors } from "@/lib/nsn-data";

const tabLabels: Record<string, { home: string; meetups: string; chats: string; alerts: string; profile: string }> = {
  English: { home: "Home", meetups: "Meetups", chats: "Chats", alerts: "Alerts", profile: "Profile" },
  Arabic: { home: "الرئيسية", meetups: "اللقاءات", chats: "الدردشات", alerts: "التنبيهات", profile: "الملف" },
  Afrikaans: { home: "Tuis", meetups: "Ontmoetings", chats: "Geselsies", alerts: "Kennisgewings", profile: "Profiel" },
  Albanian: { home: "Kreu", meetups: "Takime", chats: "Biseda", alerts: "Njoftime", profile: "Profili" },
  Armenian: { home: "Գլխավոր", meetups: "Հանդիպումներ", chats: "Զրույցներ", alerts: "Ծանուցումներ", profile: "Պրոֆիլ" },
  Bengali: { home: "হোম", meetups: "মিটআপ", chats: "চ্যাট", alerts: "সতর্কতা", profile: "প্রোফাইল" },
  Chinese: { home: "首页", meetups: "聚会", chats: "聊天", alerts: "提醒", profile: "资料" },
  Croatian: { home: "Početna", meetups: "Susreti", chats: "Chatovi", alerts: "Obavijesti", profile: "Profil" },
  Czech: { home: "Domů", meetups: "Setkání", chats: "Chaty", alerts: "Oznámení", profile: "Profil" },
  Danish: { home: "Hjem", meetups: "Meetups", chats: "Chats", alerts: "Varsler", profile: "Profil" },
  Dutch: { home: "Home", meetups: "Meetups", chats: "Chats", alerts: "Meldingen", profile: "Profiel" },
  Estonian: { home: "Avaleht", meetups: "Kohtumised", chats: "Vestlused", alerts: "Teavitused", profile: "Profiil" },
  Filipino: { home: "Home", meetups: "Meetups", chats: "Chats", alerts: "Alerts", profile: "Profile" },
  Finnish: { home: "Koti", meetups: "Tapaamiset", chats: "Chatit", alerts: "Hälytykset", profile: "Profiili" },
  French: { home: "Accueil", meetups: "Rencontres", chats: "Chats", alerts: "Alertes", profile: "Profil" },
  German: { home: "Start", meetups: "Treffen", chats: "Chats", alerts: "Hinweise", profile: "Profil" },
  Greek: { home: "Αρχική", meetups: "Συναντήσεις", chats: "Συνομιλίες", alerts: "Ειδοποιήσεις", profile: "Προφίλ" },
  "Haitian Creole": { home: "Akèy", meetups: "Rankont", chats: "Chat", alerts: "Notifikasyon", profile: "Pwofil" },
  Hebrew: { home: "בית", meetups: "מפגשים", chats: "צ'אטים", alerts: "התראות", profile: "פרופיל" },
  Hindi: { home: "होम", meetups: "मीटअप", chats: "चैट", alerts: "अलर्ट", profile: "प्रोफ़ाइल" },
  Hungarian: { home: "Kezdőlap", meetups: "Találkozók", chats: "Chatek", alerts: "Értesítések", profile: "Profil" },
  Indonesian: { home: "Beranda", meetups: "Meetup", chats: "Chat", alerts: "Peringatan", profile: "Profil" },
  Italian: { home: "Home", meetups: "Meetup", chats: "Chat", alerts: "Avvisi", profile: "Profilo" },
  Japanese: { home: "ホーム", meetups: "ミートアップ", chats: "チャット", alerts: "通知", profile: "プロフィール" },
  Korean: { home: "홈", meetups: "모임", chats: "채팅", alerts: "알림", profile: "프로필" },
  Latvian: { home: "Sākums", meetups: "Tikšanās", chats: "Tērzēšana", alerts: "Paziņojumi", profile: "Profils" },
  Lithuanian: { home: "Pradžia", meetups: "Susitikimai", chats: "Pokalbiai", alerts: "Pranešimai", profile: "Profilis" },
  Luxembourgish: { home: "Start", meetups: "Meetups", chats: "Chatten", alerts: "Notifikatiounen", profile: "Profil" },
  Malay: { home: "Utama", meetups: "Meetup", chats: "Chat", alerts: "Makluman", profile: "Profil" },
  Norwegian: { home: "Hjem", meetups: "Meetups", chats: "Chatter", alerts: "Varsler", profile: "Profil" },
  Persian: { home: "خانه", meetups: "دیدارها", chats: "چت‌ها", alerts: "هشدارها", profile: "پروفایل" },
  Polish: { home: "Start", meetups: "Spotkania", chats: "Czaty", alerts: "Alerty", profile: "Profil" },
  Portuguese: { home: "Início", meetups: "Encontros", chats: "Chats", alerts: "Alertas", profile: "Perfil" },
  Romanian: { home: "Acasă", meetups: "Întâlniri", chats: "Chaturi", alerts: "Alerte", profile: "Profil" },
  Russian: { home: "Главная", meetups: "Встречи", chats: "Чаты", alerts: "Оповещения", profile: "Профиль" },
  Slovak: { home: "Domov", meetups: "Stretnutia", chats: "Chaty", alerts: "Upozornenia", profile: "Profil" },
  Spanish: { home: "Inicio", meetups: "Quedadas", chats: "Chats", alerts: "Alertas", profile: "Perfil" },
  Swedish: { home: "Hem", meetups: "Meetups", chats: "Chattar", alerts: "Aviseringar", profile: "Profil" },
  Thai: { home: "หน้าแรก", meetups: "มีตอัป", chats: "แชต", alerts: "แจ้งเตือน", profile: "โปรไฟล์" },
  Turkish: { home: "Ana Sayfa", meetups: "Meetup", chats: "Sohbetler", alerts: "Uyarılar", profile: "Profil" },
  Ukrainian: { home: "Головна", meetups: "Зустрічі", chats: "Чати", alerts: "Сповіщення", profile: "Профіль" },
  Urdu: { home: "ہوم", meetups: "میٹ اپس", chats: "چیٹس", alerts: "الرٹس", profile: "پروفائل" },
  Vietnamese: { home: "Trang chủ", meetups: "Meetup", chats: "Chat", alerts: "Cảnh báo", profile: "Hồ sơ" },
  Yiddish: { home: "היים", meetups: "מיטאפס", chats: "שמועסן", alerts: "מעלדונגען", profile: "פראפיל" },
};

export default function TabLayout() {
  const { isNightMode, appLanguage, appPalette, largerTouchTargets, reduceTransparency, boldText, simplifiedInterface, screenReaderHints, softSurfaces, clearBorders } = useAppSettings();
  const isDay = !isNightMode;
  const labels = tabLabels[getLanguageBase(appLanguage)] ?? tabLabels.English;
  const activeTintColor = appPalette.swatches[2];
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);

  return (
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: nsnColors.mutedSoft,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: boldText ? "800" : "600",
          lineHeight: 15,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
          marginBottom: 1,
        },
        tabBarStyle: {
          height: (largerTouchTargets ? 76 : 66) + bottomPadding,
          paddingTop: largerTouchTargets ? 12 : 9,
          paddingBottom: bottomPadding,
          backgroundColor: reduceTransparency ? (isDay ? "#F4F7F8" : "#0B1626") : isDay ? "#E8EDF2" : nsnColors.background,
          borderTopColor: clearBorders ? (isDay ? "#6F87A1" : "#5A6EA5") : softSurfaces ? (isDay ? "#DDE6EC" : "rgba(148,163,184,0.18)") : isDay ? "#C5D0DA" : nsnColors.border,
          borderTopWidth: clearBorders ? 1.5 : softSurfaces ? 0.6 : 0.8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: labels.home,
          tabBarAccessibilityLabel: screenReaderHints ? `${labels.home}. Opens your home feed and event suggestions.` : labels.home,
          tabBarIcon: ({ color }) => <IconSymbol size={largerTouchTargets ? 28 : simplifiedInterface ? 24 : 25} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="meetups"
        options={{
          title: labels.meetups,
          tabBarAccessibilityLabel: screenReaderHints ? `${labels.meetups}. Opens your joined and upcoming meetups.` : labels.meetups,
          tabBarIcon: ({ color }) => <IconSymbol size={largerTouchTargets ? 28 : simplifiedInterface ? 24 : 25} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: labels.chats,
          tabBarAccessibilityLabel: screenReaderHints ? `${labels.chats}. Opens meetup group chats and private chats.` : labels.chats,
          tabBarIcon: ({ color }) => <IconSymbol size={largerTouchTargets ? 28 : simplifiedInterface ? 24 : 25} name="message" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: labels.alerts,
          tabBarAccessibilityLabel: screenReaderHints ? `${labels.alerts}. Opens reminders and safety alerts.` : labels.alerts,
          tabBarIcon: ({ color }) => <IconSymbol size={largerTouchTargets ? 28 : simplifiedInterface ? 24 : 25} name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: labels.profile,
          tabBarAccessibilityLabel: screenReaderHints ? `${labels.profile}. Opens profile, preferences, and trust settings.` : labels.profile,
          tabBarIcon: ({ color }) => <IconSymbol size={largerTouchTargets ? 28 : simplifiedInterface ? 24 : 25} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="alpha-walkthrough"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="saved-places"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="location-preference"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="transportation-preference"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="contact-preference"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="food-preferences"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="hobbies-interests"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="user-preferences"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
