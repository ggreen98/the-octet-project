"use client";

import { useState } from "react";
import { TERMS } from "@/app/dictionary/page";

type Term = typeof TERMS[number];

const CATEGORIES = ["All", "Subatomic Particle", "Structure", "Property", "Measurement"];

export function DictionaryClient({ terms }: { terms: Term[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = terms.filter((t) => {
    const matchesSearch =
      search === "" ||
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full font-terminal text-sm px-4 py-3 outline-none"
          style={{
            background: "rgba(0,255,65,0.03)",
            border: "1px solid rgba(0,255,65,0.15)",
            borderRadius: "4px",
            color: "#c8e8ff",
            caretColor: "#00ff41",
          }}
        />
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-heading"
          style={{ color: "rgba(0,255,65,0.3)", letterSpacing: "0.1em" }}
        >
          {filtered.length} RESULT{filtered.length !== 1 ? "S" : ""}
        </span>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="font-heading text-xs px-3 py-1 transition-all duration-150"
            style={{
              border: `1px solid ${activeCategory === cat ? "rgba(68,153,255,0.6)" : "rgba(0,255,65,0.15)"}`,
              background: activeCategory === cat ? "rgba(68,153,255,0.1)" : "transparent",
              color: activeCategory === cat ? "#4499ff" : "rgba(0,255,65,0.45)",
              borderRadius: "4px",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Terms */}
      <div className="flex flex-col gap-px" style={{ borderTop: "1px solid rgba(0,255,65,0.08)" }}>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm" style={{ color: "rgba(200,255,212,0.3)" }}>
            No terms found.
          </p>
        )}
        {filtered.map((t) => (
          <div
            key={t.id}
            id={t.id}
            className="py-6"
            style={{ borderBottom: "1px solid rgba(0,255,65,0.08)" }}
          >
            <div className="flex items-baseline gap-4 mb-3 flex-wrap">
              <h2
                className="font-heading"
                style={{ fontSize: "1.1rem", color: "#c8e8ff", letterSpacing: "0.05em" }}
              >
                {t.term}
              </h2>
              <span
                className="font-heading text-xs px-2 py-0.5"
                style={{
                  background: "rgba(68,153,255,0.08)",
                  color: "rgba(68,153,255,0.6)",
                  border: "1px solid rgba(68,153,255,0.15)",
                  borderRadius: "2px",
                  letterSpacing: "0.1em",
                }}
              >
                {t.category.toUpperCase()}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(200,255,212,0.55)", maxWidth: "680px" }}>
              {t.definition}
            </p>
            {t.related.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs" style={{ color: "rgba(0,255,65,0.35)", letterSpacing: "0.08em" }}>
                  SEE ALSO:
                </span>
                {t.related.map((r) => {
                  const related = terms.find((x) => x.id === r);
                  if (!related) return null;
                  return (
                    <a
                      key={r}
                      href={`#${r}`}
                      className="text-xs font-heading transition-colors duration-150"
                      style={{ color: "rgba(68,153,255,0.6)", letterSpacing: "0.08em", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#4499ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(68,153,255,0.6)")}
                    >
                      {related.term}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
