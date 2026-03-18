import Link from "next/link";
import { OrbitalCanvas } from "@/components/molecules/OrbitalCanvas";
import { HexDotGrid } from "@/components/ui/HexDotGrid";
import { NavTitle } from "@/components/ui/NavTitle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const courses = [
  { id: "01", title: "CHEMISTRY I: GENERAL CHEMISTRY", progress: 100, status: "COMPLETE", lessons: 8 },
  { id: "02", title: "CHEMICAL BONDING", progress: 72, status: "ACTIVE", lessons: 10 },
  { id: "03", title: "MOLECULAR GEOMETRY", progress: 35, status: "ACTIVE", lessons: 7 },
  { id: "04", title: "THERMODYNAMICS", progress: 0, status: "LOCKED", lessons: 12 },
  { id: "05", title: "ORGANIC CHEMISTRY", progress: 0, status: "LOCKED", lessons: 15 },
  { id: "06", title: "REACTION KINETICS", progress: 0, status: "LOCKED", lessons: 9 },
];

const capabilities = [
  {
    title: "3D MOLECULAR VIEWER",
    body: "Rotate, zoom, and inspect molecular structures in real-time. Every bond angle, every orbital, every atom — rendered precisely.",
    icon: "⬡",
  },
  {
    title: "GUIDED LESSONS",
    body: "Structured courses built from the atomic level up, each broken into focused lessons. From electron configuration to complex organic reactions.",
    icon: "◈",
  },
  {
    title: "PROGRESS TRACKING",
    body: "Track mastery across every module. Unlock advanced content as your understanding deepens. Your data, your pace.",
    icon: "◎",
  },
];

export default function Home() {
  return (
    <main
      className="scanlines font-terminal min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "var(--oc-bg)", color: "var(--oc-text)" }}
    >
      {/* Hex dot grid background */}
      <HexDotGrid />

      {/* Boot scan line */}
      <div className="boot-scan" />

      {/* ── Page content (sits above canvas z:0) ────────── */}
      <div className="relative" style={{ zIndex: 2 }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 md:px-12 h-16"
        style={{
          background: "var(--oc-nav-bg)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: "1px solid var(--oc-green-border-dim)",
          boxShadow: "inset 0 1px 0 rgba(180,210,255,0.1)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <NavTitle />
        </Link>

        <div className="hidden md:flex items-center gap-8 tracking-widest absolute left-1/2 -translate-x-1/2" style={{ fontSize: "1rem" }}>
          {[
            { label: "COURSES",        href: "/courses" },
            { label: "PERIODIC TABLE", href: "/periodic-table" },
            { label: "DICTIONARY",     href: "/dictionary" },
            { label: "ABOUT",          href: "/about" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="transition-colors duration-200 hover:text-white"
              style={{ color: "var(--oc-text-sub)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col lg:flex-row pt-14">
        {/* Left: Text */}
        <div className="flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 lg:py-0 lg:w-[55%] z-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-8 animate-fade-up flicker-amber-1" style={{ animationFillMode: "both" }}>
            <span style={{ color: "var(--oc-green)", fontSize: "1rem" }}>⬡</span>
            <span
              className="tracking-widest"
              style={{ color: "var(--oc-green)", fontSize: "0.85rem" }}
            >
              CHEMISTRY EDUCATION, REIMAGINED
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading leading-none mb-8 animate-flicker"
            style={{ fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
          >
            <span className="block animate-fade-up anim-d2" style={{ animationFillMode: "both" }}>THE</span>
            <span className="block animate-fade-up anim-d3" style={{ animationFillMode: "both" }}>CHEMICAL</span>
            <span className="block glow-blue animate-fade-up anim-d4" style={{ color: "var(--oc-blue)", animationFillMode: "both" }}>WORLD,</span>
            <span className="block animate-fade-up anim-d5" style={{ animationFillMode: "both" }}>DECODED.</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-sm md:text-base leading-relaxed mb-10 max-w-md animate-fade-up anim-d5 flicker-amber-2"
            style={{ color: "var(--oc-green)", animationFillMode: "both" }}
          >
            Interactive 3D molecular visualization and guided chemistry lessons.
            See what textbooks can&apos;t show you — from electron orbitals to
            organic reactions.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-up anim-d6" style={{ animationFillMode: "both" }}>
            <Link
              href="/signup"
              className="font-heading text-xs px-7 py-3.5 transition-all duration-200 animate-pulse-glow-amber"
              style={{ background: "var(--oc-blue)", color: "var(--oc-btn-text)", letterSpacing: "0.15em" }}
            >
              SIGN UP →
            </Link>
            <Link
              href="/courses"
              className="font-heading text-xs px-7 py-3.5 transition-all duration-200"
              style={{ border: "1px solid rgba(68, 153, 255, 0.35)", color: "var(--oc-blue)", background: "transparent", letterSpacing: "0.15em" }}
            >
              EXPLORE COURSES
            </Link>
          </div>

        </div>

        {/* Right: 3D Orbital */}
        <div className="lg:w-[45%] lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] h-[55vw] min-h-[300px] relative flex flex-col">
          <div className="flex-1 relative">
            <OrbitalCanvas />
          </div>

          {/* Caption */}
          <div
            className="text-center tracking-widest pb-4 lg:pb-6"
            style={{ color: "var(--oc-text-dim)", fontSize: "0.85rem", marginTop: "-6rem" }}
          >
            <span className="animate-blink" style={{ color: "var(--oc-green-dim)" }}>■</span>
            {" "}DRAG TO ROTATE{" "}
            <span className="animate-blink" style={{ color: "var(--oc-green-dim)", animationDelay: "0.5s" }}>■</span>
          </div>
        </div>
      </section>


      {/* ── CAPABILITIES ────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 py-24">
        <div className="mb-14">
          <p className="text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)" }}>
            FEATURES
          </p>
          <h2
            className="font-heading text-2xl md:text-4xl"
            style={{ color: "var(--oc-text)", letterSpacing: "-0.01em" }}
          >
            WHAT YOU GET
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div key={cap.title} className="crt-card p-7" style={{ minHeight: "220px" }}>
              <div className="text-2xl mb-5" style={{ color: "var(--oc-green)" }}>
                {cap.icon}
              </div>
              <h3
                className="font-heading text-xs mb-4 glow-subtle"
                style={{ color: "var(--oc-green)", letterSpacing: "0.1em" }}
              >
                {cap.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-sub)" }}>
                {cap.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODULE GRID ─────────────────────────────────── */}
      <section
        className="px-6 md:px-16 lg:px-24 py-24"
        style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}
      >
        <div className="mb-14">
          <p className="text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)" }}>
            COURSES
          </p>
          <h2
            className="font-heading text-2xl md:text-4xl"
            style={{ color: "var(--oc-text)", letterSpacing: "-0.01em" }}
          >
            THE CURRICULUM
          </h2>
        </div>

        <div className="space-y-3 max-w-3xl">
          {courses.map((course, i) => (
            <div
              key={course.id}
              className="flex items-center gap-4 md:gap-6 px-5 py-4"
              style={{
                background: course.status === "LOCKED" ? "transparent" : "var(--oc-green-bg)",
                border: "1px solid var(--oc-green-border-dim)",
                opacity: course.status === "LOCKED" ? 0.42 : 1,
              }}
            >
              <span className="font-heading text-xs w-8 shrink-0" style={{ color: "var(--oc-text-dim)" }}>
                {course.id}
              </span>

              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className="font-heading text-xs tracking-wider"
                  style={{
                    color:
                      course.status === "ACTIVE" ? "var(--oc-blue-muted)" :
                      course.status === "COMPLETE" ? "var(--oc-text-sub)" :
                      "var(--oc-text-faint)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {course.title}
                </span>
                <span className="text-xs mt-0.5" style={{ color: "var(--oc-green-dim)", fontSize: "0.58rem", letterSpacing: "0.1em" }}>
                  {course.lessons} LESSONS
                </span>
              </div>

              {/* Progress bar */}
              <div className="hidden sm:flex items-center gap-3 w-44">
                <div className="flex-1 h-px" style={{ background: "var(--oc-green-subtle)" }}>
                  <div
                    className="h-full bar-fill"
                    style={{
                      width: `${course.progress}%`,
                      background: course.progress === 100 ? "var(--oc-green)" : "var(--oc-green-dim)",
                      animationDelay: `${0.3 + i * 0.1}s`,
                    }}
                  />
                </div>
                <span className="text-xs w-7 text-right" style={{ color: "var(--oc-text-dim)" }}>
                  {course.progress}%
                </span>
              </div>

              <span
                className="text-xs tracking-widest shrink-0"
                style={{
                  color:
                    course.status === "ACTIVE" ? "var(--oc-amber)" :
                    course.status === "COMPLETE" ? "var(--oc-green)" :
                    "var(--oc-text-hint)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.15em",
                }}
              >
                {course.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section
        className="px-6 md:px-16 lg:px-24 py-24"
        style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}
      >
        <div className="mb-14">
          <p className="text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)" }}>
            HOW IT WORKS
          </p>
          <h2
            className="font-heading text-2xl md:text-4xl"
            style={{ color: "var(--oc-text)", letterSpacing: "-0.01em" }}
          >
            HOW IT WORKS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-4xl">
          {[
            {
              step: "01",
              title: "CHOOSE A COURSE",
              body: "Pick a topic from the curriculum. Each course builds on the last — start at atomic structure or jump to what you need.",
            },
            {
              step: "02",
              title: "VISUALIZE IN 3D",
              body: "Every lesson includes interactive molecular models. Rotate them. Explore bond angles. See chemistry instead of memorizing it.",
            },
            {
              step: "03",
              title: "TRACK YOUR MASTERY",
              body: "Complete lessons, answer questions, and watch your progress build. Advanced modules unlock as your understanding grows.",
            },
          ].map((step, i) => (
            <div
              key={step.step}
              className="p-6 md:p-8"
              style={{ borderRight: i < 2 ? "1px solid var(--oc-green-border-dim)" : "none" }}
            >
              <div
                className="font-heading text-5xl mb-5"
                style={{ color: "var(--oc-green-subtle)" }}
              >
                {step.step}
              </div>
              <h3
                className="font-heading text-xs mb-3"
                style={{ color: "var(--oc-green)", letterSpacing: "0.1em" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section
        className="px-6 md:px-16 lg:px-24 py-32 text-center relative overflow-hidden"
        style={{
          borderTop: "1px solid var(--oc-green-border-dim)",
          background: "var(--oc-green-bg-surface)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, var(--oc-green-subtle) 0%, transparent 65%)",
          }}
        />

        <p className="text-xs tracking-widest mb-6 relative" style={{ color: "var(--oc-green-dim)" }}>
          GET STARTED
        </p>

        <h2
          className="font-heading mb-6 leading-tight relative"
          style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", color: "var(--oc-blue)", letterSpacing: "-0.02em" }}
        >
          START LEARNING
          <br />
          <span className="glow-blue" style={{ color: "var(--oc-blue)" }}>
            FOR FREE
          </span>
        </h2>

        <p className="text-sm mb-12 max-w-md mx-auto relative" style={{ color: "var(--oc-text-muted)" }}>
          Join students exploring chemistry through the molecular lens. No
          credit card. No barriers. Just chemistry.
        </p>

        <Link
          href="/signup"
          className="font-heading text-sm px-10 py-4 inline-block transition-all duration-200 animate-pulse-glow relative"
          style={{ background: "var(--oc-blue)", color: "var(--oc-btn-text)", letterSpacing: "0.2em" }}
        >
          CREATE FREE ACCOUNT →
        </Link>

        <p className="mt-6 text-xs relative" style={{ color: "var(--oc-text-faint)" }}>
          No credit card required &nbsp;·&nbsp; Free forever plan
        </p>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer
        className="px-6 md:px-16 lg:px-24 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
        style={{ borderTop: "1px solid var(--oc-green-border-faint)", color: "var(--oc-text-faint)" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--oc-green)" }}>⬡</span>
          <span className="font-heading tracking-widest" style={{ letterSpacing: "0.15em" }}>
            ALLYLIC
          </span>
        </div>
        <div className="flex items-center gap-3" style={{ color: "var(--oc-text-hint)" }}>
          <span>CHEMISTRY</span>
          <span style={{ color: "var(--oc-text-faint)" }}>·</span>
          <span>EDUCATION</span>
          <span style={{ color: "var(--oc-text-faint)" }}>·</span>
          <span>3D</span>
        </div>
        <div>© {new Date().getFullYear()} ALLYLIC</div>
      </footer>

      </div>{/* end page content wrapper */}
    </main>
  );
}
