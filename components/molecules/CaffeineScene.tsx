"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

// ── Caffeine (1,3,7-trimethylxanthine) ───────────────────────────────────────
// Ring atoms lie in XY plane. The group is tilted 40° around X so as it spins
// on Y the ring is never seen fully edge-on — you always see the ring structure.
// Scaled to fit comfortably in the right hero column.

type V3 = [number, number, number];

// Coordinates — all ring atoms in z=0 plane, methyls ±z for 3-D depth
const N1: V3  = [ 0.38,  0.90,  0.00];
const C2: V3  = [ 1.02,  0.48,  0.00];
const N3: V3  = [ 1.02, -0.20,  0.00];
const C4: V3  = [ 0.38, -0.60,  0.00];
const C5: V3  = [-0.22, -0.20,  0.00];
const C6: V3  = [-0.22,  0.48,  0.00];
const N7: V3  = [-0.70, -0.70,  0.00];
const C8: V3  = [-0.44, -1.38,  0.00];
const N9: V3  = [ 0.22, -1.30,  0.00];

const O2:    V3 = [ 1.72,  0.90,  0.00];
const O6:    V3 = [-0.88,  0.90,  0.00];
const ME_N1: V3 = [ 0.38,  1.72,  0.38];
const ME_N3: V3 = [ 1.72, -0.60,  0.38];
const ME_N7: V3 = [-1.44, -0.78, -0.38];
const H_C8:  V3 = [-0.88, -1.90,  0.00];

const BONDS: [V3, V3][] = [
  [N1, C2], [C2, N3], [N3, C4], [C4, C5], [C5, C6], [C6, N1],   // 6-ring
  [C4, N9], [N9, C8], [C8, N7], [N7, C5],                        // 5-ring
  [C2, O2], [C6, O6],                                             // carbonyls
  [N1, ME_N1], [N3, ME_N3], [N7, ME_N7],                         // methyls
  [C8, H_C8],                                                     // C-H
];

// ── Bond ─────────────────────────────────────────────────────────────────────
function Bond({ a, b, color }: { a: V3; b: V3; color: string }) {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const center = va.clone().add(vb).multiplyScalar(0.5);
  const len    = va.distanceTo(vb);
  const dir    = vb.clone().sub(va).normalize();
  const quat   = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  return (
    <mesh position={center.toArray()} quaternion={[quat.x, quat.y, quat.z, quat.w]}>
      <cylinderGeometry args={[0.038, 0.038, len, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

// ── Atom ──────────────────────────────────────────────────────────────────────
interface AtomProps { pos: V3; color: string; r: number; phaseOffset: number; dark: boolean }

function Atom({ pos, color, r, phaseOffset, dark }: AtomProps) {
  const coreRef  = useRef<THREE.Mesh>(null);
  const glowRef  = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 1.6 + phaseOffset);
    if (coreRef.current)
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        dark ? 0.55 + pulse * 0.35 : 0.18;
    if (glowRef.current)
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity =
        dark ? 0.07 + pulse * 0.08 : 0.04 + pulse * 0.04;
  });

  return (
    <group position={pos}>
      {/* Soft glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[r * 2.8, 12, 12]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={1}
          transparent opacity={0.08} roughness={1} depthWrite={false}
        />
      </mesh>
      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[r, 20, 20]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={0.55}
          roughness={0.2} metalness={dark ? 0.45 : 0.1} toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function CaffeineScene({ dark }: { dark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current)
      groupRef.current.rotation.y = clock.elapsedTime * 0.11;
  });

  // Color palette matches Allylic: blue=carbon, green=nitrogen, amber=oxygen
  const C  = dark ? "#4499ff" : "#1a50c8";
  const N  = dark ? "#72b872" : "#2a6a2a";
  const O  = dark ? "#ffb300" : "#b06800";
  const H  = dark ? "#c8e8ff" : "#7090c0";
  const BC = dark ? "#1e3050" : "#8090a8";  // bond color

  type AtomEntry = { pos: V3; color: string; r: number };
  const atoms: AtomEntry[] = [
    { pos: C2, color: C, r: 0.155 }, { pos: C4,    color: C, r: 0.155 },
    { pos: C5, color: C, r: 0.155 }, { pos: C6,    color: C, r: 0.155 },
    { pos: C8, color: C, r: 0.155 }, { pos: N1,    color: N, r: 0.148 },
    { pos: N3, color: N, r: 0.148 }, { pos: N7,    color: N, r: 0.148 },
    { pos: N9, color: N, r: 0.148 }, { pos: O2,    color: O, r: 0.142 },
    { pos: O6, color: O, r: 0.142 }, { pos: ME_N1, color: C, r: 0.130 },
    { pos: ME_N3, color: C, r: 0.130 }, { pos: ME_N7, color: C, r: 0.130 },
    { pos: H_C8,  color: H, r: 0.095 },
  ];

  return (
    // 40° X-tilt keeps the ring visible through the full Y rotation — never edge-on
    <group rotation={[0.70, 0, 0]}>
      <group ref={groupRef}>
        {BONDS.map(([a, b], i) => <Bond key={i} a={a} b={b} color={BC} />)}
        {atoms.map((a, i) => (
          <Atom key={i} pos={a.pos} color={a.color} r={a.r} phaseOffset={i * 0.7} dark={dark} />
        ))}

        {/* CAFFEINE label — floats above the molecule */}
        <Html position={[0, 2.35, 0]} center style={{ pointerEvents: "none" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.26em",
            color: dark ? "rgba(114,184,114,0.55)" : "rgba(42,106,42,0.5)",
            whiteSpace: "nowrap",
          }}>
            CAFFEINE
          </span>
        </Html>

        {/* Formula — floats below */}
        <Html position={[0, -2.35, 0]} center style={{ pointerEvents: "none" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.08em",
            color: dark ? "rgba(180,215,255,0.35)" : "rgba(14,18,40,0.35)",
            whiteSpace: "nowrap",
          }}>
            C₈H₁₀N₄O₂
          </span>
        </Html>
      </group>
    </group>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function CaffeineMolecule() {
  const { theme } = useTheme();
  const dark = theme !== "light";

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 48 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={dark ? 0.06 : 0.55} />
      <pointLight position={[ 4,  3,  4]} intensity={dark ? 1.2 : 0.6} color={dark ? "#aaccff" : "#ffffff"} decay={2} />
      <pointLight position={[-3, -1,  3]} intensity={dark ? 0.5 : 0.2} color={dark ? "#72b872" : "#88cc88"} decay={2} />
      <pointLight position={[ 0,  4, -2]} intensity={dark ? 0.3 : 0.1} color={dark ? "#4499ff" : "#6688cc"} decay={2} />
      <CaffeineScene dark={dark} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.4} />
    </Canvas>
  );
}
