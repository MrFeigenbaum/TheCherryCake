export type SupportedLanguage = 'en' | 'ru' | 'ka' | 'uz' | 'kk' | 'uk' | 'zh' | 'tr' | 'hy' | 'az' | 'ro' | 'et' | 'lv' | 'lt' | 'fi' | 'sv';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  flagCode: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flagCode: 'en' },
  { code: 'ru', label: 'Russian', nativeName: 'Русский', flagCode: 'ru' },
  { code: 'ka', label: 'Georgian', nativeName: 'ქართული', flagCode: 'geo' },
  { code: 'uz', label: 'Uzbek', nativeName: "O'zbek", flagCode: 'uzb' },
  { code: 'kk', label: 'Kazakh', nativeName: 'Қазақша', flagCode: 'kaz' },
  { code: 'uk', label: 'Ukrainian', nativeName: 'Українська', flagCode: 'ukr' },
  { code: 'zh', label: 'Chinese', nativeName: '中文', flagCode: 'chn' },
  { code: 'tr', label: 'Turkish', nativeName: 'Türkçe', flagCode: 'tur' },
  { code: 'hy', label: 'Armenian', nativeName: 'Հայერენ', flagCode: 'arm' },
  { code: 'az', label: 'Azerbaijani', nativeName: 'Azərbaycan', flagCode: 'aze' },
  { code: 'ro', label: 'Romanian', nativeName: 'Română', flagCode: 'rou' },
  { code: 'et', label: 'Estonian', nativeName: 'Eesti', flagCode: 'est' },
  { code: 'lv', label: 'Latvian', nativeName: 'Latviešu', flagCode: 'lva' },
  { code: 'lt', label: 'Lithuanian', nativeName: 'Lietuvių', flagCode: 'ltu' },
  { code: 'fi', label: 'Finnish', nativeName: 'Suomi', flagCode: 'fin' },
  { code: 'sv', label: 'Swedish', nativeName: 'Svenska', flagCode: 'swe' },
];

export const LANGUAGE_FLAG_MAP: Record<string, string> = {
  en: 'en',
  gb: 'en',
  ru: 'ru',
  ka: 'geo',
  ge: 'geo',
  geo: 'geo',
  uz: 'uzb',
  uzb: 'uzb',
  kk: 'kaz',
  kz: 'kaz',
  kaz: 'kaz',
  uk: 'ukr',
  ua: 'ukr',
  ukr: 'ukr',
  zh: 'chn',
  cn: 'chn',
  chn: 'chn',
  tr: 'tur',
  tur: 'tur',
  hy: 'arm',
  am: 'arm',
  arm: 'arm',
  az: 'aze',
  aze: 'aze',
  ro: 'rou',
  rou: 'rou',
  md: 'mda',
  mda: 'mda',
  et: 'est',
  est: 'est',
  lv: 'lva',
  lva: 'lva',
  lt: 'ltu',
  ltu: 'ltu',
  fi: 'fin',
  fin: 'fin',
  sv: 'swe',
  se: 'swe',
  swe: 'swe',
};

export function getLanguageFlagSrc(langCode: string): string {
  const code = (langCode || 'en').toLowerCase().trim();
  const file = LANGUAGE_FLAG_MAP[code] || 'en';
  return `/assets/flags/${file}.svg`;
}

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
  US: 'en',
  GB: 'en',
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
    // Nav
    'nav.menu': 'Artisan Menu',
    'nav.booking': 'Table Reservation',
    'nav.about': 'About & Hours',
    'nav.account': 'Sign In / Account',
    'nav.customCake': 'Custom Cake',
    'nav.reports': 'Reports',
    'nav.apiDocs': 'API Docs',
    'nav.admin': 'Admin',
    'nav.bag': 'Bag',
    // Hero
    'hero.badge': 'ARTISAN CONFECTIONERY & CAFÉ',
    'hero.title1': 'Sweet Moments',
    'hero.title2': 'Start Here',
    'hero.welcome': 'Welcome to Cherry Cake',
    'hero.subtitle':
      'Handcrafted with passion and baked fresh every sunrise. We pair authentic European pastry techniques with fresh wild berries, pure dairy cream, and single-origin Belgian chocolate to celebrate your every sweet milestone.',
    'hero.viewMenu': 'View Menu',
    'hero.explore': 'Explore Flavors',
    'hero.perk1': '100% Natural Berries & Cream',
    'hero.perk2': 'Baked Fresh Every Day',
    'hero.perk3': 'Regional Delivery & Pickup',
    'hero.chocolate': 'Chocolate Indulgence',
    'hero.viewCake': 'View Cake',
    'hero.strawberry': 'Strawberry Bliss',
    'hero.viewTreat': 'View Treat',
    'hero.rating': '★ 4.9 • 1,200+ Happy Guests',
    // Featured Specialties / Signature Delights
    'section.delightsTag': 'OUR ARTISAN SPECIALTIES',
    'section.delightsTitle': 'Signature Delights',
    'section.delightsSub':
      'A curated glimpse of our handcrafted confectionery, whipped to perfection and prepared fresh every single morning.',
    'treat.tagBarista': 'Specialty Barista',
    'treat.titleLatte': 'Velvet Latte & Coffee',
    'treat.descLatte':
      'Single-origin Arabica espresso paired with velvety microfoam milk and delicate floral lavender notes.',
    'treat.linkDrinks': 'Explore Drinks',
    'treat.tagSignature': "Chef's Signature",
    'treat.titleChocolate': 'Chocolate Truffle Cake',
    'treat.descChocolate':
      'Rich layers of dark Belgian chocolate sponge infused with farm-picked berries and silky cocoa ganache.',
    'treat.linkCakes': 'Explore Cakes',
    'treat.tagBestseller': 'Classic Bestseller',
    'treat.titleHoney': 'Golden Honey & Cream',
    'treat.descHoney':
      'Golden caramelised honey cake layers layered with cloud-light sour cream mousse and crumb topping.',
    'treat.linkPastries': 'Explore Pastries',
    // Spotlight Pairing
    'spotlight.badge': "Pastry Chef's Pairing",
    'spotlight.title': 'Artisan Pastry & Coffee Pairing',
    'spotlight.desc':
      'Every memorable dessert deserves its perfect counterpart. Enjoy our freshly whipped berry cupcakes alongside our house-specialty roast coffee — balanced to perfection for your morning coffee break or evening celebration.',
    'spotlight.btn': 'Explore Bakery Menu',
    // Pillars
    'pillar.title1': 'Quality Ingredients, Unforgettable Taste',
    'pillar.desc1':
      'We source only natural dairy cream, organic flour, and farm-fresh berries without artificial coloring or preservatives.',
    'pillar.title2': 'Freshly Baked Every Single Day',
    'pillar.desc2':
      'Baked in small artisanal batches every morning to ensure unmatched texture, moisture, and delicate aroma in every bite.',
    'pillar.title3': '1,200+ Happy Celebrations',
    'pillar.desc3':
      'From intimate afternoon tea to grand anniversaries and weddings, our desserts bring smiles across all our regions.',
    // Promo Banner
    'promo.title': 'Ready to Bite into Happiness?',
    'promo.desc':
      'Explore our complete catalog with localized pricing, custom modifier options, and seamless checkout with delivery.',
    'promo.btn': 'Open Full Menu →',
    // Footer
    'footer.brandSubtitle': 'Haute Pâtisserie & Café',
    'footer.desc':
      'Celebrating the harmony between classic French viennoiserie and delicate Japanese cherry blossom botanicals. Handcrafted daily with single-origin butter and premium Belgian cocoa.',
    'footer.freshDaily': 'Fresh Daily',
    'footer.artisanalRecipes': 'Artisanal Recipes',
    'footer.specialtyRoasts': 'Specialty Roasts',
    'footer.artisanMenu': 'Artisan Menu',
    'footer.menuCherry': 'Cherry Blossom Heart Gateau',
    'footer.menuBerry': 'Triple Berry Gumdrop Heart',
    'footer.menuVanilla': 'Golden Vanilla Fudge Heart',
    'footer.menuSmiley': 'Smiley Berry Artisan Square',
    'footer.menuSweetheart': 'Sweetheart Chocolate Petite',
    'footer.menuClover': 'Lucky Clover Chocolate Gateau',
    'footer.hours': 'Café & Hospitality',
    'footer.monFri': 'Mon - Fri:',
    'footer.satSun': 'Sat - Sun:',
    'footer.hubPickup': 'Hub Pickup:',
    'footer.pickupTimes': 'Daily 08:30 - 21:30',
    'footer.bookTable': 'Book a Café Table',
    'footer.portals': 'Client & API Portals',
    'footer.customerAccount': 'Customer Sign In / Account',
    'footer.adminPortal': 'Administrator Portal',
    'footer.apiSwagger': 'REST API Swagger UI',
    'footer.apiOpenApi': 'OpenAPI Specification (JSON)',
    'footer.qaReports': 'Quality Assurance Reports',
    'footer.copyright': '© 2026 Cherry Cake Bakery & Café. All rights reserved. • ITPU University Teamwork 2026 (Team 9).',
    'footer.menu': 'Menu',
    'footer.reservations': 'Reservations',
    'footer.account': 'Account',
    'footer.apiRef': 'API Reference',
    'lang.switcherTitle': 'Select display language',
  },
  ru: {
    // Nav
    'nav.menu': 'Авторское Меню',
    'nav.booking': 'Бронь столика',
    'nav.about': 'О нас и часы',
    'nav.account': 'Войти / Профиль',
    'nav.customCake': 'Торт на заказ',
    'nav.reports': 'Отчёты',
    'nav.apiDocs': 'API Документация',
    'nav.admin': 'Админ',
    'nav.bag': 'Корзина',
    // Hero
    'hero.badge': 'КОНДИТЕРСКАЯ И КАФЕ',
    'hero.title1': 'Сладкие моменты',
    'hero.title2': 'Начинаются здесь',
    'hero.welcome': 'Добро пожаловать в Cherry Cake',
    'hero.subtitle':
      'Приготовлено с душой и выпекается каждое утро на рассвете. Мы объединяем аутентичные французские рецепты со свежими лесными ягодами, натуральными фермерскими сливками и премиальным бельгийским шоколадом.',
    'hero.viewMenu': 'Посмотреть меню',
    'hero.explore': 'Выбрать десерты',
    'hero.perk1': '100% Натуральные ягоды и крем',
    'hero.perk2': 'Свежая выпечка каждое утро',
    'hero.perk3': 'Быстрая доставка и самовывоз',
    'hero.chocolate': 'Шоколадный восторг',
    'hero.viewCake': 'Смотреть торт',
    'hero.strawberry': 'Клубничное блаженство',
    'hero.viewTreat': 'Смотреть десерт',
    'hero.rating': '★ 4.9 • 1,200+ Довольных гостей',
    // Featured Specialties / Signature Delights
    'section.delightsTag': 'НАШИ АВТОРСКИЕ ШЕДЕВРЫ',
    'section.delightsTitle': 'Фирменные Сладости',
    'section.delightsSub':
      'Коллекция утренней выпечки и десертов ручной работы, приготовленных со страстью и любовью.',
    'treat.tagBarista': 'Выбор Бариста',
    'treat.titleLatte': 'Бархатный Латте и Кофе',
    'treat.descLatte':
      'Эспрессо из 100% Арабики со взбитым бархатным молоком и нежными нотками горной лаванды.',
    'treat.linkDrinks': 'Смотреть напитки',
    'treat.tagSignature': 'Шедевр Шефа',
    'treat.titleChocolate': 'Шоколадный Трюфельный Торт',
    'treat.descChocolate':
      'Насыщенные слои темного бельгийского шоколада с лесными ягодами и шелковистым какао-ганашем.',
    'treat.linkCakes': 'Смотреть торты',
    'treat.tagBestseller': 'Классический Хит',
    'treat.titleHoney': 'Медовик с Нежным Кремом',
    'treat.descHoney':
      'Золотистые карамелизированные медовые коржи с воздушным сметанным муссом и хрустящей крошкой.',
    'treat.linkPastries': 'Смотреть пирожные',
    // Spotlight Pairing
    'spotlight.badge': 'Рекомендация Шеф-кондитера',
    'spotlight.title': 'Гармония Десерта и Кофе',
    'spotlight.desc':
      'Каждый особенный десерт заслуживает идеального аккомпанемента. Попробуйте свежие ягодные капкейки в сочетании с нашим фирменным кофе свежей обжарки.',
    'spotlight.btn': 'Открыть Меню Кондитерской',
    // Pillars
    'pillar.title1': 'Натуральные Ингредиенты, Незабываемый Вкус',
    'pillar.desc1':
      'Только натуральные фермерские сливки, органическая мука и свежие ягоды без красителей и консервантов.',
    'pillar.title2': 'Свежая Выпечка Каждое Утро',
    'pillar.desc2':
      'Выпекаем небольшими партиями каждый день на рассвете, сохраняя безупречную свежесть, текстуру и аромат.',
    'pillar.title3': 'Более 1,200 Счастливых Праздников',
    'pillar.desc3':
      'От уютных чаепитий до пышных свадеб и дней рождения — наши десерты дарят радость во всех регионах.',
    // Promo Banner
    'promo.title': 'Готовы попробовать настоящее счастье?',
    'promo.desc':
      'Откройте полный каталог с актуальными региональными ценами, выбором опций и быстрой доставкой.',
    'promo.btn': 'Открыть Всё Меню →',
    // Footer
    'footer.brandSubtitle': 'Высокое Кондитерское Искусство & Кафе',
    'footer.desc':
      'Изящная гармония классической французской выпечки и нежных цветов сакуры. Ручная работа каждое утро из фермерского масла и бельгийского какао.',
    'footer.freshDaily': 'Свежее Каждое Утро',
    'footer.artisanalRecipes': 'Авторские Рецепты',
    'footer.specialtyRoasts': 'Свежая Обжарка',
    'footer.artisanMenu': 'Авторское Меню',
    'footer.menuCherry': 'Торт Сердце Сакуры',
    'footer.menuBerry': 'Тройное Ягодное Сердце',
    'footer.menuVanilla': 'Ванильно-карамельное Сердце',
    'footer.menuSmiley': 'Ягодный Квадрат Смайли',
    'footer.menuSweetheart': 'Шоколадный Десерт Sweetheart',
    'footer.menuClover': 'Торт Клевер Удачи',
    'footer.hours': 'Кафе и Гостеприимство',
    'footer.monFri': 'Пн - Пт:',
    'footer.satSun': 'Сб - Вс:',
    'footer.hubPickup': 'Самовывоз:',
    'footer.pickupTimes': 'Ежедневно 08:30 - 21:30',
    'footer.bookTable': 'Забронировать столик',
    'footer.portals': 'Клиентские и API Порталы',
    'footer.customerAccount': 'Личный кабинет клиента',
    'footer.adminPortal': 'Панель администратора',
    'footer.apiSwagger': 'REST API Swagger UI',
    'footer.apiOpenApi': 'Спецификация OpenAPI (JSON)',
    'footer.qaReports': 'Отчёты контроля качества',
    'footer.copyright': '© 2026 Cherry Cake Bakery & Café. Все права защищены. • ITPU University Teamwork 2026 (Team 9).',
    'footer.menu': 'Меню',
    'footer.reservations': 'Бронирование',
    'footer.account': 'Профиль',
    'footer.apiRef': 'Документация API',
    'lang.switcherTitle': 'Выбрать язык отображения',
  },
  ka: {
    // Nav
    'nav.menu': 'საავტორო მენიუ',
    'nav.booking': 'მაგიდის დაჯავშნა',
    'nav.about': 'ჩვენს შესახებ',
    'nav.account': 'შესვლა / პროფილი',
    'nav.customCake': 'ტორტი შეკვეთით',
    'nav.reports': 'ანგარიშები',
    'nav.apiDocs': 'API დოკუმენტაცია',
    'nav.admin': 'ადმინი',
    'nav.bag': 'კალათა',
    // Hero
    'hero.badge': 'საკონდიტრო და კაფე',
    'hero.title1': 'ტკბილი წუთები',
    'hero.title2': 'იწყება აქ',
    'hero.welcome': 'მოგესალმებათ Cherry Cake-ში',
    'hero.subtitle':
      'სიყვარულით დამზადებული და ყოველ დილით ახლად გამომცხვარი. ფრანგული საკონდიტრო ტრადიციები, ველური კენკრა, ნამდვილი ნაღები და ბელგიური შოკოლადი.',
    'hero.viewMenu': 'მენიუს ნახვა',
    'hero.explore': 'დესერტების შერჩევა',
    'hero.perk1': '100% ნატურალური კენკრა და ნაღები',
    'hero.perk2': 'ახალი ნამცხვრები ყოველ დილით',
    'hero.perk3': 'სწრაფი მიტანა და გატანა',
    'hero.chocolate': 'შოკოლადის სიამოვნება',
    'hero.viewCake': 'ტორტის ნახვა',
    'hero.strawberry': 'მარწყვის ნეტარება',
    'hero.viewTreat': 'დესერტის ნახვა',
    'hero.rating': '★ 4.9 • 1,200+ კმაყოფილი სტუმარი',
    // Featured Specialties / Signature Delights
    'section.delightsTag': 'ჩვენი საავტორო დესერტები',
    'section.delightsTitle': 'რჩეული ტკბილეული',
    'section.delightsSub':
      'ხელით დამზადებული საუცხოო საკონდიტრო ნაწარმი, გამომცხვარი ყოველ დილით თქვენი სიამოვნებისთვის.',
    'treat.tagBarista': 'ბარისტას რჩეული',
    'treat.titleLatte': 'ხავერდოვანი ლატე და ყავა',
    'treat.descLatte':
      'არაბიკას ესპრესო ხავერდოვანი რძის ქაფით და ლავანდის ნაზი ნოტებით.',
    'treat.linkDrinks': 'სასმელების ნახვა',
    'treat.tagSignature': 'შეფის ხელწერა',
    'treat.titleChocolate': 'შოკოლადის ტრიუფელის ტორტი',
    'treat.descChocolate':
      'შავი ბელგიური შოკოლადის ბისკვიტი ტყის კენკრითა და განაშით.',
    'treat.linkCakes': 'ტორტების ნახვა',
    'treat.tagBestseller': 'კლასიკური ბესტსელერი',
    'treat.titleHoney': 'ოქროსფერი თაფლის ნამცხვარი',
    'treat.descHoney':
      'კარამელიზებული თაფლის ფენები ჰაეროვანი მუსითა და ხრაშუნა ნაფხვენით.',
    'treat.linkPastries': 'ნამცხვრების ნახვა',
    // Spotlight Pairing
    'spotlight.badge': 'შეფ-კონდიტერის რეკომენდაცია',
    'spotlight.title': 'დესერტისა და ყავის ჰარმონია',
    'spotlight.desc':
      'ყველა განსაკუთრებული დესერტი იმსახურებს საუკეთესო ყავას. დააგემოვნეთ ჩვენი კენკრის კექსები ახლად მოხალულ ყავასთან ერთად.',
    'spotlight.btn': 'საკონდიტროს მენიუს გახსნა',
    // Pillars
    'pillar.title1': 'ხარისხიანი ინგრედიენტები, დაუვიწყარი გემო',
    'pillar.desc1':
      'მხოლოდ ნატურალური ნაღები, ორგანული ფქვილი და ახალი კენკრა საღებავებისა და კონსერვანტების გარეშე.',
    'pillar.title2': 'გამომცხვარი ყოველ დილით',
    'pillar.desc2':
      'ვაცხობთ მცირე პარტიებად ყოველ დილით, რათა შევინარჩუნოთ საუკეთესო სინედლე და არომატი.',
    'pillar.title3': '1,200+ ბედნიერი დღესასწაული',
    'pillar.desc3':
      'მყუდრო ჩაის სმიდან გრანდიოზულ ქორწილებამდე — ჩვენი დესერტები ყველას ღიმილს ჩუქნის.',
    // Promo Banner
    'promo.title': 'მზად ხართ გასინჯოთ ბედნიერება?',
    'promo.desc':
      'დაათვალიერეთ ჩვენი სრული კატალოგი რეგიონალური ფასებით, შეკვეთით დამზადებითა და მიტანით.',
    'promo.btn': 'სრული მენიუს გახსნა →',
    // Footer
    'footer.brandSubtitle': 'მაღალი საკონდიტრო ხელოვნება & კაფე',
    'footer.desc':
      'ფრანგული საკონდიტრო ტრადიციებისა და იაპონური ალუბლის ყვავილობის ჰარმონია. ყოველდღე ხელით დამზადებული საუკეთესო ინგრედიენტებით.',
    'footer.freshDaily': 'ყოველდღე ახალი',
    'footer.artisanalRecipes': 'საავტორო რეცეპტები',
    'footer.specialtyRoasts': 'რჩეული ყავა',
    'footer.artisanMenu': 'საავტოро მენიუ',
    'footer.menuCherry': 'ალუბლის ყვავილობის გულის ტორტი',
    'footer.menuBerry': 'სამმაგი კენკრის გული',
    'footer.menuVanilla': 'ვანილის ფაჯის გული',
    'footer.menuSmiley': 'სმაილი კენკრის კვადრატი',
    'footer.menuSweetheart': 'შოკოლადის პეტიტი',
    'footer.menuClover': 'იღბლიანი სამყურას ტორტი',
    'footer.hours': 'კაფე და მასპინძლობა',
    'footer.monFri': 'ორშ - პარ:',
    'footer.satSun': 'შაბ - კვრ:',
    'footer.hubPickup': 'გატანა:',
    'footer.pickupTimes': 'ყოველდღე 08:30 - 21:30',
    'footer.bookTable': 'მაგიდის დაჯავშნა',
    'footer.portals': 'კლიენტის და API პორტალები',
    'footer.customerAccount': 'მომხმარებლის პროფილი',
    'footer.adminPortal': 'ადმინისტრატორის პორტალი',
    'footer.apiSwagger': 'REST API Swagger UI',
    'footer.apiOpenApi': 'OpenAPI სპეციფიკაცია (JSON)',
    'footer.qaReports': 'ხარისხის ანგარიშები',
    'footer.copyright': '© 2026 Cherry Cake Bakery & Café. ყველა უფლება დაცულია. • ITPU University Teamwork 2026 (Team 9).',
    'footer.menu': 'მენიუ',
    'footer.reservations': 'დაჯავშნა',
    'footer.account': 'პროფილი',
    'footer.apiRef': 'API დოკუმენტაცია',
    'lang.switcherTitle': 'ენის არჩევა',
  },
  uz: {
    // Nav
    'nav.menu': 'Artisan Menyu',
    'nav.booking': 'Stol Band Qilish',
    'nav.about': 'Biz Haqimizda',
    'nav.account': 'Kirish / Profil',
    'nav.customCake': 'Buyurtma Tort',
    'nav.reports': 'Hisobotlar',
    'nav.apiDocs': 'API Hujjatlar',
    'nav.admin': 'Admin',
    'nav.bag': 'Savat',
    // Hero
    'hero.badge': 'QANDOLATCHILIK VA QAHVAXONA',
    'hero.title1': 'Shirin Lahzalar',
    'hero.title2': 'Shu Yerdan Boshlanadi',
    'hero.welcome': 'Cherry Cake ga xush kelibsiz',
    'hero.subtitle':
      'Fransuz qandolatchiligi va nozik gilos gullari uyg‘unligi. Har kuni ertalab tabiiy qaymoq va Belgiya shokoladidan tayyorlanadi.',
    'hero.viewMenu': 'Menyuni Ko‘rish',
    'hero.explore': 'Lazzatlarni Tanlash',
    'hero.perk1': '100% Tabiiy Mevalar va Qaymoq',
    'hero.perk2': 'Har Kuni Yangi Pishiriqlar',
    'hero.perk3': 'Yetkazib Berish va Olib Ketish',
    'hero.chocolate': 'Shokoladli Rohat',
    'hero.viewCake': 'Tortni Ko‘rish',
    'hero.strawberry': 'Qulupnayli Sehr',
    'hero.viewTreat': 'Pishiriqni Ko‘rish',
    'hero.rating': '★ 4.9 • 1,200+ Mamnun Mehmonlar',
    // Featured
    'section.delightsTag': 'BIZNING MAXSUS SHIRINLIKLAR',
    'section.delightsTitle': 'Saralangan Lazzatlar',
    'section.delightsSub':
      'Har tong mehr bilan tayyorlanadigan qo‘l mehnati pishiriqlarimizdan sara namunalar.',
    'treat.tagBarista': 'Barista Tanlovi',
    'treat.titleLatte': 'Baxmal Latte va Qahva',
    'treat.descLatte':
      'Arabica espressosi va mayin sut ko‘pigi nozik tog‘ lavandasi ifori bilan.',
    'treat.linkDrinks': 'Ichimliklarni ko‘rish',
    'treat.tagSignature': 'Bosh Oshpaz Mahorati',
    'treat.titleChocolate': 'Shokoladli Tryufel Tort',
    'treat.descChocolate':
      'To‘q Belgiya shokoladi, yangi mevalar va ipakdek shokoladli ganash qatlamlari.',
    'treat.linkCakes': 'Tortlarni ko‘rish',
    'treat.tagBestseller': 'Klassik Bestseller',
    'treat.titleHoney': 'Asalli Mayin Tort',
    'treat.descHoney':
      'Karamelli asalli qatlamlar va yengil smetana mussining betakror uyg‘unligi.',
    'treat.linkPastries': 'Pishiriqlarni ko‘rish',
    // Spotlight
    'spotlight.badge': 'Oshpaz Tavsiyasi',
    'spotlight.title': 'Qandolat va Qahva Uyg‘unligi',
    'spotlight.desc':
      'Har bir betakror shirinlikka mos qahva kerak. Yangi pishirilgan kapkeyklarni xushbo‘y qahvamiz bilan tatib ko‘ring.',
    'spotlight.btn': 'Katalog Menyusi',
    // Pillars
    'pillar.title1': 'Tabiiy Masalliqlar, Unutilmas Lazzat',
    'pillar.desc1':
      'Faqat tabiiy qaymoq, organik un va toza mevalar, hech qanday sun’iy bo‘yoqlarsiz.',
    'pillar.title2': 'Har Kuni Ertalab Yangi Pishirilgan',
    'pillar.desc2':
      'Betakror ta’m va xushbo‘ylikni saqlash uchun har tong kichik partiyalarda pishiriladi.',
    'pillar.title3': '1,200+ Quvonchli Bayramlar',
    'pillar.desc3':
      'Iliq choy kechalaridan to katta to‘ylargacha — barcha hududlarda xursandchilik ulashamiz.',
    // Promo
    'promo.title': 'Haqiqiy shirinlikdan bahramand bo‘ling',
    'promo.desc':
      'Hududiy narxlar va qulay yetkazib berish xizmati bilan to‘liq katalogimizni kashf eting.',
    'promo.btn': 'To‘liq Menyu →',
    // Footer
    'footer.brandSubtitle': 'Oliy Qandolatchilik San’ati & Qahvaxona',
    'footer.desc':
      'Klassik fransuz pishiriqlari va yapon sakura gullari uyg‘unligi. Har tong tabiiy sariyog‘ va Belgiya kakaosi bilan tayyorlanadi.',
    'footer.freshDaily': 'Har Kuni Yangi',
    'footer.artisanalRecipes': 'Mualliflik Retseptlari',
    'footer.specialtyRoasts': 'Yangi Qovurilgan Qahva',
    'footer.artisanMenu': 'Artisan Menyu',
    'footer.menuCherry': 'Gilos Gulli Yurak Torti',
    'footer.menuBerry': 'Uch Qavatli Mevali Yurak',
    'footer.menuVanilla': 'Oltin Vanilli Fadj Yurak',
    'footer.menuSmiley': 'Smayli Mevali Shirinlik',
    'footer.menuSweetheart': 'Shirin Shokoladli Petit',
    'footer.menuClover': 'Omadli Yonshir Shokoladli Tort',
    'footer.hours': 'Qahvaxona va Xizmat',
    'footer.monFri': 'Dush - Juma:',
    'footer.satSun': 'Shan - Yak:',
    'footer.hubPickup': 'Olib ketish:',
    'footer.pickupTimes': 'Har kuni 08:30 - 21:30',
    'footer.bookTable': 'Stol Band Qilish',
    'footer.portals': 'Mijoz va API Portallari',
    'footer.customerAccount': 'Mijoz Shaxsiy Kabineti',
    'footer.adminPortal': 'Administrator Paneli',
    'footer.apiSwagger': 'REST API Swagger UI',
    'footer.apiOpenApi': 'OpenAPI Hujjati (JSON)',
    'footer.qaReports': 'Sifat Nazorati Hisobotlari',
    'footer.copyright': '© 2026 Cherry Cake Bakery & Café. Barcha huquqlar himoyalangan. • ITPU University Teamwork 2026 (Team 9).',
    'footer.menu': 'Menyu',
    'footer.reservations': 'Bronlash',
    'footer.account': 'Profil',
    'footer.apiRef': 'API Hujjatlar',
    'lang.switcherTitle': 'Tilni tanlash',
  },
  kk: {
    // Nav
    'nav.menu': 'Арнайы Мәзір',
    'nav.booking': 'Үстел Брондау',
    'nav.about': 'Біз Туралы',
    'nav.account': 'Кіру / Профиль',
    'nav.customCake': 'Тапсырыс Торт',
    'nav.reports': 'Есептер',
    'nav.apiDocs': 'API Құжаттамасы',
    'nav.admin': 'Әкімші',
    'nav.bag': 'Себет',
    // Hero
    'hero.badge': 'КОНДИТЕРЛІК ЖӘНЕ КАФЕ',
    'hero.title1': 'Тәтті Сәттер',
    'hero.title2': 'Осында Басталады',
    'hero.welcome': 'Cherry Cake-ке қош келдіңіз',
    'hero.subtitle':
      'Француз кондитерлік өнері мен шие гүлдерінің үйлесімі. Күн сайын таңертең табиғи кілегей мен бельгиялық шоколадтан дайындалады.',
    'hero.viewMenu': 'Мәзірді Көру',
    'hero.explore': 'Дәмдерді Таңдау',
    'hero.perk1': '100% Табиғи Жидектер мен Кілегей',
    'hero.perk2': 'Күн Сайын Жаңа Пісірілген',
    'hero.perk3': 'Жеткізу Және Алып Кету',
    'hero.chocolate': 'Шоколадты Рахат',
    'hero.viewCake': 'Тортты Көру',
    'hero.strawberry': 'Құлпынай Ләззаты',
    'hero.viewTreat': 'Тәттіні Көру',
    'hero.rating': '★ 4.9 • 1,200+ Риза Қонақтар',
    // Featured
    'section.delightsTag': 'БІЗДІҢ АРНАЙЫ ӨНІМДЕР',
    'section.delightsTitle': 'Таңдаулы Тәттілер',
    'section.delightsSub':
      'Әр таң сайын шеберлікпен және махаббатпен әзірленетін қолөнер кондитерлік өнімдері.',
    'treat.tagBarista': 'Бариста Таңдауы',
    'treat.titleLatte': 'Барқыт Латте және Кофе',
    'treat.descLatte':
      'Табиғи сүт көбігі мен тау лавандасының нәзік хош иісі бар Арабика эспрессосы.',
    'treat.linkDrinks': 'Сусындарды көру',
    'treat.tagSignature': 'Бас Аспаз Қолтаңбасы',
    'treat.titleChocolate': 'Шоколадты Трюфель Торты',
    'treat.descChocolate':
      'Бельгиялық шоколад, балғын жидектер және жібектей ганаш қабаттары.',
    'treat.linkCakes': 'Торттарды көру',
    'treat.tagBestseller': 'Классикалық Хит',
    'treat.titleHoney': 'Балды нәзік торт',
    'treat.descHoney':
      'Карамельденген бал қабаттары мен жеңіл қаймақ муссының тамаша үйлесімі.',
    'treat.linkPastries': 'Тәттілерді көру',
    // Spotlight
    'spotlight.badge': 'Бас Аспаз Ұсынысы',
    'spotlight.title': 'Тәтті мен Кофе Үйлесімі',
    'spotlight.desc':
      'Әрбір керемет десерт тамаша кофеге лайық. Жаңа пісірілген капкейктерді фирмалық кофемен бірге татып көріңіз.',
    'spotlight.btn': 'Кондитерлік Мәзір',
    // Pillars
    'pillar.title1': 'Табиғи Ингредиенттер, Ұмытылмас Дәм',
    'pillar.desc1':
      'Тек табиғи кілегей, органикалық ұн және балғын жидектер, ешқандай бояғыштарсыз.',
    'pillar.title2': 'Әр Таңда Жаңа Пісіріледі',
    'pillar.desc2':
      'Керемет балғындық пен хош иісті сақтау үшін әр таң сайын шағын партиялармен дайындалады.',
    'pillar.title3': '1,200+ Бақытты Мерекелер',
    'pillar.desc3':
      'Жылы шай ішуден бастап үлкен тойларға дейін — біздің десерттер барлық өңірде қуаныш сыйлайды.',
    // Promo
    'promo.title': 'Шынайы бақыт дәмін татуға дайынсыз ба?',
    'promo.desc':
      'Өңірлік бағалар, арнайы опциялар және жылдам жеткізу қызметімен толық мәзірді ашыңыз.',
    'promo.btn': 'Толық Мәзір →',
    // Footer
    'footer.brandSubtitle': 'Жоғары Кондитерлік Өнер & Кафе',
    'footer.desc':
      'Классикалық француз кондитерлік дәстүрлері мен сакура гүлдерінің үйлесімі. Күн сайын табиғи сары май мен бельгиялық какаодан дайындалады.',
    'footer.freshDaily': 'Күнде Жаңа',
    'footer.artisanalRecipes': 'Авторлық Рецепттер',
    'footer.specialtyRoasts': 'Жаңа Қуырылған Кофе',
    'footer.artisanMenu': 'Арнайы Мәзір',
    'footer.menuCherry': 'Шие Гүлі Жүрек Торты',
    'footer.menuBerry': 'Үш Жидекті Жүрек Десерті',
    'footer.menuVanilla': 'Алтын Ваниль Фадж Жүрек',
    'footer.menuSmiley': 'Смайли Жидекті Тәттісі',
    'footer.menuSweetheart': 'Шоколадты Петит',
    'footer.menuClover': 'Сәтті Беде Шоколадты Торты',
    'footer.hours': 'Кафе Және Қонақжайлылық',
    'footer.monFri': 'Дүй - Жұм:',
    'footer.satSun': 'Сен - Жек:',
    'footer.hubPickup': 'Алып кету:',
    'footer.pickupTimes': 'Күн сайын 08:30 - 21:30',
    'footer.bookTable': 'Үстел Брондау',
    'footer.portals': 'Клиент Және API Порталдары',
    'footer.customerAccount': 'Клиент Жеке Кабинеті',
    'footer.adminPortal': 'Әкімші Порталы',
    'footer.apiSwagger': 'REST API Swagger UI',
    'footer.apiOpenApi': 'OpenAPI Құжаты (JSON)',
    'footer.qaReports': 'Сапа Бақылау Есептері',
    'footer.copyright': '© 2026 Cherry Cake Bakery & Café. Барлық құқықтар қорғалған. • ITPU University Teamwork 2026 (Team 9).',
    'footer.menu': 'Мәзір',
    'footer.reservations': 'Брондау',
    'footer.account': 'Профиль',
    'footer.apiRef': 'API Құжаттамасы',
    'lang.switcherTitle': 'Тілді таңдау',
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
