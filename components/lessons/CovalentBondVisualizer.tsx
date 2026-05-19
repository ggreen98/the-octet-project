"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Mol } from "./CovalentBond3D";

const CovalentBond3D = dynamic(() => import("./CovalentBond3D"), { ssr: false });

// ── Per-molecule display data ─────────────────────────────────────────────────

const MOL_DATA: Record<Mol, {
  label: string;
  sublabel: string;
  bondType: string;
  polarity: string;
  polarityColor: string;
  deltaEN: string;
  step0Text: string;
  step1Text: string;
}> = {
  H2: {
    label: "H₂", sublabel: "Hydrogen gas",
    bondType: "SINGLE BOND", polarity: "NONPOLAR", polarityColor: "#34d399", deltaEN: "0.0",
    step0Text:
      "Both hydrogen atoms have 1 valence electron each. Their electronegativities are identical — neither atom can pull harder than the other. Drag to rotate the scene.",
    step1Text:
      "The electron density sits exactly between both atoms, belonging equally to both hydrogens. No partial charges develop — this is a perfectly nonpolar covalent bond.",
  },
  HCl: {
    label: "HCl", sublabel: "Hydrochloric acid",
    bondType: "SINGLE BOND", polarity: "POLAR", polarityColor: "#a855f7", deltaEN: "0.9",
    step0Text:
      "Hydrogen has 1 valence electron; chlorine has 7. Both are short of a full shell, so they share. But chlorine's electronegativity (3.16) far exceeds hydrogen's (2.20). Drag to explore.",
    step1Text:
      "The electron density cloud is shifted toward chlorine. The shared electrons spend more time near Cl (δ⁻), leaving H with a partial positive charge (δ⁺). This is a polar covalent bond.",
  },
  O2: {
    label: "O₂", sublabel: "Oxygen gas",
    bondType: "DOUBLE BOND", polarity: "NONPOLAR", polarityColor: "#60a5fa", deltaEN: "0.0",
    step0Text:
      "Each oxygen atom has 6 valence electrons and needs 2 more to complete its octet. A single bond (1 shared pair) isn't enough for either atom — so each contributes 2 electrons. Drag to rotate.",
    step1Text:
      "Four electrons are shared: the sigma bond (central lobe along the axis) and the pi bond (two lobes above and below). Both density regions belong equally to both oxygens — nonpolar double bond.",
  },
};

// ── Lewis dot SVGs ────────────────────────────────────────────────────────────

const DOT_R  = 4;
const LONE_R = 3.8;

function H2Lewis() {
  return (
    <svg viewBox="0 0 300 120" width="100%" style={{ maxWidth: "380px" }}>
      {/* Left H */}
      <text x={80} y={66} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: "28px", fill: "#c0c0c0", fontFamily: "monospace", fontWeight: 700 }}>H</text>

      {/* Bond pair (two dots) */}
      <circle cx={138} cy={60} r={DOT_R} fill="#ffd700" />
      <circle cx={150} cy={60} r={DOT_R} fill="#ffd700" />

      {/* Right H */}
      <text x={208} y={66} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: "28px", fill: "#c0c0c0", fontFamily: "monospace", fontWeight: 700 }}>H</text>

      {/* Label */}
      <text x={150} y={102} textAnchor="middle"
        style={{ fontSize: "10px", fill: "rgba(52,211,153,0.7)", letterSpacing: "0.1em", fontFamily: "monospace" }}>
        H:H — NONPOLAR · ΔEN = 0.0
      </text>

      {/* Annotation: shared pair */}
      <line x1={144} y1={48} x2={144} y2={36} stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
      <text x={144} y={28} textAnchor="middle"
        style={{ fontSize: "8px", fill: "rgba(255,215,0,0.6)", fontFamily: "monospace" }}>
        BOND PAIR
      </text>
    </svg>
  );
}

function HClLewis() {
  const CLX = 210, CLY = 62;
  return (
    <svg viewBox="0 0 340 140" width="100%" style={{ maxWidth: "420px" }}>
      {/* H */}
      <text x={70} y={68} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: "26px", fill: "#c0c0c0", fontFamily: "monospace", fontWeight: 700 }}>H</text>

      {/* Bond pair */}
      <circle cx={120} cy={62} r={DOT_R} fill="#ffd700" />
      <circle cx={132} cy={62} r={DOT_R} fill="#ffd700" />

      {/* Cl circle (faint) */}
      <circle cx={CLX} cy={CLY} r={34} fill="rgba(102,187,102,0.07)" stroke="rgba(102,187,102,0.25)" strokeWidth="1" />
      <text x={CLX} y={CLY} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: "24px", fill: "#66bb66", fontFamily: "monospace", fontWeight: 700 }}>Cl</text>

      {/* 3 lone pairs on Cl */}
      {/* top */}
      <circle cx={CLX - 6} cy={CLY - 38} r={LONE_R} fill="rgba(200,200,200,0.7)" />
      <circle cx={CLX + 6} cy={CLY - 38} r={LONE_R} fill="rgba(200,200,200,0.7)" />
      {/* right */}
      <circle cx={CLX + 38} cy={CLY - 5} r={LONE_R} fill="rgba(200,200,200,0.7)" />
      <circle cx={CLX + 38} cy={CLY + 5} r={LONE_R} fill="rgba(200,200,200,0.7)" />
      {/* bottom */}
      <circle cx={CLX - 6} cy={CLY + 38} r={LONE_R} fill="rgba(200,200,200,0.7)" />
      <circle cx={CLX + 6} cy={CLY + 38} r={LONE_R} fill="rgba(200,200,200,0.7)" />

      {/* δ labels */}
      <text x={70} y={36} textAnchor="middle"
        style={{ fontSize: "11px", fill: "#60a5fa", fontFamily: "monospace", fontWeight: 600 }}>δ⁺</text>
      <text x={CLX} y={20} textAnchor="middle"
        style={{ fontSize: "11px", fill: "#a855f7", fontFamily: "monospace", fontWeight: 600 }}>δ⁻</text>

      {/* Label */}
      <text x={165} y={120} textAnchor="middle"
        style={{ fontSize: "10px", fill: "rgba(168,85,247,0.7)", letterSpacing: "0.08em", fontFamily: "monospace" }}>
        H:Cl — POLAR · ΔEN = 0.9
      </text>

      {/* Lone pair note */}
      <text x={CLX + 62} y={62} textAnchor="start"
        style={{ fontSize: "7.5px", fill: "rgba(200,200,200,0.4)", fontFamily: "monospace" }}>
        3 LONE
      </text>
      <text x={CLX + 62} y={72} textAnchor="start"
        style={{ fontSize: "7.5px", fill: "rgba(200,200,200,0.4)", fontFamily: "monospace" }}>
        PAIRS
      </text>
    </svg>
  );
}

function O2Lewis() {
  const LOX = 100, ROX = 230, OY = 70;
  return (
    <svg viewBox="0 0 340 150" width="100%" style={{ maxWidth: "420px" }}>
      {/* Left O circle */}
      <circle cx={LOX} cy={OY} r={32} fill="rgba(255,102,85,0.07)" stroke="rgba(255,102,85,0.22)" strokeWidth="1" />
      <text x={LOX} y={OY} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: "22px", fill: "#ff6655", fontFamily: "monospace", fontWeight: 700 }}>O</text>

      {/* Left O — 2 lone pairs (top + left) */}
      <circle cx={LOX - 6} cy={LOX - 34}  r={LONE_R} fill="rgba(200,200,200,0.7)" />
      <circle cx={LOX + 6} cy={LOX - 34}  r={LONE_R} fill="rgba(200,200,200,0.7)" />
      <circle cx={LOX - 38} cy={OY - 5} r={LONE_R} fill="rgba(200,200,200,0.7)" />
      <circle cx={LOX - 38} cy={OY + 5} r={LONE_R} fill="rgba(200,200,200,0.7)" />

      {/* Double bond — two pairs of dots */}
      {/* Upper pair */}
      <circle cx={154} cy={63} r={DOT_R} fill="#ffd700" />
      <circle cx={166} cy={63} r={DOT_R} fill="#ffd700" />
      {/* Lower pair */}
      <circle cx={154} cy={77} r={DOT_R} fill="#ffd700" />
      <circle cx={166} cy={77} r={DOT_R} fill="#ffd700" />

      {/* Double bond label */}
      <text x={160} y={46} textAnchor="middle"
        style={{ fontSize: "8px", fill: "rgba(255,215,0,0.55)", fontFamily: "monospace" }}>
        DOUBLE
      </text>
      <text x={160} y={56} textAnchor="middle"
        style={{ fontSize: "8px", fill: "rgba(255,215,0,0.55)", fontFamily: "monospace" }}>
        BOND PAIR
      </text>

      {/* Right O circle */}
      <circle cx={ROX} cy={OY} r={32} fill="rgba(255,102,85,0.07)" stroke="rgba(255,102,85,0.22)" strokeWidth="1" />
      <text x={ROX} y={OY} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: "22px", fill: "#ff6655", fontFamily: "monospace", fontWeight: 700 }}>O</text>

      {/* Right O — 2 lone pairs (top + right) */}
      <circle cx={ROX - 6} cy={OY - 36} r={LONE_R} fill="rgba(200,200,200,0.7)" />
      <circle cx={ROX + 6} cy={OY - 36} r={LONE_R} fill="rgba(200,200,200,0.7)" />
      <circle cx={ROX + 38} cy={OY - 5} r={LONE_R} fill="rgba(200,200,200,0.7)" />
      <circle cx={ROX + 38} cy={OY + 5} r={LONE_R} fill="rgba(200,200,200,0.7)" />

      {/* Bottom legend */}
      <text x={165} y={128} textAnchor="middle"
        style={{ fontSize: "10px", fill: "rgba(96,165,250,0.7)", letterSpacing: "0.08em", fontFamily: "monospace" }}>
        :O::O: — NONPOLAR · ΔEN = 0.0
      </text>
    </svg>
  );
}

function LewisView({ mol }: { mol: Mol }) {
  return (
    <div>
      <p className="font-heading mb-2"
        style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.78rem" }}>
        LEWIS DOT STRUCTURE
      </p>
      <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
        Lewis dot structures show only the valence electrons — one dot per electron.
        Dots between atoms are <strong style={{ color: "var(--oc-text)" }}>bond pairs</strong>;
        dots on a single atom are <strong style={{ color: "var(--oc-text)" }}>lone pairs</strong>.
      </p>

      <div className="mb-6">
        {mol === "H2"  && <H2Lewis  />}
        {mol === "HCl" && <HClLewis />}
        {mol === "O2"  && <O2Lewis  />}
      </div>

      <div className="flex flex-col gap-2 max-w-xl">
        {mol === "H2" && (
          <>
            <div className="flex items-start gap-3 p-3" style={{ border: "1px solid rgba(255,215,0,0.2)", background: "rgba(255,215,0,0.04)", borderRadius: "4px" }}>
              <span className="font-heading shrink-0" style={{ fontSize: "0.65rem", color: "#ffd700", letterSpacing: "0.1em" }}>H:H</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                One bond pair (2 dots) shared between the atoms — that&apos;s it. Hydrogen has no lone pairs because
                all of its valence electrons go into the bond.
              </p>
            </div>
          </>
        )}
        {mol === "HCl" && (
          <>
            <div className="flex items-start gap-3 p-3" style={{ border: "1px solid rgba(255,215,0,0.2)", background: "rgba(255,215,0,0.04)", borderRadius: "4px" }}>
              <span className="font-heading shrink-0" style={{ fontSize: "0.65rem", color: "#ffd700", letterSpacing: "0.1em" }}>:</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                The two yellow dots between H and Cl are the shared bond pair. The gray dots around Cl are its 3 lone pairs — 6 electrons that chlorine keeps to itself.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3" style={{ border: "1px solid rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.04)", borderRadius: "4px" }}>
              <span className="font-heading shrink-0" style={{ fontSize: "0.65rem", color: "#a855f7", letterSpacing: "0.1em" }}>δ⁺/δ⁻</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                The partial charges (δ⁺ on H, δ⁻ on Cl) don&apos;t appear in the Lewis structure itself — they&apos;re a consequence of the unequal sharing that the 3D cloud showed you.
              </p>
            </div>
          </>
        )}
        {mol === "O2" && (
          <>
            <div className="flex items-start gap-3 p-3" style={{ border: "1px solid rgba(255,215,0,0.2)", background: "rgba(255,215,0,0.04)", borderRadius: "4px" }}>
              <span className="font-heading shrink-0" style={{ fontSize: "0.65rem", color: "#ffd700", letterSpacing: "0.1em" }}>::</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Four yellow dots between the oxygens represent the double bond — two bond pairs. This corresponds to the sigma bond + pi bond you saw in the 3D electron density view.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3" style={{ border: "1px solid rgba(96,165,250,0.2)", background: "rgba(96,165,250,0.04)", borderRadius: "4px" }}>
              <span className="font-heading shrink-0" style={{ fontSize: "0.65rem", color: "#60a5fa", letterSpacing: "0.1em" }}>LP</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Each oxygen keeps 2 lone pairs (4 electrons). Total: 4 bond pair electrons + 8 lone pair electrons = 12 valence electrons. Check: 2 oxygens × 6 valence electrons = 12. ✓
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main wrapper ──────────────────────────────────────────────────────────────

export function CovalentBondVisualizer() {
  const [mol, setMol]           = useState<Mol>("H2");
  const [showDensity, setShow]  = useState(false);
  const [showLewis, setLewis]   = useState(false);

  function selectMol(m: Mol) {
    setMol(m);
    setShow(false);
    setLewis(false);
  }

  function advance() {
    if (!showDensity) { setShow(true); return; }
    setLewis(true);
  }

  function replay() {
    setShow(false);
    setLewis(false);
  }

  const data = MOL_DATA[mol];

  const btnLabel =
    !showDensity ? "▶  SHOW ELECTRON DENSITY" :
    !showLewis   ? "▶  SEE LEWIS DOT STRUCTURE" :
    null;

  // ── Lewis dot view ──────────────────────────────────────────────────────────
  if (showLewis) {
    return (
      <div>
        {/* Molecule tabs */}
        <div className="flex gap-2 mb-5">
          {(["H2", "HCl", "O2"] as Mol[]).map(m => (
            <button key={m} onClick={() => selectMol(m)}
              className="font-heading text-xs px-4 py-2 transition-all duration-200"
              style={{
                border: mol === m ? "1px solid rgba(52,211,153,0.6)" : "1px solid rgba(52,211,153,0.2)",
                color: mol === m ? "rgba(52,211,153,0.95)" : "rgba(52,211,153,0.45)",
                background: mol === m ? "rgba(52,211,153,0.08)" : "transparent",
                cursor: "pointer", letterSpacing: "0.12em", borderRadius: "4px",
              }}
            >
              {MOL_DATA[m].label}
            </button>
          ))}
        </div>

        <LewisView mol={mol} />

        <button onClick={replay}
          className="font-heading text-xs px-6 py-3 mt-6 transition-all duration-200"
          style={{
            border: "1px solid rgba(52,211,153,0.35)",
            color: "rgba(52,211,153,0.8)",
            background: "rgba(52,211,153,0.04)",
            cursor: "pointer", letterSpacing: "0.15em", borderRadius: "4px",
          }}
        >
          ↩  BACK TO 3D VIEW
        </button>
      </div>
    );
  }

  // ── 3D density view ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* Molecule tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["H2", "HCl", "O2"] as Mol[]).map(m => (
          <button key={m} onClick={() => selectMol(m)}
            className="font-heading text-xs px-4 py-2 transition-all duration-200"
            style={{
              border: mol === m ? "1px solid rgba(52,211,153,0.6)" : "1px solid rgba(52,211,153,0.2)",
              color: mol === m ? "rgba(52,211,153,0.95)" : "rgba(52,211,153,0.45)",
              background: mol === m ? "rgba(52,211,153,0.08)" : "transparent",
              cursor: "pointer", letterSpacing: "0.12em", borderRadius: "4px",
            }}
          >
            {MOL_DATA[m].label}
          </button>
        ))}
        <span className="ml-auto font-heading text-xs self-center"
          style={{ color: "var(--oc-text-dim)", letterSpacing: "0.08em", fontSize: "0.65rem" }}>
          {data.sublabel}
        </span>
      </div>

      {/* Atom legend */}
      <div className="flex items-center gap-5 mb-2 font-heading flex-wrap"
        style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
        <span>
          <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: "#c0c0c0", marginRight: 5, verticalAlign: "middle" }} />
          {mol === "H2" ? "H — HYDROGEN" : mol === "HCl" ? "H — HYDROGEN" : "O — OXYGEN"}
        </span>
        {mol === "HCl" && (
          <span>
            <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "#66bb66", marginRight: 5, verticalAlign: "middle" }} />
            Cl — CHLORINE
          </span>
        )}
        {showDensity && (
          <span>
            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: data.polarityColor, marginRight: 5, verticalAlign: "middle" }} />
            ELECTRON DENSITY
          </span>
        )}
      </div>

      {/* Canvas */}
      <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>
        <CovalentBond3D mol={mol} showDensity={showDensity} />
      </div>

      {/* Stage info */}
      <div className="mt-4 mb-4" style={{ minHeight: "72px" }}>
        <p className="font-heading mb-1"
          style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.78rem" }}>
          {!showDensity ? "EXPLORE THE ATOMS" : "ELECTRON DENSITY"}
        </p>
        <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
          {showDensity ? data.step1Text : data.step0Text}
        </p>
      </div>

      {/* Bond info chips (visible when density shown) */}
      {showDensity && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="font-heading text-xs px-3 py-1.5"
            style={{ border: "1px solid rgba(52,211,153,0.3)", color: "rgba(52,211,153,0.8)", background: "rgba(52,211,153,0.06)", borderRadius: "4px", letterSpacing: "0.1em", fontSize: "0.65rem" }}>
            {data.bondType}
          </span>
          <span className="font-heading text-xs px-3 py-1.5"
            style={{ border: `1px solid ${data.polarityColor}44`, color: data.polarityColor, background: `${data.polarityColor}0a`, borderRadius: "4px", letterSpacing: "0.1em", fontSize: "0.65rem" }}>
            {data.polarity}
          </span>
          <span className="font-heading text-xs px-3 py-1.5"
            style={{ border: "1px solid rgba(148,163,184,0.2)", color: "var(--oc-text-dim)", background: "transparent", borderRadius: "4px", letterSpacing: "0.1em", fontSize: "0.65rem" }}>
            ΔEN = {data.deltaEN}
          </span>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {btnLabel && (
          <button onClick={advance}
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{
              border: "1px solid rgba(52,211,153,0.4)",
              color: "rgba(52,211,153,0.9)",
              background: "rgba(52,211,153,0.05)",
              cursor: "pointer", letterSpacing: "0.15em", borderRadius: "4px",
            }}
          >
            {btnLabel}
          </button>
        )}
        {showDensity && (
          <button onClick={replay}
            className="font-heading text-xs px-4 py-3 transition-all duration-200"
            style={{
              border: "1px solid rgba(148,163,184,0.2)",
              color: "var(--oc-text-dim)",
              background: "transparent",
              cursor: "pointer", letterSpacing: "0.12em", borderRadius: "4px",
            }}
          >
            ↩ RESET
          </button>
        )}
      </div>
    </div>
  );
}
