import Link from "next/link";
import { DictionaryClient } from "@/components/dictionary/DictionaryClient";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";

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
    id: "energy-level",
    term: "Energy Level",
    category: "Structure",
    definition:
      "A discrete, fixed amount of energy that an electron in an atom can have. Electrons cannot exist between energy levels — they must jump from one to another, absorbing or releasing energy in the process. Energy levels correspond to electron shells: the K shell is the lowest energy level, the L shell is higher, and so on. When an electron absorbs energy it jumps to a higher level (excited state); when it falls back it releases energy, often as visible light.",
    related: ["electron", "orbital-shell", "atom", "quantization"],
  },
  {
    id: "quantization",
    term: "Quantization",
    category: "Concept",
    definition:
      "The principle that certain physical quantities — such as the energy of an electron — can only take on specific, discrete values rather than any value along a continuous range. An electron's energy is quantized: it can exist at energy level 1 or energy level 2, but never at 1.5. This is why electrons jump between shells rather than drifting smoothly. Quantization is a foundational idea in quantum mechanics and explains phenomena like the distinct spectral lines elements emit when heated.",
    related: ["energy-level", "electron", "orbital-shell"],
  },
  {
    id: "valence-electron",
    term: "Valence Electron",
    category: "Structure",
    definition:
      "An electron in the outermost shell of an atom. Valence electrons are the ones that participate in chemical bonding — they are the electrons that atoms share, transfer, or interact with when they react. The number of valence electrons an atom has determines much of its chemical behaviour. Elements in the same group of the periodic table have the same number of valence electrons, which is why they behave similarly.",
    related: ["electron", "orbital-shell", "element", "periodic-table"],
  },
  {
    id: "periodic-table",
    term: "Periodic Table",
    category: "Structure",
    definition:
      "A tabular arrangement of all known chemical elements, ordered by atomic number. Elements in the same column (group) share similar chemical properties because they have the same number of electrons in their outermost shell. The periodic table was first organised by Dmitri Mendeleev in 1869 and remains one of the most powerful tools in chemistry.",
    related: ["element", "atomic-number", "electron", "orbital-shell"],
  },
  {
    id: "valence-shell",
    term: "Valence Shell",
    category: "Structure",
    definition:
      "The outermost occupied electron shell of an atom. The valence shell is where chemical bonding takes place — its electrons are the ones that interact with other atoms. For carbon (2, 4) the valence shell is the L shell; for sodium (2, 8, 1) it is the M shell. A full valence shell, as seen in noble gases, results in a highly stable, unreactive atom.",
    related: ["electron", "orbital-shell", "valence-electron", "noble-gas", "octet-rule"],
  },
  {
    id: "octet-rule",
    term: "Octet Rule",
    category: "Concept",
    definition:
      "The tendency of atoms to gain, lose, or share electrons so as to achieve 8 valence electrons in their outer shell — the same electron count as a noble gas. Atoms with a full outer shell of 8 are exceptionally stable. The octet rule explains why sodium loses 1 electron (to reach 8 in its new outer shell), why chlorine gains 1, and why carbon forms four covalent bonds. Hydrogen and helium are common exceptions, following a duplet rule: they aim for 2 electrons, filling the K shell.",
    related: ["valence-electron", "valence-shell", "noble-gas", "electron", "element"],
  },
  {
    id: "noble-gas",
    term: "Noble Gas",
    category: "Structure",
    definition:
      "Any element in Group 18 of the periodic table: helium, neon, argon, krypton, xenon, and radon. Noble gases have completely full outer electron shells — 8 valence electrons (or 2 for helium) — making them the least reactive elements known. They exist as individual atoms and rarely form compounds under normal conditions. Their electron configuration is the stable target that other atoms try to mimic through bonding.",
    related: ["valence-electron", "valence-shell", "octet-rule", "orbital-shell", "element"],
  },
  {
    id: "halogen",
    term: "Halogen",
    category: "Structure",
    definition:
      "Any element in Group 17 of the periodic table: fluorine, chlorine, bromine, iodine, and astatine. Halogens have 7 valence electrons and need just one more to complete their outer shell, making them extremely reactive non-metals. They readily gain an electron from metals to form negatively charged ions (e.g. Cl⁻) and salts (e.g. NaCl, table salt). The name halogen comes from Greek, meaning 'salt-former'.",
    related: ["valence-electron", "element", "periodic-table", "octet-rule"],
  },
  {
    id: "atomic-radius",
    term: "Atomic Radius",
    category: "Periodic Trends",
    definition:
      "A measure of the size of an atom, typically defined as half the distance between the nuclei of two bonded atoms of the same element (covalent radius). Atomic radius decreases across a period (left to right) because more protons pull the electrons closer to the nucleus, and increases down a group because each new period adds an additional electron shell, pushing the outer electrons further away.",
    related: ["atomic-number", "electron", "effective-nuclear-charge", "electron-shielding", "periodic-table"],
  },
  {
    id: "ionization-energy",
    term: "Ionization Energy",
    category: "Periodic Trends",
    definition:
      "The minimum energy required to remove the outermost electron from a neutral atom in the gas phase, measured in kJ/mol. Higher ionization energy means the electron is held more tightly. It generally increases across a period (stronger nuclear pull) and decreases down a group (outer electrons are farther from the nucleus and more shielded). Noble gases have the highest ionization energies of their periods.",
    related: ["electron", "atomic-number", "effective-nuclear-charge", "electron-shielding", "valence-electron"],
  },
  {
    id: "electronegativity",
    term: "Electronegativity",
    category: "Periodic Trends",
    definition:
      "A measure of how strongly an atom attracts the shared electrons in a chemical bond toward itself, expressed on the dimensionless Pauling scale. Fluorine is the most electronegative element (3.98). Electronegativity increases across a period and decreases down a group — the same general direction as ionization energy. Large differences in electronegativity between two bonded atoms produce polar or ionic bonds.",
    related: ["electron", "atomic-number", "effective-nuclear-charge", "electron-shielding", "valence-electron"],
  },
  {
    id: "effective-nuclear-charge",
    term: "Effective Nuclear Charge (Zeff)",
    category: "Periodic Trends",
    definition:
      "The net positive charge experienced by an electron after accounting for the shielding effect of inner electrons. Zeff = Z − S, where Z is the atomic number and S is the shielding constant. As you move across a period, Z increases while S stays roughly constant, so Zeff rises — this is why atomic radius shrinks and ionization energy grows from left to right across the periodic table.",
    related: ["atomic-number", "electron-shielding", "atomic-radius", "ionization-energy", "electronegativity"],
  },
  {
    id: "electron-shielding",
    term: "Electron Shielding",
    category: "Periodic Trends",
    definition:
      "The reduction in the effective nuclear attraction felt by outer electrons, caused by inner electrons repelling them and partially cancelling the pull of the nucleus. Core electrons (those in inner shells) shield outer electrons much more effectively than electrons in the same shell shield each other. Shielding explains why outer electrons are easier to remove as you go down a group — each new shell adds more shielding.",
    related: ["effective-nuclear-charge", "orbital-shell", "electron", "atomic-radius", "ionization-energy"],
  },
  {
    id: "ion",
    term: "Ion",
    category: "Chemical Bonding",
    definition:
      "An atom (or group of atoms) that has gained or lost one or more electrons, giving it a net electric charge. Losing electrons produces a positively charged ion (cation); gaining electrons produces a negatively charged ion (anion). Ions are the building blocks of ionic compounds and are central to how atoms bond with each other.",
    related: ["electron", "charge", "cation", "anion", "ionic-bond"],
  },
  {
    id: "cation",
    term: "Cation",
    category: "Chemical Bonding",
    definition:
      "A positively charged ion, formed when an atom loses one or more electrons. Metals in Groups 1 and 2 readily form cations because losing a small number of valence electrons gives them a full outer shell. For example, sodium (Na) loses one electron to become Na⁺. The name rhymes with 'cat' — a cation is a cat that lost something.",
    related: ["ion", "anion", "ionic-bond", "valence-electron", "octet-rule"],
  },
  {
    id: "anion",
    term: "Anion",
    category: "Chemical Bonding",
    definition:
      "A negatively charged ion, formed when an atom gains one or more electrons. Non-metals in Groups 16 and 17 readily form anions because gaining a small number of electrons completes their outer shell. For example, chlorine (Cl) gains one electron to become Cl⁻. Anions are attracted to cations and repelled by other anions.",
    related: ["ion", "cation", "ionic-bond", "valence-electron", "octet-rule"],
  },
  {
    id: "ionic-bond",
    term: "Ionic Bond",
    category: "Chemical Bonding",
    definition:
      "A chemical bond formed by the electrostatic attraction between oppositely charged ions. One atom transfers one or more electrons to another — the donor becomes a cation (positive) and the recipient becomes an anion (negative). Because opposite charges attract, the two ions are held together. Ionic bonds typically form between a metal and a non-metal. Table salt (NaCl) is the classic example: sodium gives its valence electron to chlorine, and the resulting Na⁺ and Cl⁻ ions attract each other strongly.",
    related: ["ion", "cation", "anion", "valence-electron", "octet-rule", "electronegativity"],
  },
  {
    id: "polarity",
    term: "Polarity",
    category: "Chemical Bonding",
    definition:
      "The unequal distribution of electric charge in a chemical bond or molecule, arising when one atom attracts shared electrons more strongly than the other. A polar bond has a partially negative end (δ⁻) and a partially positive end (δ⁺). The greater the difference in electronegativity between the bonded atoms, the more polar the bond. Polarity is quantified by the dipole moment — the larger the dipole moment, the more polar the bond. Polarity determines many physical and chemical properties: polar molecules tend to have higher boiling points, dissolve ionic compounds, and interact strongly with other polar molecules through intermolecular forces.",
    related: ["polar-covalent-bond", "nonpolar-covalent-bond", "dipole-moment", "electronegativity"],
  },
  {
    id: "dipole-moment",
    term: "Dipole Moment",
    category: "Chemical Bonding",
    definition:
      "A measurement of the polarity of a chemical bond or molecule, symbolized μ (mu). Formally defined as the product of the magnitude of the partial charge and the distance separating the positive and negative charge centers. Measured in debyes (D). A nonpolar bond has μ = 0 D; the larger the dipole moment, the more polar the bond. Examples from hydrogen halides: H–F has μ = 1.86 D (most polar, largest ΔEN), H–Cl has μ = 1.08 D, H–Br has μ = 0.82 D. The dipole moment vector points from the δ⁺ end toward the δ⁻ end. For whole molecules, the net dipole moment is the vector sum of all individual bond dipoles — which is why CO₂ (two equal, opposing C=O dipoles) has μ = 0 D overall despite having polar bonds.",
    related: ["polarity", "polar-covalent-bond", "electronegativity"],
  },
  {
    id: "covalent-bond",
    term: "Covalent Bond",
    category: "Chemical Bonding",
    definition:
      "A chemical bond formed when two atoms share one or more pairs of electrons. Rather than one atom transferring electrons to another (as in ionic bonding), both atoms simultaneously claim the shared electrons — the shared pair is attracted to both nuclei at once, holding the atoms together. Covalent bonds typically form between two non-metal atoms with similar electronegativities. Examples include H₂ (hydrogen gas), H₂O (water), and CO₂ (carbon dioxide).",
    related: ["ionic-bond", "polar-covalent-bond", "nonpolar-covalent-bond", "bond-pair", "lone-pair", "electronegativity", "octet-rule", "molecular-compound"],
  },
  {
    id: "polar-covalent-bond",
    term: "Polar Covalent Bond",
    category: "Chemical Bonding",
    definition:
      "A covalent bond in which the shared electrons are not distributed equally between the two atoms. When the bonded atoms have different electronegativities, the more electronegative atom pulls the shared electron pair closer to itself. This creates a partial negative charge (δ⁻) on the more electronegative atom and a partial positive charge (δ⁺) on the other. The greater the electronegativity difference (roughly 0.5–1.7 on the Pauling scale), the more polar the bond. H–Cl and H–F are classic examples.",
    related: ["covalent-bond", "nonpolar-covalent-bond", "electronegativity", "ionic-bond"],
  },
  {
    id: "nonpolar-covalent-bond",
    term: "Nonpolar Covalent Bond",
    category: "Chemical Bonding",
    definition:
      "A covalent bond in which the shared electrons are distributed equally between both atoms, with no net charge separation. This occurs when the two bonded atoms are identical (such as H₂ or O₂) or have very similar electronegativities (electronegativity difference < 0.5). Neither atom pulls the shared pair more strongly than the other, so no partial charges develop.",
    related: ["covalent-bond", "polar-covalent-bond", "electronegativity"],
  },
  {
    id: "lewis-structure",
    term: "Lewis Structure",
    category: "Chemical Bonding",
    definition:
      "A diagram that shows the arrangement of valence electrons in a molecule or ion. Named after Gilbert N. Lewis (1916), a Lewis structure uses element symbols for atoms, lines (or pairs of dots) between atoms for bond pairs, and pairs of dots on atoms for lone pairs. The goal is to place electrons so that every atom (except hydrogen, which takes 2) satisfies the octet rule — 8 electrons in its outer shell. Lewis structures are the foundation for predicting molecular geometry, polarity, and reactivity.",
    related: ["bond-pair", "lone-pair", "octet-rule", "covalent-bond", "valence-electron"],
  },
  {
    id: "bond-pair",
    term: "Bond Pair",
    category: "Chemical Bonding",
    definition:
      "A pair of electrons that is shared between two atoms in a covalent bond. In a Lewis dot structure, a bond pair is shown as a line (—) or as two dots between the atoms. A single bond has one bond pair; a double bond has two; a triple bond has three. Bond pairs count toward the octet of both atoms simultaneously — each atom in the bond 'claims' both electrons of the pair.",
    related: ["covalent-bond", "lone-pair", "octet-rule"],
  },
  {
    id: "lone-pair",
    term: "Lone Pair",
    category: "Chemical Bonding",
    definition:
      "A pair of valence electrons on an atom that is not involved in any bond — they belong exclusively to one atom. In a Lewis dot structure, lone pairs are shown as two dots side by side on the atom. Lone pairs count toward an atom's electron count and influence molecular geometry, but they do not contribute to bonding between atoms. Chlorine in HCl, for example, has 3 lone pairs alongside its 1 bond pair.",
    related: ["bond-pair", "covalent-bond", "valence-electron", "octet-rule"],
  },
  {
    id: "molecular-compound",
    term: "Molecular Compound",
    category: "Chemical Bonding",
    definition:
      "A compound formed by covalent bonding between non-metal atoms. Unlike ionic compounds, molecular compounds do not form an extended lattice of ions — they exist as discrete molecules with a fixed number of atoms. Molecular compounds generally have lower melting and boiling points than ionic compounds, do not conduct electricity in solution (most are not charged), and are often gases or liquids at room temperature. Water (H₂O), carbon dioxide (CO₂), and glucose (C₆H₁₂O₆) are all molecular compounds.",
    related: ["covalent-bond", "ionic-bond", "diatomic"],
  },
  {
    id: "diatomic",
    term: "Diatomic Molecule",
    category: "Chemical Bonding",
    definition:
      "A molecule made of exactly two atoms, which may be the same element or different elements. The seven diatomic elements — hydrogen (H₂), nitrogen (N₂), oxygen (O₂), fluorine (F₂), chlorine (Cl₂), bromine (Br₂), and iodine (I₂) — exist naturally as diatomic molecules rather than single atoms. Diatomic molecules of the same element (homonuclear) always form nonpolar covalent bonds. Heteronuclear diatomics like HCl or CO form polar covalent bonds.",
    related: ["covalent-bond", "nonpolar-covalent-bond", "polar-covalent-bond", "molecular-compound"],
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

        <div className="hidden md:flex items-center gap-8 tracking-widest" style={{ fontSize: "1rem" }}>
          {[["COURSES", "/courses"], ["PERIODIC TABLE", "/periodic-table"], ["DICTIONARY", "/dictionary"], ["UNITS", "/si-units"], ["ORBITAL VIEWER", "/orbital-viewer"], ["MINI GAMES", "/mini-games"], ["ABOUT", "/who-we-are"]].map(([label, href]) => (
            <Link key={label} href={href} className="transition-colors duration-200 hover:text-white"
              style={{ color: label === "DICTIONARY" ? "var(--oc-green)" : "var(--oc-text-dim)" }}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <MobileNav activeLabel="DICTIONARY" />
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-14 max-w-4xl mx-auto">

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
