import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { ElectronShellDiagram } from "@/components/lessons/ElectronShellDiagram";
import { Term } from "@/components/ui/Term";

export const metadata = {
  title: "Electron Shells — Chemistry I | Allylic",
  description: "Electrons don't float randomly around the nucleus — they occupy specific energy levels called shells. Learn the rules that govern where electrons live.",
};

export default function ElectronShellsLesson() {
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

        <div className="hidden md:flex items-center gap-2 tracking-widest" style={{ fontSize: "0.85rem", color: "var(--oc-green-dim)" }}>
          <Link href="/courses" className="hover:text-green-400 transition-colors">COURSES</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <Link href="/courses/chemistry-1" className="hover:text-green-400 transition-colors">CHEMISTRY I</Link>
          <span style={{ color: "var(--oc-green-subtle)" }}>›</span>
          <span style={{ color: "var(--oc-green)" }}>ELECTRON SHELLS</span>
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
            LESSON 2.1
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
          ELECTRON SHELLS
        </h1>
        <p className="text-base leading-relaxed mb-12 max-w-2xl" style={{ color: "var(--oc-text-muted)" }}>
          In lesson 1.2 we established that <Term id="electron">electrons</Term> orbit the <Term id="nucleus">nucleus</Term>.
          But that description leaves out something crucial: <em>where</em> exactly do they orbit?
          It turns out electrons don&apos;t simply float anywhere they like. Their positions are
          governed by energy, and the rules they follow are what make chemistry possible.
        </p>

        {/* ── ENERGY LEVELS ───────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          ENERGY LEVELS
        </h2>
        <div className="max-w-2xl mb-12">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Imagine a ladder. You can stand on rung 1, rung 2, or rung 3 — but never on rung 1.5.
            <Term id="electron">Electrons</Term> work the same way. They exist at specific, fixed{" "}
            <Term id="energy-level">energy levels</Term> around the nucleus. They cannot be
            between levels — they must be on a rung. This property, that energy comes only in
            discrete, allowed values rather than a continuous spectrum, is called{" "}
            <Term id="quantization">quantization</Term>.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            These energy levels are called <Term id="orbital-shell">electron shells</Term>. They are
            labelled K, L, M, N, and so on, moving outward from the nucleus. The K shell is the
            closest — and the lowest energy. The L shell is next, then M, then N.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Lower shells are lower energy, and — just like a ball rolling to the bottom of a hill —
            electrons prefer to be in the lowest energy state available to them.
          </p>
        </div>

        {/* ── SHELL CAPACITY ──────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          SHELL CAPACITY
        </h2>
        <div className="max-w-2xl mb-10">
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Each shell can only hold a certain number of <Term id="electron">electrons</Term>.
            Think of it like seats in a row at a theatre — each row has a fixed number of seats,
            and once a row is full, the next person has to move to the row behind. Electrons fill
            from the innermost shell outward, only starting a new shell when the previous one is full.
          </p>

          {/* Shell capacity table */}
          <div
            className="mb-6"
            style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden", maxWidth: "380px" }}
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
              <span>SHELL</span>
              <span>LABEL</span>
              <span>MAX ELECTRONS</span>
            </div>
            {[
              ["1st", "K", "2"],
              ["2nd", "L", "8"],
              ["3rd", "M", "8 (for first 18 elements)"],
              ["4th", "N", "18 (starts to fill after Ar)"],
            ].map(([num, label, cap], i) => (
              <div
                key={label}
                className="grid text-sm px-4 py-2.5"
                style={{
                  gridTemplateColumns: "1fr 1fr 2fr",
                  color: "var(--oc-text-muted)",
                  borderBottom: i < 3 ? "1px solid var(--oc-green-border-faint)" : "none",
                  background: i % 2 === 0 ? "var(--oc-green-bg-surface)" : "transparent",
                }}
              >
                <span style={{ color: "var(--oc-text-dim)" }}>{num}</span>
                <span style={{ color: "var(--oc-green-dim)" }}>{label}</span>
                <span>{cap}</span>
              </div>
            ))}
          </div>

          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Use the diagram below to see exactly how this plays out for the first 20 elements.
            Step through them one by one and watch the shells fill.
          </p>
        </div>

        {/* ── INTERACTIVE ─────────────────────────────────── */}
        <ElectronShellDiagram />

        {/* ── OBSERVATIONS ────────────────────────────────── */}
        <div className="max-w-2xl mb-12">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            A few things to notice as you step through the elements:
          </p>
          <ul className="flex flex-col gap-3 mb-6" style={{ paddingLeft: "1.2rem" }}>
            {[
              <>Hydrogen (Z=1) has just one electron, alone in the K shell.</>,
              <>Helium (Z=2) fills the K shell completely with 2 electrons. Its first and only shell is full.</>,
              <>Lithium (Z=3) can&apos;t fit its third electron in the K shell — so it starts a brand new L shell.</>,
              <>Neon (Z=10) has a completely full K shell (2) and a completely full L shell (8) — 2 + 8 = 10.</>,
              <>Sodium (Z=11) must start a third shell, the M shell, for its 11th electron.</>,
            ].map((text, i) => (
              <li key={i} className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)", listStyleType: "disc" }}>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* ── VALENCE ELECTRONS ───────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          VALENCE ELECTRONS
        </h2>
        <div className="max-w-2xl mb-12">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Not all <Term id="electron">electrons</Term> in an atom are equal. We call electrons in
            the outermost shell of an atom (closest to the outside world){" "}
            <Term id="valence-electron">valence electrons</Term>. As shown above, which shell is the
            outermost changes depending on the <Term id="element">element</Term>. In hydrogen the
            valence electron sits in the K shell, whereas in carbon the valence electrons sit in
            the L shell.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Sodium (Z=11), for example, has the configuration 2, 8, 1 — two electrons in the K shell,
            eight in the L shell, and one lone electron in the M shell. That single outermost electron
            is sodium&apos;s valence electron, and it is almost entirely responsible for how sodium
            behaves chemically.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            One of the most useful patterns in the <Term id="periodic-table">periodic table</Term> is
            that <Term id="element">elements</Term> in the same column share the same number of{" "}
            <Term id="valence-electron">valence electrons</Term>. That is why they behave so similarly
            — lithium, sodium, and potassium are all in Group 1, all have one valence electron, and
            all react in strikingly similar ways.
          </p>
        </div>

        {/* ── NOBLE GASES ─────────────────────────────────── */}
        <h2
          className="font-heading mb-6"
          style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", letterSpacing: "0.05em", color: "var(--oc-text)" }}
        >
          THE NOBLE GASES
        </h2>
        <div className="max-w-2xl mb-12">
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            Pay special attention to helium (Z=2), neon (Z=10), and argon (Z=18). All three have
            something in common: their outermost <Term id="orbital-shell">shell</Term> is completely full.
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ color: "var(--oc-text-muted)" }}>
            A full outer shell is an exceptionally stable configuration. <Term id="element">Elements</Term> in
            this state have almost no tendency to react with other atoms — they have no electron
            vacancies to fill and nothing to gain from bonding. These elements are called the
            <strong style={{ color: "var(--oc-text)" }}> noble gases</strong>, since they are above
            the squabbles of ordinary reactive elements. They sit in the rightmost column of the{" "}
            <Term id="periodic-table">periodic table</Term>.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            If you have ever seen a glowing neon sign or a helium balloon that doesn&apos;t catch fire,
            you are witnessing the stability of a full outer shell. This pattern — the way electrons
            fill shells and create stable full-shell configurations — is one of the deepest organising
            principles in all of chemistry. Almost every reaction you will ever study can be traced
            back to atoms trying, in one way or another, to achieve a full outer shell.
          </p>
        </div>

        {/* ── NEXT LESSON TEASER ──────────────────────────── */}
        <div
          className="max-w-2xl mb-16 p-6"
          style={{
            border: "1px solid var(--oc-green-border-dim)",
            background: "var(--oc-green-bg-surface)",
            borderRadius: "4px",
          }}
        >
          <p className="font-heading text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            UP NEXT
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            The outermost <Term id="orbital-shell">shell</Term> of an atom — called the{" "}
            <strong style={{ color: "var(--oc-text)" }}>valence shell</strong> — is where all the
            chemistry happens. The electrons in it are the ones that reach out and interact with
            other atoms. In lesson 2.2 we will look at valence electrons in depth: how many each
            element has, why it&apos;s predictable from the <Term id="periodic-table">periodic table</Term>,
            and why it determines almost everything about how an <Term id="element">element</Term> behaves.
          </p>
        </div>

        {/* ── NAVIGATION ──────────────────────────────────── */}
        <div className="flex justify-between items-center mt-4 pt-8" style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <Link
            href="/courses/chemistry-1/lessons/the-periodic-table"
            className="font-heading text-xs px-6 py-3 transition-all duration-200"
            style={{ border: "1px solid rgba(68,153,255,0.3)", color: "var(--oc-blue)", letterSpacing: "0.15em" }}
          >
            ← PREV: THE PERIODIC TABLE
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
