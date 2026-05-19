"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { ESPMol } from "./ESPMap3D";

const ESPMap3D = dynamic(() => import("./ESPMap3D"), { ssr: false });

const DATA: Record<ESPMol, {
  label: string;
  sublabel: string;
  summary: string;
  redNote: string;
  blueNote: string;
  greenNote: string;
}> = {
  O2: {
    label:    "O₂",
    sublabel: "Oxygen gas — nonpolar",
    summary:
      "O₂ is symmetric — both atoms are identical oxygen, so the electron density distributes evenly. The ESP map shows warm colors throughout: the outer lone-pair caps glow deepest red, the equatorial pi-bond lobes orange, and the sigma bond region (between atoms) is the least negative. There is no blue because no part of the surface is electron-poor — oxygen is too electronegative.",
    redNote:
      "Outer lone-pair caps — the axial regions at the far ends of each O atom concentrate the most lone pair density. These are the most electron-rich points on the surface.",
    blueNote:
      "Sigma bond region — between the two oxygen nuclei the shared electrons are spread across both atoms, making this the least electron-rich zone on the surface. On a nonpolar molecule, this is the closest thing to \"blue.\"",
    greenNote:
      "Equatorial pi-bond lobes — the regions above and below the bond axis where the π electrons concentrate. Moderately electron-rich: orange/yellow on the color scale.",
  },
  H2O: {
    label:    "H₂O",
    sublabel: "Water — polar",
    summary:
      "Water's ESP map is chemistry's most iconic image. Oxygen pulls electron density so strongly toward itself that the two hydrogen atoms are left almost bare — their nuclear charge is barely shielded. The result is a molecule with an intensely red (negative) top and an intensely blue (positive) bottom. This charge separation is why water dissolves ionic compounds and drives virtually all of biology.",
    redNote:
      "Oxygen lone pairs — oxygen's two lone pairs sit above the atom, creating a zone of intense negative potential. This is the \"δ⁻ end\" of the polar molecule, and the reason water can hydrogen-bond strongly to cations and other polar molecules.",
    blueNote:
      "Hydrogen atoms — oxygen has stripped electron density away from both H atoms, leaving nuclear charge of +1 almost completely unshielded. These strongly positive regions can interact with lone pairs of other molecules — this is the hydrogen-bond donor site.",
    greenNote:
      "O–H bond region — the shared electrons in the polar covalent bond are pulled toward O, so the bond region is moderately negative (orange) near O and moderately positive (green) near H.",
  },
};

export function ESPMapVisualizer() {
  const [mol, setMol] = useState<ESPMol>("O2");
  const d = DATA[mol];

  return (
    <div>
      {/* Molecule selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["O2", "H2O"] as ESPMol[]).map(m => (
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
            {DATA[m].label}
          </button>
        ))}
        <span className="ml-auto font-heading text-xs self-center"
          style={{ color: "var(--oc-text-dim)", fontSize: "0.65rem", letterSpacing: "0.08em" }}>
          {d.sublabel}
        </span>
      </div>

      {/* Color scale legend */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-heading text-xs shrink-0"
          style={{ color: "#ef4444", fontSize: "0.62rem", letterSpacing: "0.08em" }}>
          RED<br/>e⁻-RICH (−)
        </span>
        <div style={{
          flex: 1, height: "8px", borderRadius: "4px",
          background: "linear-gradient(to right, #ef4444, #f97316, #22c55e, #06b6d4, #3b82f6)",
          boxShadow: "0 0 6px rgba(0,0,0,0.4)",
        }} />
        <span className="font-heading text-xs shrink-0 text-right"
          style={{ color: "#3b82f6", fontSize: "0.62rem", letterSpacing: "0.08em" }}>
          BLUE<br/>e⁻-POOR (+)
        </span>
      </div>

      {/* Canvas */}
      <div style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}>
        <ESPMap3D mol={mol} />
      </div>

      {/* Molecule description */}
      <p className="text-base leading-relaxed mt-5 mb-5" style={{ color: "var(--oc-text-muted)" }}>
        {d.summary}
      </p>

      {/* Zone annotation cards */}
      <div className="flex flex-col gap-3">
        <div className="p-4" style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", borderRadius: "4px" }}>
          <p className="font-heading text-xs mb-2" style={{ color: "#ef4444", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
            RED — MOST NEGATIVE POTENTIAL
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>{d.redNote}</p>
        </div>

        <div className="p-4" style={{ border: "1px solid rgba(34,197,94,0.25)", background: "rgba(34,197,94,0.05)", borderRadius: "4px" }}>
          <p className="font-heading text-xs mb-2" style={{ color: "#22c55e", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
            GREEN — INTERMEDIATE
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>{d.greenNote}</p>
        </div>

        <div className="p-4" style={{ border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.06)", borderRadius: "4px" }}>
          <p className="font-heading text-xs mb-2"
            style={{ color: "#3b82f6", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
            {mol === "O2" ? "BLUE — LEAST NEGATIVE (SIGMA BOND)" : "BLUE — MOST POSITIVE POTENTIAL"}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>{d.blueNote}</p>
        </div>
      </div>
    </div>
  );
}
