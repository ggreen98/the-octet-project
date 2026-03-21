"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const TOOLS = [
  { label: "PERIODIC TABLE", href: "/periodic-table", sub: "All 118 elements" },
  { label: "DICTIONARY",     href: "/dictionary",     sub: "Chemistry terms" },
  { label: "UNITS",          href: "/si-units",       sub: "SI reference" },
];

export function ToolsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 transition-colors duration-200 hover:text-white"
        style={{
          color: open ? "white" : "var(--oc-text-sub)",
          background: "none",
          border: "none",
          cursor: "pointer",
          letterSpacing: "0.1em",
          fontSize: "inherit",
          fontFamily: "inherit",
          padding: "0.25rem 0",
        }}
      >
        TOOLS
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", marginTop: 1, opacity: 0.7 }}
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 14px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "220px",
            background: "var(--oc-nav-bg)",
            backdropFilter: "blur(32px) saturate(180%)",
            WebkitBackdropFilter: "blur(32px) saturate(180%)",
            border: "1px solid var(--oc-green-border-dim)",
            borderRadius: "8px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {/* Caret */}
          <div style={{
            position: "absolute",
            top: -5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 9,
            height: 9,
            background: "var(--oc-nav-bg)",
            border: "1px solid var(--oc-green-border-dim)",
            borderBottom: "none",
            borderRight: "none",
            rotate: "45deg",
          }} />

          {/* Header label */}
          <div style={{
            padding: "10px 14px 8px",
            borderBottom: "1px solid var(--oc-green-border-faint)",
          }}>
            <span style={{
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "var(--oc-green-dim)",
              fontFamily: "inherit",
            }}>
              REFERENCE TOOLS
            </span>
          </div>

          {/* Links */}
          {TOOLS.map(({ label, href, sub }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                padding: "10px 14px",
                textDecoration: "none",
                borderBottom: "1px solid var(--oc-green-border-faint)",
                transition: "background 0.12s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(114,184,114,0.06)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: "var(--oc-text)",
                fontFamily: "inherit",
                fontWeight: 500,
              }}>
                {label}
              </span>
              <span style={{
                fontSize: "0.65rem",
                color: "var(--oc-text-hint)",
                letterSpacing: "0.04em",
                fontFamily: "inherit",
              }}>
                {sub}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
