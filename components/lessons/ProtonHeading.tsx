"use client";

import { useRef, useEffect } from "react";

export function ProtonHeading() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();

    let animId: number;
    let t = 0;

    function draw() {
      if (!canvas) return;
      const W  = canvas.offsetWidth;
      const H  = canvas.offsetHeight;

      ctx!.clearRect(0, 0, W, H);

      t += 0.03;

      // Vibration offsets — layered sines like the 3D nucleon
      const vx = Math.sin(t * 7.1)       * 3.5 + Math.sin(t * 3.3 + 1.1) * 1.5;
      const vy = Math.sin(t * 6.3 + 1.1) * 3.5 + Math.sin(t * 4.7 + 2.2) * 1.5;

      // Position: left-of-center so it sits beside the text
      const px = W * 0.12 + vx;
      const py = H * 0.5  + vy;

      // Pulsing glow radius & opacity
      const pulse = 1 + Math.sin(t * 1.8) * 0.12 + Math.sin(t * 3.7) * 0.06;
      const glowR = 60 * pulse;

      // Outer soft glow
      const outerGlow = ctx!.createRadialGradient(px, py, 0, px, py, glowR);
      outerGlow.addColorStop(0,   `rgba(255, 80, 20, ${0.22 * pulse})`);
      outerGlow.addColorStop(0.4, `rgba(255, 60, 10, ${0.1  * pulse})`);
      outerGlow.addColorStop(1,   "rgba(255, 40,  0, 0)");
      ctx!.beginPath();
      ctx!.arc(px, py, glowR, 0, Math.PI * 2);
      ctx!.fillStyle = outerGlow;
      ctx!.fill();

      // Mid glow ring
      const midGlow = ctx!.createRadialGradient(px, py, 0, px, py, 28 * pulse);
      midGlow.addColorStop(0,   `rgba(255, 120, 40, ${0.6 * pulse})`);
      midGlow.addColorStop(0.5, `rgba(255,  80, 20, ${0.35 * pulse})`);
      midGlow.addColorStop(1,   "rgba(255, 60, 10, 0)");
      ctx!.beginPath();
      ctx!.arc(px, py, 28 * pulse, 0, Math.PI * 2);
      ctx!.fillStyle = midGlow;
      ctx!.fill();

      // Core proton sphere
      const coreR = 13 * pulse;
      const core = ctx!.createRadialGradient(px - 3, py - 3, 0, px, py, coreR);
      core.addColorStop(0,   "#ff8844");
      core.addColorStop(0.4, "#ff4500");
      core.addColorStop(1,   "#cc2200");
      ctx!.beginPath();
      ctx!.arc(px, py, coreR, 0, Math.PI * 2);
      ctx!.fillStyle = core;
      ctx!.fill();

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      className="max-w-2xl mb-4"
      style={{ position: "relative", height: "110px" }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />

      {/* Text offset right so it sits beside the proton */}
      <div
        className="absolute inset-0 flex flex-col justify-center"
        style={{ zIndex: 1, pointerEvents: "none", paddingLeft: "22%" }}
      >
        <p className="text-xs tracking-widest mb-1" style={{ color: "rgba(0,255,65,0.45)" }}>
          // PROTONS
        </p>
        <h2
          className="font-heading"
          style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "#ff4500", letterSpacing: "0.05em" }}
        >
          THE PROTON
        </h2>
      </div>
    </div>
  );
}
