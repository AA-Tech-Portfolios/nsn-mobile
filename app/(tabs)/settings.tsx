import { View, Text, StyleSheet, Switch } from "react-native";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";
import { useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";

export default function SettingsScreen() {
  const { isNightMode } = useAppSettings();
  const isDay = !isNightMode;

  const [blurPhoto, setBlurPhoto] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <View style={[styles.container, isDay && styles.dayContainer]}>
        <Text style={[styles.title, isDay && styles.dayTitle]}>Settings & Privacy</Text>
        <Text style={[styles.subtitle, isDay && styles.daySubtitle]}>
          Choose how you want others to see you.
        </Text>

        <View style={[styles.card, isDay && styles.dayCard]}>
          <View style={styles.row}>
            <Text style={[styles.label, isDay && styles.dayLabel]}>Blur profile photo</Text>
            <Switch
              value={blurPhoto}
              onValueChange={setBlurPhoto}
            />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, isDay && styles.dayLabel]}>Private profile</Text>
            <Switch
              value={privateProfile}
              onValueChange={setPrivateProfile}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  dayTitle: {
    color: "#0B1220",
  },
  subtitle: {
    color: nsnColors.muted,
    fontSize: 15,
    marginBottom: 20,
  },
  daySubtitle: {
    color: "#3B4A63",
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: nsnColors.surface,
    padding: 18,
    gap: 18,
  },
  dayCard: {
    backgroundColor: "#F4F9FF",
    borderColor: "#AFC4E6",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: nsnColors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  dayLabel: {
    color: "#0B1220",
  },
});