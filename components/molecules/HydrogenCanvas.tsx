"use client";

import dynamic from "next/dynamic";

const HydrogenAtom = dynamic(
  () => import("@/components/molecules/HydrogenAtom").then((m) => m.HydrogenAtom),
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

export function HydrogenCanvas() {
  return <HydrogenAtom />;
}
