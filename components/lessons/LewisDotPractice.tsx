"use client";

import { useState, useCallback } from "react";

// ── Practice elements (valence 1 → 8) ────────────────────────────────────────
interface PracticeEl {
  symbol: string;
  name: string;
  valence: number;
  group: string;
  color: string;       // element box accent color
  hint: string;        // shown after 2nd wrong attempt
  success: string;     // shown on correct
}

const ELEMENTS: PracticeEl[] = [
  {
    symbol: "Na", name: "Sodium",    valence: 1, group: "Group 1",
    color: "#e05070",
    hint: "Sodium is in Group 1. For Groups 1–2, the group number equals the valence electron count.",
    success: "Sodium has 1 valence electron — that lone dot is exactly what it donates in ionic bonding to become Na⁺.",
  },
  {
    symbol: "Mg", name: "Magnesium", valence: 2, group: "Group 2",
    color: "#e05070",
    hint: "Magnesium is in Group 2 — 2 valence electrons.",
    success: "Magnesium has 2 valence electrons. It loses both in ionic bonding to form Mg²⁺.",
  },
  {
    symbol: "C",  name: "Carbon",    valence: 4, group: "Group 14",
    color: "rgba(52,211,153,0.85)",
    hint: "Carbon is in Group 14. For Groups 13–18, subtract 10 from the group number (14 − 10 = 4).",
    success: "Carbon has 4 valence electrons — 4 unpaired dots. It needs 4 more to fill its octet, forming exactly 4 bonds (CH₄, CO₂).",
  },
  {
    symbol: "N",  name: "Nitrogen",  valence: 5, group: "Group 15",
    color: "#4499ff",
    hint: "Nitrogen is in Group 15 — 5 valence electrons.",
    success: "Nitrogen has 5 valence electrons: 1 lone pair + 3 unpaired. Those 3 unpaired electrons form 3 bonds (e.g. NH₃).",
  },
  {
    symbol: "O",  name: "Oxygen",    valence: 6, group: "Group 16",
    color: "#4499ff",
    hint: "Oxygen is in Group 16 — 6 valence electrons.",
    success: "Oxygen has 6 valence electrons: 2 lone pairs + 2 unpaired. That's why water is H₂O — oxygen forms exactly 2 bonds.",
  },
  {
    symbol: "Cl", name: "Chlorine",  valence: 7, group: "Group 17",
    color: "#4499ff",
    hint: "Chlorine is in Group 17 — 7 valence electrons, one short of a full octet.",
    success: "Chlorine has 7 valence electrons: 3 lone pairs + 1 unpaired. That one missing electron is why Cl⁻ accepted sodium's in the simulation.",
  },
  {
    symbol: "Ar", name: "Argon",     valence: 8, group: "Group 18",
    color: "#a855f7",
    hint: "Argon is a noble gas in Group 18 — it already has a full octet of 8 electrons.",
    success: "Argon has 8 valence electrons (4 lone pairs) — a completely full octet. Noble gases are chemically inert because they have nothing to gain from bonding.",
  },
];

// ── Slot layout ───────────────────────────────────────────────────────────────
// 8 slots arranged like Lewis dot positions:
//   [0] [1]         top left, top right
// [6]     [2]       left top, right top
// [7]     [3]       left bottom, right bottom
//   [5] [4]         bottom left, bottom right
type Slots = [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
const EMPTY: Slots = [false, false, false, false, false, false, false, false];

function countFilled(s: Slots) { return s.filter(Boolean).length; }

// ── Single clickable electron slot ────────────────────────────────────────────
function DotBtn({ filled, onClick, ariaLabel }: { filled: boolean; onClick: () => void; ariaLabel: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <span style={{
        display: "block",
        width: 15,
        height: 15,
        borderRadius: "50%",
        background: filled ? "#ffffdd" : "transparent",
        border: filled ? "none" : "1.5px dashed rgba(255,255,200,0.22)",
        boxShadow: filled ? "0 0 7px #ffffaa99, 0 0 14px #ffffaa44" : "none",
        transition: "background 0.13s, box-shadow 0.13s",
      }} />
    </button>
  );
}

// ── Result screen ─────────────────────────────────────────────────────────────
function ResultScreen({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
  const pct = Math.round((score / total) * 100);
  const msg =
    pct === 100 ? "Perfect! You nailed every element." :
    pct >= 71   ? "Great work — you know your valence electrons." :
    pct >= 43   ? "Good start. A second pass will lock it in." :
                  "Keep practicing — the group number pattern will click soon.";

  return (
    <div className="max-w-2xl">
      <p className="font-heading mb-3" style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.78rem" }}>
        PRACTICE COMPLETE
      </p>
      <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
        You got <strong style={{ color: "var(--oc-text)" }}>{score} of {total}</strong> correct ({pct}%). {msg}
      </p>

      {/* Mini periodic table reminder */}
      <div className="mb-6 p-4" style={{ border: "1px solid rgba(255,255,200,0.12)", background: "rgba(255,255,200,0.03)", borderRadius: "4px" }}>
        <p className="font-heading mb-3" style={{ color: "rgba(255,255,200,0.5)", letterSpacing: "0.1em", fontSize: "0.68rem" }}>
          THE PATTERN TO REMEMBER
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
          For <strong style={{ color: "var(--oc-text)" }}>Groups 1–2</strong>, the group number = valence electrons.{" "}
          For <strong style={{ color: "var(--oc-text)" }}>Groups 13–18</strong>, subtract 10 (e.g. Group 17 → 7 valence e⁻).{" "}
          Noble gases (Group 18) have a full octet and rarely bond.
        </p>
      </div>

      <button
        onClick={onRestart}
        className="font-heading text-xs px-6 py-3 transition-all duration-200"
        style={{
          border: "1px solid rgba(52,211,153,0.4)",
          color: "rgba(52,211,153,0.9)",
          background: "rgba(52,211,153,0.05)",
          cursor: "pointer",
          letterSpacing: "0.15em",
          borderRadius: "4px",
        }}
      >
        ↩ PRACTICE AGAIN
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function LewisDotPractice() {
  const [elIdx,      setElIdx]      = useState(0);
  const [slots,      setSlots]      = useState<Slots>(EMPTY);
  const [status,     setStatus]     = useState<"idle" | "wrong-low" | "wrong-high" | "correct">("idle");
  const [wrongCount, setWrongCount] = useState(0);
  const [score,      setScore]      = useState(0);
  const [done,       setDone]       = useState(false);

  const el = ELEMENTS[elIdx];

  const toggle = useCallback((i: number) => {
    setSlots(prev => { const n = [...prev] as Slots; n[i] = !n[i]; return n; });
    if (status !== "correct") setStatus("idle");
  }, [status]);

  const reset = useCallback(() => { setSlots(EMPTY); setStatus("idle"); }, []);

  const check = useCallback(() => {
    const n = countFilled(slots);
    if (n === el.valence) {
      setStatus("correct");
      setScore(s => s + 1);
    } else {
      setStatus(n < el.valence ? "wrong-low" : "wrong-high");
      setWrongCount(w => w + 1);
    }
  }, [slots, el.valence]);

  const next = useCallback(() => {
    if (elIdx + 1 >= ELEMENTS.length) { setDone(true); return; }
    setElIdx(i => i + 1);
    setSlots(EMPTY);
    setStatus("idle");
    setWrongCount(0);
  }, [elIdx]);

  const restart = useCallback(() => {
    setElIdx(0); setSlots(EMPTY); setStatus("idle");
    setWrongCount(0); setScore(0); setDone(false);
  }, []);

  if (done) return <ResultScreen score={score} total={ELEMENTS.length} onRestart={restart} />;

  const placed     = countFilled(slots);
  const isCorrect  = status === "correct";
  const showHint   = (status === "wrong-low" || status === "wrong-high") && wrongCount >= 2;

  return (
    <div className="max-w-2xl">

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-heading mb-0.5" style={{ color: el.color, letterSpacing: "0.1em", fontSize: "0.75rem" }}>
            {el.name.toUpperCase()} — {el.group.toUpperCase()}
          </p>
          <p className="text-base" style={{ color: "var(--oc-text-muted)" }}>
            Place the valence electrons around the symbol.
          </p>
        </div>
        <p className="font-heading text-xs shrink-0" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>
          {elIdx + 1} / {ELEMENTS.length}
        </p>
      </div>

      {/* ── Dot board ── */}
      <div className="flex justify-center mb-5">
        <div style={{
          display: "grid",
          gridTemplateColumns: "44px 100px 44px",
          gridTemplateRows: "40px 70px 40px",
          alignItems: "center",
          justifyItems: "center",
          gap: 0,
        }}>
          {/* ── Row 1: top dots ── */}
          <div />
          <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
            <DotBtn filled={slots[0]} onClick={() => toggle(0)} ariaLabel="Top-left electron" />
            <DotBtn filled={slots[1]} onClick={() => toggle(1)} ariaLabel="Top-right electron" />
          </div>
          <div />

          {/* ── Row 2: left · element · right ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", justifyContent: "center" }}>
            <DotBtn filled={slots[6]} onClick={() => toggle(6)} ariaLabel="Left-top electron" />
            <DotBtn filled={slots[7]} onClick={() => toggle(7)} ariaLabel="Left-bottom electron" />
          </div>

          {/* Element box */}
          <div style={{
            width: 80,
            height: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: `1.5px solid ${el.color}55`,
            borderRadius: 4,
            background: `${el.color}09`,
          }}>
            <span style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "1.9rem",
              color: el.color,
              lineHeight: 1,
            }}>{el.symbol}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center", justifyContent: "center" }}>
            <DotBtn filled={slots[2]} onClick={() => toggle(2)} ariaLabel="Right-top electron" />
            <DotBtn filled={slots[3]} onClick={() => toggle(3)} ariaLabel="Right-bottom electron" />
          </div>

          {/* ── Row 3: bottom dots ── */}
          <div />
          <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
            <DotBtn filled={slots[4]} onClick={() => toggle(4)} ariaLabel="Bottom-left electron" />
            <DotBtn filled={slots[5]} onClick={() => toggle(5)} ariaLabel="Bottom-right electron" />
          </div>
          <div />
        </div>
      </div>

      {/* Electron counter */}
      <p className="text-center font-heading mb-4" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.72rem" }}>
        {placed} electron{placed !== 1 ? "s" : ""} placed
      </p>

      {/* ── Feedback ── */}
      {status === "wrong-low" && (
        <div className="mb-4 p-4" style={{ border: "1px solid rgba(245,166,35,0.3)", background: "rgba(245,166,35,0.05)", borderRadius: "4px" }}>
          <p className="text-base leading-relaxed" style={{ color: "rgba(245,166,35,0.9)" }}>
            {showHint
              ? `Not quite. Hint: ${el.hint}`
              : `Not enough electrons. You've placed ${placed} — try adding more.`}
          </p>
        </div>
      )}
      {status === "wrong-high" && (
        <div className="mb-4 p-4" style={{ border: "1px solid rgba(245,166,35,0.3)", background: "rgba(245,166,35,0.05)", borderRadius: "4px" }}>
          <p className="text-base leading-relaxed" style={{ color: "rgba(245,166,35,0.9)" }}>
            {showHint
              ? `Too many. Hint: ${el.hint}`
              : `Too many electrons — you've placed ${placed}. Try removing some.`}
          </p>
        </div>
      )}
      {isCorrect && (
        <div className="mb-4 p-4" style={{ border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.06)", borderRadius: "4px", borderLeft: "3px solid rgba(52,211,153,0.6)" }}>
          <p className="font-heading mb-1" style={{ color: "rgba(52,211,153,0.9)", letterSpacing: "0.08em", fontSize: "0.75rem" }}>
            ✓ CORRECT — {el.valence} VALENCE ELECTRON{el.valence !== 1 ? "S" : ""}
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            {el.success}
          </p>
        </div>
      )}

      {/* ── Controls ── */}
      <div className="flex items-center gap-3">
        {!isCorrect && (
          <button
            onClick={check}
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{
              border: "1px solid rgba(52,211,153,0.4)",
              color: "rgba(52,211,153,0.9)",
              background: "rgba(52,211,153,0.05)",
              cursor: "pointer",
              letterSpacing: "0.15em",
              borderRadius: "4px",
            }}
          >
            CHECK
          </button>
        )}
        {!isCorrect && (
          <button
            onClick={reset}
            className="font-heading text-xs px-4 py-3 transition-all duration-200"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--oc-text-dim)",
              background: "transparent",
              cursor: "pointer",
              letterSpacing: "0.15em",
              borderRadius: "4px",
            }}
          >
            RESET
          </button>
        )}
        {isCorrect && (
          <button
            onClick={next}
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{
              border: "1px solid rgba(52,211,153,0.4)",
              color: "rgba(52,211,153,0.9)",
              background: "rgba(52,211,153,0.05)",
              cursor: "pointer",
              letterSpacing: "0.15em",
              borderRadius: "4px",
            }}
          >
            {elIdx + 1 < ELEMENTS.length ? "NEXT ELEMENT →" : "SEE RESULTS →"}
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-5" style={{ height: 2, background: "var(--oc-green-border-faint)", borderRadius: 1 }}>
        <div style={{
          height: "100%",
          width: `${((elIdx + (isCorrect ? 1 : 0)) / ELEMENTS.length) * 100}%`,
          background: "rgba(52,211,153,0.5)",
          borderRadius: 1,
          transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}
