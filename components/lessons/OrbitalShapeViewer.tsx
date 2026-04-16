"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

type OrbType = "s" | "p" | "d" | "f";

// ── Subshell color palette (matches the rest of the lesson) ───────────────────
const ORB_COLORS: Record<OrbType, string> = {
  s: "#4499ff",
  p: "#a855f7",
  d: "#f5a623",
  f: "#72b872",
};

const ORB_INFO: Record<OrbType, {
  orbitals: number; max: number; shape: string; desc: string;
}> = {
  s: {
    orbitals: 1, max: 2,
    shape: "Sphere",
    desc: "Spherically symmetric in every direction — electrons have equal probability anywhere around the nucleus. Larger principal quantum numbers (2s, 3s…) produce bigger spheres with radial nodes inside.",
  },
  p: {
    orbitals: 3, max: 6,
    shape: "Dumbbell × 3",
    desc: "Three dumbbells — px, py, pz — align along perpendicular x, y, and z axes. The two lobes of each dumbbell represent opposite phases of the wave function, not opposite charges.",
  },
  d: {
    orbitals: 5, max: 10,
    shape: "Cloverleaf × 4 + dz²",
    desc: "Four of the five d orbitals form four-lobed cloverleafs in a plane (shown: dx²−y²). The fifth, dz², has two large lobes along the z-axis plus a toroidal ring in the xy-plane.",
  },
  f: {
    orbitals: 7, max: 14,
    shape: "Complex × 7",
    desc: "Seven highly complex shapes. One common form (shown here) has eight lobes pointing toward the corners of a cube, with alternating wave function phases. f subshells fill during the lanthanide and actinide series.",
  },
};

// ── Single lobe: elongated sphere pointing along +y ───────────────────────────
function Lobe({ color, size = 1, opacity = 0.70 }: {
  color: string; size?: number; opacity?: number;
}) {
  return (
    <mesh
      position={[0, size * 0.52, 0]}
      scale={[size * 0.44, size * 0.60, size * 0.44]}
    >
      <sphereGeometry args={[1, 28, 28]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.22}
        transparent
        opacity={opacity}
        roughness={0.07}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Dumbbell: +lobe and −lobe along ±y ───────────────────────────────────────
function Dumbbell({ color, size = 1 }: { color: string; size?: number }) {
  return (
    <>
      <Lobe color={color} size={size} opacity={0.74} />
      <group rotation={[Math.PI, 0, 0]}>
        <Lobe color={color} size={size} opacity={0.56} />
      </group>
    </>
  );
}

// ── s orbital: animated translucent sphere ────────────────────────────────────
function SOrbital({ color }: { color: string }) {
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

// ── p orbital: all 3 dumbbells (6 lobes total along x, y, z) ─────────────────
function POrbital({ color }: { color: string }) {
  return (
    <group>
      {/* pz: lobes along ±y (default orientation) */}
      <Dumbbell color={color} />
      {/* px: lobes along ±x (rotate y→x) */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <Dumbbell color={color} />
      </group>
      {/* py: lobes along ±z (rotate y→z) */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Dumbbell color={color} />
      </group>
    </group>
  );
}

// ── d orbital: dx²−y² — 4 lobes in the horizontal (xz) plane ─────────────────
function DOrbital({ color }: { color: string }) {
  return (
    <group>
      {/* Two dumbbells at 90° to each other, both in the xz plane */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <Dumbbell color={color} />
      </group>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <Dumbbell color={color} />
      </group>
    </group>
  );
}

// ── f orbital: 8 lobes pointing toward cube corners ───────────────────────────
function FOrbital({ color }: { color: string }) {
  // Compute quaternions to orient each lobe toward its cube corner
  const orientations = useMemo((): [number, number, number, number][] => {
    const up = new THREE.Vector3(0, 1, 0);
    const corners: [number, number, number][] = [
      [ 1,  1,  1], [ 1,  1, -1], [ 1, -1,  1], [ 1, -1, -1],
      [-1,  1,  1], [-1,  1, -1], [-1, -1,  1], [-1, -1, -1],
    ];
    return corners.map(([x, y, z]) => {
      const q = new THREE.Quaternion().setFromUnitVectors(
        up,
        new THREE.Vector3(x, y, z).normalize(),
      );
      return [q.x, q.y, q.z, q.w];
    });
  }, []);

  return (
    <group>
      {orientations.map((q, i) => (
        <group key={i} quaternion={q}>
          <Lobe color={color} size={0.65} opacity={i % 2 === 0 ? 0.74 : 0.56} />
        </group>
      ))}
    </group>
  );
}

// ── Full R3F scene ────────────────────────────────────────────────────────────
function OrbitalScene({ type }: { type: OrbType }) {
  const masterRef = useRef<THREE.Group>(null);
  const color = ORB_COLORS[type];

  useFrame(({ clock }) => {
    if (masterRef.current)
      masterRef.current.rotation.y = clock.elapsedTime * 0.09;
  });

  return (
    <>
      <ambientLight intensity={0.07} />
      <pointLight position={[4, 5, 4]} intensity={1.5} color="#ffffff" decay={2} />
      <pointLight position={[-3, -2, -3]} intensity={0.5} color={color} decay={2} />
      <group ref={masterRef}>
        {type === "s" && <SOrbital color={color} />}
        {type === "p" && <POrbital color={color} />}
        {type === "d" && <DOrbital color={color} />}
        {type === "f" && <FOrbital color={color} />}
      </group>
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.4} />
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function OrbitalShapeViewer() {
  const [selected, setSelected] = useState<OrbType>("s");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const color = ORB_COLORS[selected];
  const info = ORB_INFO[selected];

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="mb-16">
      <p
        className="font-heading text-xs tracking-widest mb-4"
        style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}
      >
        {`// INTERACTIVE — ORBITAL SHAPE VIEWER`}
      </p>

      <div
        className="max-w-2xl"
        style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", overflow: "hidden" }}
      >
        {/* Tab row: s / p / d / f */}
        <div className="flex" style={{ borderBottom: "1px solid var(--oc-green-border-dim)" }}>
          {(["s", "p", "d", "f"] as OrbType[]).map((t, i) => {
            const active = selected === t;
            const c = ORB_COLORS[t];
            return (
              <button
                key={t}
                onClick={() => setSelected(t)}
                className="font-heading flex-1 py-3"
                style={{
                  border: "none",
                  borderRight: i < 3 ? "1px solid var(--oc-green-border-faint)" : "none",
                  background: active ? `${c}18` : "transparent",
                  color: active ? c : "var(--oc-text-dim)",
                  cursor: "pointer",
                  fontSize: "1rem",
                  letterSpacing: "0.14em",
                  borderBottom: active ? `2px solid ${c}` : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* 3D canvas */}
          <div
            style={{
              height: "300px",
              flex: "1 1 300px",
              background: isLight ? "rgba(240,237,230,0.5)" : "rgba(1,13,10,0.78)",
            }}
          >
            {mounted && (
              <Canvas
                camera={{ position: [2.4, 1.6, 2.9], fov: 48 }}
                style={{ background: "transparent" }}
                gl={{ antialias: true, alpha: true }}
              >
                <OrbitalScene type={selected} />
              </Canvas>
            )}
          </div>

          {/* Info panel */}
          <div
            className="p-5 lg:w-56"
            style={{
              background: isLight ? "rgba(240,237,230,0.35)" : "rgba(1,13,10,0.45)",
              borderLeft: "1px solid var(--oc-green-border-faint)",
            }}
          >
            {/* Subshell heading */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-heading" style={{ fontSize: "2.8rem", color, lineHeight: 1 }}>
                {selected}
              </span>
              <span
                className="font-heading px-2 py-0.5"
                style={{
                  color,
                  border: `1px solid ${isLight ? color + "88" : color + "44"}`,
                  background: `${color}11`,
                  borderRadius: "3px",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                }}
              >
                SUBSHELL
              </span>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-2.5 mb-4">
              {([
                ["ORBITALS",      String(info.orbitals)],
                ["MAX ELECTRONS", String(info.max)],
                ["SHAPE",         info.shape],
              ] as [string, string][]).map(([label, val]) => (
                <div key={label}>
                  <p
                    className="font-heading"
                    style={{ fontSize: "0.52rem", color: "var(--oc-text-dim)", letterSpacing: "0.1em", marginBottom: "1px" }}
                  >
                    {label}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--oc-text)" }}>{val}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "0.72rem", color: "var(--oc-text-muted)", lineHeight: 1.65 }}>
              {info.desc}
            </p>

            <p style={{ fontSize: "0.5rem", color: "var(--oc-text-hint)", marginTop: "10px", letterSpacing: "0.06em" }}>
              drag to rotate · auto-rotating
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
