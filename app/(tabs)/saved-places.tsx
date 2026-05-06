import { View, Text, StyleSheet } from "react-native";

import { getLanguageBase, useAppSettings } from "@/lib/app-settings";
import { ScreenContainer } from "@/components/screen-container";
import { nsnColors } from "@/lib/nsn-data";

const rtlLanguages = new Set(["Arabic", "Hebrew", "Persian", "Urdu"]);

const savedPlacesTranslations = {
  English: {
    title: "Saved Places",
    subtitle: "Your favourite cafés, parks, libraries and quiet meetup spots will appear here.",
    emptyTitle: "No saved places yet",
    emptyCopy: "Later, you’ll be able to save places from meetup pages or map suggestions.",
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

export default function SavedPlacesScreen() {
  const { appLanguage, isNightMode } = useAppSettings();
  const appLanguageBase = getLanguageBase(appLanguage);
  const copy = {
    ...(savedPlacesTranslations[appLanguageBase as keyof typeof savedPlacesTranslations] ?? savedPlacesTranslations.English),
    ...(regionalEnglishSavedPlaces[appLanguage as keyof typeof regionalEnglishSavedPlaces] ?? {}),
  };
  const isRtl = rtlLanguages.has(appLanguageBase);
  const isDay = !isNightMode;

  return (
    <ScreenContainer containerClassName="bg-background" safeAreaClassName="bg-background" style={isDay && styles.dayContainer}>
      <View style={[styles.container, isDay && styles.dayContainer]}>
        <Text style={[styles.title, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.title}</Text>
        <Text style={[styles.subtitle, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{copy.subtitle}</Text>

        <View style={[styles.emptyCard, isDay && styles.dayCard]}>
          <Text style={[styles.emptyTitle, isDay && styles.dayTitle, isRtl && styles.rtlText]}>{copy.emptyTitle}</Text>
          <Text style={[styles.emptyText, isDay && styles.daySubtitle, isRtl && styles.rtlText]}>{copy.emptyCopy}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nsnColors.background,
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
    lineHeight: 22,
    marginBottom: 20,
  },
  daySubtitle: {
    color: "#3B4A63",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: nsnColors.border,
    backgroundColor: nsnColors.surface,
    borderRadius: 18,
    padding: 18,
  },
  dayCard: {
    backgroundColor: "#DCEEFF",
    borderColor: "#B8C9E6",
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
});
