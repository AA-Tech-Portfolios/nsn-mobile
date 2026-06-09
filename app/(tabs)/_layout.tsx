import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getTranslationLanguageBase, useAppSettings } from "@/lib/app-settings";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { IconSymbolName } from "@/components/ui/icon-symbol-map";
import { nsnColors } from "@/lib/nsn-data";

type TabIconLabelProps = {
  boldText: boolean;
  color: string;
  label: string;
  name: IconSymbolName;
  size: number;
};

function TabIconLabel({ boldText, color, label, name, size }: TabIconLabelProps) {
  return (
    <View style={styles.tabIconLabel}>
      <IconSymbol size={size} name={name} color={color} />
      <Text numberOfLines={1} style={[styles.tabIconLabelText, { color }, boldText && styles.tabIconLabelTextBold]}>
        {label}
      </Text>
    </View>
  );
}

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
  const labels = tabLabels[getTranslationLanguageBase(appLanguage)] ?? tabLabels.English;
  const activeTintColor = appPalette.swatches[2];
  const insets = useSafeAreaInsets();
  const bottomSafeArea = Platform.OS === "web" ? Math.max(insets.bottom, 42) : Math.max(insets.bottom, 24);
  const tabContentHeight = largerTouchTargets ? 96 : 88;
  const tabIconSize = largerTouchTargets ? 28 : simplifiedInterface ? 24 : 25;
  const renderTabIcon = (name: IconSymbolName, label: string) =>
    function TabIconRenderer({ color }: { color: string }) {
      return <TabIconLabel boldText={boldText} color={color} label={label} name={name} size={tabIconSize} />;
    };

  return (
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: nsnColors.mutedSoft,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: boldText ? "800" : "600",
          lineHeight: 18,
          maxWidth: 70,
          marginTop: 2,
          marginBottom: Platform.OS === "web" ? 28 : 12,
          textAlign: "center",
        },
        tabBarIconStyle: {
          marginTop: 2,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          minHeight: tabContentHeight,
          height: tabContentHeight,
          paddingTop: largerTouchTargets ? 10 : 8,
          paddingBottom: largerTouchTargets ? 10 : 8,
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          overflow: "visible",
        },
        tabBarStyle: {
          minHeight: tabContentHeight + bottomSafeArea + 22,
          height: tabContentHeight + bottomSafeArea + 22,
          paddingTop: 8,
          paddingBottom: bottomSafeArea + 14,
          overflow: "visible",
          backgroundColor: reduceTransparency ? (isDay ? "#FFFFFF" : "#0B1626") : isDay ? "#FAFBFC" : nsnColors.background,
          borderTopColor: clearBorders ? (isDay ? "#6F89A8" : "#5A6EA5") : softSurfaces ? (isDay ? "#E6EDF5" : "rgba(148,163,184,0.18)") : isDay ? "#D8E1EA" : nsnColors.border,
          borderTopWidth: clearBorders ? 1.5 : softSurfaces ? 0.6 : 0.8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: labels.home,
          tabBarAccessibilityLabel: screenReaderHints ? `${labels.home}. Opens your home feed and event suggestions.` : labels.home,
          tabBarIcon: renderTabIcon("house.fill", labels.home),
        }}
      />
      <Tabs.Screen
        name="meetups"
        options={{
          title: labels.meetups,
          tabBarAccessibilityLabel: screenReaderHints ? `${labels.meetups}. Opens your joined and upcoming meetups.` : labels.meetups,
          tabBarIcon: renderTabIcon("calendar", labels.meetups),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: labels.chats,
          tabBarAccessibilityLabel: screenReaderHints ? `${labels.chats}. Opens meetup group chats and private chats.` : labels.chats,
          tabBarIcon: renderTabIcon("message", labels.chats),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: labels.alerts,
          tabBarAccessibilityLabel: screenReaderHints ? `${labels.alerts}. Opens reminders and safety alerts.` : labels.alerts,
          tabBarIcon: renderTabIcon("bell", labels.alerts),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: labels.profile,
          tabBarAccessibilityLabel: screenReaderHints ? `${labels.profile}. Opens profile, preferences, and trust settings.` : labels.profile,
          tabBarIcon: renderTabIcon("person.fill", labels.profile),
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

const styles = StyleSheet.create({
  tabIconLabel: {
    height: 56,
    minWidth: 68,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  tabIconLabelText: {
    maxWidth: 74,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 15,
    textAlign: "center",
  },
  tabIconLabelTextBold: {
    fontWeight: "800",
  },
});
