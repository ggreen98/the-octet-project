"use client";

import { useState } from "react";

export type SIUnit = {
  id: string;
  name: string;
  symbol: string;
  category: string;
  definition: string;
  equivalent?: string;
};

export type SIPrefix = {
  prefix: string;
  symbol: string;
  factor: string;
  example: string;
};

const CATEGORIES = ["All", "Base Unit", "Derived Unit", "Accepted Unit"];

export function SIUnitsClient({
  units,
  prefixes,
}: {
  units: SIUnit[];
  prefixes: SIPrefix[];
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const q = search.toLowerCase();
  const filtered = units
    .filter((u) => {
      const matchesSearch =
        search === "" ||
        u.name.toLowerCase().includes(q) ||
        u.symbol.toLowerCase().includes(q) ||
        u.definition.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || u.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (search === "") return 0;
      const score = (u: SIUnit) => {
        const name = u.name.toLowerCase();
        const sym = u.symbol.toLowerCase();
        if (name === q || sym === q) return 0;
        if (name.startsWith(q) || sym.startsWith(q)) return 1;
        if (name.includes(q) || sym.includes(q)) return 2;
        return 3;
      };
      return score(a) - score(b);
    });

  return (
    <div>
      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search units..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full font-terminal text-sm px-4 py-3 outline-none"
          style={{
            background: "var(--oc-green-bg-surface)",
            border: "1px solid var(--oc-green-border)",
            borderRadius: "4px",
            color: "var(--oc-text)",
            caretColor: "#d4933e",
          }}
        />
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-heading"
          style={{ color: "var(--oc-green-dim)", letterSpacing: "0.1em" }}
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
              border: `1px solid ${activeCategory === cat ? "rgba(212,147,62,0.6)" : "var(--oc-green-border)"}`,
              background:
                activeCategory === cat
                  ? "rgba(212,147,62,0.1)"
                  : "transparent",
              color:
                activeCategory === cat ? "#d4933e" : "var(--oc-green-dim)",
              borderRadius: "4px",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Units list */}
      <div
        className="flex flex-col gap-px mb-16"
        style={{ borderTop: "1px solid var(--oc-green-border-faint)" }}
      >
        {filtered.length === 0 && (
          <p
            className="py-12 text-center text-sm"
            style={{ color: "var(--oc-text-faint)" }}
          >
            No units found.
          </p>
        )}
        {filtered.map((u) => (
          <div
            key={u.id}
            id={u.id}
            className="py-6"
            style={{ borderBottom: "1px solid var(--oc-green-border-faint)" }}
          >
            <div className="flex items-baseline gap-4 mb-3 flex-wrap">
              {/* Symbol */}
              <span
                className="font-heading"
                style={{
                  fontSize: "1.4rem",
                  color: "#d4933e",
                  letterSpacing: "0.05em",
                  minWidth: "2.5rem",
                }}
              >
                {u.symbol}
              </span>
              {/* Name */}
              <h2
                className="font-heading"
                style={{
                  fontSize: "1.1rem",
                  color: "var(--oc-text)",
                  letterSpacing: "0.05em",
                }}
              >
                {u.name}
              </h2>
              {/* Category badge */}
              <span
                className="font-heading text-xs px-2 py-0.5"
                style={{
                  background: "rgba(212,147,62,0.08)",
                  color: "#c8853a",
                  border: "1px solid rgba(212,147,62,0.2)",
                  borderRadius: "2px",
                  letterSpacing: "0.1em",
                }}
              >
                {u.category.toUpperCase()}
              </span>
            </div>
            <p
              className="text-sm leading-relaxed mb-2"
              style={{ color: "var(--oc-text-muted)", maxWidth: "680px" }}
            >
              {u.definition}
            </p>
            {u.equivalent && (
              <p
                className="text-xs font-terminal"
                style={{ color: "var(--oc-text-dim)", letterSpacing: "0.04em" }}
              >
                = {u.equivalent}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* SI Prefixes table */}
      {(search === "" || activeCategory === "All") && (
        <div>
          <h2
            className="font-heading mb-2"
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              letterSpacing: "0.05em",
              color: "var(--oc-text)",
            }}
          >
            SI PREFIXES
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--oc-text-muted)", maxWidth: "560px" }}
          >
            Prefixes scale any SI unit by a power of ten. Attaching a prefix to
            a unit symbol creates a new, smaller or larger unit — for example,
            nano + metre = nanometre (nm).
          </p>
          <div
            className="font-terminal text-xs overflow-x-auto"
            style={{
              border: "1px solid var(--oc-green-border-dim)",
              background: "var(--oc-green-bg-surface)",
              borderRadius: "4px",
            }}
          >
            {/* Header */}
            <div
              className="grid font-heading"
              style={{
                gridTemplateColumns: "1fr 80px 120px 1fr",
                columnGap: "1rem",
                padding: "0.6rem 1.25rem",
                borderBottom: "1px solid var(--oc-green-border-dim)",
                color: "var(--oc-text-dim)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
              }}
            >
              <span>PREFIX</span>
              <span>SYMBOL</span>
              <span>FACTOR</span>
              <span>EXAMPLE</span>
            </div>
            {prefixes.map((p, i) => (
              <div
                key={p.prefix}
                className="grid"
                style={{
                  gridTemplateColumns: "1fr 80px 120px 1fr",
                  columnGap: "1rem",
                  padding: "0.55rem 1.25rem",
                  borderBottom:
                    i < prefixes.length - 1
                      ? "1px solid var(--oc-green-border-faint)"
                      : "none",
                  alignItems: "baseline",
                }}
              >
                <span style={{ color: "var(--oc-text-muted)" }}>
                  {p.prefix}
                </span>
                <span style={{ color: "#d4933e", fontWeight: 600 }}>
                  {p.symbol}
                </span>
                <span style={{ color: "var(--oc-text-dim)" }}>{p.factor}</span>
                <span style={{ color: "var(--oc-text-dim)" }}>{p.example}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
