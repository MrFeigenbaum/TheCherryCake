import React, { useState, useEffect } from "react";
import "./FreyjaEasterEgg.css";

const ASCII_RIVER = `
        .  *       .       .   *   .    *   .   .
    *         .      /\\           *       .     *
       .   *        /  \\  /\\             .    *
                  _/    \\/  \\__     *      .
    ~ ~ ~ ~ ~ ~ ~[   NARIKALA  ]~ ~ ~ ~ ~ ~ ~ ~ ~ ~
          .  ·   |   FORTRESS  |  ·  .
    ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      _   _          |     |          _   _
     ( ) ( )       ==|=====|==       ( ) ( )
    =============[ BRIDGE OF PEACE ]=============
    ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    ~ ~ ~ ~ ~ ~ ~ ~ ~ MTKVARI ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
`;

const ASCII_BALCONY = `
          .  *  .    ___I___    .  *  .
       *            /       \\            *
          .        |  (o) (o) |       .
        ___________|__________|___________
       |  |===|  |===|  |===|  |===|  |  |
       |  |   |  |   |  |   |  |   |  |  |
       |__|===|__|===|__|===|__|===|__|__|
       [=== CARVED WOODEN BALCONY ===]
           \\   /      |  |      \\   /
            \\_/       |__|       \\_/
`;

const ASCII_TEA = `
              .·*   ☕   *·.
                 (  )  (  )
               .-'  \`'-'  \`'-.
              |  🍒  🍒  🍒   |
            .-'---------------'-.
           |  ~ ~ ~ ~ ~ ~ ~ ~ ~  |
           |   TBILISI  CHERRY   |
           |      H O N E Y      |
         .-'---------------------'-.
        |___________________________|
`;

type SceneId = "river" | "balcony" | "jasmine" | "stars" | "bakery";

export const FreyjaEasterEgg: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scene, setScene] = useState<SceneId>("river");

  useEffect(() => {
    let keyBuffer = "";
    const targetCode = "freyja";

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow closing with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        return;
      }

      // Avoid capturing when typing inside standard inputs
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }

      keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-targetCode.length);
      if (keyBuffer === targetCode) {
        setIsOpen(true);
        setScene("river");
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
            <span className="cc-freyja-dot red" onClick={() => setIsOpen(false)} />
            <span className="cc-freyja-dot yellow" onClick={() => setScene("river")} />
            <span className="cc-freyja-dot green" />
          </div>
          <span className="cc-freyja-title">
            ✦ TBILISI NIGHTS: THE ECHO OF FREYJA ✦
          </span>
          <button
            type="button"
            className="cc-freyja-close-btn"
            onClick={() => setIsOpen(false)}
          >
            ESC / CLOSE
          </button>
        </div>

        {/* Story Screen Content */}
        <div className="cc-freyja-body">
          {scene === "river" && (
            <>
              <pre className="cc-freyja-ascii">{ASCII_RIVER}</pre>
              <div className="cc-freyja-story-text">
                <p>
                  Midnight in Tbilisi. The air carries the gentle chill of late autumn,
                  intertwined with the aroma of damp river stones, distant cedar smoke, and warm vanilla from an old bakery.
                </p>
                <p>
                  Across the dark waters of the Mtkvari, the ancient stone walls of Narikala glow against the velvet sky like a quiet crown.
                  You stand by the river embankment near the hotel, watching amber reflections ripple across the current.
                </p>
                <p className="cc-freyja-poem">
                  « The water remembers the footsteps of travelers, / Yet leaves no footprint behind. »
                </p>
              </div>

              <div className="cc-freyja-choices">
                <button
                  type="button"
                  className="cc-freyja-choice-btn"
                  onClick={() => setScene("balcony")}
                >
                  <span className="cc-freyja-key">[1]</span>
                  <span>Walk toward the carved wooden balconies of the Old Town</span>
                </button>
                <button
                  type="button"
                  className="cc-freyja-choice-btn"
                  onClick={() => setScene("bakery")}
                >
                  <span className="cc-freyja-key">[2]</span>
                  <span>Step into the quiet midnight bakery glowing by the river</span>
                </button>
              </div>
            </>
          )}

          {scene === "balcony" && (
            <>
              <pre className="cc-freyja-ascii">{ASCII_BALCONY}</pre>
              <div className="cc-freyja-story-text">
                <p>
                  Cobblestone alleys lead you beneath the timeless lace-carved balconies.
                  A gentle mountain breeze sweeps down from Mtatsminda, rustling fallen vine leaves.
                </p>
                <p>
                  For a fleeting second, you catch sight of her silhouette against the soft amber light of the upper terrace.
                  She gazes toward the river with that unmistakable calm focus — the brilliant leader, guiding her team through every storm with grace.
                </p>
                <p>
                  Her heart belongs to another, yet in this quiet Tbilisi night, there is no bitterness in your soul.
                  Only an unspoken reverence: the profound gratitude of walking under the same constellation, sharing the same journey, and guarding her peace from afar.
                </p>
                <p className="cc-freyja-poem">
                  « Some stars shine so far in the night, / We cannot hold them, yet they guide our sight. »
                </p>
              </div>

              <div className="cc-freyja-choices">
                <button
                  type="button"
                  className="cc-freyja-choice-btn"
                  onClick={() => setScene("jasmine")}
                >
                  <span className="cc-freyja-key">[1]</span>
                  <span>Leave a delicate white jasmine flower on the stone balustrade</span>
                </button>
                <button
                  type="button"
                  className="cc-freyja-choice-btn"
                  onClick={() => setScene("stars")}
                >
                  <span className="cc-freyja-key">[2]</span>
                  <span>Whisper a silent blessing to the night wind and walk back</span>
                </button>
              </div>
            </>
          )}

          {scene === "jasmine" && (
            <>
              <pre className="cc-freyja-ascii">{ASCII_BALCONY}</pre>
              <div className="cc-freyja-story-text">
                <p>
                  You carefully place the fragrant night jasmine upon the weathered stone steps.
                  No words, no signature — just an anonymous token of respect for a muse whose presence makes every challenge feel lighter.
                </p>
                <p>
                  As you turn to leave, you hear the quiet chiming of church bells across the valley.
                  The silent devotion of a protector asks for nothing in return.
                </p>
              </div>

              <div className="cc-freyja-choices">
                <button
                  type="button"
                  className="cc-freyja-choice-btn"
                  onClick={() => setScene("bakery")}
                >
                  <span className="cc-freyja-key">[1]</span>
                  <span>Return to the warmth of the bakery by the water</span>
                </button>
              </div>
            </>
          )}

          {scene === "stars" && (
            <>
              <pre className="cc-freyja-ascii">{ASCII_RIVER}</pre>
              <div className="cc-freyja-story-text">
                <p>
                  You pause on the bridge as the cool breeze touches your face.
                  To love purely without possessing is the quietest strength a samurai or an engineer can carry.
                </p>
                <p>
                  Being part of her team, building something great together, watching her succeed — that honor is a precious story all its own.
                </p>
              </div>

              <div className="cc-freyja-choices">
                <button
                  type="button"
                  className="cc-freyja-choice-btn"
                  onClick={() => setScene("bakery")}
                >
                  <span className="cc-freyja-key">[1]</span>
                  <span>Find warmth in the midnight bakery</span>
                </button>
              </div>
            </>
          )}

          {scene === "bakery" && (
            <>
              <pre className="cc-freyja-ascii">{ASCII_TEA}</pre>
              <div className="cc-freyja-story-text">
                <p>
                  You step through the oak doorway into the warm bakery.
                  A steaming clay pot of mountain berry tea and a fresh slice of layered Cherry Honey Cake are placed before you.
                </p>
                <p>
                  The sweet warmth of vanilla and tart cherry fills the room.
                  Life is made of these fleeting, beautiful chapters: the rivers we cross, the code we write, and the people who inspire us to be better than we were yesterday.
                </p>
                <p className="cc-freyja-poem">
                  « May every tomorrow bring sweetness to the one who leads with heart. »
                </p>
              </div>

              <div className="cc-freyja-choices">
                <button
                  type="button"
                  className="cc-freyja-choice-btn"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="cc-freyja-key">[ESC]</span>
                  <span>Close the journal and return to the storefront</span>
                </button>
                <button
                  type="button"
                  className="cc-freyja-choice-btn"
                  onClick={() => setScene("river")}
                >
                  <span className="cc-freyja-key">[R]</span>
                  <span>Walk the Mtkvari riverbank once more</span>
                </button>
              </div>
            </>
          )}

          <div className="cc-freyja-footer-note">
            Secret unlocked with code «FREYJA» &bull; Press [ESC] anytime to return
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreyjaEasterEgg;
