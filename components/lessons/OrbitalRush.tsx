"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
type SubType   = "s" | "p" | "d" | "f";
type PlacedSub = { label: string; type: SubType; max: number; upCount: number; downCount: number };
type TargetSub = { label: string; n: number; type: "s" | "p" | "d" };
type ElemData  = { symbol: string; name: string; z: number; config: TargetSub[] };
type Phase     = "idle" | "playing" | "feedback" | "gameover";

// ── Style constants ────────────────────────────────────────────────────────────
const COLORS: Record<SubType, string> = {
  s: "#4499ff",
  p: "#a855f7",
  d: "#f5a623",
  f: "#72b872",
};

// Ordered sequence of subshells for each type — pressing S/P/D/F
// the Nth time gives you the Nth entry in these arrays.
const ORBITAL_SEQ: Record<SubType, { label: string; max: number }[]> = {
  s: ["1s","2s","3s","4s","5s","6s","7s"].map(l => ({ label: l, max: 2 })),
  p: ["2p","3p","4p","5p","6p","7p"].map(l => ({ label: l, max: 6 })),
  d: ["3d","4d","5d","6d"].map(l => ({ label: l, max: 10 })),
  f: ["4f","5f"].map(l => ({ label: l, max: 14 })),
};

const TOTAL_TIME = 60;
const MAX_LIVES  = 3;

// ── Element data (H–Kr, excluding Cr Z=24 and Cu Z=29 exceptions) ─────────────
const se = (l: string, n: number): TargetSub => ({ label: l, n, type: "s" });
const pe = (l: string, n: number): TargetSub => ({ label: l, n, type: "p" });
const de = (l: string, n: number): TargetSub => ({ label: l, n, type: "d" });

const GAME_ELEMENTS: ElemData[] = [
  { symbol:"H",  name:"Hydrogen",   z:1,  config:[se("1s",1)] },
  { symbol:"He", name:"Helium",     z:2,  config:[se("1s",2)] },
  { symbol:"Li", name:"Lithium",    z:3,  config:[se("1s",2),se("2s",1)] },
  { symbol:"Be", name:"Beryllium",  z:4,  config:[se("1s",2),se("2s",2)] },
  { symbol:"B",  name:"Boron",      z:5,  config:[se("1s",2),se("2s",2),pe("2p",1)] },
  { symbol:"C",  name:"Carbon",     z:6,  config:[se("1s",2),se("2s",2),pe("2p",2)] },
  { symbol:"N",  name:"Nitrogen",   z:7,  config:[se("1s",2),se("2s",2),pe("2p",3)] },
  { symbol:"O",  name:"Oxygen",     z:8,  config:[se("1s",2),se("2s",2),pe("2p",4)] },
  { symbol:"F",  name:"Fluorine",   z:9,  config:[se("1s",2),se("2s",2),pe("2p",5)] },
  { symbol:"Ne", name:"Neon",       z:10, config:[se("1s",2),se("2s",2),pe("2p",6)] },
  { symbol:"Na", name:"Sodium",     z:11, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",1)] },
  { symbol:"Mg", name:"Magnesium",  z:12, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2)] },
  { symbol:"Al", name:"Aluminum",   z:13, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",1)] },
  { symbol:"Si", name:"Silicon",    z:14, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",2)] },
  { symbol:"P",  name:"Phosphorus", z:15, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",3)] },
  { symbol:"S",  name:"Sulfur",     z:16, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",4)] },
  { symbol:"Cl", name:"Chlorine",   z:17, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",5)] },
  { symbol:"Ar", name:"Argon",      z:18, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6)] },
  { symbol:"K",  name:"Potassium",  z:19, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),se("4s",1)] },
  { symbol:"Ca", name:"Calcium",    z:20, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),se("4s",2)] },
  { symbol:"Sc", name:"Scandium",   z:21, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",1),se("4s",2)] },
  { symbol:"Ti", name:"Titanium",   z:22, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",2),se("4s",2)] },
  { symbol:"V",  name:"Vanadium",   z:23, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",3),se("4s",2)] },
  { symbol:"Mn", name:"Manganese",  z:25, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",5),se("4s",2)] },
  { symbol:"Fe", name:"Iron",       z:26, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",6),se("4s",2)] },
  { symbol:"Co", name:"Cobalt",     z:27, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",7),se("4s",2)] },
  { symbol:"Ni", name:"Nickel",     z:28, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",8),se("4s",2)] },
  { symbol:"Zn", name:"Zinc",       z:30, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2)] },
  { symbol:"Ga", name:"Gallium",    z:31, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",1)] },
  { symbol:"Ge", name:"Germanium",  z:32, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",2)] },
  { symbol:"As", name:"Arsenic",    z:33, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",3)] },
  { symbol:"Se", name:"Selenium",   z:34, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",4)] },
  { symbol:"Br", name:"Bromine",    z:35, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",5)] },
  { symbol:"Kr", name:"Krypton",    z:36, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",6)] },
];

// ── Validation ─────────────────────────────────────────────────────────────────
// Order-independent: checks the same set of subshells with the same counts.
function checkConfig(placed: PlacedSub[], target: ElemData): boolean {
  if (placed.length !== target.config.length) return false;
  const count = (p: PlacedSub) => p.upCount + p.downCount;
  // spins must follow Hund's rule: fill all up slots before any down slots
  const correctSpins = (p: PlacedSub) => {
    const total = count(p);
    const upMax = Math.ceil(p.max / 2);
    return p.upCount === Math.min(total, upMax);
  };
  return (
    target.config.every(t => placed.some(p => p.label === t.label && count(p) === t.n)) &&
    placed.every(p => target.config.some(t => t.label === p.label && t.n === count(p))) &&
    placed.every(p => correctSpins(p))
  );
}

// ── localStorage helpers ───────────────────────────────────────────────────────
function getHS(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("orbital-rush-hs") ?? "0", 10);
}
function saveHS(score: number) {
  if (typeof window === "undefined") return;
  if (score > getHS()) localStorage.setItem("orbital-rush-hs", String(score));
}

// ── Notation display ───────────────────────────────────────────────────────────
function NotationLine({ placed, activeIdx }: { placed: PlacedSub[]; activeIdx: number }) {
  return (
    <div className="flex flex-wrap gap-x-1.5 gap-y-1 font-heading min-h-[2rem] items-baseline">
      {placed.length === 0 ? (
        <span style={{ color: "var(--oc-text-hint)", fontSize: "0.75rem", letterSpacing: "0.06em" }}>
          press s / p / d / f to begin...
        </span>
      ) : (
        placed.map((sub, i) => {
          const isActive = i === activeIdx;
          return (
            <span
              key={i}
              style={{
                color: COLORS[sub.type],
                fontSize: "0.95rem",
                letterSpacing: "0.04em",
                opacity: isActive ? 1 : 0.6,
                borderBottom: isActive ? `1.5px solid ${COLORS[sub.type]}` : "none",
                paddingBottom: isActive ? "1px" : "2px",
                transition: "opacity 0.15s",
              }}
            >
              {sub.label}
              <sup style={{ fontSize: "0.6em", verticalAlign: "super" }}>{sub.upCount + sub.downCount}</sup>
            </span>
          );
        })
      )}
    </div>
  );
}

// ── Orbital type button ────────────────────────────────────────────────────────
function OrbBtn({
  type, disabled, onClick,
}: { type: SubType; disabled: boolean; onClick: () => void }) {
  const color = COLORS[type];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        height: "52px",
        border: `1px solid ${disabled ? "var(--oc-green-border-faint)" : color + "55"}`,
        borderRadius: "3px",
        color: disabled ? "var(--oc-text-hint)" : color,
        background: disabled ? "transparent" : `${color}0e`,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        fontSize: "1rem",
        letterSpacing: "0.1em",
        fontWeight: 700,
        transition: "background 0.1s, border-color 0.1s",
      }}
    >
      {type.toUpperCase()}
    </button>
  );
}

// ── Electron +/- button ────────────────────────────────────────────────────────
function ElBtn({
  label, disabled, onClick,
}: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        height: "44px",
        border: "1px solid var(--oc-green-border-dim)",
        borderRadius: "3px",
        color: disabled ? "var(--oc-text-hint)" : "var(--oc-text)",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        fontSize: "0.8rem",
        letterSpacing: "0.06em",
        transition: "background 0.1s",
      }}
    >
      {label}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function OrbitalRush() {
  const [phase,      setPhase]      = useState<Phase>("idle");
  const [score,      setScore]      = useState(0);
  const [lives,      setLives]      = useState(MAX_LIVES);
  const [timeLeft,   setTimeLeft]   = useState(TOTAL_TIME);
  const [active,     setActive]     = useState(false);  // timer running
  const [elIdx,      setElIdx]      = useState(0);
  const [placed,     setPlaced]     = useState<PlacedSub[]>([]);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [highScore,  setHighScore]  = useState(0);

  const usedRef = useRef<Set<number>>(new Set());

  // Derived
  const el         = GAME_ELEMENTS[elIdx];
  const activeIdx  = placed.length - 1;
  const activeSub  = placed[activeIdx] ?? null;
  const totalPlaced = placed.reduce((s, p) => s + p.upCount + p.downCount, 0);
  const timerDanger = timeLeft <= 10;
  const isFrozen    = phase === "feedback";

  // Load high score
  useEffect(() => { setHighScore(getHS()); }, []);

  // Timer
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setActive(false); setPhase("gameover"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  // Save HS when game ends
  useEffect(() => {
    if (phase === "gameover") { saveHS(score); setHighScore(getHS()); }
  }, [phase, score]);

  const pickAtom = useCallback((): number => {
    if (usedRef.current.size >= GAME_ELEMENTS.length) usedRef.current.clear();
    let idx: number;
    do { idx = Math.floor(Math.random() * GAME_ELEMENTS.length); }
    while (usedRef.current.has(idx));
    usedRef.current.add(idx);
    return idx;
  }, []);

  const loadAtom = useCallback((idx: number) => {
    setElIdx(idx);
    setPlaced([]);
    setWasCorrect(null);
    setPhase("playing");
  }, []);

  const startGame = useCallback(() => {
    usedRef.current = new Set();
    setScore(0);
    setLives(MAX_LIVES);
    setTimeLeft(TOTAL_TIME);
    setActive(true);
    loadAtom(pickAtom());
  }, [pickAtom, loadAtom]);

  const addOrbital = useCallback((type: SubType) => {
    if (isFrozen) return;
    setPlaced(prev => {
      const typeCount = prev.filter(p => p.type === type).length;
      const next = ORBITAL_SEQ[type][typeCount];
      if (!next) return prev; // no more subshells of this type available
      return [...prev, { label: next.label, type, max: next.max, upCount: 0, downCount: 0 }];
    });
  }, [isFrozen]);

  const addUp = useCallback(() => {
    if (isFrozen) return;
    setPlaced(prev => {
      if (prev.length === 0) return prev;
      return prev.map((p, i) => {
        if (i !== prev.length - 1) return p;
        if (p.upCount >= Math.ceil(p.max / 2)) return p;
        return { ...p, upCount: p.upCount + 1 };
      });
    });
  }, [isFrozen]);

  const addDown = useCallback(() => {
    if (isFrozen) return;
    setPlaced(prev => {
      if (prev.length === 0) return prev;
      return prev.map((p, i) => {
        if (i !== prev.length - 1) return p;
        if (p.downCount >= Math.floor(p.max / 2)) return p;
        return { ...p, downCount: p.downCount + 1 };
      });
    });
  }, [isFrozen]);

  const removeLast = useCallback(() => {
    if (isFrozen) return;
    setPlaced(prev => prev.slice(0, -1));
  }, [isFrozen]);

  const submit = useCallback(() => {
    if (phase !== "playing") return;
    const correct = checkConfig(placed, el);
    setWasCorrect(correct);
    setPhase("feedback");

    if (correct) {
      setScore(s => s + 10);
      setTimeout(() => loadAtom(pickAtom()), 1000);
    } else {
      setLives(l => {
        const next = l - 1;
        if (next <= 0) {
          setActive(false);
          setTimeout(() => setPhase("gameover"), 1500);
        } else {
          setTimeout(() => loadAtom(pickAtom()), 1600);
        }
        return next;
      });
    }
  }, [phase, placed, el, pickAtom, loadAtom]);

  // Keyboard: Enter = submit, Backspace = remove last
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (e.key === "Enter")                   submit();
      if (e.key === "Backspace")               removeLast();
      if (e.key === "s" || e.key === "S")      addOrbital("s");
      if (e.key === "p" || e.key === "P")      addOrbital("p");
      if (e.key === "d" || e.key === "D")      addOrbital("d");
      if (e.key === "f" || e.key === "F")      addOrbital("f");
      if (e.key === "ArrowUp")   { e.preventDefault(); addUp(); }
      if (e.key === "ArrowDown") { e.preventDefault(); addDown(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, submit, removeLast, addOrbital, addUp, addDown]);

  // ── Idle / Gameover ──────────────────────────────────────────────────────────
  if (phase === "idle" || phase === "gameover") {
    const isGO = phase === "gameover";
    return (
      <div className="mb-16">
        <p className="font-heading text-xs tracking-widest mb-4" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
          {`// MINIGAME — ORBITAL RUSH`}
        </p>
        <div className="max-w-sm p-6" style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", background: "var(--oc-green-bg-surface)" }}>
          <h3 className="font-heading mb-1" style={{ fontSize: "clamp(1.5rem,4vw,2rem)", color: "var(--oc-text)", letterSpacing: "-0.01em" }}>
            ORBITAL RUSH
          </h3>
          <p className="font-heading text-xs mb-5" style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            ELECTRON CONFIGURATION SPEEDRUN
          </p>

          {isGO && (
            <div className="mb-5 p-4" style={{ border: "1px solid var(--oc-green-border-faint)", borderRadius: "3px", background: "rgba(0,0,0,0.15)" }}>
              <p className="font-heading text-xs mb-3" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.6rem" }}>GAME OVER</p>
              <div className="flex gap-8">
                <div>
                  <p className="font-heading" style={{ fontSize: "2rem", color: "var(--oc-text)", lineHeight: 1 }}>{score}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.08em" }}>SCORE</p>
                </div>
                <div>
                  <p className="font-heading" style={{ fontSize: "2rem", color: "var(--oc-green)", lineHeight: 1 }}>{highScore}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.08em" }}>BEST</p>
                </div>
              </div>
            </div>
          )}

          {!isGO && (
            <div className="mb-5 flex flex-col gap-2">
              {[
                "You are shown a random element. Build its electron configuration from scratch.",
                "Press S / P / D / F to open the next subshell of that type. Use ↑ to add an up-spin electron, ↓ to add a down-spin electron (Hund's rule — fill up spins first).",
                "Press ← to delete the last subshell if you made a mistake.",
                "Press SUBMIT (or Enter) when done. Correct = +10 pts. Wrong = lose a life.",
                "3 lives · 60 seconds · Cr and Cu are excluded (they break Aufbau rules).",
              ].map((r, i) => (
                <div key={i} className="flex gap-2 text-xs" style={{ color: "var(--oc-text-muted)", lineHeight: 1.6 }}>
                  <span className="font-heading shrink-0" style={{ color: "var(--oc-green-dim)" }}>{i + 1}.</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}

          {highScore > 0 && !isGO && (
            <p className="text-xs mb-4" style={{ color: "var(--oc-text-dim)" }}>
              Best: <span className="font-heading" style={{ color: "var(--oc-green)" }}>{highScore}</span>
            </p>
          )}

          <button
            onClick={startGame}
            className="font-heading text-xs px-5 py-3 w-full transition-all duration-150"
            style={{ background: "rgba(114,184,114,0.12)", border: "1px solid var(--oc-green-subtle)", color: "var(--oc-green)", letterSpacing: "0.12em", borderRadius: "3px", cursor: "pointer" }}
          >
            {isGO ? "PLAY AGAIN" : "START GAME"}
          </button>
        </div>
      </div>
    );
  }

  // ── Game screen ──────────────────────────────────────────────────────────────
  const borderColor = wasCorrect === true ? "#72b872" : wasCorrect === false ? "#e05252" : "var(--oc-green-border-dim)";

  return (
    <div className="mb-16">
      <p className="font-heading text-xs tracking-widest mb-4" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
        {`// MINIGAME — ORBITAL RUSH`}
      </p>

      <div className="max-w-sm" style={{ border: `1px solid ${borderColor}`, borderRadius: "4px", overflow: "hidden", transition: "border-color 0.2s" }}>

        {/* ── Status bar ── */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "var(--oc-green-bg-surface)", borderBottom: "1px solid var(--oc-green-border-faint)" }}>
          <span
            className="font-heading"
            style={{ fontSize: "1rem", color: timerDanger ? "#e05252" : "var(--oc-text)", letterSpacing: "0.06em", minWidth: "3.5ch", transition: "color 0.3s" }}
          >
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} style={{ color: i < lives ? "#e05252" : "var(--oc-text-hint)", fontSize: "0.8rem" }}>
                {i < lives ? "●" : "○"}
              </span>
            ))}
          </div>
          <span className="font-heading text-sm" style={{ color: "var(--oc-green)", letterSpacing: "0.08em" }}>{score}</span>
        </div>

        {/* ── Element ── */}
        <div className="px-5 pt-4 pb-3" style={{ background: "rgba(1,13,10,0.5)", borderBottom: "1px solid var(--oc-green-border-faint)" }}>
          <div className="flex items-baseline gap-3 mb-0.5">
            <span className="font-heading" style={{ fontSize: "2.8rem", color: "var(--oc-text)", lineHeight: 1 }}>{el.symbol}</span>
            <span className="font-heading text-sm" style={{ color: "var(--oc-text-dim)" }}>Z = {el.z}</span>
          </div>
          <p className="font-heading text-xs" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.15em" }}>{el.name.toUpperCase()}</p>
        </div>

        {/* ── Notation display ── */}
        <div className="px-5 py-4" style={{ background: "rgba(1,13,10,0.35)", borderBottom: "1px solid var(--oc-green-border-faint)", minHeight: "72px" }}>
          <NotationLine placed={placed} activeIdx={activeIdx} />
          <div className="flex items-center gap-2 mt-2">
            <span style={{ fontSize: "0.6rem", color: "var(--oc-text-hint)", letterSpacing: "0.06em" }}>
              {totalPlaced} / {el.z} e⁻
            </span>
            {activeSub && (
              <>
                <span style={{ color: "var(--oc-text-hint)", fontSize: "0.6rem" }}>·</span>
                <span style={{ fontSize: "0.6rem", color: COLORS[activeSub.type], letterSpacing: "0.06em" }}>
                  {activeSub.label}: ↑{activeSub.upCount} ↓{activeSub.downCount} / {activeSub.max}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="px-5 py-4 flex flex-col gap-3" style={{ background: "rgba(1,13,10,0.2)" }}>
          {/* Orbital type row */}
          <div className="flex gap-2">
            {(["s","p","d","f"] as SubType[]).map(type => (
              <OrbBtn
                key={type}
                type={type}
                disabled={isFrozen || ORBITAL_SEQ[type][placed.filter(p => p.type === type).length] === undefined}
                onClick={() => addOrbital(type)}
              />
            ))}
          </div>

          {/* Electron up/down + delete row */}
          <div className="flex gap-2">
            <ElBtn
              label="↑  e⁻"
              disabled={isFrozen || !activeSub || activeSub.upCount >= Math.ceil(activeSub.max / 2)}
              onClick={addUp}
            />
            <ElBtn
              label="↓  e⁻"
              disabled={isFrozen || !activeSub || activeSub.downCount >= Math.floor(activeSub.max / 2)}
              onClick={addDown}
            />
            <button
              onClick={removeLast}
              disabled={isFrozen || placed.length === 0}
              style={{
                width: "44px",
                height: "44px",
                border: "1px solid var(--oc-green-border-dim)",
                borderRadius: "3px",
                color: (isFrozen || placed.length === 0) ? "var(--oc-text-hint)" : "var(--oc-text-muted)",
                background: "transparent",
                cursor: (isFrozen || placed.length === 0) ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                fontSize: "0.9rem",
                flexShrink: 0,
              }}
              title="Delete last subshell (Backspace)"
            >
              ←
            </button>
          </div>

          {/* Feedback row */}
          {phase === "feedback" && wasCorrect === true && (
            <div className="px-3 py-2 font-heading text-xs" style={{ background: "rgba(114,184,114,0.08)", border: "1px solid rgba(114,184,114,0.25)", borderRadius: "3px", color: "#72b872", letterSpacing: "0.1em", fontSize: "0.6rem" }}>
              CORRECT  +10 PTS
            </div>
          )}
          {phase === "feedback" && wasCorrect === false && (
            <div className="px-3 py-2 text-xs" style={{ background: "rgba(224,82,82,0.07)", border: "1px solid rgba(224,82,82,0.25)", borderRadius: "3px", color: "var(--oc-text-muted)", lineHeight: 1.7 }}>
              <span className="font-heading" style={{ color: "#e05252", letterSpacing: "0.08em", fontSize: "0.6rem" }}>WRONG — CORRECT ANSWER: </span>
              <span className="font-heading" style={{ fontSize: "0.85rem" }}>
                {el.config.map((e, i) => (
                  <span key={i} style={{ color: COLORS[e.type], marginRight: "3px" }}>
                    {e.label}<sup style={{ fontSize: "0.6em" }}>{e.n}</sup>
                  </span>
                ))}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={phase !== "playing"}
            className="font-heading text-xs py-2.5 w-full"
            style={{
              background: phase === "playing" ? "rgba(114,184,114,0.12)" : "transparent",
              border: "1px solid var(--oc-green-subtle)",
              color: phase === "playing" ? "var(--oc-green)" : "var(--oc-text-hint)",
              letterSpacing: "0.12em",
              borderRadius: "3px",
              cursor: phase === "playing" ? "pointer" : "not-allowed",
              transition: "background 0.1s",
            }}
          >
            SUBMIT  <span style={{ opacity: 0.45, fontSize: "0.55rem" }}>↵ ENTER</span>
          </button>
        </div>
      </div>
    </div>
  );
}
