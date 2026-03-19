"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "COURSES",        href: "/courses" },
  { label: "PERIODIC TABLE", href: "/periodic-table" },
  { label: "DICTIONARY",     href: "/dictionary" },
  { label: "UNITS",          href: "/si-units" },
  { label: "MINI GAMES",     href: "/mini-games" },
  { label: "ABOUT",          href: "/who-we-are" },
];

export function MobileNav({ activeLabel }: { activeLabel?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-1"
        aria-label="Open navigation"
        style={{ color: "var(--oc-green)" }}
      >
        <span style={{ display: "block", width: "20px", height: "2px", background: "currentColor" }} />
        <span style={{ display: "block", width: "20px", height: "2px", background: "currentColor" }} />
        <span style={{ display: "block", width: "13px", height: "2px", background: "currentColor" }} />
      </button>

      {/* Full-screen overlay */}
      {open && (
        <div
          className="mob-nav-overlay fixed inset-0 z-[300] flex flex-col scanlines font-terminal"
          style={{
            background: "var(--oc-bg)",
            color: "var(--oc-text)",
          }}
        >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 h-16 shrink-0"
              style={{ borderBottom: "1px solid var(--oc-green-border-dim)" }}
            >
              <span className="font-heading" style={{ color: "var(--oc-green)", letterSpacing: "0.2em" }}>
                ⬡ ALLYLIC
              </span>
              <button
                onClick={() => setOpen(false)}
                className="font-heading text-xs px-3 py-2"
                style={{
                  color: "var(--oc-text-dim)",
                  border: "1px solid var(--oc-green-border-faint)",
                  letterSpacing: "0.12em",
                }}
                aria-label="Close menu"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col px-6 pt-6 flex-1 overflow-y-auto">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = label === activeLabel;
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between"
                    style={{
                      padding: "1.1rem 0",
                      borderBottom: "1px solid var(--oc-green-border-faint)",
                      color: isActive ? "var(--oc-green)" : "var(--oc-text)",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      className="font-heading"
                      style={{ fontSize: "1.25rem", letterSpacing: "0.04em" }}
                    >
                      {label}
                    </span>
                    <span style={{ color: isActive ? "var(--oc-green)" : "var(--oc-text-hint)" }}>
                      →
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div
              className="px-6 py-5 shrink-0"
              style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}
            >
              <p className="text-xs" style={{ color: "var(--oc-text-hint)", letterSpacing: "0.1em" }}>
                © {new Date().getFullYear()} ALLYLIC
              </p>
            </div>
          </div>
      )}
    </>
  );
}
