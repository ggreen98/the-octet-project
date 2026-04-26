"use client";

import { useState, useMemo } from "react";
import {
  ELEMENTS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  getElectronShells,
  getNeutrons,
  type Element,
} from "@/data/elements";
import { AtomViewerCanvas } from "@/components/molecules/AtomViewerCanvas";

// ─── Trend Config ──────────────────────────────────────────────────────────

type ViewMode = "general" | "radius" | "ionization" | "ionization2" | "electronegativity" | "affinity";

interface TrendConfig {
  label: string;
  unit: string;
  key: keyof Element;
  colorA: string; // low end
  colorB: string; // high end
  lowLabel: string;
  highLabel: string;
}

const TRENDS: Record<Exclude<ViewMode, "general">, TrendConfig> = {
  radius: {
    label: "ATOMIC RADIUS",
    unit: "pm",
    key: "radius",
    colorA: "#1a2a44",
    colorB: "#4499ff",
    lowLabel: "Smaller",
    highLabel: "Larger",
  },
  ionization: {
    label: "1ST IONIZATION ENERGY",
    unit: "kJ/mol",
    key: "ionization",
    colorA: "#1a3020",
    colorB: "#72b872",
    lowLabel: "Lower",
    highLabel: "Higher",
  },
  ionization2: {
    label: "2ND IONIZATION ENERGY",
    unit: "kJ/mol",
    key: "ionization2",
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
  affinity: {
    label: "ELECTRON AFFINITY",
    unit: "kJ/mol",
    key: "affinity",
    colorA: "#3a1a1a",
    colorB: "#f72585",
    lowLabel: "Lower",
    highLabel: "Higher",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Static orbital SVG decoration per cell ───────────────────────────────────

function CellOrbitals({ color }: { color: string }) {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18, pointerEvents: "none" }}
      viewBox="0 0 44 48"
    >
      <ellipse cx="22" cy="24" rx="10" ry="4"  fill="none" stroke={color} strokeWidth="0.5" />
      <ellipse cx="22" cy="24" rx="10" ry="4"  fill="none" stroke={color} strokeWidth="0.5" transform="rotate(60 22 24)" />
      <ellipse cx="22" cy="24" rx="10" ry="4"  fill="none" stroke={color} strokeWidth="0.5" transform="rotate(120 22 24)" />
      <circle  cx="22" cy="24" r="2"  fill={color} />
    </svg>
  );
}

// ─── Single element cell ───────────────────────────────────────────────────────

function ElementCell({
  el,
  isActive,
  onEnter,
  onLeave,
  onTap,
  mode,
  norm,
}: {
  el: Element;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onTap: () => void;
  mode: ViewMode;
  norm: number | null;
}) {
  const catColor = CATEGORY_COLORS[el.category];
  
  let bg = "rgba(114,184,114,0.02)";
  let borderColor = isActive ? catColor : "rgba(114,184,114,0.1)";
  let symbolColor = catColor;

  if (mode !== "general" && norm !== null) {
    const cfg = TRENDS[mode];
    bg = blendColor(cfg.colorA, cfg.colorB, norm);
    borderColor = isActive ? "white" : "rgba(255,255,255,0.1)";
    symbolColor = "white";
  } else if (isActive) {
    const [r, g, b] = hexToRgb(catColor);
    bg = `rgba(${r}, ${g}, ${b}, 0.12)`;
  }

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onTap}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "44 / 58",
        border: `1px solid ${borderColor}`,
        background: bg,
        borderRadius: "2px",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {mode === "general" && <CellOrbitals color={catColor} />}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "2px 2px 3px" }}>
        <span style={{ fontSize: "10px", color: mode === "general" ? "var(--oc-text-dim)" : "rgba(255,255,255,0.6)", lineHeight: 1, alignSelf: "flex-end", paddingRight: "2px" }}>
          {el.z}
        </span>
        <span style={{ fontSize: mode === "general" ? "21px" : "18px", fontFamily: "var(--font-heading, monospace)", color: symbolColor, lineHeight: 1, fontWeight: 600 }}>
          {el.symbol}
        </span>
        <span style={{ fontSize: "7px", color: mode === "general" ? "var(--oc-text-dim)" : "rgba(255,255,255,0.5)", lineHeight: 1, letterSpacing: "0.01em", opacity: 0.8 }}>
          {mode === "general" 
            ? el.mass.toFixed(el.mass < 100 ? 3 : 2)
            : el[TRENDS[mode].key] !== null ? `${el[TRENDS[mode].key]}` : "—"}
        </span>
      </div>
    </div>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function DetailPanel({ el }: { el: Element }) {
  const color   = CATEGORY_COLORS[el.category];
  const shells  = getElectronShells(el.z);
  const neutrons = getNeutrons(el);

  return (
    <div
      style={{
        width: "100%",
        border: `1px solid ${color}30`,
        background: "var(--oc-bg)",
        borderRadius: "4px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 3D atom */}
      <div style={{ height: "220px", position: "relative" }}>
        <AtomViewerCanvas z={el.z} />
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px", borderTop: `1px solid ${color}20` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "2.5rem", fontFamily: "var(--font-heading)", color, lineHeight: 1 }}>
            {el.symbol}
          </span>
          <span style={{ fontSize: "1rem", color: "var(--oc-text)", fontFamily: "var(--font-heading)", letterSpacing: "0.05em" }}>
            {el.name.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", marginTop: "10px" }}>
          {[
            ["ATOMIC №",  el.z],
            ["MASS",      el.mass + " u"],
            ["RADIUS",    el.radius ? el.radius + " pm" : "—"],
            ["ELECTRONEG.", el.electronegativity ?? "—"],
            ["1ST IONIZ.", el.ionization ? el.ionization + " kJ" : "—"],
            ["2ND IONIZ.", el.ionization2 ? el.ionization2 + " kJ" : "—"],
            ["AFFINITY",   el.affinity ? el.affinity + " kJ/mol" : "—"],
          ].map(([label, value]) => (
            <div key={label as string}>
              <div style={{ fontSize: "9px", color: "var(--oc-green-dim)", letterSpacing: "0.12em", marginBottom: "2px" }}>
                {label}
              </div>
              <div style={{ fontSize: "13px", color: "var(--oc-text)", fontFamily: "var(--font-heading)" }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "12px" }}>
          <div style={{ fontSize: "9px", color: "var(--oc-green-dim)", letterSpacing: "0.12em", marginBottom: "4px" }}>
            ELECTRON CONFIG
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {shells.map((count, i) => (
              <span key={i} style={{ fontSize: "11px", padding: "2px 5px", background: `rgba(${hexToRgb(color).join(",")}, 0.12)`, border: `1px solid ${color}30`, color, borderRadius: "2px", fontFamily: "var(--font-heading)" }}>
                {["K","L","M","N","O","P","Q"][i]}:{count}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "10px", display: "inline-block", fontSize: "11px", padding: "3px 8px", background: `rgba(${hexToRgb(color).join(",")}, 0.1)`, border: `1px solid ${color}30`, color, borderRadius: "2px", letterSpacing: "0.1em" }}>
          {CATEGORY_LABELS[el.category].toUpperCase()}
        </div>
      </div>
    </div>
  );
}

// ─── Periodic table grid ──────────────────────────────────────────────────────

function toGridRow(dataRow: number): number {
  return dataRow <= 7 ? dataRow : dataRow + 1;
}

function PeriodicGrid({
  active,
  onEnter,
  onLeave,
  onTap,
  mode,
  norms,
}: {
  active: Element | null;
  onEnter: (el: Element) => void;
  onLeave: () => void;
  onTap: (el: Element) => void;
  mode: ViewMode;
  norms: Map<number, number | null>;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(18, 1fr)",
        gridTemplateRows: "repeat(7, auto) 8px repeat(2, auto)",
        gap: "2px",
        width: "100%",
      }}
    >
      {ELEMENTS.map((el) => (
        <div
          key={el.z}
          style={{ gridColumn: el.col, gridRow: toGridRow(el.row) }}
        >
          <ElementCell
            el={el}
            isActive={active?.z === el.z}
            onEnter={() => onEnter(el)}
            onLeave={onLeave}
            onTap={() => onTap(el)}
            mode={mode}
            norm={norms.get(el.z) ?? null}
          />
        </div>
      ))}

      {([
        { gridRow: 9, label: "57–71" },
        { gridRow: 10, label: "89–103" },
      ] as const).map(({ gridRow, label }) => (
        <div
          key={gridRow}
          style={{
            gridColumn: "1 / 4",
            gridRow,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "4px",
          }}
        >
          <span style={{ fontSize: "7px", color: "var(--oc-green-dim)", letterSpacing: "0.08em" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Category legend ──────────────────────────────────────────────────────────

function Legend() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
      {(Object.entries(CATEGORY_COLORS) as [keyof typeof CATEGORY_COLORS, string][]).map(([cat, color]) => (
        <div key={cat} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "1px", background: color, opacity: 0.7, flexShrink: 0 }} />
          <span style={{ fontSize: "11px", color: "var(--oc-text-muted)", letterSpacing: "0.08em" }}>
            {CATEGORY_LABELS[cat].toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Trend Legend ─────────────────────────────────────────────────────────────

function TrendLegend({ config }: { config: TrendConfig }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
       <span style={{ fontSize: "10px", color: "var(--oc-text-dim)", fontFamily: "var(--font-heading)", letterSpacing: "0.1em" }}>
        {config.label} ({config.unit})
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "9px", color: "var(--oc-text-faint)" }}>{config.lowLabel}</span>
        <div style={{ width: "100px", height: "8px", borderRadius: "2px", background: `linear-gradient(to right, ${config.colorA}, ${config.colorB})`, border: "1px solid rgba(255,255,255,0.1)" }} />
        <span style={{ fontSize: "9px", color: "var(--oc-text-faint)" }}>{config.highLabel}</span>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PeriodicTableExplorer() {
  const [hovered, setHovered] = useState<Element | null>(null);
  const [tapped,  setTapped]  = useState<Element | null>(null);
  const [mode,    setMode]    = useState<ViewMode>("general");

  // hover takes priority on desktop; tap persists for mobile
  const active = hovered ?? tapped;

  function handleTap(el: Element) {
    setTapped(prev => prev?.z === el.z ? null : el);
  }

  // Precompute normalization map for current mode
  const norms = useMemo(() => {
    const map = new Map<number, number | null>();
    if (mode === "general") return map;

    const cfg = TRENDS[mode];
    const vals = ELEMENTS.map(el => el[cfg.key] as number | null).filter((v): v is number => v !== null);
    const min = Math.min(...vals);
    const max = Math.max(...vals);

    ELEMENTS.forEach(el => {
      const v = el[cfg.key] as number | null;
      map.set(el.z, v !== null ? (v - min) / (max - min) : null);
    });
    return map;
  }, [mode]);

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)" }}>
            // INTERACTIVE — PERIODIC TABLE
          </p>
          <div className="flex gap-2 flex-wrap">
            {(["general", "radius", "ionization", "ionization2", "electronegativity", "affinity"] as ViewMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="font-heading text-[10px] px-3 py-1.5 border transition-all"
                style={{
                  letterSpacing: "0.1em",
                  background: mode === m ? "var(--oc-green-badge)" : "transparent",
                  borderColor: mode === m ? "var(--oc-green)" : "var(--oc-green-border-dim)",
                  color: mode === m ? "var(--oc-green)" : "var(--oc-text-dim)",
                }}
              >
                {m === "general" ? "CATEGORIES" : TRENDS[m].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === "general" ? <Legend /> : <TrendLegend config={TRENDS[mode]} />}

      {/* Mobile scroll hint */}
      <p className="lg:hidden text-xs mb-3 font-heading" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.1em", fontSize: "0.6rem" }}>
        ← SCROLL TO EXPLORE · TAP AN ELEMENT TO VIEW IT →
      </p>

      {/* Mobile modal — shown when an element is tapped, hidden on desktop */}
      {tapped && (
        <div
          className="lg:hidden fixed inset-0 z-[200] flex items-center justify-center p-5"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={() => setTapped(null)}
        >
          <div
            style={{ width: "100%", maxWidth: "340px" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close hint */}
            <p className="font-heading text-center mb-2" style={{ color: "var(--oc-text-hint)", fontSize: "0.55rem", letterSpacing: "0.15em" }}>
              TAP OUTSIDE TO CLOSE
            </p>
            <DetailPanel el={tapped} />
          </div>
        </div>
      )}

      {/* Table + desktop detail panel */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">

        {/* Table — horizontally scrollable on mobile, fills remaining space on desktop */}
        <div className="w-full lg:flex-1 lg:min-w-0 overflow-x-auto">
          <div style={{ minWidth: "700px" }}>
            <PeriodicGrid
              active={active}
              onEnter={el => setHovered(el)}
              onLeave={() => setHovered(null)}
              onTap={handleTap}
              mode={mode}
              norms={norms}
            />
          </div>
          {/* Desktop hover hint */}
          <p className="hidden lg:block text-xs mt-2 font-heading" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.1em", fontSize: "0.6rem" }}>
            ↑ HOVER AN ELEMENT TO VIEW ITS ATOM →
          </p>
        </div>

        {/* Desktop-only detail panel */}
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          {active ? (
            <DetailPanel el={active} />
          ) : (
            <div
              style={{
                width: "280px",
                height: "460px",
                border: "1px solid var(--oc-green-border-faint)",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "1.5rem", opacity: 0.2 }}>⬡</span>
              <span style={{ fontSize: "9px", color: "var(--oc-green-dim)", letterSpacing: "0.15em", textAlign: "center" }}>
                HOVER AN ELEMENT<br />TO VIEW ITS ATOM
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
