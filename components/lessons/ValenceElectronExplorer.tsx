"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type ElementData = {
  symbol: string;
  name: string;
  z: number;
  period: number;
  group: number;
  shells: number[];
  valenceCount: number;
};

const ELEMENTS: ElementData[] = [
  { symbol: "H",  name: "Hydrogen",   z: 1,  period: 1, group: 1,  shells: [1],     valenceCount: 1 },
  { symbol: "He", name: "Helium",     z: 2,  period: 1, group: 18, shells: [2],     valenceCount: 2 },
  { symbol: "Li", name: "Lithium",    z: 3,  period: 2, group: 1,  shells: [2, 1],  valenceCount: 1 },
  { symbol: "Be", name: "Beryllium",  z: 4,  period: 2, group: 2,  shells: [2, 2],  valenceCount: 2 },
  { symbol: "B",  name: "Boron",      z: 5,  period: 2, group: 13, shells: [2, 3],  valenceCount: 3 },
  { symbol: "C",  name: "Carbon",     z: 6,  period: 2, group: 14, shells: [2, 4],  valenceCount: 4 },
  { symbol: "N",  name: "Nitrogen",   z: 7,  period: 2, group: 15, shells: [2, 5],  valenceCount: 5 },
  { symbol: "O",  name: "Oxygen",     z: 8,  period: 2, group: 16, shells: [2, 6],  valenceCount: 6 },
  { symbol: "F",  name: "Fluorine",   z: 9,  period: 2, group: 17, shells: [2, 7],  valenceCount: 7 },
  { symbol: "Ne", name: "Neon",       z: 10, period: 2, group: 18, shells: [2, 8],  valenceCount: 8 },
  { symbol: "Na", name: "Sodium",     z: 11, period: 3, group: 1,  shells: [2, 8, 1], valenceCount: 1 },
  { symbol: "Mg", name: "Magnesium",  z: 12, period: 3, group: 2,  shells: [2, 8, 2], valenceCount: 2 },
  { symbol: "Al", name: "Aluminum",   z: 13, period: 3, group: 13, shells: [2, 8, 3], valenceCount: 3 },
  { symbol: "Si", name: "Silicon",    z: 14, period: 3, group: 14, shells: [2, 8, 4], valenceCount: 4 },
  { symbol: "P",  name: "Phosphorus", z: 15, period: 3, group: 15, shells: [2, 8, 5], valenceCount: 5 },
  { symbol: "S",  name: "Sulfur",     z: 16, period: 3, group: 16, shells: [2, 8, 6], valenceCount: 6 },
  { symbol: "Cl", name: "Chlorine",   z: 17, period: 3, group: 17, shells: [2, 8, 7], valenceCount: 7 },
  { symbol: "Ar", name: "Argon",      z: 18, period: 3, group: 18, shells: [2, 8, 8], valenceCount: 8 },
];

const NOBLE_GAS_Z = new Set([2, 10, 18]);

// 9-column mini table: groups 1, 2, gap(d-block), 13–18
const COLS = [1, 2, null, 13, 14, 15, 16, 17, 18] as const;

const SHELL_RADII   = [52, 96, 140];
const SHELL_CAP     = [2, 8, 8];
const SHELL_LABELS  = ["K", "L", "M"];
const CX = 200, CY = 200;

const VALENCE_COLOR = "#f5a623"; // amber — marks valence electrons
const NOBLE_COLOR   = "#72b872"; // green — full outer shell
const VALENCE_RGB   = "245,166,35";
const NOBLE_RGB     = "114,184,114";

function getPositions(count: number, radius: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (2 * Math.PI * i) / count - Math.PI / 2;
    return { x: CX + Math.cos(a) * radius, y: CY + Math.sin(a) * radius };
  });
}

function reactivityHint(ve: number, noble: boolean, isH: boolean): { text: string; color: string } {
  if (noble) return {
    text: "Full outer shell — noble gas configuration. Extremely stable and barely reactive.",
    color: NOBLE_COLOR,
  };
  if (isH) return {
    text: "1 valence electron — hydrogen is unique: it can either lose or gain 1 electron depending on the reaction.",
    color: "#fb923c",
  };
  const map: [number, string, string][] = [
    [1, "1 valence electron — easily lost. Alkali metals are among the most reactive elements.", "#ef4444"],
    [2, "2 valence electrons — readily lost. Reactive alkaline earth metals.", "#f97316"],
    [3, "3 valence electrons — can lose all 3 to expose the full inner shell.", "#eab308"],
    [4, "4 valence electrons — tends to share rather than gain or lose. Forms many stable covalent bonds.", "#818cf8"],
    [5, "5 valence electrons — needs 3 more to reach the octet. Gains or shares electrons.", "#a78bfa"],
    [6, "6 valence electrons — needs 2 more to complete its outer shell. Very reactive non-metal.", "#f472b6"],
    [7, "7 valence electrons — needs just 1 more. Extremely reactive halogen.", "#fb7185"],
  ];
  const entry = map.find(([n]) => n === ve);
  return entry ? { text: entry[1], color: entry[2] } : { text: "", color: "#888" };
}

export function ValenceElectronExplorer() {
  const [el, setEl] = useState<ElementData>(ELEMENTS.find(e => e.symbol === "C")!);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const outerIdx   = el.shells.length - 1;
  const isNoble    = NOBLE_GAS_Z.has(el.z);
  const isH        = el.symbol === "H";
  const hint       = reactivityHint(el.valenceCount, isNoble, isH);
  const valFill    = isNoble ? NOBLE_COLOR   : VALENCE_COLOR;
  const valRGB     = isNoble ? NOBLE_RGB     : VALENCE_RGB;
  const innerColor = isLight ? "#4a88d0"     : "#6aabee";

  return (
    <div className="mb-12">
      <p
        className="font-heading text-xs tracking-widest mb-4"
        style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}
      >
        {`// INTERACTIVE — VALENCE ELECTRON EXPLORER`}
      </p>

      <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>

        {/* ── Mini periodic table selector ───────────────── */}
        <div
          className="p-4 overflow-x-auto"
          style={{
            borderBottom: "1px solid var(--oc-green-border-dim)",
            background: isLight ? "rgba(240,237,230,0.35)" : "rgba(1,13,10,0.45)",
          }}
        >
          <p
            className="font-heading text-xs mb-3"
            style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.58rem" }}
          >
            SELECT AN ELEMENT
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, minmax(38px, 1fr))",
              gap: "4px",
              minWidth: "360px",
              maxWidth: "520px",
            }}
          >
            {/* Group header row */}
            {COLS.map((g, ci) => (
              <div
                key={`hdr-${ci}`}
                className="font-heading text-center"
                style={{ fontSize: "0.5rem", color: "var(--oc-text-hint)", letterSpacing: "0.04em", paddingBottom: "4px" }}
              >
                {g === null ? "···" : g}
              </div>
            ))}

            {/* Element cells, period by period */}
            {([1, 2, 3] as const).map(period =>
              COLS.map((group, ci) => {
                // d-block gap cell
                if (group === null) {
                  return period === 1
                    ? <div key={`gap1-${ci}`} />
                    : (
                      <div
                        key={`gap-${period}-${ci}`}
                        className="flex items-center justify-center"
                        style={{ height: "42px", fontSize: "0.5rem", color: "var(--oc-text-hint)", opacity: 0.4 }}
                      >
                        ···
                      </div>
                    );
                }

                const e = ELEMENTS.find(e => e.period === period && e.group === group);
                if (!e) return <div key={`empty-${period}-${ci}`} style={{ height: "42px" }} />;

                const isSel  = e.z === el.z;
                const eNoble = NOBLE_GAS_Z.has(e.z);
                const accent = eNoble ? NOBLE_COLOR : VALENCE_COLOR;
                const accentRGB = eNoble ? NOBLE_RGB : VALENCE_RGB;

                return (
                  <button
                    key={e.z}
                    onClick={() => setEl(e)}
                    className="flex flex-col items-center justify-center transition-all duration-150"
                    style={{
                      height: "42px",
                      border:     `1px solid ${isSel ? accent : "rgba(114,184,114,0.18)"}`,
                      background: isSel ? `rgba(${accentRGB},0.14)` : "transparent",
                      borderRadius: "3px",
                      cursor: "pointer",
                      padding: "2px",
                    }}
                  >
                    <span
                      className="font-heading"
                      style={{ fontSize: "0.72rem", color: isSel ? accent : "var(--oc-text-muted)", lineHeight: 1 }}
                    >
                      {e.symbol}
                    </span>
                    <span
                      style={{ fontSize: "0.46rem", color: isSel ? accent : "var(--oc-text-hint)", opacity: 0.85 }}
                    >
                      {e.valenceCount}e
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Bohr diagram + info panel ──────────────────── */}
        <div className="flex flex-col lg:flex-row">

          {/* SVG Bohr model */}
          <div
            className="flex-1 flex items-center justify-center p-8"
            style={{ background: isLight ? "rgba(240,237,230,0.35)" : "rgba(1,13,10,0.45)" }}
          >
            <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: "280px" }}>
              <defs>
                <filter id="vee-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="vee-nucleus" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Shell rings */}
              {el.shells.map((_, si) => {
                const isOuter = si === outerIdx;
                return (
                  <circle
                    key={si}
                    cx={CX} cy={CY} r={SHELL_RADII[si]}
                    fill="none"
                    stroke={isOuter ? `rgba(${valRGB},0.42)` : "rgba(114,184,114,0.08)"}
                    strokeWidth={isOuter ? 1.5 : 0.5}
                  />
                );
              })}

              {/* Shell labels */}
              {el.shells.map((_, si) => (
                <text
                  key={si}
                  x={CX + SHELL_RADII[si] + 7} y={CY + 4}
                  fontSize="10" fill="rgba(114,184,114,0.3)" fontFamily="monospace"
                >
                  {SHELL_LABELS[si]}
                </text>
              ))}

              {/* Nucleus glow layers */}
              <circle cx={CX} cy={CY} r={30} fill="rgba(220,70,15,0.1)" filter="url(#vee-nucleus)" />
              <circle cx={CX} cy={CY} r={20} fill="rgba(200,60,10,0.25)" />
              <circle cx={CX} cy={CY} r={14} fill="rgba(200,55,8,0.65)" />
              <circle cx={CX} cy={CY} r={12} fill="rgba(230,75,12,0.75)" />
              <text
                x={CX} y={CY + 5}
                textAnchor="middle" fontSize="13" fontWeight="bold"
                fontFamily="monospace" fill="rgba(255,255,255,0.95)"
              >
                {el.symbol}
              </text>

              {/* Electrons */}
              {el.shells.map((count, si) => {
                const isOuter = si === outerIdx;
                return getPositions(count, SHELL_RADII[si]).map((pos, ei) => (
                  <g key={`${si}-${ei}`}>
                    {/* Halo */}
                    <circle
                      cx={pos.x} cy={pos.y}
                      r={isOuter ? 11 : 7}
                      fill={isOuter ? `rgba(${valRGB},0.18)` : "rgba(68,153,255,0.07)"}
                    />
                    {/* Core dot */}
                    <circle
                      cx={pos.x} cy={pos.y}
                      r={isOuter ? 4.5 : 3}
                      fill={isOuter ? valFill : innerColor}
                      opacity={isOuter ? 1 : 0.38}
                      filter={isOuter ? "url(#vee-glow)" : undefined}
                    />
                  </g>
                ));
              })}
            </svg>
          </div>

          {/* Info panel */}
          <div
            className="flex flex-col p-6"
            style={{
              minWidth: "230px",
              maxWidth: "270px",
              borderLeft: "1px solid var(--oc-green-border-dim)",
              background: isLight ? "rgba(240,237,230,0.65)" : "rgba(1,13,10,0.7)",
            }}
          >
            {/* Element header */}
            <div className="flex items-baseline gap-3 mb-0.5">
              <span className="font-heading" style={{ fontSize: "2.6rem", color: "var(--oc-text)", lineHeight: 1 }}>
                {el.symbol}
              </span>
              <span className="font-heading text-xs" style={{ color: "var(--oc-text-dim)" }}>
                Z = {el.z}
              </span>
            </div>
            <p
              className="font-heading text-xs tracking-widest mb-5"
              style={{ color: "var(--oc-text-dim)", letterSpacing: "0.15em" }}
            >
              {el.name.toUpperCase()}
            </p>

            {/* Valence count callout */}
            <div
              className="mb-5 p-3"
              style={{
                border:     `1px solid rgba(${valRGB},0.32)`,
                background: `rgba(${valRGB},0.07)`,
                borderRadius: "3px",
              }}
            >
              <p
                className="font-heading mb-1"
                style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.58rem" }}
              >
                VALENCE ELECTRONS
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-heading" style={{ fontSize: "2.2rem", color: valFill, lineHeight: 1 }}>
                  {el.valenceCount}
                </span>
                <span className="font-heading text-xs" style={{ color: "var(--oc-text-dim)" }}>
                  / GROUP {el.group}
                </span>
              </div>
            </div>

            {/* Shell dot breakdown */}
            <p
              className="font-heading mb-3"
              style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.58rem" }}
            >
              CONFIGURATION
            </p>
            <div className="flex flex-col gap-2 mb-5">
              {el.shells.map((count, si) => {
                const isOuter = si === outerIdx;
                const cap = SHELL_CAP[si];
                return (
                  <div key={si} className="flex items-center gap-2">
                    <span
                      className="font-heading text-xs"
                      style={{ color: "rgba(114,184,114,0.4)", width: "14px", flexShrink: 0 }}
                    >
                      {SHELL_LABELS[si]}
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      {Array.from({ length: cap }, (_, i) => (
                        <div
                          key={i}
                          style={{
                            width: "11px", height: "11px", borderRadius: "50%", flexShrink: 0,
                            background: i < count
                              ? (isOuter ? valFill : (isLight ? "#4a88d0" : "#6aabee"))
                              : "transparent",
                            border: `1px solid ${i < count
                              ? (isOuter ? `rgba(${valRGB},0.65)` : "rgba(68,153,255,0.28)")
                              : "rgba(114,184,114,0.12)"}`,
                            opacity: i < count ? (isOuter ? 1 : 0.45) : 0.38,
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-xs ml-1"
                      style={{ color: isOuter ? valFill : "var(--oc-text-dim)", flexShrink: 0 }}
                    >
                      {count}/{cap}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Reactivity hint */}
            <div
              className="text-xs p-3"
              style={{
                background: "rgba(114,184,114,0.04)",
                border:     "1px solid rgba(114,184,114,0.14)",
                color:       hint.color,
                borderRadius: "3px",
                lineHeight:  1.65,
              }}
            >
              {hint.text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
