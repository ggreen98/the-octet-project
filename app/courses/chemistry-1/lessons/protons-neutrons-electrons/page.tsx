import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { MagnetSim } from "@/components/lessons/MagnetSim";
import { SubatomicExplorer } from "@/components/lessons/SubatomicExplorer";
import { ElectronsHeading } from "@/components/lessons/ElectronsHeading";
import { ProtonHeading } from "@/components/lessons/ProtonHeading";
import { NeutronHeading } from "@/components/lessons/NeutronHeading";
import { Term } from "@/components/ui/Term";
import { Unit } from "@/components/ui/Unit";

export const metadata = {
  title: "Protons, Neutrons & Electrons — Chemistry I | Allylic",
  description: "Meet the three subatomic particles that make up every atom in the universe.",
};

export default function SubatomicParticlesLesson() {
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
          <span className="font-heading hidden sm:block" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 tracking-widest" style={{ fontSize: "0.85rem", color: "var(--oc-green-dim)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <Link href="/courses/chemistry-1" className="hover:text-green-400 transition-colors">CHEMISTRY I</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <span style={{ color: "var(--oc-green)" }}>PROTONS, NEUTRONS & ELECTRONS</span>
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
            LESSON 1.2
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
          PROTONS, NEUTRONS & ELECTRONS
        </h1>
        <p className="text-base leading-relaxed mb-8 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          Meet the three building blocks hiding inside every atom in the universe.
        </p>

        {/* ── SUBATOMIC PARTICLE DIAGRAM ───────────────────── */}
        <SubatomicExplorer />

        {/* ── PROTONS ─────────────────────────────────────── */}
        <ProtonHeading />

        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            As we discovered in the last lesson, <Term id="proton">protons</Term> live in the <Term id="atom">atom</Term>&apos;s centre — its <Term id="nucleus">nucleus</Term>.
            Each proton carries a positive <Term id="charge">charge</Term> of +1 and has a mass of approximately
            1 <Term id="atomic-mass-unit">atomic mass unit</Term> (<Unit id="atomic-mass-unit">u</Unit>) — making it one of the heaviest subatomic particles.
            It is this positive charge that gives every atom its identity: the number of protons
            in an atom determines what <Term id="element">element</Term> it is. Change the number of protons and
            you change the element entirely.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            But what exactly is a positive <Term id="charge">charge</Term>?
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Let&apos;s do an experiment. Grab two magnets off your fridge and push them together —
            one of two things will happen. They will either snap together as if pulled by an invisible
            force, or resist your attempts as if an invisible hand is pushing back against you.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            These pushing and pulling forces are a result of <Term id="charge">charge</Term>. Charge is one of the most
            fundamental properties in nature — it describes whether something attracts or repels
            other things around it. Opposite charges attract, like charges repel. <Term id="proton">Protons</Term> carry a
            positive charge, and as we&apos;ll soon see, that has enormous consequences for how <Term id="atom">atoms</Term> behave.
          </p>
        </div>

        {/* ── MAGNET SIM ──────────────────────────────────── */}
        <div className="mb-16">
          <MagnetSim />
        </div>

        {/* ── NEUTRONS ─────────────────────────────────────── */}
        <NeutronHeading />

        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Alongside <Term id="proton">protons</Term> in the <Term id="nucleus">nucleus</Term> sit the <Term id="neutron">neutrons</Term> —
            particles of almost identical mass (approximately 1.008 <Term id="atomic-mass-unit">atomic mass units</Term> [<Unit id="atomic-mass-unit">u</Unit>]) but carrying
            no <Term id="charge">charge</Term> whatsoever. A <Term id="neutron">neutron</Term> is electrically neutral,
            which is exactly where it gets its name.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            This raises an obvious question: if <Term id="proton">protons</Term> all carry a positive charge and like charges repel,
            why doesn&apos;t the <Term id="nucleus">nucleus</Term> simply fly apart? The answer lies in the <strong style={{ color: "var(--oc-text)" }}>strong nuclear force</strong> —
            one of the four fundamental forces of nature. At the incredibly short distances inside a <Term id="nucleus">nucleus</Term>
            (on the order of <Unit id="femtometre">femtometres</Unit> — about 10<sup>−15</sup> <Unit id="metre">metres</Unit>), this force is far more powerful than the
            electromagnetic repulsion between like charged <Term id="proton">protons</Term>, locking the <Term id="nucleus">nucleus</Term> together.
            <Term id="neutron">Neutrons</Term> contribute to this binding without adding any additional repulsive charge,
            effectively acting as a kind of nuclear glue.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Because <Term id="neutron">neutrons</Term> carry no charge, changing the number of them in a <Term id="nucleus">nucleus</Term>{" "}
            does <em>not</em> change what <Term id="element">element</Term> an atom is — that is determined solely by the
            proton count. Atoms of the same <Term id="element">element</Term> that differ only in their number of <Term id="neutron">neutrons</Term>{" "}
            are called <Term id="isotope">isotopes</Term>. Carbon, for example, almost always has 6 neutrons (carbon-12),
            but a small fraction of carbon atoms carry 7 neutrons (carbon-13) or even 8 (carbon-14) — the
            radioactive isotope used in archaeological dating.
          </p>
        </div>

        {/* ── ELECTRONS ────────────────────────────────────── */}
        <ElectronsHeading />

        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            <Term id="electron">Electrons</Term> are the negatively charged counterpart to <Term id="proton">protons</Term>. They carry a <Term id="charge">charge</Term> of −1
            yet have only a tiny fraction of a proton&apos;s mass — about 1/1,836th — making them by far the lightest
            of the three <Term id="subatomic-particle">subatomic particles</Term>. In a neutral atom, the number of electrons
            exactly matches the number of protons — one negative charge cancelling each positive charge —
            so the overall, or <strong style={{ color: "var(--oc-text)" }}>net charge</strong>, of the atom is zero. Despite their lightness, electrons are anything but insignificant.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Electrons move at extraordinary speeds around the <Term id="nucleus">nucleus</Term>, occupying regions of space
            called <Term id="orbital-shell">orbital shells</Term> rather than fixed paths — think less &quot;planet orbiting a sun&quot;
            and more &quot;cloud of probability surrounding a core.&quot; Because electrons are negatively charged
            and the nucleus carries a positive charge (thanks to the <Term id="proton">protons</Term> inside it),
            the two are attracted to one another by the same electromagnetic force we just explored
            with the magnets — holding the electrons in place around the atom.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            This is where things get exciting. <Term id="electron">Electrons</Term> — specifically those in the outermost
            <Term id="orbital-shell"> orbital shell</Term> — are what <em>do</em> chemistry. When atoms come close to one another,
            it is their outer electrons that interact, overlap, and rearrange to form chemical bonds.
            Every reaction, every molecule, every material you have ever touched is a consequence of
            electrons behaving this way. We will explore bonding in much greater detail in later lessons.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            One more concept worth introducing here: when an atom <em>gains</em> or <em>loses</em> electrons,
            its net charge is no longer zero. An atom that has lost one or more electrons has more protons than
            electrons and becomes positively charged. An atom that has gained electrons has more electrons than
            protons and becomes negatively charged. These charged atoms are called <strong style={{ color: "var(--oc-text)" }}>ions</strong>.
            Ions are everywhere in chemistry — table salt, for example, is made of sodium ions (Na⁺, one electron lost)
            and chloride ions (Cl⁻, one electron gained) held together by the attraction between their opposite charges.
            We will return to ions in much greater detail in later lessons.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 mt-16 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1/lessons/atoms"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center"
            style={{ border: "1px solid rgba(68,153,255,0.3)", color: "var(--oc-blue)", letterSpacing: "0.12em" }}
          >
            ← PREV: ATOMS
          </Link>
          <Link
            href="/courses/chemistry-1/lessons/the-periodic-table"
            className="font-heading text-xs px-5 py-3 transition-all duration-200 text-center"
            style={{ background: "var(--oc-blue)", color: "var(--oc-btn-text)", letterSpacing: "0.12em" }}
          >
            NEXT: PERIODIC TABLE →
          </Link>
        </div>
      </div>
    </main>
  );
}
