"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Types ──────────────────────────────────────────────────────────────────────
type SubType         = "s" | "p" | "d";
type TargetSub       = { label: string; n: number; type: SubType };
type ElemData        = { symbol: string; name: string; z: number; config: TargetSub[] };
type Phase           = "idle" | "playing" | "gameover";
type GameMode        = "normal" | "rush";
type FeedState       = "none" | "correct" | "wrong";
// Track per-subshell: how many electrons placed + which spin was committed first
type SubshellProgress = { placed: number; chosenSpin: "up" | "down" | null };
type Progress         = Record<string, SubshellProgress>;

// ── Constants ──────────────────────────────────────────────────────────────────
const SUBSHELL_COLORS: Record<SubType, string> = {
  s: "#4499ff", p: "#a855f7", d: "#f5a623",
};
const SUBSHELL_MAX: Record<SubType, number> = { s: 2, p: 6, d: 10 };
const MAX_LIVES  = 3;
const RUSH_TIME  = 60; // seconds

// Scaled-up ring radii for a bigger atom presentation
const RING_LAYOUT: Record<string, { r: number; tilt: [number, number, number] }> = {
  "1s": { r: 1.05, tilt: [ 0.30,  0.00,  0.15] },
  "2s": { r: 1.55, tilt: [-0.40,  0.20,  0.10] },
  "2p": { r: 2.00, tilt: [ 0.10,  0.50, -0.20] },
  "3s": { r: 2.50, tilt: [ 0.60, -0.10,  0.30] },
  "3p": { r: 2.95, tilt: [-0.20, -0.50,  0.40] },
  "3d": { r: 3.50, tilt: [ 0.40,  0.30, -0.50] },
  "4s": { r: 3.95, tilt: [-0.50,  0.10, -0.30] },
  "4p": { r: 4.40, tilt: [ 0.20, -0.40,  0.20] },
  "4d": { r: 4.90, tilt: [-0.30,  0.60,  0.10] },
};

// ── Element data ───────────────────────────────────────────────────────────────
const se = (l: string, n: number): TargetSub => ({ label: l, n, type: "s" });
const pe = (l: string, n: number): TargetSub => ({ label: l, n, type: "p" });
const de = (l: string, n: number): TargetSub => ({ label: l, n, type: "d" });

const GAME_ELEMENTS: ElemData[] = [
  { symbol:"H",  name:"Hydrogen",   z:1,  config:[se("1s",1)] },
  { symbol:"He", name:"Helium",     z:2,  config:[se("1s",2)] },
  { symbol:"Li", name:"Lithium",    z:3,  config:[se("1s",2),se("2s",1)] },
  { symbol:"Be", name:"Beryllium",  z:4,  config:[se("1s",2),se("2s",2)] },
  { symbol:"B",  name:"Boron",      z:5,  config:[se("1s",2),se("2s",2),pe("2p",1)] },
  { symbol:"C",  name:"Carbon",     z:6,  config:[se("1s",2),se("2s",2),pe("2p",2)] },
  { symbol:"N",  name:"Nitrogen",   z:7,  config:[se("1s",2),se("2s",2),pe("2p",3)] },
  { symbol:"O",  name:"Oxygen",     z:8,  config:[se("1s",2),se("2s",2),pe("2p",4)] },
  { symbol:"F",  name:"Fluorine",   z:9,  config:[se("1s",2),se("2s",2),pe("2p",5)] },
  { symbol:"Ne", name:"Neon",       z:10, config:[se("1s",2),se("2s",2),pe("2p",6)] },
  { symbol:"Na", name:"Sodium",     z:11, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",1)] },
  { symbol:"Mg", name:"Magnesium",  z:12, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2)] },
  { symbol:"Al", name:"Aluminum",   z:13, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",1)] },
  { symbol:"Si", name:"Silicon",    z:14, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",2)] },
  { symbol:"P",  name:"Phosphorus", z:15, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",3)] },
  { symbol:"S",  name:"Sulfur",     z:16, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",4)] },
  { symbol:"Cl", name:"Chlorine",   z:17, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",5)] },
  { symbol:"Ar", name:"Argon",      z:18, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6)] },
  { symbol:"K",  name:"Potassium",  z:19, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),se("4s",1)] },
  { symbol:"Ca", name:"Calcium",    z:20, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),se("4s",2)] },
  { symbol:"Sc", name:"Scandium",   z:21, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",1),se("4s",2)] },
  { symbol:"Ti", name:"Titanium",   z:22, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",2),se("4s",2)] },
  { symbol:"V",  name:"Vanadium",   z:23, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",3),se("4s",2)] },
  { symbol:"Mn", name:"Manganese",  z:25, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",5),se("4s",2)] },
  { symbol:"Fe", name:"Iron",       z:26, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",6),se("4s",2)] },
  { symbol:"Co", name:"Cobalt",     z:27, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",7),se("4s",2)] },
  { symbol:"Ni", name:"Nickel",     z:28, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",8),se("4s",2)] },
  { symbol:"Zn", name:"Zinc",       z:30, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2)] },
  { symbol:"Ga", name:"Gallium",    z:31, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",1)] },
  { symbol:"Ge", name:"Germanium",  z:32, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",2)] },
  { symbol:"As", name:"Arsenic",    z:33, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",3)] },
  { symbol:"Se", name:"Selenium",   z:34, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",4)] },
  { symbol:"Br", name:"Bromine",    z:35, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",5)] },
  { symbol:"Kr", name:"Krypton",    z:36, config:[se("1s",2),se("2s",2),pe("2p",6),se("3s",2),pe("3p",6),de("3d",10),se("4s",2),pe("4p",6)] },
];

// ── Expected spin logic ────────────────────────────────────────────────────────
// Returns the spin the next electron in this subshell must have, or "either"
// if this is the very first electron (player may choose freely).
//
// Hund's rule is spin-direction agnostic: all singles must be PARALLEL —
// either all-↑ or all-↓ — before any pairing. The direction is the player's choice.
function expectedSpin(
  sub: TargetSub,
  prog: SubshellProgress | undefined,
): "up" | "down" | "either" {
  const placed = prog?.placed ?? 0;
  const chosen = prog?.chosenSpin ?? null;
  const orbs   = SUBSHELL_MAX[sub.type] / 2;

  if (placed < orbs) {
    // Still in the first pass (singly occupying orbitals)
    return chosen === null ? "either" : chosen;
  }
  // Second pass: must be the opposite of the first-pass spin
  return chosen === "up" ? "down" : "up";
}

// ── localStorage ───────────────────────────────────────────────────────────────
function getHS(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("orbital-rush-hs") ?? "0", 10);
}
function saveHS(s: number) {
  if (typeof window === "undefined") return;
  if (s > getHS()) localStorage.setItem("orbital-rush-hs", String(s));
}

// ── 3D: Dynamic camera ─────────────────────────────────────────────────────────
function CameraController({ targetZ }: { targetZ: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.setZ(targetZ);
  }, [camera, targetZ]);
  return null;
}

// ── 3D: Nucleus ────────────────────────────────────────────────────────────────
function GameNucleus() {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const f = 0.5 + 0.5 * (Math.sin(t * 1.7) * 0.6 + Math.sin(t * 4.3) * 0.4);
    if (coreRef.current)
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 5 + f * 5;
    if (glowRef.current)
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity = 0.06 + f * 0.06;
  });
  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#ff6622" emissive="#ff6622" emissiveIntensity={0.5}
          transparent opacity={0.06} roughness={1} depthWrite={false} />
      </mesh>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffddaa" emissive="#ff6622" emissiveIntensity={6}
          roughness={0} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ── 3D: Electrons distributed around a ring ────────────────────────────────────
function RingElectrons({ count, radius, color }: { count: number; radius: number; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.elapsedTime * 0.30;
  });
  const positions = useMemo(
    () => Array.from({ length: count }, (_, i) => {
      const a = (2 * Math.PI * i) / count;
      return [Math.cos(a) * radius, 0, Math.sin(a) * radius] as [number, number, number];
    }),
    [count, radius],
  );
  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.065, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// ── 3D: One orbital ring ───────────────────────────────────────────────────────
function GameRing({
  label, type, placedCount, isActive, feedState,
}: {
  label: string; type: SubType; placedCount: number; isActive: boolean; feedState: FeedState;
}) {
  const layout = RING_LAYOUT[label];
  if (!layout) return null;

  const baseColor = SUBSHELL_COLORS[type];
  const color = isActive && feedState === "correct" ? "#72b872"
              : isActive && feedState === "wrong"   ? "#e05252"
              : baseColor;

  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.color.set(color);
    mat.opacity = isActive
      ? 0.22 + 0.10 * Math.sin(clock.elapsedTime * 3.5)
      : placedCount > 0 ? 0.11 : 0.035;
  });

  return (
    <group rotation={layout.tilt}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[layout.r, 0.008, 4, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.09} depthWrite={false} />
      </mesh>
      {placedCount > 0 && (
        <RingElectrons count={placedCount} radius={layout.r} color={color} />
      )}
    </group>
  );
}

// ── 3D: Full scene ─────────────────────────────────────────────────────────────
function AtomScene({
  config, placedPerSubshell, activeSubshell, feedState, targetCameraZ,
}: {
  config: TargetSub[];
  placedPerSubshell: Record<string, number>;
  activeSubshell: string | null;
  feedState: FeedState;
  targetCameraZ: number;
}) {
  const masterRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (masterRef.current) masterRef.current.rotation.y = clock.elapsedTime * 0.10;
  });
  return (
    <>
      <CameraController targetZ={targetCameraZ} />
      <group ref={masterRef}>
        <GameNucleus />
        {config.map(({ label, type }) => (
          <GameRing
            key={label}
            label={label}
            type={type}
            placedCount={placedPerSubshell[label] ?? 0}
            isActive={label === activeSubshell}
            feedState={feedState}
          />
        ))}
      </group>
    </>
  );
}

// ── Active subshell orbital diagram ───────────────────────────────────────────
// Shows which orbitals are filled and with which spin, respecting the player's
// chosen spin direction (not assuming ↑ = first).
function ActiveDiagram({
  type, placed, chosenSpin, max, isLight,
}: { type: SubType; placed: number; chosenSpin: "up" | "down" | null; max: number; isLight: boolean }) {
  const color       = SUBSHELL_COLORS[type];
  const orbs        = max / 2;
  const first       = Math.min(placed, orbs);
  const second      = Math.max(0, placed - orbs);
  const oppSpin     = chosenSpin === "up" ? "down" : "up";
  const borderAlpha = isLight ? "99" : "44";
  const fillAlpha   = isLight ? "22" : "12";

  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {Array.from({ length: orbs }, (_, oi) => {
        const hasFirst  = oi < first;
        const hasSecond = oi < second;
        // ↑ shows in top slot, ↓ in bottom slot — regardless of which was placed first
        const showUp   = (hasFirst && chosenSpin === "up") || (hasSecond && oppSpin === "up");
        const showDown = (hasFirst && chosenSpin === "down") || (hasSecond && oppSpin === "down");
        return (
          <div key={oi} style={{
            width: "22px", height: "42px",
            border: `1px solid ${color}${borderAlpha}`,
            borderRadius: "2px",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "space-between",
            padding: "5px 0",
            background: (hasFirst || hasSecond) ? `${color}${fillAlpha}` : "transparent",
            fontSize: "0.65rem",
            lineHeight: 1,
          }}>
            {showUp   ? <span style={{ color }}>↑</span> : <span />}
            {showDown ? <span style={{ color }}>↓</span> : <span />}
          </div>
        );
      })}
    </div>
  );
}

// ── Electron bucket button ─────────────────────────────────────────────────────
function ElectronBucket({
  spin, onClick, disabled,
}: { spin: "up" | "down"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        padding: "14px 8px",
        border: `1px solid ${disabled ? "var(--oc-green-border-faint)" : "var(--oc-green-border-dim)"}`,
        borderRadius: "4px",
        background: disabled ? "transparent" : "rgba(114,184,114,0.06)",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
        transition: "background 0.1s, border-color 0.1s",
      }}
    >
      <span style={{ fontSize: "1.7rem", lineHeight: 1, color: disabled ? "var(--oc-text-hint)" : "var(--oc-text)" }}>
        {spin === "up" ? "↑" : "↓"}
      </span>
      <span className="font-heading" style={{ fontSize: "0.52rem", letterSpacing: "0.1em", color: disabled ? "var(--oc-text-hint)" : "var(--oc-text-dim)" }}>
        {spin === "up" ? "SPIN UP" : "SPIN DOWN"}
      </span>
      <span style={{ fontSize: "0.48rem", color: "var(--oc-text-hint)", letterSpacing: "0.06em" }}>
        {spin === "up" ? "↑ key" : "↓ key"}
      </span>
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function OrbitalRush() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [phase,         setPhase]         = useState<Phase>("idle");
  const [mode,          setMode]          = useState<GameMode>("normal");
  const [score,         setScore]         = useState(0);
  const [lives,         setLives]         = useState(MAX_LIVES);
  const [elIdx,         setElIdx]         = useState(0);
  const [progress,      setProgress]      = useState<Progress>({});
  const [feedState,     setFeedState]     = useState<FeedState>("none");
  const [wrongExpected, setWrongExpected] = useState<"up" | "down" | null>(null);
  const [highScore,     setHighScore]     = useState(0);
  const [mounted,       setMounted]       = useState(false);
  const [timeLeft,      setTimeLeft]      = useState(RUSH_TIME);
  const [timerActive,   setTimerActive]   = useState(false);

  const usedRef = useRef<Set<number>>(new Set());

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setHighScore(getHS()); }, []);

  // Rush-mode countdown timer
  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id);
          setTimerActive(false);
          setPhase("gameover");
          setHighScore(prev => { saveHS(score); return getHS(); });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerActive]);

  const el = GAME_ELEMENTS[elIdx];

  // Active subshell = first entry in config that isn't fully filled yet
  const activeSub = el.config.find(
    sub => (progress[sub.label]?.placed ?? 0) < sub.n,
  ) ?? null;

  const activeProg = activeSub ? (progress[activeSub.label] ?? { placed: 0, chosenSpin: null }) : null;

  // Derived counts for display
  const totalPlaced = useMemo(
    () => Object.values(progress).reduce((s, p) => s + p.placed, 0),
    [progress],
  );
  const totalTarget = useMemo(
    () => el.config.reduce((s, c) => s + c.n, 0),
    [el],
  );

  // Per-subshell placed counts for the 3D rings
  const placedPerSubshell = useMemo(() => {
    const m: Record<string, number> = {};
    for (const [label, p] of Object.entries(progress)) m[label] = p.placed;
    return m;
  }, [progress]);

  // Camera distance: scale to fit the outermost ring of this element
  const targetCameraZ = useMemo(() => {
    const maxR = Math.max(...el.config.map(s => RING_LAYOUT[s.label]?.r ?? 1));
    return Math.max(4.5, maxR * 2.0 + 2.5);
  }, [el]);

  const pickAtom = useCallback((): number => {
    if (usedRef.current.size >= GAME_ELEMENTS.length) usedRef.current.clear();
    let idx: number;
    do { idx = Math.floor(Math.random() * GAME_ELEMENTS.length); }
    while (usedRef.current.has(idx));
    usedRef.current.add(idx);
    return idx;
  }, []);

  const loadAtom = useCallback((idx: number) => {
    setElIdx(idx);
    setProgress({});
    setFeedState("none");
    setWrongExpected(null);
    setPhase("playing");
  }, []);

  const startGame = useCallback((selectedMode: GameMode) => {
    usedRef.current = new Set();
    setScore(0);
    setLives(MAX_LIVES);
    if (selectedMode === "rush") {
      setTimeLeft(RUSH_TIME);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
    loadAtom(pickAtom());
  }, [pickAtom, loadAtom]);

  const placeElectron = useCallback((spin: "up" | "down") => {
    if (phase !== "playing" || feedState !== "none") return;
    if (!activeSub) return;

    const prog     = progress[activeSub.label] ?? { placed: 0, chosenSpin: null };
    const expected = expectedSpin(activeSub, prog);
    const isRight  = expected === "either" || expected === spin;

    // Build the new progress state after a correct placement
    const newProg: SubshellProgress = {
      placed:     prog.placed + 1,
      chosenSpin: prog.chosenSpin ?? (isRight ? spin : (expected as "up" | "down")),
    };
    const newProgress: Progress = { ...progress, [activeSub.label]: newProg };

    // Check element completion using the updated progress
    const elementDone = el.config.every(
      sub => (newProgress[sub.label]?.placed ?? 0) >= sub.n,
    );

    if (isRight) {
      setProgress(newProgress);
      if (elementDone) {
        setScore(s => s + 10);
        setFeedState("correct");
        setTimeout(() => { setFeedState("none"); loadAtom(pickAtom()); }, 900);
      }
    } else {
      // Wrong spin — auto-place the correct one after feedback
      const correctSpin = expected as "up" | "down";
      setWrongExpected(correctSpin);
      setFeedState("wrong");
      const newLives = lives - 1;
      setLives(newLives);

      setTimeout(() => {
        if (newLives <= 0) {
          setTimerActive(false);
          saveHS(score);
          setHighScore(getHS());
          setPhase("gameover");
          return;
        }
        setProgress(newProgress);
        setFeedState("none");
        setWrongExpected(null);
        if (elementDone) loadAtom(pickAtom());
      }, 1000);
    }
  }, [phase, feedState, activeSub, progress, el, lives, score, pickAtom, loadAtom]);

  // Keyboard: ↑ / ↓ arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (e.key === "ArrowUp")   { e.preventDefault(); placeElectron("up"); }
      if (e.key === "ArrowDown") { e.preventDefault(); placeElectron("down"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, placeElectron]);

  // ── Idle / Game over ───────────────────────────────────────────────────────
  if (phase === "idle" || phase === "gameover") {
    const isGO = phase === "gameover";
    return (
      <div className="mb-16">
        <p className="font-heading text-xs tracking-widest mb-4" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
          {`// MINIGAME — ORBITAL RUSH`}
        </p>
        <div className="max-w-sm p-6" style={{ border: "1px solid var(--oc-green-border-dim)", borderRadius: "4px", background: "var(--oc-green-bg-surface)" }}>
          <h3 className="font-heading mb-1" style={{ fontSize: "clamp(1.5rem,4vw,2rem)", color: "var(--oc-text)", letterSpacing: "-0.01em" }}>
            ORBITAL RUSH
          </h3>
          <p className="font-heading text-xs mb-5" style={{ color: "var(--oc-green)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
            ELECTRON PLACEMENT CHALLENGE
          </p>

          {isGO && (
            <div className="mb-5 p-4" style={{ border: "1px solid var(--oc-green-border-faint)", borderRadius: "3px", background: "rgba(0,0,0,0.15)" }}>
              <p className="font-heading text-xs mb-3" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.1em", fontSize: "0.6rem" }}>GAME OVER</p>
              <div className="flex gap-8">
                <div>
                  <p className="font-heading" style={{ fontSize: "2rem", color: "var(--oc-text)", lineHeight: 1 }}>{score}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.08em" }}>SCORE</p>
                </div>
                <div>
                  <p className="font-heading" style={{ fontSize: "2rem", color: "var(--oc-green)", lineHeight: 1 }}>{highScore}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.08em" }}>BEST</p>
                </div>
              </div>
            </div>
          )}

          {!isGO && (
            <div className="mb-5 flex flex-col gap-2">
              {[
                "A random element appears. Place its electrons onto the atom one at a time.",
                "Pick ↑ or ↓ from the buckets. Either spin is fine for the first electron in a subshell — just stay consistent.",
                "Hund's rule: all singly-occupied orbitals must match your chosen spin before any pairing begins.",
                "Wrong spin = lose a life. Correct = electron appears on the glowing ring.",
                "+10 pts per element completed without error.",
              ].map((r, i) => (
                <div key={i} className="flex gap-2 text-xs" style={{ color: "var(--oc-text-muted)", lineHeight: 1.6 }}>
                  <span className="font-heading shrink-0" style={{ color: "var(--oc-green-dim)" }}>{i + 1}.</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}

          {/* Mode selector */}
          <div className="mb-4">
            <p className="font-heading text-xs mb-2" style={{ fontSize: "0.55rem", color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>SELECT MODE</p>
            <div className="flex gap-2">
              {(["normal", "rush"] as GameMode[]).map(m => {
                const selected = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="font-heading text-xs flex-1 py-2.5"
                    style={{
                      border: `1px solid ${selected ? "var(--oc-green-subtle)" : "var(--oc-green-border-faint)"}`,
                      borderRadius: "3px",
                      background: selected ? "rgba(114,184,114,0.12)" : "transparent",
                      color: selected ? "var(--oc-green)" : "var(--oc-text-dim)",
                      cursor: "pointer",
                      letterSpacing: "0.1em",
                      transition: "all 0.15s",
                    }}
                  >
                    {m === "normal" ? "NORMAL" : "⏱ RUSH"}
                  </button>
                );
              })}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--oc-text-hint)", lineHeight: 1.5 }}>
              {mode === "normal"
                ? "No time limit — 3 lives. Take your time."
                : `${RUSH_TIME}s countdown — 3 lives. Race the clock.`}
            </p>
          </div>

          {highScore > 0 && !isGO && (
            <p className="text-xs mb-4" style={{ color: "var(--oc-text-dim)" }}>
              Best: <span className="font-heading" style={{ color: "var(--oc-green)" }}>{highScore}</span>
            </p>
          )}

          <button
            onClick={() => startGame(mode)}
            className="font-heading text-xs px-5 py-3 w-full transition-all duration-150"
            style={{ background: "rgba(114,184,114,0.12)", border: "1px solid var(--oc-green-subtle)", color: "var(--oc-green)", letterSpacing: "0.12em", borderRadius: "3px", cursor: "pointer" }}
          >
            {isGO ? "PLAY AGAIN" : "START GAME"}
          </button>
        </div>
      </div>
    );
  }

  // ── Playing ────────────────────────────────────────────────────────────────
  const borderColor =
    feedState === "correct" ? "#72b872" :
    feedState === "wrong"   ? "#e05252" :
    "var(--oc-green-border-dim)";

  const isFrozen = feedState !== "none";

  return (
    <div className="mb-16">
      <p className="font-heading text-xs tracking-widest mb-4" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.12em", fontSize: "0.6rem" }}>
        {`// MINIGAME — ORBITAL RUSH`}
      </p>

      <div
        className="max-w-sm"
        style={{ border: `1px solid ${borderColor}`, borderRadius: "4px", overflow: "hidden", transition: "border-color 0.2s" }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "var(--oc-green-bg-surface)", borderBottom: "1px solid var(--oc-green-border-faint)" }}>
          <div className="flex gap-1.5">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} style={{ color: i < lives ? "#e05252" : "var(--oc-text-hint)", fontSize: "0.85rem" }}>
                {i < lives ? "●" : "○"}
              </span>
            ))}
          </div>
          {mode === "rush" ? (
            <span
              className="font-heading"
              style={{
                fontSize: "0.95rem",
                letterSpacing: "0.06em",
                color: timeLeft <= 10 ? "#e05252" : "var(--oc-text)",
                transition: "color 0.3s",
                minWidth: "3.5ch",
                textAlign: "center",
              }}
            >
              {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          ) : (
            <span className="font-heading" style={{ fontSize: "0.6rem", color: "var(--oc-text-dim)", letterSpacing: "0.08em" }}>
              {totalPlaced} / {totalTarget} e⁻
            </span>
          )}
          <span className="font-heading text-sm" style={{ color: "var(--oc-green)", letterSpacing: "0.08em" }}>{score}</span>
        </div>

        {/* Element header */}
        <div className="px-5 pt-4 pb-3" style={{ background: "rgba(1,13,10,0.5)", borderBottom: "1px solid var(--oc-green-border-faint)" }}>
          <div className="flex items-baseline gap-3 mb-0.5">
            <span className="font-heading" style={{ fontSize: "2.8rem", color: "var(--oc-text)", lineHeight: 1 }}>{el.symbol}</span>
            <span className="font-heading text-sm" style={{ color: "var(--oc-text-dim)" }}>Z = {el.z}</span>
          </div>
          <p className="font-heading text-xs" style={{ color: "var(--oc-text-dim)", letterSpacing: "0.15em" }}>
            {el.name.toUpperCase()}
          </p>
        </div>

        {/* 3D Atom — taller canvas */}
        <div style={{ height: "280px", background: "rgba(1,13,10,0.65)" }}>
          {mounted && (
            <Canvas
              camera={{ position: [0, 0, 8], fov: 52 }}
              style={{ background: "transparent" }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.05} />
              <pointLight position={[0, 0, 0]} intensity={4} color="#ff6622" decay={2} />
              <pointLight position={[4, 3, 4]} intensity={0.6} color="#4499ff" decay={2} />
              <AtomScene
                config={el.config}
                placedPerSubshell={placedPerSubshell}
                activeSubshell={activeSub?.label ?? null}
                feedState={feedState}
                targetCameraZ={targetCameraZ}
              />
            </Canvas>
          )}
        </div>

        {/* Active subshell hint */}
        <div
          className="px-5 py-3"
          style={{
            background: "rgba(1,13,10,0.4)",
            borderTop: "1px solid var(--oc-green-border-faint)",
            borderBottom: "1px solid var(--oc-green-border-faint)",
            minHeight: "60px",
            display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px",
          }}
        >
          {activeSub && activeProg ? (
            <>
              <div className="flex items-center gap-2">
                <span className="font-heading" style={{ fontSize: "0.55rem", color: "var(--oc-text-dim)", letterSpacing: "0.1em" }}>FILLING:</span>
                <span className="font-heading" style={{ fontSize: "0.7rem", color: SUBSHELL_COLORS[activeSub.type], letterSpacing: "0.08em" }}>
                  {activeSub.label}
                </span>
                <span style={{ fontSize: "0.55rem", color: "var(--oc-text-hint)" }}>
                  {activeProg.placed}/{SUBSHELL_MAX[activeSub.type]} e⁻
                </span>
              </div>
              <ActiveDiagram
                type={activeSub.type}
                placed={activeProg.placed}
                chosenSpin={activeProg.chosenSpin}
                max={SUBSHELL_MAX[activeSub.type]}
                isLight={isLight}
              />
            </>
          ) : feedState === "correct" ? (
            <p className="font-heading" style={{ fontSize: "0.6rem", color: "#72b872", letterSpacing: "0.1em" }}>
              ELEMENT COMPLETE  +10 PTS
            </p>
          ) : null}
        </div>

        {/* Wrong-spin feedback */}
        {feedState === "wrong" && wrongExpected && (
          <div className="px-5 py-2" style={{ background: "rgba(224,82,82,0.08)", borderBottom: "1px solid rgba(224,82,82,0.20)" }}>
            <p className="font-heading" style={{ fontSize: "0.6rem", color: "#e05252", letterSpacing: "0.08em" }}>
              WRONG — SHOULD BE {wrongExpected === "up" ? "↑ SPIN UP" : "↓ SPIN DOWN"}
            </p>
          </div>
        )}

        {/* Electron buckets */}
        <div className="px-5 py-4 flex gap-3" style={{ background: "rgba(1,13,10,0.2)" }}>
          <ElectronBucket spin="up"   onClick={() => placeElectron("up")}   disabled={isFrozen} />
          <ElectronBucket spin="down" onClick={() => placeElectron("down")} disabled={isFrozen} />
        </div>
      </div>
    </div>
  );
}
