import Link from "next/link";
import { PeriodicTableExplorer } from "@/components/lessons/PeriodicTableExplorer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata = {
  title: "Periodic Table — Allylic",
  description: "Interactive periodic table of all 118 elements. Hover any element to view its 3D atomic model, electron configuration, and key properties.",
};

export default function PeriodicTablePage() {
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
          <span className="text-xl font-heading" style={{ color: "var(--oc-green)" }}>⬡</span>
          <span className="font-heading text-sm hidden sm:block" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 tracking-widest" style={{ fontSize: "1rem" }}>
          {[["COURSES", "/courses"], ["PERIODIC TABLE", "/periodic-table"], ["DICTIONARY", "/dictionary"], ["UNITS", "/si-units"]].map(([label, href]) => (
            <Link key={label} href={href} className="transition-colors duration-200 hover:text-white"
              style={{ color: label === "PERIODIC TABLE" ? "var(--oc-green)" : "var(--oc-text-dim)" }}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-14 max-w-screen-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)" }}>
            // REFERENCE
          </p>
          <h1
            className="font-heading leading-none mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
          >
            PERIODIC TABLE
          </h1>
          <p className="text-sm max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
            All 118 known elements organised by atomic number. Hover any element to view its 3D atomic model,
            electron configuration, and key properties.
          </p>
        </div>

        {/* Table */}
        <PeriodicTableExplorer />

      </div>
    </main>
  );
}
