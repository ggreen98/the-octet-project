import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { SubshellTable } from "@/components/lessons/SubshellTable";

export const metadata = {
  title: "Orbital Viewer — Allylic",
  description: "Interactive 3D and 2D viewer for atomic orbital shapes — s, p, d, and f subshells with individual orbital breakdowns.",
};

export default function OrbitalViewerPage() {
  return (
    <main
      className="scanlines font-terminal min-h-screen"
      style={{ backgroundColor: "var(--oc-bg)", color: "var(--oc-text)" }}
    >
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{
          background: "var(--oc-nav-bg)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--oc-green-border-dim)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-heading" style={{ color: "var(--oc-green)" }}>⬡</span>
          <span className="font-heading" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 tracking-widest" style={{ fontSize: "1rem" }}>
          {[
            ["COURSES",        "/courses"],
            ["PERIODIC TABLE", "/periodic-table"],
            ["DICTIONARY",     "/dictionary"],
            ["UNITS",          "/si-units"],
            ["ORBITAL VIEWER", "/orbital-viewer"],
            ["MINI GAMES",     "/mini-games"],
            ["ABOUT",          "/who-we-are"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="transition-colors duration-200 hover:text-white"
              style={{ color: label === "ORBITAL VIEWER" ? "var(--oc-green)" : "var(--oc-text-dim)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <MobileNav activeLabel="ORBITAL VIEWER" />
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-14 max-w-4xl mx-auto">

        {/* Header badge */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-heading text-xs px-2 py-0.5"
            style={{
              background: "var(--oc-green-badge)",
              color: "var(--oc-green)",
              border: "1px solid var(--oc-green-subtle)",
              letterSpacing: "0.12em",
            }}
          >
            TOOL
          </span>
        </div>

        <h1
          className="font-heading leading-none mb-4"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          ORBITAL VIEWER
        </h1>
        <p className="text-base leading-relaxed mb-12 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          Explore the shapes of atomic orbitals in 2D and 3D. Click a subshell type to select it,
          then use the tabs to see individual orbitals — each holds exactly 2 electrons (↑↓). Switch
          to 3D to rotate and view the full geometry.
        </p>

        {/* ── Viewer ──────────────────────────────────────── */}
        <SubshellTable />

        {/* ── Context callout ─────────────────────────────── */}
        <div
          className="max-w-2xl mt-8 p-5"
          style={{
            border: "1px solid var(--oc-green-border-dim)",
            background: "var(--oc-green-bg-surface)",
            borderRadius: "4px",
          }}
        >
          <p className="font-heading text-xs mb-3" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            HOW THIS CONNECTS
          </p>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--oc-text-muted)" }}>
            Orbital shapes are determined by quantum mechanical wave functions. The regions shown are
            where an electron has roughly 90% probability of being found. The two lobes of a p orbital
            represent opposite phases of the wave function — not opposite charges.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            These shapes directly influence how atoms bond: s orbitals form sigma bonds head-on,
            p orbitals form both sigma and pi bonds, and d orbitals are responsible for the complex
            chemistry of transition metals.
          </p>
          <div className="flex gap-3 mt-4 flex-wrap">
            <Link
              href="/courses/chemistry-1/lessons/electron-configuration"
              className="font-heading text-xs px-3 py-2 transition-opacity hover:opacity-80"
              style={{
                border: "1px solid var(--oc-green-subtle)",
                color: "var(--oc-green)",
                borderRadius: "3px",
                letterSpacing: "0.1em",
                fontSize: "0.55rem",
              }}
            >
              ↗ LESSON 2.3 — ELECTRON CONFIGURATION
            </Link>
            <Link
              href="/courses/chemistry-1/lessons/electron-configuration-notation"
              className="font-heading text-xs px-3 py-2 transition-opacity hover:opacity-80"
              style={{
                border: "1px solid var(--oc-green-subtle)",
                color: "var(--oc-green)",
                borderRadius: "3px",
                letterSpacing: "0.1em",
                fontSize: "0.55rem",
              }}
            >
              ↗ LESSON 2.4 — NOTATION
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
