import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata = {
  title: "Chemistry I: General Chemistry — Allylic",
  description: "Start from the ground up. Atoms, electrons, bonding, and the periodic table.",
};

const lessons = [
  {
    id: "1.1",
    title: "ATOMS",
    description: "What is an atom? Explore the building blocks of all matter and the scale of the atomic world.",
    href: "/courses/chemistry-1/lessons/atoms",
  },
  {
    id: "1.2",
    title: "PROTONS, NEUTRONS & ELECTRONS",
    description: "Meet the three subatomic particles that make up every atom — and learn how charge holds them together.",
    href: "/courses/chemistry-1/lessons/protons-neutrons-electrons",
  },
  {
    id: "1.3",
    title: "ELEMENTS & THE PERIODIC TABLE",
    description: "Discover how 118 elements are organised by atomic number, and how to read every cell in the table.",
    href: "/courses/chemistry-1/lessons/the-periodic-table",
  },
];

export default function Chemistry1Page() {
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

        <div className="hidden md:flex items-center gap-2 tracking-widest" style={{ fontSize: "0.85rem", color: "var(--oc-green-dim)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <span style={{ color: "var(--oc-green)" }}>CHEMISTRY I</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-14 max-w-3xl mx-auto">

        {/* Breadcrumb label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-heading text-xs px-2 py-0.5" style={{ background: "var(--oc-green-badge)", color: "var(--oc-green)", border: "1px solid var(--oc-green-subtle)", letterSpacing: "0.12em" }}>
            COURSE 01
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-heading leading-none mb-4"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          CHEMISTRY I:<br />GENERAL CHEMISTRY
        </h1>
        <p className="text-base leading-relaxed mb-12 max-w-xl" style={{ color: "var(--oc-text-muted)" }}>
          Start from the ground up. Three lessons covering the atomic world, subatomic particles, and the periodic table.
        </p>

        {/* Lesson list */}
        <div className="flex flex-col gap-4">
          {lessons.map((lesson) => (
            <Link key={lesson.id} href={lesson.href} className="block group">
              <div
                className="flex gap-6 p-5 transition-all duration-200 hover:bg-[rgba(68,153,255,0.04)]"
                style={{
                  border: "1px solid var(--oc-green-border-dim)",
                  background: "rgba(114,184,114,0.02)",
                }}
              >
                <span className="font-heading text-sm shrink-0 mt-0.5" style={{ color: "var(--oc-green-dim)" }}>
                  {lesson.id}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-xs mb-2" style={{ color: "var(--oc-text)", letterSpacing: "0.08em" }}>
                    {lesson.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                    {lesson.description}
                  </p>
                </div>
                <span className="font-heading text-xs self-center shrink-0" style={{ color: "var(--oc-blue)" }}>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Quiz link */}
        <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link href="/courses/chemistry-1/quiz" className="block group">
            <div
              className="flex gap-6 p-5 transition-all duration-200 hover:bg-[rgba(68,153,255,0.04)]"
              style={{ border: "1px solid rgba(68,153,255,0.2)", background: "rgba(68,153,255,0.02)" }}
            >
              <span className="font-heading text-sm shrink-0 mt-0.5" style={{ color: "var(--oc-blue)" }}>
                ✎
              </span>
              <div className="flex-1 min-w-0">
                <h2 className="font-heading text-xs mb-2" style={{ color: "var(--oc-text)", letterSpacing: "0.08em" }}>
                  CHEMISTRY I QUIZ
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                  15 questions covering atoms, subatomic particles, and the periodic table.
                </p>
              </div>
              <span className="font-heading text-xs self-center shrink-0" style={{ color: "var(--oc-blue)" }}>
                →
              </span>
            </div>
          </Link>
        </div>

      </div>
    </main>
  );
}
