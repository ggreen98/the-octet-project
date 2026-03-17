import Link from "next/link";
import { PaperHalving } from "@/components/lessons/PaperHalving";

export const metadata = {
  title: "Atoms — Chemistry I | The Octet Project",
  description: "How small is an atom? Rip a piece of paper in half — over and over — to find out.",
};

export default function AtomsLesson() {
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
          <span style={{ color: "#00ff41" }}>ATOMS</span>
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
            LESSON 01
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
          ATOMS
        </h1>
        <p className="text-sm leading-relaxed mb-12 max-w-2xl" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
          What are things made out of? To answer that question we must first engage in a thought experiment.
          How many times can you rip a piece of paper in half and still have paper?
        </p>

        {/* Visualization */}
        <PaperHalving />

        {/* Next lesson */}
        <div className="flex justify-end mt-16 pt-8" style={{ borderTop: "1px solid rgba(0, 255, 65, 0.08)" }}>
          <Link
            href="/courses/chemistry-1/lessons/protons-neutrons-electrons"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ background: "#4499ff", color: "#010d0a", letterSpacing: "0.15em" }}
          >
            NEXT: PROTONS, NEUTRONS & ELECTRONS →
          </Link>
        </div>
      </div>
    </main>
  );
}
