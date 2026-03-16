import Link from "next/link";
import { OrbitalCanvas } from "@/components/molecules/OrbitalCanvas";
import { HexDotGrid } from "@/components/ui/HexDotGrid";

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
    id: "SYS.01",
    title: "3D MOLECULAR VIEWER",
    body: "Rotate, zoom, and inspect molecular structures in real-time. Every bond angle, every orbital, every atom — rendered precisely.",
    icon: "⬡",
  },
  {
    id: "SYS.02",
    title: "GUIDED LESSON SYSTEM",
    body: "Structured courses built from the atomic level up, each broken into focused lessons. From electron configuration to complex organic reactions.",
    icon: "◈",
  },
  {
    id: "SYS.03",
    title: "PROGRESS TRACKING",
    body: "Track mastery across every module. Unlock advanced content as your understanding deepens. Your data, your pace.",
    icon: "◎",
  },
];

export default function Home() {
  return (
    <main
      className="scanlines font-terminal min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "#010d0a", color: "#c8e8ff" }}
    >
      {/* Hex dot grid background */}
      <HexDotGrid />

      {/* Boot scan line */}
      <div className="boot-scan" />

      {/* ── Page content (sits above canvas z:0) ────────── */}
      <div className="relative" style={{ zIndex: 2 }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14"
        style={{
          background: "rgba(1, 13, 10, 0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0, 255, 65, 0.1)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-heading" style={{ color: "#00ff41" }}>
            ⬡
          </span>
          <span
            className="font-heading text-sm hidden sm:block"
            style={{ color: "#c8e8ff", letterSpacing: "0.2em" }}
          >
            THE OCTET PROJECT
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-xs tracking-widest">
          {["COURSES", "MOLECULES", "ABOUT"].map((l) => (
            <Link
              key={l}
              href={`/${l.toLowerCase()}`}
              className="transition-colors duration-200"
              style={{ color: "rgba(180, 215, 255, 0.45)" }}
            >
              {l}
            </Link>
          ))}
        </div>

        <Link
          href="/signup"
          className="font-heading text-xs px-4 py-2 transition-all duration-200"
          style={{
            background: "#4499ff",
            color: "#010d0a",
            letterSpacing: "0.15em",
          }}
        >
          START FREE ▶
        </Link>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col lg:flex-row pt-14">
        {/* Left: Text */}
        <div className="flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 lg:py-0 lg:w-[55%] z-10">
          {/* Terminal boot line */}
          <div className="flex items-center gap-2 mb-8 animate-fade-up" style={{ animationFillMode: "both" }}>
            <span style={{ color: "#00ff41" }}>▶</span>
            <span
              className="typing-line text-xs tracking-widest"
              style={{ color: "rgba(0, 255, 65, 0.65)" }}
            >
              SYSTEM READY — THE OCTET PROJECT v1.0.0
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading leading-none mb-8 animate-flicker"
            style={{ fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)", letterSpacing: "-0.02em", color: "#c8e8ff" }}
          >
            <span className="block animate-fade-up anim-d2" style={{ animationFillMode: "both" }}>THE</span>
            <span className="block animate-fade-up anim-d3" style={{ animationFillMode: "both" }}>MOLECULAR</span>
            <span className="block glow-blue animate-fade-up anim-d4" style={{ color: "#4499ff", animationFillMode: "both" }}>WORLD,</span>
            <span className="block animate-fade-up anim-d5" style={{ animationFillMode: "both" }}>DECODED.</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-sm md:text-base leading-relaxed mb-10 max-w-md animate-fade-up anim-d5"
            style={{ color: "rgba(200, 255, 212, 0.55)", animationFillMode: "both" }}
          >
            Interactive 3D molecular visualization and guided chemistry lessons.
            See what textbooks can&apos;t show you — from electron orbitals to
            organic reactions.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-up anim-d6" style={{ animationFillMode: "both" }}>
            <Link
              href="/signup"
              className="font-heading text-xs px-7 py-3.5 transition-all duration-200 animate-pulse-glow"
              style={{ background: "#4499ff", color: "#010d0a", letterSpacing: "0.15em" }}
            >
              INITIALIZE SEQUENCE →
            </Link>
            <Link
              href="/molecules"
              className="font-heading text-xs px-7 py-3.5 transition-all duration-200"
              style={{ border: "1px solid rgba(68, 153, 255, 0.35)", color: "#4499ff", background: "transparent", letterSpacing: "0.15em" }}
            >
              EXPLORE MOLECULES
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex flex-wrap gap-6 text-xs animate-fade-up"
            style={{ color: "rgba(180, 215, 255, 0.4)", animationFillMode: "both", animationDelay: "0.9s" }}
          >
            {[["124+", "LESSONS"], ["300+", "MOLECULES"], ["∞", "CURIOSITY"]].map(
              ([val, label]) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <span className="font-heading text-base glow-subtle" style={{ color: "#00ff41" }}>
                    {val}
                  </span>
                  <span>{label}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right: 3D Orbital */}
        <div className="lg:w-[45%] lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] h-[55vw] min-h-[300px] relative flex flex-col">
          <div className="flex-1 relative">
            <OrbitalCanvas />
          </div>

          {/* Caption */}
          <div
            className="text-center text-xs tracking-widest py-3 lg:pb-5"
            style={{ color: "rgba(180, 215, 255, 0.28)" }}
          >
            <span className="animate-blink" style={{ color: "rgba(0,255,65,0.4)" }}>■</span>
            {" "}DRAG TO ROTATE{" "}
            <span className="animate-blink" style={{ color: "rgba(0,255,65,0.4)", animationDelay: "0.5s" }}>■</span>
          </div>

          {/* Floating element badge */}
          <div
            className="absolute top-8 right-6 crt-card px-3 py-2 text-xs"
            style={{ color: "#ffb300" }}
          >
            <div className="font-heading text-xl glow-amber leading-none">O</div>
            <div style={{ color: "rgba(255, 179, 0, 0.55)", fontSize: "0.58rem", letterSpacing: "0.1em" }}>
              OXYGEN
            </div>
            <div style={{ color: "rgba(255, 179, 0, 0.35)", fontSize: "0.58rem" }}>
              Z = 8
            </div>
          </div>
        </div>
      </section>

      {/* ── STATUS BAR ──────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-between px-6 md:px-16 lg:px-24 py-3 text-xs gap-4"
        style={{
          borderTop: "1px solid rgba(0, 255, 65, 0.1)",
          borderBottom: "1px solid rgba(0, 255, 65, 0.1)",
          background: "rgba(0, 255, 65, 0.02)",
        }}
      >
        {[
          { label: "SYSTEM ONLINE", dot: true },
          { label: "NODE v24.14.0" },
          { label: "RENDERING: WebGL 2.0" },
          { label: "BUILD: STABLE" },
          { label: "FREE ACCESS: ENABLED", amber: true },
        ].map(({ label, dot, amber }) => (
          <span
            key={label}
            className="flex items-center gap-1.5"
            style={{ color: amber ? "#ffb300" : "rgba(180, 215, 255, 0.35)" }}
          >
            {dot && (
              <span
                className="inline-block w-1.5 h-1.5 rounded-full animate-blink"
                style={{ background: "#00ff41" }}
              />
            )}
            {label}
          </span>
        ))}
      </div>

      {/* ── CAPABILITIES ────────────────────────────────── */}
      <section className="px-6 md:px-16 lg:px-24 py-24">
        <div className="mb-14">
          <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(0, 255, 65, 0.45)" }}>
            // SYSTEM CAPABILITIES
          </p>
          <h2
            className="font-heading text-2xl md:text-4xl"
            style={{ color: "#c8e8ff", letterSpacing: "-0.01em" }}
          >
            WHAT YOU GET
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div key={cap.id} className="crt-card p-7" style={{ minHeight: "220px" }}>
              <div className="text-2xl mb-5" style={{ color: "#00ff41" }}>
                {cap.icon}
              </div>
              <div className="text-xs tracking-widest mb-3" style={{ color: "rgba(0, 255, 65, 0.35)" }}>
                [{cap.id}]
              </div>
              <h3
                className="font-heading text-xs mb-4 glow-subtle"
                style={{ color: "#00ff41", letterSpacing: "0.1em" }}
              >
                {cap.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(180, 215, 255, 0.6)" }}>
                {cap.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODULE GRID ─────────────────────────────────── */}
      <section
        className="px-6 md:px-16 lg:px-24 py-24"
        style={{ borderTop: "1px solid rgba(0, 255, 65, 0.08)" }}
      >
        <div className="mb-14">
          <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(0, 255, 65, 0.45)" }}>
            // AVAILABLE COURSES
          </p>
          <h2
            className="font-heading text-2xl md:text-4xl"
            style={{ color: "#c8e8ff", letterSpacing: "-0.01em" }}
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
                background: course.status === "LOCKED" ? "rgba(0,255,65,0.01)" : "rgba(0,255,65,0.04)",
                border: "1px solid rgba(0, 255, 65, 0.1)",
                opacity: course.status === "LOCKED" ? 0.42 : 1,
              }}
            >
              <span className="font-heading text-xs w-8 shrink-0" style={{ color: "rgba(0, 255, 65, 0.35)" }}>
                {course.id}
              </span>

              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className="font-heading text-xs tracking-wider"
                  style={{
                    color:
                      course.status === "ACTIVE" ? "#7bbfff" :
                      course.status === "COMPLETE" ? "rgba(180, 215, 255, 0.75)" :
                      "rgba(180, 215, 255, 0.25)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {course.title}
                </span>
                <span className="text-xs mt-0.5" style={{ color: "rgba(0, 255, 65, 0.3)", fontSize: "0.58rem", letterSpacing: "0.1em" }}>
                  {course.lessons} LESSONS
                </span>
              </div>

              {/* Progress bar */}
              <div className="hidden sm:flex items-center gap-3 w-44">
                <div className="flex-1 h-px" style={{ background: "rgba(0,255,65,0.12)" }}>
                  <div
                    className="h-full bar-fill"
                    style={{
                      width: `${course.progress}%`,
                      background: course.progress === 100 ? "#00ff41" : "rgba(0,255,65,0.45)",
                      animationDelay: `${0.3 + i * 0.1}s`,
                    }}
                  />
                </div>
                <span className="text-xs w-7 text-right" style={{ color: "rgba(0,255,65,0.35)" }}>
                  {course.progress}%
                </span>
              </div>

              <span
                className="text-xs tracking-widest shrink-0"
                style={{
                  color:
                    course.status === "ACTIVE" ? "#ffb300" :
                    course.status === "COMPLETE" ? "#00ff41" :
                    "rgba(180, 215, 255, 0.18)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.15em",
                }}
              >
                [{course.status}]
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section
        className="px-6 md:px-16 lg:px-24 py-24"
        style={{ borderTop: "1px solid rgba(0, 255, 65, 0.08)" }}
      >
        <div className="mb-14">
          <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(0, 255, 65, 0.45)" }}>
            // MISSION BRIEFING
          </p>
          <h2
            className="font-heading text-2xl md:text-4xl"
            style={{ color: "#c8e8ff", letterSpacing: "-0.01em" }}
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
              style={{ borderRight: i < 2 ? "1px solid rgba(0,255,65,0.1)" : "none" }}
            >
              <div
                className="font-heading text-5xl mb-5"
                style={{ color: "rgba(0, 255, 65, 0.12)" }}
              >
                {step.step}
              </div>
              <h3
                className="font-heading text-xs mb-3"
                style={{ color: "#00ff41", letterSpacing: "0.1em" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(180, 215, 255, 0.55)" }}>
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
          borderTop: "1px solid rgba(0, 255, 65, 0.1)",
          background: "rgba(0, 255, 65, 0.015)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(0, 255, 65, 0.07) 0%, transparent 65%)",
          }}
        />

        <p className="text-xs tracking-widest mb-6 relative" style={{ color: "rgba(0, 255, 65, 0.45)" }}>
          // READY TO BEGIN?
        </p>

        <h2
          className="font-heading mb-6 leading-tight relative"
          style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", color: "#4499ff", letterSpacing: "-0.02em" }}
        >
          INITIALIZE YOUR
          <br />
          <span className="glow-blue" style={{ color: "#4499ff" }}>
            FREE ACCOUNT
          </span>
        </h2>

        <p className="text-sm mb-12 max-w-md mx-auto relative" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
          Join students exploring chemistry through the molecular lens. No
          credit card. No barriers. Just chemistry.
        </p>

        <Link
          href="/signup"
          className="font-heading text-sm px-10 py-4 inline-block transition-all duration-200 animate-pulse-glow relative"
          style={{ background: "#4499ff", color: "#010d0a", letterSpacing: "0.2em" }}
        >
          INITIALIZE FREE ACCOUNT →
        </Link>

        <p className="mt-6 text-xs relative" style={{ color: "rgba(180, 215, 255, 0.25)" }}>
          No credit card required &nbsp;·&nbsp; Free forever plan
        </p>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer
        className="px-6 md:px-16 lg:px-24 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
        style={{ borderTop: "1px solid rgba(0, 255, 65, 0.08)", color: "rgba(180, 215, 255, 0.25)" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "#00ff41" }}>⬡</span>
          <span className="font-heading tracking-widest" style={{ letterSpacing: "0.15em" }}>
            THE OCTET PROJECT
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="animate-blink" style={{ color: "rgba(0,255,65,0.35)" }}>▶</span>
          <span>SYSTEM NOMINAL</span>
          <span className="animate-blink" style={{ color: "rgba(0,255,65,0.35)", animationDelay: "0.5s" }}>_</span>
        </div>
        <div>© {new Date().getFullYear()} THE OCTET PROJECT</div>
      </footer>

      </div>{/* end page content wrapper */}
    </main>
  );
}
