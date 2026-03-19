import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SIUnitsClient, type SIUnit, type SIPrefix } from "@/components/si-units/SIUnitsClient";

export const metadata = {
  title: "SI Units — Allylic",
  description: "Reference for SI base units, derived units, and prefixes used across Allylic chemistry lessons.",
};

export const UNITS: SIUnit[] = [
  // ── Base Units ────────────────────────────────────────────────────────────
  {
    id: "metre",
    name: "Metre",
    symbol: "m",
    category: "Base Unit",
    definition:
      "The SI base unit of length. Defined since 2019 as the distance light travels in a vacuum in exactly 1/299,792,458 of a second. In chemistry, the metre is the reference from which all length-based scales — from nanometres to femtometres — are derived.",
  },
  {
    id: "kilogram",
    name: "Kilogram",
    symbol: "kg",
    category: "Base Unit",
    definition:
      "The SI base unit of mass. Defined since 2019 in terms of the Planck constant (h = 6.62607015 × 10⁻³⁴ J·s). One kilogram is roughly the mass of one litre of water. At the atomic scale, masses are too small to express conveniently in kilograms, so the atomic mass unit (u) is used instead.",
  },
  {
    id: "second",
    name: "Second",
    symbol: "s",
    category: "Base Unit",
    definition:
      "The SI base unit of time. Defined as exactly 9,192,631,770 periods of the radiation corresponding to the transition between the two hyperfine levels of the ground state of the caesium-133 atom. Reaction rates, half-lives, and spectroscopic frequencies are all measured in seconds or derived units thereof.",
  },
  {
    id: "kelvin",
    name: "Kelvin",
    symbol: "K",
    category: "Base Unit",
    definition:
      "The SI base unit of thermodynamic temperature. Defined in terms of the Boltzmann constant (k = 1.380649 × 10⁻²³ J/K). The Kelvin scale starts at absolute zero — the point at which all thermal motion ceases — and uses the same degree size as Celsius. 0 °C = 273.15 K. Gas laws and thermodynamic equations require temperatures in kelvin.",
  },
  {
    id: "mole",
    name: "Mole",
    symbol: "mol",
    category: "Base Unit",
    definition:
      "The SI base unit of amount of substance. Defined as exactly 6.02214076 × 10²³ elementary entities (Avogadro's number, Nₐ). One mole of any substance contains the same number of particles — atoms, molecules, or ions — as one mole of any other substance. The mole is the bridge between the atomic scale and laboratory-scale quantities.",
  },
  {
    id: "ampere",
    name: "Ampere",
    symbol: "A",
    category: "Base Unit",
    definition:
      "The SI base unit of electric current. Defined in terms of the elementary charge (e = 1.602176634 × 10⁻¹⁹ C). In chemistry, the ampere is most relevant in electrochemistry — the study of chemical reactions driven by or producing electric current.",
  },
  // ── Derived Units ─────────────────────────────────────────────────────────
  {
    id: "joule",
    name: "Joule",
    symbol: "J",
    category: "Derived Unit",
    definition:
      "The SI derived unit of energy, work, and heat. Equal to the energy transferred when a force of one newton acts through one metre. In chemistry, joules measure bond energies, reaction enthalpies, and ionisation energies. Larger quantities are expressed in kilojoules (kJ).",
    equivalent: "1 J = 1 kg·m²·s⁻²",
  },
  {
    id: "pascal",
    name: "Pascal",
    symbol: "Pa",
    category: "Derived Unit",
    definition:
      "The SI derived unit of pressure. Equal to one newton per square metre. Atmospheric pressure at sea level is approximately 101,325 Pa (1 atm). Gas laws use pressure in pascals or kilopascals (kPa). Other common pressure units in chemistry include atmospheres (atm) and bar.",
    equivalent: "1 Pa = 1 N/m² = 1 kg·m⁻¹·s⁻²",
  },
  {
    id: "coulomb",
    name: "Coulomb",
    symbol: "C",
    category: "Derived Unit",
    definition:
      "The SI derived unit of electric charge. One coulomb is the charge carried by approximately 6.242 × 10¹⁸ elementary charges. The elementary charge — the charge of one proton or one electron — is e = 1.602176634 × 10⁻¹⁹ C. Coulombs appear in Coulomb's law, which describes the force between charged particles.",
    equivalent: "1 C = 1 A·s",
  },
  // ── Non-SI Accepted Units ─────────────────────────────────────────────────
  {
    id: "atomic-mass-unit",
    name: "Atomic Mass Unit",
    symbol: "u",
    category: "Accepted Unit",
    definition:
      "A unit of mass defined as one twelfth of the mass of a carbon-12 atom at rest. Used universally to express the masses of atoms and subatomic particles. Protons and neutrons each have a mass of approximately 1 u; electrons are far lighter at about 0.00055 u. Also written as Da (dalton) in biochemistry.",
    equivalent: "1 u = 1.66053906660 × 10⁻²⁷ kg",
  },
  {
    id: "femtometre",
    name: "Femtometre",
    symbol: "fm",
    category: "Accepted Unit",
    definition:
      "One quadrillionth of a metre (10⁻¹⁵ m). The natural scale for measuring atomic nuclei and subatomic particles. A proton has a radius of approximately 0.85 fm; a carbon nucleus is roughly 2–3 fm across. Also known as a fermi, after physicist Enrico Fermi.",
    equivalent: "1 fm = 10⁻¹⁵ m",
  },
  {
    id: "nanometre",
    name: "Nanometre",
    symbol: "nm",
    category: "Accepted Unit",
    definition:
      "One billionth of a metre (10⁻⁹ m). The natural scale for atoms and small molecules — a typical atom is 0.1–0.5 nm in diameter; a water molecule is about 0.28 nm across. Visible light has wavelengths of roughly 400–700 nm. Bond lengths in molecules are typically measured in nanometres or ångströms.",
    equivalent: "1 nm = 10⁻⁹ m",
  },
  {
    id: "angstrom",
    name: "Ångström",
    symbol: "Å",
    category: "Accepted Unit",
    definition:
      "A unit of length equal to 10⁻¹⁰ m (0.1 nm). Historically used to express atomic radii, bond lengths, and crystal lattice spacings. A carbon–carbon single bond is approximately 1.54 Å. While not an SI unit, the ångström is widely encountered in crystallography and molecular chemistry.",
    equivalent: "1 Å = 10⁻¹⁰ m = 0.1 nm",
  },
  {
    id: "litre",
    name: "Litre",
    symbol: "L",
    category: "Accepted Unit",
    definition:
      "A unit of volume equal to one cubic decimetre (10⁻³ m³). The litre is the standard volume unit in chemistry for measuring solutions and gases. Concentrations are typically expressed in moles per litre (mol/L, also written as M or molar). Millilitres (mL) are used for smaller volumes.",
    equivalent: "1 L = 10⁻³ m³ = 1 dm³",
  },
];

export const PREFIXES: SIPrefix[] = [
  { prefix: "femto",  symbol: "f",  factor: "10⁻¹⁵", example: "femtometre (fm)" },
  { prefix: "pico",   symbol: "p",  factor: "10⁻¹²", example: "picometre (pm)" },
  { prefix: "nano",   symbol: "n",  factor: "10⁻⁹",  example: "nanometre (nm)" },
  { prefix: "micro",  symbol: "μ",  factor: "10⁻⁶",  example: "micrometre (μm)" },
  { prefix: "milli",  symbol: "m",  factor: "10⁻³",  example: "millimetre (mm)" },
  { prefix: "centi",  symbol: "c",  factor: "10⁻²",  example: "centimetre (cm)" },
  { prefix: "deci",   symbol: "d",  factor: "10⁻¹",  example: "decimetre (dm)" },
  { prefix: "kilo",   symbol: "k",  factor: "10³",   example: "kilometre (km)" },
  { prefix: "mega",   symbol: "M",  factor: "10⁶",   example: "megapascal (MPa)" },
  { prefix: "giga",   symbol: "G",  factor: "10⁹",   example: "gigahertz (GHz)" },
];

export default function SIUnitsPage() {
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
          <span className="font-heading hidden sm:block" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 tracking-widest" style={{ fontSize: "1rem" }}>
          {[
            ["COURSES",        "/courses"],
            ["PERIODIC TABLE", "/periodic-table"],
            ["DICTIONARY",     "/dictionary"],
            ["UNITS",          "/si-units"],
            ["MINI GAMES",     "/mini-games"],
            ["ABOUT",          "/who-we-are"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="transition-colors duration-200 hover:text-white"
              style={{ color: label === "UNITS" ? "var(--oc-green)" : "var(--oc-text-dim)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-14 max-w-4xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <span
            className="font-heading text-xs px-2 py-0.5"
            style={{
              background: "rgba(212,147,62,0.08)",
              color: "#d4933e",
              border: "1px solid rgba(212,147,62,0.25)",
              letterSpacing: "0.12em",
            }}
          >
            REFERENCE
          </span>
        </div>

        <h1
          className="font-heading leading-none mb-4"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          SI UNITS
        </h1>
        <p className="text-sm leading-relaxed mb-10 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          The International System of Units (SI) is the globally agreed standard for scientific measurement.
          This page covers the base units, derived units, and accepted non-SI units used across Allylic lessons,
          along with the standard prefixes for scaling them.
        </p>

        <SIUnitsClient units={UNITS} prefixes={PREFIXES} />
      </div>
    </main>
  );
}
