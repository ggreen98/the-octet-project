import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const metadata = {
  title: "Who We Are — Allylic",
  description: "Our mission and ethics statement.",
};

export default function WhoWeArePage() {
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
          <span className="text-xl font-heading" style={{ color: "var(--oc-green)" }}>⬡</span>
          <span className="font-heading text-sm hidden sm:block" style={{ color: "var(--oc-text)", letterSpacing: "0.2em" }}>
            ALLYLIC
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 tracking-widest" style={{ fontSize: "1rem" }}>
          {[
            ["COURSES",        "/courses"],
            ["PERIODIC TABLE", "/periodic-table"],
            ["DICTIONARY",     "/dictionary"],
            ["UNITS",          "/si-units"],
            ["WHO WE ARE",     "/who-we-are"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="transition-colors duration-200 hover:text-white"
              style={{ color: label === "WHO WE ARE" ? "var(--oc-green)" : "var(--oc-text-dim)" }}
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
      <div className="pt-16 px-6 md:px-12 lg:px-20 py-20 max-w-2xl mx-auto">

        {/* Eyebrow */}
        <p className="text-xs tracking-widest mb-8" style={{ color: "var(--oc-green-dim)" }}>
          // WHO WE ARE
        </p>

        {/* Mission */}
        <h1
          className="font-heading leading-none mb-8"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          MISSION STATEMENT
        </h1>
        <div className="mb-16" style={{ borderLeft: "2px solid var(--oc-green-border-dim)", paddingLeft: "1.5rem" }}>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Hi there, thanks for checking out Allylic!
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            This project is being built by me, a solo developer with an undergraduate background in
            chemistry and a master&apos;s degree in data science. I hold a deep-seated passion for learning,
            education, technology, and yes, chemistry of course! To many, chemistry is an intimidating
            subject filled with logical traps and challenging three-dimensional thinking. I believe it
            can be something else entirely: an intuitive source of wonder, modern-day potions, for the
            logical and creative thinker alike.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            My goal is to share that curiosity by building a modern, hands-on way to learn chemistry
            that goes beyond memorization and helps students develop a true chemical intuition.
            Accessibility is important to me as I believe anyone and everyone should have the opportunity
            to learn chemistry. As such, at least for the moment, everything is free and I aim to keep
            it this way as long as I can!
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            This is a part-time passion project, so updates come when they come. Any and all feedback
            is welcome and genuinely appreciated, feel free to reach out at{" "}
            <a
              href="mailto:allylic.chem@gmail.com"
              style={{ color: "var(--oc-blue)", borderBottom: "1px dotted rgba(68,153,255,0.5)", textDecoration: "none" }}
            >
              allylic.chem@gmail.com
            </a>
            . Cheers!
          </p>
        </div>

        {/* Ethics */}
        <h2
          className="font-heading leading-none mb-8"
          style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
        >
          ETHICS STATEMENT
        </h2>
        <div style={{ borderLeft: "2px solid var(--oc-green-border-dim)", paddingLeft: "1.5rem" }}>

          {/* Accessibility */}
          <h3
            className="font-heading mb-4"
            style={{ fontSize: "1rem", letterSpacing: "0.1em", color: "var(--oc-text)" }}
          >
            ACCESSIBILITY
          </h3>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Knowledge belongs to everyone, and I don&apos;t want to hide access behind a paywall. Your
            ability and aptitude for learning should not be limited by what you can afford, knowledge
            is better when it&apos;s shared.
          </p>
          <p className="text-base leading-relaxed mb-12" style={{ color: "var(--oc-text-muted)" }}>
            That said, I am a solo developer funding this project with my time, money, blood, sweat,
            and tears. If the cost of keeping the servers running grows beyond what I can sustain on
            my own, I may eventually need to pass some of that cost on to users. What I can commit
            to is this: I will always find a way to make Allylic free for those who cannot afford it,
            regardless of what happens.
          </p>

          {/* AI Transparency */}
          <h3
            className="font-heading mb-4"
            style={{ fontSize: "1rem", letterSpacing: "0.1em", color: "var(--oc-text)" }}
          >
            AI TRANSPARENCY
          </h3>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            AI tools, specifically Claude and Gemini, were used in the making of this website. As a
            solo developer who works a day job, these tools made building Allylic possible in the
            first place. I want to be upfront about that.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Using AI, while practical, comes with real ethical trade-offs that I think are worth
            naming honestly.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            Large language models require enormous amounts of energy to train, which has genuine
            environmental consequences, raising energy prices for communities and in some cases
            running on dirty power sources that harm air quality and health. An estimated third of
            all new energy generation is expected to be used by large data centres, in part for
            training AI. Beyond the environmental cost, these models were trained on vast amounts
            of public data: photos posted to Instagram, answers written on Stack Overflow, posts
            on Reddit, and countless other places where people shared their work and ideas openly.
            When most people posted that content, they almost certainly did not expect it to become
            training data for a machine that might one day replace them. I know I didn&apos;t. Many
            would not have consented had they been asked. As a result, knowledge and creative work
            that belonged to all of us has been quietly repackaged, decontextualised, and made private.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
            I chose to use these tools to build something I otherwise could not have built alone. I
            want to be transparent about that choice. If Allylic ever becomes a business, I intend
            to pay people to replace the parts that AI built where possible. And if knowing that AI
            was involved in this project is a dealbreaker for you, I completely understand.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--oc-text-muted)" }}>
            Thank you for taking the time to read this ethics statement, you baller you!
          </p>

        </div>

      </div>
    </main>
  );
}
