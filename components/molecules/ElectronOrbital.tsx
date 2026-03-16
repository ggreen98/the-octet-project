"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
import * as THREE from "three";

// ─── Electron ──────────────────────────────────────────────────────────────

function Electron({
  radius,
  speed,
  phase,
  color,
}: {
  radius: number;
  speed: number;
  phase: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
  });

  return (
    <Trail width={0.45} length={10} color={color} attenuation={(t) => t * t * t}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={8}
          roughness={0}
          metalness={0}
        />
      </mesh>
    </Trail>
  );
}

// ─── Orbital ring + electrons ───────────────────────────────────────────────

function OrbitalShell({
  radius,
  rotation,
  electronCount,
  speed,
  color,
}: {
  radius: number;
  rotation: [number, number, number];
  electronCount: number;
  speed: number;
  color: string;
}) {
  const phases = useMemo(
    () =>
      Array.from(
        { length: electronCount },
        (_, i) => (i / electronCount) * Math.PI * 2
      ),
    [electronCount]
  );

  return (
    <group rotation={rotation}>
      <mesh>
        <torusGeometry args={[radius, 0.013, 6, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.28}
          roughness={1}
        />
      </mesh>
      {phases.map((phase, i) => (
        <Electron key={i} radius={radius} speed={speed} phase={phase} color={color} />
      ))}
    </group>
  );
}

// ─── Translucent shell spheres ──────────────────────────────────────────────

function ShellSphere({ radius, color }: { radius: number; color: string }) {
  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.15}
        transparent
        opacity={0.045}
        roughness={1}
        metalness={0}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Nucleus ────────────────────────────────────────────────────────────────
//
// Carbon-12 alpha-cluster model: 3 alpha particles (each = 2p + 2n)
// arranged in an equilateral triangle. Within each alpha, protons and
// neutrons occupy alternating tetrahedral corners — guaranteeing every
// proton is surrounded by neutrons in 3D.
//
// Alpha cluster centres (equilateral triangle, separation d = 0.2):
//   α1:  [+0.20,  0.00, 0]
//   α2:  [-0.10, +0.17, 0]
//   α3:  [-0.10, -0.17, 0]
//
// Tetrahedral offsets (radius 0.052, inscribed tetrahedron in sphere):
//   o0: [+0.052, +0.052, +0.052]  → proton
//   o1: [+0.052, -0.052, -0.052]  → neutron
//   o2: [-0.052, +0.052, -0.052]  → proton
//   o3: [-0.052, -0.052, +0.052]  → neutron

const D  = 0.11;                         // alpha-cluster separation
const SQ3 = Math.sqrt(3) / 2;            // ≈ 0.866

const ALPHA_CENTRES: [number, number, number][] = [
  [ D,        0,   0],
  [-D / 2,  D * SQ3, 0],
  [-D / 2, -D * SQ3, 0],
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

function Nucleon({
  basePos,
  color,
  phase,
}: {
  basePos: [number, number, number];
  color: string;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.set(
      basePos[0] + Math.sin(t * 3.1 + phase)       * 0.011,
      basePos[1] + Math.sin(t * 2.7 + phase + 1.1) * 0.011,
      basePos[2] + Math.cos(t * 2.4 + phase + 2.2) * 0.011
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.8}
        roughness={0.3}
        metalness={0.4}
      />
    </mesh>
  );
}

function Nucleus() {
  const clusterRef = useRef<THREE.Group>(null);
  const haloRef    = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (clusterRef.current) {
      clusterRef.current.rotation.x = t * 0.2;
      clusterRef.current.rotation.y = t * 0.3;
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.08;
      haloRef.current.scale.setScalar(s);
      (haloRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.08 + Math.sin(t * 1.6) * 0.03;
    }
  });

  return (
    <group>
      <group ref={clusterRef}>
        {NUCLEONS.map((n, i) => (
          <Nucleon
            key={i}
            basePos={n.pos}
            color={n.type === "proton" ? PROTON_COLOR : NEUTRON_COLOR}
            phase={i * 1.3}
          />
        ))}
      </group>
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ff3300"
          emissiveIntensity={0.8}
          transparent
          opacity={0.08}
          roughness={1}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Full scene ─────────────────────────────────────────────────────────────

function AtomScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.09;
    }
  });

  return (
    <group ref={groupRef}>
      <Nucleus />

      {/* K-shell sphere (n = 1) */}
      <ShellSphere radius={1.1} color="#00ff41" />

      {/* L-shell sphere (n = 2) */}
      <ShellSphere radius={1.9} color="#00e5ff" />

      {/* Inner orbital rings */}
      <OrbitalShell radius={1.1} rotation={[0, 0, 0]}                      electronCount={2} speed={8}   color="#00ff41" />
      <OrbitalShell radius={1.1} rotation={[Math.PI / 2, 0, Math.PI / 5]}  electronCount={2} speed={6.5} color="#00ff41" />

      {/* Outer orbital rings */}
      <OrbitalShell radius={1.9} rotation={[Math.PI / 4, 0, 0]}                        electronCount={2} speed={5} color="#00e5ff" />
      <OrbitalShell radius={1.9} rotation={[-Math.PI / 3, Math.PI / 5, Math.PI / 4]}   electronCount={2} speed={4} color="#00e5ff" />
    </group>
  );
}

// ─── Canvas export ──────────────────────────────────────────────────────────

export function ElectronOrbital() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 48 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.06} />
      <pointLight position={[0, 0, 0]}   intensity={4}   color="#ff6622" decay={2} />
      <pointLight position={[4, 4, 4]}   intensity={0.6} color="#00ff41" decay={2} />
      <pointLight position={[-4, -2, -3]} intensity={0.3} color="#0055ff" decay={2} />

      <AtomScene />

      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
    </Canvas>
  );
}
