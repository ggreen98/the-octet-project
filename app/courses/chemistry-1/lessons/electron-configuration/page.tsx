import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { AufbauDiagram }         from "@/components/lessons/AufbauDiagram";
import { Term } from "@/components/ui/Term";
import { SubshellTable } from "@/components/lessons/SubshellTable";
import { HundsRuleExercise } from "@/components/lessons/HundsRuleExercise";
import { SOrbitalAnimation } from "@/components/lessons/SOrbitalAnimation";

export const metadata = {
  title: "Electron Configuration — Chemistry I | Allylic",
  description: "Learn how electrons fill subshells — subshell types, the Aufbau principle, and Hund's rule.",
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

          <p
            className="font-heading text-xs mb-3"
            style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}
          >
            {`// INTERACTIVE — click a row · toggle 2D / 3D · select individual orbitals`}
          </p>
          <SubshellTable />

          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Each orbital can hold exactly 2 electrons. So an s subshell with 1 orbital holds 2,
            a p subshell with 3 orbitals holds 6, and so on.
          </p>
        </div>

        {/* ── ORBITAL FORMATION ANIMATION ─────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          ORBITALS AS PROBABILITY CLOUDS
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            So where does the spherical shape of an s orbital actually come from? An electron doesn&apos;t
            sit still — it moves continuously around the nucleus. Because of quantum mechanics,
            we can&apos;t know exactly where it is at any moment, only the{" "}
            <strong style={{ color: "var(--oc-text)" }}>probability</strong> of finding it in a
            given region. The orbital shape is simply a map of that probability — denser where the
            electron spends more time. Use the animation below to build that intuition.
          </p>
          <SOrbitalAnimation />
        </div>

        {/* ── AUFBAU PRINCIPLE ────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          THE AUFBAU PRINCIPLE
        </h2>
        <div className="max-w-2xl mb-6">
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            "Aufbau" is German for <em>building up</em>. The principle is simple: <Term id="electron">electrons</Term> fill
            the lowest available energy subshell first, then the next, and so on. You build an
            atom&apos;s configuration by adding electrons one at a time into the cheapest available seat.
            Based on that, can you guess the order we should fill orbitals in? Give it a try in the
            diagram below.
          </p>
        </div>

        {/* ── AUFBAU INTERACTIVE DIAGRAM ──────────────────── */}
        <div className="max-w-2xl mb-10">
          <AufbauDiagram />
        </div>

        <div className="max-w-2xl mb-10">
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

          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Notice that 4s comes before 3d because it&apos;s lower in energy.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            There is one more rule to know: when filling a subshell that has multiple orbitals —
            like the three orbitals in a p subshell — electrons spread out into empty orbitals first,
            one per orbital, before any pairing occurs. Only once every orbital in the subshell has
            one electron do they start doubling up. This is called{" "}
            <strong style={{ color: "var(--oc-text)" }}>Hund&apos;s rule</strong>, and it happens
            because electrons repel each other — occupying separate orbitals keeps them further apart
            and lowers the overall energy.
          </p>
        </div>

        {/* ── HUND'S RULE EXERCISE ─────────────────────────── */}
        <div className="max-w-2xl mb-4">
          <HundsRuleExercise />
        </div>

        {/* ── UP NEXT ─────────────────────────────────────── */}
        <div
          className="max-w-2xl mb-16 p-6"
          style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-bg-surface)", borderRadius: "4px" }}
        >
          <p className="font-heading text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            UP NEXT
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Now that we know the rules for filling orbitals, lesson 2.4 covers how to write and read
            the notation — the precise shorthand chemists use to record every <Term id="electron">electron</Term> in
            an atom. We&apos;ll also look at the s/p/d blocks and noble gas abbreviated form.
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
            href="/courses/chemistry-1/lessons/electron-configuration-notation"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center"
            style={{ border: "1px solid var(--oc-green-subtle)", color: "var(--oc-green)", letterSpacing: "0.12em" }}
          >
            NEXT: ELECTRON CONFIGURATION NOTATION →
          </Link>
        </div>

      </div>
    </main>
  );
}
