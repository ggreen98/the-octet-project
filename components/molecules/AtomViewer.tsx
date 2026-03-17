"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
import * as THREE from "three";
import { getElectronShells, getNeutrons, ELEMENT_BY_Z } from "@/data/elements";

// ─── Fibonacci sphere — distribute n points evenly on a sphere ────────────────

function fibSphere(n: number, radius: number): [number, number, number][] {
  if (n === 0) return [];
  if (n === 1) return [[0, 0, 0]];
  const phi = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = phi * i;
    return [Math.cos(t) * r * radius, y * radius, Math.sin(t) * r * radius] as [number, number, number];
  });
}

// ─── Nucleon ──────────────────────────────────────────────────────────────────

function Nucleon({ pos, type, phase }: {
  pos: [number, number, number];
  type: "proton" | "neutron";
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.set(
      pos[0] + Math.sin(t * 7.1 + phase)       * 0.038,
      pos[1] + Math.sin(t * 6.3 + phase + 1.1) * 0.038,
      pos[2] + Math.cos(t * 5.7 + phase + 2.2) * 0.038,
    );
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 1.6 + Math.sin(t * 3.7 + phase * 2.1) * 0.3 + Math.sin(t * 11 + phase) * 0.12;
  });

  const color = type === "proton" ? "#ff4500" : "#7a9ab0";
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} roughness={0.3} metalness={0.4} />
    </mesh>
  );
}

// ─── Nucleus ──────────────────────────────────────────────────────────────────

function Nucleus({ protons, neutrons }: { protons: number; neutrons: number }) {
  const clusterRef = useRef<THREE.Group>(null);
  const glowRef    = useRef<THREE.Mesh>(null);

  // Cap visual nucleons at 64 for performance; scale sphere radius accordingly
  const totalNucleons = protons + neutrons;
  const visualCap     = Math.min(totalNucleons, 64);
  const nucleusRadius = Math.pow(visualCap, 1 / 3) * 0.13;

  const nucleons = useMemo(() => {
    const positions = fibSphere(visualCap, nucleusRadius);
    // Interleave protons and neutrons for even visual distribution
    return positions.map((pos, i) => ({
      pos,
      type: i % 2 === 0 ? "proton" : "neutron" as "proton" | "neutron",
      phase: i * 1.3,
    }));
  }, [visualCap, nucleusRadius]);

  const glowRadius = nucleusRadius + 0.32;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (clusterRef.current) {
      clusterRef.current.rotation.x = t * 0.18;
      clusterRef.current.rotation.y = t * 0.27;
    }
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.05 + Math.sin(t * 1.8) * 0.02;
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[glowRadius, 24, 24]} />
        <meshStandardMaterial
          color="#ff5500" emissive="#ff3300" emissiveIntensity={0.5}
          transparent opacity={0.05} roughness={1} side={THREE.BackSide} depthWrite={false}
        />
      </mesh>
      <group ref={clusterRef}>
        {nucleons.map((n, i) => (
          <Nucleon key={i} pos={n.pos} type={n.type} phase={n.phase} />
        ))}
      </group>
    </group>
  );
}

// ─── Electron ─────────────────────────────────────────────────────────────────

function Electron({ radius, speed, phase, color, trailLength = 8 }: {
  radius: number; speed: number; phase: number; color: string; trailLength?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
  });

  return (
    <Trail width={0.4} length={trailLength} color={color} attenuation={(t) => t * t * t}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={10} roughness={0} metalness={0} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.22} roughness={1} depthWrite={false} />
        </mesh>
      </group>
    </Trail>
  );
}

// ─── Orbital shell ────────────────────────────────────────────────────────────

const SHELL_TILTS: [number, number, number][] = [
  [0, 0, 0],
  [Math.PI / 4,   0,            0],
  [-Math.PI / 3,  Math.PI / 5,  Math.PI / 4],
  [Math.PI / 6,   Math.PI / 3,  0],
  [-Math.PI / 5,  Math.PI / 2,  Math.PI / 6],
  [Math.PI / 2.5, Math.PI / 4, -Math.PI / 3],
  [-Math.PI / 4, -Math.PI / 3,  Math.PI / 2],
];

const SHELL_COLORS = ["#a8d8ff", "#00e5ff", "#a8d8ff", "#00e5ff"];

function OrbitalShell({ shellIndex, radius, electronCount, speed }: {
  shellIndex: number; radius: number; electronCount: number; speed: number;
}) {
  const color  = SHELL_COLORS[shellIndex % SHELL_COLORS.length];
  // Shorten trails for dense shells so they don't merge into a solid blob
  const trailLength = electronCount <= 4 ? 8 : electronCount <= 8 ? 6 : electronCount <= 16 ? 4 : 3;
  const phases = useMemo(
    () => Array.from({ length: electronCount }, (_, i) => (i / electronCount) * Math.PI * 2),
    [electronCount]
  );
  const tilt = SHELL_TILTS[shellIndex % SHELL_TILTS.length];

  return (
    <group rotation={tilt}>
      {phases.map((phase, i) => (
        <Electron key={i} radius={radius} speed={speed} phase={phase} color={color} trailLength={trailLength} />
      ))}
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

const SHELL_RADII  = [0.90, 1.55, 2.20, 2.90, 3.60, 4.35, 5.10];
const SHELL_SPEEDS = [2.4,  1.5,  1.0,  0.65, 0.42, 0.28, 0.18];

function AtomScene({ z }: { z: number }) {
  const el       = ELEMENT_BY_Z.get(z);
  const neutrons = el ? getNeutrons(el) : Math.round(z * 1.2);
  const shells   = getElectronShells(z);

  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.08;
  });

  return (
    <group rotation={[Math.PI / 5, Math.PI / 4, 0]}>
      <group ref={groupRef}>
        <Nucleus protons={z} neutrons={neutrons} />
        {shells.map((count, i) => (
          <OrbitalShell
            key={i}
            shellIndex={i}
            radius={SHELL_RADII[i]}
            electronCount={count}
            speed={SHELL_SPEEDS[i]}
          />
        ))}
      </group>
    </group>
  );
}

// ─── Camera distance based on shell count ─────────────────────────────────────

function getCameraZ(shellCount: number): number {
  const distances = [4.0, 5.0, 6.5, 8.2, 10.2, 12.5, 15.0];
  return distances[Math.min(shellCount - 1, distances.length - 1)];
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function AtomViewer({ z }: { z: number }) {
  const shells   = getElectronShells(z);
  const cameraZ  = getCameraZ(shells.length);

  return (
    <Canvas
      camera={{ position: [0, 0, cameraZ], fov: 48 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.06} />
      <pointLight position={[0, 0, 0]}    intensity={4}   color="#ff6622" decay={2} />
      <pointLight position={[4, 4, 4]}    intensity={0.6} color="#00ff41" decay={2} />
      <pointLight position={[-4, -2, -3]} intensity={0.3} color="#0055ff" decay={2} />
      <AtomScene z={z} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
    </Canvas>
  );
}
