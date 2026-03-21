"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

// ── Thin-film interference shader ─────────────────────────────────────────────
// Physically based: OPD = 2 * n * d * cos(θ), phase per RGB wavelength.
// Oxide thickness varies by world-Y so each hopper step gets a distinct color.

const vertexShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vNormal   = normalize(normalMatrix * normal);
    vViewDir  = normalize(cameraPosition - worldPos.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;

  uniform float uThicknessMin;  // nm
  uniform float uThicknessMax;  // nm
  uniform float uIOR;
  uniform float uTime;
  uniform vec3  uLightDir;

  const float PI = 3.14159265;

  // RGB wavelengths in nm
  const float WL_R = 680.0;
  const float WL_G = 550.0;
  const float WL_B = 440.0;

  vec3 thinFilm(float cosAngle, float thickness) {
    float opd  = 2.0 * uIOR * thickness * cosAngle;
    float phiR = 2.0 * PI * opd / WL_R;
    float phiG = 2.0 * PI * opd / WL_G;
    float phiB = 2.0 * PI * opd / WL_B;
    return vec3(
      0.5 + 0.5 * cos(phiR),
      0.5 + 0.5 * cos(phiG),
      0.5 + 0.5 * cos(phiB)
    );
  }

  void main() {
    vec3  N       = normalize(vNormal);
    vec3  V       = normalize(vViewDir);
    float cosView = abs(dot(N, V));

    // Each hopper step sits at a different world-Y.
    // Map Y → oxide thickness so adjacent steps get different colors.
    // We take fract so the color sequence repeats across step levels,
    // giving the classic multi-band bismuth rainbow.
    float stepT = fract(vWorldPos.y * 1.8 + 0.3);
    float thickness = mix(uThicknessMin, uThicknessMax, stepT);

    // Slight per-fragment variation so within a step it's not perfectly flat
    float micro = sin(vWorldPos.x * 40.0) * sin(vWorldPos.z * 40.0) * 0.04;
    thickness += (uThicknessMax - uThicknessMin) * micro;

    vec3 iridColor = thinFilm(cosView, thickness);

    // Metallic silvery base (bismuth is a silvery metal underneath the oxide)
    vec3 base = vec3(0.62, 0.65, 0.68);

    // Fresnel — more iridescence at grazing angles
    float fresnel = pow(1.0 - cosView, 1.8);

    // Diffuse lighting
    vec3  L       = normalize(uLightDir);
    float diff    = max(dot(N, L), 0.0) * 0.4 + 0.35;

    // Specular highlight
    vec3  H    = normalize(V + L);
    float spec = pow(max(dot(N, H), 0.0), 120.0) * 0.9;

    // Blend base + iridescence, weighted toward iridescence
    vec3 color = mix(base, iridColor, 0.55 + fresnel * 0.35);
    color *= diff;
    color += vec3(spec);

    // Boost saturation slightly
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma), color, 1.35);

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

// ── Frame geometry (square ring, extruded flat) ───────────────────────────────

function makeFrame(outerSize: number, wall: number, depth: number): THREE.ExtrudeGeometry {
  const h = outerSize / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-h, -h);
  shape.lineTo( h, -h);
  shape.lineTo( h,  h);
  shape.lineTo(-h,  h);
  shape.closePath();

  const innerSize = outerSize - wall * 2;
  if (innerSize > 0.02) {
    const ih = innerSize / 2;
    const hole = new THREE.Path();
    hole.moveTo(-ih, -ih);
    hole.lineTo( ih, -ih);
    hole.lineTo( ih,  ih);
    hole.lineTo(-ih,  ih);
    hole.closePath();
    shape.holes.push(hole);
  }

  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
}

// ── Hopper arm ────────────────────────────────────────────────────────────────

interface ArmProps {
  steps: number;
  startSize: number;
  stepDelta: number;
  wall: number;
  frameDepth: number;
  stepRise: number;
  mat: THREE.ShaderMaterial;
}

function HopperArm({ steps, startSize, stepDelta, wall, frameDepth, stepRise, mat }: ArmProps) {
  const geos = useMemo(() => (
    Array.from({ length: steps }, (_, i) => {
      const size = startSize - i * stepDelta;
      return size > wall * 2 + 0.02 ? makeFrame(size, wall, frameDepth) : null;
    })
  ), [steps, startSize, stepDelta, wall, frameDepth]);

  return (
    <group>
      {geos.map((geo, i) =>
        geo ? (
          <mesh
            key={i}
            geometry={geo}
            material={mat}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, i * stepRise, 0]}
          />
        ) : null
      )}
    </group>
  );
}

// ── Full crystal scene ────────────────────────────────────────────────────────

function BismuthScene() {
  const clusterRef = useRef<THREE.Group>(null);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uThicknessMin: { value: 120 },
      uThicknessMax: { value: 780 },
      uIOR:          { value: 2.1 },
      uTime:         { value: 0 },
      uLightDir:     { value: new THREE.Vector3(1, 2, 1.5).normalize() },
    },
    side: THREE.DoubleSide,
  }), []);

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
    if (clusterRef.current) {
      clusterRef.current.rotation.y = clock.elapsedTime * 0.14;
      clusterRef.current.rotation.x = 0.22 + Math.sin(clock.elapsedTime * 0.07) * 0.05;
    }
  });

  const base = { startSize: 1.9, stepDelta: 0.22, wall: 0.10, frameDepth: 0.09, stepRise: 0.165, mat };

  return (
    <group ref={clusterRef}>
      {/* Primary arm — largest */}
      <HopperArm {...base} steps={8} />
      {/* Secondary arm — different axis */}
      <group rotation={[Math.PI / 2, Math.PI / 5, 0]} position={[0.25, 0.15, 0.2]}>
        <HopperArm {...base} steps={6} startSize={1.3} stepRise={0.14} />
      </group>
      {/* Accent arm */}
      <group rotation={[Math.PI * 0.6, Math.PI * 0.7, Math.PI * 0.3]} position={[-0.15, -0.1, 0.15]}>
        <HopperArm {...base} steps={4} startSize={0.95} stepRise={0.12} />
      </group>
    </group>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function BismuthCrystal() {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 5], fov: 42 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[ 6,  5,  4]} intensity={3}   color="#ffffff" decay={2} />
      <pointLight position={[-5,  3, -3]} intensity={2}   color="#8899ff" decay={2} />
      <pointLight position={[ 3, -4,  4]} intensity={1.5} color="#ff8833" decay={2} />
      <pointLight position={[-2,  6, -1]} intensity={1.5} color="#88ffcc" decay={2} />
      <pointLight position={[ 1, -2, -5]} intensity={1}   color="#dd88ff" decay={2} />

      <BismuthScene />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.35} />
    </Canvas>
  );
}
