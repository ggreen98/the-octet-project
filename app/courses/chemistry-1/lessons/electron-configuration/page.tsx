import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { ElectronConfigExplorer } from "@/components/lessons/ElectronConfigExplorer";
import { OrbitalRush } from "@/components/lessons/OrbitalRush";
import { Term } from "@/components/ui/Term";

export const metadata = {
  title: "Electron Configuration — Chemistry I | Allylic",
  description: "Learn how to read and write electron configurations, understand the s/p/d blocks, and see how the periodic table encodes electron structure.",
};

export default function ElectronConfigurationLesson() {
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
          <span style={{ color: "var(--oc-green)" }}>ELECTRON CONFIGURATION</span>
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
            LESSON 2.3
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
          ELECTRON CONFIGURATION
        </h1>
        <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          In lessons 2.1 and 2.2 we talked about shells and valence <Term id="electron">electrons</Term>.
          Now we go one level deeper: a precise address system that tells you exactly where every single
          electron in an atom lives — not just which shell, but which subshell within that shell.
        </p>

        {/* Recurring theme callout */}
        <div
          className="max-w-2xl mb-12 p-4"
          style={{ border: "1px solid rgba(68,153,255,0.2)", background: "rgba(68,153,255,0.04)", borderRadius: "4px", borderLeft: "3px solid rgba(68,153,255,0.5)" }}
        >
          <p className="font-heading text-xs mb-2" style={{ color: "#4499ff", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            A RECURRING THEME IN CHEMISTRY
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Systems in nature tend toward their lowest possible energy state. A ball rolls downhill, a stretched
            spring contracts, and <Term id="electron">electrons</Term> are no different — given a choice, they
            always occupy the lowest energy level available before moving to a higher one. This single principle
            explains almost everything about how electron configurations are built.
          </p>
        </div>

        {/* ── ELECTRON SPIN ───────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          ELECTRON SPIN
        </h2>
        <div className="max-w-2xl mb-12">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            <Term id="electron">Electrons</Term> have an intrinsic quantum property called{" "}
            <strong style={{ color: "var(--oc-text)" }}>spin</strong>. Despite the name, electrons are
            not literally spinning — spin is a fundamental property of the particle itself, like charge
            or mass. What matters is that spin can only ever take one of two values, which we call{" "}
            <strong style={{ color: "var(--oc-text)" }}>spin-up (↑)</strong> and{" "}
            <strong style={{ color: "var(--oc-text)" }}>spin-down (↓)</strong>.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            This two-value property has a profound consequence: the{" "}
            <strong style={{ color: "var(--oc-text)" }}>Pauli exclusion principle</strong> states that
            no two electrons in the same atom can be in exactly the same quantum state. Since spin is
            the only thing that can differ between two electrons in the same orbital, each orbital can
            hold at most two electrons — one spin-up and one spin-down.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            This is why every subshell capacity is an even number, and why the orbital box diagrams
            you will see below always show pairs of ↑↓ arrows — each pair represents one full orbital.
          </p>
        </div>

        {/* ── SUBSHELLS ───────────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          SUBSHELLS
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Each <Term id="orbital-shell">electron shell</Term> is divided into subshells — regions of
            space with different shapes and different energies. Subshells are labelled with a number
            (the shell they belong to) and a letter (the type of subshell):
          </p>

          {/* Subshell table */}
          <div
            className="mb-6"
            style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden", maxWidth: "440px" }}
          >
            <div
              className="grid font-heading text-xs px-4 py-2"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 1.5fr", background: "var(--oc-green-badge)", color: "var(--oc-green)", letterSpacing: "0.12em", borderBottom: "1px solid var(--oc-green-border-dim)" }}
            >
              <span>TYPE</span>
              <span>ORBITALS</span>
              <span>MAX e⁻</span>
              <span>FOUND IN</span>
            </div>
            {[
              { type: "s", color: "#4499ff", orbs: "1", max: "2",  found: "Every shell" },
              { type: "p", color: "#a855f7", orbs: "3", max: "6",  found: "Shell 2 onward" },
              { type: "d", color: "#f5a623", orbs: "5", max: "10", found: "Shell 3 onward" },
              { type: "f", color: "#72b872", orbs: "7", max: "14", found: "Shell 4 onward" },
            ].map(({ type, color, orbs, max, found }, i) => (
              <div
                key={type}
                className="grid text-sm px-4 py-2.5"
                style={{ gridTemplateColumns: "1fr 1fr 1fr 1.5fr", color: "var(--oc-text-muted)", borderBottom: i < 3 ? "1px solid var(--oc-green-border-faint)" : "none", background: i % 2 === 0 ? "var(--oc-green-bg-surface)" : "transparent" }}
              >
                <span className="font-heading" style={{ color }}>{type}</span>
                <span>{orbs}</span>
                <span style={{ color: "var(--oc-text-dim)" }}>{max}</span>
                <span>{found}</span>
              </div>
            ))}
          </div>

          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Each orbital can hold exactly 2 electrons. So an s subshell with 1 orbital holds 2,
            a p subshell with 3 orbitals holds 6, and so on.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            For most of general chemistry — and all elements up through krypton (Z=36) — you only need
            s, p, and d. The f subshell only comes into play for the lanthanides and actinides far down
            the periodic table.
          </p>
        </div>

        {/* ── AUFBAU PRINCIPLE ────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          THE AUFBAU PRINCIPLE
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            "Aufbau" is German for <em>building up</em>. The principle is simple: <Term id="electron">electrons</Term> fill
            the lowest available energy subshell first, then the next, and so on. You build an
            atom&apos;s configuration by adding electrons one at a time into the cheapest available seat.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            The filling order is not simply 1s → 2s → 2p → 3s → 3p → 3d, because the 4s subshell
            is actually slightly lower in energy than 3d. The correct full filling order is:
          </p>

          {/* Filling order */}
          <div
            className="mb-4 p-4 font-heading"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-bg-surface)", borderRadius: "4px" }}
          >
            <p className="text-xs mb-2" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>FILLING ORDER</p>
            <div className="flex flex-wrap gap-2 items-center">
              {[
                { label: "1s", type: "s" }, { label: "2s", type: "s" }, { label: "2p", type: "p" },
                { label: "3s", type: "s" }, { label: "3p", type: "p" }, { label: "4s", type: "s" },
                { label: "3d", type: "d" }, { label: "4p", type: "p" }, { label: "5s", type: "s" },
                { label: "4d", type: "d" }, { label: "5p", type: "p" }, { label: "6s", type: "s" },
                { label: "4f", type: "f" }, { label: "5d", type: "d" }, { label: "6p", type: "p" },
                { label: "7s", type: "s" }, { label: "5f", type: "f" }, { label: "6d", type: "d" },
                { label: "7p", type: "p" },
              ].map(({ label, type }, i, arr) => {
                const colors: Record<string, string> = { s: "#4499ff", p: "#a855f7", d: "#f5a623", f: "#72b872" };
                const borders: Record<string, string> = { s: "#4499ff44", p: "#a855f744", d: "#f5a62344", f: "#72b87244" };
                return (
                <span key={label} className="flex items-center gap-2">
                  <span
                    className="font-heading text-sm px-2 py-0.5"
                    style={{ color: colors[type], border: `1px solid ${borders[type]}`, borderRadius: "3px", letterSpacing: "0.06em" }}
                  >
                    {label}
                  </span>
                  {i < arr.length - 1 && <span style={{ color: "var(--oc-text-faint)" }}>→</span>}
                </span>
                );
              })}
            </div>
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Notice that 4s comes before 3d. This is why potassium (Z=19) fills its 4s subshell before
            touching the 3d, giving it the configuration [Ar] 4s¹ rather than [Ar] 3d¹.
          </p>
        </div>

        {/* ── WRITING THE NOTATION ────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          READING & WRITING THE NOTATION
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
          Put it all together under pressure. You have 60 seconds and 3 lives — fill in the correct
          electron count for each subshell as fast as you can.
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
            lesson 2.4 we will use that knowledge to understand what happens when atoms come close
            to each other — the formation of <strong style={{ color: "var(--oc-text)" }}>chemical bonds</strong>.
            We&apos;ll cover ionic bonds, covalent bonds, and how the <Term id="octet-rule">octet rule</Term> drives
            both.
          </p>
        </div>

        {/* ── NAVIGATION ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1/lessons/valence-electrons"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center"
            style={{ border: "1px solid rgba(167,139,250,0.3)", color: "rgba(167,139,250,0.9)", letterSpacing: "0.12em" }}
          >
            ← PREV: VALENCE ELECTRONS
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
