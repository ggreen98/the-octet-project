import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { Term } from "@/components/ui/Term";
import { IonicBondVisualizer } from "@/components/lessons/IonicBondVisualizer";

export const metadata = {
  title: "Ionic Bonding — Chemistry I | Allylic",
  description: "Learn how ionic bonds form through electron transfer between atoms, using the analogy of opposites attracting.",
};

export default function IonicBondingLesson() {
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
          <span style={{ color: "var(--oc-green)" }}>IONIC BONDING</span>
        </div>

        <div className="flex items-center gap-3">
          <MobileNav />
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-14 max-w-3xl mx-auto">

        {/* Lesson label */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-heading text-xs px-2 py-0.5"
            style={{ background: "rgba(52,211,153,0.1)", color: "rgba(52,211,153,0.9)", border: "1px solid rgba(52,211,153,0.3)", letterSpacing: "0.12em" }}
          >
            LESSON 3.1
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
          IONIC BONDING
        </h1>
        <p className="text-base leading-relaxed mb-10 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          In Unit 2 you learned that atoms want a full <Term id="valence-shell">valence shell</Term> of eight{" "}
          <Term id="valence-electron">valence electrons</Term>. In Unit 3 we explore what happens when atoms
          actually pursue that goal — by bonding. The simplest way to get there: one atom gives, one atom takes,
          and the resulting opposite charges hold them together forever.
        </p>

        {/* ── THE ANALOGY ─────────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          UNCLE JOHN & AUNT SALLY
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Meet Uncle John and Aunt Sally. They couldn&apos;t be more different — John is loud,
            Sally is calm; John gives, Sally receives; John is positive, Sally is negative. And yet
            they&apos;re inseparable. Why? Because <strong style={{ color: "var(--oc-text)" }}>opposites attract.</strong>
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Atoms work exactly the same way. When one atom hands off an <Term id="electron">electron</Term> to
            another, the donor becomes positively charged and the recipient becomes negatively charged.
            Those opposite charges pull toward each other — and that pull is an{" "}
            <Term id="ionic-bond">ionic bond</Term>.
          </p>

          {/* Uncle John / Aunt Sally cards */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div
              className="flex-1 p-5"
              style={{ border: "1px solid rgba(68,153,255,0.35)", background: "rgba(68,153,255,0.05)", borderRadius: "4px" }}
            >
              <p className="font-heading text-xs mb-1" style={{ color: "#4499ff", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                UNCLE JOHN — THE GIVER
              </p>
              <p className="font-heading mb-3" style={{ fontSize: "1.6rem", color: "#4499ff" }}>Na⁺</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                John is generous — he gives away an electron he doesn&apos;t really need. Now he has one
                more <Term id="proton">proton</Term> than electrons, so he carries a{" "}
                <strong style={{ color: "#4499ff" }}>positive charge</strong>. In chemistry we call
                him a <Term id="cation">cation</Term>.
              </p>
            </div>
            <div
              className="flex-1 p-5"
              style={{ border: "1px solid rgba(247,37,133,0.35)", background: "rgba(247,37,133,0.05)", borderRadius: "4px" }}
            >
              <p className="font-heading text-xs mb-1" style={{ color: "#f72585", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                AUNT SALLY — THE RECEIVER
              </p>
              <p className="font-heading mb-3" style={{ fontSize: "1.6rem", color: "#f72585" }}>Cl⁻</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Sally gladly accepts — she was one electron short of a full shell and this completes it.
                Now she has one more electron than protons, so she carries a{" "}
                <strong style={{ color: "#f72585" }}>negative charge</strong>. In chemistry we call
                her an <Term id="anion">anion</Term>.
              </p>
            </div>
          </div>

          {/* Attraction callout */}
          <div
            className="p-5 mb-8"
            style={{ border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.05)", borderRadius: "4px", borderLeft: "3px solid rgba(52,211,153,0.6)" }}
          >
            <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
              Na⁺ is positive. Cl⁻ is negative. Just like Uncle John and Aunt Sally —{" "}
              <strong style={{ color: "var(--oc-text)" }}>opposites attract.</strong> The electrostatic
              pull between them is what holds the bond together. This is an ionic bond, and the compound
              they form is <strong style={{ color: "var(--oc-text)" }}>NaCl</strong> — table salt.
            </p>
          </div>

          {/* Animation */}
          <div
            className="p-6 mb-4"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-badge)", borderRadius: "4px" }}
          >
            <p className="font-heading text-xs mb-5" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.65rem" }}>
              WATCH IT HAPPEN
            </p>
            <IonicBondVisualizer />
          </div>
        </div>

        {/* ── WHY THE TRANSFER HAPPENS ────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          WHY THE TRANSFER HAPPENS
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            The electron transfer isn&apos;t random — it&apos;s driven by the{" "}
            <Term id="octet-rule">octet rule</Term>. Both atoms end up better off:
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <div className="p-4" style={{ border: "1px solid rgba(68,153,255,0.2)", background: "rgba(68,153,255,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#4499ff", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                SODIUM (Na) — BEFORE
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Sodium has 11 electrons: 2 in shell 1, 8 in shell 2, and 1 lonely electron in shell 3.
                That outermost shell is almost empty. It costs very little <Term id="ionization-energy">ionization energy</Term> to
                remove it — so sodium readily gives it away, leaving a full shell 2 as its new outer shell.
              </p>
            </div>
            <div className="p-4" style={{ border: "1px solid rgba(247,37,133,0.2)", background: "rgba(247,37,133,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#f72585", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                CHLORINE (Cl) — BEFORE
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Chlorine has 17 electrons: 2 in shell 1, 8 in shell 2, and 7 in shell 3 — one short of
                a full octet. Its high <Term id="electronegativity">electronegativity</Term> reflects exactly
                this: it pulls hard on any nearby electron because gaining just one more completes its shell.
              </p>
            </div>
            <div className="p-4" style={{ border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "rgba(52,211,153,0.9)", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                BOTH — AFTER THE TRANSFER
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Na gives its one valence electron to Cl. Na⁺ now has a full shell 2 outer shell (8 electrons).
                Cl⁻ now has a full shell 3 outer shell (8 electrons). Both have achieved the stable{" "}
                <Term id="noble-gas">noble gas</Term> configuration. Everyone wins.
              </p>
            </div>
          </div>
        </div>

        {/* ── WHAT MAKES AN IONIC BOND ─────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          WHAT MAKES A BOND IONIC?
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Not every pair of atoms forms an ionic bond. The key ingredient is a large difference in{" "}
            <Term id="electronegativity">electronegativity</Term> — one atom must want electrons much more
            than the other. When the gap is large enough, the more electronegative atom essentially pulls
            the electron completely away rather than sharing it.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 p-4" style={{ border: "1px solid rgba(68,153,255,0.2)", background: "rgba(68,153,255,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#4499ff", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                METALS → CATIONS
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Metals (especially Groups 1 & 2) have low ionization energies and low electronegativity —
                they give electrons away easily. They become <Term id="cation">cations</Term>.
              </p>
            </div>
            <div className="flex-1 p-4" style={{ border: "1px solid rgba(247,37,133,0.2)", background: "rgba(247,37,133,0.04)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#f72585", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                NON-METALS → ANIONS
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Non-metals (especially Groups 16 & 17) have high electronegativity and high electron affinity —
                they accept electrons readily. They become <Term id="anion">anions</Term>.
              </p>
            </div>
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            In short: ionic bonds form between metals and non-metals. The metal is always Uncle John —
            the one handing something over — and the non-metal is always Aunt Sally — the one who takes it.
          </p>
        </div>

        {/* ── PROPERTIES OF IONIC COMPOUNDS ───────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          PROPERTIES OF IONIC COMPOUNDS
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Because ionic bonds are strong electrostatic attractions — not just one pair, but billions of
            ions arranged in a lattice all pulling on each other — ionic compounds share a distinctive
            set of properties:
          </p>

          <div className="flex flex-col gap-3 mb-6">
            {[
              { label: "HIGH MELTING POINTS", color: "#f5a623", text: "It takes a lot of energy to break apart an ionic lattice. Most ionic compounds are solid at room temperature and require very high temperatures to melt." },
              { label: "BRITTLE", color: "#a855f7", text: "Strike an ionic crystal and it shatters. Shifting the lattice brings like charges next to each other — repulsion cracks it apart." },
              { label: "CONDUCT ELECTRICITY WHEN DISSOLVED", color: "rgba(52,211,153,0.9)", text: "Solid ionic compounds don't conduct electricity because the ions can't move. Dissolve them in water or melt them and the ions are free to carry charge — they conduct." },
              { label: "SOLUBLE IN WATER", color: "#4499ff", text: "Water molecules have a slight charge imbalance that lets them attract ions away from the lattice one by one, pulling the compound apart and dissolving it. This is why salt disappears when you stir it into a glass of water." },
            ].map(({ label, color, text }) => (
              <div key={label} className="p-4" style={{ border: `1px solid ${color}33`, background: `${color}08`, borderRadius: "4px" }}>
                <p className="font-heading text-xs mb-2" style={{ color, letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                  {label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── UP NEXT ─────────────────────────────────────── */}
        <div
          className="max-w-2xl mb-16 p-6"
          style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-bg-surface)", borderRadius: "4px" }}
        >
          <p className="font-heading text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            UP NEXT
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Ionic bonds involve a complete electron transfer — one atom gives, one atom takes. But what
            if both atoms want the electron? Lesson 3.2 covers{" "}
            <strong style={{ color: "var(--oc-text)" }}>covalent bonding</strong> — where atoms split the
            difference and share.
          </p>
        </div>

        {/* ── NAVIGATION ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1/lessons/periodic-trends"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center flex-1"
            style={{ border: "1px solid rgba(167,139,250,0.3)", color: "rgba(167,139,250,0.9)", letterSpacing: "0.12em" }}
          >
            ← PREV: PERIODIC TRENDS
          </Link>
          <Link
            href="/courses/chemistry-1"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center flex-1"
            style={{ border: "1px solid var(--oc-green-subtle)", color: "var(--oc-green)", letterSpacing: "0.12em" }}
          >
            BACK TO CHEMISTRY I →
          </Link>
        </div>

      </div>
    </main>
  );
}
