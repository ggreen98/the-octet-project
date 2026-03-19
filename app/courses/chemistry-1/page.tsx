import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";

export const metadata = {
  title: "Chemistry I: General Chemistry — Allylic",
  description: "Start from the ground up. Atoms, electrons, bonding, and the periodic table.",
};

// r, g, b for each unit — used to build rgba() strings at varying opacities
const UNIT_COLORS: Record<string, [number, number, number]> = {
  "UNIT 1": [56, 189, 248],   // sky blue
  "UNIT 2": [167, 139, 250],  // violet
  "UNIT 3": [52, 211, 153],   // emerald
  "UNIT 4": [251, 146, 60],   // orange
};

const units = [
  {
    unit: "UNIT 1",
    title: "THE ATOMIC WORLD",
    quiz: { href: "/courses/chemistry-1/quiz", title: "UNIT 1 QUIZ", description: "15 questions covering atoms, subatomic particles, and the periodic table." },
    lessons: [
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
    ],
  },
  {
    unit: "UNIT 2",
    title: "ELECTRONS & ENERGY",
    lessons: [
      {
        id: "2.1",
        title: "ELECTRON SHELLS",
        description: "Electrons don't orbit randomly — they occupy specific energy levels called shells. Learn the rules that govern where electrons live.",
        href: "/courses/chemistry-1/lessons/electron-shells",
      },
      {
        id: "2.2",
        title: "VALENCE ELECTRONS",
        description: "The electrons in the outermost shell are the ones that do all the chemistry. Learn how many each element has and why it determines almost everything about how it behaves.",
        href: "/courses/chemistry-1/lessons/valence-electrons",
      },
      {
        id: "2.3",
        title: "ELECTRON CONFIGURATION",
        description: "A precise address for every electron — learn to read and write configurations, understand the s/p/d blocks, and see why the periodic table is shaped the way it is.",
        href: "/courses/chemistry-1/lessons/electron-configuration",
      },
    ],
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
          <span className="text-2xl font-heading" style={{ color: "var(--oc-green)" }}>⬡</span>
          <span className="font-heading" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 tracking-widest" style={{ fontSize: "0.85rem", color: "var(--oc-green-dim)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <span style={{ color: "var(--oc-green)" }}>CHEMISTRY I</span>
        </div>

        <div className="flex items-center gap-3">
          <MobileNav activeLabel="COURSES" />
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
        <div className="flex flex-col gap-10">
          {units.map((unit, ui) => {
            const [r, g, b] = UNIT_COLORS[unit.unit] ?? [114, 184, 114];
            const c = (a: number) => `rgba(${r},${g},${b},${a})`;
            return (
            <div key={unit.unit}>
              {/* Unit header */}
              <div
                className="flex items-center gap-4 mb-4"
                style={{ borderTop: ui > 0 ? `1px solid ${c(0.2)}` : undefined, paddingTop: ui > 0 ? "2.5rem" : undefined }}
              >
                <span className="font-heading text-xs shrink-0" style={{ color: c(0.9), letterSpacing: "0.15em" }}>
                  {unit.unit}
                </span>
                <span className="font-heading text-xs" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.12em" }}>
                  {unit.title}
                </span>
              </div>

              {/* Lessons — ramp from light to dark */}
              <div className="flex flex-col gap-4">
                {unit.lessons.map((lesson, li) => {
                  const bgOpacity  = 0.03 + li * 0.03;
                  const bdrOpacity = 0.2  + li * 0.15;
                  return (
                  <Link key={lesson.id} href={lesson.href} className="block group">
                    <div
                      className="flex gap-6 p-5 transition-all duration-200"
                      style={{
                        border: `1px solid ${c(bdrOpacity)}`,
                        background: c(bgOpacity),
                      }}
                    >
                      <span className="font-heading text-sm shrink-0 mt-0.5" style={{ color: c(0.7) }}>
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
                      <span className="font-heading text-xs self-center shrink-0" style={{ color: c(0.8) }}>
                        →
                      </span>
                    </div>
                  </Link>
                  );
                })}

                {/* Quiz — final boss */}
                {unit.quiz && (
                  <>
                    <style>{`
                      @keyframes quiz-pulse {
                        0%, 100% { box-shadow: 0 0 8px 1px rgba(212,147,62,0.25), inset 0 0 20px rgba(212,147,62,0.03); }
                        50%       { box-shadow: 0 0 18px 4px rgba(212,147,62,0.45), inset 0 0 30px rgba(212,147,62,0.07); }
                      }
                      @keyframes quiz-shimmer {
                        0%   { background-position: -200% center; }
                        100% { background-position: 200% center; }
                      }
                      @keyframes quiz-sheen {
                        0%        { transform: translateX(-120%) skewX(-12deg); opacity: 0; }
                        5%        { opacity: 1; }
                        20%       { transform: translateX(220%) skewX(-12deg); opacity: 0; }
                        100%      { transform: translateX(220%) skewX(-12deg); opacity: 0; }
                      }
                      .quiz-boss { animation: quiz-pulse 2.8s ease-in-out infinite; }
                      .quiz-boss:hover { animation: none; box-shadow: 0 0 28px 6px rgba(212,147,62,0.6), inset 0 0 40px rgba(212,147,62,0.1); }
                      .quiz-sheen { animation: quiz-sheen 5s ease-in-out infinite; }
                      .quiz-boss-title {
                        background: linear-gradient(90deg, #d4933e 0%, #f5d08a 40%, #d4933e 60%, #a8601a 100%);
                        background-size: 200% auto;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        animation: quiz-shimmer 3s linear infinite;
                      }
                    `}</style>
                    <Link href={unit.quiz.href} className="block group">
                      <div
                        className="quiz-boss relative overflow-hidden flex gap-6 p-5 transition-all duration-200"
                        style={{
                          border: "1px solid rgba(212,147,62,0.5)",
                          background: "linear-gradient(135deg, rgba(212,147,62,0.06) 0%, rgba(212,147,62,0.02) 50%, rgba(165,100,20,0.05) 100%)",
                        }}
                      >
                        <span
                          className="quiz-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3"
                          style={{ background: "linear-gradient(90deg, transparent, rgba(245,208,138,0.18), transparent)" }}
                        />
                        <span className="font-heading text-sm shrink-0 mt-0.5" style={{ color: "#d4933e" }}>⚔</span>
                        <div className="flex-1 min-w-0">
                          <h2 className="quiz-boss-title font-heading text-xs mb-2" style={{ letterSpacing: "0.08em" }}>
                            {unit.quiz.title}
                          </h2>
                          <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                            {unit.quiz.description}
                          </p>
                        </div>
                        <span className="font-heading text-xs self-center shrink-0" style={{ color: "#d4933e" }}>→</span>
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </div>
            );
          })}
        </div>


      </div>
    </main>
  );
}
