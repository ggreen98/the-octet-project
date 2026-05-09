"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ── Colours ─────────────────────────────────────────────────────────────────
const NA_GRAY  = new THREE.Color("#9a9a9a");   // neutral gray
const CL_WHITE = new THREE.Color("#dcdcdc");   // off-white
const NA_PINK  = new THREE.Color("#e05070");   // reddish-pink (positive cation)
const CL_BLUE  = new THREE.Color("#4499ff");   // blue (negative anion)

// ── World positions ──────────────────────────────────────────────────────────
const NA_IDLE   = new THREE.Vector3(-2.9, 0, 0);
const CL_IDLE   = new THREE.Vector3( 2.9, 0, 0);
const NA_BONDED = new THREE.Vector3(-1.1, 0, 0);
const CL_BONDED = new THREE.Vector3( 1.2, 0, 0);

// ── Cl valence electron offsets (relative to Cl centre, Lewis-dot layout) ───
// 7 electrons: 3 pairs + 1 lone on the left (gap = 2nd slot of that pair)
const CL_E: [number, number, number][] = [
  [-0.16,  1.18, 0], [ 0.16,  1.18, 0],   // top pair
  [ 1.18,  0.16, 0], [ 1.18, -0.16, 0],   // right pair
  [-0.16, -1.18, 0], [ 0.16, -1.18, 0],   // bottom pair
  [-1.18, -0.13, 0],                        // left lone (will gain partner)
];
const CL_GAP: [number, number, number] = [-1.18, 0.13, 0]; // destination of Na's electron

// Na's lone valence electron offset from Na centre
const NA_E_OFF: [number, number, number] = [0.95, 0, 0];

// ── Helpers ──────────────────────────────────────────────────────────────────
function ease(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

// ── Three.js scene (runs inside Canvas) ─────────────────────────────────────
function Scene({
  stage,
  onComplete,
}: {
  stage: number;
  onComplete: () => void;
}) {
  const naRef    = useRef<THREE.Mesh>(null!);
  const clRef    = useRef<THREE.Mesh>(null!);
  const naERef   = useRef<THREE.Mesh>(null!);   // Na's lone electron (travels)
  const clE8Ref  = useRef<THREE.Mesh>(null!);   // 8th electron after transfer
  const ghostRef = useRef<THREE.Mesh>(null!);   // faint gap indicator
  const clERefs  = useRef<(THREE.Mesh | null)[]>([]);

  const animT   = useRef(0);
  const done    = useRef(false);
  const prevSt  = useRef(-1);

  // Stable ref so useFrame always calls the current onComplete
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useFrame((_, delta) => {
    if (!naRef.current || !clRef.current || !naERef.current || !clE8Ref.current) return;

    // ── Stage change: reset progress ────────────────────────────────────────
    if (prevSt.current !== stage) {
      prevSt.current = stage;
      animT.current  = 0;
      done.current   = false;

      if (stage === 0) {
        // Snap everything back to idle
        naRef.current.position.copy(NA_IDLE);
        clRef.current.position.copy(CL_IDLE);
        (naRef.current.material as THREE.MeshStandardMaterial).color.copy(NA_GRAY);
        (clRef.current.material as THREE.MeshStandardMaterial).color.copy(CL_WHITE);

        naERef.current.position.set(NA_IDLE.x + NA_E_OFF[0], NA_E_OFF[1], NA_E_OFF[2]);
        naERef.current.visible  = true;
        clE8Ref.current.visible = false;
        ghostRef.current.visible = true;

        clE8Ref.current.position.set(CL_IDLE.x + CL_GAP[0], CL_GAP[1], CL_GAP[2]);
        ghostRef.current.position.set(CL_IDLE.x + CL_GAP[0], CL_GAP[1], CL_GAP[2]);
        clERefs.current.forEach((m, i) => {
          if (m) m.position.set(CL_IDLE.x + CL_E[i][0], CL_E[i][1], CL_E[i][2]);
        });
      }
    }

    if (done.current) return;

    // ── Stage 1: electron transfer (0→0.5) then colour change (0.5→1) ───────
    if (stage === 1) {
      animT.current = Math.min(animT.current + delta / 3.4, 1);
      const t = animT.current;

      if (t <= 0.5) {
        const p  = ease(t / 0.5);
        const sx = NA_IDLE.x + NA_E_OFF[0];
        const ex = CL_IDLE.x + CL_GAP[0];
        naERef.current.position.set(
          sx + (ex - sx) * p,
          Math.sin(Math.PI * p) * 0.5,   // arc upward through the gap
          0
        );
      } else {
        // Electron has arrived — swap to Cl's 8th dot
        naERef.current.visible   = false;
        ghostRef.current.visible = false;
        clE8Ref.current.visible  = true;
        clE8Ref.current.position.set(CL_IDLE.x + CL_GAP[0], CL_GAP[1], CL_GAP[2]);

        // Lerp atom colours
        const p = ease((t - 0.5) / 0.5);
        (naRef.current.material as THREE.MeshStandardMaterial).color.lerpColors(NA_GRAY, NA_PINK, p);
        (clRef.current.material as THREE.MeshStandardMaterial).color.lerpColors(CL_WHITE, CL_BLUE, p);
      }

      if (t >= 1 && !done.current) {
        done.current = true;
        onCompleteRef.current();
      }
    }

    // ── Stage 3: atoms attract ───────────────────────────────────────────────
    if (stage === 3) {
      animT.current = Math.min(animT.current + delta / 1.3, 1);
      const p = ease(animT.current);

      const naX = NA_IDLE.x + (NA_BONDED.x - NA_IDLE.x) * p;
      const clX = CL_IDLE.x + (CL_BONDED.x - CL_IDLE.x) * p;

      naRef.current.position.x = naX;
      clRef.current.position.x = clX;

      // Keep Cl electrons attached to Cl
      clERefs.current.forEach((m, i) => {
        if (m) m.position.x = clX + CL_E[i][0];
      });
      clE8Ref.current.position.x = clX + CL_GAP[0];

      if (animT.current >= 1 && !done.current) {
        done.current = true;
        onCompleteRef.current();
      }
    }
  });

  // Shared emissive electron material props
  const eMat = { color: "#ffffdd", emissive: "#ffffdd" as unknown as THREE.ColorRepresentation, emissiveIntensity: 2.2, roughness: 0, metalness: 0 };

  return (
    <>
      <OrbitControls enablePan={false} minDistance={5} maxDistance={14} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#223344", "#111122", 0.5]} />
      <pointLight position={[6, 6, 6]} intensity={1.4} />
      <pointLight position={[-5, 4, -4]} intensity={0.6} color="#8899ff" />

      {/* ── Na atom ─────────────────────────────────────────────────────── */}
      <mesh ref={naRef} position={NA_IDLE.toArray() as [number, number, number]}>
        <sphereGeometry args={[0.86, 48, 48]} />
        <meshStandardMaterial color={NA_GRAY} roughness={0.44} metalness={0.08} />
      </mesh>

      {/* Na lone valence electron */}
      <mesh ref={naERef} position={[NA_IDLE.x + NA_E_OFF[0], NA_E_OFF[1], NA_E_OFF[2]]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial {...eMat} />
      </mesh>

      {/* ── Cl atom ─────────────────────────────────────────────────────── */}
      <mesh ref={clRef} position={CL_IDLE.toArray() as [number, number, number]}>
        <sphereGeometry args={[0.92, 48, 48]} />
        <meshStandardMaterial color={CL_WHITE} roughness={0.44} metalness={0.08} />
      </mesh>

      {/* Cl's 7 valence electrons */}
      {CL_E.map((off, i) => (
        <mesh
          key={i}
          ref={el => { clERefs.current[i] = el; }}
          position={[CL_IDLE.x + off[0], off[1], off[2]]}
        >
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial {...eMat} />
        </mesh>
      ))}

      {/* Ghost electron — faint placeholder at gap */}
      <mesh ref={ghostRef} position={[CL_IDLE.x + CL_GAP[0], CL_GAP[1], CL_GAP[2]]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} roughness={0} />
      </mesh>

      {/* 8th electron — hidden until transfer completes */}
      <mesh ref={clE8Ref} visible={false} position={[CL_IDLE.x + CL_GAP[0], CL_GAP[1], CL_GAP[2]]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial {...eMat} />
      </mesh>
    </>
  );
}

// ── Canvas wrapper (default export for dynamic import) ───────────────────────
export default function IonicBond3D({
  stage,
  onComplete,
}: {
  stage: number;
  onComplete: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 9.5], fov: 52 }}
      style={{ height: "340px", width: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene stage={stage} onComplete={onComplete} />
    </Canvas>
  );
}
