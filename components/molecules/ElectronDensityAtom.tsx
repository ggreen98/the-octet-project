"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

// ── Math helpers ──────────────────────────────────────────────────────────────

function gaussianRandom(mean: number, std: number): number {
  const u = Math.max(1e-10, Math.random());
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
}

function randomUnitSphere(): [number, number, number] {
  const theta = Math.acos(2 * Math.random() - 1);
  const phi   = Math.random() * 2 * Math.PI;
  return [
    Math.sin(theta) * Math.cos(phi),
    Math.sin(theta) * Math.sin(phi),
    Math.cos(theta),
  ];
}

// ── Shell particle cloud ──────────────────────────────────────────────────────

interface ShellDef {
  count:      number;
  peakRadius: number;
  spread:     number;
  color:      [number, number, number]; // RGB 0–1
  size:       number;
  opacity:    number;
  speedY:     number;
  speedZ:     number;
}

function ShellCloud({ def }: { def: ShellDef }) {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const positions = new Float32Array(def.count * 3);
    const colors    = new Float32Array(def.count * 3);
    const [cr, cg, cb] = def.color;

    for (let i = 0; i < def.count; i++) {
      const r = Math.max(0.01, gaussianRandom(def.peakRadius, def.spread));
      const [dx, dy, dz] = randomUnitSphere();
      positions[i * 3]     = dx * r;
      positions[i * 3 + 1] = dy * r;
      positions[i * 3 + 2] = dz * r;

      const b = 0.6 + Math.random() * 0.4;
      colors[i * 3]     = cr * b;
      colors[i * 3 + 1] = cg * b;
      colors[i * 3 + 2] = cb * b;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color",    new THREE.BufferAttribute(colors,    3));
    return g;
  }, [def]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * def.speedY;
    ref.current.rotation.z = t * def.speedZ;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={def.size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={def.opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Nucleus ───────────────────────────────────────────────────────────────────

function Nucleus() {
  const glowRef = useRef<THREE.Mesh>(null);
  const hazeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (glowRef.current)
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        4.5 + Math.sin(t * 2.1) * 1.5;
    if (hazeRef.current)
      (hazeRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.07 + Math.sin(t * 1.7) * 0.025;
  });

  return (
    <group>
      {/* Wide corona haze */}
      <mesh ref={hazeRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#ff7722" emissive="#ff5500" emissiveIntensity={0.8}
          transparent opacity={0.07} roughness={1} depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color="#ff9944" emissive="#ff7722" emissiveIntensity={2}
          transparent opacity={0.55} roughness={0.4} metalness={0.6} depthWrite={false}
        />
      </mesh>
      {/* Bright core */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#ffeecc" emissive="#ff7722" emissiveIntensity={6}
          roughness={0} metalness={0.9} toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ── Orbital hint rings ────────────────────────────────────────────────────────

function OrbitalRing({ radius, rotation }: { radius: number; rotation: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current)
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.032 + Math.sin(clock.elapsedTime * 0.8 + radius) * 0.012;
  });
  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, 0.007, 4, 120]} />
      <meshBasicMaterial color="#4499ff" transparent opacity={0.032} depthWrite={false} />
    </mesh>
  );
}

// ── Master scene ──────────────────────────────────────────────────────────────

function DensityScene({ darkMode }: { darkMode: boolean }) {
  const masterRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (masterRef.current) {
      masterRef.current.rotation.y = clock.elapsedTime * 0.07;
    }
  });

  const shells: ShellDef[] = useMemo(() => [
    // Core density — tight bright cloud around nucleus
    {
      count: 160, peakRadius: 0.5, spread: 0.22,
      color: darkMode ? [0.94, 0.97, 1.0] : [0.1, 0.32, 0.78],
      size: 0.075, opacity: darkMode ? 0.22 : 0.38,
      speedY: 0.13, speedZ: 0.06,
    },
    // 1s/2s shell
    {
      count: 230, peakRadius: 1.2, spread: 0.32,
      color: darkMode ? [0.72, 0.9, 1.0] : [0.13, 0.38, 0.85],
      size: 0.06, opacity: darkMode ? 0.13 : 0.24,
      speedY: -0.09, speedZ: 0.09,
    },
    // 2p shell
    {
      count: 270, peakRadius: 2.0, spread: 0.48,
      color: darkMode ? [0.27, 0.6, 1.0] : [0.1, 0.28, 0.72],
      size: 0.052, opacity: darkMode ? 0.09 : 0.17,
      speedY: 0.06, speedZ: -0.12,
    },
    // Outer haze — green tint connects to terminal palette
    {
      count: 190, peakRadius: 2.9, spread: 0.72,
      color: darkMode ? [0.45, 0.72, 0.45] : [0.17, 0.42, 0.17],
      size: 0.044, opacity: darkMode ? 0.07 : 0.13,
      speedY: -0.05, speedZ: 0.04,
    },
    // Scattered atmosphere — depth and softness
    {
      count: 90, peakRadius: 3.5, spread: 0.9,
      color: darkMode ? [0.3, 0.55, 0.95] : [0.1, 0.25, 0.6],
      size: 0.036, opacity: darkMode ? 0.05 : 0.09,
      speedY: 0.03, speedZ: 0.07,
    },
  ], [darkMode]);

  return (
    <group ref={masterRef} rotation={[0.3, 0, 0.1]}>
      <Nucleus />
      {shells.map((def, i) => <ShellCloud key={i} def={def} />)}
      <OrbitalRing radius={1.2}  rotation={[0, 0, 0]} />
      <OrbitalRing radius={2.0}  rotation={[Math.PI * 0.35,  0, Math.PI * 0.15]} />
      <OrbitalRing radius={2.0}  rotation={[Math.PI * 0.6, Math.PI * 0.25, 0]} />
    </group>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function ElectronDensityAtom() {
  const { theme } = useTheme();
  const darkMode  = theme !== "light";

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.04} />
      <pointLight position={[0, 0, 0]}    intensity={5}   color="#ff6622" decay={2} />
      <pointLight position={[4, 3, 3]}    intensity={0.7} color="#4499ff" decay={2} />
      <pointLight position={[-3, -2, 2]}  intensity={0.4} color="#72b872" decay={2} />
      <DensityScene darkMode={darkMode} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.35} />
    </Canvas>
  );
}
