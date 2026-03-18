import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata = {
  title: "Who We Are — Allylic",
  description: "Our mission and ethics statement.",
};

export default function WhoWeArePage() {
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
          {[
            ["COURSES",        "/courses"],
            ["PERIODIC TABLE", "/periodic-table"],
            ["DICTIONARY",     "/dictionary"],
            ["UNITS",          "/si-units"],
            ["WHO WE ARE",     "/who-we-are"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="transition-colors duration-200 hover:text-white"
              style={{ color: label === "WHO WE ARE" ? "var(--oc-green)" : "var(--oc-text-dim)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-20 max-w-2xl mx-auto">

        {/* Eyebrow */}
        <p className="text-xs tracking-widest mb-8" style={{ color: "var(--oc-green-dim)" }}>
          // WHO WE ARE
        </p>

        {/* Mission */}
        <h1
          className="font-heading leading-none mb-8"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          OUR MISSION
        </h1>
        <div className="mb-16" style={{ borderLeft: "2px solid var(--oc-green-border-dim)", paddingLeft: "1.5rem" }}>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            [Your mission statement goes here. Write it in your own words — what Allylic is,
            why you built it, and what you hope it does for the people who use it.]
          </p>
        </div>

        {/* Ethics */}
        <h2
          className="font-heading leading-none mb-8"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          OUR ETHICS
        </h2>
        <div style={{ borderLeft: "2px solid var(--oc-green-border-dim)", paddingLeft: "1.5rem" }}>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            [Your ethics statement goes here. What principles guide how Allylic is built,
            how student data is treated, what you will and won&apos;t do as this grows.]
          </p>
        </div>

      </div>
    </main>
  );
}
