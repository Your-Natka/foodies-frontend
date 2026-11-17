import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { findStepMinutes, splitInstructions } from "../../../utils/instructions";

import css from "./CookingMode.module.scss";

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const playBeep = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    [0, 0.4, 0.8].forEach((offset) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.value = 880;
      gain.gain.value = 0.2;
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(ctx.currentTime + offset);
      oscillator.stop(ctx.currentTime + offset + 0.25);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // Audio is optional.
  }
};

// Keeps the screen awake while cooking mode is open (where supported).
function useWakeLock(enabled) {
  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) return;

    let sentinel = null;
    let cancelled = false;

    const request = async () => {
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (cancelled) {
          lock.release();
        } else {
          sentinel = lock;
        }
      } catch {
        // Permission denied or not visible — ignore.
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") request();
    };

    request();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      sentinel?.release().catch(() => {});
    };
  }, [enabled]);
}

function useCountdown() {
  const [endAt, setEndAt] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endAt) return undefined;

    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);

      if (current >= endAt) {
        setEndAt(null);
        playBeep();
        toast.info("⏰ Timer finished!");
      }
    }, 250);

    return () => clearInterval(id);
  }, [endAt]);

  const secondsLeft = endAt
    ? Math.max(0, Math.ceil((endAt - now) / 1000))
    : null;

  const start = (minutes) => {
    const current = Date.now();
    setNow(current);
    setEndAt(current + minutes * 60 * 1000);
  };

  const stop = () => setEndAt(null);

  return { secondsLeft, start, stop };
}

function CookingMode({ recipe, onClose }) {
  const steps = splitInstructions(recipe.instructions);
  const ingredients = recipe.ingredients ?? [];

  // Step 0 is the ingredient checklist, then the preparation steps.
  const total = steps.length + 1;
  const [index, setIndex] = useState(0);
  const [checked, setChecked] = useState(() => new Set());
  const timer = useCountdown();

  useWakeLock(true);

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(
    () => setIndex((i) => Math.min(total - 1, i + 1)),
    [total],
  );

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  const toggleIngredient = (id) => {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isChecklist = index === 0;
  const step = isChecklist ? null : steps[index - 1];
  const stepMinutes = step ? findStepMinutes(step) : null;
  const isLast = index === total - 1;

  return (
    <div className={css.overlay} role="dialog" aria-modal="true" aria-label="Cooking mode">
      <div className={css.inner}>
        <header className={css.header}>
          <div>
            <p className={css.eyebrow}>Cooking mode</p>
            <h2 className={css.title}>{recipe.title}</h2>
          </div>
          <button
            type="button"
            className={css.close}
            onClick={onClose}
            aria-label="Exit cooking mode"
          >
            ×
          </button>
        </header>

        <div className={css.progress} aria-hidden="true">
          <span
            className={css.progressBar}
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <p className={css.counter}>
          {isChecklist ? "Get ready" : `Step ${index} / ${steps.length}`}
        </p>

        <div className={css.body} aria-live="polite">
          {isChecklist ? (
            <>
              <h3 className={css.subtitle}>
                Gather the ingredients ({checked.size}/{ingredients.length})
              </h3>
              <ul className={css.checklist}>
                {ingredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    <label
                      className={`${css.checkItem} ${
                        checked.has(ingredient.id) ? css.done : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked.has(ingredient.id)}
                        onChange={() => toggleIngredient(ingredient.id)}
                      />
                      <span>
                        {ingredient.name}
                        {ingredient.measure && (
                          <span className={css.measure}> — {ingredient.measure}</span>
                        )}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={css.step}>{step}</p>
          )}
        </div>

        {(timer.secondsLeft !== null || stepMinutes) && (
          <div className={css.timer}>
            {timer.secondsLeft !== null ? (
              <>
                <span className={css.timerValue}>{formatTime(timer.secondsLeft)}</span>
                <button type="button" className={css.timerButton} onClick={timer.stop}>
                  Stop timer
                </button>
              </>
            ) : (
              <button
                type="button"
                className={css.timerButton}
                onClick={() => timer.start(stepMinutes)}
              >
                ⏱ Start {stepMinutes} min timer
              </button>
            )}
          </div>
        )}

        <footer className={css.nav}>
          <button
            type="button"
            className={css.navButton}
            onClick={goPrev}
            disabled={index === 0}
          >
            ← Back
          </button>
          {isLast ? (
            <button type="button" className={css.navButtonPrimary} onClick={onClose}>
              Done 🎉
            </button>
          ) : (
            <button type="button" className={css.navButtonPrimary} onClick={goNext}>
              {isChecklist ? "Start cooking →" : "Next →"}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

export default CookingMode;
