"use client";

import { useEffect, useRef } from "react";

const HEX_SIZE = 20;       // distance between hex centres (px)
const DOT_RADIUS = 4.0;    // dot draw radius (px)
const SQRT3 = Math.sqrt(3);

interface Dot {
  x: number;
  y: number;
}

// Continuous hex-metric distance from pixel point (px,py) to dot at (dx,dy).
// Isobars of this metric are hexagons — exactly the shape we want to highlight.
function hexDist(px: number, py: number, dx: number, dy: number): number {
  const rx = px - dx;
  const ry = py - dy;
  // Axial conversion for pointy-top hexagons
  const q = ((SQRT3 / 3) * rx - (1 / 3) * ry) / HEX_SIZE;
  const r = ((2 / 3) * ry) / HEX_SIZE;
  return Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
}

function buildDots(w: number, h: number): Dot[] {
  const colW = HEX_SIZE * SQRT3;
  const rowH = HEX_SIZE * 1.5;
  const cols = Math.ceil(w / colW) + 2;
  const rows = Math.ceil(h / rowH) + 2;
  const dots: Dot[] = [];
  for (let row = -2; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      dots.push({
        x: colW * col + (row % 2 === 0 ? 0 : colW / 2),
        y: rowH * row + DOT_RADIUS, // offset so top row's topmost vertex sits at y=0
      });
    }
  }
  return dots;
}

export function HexDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const dotsRef   = useRef<Dot[]>([]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      dotsRef.current = buildDots(canvas!.width, canvas!.height);
    }

    function draw() {
      const { width: w, height: h } = canvas!;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const dot of dotsRef.current) {
        const hd = hexDist(mx, my, dot.x, dot.y);

        let red: number, green: number, blue: number, alpha: number;

        if (hd < 2.2) {
          // Core hex cell — light yellow-orange
          const t = 1 - hd / 2.2;
          alpha  = 0.15 + t * 0.7;
          red    = 255;
          green  = Math.round(160 + t * 60);
          blue   = Math.round(t * 20);
        } else if (hd < 5.0) {
          // Surrounding ring — fade to amber
          const t = 1 - (hd - 2.2) / 2.8;
          alpha  = 0.08 + t * 0.28;
          red    = 255;
          green  = Math.round(100 + t * 80);
          blue   = 0;
        } else {
          // Resting state — dark blue
          alpha  = 0.12;
          red    = 15;
          green  = 30;
          blue   = 90;
        }

        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const a = (Math.PI / 3) * s - Math.PI / 6; // flat-top orientation
          const vx = dot.x + DOT_RADIUS * Math.cos(a);
          const vy = dot.y + DOT_RADIUS * Math.sin(a);
          s === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(${red},${green},${blue},${alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    resize();
    window.addEventListener("resize",    resize);
    window.addEventListener("mousemove", onMouseMove);
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize",    resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "none" }}
    />
  );
}
