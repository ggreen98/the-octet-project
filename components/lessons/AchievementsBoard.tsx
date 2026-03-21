"use client";

import { useState } from "react";
import {
  ELEMENTS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  getElectronShells,
  getNeutrons,
  type Element,
} from "@/data/elements";
import { AtomViewerCanvas } from "@/components/molecules/AtomViewerCanvas";
import { HydrogenCanvas } from "@/components/molecules/HydrogenCanvas";
import { BismuthCanvas } from "@/components/molecules/BismuthCanvas";

// ── Unlocked elements ──────────────────────────────────────────────────────────
const UNLOCKED = new Set([1, 83]); // 83 = Bi (temp: testing crystal model)

// ── Fun facts per atomic number ────────────────────────────────────────────────
const FUN_FACTS: Record<number, string[]> = {
  1: [
    "The most abundant element in the universe — over 75% of all normal matter by mass.",
    "Our Sun fuses 600 million tonnes of hydrogen into helium every second.",
    "Liquid hydrogen is used as rocket fuel and burns at over 2,500 °C.",
  ],
};

// ── Extended element data for the infographic modal ────────────────────────────
interface ElementDetail {
  discovered: string;
  year: number;
  isotopes: { name: string; mass: number; stable: boolean; note: string }[];
  uses: string[];
  state: string; // at room temperature
  meltingPoint: string;
  boilingPoint: string;
}
const ELEMENT_DETAIL: Record<number, ElementDetail> = {
  1: {
    discovered: "Henry Cavendish",
    year: 1766,
    state: "Gas",
    meltingPoint: "−259.1 °C",
    boilingPoint: "−252.9 °C",
    isotopes: [
      { name: "Protium",   mass: 1, stable: true,  note: "99.98% of natural hydrogen" },
      { name: "Deuterium", mass: 2, stable: true,  note: "Used in heavy water reactors" },
      { name: "Tritium",   mass: 3, stable: false, note: "Radioactive  ·  t½ = 12.3 yr" },
    ],
    uses: ["Rocket propellant", "Fuel cells", "Ammonia synthesis", "Petroleum refining", "Welding (oxy-hydrogen)"],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function toGridRow(row: number): number {
  return row <= 7 ? row : row + 1;
}

// ── Orbital SVG decoration (matches PeriodicTableExplorer) ────────────────────
function CellOrbitals({ color, opacity = 0.18 }: { color: string; opacity?: number }) {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, pointerEvents: "none" }}
      viewBox="0 0 44 48"
    >
      <ellipse cx="22" cy="24" rx="10" ry="4"  fill="none" stroke={color} strokeWidth="0.5" />
      <ellipse cx="22" cy="24" rx="10" ry="4"  fill="none" stroke={color} strokeWidth="0.5" transform="rotate(60 22 24)" />
      <ellipse cx="22" cy="24" rx="10" ry="4"  fill="none" stroke={color} strokeWidth="0.5" transform="rotate(120 22 24)" />
      <circle  cx="22" cy="24" r="2"   fill={color} />
    </svg>
  );
}

// ── Unlocked cell ─────────────────────────────────────────────────────────────
function UnlockedCell({
  el,
  isActive,
  onEnter,
  onLeave,
  onClick,
}: {
  el: Element;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const color = CATEGORY_COLORS[el.category];

  return (
    <div style={{ gridColumn: el.col, gridRow: toGridRow(el.row) }}>
      <div
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        title={el.name}
        className="ach-cell-unlocked"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "44 / 58",
          border: `1px solid ${isActive ? color : `rgba(${hexToRgb(color)}, 0.28)`}`,
          background: isActive
            ? `rgba(${hexToRgb(color)}, 0.16)`
            : `rgba(${hexToRgb(color)}, 0.06)`,
          borderRadius: "2px",
          cursor: "pointer",
          boxShadow: isActive ? `0 0 10px rgba(${hexToRgb(color)}, 0.25), inset 0 1px 0 rgba(255,255,255,0.08)` : "none",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <CellOrbitals color={color} opacity={isActive ? 0.25 : 0.18} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "2px 2px 3px" }}>
          {/* Z + padlock row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontSize: "13px", color: "var(--oc-text-dim)", lineHeight: 1, paddingLeft: "2px", opacity: 0 }}>
              {/* spacer */}
            </span>
            <span style={{ fontSize: "13px", color: "var(--oc-text-dim)", lineHeight: 1, paddingRight: "2px" }}>
              {el.z}
            </span>
          </div>
          {/* Symbol */}
          <span style={{ fontSize: "21px", fontFamily: "var(--font-orbitron, monospace)", color, lineHeight: 1, fontWeight: 600 }}>
            {el.symbol}
          </span>
          {/* Mass */}
          <span style={{ fontSize: "8.5px", color: "var(--oc-text-dim)", lineHeight: 1, letterSpacing: "0.01em", opacity: 0.8 }}>
            {el.mass.toFixed(el.mass < 10 ? 3 : el.mass < 100 ? 3 : 2)}
          </span>
        </div>
        {/* Open padlock */}
        <span style={{ position: "absolute", top: 2, left: 2, zIndex: 2 }}>
          <svg width="7" height="8" viewBox="0 0 13 14" fill="none" style={{ color: "#ffb300" }}>
            <rect x="1" y="6.5" width="11" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M4 6.5V5a2.5 2.5 0 0 1 5 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="3 1.5" />
          </svg>
        </span>
      </div>
    </div>
  );
}

// ── Locked cell ───────────────────────────────────────────────────────────────
function LockedCell({ el }: { el: Element }) {
  return (
    <div style={{ gridColumn: el.col, gridRow: toGridRow(el.row) }}>
      <div
        title={el.name}
        className="ach-cell-locked"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "44 / 58",
          borderRadius: "2px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <CellOrbitals color="currentColor" opacity={0.04} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "2px 2px 3px" }}>
          <span className="ach-cell-locked-text" style={{ fontSize: "13px", lineHeight: 1, paddingRight: "2px", alignSelf: "flex-end" }}>
            {el.z}
          </span>
          <span className="ach-cell-locked-text" style={{ fontSize: "21px", fontFamily: "var(--font-orbitron, monospace)", lineHeight: 1, fontWeight: 600 }}>
            {el.symbol}
          </span>
          <span className="ach-cell-locked-text" style={{ fontSize: "8.5px", lineHeight: 1, opacity: 0.6 }}>
            {el.mass.toFixed(el.mass < 10 ? 3 : el.mass < 100 ? 3 : 2)}
          </span>
        </div>
        {/* Closed padlock */}
        <span className="ach-cell-locked-icon" style={{ position: "absolute", top: 2, left: 2, zIndex: 2 }}>
          <svg width="7" height="8" viewBox="0 0 13 14" fill="none">
            <rect x="1" y="6.5" width="11" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M4 6.5V4a2.5 2.5 0 0 1 5 0v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({ el }: { el: Element }) {
  const color    = CATEGORY_COLORS[el.category];
  const shells   = getElectronShells(el.z);
  const neutrons = getNeutrons(el);
  const facts    = FUN_FACTS[el.z] ?? [];

  return (
    <div style={{
      border: `1px solid ${color}30`,
      background: "var(--oc-bg)",
      borderRadius: "4px",
      overflow: "hidden",
    }}>
      {/* 3D viewer — artsy model per element, generic fallback */}
      <div style={{ height: "220px", position: "relative" }}>
        {el.z === 1  ? <HydrogenCanvas /> :
         el.z === 83 ? <BismuthCanvas /> :
         <AtomViewerCanvas z={el.z} />}
      </div>

      <div style={{ padding: "14px 16px", borderTop: `1px solid ${color}20` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "10px" }}>
          <span style={{ fontSize: "2.5rem", fontFamily: "var(--font-orbitron, monospace)", color, lineHeight: 1 }}>
            {el.symbol}
          </span>
          <span style={{ fontSize: "1rem", color: "var(--oc-text)", fontFamily: "var(--font-orbitron, monospace)", letterSpacing: "0.05em" }}>
            {el.name.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginTop: "10px" }}>
          {([
            ["ATOMIC №",  el.z],
            ["MASS",      el.mass + " u"],
            ["PROTONS",   el.z],
            ["NEUTRONS",  neutrons],
            ["ELECTRONS", el.z],
            ["SHELLS",    shells.length],
          ] as [string, string | number][]).map(([label, value]) => (
            <div key={label as string}>
              <div style={{ fontSize: "11px", color: "var(--oc-green-dim)", letterSpacing: "0.12em", marginBottom: "2px" }}>
                {label}
              </div>
              <div style={{ fontSize: "15px", color: "var(--oc-text)", fontFamily: "var(--font-orbitron, monospace)" }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "12px" }}>
          <div style={{ fontSize: "11px", color: "var(--oc-green-dim)", letterSpacing: "0.12em", marginBottom: "4px" }}>
            ELECTRON CONFIG
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {shells.map((count, i) => (
              <span key={i} style={{
                fontSize: "13px",
                padding: "2px 6px",
                background: `rgba(${hexToRgb(color)}, 0.12)`,
                border: `1px solid ${color}30`,
                color,
                borderRadius: "2px",
                fontFamily: "var(--font-orbitron, monospace)",
              }}>
                {["K","L","M","N","O","P","Q"][i]}:{count}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "10px", display: "inline-block", fontSize: "12px", padding: "3px 8px", background: `rgba(${hexToRgb(color)}, 0.1)`, border: `1px solid ${color}30`, color, borderRadius: "2px", letterSpacing: "0.1em" }}>
          {CATEGORY_LABELS[el.category].toUpperCase()}
        </div>

        {facts.length > 0 && (
          <div style={{ marginTop: "12px", borderTop: "1px solid var(--oc-green-border-faint)", paddingTop: "10px" }}>
            <div style={{ fontSize: "11px", color: "var(--oc-green-dim)", letterSpacing: "0.12em", marginBottom: "6px" }}>
              FUN FACTS
            </div>
            {facts.map((fact, i) => (
              <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                <span style={{ color, flexShrink: 0, fontSize: "0.6rem", marginTop: "3px" }}>⬡</span>
                <p style={{ fontSize: "12px", color: "var(--oc-text-muted)", lineHeight: 1.55, margin: 0 }}>
                  {fact}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hydrogen emission spectrum (Balmer series) ─────────────────────────────────
// Visible range 380–700 nm. Lines: Hα 656.3, Hβ 486.1, Hγ 434.0, Hδ 410.2
const H_LINES = [
  { nm: 656.3, color: "#ff3a3a", label: "Hα", glow: "rgba(255,58,58,0.6)" },
  { nm: 486.1, color: "#40c8ff", label: "Hβ", glow: "rgba(64,200,255,0.6)" },
  { nm: 434.0, color: "#8866ff", label: "Hγ", glow: "rgba(136,102,255,0.6)" },
  { nm: 410.2, color: "#cc44ff", label: "Hδ", glow: "rgba(204,68,255,0.6)" },
];
function nmToPercent(nm: number) { return ((nm - 380) / (700 - 380)) * 100; }

function EmissionSpectrum() {
  return (
    <div>
      <div style={{ fontSize: "10px", color: "var(--oc-green-dim)", letterSpacing: "0.15em", marginBottom: "8px" }}>
        EMISSION SPECTRUM — BALMER SERIES
      </div>
      {/* Spectrum bar */}
      <div style={{ position: "relative", height: "36px", borderRadius: "3px", overflow: "hidden", background: "#050508", border: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Rainbow background (dim) */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #2a003a, #00007a, #006a9a, #008060, #406000, #903000, #500000)", opacity: 0.18 }} />
        {H_LINES.map(line => (
          <div
            key={line.nm}
            style={{
              position: "absolute",
              top: 0, bottom: 0,
              left: `${nmToPercent(line.nm)}%`,
              width: "2px",
              background: line.color,
              boxShadow: `0 0 6px 2px ${line.glow}`,
            }}
          />
        ))}
      </div>
      {/* Labels */}
      <div style={{ position: "relative", height: "20px", marginTop: "4px" }}>
        {H_LINES.map(line => (
          <div
            key={line.nm}
            style={{
              position: "absolute",
              left: `${nmToPercent(line.nm)}%`,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1px",
            }}
          >
            <span style={{ fontSize: "8px", color: line.color, fontFamily: "var(--font-orbitron, monospace)", letterSpacing: "0.05em" }}>{line.label}</span>
          </div>
        ))}
      </div>
      {/* nm scale */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
        <span style={{ fontSize: "8px", color: "var(--oc-text-hint)", letterSpacing: "0.06em" }}>380 nm</span>
        <span style={{ fontSize: "8px", color: "var(--oc-text-hint)", letterSpacing: "0.06em" }}>700 nm</span>
      </div>
    </div>
  );
}

// ── Hydrogen flame ─────────────────────────────────────────────────────────────
// H₂ burns pale blue-violet — nearly invisible in daylight.
function HydrogenFlame() {
  return (
    <div>
      <div style={{ fontSize: "10px", color: "var(--oc-green-dim)", letterSpacing: "0.15em", marginBottom: "8px" }}>
        COMBUSTION FLAME
      </div>
      <div style={{
        display: "flex", gap: "16px", alignItems: "center",
        padding: "16px", borderRadius: "3px",
        background: "rgba(4,6,18,0.9)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Animated flame */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <div style={{ position: "relative", width: "60px", height: "110px" }}>
            <div className="h-flame-outer" />
            <div className="h-flame-mid"   />
            <div className="h-flame-core"  />
          </div>
          {/* Burner */}
          <div style={{
            width: "32px", height: "5px", marginTop: "-1px",
            background: "rgba(110,115,130,0.85)",
            borderRadius: "1px 1px 0 0",
            border: "1px solid rgba(160,165,180,0.3)",
            borderBottom: "none",
          }} />
          <div style={{
            width: "20px", height: "10px",
            background: "rgba(80,85,95,0.8)",
            borderRadius: "0 0 2px 2px",
            border: "1px solid rgba(130,135,150,0.25)",
            borderTop: "none",
          }} />
        </div>

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div>
            <div style={{ fontSize: "9px", color: "var(--oc-text-hint)", letterSpacing: "0.12em", marginBottom: "3px" }}>REACTION</div>
            <div style={{ fontSize: "13px", color: "#a0d4ff", fontFamily: "var(--font-orbitron, monospace)", letterSpacing: "0.04em" }}>
              2H₂ + O₂ → 2H₂O
            </div>
          </div>
          <div>
            <div style={{ fontSize: "9px", color: "var(--oc-text-hint)", letterSpacing: "0.12em", marginBottom: "3px" }}>FLAME TEMP</div>
            <div style={{ fontSize: "13px", color: "var(--oc-text)", fontFamily: "var(--font-orbitron, monospace)" }}>
              ~2,500 °C
            </div>
          </div>
          <div>
            <div style={{ fontSize: "9px", color: "var(--oc-text-hint)", letterSpacing: "0.12em", marginBottom: "3px" }}>FLAME COLOR</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "rgba(160,210,255,0.8)", boxShadow: "0 0 6px rgba(120,180,255,0.8)" }} />
              <span style={{ fontSize: "11px", color: "#a0d4ff" }}>Pale blue-violet</span>
            </div>
            <div style={{ fontSize: "9px", color: "var(--oc-text-hint)", marginTop: "3px", fontStyle: "italic" }}>
              Nearly invisible in daylight
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Infographic modal ──────────────────────────────────────────────────────────
function InfographicModal({ el, onClose }: { el: Element; onClose: () => void }) {
  const color    = CATEGORY_COLORS[el.category];
  const shells   = getElectronShells(el.z);
  const neutrons = getNeutrons(el);
  const facts    = FUN_FACTS[el.z]    ?? [];
  const detail   = ELEMENT_DETAIL[el.z];

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "var(--oc-bg)",
          border: `1px solid rgba(${hexToRgb(color)}, 0.35)`,
          borderRadius: "6px",
          position: "relative",
          /* top accent line */
          boxShadow: `0 0 0 0 transparent, inset 0 2px 0 0 ${color}`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "12px", right: "12px", zIndex: 10,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--oc-text-sub)", borderRadius: "4px",
            width: "28px", height: "28px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", lineHeight: 1, fontFamily: "inherit",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* 3D atom canvas */}
        <div style={{ height: "260px", position: "relative", borderBottom: `1px solid rgba(${hexToRgb(color)}, 0.12)` }}>
          {el.z === 1  ? <HydrogenCanvas /> :
           el.z === 83 ? <BismuthCanvas  /> :
           <AtomViewerCanvas z={el.z} />}
          {/* Floating element badge */}
          <div style={{
            position: "absolute", bottom: "12px", left: "16px",
            display: "flex", alignItems: "baseline", gap: "10px",
          }}>
            <span style={{ fontSize: "4rem", fontFamily: "var(--font-orbitron, monospace)", color, lineHeight: 1, fontWeight: 700, textShadow: `0 0 30px rgba(${hexToRgb(color)},0.5)` }}>
              {el.symbol}
            </span>
            <div>
              <div style={{ fontSize: "1rem", color: "var(--oc-text)", fontFamily: "var(--font-orbitron, monospace)", letterSpacing: "0.06em", lineHeight: 1.1 }}>
                {el.name.toUpperCase()}
              </div>
              <div style={{ fontSize: "10px", color, letterSpacing: "0.12em", marginTop: "3px" }}>
                {CATEGORY_LABELS[el.category].toUpperCase()}
              </div>
            </div>
          </div>
          {/* Atomic number badge */}
          <div style={{ position: "absolute", top: "14px", left: "16px", fontSize: "11px", color: "var(--oc-text-hint)", letterSpacing: "0.12em", fontFamily: "var(--font-orbitron, monospace)" }}>
            Z = {el.z}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Discovery */}
          {detail && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "8px 12px", background: `rgba(${hexToRgb(color)}, 0.06)`, border: `1px solid rgba(${hexToRgb(color)}, 0.15)`, borderRadius: "3px" }}>
              <span style={{ fontSize: "9px", color: "var(--oc-text-hint)", letterSpacing: "0.12em" }}>DISCOVERED</span>
              <span style={{ fontSize: "11px", color: "var(--oc-text)", fontFamily: "var(--font-orbitron, monospace)", letterSpacing: "0.05em" }}>{detail.discovered}</span>
              <span style={{ fontSize: "10px", color, fontFamily: "var(--font-orbitron, monospace)", marginLeft: "auto" }}>{detail.year}</span>
            </div>
          )}

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {([
              ["ATOMIC №",  el.z],
              ["MASS",      el.mass + " u"],
              ["STATE",     detail?.state ?? "—"],
              ["PROTONS",   el.z],
              ["NEUTRONS",  neutrons],
              ["ELECTRONS", el.z],
              ...(detail ? [
                ["MELTING PT", detail.meltingPoint],
                ["BOILING PT", detail.boilingPoint],
                ["SHELLS",     shells.length],
              ] : [["SHELLS", shells.length]] as [string, string|number][]),
            ] as [string, string | number][]).map(([label, value]) => (
              <div key={label as string} style={{ padding: "8px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "3px" }}>
                <div style={{ fontSize: "9px", color: "var(--oc-green-dim)", letterSpacing: "0.12em", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontSize: "14px", color: "var(--oc-text)", fontFamily: "var(--font-orbitron, monospace)" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Emission spectrum (hydrogen only) */}
          {el.z === 1 && <EmissionSpectrum />}

          {/* Hydrogen flame (hydrogen only) */}
          {el.z === 1 && <HydrogenFlame />}

          {/* Electron configuration */}
          <div>
            <div style={{ fontSize: "10px", color: "var(--oc-green-dim)", letterSpacing: "0.15em", marginBottom: "8px" }}>ELECTRON CONFIGURATION</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {shells.map((count, i) => (
                <span key={i} style={{
                  fontSize: "13px", padding: "4px 10px",
                  background: `rgba(${hexToRgb(color)}, 0.10)`,
                  border: `1px solid rgba(${hexToRgb(color)}, 0.25)`,
                  color, borderRadius: "3px",
                  fontFamily: "var(--font-orbitron, monospace)",
                }}>
                  {["K","L","M","N","O","P","Q"][i]}:{count}
                </span>
              ))}
            </div>
          </div>

          {/* Isotopes */}
          {detail && (
            <div>
              <div style={{ fontSize: "10px", color: "var(--oc-green-dim)", letterSpacing: "0.15em", marginBottom: "8px" }}>ISOTOPES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {detail.isotopes.map(iso => (
                  <div key={iso.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "3px" }}>
                    <span style={{ fontFamily: "var(--font-orbitron, monospace)", fontSize: "13px", color, minWidth: "28px" }}>{iso.mass}H</span>
                    <span style={{ fontSize: "12px", color: "var(--oc-text)", fontFamily: "var(--font-orbitron, monospace)", letterSpacing: "0.04em" }}>{iso.name}</span>
                    <span style={{
                      marginLeft: "auto", fontSize: "8px", padding: "2px 6px", borderRadius: "2px", letterSpacing: "0.08em",
                      background: iso.stable ? `rgba(${hexToRgb(color)},0.12)` : "rgba(255,100,80,0.12)",
                      border: `1px solid ${iso.stable ? `rgba(${hexToRgb(color)},0.3)` : "rgba(255,100,80,0.3)"}`,
                      color: iso.stable ? color : "#ff6450",
                    }}>
                      {iso.stable ? "STABLE" : "UNSTABLE"}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--oc-text-hint)", maxWidth: "160px", textAlign: "right" }}>{iso.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uses */}
          {detail && (
            <div>
              <div style={{ fontSize: "10px", color: "var(--oc-green-dim)", letterSpacing: "0.15em", marginBottom: "8px" }}>APPLICATIONS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {detail.uses.map(use => (
                  <span key={use} style={{
                    fontSize: "10px", padding: "4px 10px", letterSpacing: "0.06em",
                    background: `rgba(${hexToRgb(color)}, 0.08)`,
                    border: `1px solid rgba(${hexToRgb(color)}, 0.2)`,
                    color: "var(--oc-text-sub)", borderRadius: "2px",
                  }}>
                    {use}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fun facts */}
          {facts.length > 0 && (
            <div style={{ borderTop: "1px solid var(--oc-green-border-faint)", paddingTop: "16px" }}>
              <div style={{ fontSize: "10px", color: "var(--oc-green-dim)", letterSpacing: "0.15em", marginBottom: "10px" }}>FUN FACTS</div>
              {facts.map((fact, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <span style={{ color, flexShrink: 0, fontSize: "0.55rem", marginTop: "4px" }}>⬡</span>
                  <p style={{ fontSize: "13px", color: "var(--oc-text-muted)", lineHeight: 1.6, margin: 0 }}>{fact}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function AchievementsBoard() {
  const [hovered,  setHovered]  = useState<Element | null>(null);
  const [infoEl,   setInfoEl]   = useState<Element | null>(null);

  const active     = hovered;
  const unlockedEl = active && UNLOCKED.has(active.z) ? active : null;

  return (
    <div>
      {/* Infographic modal (click on desktop + tap on mobile) */}
      {infoEl && UNLOCKED.has(infoEl.z) && (
        <InfographicModal el={infoEl} onClose={() => setInfoEl(null)} />
      )}

      <div style={{ overflowX: "auto", paddingBottom: "1rem" }}>
        <div className="flex gap-4 items-start" style={{ minWidth: "600px" }}>

          {/* ── Grid ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(18, 1fr)",
              gridTemplateRows: "repeat(7, auto) 10px repeat(2, auto)",
              gap: "2px",
              width: "100%",
            }}>
              {/* f-block labels */}
              {([{ gridRow: 9, label: "57–71" }, { gridRow: 10, label: "89–103" }] as const).map(({ gridRow, label }) => (
                <div key={gridRow} style={{ gridColumn: "1 / 4", gridRow, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "4px" }}>
                  <span style={{ fontSize: "7px", color: "var(--oc-green-dim)", letterSpacing: "0.08em" }}>{label}</span>
                </div>
              ))}

              {ELEMENTS.map((el) =>
                UNLOCKED.has(el.z) ? (
                  <UnlockedCell
                    key={el.z}
                    el={el}
                    isActive={active?.z === el.z}
                    onEnter={() => setHovered(el)}
                    onLeave={() => setHovered(null)}
                    onClick={() => setInfoEl(el)}
                  />
                ) : (
                  <LockedCell key={el.z} el={el} />
                )
              )}
            </div>

            <p className="hidden lg:block text-xs mt-2 font-heading" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.1em", fontSize: "0.6rem" }}>
              ↑ HOVER TO PREVIEW  ·  CLICK FOR FULL INFO →
            </p>
          </div>

          {/* ── Detail panel (desktop) ── */}
          <div className="hidden lg:block flex-shrink-0" style={{ width: "280px" }}>
            {unlockedEl ? (
              <DetailPanel el={unlockedEl} />
            ) : (
              <div style={{
                width: "280px",
                height: "460px",
                border: "1px solid var(--oc-green-border-faint)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "8px",
              }}>
                <span style={{ fontSize: "1.5rem", opacity: 0.2 }}>⬡</span>
                <span style={{ fontSize: "9px", color: "var(--oc-green-dim)", letterSpacing: "0.15em", textAlign: "center" }}>
                  HOVER AN UNLOCKED<br />ELEMENT TO VIEW ITS ATOM
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px", marginTop: "12px" }}>
        {(Object.entries(CATEGORY_COLORS) as [string, string][]).map(([cat, color]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "1px", background: color, opacity: 0.7, flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: "var(--oc-text-muted)", letterSpacing: "0.08em" }}>
              {cat.replace(/-/g, " ").toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
