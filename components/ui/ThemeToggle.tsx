"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle({ amber }: { amber?: boolean } = {}) {
  const { theme, toggleTheme } = useTheme();
  const color  = amber ? "#ffb830" : "var(--oc-green)";
  const border = amber ? "1px solid rgba(255,184,48,0.45)" : "1px solid var(--oc-green-border)";

  return (
    <button
      onClick={toggleTheme}
      className="font-heading text-xs px-3 py-1.5 transition-all duration-200"
      style={{
        border,
        color,
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
