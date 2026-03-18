"use client";

import { useState } from "react";

type Part = "number" | "symbol" | "mass" | null;

const INFO: Record<NonNullable<Part>, { label: string; description: string }> = {
  number: {
    label: "ATOMIC NUMBER",
    description:
      "The number of protons in the nucleus. This uniquely identifies the element — every lithium atom in the universe has exactly 3 protons. Change this number and you change the element entirely.",
  },
  symbol: {
    label: "CHEMICAL SYMBOL",
    description:
      "The element's universal abbreviation, used in equations and lab notation worldwide. Lithium's symbol Li comes directly from its English name — though as you'll see below, not every element is so straightforward.",
  },
  mass: {
    label: "ATOMIC WEIGHT",
    description:
      "The weighted average mass of one atom in atomic mass units (u), calculated from the natural abundance of all lithium isotopes. Li-6 (7.6%) and Li-7 (92.4%) average out to 6.941 u.",
  },
};

export function LiCellAnnotated() {
  const [hovered, setHovered] = useState<Part>(null);

  const zoneBg = (part: Part) =>
    hovered === part ? "rgba(180,130,80,0.16)" : "transparent";

  return (
    <div style={{ display: "flex", gap: "28px", alignItems: "stretch", flexWrap: "wrap" }}>

      {/* Cell */}
      <div
        style={{
          width: "130px",
          height: "158px",
          border: `1px solid ${hovered ? "rgba(180,130,80,0.9)" : "rgba(180,130,80,0.55)"}`,
          background: "rgba(180,130,80,0.06)",
          borderRadius: "3px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
          transition: "border-color 0.15s",
        }}
      >
        {/* Atomic number zone */}
        <div
          onMouseEnter={() => setHovered("number")}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "9px 9px 4px",
            cursor: "default",
            background: zoneBg("number"),
            transition: "background 0.15s",
          }}
        >
          <span
            style={{
              fontSize: "17px",
              color: hovered === "number" ? "rgba(180,130,80,0.95)" : "var(--oc-text-dim)",
              lineHeight: 1,
              fontFamily: "var(--font-heading, monospace)",
              transition: "color 0.15s",
            }}
          >
            3
          </span>
        </div>

        {/* Symbol zone */}
        <div
          onMouseEnter={() => setHovered("symbol")}
          onMouseLeave={() => setHovered(null)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "default",
            background: zoneBg("symbol"),
            transition: "background 0.15s",
          }}
        >
          <span
            style={{
              fontSize: "54px",
              fontFamily: "var(--font-heading, monospace)",
              color: hovered === "symbol" ? "#e09540" : "#c8853a",
              lineHeight: 1,
              fontWeight: 600,
              transition: "color 0.15s",
            }}
          >
            Li
          </span>
        </div>

        {/* Atomic mass zone */}
        <div
          onMouseEnter={() => setHovered("mass")}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "4px 9px 11px",
            cursor: "default",
            background: zoneBg("mass"),
            transition: "background 0.15s",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              color: hovered === "mass" ? "rgba(180,130,80,0.95)" : "var(--oc-text-dim)",
              letterSpacing: "0.04em",
              lineHeight: 1,
              fontFamily: "var(--font-heading, monospace)",
              transition: "color 0.15s",
            }}
          >
            6.941
          </span>
        </div>
      </div>

      {/* Info panel */}
      <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center" }}>
        {hovered ? (
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#d4933e",
                letterSpacing: "0.18em",
                marginBottom: "10px",
                fontFamily: "var(--font-heading, monospace)",
              }}
            >
              {INFO[hovered].label}
            </div>
            <p style={{ fontSize: "16px", color: "var(--oc-text)", lineHeight: 1.65, margin: 0 }}>
              {INFO[hovered].description}
            </p>
          </div>
        ) : (
          <>
            <style>{`
              @keyframes li-hint-pulse {
                0%, 100% { opacity: 1; text-shadow: 0 0 10px rgba(212,147,62,0.6); }
                50%       { opacity: 0.35; text-shadow: none; }
              }
            `}</style>
            <span
              style={{
                fontSize: "15px",
                color: "#d4933e",
                letterSpacing: "0.15em",
                fontFamily: "var(--font-heading, monospace)",
                animation: "li-hint-pulse 2s ease-in-out infinite",
              }}
            >
              ← HOVER FOR EXPLAINER
            </span>
          </>
        )}
      </div>

    </div>
  );
}
