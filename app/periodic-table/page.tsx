import Link from "next/link";
import { PeriodicTableExplorer } from "@/components/lessons/PeriodicTableExplorer";

export const metadata = {
  title: "Periodic Table — The Octet Project",
  description: "Interactive periodic table of all 118 elements. Hover any element to view its 3D atomic model, electron configuration, and key properties.",
};

export default function PeriodicTablePage() {
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
          <span style={{ color: "#00ff41" }}>PERIODIC TABLE</span>
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
      <div className="pt-14 px-6 md:px-12 lg:px-20 py-14 max-w-screen-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(0,255,65,0.45)" }}>
            // REFERENCE
          </p>
          <h1
            className="font-heading leading-none mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em", color: "#c8e8ff" }}
          >
            PERIODIC TABLE
          </h1>
          <p className="text-sm max-w-2xl" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            All 118 known elements organised by atomic number. Hover any element to view its 3D atomic model,
            electron configuration, and key properties.
          </p>
        </div>

        {/* Table */}
        <PeriodicTableExplorer />

      </div>
    </main>
  );
}
