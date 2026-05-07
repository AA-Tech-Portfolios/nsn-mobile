export type ProfilePreferenceCopy = {
  rows: {
    locationPreference: string;
    transportation: string;
    foodPreferences: string;
    hobbiesInterests: string;
  };
  transportation: {
    title: string;
    copy: string;
    options?: Record<string, { label: string; copy: string }>;
  };
  food: {
    title: string;
    copy: string;
    dietary: string;
    payment?: string;
    dietaryOptions?: Record<string, string>;
    paymentOptions?: Record<string, { label: string; copy: string }>;
  };
  hobbies: {
    title: string;
    copy: string;
    personalTime: string;
    selected: (count: number) => string;
    options?: Record<string, string>;
  };
};

const en: ProfilePreferenceCopy = {
  rows: {
    locationPreference: "Location Preference",
    transportation: "Transportation Method",
    foodPreferences: "Food Preferences",
    hobbiesInterests: "Hobbies & Interests",
  },
  transportation: {
    title: "Transportation Method",
    copy: "Choose how you usually arrive so meetups can make the meeting point and timing feel easier.",
  },
  food: {
    title: "Food Preferences",
    copy: "Share dietary needs before food meetups, so nobody has to guess at the table.",
    dietary: "Food or dietary preferences",
  },
  hobbies: {
    title: "Hobbies & Interests",
    copy: "Choose what you like doing in your own time, so meetups can feel closer to your real life.",
    personalTime: "Personal time",
    selected: (count) => `${count} selected`,
  },
};

export const profilePreferenceTranslations: Record<string, ProfilePreferenceCopy> = {
  English: en,
  Afrikaans: {
    rows: { locationPreference: "Liggingvoorkeur", transportation: "Vervoermetode", foodPreferences: "Kos- en betaalvoorkeure", hobbiesInterests: "Stokperdjies en belangstellings" },
    transportation: { title: "Vervoermetode", copy: "Kies hoe jy gewoonlik aankom, sodat ontmoetingspunt en tydsberekening makliker voel." },
    food: { title: "Kos- en betaalvoorkeure", copy: "Deel dieetbehoeftes en betaalverwagtinge voor kos-ontmoetings.", dietary: "Kos- of dieetvoorkeure", payment: "Ete-betalingvoorkeur" },
    hobbies: { title: "Stokperdjies en belangstellings", copy: "Kies wat jy in jou eie tyd graag doen.", personalTime: "Eie tyd", selected: (count) => `${count} gekies` },
  },
  Albanian: {
    rows: { locationPreference: "Preferenca e vendndodhjes", transportation: "Mënyra e transportit", foodPreferences: "Ushqimi dhe pagesa", hobbiesInterests: "Hobi dhe interesa" },
    transportation: { title: "Mënyra e transportit", copy: "Zgjidh si arrin zakonisht që pika e takimit dhe koha të jenë më të lehta." },
    food: { title: "Preferencat e ushqimit dhe pagesës", copy: "Ndaj nevojat ushqimore dhe pritshmëritë për pagesën para takimeve me ushqim.", dietary: "Preferenca ushqimore", payment: "Preferenca e pagesës së vaktit" },
    hobbies: { title: "Hobi dhe interesa", copy: "Zgjidh çfarë të pëlqen të bësh në kohën tënde.", personalTime: "Koha personale", selected: (count) => `${count} zgjedhur` },
  },
  Arabic: {
    rows: { locationPreference: "تفضيل الموقع", transportation: "طريقة الوصول", foodPreferences: "تفضيلات الطعام والدفع", hobbiesInterests: "الهوايات والاهتمامات" },
    transportation: { title: "طريقة الوصول", copy: "اختر كيف تصل عادةً حتى يكون مكان اللقاء والتوقيت أوضح وأسهل." },
    food: { title: "تفضيلات الطعام والدفع", copy: "شارك احتياجاتك الغذائية وتوقعات الدفع قبل لقاءات الطعام.", dietary: "تفضيلات الطعام أو النظام الغذائي", payment: "تفضيل دفع الوجبة" },
    hobbies: { title: "الهوايات والاهتمامات", copy: "اختر ما تحب فعله في وقتك الخاص حتى تبدو اللقاءات أقرب لحياتك.", personalTime: "الوقت الشخصي", selected: (count) => `تم اختيار ${count}` },
  },
  Armenian: {
    rows: { locationPreference: "Տեղանքի նախընտրություն", transportation: "Տրանսպորտի եղանակ", foodPreferences: "Սնունդ և վճարում", hobbiesInterests: "Հոբբիներ և հետաքրքրություններ" },
    transportation: { title: "Տրանսպորտի եղանակ", copy: "Ընտրեք, թե սովորաբար ինչպես եք գալիս, որպեսզի հանդիպման կետն ու ժամանակը պարզ լինեն։" },
    food: { title: "Սննդի և վճարման նախընտրություններ", copy: "Կիսվեք սննդային կարիքներով և վճարման ակնկալիքներով։", dietary: "Սննդային նախընտրություններ", payment: "Ուտեստի վճարման նախընտրություն" },
    hobbies: { title: "Հոբբիներ և հետաքրքրություններ", copy: "Ընտրեք, թե ինչ եք սիրում անել ազատ ժամանակ։", personalTime: "Անձնական ժամանակ", selected: (count) => `${count} ընտրված` },
  },
  Bengali: {
    rows: { locationPreference: "লোকেশন পছন্দ", transportation: "যাতায়াতের মাধ্যম", foodPreferences: "খাবার ও পেমেন্ট পছন্দ", hobbiesInterests: "শখ ও আগ্রহ" },
    transportation: { title: "যাতায়াতের মাধ্যম", copy: "আপনি সাধারণত কীভাবে আসেন তা বেছে নিন, যাতে দেখা করার স্থান ও সময় সহজ হয়।" },
    food: { title: "খাবার ও পেমেন্ট পছন্দ", copy: "খাবার-সম্পর্কিত প্রয়োজন এবং বিল দেওয়ার প্রত্যাশা আগে জানিয়ে রাখুন।", dietary: "খাবার বা খাদ্যাভ্যাস পছন্দ", payment: "খাবারের বিল দেওয়ার পছন্দ" },
    hobbies: { title: "শখ ও আগ্রহ", copy: "নিজের সময়ে কী করতে ভালো লাগে তা বেছে নিন।", personalTime: "নিজের সময়", selected: (count) => `${count}টি নির্বাচিত` },
  },
  Chinese: {
    rows: { locationPreference: "位置偏好", transportation: "交通方式", foodPreferences: "饮食与付款偏好", hobbiesInterests: "爱好与兴趣" },
    transportation: { title: "交通方式", copy: "选择你通常如何到达，让集合点和时间安排更轻松。" },
    food: { title: "饮食与付款偏好", copy: "在用餐聚会前分享饮食需求和付款期待，避免现场猜测。", dietary: "饮食偏好或限制", payment: "餐费付款偏好" },
    hobbies: { title: "爱好与兴趣", copy: "选择你平时喜欢做的事，让聚会更贴近真实生活。", personalTime: "个人时间", selected: (count) => `已选择 ${count} 项` },
  },
  Croatian: {
    rows: { locationPreference: "Preferencija lokacije", transportation: "Način dolaska", foodPreferences: "Hrana i plaćanje", hobbiesInterests: "Hobiji i interesi" },
    transportation: { title: "Način dolaska", copy: "Odaberi kako obično dolaziš da mjesto susreta i vrijeme budu jasniji." },
    food: { title: "Preferencije hrane i plaćanja", copy: "Podijeli prehrambene potrebe i očekivanja oko plaćanja prije susreta uz hranu.", dietary: "Prehrambene preferencije", payment: "Preferencija plaćanja obroka" },
    hobbies: { title: "Hobiji i interesi", copy: "Odaberi što voliš raditi u svoje slobodno vrijeme.", personalTime: "Slobodno vrijeme", selected: (count) => `${count} odabrano` },
  },
  Czech: {
    rows: { locationPreference: "Preference polohy", transportation: "Způsob dopravy", foodPreferences: "Jídlo a platba", hobbiesInterests: "Koníčky a zájmy" },
    transportation: { title: "Způsob dopravy", copy: "Vyberte, jak obvykle přijíždíte, aby místo setkání a čas byly snazší." },
    food: { title: "Preference jídla a platby", copy: "Sdílejte stravovací potřeby a očekávání platby před setkáním u jídla.", dietary: "Stravovací preference", payment: "Preference platby za jídlo" },
    hobbies: { title: "Koníčky a zájmy", copy: "Vyberte, co rádi děláte ve volném čase.", personalTime: "Volný čas", selected: (count) => `Vybráno: ${count}` },
  },
  Danish: {
    rows: { locationPreference: "Placeringspræference", transportation: "Transportmetode", foodPreferences: "Mad og betaling", hobbiesInterests: "Hobbyer og interesser" },
    transportation: { title: "Transportmetode", copy: "Vælg hvordan du normalt ankommer, så mødested og timing bliver lettere." },
    food: { title: "Mad- og betalingspræferencer", copy: "Del kostbehov og betalingsforventninger før mad-møder.", dietary: "Mad- eller kostpræferencer", payment: "Betaling for måltid" },
    hobbies: { title: "Hobbyer og interesser", copy: "Vælg hvad du kan lide at lave i din egen tid.", personalTime: "Egen tid", selected: (count) => `${count} valgt` },
  },
  Dutch: {
    rows: { locationPreference: "Locatievoorkeur", transportation: "Vervoersmethode", foodPreferences: "Eten en betalen", hobbiesInterests: "Hobby's en interesses" },
    transportation: { title: "Vervoersmethode", copy: "Kies hoe je meestal aankomt, zodat ontmoetingspunt en timing makkelijker worden." },
    food: { title: "Eet- en betaalvoorkeuren", copy: "Deel dieetwensen en betaalverwachtingen vóór eetmeetups.", dietary: "Eet- of dieetvoorkeuren", payment: "Voorkeur voor maaltijd betalen" },
    hobbies: { title: "Hobby's en interesses", copy: "Kies wat je graag doet in je eigen tijd.", personalTime: "Eigen tijd", selected: (count) => `${count} geselecteerd` },
  },
  Estonian: {
    rows: { locationPreference: "Asukoha eelistus", transportation: "Transpordiviis", foodPreferences: "Toit ja maksmine", hobbiesInterests: "Hobid ja huvid" },
    transportation: { title: "Transpordiviis", copy: "Vali, kuidas tavaliselt saabud, et kohtumispaik ja ajastus oleksid lihtsamad." },
    food: { title: "Toidu ja maksmise eelistused", copy: "Jaga toiduvajadusi ja maksmise ootusi enne toidukohtumisi.", dietary: "Toidu- või dieedieelistused", payment: "Söögi eest maksmise eelistus" },
    hobbies: { title: "Hobid ja huvid", copy: "Vali, mida sulle meeldib vabal ajal teha.", personalTime: "Oma aeg", selected: (count) => `${count} valitud` },
  },
  Filipino: {
    rows: { locationPreference: "Kagustuhan sa lokasyon", transportation: "Paraan ng pagdating", foodPreferences: "Pagkain at bayad", hobbiesInterests: "Hilig at interes" },
    transportation: { title: "Paraan ng pagdating", copy: "Piliin kung paano ka karaniwang dumarating para mas madali ang meeting point at oras." },
    food: { title: "Kagustuhan sa pagkain at bayad", copy: "Ibahagi ang dietary needs at inaasahang bayaran bago ang food meetups.", dietary: "Food o dietary preferences", payment: "Kagustuhan sa bayad sa pagkain" },
    hobbies: { title: "Hilig at interes", copy: "Piliin ang gusto mong gawin sa sariling oras.", personalTime: "Sariling oras", selected: (count) => `${count} napili` },
  },
  Finnish: {
    rows: { locationPreference: "Sijaintitoive", transportation: "Saapumistapa", foodPreferences: "Ruoka ja maksaminen", hobbiesInterests: "Harrastukset ja kiinnostukset" },
    transportation: { title: "Saapumistapa", copy: "Valitse miten yleensä saavut, jotta tapaamispaikka ja ajoitus helpottuvat." },
    food: { title: "Ruoka- ja maksutoiveet", copy: "Jaa ruokavaliotarpeet ja maksutoiveet ennen ruokatreffejä.", dietary: "Ruoka- tai ruokavaliotoiveet", payment: "Aterian maksutoive" },
    hobbies: { title: "Harrastukset ja kiinnostukset", copy: "Valitse mitä tykkäät tehdä omalla ajallasi.", personalTime: "Oma aika", selected: (count) => `${count} valittu` },
  },
  French: {
    rows: { locationPreference: "Préférence de lieu", transportation: "Mode de transport", foodPreferences: "Repas et paiement", hobbiesInterests: "Loisirs et centres d'intérêt" },
    transportation: { title: "Mode de transport", copy: "Choisissez comment vous arrivez habituellement pour faciliter le lieu de rendez-vous et l'horaire." },
    food: { title: "Préférences de repas et de paiement", copy: "Partagez vos besoins alimentaires et vos attentes de paiement avant les rencontres autour d'un repas.", dietary: "Préférences alimentaires", payment: "Préférence de paiement du repas" },
    hobbies: { title: "Loisirs et centres d'intérêt", copy: "Choisissez ce que vous aimez faire sur votre temps personnel.", personalTime: "Temps personnel", selected: (count) => `${count} sélectionné(s)` },
  },
  German: {
    rows: { locationPreference: "Standortpräferenz", transportation: "Anreiseart", foodPreferences: "Essen und Zahlung", hobbiesInterests: "Hobbys und Interessen" },
    transportation: { title: "Anreiseart", copy: "Wähle, wie du normalerweise ankommst, damit Treffpunkt und Timing leichter werden." },
    food: { title: "Essens- und Zahlungspräferenzen", copy: "Teile Ernährungsbedürfnisse und Zahlungserwartungen vor Essens-Treffen.", dietary: "Essens- oder Ernährungspräferenzen", payment: "Präferenz für die Bezahlung" },
    hobbies: { title: "Hobbys und Interessen", copy: "Wähle, was du in deiner Freizeit gern machst.", personalTime: "Freizeit", selected: (count) => `${count} ausgewählt` },
  },
  Greek: {
    rows: { locationPreference: "Προτίμηση τοποθεσίας", transportation: "Τρόπος μετακίνησης", foodPreferences: "Φαγητό και πληρωμή", hobbiesInterests: "Χόμπι και ενδιαφέροντα" },
    transportation: { title: "Τρόπος μετακίνησης", copy: "Επιλέξτε πώς φτάνετε συνήθως, ώστε το σημείο συνάντησης και η ώρα να είναι πιο εύκολα." },
    food: { title: "Προτιμήσεις φαγητού και πληρωμής", copy: "Μοιραστείτε διατροφικές ανάγκες και προσδοκίες πληρωμής πριν από συναντήσεις με φαγητό.", dietary: "Διατροφικές προτιμήσεις", payment: "Προτίμηση πληρωμής γεύματος" },
    hobbies: { title: "Χόμπι και ενδιαφέροντα", copy: "Επιλέξτε τι σας αρέσει να κάνετε στον προσωπικό σας χρόνο.", personalTime: "Προσωπικός χρόνος", selected: (count) => `${count} επιλεγμένα` },
  },
  "Haitian Creole": {
    rows: { locationPreference: "Preferans kote", transportation: "Fason pou rive", foodPreferences: "Manje ak peman", hobbiesInterests: "Pastan ak enterè" },
    transportation: { title: "Fason pou rive", copy: "Chwazi kijan ou abitye rive pou kote rankont lan ak lè a vin pi fasil." },
    food: { title: "Preferans manje ak peman", copy: "Pataje bezwen manje ak atant peman anvan rankont manje yo.", dietary: "Preferans manje", payment: "Preferans peman manje" },
    hobbies: { title: "Pastan ak enterè", copy: "Chwazi sa ou renmen fè nan tan pèsonèl ou.", personalTime: "Tan pèsonèl", selected: (count) => `${count} chwazi` },
  },
  Hebrew: {
    rows: { locationPreference: "העדפת מיקום", transportation: "דרך הגעה", foodPreferences: "העדפות אוכל", hobbiesInterests: "תחביבים ותחומי עניין" },
    transportation: {
      title: "דרך הגעה",
      copy: "בחר/י איך את/ה בדרך כלל מגיע/ה כדי שנקודת המפגש והתזמון יהיו קלים יותר.",
      options: {
        Driving: { label: "נהיגה", copy: "ייתכן שאצטרך חניה או נקודת מפגש ברורה." },
        "Public transport": { label: "תחבורה ציבורית", copy: "אני מגיע/ה ברכבת, אוטובוס, מטרו, רכבת קלה או מעבורת." },
        Walking: { label: "הליכה", copy: "אני קרוב/ה ומגיע/ה ברגל." },
        Cycling: { label: "אופניים", copy: "ייתכן שאצטרך מקום סביר לנעול אותם." },
        Rideshare: { label: "נסיעה שיתופית", copy: "ייתכן שאצטרך נקודת הורדה או איסוף נוחה." },
        "Getting dropped off": { label: "מסיעים אותי", copy: "מישהו אחר עוזר לי להגיע." },
        "Not sure yet": { label: "עוד לא בטוח/ה", copy: "אחליט קרוב יותר למפגש." },
      },
    },
    food: {
      title: "העדפות אוכל",
      copy: "שתף/י צרכים תזונתיים לפני מפגשי אוכל.",
      dietary: "העדפות אוכל או תזונה",
      dietaryOptions: {
        "No preference": "אין העדפה",
        Vegetarian: "צמחוני",
        Vegan: "טבעוני",
        Halal: "חלאל",
        Kosher: "כשר",
        "Gluten-free": "ללא גלוטן",
        "Dairy-free": "ללא מוצרי חלב",
        "Nut allergy": "אלרגיה לאגוזים",
        "Seafood allergy": "אלרגיה לפירות ים",
        "Prefer non-alcohol venues": "מעדיף/ה מקומות ללא אלכוהול",
      },
    },
    hobbies: {
      title: "תחביבים ותחומי עניין",
      copy: "בחר/י מה את/ה אוהב/ת לעשות בזמן הפרטי שלך.",
      personalTime: "זמן אישי",
      selected: (count) => `${count} נבחרו`,
      options: {
        Coffee: "קפה",
        Movies: "סרטים",
        "Board games": "משחקי קופסה",
        Walks: "הליכות",
        Reading: "קריאה",
        Libraries: "ספריות",
        "Food spots": "מקומות אוכל",
        "Live music": "מוזיקה חיה",
        "Quiet music": "מוזיקה שקטה",
        Art: "אמנות",
        Museums: "מוזיאונים",
        Markets: "שווקים",
        "Beach days": "ימי חוף",
        Picnics: "פיקניקים",
        Fitness: "כושר",
        Photography: "צילום",
        Gaming: "גיימינג",
        Volunteering: "התנדבות",
      },
    },
  },
  Hindi: {
    rows: { locationPreference: "स्थान पसंद", transportation: "आने का तरीका", foodPreferences: "भोजन और भुगतान", hobbiesInterests: "शौक और रुचियां" },
    transportation: { title: "आने का तरीका", copy: "आप आमतौर पर कैसे आते हैं चुनें, ताकि मिलने की जगह और समय आसान हों।" },
    food: { title: "भोजन और भुगतान पसंद", copy: "भोजन meetups से पहले अपनी dietary ज़रूरतें और भुगतान अपेक्षाएँ साझा करें।", dietary: "भोजन या dietary पसंद", payment: "भोजन भुगतान पसंद" },
    hobbies: { title: "शौक और रुचियां", copy: "अपने निजी समय में आपको क्या करना पसंद है चुनें।", personalTime: "निजी समय", selected: (count) => `${count} चुने गए` },
  },
  Hungarian: {
    rows: { locationPreference: "Helyszínpreferencia", transportation: "Érkezési mód", foodPreferences: "Étel és fizetés", hobbiesInterests: "Hobbik és érdeklődés" },
    transportation: { title: "Érkezési mód", copy: "Válaszd ki, hogyan érkezel általában, hogy a találkozási pont és az időzítés könnyebb legyen." },
    food: { title: "Étel- és fizetési preferenciák", copy: "Oszd meg étkezési igényeidet és fizetési elvárásaidat ételes találkozók előtt.", dietary: "Étkezési preferenciák", payment: "Étkezés fizetési preferenciája" },
    hobbies: { title: "Hobbik és érdeklődés", copy: "Válaszd ki, mit szeretsz csinálni a saját idődben.", personalTime: "Saját idő", selected: (count) => `${count} kiválasztva` },
  },
  Indonesian: {
    rows: { locationPreference: "Preferensi lokasi", transportation: "Cara datang", foodPreferences: "Makanan dan pembayaran", hobbiesInterests: "Hobi dan minat" },
    transportation: { title: "Cara datang", copy: "Pilih bagaimana biasanya kamu datang agar titik temu dan waktu terasa lebih mudah." },
    food: { title: "Preferensi makanan dan pembayaran", copy: "Bagikan kebutuhan makanan dan ekspektasi pembayaran sebelum meetup makan.", dietary: "Preferensi makanan atau diet", payment: "Preferensi pembayaran makan" },
    hobbies: { title: "Hobi dan minat", copy: "Pilih hal yang kamu sukai di waktu pribadi.", personalTime: "Waktu pribadi", selected: (count) => `${count} dipilih` },
  },
  Italian: {
    rows: { locationPreference: "Preferenza luogo", transportation: "Metodo di trasporto", foodPreferences: "Cibo e pagamento", hobbiesInterests: "Hobby e interessi" },
    transportation: { title: "Metodo di trasporto", copy: "Scegli come arrivi di solito, così punto d'incontro e orario saranno più semplici." },
    food: { title: "Preferenze cibo e pagamento", copy: "Condividi esigenze alimentari e aspettative di pagamento prima degli incontri a tavola.", dietary: "Preferenze alimentari", payment: "Preferenza pagamento pasto" },
    hobbies: { title: "Hobby e interessi", copy: "Scegli cosa ti piace fare nel tuo tempo libero.", personalTime: "Tempo personale", selected: (count) => `${count} selezionati` },
  },
  Japanese: {
    rows: { locationPreference: "場所の希望", transportation: "移動手段", foodPreferences: "食事と支払い", hobbiesInterests: "趣味と興味" },
    transportation: { title: "移動手段", copy: "普段どのように到着するかを選ぶと、集合場所と時間が決めやすくなります。" },
    food: { title: "食事と支払いの希望", copy: "食事系ミートアップの前に、食事の希望や支払いの考え方を共有できます。", dietary: "食事・食生活の希望", payment: "食事代の支払い希望" },
    hobbies: { title: "趣味と興味", copy: "自分の時間に好きなことを選びましょう。", personalTime: "自分の時間", selected: (count) => `${count}件選択` },
  },
  Korean: {
    rows: { locationPreference: "위치 선호", transportation: "이동 방법", foodPreferences: "음식 및 결제 선호", hobbiesInterests: "취미와 관심사" },
    transportation: { title: "이동 방법", copy: "보통 어떻게 도착하는지 선택하면 만나는 장소와 시간이 더 쉬워져요." },
    food: { title: "음식 및 결제 선호", copy: "식사 모임 전에 식단 필요와 결제 기대를 공유하세요.", dietary: "음식 또는 식단 선호", payment: "식사 결제 선호" },
    hobbies: { title: "취미와 관심사", copy: "개인 시간에 좋아하는 활동을 선택하세요.", personalTime: "개인 시간", selected: (count) => `${count}개 선택됨` },
  },
  Latvian: {
    rows: { locationPreference: "Atrašanās vietas izvēle", transportation: "Ierašanās veids", foodPreferences: "Ēdiens un maksājums", hobbiesInterests: "Hobiji un intereses" },
    transportation: { title: "Ierašanās veids", copy: "Izvēlieties, kā parasti ierodaties, lai satikšanās vieta un laiks būtu vienkāršāki." },
    food: { title: "Ēdiena un maksājuma preferences", copy: "Dalieties ar uztura vajadzībām un maksājuma gaidām pirms ēdiena tikšanās.", dietary: "Ēdiena vai uztura preferences", payment: "Maltītes apmaksas preference" },
    hobbies: { title: "Hobiji un intereses", copy: "Izvēlieties, ko jums patīk darīt savā laikā.", personalTime: "Personīgais laiks", selected: (count) => `${count} atlasīti` },
  },
  Lithuanian: {
    rows: { locationPreference: "Vietos pasirinkimas", transportation: "Atvykimo būdas", foodPreferences: "Maistas ir mokėjimas", hobbiesInterests: "Pomėgiai ir interesai" },
    transportation: { title: "Atvykimo būdas", copy: "Pasirinkite, kaip paprastai atvykstate, kad susitikimo vieta ir laikas būtų aiškesni." },
    food: { title: "Maisto ir mokėjimo nuostatos", copy: "Pasidalykite mitybos poreikiais ir mokėjimo lūkesčiais prieš maisto susitikimus.", dietary: "Maisto ar mitybos nuostatos", payment: "Mokėjimo už maistą nuostata" },
    hobbies: { title: "Pomėgiai ir interesai", copy: "Pasirinkite, ką mėgstate veikti savo laiku.", personalTime: "Asmeninis laikas", selected: (count) => `${count} pasirinkta` },
  },
  Luxembourgish: {
    rows: { locationPreference: "Plaz-Preferenz", transportation: "Transportmethod", foodPreferences: "Iessen a Bezuelung", hobbiesInterests: "Hobbyen an Interessen" },
    transportation: { title: "Transportmethod", copy: "Wiel wéi s du normalerweis ukënns, fir Treffpunkt an Timing méi einfach ze maachen." },
    food: { title: "Iess- a Bezuelpreferenzen", copy: "Deel Ernärungsbedierfnesser a Bezuelerwaardungen virun Iess-Treffen.", dietary: "Iess- oder Diätpreferenzen", payment: "Bezuelpreferenz fir d'Iessen" },
    hobbies: { title: "Hobbyen an Interessen", copy: "Wiel wat s du gär an denger eegener Zäit méchs.", personalTime: "Eegen Zäit", selected: (count) => `${count} ausgewielt` },
  },
  Malay: {
    rows: { locationPreference: "Keutamaan lokasi", transportation: "Cara tiba", foodPreferences: "Makanan dan bayaran", hobbiesInterests: "Hobi dan minat" },
    transportation: { title: "Cara tiba", copy: "Pilih cara anda biasanya tiba supaya tempat temu dan masa lebih mudah." },
    food: { title: "Keutamaan makanan dan bayaran", copy: "Kongsi keperluan makanan dan jangkaan bayaran sebelum meetup makan.", dietary: "Keutamaan makanan atau diet", payment: "Keutamaan bayaran makanan" },
    hobbies: { title: "Hobi dan minat", copy: "Pilih apa yang anda suka buat pada masa sendiri.", personalTime: "Masa sendiri", selected: (count) => `${count} dipilih` },
  },
  Norwegian: {
    rows: { locationPreference: "Stedspreferanse", transportation: "Transportmåte", foodPreferences: "Mat og betaling", hobbiesInterests: "Hobbyer og interesser" },
    transportation: { title: "Transportmåte", copy: "Velg hvordan du vanligvis kommer, så møtepunkt og timing blir enklere." },
    food: { title: "Mat- og betalingspreferanser", copy: "Del kostbehov og betalingsforventninger før mat-møter.", dietary: "Mat- eller kostpreferanser", payment: "Betalingspreferanse for måltid" },
    hobbies: { title: "Hobbyer og interesser", copy: "Velg hva du liker å gjøre på egen tid.", personalTime: "Egen tid", selected: (count) => `${count} valgt` },
  },
  Persian: {
    rows: { locationPreference: "ترجیح مکان", transportation: "روش رسیدن", foodPreferences: "غذا و پرداخت", hobbiesInterests: "سرگرمی‌ها و علاقه‌ها" },
    transportation: { title: "روش رسیدن", copy: "انتخاب کنید معمولاً چگونه می‌رسید تا محل قرار و زمان‌بندی آسان‌تر شود." },
    food: { title: "ترجیحات غذا و پرداخت", copy: "نیازهای غذایی و انتظار پرداخت را پیش از دورهمی غذایی مشخص کنید.", dietary: "ترجیحات غذایی", payment: "ترجیح پرداخت غذا" },
    hobbies: { title: "سرگرمی‌ها و علاقه‌ها", copy: "انتخاب کنید در وقت شخصی چه کارهایی را دوست دارید.", personalTime: "وقت شخصی", selected: (count) => `${count} انتخاب شده` },
  },
  Polish: {
    rows: { locationPreference: "Preferencja lokalizacji", transportation: "Sposób dojazdu", foodPreferences: "Jedzenie i płatność", hobbiesInterests: "Hobby i zainteresowania" },
    transportation: { title: "Sposób dojazdu", copy: "Wybierz, jak zwykle przyjeżdżasz, aby miejsce spotkania i czas były prostsze." },
    food: { title: "Preferencje jedzenia i płatności", copy: "Udostępnij potrzeby dietetyczne i oczekiwania płatności przed spotkaniami przy jedzeniu.", dietary: "Preferencje żywieniowe", payment: "Preferencja płatności za posiłek" },
    hobbies: { title: "Hobby i zainteresowania", copy: "Wybierz, co lubisz robić w swoim czasie.", personalTime: "Czas własny", selected: (count) => `${count} wybrane` },
  },
  Portuguese: {
    rows: { locationPreference: "Preferência de localização", transportation: "Meio de transporte", foodPreferences: "Comida e pagamento", hobbiesInterests: "Hobbies e interesses" },
    transportation: { title: "Meio de transporte", copy: "Escolha como costuma chegar, para facilitar o ponto de encontro e o horário." },
    food: { title: "Preferências de comida e pagamento", copy: "Partilhe necessidades alimentares e expectativas de pagamento antes de encontros com comida.", dietary: "Preferências alimentares", payment: "Preferência de pagamento da refeição" },
    hobbies: { title: "Hobbies e interesses", copy: "Escolha o que gosta de fazer no seu tempo livre.", personalTime: "Tempo pessoal", selected: (count) => `${count} selecionado(s)` },
  },
  Romanian: {
    rows: { locationPreference: "Preferință de locație", transportation: "Metodă de transport", foodPreferences: "Mâncare și plată", hobbiesInterests: "Hobby-uri și interese" },
    transportation: { title: "Metodă de transport", copy: "Alege cum ajungi de obicei, ca locul întâlnirii și ora să fie mai ușoare." },
    food: { title: "Preferințe de mâncare și plată", copy: "Împărtășește nevoile alimentare și așteptările de plată înainte de întâlnirile cu mâncare.", dietary: "Preferințe alimentare", payment: "Preferință plată masă" },
    hobbies: { title: "Hobby-uri și interese", copy: "Alege ce îți place să faci în timpul tău.", personalTime: "Timp personal", selected: (count) => `${count} selectate` },
  },
  Russian: {
    rows: { locationPreference: "Предпочтение локации", transportation: "Способ прибытия", foodPreferences: "Еда и оплата", hobbiesInterests: "Хобби и интересы" },
    transportation: { title: "Способ прибытия", copy: "Выберите, как обычно добираетесь, чтобы место встречи и время были понятнее." },
    food: { title: "Предпочтения еды и оплаты", copy: "Укажите пищевые потребности и ожидания по оплате до встреч с едой.", dietary: "Пищевые предпочтения", payment: "Предпочтение оплаты еды" },
    hobbies: { title: "Хобби и интересы", copy: "Выберите, что вам нравится делать в личное время.", personalTime: "Личное время", selected: (count) => `Выбрано: ${count}` },
  },
  Slovak: {
    rows: { locationPreference: "Preferencia lokality", transportation: "Spôsob dopravy", foodPreferences: "Jedlo a platba", hobbiesInterests: "Záľuby a záujmy" },
    transportation: { title: "Spôsob dopravy", copy: "Vyberte, ako zvyčajne prichádzate, aby miesto stretnutia a čas boli jednoduchšie." },
    food: { title: "Preferencie jedla a platby", copy: "Zdieľajte stravovacie potreby a očakávania platby pred stretnutiami pri jedle.", dietary: "Stravovacie preferencie", payment: "Preferencia platby za jedlo" },
    hobbies: { title: "Záľuby a záujmy", copy: "Vyberte, čo radi robíte vo vlastnom čase.", personalTime: "Vlastný čas", selected: (count) => `${count} vybraté` },
  },
  Spanish: {
    rows: { locationPreference: "Preferencia de ubicación", transportation: "Método de transporte", foodPreferences: "Comida y pago", hobbiesInterests: "Hobbies e intereses" },
    transportation: { title: "Método de transporte", copy: "Elige cómo sueles llegar para que el punto de encuentro y el horario sean más fáciles." },
    food: { title: "Preferencias de comida y pago", copy: "Comparte necesidades alimentarias y expectativas de pago antes de quedadas con comida.", dietary: "Preferencias alimentarias", payment: "Preferencia de pago de la comida" },
    hobbies: { title: "Hobbies e intereses", copy: "Elige lo que te gusta hacer en tu tiempo personal.", personalTime: "Tiempo personal", selected: (count) => `${count} seleccionados` },
  },
  Swedish: {
    rows: { locationPreference: "Platsinställning", transportation: "Transportmetod", foodPreferences: "Mat och betalning", hobbiesInterests: "Hobbyer och intressen" },
    transportation: { title: "Transportmetod", copy: "Välj hur du vanligtvis kommer, så mötesplats och tid blir enklare." },
    food: { title: "Mat- och betalningspreferenser", copy: "Dela kostbehov och betalningsförväntningar före matträffar.", dietary: "Mat- eller kostpreferenser", payment: "Betalningspreferens för måltid" },
    hobbies: { title: "Hobbyer och intressen", copy: "Välj vad du gillar att göra på egen tid.", personalTime: "Egen tid", selected: (count) => `${count} valda` },
  },
  Thai: {
    rows: { locationPreference: "ความต้องการด้านสถานที่", transportation: "วิธีเดินทาง", foodPreferences: "อาหารและการจ่ายเงิน", hobbiesInterests: "งานอดิเรกและความสนใจ" },
    transportation: { title: "วิธีเดินทาง", copy: "เลือกวิธีที่คุณมักเดินทางมา เพื่อให้จุดนัดพบและเวลาเข้าใจง่ายขึ้น" },
    food: { title: "ความต้องการด้านอาหารและการจ่ายเงิน", copy: "แจ้งความต้องการด้านอาหารและการจ่ายเงินก่อนกิจกรรมที่มีอาหาร", dietary: "ความต้องการด้านอาหาร", payment: "ความต้องการการจ่ายค่าอาหาร" },
    hobbies: { title: "งานอดิเรกและความสนใจ", copy: "เลือกสิ่งที่คุณชอบทำในเวลาส่วนตัว", personalTime: "เวลาส่วนตัว", selected: (count) => `เลือกแล้ว ${count}` },
  },
  Turkish: {
    rows: { locationPreference: "Konum tercihi", transportation: "Ulaşım yöntemi", foodPreferences: "Yemek ve ödeme", hobbiesInterests: "Hobiler ve ilgi alanları" },
    transportation: { title: "Ulaşım yöntemi", copy: "Genelde nasıl geldiğini seç; buluşma noktası ve zamanlama daha kolay olsun." },
    food: { title: "Yemek ve ödeme tercihleri", copy: "Yemekli buluşmalardan önce beslenme ihtiyaçlarını ve ödeme beklentilerini paylaş.", dietary: "Yemek veya beslenme tercihleri", payment: "Yemek ödeme tercihi" },
    hobbies: { title: "Hobiler ve ilgi alanları", copy: "Kendi zamanında yapmayı sevdiğin şeyleri seç.", personalTime: "Kişisel zaman", selected: (count) => `${count} seçildi` },
  },
  Ukrainian: {
    rows: { locationPreference: "Перевага локації", transportation: "Спосіб прибуття", foodPreferences: "Їжа й оплата", hobbiesInterests: "Хобі та інтереси" },
    transportation: { title: "Спосіб прибуття", copy: "Оберіть, як зазвичай добираєтеся, щоб місце зустрічі й час були простішими." },
    food: { title: "Переваги їжі й оплати", copy: "Поділіться харчовими потребами та очікуваннями щодо оплати перед зустрічами з їжею.", dietary: "Харчові переваги", payment: "Перевага оплати їжі" },
    hobbies: { title: "Хобі та інтереси", copy: "Оберіть, що вам подобається робити у власний час.", personalTime: "Особистий час", selected: (count) => `Вибрано: ${count}` },
  },
  Urdu: {
    rows: { locationPreference: "مقام کی ترجیح", transportation: "آمد کا طریقہ", foodPreferences: "کھانا اور ادائیگی", hobbiesInterests: "مشاغل اور دلچسپیاں" },
    transportation: { title: "آمد کا طریقہ", copy: "آپ عموماً کیسے پہنچتے ہیں، یہ چنیں تاکہ ملنے کی جگہ اور وقت آسان ہو۔" },
    food: { title: "کھانے اور ادائیگی کی ترجیحات", copy: "کھانے والی ملاقاتوں سے پہلے غذائی ضروریات اور ادائیگی کی توقعات بتائیں۔", dietary: "کھانے یا غذا کی ترجیحات", payment: "کھانے کی ادائیگی کی ترجیح" },
    hobbies: { title: "مشاغل اور دلچسپیاں", copy: "اپنے ذاتی وقت میں پسندیدہ کام چنیں۔", personalTime: "ذاتی وقت", selected: (count) => `${count} منتخب` },
  },
  Vietnamese: {
    rows: { locationPreference: "Ưu tiên địa điểm", transportation: "Cách di chuyển", foodPreferences: "Ăn uống và thanh toán", hobbiesInterests: "Sở thích cá nhân" },
    transportation: { title: "Cách di chuyển", copy: "Chọn cách bạn thường đến để điểm hẹn và thời gian dễ hơn." },
    food: { title: "Ưu tiên ăn uống và thanh toán", copy: "Chia sẻ nhu cầu ăn uống và kỳ vọng thanh toán trước các buổi gặp có ăn uống.", dietary: "Ưu tiên ăn uống", payment: "Ưu tiên thanh toán bữa ăn" },
    hobbies: { title: "Sở thích cá nhân", copy: "Chọn những gì bạn thích làm trong thời gian riêng.", personalTime: "Thời gian riêng", selected: (count) => `${count} đã chọn` },
  },
  Yiddish: {
    rows: { locationPreference: "ארט-פרעפערענץ", transportation: "טראנספארט-אופֿן", foodPreferences: "עסן און באצאלונג", hobbiesInterests: "האביס און אינטערעסן" },
    transportation: { title: "טראנספארט-אופֿן", copy: "קלייב ווי דו קומסט געווענליך אן, כדי דער טרעף-פונקט און צייט זאלן זיין גרינגער." },
    food: { title: "עסן און באצאלונג", copy: "טייל מיט עסן-באדערפענישן און באצאלונג-ערווארטונגען פאר עסן-מיטאפס.", dietary: "עסן אדער דיעטע-פרעפערענצן", payment: "באצאלונג פאר מאלצייט" },
    hobbies: { title: "האביס און אינטערעסן", copy: "קלייב וואס דו האסט ליב צו טון אין דיין אייגענער צייט.", personalTime: "אייגענע צייט", selected: (count) => `${count} אויסגעקליבן` },
  },
};

export const getProfilePreferenceCopy = (languageBase: string) => profilePreferenceTranslations[languageBase] ?? en;
