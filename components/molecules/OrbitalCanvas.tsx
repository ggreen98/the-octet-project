"use client";

import dynamic from "next/dynamic";

const ElectronOrbital = dynamic(
  () =>
    import("@/components/molecules/ElectronOrbital").then(
      (m) => m.ElectronOrbital
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <span
          className="font-terminal text-sm animate-blink"
          style={{ color: "#00ff41" }}
        >
          RENDERING...
        </span>
      </div>
    ),
  }
);

export function OrbitalCanvas() {
  return <ElectronOrbital />;
}
