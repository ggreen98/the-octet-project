import Link from "next/link";
import { OrbitalCanvas } from "@/components/molecules/OrbitalCanvas";
import { HexDotGrid } from "@/components/ui/HexDotGrid";
import { NavTitle } from "@/components/ui/NavTitle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <main
      className="scanlines font-terminal min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "var(--oc-bg)", color: "var(--oc-text)" }}
    >
      {/* Hex dot grid background */}
      <HexDotGrid />

      {/* Boot scan line */}
      <div className="boot-scan" />

      {/* ── Page content (sits above canvas z:0) ────────── */}
      <div className="relative" style={{ zIndex: 2 }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 md:px-12 h-16"
        style={{
          background: "var(--oc-nav-bg)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: "1px solid var(--oc-green-border-dim)",
          boxShadow: "inset 0 1px 0 rgba(180,210,255,0.1)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <NavTitle />
        </Link>

        <div className="hidden md:flex items-center gap-8 tracking-widest absolute left-1/2 -translate-x-1/2" style={{ fontSize: "1rem" }}>
          {[
            { label: "COURSES",        href: "/courses" },
            { label: "PERIODIC TABLE", href: "/periodic-table" },
            { label: "DICTIONARY",     href: "/dictionary" },
            { label: "UNITS",          href: "/si-units" },
            { label: "MINI GAMES",     href: "/mini-games" },
            { label: "ABOUT",          href: "/who-we-are" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="transition-colors duration-200 hover:text-white"
              style={{ color: "var(--oc-text-sub)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col lg:flex-row pt-14">
        {/* Left: Text */}
        <div className="flex flex-col justify-center px-6 md:px-16 lg:px-24 py-20 lg:py-0 lg:w-[55%] z-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-8 animate-fade-up flicker-amber-1" style={{ animationFillMode: "both" }}>
            <span style={{ color: "var(--oc-green)", fontSize: "1rem" }}>⬡</span>
            <span
              className="tracking-widest"
              style={{ color: "var(--oc-green)", fontSize: "0.85rem" }}
            >
              CHEMISTRY EDUCATION, REIMAGINED
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading leading-none mb-8 animate-flicker"
            style={{ fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)", letterSpacing: "-0.02em", color: "var(--oc-text)" }}
          >
            <span className="block animate-fade-up anim-d2" style={{ animationFillMode: "both" }}>THE</span>
            <span className="block animate-fade-up anim-d3" style={{ animationFillMode: "both" }}>CHEMICAL</span>
            <span className="block glow-blue animate-fade-up anim-d4" style={{ color: "var(--oc-blue)", animationFillMode: "both" }}>WORLD,</span>
            <span className="block animate-fade-up anim-d5" style={{ animationFillMode: "both" }}>DECODED.</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-sm md:text-base leading-relaxed mb-10 max-w-md animate-fade-up anim-d5 flicker-amber-2"
            style={{ color: "var(--oc-green)", animationFillMode: "both" }}
          >
            Interactive 3D molecular visualization and guided chemistry lessons.
            See what textbooks can&apos;t show you — from electron orbitals to
            organic reactions.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-up anim-d6" style={{ animationFillMode: "both" }}>
            <Link
              href="/signup"
              className="font-heading text-xs px-7 py-3.5 transition-all duration-200 animate-pulse-glow-amber"
              style={{ background: "var(--oc-blue)", color: "var(--oc-btn-text)", letterSpacing: "0.15em" }}
            >
              SIGN UP →
            </Link>
            <Link
              href="/courses"
              className="font-heading text-xs px-7 py-3.5 transition-all duration-200"
              style={{ border: "1px solid rgba(68, 153, 255, 0.35)", color: "var(--oc-blue)", background: "transparent", letterSpacing: "0.15em" }}
            >
              EXPLORE COURSES
            </Link>
          </div>

        </div>

        {/* Right: 3D Orbital */}
        <div className="lg:w-[45%] lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] h-[55vw] min-h-[300px] relative flex flex-col">
          <div className="flex-1 relative">
            <OrbitalCanvas />
          </div>

          {/* Caption */}
          <div
            className="text-center tracking-widest pb-4 lg:pb-6"
            style={{ color: "var(--oc-text-dim)", fontSize: "0.85rem", marginTop: "-6rem" }}
          >
            <span className="animate-blink" style={{ color: "var(--oc-green-dim)" }}>■</span>
            {" "}DRAG TO ROTATE{" "}
            <span className="animate-blink" style={{ color: "var(--oc-green-dim)", animationDelay: "0.5s" }}>■</span>
          </div>
        </div>
      </section>


      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer
        className="px-6 md:px-16 lg:px-24 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
        style={{ borderTop: "1px solid var(--oc-green-border-faint)", color: "var(--oc-text-faint)" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--oc-green)" }}>⬡</span>
          <span className="font-heading tracking-widest" style={{ letterSpacing: "0.15em" }}>
            ALLYLIC
          </span>
        </div>
        <div className="flex items-center gap-3" style={{ color: "var(--oc-text-hint)" }}>
          <span>CHEMISTRY</span>
          <span style={{ color: "var(--oc-text-faint)" }}>·</span>
          <span>EDUCATION</span>
          <span style={{ color: "var(--oc-text-faint)" }}>·</span>
          <span>3D</span>
        </div>
        <div>© {new Date().getFullYear()} ALLYLIC</div>
      </footer>

      </div>{/* end page content wrapper */}
    </main>
  );
}
