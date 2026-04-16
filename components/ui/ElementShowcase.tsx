"use client";

import { useState, useRef, useEffect } from "react";
import { HydrogenCanvas } from "@/components/molecules/HydrogenCanvas";
import { HeliumCanvas }   from "@/components/molecules/HeliumCanvas";

// ── Unlocked elements shown on the homepage ────────────────────────────────────
// Add to this list as more elements are unlocked in the app.
const ELEMENTS = [
  {
    z: 1,  symbol: "H",  name: "HYDROGEN",
    config: "1s¹", mass: "1.008",
    Canvas: HydrogenCanvas,
  },
  {
    z: 2,  symbol: "He", name: "HELIUM",
    config: "1s²", mass: "4.003",
    Canvas: HeliumCanvas,
  },
];

export function ElementShowcase() {
  const [idx,  setIdx]  = useState(0);
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const el = ELEMENTS[idx];
  const { Canvas } = el;

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Watermark font size: shrink for multi-char symbols
  const watermarkSize = el.symbol.length === 1 ? "22rem" : "14rem";

  return (
    <div className="hidden lg:flex lg:w-[45%] lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] items-center justify-center relative">

      {/* ── Symbol watermark ── */}
      <div
        className="h-watermark-layer absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ userSelect: "none" }}
      >
        <span
          className="h-watermark"
          style={{
            fontFamily: "monospace",
            fontSize: watermarkSize,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            transition: "font-size 0.3s ease",
          }}
        >
          {el.symbol}
        </span>
      </div>

      {/* ── 3D atom canvas ── */}
      <div className="absolute" style={{ top: 0, bottom: 0, right: 0, left: "-7rem", zIndex: 1 }}>
        <Canvas />
      </div>

      {/* ── Info overlay ── */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>

        {/* Top-right: element dropdown */}
        <div ref={dropRef} className="absolute top-7 right-8" style={{ position: "absolute", top: "1.75rem", right: "2rem" }}>
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              fontFamily: "monospace", fontSize: "0.75rem", letterSpacing: "0.14em",
              color: open ? "var(--oc-text)" : "var(--oc-text-dim)",
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 0",
              transition: "color 0.15s",
            }}
          >
            ELEMENT
            <svg
              width="9" height="9" viewBox="0 0 10 10" fill="none"
              style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.6 }}
            >
              <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: "180px",
              background: "var(--oc-nav-bg)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              border: "1px solid var(--oc-green-border-dim)",
              borderRadius: "6px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
              overflow: "hidden",
              zIndex: 50,
            }}>
              {/* Caret */}
              <div style={{
                position: "absolute", top: -5, right: 16,
                width: 9, height: 9,
                background: "var(--oc-nav-bg)",
                border: "1px solid var(--oc-green-border-dim)",
                borderBottom: "none", borderRight: "none",
                rotate: "45deg",
              }} />

              {/* Header */}
              <div style={{ padding: "8px 12px 6px", borderBottom: "1px solid var(--oc-green-border-faint)" }}>
                <span style={{ fontSize: "0.55rem", letterSpacing: "0.18em", color: "var(--oc-green-dim)", fontFamily: "monospace" }}>
                  UNLOCKED ELEMENTS
                </span>
              </div>

              {/* Element list */}
              {ELEMENTS.map((e, i) => (
                <button
                  key={e.z}
                  onClick={() => { setIdx(i); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    width: "100%", padding: "9px 12px",
                    background: i === idx ? "rgba(68,153,255,0.08)" : "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--oc-green-border-faint)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={ev => { if (i !== idx) ev.currentTarget.style.background = "rgba(114,184,114,0.06)"; }}
                  onMouseLeave={ev => { ev.currentTarget.style.background = i === idx ? "rgba(68,153,255,0.08)" : "transparent"; }}
                >
                  <span style={{
                    fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700,
                    color: i === idx ? "var(--oc-blue)" : "var(--oc-text)",
                    minWidth: "20px",
                  }}>
                    {e.symbol}
                  </span>
                  <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: i === idx ? "var(--oc-blue)" : "var(--oc-text-sub)", fontFamily: "monospace" }}>
                    {e.name}
                  </span>
                  {i === idx && (
                    <span style={{ marginLeft: "auto", fontSize: "0.5rem", color: "var(--oc-blue)", letterSpacing: "0.1em" }}>●</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom-left: name + info + switcher */}
        <div className="absolute bottom-8 left-8 flex flex-col gap-1.5">
          {/* Element name + lock icon */}
          <div
            className="element-title flex items-center gap-3 pointer-events-none"
            style={{
              fontFamily: "monospace", fontSize: "1.6rem", fontWeight: 700,
              letterSpacing: "0.2em",
              textShadow: "0 0 24px rgba(180,215,255,0.2)",
              transition: "opacity 0.2s",
            }}
          >
            {el.name}
            <svg width="16" height="17" viewBox="0 0 13 14" fill="none" className="lock-icon" style={{ flexShrink: 0, marginBottom: "1px" }}>
              <rect x="1" y="6.5" width="11" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 6.5V4a2.5 2.5 0 0 1 5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Atomic info line */}
          <div
            className="pointer-events-none"
            style={{ fontFamily: "monospace", fontSize: "0.75rem", letterSpacing: "0.1em", color: "var(--oc-text-dim)" }}
          >
            {el.config} · {el.mass} u · Atomic No. {el.z}
          </div>

        </div>
      </div>
    </div>
  );
}
