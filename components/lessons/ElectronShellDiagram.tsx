"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type ElementData = {
  symbol: string;
  name: string;
  z: number;
  shells: number[];
};

const ELEMENTS: ElementData[] = [
  { symbol: "H",  name: "Hydrogen",   z: 1,  shells: [1] },
  { symbol: "He", name: "Helium",     z: 2,  shells: [2] },
  { symbol: "Li", name: "Lithium",    z: 3,  shells: [2, 1] },
  { symbol: "Be", name: "Beryllium",  z: 4,  shells: [2, 2] },
  { symbol: "B",  name: "Boron",      z: 5,  shells: [2, 3] },
  { symbol: "C",  name: "Carbon",     z: 6,  shells: [2, 4] },
  { symbol: "N",  name: "Nitrogen",   z: 7,  shells: [2, 5] },
  { symbol: "O",  name: "Oxygen",     z: 8,  shells: [2, 6] },
  { symbol: "F",  name: "Fluorine",   z: 9,  shells: [2, 7] },
  { symbol: "Ne", name: "Neon",       z: 10, shells: [2, 8] },
  { symbol: "Na", name: "Sodium",     z: 11, shells: [2, 8, 1] },
  { symbol: "Mg", name: "Magnesium",  z: 12, shells: [2, 8, 2] },
  { symbol: "Al", name: "Aluminum",   z: 13, shells: [2, 8, 3] },
  { symbol: "Si", name: "Silicon",    z: 14, shells: [2, 8, 4] },
  { symbol: "P",  name: "Phosphorus", z: 15, shells: [2, 8, 5] },
  { symbol: "S",  name: "Sulfur",     z: 16, shells: [2, 8, 6] },
  { symbol: "Cl", name: "Chlorine",   z: 17, shells: [2, 8, 7] },
  { symbol: "Ar", name: "Argon",      z: 18, shells: [2, 8, 8] },
  { symbol: "K",  name: "Potassium",  z: 19, shells: [2, 8, 8, 1] },
  { symbol: "Ca", name: "Calcium",    z: 20, shells: [2, 8, 8, 2] },
];

const SHELL_LABELS = ["K", "L", "M", "N"];
const SHELL_CAPACITY = [2, 8, 8, 2];
const SHELL_RADII = [52, 96, 140, 180];
const NOBLE_GAS_Z = new Set([2, 10, 18]);
const CX = 200;
const CY = 200;

function getElectronPositions(count: number, radius: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      x: CX + Math.cos(angle) * radius,
      y: CY + Math.sin(angle) * radius,
    };
  });
}

export function ElectronShellDiagram() {
  const [index, setIndex] = useState(5); // Default: Carbon
  const { theme } = useTheme();
  const isLight = theme === "light";

  const el = ELEMENTS[index];
  const outerIdx = el.shells.length - 1;
  const isNobleGas = NOBLE_GAS_Z.has(el.z);

  return (
    <div className="mb-12">
      <style>{`
        .esd-panel {
          width: 100%;
          border-top: 1px solid var(--oc-green-border-dim);
          border-left: none;
        }
        @media (min-width: 1024px) {
          .esd-panel {
            width: 260px;
            flex-shrink: 0;
            border-top: none;
            border-left: 1px solid var(--oc-green-border-dim);
          }
        }
      `}</style>
      <p
        className="font-heading text-xs tracking-widest mb-4"
        style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}
      >
        // INTERACTIVE — ELECTRON SHELL DIAGRAM
      </p>
      <div
        className="flex flex-col lg:flex-row"
        style={{
          border: "1px solid var(--oc-green-border-dim)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {/* ── SVG Diagram ── */}
        <div
          className="flex-1 flex items-center justify-center p-8"
          style={{ background: isLight ? "rgba(240,237,230,0.35)" : "rgba(1,13,10,0.45)" }}
        >
          <svg viewBox="0 0 400 400" style={{ width: "100%", maxWidth: "300px" }}>
            <defs>
              <filter id="esd-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="esd-nucleus" x="-100%" y="-100%" width="300%" height="300%">
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
                  cx={CX} cy={CY}
                  r={SHELL_RADII[si]}
                  fill="none"
                  stroke={
                    isOuter && isNobleGas
                      ? "rgba(114,184,114,0.4)"
                      : isOuter
                      ? "rgba(114,184,114,0.2)"
                      : "rgba(114,184,114,0.08)"
                  }
                  strokeWidth={isOuter ? 1 : 0.5}
                />
              );
            })}

            {/* Shell labels */}
            {el.shells.map((_, si) => (
              <text
                key={si}
                x={CX + SHELL_RADII[si] + 7}
                y={CY + 4}
                fontSize="10"
                fill="rgba(114,184,114,0.35)"
                fontFamily="monospace"
              >
                {SHELL_LABELS[si]}
              </text>
            ))}

            {/* Nucleus */}
            <circle cx={CX} cy={CY} r={30} fill="rgba(220,70,15,0.1)" filter="url(#esd-nucleus)" />
            <circle cx={CX} cy={CY} r={20} fill="rgba(200,60,10,0.25)" />
            <circle cx={CX} cy={CY} r={14} fill="rgba(200,55,8,0.65)" />
            <circle cx={CX} cy={CY} r={12} fill="rgba(230,75,12,0.75)" />

            {/* Element symbol */}
            <text
              x={CX} y={CY + 5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              fill="rgba(255,255,255,0.95)"
            >
              {el.symbol}
            </text>

            {/* Electrons */}
            {el.shells.map((count, si) => {
              const isOuter = si === outerIdx;
              const positions = getElectronPositions(count, SHELL_RADII[si]);
              return positions.map((pos, ei) => (
                <g key={`${si}-${ei}`}>
                  <circle
                    cx={pos.x} cy={pos.y} r={8}
                    fill={
                      isOuter && isNobleGas
                        ? "rgba(114,184,114,0.2)"
                        : isOuter
                        ? "rgba(68,153,255,0.18)"
                        : "rgba(68,153,255,0.08)"
                    }
                  />
                  <circle
                    cx={pos.x} cy={pos.y} r={3.5}
                    fill={
                      isOuter && isNobleGas
                        ? "#72b872"
                        : isOuter
                        ? "#4499ff"
                        : isLight ? "#4a88d0" : "#6aabee"
                    }
                    opacity={isOuter ? 1 : 0.5}
                    filter={isOuter ? "url(#esd-glow)" : undefined}
                  />
                </g>
              ));
            })}
          </svg>
        </div>

        {/* ── Info Panel ── */}
        <div
          className="esd-panel flex flex-col justify-between p-6"
          style={{
            background: isLight ? "rgba(240,237,230,0.65)" : "rgba(1,13,10,0.7)",
          }}
        >
          <div>
            {/* Element header */}
            <div className="flex items-baseline gap-3 mb-0.5">
              <span
                className="font-heading"
                style={{ fontSize: "2.8rem", color: "var(--oc-text)", lineHeight: 1 }}
              >
                {el.symbol}
              </span>
              <span className="font-heading text-xs" style={{ color: "var(--oc-text-dim)" }}>
                Z = {el.z}
              </span>
            </div>
            <p
              className="font-heading text-xs tracking-widest mb-6"
              style={{ color: "var(--oc-text-dim)", letterSpacing: "0.15em" }}
            >
              {el.name.toUpperCase()}
            </p>

            {/* Shell dots */}
            <p
              className="font-heading mb-3"
              style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}
            >
              ELECTRON SHELLS
            </p>
            <div className="flex flex-col gap-2.5 mb-5">
              {el.shells.map((count, si) => {
                const cap = SHELL_CAPACITY[si];
                const isOuter = si === outerIdx;
                const isFull = count === cap;
                const noble = isNobleGas && isOuter;
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
                            width: "11px",
                            height: "11px",
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: i < count
                              ? (noble ? "#72b872" : (isOuter ? "#4499ff" : (isLight ? "#4a88d0" : "#6aabee")))
                              : "transparent",
                            border: `1px solid ${
                              i < count
                                ? (noble ? "rgba(114,184,114,0.7)" : (isOuter ? "rgba(68,153,255,0.55)" : "rgba(68,153,255,0.22)"))
                                : "rgba(114,184,114,0.12)"
                            }`,
                            opacity: i < count ? (isOuter ? 1 : 0.5) : 0.45,
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-xs ml-1"
                      style={{
                        color: noble ? "var(--oc-green)" : isFull ? "var(--oc-text-muted)" : "var(--oc-text-dim)",
                        flexShrink: 0,
                      }}
                    >
                      {count}/{cap}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Noble gas note */}
            {isNobleGas && (
              <div
                className="text-xs p-3"
                style={{
                  background: "rgba(114,184,114,0.07)",
                  border: "1px solid rgba(114,184,114,0.22)",
                  color: "var(--oc-green)",
                  borderRadius: "3px",
                  lineHeight: 1.6,
                }}
              >
                Full outer shell — noble gas. Extremely stable, barely reactive.
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={index === 0}
              className="font-heading text-xs px-3 py-2 transition-colors"
              style={{
                border: "1px solid rgba(114,184,114,0.2)",
                color: index === 0 ? "var(--oc-text-hint)" : "var(--oc-green)",
                background: "transparent",
                cursor: index === 0 ? "not-allowed" : "pointer",
                borderRadius: "3px",
                letterSpacing: "0.08em",
              }}
            >
              ← PREV
            </button>
            <span className="text-xs flex-1 text-center" style={{ color: "var(--oc-text-dim)" }}>
              {index + 1} / {ELEMENTS.length}
            </span>
            <button
              onClick={() => setIndex(i => Math.min(ELEMENTS.length - 1, i + 1))}
              disabled={index === ELEMENTS.length - 1}
              className="font-heading text-xs px-3 py-2 transition-colors"
              style={{
                border: "1px solid rgba(114,184,114,0.2)",
                color: index === ELEMENTS.length - 1 ? "var(--oc-text-hint)" : "var(--oc-green)",
                background: "transparent",
                cursor: index === ELEMENTS.length - 1 ? "not-allowed" : "pointer",
                borderRadius: "3px",
                letterSpacing: "0.08em",
              }}
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
