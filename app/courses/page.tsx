import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata = {
  title: "Courses — Allylic",
  description: "Browse all chemistry courses. From atomic structure to organic reactions.",
};

export default function CoursesPage() {
  return (
    <main
      className="scanlines font-terminal min-h-screen overflow-x-hidden"
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
            <Link
              key={label}
              href={href}
              className="transition-colors duration-200"
              style={{ color: label === "COURSES" ? "var(--oc-green)" : "var(--oc-text-dim)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </nav>

      {/* ── PAGE CONTENT ────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-16 lg:px-24 py-16">

        {/* Header */}
        <div className="mb-14 animate-fade-up" style={{ animationFillMode: "both" }}>
          <p className="text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)" }}>
            // AVAILABLE COURSES
          </p>
          <h1
            className="font-heading text-3xl md:text-5xl mb-4"
            style={{ color: "var(--oc-text)", letterSpacing: "-0.02em" }}
          >
            THE CURRICULUM
          </h1>
          <p className="text-sm max-w-xl" style={{ color: "var(--oc-text-muted)" }}>
            Each course is broken into focused lessons. Work through them in order or jump to what you need.
          </p>
        </div>

        {/* Course card */}
        <div className="max-w-md">
          <Link href="/courses/chemistry-1" className="block">
            <div
              className="crt-card p-6 flex flex-col gap-4 animate-fade-up anim-d1 transition-all duration-200 hover:bg-[rgba(68,153,255,0.04)]"
              style={{ animationFillMode: "both", minHeight: "200px" }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <span className="font-heading text-xs" style={{ color: "var(--oc-green-dim)" }}>01</span>
                <span className="text-xs tracking-widest" style={{ color: "var(--oc-green)", fontSize: "0.58rem", letterSpacing: "0.15em" }}>
                  [AVAILABLE]
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-heading text-xs tracking-wider leading-relaxed"
                style={{ color: "var(--oc-text-sub)", letterSpacing: "0.08em" }}
              >
                CHEMISTRY I: GENERAL CHEMISTRY
              </h2>

              {/* Description */}
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--oc-text-sub)" }}>
                Start from the ground up. Atoms, electrons, bonding, and the periodic table.
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
                <span className="text-xs" style={{ color: "var(--oc-green-dim)", fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                  3 LESSONS
                </span>
                <span className="font-heading text-xs" style={{ color: "var(--oc-blue)", letterSpacing: "0.1em" }}>
                  START →
                </span>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </main>
  );
}
