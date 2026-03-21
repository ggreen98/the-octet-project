import Link from "next/link";
import { NavTitle } from "@/components/ui/NavTitle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";
import { HexDotGrid } from "@/components/ui/HexDotGrid";
import { ToolsDropdown } from "@/components/ui/ToolsDropdown";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { AchievementsBoard } from "@/components/lessons/AchievementsBoard";

export default function AchievementsPage() {
  return (
    <main
      className="scanlines font-terminal min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "var(--oc-bg)", color: "var(--oc-text)" }}
    >
      <HexDotGrid />
      <div className="boot-scan" />

      <div className="relative" style={{ zIndex: 2 }}>

        {/* ── NAV ──────────────────────────────────────────────────────── */}
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
              { label: "COURSES",    href: "/courses" },
              { label: "MINI GAMES", href: "/mini-games" },
              { label: "ABOUT",      href: "/who-we-are" },
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
            <ToolsDropdown />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <MobileNav activeLabel="ACHIEVEMENTS" />
            <div className="hidden md:block"><ProfileButton /></div>
            <ThemeToggle />
          </div>
        </nav>

        {/* ── HEADER ───────────────────────────────────────────────────── */}
        <section className="pt-28 pb-6 px-6 md:px-12 lg:px-16">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: "var(--oc-green)", fontSize: "0.8rem" }}>⬡</span>
                <span className="tracking-widest" style={{ color: "var(--oc-green)", fontSize: "0.75rem" }}>
                  ACHIEVEMENTS
                </span>
              </div>
              <h1
                className="font-heading"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.8rem)", letterSpacing: "-0.01em", lineHeight: 1 }}
              >
                ELEMENTS DISCOVERED
              </h1>
            </div>

            {/* Progress counter */}
            <div className="font-heading" style={{ fontSize: "0.75rem", letterSpacing: "0.14em", color: "var(--oc-text-dim)", paddingBottom: "0.25rem" }}>
              <span style={{ color: "var(--oc-green)", fontSize: "1.4rem", fontWeight: 700, marginRight: "0.4rem" }}>1</span>
              <span style={{ color: "var(--oc-text-hint)" }}>/ 118 ELEMENTS DISCOVERED</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 2, background: "rgba(114,184,114,0.12)", borderRadius: 1, marginTop: "0.75rem" }}>
            <div style={{ height: "100%", width: `${(1 / 118) * 100}%`, background: "var(--oc-green)", borderRadius: 1 }} />
          </div>
        </section>

        {/* ── BOARD ────────────────────────────────────────────────────── */}
        <section className="px-2 md:px-6 lg:px-10 pb-16">
          <AchievementsBoard />
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer
          className="px-6 md:px-16 lg:px-24 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: "1px solid var(--oc-green-border-faint)", color: "var(--oc-text-faint)" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--oc-green)" }}>⬡</span>
            <span className="font-heading tracking-widest" style={{ letterSpacing: "0.15em" }}>ALLYLIC</span>
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

      </div>
    </main>
  );
}
