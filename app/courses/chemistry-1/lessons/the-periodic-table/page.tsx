import Link from "next/link";
import { Term } from "@/components/ui/Term";
import { PeriodicTableExplorer } from "@/components/lessons/PeriodicTableExplorer";

export const metadata = {
  title: "Elements & The Periodic Table — Chemistry I | The Octet Project",
  description: "Discover how the periodic table organises every element in the universe by the number of protons in their nucleus.",
};

export default function PeriodicTableLesson() {
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
          <span style={{ color: "#00ff41" }}>ELEMENTS & THE PERIODIC TABLE</span>
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
            LESSON 03
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
          ELEMENTS & THE PERIODIC TABLE
        </h1>
        <p className="text-sm leading-relaxed mb-12 max-w-2xl" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
          Every atom in the universe belongs to one of 118 known <Term id="element">elements</Term> —
          and the <Term id="periodic-table">periodic table</Term> is the map that organises them all.
        </p>

        {/* ── WHAT IS AN ELEMENT ───────────────────────────── */}
        <div className="max-w-2xl mb-10">
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            At this point we have mentioned the concept of an <Term id="element">element</Term> a few times — but what exactly
            is one? Think of elements like scents of flowers or flavours of ice cream: each one is
            distinct, with its own unique characteristics and chemically different behaviour.
            No two elements are the same, and you cannot reduce one into another by ordinary means.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            As we touched on in the last lesson, an <Term id="element">element</Term> is defined entirely by the number of{" "}
            <Term id="proton">protons</Term> in an atom&apos;s <Term id="nucleus">nucleus</Term> — a value known as its{" "}
            <Term id="atomic-number">atomic number</Term>. Change the proton count and you change the element. Every single atom
            in the universe with one proton is hydrogen. Every atom with two protons is helium. It is
            that simple, and that absolute.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            The first few elements follow in order:
          </p>

          {/* Element list */}
          <div
            className="mb-4 font-terminal text-xs"
            style={{
              border: "1px solid rgba(0,255,65,0.1)",
              background: "rgba(0,255,65,0.03)",
              borderRadius: "4px",
              padding: "1rem 1.25rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "0.5rem 1.5rem",
            }}
          >
            {[
              { z: 1,  symbol: "H",  name: "Hydrogen"  },
              { z: 2,  symbol: "He", name: "Helium"     },
              { z: 3,  symbol: "Li", name: "Lithium"    },
              { z: 4,  symbol: "Be", name: "Beryllium"  },
              { z: 5,  symbol: "B",  name: "Boron"      },
              { z: 6,  symbol: "C",  name: "Carbon"     },
              { z: 7,  symbol: "N",  name: "Nitrogen"   },
              { z: 8,  symbol: "O",  name: "Oxygen"     },
              { z: 9,  symbol: "F",  name: "Fluorine"   },
              { z: 10, symbol: "Ne", name: "Neon"       },
            ].map(({ z, symbol, name }) => (
              <div key={z} className="flex items-baseline gap-2">
                <span style={{ color: "rgba(0,255,65,0.35)", minWidth: "1.5rem", textAlign: "right" }}>{z}</span>
                <span style={{ color: "#00ff41", minWidth: "2rem" }}>{symbol}</span>
                <span style={{ color: "rgba(200,255,212,0.55)" }}>{name}</span>
              </div>
            ))}
            <div className="flex items-baseline gap-2">
              <span style={{ color: "rgba(0,255,65,0.35)", minWidth: "1.5rem", textAlign: "right" }}>…</span>
              <span style={{ color: "rgba(200,255,212,0.3)" }}>and so on, up to element 118</span>
            </div>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            This numbered sequence — one <Term id="element">element</Term> per proton count, no gaps, no duplicates —
            is the backbone of the <Term id="periodic-table">periodic table</Term>. There are 118 known elements in total,
            ranging from hydrogen, the lightest and most abundant in the universe, all the way to oganesson,
            a synthetic element so unstable it exists for only milliseconds before decaying.
          </p>
        </div>

        {/* ── INTERACTIVE PERIODIC TABLE ───────────────────── */}
        <PeriodicTableExplorer />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16 pt-8" style={{ borderTop: "1px solid rgba(0, 255, 65, 0.08)" }}>
          <Link
            href="/courses/chemistry-1/lessons/protons-neutrons-electrons"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ border: "1px solid rgba(68,153,255,0.3)", color: "#4499ff", letterSpacing: "0.15em" }}
          >
            ← PREV: PROTONS, NEUTRONS & ELECTRONS
          </Link>
          <Link
            href="/courses/chemistry-1"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ background: "#4499ff", color: "#010d0a", letterSpacing: "0.15em" }}
          >
            BACK TO COURSE →
          </Link>
        </div>
      </div>
    </main>
  );
}
