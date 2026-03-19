import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ValenceStrategyGame } from "@/components/lessons/ValenceStrategyGame";

export const metadata = {
  title: "Mini Games — Allylic",
  description: "Practice chemistry concepts through interactive mini games. Each game is built around a specific lesson.",
};

const GAMES = [
  {
    id: "valence-strategy",
    title: "VALENCE STRATEGY",
    description: "Given an element, decide whether it tends to lose, gain, share, or hold onto its valence electrons. Covers all main-group elements from the first three periods.",
    lesson: "CHEMISTRY I — LESSON 2.2",
    lessonHref: "/courses/chemistry-1/lessons/valence-electrons",
    tags: ["VALENCE ELECTRONS", "OCTET RULE", "REACTIVITY"],
  },
];

export default function MiniGamesPage() {
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
          <span className="font-heading hidden sm:block" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 tracking-widest" style={{ fontSize: "1rem" }}>
          {[
            ["COURSES",        "/courses"],
            ["PERIODIC TABLE", "/periodic-table"],
            ["DICTIONARY",     "/dictionary"],
            ["UNITS",          "/si-units"],
            ["MINI GAMES",     "/mini-games"],
            ["ABOUT",          "/who-we-are"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="transition-colors duration-200 hover:text-white"
              style={{ color: label === "MINI GAMES" ? "var(--oc-green)" : "var(--oc-text-dim)" }}
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
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-14 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-heading text-xs px-2 py-0.5"
            style={{ background: "var(--oc-green-badge)", color: "var(--oc-green)", border: "1px solid var(--oc-green-subtle)", letterSpacing: "0.12em" }}
          >
            INTERACTIVE
          </span>
        </div>

        <h1
          className="font-heading leading-none mb-4"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          MINI GAMES
        </h1>
        <p className="text-base leading-relaxed mb-16 max-w-xl" style={{ color: "var(--oc-text-muted)" }}>
          Practice chemistry concepts without going back to the lesson. Each game targets a specific
          idea — play it standalone or use it to review before a quiz.
        </p>

        {/* Games */}
        <div className="flex flex-col gap-16">
          {GAMES.map((game) => (
            <div key={game.id}>

              {/* Game header card */}
              <div
                className="flex flex-col sm:flex-row sm:items-start gap-5 p-5 mb-8"
                style={{
                  border: "1px solid rgba(167,139,250,0.25)",
                  background: "rgba(167,139,250,0.04)",
                  borderRadius: "4px",
                }}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2
                      className="font-heading"
                      style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
                    >
                      {game.title}
                    </h2>
                    <Link
                      href={game.lessonHref}
                      className="font-heading text-xs px-2 py-0.5 transition-colors hover:opacity-80"
                      style={{
                        background: "rgba(167,139,250,0.1)",
                        border: "1px solid rgba(167,139,250,0.25)",
                        color: "rgba(167,139,250,0.8)",
                        borderRadius: "3px",
                        letterSpacing: "0.08em",
                        fontSize: "0.55rem",
                      }}
                    >
                      ↗ {game.lesson}
                    </Link>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
                    {game.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map(tag => (
                      <span
                        key={tag}
                        className="font-heading text-xs px-2 py-0.5"
                        style={{
                          background: "var(--oc-green-badge)",
                          border: "1px solid var(--oc-green-subtle)",
                          color: "var(--oc-green-dim)",
                          borderRadius: "3px",
                          letterSpacing: "0.1em",
                          fontSize: "0.5rem",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Embedded game */}
              <ValenceStrategyGame />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
