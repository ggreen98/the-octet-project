"use client";
import React, { useState } from "react";

type Cat = "h" | "ka" | "ae" | "tr" | "pm" | "md" | "nm" | "ha" | "ng" | "la" | "ac";
type Cell = { sym: string; cat: Cat } | null;
type HoverState = { cat: Cat; label: string; detail: string; x: number; y: number } | null;

const CAT_BG: Record<Cat, string> = {
  h:  "rgba(68,153,255,0.55)",
  ka: "rgba(249,115,22,0.65)",
  ae: "rgba(234,179,8,0.60)",
  tr: "rgba(68,153,255,0.35)",
  pm: "rgba(148,163,184,0.45)",
  md: "rgba(114,184,114,0.50)",
  nm: "rgba(34,211,238,0.45)",
  ha: "rgba(168,85,247,0.60)",
  ng: "rgba(232,121,249,0.50)",
  la: "rgba(251,146,60,0.45)",
  ac: "rgba(248,113,113,0.45)",
};

const CAT_BORDER: Record<Cat, string> = {
  h:  "rgba(68,153,255,0.8)",
  ka: "rgba(249,115,22,0.9)",
  ae: "rgba(234,179,8,0.85)",
  tr: "rgba(68,153,255,0.55)",
  pm: "rgba(148,163,184,0.7)",
  md: "rgba(114,184,114,0.75)",
  nm: "rgba(34,211,238,0.7)",
  ha: "rgba(168,85,247,0.85)",
  ng: "rgba(232,121,249,0.75)",
  la: "rgba(251,146,60,0.7)",
  ac: "rgba(248,113,113,0.7)",
};

const ROWS: Cell[][] = [
  [{sym:"H",cat:"h"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{sym:"He",cat:"ng"}],
  [{sym:"Li",cat:"ka"},{sym:"Be",cat:"ae"},null,null,null,null,null,null,null,null,null,null,{sym:"B",cat:"md"},{sym:"C",cat:"nm"},{sym:"N",cat:"nm"},{sym:"O",cat:"nm"},{sym:"F",cat:"ha"},{sym:"Ne",cat:"ng"}],
  [{sym:"Na",cat:"ka"},{sym:"Mg",cat:"ae"},null,null,null,null,null,null,null,null,null,null,{sym:"Al",cat:"pm"},{sym:"Si",cat:"md"},{sym:"P",cat:"nm"},{sym:"S",cat:"nm"},{sym:"Cl",cat:"ha"},{sym:"Ar",cat:"ng"}],
  [{sym:"K",cat:"ka"},{sym:"Ca",cat:"ae"},{sym:"Sc",cat:"tr"},{sym:"Ti",cat:"tr"},{sym:"V",cat:"tr"},{sym:"Cr",cat:"tr"},{sym:"Mn",cat:"tr"},{sym:"Fe",cat:"tr"},{sym:"Co",cat:"tr"},{sym:"Ni",cat:"tr"},{sym:"Cu",cat:"tr"},{sym:"Zn",cat:"tr"},{sym:"Ga",cat:"pm"},{sym:"Ge",cat:"md"},{sym:"As",cat:"md"},{sym:"Se",cat:"nm"},{sym:"Br",cat:"ha"},{sym:"Kr",cat:"ng"}],
  [{sym:"Rb",cat:"ka"},{sym:"Sr",cat:"ae"},{sym:"Y",cat:"tr"},{sym:"Zr",cat:"tr"},{sym:"Nb",cat:"tr"},{sym:"Mo",cat:"tr"},{sym:"Tc",cat:"tr"},{sym:"Ru",cat:"tr"},{sym:"Rh",cat:"tr"},{sym:"Pd",cat:"tr"},{sym:"Ag",cat:"tr"},{sym:"Cd",cat:"tr"},{sym:"In",cat:"pm"},{sym:"Sn",cat:"pm"},{sym:"Sb",cat:"md"},{sym:"Te",cat:"md"},{sym:"I",cat:"ha"},{sym:"Xe",cat:"ng"}],
  [{sym:"Cs",cat:"ka"},{sym:"Ba",cat:"ae"},{sym:"La*",cat:"la"},{sym:"Hf",cat:"tr"},{sym:"Ta",cat:"tr"},{sym:"W",cat:"tr"},{sym:"Re",cat:"tr"},{sym:"Os",cat:"tr"},{sym:"Ir",cat:"tr"},{sym:"Pt",cat:"tr"},{sym:"Au",cat:"tr"},{sym:"Hg",cat:"tr"},{sym:"Tl",cat:"pm"},{sym:"Pb",cat:"pm"},{sym:"Bi",cat:"pm"},{sym:"Po",cat:"md"},{sym:"At",cat:"ha"},{sym:"Rn",cat:"ng"}],
  [{sym:"Fr",cat:"ka"},{sym:"Ra",cat:"ae"},{sym:"Ac*",cat:"ac"},{sym:"Rf",cat:"tr"},{sym:"Db",cat:"tr"},{sym:"Sg",cat:"tr"},{sym:"Bh",cat:"tr"},{sym:"Hs",cat:"tr"},{sym:"Mt",cat:"tr"},{sym:"Ds",cat:"tr"},{sym:"Rg",cat:"tr"},{sym:"Cn",cat:"tr"},{sym:"Nh",cat:"pm"},{sym:"Fl",cat:"pm"},{sym:"Mc",cat:"pm"},{sym:"Lv",cat:"md"},{sym:"Ts",cat:"ha"},{sym:"Og",cat:"ng"}],
  [null,null,{sym:"La",cat:"la"},{sym:"Ce",cat:"la"},{sym:"Pr",cat:"la"},{sym:"Nd",cat:"la"},{sym:"Pm",cat:"la"},{sym:"Sm",cat:"la"},{sym:"Eu",cat:"la"},{sym:"Gd",cat:"la"},{sym:"Tb",cat:"la"},{sym:"Dy",cat:"la"},{sym:"Ho",cat:"la"},{sym:"Er",cat:"la"},{sym:"Tm",cat:"la"},{sym:"Yb",cat:"la"},{sym:"Lu",cat:"la"},null],
  [null,null,{sym:"Ac",cat:"ac"},{sym:"Th",cat:"ac"},{sym:"Pa",cat:"ac"},{sym:"U",cat:"ac"},{sym:"Np",cat:"ac"},{sym:"Pu",cat:"ac"},{sym:"Am",cat:"ac"},{sym:"Cm",cat:"ac"},{sym:"Bk",cat:"ac"},{sym:"Cf",cat:"ac"},{sym:"Es",cat:"ac"},{sym:"Fm",cat:"ac"},{sym:"Md",cat:"ac"},{sym:"No",cat:"ac"},{sym:"Lr",cat:"ac"},null],
];

const PERIOD_LABELS = ["1","2","3","4","5","6","7","",""];
const LEGEND: { cat: Cat; label: string; detail: string }[] = [
  { cat: "h",  label: "Hydrogen",              detail: "Unique — sits in group 1 but behaves like neither a metal nor a non-metal" },
  { cat: "ka", label: "Alkali Metals",          detail: "Group 1 (excl. H) · 1 valence electron · extremely reactive" },
  { cat: "ae", label: "Alkaline Earth Metals",  detail: "Group 2 · 2 valence electrons · reactive but less so than alkali metals" },
  { cat: "tr", label: "Transition Metals",      detail: "Groups 3–12 · d-block · hard, conductive, variable oxidation states" },
  { cat: "pm", label: "Post-transition Metals", detail: "Groups 13–15 · softer metals with higher electronegativities than transition metals" },
  { cat: "md", label: "Metalloids",             detail: "Borderline between metals and non-metals · include Si, Ge, As — important in semiconductors" },
  { cat: "nm", label: "Non-metals",             detail: "Groups 14–16 · high electronegativity · form covalent bonds" },
  { cat: "ha", label: "Halogens",               detail: "Group 17 · 7 valence electrons · most reactive non-metals · one electron from noble-gas config" },
  { cat: "ng", label: "Noble Gases",            detail: "Group 18 · full outer shell · essentially unreactive · used as inert reference points" },
  { cat: "la", label: "Lanthanides",            detail: "f-block · rare-earth metals · similar properties across the series" },
  { cat: "ac", label: "Actinides",              detail: "f-block · many are radioactive · include uranium and plutonium" },
];

// Width of the period-label column on the left of each row
const LABEL_W = 32;
const GAP = 2;
// CSS string used for every 18-column element grid — ensures identical column widths in header + all rows
const GRID_COLS = `repeat(18, 1fr)`;

export function PeriodicTableGroups() {
  const [hover, setHover] = useState<HoverState>(null);

  const handleEnter = (e: React.MouseEvent, cat: Cat) => {
    const info = LEGEND.find(l => l.cat === cat);
    if (info) setHover({ cat, label: info.label, detail: info.detail, x: e.clientX + 14, y: e.clientY - 10 });
  };
  const handleMove = (e: React.MouseEvent) => {
    setHover(prev => prev ? { ...prev, x: e.clientX + 14, y: e.clientY - 10 } : null);
  };
  const handleLeave = () => setHover(null);

  // Shared style for every element cell (null or filled) — grid handles column sizing
  const cellBase: React.CSSProperties = {
    aspectRatio: "1.05",
    minWidth: 0,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <>
      <div style={{
        border: "1px solid var(--oc-green-border-dim)",
        background: "var(--oc-green-bg-surface)",
        borderRadius: "4px",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid var(--oc-green-border-faint)" }}>
          <p className="font-heading" style={{ fontSize: "0.6rem", color: "var(--oc-text-dim)", letterSpacing: "0.14em" }}>
            {"// REFERENCE — all 118 elements · colour-coded by group type · * = f-block continues below · hover for details"}
          </p>
        </div>

        {/* Table */}
        <div style={{ padding: "10px 14px", overflowX: "auto" }}>
          <div style={{ minWidth: 520 }}>

            {/* Group number headers — same grid structure as each data row */}
            <div style={{ display: "flex", marginBottom: GAP }}>
              <div style={{ width: LABEL_W, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: GRID_COLS, gap: GAP }}>
                {Array.from({ length: 18 }, (_, i) => (
                  <div key={i} style={{
                    textAlign: "center",
                    fontSize: "0.65rem",
                    color: "var(--oc-text-faint)",
                    fontFamily: "inherit",
                    paddingBottom: 3,
                  }}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Period rows */}
            {ROWS.map((row, ri) => {
              const isFBlock = ri >= 7;
              return (
                <div key={ri}>
                  {ri === 7 && <div style={{ height: 6 }} />}
                  <div style={{ display: "flex", marginBottom: GAP, alignItems: "center" }}>

                    {/* Period / f-block label */}
                    <div style={{
                      width: LABEL_W, flexShrink: 0,
                      textAlign: "right", paddingRight: 5,
                      fontSize: "0.65rem",
                      color: isFBlock ? "var(--oc-text-faint)" : "var(--oc-green-dim)",
                      fontFamily: "inherit", letterSpacing: "0.05em",
                    }}>
                      {isFBlock ? (ri === 7 ? "6*" : "7*") : PERIOD_LABELS[ri]}
                    </div>

                    {/* Element cells — CSS grid guarantees identical column widths across all rows */}
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: GRID_COLS, gap: GAP }}>
                      {row.map((cell, ci) => {
                        if (!cell) return <div key={ci} style={cellBase} />;

                        const isHovered = hover?.cat === cell.cat;
                        return (
                          <div
                            key={ci}
                            title={cell.sym}
                            onMouseEnter={(e) => handleEnter(e, cell.cat)}
                            onMouseMove={handleMove}
                            onMouseLeave={handleLeave}
                            style={{
                              ...cellBase,
                              background: CAT_BG[cell.cat],
                              border: `1px solid ${CAT_BORDER[cell.cat]}`,
                              cursor: "default",
                              transition: "filter 0.1s",
                              filter: isHovered ? "brightness(1.4) saturate(1.2)" : undefined,
                            }}
                          >
                            <span style={{
                              fontSize: cell.sym.length > 2 ? "0.42rem" : "0.58rem",
                              color: "rgba(255,255,255,0.92)",
                              fontFamily: "inherit", fontWeight: 600, letterSpacing: 0,
                            }}>
                              {cell.sym}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{
          borderTop: "1px solid var(--oc-green-border-faint)",
          padding: "14px 14px 16px",
          display: "flex", flexDirection: "column", gap: 9,
        }}>
          <p className="font-heading" style={{ fontSize: "0.7rem", color: "var(--oc-text-dim)", letterSpacing: "0.14em", marginBottom: 2 }}>
            KEY
          </p>
          {LEGEND.map(({ cat, label, detail }) => {
            const isHovered = hover?.cat === cat;
            return (
              <div
                key={cat}
                style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "default" }}
                onMouseEnter={(e) => handleEnter(e, cat)}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
              >
                <div style={{
                  width: 16, height: 16, flexShrink: 0, borderRadius: 2, marginTop: 3,
                  background: CAT_BG[cat],
                  border: `1px solid ${CAT_BORDER[cat]}`,
                  transition: "filter 0.1s",
                  filter: isHovered ? "brightness(1.4) saturate(1.2)" : undefined,
                }} />
                <p style={{ margin: 0, lineHeight: 1.5 }}>
                  <span style={{
                    fontSize: "0.82rem",
                    color: isHovered ? "rgba(255,255,255,0.95)" : "var(--oc-text)",
                    fontFamily: "inherit", fontWeight: 600,
                    transition: "color 0.1s",
                  }}>
                    {label}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--oc-text-muted)", fontFamily: "inherit" }}>
                    {" — "}{detail}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frosted glass tooltip */}
      {hover && (
        <div
          style={{
            position: "fixed",
            left: hover.x,
            top: hover.y,
            zIndex: 9999,
            maxWidth: 280,
            background: "rgba(10, 20, 15, 0.55)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: `1px solid ${CAT_BORDER[hover.cat]}`,
            borderRadius: 6,
            padding: "9px 13px",
            pointerEvents: "none",
            boxShadow: "0 6px 28px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <div style={{
              width: 12, height: 12, borderRadius: 2, flexShrink: 0,
              background: CAT_BG[hover.cat],
              border: `1px solid ${CAT_BORDER[hover.cat]}`,
            }} />
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "rgba(255,255,255,0.95)", fontFamily: "inherit" }}>
              {hover.label}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "0.76rem", color: "rgba(255,255,255,0.68)", fontFamily: "inherit", lineHeight: 1.55 }}>
            {hover.detail}
          </p>
        </div>
      )}
    </>
  );
}
