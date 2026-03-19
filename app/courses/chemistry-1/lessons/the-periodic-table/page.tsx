import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { Term } from "@/components/ui/Term";
import { Unit } from "@/components/ui/Unit";
import { PeriodicTableExplorer } from "@/components/lessons/PeriodicTableExplorer";
import { LiCellAnnotated } from "@/components/lessons/LiCellAnnotated";

export const metadata = {
  title: "Elements & The Periodic Table — Chemistry I | Allylic",
  description: "Discover how the periodic table organises every element in the universe by the number of protons in their nucleus.",
};

export default function PeriodicTableLesson() {
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

        <div className="hidden md:flex items-center gap-2 tracking-widest" style={{ fontSize: "0.85rem", color: "var(--oc-green-dim)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <Link href="/courses/chemistry-1" className="hover:text-green-400 transition-colors">CHEMISTRY I</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <span style={{ color: "var(--oc-green)" }}>ELEMENTS & THE PERIODIC TABLE</span>
        </div>

        <div className="flex items-center gap-3">
          <MobileNav />
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-14 max-w-6xl mx-auto">

        {/* Lesson label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-heading text-xs px-2 py-0.5" style={{ background: "var(--oc-green-badge)", color: "var(--oc-green)", border: "1px solid var(--oc-green-subtle)", letterSpacing: "0.12em" }}>
            LESSON 1.3
          </span>
          <span className="text-xs tracking-widest" style={{ color: "var(--oc-text-dim)" }}>
            CHEMISTRY I: GENERAL CHEMISTRY
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-heading leading-none mb-4"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          ELEMENTS & THE PERIODIC TABLE
        </h1>
        <p className="text-base leading-relaxed mb-12 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          Every atom in the universe belongs to one of 118 known <Term id="element">elements</Term> —
          and the <Term id="periodic-table">periodic table</Term> is the map that organises them all.
        </p>

        {/* ── WHAT IS AN ELEMENT ───────────────────────────── */}
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            At this point we have mentioned the concept of an <Term id="element">element</Term> a few times — but what exactly
            is one? Think of elements like scents of flowers or flavours of ice cream: each one is
            distinct, with its own unique characteristics and chemically different behaviour.
            No two elements are the same, and you cannot reduce one into another by ordinary means.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            As we touched on in the last lesson, an <Term id="element">element</Term> is defined entirely by the number of{" "}
            <Term id="proton">protons</Term> in an atom&apos;s <Term id="nucleus">nucleus</Term> — a value known as its{" "}
            <Term id="atomic-number">atomic number</Term>. Change the proton count and you change the element. Every single atom
            in the universe with one proton is hydrogen. Every atom with two protons is helium. It is
            that simple, and that absolute.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            The first few elements follow in order:
          </p>

          {/* Element list */}
          <div
            className="mb-4 font-terminal text-xs"
            style={{
              border: "1px solid var(--oc-green-border-dim)",
              background: "var(--oc-green-bg-surface)",
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
                <span style={{ color: "var(--oc-text-dim)", minWidth: "1.5rem", textAlign: "right" }}>{z}</span>
                <span style={{ color: "var(--oc-green)", minWidth: "2rem" }}>{symbol}</span>
                <span style={{ color: "var(--oc-text-muted)" }}>{name}</span>
              </div>
            ))}
            <div className="flex items-baseline gap-2">
              <span style={{ color: "var(--oc-text-dim)", minWidth: "1.5rem", textAlign: "right" }}>…</span>
              <span style={{ color: "var(--oc-text-faint)" }}>and so on, up to element 118</span>
            </div>
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            This numbered sequence — one <Term id="element">element</Term> per proton count, no gaps, no duplicates —
            is the backbone of the <Term id="periodic-table">periodic table</Term>. There are 118 known elements in total,
            ranging from hydrogen, the lightest and most abundant in the universe, all the way to oganesson,
            a synthetic element so unstable it exists for only milliseconds before decaying.
          </p>
        </div>

        {/* ── INTERACTIVE PERIODIC TABLE ───────────────────── */}
        <PeriodicTableExplorer />

        {/* ── HOW TO READ A CELL ───────────────────────────── */}
        <div className="max-w-2xl mb-10 mt-10">
          <h2
            className="font-heading mb-4"
            style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
          >
            HOW TO READ A CELL
          </h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Each cell in the <Term id="periodic-table">periodic table</Term> packs three key pieces of information.
            The number in the top corner is the <Term id="atomic-number">atomic number</Term> — the count of{" "}
            <Term id="proton">protons</Term> in that element&apos;s <Term id="nucleus">nucleus</Term>, and the
            value that uniquely identifies it. The large symbol in the centre is the element&apos;s chemical
            abbreviation, used universally in equations, labels, and lab notation. Finally, the number at the
            bottom is the <Term id="atomic-mass-unit">atomic mass</Term> — the average mass of one atom of that
            element measured in <Unit id="atomic-mass-unit">atomic mass units</Unit> (<Unit id="atomic-mass-unit">u</Unit>), accounting for the natural mix of its <Term id="isotope">isotopes</Term>.
          </p>
          {/* ── ANNOTATED CELL DIAGRAM ───────────────────────── */}
          <div className="mb-8 mt-2">
            <p className="text-xs tracking-widest mb-6" style={{ color: "var(--oc-green-dim)" }}>
              // INTERACTIVE — ANATOMY OF A PERIODIC TABLE CELL
            </p>
            <LiCellAnnotated />
          </div>

          {/* ── WEIGHTED AVERAGE EXPLANATION ─────────────────── */}
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            That atomic mass is not arbitrary — it is the <strong style={{ color: "var(--oc-text)" }}>weighted average</strong> of
            all naturally occurring <Term id="isotope">isotopes</Term> of that element, weighted by how abundant
            each isotope is in nature. Because different samples of an element always contain isotopes in the
            same natural ratio, the weighted average is consistent everywhere on Earth — and is the number
            printed on every periodic table.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Lithium is a clean example. It has two stable isotopes: lithium-6 (3 neutrons) and lithium-7
            (4 neutrons). In any natural sample, about 7.6% of lithium atoms are Li-6 and 92.4% are Li-7.
            To find the weighted average you multiply each isotope&apos;s exact mass by its fractional
            abundance, then add the results:
          </p>

          {/* Weighted average calculation */}
          <div
            className="mb-6 font-terminal"
            style={{
              fontSize: "14px",
              border: "1px solid var(--oc-green-border-dim)",
              background: "var(--oc-green-bg-surface)",
              borderRadius: "4px",
              padding: "1rem 1.25rem",
            }}
          >
            {/* Formula rows */}
            {[
              { isotope: "Li-6", mass: "6.0151", op: "×", abundance: "0.076", eq: "=", result: "0.4572" },
              { isotope: "Li-7", mass: "7.0160", op: "×", abundance: "0.924", eq: "=", result: "6.4828" },
            ].map(({ isotope, mass, op, abundance, eq, result }) => (
              <div key={isotope} className="flex items-baseline gap-3 mb-1" style={{ flexWrap: "wrap" }}>
                <span style={{ color: "var(--oc-green)", minWidth: "2.8rem" }}>{isotope}</span>
                <span style={{ color: "var(--oc-text-muted)", minWidth: "5rem" }}>{mass} <Unit id="atomic-mass-unit">u</Unit></span>
                <span style={{ color: "var(--oc-text-dim)" }}>{op}</span>
                <span style={{ color: "var(--oc-text-muted)", minWidth: "3.5rem" }}>{abundance}</span>
                <span style={{ color: "var(--oc-text-dim)" }}>{eq}</span>
                <span style={{ color: "var(--oc-text)" }}>{result} <Unit id="atomic-mass-unit">u</Unit></span>
              </div>
            ))}

            {/* Divider */}
            <div style={{ borderTop: "1px solid var(--oc-green-border-faint)", margin: "8px 0" }} />

            {/* Sum */}
            <div className="flex items-baseline gap-3" style={{ flexWrap: "wrap" }}>
              <span style={{ color: "var(--oc-text-dim)", minWidth: "2.8rem" }}>SUM</span>
              <span style={{ color: "var(--oc-text-dim)", minWidth: "5rem" }}></span>
              <span style={{ color: "var(--oc-text-dim)" }}> </span>
              <span style={{ color: "var(--oc-text-dim)", minWidth: "3.5rem" }}></span>
              <span style={{ color: "var(--oc-text-dim)" }}>=</span>
              <span style={{ color: "#c8853a", fontWeight: 600 }}>6.9400 <Unit id="atomic-mass-unit">u</Unit>  ≈  6.941 <Unit id="atomic-mass-unit">u</Unit></span>
            </div>
          </div>

          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            The result matches what is printed on the periodic table. Notice that 6.941 is close to 7
            rather than 6 because the heavier Li-7 isotope makes up the vast majority of natural lithium.
            This is why atomic masses are almost never whole numbers — they are averages, not counts.
          </p>

          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            A word of warning: the abbreviations do not always match the English name of the{" "}
            <Term id="element">element</Term>. Many symbols come from older Latin or Greek names that were
            established before modern naming conventions existed. A few notable examples:
          </p>

          {/* Symbol mismatch examples */}
          <div
            className="mb-4 font-terminal"
            style={{
              fontSize: "14px",
              border: "1px solid var(--oc-green-border-dim)",
              background: "var(--oc-green-bg-surface)",
              borderRadius: "4px",
              padding: "1rem 1.25rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "0.5rem 1.5rem",
            }}
          >
            {[
              { symbol: "Pb", name: "Lead",      latin: "Plumbum"   },
              { symbol: "Au", name: "Gold",       latin: "Aurum"     },
              { symbol: "Fe", name: "Iron",       latin: "Ferrum"    },
              { symbol: "Na", name: "Sodium",     latin: "Natrium"   },
              { symbol: "K",  name: "Potassium",  latin: "Kalium"    },
              { symbol: "Ag", name: "Silver",     latin: "Argentum"  },
              { symbol: "Hg", name: "Mercury",    latin: "Hydrargyrum" },
              { symbol: "Cu", name: "Copper",     latin: "Cuprum"    },
            ].map(({ symbol, name, latin }) => (
              <div key={symbol} className="flex items-baseline gap-2">
                <span style={{ color: "var(--oc-green)", minWidth: "2.2rem" }}>{symbol}</span>
                <span style={{ color: "var(--oc-text-muted)", minWidth: "5rem" }}>{name}</span>
                <span style={{ color: "var(--oc-text-dim)" }}>← {latin}</span>
              </div>
            ))}
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            These mismatches are a quirk of scientific history — names were often standardised in Latin
            across Europe before English became dominant in science. Once you know the common ones, they
            become second nature. For now, hover over any cell above to explore the full details of each element.
          </p>
        </div>

        {/* ── ORGANISATION OF THE TABLE ────────────────────── */}
        <div className="max-w-2xl mb-10">
          <h2
            className="font-heading mb-4"
            style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
          >
            HOW THE TABLE IS ORGANISED
          </h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            At first glance the layout of the <Term id="periodic-table">periodic table</Term> can look
            arbitrary — rows of varying length, a detached block floating beneath the main grid, columns
            that seem to start and stop at random. In reality every position is deeply intentional.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Each vertical column is called a <strong style={{ color: "var(--oc-text)" }}>group</strong>, and the{" "}
            <Term id="element">elements</Term> within a group share remarkably similar chemical behaviour.
            They react with other substances in the same kinds of ways, form the same types of bonds, and
            often even look alike as pure materials. This is no coincidence — it is a direct consequence of
            how many <Term id="electron">electrons</Term> sit in each element&apos;s outermost{" "}
            <Term id="orbital-shell">orbital shell</Term>. Elements in the same group have the same number
            of outer electrons, and it is those outer electrons that determine almost everything about how
            an atom behaves chemically. The horizontal rows, called <strong style={{ color: "var(--oc-text)" }}>periods</strong>,
            represent the filling of successive electron shells as the <Term id="atomic-number">atomic number</Term>{" "}
            increases.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            A handful of groups are important enough to have their own names that you will encounter
            constantly in chemistry. Here are the key ones:
          </p>

          {/* Named groups table */}
          <div
            className="mb-4 font-terminal"
            style={{
              fontSize: "14px",
              border: "1px solid var(--oc-green-border-dim)",
              background: "var(--oc-green-bg-surface)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              className="font-heading grid"
              style={{
                gridTemplateColumns: "60px 1fr 1fr",
                padding: "0.5rem 1.25rem",
                borderBottom: "1px solid var(--oc-green-border-dim)",
                color: "var(--oc-text-dim)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
              }}
            >
              <span>GROUP</span>
              <span>NAME</span>
              <span>EXAMPLES</span>
            </div>
            {[
              { group: "1",   name: "Alkali Metals",    examples: "Lithium (Li), Sodium (Na), Potassium (K)",  note: "Highly reactive metals — they explode in water." },
              { group: "2",   name: "Alkaline Earth Metals", examples: "Magnesium (Mg), Calcium (Ca)",         note: "Reactive metals, but less so than Group 1." },
              { group: "17",  name: "Halogens",          examples: "Fluorine (F), Chlorine (Cl), Iodine (I)", note: "Highly reactive nonmetals — one electron away from a full shell." },
              { group: "18",  name: "Noble Gases",       examples: "Helium (He), Neon (Ne), Argon (Ar)",      note: "Completely unreactive — their outermost shell is already full." },
            ].map(({ group, name, examples, note }, i, arr) => (
              <div
                key={group}
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid var(--oc-green-border-faint)" : "none",
                  padding: "0.75rem 1.25rem",
                }}
              >
                <div
                  className="grid mb-1"
                  style={{ gridTemplateColumns: "60px 1fr 1fr", alignItems: "baseline", gap: "0 1rem" }}
                >
                  <span style={{ color: "var(--oc-green)", fontFamily: "var(--font-heading)" }}>{group}</span>
                  <span style={{ color: "var(--oc-text)" }}>{name}</span>
                  <span style={{ color: "var(--oc-text-muted)" }}>{examples}</span>
                </div>
                <div
                  className="grid"
                  style={{ gridTemplateColumns: "60px 1fr", gap: "0 1rem" }}
                >
                  <span />
                  <span style={{ color: "var(--oc-text-dim)", fontSize: "12px" }}>{note}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Notice that noble gases sit at the far right of every period — they are the endpoint of each
            row, with completely filled outer shells and no tendency to react. This pattern of shell-filling
            is what gives the periodic table its shape, and understanding it is the key to predicting how
            any element will behave. We will explore groups, periods, and electron configuration in much
            greater depth in future lessons.
          </p>
        </div>

        {/* Quiz CTA */}
        <div
          className="mt-16 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-bg-surface)", borderRadius: "4px" }}
        >
          <div>
            <p className="font-heading text-xs mb-1" style={{ color: "var(--oc-green)", letterSpacing: "0.12em" }}>
              READY TO TEST YOUR KNOWLEDGE?
            </p>
            <p className="text-sm" style={{ color: "var(--oc-text-muted)" }}>
              Take the Chemistry I quiz — 15 questions covering everything in lessons 1.1 through 1.3.
            </p>
          </div>
          <Link
            href="/courses/chemistry-1/quiz"
            className="font-heading text-xs px-6 py-3 shrink-0 transition-all duration-200"
            style={{ background: "var(--oc-blue)", color: "var(--oc-btn-text)", letterSpacing: "0.15em" }}
          >
            TAKE THE QUIZ →
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1/lessons/protons-neutrons-electrons"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ border: "1px solid rgba(68,153,255,0.3)", color: "var(--oc-blue)", letterSpacing: "0.15em" }}
          >
            ← PREV: PROTONS, NEUTRONS & ELECTRONS
          </Link>
          <Link
            href="/courses/chemistry-1"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ background: "transparent", border: "1px solid rgba(68,153,255,0.3)", color: "var(--oc-blue)", letterSpacing: "0.15em" }}
          >
            BACK TO COURSE →
          </Link>
        </div>
      </div>
    </main>
  );
}
