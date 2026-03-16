"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
import * as THREE from "three";

// Single electron that orbits within its parent group's XZ plane
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
    <Trail
      width={0.45}
      length={10}
      color={color}
      attenuation={(t) => t * t * t}
    >
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

// Orbital ring + its electrons, rotated as a group
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
      {/* Ring */}
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
      {/* Electrons */}
      {phases.map((phase, i) => (
        <Electron
          key={i}
          radius={radius}
          speed={speed}
          phase={phase}
          color={color}
        />
      ))}
    </group>
  );
}

// Carbon nucleus: 6 protons + 6 neutrons packed in a tight cluster
const NUCLEONS: { pos: [number, number, number]; type: "proton" | "neutron" }[] = [
  { pos: [0,      0,     0    ], type: "proton"  },
  { pos: [0.22,   0,     0    ], type: "neutron" },
  { pos: [-0.22,  0,     0    ], type: "proton"  },
  { pos: [0,      0.22,  0    ], type: "neutron" },
  { pos: [0,     -0.22,  0    ], type: "proton"  },
  { pos: [0,      0,     0.22 ], type: "neutron" },
  { pos: [0,      0,    -0.22 ], type: "proton"  },
  { pos: [0.14,   0.14,  0.14 ], type: "neutron" },
  { pos: [-0.14,  0.14,  0.14 ], type: "proton"  },
  { pos: [0.14,  -0.14,  0.14 ], type: "neutron" },
  { pos: [-0.14, -0.14, -0.14 ], type: "proton"  },
  { pos: [0.14,   0.14, -0.14 ], type: "neutron" },
];

const PROTON_COLOR  = "#ff4500"; // red-orange
const NEUTRON_COLOR = "#4499ff"; // steel blue

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
    // Subtle nuclear vibration — each nucleon jiggles with a unique phase
    ref.current.position.set(
      basePos[0] + Math.sin(t * 3.1 + phase)       * 0.012,
      basePos[1] + Math.sin(t * 2.7 + phase + 1.1) * 0.012,
      basePos[2] + Math.cos(t * 2.4 + phase + 2.2) * 0.012
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.11, 16, 16]} />
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
  const groupRef  = useRef<THREE.Group>(null);
  const haloRef   = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.x = t * 0.2;
      groupRef.current.rotation.y = t * 0.3;
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
      {/* Rotating nucleon cluster */}
      <group ref={groupRef}>
        {NUCLEONS.map((n, i) => (
          <Nucleon
            key={i}
            basePos={n.pos}
            color={n.type === "proton" ? PROTON_COLOR : NEUTRON_COLOR}
            phase={i * 1.3}
          />
        ))}
      </group>
      {/* Pulsing outer halo */}
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
        />
      </mesh>
    </group>
  );
}

// Scene root — gentle auto-rotation while allowing user drag
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

      {/* Inner shell — 2 rings at 90° to each other */}
      <OrbitalShell
        radius={1.1}
        rotation={[0, 0, 0]}
        electronCount={2}
        speed={8}
        color="#00ff41"
      />
      <OrbitalShell
        radius={1.1}
        rotation={[Math.PI / 2, 0, Math.PI / 5]}
        electronCount={2}
        speed={6.5}
        color="#00ff41"
      />

      {/* Outer shell — 2 tilted rings in different axes */}
      <OrbitalShell
        radius={1.9}
        rotation={[Math.PI / 4, 0, 0]}
        electronCount={2}
        speed={5}
        color="#00e5ff"
      />
      <OrbitalShell
        radius={1.9}
        rotation={[-Math.PI / 3, Math.PI / 5, Math.PI / 4]}
        electronCount={2}
        speed={4}
        color="#00e5ff"
      />
    </group>
  );
}

export function ElectronOrbital() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 48 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.06} />
      {/* Nucleus light — warm mix of proton red and neutron blue */}
      <pointLight position={[0, 0, 0]} intensity={4} color="#ff6622" decay={2} />
      {/* Cool fill from above */}
      <pointLight position={[4, 4, 4]} intensity={0.6} color="#00ff41" decay={2} />
      {/* Rim light */}
      <pointLight position={[-4, -2, -3]} intensity={0.3} color="#0055ff" decay={2} />

      <AtomScene />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate={false}
      />
    </Canvas>
  );
}
