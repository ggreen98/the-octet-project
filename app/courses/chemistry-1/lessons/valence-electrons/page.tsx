import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { ValenceElectronExplorer } from "@/components/lessons/ValenceElectronExplorer";
import { ValenceStrategyGame } from "@/components/lessons/ValenceStrategyGame";
import { Term } from "@/components/ui/Term";

export const metadata = {
  title: "Valence Electrons — Chemistry I | Allylic",
  description: "Valence electrons are the ones that do all the chemistry. Learn how many each element has, why it's predictable from the periodic table, and why it determines almost everything about how an element behaves.",
};

export default function ValenceElectronsLesson() {
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
          <span className="font-heading" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 tracking-widest" style={{ fontSize: "0.85rem", color: "var(--oc-green-dim)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <Link href="/courses/chemistry-1" className="hover:text-green-400 transition-colors">CHEMISTRY I</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <span style={{ color: "var(--oc-green)" }}>VALENCE ELECTRONS</span>
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
            LESSON 2.2
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
          VALENCE ELECTRONS
        </h1>
        <p className="text-base leading-relaxed mb-12 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          In lesson 2.1 we saw that <Term id="electron">electrons</Term> live in shells, and that the
          outermost shell is the one that matters most. Now we&apos;re going to zoom in on those outer
          electrons — the <Term id="valence-electron">valence electrons</Term> — and understand exactly
          how many each <Term id="element">element</Term> has, why it follows a predictable rule, and
          why this single number shapes nearly everything about how an atom behaves.
        </p>

        {/* ── THE GROUP NUMBER RULE ───────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          THE GROUP NUMBER RULE
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Here is one of the most useful shortcuts in all of chemistry: for the main-group elements,
            the number of <Term id="valence-electron">valence electrons</Term> is directly readable from
            the element&apos;s group in the <Term id="periodic-table">periodic table</Term>.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Groups 1 and 2 (the two leftmost columns) give the number directly — Group 1 elements
            have 1 valence electron, Group 2 have 2. For Groups 13 through 18, subtract 10: Group 13
            gives 3, Group 14 gives 4, all the way to Group 17 which gives 7. Group 18 — the{" "}
            <Term id="noble-gas">noble gases</Term> — have 8 (helium is the only exception, with a
            full K shell of just 2).
          </p>

          {/* Group → VE table */}
          <div
            style={{
              border: "1px solid var(--oc-green-border-dim)",
              borderRadius: "4px",
              overflow: "hidden",
              maxWidth: "480px",
            }}
          >
            <div
              className="grid font-heading text-xs px-4 py-2"
              style={{
                gridTemplateColumns: "1fr 1fr 2fr",
                background: "var(--oc-green-badge)",
                color: "var(--oc-green)",
                letterSpacing: "0.12em",
                borderBottom: "1px solid var(--oc-green-border-dim)",
              }}
            >
              <span>GROUP</span>
              <span>VALENCE e⁻</span>
              <span>EXAMPLES</span>
            </div>
            {[
              ["1",  "1", "H, Li, Na, K"],
              ["2",  "2", "Be, Mg, Ca"],
              ["13", "3", "B, Al"],
              ["14", "4", "C, Si"],
              ["15", "5", "N, P"],
              ["16", "6", "O, S"],
              ["17", "7", "F, Cl"],
              ["18", "8 (or 2 for He)", "He, Ne, Ar"],
            ].map(([group, ve, examples], i) => (
              <div
                key={group}
                className="grid text-sm px-4 py-2.5"
                style={{
                  gridTemplateColumns: "1fr 1fr 2fr",
                  color: "var(--oc-text-muted)",
                  borderBottom: i < 7 ? "1px solid var(--oc-green-border-faint)" : "none",
                  background: i % 2 === 0 ? "var(--oc-green-bg-surface)" : "transparent",
                }}
              >
                <span style={{ color: "var(--oc-text-dim)" }}>{group}</span>
                <span style={{ color: "var(--oc-green-dim)" }}>{ve}</span>
                <span>{examples}</span>
              </div>
            ))}
          </div>

          <p className="text-base leading-relaxed mt-6" style={{ color: "var(--oc-text-muted)" }}>
            This works because all elements in the same group have the same electron configuration in
            their outermost <Term id="orbital-shell">shell</Term>. As you move down a group you add
            more inner shells — but the outer shell always looks the same. Sodium and lithium are in
            different periods, but both have exactly 1 valence electron because both are in Group 1.
          </p>
        </div>

        {/* ── INTERACTIVE ─────────────────────────────────── */}
        <ValenceElectronExplorer />

        {/* ── THE OCTET RULE ──────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          THE OCTET RULE
        </h2>
        <div className="max-w-2xl mb-12">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            In lesson 2.1 we noted that helium, neon, and argon — the{" "}
            <Term id="noble-gas">noble gases</Term> — are extraordinarily stable and barely react
            with anything. What makes them special is their full outer{" "}
            <Term id="valence-shell">valence shell</Term>. Helium has 2 valence electrons and fills
            its K shell completely. Neon and argon each have 8, filling their outer shells.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            This observation leads to one of the most important rules in chemistry: the{" "}
            <Term id="octet-rule">octet rule</Term>. Atoms are most stable when they have 8 valence
            electrons — matching the electron count of a noble gas. Atoms that don&apos;t start with
            8 will gain, lose, or share <Term id="electron">electrons</Term> in order to reach that
            count. The drive to complete the octet is what powers chemical reactions.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Hydrogen and helium are the common exceptions. Their outermost{" "}
            <Term id="orbital-shell">shell</Term> is the K shell, which only holds 2 electrons — so
            they aim for 2, not 8. This is sometimes called the <strong style={{ color: "var(--oc-text)" }}>duplet rule</strong>.
          </p>
        </div>

        {/* ── LOSING, GAINING, OR SHARING ─────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          LOSING, GAINING, OR SHARING
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Knowing the number of <Term id="valence-electron">valence electrons</Term> an atom has
            tells you immediately which strategy it will use to reach a full outer shell.
          </p>

          {/* Strategy cards */}
          <div className="flex flex-col gap-4 mb-6">
            {[
              {
                label: "LOSE",
                groups: "Groups 1–3",
                color: "rgba(239,68,68,0.08)",
                border: "rgba(239,68,68,0.3)",
                accent: "#ef4444",
                body: (
                  <>
                    Elements with 1, 2, or 3 valence electrons can shed those electrons to expose the
                    full inner shell beneath. Sodium (1 VE) loses its single M-shell electron and is
                    left with a complete L shell of 8. The result is a positively charged ion — Na⁺.
                    These elements are the reactive <strong style={{ color: "#ef4444" }}>metals</strong> on
                    the left of the periodic table.
                  </>
                ),
              },
              {
                label: "GAIN",
                groups: "Groups 15–17",
                color: "rgba(168,85,247,0.08)",
                border: "rgba(168,85,247,0.3)",
                accent: "#a855f7",
                body: (
                  <>
                    Elements with 5, 6, or 7 valence electrons are closer to 8 than to 0. It&apos;s
                    more efficient to grab a few electrons than to shed many. Chlorine (7 VE) only
                    needs one more electron to complete its M shell — it picks one up and becomes Cl⁻.
                    These are the reactive <strong style={{ color: "#a855f7" }}>non-metals</strong>,
                    including the highly reactive <Term id="halogen">halogens</Term> in Group 17.
                  </>
                ),
              },
              {
                label: "SHARE",
                groups: "Group 14",
                color: "rgba(99,102,241,0.08)",
                border: "rgba(99,102,241,0.3)",
                accent: "#6366f1",
                body: (
                  <>
                    Carbon sits exactly in the middle with 4 valence electrons — it would need to lose
                    4 or gain 4 to reach a noble gas configuration, and neither is easy. Instead,
                    carbon typically <em>shares</em> electrons with neighbouring atoms, forming bonds
                    where both atoms count the shared pair toward their octet. This sharing is what we
                    call a <strong style={{ color: "#6366f1" }}>covalent bond</strong>, and it is the
                    foundation of organic chemistry and life itself.
                  </>
                ),
              },
              {
                label: "NONE",
                groups: "Group 18",
                color: "rgba(114,184,114,0.07)",
                border: "rgba(114,184,114,0.3)",
                accent: "#72b872",
                body: (
                  <>
                    The <Term id="noble-gas">noble gases</Term> already have a full outer shell and
                    have no reason to react. Helium, neon, and argon are the most chemically inert
                    elements in the periodic table. They exist as individual atoms and almost never
                    form compounds under normal conditions.
                  </>
                ),
              },
            ].map(({ label, groups, color, border, accent, body }) => (
              <div
                key={label}
                className="flex gap-4 p-5"
                style={{ background: color, border: `1px solid ${border}`, borderRadius: "4px" }}
              >
                <div className="flex flex-col items-center shrink-0" style={{ minWidth: "52px" }}>
                  <span
                    className="font-heading text-xs"
                    style={{ color: accent, letterSpacing: "0.12em", fontSize: "0.65rem" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-xs mt-1 text-center"
                    style={{ color: "var(--oc-text-dim)", lineHeight: 1.3, fontSize: "0.6rem" }}
                  >
                    {groups}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── GROUPS AS FAMILIES ──────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          GROUPS AS CHEMICAL FAMILIES
        </h2>
        <div className="max-w-2xl mb-12">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            The <Term id="periodic-table">periodic table</Term> is arranged so that elements in the
            same column share the same number of <Term id="valence-electron">valence electrons</Term>.
            This means they follow the same strategy — and behave in strikingly similar ways. Group 1
            is called the <strong style={{ color: "var(--oc-text)" }}>alkali metals</strong>: lithium,
            sodium, potassium, and their heavier cousins all have 1 valence electron and all react
            vigorously with water. Group 17, the <Term id="halogen">halogens</Term>, all have 7 valence
            electrons and all seek to gain 1 more — making them some of the most reactive
            non-metals known.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            This is not a coincidence — it is the reason the periodic table exists. Mendeleev arranged
            the <Term id="element">elements</Term> by <Term id="atomic-number">atomic number</Term> and
            noticed that chemical properties repeated in a regular pattern every 8 (or 18) elements.
            That repeating pattern is the repeating valence electron count.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Once you know how many valence electrons an atom has, you can predict whether it is a
            metal or a non-metal, whether it will form positive or negative ions, and what kinds of
            bonds it tends to make — even without ever having studied that specific element before.
          </p>
        </div>

        {/* ── TEST YOURSELF ───────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6">
          <h2
            className="font-heading"
            style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
          >
            VALENCE STRATEGY
          </h2>
          <span
            className="font-heading text-xs px-2 py-0.5"
            style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "rgba(167,139,250,0.85)", borderRadius: "3px", letterSpacing: "0.1em", fontSize: "0.55rem" }}
          >
            MINI GAME
          </span>
        </div>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Given an <Term id="element">element</Term>, classify what it tends to do with its{" "}
            <Term id="valence-electron">valence electrons</Term>. Use what you know about the group
            number rule and the <Term id="octet-rule">octet rule</Term> — does this atom lose,
            gain, share, or already have a full outer shell?
          </p>
        </div>

        <ValenceStrategyGame />

        {/* ── NEXT LESSON TEASER ──────────────────────────── */}
        <div
          className="max-w-2xl mb-16 p-6"
          style={{
            border: "1px solid var(--oc-green-border-dim)",
            background: "var(--oc-green-bg-surface)",
            borderRadius: "4px",
          }}
        >
          <p
            className="font-heading text-xs tracking-widest mb-3"
            style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}
          >
            UP NEXT
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            We now know that atoms gain, lose, or share{" "}
            <Term id="valence-electron">valence electrons</Term> to reach a stable full outer{" "}
            <Term id="valence-shell">valence shell</Term>. In lesson 2.3 we will look at exactly what
            happens when they do: the formation of <strong style={{ color: "var(--oc-text)" }}>chemical bonds</strong>.
            We&apos;ll cover ionic bonds — formed by electron transfer — and covalent bonds — formed
            by electron sharing — and see how the <Term id="octet-rule">octet rule</Term> drives both.
          </p>
        </div>

        {/* ── NAVIGATION ──────────────────────────────────── */}
        <div
          className="flex justify-between items-center mt-4 pt-8"
          style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}
        >
          <Link
            href="/courses/chemistry-1/lessons/electron-shells"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ border: "1px solid rgba(167,139,250,0.3)", color: "rgba(167,139,250,0.9)", letterSpacing: "0.15em" }}
          >
            ← PREV: ELECTRON SHELLS
          </Link>
          <Link
            href="/courses/chemistry-1"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ border: "1px solid var(--oc-green-subtle)", color: "var(--oc-green)", letterSpacing: "0.15em" }}
          >
            BACK TO COURSE →
          </Link>
        </div>

      </div>
    </main>
  );
}
