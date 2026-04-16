"use client";

import { useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// ── Orbital data — full Aufbau sequence (all 19 subshells) ────────────────────
// top: px from TOP of container. Higher value = lower on screen = LOWER energy = fills first.
// Within each (n+ℓ) group, lower n fills first (lower energy) → larger top value.
// Inter-group gap: 55px. Intra-group gap: 25px.
const ORBITALS = [
  // n+ℓ = 1  (lowest energy — near bottom of diagram)
  { id: "1s", label: "1s", type: "s" as const, top: 590, col: 0, fillOrder:  1, cap:  2 },
  // n+ℓ = 2
  { id: "2s", label: "2s", type: "s" as const, top: 545, col: 0, fillOrder:  2, cap:  2 },
  // n+ℓ = 3  (2p fills before 3s → 2p lower energy → 2p has larger top)
  { id: "2p", label: "2p", type: "p" as const, top: 500, col: 1, fillOrder:  3, cap:  6 },
  { id: "3s", label: "3s", type: "s" as const, top: 475, col: 0, fillOrder:  4, cap:  2 },
  // n+ℓ = 4  (3p fills before 4s)
  { id: "3p", label: "3p", type: "p" as const, top: 430, col: 1, fillOrder:  5, cap:  6 },
  { id: "4s", label: "4s", type: "s" as const, top: 410, col: 0, fillOrder:  6, cap:  2 },
  // n+ℓ = 5  (3d fills before 4p before 5s)
  { id: "3d", label: "3d", type: "d" as const, top: 365, col: 2, fillOrder:  7, cap: 10 },
  { id: "4p", label: "4p", type: "p" as const, top: 345, col: 1, fillOrder:  8, cap:  6 },
  { id: "5s", label: "5s", type: "s" as const, top: 320, col: 0, fillOrder:  9, cap:  2 },
  // n+ℓ = 6  (4d fills before 5p before 6s)
  { id: "4d", label: "4d", type: "d" as const, top: 275, col: 2, fillOrder: 10, cap: 10 },
  { id: "5p", label: "5p", type: "p" as const, top: 255, col: 1, fillOrder: 11, cap:  6 },
  { id: "6s", label: "6s", type: "s" as const, top: 235, col: 0, fillOrder: 12, cap:  2 },
  // n+ℓ = 7  (4f → 5d → 6p → 7s)
  { id: "4f", label: "4f", type: "f" as const, top: 190, col: 3, fillOrder: 13, cap: 14 },
  { id: "5d", label: "5d", type: "d" as const, top: 170, col: 2, fillOrder: 14, cap: 10 },
  { id: "6p", label: "6p", type: "p" as const, top: 150, col: 1, fillOrder: 15, cap:  6 },
  { id: "7s", label: "7s", type: "s" as const, top: 125, col: 0, fillOrder: 16, cap:  2 },
  // n+ℓ = 8  (highest energy — near top of diagram; 5f → 6d → 7p)
  { id: "5f", label: "5f", type: "f" as const, top:  80, col: 3, fillOrder: 17, cap: 14 },
  { id: "6d", label: "6d", type: "d" as const, top:  60, col: 2, fillOrder: 18, cap: 10 },
  { id: "7p", label: "7p", type: "p" as const, top:  40, col: 1, fillOrder: 19, cap:  6 },
] as const;

type OrbitalId = typeof ORBITALS[number]["id"];

const CORRECT_ORDER: OrbitalId[] = (ORBITALS.slice() as typeof ORBITALS[number][])
  .sort((a, b) => a.fillOrder - b.fillOrder)
  .map(o => o.id) as OrbitalId[];

// Column x-centers — s column pulled right enough to clear the Y-axis (x=30)
// LINE_W=112 fits f-block: 7 boxes × 12px + 6 × 2px gap = 96px < 112 ✓
const COL_CX  = [140, 275, 410, 545];
const LINE_W  = 112;
const CONT_H  = 650;
const CONT_W  = 660;

const COLORS: Record<string, string> = {
  s: "#4499ff",
  p: "#a855f7",
  d: "#f5a623",
  f: "#72b872",
};

function hexToRgb(hex: string) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

// ── Orbital boxes — one box per orbital (cap/2 orbitals per subshell) ─────────
// Each box represents one orbital that can hold 2 electrons (↑↓).
// s=1 box, p=3 boxes, d=5 boxes, f=7 boxes.
function OrbitalBoxes({ cap, filled, color, dark }: { cap: number; filled: boolean; color: string; dark: boolean }) {
  const count = cap / 2;
  const emptyBorder = dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)";
  const emptyBg     = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)";
  return (
    <div style={{ display: "flex", gap: "2px", justifyContent: "center" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: "12px",
          height: "18px",
          border: `1px solid ${filled ? color : emptyBorder}`,
          borderRadius: "1px",
          background: filled ? `rgba(${hexToRgb(color)},0.20)` : emptyBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.25s, border-color 0.25s",
          flexShrink: 0,
          boxShadow: filled ? `0 0 4px rgba(${hexToRgb(color)},0.25)` : "none",
        }}>
          {filled && (
            <span style={{ fontSize: "7px", color, lineHeight: 1, userSelect: "none" }}>↑↓</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function AufbauDiagram() {
  const { theme } = useTheme();
  const dark = theme !== "light";

  const [filledIds, setFilledIds] = useState<OrbitalId[]>([]);
  const [wrongId,   setWrongId]   = useState<OrbitalId | null>(null);
  const [flashKey,  setFlashKey]  = useState(0);
  const [mistakes,  setMistakes]  = useState(0);

  const nextExpected = CORRECT_ORDER[filledIds.length] ?? null;
  const complete     = filledIds.length === CORRECT_ORDER.length;

  const handleClick = useCallback((id: OrbitalId) => {
    if (complete || filledIds.includes(id)) return;
    if (id === nextExpected) {
      setFilledIds(prev => [...prev, id]);
      setWrongId(null);
    } else {
      setWrongId(id);
      setFlashKey(k => k + 1);
      setMistakes(m => m + 1);
    }
  }, [complete, filledIds, nextExpected]);

  const reset = () => { setFilledIds([]); setWrongId(null); setMistakes(0); setFlashKey(0); };

  const showHint = mistakes > 0;

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <p style={{ fontSize: "11px", color: "var(--oc-green-dim)", letterSpacing: "0.16em", marginBottom: "2px" }}>CHALLENGE</p>
          <p style={{ fontSize: "16px", color: "var(--oc-text-muted)" }}>
            Click each subshell in the correct filling order — lowest energy first.
          </p>
        </div>
        <button
          onClick={reset}
          style={{ fontSize: "10px", letterSpacing: "0.1em", padding: "4px 10px", border: "1px solid var(--oc-green-border-dim)", borderRadius: "2px", background: "transparent", color: "var(--oc-text-dim)", cursor: "pointer", fontFamily: "inherit", transition: "color 0.15s, border-color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--oc-text)"; e.currentTarget.style.borderColor = "var(--oc-green-border)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--oc-text-dim)"; e.currentTarget.style.borderColor = "var(--oc-green-border-dim)"; }}
        >
          RESET
        </button>
      </div>

      {/* Diagram */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>

          {/* Y-axis ENERGY label — sits to the left of the diagram */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: "13px", letterSpacing: "0.18em",
            color: "var(--oc-text-dim)",
            paddingRight: "6px",
            flexShrink: 0,
            userSelect: "none",
          }}>
            ENERGY
          </div>

        <div style={{
          position: "relative",
          width: `${CONT_W}px`,
          height: `${CONT_H}px`,
          border: "1px solid var(--oc-green-border-faint)",
          borderRadius: "4px",
          background: "var(--oc-green-bg-surface)",
        }}>

          {/* Y-axis line */}
          <div style={{ position: "absolute", left: "30px", top: "30px", bottom: "55px", width: "1px", background: "var(--oc-green-border-dim)" }} />
          {/* Y-axis arrow */}
          <svg style={{ position: "absolute", left: "25px", top: "24px" }} width="11" height="12" viewBox="0 0 11 12">
            <path d="M5.5 0 L10 8 L5.5 6 L1 8 Z" fill="var(--oc-text-dim)" opacity="0.45" />
          </svg>

          {/* Column guide lines */}
          {COL_CX.map((cx, i) => (
            <div key={i} style={{ position: "absolute", left: `${cx}px`, top: "30px", bottom: "55px", width: "1px", background: `rgba(${hexToRgb(COLORS[["s","p","d","f"][i]])},${dark ? "0.06" : "0.12"})` }} />
          ))}

          {/* Column headers */}
          {(["s","p","d","f"] as const).map((col, i) => (
            <div key={col} style={{ position: "absolute", bottom: "18px", left: `${COL_CX[i]}px`, transform: "translateX(-50%)", fontSize: "15px", fontWeight: 700, color: COLORS[col], letterSpacing: "0.1em", fontFamily: "var(--font-orbitron, monospace)" }}>
              {col}
            </div>
          ))}

          {/* n= period labels next to s-column orbitals */}
          {(["1s","2s","3s","4s","5s","6s","7s"] as const).map(id => {
            const orb = ORBITALS.find(o => o.id === id)!;
            const n   = parseInt(id[0]);
            return (
              <div key={id} style={{ position: "absolute", left: "36px", top: `${orb.top}px`, transform: "translateY(-50%)", fontSize: "13px", color: "var(--oc-text-hint)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                n={n}
              </div>
            );
          })}

          {/* (n+ℓ) group labels on right edge */}
          {[
            { label: "n+ℓ=1", ids: ["1s"] },
            { label: "n+ℓ=2", ids: ["2s"] },
            { label: "n+ℓ=3", ids: ["2p","3s"] },
            { label: "n+ℓ=4", ids: ["3p","4s"] },
            { label: "n+ℓ=5", ids: ["3d","4p","5s"] },
            { label: "n+ℓ=6", ids: ["4d","5p","6s"] },
            { label: "n+ℓ=7", ids: ["4f","5d","6p","7s"] },
            { label: "n+ℓ=8", ids: ["5f","6d","7p"] },
          ].map(({ label, ids }) => {
            const tops = ids.map(id => ORBITALS.find(o => o.id === id)!.top);
            const minTop = Math.min(...tops);
            const maxTop = Math.max(...tops);
            const midY   = (minTop + maxTop) / 2;
            return (
              <div key={label} style={{ position: "absolute", right: "6px", top: `${midY}px`, transform: "translateY(-50%)", fontSize: "11px", color: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.3)", letterSpacing: "0.06em", whiteSpace: "nowrap", textAlign: "right" }}>
                {label}
              </div>
            );
          })}

          {/* Orbital bars — unchanged */}
          {(ORBITALS as readonly typeof ORBITALS[number][]).map(orb => {
            const isFilled = filledIds.includes(orb.id as OrbitalId);
            const isWrong  = wrongId === orb.id;
            const fillStep = filledIds.indexOf(orb.id as OrbitalId) + 1;
            const color    = COLORS[orb.type];
            const lineLeft = COL_CX[orb.col] - LINE_W / 2;

            return (
              <div
                key={orb.id}
                style={{ position: "absolute", top: `${orb.top}px`, left: `${lineLeft}px`, width: `${LINE_W}px`, transform: "translateY(-50%)" }}
              >
                <div
                  key={isWrong ? `w-${flashKey}` : orb.id}
                  className={isWrong ? "aufbau-wrong-flash" : ""}
                  onClick={() => handleClick(orb.id as OrbitalId)}
                  style={{
                    height: "26px",
                    border: `1px solid ${isFilled ? color : dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.18)"}`,
                    borderRadius: "2px",
                    background: isFilled ? `rgba(${hexToRgb(color)},0.12)` : dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)",
                    cursor: isFilled ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0 6px",
                    transition: "border-color 0.2s, background 0.2s",
                    boxShadow: isFilled ? `0 0 7px rgba(${hexToRgb(color)},0.16)` : "none",
                  }}
                  onMouseEnter={e => { if (!isFilled) { e.currentTarget.style.borderColor = `rgba(${hexToRgb(color)},0.45)`; e.currentTarget.style.background = `rgba(${hexToRgb(color)},0.07)`; } }}
                  onMouseLeave={e => { if (!isFilled) { e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.18)"; e.currentTarget.style.background = dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)"; } }}
                >
                  <span style={{ fontSize: "15px", fontFamily: "var(--font-orbitron, monospace)", fontWeight: 700, color: isFilled ? color : "var(--oc-text-dim)", letterSpacing: "0.04em", transition: "color 0.2s" }}>
                    {orb.label}
                  </span>
                  {isFilled ? (
                    <span style={{ fontSize: "14px", fontFamily: "var(--font-orbitron, monospace)", fontWeight: 700, color, opacity: 0.85 }}>{fillStep}</span>
                  ) : (
                    <span style={{ fontSize: "11px", color: "var(--oc-text-hint)" }}>{orb.cap}e⁻</span>
                  )}
                </div>
                <div style={{ marginTop: "3px" }}>
                  <OrbitalBoxes cap={orb.cap} filled={isFilled} color={color} dark={dark} />
                </div>
              </div>
            );
          })}
        </div>
        </div>{/* end flex row */}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "12px", height: "18px", border: `1px solid ${dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)"}`, borderRadius: "1px", background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          </div>
          <span style={{ fontSize: "12px", color: "var(--oc-text-hint)", letterSpacing: "0.08em" }}>= empty orbital</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "12px", height: "18px", border: "1px solid #4499ff", borderRadius: "1px", background: "rgba(68,153,255,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "7px", color: "#4499ff", lineHeight: 1 }}>↑↓</span>
          </div>
          <span style={{ fontSize: "12px", color: "var(--oc-text-hint)", letterSpacing: "0.08em" }}>= filled orbital (2 electrons)</span>
        </div>
        <span style={{ fontSize: "12px", color: "var(--oc-text-hint)", letterSpacing: "0.06em" }}>
          s=1 orbital · p=3 · d=5 · f=7
        </span>
      </div>

      {/* Status bar */}
      <div style={{ marginTop: "10px", minHeight: "40px" }}>
        {complete ? (
          <div style={{ padding: "10px 14px", border: "1px solid rgba(68,200,100,0.35)", borderRadius: "3px", background: "rgba(68,200,100,0.06)", fontSize: "13px", color: "#44c864", letterSpacing: "0.06em", lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700 }}>✓ CORRECT ORDER</span>
            {" — "}electrons always fill the lowest available energy level first (Aufbau principle). The (n+ℓ) rule predicts the order — when tied, lower n fills first. That&apos;s why 4s fills before 3d.
            {mistakes > 0 && <span style={{ opacity: 0.6, marginLeft: "8px" }}>({mistakes} mistake{mistakes !== 1 ? "s" : ""})</span>}
          </div>
        ) : showHint ? (
          <div style={{ padding: "8px 12px", border: "1px solid rgba(245,166,35,0.3)", borderRadius: "3px", background: "rgba(245,166,35,0.05)", fontSize: "13px", color: "rgba(245,166,35,0.85)", letterSpacing: "0.05em", lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700 }}>HINT</span>
            {" — "}Use the (n+ℓ) rule: add the shell number n and angular momentum ℓ (s=0, p=1, d=2, f=3). Lower sum fills first. When tied, lower n wins — that&apos;s why 4s (4+0=4) fills before 3d (3+2=5).
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
              {CORRECT_ORDER.map((id, i) => {
                const orb = ORBITALS.find(o => o.id === id)!;
                return (
                  <div key={id} style={{ width: "7px", height: "7px", borderRadius: "50%", background: i < filledIds.length ? COLORS[orb.type] : dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)", transition: "background 0.2s" }} />
                );
              })}
            </div>
            <span style={{ fontSize: "12px", color: "var(--oc-text-hint)", letterSpacing: "0.08em" }}>
              {filledIds.length} / {CORRECT_ORDER.length} filled
            </span>
            {mistakes > 0 && (
              <span style={{ fontSize: "12px", color: "rgba(255,100,100,0.7)", letterSpacing: "0.08em" }}>
                {mistakes} mistake{mistakes !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
