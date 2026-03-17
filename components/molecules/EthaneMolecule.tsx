"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Ethane (C2H6) geometry ─────────────────────────────────────────────────
// C-C bond: 1.54 Å, C-H bond: 1.09 Å, H-C-C angle: 111.5°
// Staggered conformation. Scaled to visual units.

const CARBON_COLOR   = "#4488cc";
const HYDROGEN_COLOR = "#ddeeff";
const BOND_COLOR     = "#445566";

const C1: [number, number, number] = [-0.77, 0, 0];
const C2: [number, number, number] = [ 0.77, 0, 0];

const HYDROGENS: [number, number, number][] = [
  // Around C1 (staggered, 120° apart, 111.5° from C-C axis)
  [-1.169,  1.014,  0    ],
  [-1.169, -0.507,  0.878],
  [-1.169, -0.507, -0.878],
  // Around C2 (rotated 60° for staggered conformation)
  [ 1.169,  0.507,  0.878],
  [ 1.169, -1.014,  0    ],
  [ 1.169,  0.507, -0.878],
];

const BONDS: [[number,number,number],[number,number,number]][] = [
  [C1, C2],
  [C1, HYDROGENS[0]], [C1, HYDROGENS[1]], [C1, HYDROGENS[2]],
  [C2, HYDROGENS[3]], [C2, HYDROGENS[4]], [C2, HYDROGENS[5]],
];

// ─── Bond ────────────────────────────────────────────────────────────────────

function Bond({ start, end }: { start: [number,number,number]; end: [number,number,number] }) {
  const ref = useRef<THREE.Mesh>(null);

  const startV = new THREE.Vector3(...start);
  const endV   = new THREE.Vector3(...end);
  const mid    = startV.clone().add(endV).multiplyScalar(0.5);
  const length = startV.distanceTo(endV);
  const dir    = endV.clone().sub(startV).normalize();
  const quat   = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

  return (
    <mesh ref={ref} position={mid.toArray()} quaternion={[quat.x, quat.y, quat.z, quat.w]}>
      <cylinderGeometry args={[0.055, 0.055, length, 8]} />
      <meshStandardMaterial
        color={BOND_COLOR}
        emissive={BOND_COLOR}
        emissiveIntensity={0.3}
        roughness={0.5}
        metalness={0.3}
      />
    </mesh>
  );
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function EthaneScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* C-C and C-H bonds */}
      {BONDS.map(([start, end], i) => (
        <Bond key={i} start={start} end={end} />
      ))}

      {/* Carbon atoms */}
      {[C1, C2].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial
            color={CARBON_COLOR}
            emissive={CARBON_COLOR}
            emissiveIntensity={0.6}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
      ))}

      {/* Hydrogen atoms */}
      {HYDROGENS.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial
            color={HYDROGEN_COLOR}
            emissive={HYDROGEN_COLOR}
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export function EthaneMolecule() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 4, 4]}   intensity={1.5} color="#aaccff" decay={2} />
      <pointLight position={[-3, -2, -2]} intensity={0.8} color="#00ff41" decay={2} />
      <EthaneScene />
    </Canvas>
  );
}
