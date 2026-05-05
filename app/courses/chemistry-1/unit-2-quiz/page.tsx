import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { Unit2Quiz } from "@/components/lessons/Unit2Quiz";

export const metadata = {
  title: "Unit 2 Quiz — Allylic",
  description: "Test your knowledge of electrons, electron configuration, and periodic trends.",
};

export default function Unit2QuizPage() {
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

        <div className="hidden md:flex items-center gap-2 tracking-widest" style={{ fontSize: "0.85rem", color: "var(--oc-green-dim)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <Link href="/courses/chemistry-1" className="hover:text-green-400 transition-colors">CHEMISTRY I</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <span style={{ color: "var(--oc-green)" }}>UNIT 2 QUIZ</span>
        </div>

        <div className="flex items-center gap-3">
          <MobileNav />
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-14 max-w-2xl mx-auto">

        {/* Label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-heading text-xs px-2 py-0.5" style={{ background: "rgba(167,139,250,0.1)", color: "rgba(167,139,250,0.9)", border: "1px solid rgba(167,139,250,0.3)", letterSpacing: "0.12em" }}>
            UNIT 2
          </span>
        </div>

        <h1
          className="font-heading leading-none mb-4"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          QUIZ
        </h1>
        <p className="text-sm leading-relaxed mb-10 max-w-xl" style={{ color: "var(--oc-text-muted)" }}>
          15 questions covering electron shells, valence electrons, electron configuration, and periodic trends.
          Answer all questions then submit to see your results.
        </p>

        <Unit2Quiz />

        {/* Back to course */}
        <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1"
            className="font-heading text-xs transition-colors duration-200"
            style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}
          >
            ← BACK TO CHEMISTRY I
          </Link>
        </div>
      </div>
    </main>
  );
}
