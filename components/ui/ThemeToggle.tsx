"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="font-heading text-xs px-3 py-1.5 transition-all duration-200"
      style={{
        border: "1px solid var(--oc-green-border)",
        color: "var(--oc-green)",
        background: "transparent",
        letterSpacing: "0.12em",
        cursor: "pointer",
      }}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? "◑ LIGHT" : "◐ DARK"}
    </button>
  );
}
