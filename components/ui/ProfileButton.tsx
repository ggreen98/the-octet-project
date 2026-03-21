"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const PROFILE_LINKS = [
  { label: "ACHIEVEMENTS", href: "/achievements" },
  { label: "SETTINGS",     href: "/settings" },
];

export function ProfileButton() {
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
        aria-label="Profile menu"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: open
            ? "1px solid var(--oc-green)"
            : "1px solid var(--oc-green-border-dim)",
          background: open ? "rgba(114,184,114,0.08)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
          boxShadow: open ? "0 0 10px rgba(114,184,114,0.2)" : "none",
          color: open ? "var(--oc-green)" : "var(--oc-text-dim)",
          flexShrink: 0,
        }}
      >
        {/* User silhouette icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2.5 13.5c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            minWidth: "172px",
            background: "var(--oc-nav-bg)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid var(--oc-green-border-dim)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(180,210,255,0.06)",
            zIndex: 100,
          }}
        >
          {/* Top tick */}
          <div style={{
            position: "absolute",
            top: -5,
            right: 10,
            width: 8,
            height: 8,
            background: "var(--oc-nav-bg)",
            border: "1px solid var(--oc-green-border-dim)",
            borderBottom: "none",
            borderRight: "none",
            rotate: "45deg",
          }} />

          {/* Logged-out state hint */}
          <div style={{
            padding: "0.6rem 1.1rem 0.5rem",
            borderBottom: "1px solid var(--oc-green-border-faint)",
          }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--oc-text-hint)", fontFamily: "inherit" }}>
              NOT SIGNED IN
            </div>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                marginTop: "0.35rem",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                color: "var(--oc-blue)",
                textDecoration: "none",
                fontFamily: "inherit",
              }}
            >
              SIGN UP →
            </Link>
          </div>

          {PROFILE_LINKS.map(({ label, href }, i) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="transition-colors duration-150 hover:text-white"
              style={{
                display: "flex",
                padding: "0.65rem 1.1rem",
                color: "var(--oc-text-sub)",
                textDecoration: "none",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                fontFamily: "inherit",
                borderBottom: i < PROFILE_LINKS.length - 1 ? "1px solid var(--oc-green-border-faint)" : "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
