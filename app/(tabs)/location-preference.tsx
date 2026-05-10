import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AustralianLocality, australianLocalities, getAustralianLocalityLabel } from "@/lib/australian-localities";
import { getLanguageBase, type SoftHelloIntent, useAppSettings } from "@/lib/app-settings";
import { nsnColors } from "@/lib/nsn-data";

const intentOptions: SoftHelloIntent[] = ["Friends", "Dating", "Both", "Exploring"];
const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const copyByLanguage = {
  English: {
    back: "Go back",
    title: "Location Preference",
    copy: "Keep your local area and what you are here for up to date.",
    suburbLabel: "Suburb or local area",
    suburbPlaceholder: "Chatswood",
    recognised: "Recognised:",
    chooseSuggestion: "Choose a suggestion to confirm your local area.",
    intentLabel: "I am here for",
    save: "Save preference",
    saved: "Saved",
    currentSummary: "Current preference",
  },
  Arabic: {
    title: "تفضيل الموقع",
    copy: "حدّث منطقتك المحلية وما تبحث عنه.",
    suburbLabel: "الضاحية أو المنطقة المحلية",
    suburbPlaceholder: "Chatswood",
    recognised: "تم التعرف على:",
    chooseSuggestion: "اختر اقتراحاً لتأكيد منطقتك المحلية.",
    intentLabel: "أنا هنا من أجل",
    save: "حفظ التفضيل",
    saved: "تم الحفظ",
    currentSummary: "التفضيل الحالي",
  },
  Hebrew: {
    title: "העדפת מיקום",
    copy: "עדכן את האזור המקומי שלך ואת מה שאתה מחפש כאן.",
    suburbLabel: "פרבר או אזור מקומי",
    suburbPlaceholder: "Chatswood",
    recognised: "זוהה:",
    chooseSuggestion: "בחר הצעה כדי לאשר את האזור המקומי שלך.",
    intentLabel: "אני כאן בשביל",
    save: "שמור העדפה",
    saved: "נשמר",
    currentSummary: "העדפה נוכחית",
  },
  Chinese: {
    back: "返回",
    title: "位置偏好",
    copy: "保持你的本地区域和来这里的目的为最新状态。",
    suburbLabel: "郊区或本地区域",
    suburbPlaceholder: "Chatswood",
    recognised: "已识别：",
    chooseSuggestion: "选择一个建议来确认你的本地区域。",
    intentLabel: "我来这里是为了",
    save: "保存偏好",
    saved: "已保存",
    currentSummary: "当前偏好",
  },
  Japanese: {
    back: "戻る",
    title: "場所の設定",
    copy: "地域とここで探していることを最新の状態に保ちます。",
    suburbLabel: "郊外または地域",
    suburbPlaceholder: "Chatswood",
    recognised: "認識済み:",
    chooseSuggestion: "候補を選んで地域を確認してください。",
    intentLabel: "ここで探しているもの",
    save: "設定を保存",
    saved: "保存しました",
    currentSummary: "現在の設定",
  },
  Korean: {
    back: "뒤로",
    title: "위치 선호",
    copy: "내 지역과 이곳에서 찾고 있는 목적을 최신 상태로 유지하세요.",
    suburbLabel: "교외 또는 지역",
    suburbPlaceholder: "Chatswood",
    recognised: "인식됨:",
    chooseSuggestion: "추천 항목을 선택해 지역을 확인하세요.",
    intentLabel: "이곳에 온 목적",
    save: "선호 저장",
    saved: "저장됨",
    currentSummary: "현재 선호",
  },
  Russian: {
    title: "Предпочтение локации",
    copy: "Обновите район и то, зачем вы здесь.",
    suburbLabel: "Пригород или район",
    suburbPlaceholder: "Chatswood",
    recognised: "Распознано:",
    chooseSuggestion: "Выберите подсказку, чтобы подтвердить район.",
    intentLabel: "Я здесь для",
    save: "Сохранить",
    saved: "Сохранено",
    currentSummary: "Текущие предпочтения",
  },
  Spanish: {
    title: "Preferencia de ubicación",
    copy: "Mantén actualizado tu barrio y lo que buscas aquí.",
    suburbLabel: "Suburbio o zona local",
    suburbPlaceholder: "Chatswood",
    recognised: "Reconocido:",
    chooseSuggestion: "Elige una sugerencia para confirmar tu zona local.",
    intentLabel: "Estoy aquí para",
    save: "Guardar preferencia",
    saved: "Guardado",
    currentSummary: "Preferencia actual",
  },
} as const;

const intentLabels: Record<string, Record<SoftHelloIntent, string>> = {
  Arabic: { Friends: "أصدقاء", Dating: "مواعدة", Both: "كلاهما", Exploring: "استكشاف" },
  Chinese: { Friends: "交朋友", Dating: "约会", Both: "两者皆可", Exploring: "探索" },
  Hebrew: { Friends: "חברים", Dating: "דייטינג", Both: "גם וגם", Exploring: "לחקור" },
  Russian: { Friends: "Друзья", Dating: "Свидания", Both: "Оба", Exploring: "Исследую" },
  Japanese: { Friends: "友達", Dating: "デート", Both: "両方", Exploring: "探索中" },
  Korean: { Friends: "친구", Dating: "데이트", Both: "둘 다", Exploring: "탐색 중" },
  Spanish: { Friends: "Amistad", Dating: "Citas", Both: "Ambos", Exploring: "Explorar" },
};

const normalizeLocalitySearch = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

const findMatchingLocality = (value: string) => {
  const normalizedValue = normalizeLocalitySearch(value);

  return australianLocalities.find((locality) => {
    const suburbName = normalizeLocalitySearch(locality.suburb);
    const label = normalizeLocalitySearch(getAustralianLocalityLabel(locality));

    return suburbName === normalizedValue || label === normalizedValue;
  });
};

export default function LocationPreferenceScreen() {
  const router = useRouter();
  const { appLanguage, intent, isNightMode, saveSoftHelloMvpState, suburb } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = copyByLanguage[appLanguageBase as keyof typeof copyByLanguage] ?? copyByLanguage.English;
  const locationCopy = { ...copyByLanguage.English, ...copy };
  const localIntentLabels = intentLabels[appLanguageBase] ?? {};
  const isDay = !isNightMode;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const [draftSuburb, setDraftSuburb] = useState(suburb || "Chatswood");
  const [selectedLocality, setSelectedLocality] = useState<AustralianLocality | undefined>(() => findMatchingLocality(suburb || "Chatswood"));
  const [draftIntent, setDraftIntent] = useState<SoftHelloIntent>(intent);
  const [showSaved, setShowSaved] = useState(false);

  const localitySuggestions = useMemo(() => {
    const query = normalizeLocalitySearch(draftSuburb);

    if (query.length < 2) {
      return [];
    }

    return australianLocalities
      .filter((locality) => {
        const suburbName = normalizeLocalitySearch(locality.suburb);
        const label = normalizeLocalitySearch(getAustralianLocalityLabel(locality));

        return suburbName.startsWith(query) || label.includes(query);
      })
      .slice(0, 6);
  }, [draftSuburb]);

  const updateSuburb = (value: string) => {
    setDraftSuburb(value);
    setSelectedLocality(findMatchingLocality(value));
    setShowSaved(false);
  };

  const selectLocality = (locality: AustralianLocality) => {
    setSelectedLocality(locality);
    setDraftSuburb(getAustralianLocalityLabel(locality));
    setShowSaved(false);
  };

  const savePreference = async () => {
    await saveSoftHelloMvpState({
      suburb: selectedLocality ? getAustralianLocalityLabel(selectedLocality) : draftSuburb.trim(),
      intent: draftIntent,
    });
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 1200);
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.back()}
          style={[styles.backButton, isDay && styles.dayIconButton]}
          accessibilityRole="button"
          accessibilityLabel={locationCopy.back}
        >
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <View style={[styles.headerCard, isDay && styles.dayCard]}>
          <Text style={[styles.title, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.title}</Text>
          <Text style={[styles.copy, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.copy}</Text>
        </View>

        <View style={[styles.summaryCard, isDay && styles.dayCard]}>
          <Text style={[styles.summaryLabel, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.currentSummary}</Text>
          <Text style={[styles.summaryText, isDay && styles.dayTitle, isRtl && styles.rtlText]}>
            {draftSuburb.trim() || copy.suburbPlaceholder} · {localIntentLabels[draftIntent] ?? draftIntent}
          </Text>
        </View>

        <View style={styles.formStack}>
          <View>
            <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.suburbLabel}</Text>
            <TextInput
              value={draftSuburb}
              onChangeText={updateSuburb}
              placeholder={copy.suburbPlaceholder}
              placeholderTextColor={isDay ? "#6E7F99" : nsnColors.mutedSoft}
              style={[styles.input, isDay && styles.dayInput, isRtl && styles.rtlInput]}
            />
            {selectedLocality ? (
              <Text style={[styles.localityStatus, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                {copy.recognised} {getAustralianLocalityLabel(selectedLocality)}
              </Text>
            ) : draftSuburb.trim().length >= 2 ? (
              <Text style={[styles.localityStatus, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>{copy.chooseSuggestion}</Text>
            ) : null}
            {localitySuggestions.length > 0 ? (
              <View style={[styles.localityList, isDay && styles.dayCard]}>
                {localitySuggestions.map((locality) => {
                  const selected =
                    selectedLocality &&
                    selectedLocality.suburb === locality.suburb &&
                    selectedLocality.state === locality.state &&
                    selectedLocality.postcode === locality.postcode;

                  return (
                    <TouchableOpacity
                      key={`${locality.suburb}-${locality.state}-${locality.postcode}`}
                      activeOpacity={0.82}
                      onPress={() => selectLocality(locality)}
                      style={[styles.localityOption, isRtl && styles.rtlRow, selected && styles.localityOptionActive]}
                    >
                      <View style={styles.localityBody}>
                        <Text style={[styles.localityName, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{locality.suburb}</Text>
                        <Text style={[styles.localityMeta, isDay && styles.dayMutedText, isRtl && styles.rtlText]}>
                          {locality.state} {locality.postcode}
                        </Text>
                      </View>
                      <Text style={[styles.localityCheck, selected && styles.localityCheckActive]}>{selected ? "✓" : ""}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          <View>
            <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.intentLabel}</Text>
            <View style={[styles.optionGrid, isRtl && styles.rtlRow]}>
              {intentOptions.map((option) => {
                const active = draftIntent === option;

                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.82}
                    onPress={() => {
                      setDraftIntent(option);
                      setShowSaved(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={localIntentLabels[option] ?? option}
                    accessibilityState={{ selected: active }}
                    style={[styles.intentOption, isDay && styles.dayChoice, active && styles.choiceActive]}
                  >
                    <Text style={[styles.choiceText, isDay && styles.dayMutedText, active && styles.choiceTextActive]}>
                      {localIntentLabels[option] ?? option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={savePreference}
          disabled={draftSuburb.trim().length < 2}
          style={[styles.primaryButton, draftSuburb.trim().length < 2 && styles.primaryButtonDisabled]}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>{showSaved ? copy.saved : copy.save}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  dayContainer: { backgroundColor: "#EAF4FF" },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 34, gap: 16 },
  backButton: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.04)" },
  dayIconButton: { backgroundColor: "#DCEEFF" },
  headerCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, padding: 16 },
  title: { color: nsnColors.text, fontSize: 26, fontWeight: "900", lineHeight: 32 },
  copy: { color: nsnColors.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  summaryCard: { borderRadius: 18, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: "rgba(255,255,255,0.025)", padding: 14 },
  summaryLabel: { color: nsnColors.muted, fontSize: 12, fontWeight: "800", lineHeight: 17, textTransform: "uppercase" },
  summaryText: { color: nsnColors.text, fontSize: 15, fontWeight: "800", lineHeight: 22, marginTop: 4 },
  formStack: { gap: 18 },
  label: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20, marginBottom: 8 },
  input: { minHeight: 50, borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, color: nsnColors.text, paddingHorizontal: 14, fontSize: 15, fontWeight: "700" },
  dayInput: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6", color: "#0B1220" },
  localityStatus: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 7 },
  localityList: { borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, overflow: "hidden", marginTop: 10 },
  localityOption: { minHeight: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: nsnColors.border },
  localityOptionActive: { backgroundColor: "rgba(56,72,255,0.16)" },
  localityBody: { flex: 1 },
  localityName: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  localityMeta: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginTop: 1 },
  localityCheck: { width: 24, color: nsnColors.muted, fontSize: 16, fontWeight: "900", textAlign: "center" },
  localityCheckActive: { color: nsnColors.primary },
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  intentOption: { minHeight: 44, minWidth: "47%", flexGrow: 1, alignItems: "center", justifyContent: "center", borderRadius: 16, borderWidth: 1, borderColor: nsnColors.border, backgroundColor: nsnColors.surface, paddingHorizontal: 12, paddingVertical: 10 },
  dayChoice: { backgroundColor: "#F8FBFF", borderColor: "#B8C9E6" },
  choiceActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  choiceText: { color: nsnColors.muted, fontSize: 13, fontWeight: "900", lineHeight: 18, textAlign: "center" },
  choiceTextActive: { color: "#FFFFFF" },
  primaryButton: { minHeight: 52, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: nsnColors.primary, paddingHorizontal: 18 },
  primaryButtonDisabled: { opacity: 0.45 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900", lineHeight: 20 },
  dayCard: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  dayTitle: { color: "#0B1220" },
  dayMutedText: { color: "#3B4A63" },
  rtlRow: { flexDirection: "row-reverse" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  rtlInput: { textAlign: "right", writingDirection: "rtl" },
});
