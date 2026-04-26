import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { Term } from "@/components/ui/Term";
import { PeriodicTableExplorer } from "@/components/lessons/PeriodicTableExplorer";
import { PeriodicTableGroups } from "@/components/lessons/PeriodicTableGroups";

export const metadata = {
  title: "Periodic Trends — Chemistry I | Allylic",
  description: "Discover how atomic radius, ionization energy, electronegativity, and electron affinity change across the periodic table — and why.",
};

export default function PeriodicTrendsLesson() {
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
          <span style={{ color: "var(--oc-green)" }}>PERIODIC TRENDS</span>
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
            LESSON 2.5
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
          PERIODIC TRENDS
        </h1>
        <p className="text-base leading-relaxed mb-6 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          In lessons 2.3 and 2.4 we built a precise picture of where every <Term id="electron">electron</Term> lives.
          Now we zoom out: what happens to those electrons — and to the atom as a whole — as you move across
          a period or down a group? The answer reveals the hidden architecture of the{" "}
          <Term id="periodic-table">periodic table</Term>.
        </p>

        {/* ── GROUPS AND PERIODS ──────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          GROUPS AND PERIODS — A QUICK REFRESHER
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            The <Term id="periodic-table">periodic table</Term> is organised along two axes. The horizontal rows are
            called <strong style={{ color: "var(--oc-text)" }}>periods</strong> (numbered 1–7 down the left side) and
            the vertical columns are called <strong style={{ color: "var(--oc-text)" }}>groups</strong> (numbered 1–18
            across the top). Every <Term id="element">element</Term> in the same group has the same number of{" "}
            <Term id="valence-electron">valence electrons</Term> — which is why the elements in a group share
            similar chemical behaviour. Every element in the same period has the same number of filled{" "}
            <Term id="orbital-shell">electron shells</Term>.
          </p>

          {/* Period vs Group explainer cards */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div
              className="flex-1 p-4"
              style={{ border: "1px solid rgba(68,153,255,0.3)", background: "rgba(68,153,255,0.04)", borderRadius: "4px" }}
            >
              <p className="font-heading text-xs mb-2" style={{ color: "#4499ff", letterSpacing: "0.1em", fontSize: "0.62rem" }}>
                PERIOD = ROW →
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Hydrogen and Helium are both in period 1 — they each have one electron shell.
                Lithium through Neon are in period 2 — two shells. A new period starts every time
                electrons begin filling a new shell.
              </p>
            </div>
            <div
              className="flex-1 p-4"
              style={{ border: "1px solid rgba(114,184,114,0.3)", background: "rgba(114,184,114,0.04)", borderRadius: "4px" }}
            >
              <p className="font-heading text-xs mb-2" style={{ color: "#72b872", letterSpacing: "0.1em", fontSize: "0.62rem" }}>
                GROUP = COLUMN ↕
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Lithium, Sodium, Potassium, Rubidium, Caesium, and Francium are all in group 1 —
                they each have one valence electron. That shared electron count is what makes
                them react in almost identical ways.
              </p>
            </div>
          </div>

          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Several groups are important enough to have names. You&apos;ll encounter these constantly
            in chemistry — it&apos;s worth knowing them cold.
          </p>
        </div>

        {/* Full periodic table with colour-coded groups */}
        <div className="max-w-4xl mb-10">
          <PeriodicTableGroups />
        </div>

        {/* Named groups quick reference */}
        <div className="max-w-2xl mb-12">
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Two special rows — the <strong style={{ color: "var(--oc-text)" }}>lanthanides</strong> and{" "}
            <strong style={{ color: "var(--oc-text)" }}>actinides</strong> — are pulled out and shown below
            the main table. They technically belong in periods 6 and 7 between groups 2 and 4, but
            fitting all 15 elements there would make the table too wide to be practical, so by convention
            they are displayed separately.
          </p>

          {/* s/p/d/f block summary */}
          <div
            className="mb-6 p-4"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-badge)", borderRadius: "4px" }}
          >
            <p className="font-heading text-xs mb-3" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
              THE BLOCKS — WHERE LESSONS 2.3 AND 2.4 MEET THE TABLE
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "s-block", groups: "Groups 1–2", color: "#4499ff", note: "Valence electrons in s orbitals. Includes H, He, alkali metals, and alkaline earth metals." },
                { label: "d-block", groups: "Groups 3–12", color: "#f5a623", note: "Valence electrons in d orbitals. Transition metals. Properties vary less predictably across the period." },
                { label: "p-block", groups: "Groups 13–18", color: "#a855f7", note: "Valence electrons in p orbitals. Contains metalloids, non-metals, halogens, and noble gases." },
                { label: "f-block", groups: "Lanthanides & Actinides", color: "#72b872", note: "Valence electrons in f orbitals. Pulled out below the main table." },
              ].map(({ label, groups, color, note }) => (
                <div key={label} style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
                  <span
                    className="font-heading"
                    style={{ fontSize: "0.7rem", color, flexShrink: 0, minWidth: "4rem", letterSpacing: "0.06em" }}
                  >
                    {label}
                  </span>
                  <span style={{ fontSize: "0.62rem", color: "var(--oc-text-dim)", flexShrink: 0, minWidth: "5.5rem" }}>
                    {groups}
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "var(--oc-text-muted)", lineHeight: 1.5 }}>
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recurring theme callout */}
        <div
          className="max-w-2xl mb-12 p-4"
          style={{ border: "1px solid rgba(68,153,255,0.2)", background: "rgba(68,153,255,0.04)", borderRadius: "4px", borderLeft: "3px solid rgba(68,153,255,0.5)" }}
        >
          <p className="font-heading text-xs mb-2" style={{ color: "#4499ff", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            THE SAME PRINCIPLE, AGAIN
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Every trend in this lesson flows from one idea: electrons are attracted to <Term id="proton">protons</Term>.
            More protons → stronger pull → smaller atom, harder to ionize, more electronegative.
            Fewer protons, or more shielding → weaker pull → larger atom, easier to ionize, less electronegative.
            Keep that picture in mind and the whole table becomes predictable.
          </p>
        </div>

        {/* ── EFFECTIVE NUCLEAR CHARGE ────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          WHY TRENDS EXIST: EFFECTIVE NUCLEAR CHARGE
        </h2>
        <div className="max-w-2xl mb-12">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            The <Term id="atomic-number">atomic number</Term> Z tells you how many <Term id="proton">protons</Term> are in the <Term id="nucleus">nucleus</Term>.
            But an outer <Term id="electron">electron</Term> never feels the full pull of all Z protons — the inner
            electrons partially cancel it out. This cancellation is called{" "}
            <strong style={{ color: "var(--oc-text)" }}><Term id="electron-shielding">electron shielding</Term></strong>.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            What the outer electron actually experiences is the{" "}
            <strong style={{ color: "var(--oc-text)" }}><Term id="effective-nuclear-charge">effective nuclear charge</Term></strong>{" "}
            Z<sub>eff</sub> = Z − S, where S is the shielding from inner electrons. As you add
            protons moving across a period, Z increases — but you&apos;re adding electrons to the{" "}
            <em>same</em> shell, so shielding barely changes. Z<sub>eff</sub> grows, the nucleus grips
            outer electrons more tightly, and everything follows from there.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Going down a group, you add a whole new inner shell. That new shell is excellent at
            shielding, so Z<sub>eff</sub> stays roughly constant even as Z climbs. But the outer
            electrons are now farther away — in a bigger shell — so the actual pull they feel is
            weaker.
          </p>
        </div>

        {/* ── ATOMIC RADIUS ───────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          ATOMIC RADIUS
        </h2>
        <div className="max-w-2xl mb-4">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            <Term id="atomic-radius">Atomic radius</Term> is a measure of how big an atom is —
            technically half the distance between two bonded nuclei of the same <Term id="element">element</Term>.
          </p>

          {/* Trend summary boxes */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 p-4" style={{ border: "1px solid rgba(68,153,255,0.3)", background: "rgba(68,153,255,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#4499ff", letterSpacing: "0.1em", fontSize: "0.62rem" }}>
                ACROSS A PERIOD →
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                <strong style={{ color: "var(--oc-text)" }}>Decreases.</strong> Each element adds one proton, pulling all
                electrons closer. Z<sub>eff</sub> rises, the electron cloud contracts.
              </p>
            </div>
            <div className="flex-1 p-4" style={{ border: "1px solid rgba(68,153,255,0.3)", background: "rgba(68,153,255,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#4499ff", letterSpacing: "0.1em", fontSize: "0.62rem" }}>
                DOWN A GROUP ↓
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                <strong style={{ color: "var(--oc-text)" }}>Increases.</strong> Each period adds a new <Term id="orbital-shell">electron shell</Term>,
                pushing the outer electrons progressively further from the nucleus.
              </p>
            </div>
          </div>
        </div>

        {/* ── IONIZATION ENERGY ───────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          IONIZATION ENERGY
        </h2>
        <div className="max-w-2xl mb-4">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            <Term id="ionization-energy">Ionization energy</Term> is the energy required to remove an electron from 
            a neutral atom. Most elements can lose multiple electrons, one after another, which we call 
            <strong style={{ color: "var(--oc-text)" }}>successive ionization energies</strong>.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <div className="p-4" style={{ border: "1px solid rgba(114,184,114,0.3)", background: "rgba(114,184,114,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#72b872", letterSpacing: "0.1em", fontSize: "0.62rem" }}>
                1ST IONIZATION ENERGY (IE₁)
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                The energy to remove the first (outermost) electron. It <strong style={{ color: "var(--oc-text)" }}>increases across a period</strong> (stronger nuclear pull) 
                and <strong style={{ color: "var(--oc-text)" }}>decreases down a group</strong> (outer electrons are further away and more shielded).
              </p>
            </div>
            <div className="p-4" style={{ border: "1px solid rgba(114,184,114,0.3)", background: "rgba(114,184,114,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#72b872", letterSpacing: "0.1em", fontSize: "0.62rem" }}>
                2ND IONIZATION ENERGY (IE₂)
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                The energy to remove a second electron. IE₂ is <strong style={{ color: "var(--oc-text)" }}>always higher</strong> than IE₁ because it&apos;s 
                harder to pull a negative electron away from a positive ion.
              </p>
            </div>
          </div>

          <div
            className="mb-4 p-4"
            style={{ border: "1px solid rgba(68,153,255,0.2)", background: "rgba(68,153,255,0.03)", borderRadius: "4px", borderLeft: "3px solid rgba(68,153,255,0.5)" }}
          >
            <p className="font-heading text-xs mb-1" style={{ color: "#4499ff", letterSpacing: "0.1em", fontSize: "0.6rem" }}>
              THE GROUP 1 JUMP
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
              Look at Lithium (Li) or Sodium (Na) in the explorer below. Their IE₁ is very low, but their IE₂ 
              is <strong style={{ color: "var(--oc-text)" }}>massive</strong> — over 10 times higher! This is because 
              removing the second electron requires breaking into a stable, full inner shell (the noble gas core). 
              This huge jump tells chemists exactly how many valence electrons an element has.
            </p>
          </div>
        </div>

        {/* ── ELECTRONEGATIVITY ───────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          ELECTRONEGATIVITY
        </h2>
        <div className="max-w-2xl mb-4">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            <Term id="electronegativity">Electronegativity</Term> measures how strongly an atom pulls the shared
            electrons in a chemical bond toward itself. It is not a directly measurable quantity — it&apos;s a
            calculated scale. The most widely used is the <strong style={{ color: "var(--oc-text)" }}>Pauling scale</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 p-4" style={{ border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#a855f7", letterSpacing: "0.1em", fontSize: "0.62rem" }}>
                ACROSS A PERIOD →
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                <strong style={{ color: "var(--oc-text)" }}>Increases.</strong> Higher Z<sub>eff</sub> means the atom
                grabs bonding electrons more aggressively. Fluorine is the extreme case.
              </p>
            </div>
            <div className="flex-1 p-4" style={{ border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#a855f7", letterSpacing: "0.1em", fontSize: "0.62rem" }}>
                DOWN A GROUP ↓
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                <strong style={{ color: "var(--oc-text)" }}>Decreases.</strong> Larger atoms with more shielding hold
                bonding electrons less tightly.
              </p>
            </div>
          </div>
        </div>

        {/* ── ELECTRON AFFINITY ───────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          ELECTRON AFFINITY
        </h2>
        <div className="max-w-2xl mb-4">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            <Term id="electron-affinity">Electron affinity</Term> is the energy change that occurs when an electron is added to a neutral atom. 
            It measures how much an atom &quot;wants&quot; an extra electron. A more negative value indicates a higher affinity (more energy released).
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 p-4" style={{ border: "1px solid rgba(247,37,133,0.3)", background: "rgba(247,37,133,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#f72585", letterSpacing: "0.1em", fontSize: "0.62rem" }}>
                ACROSS A PERIOD →
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                <strong style={{ color: "var(--oc-text)" }}>Generally increases.</strong> Halogens have the highest affinities because adding one electron completes their octet.
              </p>
            </div>
            <div className="flex-1 p-4" style={{ border: "1px solid rgba(247,37,133,0.3)", background: "rgba(247,37,133,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#f72585", letterSpacing: "0.1em", fontSize: "0.62rem" }}>
                DOWN A GROUP ↓
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                <strong style={{ color: "var(--oc-text)" }}>Generally decreases.</strong> Electrons are added further from the nucleus, experiencing less attraction.
              </p>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE EXPLORER ─────────────────────────── */}
        <h2
          className="font-heading mb-4 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          EXPLORE THE TRENDS
        </h2>
        <div className="max-w-5xl mb-4">
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Use the interactive periodic table below to visualize all four trends across all 118 elements. 
            Toggle between modes to see the heat map shift, and hover or tap any element to see its 3D 
            structure and exact data values.
          </p>
          <PeriodicTableExplorer />
        </div>

        {/* ── HOW THEY RELATE ─────────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-12"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          HOW THE TRENDS RELATE
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            These trends are not independent — they all share the same root cause and therefore
            mirror each other:
          </p>

          {/* Summary table */}
          <div
            className="mb-6 font-heading"
            style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr",
                background: "var(--oc-green-badge)",
                borderBottom: "1px solid var(--oc-green-border-dim)",
              }}
            >
              {["DIRECTION", "RADIUS", "IONIZATION", "ELECTRONEG.", "AFFINITY"].map(h => (
                <div key={h} style={{ padding: "8px 10px", fontSize: "0.5rem", letterSpacing: "0.05em", color: "var(--oc-text-dim)" }}>
                  {h}
                </div>
              ))}
            </div>
            {/* Rows */}
            {[
              ["Across Period →", "Decreases ↘", "Increases ↗", "Increases ↗", "Increases ↗"],
              ["Down Group ↓",   "Increases ↘", "Decreases ↘", "Decreases ↘", "Decreases ↘"],
            ].map(([dir, r, ie, en, af]) => (
              <div
                key={dir}
                style={{
                  display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr 1fr",
                  borderBottom: "1px solid var(--oc-green-border-faint)",
                }}
              >
                <div style={{ padding: "8px 10px", fontSize: "0.6rem", color: "var(--oc-text-muted)" }}>{dir}</div>
                <div style={{ padding: "8px 10px", fontSize: "0.6rem", color: "#4499ff" }}>{r}</div>
                <div style={{ padding: "8px 10px", fontSize: "0.6rem", color: "#72b872" }}>{ie}</div>
                <div style={{ padding: "8px 10px", fontSize: "0.6rem", color: "#a855f7" }}>{en}</div>
                <div style={{ padding: "8px 10px", fontSize: "0.6rem", color: "#f72585" }}>{af}</div>
              </div>
            ))}
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Notice that atomic radius is the inverse of the others: wherever radius decreases, the 
            nucleus grips its own electrons (IE) and attracts external ones (Electronegativity / Affinity) 
            more strongly.
          </p>
        </div>

        {/* ── UP NEXT ─────────────────────────────────────── */}
        <Link href="/courses/chemistry-1/lessons/chemical-bonds" className="block group">
          <div
            className="max-w-2xl mb-16 p-6 transition-all duration-200 group-hover:bg-[rgba(114,184,114,0.03)] group-hover:border-[rgba(114,184,114,0.3)]"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-bg-surface)", borderRadius: "4px" }}
          >
            <p className="font-heading text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
              UP NEXT
            </p>
            <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
              Unit 3 moves beyond individual atoms to what happens when they meet each other. Lesson 3.1
              covers <strong style={{ color: "var(--oc-text)" }}>chemical bonds</strong> — how the 
              electronegativity difference you just learned about drives atoms to share or transfer 
              electrons to reach a stable state.
            </p>
            <span
              className="font-heading text-xs"
              style={{ color: "var(--oc-green)", letterSpacing: "0.1em" }}
            >
              GO TO UNIT 3 →
            </span>
          </div>
        </Link>

        {/* ── NAVIGATION ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1/lessons/electron-configuration-notation"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center flex-1"
            style={{ border: "1px solid rgba(167,139,250,0.3)", color: "rgba(167,139,250,0.9)", letterSpacing: "0.12em" }}
          >
            ← PREV: ELECTRON CONFIGURATION NOTATION
          </Link>
          <Link
            href="/courses/chemistry-1"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center flex-1"
            style={{ border: "1px solid var(--oc-green-subtle)", color: "var(--oc-green)", letterSpacing: "0.12em" }}
          >
            NEXT: UNIT 3 →
          </Link>
        </div>

      </div>
    </main>
  );
}
