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
          <span className="text-2xl font-heading" style={{ color: "var(--oc-green)" }}>⬡</span>
          <span className="font-heading hidden sm:block" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 tracking-widest" style={{ fontSize: "1rem" }}>
          {[["COURSES", "/courses"], ["PERIODIC TABLE", "/periodic-table"], ["DICTIONARY", "/dictionary"], ["UNITS", "/si-units"], ["MINI GAMES", "/mini-games"], ["ABOUT", "/who-we-are"]].map(([label, href]) => (
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
        <style>{`
          @keyframes sky-pulse {
            0%, 100% { box-shadow: 0 0 0 1px rgba(56,189,248,0.18), 0 0 18px rgba(56,189,248,0.08), inset 0 0 24px rgba(56,189,248,0.03); }
            50%       { box-shadow: 0 0 0 1px rgba(56,189,248,0.38), 0 0 36px rgba(56,189,248,0.18), inset 0 0 40px rgba(56,189,248,0.07); }
          }
          @keyframes hex-drift {
            0%   { transform: translateY(0px) rotate(0deg);   opacity: 0.13; }
            50%  { transform: translateY(-6px) rotate(4deg);  opacity: 0.22; }
            100% { transform: translateY(0px) rotate(0deg);   opacity: 0.13; }
          }
          @keyframes hex-drift-2 {
            0%   { transform: translateY(0px) rotate(-3deg);  opacity: 0.08; }
            50%  { transform: translateY(5px) rotate(2deg);   opacity: 0.16; }
            100% { transform: translateY(0px) rotate(-3deg);  opacity: 0.08; }
          }
          @keyframes scan-slide {
            0%   { transform: translateY(-100%); opacity: 0; }
            10%  { opacity: 1; }
            90%  { opacity: 1; }
            100% { transform: translateY(400%); opacity: 0; }
          }
          @keyframes badge-blink {
            0%, 80%, 100% { opacity: 1; }
            85%           { opacity: 0.4; }
          }
          @keyframes corner-creep {
            0%, 100% { width: 14px; height: 14px; }
            50%      { width: 20px; height: 20px; }
          }
          .course-card-sky:hover { background: rgba(56,189,248,0.05) !important; }
          .course-card-sky:hover .card-scan-line { animation-play-state: running; }
          .card-scan-line { animation-play-state: paused; }
          .course-card-sky:hover .card-start-arrow { letter-spacing: 0.18em; }
          .card-start-arrow { transition: letter-spacing 0.25s ease, color 0.2s ease; }
        `}</style>

        <div className="max-w-md animate-fade-up anim-d1" style={{ animationFillMode: "both" }}>
          <Link href="/courses/chemistry-1" className="block group">
            <div
              className="course-card-sky relative overflow-hidden p-6 flex flex-col gap-4 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(56,189,248,0.06) 0%, rgba(1,13,10,0.0) 55%, rgba(56,189,248,0.03) 100%)",
                border: "1px solid rgba(56,189,248,0.22)",
                animation: "sky-pulse 4s ease-in-out infinite",
                minHeight: "220px",
              }}
            >
              {/* Scan line (activates on hover) */}
              <div
                className="card-scan-line pointer-events-none absolute left-0 right-0 h-[1px]"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.6) 40%, rgba(56,189,248,0.9) 50%, rgba(56,189,248,0.6) 60%, transparent 100%)",
                  top: "20%",
                  animation: "scan-slide 2.2s linear infinite",
                  zIndex: 0,
                }}
              />

              {/* Ghost hex — large, top-right */}
              <div
                className="pointer-events-none absolute select-none font-heading"
                style={{ top: "-18px", right: "-10px", fontSize: "7rem", color: "rgb(56,189,248)", animation: "hex-drift 7s ease-in-out infinite", zIndex: 0, userSelect: "none" }}
              >⬡</div>

              {/* Ghost hex — small, bottom-left */}
              <div
                className="pointer-events-none absolute select-none font-heading"
                style={{ bottom: "10px", left: "-8px", fontSize: "3.2rem", color: "rgb(56,189,248)", animation: "hex-drift-2 9s ease-in-out infinite", zIndex: 0, userSelect: "none" }}
              >⬡</div>

              {/* Corner brackets */}
              <span className="pointer-events-none absolute" style={{ top: "-1px", left: "-1px", width: "14px", height: "14px", borderTop: "2px solid rgba(56,189,248,0.7)", borderLeft: "2px solid rgba(56,189,248,0.7)", animation: "corner-creep 4s ease-in-out infinite", zIndex: 1 }} />
              <span className="pointer-events-none absolute" style={{ bottom: "-1px", right: "-1px", width: "14px", height: "14px", borderBottom: "2px solid rgba(56,189,248,0.7)", borderRight: "2px solid rgba(56,189,248,0.7)", animation: "corner-creep 4s ease-in-out infinite 2s", zIndex: 1 }} />

              {/* Content */}
              <div className="relative flex flex-col gap-4" style={{ zIndex: 2 }}>

                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="font-heading" style={{ color: "rgba(56,189,248,0.45)", fontSize: "0.6rem", letterSpacing: "0.15em" }}>COURSE</span>
                    <span className="font-heading" style={{ color: "rgb(56,189,248)", fontSize: "1.6rem", lineHeight: 1, textShadow: "0 0 8px rgba(56,189,248,0.55), 0 0 22px rgba(56,189,248,0.25)" }}>01</span>
                  </div>
                  <span className="font-heading" style={{ color: "rgb(56,189,248)", fontSize: "0.55rem", letterSpacing: "0.14em", padding: "3px 8px", border: "1px solid rgba(56,189,248,0.35)", background: "rgba(56,189,248,0.08)", animation: "badge-blink 5s ease-in-out infinite" }}>[AVAILABLE]</span>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(56,189,248,0.5) 0%, rgba(56,189,248,0.12) 60%, transparent 100%)" }} />

                {/* Title */}
                <h2 className="font-heading leading-snug" style={{ color: "var(--oc-text)", fontSize: "0.72rem", letterSpacing: "0.1em", textShadow: "0 0 12px rgba(56,189,248,0.2)" }}>
                  CHEMISTRY I: GENERAL CHEMISTRY
                </h2>

                {/* Description */}
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--oc-text-muted)" }}>
                  Start from the ground up. Atoms, electrons, bonding, and the periodic table.
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(56,189,248,0.12)" }}>
                  <div className="flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(56,189,248,0.7)", boxShadow: "0 0 4px rgba(56,189,248,0.6)" }} />
                    ))}
                    <span style={{ color: "rgba(56,189,248,0.55)", fontSize: "0.58rem", letterSpacing: "0.12em", marginLeft: "4px" }}>3 LESSONS</span>
                  </div>
                  <span className="card-start-arrow font-heading" style={{ color: "rgb(56,189,248)", fontSize: "0.68rem", letterSpacing: "0.12em", textShadow: "0 0 8px rgba(56,189,248,0.7), 0 0 20px rgba(56,189,248,0.35)" }}>
                    START →
                  </span>
                </div>

              </div>
            </div>
          </Link>
        </div>

      </div>
    </main>
  );
}
