import Link from "next/link";
import { MagnetSim } from "@/components/lessons/MagnetSim";

export const metadata = {
  title: "Protons, Neutrons & Electrons — Chemistry I | The Octet Project",
  description: "Meet the three subatomic particles that make up every atom in the universe.",
};

export default function SubatomicParticlesLesson() {
  return (
    <main
      className="scanlines font-terminal min-h-screen"
      style={{ backgroundColor: "#010d0a", color: "#c8e8ff" }}
    >
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
          <span className="text-xl font-heading" style={{ color: "#00ff41" }}>⬡</span>
          <span className="font-heading text-sm hidden sm:block" style={{ color: "#c8e8ff", letterSpacing: "0.2em" }}>
            THE OCTET PROJECT
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-xs tracking-widest" style={{ color: "rgba(0, 255, 65, 0.4)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "rgba(0, 255, 65, 0.2)" }}>›</span>
          <Link href="/courses/chemistry-1" className="hover:text-green-400 transition-colors">CHEMISTRY I</Link>
          <span style={{ color: "rgba(0, 255, 65, 0.2)" }}>›</span>
          <span style={{ color: "#00ff41" }}>PROTONS, NEUTRONS & ELECTRONS</span>
        </div>

        <Link
          href="/signup"
          className="font-heading text-xs px-4 py-2"
          style={{ background: "#4499ff", color: "#010d0a", letterSpacing: "0.15em" }}
        >
          START FREE ▶
        </Link>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-14 px-6 md:px-12 lg:px-20 py-14 max-w-6xl mx-auto">

        {/* Lesson label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-heading text-xs px-2 py-0.5" style={{ background: "rgba(0,255,65,0.08)", color: "#00ff41", border: "1px solid rgba(0,255,65,0.2)", letterSpacing: "0.12em" }}>
            LESSON 02
          </span>
          <span className="text-xs tracking-widest" style={{ color: "rgba(0, 255, 65, 0.35)" }}>
            CHEMISTRY I: GENERAL CHEMISTRY
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-heading leading-none mb-4"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em", color: "#c8e8ff" }}
        >
          PROTONS, NEUTRONS & ELECTRONS
        </h1>
        <p className="text-sm leading-relaxed mb-12 max-w-2xl" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
          Meet the three building blocks hiding inside every atom in the universe.
        </p>

        {/* ── MAGNET SIM ──────────────────────────────────── */}
        <div className="mb-16">
          <MagnetSim />
        </div>

        {/* ── PROTONS ─────────────────────────────────────── */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-widest mb-4" style={{ color: "rgba(0, 255, 65, 0.45)" }}>// PROTONS</p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            As we discovered in the last lesson, protons live in the atom&apos;s centre — its nucleus.
            They carry a positive charge, and it is this positive charge that is responsible for giving
            every atom its identity. The number of protons in an atom determines what element it is —
            change the number of protons and you change the element entirely.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            But what exactly is a positive charge?
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            Let&apos;s do an experiment. Grab two magnets off your fridge and push them together —
            one of two things will happen. They will either snap together as if pulled by an invisible
            force, or resist your attempts as if an invisible hand is pushing back against you.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            These pushing and pulling forces are a result of charge. Charge is one of the most
            fundamental properties in nature — it describes whether something attracts or repels
            other things around it. Opposite charges attract, like charges repel. Protons carry a
            positive charge, and as we&apos;ll soon see, that has enormous consequences for how atoms
            behave.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16 pt-8" style={{ borderTop: "1px solid rgba(0, 255, 65, 0.08)" }}>
          <Link
            href="/courses/chemistry-1/lessons/atoms"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ border: "1px solid rgba(68,153,255,0.3)", color: "#4499ff", letterSpacing: "0.15em" }}
          >
            ← PREV: ATOMS
          </Link>
          <Link
            href="/courses/chemistry-1/lessons/the-periodic-table"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ background: "#4499ff", color: "#010d0a", letterSpacing: "0.15em" }}
          >
            NEXT: THE PERIODIC TABLE →
          </Link>
        </div>
      </div>
    </main>
  );
}
