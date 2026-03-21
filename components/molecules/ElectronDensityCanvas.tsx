"use client";

import dynamic from "next/dynamic";

const ElectronDensityAtom = dynamic(
  () => import("@/components/molecules/ElectronDensityAtom").then((m) => m.ElectronDensityAtom),
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

export function ElectronDensityCanvas() {
  return <ElectronDensityAtom />;
}
