"use client";

import { useState } from "react";

type State = "attract" | "repel";

export function MagnetSim() {
  const [rightFlipped, setRightFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Left magnet: fixed, facing side is N (right end)
  // Right magnet: facing side is N by default → N|N = repel
  //               flipped → facing side is S → N|S = attract
  const state: State = rightFlipped ? "attract" : "repel";
  const isAttract = state === "attract";

  function flip() {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setRightFlipped((f) => !f);
      setAnimating(false);
    }, 180);
  }

  return (
    <div className="max-w-2xl">
      <p className="text-xs tracking-widest mb-6" style={{ color: "rgba(0, 255, 65, 0.45)" }}>
        // INTERACTIVE — CHARGE SIMULATION
      </p>

      {/* Stage */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: "200px",
          border: "1px solid rgba(0, 255, 65, 0.1)",
          background: "rgba(0, 255, 65, 0.015)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        {/* Field lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: isAttract ? "80px" : "60px",
                height: `${14 + i * 18}px`,
                border: `1px solid ${isAttract ? "rgba(68,153,255,0.15)" : "rgba(255,100,50,0.15)"}`,
                borderRadius: "50%",
                transition: "all 0.5s ease",
              }}
            />
          ))}
        </div>

        {/* Left magnet */}
        <div
          className="flex rounded overflow-hidden z-10"
          style={{
            transform: isAttract ? "translateX(18px)" : "translateX(-18px)",
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: isAttract
              ? "0 0 16px rgba(68,153,255,0.25)"
              : "0 0 16px rgba(255,80,30,0.2)",
          }}
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

        {/* Gap label */}
        <div
          className="z-10 font-heading text-xs mx-2 transition-all duration-500"
          style={{
            color: isAttract ? "rgba(68,153,255,0.7)" : "rgba(255,80,30,0.7)",
            letterSpacing: "0.08em",
            minWidth: "56px",
            textAlign: "center",
            fontSize: "0.6rem",
          }}
        >
          {isAttract ? "ATTRACT" : "REPEL"}
        </div>

        {/* Right magnet */}
        <div
          className="flex rounded overflow-hidden z-10"
          style={{
            transform: `${rightFlipped ? "rotateY(180deg)" : "rotateY(0deg)"} ${isAttract ? "translateX(-18px)" : "translateX(18px)"}`,
            transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: isAttract
              ? "0 0 16px rgba(68,153,255,0.25)"
              : "0 0 16px rgba(255,80,30,0.2)",
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

      {/* Status */}
      <div className="flex items-center justify-between mt-4 mb-5">
        <p
          className="text-sm"
          style={{ color: isAttract ? "rgba(68,153,255,0.8)" : "rgba(255,80,30,0.8)" }}
        >
          {isAttract
            ? "Opposite poles facing — the magnets snap together."
            : "Same poles facing — the magnets push apart."}
        </p>
      </div>

      {/* Button */}
      <button
        onClick={flip}
        disabled={animating}
        className="font-heading text-xs px-6 py-3 transition-all duration-200"
        style={{
          border: "1px solid rgba(68,153,255,0.35)",
          color: "#4499ff",
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
