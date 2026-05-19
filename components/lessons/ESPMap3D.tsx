"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

export type ESPMol = "O2" | "H2O";

// ── Color scale: red (negative/e⁻-rich) → green (neutral) → blue (positive/e⁻-poor) ──

const COLORMAP: [number, number, number][] = [
  [0.94, 0.07, 0.07], // red
  [0.96, 0.44, 0.03], // orange
  [0.06, 0.72, 0.06], // green
  [0.04, 0.58, 0.94], // cyan
  [0.04, 0.04, 0.94], // blue
];

function espColor(t: number): [number, number, number] {
  const c   = Math.max(0, Math.min(1, t));
  const raw = c * (COLORMAP.length - 1);
  const lo  = Math.floor(raw);
  const hi  = Math.min(lo + 1, COLORMAP.length - 1);
  const f   = raw - lo;
  return [
    COLORMAP[lo][0] + (COLORMAP[hi][0] - COLORMAP[lo][0]) * f,
    COLORMAP[lo][1] + (COLORMAP[hi][1] - COLORMAP[lo][1]) * f,
    COLORMAP[lo][2] + (COLORMAP[hi][2] - COLORMAP[lo][2]) * f,
  ];
}

// ── Isosurface sampling ───────────────────────────────────────────────────────

interface Pt { pos: [number, number, number]; t: number }

function sampleO2(n: number): Pt[] {
  const AX = 1.21;

  // Approximate valence electron density (sum of Slater-like AOs)
  const rho = (x: number, y: number, z: number) => {
    const dL = Math.sqrt((x + AX) ** 2 + y * y + z * z);
    const dR = Math.sqrt((x - AX) ** 2 + y * y + z * z);
    return Math.exp(-2.1 * dL) + Math.exp(-2.1 * dR);
  };

  // Simplified ESP on the isosurface:
  //   most negative (red)  → outer axial lone-pair caps
  //   mid-range (yellow)   → equatorial pi-bond lobes
  //   least negative (blue)→ sigma bond region between atoms
  const esp = (x: number, y: number, z: number) => {
    const r2     = y * y + z * z;
    const rTotal = Math.sqrt(x * x + r2 + 1e-4);
    const capL   = x < -AX ? ((-AX - x) / rTotal) ** 2 : 0;
    const capR   = x >  AX ? ((x  - AX) / rTotal) ** 2 : 0;
    const equat  = Math.sqrt(r2) / rTotal;
    const bond   = Math.max(0, 1 - Math.abs(x) / AX) * Math.exp(-2 * Math.sqrt(r2));
    return -(capL + capR) - equat * 0.55 - bond * 0.10;
  };

  const ISO = 0.18, BAND = 0.10;
  const raw: { pos: [number, number, number]; e: number }[] = [];
  let eMin = Infinity, eMax = -Infinity;
  let tries = 0;
  while (raw.length < n && tries < n * 40) {
    tries++;
    const x = (Math.random() * 2 - 1) * 2.5;
    const y = (Math.random() * 2 - 1) * 2.5;
    const z = (Math.random() * 2 - 1) * 2.5;
    if (Math.abs(rho(x, y, z) - ISO) < BAND) {
      const e = esp(x, y, z);
      if (e < eMin) eMin = e;
      if (e > eMax) eMax = e;
      raw.push({ pos: [x, y, z], e });
    }
  }
  const span = Math.max(eMax - eMin, 1e-6);
  return raw.map(p => ({ pos: p.pos, t: (p.e - eMin) / span }));
}

function sampleH2O(n: number): Pt[] {
  // O₂ bond angle ~104.5°; O-H bond ~0.96 Å (world units ≈ Å here)
  const OX = 0, OY = 0.20;
  const HLX = -0.76, HRX = 0.76, HY = -0.59;

  const rho = (x: number, y: number, z: number) => {
    const dO  = Math.sqrt((x - OX) ** 2 + (y - OY) ** 2 + z * z);
    const dHL = Math.sqrt((x - HLX) ** 2 + (y - HY) ** 2 + z * z);
    const dHR = Math.sqrt((x - HRX) ** 2 + (y - HY) ** 2 + z * z);
    // O (Z_eff ≈ 4.55) contributes more density than each H (Z_eff ≈ 1)
    return 3.0 * Math.exp(-2.3 * dO) + 0.52 * Math.exp(-2.3 * dHL) + 0.52 * Math.exp(-2.3 * dHR);
  };

  // Simplified ESP:
  //   near H nuclei → nuclear charge dominates → positive (blue)
  //   near O lone pairs (above O) → lone pairs dominate → negative (red)
  //   bond region → intermediate (green)
  const esp = (x: number, y: number, z: number) => {
    const dHL    = Math.sqrt((x - HLX) ** 2 + (y - HY) ** 2 + z * z);
    const dHR    = Math.sqrt((x - HRX) ** 2 + (y - HY) ** 2 + z * z);
    const minDH  = Math.min(dHL, dHR);
    const dO     = Math.sqrt((x - OX) ** 2 + (y - OY) ** 2 + z * z);
    // lone pairs point upward from O; boost negative contribution in that region
    const loneBias = (y - OY) > -0.1 ? 1.55 : 0.75;
    const hPos   = 2.4 * Math.exp(-2.5 * minDH);
    const oNeg   = 1.9 * Math.exp(-1.9 * dO) * loneBias;
    return hPos - oNeg;
  };

  const ISO = 0.25, BAND = 0.13;
  const raw: { pos: [number, number, number]; e: number }[] = [];
  let eMin = Infinity, eMax = -Infinity;
  let tries = 0;
  while (raw.length < n && tries < n * 55) {
    tries++;
    const x = (Math.random() * 2 - 1) * 2.0;
    const y = (Math.random() * 2 - 1) * 2.2;
    const z = (Math.random() * 2 - 1) * 1.6;
    if (Math.abs(rho(x, y, z) - ISO) < BAND) {
      const e = esp(x, y, z);
      if (e < eMin) eMin = e;
      if (e > eMax) eMax = e;
      raw.push({ pos: [x, y, z], e });
    }
  }
  const span = Math.max(eMax - eMin, 1e-6);
  return raw.map(p => ({ pos: p.pos, t: (p.e - eMin) / span }));
}

// ── Instanced surface mesh ────────────────────────────────────────────────────

function ESPSurface({ mol }: { mol: ESPMol }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);

  const pts = useMemo(() => (mol === "O2" ? sampleO2(2400) : sampleH2O(2400)), [mol]);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const col   = new THREE.Color();
    pts.forEach((p, i) => {
      dummy.position.set(p.pos[0], p.pos[1], p.pos[2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      const [r, g, b] = espColor(p.t);
      col.setRGB(r, g, b);
      meshRef.current.setColorAt(i, col);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [pts]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, pts.length]}>
      <sphereGeometry args={[0.066, 5, 5]} />
      <meshLambertMaterial />
    </instancedMesh>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────

const ATOMS: Record<ESPMol, { pos: [number, number, number]; r: number; color: string; label: string }[]> = {
  O2: [
    { pos: [-1.21, 0, 0], r: 0.19, color: "#cc4444", label: "O" },
    { pos: [ 1.21, 0, 0], r: 0.19, color: "#cc4444", label: "O" },
  ],
  H2O: [
    { pos: [0,     0.20, 0], r: 0.22, color: "#cc4444", label: "O" },
    { pos: [-0.76, -0.59, 0], r: 0.13, color: "#aaaaaa", label: "H" },
    { pos: [ 0.76, -0.59, 0], r: 0.13, color: "#aaaaaa", label: "H" },
  ],
};

function Scene({ mol }: { mol: ESPMol }) {
  const lbl: React.CSSProperties = {
    fontFamily: "monospace", fontWeight: 700, fontSize: "10px",
    color: "#fff", textShadow: "0 0 8px #000, 0 0 16px #000",
    userSelect: "none", pointerEvents: "none",
  };
  const hint: React.CSSProperties = {
    fontFamily: "monospace", fontSize: "7px", letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.2)", userSelect: "none", pointerEvents: "none",
  };

  return (
    <>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={15} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#223344", "#111122", 0.55]} />
      <pointLight position={[5, 5, 5]} intensity={1.3} />
      <pointLight position={[-4, 3, -3]} intensity={0.55} color="#aabbff" />

      <ESPSurface mol={mol} />

      {/* Nucleus markers */}
      {ATOMS[mol].map((a, i) => (
        <group key={i}>
          <mesh position={a.pos}>
            <sphereGeometry args={[a.r, 24, 24]} />
            <meshStandardMaterial color={a.color} roughness={0.28} metalness={0.08} />
          </mesh>
          <Html position={a.pos} center distanceFactor={8} style={{ pointerEvents: "none" }}>
            <div style={lbl}>{a.label}</div>
          </Html>
        </group>
      ))}

      <Html position={[0, -2.7, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div style={hint}>DRAG TO ROTATE</div>
      </Html>
    </>
  );
}

// ── Canvas ────────────────────────────────────────────────────────────────────

export default function ESPMap3D({ mol }: { mol: ESPMol }) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 7.2], fov: 52 }}
      style={{ height: "320px", width: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene mol={mol} />
    </Canvas>
  );
}
