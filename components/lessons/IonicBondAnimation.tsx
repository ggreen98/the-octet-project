"use client";

import { useState, useEffect, useCallback } from "react";

const STAGES = [
  { key: "READY TO REACT",      text: "Sodium has one valence electron. Chlorine is one electron short of a full outer shell." },
  { key: "ELECTRON TRANSFER",   text: "Sodium releases its valence electron. Chlorine pulls it in." },
  { key: "IONS FORMED",         text: "Na⁺ has lost an electron — now positively charged. Cl⁻ has gained one — now negatively charged. Both have full outer shells." },
  { key: "OPPOSITES ATTRACT",   text: "Opposite charges pull toward each other. That electrostatic attraction is the bond itself." },
  { key: "IONIC BOND FORMED",   text: "Na⁺ and Cl⁻ lock together as NaCl — table salt. This is an ionic bond." },
];

// Delay (ms) before advancing to the next stage
const DELAYS = [500, 1400, 900, 900];

const ATOM_R = 50; // atom circle radius in SVG units

export function IonicBondAnimation() {
  const [stage, setStage]         = useState(0);
  const [playing, setPlaying]     = useState(false);
  const [skipAnim, setSkipAnim]   = useState(false);

  const play = useCallback(() => {
    // Disable transitions for one frame so atoms snap back silently
    setSkipAnim(true);
    setStage(0);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSkipAnim(false);
        setPlaying(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!playing) return;
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    DELAYS.forEach((delay, i) => {
      elapsed += delay;
      timers.push(setTimeout(() => {
        setStage(i + 1);
        if (i + 1 === STAGES.length - 1) setPlaying(false);
      }, elapsed));
    });
    return () => timers.forEach(clearTimeout);
  }, [playing]);

  // Derived values
  const naX         = stage >= 3 ? 208 : 130;
  const clX         = stage >= 3 ? 392 : 470;
  const eX          = stage >= 1 ? clX - ATOM_R - 8 : naX + ATOM_R + 8;
  const eOpacity    = stage >= 2 ? 0 : 1;
  const showCharge  = stage >= 2;
  const showBond    = stage >= 4;

  const T = (prop: string, dur: string) =>
    skipAnim ? "none" : `${prop} ${dur} ease-in-out`;

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 600 185"
        width="100%"
        style={{ maxWidth: "560px", overflow: "visible" }}
        aria-label="Ionic bond animation between sodium and chlorine"
      >
        <defs>
          <filter id="ib-b" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ib-p" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ib-g" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Bond dashes */}
        {showBond && (
          <line
            x1={naX + ATOM_R + 4} y1={88}
            x2={clX - ATOM_R - 4} y2={88}
            stroke="rgba(52,211,153,0.5)" strokeWidth="1.5" strokeDasharray="5 3"
          />
        )}

        {/* Attraction arrows (stage 3 only) */}
        {stage === 3 && (
          <text x={300} y={94} textAnchor="middle"
            style={{ fontSize: "13px", fill: "rgba(52,211,153,0.55)" }}>
            ← →
          </text>
        )}

        {/* Na atom group */}
        <g style={{ transform: `translateX(${naX}px) translateY(88px)`, transition: T("transform", "0.9s") }}>
          <circle cx={0} cy={0} r={ATOM_R}
            fill="rgba(68,153,255,0.07)" stroke="#4499ff" strokeWidth="1.5"
            filter="url(#ib-b)"
          />
          <text x={0} y={-6} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: "20px", fill: "#4499ff", fontWeight: 700, fontFamily: "monospace" }}>
            Na
          </text>
          <text x={0} y={11} textAnchor="middle"
            style={{ fontSize: "10px", fill: "rgba(68,153,255,0.5)" }}>
            11
          </text>
          {showCharge && (
            <text x={38} y={-42}
              style={{ fontSize: "18px", fill: "#4499ff", fontWeight: 700 }}>
              +
            </text>
          )}
          <text x={0} y={68} textAnchor="middle"
            style={{ fontSize: "9px", fill: "rgba(68,153,255,0.55)", letterSpacing: "0.1em", fontFamily: "monospace" }}>
            {showCharge ? "Na⁺" : "SODIUM"}
          </text>
        </g>

        {/* Cl atom group */}
        <g style={{ transform: `translateX(${clX}px) translateY(88px)`, transition: T("transform", "0.9s") }}>
          <circle cx={0} cy={0} r={ATOM_R}
            fill="rgba(247,37,133,0.07)" stroke="#f72585" strokeWidth="1.5"
            filter="url(#ib-p)"
          />
          <text x={0} y={-6} textAnchor="middle" dominantBaseline="central"
            style={{ fontSize: "20px", fill: "#f72585", fontWeight: 700, fontFamily: "monospace" }}>
            Cl
          </text>
          <text x={0} y={11} textAnchor="middle"
            style={{ fontSize: "10px", fill: "rgba(247,37,133,0.5)" }}>
            17
          </text>
          {showCharge && (
            <text x={-38} y={-42}
              style={{ fontSize: "18px", fill: "#f72585", fontWeight: 700 }}>
              −
            </text>
          )}
          <text x={0} y={68} textAnchor="middle"
            style={{ fontSize: "9px", fill: "rgba(247,37,133,0.55)", letterSpacing: "0.1em", fontFamily: "monospace" }}>
            {showCharge ? "Cl⁻" : "CHLORINE"}
          </text>
        </g>

        {/* Travelling electron */}
        <g style={{
          transform: `translateX(${eX}px) translateY(88px)`,
          opacity: eOpacity,
          transition: `${T("transform", "1.2s")}, ${T("opacity", "0.3s")}`,
        }}>
          <circle cx={0} cy={0} r={7} fill="#4499ff" filter="url(#ib-b)" />
          <text x={0} y={-15} textAnchor="middle"
            style={{ fontSize: "9px", fill: "rgba(68,153,255,0.8)", fontFamily: "monospace" }}>
            e⁻
          </text>
        </g>

        {/* NaCl label */}
        {showBond && (
          <text x={300} y={163} textAnchor="middle"
            style={{ fontSize: "12px", fill: "rgba(52,211,153,0.85)", letterSpacing: "0.14em", fontFamily: "monospace" }}>
            NaCl
          </text>
        )}

        {/* IONIC BOND label on the dashes */}
        {showBond && (
          <text x={300} y={76} textAnchor="middle"
            style={{ fontSize: "8px", fill: "rgba(52,211,153,0.65)", letterSpacing: "0.12em", fontFamily: "monospace" }}>
            IONIC BOND
          </text>
        )}
      </svg>

      {/* Stage label + description */}
      <div className="mt-3 mb-4" style={{ minHeight: "68px" }}>
        <p className="font-heading text-xs mb-1"
          style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.65rem" }}>
          {STAGES[stage].key}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
          {STAGES[stage].text}
        </p>
      </div>

      <button
        onClick={play}
        disabled={playing}
        className="font-heading text-xs px-6 py-3 transition-all duration-200"
        style={{
          border: "1px solid rgba(52,211,153,0.35)",
          color: playing ? "rgba(52,211,153,0.3)" : "rgba(52,211,153,0.9)",
          background: "rgba(52,211,153,0.04)",
          cursor: playing ? "default" : "pointer",
          letterSpacing: "0.15em",
          borderRadius: "4px",
        }}
      >
        {playing ? "▶  PLAYING..." : stage === 0 ? "▶  PLAY ANIMATION" : "↩  REPLAY"}
      </button>
    </div>
  );
}
