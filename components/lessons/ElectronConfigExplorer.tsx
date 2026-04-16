"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type SubEntry = { label: string; n: number; type: "s" | "p" | "d" };

const S_COLOR = "#4499ff";
const P_COLOR = "#a855f7";
const D_COLOR = "#f5a623";
const SUBSHELL_COLORS: Record<string, string> = { s: S_COLOR, p: P_COLOR, d: D_COLOR };
const SUBSHELL_MAX:   Record<string, number>   = { s: 2, p: 6, d: 10 };

type ElemData = {
  symbol: string;
  name: string;
  z: number;
  block: "s" | "p" | "d";
  config: SubEntry[];
  note?: string;
};

const ELEMENTS: ElemData[] = [
  { symbol:"H",  name:"Hydrogen",   z:1,  block:"s", config:[{label:"1s",n:1,type:"s"}] },
  { symbol:"He", name:"Helium",     z:2,  block:"s", config:[{label:"1s",n:2,type:"s"}] },
  { symbol:"Li", name:"Lithium",    z:3,  block:"s", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:1,type:"s"}] },
  { symbol:"Be", name:"Beryllium",  z:4,  block:"s", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"}] },
  { symbol:"B",  name:"Boron",      z:5,  block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:1,type:"p"}] },
  { symbol:"C",  name:"Carbon",     z:6,  block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:2,type:"p"}] },
  { symbol:"N",  name:"Nitrogen",   z:7,  block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:3,type:"p"}] },
  { symbol:"O",  name:"Oxygen",     z:8,  block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:4,type:"p"}] },
  { symbol:"F",  name:"Fluorine",   z:9,  block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:5,type:"p"}] },
  { symbol:"Ne", name:"Neon",       z:10, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"}] },
  { symbol:"Na", name:"Sodium",     z:11, block:"s", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:1,type:"s"}] },
  { symbol:"Mg", name:"Magnesium",  z:12, block:"s", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"}] },
  { symbol:"Al", name:"Aluminum",   z:13, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:1,type:"p"}] },
  { symbol:"Si", name:"Silicon",    z:14, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:2,type:"p"}] },
  { symbol:"P",  name:"Phosphorus", z:15, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:3,type:"p"}] },
  { symbol:"S",  name:"Sulfur",     z:16, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:4,type:"p"}] },
  { symbol:"Cl", name:"Chlorine",   z:17, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:5,type:"p"}] },
  { symbol:"Ar", name:"Argon",      z:18, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"}] },
  { symbol:"K",  name:"Potassium",  z:19, block:"s", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"4s",n:1,type:"s"}] },
  { symbol:"Ca", name:"Calcium",    z:20, block:"s", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"4s",n:2,type:"s"}] },
  { symbol:"Sc", name:"Scandium",   z:21, block:"d", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:1,type:"d"},{label:"4s",n:2,type:"s"}] },
  { symbol:"Ti", name:"Titanium",   z:22, block:"d", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:2,type:"d"},{label:"4s",n:2,type:"s"}] },
  { symbol:"V",  name:"Vanadium",   z:23, block:"d", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:3,type:"d"},{label:"4s",n:2,type:"s"}] },
  { symbol:"Cr", name:"Chromium",   z:24, block:"d", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:5,type:"d"},{label:"4s",n:1,type:"s"}], note:"Exception: half-filled 3d is unusually stable, so one 4s electron moves to 3d." },
  { symbol:"Mn", name:"Manganese",  z:25, block:"d", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:5,type:"d"},{label:"4s",n:2,type:"s"}] },
  { symbol:"Fe", name:"Iron",       z:26, block:"d", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:6,type:"d"},{label:"4s",n:2,type:"s"}] },
  { symbol:"Co", name:"Cobalt",     z:27, block:"d", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:7,type:"d"},{label:"4s",n:2,type:"s"}] },
  { symbol:"Ni", name:"Nickel",     z:28, block:"d", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:8,type:"d"},{label:"4s",n:2,type:"s"}] },
  { symbol:"Cu", name:"Copper",     z:29, block:"d", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:10,type:"d"},{label:"4s",n:1,type:"s"}], note:"Exception: fully-filled 3d is unusually stable, so one 4s electron moves to 3d." },
  { symbol:"Zn", name:"Zinc",       z:30, block:"d", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:10,type:"d"},{label:"4s",n:2,type:"s"}] },
  { symbol:"Ga", name:"Gallium",    z:31, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:10,type:"d"},{label:"4s",n:2,type:"s"},{label:"4p",n:1,type:"p"}] },
  { symbol:"Ge", name:"Germanium",  z:32, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:10,type:"d"},{label:"4s",n:2,type:"s"},{label:"4p",n:2,type:"p"}] },
  { symbol:"As", name:"Arsenic",    z:33, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:10,type:"d"},{label:"4s",n:2,type:"s"},{label:"4p",n:3,type:"p"}] },
  { symbol:"Se", name:"Selenium",   z:34, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:10,type:"d"},{label:"4s",n:2,type:"s"},{label:"4p",n:4,type:"p"}] },
  { symbol:"Br", name:"Bromine",    z:35, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:10,type:"d"},{label:"4s",n:2,type:"s"},{label:"4p",n:5,type:"p"}] },
  { symbol:"Kr", name:"Krypton",    z:36, block:"p", config:[{label:"1s",n:2,type:"s"},{label:"2s",n:2,type:"s"},{label:"2p",n:6,type:"p"},{label:"3s",n:2,type:"s"},{label:"3p",n:6,type:"p"},{label:"3d",n:10,type:"d"},{label:"4s",n:2,type:"s"},{label:"4p",n:6,type:"p"}] },
];

const NOBLE_GAS_Z = new Set([2, 10, 18, 36]);
const NOBLE_CORES: { z: number; symbol: string }[] = [
  { z: 2,  symbol: "He" },
  { z: 10, symbol: "Ne" },
  { z: 18, symbol: "Ar" },
];

function getAbbreviated(el: ElemData): { noble: string | null; remaining: SubEntry[] } {
  const prev = [...NOBLE_CORES].reverse().find(ng => ng.z < el.z);
  if (!prev) return { noble: null, remaining: el.config };
  const prevEl = ELEMENTS.find(e => e.z === prev.z)!;
  const coreCount = prevEl.config.reduce((s, e) => s + e.n, 0);
  let counted = 0;
  const remaining: SubEntry[] = [];
  for (const entry of el.config) {
    if (counted >= coreCount) {
      remaining.push(entry);
    } else {
      counted += entry.n;
    }
  }
  return { noble: prev.symbol, remaining };
}

const BLOCK_COLORS: Record<string, string> = {
  s: S_COLOR,
  p: P_COLOR,
  d: D_COLOR,
};
const BLOCK_LABELS: Record<string, string> = {
  s: "s-block",
  p: "p-block",
  d: "d-block (transition metal)",
};

function ConfigNotation({ config, noble }: { config: SubEntry[]; noble?: string | null }) {
  return (
    <span className="font-heading" style={{ fontSize: "1rem", letterSpacing: "0.04em", lineHeight: 2, flexWrap: "wrap", display: "flex", gap: "4px", alignItems: "baseline" }}>
      {noble && (
        <span style={{ color: "var(--oc-text-dim)", marginRight: "2px" }}>[{noble}]</span>
      )}
      {config.map((entry, i) => (
        <span key={i} style={{ color: SUBSHELL_COLORS[entry.type] }}>
          {entry.label}
          <sup style={{ fontSize: "0.65em", verticalAlign: "super" }}>{entry.n}</sup>
        </span>
      ))}
    </span>
  );
}

function OrbitalBoxRow({ entry, isLight }: { entry: SubEntry; isLight: boolean }) {
  const numOrbitals = SUBSHELL_MAX[entry.type] / 2;
  const color = SUBSHELL_COLORS[entry.type];
  // Hund's rule: fill one ↑ per orbital first, then pair ↓
  const orbitals = Array.from({ length: numOrbitals }, (_, oi) => ({
    up:   oi < Math.min(entry.n, numOrbitals),
    down: entry.n > numOrbitals && oi < entry.n - numOrbitals,
  }));
  const borderAlpha = isLight ? "99" : "44"; // 60% vs 27% opacity
  const fillAlpha   = isLight ? "22" : "10"; // 13% vs 6% opacity
  return (
    <div className="flex items-center gap-2">
      <span
        className="font-heading"
        style={{ fontSize: "0.65rem", color, letterSpacing: "0.1em", width: "22px", flexShrink: 0, textAlign: "right" }}
      >
        {entry.label}
      </span>
      <div className="flex gap-[3px]">
        {orbitals.map((orb, oi) => (
          <div
            key={oi}
            style={{
              width: "22px",
              height: "36px",
              border: `1px solid ${color}${borderAlpha}`,
              borderRadius: "2px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "3px 0",
              background: (orb.up || orb.down) ? `${color}${fillAlpha}` : "transparent",
              flexShrink: 0,
              fontSize: "0.7rem",
              lineHeight: 1,
            }}
          >
            {orb.up   ? <span style={{ color }}>↑</span> : <span />}
            {orb.down ? <span style={{ color }}>↓</span> : <span />}
          </div>
        ))}
      </div>
      <span style={{ fontSize: "0.6rem", color: "var(--oc-text-dim)" }}>
        {entry.n}/{SUBSHELL_MAX[entry.type]}e⁻
      </span>
    </div>
  );
}

export function ElectronConfigExplorer() {
  const [index, setIndex] = useState(5); // Default: Carbon
  const { theme } = useTheme();
  const isLight = theme === "light";

  const el = ELEMENTS[index];
  const { noble, remaining } = getAbbreviated(el);
  const isNoble = NOBLE_GAS_Z.has(el.z);
  const blockColor = BLOCK_COLORS[el.block];

  return (
    <div className="mb-12">
      <p
        className="font-heading text-xs tracking-widest mb-4"
        style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}
      >
        {`// INTERACTIVE — ELECTRON CONFIGURATION EXPLORER`}
      </p>

      <div
        className="flex flex-col lg:flex-row max-w-2xl"
        style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}
      >
        {/* ── Left: element card + subshell diagram ── */}
        <div
          className="w-full lg:w-auto lg:min-w-[260px] p-6"
          style={{ background: isLight ? "rgba(240,237,230,0.35)" : "rgba(1,13,10,0.45)" }}
        >
          {/* Element header */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-heading" style={{ fontSize: "3.5rem", color: "var(--oc-text)", lineHeight: 1 }}>
              {el.symbol}
            </span>
            <span className="font-heading text-sm" style={{ color: "var(--oc-text-dim)" }}>
              Z = {el.z}
            </span>
          </div>
          <p className="font-heading text-xs mb-4" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.15em" }}>
            {el.name.toUpperCase()}
          </p>

          {/* Block badge */}
          <span
            className="font-heading text-xs inline-block mb-5 px-2 py-0.5"
            style={{ color: blockColor, border: `1px solid ${blockColor}44`, background: `${blockColor}11`, borderRadius: "3px", letterSpacing: "0.1em", fontSize: "0.6rem" }}
          >
            {BLOCK_LABELS[el.block].toUpperCase()}
          </span>

          {/* Orbital box diagram */}
          <p className="font-heading mb-3" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            ORBITAL DIAGRAM
          </p>
          <div className="flex flex-col gap-2">
            {el.config.map((entry, i) => (
              <OrbitalBoxRow key={i} entry={entry} isLight={isLight} />
            ))}
          </div>

          {/* Exception note */}
          {el.note && (
            <div
              className="mt-4 text-xs p-3"
              style={{ background: `${D_COLOR}11`, border: `1px solid ${D_COLOR}33`, color: "var(--oc-text-muted)", borderRadius: "3px", lineHeight: 1.6 }}
            >
              ⚠ {el.note}
            </div>
          )}
        </div>

        {/* ── Right: config notation panel ── */}
        <div
          className="esd-panel flex flex-col justify-between p-6"
          style={{ background: isLight ? "rgba(240,237,230,0.65)" : "rgba(1,13,10,0.7)" }}
        >
          <div>
            {/* Full config */}
            <p className="font-heading mb-2" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
              FULL CONFIGURATION
            </p>
            <div className="mb-5">
              <ConfigNotation config={el.config} />
            </div>

            {/* Abbreviated config */}
            {el.z > 2 && (
              <>
                <p className="font-heading mb-2" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
                  ABBREVIATED
                </p>
                <div className="mb-5">
                  {noble ? (
                    <ConfigNotation config={remaining} noble={noble} />
                  ) : (
                    <span style={{ color: "var(--oc-text-dim)", fontSize: "0.85rem" }}>—</span>
                  )}
                </div>
              </>
            )}

            {/* Noble gas callout */}
            {isNoble && (
              <div
                className="text-xs p-3 mt-2"
                style={{ background: "rgba(114,184,114,0.07)", border: "1px solid rgba(114,184,114,0.22)", color: "var(--oc-green)", borderRadius: "3px", lineHeight: 1.6 }}
              >
                Noble gas — full outer shell. This configuration is the target other atoms strive for.
              </div>
            )}

            {/* Color legend */}
            <div className="mt-5 flex flex-col gap-1.5">
              {(["s","p","d"] as const).map(t => (
                <div key={t} className="flex items-center gap-2">
                  <div style={{ width: "8px", height: "8px", borderRadius: "1px", background: SUBSHELL_COLORS[t], flexShrink: 0 }} />
                  <span style={{ fontSize: "0.65rem", color: "var(--oc-text-dim)", letterSpacing: "0.08em" }}>
                    {t}-subshell · {SUBSHELL_MAX[t] / 2} orbital{SUBSHELL_MAX[t] / 2 > 1 ? "s" : ""} · max {SUBSHELL_MAX[t]}e⁻
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-1">
                <span style={{ fontSize: "0.65rem", color: "var(--oc-text-faint)" }}>↑↓ = one electron per arrow (Hund&apos;s rule)</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={index === 0}
              className="font-heading text-xs px-3 py-2 transition-colors"
              style={{ border: "1px solid rgba(114,184,114,0.2)", color: index === 0 ? "var(--oc-text-hint)" : "var(--oc-green)", background: "transparent", cursor: index === 0 ? "not-allowed" : "pointer", borderRadius: "3px", letterSpacing: "0.08em" }}
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
              style={{ border: "1px solid rgba(114,184,114,0.2)", color: index === ELEMENTS.length - 1 ? "var(--oc-text-hint)" : "var(--oc-green)", background: "transparent", cursor: index === ELEMENTS.length - 1 ? "not-allowed" : "pointer", borderRadius: "3px", letterSpacing: "0.08em" }}
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
