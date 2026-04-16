import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { ElectronConfigExplorer } from "@/components/lessons/ElectronConfigExplorer";
import { OrbitalRush } from "@/components/lessons/OrbitalRush";
import { Term } from "@/components/ui/Term";

export const metadata = {
  title: "Reading & Writing Electron Configuration — Chemistry I | Allylic",
  description: "Learn how to read and write electron configurations, understand the s/p/d blocks, and use noble gas abbreviated notation.",
};

export default function ElectronConfigNotationLesson() {
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
          <span className="font-heading" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 tracking-widest" style={{ fontSize: "0.85rem", color: "var(--oc-green-dim)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <Link href="/courses/chemistry-1" className="hover:text-green-400 transition-colors">CHEMISTRY I</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <span style={{ color: "var(--oc-green)" }}>ELECTRON CONFIGURATION NOTATION</span>
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
          <span
            className="font-heading text-xs px-2 py-0.5"
            style={{ background: "var(--oc-green-badge)", color: "var(--oc-green)", border: "1px solid var(--oc-green-subtle)", letterSpacing: "0.12em" }}
          >
            LESSON 2.4
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
          ELECTRON CONFIGURATION NOTATION
        </h1>
        <p className="text-base leading-relaxed mb-12 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          In lesson 2.3 we learned the rules for filling orbitals. Now we put them into writing —
          the precise shorthand chemists use to record exactly where every <Term id="electron">electron</Term> in
          an atom lives.
        </p>

        {/* ── READING & WRITING THE NOTATION ──────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          READING &amp; WRITING THE NOTATION
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            An electron configuration lists each occupied subshell in order, with a superscript showing
            how many electrons it contains. The format is:
          </p>

          {/* Format box */}
          <div
            className="mb-6 p-4"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-bg-surface)", borderRadius: "4px" }}
          >
            <p className="font-heading text-xs mb-3" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>FORMAT</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-heading" style={{ fontSize: "1.6rem", color: "#4499ff" }}>n</span>
              <span style={{ color: "var(--oc-text-dim)" }}>+</span>
              <span className="font-heading" style={{ fontSize: "1.6rem", color: "#a855f7" }}>ℓ</span>
              <span style={{ color: "var(--oc-text-dim)" }}>+</span>
              <span className="font-heading" style={{ fontSize: "1.2rem", color: "var(--oc-text-dim)", verticalAlign: "super" }}>e⁻</span>
            </div>
            <div className="flex gap-6 mt-3 flex-wrap">
              <span className="text-xs" style={{ color: "var(--oc-text-muted)" }}><span style={{ color: "#4499ff" }}>n</span> = principal quantum number (shell)</span>
              <span className="text-xs" style={{ color: "var(--oc-text-muted)" }}><span style={{ color: "#a855f7" }}>ℓ</span> = subshell letter (s / p / d)</span>
              <span className="text-xs" style={{ color: "var(--oc-text-muted)" }}>superscript = electron count</span>
            </div>
          </div>

          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            For example, carbon (Z=6) has 6 electrons to place. The first 2 go into 1s, the next 2 fill
            2s, and the final 2 begin filling 2p:
          </p>

          {/* Carbon example */}
          <div
            className="mb-6 p-4 font-heading"
            style={{ border: "1px solid rgba(68,153,255,0.2)", background: "rgba(68,153,255,0.04)", borderRadius: "4px" }}
          >
            <p className="text-xs mb-2" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>CARBON (Z=6)</p>
            <div className="flex gap-2 items-baseline flex-wrap" style={{ fontSize: "1.1rem" }}>
              {[
                { label: "1s", n: 2, type: "s" },
                { label: "2s", n: 2, type: "s" },
                { label: "2p", n: 2, type: "p" },
              ].map(({ label, n, type }) => (
                <span key={label} style={{ color: { s: "#4499ff", p: "#a855f7", d: "#f5a623" }[type as "s"|"p"|"d"] }}>
                  {label}<sup style={{ fontSize: "0.65em" }}>{n}</sup>
                </span>
              ))}
              <span className="text-xs ml-2" style={{ color: "var(--oc-text-dim)" }}>→ 6 electrons total ✓</span>
            </div>
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Step through the explorer below to see how configurations build up across the first 36 elements.
          </p>
        </div>

        {/* ── INTERACTIVE ─────────────────────────────────── */}
        <ElectronConfigExplorer />

        {/* ── THE BLOCKS ──────────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          THE s/p/d BLOCKS
        </h2>
        <div className="max-w-2xl mb-12">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            The shape of the <Term id="periodic-table">periodic table</Term> is not arbitrary — it
            directly reflects which subshell is being filled as you move across each period. This
            divides the table into named <strong style={{ color: "var(--oc-text)" }}>blocks</strong>:
          </p>

          {/* Block table */}
          <div className="flex flex-col gap-3 mb-6">
            {[
              {
                block: "s-block",
                color: "#4499ff",
                location: "Groups 1–2, plus He",
                filling: "Outermost electrons fill an s subshell",
                examples: "H, He, Li, Na, K, Ca — the alkali and alkaline earth metals (plus hydrogen and helium).",
              },
              {
                block: "p-block",
                color: "#a855f7",
                location: "Groups 13–18 (except He)",
                filling: "Outermost electrons fill a p subshell",
                examples: "B through Ne, Al through Ar, Ga through Kr — includes nonmetals, metalloids, and noble gases.",
              },
              {
                block: "d-block",
                color: "#f5a623",
                location: "Groups 3–12",
                filling: "The (n−1)d subshell is being filled",
                examples: "Sc through Zn, Y through Cd — the transition metals. Note 4s fills before 3d.",
              },
              {
                block: "f-block",
                color: "#72b872",
                location: "Lanthanides & actinides (rows 6–7, detached)",
                filling: "The (n−2)f subshell is being filled",
                examples: "Ce–Lu, Th–Lr — rare earths and heavy radioactive elements.",
              },
            ].map(({ block, color, location, filling, examples }) => (
              <div
                key={block}
                className="flex gap-4 p-4"
                style={{ background: `${color}09`, border: `1px solid ${color}30`, borderRadius: "4px" }}
              >
                <div className="shrink-0">
                  <span
                    className="font-heading text-xs inline-block px-2 py-0.5"
                    style={{ color, border: `1px solid ${color}44`, borderRadius: "3px", letterSpacing: "0.1em", fontSize: "0.65rem" }}
                  >
                    {block.toUpperCase()}
                  </span>
                  <p className="text-xs mt-1" style={{ color: "var(--oc-text-dim)", fontSize: "0.6rem", letterSpacing: "0.06em" }}>
                    {location}
                  </p>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: "var(--oc-text)", lineHeight: 1.5 }}>{filling}</p>
                  <p className="text-sm" style={{ color: "var(--oc-text-muted)", lineHeight: 1.5 }}>{examples}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            The block an element belongs to tells you which subshell its highest-energy electrons occupy.
            This is directly related to its chemical behaviour — the valence electrons we studied in
            lesson 2.2 are always the outermost s and p electrons (for s and p block elements),
            which is why Group number predicts valence electron count so cleanly.
          </p>
        </div>

        {/* ── ABBREVIATED NOTATION ────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          ABBREVIATED NOTATION
        </h2>
        <div className="max-w-2xl mb-16">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Writing out the full configuration for every <Term id="element">element</Term> gets tedious
            fast. Because <Term id="noble-gas">noble gases</Term> have completely filled, stable electron
            arrangements, chemists use them as shorthand. Instead of writing everything from 1s onward,
            you write the previous noble gas in square brackets, then list only the electrons added after it.
          </p>

          {/* Examples */}
          <div
            className="mb-6 p-4"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-bg-surface)", borderRadius: "4px" }}
          >
            <p className="font-heading text-xs mb-4" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>EXAMPLES</p>
            <div className="flex flex-col gap-4">
              {[
                {
                  element: "Sodium  Na  Z=11",
                  full: [{ label: "1s", n: 2, t: "s" }, { label: "2s", n: 2, t: "s" }, { label: "2p", n: 6, t: "p" }, { label: "3s", n: 1, t: "s" }],
                  abbr: { noble: "Ne", rest: [{ label: "3s", n: 1, t: "s" }] },
                },
                {
                  element: "Chlorine  Cl  Z=17",
                  full: [{ label: "1s", n: 2, t: "s" }, { label: "2s", n: 2, t: "s" }, { label: "2p", n: 6, t: "p" }, { label: "3s", n: 2, t: "s" }, { label: "3p", n: 5, t: "p" }],
                  abbr: { noble: "Ne", rest: [{ label: "3s", n: 2, t: "s" }, { label: "3p", n: 5, t: "p" }] },
                },
                {
                  element: "Iron  Fe  Z=26",
                  full: [{ label: "1s", n: 2, t: "s" }, { label: "2s", n: 2, t: "s" }, { label: "2p", n: 6, t: "p" }, { label: "3s", n: 2, t: "s" }, { label: "3p", n: 6, t: "p" }, { label: "3d", n: 6, t: "d" }, { label: "4s", n: 2, t: "s" }],
                  abbr: { noble: "Ar", rest: [{ label: "3d", n: 6, t: "d" }, { label: "4s", n: 2, t: "s" }] },
                },
              ].map(({ element, full, abbr }) => {
                const colors = { s: "#4499ff", p: "#a855f7", d: "#f5a623" } as const;
                return (
                  <div key={element}>
                    <p className="font-heading text-xs mb-1.5" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.6rem" }}>
                      {element}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <div className="flex gap-1.5 items-baseline font-heading flex-wrap">
                        {full.map((s, i) => (
                          <span key={i} style={{ color: colors[s.t as keyof typeof colors] }}>
                            {s.label}<sup style={{ fontSize: "0.65em" }}>{s.n}</sup>
                          </span>
                        ))}
                      </div>
                      <span style={{ color: "var(--oc-text-faint)" }}>→</span>
                      <div className="flex gap-1.5 items-baseline font-heading flex-wrap">
                        <span style={{ color: "var(--oc-text-dim)" }}>[{abbr.noble}]</span>
                        {abbr.rest.map((s, i) => (
                          <span key={i} style={{ color: colors[s.t as keyof typeof colors] }}>
                            {s.label}<sup style={{ fontSize: "0.65em" }}>{s.n}</sup>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            The abbreviated form is what you&apos;ll most often see in textbooks and exams. It strips
            away the stable, chemically inert core and highlights only the electrons that actually
            participate in bonding — exactly the valence electrons we studied in lesson 2.2.
          </p>
        </div>

        {/* ── ORBITAL RUSH MINIGAME ───────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          PRACTICE: ORBITAL RUSH
        </h2>
        <p className="text-base leading-relaxed mb-8 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          Place electrons onto a 3D atom one spin at a time — applying Aufbau order and Hund&apos;s rule
          from memory. Play in <strong style={{ color: "var(--oc-text)" }}>Normal</strong> mode for
          a relaxed no-timer challenge, or switch to <strong style={{ color: "var(--oc-text)" }}>Rush</strong> mode
          and race the 60-second clock. Three lives in either mode.
        </p>
        <OrbitalRush />

        {/* ── UP NEXT ─────────────────────────────────────── */}
        <div
          className="max-w-2xl mb-16 p-6"
          style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-bg-surface)", borderRadius: "4px" }}
        >
          <p className="font-heading text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            UP NEXT
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            We now know exactly where every <Term id="electron">electron</Term> in an atom lives. In
            lesson 2.5 we will use that knowledge to understand what happens when atoms come close
            to each other — the formation of <strong style={{ color: "var(--oc-text)" }}>chemical bonds</strong>.
            We&apos;ll cover ionic bonds, covalent bonds, and how the <Term id="octet-rule">octet rule</Term> drives
            both.
          </p>
        </div>

        {/* ── NAVIGATION ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1/lessons/electron-configuration"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center"
            style={{ border: "1px solid rgba(167,139,250,0.3)", color: "rgba(167,139,250,0.9)", letterSpacing: "0.12em" }}
          >
            ← PREV: ELECTRON CONFIGURATION
          </Link>
          <Link
            href="/courses/chemistry-1"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center"
            style={{ border: "1px solid var(--oc-green-subtle)", color: "var(--oc-green)", letterSpacing: "0.12em" }}
          >
            BACK TO COURSE →
          </Link>
        </div>

      </div>
    </main>
  );
}
