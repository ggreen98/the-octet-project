"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// ── Colours ──────────────────────────────────────────────────────────────────
const NA_GRAY  = new THREE.Color("#9a9a9a");
const CL_WHITE = new THREE.Color("#dcdcdc");
const NA_PINK  = new THREE.Color("#e05070");
const CL_BLUE  = new THREE.Color("#4499ff");

// ── World positions ───────────────────────────────────────────────────────────
const NA_IDLE_X   = -2.9;
const CL_IDLE_X   =  2.9;
const NA_BONDED_X = -1.1;
const CL_BONDED_X =  1.2;

// ── Na: 1 valence electron, pointing toward Cl ────────────────────────────────
const NA_E_POS: [number, number, number] = [1.05, 0, 0];

// ── Cl: Lewis-dot lone-pair layout ───────────────────────────────────────────
// 3 lone pairs (top / right / bottom) + 1 unpaired electron on the left.
// The ghost slot sits just above the unpaired electron — that's where Na's e⁻ arrives,
// turning the left side into a 4th lone pair and completing the octet.
const CL_E_POSITIONS: [number, number, number][] = [
  // top lone pair
  [-0.12,  1.18, 0],
  [ 0.12,  1.18, 0],
  // right lone pair
  [ 1.18,  0.12, 0],
  [ 1.18, -0.12, 0],
  // bottom lone pair
  [ 0.12, -1.18, 0],
  [-0.12, -1.18, 0],
  // left — unpaired before transfer (partner slot is ghost/8th)
  [-1.18, -0.09, 0],
];

// Ghost / 8th electron: directly above the left single → forms the 4th lone pair
const CL_E8_POS: [number, number, number] = [-1.18, 0.09, 0];

function ease(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

// ── Arrow helper showing electron transfer direction ──────────────────────────
function TransferArrow({ visible }: { visible: boolean }) {
  const arrow = useMemo(() => {
    const from = new THREE.Vector3(NA_IDLE_X + NA_E_POS[0], NA_E_POS[1], 0);
    const to   = new THREE.Vector3(CL_IDLE_X + CL_E8_POS[0], CL_E8_POS[1], 0);
    const dir  = to.clone().sub(from).normalize();
    const len  = from.distanceTo(to);
    const h    = new THREE.ArrowHelper(dir, from, len, 0xffff99, 0.55, 0.28);
    (h.line.material as THREE.LineBasicMaterial).opacity     = 0.75;
    (h.line.material as THREE.LineBasicMaterial).transparent = true;
    (h.cone.material as THREE.MeshBasicMaterial).opacity     = 0.85;
    (h.cone.material as THREE.MeshBasicMaterial).transparent = true;
    return h;
  }, []);

  return <primitive object={arrow} visible={visible} />;
}

// ── Scene ────────────────────────────────────────────────────────────────────
function Scene({ stage, onComplete }: { stage: number; onComplete: () => void }) {
  const [charges,    setCharges]    = useState({ na: "0", cl: "0" });
  const [naEVisible, setNaEVisible] = useState(true);

  const chargeSet = useRef(false);
  const naEHidden = useRef(false);

  const naGroupRef = useRef<THREE.Group>(null!);
  const clGroupRef = useRef<THREE.Group>(null!);
  const naMeshRef  = useRef<THREE.Mesh>(null!);
  const clMeshRef  = useRef<THREE.Mesh>(null!);
  const naERef     = useRef<THREE.Mesh>(null!);
  const travelRef  = useRef<THREE.Mesh>(null!);
  const clE8Ref    = useRef<THREE.Mesh>(null!);
  const ghostRef   = useRef<THREE.Mesh>(null!);

  const animT  = useRef(0);
  const done   = useRef(false);
  const prevSt = useRef(-1);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useFrame((_, delta) => {
    if (!naGroupRef.current || !clGroupRef.current) return;

    // ── Stage change → reset ───────────────────────────────────────────────
    if (prevSt.current !== stage) {
      prevSt.current = stage;
      animT.current  = 0;
      done.current   = false;

      if (stage === 0) {
        naGroupRef.current.position.x = NA_IDLE_X;
        clGroupRef.current.position.x = CL_IDLE_X;
        (naMeshRef.current.material as THREE.MeshStandardMaterial).color.copy(NA_GRAY);
        (clMeshRef.current.material as THREE.MeshStandardMaterial).color.copy(CL_WHITE);
        naERef.current.visible    = true;
        travelRef.current.visible = false;
        clE8Ref.current.visible   = false;
        ghostRef.current.visible  = true;
        chargeSet.current = false;
        naEHidden.current = false;
        setCharges({ na: "0", cl: "0" });
        setNaEVisible(true);
      }
    }

    if (done.current) return;

    // ── Stage 1: electron transfer ─────────────────────────────────────────
    if (stage === 1) {
      animT.current = Math.min(animT.current + delta / 3.4, 1);
      const t = animT.current;

      if (t <= 0.5) {
        // Phase A: electron flies from Na to Cl
        if (!travelRef.current.visible) {
          naERef.current.visible    = false;
          travelRef.current.visible = true;
          if (!naEHidden.current) {
            naEHidden.current = true;
            setNaEVisible(false);
          }
        }
        const p  = ease(t / 0.5);
        const sx = NA_IDLE_X + NA_E_POS[0];   // -1.85
        const sy = NA_E_POS[1];               //  0
        const ex = CL_IDLE_X + CL_E8_POS[0]; //  1.72
        const ey = CL_E8_POS[1];             //  0.09
        travelRef.current.position.set(
          sx + (ex - sx) * p,
          sy + (ey - sy) * p + Math.sin(Math.PI * p) * 0.7,
          0,
        );
      } else {
        // Phase B: electron arrives, colors shift
        travelRef.current.visible = false;
        ghostRef.current.visible  = false;
        clE8Ref.current.visible   = true;

        const p = ease((t - 0.5) / 0.5);
        (naMeshRef.current.material as THREE.MeshStandardMaterial).color.lerpColors(NA_GRAY, NA_PINK, p);
        (clMeshRef.current.material as THREE.MeshStandardMaterial).color.lerpColors(CL_WHITE, CL_BLUE, p);

        if (!chargeSet.current) {
          chargeSet.current = true;
          setCharges({ na: "+", cl: "−" });
        }
      }

      if (t >= 1 && !done.current) {
        done.current = true;
        onCompleteRef.current();
      }
    }

    // ── Stage 3: atoms attract ─────────────────────────────────────────────
    if (stage === 3) {
      animT.current = Math.min(animT.current + delta / 1.3, 1);
      const p = ease(animT.current);
      naGroupRef.current.position.x = NA_IDLE_X + (NA_BONDED_X - NA_IDLE_X) * p;
      clGroupRef.current.position.x = CL_IDLE_X + (CL_BONDED_X - CL_IDLE_X) * p;

      if (animT.current >= 1 && !done.current) {
        done.current = true;
        onCompleteRef.current();
      }
    }
  });

  const eMat = {
    color: "#ffffdd" as unknown as THREE.ColorRepresentation,
    emissive: "#ffffdd" as unknown as THREE.ColorRepresentation,
    emissiveIntensity: 2.2,
    roughness: 0,
    metalness: 0,
  };

  const naColor = charges.na === "+" ? "#e05070" : "#aaaaaa";
  const clColor = charges.cl === "−" ? "#4499ff" : "#bbbbbb";

  const eLabel: React.CSSProperties = {
    color: "#ffffcc",
    fontSize: "9px",
    fontFamily: "monospace",
    whiteSpace: "nowrap",
    textShadow: "0 0 6px #000, 0 0 10px #000",
    opacity: 0.95,
    userSelect: "none",
  };

  // Midpoint of the transfer arrow (world space)
  const arrowMidX = (NA_IDLE_X + NA_E_POS[0] + CL_IDLE_X + CL_E8_POS[0]) / 2; // ≈ -0.065

  return (
    <>
      <OrbitControls enablePan={false} minDistance={5} maxDistance={14} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#223344", "#111122", 0.5]} />
      <pointLight position={[6, 6, 6]} intensity={1.4} />
      <pointLight position={[-5, 4, -4]} intensity={0.6} color="#8899ff" />

      {/* Arrow: Na valence e⁻ → Cl empty slot */}
      <TransferArrow visible={stage <= 1} />

      {/* Arrow mid-label */}
      {stage <= 1 && (
        <Html position={[arrowMidX, 0.52, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div style={{ ...eLabel, color: "#ffff99", fontSize: "8px" }}>e⁻ transfer</div>
        </Html>
      )}

      {/* ── Na group ─────────────────────────────────────────────────────── */}
      <group ref={naGroupRef} position={[NA_IDLE_X, 0, 0]}>
        <mesh ref={naMeshRef}>
          <sphereGeometry args={[0.86, 48, 48]} />
          <meshStandardMaterial color={NA_GRAY} roughness={0.44} metalness={0.08} />
        </mesh>

        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div style={{ fontFamily: "monospace", fontWeight: 700, textAlign: "center", lineHeight: 1.1, userSelect: "none" }}>
            <div style={{ fontSize: "11px", color: naColor, transition: "color 0.6s" }}>Na</div>
            <div style={{ fontSize: "10px", color: naColor, transition: "color 0.6s" }}>{charges.na}</div>
          </div>
        </Html>

        {/* Na valence electron (hidden during transfer) */}
        <mesh ref={naERef} position={NA_E_POS}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial {...eMat} />
        </mesh>

        {/* Label: Na's 1 valence electron */}
        {naEVisible && (
          <Html
            position={[NA_E_POS[0] + 0.15, NA_E_POS[1] + 0.42, 0]}
            center
            distanceFactor={8}
            style={{ pointerEvents: "none" }}
          >
            <div style={eLabel}>
              1 valence e⁻
            </div>
          </Html>
        )}
      </group>

      {/* ── Cl group ─────────────────────────────────────────────────────── */}
      <group ref={clGroupRef} position={[CL_IDLE_X, 0, 0]}>
        <mesh ref={clMeshRef}>
          <sphereGeometry args={[0.92, 48, 48]} />
          <meshStandardMaterial color={CL_WHITE} roughness={0.44} metalness={0.08} />
        </mesh>

        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div style={{ fontFamily: "monospace", fontWeight: 700, textAlign: "center", lineHeight: 1.1, userSelect: "none" }}>
            <div style={{ fontSize: "11px", color: clColor, transition: "color 0.6s" }}>Cl</div>
            <div style={{ fontSize: "10px", color: clColor, transition: "color 0.6s" }}>{charges.cl}</div>
          </div>
        </Html>

        {/* Label: Cl valence electrons */}
        <Html position={[0, 1.68, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div style={eLabel}>7 valence e⁻</div>
        </Html>

        {/* 7 valence electrons — 3 lone pairs + 1 unpaired (Lewis-dot layout) */}
        {CL_E_POSITIONS.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial {...eMat} />
          </mesh>
        ))}

        {/* Ghost: faint partner slot above the left unpaired electron */}
        <mesh ref={ghostRef} position={CL_E8_POS}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.18} roughness={0} />
        </mesh>

        {/* 8th electron — appears after transfer, completes the 4th lone pair */}
        <mesh ref={clE8Ref} visible={false} position={CL_E8_POS}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial {...eMat} />
        </mesh>
      </group>

      {/* Traveling electron (world space, visible during flight) */}
      <mesh ref={travelRef} visible={false} position={[NA_IDLE_X + NA_E_POS[0], NA_E_POS[1], 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial {...eMat} />
      </mesh>
    </>
  );
}

// ── Canvas wrapper ────────────────────────────────────────────────────────────
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
