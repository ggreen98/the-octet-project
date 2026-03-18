import Link from "next/link";
import { DictionaryClient } from "@/components/dictionary/DictionaryClient";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata = {
  title: "Dictionary — Allylic",
  description: "Definitions of key chemistry terms used across Allylic lessons.",
};

export const TERMS = [
  {
    id: "atom",
    term: "Atom",
    category: "Structure",
    definition:
      "The smallest unit of an element that still retains the chemical properties of that element. Atoms consist of a nucleus containing protons and neutrons, surrounded by electrons in orbital shells. Almost all of the atom's mass is concentrated in its nucleus, while most of its volume is empty space.",
    related: ["nucleus", "proton", "neutron", "electron", "element"],
  },
  {
    id: "nucleus",
    term: "Nucleus",
    category: "Structure",
    definition:
      "The dense central core of an atom, made up of protons and neutrons bound tightly together. The nucleus is incredibly small relative to the total size of the atom — if an atom were the size of a stadium, the nucleus would be a marble at its centre. It carries a positive charge due to the protons it contains.",
    related: ["atom", "proton", "neutron", "charge"],
  },
  {
    id: "proton",
    term: "Proton",
    category: "Subatomic Particle",
    definition:
      "A positively charged subatomic particle found in the nucleus of every atom. The number of protons in an atom — its atomic number — uniquely determines which element it is. Change the number of protons and you change the element entirely. Protons have a mass of approximately 1.007 atomic mass units and a radius of about 0.85 femtometres.",
    related: ["nucleus", "neutron", "electron", "charge", "element", "atomic-number"],
  },
  {
    id: "neutron",
    term: "Neutron",
    category: "Subatomic Particle",
    definition:
      "A subatomic particle with no electric charge, found in the nucleus alongside protons. Neutrons contribute to the mass of an atom but not its charge. Atoms of the same element can have different numbers of neutrons — these variants are called isotopes. Neutrons have a mass of approximately 1.008 atomic mass units.",
    related: ["nucleus", "proton", "charge", "isotope"],
  },
  {
    id: "electron",
    term: "Electron",
    category: "Subatomic Particle",
    definition:
      "A negatively charged subatomic particle that occupies orbital shells surrounding an atom's nucleus. Electrons are approximately 1,836 times lighter than a proton and are treated as point particles — they have no measurable size. The arrangement of electrons in an atom's outer shell determines how it bonds with other atoms and drives most chemical behaviour.",
    related: ["nucleus", "proton", "charge", "orbital-shell"],
  },
  {
    id: "charge",
    term: "Charge",
    category: "Property",
    definition:
      "A fundamental property of matter that determines how a particle interacts with others around it. Opposite charges attract; like charges repel. Protons carry a positive charge (+1), electrons carry a negative charge (−1), and neutrons carry no charge. Charge is conserved — it cannot be created or destroyed, only transferred.",
    related: ["proton", "electron", "neutron"],
  },
  {
    id: "element",
    term: "Element",
    category: "Structure",
    definition:
      "A pure substance in which every atom has the same number of protons. There are 118 known elements, each listed on the periodic table. Elements cannot be broken down into simpler substances by chemical means. Carbon (6 protons), oxygen (8 protons), and hydrogen (1 proton) are among the most abundant elements in living things.",
    related: ["atom", "proton", "atomic-number", "periodic-table"],
  },
  {
    id: "subatomic-particle",
    term: "Subatomic Particle",
    category: "Structure",
    definition:
      "Any particle smaller than an atom. The three subatomic particles most relevant to chemistry are the proton, neutron, and electron. More exotic subatomic particles — such as quarks and gluons — make up protons and neutrons themselves, but these are studied in particle physics rather than chemistry.",
    related: ["proton", "neutron", "electron", "atom"],
  },
  {
    id: "orbital-shell",
    term: "Orbital Shell",
    category: "Structure",
    definition:
      "A region surrounding an atom's nucleus in which electrons are found. Shells are labelled K, L, M, N and so on, moving outward from the nucleus. The K-shell can hold up to 2 electrons; the L-shell up to 8. Electrons fill the lowest available shell first. The outermost occupied shell — the valence shell — governs how an atom bonds with others.",
    related: ["electron", "nucleus", "atom"],
  },
  {
    id: "atomic-number",
    term: "Atomic Number",
    category: "Property",
    definition:
      "The number of protons in the nucleus of an atom, denoted by the symbol Z. The atomic number uniquely identifies an element — no two elements share the same atomic number. Carbon has an atomic number of 6; oxygen has 8. In a neutral atom, the atomic number also equals the number of electrons.",
    related: ["proton", "element", "nucleus"],
  },
  {
    id: "atomic-mass-unit",
    term: "Atomic Mass Unit (u)",
    category: "Measurement",
    definition:
      "A unit of mass used to express the mass of atoms and subatomic particles. One atomic mass unit (u) is defined as one twelfth of the mass of a carbon-12 atom, approximately 1.66 × 10⁻²⁷ kg. Protons and neutrons each have a mass of approximately 1 u. Electrons are far lighter at about 0.00055 u.",
    related: ["proton", "neutron", "electron", "atom"],
  },
  {
    id: "femtometre",
    term: "Femtometre (fm)",
    category: "Measurement",
    definition:
      "A unit of length equal to 10⁻¹⁵ metres (one quadrillionth of a metre). Femtometres are used to measure the size of atomic nuclei and subatomic particles. A proton has a radius of about 0.85 fm; the nucleus of a carbon atom is roughly 2–3 fm across. By comparison, a typical atom is about 100,000 fm in diameter.",
    related: ["nucleus", "proton", "neutron", "atom"],
  },
  {
    id: "isotope",
    term: "Isotope",
    category: "Structure",
    definition:
      "A variant of an element whose atoms have the same number of protons but a different number of neutrons. Isotopes of the same element share the same chemical properties but differ in mass. Carbon-12 has 6 neutrons while carbon-14 has 8. Some isotopes are stable; others are radioactive and decay over time.",
    related: ["neutron", "proton", "element", "atom"],
  },
  {
    id: "periodic-table",
    term: "Periodic Table",
    category: "Structure",
    definition:
      "A tabular arrangement of all known chemical elements, ordered by atomic number. Elements in the same column (group) share similar chemical properties because they have the same number of electrons in their outermost shell. The periodic table was first organised by Dmitri Mendeleev in 1869 and remains one of the most powerful tools in chemistry.",
    related: ["element", "atomic-number", "electron", "orbital-shell"],
  },
];

export default function DictionaryPage() {
  return (
    <main
      className="scanlines font-terminal min-h-screen"
      style={{ backgroundColor: "var(--oc-bg)", color: "var(--oc-text)" }}
    >
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14"
        style={{
          background: "var(--oc-nav-bg)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--oc-green-border-dim)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-heading" style={{ color: "var(--oc-green)" }}>⬡</span>
          <span className="font-heading text-sm hidden sm:block" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-xs tracking-widest" style={{ color: "var(--oc-green-dim)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <span style={{ color: "var(--oc-green)" }}>DICTIONARY</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/signup"
            className="font-heading text-xs px-4 py-2"
            style={{ background: "var(--oc-blue)", color: "var(--oc-btn-text)", letterSpacing: "0.15em" }}
          >
            START FREE ▶
          </Link>
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-14 px-6 md:px-12 lg:px-20 py-14 max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <span className="font-heading text-xs px-2 py-0.5" style={{ background: "var(--oc-green-badge)", color: "var(--oc-green)", border: "1px solid var(--oc-green-subtle)", letterSpacing: "0.12em" }}>
            REFERENCE
          </span>
        </div>

        <h1
          className="font-heading leading-none mb-4"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          DICTIONARY
        </h1>
        <p className="text-sm leading-relaxed mb-10 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          Definitions of key terms used across Allylic lessons. Click any term in a lesson to jump straight here.
        </p>

        <DictionaryClient terms={TERMS} />
      </div>
    </main>
  );
}
