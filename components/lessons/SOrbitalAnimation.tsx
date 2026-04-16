"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ── Types & constants ──────────────────────────────────────────────────────────

type OrbType = "s" | "p" | "d" | "f";

const MAX_TRAIL     = 900;
const MAX_ELECTRONS = 4;
const ORBITAL_R     = 1.15;

const ELEC_HEX = ["#4499ff", "#6ab8ff", "#88ccff", "#aaddff"] as const;
const ELEC_CLR = ELEC_HEX.map(h => new THREE.Color(h));

const ELEC_COUNT: Record<OrbType, number> = { s: 2, p: 2, d: 2, f: 2 };

const TYPE_COLORS: Record<OrbType, string> = {
  s: "#4499ff",
  p: "#a855f7",
  d: "#f5a623",
  f: "#72b872",
};

const ORB_LABEL: Record<OrbType, string> = { s: "1s", p: "2p", d: "3d", f: "4f" };

// ── Path helpers ──────────────────────────────────────────────────────────────

// Sweep an elongated ellipsoid whose long axis points radially from the origin
// toward the lobe centre (cx, cy, cz).  rAxial > rTrans gives the tapered,
// spiky-tip shape of a real orbital lobe.
function elongatedLobe(
  cx: number, cy: number, cz: number,
  rAxial: number, rTrans: number,
  t: number, freqA: number, freqB: number, phase: number,
): THREE.Vector3 {
  const len   = Math.sqrt(cx * cx + cy * cy + cz * cz);
  const alpha = t * freqA + phase;
  const beta  = t * freqB + phase * 0.75;
  const sinB  = Math.sin(beta), cosB = Math.cos(beta);
  const sinA  = Math.sin(alpha), cosA = Math.cos(alpha);

  if (len < 1e-5) {
    // Near nucleus during lobe transition — isotropic fallback
    return new THREE.Vector3(rTrans * sinB * cosA, rTrans * cosB, rTrans * sinB * sinA);
  }

  // Lobe-axis unit vector (radially outward from origin)
  const dx = cx / len, dy = cy / len, dz = cz / len;

  // Two perpendicular unit vectors (Gram-Schmidt against z-hat or x-hat)
  let ux: number, uy: number, uz: number;
  if (Math.abs(dz) < 0.85) {
    // cross(d, z) = (dy, -dx, 0)
    const uLen = Math.hypot(dx, dy);
    ux = dy / uLen; uy = -dx / uLen; uz = 0;
  } else {
    // cross(d, x) = (0, dz, -dy)
    const uLen = Math.hypot(dy, dz);
    ux = 0; uy = dz / uLen; uz = -dy / uLen;
  }
  // v = cross(d, u)  — already unit length
  const vx = dy * uz - dz * uy;
  const vy = dz * ux - dx * uz;
  const vz = dx * uy - dy * ux;

  const lA = rAxial * cosB;           // component along lobe axis
  const lU = rTrans * sinB * cosA;    // transverse 1
  const lV = rTrans * sinB * sinA;    // transverse 2

  return new THREE.Vector3(
    cx + lA * dx + lU * ux + lV * vx,
    cy + lA * dy + lU * uy + lV * vy,
    cz + lA * dz + lU * uz + lV * vz,
  );
}

// ── Electron paths ─────────────────────────────────────────────────────────────

function electronPos(orbType: OrbType, eIdx: number, t: number): THREE.Vector3 {
  switch (orbType) {
    case "s": {
      // Full-sphere precessing path (two incommensurable frequencies)
      const off   = eIdx === 0 ? 0 : Math.PI;
      const theta = t * 5.0 + off;
      const phi   = t * 1.61803 + off;
      return new THREE.Vector3(
        ORBITAL_R * Math.sin(phi) * Math.cos(theta),
        ORBITAL_R * Math.cos(phi),
        ORBITAL_R * Math.sin(phi) * Math.sin(theta),
      );
    }
    case "p": {
      // Both electrons share BOTH lobes — physically correct.
      // tanh(k·sin) oscillation sends each electron through the full dumbbell;
      // the π offset means they're usually in opposite lobes at low speed.
      const offset = eIdx * Math.PI;
      const cy     = Math.tanh(5.0 * Math.sin(t * 0.95 + offset)) * 0.74;
      const alpha  = t * 5.2 + offset;
      const beta   = t * 1.61803 * 0.97 + offset * 0.6;
      // Elongated ellipsoid: tall along y (lobe axis), narrow in xz
      return new THREE.Vector3(
        0.33 * Math.sin(beta) * Math.cos(alpha),
        cy + 0.58 * Math.cos(beta),
        0.33 * Math.sin(beta) * Math.sin(alpha),
      );
    }
    case "d": {
      // 2 electrons, each oscillating between 2 opposite equatorial lobes (tanh).
      // Together they cover all 4 lobes of the cloverleaf.
      // Electron 0: 45° ↔ 225°   |   Electron 1: 135° ↔ 315°
      const baseAng = eIdx * (Math.PI / 2) + Math.PI / 4;
      const fac     = Math.tanh(4.5 * Math.sin(t * 1.35 + eIdx * (Math.PI / 2)));
      const cx      = Math.cos(baseAng) * 0.68 * fac;
      const cz      = Math.sin(baseAng) * 0.68 * fac;
      // Elongated radially, very flat vertically (disk-like d orbital)
      const raw     = elongatedLobe(cx, 0, cz, 0.54, 0.34, t, 5.3, 1.61803 * 0.92, eIdx * 1.1);
      raw.y *= 0.28;
      return raw;
    }
    case "f": {
      // 8-lobe octant arrangement: 2 electrons, each with independently-
      // oscillating tanh on all 3 axes.  Incommensurable frequencies ensure
      // each electron visits all 8 octants → 8 pointed lobes total.
      // The transition paths through the nucleus are hidden by off-screen
      // parking (lobeW fading in the trail loop below).
      const offset    = eIdx * Math.PI;
      const INV_SQRT3 = 0.57735;                  // 1/√3
      const dist      = 0.73;
      const cx = Math.tanh(5.2 * Math.sin(t * 1.10 + offset))        * INV_SQRT3 * dist;
      const cy = Math.tanh(5.2 * Math.sin(t * 0.73 + offset * 0.62)) * INV_SQRT3 * dist;
      const cz = Math.tanh(5.2 * Math.sin(t * 0.89 + offset * 0.81)) * INV_SQRT3 * dist;
      return elongatedLobe(cx, cy, cz, 0.50, 0.28, t, 5.1, 1.61803 * 0.89, eIdx * 1.4 + 0.7);
    }
  }
}

function trailLen(speed: number): number {
  return Math.min(MAX_TRAIL, Math.max(6, Math.floor(speed * speed * 7)));
}

// ── 3D scene ──────────────────────────────────────────────────────────────────

function OrbitalScene({
  speed, paused, orbType,
}: {
  speed: number; paused: boolean; orbType: OrbType;
}) {
  // Four electron head refs — always created; only rendered as needed
  const e0Ref = useRef<THREE.Mesh>(null);
  const e1Ref = useRef<THREE.Mesh>(null);
  const e2Ref = useRef<THREE.Mesh>(null);
  const e3Ref = useRef<THREE.Mesh>(null);
  const eRefs = [e0Ref, e1Ref, e2Ref, e3Ref];

  const timeRef = useRef(0);

  // Flat Float32Arrays — mutated in place each frame
  const posArr = useMemo(() => {
    const a = new Float32Array(MAX_TRAIL * MAX_ELECTRONS * 3);
    for (let i = 0; i < MAX_TRAIL * MAX_ELECTRONS; i++) a[i * 3 + 1] = 9999;
    return a;
  }, []);
  const colArr = useMemo(() => new Float32Array(MAX_TRAIL * MAX_ELECTRONS * 3), []);

  // Per-electron ring buffers
  const rbs    = useRef([
    new Float32Array(MAX_TRAIL * 3),
    new Float32Array(MAX_TRAIL * 3),
    new Float32Array(MAX_TRAIL * 3),
    new Float32Array(MAX_TRAIL * 3),
  ]);
  const rbLens = useRef([0, 0, 0, 0]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(posArr, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute("color",    new THREE.BufferAttribute(colArr, 3).setUsage(THREE.DynamicDrawUsage));
    return g;
  }, [posArr, colArr]);

  const mat = useMemo(() => new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    sizeAttenuation: true,
  }), []);

  const pointsObj = useMemo(() => {
    const p = new THREE.Points(geo, mat);
    p.frustumCulled = false;
    return p;
  }, [geo, mat]);

  // Reset when orbital type changes
  useEffect(() => {
    timeRef.current = 0;
    rbLens.current[0] = rbLens.current[1] = rbLens.current[2] = rbLens.current[3] = 0;
    for (let i = 0; i < MAX_TRAIL * MAX_ELECTRONS; i++) posArr[i * 3 + 1] = 9999;
    (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }, [orbType, posArr, geo]);

  useFrame((_, delta) => {
    if (paused) return;
    timeRef.current += delta * speed;
    const t    = timeRef.current;
    const N    = trailLen(speed);
    const numE = ELEC_COUNT[orbType];

    for (let e = 0; e < MAX_ELECTRONS; e++) {
      const base = e * MAX_TRAIL;

      if (e >= numE) {
        // Park unused electron trail points off-screen
        for (let i = 0; i < MAX_TRAIL; i++) posArr[(base + i) * 3 + 1] = 9999;
        rbLens.current[e] = 0;
        continue;
      }

      const p  = electronPos(orbType, e, t);
      const rb = rbs.current[e];

      // Move head mesh
      const ref = eRefs[e];
      if (ref.current) ref.current.position.copy(p);

      // Shift ring buffer (fast memmove via copyWithin)
      const copy = Math.min(rbLens.current[e], N - 1) * 3;
      if (copy > 0) rb.copyWithin(3, 0, copy);
      rb[0] = p.x; rb[1] = p.y; rb[2] = p.z;
      rbLens.current[e] = Math.min(N, rbLens.current[e] + 1);

      // Write fading trail into Points buffer.
      // For p and d, apply a spatial "lobe weight" so the transition zone
      // between lobes is completely invisible.  When lobeW == 0 we park the
      // point off-screen (y=9999) — just setting color to black still renders
      // a visible dark square, so off-screen parking is the only true fix.
      const c = ELEC_CLR[e];
      for (let i = 0; i < MAX_TRAIL; i++) {
        const pi = (base + i) * 3;
        const si = i * 3;
        if (i < rbLens.current[e]) {
          const tx = rb[si], ty = rb[si+1], tz = rb[si+2];

          // Lobe weight: 0 in the transition zone, 1 fully inside a lobe.
          let lobeW = 1.0;
          if (orbType === "p") {
            lobeW = Math.max(0, Math.min(1, (Math.abs(ty) - 0.18) / 0.34));
          } else if (orbType === "d") {
            lobeW = Math.max(0, Math.min(1, (Math.sqrt(tx*tx + tz*tz) - 0.18) / 0.34));
          } else if (orbType === "f") {
            // f has 8 lobes at octant corners — require BOTH minimum radius
            // AND octant alignment (|x·y·z| / r³ peaks at octant corners, is 0
            // on any nodal plane).  Either criterion alone is not selective enough.
            const r2  = tx*tx + ty*ty + tz*tz;
            const r   = Math.sqrt(r2);
            const r3  = r2 * r;
            const radialW  = Math.max(0, Math.min(1, (r - 0.22) / 0.28));
            const octantW  = r3 > 1e-6
              ? Math.max(0, Math.min(1, (Math.abs(tx * ty * tz) / r3 - 0.07) / 0.09))
              : 0;
            lobeW = Math.min(radialW, octantW);
          }

          if (lobeW < 0.001) {
            // Completely invisible — park off-screen so no dark square renders
            posArr[pi] = 0; posArr[pi+1] = 9999; posArr[pi+2] = 0;
            colArr[pi] = 0; colArr[pi+1] = 0;    colArr[pi+2] = 0;
          } else {
            posArr[pi]   = tx; posArr[pi+1] = ty; posArr[pi+2] = tz;
            const fade   = Math.pow(1 - i / N, 0.5) * lobeW;
            colArr[pi]   = c.r * fade;
            colArr[pi+1] = c.g * fade;
            colArr[pi+2] = c.b * fade;
          }
        } else {
          posArr[pi]   = 0; posArr[pi+1] = 9999; posArr[pi+2] = 0;
          colArr[pi]   = 0; colArr[pi+1] = 0;    colArr[pi+2] = 0;
        }
      }
    }

    (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (geo.attributes.color    as THREE.BufferAttribute).needsUpdate = true;
    mat.size = 0.038 + speed * 0.008;
  });

  const numE        = ELEC_COUNT[orbType];
  const headOpacity = Math.max(0, Math.min(1, 1 - (speed - 5) / 4));

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[4, 5, 4]} intensity={1.4} color="#ffffff" decay={2} />
      <pointLight position={[-3, -2, -3]} intensity={0.5} color="#4499ff" decay={2} />

      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshStandardMaterial color="#72b872" emissive="#72b872" emissiveIntensity={0.9} roughness={0.1} />
      </mesh>

      {/* Electron head dots (fade as speed rises) */}
      {headOpacity > 0.02 && Array.from({ length: numE }, (_, i) => (
        <mesh key={i} ref={eRefs[i]}>
          <sphereGeometry args={[0.068, 14, 14]} />
          <meshStandardMaterial
            color={ELEC_HEX[i]} emissive={ELEC_HEX[i]} emissiveIntensity={1.2}
            transparent opacity={headOpacity} depthWrite={false}
          />
        </mesh>
      ))}

      {/* Trail / probability cloud */}
      <primitive object={pointsObj} />

      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.45} />
    </>
  );
}

// ── Radial probability density chart ──────────────────────────────────────────

const R_MAX:  Record<OrbType, number> = { s: 7,  p: 18, d: 32, f: 50 };
const PEAK_R: Record<OrbType, number> = { s: 1,  p: 4,  d: 9,  f: 16 };

function computeP(orbType: OrbType, r: number): number {
  switch (orbType) {
    case "s": return r * r * Math.exp(-2 * r);
    case "p": return r ** 4 * Math.exp(-r);
    case "d": return r ** 6 * Math.exp(-(2 * r) / 3);
    case "f": return r ** 8 * Math.exp(-r / 2);
  }
}

function RadialProbChart({ orbType }: { orbType: OrbType }) {
  // Chart geometry
  const W     = 600, H = 150;
  const padL  = 48, padB = 32, padT = 34, padR = 52;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const rMax  = R_MAX[orbType];
  const peak  = PEAK_R[orbType];
  const color = TYPE_COLORS[orbType];
  const numPts = 200;

  let maxP = 0;
  for (let i = 0; i <= numPts; i++) {
    const p = computeP(orbType, (i / numPts) * rMax);
    if (p > maxP) maxP = p;
  }

  const pts = Array.from({ length: numPts + 1 }, (_, i) => {
    const r = (i / numPts) * rMax;
    const y = padT + plotH - (computeP(orbType, r) / maxP) * plotH * 0.9;
    return `${(padL + (r / rMax) * plotW).toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const fillPts = `${padL},${padT + plotH} ${pts} ${padL + plotW},${padT + plotH}`;
  const peakX   = padL + (peak / rMax) * plotW;
  const ticks   = [0, Math.round(rMax * 0.25), Math.round(rMax * 0.5), Math.round(rMax * 0.75), rMax];

  // Brief per-variable glossary rows shown below the chart
  const glossary = [
    { term: "P(r)", def: "Radial probability density — how likely you are to find the electron at distance r (taller peak = more likely)" },
    { term: "r",    def: "Distance from the nucleus" },
    { term: "a\u2080", def: "Bohr radius \u2248 0.529 \u00C5 — the natural length scale of an atom (most probable radius in hydrogen 1s)" },
    { term: "|\u03C8|\u00B2", def: "Electron probability density from the wave function; multiplied by r\u00B2 to account for spherical shell volume" },
  ];

  return (
    <div style={{ borderTop: "1px solid var(--oc-green-border-faint)", padding: "14px 16px 12px" }}>

      {/* Section heading */}
      <p className="font-heading" style={{ fontSize: "0.6rem", color: "var(--oc-text-dim)", letterSpacing: "0.14em", marginBottom: 2 }}>
        RADIAL PROBABILITY DENSITY &mdash; {ORB_LABEL[orbType]} ORBITAL
      </p>
      <p style={{ fontSize: "0.6rem", color: "var(--oc-text-hint)", marginBottom: 10, lineHeight: 1.5 }}>
        P(r) = r²|ψ|² &nbsp;&mdash;&nbsp; height of curve shows the probability of finding the electron at each distance from the nucleus
      </p>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", display: "block", overflow: "visible" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Curve fill */}
        <polygon points={fillPts} fill={color} opacity={0.1} />
        {/* Curve stroke */}
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.2" opacity={0.95} />
        {/* Peak dashed line */}
        <line x1={peakX} y1={padT - 8} x2={peakX} y2={padT + plotH}
          stroke={color} strokeWidth="1.2" strokeDasharray="4,3" opacity={0.5} />
        {/* Axes */}
        <line x1={padL} y1={padT - 4} x2={padL} y2={padT + plotH}
          stroke="var(--oc-text-hint)" strokeWidth="1" />
        <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH}
          stroke="var(--oc-text-hint)" strokeWidth="1" />
        {/* Arrow heads on axes */}
        <polygon points={`${padL},${padT - 4} ${padL - 3.5},${padT + 5} ${padL + 3.5},${padT + 5}`}
          fill="var(--oc-text-hint)" opacity={0.6} />
        <polygon points={`${padL + plotW},${padT + plotH} ${padL + plotW - 5},${padT + plotH - 3.5} ${padL + plotW - 5},${padT + plotH + 3.5}`}
          fill="var(--oc-text-hint)" opacity={0.6} />

        {/* Y-axis label — rotated */}
        <text
          x={padL - 14} y={padT + plotH / 2}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fill="var(--oc-text-muted)" fontFamily="inherit"
          transform={`rotate(-90, ${padL - 14}, ${padT + plotH / 2})`}
        >P(r)</text>

        {/* Y "0" tick */}
        <text x={padL - 6} y={padT + plotH} textAnchor="end" dominantBaseline="middle"
          fontSize="9.5" fill="var(--oc-text-hint)" fontFamily="inherit">0</text>

        {/* X-axis label */}
        <text x={padL + plotW + 8} y={padT + plotH}
          textAnchor="start" dominantBaseline="middle"
          fontSize="11" fill="var(--oc-text-muted)" fontFamily="inherit">r (a₀)</text>

        {/* Peak annotation */}
        <text x={peakX} y={padT - 14} textAnchor="middle"
          fontSize="10.5" fill={color} opacity={0.9} fontFamily="inherit" fontWeight="600">
          peak: {peak} a₀
        </text>
        <text x={peakX} y={padT - 4} textAnchor="middle"
          fontSize="8.5" fill={color} opacity={0.55} fontFamily="inherit">
          &#9660;
        </text>

        {/* X ticks */}
        {ticks.map(r => {
          const x = padL + (r / rMax) * plotW;
          return (
            <g key={r}>
              <line x1={x} y1={padT + plotH} x2={x} y2={padT + plotH + 5}
                stroke="var(--oc-text-hint)" strokeWidth="0.9" />
              <text x={x} y={padT + plotH + 16} textAnchor="middle"
                fontSize="10" fill="var(--oc-text-hint)" fontFamily="inherit">{r}</text>
            </g>
          );
        })}
      </svg>

      {/* Variable glossary */}
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
        {glossary.map(({ term, def }) => (
          <div key={term} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <span
              className="font-heading"
              style={{
                fontSize: "0.62rem", letterSpacing: "0.06em",
                color, flexShrink: 0, minWidth: "2.4rem",
              }}
            >
              {term}
            </span>
            <span style={{ fontSize: "0.6rem", color: "var(--oc-text-hint)", lineHeight: 1.5 }}>
              {def}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Status text ────────────────────────────────────────────────────────────────

function statusText(orbType: OrbType, speed: number, paused: boolean): { headline: string; body: string } {
  if (paused) return {
    headline: "Paused",
    body: "Drag the slider to explore at any speed, or resume auto-animation.",
  };

  const label = ORB_LABEL[orbType];
  const numE  = ELEC_COUNT[orbType];

  if (speed < 1.5) return {
    headline: `Two electrons in the ${label} orbital`,
    body: orbType === "s"
      ? "The 1s orbital holds exactly two electrons — one spin-up (↑), one spin-down (↓). At this speed you can watch them move."
      : orbType === "p"
      ? "Both electrons share the entire p orbital — either can be found in either lobe at any moment. One is spin-up (↑), the other spin-down (↓)."
      : orbType === "d"
      ? "Both electrons share the full d orbital. Each oscillates between two opposite lobes; together they trace the four-lobe cloverleaf."
      : "Both electrons share the full f orbital, each visiting all eight lobes over time via independent oscillations on every axis.",
  };

  if (speed < 4) return {
    headline: "Speed increasing — trails forming",
    body: "Faster motion means less certainty about where each electron is at any given moment.",
  };

  if (speed < 7.5) return {
    headline: "Position becoming uncertain\u2026",
    body: "The blur isn\u2019t just a visual effect. In quantum mechanics, a particle in motion genuinely doesn\u2019t have a single position \u2014 only a probability of being found somewhere.",
  };

  const shapeMap: Record<OrbType, string> = {
    s: "sphere",
    p: "two-lobed dumbbell",
    d: "four-lobed cloverleaf",
    f: "eight-lobe shape",
  };
  const speedFact = orbType === "s"
    ? " Electrons in hydrogen\u2019s 1s orbital travel at roughly 1% the speed of light \u2014 and in heavy elements like uranium, where electrons move even faster, relativistic corrections become measurable."
    : " At quantum speeds, electrons in atoms travel at a significant fraction of the speed of light. In heavy elements this causes real relativistic effects that shift orbital energies.";

  return {
    headline: `The ${label} orbital takes shape`,
    body: `At quantum speeds the electrons collectively trace a ${shapeMap[orbType]} with equal probability.\u2028${speedFact}`,
  };
}

// ── Main export ────────────────────────────────────────────────────────────────

export function SOrbitalAnimation() {
  const [orbType,  setOrbType]  = useState<OrbType>("s");
  const [speed,    setSpeed]    = useState(0.35);
  const [paused,   setPaused]   = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Reset animation when orbital type changes
  useEffect(() => {
    setSpeed(0.35);
    setAutoPlay(false);
    setPaused(false);
  }, [orbType]);

  // Auto-animate: ramp 0.35 → 15 over ~15 s
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      setSpeed(s => {
        if (s >= 15) { setAutoPlay(false); return 15; }
        return +(s + 0.08).toFixed(3);
      });
    }, 100);
    return () => clearInterval(id);
  }, [autoPlay]);

  function handleAuto() {
    setSpeed(0.35);
    setPaused(false);
    setAutoPlay(true);
  }
  function handleReset() {
    setAutoPlay(false);
    setPaused(false);
    setSpeed(0.35);
  }

  const { headline, body } = statusText(orbType, speed, paused);
  const speedPct  = ((speed - 0.3) / 14.7) * 100;
  const typeColor = TYPE_COLORS[orbType];
  const numE      = ELEC_COUNT[orbType];

  const legendItems = [
    { color: "#72b872", label: "nucleus" },
    ...Array.from({ length: numE }, (_, i) => ({
      color: ELEC_HEX[i],
      label: i === 0 ? "electron \u2191" : i === 1 ? "electron \u2193" : `electron ${i + 1}`,
    })),
  ];

  return (
    <div className="mb-16">
      <p
        className="font-heading text-xs mb-4"
        style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}
      >
        {`// INTERACTIVE \u2014 ORBITAL FORMATION ANIMATION`}
      </p>

      <div style={{
        border: "1px solid var(--oc-green-border-dim)",
        borderRadius: "4px",
        overflow: "hidden",
        maxWidth: "640px",
      }}>

        {/* ── Orbital type tabs ──────────────────────────── */}
        <div className="flex" style={{ borderBottom: "1px solid var(--oc-green-border-faint)" }}>
          {(["s", "p", "d", "f"] as OrbType[]).map(type => {
            const active = orbType === type;
            const tc     = TYPE_COLORS[type];
            return (
              <button
                key={type}
                onClick={() => setOrbType(type)}
                className="font-heading"
                style={{
                  flex: 1,
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  padding: "9px 4px",
                  border: "none",
                  borderBottom: active ? `2px solid ${tc}` : "2px solid transparent",
                  background: active ? `${tc}18` : "transparent",
                  color: active ? tc : "var(--oc-text-dim)",
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
              >
                {type} orbital
              </button>
            );
          })}
        </div>

        {/* ── 3D canvas ──────────────────────────────────── */}
        <div style={{ height: "340px", background: "rgba(1,10,8,0.92)", position: "relative" }}>
          {mounted && (
            <Canvas
              camera={{ position: [2.8, 1.8, 3.2], fov: 46 }}
              style={{ background: "transparent" }}
              gl={{ antialias: true, alpha: true }}
            >
              <OrbitalScene speed={paused ? 0 : speed} paused={paused} orbType={orbType} />
            </Canvas>
          )}

          {/* Speed + rotate hint */}
          <div style={{
            position: "absolute", top: 10, left: 12, right: 12,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="font-heading" style={{ fontSize: "0.5rem", letterSpacing: "0.14em", color: `${typeColor}99` }}>
                SPEED
              </span>
              <span className="font-heading" style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: typeColor }}>
                &times;{speed.toFixed(1)}
              </span>
            </div>
            <span className="font-heading" style={{ fontSize: "0.48rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.28)" }}>
              drag to rotate
            </span>
          </div>

          {/* Legend */}
          <div style={{
            position: "absolute", bottom: 10, right: 12,
            display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end",
          }}>
            {legendItems.map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span className="font-heading" style={{ fontSize: "0.45rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                  {label}
                </span>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Status text ────────────────────────────────── */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--oc-green-border-faint)",
          borderBottom: "1px solid var(--oc-green-border-faint)",
          minHeight: "72px",
        }}>
          <p className="font-heading mb-1" style={{ fontSize: "0.7rem", color: "var(--oc-text)", letterSpacing: "0.05em" }}>
            {headline}
          </p>
          <p style={{ fontSize: "0.65rem", color: "var(--oc-text-muted)", lineHeight: 1.6 }}>
            {body}
          </p>
        </div>

        {/* ── Controls ───────────────────────────────────── */}
        <div style={{ padding: "12px 16px", background: "var(--oc-green-bg-surface)" }}>

          {/* Speed slider */}
          <div className="flex items-center gap-3 mb-3">
            <span className="font-heading" style={{ fontSize: "0.48rem", color: "var(--oc-text-dim)", letterSpacing: "0.12em", flexShrink: 0 }}>
              SLOW
            </span>
            <div style={{ flex: 1, position: "relative", height: "20px", display: "flex", alignItems: "center" }}>
              <div style={{ width: "100%", height: "2px", background: "var(--oc-green-border-dim)", borderRadius: "1px", position: "absolute" }} />
              <div style={{ width: `${speedPct}%`, height: "2px", background: typeColor, borderRadius: "1px", position: "absolute" }} />
              <input
                type="range" min={0.3} max={15} step={0.1} value={speed}
                onChange={e => { setAutoPlay(false); setSpeed(+e.target.value); }}
                style={{ position: "absolute", width: "100%", opacity: 0, cursor: "pointer", height: "20px", margin: 0 }}
              />
              <div style={{
                position: "absolute",
                left: `calc(${speedPct}% - 6px)`,
                width: 12, height: 12,
                borderRadius: "50%",
                background: typeColor,
                border: "2px solid rgba(255,255,255,0.25)",
                pointerEvents: "none",
                boxShadow: `0 0 6px ${typeColor}88`,
              }} />
            </div>
            <span className="font-heading" style={{ fontSize: "0.48rem", color: "var(--oc-text-dim)", letterSpacing: "0.12em", flexShrink: 0 }}>
              FAST
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            {[
              { label: paused ? "\u25B6 RESUME" : "\u23F8 PAUSE",   onClick: () => { setAutoPlay(false); setPaused(p => !p); }, active: false },
              { label: "\u27F3 RESET",                               onClick: handleReset,                                        active: false },
              { label: autoPlay ? "\u25CF AUTO-PLAYING\u2026" : "\u25B7 AUTO-ANIMATE", onClick: handleAuto, active: autoPlay },
            ].map(({ label, onClick, active }) => (
              <button
                key={label}
                onClick={onClick}
                className="font-heading"
                style={{
                  fontSize: "0.5rem",
                  letterSpacing: "0.1em",
                  padding: "4px 10px",
                  border: `1px solid ${active ? typeColor : "var(--oc-green-border-dim)"}`,
                  background: active ? `${typeColor}20` : "transparent",
                  color: active ? typeColor : "var(--oc-text-dim)",
                  borderRadius: "3px",
                  cursor: "pointer",
                  transition: "all 0.12s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Radial probability density chart ───────────── */}
        <RadialProbChart orbType={orbType} />

        {/* ── Disclaimer ─────────────────────────────────── */}
        <div style={{ padding: "8px 16px", borderTop: "1px solid var(--oc-green-border-faint)" }}>
          <p
            className="font-heading"
            style={{ fontSize: "0.48rem", color: "var(--oc-text-hint)", letterSpacing: "0.08em", lineHeight: 1.7 }}
          >
            CONCEPTUAL MODEL &mdash; Real electrons don&apos;t follow classical orbits; the orbital represents
            a quantum mechanical probability distribution, not a physical path. This animation builds
            the intuition, not the exact physics.
          </p>
        </div>

      </div>
    </div>
  );
}
