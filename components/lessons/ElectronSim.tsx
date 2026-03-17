"use client";

import { useRef, useEffect } from "react";

const ELECTRONS = [
  { speed: 0.055, radiusX: 100, radiusY: 38, tilt: 0,              phase: 0 },
  { speed: 0.043, radiusX: 108, radiusY: 32, tilt: Math.PI / 3,    phase: Math.PI * 0.7 },
  { speed: 0.067, radiusX: 92,  radiusY: 44, tilt: -Math.PI / 4,   phase: Math.PI * 1.4 },
  { speed: 0.038, radiusX: 115, radiusY: 28, tilt: Math.PI * 0.75, phase: Math.PI * 0.3 },
];

const TRAIL = 36;

export function ElectronSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width  = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();

    const trails = ELECTRONS.map(() => [] as { x: number; y: number }[]);
    const angles  = ELECTRONS.map((e) => e.phase);

    let animId: number;

    function draw() {
      if (!canvas) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const cx = W / 2;
      const cy = H / 2;

      // Fade previous frame — creates the trail ghosting effect
      ctx!.fillStyle = "rgba(1, 13, 10, 0.28)";
      ctx!.fillRect(0, 0, W, H);

      // Faint orbital path ellipses
      ELECTRONS.forEach((e) => {
        ctx!.save();
        ctx!.translate(cx, cy);
        ctx!.rotate(e.tilt);
        ctx!.beginPath();
        ctx!.ellipse(0, 0, e.radiusX, e.radiusY, 0, 0, Math.PI * 2);
        ctx!.strokeStyle = "rgba(0, 255, 65, 0.06)";
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
        ctx!.restore();
      });

      // Nucleus glow
      const nucGlow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 22);
      nucGlow.addColorStop(0,   "rgba(255, 100, 30, 0.7)");
      nucGlow.addColorStop(0.4, "rgba(255,  60, 10, 0.25)");
      nucGlow.addColorStop(1,   "rgba(255,  60, 10, 0)");
      ctx!.beginPath();
      ctx!.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx!.fillStyle = nucGlow;
      ctx!.fill();

      // Nucleus core
      ctx!.beginPath();
      ctx!.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx!.fillStyle = "#ff5500";
      ctx!.fill();

      // Electrons
      ELECTRONS.forEach((e, i) => {
        angles[i] += e.speed;

        const cosT = Math.cos(e.tilt);
        const sinT = Math.sin(e.tilt);
        const lx = Math.cos(angles[i]) * e.radiusX;
        const ly = Math.sin(angles[i]) * e.radiusY;
        const x = cx + lx * cosT - ly * sinT;
        const y = cy + lx * sinT + ly * cosT;

        trails[i].push({ x, y });
        if (trails[i].length > TRAIL) trails[i].shift();

        // Trail dots
        trails[i].forEach((p, t) => {
          const progress = t / TRAIL;
          const alpha  = progress * 0.55;
          const radius = 0.8 + progress * 2;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(168, 216, 255, ${alpha})`;
          ctx!.fill();
        });

        // Electron glow halo
        const glow = ctx!.createRadialGradient(x, y, 0, x, y, 10);
        glow.addColorStop(0, "rgba(100, 180, 255, 0.7)");
        glow.addColorStop(1, "rgba(100, 180, 255, 0)");
        ctx!.beginPath();
        ctx!.arc(x, y, 10, 0, Math.PI * 2);
        ctx!.fillStyle = glow;
        ctx!.fill();

        // Electron core
        ctx!.beginPath();
        ctx!.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx!.fillStyle = "#c8e8ff";
        ctx!.fill();
      });

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="max-w-2xl mb-10">
      <p className="text-xs tracking-widest mb-4" style={{ color: "rgba(0, 255, 65, 0.45)" }}>
        // INTERACTIVE — ELECTRON ORBITAL SIMULATION
      </p>
      <div
        style={{
          border: "1px solid rgba(0, 255, 65, 0.1)",
          background: "rgba(1, 13, 10, 1)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "220px", display: "block" }}
        />
      </div>
    </div>
  );
}
