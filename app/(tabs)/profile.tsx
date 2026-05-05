import { useState } from "react";
import { View, Text, TextInput, Platform, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { nsnColors, profileVibes } from "@/lib/nsn-data";

const rows = [
  { icon: "calendar", label: "My Meetups", route: "/meetups" },
  { icon: "message", label: "My Chats", route: "/chats" },
  { icon: "group", label: "My Events", route: "/events" },
  { icon: "location", label: "Saved Places", route: "/saved-places" },
  { icon: "settings", label: "Settings & Privacy", route: "/settings" },
] as const;

export default function ProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState("Alon");
  const [isEditingName, setIsEditingName] = useState(false);

  const [selectedVibes, setSelectedVibes] = useState(profileVibes);
  const [isEditingVibes, setIsEditingVibes] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const [aboutMe, setAboutMe] = useState(
    "I enjoy meaningful conversations, board games, good coffee and exploring new places around the North Shore."
  );

  const [showSaved, setShowSaved] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);

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
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleAvatarPress = () => {
    setShowPhotoMenu(!showPhotoMenu);
  };

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((item) => item !== vibe));
    } else if (selectedVibes.length < 5) {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background">
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRight}>
          <TouchableOpacity activeOpacity={0.75} style={styles.settingsButton}>
            <IconSymbol name="settings" color={nsnColors.text} size={23} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={handleAvatarPress} 
            style={styles.avatarRing}
          
            accessibilityRole="button"
            accessibilityLabel={
              profilePhoto
                ? "Edit profile photo"
                : "Add profile photo"
            }
            accessibilityHint="Opens profile photo options"
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleAvatarPress} 
            style={styles.photoButton} 
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={ profilePhoto ? "Edit profile photo" : "Add profile photo"}  
          >
            <Text style={styles.photoButtonText}>
              {profilePhoto ? "Edit photo" : "Add photo"}
            </Text>
          </TouchableOpacity>
                
          {showPhotoMenu && (
            <View style={styles.photoMenu}>
          <TouchableOpacity
            style={styles.photoMenuItem}
            onPress={() => {
            setShowPhotoMenu(false);
            pickProfilePhoto();
          }}
    >
      <Text style={styles.photoMenuText}>
        {profilePhoto ? "Change photo" : "Choose photo"}
      </Text>
    </TouchableOpacity>

    {profilePhoto && (
      <TouchableOpacity
        style={styles.photoMenuItem}
        onPress={() => {
          setProfilePhoto(null);
          setShowPhotoMenu(false);
        }}
      >
        <Text style={styles.photoMenuDeleteText}>Remove photo</Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={styles.photoMenuItem}
      onPress={() => setShowPhotoMenu(false)}
    >
      <Text style={styles.photoMenuText}>Cancel</Text>
    </TouchableOpacity>
  </View>
)}
          <View style={styles.nameRow}>
            {isEditingName ? (
              <TextInput
                value={name}
                onChangeText={setName}
                autoFocus
                style={styles.nameInput}
                selectionColor="#7786FF"
                onSubmitEditing={() => setIsEditingName(false)}
              />
            ) : (
              <Text style={styles.name}>{name}</Text>
            )}

            <TouchableOpacity
              onPress={() => setIsEditingName(!isEditingName)}

              accessibilityRole="button"
              accessibilityLabel={
                isEditingName
                  ? "Save name"
                  : "Edit name"
              }
            >

              {isEditingName ? (
                <Text style={styles.editText}>Done</Text>
              ) : (
                <IconSymbol name="edit" color={nsnColors.muted} size={18} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>My Vibes</Text>

          <Text style={styles.editText} onPress={() => setIsEditingVibes(!isEditingVibes)}>
            {isEditingVibes ? "Done" : "Edit"}
          </Text>
        </View>

        <View style={styles.vibeGrid}>
          {profileVibes.map((vibe) => {
            const selected = selectedVibes.includes(vibe);

            if (!isEditingVibes && !selected) return null;

            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`${vibe}`}
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
                <Text style={[styles.vibeChip, isEditingVibes && !selected && styles.vibeChipMuted]}>
                  {selected ? vibe : `＋ ${vibe}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>About me</Text>
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
            {showSaved ? "Saved ✓" : isEditingAbout ? "Save" : "Edit"}
          </Text>
        </View>

        <View style={styles.aboutCard}>
          {isEditingAbout ? (
            <TextInput
              style={[styles.aboutText, styles.aboutInput]}
              value={aboutMe}
              onChangeText={setAboutMe}
              autoFocus
              multiline
              selectionColor="#7786FF"
              underlineColorAndroid="transparent"
            />
          ) : (
            <Text style={styles.aboutText}>{aboutMe}</Text>
          )}
        </View>

        <View style={styles.settingsList}>
          {rows.map((row, index) => (
            <TouchableOpacity 
              key={row.label}
              accessibilityRole="button"
              accessibilityLabel={row.label}
              accessibilityHint="Opens section"
              activeOpacity={0.78}
              onPress={() => router.push(row.route as any)}
              style={[styles.row, index < rows.length - 1 && styles.rowBorder]}
            >

              <IconSymbol name={row.icon} color={nsnColors.muted} size={22} />
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 30 },
  topRight: { alignItems: "flex-end", marginBottom: 8 },
  settingsButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)" },
  profileHeader: { alignItems: "center", marginBottom: 22 },
  avatar: { width: 90, height: 90, borderRadius: 45, alignItems: "center", justifyContent: "center", backgroundColor: "#1590C9" },
  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  avatarRing: { width: 104, height: 104, borderRadius: 52, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: nsnColors.primary, backgroundColor: "rgba(56,72,255,0.10)" },
  avatarText: { color: nsnColors.text, fontSize: 38, fontWeight: "900" },
  photoButton: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, alignSelf: "center", },
  photoButtonText: { color: "#7786FF", fontSize: 12, fontWeight: "800" },
  photoMenu: { marginTop: 8, width: 185, borderRadius: 14, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, overflow: "hidden", alignSelf: "center", },
  photoMenuItem: { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: nsnColors.border, },
  photoMenuItemLast: { paddingVertical: 12, paddingHorizontal: 14, },
  photoMenuText: { color: nsnColors.text, fontSize: 13, fontWeight: "700", textAlign: "center", },
  photoMenuDeleteText: { color: "#FF6B6B", fontSize: 13, fontWeight: "800", textAlign: "center", },
  name: { color: nsnColors.text, fontSize: 26, fontWeight: "800", lineHeight: 33 },
  nameInput: { color: nsnColors.text, fontSize: 26, fontWeight: "800", lineHeight: 33, textAlign: "center", minWidth: 120, borderBottomWidth: 1, borderBottomColor: nsnColors.primary, paddingVertical: 2 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12 },
  sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionTitle: { color: nsnColors.text, fontSize: 16, fontWeight: "800", lineHeight: 23 },
  editText: { color: "#7786FF", fontSize: 13, fontWeight: "700" },
  vibeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  vibeChip: { color: nsnColors.text, fontSize: 13, lineHeight: 18, fontWeight: "700", paddingHorizontal: 13, paddingVertical: 9, borderRadius: 14, backgroundColor: nsnColors.surface, borderWidth: 1, borderColor: nsnColors.border, overflow: "hidden" },
  vibeChipMuted: { opacity: 0.45, borderStyle: "dashed" },
  aboutCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.025)", padding: 15, marginBottom: 16 },
  aboutInput: { minHeight: 80, textAlignVertical: "top", padding: 0, margin: 0, borderWidth: 0, backgroundColor: "transparent", ...(Platform.OS === "web" ? ({ outlineStyle: "none", outlineWidth: 0, outlineColor: "transparent", boxShadow: "none", appearance: "none", caretColor: "#7786FF" } as any) : {}) },
  aboutText: { color: nsnColors.text, fontSize: 15, lineHeight: 23 },
  settingsList: { borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface },
  row: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: nsnColors.border },
  rowIcon: { width: 30, color: nsnColors.text, fontSize: 17 },
  rowLabel: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "600", lineHeight: 20 },
  rowChevron: { color: nsnColors.muted, fontSize: 26, lineHeight: 30 },
});