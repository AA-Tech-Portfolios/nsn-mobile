import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppSettings } from "@/lib/app-settings";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { nsnColors } from "@/lib/nsn-data";

export default function TabLayout() {
  const { isNightMode } = useAppSettings();
  const isDay = !isNightMode;
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);

  return (
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: nsnColors.primary,
        tabBarInactiveTintColor: nsnColors.mutedSoft,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarStyle: {
          height: 58 + bottomPadding,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          backgroundColor: isDay ? "#F4F9FF" : nsnColors.background,
          borderTopColor: isDay ? "#AFC4E6" : nsnColors.border,
          borderTopWidth: 0.8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="meetups"
        options={{
          title: "Meetups",
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="message" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <IconSymbol size={25} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
