"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

export type Mol = "H2" | "HCl" | "O2";

// Box-Muller Gaussian sample
function gaussian() {
  return (
    Math.sqrt(-2 * Math.log(Math.max(Math.random(), 1e-10))) *
    Math.cos(2 * Math.PI * Math.random())
  );
}

// ── Molecule data ─────────────────────────────────────────────────────────────

interface CloudDef {
  cx: number; cy: number; cz: number;
  sigmaX: number; sigmaY: number;
  count: number;
  color: string;
  maxOpacity: number;
}

interface MolDef {
  leftPos:    [number, number, number];
  leftR:      number;
  leftColor:  string;
  leftLabel:  string;
  rightPos:   [number, number, number];
  rightR:     number;
  rightColor: string;
  rightLabel: string;
  clouds:     CloudDef[];
  polarity:   "NONPOLAR" | "POLAR";
  bondType:   string;
}

const MOLS: Record<Mol, MolDef> = {
  H2: {
    leftPos:    [-1.55, 0, 0], leftR:  0.50, leftColor:  "#c0c0c0", leftLabel:  "H",
    rightPos:   [ 1.55, 0, 0], rightR: 0.50, rightColor: "#c0c0c0", rightLabel: "H",
    clouds: [
      { cx: 0, cy: 0, cz: 0, sigmaX: 0.88, sigmaY: 0.52, count: 400, color: "#34d399", maxOpacity: 0.060 },
    ],
    polarity: "NONPOLAR", bondType: "SINGLE BOND",
  },
  HCl: {
    leftPos:    [-2.10, 0, 0], leftR:  0.46, leftColor:  "#c0c0c0", leftLabel:  "H",
    rightPos:   [ 1.85, 0, 0], rightR: 0.82, rightColor: "#66bb66", rightLabel: "Cl",
    clouds: [
      { cx: 0.38, cy: 0, cz: 0, sigmaX: 0.80, sigmaY: 0.48, count: 400, color: "#a855f7", maxOpacity: 0.068 },
    ],
    polarity: "POLAR", bondType: "SINGLE BOND",
  },
  O2: {
    leftPos:    [-1.64, 0, 0], leftR:  0.65, leftColor:  "#ff6655", leftLabel:  "O",
    rightPos:   [ 1.64, 0, 0], rightR: 0.65, rightColor: "#ff6655", rightLabel: "O",
    clouds: [
      // sigma bond — along the internuclear axis
      { cx: 0, cy: 0,     cz: 0, sigmaX: 0.84, sigmaY: 0.36, count: 280, color: "#60a5fa", maxOpacity: 0.062 },
      // pi bond — two lobes above and below the axis
      { cx: 0, cy:  0.64, cz: 0, sigmaX: 0.72, sigmaY: 0.22, count: 190, color: "#60a5fa", maxOpacity: 0.068 },
      { cx: 0, cy: -0.64, cz: 0, sigmaX: 0.72, sigmaY: 0.22, count: 190, color: "#60a5fa", maxOpacity: 0.068 },
    ],
    polarity: "NONPOLAR", bondType: "DOUBLE BOND",
  },
};

// ── Electron density cloud (instanced) ───────────────────────────────────────

function ElectronDensityCloud({ cfg, visible }: { cfg: CloudDef; visible: boolean }) {
  const meshRef    = useRef<THREE.InstancedMesh>(null!);
  const opacityRef = useRef(0);

  const matrices = useMemo(() => {
    const dummy = new THREE.Object3D();
    const result: THREE.Matrix4[] = [];
    for (let i = 0; i < cfg.count; i++) {
      dummy.position.set(
        cfg.cx + gaussian() * cfg.sigmaX,
        cfg.cy + gaussian() * cfg.sigmaY,
        cfg.cz + gaussian() * cfg.sigmaY,
      );
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      result.push(dummy.matrix.clone());
    }
    return result;
  }, [cfg.cx, cfg.cy, cfg.cz, cfg.sigmaX, cfg.sigmaY, cfg.count]);

  useEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((mat, i) => meshRef.current.setMatrixAt(i, mat));
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = visible ? cfg.maxOpacity : 0;
    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, delta * 3.5);
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacityRef.current;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, cfg.count]}>
      <sphereGeometry args={[0.07, 6, 6]} />
      <meshBasicMaterial color={cfg.color} transparent opacity={0} depthWrite={false} />
    </instancedMesh>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────

function Scene({ mol, showDensity }: { mol: Mol; showDensity: boolean }) {
  const data = MOLS[mol];

  const labelStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontWeight: 700,
    fontSize: "11px",
    userSelect: "none",
    textShadow: "0 0 8px #000, 0 0 14px #000",
    pointerEvents: "none",
    color: "#ffffff",
  };

  const noteStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "7px",
    userSelect: "none",
    pointerEvents: "none",
    letterSpacing: "0.1em",
    textShadow: "0 0 8px #000",
  };

  const densityLabelColor =
    data.polarity === "POLAR" ? "rgba(168,85,247,0.8)" : "rgba(52,211,153,0.7)";

  return (
    <>
      <OrbitControls enablePan={false} minDistance={4} maxDistance={16} />

      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#223344", "#111122", 0.55]} />
      <pointLight position={[6, 6, 6]} intensity={1.4} />
      <pointLight position={[-5, 4, -4]} intensity={0.6} color="#8899ff" />

      {/* Left atom */}
      <mesh position={data.leftPos}>
        <sphereGeometry args={[data.leftR, 52, 52]} />
        <meshStandardMaterial color={data.leftColor} roughness={0.42} metalness={0.06} />
      </mesh>
      <Html position={data.leftPos} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div style={labelStyle}>{data.leftLabel}</div>
      </Html>

      {/* δ⁺ label on H when polar and density shown */}
      {mol === "HCl" && showDensity && (
        <Html
          position={[data.leftPos[0], data.leftR + 0.7, 0]}
          center distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <div style={{ ...noteStyle, color: "#60a5fa", fontSize: "9px" }}>δ⁺</div>
        </Html>
      )}

      {/* Right atom */}
      <mesh position={data.rightPos}>
        <sphereGeometry args={[data.rightR, 52, 52]} />
        <meshStandardMaterial color={data.rightColor} roughness={0.42} metalness={0.06} />
      </mesh>
      <Html position={data.rightPos} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div style={labelStyle}>{data.rightLabel}</div>
      </Html>

      {/* δ⁻ label on Cl when polar and density shown */}
      {mol === "HCl" && showDensity && (
        <Html
          position={[data.rightPos[0], data.rightR + 0.7, 0]}
          center distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <div style={{ ...noteStyle, color: "#a855f7", fontSize: "9px" }}>δ⁻</div>
        </Html>
      )}

      {/* Electron density clouds — keyed on mol so they remount on molecule switch */}
      {data.clouds.map((cfg, i) => (
        <ElectronDensityCloud key={`${mol}-${i}`} cfg={cfg} visible={showDensity} />
      ))}

      {/* Bond type annotation */}
      {showDensity && (
        <Html position={[0, -2.4, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div style={{ ...noteStyle, color: densityLabelColor }}>
            {data.bondType} · {data.polarity}
          </div>
        </Html>
      )}

      {/* Drag hint */}
      {!showDensity && (
        <Html position={[0, -2.4, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div style={{ ...noteStyle, color: "rgba(255,255,255,0.25)" }}>DRAG TO ROTATE</div>
        </Html>
      )}
    </>
  );
}

// ── Canvas export ─────────────────────────────────────────────────────────────

export default function CovalentBond3D({
  mol,
  showDensity,
}: {
  mol: Mol;
  showDensity: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 8.5], fov: 50 }}
      style={{ height: "320px", width: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene mol={mol} showDensity={showDensity} />
    </Canvas>
  );
}
