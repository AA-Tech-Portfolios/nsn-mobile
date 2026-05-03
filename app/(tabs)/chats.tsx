import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { chatSeed, nsnColors } from "@/lib/nsn-data";

type ChatMessage = (typeof chatSeed)[number];

export default function ChatsScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatSeed);
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { id: String(Date.now()), name: "You", avatar: "Y", text: trimmed, time: "Now", mine: true },
    ]);
    setDraft("");
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.eventAvatar}><Text style={styles.eventEmoji}>🍿</Text></View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Movie Night — Watch + Chat</Text>
            <Text style={styles.subtitle}>4 members</Text>
          </View>
          <TouchableOpacity activeOpacity={0.75} style={styles.iconButton}>
            <IconSymbol name="more" color={nsnColors.text} size={22} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.chat} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
          <View style={styles.dayPill}><Text style={styles.dayPillText}>Today</Text></View>
          <View style={styles.systemNotice}>
            <Text style={styles.systemText}>You joined the group</Text>
            <Text style={styles.systemSubtext}>This chat is only for this meetup.</Text>
          </View>

          {messages.map((message) => (
            <View key={message.id} style={[styles.messageRow, message.mine && styles.messageRowMine]}>
              {!message.mine && <View style={styles.avatar}><Text style={styles.avatarText}>{message.avatar}</Text></View>}
              <View style={[styles.messageBlock, message.mine && styles.messageBlockMine]}>
                {!message.mine && <Text style={styles.senderName}>{message.name}</Text>}
                <View style={[styles.bubble, message.mine ? styles.myBubble : styles.theirBubble]}>
                  <Text style={styles.bubbleText}>{message.text}</Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composerWrap}>
          <TouchableOpacity activeOpacity={0.75} style={styles.addButton}>
            <IconSymbol name="add" color={nsnColors.text} size={24} />
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Type a message..."
              placeholderTextColor={nsnColors.mutedSoft}
              style={styles.input}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity activeOpacity={0.8} onPress={sendMessage} style={styles.sendButton}>
              <IconSymbol name="paperplane.fill" color={nsnColors.text} size={19} />
            </TouchableOpacity>
          </View>
          <Text style={styles.disclaimer}>Chat disappears after the meetup.</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background, paddingHorizontal: 18 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingTop: 8, paddingBottom: 12, borderBottomWidth: 1, borderColor: nsnColors.border },
  eventAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#26133F", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.primary },
  eventEmoji: { fontSize: 22 },
  headerText: { flex: 1 },
  title: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 21 },
  subtitle: { color: nsnColors.muted, fontSize: 12, lineHeight: 17 },
  iconButton: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  chat: { flex: 1 },
  chatContent: { paddingTop: 16, paddingBottom: 16 },
  dayPill: { alignSelf: "center", backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 13, paddingVertical: 7, borderRadius: 15, marginBottom: 14 },
  dayPillText: { color: nsnColors.muted, fontSize: 12, fontWeight: "700" },
  systemNotice: { alignSelf: "center", width: "68%", borderRadius: 16, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, paddingVertical: 12, paddingHorizontal: 13, marginBottom: 18 },
  systemText: { color: nsnColors.text, textAlign: "center", fontSize: 12, lineHeight: 17 },
  systemSubtext: { color: nsnColors.muted, textAlign: "center", fontSize: 12, lineHeight: 17 },
  messageRow: { flexDirection: "row", gap: 9, marginBottom: 14, alignItems: "flex-end" },
  messageRowMine: { justifyContent: "flex-end" },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#164E6A", alignItems: "center", justifyContent: "center" },
  avatarText: { color: nsnColors.text, fontSize: 13, fontWeight: "800" },
  messageBlock: { maxWidth: "76%" },
  messageBlockMine: { alignItems: "flex-end" },
  senderName: { color: nsnColors.muted, fontSize: 12, marginBottom: 4, lineHeight: 16 },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 8 },
  theirBubble: { backgroundColor: nsnColors.surface, borderTopLeftRadius: 8 },
  myBubble: { backgroundColor: nsnColors.primary, borderBottomRightRadius: 8 },
  bubbleText: { color: nsnColors.text, fontSize: 14, lineHeight: 20 },
  messageTime: { alignSelf: "flex-end", color: "rgba(245,247,255,0.62)", fontSize: 11, marginTop: 4, lineHeight: 14 },
  composerWrap: { paddingBottom: 10 },
  addButton: { position: "absolute", left: 0, bottom: 42, width: 40, height: 40, borderRadius: 20, backgroundColor: nsnColors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nsnColors.border },
  inputWrap: { marginLeft: 48, minHeight: 44, borderRadius: 22, backgroundColor: "#061121", borderWidth: 1, borderColor: nsnColors.border, flexDirection: "row", alignItems: "center", paddingLeft: 15, paddingRight: 5 },
  input: { flex: 1, color: nsnColors.text, fontSize: 14, minHeight: 42 },
  sendButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: nsnColors.primary, alignItems: "center", justifyContent: "center" },
  disclaimer: { color: nsnColors.muted, fontSize: 11, textAlign: "center", marginTop: 8, lineHeight: 15 },
});
