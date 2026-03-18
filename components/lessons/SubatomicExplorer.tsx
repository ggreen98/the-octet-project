"use client";

import { useState } from "react";
import { CarbonCanvas } from "@/components/molecules/CarbonCanvas";
import { useTheme } from "@/contexts/ThemeContext";

type Highlighted = "proton" | "neutron" | "electron" | null;

const PARTICLES = [
  {
    id: "proton" as const,
    label: "PROTON",
    symbol: "+",
    border: "rgba(180,60,40,0.35)",
    borderHover: "rgba(180,60,40,0.8)",
    bg: "rgba(180,60,40,0.05)",
    bgHover: "rgba(180,60,40,0.12)",
    circleBg: "rgba(180,60,40,0.25)",
    circleBorder: "rgba(180,60,40,0.6)",
    circleBorderHover: "rgba(255,100,60,0.9)",
    circleGlow: "rgba(180,60,40,0.3)",
    circleGlowHover: "rgba(255,80,40,0.6)",
    textColor: "rgba(255,160,130,0.9)",
    valueColor: "rgba(255,160,130,0.8)",
    charge: "+1",
    location: "nucleus",
    size: "≈ 0.85 fm",
    mass: "1.007 u",
  },
  {
    id: "neutron" as const,
    label: "NEUTRON",
    symbol: "0",
    border: "rgba(120,140,160,0.35)",
    borderHover: "rgba(120,140,160,0.8)",
    bg: "rgba(120,140,160,0.05)",
    bgHover: "rgba(120,140,160,0.12)",
    circleBg: "rgba(100,120,140,0.25)",
    circleBorder: "rgba(120,140,160,0.5)",
    circleBorderHover: "rgba(160,190,210,0.9)",
    circleGlow: "rgba(100,120,140,0.25)",
    circleGlowHover: "rgba(140,170,200,0.5)",
    textColor: "rgba(180,210,230,0.8)",
    valueColor: "rgba(180,210,230,0.7)",
    charge: "none",
    location: "nucleus",
    size: "≈ 0.8 fm",
    mass: "1.008 u",
  },
  {
    id: "electron" as const,
    label: "ELECTRON",
    symbol: "−",
    border: "rgba(68,153,255,0.35)",
    borderHover: "rgba(68,153,255,0.8)",
    bg: "rgba(68,153,255,0.05)",
    bgHover: "rgba(68,153,255,0.12)",
    circleBg: "rgba(68,153,255,0.15)",
    circleBorder: "rgba(68,153,255,0.5)",
    circleBorderHover: "rgba(100,180,255,0.9)",
    circleGlow: "rgba(68,153,255,0.25)",
    circleGlowHover: "rgba(68,153,255,0.55)",
    textColor: "rgba(130,190,255,0.95)",
    valueColor: "rgba(130,190,255,0.8)",
    charge: "−1",
    location: "shell",
    size: "< 0.001 fm",
    mass: "0.00055 u",
  },
] as const;

const LIGHT_TEXT: Record<string, { text: string; value: string }> = {
  proton:   { text: "rgba(150, 30,  5, 0.9)",  value: "rgba(150, 30,  5, 0.8)"  },
  neutron:  { text: "rgba( 45, 70,100, 0.9)",  value: "rgba( 45, 70,100, 0.8)"  },
  electron: { text: "rgba( 20, 65,170, 0.9)",  value: "rgba( 20, 65,170, 0.8)"  },
};

export function SubatomicExplorer() {
  const [highlighted, setHighlighted] = useState<Highlighted>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="flex flex-col lg:flex-row gap-8 mb-12" style={{ maxWidth: "1100px" }}>

      {/* Cards + hint stacked together */}
      <div className="flex flex-col flex-1 gap-3">
        <div className="flex gap-4">
          {PARTICLES.map((p) => {
            const active = highlighted === p.id;
            return (
              <div
                key={p.id}
                className="flex-1 flex flex-col items-center gap-3 py-8 px-6 cursor-default"
                style={{
                  border: `1px solid ${active ? p.borderHover : p.border}`,
                  background: active ? p.bgHover : p.bg,
                  borderRadius: "4px",
                  transition: "border-color 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={() => setHighlighted(p.id)}
                onMouseLeave={() => setHighlighted(null)}
              >
                <div
                  className="flex items-center justify-center font-heading text-lg"
                  style={{
                    width: "52px", height: "52px", borderRadius: "50%",
                    background: p.circleBg,
                    border: `2px solid ${active ? p.circleBorderHover : p.circleBorder}`,
                    color: isLight ? LIGHT_TEXT[p.id].text : p.textColor,
                    boxShadow: `0 0 ${active ? "22px" : "14px"} ${active ? p.circleGlowHover : p.circleGlow}`,
                    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  {p.symbol}
                </div>
                <p className="font-heading text-sm tracking-widest" style={{ color: isLight ? LIGHT_TEXT[p.id].text : p.textColor, letterSpacing: "0.15em" }}>
                  {p.label}
                </p>
                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-sm" style={{ color: "var(--oc-text-muted)" }}>charge: <span style={{ color: isLight ? LIGHT_TEXT[p.id].value : p.valueColor }}>{p.charge}</span></p>
                  <p className="text-sm" style={{ color: "var(--oc-text-muted)" }}>location: <span style={{ color: isLight ? LIGHT_TEXT[p.id].value : p.valueColor }}>{p.location}</span></p>
                  <p className="text-sm" style={{ color: "var(--oc-text-muted)" }}>size: <span style={{ color: isLight ? LIGHT_TEXT[p.id].value : p.valueColor }}>{p.size}</span></p>
                  <p className="text-sm" style={{ color: "var(--oc-text-muted)" }}>mass: <span style={{ color: isLight ? LIGHT_TEXT[p.id].value : p.valueColor }}>{p.mass}</span></p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover hint */}
        <p
          className="font-heading text-xs tracking-widest"
          style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}
        >
          ↑ HOVER A CARD TO HIGHLIGHT IT IN THE ATOM →
        </p>
      </div>

      {/* Carbon atom */}
      <div
        className="shrink-0"
        style={{
          width: "340px",
          height: "340px",
          border: "1px solid var(--oc-green-border-faint)",
          borderRadius: "4px",
          background: "transparent",
          alignSelf: "center",
        }}
      >
        <CarbonCanvas highlighted={highlighted} />
      </div>

    </div>
  );
}
