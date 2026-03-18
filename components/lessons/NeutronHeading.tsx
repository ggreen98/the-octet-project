"use client";

import { useRef, useEffect } from "react";

export function NeutronHeading() {
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

      // Slightly more subdued vibration than the proton — neutrons carry no charge
      const vx = Math.sin(t * 6.8)       * 2.8 + Math.sin(t * 3.1 + 0.9) * 1.2;
      const vy = Math.sin(t * 5.9 + 1.3) * 2.8 + Math.sin(t * 4.2 + 2.0) * 1.2;

      const px = W * 0.12 + vx;
      const py = H * 0.5  + vy;

      const pulse = 1 + Math.sin(t * 1.6) * 0.09 + Math.sin(t * 3.2) * 0.04;
      const glowR = 56 * pulse;

      // Outer soft glow — steel blue-gray
      const outerGlow = ctx!.createRadialGradient(px, py, 0, px, py, glowR);
      outerGlow.addColorStop(0,   `rgba(120, 160, 190, ${0.18 * pulse})`);
      outerGlow.addColorStop(0.4, `rgba(100, 140, 170, ${0.08 * pulse})`);
      outerGlow.addColorStop(1,   "rgba(80, 120, 150, 0)");
      ctx!.beginPath();
      ctx!.arc(px, py, glowR, 0, Math.PI * 2);
      ctx!.fillStyle = outerGlow;
      ctx!.fill();

      // Mid glow ring
      const midGlow = ctx!.createRadialGradient(px, py, 0, px, py, 26 * pulse);
      midGlow.addColorStop(0,   `rgba(160, 200, 220, ${0.5 * pulse})`);
      midGlow.addColorStop(0.5, `rgba(120, 160, 190, ${0.28 * pulse})`);
      midGlow.addColorStop(1,   "rgba(100, 140, 170, 0)");
      ctx!.beginPath();
      ctx!.arc(px, py, 26 * pulse, 0, Math.PI * 2);
      ctx!.fillStyle = midGlow;
      ctx!.fill();

      // Core neutron sphere
      const coreR = 13 * pulse;
      const core = ctx!.createRadialGradient(px - 3, py - 3, 0, px, py, coreR);
      core.addColorStop(0,   "#b0cedd");
      core.addColorStop(0.4, "#7a9ab0");
      core.addColorStop(1,   "#4a6a80");
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
      <div
        className="absolute inset-0 flex flex-col justify-center"
        style={{ zIndex: 1, pointerEvents: "none", paddingLeft: "22%" }}
      >
        <p className="text-xs tracking-widest mb-1" style={{ color: "var(--oc-green-dim)" }}>
          // NEUTRONS
        </p>
        <h2
          className="font-heading"
          style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "#7a9ab0", letterSpacing: "0.05em" }}
        >
          THE NEUTRON
        </h2>
      </div>
    </div>
  );
}
