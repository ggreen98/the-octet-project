"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

// ─── Electron ─────────────────────────────────────────────────────────────────

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
  const groupRef  = useRef<THREE.Group>(null);
  const coreRef   = useRef<THREE.Mesh>(null);
  const innerRef  = useRef<THREE.Mesh>(null);
  const outerRef  = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t    = clock.elapsedTime * speed + phase;
    const rawT = clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
    }

    // Pulse: slow breath + faster shimmer, offset per phase so electrons feel independent
    const breath  = 0.5 + 0.5 * Math.sin(rawT * 1.4 + phase);        // 0–1 slow
    const shimmer = 0.5 + 0.5 * Math.sin(rawT * 4.2 + phase * 2.3);  // 0–1 fast

    const pulse = breath * 0.7 + shimmer * 0.3;

    if (coreRef.current)
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        10 + pulse * 14;

    if (innerRef.current)
      (innerRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.18 + pulse * 0.28;

    if (outerRef.current)
      (outerRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.03 + pulse * 0.08;
  });

  return (
    <Trail width={0.32} length={1.5} color={color} attenuation={(t) => t * t * t}>
      <group ref={groupRef}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.052, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={18} roughness={0} metalness={0} />
        </mesh>
        <mesh ref={innerRef}>
          <sphereGeometry args={[0.13, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} transparent opacity={0.28} roughness={1} depthWrite={false} />
        </mesh>
        <mesh ref={outerRef}>
          <sphereGeometry args={[0.26, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.06} roughness={1} depthWrite={false} />
        </mesh>
      </group>
    </Trail>
  );
}

// ─── Orbital shell ────────────────────────────────────────────────────────────

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

// ─── Nucleus ──────────────────────────────────────────────────────────────────

const D = 0.081;
const ALPHA_CENTRES: [number, number, number][] = [
  [ D,  D,  D], [ D, -D, -D], [-D,  D, -D], [-D, -D,  D],
];
const TETRA_OFFSETS: { d: [number, number, number]; type: "proton" | "neutron" }[] = [
  { d: [ 0.052,  0.052,  0.052], type: "proton"  },
  { d: [ 0.052, -0.052, -0.052], type: "neutron" },
  { d: [-0.052,  0.052, -0.052], type: "proton"  },
  { d: [-0.052, -0.052,  0.052], type: "neutron" },
];
const NUCLEONS = ALPHA_CENTRES.flatMap(([cx, cy, cz]) =>
  TETRA_OFFSETS.map(({ d, type }) => ({
    pos: [cx + d[0], cy + d[1], cz + d[2]] as [number, number, number],
    type,
  }))
);

function Nucleon({ basePos, color, phase, type }: {
  basePos: [number, number, number]; color: string; phase: number; type: "proton" | "neutron";
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

    let intensity: number;
    if (type === "proton") {
      const cycle = ((t + phase * 0.4) % 6) / 6;
      intensity = 1.8 + Math.sin(t * 3.7 + phase * 2.1) * 0.22;
      if (cycle > 0.525 && cycle < 0.565) {
        const s = 1 - Math.abs(cycle - 0.545) / 0.02;
        intensity += s * 7.5;
      }
      if (cycle > 0.735 && cycle < 0.770) {
        const s = 1 - Math.abs(cycle - 0.752) / 0.017;
        intensity += s * 7.5;
      }
      if (cycle > 0.765 && cycle < 0.795) {
        const s = 1 - Math.abs(cycle - 0.780) / 0.015;
        intensity += s * 4.0;
      }
    } else {
      intensity = 1.8 + Math.sin(t * 3.7 + phase * 2.1) * 0.35 + Math.sin(t * 11.3 + phase * 0.7) * 0.15;
    }
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={6} roughness={0.2} metalness={0.4} toneMapped={false} />
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
          <Nucleon key={i} basePos={n.pos} color={n.type === "proton" ? "#ff6200" : "#4499ff"} phase={i * 1.3} type={n.type} />
        ))}
      </group>
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function AtomScene({ kColor, lColor, lColor2 }: { kColor: string; lColor: string; lColor2: string }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.09;
  });
  return (
    <group rotation={[Math.PI / 4, Math.PI / 4, Math.PI / 4]}>
      <group ref={groupRef}>
        <Nucleus />
        {/* K-shell */}
        <OrbitalShell radius={1.1} rotation={[0, 0, 0]}                         electronCount={2} speed={5.5} color={kColor} />
        <OrbitalShell radius={1.1} rotation={[Math.PI / 2, 0, Math.PI / 5]}     electronCount={2} speed={4.2} color={kColor} />
        {/* L-shell */}
        <OrbitalShell radius={1.9} rotation={[Math.PI * 0.38, 0, 0]}                       electronCount={2} speed={3.5} color={lColor} />
        <OrbitalShell radius={1.9} rotation={[Math.PI * 0.55, Math.PI / 2.2, 0]}           electronCount={2} speed={2.8} color={lColor} />
        <OrbitalShell radius={1.9} rotation={[Math.PI * 0.25, Math.PI / 3.5, Math.PI / 4]} electronCount={2} speed={3.1} color={lColor2} />
      </group>
    </group>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function ElectronOrbital() {
  const { theme } = useTheme();
  const kColor  = theme === "light" ? "#1a50c8" : "#e8f4ff";
  const lColor  = theme === "light" ? "#2060d8" : "#b8e8ff";
  const lColor2 = theme === "light" ? "#3070e8" : "#d0f0ff";

  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 48 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.06} />
      <pointLight position={[0, 0, 0]}    intensity={6}   color="#ff6622" decay={2} />
      <pointLight position={[4, 4, 4]}    intensity={0.8} color="#72b872" decay={2} />
      <pointLight position={[-4, -2, -3]} intensity={0.4} color="#0055ff" decay={2} />
      <AtomScene kColor={kColor} lColor={lColor} lColor2={lColor2} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
    </Canvas>
  );
}
