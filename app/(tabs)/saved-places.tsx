import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { nsnColors } from "@/lib/nsn-data";
import { removeSavedPlace } from "@/lib/softhello-mvp";

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu", "Yiddish"]);

const savedPlacesTranslations = {
  English: {
    goBack: "Go back",
    title: "Saved Places",
    subtitle: "Your favourite cafés, parks, libraries and quiet meetup spots will appear here.",
    emptyTitle: "No saved places yet",
    emptyCopy: "Save a venue from any meetup page and it will appear here.",
    savedFrom: "Saved from",
    remove: "Remove",
  },
  Arabic: {
    title: "الأماكن المحفوظة",
    subtitle: "ستظهر هنا المقاهي والحدائق والمكتبات وأماكن اللقاء الهادئة المفضلة لديك.",
    emptyTitle: "لا توجد أماكن محفوظة بعد",
    emptyCopy: "لاحقاً، ستتمكن من حفظ أماكن من صفحات اللقاءات أو اقتراحات الخريطة.",
  },
  Chinese: {
    title: "收藏地点",
    subtitle: "你喜欢的咖啡馆、公园、图书馆和安静聚会地点会显示在这里。",
    emptyTitle: "还没有收藏地点",
    emptyCopy: "之后你可以从聚会页面或地图建议中收藏地点。",
  },
  French: {
    title: "Lieux enregistrés",
    subtitle: "Vos cafés, parcs, bibliothèques et lieux calmes préférés apparaîtront ici.",
    emptyTitle: "Aucun lieu enregistré",
    emptyCopy: "Plus tard, vous pourrez enregistrer des lieux depuis les pages de rencontre ou les suggestions de carte.",
  },
  German: {
    title: "Gespeicherte Orte",
    subtitle: "Deine liebsten Cafés, Parks, Bibliotheken und ruhigen Treffpunkte erscheinen hier.",
    emptyTitle: "Noch keine Orte gespeichert",
    emptyCopy: "Später kannst du Orte von Treffenseiten oder Kartenvorschlägen speichern.",
  },
  Hebrew: {
    title: "מקומות שמורים",
    subtitle: "בתי קפה, פארקים, ספריות ומקומות מפגש שקטים שאהבת יופיעו כאן.",
    emptyTitle: "עדיין אין מקומות שמורים",
    emptyCopy: "בהמשך אפשר יהיה לשמור מקומות מדפי מפגש או מהצעות מפה.",
  },
  Japanese: {
    title: "保存した場所",
    subtitle: "お気に入りのカフェ、公園、図書館、静かなミートアップ場所がここに表示されます。",
    emptyTitle: "保存した場所はまだありません",
    emptyCopy: "あとで、ミートアップページや地図の候補から場所を保存できます。",
  },
  Korean: {
    title: "저장한 장소",
    subtitle: "좋아하는 카페, 공원, 도서관, 조용한 모임 장소가 여기에 표시돼요.",
    emptyTitle: "아직 저장한 장소가 없어요",
    emptyCopy: "나중에 모임 페이지나 지도 추천에서 장소를 저장할 수 있어요.",
  },
  Persian: {
    title: "مکان‌های ذخیره‌شده",
    subtitle: "کافه‌ها، پارک‌ها، کتابخانه‌ها و مکان‌های آرام دیدار که دوست دارید اینجا نمایش داده می‌شوند.",
    emptyTitle: "هنوز مکانی ذخیره نشده",
    emptyCopy: "بعداً می‌توانید مکان‌ها را از صفحه‌های دیدار یا پیشنهادهای نقشه ذخیره کنید.",
  },
  Urdu: {
    title: "محفوظ مقامات",
    subtitle: "آپ کے پسندیدہ کیفے، پارکس، لائبریریاں اور خاموش میٹ اپ مقامات یہاں دکھائی دیں گے۔",
    emptyTitle: "ابھی کوئی مقام محفوظ نہیں",
    emptyCopy: "بعد میں آپ میٹ اپ صفحات یا نقشے کی تجاویز سے مقامات محفوظ کر سکیں گے۔",
  },
  Bengali: {
    title: "সংরক্ষিত জায়গা",
    subtitle: "আপনার পছন্দের ক্যাফে, পার্ক, লাইব্রেরি ও শান্ত মিটআপ জায়গা এখানে দেখা যাবে।",
    emptyTitle: "এখনও কোনো জায়গা সংরক্ষিত নেই",
    emptyCopy: "পরে মিটআপ পেজ বা ম্যাপ সাজেশন থেকে জায়গা সংরক্ষণ করতে পারবেন।",
  },
  Filipino: {
    title: "Saved Places",
    subtitle: "Lalabas dito ang paborito mong cafés, parks, libraries at tahimik na meetup spots.",
    emptyTitle: "Wala pang saved places",
    emptyCopy: "Mamaya, makakapag-save ka ng places mula sa meetup pages o map suggestions.",
  },
  Hindi: {
    title: "सहेजी गई जगहें",
    subtitle: "आपके पसंदीदा कैफ़े, पार्क, लाइब्रेरी और शांत मीटअप स्थान यहाँ दिखेंगे।",
    emptyTitle: "अभी कोई जगह सहेजी नहीं गई",
    emptyCopy: "बाद में आप मीटअप पेज या मैप सुझावों से जगहें सहेज सकेंगे।",
  },
  Indonesian: {
    title: "Tempat Tersimpan",
    subtitle: "Kafe, taman, perpustakaan, dan tempat meetup tenang favorit Anda akan muncul di sini.",
    emptyTitle: "Belum ada tempat tersimpan",
    emptyCopy: "Nanti, Anda bisa menyimpan tempat dari halaman meetup atau saran peta.",
  },
  Malay: {
    title: "Tempat Disimpan",
    subtitle: "Kafe, taman, perpustakaan dan tempat meetup tenang kegemaran anda akan muncul di sini.",
    emptyTitle: "Belum ada tempat disimpan",
    emptyCopy: "Nanti, anda boleh menyimpan tempat daripada halaman meetup atau cadangan peta.",
  },
  Thai: {
    title: "สถานที่ที่บันทึกไว้",
    subtitle: "คาเฟ่ สวน ห้องสมุด และจุดนัดพบเงียบๆ ที่คุณชอบจะแสดงที่นี่",
    emptyTitle: "ยังไม่มีสถานที่ที่บันทึก",
    emptyCopy: "ภายหลัง คุณจะบันทึกสถานที่จากหน้ามีตอัปหรือคำแนะนำบนแผนที่ได้",
  },
  Turkish: {
    title: "Kayıtlı Yerler",
    subtitle: "Favori kafelerin, parkların, kütüphanelerin ve sakin meetup noktaların burada görünecek.",
    emptyTitle: "Henüz kayıtlı yer yok",
    emptyCopy: "Daha sonra meetup sayfalarından veya harita önerilerinden yer kaydedebileceksin.",
  },
  Vietnamese: {
    title: "Địa Điểm Đã Lưu",
    subtitle: "Quán cà phê, công viên, thư viện và điểm meetup yên tĩnh yêu thích sẽ xuất hiện ở đây.",
    emptyTitle: "Chưa có địa điểm đã lưu",
    emptyCopy: "Sau này, bạn có thể lưu địa điểm từ trang meetup hoặc gợi ý bản đồ.",
  },
  Russian: {
    title: "Сохранённые места",
    subtitle: "Ваши любимые кафе, парки, библиотеки и тихие места для встреч появятся здесь.",
    emptyTitle: "Пока нет сохранённых мест",
    emptyCopy: "Позже вы сможете сохранять места со страниц встреч или из подсказок карты.",
  },
  Spanish: {
    title: "Lugares guardados",
    subtitle: "Tus cafés, parques, bibliotecas y lugares tranquilos favoritos aparecerán aquí.",
    emptyTitle: "Aún no hay lugares guardados",
    emptyCopy: "Más adelante podrás guardar lugares desde páginas de quedadas o sugerencias del mapa.",
  },
} as const;

const regionalEnglishSavedPlaces = {
  "English (US)": {
    subtitle: "Your favorite cafés, parks, libraries and quiet meetup spots will appear here.",
  },
} as const;

const supplementalSavedPlacesTranslations = {
  Afrikaans: {
    title: "Gestoorde plekke",
    subtitle: "Jou gunstelingkafees, parke, biblioteke en stil ontmoetingsplekke sal hier verskyn.",
    emptyTitle: "Nog geen gestoorde plekke nie",
    emptyCopy: "Later sal jy plekke vanaf ontmoetingsbladsye of kaartvoorstelle kan stoor.",
  },
  Albanian: {
    title: "Vende të ruajtura",
    subtitle: "Kafenetë, parqet, bibliotekat dhe vendet e qeta të takimeve do të shfaqen këtu.",
    emptyTitle: "Ende nuk ka vende të ruajtura",
    emptyCopy: "Më vonë do të mund të ruash vende nga faqet e takimeve ose sugjerimet e hartës.",
  },
  Armenian: {
    title: "Պահված վայրեր",
    subtitle: "Ձեր սիրելի սրճարանները, այգիները, գրադարանները և հանգիստ հանդիպման վայրերը կհայտնվեն այստեղ։",
    emptyTitle: "Դեռ պահված վայրեր չկան",
    emptyCopy: "Հետագայում կարող եք վայրեր պահել հանդիպման էջերից կամ քարտեզի առաջարկներից։",
  },
  Croatian: {
    title: "Spremljena mjesta",
    subtitle: "Tvoji omiljeni kafići, parkovi, knjižnice i mirna mjesta za susret pojavit će se ovdje.",
    emptyTitle: "Još nema spremljenih mjesta",
    emptyCopy: "Kasnije ćeš moći spremati mjesta sa stranica susreta ili prijedloga karte.",
  },
  Czech: {
    title: "Uložená místa",
    subtitle: "Vaše oblíbené kavárny, parky, knihovny a klidná místa pro setkání se zobrazí zde.",
    emptyTitle: "Zatím žádná uložená místa",
    emptyCopy: "Později budete moci ukládat místa ze stránek setkání nebo návrhů mapy.",
  },
  Estonian: {
    title: "Salvestatud kohad",
    subtitle: "Sinu lemmikkohvikud, pargid, raamatukogud ja vaiksed kohtumispaigad ilmuvad siia.",
    emptyTitle: "Salvestatud kohti veel pole",
    emptyCopy: "Hiljem saad kohti salvestada kohtumiste lehtedelt või kaardisoovitustest.",
  },
  Hungarian: {
    title: "Mentett helyek",
    subtitle: "Kedvenc kávézóid, parkjaid, könyvtáraid és csendes találkozóhelyeidet itt látod majd.",
    emptyTitle: "Még nincs mentett hely",
    emptyCopy: "Később találkozóoldalakról vagy térképes javaslatokból menthetsz helyeket.",
  },
  "Haitian Creole": {
    title: "Kote ki sove",
    subtitle: "Kafe, pak, bibliyotèk ak kote rankont trankil ou renmen yo ap parèt isit la.",
    emptyTitle: "Pa gen kote ki sove ankò",
    emptyCopy: "Pita, ou pral kapab sove kote nan paj rankont oswa sijesyon kat la.",
  },
  Latvian: {
    title: "Saglabātās vietas",
    subtitle: "Tavi iecienītie kafejnīcas, parki, bibliotēkas un klusās tikšanās vietas parādīsies šeit.",
    emptyTitle: "Vēl nav saglabātu vietu",
    emptyCopy: "Vēlāk varēsi saglabāt vietas no tikšanās lapām vai kartes ieteikumiem.",
  },
  Lithuanian: {
    title: "Išsaugotos vietos",
    subtitle: "Tavo mėgstamos kavinės, parkai, bibliotekos ir ramios susitikimų vietos bus rodomos čia.",
    emptyTitle: "Dar nėra išsaugotų vietų",
    emptyCopy: "Vėliau galėsi išsaugoti vietas iš susitikimų puslapių arba žemėlapio pasiūlymų.",
  },
  Luxembourgish: {
    title: "Gespäichert Plazen",
    subtitle: "Deng léifste Caféen, Parken, Bibliothéiken a roueg Meetup-Plaze erschéngen hei.",
    emptyTitle: "Nach keng gespäichert Plazen",
    emptyCopy: "Méi spéit kanns du Plaze vu Meetup-Säiten oder Kaartvirschléi späicheren.",
  },
  Slovak: {
    title: "Uložené miesta",
    subtitle: "Vaše obľúbené kaviarne, parky, knižnice a pokojné miesta na stretnutia sa zobrazia tu.",
    emptyTitle: "Zatiaľ žiadne uložené miesta",
    emptyCopy: "Neskôr budete môcť ukladať miesta zo stránok stretnutí alebo návrhov mapy.",
  },
  Yiddish: {
    title: "אפגעהיטע ערטער",
    subtitle: "דיינע באליבטע קאווע-הייזער, פארקן, ביבליאטעקן און שטילע מיטאפ-ערטער וועלן דא דערשיינען.",
    emptyTitle: "נאך קיין אפגעהיטע ערטער",
    emptyCopy: "שפעטער וועסטו קענען אפהיטן ערטער פון מיטאפ-בלעטער אדער מאפע-פארשלאגן.",
  },
} as const;

export default function SavedPlacesScreen() {
  const router = useRouter();
  const { appLanguage, isNightMode, savedPlaces, saveSoftHelloMvpState } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = {
    ...(savedPlacesTranslations[appLanguageBase as keyof typeof savedPlacesTranslations] ?? savedPlacesTranslations.English),
    ...(supplementalSavedPlacesTranslations[appLanguageBase as keyof typeof supplementalSavedPlacesTranslations] ?? {}),
    ...(regionalEnglishSavedPlaces[appLanguage as keyof typeof regionalEnglishSavedPlaces] ?? {}),
  };
  const isRtl = rtlLanguages.has(appLanguageBase);
  const isDay = !isNightMode;
  const fallbackCopy = savedPlacesTranslations.English;
  const goBackLabel = "goBack" in copy ? copy.goBack : fallbackCopy.goBack;
  const savedFromLabel = "savedFrom" in copy ? copy.savedFrom : fallbackCopy.savedFrom;
  const removeLabel = "remove" in copy ? copy.remove : fallbackCopy.remove;

  const handleRemove = async (placeId: string) => {
    await saveSoftHelloMvpState({ savedPlaces: removeSavedPlace(placeId, savedPlaces) });
  };

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <ScrollView style={[styles.container, isDay && styles.dayContainer]} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.75} onPress={() => router.back()} style={[styles.backButton, isDay && styles.dayIconButton]} accessibilityRole="button" accessibilityLabel={goBackLabel}>
          <IconSymbol name="chevron.left" color={isDay ? "#0B1220" : nsnColors.text} size={24} />
        </TouchableOpacity>

        <Text style={[styles.title, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.title}</Text>
        <Text style={[styles.subtitle, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{copy.subtitle}</Text>

        {savedPlaces.length > 0 ? (
          <View style={styles.placeList}>
            {savedPlaces.map((place) => (
              <View key={place.id} style={[styles.placeCard, isDay && styles.dayCard]}>
                <View style={[styles.placeHeader, isRtl && styles.rtlRow]}>
                  <View style={[styles.placeIcon, isDay && styles.dayPlaceIcon]}>
                    <IconSymbol name="location" color={isDay ? "#2F80ED" : nsnColors.text} size={20} />
                  </View>
                  <View style={styles.placeTitleBlock}>
                    <Text style={[styles.placeTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{place.venue}</Text>
                    <Text style={[styles.placeMeta, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{place.category} · {place.weather}</Text>
                  </View>
                </View>
                <Text style={[styles.placeSource, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>
                  {savedFromLabel}: {place.sourceEventTitle}
                </Text>
                <TouchableOpacity activeOpacity={0.82} onPress={() => handleRemove(place.id)} style={[styles.removeButton, isRtl && styles.rtlRow]}>
                  <IconSymbol name="bookmark" color={nsnColors.day} size={18} />
                  <Text style={styles.removeButtonText}>{removeLabel}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyCard, isDay && styles.dayCard]}>
            <Text style={[styles.emptyTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.emptyTitle}</Text>
            <Text style={[styles.emptyText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{copy.emptyCopy}</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nsnColors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 112,
  },
  dayContainer: {
    backgroundColor: "#E8EDF2",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: 10,
  },
  dayIconButton: {
    backgroundColor: "#EEF3F4",
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
    lineHeight: 22,
    marginBottom: 20,
  },
  daySubtitle: {
    color: "#53677A",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  rtlRow: {
    flexDirection: "row-reverse",
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    borderRadius: 18,
    padding: 18,
  },
  dayCard: {
    backgroundColor: "#EEF3F4",
    borderColor: "#C5D0DA",
  },
  emptyTitle: {
    color: nsnColors.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
  emptyText: {
    color: nsnColors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  placeList: {
    gap: 12,
  },
  placeCard: {
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    borderRadius: 18,
    padding: 16,
  },
  placeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  placeIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
  dayPlaceIcon: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C5D0DA",
  },
  placeTitleBlock: {
    flex: 1,
  },
  placeTitle: {
    color: nsnColors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 23,
  },
  placeMeta: {
    color: nsnColors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
  },
  placeSource: {
    color: nsnColors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },
  removeButton: {
    minHeight: 38,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(247,200,91,0.45)",
    paddingHorizontal: 12,
    marginTop: 12,
  },
  removeButtonText: {
    color: nsnColors.day,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 17,
  },
});
