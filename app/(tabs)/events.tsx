import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { nsnColors } from "@/lib/nsn-data";

const CREATED_EVENTS_KEY = "nsn.created-events.v1";

const noiseLevels = ["Quiet", "Balanced", "Lively"] as const;
const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu"]);

const eventsTranslations = {
  English: {
    title: "My Events",
    subtitle: "Create your own experiences and invite others on your terms.",
    createEvent: "＋ Create Event",
    emptyTitle: "No events created yet",
    emptyCopy: "Host a coffee meetup, movie night, board games, walk, study session or anything that feels like you.",
    sheetTitle: "Create Event",
    sheetSubtitle: "Set the plan, the place, and the vibe.",
    eventName: "Event name",
    eventNamePlaceholder: "Board games and coffee",
    date: "Date",
    datePlaceholder: "24 May",
    time: "Time",
    timePlaceholder: "6:30pm",
    venue: "Venue",
    venuePlaceholder: "Chatswood Social Cafe",
    backupVenue: "Bad weather backup",
    backupVenuePlaceholder: "Indoor table at nearby cafe",
    noiseLevel: "Noise level",
    address: "Address",
    addressPlaceholder: "Enter an address or pick below",
    mapReady: "OpenStreetMap / MapLibre ready",
    chooseFromMap: "Choose from map",
    mapCopy: "Pick a suggested North Shore place now. This panel can host a MapLibre map when native map tiles are added.",
    description: "Description",
    descriptionPlaceholder: "What should people expect?",
    backupPrefix: "Backup",
    save: "Create Event",
    noise: { Quiet: "Quiet", Balanced: "Balanced", Lively: "Lively" },
  },
  Hebrew: {
    title: "האירועים שלי",
    subtitle: "צור חוויות משלך והזמן אחרים בתנאים שמתאימים לך.",
    createEvent: "＋ יצירת אירוע",
    emptyTitle: "עדיין לא נוצרו אירועים",
    emptyCopy: "אפשר לארח קפה, ערב סרט, משחקי קופסה, הליכה, מפגש לימוד או כל דבר שמרגיש לך נכון.",
    sheetTitle: "יצירת אירוע",
    sheetSubtitle: "קבע את התוכנית, המקום והאווירה.",
    eventName: "שם האירוע",
    eventNamePlaceholder: "משחקי קופסה וקפה",
    date: "תאריך",
    datePlaceholder: "24 במאי",
    time: "שעה",
    timePlaceholder: "18:30",
    venue: "מקום",
    venuePlaceholder: "בית קפה חברתי בצ'אטסווד",
    backupVenue: "חלופה למזג אוויר גרוע",
    backupVenuePlaceholder: "שולחן בפנים בבית קפה קרוב",
    noiseLevel: "רמת רעש",
    address: "כתובת",
    addressPlaceholder: "הקלד כתובת או בחר מהרשימה",
    mapReady: "מוכן ל-OpenStreetMap / MapLibre",
    chooseFromMap: "בחר מהמפה",
    mapCopy: "בחר כרגע מקום מוצע באזור North Shore. הפאנל הזה יוכל להכיל מפת MapLibre כשיתווספו אריחי מפה.",
    description: "תיאור",
    descriptionPlaceholder: "למה אנשים יכולים לצפות?",
    backupPrefix: "חלופה",
    save: "יצירת אירוע",
    noise: { Quiet: "שקט", Balanced: "מאוזן", Lively: "תוסס" },
  },
} as const;

const placeSuggestions = [
  {
    id: "lane-cove-library",
    name: "Lane Cove Library",
    address: "Library Walk, Lane Cove NSW",
    coordinates: "33.8145°S, 151.1690°E",
  },
  {
    id: "chatswood-interchange",
    name: "Chatswood Interchange",
    address: "Railway Street, Chatswood NSW",
    coordinates: "33.7974°S, 151.1803°E",
  },
  {
    id: "north-sydney-civic",
    name: "North Sydney Civic Centre",
    address: "200 Miller Street, North Sydney NSW",
    coordinates: "33.8342°S, 151.2089°E",
  },
];

type NoiseLevel = (typeof noiseLevels)[number];

type CreatedEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  backupVenue: string;
  noiseLevel: NoiseLevel;
  address: string;
  mapPlace: string;
  coordinates: string;
  description: string;
};

type EventDraft = Omit<CreatedEvent, "id">;

const emptyDraft: EventDraft = {
  title: "",
  date: "",
  time: "",
  venue: "",
  backupVenue: "",
  noiseLevel: "Balanced",
  address: "",
  mapPlace: "",
  coordinates: "",
  description: "",
};

const createEventId = (title: string) => {
  const slug = title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42);

  return `${slug || "event"}-${Date.now().toString(36)}`;
};

export default function EventsScreen() {
  const { isNightMode, appLanguage } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = eventsTranslations[appLanguageBase as keyof typeof eventsTranslations] ?? eventsTranslations.English;
  const isRtl = rtlLanguages.has(appLanguageBase);
  const isDay = !isNightMode;
  const [createdEvents, setCreatedEvents] = useState<CreatedEvent[]>([]);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [draft, setDraft] = useState<EventDraft>(emptyDraft);

  const isDraftValid = useMemo(
    () => Boolean(draft.title.trim() && draft.date.trim() && draft.time.trim() && draft.venue.trim() && draft.address.trim()),
    [draft.address, draft.date, draft.time, draft.title, draft.venue]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadCreatedEvents() {
      try {
        const storedEvents = await AsyncStorage.getItem(CREATED_EVENTS_KEY);

        if (storedEvents && isMounted) {
          setCreatedEvents(JSON.parse(storedEvents) as CreatedEvent[]);
        }
      } catch (error) {
        console.log("Created events could not load:", error);
      }
    }

    loadCreatedEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveEvents = async (events: CreatedEvent[]) => {
    setCreatedEvents(events);

    try {
      await AsyncStorage.setItem(CREATED_EVENTS_KEY, JSON.stringify(events));
    } catch (error) {
      console.log("Created events could not save:", error);
    }
  };

  const updateDraft = (field: keyof EventDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const selectPlace = (place: (typeof placeSuggestions)[number]) => {
    setDraft((current) => ({
      ...current,
      address: place.address,
      mapPlace: place.name,
      coordinates: place.coordinates,
      venue: current.venue || place.name,
    }));
  };

  const resetCreator = () => {
    setDraft(emptyDraft);
    setIsCreatorOpen(false);
  };

  const createEvent = () => {
    if (!isDraftValid) {
      return;
    }

    const newEvent: CreatedEvent = {
      ...draft,
      id: createEventId(draft.title),
      title: draft.title.trim(),
      date: draft.date.trim(),
      time: draft.time.trim(),
      venue: draft.venue.trim(),
      backupVenue: draft.backupVenue.trim(),
      address: draft.address.trim(),
      mapPlace: draft.mapPlace.trim(),
      coordinates: draft.coordinates.trim(),
      description: draft.description.trim(),
    };

    saveEvents([newEvent, ...createdEvents]);
    resetCreator();
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.title}</Text>

        <Text style={[styles.subtitle, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>
          {copy.subtitle}
        </Text>

        <TouchableOpacity style={styles.createButton} activeOpacity={0.8} onPress={() => setIsCreatorOpen(true)}>
          <Text style={[styles.createButtonText, isRtl && styles.rtlText]}>{copy.createEvent}</Text>
        </TouchableOpacity>

        {createdEvents.length === 0 ? (
          <View style={[styles.card, isDay && styles.dayCard]}>
            <Text style={[styles.cardTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.emptyTitle}</Text>

            <Text style={[styles.cardText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>
              {copy.emptyCopy}
            </Text>
          </View>
        ) : (
          <View style={styles.eventList}>
            {createdEvents.map((event) => (
              <View key={event.id} style={[styles.eventCard, isDay && styles.dayCard]}>
                <View style={[styles.eventHeader, isRtl && styles.rtlRow]}>
                  <View style={[styles.noiseBadge, event.noiseLevel === "Quiet" && styles.quietBadge, event.noiseLevel === "Lively" && styles.livelyBadge]}>
                    <Text style={styles.noiseBadgeText}>{copy.noise[event.noiseLevel]}</Text>
                  </View>
                  <Text style={[styles.eventDate, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{event.date} · {event.time}</Text>
                </View>
                <Text style={[styles.eventTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{event.title}</Text>
                <Text style={[styles.eventMeta, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>⌖ {event.venue}</Text>
                <Text style={[styles.eventMeta, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>◎ {event.mapPlace || event.address}</Text>
                {event.backupVenue ? (
                  <Text style={[styles.eventMeta, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>☔ {copy.backupPrefix}: {event.backupVenue}</Text>
                ) : null}
                {event.description ? (
                  <Text style={[styles.eventDescription, isDay && styles.dayText, isRtl && styles.rtlText]}>{event.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal animationType="slide" visible={isCreatorOpen} onRequestClose={resetCreator}>
        <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
          <ScrollView style={[styles.screen, isDay && styles.dayContainer]} contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.sheetHeader, isRtl && styles.rtlRow]}>
              <View>
                <Text style={[styles.sheetTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.sheetTitle}</Text>
                <Text style={[styles.sheetSubtitle, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{copy.sheetSubtitle}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.75} onPress={resetCreator} style={[styles.closeButton, isDay && styles.dayCloseButton]}>
                <Text style={[styles.closeText, isDay && styles.dayTitle]}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formStack}>
              <LabeledInput label={copy.eventName} value={draft.title} onChangeText={(value) => updateDraft("title", value)} placeholder={copy.eventNamePlaceholder} isDay={isDay} isRtl={isRtl} />

              <View style={[styles.inlineFields, isRtl && styles.rtlRow]}>
                <View style={styles.inlineField}>
                  <LabeledInput label={copy.date} value={draft.date} onChangeText={(value) => updateDraft("date", value)} placeholder={copy.datePlaceholder} isDay={isDay} isRtl={isRtl} />
                </View>
                <View style={styles.inlineField}>
                  <LabeledInput label={copy.time} value={draft.time} onChangeText={(value) => updateDraft("time", value)} placeholder={copy.timePlaceholder} isDay={isDay} isRtl={isRtl} />
                </View>
              </View>

              <LabeledInput label={copy.venue} value={draft.venue} onChangeText={(value) => updateDraft("venue", value)} placeholder={copy.venuePlaceholder} isDay={isDay} isRtl={isRtl} />
              <LabeledInput label={copy.backupVenue} value={draft.backupVenue} onChangeText={(value) => updateDraft("backupVenue", value)} placeholder={copy.backupVenuePlaceholder} isDay={isDay} isRtl={isRtl} />

              <View>
                <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.noiseLevel}</Text>
                <View style={[styles.noiseRow, isRtl && styles.rtlRow]}>
                  {noiseLevels.map((level) => {
                    const active = draft.noiseLevel === level;

                    return (
                      <TouchableOpacity
                        key={level}
                        activeOpacity={0.82}
                        onPress={() => setDraft((current) => ({ ...current, noiseLevel: level }))}
                        style={[styles.noiseOption, isDay && styles.dayNoiseOption, active && styles.noiseOptionActive]}
                      >
                        <Text style={[styles.noiseOptionText, isDay && styles.daySubtitle, active && styles.noiseOptionTextActive]}>{copy.noise[level]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <LabeledInput label={copy.address} value={draft.address} onChangeText={(value) => updateDraft("address", value)} placeholder={copy.addressPlaceholder} isDay={isDay} isRtl={isRtl} />

              <View style={[styles.mapPanel, isDay && styles.dayMapPanel]}>
                <View style={styles.mapGrid}>
                  <Text style={styles.mapPin}>⌖</Text>
                  <Text style={styles.mapWatermark}>{copy.mapReady}</Text>
                </View>
                <Text style={[styles.mapTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{draft.mapPlace || copy.chooseFromMap}</Text>
                <Text style={[styles.mapCopy, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>
                  {draft.coordinates || copy.mapCopy}
                </Text>
              </View>

              <View style={styles.placeList}>
                {placeSuggestions.map((place) => {
                  const selected = draft.mapPlace === place.name;

                  return (
                    <TouchableOpacity
                      key={place.id}
                      activeOpacity={0.82}
                      onPress={() => selectPlace(place)}
                      style={[styles.placeOption, isDay && styles.dayPlaceOption, selected && styles.placeOptionActive, isRtl && styles.rtlRow]}
                    >
                      <View style={styles.placeCopy}>
                        <Text style={[styles.placeName, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{place.name}</Text>
                        <Text style={[styles.placeAddress, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{place.address}</Text>
                      </View>
                      <Text style={[styles.placeCheck, selected && styles.placeCheckActive]}>{selected ? "✓" : ""}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <LabeledInput
                label={copy.description}
                value={draft.description}
                onChangeText={(value) => updateDraft("description", value)}
                placeholder={copy.descriptionPlaceholder}
                isDay={isDay}
                isRtl={isRtl}
                multiline
              />
            </View>

            <TouchableOpacity activeOpacity={0.88} onPress={createEvent} disabled={!isDraftValid} style={[styles.saveButton, !isDraftValid && styles.saveButtonDisabled]}>
              <Text style={styles.saveButtonText}>{copy.save}</Text>
            </TouchableOpacity>
          </ScrollView>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}

function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  isDay,
  multiline,
  isRtl,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  isDay?: boolean;
  multiline?: boolean;
  isRtl?: boolean;
}) {
  return (
    <View>
      <Text style={[styles.label, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDay ? "#6E7F99" : nsnColors.mutedSoft}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textArea, isDay && styles.dayInput, isRtl && styles.rtlInput]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nsnColors.background },
  container: {
    flex: 1,
    backgroundColor: nsnColors.background,
    padding: 20,
  },
  content: { padding: 20, paddingBottom: 32 },

  dayContainer: {
    backgroundColor: "#EAF4FF",
  },
  rtlRow: { flexDirection: "row-reverse" },
  rtlText: { textAlign: "right", writingDirection: "rtl" },
  rtlInput: { textAlign: "right", writingDirection: "rtl" },

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
    lineHeight: 22,
    marginBottom: 20,
  },
  daySubtitle: {
    color: "#3B4A63",
  },
  dayText: {
    color: "#111827",
  },

  createButton: {
    backgroundColor: nsnColors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  createButtonText: {
    color: nsnColors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    padding: 18,
  },
  dayCard: {
    backgroundColor: "#DCEEFF",
    borderColor: "#B8C9E6",
  },

  cardTitle: {
    color: nsnColors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },

  cardText: {
    color: nsnColors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  eventList: { gap: 12 },
  eventCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    padding: 16,
  },
  eventHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 },
  noiseBadge: { borderRadius: 12, backgroundColor: "rgba(247,200,91,0.18)", paddingHorizontal: 10, paddingVertical: 5 },
  quietBadge: { backgroundColor: "rgba(24,200,209,0.18)" },
  livelyBadge: { backgroundColor: "rgba(114,214,126,0.18)" },
  noiseBadgeText: { color: nsnColors.text, fontSize: 11, fontWeight: "900" },
  eventDate: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginBottom: 0 },
  eventTitle: { color: nsnColors.text, fontSize: 18, fontWeight: "900", lineHeight: 24, marginBottom: 6 },
  eventMeta: { color: nsnColors.muted, fontSize: 13, lineHeight: 19, marginBottom: 0 },
  eventDescription: { color: nsnColors.text, fontSize: 14, lineHeight: 21, marginTop: 10 },
  sheetContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 18 },
  sheetTitle: { color: nsnColors.text, fontSize: 26, fontWeight: "900", lineHeight: 32 },
  sheetSubtitle: { color: nsnColors.muted, fontSize: 14, lineHeight: 20, marginTop: 3 },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nsnColors.surface,
    borderWidth: 1,
    borderColor: nsnColors.border,
  },
  dayCloseButton: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6" },
  closeText: { color: nsnColors.text, fontSize: 28, lineHeight: 32, fontWeight: "700" },
  formStack: { gap: 14 },
  label: { color: nsnColors.text, fontSize: 13, lineHeight: 18, fontWeight: "800", marginBottom: 7 },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    color: nsnColors.text,
    fontSize: 14,
    paddingHorizontal: 14,
  },
  dayInput: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6", color: "#0B1220" },
  textArea: { minHeight: 104, paddingTop: 13, lineHeight: 20 },
  inlineFields: { flexDirection: "row", gap: 10 },
  inlineField: { flex: 1 },
  noiseRow: { flexDirection: "row", gap: 8 },
  noiseOption: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNoiseOption: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6" },
  noiseOptionActive: { backgroundColor: nsnColors.primary, borderColor: nsnColors.primary },
  noiseOptionText: { color: nsnColors.muted, fontSize: 12, fontWeight: "900", marginBottom: 0 },
  noiseOptionTextActive: { color: nsnColors.text },
  mapPanel: {
    minHeight: 174,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#284476",
    backgroundColor: nsnColors.surfaceRaised,
    overflow: "hidden",
  },
  dayMapPanel: { backgroundColor: "#DCEEFF", borderColor: "#B8C9E6" },
  mapGrid: {
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0B1D35",
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  mapPin: { color: nsnColors.cyan, fontSize: 32, fontWeight: "900" },
  mapWatermark: { position: "absolute", right: 12, bottom: 10, color: "#A6B1C7", fontSize: 10, fontWeight: "800" },
  mapTitle: { color: nsnColors.text, fontSize: 15, fontWeight: "900", lineHeight: 21, marginHorizontal: 14, marginTop: 12 },
  mapCopy: { color: nsnColors.muted, fontSize: 12, lineHeight: 18, marginHorizontal: 14, marginTop: 4, marginBottom: 13 },
  placeList: { gap: 9 },
  placeOption: {
    minHeight: 64,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: "rgba(255,255,255,0.03)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    gap: 10,
  },
  dayPlaceOption: { backgroundColor: "#FFFFFF", borderColor: "#B8C9E6" },
  placeOptionActive: { borderColor: nsnColors.primary },
  placeCopy: { flex: 1 },
  placeName: { color: nsnColors.text, fontSize: 14, fontWeight: "900", lineHeight: 20 },
  placeAddress: { color: nsnColors.muted, fontSize: 12, lineHeight: 17, marginBottom: 0 },
  placeCheck: { width: 22, color: nsnColors.muted, fontSize: 16, fontWeight: "900", textAlign: "right" },
  placeCheckActive: { color: nsnColors.primary },
  saveButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: nsnColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  saveButtonDisabled: { opacity: 0.42 },
  saveButtonText: { color: nsnColors.text, fontSize: 16, fontWeight: "900" },
});
