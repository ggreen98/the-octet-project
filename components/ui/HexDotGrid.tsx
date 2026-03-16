"use client";

import { useEffect, useRef } from "react";

const HEX_SIZE = 36;       // distance between hex centres (px)
const DOT_RADIUS = 1.6;    // dot draw radius (px)
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
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      dots.push({
        x: colW * col + (row % 2 === 0 ? 0 : colW / 2),
        y: rowH * row,
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

        if (hd < 1.5) {
          // Core hex cell — bright blue
          const t = 1 - hd / 1.5;
          alpha  = 0.1 + t * 0.75;
          red    = Math.round(20  + t * 40);
          green  = Math.round(100 + t * 100);
          blue   = 255;
        } else if (hd < 3.2) {
          // Surrounding ring — fade out
          const t = 1 - (hd - 1.5) / 1.7;
          alpha  = 0.1 + t * 0.3;
          red    = 0;
          green  = Math.round(60  + t * 100);
          blue   = Math.round(200 + t * 55);
        } else {
          // Resting state — very dim phosphor
          alpha  = 0.09;
          red    = 0;
          green  = 180;
          blue   = 70;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
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
