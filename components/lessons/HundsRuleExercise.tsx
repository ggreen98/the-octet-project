"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type Fill = 0 | 1 | 2;

const CHALLENGES = [
  { element: "Carbon",   sym: "C",  z: 6,  electrons: 2 },
  { element: "Nitrogen", sym: "N",  z: 7,  electrons: 3 },
  { element: "Oxygen",   sym: "O",  z: 8,  electrons: 4 },
  { element: "Fluorine", sym: "F",  z: 9,  electrons: 5 },
  { element: "Neon",     sym: "Ne", z: 10, electrons: 6 },
];

const COLOR = "#a855f7";
const RGB   = "168,85,247";

function successMsg(electrons: number): string {
  if (electrons <= 3) return `All ${electrons} electron${electrons > 1 ? "s" : ""} spread across separate orbitals — Hund's rule satisfied.`;
  if (electrons === 4) return "Three orbitals filled singly first, then pairing began — Hund's rule satisfied.";
  if (electrons === 5) return "Three orbitals each got one electron before any paired — Hund's rule satisfied.";
  return "Full 2p subshell — all three orbitals paired, Hund's rule maintained throughout.";
}

export function HundsRuleExercise() {
  const { theme } = useTheme();
  const dark = theme !== "light";

  const [idx,      setIdx]      = useState(0);
  const [fills,    setFills]    = useState<[Fill, Fill, Fill]>([0, 0, 0]);
  const [error,    setError]    = useState<string | null>(null);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  const challenge    = CHALLENGES[idx];
  const placed       = fills.reduce<number>((s, f) => s + f, 0);
  const allHaveOne   = fills.every(f => f >= 1);
  const complete     = placed === challenge.electrons;

  const emptyStroke = dark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.18)";
  const emptyFill   = dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.025)";
  const nucleusFill = dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.4)";

  const handleClick = (i: number) => {
    if (complete || fills[i] === 2 || placed >= challenge.electrons) return;

    // Hund's rule: no pairing until every orbital has ≥1 electron
    if (fills[i] === 1 && !allHaveOne) {
      setShakeIdx(i);
      setShakeKey(k => k + 1);
      setError("Fill each empty orbital before pairing — Hund's rule!");
      setTimeout(() => { setShakeIdx(null); setError(null); }, 1800);
      return;
    }

    const next = fills.slice() as [Fill, Fill, Fill];
    next[i] = (next[i] + 1) as Fill;
    setFills(next);
    setError(null);
  };

  const reset = () => { setFills([0, 0, 0]); setError(null); setShakeIdx(null); };

  const selectChallenge = (i: number) => {
    setIdx(i);
    setFills([0, 0, 0]);
    setError(null);
    setShakeIdx(null);
  };

  return (
    <div style={{ marginBottom: "40px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <p style={{ fontSize: "11px", color: "var(--oc-green-dim)", letterSpacing: "0.16em", marginBottom: "2px", fontFamily: "var(--font-orbitron, monospace)" }}>EXERCISE — HUND&apos;S RULE</p>
          <p style={{ fontSize: "15px", color: "var(--oc-text-muted)" }}>
            Place electrons into the 2p subshell — fill empty orbitals before pairing.
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

      {/* ── Challenge selector ── */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
        {CHALLENGES.map((c, i) => (
          <button
            key={c.element}
            onClick={() => selectChallenge(i)}
            style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              padding: "4px 10px",
              border: `1px solid ${idx === i ? `${COLOR}66` : "var(--oc-green-border-dim)"}`,
              borderRadius: "2px",
              background: idx === i ? `rgba(${RGB},0.08)` : "transparent",
              color: idx === i ? COLOR : "var(--oc-text-dim)",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {c.sym}  (Z={c.z})
          </button>
        ))}
      </div>

      {/* ── Element info ── */}
      <div style={{ marginBottom: "16px", padding: "10px 16px", border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", background: "var(--oc-green-bg-surface)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontSize: "13px", color: "var(--oc-text-muted)" }}>
          <span style={{ color: "var(--oc-text)", fontFamily: "var(--font-orbitron, monospace)", marginRight: "6px" }}>{challenge.element}</span>
          — place <strong style={{ color: "var(--oc-text)" }}>{challenge.electrons}</strong> electron{challenge.electrons !== 1 ? "s" : ""} into the 2p subshell
        </p>
        {/* Live config notation */}
        <div style={{ fontFamily: "var(--font-orbitron, monospace)", fontSize: "13px", letterSpacing: "0.04em" }}>
          <span style={{ color: "#4499ff" }}>1s</span><sup style={{ fontSize: "0.65em", color: "#4499ff" }}>2</sup>
          {" "}
          <span style={{ color: "#4499ff" }}>2s</span><sup style={{ fontSize: "0.65em", color: "#4499ff" }}>2</sup>
          {" "}
          <span style={{ color: COLOR }}>2p</span>
          <sup style={{ fontSize: "0.65em", color: placed > 0 ? COLOR : "var(--oc-text-dim)" }}>
            {placed > 0 ? placed : "?"}
          </sup>
        </div>
      </div>

      {/* ── Orbital canvas ── */}
      <div style={{
        padding: "28px 16px 20px",
        border: "1px solid var(--oc-green-border-faint)",
        borderRadius: "4px",
        background: "var(--oc-green-bg-surface)",
        marginBottom: "12px",
        display: "flex",
        justifyContent: "center",
      }}>
        <div style={{ display: "flex", gap: "40px", alignItems: "flex-end" }}>
          {(["2px", "2py", "2pz"] as const).map((label, i) => {
            const fill = fills[i];
            const topFilled    = fill >= 1;
            const bottomFilled = fill >= 2;
            const shaking      = shakeIdx === i;
            const clickable    = fill < 2 && placed < challenge.electrons && !complete;

            return (
              <div
                key={`${label}-${shakeKey}`}
                className={`${shaking ? "hunds-shake" : ""} ${clickable ? "hunds-orbital-hover" : ""}`}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", cursor: clickable ? "pointer" : "default", userSelect: "none" }}
                onClick={() => handleClick(i)}
              >
                <svg viewBox="0 0 80 210" width="80" height="210" style={{ overflow: "visible" }}>
                  <defs>
                    <filter id={`hglow-${i}`} x="-60%" y="-40%" width="220%" height="180%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Top lobe */}
                  {topFilled && (
                    <ellipse cx="40" cy="44" rx="30" ry="42"
                      fill={`rgba(${RGB},0.14)`}
                      filter={`url(#hglow-${i})`}
                    />
                  )}
                  <ellipse
                    cx="40" cy="44" rx="26" ry="38"
                    fill={topFilled ? `rgba(${RGB},0.14)` : emptyFill}
                    stroke={topFilled ? COLOR : emptyStroke}
                    strokeWidth="1.5"
                    style={{ transition: "fill 0.3s, stroke 0.3s" }}
                  />

                  {/* Bottom lobe */}
                  {bottomFilled && (
                    <ellipse cx="40" cy="166" rx="30" ry="42"
                      fill={`rgba(${RGB},0.14)`}
                      filter={`url(#hglow-${i})`}
                    />
                  )}
                  <ellipse
                    cx="40" cy="166" rx="26" ry="38"
                    fill={bottomFilled ? `rgba(${RGB},0.14)` : emptyFill}
                    stroke={bottomFilled ? COLOR : emptyStroke}
                    strokeWidth="1.5"
                    style={{ transition: "fill 0.3s, stroke 0.3s" }}
                  />

                  {/* Nucleus */}
                  <circle cx="40" cy="105" r="5.5" fill={nucleusFill} />

                  {/* Electron 1 — top lobe, spin ↑ */}
                  {topFilled && (
                    <g style={{ animation: "fade-in 0.25s ease-out" }}>
                      <circle cx="40" cy="42" r="10" fill={`rgba(${RGB},0.22)`} />
                      <circle cx="40" cy="42" r="6.5" fill={COLOR} />
                      <text x="40" y="46.5" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" style={{ fontFamily: "monospace" }}>↑</text>
                    </g>
                  )}

                  {/* Electron 2 — bottom lobe, spin ↓ */}
                  {bottomFilled && (
                    <g style={{ animation: "fade-in 0.25s ease-out" }}>
                      <circle cx="40" cy="168" r="10" fill={`rgba(${RGB},0.22)`} />
                      <circle cx="40" cy="168" r="6.5" fill={COLOR} />
                      <text x="40" y="172.5" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" style={{ fontFamily: "monospace" }}>↓</text>
                    </g>
                  )}
                </svg>

                {/* Orbital label */}
                <span style={{
                  fontFamily: "var(--font-orbitron, monospace)",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: fill > 0 ? COLOR : "var(--oc-text-dim)",
                  transition: "color 0.3s",
                }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Feedback ── */}
      <div style={{ minHeight: "42px" }}>
        {error ? (
          <div style={{ padding: "8px 12px", border: "1px solid rgba(255,100,100,0.3)", borderRadius: "3px", background: "rgba(255,100,100,0.05)", fontSize: "12px", color: "rgba(255,130,130,0.9)", letterSpacing: "0.04em", lineHeight: 1.5 }}>
            {error}
          </div>
        ) : complete ? (
          <div style={{ padding: "10px 14px", border: "1px solid rgba(68,200,100,0.35)", borderRadius: "3px", background: "rgba(68,200,100,0.06)", fontSize: "12px", color: "#44c864", letterSpacing: "0.04em", lineHeight: 1.6 }}>
            <strong>✓ CORRECT</strong> — {successMsg(challenge.electrons)}
          </div>
        ) : (
          <p style={{ fontSize: "12px", color: "var(--oc-text-hint)", letterSpacing: "0.05em" }}>
            {placed} / {challenge.electrons} electron{challenge.electrons !== 1 ? "s" : ""} placed — click an orbital to add an electron
          </p>
        )}
      </div>

    </div>
  );
}
