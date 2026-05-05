"use client";

import { useEffect, useState } from "react";

export function MobileWarning() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-sm p-6 font-terminal"
        style={{
          background: "var(--oc-bg)",
          border: "1px solid var(--oc-green-border-dim)",
          borderRadius: "6px",
          boxShadow: "0 0 40px rgba(114,184,114,0.1)",
        }}
      >
        {/* Header */}
        <p
          className="font-heading text-xs mb-4"
          style={{ color: "var(--oc-green)", letterSpacing: "0.15em" }}
        >
          ⚠ NOTICE
        </p>

        <p
          className="font-heading mb-3 leading-snug"
          style={{ fontSize: "1.1rem", color: "var(--oc-text)", letterSpacing: "0.02em" }}
        >
          NOT YET OPTIMISED FOR MOBILE
        </p>

        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
          Allylic is best experienced on a desktop or laptop. Some interactive features may
          not display correctly on a phone. We highly recommend switching to a computer for
          the full experience.
        </p>

        <button
          onClick={() => setVisible(false)}
          className="w-full font-heading text-xs py-3 transition-all duration-200"
          style={{
            border: "1px solid var(--oc-green-subtle)",
            background: "var(--oc-green-badge)",
            color: "var(--oc-green)",
            letterSpacing: "0.15em",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          GOT IT, CONTINUE ANYWAY
        </button>
      </div>
    </div>
  );
}
