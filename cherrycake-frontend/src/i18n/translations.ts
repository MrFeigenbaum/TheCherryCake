export type SupportedLanguage = 'en' | 'ru' | 'ka' | 'uz' | 'kk' | 'uk' | 'zh' | 'tr' | 'hy' | 'az' | 'ro' | 'et' | 'lv' | 'lt' | 'fi' | 'sv';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ru', label: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ka', label: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪' },
  { code: 'uz', label: 'Uzbek', nativeName: "O'zbek", flag: '🇺🇿' },
  { code: 'kk', label: 'Kazakh', nativeName: 'Қазақша', flag: '🇰🇿' },
  { code: 'uk', label: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'zh', label: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'tr', label: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'hy', label: 'Armenian', nativeName: 'Հայերენ', flag: '🇦🇲' },
  { code: 'az', label: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿' },
  { code: 'ro', label: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'et', label: 'Estonian', nativeName: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', label: 'Latvian', nativeName: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', label: 'Lithuanian', nativeName: 'Lietuvių', flag: '🇱🇹' },
  { code: 'fi', label: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'sv', label: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
];

export const REGION_TO_LANGUAGE: Record<string, SupportedLanguage> = {
  UZB: 'uz',
  KAZ: 'kk',
  GEO: 'ka',
  UKR: 'uk',
  CHN: 'zh',
  ARM: 'hy',
  AZE: 'az',
  TUR: 'tr',
  MDA: 'ro',
  EST: 'et',
  LVA: 'lv',
  LTU: 'lt',
  FIN: 'fi',
  SWE: 'sv',
  RUS: 'ru',
  RU: 'ru',
};

export interface QuestChapterTranslation {
  tag: string;
  location: string;
  heading: string;
  hudLeft: string;
  hudRight: string;
  narrative: string;
  poemTitle: string;
  poemText: string;
  choices: { text: string; nextChapter: number }[];
}

export interface EasterEggTranslations {
  keyBadge: string;
  keyTitle: string;
  keyDesc: string;
  keyPlaceholder: string;
  keySubmit: string;
  keyError: string;
  keyClose: string;
  keyTriggerTooltip: string;
  chapters: Record<number, QuestChapterTranslation>;
}

export const EASTER_EGG_TRANSLATIONS: Record<string, EasterEggTranslations> = {
  en: {
    keyBadge: 'ACCESS KEY // SECRET CIPHER',
    keyTitle: 'The Northern Gates',
    keyDesc: 'Enter the cipher codeword to unlock the secret chapter',
    keyPlaceholder: 'Enter codeword',
    keySubmit: 'UNLOCK',
    keyError: 'Access key is invalid...',
    keyClose: 'Close [Esc]',
    keyTriggerTooltip: 'Northern Gates Secret Cipher',
    chapters: {
      1: {
        tag: 'CHAPTER I // PROLOGUE',
        location: 'MIDNIGHT BAR • FEBRUARY RAIN',
        heading: 'February Pisces in the Deep Stillness',
        hudLeft: '📍 02:00 AM // RAIN RESONANCE 84%',
        hudRight: 'PISCES CONVERGENCE',
        narrative:
          'February rain beats against the steamed glass of a quiet bar at the crossroads of worlds. Inside, it smells of warm espresso and damp city streets.\n\nTwo souls sit at the counter, silent as whales in oceanic depths. In their eyes lies neither sadness nor regret, but that quiet knowing that comes when a feeling is too vast for ordinary words.',
        poemTitle: 'FEBRUARY PISCES',
        poemText: `February rain upon the pane,\nTwo silent souls without a name.\nWith eyes that speak: "I've seen your light\nIn distant dreams across the night."\n\n— A glass for each?\n— Just quiet grace.\nPhilosophers in time and space,\nSearching for where answers hide.\n\n— How is February treating you?\n— Still cold and gray.\n— And what of your tomorrow?\n— We're Pisces born. We drift our way...`,
        choices: [{ text: 'Remember that very evening', nextChapter: 2 }],
      },
      2: {
        tag: 'CHAPTER II // MEMORY',
        location: 'OLD TOWN LANES • MIDNIGHT CHERRY',
        heading: 'Two Umbrellas in the Silent Night',
        hudLeft: '🌧️ PRECIPITATION 92% // DAMP PAVEMENT',
        hudRight: 'SYNCHRONICITY 0.98',
        narrative:
          'Wet cobblestones reflect the neon cherry signs. Two umbrellas drift side by side through the mist, keeping a careful step.\n\nWords are unnecessary when every heartbeat echoes in unison with the falling rain.',
        poemTitle: 'TWO UMBRELLAS',
        poemText: `Two umbrellas in the dark,\nDrifting through a silent park.\nHands held close, yet worlds apart,\nListening to a steady heart.\n\nNeither asked: "Where do we go?"\nIn the misty midnight glow.\nJust the sound of quiet rain,\nWashing clean each old refrain.`,
        choices: [
          { text: 'Look into the flame', nextChapter: 3 },
          { text: 'Return to the bar', nextChapter: 1 },
        ],
      },
      3: {
        tag: 'CHAPTER III // SPRING FLAME',
        location: 'ARIES FIRE • MARCH THAW',
        heading: 'The Cat with the Aries Spirit',
        hudLeft: '🔥 THERMAL DRIFT +14°C // MARCH WIND',
        hudRight: 'ARIES IGNITION',
        narrative:
          'The icy dampness gives way to the golden warmth of early spring. By the fireplace sits a red tabby cat with wise, burning emerald eyes.\n\nIt gazes with unwavering calm, knowing that courage is not the absence of storms, but the flame kept burning within.',
        poemTitle: 'THE ARIES SPIRIT',
        poemText: `Fire crackles in the hearth,\nSpring awakens on the earth.\nEmerald eyes and whiskers bright,\nGuarding dreams into the night.\n\nFierce as flame and soft as moss,\nCounting neither gain nor loss.\nIn its purr a secret song:\n"Hold your ground, be true and strong."`,
        choices: [
          { text: 'Follow the star chart', nextChapter: 4 },
          { text: 'Step back to the rain', nextChapter: 2 },
        ],
      },
      4: {
        tag: 'CHAPTER IV // COORDINATES',
        location: 'CELESTIAL GRID • ASTRONOMICAL SANCTUARY',
        heading: 'Starlight Lines Across the Void',
        hudLeft: '🌌 LAT 44.82°N • LON 42.15°E',
        hudRight: 'ORBITAL LOCK 100%',
        narrative:
          'Brass astrolabes and glowing star maps unfold into infinity. Constellations connect unseen paths between souls separated by thousands of leagues.\n\nDistance is an illusion of physical space; true resonance travels faster than light.',
        poemTitle: 'CELESTIAL MAP',
        poemText: `Lines of gold across the sky,\nWatching centuries go by.\nPisces dreams and Aries fire,\nBound by invisible wire.\n\nThough a thousand miles divide,\nConstellations side by side\nTrace the orbit of our gaze\nThrough the interstellar maze.`,
        choices: [
          { text: 'Climb toward the peaks', nextChapter: 5 },
          { text: 'Return to the hearth', nextChapter: 3 },
        ],
      },
      5: {
        tag: 'CHAPTER V // THE RIDGE',
        location: 'SNOW PINES • HIGH CAUCASUS',
        heading: 'Silence Above the Cloudline',
        hudLeft: '🏔️ ALTITUDE 3,200M // FROST ZERO',
        hudRight: 'ALPINE CLARITY',
        narrative:
          'Crisp mountain air scented with resinous cedar and eternal snow. High above the slumbering world, majestic pine boughs hold back the wind.\n\nHere, all doubts settle like morning snow into serene crystal peace.',
        poemTitle: 'THE MOUNTAIN PASS',
        poemText: `Pines stand tall in silver frost,\nNo true memory is lost.\nHigh above the valley floor,\nWaiting at the mountain door.\n\nIn the crystal morning light,\nFades the shadow of the night.\nBreathe the mountain, clear and still,\nTrust the sun upon the hill.`,
        choices: [
          { text: 'Approach the Northern Gates', nextChapter: 6 },
          { text: 'Look back at the stars', nextChapter: 4 },
        ],
      },
      6: {
        tag: 'CHAPTER VI // THE NORTHERN GATES',
        location: 'SUMMIT OF LIGHT • THE FINAL THAW',
        heading: 'Where Code Meets Pure Light',
        hudLeft: '✨ RESONANCE COMPLETED // HARMONY 100%',
        hudRight: 'GATEWAY UNLOCKED',
        narrative:
          'Before him stand the magnificent Northern Gates — towering snow-capped peaks wrapped in celestial light and crystal silence. Reality may pose boundaries, but true devotion neither forces nor breaches the gates.\n\nIt quietly keeps the fire alive, knowing that even the most enduring ice melts beneath rays of pure, unwavering light.',
        poemTitle: 'THE THAW',
        poemText: `Let the winter glaciers stand,\nGuarded by time's patient hand.\nWarmth inside the quiet chest\nBlesses every weary guest.\n\nWhen the morning rays arise,\nMelts the frost before our eyes.\nNorthern Gates shall swing apart,\nTo the faithful, patient heart.`,
        choices: [{ text: 'Return to the Café', nextChapter: 0 }],
      },
    },
  },
  ru: {
    keyBadge: 'ACCESS KEY // СЕКРЕТНЫЙ КЛЮЧ',
    keyTitle: 'Северные Врата',
    keyDesc: 'Введите кодовое слово, чтобы открыть секретную главу',
    keyPlaceholder: 'Введите кодовое слово',
    keySubmit: 'РАЗБЛОКИРОВАТЬ',
    keyError: 'Ключ доступа не подходит...',
    keyClose: 'Закрыть [Esc]',
    keyTriggerTooltip: 'Секретный ключ Северных Врат',
    chapters: {
      1: {
        tag: 'ГЛАВА I // ПРОЛОГ',
        location: 'ПОЛУНОЧНЫЙ БАР • ФЕВРАЛЬСКИЙ ДОЖДЬ',
        heading: 'Февральские Рыбы в глубинной тишине',
        hudLeft: '📍 02:00 AM // RAIN RESONANCE 84%',
        hudRight: 'PISCES CONVERGENCE',
        narrative:
          'Февральский дождь бьёт по запотевшим стеклам бара на перепутье миров. Внутри тепло, пахнет кофе и мокрым асфальтом.\n\nЗа стойкой сидят двое. Молчат, как киты в океанской глубине. В их взглядах — не печаль, а то тихое знание, которое приходит, когда душу переполняет невысказанное чувство.',
        poemTitle: 'ФЕВРАЛЬСКИЕ РЫБЫ',
        poemText: `Февральский дождь. И за окном темно.\nДва силуэта смотрят сквозь стекло.\nС глазами: "Видел тебя я во сне".\nИ кофе остывает на столе.\n\n— Вам по бокалу?\n— Нет, налей молчания.\nБармен вздыхает: "Философы, блин,\nВсё ищут тайну мироздания,\nСреди дождливых северных равнин".\n\n— Ну как вам февраль?\n— Как всегда, дождлив.\n— А планы?\n— Мы ж Рыбы. Какие нам планы? Плывём в залив...`,
        choices: [{ text: 'Вспомнить тот самый вечер', nextChapter: 2 }],
      },
      2: {
        tag: 'ГЛАВА II // ВОСПОМИНАНИЕ',
        location: 'ПЕРЕУЛКИ СТАРОГО ГОРОДА • ВИШНЕВЫЙ НЕОН',
        heading: 'Два зонта над сырой брусчаткой',
        hudLeft: '🌧️ PRECIPITATION 92% // DAMP PAVEMENT',
        hudRight: 'SYNCHRONICITY 0.98',
        narrative:
          'Мокрая брусчатка отражает неоновые вывески кондитерской. Два зонта плывут сквозь сумрак, шаг в шаг.\n\nСлова здесь излишни: когда сердца настроены на одну частоту, каждый удар звучит в унисон с падающими каплями.',
        poemTitle: 'ДВА ЗОНТА',
        poemText: `Два зонта в переулках сырых,\nОдин шаг на двоих, один вздох.\nСреди сотен чужих и слепых,\nЭтот вечер двоих подстерёг.\n\nИ не нужно признаний и клятв,\nКапли бьют по натянутой ткани.\nТолько свет в фонарях виноват,\nЧто мерцает в морозном тумане.`,
        choices: [
          { text: 'Вглядеться в пламя', nextChapter: 3 },
          { text: 'Вернуться в бар', nextChapter: 1 },
        ],
      },
      3: {
        tag: 'ГЛАВА III // ПЛАМЯ ВЕСНЫ',
        location: 'ОГОНЬ ОВНА • МАРТОВСКАЯ ОТТЕПЕЛЬ',
        heading: 'Рыжий хранитель с характером Овна',
        hudLeft: '🔥 THERMAL DRIFT +14°C // MARCH WIND',
        hudRight: 'ARIES IGNITION',
        narrative:
          'Холодный туман отступает перед золотым теплом очага. У камина устроился пушистый кот с янтарными искрами в изумрудных глазах.\n\nЕго взгляд полон неукротимого спокойствия: огонь внутри греет сильнее любых метелей.',
        poemTitle: 'ОГОНЬ ОВНА',
        poemText: `В камине пляшет рыжий огонёк,\nМурлычет кот, прищурив умный глаз.\nПусть путь к весне порою был далёк,\nНо пламя вспыхнуло в заветный час.\n\nХарактер Овна — смелый и прямой,\nВ нём нет сомнений, робости и льда.\nХрани тепло, что связано с тобой,\nИ путеводная взойдёт звезда.`,
        choices: [
          { text: 'Следовать карте созвездий', nextChapter: 4 },
          { text: 'Оглянуться на дождь', nextChapter: 2 },
        ],
      },
      4: {
        tag: 'ГЛАВА IV // КООРДИНАТЫ',
        location: 'НЕБЕСНАЯ СЕТКА • ЗВЁЗДНАЯ ОБСЕРВАТОРИЯ',
        heading: 'Золотые линии сквозь пустоту',
        hudLeft: '🌌 LAT 44.82°N • LON 42.15°E',
        hudRight: 'ORBITAL LOCK 100%',
        narrative:
          'Медные астролябии и звёздные карты раскрывают геометрию вселенной. Созвездия чертят невидимые нити между людьми, разделёнными сотнями километров.\n\nРасстояние — лишь условность физического мира. Истинный резонанс не подвластен границам.',
        poemTitle: 'ЗВЁЗДНАЯ КАРТА',
        poemText: `Координаты сходятся в зенит,\nМерцают нити золотых широт.\nКогда душа с другою говорит,\nБессилен времени водоворот.\n\nСквозь километры, реки и мосты,\nВедёт невидимый небесный луч.\nТуда, где посреди ночной густой темноты,\nХранится тайный от преддверия ключ.`,
        choices: [
          { text: 'Подняться к перевалам', nextChapter: 5 },
          { text: 'Вернуться к очагу', nextChapter: 3 },
        ],
      },
      5: {
        tag: 'ГЛАВА V // КАВКАЗСКИЙ ХРЕБЕТ',
        location: 'СОСНОВЫЙ БОР • ВЫСОКИЙ КАВКАЗ',
        heading: 'Звенящая тишина над облаками',
        hudLeft: '🏔️ ALTITUDE 3,200M // FROST ZERO',
        hudRight: 'ALPINE CLARITY',
        narrative:
          'Прозрачный горный воздух, пропитанный смолой реликтовых сосен и вечными снегами. Высоко над спящим миром могучие ветви укрывают от ветра.\n\nЗдесь все тревоги растворяются в кристальном покое утреннего света.',
        poemTitle: 'КАВКАЗСКИЙ ПЕРЕВАЛ',
        poemText: `Шумят вековые кавказские сосны,\nВ снегах серебрится крутой перевал.\nЗдесь мысли прозрачны, а ветры несносны,\nНо путник от бурь и дорог не устал.\n\nВзгляни на вершины в рассветных лучах —\nТам солнце встаёт над хрустальной стеной.\nРастает печаль на уставших плечах,\nИ мир обернётся живой тишиной.`,
        choices: [
          { text: 'Подойти к Северным Вратам', nextChapter: 6 },
          { text: 'Посмотреть на звёзды', nextChapter: 4 },
        ],
      },
      6: {
        tag: 'ГЛАВА VI // СЕВЕРНЫЕ ВРАТА',
        location: 'ВЕРШИНА СВЕТА • ВЕЛИКАЯ ОТТЕПЕЛЬ',
        heading: 'Там, где код встречается с чистым светом',
        hudLeft: '✨ RESONANCE COMPLETED // HARMONY 100%',
        hudRight: 'GATEWAY UNLOCKED',
        narrative:
          'Перед ним встают великие Северные Врата — неприступные горные пики, окутанные космической тишиной и звёздными координатными сетками. Лёд сковал перевалы, как реальность сковала их пути.\n\nНо тот, кто по-настоящему любит, не требует и не штурмует крепость. Он хранит в груди огонь, веря, что даже самый холодный вековой лёд однажды растает под лучами чистого света.',
        poemTitle: 'СЕВЕРНЫЕ ВРАТА',
        poemText: `Пусть скалы спят в объятьях ледника,\nИ время сторожит заветный вход.\nЛюбовь не ждёт расплаты и венка,\nОна сквозь бури верность пронесёт.\n\nИ дрогнет лед, когда придёт весна,\nЛуч солнца разобьёт вековой плен.\nОчнётся сердце от глухого сна,\nИ свет придёт великий взамен.`,
        choices: [{ text: 'Вернуться в Кафе', nextChapter: 0 }],
      },
    },
  },
  ka: {
    keyBadge: 'ACCESS KEY // საიდუმლო გასაღები',
    keyTitle: 'ჩრდილოეთის კარიბჭე',
    keyDesc: 'შეიყვანეთ საიდუმლო სიტყვა თავის გასახსნელად',
    keyPlaceholder: 'შეიყვანეთ საიდუმლო სიტყვა',
    keySubmit: 'განბლოკვა',
    keyError: 'წვდომის გასაღები არასწორია...',
    keyClose: 'დახურვა [Esc]',
    keyTriggerTooltip: 'ჩრდილოეთის კარიბჭის საიდუმლო გასაღები',
    chapters: {
      1: {
        tag: 'თავი I // პროლოგი',
        location: 'შუაღამის ბარი • თებერვლის წვიმა',
        heading: 'თებერვლის თევზები ღრმა სიჩუმეში',
        hudLeft: '📍 02:00 AM // წვიმის რეზონანსი 84%',
        hudRight: 'PISCES CONVERGENCE',
        narrative:
          'თებერვლის წვიმა აწყდება სამყაროთა გზაჯვარედინზე მდებარე ბარის მინებს. შიგნით თბილა და ახალი ყავის სურნელი ტრიალებს.\n\nორნი სხედან მდუმარედ, როგორც ვეშაპები ოკეანის სიღრმეში. მათ მზერაში არა სევდა, არამედ ის სიმშვიდეა, როცა გრძნობა სიტყვებზე მეტია.',
        poemTitle: 'თებერვლის თევზები',
        poemText: `თებერვლის წვიმა, ღამე ბნელია,\nფანჯარასთან დგანან ორნი მდუმარედ.\nმათი თვალები სიზმრებს ჰყვებიან,\nსიჩუმე ავსებს ოთახს ნელ-ნელა.\n\n— ერთი ჭიქა?\n— მხოლოდ სიმშვიდე.\nფილოსოფოსები წვიმის წვეთებში,\nეძებენ პასუხს შორეულ ცაში,\nსიყვარული კი ცოცხლობს გულებში.`,
        choices: [{ text: 'იმ საღამოს გახსენება', nextChapter: 2 }],
      },
      2: {
        tag: 'თავი II // მოგონება',
        location: 'ძველი ქალაქი • ალუბლისფერი ნეონი',
        heading: 'ორი ქოლგა სველ ქვაფენილზე',
        hudLeft: '🌧️ ნალექი 92% // სველი ქვაფენილი',
        hudRight: 'სინქრონულობა 0.98',
        narrative:
          'სველი ქვაფენილი ირეკლავს საკონდიტროს ნეონის შუქს. ორი ქოლგა მიცურავს ბინდში გვერდიგვერდ.\n\nსიტყვები ზედმეტია, როცა ორი გული წვიმის რიტმში ერთად ფეთქავს.',
        poemTitle: 'ორი ქოლგა',
        poemText: `ორი ქოლგა ძველ ქუჩებში,\nერთი ნაბიჯი, ერთი სუნთქვა.\nათას უცნობ გამვლელს შორის,\nეს საღამო ჩვენთვის დარჩა.\n\nარ გვჭირდება ფიცი და სიტყვა,\nწვიმა მღერის თავის ჰანგზე,\nსანათების ოქროს შუქი\nნაზად ცეკვავს ქვაფენილზე.`,
        choices: [
          { text: 'ცეცხლში ჩახედვა', nextChapter: 3 },
          { text: 'ბარში დაბრუნება', nextChapter: 1 },
        ],
      },
      3: {
        tag: 'თავი III // გაზაფხულის ალი',
        location: 'ვერძის ცეცხლი • მარტის სითბო',
        heading: 'რიჟა მცველი ვერძის ხასიათით',
        hudLeft: '🔥 თერმული დრიფტი +14°C',
        hudRight: 'ARIES IGNITION',
        narrative:
          'ცივი ნისლი უკან იხევს ბუხრის ოქროსფერი სითბოს წინაშე. ბუხართან მოკალათებულია ფუმფულა კატა ჭკვიანი ზურმუხტისფერი თვალებით.\n\nმისი მშვიდი მზერა შეგვახსენებს: შინაგანი სითბო ნებისმიერ ყინვას ამარცხებს.',
        poemTitle: 'ვერძის ცეცხლი',
        poemText: `ბუხარში ცეკვავს ნაპერწკლები,\nკატა კრუტუნებს ჩუმად კუთხეში.\nგაზაფხულისკენ მიდის გზები,\nიმედი ცოცხლობს თბილ გულებში.\n\nვერძის ხასიათი მამაცი და წრფელია,\nმასში ეჭვი და ყინვა არ არის,\nშეინახე შენი სინათლე,\nდა გათენდება დილა მზიანი.`,
        choices: [
          { text: 'ვარსკვლავთა რუკის მიყოლა', nextChapter: 4 },
          { text: 'წვიმისკენ გახედვა', nextChapter: 2 },
        ],
      },
      4: {
        tag: 'თავი IV // კოორდინატები',
        location: 'ზეციური ბადე • ობსერვატორია',
        heading: 'ოქროს ხაზები უკიდეგანო სივრცეში',
        hudLeft: '🌌 LAT 44.82°N • LON 42.15°E',
        hudRight: 'ORBITAL LOCK 100%',
        narrative:
          'ასტრონომიული რუკები შლიან სამყაროს ჰარმონიას. თანავარსკვლავედები უხილავ ძაფებს ავლებენ ერთმანეთისგან დაშორებულ სულებს შორის.\n\nმანძილი მხოლოდ ილუზიაა; ნამდვილი სიყვარული ყოველგვარ საზღვარს სცდება.',
        poemTitle: 'ვარსკვლავთა რუკა',
        poemText: `კოორდინატები ერთდება ცაში,\nოქროს ხაზები ბრწყინავენ ღამით.\nროცა სული სულს ესაუბრება,\nდრო ქრება მხოლოდ ერთი წამით.\n\nათას კილომეტრს მიღმაც კი,\nგვინათებს ერთი კაშკაშა სხივი,\nიქ, სადაც ღამის სიჩუმეში\nინახება საიდუმლო კლიტე.`,
        choices: [
          { text: 'უღელტეხილზე ასვლა', nextChapter: 5 },
          { text: 'ბუხართან დაბრუნება', nextChapter: 3 },
        ],
      },
      5: {
        tag: 'თავი V // კავკასიონის ქედი',
        location: 'ფიჭვნარი • მაღალი კავკასია',
        heading: 'ზარისებრი სიჩუმე ღრუბლებს ზემოთ',
        hudLeft: '🏔️ სიმაღლე 3,200M // ყინვა',
        hudRight: 'ALPINE CLARITY',
        narrative:
          'კავკასიონის წმინდა მთის ჰაერი, გაჟღენთილი ფიჭვის სურნელითა და მარადიული თოვლით. მაღლა, მძინარე სამყაროს თავზე, უძველესი ფიჭვები იცავენ სიმშვიდეს.\n\nაქ ყველა შფოთი დილის მზის კრისტალურ სხივებში ქრება.',
        poemTitle: 'კავკასიის უღელტეხილი',
        poemText: `შრიალებენ კავკასიის ფიჭვები,\nთოვლში ბრწყინავს თეთრი მწვერვალი.\nაქ ფიქრები წმინდაა და ნათელი,\nმთის ჰაერი სუნთქავს უკვდავი.\n\nშეხედე მწვერვალს განთიადისას,\nმზე ამოდის ოქროსფერ კედელზე,\nსევდა ქრება დაგლილ მხრებიდან,\nდა სიმშვიდე ეშვება მიწაზე.`,
        choices: [
          { text: 'ჩრდილოეთის კარიბჭესთან მისვლა', nextChapter: 6 },
          { text: 'ვარსკვლავებისკენ გახედვა', nextChapter: 4 },
        ],
      },
      6: {
        tag: 'თავი VI // ჩრდილოეთის კარიბჭე',
        location: 'სინათლის მწვერვალი • დიდი დათბობა',
        heading: 'სადაც კოდი წმინდა სინათლეს ერწყმის',
        hudLeft: '✨ რეზონანსი დასრულებულია // 100%',
        hudRight: 'კარიბჭე განბლოკილია',
        narrative:
          'მის წინ აღმართულია დიდებული ჩრდილოეთის კარიბჭე — მიუვალი თოვლიანი მწვერვალები, შემოფარგლული ვარსკვლავთა ნათებით. ყინულმა შეკრა გზები, მაგრამ ნამდვილი ერთგულება ციხესიმაგრეს არ იპყრობს.\n\nის გულში ინახავს ცეცხლს, რადგან იცის, რომ ყველაზე მყარი ყინულიც კი დნება წმინდა სიყვარულის სხივების ქვეშ.',
        poemTitle: 'დათბობა',
        poemText: `დაე ეძინოს ყინულოვან კლდეებს,\nდრო იცავს საიდუმლო კარს.\nსიყვარული გადის ქარბუქებს,\nდა ერთგულებას ინახავს მყარს.\n\nდადნება ყინული, მოვა გაზაფხული,\nმზის სხივი გატეხავს ტყვეობას ცივს,\nგაიღვიძებს დაღლილი გული,\nდა სინათლე შეცვლის ყოველგვარ წყვდიადს.`,
        choices: [{ text: 'კაფეში დაბრუნება', nextChapter: 0 }],
      },
    },
  },
};

export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'nav.menu': 'Artisan Menu',
    'nav.booking': 'Table Reservation',
    'nav.about': 'About & Hours',
    'nav.account': 'Sign In / Account',
    'nav.customCake': 'Custom Cake',
    'nav.reports': 'Reports',
    'nav.apiDocs': 'API Docs',
    'nav.admin': 'Admin',
    'nav.bag': 'Bag',
    'hero.badge': 'WELCOME TO CHERRY CAKE',
    'hero.title1': 'Sweet Moments',
    'hero.title2': 'Start Here',
    'hero.subtitle':
      'Celebrating the harmony of French pastry artistry and delicate cherry blossoms. Handcrafted fresh every morning with organic cream and pure Belgian chocolate.',
    'hero.viewMenu': 'View Menu',
    'hero.explore': 'Explore Flavors',
    'hero.perk1': '100% Natural Berries & Cream',
    'hero.perk2': 'Baked Fresh Every Day',
    'hero.perk3': 'Regional Delivery & Pickup',
    'hero.chocolate': 'Chocolate Indulgence',
    'hero.strawberry': 'Strawberry Bliss',
    'hero.viewCake': 'View Cake',
    'hero.viewTreat': 'View Treat',
    'hero.rating': '★ 4.9 • 1,200+ Happy Guests',
    'section.delightsTag': 'OUR ARTISAN SPECIALTIES',
    'section.delightsTitle': 'Signature Delights',
    'section.delightsSub':
      'A curated glimpse of our handcrafted confectionery, whipped to perfection and prepared fresh every single morning.',
    'footer.bookTable': 'Book a Café Table',
    'footer.hours': 'Café & Hospitality',
    'footer.portals': 'Client & API Portals',
    'lang.switcherTitle': 'Select language',
  },
  ru: {
    'nav.menu': 'Авторское Меню',
    'nav.booking': 'Бронь столика',
    'nav.about': 'О нас и часы',
    'nav.account': 'Войти / Профиль',
    'nav.customCake': 'Торт на заказ',
    'nav.reports': 'Отчёты',
    'nav.apiDocs': 'API Документация',
    'nav.admin': 'Админ',
    'nav.bag': 'Корзина',
    'hero.badge': 'ДОБРО ПОЖАЛОВАТЬ В CHERRY CAKE',
    'hero.title1': 'Сладкие моменты',
    'hero.title2': 'Начинаются здесь',
    'hero.subtitle':
      'Изящная гармония французского кондитерского искусства и нежных цветов сакуры. Ручная работа каждое утро из фермерских сливок и бельгийского шоколада.',
    'hero.viewMenu': 'Посмотреть меню',
    'hero.explore': 'Выбрать десерты',
    'hero.perk1': '100% Натуральные ягоды и крем',
    'hero.perk2': 'Свежая выпечка каждое утро',
    'hero.perk3': 'Быстрая доставка и самовывоз',
    'hero.chocolate': 'Шоколадный восторг',
    'hero.strawberry': 'Клубничное блаженство',
    'hero.viewCake': 'Смотреть торт',
    'hero.viewTreat': 'Смотреть десерт',
    'hero.rating': '★ 4.9 • 1,200+ Довольных гостей',
    'section.delightsTag': 'НАШИ АВТОРСКИЕ ШЕДЕВРЫ',
    'section.delightsTitle': 'Фирменные Сладости',
    'section.delightsSub':
      'Коллекция утренней выпечки и десертов ручной работы, приготовленных со страстью и любовью.',
    'footer.bookTable': 'Забронировать столик',
    'footer.hours': 'Кафе и Гостеприимство',
    'footer.portals': 'Клиентские и API Порталы',
    'lang.switcherTitle': 'Выбрать язык',
  },
  ka: {
    'nav.menu': 'საავტორო მენიუ',
    'nav.booking': 'მაგიდის დაჯავშნა',
    'nav.about': 'ჩვენს შესახებ',
    'nav.account': 'შესვლა / პროფილი',
    'nav.customCake': 'ტორტი შეკვეთით',
    'nav.reports': 'ანგარიშები',
    'nav.apiDocs': 'API დოკუმენტაცია',
    'nav.admin': 'ადმინი',
    'nav.bag': 'კალათა',
    'hero.badge': 'მოგესალმებათ CHERRY CAKE',
    'hero.title1': 'ტკბილი წუთები',
    'hero.title2': 'იწყება აქ',
    'hero.subtitle':
      'ფრანგული საკონდიტრო ხელოვნებისა და იაპონური ალუბლის ყვავილობის ჰარმონია. ყოველ დილით ახლად მომზადებული უმაღლესი ხარისხის ინგრედიენტებით.',
    'hero.viewMenu': 'მენიუს ნახვა',
    'hero.explore': 'დესერტების შერჩევა',
    'hero.perk1': '100% ნატურალური კენკრა და კრემი',
    'hero.perk2': 'ახალი ნამცხვრები ყოველ დილით',
    'hero.perk3': 'სწრაფი მიტანა და გატანა',
    'hero.chocolate': 'შოკოლადის სიამოვნება',
    'hero.strawberry': 'მარწყვის ნეტარება',
    'hero.viewCake': 'ტორტის ნახვა',
    'hero.viewTreat': 'დესერტის ნახვა',
    'hero.rating': '★ 4.9 • 1,200+ კმაყოფილი სტუმარი',
    'section.delightsTag': 'ჩვენი საავტორო დესერტები',
    'section.delightsTitle': 'რჩეული ტკბილეული',
    'section.delightsSub':
      'ხელით დამზადებული საუცხოო საკონდიტრო ნაწარმი, გამომცხვარი ყოველ დილით თქვენი სიამოვნებისთვის.',
    'footer.bookTable': 'მაგიდის დაჯავშნა',
    'footer.hours': 'კაფე და მასპინძლობა',
    'footer.portals': 'კლიენტის და API პორტალები',
    'lang.switcherTitle': 'ენის არჩევა',
  },
  uz: {
    'nav.menu': 'Artisan Menyu',
    'nav.booking': 'Stol Band Qilish',
    'nav.about': 'Biz Haqimizda',
    'nav.account': 'Kirish / Profil',
    'nav.customCake': 'Buyurtma Tort',
    'nav.reports': 'Hisobotlar',
    'nav.apiDocs': 'API Hujjatlar',
    'nav.admin': 'Admin',
    'nav.bag': 'Savat',
    'hero.badge': 'CHERRY CAKE GA XUSH KELIBSIZ',
    'hero.title1': 'Shirin Lahzalar',
    'hero.title2': 'Shu Yerdan Boshlanadi',
    'hero.subtitle':
      'Fransuz qandolatchiligi va nozik gilos gullari uyg‘unligi. Har kuni ertalab tabiiy qaymoq va Belgiya shokoladidan tayyorlanadi.',
    'hero.viewMenu': 'Menyuni Ko‘rish',
    'hero.explore': 'Lazzatlarni Tanlash',
    'hero.perk1': '100% Tabiiy Mevalar va Qaymoq',
    'hero.perk2': 'Har Kuni Yangi Pishiriqlar',
    'hero.perk3': 'Yetkazib Berish va Olib Ketish',
    'hero.chocolate': 'Shokoladli Rohat',
    'hero.strawberry': 'Qulupnayli Sehr',
    'hero.viewCake': 'Tortni Ko‘rish',
    'hero.viewTreat': 'Pishiriqni Ko‘rish',
    'hero.rating': '★ 4.9 • 1,200+ Mamnun Mehmonlar',
    'section.delightsTag': 'BIZNING MAXSUS SHIRINLIKLAR',
    'section.delightsTitle': 'Saralangan Lazzatlar',
    'section.delightsSub':
      'Har tong mehr bilan tayyorlanadigan qo‘l mehnati pishiriqlarimizdan sara namunalar.',
    'footer.bookTable': 'Stol Band Qilish',
    'footer.hours': 'Qahvaxona va Xizmat',
    'footer.portals': 'Mijoz va API Portallari',
    'lang.switcherTitle': 'Tilni tanlang',
  },
  kk: {
    'nav.menu': 'Арнайы Мәзір',
    'nav.booking': 'Үстел Брондау',
    'nav.about': 'Біз Туралы',
    'nav.account': 'Кіру / Профиль',
    'nav.customCake': 'Тапсырыс Торт',
    'nav.reports': 'Есептер',
    'nav.apiDocs': 'API Құжаттамасы',
    'nav.admin': 'Әкімші',
    'nav.bag': 'Себет',
    'hero.badge': 'CHERRY CAKE-КЕ ҚОШ КЕЛДІҢІЗ',
    'hero.title1': 'Тәтті Сәттер',
    'hero.title2': 'Осында Басталады',
    'hero.subtitle':
      'Француз кондитерлік өнері мен шие гүлдерінің үйлесімі. Күн сайын таңертең табиғи кілегей мен бельгиялық шоколадтан дайындалады.',
    'hero.viewMenu': 'Мәзірді Көру',
    'hero.explore': 'Дәмдерді Таңдау',
    'hero.perk1': '100% Табиғи Жидектер мен Кілегей',
    'hero.perk2': 'Күн Сайын Жаңа Пісірілген',
    'hero.perk3': 'Жеткізу Және Алып Кету',
    'hero.chocolate': 'Шоколадты Рахат',
    'hero.strawberry': 'Құлпынай Ләззаты',
    'hero.viewCake': 'Тортты Көру',
    'hero.viewTreat': 'Тәттіні Көру',
    'hero.rating': '★ 4.9 • 1,200+ Риза Қонақтар',
    'section.delightsTag': 'БІЗДІҢ АРНАЙЫ ӨНІМДЕР',
    'section.delightsTitle': 'Таңдаулы Тәттілер',
    'section.delightsSub':
      'Әр таң сайын шеберлікпен және махаббатпен әзірленетін қолөнер кондитерлік өнімдері.',
    'footer.bookTable': 'Үстел Брондау',
    'footer.hours': 'Кафе Және Қонақжайлылық',
    'footer.portals': 'Клиент Және API Порталдары',
    'lang.switcherTitle': 'Тілді таңдаңыз',
  },
};

export function getUIText(lang: string, key: string, fallback = ''): string {
  const table = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
  if (table && table[key]) return table[key];
  if (UI_TRANSLATIONS['en'] && UI_TRANSLATIONS['en'][key]) return UI_TRANSLATIONS['en'][key];
  return fallback || key;
}

export function getEasterEggTexts(lang: string): EasterEggTranslations {
  if (EASTER_EGG_TRANSLATIONS[lang]) return EASTER_EGG_TRANSLATIONS[lang];
  return EASTER_EGG_TRANSLATIONS['en'] || EASTER_EGG_TRANSLATIONS['ru'];
}
