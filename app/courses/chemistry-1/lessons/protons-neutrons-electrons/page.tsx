import Link from "next/link";
import { MagnetSim } from "@/components/lessons/MagnetSim";
import { SubatomicExplorer } from "@/components/lessons/SubatomicExplorer";
import { ElectronsHeading } from "@/components/lessons/ElectronsHeading";
import { ProtonHeading } from "@/components/lessons/ProtonHeading";
import { NeutronHeading } from "@/components/lessons/NeutronHeading";
import { Term } from "@/components/ui/Term";

export const metadata = {
  title: "Protons, Neutrons & Electrons — Chemistry I | The Octet Project",
  description: "Meet the three subatomic particles that make up every atom in the universe.",
};

export default function SubatomicParticlesLesson() {
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
          <span style={{ color: "#00ff41" }}>PROTONS, NEUTRONS & ELECTRONS</span>
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
            LESSON 02
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
          PROTONS, NEUTRONS & ELECTRONS
        </h1>
        <p className="text-sm leading-relaxed mb-8 max-w-2xl" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
          Meet the three building blocks hiding inside every atom in the universe.
        </p>

        {/* ── SUBATOMIC PARTICLE DIAGRAM ───────────────────── */}
        <SubatomicExplorer />

        {/* ── PROTONS ─────────────────────────────────────── */}
        <ProtonHeading />

        <div className="max-w-2xl mb-10">
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            As we discovered in the last lesson, <Term id="proton">protons</Term> live in the <Term id="atom">atom</Term>&apos;s centre — its <Term id="nucleus">nucleus</Term>.
            Each proton carries a positive <Term id="charge">charge</Term> of +1 and has a mass of approximately
            1 <Term id="atomic-mass-unit">atomic mass unit</Term> (u) — making it one of the heaviest subatomic particles.
            It is this positive charge that gives every atom its identity: the number of protons
            in an atom determines what <Term id="element">element</Term> it is. Change the number of protons and
            you change the element entirely.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            But what exactly is a positive <Term id="charge">charge</Term>?
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            Let&apos;s do an experiment. Grab two magnets off your fridge and push them together —
            one of two things will happen. They will either snap together as if pulled by an invisible
            force, or resist your attempts as if an invisible hand is pushing back against you.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
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
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            Alongside <Term id="proton">protons</Term> in the <Term id="nucleus">nucleus</Term> sit the <Term id="neutron">neutrons</Term> —
            particles of almost identical mass (approximately 1.008 <Term id="atomic-mass-unit">atomic mass units</Term>) but carrying
            no <Term id="charge">charge</Term> whatsoever. A <Term id="neutron">neutron</Term> is electrically neutral,
            which is exactly where it gets its name.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            This raises an obvious question: if <Term id="proton">protons</Term> all carry a positive charge and like charges repel,
            why doesn&apos;t the <Term id="nucleus">nucleus</Term> simply fly apart? The answer lies in the <strong style={{ color: "#c8e8ff" }}>strong nuclear force</strong> —
            one of the four fundamental forces of nature. At the incredibly short distances inside a <Term id="nucleus">nucleus</Term>
            (on the order of femtometres — about 10<sup>−15</sup> metres), this force is far more powerful than the
            electromagnetic repulsion between like charged <Term id="proton">protons</Term>, locking the <Term id="nucleus">nucleus</Term> together.
            <Term id="neutron">Neutrons</Term> contribute to this binding without adding any additional repulsive charge,
            effectively acting as a kind of nuclear glue.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
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
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            <Term id="electron">Electrons</Term> are the negatively charged counterpart to <Term id="proton">protons</Term>. They carry a <Term id="charge">charge</Term> of −1
            yet have only a tiny fraction of a proton&apos;s mass — about 1/1,836th — making them by far the lightest
            of the three <Term id="subatomic-particle">subatomic particles</Term>. In a neutral atom, the number of electrons
            exactly matches the number of protons — one negative charge cancelling each positive charge —
            so the overall, or <strong style={{ color: "#c8e8ff" }}>net charge</strong>, of the atom is zero. Despite their lightness, electrons are anything but insignificant.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            Electrons move at extraordinary speeds around the <Term id="nucleus">nucleus</Term>, occupying regions of space
            called <Term id="orbital-shell">orbital shells</Term> rather than fixed paths — think less &quot;planet orbiting a sun&quot;
            and more &quot;cloud of probability surrounding a core.&quot; Because electrons are negatively charged
            and the nucleus carries a positive charge (thanks to the <Term id="proton">protons</Term> inside it),
            the two are attracted to one another by the same electromagnetic force we just explored
            with the magnets — holding the electrons in place around the atom.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(200, 255, 212, 0.55)" }}>
            This is where things get exciting. <Term id="electron">Electrons</Term> — specifically those in the outermost
            <Term id="orbital-shell"> orbital shell</Term> — are what <em>do</em> chemistry. When atoms come close to one another,
            it is their outer electrons that interact, overlap, and rearrange to form chemical bonds.
            Every reaction, every molecule, every material you have ever touched is a consequence of
            electrons behaving this way. We will explore bonding in much greater detail in later lessons.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-16 pt-8" style={{ borderTop: "1px solid rgba(0, 255, 65, 0.08)" }}>
          <Link
            href="/courses/chemistry-1/lessons/atoms"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ border: "1px solid rgba(68,153,255,0.3)", color: "#4499ff", letterSpacing: "0.15em" }}
          >
            ← PREV: ATOMS
          </Link>
          <Link
            href="/courses/chemistry-1/lessons/the-periodic-table"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ background: "#4499ff", color: "#010d0a", letterSpacing: "0.15em" }}
          >
            NEXT: THE PERIODIC TABLE →
          </Link>
        </div>
      </div>
    </main>
  );
}
