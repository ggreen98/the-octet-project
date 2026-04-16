"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

type SubshellType = "s" | "p" | "d" | "f";

const ROWS: { type: SubshellType; color: string; orbs: string; max: string; found: string }[] = [
  { type: "s", color: "#4499ff", orbs: "1", max: "2",  found: "Every shell"    },
  { type: "p", color: "#a855f7", orbs: "3", max: "6",  found: "Shell 2 onward" },
  { type: "d", color: "#f5a623", orbs: "5", max: "10", found: "Shell 3 onward" },
  { type: "f", color: "#72b872", orbs: "7", max: "14", found: "Shell 4 onward" },
];

type OrbTab = { id: string; label: string; orbCount: number; electrons: number; desc: string };

const ORB_TABS: Record<SubshellType, OrbTab[]> = {
  s: [
    { id: "s",     label: "s",       orbCount: 1, electrons: 2,  desc: "Spherically symmetric — equal probability in all directions" },
  ],
  p: [
    { id: "all",   label: "all",    orbCount: 3, electrons: 6,  desc: "All 3 p orbitals shown together — identical shape, three perpendicular orientations" },
    { id: "px",    label: "px",     orbCount: 1, electrons: 2,  desc: "Two lobes along the x-axis (horizontal)" },
    { id: "py",    label: "py",     orbCount: 1, electrons: 2,  desc: "Two lobes along the y-axis (vertical)" },
    { id: "pz",    label: "pz",     orbCount: 1, electrons: 2,  desc: "Two lobes along the z-axis (into/out of page)" },
  ],
  d: [
    { id: "all",   label: "all",    orbCount: 5, electrons: 10, desc: "All 5 d orbitals — four cloverleafs in a plane, plus dz² with two lobes and a ring" },
    { id: "dx2y2", label: "dx\u00B2-y\u00B2", orbCount: 1, electrons: 2, desc: "Four lobes pointing directly along the ±x and ±y axes" },
    { id: "dxy",   label: "dxy",    orbCount: 1, electrons: 2,  desc: "Four lobes between the x and y axes, rotated 45° from dx²-y²" },
    { id: "dz2",   label: "dz\u00B2",          orbCount: 1, electrons: 2, desc: "Two large lobes along the z-axis plus a toroidal ring in the xy-plane" },
  ],
  f: [
    { id: "all",   label: "all",     orbCount: 7, electrons: 14, desc: "Seven highly complex orientations — f subshells fill during the lanthanide and actinide series" },
  ],
};

// ── 2D SVG diagrams ───────────────────────────────────────────────────────────

function AxisLabel({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize="7" fill={color} opacity="0.65" fontFamily="monospace">{text}</text>
  );
}

function Orbital2D({ type, orbId, color }: { type: SubshellType; orbId: string; color: string }) {
  if (type === "s") {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
        <circle cx="50" cy="50" r="34" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.9" />
      </svg>
    );
  }

  if (type === "p") {
    if (orbId === "px") return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
        {/* Axis */}
        <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <AxisLabel x={50} y={8} text="y" color={color} />
        <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <AxisLabel x={93} y={53} text="x" color={color} />
        {/* Lobes */}
        <ellipse cx="24" cy="50" rx="22" ry="14" fill={`${color}28`} stroke={color} strokeWidth="1.4" />
        <ellipse cx="76" cy="50" rx="22" ry="14" fill={`${color}38`} stroke={color} strokeWidth="1.4" />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.9" />
      </svg>
    );
    if (orbId === "py") return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
        <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <AxisLabel x={93} y={53} text="x" color={color} />
        <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <AxisLabel x={50} y={8} text="y" color={color} />
        <ellipse cx="50" cy="24" rx="14" ry="22" fill={`${color}28`} stroke={color} strokeWidth="1.4" />
        <ellipse cx="50" cy="76" rx="14" ry="22" fill={`${color}38`} stroke={color} strokeWidth="1.4" />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.9" />
      </svg>
    );
    if (orbId === "pz") return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
        <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <AxisLabel x={50} y={8} text="z" color={color} />
        <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <ellipse cx="50" cy="24" rx="14" ry="22" fill={`${color}28`} stroke={color} strokeWidth="1.4" />
        <ellipse cx="50" cy="76" rx="14" ry="22" fill={`${color}38`} stroke={color} strokeWidth="1.4" />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.9" />
        {/* "into / out of page" indicator */}
        <text x="82" y="53" textAnchor="middle" fontSize="8" fill={color} opacity="0.5">•</text>
        <text x="18" y="53" textAnchor="middle" fontSize="7" fill={color} opacity="0.5">×</text>
      </svg>
    );
    // "all" — all 3 orbitals overlaid
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
        <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="3 3" />
        <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="3 3" />
        <ellipse cx="50" cy="24" rx="13" ry="20" fill={`${color}12`} stroke={color} strokeWidth="1.1" />
        <ellipse cx="50" cy="76" rx="13" ry="20" fill={`${color}12`} stroke={color} strokeWidth="1.1" />
        <ellipse cx="24" cy="50" rx="20" ry="13" fill={`${color}12`} stroke={color} strokeWidth="1.1" />
        <ellipse cx="76" cy="50" rx="20" ry="13" fill={`${color}12`} stroke={color} strokeWidth="1.1" />
        <circle cx="50" cy="50" r="16" fill={`${color}0c`} stroke={color} strokeWidth="1" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.9" />
      </svg>
    );
  }

  if (type === "d") {
    if (orbId === "dx2y2") return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
        <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <AxisLabel x={93} y={53} text="x" color={color} />
        <AxisLabel x={50} y={8} text="y" color={color} />
        <ellipse cx="50" cy="21" rx="12" ry="19" fill={`${color}28`} stroke={color} strokeWidth="1.4" />
        <ellipse cx="50" cy="79" rx="12" ry="19" fill={`${color}38`} stroke={color} strokeWidth="1.4" />
        <ellipse cx="21" cy="50" rx="19" ry="12" fill={`${color}28`} stroke={color} strokeWidth="1.4" />
        <ellipse cx="79" cy="50" rx="19" ry="12" fill={`${color}38`} stroke={color} strokeWidth="1.4" />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.9" />
      </svg>
    );
    if (orbId === "dxy") return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
        {/* 45° diagonal axes */}
        <line x1="15" y1="15" x2="85" y2="85" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <line x1="85" y1="15" x2="15" y2="85" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        {/* Four lobes rotated 45° */}
        <ellipse cx="50" cy="21" rx="12" ry="19" fill={`${color}28`} stroke={color} strokeWidth="1.4" transform="rotate(45 50 50)" />
        <ellipse cx="50" cy="79" rx="12" ry="19" fill={`${color}38`} stroke={color} strokeWidth="1.4" transform="rotate(45 50 50)" />
        <ellipse cx="21" cy="50" rx="19" ry="12" fill={`${color}28`} stroke={color} strokeWidth="1.4" transform="rotate(45 50 50)" />
        <ellipse cx="79" cy="50" rx="19" ry="12" fill={`${color}38`} stroke={color} strokeWidth="1.4" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.9" />
      </svg>
    );
    if (orbId === "dz2") return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
        <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
        <AxisLabel x={50} y={8} text="z" color={color} />
        {/* Two vertical lobes */}
        <ellipse cx="50" cy="19" rx="11" ry="18" fill={`${color}28`} stroke={color} strokeWidth="1.4" />
        <ellipse cx="50" cy="81" rx="11" ry="18" fill={`${color}38`} stroke={color} strokeWidth="1.4" />
        {/* Toroidal ring — shown as horizontal oval with dashes */}
        <ellipse cx="50" cy="50" rx="22" ry="7" fill={`${color}18`} stroke={color} strokeWidth="1.2" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.9" />
      </svg>
    );
    // all d — 8 cloverleaf lobes (dx²-y² + dxy) + dz² (vertical lobes + ring)
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
        <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="3 3" />
        <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="3 3" />
        {/* dx²-y²: 4 lobes along ±x and ±y axes */}
        <ellipse cx="50" cy="20" rx="10" ry="17" fill={`${color}16`} stroke={color} strokeWidth="1.1" />
        <ellipse cx="50" cy="80" rx="10" ry="17" fill={`${color}16`} stroke={color} strokeWidth="1.1" />
        <ellipse cx="20" cy="50" rx="17" ry="10" fill={`${color}16`} stroke={color} strokeWidth="1.1" />
        <ellipse cx="80" cy="50" rx="17" ry="10" fill={`${color}16`} stroke={color} strokeWidth="1.1" />
        {/* dxy: 4 lobes at 45° */}
        <ellipse cx="50" cy="20" rx="10" ry="17" fill={`${color}10`} stroke={color} strokeWidth="1.0" transform="rotate(45 50 50)" />
        <ellipse cx="50" cy="80" rx="10" ry="17" fill={`${color}10`} stroke={color} strokeWidth="1.0" transform="rotate(45 50 50)" />
        <ellipse cx="20" cy="50" rx="17" ry="10" fill={`${color}10`} stroke={color} strokeWidth="1.0" transform="rotate(45 50 50)" />
        <ellipse cx="80" cy="50" rx="17" ry="10" fill={`${color}10`} stroke={color} strokeWidth="1.0" transform="rotate(45 50 50)" />
        {/* dz²: toroidal ring (horizontal oval, dashed) */}
        <ellipse cx="50" cy="50" rx="18" ry="6" fill={`${color}18`} stroke={color} strokeWidth="1.1" strokeDasharray="3 2" />
        {/* dz²: two vertical lobes (narrow, front-on view) */}
        <ellipse cx="50" cy="26" rx="5" ry="9" fill={`${color}20`} stroke={color} strokeWidth="1.1" />
        <ellipse cx="50" cy="74" rx="5" ry="9" fill={`${color}20`} stroke={color} strokeWidth="1.1" />
        <circle cx="50" cy="50" r="3" fill={color} opacity="0.9" />
      </svg>
    );
  }

  // f orbital
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx="50" cy="27" rx="6.5" ry="19"
          fill={i % 2 === 0 ? `${color}20` : `${color}30`}
          stroke={color}
          strokeWidth="1.1"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="3" fill={color} opacity="0.9" />
    </svg>
  );
}

// ── 3D orbital components ─────────────────────────────────────────────────────

function Lobe3D({ color, size = 1, opacity = 0.70 }: { color: string; size?: number; opacity?: number }) {
  return (
    <mesh position={[0, size * 0.52, 0]} scale={[size * 0.44, size * 0.60, size * 0.44]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial
        color={color} emissive={color} emissiveIntensity={0.22}
        transparent opacity={opacity} roughness={0.07} depthWrite={false}
      />
    </mesh>
  );
}

function Dumbbell3D({ color, size = 1 }: { color: string; size?: number }) {
  return (
    <>
      <Lobe3D color={color} size={size} opacity={0.74} />
      <group rotation={[Math.PI, 0, 0]}><Lobe3D color={color} size={size} opacity={0.56} /></group>
    </>
  );
}

function SOrbital3D({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current)
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.14 + 0.07 * Math.sin(clock.elapsedTime * 1.4);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.1, 48, 48]} />
      <meshStandardMaterial
        color={color} emissive={color} emissiveIntensity={0.14}
        transparent opacity={0.62} roughness={0.06} depthWrite={false}
      />
    </mesh>
  );
}

function POrbital3D({ color, orbId }: { color: string; orbId: string }) {
  if (orbId === "px") return (
    <group rotation={[0, 0, Math.PI / 2]}><Dumbbell3D color={color} /></group>
  );
  if (orbId === "py") return <Dumbbell3D color={color} />;
  if (orbId === "pz") return (
    <group rotation={[Math.PI / 2, 0, 0]}><Dumbbell3D color={color} /></group>
  );
  return (
    <group>
      <Dumbbell3D color={color} />
      <group rotation={[0, 0, Math.PI / 2]}><Dumbbell3D color={color} /></group>
      <group rotation={[Math.PI / 2, 0, 0]}><Dumbbell3D color={color} /></group>
    </group>
  );
}

function DOrbital3D({ color, orbId }: { color: string; orbId: string }) {
  if (orbId === "dx2y2") return (
    <group>
      <group rotation={[0, 0, Math.PI / 2]}><Dumbbell3D color={color} /></group>
      <group rotation={[Math.PI / 2, 0, 0]}><Dumbbell3D color={color} /></group>
    </group>
  );
  if (orbId === "dxy") return (
    <group rotation={[0, Math.PI / 4, 0]}>
      <group rotation={[0, 0, Math.PI / 2]}><Dumbbell3D color={color} /></group>
      <group rotation={[Math.PI / 2, 0, 0]}><Dumbbell3D color={color} /></group>
    </group>
  );
  if (orbId === "dz2") return (
    <group>
      <Dumbbell3D color={color} />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.18, 12, 48]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={0.2}
          transparent opacity={0.45} roughness={0.08} depthWrite={false}
        />
      </mesh>
    </group>
  );
  // all: dx²-y² + dxy (8 horizontal lobes) + dz² (vertical lobes + torus)
  return (
    <group>
      {/* dx²-y²: 4 lobes in horizontal (xz) plane */}
      <group rotation={[0, 0, Math.PI / 2]}><Dumbbell3D color={color} size={0.88} /></group>
      <group rotation={[Math.PI / 2, 0, 0]}><Dumbbell3D color={color} size={0.88} /></group>
      {/* dxy: 4 lobes at 45° in horizontal plane */}
      <group rotation={[0, Math.PI / 4, 0]}>
        <group rotation={[0, 0, Math.PI / 2]}><Dumbbell3D color={color} size={0.88} /></group>
        <group rotation={[Math.PI / 2, 0, 0]}><Dumbbell3D color={color} size={0.88} /></group>
      </group>
      {/* dz²: 2 vertical lobes along ±y + toroidal ring in xz plane */}
      <Dumbbell3D color={color} size={0.88} />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.60, 0.15, 12, 48]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={0.2}
          transparent opacity={0.40} roughness={0.08} depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function FOrbital3D({ color }: { color: string }) {
  const orientations = useMemo((): [number, number, number, number][] => {
    const up = new THREE.Vector3(0, 1, 0);
    const corners: [number, number, number][] = [
      [1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1],
    ];
    return corners.map(([x,y,z]) => {
      const q = new THREE.Quaternion().setFromUnitVectors(up, new THREE.Vector3(x,y,z).normalize());
      return [q.x, q.y, q.z, q.w];
    });
  }, []);
  return (
    <group>
      {orientations.map((q, i) => (
        <group key={i} quaternion={q}>
          <Lobe3D color={color} size={0.65} opacity={i % 2 === 0 ? 0.74 : 0.56} />
        </group>
      ))}
    </group>
  );
}

function OrbitalScene3D({ type, orbId, color }: { type: SubshellType; orbId: string; color: string }) {
  const masterRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (masterRef.current) masterRef.current.rotation.y = clock.elapsedTime * 0.10;
  });
  return (
    <>
      <ambientLight intensity={0.07} />
      <pointLight position={[4, 5, 4]} intensity={1.5} color="#ffffff" decay={2} />
      <pointLight position={[-3, -2, -3]} intensity={0.5} color={color} decay={2} />
      <group ref={masterRef}>
        {type === "s" && <SOrbital3D color={color} />}
        {type === "p" && <POrbital3D color={color} orbId={orbId} />}
        {type === "d" && <DOrbital3D color={color} orbId={orbId} />}
        {type === "f" && <FOrbital3D color={color} />}
      </group>
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.45} />
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function SubshellTable() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [orbId, setOrbId] = useState("s");
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => { setMounted(true); }, []);

  const row = ROWS[selectedIndex];
  const tabs = ORB_TABS[row.type];
  const currentTab = tabs.find(t => t.id === orbId) ?? tabs[0];

  function selectRow(i: number) {
    if (i === selectedIndex) return;
    setSelectedIndex(i);
    setOrbId(ORB_TABS[ROWS[i].type][0].id);
  }

  const panelBg = isLight ? "rgba(240,237,230,0.4)" : "rgba(1,13,10,0.45)";
  const panelBorder = isLight ? `${row.color}55` : `${row.color}33`;

  return (
    <div className="mb-6 flex flex-col lg:flex-row gap-3" style={{ maxWidth: "780px" }}>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div
        style={{
          flex: "1 1 auto",
          border: "1px solid var(--oc-green-border-dim)",
          borderRadius: "4px",
          overflow: "hidden",
          alignSelf: "flex-start",
        }}
      >
        {/* Header */}
        <div
          className="grid font-heading text-xs px-4 py-2"
          style={{
            gridTemplateColumns: "0.5fr 1fr 0.9fr 1.4fr",
            background: "var(--oc-green-badge)",
            color: "var(--oc-green)",
            letterSpacing: "0.12em",
            borderBottom: "1px solid var(--oc-green-border-dim)",
          }}
        >
          <span>TYPE</span>
          <span>ORBITALS</span>
          <span>MAX e⁻</span>
          <span>FOUND IN</span>
        </div>

        {/* Rows */}
        {ROWS.map(({ type, color, orbs, max, found }, i) => {
          const isSelected = selectedIndex === i;
          const isHovered  = hoveredIndex === i;
          return (
            <div
              key={type}
              className="grid text-sm px-4 py-3 cursor-pointer"
              style={{
                gridTemplateColumns: "0.5fr 1fr 0.9fr 1.4fr",
                color: isSelected ? "var(--oc-text)" : "var(--oc-text-muted)",
                borderBottom: i < 3 ? "1px solid var(--oc-green-border-faint)" : "none",
                borderLeft: isSelected ? `2px solid ${color}` : "2px solid transparent",
                background: isSelected
                  ? `${color}14`
                  : isHovered
                  ? `${color}0a`
                  : i % 2 === 0
                  ? "var(--oc-green-bg-surface)"
                  : "transparent",
                transition: "background 0.15s ease, border-color 0.15s ease",
              }}
              onClick={() => selectRow(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="font-heading" style={{ color }}>{type}</span>
              <span>{orbs}</span>
              <span style={{ color: isSelected ? "var(--oc-text-dim)" : undefined }}>{max}</span>
              <span>{found}</span>
            </div>
          );
        })}
      </div>

      {/* ── Shape panel ────────────────────────────────────────────── */}
      <div
        style={{
          width: "290px",
          flexShrink: 0,
          border: `1px solid ${panelBorder}`,
          borderRadius: "4px",
          overflow: "hidden",
          background: panelBg,
          display: "flex",
          flexDirection: "column",
          transition: "border-color 0.2s ease",
        }}
      >
        {/* Controls row: 2D/3D toggle */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderBottom: `1px solid ${row.color}22` }}
        >
          <span className="font-heading" style={{ fontSize: "0.8rem", color: row.color, letterSpacing: "0.1em" }}>
            {row.type.toUpperCase()} ORBITAL
          </span>
          <div className="flex" style={{ border: `1px solid ${row.color}33`, borderRadius: "3px", overflow: "hidden" }}>
            {(["2d", "3d"] as const).map(m => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className="font-heading"
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  padding: "4px 10px",
                  border: "none",
                  cursor: "pointer",
                  background: viewMode === m ? row.color : "transparent",
                  color: viewMode === m ? "#000" : row.color,
                  transition: "all 0.12s",
                }}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Orbital sub-tabs (only for p and d) */}
        {tabs.length > 1 && (
          <div
            className="flex"
            style={{ borderBottom: `1px solid ${row.color}22`, overflowX: "auto" }}
          >
            {tabs.map(tab => {
              const active = orbId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setOrbId(tab.id)}
                  className="font-heading"
                  style={{
                    flex: "1 1 auto",
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                    padding: "6px 4px",
                    border: "none",
                    borderBottom: active ? `2px solid ${row.color}` : "2px solid transparent",
                    background: active ? `${row.color}18` : "transparent",
                    color: active ? row.color : "var(--oc-text-dim)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.12s",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Electron count badge */}
        <div className="px-3 pt-2 pb-0 flex items-center gap-2">
          <span
            className="font-heading"
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.1em",
              color: row.color,
              background: `${row.color}15`,
              border: `1px solid ${row.color}33`,
              borderRadius: "3px",
              padding: "3px 8px",
            }}
          >
            {currentTab.orbCount === 1
              ? `1 orbital · 2 electrons (↑↓)`
              : `${currentTab.orbCount} orbitals · ${currentTab.electrons} electrons`}
          </span>
        </div>

        {/* Diagram */}
        <div style={{ flex: "1 1 auto", padding: "6px 12px 0", minHeight: "180px" }}>
          {viewMode === "2d" ? (
            <Orbital2D type={row.type} orbId={orbId} color={row.color} />
          ) : (
            mounted ? (
              <Canvas
                camera={{ position: [2.4, 1.6, 2.9], fov: 48 }}
                style={{ background: "transparent", height: "190px" }}
                gl={{ antialias: true, alpha: true }}
              >
                <OrbitalScene3D type={row.type} orbId={orbId} color={row.color} />
              </Canvas>
            ) : (
              <div style={{ height: "190px" }} />
            )
          )}
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--oc-text-muted)",
            lineHeight: 1.6,
            padding: "6px 12px 12px",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {currentTab.desc}
        </p>

        <p
          className="font-heading text-center pb-2"
          style={{ fontSize: "0.58rem", color: "var(--oc-text-hint)", letterSpacing: "0.06em" }}
        >
          {viewMode === "3d" ? "drag to rotate · auto-rotating" : "click row to change · switch to 3D"}
        </p>
      </div>

    </div>
  );
}
