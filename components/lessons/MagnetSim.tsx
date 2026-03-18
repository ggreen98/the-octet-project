"use client";

import { useState } from "react";

type State = "attract" | "repel";
type SnapStage = "idle" | "rush" | "settle";

// Gap label is always 72px wide (kept stable so flex layout doesn't shift).
// Each magnet needs to travel half that distance to just touch end-to-end.
const ATTRACT_X = 36;
const REPEL_X = -18;
const GAP_WIDTH = 72; // px — must match gap label's rendered width

export function MagnetSim() {
  const [rightFlipped, setRightFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [snapStage, setSnapStage] = useState<SnapStage>("idle");
  const [impactGlow, setImpactGlow] = useState(false);

  const state: State = rightFlipped ? "attract" : "repel";
  const isAttract = state === "attract";
  const isSnapping = snapStage !== "idle";

  function flip() {
    if (animating) return;
    setAnimating(true);
    const goingToAttract = !rightFlipped;

    setTimeout(() => {
      setRightFlipped((f) => !f);

      if (goingToAttract) {
        // Rush past the touch point, then spring back to it
        setSnapStage("rush");

        setTimeout(() => {
          setSnapStage("settle");
          setImpactGlow(true);
        }, 120);

        setTimeout(() => {
          setImpactGlow(false);
        }, 400);

        setTimeout(() => {
          setSnapStage("idle");
          setAnimating(false);
        }, 440);
      } else {
        // Repel: just let the spring transition handle it
        setAnimating(false);
      }
    }, 180);
  }

  function getLeftTransform(): string {
    if (snapStage === "rush") return `translateX(${ATTRACT_X + 10}px)`;
    if (snapStage === "settle") return `translateX(${ATTRACT_X - 4}px)`;
    return isAttract ? `translateX(${ATTRACT_X}px)` : `translateX(${REPEL_X}px)`;
  }

  function getRightTranslate(): string {
    if (snapStage === "rush") return `translateX(${-(ATTRACT_X + 10)}px)`;
    if (snapStage === "settle") return `translateX(${-(ATTRACT_X - 4)}px)`;
    return isAttract ? `translateX(${-ATTRACT_X}px)` : `translateX(${-REPEL_X}px)`;
  }

  function getMagnetTransition(): string {
    if (snapStage === "rush") return "transform 0.12s cubic-bezier(0.2, 0, 0.4, 1)";
    if (snapStage === "settle") return "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)";
    // repel push: smooth spring
    return "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
  }

  const attractGlow = impactGlow
    ? "0 0 36px rgba(68,153,255,0.7)"
    : "0 0 16px rgba(68,153,255,0.25)";

  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-widest mb-6" style={{ color: "var(--oc-green-dim)" }}>
        // INTERACTIVE — CHARGE SIMULATION
      </p>

      {/* State label above stage */}
      <div
        className="font-heading text-xs mb-2 tracking-widest"
        style={{
          color: isAttract ? "rgba(68,153,255,0.8)" : "rgba(255,80,30,0.7)",
          letterSpacing: "0.15em",
          transition: "color 0.4s ease",
        }}
      >
        {isAttract ? "ATTRACT" : "REPEL"}
      </div>

      {/* Stage */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: "200px",
          border: "1px solid var(--oc-green-border-dim)",
          background: "var(--oc-green-bg-surface)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {/* Field lines — repel only */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: "60px",
                height: `${14 + i * 18}px`,
                border: "1px solid rgba(255,100,50,0.15)",
                borderRadius: "50%",
                opacity: isAttract ? 0 : 1,
                transition: "opacity 0.4s ease",
              }}
            />
          ))}
        </div>

        {/* Impact glow burst */}
        <div
          className="absolute z-20 pointer-events-none rounded-full"
          style={{
            width: "160px",
            height: "160px",
            background: "radial-gradient(circle, rgba(68,153,255,0.55) 0%, rgba(68,153,255,0) 70%)",
            opacity: impactGlow ? 1 : 0,
            transform: impactGlow ? "scale(1)" : "scale(0.2)",
            transition: impactGlow
              ? "opacity 0.04s ease, transform 0.06s ease"
              : "opacity 0.3s ease, transform 0.3s ease",
          }}
        />

        {/* Left magnet */}
        <div
          className="flex flex-col items-center z-10"
          style={{
            transform: getLeftTransform(),
            transition: getMagnetTransition(),
          }}
        >
          {/* Arrow above left magnet */}
          <div
            className="font-heading text-xs mb-1 transition-all duration-400"
            style={{
              color: isAttract ? "rgba(68,153,255,0.8)" : "rgba(255,80,30,0.7)",
              fontSize: "1rem",
              letterSpacing: "0.05em",
            }}
          >
            {isAttract ? "→" : "←"}
          </div>
          <div
            className="flex rounded overflow-hidden"
            style={{ boxShadow: isAttract ? attractGlow : "0 0 16px rgba(255,80,30,0.2)" }}
          >
            <div
              className="flex items-center justify-center font-heading text-sm"
              style={{ width: "72px", height: "52px", background: "rgba(80,80,120,0.6)", color: "rgba(180,215,255,0.7)", letterSpacing: "0.1em" }}
            >
              S
            </div>
            <div
              className="flex items-center justify-center font-heading text-sm"
              style={{ width: "72px", height: "52px", background: "rgba(180,60,40,0.6)", color: "rgba(255,160,130,0.9)", letterSpacing: "0.1em" }}
            >
              N
            </div>
          </div>
        </div>

        {/* Gap label — always 72px wide so flex layout stays stable */}
        <div
          className="z-10 font-heading text-xs"
          style={{
            color: "rgba(255,80,30,0.7)",
            letterSpacing: "0.08em",
            textAlign: "center",
            width: `${GAP_WIDTH}px`,
            flexShrink: 0,
            opacity: isAttract || isSnapping ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          REPEL
        </div>

        {/* Right magnet — outer div handles translateX only, inner handles rotateY */}
        <div
          className="flex flex-col items-center z-10"
          style={{
            transform: getRightTranslate(),
            transition: getMagnetTransition(),
          }}
        >
          {/* Arrow above right magnet — not affected by rotateY */}
          <div
            className="font-heading text-xs mb-1 transition-all duration-400"
            style={{
              color: isAttract ? "rgba(68,153,255,0.8)" : "rgba(255,80,30,0.7)",
              fontSize: "1rem",
              letterSpacing: "0.05em",
            }}
          >
            {isAttract ? "←" : "→"}
          </div>
          {/* Inner div handles the flip rotation only */}
          <div
            className="flex rounded overflow-hidden"
            style={{
              transform: rightFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: isAttract ? attractGlow : "0 0 16px rgba(255,80,30,0.2)",
            }}
          >
            <div
              className="flex items-center justify-center font-heading text-sm"
              style={{ width: "72px", height: "52px", background: "rgba(180,60,40,0.6)", color: "rgba(255,160,130,0.9)", letterSpacing: "0.1em" }}
            >
              N
            </div>
            <div
              className="flex items-center justify-center font-heading text-sm"
              style={{ width: "72px", height: "52px", background: "rgba(80,80,120,0.6)", color: "rgba(180,215,255,0.7)", letterSpacing: "0.1em" }}
            >
              S
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mt-4 mb-5">
        <p
          className="text-sm"
          style={{ color: isAttract ? "rgba(68,153,255,0.8)" : "rgba(255,80,30,0.8)" }}
        >
          {isAttract
            ? "Opposite charge poles facing — the magnets snap together."
            : "Same charged poles facing — the magnets push apart."}
        </p>
      </div>

      {/* Button */}
      <button
        onClick={flip}
        disabled={animating}
        className="font-heading text-xs px-6 py-3 transition-all duration-200"
        style={{
          border: "1px solid rgba(68,153,255,0.35)",
          color: "var(--oc-blue)",
          background: "transparent",
          letterSpacing: "0.15em",
          cursor: animating ? "not-allowed" : "pointer",
          opacity: animating ? 0.5 : 1,
        }}
      >
        FLIP RIGHT MAGNET
      </button>
    </div>
  );
}
