import React, { useState, useEffect } from "react";
import "./FreyjaEasterEgg.css";

// Scene 1: Celestial Mountain & Technical Grid (Replicating Image 1 & 2 aesthetic)
const ASCII_CELESTIAL_PEAKS = `
                                                  :                             
                                                  |                             
                                .                -+-               *            
                           *                     .|.               |            
  .        *        .                            :;:               |   *        
  |        |        |           *                 |                |   |        
 -+-       |       -+-          |                /|\\              -+- -+-       
  |        |        |          -+-              / | \\              |   |        
  :··:·····|········|···········|··············/··|··\\·············|···|········
     :     |        :           :       .-=-: /   |   \\ :-=.       :   :        
  ...|.....|........|...................+=++-==++-·..·.··...·......|...|....... 
     :     :        :                  +++*+==::-=*#*+:.·.··.·     :   :        
:::::::::::::::::···:::::::::····:--***+==+*:-++=##+-==-····::::::::::::::::::·:
:::::::::::::::::::::::::::::··:=#=--=#+:+#*##*+:=++++=+*+-::::::::::::::-::::::
·::::··:·:-=*+=-::::=-::·:::-++*=-==++*+**%%#*+=+=-:=+*******#=-:::·:::::::::::-
:-::---*###%*--+***+**+*-=+++=-=***+*%%####-:::::··:..·-++++***#**=------=======
=++**###%%#++==+--+*#*++====-+==-+**#*=-:.·..·:===+-==-=*+--=****===+==--:-===--
=+=---:::::-=---+--+=+=-=*+=--=+=::.·:::··--=+==-·:--==-==--· ·-=+*+==+=:=:·····
::. .·:-·:-===::::·.  .·:-=-·::::::·..··:·::-+-:.·.·..·-==-:·..·.....    .  .·:-
 .....·· ....·::::··.·::::::··.·:--::··.····:::-:·   . . ·:---:·... .......  . .
+--[ CAUCASUS SECTOR // TELEMETRY GRID ]---------------------------------------+
| LAT 41°42'38"N | LON 44°47'54"E | ALT: 2,740m | 02:40 AM | BEARING: 318° NW |
| ATMOSPHERE: 7°C | BAROMETER: 1018 hPa | WIND: ESE 1.8 m/s | VIS: UNLIMITED   |
+------------------------------------------------------------------------------+
`;

// Scene 2: 1-Bit Dithered Caucasian Ridge & River Pines (Replicating Image 3 aesthetic)
const ASCII_DITHERED_VALLEY = `
@@@@@@@%@***==-:#+·::=+**##*:-+++**+*#+=:+@@@#####%%%%%#%%%%%%######*###******#@
@@%++*=**#%++=:===::=-----+***+*++***:·=#%@@@#+***####**#**##*+**#************#@
@%+:::·-·-:--:·----·--:==*++*++*##+=::*##@@@@@#*******************************#@
@=::-·...           ...·-=++*#*#+-·+:*##%@@@@@@%******************************#@
@: .                     .-:==+--:##*#%@@@@@@@@@@%%#%#***#*#@#****************#@
@%:                       ·--::·#%%%#%@@@@@@@%%@@@@@%@%==%%%@@%%#*************#@
@@@+      .  ..--·.·:=   -*+*##*###@@@@@@@@%##@@@@@#%%##%@@@@@@@@%%###**#*****#@
@@@@#·  ·==::::**+:+##+-·=**++*#@@@@@@@@@%#+#@@%%@@@#+#@@@@@@%%@@@@@%%%%@%****%@
@@@@@@#*#%+++**#***+=::=#*===+%@@@@@@@%#*#%%@@@@@@@%%#%@@@@@#%@@@@@#%@@@@@@%#@@@
@@@@@@@@@@@@%**+====+==+*+*%%@@@@@@%%%%%@%%@@@@@@%#%%@@@@@%#@@@@@%%@@@@@@@@@@@@@
@@@@@@@@@@@@@@*=:+##*#%##@@@@@%%##*%%%%%%%@@@@@%%%%@@@@@@%@@%%%@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@%*+**#######%#**#%%%%%%@@@@@@%%%%@@@@@@@@@@%%@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@%#+==+%#**==#**#####%%%%%%##@@%@@@@@@@@@@@@@@@@@@@@@@@%@@@@@@
@@@@@@@@@@@@@@@@@@@@@%*==:::+=·--:*=+****####*%@%%#%%@@@@@@@@@@@@@@@@@@@@%@@@@@@
@@@@@@@@@@@@%#%%@@@@@@@%= ..-+=-···.:+**+++=+*#@%**#**###%%%%%%@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@%@@@@@@@@@@@@#+·.  .. .-  .···-·-+*##*+=-:-:++***#**=****#*=*##%@@@@
@@@@@@@@@@@@@@@@@%@@@@%%%@@@*-===+*%+:.     ·==*++-  *- ..··.·..--··=%:+%#@@@@@@
@@@@@@@@@@@@@@@@%@@%##%%@@@@@@@@@@%%@@@%**==:-:#+=:·-%%*+- .·-:+%#+*%@@@@@@@@@@@
@@@@@@@@%===*%==+*#%%@%@%+++============+++=:=+%+:·+%*##*=-:+==++**#@%@@%@@@@@@@
@@@@@@@@@#*=*@+-·*=:*=#=·.  ...... ..·...-·-+##@+=··+++·-+#+%#*+##%%@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@%@%@%*+==:++:::*+*#*::+=++=+@*+**%%##@@@@@@@%@@%@@@@@@@@@@@@@
@@@@@@@@@@@%@%%@@@%@@@@@@@@@%%%#####%%%%###%%%@@@%@%@@@@@@%%%@@@@@@@@@@@@@@@@@@@
+--[ MTKVARI REFLECTION // CAUCASIAN RANGE ]-----------------------------------+
| 02:45 AM • PINE FORESTS & MOONLIT CRESTS REFLECTING ACROSS THE RIVER CURRENT |
+------------------------------------------------------------------------------+
`;

// Scene 3: Hotel Monday by DNT Group & Ushangi Chkheidze Embankment (Replicating Image 4)
const ASCII_HOTEL_MONDAY = `
       .   *            .         *           .         *             .
  *             .           *           .           *            .          *
            .         ___I___       .         *          ___I___        .
        *            /       \\           .              /       \\
  .                 | (o) (o) |     [HOTEL MONDAY]     | (o) (o) |          .
      *    _________|_________|_____[ DNT  GROUP ]_____|_________|_________
          |  |===|  |===|  |===|  |===|  |===|  |===|  |===|  |===|  |  |
          |  |   |  |   |  |   |  |   |  |   |  |   |  |   |  |   |  |  |
          |__|===|__|===|__|===|__|===|__|===|__|===|__|===|__|===|__|__|
          [======= 22 USHANGI CHKHEIDZE STREET • CHUGURETI =======]
               \\   /               |  |  |  |               \\   /
  ~ ~ ~ ~ ~ ~ ~ \\_/~ ~ ~ ~ ~ ~ ~ ~ ~|__|__|__|~ ~ ~ ~ ~ ~ ~ ~\\_/~ ~ ~ ~ ~ ~ ~ ~ ~
     |====|              |                               |              |====|
  ===|    |==============|==== GALAKTION TABIDZE BRIDGE =|==============|    |===
     |    |              |                               |              |    |
  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ MTKVARI RIVER ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
+--[ LOCATION DOSSIER // TBILISI ]----------------------------------------------+
| HOTEL MONDAY BY DNT GROUP • 22 USHANGI CHKHEIDZE ST, CHUGURETI, TBILISI      |
| COORD: 41°42'38"N  44°47'54"E | RIVER ELEVATION: 412M | DISTANCE TO VERE: 120M |
+-------------------------------------------------------------------------------+
`;

// Scene 4: Hot Tea & Unspoken Feelings
const ASCII_BALCONY_TEA = `
                     . · *       ☕       * · .
                        (  )   (  )   (  )
                      .-'  \`'-'  \`'-'  \`'-.
                     |   TBILISI  CHERRY  |
                     |     H O N E Y      |
                   .-'--------------------'-.
                  |  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~   |
                  |   TWO GLASSES OF TEA     |
                  |   USHANGI CHKHEIDZE 22   |
                .-'--------------------------'-.
               |________________________________|
+--[ 03:15 AM // THE MIDNIGHT BALCONY ]----------------------------------------+
| "Some feelings don't ask for a confession. They live quietly in the cold air, |
| in the way you remember every laughter, every walk by the Kura river,        |
| and the humble privilege of standing beside her in this storm."              |
+------------------------------------------------------------------------------+
`;

type SceneId = "hotel" | "celestial" | "dithered" | "tea";

export const FreyjaEasterEgg: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scene, setScene] = useState<SceneId>("hotel");

  useEffect(() => {
    let keyBuffer = "";
    const targetCode = "freyja";

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes terminal
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        return;
      }

      // Hotkeys 1, 2, 3, 4 to switch scenes inside terminal
      if (isOpen) {
        if (e.key === "1") { setScene("hotel"); return; }
        if (e.key === "2") { setScene("celestial"); return; }
        if (e.key === "3") { setScene("dithered"); return; }
        if (e.key === "4") { setScene("tea"); return; }
      }

      // Avoid capturing when typing inside standard form inputs
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-targetCode.length);
      if (keyBuffer === targetCode) {
        setIsOpen(true);
        setScene("hotel");
        keyBuffer = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="cc-freyja-overlay"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="cc-freyja-terminal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Chrome Header */}
        <div className="cc-freyja-header">
          <div className="cc-freyja-window-dots">
            <span className="cc-freyja-dot red" onClick={() => setIsOpen(false)} title="Close [Esc]" />
            <span className="cc-freyja-dot yellow" onClick={() => setScene("hotel")} title="Reset [1]" />
            <span className="cc-freyja-dot green" title="Active Link" />
          </div>
          <span className="cc-freyja-title">
            TBILISI MEMORIES // USHANGI CHKHEIDZE 22 • HOTEL MONDAY
          </span>
          <button
            className="cc-freyja-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            ESC
          </button>
        </div>

        {/* Terminal Screen Body */}
        <div className="cc-freyja-body">
          {/* Navigation Bar */}
          <div className="cc-freyja-nav-tabs">
            <button
              className={`cc-freyja-tab-btn ${scene === "hotel" ? "active" : ""}`}
              onClick={() => setScene("hotel")}
            >
              [1] 🏨 Hotel Monday (Chkheidze 22)
            </button>
            <button
              className={`cc-freyja-tab-btn ${scene === "celestial" ? "active" : ""}`}
              onClick={() => setScene("celestial")}
            >
              [2] 🏔️ Caucasus Coordinate Grid
            </button>
            <button
              className={`cc-freyja-tab-btn ${scene === "dithered" ? "active" : ""}`}
              onClick={() => setScene("dithered")}
            >
              [3] 🌲 Mtkvari Valley (1-Bit)
            </button>
            <button
              className={`cc-freyja-tab-btn ${scene === "tea" ? "active" : ""}`}
              onClick={() => setScene("tea")}
            >
              [4] ☕ Midnight Balcony & Words
            </button>
          </div>

          {/* Telemetry Bar */}
          <div className="cc-freyja-telemetry-bar">
            <span>📍 <strong>41°42'38"N 44°47'54"E</strong></span>
            <span>🏨 <strong>Hotel Monday by DNT Group</strong></span>
            <span>🌊 <strong>Mtkvari Riverfront (Chugureti)</strong></span>
            <span>🕒 <strong>02:40 AM</strong></span>
          </div>

          {/* Scene 1: Hotel Monday & Bridge */}
          {scene === "hotel" && (
            <>
              <pre className="cc-freyja-ascii">{ASCII_HOTEL_MONDAY}</pre>
              <div className="cc-freyja-prompt">&gt; LOCATION: 22 Ushangi Chkheidze St, Chugureti District, Tbilisi.</div>
              <p className="cc-freyja-story-text">
                Ночь над Тбилиси. Отель Monday затих, лишь мягкий свет резных деревянных балконов отражается в тёмных водах Куры (Мтквари).
                Справа высится арочный силуэт Моста Галактиона Табидзе, соединяющий сонный Чугурети с огнями парка Вере.
                Горный ветерок приносит с Кавказа прохладу и аромат цветущего миндаля.
              </p>
              <div className="cc-freyja-poem">
                «Вода шумит под мостом Табидзе,<br />
                В окне на Чхеидзе горит огонек.<br />
                Мы здесь — две параллельные птицы,<br />
                Что делят один ночной ветерок.»
              </div>
              <div className="cc-freyja-choices">
                <button className="cc-freyja-choice-btn" onClick={() => setScene("celestial")}>
                  <span className="cc-freyja-key">[2]</span> Поднять взгляд к вершинам Кавказа над Мтацминдой
                </button>
                <button className="cc-freyja-choice-btn" onClick={() => setScene("dithered")}>
                  <span className="cc-freyja-key">[3]</span> Спуститься к тихой кромке реки под тень сосен
                </button>
                <button className="cc-freyja-choice-btn" onClick={() => setScene("tea")}>
                  <span className="cc-freyja-key">[4]</span> Вернуться на балкон к горячему вишнёвому чаю
                </button>
              </div>
            </>
          )}

          {/* Scene 2: Caucasus Coordinate Grid */}
          {scene === "celestial" && (
            <>
              <pre className="cc-freyja-ascii">{ASCII_CELESTIAL_PEAKS}</pre>
              <div className="cc-freyja-prompt">&gt; SECTOR SCAN: 318° NW // CAUCASUS ELEVATION 2,740M.</div>
              <p className="cc-freyja-story-text">
                Небосклон над ущельем Куры пронзительно чист. Звёзды выстроились в мерцающую координатную сетку.
                Острые гранитные пики Большого Кавказа укрыты белым вечным снегом, а у подножия дремлет Тбилиси.
                В этой космической тишине кажется, что весь шум земных тревог растворился без следа.
              </p>
              <div className="cc-freyja-poem">
                «Пусть между нами тысячи правил,<br />
                И жизнь начертила границу из льда —<br />
                Но свет, что ты в этом сердце оставил,<br />
                Не скроет туман ни за что, никогда.»
              </div>
              <div className="cc-freyja-choices">
                <button className="cc-freyja-choice-btn" onClick={() => setScene("dithered")}>
                  <span className="cc-freyja-key">[3]</span> Взглянуть на отражение скал в тёмной реке
                </button>
                <button className="cc-freyja-choice-btn" onClick={() => setScene("hotel")}>
                  <span className="cc-freyja-key">[1]</span> Вернуться к огням отеля Monday
                </button>
                <button className="cc-freyja-choice-btn" onClick={() => setScene("tea")}>
                  <span className="cc-freyja-key">[4]</span> Прочитать невысказанное письмо на балконе
                </button>
              </div>
            </>
          )}

          {/* Scene 3: Dithered Valley & Pines */}
          {scene === "dithered" && (
            <>
              <pre className="cc-freyja-ascii">{ASCII_DITHERED_VALLEY}</pre>
              <div className="cc-freyja-prompt">&gt; MTKVARI GORGE: 02:45 AM // RIVER ELEVATION 412M.</div>
              <p className="cc-freyja-story-text">
                Берег Мтквари, где каменные склоны встречаются с быстрой прохладной водой.
                Силуэты кавказских сосен замерли в ожидании рассвета. В воде дрожит серебряная дорожка от далёких фонарей.
                Здесь легко дышится, и даже безответное чувство не кажется болью — оно превращается в чистую, светлую благодарность.
              </p>
              <div className="cc-freyja-poem">
                «Течёт Кура сквозь вековые камни,<br />
                Смывая горечь неслучившихся признаний.<br />
                Быть верным другом — дар немалый,<br />
                И в этой дружбе — крепость без изъянов.»
              </div>
              <div className="cc-freyja-choices">
                <button className="cc-freyja-choice-btn" onClick={() => setScene("tea")}>
                  <span className="cc-freyja-key">[4]</span> Подняться на балкон отеля Monday
                </button>
                <button className="cc-freyja-choice-btn" onClick={() => setScene("celestial")}>
                  <span className="cc-freyja-key">[2]</span> Взглянуть на звёздную телеметрию Кавказа
                </button>
                <button className="cc-freyja-choice-btn" onClick={() => setScene("hotel")}>
                  <span className="cc-freyja-key">[1]</span> К набережной Ушанги Чхеидзе
                </button>
              </div>
            </>
          )}

          {/* Scene 4: Tea & Words */}
          {scene === "tea" && (
            <>
              <pre className="cc-freyja-ascii">{ASCII_BALCONY_TEA}</pre>
              <div className="cc-freyja-prompt">&gt; PRIVATE LOG ENTRY // RE: FREYJA // 03:15 AM.</div>
              <p className="cc-freyja-story-text">
                Два стеклянных стакана в мельхиоровых подстаканниках. Пар поднимается над черным горным чаем,
                а на блюдце блестит янтарно-вишнёвое варенье — вкус той самой кондитерской, ради которой мы создаём Cherry Cake.
              </p>
              <p className="cc-freyja-story-text">
                Иногда настоящая любовь — это не разрушать чей-то чужой мир и не требовать взаимности.
                Это умение быть надёжной опорой в команде, прикрывать спину на каждом спринте, бережно проверять код,
                шутить на созвонах и радоваться её улыбке, даже зная, что её сердце принадлежит другому.
              </p>
              <div className="cc-freyja-poem">
                «Я не нарушу твой покой и счастье,<br />
                Но знай: пока кружится этот свет,<br />
                В любой беде, сквозь бури и ненастья,<br />
                Ты можешь опереться на мой след.»
              </div>
              <div className="cc-freyja-choices">
                <button className="cc-freyja-choice-btn" onClick={() => setScene("hotel")}>
                  <span className="cc-freyja-key">[1]</span> Вернуться к панораме отеля на Чхеидзе 22
                </button>
                <button className="cc-freyja-choice-btn" onClick={() => setScene("celestial")}>
                  <span className="cc-freyja-key">[2]</span> Посмотреть на горы под звёздным небом
                </button>
                <button className="cc-freyja-choice-btn" onClick={() => setIsOpen(false)}>
                  <span className="cc-freyja-key">[ESC]</span> Закрыть терминал и вернуться к проекту
                </button>
              </div>
            </>
          )}

          <div className="cc-freyja-footer-note">
            ★ Нажимайте клавиши [1], [2], [3], [4] для переключения сцен • [ESC] для выхода ★
          </div>
        </div>
      </div>
    </div>
  );
};
