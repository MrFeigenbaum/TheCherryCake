import React, { useState, useEffect, useRef } from "react";
import "./FreyjaEasterEgg.css";

import artFebruaryPisces from "../../assets/quest/art-february-pisces.jpg";
import artTwoUmbrellas from "../../assets/quest/art-two-umbrellas.jpg";
import artAriesCat from "../../assets/quest/art-aries-cat.jpg";
import artCelestialGrid from "../../assets/quest/art-celestial-grid.jpg";
import artCaucasusPines from "../../assets/quest/art-caucasus-pines.jpg";
import artCodePeaks from "../../assets/quest/art-code-peaks.jpg";

interface Chapter {
  id: number;
  tag: string;
  location: string;
  heading: string;
  art: string;
  hudLeft: string;
  hudRight: string;
  narrative: string;
  poemTitle: string;
  poemLines: string[];
  choices: { text: string; nextChapter: number }[];
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    tag: "ГЛАВА I // ПРОЛОГ",
    location: "ПОЛУНОЧНЫЙ БАР • ФЕВРАЛЬСКИЙ ДОЖДЬ",
    heading: "Февральские Рыбы в глубинной тишине",
    art: artFebruaryPisces,
    hudLeft: "📍 02:00 AM // RAIN RESONANCE 84%",
    hudRight: "PISCES CONVERGENCE",
    narrative:
      "Февральский дождь бьёт по запотевшим стеклам бара на перепутье миров. Внутри тепло, пахнет кофе и мокрым асфальтом.\n\nЗа стойкой сидят двое. Молчат, как киты в океанской глубине. В их взглядах — не печаль, а то тихое знание, которое приходит, когда душу переполняет невысказанное чувство.",
    poemTitle: "ФЕВРАЛЬСКИЕ РЫБЫ",
    poemLines: [
      "В бар зашли февральские Рыбы —",
      "С глазами: \"Видел тебя я во сне\".",
      "Сидят у стойки. Молчат, как киты бы",
      "молчали в глубинной своей тишине.",
      "",
      "— Вам по бокалу?",
      "— Нет, нам бы по смыслу…",
      "Немного любви и побольше тепла.",
      "Бармен вздыхает: \"Философы, блин,",
      "Опять на водичке… и без бабла\".",
      "",
      "Они улыбаются тонко, прощающе,",
      "Грустью, что в мире враждебен уют.",
      "Смотрят в стакан, как в бездну сияющую —",
      "А вдруг там ответы их уже ждут?",
      "",
      "— Ну как вам февраль?",
      "— Он туманен и тонок,",
      "Как память о жизни, которой и нет…",
      "— А планы?",
      "— Мы ж Рыбы. Какие нам планы?",
      "Мы плывём, где теченье сгибает рассвет.",
    ],
    choices: [
      { text: "Вспомнить тот самый вечер под дождём...", nextChapter: 2 },
      { text: "Прислушаться к тишине за окном и сделать шаг в память...", nextChapter: 2 },
    ],
  },
  {
    id: 2,
    tag: "ГЛАВА II // ВОСПОМИНАНИЕ",
    location: "МОСТ НАД БЫСТРОЙ РЕКОЙ // ЭЛЕГИЯ",
    heading: "Когда дождь говорит за нас",
    art: artTwoUmbrellas,
    hudLeft: "📍 RIVER BRIDGE // ECHOES IN MIST",
    hudRight: "TWO PATHS DIVERGING",
    narrative:
      "Они шли рядом по скользким гранитным плитам набережной. Одно ночное небо над головой, один холодный ветер, касающийся лиц — но два разных зонта.\n\nКазалось: вот бы внезапный порыв ветра сорвал эти зонты и унёс в реку, чтобы в темноте остался лишь смех и тепло двух ладоней. Но правила этого мира непреклонны. Жёлтое такси мигнуло фарами, разрезая водяную пелену, и увезло её. А он остался один на террасе — слушать, как капли отбивают ритм неслучившейся судьбы.",
    poemTitle: "КОГДА ДОЖДЬ ГОВОРИТ ЗА НАС",
    poemLines: [
      "Двое под одним небом,",
      "Но под разными зонтами.",
      "Шли по улице дождливой,",
      "Герои нашей элегии.",
      "",
      "… А вдруг!? Зонты, внезапно бы, слетели с рук героев!",
      "И унеслись бы ветром, прямиком, к Верийскому мосту,",
      "Где в середине, закружив в красивом танце,",
      "Герои наши повстречали бы судьбу.",
      "",
      "Хоть зонты и улетели бы, порывом, прямо в реку Куру,",
      "Герои, улыбкою своею, согрели бы друг друга.",
      "Да под дождём, смеясь, держась за руки,",
      "Вернулись бы обратно в свой отель.",
      "",
      "Но смысла нет в его надеждах…",
      "Ведь не суждено им быть вдвоём…",
      "Она вернётся в номер свой и забудет навсегда его…",
      "А он выйдет на террасу под дождём,",
      "И всё будет думать о своём…",
    ],
    choices: [
      { text: "Взглянуть сквозь пелену дождя в её глаза...", nextChapter: 3 },
      { text: "Вспомнить её улыбку и созвездие Овна...", nextChapter: 3 },
    ],
  },
  {
    id: 3,
    tag: "ГЛАВА III // СОЗВЕЗДИЕ",
    location: "ТЁПЛАЯ КОМНАТА // ЛУННЫЙ СВЕТ",
    heading: "Под созвездием Овна и мурчанием кота",
    art: artAriesCat,
    hudLeft: "📍 ARIES TRANSIT // CANDLE AT 02:45 AM",
    hudRight: "ROSE ESSENCE & WHISPERS",
    narrative:
      "Бывают мгновения, которые остаются в душе навсегда. Её пылкий, упрямый и трогательный характер истинного Овна — маленькая конфетка, обидевшаяся из-за сущего пустяка.\n\nЗа окном плывёт луна, на подоконнике тихо мурлычет кот, а комната наполняется ароматом роз. В такие секунды понимаешь: время бессильно. Сколько бы веков ни прошло, сколько бы жизней ни сменилось — эта связь уже вплетена в ткань Вселенной.",
    poemTitle: "ПОД ЛУНОЙ",
    poemLines: [
      "Под созвездием Овна",
      "И мурчанием нашего кота,",
      "Смотрю на тебя, дорогая моя.",
      "В лучах лунного света и роз аромат,",
      "Любуюсь тобою я словно впервые,",
      "Конфетка, обидевшаяся из-за пустяка на меня.",
      "",
      "Я вспомню строчки Мухаммада Руми,",
      "подойду, обниму и тебе прошепчу…",
      "\"И в этой, и в прошлой, и в будущей жизнях",
      "Мы были и будем с тобою всегда!",
      "И пусть исчезают эпохи и люди,",
      "Моя ты навеки!",
      "Моя ты жена…\"",
    ],
    choices: [
      { text: "Подняться к ледяным вершинам Северных Врат...", nextChapter: 4 },
      { text: "Искать свет сквозь древнюю бездну...", nextChapter: 4 },
    ],
  },
  {
    id: 4,
    tag: "ГЛАВА IV // ИСПЫТАНИЕ",
    location: "СЕВЕРНЫЕ ВРАТА // ЛЕДЯНАЯ БЕЗДНА",
    heading: "Ледяной мост над бездной вековой",
    art: artCelestialGrid,
    hudLeft: "📍 NORTHERN GATES // ELEV 2,740M",
    hudRight: "COORDINATE TELEMETRY: 318° NW",
    narrative:
      "Перед ним встают великие Северные Врата — неприступные горные пики, окутанные космической тишиной и звёздными координатными сетками. Лёд сковал перевалы, как реальность сковала их пути: у неё своя жизнь, другой человек, нерушимые границы.\n\nНо тот, кто по-настоящему любит, не требует и не штурмует крепость. Он хранит в груди огонь, веря, что даже самый холодный вековой лёд однажды растает под лучами чистого света.",
    poemTitle: "СЕВЕРНЫЕ ВРАТА",
    poemLines: [
      "Мечтой живу, в душе храня огонь,",
      "И верю: лёд растает в час желанный.",
      "Лишь откроются ворота севера, и сон,",
      "А там рассвет зажжёт нам свет желанный.",
      "",
      "И реки льда расступятся вдали,",
      "Воздвигнув мост над бездной вековой.",
      "С двух берегов поднимутся огни,",
      "Чтоб встретиться под аркой ледяной.",
      "",
      "И загудит под ними древний лёд,",
      "Как голос снов, что спал веками в бездне.",
      "Сиянье север в небесах зажжёт,",
      "Разрушив мрак дыханием прелестным.",
      "",
      "И в миг, когда сойдутся два пути,",
      "Раскроются врата в поток сиянья.",
      "И дрогнет мир, чтоб в свете обрести",
      "Начало дней и смысл мироздания.",
    ],
    choices: [
      { text: "Дождаться первого луча рассвета над пиками...", nextChapter: 5 },
      { text: "Сказать самые важные слова, даже если они останутся тайной...", nextChapter: 5 },
    ],
  },
  {
    id: 5,
    tag: "ГЛАВА V // КУЛЬМИНАЦИЯ",
    location: "ВЕРШИНЫ КАВКАЗА // 05:45 AM",
    heading: "I'd Still Come — Обещание сквозь тьму",
    art: artCaucasusPines,
    hudLeft: "📍 DAWN VECTOR // 05:45 AM",
    hudRight: "UNCONDITIONAL HARMONY",
    narrative:
      "Первые лучи рассвета прорезают туман над вершинами и горными озёрами. Наступает кристальная ясность.\n\nЛюбовь не требует обладания. Она в том, чтобы всегда быть той самой невидимой, но несокрушимой стеной за её спиной. Прикрывать в работе, беречь на каждом шагу, радоваться её счастью. И знать: что бы ни случилось в этом мире, если в два часа ночи ей понадобится помощь — преград не существует.",
    poemTitle: "I'D STILL COME",
    poemLines: [
      "I tried to live a quieter life,",
      "To drown your name in day and night.",
      "But every thought still circles back,",
      "To what we had and what I lack.",
      "I should’ve said \"Hello, let’s talk,\"",
      "Instead I ran, I watched you walk.",
      "Could’ve been your shadow, your light,",
      "But I confessed at the wrong time.",
      "Should’ve been a friend, stayed still…",
      "",
      "I’d still come if you called,",
      "Even now, after all.",
      "If you broke down at 2 a.m.,",
      "I'd be there like I never left.",
      "Though I lost the only war I've won,",
      "If you asked, I’d still come.",
      "",
      "Though my hands are scorched and numb,",
      "I’d still come… if you just asked.",
    ],
    choices: [
      { text: "Обрести главный ответ о смысле этой жизни...", nextChapter: 6 },
    ],
  },
  {
    id: 6,
    tag: "ГЛАВА VI // ЭПИЛОГ",
    location: "РАССВЕТ // ВДОХНОВЕНИЕ ВЕЧНОСТИ",
    heading: "В чём смысл жизни? // Care este sensul vieții?",
    art: artCodePeaks,
    hudLeft: "📍 TRANSCENDENCE // INFINITY CODE",
    hudRight: "THE QUIET FLAME",
    narrative:
      "Горы растворяются в потоках золотого утреннего света. Сказка подошла к своему финалу — но в реальности этот свет только начинается.\n\nПусть другие думают, что это просто красивая поэтическая новелла о далёких Северных Вратах. Лишь одно сердце знает, для кого зажжён каждый символ этой страницы, почему в Cherry Cake столько заботы и тепла, и чьё имя незримо вышито на каждой строчке этого кода.",
    poemTitle: "В ЧЁМ СМЫСЛ ЖИЗНИ?",
    poemLines: [
      "Nu există în lume putere mai înfricoșătoare și mai frumoasă decât Iubirea.",
      "Ea rănește, dar și dăruiește sufletului o ocrotire cerească.",
      "Iar dacă inima nu știe pe cine să păstreze cu tandrețe,",
      "Atunci care este rostul acestei vieți și pentru ce să mai trăiești?",
      "",
      "Ни силы страшней, ни прекрасней нет в мире, чем Любовь,",
      "Она ранит, но и дарит душе небесный покров.",
      "И если сердце не знает, кого ему нежно хранить,",
      "Тогда в чём смысл этой жизни и зачем дальше жить?",
    ],
    choices: [
      { text: "Сохранить этот свет в сердце и вернуться в реальность ✨", nextChapter: 0 },
    ],
  },
];

export const FreyjaEasterEgg: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"lyrics" | "full">("lyrics");
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and handle background music
  useEffect(() => {
    if (isOpen) {
      // Pause any active audio or video on page
      document.querySelectorAll("audio, video").forEach((el) => {
        try {
          if (el !== audioRef.current) {
            (el as HTMLMediaElement).pause();
          }
        } catch {}
      });

      // Play "Mustafa Afsharoglu - I KNOW I WILL SEE YOU AGAIN"
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Auto-play was restricted by browser; user can click play button
          setIsPlaying(false);
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isOpen]);

  // Reset active lyric line whenever chapter changes
  useEffect(() => {
    setCurrentLineIndex(0);
  }, [currentChapterIndex]);

  // Keyboard shortcut listener
  useEffect(() => {
    let keyBuffer = "";
    const targetCode = "freyja";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        return;
      }

      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      if (isOpen) {
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= 6) {
          setCurrentChapterIndex(num - 1);
          return;
        }
        if (e.key === "ArrowDown" || e.key === " ") {
          e.preventDefault();
          const lines = CHAPTERS[currentChapterIndex].poemLines;
          setCurrentLineIndex((prev) => Math.min(prev + 1, lines.length - 1));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setCurrentLineIndex((prev) => Math.max(prev - 1, 0));
          return;
        }
        if (e.key === "ArrowRight") {
          setCurrentChapterIndex((prev) => Math.min(prev + 1, CHAPTERS.length - 1));
          return;
        }
        if (e.key === "ArrowLeft") {
          setCurrentChapterIndex((prev) => Math.max(prev - 1, 0));
          return;
        }
      }

      keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-targetCode.length);
      if (keyBuffer === targetCode) {
        setIsOpen(true);
        setCurrentChapterIndex(0);
        setCurrentLineIndex(0);
        keyBuffer = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentChapterIndex]);

  if (!isOpen) return null;

  const currentChapter = CHAPTERS[currentChapterIndex];
  const progressPercent = ((currentChapterIndex + 1) / CHAPTERS.length) * 100;
  const lines = currentChapter.poemLines;

  const handleChoice = (targetChapter: number) => {
    if (targetChapter === 0) {
      setIsOpen(false);
    } else {
      setCurrentChapterIndex(targetChapter - 1);
    }
  };

  const togglePlayMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const currentLine = lines[currentLineIndex] || "";
  const prevLine = currentLineIndex > 0 ? lines[currentLineIndex - 1] : "";
  const nextLine = currentLineIndex < lines.length - 1 ? lines[currentLineIndex + 1] : "";

  return (
    <div
      className="cc-freyja-overlay"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/audio/see-you-again.webm"
        preload="auto"
        loop
      />

      <div
        className="cc-freyja-terminal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chrome Header */}
        <div className="cc-freyja-header">
          <div className="cc-freyja-header-left">
            <div className="cc-freyja-window-dots">
              <span className="cc-freyja-dot red" onClick={() => setIsOpen(false)} title="Закрыть [Esc]" />
              <span className="cc-freyja-dot yellow" onClick={() => setCurrentChapterIndex(0)} title="В начало" />
              <span className="cc-freyja-dot green" />
            </div>

            <div className="cc-freyja-title">
              СЕВЕРНЫЕ ВРАТА // THE NORTHERN GATES
            </div>
          </div>

          {/* Music Equalizer & Player */}
          <div className="cc-freyja-audio-bar">
            <button
              className="cc-freyja-play-btn"
              onClick={togglePlayMusic}
              title={isPlaying ? "Пауза" : "Воспроизвести"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
            <div className="cc-freyja-track-info">
              <span>Mustafa Avşaroğlu — I Know I Will See You Again</span>
              <div className="cc-freyja-equalizer">
                <span className={`cc-freyja-eq-bar ${isPlaying ? "playing" : ""}`} />
                <span className={`cc-freyja-eq-bar ${isPlaying ? "playing" : ""}`} />
                <span className={`cc-freyja-eq-bar ${isPlaying ? "playing" : ""}`} />
              </div>
            </div>
          </div>

          <div className="cc-freyja-header-actions">
            <span className="cc-freyja-chapter-badge">
              ГЛАВА {currentChapter.id} / {CHAPTERS.length}
            </span>
            <button
              className="cc-freyja-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ESC
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="cc-freyja-progressbar">
          <div
            className="cc-freyja-progressbar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Body */}
        <div className="cc-freyja-body">
          {/* Cinematic Art Card (Fixed Height, never crushed) */}
          <div className="cc-freyja-art-card">
            <img
              src={currentChapter.art}
              alt={currentChapter.heading}
              className="cc-freyja-art-img"
            />
            <div className="cc-freyja-art-overlay" />
            <div className="cc-freyja-art-hud">
              <span className="cc-freyja-hud-tag">{currentChapter.hudLeft}</span>
              <span className="cc-freyja-hud-tag">{currentChapter.hudRight}</span>
            </div>
          </div>

          {/* Scene Header */}
          <div className="cc-freyja-scene-header">
            <div className="cc-freyja-subtitle">
              {currentChapter.tag} • {currentChapter.location}
            </div>
            <h2 className="cc-freyja-heading">{currentChapter.heading}</h2>
          </div>

          {/* Narrative Story */}
          <div className="cc-freyja-narrative">
            {currentChapter.narrative}
          </div>

          {/* Mode Switcher */}
          <div className="cc-freyja-mode-bar">
            <div className="cc-freyja-poem-title">
              {currentChapter.poemTitle}
            </div>
            <div className="cc-freyja-mode-toggle">
              <button
                className={`cc-freyja-mode-btn ${viewMode === "lyrics" ? "active" : ""}`}
                onClick={() => setViewMode("lyrics")}
              >
                🎵 Субтитры
              </button>
              <button
                className={`cc-freyja-mode-btn ${viewMode === "full" ? "active" : ""}`}
                onClick={() => setViewMode("full")}
              >
                📜 Текст целиком
              </button>
            </div>
          </div>

          {/* Subtitles / Lyric View Mode */}
          {viewMode === "lyrics" ? (
            <div className="cc-freyja-lyrics-stage">
              <div className="cc-freyja-lyrics-glow" />
              {prevLine && (
                <div className="cc-freyja-lyric-prev">
                  {prevLine}
                </div>
              )}
              <div className="cc-freyja-lyric-current">
                {currentLine || "• • •"}
              </div>
              {nextLine && (
                <div className="cc-freyja-lyric-next">
                  {nextLine}
                </div>
              )}

              <div className="cc-freyja-lyrics-controls">
                <button
                  className="cc-freyja-lyric-nav-btn"
                  disabled={currentLineIndex === 0}
                  onClick={() => setCurrentLineIndex((prev) => Math.max(prev - 1, 0))}
                >
                  ▲ Назад
                </button>
                <span className="cc-freyja-lyric-counter">
                  {currentLineIndex + 1} / {lines.length}
                </span>
                <button
                  className="cc-freyja-lyric-nav-btn"
                  disabled={currentLineIndex >= lines.length - 1}
                  onClick={() => setCurrentLineIndex((prev) => Math.min(prev + 1, lines.length - 1))}
                >
                  ▼ Далее [Пробел]
                </button>
              </div>
            </div>
          ) : (
            /* Traditional Full Text Card */
            <div className="cc-freyja-poem-card">
              <div className="cc-freyja-poem-text">
                {lines.join("\n")}
              </div>
            </div>
          )}

          {/* Linear Action / Choices */}
          <div className="cc-freyja-actions">
            {currentChapter.choices.map((choice, idx) => (
              <button
                key={idx}
                className="cc-freyja-choice-btn"
                onClick={() => handleChoice(choice.nextChapter)}
              >
                <span>{choice.text}</span>
                <span className="cc-freyja-key-badge">
                  {choice.nextChapter === 0 ? "ESC" : `➔`}
                </span>
              </button>
            ))}
          </div>

          {/* Timeline & Step Navigation */}
          <div className="cc-freyja-timeline">
            <button
              className="cc-freyja-nav-btn"
              disabled={currentChapterIndex === 0}
              onClick={() => setCurrentChapterIndex((prev) => Math.max(prev - 1, 0))}
            >
              ← Назад
            </button>

            <div className="cc-freyja-dots-nav">
              {CHAPTERS.map((ch, idx) => (
                <div
                  key={ch.id}
                  className={`cc-freyja-step-dot ${idx === currentChapterIndex ? "active" : ""}`}
                  onClick={() => setCurrentChapterIndex(idx)}
                  title={`Глава ${ch.id}: ${ch.heading}`}
                />
              ))}
            </div>

            <button
              className="cc-freyja-nav-btn"
              disabled={currentChapterIndex === CHAPTERS.length - 1}
              onClick={() => setCurrentChapterIndex((prev) => Math.min(prev + 1, CHAPTERS.length - 1))}
            >
              Вперёд →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
