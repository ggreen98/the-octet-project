// Static server component — no client JS needed

type Cat = "h" | "ka" | "ae" | "tr" | "pm" | "md" | "nm" | "ha" | "ng" | "la" | "ac";

type Cell = { sym: string; cat: Cat } | null;

const CAT_BG: Record<Cat, string> = {
  h:  "rgba(68,153,255,0.55)",
  ka: "rgba(249,115,22,0.65)",
  ae: "rgba(234,179,8,0.60)",
  tr: "rgba(68,153,255,0.35)",
  pm: "rgba(148,163,184,0.45)",
  md: "rgba(114,184,114,0.50)",
  nm: "rgba(34,211,238,0.45)",
  ha: "rgba(168,85,247,0.60)",
  ng: "rgba(232,121,249,0.50)",
  la: "rgba(251,146,60,0.45)",
  ac: "rgba(248,113,113,0.45)",
};

const CAT_BORDER: Record<Cat, string> = {
  h:  "rgba(68,153,255,0.8)",
  ka: "rgba(249,115,22,0.9)",
  ae: "rgba(234,179,8,0.85)",
  tr: "rgba(68,153,255,0.55)",
  pm: "rgba(148,163,184,0.7)",
  md: "rgba(114,184,114,0.75)",
  nm: "rgba(34,211,238,0.7)",
  ha: "rgba(168,85,247,0.85)",
  ng: "rgba(232,121,249,0.75)",
  la: "rgba(251,146,60,0.7)",
  ac: "rgba(248,113,113,0.7)",
};

// Row 0-6 = periods 1-7 (18 columns each, null = empty).
// Rows 7-8 = lanthanide / actinide f-block (2 leading nulls then 15 elements).
const ROWS: Cell[][] = [
  // Period 1
  [{sym:"H",cat:"h"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{sym:"He",cat:"ng"}],
  // Period 2
  [{sym:"Li",cat:"ka"},{sym:"Be",cat:"ae"},null,null,null,null,null,null,null,null,null,null,{sym:"B",cat:"md"},{sym:"C",cat:"nm"},{sym:"N",cat:"nm"},{sym:"O",cat:"nm"},{sym:"F",cat:"ha"},{sym:"Ne",cat:"ng"}],
  // Period 3
  [{sym:"Na",cat:"ka"},{sym:"Mg",cat:"ae"},null,null,null,null,null,null,null,null,null,null,{sym:"Al",cat:"pm"},{sym:"Si",cat:"md"},{sym:"P",cat:"nm"},{sym:"S",cat:"nm"},{sym:"Cl",cat:"ha"},{sym:"Ar",cat:"ng"}],
  // Period 4
  [{sym:"K",cat:"ka"},{sym:"Ca",cat:"ae"},{sym:"Sc",cat:"tr"},{sym:"Ti",cat:"tr"},{sym:"V",cat:"tr"},{sym:"Cr",cat:"tr"},{sym:"Mn",cat:"tr"},{sym:"Fe",cat:"tr"},{sym:"Co",cat:"tr"},{sym:"Ni",cat:"tr"},{sym:"Cu",cat:"tr"},{sym:"Zn",cat:"tr"},{sym:"Ga",cat:"pm"},{sym:"Ge",cat:"md"},{sym:"As",cat:"md"},{sym:"Se",cat:"nm"},{sym:"Br",cat:"ha"},{sym:"Kr",cat:"ng"}],
  // Period 5
  [{sym:"Rb",cat:"ka"},{sym:"Sr",cat:"ae"},{sym:"Y",cat:"tr"},{sym:"Zr",cat:"tr"},{sym:"Nb",cat:"tr"},{sym:"Mo",cat:"tr"},{sym:"Tc",cat:"tr"},{sym:"Ru",cat:"tr"},{sym:"Rh",cat:"tr"},{sym:"Pd",cat:"tr"},{sym:"Ag",cat:"tr"},{sym:"Cd",cat:"tr"},{sym:"In",cat:"pm"},{sym:"Sn",cat:"pm"},{sym:"Sb",cat:"md"},{sym:"Te",cat:"md"},{sym:"I",cat:"ha"},{sym:"Xe",cat:"ng"}],
  // Period 6  (La* = placeholder for lanthanide f-block)
  [{sym:"Cs",cat:"ka"},{sym:"Ba",cat:"ae"},{sym:"La*",cat:"la"},{sym:"Hf",cat:"tr"},{sym:"Ta",cat:"tr"},{sym:"W",cat:"tr"},{sym:"Re",cat:"tr"},{sym:"Os",cat:"tr"},{sym:"Ir",cat:"tr"},{sym:"Pt",cat:"tr"},{sym:"Au",cat:"tr"},{sym:"Hg",cat:"tr"},{sym:"Tl",cat:"pm"},{sym:"Pb",cat:"pm"},{sym:"Bi",cat:"pm"},{sym:"Po",cat:"md"},{sym:"At",cat:"ha"},{sym:"Rn",cat:"ng"}],
  // Period 7  (Ac* = placeholder for actinide f-block)
  [{sym:"Fr",cat:"ka"},{sym:"Ra",cat:"ae"},{sym:"Ac*",cat:"ac"},{sym:"Rf",cat:"tr"},{sym:"Db",cat:"tr"},{sym:"Sg",cat:"tr"},{sym:"Bh",cat:"tr"},{sym:"Hs",cat:"tr"},{sym:"Mt",cat:"tr"},{sym:"Ds",cat:"tr"},{sym:"Rg",cat:"tr"},{sym:"Cn",cat:"tr"},{sym:"Nh",cat:"pm"},{sym:"Fl",cat:"pm"},{sym:"Mc",cat:"pm"},{sym:"Lv",cat:"md"},{sym:"Ts",cat:"ha"},{sym:"Og",cat:"ng"}],
  // Lanthanides (f-block, 2 leading gaps then La–Lu)
  [null,null,{sym:"La",cat:"la"},{sym:"Ce",cat:"la"},{sym:"Pr",cat:"la"},{sym:"Nd",cat:"la"},{sym:"Pm",cat:"la"},{sym:"Sm",cat:"la"},{sym:"Eu",cat:"la"},{sym:"Gd",cat:"la"},{sym:"Tb",cat:"la"},{sym:"Dy",cat:"la"},{sym:"Ho",cat:"la"},{sym:"Er",cat:"la"},{sym:"Tm",cat:"la"},{sym:"Yb",cat:"la"},{sym:"Lu",cat:"la"},null],
  // Actinides
  [null,null,{sym:"Ac",cat:"ac"},{sym:"Th",cat:"ac"},{sym:"Pa",cat:"ac"},{sym:"U",cat:"ac"},{sym:"Np",cat:"ac"},{sym:"Pu",cat:"ac"},{sym:"Am",cat:"ac"},{sym:"Cm",cat:"ac"},{sym:"Bk",cat:"ac"},{sym:"Cf",cat:"ac"},{sym:"Es",cat:"ac"},{sym:"Fm",cat:"ac"},{sym:"Md",cat:"ac"},{sym:"No",cat:"ac"},{sym:"Lr",cat:"ac"},null],
];

const PERIOD_LABELS = ["1","2","3","4","5","6","7","",""];  // "" for f-block rows
const F_ROW_LABELS  = ["","","6*","7*"];                   // printed in column-0 of f rows

const LEGEND: { cat: Cat; label: string; detail: string }[] = [
  { cat: "h",  label: "Hydrogen",               detail: "Unique — sits in group 1 but behaves like neither a metal nor a non-metal" },
  { cat: "ka", label: "Alkali Metals",           detail: "Group 1 (excl. H) · 1 valence electron · extremely reactive" },
  { cat: "ae", label: "Alkaline Earth Metals",   detail: "Group 2 · 2 valence electrons · reactive but less so than alkali metals" },
  { cat: "tr", label: "Transition Metals",       detail: "Groups 3–12 · d-block · hard, conductive, variable oxidation states" },
  { cat: "pm", label: "Post-transition Metals",  detail: "Groups 13–15 · softer metals with higher electronegativities than transition metals" },
  { cat: "md", label: "Metalloids",              detail: "Borderline between metals and non-metals · include Si, Ge, As — important in semiconductors" },
  { cat: "nm", label: "Non-metals",              detail: "Groups 14–16 · high electronegativity · form covalent bonds" },
  { cat: "ha", label: "Halogens",                detail: "Group 17 · 7 valence electrons · most reactive non-metals · one electron from noble-gas config" },
  { cat: "ng", label: "Noble Gases",             detail: "Group 18 · full outer shell · essentially unreactive · used as inert reference points" },
  { cat: "la", label: "Lanthanides",             detail: "f-block · rare-earth metals · similar properties across the series" },
  { cat: "ac", label: "Actinides",               detail: "f-block · many are radioactive · include uranium and plutonium" },
];

const CELL_W = 30;
const CELL_H = 28;
const GAP    = 2;

export function PeriodicTableGroups() {
  return (
    <div
      style={{
        border: "1px solid var(--oc-green-border-dim)",
        background: "var(--oc-green-bg-surface)",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid var(--oc-green-border-faint)" }}>
        <p className="font-heading" style={{ fontSize: "0.6rem", color: "var(--oc-text-dim)", letterSpacing: "0.14em" }}>
          // REFERENCE — all 118 elements · colour-coded by group type · * = f-block continues below
        </p>
      </div>

      {/* Scrollable table */}
      <div style={{ padding: "10px 14px", overflowX: "auto" }}>
        <div style={{ display: "inline-block", minWidth: 580 }}>

          {/* Group number headers */}
          <div style={{ display: "flex", gap: GAP, marginLeft: CELL_W + GAP + 4 }}>
            {Array.from({ length: 18 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: CELL_W, textAlign: "center", flexShrink: 0,
                  fontSize: "0.45rem", color: "var(--oc-text-faint)", fontFamily: "inherit",
                  paddingBottom: 3,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Rows */}
          {ROWS.map((row, ri) => {
            const isFBlock = ri >= 7;
            return (
              <div key={ri}>
                {/* Small gap before f-block */}
                {ri === 7 && <div style={{ height: 6 }} />}

                <div style={{ display: "flex", gap: GAP, alignItems: "center", marginBottom: GAP }}>
                  {/* Period / f-block label */}
                  <div
                    style={{
                      width: CELL_W, flexShrink: 0, textAlign: "right",
                      paddingRight: 5, fontSize: "0.50rem",
                      color: isFBlock ? "var(--oc-text-faint)" : "var(--oc-green-dim)",
                      fontFamily: "inherit", letterSpacing: "0.05em",
                    }}
                  >
                    {isFBlock
                      ? (ri === 7 ? "6*" : "7*")
                      : PERIOD_LABELS[ri]}
                  </div>

                  {/* Cells */}
                  {row.map((cell, ci) => {
                    if (!cell) {
                      return <div key={ci} style={{ width: CELL_W, height: CELL_H, flexShrink: 0 }} />;
                    }
                    return (
                      <div
                        key={ci}
                        title={cell.sym}
                        style={{
                          width: CELL_W, height: CELL_H, flexShrink: 0,
                          background: CAT_BG[cell.cat],
                          border: `1px solid ${CAT_BORDER[cell.cat]}`,
                          borderRadius: 2,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <span style={{
                          fontSize: cell.sym.length > 2 ? "0.40rem" : "0.55rem",
                          color: "rgba(255,255,255,0.92)",
                          fontFamily: "inherit",
                          fontWeight: 600,
                          letterSpacing: 0,
                        }}>
                          {cell.sym}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          borderTop: "1px solid var(--oc-green-border-faint)",
          padding: "10px 14px 12px",
          display: "flex", flexDirection: "column", gap: 5,
        }}
      >
        <p className="font-heading" style={{ fontSize: "0.52rem", color: "var(--oc-text-dim)", letterSpacing: "0.14em", marginBottom: 4 }}>
          KEY
        </p>
        {LEGEND.map(({ cat, label, detail }) => (
          <div key={cat} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div
              style={{
                width: 14, height: 14, flexShrink: 0, borderRadius: 2, marginTop: 1,
                background: CAT_BG[cat],
                border: `1px solid ${CAT_BORDER[cat]}`,
              }}
            />
            <div>
              <span style={{ fontSize: "0.65rem", color: "var(--oc-text)", fontFamily: "inherit", fontWeight: 600 }}>
                {label}
              </span>
              <span style={{ fontSize: "0.62rem", color: "var(--oc-text-muted)", fontFamily: "inherit" }}>
                {" — "}{detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
