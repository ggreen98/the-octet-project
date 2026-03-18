"use client";

import { useState } from "react";
import { CarbonCanvas } from "@/components/molecules/CarbonCanvas";
import { EthaneCanvas } from "@/components/molecules/EthaneCanvas";
import { Term } from "@/components/ui/Term";

// Each step halves the width. Starting width: 210mm (A4).
// Carbon atom diameter: ~154 pm = 1.54e-7 mm
// 210 / 2^n = 1.54e-7  →  n ≈ 30.4
const TOTAL_STEPS = 32;

interface Milestone {
  step: number;
  label: string;
  size: string;
  note: React.ReactNode;
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  molecule?: "ethane";
}

const MILESTONES: Milestone[] = [
  { step: 0,  label: "SHEET OF PAPER",   size: "210 mm",    note: "A standard A4 sheet. Rip it in half — you still have paper.",                                                                                                    image: "/milestones/paper.webp",         imageAlt: "Sheet of paper" },
  { step: 3,  label: "THUMBNAIL",        size: "26 mm",     note: "Now that we have split the paper in half 3 times it's about the width of your thumbnail — but it's still paper.",                                                                                                                   image: "/milestones/thumb_nail.webp",    imageAlt: "Human thumbnail" },
  { step: 6,  label: "SESAME SEED",      size: "3.3 mm",    note: "Roughly the size of a sesame seed. Still paper.",                                                                                                                   image: "/milestones/sesume_seed.webp",   imageAlt: "Sesame seeds" },
  { step: 9,  label: "HUMAN HAIR",       size: "0.41 mm",   note: "Thinner than a human hair. Invisible to the naked eye — but still paper.",                                                                                         image: "/milestones/human_hair.webp",    imageAlt: "Human hair under microscope" },
  { step: 12, label: "RED BLOOD CELL",   size: "51 μm",     note: "Only visible under a microscope. Still paper.",                                                                                                                    image: "/milestones/blood_cell.webp",    imageAlt: "Red blood cell" },
  { step: 15, label: "BACTERIUM",        size: "6.4 μm",    note: "Smaller than most bacteria. Still paper.",                                                                                                                         image: "/milestones/bacteria.webp",      imageAlt: "Bacterium" },
  { step: 18, label: "VIRUS",            size: "800 nm",    note: "Approaching virus scale. Hopefully we won't get sick! Still paper.",                                                                                                                            image: "/milestones/virus.webp",         imageAlt: "Virus particle" },
  { step: 21, label: "LARGE PROTEIN",    size: "100 nm",    note: "The scale of a large protein. These are important building blocks of cells in our bodies. Still paper.",                                                                                                              image: "/milestones/protien.webp",       imageAlt: "Protein molecule" },
  { step: 24, label: "DNA STRAND",       size: "12.5 nm",   note: "About the width of a DNA double helix — the tiny biological code that makes you you! Still paper.",                                                                                                              image: "/milestones/dna.webp",           imageAlt: "DNA double helix" },
  { step: 27, label: "ETHANE MOLECULE",  size: "1.6 nm",    note: <>We are nearing the smallest scale we can split whilst still having paper. At this scale we begin to see tiny bright spheres — <Term id="electron">electrons</Term> — moving impossibly fast, seemingly tethered to one another, surrounded by mostly empty space — with the occasional dense clump of vibrating particles at their centre — the <Term id="nucleus">nucleus</Term>. Still paper.</>, molecule: "ethane" },
  { step: 30, label: "CARBON ATOM",      size: "~154 pm",   note: <>We&apos;ve done it. We&apos;ve reached a single <Term id="atom">carbon atom</Term> — the smallest unit that is still paper. This is an <Term id="atom">atom</Term>: the smallest thing that can hold a recognisable identity. Split it further and it&apos;s no longer carbon, no longer paper — just loose parts with no chemical meaning. <Term id="atom">Atoms</Term> are the fundamental building blocks of nearly everything around us, from a sheet of paper to the very cells in our bodies, and understanding them is where chemistry begins. But what happens if we split the <Term id="atom">atom</Term> in half?</> },
  { step: 31, label: "NUCLEUS SPLIT",    size: "< ATOM",    note: <>We&apos;ve split the <Term id="atom">atom</Term>. What&apos;s left is no longer carbon, no longer paper — just loose parts with no chemical meaning. This is where the definition of things ends and the world of <Term id="subatomic-particle">subatomic particles</Term> begins. <Term id="atom">Atoms</Term> are made of three distinct <Term id="subatomic-particle">subatomic particles</Term>: <Term id="proton">protons</Term>, <Term id="neutron">neutrons</Term>, and <Term id="electron">electrons</Term>. <Term id="proton">Protons</Term> and <Term id="neutron">neutrons</Term> clump together to form the <Term id="nucleus">nucleus</Term> — the atom&apos;s dense centre — while <Term id="electron">electrons</Term> whizz around the outside in spherical clouds, as if tethered by an invisible string. It is the interactions and properties of these three building blocks that give each <Term id="atom">atom</Term> its properties.</> },
];

function getMilestone(step: number): Milestone | null {
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (step >= MILESTONES[i].step) return MILESTONES[i];
  }
  return MILESTONES[0];
}

function getActualSize(step: number): string {
  const mm = 210 / Math.pow(2, step);
  if (mm >= 1)        return `${mm.toFixed(1)} mm`;
  if (mm >= 0.001)    return `${(mm * 1000).toFixed(1)} μm`;
  if (mm >= 0.000001) return `${(mm * 1e6).toFixed(1)} nm`;
  return `${(mm * 1e9).toFixed(0)} pm`;
}

export function PaperHalving() {
  const [step, setStep] = useState(0);
  const [splitting, setSplitting] = useState(false);

  const milestone = getMilestone(step);
  const isAtom = step >= 30;
  const isSplit = step >= 31;
  const isDone = step >= TOTAL_STEPS;

  // Visual paper size — linear shrink so it's always visible
  const displaySize = Math.max(6, 240 * (1 - step / 34));

  function ripInHalf() {
    if (step >= TOTAL_STEPS || splitting) return;
    setSplitting(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setSplitting(false);
    }, 300);
  }

  function reset() {
    setStep(0);
    setSplitting(false);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

      {/* ── VISUAL ──────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-6 lg:w-[380px] shrink-0">

        {/* Counter bar — sits above stage, never covered */}
        <div
          className="w-full flex items-center justify-between px-3 py-1.5"
          style={{
            border: "1px solid var(--oc-green-border-dim)",
            borderBottom: "none",
            background: "var(--oc-green-bg-surface)",
          }}
        >
          <span className="text-sm tracking-widest" style={{ color: "var(--oc-green-dim)" }}>
            HALVINGS: {step} / 30
          </span>
          <span className="text-sm tracking-widest" style={{ color: "var(--oc-text-dim)" }}>
            {step === 0 ? "1×" : `${Math.pow(2, step).toLocaleString()}×`} ZOOM
          </span>
        </div>

        {/* Stage */}
        <div
          className="w-full flex items-center justify-center relative"
          style={{
            height: "340px",
            border: "1px solid var(--oc-green-border-dim)",
            background: "var(--oc-green-bg-surface)",
          }}
        >

          {isSplit ? (
            /* Nucleus split state */
            <div className="flex flex-col items-center gap-4 px-8 text-center">
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 h-5 rounded-full animate-pulse" style={{ background: "#ff4500", boxShadow: "0 0 12px #ff4500" }} />
                  <span className="text-xs" style={{ color: "rgba(255, 69, 0, 0.6)" }}>PROTON</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 h-5 rounded-full animate-pulse" style={{ background: "var(--oc-blue)", boxShadow: "0 0 12px #4499ff", animationDelay: "0.2s" }} />
                  <span className="text-xs" style={{ color: "rgba(68, 153, 255, 0.6)" }}>NEUTRON</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: "#a8d8ff", boxShadow: "0 0 8px #a8d8ff", animationDelay: "0.4s" }} />
                  <span className="text-xs" style={{ color: "rgba(168, 216, 255, 0.6)" }}>ELECTRON</span>
                </div>
              </div>
              <p className="font-heading text-xs" style={{ color: "var(--oc-text-faint)", letterSpacing: "0.08em" }}>
                NOT CARBON ANYMORE.
              </p>
            </div>
          ) : isAtom ? (
            /* Carbon atom model */
            <div className="w-full h-full relative">
              <CarbonCanvas />
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="font-heading text-xs" style={{ color: "rgba(255, 179, 0, 0.7)", letterSpacing: "0.1em" }}>
                  C — CARBON ATOM
                </span>
              </div>
            </div>
          ) : (
            /* Paper piece */
            <div
              style={{
                width: displaySize,
                height: displaySize * 1.414, // A4 ratio
                background: splitting
                  ? "rgba(220, 210, 185, 0.4)"
                  : "rgba(235, 225, 195, 0.85)",
                border: "1px solid rgba(200, 190, 160, 0.5)",
                boxShadow: step < 10
                  ? "0 4px 24px rgba(235, 225, 195, 0.15), inset 0 0 20px rgba(255,255,255,0.05)"
                  : "0 0 8px rgba(235, 225, 195, 0.1)",
                transition: "all 0.3s ease",
                transform: splitting ? "scaleX(0.5)" : "scaleX(1)",
                transformOrigin: "right center",
              }}
            />
          )}
        </div>

        {/* Size readout */}
        <div className="w-full flex items-center justify-between px-1">
          <span className="text-sm tracking-widest" style={{ color: "var(--oc-green-dim)" }}>ACTUAL SIZE</span>
          <span className="font-heading text-sm" style={{ color: "var(--oc-blue)" }}>
            {isSplit ? "SUBATOMIC" : getActualSize(step)}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={ripInHalf}
            disabled={isDone || splitting || isSplit}
            className="flex-1 font-heading text-xs py-3 transition-all duration-200"
            style={{
              background: isDone || isSplit ? "rgba(68, 153, 255, 0.1)" : "var(--oc-blue)",
              color: isDone || isSplit ? "rgba(68, 153, 255, 0.3)" : "var(--oc-btn-text)",
              letterSpacing: "0.12em",
              cursor: isDone || isSplit ? "not-allowed" : "pointer",
              border: "1px solid rgba(68, 153, 255, 0.3)",
            }}
          >
            {isAtom && !isSplit ? "SPLIT THE ATOM →" : isSplit ? "CANNOT SPLIT FURTHER" : "RIP IN HALF →"}
          </button>
          <button
            onClick={reset}
            className="font-heading text-xs px-4 py-3 transition-all duration-200"
            style={{
              background: "transparent",
              color: "var(--oc-green-dim)",
              letterSpacing: "0.12em",
              cursor: "pointer",
              border: "1px solid var(--oc-green-subtle)",
            }}
          >
            RESET
          </button>
        </div>
      </div>

      {/* ── INFO PANEL ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center">
        {milestone && (
          <div key={milestone.step} className="animate-fade-up" style={{ animationFillMode: "both" }}>
            <p className="text-xs tracking-widest mb-3" style={{ color: "var(--oc-green-dim)" }}>
              // SCALE REFERENCE
            </p>
            <h3
              className="font-heading text-xl md:text-2xl mb-4"
              style={{ color: isSplit ? "#ff4500" : isAtom ? "var(--oc-amber)" : "var(--oc-text)", letterSpacing: "0.04em" }}
            >
              {milestone.label}
            </h3>

            {/* Reference image */}
            {milestone.image && (
              <div className="mb-5">
                <div
                  className="overflow-hidden"
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    aspectRatio: "16/9",
                    border: "1px solid var(--oc-green-border)",
                    borderRadius: "8px",
                    background: "rgba(0,0,0,0.4)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 12px rgba(114,184,114,0.06)",
                  }}
                >
                  <img
                    src={milestone.image}
                    alt={milestone.imageAlt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.88, borderRadius: "8px" }}
                  />
                </div>
              </div>
            )}

            {/* 3D molecule */}
            {milestone.molecule === "ethane" && (
              <div
                className="mb-5"
                style={{
                  width: "100%",
                  maxWidth: "320px",
                  aspectRatio: "16/9",
                  border: "1px solid rgba(68, 153, 255, 0.2)",
                  borderRadius: "8px",
                  background: "rgba(0,0,0,0.4)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 0 12px rgba(68,153,255,0.08)",
                  overflow: "hidden",
                }}
              >
                <EthaneCanvas />
              </div>
            )}

            <p className="text-base leading-relaxed mb-6" style={{ color: "var(--oc-text-muted)" }}>
              {milestone.note}
            </p>

            {/* Scale bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs mb-2" style={{ color: "var(--oc-green-dim)", letterSpacing: "0.08em" }}>
                <span>PAPER</span>
                <span>ATOM</span>
              </div>
              <div className="h-px w-full relative" style={{ background: "var(--oc-green-border-dim)" }}>
                <div
                  className="h-px transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (step / 30) * 100)}%`,
                    background: isAtom ? "var(--oc-amber)" : "rgba(68, 153, 255, 0.6)",
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    left: `${Math.min(100, (step / 30) * 100)}%`,
                    background: isAtom ? "var(--oc-amber)" : "var(--oc-blue)",
                    transform: "translateX(-50%) translateY(-50%)",
                    boxShadow: isAtom ? "0 0 8px var(--oc-amber)" : "0 0 8px var(--oc-blue)",
                  }}
                />
              </div>
            </div>

            {/* Milestone list */}
            <div className="space-y-1.5">
              {MILESTONES.slice(0, -1).map((m) => (
                <div
                  key={m.step}
                  className="flex items-center justify-between text-sm"
                  style={{ opacity: step >= m.step ? 1 : 0.2, transition: "opacity 0.3s" }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: step >= m.step ? "var(--oc-green)" : "var(--oc-green-subtle)" }}
                    />
                    <span className="text-sm" style={{ color: step === m.step ? "var(--oc-text)" : "var(--oc-text-dim)", letterSpacing: "0.08em" }}>
                      {m.label}
                    </span>
                  </div>
                  <span className="text-sm" style={{ color: "var(--oc-text-dim)" }}>{m.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
