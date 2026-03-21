"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Trail, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

// ── 1s orbital glow — smooth radial shells ────────────────────────────────────
// Three concentric transparent spheres fade to approximate the 1s density shape.

function OrbitalGlow({ dark }: { dark: boolean }) {
  const refs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];

  useFrame(({ clock }) => {
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.8);
    const base = dark ? [0.055, 0.030, 0.012] : [0.18, 0.10, 0.05];
    refs.forEach((ref, i) => {
      if (ref.current)
        (ref.current.material as THREE.MeshStandardMaterial).opacity =
          base[i] + pulse * base[i] * 0.4;
    });
  });

  const col = dark ? "#b0d8ff" : "#1a50c8";

  return (
    <group>
      <mesh ref={refs[0]}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1}
          transparent opacity={dark ? 0.055 : 0.072} roughness={1} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh ref={refs[1]}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.5}
          transparent opacity={dark ? 0.030 : 0.042} roughness={1} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh ref={refs[2]}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.3}
          transparent opacity={dark ? 0.012 : 0.018} roughness={1} depthWrite={false} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ── Proton nucleus ────────────────────────────────────────────────────────────
function Proton({ dark }: { dark: boolean }) {
  const coreRef  = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // Layered sine waves at inharmonic frequencies → organic, flame-like flicker
    const flicker =
      Math.sin(t * 1.7)  * 0.38 +   // slow breath
      Math.sin(t * 4.3)  * 0.22 +   // mid flutter
      Math.sin(t * 9.1)  * 0.14 +   // fast shimmer
      Math.sin(t * 17.6) * 0.08 +   // fine grain
      Math.sin(t * 0.53) * 0.18;    // long swell

    // Occasional sharp spike — like a candle catching a draught
    const cycle = (t * 0.41) % 1;
    const spike = cycle > 0.82 && cycle < 0.88
      ? Math.sin(((cycle - 0.82) / 0.06) * Math.PI) * 1.8
      : 0;

    const f = 0.5 + flicker * 0.5 + spike; // ~0–2 range

    if (coreRef.current)
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        dark ? 5 + f * 6 : 3.5 + f * 3;
    if (innerRef.current)
      (innerRef.current.material as THREE.MeshStandardMaterial).opacity =
        dark ? 0.14 + f * 0.14 : 0.22 + f * 0.16;
    if (outerRef.current)
      (outerRef.current.material as THREE.MeshStandardMaterial).opacity =
        dark ? 0.03 + f * 0.04 : 0.07 + f * 0.07;
  });

  const col = dark ? "#ff6622" : "#cc4400";

  return (
    <group>
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.5}
          transparent opacity={0.05} roughness={1} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={2}
          transparent opacity={0.18} roughness={0.6} depthWrite={false} />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color="#ffddaa" emissive={col} emissiveIntensity={6}
          roughness={0} metalness={0.8} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── Single orbiting electron ──────────────────────────────────────────────────
function Electron({ dark }: { dark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef  = useRef<THREE.Mesh>(null);
  const haloRef  = useRef<THREE.Mesh>(null);

  const SPEED      = 1.4;
  const color      = dark ? "#c8e8ff" : "#1b5fc8";
  const trailColor = dark ? "#c8e8ff" : "#398df4";

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * SPEED;
    if (groupRef.current) {
      groupRef.current.position.set(
        Math.cos(t) * ORBIT_R,
        0,
        Math.sin(t) * ORBIT_R,
      );
    }
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 3.2);
    if (coreRef.current)
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        dark ? 12 + pulse * 8 : 2.5 + pulse * 1.5;
    if (haloRef.current)
      (haloRef.current.material as THREE.MeshStandardMaterial).opacity =
        dark ? 0.12 + pulse * 0.10 : 0.18 + pulse * 0.12;
  });

  return (
    <group rotation={ORBITAL_TILT}>
      <Trail width={dark ? 0.28 : 0.55} length={dark ? 2.2 : 3.0} color={trailColor} attenuation={t => t * t}>
        <group ref={groupRef}>
          <mesh ref={haloRef}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3}
              transparent opacity={0.12} roughness={1} depthWrite={false} />
          </mesh>
          <mesh ref={coreRef}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={12}
              roughness={0} metalness={0} toneMapped={false} />
          </mesh>
        </group>
      </Trail>
    </group>
  );
}

// Shared orbital plane and radius — electron and ring must both reference these
const ORBITAL_TILT: [number, number, number] = [0.66, 0, 0.3];
const ORBIT_R = 1.65;

// ── Orbital ring hint ─────────────────────────────────────────────────────────
function OrbitalRing({ dark }: { dark: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current)
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        (dark ? 0.06 : 0.14) + Math.sin(clock.elapsedTime * 0.9) * 0.015;
  });
  // Torus is in XY by default; rotate −90° around X to put it in XZ,
  // then ORBITAL_TILT on the outer group matches the electron's plane exactly.
  return (
    <group rotation={ORBITAL_TILT}>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ORBIT_R, 0.006, 4, 120]} />
        <meshBasicMaterial
          color={dark ? "#c8e8ff" : "#1a50c8"}
          transparent opacity={0.06} depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function HydrogenScene({ dark }: { dark: boolean }) {
  const masterRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (masterRef.current)
      masterRef.current.rotation.y = clock.elapsedTime * 0.09;
  });

  return (
    <group ref={masterRef}>
      <OrbitalGlow  dark={dark} />
      <OrbitalRing  dark={dark} />
      <Proton       dark={dark} />
      <Electron     dark={dark} />
    </group>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function HydrogenAtom() {
  const { theme } = useTheme();
  const dark = theme !== "light";

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 48 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={dark ? 0.04 : 0.15} />
      <pointLight position={[0, 0, 0]}    intensity={dark ? 4   : 3  } color="#ff6622" decay={2} />
      <pointLight position={[4, 3, 4]}    intensity={dark ? 0.6 : 0.5} color={dark ? "#c8e8ff" : "#aaccff"} decay={2} />
      <pointLight position={[-3, -2, 2]}  intensity={dark ? 0.3 : 0.2} color={dark ? "#72b872" : "#88cc88"} decay={2} />
      <HydrogenScene dark={dark} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.35} />
    </Canvas>
  );
}
