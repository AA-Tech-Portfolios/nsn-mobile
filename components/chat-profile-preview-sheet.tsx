import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ProfileAvatar } from "@/components/profile-avatar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { ChatProfilePreview } from "@/lib/chat-profile-preview";
import { nsnColors } from "@/lib/nsn-data";

export function ChatProfilePreviewSheet({
  profile,
  visible,
  isDay = false,
  onClose,
}: {
  profile?: ChatProfilePreview;
  visible: boolean;
  isDay?: boolean;
  onClose: () => void;
}) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, isDay && styles.daySheet]} onPress={(event) => event.stopPropagation()}>
          {profile ? (
            <>
              <View style={styles.header}>
                <ProfileAvatar
                  displayName={profile.displayName}
                  avatarText={profile.avatarText}
                  tone={profile.avatarTone}
                  privateProfile={profile.avatarPrivate}
                  comfortMode={profile.privacyMode}
                  size={58}
                  isDay={isDay}
                />
                <View style={styles.identity}>
                  <Text style={[styles.name, isDay && styles.dayTitle]}>{profile.displayName}</Text>
                  <Text style={[styles.meta, isDay && styles.dayMuted]}>{profile.role} / {profile.privacyMode}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.82} onPress={onClose} style={[styles.closeButton, isDay && styles.dayCloseButton]} accessibilityRole="button" accessibilityLabel="Close profile preview">
                  <IconSymbol name="xmark" color={isDay ? "#53677A" : nsnColors.muted} size={18} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.trustPill, isDay && styles.dayPill]}>
                  <IconSymbol name="shield" color={isDay ? "#445E93" : "#C7B07A"} size={14} />
                  <Text style={[styles.trustText, isDay && styles.dayTitle]}>{profile.trustState}</Text>
                </View>

                {profile.about ? <Text style={[styles.about, isDay && styles.dayMuted]}>{profile.about}</Text> : null}
                {profile.hiddenDetailNote ? <Text style={[styles.privateNote, isDay && styles.dayPrivateNote]}>{profile.hiddenDetailNote}</Text> : null}

                <PreviewSection title="Vibes" items={profile.vibes} isDay={isDay} />
                <PreviewSection title="Shared interests" items={profile.sharedInterests} isDay={isDay} />
                <PreviewSection title="Comfort notes" items={profile.comfortNotes} isDay={isDay} />

                <View style={styles.boundaryStack}>
                  <BoundaryRow label="Photos" value={profile.photoBoundary} isDay={isDay} />
                  <BoundaryRow label="Contact" value={profile.contactBoundary} isDay={isDay} />
                </View>
              </ScrollView>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function PreviewSection({ title, items, isDay }: { title: string; items: string[]; isDay: boolean }) {
  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isDay && styles.dayMuted]}>{title}</Text>
      <View style={styles.chipRow}>
        {items.map((item) => (
          <Text key={item} style={[styles.chip, isDay && styles.dayChip]}>{item}</Text>
        ))}
      </View>
    </View>
  );
}

function BoundaryRow({ label, value, isDay }: { label: string; value: string; isDay: boolean }) {
  return (
    <View style={[styles.boundaryRow, isDay && styles.dayBoundaryRow]}>
      <Text style={[styles.boundaryLabel, isDay && styles.dayMuted]}>{label}</Text>
      <Text style={[styles.boundaryValue, isDay && styles.dayTitle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(2,8,20,0.58)",
    padding: 12,
  },
  sheet: {
    width: "100%",
    maxWidth: 440,
    maxHeight: "72%",
    alignSelf: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#536C9E",
    backgroundColor: "#0B1626",
    padding: 14,
  },
  daySheet: {
    backgroundColor: "#F4F7F8",
    borderColor: "#9FB2C8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingBottom: 10,
  },
  identity: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: nsnColors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 23,
  },
  meta: {
    color: nsnColors.muted,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.045)",
  },
  dayCloseButton: {
    backgroundColor: "#E8EEF3",
  },
  scroll: {
    width: "100%",
  },
  content: {
    gap: 12,
    paddingBottom: 8,
  },
  trustPill: {
    alignSelf: "flex-start",
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(247,200,91,0.42)",
    backgroundColor: "rgba(247,200,91,0.12)",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
  },
  dayPill: {
    backgroundColor: "#E8EEF3",
    borderColor: "#C5D0DA",
  },
  trustText: {
    color: nsnColors.text,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
  },
  about: {
    color: nsnColors.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
  privateNote: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(166,177,199,0.25)",
    backgroundColor: "rgba(255,255,255,0.04)",
    color: nsnColors.muted,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 18,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  dayPrivateNote: {
    backgroundColor: "#E8EEF3",
    borderColor: "#C5D0DA",
    color: "#53677A",
  },
  section: {
    gap: 7,
  },
  sectionTitle: {
    color: nsnColors.muted,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
    textTransform: "uppercase",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  chip: {
    minHeight: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#38527C",
    backgroundColor: "rgba(255,255,255,0.045)",
    color: nsnColors.text,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
    paddingHorizontal: 9,
    paddingVertical: 6,
    overflow: "hidden",
  },
  dayChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C5D0DA",
    color: "#0B1220",
  },
  boundaryStack: {
    gap: 8,
  },
  boundaryRow: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.035)",
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  dayBoundaryRow: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C5D0DA",
  },
  boundaryLabel: {
    color: nsnColors.muted,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
  },
  boundaryValue: {
    color: nsnColors.text,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
    marginTop: 2,
  },
  dayTitle: {
    color: "#0B1220",
  },
  dayMuted: {
    color: "#53677A",
  },
});
