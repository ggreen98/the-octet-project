"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";

const IonicBond3D = dynamic(() => import("./IonicBond3D"), { ssr: false });

// ── Stage copy ────────────────────────────────────────────────────────────────
const STAGES = [
  {
    label: "EXPLORE THE ATOMS",
    text:  "Sodium (left, gray) has 1 valence electron — the bright dot to its right. Chlorine (right, off-white) has 7; the faint dot shows the empty slot it needs to fill. Drag to rotate the scene.",
  },
  {
    label: "TRANSFERRING…",
    text:  "Sodium releases its valence electron. Chlorine's higher electronegativity pulls it across, filling the empty slot and completing the octet.",
  },
  {
    label: "IONS FORMED",
    text:  "The colour tells the story — Na⁺ turns pink-red (positive: more protons than electrons), Cl⁻ turns blue (negative: more electrons than protons). Both now have full outer shells.",
  },
  {
    label: "READY TO BOND",
    text:  "Opposite charges attract. Press the button to watch Na⁺ and Cl⁻ snap together.",
  },
  {
    label: "IONIC BOND FORMED",
    text:  "Na⁺ and Cl⁻ are locked together by electrostatic attraction. This is an ionic bond — and the compound is NaCl, table salt.",
  },
];

// ── Lewis dot SVG ─────────────────────────────────────────────────────────────
function LewisDotStructure() {
  const DOT_R   = 4.5;
  const CL_CX   = 232;
  const CL_CY   = 80;
  const SPREAD  = 46; // distance from Cl centre to dot pair centre

  // 4 pairs of dots around Cl
  const pairs: [number, number, number, number][] = [
    [CL_CX - 8, CL_CY - SPREAD, CL_CX + 8, CL_CY - SPREAD], // top
    [CL_CX + SPREAD, CL_CY - 8, CL_CX + SPREAD, CL_CY + 8], // right
    [CL_CX - 8, CL_CY + SPREAD, CL_CX + 8, CL_CY + SPREAD], // bottom
    [CL_CX - SPREAD, CL_CY - 8, CL_CX - SPREAD, CL_CY + 8], // left
  ];

  return (
    <svg viewBox="0 0 390 160" width="100%" style={{ maxWidth: "480px" }}>

      {/* Na⁺ */}
      <text
        x={72} y={86} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: "32px", fill: "#e05070", fontFamily: "monospace", fontWeight: 700 }}
      >
        Na
      </text>
      <text
        x={105} y={56}
        style={{ fontSize: "20px", fill: "#e05070", fontFamily: "monospace", fontWeight: 700 }}
      >
        +
      </text>

      {/* Left square bracket around Cl */}
      <polyline
        points={`152,22 138,22 138,138 152,138`}
        fill="none" stroke="rgba(68,153,255,0.55)" strokeWidth="2.5" strokeLinejoin="round"
      />

      {/* Cl circle (faint) */}
      <circle cx={CL_CX} cy={CL_CY} r={36}
        fill="rgba(68,153,255,0.06)" stroke="rgba(68,153,255,0.25)" strokeWidth="1" />

      {/* Cl label */}
      <text
        x={CL_CX} y={CL_CY} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: "26px", fill: "#4499ff", fontFamily: "monospace", fontWeight: 700 }}
      >
        Cl
      </text>

      {/* 4 lone pairs */}
      {pairs.map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <circle cx={x1} cy={y1} r={DOT_R} fill="#4499ff" />
          <circle cx={x2} cy={y2} r={DOT_R} fill="#4499ff" />
        </g>
      ))}

      {/* Right square bracket */}
      <polyline
        points={`312,22 326,22 326,138 312,138`}
        fill="none" stroke="rgba(68,153,255,0.55)" strokeWidth="2.5" strokeLinejoin="round"
      />

      {/* Cl charge − */}
      <text
        x={338} y={56}
        style={{ fontSize: "20px", fill: "#4499ff", fontFamily: "monospace", fontWeight: 700 }}
      >
        −
      </text>

      {/* NaCl label below */}
      <text
        x={195} y={152} textAnchor="middle"
        style={{ fontSize: "11px", fill: "rgba(52,211,153,0.7)", letterSpacing: "0.12em", fontFamily: "monospace" }}
      >
        Na⁺[Cl]⁻  =  NaCl  (TABLE SALT)
      </text>
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function IonicBondVisualizer() {
  const [stage, setStage]         = useState(0);
  const [showLewis, setShowLewis] = useState(false);

  const handleComplete = useCallback(() => {
    setStage(s => (s === 1 ? 2 : s === 3 ? 4 : s));
  }, []);

  function advance() {
    if (stage === 0) setStage(1);
    else if (stage === 2) setStage(3);
    else if (stage === 4) setShowLewis(true);
  }

  function replay() {
    setShowLewis(false);
    setStage(0);
  }

  const info        = STAGES[Math.min(stage, STAGES.length - 1)];
  const isAnimating = stage === 1 || stage === 3;

  const btnLabel =
    stage === 0 ? "▶  TRANSFER THE ELECTRON" :
    stage === 2 ? "▶  FORM THE IONIC BOND"   :
    stage === 4 ? "▶  SEE LEWIS DOT STRUCTURE" :
    null;

  // ── Lewis dot view ─────────────────────────────────────────────────────────
  if (showLewis) {
    return (
      <div>
        <p className="font-heading text-xs mb-1"
          style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.65rem" }}>
          LEWIS DOT STRUCTURE
        </p>
        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
          This is how chemists represent ionic bonds on paper.
        </p>

        <LewisDotStructure />

        <div className="mt-6 max-w-xl flex flex-col gap-3">
          <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            <strong style={{ color: "var(--oc-text)" }}>Lewis dot structures</strong> show only the
            valence electrons — one dot per electron. Each pair of dots sitting side by side is a{" "}
            <strong style={{ color: "var(--oc-text)" }}>lone pair</strong>. Here:
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3 p-3" style={{ border: "1px solid rgba(224,80,112,0.2)", background: "rgba(224,80,112,0.04)", borderRadius: "4px" }}>
              <span className="font-heading shrink-0 mt-0.5" style={{ fontSize: "0.68rem", color: "#e05070", letterSpacing: "0.1em" }}>Na⁺</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                No dots — sodium gave away its only valence electron. The ⁺ charge shows it now has
                one more proton than it has electrons.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3" style={{ border: "1px solid rgba(68,153,255,0.2)", background: "rgba(68,153,255,0.04)", borderRadius: "4px" }}>
              <span className="font-heading shrink-0 mt-0.5" style={{ fontSize: "0.68rem", color: "#4499ff", letterSpacing: "0.1em" }}>Cl⁻</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                8 dots in 4 lone pairs — chlorine now has a completely full outer shell. The brackets
                and ⁻ show it holds one more electron than it has protons.
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            The shorthand <strong style={{ color: "var(--oc-text)" }}>Na⁺[Cl]⁻</strong> captures the
            whole story: a metal cation and a non-metal anion held together by electrostatic
            attraction. You'll use Lewis dot structures throughout Unit 3 to quickly read and
            draw any ionic or covalent compound.
          </p>
        </div>

        <button onClick={replay}
          className="font-heading text-xs px-6 py-3 mt-6 transition-all duration-200"
          style={{
            border: "1px solid rgba(68,153,255,0.35)",
            color: "rgba(68,153,255,0.85)",
            background: "rgba(68,153,255,0.04)",
            cursor: "pointer",
            letterSpacing: "0.15em",
            borderRadius: "4px",
          }}
        >
          ↩  REPLAY 3D ANIMATION
        </button>
      </div>
    );
  }

  // ── 3D view ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Atom legend */}
      <div className="flex items-center gap-6 mb-2 font-heading text-xs"
        style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.6rem" }}>
        <span>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#9a9a9a", marginRight: 5, verticalAlign: "middle" }} />
          Na — SODIUM
        </span>
        <span>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#dcdcdc", marginRight: 5, verticalAlign: "middle" }} />
          Cl — CHLORINE
        </span>
        <span>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#ffffdd", marginRight: 5, verticalAlign: "middle" }} />
          VALENCE e⁻
        </span>
      </div>

      {/* Canvas */}
      <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>
        <IonicBond3D stage={stage} onComplete={handleComplete} />
      </div>

      {/* Stage info */}
      <div className="mt-4 mb-4" style={{ minHeight: "64px" }}>
        <p className="font-heading text-xs mb-1"
          style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.65rem" }}>
          {info.label}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
          {info.text}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {btnLabel && (
          <button onClick={advance}
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
            {btnLabel}
          </button>
        )}
        {isAnimating && (
          <span className="font-heading text-xs" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.65rem" }}>
            ▶ ANIMATING...
          </span>
        )}
      </div>
    </div>
  );
}
