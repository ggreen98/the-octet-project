"use client";

import { useState } from "react";

type Trend = "radius" | "ionization" | "electronegativity";

interface ElementData {
  symbol: string;
  name: string;
  z: number;
  radius: number | null;       // covalent radius, pm
  ionization: number | null;   // first IE, kJ/mol
  electronegativity: number | null; // Pauling scale
}

// Periods 1–4, ordered by atomic number
const ELEMENTS: ElementData[] = [
  // Period 1
  { symbol: "H",  name: "Hydrogen",   z: 1,  radius: 31,  ionization: 1312, electronegativity: 2.20 },
  { symbol: "He", name: "Helium",     z: 2,  radius: 28,  ionization: 2372, electronegativity: null },
  // Period 2
  { symbol: "Li", name: "Lithium",    z: 3,  radius: 128, ionization: 520,  electronegativity: 0.98 },
  { symbol: "Be", name: "Beryllium",  z: 4,  radius: 96,  ionization: 900,  electronegativity: 1.57 },
  { symbol: "B",  name: "Boron",      z: 5,  radius: 84,  ionization: 801,  electronegativity: 2.04 },
  { symbol: "C",  name: "Carbon",     z: 6,  radius: 77,  ionization: 1086, electronegativity: 2.55 },
  { symbol: "N",  name: "Nitrogen",   z: 7,  radius: 71,  ionization: 1402, electronegativity: 3.04 },
  { symbol: "O",  name: "Oxygen",     z: 8,  radius: 66,  ionization: 1314, electronegativity: 3.44 },
  { symbol: "F",  name: "Fluorine",   z: 9,  radius: 57,  ionization: 1681, electronegativity: 3.98 },
  { symbol: "Ne", name: "Neon",       z: 10, radius: 58,  ionization: 2081, electronegativity: null },
  // Period 3
  { symbol: "Na", name: "Sodium",     z: 11, radius: 166, ionization: 496,  electronegativity: 0.93 },
  { symbol: "Mg", name: "Magnesium",  z: 12, radius: 141, ionization: 738,  electronegativity: 1.31 },
  { symbol: "Al", name: "Aluminum",   z: 13, radius: 121, ionization: 578,  electronegativity: 1.61 },
  { symbol: "Si", name: "Silicon",    z: 14, radius: 111, ionization: 786,  electronegativity: 1.90 },
  { symbol: "P",  name: "Phosphorus", z: 15, radius: 107, ionization: 1012, electronegativity: 2.19 },
  { symbol: "S",  name: "Sulfur",     z: 16, radius: 105, ionization: 1000, electronegativity: 2.58 },
  { symbol: "Cl", name: "Chlorine",   z: 17, radius: 102, ionization: 1251, electronegativity: 3.16 },
  { symbol: "Ar", name: "Argon",      z: 18, radius: 106, ionization: 1521, electronegativity: null },
  // Period 4
  { symbol: "K",  name: "Potassium",  z: 19, radius: 203, ionization: 419,  electronegativity: 0.82 },
  { symbol: "Ca", name: "Calcium",    z: 20, radius: 176, ionization: 590,  electronegativity: 1.00 },
  { symbol: "Sc", name: "Scandium",   z: 21, radius: 170, ionization: 633,  electronegativity: 1.36 },
  { symbol: "Ti", name: "Titanium",   z: 22, radius: 160, ionization: 659,  electronegativity: 1.54 },
  { symbol: "V",  name: "Vanadium",   z: 23, radius: 153, ionization: 651,  electronegativity: 1.63 },
  { symbol: "Cr", name: "Chromium",   z: 24, radius: 139, ionization: 653,  electronegativity: 1.66 },
  { symbol: "Mn", name: "Manganese",  z: 25, radius: 139, ionization: 717,  electronegativity: 1.55 },
  { symbol: "Fe", name: "Iron",       z: 26, radius: 132, ionization: 762,  electronegativity: 1.83 },
  { symbol: "Co", name: "Cobalt",     z: 27, radius: 126, ionization: 760,  electronegativity: 1.88 },
  { symbol: "Ni", name: "Nickel",     z: 28, radius: 124, ionization: 737,  electronegativity: 1.91 },
  { symbol: "Cu", name: "Copper",     z: 29, radius: 132, ionization: 745,  electronegativity: 1.90 },
  { symbol: "Zn", name: "Zinc",       z: 30, radius: 122, ionization: 906,  electronegativity: 1.65 },
  { symbol: "Ga", name: "Gallium",    z: 31, radius: 122, ionization: 579,  electronegativity: 1.81 },
  { symbol: "Ge", name: "Germanium",  z: 32, radius: 120, ionization: 762,  electronegativity: 2.01 },
  { symbol: "As", name: "Arsenic",    z: 33, radius: 119, ionization: 947,  electronegativity: 2.18 },
  { symbol: "Se", name: "Selenium",   z: 34, radius: 120, ionization: 941,  electronegativity: 2.55 },
  { symbol: "Br", name: "Bromine",    z: 35, radius: 120, ionization: 1140, electronegativity: 2.96 },
  { symbol: "Kr", name: "Krypton",    z: 36, radius: 116, ionization: 1351, electronegativity: 3.00 },
];

// Standard periodic table layout for periods 1–4 (null = empty cell)
// Each row is a period; each value is the atomic number or null
const LAYOUT: (number | null)[][] = [
  // Period 1: 18 columns
  [1, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 2],
  // Period 2
  [3, 4, null, null, null, null, null, null, null, null, null, null, 5, 6, 7, 8, 9, 10],
  // Period 3
  [11, 12, null, null, null, null, null, null, null, null, null, null, 13, 14, 15, 16, 17, 18],
  // Period 4
  [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
];

const TREND_CONFIG: Record<Trend, {
  label: string;
  unit: string;
  key: keyof ElementData;
  colorA: string; // low end
  colorB: string; // high end
  lowLabel: string;
  highLabel: string;
}> = {
  radius: {
    label: "ATOMIC RADIUS",
    unit: "pm",
    key: "radius",
    colorA: "#4499ff",
    colorB: "#1a2a44",
    lowLabel: "Smaller",
    highLabel: "Larger",
  },
  ionization: {
    label: "IONIZATION ENERGY",
    unit: "kJ/mol",
    key: "ionization",
    colorA: "#1a3020",
    colorB: "#72b872",
    lowLabel: "Lower",
    highLabel: "Higher",
  },
  electronegativity: {
    label: "ELECTRONEGATIVITY",
    unit: "Pauling",
    key: "electronegativity",
    colorA: "#2a1a3a",
    colorB: "#a855f7",
    lowLabel: "Lower",
    highLabel: "Higher",
  },
};

const BY_Z = new Map(ELEMENTS.map(e => [e.z, e]));

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function blendColor(colorA: string, colorB: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(colorA);
  const [br, bg, bb] = hexToRgb(colorB);
  return `rgb(${Math.round(lerp(ar, br, t))},${Math.round(lerp(ag, bg, t))},${Math.round(lerp(ab, bb, t))})`;
}

export function PeriodicTrendsMap() {
  const [trend, setTrend] = useState<Trend>("radius");
  const [hovered, setHovered] = useState<number | null>(null);

  const cfg = TREND_CONFIG[trend];

  // Compute min/max for normalization (null values excluded)
  const values = ELEMENTS.map(e => e[cfg.key] as number | null).filter((v): v is number => v !== null);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);

  function normalize(v: number | null): number | null {
    if (v === null) return null;
    return (v - minV) / (maxV - minV);
  }

  const hoveredEl = hovered !== null ? BY_Z.get(hovered) : null;
  const hoveredVal = hoveredEl ? (hoveredEl[cfg.key] as number | null) : null;

  return (
    <div
      style={{
        border: "1px solid var(--oc-green-border-dim)",
        background: "var(--oc-green-bg-surface)",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--oc-green-border-faint)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <p className="font-heading" style={{ fontSize: "0.6rem", color: "var(--oc-text-dim)", letterSpacing: "0.14em" }}>
          // INTERACTIVE — select a trend · hover an element to see its value
        </p>

        {/* Trend selector */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(Object.keys(TREND_CONFIG) as Trend[]).map(t => {
            const active = t === trend;
            const color = t === "radius" ? "#4499ff" : t === "ionization" ? "#72b872" : "#a855f7";
            return (
              <button
                key={t}
                onClick={() => setTrend(t)}
                className="font-heading"
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  padding: "4px 10px",
                  border: `1px solid ${active ? color : "var(--oc-green-border-dim)"}`,
                  background: active ? `${color}22` : "transparent",
                  color: active ? color : "var(--oc-text-dim)",
                  cursor: "pointer",
                  borderRadius: "3px",
                  transition: "all 0.15s",
                }}
              >
                {TREND_CONFIG[t].label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: "12px 16px 8px", overflowX: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 420 }}>
          {LAYOUT.map((row, period) => (
            <div key={period} style={{ display: "flex", gap: 3 }}>
              {/* Period label */}
              <div style={{
                width: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.55rem", color: "var(--oc-text-faint)", fontFamily: "inherit",
              }}>
                {period + 1}
              </div>

              {row.map((z, col) => {
                if (z === null) {
                  return <div key={col} style={{ width: 36, height: 36, flexShrink: 0 }} />;
                }
                const el = BY_Z.get(z)!;
                const val = el[cfg.key] as number | null;
                const norm = normalize(val);
                const bg = norm !== null
                  ? blendColor(cfg.colorA, cfg.colorB, norm)
                  : "var(--oc-green-badge)";
                const isHov = hovered === z;
                return (
                  <div
                    key={z}
                    onMouseEnter={() => setHovered(z)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      width: 36, height: 36, flexShrink: 0,
                      background: bg,
                      border: isHov ? "1.5px solid white" : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "3px",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      cursor: "default",
                      transition: "border 0.1s",
                      position: "relative",
                    }}
                  >
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.9)", fontFamily: "inherit", fontWeight: 600, lineHeight: 1 }}>
                      {el.symbol}
                    </span>
                    <span style={{ fontSize: "0.42rem", color: "rgba(255,255,255,0.5)", fontFamily: "inherit", lineHeight: 1, marginTop: 2 }}>
                      {el.z}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Group labels */}
          <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
            <div style={{ width: 16, flexShrink: 0 }} />
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i} style={{
                width: 36, flexShrink: 0, textAlign: "center",
                fontSize: "0.48rem", color: "var(--oc-text-faint)", fontFamily: "inherit",
              }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info panel */}
      <div
        style={{
          borderTop: "1px solid var(--oc-green-border-faint)",
          padding: "10px 16px",
          minHeight: 52,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {hoveredEl ? (
          <>
            <div>
              <span className="font-heading" style={{ fontSize: "1rem", color: "var(--oc-text)", letterSpacing: "0.04em" }}>
                {hoveredEl.symbol}
              </span>
              <span style={{ fontSize: "0.7rem", color: "var(--oc-text-muted)", marginLeft: 8 }}>
                {hoveredEl.name} · Z={hoveredEl.z}
              </span>
            </div>
            <div>
              <span className="font-heading" style={{ fontSize: "0.6rem", color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>
                {cfg.label}
              </span>
              <br />
              <span style={{ fontSize: "0.85rem", color: "var(--oc-text)" }}>
                {hoveredVal !== null ? `${hoveredVal} ${cfg.unit}` : "—"}
              </span>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.6rem", color: "var(--oc-text-faint)", fontFamily: "inherit", letterSpacing: "0.08em" }}>
              {cfg.lowLabel}
            </span>
            <div style={{
              width: 120, height: 8, borderRadius: 4,
              background: `linear-gradient(to right, ${cfg.colorA}, ${cfg.colorB})`,
            }} />
            <span style={{ fontSize: "0.6rem", color: "var(--oc-text-faint)", fontFamily: "inherit", letterSpacing: "0.08em" }}>
              {cfg.highLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
