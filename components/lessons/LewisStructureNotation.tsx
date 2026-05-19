"use client";

import { useState } from "react";

type Molecule = "H2" | "H2O" | "CO2" | "N2";

interface MolData {
  label: string;
  formula: string;
  structuralFormula: string;
  valenceElectrons: number;
  bondPairs: number;
  lonePairs: number;
  bondType: string;
  note: string;
}

const MOL_DATA: Record<Molecule, MolData> = {
  H2: {
    label: "H₂",
    formula: "H–H",
    structuralFormula: "H—H",
    valenceElectrons: 2,
    bondPairs: 1,
    lonePairs: 0,
    bondType: "Single bond",
    note: "The simplest molecule. Two hydrogen atoms share one pair to each reach 2 electrons (helium configuration). No lone pairs — every electron is involved in bonding.",
  },
  H2O: {
    label: "H₂O",
    formula: "H–O–H",
    structuralFormula: "H—O—H",
    valenceElectrons: 8,
    bondPairs: 2,
    lonePairs: 2,
    bondType: "Two single bonds",
    note: "Oxygen has 6 valence electrons. It uses 2 to bond with each hydrogen, leaving 4 non-bonding electrons (2 lone pairs). Those lone pairs push the H atoms downward, creating water's bent 104.5° shape.",
  },
  CO2: {
    label: "CO₂",
    formula: "O═C═O",
    structuralFormula: "O═C═O",
    valenceElectrons: 16,
    bondPairs: 4,
    lonePairs: 4,
    bondType: "Two double bonds",
    note: "Carbon needs 4 more electrons; each oxygen needs 2 more. The solution is a double bond on each side — carbon shares 2 pairs with each oxygen. Each oxygen also keeps 2 lone pairs. Despite its polar C═O bonds, CO₂ is linear and perfectly symmetric, so the dipole moments cancel — the molecule is nonpolar overall.",
  },
  N2: {
    label: "N₂",
    formula: "N≡N",
    structuralFormula: "N≡N",
    valenceElectrons: 10,
    bondPairs: 3,
    lonePairs: 2,
    bondType: "Triple bond",
    note: "Each nitrogen has 5 valence electrons. Sharing 3 pairs (6 electrons total) gives each atom a full octet — the strongest common covalent bond (945 kJ/mol). One lone pair remains on each nitrogen. This is why N₂ is so unreactive: breaking that triple bond requires enormous energy.",
  },
};

// ── SVG Lewis structures ──────────────────────────────────────────────────────

function H2Lewis({ mode }: { mode: "dots" | "lines" }) {
  const showDots = mode === "dots";
  const showLine = mode === "lines";
  return (
    <svg viewBox="0 0 200 80" width="100%" style={{ maxWidth: 260, display: "block", margin: "0 auto" }}>
      {/* H left */}
      <text x="52" y="46" textAnchor="middle" style={{ fontSize: "22px", fill: "#e2e8f0", fontFamily: "monospace", fontWeight: 700 }}>H</text>
      {/* H right */}
      <text x="148" y="46" textAnchor="middle" style={{ fontSize: "22px", fill: "#e2e8f0", fontFamily: "monospace", fontWeight: 700 }}>H</text>

      {/* Bond pair dots */}
      <g opacity={showDots ? 1 : 0} style={{ transition: "opacity 0.35s" }}>
        <circle cx="91" cy="40" r="3.5" fill="#ffd700" />
        <circle cx="109" cy="40" r="3.5" fill="#ffd700" />
      </g>

      {/* Bond line */}
      <line x1="72" y1="40" x2="128" y2="40"
        stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"
        opacity={showLine ? 1 : 0} style={{ transition: "opacity 0.35s" }} />
    </svg>
  );
}

function H2OLewis({ mode }: { mode: "dots" | "lines" }) {
  const showDots = mode === "dots";
  const showLine = mode === "lines";
  return (
    <svg viewBox="0 0 220 120" width="100%" style={{ maxWidth: 280, display: "block", margin: "0 auto" }}>
      {/* O center */}
      <text x="110" y="68" textAnchor="middle" style={{ fontSize: "22px", fill: "#ef4444", fontFamily: "monospace", fontWeight: 700 }}>O</text>
      {/* H left */}
      <text x="34" y="100" textAnchor="middle" style={{ fontSize: "22px", fill: "#e2e8f0", fontFamily: "monospace", fontWeight: 700 }}>H</text>
      {/* H right */}
      <text x="186" y="100" textAnchor="middle" style={{ fontSize: "22px", fill: "#e2e8f0", fontFamily: "monospace", fontWeight: 700 }}>H</text>

      {/* Lone pair dots on O (always visible, gray) */}
      <circle cx="96" cy="36" r="3" fill="#94a3b8" />
      <circle cx="124" cy="36" r="3" fill="#94a3b8" />
      <circle cx="88" cy="52" r="3" fill="#94a3b8" />
      <circle cx="132" cy="52" r="3" fill="#94a3b8" />

      {/* Bond pair dots left */}
      <g opacity={showDots ? 1 : 0} style={{ transition: "opacity 0.35s" }}>
        <circle cx="71" cy="79" r="3.5" fill="#ffd700" />
        <circle cx="81" cy="86" r="3.5" fill="#ffd700" />
        {/* Bond pair dots right */}
        <circle cx="139" cy="79" r="3.5" fill="#ffd700" />
        <circle cx="149" cy="86" r="3.5" fill="#ffd700" />
      </g>

      {/* Bond lines */}
      <g opacity={showLine ? 1 : 0} style={{ transition: "opacity 0.35s" }}>
        <line x1="97" y1="73" x2="52" y2="95" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="123" y1="73" x2="168" y2="95" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function CO2Lewis({ mode }: { mode: "dots" | "lines" }) {
  const showDots = mode === "dots";
  const showLine = mode === "lines";
  return (
    <svg viewBox="0 0 280 90" width="100%" style={{ maxWidth: 340, display: "block", margin: "0 auto" }}>
      {/* O left */}
      <text x="38" y="52" textAnchor="middle" style={{ fontSize: "22px", fill: "#ef4444", fontFamily: "monospace", fontWeight: 700 }}>O</text>
      {/* C center */}
      <text x="140" y="52" textAnchor="middle" style={{ fontSize: "22px", fill: "#94a3b8", fontFamily: "monospace", fontWeight: 700 }}>C</text>
      {/* O right */}
      <text x="242" y="52" textAnchor="middle" style={{ fontSize: "22px", fill: "#ef4444", fontFamily: "monospace", fontWeight: 700 }}>O</text>

      {/* Lone pairs on left O */}
      <circle cx="14" cy="38" r="3" fill="#94a3b8" />
      <circle cx="14" cy="52" r="3" fill="#94a3b8" />
      <circle cx="32" cy="24" r="3" fill="#94a3b8" />
      <circle cx="44" cy="24" r="3" fill="#94a3b8" />

      {/* Lone pairs on right O */}
      <circle cx="266" cy="38" r="3" fill="#94a3b8" />
      <circle cx="266" cy="52" r="3" fill="#94a3b8" />
      <circle cx="236" cy="24" r="3" fill="#94a3b8" />
      <circle cx="248" cy="24" r="3" fill="#94a3b8" />

      {/* Bond pair dots left double bond */}
      <g opacity={showDots ? 1 : 0} style={{ transition: "opacity 0.35s" }}>
        <circle cx="83" cy="38" r="3.5" fill="#ffd700" />
        <circle cx="97" cy="38" r="3.5" fill="#ffd700" />
        <circle cx="83" cy="56" r="3.5" fill="#ffd700" />
        <circle cx="97" cy="56" r="3.5" fill="#ffd700" />
        {/* Bond pair dots right double bond */}
        <circle cx="183" cy="38" r="3.5" fill="#ffd700" />
        <circle cx="197" cy="38" r="3.5" fill="#ffd700" />
        <circle cx="183" cy="56" r="3.5" fill="#ffd700" />
        <circle cx="197" cy="56" r="3.5" fill="#ffd700" />
      </g>

      {/* Bond lines left double bond */}
      <g opacity={showLine ? 1 : 0} style={{ transition: "opacity 0.35s" }}>
        <line x1="55" y1="40" x2="125" y2="40" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="55" y1="54" x2="125" y2="54" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        {/* Bond lines right double bond */}
        <line x1="155" y1="40" x2="225" y2="40" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="155" y1="54" x2="225" y2="54" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function N2Lewis({ mode }: { mode: "dots" | "lines" }) {
  const showDots = mode === "dots";
  const showLine = mode === "lines";
  return (
    <svg viewBox="0 0 220 80" width="100%" style={{ maxWidth: 280, display: "block", margin: "0 auto" }}>
      {/* N left */}
      <text x="52" y="48" textAnchor="middle" style={{ fontSize: "22px", fill: "#60a5fa", fontFamily: "monospace", fontWeight: 700 }}>N</text>
      {/* N right */}
      <text x="168" y="48" textAnchor="middle" style={{ fontSize: "22px", fill: "#60a5fa", fontFamily: "monospace", fontWeight: 700 }}>N</text>

      {/* Lone pair left N */}
      <circle cx="26" cy="40" r="3" fill="#94a3b8" />
      <circle cx="26" cy="52" r="3" fill="#94a3b8" />

      {/* Lone pair right N */}
      <circle cx="194" cy="40" r="3" fill="#94a3b8" />
      <circle cx="194" cy="52" r="3" fill="#94a3b8" />

      {/* Bond pair dots triple bond */}
      <g opacity={showDots ? 1 : 0} style={{ transition: "opacity 0.35s" }}>
        <circle cx="92"  cy="32" r="3.5" fill="#ffd700" />
        <circle cx="128" cy="32" r="3.5" fill="#ffd700" />
        <circle cx="92"  cy="44" r="3.5" fill="#ffd700" />
        <circle cx="128" cy="44" r="3.5" fill="#ffd700" />
        <circle cx="92"  cy="56" r="3.5" fill="#ffd700" />
        <circle cx="128" cy="56" r="3.5" fill="#ffd700" />
      </g>

      {/* Bond lines triple bond */}
      <g opacity={showLine ? 1 : 0} style={{ transition: "opacity 0.35s" }}>
        <line x1="70" y1="33" x2="150" y2="33" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="70" y1="44" x2="150" y2="44" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="70" y1="55" x2="150" y2="55" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const LEWIS_SVG: Record<Molecule, React.ComponentType<{ mode: "dots" | "lines" }>> = {
  H2: H2Lewis,
  H2O: H2OLewis,
  CO2: CO2Lewis,
  N2: N2Lewis,
};

// ── Main component ────────────────────────────────────────────────────────────

export function LewisStructureNotation() {
  const [mol, setMol] = useState<Molecule>("H2");
  const [mode, setMode] = useState<"dots" | "lines">("dots");
  const d = MOL_DATA[mol];
  const LewisSVG = LEWIS_SVG[mol];

  return (
    <div>
      {/* Molecule selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["H2", "H2O", "CO2", "N2"] as Molecule[]).map(m => (
          <button
            key={m}
            onClick={() => setMol(m)}
            className="font-heading text-xs px-4 py-2 transition-all duration-200"
            style={{
              border: mol === m ? "1px solid rgba(52,211,153,0.6)" : "1px solid rgba(52,211,153,0.2)",
              color:  mol === m ? "rgba(52,211,153,0.95)" : "rgba(52,211,153,0.45)",
              background: mol === m ? "rgba(52,211,153,0.08)" : "transparent",
              cursor: "pointer", letterSpacing: "0.12em", borderRadius: "4px",
            }}
          >
            {MOL_DATA[m].label}
          </button>
        ))}
      </div>

      {/* SVG canvas */}
      <div
        className="mb-4 py-6"
        style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", background: "rgba(0,0,0,0.25)" }}
      >
        <LewisSVG mode={mode} />

        {/* Legend */}
        <div className="flex justify-center gap-5 mt-3">
          <div className="flex items-center gap-2">
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffd700" }} />
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", letterSpacing: "0.06em" }}>
              BONDING PAIR
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#94a3b8" }} />
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", letterSpacing: "0.06em" }}>
              LONE PAIR
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ width: 20, height: 2.5, background: "#94a3b8", borderRadius: 2 }} />
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", letterSpacing: "0.06em" }}>
              BOND LINE
            </span>
          </div>
        </div>
      </div>

      {/* Notation toggle */}
      <div className="flex gap-2 mb-5">
        {(["dots", "lines"] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="font-heading text-xs px-5 py-2 transition-all duration-200"
            style={{
              border: mode === m ? "1px solid rgba(96,165,250,0.6)" : "1px solid rgba(96,165,250,0.2)",
              color:  mode === m ? "rgba(96,165,250,0.95)" : "rgba(96,165,250,0.45)",
              background: mode === m ? "rgba(96,165,250,0.08)" : "transparent",
              cursor: "pointer", letterSpacing: "0.14em", borderRadius: "4px",
            }}
          >
            {m === "dots" ? "DOT NOTATION" : "LINE NOTATION"}
          </button>
        ))}
        <span className="ml-auto self-center font-heading text-xs"
          style={{ color: "var(--oc-text-dim)", fontSize: "0.6rem", letterSpacing: "0.08em" }}>
          {mode === "dots" ? "each pair of dots = 2 electrons" : "each line = 1 shared pair"}
        </span>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 mb-5" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        <div className="p-3" style={{ border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.05)", borderRadius: "4px" }}>
          <p className="font-heading text-xs mb-1" style={{ color: "rgba(52,211,153,0.7)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
            VALENCE ELECTRONS
          </p>
          <p className="font-heading" style={{ color: "#34d399", fontSize: "1.3rem" }}>
            {d.valenceElectrons}
          </p>
          <p style={{ color: "var(--oc-text-dim)", fontSize: "0.62rem", fontFamily: "monospace" }}>total in structure</p>
        </div>
        <div className="p-3" style={{ border: "1px solid rgba(96,165,250,0.2)", background: "rgba(96,165,250,0.05)", borderRadius: "4px" }}>
          <p className="font-heading text-xs mb-1" style={{ color: "rgba(96,165,250,0.7)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
            BOND TYPE
          </p>
          <p className="font-heading" style={{ color: "#60a5fa", fontSize: "0.85rem", marginTop: "0.3rem" }}>
            {d.bondType.toUpperCase()}
          </p>
          <p style={{ color: "var(--oc-text-dim)", fontSize: "0.62rem", fontFamily: "monospace" }}>
            {d.bondPairs} bond pair{d.bondPairs !== 1 ? "s" : ""} · {d.lonePairs} lone pair{d.lonePairs !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", borderRadius: "4px" }}>
        <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
          {d.note}
        </p>
      </div>
    </div>
  );
}
