"use client";

import { useState, useEffect } from "react";

// ── Wavelength → approximate visible-spectrum RGB ─────────────────────────────
function wlToColor(nm: number): string {
  let r = 0, g = 0, b = 0;
  if      (nm >= 380 && nm < 440) { r = (440 - nm) / 60;  g = 0;               b = 1; }
  else if (nm >= 440 && nm < 490) { r = 0;                 g = (nm - 440) / 50; b = 1; }
  else if (nm >= 490 && nm < 510) { r = 0;                 g = 1;               b = (510 - nm) / 20; }
  else if (nm >= 510 && nm < 580) { r = (nm - 510) / 70;  g = 1;               b = 0; }
  else if (nm >= 580 && nm < 645) { r = 1;                 g = (645 - nm) / 65; b = 0; }
  else if (nm >= 645 && nm <= 780) { r = 1;                g = 0;               b = 0; }
  // Dim edges near UV and IR
  let f = 1.0;
  if (nm < 420) f = 0.2 + 0.8 * (nm - 380) / 40;
  if (nm > 700) f = 0.2 + 0.8 * (780 - nm) / 80;
  return `rgb(${Math.round(r * 255 * f)},${Math.round(g * 255 * f)},${Math.round(b * 255 * f)})`;
}

// Spectrum bar: x=50–450 (400 SVG units), mapping 380–780 nm → 1 unit/nm
const nmToX = (nm: number) => 50 + (nm - 380);

// Spectrum bar geometry
const SX0 = 50, SX1 = 450, SY0 = 292, SH = 62;
const SCALE_NMS = [400, 450, 500, 550, 600, 650, 700, 750];

// ── Element data ──────────────────────────────────────────────────────────────
type SpecLine = { nm: number; intensity: number; label: string };
type ElementData = { symbol: string; name: string; z: number; config: string; glow: string; lines: SpecLine[] };

// All wavelengths and relative intensities sourced from NIST Atomic Spectra Database
// https://physics.nist.gov/PhysRefData/ASD/lines_form.html (neutral atom, Ne I / He I etc.)
const ELEMENTS: ElementData[] = [
  {
    // Balmer series. NIST intensities: Hα 500000, Hβ 180000, Hγ 90000, Hδ 70000, Hζ 70000, Hε 30000, Hη 30000
    symbol: "H", name: "Hydrogen", z: 1, config: "1s¹", glow: "#ff4444",
    lines: [
      { nm: 656.279, intensity: 1.00, label: "Hα" },
      { nm: 486.135, intensity: 0.36, label: "Hβ" },
      { nm: 434.047, intensity: 0.18, label: "Hγ" },
      { nm: 410.173, intensity: 0.14, label: "Hδ" },
      { nm: 397.007, intensity: 0.06, label: ""   },
      { nm: 388.906, intensity: 0.14, label: ""   },
      { nm: 383.540, intensity: 0.06, label: ""   },
    ],
  },
  {
    // NIST: 587.562 (500), 388.865 (500), 447.148 (200), 706.519 (200), 667.815 (100), 501.568 (100), 728.135 (50), 471.315 (30), 492.193 (20)
    symbol: "He", name: "Helium", z: 2, config: "1s²", glow: "#ffdd44",
    lines: [
      { nm: 587.562, intensity: 1.00, label: "D₃" },
      { nm: 388.865, intensity: 1.00, label: ""   },
      { nm: 447.148, intensity: 0.40, label: ""   },
      { nm: 706.519, intensity: 0.40, label: ""   },
      { nm: 667.815, intensity: 0.20, label: ""   },
      { nm: 501.568, intensity: 0.20, label: ""   },
      { nm: 728.135, intensity: 0.10, label: ""   },
      { nm: 471.315, intensity: 0.06, label: ""   },
      { nm: 492.193, intensity: 0.04, label: ""   },
    ],
  },
  {
    // NIST: 670.776/670.791 (3600 each), 610.354/610.365 (320 each), 413.256/413.262 (40), 460.283/460.289 (13), 497.166/497.175 (8)
    // Doublets are sub-nm apart so rendered as single lines at the averaged wavelength
    symbol: "Li", name: "Lithium", z: 3, config: "[He] 2s¹", glow: "#ff4433",
    lines: [
      { nm: 670.784, intensity: 1.00,  label: "2p→2s" },
      { nm: 610.360, intensity: 0.089, label: ""      },
      { nm: 413.259, intensity: 0.011, label: ""      },
      { nm: 460.286, intensity: 0.004, label: ""      },
      { nm: 497.171, intensity: 0.002, label: ""      },
    ],
  },
  {
    // NIST: D₂ 588.995 (80000), D₁ 589.592 (40000). Secondary lines are <0.5% as bright — effectively invisible vs D lines.
    symbol: "Na", name: "Sodium", z: 11, config: "[Ne] 3s¹", glow: "#ffcc00",
    lines: [
      { nm: 588.995, intensity: 1.00, label: "D₂" },
      { nm: 589.592, intensity: 0.50, label: "D₁" },
      { nm: 568.820, intensity: 0.006, label: ""  },
      { nm: 507.120, intensity: 0.003, label: ""  },
    ],
  },
  {
    // NIST top lines in visible range. Neon is dominated by deep-red lines 690–754 nm.
    // Intensities: 692.947 (100000), 703.241 (85000), 717.394 (77000), 724.517 (77000),
    // 743.890 (60000), 702.405 (34000), 748.887 (32000), 640.225 (20000), 585.249 (20000),
    // 650.653 (15000), 614.306/616.359/621.728/626.650/633.443/638.299/659.895/588.190 (10000 each)
    symbol: "Ne", name: "Neon", z: 10, config: "[He] 2s² 2p⁶", glow: "#cc2200",
    lines: [
      { nm: 692.947, intensity: 1.00, label: "" },
      { nm: 703.241, intensity: 0.85, label: "" },
      { nm: 717.394, intensity: 0.77, label: "" },
      { nm: 724.517, intensity: 0.77, label: "" },
      { nm: 743.890, intensity: 0.60, label: "" },
      { nm: 702.405, intensity: 0.34, label: "" },
      { nm: 748.887, intensity: 0.32, label: "" },
      { nm: 640.225, intensity: 0.20, label: "" },
      { nm: 585.249, intensity: 0.20, label: "" },
      { nm: 650.653, intensity: 0.15, label: "" },
      { nm: 614.306, intensity: 0.10, label: "" },
      { nm: 659.895, intensity: 0.10, label: "" },
      { nm: 588.190, intensity: 0.10, label: "" },
      { nm: 638.299, intensity: 0.10, label: "" },
    ],
  },
  {
    // NIST: 404.657 (12000), 435.834 (12000), 546.075 (6000), 690.746/708.190/576.961/407.784 (1000),
    // 579.067 (900), 709.186 (800), 567.581/671.634 (600), 580.378 (400)
    symbol: "Hg", name: "Mercury", z: 80, config: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", glow: "#44ee88",
    lines: [
      { nm: 404.657, intensity: 1.00,  label: "h"  },
      { nm: 435.834, intensity: 1.00,  label: "g"  },
      { nm: 546.075, intensity: 0.50,  label: "e"  },
      { nm: 690.746, intensity: 0.083, label: ""   },
      { nm: 708.190, intensity: 0.083, label: ""   },
      { nm: 576.961, intensity: 0.083, label: ""   },
      { nm: 407.784, intensity: 0.083, label: ""   },
      { nm: 579.067, intensity: 0.075, label: ""   },
      { nm: 709.186, intensity: 0.067, label: ""   },
      { nm: 567.581, intensity: 0.050, label: ""   },
      { nm: 671.634, intensity: 0.050, label: ""   },
      { nm: 580.378, intensity: 0.033, label: ""   },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function EmissionSpectrum() {
  const [idx,     setIdx]     = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % ELEMENTS.length);
        setVisible(true);
      }, 550);
    }, 4800);
    return () => clearInterval(id);
  }, []);

  const el = ELEMENTS[idx];
  const labeledLines = el.lines.filter(l => l.label !== "");
  const fade: React.CSSProperties = { transition: "opacity 0.5s ease", opacity: visible ? 1 : 0 };

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <style>{`
        .es-ticker { animation: es-tick 1.1s steps(1) infinite; }
        @keyframes es-tick { 0%,49% { opacity:1 } 50%,100% { opacity:0 } }

        /* Light mode: card gets page background, symbol glow removed */
        [data-theme="light"] .es-card-bg  { fill: rgba(240, 237, 230, 0.75) !important; }
        [data-theme="light"] .es-symbol   { filter: none !important; }

        /* Light mode: boost all faint text to readable contrast */
        [data-theme="light"] .es-text-dim   { opacity: 0.75 !important; fill: var(--oc-text) !important; }
        [data-theme="light"] .es-text-hint  { opacity: 0.65 !important; fill: var(--oc-text) !important; }
        [data-theme="light"] .es-text-green { opacity: 0.7  !important; fill: var(--oc-green) !important; }

        /* Bezel no longer needed in light mode — rainbow bg solves the contrast */
        .es-bezel { display: none; }

        /* Light mode: swap dark bar for vivid visible-spectrum rainbow */
        .es-spec-bright { display: none; }
        [data-theme="light"] .es-spec-dark   { fill: #f5f2eb !important; }
        [data-theme="light"] .es-spec-bright { display: block; }

        /* Light mode: apply white+color glow filter so lines pop against rainbow */
        [data-theme="light"] .es-lines-group { filter: url(#es-glow-light); }
      `}</style>

      <svg
        viewBox="0 0 500 530"
        style={{ maxHeight: "calc(100vh - 9rem)", width: "auto", maxWidth: "100%" }}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {/* Dark mode: faint rainbow hint over black */}
          <linearGradient id="es-spec-bg" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"    stopColor="#8800ff" stopOpacity="0.08" />
            <stop offset="18%"   stopColor="#0044ff" stopOpacity="0.06" />
            <stop offset="29%"   stopColor="#00bbff" stopOpacity="0.05" />
            <stop offset="50%"   stopColor="#00ff66" stopOpacity="0.04" />
            <stop offset="63%"   stopColor="#aaff00" stopOpacity="0.04" />
            <stop offset="75%"   stopColor="#ffaa00" stopOpacity="0.05" />
            <stop offset="100%"  stopColor="#cc0000" stopOpacity="0.07" />
          </linearGradient>

          {/* Light mode: full vivid visible-spectrum rainbow */}
          <linearGradient id="es-spec-bg-bright" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"    stopColor="#8b00ff" stopOpacity="0.85" />
            <stop offset="16%"   stopColor="#3300ff" stopOpacity="0.82" />
            <stop offset="27%"   stopColor="#0099ff" stopOpacity="0.80" />
            <stop offset="40%"   stopColor="#00ee55" stopOpacity="0.78" />
            <stop offset="55%"   stopColor="#aaff00" stopOpacity="0.78" />
            <stop offset="67%"   stopColor="#ffcc00" stopOpacity="0.82" />
            <stop offset="80%"   stopColor="#ff5500" stopOpacity="0.85" />
            <stop offset="100%"  stopColor="#cc0000" stopOpacity="0.80" />
          </linearGradient>

          {/* Light mode glow filter: white halo for contrast + colored bloom */}
          <filter id="es-glow-light" x="-60%" y="-10%" width="220%" height="120%" colorInterpolationFilters="sRGB">
            {/* White halo — ensures visibility against any rainbow background */}
            <feFlood floodColor="white" floodOpacity="1" result="white-fill" />
            <feComposite in="white-fill" in2="SourceGraphic" operator="in" result="white-shaped" />
            <feGaussianBlur in="white-shaped" stdDeviation="2.5" result="white-glow" />
            {/* Colored bloom */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="color-bloom" />
            <feMerge>
              <feMergeNode in="white-glow" />
              <feMergeNode in="white-glow" />
              <feMergeNode in="color-bloom" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Element card ─────────────────────────────────────────────────── */}
        <rect
          x="50" y="28" width="400" height="220"
          stroke="var(--oc-green-border-dim)" strokeWidth="0.8"
          fill="rgba(1,13,10,0.55)"
          className="es-card-bg"
          style={fade}
        />
        {/* Corner bracket marks — periodic-table aesthetic */}
        {(
          [
            [50,40,50,28], [50,28,64,28],       // top-left
            [450,40,450,28], [436,28,450,28],    // top-right
            [50,236,50,248], [50,248,64,248],    // bottom-left
            [450,236,450,248], [436,248,450,248],// bottom-right
          ] as [number,number,number,number][]
        ).map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--oc-green)" strokeWidth="1.5" strokeLinecap="round"
            style={fade}
          />
        ))}

        {/* Atomic number */}
        <text x="66" y="52"
          fill="var(--oc-text-dim)" fontSize="13" fontFamily="monospace"
          className="es-text-dim"
          style={{ ...fade, opacity: visible ? 0.55 : 0 }}
        >
          {el.z}
        </text>

        {/* Symbol — large, glows in element's characteristic color */}
        <text
          x="250" y="200"
          textAnchor="middle"
          fill="var(--oc-text)"
          fontSize="150"
          fontFamily="monospace"
          fontWeight="700"
          letterSpacing="-4"
          className="es-symbol"
          style={{
            transition: "opacity 0.5s ease, filter 0.5s ease",
            opacity: visible ? 1 : 0,
            filter: `drop-shadow(0 0 22px ${el.glow}60) drop-shadow(0 0 8px ${el.glow}40)`,
          }}
        >
          {el.symbol}
        </text>

        {/* Name */}
        <text x="250" y="228" textAnchor="middle"
          fill="var(--oc-text-dim)" fontSize="10" fontFamily="monospace" letterSpacing="7"
          className="es-text-dim"
          style={{ ...fade, opacity: visible ? 0.5 : 0 }}
        >
          {el.name.toUpperCase()}
        </text>

        {/* Electron config */}
        <text x="250" y="246" textAnchor="middle"
          fill="var(--oc-green-dim)" fontSize="9" fontFamily="monospace" letterSpacing="2"
          className="es-text-green"
          style={{ ...fade, opacity: visible ? 0.42 : 0 }}
        >
          {el.config}
        </text>

        {/* ── Section label ────────────────────────────────────────────────── */}
        <text x="50" y="278"
          fill="var(--oc-green-dim)" fontSize="7" fontFamily="monospace" letterSpacing="5"
          className="es-text-green" opacity="0.55"
        >
          EMISSION SPECTRUM
        </text>
        <text x="450" y="278" textAnchor="end"
          fill="var(--oc-text-hint)" fontSize="7" fontFamily="monospace"
          className="es-text-hint" opacity="0.4"
        >
          380 – 780 nm
        </text>

        {/* ── Spectrum bar ─────────────────────────────────────────────────── */}
        {/* Light-mode bezel: larger rounded rect that fades from page bg into the
            dark bar, so the hard black edge reads as an instrument display. */}
        <rect
          x={SX0 - 16} y={SY0 - 14} width={SX1 - SX0 + 32} height={SH + 28}
          rx="8" fill="rgba(6,10,18,0.82)"
          className="es-bezel"
        />

        {/* Dark mode base (near-black) / light mode base (warm white) */}
        <rect x={SX0} y={SY0} width={SX1 - SX0} height={SH} fill="#020a05" className="es-spec-dark" />
        {/* Dark mode: faint rainbow hint */}
        <rect x={SX0} y={SY0} width={SX1 - SX0} height={SH} fill="url(#es-spec-bg)" />
        {/* Light mode: vivid full-spectrum rainbow (hidden in dark mode) */}
        <rect x={SX0} y={SY0} width={SX1 - SX0} height={SH} fill="url(#es-spec-bg-bright)" className="es-spec-bright" />

        {/* 50 nm guide ticks inside bar */}
        {SCALE_NMS.map(nm => (
          <line key={nm}
            x1={nmToX(nm)} y1={SY0}
            x2={nmToX(nm)} y2={SY0 + 9}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1"
          />
        ))}

        {/* Emission lines */}
        <g style={fade} className="es-lines-group">
          {el.lines.map((line, i) => {
            const x = nmToX(line.nm);
            const c = wlToColor(line.nm);
            return (
              <g key={i}>
                {/* Outer glow */}
                <rect x={x - 6} y={SY0} width={12} height={SH}
                  fill={c} opacity={0.10 * line.intensity} />
                {/* Inner glow */}
                <rect x={x - 2.5} y={SY0} width={5} height={SH}
                  fill={c} opacity={0.24 * line.intensity} />
                {/* Core line — height proportional to intensity */}
                <rect
                  x={x - 0.75} y={SY0 + SH * (1 - line.intensity)}
                  width={1.5}   height={SH * line.intensity}
                  fill={c} opacity={0.95}
                />
              </g>
            );
          })}
        </g>

        {/* Scan line — uses SMIL so translate is in SVG user units (not CSS px) */}
        <line x1={SX0} y1={SY0} x2={SX0} y2={SY0 + SH}
          stroke="rgba(255,255,255,0.38)" strokeWidth="0.8"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 400,0; 400,0; 0,0"
            keyTimes="0; 0.38; 0.42; 0.44"
            dur="9s"
            repeatCount="indefinite"
            calcMode="linear"
          />
          <animate
            attributeName="opacity"
            values="0; 0; 0.38; 0.38; 0; 0"
            keyTimes="0; 0.01; 0.04; 0.38; 0.42; 1"
            dur="9s"
            repeatCount="indefinite"
          />
        </line>

        {/* Bar border */}
        <rect x={SX0} y={SY0} width={SX1 - SX0} height={SH}
          stroke="var(--oc-green-border-dim)" strokeWidth="0.8" fill="none"
          className="es-spec-frame" />

        {/* ── Wavelength scale ─────────────────────────────────────────────── */}
        {SCALE_NMS.map(nm => (
          <g key={nm}>
            <line
              x1={nmToX(nm)} y1={SY0 + SH}
              x2={nmToX(nm)} y2={SY0 + SH + 5}
              stroke="var(--oc-green-dim)" strokeWidth="0.8" opacity="0.45"
            />
            <text
              x={nmToX(nm)} y={SY0 + SH + 15}
              textAnchor="middle"
              fill="var(--oc-text-hint)" fontSize="7" fontFamily="monospace"
              className="es-text-hint" opacity="0.55"
            >
              {nm}
            </text>
          </g>
        ))}

        {/* ── Labeled line annotations ─────────────────────────────────────── */}
        <g style={fade}>
          {labeledLines.map((line, i) => {
            const x   = nmToX(line.nm);
            const c   = wlToColor(line.nm);
            const y0  = SY0 + SH + 22;
            return (
              <g key={i}>
                <line x1={x} y1={y0} x2={x} y2={y0 + 6}
                  stroke={c} strokeWidth="0.8" opacity="0.55" />
                <circle cx={x} cy={y0 + 9} r="2" fill={c} opacity="0.7" />
                <text x={x} y={y0 + 21} textAnchor="middle"
                  fill={c} fontSize="8" fontFamily="monospace" opacity="0.9"
                >
                  {line.label}
                </text>
                <text x={x} y={y0 + 32} textAnchor="middle"
                  fill="var(--oc-text-hint)" fontSize="7" fontFamily="monospace"
                  className="es-text-hint" opacity="0.5"
                >
                  {line.nm.toFixed(1)}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Bottom caption ───────────────────────────────────────────────── */}
        <text x="50" y="518"
          fill="var(--oc-green-dim)" fontSize="7" fontFamily="monospace" letterSpacing="4"
          className="es-text-green" opacity="0.4"
        >
          ATOMIC EMISSION SPECTROSCOPY
        </text>
        <text x="450" y="518" textAnchor="end"
          fill="var(--oc-green)" fontSize="7" fontFamily="monospace"
          opacity="0.5" className="es-ticker"
        >
          ■
        </text>
      </svg>
    </div>
  );
}
