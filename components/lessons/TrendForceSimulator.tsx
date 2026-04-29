"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { getElectronShells } from "@/data/elements";

const MAX_PROTONS = 12;
const CANVAS_SIZE = 500;

// The simplified shell-filling model (getElectronShells) packs K's electrons into
// 3 shells as [2,8,9] — it doesn't account for 4s filling before 3d. This makes
// Na (shells=[2,8,1], Zeff=2.5) the actual largest atom in the model, not K.
// Calibrate GLOBAL_SCALE to Na so it fills the canvas; everything else is relative.
//
// The denominator uses +0.5 instead of the original +2 — the smaller offset makes
// Zeff changes ~3× more visible, so adding/removing a proton or valence electron
// produces a clear radius change rather than a near-invisible shift.
const NA_VALENCE_ZEFF = 11 - 10 * 0.85; // 2.5
const NA_RAW_OUTER_R = (3 * 3 * 50) / Math.sqrt(NA_VALENCE_ZEFF + 0.5); // n=3
const GLOBAL_SCALE = (CANVAS_SIZE * 0.43) / NA_RAW_OUTER_R;

export function TrendForceSimulator() {
  const [protons, setProtons] = useState(3);
  const [electrons, setElectrons] = useState(3);
  const [showForces, setShowForces] = useState(true);
  const [showShielding, setShowShielding] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shells = useMemo(() => getElectronShells(electrons), [electrons]);
  const n = shells.length;

  // Per-shell Zeff using Slater's rules:
  //   inner shells shield 0.85 each, same-shell electrons shield 0.35 each
  // Shell 1 → feels almost the full nucleus
  // Shell 2 → shielded by shell 1 electrons
  // Shell 3 → shielded by shells 1+2 combined, etc.
  const shellZeffs = useMemo(() => {
    return shells.map((count, sIdx) => {
      const innerCount = shells.slice(0, sIdx).reduce((a, b) => a + b, 0);
      const sameCount = count - 1; // other electrons in same shell (partial shielding)
      return Math.max(0.1, protons - innerCount * 0.85 - sameCount * 0.35);
    });
  }, [shells, protons]);

  // Valence-shell values used by the dashboard
  const innerElectrons = n > 1 ? electrons - shells[n - 1] : 0;
  const valenceZeff = shellZeffs[n - 1];
  const ie = (valenceZeff * 100) / (n * n);

  const charge = protons - electrons;
  // Flag configs that don't occur in real chemistry (charge < -3 is essentially unbound)
  const isExotic = charge < -3 || charge > 3 || (electrons > protons * 2 && protons < 5);

  // radiusZeff: floor scales with proton count (protons × 0.1) instead of a flat 0.1.
  // This ensures every added proton compresses the orbits, even for exotic configs
  // where total shielding exceeds the proton count.
  const shieldingForRadius = innerElectrons * 0.85 + (shells[n - 1] - 1) * 0.35;
  const radiusZeff = Math.max(protons * 0.1, protons - shieldingForRadius);

  // Always use GLOBAL_SCALE — no dynamic cap. The cap was causing every config
  // with rawR > Na's rawR (260px) to snap to the same canvas-fill size, making
  // proton/electron changes invisible for heavily-shielded atoms. Exotic configs
  // (many electrons, few protons) may clip at the canvas edge, which is fine
  // since they're already flagged as theoretical.
  const shellRadii = useMemo(() => {
    const rawR = (sn: number) => (sn * sn * 50) / Math.sqrt(radiusZeff + 0.5);
    return shells.map((_, i) => rawR(i + 1) * GLOBAL_SCALE);
  }, [shells, radiusZeff]);

  const visualRadius = shellRadii[n - 1];

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;

    // Typed non-null aliases — already null-checked above
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    let animId: number;
    let frame = 0;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    function drawArrow(
      fromX: number, fromY: number,
      toX: number, toY: number,
      color: string, lineWidth: number,
    ) {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const angle = Math.atan2(dy, dx);
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      const hl = 6;
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - Math.cos(angle - 0.45) * hl, toY - Math.sin(angle - 0.45) * hl);
      ctx.lineTo(toX - Math.cos(angle + 0.45) * hl, toY - Math.sin(angle + 0.45) * hl);
      ctx.fillStyle = color;
      ctx.fill();
    }

    function draw() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid
      ctx.strokeStyle = "rgba(114, 184, 114, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      // ─── Shielding clouds ─────────────────────────────────────────────────────
      // One gradient band per inter-shell gap. Each band's opacity reflects the
      // electrons in the shell just inside that gap. They stack, so the region
      // between shells 2 and 3 accumulates haze from both prior shells — exactly
      // what the physics says (shells 1+2 both shield shell 3).
      if (showShielding && n > 1) {
        for (let gap = 0; gap < n - 1; gap++) {
          const r1 = shellRadii[gap];
          const r2 = shellRadii[gap + 1];
          const electronsInThisShell = shells[gap];
          const opacity = Math.min(0.18, 0.04 + electronsInThisShell * 0.012);
          const grad = ctx.createRadialGradient(cx, cy, r1 * 0.85, cx, cy, r2);
          grad.addColorStop(0, `rgba(255, 140, 0, ${opacity})`);
          grad.addColorStop(1, `rgba(255, 140, 0, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ─── Shells and electrons ──────────────────────────────────────────────────
      shells.forEach((count, sIdx) => {
        const isValence = sIdx === n - 1;
        const shellR = shellRadii[sIdx];
        // Inner electrons that shield THIS shell (all shells below it)
        const innerCountForThisShell = shells.slice(0, sIdx).reduce((a, b) => a + b, 0);

        // Orbital ring
        ctx.beginPath();
        ctx.arc(cx, cy, shellR, 0, Math.PI * 2);
        ctx.strokeStyle = isValence ? "rgba(255,255,255,0.15)" : "rgba(255, 140, 0, 0.2)";
        ctx.setLineDash([4, 6]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Shell label
        ctx.fillStyle = isValence ? "rgba(255,255,255,0.35)" : "rgba(255,140,0,0.5)";
        ctx.font = "9px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`n=${sIdx + 1}`, cx + shellR + 4, cy);

        for (let i = 0; i < count; i++) {
          const speed = 0.009 / (sIdx + 1);
          const angle = (i / count) * Math.PI * 2 + frame * speed;
          const ex = cx + Math.cos(angle) * shellR;
          const ey = cy + Math.sin(angle) * shellR;

          if (showForces) {
            // Blue arrow: nuclear pull, strength = this shell's own Zeff
            // Inner shells feel nearly the full nucleus; outer shells feel much less
            const zs = shellZeffs[sIdx];
            const forceMag = Math.min(shellR * 0.55, zs * 5);
            const lw = Math.max(0.5, Math.min(4, zs / 4));
            drawArrow(
              ex, ey,
              ex - Math.cos(angle) * forceMag,
              ey - Math.sin(angle) * forceMag,
              "rgba(68, 153, 255, 0.9)", lw,
            );

            // Orange arrow: shielding push from the inner shell boundary outward
            // Drawn for every shell that has electrons below it (not just valence)
            // Length and thickness scale with how many inner electrons are pushing
            if (showShielding && sIdx > 0) {
              const innerBoundary = shellRadii[sIdx - 1];
              const pushLen = Math.min((shellR - innerBoundary) * 0.5, innerCountForThisShell * 2);
              const startR = innerBoundary + 6;
              drawArrow(
                cx + Math.cos(angle) * startR,
                cy + Math.sin(angle) * startR,
                cx + Math.cos(angle) * (startR + pushLen),
                cy + Math.sin(angle) * (startR + pushLen),
                "rgba(255, 140, 0, 0.85)",
                Math.max(0.5, Math.min(2.5, innerCountForThisShell / 5)),
              );
            }
          }

          // Electron dot — amber for inner shells, blue for valence
          const rgb = isValence ? "68, 153, 255" : "255, 140, 0";
          const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, 9);
          glow.addColorStop(0, `rgba(${rgb}, 0.85)`);
          glow.addColorStop(1, `rgba(${rgb}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(ex, ey, 9, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "white";
          ctx.beginPath(); ctx.arc(ex, ey, 3, 0, Math.PI * 2); ctx.fill();
        }
      });

      // ─── Nucleus ──────────────────────────────────────────────────────────────
      const nucR = 10 + Math.sqrt(protons) * 2;
      const nucGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, nucR * 2.5);
      nucGrad.addColorStop(0, "rgba(255, 85, 0, 0.55)");
      nucGrad.addColorStop(1, "rgba(255, 85, 0, 0)");
      ctx.fillStyle = nucGrad;
      ctx.beginPath(); ctx.arc(cx, cy, nucR * 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ff5500";
      ctx.beginPath(); ctx.arc(cx, cy, nucR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = `bold ${nucR > 16 ? 12 : 10}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${protons}+`, cx, cy);

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [protons, electrons, showForces, showShielding, shellZeffs, shells, shellRadii, n]);

  return (
    <div className="flex flex-col gap-6 bg-[var(--oc-green-bg-surface)] p-6 rounded-lg border border-[var(--oc-green-border-dim)] mb-12">
      <div className="flex flex-col lg:flex-row gap-8">

      {/* Simulation canvas */}
      <div className="flex-1 flex flex-col items-center">
        <p className="font-heading text-sm mb-4 self-start text-[var(--oc-green-dim)] tracking-widest">// FORCE MAP SIMULATOR</p>

        <div className="relative bg-[var(--oc-bg)] rounded border border-[var(--oc-green-border-faint)] overflow-hidden">
          <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="max-w-full h-auto" />

          {/* Charge badge + exotic warning */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <span
              className="px-2 py-0.5 text-xs font-heading border"
              style={{
                borderColor: charge === 0 ? "rgba(255,255,255,0.15)" : charge > 0 ? "rgba(68,153,255,0.5)" : "rgba(255,140,0,0.5)",
                color: charge === 0 ? "var(--oc-text-dim)" : charge > 0 ? "#60a5fa" : "#f97316",
                background: "var(--oc-bg)",
              }}
            >
              {charge === 0 ? "neutral" : charge > 0 ? `+${charge} ion` : `${charge} ion`}
            </span>
            {isExotic && (
              <span className="px-2 py-0.5 text-xs font-heading border border-yellow-600/50 text-yellow-400 bg-[var(--oc-bg)] max-w-[120px] text-right leading-tight">
                ⚠ theoretical — wouldn&apos;t exist in nature
              </span>
            )}
          </div>

          {/* Toggle buttons */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={() => setShowShielding(s => !s)}
              className="px-3 py-1 bg-[var(--oc-bg)] border text-xs font-heading transition-colors"
              style={{
                borderColor: showShielding ? "rgba(255,140,0,0.6)" : "var(--oc-green-border-dim)",
                color: showShielding ? "#f97316" : "var(--oc-text-dim)",
              }}
            >
              {showShielding ? "HIDE SHIELDING" : "SHOW SHIELDING"}
            </button>
            <button
              onClick={() => setShowForces(f => !f)}
              className="px-3 py-1 bg-[var(--oc-bg)] border text-xs font-heading transition-colors"
              style={{
                borderColor: showForces ? "rgba(68,153,255,0.6)" : "var(--oc-green-border-dim)",
                color: showForces ? "#60a5fa" : "var(--oc-text-dim)",
              }}
            >
              {showForces ? "HIDE FORCES" : "SHOW FORCES"}
            </button>
          </div>

          {/* Legend */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {showForces && (
              <div className="flex items-center gap-1.5">
                <svg width="20" height="8"><line x1="1" y1="4" x2="14" y2="4" stroke="#60a5fa" strokeWidth="1.5"/><polygon points="14,4 9,2 9,6" fill="#60a5fa"/></svg>
                <span className="text-xs text-blue-400 font-heading">nuclear pull (per-shell Zeff)</span>
              </div>
            )}
            {showForces && showShielding && n > 1 && (
              <div className="flex items-center gap-1.5">
                <svg width="20" height="8"><line x1="1" y1="4" x2="14" y2="4" stroke="#f97316" strokeWidth="1.5"/><polygon points="14,4 9,2 9,6" fill="#f97316"/></svg>
                <span className="text-xs text-orange-400 font-heading">shielding push (cumulative)</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-400 flex-shrink-0" />
              <span className="text-xs text-orange-300 font-heading">inner e⁻</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="text-xs text-blue-300 font-heading">valence e⁻</span>
            </div>
          </div>
        </div>

        {/* Proton / electron controls */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-heading text-[var(--oc-text-dim)]">PROTONS (Z)</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setProtons(p => Math.max(1, p - 1))} className="w-8 h-8 border border-[var(--oc-green-border-dim)] hover:border-[var(--oc-green)] hover:text-[var(--oc-green)] transition-colors font-bold">-</button>
              <span className="font-heading text-lg min-w-[2ch] text-center">{protons}</span>
              <button onClick={() => setProtons(p => Math.min(MAX_PROTONS, p + 1))} className="w-8 h-8 border border-[var(--oc-green-border-dim)] hover:border-[var(--oc-green)] hover:text-[var(--oc-green)] transition-colors font-bold">+</button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-heading text-[var(--oc-text-dim)]">ELECTRONS (e⁻)</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setElectrons(e => Math.max(1, e - 1))} className="w-8 h-8 border border-[var(--oc-green-border-dim)] hover:border-[var(--oc-green)] hover:text-[var(--oc-green)] transition-colors font-bold">-</button>
              <span className="font-heading text-lg min-w-[2ch] text-center">{electrons}</span>
              <button onClick={() => setElectrons(e => Math.min(MAX_PROTONS, e + 1))} className="w-8 h-8 border border-[var(--oc-green-border-dim)] hover:border-[var(--oc-green)] hover:text-[var(--oc-green)] transition-colors font-bold">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="w-full lg:w-72 flex flex-col gap-6">
        <div>
          <p className="font-heading text-xs mb-3 text-[var(--oc-green-dim)] tracking-widest">LIVE DATA</p>
          <div className="flex flex-col gap-4">

            {/* Per-shell Zeff breakdown */}
            <div className="p-3 bg-[var(--oc-bg)] border border-[var(--oc-green-border-faint)] rounded">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-heading text-[var(--oc-text-dim)]">ZEFF PER SHELL</span>
                <span className="text-xs font-heading text-[var(--oc-text-muted)]">Slater's rules</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {shellZeffs.map((zs, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-heading w-8 flex-shrink-0" style={{ color: i === n - 1 ? "#60a5fa" : "#f97316" }}>
                      n={i + 1}
                    </span>
                    <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${(zs / MAX_PROTONS) * 100}%`,
                          background: i === n - 1 ? "#3b82f6" : "#f97316",
                        }}
                      />
                    </div>
                    <span className="text-xs font-heading w-8 text-right" style={{ color: i === n - 1 ? "#60a5fa" : "#f97316" }}>
                      {zs.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shielding */}
            <div className="p-3 bg-[var(--oc-bg)] border border-[var(--oc-green-border-faint)] rounded">
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-heading text-[var(--oc-text-dim)]">VALENCE SHIELDING</span>
                <span className="font-heading text-orange-400">{(innerElectrons * 0.85).toFixed(2)}</span>
              </div>
              <div className="text-xs text-[var(--oc-text-muted)] mb-2">{innerElectrons} inner e⁻ × 0.85 each</div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${Math.min(100, (innerElectrons * 0.85 / MAX_PROTONS) * 100)}%` }} />
              </div>
            </div>

            {/* Radius */}
            <div className="p-3 bg-[var(--oc-bg)] border border-[var(--oc-green-border-faint)] rounded">
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-heading text-[var(--oc-text-dim)]">ATOMIC RADIUS</span>
                <span className="font-heading text-green-400">{visualRadius.toFixed(0)} pm</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${Math.min(100, (visualRadius / 200) * 100)}%` }} />
              </div>
            </div>

            {/* Ionization energy */}
            <div className="p-3 bg-[var(--oc-bg)] border border-[var(--oc-green-border-faint)] rounded">
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-heading text-[var(--oc-text-dim)]">IONIZATION ENERGY</span>
                <span className="font-heading text-pink-400">{ie.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${Math.min(100, ie)}%` }} />
              </div>
            </div>

          </div>
        </div>

        {/* Presets */}
        <div>
          <p className="font-heading text-xs mb-3 text-[var(--oc-green-dim)] tracking-widest">PRESETS</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                let p = 3;
                const interval = setInterval(() => {
                  setProtons(p); setElectrons(p); p++;
                  if (p > 10) clearInterval(interval);
                }, 600);
              }}
              className="text-left p-2 border border-[var(--oc-green-border-dim)] hover:border-[var(--oc-green)] hover:bg-[var(--oc-green-badge)] transition-all text-xs font-heading"
            >
              RUN PERIOD 2 (Li → Ne)
            </button>
            <button
              onClick={() => {
                const chain = [{ p: 3, e: 3 }, { p: 11, e: 11 }];
                let i = 0;
                const interval = setInterval(() => {
                  setProtons(chain[i].p); setElectrons(chain[i].e); i++;
                  if (i >= chain.length) clearInterval(interval);
                }, 1000);
              }}
              className="text-left p-2 border border-[var(--oc-green-border-dim)] hover:border-[var(--oc-green)] hover:bg-[var(--oc-green-badge)] transition-all text-xs font-heading"
            >
              RUN GROUP 1 (Li → Na)
            </button>
          </div>
        </div>

      </div>
    </div>

      {/* Full-width disclaimer footer */}
      <div className="flex flex-col gap-2 pt-4 border-t border-[var(--oc-green-border-faint)]">
        <p className="text-sm leading-relaxed text-[var(--oc-text-muted)] italic">
          * Each shell&apos;s Zeff uses Slater&apos;s rules: inner electrons shield ×0.85, same-shell ×0.35. Arrow thickness = Zeff strength. Shielding clouds stack across gaps.
        </p>
        <p className="text-sm leading-relaxed text-[var(--oc-text-muted)] italic">
          * The numbers shown for ionization energy, atomic radius, and Zeff are approximations derived from a simplified model — they are intended to illustrate the direction and relative size of each trend, not to represent real physical values.
        </p>
        <p className="text-sm leading-relaxed text-yellow-500/90 italic">
          ⚠ Theoretical model — many configurations shown here don&apos;t exist in nature. Highly ionized atoms (charge &gt; +3) or atoms with far more electrons than protons are not found in normal chemistry. Keep protons = electrons for real neutral atoms.
        </p>
      </div>
    </div>
  );
}
