"use client";

// Electronegativity values sourced from the Pauling scale via WebElements (webelements.com)
// and cross-referenced with Chemistry LibreTexts. Values: H=2.20, C=2.55, O=3.44,
// F=3.98, Na=0.93, Cl=3.16, Li=0.98.

import { useState } from "react";

interface BondExample {
  label: string;
  atoms: string;
  deltaEN: number; // precise Pauling-scale value
  zone: "NONPOLAR" | "POLAR COVALENT" | "IONIC";
  zoneColor: string;
  borderline?: boolean; // true for bonds that technically cross a threshold but behave otherwise
  description: string;
}

// Sorted by ΔEN ascending so markers appear left-to-right on the spectrum.
const EXAMPLES: BondExample[] = [
  {
    label: "H–H",
    atoms: "Hydrogen + Hydrogen",
    deltaEN: 0.00, // |2.20 − 2.20|
    zone: "NONPOLAR",
    zoneColor: "#34d399",
    description:
      "Identical atoms, identical electronegativity (both EN = 2.20). The shared electrons sit exactly in the middle — neither atom pulls harder. A perfectly nonpolar covalent bond.",
  },
  {
    label: "C–H",
    atoms: "Carbon + Hydrogen",
    deltaEN: 0.35, // |2.55 − 2.20|
    zone: "NONPOLAR",
    zoneColor: "#34d399",
    description:
      "Carbon (EN = 2.55) is slightly more electronegative than hydrogen (EN = 2.20), but ΔEN = 0.35 falls well below the 0.5 nonpolar threshold. C–H bonds are treated as nonpolar in practice — hydrocarbons like methane (CH₄) and ethane (C₂H₆) are built entirely from them.",
  },
  {
    label: "H–Cl",
    atoms: "Hydrogen + Chlorine",
    deltaEN: 0.96, // |3.16 − 2.20|
    zone: "POLAR COVALENT",
    zoneColor: "#a855f7",
    description:
      "Chlorine (EN = 3.16) pulls the shared electrons noticeably toward itself, creating a partial negative charge (δ⁻) on Cl and a partial positive charge (δ⁺) on H. ΔEN = 0.96 sits comfortably in the polar covalent range.",
  },
  {
    label: "O–H",
    atoms: "Oxygen + Hydrogen",
    deltaEN: 1.24, // |3.44 − 2.20|
    zone: "POLAR COVALENT",
    zoneColor: "#a855f7",
    description:
      "The O–H bond is the defining bond in water (H₂O) and alcohols. Oxygen (EN = 3.44) pulls the shared electrons strongly toward itself — ΔEN = 1.24 makes this a strongly polar covalent bond. Its dipole moment is μ = 1.51 D, meaning there is significant charge separation: the O end is δ⁻ and the H end is δ⁺. This polarity (the unequal charge distribution) is why water dissolves ionic compounds and has a much higher boiling point than you would expect for such a small molecule.",
  },
  {
    label: "H–F",
    atoms: "Hydrogen + Fluorine",
    deltaEN: 1.78, // |3.98 − 2.20|
    zone: "POLAR COVALENT",
    zoneColor: "#a855f7",
    borderline: true,
    description:
      "H–F (ΔEN = 1.78) is chemistry's most famous exception to the Pauling cutoff. It technically exceeds the 1.7 ionic threshold — yet hydrogen fluoride exists as a covalent gas and liquid, not an ionic solid. Fluorine (EN = 3.98) is so small and electronegative that it pulls electrons toward itself without fully transferring them. HF is classified as strongly polar covalent and holds the record for the largest dipole moment among the hydrogen halides: μ = 1.86 D. (The dipole moment is the measurable strength of the charge separation — larger μ means more distance between δ⁺ and δ⁻.)",
  },
  {
    label: "Na–Cl",
    atoms: "Sodium + Chlorine",
    deltaEN: 2.23, // |3.16 − 0.93|
    zone: "IONIC",
    zoneColor: "#f87171",
    description:
      "ΔEN = 2.23 far exceeds the ionic threshold. Chlorine pulls the electron completely away from sodium rather than sharing it — forming Na⁺ and Cl⁻ ions held together by electrostatic attraction. This is the ionic bond from lesson 3.1, and NaCl (table salt) is the classic ionic compound.",
  },
  {
    label: "Li–F",
    atoms: "Lithium + Fluorine",
    deltaEN: 3.00, // |3.98 − 0.98|
    zone: "IONIC",
    zoneColor: "#ef4444",
    description:
      "ΔEN = 3.00 is one of the largest electronegativity differences achievable between real elements. Fluorine (EN = 3.98) takes the electron from lithium (EN = 0.98) almost completely. Li⁺ and F⁻ are held together by pure electrostatic attraction — a highly ionic bond with virtually no covalent character.",
  },
];

// Map ΔEN (0–3.5) → SVG x-coordinate within [40, 360]
function enToX(deltaEN: number) {
  return 40 + (deltaEN / 3.5) * 320;
}

const NONPOLAR_END = 0.5;
const POLAR_END    = 1.7;

export function PolarityExplorer() {
  const [selected, setSelected] = useState(0);
  const ex = EXAMPLES[selected];

  return (
    <div>
      <p className="font-heading text-xs mb-4" style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.72rem" }}>
        POLARITY SPECTRUM — CLICK A BOND
      </p>

      {/* SVG spectrum */}
      <div style={{ overflowX: "auto" }}>
        <svg viewBox="0 0 400 136" width="100%" style={{ display: "block", minWidth: "320px" }}>
          <defs>
            <linearGradient id="specGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#34d399" stopOpacity="0.7" />
              <stop offset="40%"  stopColor="#a855f7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Spectrum bar */}
          <rect x="40" y="48" width="320" height="10" rx="5" fill="url(#specGrad)" />

          {/* Zone divider lines */}
          <line x1={enToX(NONPOLAR_END)} y1="44" x2={enToX(NONPOLAR_END)} y2="62"
            stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1={enToX(POLAR_END)} y1="44" x2={enToX(POLAR_END)} y2="62"
            stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="2,2" />

          {/* Zone labels (above bar) */}
          <text x={enToX(NONPOLAR_END / 2)} y="34" textAnchor="middle"
            style={{ fontSize: "7.5px", fill: "#34d399", fontFamily: "monospace", letterSpacing: "0.08em" }}>
            NONPOLAR
          </text>
          <text x={enToX(NONPOLAR_END / 2)} y="43" textAnchor="middle"
            style={{ fontSize: "6.5px", fill: "rgba(52,211,153,0.55)", fontFamily: "monospace" }}>
            ΔEN &lt; 0.5
          </text>

          <text x={enToX((NONPOLAR_END + POLAR_END) / 2)} y="34" textAnchor="middle"
            style={{ fontSize: "7.5px", fill: "#a855f7", fontFamily: "monospace", letterSpacing: "0.08em" }}>
            POLAR COVALENT
          </text>
          <text x={enToX((NONPOLAR_END + POLAR_END) / 2)} y="43" textAnchor="middle"
            style={{ fontSize: "6.5px", fill: "rgba(168,85,247,0.55)", fontFamily: "monospace" }}>
            0.5 – 1.7
          </text>

          <text x={enToX((POLAR_END + 3.5) / 2)} y="34" textAnchor="middle"
            style={{ fontSize: "7.5px", fill: "#f87171", fontFamily: "monospace", letterSpacing: "0.08em" }}>
            IONIC
          </text>
          <text x={enToX((POLAR_END + 3.5) / 2)} y="43" textAnchor="middle"
            style={{ fontSize: "6.5px", fill: "rgba(248,113,113,0.55)", fontFamily: "monospace" }}>
            &gt; 1.7
          </text>

          {/* Bond markers */}
          {EXAMPLES.map((e, i) => {
            const x   = enToX(e.deltaEN);
            const sel = i === selected;
            const col = sel ? e.zoneColor : "rgba(255,255,255,0.32)";
            return (
              <g key={i} onClick={() => setSelected(i)} style={{ cursor: "pointer" }}>
                <line x1={x} y1="60" x2={x} y2={sel ? 74 : 76}
                  stroke={col} strokeWidth={sel ? 2 : 1} />

                {/* Borderline marker gets a diamond instead of a circle */}
                {e.borderline ? (
                  <polygon
                    points={`${x},${sel ? 53 : 55} ${x + (sel ? 6 : 4.5)},60 ${x},${sel ? 67 : 65} ${x - (sel ? 6 : 4.5)},60`}
                    fill={sel ? e.zoneColor : "rgba(255,255,255,0.35)"}
                    stroke={sel ? "rgba(255,255,255,0.35)" : "transparent"}
                    strokeWidth="1.5"
                  />
                ) : (
                  <circle cx={x} cy="60" r={sel ? 6 : 4}
                    fill={sel ? e.zoneColor : "rgba(255,255,255,0.35)"}
                    stroke={sel ? "rgba(255,255,255,0.3)" : "transparent"}
                    strokeWidth="1.5" />
                )}

                {/* Bond label */}
                <text x={x} y={sel ? 89 : 91} textAnchor="middle"
                  style={{ fontSize: sel ? "8.5px" : "7.5px", fill: sel ? e.zoneColor : "rgba(255,255,255,0.42)", fontFamily: "monospace", fontWeight: sel ? 700 : 400 }}>
                  {e.label}
                </text>

                {/* ΔEN value */}
                <text x={x} y="103" textAnchor="middle"
                  style={{ fontSize: "6.5px", fill: sel ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.22)", fontFamily: "monospace" }}>
                  {e.deltaEN.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* X-axis label */}
          <text x="200" y="122" textAnchor="middle"
            style={{ fontSize: "6.5px", fill: "rgba(255,255,255,0.22)", fontFamily: "monospace", letterSpacing: "0.1em" }}>
            ELECTRONEGATIVITY DIFFERENCE (ΔEN) →
          </text>

          {/* Source attribution */}
          <text x="200" y="133" textAnchor="middle"
            style={{ fontSize: "5.5px", fill: "rgba(255,255,255,0.18)", fontFamily: "monospace" }}>
            EN values: Pauling scale · WebElements / RSC
          </text>
        </svg>
      </div>

      {/* Detail card */}
      <div
        className="mt-2 p-4"
        style={{
          border: `1px solid ${ex.zoneColor}40`,
          background: `${ex.zoneColor}09`,
          borderRadius: "4px",
          transition: "border-color 0.2s, background 0.2s",
        }}
      >
        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <span className="font-heading" style={{ fontSize: "1rem", color: ex.zoneColor, letterSpacing: "0.05em" }}>
            {ex.label}
          </span>
          <span className="font-heading text-xs" style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.65rem", letterSpacing: "0.08em" }}>
            {ex.atoms}
          </span>
          <span className="font-heading text-xs ml-auto" style={{ color: ex.zoneColor, fontSize: "0.65rem", letterSpacing: "0.1em", opacity: 0.85 }}>
            ΔEN = {ex.deltaEN.toFixed(2)} · {ex.borderline ? "BORDERLINE*" : ex.zone}
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
          {ex.description}
        </p>
        {ex.borderline && (
          <p className="text-xs mt-3" style={{ color: "rgba(168,85,247,0.65)", fontFamily: "monospace", letterSpacing: "0.06em" }}>
            * ΔEN = 1.78 exceeds the 1.7 threshold, but HF exists as a covalent compound (gas/liquid), not an ionic solid. The 1.7 cutoff is a rough guideline — bonding character is a continuum.
          </p>
        )}
      </div>
    </div>
  );
}
