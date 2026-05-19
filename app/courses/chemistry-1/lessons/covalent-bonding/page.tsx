import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { Term } from "@/components/ui/Term";
import { CovalentBondVisualizer } from "@/components/lessons/CovalentBondVisualizer";
import { LewisStructureNotation } from "@/components/lessons/LewisStructureNotation";
import { PolarityExplorer } from "@/components/lessons/PolarityExplorer";
import { ESPMapVisualizer } from "@/components/lessons/ESPMapVisualizer";

export const metadata = {
  title: "Covalent Bonding — Chemistry I | Allylic",
  description: "Learn how covalent bonds form through electron sharing, why some bonds are polar and others aren't, and what makes molecular compounds different from ionic ones.",
};

export default function CovalentBondingLesson() {
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
          <span style={{ color: "var(--oc-green)" }}>COVALENT BONDING</span>
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
            LESSON 3.2
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
          COVALENT BONDING
        </h1>
        <p className="text-base leading-relaxed mb-10 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          In lesson 3.1 you saw what happens when one atom gives and one atom takes —{" "}
          <Term id="ionic-bond">ionic bonding</Term>. But what happens when both atoms want the{" "}
          <Term id="electron">electrons</Term>? Neither gives them up. Instead, they share — and that
          shared claim on the same electrons is what holds a{" "}
          <Term id="covalent-bond">covalent bond</Term> together.
        </p>

        {/* ── THE LIBRARY ANALOGY ─────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          THE LIBRARY BOOK
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Imagine two students who both need the same textbook. Nobody wants to hand it over permanently —
            they both need it. So they agree to share: the book stays between them, and both can pull it
            toward themselves whenever they need it. The book now &ldquo;belongs&rdquo; to both at once.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            <Term id="covalent-bond">Covalent bonds</Term> work exactly this way. Instead of one atom
            stealing an <Term id="electron">electron</Term> from another, both atoms contribute electrons
            to a <Term id="bond-pair">shared pair</Term>. That pair is simultaneously attracted to both
            nuclei — and the mutual tug-of-war holds the two atoms together.
          </p>

          {/* Comparison callout */}
          <div
            className="p-5 mb-8"
            style={{ border: "1px solid rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.05)", borderRadius: "4px", borderLeft: "3px solid rgba(52,211,153,0.5)" }}
          >
            <p className="font-heading text-xs mb-3" style={{ color: "rgba(52,211,153,0.8)", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
              IONIC vs COVALENT — SIDE BY SIDE
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 p-3" style={{ border: "1px solid rgba(247,37,133,0.2)", background: "rgba(247,37,133,0.04)", borderRadius: "4px" }}>
                <p className="font-heading text-xs mb-1" style={{ color: "#f72585", fontSize: "0.65rem", letterSpacing: "0.1em" }}>IONIC</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                  One atom <strong style={{ color: "var(--oc-text)" }}>gives</strong>, one atom{" "}
                  <strong style={{ color: "var(--oc-text)" }}>takes</strong>. Electrons fully
                  transferred. Charged ions form.
                </p>
              </div>
              <div className="flex-1 p-3" style={{ border: "1px solid rgba(52,211,153,0.2)", background: "rgba(52,211,153,0.04)", borderRadius: "4px" }}>
                <p className="font-heading text-xs mb-1" style={{ color: "rgba(52,211,153,0.9)", fontSize: "0.65rem", letterSpacing: "0.1em" }}>COVALENT</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                  Both atoms <strong style={{ color: "var(--oc-text)" }}>share</strong>. Electrons stay
                  between them. No ions formed.
                </p>
              </div>
            </div>
          </div>

          {/* Visualizer */}
          <div
            className="p-6 mb-4"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-badge)", borderRadius: "4px" }}
          >
            <p className="font-heading text-xs mb-5" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.65rem" }}>
              WATCH ELECTRONS SHARE
            </p>
            <CovalentBondVisualizer />
          </div>
        </div>

        {/* ── SINGLE, DOUBLE, TRIPLE BONDS ────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          ONE, TWO, OR THREE PAIRS
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Sometimes one shared pair isn&apos;t enough to satisfy the <Term id="octet-rule">octet rule</Term>{" "}
            for both atoms. When that happens, atoms share two or even three pairs — forming double or
            triple bonds. More shared pairs means a stronger, shorter bond.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            {[
              {
                label: "SINGLE BOND  (—)",
                example: "H₂, HCl, H₂O",
                color: "#34d399",
                text: "One shared pair of electrons. The weakest and longest of the three. Each atom contributes 1 electron to the shared pair.",
              },
              {
                label: "DOUBLE BOND  (═)",
                example: "O₂, CO₂",
                color: "#60a5fa",
                text: "Two shared pairs (4 electrons total). Stronger and shorter than a single bond. Oxygen gas (O₂) is a classic example — each O contributes 2 electrons.",
              },
              {
                label: "TRIPLE BOND  (≡)",
                example: "N₂, CO",
                color: "#f5a623",
                text: "Three shared pairs (6 electrons total). The strongest covalent bond — very short and very hard to break. Nitrogen gas (N₂) holds its triple bond so tightly that N₂ is extremely unreactive.",
              },
            ].map(({ label, example, color, text }) => (
              <div key={label} className="p-4" style={{ border: `1px solid ${color}33`, background: `${color}08`, borderRadius: "4px" }}>
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-heading text-xs" style={{ color, letterSpacing: "0.1em", fontSize: "0.7rem" }}>
                    {label}
                  </p>
                  <span className="font-heading text-xs" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", letterSpacing: "0.08em" }}>
                    {example}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── LEWIS STRUCTURE NOTATION ────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          DRAWING BONDS: DOTS AND LINES
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            A <Term id="lewis-structure">Lewis structure</Term> is a diagram that accounts for every
            valence electron in a molecule — both the electrons involved in bonding and the ones sitting
            alone as <Term id="lone-pair">lone pairs</Term>. The rules are simple: draw each atom,
            count all available valence electrons, and arrange them so every atom (except hydrogen)
            ends up with a full octet.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Electrons shared between two atoms are called{" "}
            <Term id="bond-pair">bond pairs</Term> and are drawn as two dots between the atoms (·· ).
            Electrons that belong to one atom and aren&apos;t shared are{" "}
            <Term id="lone-pair">lone pairs</Term> and sit beside their atom (: or ·· on the side).
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Dot notation is precise, but in practice chemists switch to{" "}
            <strong style={{ color: "var(--oc-text)" }}>line notation</strong> — each bond pair of
            dots becomes a single line (—). A double bond is two lines (═), a triple bond is three
            (≡). Lone pairs stay as dots. This shorthand is far faster to draw and is the standard
            you&apos;ll see in every textbook and research paper.
          </p>

          <div className="mb-2">
            <LewisStructureNotation />
          </div>

          <p className="text-sm leading-relaxed mt-5" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace", letterSpacing: "0.04em" }}>
            Toggle between DOT NOTATION and LINE NOTATION to see how each pair of bonding dots
            collapses into a single line. Lone pair dots (gray) remain in both views — they are
            not part of the bond, but they affect the molecule&apos;s shape and reactivity.
          </p>
        </div>

        {/* ── POLAR vs NONPOLAR ───────────────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          NOT ALL SHARING IS EQUAL
        </h2>
        <div className="max-w-2xl mb-8">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            When the two students sharing a textbook are equally determined, the book stays exactly in the
            middle. But if one student is more aggressive about pulling it toward themselves, the book drifts
            to their side. Covalent bonds work the same way — the shared electrons don&apos;t always sit
            perfectly in the center.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            How uneven that sharing is determines a bond&apos;s{" "}
            <Term id="polarity">polarity</Term> — the degree to which electrons are distributed
            unevenly between the two atoms. We can measure polarity precisely using the{" "}
            <Term id="dipole-moment">dipole moment</Term> (symbol{" "}
            <strong style={{ color: "var(--oc-text)" }}>μ</strong>, pronounced &ldquo;mu&rdquo;): the
            product of the partial charge and the distance between the two charge centers, measured in{" "}
            <strong style={{ color: "var(--oc-text)" }}>debyes (D)</strong>. A bond with perfectly even
            sharing has μ = 0 D. A bond with uneven sharing has μ &gt; 0 D — the larger the number,
            the greater the charge separation.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            The atomic property that controls polarity is <Term id="electronegativity">electronegativity</Term> —
            how strongly an atom pulls electrons toward itself. If both atoms have the same electronegativity
            (like H–H), the electrons split evenly and μ = 0 D: a{" "}
            <Term id="nonpolar-covalent-bond">nonpolar covalent bond</Term>. If one atom is more
            electronegative (like H–Cl, where chlorine pulls harder), the electrons drift toward the
            stronger atom: a <Term id="polar-covalent-bond">polar covalent bond</Term> with μ &gt; 0 D.
            For reference, H–Cl has μ = 1.08 D and H–F has μ = 1.86 D — fluorine&apos;s higher
            electronegativity creates a larger dipole even though the bond lengths are similar.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            In a polar bond, the more electronegative atom picks up a partial negative charge (written{" "}
            <strong style={{ color: "var(--oc-text)" }}>δ⁻</strong>, &ldquo;delta minus&rdquo;) and the
            other atom gets a partial positive charge (<strong style={{ color: "var(--oc-text)" }}>δ⁺</strong>).
            These aren&apos;t full charges like Na⁺ or Cl⁻ — they&apos;re fractions of a charge, a subtle
            imbalance in where the electrons spend their time.
          </p>

          {/* Polarity Explorer */}
          <div
            className="p-6 mb-4"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-badge)", borderRadius: "4px" }}
          >
            <PolarityExplorer />
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Notice how the spectrum is continuous — there&apos;s no sharp line between polar covalent and
            ionic. The cutoff (ΔEN ≈ 1.7) is a useful rule of thumb, not a law of nature. Bonds
            near the border have both covalent and ionic character.
          </p>
        </div>

        {/* ── ELECTROSTATIC POTENTIAL MAP ─────────────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          SEEING CHARGE DISTRIBUTION
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Chemists use <strong style={{ color: "var(--oc-text)" }}>electrostatic potential (ESP) maps</strong> to
            visualize how charge is distributed across a molecule&apos;s surface. The surface itself is drawn
            at a constant <Term id="electron">electron</Term> density — like a skin over the molecule — and
            then colored by the electric potential at each point:
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 p-4" style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#ef4444", fontSize: "0.7rem", letterSpacing: "0.1em" }}>RED — NEGATIVE</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                High electron density. Lone pairs and π bonds concentrate negative charge here — the atom is electron-rich and can attract positive charges.
              </p>
            </div>
            <div className="flex-1 p-4" style={{ border: "1px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.05)", borderRadius: "4px" }}>
              <p className="font-heading text-xs mb-2" style={{ color: "#3b82f6", fontSize: "0.7rem", letterSpacing: "0.1em" }}>BLUE — POSITIVE</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
                Low electron density. The nuclear charge is barely shielded here — typically near hydrogen atoms in polar bonds, or wherever electrons have been pulled away.
              </p>
            </div>
          </div>

          <div
            className="p-6 mb-4"
            style={{ border: "1px solid var(--oc-green-border-dim)", background: "var(--oc-green-badge)", borderRadius: "4px" }}
          >
            <p className="font-heading text-xs mb-5" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.65rem" }}>
              ELECTROSTATIC POTENTIAL MAP — DRAG TO ROTATE
            </p>
            <ESPMapVisualizer />
          </div>
        </div>

        {/* ── PROPERTIES OF MOLECULAR COMPOUNDS ───────────── */}
        <h2
          className="font-heading mb-6 mt-10"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          PROPERTIES OF MOLECULAR COMPOUNDS
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Compounds held together by <Term id="covalent-bond">covalent bonds</Term> are called{" "}
            <Term id="molecular-compound">molecular compounds</Term>. Because they don&apos;t form charged
            ions, they behave very differently from ionic compounds like NaCl:
          </p>

          <div className="flex flex-col gap-3 mb-6">
            {[
              {
                label: "LOWER MELTING & BOILING POINTS",
                color: "#60a5fa",
                text: "Molecular compounds exist as individual molecules. The forces between molecules (intermolecular forces) are much weaker than the ionic lattice forces in ionic compounds. Many molecular compounds — like water (100 °C boiling point) or oxygen gas (−183 °C) — are liquids or gases at room temperature.",
              },
              {
                label: "DON'T CONDUCT ELECTRICITY",
                color: "#34d399",
                text: "Most molecular compounds produce no charged particles in solution. Without mobile ions or electrons, there's nothing to carry an electric current. Pure water, for example, is an excellent insulator. (Polar compounds that do ionize in water — like HCl — are the exception, not the rule.)",
              },
              {
                label: "DISSOLVE IN NON-POLAR SOLVENTS",
                color: "#f5a623",
                text: "\"Like dissolves like.\" Non-polar molecular compounds (such as fats, oils, and many plastics) dissolve in non-polar solvents like hexane or acetone, not in water. Polar molecular compounds (like sugar or ethanol) do dissolve in water because of their partial charges.",
              },
              {
                label: "SOFTER & MORE FLEXIBLE",
                color: "#a855f7",
                text: "Without an ionic lattice, molecular solids are held together by weaker intermolecular forces. They tend to be softer, more flexible, and easier to deform than ionic or metallic solids.",
              },
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

        {/* ── QUICK SUMMARY ───────────────────────────────── */}
        <div
          className="max-w-2xl mb-10 p-5"
          style={{ border: "1px solid rgba(52,211,153,0.25)", background: "rgba(52,211,153,0.04)", borderRadius: "4px" }}
        >
          <p className="font-heading text-xs mb-4" style={{ color: "rgba(52,211,153,0.8)", letterSpacing: "0.12em", fontSize: "0.7rem" }}>
            LESSON SUMMARY
          </p>
          <div className="flex flex-col gap-2">
            {[
              "Covalent bonds form when atoms share electrons rather than transferring them.",
              "Shared electrons are simultaneously attracted to both nuclei — that mutual pull is the bond.",
              "Single bonds share 1 pair; double bonds share 2; triple bonds share 3. More pairs = stronger + shorter.",
              "Nonpolar covalent bonds have equal sharing (ΔEN < 0.5). Polar covalent bonds have unequal sharing (ΔEN 0.5–1.7).",
              "Partial charges (δ⁺ / δ⁻) appear on polar bonds — not full charges, just a drift in electron density.",
              "Molecular compounds have lower melting points, don't conduct electricity, and often exist as gases or liquids.",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-heading shrink-0 mt-0.5" style={{ color: "rgba(52,211,153,0.6)", fontSize: "0.65rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>{point}</p>
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
            You&apos;ve seen ionic bonding (give and take) and covalent bonding (sharing). There&apos;s one
            more major bond type: <strong style={{ color: "var(--oc-text)" }}>metallic bonding</strong>,
            where electrons don&apos;t belong to any individual atom at all — they roam freely through the
            entire material. Lesson 3.3 covers how that works and why metals conduct electricity.
          </p>
        </div>

        {/* ── NAVIGATION ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1/lessons/ionic-bonding"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center flex-1"
            style={{ border: "1px solid rgba(167,139,250,0.3)", color: "rgba(167,139,250,0.9)", letterSpacing: "0.12em" }}
          >
            ← PREV: IONIC BONDING
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
