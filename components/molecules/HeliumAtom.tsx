"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Trail, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

// ── Shared constants ──────────────────────────────────────────────────────────
const ORBIT_R = 1.65;
// Both electrons share the same 1s orbital plane (1s² — same orbital, opposite spins).
// They sit 180° apart. Spin is a quantum property with no spatial axis to show.
const ORBITAL_TILT: [number, number, number] = [0.55, 0, 0.25];

// ── 1s² orbital glow — amber-gold tint for noble gas ─────────────────────────
function OrbitalGlow({ dark }: { dark: boolean }) {
  const refs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];

  useFrame(({ clock }) => {
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.75);
    const base = dark ? [0.060, 0.034, 0.014] : [0.19, 0.11, 0.055];
    refs.forEach((ref, i) => {
      if (ref.current)
        (ref.current.material as THREE.MeshStandardMaterial).opacity =
          base[i] + pulse * base[i] * 0.45;
    });
  });

  const col = dark ? "#ffe090" : "#b86000";

  return (
    <group>
      <mesh ref={refs[0]}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1}
          transparent opacity={dark ? 0.060 : 0.075} roughness={1} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh ref={refs[1]}>
        <sphereGeometry args={[2.0, 32, 32]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.5}
          transparent opacity={dark ? 0.034 : 0.048} roughness={1} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh ref={refs[2]}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.3}
          transparent opacity={dark ? 0.014 : 0.020} roughness={1} depthWrite={false} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ── Helium nucleus (2p + 2n — slightly larger than H) ─────────────────────────
function Nucleus({ dark }: { dark: boolean }) {
  const coreRef  = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flicker =
      Math.sin(t * 1.7)  * 0.38 +
      Math.sin(t * 4.3)  * 0.22 +
      Math.sin(t * 9.1)  * 0.14 +
      Math.sin(t * 17.6) * 0.08 +
      Math.sin(t * 0.53) * 0.18;
    const cycle = (t * 0.41) % 1;
    const spike = cycle > 0.82 && cycle < 0.88
      ? Math.sin(((cycle - 0.82) / 0.06) * Math.PI) * 1.8 : 0;
    const f = 0.5 + flicker * 0.5 + spike;

    if (coreRef.current)
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        dark ? 5 + f * 6 : 3.5 + f * 3;
    if (innerRef.current)
      (innerRef.current.material as THREE.MeshStandardMaterial).opacity =
        dark ? 0.15 + f * 0.15 : 0.22 + f * 0.16;
    if (outerRef.current)
      (outerRef.current.material as THREE.MeshStandardMaterial).opacity =
        dark ? 0.04 + f * 0.04 : 0.08 + f * 0.07;
  });

  const col = dark ? "#ff6622" : "#cc4400";

  return (
    <group>
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.5}
          transparent opacity={0.05} roughness={1} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color={col} emissive={col} emissiveIntensity={2}
          transparent opacity={0.18} roughness={0.6} depthWrite={false} />
      </mesh>
      <mesh ref={coreRef}>
        {/* slightly larger than H to reflect 4 nucleons */}
        <sphereGeometry args={[0.155, 20, 20]} />
        <meshStandardMaterial color="#ffddaa" emissive={col} emissiveIntensity={6}
          roughness={0} metalness={0.8} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── Single orbiting electron (amber-gold) ─────────────────────────────────────
function HeliumElectron({
  dark,
  tilt,
  phaseOffset,
  speed,
}: {
  dark: boolean;
  tilt: [number, number, number];
  phaseOffset: number;
  speed: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef  = useRef<THREE.Mesh>(null);
  const haloRef  = useRef<THREE.Mesh>(null);

  const color      = dark ? "#ffd060" : "#c87000";
  const trailColor = dark ? "#ffb830" : "#b06000";

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed + phaseOffset;
    if (groupRef.current) {
      groupRef.current.position.set(
        Math.cos(t) * ORBIT_R,
        0,
        Math.sin(t) * ORBIT_R,
      );
    }
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 3.0 + phaseOffset);
    if (coreRef.current)
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        dark ? 12 + pulse * 8 : 2.5 + pulse * 1.5;
    if (haloRef.current)
      (haloRef.current.material as THREE.MeshStandardMaterial).opacity =
        dark ? 0.12 + pulse * 0.10 : 0.18 + pulse * 0.12;
  });

  return (
    <group rotation={tilt}>
      <Trail width={dark ? 0.28 : 0.55} length={dark ? 2.0 : 2.8} color={trailColor} attenuation={t => t * t}>
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

// ── Orbital ring ──────────────────────────────────────────────────────────────
function OrbitalRing({ dark, tilt }: { dark: boolean; tilt: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current)
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        (dark ? 0.07 : 0.15) + Math.sin(clock.elapsedTime * 0.85) * 0.015;
  });
  return (
    <group rotation={tilt}>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ORBIT_R, 0.006, 4, 120]} />
        <meshBasicMaterial
          color={dark ? "#ffd060" : "#b06000"}
          transparent opacity={0.07} depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function HeliumScene({ dark }: { dark: boolean }) {
  const masterRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (masterRef.current)
      masterRef.current.rotation.y = clock.elapsedTime * 0.10;
  });

  return (
    <group ref={masterRef}>
      <OrbitalGlow dark={dark} />
      {/* One shared orbital ring — both electrons are in the same 1s plane */}
      <OrbitalRing dark={dark} tilt={ORBITAL_TILT} />
      <Nucleus     dark={dark} />
      {/* Two electrons, 180° apart in the same plane — paired spins (↑↓) */}
      <HeliumElectron dark={dark} tilt={ORBITAL_TILT} phaseOffset={0}        speed={1.4} />
      <HeliumElectron dark={dark} tilt={ORBITAL_TILT} phaseOffset={Math.PI}  speed={1.4} />
    </group>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function HeliumAtom() {
  const { theme } = useTheme();
  const dark = theme !== "light";

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 48 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={dark ? 0.04 : 0.15} />
      <pointLight position={[0, 0, 0]}   intensity={dark ? 4   : 3  } color="#ff6622" decay={2} />
      <pointLight position={[4, 3, 4]}   intensity={dark ? 0.8 : 0.6} color={dark ? "#ffd060" : "#ffaa30"} decay={2} />
      <pointLight position={[-3, -2, 2]} intensity={dark ? 0.3 : 0.2} color={dark ? "#ffe090" : "#ffcc60"} decay={2} />
      <HeliumScene dark={dark} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.35} />
    </Canvas>
  );
}
