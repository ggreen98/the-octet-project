"use client";

import { useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type Strategy = "lose" | "gain" | "share" | "none";

type Question = {
  symbol: string;
  name: string;
  z: number;
  valenceCount: number;
  correct: Strategy;
  explanation: string;
};

const ALL_QUESTIONS: Question[] = [
  { symbol: "Li", name: "Lithium",    z: 3,  valenceCount: 1, correct: "lose",  explanation: "Lithium has 1 valence electron. It loses it to expose the full K shell beneath, forming Li⁺." },
  { symbol: "Na", name: "Sodium",     z: 11, valenceCount: 1, correct: "lose",  explanation: "Sodium has 1 valence electron. Losing it gives a full L shell — sodium becomes Na⁺." },
  { symbol: "Mg", name: "Magnesium",  z: 12, valenceCount: 2, correct: "lose",  explanation: "Magnesium has 2 valence electrons. Both are lost to reach a full L shell, forming Mg²⁺." },
  { symbol: "Ca", name: "Calcium",    z: 20, valenceCount: 2, correct: "lose",  explanation: "Calcium has 2 valence electrons in its outermost shell. Losing both exposes the full M shell of 8 beneath — Ca²⁺." },
  { symbol: "Al", name: "Aluminum",   z: 13, valenceCount: 3, correct: "lose",  explanation: "Aluminum has 3 valence electrons and commonly loses all three to form Al³⁺." },
  { symbol: "C",  name: "Carbon",     z: 6,  valenceCount: 4, correct: "share", explanation: "Carbon has 4 valence electrons — exactly halfway to 8. Too costly to lose or gain 4, so carbon shares electrons, forming up to four covalent bonds." },
  { symbol: "Si", name: "Silicon",    z: 14, valenceCount: 4, correct: "share", explanation: "Like carbon, silicon has 4 valence electrons and prefers to share them, forming covalent bonds." },
  { symbol: "N",  name: "Nitrogen",   z: 7,  valenceCount: 5, correct: "gain",  explanation: "Nitrogen has 5 valence electrons and needs 3 more to complete its octet. It gains or shares electrons to get there." },
  { symbol: "P",  name: "Phosphorus", z: 15, valenceCount: 5, correct: "gain",  explanation: "Phosphorus has 5 valence electrons. Like nitrogen, it needs 3 more and tends to gain or share them." },
  { symbol: "O",  name: "Oxygen",     z: 8,  valenceCount: 6, correct: "gain",  explanation: "Oxygen has 6 valence electrons and only needs 2 more. It readily gains electrons, often forming O²⁻." },
  { symbol: "S",  name: "Sulfur",     z: 16, valenceCount: 6, correct: "gain",  explanation: "Sulfur has 6 valence electrons and needs 2 more — it gains electrons to form S²⁻." },
  { symbol: "F",  name: "Fluorine",   z: 9,  valenceCount: 7, correct: "gain",  explanation: "Fluorine has 7 valence electrons — the most electronegative element. It needs just 1 more and aggressively gains it to form F⁻." },
  { symbol: "Cl", name: "Chlorine",   z: 17, valenceCount: 7, correct: "gain",  explanation: "Chlorine has 7 valence electrons and needs just 1 more. It gains an electron to become Cl⁻ — the chloride in table salt." },
  { symbol: "Ne", name: "Neon",       z: 10, valenceCount: 8, correct: "none",  explanation: "Neon already has 8 valence electrons — a full outer shell. It doesn't need to do anything and almost never reacts." },
  { symbol: "Ar", name: "Argon",      z: 18, valenceCount: 8, correct: "none",  explanation: "Argon has a complete outer shell of 8 electrons. It's one of the least reactive elements in existence." },
];

const STRATEGIES: { key: Strategy; label: string; color: string; rgb: string }[] = [
  { key: "lose",  label: "LOSE",  color: "#ef4444", rgb: "239,68,68" },
  { key: "gain",  label: "GAIN",  color: "#a855f7", rgb: "168,85,247" },
  { key: "share", label: "SHARE", color: "#6366f1", rgb: "99,102,241" },
  { key: "none",  label: "NONE",  color: "#72b872", rgb: "114,184,114" },
];

const GAME_LENGTH = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scoreMessage(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1)  return "PERFECT. You've got this locked in.";
  if (pct >= 0.8) return "GREAT WORK. Almost flawless.";
  if (pct >= 0.6) return "GOOD START. Review the ones you missed.";
  return "KEEP GOING. Re-read the lesson and try again.";
}

export function ValenceStrategyGame() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [questions, setQuestions] = useState<Question[]>(() =>
    shuffle(ALL_QUESTIONS).slice(0, GAME_LENGTH)
  );
  const [qIndex,   setQIndex]   = useState(0);
  const [selected, setSelected] = useState<Strategy | null>(null);
  const [score,    setScore]    = useState(0);
  const [phase,    setPhase]    = useState<"playing" | "answered" | "complete">("playing");

  const current    = questions[qIndex];
  const isCorrect  = selected !== null && selected === current?.correct;
  const correct    = STRATEGIES.find(s => s.key === current?.correct)!;

  const handleAnswer = (s: Strategy) => {
    if (phase !== "playing") return;
    setSelected(s);
    if (s === current.correct) setScore(p => p + 1);
    setPhase("answered");
  };

  const handleNext = () => {
    if (qIndex + 1 >= GAME_LENGTH) {
      setPhase("complete");
    } else {
      setQIndex(i => i + 1);
      setSelected(null);
      setPhase("playing");
    }
  };

  const handleRestart = useCallback(() => {
    setQuestions(shuffle(ALL_QUESTIONS).slice(0, GAME_LENGTH));
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setPhase("playing");
  }, []);

  const panelBg = isLight ? "rgba(240,237,230,0.35)" : "rgba(1,13,10,0.45)";

  // ── COMPLETE SCREEN ──────────────────────────────────
  if (phase === "complete") {
    const pct = score / GAME_LENGTH;
    const ac  = pct === 1 ? "#f5a623" : pct >= 0.8 ? "#72b872" : pct >= 0.6 ? "#6366f1" : "#ef4444";
    const rgb = pct === 1 ? "245,166,35" : pct >= 0.8 ? "114,184,114" : pct >= 0.6 ? "99,102,241" : "239,68,68";

    return (
      <div className="mb-12">
        <p className="font-heading text-xs tracking-widest mb-4"
          style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
          {`// PRACTICE — VALENCE STRATEGY`}
        </p>
        <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>
          <div className="flex flex-col items-center justify-center p-12 text-center"
            style={{ background: panelBg, minHeight: "320px" }}>
            <p className="font-heading text-xs mb-6"
              style={{ color: "var(--oc-text-dim)", letterSpacing: "0.18em", fontSize: "0.58rem" }}>
              RESULT
            </p>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-heading" style={{ fontSize: "4.5rem", color: ac, lineHeight: 1 }}>
                {score}
              </span>
              <span className="font-heading" style={{ fontSize: "1.5rem", color: "var(--oc-text-dim)" }}>
                / {GAME_LENGTH}
              </span>
            </div>

            {/* Score bar */}
            <div className="mb-5" style={{ width: "200px", height: "4px", background: "rgba(114,184,114,0.15)", borderRadius: "2px" }}>
              <div style={{
                height: "100%",
                width: `${(score / GAME_LENGTH) * 100}%`,
                background: ac,
                borderRadius: "2px",
                transition: "width 0.6s ease",
              }} />
            </div>

            <p className="font-heading text-xs mb-10" style={{ color: ac, letterSpacing: "0.1em" }}>
              {scoreMessage(score, GAME_LENGTH)}
            </p>

            <button
              onClick={handleRestart}
              className="font-heading text-xs px-8 py-3 transition-all duration-200"
              style={{
                border: `1px solid rgba(${rgb},0.4)`,
                background: `rgba(${rgb},0.08)`,
                color: ac,
                borderRadius: "3px",
                letterSpacing: "0.15em",
                cursor: "pointer",
              }}
            >
              PLAY AGAIN →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTION SCREEN ──────────────────────────────────
  const progress = ((qIndex + (phase === "answered" ? 1 : 0)) / GAME_LENGTH) * 100;

  return (
    <div className="mb-12">
      <p className="font-heading text-xs tracking-widest mb-4"
        style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
        {`// PRACTICE — VALENCE STRATEGY`}
      </p>

      <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "var(--oc-green-badge)" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--oc-green)",
            transition: "width 0.3s ease",
          }} />
        </div>

        <div className="p-6 md:p-10" style={{ background: panelBg }}>

          {/* Header row */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-heading text-xs"
              style={{ color: "var(--oc-text-dim)", letterSpacing: "0.12em", fontSize: "0.58rem" }}>
              QUESTION {qIndex + 1} OF {GAME_LENGTH}
            </span>
            <span className="font-heading text-xs"
              style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.58rem" }}>
              {score} CORRECT
            </span>
          </div>

          {/* Element card */}
          <div className="flex justify-center mb-8">
            <div
              className="flex flex-col items-center justify-center"
              style={{
                width: "130px",
                height: "130px",
                border: "1px solid var(--oc-green-border-dim)",
                background: isLight ? "rgba(240,237,230,0.7)" : "rgba(1,13,10,0.75)",
                borderRadius: "4px",
                gap: "2px",
              }}
            >
              <span className="font-heading" style={{ fontSize: "3.2rem", color: "var(--oc-text)", lineHeight: 1 }}>
                {current.symbol}
              </span>
              <span className="font-heading text-xs" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.08em" }}>
                Z = {current.z}
              </span>
              <span style={{ fontSize: "0.65rem", color: "var(--oc-text-dim)" }}>
                {current.name}
              </span>
              <span className="font-heading"
                style={{ fontSize: "0.5rem", color: "rgba(245,166,35,0.7)", letterSpacing: "0.08em", marginTop: "4px" }}>
                {current.valenceCount} VALENCE e⁻
              </span>
            </div>
          </div>

          {/* Prompt */}
          <p className="text-center text-sm mb-6" style={{ color: "var(--oc-text-muted)" }}>
            What does this atom tend to do with its valence electrons?
          </p>

          {/* Strategy buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-md mx-auto mb-6">
            {STRATEGIES.map(({ key, label, color, rgb }) => {
              const wasChosen = selected === key;
              const isRight   = phase === "answered" && key === current.correct;
              const isWrong   = phase === "answered" && wasChosen && !isCorrect;

              let border    = `rgba(${rgb},0.25)`;
              let bg        = "transparent";
              let textColor = "var(--oc-text-muted)";

              if (isRight) {
                border    = color;
                bg        = `rgba(${rgb},0.15)`;
                textColor = color;
              } else if (isWrong) {
                border    = "rgba(239,68,68,0.6)";
                bg        = "rgba(239,68,68,0.1)";
                textColor = "#ef4444";
              } else if (phase === "answered") {
                border    = "rgba(114,184,114,0.1)";
                textColor = "var(--oc-text-hint)";
              }

              return (
                <button
                  key={key}
                  onClick={() => handleAnswer(key)}
                  disabled={phase !== "playing"}
                  className="font-heading text-xs py-3 transition-all duration-200"
                  style={{
                    border:       `1px solid ${border}`,
                    background:   bg,
                    color:        textColor,
                    borderRadius: "3px",
                    letterSpacing:"0.12em",
                    cursor:       phase === "playing" ? "pointer" : "default",
                  }}
                >
                  {label}
                  {isRight && <span className="ml-1.5">✓</span>}
                  {isWrong && <span className="ml-1.5">✗</span>}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {phase === "answered" && (
            <div className="max-w-md mx-auto">
              <div
                className="p-4 mb-4"
                style={{
                  border:       `1px solid ${isCorrect ? "rgba(114,184,114,0.3)" : "rgba(239,68,68,0.3)"}`,
                  background:   isCorrect ? "rgba(114,184,114,0.06)" : "rgba(239,68,68,0.06)",
                  borderRadius: "3px",
                }}
              >
                <p
                  className="font-heading text-xs mb-2"
                  style={{
                    color:         isCorrect ? "var(--oc-green)" : "#ef4444",
                    letterSpacing: "0.1em",
                    fontSize:      "0.58rem",
                  }}
                >
                  {isCorrect ? "CORRECT" : `INCORRECT — ANSWER: ${correct.label}`}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                  {current.explanation}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="font-heading text-xs px-6 py-2.5 transition-all duration-200"
                  style={{
                    border:       "1px solid var(--oc-green-subtle)",
                    color:        "var(--oc-green)",
                    background:   "transparent",
                    borderRadius: "3px",
                    letterSpacing:"0.15em",
                    cursor:       "pointer",
                  }}
                >
                  {qIndex + 1 >= GAME_LENGTH ? "SEE RESULTS →" : "NEXT →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
