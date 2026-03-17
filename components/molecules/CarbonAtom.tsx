"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
import * as THREE from "three";

// ─── Electron ───────────────────────────────────────────────────────────────

function Electron({ radius, speed, phase, color }: {
  radius: number; speed: number; phase: number; color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
  });
  return (
    <Trail width={0.45} length={10} color={color} attenuation={(t) => t * t * t}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={10} roughness={0} metalness={0} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.22} roughness={1} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.24, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.07} roughness={1} depthWrite={false} />
        </mesh>
      </group>
    </Trail>
  );
}

// ─── Orbital shell ──────────────────────────────────────────────────────────

function OrbitalShell({ radius, rotation, electronCount, speed, color }: {
  radius: number; rotation: [number, number, number];
  electronCount: number; speed: number; color: string;
}) {
  const phases = useMemo(
    () => Array.from({ length: electronCount }, (_, i) => (i / electronCount) * Math.PI * 2),
    [electronCount]
  );
  return (
    <group rotation={rotation}>
      {phases.map((phase, i) => (
        <Electron key={i} radius={radius} speed={speed} phase={phase} color={color} />
      ))}
    </group>
  );
}

// ─── Nucleus — Carbon-12 alpha-cluster model ─────────────────────────────────
//
// 3 alpha particles (each = 2p + 2n) in an equilateral triangle.
// Total: 3 × 4 = 12 nucleons (6 protons + 6 neutrons).

const D   = 0.11;
const SQ3 = Math.sqrt(3) / 2;

const ALPHA_CENTRES: [number, number, number][] = [
  [ D,        0,       0],
  [-D / 2,  D * SQ3,  0],
  [-D / 2, -D * SQ3,  0],
];

const TETRA_OFFSETS: { d: [number, number, number]; type: "proton" | "neutron" }[] = [
  { d: [ 0.052,  0.052,  0.052], type: "proton"  },
  { d: [ 0.052, -0.052, -0.052], type: "neutron" },
  { d: [-0.052,  0.052, -0.052], type: "proton"  },
  { d: [-0.052, -0.052,  0.052], type: "neutron" },
];

const NUCLEONS: { pos: [number, number, number]; type: "proton" | "neutron" }[] =
  ALPHA_CENTRES.flatMap(([cx, cy, cz]) =>
    TETRA_OFFSETS.map(({ d, type }) => ({
      pos: [cx + d[0], cy + d[1], cz + d[2]] as [number, number, number],
      type,
    }))
  );

const PROTON_COLOR  = "#ff4500";
const NEUTRON_COLOR = "#4499ff";

function Nucleon({ basePos, color, phase }: {
  basePos: [number, number, number]; color: string; phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.set(
      basePos[0] + Math.sin(t * 7.1 + phase)       * 0.045,
      basePos[1] + Math.sin(t * 6.3 + phase + 1.1) * 0.045,
      basePos[2] + Math.cos(t * 5.7 + phase + 2.2) * 0.045
    );
    const flicker =
      1.8 +
      Math.sin(t * 3.7 + phase * 2.1) * 0.35 +
      Math.sin(t * 11.3 + phase * 0.7) * 0.15;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flicker;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} roughness={0.3} metalness={0.4} />
    </mesh>
  );
}

function Nucleus() {
  const clusterRef = useRef<THREE.Group>(null);
  const glowRef    = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (clusterRef.current) {
      clusterRef.current.rotation.x = t * 0.2;
      clusterRef.current.rotation.y = t * 0.3;
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.055 + Math.sin(t * 1.8) * 0.025;
    }
  });
  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#ff5500" emissive="#ff3300" emissiveIntensity={0.6} transparent opacity={0.055} roughness={1} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <group ref={clusterRef}>
        {NUCLEONS.map((n, i) => (
          <Nucleon key={i} basePos={n.pos} color={n.type === "proton" ? PROTON_COLOR : NEUTRON_COLOR} phase={i * 1.3} />
        ))}
      </group>
    </group>
  );
}

// ─── Scene — Carbon-12: 2 electrons in K-shell, 4 in L-shell ────────────────

function CarbonScene() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.09;
  });
  return (
    <group rotation={[Math.PI / 4, Math.PI / 4, Math.PI / 4]}>
      <group ref={groupRef}>
        <Nucleus />

        {/* K-shell: 2 electrons */}
        <OrbitalShell radius={1.1} rotation={[0, 0, 0]} electronCount={2} speed={8} color="#a8d8ff" />

        {/* L-shell: 4 electrons across 2 rings */}
        <OrbitalShell radius={1.9} rotation={[Math.PI / 4, 0, 0]}                       electronCount={2} speed={5} color="#00e5ff" />
        <OrbitalShell radius={1.9} rotation={[-Math.PI / 3, Math.PI / 5, Math.PI / 4]}  electronCount={2} speed={4} color="#00e5ff" />
      </group>
    </group>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function CarbonAtom() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 48 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.06} />
      <pointLight position={[0, 0, 0]}    intensity={4}   color="#ff6622" decay={2} />
      <pointLight position={[4, 4, 4]}    intensity={0.6} color="#00ff41" decay={2} />
      <pointLight position={[-4, -2, -3]} intensity={0.3} color="#0055ff" decay={2} />
      <CarbonScene />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
    </Canvas>
  );
}
