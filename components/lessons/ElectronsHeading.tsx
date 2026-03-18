"use client";

import { useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

// Each orbit is a circle tilted in 3D, projected onto the screen.
// `inc`  = inclination (0 = face-on circle, π/2 = edge-on line)
// `rot`  = rotation of the orbit plane around the view axis
// Depth z > 0 → electron is in front of the text; z < 0 → behind.
const ORBITS = [
  { R: 130, inc: Math.PI * 0.38, rot: 0,            speed: 0.072, phase: 0,            color: "#a8d8ff" },
  { R: 120, inc: Math.PI * 0.55, rot: Math.PI / 2.2, speed: 0.055, phase: Math.PI * 0.8, color: "#00e5ff" },
  { R: 140, inc: Math.PI * 0.25, rot: Math.PI / 3.5, speed: 0.063, phase: Math.PI * 1.5, color: "#a8d8ff" },
];

const TRAIL = 32;

function project(angle: number, R: number, inc: number, rot: number) {
  const bx = R * Math.cos(angle);
  const by = R * Math.sin(angle) * Math.cos(inc);
  const bz = R * Math.sin(angle) * Math.sin(inc);
  const x2d = bx * Math.cos(rot) - by * Math.sin(rot);
  const y2d = bx * Math.sin(rot) + by * Math.cos(rot);
  return { x2d, y2d, z: bz };
}

export function ElectronsHeading() {
  const backRef  = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const isLight    = theme === "light";
    const trailRgb   = isLight ? "26, 80, 200"         : "168, 216, 255";
    const glowColor  = isLight ? "rgba(20, 70, 190,"   : "rgba(100, 180, 255,";
    const coreColor  = isLight ? "#1a50c8"             : "#e8f4ff";
    const coreDim    = isLight ? "rgba(26, 80, 200, 0.5)" : "rgba(168, 216, 255, 0.5)";
    const back  = backRef.current;
    const front = frontRef.current;
    if (!back || !front) return;
    const bCtx = back.getContext("2d");
    const fCtx = front.getContext("2d");
    if (!bCtx || !fCtx) return;

    function resize() {
      [back!, front!].forEach((c) => {
        c.width  = c.offsetWidth  * window.devicePixelRatio;
        c.height = c.offsetHeight * window.devicePixelRatio;
      });
      bCtx!.scale(window.devicePixelRatio, window.devicePixelRatio);
      fCtx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();

    const angles = ORBITS.map((o) => o.phase);
    const trails = ORBITS.map(() => [] as { x: number; y: number; z: number }[]);

    let animId: number;

    function draw() {
      const W  = back!.offsetWidth;
      const H  = back!.offsetHeight;
      const cx = W / 2;
      const cy = H / 2;

      bCtx!.clearRect(0, 0, W, H);
      fCtx!.clearRect(0, 0, W, H);

      // Faint orbit path rings on back canvas
      ORBITS.forEach((o) => {
        bCtx!.save();
        bCtx!.translate(cx, cy);
        bCtx!.rotate(o.rot);
        bCtx!.beginPath();
        bCtx!.ellipse(0, 0, o.R, o.R * Math.abs(Math.cos(o.inc)), 0, 0, Math.PI * 2);
        bCtx!.strokeStyle = "rgba(114,184,114,0.07)";
        bCtx!.lineWidth = 0.6;
        bCtx!.stroke();
        bCtx!.restore();
      });

      ORBITS.forEach((o, i) => {
        angles[i] += o.speed;

        const { x2d, y2d, z } = project(angles[i], o.R, o.inc, o.rot);
        const sx = cx + x2d;
        const sy = cy + y2d;
        const isFront = z > 0;

        trails[i].push({ x: sx, y: sy, z });
        if (trails[i].length > TRAIL) trails[i].shift();

        // Draw trail on back canvas (always behind text)
        trails[i].forEach((p, t) => {
          const prog  = t / TRAIL;
          const alpha = prog * 0.45;
          const r     = 0.6 + prog * 1.8;
          bCtx!.beginPath();
          bCtx!.arc(p.x, p.y, r, 0, Math.PI * 2);
          bCtx!.fillStyle = `rgba(${trailRgb},${alpha})`;
          bCtx!.fill();
        });

        // Draw glow + core on the correct layer
        const ctx = isFront ? fCtx! : bCtx!;
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 10);
        glow.addColorStop(0, `${glowColor}${isFront ? 0.85 : 0.4})`);
        glow.addColorStop(1, `${glowColor}0)`);
        ctx.beginPath();
        ctx.arc(sx, sy, 10, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sx, sy, isFront ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isFront ? coreColor : coreDim;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [theme]);

  const canvasStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    display: "block",
  };

  return (
    <div
      className="max-w-2xl mb-4"
      style={{ position: "relative", height: "110px" }}
    >
      {/* Back canvas — electrons behind text */}
      <canvas ref={backRef} style={{ ...canvasStyle, zIndex: 0 }} />

      {/* Text — sits between the two canvas layers */}
      <div
        className="absolute inset-0 flex flex-col justify-center"
        style={{ zIndex: 1, pointerEvents: "none" }}
      >
        <p className="text-xs tracking-widest mb-1" style={{ color: "var(--oc-green-dim)" }}>
          // ELECTRONS
        </p>
        <h2
          className="font-heading"
          style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "var(--oc-blue)", letterSpacing: "0.05em" }}
        >
          THE ELECTRON
        </h2>
      </div>

      {/* Front canvas — electrons in front of text */}
      <canvas ref={frontRef} style={{ ...canvasStyle, zIndex: 2 }} />
    </div>
  );
}
