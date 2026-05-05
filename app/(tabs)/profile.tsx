import { useState } from "react";
import { View, Text, TextInput, Platform, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { nsnColors, profileVibes } from "@/lib/nsn-data";

const rows = [
  { icon: "calendar", key: "meetups", route: "/meetups" },
  { icon: "message", key: "chats", route: "/chats" },
  { icon: "group", key: "events", route: "/events" },
  { icon: "location", key: "places", route: "/saved-places" },
  { icon: "settings", key: "settings", route: "/settings" },
] as const;

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
    myVibes: "הווייבים שלי",
    about: "עליי",
    aboutText: "אני נהנה משיחות משמעותיות, משחקי קופסה, קפה טוב וגילוי מקומות חדשים באזור North Shore.",
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
    myVibes: "Mis vibes",
    about: "Sobre mí",
    aboutText: "Disfruto conversaciones con sentido, juegos de mesa, buen café y explorar lugares nuevos por North Shore.",
    rows: { meetups: "Mis quedadas", chats: "Mis chats", events: "Mis eventos", places: "Lugares guardados", settings: "Configuración y privacidad" },
  },
} as const;

export default function ProfileScreen() {
  const router = useRouter();
  const { isNightMode, blurProfilePhoto, appLanguage } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const isDay = !isNightMode;
  const copy = profileTranslations[appLanguageBase as keyof typeof profileTranslations] ?? profileTranslations.English;

  const [name, setName] = useState("Alon");
  const [isEditingName, setIsEditingName] = useState(false);

  const [selectedVibes, setSelectedVibes] = useState(profileVibes);
  const [isEditingVibes, setIsEditingVibes] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const [aboutMe, setAboutMe] = useState<string>(copy.aboutText);

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
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRight}>
          <TouchableOpacity activeOpacity={0.75} style={[styles.settingsButton, isDay && styles.dayIconButton]}>
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
              profilePhoto
                ? "Edit profile photo"
                : "Add profile photo"
            }
            accessibilityHint="Opens profile photo options"
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatarImage} blurRadius={blurProfilePhoto ? 12 : 0} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleAvatarPress} 
            style={[styles.photoButton, isDay && styles.dayPhotoButton]} 
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={ profilePhoto ? "Edit profile photo" : "Add profile photo"}  
          >
            <Text style={[styles.photoButtonText, isDay && styles.dayPhotoButtonText]}>
              {profilePhoto ? copy.editPhoto : copy.addPhoto}
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
        {profilePhoto ? copy.changePhoto : copy.choosePhoto}
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
          <View style={styles.nameRow}>
            {isEditingName ? (
              <TextInput
                value={name}
                onChangeText={setName}
                autoFocus
                style={[styles.nameInput, isDay && styles.dayTitle]}
                selectionColor="#7786FF"
                onSubmitEditing={() => setIsEditingName(false)}
              />
            ) : (
              <Text style={[styles.name, isDay && styles.dayTitle]}>{name}</Text>
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
                <Text style={styles.editText}>{copy.done}</Text>
              ) : (
                <IconSymbol name="edit" color={isDay ? "#3B4A63" : nsnColors.muted} size={18} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>{copy.myVibes}</Text>

          <Text style={styles.editText} onPress={() => setIsEditingVibes(!isEditingVibes)}>
            {isEditingVibes ? copy.done : copy.edit}
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
                <Text style={[styles.vibeChip, isDay && styles.dayCard, isDay && styles.dayTitle, isEditingVibes && !selected && styles.vibeChipMuted]}>
                  {selected ? vibe : `＋ ${vibe}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, isDay && styles.dayTitle]}>{copy.about}</Text>
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
              style={[styles.aboutText, styles.aboutInput, isDay && styles.dayTitle]}
              value={aboutMe}
              onChangeText={setAboutMe}
              autoFocus
              multiline
              selectionColor="#7786FF"
              underlineColorAndroid="transparent"
            />
          ) : (
            <Text style={[styles.aboutText, isDay && styles.dayTitle]}>{aboutMe}</Text>
          )}
        </View>

        <View style={[styles.settingsList, isDay && styles.dayCard]}>
          {rows.map((row, index) => (
            <TouchableOpacity 
              key={row.key}
              accessibilityRole="button"
              accessibilityLabel={copy.rows[row.key]}
              accessibilityHint="Opens section"
              activeOpacity={0.78}
              onPress={() => router.push(row.route as any)}
              style={[styles.row, index < rows.length - 1 && styles.rowBorder, isDay && index < rows.length - 1 && styles.dayRowBorder]}
            >

              <IconSymbol name={row.icon} color={isDay ? "#3B4A63" : nsnColors.muted} size={22} />
              <Text style={[styles.rowLabel, isDay && styles.dayTitle]}>{copy.rows[row.key]}</Text>
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
  dayRowBorder: { borderBottomColor: "#B8C9E6" },
  rowIcon: { width: 30, color: nsnColors.text, fontSize: 17 },
  rowLabel: { flex: 1, color: nsnColors.text, fontSize: 14, fontWeight: "600", lineHeight: 20 },
  rowChevron: { color: nsnColors.muted, fontSize: 26, lineHeight: 30 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
});
