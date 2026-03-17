"use client";

import { useRef, useMemo, createContext, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
import * as THREE from "three";

// ─── Highlight context ────────────────────────────────────────────────────────

type Highlighted = "proton" | "neutron" | "electron" | null;
const HighlightContext = createContext<Highlighted>(null);

// ─── Colors ───────────────────────────────────────────────────────────────────

const PROTON_IDLE      = new THREE.Color("#ff4500");
const PROTON_HI        = new THREE.Color("#ef5e38");
const NEUTRON_IDLE     = new THREE.Color("#7a9ab0");
const NEUTRON_HI       = new THREE.Color("#d8d8d8");
const ELECTRON_IDLE    = "#a8d8ff";
const ELECTRON_HI      = "#2a66a8";
const ELECTRON_OUTER_IDLE = "#00e5ff";
const ELECTRON_OUTER_HI   = "#2a66a8";

// ─── Electron ────────────────────────────────────────────────────────────────

function Electron({ radius, speed, phase, color, outerColor }: {
  radius: number; speed: number; phase: number; color: string; outerColor: string;
}) {
  const highlighted = useContext(HighlightContext);
  const ref = useRef<THREE.Group>(null);
  const mat0 = useRef<THREE.MeshStandardMaterial>(null);
  const mat1 = useRef<THREE.MeshStandardMaterial>(null);
  const mat2 = useRef<THREE.MeshStandardMaterial>(null);

  const targetColor = useRef(new THREE.Color(color));

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;

    const isHi = highlighted === "electron";

    const hiColor = outerColor ? ELECTRON_OUTER_HI : ELECTRON_HI;
    const idleColor = outerColor ? ELECTRON_OUTER_IDLE : ELECTRON_IDLE;
    targetColor.current.set(isHi ? hiColor : idleColor);

    for (const mat of [mat0, mat1, mat2]) {
      if (!mat.current) continue;
      mat.current.color.lerp(targetColor.current, 0.08);
      mat.current.emissive.lerp(targetColor.current, 0.08);
    }
    // Keep intensity steady so the darker colour is visible rather than washing out
    if (mat0.current) mat0.current.emissiveIntensity = 6;
    // Boost glow layer opacity on hover so the halo shifts colour noticeably
    if (mat1.current) {
      mat1.current.emissiveIntensity = isHi ? 4   : 3;
      mat1.current.opacity           = isHi ? 0.55 : 0.22;
    }
    if (mat2.current) {
      mat2.current.emissiveIntensity = isHi ? 2.5 : 1.5;
      mat2.current.opacity           = isHi ? 0.22 : 0.07;
    }
  });

  return (
    <Trail width={0.45} length={10} color={color} attenuation={(t) => t * t * t}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial ref={mat0} color={color} emissive={color} emissiveIntensity={10} roughness={0} metalness={0} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.13, 12, 12]} />
          <meshStandardMaterial ref={mat1} color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.22} roughness={1} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.24, 12, 12]} />
          <meshStandardMaterial ref={mat2} color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.07} roughness={1} depthWrite={false} />
        </mesh>
      </group>
    </Trail>
  );
}

// ─── Orbital shell ───────────────────────────────────────────────────────────

function OrbitalShell({ radius, rotation, electronCount, speed, color, outerColor = "" }: {
  radius: number; rotation: [number, number, number];
  electronCount: number; speed: number; color: string; outerColor?: string;
}) {
  const phases = useMemo(
    () => Array.from({ length: electronCount }, (_, i) => (i / electronCount) * Math.PI * 2),
    [electronCount]
  );
  return (
    <group rotation={rotation}>
      {phases.map((phase, i) => (
        <Electron key={i} radius={radius} speed={speed} phase={phase} color={color} outerColor={outerColor} />
      ))}
    </group>
  );
}

// ─── Nucleus — Carbon-12 alpha-cluster model ──────────────────────────────────

const D   = 0.11;
const SQ3 = Math.sqrt(3) / 2;

const ALPHA_CENTRES: [number, number, number][] = [
  [ D,        0,       0],
  [-D / 2,  D * SQ3,  0],
  [-D / 2, -D * SQ3,  0],
];

const TETRA_OFFSETS: { d: [number, number, number]; type: "proton" | "neutron" }[] = [
  { d: [ 0.052,  0.052,  0.052], type: "neutron" },
  { d: [ 0.052, -0.052, -0.052], type: "proton"  },
  { d: [-0.052,  0.052, -0.052], type: "neutron" },
  { d: [-0.052, -0.052,  0.052], type: "proton"  },
];

const NUCLEONS: { pos: [number, number, number]; type: "proton" | "neutron" }[] =
  ALPHA_CENTRES.flatMap(([cx, cy, cz]) =>
    TETRA_OFFSETS.map(({ d, type }) => ({
      pos: [cx + d[0], cy + d[1], cz + d[2]] as [number, number, number],
      type,
    }))
  );

function Nucleon({ basePos, phase, type }: {
  basePos: [number, number, number]; phase: number; type: "proton" | "neutron";
}) {
  const highlighted = useContext(HighlightContext);
  const ref = useRef<THREE.Mesh>(null);
  const lerpColor = useRef(new THREE.Color(type === "proton" ? PROTON_IDLE : NEUTRON_IDLE));

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    const t = clock.elapsedTime;

    ref.current.position.set(
      basePos[0] + Math.sin(t * 7.1 + phase)       * 0.045,
      basePos[1] + Math.sin(t * 6.3 + phase + 1.1) * 0.045,
      basePos[2] + Math.cos(t * 5.7 + phase + 2.2) * 0.045
    );

    const baseFlicker =
      1.8 +
      Math.sin(t * 3.7 + phase * 2.1) * 0.35 +
      Math.sin(t * 11.3 + phase * 0.7) * 0.15;

    const isHi = highlighted === type;
    const brightMult = isHi ? 3.5 : 1;

    const targetColor = isHi
      ? (type === "proton" ? PROTON_HI : NEUTRON_HI)
      : (type === "proton" ? PROTON_IDLE : NEUTRON_IDLE);

    lerpColor.current.lerp(targetColor, 0.08);
    mat.color.copy(lerpColor.current);
    mat.emissive.copy(lerpColor.current);
    mat.emissiveIntensity = baseFlicker * brightMult;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color={type === "proton" ? "#ff4500" : "#7a9ab0"}
        emissive={type === "proton" ? "#ff4500" : "#7a9ab0"}
        emissiveIntensity={1.8}
        roughness={0.3}
        metalness={0.4}
      />
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
          <Nucleon key={i} basePos={n.pos} phase={i * 1.3} type={n.type} />
        ))}
      </group>
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function CarbonScene() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.09;
  });
  return (
    <group rotation={[Math.PI / 4, Math.PI / 4, Math.PI / 4]}>
      <group ref={groupRef}>
        <Nucleus />
        {/* K-shell: 2 electrons — slowed */}
        <OrbitalShell radius={1.1} rotation={[0, 0, 0]} electronCount={2} speed={2.5} color={ELECTRON_IDLE} />
        {/* L-shell: 4 electrons across 2 rings — slowed */}
        <OrbitalShell radius={1.9} rotation={[Math.PI / 4, 0, 0]}                       electronCount={2} speed={1.6} color={ELECTRON_OUTER_IDLE} outerColor={ELECTRON_OUTER_IDLE} />
        <OrbitalShell radius={1.9} rotation={[-Math.PI / 3, Math.PI / 5, Math.PI / 4]}  electronCount={2} speed={1.2} color={ELECTRON_OUTER_IDLE} outerColor={ELECTRON_OUTER_IDLE} />
      </group>
    </group>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function CarbonAtom({ highlighted = null }: { highlighted?: Highlighted }) {
  return (
    <HighlightContext.Provider value={highlighted}>
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
    </HighlightContext.Provider>
  );
}
