"use client";
import { useEffect, useRef, useState } from "react";

const NAV_H = 64;

// Spawn x positions as fraction of viewport width
const SPAWN_X = [0.09, 0.24, 0.41, 0.57, 0.73, 0.88];

interface Pendant {
  xFrac: number;
  progress: number; // negative = waiting, 0–1 = growing
  maxR: number;
  growRate: number; // per frame at 60fps
}

interface FallingDrop {
  id: number;
  xFrac: number;
  radius: number;
  duration: number;
}

let uid = 0;

export function WaterDripEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const timeRef   = useRef(0);

  // Pendant drop state lives in a ref (mutated every frame, no re-render needed)
  const pendantsRef = useRef<Pendant[]>(
    SPAWN_X.map((xFrac, i) => ({
      xFrac,
      progress: -(i * 1.8 + Math.random() * 2), // stagger starts
      maxR: 30 + Math.random() * 32,
      growRate: 0.0008 + Math.random() * 0.0009,
    }))
  );

  // Queue: canvas RAF pushes here, React interval drains it
  const spawnRef = useRef<{ xFrac: number; radius: number }[]>([]);

  const [drops, setDrops] = useState<FallingDrop[]>([]);

  // Drain spawn queue → React state (runs on 80ms tick to batch safely)
  useEffect(() => {
    const iv = setInterval(() => {
      const q = spawnRef.current.splice(0);
      if (!q.length) return;
      q.forEach(({ xFrac, radius }) => {
        const id  = ++uid;
        const dur = 3.2 + Math.random() * 2.4;
        setDrops(prev => [...prev, { id, xFrac, radius, duration: dur }]);
        setTimeout(
          () => setDrops(prev => prev.filter(d => d.id !== id)),
          (dur + 1) * 1000
        );
      });
    }, 80);
    return () => clearInterval(iv);
  }, []);

  // Canvas: wavy edge + pendant drops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = NAV_H + 220; // tall enough for max pendant drop
    }

    // Composite wave at x for time t
    function waveY(x: number, t: number) {
      return (
        NAV_H +
        Math.sin(x * 0.0065 + t * 0.36) * 5.5 +
        Math.sin(x * 0.013  - t * 0.52) * 3.2 +
        Math.sin(x * 0.003  + t * 0.19) * 4.2
      );
    }

    function draw() {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const w = canvas!.width;
      ctx.clearRect(0, 0, w, canvas!.height);

      // ── Wavy shimmer line at nav bottom ──────────────────
      ctx.beginPath();
      ctx.moveTo(0, waveY(0, t));
      for (let x = 3; x <= w; x += 3) ctx.lineTo(x, waveY(x, t));
      ctx.strokeStyle = "rgba(255,255,255,0.32)";
      ctx.lineWidth   = 1.4;
      ctx.stroke();

      // Soft glow below the line
      ctx.beginPath();
      ctx.moveTo(0, waveY(0, t));
      for (let x = 3; x <= w; x += 3) ctx.lineTo(x, waveY(x, t));
      ctx.strokeStyle = "rgba(200,225,255,0.09)";
      ctx.lineWidth   = 6;
      ctx.stroke();

      // ── Pendant drops ─────────────────────────────────────
      for (const p of pendantsRef.current) {
        // Waiting phase: count up at 1/60 per frame (1 sec per unit)
        // Growing phase: count up at growRate per frame
        p.progress += p.progress < 0 ? 0.016 : p.growRate;
        if (p.progress < 0) continue;

        const prog = Math.min(p.progress, 1);
        const r    = p.maxR * prog;
        if (r < 2) continue;

        const px   = p.xFrac * w;
        const base = waveY(px, t);

        // Elongate vertically as it grows, compress horizontally
        const rx = r * (1 - prog * 0.14);
        const ry = r * (1 + prog * 0.6);
        const cy = base + ry * 0.88; // centre hangs below attachment

        // Glass body
        const grd = ctx.createRadialGradient(
          px - rx * 0.32, cy - ry * 0.3, ry * 0.06,
          px,             cy,            ry * 1.2
        );
        grd.addColorStop(0,    "rgba(255,255,255,0.45)");
        grd.addColorStop(0.28, "rgba(215,238,255,0.20)");
        grd.addColorStop(0.62, "rgba(140,200,255,0.08)");
        grd.addColorStop(1,    "rgba(20,100,220,0.03)");

        ctx.beginPath();
        ctx.ellipse(px, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Primary specular highlight
        ctx.beginPath();
        ctx.ellipse(
          px - rx * 0.3, cy - ry * 0.3,
          rx * 0.25, ry * 0.14,
          -0.35, 0, Math.PI * 2
        );
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fill();

        // Secondary softer highlight
        ctx.beginPath();
        ctx.ellipse(
          px + rx * 0.15, cy - ry * 0.5,
          rx * 0.1, ry * 0.06,
          0.2, 0, Math.PI * 2
        );
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fill();

        // Rim
        ctx.beginPath();
        ctx.ellipse(px, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth   = 0.9;
        ctx.stroke();

        // Detach when fully grown
        if (p.progress >= 1) {
          spawnRef.current.push({ xFrac: p.xFrac, radius: r });
          p.progress = -(3.5 + Math.random() * 5.5);
          p.maxR     = 30 + Math.random() * 32;
          p.growRate = 0.0008 + Math.random() * 0.0009;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* Animated wavy edge + pendant drops */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="fixed top-0 left-0 w-full pointer-events-none"
        style={{ height: `${NAV_H + 220}px`, zIndex: 55 }}
      />

      {/* Falling lens drops — backdrop-filter warps the content behind them */}
      {drops.map(d => (
        <div
          key={d.id}
          aria-hidden
          className="fixed pointer-events-none"
          style={{
            left:       `${d.xFrac * 100}%`,
            top:        NAV_H,
            width:      d.radius * 2,
            height:     d.radius * 3.0,
            marginLeft: -d.radius,
            borderRadius: "50% 50% 46% 46% / 58% 58% 42% 42%",
            // The light-warping magic:
            backdropFilter:
              "blur(9px) brightness(1.28) contrast(1.1) saturate(1.22)",
            WebkitBackdropFilter:
              "blur(9px) brightness(1.28) contrast(1.1) saturate(1.22)",
            background:
              "linear-gradient(168deg, rgba(255,255,255,0.24) 0%, rgba(190,220,255,0.09) 40%, rgba(0,0,0,0.08) 100%)",
            boxShadow:
              "inset 0 5px 14px rgba(255,255,255,0.58), " +
              "inset -2px -4px 8px rgba(0,60,150,0.18), " +
              "0 14px 40px rgba(0,0,0,0.38)",
            animation: `nav-drop-fall ${d.duration}s ease-in forwards`,
            zIndex: 54,
          }}
        />
      ))}
    </>
  );
}
