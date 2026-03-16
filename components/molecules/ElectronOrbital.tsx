"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={5}
        roughness={0}
        metalness={0}
      />
    </mesh>
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

// Animated nucleus: icosahedron core + pulsing outer halo
function Nucleus() {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.3;
      coreRef.current.rotation.y = t * 0.4;
    }
    if (haloRef.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.1;
      haloRef.current.scale.setScalar(s);
      (haloRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.1 + Math.sin(t * 1.6) * 0.04;
    }
  });

  return (
    <group>
      {/* Inner icosahedron core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.24, 1]} />
        <meshStandardMaterial
          color="#ffb300"
          emissive="#ff6600"
          emissiveIntensity={3}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      {/* Pulsing outer halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.46, 32, 32]} />
        <meshStandardMaterial
          color="#ff8c00"
          emissive="#ff4400"
          emissiveIntensity={1}
          transparent
          opacity={0.12}
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
        speed={1.9}
        color="#00ff41"
      />
      <OrbitalShell
        radius={1.1}
        rotation={[Math.PI / 2, 0, Math.PI / 5]}
        electronCount={2}
        speed={1.5}
        color="#00ff41"
      />

      {/* Outer shell — 2 tilted rings in different axes */}
      <OrbitalShell
        radius={1.9}
        rotation={[Math.PI / 4, 0, 0]}
        electronCount={2}
        speed={0.95}
        color="#00e5ff"
      />
      <OrbitalShell
        radius={1.9}
        rotation={[-Math.PI / 3, Math.PI / 5, Math.PI / 4]}
        electronCount={2}
        speed={0.72}
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
      {/* Warm nucleus light */}
      <pointLight position={[0, 0, 0]} intensity={4} color="#ffb300" decay={2} />
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
