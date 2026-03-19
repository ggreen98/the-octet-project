import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileNav } from "@/components/ui/MobileNav";

export const metadata = {
  title: "Coming Soon — Allylic",
  description: "Allylic accounts are coming soon. Sign up notifications will be available shortly.",
};

export default function SignUpPage() {
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
          {[
            ["COURSES",        "/courses"],
            ["PERIODIC TABLE", "/periodic-table"],
            ["DICTIONARY",     "/dictionary"],
            ["UNITS", "/si-units"], ["MINI GAMES", "/mini-games"], ["ABOUT", "/who-we-are"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="transition-colors duration-200 hover:text-white"
              style={{ color: "var(--oc-text-dim)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <MobileNav />
          <ThemeToggle />
        </div>
      </nav>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">

        <p className="text-xs tracking-widest mb-6 animate-fade-up" style={{ color: "var(--oc-green-dim)", animationFillMode: "both" }}>
          // STATUS
        </p>

        <h1
          className="font-heading leading-none mb-6 animate-fade-up anim-d1"
          style={{
            fontSize: "clamp(3rem, 10vw, 7rem)",
            letterSpacing: "-0.02em",
            color: "var(--oc-text)",
            animationFillMode: "both",
          }}
        >
          COMING<br />SOON
        </h1>

        <p
          className="text-sm leading-relaxed mb-10 max-w-sm animate-fade-up anim-d2"
          style={{ color: "var(--oc-text-muted)", animationFillMode: "both" }}
        >
          Allylic accounts are in development. In the meantime, all lessons,
          the periodic table, dictionary, and SI units reference are freely available.
        </p>

        <Link
          href="/courses"
          className="font-heading text-xs px-7 py-3.5 transition-all duration-200 animate-fade-up anim-d3"
          style={{
            background: "var(--oc-blue)",
            color: "var(--oc-btn-text)",
            letterSpacing: "0.15em",
            animationFillMode: "both",
          }}
        >
          EXPLORE COURSES →
        </Link>
      </div>
    </main>
  );
}
