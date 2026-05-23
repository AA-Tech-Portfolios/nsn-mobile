import { StyleSheet, Text, View } from "react-native";

import { nsnColors } from "@/lib/nsn-data";

type PrototypeLocalNoteProps = {
  isDay?: boolean;
  label?: string;
};

export function PrototypeLocalNote({ isDay = false, label = "Prototype-only / stored locally" }: PrototypeLocalNoteProps) {
  return (
    <View style={[styles.note, isDay && styles.dayNote]}>
      <Text style={[styles.text, isDay && styles.dayText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(168,183,218,0.28)",
    backgroundColor: "rgba(255,255,255,0.035)",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  dayNote: {
    borderColor: "#C5D0DA",
    backgroundColor: "#E8EEF3",
  },
  text: {
    color: nsnColors.muted,
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14,
  },
  dayText: {
    color: "#53677A",
  },
});
