"use client";

import dynamic from "next/dynamic";

const CaffeineMolecule = dynamic(
  () => import("@/components/molecules/CaffeineScene").then((m) => m.CaffeineMolecule),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <span className="font-terminal text-sm animate-blink" style={{ color: "#72b872" }}>
          RENDERING...
        </span>
      </div>
    ),
  }
);

export function CaffeineCanvas() {
  return <CaffeineMolecule />;
}
