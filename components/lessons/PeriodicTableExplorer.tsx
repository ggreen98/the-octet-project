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
  isHovered,
  onEnter,
  onLeave,
}: {
  el: Element;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const color = CATEGORY_COLORS[el.category];

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "44 / 58",
        border: `1px solid ${isHovered ? color : "rgba(114,184,114,0.1)"}`,
        background: isHovered
          ? `rgba(${hexToRgb(color)}, 0.12)`
          : "rgba(114,184,114,0.02)",
        borderRadius: "2px",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <CellOrbitals color={color} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "2px 2px 3px" }}>
        <span style={{ fontSize: "13px", color: "var(--oc-text-dim)", lineHeight: 1, alignSelf: "flex-end", paddingRight: "2px" }}>
          {el.z}
        </span>
        <span style={{ fontSize: "21px", fontFamily: "var(--font-heading, monospace)", color, lineHeight: 1, fontWeight: 600 }}>
          {el.symbol}
        </span>
        <span style={{ fontSize: "8.5px", color: "var(--oc-text-dim)", lineHeight: 1, letterSpacing: "0.01em", opacity: 0.8 }}>
          {el.mass.toFixed(el.mass < 10 ? 3 : el.mass < 100 ? 3 : 2)}
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
        width: "280px",
        flexShrink: 0,
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
            ["PROTONS",   el.z],
            ["NEUTRONS",  neutrons],
            ["ELECTRONS", el.z],
            ["SHELLS",    shells.length],
          ].map(([label, value]) => (
            <div key={label as string}>
              <div style={{ fontSize: "11px", color: "var(--oc-green-dim)", letterSpacing: "0.12em", marginBottom: "2px" }}>
                {label}
              </div>
              <div style={{ fontSize: "15px", color: "var(--oc-text)", fontFamily: "var(--font-heading)" }}>
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
              <span key={i} style={{ fontSize: "13px", padding: "2px 6px", background: `rgba(${hexToRgb(color)}, 0.12)`, border: `1px solid ${color}30`, color, borderRadius: "2px", fontFamily: "var(--font-heading)" }}>
                {["K","L","M","N","O","P","Q"][i]}:{count}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "10px", display: "inline-block", fontSize: "12px", padding: "3px 8px", background: `rgba(${hexToRgb(color)}, 0.1)`, border: `1px solid ${color}30`, color, borderRadius: "2px", letterSpacing: "0.1em" }}>
          {CATEGORY_LABELS[el.category].toUpperCase()}
        </div>
      </div>
    </div>
  );
}

// ─── Periodic table grid ──────────────────────────────────────────────────────

// dataRow → CSS grid row (row 8 is a spacer, so f-block shifts down by 1)
function toGridRow(dataRow: number): number {
  return dataRow <= 7 ? dataRow : dataRow + 1;
}

function PeriodicGrid({
  hovered,
  onEnter,
  onLeave,
}: {
  hovered: Element | null;
  onEnter: (el: Element) => void;
  onLeave: () => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(18, 1fr)",
        // rows 1-7 main, row 8 spacer, rows 9-10 f-block
        gridTemplateRows: "repeat(7, auto) 10px repeat(2, auto)",
        gap: "2px",
        width: "100%",
      }}
    >
      {/* All elements */}
      {ELEMENTS.map((el) => (
        <div
          key={el.z}
          style={{ gridColumn: el.col, gridRow: toGridRow(el.row) }}
        >
          <ElementCell
            el={el}
            isHovered={hovered?.z === el.z}
            onEnter={() => onEnter(el)}
            onLeave={onLeave}
          />
        </div>
      ))}

      {/* f-block row labels — sit in the first 3 columns of rows 9 & 10 */}
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
          <span style={{ fontSize: "12px", color: "var(--oc-text-muted)", letterSpacing: "0.08em" }}>
            {CATEGORY_LABELS[cat].toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PeriodicTableExplorer() {
  const [hovered, setHovered] = useState<Element | null>(null);

  return (
    <div className="mb-12">
      <p className="text-xs tracking-widest mb-4" style={{ color: "var(--oc-green-dim)" }}>
        // INTERACTIVE — PERIODIC TABLE OF ELEMENTS
      </p>

      <Legend />

      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* Table — fills remaining space, min-width:0 allows shrinking */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <PeriodicGrid
            hovered={hovered}
            onEnter={setHovered}
            onLeave={() => setHovered(null)}
          />
        </div>

        {/* Detail panel — only visible on hover */}
        <div style={{ width: "260px", flexShrink: 0, minHeight: "460px" }}>
          {hovered ? (
            <DetailPanel el={hovered} />
          ) : (
            <div
              style={{
                width: "260px",
                height: "100%",
                minHeight: "460px",
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

// ─── Util ─────────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
